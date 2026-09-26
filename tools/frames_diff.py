"""Compare two renders of the same video frame by frame, to prove a change touched only what it should.

    python tools/frames_diff.py out/frames out/frames_b [--thresh 24] [--min-pixels 40] [--sheet out/check/diff.jpg]
        [--expect-same] [--workers 8]

Render the version before the change into one folder and the version after into another (render.mjs --frames
--dir=...), then run this. Rendering is repeatable to within GPU rounding (two renders of a frame differ by ~1 level,
PSNR ≈ 76 dB), so a pixel counts as changed only if some channel moved more than --thresh levels, and a frame counts
as changed only if more than --min-pixels pixels did.

Prints the changed frames grouped into time ranges with the bounding box of the change in each, and (with --sheet)
writes a contact sheet of changed frames: the new frame, the changed pixels tinted red, the box around them. Look at
it: every box should sit on the thing you meant to change. --expect-same exits with status 1 if anything changed (for
a refactor that must not change the picture).
"""
import argparse, os, sys
from multiprocessing import Pool
import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('a'); ap.add_argument('b')
ap.add_argument('--thresh', type=int, default=24); ap.add_argument('--min-pixels', type=int, default=40)
ap.add_argument('--fps', type=float, default=24); ap.add_argument('--sheet', default=None); ap.add_argument('--max', type=int, default=30)
ap.add_argument('--expect-same', action='store_true'); ap.add_argument('--workers', type=int, default=8)
a = ap.parse_args()

def load(p): return np.asarray(Image.open(p).convert('RGB'), dtype=np.int16)
def compare(name):
    A, B = load(os.path.join(a.a, name)), load(os.path.join(a.b, name))
    if A.shape != B.shape: return name, -1, None
    m = (np.abs(A - B).max(axis=2) > a.thresh)
    n = int(m.sum())
    if n <= a.min_pixels: return name, n, None
    ys, xs = np.nonzero(m)
    return name, n, (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))

if __name__ == '__main__':
    fa = {f for f in os.listdir(a.a) if f.endswith('.jpg')}; fb = {f for f in os.listdir(a.b) if f.endswith('.jpg')}
    both = sorted(fa & fb)
    if fa ^ fb: print(f'frames in only one folder: {len(fa - fb)} in {a.a}, {len(fb - fa)} in {a.b}')
    with Pool(a.workers) as pool: res = pool.map(compare, both, chunksize=16)
    changed = [(nm, n, box) for nm, n, box in res if box is not None or n < 0]
    t = lambda nm: int(nm[1:6]) / a.fps
    print(f'{len(both)} frames compared, {len(changed)} changed (> {a.min_pixels} px moved > {a.thresh} levels)')
    # group consecutive changed frames into ranges
    groups, cur = [], []
    for c in changed:
        if cur and int(c[0][1:6]) != int(cur[-1][0][1:6]) + 1: groups.append(cur); cur = []
        cur.append(c)
    if cur: groups.append(cur)
    for g in groups:
        bx = [c[2] for c in g if c[2]]
        u = (min(b[0] for b in bx), min(b[1] for b in bx), max(b[2] for b in bx), max(b[3] for b in bx)) if bx else None
        print(f'  {t(g[0][0]):8.2f}–{t(g[-1][0]):8.2f} s  {len(g):4d} frames  box x {u[0]}–{u[2]}, y {u[1]}–{u[3]}' if u else f'  {t(g[0][0]):8.2f} s  size mismatch')
    if a.sheet and changed:
        pick = [changed[int(i)] for i in np.linspace(0, len(changed) - 1, min(a.max, len(changed)))]
        cw, ch, cols = 480, 270, 5
        sheet = Image.new('RGB', (cw * cols, ch * ((len(pick) + cols - 1) // cols)), (20, 20, 20))
        for i, (nm, n, box) in enumerate(pick):
            A, B = load(os.path.join(a.a, nm)), load(os.path.join(a.b, nm))
            m = np.abs(A - B).max(axis=2) > a.thresh
            img = B.copy(); img[m] = (img[m] * .3 + np.array([255, 40, 40]) * .7).astype(np.int16)
            im = Image.fromarray(img.clip(0, 255).astype(np.uint8))
            if box: ImageDraw.Draw(im).rectangle(box, outline=(255, 60, 60), width=6)
            im = im.resize((cw, ch)); ImageDraw.Draw(im).text((6, 4), f'{t(nm):.2f}s  {n}px', fill=(255, 255, 255))
            sheet.paste(im, ((i % cols) * cw, (i // cols) * ch))
        os.makedirs(os.path.dirname(a.sheet) or '.', exist_ok=True); sheet.save(a.sheet, quality=88)
        print('wrote', a.sheet)
    if a.expect_same and changed: sys.exit(1)
