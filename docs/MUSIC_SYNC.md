# Syncing a video to a song: beat map, bar lines and lyric subtitles

This is the audio side of a music video, step by step. It turns a song file and its lyrics into three things:

- **a beat map** (`PROJECT.beats`): every beat's time in seconds, plus which beat is the first bar line. The engine's `bpOf()`, `beatN()`, `pulse()` and the new `beatT()` / `barT()` follow it, so dances and cuts stay on the beat for the whole song.
- **a bar table**: loudness, bass and brightness per bar. Section changes (a break, a solo, a drop) stand out, so you can plan shots by bar.
- **a lyric SRT**: each sung line with its start and end time. You use it to plan which shot acts which line, and, only if the person asks for subtitles, to burn them into a copy of the finished video.

Doing it once for a new song takes one sitting: about 10 minutes of setup the first time, a minute for the beat map, and a few minutes per whisper pass for the lyrics.

Read [ANIMATION_GUIDE.md](../ANIMATION_GUIDE.md) first, especially "Music (optional)" and "Time and motion".

## Beat map or plain bpm?

- **Plain `PROJECT.bpm` + `offset`** is enough when the song has a fixed tempo (a click track, a loop-based track) and the video is short. Check it: a beat that lands at the start should still land at the end.
- **Use a beat map** when the song drifts. Generated songs (Suno) and live-feel recordings often do. The example song below slows from ~139.7 to ~135 bpm over 234 s. A constant grid that is right at the start is half a beat off by the middle.
- If in doubt, make the map. It costs a minute, and `bpOf()` falls back to the constant grid when there is no map.

---

## Setup

The tools are Python: [tools/audio/beats.py](../tools/audio/beats.py) (librosa) and [tools/audio/lyrics.py](../tools/audio/lyrics.py) (faster-whisper). Both also need `ffmpeg` on the PATH.

Use a virtualenv of your choice, **outside the repo**:

```bash
python3 -m venv ~/.venvs/audio
```

The organization blocks public PyPI, so install from the proxy index. Install the two packages **as separate commands and without `-q`**:

```bash
~/.venvs/audio/bin/pip install --index-url https://packagefeedproxy.microsoft.io/pypi/simple/ --progress-bar off --timeout 60 librosa
~/.venvs/audio/bin/pip install --index-url https://packagefeedproxy.microsoft.io/pypi/simple/ --progress-bar off --timeout 60 faster-whisper
```

- The wheels are large (ctranslate2, onnxruntime, av, numba/llvmlite). One combined quiet install printed nothing for 7+ minutes and looked hung. Separate, verbose installs show progress.
- macOS has no `timeout` command. Don't wrap installs in it.
- Versions that worked: Python 3.13, librosa 1.0.0, faster-whisper 1.2.1, ctranslate2 4.8.2, numpy 2.5.
- The first `lyrics.py` run downloads the whisper `large-v3` model (~3 GB) from Hugging Face into `~/.cache/huggingface/hub`. After that it's offline.
- On CPU (int8, M2 Pro) one full-song whisper pass takes several minutes. Pass 2 windows are shorter.

Below, `PY=~/.venvs/audio/bin/python`.

---

## Step 1: the beat map

```bash
$PY tools/audio/beats.py assets/song.mp3 --js src/scenes/<video>/beatmap.js --json out/audio/song_beats.json
# options: --bpm 138 (starting tempo, if it locks to half/double time), --phase 0..3 (force the downbeat), --smooth 8
```

What it does, in order (each step prints a line you can check):

1. **Separates the percussive part** (HPSS) and tracks beats on its onset envelope (`librosa.beat.beat_track`, tightness 300, `--bpm` as the starting tempo). On a swing track, plain onsets lock onto the swung off-beat eighths about half the time. The percussive part (ride, hat, brushes, bass attacks) is steadier.
2. **Smooths** the beat times with a sliding local line fit (±8 beats). This keeps slow tempo drift and removes tracker jitter.
3. **Extends** the map before the first and after the last tracked beat at the edge tempos, so `bpOf()` is defined over the whole song.
4. **Chooses the downbeat phase** (which beat of every 4 is "1"): chroma novelty (chord changes land on 1) plus 0.5 × low-end (< 200 Hz) onsets, each z-scored, averaged per phase mod 4. The highest score wins. `--phase` overrides it.
5. **Prints** the local tempo every 15 s and a per-bar table.
6. **Writes** `--js` (`PROJECT.beats = [...]; PROJECT.downbeat = <index>;`) and `--json` (beats, downbeat, phase scores, bars).

