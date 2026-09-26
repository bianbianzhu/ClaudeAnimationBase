"""Time known lyrics against a song: whisper transcribes with word timestamps, then each known line is matched to the
transcribed words (fuzzy, in order), so the text is always YOUR lyrics and only the timing comes from whisper.

    python tools/audio/lyrics.py assets/song.mp3 lyrics.txt --srt assets/song_lyrics.srt [--model large-v3]
        [--words out/audio/song_words.json] [--beats out/audio/song_beats.json] [--js src/scenes/<video>/lyrics.js]

lyrics.txt: one sung line per line. Blank lines and section labels ("Chorus", "Verse 2", "[Bridge]") are skipped.
--words caches the transcription (reruns skip whisper). --beats prints each line's start as bar.beat from beats.py's
JSON, which shows whether lines start on bar lines (and so which downbeat phase is right). --js writes the line and
word timings for the scenes (a singer's mouth, hits on words).
Prints every line with its time and match score; low scores (< .5) need a manual check.
"""
import argparse, json, os, re, difflib

ap = argparse.ArgumentParser()
ap.add_argument('audio'); ap.add_argument('lyrics')
ap.add_argument('--srt', default=None); ap.add_argument('--words', default=None); ap.add_argument('--beats', default=None)
ap.add_argument('--js', default=None, help='write LYRICS = { lines: [[start, end, text]], words: [[start, end]] } for the scenes (lip sync)')
ap.add_argument('--model', default='large-v3'); ap.add_argument('--lang', default='en')
ap.add_argument('--tail', type=float, default=.35, help='seconds a subtitle stays after the last word')
a = ap.parse_args()

SECTION = re.compile(r'^\[?\s*(intro|verse|pre-?chorus|chorus|final chorus|bridge|outro|hook|interlude)\b.*\]?$', re.I)
lines = [l.strip() for l in open(a.lyrics, encoding='utf-8') if l.strip() and not SECTION.match(l.strip())]
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower().replace('’', "'"))

