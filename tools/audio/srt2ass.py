"""SRT → styled ASS subtitles at 1920×1080, for burning into a finished render with ffmpeg (docs/MUSIC_SYNC.md).

    python tools/audio/srt2ass.py assets/song_lyrics.srt out/song_lyrics.ass [--font Futura] [--size 54]
        [--text '#F1E4C8'] [--edge '#1E1A1F'] [--margin 56] [--fade 280,350] [--spacing 1.5] [--bold]

Colours are ordinary hex (#RRGGBB) and are converted to ASS's &HAABBGGRR. The shadow is the edge colour at half
opacity. Every line fades in and out (--fade in,out ms).
"""
import argparse, re

ap = argparse.ArgumentParser()
ap.add_argument('srt'); ap.add_argument('ass')
ap.add_argument('--font', default='Futura'); ap.add_argument('--size', type=int, default=54)
ap.add_argument('--text', default='#F1E4C8'); ap.add_argument('--edge', default='#1E1A1F')
ap.add_argument('--margin', type=int, default=56); ap.add_argument('--fade', default='280,350')
ap.add_argument('--spacing', type=float, default=1.5); ap.add_argument('--bold', action='store_true')
ap.add_argument('--outline', type=float, default=3.0); ap.add_argument('--shadow', type=float, default=2.2)
a = ap.parse_args()

def col(h, alpha=0):
    h = h.lstrip('#'); r, g, b = h[0:2], h[2:4], h[4:6]
    return f'&H{alpha:02X}{b}{g}{r}'.upper()
def sec(s):
    h, m, r = s.strip().replace(',', '.').split(':'); return int(h) * 3600 + int(m) * 60 + float(r)
def ts(x):
    c = round(x * 100); return f'{c // 360000}:{c // 6000 % 60:02d}:{c // 100 % 60:02d}.{c % 100:02d}'

head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Lyric,{a.font},{a.size},{col(a.text)},{col(a.text)},{col(a.edge)},{col(a.edge, 0x80)},{-1 if a.bold else 0},0,0,0,100,100,{a.spacing},0,1,{a.outline},{a.shadow},2,120,120,{a.margin},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
fi, fo = a.fade.split(',')
out = [head]
for blk in re.split(r'\n\s*\n', open(a.srt, encoding='utf-8').read().strip()):
    L = blk.strip().splitlines()
    s, e = L[1].split('-->')
    out.append(f'Dialogue: 0,{ts(sec(s))},{ts(sec(e))},Lyric,,0,0,0,,{{\\fad({fi},{fo})}}' + r'\N'.join(L[2:]) + '\n')
open(a.ass, 'w', encoding='utf-8').write(''.join(out))
print('wrote', a.ass, len(out) - 1, 'lines')
