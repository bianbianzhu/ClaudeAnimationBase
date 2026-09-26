// jazz/d_chorus1.js: shots N1–N5 (chorus 1, 76.46–104.14, bars 44–59, lyric lines 13–20). The film's first
// full-colour burst, on ones (24 fps): the door slams behind the one who left, every sound shape bursts out after it,
// the singer breaks down and resolves, the shapes chase the train into the tunnel (the sax bell), the singer is left
// alone with the shapes orbiting, turns away, and the piano run wipes the frame to the solo's flat mustard.
(() => {
  const B = beatT, bb = (bar, beat) => beatT(4 * bar + beat);
  const T0 = barT(44), SLAM = barT(45), BURST = bb(45, 1), CUT1 = bb(45, 3), CUT2 = bb(46, 3), CRASH = barT(47);
  const DET = bb(48, 2), CUT3 = bb(49, 1), BELL = barT(52), CUT5 = bb(56, 1), RUN = barT(59), END = barT(60);

  // ---------- local helpers ----------
  const rot2 = (x, y, P, r, s = 1) => P.map(([a, b]) => [x + (a * Math.cos(r) - b * Math.sin(r)) * s, y + (a * Math.sin(r) + b * Math.cos(r)) * s]);
  function tileAt(x, y, s, r, dark, sw = 1) { paint(rot2(x, y, [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]], r, s), { wash: dark ? JZ.ink : JZ.cream, ink: dark ? JZ.cream : JZ.ink, sw }); }
  const SHARD = [[[1, 0], [-.6, .8], [-.4, -.9]], [[1, -.2], [.2, .9], [-1, .3], [-.3, -.8]], [[1.1, 0], [-.5, .5], [-.8, -.2]]];
  function shardAt(x, y, r, a, col, kind, sw = 1) { paint(rot2(x, y, SHARD[kind % 3], a, r), { wash: col, ink: JZ.ink, sw }); }
  const SHCOL = [JZ.verm, JZ.vermDk, JZ.mustard, JZ.verm];
  // dry-brush speed streaks behind a fast thing (a smear, never blur)
  function streak(x, y, vx, vy, len, w, col) {
    const d = Math.hypot(vx, vy) || 1, ux = vx / d, uy = vy / d;
    for (let i = 0; i < 3; i++) { const o = (i - 1) * w * .4, l = len * (1 - Math.abs(i - 1) * .35); inkLine([[x - uy * o - ux * w * .3, y + ux * o - uy * w * .3], [x - ux * l - uy * o, y - uy * l + ux * o]], 1.8 - Math.abs(i - 1) * .6, col, 'ink', 0); }
  }
  // a wavy centreline from A to B (points at k0..k1 of the way), with a hump (lift) and a travelling wave
  function wavePath(A, B2, t, o = {}) {
    const n = o.n ?? 30, k0 = o.k0 ?? 0, k1 = o.k1 ?? 1, dx = B2[0] - A[0], dy = B2[1] - A[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, P = [];
    for (let i = 0; i <= n; i++) {
      const k = lerp(k0, k1, i / n), w = (o.amp ?? 60) * Math.sin(k * (o.waves ?? 1.4) * TAU - t * (o.speed ?? 1.2) * TAU) * Math.pow(Math.sin(Math.PI * clamp(k)), .6);
      P.push([A[0] + dx * k + nx * w, A[1] + dy * k + ny * w + (o.lift ?? 0) * Math.sin(Math.PI * k)]);
    }
    return P;
  }
  // a flat ink silhouette with a thin light rim on the side facing the light (dx > 0: light from the right)
  function rimSil(rim, a, dx, fn) {
    if (a > .02) { push(); translate(dx, -Math.abs(dx) * .4); silhouette(mixCol(JZ.ink, rim, clamp(a)), fn); pop(); }
    silhouette(JZ.ink, fn);
  }
  // a brass bell rim (an annulus) round an opening: the sax bell = the tunnel mouth
  function bellRim(cx, cy, rx, ry, th, sw = 1.6) {
    boilSeed('bellrim');
    const n = 56, O = ellPts(cx, cy, rx + th, ry + th, n), I = ellPts(cx, cy, rx, ry, n);
    paint([...O, O[0], I[0], ...I.slice(1).reverse(), I[0]], { wash: JZ.brass, ink: null });
    // the inner lip in shadow, a highlight sliding round the outer edge
    inkLine(ellPts(cx, cy, rx + th * .25, ry + th * .25, n).slice(8, 30), th * .35, JZ.brassDk, 'ink', .5);
    inkLine(ellPts(cx, cy, rx + th * .75, ry + th * .75, n).slice(34, 50), th * .16, JZ.brassLt, 'ink', .5);
    inkLine(O.concat([O[0]]), sw * 1.6, JZ.ink, 'ink', .3);
    inkLine(I.concat([I[0]]), sw, JZ.ink, 'ink', .3);
  }
  // a hard flat cone of light (a printed wedge, not an airbrush) with a halftone pool on the floor
  function cone(x0, y0, x1, y1, w, key, floor = JZ.ink2) {
    boilSeed('cone' + key);
    paint([[x0 - w * .07, y0], [x0 + w * .07, y0], [x1 + w / 2, y1], [x1 - w / 2, y1]], { wash: mixCol(JZ.ink, JZ.cream, .13), ink: null });
    paint(ellPts(x1, y1, w * .55, w * .12, 32), { wash: mixCol(floor, JZ.cream, .3), ink: null });
    halftone('disc', x1, y1, w * 1.3, w * .3, JZ.cream, .45);
    glow(x1, y1 - w * .5, w * .7, '#FFE2A8', .25);
  }
  const inkOver = a => { if (a > .01) paint(rectPts(-600, -600, W + 1200, H + 1200), { wash: JZ.ink, washOp: 255 * clamp(a), ink: null }); };

  // ---------- N1a · the door (76.46–79.50) ----------
  // From black, a door-shaped sliver of street light in the dark club: the door opens, a rose silhouette stands in it
  // and walks away into the light; the door swings shut and SLAMS on the chorus downbeat. The lights come up full
  // colour, the band hits, every sound shape springs out of its instrument and rushes the door; the first ones blow it
  // open on the backbeat and the whole flood pours out after the one who left. Bar 44 on twos, the burst on ones.
  const DR = { x0: 1480, x1: 1680, y0: 300, y1: 800 };
  function doorOpen(t) {
    if (t >= SLAM) return t < BURST ? 0 : .93 + .07 * backOut(seg(t, BURST, BURST + .1)) - .02 * Math.sin(seg(t, BURST + .1, BURST + .5) * Math.PI);
    if (t < T0 + .06) return 0;
    if (t < T0 + .3) return .1 * easeOut(seg(t, T0 + .06, T0 + .3));
    if (t < T0 + .55) return lerp(.1, .85, ease(seg(t, T0 + .3, T0 + .55)));
    if (t < 77.55) return lerp(.85, .8, seg(t, T0 + .55, 77.55));
    if (t < 77.8) return lerp(.8, .62, ease(seg(t, 77.55, 77.8)));
    return lerp(.62, 0, easeIn(seg(t, 77.8, SLAM - .03)));
  }
  function clubDoor(open, lit, inside, part = 'all') {
    const { x0, x1, y0, y1 } = DR, w = x1 - x0, gx = x0 + w * clamp(open);
    if (part !== 'gap') { boilSeed('N1-jamb'); block(rectPts(x0 - 24, y0 - 24, w + 48, y1 - y0 + 24), JZ.ink, { ink: JZ.ink, sw: 1.4 }); }
    if (part !== 'frame' && open > .004) {
      boilSeed('N1-gap');
      paint(rectPts(x0, y0, gx - x0, y1 - y0), { wash: JZ.mustLt, ink: null });
      if (inside) inside(gx);
    }
    if (part === 'gap') return gx;
    boilSeed('N1-slab');
    const sw0 = Math.max(12, x1 - gx);
    block(rectPts(x1 - sw0, y0, sw0, y1 - y0), lit ? JZ.verm : JZ.ink2, { ink: JZ.ink, sw: 1.6 });
    if (sw0 > 70) {
      block(rectPts(x1 - sw0 + 26, y0 + 40, sw0 - 52, 170), lit ? JZ.vermDk : JZ.ink, { ink: lit ? JZ.ink : null, sw: 1 });
      paint(ellPts(x1 - sw0 + 22, y0 + (y1 - y0) * .56, 8, 8, 10), { wash: lit ? JZ.mustard : JZ.ink, ink: JZ.ink, sw: .8 });
    }
    return gx;
  }
  // the band on its stand, facing the door (right). lit = full colour, else rim-lit ink silhouettes.
  function band1(t, lit, rimA, hitAge) {
    const P = {}, hk = hitK(hitAge, 5), b = bpOf(t), sw8 = Math.sin(b * TAU);
    const draw = (fn) => lit ? fn() : rimSil(JZ.cream, rimA, 3, fn);
    boilSeed('N1-riser');
    block(rectPts(120, 690, 600, 110), lit ? JZ.blueDk : JZ.ink, { ink: JZ.ink, sw: 1.2 });
    draw(() => { P.kit = drummer(270, 690, 15, t, { boilKey: 'N1dr', key: 'N1dr', dy: -.3 * hk, left: { a: -.1 + .6 * Math.max(0, sw8), smear: lit && sw8 > .6 ? .6 : 0 }, right: { a: -.1 + .6 * Math.max(0, -sw8) }, hit: lit ? { snare: hitAge, kick: hitAge, ride: hitAge } : {} }); });
    draw(() => { P.bass = bassist(520, 690, 16, t, { boilKey: 'N1bs', key: 'N1bs', sq: .08 * hk, pluck: lit ? [hitAge, hitAge + .1, 9, 9] : null }); });
    draw(() => { P.pn = pianist(20, 800, 18, t, { boilKey: 'N1pn', key: 'N1pn', dy: -.4 * hk, aL: .35 + .3 * hk }); });
    draw(() => { P.sax = saxist(660, 800, 19, t, { boilKey: 'N1sx', key: 'N1sx', rot: -.12 * hk, sq: -.08 * hk, shine: lit ? frac(t * .8) : null, glow: .8 }); });
    draw(() => { P.tr = trumpeter(880, 800, 18, t, { boilKey: 'N1tr', key: 'N1tr', blow: lit ? .6 + .4 * hk : 0, rot: -.1 * hk }); });
    return P;
  }
  // the burst: 30 pieces (shards and tiles) spring out of the kit and the piano, then home on the door
  const N1P = Array.from({ length: 24 }, (_, i) => ({ i, tile: i % 3 === 1, src: i % 2, h1: hash(i * 3.7 + 1), h2: hash(i * 9.1 + 2), h3: hash(i * 5.3 + 3) }));
  function N1a(t, lt, dur) {
    plate('N1a');
    const lit = t >= SLAM, tt = lit ? t : onTwos(t), open = doorOpen(tt), light = clamp(open * 4);
    const sh = shakeXY(t, 16 * hitK(t - SLAM, 7) + 12 * hitK(t - BURST, 7));
    const pk = ease(seg(t, BURST, CUT1 + .15));
    camBegin(lerp(960, 1290, pk) + sh[0], lerp(540, 520, pk) + sh[1], lerp(1 + .012 * lt, 1.34, pk));
    const D = [(DR.x0 + DR.x1) / 2, 560];
    if (!lit) {
      ground(JZ.ink2);
      boilSeed('N1-floor'); block(rectPts(-400, 800, W + 800, 500), JZ.ink, { ink: null });
      // the light spilling from the gap across the floor, toward the stage
      if (open > .004) { boilSeed('N1-spill'); const gx = DR.x0 + (DR.x1 - DR.x0) * open; paint([[DR.x0, DR.y1], [gx, DR.y1], [gx - 900 * open, 1180], [DR.x0 - 1400, 1180]], { wash: mixCol(JZ.ink, JZ.cream, .16 * light), ink: null }); }
      smoke(tt, 0, 150, 1900, 600, { key: 'N1', op: 14, n: 5 });
      band1(tt, false, .7 * light, 9);
      clubDoor(open, false, null, 'frame');
      // the singer at the mic, leaning after the door as it closes
      const lean = ease(seg(tt, 77.3, 77.95));
      rimSil(JZ.cream, .8 * light, 4, () => singer(1140, 810, 24, tt, { ...feel('sad', tt), emote: null, eyes: 'closed', aR: .45 + .35 * lean, rot: .1 * lean, dx: .3 * lean, boilKey: 'N1sg', key: 'N1sg' }));
      inkOver(1 - seg(tt, T0 + .15, T0 + .75));
      // the door on top of the dark: only light shows at first
      clubDoor(open, false, gx => {
        // it glances back (profile, facing the club), turns its back, and walks away into the light
        const k = ease(seg(tt, 77.28, 77.74)), u = lerp(14, 5, k);
        const v = tt < 77.16 ? { view: 'side', flip: true, rot: -.04 } : turn(tt, 77.16, 77.3, -.25, -.5);
        if (tt > T0 + .32 && k < .98) lover(DR.x0 + 82, lerp(DR.y1 - 4, DR.y1 - 80, k), u, { ...v, boilKey: 'N1lv', walk: k > 0 ? tt * 2.6 : null });
      }, 'gap');
      glow(DR.x0 + 60, 560, 240 * light, '#FFE2A8', .8 * light);
      glow(DR.x0 + 80, DR.y1 - 80, 90 * light, '#FFF1C8', .9 * light * seg(tt, 77.1, 77.6));
    } else {
      // lights up: the club in flat colour, a record cover
      ground(JZ.blue, { tex: 20 });
      halftone('ramp', 960, 160, 3000, 700, JZ.blueDk, .8, Math.PI);
      boilSeed('N1-disc'); block(ellPts(420, 430, 330, 330, 48), JZ.mustard, { ink: JZ.ink, sw: 1.8 });
      halftone('disc', 500, 500, 440, 440, JZ.mustDk, .4);
      boilSeed('N1-floorL'); block(rectPts(-400, 800, W + 800, 500), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
      inkLine([[-300, 804], [2300, 804]], 2, JZ.cream, 'ink', 0);
      const gx = clubDoor(open, true);
      if (open > .01) {
        boilSeed('N1-spillL'); paint([[DR.x0, DR.y1], [gx, DR.y1], [gx - 700, 1180], [DR.x0 - 1500, 1180]], { wash: mixCol(JZ.ink2, JZ.cream, .35), ink: null });
        glow(D[0], D[1], 380, '#FFE2A8', .9);
      }
      const ha = t - SLAM;
      // bass ripples on the floor, one per beat
      ripples(560, 800, agesAt(t, [180, 181, 182, 183]), { flat: .2, speed: 600, life: 1.1, r0: 40, sw: 3.5, rings: 1, key: 'N1' });
      const P = band1(t, true, 0, ha);
      // trumpet rays and the sax ribbon toward the door
      const tb = P.tr.bell, ra = Math.atan2(D[1] - tb[1], D[0] - tb[0]);
      rays(tb[0], tb[1], ra, ha - .04, { len: Math.hypot(D[0] - tb[0], D[1] - tb[1]) * 1.02, hold: 1.4, n: 5, spread: .22, w: 20, key: 'N1' });
      const sb = P.sax.bell, k1 = easeOut(seg(t, SLAM + .02, BURST - .02)), k0 = easeIn(seg(t, BURST + .08, CUT1 + .1));
      if (k1 > k0 + .02) saxRibbon(wavePath(sb, [D[0] - 20, D[1] + 40], t, { k0, k1, amp: 70, waves: 1.6, speed: 1.6, lift: -210 }), 58, t, { key: 'N1', taper: true, tspeed: 3, shine: 1 });

      // the pieces: out of the instruments, then a rush at the door
      for (const p of N1P) {
        const S = p.src ? P.kit.snare : P.pn.piano.keys, launch = SLAM + p.h1 * .06, age = t - launch; if (age < 0) continue;
        const a0 = -Math.PI / 2 + (p.h3 - .5) * 2.4, bd = 80 + 150 * p.h2, p1 = [S[0] + Math.cos(a0) * bd, S[1] + Math.sin(a0) * bd];
        const arrive = BURST - .06 + p.i * .032, fly = .42, tb2 = .2;
        let x, y, s = 1, vx = 0, vy = 0;
        if (age < tb2 || t < arrive - fly) { const k = easeOut(age / tb2), dr = 18 * Math.sin(age * 5 + p.i); x = lerp(S[0], p1[0], k) + dr; y = lerp(S[1], p1[1], k) - 40 * clamp(age - tb2); }
        else {
          const q = seg(t, Math.max(launch + tb2, arrive - fly), arrive); if (q >= 1) continue;
          const k = ease(q), tgt = [D[0] - 50 + 100 * p.h1, 420 + 300 * p.h2], [x0, y0] = arcPt([p1[0] + 18 * Math.sin((arrive - fly - launch) * 5 + p.i), p1[1] - 40 * clamp(arrive - fly - launch - tb2)], tgt, 120 + 160 * p.h3, k), [x1, y1] = arcPt(p1, tgt, 120 + 160 * p.h3, Math.min(1, k + .06));
          x = x0; y = y0; vx = x1 - x0; vy = y1 - y0; s = lerp(1, .3, q * q);
        }
        boilSeed('N1p' + p.i);
        const sz = (p.tile ? 34 : 30) * s * (.7 + .6 * p.h2), r = age * (5 + 7 * p.h1) * (p.h2 > .5 ? 1 : -1);
        if (Math.hypot(vx, vy) > 14) streak(x, y, vx, vy, Math.hypot(vx, vy) * 2.2, sz * .5, p.tile ? JZ.cream : JZ.vermLt);
        if (p.tile) tileAt(x, y, sz, r, p.i % 2 === 0); else shardAt(x, y, sz, r, SHCOL[p.i % 4], p.i);
      }
      shards(P.kit.snare[0], P.kit.snare[1], ha, 45, { n: 9, dist: 170, size: 20 });
      const mood = emotions(t, [[T0, 'sad'], [SLAM, 'sad', { eyes: 'wide', lookX: 1, lookY: -.3 }]]);
      const sg = singer(1140, 810, 24, t, { ...mood, emote: null, aR: .75, rot: .08 + .06 * seg(t, BURST, CUT1), sq: (mood.sq || 0) + .14 * hitK(ha, 6), boilKey: 'N1sg', key: 'N1sg', micShine: .5 });
      voiceCurls(sg.mouth[0] + 10, sg.mouth[1], t, { s: .8, dx: 60 });
      // the door blows open: smear lines off the slab
      const oa = t - BURST;
      if (oa > 0 && oa < .16) for (let i = 0; i < 5; i++) inkLine([[DR.x0 + 20, DR.y0 + 60 + i * 90], [DR.x1 - 30, DR.y0 + 40 + i * 95]], 2.6 - i * .3, JZ.vermLt, 'ink', 0);
    }
    camEnd();
    if (lit && t < SLAM + .042) flash(.3, JZ.cream);
  }

  // ---------- N1b · the street (79.50–81.23) ----------
  // Cut on the crash: outside, the club's door hangs open and the flood of shapes pours down the night street to
  // the right. Far ahead, the rose silhouette reaches the side street, turns into it and is swallowed by the dark;
  // the ribbon's tip gets there a moment too late and curls round the empty corner.
  function N1b(t, lt, dur) {
    plate('N1b');
    const k = ease(seg(t, CUT1 - .2, CUT2)), sh = shakeXY(t, 10 * hitK(lt, 6));
    camBegin(lerp(930, 1160, k) + sh[0], 520 + sh[1], 1.02 + .03 * k);
    ground(JZ.blueDk);
    halftone('ramp', 1100, 380, 3200, 900, JZ.blue, .6, Math.PI);
    // the side street: a dark gap with a far lamp
    boilSeed('N1b-gap'); block(rectPts(1680, 180, 240, 640), JZ.ink, { ink: null });
    glow(1800, 640, 120, '#FFC766', .5);
    building(1310, 820, 370, 520, { col: JZ.blue, key: 'N1b3', lit: (id, i, j) => j === 0 && i % 2 ? 1 : 0 });
    building(960, 820, 350, 680, { col: JZ.blueDk, key: 'N1b2', seed: 2, ink: JZ.ink });
    building(1920, 820, 520, 620, { col: JZ.blueDk, key: 'N1b4', seed: 4 });
    // the club front
    boilSeed('N1b-club'); block(rectPts(-500, 260, 1100, 560), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    boilSeed('N1b-door');
    block(rectPts(236, 400, 190, 420), JZ.mustLt, { ink: JZ.ink, sw: 1.6, misK: 0 });
    glow(330, 600, 330, '#FFE2A8', .9);
    block([[196, 392], [236, 404], [236, 820], [196, 832]], JZ.verm, { ink: JZ.ink, sw: 1.4 });
    for (let i = 0; i < 6; i++) block([[190 + i * 45, 340], [235 + i * 45, 340], [245 + i * 45, 385], [200 + i * 45, 385]], i % 2 ? JZ.cream : JZ.mustard, { ink: JZ.ink, sw: 1 });
    streetLamp(760, 820, 330, 1, { key: 'N1bL1' });
    streetLamp(1560, 820, 330, 1, { key: 'N1bL2' });
    boilSeed('N1b-pave'); block(rectPts(-500, 820, 3000, 70), JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    boilSeed('N1b-road'); block(rectPts(-500, 890, 3000, 400), JZ.ink, { ink: null });
    // the one who left: running right, turning into the side street, gone into the dark
    const run = seg(t, CUT1, 80.25), tk = seg(t, 80.25, 80.42), gone = ease(seg(t, 80.42, 81.05));
    if (gone < .98) {
      const lx = lerp(1300, 1760, run) + 30 * gone, u = lerp(15, 5, gone), ly = lerp(820, 690, gone);
      const v = tk <= 0 ? { view: 'side', flip: false } : turn(t, 80.25, 80.42, .25, .5);
      lover(lx, ly, u, { ...v, walk: t * (run < 1 ? 4.5 : 2.4), dy: run < 1 ? -.3 * Math.abs(Math.sin(t * TAU * 2.25)) : 0, boilKey: 'N1blv' });
      if (gone > 0) glow(1800, 660, 100, '#1F3D72', .2);
    }
    // the flood: ribbon, tiles, ripples, shards, rays, all rushing right out of the door
    const age = t - CUT1 + .5, D = [330, 600];
    rays(D[0] + 40, D[1] - 60, -.3 + .06 * Math.sin(t * 2), age, { len: 1000, hold: 9, n: 3, spread: .3, w: 18, key: 'N1b' });
    for (const b of [183, 184, 185, 186, 187]) {   // bass rings rolling down the road
      const a = t - B(b - 1.2); if (a < 0 || a > 1.4) continue;
      ripples(D[0] + 60 + a * 1050, 900, [a * .8], { flat: .28, speed: 380, life: 1.1, r0: 30, sw: 6, key: 'N1b' + b });
    }
    const tipX = kf(t, [[CUT1, 900], [80.5, 1650], [80.95, 1790]]), curl = seg(t, 80.8, 81.2);
    saxRibbon(wavePath(D, [tipX, 560 + 60 * curl], t, { amp: 80, waves: 1.8, speed: 1.8, lift: -120, n: 36 }).concat(curl > 0 ? [[tipX + 40 * curl, 520], [tipX + 10, 470 + 20 * curl], [tipX - 40 * curl, 500]] : []), 64, t, { key: 'N1b', tspeed: 3, shine: 1 });
    for (let i = 0; i < 12; i++) {   // tiles skipping along the pavement
      const x = D[0] + (age - .05 * i) * 900 - i * 40; if (x < D[0] + 20 || x > 1900) continue;
      boilSeed('N1bt' + i); const hop = Math.abs(Math.sin((age * 3.2 + i * .37) * Math.PI));
      tileAt(x, 830 - 120 * hop - 20, 38, .3 * Math.sin(age * 6 + i), i % 2 === 0);
    }
    for (let i = 0; i < 14; i++) {   // shards flying down the street
      const a = age - i * .09; if (a < 0) continue;
      const x = D[0] + 40 + a * (1100 + 300 * hash(i)), y = 420 + 300 * hash(i * 3.3) + 40 * Math.sin(a * 5 + i); if (x > 2000) continue;
      boilSeed('N1bs' + i); streak(x, y, 1, 0, 90, 12, JZ.vermLt); shardAt(x, y, 22 + 12 * hash(i * 7), a * 8 + i, SHCOL[i % 4], i);
    }
    camEnd();
  }

  // ---------- N2 · "What have I done wrong?" (81.23–85.56) ----------
  // The singer close, alone in front of the big mustard disc. The crash (bar 47) rings the disc like a cymbal and the
  // singer bursts into tears; shards and tiles whirl round it like a storm. Then the resolve (84.26): the whirl brakes
  // and streams off to the right, after the one who left, and the singer sets its jaw and looks the same way.
  const N2P = Array.from({ length: 20 }, (_, i) => ({ i, tile: i % 2 === 1, ph: i / 20 * TAU + hash(i * 4.4) * .3, rr: .8 + .35 * hash(i * 2.1), s: .75 + .5 * hash(i * 6.6) }));
  function N2(t, lt, dur) {
    plate('N2');
    const ca = t - CRASH, sh = shakeXY(t, 18 * hitK(ca, 5) + 8 * hitK(t - DET, 7));
    camBegin(900 + sh[0], 640 + sh[1], 1.14 + .07 * ease(seg(t, CUT2, CUT3)));
    ground(JZ.blue, { tex: 20 });
    halftone('ramp', 960, 900, 2600, 700, JZ.blueDk, .7);
    const wob = ca > 0 ? Math.exp(-ca * 3.5) * Math.sin(ca * 34) * .05 : 0, dr = 420 * (1 + wob);
    boilSeed('N2-disc'); block(ellPts(1010, 500, dr, dr * (1 - wob * .6), 56), JZ.mustard, { ink: JZ.ink, sw: 2 });
    halftone('disc', 1090, 580, dr * 1.3, dr * 1.3, JZ.mustDk, .45);
    for (let i = 1; i < 4; i++) { boilSeed('N2-lathe' + i); inkLine(ellPts(1010, 500, dr * i / 4.2, dr * i / 4.2 * (1 - wob * .6), 44).concat([[1010 + dr * i / 4.2, 500]]), 1, JZ.mustDk, 'inkfine', .5); }
    if (ca > 0) { glow(1010, 500, 520, '#FFE2A0', .7 * hitK(ca, 3)); shimmer(1010, 500, dr * .95, dr * .95, ca * .8, { key: 'N2' }); }
    boilSeed('N2-floor'); block(rectPts(-300, 1000, 2600, 300), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    // the whirl
    const out = seg(t, DET, DET + .7), om = TAU / 1.6;
    const whirl = front => {
      if (ca < 0) return;
      for (const p of N2P) {
        const tc = Math.min(t, DET) + (t > DET ? .3 * (1 - Math.pow(1 - seg(t, DET, DET + .6), 2)) : 0), th = p.ph + om * (tc - CRASH), f = Math.sin(th) > 0;
        if (f !== front) continue;
        const rk = easeOut(seg(ca, 0, .35)) * p.rr;
        let x = 880 + 680 * Math.cos(th) * rk, y = (f ? 760 : 760) + (f ? 105 : 300) * Math.sin(th) * rk;   // the front arc stays above the subtitle band
        x += 2600 * easeIn(out) * (1 + p.i * .03); y = lerp(y, f ? 850 + 12 * (p.i % 3) : 400 + 36 * (p.i % 5), ease(out));
        const s = (f ? 62 : 58) * p.s * (1 + .12 * Math.sin(th)), vx = -Math.sin(th) * 30 + 200 * out, vy = Math.cos(th) * 10;
        boilSeed('N2p' + p.i);
        streak(x, y, vx, vy, 60 + 120 * out, s * .4, p.tile ? JZ.cream : JZ.vermLt);
        if (p.tile) tileAt(x, y, s, th * 1.5, p.i % 4 === 1, 1.3); else shardAt(x, y, s * .8, th * 2 + p.i, SHCOL[p.i % 4], p.i, 1.3);
      }
    };
    whirl(false);
    shards(1010, 500, ca, 71, { n: 12, dist: 520, size: 40, life: .8, dir: -Math.PI / 2, spread: Math.PI * 1.3 });
    const mood = emotions(t, [[CUT2 - .6, 'sad', { eyes: 'closed' }], [CRASH, 'cry'], [DET, 'determined', { lookX: 1, lookY: -.1 }]]);
    const sg = singer(820, 1030, 58, t, { ...mood, emote: null, aR: .45, key: 'N2', boilKey: 'N2s', micShine: .5 });
    // tears flicking off on each sob
    if (t > CRASH && t < DET + .3) for (const b of [188, 189, 190, 191, 192, 193]) {
      const a = t - B(b); if (a < 0 || a > .7) continue;
      for (const s of [-1, 1]) {
        boilSeed('N2tear' + b + s);
        const e = [820 + (s < 0 ? -.35 : 3.35) * 58, 1030 - 6 * 58 + 40], p = arcPt(e, [e[0] + s * 260, e[1] + 200], 160, a / .7);
        paint(ellPts(p[0], p[1], 13 * (1 - a), 18 * (1 - a), 12), { wash: JZ.cream, ink: JZ.ink, sw: .9 });
      }
    }
    whirl(true);
    voiceCurls(sg.mouth[0] + 30, sg.mouth[1] - 20, t, { s: 1.4, dx: 80 });
    camEnd();
  }

  // ---------- N3 · the subway (85.56–90.32) ----------
  // Side view of the platform. The train stands at it: in its last window, the rose silhouette. Bass ripples roll off
  // its wheels on every beat as it pulls out to the right. The sax ribbon races in from the left after it; the train
  // slips into the tunnel, whose mouth is a brass bell; the ribbon dives in after it, and the camera follows it in.
  const TX = 3400, TY = 560, TRX = 150, TRY = 390;
  const trainX = t => 260 + (t > 86.0 ? .5 * 620 * (t - 86.0) * (t - 86.0) : 0);
  function carriage(x, len, id, t, rear) {
    const y0 = 430, y1 = 772, x1 = Math.min(x + len, TX); if (x1 <= x + 4) return;
    boilSeed('car' + id);
    block(rrPts(x, y0, x1 - x, y1 - y0, 26), JZ.blue, { ink: JZ.ink, sw: 1.6 });
    block(rectPts(x + 8, y0 + 14, x1 - x - 16, 22), JZ.blueDk, { ink: null });
    block(rectPts(x, 690, x1 - x, 24), JZ.cream, { ink: JZ.ink, sw: .9 });
    for (let i = 0; i < 5; i++) {
      const isLover = rear && i === 0, wx = x + (isLover ? 36 : 70 + i * 150), ww = isLover ? 150 : 110; if (wx + ww > x1) break;
      boilSeed('win' + id + i);
      block(rrPts(wx, isLover ? 470 : 490, ww, isLover ? 170 : 140, 14), JZ.mustLt, { ink: JZ.ink, sw: 1.2 });
      if (isLover) { lover(wx + 78, 640 + 2 * 15, 15, { view: 'side', flip: true, noLegs: true, aL: .9, boilKey: 'N3lv', dy: -.1 * Math.sin(t * 3) }); glow(wx + 75, 560, 130, '#FFE9B0', .5); }
      else glow(wx + 55, 560, 70, '#FFC766', .35);
    }
    wheels(x, len, id, t);
  }
  // wheels: blue discs with spokes, a ripple rolling off each on every beat (the walking bass)
  function wheels(x, len, id, t) {
    const ages = agesAt(t, [196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208]).filter(a => a < .8);
    for (const wxo of [120, 230, len - 230, len - 120]) {
      const wx = x + wxo; if (wx > TX - 30) continue;
      boilSeed('wh' + id + wxo);
      ripples(wx, 800, ages, { r0: 40, speed: 190, life: .75, rings: 2, gap: 20, sw: 3.4, flat: .55, key: 'wh' + id + wxo });
      paint(ellPts(wx, 794, 36, 36, 20), { wash: JZ.blueLt, ink: JZ.ink, sw: 1.3 });
      const a = x / 36;
      for (let j = 0; j < 3; j++) inkLine([[wx + Math.cos(a + j * 2.1) * 30, 794 + Math.sin(a + j * 2.1) * 30], [wx - Math.cos(a + j * 2.1) * 30, 794 - Math.sin(a + j * 2.1) * 30]], 1.4, JZ.blue, 'ink', 0);
    }
  }
  function N3(t, lt, dur) {
    plate('N3');
    const cx = kf(t, [[CUT3, 540], [86.7, 620], [88.3, 1950], [89.1, 2820], [89.7, 3200], [BELL, TX]]);
    const z = kf(t, [[CUT3, 1.5], [86.6, 1.44], [87.8, 1.08], [89.3, 1.0], [BELL, 1.5]]);
    camBegin(cx, kf(t, [[CUT3, 590], [87.8, 560], [BELL, TY]]), z);
    // the station wall: cream tiles, a checker band (the piano), the far platform
    ground(JZ.cream, { tex: 18 });
    halftone('ramp', cx, 300, 2400, 700, JZ.smoke, .5, Math.PI);
    boilSeed('N3-band');
    const c0 = Math.floor((cx - 1300) / 60);
    for (let i = c0; i < c0 + 46; i++) for (let j = 0; j < 2; j++) paint(rectPts(i * 60, 240 + j * 60, 60, 60), { wash: (i + j) % 2 ? JZ.ink : JZ.cream, ink: null });
    inkLine([[cx - 1400, 240], [cx + 1400, 240]], 2, JZ.ink, 'ink', 0); inkLine([[cx - 1400, 360], [cx + 1400, 360]], 2, JZ.ink, 'ink', 0);
    for (let i = Math.floor((cx - 1300) / 520); i < (cx + 1300) / 520; i++) { boilSeed('N3-lamp' + i); glow(i * 520 + 200, 150, 90, '#FFC766', .5); paint(ellPts(i * 520 + 200, 150, 34, 22, 16), { wash: JZ.mustLt, ink: JZ.ink, sw: 1 }); }
    boilSeed('N3-plat'); block(rectPts(cx - 1500, 690, 3000, 90), JZ.ink2, { ink: JZ.ink, sw: 1.2 });
    block(rectPts(cx - 1500, 686, 3000, 12), JZ.mustard, { ink: null });
    // the tunnel's throat, behind the train
    boilSeed('N3-throat'); paint(ellPts(TX, TY, TRX, TRY, 40), { wash: JZ.ink, ink: null });
    boilSeed('N3-rail'); block(rectPts(cx - 1500, 780, 3000, 500), JZ.ink, { ink: null });
    inkLine([[cx - 1500, 830], [cx + 1500, 830]], 4, JZ.smoke, 'ink', 0);
    const X = trainX(t);
    for (let c = 0; c < 3; c++) carriage(X + c * 850, 820, c, t, c === 0);
    // the ribbon, racing after the last window
    if (t > 86.7) {
      const gap = kf(t, [[86.7, 1500], [87.95, 40], [88.25, 12], [88.8, 220], [89.4, 150]]), tip = Math.min(TX + 10, X - gap);
      const tail = cx - 1400, P = wavePath([tail, 620], [tip, 560], t, { amp: 90, waves: 2.4, speed: 2, lift: -60, n: 40 }).filter(p => p[0] <= TX);
      if (P.length > 2) {
        saxRibbon(P, 96, t, { key: 'N3', tspeed: 3.5, shine: 1 });
      }
    }
    // inside the mouth it's dark; the wall past it hides what went in; the brass rim over the seam
    boilSeed('N3-dark'); paint(ellPts(TX, TY, TRX, TRY, 40).filter(p => p[0] <= TX + 1).concat([[TX, TY - TRY], [TX, TY + TRY]]), { wash: JZ.ink, washOp: 170, ink: null });
    boilSeed('N3-portal'); block(rectPts(TX, -700, 1800, 1480), JZ.ink2, { ink: null, misK: 0 });
    halftone('ramp', TX + 700, 400, 1500, 900, JZ.ink, .6);
    paint(ellPts(TX, TY, TRX, TRY, 40).filter(p => p[0] >= TX - 1), { wash: JZ.ink, ink: null });
    const q = seg(t, 89.55, BELL - .06);
    if (q <= 0) bellRim(TX, TY, TRX, TRY, 46);
    const m = toScreen(TX, TY);
    camEnd();
    // the push into the bell: its mouth swallows the frame
    if (q > 0) {
      if (q >= 1) ground(JZ.ink);
      else {
        const k = easeIn(q), rx = lerp(TRX * z, 1700, k), ry = lerp(TRY * z, 1150, k), cxs = lerp(m[0], W / 2, k), cys = lerp(m[1], H / 2, k);
        boilSeed('N3-mouth'); paint(ellPts(cxs, cys, rx, ry, 56), { wash: JZ.ink, ink: null });
        bellRim(cxs, cys, rx, ry, 46 * z * (1 + 3 * k), 1.6);
      }
    }
  }

  // ---------- N4 · alone (90.32–97.67) ----------
  // Out of the bell: its opening widens past the frame onto a huge ink stage, one cone of light, the singer small in
  // it. The band behind goes dark one by one on the backbeats, leaving silhouettes, and each player's sound shape
  // drifts in to orbit the singer slowly. On "Love has always been my way" the singer opens its eyes and watches them.
  const BO = [bb(52, 3), bb(53, 1), bb(53, 3), bb(54, 1), bb(54, 3)];   // blackouts: sax, bass, piano, drums, trumpet
  const OC = [960, 690], ORX = 660, ORY = 220, B0 = bpOf(BELL);
  // the wheel turns on the beat: a quick step on each beat, a slow drift between
  const wheel = t => { const b = bpOf(t) - B0, n = Math.floor(b), f = b - n; return TAU / 14 * (n + .75 * easeOut(clamp(f / .35)) + .25 * f); };
  const REACH = [bb(55, 1) - .22, bb(55, 1), bb(55, 3), bb(55, 3) + .5];   // wind-up, reach, hold to the backbeat, fall
  const PH0 = Math.PI - wheel(REACH[1] + .15);   // the ribbon passes the far left just as the singer reaches for it
  function N4(t, lt, dur) {
    plate('N4');
    const kz = seg(t, BELL, CUT5), k = kz * .75 + ease(kz) * .25, z = lerp(1.0, 1.3, k);
    camBegin(960, lerp(600, 700, k), z);
    ground(JZ.ink);
    boilSeed('N4-floor'); block(rectPts(-800, 820, 3500, 600), JZ.ink2, { ink: null });
    halftone('ramp', 960, 700, 3000, 300, JZ.ink2, .6, Math.PI);
    // the band on the back riser: lit, then one by one gone to silhouettes
    boilSeed('N4-riser'); block(rectPts(-200, 590, 2400, 40), JZ.ink2, { ink: JZ.ink, sw: 1 });
    const dark = i => t >= BO[i], silC = JZ.blueDk;
    const pl = (i, x, fn) => { if (!dark(i)) glow(x, 480, 150, '#FFC766', .35); fn(dark(i) ? silC : null); };
    const src = [];
    pl(0, 1300, s => { src[0] = saxist(1300, 590, 15, t, { sil: s, boilKey: 'N4sx', key: 'N4sx', flip: true, shine: s ? null : frac(t * .6) }).bell; });
    pl(1, 700, s => { src[1] = bassist(700, 590, 15, t, { sil: s, boilKey: 'N4bs', key: 'N4bs' }).body; });
    pl(2, 100, s => { src[2] = pianist(100, 590, 15, t, { sil: s, boilKey: 'N4pn', key: 'N4pn' }).piano?.keys || [150, 530]; });
    pl(3, 470, s => { src[3] = drummer(470, 590, 14, t, { sil: s, boilKey: 'N4dr', key: 'N4dr' }).snare; });
    pl(4, 1560, s => { src[4] = trumpeter(1560, 590, 15, t, { sil: s, boilKey: 'N4tr', key: 'N4tr', flip: true }).bell; });
    cone(960, -320, 960, 824, 600, 'N4');
    // bass ripples on the floor round the singer's feet (after the bass has gone dark)
    if (dark(1)) ripples(960, 822, agesAt(t, Array.from({ length: 24 }, (_, i) => 213 + i)).filter(a => a < 1.6), { flat: .22, speed: 380, life: 1.5, r0: 120, sw: 2.6, rings: 1, key: 'N4' });
    // the orbit: sax ribbon, piano tiles, drum shards, trumpet rays, wheeling round the singer on the beat
    const W0 = wheel(t), [ba] = sinceBeat(t), pk = hitK(ba, 7), hop = Math.sin(Math.PI * clamp(ba / .28));
    const posOf = (i, th) => { const oa = t - BO[i], fk = ease(seg(oa, 0, .9)), o = [OC[0] + ORX * Math.cos(th), OC[1] + ORY * Math.sin(th)], s0 = src[i] || o; return [lerp(s0[0], o[0], fk), lerp(s0[1], o[1], fk)]; };
    const OFF = { 0: 0, 2: Math.PI * .6, 3: Math.PI * .95, 4: Math.PI * 1.35 };   // at the reach: ribbon left, tiles behind, shards right, rays front-right
    const orbit = front => {
      [0, 2, 3, 4].forEach(i => {
        if (!dark(i)) return;
        const th = PH0 + OFF[i] + W0, mid = i === 0 ? th - .6 : th - .3, f = Math.sin(mid) > 0; if (f !== front) return;
        const sc = (.78 + .42 * (Math.sin(mid) * .5 + .5)) * (1 + .18 * pk);
        if (i === 0) {
          const P = []; for (let j = 0; j <= 22; j++) { const a = th - 1.25 + j / 22 * 1.25; P.push(posOf(0, a).map((v, d) => v + (d ? 26 * Math.sin(j * .8 - t * 4) : 0))); }
          saxRibbon(P, 116 * sc, t, { key: 'N4', tspeed: 2, shine: 1 });
        } else for (let j = 0; j < 5; j++) {
          const p = posOf(i, th - j * .15); boilSeed('N4o' + i + j);
          if (i === 2) tileAt(p[0], p[1] - 46 * hop * (j % 2 ? .6 : 1), 80 * sc, .25 * Math.sin(t * 2 + j) + .4 * pk * (j % 2 ? 1 : -1), j % 2 === 0, 1.3);
          if (i === 3) shardAt(p[0], p[1] - 20 * hop, 60 * sc, W0 * 2 + j * 2, SHCOL[j % 4], j, 1.3);
          if (i === 4 && j === 0) rays(p[0], p[1], (Math.cos(th) > 0 ? 0 : Math.PI) + (Math.cos(th) > 0 ? -.35 : .35), 1, { len: 320 * sc, hold: 99, n: 3, spread: .5, w: 26, glow: false, key: 'N4r' });
        }
      });
    };
    orbit(false);
    // the singer: eyes closed; on "Love has always..." they open and follow the ribbon; the reach, held; the fall
    const rx = Math.cos(PH0 + W0 - .3);
    const mood = emotions(t, [[BELL - 1, 'sad', { eyes: 'closed' }], [94.13, 'sad', {}], [REACH[3] + .4, 'sad', { eyes: 'closed' }]], { take: .6 });
    const [r0, r1, r2, r3] = REACH, tremble = t > r1 && t < r2 ? .02 * Math.sin(t * TAU * 5) : 0;
    const aL = kf(t, [[r0 - .01, mood.aL ?? -.75], [r0 + .15, -1.0], [r1, .38], [r1 + .12, .24], [r2, .3], [r3, -.8]], ease) + tremble;
    const rot = kf(t, [[r0 - .01, mood.rot || 0], [r0 + .15, .06], [r1, -.24], [r1 + .12, -.2], [r2, -.21], [r3, .02]], ease);
    const sq = kf(t, [[r0 - .01, mood.sq || 0], [r0 + .15, .12], [r1, -.16], [r1 + .15, -.1], [r2, -.11], [r3, .12]], ease);
    const dxR = kf(t, [[r0, 0], [r1, -.6], [r2, -.55], [r3, 0]], ease);
    const reaching = t > r0 && t < r3 + .4;
    const sg = singer(960, 822, 27, t, { ...mood, emote: null, lookX: t > 94.2 ? (reaching ? -1 : rx) : 0, lookY: reaching ? -.35 : .2, aR: kf(t, [[r0, .45], [r1, -.35], [r2, -.3], [r3 + .2, .45]], ease), aL: t > r0 - .01 ? aL : mood.aL, rot: t > r0 - .01 ? rot : mood.rot, sq: t > r0 - .01 ? sq : mood.sq, dx: (mood.dx || 0) + dxR, eyes: reaching && t < r3 ? 'teary' : mood.eyes, key: 'N4', boilKey: 'N4s', micShine: .3 });
    orbit(true);
    voiceCurls(sg.mouth[0] + 10, sg.mouth[1], t, { s: .8 });
    const ic = toScreen(960, 700);
    camEnd();
    // out of the bell: the opening widens past the frame, centred on the singer
    const q = seg(t, BELL, BELL + .85);
    if (q < 1) {
      const r = lerp(40, 1700, easeIn(q) * .6 + ease(q) * .4), cx = lerp(ic[0], W / 2, ease(q)), cy = lerp(ic[1], H / 2, ease(q));
      irisShape(ellPts(cx, cy, r, r, 56), JZ.ink);
      bellRim(cx, cy, r, r, 30 + r * .12, 1.6);
    }
  }

  // ---------- N5 · turning away (97.67–104.14) ----------
  // Closer: the singer at the mic, teary, the last shapes drifting down like embers. On "Since your love went away"
  // it turns its back on us and the mic, toward the thin light of the door far upstage, and takes a few steps into the
  // dark. The piano run (bar 59) climbs in from the left as a staircase of tiles pushing a mustard block across the
  // frame; by 104.14 it's all flat mustard, the solo's ground.
  function N5(t, lt, dur) {
    if (t > END - .13) { ground(JZ.mustard); return; }
    plate('N5');
    camBegin(900 + 30 * seg(t, CUT5, RUN), 560, 1.02 + .03 * seg(t, CUT5, END));
    ground(JZ.ink);
    boilSeed('N5-floor'); block(rectPts(-400, 590, 2800, 800), JZ.ink2, { ink: null });
    halftone('ramp', 960, 700, 3000, 240, JZ.ink, .7, Math.PI);
    // the door, far upstage: a thin sliver of light
    const dk = seg(t, 100.4, 101.4);
    boilSeed('N5-door');
    const dw = 10 + 14 * dk;
    paint(rectPts(1548, 238, 132, 354), { wash: JZ.ink2, ink: mixCol(JZ.ink, JZ.cream, .22), sw: 1.2 });
    paint(rectPts(1560, 250, dw, 330), { wash: JZ.cream, ink: null });
    glow(1568, 420, 120 + 80 * dk, '#FFE2A8', .4 + .4 * dk);
    cone(740, -260, 740, 978, 640, 'N5');
    // embers: the last shapes, drifting down slowly
    for (let i = 0; i < 9; i++) {
      const ph = frac(hash(i * 2.7) + (t - CUT5) * (.05 + .03 * hash(i))), x = 200 + 1500 * hash(i * 5.1) + 60 * Math.sin(t * .7 + i), y = lerp(80, 860, ph);
      boilSeed('N5e' + i);
      if (i % 3 === 0) tileAt(x, y, 26, t * .4 + i, i % 2 === 0); else shardAt(x, y, 18, t * .6 + i, SHCOL[i % 4], i);
    }
    // the singer: sings; turns its back (100.60) and takes two steps; stops; looks back at the mic once (the eye lifts
    // to it first, then the head comes round), a small hold on "Since your…"; eyes close; turns away and walks off
    const G = [100.60, 100.90, 100.95, 101.45, 101.62, 101.80, 101.96, 102.32, 102.50, 102.52, 103.40];
    const view = t < G[0] ? { view: 'q', flip: false } : t < G[1] ? turn(t, G[0], G[1], .125, .5) : t < G[3] ? { view: 'back' }
      : t < G[4] ? turn(t, G[3], G[4], .5, .25) : t < G[5] ? { view: 'side', flip: false } : t < G[6] ? turn(t, G[5], G[6], .25, .125)
      : t < G[7] ? { view: 'q', flip: false } : t < G[8] ? turn(t, G[7], G[8], .125, .5) : { view: 'back' };
    const facing = t < G[0] || (t >= G[5] && t < G[7] + .06);
    const p1 = ease(seg(t, G[2], G[3])), p2 = ease(seg(t, G[9], G[10])), wk = p2;
    const x = 720 + 20 * p1 + 290 * p2, u = 50 - 6 * p1 - 12 * p2, y = 975 - 45 * p1 - 85 * p2;
    const walking = (p1 > 0 && p1 < 1) || (p2 > 0 && p2 < 1);
    const mood = emotions(t, [[CUT5 - 1, 'sad', { eyes: 'teary' }], [100.2, 'sad', { eyes: 'closed' }], [G[3] + .05, 'sad', { eyes: 'teary' }], [G[7] - .06, 'sad', { eyes: 'closed' }]], { take: .4 });
    const ach = seg(t, 100.3, 101.4), sob = .05 * Math.sin(ach * Math.PI) * (1 + Math.sin(t * TAU * 3) * .5);
    const look = t >= G[3] && t < G[8] ? { lookX: kf(t, [[G[4], -.7], [G[5], 1]], ease), lookY: kf(t, [[G[4], .8], [G[5], .1]], ease) } : {};
    const lean = kf(t, [[G[5], 0], [G[6], .07], [G[7], .06], [G[8], 0]], ease);
    const sg = singer(x, y, u, t, { ...mood, emote: null, ...view, ...look, mic: false, sing: facing, rot: (mood.rot || 0) + lean,
      aR: t < G[0] ? .45 : -.55, aL: t < G[0] ? mood.aL : -.7, sq: (mood.sq || 0) + sob + .05 * wk, walk: walking ? t * 2.2 : null, boilKey: 'N5s' });
    boilSeed('N5-mic'); ribbonMic(720 + 7.2 * 50, 975, 5.3 * 50, { s: 50 / 26, tilt: -.35, lean: -.1, shine: .3 + .4 * seg(t, G[5], G[6]) * (1 - seg(t, G[7], G[8])), key: 'N5' });
    if (facing && t < G[0]) voiceCurls(sg.mouth[0] + 10, sg.mouth[1], t, { s: 1.1 });
    camEnd();
    // the piano run: eight steps of a tile staircase pushing the mustard across, left to right
    if (t >= RUN - .02) {
      let edge = -160;
      const steps = Array.from({ length: 8 }, (_, j) => B(4 * 59 + j * .5));
      steps.forEach(s => { edge += (W + 420) / 8 * backOut(seg(t, s, s + .1)); });
      boilSeed('N5-wipe');
      paint(rectPts(-100, -100, edge + 100, H + 200), { wash: JZ.mustard, ink: null });
      halftone('ramp', edge - 170, H / 2, H + 300, 340, JZ.mustDk, .3 * (1 - seg(edge, W - 100, W + 150)), -Math.PI / 2);
      inkLine([[edge, -40], [edge, H + 40]], 2.4, JZ.ink, 'ink', 0);
      const last = agesAt(t, steps.map(s => bpOf(s)));
      for (let r = 0; r < 10; r++) {
        const tx = edge + ((r * 3) % 4) * 34 - 20, ty = r * 112 - 20;
        let dy = 0; for (const a of last) { const q = seg(a - r * .012, 0, .16); if (q > 0 && q < 1) dy -= 50 * Math.sin(Math.PI * q); }
        boilSeed('N5t' + r); tileAt(tx + 56, ty + 56 + dy, 104, 0, r % 2 === 0, 1.4);
      }
    }
  }

  shots([[T0, N1a], [CUT1, N1b], [CUT2, N2], [CUT3, N3], [BELL, N4], [CUT5, N5]]);
})();