### Reading the output

```
duration 234.65s  tracker tempo 139.67 bpm  528 beats  0.604..229.889s
smoothing moved beats by median 4 ms, max 60 ms
extended with 2 beats before and 12 after (edge periods 0.4363s, 0.4443s)
local tempo:
     0s  139.67 bpm
   ...
   225s  135.05 bpm
downbeat phase scores (chord change + low end): [0.27, -0.34, 0.7, -0.64] -> phase 2
first downbeat: beat index 2 at 0.621s
bar    0     0.62s  loud ##############                 0.48  bass 0.51  bright 0.31
...
```

- **Smoothing:** a median of a few ms is normal jitter. A max of tens of ms is one sloppy beat. If the median is large (> 20 ms), the tracker is struggling: try `--bpm`.
- **Local tempo:** a slow, steady slide means drift, which is exactly what the map is for. A sudden jump to half or double means an octave error (see below).
- **Phase scores:** one clear winner is good. Two high scores two beats apart (here phases 0 and 2) are common, because many songs change chords on 1 and 3. Confirm with the lyrics (Step 2).
- **Bar table:** `loud`, `bass` and `bright` are relative to the loudest bar. A bar where `bass` drops to ~0.1–0.3 is a break (stop-time, a bridge, a breath before the outro). A long run of steady bars with no vocals is a solo. Write section starts down by bar number.

### Checking it

Don't trust the map until these three agree:

- **Residuals over time.** Fit one straight line (constant tempo) to the beat times and plot or print the residuals against time.
  - A smooth curve (here a parabola: +500 ms → −350 ms → +500 ms) means the tempo drifts. Use the beat map.
  - A sudden jump of about half a beat means the tracker flipped phase onto the off-beats. Rerun with `--bpm` near the true tempo; the percussive part helps.
  - Small, noisy residuals (5–10 ms) around the curve are fine.
- **Tempo octave.** Tempograms often show strong peaks at both the tempo and half of it (here 136 and ~69.8). Decide with the lyrics: sung lines usually come every 2 or 4 bars. Here lines came every ~2 bars at ~138 bpm, so the quarter note is 138, not 69.
- **Downbeat against the lyrics.** Run Step 2 with `--beats`. With the right phase, line starts cluster on beats 1–2 or on beat ~4.5–4.9 (a pickup into the next bar, or whisper timing a little early), with regular spacing. With the wrong phase they land mid-bar (beats 2.5–3.5). If so, rerun with `--phase`.

### Wiring it in

1. Load the beat map in `studio.html` **after `src/config.js` and before `src/core.js`** (core reads `PROJECT.beats` when it loads):

   ```html
   <script src="src/config.js"></script>
   <script src="src/scenes/<video>/beatmap.js"></script>
   <script src="src/core.js"></script>
   ```

2. In `src/config.js`, still set:
   - `bpm`: the song's **average** tempo. `BEAT = 60 / bpm` is still used as a typical beat length (e.g. the `disgusted` emotion's shudder).
   - `offset`: the first downbeat time printed by beats.py. It's the fallback when the map isn't loaded, and some emotes (the heart) add `OFF` to their age.
   - `duration`: the song length (or where your video ends).
   - `audio`: the song path, so `--clip` and `--encode` mux it in.

   ```js
   const PROJECT = { duration: 234.65, bpm: 138, offset: 0.621, audio: 'assets/where_can_you_be.mp3' };
   ```

3. Use bar times in `shots()` and for hits:

   ```js
   // barT(k): time of bar k's first beat. beatT(b): time of beat position b (fractions allowed).
   shots([[0, intro], [barT(7), verse1], [barT(37), preChorus], [barT(45), chorus1], [barT(60), solo], ...]);
   const hit = beatT(4 * 12 + 2);   // bar 12, beat 3
   ```

   - `bpOf(t)` interpolates between map beats (binary search) and extrapolates past both ends. Beat 0 is `PROJECT.downbeat`, so bar k starts at beat position 4k.
   - `beatT` is its exact inverse (round trip error ~1e-13 s). `barT(k) = beatT(4 * k)`.
   - Without a map they fall back to `(t - offset) / BEAT` and `offset + b * BEAT`.

