# Setup: everything the kit needs, where it lives, and how its version is kept

What to install on a new machine to render videos, analyse songs and burn subtitles. Nothing here is installed by the
repository itself; each piece is installed once per machine.

| piece | used for | where it's installed | how its version is kept |
|---|---|---|---|
| Node.js 24 (24.14 verified) | running `render.mjs` | globally (nvm, or Homebrew's `node@24`) | `package.json` `engines`: ≥ 22.12 (puppeteer-core 25 requires it); `.nvmrc` says 24 |
| p5, p5.brush, puppeteer-core | drawing and driving the headless browser | `node_modules/` in this repo (ignored by git) | **pinned** by `package-lock.json`: install with `npm ci` |
| Google Chrome (153 here) | the renderer's browser (WebGL) | globally (the Chrome app; `--chrome=` for another one) | not pinned: Chrome auto-updates; new versions can move a few pixels, not the picture |
| ffmpeg | encoding MP4s and muxing audio (any build); burning subtitles (a build with libass) | globally: `brew install ffmpeg`; for subtitles, `ffmpeg-full` only if that one lacks libass | not pinned: `brew upgrade` moves it |
| libass | ffmpeg's subtitle renderer (only for burning subtitles in) | inside ffmpeg: Homebrew's plain `ffmpeg` 8.x has it, 9.x doesn't; `ffmpeg-full` has it (keg-only, see below) | check with `ffmpeg -filters \| grep " ass "` |
| Python 3.13 (3.13.2 verified) | the tools in `tools/` | globally (pyenv, python.org or Homebrew's `python@3.13`) | 3.12 is the minimum (the pinned numpy, scipy and librosa require it); create the venv with `python3.13` explicitly |
| librosa, numpy, scipy, soundfile, faster-whisper, pillow | beat maps, pitch, lyric timing, frame diffs | a virtual environment **outside** the repo, e.g. `~/.venvs/audio` | **pinned** in `tools/requirements.txt` |
| whisper model `large-v3` (~3 GB) | lyric timing | `~/.cache/huggingface` (downloaded on first run of `lyrics.py`) | fixed by name; cached, so it downloads once |
| Futura (a macOS font) | the jazz video's subtitle font | the system (macOS ships it) | on Windows/Linux pick another font with `srt2ass.py --font` |

Only rendering needs the first four rows. The Python rows are needed only to analyse a new song or to diff renders,
and libass only to burn subtitles into a video (a separate caption file doesn't need it).

## Install on a new Mac

```bash
# rendering
nvm install 24 && nvm use 24      # or: brew install node@24 (keg-only: add $(brew --prefix node@24)/bin to PATH)
brew install ffmpeg               # rendering and encoding
npm ci                            # exact p5 / p5.brush / puppeteer-core versions from package-lock.json
# (Google Chrome: install the app as usual)

# the audio and diff tools (optional)
python3.13 -m venv ~/.venvs/audio   # name the version: plain python3 may be an older one
~/.venvs/audio/bin/pip install --progress-bar off --timeout 60 -r tools/requirements.txt
#   where public PyPI is blocked, add: --index-url https://packagefeedproxy.microsoft.io/pypi/simple/

# burning subtitles in (optional): needs an ffmpeg with libass; install ffmpeg-full only if yours lacks it
ffmpeg -hide_banner -filters | grep -q " ass " || brew install ffmpeg-full
```

Burn subtitles with whichever ffmpeg has libass: `FF=$(ffmpeg -hide_banner -filters | grep -q " ass " && echo ffmpeg || echo "$(brew --prefix ffmpeg-full)/bin/ffmpeg")`.
Homebrew's ffmpeg 8.x includes libass and 9.x doesn't, so `brew upgrade` can remove it (`brew pin ffmpeg` keeps 8.x);
`ffmpeg-full` is keg-only, hence the full path.

Install the Python packages in one command without `-q`, so the download progress shows: the big wheels
(ctranslate2, onnxruntime, numba) take minutes and a quiet install looks hung.

## Check it works

```bash
node render.mjs --sheet=1,3,5 --out=out/check/setup.jpg            # renders three frames
$FF -hide_banner -filters | grep -E " (ass|subtitles) "   # both lines: subtitles can be burned in
~/.venvs/audio/bin/python --version                              # 3.13.x
~/.venvs/audio/bin/python -c "import librosa, faster_whisper, PIL; print('ok')"
node --version                                                   # v24.x
```

## What isn't in the repository

`out/` (every render, frame and check image) and `node_modules/` are ignored by git. A fresh clone rebuilds both:
`npm ci`, then render. The songs, beat maps, lyric timings and pitch contours the videos use are committed (in
`assets/` and `src/scenes/<video>/`), so re-rendering a video doesn't need the Python tools.
