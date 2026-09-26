# How "Where Can You Be" was made

A production record for the Clawd jazz MV (`STORYBOARD_jazz.md`, `src/scenes/jazz/`): the stages it went through, how
five sections were built in parallel, what review kept finding, the gaps in the shared library that section builders
worked around, and the commands to rebuild the video. Read it before making a sequel, re-cutting a section or changing
a character.

## Stages
1. **Measure the song** (docs/MUSIC_SYNC.md): the beat map (the tempo drifts ~139.7 → 135 bpm), the first downbeat,
   lyric timing with two whisper passes, the solo's pitch contour, and the instruments by ear (asked of the person:
   the tools can't tell a sax from a piano).
2. **Storyboard** (`STORYBOARD_jazz.md`), approved by the person before any scene code.
3. **Look and cast**: palette, printed blocks, halftone, the sound shapes, six costumed players and their instruments,
   judged on model sheets (`LOOPS.jazzcast`, `jazzbig`, `jazzshapes`, `singerlooks` in `src/scenes/jazz/sheets.js`).
4. **The opening built and reviewed first** (`a_intro.js`, 0–11.9 s), to set the quality bar and the idioms for
   everyone else.
5. **Five sections in parallel**, one builder (subagent) each, in its own file, to the brief below and fixed seams.
6. **Director's review** of every section's contact sheet and seam strips, one or two revision rounds each.
7. **Render** (frames in parallel, resumable), encode with the song, burn in subtitles, check the loop frame.
8. **A late costume change** (the singer's top hat and dinner jacket), proven to touch only the singer with a
   before/after frame diff.

## Parallel sections
- **One file per section, one builder per file.** Builders edit only their own file, wrap it in an IIFE and register
  shots with `shots()`; the first shot starts exactly at the section start. Shared files (common, props, shapes, cast,
  clawd, core) are changed only by the director, and every builder is told when they change.
- **Seams are contracts**, written down before building (the table at the end of `STORYBOARD_jazz.md`): the exact
  frame at each boundary (a colour, or a shape at a given screen position and size). When a builder revises its end
  frame, the next builder must be told and must re-check its first frames (this happened at 175.84).
- **Placeholder files** for every section were created up front and wired into `studio.html` in order, so shot
  boundaries existed from the start and no builder had to edit shared files.
- **Check images go in per-section folders** (`out/check/jazz/<section>/`), because builders render at the same time.
- **Review before accepting.** The director re-renders a few frames himself rather than trusting a sheet (one sheet
  was stale in the image viewer's cache).

## What review kept finding
- **Tiny characters in big fields** (the guide's "tiny Clawd" failure) in the first pass of four of five sections.
  Name the size in the brief: medium u ≈ 24–36, close-ups u 45+, and check it on screen (camera zoom included).
- **Two characters who read alike from far away.** A silhouette that shares the hero's signature (here the gardenia)
  needs another difference that survives at small size and in silhouette: the singer got a top hat (shape) and a dinner
  jacket (colour).
- **A coloured Clawd silhouette can read as an animal** (a rose Clawd in side view read as a pig). A pale fill with an
  ink outline read as a faceless person.
- **Costume continuity** across files: the pianist lost its beanie in one section. Put each character's look in one
  place (`SINGER_LOOK`, the defaults in cast.js) instead of repeating hats in shots.
- **Long single setups** (7 s on one framing) need a cutaway, a push, or an acting beat.
- **Acting beats need holds**: a look back is eyes first, then the head, then a held beat; a stand-up needs a settle
  before the rise.
- **Keep the subtitle band clear**: the bottom 16% of the frame had action crossing it in a few shots.

## Shared-library gaps builders worked around (candidates to fix)
- `saxRibbon()`'s texture fill turns greenish over blue grounds (pigment mixing); the solo uses a local ribbon.
- `moon()` is offset by the shot's print misregistration, so a moon that must land on an exact seam position is drawn
  on-register locally.
- `spotlight()` looks soft and grey on ink; chorus 1 uses a flat printed cone instead.
- `ripples()` draws its trailing rings in dark blue, invisible on dark grounds.
- `phoneBooth()` is too tall for a Clawd and puts the lifted receiver far above the head.
- `streetLamp()`'s head doesn't scale with the lamp.
- `drummer()` paints the kit over its arms, hiding a brush on the snare.
- `chair()` strokes break into stray lines at zoom ≈ 2.6.
- `gardeniaAt()` offsets the flower by the hat's position; sections centre it locally.
- `phone()` has a fixed dial (no spin), `candleFlame()` can't stretch, `cover()` has no per-block colour control.
- `ground(JZ.ink, { tex })` comes out as bare paper; the ink ground is drawn without texture.
- Thick `'dry'` brush lines paint as fat smudges; speed streaks use thin `'ink'` lines.
- There is no clipping helper: split screens and grids draw panes in order under thick ink gutters.

## Rebuild the video
```bash
# frames (parallel, resumable), then the MP4 with the song
node render.mjs --frames --workers=6
node render.mjs --encode --audio=assets/where_can_you_be.mp3 --out=out/where_can_you_be.mp4
# subtitles (Futura 62, cream on ink), burned into a copy
python3 tools/audio/srt2ass.py assets/where_can_you_be_lyrics.srt out/wcyb_lyrics.ass --size 62 --margin 50
ffmpeg -y -i out/where_can_you_be.mp4 -vf "ass=out/wcyb_lyrics.ass" -c:v libx264 -preset slow -crf 17 \
    -pix_fmt yuv420p -c:a copy -movflags +faststart out/where_can_you_be_lyrics.mp4
# a 720p copy for sharing
ffmpeg -y -i out/where_can_you_be_lyrics.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 20 \
    -pix_fmt yuv420p -c:a copy -movflags +faststart out/where_can_you_be_lyrics_720p.mp4
```
A full render is ~5632 frames at ~0.15–0.4 s each (about 15 minutes with 6 workers on an M2 Pro). Before rendering
into `out/frames`, make sure it holds no frames from another video: `--frames` skips files that already exist.

## Change one thing without disturbing the rest
Define it in one place, render before and after into two folders and diff them (see the guide's review loop):
```bash
node render.mjs --frames --dir=out/frames_b --workers=6
python tools/frames_diff.py out/frames out/frames_b --sheet out/check/diff.jpg          # every box should be on the change
python tools/frames_diff.py out/frames out/frames_b --expect-same                       # a refactor must change nothing
```
The singer's costume refactor changed 0 of 5632 frames; the new costume changed 3110 frames, every box on the singer.

## The brief given to the section builders
Each builder got this brief plus its own section's shots and seam contracts.

### Production brief: "Where Can You Be" (Clawd jazz MV), section builders

You are one of five animators building sections of a 234.65 s hand-painted music video in parallel, each in your own
file. A director (me) reviews your work afterwards. The standard: "this looks like a real animation studio short that
goes viral on X". Work in milestones: block key poses as stills, look, critique honestly, fix, then add motion, look
again. Don't rush to a finished-looking pass.

Repository: /Users/tianyili/Learn/ml/ClaudeAnimationBase. Everything you write into the repo is in English.

#### Read first (all of it)
- ANIMATION_GUIDE.md (the rules, animation principles, review loop, engine and Clawd reference).
- STORYBOARD_jazz.md (the whole film; your section in detail, and the sections either side of yours).
- src/scenes/jazz/common.js, props.js, shapes.js, cast.js (the shared library for this film).
- src/scenes/jazz/a_intro.js (shots A–D, already built and reviewed: follow its idioms and quality level).
- src/core.js and src/clawd.js as reference for the API.

#### Hard rules
- Edit ONLY your own section file. Do not edit any other file (not common/props/shapes/cast/clawd/core/timeline,
  not studio.html, config.js, the storyboard, or other sections). If a shared helper is missing or buggy, write a
  local version inside your file and mention it in your report.
- Wrap your file in an IIFE (like a_intro.js) so helper names can't collide with other sections; register shots with
  `shots([[startTime, fn], ...])`. Your first shot must start exactly at your section start; nothing may extend past
  your section end (the next section's first shot starts there).
- Do not render the full video, do not encode MP4s, do not commit.
- Put every check image under out/check/jazz/<your-section-id>/ (other agents render at the same time).

#### Look (see the storyboard "Look" section)
- Palette: only `JZ` colours (ink, cream, mustard, vermilion, bass blue, sax orange, their Dk/Lt, brass, wood, rose,
  smoke) plus the clay Clawd (PAL.clay). Never pure black/white. Clawd never on a vermilion field.
- Big flat printed blocks: `ground(col)`, `block(pts, col, {ink, sw})` with `plate('<shot key>')` called once per shot
  (fixed misregistration). Shading with `halftone('disc'|'ramp'|'flat', ...)`. Light with `glow()`, `spotlight()`.
  Smoke with `smoke()`. Thick ink outlines on characters and props.
- Frame rate is rhythm: quiet passages on twos (`onTwos(t)` for the animation time), bursts on ones (24 fps).
- Smear frames (stretched shapes + dry-brush streaks) for fast moves, never motion blur.
- No text anywhere in the frame (subtitles are burned in later). Keep the bottom 16% of the frame free of key
  action (subtitles sit there). No 3D.
- Sound shapes (the core idea) appear only when that instrument plays: sax → `saxRibbon(flowPath(...))`, bass →
  `ripples`, drums → `shards` (snare on backbeats), piano → `pianoTiles`, trumpet → `rays`, voice → `voiceCurls`,
  ride → `shimmer`. When several play, let them chase / wrap / knock each other.

#### Characters (cast.js)
`singer(x, y, u, t, o)` (lip-syncs itself to the lyric word timings; returns {mouth, mic, head}), `saxist`,
`trumpeter`, `pianist`, `bassist`, `drummer`, `lover` (always a silhouette, never a face). All take the usual clawd()
options (emotion spreads via feel()/emotions(), view, flip, sil (flat silhouette colour), hat (string or list),
noFace, boilKey, dx/dy/sq/rot/aL/aR...). Faces act through `emotions()` (never snap). Sizes: medium u 20–28,
close-up 40–70. Use `boilKey` for characters that come and go.

#### Timing
- Every time comes from the beat map: `barT(k)` = bar k's first beat, `beatT(b)` = beat b (fractions ok), `bpOf(t)`.
  Helpers: `sinceBeat(t)`, `sinceBackbeat(t)` (snare on beats 2 and 4), `agesAt(t, beats)`, `hitK(age, k)`.
- Lyrics: `LYRICS.lines` = [start, end, text] (the storyboard lists which line lands in which shot), `lyricAt(t)`.
- Hard cuts land on a snare backbeat (beat index b with b % 4 = 1 or 3); musician "intro" cuts on bar lines.
- Write the reads (storyboard format) for each shot and time them; one read at a time; hold what matters.

#### Review loop (budget: at least a sheet per shot, a strip for every key motion and seam, a crop for key faces)
```
node render.mjs --sheet=t1,t2,... --cols=4 --w=480 --out=out/check/jazz/<id>/x.jpg
node render.mjs --strip=a:b --cols=6 --w=320 --out=out/check/jazz/<id>/strip.jpg
node render.mjs --sheet=t --crop=x,y,w,h --w=600 --out=out/check/jazz/<id>/crop.jpg
```
Open every image with the view tool and actually look (if the viewer says a just-written file doesn't exist, wait a
second and view again). Check read, timing, motion (anticipation, follow-through, no pops), boil (no jitter on still
things: `boilSeed(key)` before every separate element), contacts, transitions, rules, colour. Keep frames under
~1.5 s each (the render log prints ms/frame).

#### Engine quirks you will hit
- A NaN in a point list throws `Failed to construct 'OffscreenCanvas'` pointing at your scene; guard geometry.
- Under a zoomed camera (zoom ≳ 2) huge shapes can lose their outline; draw long edges as inkLines no bigger than
  the canvas. Outline weight grows with zoom: scale `sw` down in close-ups.
- Pigment mixing: light colours over dark need full-opacity `wash`; anything that shines uses `glow()`.
- `silhouette(col, fn)` flattens whatever fn paints (used by `sil`).
- Transitions available: `brushWipe(p, [c1, c2])`, `iris`, `irisShape`, `flash`, match cuts, cuts on action,
  silhouette switches, colour-block wipes you build from `block()`.

#### Report back
When done: the shots you built (start–end, what happens), the path of one final contact sheet covering your whole
section (e.g. every ~0.8 s) plus strips of your seams, your honest list of remaining weaknesses, and any shared-library
problems you worked around.
