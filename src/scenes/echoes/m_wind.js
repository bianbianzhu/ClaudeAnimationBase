// echoes/m_wind.js: "Echoes of Myself" shot M (173.38 → 189.12), "the wind" (bridge, bars 88–96). See STORYBOARD_echoes.md.
//   in:      ECH.petalWipe p .5 → 1 over the first 0.5 s (the L | M contract): the gust of petals clears off a lavender
//            pre-dawn hilltop above the lake; tall grass bends in travelling waves, wind streaks, petals still flying.
//   173.38   masked Clawd (cracked mask) climbs right up the slope into the wind, leaning, 1 step a beat; plants at the crest.
//   177.32   bar 90: turns to camera; the right arm rises, the mask slides off the face into the hand (177.81) and is held
//            out: the true face, sad and tender, looks at the painted smile (the camera has pushed in).
//   179.33   bar 91: a gust runs through the grass from the left; as it reaches Clawd the arm opens and the wind takes the
//            mask: it tumbles away up and right on arcs over the lake, shrinking. Clawd's eyes follow it.
//   180.27   relieved: eyes close, a long breath out.
//   181.25   bar 92: crouch, then both arms fly open (brave); the ember kindles in the chest and beats on the beat.
//   183.22   bar 93: the ember rises out of the chest above the head, growing. Clawd looks up (wonder).
//   185.19   bar 94: it pulls in and bursts into a flock of light birds that spiral up and right on the wind; the camera
//            pulls back and tilts up with them.
//   187.15   bar 95 (out, M → N): the birds swoop left → right into one horizontal line of light across the middle of the
//            frame, drawn left to right like the film's opening, while the lower half sinks into the violet inner world
//            and the upper half settles to the hill sky. Last frame = the first frame of shot N (line, split backdrop).
(() => {
  const { C, S, bt } = ECH;
  const T0 = S.M, TN = S.N, u = 24;
  const XC = 1500, YC = 600;                                      // the crest (world px)
  const hy = x => YC + Math.pow((x - XC) / (x < XC ? 860 : 620), 2) * 330;
  // the climb: one step a beat, easing to a stop on a whole step so the legs land neutral
  const TA = T0 + 6.5 * BEAT, TB = TA + BEAT, WK = [[T0, 1], [TA, 1], [TB, 0]];
  const XE = XC - 30, X0 = XE - ECH.walkOn(TB + 9, 0, u, WK).x, YE = hy(XE);
  const T_TURN = bt(360), T_GRAB = bt(361), T_REL = bt(364) + .04, T_RELIEF = bt(366), T_OPEN = bt(368), T_KIN = bt(369) - .3,
    T_RISE = bt(372), T_BURST = bt(376), T_FORM = bt(380);

  // ---------- wind ----------
  // gust fronts that run left → right through the grass and reach Clawd at tg
  const GUSTS = [[174.6, .45], [176.4, .5], [T_REL, 1], [T_BURST + .25, .8], [T_FORM - .2, .5]];
  const gust = (x, t) => GUSTS.reduce((s, [tg, a]) => { const xg = XE - 900 + 1500 * (t - tg); return s + a * Math.exp(-Math.pow((x - xg) / 280, 2)); }, 0);
  const bend = (x, t) => .28 + .14 * Math.sin(x * .011 - t * 3.4) + .1 * Math.sin(x * .004 - t * 1.7) + .75 * gust(x, t);

  // ---------- Clawd ----------
  const MOOD = [[T0, 'determined'],
    [T_GRAB + .08, 'sad', { tint: null, gloom: .12, emote: null, mouth: null, lookX: .85, lookY: -.15 }],
    [T_RELIEF, 'relieved', { emote: null, mouth: 'o' }],
    [T_OPEN, 'determined', { eyes: 'normal', mouth: null, lookY: -.35 }],
    [T_RISE, 'hopeful', { mouth: 'o', blush: .2, lookY: -.95 }],
    [T_BURST, 'surprised', { emote: null, eyes: 'shine', lookY: -.9 }],
    [T_BURST + .75, 'hopeful', { mouth: 'o', lookX: .6, lookY: -1 }]];
  const AR = [[T_TURN, .15], [T_TURN + .22, .08], [T_GRAB, 1.35], [T_GRAB + .4, .55], [T_REL - .28, .55], [T_REL - .04, .9], [T_REL + .25, -.05],
    [T_RELIEF, -.1], [T_RELIEF + .45, -.55], [T_OPEN - .2, -.7], [T_OPEN + .18, .85], [T_RISE, .8], [T_RISE + .5, 1.05], [T_BURST - .3, .95],
    [T_BURST - .05, .6], [T_BURST + .25, 1.4], [T_BURST + 1.5, 1.2], [TN, 1.0]];
  const AL = [[T_TURN, .15], [T_GRAB, 0], [T_GRAB + .4, -.25], [T_RELIEF, -.25], [T_RELIEF + .5, -.6], [T_OPEN - .15, -.72], [T_OPEN + .28, .7],
    [T_RISE, .72], [T_RISE + .6, .95], [T_BURST - .25, .9], [T_BURST, .55], [T_BURST + .35, 1.3], [T_BURST + 1.6, 1.1], [TN, .95]];
  const SQ = [[T_OPEN - .3, 0], [T_OPEN - .02, .14], [T_OPEN + .2, -.1], [T_OPEN + .6, 0], [T_BURST - .3, 0], [T_BURST - .02, .1], [T_BURST + .15, -.12], [T_BURST + .6, 0]];

  function pose(t) {
    const w = ECH.walkOn(t, X0, u, WK), x = w.x, y = hy(x), m = emotions(t, MOOD, { take: .8 }), g = gust(x, t);
    if (t < T_TURN) return { x, y, o: { ...m, walk: w.walk, view: 'side', dy: m.dy * .3 + w.dy, sq: m.sq * .5, rot: .11 + .06 * g + .025 * Math.sin(w.walk * TAU * 2),
      aL: w.aL + .15, aR: .15, maskCrack: 1, lookX: 0, lookY: 0 } };
    const aR = kf(t, AR) + .14 * spring(t, T_REL + .25, 5, 14) + .1 * spring(t, T_OPEN + .18, 5, 13) + .04 * Math.sin(t * 9);
    const aL = kf(t, AL) + .1 * spring(t, T_OPEN + .28, 5, 12) + .04 * Math.sin(t * 8 + 1);
    const o = { ...m, ...ECH.heading(t, .25, [[T_TURN, 0]]), aL, aR, rot: (m.rot || 0) * .4 + .04 * g, sq: (m.sq || 0) + kf(t, SQ), maskCrack: 1 };
    if (t < T_GRAB) { const k = ease(seg(t, T_GRAB - .25, T_GRAB)); o.maskOff = [1.7 * k, -.35 * k]; } else o.noMask = true;
    const ek = t < T_RISE ? ease(seg(t, T_KIN, T_KIN + .9)) : 0;   // the ember low in the chest (-3u), the film's convention
    o.emberK = 0; if (ek > .01) o.draw = (uu) => ECH.ember(0, -3 * uu, uu * .55, T, ek, 'chest');
    return { x, y, o };
  }
  // body-local (front-view units) → world, through clawd()'s transform
  function toW(p, lx, ly) {
    const o = p.o, sq = o.sq || 0, r = o.rot || 0, c = Math.cos(r), s = Math.sin(r);
    lx *= 1 + sq * .6; ly *= 1 - sq;
    return [p.x + (o.dx || 0) * u + lx * c - ly * s, p.y + (o.dy || 0) * u + lx * s + ly * c];
  }
  const tipR = p => { const a = p.o.aR ?? .2, px = 4.9 + .55 * clamp((Math.abs(a) - .7) / .9); return toW(p, (px + 2.2 * Math.cos(a)) * u, (-4.5 - 2.2 * Math.sin(a)) * u); };
  // the mask held by its rim at the right arm tip
  const holdAt = (p, t) => { const [x, y] = tipR(p); return [x + 3.1 * u, y - .15 * u + 4 * Math.sin(t * 6)]; };
  const P_GRAB = toW(pose(T_GRAB), 1.7 * u, -5.75 * u), P_REL = holdAt(pose(T_REL), T_REL);
  const FL = through([[0, 0], [150, -170], [380, -120], [640, -360], [900, -300], [1250, -560], [1650, -640]], 8);
  const along = (P, k) => { const f = clamp(k) * (P.length - 1), i = Math.min(P.length - 2, Math.floor(f)), r = f - i; return [lerp(P[i][0], P[i + 1][0], r), lerp(P[i][1], P[i + 1][1], r)]; };
  function maskState(t, p) {
    if (t < T_GRAB) return null;
    if (t < T_REL) {
      const k = ease(seg(t, T_GRAB, T_GRAB + .4)), h = holdAt(p, t), fl = Math.sin(t * 7) * .07 + .04 * Math.sin(t * 13);
      return { x: lerp(P_GRAB[0], h[0], k), y: lerp(P_GRAB[1], h[1], k), s: lerp(u, .9 * u, k), rot: k * (.1 + fl), sx: 1 - .12 * k * Math.abs(Math.sin(t * 5)), flip: false };
    }
    const k = seg(t, T_REL, T_REL + 3.0), kk = k * (.55 + .45 * k), d = along(FL, kk), c = Math.cos(kk * TAU * 2.2);
    return { x: P_REL[0] + d[0], y: P_REL[1] + d[1], s: lerp(.9, .42, kk) * u, rot: .1 + 6 * kk, sx: Math.max(.1, Math.abs(c)), flip: c < 0, k };
  }
  // the ember rising out of the chest, then the burst
  const P_CHEST = toW(pose(T_RISE), 0, -3 * u);
  function emberAt(t) {
    const k = ease(seg(t, T_RISE, T_BURST - .25)), b = Math.sin(bpOf(t) * Math.PI);
    return { x: P_CHEST[0] + 20 * k + .4 * u * b * k, y: P_CHEST[1] - 10 * u * k, s: lerp(.55, 1.25, k) * u * (1 - .35 * ease(seg(t, T_BURST - .28, T_BURST))) };
  }
  const P0 = (() => { const e = emberAt(T_BURST); return [e.x, e.y]; })();

  // ---------- camera ----------
  const FLK = (() => { const a = T_FORM - T_BURST; return [P0[0] + 330 * a + 45 * a * a, P0[1] - 140 * a - 25 * a * a]; })();   // the flock's centre at bar 95
  const TC = T_TURN - .3, XTC = ECH.walkOn(TC, X0, u, WK).x;
  const CAMK = [[TC, [XTC + 360, hy(XTC) - 170, 1.15]], [178.3, [XE + 260, YE - 150, 1.5]], [179.3, [XE + 290, YE - 160, 1.52]], [180.7, [XE + 390, YE - 175, 1.45]],
    [181.6, [XE + 300, YE - 200, 1.38]], [T_RISE, [XE + 250, YE - 240, 1.42]], [T_BURST, [XE + 280, YE - 330, 1.3]], [T_FORM + .4, [FLK[0] + 470, FLK[1] + 300, 1.0]]];
  function camAt(t) {
    if (t < TC) { const x = ECH.walkOn(t, X0, u, WK).x; return { cx: x + 360, cy: hy(x) - 170, z: 1.15 }; }
    const [cx, cy, z] = t > T_BURST ? kf(T_BURST + Math.pow(seg(t, T_BURST, T_FORM + .4), 1.5) * (T_FORM + .4 - T_BURST), CAMK) : kf(t, CAMK), d = Math.max(0, t - T_FORM - .4); return { cx: cx + 60 * d * d / (d + .5), cy, z };
  }
  const scr = (cam, x, y) => [W / 2 + (x - cam.cx) * cam.z, H / 2 + (y - cam.cy) * cam.z];

  // ---------- the birds ----------
  const NB = 16;
  function birdW(i, t) {
    const age = t - T_BURST, h1 = hash(i * 3.1 + 1), h2 = hash(i * 5.7 + 2), h3 = hash(i * 7.3 + 3);
    const rb = (70 + 90 * h2) * easeOut(age / .5) + 40 * age, th = i / NB * TAU + h1 * .5 + (1.6 + .8 * h3) * age;
    return [P0[0] + 330 * age + 45 * age * age + rb * Math.cos(th), P0[1] - 140 * age - 25 * age * age + rb * Math.sin(th) * .75];
  }
  const RANK = (() => { const c = camAt(T_FORM), xs = []; for (let i = 0; i < NB; i++) xs.push([scr(c, ...birdW(i, T_FORM))[0], i]); xs.sort((a, b) => a[0] - b[0]); const r = []; xs.forEach(([, i], k) => { r[i] = k; }); return r; })();
  const SPACE = (W + 120) / NB, tgtX = i => -60 + (RANK[i] + .5) * SPACE;
  const T_PEN = T_FORM + .3, T_DONE = TN - .3;
  const penX = t => lerp(-60, W + 60, seg(t, T_PEN, T_DONE));
  const arriveT = i => lerp(T_PEN, T_DONE, (tgtX(i) + 60) / (W + 120));
  const formW = (i, t) => seg(t, arriveT(i) - .8, arriveT(i));

  // ---------- the split backdrop (the same drawing opens shot N) ----------
  function splitBack(t, k) {
    if (k <= .01) return;
    const a = 255 * clamp(k), E = 1700;
    push(); translate(960, 540);
    boilSeed('nb top');
    paint(rectPts(-E, -E, 2 * E, E + 40), { wash: C.hillTop, washOp: a, ink: null });
    for (let i = 1; i <= 4; i++) { const y = -540 + 108 * i, c = mixCol(C.hillTop, C.hillBot, i / 4); paint(rectPts(-E, y, 2 * E, -y), { wash: c, washOp: a, ink: null }); paint(rectPts(-E, y - 36, 2 * E, 72), { fill: c, fillOp: 90 * clamp(k), bleed: .3, tex: .3, border: .2, ink: null }); }
    boilSeed('nb bot');
    paint(rectPts(-E, 0, 2 * E, E), { wash: C.void, washOp: a, ink: null });
    for (let i = 1; i <= 4; i++) { const y = 540 - 108 * i, c = mixCol(C.void, C.voidLt, i / 4); paint(rectPts(-E, 0, 2 * E, y), { wash: c, washOp: a, ink: null }); paint(rectPts(-E, y - 36, 2 * E, 72), { fill: c, fillOp: 90 * clamp(k), bleed: .3, tex: .3, border: .2, ink: null }); }
    for (let i = 0; i < 30; i++) {
      const sx = hash(i * 3.3 + 11) * W - 960, sy = 20 + 520 * hash(i * 7.7 + 5), tw = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      boilSeed('split st' + i);
      paint(starPts(sx, sy, (3 + 5 * hash(i + 2)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: (120 + 110 * tw) * clamp(k), ink: null });
    }
    pop();
  }

  // ---------- the hill ----------
  function sky(t) {
    ECH.skyGrad(C.hillTop, C.hillBot, 'msky', 6, -60, H + 120);
    for (let i = 0; i < 14; i++) {
      boilSeed('mstar' + i);
      const tw = .5 + .5 * Math.sin(t * 1.6 + i * 2.1);
      paint(starPts(hash(i * 4.1 + 1) * W, 30 + 260 * hash(i * 2.7 + 3), (3 + 4 * hash(i)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: 90 + 80 * tw, ink: null });
    }
    glow(W * .78, H * .72, 620, C.goldLt, .35);
  }
  function farLayers(cam, t) {
    ECH.layer(cam, .15, () => {
      boilSeed('mridge');
      const P = [[-600, 900]]; for (let x = -600; x <= 2600; x += 90) P.push([x, 655 + 34 * Math.sin(x * .004) + 22 * Math.sin(x * .011 + 1)]); P.push([2600, 900]);
      paint(P, { wash: mixCol(C.hillTop, '#6E6AA6', .45), fill: mixCol(C.hillTop, '#5E5A96', .5), fillOp: 60, tex: .4, ink: null });
    });
    ECH.layer(cam, .3, () => {
      boilSeed('mlake');
      paint(rectPts(-800, 700, 3800, 1200), { wash: mixCol(C.hillTop, C.lakeBot, .45), fill: mixCol(C.hillTop, C.hillBot, .4), fillOp: 70, bleed: .2, tex: .4, ink: null });
      paint(ellPts(1560, 730, 380, 12, 18), { wash: C.hillBot, washOp: 140, ink: null });
      paint(ellPts(1600, 770, 240, 8, 16), { wash: C.goldLt, washOp: 110, ink: null });
      ECH.ripples(t, -400, 2800, 712, 1150, { col: mixCol(C.hillBot, PAL.cream, .5), n: 20, key: 'mlake' });
      boilSeed('mlakeedge');
      inkLine([[-800, 700], [400, 701], [1600, 700], [2900, 701]].map(([x, y]) => [x, y]), .6, mixCol(C.hillTop, PAL.ink, .3), 'inkfine', 0);
    });
  }
  function hill(cam, t) {
    const vx0 = cam.cx - W / 2 / cam.z - 200, vx1 = cam.cx + W / 2 / cam.z + 200, vy1 = cam.cy + H / 2 / cam.z + 200;
    const P = []; for (let x = vx0; x <= vx1 + 1; x += (vx1 - vx0) / 24) P.push([x, Math.min(hy(x), vy1)]);
    boilSeed('mhill');
    paint(P.concat([[vx1, vy1], [vx0, vy1]]), { wash: mixCol(C.grass, C.hillTop, .3), fill: mixCol(C.grass, PAL.ink, .25), fillOp: 70, bleed: .12, tex: .55, ink: null });
    // dawn rim light along the ridge
    const R = P.filter(([x]) => hy(x) < vy1 - 40);
    if (R.length > 2) {
      boilSeed('mrim');
      paint(ribbon(R.map(([x, y]) => [x, y + 10]), 22, 22), { fill: C.hillBot, fillOp: 70, bleed: .2, tex: .4, ink: null });
      for (let i = 0; i + 1 < R.length; i += 6) { boilSeed('mridgeln' + i); inkLine(R.slice(i, i + 7), .8, mixCol(C.grass, PAL.ink, .5), 'ink', .4); }
    }
  }
  const BLADE0 = 560, BLADE_N = 175;
  function blade(i, t, front) {
    const bx = BLADE0 + i * 12 + hash(i * 1.9) * 8, by = hy(bx) + 4 + 10 * hash(i * 4.3), h = (58 + 62 * hash(i * 2.3)) * (front ? 1.3 : 1);
    const hc = hash(i * 8.9), b = bend(bx, t) * (.7 + .5 * hash(i * 6.1));
    const col = hc < .35 ? mixCol(C.grass, C.hillBot, .25 + .3 * hash(i)) : hc < .7 ? mixCol(C.grass, C.hillTop, .3 + .3 * hash(i)) : mixCol(C.grass, PAL.ink, .12 + .15 * hash(i + 3));
    boilSeed('mbl' + i + (front ? 'f' : ''));
    const P = [[bx, by], [bx + Math.sin(b * .45) * h * .55, by - Math.cos(b * .45) * h * .55], [bx + Math.sin(b) * h, by - Math.cos(b) * h]];
    paint(ribbon(P, 8 + 5 * hash(i * 3.7), .8), { wash: col, ink: i % 3 ? null : mixCol(col, PAL.ink, .45), sw: .35, br: 'inkfine' });
  }
  function grass(cam, t, front) {
    for (let i = 0; i < BLADE_N; i++) {
      if (front !== (hash(i * 5.3 + 7) > .72)) continue;
      const bx = BLADE0 + i * 12; if (!ECH.inView(cam, bx, 100)) continue;
      blade(i, t, front);
    }
  }
  function petals(t, cam) {
    for (let i = 0; i < 12; i++) {
      if (hash(i * 2.2) < seg(t, T0 + .5, T0 + 6)) continue;
      const sp = 700 + 300 * hash(i + 4), x = frac(hash(i * 3.3) + (t - T0) * sp / (W + 300)) * (W + 300) - 150, y = 80 + 700 * hash(i * 5.1) + 50 * Math.sin(t * 2 + i);
      ECH.petal(x, y, 13 + 8 * hash(i), t * 4 + i, i % 3 ? '#F2B8C6' : PAL.cream, 'mp' + i);
    }
  }

  // ---------- the shot ----------
  function shotM(t, lt, dur) {
    const cam = camAt(t), p = pose(t);
    sky(t);
    farLayers(cam, t);
    camBegin(cam.cx, cam.cy, cam.z);
    hill(cam, t);
    grass(cam, t, false);
    const ms = maskState(t, p);
    ECH.masked(p.x, p.y, u, { ...p.o, boilKey: 'mclawd' });
    grass(cam, t, true);
    if (ms && (!ms.k || ms.k < 1)) ECH.looseMask(ms.x, ms.y, ms.s, ms.rot, { crack: 1, sx: ms.sx, flip: ms.flip, key: 'm' });
    // the ember out of the chest
    if (t >= T_RISE && t < T_BURST) { const e = emberAt(t); glow(e.x, e.y, e.s * 9, C.goldLt, .35); ECH.ember(e.x, e.y, e.s, t, 1, 'mrise'); }
    if (t >= T_BURST && t < T_BURST + .8) {
      const a = t - T_BURST;
      glow(P0[0], P0[1], 60 + 520 * easeOut(a / .5), C.goldLt, 1 - a / .8);
      glow(P0[0], P0[1], 40 + 200 * easeOut(a / .3), PAL.cream, 1 - a / .5);
    }
    camEnd();
    ECH.windStreaks(t, { n: 11, col: PAL.cream, sw: .9, speed: 1100, key: 'm' });
    petals(t, cam);
    // M → N: the flock becomes the line; the world splits into the hill sky above and the inner world below
    splitBack(t, ease(seg(t, T_FORM + .3, TN - .05)));
    if (t >= T_BURST) {
      const px = penX(t);
      if (t >= T_PEN) {
        ECH.theLine(-40, Math.min(W + 40, px), 540, 1, { key: 'nline', glow: .45 + .15 * (.5 + .5 * pulse(t, 4)) });
        if (t < T_DONE) { glow(px, 540, 150, C.goldLt, .8); glow(px, 540, 60, PAL.cream, .9); }
      }
      for (let i = 0; i < NB; i++) {
        const age = t - T_BURST, wi = formW(i, t), e = ease(wi), sp = scr(cam, ...birdW(i, t));
        const q = [lerp(sp[0], tgtX(i), e), lerp(sp[1], 540, e) - 60 * Math.sin(Math.PI * e)];
        const k = seg(age, 0, .2) * (1 - seg(wi, .85, 1)), hb = hash(i * 9.1);
        if (k > .01) ECH.lightBird(q[0], q[1], (28 + 10 * hb) * (1 - .3 * seg(wi, .6, 1)), bpOf(t) * (hb > .5 ? 1.5 : 1) + hb, k, 'm' + i);
      }
    }
    if (lt < .5) ECH.petalWipe(.5 + lt, t);
  }
  shots([[ECH.S.M, shotM]]);
})();
