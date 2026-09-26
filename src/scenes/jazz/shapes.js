// jazz/shapes.js: "sound you can see". Every instrument's sound has its own shape and colour (STORYBOARD_jazz.md):
//   sax → a twisting orange ribbon, bass → blue ripples, drums → red shards, piano → hopping black-and-white tiles,
//   trumpet → gold rays, voice → cream curls, ride cymbal → shimmer arcs.
// All are pure functions of time: pass the ages of the notes that made them.

// ---------- sax: the ribbon ----------
// A flowing centreline from (x0, y0) heading `dir` (radians), `len` px long, waving as it travels (time t).
// o: amp (wave height, px), waves (how many along it), speed, curl (the tip curls round), lift(k) → extra y offset.
function flowPath(x0, y0, dir, len, t, o = {}) {
  const n = o.n ?? 26, amp = o.amp ?? 70, wv = o.waves ?? 1.6, sp = o.speed ?? 1.2, P = [];
  const c = Math.cos(dir), s = Math.sin(dir);
  for (let i = 0; i <= n; i++) {
    const k = i / n, d = k * len, a = amp * Math.pow(k, .7) * Math.sin(k * wv * TAU - t * sp * TAU + (o.phase || 0));
    let x = x0 + c * d - s * a, y = y0 + s * d + c * a + (o.lift ? o.lift(k) : 0);
    if (o.curl && k > .82) { const q = (k - .82) / .18, r = o.curl * (1 - q * .6); x += Math.cos(q * 4.5 + dir) * r - c * q * r; y += Math.sin(q * 4.5 + dir) * r; }
    P.push([x, y]);
  }
  return P;
}
// The ribbon along a path: w = its widest, grow 0..1 = how much of it has unfurled from the start, twist = how many
// half-twists along it (front orange, back darker), t drives the twist's travel. One outline per face.
function saxRibbon(P, w, t, o = {}) {
  boilSeed('ribbon' + (o.key || ''));
  const grow = clamp(o.grow ?? 1); if (grow < .02) return;
  const C = through(P, 4), n = Math.max(2, Math.floor((C.length - 1) * grow) + 1), tw = o.twist ?? 3, sw = o.sw ?? 1.3;
  const front = o.col || JZ.orange, back = o.back || JZ.orangeDk;
  const wAt = i => { const k = i / (C.length - 1), env = Math.pow(Math.sin(Math.PI * clamp(k * .92 + .06)), .55) * (o.taper ? 1 - k * .5 : 1); return w * env * Math.cos(k * tw * Math.PI - t * (o.tspeed ?? 2.2)); };
  let seg = [], sign = Math.sign(wAt(0)) || 1;
  const flush = () => {
    if (seg.length < 2) return;
    const L = seg.map(p => p[0]), R = seg.map(p => p[1]).reverse();
    paint(L.concat(R), { wash: sign > 0 ? front : back, fill: sign > 0 ? JZ.orangeLt : JZ.orangeDk, fillOp: sign > 0 ? 45 : 15, tex: .4, border: .4, ink: o.ink === undefined ? JZ.ink : o.ink, sw });
  };
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const wi = wAt(i), s = Math.sign(wi) || sign, h = Math.abs(wi) / 2 + .6;
    const pair = [[C[i][0] - dy / d * h, C[i][1] + dx / d * h], [C[i][0] + dy / d * h, C[i][1] - dx / d * h]];
    if (s !== sign) { seg.push([C[i], C[i]]); flush(); seg = [[C[i], C[i]]]; sign = s; }
    seg.push(pair);
  }
  flush();
  if (o.shine) { const i = Math.floor(n * .5); inkLine(C.slice(Math.max(0, i - 6), i + 1), sw * .8, JZ.cream, 'inkfine', .5); }
  return C[n - 1];
}