---

## Step 2: lyric timing

Whisper gives the timing; the text is always **your** lyrics. You need the real lyrics (from the person or the song's page). Whisper alone mishears sung words.

### lyrics.txt

One sung line per line, in the order they are sung, repeats included. Blank lines and section labels are skipped: `Intro`, `Verse 2`, `Pre-Chorus`, `Chorus`, `Final Chorus`, `Bridge`, `Outro`, `Hook`, `Interlude`, with or without `[...]`.

```
Where can you be, my love?
I can’t reach you tonight.

Pre-Chorus
When I met you, I believed
...
```

### Command

```bash
$PY tools/audio/lyrics.py assets/song.mp3 assets/song_lyrics.txt \
    --words out/audio/song_words.json --beats out/audio/song_beats.json --srt assets/song_lyrics.srt
# options: --model large-v3, --lang en, --tail .35
```

- `--words` caches the whole transcription as JSON. Reruns load it and skip whisper, so they take a second. Delete the file to force a fresh transcription.
- `--beats` is the JSON from Step 1. Each line's start is printed as `bar N beat B`.
- `--srt` writes the subtitle file. Leave it out while you are only checking.

### How it works

- **Pass 1:** faster-whisper `large-v3` on CPU (int8) over the whole song, with word timestamps, `vad_filter=True`, the first 12 lyric lines as `initial_prompt` (steers spelling), and `condition_on_previous_text=False` (stops one misheard line poisoning the next).
- **Alignment:** one global `difflib.SequenceMatcher` between the normalized lyric tokens and the transcribed tokens. A global match keeps repeated choruses in order. Near-miss tokens inside equal-length replace blocks also count (similarity > .6), which absorbs whisper's spelling differences. Each line gets the time span of its matched words. **Score** = matched tokens / line tokens.
- **Pass 2:** every run of lines scoring < .8 is transcribed again in its own window, from the previous good line's end to the next good line's start (±0.3 s), with VAD **off** and only those lines as the prompt. Only words strictly between the good neighbours are replaced, so the neighbours keep their first and last words.
- **First-word fix:** whisper pins a segment's first word to the segment start, which is often the end of the previous phrase or the window edge. If that word starts more than 1 s before the next word, it is moved to 0.45 s before the next word.
- **SRT end** = last word's end + `--tail` (0.35 s), capped at the next line's start − 0.05 s.
- **Missing lines** (no matched word at all) are placed between their neighbours, so nothing is silently dropped. They score 0.

### Reading the output

```
  1    12.25-  16.12  bar   6 beat 3.91    score 1.00  Where can you be, my love?
 ...
 26   151.38- 153.62  bar  87 beat 1.21    score 0.60  Don’t disappear without a word.
```

- **Score 1.00:** every word matched. Timing is whisper's, good to about ±0.3 s in singing.
- **Score .5–.8:** most words matched; the span is usually right. Glance at it.
- **Score < .5** is marked `<-- CHECK`. Listen and fix it by hand.
- **Big gaps** between lines should match instrumental stretches in the bar table. A gap where you know there are vocals means whisper missed them.
- Pass 2 prints `pass 2: lines i-j in a-b s` and the segments it found. If a whole verse is missing after pass 2, the window may be wrong: check the neighbouring lines' times.

### Fixing a line by hand

Edit the SRT directly. It's plain text:

```
26
00:02:31,380 --> 00:02:33,620
Don’t disappear without a word.
```

- Find the real start by listening: `ffplay -ss 150 -t 5 -autoexit assets/song.mp3`, or scrub the song in any player.
- Keep the numbering and the blank line between entries. Don't let a line end after the next one starts.
- A hand fix is lost if you rerun with `--srt`. Rerun first, fix last.
- Don't snap subtitles to the beat grid. Sung words don't start exactly on beats, and ±0.3 s reads fine as a subtitle.

---

## Step 3: burning in subtitles (only when asked)

The painted frame stays text-free ("Lyrics are not text" in the guide). Subtitles are added by ffmpeg **after** rendering, into a **copy** of the video. Always keep the clean render.

### Check ffmpeg has libass

The `ass` and `subtitles` filters need libass:

```bash
ffmpeg -hide_banner -filters | grep -E " (ass|subtitles) "
#  .. ass               V->V       Render ASS subtitles onto input video using the libass library.
#  .. subtitles         V->V       Render text subtitles onto input video using the libass library.
```

Homebrew's `ffmpeg` (8.0.1 here, `--enable-libass`) has both. If the lines are missing, install an ffmpeg built with libass (`brew install ffmpeg`). On macOS libass finds fonts through CoreText (the log says `Using font provider coretext`).

### Convert the SRT to a styled ASS

`tools/audio/srt2ass.py` does this with the style below as options (font, size, text and edge colours as plain hex,
margin, fade), e.g. for the jazz video: `python3 tools/audio/srt2ass.py assets/where_can_you_be_lyrics.srt out/wcyb_lyrics.ass --font Futura --size 54 --text '#F1E4C8' --edge '#1E1A1F'`.
The inline version, for reference:

An SRT has no style, and libass renders it at a tiny default resolution. Convert it to ASS with a style at the video's resolution (PlayResX 1920 / PlayResY 1080), bottom centre, soft outline and shadow, and a fade on every line (`{\fad(280,350)}`: 280 ms in, 350 ms out). This is the style used for the earlier `out/echoes_lyrics.ass`:

```bash
python3 - assets/song_lyrics.srt out/song_lyrics.ass <<'EOF'
import re, sys
src, dst = sys.argv[1], sys.argv[2]
HEAD = r"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Lyric,Noteworthy,58,&H00E2F5FF,&H00E2F5FF,&H0033222B,&H8033222B,-1,0,0,0,100,100,1,0,1,3.2,2.5,2,120,120,54,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
def sec(s):
    h, m, r = s.strip().replace(',', '.').split(':'); return int(h) * 3600 + int(m) * 60 + float(r)
def ass(x):
    c = round(x * 100); return f'{c // 360000}:{c // 6000 % 60:02d}:{c // 100 % 60:02d}.{c % 100:02d}'
out = [HEAD]
for blk in re.split(r'\n\s*\n', open(src, encoding='utf-8').read().strip()):
    L = blk.strip().splitlines()
    a, b = L[1].split('-->')
    out.append(f'Dialogue: 0,{ass(sec(a))},{ass(sec(b))},Lyric,,0,0,0,,{{\\fad(280,350)}}' + r'\N'.join(L[2:]) + '\n')
open(dst, 'w', encoding='utf-8').write(''.join(out))
print('wrote', dst, len(out) - 1, 'lines')
EOF
```

The style line, field by field:

- `Noteworthy`, 58 px, bold: a soft handwritten macOS system font that suits the painted look. Any installed font works.
- Colours are `&HAABBGGRR` (alpha, blue, green, red). `&H00E2F5FF` is cream `#FFF5E2` text; `&H0033222B` is a dark plum `#2B2233` outline; `&H8033222B` is the same plum at half opacity for the shadow. Match them to the video's palette (`PAL.cream`, `PAL.ink` or the darkest background colour).
- `BorderStyle 1`, `Outline 3.2`, `Shadow 2.5`: a soft outline plus drop shadow, readable on light and dark shots without a box.
- `Alignment 2`: bottom centre. `MarginL/R 120`, `MarginV 54`: kept off the frame edges.

### Burn it

This exact command was verified (Homebrew ffmpeg 8.0.1, macOS):

```bash
ffmpeg -y -i out/video.mp4 -vf "ass=out/song_lyrics.ass" \
    -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a copy -movflags +faststart out/video_lyrics.mp4
```

- The ASS times are **song** times, so burn onto a render that starts at song time 0 (a full `--clip` or `--encode`).
- For a partial render that starts at song time A (e.g. `--clip --range=10:30`), shift the video's clock for the filter and back. Also verified:

  ```bash
  ffmpeg -y -i out/clip.mp4 -vf "setpts=PTS+10/TB,ass=out/song_lyrics.ass,setpts=PTS-STARTPTS" \
      -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a copy out/clip_lyrics.mp4
  ```

- The video is re-encoded (a filter can't be stream-copied); the audio is copied untouched. `-crf 17 -preset slow` matches `render.mjs --encode`.
- Keep `,` `:` and `'` out of the ASS path, or escape them: they are filter syntax.
- A plain SRT also works (`-vf "subtitles=assets/song_lyrics.srt:force_style='Fontname=Noteworthy,Fontsize=22'"`, verified), but it has no fades, its sizes are in libass's 384×288 default units, and its default colours are pure white on a black outline, which clashes with the palette. Prefer the ASS.

### Look at it

Grab frames and look at them: one mid-line, one in a fade, one in a gap between lines.

```bash
ffmpeg -y -ss 14 -i out/video_lyrics.mp4 -frames:v 1 out/check/sub_14.png
```

Check that the text is readable on the brightest and darkest shots, that it doesn't cover a face or the focal action (raise `MarginV` or move a shot's staging if it does), and that the first and last lines appear at all.

---

## Pitfalls and lessons

- **Installs:** use the proxy index, separate installs, no `-q`, `--progress-bar off --timeout 60`. A combined quiet install looked hung for 7+ minutes. macOS has no `timeout`.
- **Model download:** the first whisper run fetches ~3 GB. CPU passes take minutes. Always pass `--words` so you only pay once.
- **librosa's default tracker on the full mix lies quietly.** It said 136 bpm, but a constant grid at that tempo had a median error of 104 ms and a max of 238 ms. A naive onset-envelope grid search was no better: its local phase jumped ±130 ms (swung off-beat eighths compete with the beat), and the best bpm sat on the edge of the search range. Both are warning signs.
- **Look at residuals over time, not one error number.** Tracking on the HPSS percussive part and fitting one line showed a smooth parabolic residual (+500 → −350 → +480 ms) with only 5–10 ms of local noise: the tempo drifts ~139.7 → ~135 bpm. Smooth curve = drift (use a beat map). A jump of ~half a beat = phase flip (use `--bpm`, the percussive part).
- **Hop size quantizes tempo.** At hop 512 (22050 Hz) beat intervals come out as 0.418 / 0.441 / 0.464 s, steps of ~23 ms (~7 bpm at this tempo). Use hop 256 or smaller for tempo work. beats.py uses 256 and smooths.
- **Tempo octave:** the tempogram had strong peaks at 136 and ~69.8. The lyric phrase length (a line every ~2 bars at ~138) settled it.
- **Downbeat phase:** phases 0 and 2 both score "strong" when chords change on 1 and 3. Confirm with where lyric lines start.
- **VAD drops vocals.** Pass 1 with VAD merged 100–140 s into one 40 s segment around a 16-bar instrumental solo (104–133 s) and missed verse 2 entirely. Windowed pass 2 without VAD, prompted with the missing lines, recovered every line with plausible timings.
- **Window edges eat neighbours.** An early pass 2 replaced every word inside the window, which included the ±0.3 s margins, and deleted the first/last words of the good lines next to it ("Nothing feels the same" vanished). Now only words strictly between the good neighbours are replaced. If a good line suddenly scores lower after pass 2, suspect this.
- **Whisper pins the first word of a segment to the segment start,** sometimes seconds early. lyrics.py pulls it to just before the next word when the gap is > 1 s.
- **Whisper word times in singing are ±0.3 s.** Fine for subtitles and shot planning. Don't hand-place subtitles on the beat grid.
- **Pass 2 writes each window to a temporary WAV** in the system temp directory (Python's `tempfile`) and deletes it once the window is transcribed. faster-whisper's `transcribe()` is lazy, so the segments must be consumed (`list(segs)`) before the file is removed.
- **Never paint lyrics into the frame.** Subtitles are an ffmpeg step on a copy, and only when the person asks for them.

---

## Worked example: "Where Can You Be"

`assets/where_can_you_be.mp3`, a Suno jazz song with drifting tempo. Files: `src/scenes/jazz/beatmap.js`, `out/audio/wcyb_beats.json`, `out/audio/wcyb_words.json` (cached transcription), `assets/where_can_you_be_lyrics.txt`, `assets/where_can_you_be_lyrics.srt`.

Re-derive the numbers in seconds (cached, no whisper):

```bash
$PY tools/audio/lyrics.py assets/where_can_you_be.mp3 assets/where_can_you_be_lyrics.txt \
    --words out/audio/wcyb_words.json --beats out/audio/wcyb_beats.json
```

- Duration 234.65 s. First downbeat 0.621 s (beat index 2, phase 2). Average tempo ~138 bpm (137.9), drifting from 139.7 at the start to 135.1 at the end.
- Bar k starts at `barT(k)`; one bar is ~1.72–1.78 s.
- Phase scores `[0.27, -0.34, 0.70, -0.64]`. With phase 2, most line starts land on beats 1–2 or at beat ~4.4–4.9 (pickups), about every 2 bars in the pre-chorus and choruses; a few fall on beat 3. With phase 0 most would sit mid-bar.
- All 42 lines matched after pass 2. Lowest scores: line 26 (.60), lines 19, 28 and 29 (.83). None needed a hand fix.

| section | lyric lines | bars | time (s) |
|---|---|---|---|
| intro | – | 0–6 | 0.62–12.72 (vocal pickup at 12.25, bar 6 beat 3.9) |
| verse 1 | 1–8 | 7–36 | 12.25–62.6 |
| pre-chorus | 9–12 | 37–44 | 64.2–78.0 |
| chorus 1 | 13–20 | 45–59 | 78.0–104.0 |
| instrumental solo (16 bars) | – | 60–75 | 104.14–132.03 |
| verse 2 | 21–28 | 77–93 (pickup in 76) | 133.7–161.0 |
| bridge | 29–32 | 94–100 | 164.0–175.6 |
| final chorus | 33–40 | 101–117 | 175.6–205.5 |
| outro | 41–42 | 118–125 | 208.1–219.6 |
| instrumental tag | – | 126–131 | 219.7–230.3 |
| fade | – | 132–133 | 230.3–234.65 |

Bar table landmarks (low `bass` = a break; good places for a held pose, a quiet shot or a cut):

- bar 7 (12.7 s, bass .11): the vocal entry.
- bar 59 (102.4 s, bass .15): end of chorus 1, the breath before the solo.
- bars 94–99 (163.5–174.1 s, bass .13–.33, brightest bar of the song at 94): the bridge.
- bars 116–117 (202.1–205.6 s, bass .17 and .02): the stop at the end of the final chorus, before the outro.
- bar 121 (210.9 s, bass .22) and bar 125 (218.0 s, bass .10): gaps in the outro, after each outro line.
- bars 126–131 (219.7–230.3 s, bass .85–1.0): the loudest, bass-heaviest stretch, a full-band tag. Then the fade.

---

## Checklist

1. [ ] venv outside the repo; librosa and faster-whisper installed separately from the proxy index.
2. [ ] `beats.py` run: smoothing median a few ms; local tempo slides smoothly (no octave jumps); phase scores written down.
3. [ ] Residuals checked: smooth curve (drift, map needed) vs half-beat jump (phase flip, rerun with `--bpm`).
4. [ ] Tempo octave confirmed with lyric phrase lengths.
5. [ ] `lyrics.txt` written: one sung line per line, repeats included, labels allowed.
6. [ ] `lyrics.py --words --beats` run; every line has a time; no `<-- CHECK` left unexplained; gaps match instrumental bars.
7. [ ] Downbeat confirmed: line starts on beats 1–2 or ~4.5–4.9 pickups, regularly spaced. Otherwise rerun beats.py with `--phase`.
8. [ ] `beatmap.js` loaded in `studio.html` between `src/config.js` and `src/core.js`; `PROJECT.bpm` = average tempo, `offset` = first downbeat, `duration`, `audio` set.
9. [ ] Shots start on `barT(k)`; hits on `beatT(b)`; sections follow the bar table; the painted frame has no lyrics.
10. [ ] If subtitles were asked for: SRT written last (after any rerun), hand fixes applied, converted to ASS, burned into a copy with `ass=`, frames checked. The clean render is kept.
