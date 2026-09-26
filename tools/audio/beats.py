"""Beat map for a song: every beat's time, which beats are downbeats, and a per-bar energy map for planning shots.

    python tools/audio/beats.py assets/song.mp3 --js src/scenes/<video>/beatmap.js [--json out/audio/song_beats.json]
        [--bpm 136] [--phase 0..3]

Why a beat map and not just PROJECT.bpm: generated songs (Suno) and live-feel recordings drift. A single bpm + offset
that is right at the start can be half a beat off by the end. The map lets the engine's bpOf() follow the real beats.

Method (each step is printed so it can be checked):
  1. Separate the percussive part (HPSS) and track beats on its onset envelope. Plain onsets on a swing track lock onto
     the swung off-beat eighths half the time; the percussive part (ride, hat, brushes, walking bass attacks) is steadier.
  2. Smooth the beat times with a sliding local line fit, which keeps slow tempo drift and removes tracker jitter.
  3. Choose the downbeat phase (which beat of each 4 is "1") from chord changes (chroma novelty lands on 1) plus
     low-end onsets (kick / bass). Override with --phase if the lyrics or your ears say otherwise.
  4. Print local tempo every 15 s and a per-bar loudness / bass / brightness table (section changes stand out).
"""
import argparse, json, os
import numpy as np
import librosa

ap = argparse.ArgumentParser()
ap.add_argument('audio')
ap.add_argument('--bpm', type=float, default=None, help='starting tempo for the tracker (use if it picks half/double time)')
ap.add_argument('--phase', type=int, default=None, help='force the downbeat phase (0..3, as printed)')
ap.add_argument('--smooth', type=int, default=8, help='half-width of the smoothing window, in beats')
ap.add_argument('--js', default=None, help='write PROJECT.beats / PROJECT.downbeat to this JS file')
ap.add_argument('--json', default=None)
a = ap.parse_args()

sr, hop = 22050, 256
y, _ = librosa.load(a.audio, sr=sr, mono=True)
dur = len(y) / sr
_, yp = librosa.effects.hpss(y, margin=2.0)
oe = librosa.onset.onset_strength(y=yp, sr=sr, hop_length=hop)
tempo, b = librosa.beat.beat_track(onset_envelope=oe, sr=sr, hop_length=hop, start_bpm=a.bpm or 120, tightness=300)
raw = librosa.frames_to_time(b, sr=sr, hop_length=hop)
print(f'duration {dur:.2f}s  tracker tempo {float(np.atleast_1d(tempo)[0]):.2f} bpm  {len(raw)} beats  {raw[0]:.3f}..{raw[-1]:.3f}s')

# 2. smooth: local line fit over +-smooth beats
k = np.arange(len(raw)); bt = raw.copy(); h = a.smooth
for i in range(len(raw)):
    s, e = max(0, i - h), min(len(raw), i + h + 1)
    P, t0 = np.polyfit(k[s:e], raw[s:e], 1); bt[i] = t0 + P * i
jit = (raw - bt) * 1000
print(f'smoothing moved beats by median {np.median(np.abs(jit)):.0f} ms, max {np.max(np.abs(jit)):.0f} ms')
# extend the map to cover the whole song at the edge tempos, so bpOf() is defined everywhere
P0, P1 = np.median(np.diff(bt[:9])), np.median(np.diff(bt[-9:]))
pre = []; t = bt[0] - P0
while t > -P0: pre.insert(0, t); t -= P0
post = []; t = bt[-1] + P1
while t < dur + 2 * P1: post.append(t); t += P1
beats = np.concatenate([pre, bt, post]); n_pre = len(pre)
print(f'extended with {len(pre)} beats before and {len(post)} after (edge periods {P0:.4f}s, {P1:.4f}s)')

print('local tempo:')
for s in range(0, int(dur), 15):
    m = (beats >= s) & (beats < s + 15)
    if m.sum() > 3: print(f'  {s:4d}s  {60 / np.median(np.diff(beats[m])):6.2f} bpm')