// ---------- bass: ripples ----------
// Concentric rings from (cx, cy), one per note (ages in seconds). o: speed (px/s), life (s), flat (ry/rx), col, sw.
function ripples(cx, cy, ages, o = {}) {
  const sp = o.speed ?? 520, life = o.life ?? 1.6, fl = o.flat ?? 1, col = o.col || JZ.blueLt;
  ages.forEach((a, i) => {
    if (a < 0 || a > life) return;
    boilSeed('rip' + (o.key || '') + i);
    const k = a / life, r = (o.r0 ?? 20) + sp * easeOut(Math.min(1, a / life * 1.2)) * life * .7;
    const th = (o.sw ?? 5) * (1 - k) + .4;
    for (let j = 0; j < (o.rings ?? 2); j++) {
      const rr = r - j * (o.gap ?? 34); if (rr < 8) continue;
      inkLine(ellPts(cx, cy, rr, rr * fl, 36, 0).concat([[cx + rr, cy]]), th * (1 - j * .35), j ? JZ.blue : col, 'ink', .5);
    }
  });
}

// ---------- drums: shards ----------
// A burst of broken geometric pieces from (cx, cy), age seconds after the hit. o: n, dist, size, dir/spread (radians).
function shards(cx, cy, age, seed, o = {}) {
  const life = o.life ?? .9; if (age < 0 || age > life) return;
  boilSeed('shard' + seed);
  const n = o.n ?? 7, dist = o.dist ?? 220, sz = o.size ?? 34, k = age / life;
  for (let i = 0; i < n; i++) {
    const h1 = hash(seed * 13.7 + i * 3.1), h2 = hash(seed * 5.3 + i * 7.7), h3 = hash(seed * 9.1 + i * 1.3);
    const a = (o.dir ?? 0) + (o.spread ?? TAU) * (i / n - .5 + (h1 - .5) * .5), d = dist * (.5 + .7 * h2) * easeOut(Math.min(1, age * 5));
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d + (o.fall ?? 0) * age * age;
    const r = sz * (.6 + .8 * h3) * (1 - Math.pow(k, 2)), rot = a + age * (6 + 8 * h1) * (h2 > .5 ? 1 : -1);
    if (r < 2) continue;
    const pts = h3 > .66 ? [[1, 0], [-.6, .8], [-.4, -.9]] : h3 > .33 ? [[1, -.2], [.2, .9], [-1, .3], [-.3, -.8]] : [[1.1, 0], [-.5, .5], [-.8, -.2]];
    const col = o.cols ? o.cols[i % o.cols.length] : (i % 4 === 3 ? JZ.mustard : i % 3 === 1 ? JZ.vermDk : JZ.verm);
    paint(pts.map(([px, py]) => [x + (px * Math.cos(rot) - py * Math.sin(rot)) * r, y + (px * Math.sin(rot) + py * Math.cos(rot)) * r]), { wash: col, ink: JZ.ink, sw: o.sw ?? 1 });
  }
}

// ---------- piano: hopping tiles ----------
// A row (or grid) of square tiles starting at (x, y), cell px each, cols × rows. A chord (hits: ages) makes the tiles
// hop in a wave from left to right; each flips black↔cream at the top of its hop. o.stairs: each column sits one step
// higher (a staircase), o.gap, o.h (hop height).
function pianoTiles(x, y, cell, cols, rows, hits, o = {}) {
  const gap = o.gap ?? cell * .12, hh = o.h ?? cell * 1.2, dur = o.dur ?? .42, wave = o.wave ?? .035;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    boilSeed('tile' + (o.key || '') + i + '_' + j);
    let dy = 0, flips = 0, sq = 0;
    hits.forEach((a, n) => {
      const q = (a - (i + j * .5) * wave) / dur; if (q < 0) return;
      if (q < 1) { dy -= hh * Math.sin(Math.PI * q); sq = q < .15 ? .2 * (1 - q / .15) : 0; }
      if (q >= .5) flips++;
      if (q > 1 && q < 1.4) sq = -.18 * Math.sin((q - 1) / .4 * Math.PI);
    });
    const base = ((i + j) % 2 === 0) ^ (flips % 2 === 1), col = base ? JZ.cream : JZ.ink;
    const tx = x + i * (cell + gap), ty = y + j * (cell + gap) - (o.stairs ? i * o.stairs : 0) + dy;
    const w = cell * (1 + sq * .5), h = cell * (1 - sq);
    paint(rectPts(tx + (cell - w) / 2, ty + (cell - h), w, h, cell * .02), { wash: col, ink: o.ink || (base ? JZ.ink : JZ.cream), sw: o.sw ?? 1 });
  }
}

