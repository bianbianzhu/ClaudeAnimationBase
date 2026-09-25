// beach/common.js: shared cast, props and set pieces for "Beach Day" (see STORYBOARD_beach.md).
// Music: 120 BPM, first downbeat 0.135 s, bar = 2 s. Every shot file is an IIFE that reads what it needs from BCH.
PAL.foam = PAL.foam || '#FFF5E2';   // sea foam, used by the beach shots
const BCH = (() => {
  const bt = n => OFF + n * BEAT;                 // time of beat n
  const bar = k => OFF + k * 4 * BEAT;            // time of bar k

  // ---------- palette (one world, dawn to dusk) ----------
  const C = {
    sand: '#F0D5A2', sandDk: '#D8AE74', sea: '#3FB1B8', seaDk: '#2B7F9A', seaLt: '#9ADFD6', foam: '#FFF5E2',
    uke: '#D8A05A', ukeDk: '#8A5634', ring: '#EF8EA8', ringDk: '#C4506E', ballA: '#4C7FC0', ballB: '#F2C53D',
    leaf: '#5E9F5A', leafDk: '#3E6F48', trunk: '#9A6A45', grass: '#8CC063', grassDk: '#5E8F4A',
  };

  // ---------- small marks ----------
  const sparkle = (x, y, r, k) => { if (k > 0 && k < 1) paint(starPts(x, y, r * backOut(k) * (1 - k * .6), .25, 4, k * 2), { wash: PAL.cream, washOp: 255 * (1 - k * k), ink: PAL.ink, sw: .4 }); };
  // One painted eighth note, s = size; k 0..1 pops it in with overshoot.
  function note(x, y, s, k, rot = 0, col = PAL.ink) {
    const p = backOut(k); if (p < .03) return;
    push(); translate(x, y); rotate(rot); scale(p);
    const sw = clamp(s / 16, .5, 1.4);
    paint(ellPts(0, 0, .72 * s, .5 * s, 14, 0, -.35), { wash: col, ink: PAL.ink, sw: sw * .6 });
    inkLine([[.6 * s, -.1 * s], [.64 * s, -1.4 * s], [.68 * s, -2.6 * s]], sw, PAL.ink, 'ink', 0);
    paint(ribbon([[.66 * s, -2.6 * s], [1.3 * s, -2.1 * s], [1.55 * s, -1.2 * s]], .5 * s, .15 * s), { wash: PAL.ink, ink: null });
    pop();
  }
  const NOTE_COLS = [PAL.ink, '#7B5CA8', '#C4506E', PAL.ink, '#3A7FA0'];
  // One note per beat for beats n0..n1. fly(n, age) returns [x, y, size, k, rot] for a note `age` s old, or null.
  function noteStream(t, n0, n1, life, fly, key = '') {
    for (let n = n0; n <= n1; n++) {
      const age = t - bt(n); if (age < 0 || age > life) continue;
      boilSeed('note' + key + n); const f = fly(n, age); if (f) note(...f, NOTE_COLS[((n % 5) + 5) % 5]);
    }
  }
  // Water drops flung out from (x, y): n drops, age in s, spread px. Arcs that fall with gravity.
  function drops(x, y, n, age, spread, key = '', col = '#A9E0EC', size = 1) {
    if (age < 0 || age > 1.1) return;
    boilSeed('drops' + key);
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (hash(i * 3.1 + 1) - .5) * 2.6, v = spread * (.6 + .6 * hash(i * 7.7 + 2));
      const dx = Math.cos(a) * v * age * 1.6, dy = Math.sin(a) * v * age * 1.6 + 900 * age * age, r = (5 + 5 * hash(i + 9)) * size * (1 - age * .6);
      paint([[x + dx, y + dy - r * 1.8], [x + dx + r, y + dy], [x + dx, y + dy + r], [x + dx - r, y + dy]], { wash: col, ink: PAL.ink, sw: .45, curv: .6 });
    }
  }

  // ---------- sky, sun and clouds ----------
  // Layered washes from top colour to bottom colour, in screen space (draw before the camera). n bands, soft edges.
  function skyGrad(top, bot, key = 'sky', n = 6, y0 = -60, y1 = H + 60) {
    boilSeed(key);
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: top, ink: null });
    for (let i = 1; i < n; i++) {
      const y = lerp(y0, y1, i / n), c = mixCol(top, bot, i / (n - 1));
      paint(rectPts(-80, y, W + 160, H + 200 - y), { wash: c, ink: null });
      paint(rectPts(-80, y - 40, W + 160, 80), { fill: c, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null });
    }
  }
  // The sun: rays, a painted disc and an optional face ('sleep' | 'happy' | 'wink' | null).
  function sun(x, y, r, t, face = null, o = {}) {
    const core = o.col || '#FAD46C', rim = o.rim || '#F4B444';
    if (o.glow !== 0) glow(x, y, r * (o.glowR ?? 2.4), o.glowCol || '#FFD97A', o.glow ?? 1);
    if (o.rays !== false) { boilSeed('sunrays' + (o.key || '')); paint(starPts(x, y, r * (1.42 + .1 * (o.beat ?? 0)), .74, 12, t * .12), { wash: rim, fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: .8 }); }
    boilSeed('sun' + (o.key || ''));
    paint(ellPts(x, y, r, r, 36, 1.2), { wash: core, fill: rim, fillOp: 70, bleed: .1, tex: .5, ink: o.ink === null ? null : PAL.ink, sw: 1 });
    if (!face) return;
    const e = r * .34, ey = y - r * .1, lw = clamp(r / 70, .6, 1.5);
    const shut = (cx, up) => inkLine([[cx - e * .42, ey], [cx, ey + (up ? -e * .32 : e * .28)], [cx + e * .42, ey]], lw, PAL.ink, 'ink', .8);
    const open = cx => { paint(ellPts(cx, ey, e * .2, e * .3, 12), { wash: PAL.ink, ink: null }); paint(ellPts(cx + e * .07, ey - e * .12, e * .07, e * .07, 8), { wash: PAL.cream, ink: null }); };
    if (face === 'sleep') { shut(x - e, false); shut(x + e, false); }
    else if (face === 'wink') { open(x - e); shut(x + e, true); }
    else { shut(x - e, true); shut(x + e, true); }
    for (const s of [-1, 1]) paint(ellPts(x + s * e * 1.55, y + r * .22, r * .16, r * .09, 12), { fill: PAL.rose, fillOp: 170, bleed: .15, ink: null });
    if (face === 'sleep') paint(ellPts(x, y + r * .36, r * .07, r * .09, 10), { wash: PAL.ink, ink: null });
    else inkLine([[x - e * .6, y + r * .28], [x, y + r * .48], [x + e * .6, y + r * .28]], lw, PAL.ink, 'ink', .8);
  }
  // A fat cumulus, s = half-width. sq squashes it.
  function cloud(x, y, s, col = PAL.cream, sq = 0, key = '', o = {}) {
    boilSeed('cloud' + key);
    const P = [];
    for (let i = 0; i < 44; i++) {
      const a = i / 44 * TAU, up = Math.sin(a) < 0, bump = up ? 1 + .24 * Math.pow(Math.abs(Math.sin(a * 3.5 + .4 + (o.ph || 0))), .6) : 1;
      P.push([x + Math.cos(a) * s * bump * (1 + sq * .6), y + Math.sin(a) * s * (up ? .5 : .28) * bump * (1 - sq)]);
    }
    paint(P, { wash: col, fill: mixCol(col, o.shade || PAL.indigo, .3), fillOp: 55, bleed: .12, tex: .5, ink: o.ink === null ? null : PAL.ink, sw: o.sw ?? .9, curv: .4 });
  }
  // Soft light beams fanning out from (x, y) toward angle dir. k 0..1 grows them.
  function beams(x, y, dir, len, k, t, key = '', n = 4, spread = .17, col = PAL.cream) {
    if (k <= .01) return;
    for (let i = 0; i < n; i++) {
      boilSeed('beam' + key + i);
      const a = dir + (i - (n - 1) / 2) * spread + .02 * Math.sin(t * .8 + i), w = (.035 + .02 * hash(i + 3)) * (1 + .15 * Math.sin(t * 1.3 + i * 2)), L = len * k * (.75 + .25 * hash(i + 11));
      paint([[x, y], [x + Math.cos(a - w) * L, y + Math.sin(a - w) * L], [x + Math.cos(a + w) * L, y + Math.sin(a + w) * L]], { wash: col, washOp: 100 * k, ink: null });
    }
  }
  // A gull: a painted M with a little body, s = half wingspan, flap = phase (turns).
  function gull(x, y, s, flap, key = '', col = PAL.cream) {
    boilSeed('gull' + key);
    const f = Math.sin(flap * TAU), tip = -s * .45 * f, mid = s * .12 * f;
    paint(ribbon([[x - s, y + tip], [x - s * .45, y - s * .25 + mid], [x, y]], s * .06, s * .2), { wash: col, ink: PAL.ink, sw: .6 });
    paint(ribbon([[x + s, y + tip], [x + s * .45, y - s * .25 + mid], [x, y]], s * .06, s * .2), { wash: col, ink: PAL.ink, sw: .6 });
    paint(ellPts(x, y + s * .03, s * .2, s * .1, 10), { wash: col, ink: PAL.ink, sw: .5 });
    paint([[x + s * .16, y], [x + s * .3, y + s * .04], [x + s * .16, y + s * .07]], { wash: PAL.ochre, ink: null });
  }

  // ---------- beach set pieces ----------
  // A palm: trunk from (x, y) curving by lean, fronds swaying with the breeze (sway ~ -1..1). s = height.
  function palm(x, y, s, sway, key = '', lean = .25) {
    boilSeed('palm' + key);
    const top = [x + s * lean + sway * s * .04, y - s];
    const P = [[x, y], [x + s * lean * .2, y - s * .4], [x + s * lean * .65, y - s * .78], top];
    paint(ribbon(P, s * .085, s * .05), { wash: C.trunk, fill: mixCol(C.trunk, PAL.ink, .3), fillOp: 70, tex: .7, ink: PAL.ink, sw: .8 });
    for (let i = 1; i < 6; i++) { const q = through(P, 4)[i * 2]; if (q) inkLine([[q[0] - s * .04, q[1]], [q[0] + s * .04, q[1] - s * .015]], .5, PAL.ink, 'inkfine', 0); }
    for (let i = 0; i < 7; i++) {   // fronds: serrated leaves arching out and drooping, stirring in the breeze
      boilSeed('frond' + key + i);
      const a = -Math.PI / 2 + (i - 3) * .66 + sway * .14 * (1 + hash(i)) + .05 * Math.sin(T * 2.2 + i), L = s * (.46 + .12 * hash(i + 4));
      const dir = Math.cos(a) >= 0 ? 1 : -1, droop = (.12 + .45 * Math.abs(Math.cos(a))) * L;
      const Cv = through([top, [top[0] + Math.cos(a) * L * .5, top[1] + Math.sin(a) * L * .5 - L * .18], [top[0] + Math.cos(a) * L * .9 + dir * L * .05, top[1] + Math.sin(a) * L * .9 + droop]], 5);
      const n = Cv.length, Lf = [], Rt = [];
      for (let j = 0; j < n; j++) {
        const p = Cv[j], q = Cv[Math.min(n - 1, j + 1)], r = Cv[Math.max(0, j - 1)], dx = q[0] - r[0], dy = q[1] - r[1], d = Math.hypot(dx, dy) || 1;
        const k = j / (n - 1), w = s * .085 * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (j % 2 ? 1.3 : .75);
        Lf.push([p[0] - dy / d * w, p[1] + dx / d * w]); Rt.push([p[0] + dy / d * w * .8, p[1] - dx / d * w * .8]);
      }
      paint(Lf.concat(Rt.reverse()), { wash: i % 2 ? C.leaf : mixCol(C.leaf, C.leafDk, .45), fill: C.leafDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: .7 });
      inkLine(Cv, .5, C.leafDk, 'inkfine', .5);
    }
    for (const k of [-1, 1]) paint(ellPts(top[0] + k * s * .03, top[1] + s * .03, s * .035, s * .035, 10), { wash: '#7A5230', ink: PAL.ink, sw: .5 });
  }
  // A band of sea from y0 down to y1 (world or screen coords), with foam lines that roll on the beat.
  function sea(t, x0, x1, y0, y1, key = 'sea', cols = [C.seaLt, C.sea, C.seaDk]) {
    boilSeed(key);
    paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: cols[1], ink: null });
    paint(rectPts(x0, y0, x1 - x0, (y1 - y0) * .35), { fill: cols[0], fillOp: 110, bleed: .03, tex: .4, ink: null });
    paint(rectPts(x0, y0 + (y1 - y0) * .6, x1 - x0, (y1 - y0) * .4), { fill: cols[2], fillOp: 90, bleed: .03, tex: .4, ink: null });
    for (let i = 0; i < 9; i++) {   // glints
      boilSeed(key + 'g' + i);
      const gx = lerp(x0, x1, hash(i + 1)), gy = lerp(y0, y1, .1 + .8 * hash(i + 20)), w = 30 + 40 * hash(i + 3), k = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      inkLine([[gx - w / 2, gy], [gx + w / 2, gy]], .8 + k, C.foam, 'inkfine', 0);
    }
  }
  // A foam line where waves meet sand: an irregular edge at base y that laps up and back on each bar.
  function shoreline(t, x0, x1, y, key = 'shore', amp = 18) {
    const lap = Math.sin((bpOf(t) / 4) * TAU) * amp;
    boilSeed(key);
    const P = []; for (let i = 0; i <= 16; i++) { const x = lerp(x0, x1, i / 16); P.push([x, y + lap + 8 * Math.sin(i * 1.3 + t * .8)]); }
    paint(P.concat([[x1, y - 200], [x0, y - 200]]), { wash: C.sea, ink: null });
    paint(ribbon(P, 7, 7), { wash: C.foam, washOp: 230, ink: null });   // painted, not 'dry': a light dry stroke over teal mixes dark
    inkLine(P.map(([a, b]) => [a, b - 14]), .8, C.foam, 'inkfine', .5);
  }

  // ---------- props ----------
  // Volleyball at (x, y), radius r, spin rot.
  function vball(x, y, r, rot = 0, key = '') {
    boilSeed('vball' + key);
    push(); translate(x, y); rotate(rot);
    paint(ellPts(0, 0, r, r, 24), { wash: '#FFF1D6', ink: null });
    paint(ribbon([[-r * .95, -r * .2], [0, -r * .55], [r * .95, -r * .2]], r * .38, r * .38), { wash: C.ballA, ink: null });
    paint(ribbon([[-r * .8, r * .45], [0, r * .15], [r * .8, r * .45]], r * .32, r * .32), { wash: C.ballB, ink: null });
    paint(ellPts(0, 0, r, r, 24), { ink: PAL.ink, sw: clamp(r / 30, .5, 1.2) });
    paint(ellPts(-r * .35, -r * .4, r * .2, r * .12, 10, 0, -.6), { wash: PAL.cream, washOp: 200, ink: null });
    pop();
  }
  // A beach parasol: (x, y) = where the pole meets the ground, s = canopy radius, open 0..1, tilt (rad).
  function parasol(x, y, s, open = 1, tilt = 0, key = '') {
    boilSeed('parasol' + key);
    push(); translate(x, y); rotate(tilt);
    const h = s * 1.7;
    inkLine([[0, 0], [0, -h * .5], [0, -h - s * .15]], 1.4, PAL.ink, 'ink', 0);
    const k = clamp(open), wR = s * lerp(.14, 1, k), dome = s * lerp(1.1, .42, k), top = -h - s * .12;
    const n = 6, cols = ['#E2476E', PAL.cream];
    for (let i = 0; i < n; i++) {
      const a0 = i / n, a1 = (i + 1) / n, xa = lerp(-wR, wR, a0), xb = lerp(-wR, wR, a1), P = [[0, top - dome * .02]];
      for (let j = 0; j <= 4; j++) { const xx = lerp(xa, xb, j / 4); P.push([xx, top + dome + Math.sin(j / 4 * Math.PI) * s * .08 * k - Math.abs(xx) / Math.max(1, wR) * dome * .15]); }
      paint(P, { wash: cols[i % 2], ink: null });
    }
    const O = [[0, top - dome * .02]]; for (let j = 0; j <= 24; j++) { const xx = lerp(-wR, wR, j / 24), jj = (j % 4) / 4; O.push([xx, top + dome + Math.sin(jj * Math.PI) * s * .08 * k - Math.abs(xx) / Math.max(1, wR) * dome * .15]); }
    paint(O, { ink: PAL.ink, sw: .9 });
    paint(ellPts(0, top - dome * .02, s * .05, s * .05, 8), { wash: PAL.ochre, ink: null });
    pop();
  }
  // Clawd's ukulele in body space (front view, held across the body). tilt raises the neck; ring shakes the strings.
  const UKE = [3.2, -2.0], UKE_ANG = .22;
  function ukeShape(u, sw, ring = 0) {
    const U = pts => pts.map(([a, b]) => [a * u, b * u]);
    paint(U([[-8.4, -.27], [-2.2, -.3], [-2.2, .3], [-8.4, .25]]), { wash: C.ukeDk, ink: PAL.ink, sw: sw * .7 });                       // neck
    paint(U([[-8.3, -.36], [-9.5, -.55], [-9.6, .52], [-8.3, .36]]), { wash: '#5E3A2A', ink: PAL.ink, sw: sw * .7 });                  // head
    const B = [];
    for (let a = -2.1; a <= 2.101; a += .15) B.push([1.3 * Math.cos(a), 1.3 * Math.sin(a)]);
    for (let a = 1.05; a <= TAU - 1.05; a += .2) B.push([-1.75 + 1.0 * Math.cos(a), 1.0 * Math.sin(a)]);
    paint(U(B), { wash: C.uke, fill: C.ukeDk, fillOp: 50, bleed: .05, tex: .6, ink: PAL.ink, sw: sw * .9, curv: .3 });               // body
    paint(ellPts(-.95 * u, 0, .42 * u, .42 * u, 14), { wash: '#3A2A22', ink: null });                                                  // sound hole
    paint(U([[.55, -.5], [.95, -.5], [.95, .5], [.55, .5]]), { wash: '#5E3A2A', ink: null });                                          // bridge
    for (const fx of [-3, -3.8, -4.6, -5.4, -6.2, -7]) inkLine([[fx * u, -.24 * u], [fx * u, .24 * u]], sw * .3, PAL.cream, 'inkfine', 0);
    for (let j = 0; j < 3; j++) {
      const y = (j - 1) * .13 * u, v = ring * Math.sin(T * 95 + j * 2) * .12 * u;
      inkLine([[.8 * u, y], [-3.5 * u, y + v], [-8.3 * u, y * 1.3]], sw * .26, PAL.cream, 'inkfine', .3);
    }
  }
  function uke(u, sw, tilt = 0, ring = 0) { push(); translate(UKE[0] * u, UKE[1] * u); rotate(UKE_ANG + tilt); ukeShape(u, sw, ring); pop(); }
  // The uke slung on the back while travelling (body space; side and 3/4 views only: from the front it's hidden).
  function ukeBack(u, sw, view) {
    push();
    if (view === 'side' || view === 'q') { translate((view === 'side' ? -2.9 : -4.6) * u, -3.4 * u); rotate(1.2); scale(.62); ukeShape(u, sw / .62 * .8); }
    pop();
  }
  // Floatie's ring: the front half of a striped float round the middle (body space). Drawn over the body and arms.
  function floatRing(u, sw, view) {
    const hw = { front: 6, q: 5.9, side: 3.9, qback: 5.9, back: 6 }[view || 'front'], ox = view === 'q' ? .3 : view === 'qback' ? -.3 : 0;
    const cy = -2.95, th = 1.25, dip = .45, n = 14, top = [], bot = [];
    for (let i = 0; i <= n; i++) { const k = i / n, x = lerp(-hw, hw, k), d = dip * (1 - (2 * k - 1) ** 2); top.push([(x + ox) * u, (cy - th / 2 + d) * u]); bot.push([(x + ox) * u, (cy + th / 2 + d) * u]); }
    const cap = s => { const P = []; for (let i = 1; i < 6; i++) { const a = -Math.PI / 2 + i / 6 * Math.PI; P.push([(ox + s * (hw + Math.cos(a) * th * .5)) * u, (cy + Math.sin(a) * th * .5) * u]); } return s > 0 ? P : P.reverse(); };
    const shape = top.concat(cap(1), bot.slice().reverse(), cap(-1).reverse());
    paint(shape, { wash: C.ring, fill: C.ringDk, fillOp: 40, tex: .4, ink: null });
    for (let s = 0; s < 4; s++) {   // cream stripes
      const i0 = 1 + s * 4, i1 = i0 + 1;
      paint([top[i0], top[i1], bot[i1], bot[i0]], { wash: PAL.cream, ink: null });
    }
    paint(shape, { ink: PAL.ink, sw: sw * .8 });
    inkLine(top.slice(3, 9).map(([a, b]) => [a, b + .25 * u]), sw * .4, PAL.cream, 'inkfine', .5);
  }

  // ---------- the cast ----------
  // All four are Clawds, told apart by costume. seed offsets blinks; phase offsets idles so nobody moves in unison.
  const CAST = {
    clawd:   { seed: 0,   ph: 0,   hat: null },
    spike:   { seed: 1.3, ph: .31, hat: 'band' },
    floatie: { seed: 2.1, ph: .57, hat: 'goggles', ring: true },
    shades:  { seed: 3.7, ph: .83, hat: 'straw', eyes: 'shades' },
  };
  // buddy(name, x, y, u, o): clawd() in costume. o.ukeBack puts the uke on Clawd's back; o.noRing / o.noShades /
  // o.hat override the costume; o.draw still works (drawn after the costume).
  function buddy(name, x, y, u, o = {}) {
    const c = CAST[name], q = { seed: c.seed, hat: c.hat, boilKey: name, ...o };
    if (c.eyes && !o.noShades) q.eyes = 'shades';
    const userDraw = o.draw;
    q.draw = (u, sw) => {
      if (name === 'clawd' && o.ukeBack) ukeBack(u, sw, q.view || 'front');
      if (c.ring && !o.noRing && !['back'].includes(q.view)) floatRing(u, sw, q.view || 'front');
      if (userDraw) userDraw(u, sw);
    };
    clawd(x, y, u, q);
  }
  // A trotting pose for a buddy heading right (or left with flip): side view, legs on the beat, a bob, arms swinging.
  // ph offsets the step so a line of buddies never moves in unison; speed = strides per beat.
  function trot(t, ph = 0, speed = 1, o = {}) {
    const bp = bpOf(t) * speed + ph, s = Math.sin(bp * TAU);
    return { view: 'side', walk: bp, dy: -Math.abs(Math.sin(bp * Math.PI * 2)) * .55, sq: .05 * Math.max(0, Math.cos(bp * TAU * 2)), aL: .25 * s, rot: -.03, ...o };
  }

  // ---------- playing the uke ----------
  // Repaint an arm over the uke so the hands sit on it (same pivot, angle and boil seed as the arm clawd() drew).
  function armOver(u, sw, which, a, len, col, dk, id) {
    const dir = which === 'L' ? -1 : 1;
    boilSeed(`clawd ${id} arm${which}`);
    push(); translate(dir * (4.9 + .55 * clamp((Math.abs(a) - .7) / .9)) * u, -4.5 * u); rotate(dir < 0 ? a : -a);
    paint(rectPts(dir < 0 ? -len * u : 0, -.5 * u, len * u, u, u * .07 * .6), { wash: col, washOp: 255, fill: dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    pop();
  }
  // Clawd (or anyone) playing the uke, front view. mood from feel()/emotions(); p = { strum, fret, tilt, ring, mouth }.
  function player(name, x, y, u, mood, p = {}) {
    const strum = p.strum ?? strumBeat(T), fret = p.fret ?? fretAt(T);
    const o = { ...mood, aL: fret, aR: strum, dy: (mood.dy || 0) + (p.dy || 0), sq: (mood.sq || 0) + (p.sq || 0), rot: (mood.rot || 0) + (p.rot || 0), ...(p.extra || {}) };
    if (p.mouth !== undefined) o.mouth = p.mouth;
    o.draw = (u, sw) => {
      const c = tintCols(o);
      uke(u, sw, p.tilt || 0, p.ring ?? ringBeat(T));
      armOver(u, sw, 'L', fret, 2.0, c.col, c.dk, name);
      armOver(u, sw, 'R', strum, p.reach ?? 2.9, c.col, c.dk, name);
    };
    buddy(name, x, y, u, o);
  }
  // strumming on every beat: a quick downstroke on the beat, an easy upstroke after it
  const strumBeat = (t, k = 1) => { const f = frac(bpOf(t) * k); return f < .18 ? lerp(-2.5, -2.02, easeOut(f / .18)) : lerp(-2.02, -2.5, ease((f - .18) / .82)); };
  const ringBeat = t => Math.exp(-frac(bpOf(t)) * 4);
  const fretAt = t => .02 + .08 * (Math.floor(bpOf(t) / 4) % 2) + .03 * wob(t, .7);
  // wordless singing: a new mouth shape each beat, a breath at the end of each bar
  const SING = ['open', 'O', 'o', 'smile', 'open', 'O', 'cat', 'open'];
  const sing = (t, ph = 0) => { const b = bpOf(t) + ph, n = Math.floor(b); return (((n % 4) + 4) % 4 === 3 && frac(b) > .55) ? 'smile' : SING[((n % 8) + 8) % 8]; };

  // ---------- shared transitions (screen space, after camEnd) ----------
  // Whip pan: full-frame dry-brush speed streaks. k 0..1 strength (peak at the cut), dir 'h' (sideways) or 'v' (down).
  // End of a shot: whip(seg(lt, dur - .25, dur), dir); start of the next: whip(1 - seg(lt, 0, .3), dir).
  function whip(k, dir = 'h', cols = [PAL.cream, '#BFE3F0']) {
    if (k <= .01) return;
    boilSeed('whip');
    if (k > .55) paint(rectPts(-80, -80, W + 160, H + 160), { wash: cols[1], washOp: 255 * clamp((k - .55) / .35), ink: null });
    for (let i = 0; i < 34; i++) {   // tapered painted speed lines, fat at the head, thin at the tail
      const a = hash(i * 3.3 + 1), b = hash(i * 5.1 + 2), len = (400 + 900 * hash(i + 7)) * (.4 + .6 * k), th = (6 + 34 * hash(i + 13)) * k;
      const c = i % 3 ? cols[0] : cols[1];
      const P = dir === 'h' ? [[b * W + len / 2, a * H], [b * W, a * H + jit(3)], [b * W - len / 2, a * H]] : [[a * W, b * H + len / 2], [a * W + jit(3), b * H], [a * W, b * H - len / 2]];
      paint(ribbon(P, th, 1), { wash: c, washOp: 170 + 85 * k, ink: null });
    }
  }
  // Splash wipe: a wall of sea paint rises from the bottom and covers the frame (p 0 → .5), then drains down (p .5 → 1).
  // Cut under full cover at p = .5. End of shot: splashWipe(seg(lt, dur - .35, dur) * .5); next shot: splashWipe(.5 + seg(lt, 0, .35) * .5).
  function splashWipe(p) {
    if (p <= 0 || p >= 1) return;
    const top = p < .5 ? lerp(H + 120, -260, easeOut(p * 2)) : lerp(-260, H + 160, easeIn((p - .5) * 2));
    boilSeed('splashwipe');
    const P = [];
    for (let i = 0; i <= 20; i++) { const x = lerp(-80, W + 80, i / 20); P.push([x, top + 60 * Math.sin(i * 1.1 + p * 9) + 40 * hash(i)]); }
    paint(P.concat([[W + 80, H + 400], [-80, H + 400]]), { wash: C.sea, fill: C.seaDk, fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: 1.2 });
    paint(ribbon(P.map(([x, y]) => [x, y + 30]), 8, 8), { wash: C.foam, washOp: 230, ink: null });
    for (let i = 0; i < 14; i++) { const x = lerp(0, W, hash(i + 3)), y = P[Math.round(hash(i + 3) * 20)][1] - 40 - 120 * hash(i + 8); paint(ellPts(x, y, 12 + 14 * hash(i), 16 + 16 * hash(i), 10), { wash: C.seaLt, ink: PAL.ink, sw: .5 }); }
  }

  return { bt, bar, C, whip, splashWipe, sparkle, note, noteStream, drops, skyGrad, sun, cloud, beams, gull, palm, sea, shoreline, vball, parasol,
           uke, ukeBack, ukeShape, floatRing, CAST, buddy, trot, armOver, player, strumBeat, ringBeat, fretAt, sing };
})();

