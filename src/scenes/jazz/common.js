// jazz/common.js: the look and the timing helpers for "Where Can You Be" (STORYBOARD_jazz.md).
// Palette, printed flat blocks (misregistered), halftone dots, smoke and spotlights, beat / backbeat helpers,
// the singer's lip sync (LYRICS) and the solo's pitch (SOLO).

const JZ = {
  ink: '#1E1A1F', ink2: '#2B2531', cream: '#F1E4C8', paper: '#EADBBE',
  mustard: '#E2A62A', mustDk: '#B07D17', mustLt: '#F2C866',
  verm: '#D6452B', vermDk: '#A12E1B', vermLt: '#EE7A5C',
  blue: '#1F3D72', blueDk: '#132647', blueLt: '#4A6FAE',
  orange: '#EE7A2A', orangeLt: '#F8A860', orangeDk: '#B8531A',
  brass: '#E0AE48', brassDk: '#946417', brassLt: '#FBE3A0',
  wood: '#8C3A22', woodLt: '#B9573A', rose: '#E58C86', smoke: '#D8C9AA', leaf: '#4E6B4A',
};

// ---------- strings to numbers ----------
const shash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };

// ---------- the print look ----------
// Screen-printed record covers put each colour on its own plate, a little off the black line (misregistration).
// plate(key) picks one fixed offset for the shot (so it never jitters); block() prints a flat colour on it.
let MIS = [0, 0];
function plate(key, amt = 7) { const a = shash(key) * TAU; MIS = [Math.cos(a) * amt, Math.sin(a) * amt]; }
// A flat printed block: the colour off-register, the (optional) ink line on-register. o: { ink, sw, curv, op, tex, misK }
function block(pts, col, o = {}) {
  const k = o.misK ?? 1, P = k ? pts.map(([x, y]) => [x + MIS[0] * k, y + MIS[1] * k]) : pts;
  paint(P, { wash: col, washOp: o.op ?? 255, ...(o.tex ? { fill: o.texCol || mixCol(col, JZ.ink, .3), fillOp: o.tex, bleed: .02, tex: .85, border: .25 } : {}), ink: null, curv: o.curv });
  if (o.ink) paint(pts, { ink: o.ink, sw: o.sw ?? 1.2, curv: o.curv });
}
// The whole frame in one flat colour (works inside a camera: it covers the visible area).
function ground(col, o = {}) {
  const c = CAM, z = c ? c.zoom : 1, cx = c ? c.cx : W / 2, cy = c ? c.cy : H / 2, r = Math.hypot(W, H) / z * .6 + 60;
  paint(rectPts(cx - r, cy - r, 2 * r, 2 * r), { wash: col, washOp: 255, ink: null, ...(o.tex ? { fill: mixCol(col, JZ.ink, .35), fillOp: o.tex, bleed: .02, tex: .9, border: .2 } : {}) });
}

// ---------- halftone ----------
// Print shading, drawn from three textures made once: 'disc' (big dots in the middle, shrinking to nothing at the rim:
// spotlight pools, glows, moons), 'ramp' (dots growing from nothing at the top to full at the bottom: shadows, night
// skies, falloff) and 'flat' (an even screen). halftone(kind, cx, cy, w, h, col, a, rot) tints and places one, like glow.
let HT = null;
function htTex() {
  if (HT) return HT;
  const mk = (n, cell, fn) => {
    const g = createGraphics(n, n); g.pixelDensity(1); const c = g.drawingContext; c.fillStyle = '#ffffff';
    const ca = Math.cos(Math.PI / 4), sa = Math.sin(Math.PI / 4);
    for (let i = -n; i < n; i += cell) for (let j = -n; j < n; j += cell) {
      const x = n / 2 + i * ca - j * sa, y = n / 2 + i * sa + j * ca;
      if (x < -cell || x > n + cell || y < -cell || y > n + cell) continue;
      const r = cell * .62 * clamp(fn(x / n, y / n));
      if (r > .4) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
    }
    return g;
  };
  HT = { disc: mk(512, 18, (u, v) => 1.15 - Math.hypot(u - .5, v - .5) * 2.3), ramp: mk(512, 18, (u, v) => v * 1.1), flat: mk(512, 18, () => .5) };
  return HT;
}
function halftone(kind, cx, cy, w, h, col = JZ.ink, a = 1, rot = 0) {
  if (a <= 0.01) return;
  flushBrush(); const c = color(col), T0 = htTex()[kind];
  push(); translate(cx, cy); rotate(rot); tint(red(c), green(c), blue(c), 255 * clamp(a)); image(T0, -w / 2, -h / 2, w, h); noTint(); pop();
}