MODEL = None
def transcribe(path, prompt, vad, t0=0.0, t1=None):
    """Words with absolute times. With t0/t1, only that window of the song is transcribed."""
    global MODEL
    from faster_whisper import WhisperModel
    import subprocess, tempfile
    MODEL = MODEL or WhisperModel(a.model, device='cpu', compute_type='int8')
    src = path
    if t1 is not None:
        src = tempfile.mktemp(suffix='.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(t0), '-to', str(t1), '-i', path, '-ac', '1', '-ar', '16000', src], check=True)
    segs, _ = MODEL.transcribe(src, language=a.lang, word_timestamps=True, vad_filter=vad, initial_prompt=prompt, condition_on_previous_text=False)
    segs = list(segs)   # transcription is lazy: run it before the window's wav is deleted
    if src != path: os.remove(src)
    out = []
    for s in segs:
        ws = [{'w': w.word.strip(), 's': round(w.start + t0, 3), 'e': round(w.end + t0, 3), 'p': round(w.probability, 3)} for w in s.words]
        # whisper pins a segment's first word to the segment start (often the end of the previous phrase or the window
        # edge); if it sits far before the next word, pull it to just before that word
        if len(ws) > 1 and ws[1]['s'] - ws[0]['s'] > 1.0: ws[0]['s'] = round(ws[1]['s'] - .45, 3)
        out += ws
        print(f'  {s.start + t0:7.2f}-{s.end + t0:7.2f}  {s.text.strip()}')
    return out

def align(words):
    """One global sequence match between the lyric tokens and the transcribed tokens; each line takes the time span of
    its matched tokens. A global match keeps repeated lines (choruses) in order. Returns [[start, end, line, score]]."""
    wt = [norm(w['w']) for w in words]
    sm = difflib.SequenceMatcher(None, [t for _, t in lt], wt, autojunk=False)
    hit = {}
    for blk in sm.get_matching_blocks():
        for j in range(blk.size): hit[blk.a + j] = blk.b + j
    # also accept near-miss tokens inside replace blocks of equal length (whisper spelling differences)
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op == 'replace' and a1 - a0 == b1 - b0:
            for j in range(a1 - a0):
                if difflib.SequenceMatcher(None, lt[a0 + j][1], wt[b0 + j]).ratio() > .6: hit[a0 + j] = b0 + j
    res = []
    for li, line in enumerate(lines):
        idx = [k for k, (l, _) in enumerate(lt) if l == li]; got = [hit[k] for k in idx if k in hit]
        res.append([words[min(got)]['s'], words[max(got)]['e'], line, len(got) / max(1, len(idx))] if got else [None, None, line, 0.0])
    return res

lt = [(li, norm(t)) for li, l in enumerate(lines) for t in l.split() if norm(t)]
if a.words and os.path.exists(a.words):
    words = json.load(open(a.words)); print(f'using cached transcription {a.words} ({len(words)} words)')
else:
    # pass 1: the whole song. The known lyrics as the prompt steer spelling; vad keeps whisper from hallucinating over
    # instrumental stretches, but it also drops quiet or reverb-heavy vocals, which pass 2 recovers.
    words = transcribe(a.audio, ' '.join(lines[:12]), True)
    # pass 2: every run of poorly matched lines gets its own window (from the last good line's end to the next good
    # line's start), transcribed without vad and prompted with just those lines; its words replace pass 1's there.
    res = align(words); i = 0
    while i < len(res):
        if res[i][3] >= .8: i += 1; continue
        j = i
        while j + 1 < len(res) and res[j + 1][3] < .8: j += 1
        w0 = next((r[1] for r in reversed(res[:i]) if r[3] >= .8), 0.0)
        w1 = next((r[0] for r in res[j + 1:] if r[3] >= .8), None)
        w1 = w1 if w1 is not None else words[-1]['e'] + 15
        print(f'pass 2: lines {i + 1}-{j + 1} in {max(0, w0 - .3):.2f}-{w1 + .3:.2f}s')
        new = transcribe(a.audio, ' '.join(lines[i:j + 1]), False, max(0.0, w0 - .3), w1 + .3)
        # replace only the words strictly between the good neighbours, so their first and last words survive
        words = [w for w in words if not (w0 < w['s'] < w1 - .05)] + [w for w in new if w0 - .05 < w['s'] < w1 - .05]
        words.sort(key=lambda w: w['s'])
        i = j + 1
    if a.words:
        os.makedirs(os.path.dirname(a.words), exist_ok=True); json.dump(words, open(a.words, 'w'), indent=0)

bmap = json.load(open(a.beats)) if a.beats else None
def barbeat(t):
    B = bmap['beats']; i = max(k for k in range(len(B)) if B[k] <= t) if t >= B[0] else 0
    fracb = (t - B[i]) / (B[i + 1] - B[i]) if i + 1 < len(B) else 0; rel = i - bmap['downbeat'] + fracb
    return f'bar {int(rel // 4):3d} beat {rel % 4 + 1:4.2f}'

out = align(words)
# lines whisper missed entirely: place them between their neighbours so nothing is silently dropped
for i, o in enumerate(out):
    if o[0] is None:
        prev = next((x[1] for x in reversed(out[:i]) if x[1] is not None), 0)
        nxt = next((x[0] for x in out[i + 1:] if x[0] is not None), prev + 4)
        o[0], o[1] = prev + .2, max(prev + .4, nxt - .2)
for i, (s, e, line, sc) in enumerate(out):
    flag = '' if sc >= .5 else '   <-- CHECK'
    print(f'{i + 1:3d}  {s:7.2f}-{e:7.2f}  {barbeat(s) if bmap else "":20s} score {sc:.2f}  {line}{flag}')

if a.srt:
    ts = lambda x: f'{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round(x % 1 * 1000)) % 1000:03d}'
    with open(a.srt, 'w', encoding='utf-8') as f:
        for i, (s, e, line, _) in enumerate(out):
            nxt = out[i + 1][0] if i + 1 < len(out) else e + 5
            f.write(f'{i + 1}\n{ts(s)} --> {ts(min(e + a.tail, nxt - .05))}\n{line}\n\n')
    print('wrote', a.srt)

if a.js:
    # words inside the lines' spans only (drops whisper's stray words over instrumentals), as [start, end]
    ws = [[w['s'], w['e']] for w in words if any(s0 - .05 <= w['s'] <= e0 + .05 for s0, e0, _, _ in out)]
    os.makedirs(os.path.dirname(a.js), exist_ok=True)
    with open(a.js, 'w', encoding='utf-8') as f:
        f.write(f'// lyric timing generated by tools/audio/lyrics.py from {os.path.basename(a.audio)}: sung lines and every sung word.\n')
        f.write('// For acting (a singer\'s mouth opens on the words). Never paint these words: subtitles are burned in afterwards.\n')
        f.write('const LYRICS = {\n  lines: [\n' + ''.join(f'    [{s0:.2f}, {e0:.2f}, {json.dumps(t0, ensure_ascii=False)}],\n' for s0, e0, t0, _ in out) + '  ],\n')
        f.write('  words: [' + ','.join(f'[{s0:.2f},{e0:.2f}]' for s0, e0 in ws) + '],\n};\n')
    print('wrote', a.js)