// A test loop for the cast: studio.html?loop=cast
LOOPS.cast = t => {
  BCH.skyGrad('#BFE3F0', '#FBE7C6');
  paint(rectPts(-50, 760, W + 100, 400), { wash: BCH.C.sand, ink: null });
  const names = ['clawd', 'spike', 'floatie', 'shades'];
  names.forEach((n, i) => BCH.buddy(n, 300 + i * 440, 520, 22, { ...feel('happy', t + i * .3) }));
  names.forEach((n, i) => BCH.buddy(n, 200 + i * 460, 980, 18, { ...BCH.trot(t, BCH.CAST[n].ph), ukeBack: n === 'clawd' }));
  BCH.player('clawd', 1720, 1000, 12, feel('happy', t));
};
LOOPS.cast.len = 4;
LOOPS.cast2 = t => {
  BCH.skyGrad('#BFE3F0', '#FBE7C6', 'sky', 9);
  paint(rectPts(-50, 860, W + 100, 400), { wash: BCH.C.sand, ink: null });
  BCH.player('clawd', 520, 940, 40, feel('happy', t), { mouth: BCH.sing(t) });
  BCH.buddy('floatie', 1300, 940, 40, { ...feel('excited', t) });
  BCH.vball(1750, 300, 60, t);
  BCH.parasol(1750, 900, 170, clamp(t / 2));
  BCH.gull(300, 200, 80, t * 2);
  BCH.palm(1000, 860, 400, Math.sin(t));
};
LOOPS.cast2.len = 4;