// ---------- trumpet: rays ----------
// A fan of sharp light rays from (cx, cy) toward `dir`. age = seconds since the note began, hold = its length.
function rays(cx, cy, dir, age, o = {}) {
  const hold = o.hold ?? .8; if (age < 0 || age > hold + .5) return;
  boilSeed('rays' + (o.key || ''));
  const n = o.n ?? 5, len = (o.len ?? 900) * easeOut(Math.min(1, age / .18)), fade = 1 - seg(age, hold, hold + .5), spread = o.spread ?? .5;
  if (o.glow !== false) glow(cx, cy, 140 * fade, '#FFE1A0', .8 * fade);
  for (let i = 0; i < n; i++) {
    const a = dir + spread * (i / (n - 1) - .5) + .03 * Math.sin(age * 9 + i), w = (o.w ?? 34) * (1 - Math.abs(i / (n - 1) - .5)) * fade + 2;
    const L = len * (.75 + .25 * hash(i * 4.1 + (o.seed || 0)));
    const tip = [cx + Math.cos(a) * L, cy + Math.sin(a) * L], nx = -Math.sin(a), ny = Math.cos(a);
    paint([[cx + nx * w * .3, cy + ny * w * .3], [tip[0] + nx * w, tip[1] + ny * w], [tip[0] + Math.cos(a) * w * 2, tip[1] + Math.sin(a) * w * 2], [tip[0] - nx * w, tip[1] - ny * w], [cx - nx * w * .3, cy - ny * w * .3]],
      { wash: i % 2 ? JZ.mustard : JZ.mustLt, ink: JZ.ink, sw: o.sw ?? 1 });
  }
}

// ---------- voice: cream curls ----------
// Soft curls rising from the singer's mouth at (x, y): one per sung word that started in the last `life` seconds.
function voiceCurls(x, y, t, o = {}) {
  const life = o.life ?? 2.2, Wd = LYRICS.words, sc = o.s ?? 1;
  let n = 0;
  for (let i = Wd.length - 1; i >= 0 && n < (o.max ?? 6); i--) {
    const a = t - Wd[i][0]; if (a < 0) continue; if (a > life) break;
    n++; boilSeed('curl' + i);
    const k = a / life, dir = hash(i * 2.9) > .5 ? 1 : -1, rise = (o.rise ?? 170) * sc * easeOut(k) + 20 * sc;
    const bx = x + dir * 30 * sc * Math.sin(k * 2.5) + (o.dx ?? 40) * sc * k, by = y - rise;
    const P = []; for (let j = 0; j <= 9; j++) { const q = j / 9, r = (38 - 26 * q) * sc * (.6 + k * .6), ang = q * 4.6 * dir + k * 1.5; P.push([bx + Math.cos(ang) * r * q * 1.6, by - q * 50 * sc + Math.sin(ang) * r * .7]); }
    paint(ribbon(P, (14 * (1 - k * .5)) * sc, 3 * sc), { wash: o.col || JZ.cream, washOp: 255 * (1 - Math.pow(k, 2)), ink: k < .7 ? JZ.ink : null, sw: .6 * sc });
  }
}

// ---------- ride cymbal shimmer ----------
function shimmer(cx, cy, rx, ry, age, o = {}) {
  if (age < 0 || age > 1.2) return;
  boilSeed('shim' + (o.key || ''));
  for (let j = 0; j < 3; j++) {
    const k = clamp(age * 1.4 - j * .18); if (k <= 0 || k >= 1) continue;
    const r = 1 + k * .9;
    for (const s of [-1, 1]) inkLine(ellPts(cx, cy, rx * r, ry * r, 30).filter((p, i) => (s < 0 ? i > 16 && i < 28 : i > 1 && i < 13)), 2.2 * (1 - k), o.col || JZ.mustLt, 'ink', .5);
  }
}
