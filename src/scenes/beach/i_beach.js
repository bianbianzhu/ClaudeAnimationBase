// i_beach.js: shots I, J, K of "Beach Day" (see STORYBOARD_beach.md), 88.135–112.135.
//   I (88.1–96.1):   volleyball. A rally on the beats, Clawd sets, Spike leaps and spikes: the ball rockets past Shades
//                    (who spins) and far out to sea. Everyone stares; the camera pushes out toward the splash.
//   J (96.1–100.1):  the swim. The ball bobs alone; Floatie dives in, the others jump in after, Floatie paddles to the
//                    ball, heads it up and balances it: triumph. Splash wipe.
//   K (100.1–112.1): sunbathing. Four towels, the parasol, lazy waves. Floatie dozes in goggles and goes red; wakes,
//                    pushes the goggles up: pale rings round the eyes. The others laugh; Floatie is shy, then laughs.
//                    Gold brush wipe into the jam.
(() => {
  const { bt, bar, C } = BCH;
  const I0 = bar(44), J0 = bar(48), K0 = bar(50);   // 88.135, 96.135, 100.135

  // ---------- shared beach set ----------
  function beachSky(t, top = '#62C0E6', bot = '#D4F1F0', key = 'bsky') { BCH.skyGrad(top, bot, key, 8); }
  function sand(x0, x1, y0, y1, key = 'sand', col = C.sand) {
    boilSeed(key);
    paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: col, ink: null });
    paint(rectPts(x0, y0 + (y1 - y0) * .45, x1 - x0, (y1 - y0) * .55), { fill: C.sandDk, fillOp: 70, bleed: .02, tex: .6, ink: null });
    for (let i = 0; i < 22; i++) {   // pebbles and shells that stay put
      boilSeed(key + 'p' + i);
      const x = lerp(x0, x1, hash(i * 1.3 + 4)), y = lerp(y0 + 30, y1 - 20, hash(i * 2.7 + 1));
      inkLine([[x - 6, y], [x + 6, y - 2]], .6, C.sandDk, 'inkfine', 0);
    }
  }
  // The sea (a copy of BCH.sea with foam-coloured glints and a tight bleed, so the wide washes don't smear into the sky).
  function seaBand(t, x0, x1, y0, y1, key = 'sea', cols = [C.seaLt, C.sea, C.seaDk]) {
    boilSeed(key);
    paint(rectPts(x0, y0, x1 - x0, y1 - y0), { wash: cols[1], ink: null });
    paint(rectPts(x0, y0, x1 - x0, (y1 - y0) * .35), { fill: cols[0], fillOp: 110, bleed: .015, tex: .4, ink: null });
    paint(rectPts(x0, y0 + (y1 - y0) * .6, x1 - x0, (y1 - y0) * .4), { fill: cols[2], fillOp: 90, bleed: .015, tex: .4, ink: null });
    for (let i = 0; i < 9; i++) {   // glints
      boilSeed(key + 'g' + i);
      const gx = lerp(x0 + 200, x1 - 200, hash(i + 1)), gy = lerp(y0, y1, .1 + .8 * hash(i + 20)), w = 30 + 40 * hash(i + 3), k = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      inkLine([[gx - w / 2, gy], [gx + w / 2, gy]], .8 + k, C.foam, 'inkfine', 0);
    }
  }
  // BCH.splashWipe, with a foam-coloured crest line.
  function splashWipe(p) {
    if (p <= 0 || p >= 1) return;
    const top = p < .5 ? lerp(H + 120, -260, easeOut(p * 2)) : lerp(-260, H + 160, easeIn((p - .5) * 2));
    boilSeed('splashwipe');
    const P = [];
    for (let i = 0; i <= 20; i++) { const x = lerp(-80, W + 80, i / 20); P.push([x, top + 60 * Math.sin(i * 1.1 + p * 9) + 40 * hash(i)]); }
    paint(P.concat([[W + 80, H + 400], [-80, H + 400]]), { wash: C.sea, fill: C.seaDk, fillOp: 70, bleed: .03, tex: .6, ink: PAL.ink, sw: 1.2 });
    inkLine(P.map(([x, y]) => [x, y + 30]), 3, C.foam, 'dry', .5);
    for (let i = 0; i < 14; i++) { const x = lerp(0, W, hash(i + 3)), y = P[Math.round(hash(i + 3) * 20)][1] - 40 - 120 * hash(i + 8); paint(ellPts(x, y, 12 + 14 * hash(i), 16 + 16 * hash(i), 10), { wash: C.seaLt, ink: PAL.ink, sw: .5 }); }
  }
  // Ripple rings round something floating at (x, y) on the water.
  function ripples(t, x, y, w, key) {
    for (let i = 0; i < 2; i++) {
      boilSeed('rip' + key + i);
      const k = frac(t * .7 + i * .5);
      paint(ellPts(x, y, w * (.8 + .7 * k), w * (.12 + .08 * k), 18), { ink: C.foam, sw: 1.2 * (1 - k), br: 'inkfine' });
    }
  }
  // A splash crown rising out of the water at (x, y), age s, size s px.
  function splash(x, y, age, s, key) {
    if (age < 0 || age > .9) return;
    boilSeed('spl' + key);
    const k = easeOut(seg(age, 0, .25)) * (1 - seg(age, .45, .9)), h = s * 1.4 * k;
    if (h > 2) {   // a crown of spikes, tallest in the middle
      const P = [[x - s * .8, y]];
      for (let i = 0; i < 5; i++) {
        const q = (i + .5) / 5, hh = h * (1 - Math.abs(q - .5) * 1.1) * (.8 + .2 * hash(i + 3));
        P.push([lerp(x - s * .7, x + s * .7, q - .08), y - hh * .35], [lerp(x - s * .75, x + s * .75, q), y - hh], [lerp(x - s * .7, x + s * .7, q + .08), y - hh * .35]);
      }
      P.push([x + s * .8, y]);
      paint(P, { wash: C.foam, fill: C.seaLt, fillOp: 90, ink: PAL.ink, sw: clamp(s / 90, .4, .8) });
    }
    BCH.drops(x, y - h * .8, 9, age, s * 2.2, key, '#A9E0EC', s / 70);
  }
  // Where the sea meets the sand: a foam edge that laps up and back on each bar.
  function shore(t, x0, x1, y, key = 'shore', amp = 12) {
    const lap = Math.sin((bpOf(t) / 4) * TAU) * amp;
    boilSeed(key);
    const P = []; for (let i = 0; i <= 16; i++) { const x = lerp(x0, x1, i / 16); P.push([x, y + lap + 8 * Math.sin(i * 1.3 + t * .8)]); }
    paint(P.concat([[x1, y - 60], [x0, y - 60]]), { wash: C.seaLt, ink: null });
    paint(ribbon(P, 12, 12), { wash: C.foam, ink: null });
    inkLine(P.map(([a, b]) => [a, b + 6]), .6, C.seaDk, 'inkfine', .5);
  }
  // Foreground water: everything below the wavy line at y is under the sea.
  function waterFront(t, x0, x1, y, key = 'wf') {
    boilSeed(key);
    const P = [];
    for (let i = 0; i <= 20; i++) { const x = lerp(x0, x1, i / 20); P.push([x, y + 7 * Math.sin(i * 1.4 + t * 3) + 4 * Math.sin(i * .6 - t * 2)]); }
    paint(P.concat([[x1, y + 900], [x0, y + 900]]), { wash: mixCol(C.sea, C.seaDk, .25), fill: C.seaDk, fillOp: 60, bleed: .1, tex: .5, ink: null });
    paint(ribbon(P, 10, 10), { wash: C.foam, ink: null });
    inkLine(P.map(([a, b]) => [a, b + 6]), .6, C.seaDk, 'inkfine', .5);
  }

  // ======================================================================================================
  // I · volleyball
  // ======================================================================================================
  const GY = 870, UI = 24;
  const HOME = { clawd: [300, 1], spike: [630, 1], floatie: [1300, -1], shades: [1630, -1] };   // x, facing
  const T_SET = bt(4 * 46 + 1), T_SPIKE = bar(47), T_PAST = T_SPIKE + .2, T_SEA = bt(4 * 47 + 2) - .05;   // 92.635, 94.135, 94.335, 95.085
  const SPIKE_JUMP = [T_SPIKE - .4, T_SPIKE + .4];
  const HITS = [[bt(4 * 44 - 1), 'shades'], [bt(4 * 44 + 1), 'clawd'], [bt(4 * 44 + 3), 'floatie'], [bt(4 * 45 + 1), 'spike'], [bt(4 * 45 + 3), 'shades'], [T_SET, 'clawd']];
  const xOf = (n, t) => HOME[n][0] + (n === 'spike' ? 150 * ease(seg(t, T_SET + .35, SPIKE_JUMP[0])) : 0);
  const hitPt = (n, t) => [xOf(n, t) + HOME[n][1] * 6.6 * UI, GY - 6.4 * UI];   // at the forward arm's tip, mid-swing
  const SEA_PT = [1800, 462];
  // the ball: [x, y, radius, visible]
  function ballI(t) {
    for (let i = 0; i < HITS.length - 1; i++) {
      const [ta, a] = HITS[i], [tb, b] = HITS[i + 1];
      if (t < tb) return [...arcPt(hitPt(a, ta), hitPt(b, tb), 330, (t - ta) / (tb - ta)), 26, 1];
    }
    const sp = [xOf('spike', T_SPIKE) + 6.4 * UI, GY - 11.6 * UI];
    if (t < T_SPIKE) return [...arcPt(hitPt('clawd', T_SET), sp, 560, (t - T_SET) / (T_SPIKE - T_SET)), 26, 1];
    const past = [1600, GY - 9.4 * UI];
    if (t < T_PAST) return [...arcPt(sp, past, -20, (t - T_SPIKE) / (T_PAST - T_SPIKE)), 26, 1];
    if (t < T_SEA) { const k = (t - T_PAST) / (T_SEA - T_PAST); return [...arcPt(past, SEA_PT, 140, easeOut(k)), lerp(26, 7, easeOut(k)), 1]; }
    return [...SEA_PT, 7, 0];
  }
  // the bump: crouch, pop up with both arms swinging forward (the far arm trails a hair), settle
  function bump(t, times) {
    const o = { sq: 0, dy: 0, a: -.35, a2: -.35 };
    for (const th of times) {
      const a = t - th;
      if (a > -.28 && a < 0) { const k = ease(seg(a, -.28, 0)); o.sq += .15 * k; o.a = o.a2 = lerp(-.35, -.8, k); }
      else if (a >= 0 && a < .55) {
        o.sq += -.16 * Math.exp(-7 * a) + .04 * spring(t, th + .3, 8, 20);
        o.dy += -.9 * Math.sin(Math.PI * clamp(a / .32)) * (a < .32 ? 1 : 0);
        o.a = lerp(.75, -.35, ease(seg(a, .08, .5))); o.a2 = lerp(.6, -.35, ease(seg(a, .14, .55)));
      }
    }
    return o;
  }
  const MOOD_I = {
    clawd:   [[I0, 'determined'], [T_SEA + .05, 'surprised', { lookX: .9, lookY: -.9 }]],
    spike:   [[I0, 'determined'], [T_SPIKE + .55, 'proud'], [T_SEA + .25, 'nervous', { lookX: .9, lookY: -.9 }]],
    floatie: [[I0, 'excited'], [T_SEA + .15, 'surprised', { lookX: .9, lookY: -.9 }], [T_SEA + .7, 'determined', { lookX: .9, lookY: -.7 }]],
    shades:  [[I0, 'cool'], [T_PAST + .32, 'surprised', { lookX: .9, lookY: -.8 }]],
  };
  function net(key = 'net') {
    boilSeed(key);
    const x0 = 925, x1 = 995, top0 = 548, top1 = 570;
    paint(rectPts(x0 - 6, top0 - 10, 12, GY + 14 - top0 + 10), { wash: '#8A5634', ink: PAL.ink, sw: .8 });                     // near pole
    paint([[x0, top0], [x1, top1], [x1, top1 + 120], [x0, top0 + 120]], { fill: PAL.cream, fillOp: 60, tex: .3, ink: null });  // mesh
    for (let i = 1; i < 6; i++) inkLine([[x0, top0 + i * 20], [x1, top1 + i * 20]], .45, PAL.ink, 'inkfine', 0);
    for (let i = 1; i < 4; i++) { const x = lerp(x0, x1, i / 4); inkLine([[x, lerp(top0, top1, i / 4)], [x, lerp(top0, top1, i / 4) + 120]], .45, PAL.ink, 'inkfine', 0); }
    paint([[x0, top0 - 6], [x1, top1 - 6], [x1, top1 + 8], [x0, top0 + 8]], { wash: PAL.cream, ink: PAL.ink, sw: .7 });           // top band
    paint(rectPts(x1 - 5, top1 - 10, 10, GY - 20 - top1 + 10), { wash: '#6E4430', ink: PAL.ink, sw: .7 });                    // far pole
  }
  function shotI(t, lt, dur) {
    const pan = ease(seg(t, T_SEA - .25, T_SEA + .45));                                          // swing over to the splash
    const push = ease(seg(t, T_SEA + .45, I0 + dur)) * .4 + easeIn(seg(t, T_SEA + .45, I0 + dur)) * .6;   // then out to sea, into J
    const sh = shakeXY(t, 10 * Math.exp(-(t - T_SPIKE) * 9) * (t > T_SPIKE ? 1 : 0));
    beachSky(t);
    const c0 = [lerp(960 + 14 * Math.sin(t * .5), 1330, pan), lerp(590, 560, pan), lerp(1.08, 1.25, pan)];
    camBegin(lerp(c0[0], SEA_PT[0], push) + sh[0], lerp(c0[1], SEA_PT[1] + 5, push) + sh[1], lerp(c0[2], 3.8, push));
    BCH.sun(260, 130, 58, t, null, { key: 'I', glow: .5 });
    BCH.cloud(760 + 12 * (t - I0), 170, 110, PAL.cream, 0, 'I1', { ink: null });
    BCH.cloud(1420 - 8 * (t - I0), 230, 80, PAL.cream, 0, 'I2', { ink: null });
    seaBand(t, -300, W + 300, 420, 610, 'seaI');
    boilSeed('farsea');
    const [bx, by, br, vis] = ballI(t);
    if (!vis) {
      splash(SEA_PT[0], SEA_PT[1] + 6, t - T_SEA, 60, 'far');
      if (t > T_SEA + .35) { ripples(t, SEA_PT[0], SEA_PT[1] + 6, 16, 'farb'); BCH.vball(SEA_PT[0], SEA_PT[1] + 2 + 1.5 * Math.sin(t * 3.2), 11 * backOut(seg(t, T_SEA + .35, T_SEA + .6)), .3 * Math.sin(t * 2), 'Ifar'); }
    }
    sand(-300, W + 300, 596, H + 300, 'sandI');
    shore(t, -300, W + 300, 606, 'shoreI', 10);
    BCH.palm(60, 700, 470, Math.sin(t * 1.3), 'IL', .18);
    net();
    // players: shadows are clawd's own; ball shadow on the sand
    if (vis && by < GY) { boilSeed('bshadow'); paint(ellPts(bx, GY + 6, br * 1.3 * (1 - (GY - by) / 1400), br * .35, 14), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null }); }
    for (const n of ['clawd', 'spike', 'floatie', 'shades']) {
      const [hx, face] = HOME[n], x = xOf(n, t), ph = BCH.CAST[n].ph;
      const m = emotions(t, MOOD_I[n], { take: .8 });
      const b = bump(t, HITS.filter(h => h[1] === n).map(h => h[0]));
      const bounce = -.35 * Math.abs(Math.sin((bpOf(t) + ph) * Math.PI));
      const headY = GY - 6 * UI;
      const o = { ...m, view: 'q', flip: face < 0, dy: (m.dy || 0) + b.dy + bounce, sq: (m.sq || 0) + b.sq, aL: b.a2, aR: b.a };
      if (t < T_SEA) { o.lookX = clamp((bx - x) / 300) * face; o.lookY = clamp((by - headY) / 300, -1, .6); }
      if (face < 0) { o.aL = b.a; o.aR = b.a2; }
      if (n === 'spike') {   // approach, crouch, leap, the swing
        const j = jump(t, ...SPIKE_JUMP, 5);
        o.dy += j.dy; o.sq += j.sq;
        if (t > T_SET + .6 && t < T_SPIKE) { o.aR = lerp(.2, 1.55, ease(seg(t, SPIKE_JUMP[0] - .2, T_SPIKE - .12))); o.aL = lerp(.2, 1.1, ease(seg(t, SPIKE_JUMP[0] - .2, T_SPIKE - .1))); }
        else if (t >= T_SPIKE && t < T_SPIKE + .6) { o.aR = lerp(1.55, -.6, easeOut(seg(t, T_SPIKE - .02, T_SPIKE + .07))); o.aL = lerp(1.1, .3, ease(seg(t, T_SPIKE, T_SPIKE + .3))); o.smear = .5 * (1 - seg(t, T_SPIKE, T_SPIKE + .12)); o.smearDir = 1; }
        if (t > T_SET + .35 && t < SPIKE_JUMP[0]) { o.view = 'side'; o.walk = (t - T_SET) * 3; }
      }
      if (n === 'shades' && t > T_SPIKE + .05) {   // ducks as the ball whooshes past, spun round by the wind of it
        const d = Math.exp(-Math.max(0, t - T_PAST) * 5) * ease(seg(t, T_SPIKE, T_PAST - .05));
        o.sq += .35 * d; o.dy -= 0;
        if (t < T_PAST + .5) Object.assign(o, turn(t, T_PAST, T_PAST + .45, -.125, -1.125));
        o.aL = 1.3 * d + (o.aL || 0) * (1 - d); o.aR = 1.2 * d + (o.aR || 0) * (1 - d);
      }
      if (t > T_SEA && n !== 'shades') {            // everyone swings round to stare out to sea
        Object.assign(o, turn(t, T_SEA + .02 + ph * .25, T_SEA + .2 + ph * .25, face < 0 ? -.125 : .125, .125));
        if (n === 'spike') { o.aL = 1.45; o.aR = 1.5; }
      }
      if (n === 'shades' && t > T_PAST + .45) { o.view = 'q'; o.flip = false; }
      BCH.buddy(n, x, GY, UI, o);
    }
    if (vis) {
      if (t > T_SPIKE && t < T_SEA) {   // speed trail
        boilSeed('trail');
        const p = ballI(t - .06), q = ballI(t - .14), dx = bx - q[0], dy = by - q[1], d = Math.hypot(dx, dy) || 1;
        for (const k of [-.6, 0, .6]) inkLine([[q[0] - dy / d * br * k, q[1] + dx / d * br * k], [p[0] - dy / d * br * k, p[1] + dx / d * br * k], [bx - dx / d * br * 1.1 - dy / d * br * k, by - dy / d * br * 1.1 + dx / d * br * k]], .9, PAL.ink, 'inkfine', .5);
      }
      BCH.vball(bx, by, br, t * (t > T_SPIKE ? 30 : 6), 'I');
      if (t > T_SPIKE && t < T_SPIKE + .15) { boilSeed('hitflash'); paint(starPts(bx - 20, by + 10, 70 * backOut(seg(t, T_SPIKE, T_SPIKE + .08)), .3, 6, .3), { wash: PAL.cream, ink: PAL.ink, sw: .6 }); }
    }
    camEnd();
    if (lt < .3) BCH.whip(1 - seg(lt, 0, .3), 'v');
  }

  // ======================================================================================================
  // J · the swim
  // ======================================================================================================
  const WL = 700, UJ = 24;
  const BALL_J = [1250, WL - 20];
  const DIVE = [bt(4 * 48 + 1), bt(4 * 48 + 2)];            // 96.635 → 97.135 (entry on the beat)
  const PADDLE = [DIVE[1] + .35, bt(4 * 48 + 4) - .05];      // 97.485 → 98.085
  const T_HEAD = PADDLE[1] + .05, T_ON = bt(4 * 49 + 1) + .15;   // 98.135 nudge, 98.785 the ball lands on the head
  const T_CHEER = T_ON + .15;                                  // 98.935
  const FX = 1120, FY = WL + 2.95 * UJ;                       // Floatie afloat: ring centre on the waterline
  const JUMPERS = [['clawd', 160, bt(4 * 48 + 2) + .45], ['spike', 420, bt(4 * 48 + 3) + .2], ['shades', 680, bt(4 * 48 + 3) + .55]];
  function floatiePos(t) {
    if (t < DIVE[0]) return null;
    if (t < DIVE[1]) { const k = seg(t, DIVE[0], DIVE[1]); return { x: lerp(-160, 660, k), y: lerp(420, WL + 30, k) - 260 * 4 * k * (1 - k), rot: lerp(-.55, 1.2, k), view: 'side' }; }
    if (t < DIVE[1] + .18) return null;                        // under
    const rise = backOut(seg(t, DIVE[1] + .18, DIVE[1] + .45)), k = ease(seg(t, PADDLE[0], PADDLE[1]));
    return { x: lerp(690, FX, k), y: lerp(WL + 9 * UJ, FY, rise), rot: -.05 + .05 * Math.sin(t * 5), view: 'side', paddle: t > PADDLE[0] && t < PADDLE[1] };
  }
  function ballJ(t, fp) {
    const bob = 6 * Math.sin(t * 3.2);
    if (t < T_HEAD) return [BALL_J[0], BALL_J[1] + bob, 32, .3 * Math.sin(t * 2)];
    const head = [fp.x, fp.y + fp.dy * UJ - 8 * UJ * (1 - fp.sq) - 30];
    if (t < T_ON) return [...arcPt([BALL_J[0], BALL_J[1]], head, 260, seg(t, T_HEAD, T_ON)), 32, (t - T_HEAD) * 8];
    return [head[0] + 8 * Math.sin((t - T_ON) * 7) * Math.exp(-(t - T_ON) * 1.5), head[1] - 3 * Math.abs(Math.sin((t - T_ON) * 7)), 32, .15 * Math.sin((t - T_ON) * 7)];
  }
  function shotJ(t, lt, dur) {
    beachSky(t, '#5FBDE6', '#D0F0F0', 'jsky');
    const open = ease(seg(lt, 0, .6));   // from the ball, as I's push left it, back to the swim
    camBegin(lerp(BALL_J[0], 900 + 18 * Math.sin(lt * .6), open), lerp(BALL_J[1], 505 + 6 * Math.sin(lt), open), lerp(1.8, 1.3 + .01 * lt, open));
    BCH.cloud(500 - 10 * lt, 150, 130, PAL.cream, 0, 'J1', { ink: null });
    BCH.cloud(1500 - 6 * lt, 210, 90, PAL.cream, 0, 'J2', { ink: null });
    BCH.gull(1500 + 60 * lt, 260 + 10 * Math.sin(t * 2), 36, t * 2.2, 'J');
    seaBand(t, -200, W + 200, 330, H + 200, 'seaJ');
    boilSeed('farbeach');   // the beach they came from, far behind on the left
    paint([[-200, 336], [520, 330], [640, 344], [-200, 350]], { wash: C.sand, ink: PAL.ink, sw: .5 });
    BCH.palm(120, 340, 90, Math.sin(t), 'Jfar', .2);
    // the ball afloat, the swimmers
    const fp0 = floatiePos(t);
    const m = emotions(t, [[J0, 'determined'], [DIVE[1] + .45, 'excited'], [T_CHEER, 'proud']], { take: .4 });
    let fp = null, fo = null;
    if (fp0) {   // Floatie's whole pose first, so the ball can sit on the head
      fp = { ...fp0 };
      let dy = clamp(m.dy || 0, -.5, 0), sq = clamp(m.sq || 0, -.2, .05);
      if (t > DIVE[1] && t < T_HEAD) dy += -.2 * Math.abs(Math.sin(t * 6));
      if (t >= T_HEAD && t < T_HEAD + .25) sq += -.14 * Math.sin(Math.PI * seg(t, T_HEAD, T_HEAD + .25));   // the head-nudge
      if (t > T_ON) sq += .06 * spring(t, T_ON, 7, 18);
      fo = { ...m, view: fp.view, rot: fp.rot, dy, sq, noShadow: true };
      if (fp.paddle) { fo.aL = .6 * Math.sin(t * TAU * 2); fo.lookX = 1; }
      if (t > T_HEAD + .12) Object.assign(fo, turn(t, T_HEAD + .12, T_HEAD + .32, .25, 0));
      if (t > T_ON) { fo.lookY = -1; fo.lookX = 0; fo.aL = 1.2 + .15 * Math.sin(t * 8); fo.aR = 1.3 - .15 * Math.sin(t * 8); }
      fp.dy = dy; fp.sq = sq;
    }
    const [bx, by, br, brot] = ballJ(t, fp || { x: FX, y: FY, dy: 0, sq: 0 });
    if (t < T_HEAD) ripples(t, bx, WL, 40, 'ball');
    if (t < T_HEAD) BCH.vball(bx, by, br, brot, 'J');
    // the three who jump in after
    for (const [n, x, te] of JUMPERS) {
      const ph = BCH.CAST[n].ph;
      if (t < te - .45) continue;
      let y, o = {};
      const mm = emotions(t, [[J0, 'excited'], [T_CHEER + ph * .2, 'happy']], { take: .4 });
      if (t < te) { const k = seg(t, te - .45, te); [o.x, y] = arcPt([-150, 470], [x, WL + 20], 150, k); o.rot = lerp(-.3, .9, k); o.view = 'side'; }
      else if (t < te + .15) { splash(x, WL, t - te, 60, n); continue; }
      else {
        const r = backOut(seg(t, te + .15, te + .45)); o.x = x; y = lerp(WL + 9 * UJ, WL + 2.6 * UJ, r) + 5 * Math.sin(t * 4 + ph * 6);
        o.view = t < T_CHEER + ph * .2 ? 'q' : 'front';
        o.aL = .5 + .5 * Math.sin((t + ph) * 9); o.aR = .5 - .5 * Math.sin((t + ph) * 9 + .7);
        if (t > T_CHEER + ph * .2) { o.aL = 1.3 + .2 * Math.sin(t * 12 + ph * 5); o.aR = 1.2 - .2 * Math.sin(t * 11); }
        ripples(t, x, WL, 5.5 * UJ, n);
      }
      BCH.buddy(n, o.x, y, UJ, { ...mm, ...o, dy: 0, sq: clamp(mm.sq || 0, -.2, .04), noShadow: true, lookX: .9, lookY: -.1, ...(o.view === 'front' ? { lookX: .6 } : {}) });
      splash(x, WL, t - te, 60, n);
    }
    if (fp) {
      BCH.buddy('floatie', fp.x, fp.y, UJ, fo);
      if (t > DIVE[1] + .2) ripples(t, fp.x, WL, 6.5 * UJ, 'fl');
      if (fp.paddle) BCH.drops(fp.x - 3 * UJ, WL - 10, 5, frac((t - PADDLE[0]) * 2) * .6, 120, 'pad' + Math.floor((t - PADDLE[0]) * 2));
    }
    waterFront(t, -200, W + 200, WL, 'wfJ');
    if (t >= T_HEAD) BCH.vball(bx, by, br, brot, 'J');
    splash(660, WL, t - DIVE[1], 90, 'dive');
    if (t > T_CHEER) { BCH.sparkle(bx + 50, by - 40, 34, seg(t, T_CHEER, T_CHEER + .5)); BCH.sparkle(bx - 60, by - 10, 24, seg(t, T_CHEER + .15, T_CHEER + .6)); }
    camEnd();
    if (lt > dur - .35) splashWipe(seg(lt, dur - .35, dur) * .5);
  }

  // ======================================================================================================
  // K · sunbathing
  // ======================================================================================================
  const UK = 22, KY = 870;
  const KX = { spike: 420, clawd: 800, floatie: 1180, shades: 1560 };
  const T_BURN = [K0 + 1, bar(53)], T_WAKE = bar(53), T_ARM = [T_WAKE + .45, T_WAKE + .75], T_UP = [T_WAKE + .7, T_WAKE + .9];   // 106.135 wake, goggles up 106.835–107.035
  const T_LOOK = bar(54), T_LAUGH = bar(54) + .75, T_SHY = bar(55), T_FLAUGH = bar(55) + 1;
  const BURN = '#E24A3A';
  function towel(x, y, w, cols, key) {
    boilSeed('towel' + key);
    const P = [[x - w / 2, y - 18], [x + w / 2 + 20, y - 18], [x + w / 2 + 40, y + 38], [x - w / 2 - 20, y + 38]];
    paint(P, { wash: cols[0], ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 3; i++) { const k = .2 + i * .27; paint([[lerp(P[0][0], P[1][0], k), y - 18], [lerp(P[0][0], P[1][0], k + .1), y - 18], [lerp(P[3][0], P[2][0], k + .1), y + 38], [lerp(P[3][0], P[2][0], k), y + 38]], { wash: cols[1], ink: null }); }
  }
  function cooler(x, y, key = 'cool') {
    boilSeed(key);
    paint(rrPts(x - 58, y - 76, 116, 76, 10), { wash: '#4C8FC0', fill: '#2F6A99', fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
    paint(rrPts(x - 63, y - 88, 126, 18, 8), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
  }
  // the ukulele leaning against the cooler (world space)
  function ukeLeaning(x, y) {
    boilSeed('ukelean');
    push(); translate(x, y); rotate(-1.3); scale(.62); BCH.uke(UK, 1.6, -.22, 0); pop();
  }
  // goggles worn over the eyes (body space, front view), k = 0 over the eyes .. 1 pushed up on the forehead
  function goggles(u, sw, k) {
    const y = lerp(-6, -7.3, k), P = pts => pts.map(([a, b]) => [a * u, b * u]);
    inkLine(P([[-5.1, y + .1], [-3.6, y]]), sw * 1.6, '#3F8FB8', 'ink', 0);
    inkLine(P([[3.6, y], [5.1, y + .1]]), sw * 1.6, '#3F8FB8', 'ink', 0);
    inkLine(P([[-1.3, y], [1.3, y]]), sw * 1.2, '#3F8FB8', 'ink', 0);
    for (const s of [-1, 1]) {
      paint(ellPts(s * 2.5 * u, y * u, 1.3 * u, lerp(1.2, .95, k) * u, 16), { wash: '#3F8FB8', ink: PAL.ink, sw: sw * .7 });
      paint(ellPts(s * 2.5 * u, y * u, .95 * u, lerp(.9, .65, k) * u, 14), { wash: '#A9E0EC', ink: null });
      inkLine(P([[s * 2.5 - .45, y - .2], [s * 2.5 - .05, y - .45]]), sw * .4, PAL.cream, 'inkfine', 0);
    }
  }
  function shotK(t, lt, dur) {
    const warm = seg(t, bar(53), dur + K0) * .55;
    beachSky(t, mixCol('#6CC4E6', '#F0C27E', warm), mixCol('#DDF3EE', '#FBE3B8', warm), 'ksky');
    // camera: lazy wide, push in on Floatie, hold, pull back for the laugh
    const push = ease(seg(t, bar(52), bar(52) + 1.1)), back = ease(seg(t, T_LOOK - .1, T_LOOK + .5));
    const fcx = KX.floatie, fcy = KY - 4.6 * UK;
    const cx = lerp(lerp(990 + 20 * Math.sin(lt * .4), fcx, push), 1120, back), cy = lerp(lerp(585, fcy, push), 700, back);
    const z = lerp(lerp(1.18 + .012 * lt, 2.3, push), 1.45, back);
    camBegin(cx, cy, z);
    BCH.sun(1000, 215, 62, t, null, { key: 'K', glow: .6 });
    BCH.cloud(400 + 8 * lt, 190, 100, PAL.cream, 0, 'K1', { ink: null });
    seaBand(t, -400, W + 400, 440, 640, 'seaK', [mixCol(C.seaLt, '#F6D9A0', warm * .6), C.sea, C.seaDk]);
    sand(-400, W + 400, 626, H + 400, 'sandK', mixCol(C.sand, '#F2C98E', warm));
    shore(t, -400, W + 400, 640, 'shoreK', 14);
    BCH.palm(-40, 760, 520, Math.sin(t * .9), 'KL', .2);
    BCH.parasol(1690, KY + 30, 250, 1, -.14, 'K');
    towel(KX.spike, KY, 260, ['#4C7FC0', PAL.cream], 's');
    towel(KX.clawd, KY, 260, [PAL.clay, '#F2C53D'], 'c');
    towel(KX.floatie, KY, 260, [C.ring, PAL.cream], 'f');
    towel(KX.shades, KY, 260, [PAL.teal, '#F2C53D'], 'h');
    cooler(1378, KY - 34);
    ukeLeaning(1392, KY - 92);
    // relaxed: squashed low, arms propped back
    const lazy = n => { const ph = BCH.CAST[n].ph, br = Math.sin((t * .5 + ph) * TAU * .5); return { sq: .1 + .03 * br, dy: 0, aL: -.85 + .05 * br, aR: -.8 - .05 * br }; };
    const laughK = (n, tl) => [[K0, n === 'shades' ? 'cool' : 'relieved', { emote: null }], [T_LOOK + BCH.CAST[n].ph * .3, 'neutral', { lookX: n === 'shades' ? -.9 : .9, lookY: .1 }], [tl, 'laugh']];
    for (const n of ['spike', 'clawd', 'shades']) {
      const m = emotions(t, laughK(n, T_LAUGH + BCH.CAST[n].ph * .25), { take: .7 });
      const L = lazy(n), inLaugh = t > T_LAUGH;
      BCH.buddy(n, KX[n], KY, UK, { ...m, sq: (m.sq || 0) + (inLaugh ? 0 : L.sq), aL: inLaugh ? m.aL : L.aL, aR: inLaugh ? m.aR : L.aR, emote: t < T_LOOK ? null : m.emote });
    }
    // Floatie: asleep in goggles, reddening; wakes, pushes them up: the tan line
    const fm = emotions(t, [[K0, 'sleepy'], [T_WAKE, 'surprised', { emote: null }], [T_UP[1] + .15, 'confused', { emote: null }], [T_SHY, 'shy'], [T_FLAUGH, 'laugh']], { take: .8 });
    const burn = ease(seg(t, ...T_BURN)) * .85, up = ease(seg(t, ...T_UP));
    const cols = tintCols({ tint: BURN, tintK: burn });
    const L = lazy('floatie');
    const fo = { ...fm, ...cols, tint: null, hat: null, sq: (fm.sq || 0) + (t < T_WAKE ? L.sq : 0) };
    if (t < T_WAKE) { fo.aL = L.aL; fo.aR = L.aR; fo.emote = t < bar(52) + .2 ? 'zzz' : 'steam'; fo.emoteK = t < bar(52) + .2 ? 1 : seg(t, bar(52) + .2, bar(52) + .6); }
    if (t > T_ARM[0] - .1 && t < T_UP[1] + .5) {   // the right arm reaches up, shoves the goggles, drops
      const r = ease(seg(t, T_ARM[0] - .1, T_ARM[1])) * (1 - ease(seg(t, T_UP[1] + .1, T_UP[1] + .5)));
      fo.aR = lerp(fo.aR ?? -.5, 1.45, r); fo.aL = lerp(fo.aL ?? -.5, .1, r * .5);
    }
    fo.draw = (u, sw) => {
      if (burn > .05) for (const s of [-1, 1]) paint(ellPts(s * 2.5 * u, -6 * u, 1.45 * u, 1.3 * u, 18), { wash: mixCol('#F7D9BE', cols.col, .12), ink: null });
      if (up > 0) eyes(u, fo, sw, [-1, 1]);
      goggles(u, sw, up);
    };
    BCH.buddy('floatie', KX.floatie, KY, UK, fo);
    // heat shimmer over Floatie while roasting
    if (t > bar(51) && t < T_WAKE) for (let i = 0; i < 3; i++) {
      boilSeed('heat' + i);
      const x = KX.floatie - 60 + i * 60, y0 = KY - 9.2 * UK - 30 * frac(t * .8 + i * .33), a = burn * (1 - frac(t * .8 + i * .33));
      if (a > .05) inkLine([[x, y0], [x + 8, y0 - 18], [x - 6, y0 - 36], [x + 4, y0 - 54]], .9 * a, '#E8AA38', 'inkfine', .6);
    }
    camEnd();
    if (lt < .35) splashWipe(.5 + seg(lt, 0, .35) * .5);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#E8AA38', '#F4C95D']);
  }

  shots([[I0, shotI], [J0, shotJ], [K0, shotK]]);
})();
