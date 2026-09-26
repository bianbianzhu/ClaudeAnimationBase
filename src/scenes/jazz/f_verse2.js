// jazz/f_verse2.js: shots P1–P5 (verse 2) and Q1–Q3 (bridge), 132.03–175.84 s (bars 76–100).
// Cold blue small hours on twos, then one candle. The bass drops out in bars 94–99, so the bridge stays minimal.
(() => {
  const TT = onTwos, bt = (bar, beat = 0) => beatT(bar * 4 + beat);
  const ages = (t, b0, b1) => { const a = []; for (let b = b0; b <= b1; b++) { const x = t - beatT(b); if (x >= 0) a.push(x); } return a; };
  const lastAge = (t, list) => { let a = 9; for (const b of list) { const x = t - beatT(b); if (x >= 0 && x < a) a = x; } return a; };

  // ---------- local helpers ----------
  // a flat building with rows of windows; o.win(i, j, cx, cy) returns a window colour (or null for none)
  function facade(x, y, w, h, col, o = {}) {
    boilSeed('fac' + (o.key ?? x));
    block(rectPts(x, y - h, w, h), col, { ink: o.ink === undefined ? JZ.ink : o.ink, sw: o.sw ?? 1.2 });
    const cw = o.cell ?? 46, ww = cw * .56, wh = cw * .78, nx = Math.max(1, Math.floor((w - 20) / cw)), ny = Math.max(1, Math.floor((h - 50) / (cw * 1.3)));
    const ox = x + (w - nx * cw) / 2 + cw * .22;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const wx = ox + i * cw, wy = y - h + 34 + j * cw * 1.3;
      const c = o.win ? o.win(i, j, wx + ww / 2, wy + wh / 2) : mixCol(col, JZ.ink, .35);
      if (c) paint(rectPts(wx, wy, ww, wh), { wash: c, ink: null });
    }
  }
  // the radius of ripples() ring a seconds old (the same formula as shapes.js), to sync things to a passing ring
  const ringR = (a, sp, life, r0 = 20) => r0 + sp * easeOut(Math.min(1, a / life * 1.2)) * life * .7;
  // a flame that can stretch (anticipation before the spark leaves it); returns its tip
  function flame(x, y, s, t, o = {}) {
    const f = o.f ?? 1; if (f <= .01) return [x, y];
    boilSeed('flame' + (o.key || ''));
    const st = o.stretch ?? 1, fl = 1 + .08 * Math.sin(t * 23) + .05 * Math.sin(t * 37), lean = .15 * Math.sin(t * 3.1) + (o.lean || 0);
    if (o.light !== 0) glow(x, y - 14 * s * f, 120 * s * f * (o.light ?? 1), '#FFC766', .9 * f);
    glow(x, y - 12 * s * f, 36 * s * f, '#FFE9B0', f);
    const h = 30 * s * f * fl * st, w = 8 * s * f / Math.sqrt(st);
    paint([[x - w, y], [x - w * .9, y - h * .45], [x + lean * h, y - h], [x + w * .9, y - h * .45], [x + w, y]], { wash: JZ.mustLt, fill: JZ.orange, fillOp: 90, ink: JZ.ink, sw: o.sw ?? .5 * s, curv: .7 });
    paint(ellPts(x, y - h * .25, w * .45, h * .22, 10), { wash: JZ.cream, ink: null });
    return [x + lean * h, y - h];
  }
  // the spark: a small four-point star of light
  function spark(x, y, r, t, a = 1) {
    boilSeed('spark');
    glow(x, y, r * 9, '#FFD88A', .8 * a);
    glow(x, y, r * 3, '#FFF1C8', a);
    const tw = 1 + .25 * Math.sin(t * 31);
    paint(starPts(x, y, r * 1.9 * tw, .28, 4, -Math.PI / 2 + .3 * Math.sin(t * 7)), { wash: JZ.mustLt, ink: null });
    paint(ellPts(x, y, r * .55, r * .55, 10), { wash: JZ.cream, ink: null });
  }
  // a side-view mug (x, y = bottom centre); o.saucer, o.full (surface colour), o.col
  function mug(x, y, s, o = {}) {
    boilSeed('mug' + (o.key || x));
    const sw = 1.1 * s;
    if (o.saucer) paint(ellPts(x, y, 36 * s, 7 * s, 18), { wash: o.col || JZ.cream, ink: JZ.ink, sw });
    inkLine([[x + 18 * s, y - 36 * s], [x + 32 * s, y - 32 * s], [x + 30 * s, y - 16 * s], [x + 17 * s, y - 12 * s]], 5 * s, JZ.ink, 'ink', .8);
    inkLine([[x + 18 * s, y - 36 * s], [x + 32 * s, y - 32 * s], [x + 30 * s, y - 16 * s], [x + 17 * s, y - 12 * s]], 2.6 * s, o.col || JZ.cream, 'ink', .8);
    paint([[x - 20 * s, y - 44 * s], [x + 20 * s, y - 44 * s], [x + 17 * s, y - 3 * s], [x - 17 * s, y - 3 * s]], { wash: o.col || JZ.cream, fill: JZ.smoke, fillOp: 90, tex: .5, ink: JZ.ink, sw });
    paint(ellPts(x, y - 44 * s, 20 * s, 5 * s, 16), { wash: o.full || mixCol(o.col || JZ.cream, JZ.ink, .45), ink: JZ.ink, sw: sw * .8 });
  }
  // the phone booth (local version of phoneBooth: squatter, so a Clawd fills it, the singer inside behind the glass,
  // the phone box on the left wall). x, y = foot, s = scale; o.inside() draws what's in it; returns the box's point.
  function booth(x, y, s, o = {}) {
    boilSeed('v2booth');
    const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), sw = 1.5 * s;
    block(P([[-90, 0], [90, 0], [90, -330], [-90, -330]]), JZ.verm, { ink: JZ.ink, sw });
    paint(P([[-100, -330], [100, -330], [90, -362], [-90, -362]]), { wash: JZ.vermDk, ink: JZ.ink, sw });
    paint(P(rectPts(-26, -356, 52, 18)), { wash: JZ.mustLt, ink: JZ.ink, sw: sw * .5 });
    paint(P(rectPts(-72, -312, 144, 292)), { wash: JZ.mustLt, ink: JZ.ink, sw: sw * .6 });
    halftone('ramp', x, y - 166 * s, 144 * s, 292 * s, JZ.mustard, .55);
    glow(x, y - 200 * s, 250 * s, '#FFD27A', .55 * (o.light ?? 1));
    paint(P(rrPts(-70, -196, 26, 48, 5)), { wash: JZ.ink2, ink: JZ.ink, sw: sw * .6 });
    if (o.inside) o.inside();
    boilSeed('v2booth-bars');
    const bar = (a, b, w, h) => paint(P(rectPts(a, b, w, h)), { wash: JZ.verm, ink: JZ.ink, sw: sw * .5 });
    bar(-4, -312, 8, 100); for (const yy of [-262, -56]) { bar(-72, yy, 68, 6); bar(4, yy, 68, 6); }
    return [x - 57 * s, y - 212 * s];
  }
  // a big-tile checkerboard wipe (piano): p 0 → .5 the tiles flip in from the upper right, .5 → 1 they flip out
  function tileWipe(p) {
    if (p <= 0 || p >= 1) return;
    const c = 164, nx = 12, ny = 7;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const d = ((nx - 1 - i) + j) / (nx + ny - 2) + .05 * hash(i * 7 + j * 13);
      const k = p < .5 ? clamp((p * 2 - d * .6) / .4) : 1 - clamp(((p - .5) * 2 - d * .6) / .4);
      if (k <= .02) continue;
      const e = p < .5 ? backOut(k) : ease(k), cx = i * c + c / 2 - 24, cy = j * c + c / 2 - 34;
      boilSeed('tw' + i + '_' + j);
      paint(rectPts(cx - c / 2 * e - 2, cy - c / 2 - 2, c * e + 4, c + 4), { wash: (i + j) % 2 ? JZ.ink : JZ.cream, ink: JZ.ink, sw: 1.4 });
    }
  }
  // a matchbox lying on a table (x = left, y = the table top); the striking strip is its top edge
  function matchbox(x, y, s = 1) {
    boilSeed('mbox');
    paint(rectPts(x, y - 20 * s, 62 * s, 20 * s), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 60, ink: JZ.ink, sw: 1 });
    paint(rectPts(x + 14 * s, y - 16 * s, 30 * s, 12 * s), { wash: JZ.mustard, ink: null });
    paint(rectPts(x, y - 24 * s, 62 * s, 5 * s), { wash: JZ.ink2, hatch: { d: 3, a: 1.1, b: 'charcoal', c: JZ.ink, w: .5 }, ink: JZ.ink, sw: .8 });
  }

  // ======================================================================
  // P1 · "Every memory calls your name" (132.03–136.84)
  // The moon from the solo IS the ride: it tips flat, a brush sweeps it twice (shimmer), it tips back into the moon
  // and the camera pulls back over a quiet blue city. One window per beat lights with the love's silhouette in it.
  // ======================================================================
  const MO = { x: 1500, y: 200, r: 100 }, Z0 = 260 / MO.r;
  // (everything under the moon sits below the seam frame's view, so the first frame is only sky and disc)
  const FAR = [[-120, 300, 800], [170, 260, 740], [420, 280, 820], [690, 250, 700], [930, 190, 640], [1150, 300, 480], [1450, 300, 470], [1750, 300, 480]];
  const NEAR = [[20, 540, 700], [600, 500, 640], [1140, 380, 510], [1560, 400, 520]];
  const NEARCOL = mixCol(JZ.blueDk, JZ.ink, .45);
  // the memory windows: [x, y, beat index it lights on, the love's pose]
  const MEM = [
    [110, 380, 4 * 77 + 1, { view: 'side', aL: .75, cup: true }],
    [700, 440, 4 * 77 + 2, { view: 'front', aR: 1.35, aL: -.4, wave: true }],
    [1260, 560, 4 * 77 + 3, { view: 'q', aL: 1.1, aR: .9, dance: true }],
    [1680, 560, 4 * 78 + 0, { view: 'back', aL: -.7, aR: -.6 }],
    [330, 650, 4 * 78 + 1, { view: 'q', flip: true, aL: .3, aR: -.5 }],
    [910, 670, 4 * 78 + 2, { view: 'side', flip: true, aL: 1.3, sit: true }],
  ];
  function memWindow(t, tt, [wx, wy, b, pose], i) {
    const W0 = 180, H0 = 220, age = t - beatT(b);
    boilSeed('memw' + i);
    paint(rectPts(wx - 8, wy - 8, W0 + 16, H0 + 16), { wash: JZ.ink2, ink: JZ.ink, sw: 1.4 });
    if (age < 0) { paint(rectPts(wx, wy, W0, H0), { wash: mixCol(NEARCOL, JZ.ink, .3), ink: null }); return; }
    const k = backOut(clamp(age / .16)), fl = hitK(age, 5);
    // a memory: the dark pane turns blue and the love appears in it, a glowing cream figure
    glow(wx + W0 / 2, wy + H0 / 2, 200 + 90 * fl, '#CFE0FF', .3 + .5 * fl);
    paint(rectPts(wx + W0 / 2 * (1 - k), wy + H0 / 2 * (1 - k), W0 * k, H0 * k), { wash: JZ.blue, ink: null });
    halftone('disc', wx + W0 / 2, wy + H0 * .55, W0 * 1.2, H0 * 1.1, JZ.blueLt, .55 * k);
    boilSeed('memm' + i);
    paint(rectPts(wx, wy + H0 * .3 - 3, W0, 6), { wash: JZ.ink2, ink: null });
    if (k > .6) {
      const u = 14, lx = wx + W0 / 2 + (pose.view === 'side' ? -8 : 0), ly = wy + H0 - (pose.sit ? 36 : 10);
      const sway = pose.dance ? Math.sin(bpOf(tt) * Math.PI) : 0, wv = pose.wave ? .3 * Math.sin(tt * 9) : 0, br = .03 * Math.sin(tt * 2 + i);
      glow(lx, ly - 5 * u, 110, '#FFF1D6', .3 + .4 * fl);
      lover(lx, ly, u, {
        view: pose.view, flip: pose.flip, aL: (pose.aL ?? .2) + (pose.dance ? .3 * sway : 0), aR: (pose.aR ?? .2) + wv, rot: .12 * sway, sq: br,
        noLegs: pose.sit, boilKey: 'mem' + i,
        armL: pose.cup ? (uu, sw) => paint(rrPts(-.2 * uu, -1 * uu, 1.1 * uu, 1.2 * uu, .2 * uu), { wash: JZ.cream, ink: JZ.ink }) : undefined,
      });
    }
    boilSeed('mems' + i);
    paint(rectPts(wx - 14, wy + H0 + 2, W0 + 28, 14), { wash: JZ.ink2, ink: JZ.ink, sw: 1.2 });
  }
  function P1(t, lt, dur) {
    const tt = TT(t), t0 = t - lt;
    plate('P1');
    const s1 = bt(76, 1), s2 = bt(76, 2);
    // how much the disc is a cymbal: it tips flat at once, then tips back after the second sweep
    const m = ease(seg(tt, t0, t0 + .3)) * (1 - ease(seg(tt, s2 + .12, s2 + .42)));
    const pb = ease(seg(tt, s2 + .22, bt(77, 1) + .12));
    const tilt = easeIn(seg(t, bt(78, 2), bt(78, 3)));
    const z = lerp(Z0, 1, pb), cx = lerp(MO.x, 960, pb), cy = lerp(MO.y + 140 / Z0, 540, pb) + 330 * tilt;
    camBegin(cx, cy, z);
    boilSeed('P1-sky'); ground(JZ.blueDk);
    halftone('ramp', 960, 900, 3400, 760, JZ.blue, .6);
    // the city (all of it below the seam frame's view, so the first frame is only sky and disc)
    FAR.forEach(([x, w, h], i) => facade(x, 1000, w, h, JZ.blue, { ink: null, cell: 34, key: 'P1f' + i, win: (a, b) => hash(i * 31 + a * 7 + b * 3) > .92 ? JZ.blueLt : mixCol(JZ.blue, JZ.blueDk, .5) }));
    halftone('ramp', 960, 880, 3400, 360, JZ.blueDk, .7);
    NEAR.forEach(([x, w, h], i) => facade(x, 1000, w, h, NEARCOL, { cell: 96, key: 'P1n' + i, win: (a, b) => mixCol(NEARCOL, JZ.ink, .35) }));
    MEM.forEach((w, i) => memWindow(t, tt, w, i));
    boilSeed('P1-street'); block(rectPts(-400, 1000, 2800, 400), JZ.ink, { ink: null });
    inkLine([[-400, 1000], [2400, 1000]], 3, JZ.ink2, 'ink', 0);
    // the moon / ride cymbal
    const rideB = []; for (let b = 305; b <= 4 * 79; b++) { rideB.push(b); if (b % 2 === 1) rideB.push(b + .66); }
    const ha = lastAge(t, rideB), wob = Math.exp(-ha * 7) * Math.sin(ha * 40) * .03 * m;
    const rx = MO.r * lerp(1, 1.32, m), ry = MO.r * lerp(1, .34, m), rot = -.1 * m + wob, px = 1 / Z0;
    boilSeed('P1-stand');
    if (m > .02) inkLine([[MO.x, MO.y + ry * .6], [MO.x + 3 * m, MO.y + ry * .6 + 420 * m]], 5 * px, JZ.ink2, 'ink', 0);
    boilSeed('P1-moon');
    glow(MO.x, MO.y, MO.r * 2.3, '#FFD890', .55 + .25 * hitK(ha, 4));
    block(ellPts(MO.x, MO.y, rx, ry, 48, 0, rot), JZ.mustard, { ink: m > .15 ? JZ.ink : null, sw: 1.8 * px, misK: m });
    halftone('disc', MO.x + rx * .25, MO.y + ry * .2, rx * 1.2, ry * 1.2, JZ.mustDk, .5 * (1 - m));
    if (m > .3) {
      for (let i = 1; i < 4; i++) inkLine(ellPts(MO.x, MO.y, rx * i / 4.2, ry * i / 4.2, 40, 0, rot).concat([[MO.x + rx * i / 4.2 * Math.cos(rot), MO.y + rx * i / 4.2 * Math.sin(rot)]]), .9 * px, JZ.mustDk, 'inkfine', .5);
      paint(ellPts(MO.x, MO.y - 3 * px, rx * .16, ry * .24, 18, 0, rot), { wash: JZ.mustLt, ink: JZ.ink, sw: px });
    }
    if (pb < .02 || pb > .95) shimmer(MO.x, MO.y, rx * .95, ry * .95, ha, { key: 'P1' });
    // the brush: sweep 1 (beat 2) right → left, sweep 2 (beat 3) back and up off the frame
    const w1 = seg(t, s1 - .1, s1 + .08), w2 = seg(t, s2 - .1, s2 + .1);
    if (w1 > 0 && w2 < 1) {
      let bx, by, fast, dir;
      if (w2 <= 0) { bx = lerp(620, -150, easeOut(w1)); by = 0; fast = w1 < .95; dir = -1; }
      else { bx = lerp(-150, 1100, easeIn(w2)); by = -650 * easeIn(w2); fast = true; dir = 1; }
      boilSeed('P1-brush');
      push(); translate(MO.x, MO.y); scale(px);
      if (fast) for (let i = 0; i < 5; i++) inkLine([[bx - 40 * dir, by - 30 + i * 14], [bx - 40 * dir - dir * 340, by - 30 + i * 18 + (dir > 0 ? 120 : 0)]], 3.4 - i * .5, mixCol(JZ.cream, JZ.ink, .25 + i * .12), 'dry', 0);
      translate(bx, by - 18); rotate(-.62);
      paint(rectPts(110, -11, 1100, 22), { wash: JZ.ink2, ink: JZ.ink, sw: 1.3 });
      paint(rectPts(80, -14, 60, 28), { wash: '#9A9486', ink: JZ.ink, sw: 1 });
      for (let i = 0; i < 13; i++) inkLine([[90, (i - 6) * 1.5], [-70, (i - 6) * 9 + jit(3)]], .8, '#C9C2B2', 'inkfine', 0);
      pop();
    }
    camEnd();
  }

  // ======================================================================
  // P2 · "Nothing feels the same" (136.84–140.34)
  // The street after hours, side on, every lamp dark. The singer walks alone left → right; every step is a bass note
  // rippling in the wet pavement. It stops under the lamp that lit for it in H: the lamp stutters and stays dark.
  // ======================================================================
  const P2S = { x0: 880, t0: 136.84, a1: 137.7, s1: 138.05, s2: bt(80, 1), v: 180 };
  P2S.a2 = P2S.s2 + .35;
  P2S.stop = P2S.x0 + P2S.v * (P2S.a1 - P2S.t0) + P2S.v * (P2S.s1 - P2S.a1) / 2;
  function p2x(t) {
    const S = P2S;
    if (t < S.a1) return S.x0 + S.v * (t - S.t0);
    if (t < S.s1) { const d = t - S.a1; return S.x0 + S.v * (S.a1 - S.t0) + S.v * d - S.v / (2 * (S.s1 - S.a1)) * d * d; }
    if (t < S.s2) return S.stop;
    if (t < S.a2) { const d = t - S.s2; return S.stop + S.v / (2 * (S.a2 - S.s2)) * d * d; }
    return S.stop + S.v * (S.a2 - S.s2) / 2 + S.v * (t - S.a2);
  }
  const P2LAMPS = [330, 1020, 1710, 2400];
  const P2B = [[-300, 330, 700], [30, 290, 830], [320, 380, 760], [700, 300, 900], [1000, 360, 780], [1360, 320, 860], [1680, 380, 740], [2060, 300, 880], [2360, 400, 800]];
  function P2(t, lt, dur) {
    const tt = TT(t), t0 = t - lt;
    plate('P2');
    const x = p2x(tt), walking = tt < P2S.s1 - .05 || tt > P2S.s2;
    const whip = easeIn(seg(t, t0 + dur - .36, t0 + dur));
    const cx = x + 100 + 500 * whip, cy = 653 - 200 * (1 - easeOut(seg(t, t0, t0 + .55)));
    camBegin(cx, cy, 1.75);
    boilSeed('P2-sky'); ground(JZ.blueDk);
    const fc = mixCol(JZ.blueDk, JZ.ink, .4);
    P2B.forEach(([bx, w, h], i) => facade(bx, 772, w, h, i % 2 ? fc : mixCol(fc, JZ.blue, .15), { cell: 58, key: 'P2b' + i, win: (a, b) => hash(i * 17 + a * 5 + b * 11) > .94 ? mixCol(JZ.blue, JZ.blueLt, .5) : mixCol(fc, JZ.ink, .4) }));
    boilSeed('P2-walk');
    block(rectPts(-600, 772, 3800, 92), JZ.blue, { ink: null });
    halftone('ramp', 1200, 830, 3800, 120, JZ.blueDk, .8);
    block(rectPts(-600, 862, 3800, 400), JZ.ink, { ink: null });
    inkLine([[-600, 862], [3200, 862]], 4, JZ.ink2, 'ink', 0);
    inkLine([[-600, 772], [3200, 772]], 2, JZ.ink, 'ink', 0);
    // puddles (one under the lamp where the singer stops)
    [[P2S.stop + 6, 832, 110], [520, 845, 80], [1560, 838, 95]].forEach(([px, py, r], i) => {
      boilSeed('pud' + i);
      paint(ellPts(px, py, r, r * .13, 22), { wash: mixCol(JZ.blueDk, JZ.ink, .3), ink: null });
      inkLine([[px - r * .5, py - 2], [px + r * .2, py - 3]], 2, JZ.blueLt, 'inkfine', .3);
    });
    // the dark lamps; the one over the stop stutters once on the backbeat, then gives up
    const fk = bt(79, 3), fl = (t > fk && t < fk + .09) ? .8 : (t > fk + .17 && t < fk + .22) ? .4 : 0;
    P2LAMPS.forEach(lx => streetLamp(lx, 772, 330, lx === 1020 ? fl : 0, { key: 'P2' + lx, s: 1.3 }));
    // each step on the beat ripples the wet pavement (the walking bass); standing still, the puddle keeps the time
    const bi0 = 4 * 78 + 3, biN = Math.floor(bpOf(t));
    for (let b = Math.max(bi0, biN - 3); b <= biN; b++) {
      const tb = beatT(b), a = t - tb; if (a < 0) continue;
      ripples(p2x(tb) + 30, 836, [a], { flat: .16, speed: 150, life: 1.1, r0: 10, sw: 3.2, rings: 2, gap: 22, key: 'P2r' + b });
    }
    // the singer
    const lookUp = seg(tt, 138.15, 138.4) * (1 - seg(tt, 138.95, 139.2)), droop = seg(tt, 138.95, 139.25) * (1 - seg(tt, 139.6, 140.0));
    const walk = (x - P2S.x0) / 150;
    const E = emotions(tt, [[t0, 'sad', { emote: null }], [138.95, 'sad', { emote: null, eyes: 'teary' }]], { take: .6 });
    singer(x, 836, 22, tt, {
      ...E, view: 'side', mic: false, walk: walking || tt > P2S.s2 ? walk : null, lookX: .5, lookY: lerp(lerp(.45, -1, lookUp), .9, droop),
      rot: -.07 * lookUp + .05 * droop, sq: (E.sq || 0) + .05 * droop - .03 * lookUp, dy: (E.dy || 0) - (walking ? .25 * Math.abs(Math.sin(walk * TAU)) : 0),
      aL: -.8 + (walking ? .25 * Math.sin(walk * TAU) : 0), boilKey: 'P2s',
    });
    camEnd();
    // out: the camera whips right into a building's dark wall (ink sweeps the frame)
    if (whip > 0) {
      boilSeed('P2-wall');
      const xl = lerp(W + 80, -80, easeIn(seg(t, t0 + dur - .34, t0 + dur)));
      for (let i = 0; i < 7; i++) inkLine([[xl + 60, 80 + i * 150], [xl + 60 + 500 * whip, 80 + i * 150 + 10]], 5, mixCol(JZ.ink, JZ.blue, .4), 'dry', 0);
      paint([[xl + 60, -60], [W + 300, -60], [W + 300, H + 60], [xl - 30, H + 60]], { wash: JZ.ink, ink: null });
    }
  }

  // ======================================================================
  // P3 · "Empty rooms and sleepless nights / Hide my tears from morning light" (140.34–145.59, then the cup)
  // The singer's room: awake, sitting up in bed. Its eyes go to the two cups (one never touched); the tears come; the
  // first grey of morning in the window, and the singer turns its face away from it.
  // ======================================================================
  function P3(t, lt, dur) {
    const tt = TT(t), t0 = t - lt;
    plate('P3');
    const pk = ease(seg(tt, t0, t0 + dur)), dawn = ease(seg(tt, 144.2, 145.6));
    // medium → in to the face and the untouched cup (the look) → closer on the face (the tears)
    const cam = kf(tt, [[t0, [790, 600, 1.35]], [142.15, [800, 612, 1.45]], [142.75, [835, 662, 1.95]], [143.85, [830, 662, 2.02]], [144.45, [700, 655, 2.35]], [t0 + dur, [690, 660, 2.42]]]);
    camBegin(cam[0], cam[1], cam[2]);
    boilSeed('P3-wall'); ground(JZ.blueDk);
    camEnd(); halftone('ramp', 960, 260, 1960, 560, JZ.ink, .5, Math.PI); camBegin(cam[0], cam[1], cam[2]);
    block(rectPts(-400, 860, 2800, 400), JZ.ink2, { ink: null });
    inkLine([[0, 860], [1600, 860]], 3, JZ.ink, 'ink', 0);
    // the window: blue night, the moon, roofs; the morning's first grey creeps up from the roofs
    const WX = 960, WY = 250, WW = 340, WH = 350;
    boilSeed('P3-window');
    paint(rectPts(WX, WY, WW, WH), { wash: mixCol(JZ.blue, JZ.blueDk, .3), ink: null });
    if (dawn > 0) paint(rectPts(WX, WY + WH - 200 * dawn, WW, 200 * dawn), { wash: mixCol(JZ.blue, JZ.smoke, .45), ink: null });
    moon(WX + 250, WY + 80, 36, { key: 'P3', glow: .35 * (1 - .6 * dawn) });
    block([[WX, WY + WH], [WX, WY + WH - 60], [WX + 60, WY + WH - 60], [WX + 60, WY + WH - 88], [WX + 130, WY + WH - 88], [WX + 130, WY + WH - 44], [WX + 210, WY + WH - 44], [WX + 210, WY + WH - 80], [WX + 250, WY + WH - 98], [WX + 290, WY + WH - 80], [WX + 290, WY + WH - 52], [WX + WW, WY + WH - 52], [WX + WW, WY + WH]], JZ.ink, { ink: null });
    paint(rectPts(WX - 18, WY - 18, WW + 36, WH + 36), { ink: JZ.ink, sw: 2.4 });
    paint(rectPts(WX + WW / 2 - 6, WY, 12, WH), { wash: JZ.ink2, ink: null });
    paint(rectPts(WX, WY + WH * .45 - 6, WW, 12), { wash: JZ.ink2, ink: null });
    paint(rectPts(WX - 30, WY + WH + 2, WW + 60, 22), { wash: JZ.ink2, ink: JZ.ink, sw: 1.4 });
    // moonlight falling across the room
    boilSeed('P3-shaft');
    const sc = mixCol(JZ.blueLt, JZ.smoke, .5 * dawn);
    paint([[WX, WY + WH + 24], [WX + WW, WY + WH + 24], [WX + 60, 1000], [WX - 420, 1000]], { wash: sc, washOp: 34, fill: sc, fillOp: 26, bleed: .08, tex: .5, border: .6, ink: null });
    halftone('ramp', WX - 120, 900, 600, 220, sc, .35);
    // the bed: headboard, frame, pillow, sheet
    boilSeed('P3-bed');
    const wd = mixCol(JZ.wood, JZ.ink, .45);
    block(rectPts(250, 470, 66, 390), wd, { ink: JZ.ink, sw: 1.6 });
    paint(ellPts(283, 470, 40, 16, 16), { wash: wd, ink: JZ.ink, sw: 1.2 });
    block(rectPts(260, 762, 630, 90), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    paint(rectPts(300, 700, 590, 70), { wash: mixCol(JZ.smoke, JZ.blue, .35), ink: JZ.ink, sw: 1.2 });
    paint(rrPts(318, 626, 170, 80, 28), { wash: mixCol(JZ.cream, JZ.blue, .25), ink: JZ.ink, sw: 1.3 });
    // the singer, sitting up, the blanket over its lap
    const E = emotions(tt, [[t0, 'sad', { emote: null }], [143.35, 'sad', { emote: null, eyes: 'teary' }]], { take: .6 });
    const lk = kf(tt, [[t0, [.7, -.45]], [142.45, [.7, -.45]], [142.6, [.95, .55]], [143.9, [.95, .55]], [144.1, [.4, .75]]]);
    const tn = turn(tt, 144.5, 144.72, .125, -.125);
    const hide = ease(seg(tt, 144.6, 145.1));
    singer(630, 792, 26, tt, { ...E, ...tn, noLegs: true, mic: false, noShadow: true, swMul: 1.3 / Math.sqrt(cam[2]), lookX: lk[0], lookY: lk[1], dy: (E.dy || 0) + .3 * hide, sq: (E.sq || 0) + .06 * hide, aL: -1.1, aR: -1.1, boilKey: 'P3s' });
    // tears rolling down (one, then another) before it turns away
    [143.55, 143.95].forEach((t1, n) => {
      const k = seg(tt, t1, t1 + .55); if (k <= 0 || k >= 1 || tt > 144.5) return;
      boilSeed('tear' + n);
      const ex = 630 + (n ? -.35 : 3.35) * 26, ey = 792 + ((E.dy || 0) - 5.1) * 26 + 62 * easeIn(k) ;
      paint([[ex, ey - 9], [ex + 5, ey + 2], [ex, ey + 7], [ex - 5, ey + 2]], { wash: JZ.blueLt, ink: JZ.ink, sw: .6, curv: .6 });
      inkLine([[ex, 792 + ((E.dy || 0) - 5.3) * 26], [ex, ey - 8]], 1.4, mixCol(JZ.blueLt, PAL.clay, .4), 'inkfine', 0);
    });
    boilSeed('P3-blanket');
    paint([[450, 716], [640, 704], [790, 712], [905, 706], [912, 800], [444, 806]], { wash: JZ.blue, fill: JZ.blueDk, fillOp: 60, tex: .5, ink: JZ.ink, sw: 1.5, curv: .4 });
    inkLine([[480, 745], [600, 735], [740, 748], [880, 738]], 2, JZ.blueLt, 'inkfine', .6);
    // the bedside table and the two cups: the singer's, half drunk; the other, never touched
    boilSeed('P3-table');
    block(rectPts(920, 700, 170, 18), wd, { ink: JZ.ink, sw: 1.3 });
    paint(rectPts(936, 718, 138, 142), { wash: JZ.ink2, ink: JZ.ink, sw: 1.2 });
    mug(958, 700, .9, { key: 'mine', full: mixCol(JZ.wood, JZ.ink, .6) });
    mug(1040, 700, 1, { key: 'yours', saucer: true, full: mixCol(JZ.wood, JZ.ink, .3) });
    const ra = lastAge(t, [...Array(20)].map((_, i) => 4 * 80 + 3 + i));
    ripples(1040, 656, [ra], { flat: .25, speed: 40, life: .5, r0: 4, sw: 1.6, rings: 1, key: 'P3c' });
    const gl = seg(tt, 142.6, 142.8) * (1 - seg(tt, 143.5, 143.9));
    if (gl > 0) glow(1034, 650, 60, '#BFD3FF', .5 * gl);
    camEnd();
    // in: the dark wall from P2 slides on off the frame
    if (lt < .4) { boilSeed('P3-wall'); const xl = lerp(-80, -2500, easeOut(lt / .4)); paint([[xl + 60, -60], [xl + 2380, -60], [xl + 2290, H + 60], [xl - 30, H + 60]], { wash: JZ.ink, ink: null }); }
  }

  // P3 insert (145.59–147.78): the untouched cup from above. Its cold surface ripples blue on every bass note, and the
  // window's reflection shivers in it. The rim is a circle: it match-cuts to the phone's dial.
  const CUP = { x: 960, y: 470, r: 200 };
  function P3b(t, lt, dur) {
    const tt = TT(t);
    plate('P3b');
    camBegin(CUP.x, CUP.y, lerp(1.22, 1.3, ease(lt / dur)));
    boilSeed('P3b-top'); ground(mixCol(JZ.wood, JZ.ink, .6), { tex: 30 });
    halftone('ramp', 1300, 300, 1600, 1000, JZ.blueDk, .5, -2.3);
    paint([[1500, -200], [2200, -200], [1300, 1300], [600, 1300]], { wash: JZ.blueLt, washOp: 26, ink: null });
    // saucer, spoon, handle
    boilSeed('P3b-saucer');
    paint(ellPts(CUP.x + 14, CUP.y + 18, 318, 318, 48), { fill: JZ.ink, fillOp: 90, bleed: .2, tex: .3, ink: null });
    paint(ellPts(CUP.x, CUP.y, 310, 310, 48), { wash: mixCol(JZ.cream, JZ.blue, .2), ink: JZ.ink, sw: 2 });
    inkLine(ellPts(CUP.x, CUP.y, 232, 232, 40).concat([[CUP.x + 232, CUP.y]]), 1.4, mixCol(JZ.cream, JZ.ink, .35), 'inkfine', .5);
    paint(ribbon([[CUP.x - 150, CUP.y + 210], [CUP.x - 230, CUP.y + 160], [CUP.x - 300, CUP.y + 110]], 16, 10), { wash: JZ.brassLt, ink: JZ.ink, sw: 1.2 });
    paint(ellPts(CUP.x - 120, CUP.y + 232, 42, 26, 18, 0, -.6), { wash: JZ.brassLt, fill: JZ.brass, fillOp: 60, ink: JZ.ink, sw: 1.2 });
    paint(rrPts(CUP.x + CUP.r - 20, CUP.y - 34, 120, 68, 30), { wash: JZ.cream, ink: JZ.ink, sw: 2 });
    paint(rrPts(CUP.x + CUP.r + 18, CUP.y - 14, 60, 28, 14), { wash: mixCol(JZ.cream, JZ.blue, .2), ink: JZ.ink, sw: 1.4 });
    // the cup and its cold coffee
    boilSeed('P3b-cup');
    paint(ellPts(CUP.x, CUP.y, CUP.r, CUP.r, 48), { wash: JZ.cream, fill: JZ.smoke, fillOp: 70, tex: .4, ink: JZ.ink, sw: 2.2 });
    const cr = CUP.r - 28, cof = mixCol(JZ.wood, JZ.ink, .5);
    paint(ellPts(CUP.x, CUP.y, cr, cr, 44), { wash: cof, ink: JZ.ink, sw: 1.4 });
    halftone('disc', CUP.x - 40, CUP.y - 40, cr * 1.6, cr * 1.6, mixCol(JZ.wood, JZ.ink, .2), .4);
    const bs = ages(t, 4 * 83 + 3, 4 * 85), la = bs.length ? bs[bs.length - 1] : 9;
    const sh = Math.exp(-la * 5) * Math.sin(la * 38) * 7;
    boilSeed('P3b-refl');
    const rx0 = CUP.x - 70 + sh, ry0 = CUP.y - 80;
    paint(rectPts(rx0, ry0, 78, 96), { wash: mixCol(cof, JZ.blueLt, .55), ink: null });
    inkLine([[rx0 + 39, ry0], [rx0 + 39 - sh * .6, ry0 + 96]], 4, cof, 'ink', .4);
    inkLine([[rx0, ry0 + 48], [rx0 + 78, ry0 + 48 + sh * .4]], 4, cof, 'ink', .4);
    paint(ellPts(rx0 + 60 - sh * .4, ry0 + 20, 9, 9, 12), { wash: JZ.mustard, ink: null });
    bs.forEach((a, n) => {   // the bass notes ripple the cold surface: pale blue rings running out to the rim
      if (a > .95) return;
      boilSeed('cupr' + n);
      const k = a / .95, r = 10 + 158 * easeOut(k);
      for (let j = 0; j < 2; j++) { const rr = r - j * 26; if (rr > 6) inkLine(ellPts(CUP.x, CUP.y, rr, rr, 40).concat([[CUP.x + rr, CUP.y]]), (7 - j * 3) * (1 - k) + .6, j ? JZ.blueLt : mixCol(JZ.blueLt, JZ.cream, .45), 'ink', .5); }
    });
    inkLine(ellPts(CUP.x, CUP.y, CUP.r - 10, CUP.r - 10, 44).slice(26, 40), 3, '#FFF1D6', 'inkfine', .5);
    camEnd();
  }

  // ======================================================================
  // P4 · "If I hurt you, let me know / Don't disappear without a word" (147.78–154.35)
  // Match cut: the cup's circle is the phone's dial; the singer dials. Then outside: the booth rings out across the
  // city in blue ripples. They reach the love's silhouette down the street: it stops, it half turns back, and on
  // "disappear" it breaks into piano tiles that scatter into the night. The singer lets the receiver fall.
  // ======================================================================
  const DS = 1.0;   // the dial's rest angle offset
  function dialPhi(t) {
    const p1 = 3.8 * ease(seg(t, 147.98, 148.33)) * (1 - ease(seg(t, 148.36, 148.64)));
    const bounce = spring(t, 148.64, 9, 26) * .06;
    const p2 = 1.3 * ease(seg(t, 148.68, 148.98));
    return p1 + p2 - bounce;
  }
  const holeP = (i, ph) => { const a = DS - .55 - i * .5 + ph; return [CUP.x + 150 * Math.cos(a), CUP.y + 150 * Math.sin(a)]; };
  function P4a(t, lt, dur) {
    const tt = TT(t);
    plate('P4a');
    camBegin(CUP.x, CUP.y, lerp(1.3, 1.16, ease(seg(lt, 0, dur))));
    boilSeed('P4a-wall'); ground(JZ.mustLt);
    halftone('ramp', 960, 540, 2400, 1300, JZ.mustard, .7);
    glow(700, 200, 500, '#FFD27A', .5);
    boilSeed('P4a-phone');
    paint(rrPts(CUP.x - 400, CUP.y - 330, 800, 790, 110), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 70, tex: .45, ink: JZ.ink, sw: 2.4 });
    halftone('disc', CUP.x + 200, CUP.y + 260, 700, 600, JZ.vermDk, .55);
    const ph = dialPhi(tt);
    boilSeed('P4a-dial');
    paint(ellPts(CUP.x, CUP.y, 212, 212, 48), { wash: JZ.cream, fill: JZ.smoke, fillOp: 50, tex: .4, ink: JZ.ink, sw: 2.2 });
    for (let i = 0; i < 10; i++) { const [hx, hy] = holeP(i, ph); paint(ellPts(hx, hy, 33, 33, 18), { wash: JZ.ink2, ink: JZ.ink, sw: 1.6 }); const [nx, ny] = holeP(i, 0); if (Math.hypot(nx - hx, ny - hy) > 40 || ph < .05) paint(ellPts(nx, ny, 9, 9, 10), { wash: JZ.vermDk, ink: null }); }
    paint(ellPts(CUP.x, CUP.y, 66, 66, 30), { wash: JZ.cream, ink: JZ.ink, sw: 1.6 });
    inkLine(ellPts(CUP.x, CUP.y, 50, 50, 30).concat([[CUP.x + 50, CUP.y]]), 3, JZ.verm, 'ink', .5);
    const fs = [CUP.x + 196 * Math.cos(DS), CUP.y + 196 * Math.sin(DS)];
    paint([[fs[0] - 14, fs[1] - 30], [fs[0] + 16, fs[1] - 18], [fs[0] + 6, fs[1] + 26], [fs[0] - 16, fs[1] + 12]], { wash: JZ.brass, ink: JZ.ink, sw: 1.4 });
    // the singer's arm: in to the hole, round with the dial, out, into the next hole
    const R0 = [1360, 900];
    let tip;
    if (tt < 147.98) tip = arcPt(R0, holeP(7, 0), 60, easeOut(seg(tt, 147.78, 147.98)));
    else if (tt < 148.33) tip = holeP(7, ph);
    else if (tt < 148.5) tip = arcPt(holeP(7, 3.8), [1270, 780], 40, ease(seg(tt, 148.33, 148.5)));
    else if (tt < 148.68) tip = arcPt([1270, 780], holeP(2, ph), 50, ease(seg(tt, 148.5, 148.68)));
    else tip = holeP(2, ph);
    boilSeed('P4a-arm');
    const an = Math.atan2(1250 - tip[1], 1640 - tip[0]);
    push(); translate(tip[0], tip[1]); rotate(an);
    paint(rrPts(-60, -72, 900, 144, 34), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: JZ.ink, sw: 2.2 });
    paint(rectPts(-40, 34, 860, 34), { fill: PAL.clayDk, fillOp: 110, bleed: .05, tex: .6, border: .4, ink: null });
    pop();
    camEnd();
  }

  const P4 = { bx: 340, by: 905, bs: 2.0, lx: 1340, ly: 890, lu: 22, ringB: [4 * 86, 4 * 86 + 2, 4 * 87], sp: 1005, life: 2.2, flat: .45 };
  const P4N = [[600, 300, 460], [900, 280, 540], [1180, 340, 420], [1520, 360, 520], [1880, 300, 440]];
  function P4b(t, lt, dur) {
    const tt = TT(t), t0 = t - lt;
    plate('P4b');
    camBegin(lerp(846, 866, ease(lt / dur)), 675, lerp(1.24, 1.27, ease(lt / dur)));
    boilSeed('P4b-sky'); ground(JZ.blueDk);
    halftone('ramp', 960, 700, 2600, 800, JZ.blue, .55);
    // the phone's rings, as they spread (their ages), and the ring centre (the booth)
    const rc = [P4.bx, P4.by - 300], rAges = P4.ringB.map(b => tt - beatT(b)).filter(a => a >= 0 && a < P4.life);
    const hitWin = (wx, wy) => rAges.some(a => { const d = Math.hypot(wx - rc[0], (wy - rc[1]) / P4.flat), r = ringR(a, P4.sp, P4.life); return Math.abs(d - r) < 60; });
    FAR.forEach(([x, w, h], i) => facade(x + 200, 890, w, h * .9, JZ.blue, { ink: null, cell: 34, key: 'P4f' + i, win: (a, b, wx, wy) => hitWin(wx, wy) ? JZ.blueLt : mixCol(JZ.blue, JZ.blueDk, .5) }));
    P4N.forEach(([x, w, h], i) => facade(x, 890, w, h, NEARCOL, { cell: 56, key: 'P4n' + i, win: (a, b, wx, wy) => hitWin(wx, wy) ? mixCol(JZ.blueLt, JZ.cream, .3) : mixCol(NEARCOL, JZ.ink, .35) }));
    boilSeed('P4b-street');
    block(rectPts(-400, 862, 2800, 50), JZ.blue, { ink: null });
    block(rectPts(-400, 910, 2800, 300), JZ.ink, { ink: null });
    inkLine([[-400, 910], [2400, 910]], 3, JZ.ink2, 'ink', 0);
    // the rings go out across the city
    P4.ringB.forEach((b, i) => { const a = tt - beatT(b); if (a >= 0) ripples(rc[0], rc[1], [a], { speed: P4.sp, life: P4.life, flat: P4.flat, sw: 7, rings: 2, gap: 40, col: JZ.blueLt, key: 'P4r' + i }); });
    // the love: walking away; stops when the first ring reaches it, half turns at the second, breaks at the third
    const hit1 = beatT(P4.ringB[0]) + .87, hit2 = beatT(P4.ringB[1]) + .87, brk = bt(87, 2);
    const lx = P4.lx + 70 * ease(seg(tt, t0, hit1)), lu = P4.lu;
    if (tt < brk) {
      const tk = take(tt, hit1, .5), tn = turn(tt, hit2, hit2 + .2, .25, -.125);
      const walking = tt < hit1;
      lover(lx, P4.ly, lu, { ...(tt < hit2 ? { view: 'side' } : tn), walk: walking ? (tt - t0) * 1.6 : null, sq: tk.sq, dy: tk.dy, aL: -.3, aR: -.3, boilKey: 'P4l' });
    } else loverTiles(lx, P4.ly, lu, t - brk, tt);
    // the booth and the singer on the phone
    const drop = bt(88, 1) + .15;
    const E = emotions(tt, [[t0, 'sad', { emote: null, eyes: 'teary' }], [brk + .25, 'sad', { emote: null, eyes: 'teary', gloom: .8 }]], { take: .5 });
    const armA = tt < drop - .5 ? 1.3 : lerp(1.3, 1.0, ease(seg(tt, drop - .5, drop))) - 1.9 * ease(seg(tt, drop, drop + .3));
    const su = 24, sx = P4.bx - 9, sy = P4.by - 20 * P4.bs, rp = 5 + .55 * clamp((Math.abs(armA) - .7) / .9);
    const pv = [sx + (rp + 2.2 * Math.cos(-armA)) * su, sy + ((E.dy || 0) - 4.5 + 2.2 * Math.sin(-armA)) * su];   // the held receiver (the far arm's tip)
    const box = booth(P4.bx, P4.by, P4.bs, {
      inside: () => {
        const bxp = [P4.bx - 57 * P4.bs, P4.by - 148 * P4.bs];
        boilSeed('cord');
        if (tt < drop) inkLine([bxp, [lerp(bxp[0], pv[0], .5), Math.max(bxp[1], pv[1]) + 70], pv], 2.2, JZ.ink, 'ink', .8);
        singer(sx, sy, su, tt, { ...E, view: 'q', mic: false, lookX: .9, lookY: -.1 + .9 * seg(tt, brk + .2, brk + .6), aR: armA, aL: -.9, boilKey: 'P4s',
          armR: tt < drop ? (u, sw) => paint(rrPts(-1.5 * u, -.5 * u, 3.4 * u, 1 * u, .45 * u), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 60, ink: JZ.ink, sw: sw * .8 }) : undefined });
        if (tt >= drop) {   // the receiver dangles on its cord
          const sa = .45 * Math.exp(-(tt - drop) * 2.2) * Math.cos((tt - drop) * 7), L = 120;
          const end = [bxp[0] + Math.sin(sa) * L, bxp[1] + Math.cos(sa) * L];
          boilSeed('cord2');
          inkLine([bxp, [lerp(bxp[0], end[0], .5), lerp(bxp[1], end[1], .5) + 4], end], 2, JZ.ink, 'ink', .8);
          push(); translate(end[0], end[1]); rotate(-sa);
          paint(rrPts(-12, 0, 24, 78, 10), { wash: JZ.verm, ink: JZ.ink, sw: 1.2 }); pop();
        }
      },
    });
    camEnd();
    if (lt > dur - .42) tileWipe((lt - (dur - .42)) / .84);
  }
  // the love's silhouette broken into piano tiles, age s after the break; they scatter up into the night
  function loverTiles(x, y, u, age, tt) {
    const c = u * 1.62, nx = 6, ny = 4, cells = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) cells.push([x + (i - (nx - 1) / 2) * c, y - 2.2 * u - (j + .5) * c * .95, i, j]);
    for (const lx of [-3.4, -1.1, 1.3, 3.5]) cells.push([x + lx * u, y - 1.1 * u, lx > 0 ? 9 : 8, 9]);
    const flick = age < .1;
    cells.forEach(([bx, by, i, j], n) => {
      boilSeed('lt' + n);
      const h1 = hash(n * 3.1), h2 = hash(n * 7.7), h3 = hash(n * 1.9), a = Math.max(0, age - .08 - .1 * h3);
      const vx = (bx - x) * 3.2 + 300 * (h1 - .35), vy = -(240 + 420 * h2);
      const px = bx + vx * a * (1 - .25 * a) + 18 * Math.sin(a * 5 + n), py = by + vy * a * (1 - .2 * a) + 30 * a * a;
      const r = c * .5 * (1 - seg(a, 1.2, 2.2)), rot = a * (3 + 5 * h1) * (h2 > .5 ? 1 : -1);
      if (r < 1) return;
      const col = flick ? JZ.cream : ((i + j + n) % 2 ? JZ.cream : JZ.ink);
      push(); translate(px, py); rotate(rot);
      paint(rectPts(-r, -r, 2 * r, 2 * r), { wash: col, ink: col === JZ.ink ? JZ.cream : JZ.ink, sw: .9 });
      pop();
    });
    if (age < .25) glow(x, y - 5 * u, 160, '#FFE7B8', .7 * (1 - age / .25));
  }

  // ======================================================================
  // P5 + Q1 · the table and the flame (154.35–167.50): one continuous setup.
  // P5 "One last chance is all I pray / Don't let love just fade away": back at the club table, cold and dark, the
  // candle out. The singer strikes a match on the box (the opening's match, from outside) and relights the candle;
  // warm light comes back; the camera pushes in to the flame.
  // Q1 "If there's still a spark inside": the flame, close, the singer's face behind it; hope; a single spark lifts off
  // and rises, and the camera and the singer's eyes follow it up into the dark.
  // ======================================================================
  const TB = { x: 735, y: 811, u: 28, tx: 980, fy: 905, ts: 1.2, cx: 905, strike: bt(90, 3), lit: bt(91, 2), sparkT: 165.2 };
  const MATCH = 70;
  // the match hand: target keys for the match head (world); IK solves the arm (2.1u) and the match's angle in the hand
  const HEAD = [[156.75, [848, 648]], [157.2, [878, 606]], [157.6, [886, 590]], [157.76, [880, 644]], [TB.strike, [820, 647]], [158.05, [832, 604]],
    [158.35, [852, 580]], [159.05, [903, 598]], [159.32, [903, 598]], [159.45, [862, 572]], [159.53, [848, 560]], [159.6, [872, 578]], [159.67, [846, 560]], [159.74, [866, 575]], [159.98, [838, 630]]];
  function tablePose(t) {
    const rot = kf(t, [[156.2, 0], [156.55, .08], [157.9, .05], [158.4, .12], [159.35, .12], [159.8, .04], [160.1, 0]]);
    const dx = kf(t, [[156.2, 0], [156.55, .25], [157.9, .2], [158.4, .8], [159.35, .8], [159.8, .15], [160.1, 0]]);
    const u = TB.u, piv = [1.6 * u * Math.cos(rot) + 4.2 * u * Math.sin(rot), 1.6 * u * Math.sin(rot) - 4.2 * u * Math.cos(rot)];
    const P = [TB.x + dx * u + piv[0], TB.y + piv[1]];
    let a = -.55, beta = 0, head = null, hasMatch = t >= 156.75 && t < 159.98;
    if (t >= 156.3 && t < 160.2) {
      let H;
      if (t < 156.75) H = [lerp(P[0] + 20, 848, ease(seg(t, 156.3, 156.65))), lerp(P[1] + 60, 650, ease(seg(t, 156.3, 156.65)))];
      else if (t < 159.98) H = kf(t, HEAD);
      else H = [lerp(838, P[0] + 40, ease(seg(t, 159.98, 160.2))), lerp(630, P[1] + 70, ease(seg(t, 159.98, 160.2)))];
      const La = 2.1 * u, Lm = hasMatch ? MATCH : 1, dxh = H[0] - P[0], dyh = H[1] - P[1];
      const D = clamp(Math.hypot(dxh, dyh), Math.abs(La - Lm) + 1, La + Lm - .5);
      const base = Math.atan2(dyh, dxh), al = Math.acos(clamp((La * La + D * D - Lm * Lm) / (2 * La * D), -1, 1));
      const th = base + (hasMatch ? al : 0), gm = Math.acos(clamp((La * La + Lm * Lm - D * D) / (2 * La * Lm), -1, 1));
      beta = hasMatch ? -(Math.PI - gm) : 0;
      a = .7 + rot - th;
      head = [P[0] + La * Math.cos(th) + Lm * Math.cos(th + beta), P[1] + La * Math.sin(th) + Lm * Math.sin(th + beta)];
      if (t > 160.1) a = lerp(a, -.55, seg(t, 160.1, 160.2));
    }
    return { rot, dx, a, beta, head, hasMatch };
  }
  function TABLE(t, lt, dur) {
    const tt = t < TB.strike - .1 || t > TB.strike + .2 ? TT(t) : t;   // the strike itself on ones
    plate('P5');
    const L = ease(seg(tt, TB.lit - .05, TB.lit + .6));             // warm light from the relit candle
    const push1 = ease(seg(tt, 160.25, 161.79)), push2 = ease(seg(tt, 161.79, 165.6)), up = ease(seg(tt, 165.55, 167.5));
    const e0 = ease(seg(tt, 154.35, 160.2));
    const z = lerp(lerp(1.95, 2.08, e0), 2.9, push1) + .75 * push2;
    const cx = lerp(lerp(870, 860, e0), 842, push1) + 30 * push2, cy = lerp(lerp(655, 640, e0), 576, push1) - 150 * up;
    camBegin(cx, cy, z);
    const swk = 1 / Math.sqrt(z);
    boilSeed('P5-room'); ground(JZ.ink);
    block(rectPts(-300, -300, 2600, 1000), mixCol(mixCol(JZ.blueDk, JZ.ink, .3), mixCol(JZ.wood, JZ.ink, .55), L), { ink: null });
    block(rectPts(-300, TB.fy, 2600, 500), mixCol(JZ.ink2, JZ.ink, .3), { ink: null });
    // print shading in screen space (so the dots keep their size under the push-in)
    const fs = toScreen(TB.cx, 590);
    camEnd();
    halftone('ramp', 960, 240, 1960, 520, JZ.ink, .55, Math.PI);
    if (L > 0) halftone('disc', fs[0], fs[1], 1300 * (.4 + .6 * L), 1000 * (.4 + .6 * L), JZ.mustDk, .36 * L);
    camBegin(cx, cy, z);
    if (L > 0) glow(TB.cx, 590, 700, '#FFB860', .4 * L);
    smoke(tt, 100, 150, 1700, 500, { key: 'P5', op: 16, n: 5 });
    // the empty chair, the singer's chair, the table
    const chCol = mixCol(mixCol(JZ.ink2, JZ.blueLt, .3), JZ.woodLt, .6 * L);
    chair(1300, TB.fy, 1.2, { key: 'empty', col: chCol, sw: swk });
    chair(655, TB.fy, 1.2, { key: 'mine', flip: true, col: chCol, sw: swk });
    const top = cafeTable(TB.tx, TB.fy, TB.ts, { key: 'P5', top: mixCol(JZ.smoke, JZ.cream, .6 * L) });
    matchbox(815, top);
    if (tt >= 159.98) { boilSeed('spent'); inkLine([[790, top - 3], [848, top - 6]], 3, '#E9D2A0', 'ink', 0); paint(ellPts(848, top - 6, 5, 4, 8), { wash: JZ.ink2, ink: null }); }
    phone(1110, top, .8, { key: 'P5' });
    gardeniaAt(1030, top - 6, 11, .2);
    // the candle: out (a thread of smoke), then caught by the match
    const ignite = seg(tt, TB.lit - .03, TB.lit + .22), cf = ignite > 0 ? backOut(ignite) : 0;
    const wick = candle(TB.cx, top, 1.5, tt, { key: 'P5', flame: 0 });
    if (cf < .6) {
      boilSeed('wisp');
      const wa = 1 - cf / .6, wp = []; for (let i = 0; i <= 8; i++) wp.push([wick[0] + 10 * Math.sin(i * .9 - tt * 3) * i / 8 + 3 * i, wick[1] - 4 - i * 26]);
      inkLine(wp, 2.2 * wa, JZ.smoke, 'inkfine', .7);
    }
    const stretch = 1 + .75 * Math.sin(Math.PI * seg(tt, TB.sparkT - .35, TB.sparkT)) - .25 * spring(tt, TB.sparkT, 8, 30);
    const ftip = flame(wick[0], wick[1], 1.5, tt, { f: cf, key: 'candle', stretch, sw: .75 * swk * 1.5 });
    // the singer (side view for the match business, then it turns toward the flame)
    const pose = tablePose(tt);
    const E = emotions(tt, [[154.35, 'sad', { emote: null }], [160.25, 'sad', { emote: null, eyes: 'teary' }], [163.6, 'hopeful'], [TB.sparkT + .25, 'hopeful', { eyes: 'wide' }]], { take: .5 });
    const lk = kf(tt, [[154.35, [.9, .1]], [156.1, [.9, .1]], [156.3, [.6, .7]], [157.9, [.6, .7]], [158.4, [.8, -.2]], [160.3, [.9, .1]], [TB.sparkT, [.9, -.1]], [TB.sparkT + .5, [.7, -.9]], [167.5, [.6, -1]]]);
    const tn = tt < 160 ? { view: 'side' } : turn(tt, 160, 160.18, .25, .125);
    const matchHook = (u, sw) => {
      push(); rotate(pose.beta);
      paint(rectPts(0, -2.6, MATCH, 5.2), { wash: '#E9D2A0', ink: JZ.ink, sw: .9 * swk });
      paint(ellPts(MATCH, 0, 6.5, 5, 10), { wash: tt < TB.strike ? JZ.verm : JZ.ink2, ink: JZ.ink, sw: .9 * swk });
      pop();
    };
    singer(TB.x, TB.y, TB.u, tt, {
      ...E, ...tn, noLegs: true, noShadow: true, mic: false, swMul: swk, lookX: lk[0], lookY: lk[1],
      rot: pose.rot, dx: pose.dx, sq: tt > 156.2 && tt < 160.1 ? 0 : E.sq, aL: pose.a, aR: -.6,
      armL: pose.hasMatch ? matchHook : undefined, boilKey: 'P5s',
      tint: L > .5 && E.tint ? E.tint : E.tint, tintK: (E.tintK ?? 1) * (1 - .6 * L),
    });
    // the match: sparks on the strike, the flame catches, is carried to the wick, shaken out
    const H = pose.head;
    if (H && pose.hasMatch) {
      const sa = t - TB.strike;
      if (sa > 0 && sa < .3) {
        boilSeed('sparks');
        for (let i = 0; i < 12; i++) {
          const an = -2.9 + hash(i * 3.3) * 2.4, d = 10 + 110 * hash(i * 7.1) * easeOut(sa / .3), x = H[0] + Math.cos(an) * d, y = H[1] + Math.sin(an) * d + 260 * sa * sa;
          inkLine([[x, y], [x + Math.cos(an) * 12 * (1 - sa / .3), y + Math.sin(an) * 12 * (1 - sa / .3)]], 2, i % 3 ? JZ.mustLt : JZ.cream, 'ink', 0);
        }
        glow(H[0], H[1], 160 * (1 - sa / .3), '#FFD27A', 1);
      }
      if (sa > -.06 && sa < 0) for (let i = 0; i < 3; i++) inkLine([[H[0] + 6, H[1] - 3 + i * 3], [H[0] + 54, H[1] - 5 + i * 4]], 2.2 - i * .5, mixCol(JZ.cream, JZ.ink, .3 + i * .15), 'dry', 0);
      const mf = t < TB.strike + .03 ? 0 : backOut(seg(t, TB.strike + .03, TB.strike + .12)) * (1 - ease(seg(tt, 159.62, 159.68)));
      if (mf > 0) {
        const H0 = tablePose(tt - .08).head || H, lean = clamp((H0[0] - H[0]) * .03, -.6, .6);
        flame(H[0], H[1] - 3, .9, tt, { f: mf, key: 'match', lean, light: 1.4 });
      }
      if (tt > 159.64 && tt < 160.2) { boilSeed('puff'); const pa = tt - 159.64; paint(ellPts(H[0] + 4, H[1] - 14 - 50 * pa, 7 + 30 * pa, 5 + 20 * pa, 12), { wash: JZ.smoke, washOp: 180 * (1 - pa / .56), ink: null }); }
    }
    // Q1: the spark lifts off the flame and rises
    const sp = tt - TB.sparkT;
    if (sp > 0 && ftip) {
      const rise = 26 * seg(sp, 0, .35) + 250 * easeIn(seg(sp, .25, 2.4)) * .6 + 170 * seg(sp, .25, 2.4) * .4;
      spark(ftip[0] + 10 * Math.sin(sp * 3) + 14 * seg(sp, 0, 2.3), ftip[1] - 4 - rise, 6.5, tt, clamp(sp / .12));
    }
    camEnd();
    if (lt < .42 && t < 155) tileWipe(.5 + lt / .84);
  }

  // ======================================================================
  // Q2 · "Don't let all our dreams just die" (167.50–170.13)
  // The spark rises through the dark club past the band, standing silent in silhouette; as it passes each one, on the
  // beat, that player lights up in its colour. The saxophonist, lit last, lifts its horn. The spark streaks off right.
  // ======================================================================
  const BAND = [
    { k: 'bass', t: bt(96, 2), col: JZ.blueLt, x: 260, fy: 960, u: 21, sp: [372, 700] },
    { k: 'piano', t: bt(96, 3), col: JZ.cream, x: 640, fy: 950, u: 20, sp: [730, 705] },
    { k: 'drums', t: bt(97, 0), col: JZ.verm, x: 1090, fy: 890, u: 21, sp: [1150, 600] },
    { k: 'trumpet', t: bt(97, 1), col: JZ.mustard, x: 1480, fy: 850, u: 21, sp: [1575, 610] },
    { k: 'sax', t: bt(97, 2), col: JZ.orange, x: 1870, fy: 810, u: 22, sp: [1965, 555] },
  ];
  function Q2(t, lt, dur) {
    const tt = TT(t), t0 = t - lt;
    plate('Q2');
    const keys = [[t0, [150, 1200]], ...BAND.map(b => [b.t, b.sp]), [t0 + dur + .02, [2500, 380]]];
    const sp = kf(t, keys, x => x), spc = kf(tt, keys, x => x);
    const back = ease(seg(tt, BAND[3].t + .1, BAND[4].t + .32));
    camBegin(lerp(clamp(spc[0] + 40, 700, 1520), 1080, back), lerp(705, 640, back), lerp(1.3, .92, back));
    boilSeed('Q2-room'); ground(JZ.ink);
    block(rectPts(-400, -400, 3000, 1250), mixCol(JZ.blueDk, JZ.ink, .55), { ink: null });
    boilSeed('Q2-risers');
    block(rectPts(-400, 958, 3000, 400), JZ.ink2, { ink: null });
    block(rectPts(900, 890, 390, 90), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    block(rectPts(1290, 850, 380, 130), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    block(rectPts(1670, 810, 500, 170), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    const dark = mixCol(JZ.ink2, JZ.blueDk, .6);
    const lit = i => ease(seg(t, BAND[i].t - .03, BAND[i].t + .08)), fl = i => hitK(t - BAND[i].t, 3.5), age = i => t - BAND[i].t;
    // each lit player gets its own cone of coloured light
    BAND.forEach((b, i) => { const k = lit(i); if (k > 0) { spotlight(b.x + 30, 120, b.x + 30, b.fy, 330, { a: .55 * k + .5 * fl(i), col: mixCol(b.col, JZ.cream, .5), glowCol: b.col, key: 'Q2' + i }); glow(b.x + 30, b.fy - 7 * b.u, 300 + 160 * fl(i), b.col, .45 * k + .6 * fl(i)); } });
    const sil = i => lit(i) > .5 ? BAND[i].col : dark, pop = i => -.14 * fl(i) * Math.cos(age(i) * 14);
    const B0 = BAND[0], B1 = BAND[1], B2 = BAND[2], B3 = BAND[3], B4 = BAND[4];
    const bs = bassist(B0.x, B0.fy, B0.u, tt, { sil: sil(0), sq: pop(0), boilKey: 'Q2b', key: 'Q2' });
    const pn = pianist(B1.x, B1.fy, B1.u, tt, { sil: sil(1), sq: pop(1), boilKey: 'Q2p', key: 'Q2' });
    const kit = drummer(B2.x, B2.fy, B2.u, tt, { sil: sil(2), sq: pop(2), brushes: true, boilKey: 'Q2d', key: 'Q2' });
    const tp = trumpeter(B3.x, B3.fy, B3.u, tt, { sil: sil(3), sq: pop(3), blow: fl(3), boilKey: 'Q2t', key: 'Q2' });
    const lift = ease(seg(tt, B4.t + .08, B4.t + .4));
    const sx = saxist(B4.x, B4.fy, B4.u, tt, { sil: sil(4), sq: pop(4) - .06 * lift, rot: -.1 * lift, dy: -.2 * lift, boilKey: 'Q2s', key: 'Q2' });
    // as each lights, its sound gives one small puff
    const a = [0, 1, 2, 3, 4].map(age);
    if (a[0] > 0) ripples(bs.body[0], bs.body[1], [a[0]], { speed: 330, life: 1, key: 'Q2b', sw: 4 });
    if (a[1] > 0 && pn.piano) pianoTiles(pn.piano.keys[0] - 20, pn.piano.keys[1] - 70, 30, 5, 1, [a[1]], { key: 'Q2p', h: 60, stairs: 8 });
    if (a[2] > 0) { shimmer(kit.ride[0], kit.ride[1], 90, 18, a[2], { key: 'Q2d' }); shards(kit.snare[0], kit.snare[1], a[2] - .05, 9, { n: 5, dist: 130, size: 18, life: .7 }); }
    if (a[3] > 0) rays(tp.bell[0] + 6, tp.bell[1], -.75, a[3], { hold: .3, len: 360, n: 3, w: 18, key: 'Q2t' });
    if (a[4] > 0) saxRibbon(flowPath(sx.bell[0], sx.bell[1] - 6, -1.1, 420, tt, { amp: 50, waves: 1.2, curl: 60 }), 44, tt, { grow: easeOut(seg(a[4], 0, .35)), key: 'Q2s' });
    // the spark, passing close to each player's head on its beat
    spark(sp[0] + 10 * Math.sin(t * 5), sp[1] + 8 * Math.sin(t * 7.3), 7, tt);
    if (t > t0 + dur - .25) { boilSeed('Q2-streak'); for (let i = 0; i < 3; i++) inkLine([[sp[0] - 20, sp[1] + (i - 1) * 8], [sp[0] - 320, sp[1] + (i - 1) * 14 + 50]], 2.4 - i * .5, i === 1 ? JZ.cream : JZ.mustLt, 'inkfine', 0); }
    camEnd();
  }

  // ======================================================================
  // Q3 · "Take my hand, don't close the door / We can find what we had before" (170.13–175.84)
  // The club door: a tall bar of cream light in the ink wall, narrowing as the door swings shut. The spark flies into
  // it. The singer runs for it, reaching; the sax ribbon shoots past overhead and wedges in the gap: the door bumps on
  // it and holds, a crack of light open. The camera settles on the door, centred (the seam into R).
  // ======================================================================
  const Q3C = { jamb: 860, top: 180, bot: 1000, full: 440, wedge: bt(99, 3), shoot: bt(99, 3) - .34 };
  function Q3gap(t) {
    if (t < Q3C.wedge) return lerp(Q3C.full, 200, seg(t, 170.13, Q3C.wedge) * (.8 + .2 * seg(t, 170.13, Q3C.wedge)));
    return 200 + 22 * spring(t, Q3C.wedge, 6, 22) * -1 + 0;
  }
  function Q3sx(t) {   // the singer's run: in from the left, slowing as it reaches the door
    return kf(t, [[170.7, -260], [172.4, 180], [173.6, 430], [174.5, 540]], x => x);
  }
  function Q3(t, lt, dur) {
    const tt = t > Q3C.shoot - .05 && t < Q3C.wedge + .1 ? t : TT(t), t0 = t - lt;
    plate('Q3');
    const settle = ease(seg(tt, 173.3, 175.25));
    camBegin(lerp(820, 960, settle), lerp(610, 540, settle), lerp(1.13, 1, settle));
    const g = Q3gap(tt), J = Q3C.jamb, dR = J + Q3C.full;
    boilSeed('Q3-wall'); ground(JZ.ink);
    halftone('ramp', 960, 200, 2600, 600, JZ.ink2, .5, Math.PI);
    block(rectPts(-400, Q3C.bot, 2800, 400), JZ.ink2, { ink: null });
    // the light: the crack, its glow, the spill on the floor
    boilSeed('Q3-light');
    const spill = ease(seg(t, Q3C.wedge, Q3C.wedge + .8));
    glow(J + g / 2, 560, 380 + g * .6 + 260 * spill, '#FFE2A8', .55 + .2 * spill);
    paint([[J, Q3C.bot], [J + g, Q3C.bot], [J + g * 1.9 + 120, 1200], [J - 120, 1200]], { wash: JZ.cream, washOp: 60 + 50 * spill, fill: JZ.cream, fillOp: 40, bleed: .06, tex: .5, border: .5, ink: null });
    paint(rectPts(J, Q3C.top, g, Q3C.bot - Q3C.top), { wash: JZ.cream, ink: null });
    glow(J + g / 2, 590, 160, '#FFF1C8', .5);
    // the ribbon: shoots in from the left, overhead, into the crack; the door pins its end
    const grow = easeOut(seg(t, Q3C.shoot, Q3C.shoot + .32));
    if (grow > 0) {
      const A = [-260, 300], Bp = [J + g + 14, 610], amp = lerp(90, 34, seg(t, Q3C.wedge, Q3C.wedge + 1.5)), P = [];
      for (let i = 0; i <= 26; i++) {
        const k = i / 26, env = Math.pow(Math.sin(Math.PI * k), .8);
        P.push([lerp(A[0], Bp[0], k), lerp(A[1], Bp[1], k * k * .6 + k * .4) + amp * env * Math.sin(k * 2.6 * TAU - tt * 3.4) - 60 * Math.sin(Math.PI * k)]);
      }
      saxRibbon(P, 70, tt, { grow, key: 'Q3', tspeed: 1.4, taper: true, shine: 1 });
      if (grow < 1) { boilSeed('Q3-rs'); const tipI = Math.floor(grow * 26), tp = P[tipI]; for (let i = 0; i < 4; i++) inkLine([[tp[0] - 30 - i * 20, tp[1] + (i - 1.5) * 26], [tp[0] - 380 - i * 60, tp[1] + (i - 1.5) * 34 + 40]], 2.4 - i * .4, i % 2 ? JZ.orangeLt : JZ.cream, 'inkfine', 0); }
      if (t >= Q3C.wedge - .02) { boilSeed('Q3-knot'); const kx = J + g, ky = 610, sq = 1 + .5 * hitK(t - Q3C.wedge, 6); paint([[kx - 38 * sq, ky - 30], [kx - 8, ky - 44 * sq], [kx + 10, ky - 20], [kx + 12, ky + 22], [kx - 6, ky + 40 * sq], [kx - 34 * sq, ky + 24]], { wash: JZ.orange, fill: JZ.orangeDk, fillOp: 70, tex: .4, ink: JZ.ink, sw: 1.4, curv: .3 }); inkLine([[kx - 30, ky - 12], [kx - 6, ky - 4], [kx - 26, ky + 14]], 1.6, JZ.orangeDk, 'ink', .5); }
    }
    // the door leaf (pinning the ribbon) and the frame
    boilSeed('Q3-door');
    const lf = mixCol(JZ.ink, JZ.ink2, .6);
    paint(rectPts(J + g, Q3C.top, dR - J - g, Q3C.bot - Q3C.top), { wash: lf, ink: JZ.ink, sw: 1.8 });
    const pw = dR - J - g;
    if (pw > 60) { paint(rectPts(J + g + 26, Q3C.top + 40, pw - 52, 300), { ink: mixCol(JZ.ink2, JZ.blueDk, .5), sw: 1 }); paint(rectPts(J + g + 26, Q3C.top + 400, pw - 52, 360), { ink: mixCol(JZ.ink2, JZ.blueDk, .5), sw: 1 }); }
    inkLine([[J + g, Q3C.top], [J + g, Q3C.bot]], 5, mixCol(JZ.cream, lf, .4), 'ink', 0);
    paint([[J - 30, Q3C.top - 30], [dR + 30, Q3C.top - 30], [dR + 30, Q3C.bot], [dR, Q3C.bot], [dR, Q3C.top], [J, Q3C.top], [J, Q3C.bot], [J - 30, Q3C.bot]], { wash: mixCol(JZ.ink2, JZ.ink, .5), ink: JZ.ink, sw: 1.6 });
    if (t < Q3C.wedge + .5) { const k = 1 - clamp((t - Q3C.wedge) / .5); if (t > Q3C.wedge) for (let i = 0; i < 5; i++) { const an = -1.2 + i * .6; inkLine([[J + g + Math.cos(an) * 30, 610 + Math.sin(an) * 30], [J + g + Math.cos(an) * (30 + 60 * (1 - k)), 610 + Math.sin(an) * (30 + 60 * (1 - k))]], 4 * k, JZ.cream, 'ink', 0); } }
    // the spark from Q2 flies into the light
    const sk = seg(t, t0, t0 + .36);
    if (sk < 1) {
      const p = arcPt([-40, 360], [J + g * .45, 540], 70, sk), q = arcPt([-40, 360], [J + g * .45, 540], 70, Math.max(0, sk - .25));
      boilSeed('Q3-sk'); for (let i = 0; i < 3; i++) inkLine([[q[0], q[1] + (i - 1) * 7], [p[0] - 10, p[1] + (i - 1) * 3]], 2 - i * .4, i === 1 ? JZ.cream : JZ.mustLt, 'inkfine', 0);
      spark(p[0], p[1], 6.5, tt, 1 - seg(sk, .9, 1));
    }
    if (sk >= 1 && t < t0 + .7) glow(J + g * .45, 540, 420, '#FFF1C8', .6 * (1 - seg(t, t0 + .36, t0 + .7)));
    camEnd();
    // the singer, a big foreground figure in the door's back-light (screen space, so it slides past the door with
    // parallax): runs in, reaches; ducks as the ribbon shoots overhead, then reaches for the crack
    if (tt > 170.7) {
      const x = Q3sx(tt), v = Q3sx(tt + .05) - x, run = clamp(v / 14);
      const reach = ease(seg(tt, 171.9, 172.4)), duck = Math.sin(Math.PI * seg(tt, Q3C.shoot, Q3C.shoot + .5));
      const ph = x / 150 * TAU, bob = run > .05 ? Math.abs(Math.sin(ph)) : 0, u = 44, fy = 1012;
      const rim = clamp((x + 100) / 600);
      glow(x + 3 * u, fy - 5 * u, 260, '#FFE2A8', .25 + .3 * rim);
      singer(x, fy, u, tt, {
        view: 'side', mic: false, sing: false, walk: run > .05 ? x / 150 : null, noShadow: true,
        rot: .17 * run - .08 * duck + .06 * reach, sq: .1 * duck - .07 * reach - .08 * run * (bob - .5), dy: -.9 * run * bob + .35 * duck,
        aL: lerp(-.2 + .8 * run * Math.sin(ph), 1.5 + .06 * Math.sin(tt * 3), reach) - .5 * duck, boilKey: 'Q3s',
        armL: (uu, sw) => { const ext = uu * (.2 + 1.5 * reach * (1 - .6 * duck)); paint(rectPts(-2.3 * uu, -.45 * uu, 2.3 * uu + ext, .9 * uu), { wash: PAL.clay, ink: JZ.ink, sw: sw * .8 }); },
        sil: mixCol(JZ.ink2, PAL.clay, .28), silInk: mixCol(JZ.mustLt, JZ.ink2, .35 * (1 - rim)),
      });
    }
  }

  shots([
    [barT(76), P1], [bt(78, 3), P2], [bt(80, 3), P3], [bt(83, 3), P3b], [barT(85), P4a], [bt(85, 3), P4b],
    [bt(88, 3), TABLE], [barT(93), TABLE], [bt(96, 1), Q2], [bt(97, 3), Q3],
  ]);
})();