# 3. downbeat phase
S = np.abs(librosa.stft(y, hop_length=hop)); freqs = librosa.fft_frequencies(sr=sr)
low = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[freqs < 200]), sr=sr, hop_length=hop)
chroma = librosa.feature.chroma_cqt(y=librosa.effects.harmonic(y), sr=sr, hop_length=hop)
fr = lambda t: int(np.clip(librosa.time_to_frames(t, sr=sr, hop_length=hop), 0, chroma.shape[1] - 1))
nov, lo = np.zeros(len(beats)), np.zeros(len(beats))
for i in range(1, len(beats) - 1):
    if not (fr(beats[i - 1]) < fr(beats[i]) < fr(beats[i + 1])): continue   # beats off the ends of the audio
    c0 = chroma[:, fr(beats[i - 1]):fr(beats[i])].mean(1); c1 = chroma[:, fr(beats[i]):fr(beats[i + 1])].mean(1)
    nov[i] = np.linalg.norm(c1 / (np.linalg.norm(c1) + 1e-9) - c0 / (np.linalg.norm(c0) + 1e-9))
    lo[i] = low[max(0, fr(beats[i]) - 2):fr(beats[i]) + 3].max()
live = (beats > 3) & (beats < dur - 3)
zs = lambda v: (v - v[live].mean()) / (v[live].std() + 1e-9)
score = zs(nov) + .5 * zs(lo)
ph_scores = [float(score[live & (np.arange(len(beats)) % 4 == p)].mean()) for p in range(4)]
ph = a.phase if a.phase is not None else int(np.argmax(ph_scores))
print(f'downbeat phase scores (chord change + low end): {np.round(ph_scores, 2).tolist()} -> phase {ph}' + (' (forced)' if a.phase is not None else ''))
first_down = next(i for i in range(len(beats)) if i % 4 == ph and beats[i] >= 0)
print(f'first downbeat: beat index {first_down} at {beats[first_down]:.3f}s')

# 4. per-bar table
rms = librosa.feature.rms(y=y, hop_length=hop)[0]; cent = librosa.feature.spectral_centroid(S=S, sr=sr)[0]; bass = S[freqs < 150].sum(0)
tf = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
bars = []
for bi, i in enumerate(range(first_down, len(beats) - 4, 4)):
    s, e = beats[i], beats[i + 4]; m = (tf >= s) & (tf < min(e, dur))
    if not m.any(): break
    bars.append({'bar': bi, 't': round(float(s), 3), 'end': round(float(e), 3), 'rms': float(rms[m].mean()), 'bass': float(bass[m].mean()), 'cent': float(cent[m].mean())})
mx = {q: max(x[q] for x in bars) for q in ('rms', 'bass', 'cent')}
for x in bars:
    r = x['rms'] / mx['rms']
    print(f"bar {x['bar']:4d}  {x['t']:7.2f}s  loud {'#' * int(r * 30):30s} {r:.2f}  bass {x['bass'] / mx['bass']:.2f}  bright {x['cent'] / mx['cent']:.2f}")

if a.js:
    os.makedirs(os.path.dirname(a.js), exist_ok=True)
    with open(a.js, 'w') as f:
        f.write(f'// beat map generated by tools/audio/beats.py from {os.path.basename(a.audio)}: every beat time in seconds.\n')
        f.write('// PROJECT.beats makes bpOf() follow the real (drifting) beats; beat index PROJECT.downbeat is the first bar line.\n')
        f.write(f'PROJECT.beats = [{",".join(f"{t:.3f}" for t in beats)}];\nPROJECT.downbeat = {first_down};\n')
    print('wrote', a.js)
if a.json:
    os.makedirs(os.path.dirname(a.json), exist_ok=True)
    json.dump({'duration': dur, 'beats': [round(float(t), 3) for t in beats], 'downbeat': first_down, 'phase_scores': ph_scores, 'bars': bars}, open(a.json, 'w'), indent=1)
    print('wrote', a.json)
