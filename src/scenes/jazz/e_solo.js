// jazz/e_solo.js: shots O1–O4 (104.14–132.03 s, bars 60–75), the instrumental solo.
// The band's shapes take over and the world leaves reality: piano tiles flip the frame (O1), the sax ribbon floods it
// and becomes a road through the sky over a flat night city (O2, the camera's height follows the melody; bar 65 flies
// through the sax's bell into another district), the trumpet's rays sweep the sky from a rooftop (O3), and the piano's
// run builds a staircase of tiles up to the moon (O4), which is the disc the next section starts on.
(() => {
  const B = beatT, BAR = barT;
  const T60 = BAR(60), T61 = BAR(61), T63 = BAR(63), T65 = BAR(65), T69 = BAR(69), T73 = BAR(73);

  // ---------- helpers ----------
  // the melody's height, smoothed over a window (s), from the pitch tracker
  function pitchS(t, win = .4) {
    let s = 0, n = 0;
    for (let i = 0; i < 9; i++) { const q = i / 8 - .5, w = Math.exp(-q * q * 8); s += soloMidi(t + q * win) * w; n += w; }
    return s / n;
  }
  // a flat card-flip of a square tile: x, y = centre, c = size, q = flip progress (0..1: from → to), lift = hop (px)
  function flipTile(x, y, c, from, to, q, o = {}) {
    const f = clamp(q), sx = Math.max(.06, Math.abs(Math.cos(Math.PI * f))), col = f < .5 ? from : to;
    if (!col) return;
    const s = (o.s ?? 1) * (1 + .1 * Math.sin(Math.PI * f)), w = c * sx * s, h = c * s;
    const cy = y - (o.lift ?? c * .12) * Math.sin(Math.PI * f);
    const rot = o.rot || 0;
    const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([a, b]) => [x + a * Math.cos(rot) - b * Math.sin(rot), cy + a * Math.sin(rot) + b * Math.cos(rot)]);
    paint(pts, { wash: col, ink: o.ink === undefined ? JZ.ink : o.ink, sw: o.sw ?? 1.4 });
    // mid-flip, the tile's edge shows as a thin dark side
    if (sx < .35 && f > .02 && f < .98) inkLine([[x, cy - h / 2], [x, cy + h / 2]], 2.2 * (1 - sx / .35) + .5, JZ.ink, 'ink', 0);
  }
  const tileCol = (i, j, n) => ((i + j + n) % 2 === 0) ? JZ.cream : JZ.ink;

  // a local sax ribbon (shapes.js saxRibbon without its watercolour fill, which mottles green over blue grounds; and
  // with an outline weight that can be scaled down under a zoomed camera). Returns the centreline.
  function ribbonL(P, w, t, o = {}) {
    boilSeed('rib' + (o.key || ''));
    const grow = clamp(o.grow ?? 1); if (grow < .02) return null;
    const C = through(P, o.res ?? 5), n = Math.max(2, Math.floor((C.length - 1) * grow) + 1), tw = o.twist ?? 3, sw = o.sw ?? 1.3;
    const front = o.col || JZ.orange, back = o.back || JZ.orangeDk;
    // the half-width at centreline sample i: tapered at the ends (o.open: only at the start, the end cut short), at
    // the growing tip, and twisting (the sign flips at each half-twist: front face orange, back face dark)
    const wAt = i => {
      const k = i / (C.length - 1);
      const tip = grow < 1 ? Math.pow(Math.sin(Math.PI / 2 * clamp((grow - k) / .07)), .6) : 1;
      const env = o.flat ? 1 : o.open ? Math.pow(Math.sin(Math.PI / 2 * clamp(k / .12 + .1)), .55) * Math.pow(Math.sin(Math.PI / 2 * clamp((1 - k) / .07)), .6)
        : Math.pow(Math.sin(Math.PI * clamp(k * .92 + .06)), .55);
      let c = Math.cos(k * tw * Math.PI - t * (o.tspeed ?? 2.2) + (o.ph || 0));
      if (o.open && k > .72) c = lerp(c, 1, ease((k - .72) / .12));   // the strand the player stands on stays flat
      return w * tip * env * (o.wf ? o.wf(k) : 1) * c;
    };
    let segP = [], sign = Math.sign(wAt(0)) || 1;
    const flush = () => {
      if (segP.length < 2) return;
      const L = segP.map(p => p[0]), R = segP.map(p => p[1]).reverse();
      paint(L.concat(R), { wash: sign > 0 ? front : back, ink: o.ink === undefined ? JZ.ink : o.ink, sw });
    };
    for (let i = 0; i < n; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
      const wi = wAt(i), s = Math.sign(wi) || sign, h = Math.abs(wi) / 2 + .6;
      const pair = [[C[i][0] - dy / d * h, C[i][1] + dx / d * h], [C[i][0] + dy / d * h, C[i][1] - dx / d * h]];
      if (s !== sign) { segP.push([C[i], C[i]]); flush(); segP = [[C[i], C[i]]]; sign = s; }
      segP.push(pair);
    }
    flush();
    if (o.shine) { const i = Math.floor(n * .55); inkLine(C.slice(Math.max(0, i - 7), i + 1), sw * .9, JZ.orangeLt, 'inkfine', .5); }
    return C.slice(0, n);
  }

  // ---------- O2a's stage: the saxophonist centre, the band silhouettes receding, the ribbon flooding the frame ----------
  const SX0 = 720, FLOOR = 830, U2 = 38;
  // the ribbon's control points after the bell (world). A: bar 61, a wave out to the right that curls up and back
  // across the top; B: bar 62, the tip swoops down the left side toward the player; C: it slides under the feet (the
  // scoop) and on to the right.
  const RA = [[1180, 560], [1450, 420], [1720, 520], [1860, 300], [1620, 120], [1150, 100], [650, 140], [300, 200], [100, 320], [-200, 420]];
  const RB = [[1180, 560], [1450, 420], [1720, 520], [1860, 300], [1620, 120], [1150, 100], [600, 120], [220, 280], [240, 600], [640, 700]];
  const RC = [[1180, 560], [1450, 420], [1720, 520], [1860, 300], [1620, 120], [1150, 100], [600, 120], [200, 300], [360, 650], [1500, 610]];
  function ribbonCtl(t) {
    const kB = ease(seg(t, B(4 * 61 + 3.4), B(4 * 62 + 1.4))), kC = ease(seg(t, B(4 * 62 + 1.6), B(4 * 62 + 2.6)));
    const ride = ease(seg(t, B(4 * 62 + 2.6), T63));
    return RA.map((p, i) => {
      const b = RB[i], c = RC[i], w = 34 * Math.sin(i * 1.3 - t * 3.4) * Math.min(1, i / 3);
      return [lerp(lerp(p[0], b[0], kB), c[0], kC), lerp(lerp(p[1], b[1], kB), c[1], kC) + w - 90 * ride * (i >= 8 ? 1 : 0)];
    });
  }
  // the y of the ribbon's last span at x (the strand the player lands on)
  function strandY(P, x) {
    const C = through(P.slice(-4), 8).slice(8);
    let best = C[0], bd = 1e9; for (const p of C) { const d = Math.abs(p[0] - x); if (d < bd) { bd = d; best = p; } }
    return best[1];
  }
  function bandSil(t, k) {   // the rest of the band, flat silhouettes that shrink back and go dark blue (k = 0..1 receded)
    const col = mixCol(JZ.ink, JZ.blueDk, k), s = 1 - .2 * k, fy = FLOOR - 20 * k, [ba] = sinceBeat(t);
    const nod = -.08 * hitK(ba, 6);
    pianist(90, fy, 19 * s, t, { sil: col, dy: nod, boilKey: 'O2-pn', key: 'O2pn', noShadow: true });
    bassist(470 - 30 * k, fy, 18 * s, t, { sil: col, dy: nod * .6, boilKey: 'O2-bs', key: 'O2bs' });
    drummer(1440 + 20 * k, fy, 18 * s, t, { sil: col, boilKey: 'O2-dr', key: 'O2dr', left: { a: -.2 + .3 * hitK(sinceBackbeat(t)[0], 8) }, right: { a: -.1 + .2 * Math.abs(Math.sin(bpOf(t) * Math.PI)) } });
    trumpeter(1740 + 30 * k, fy, 19 * s, t, { sil: col, flip: true, aL: -.5, boilKey: 'O2-tp', key: 'O2tp', rot: .15 });
  }
  function saxStage(t, lt) {
    plate('O2a');
    const bp = bpOf(t), [ba] = sinceBeat(t), pre = t < T61 ? 1 : 0;
    const breath = seg(t, B(4 * 60 + 3), T61), rec = ease(seg(t, T61, T61 + .9));
    // the scoop: crouch before beat 3 of bar 62, hop onto the ribbon's strand as it slides under, ride it up
    const tj = B(4 * 62 + 2), cr = seg(t, tj - .2, tj), hop = seg(t, tj, tj + .3), ride = ease(seg(t, tj + .3, T63));
    const dive = easeIn(seg(t, B(4 * 62 + 3) - .08, T63));
    const Dp = [1250, 560 - 90 * ride];                      // the point on the ribbon the camera dives into
    const z = (1 + .06 * ease(seg(t, T61, tj))) * Math.exp(dive * 1.4);
    const kc = ease(seg(t, tj - .2, T63));
    camBegin(lerp(960 + 30 * Math.sin(t * .7), Dp[0], kc), lerp(540, Dp[1], kc), z, .1 * dive);
    boilSeed('O2-ground'); ground(JZ.blue, { tex: 22 });
    boilSeed('O2-disc'); block(ellPts(820, 420, 360, 360, 48), JZ.mustard, { ink: JZ.ink, sw: 1.8 });
    halftone('disc', 890, 480, 760, 760, JZ.mustDk, .4);
    boilSeed('O2-floor'); block(rectPts(-400, FLOOR, W + 800, 700), JZ.ink2, { ink: JZ.ink, sw: 1.6 });
    halftone('ramp', 960, FLOOR - 120, W + 400, 260, JZ.blueDk, .55 * rec);
    bandSil(t, rec);
    const ctl = ribbonCtl(t);
    const landY = strandY(ctl, SX0 + 10) - 6;
    // the saxophonist: the breath in, the blast on the bar line, the swing, then the crouch and the hop
    const blast = t >= T61 ? hitK(t - T61, 5) : 0, on = 1 - pre;
    const swing = on * Math.sin(bp * Math.PI / 2);
    const hopDy = hop > 0 ? lerp(0, (landY - FLOOR) / U2, easeOut(hop)) - 1.2 * Math.sin(Math.PI * hop) : 0;
    const land = t > tj + .3 ? hitK(t - tj - .3, 7) : 0;
    const body = {
      sq: -.14 * Math.sin(Math.PI * breath) * pre + .16 * blast + .05 * hitK(ba, 7) * on + .2 * Math.sin(Math.PI * .5 * cr) * (hop > 0 ? 0 : 1) - .16 * Math.sin(Math.PI * hop) + .18 * land,
      rot: -.1 * breath * pre + .06 * blast + .045 * swing + .07 * ride,
      dy: -.35 * breath * pre + hopDy,
    };
    const mid = soloMidi(t);
    // the bell, from the pose (side view: (7.26u, -3.49u) from the feet), so the ribbon can go under the player once
    // it scoops it up
    const bsq = body.sq, bco = Math.cos(body.rot), bsi = Math.sin(body.rot), blx = 7.26 * U2 * (1 + .6 * bsq), bly = -3.49 * U2 * (1 - bsq);
    const bell = [SX0 + blx * bco - bly * bsi, FLOOR + body.dy * U2 + blx * bsi + bly * bco];
    const behind = t > tj - .2;
    const drawSax = () => saxist(SX0, FLOOR, U2, t, { ...body, shine: frac(.15 + (mid - 50) / 24), glow: .9, key: 'O2', boilKey: 'O2-sax', aL: .05 + .1 * swing });
    if (!behind) drawSax();
    // the ribbon: bursts out on the bar line, travels as a wave, loops round the frame, then scoops the player up
    const grow = easeOut(seg(t, T61, T61 + 1.35));
    if (grow > 0) {
      const P = [bell, ...ctl];
      // as the camera dives, the ribbon's last strand swells toward the lens until its orange face is the frame
      const sw = k => 1 + dive * 7 * ease(clamp((k - .72) / .2));
      ribbonL(P, lerp(110, 200, ease(seg(t, T61, tj))) * (1 + .12 * hitK(ba, 5)), t, { grow, key: 'O2a', twist: 5, tspeed: 2.4, shine: 1, sw: 1.5 / Math.max(1, z * .7), open: kc > 0, wf: kc > 0 ? sw : null, ph: 0 });
    }
    if (behind) drawSax();
    camEnd();
  }

  // ---------- O1 · the piano's bar (104.14–105.88, bar 60) ----------
  // From the chorus's flat mustard, a checkerboard of piano tiles flips across the frame on each beat (from the left,
  // from the right, from the middle); on beat 4 the tiles hop off and reveal the saxophonist taking its breath.
  function O1(t, lt, dur) {
    plate('O1');
    const [ba, bi] = sinceBeat(t), bt = bi - 4 * 60;   // beat 0..3 of the bar
    const cell = 120, nx = 16, ny = 9, z = 1 + .025 * hitK(ba, 6) + .03 * ease(seg(t, T60, B(4 * 60 + 3)));
    const b4 = B(4 * 60 + 3);
    if (t >= b4 - .02) saxStage(t, lt);
    else { boilSeed('O1-ground'); ground(JZ.mustard); }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      boilSeed('O1-t' + i + '_' + j);
      const x0 = (i + .5) * cell, y0 = (j + .5) * cell, x = 960 + (x0 - 960) * z, y = 540 + (y0 - 540) * z, c = cell * z;
      const d1 = (i / 15 * .7 + j / 8 * .3) * .26, d2 = ((15 - i) / 15 * .7 + (8 - j) / 8 * .3) * .26;
      const dc = Math.hypot(x0 - 960, y0 - 540) / 1100 * .26, dsx = Math.hypot(x0 - 820, y0 - 620) / 1150 * .15;
      const ev = [[T60 + d1, 0], [B(4 * 60 + 1) + d2, 1], [B(4 * 60 + 2) + dc, 2]];
      let from = JZ.mustard, to = JZ.mustard, q = 1;
      for (const [te, n] of ev) if (t >= te) { from = to; to = tileCol(i, j, n); q = (t - te) / .17; }
      // beat 4: every tile hops up and spins away, the ones round the saxophonist first
      const off = seg(t, b4 + dsx, b4 + dsx + .27);
      if (off >= 1) continue;
      const k = easeIn(off), ang = Math.atan2(y0 - 620, x0 - 820), push = 260 * k;
      flipTile(x + Math.cos(ang) * push, y + Math.sin(ang) * push - 90 * Math.sin(Math.PI * off), c, from, to, q,
        { s: 1 - k, rot: (hash(i * 7 + j * 3) - .5) * 2.4 * k, lift: c * .16, ink: to === JZ.mustard || (from === JZ.mustard && q < .5) ? null : JZ.ink, sw: 1.4 });
    }
  }

  // ---------- O2a · the sax takes the frame (105.88–109.35, bars 61–62) ----------
  function O2a(t, lt, dur) {
    saxStage(t, lt);
    // the last frames: the camera is inside the ribbon, all orange
    const k = seg(t, T63 - .06, T63 - .02);
    if (k > 0) { boilSeed('O2a-flood'); flash(k, JZ.orange); }
  }

  // ---------- O2b / O2c · the flight: the ribbon is a road through the sky over a flat night city ----------
  // The city is a plan seen from straight above (flat blocks of rooftops, streets, a river), painted in its own camera;
  // the camera's height is the melody's: a higher note pulls the city further down (smaller, slower, the road's shadow
  // falls further away), a low note skims the roofs. The road is the melody itself: the saxophonist surfs on the
  // pitch line, the part behind is what it just played, the fresh ribbon from the bell lays the road just ahead.
  const alt = t => clamp((pitchS(t, .35) - 52) / 15);          // the note's height, 0..1 (the sax's range, ~52–67)
  const altC = t => clamp((pitchS(t - .12, 1.0) - 52) / 15);   // the camera's height: the same, smoothed and lagging
  const RU = 28, RSX = 740, RSY = 590, RA_ = 440, RV = 640, TB = 2.3, TA = .85;
  function roadPt(t, tau, ac) { return [RSX + (tau - t) * RV, RSY - RA_ * (alt(tau) - ac)]; }
  const G = 560, ST = 96, rivY = x => 420 * Math.sin(x / 1300) + 160 * Math.sin(x / 530 + 1);   // city grid: block pitch, street width
  const ROOF1 = [JZ.blue, mixCol(JZ.blue, JZ.ink, .35), mixCol(JZ.blueDk, JZ.blue, .45), JZ.blueDk];
  const ROOF2 = [JZ.woodLt, JZ.smoke, JZ.cream, mixCol(JZ.wood, JZ.ink, .15), mixCol(JZ.rose, JZ.woodLt, .5), mixCol(JZ.smoke, JZ.mustDk, .35), JZ.smoke];
  function screenToWorld(sx, sy, c) {
    const dx = (sx - W / 2) / c.zoom, dy = (sy - H / 2) / c.zoom, co = Math.cos(-c.rot), si = Math.sin(-c.rot);
    return [c.cx + dx * co - dy * si, c.cy + dx * si + dy * co];
  }
  // one block of rooftops (bx, by = its top-left corner, sz = its size); d = district
  function roofBlock(bx, by, sz, id, d, z, t) {
    boilSeed('blk' + d + '_' + id);
    const R = d === 1 ? ROOF1 : ROOF2, h = k => hash(id * 12.9898 + k * 78.233 + d * 31);
    const sw = 1.3, parts = [];
    // split the block into 1–4 buildings
    const sx = .35 + .3 * h(1), sy = .35 + .3 * h(2), n = h(3);
    if (n < .2) parts.push([0, 0, 1, 1]);
    else if (n < .5) parts.push([0, 0, sx, 1], [sx, 0, 1 - sx, 1]);
    else if (n < .8) parts.push([0, 0, sx, sy], [0, sy, sx, 1 - sy], [sx, 0, 1 - sx, 1]);
    else parts.push([0, 0, sx, sy], [sx, 0, 1 - sx, sy], [0, sy, sx, 1 - sy], [sx, sy, 1 - sx, 1 - sy]);
    parts.forEach(([u0, v0, uw, vh], k) => {
      const x = bx + u0 * sz + 6, y = by + v0 * sz + 6, w = uw * sz - 12, hh = vh * sz - 12, tall = h(10 + k);
      const col = R[Math.floor(h(20 + k) * R.length)];
      // the building's flat shadow falls down-right on the street (taller = longer)
      block([[x + w, y + 10], [x + w + 18 + 34 * tall, y + 28 + 34 * tall], [x + w + 18 + 34 * tall, y + hh + 18 + 34 * tall], [x + 18 + 34 * tall, y + hh + 18 + 34 * tall], [x, y + hh]], JZ.ink, { op: 150, misK: 0 });
      block(rectPts(x, y, w, hh), col, { ink: JZ.ink, sw });
      if (z < .55) return;
      const dt = h(30 + k);
      if (dt < .34 && w > 110 && hh > 110) {   // a skylight grid, lit or dark
        const lit = h(40 + k) > .45, cols = 3, rows = 2, cw = Math.min(w, 220) * .6 / cols, ch = Math.min(hh, 160) * .5 / rows;
        const ox = x + w * .5 - cw * cols / 2, oy = y + hh * .5 - ch * rows / 2;
        paint(rectPts(ox - 6, oy - 6, cw * cols + 12, ch * rows + 12), { wash: JZ.ink2, ink: null });
        for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) paint(rectPts(ox + a * cw + 3, oy + b * ch + 3, cw - 6, ch - 6), { wash: lit ? (hash(id + a * 3 + b) > .3 ? JZ.mustLt : JZ.mustard) : mixCol(col, JZ.ink, .45), ink: null });
      } else if (dt < .6 && w > 90 && hh > 90) {   // a water tower: a round tank on legs, seen from above
        const r = 26 + 10 * h(50 + k), cx = x + w * (.3 + .4 * h(51 + k)), cy = y + hh * (.3 + .4 * h(52 + k));
        paint(ellPts(cx + 16, cy + 18, r, r, 16), { wash: JZ.ink, washOp: 150, ink: null });
        paint(ellPts(cx, cy, r, r, 18), { wash: d === 1 ? JZ.wood : JZ.woodLt, ink: JZ.ink, sw });
        paint(ellPts(cx - r * .15, cy - r * .15, r * .45, r * .45, 12), { wash: mixCol(JZ.woodLt, JZ.cream, .3), ink: null });
      } else if (dt < .85) {   // vents: two little boxes
        for (let q = 0; q < 2; q++) { const vx = x + w * (.2 + .5 * h(60 + k + q)), vy = y + hh * (.2 + .5 * h(62 + k + q)); paint(rectPts(vx, vy, 30, 22), { wash: mixCol(col, JZ.ink, .4), ink: JZ.ink, sw: sw * .7 }); }
      }
    });
  }
  // the city's plan, in world space (call inside its camera). river: district 2's river along y = 0.
  function cityPlan(t, d, c) {
    const P = [[0, 0], [W, 0], [0, H], [W, H]].map(([a, b]) => screenToWorld(a, b, c));
    const x0 = Math.min(...P.map(p => p[0])) - G, x1 = Math.max(...P.map(p => p[0])) + G, y0 = Math.min(...P.map(p => p[1])) - G, y1 = Math.max(...P.map(p => p[1])) + G;
    boilSeed('city-ground' + d); ground(d === 1 ? JZ.ink2 : mixCol(JZ.ink2, JZ.wood, .18));
    const RIV = 210;
    if (d === 2) {   // the river: a winding blue band, moonlight glints drifting on it, bass ripples on every beat
      const top = [], bot = [];
      for (let x = Math.floor(x0 / 200) * 200; x <= x1 + 200; x += 200) { top.push([x, rivY(x) - RIV]); bot.push([x, rivY(x) + RIV]); }
      boilSeed('river'); block(top.concat(bot.slice().reverse()), JZ.blue, { misK: 0 });
      for (let q = 0; q < top.length - 1; q += 4) { inkLine(top.slice(q, q + 5), 2.2, JZ.ink, 'ink', .5); inkLine(bot.slice(q, q + 5), 2.2, JZ.ink, 'ink', .5); }
      for (let i = Math.floor(x0 / 180); i < x1 / 180; i++) {
        boilSeed('glint' + i);
        const gx = i * 180 + 60 * hash(i * 1.9), gy = rivY(gx) + (hash(i * 3.3) - .5) * RIV * 1.5, L = 40 + 60 * hash(i * 2.7);
        inkLine([[gx, gy], [gx + L, gy]], 3, hash(i * 5.1) > .5 ? JZ.cream : JZ.blueLt, 'ink', 0);
      }
      const [ba, bi] = sinceBeat(t);
      const cxw = screenToWorld(W * .55, H * .5, c);
      for (let q = 0; q < 3; q++) { const bb = bi - q, a = t - B(bb), rx = Math.floor(cxw[0] / 400) * 400 + 400 * ((bb * 7) % 5 - 2); ripples(rx, rivY(rx) + ((bb * 13) % 5 - 2) * 50, [a], { key: 'riv' + (bb % 6), flat: .45, speed: 300, life: 1.5, sw: 5, rings: 2 }); }
      // bridges across the river, with lamps
      for (let i = Math.floor(x0 / 1680); i <= x1 / 1680; i++) {
        boilSeed('bridge' + i); const bx = i * 1680 + 300, ry = rivY(bx + 55);
        block([[bx + 14, ry - RIV - 20], [bx + 124, ry - RIV - 20], [bx + 124, ry + RIV + 40], [bx + 14, ry + RIV + 40]], JZ.ink, { op: 140, misK: 0 });
        block(rectPts(bx, ry - RIV - 40, 110, RIV * 2 + 80), mixCol(JZ.ink2, JZ.smoke, .15), { ink: JZ.ink, sw: 1.5 });
        for (let k = 0; k < 6; k++) { const ly = ry - RIV + k * RIV * 2 / 5; paint(ellPts(bx + 8, ly, 7, 7, 8), { wash: JZ.mustLt, ink: null }); paint(ellPts(bx + 102, ly, 7, 7, 8), { wash: JZ.mustLt, ink: null }); }
      }
    }
    for (let i = Math.floor(x0 / G); i <= Math.floor(x1 / G); i++) for (let j = Math.floor(y0 / G); j <= Math.floor(y1 / G); j++) {
      const bx = i * G, by = j * G;
      if (d === 2 && Math.abs(by + G / 2 - rivY(bx + G / 2)) < RIV + G * .62) continue;
      const [sx, sy] = toScreen(bx + G / 2, by + G / 2);
      if (sx < -G * c.zoom || sx > W + G * c.zoom || sy < -G * c.zoom || sy > H + G * c.zoom) continue;
      roofBlock(bx + ST / 2, by + ST / 2, G - ST, i * 101 + j * 7919, d, c.zoom, t);
    }
    // street lamps at the crossings, and a car or two on the avenues
    for (let i = Math.floor(x0 / G); i <= Math.floor(x1 / G); i++) for (let j = Math.floor(y0 / G); j <= Math.floor(y1 / G); j++) {
      const lx = i * G, ly = j * G;
      if (d === 2 && Math.abs(ly - rivY(lx)) < RIV + 60) continue;
      const [sx, sy] = toScreen(lx, ly); if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) continue;
      boilSeed('lamp' + i + '_' + j);
      paint(ellPts(lx, ly, 9, 9, 8), { wash: JZ.mustLt, ink: null });
      if (hash(i * 3 + j * 7) > .5) glow(lx, ly, 70, '#FFC766', .5);
      const cx = lx + ((hash(i * 9 + j) + t * .35) % 1) * G, cy = ly + (hash(j) > .5 ? -16 : 16);
      if (hash(i * 5 + j * 11) > .45) { paint(rectPts(cx - 22, cy - 11, 44, 22), { wash: hash(i + j) > .5 ? JZ.cream : JZ.orange, ink: JZ.ink, sw: .9 }); paint(ellPts(cx + 26, cy, 10, 7, 8), { wash: JZ.mustLt, washOp: 160, ink: null }); }
    }
  }
  // wisps of cloud between the city and the road, only when the camera is high
  function clouds(t, a) {
    if (a < .05) return;
    for (let i = 0; i < 5; i++) {
      boilSeed('cloud' + i);
      const sp = 900 + 400 * hash(i * 2.1), x = W + 400 - ((t * sp + hash(i) * 3000) % (W + 1200)), y = 120 + hash(i * 4.7) * 700;
      const L = (200 + 160 * hash(i * 3)) * clamp(a * 1.5), hh = 10 + 8 * hash(i * 5);
      if (L > 20) paint(ellPts(x, y, L, hh, 20, 2), { wash: mixCol(JZ.cream, JZ.blueLt, .25), ink: null });
    }
  }
  // the road and the rider. o: zs = the sky camera's zoom (the pull-out / the push into the bell), d = district
  function flight(t, d, o = {}) {
    const ac = altC(t), zc = lerp(1.6, .46, ac), [ba] = sinceBeat(t), bp = bpOf(t);
    const wx = (t - (d === 1 ? T63 : T65)) * 520 + (d === 1 ? 0 : 900), wy = d === 1 ? 180 * Math.sin(t * .23) : rivY(wx + 300) * .6 + 120;
    camBegin(wx, wy, zc * (o.cityZ ?? 1), d === 1 ? -.34 : -.22);
    cityPlan(t, d, CAM);
    camEnd();
    // the road: sampled along the melody, from TB seconds ago to TA ahead
    const N = 34, road = [];
    for (let i = 0; i <= N; i++) road.push(roadPt(t, t - TB + i / N * (TB + TA), ac));
    const sh = 40 + 260 * ac, shp = road.map(([x, y]) => [x + sh * .55, y + sh]);
    boilSeed('road-shadow'); paint(ribbon(shp, 70, 70), { wash: JZ.ink, washOp: 110, ink: null });
    const foot = roadPt(t, t, ac), ahead = roadPt(t, t + .06, ac), slope = Math.atan2(ahead[1] - foot[1], ahead[0] - foot[0]);
    boilSeed('rider-shadow'); paint(ellPts(foot[0] + sh * .55, foot[1] + sh - 10, 110, 44, 16), { wash: JZ.ink, washOp: 120, ink: null });
    clouds(t, ac * 1.3 - .3);
    const zs = o.zs ?? 1, zcx = o.zcx ?? W / 2, zcy = o.zcy ?? H / 2;
    camBegin(zcx, zcy, zs, o.zrot || 0);
    const om = TB + TA, tw = 4;
    ribbonL(road, (o.roadW ?? 96), t, { key: 'road', twist: tw, tspeed: -tw * Math.PI / om, ph: 0, sw: 1.4 / Math.max(1, zs * .6) });
    // the saxophonist surfs the line, leaning into the slope, bouncing on the beat
    const u = RU, swing = Math.sin(bp * Math.PI / 2), sq = .06 * hitK(ba, 7) + (o.sq || 0), rot = clamp(slope * .8, -.45, .45) + .05 + .04 * swing;
    const mid = soloMidi(t);
    const sx = saxist(foot[0], foot[1] + 4, u, t, { sq, rot, shine: frac(.1 + (mid - 50) / 20), glow: 1, key: 'fl', boilKey: 'fl-sax', aL: .1 + .12 * swing, noShadow: true });
    // the fresh ribbon from the bell arcs forward and lays the road just ahead
    const end = road[N], b = sx.bell;
    // a flowing S along the chord from the bell to the road's end: up out of the bell, over, and down into the road
    const ex = end[0] + 20, ey = end[1] - 4, dx = ex - b[0], dy = ey - b[1], dl = Math.hypot(dx, dy) || 1, nx = dy / dl, ny = -dx / dl;
    const A = 58 + 12 * swing, fresh = [];
    for (let i = 0; i <= 8; i++) { const q = i / 8, o = A * Math.sin(TAU * q + .25 * Math.sin(t * 3)) * Math.sin(Math.PI * Math.min(1, q * 1.4 + .15)); fresh.push([b[0] + dx * q + nx * o, b[1] + dy * q + ny * o]); }
    ribbonL(fresh, 64 * (1 + .25 * hitK(ba, 6)), t, { key: 'fresh', twist: 1, tspeed: 2, sw: 1.2 / Math.max(1, zs * .6), shine: 1 });
    camEnd();
    return { bell: sx.bell, u, rot, sq, foot };
  }

  // ---------- O2b · the road over downtown (109.35–112.84, bars 63–64) ----------
  // Pull out of the ribbon's orange: the saxophonist surfs it high over the city. Bar 64 beat 3: the camera turns to
  // the horn and flies into its bell.
  function O2b(t, lt, dur) {
    plate('O2b');
    const po = easeOut(seg(lt, 0, .8));
    const pb = easeIn(seg(t, B(4 * 64 + 2.4), T65));
    const ac = altC(t), foot = roadPt(t, t, ac);
    // the bell's position, from the rider's pose (side view: bell at (7.26u, -3.49u) from the feet)
    const u = RU, bell = [foot[0] + 7.26 * u * Math.cos(.05) + 3.49 * u * Math.sin(.05), foot[1] + 4 - 3.49 * u];
    const tgt = po < 1 ? roadPt(t, t + .3, ac) : bell;
    const zs = po < 1 ? lerp(5.5, 1, po) : Math.exp(pb * 2.3);
    const k = po < 1 ? 1 - po : pb;
    flight(t, 1, { zs, zcx: lerp(W / 2, tgt[0], k), zcy: lerp(H / 2, tgt[1], k), roadW: 96 * (1 + 2.5 * (1 - po)), cityZ: 1 + .6 * pb });
    // the push into the bell: its dark mouth opens round the lens
    if (pb > .3) {
      const q = seg(pb, .3, 1), r = lerp(1.25 * u * 1.15 * 4, 1600, easeIn(q)), sc = [W / 2, H / 2];
      boilSeed('bell-mouth');
      paint(ellPts(sc[0], sc[1], r * 1.16, r * lerp(.45, 1.1, q), 40, 0, -.25 * (1 - q)), { wash: JZ.brass, ink: JZ.ink, sw: 2 });
      paint(ellPts(sc[0], sc[1], r, r * lerp(.4, 1, q), 40, 0, -.25 * (1 - q)), { wash: JZ.brassDk, ink: JZ.ink, sw: 1.6 });
      paint(ellPts(sc[0], sc[1], r * .82, r * lerp(.32, .84, q), 40, 0, -.25 * (1 - q)), { wash: JZ.ink2, ink: null });
      glow(sc[0] - r * .7, sc[1] - r * .2, r * .5, '#FFE7A8', .5);
    }
    if (lt < .05) { boilSeed('O2b-in'); flash(1, JZ.orange); }
  }

  // ---------- O2c · through the horn, out over the river district (112.84–119.81, bars 65–68) ----------
  function O2c(t, lt, dur) {
    plate('O2c');
    const open = easeIn(seg(t, B(4 * 65 + .9), B(4 * 65 + 1.9)));   // the far end of the horn opens round the lens
    if (open > 0) flight(t, 2, { cityZ: 1 + 1.4 * (1 - open), zs: 1 + 1.2 * (1 - easeOut(seg(t, B(4 * 65 + 1.2), B(4 * 65 + 3)))) });
    if (open < 1) {
      const hr = open * 1400;
      boilSeed('tube');
      if (hr > 4) irisShape(ellPts(960, 540, hr, hr * .92, 40), JZ.brassDk); else ground(JZ.brassDk);
      glow(960, 540, 260 + 900 * open, '#FFE7A8', .8);
      // the horn's rings rush past: each grows from the far end and out past the frame
      for (let i = 0; i < 7; i++) {
        const ph = frac(lt * 2.4 + i / 7), r = 60 * Math.exp(ph * 3.4);
        if (r < hr + 10) continue;
        boilSeed('ring' + i);
        inkLine(ellPts(960, 540, r, r * .92, 44).concat([[960 + r, 540]]), 5 + r * .05, i % 2 ? JZ.brass : JZ.brassLt, 'ink', .5);
        inkLine(ellPts(960, 540, r * 1.04, r * .96, 44).concat([[960 + r * 1.04, 540]]), 1.6 + r * .01, JZ.ink, 'ink', .5);
      }
      // pearl keys flash by at the rim
      for (let i = 0; i < 4; i++) {
        const ph = frac(lt * 1.3 + i * .27), r = 120 * Math.exp(ph * 3), a = i * 1.7 + .6;
        if (r < hr + 40) continue;
        boilSeed('pearl' + i);
        paint(ellPts(960 + Math.cos(a) * r, 540 + Math.sin(a) * r * .9, 16 + r * .09, 15 + r * .085, 16), { wash: JZ.cream, ink: JZ.ink, sw: 1.4 });
      }
      inkLine(ellPts(960, 540, hr, hr * .92, 40).concat([[960 + hr, 540]]), 3, JZ.ink, 'ink', .5);
    }
    // out: the sax's last note sweeps its ribbon across the frame (covered on the bar line)
    ribbonWipe(seg(t, B(4 * 68 + 3), T69) * .5, t);
  }

  // ---------- the sax's exit: its last note sweeps a giant ribbon across the frame (p 0 → .5 covers, .5 → 1 leaves) ----------
  function ribbonWipe(p, t) {
    if (p <= 0 || p >= 1) return;
    const a = -.5, d = [Math.cos(a), Math.sin(a)], n = [-d[1], d[0]];
    const off = p < .5 ? lerp(2250, 0, ease(p * 2)) : lerp(0, -2250, ease((p - .5) * 2));
    const band = (o, w, key, tw, ph) => {
      const P = [];
      for (let i = 0; i <= 14; i++) { const s = -1900 + i * 3800 / 14, wv = 60 * Math.sin(s / 280 + t * 5 + ph); P.push([960 + d[0] * s + n[0] * (o + wv), 540 + d[1] * s + n[1] * (o + wv)]); }
      ribbonL(P, w, t, { key, twist: tw, tspeed: tw ? 3 : 0, flat: !tw, sw: 2.2 });
    };
    band(off + 1330, 230, 'wipe-lead', 3, 1);   // a twisting lead strand ahead of the edge
    band(off, 2400, 'wipe', 0, 0);
    boilSeed('wipe-fold'); const fo = off - 900;   // a darker fold across the broad face
    inkLine([[960 - d[0] * 1600 + n[0] * fo, 540 - d[1] * 1600 + n[1] * fo], [960 + d[0] * 1600 + n[0] * fo, 540 + d[1] * 1600 + n[1] * fo]], 26, JZ.orangeDk, 'ink', .3);
  }

  // ---------- O3 · the trumpet on the rooftop (119.81–126.80, bars 69–72) ----------
  // The trumpet's notes, read off its phrase (the pitch tracker is flat here): [onset, length, size 0..2]. Each note
  // throws a searchlight fan of rays across the sky; the long ones (122.2, 124.8) throw the widest and crane the camera.
  const TRN = [[120.06, .4, 0], [121.47, .45, 1], [121.85, .2, 0], [122.22, .42, 2], [122.81, .22, 0], [123.22, .3, 1], [123.97, .2, 0], [124.39, .3, 1], [124.81, .62, 2], [125.72, .3, 1], [126.31, .35, 1]];
  const noteEnv = (t, t0, h) => seg(t, t0 - .04, t0 + .03) * (1 - seg(t, t0 + h, t0 + h + .16));
  const trpBlow = t => TRN.reduce((m, [t0, h]) => Math.max(m, noteEnv(t, t0, h)), 0);
  const trpLong = t => TRN.reduce((m, [t0, h, c]) => c === 2 ? Math.max(m, ease(seg(t, t0 - .1, t0 + .3)) * (1 - ease(seg(t, t0 + h, t0 + h + .9)))) : m, 0);
  const TX = 560, TY = 820, TU = 44;
  function skyline(t, key, y0, col, n, hMin, hMax, wCol, seed) {
    for (let i = 0; i < n; i++) {
      boilSeed(key + i);
      const x = -300 + i * (2600 / n) + 60 * hash(seed + i * 1.7), w = 2600 / n * (.7 + .5 * hash(seed + i * 2.3)), h = hMin + (hMax - hMin) * hash(seed + i * 3.9);
      block(rectPts(x, y0 - h, w, h + 600), col, { ink: JZ.ink, sw: 1.1 });
      if (hash(seed + i * 5.3) > .6) block(rectPts(x + w * .4, y0 - h - 40, w * .2, 40), col, { ink: JZ.ink, sw: .9 });
      for (let a = 0; a < 3; a++) for (let b = 0; b < 5; b++) {
        if (hash(seed + i * 11 + a * 3.1 + b * 7.7) > .3) continue;
        paint(rectPts(x + w * (.18 + a * .26), y0 - h + 30 + b * 46, w * .12, 24), { wash: wCol, ink: null });
      }
    }
  }
  function trumpetScene(t) {
    plate('O3');
    const [ba] = sinceBeat(t), bp = bpOf(t), lt = t - T69;
    const blow = trpBlow(t), lg = trpLong(t);
    // breaths: a small one before the first note, a big one before the phrase (bar 70)
    const br1 = Math.sin(Math.PI * seg(t, T69 + .02, 120.04)), br2 = Math.sin(Math.PI * seg(t, 120.95, 121.45));
    const att = agesAt(t, TRN.map(n => bpOf(n[0]))).reduce((m, a) => Math.max(m, hitK(a, 9)), 0);
    const rot = -.12 - .06 * br2 - .05 * blow - .2 * lg + .025 * Math.sin(bp * Math.PI / 2);
    const sq = -.1 * br2 - .05 * br1 + .09 * att - .08 * lg + .03 * hitK(ba, 7);
    // the camera follows the phrase: wide for the first note, a push in through bars 70–71 to the puffing cheeks, a
    // crane up the long note's searchlights (124.8) into the sky, and a settle for the handoff
    const [cx, cy, cz] = kf(t, [[T69, [960, 540, 1]], [121.4, [950, 540, 1.02]], [B(4 * 70 + 3), [910, 535, 1.12]], [B(4 * 71 + 3), [800, 560, 1.3]], [124.78, [790, 555, 1.32]], [125.5, [1120, 330, 1.0]], [126.8, [1020, 420, 1.04]]]);
    camBegin(cx + 10 * Math.sin(lt * .5), cy, cz + .012 * att);
    boilSeed('O3-sky'); ground(JZ.blueDk, { tex: 20 });
    halftone('ramp', 960, 700, 3000, 900, JZ.blue, .5);
    for (let i = 0; i < 70; i++) {
      boilSeed('O3-star' + (i % 7));
      const x = -400 + hash(i * 2.7) * 2800, y = -500 + hash(i * 5.1) * 1000, r = 2 + 3 * hash(i * 9.3), tw = .6 + .4 * Math.sin(t * (2 + hash(i) * 3) + i);
      paint(ellPts(x, y, r * tw, r * tw, 8), { wash: JZ.cream, ink: null });
    }
    skyline(t, 'O3-far', 700, mixCol(JZ.blue, JZ.blueLt, .25), 11, 160, 480, mixCol(JZ.blueLt, JZ.mustLt, .4), 11);
    skyline(t, 'O3-mid', 860, JZ.blue, 9, 60, 260, JZ.mustard, 23);
    // the rooftop: an ink slab with a parapet, a water tower on stilts, a chimney
    boilSeed('O3-roof');
    block(rectPts(-400, TY, 1720, 700), JZ.ink, { ink: JZ.ink, sw: 1.6 });
    block(rectPts(-400, TY - 22, 1720, 26), JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    boilSeed('O3-tower');
    for (const lx of [110, 250]) inkLine([[lx, TY - 20], [lx + (lx < 200 ? 20 : -20), TY - 190]], 5, JZ.ink2, 'ink', 0);
    inkLine([[120, TY - 60], [240, TY - 150]], 3, JZ.ink2, 'ink', 0);
    block([[90, TY - 190], [270, TY - 190], [262, TY - 390], [98, TY - 390]], JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    block([[80, TY - 390], [280, TY - 390], [180, TY - 470]], JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    for (let k = 0; k < 3; k++) inkLine([[100, TY - 240 - k * 50], [260, TY - 240 - k * 50]], 1.2, JZ.blueDk, 'inkfine', 0);
    block(rectPts(1080, TY - 150, 70, 150), JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    // the saxophonist, done, a silhouette sitting on the next roof to listen
    boilSeed('O3-roof2'); block(rectPts(1400, TY - 80, 1300, 900), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    block(rectPts(1400, TY - 100, 1300, 24), JZ.ink, { ink: JZ.ink, sw: 1 });
    const nod = .05 * Math.sin(bp * Math.PI / 2);
    saxist(1640, TY - 100, 22, t, { sil: JZ.ink, flip: true, sq: .1, rot: -.06 + nod, aL: -.3, boilKey: 'O3-sil', key: 'O3s' });
    // the rays: one searchlight fan per note, from the bell, swinging as the note holds
    const u = TU, co = Math.cos(rot), si = Math.sin(rot), lx = 9.04 * u * (1 + .6 * sq), ly = -4.475 * u * (1 - sq);
    const bell = [TX + lx * co - ly * si, TY + lx * si + ly * co];
    TRN.forEach(([t0, h, c], i) => {
      const age = t - t0; if (age < 0 || age > h + .5) return;
      const sgn = i % 2 ? 1 : -1, dir = rot - .32 - .22 * hash(i * 3.1) + sgn * .28 * ease(seg(age, 0, h + .5));
      rays(bell[0], bell[1], dir, age, { hold: h, n: [3, 5, 7][c], len: [1000, 1400, 1900][c], spread: [.16, .3, .6][c], w: [16, 28, 42][c], key: 'O3r' + i, seed: i, sw: 1.2 });
    });
    const face = emotions(t, [[T69, 'neutral', { eyes: 'closed' }], [126.72, 'happy', { lookX: 1 }]], { take: .4 });
    const pass = ease(seg(t, 126.7, 127.1));
    trumpeter(TX, TY, TU, t, { blow, rot: rot + .16 * pass, sq: sq + (face.sq || 0) * pass, dy: -.25 * br2 + (face.dy || 0) * pass, shine: frac(.2 + lt * .35), boilKey: 'O3-tp', key: 'O3t', aL: .75 + .05 * blow - .5 * pass,
      ...(t > 126.6 ? { eyes: face.eyes, mouth: face.mouth, squint: face.squint, lookX: face.lookX, blush: .4 } : {}) });
    camEnd();
  }
  // O3's cutaway (bar 70 beat 4 → bar 71 beat 4, both snare backbeats): a low angle up between the towers. The
  // trumpeter is a silhouette on the left roof; each note's searchlight fan sweeps the sky over the skyline, and the
  // windows light up as a beam passes over them, then fade.
  const LOW0 = B(4 * 70 + 3), LOW1 = B(4 * 71 + 3);
  const LOWB = (() => {   // the towers: [x, width, top y, colour]
    const L = [[-60, 420, 470, JZ.ink], [1560, 420, 170, JZ.ink2], [1330, 250, 330, JZ.blueDk], [360, 230, 640, JZ.ink2]];
    for (let i = 0; i < 5; i++) L.push([600 + i * 150 + 40 * hash(i * 2.3), 150 + 60 * hash(i * 4.1), 430 + 260 * hash(i * 6.7), i % 2 ? mixCol(JZ.blueDk, JZ.blue, .45) : JZ.blueDk]);
    return L.sort((a, b) => a[2] - b[2]).reverse();
  })();
  const lowDir = (i, age, h) => -.5 - .15 * hash(i * 7.3) + .72 * ease(seg(age, 0, h + .2));   // each beam rakes down over the towers
  function lowAngle(t) {
    plate('O3-low');
    const lt = t - LOW0, blow = trpBlow(t);
    const att = agesAt(t, TRN.map(n => bpOf(n[0]))).reduce((m, a) => Math.max(m, hitK(a, 9)), 0);
    camBegin(960, lerp(560, 500, ease(seg(t, LOW0, LOW1))), 1.04 + .03 * lt + .01 * att, -.05);
    boilSeed('low-sky'); ground(JZ.blueDk, { tex: 20 });
    halftone('ramp', 960, 900, 2600, 1200, JZ.blue, .55);
    for (let i = 0; i < 60; i++) {
      boilSeed('low-star' + (i % 7));
      const x = -200 + hash(i * 4.3) * 2400, y = -100 + hash(i * 2.9) * 700, r = 2 + 3 * hash(i * 7.7);
      paint(ellPts(x, y, r, r, 8), { wash: JZ.cream, ink: null });
    }
    // the trumpeter on the left roof, a silhouette; its bell is where the beams start
    const u = 22, rot = -.12 - .08 * blow, sq = .08 * att;
    const lx = 9.04 * u * (1 + .6 * sq), ly = -4.475 * u * (1 - sq), fx = 250, fy = 470;
    const bell = [fx + lx * Math.cos(rot) - ly * Math.sin(rot), fy + lx * Math.sin(rot) + ly * Math.cos(rot)];
    const beams = [];
    TRN.forEach(([t0, h, c], i) => {
      const age = t - t0; if (age < 0 || age > h + .5) return;
      rays(bell[0], bell[1], lowDir(i, age, h), age, { hold: h, n: [3, 5, 7][c], len: 2600, spread: [.12, .22, .4][c], w: [22, 36, 52][c], key: 'low' + i, seed: i, sw: 1.3 });
    });
    // a window is lit if a beam covered it in the last 0.4 s (its angle from the bell inside a live fan)
    const litAt = (wx, wy) => {
      const a = Math.atan2(wy - bell[1], wx - bell[0]); let L = 0;
      for (let s = 0; s < 5; s++) {
        const tau = t - s * .1;
        TRN.forEach(([t0, h, c], i) => {
          const age = tau - t0; if (age < .05 || age > h + .3) return;
          if (Math.abs(a - lowDir(i, age, h)) < [.12, .22, .4][c] / 2 + .05) L = Math.max(L, 1 - s * .2);
        });
      }
      return L;
    };
    LOWB.forEach(([x, w, top, col], i) => {
      boilSeed('low-bld' + i);
      block(rectPts(x, top, w, 1400 - top), col, { ink: JZ.ink, sw: 1.4 });
      if (i % 3 === 0) { block(rectPts(x + w * .4, top - 70, 10, 70), col, { ink: JZ.ink, sw: .9 }); }
      const cw = 44, nx = Math.floor((w - 30) / cw), ny = Math.floor((1080 - top) / 64);
      for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) {
        if (hash(i * 31 + a * 3.1 + b * 7.9) > .55) continue;
        const wx = x + 18 + a * cw, wy = top + 30 + b * 64, L = x > 500 ? litAt(wx + 12, wy + 18) : 0;
        paint(rectPts(wx, wy, 24, 36), { wash: L > .05 ? mixCol(mixCol(col, JZ.ink, .3), JZ.mustLt, L) : mixCol(col, JZ.ink, .3), ink: null });
        if (L > .6) glow(wx + 12, wy + 18, 40, '#FFD27A', .5 * L);
      }
    });
    // the water tower on the tall right tower, and the trumpeter's silhouette on the left roof
    boilSeed('low-tower');
    block([[1640, 170], [1780, 170], [1772, 20], [1648, 20]], JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    block([[1630, 20], [1790, 20], [1710, -50]], JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    trumpeter(fx, fy, u, t, { sil: JZ.ink, blow, rot, sq, boilKey: 'low-tp', key: 'lowt' });
    camEnd();
  }
  function O3(t, lt, dur) {
    if (t >= LOW0 && t < LOW1) lowAngle(t); else trumpetScene(t);
    ribbonWipe(.5 + seg(t, T69, T69 + .36) * .5, t);
  }

  // ---------- O4 · the piano's staircase to the moon (126.80–132.03, bars 73–75) ----------
  // The piano takes the frame back the way it gave it up in O1: a checkerboard flips over the trumpet (the right half on
  // beat 1, the left on beat 2: a split-screen trade), then the tiles hop away. The run builds a staircase of keys
  // as the melody rises, and the pianist climbs it (see below). The descending end of the run knocks the steps down
  // behind it; the camera settles on the moon: a mustard disc, r = 260, centred at (960, 400) on dark blue, held from
  // 131.6: the disc the next section opens on.
  // The climb is locked to the run: the pianist hops a step on each eighth note from beat 3 of bar 73, pauses on the
  // dip (129.0–129.2, it looks up at the moon), takes the next two steps in one leap as the line climbs back, and lands
  // on the top step on the downbeat of bar 75. The camera climbs with it (the note's height lifts the camera a little
  // above the pianist, the dip lets it sag), the moon rises into the sky at 128.5 and grows as they climb, then the
  // camera keeps rising past the pianist and the moon settles to the disc the next section starts on.
  const NS = 13, STW = 200, STR = 150, KEYH = 360, PU = 30;
  const stepPos = k => [600 + k * STW, 900 - k * STR];
  const stepNote = k => 57 + k * 19.5 / (NS - 1);
  const HOPS = [];   // [takeoff, landing, from step, to step]
  (function () {
    let k = 0;
    for (let n = 0; n <= 12; n++) {
      if (n === 6 || n === 7) continue;
      const t0 = beatT(4 * 73 + 2 + n / 2) - .09, to = Math.min(NS - 1, k + (n === 8 ? 2 : 1));
      HOPS.push([t0, t0 + (n === 8 ? .24 : .16), k, to]); k = to;
    }
  })();
  const LAND = Array(NS).fill(1e9); LAND[0] = T73 + .3;
  HOPS.forEach(([, t1, , to]) => { LAND[to] = t1; });
  const STEP_IN = [], STEP_OUT = [];
  (function () {   // each step lands when the run first reaches its note (always before the pianist needs it)
    for (let k = 0; k < NS; k++) {
      let a = null;
      for (let t = T73 + .45; t < 130.3 && a == null; t += 1 / 96) if (pitchS(t, .12) >= stepNote(k)) a = t;
      STEP_IN.push(k < 2 ? T73 + .1 + k * .06 : Math.min(LAND[k] - .5, Math.max(T73 + .6 + k * .03, a ?? 130)));
      STEP_OUT.push(k === NS - 1 ? 1e9 : 130.45 + k * .07);   // the run's descent: the stairs crumble from the bottom
    }
  })();
  // the pianist: [x, y of the feet, hop progress 0..1 or -1 standing, the step it stands on or is heading to]
  function rider(t) {
    let st = 0;
    for (const [t0, t1, a, b] of HOPS) {
      if (t < t0) break;
      if (t < t1) { const q = (t - t0) / (t1 - t0), p0 = stepPos(a), p1 = stepPos(b), h = b - a > 1 ? 150 : 70;
        return [lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q) - 8 - h * 4 * q * (1 - q), q, b]; }
      st = b;
    }
    const p = stepPos(st); return [p[0], p[1] - 8, -1, st];
  }
  function o4Cam(t) {
    // follow the pianist smoothly (an average of where it is and just was), lifted by the note's height
    let x = 0, y = 0; for (let i = 0; i < 5; i++) { const r = rider(t - i * .05); x += r[0] / 5; y += r[1] / 5; }
    const lift = 120 * (clamp((pitchS(t, .4) - 60) / 15) - .5) * seg(t, 127.6, 128);
    const up = ease(seg(t, 130.85, 131.6));
    return [x + 60, y - 110 - lift - 1100 * up, 1];
  }
  function moonAt(t) {   // the moon in screen space: rises in at 128.5, grows as they climb, settles at (960, 400) r 260
    const g = ease(seg(t, 128.45, 131.6)), inn = easeOut(seg(t, 128.4, 128.95));
    return [lerp(1440, 960, g), lerp(150, 400, g) - 380 * (1 - inn), lerp(95, 260, g)];
  }
  // one step: a piano key standing on end, hanging from its tread (x, y = the tread's centre); q = flip-in 0..1
  function stepKey(x, y, col, q, rot, s, lit) {
    const f = clamp(q), sx = Math.max(.06, Math.abs(Math.cos(Math.PI * f))), c = f < .5 ? (col === JZ.ink ? JZ.cream : JZ.ink) : col;
    const w = (STW - 8) * sx * s, h = KEYH * s, co = Math.cos(rot), si = Math.sin(rot);
    const R = ([a, b]) => [x + a * co - b * si, y + a * si + b * co];
    paint([[-w / 2, -8], [w / 2, -8], [w / 2, h], [-w / 2, h]].map(R), { wash: c, ink: JZ.ink, sw: 1.6 });
    if (lit > .02) paint([[-w / 2 + 6, -2], [w / 2 - 6, -2], [w / 2 - 6, 10 + 60 * lit], [-w / 2 + 6, 10 + 60 * lit]].map(R), { wash: mixCol(c, JZ.mustLt, clamp(lit * 1.4)), ink: null });
  }
  function o4World(t) {
    plate('O4');
    const [cx, cy, z] = o4Cam(t), [ba1] = sinceBeat(t);
    camBegin(cx, cy, z);
    boilSeed('O4-sky'); ground(JZ.blueDk, { tex: 20 });
    halftone('ramp', cx, cy + 700, 3200, 1400, JZ.blue, .35 * (1 - seg(t, 130.4, 131.3)));
    const fadeS = 1 - seg(t, 131.1, 131.6);
    for (let i = 0; i < 110; i++) {
      boilSeed('O4-star' + (i % 9));
      const x = -400 + hash(i * 3.7) * 4000, y = -2600 + hash(i * 6.1) * 3800, r = (2 + 3.5 * hash(i * 8.3)) * (.6 + .4 * Math.sin(t * (2 + 3 * hash(i)) + i));
      if (fadeS > .02) paint(ellPts(x, y, r * fadeS, r * fadeS, 8), { wash: JZ.cream, ink: null });
    }
    camEnd();
    // the moon (screen space, on-register, so the disc lands exactly where the next section's does)
    const [mx, my, mr] = moonAt(t);
    if (my + mr > -40) {
      boilSeed('O4-moon');
      glow(mx, my, mr * 2.2, '#FFD890', .6);
      block(ellPts(mx, my, mr, mr, 48), JZ.mustard, { misK: 0 });
      halftone('disc', mx + mr * .25, my + mr * .2, mr * 1.2, mr * 1.2, JZ.mustDk, .5);
    }
    camBegin(cx, cy, z);
    const R = rider(t), standK = R[2] < 0 ? R[3] : -1;
    // the stairs: keys that flip up into place on the run; each lights as the pianist lands on it and glows on
    // while it stands there; they crumble behind it at the end
    for (let k = 0; k < NS; k++) {
      boilSeed('O4-step' + k);
      const [x, y] = stepPos(k), a = t - STEP_IN[k], f = t - STEP_OUT[k];
      if (a < 0) continue;
      let yy = y, rot = 0, q = 1, s = 1;
      if (a < .24) { const e = a / .24; yy = lerp(y + 560, y, easeOut(e)); q = e; rot = (1 - e) * (k % 2 ? .5 : -.5); }
      s *= 1 + (a >= .24 ? spring(t, STEP_IN[k] + .24, 10, 28) * .1 : 0);
      const la = t - LAND[k];
      if (la >= 0) yy += 14 * Math.exp(-la * 12) * Math.cos(la * 30);   // the key dips under the landing
      if (f > 0) { yy += 1800 * f * f + 120 * f; rot = (k % 2 ? 1 : -1) * f * 3; }
      if (toScreen(x, yy)[1] > H + 100 || toScreen(x, yy)[1] < -KEYH - 100) continue;
      const lit = la < 0 || f > 0 ? 0 : k === standK ? 1 : Math.exp(-(t - (HOPS.find(h => h[2] === k)?.[0] ?? t)) * 4);
      if (lit > .1) glow(x, yy, 150, '#FFE2A0', .7 * lit);
      stepKey(x, yy, k % 2 ? JZ.ink : JZ.cream, q, rot, s, lit);
    }
    // the pianist: spectacles and beanie, hopping its own run, a look up at the moon on the dip, and on the top step
    const [px, py, hq] = R, top = R[3] === NS - 1 && hq < 0;
    const air = hq >= 0 ? Math.sin(Math.PI * hq) : 0, land = LAND[R[3]] <= t ? hitK(t - LAND[R[3]], 9) : 0;
    const dip = seg(t, 128.9, 129.05) * (1 - seg(t, 129.3, 129.4));
    const mood = emotions(t, [[T73, 'determined'], [128.95, 'hopeful', { lookY: -1, lookX: .6 }], [129.35, 'determined'], [130.35, 'starstruck', { lookY: -1, lookX: .5 }]], { take: .5 });
    const look = seg(t, 130.35, 130.7);
    clawd(px, py, PU, { ...mood, hat: ['specs', 'beanie'], view: 'q', dy: 0, walk: hq >= 0 ? hq * 2 : 0,
      sq: (mood.sq || 0) - .16 * air + .2 * land + (hq < 0 && !top ? .08 * hitK(ba1, 8) : 0), rot: (mood.rot || 0) * .4 + .05 * air,
      smear: air > .6 && HOPS.some(h => h[3] - h[2] > 1 && t >= h[0] && t < h[1]) ? .6 : 0, smearDir: 1,
      aL: top ? 1.1 * look : dip > 0 ? .9 * dip : .5 * air + .15, aR: top ? .8 * look : dip > 0 ? .4 * dip : -.3 + .4 * air, boilKey: 'O4-climb', noShadow: true });
    camEnd();
  }
  function O4(t, lt, dur) {
    const b1 = T73, b2 = B(4 * 73 + 1), sc = B(4 * 73 + 1.55);
    if (t < sc) trumpetScene(t); else o4World(t);
    // the trade: the checkerboard flips in over the right half on beat 1, over the left on beat 2, then hops away
    const cell = 120;
    if (t < sc + .42) for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) {
      boilSeed('O4-t' + i + '_' + j);
      const x = (i + .5) * cell, y = (j + .5) * cell, right = i >= 8;
      const tin = (right ? b1 + (i - 8) * .022 : b2 + (7 - i) * .022) + j * .008, q = (t - tin) / .16;
      if (q < .5) continue;
      const d = Math.hypot(x - 700, y - 700) / 1400 * .16, off = seg(t, sc + d, sc + d + .24);
      if (off >= 1) continue;
      const k = easeIn(off), ang = Math.atan2(y - 700, x - 700);
      flipTile(x + Math.cos(ang) * 240 * k, y + Math.sin(ang) * 240 * k - 80 * Math.sin(Math.PI * off), cell, null, tileCol(i, j, 0), q,
        { s: 1 - k, rot: (hash(i * 5 + j * 11) - .5) * 2.2 * k, lift: cell * .14, sw: 1.4 });
    }
  }

  shots([[T60, O1], [T61, O2a], [T63, O2b], [T65, O2c], [T69, O3], [T73, O4]]);
})();