// ---------- light and air ----------
// A spotlight: a flat cream beam from (x0, y0) widening to a pool of width w at (x1, y1), a halftone pool and real light.
function spotlight(x0, y0, x1, y1, w, o = {}) {
  const a = o.a ?? 1, col = o.col || JZ.cream, w0 = o.w0 ?? w * .12;
  boilSeed('spot' + (o.key || ''));
  const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
  paint([[x0 + nx * w0 / 2, y0 + ny * w0 / 2], [x1 + nx * w / 2, y1 + ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2], [x0 - nx * w0 / 2, y0 - ny * w0 / 2]],
    { wash: col, washOp: 34 * a, fill: col, fillOp: 28 * a, bleed: .08, tex: .5, border: .6, ink: null });
  if (o.pool !== false) {
    paint(ellPts(x1, y1, w * .56, w * .13, 30), { wash: col, washOp: 70 * a, ink: null });
    halftone('disc', x1, y1, w * 1.35, w * .34, col, .55 * a);
  }
  if (o.glow !== false) glow(x0, y0, w * .35, o.glowCol || '#FFE2A8', .7 * a);
}
// Club smoke: slow soft wisps drifting through a region; they boil but never jitter (hashed shapes, own seeds).
function smoke(t, x, y, w, h, o = {}) {
  const n = o.n ?? 6, col = o.col || JZ.smoke;
  for (let i = 0; i < n; i++) {
    boilSeed('smoke' + (o.key || '') + i);
    const sp = .012 + .01 * hash(i * 7.3), ph = frac(hash(i * 3.1) + t * sp);
    const cx = x + ((hash(i * 1.7) + t * sp * .6) % 1) * w, cy = y + h * (1 - ph) + 30 * Math.sin(t * .4 + i);
    const rw = w * (.12 + .1 * hash(i * 5.9)) * (1 + ph), rh = rw * (.28 + .12 * hash(i * 2.2));
    paint(ellPts(cx, cy, rw, rh, 18, rh * .25, .2 * Math.sin(i + t * .1)), { fill: col, fillOp: (o.op ?? 26) * Math.sin(Math.PI * ph), bleed: .3, tex: .4, border: .1, ink: null });
  }
}

// ---------- timing ----------
const threes = t => Math.floor(t * 8 + 1e-6) / 8;          // on threes (8 drawings a second) for the dreamiest holds
// seconds since the last beat (k = 2: since the last eighth), and that beat's index
function sinceBeat(t, k = 1) { const b = Math.floor(bpOf(t) * k + 1e-9); return [t - beatT(b / k), b]; }
// the snare backbeat: beats 2 and 4 of each bar (0-based beats 1 and 3). Returns [seconds since it, beat index].
function sinceBackbeat(t) { let b = Math.floor(bpOf(t) + 1e-9); while (((b % 4) + 4) % 4 % 2 === 0) b--; return [t - beatT(b), b]; }
// the times of events at beat positions [b0, b1, ...] that have happened by t, as ages in seconds
const agesAt = (t, beats) => beats.map(b => t - beatT(b)).filter(a => a >= 0);
// a hit envelope: 1 at the moment, decaying (k per second)
const hitK = (age, k = 8) => age < 0 ? 0 : Math.exp(-age * k);

// ---------- lip sync ----------
// how open the singer's mouth is at t (0..1), from the sung words' timings: opens into each word, flutters on its
// syllables, closes between words.
function singOpen(t) {
  const Wd = LYRICS.words; let lo = 0, hi = Wd.length - 1;
  if (!Wd.length || t < Wd[0][0] - .05) return 0;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Wd[m][0] <= t) lo = m; else hi = m; }
  const w = Wd[hi][0] <= t ? Wd[hi] : Wd[lo];
  if (t > w[1] + .05 || t < w[0] - .05) return 0;
  const d = Math.max(.14, w[1] - w[0]), k = clamp((t - w[0] + .05) / (d + .1));
  const env = Math.min(1, Math.sin(Math.PI * k) * 1.6), syl = .72 + .28 * Math.abs(Math.sin((t - w[0]) * TAU * 2.6));
  return clamp(env * syl);
}
const singMouth = (t, big = .8) => { const o = singOpen(t); return o < .14 ? null : o < .5 ? 'o' : o < big ? 'open' : 'O'; };
// the sung line at t: [start, end, text, index] or null
function lyricAt(t) { const L = LYRICS.lines; for (let i = 0; i < L.length; i++) if (t >= L[i][0] - .1 && t <= L[i][1] + .2) return [...L[i], i]; return null; }

// ---------- the solo's melody ----------
// MIDI note at t (smoothed, gaps filled from the neighbours); outside the solo it returns the nearest end.
function soloMidi(t) {
  const M = SOLO.midi, f = clamp((t - SOLO.t0) * SOLO.fps, 0, M.length - 1), i = Math.floor(f);
  let s = 0, n = 0;
  for (let j = i - 3; j <= i + 4; j++) { const v = M[clamp(j, 0, M.length - 1)]; if (v != null) { const wgt = 1 - Math.abs(j - f) / 5; if (wgt > 0) { s += v * wgt; n += wgt; } } }
  return n ? s / n : 60;
}
// 0..1 height of the solo's melody (C3 → F5)
const soloH = t => clamp((soloMidi(t) - 50) / 28);
