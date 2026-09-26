# Setup: everything the kit needs, where it lives, and how its version is kept

What to install on a new machine to render videos, analyse songs and burn subtitles. Nothing here is installed by the
repository itself; each piece is installed once per machine.

| piece | used for | where it's installed | how its version is kept |
|---|---|---|---|
| Node.js (v24 here) | running `render.mjs` | globally (the system / nvm / Homebrew) | not pinned; any recent LTS works |
| p5, p5.brush, puppeteer-core | drawing and driving the headless browser | `node_modules/` in this repo (ignored by git) | **pinned** by `package-lock.json`: install with `npm ci` |
| Google Chrome (153 here) | the renderer's browser (WebGL) | globally (the Chrome app; `--chrome=` for another one) | not pinned: Chrome auto-updates; new versions can move a few pixels, not the picture |
| ffmpeg (8.0.1 here) | encoding MP4s, muxing audio, burning subtitles | globally (`brew install ffmpeg`) | not pinned: Homebrew upgrades it with `brew upgrade` |
| libass (0.17.4 here) | ffmpeg's subtitle renderer (only for burning subtitles in) | globally, installed automatically with Homebrew's ffmpeg | comes with ffmpeg; check with `ffmpeg -filters \| grep " ass "` |
| Python 3.13 | the tools in `tools/` | globally | not pinned; 3.11+ works |
| librosa, numpy, scipy, soundfile, faster-whisper, pillow | beat maps, pitch, lyric timing, frame diffs | a virtual environment **outside** the repo, e.g. `~/.venvs/audio` | **pinned** in `tools/requirements.txt` |
| whisper model `large-v3` (~3 GB) | lyric timing | `~/.cache/huggingface` (downloaded on first run of `lyrics.py`) | fixed by name; cached, so it downloads once |
| Futura (a macOS font) | the jazz video's subtitle font | the system (macOS ships it) | on Windows/Linux pick another font with `srt2ass.py --font` |

Only rendering needs the first four rows. The Python rows are needed only to analyse a new song or to diff renders,
and libass only to burn subtitles into a video (a separate caption file doesn't need it).

## Install on a new Mac

```bash
# rendering
brew install node ffmpeg          # ffmpeg brings libass with it
npm ci                            # exact p5 / p5.brush / puppeteer-core versions from package-lock.json
# (Google Chrome: install the app as usual)

# the audio and diff tools (optional)
python3 -m venv ~/.venvs/audio
~/.venvs/audio/bin/pip install --progress-bar off --timeout 60 -r tools/requirements.txt
#   where public PyPI is blocked, add: --index-url https://packagefeedproxy.microsoft.io/pypi/simple/
```

Install the Python packages in one command without `-q`, so the download progress shows: the big wheels
(ctranslate2, onnxruntime, numba) take minutes and a quiet install looks hung.

## Check it works

```bash
node render.mjs --sheet=1,3,5 --out=out/check/setup.jpg            # renders three frames
ffmpeg -hide_banner -filters | grep -E " (ass|subtitles) "         # libass is there (for subtitles)
~/.venvs/audio/bin/python -c "import librosa, faster_whisper, PIL; print('ok')"
```

## What isn't in the repository

`out/` (every render, frame and check image) and `node_modules/` are ignored by git. A fresh clone rebuilds both:
`npm ci`, then render. The songs, beat maps, lyric timings and pitch contours the videos use are committed (in
`assets/` and `src/scenes/<video>/`), so re-rendering a video doesn't need the Python tools.
