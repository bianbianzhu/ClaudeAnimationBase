// echoes/n_shatter.js: "Echoes of Myself" shot N (189.12 → 204.86), "the shatter" (bridge peak, bars 96–104).
// See STORYBOARD_echoes.md. Abstract: the line through the middle, reality above, the inner world below.
//   in:      the line of light from shot M's flock across the middle (same drawing), hill sky above, violet below.
//   189.12   Clawd (unmasked) drifts down from the sky onto the line; Echo rises from below to meet it feet to feet, half a
//            beat late (the last time it is out of sync). Both lean over and reach; their hands meet at the line.
//   191.09   bar 97: they press, taking turns on the beats: the line bends like a membrane under their hands, down, up,
//            down, faster; cracks race left and right with sparks at their tips. The camera pushes in, shaking.
//   193.06   bar 98 (the pickup of "Will I discover"): it SHATTERS. Flash; shards fly out on arcs, each half hill-gold and
//            half violet; the two are blown apart. Violet tongues lick up into the sky and gold tongues down into the void.
//   195.52   they float toward each other and spin once around each other (a carousel of drawn key views), now in sync,
//            while the two worlds swirl (the backdrop turns a quarter turn and the tongues curl) and the shards orbit.
//   198.47   they close in, spinning faster, and pass into each other: the light builds to a white flash (199.45).
//   200.43   the flash clears on the merged Clawd (clay with violet shading and a cream rim, the ember in its chest), eyes
//            closed, floating. 200.92 (bar 102): eyes open with a take, it looks at itself. 201.9: the first real smile.
//            A slow push in to a close-up while the shards orbit like stars; the held note breathes.
//   out:     N | O contract: flash(k, ECH.C.goldLt) k 0 → .9 over the last 0.6 s over the merged Clawd close-up.
(() => {
  const { C, S, bt } = ECH;
  const T0 = S.N, TO = S.O, LY = 540, XT = 960, u = 30, LAG = BEAT / 2;
  const T_LAND = bt(386), T_BEND = bt(388), T_SHAT = bt(392), T_SPIN = bt(397), T_MRG = bt(403), T_FL = bt(405), T_REV = bt(407),
    T_EYES = bt(408), T_SMILE = bt(410);
  const T_SWAP = T_FL + .06;

  // ---------- the membrane ----------
  // presses on the beats, alternating Clawd (down) and Echo (up), getting stronger and closer together
  const PRESS = [[T_BEND, 1, 24], [bt(389), -1, 30], [bt(390), 1, 38], [bt(390.5), -1, 42], [bt(391), 1, 50], [bt(391.5), -1, 56], [bt(391.75), 1, 62], [T_SHAT - .16, 1, 74]];
  const A = t => (t < T_LAND ? 0 : 10 * spring(t, T_LAND, 7, 16) + 7 * spring(t, T_LAND + LAG, 7, 16)) + PRESS.reduce((s, [tp, sg, a]) => s + sg * a * spring(t, tp, 5, 14), 0);
  const lineY = (x, t) => LY + A(t) * Math.exp(-Math.pow((x - XT) / 250, 2));
  const CRACK_W = [0, .18, .12, .14, .12, .14, .12, .18];
  const crackL = t => 1050 * PRESS.reduce((s, [tp], j) => s + CRACK_W[j] * easeOut(seg(t, tp, tp + .2)), 0);

  // ---------- Clawd / Echo leaning over the line ----------
  // the side-view near arm's tip, in world px, for a Clawd standing at (x, y) with pose o (see clawd(): the side arm)
  function sideTip(x, y, o) {
    const a = o.aL ?? .2, r = .7 - a, sq = o.sq || 0;
    let lx = (1.6 + 2.1 * Math.cos(r)) * u, ly = (-4.2 + 2.1 * Math.sin(r)) * u;
    lx *= 1 + sq * .6; ly *= 1 - sq;
    const c = Math.cos(o.rot || 0), s = Math.sin(o.rot || 0);
    return [x + lx * c - ly * s, y + (o.dy || 0) * u + lx * s + ly * c];
  }
  // the lean (rot) that puts the hand on the line at height ty
  function reachRot(x, o, ty) {
    let a = 0, b = 1.3;
    for (let i = 0; i < 14; i++) { const m = (a + b) / 2; if (sideTip(x, LY, { ...o, rot: m })[1] < ty) a = m; else b = m; }
    return (a + b) / 2;
  }
  const REACH_A = -.75, XC0 = XT - sideTip(0, LY, { aL: REACH_A, sq: .22, rot: reachRot(0, { aL: REACH_A, sq: .22 }, LY) })[0];
  const MOOD = [[T0, 'hopeful', { mouth: null, lookY: .7 }], [T_LAND + .3, 'determined', { mouth: null, lookY: 1, lookX: .5 }],
    [T_SHAT, 'surprised', { emote: null, lookY: .8 }], [T_SHAT + 1.2, 'hopeful', { mouth: 'o', lookY: .85, blush: .2 }]];
  // phase A (on the line): te = the character's own time (Echo lags), target = where its hand must be (local y)
  function leanPose(te, t, mirrored) {
    const m = emotions(te, MOOD, { take: .7 }), k = seg(te, T0 + .05, T_LAND), dsc = Math.pow(1 - k, 2);
    const land = te > T_LAND ? .2 * Math.exp(-8 * (te - T_LAND)) * Math.cos(20 * (te - T_LAND)) : 0;
    const kr = ease(seg(te, T_LAND + .2, T_BEND - .15)), aL = lerp(.8, REACH_A, kr) + .06 * Math.sin(te * 5);
    const o = { ...m, view: 'side', flip: false, aL, aR: .2, dy: -19 * dsc + (m.dy || 0) * .3 * (1 - kr), sq: (m.sq || 0) * .5 + land + .22 * kr, walk: null };
    const x = XC0 - 220 * dsc;
    const ty = mirrored ? 2 * LY - lineY(XT, t) : lineY(XT, t);
    const r0 = reachRot(x, { ...o, rot: 0 }, LY);
    o.rot = k < 1 ? .18 * Math.sin(k * TAU) * (1 - k) : kr * clamp(reachRot(x, { ...o, rot: 0 }, ty), r0 - .16, r0 + .16);
    return { x, y: LY, o };
  }

  // ---------- phase B/C: floating, spinning, merging ----------
  const P_SH = leanPose(T_SHAT, T_SHAT, false);
  function gap(t) {   // how far each one's feet are from the middle
    if (t < T_SPIN) return 3.6 * u * easeOut(seg(t, T_SHAT, T_SHAT + 1)) - .3 * u * ease(seg(t, T_SHAT + 1, T_SPIN));
    if (t < T_MRG) return lerp(3.3 * u, 1.2 * u, ease(seg(t, T_SPIN, T_MRG)));
    return lerp(1.2 * u, -4 * u, easeIn(seg(t, T_MRG, T_FL)));
  }
  const spinT = t => ease(seg(t, T_SPIN, T_MRG + .2)) + 2 * easeIn(seg(t, T_MRG, T_FL));
  function freePose(t) {
    const m = emotions(t, MOOD, { take: .7 }), g = gap(t);
    let o = { ...m, dy: (m.dy || 0) * .4, sq: m.sq || 0 }, x = lerp(P_SH.x, XT, ease(seg(t, T_SHAT + .3, T_SPIN))), sc = 1, depth = 0;
    if (t < T_SPIN) {
      Object.assign(o, ECH.heading(t, .25, [[T_SHAT + 1.0, 0]]));
      o.rot = kf(t, [[T_SHAT, P_SH.o.rot], [T_SHAT + .35, -.4], [T_SHAT + 1.4, .1], [T_SPIN, 0]]) + .05 * Math.sin(t * 2.1);
      o.aL = kf(t, [[T_SHAT, REACH_A], [T_SHAT + .3, 1.2], [T_SPIN, .5]]); o.aR = kf(t, [[T_SHAT, .2], [T_SHAT + .38, 1.1], [T_SPIN, .45]]);
    } else {
      const h = spinT(t), env = Math.sin(Math.PI * clamp(h)), ph = TAU * h;
      x = XT + 6.5 * u * Math.sin(ph) * env; sc = 1 + .08 * Math.cos(ph) * env; depth = Math.cos(ph);
      const f8 = frac(h * 8), sp = t < T_MRG ? .4 : .6;
      Object.assign(o, spinView(h), { smear: sp * Math.exp(-Math.pow((f8 - .5) / .14, 2)), smearDir: 0 });
      o.rot = .06 * Math.sin(ph);
      o.aL = .55 + .2 * Math.sin(t * 3); o.aR = .5 + .2 * Math.sin(t * 3 + 1.3);
    }
    return { x, y: LY - g, o, sc, depth };
  }

  // ---------- the merged Clawd ----------
  const MMOOD = [[T_SWAP, 'relieved', { eyes: 'closed', mouth: null, emote: null }], [T_EYES, 'hopeful', { eyes: 'shine', mouth: 'o', emote: null, blush: .15 }],
    [T_SMILE, 'happy', { eyes: 'shine', mouth: 'smile', emote: null, blush: .45 }]];
  function mergedPose(t) {
    const m = emotions(t, MMOOD, { take: .6 }), tk = take(t, T_EYES, .8), br = Math.sin((t - T_SWAP) * 1.6);
    const look = kf(t, [[T_EYES + .15, [0, 0]], [T_EYES + .35, [-.6, .55]], [T_EYES + .75, [-.6, .55]], [T_EYES + .9, [.6, .55]], [T_SMILE - .15, [.6, .5]], [T_SMILE + .1, [0, 0]]]);
    const armL = kf(t, [[T_EYES + .3, .3], [T_EYES + .5, .8], [T_EYES + .8, .4]]), armR = kf(t, [[T_EYES + .7, .3], [T_EYES + .9, .8], [T_SMILE, .35]]);
    const hold = t > T_SMILE ? .12 * Math.sin(bpOf(t) * Math.PI / 2) : 0;
    return { ...m, view: 'front', dy: (m.dy || 0) * .3 + tk.dy - .3 - .25 * br, sq: (m.sq || 0) * .6 + tk.sq, lookX: look[0], lookY: look[1],
      aL: armL + .08 * Math.sin(t * 2) + hold, aR: armR + .08 * Math.sin(t * 2 + 1) - hold, rot: .02 * Math.sin(t * 1.3) };
  }

  // ---------- shards ----------
  const NS = 34;
  const SH = Array.from({ length: NS }, (_, i) => {
    const h = k => hash(i * 7.31 + k * 13.7), side = i % 2 ? -1 : 1, x0 = XT + (h(1) - .5) * 2 * Math.pow(h(2), .8) * 980;
    const p1 = [x0 + (x0 - XT) * .35 + (h(3) - .5) * 220, LY - side * (150 + 330 * h(4))];
    const ang = Math.atan2((p1[1] - LY) / .6, p1[0] - XT), R = clamp(Math.hypot(p1[0] - XT, (p1[1] - LY) / .6), 260, 900);
    return { x0, p1, harc: 70 + 90 * h(5), dur: 1.3 + .7 * h(6), s: 18 + 30 * h(7), r0: h(8) * TAU, spin: (3 + 4 * h(9)) * (h(10) > .5 ? 1 : -1),
      ang, R, w: .22 + .12 * h(11), front: i % 3 === 0, colA: mixCol(C.hillBot, C.goldLt, h(12)), colB: mixCol(C.violet, C.voidLt, h(13)), tw: h(14) };
  });
  function shardAt(d, t) {
    const a = t - T_SHAT, k = easeOut(seg(a, 0, d.dur));
    const f = arcPt([d.x0, LY], d.p1, d.p1[1] < LY ? d.harc : -d.harc, k);
    const dx = Math.sin(t * .7 + d.r0) * 14 * k, dy = Math.cos(t * .6 + d.r0) * 10 * k;
    const wo = ease(seg(t, T_SPIN - .6, T_SPIN + 3.4)), boost = 1.6 * easeIn(seg(t, T_MRG, T_FL)) * (1 - seg(t, T_FL, T_REV + 1));
    const th = d.ang + d.w * (t - T_SPIN) + boost * (t - T_MRG) * (t > T_MRG ? 1 : 0), R = d.R * (1 - .25 * boost / 1.6);
    const o = [XT + R * Math.cos(th), LY + R * .6 * Math.sin(th)];
    return { x: lerp(f[0] + dx, o[0], wo), y: lerp(f[1] + dy, o[1], wo), rot: d.r0 + d.spin * easeOut(seg(a, 0, 1.6)) * 1.2 + .4 * t, s: d.s * (.5 + .5 * seg(a, 0, .25)) };
  }
  function shards(t, front) {
    if (t < T_SHAT) return;
    SH.forEach((d, i) => {
      if (d.front !== front) return;
      const p = shardAt(d, t);
      if (t > T_REV - .5) glow(p.x, p.y, p.s * 2.2, C.goldLt, .35 + .35 * pulse(t + d.tw * BEAT * 3, 4));
      ECH.shard(p.x, p.y, p.s, p.rot, d.colA, d.colB, 'n' + i);
    });
  }

  // ---------- the backdrop: hill sky above, inner world below; after the shatter the two bleed into each other ----------
  function backdrop(t) {
    const phi = Math.PI / 2 * ease(seg(t, T_SPIN - .5, T_REV + 1.2)) + .025 * Math.max(0, t - T_REV - 1.2);
    const tk = easeOut(seg(t, T_SHAT, T_SHAT + 2.4)), curl = .25 * easeOut(seg(t, T_SHAT, T_SHAT + 1.5)) + .75 * ease(seg(t, T_SHAT + 1.2, T_REV + 1)), E = 1700;
    push(); translate(XT, LY); rotate(phi);
    boilSeed('nb top');
    paint(rectPts(-E, -E, 2 * E, E + 40), { wash: C.hillTop, ink: null });
    for (let i = 1; i <= 4; i++) { const y = -540 + 108 * i, c = mixCol(C.hillTop, C.hillBot, i / 4); paint(rectPts(-E, y, 2 * E, -y), { wash: c, ink: null }); paint(rectPts(-E, y - 36, 2 * E, 72), { fill: c, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null }); }
    boilSeed('nb bot');
    paint(rectPts(-E, 0, 2 * E, E), { wash: C.void, ink: null });
    for (let i = 1; i <= 4; i++) { const y = 540 - 108 * i, c = mixCol(C.void, C.voidLt, i / 4); paint(rectPts(-E, 0, 2 * E, y), { wash: c, ink: null }); paint(rectPts(-E, y - 36, 2 * E, 72), { fill: c, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null }); }
    for (let i = 0; i < 30; i++) {
      const sx = hash(i * 3.3 + 11) * W - XT, sy = 20 + 520 * hash(i * 7.7 + 5), tw = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      boilSeed('split st' + i);
      paint(starPts(sx, sy, (3 + 5 * hash(i + 2)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: 120 + 110 * tw, ink: null });
    }
    if (tk > .01) {
      for (let j = 0; j < 12; j++) {
        const up = j % 2 === 0, sg = up ? -1 : 1, x = -1650 + j * 300, Hj = tk * (240 + 240 * hash(j * 3.9)) * (1 + .6 * curl);
        const c = (up ? 1 : -1) * curl * Hj * .9, wv = 30 * Math.sin(t * 1.3 + j);
        const P = [[x, -sg * 30], [x + .2 * c + wv * .3, sg * .35 * Hj], [x + .6 * c + wv, sg * .72 * Hj], [x + c + wv, sg * Hj], [x + c * 1.25 - (up ? 1 : -1) * curl * 90, sg * Hj * .9]];
        const col = up ? mixCol(C.violet, C.voidLt, .35 * hash(j)) : mixCol(C.hillBot, C.goldLt, .5 * hash(j));
        boilSeed('ntongue' + j);
        paint(ribbon(P, 180, 12), { wash: col, washOp: 225, fill: up ? C.void : C.gold, fillOp: 70, bleed: .25, tex: .6, ink: null });
      }
      for (let i = 0; i < 14; i++) {   // inner-world stars drift up into the sky
        const sx = (hash(i * 5.1 + 2) - .5) * 2 * 1300, sy = -(40 + 480 * hash(i * 2.9 + 1)) * tk, tw = .5 + .5 * Math.sin(t * 2.4 + i);
        boilSeed('nb upst' + i);
        paint(starPts(sx, sy, (3 + 5 * hash(i + 9)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: (120 + 110 * tw) * tk, ink: null });
      }
    }
    pop();
    const mk = seg(t, T_FL - .6, T_REV);
    if (mk > 0) { glow(XT, LY, 700, C.goldLt, .45 * mk); glow(XT, LY, 380, PAL.cream, .3 * mk); }
  }

  // ---------- the line (before the shatter) ----------
  function theLineBent(t) {
    const a = A(t), L = crackL(t);
    const beat = .5 + .5 * pulse(t, 4);
    if (Math.abs(a) < .5 && L < 1) { ECH.theLine(-40, W + 40, LY, 1, { key: 'nline', glow: .45 + .15 * beat }); return; }
    const P = []; for (let x = -40; x <= W + 40; x += 30) P.push([x, lineY(x, t)]);
    for (let i = 0; i < P.length; i += 5) glow(P[i][0], P[i][1], 90, C.gold, .45 + .15 * beat + .3 * clamp(L / 1000));
    for (let i = 0; i + 1 < P.length; i += 20) { boilSeed('nbent' + i); inkLine(P.slice(i, i + 21), 1.6, C.gold, 'ink', .3); }
    if (L < 1) return;
    for (const sd of [-1, 1]) {
      const Q = [], B = [];
      for (let d = 0, n = 0; d <= L; d += 24, n++) {
        const x = XT + sd * d, y = lineY(x, t) + (hash(n * 3.7 + sd) - .5) * 12;
        Q.push([x, y]);
        if (n % 4 === 2) { const l = 18 + 30 * hash(n * 1.3 + sd * 5), up = hash(n * 2.1 + sd) > .5 ? 1 : -1; B.push([[x, y], [x + sd * l * .4, y - up * l]]); }
      }
      boilSeed('ncrack' + sd);
      if (Q.length > 1) for (let i = 0; i + 1 < Q.length; i += 24) { inkLine(Q.slice(i, i + 25), 2.2, PAL.ink, 'ink', 0); inkLine(Q.slice(i, i + 25).map(([x, y]) => [x, y - 4]), 1.3, PAL.cream, 'inkfine', 0); }
      B.forEach(b => inkLine(b, 1.2, PAL.ink, 'inkfine', 0));
      const tip = Q[Q.length - 1];
      glow(tip[0], tip[1], 80, PAL.cream, .9); glow(tip[0], tip[1], 160, C.goldLt, .6);
    }
  }

  // ---------- camera ----------
  function camN(t) {
    const z = kf(t, [[T0, 1], [T_BEND, 1.05], [T_SHAT - .04, 1.42], [T_SHAT + .5, .97], [T_SPIN, 1.0], [T_MRG, 1.1], [T_REV, 1.32], [TO, 1.9]]);
    const cy = kf(t, [[T_REV, LY], [TO, 488]]);
    const amt = t < T_SHAT ? 7 * Math.pow(seg(t, T_BEND, T_SHAT), 2) : 16 * (1 - seg(t, T_SHAT, T_SHAT + .8));
    const [sx, sy] = shakeXY(t, amt);
    return { cx: XT + sx, cy: cy + sy, z };
  }

  function shotN(t, lt, dur) {
    const cam = camN(t);
    camBegin(cam.cx, cam.cy, cam.z);
    backdrop(t);
    shards(t, false);
    if (t < T_SHAT) {
      theLineBent(t);
      const pe = leanPose(t - LAG, t, true), pc = leanPose(t, t, false);
      ECH.mirror(LY, () => ECH.echo(pe.x, pe.y, u, { ...pe.o, boilKey: 'necho' }));
      clawd(pc.x, pc.y, u, { ...pc.o, boilKey: 'nclawd' });
      if (t > T_LAND && t < T_LAND + 1.2) ECH.rings(pc.x, LY, t - T_LAND, { key: 'nland', ry: .1, col: C.goldLt, speed: 380, n: 2 });
    } else if (t < T_SWAP) {
      const pe = freePose(t - (t < T_SPIN ? .08 : 0)), pc = freePose(t), g = gap(t);
      const drawE = () => { const pe2 = { ...pe, x: 2 * XT - pe.x }; ECH.mirror(LY, () => ECH.echo(pe2.x, pe2.y, u * pe.sc, { ...pe.o, boilKey: 'necho' })); };
      const drawC = () => clawd(pc.x, pc.y, u * pc.sc, { ...pc.o, boilKey: 'nclawd' });
      if (pc.depth >= 0) { drawE(); drawC(); } else { drawC(); drawE(); }
      if (t > T_MRG) { const k = easeIn(seg(t, T_MRG, T_FL)); glow(XT, LY - g * .2, 120 + 520 * k, C.goldLt, .5 + .5 * k); glow(XT, LY, 60 + 260 * k, PAL.cream, k); }
    } else {
      const mp = mergedPose(t);
      // the film's convention for the merged Clawd: the ember low in the chest (-3u, under the mouth), drawn by our own hook
      ECH.masked(XT, LY + 4 * u, u, { noMask: true, emberK: 0, ...mp, ...ECH.MERGED_COL, boilKey: 'nmerged',
        draw: (uu) => ECH.ember(0, -3 * uu, uu * .55, T, .8, 'chest') });
    }
    shards(t, true);
    camEnd();
    if (t >= T_SHAT && t < T_SHAT + .45) flash(.75 * (1 - seg(t, T_SHAT, T_SHAT + .45)), PAL.cream);
    const fk = t < T_FL ? easeIn(seg(t, T_MRG + .4, T_FL)) : t < T_FL + .12 ? 1 : 1 - ease(seg(t, T_FL + .12, T_REV));
    flash(fk, '#FFF8EA');
    if (lt > dur - .6) flash(.9 * seg(lt, dur - .6, dur), C.goldLt);
  }
  shots([[ECH.S.N, shotN]]);
})();
