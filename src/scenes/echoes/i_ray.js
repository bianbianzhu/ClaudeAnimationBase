// echoes/i_ray.js: "Echoes of Myself" shots I and J (verse 2). See STORYBOARD_echoes.md.
//
// I · the ray (110.43 → 126.17). Open field after rain at gold dusk, heavy clouds, a wet path. Masked Clawd (u 22).
//   110.43  the paper-screen flash (#FFF1D8) clears over 0.7 s onto the field; the gust still bends the grass.
//   → 114.37 Clawd walks right along the path, masked, under heavy clouds (camera tracks).
//   114.37  downbeat: the two cloud masses squeeze, then slide apart; gold light pours through the gap.
//   114.86  a painted beam drops and lands on the path just ahead.   115.35 Clawd stops (take, "!").
//   115.84  leans back to look up the beam.   116.83 → 118.2 three slow steps into the light; turns 3/4 to camera.
//   118.30  pushes the mask up onto its forehead (far arm): shining, hopeful eyes; camera pushed in (z 1.3).
//   120.27  the ray slides right; Clawd's eyes follow; it turns and trots after it (beat 245). A bird of light
//           flutters in the beam; stepping stones light one per beat (245 … 251) under the ray.
//   124 → 125.2 the ray waits for Clawd; Clawd slows to a walk inside it; the bird rises into the light and fades.
//   125.19 → 126.17 the ray narrows onto Clawd's feet (dusk-violet iris: beam hull → foot ellipse at the cut).
// J · shadows and fog (126.17 → 141.91). The same field later: low sun on the left, long shadows, a slanted ray.
//   126.17  the foot ellipse opens (iris) on Clawd walking, mask up, happy; its long shadow lies ahead on the path.
//   127.1   the shadow stretches and sways out of step.  128.14 Clawd stops; the shadow keeps walking 2 beats.
//   128.63  Clawd notices (take), 129.1 nervous.   130.10 the shadow peels up off the ground, standing at its feet.
//   130.8   it splits into three flickering candle-shadows fanning out.  131.5 they curl down and coil round the feet.
//   131.8 Clawd scared, stumbles (132.1 → 133.0), 133.0 hops and shakes loose: the coils burst, one shadow again.
//   134.04  fog rolls in from the right; 134.5 Clawd walks on; the ray and its shadow fade; the path forks three ways.
//   137.97  at the fork: turns to camera, confused, looks left, right, up (camera pushes in).
//   139.85  sad; 140.1 pulls the mask back down.   140.71 → 141.91 ECH.fogVeil k 0 → 1 as the fog settles flat.
(() => {
  const { C, S, bt } = ECH;
  const U = 22, GY = 850, HY = 560;
  const IRIS = '#2A2342', SHC = '#1F1731';
  const T_RAY = bt(233), T_STOP = bt(234), T_SLIDE = bt(244), T_TROT = bt(245);

  // ---------- helpers ----------
  const Ks = K => K.map(([a, s]) => [a, s / BEAT]);
  // Extend a walk profile K (ending on a speed-1 key) with a slow-down that ends at E with all feet planted
  // (total steps ≡ .5, where walkOn's side view lifts no leg). off = steps already walked before K.
  function stopBy(K, E, off = 0) {
    const [t0] = K[K.length - 1], q = off + ECH.dist(t0, Ks(K)) + (E - t0) / BEAT - .5;
    let x = frac(q); if (x < .2) x += 1;
    return K.concat([[E - 2 * BEAT * x, 1], [E, 0]]);
  }
  // convex hull (monotone chain), for the beam-shaped iris
  // ECH.masked options with the lifted mask sitting on top of the head in side view (there it would still hide the eye)
  const liftOpts = (view, l) => l <= 0 ? { maskLift: l } : view === 'side' ? { maskLift: l, maskOff: [-.5 * l, -1.4 * l], maskTilt: -.3 * l }
    : view === 'front' ? { maskLift: l, maskOff: [0, -1.1 * l], maskTilt: -.08 * l } : { maskLift: l };
  function hull(P) {
    P = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
    for (const p of P) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], P[i]) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // screen point of a world point on a parallax layer p
  function lpt(cam, p, x, y) {
    const z = 1 + (cam.z - 1) * p, cx = 960 + (cam.cx - 960) * p, cy = 540 + (cam.cy - 540) * p;
    return [960 + (x - cx) * z, 540 + (y - cy) * z];
  }
  // the light narrowing onto the feet: everything outside the hull of a foot ellipse and a beam top is dark
  function beamIris(fx, fy, rx, tx, ty, tw) {
    const P = ellPts(fx, fy, rx, rx * .36, 36);
    if (ty < fy - rx * .36) P.push([tx - tw, ty], [tx + tw, ty]);
    irisShape(hull(P), IRIS);
  }

  // ---------- set pieces ----------
  function hillPts(x0, x1, base, amp, step, seed) {
    const P = [[x0, base + 300]];
    for (let x = x0; x <= x1; x += step) P.push([x, base - amp * (.3 + .7 * hash(seed + Math.round(x / step) * 1.93))]);
    P.push([x1, base + 300]); return P;
  }
  // big cloud mass; dir +1 grows to the right of its inner edge e, -1 to the left. L = gold light on it 0..1.
  const CB = [[.2, 0, 1, .62], [1.2, -.4, 1.1, .75], [2.3, -.15, 1.25, .7], [3.5, -.45, 1.3, .8], [4.8, -.2, 1.4, .7], [6.1, -.35, 1.4, .75],
              [.9, -1.15, 1.4, .8], [2.9, -1.25, 1.7, .8], [5.1, -1.15, 1.8, .8], [1, .4, 1.5, .32], [3.3, .42, 1.8, .34], [5.7, .4, 1.8, .34]];
  function cloudMass(e, y, s, dir, L, key) {
    const x = e + dir * .8 * s, body = mixCol('#534C7C', '#8E7194', .45 * L), under = mixCol('#433C68', '#6E5478', .4 * L), top = mixCol('#6A6294', '#C49AA8', .5 * L);
    CB.forEach(([dx, dy, rx, ry], i) => {
      boilSeed(key + i);
      const col = i >= 9 ? under : i >= 6 ? mixCol(body, top, .35) : body;
      paint(ellPts(x + dir * dx * s, y + dy * s, rx * s, ry * s, 20, s * .03), { wash: col, fill: i >= 9 ? mixCol(under, PAL.ink, .2) : top, fillOp: 70, bleed: .12, tex: .5, ink: null });
    });
    if (L > .02) {   // gold rim on the edge that faces the gap
      glow(e, y - .1 * s, s * 1.4, C.gold, .55 * L);
      glow(e + dir * .2 * s, y - 1.1 * s, s * 1.1, C.goldLt, .45 * L);
      glow(e + dir * .3 * s, y + .45 * s, s * .9, C.goldLt, .4 * L);
    }
  }
  function tufts(cam, t, y0, y1, step, from, to, key, col, h, gust = 0, sw = 1) {
    for (let x = from; x < to; x += step) {
      const i = Math.round(x / step), xx = x + step * .7 * hash(i * 1.7 + h), yy = lerp(y0, y1, hash(i * 2.3 + 5 + h));
      if (!ECH.inView(cam, xx, 60)) continue;
      boilSeed(key + i);
      const s = 5 * Math.sin(bpOf(t) * Math.PI * .5 + hash(i) * 6) + gust, hh = h * (.7 + .5 * hash(i + 9));
      inkLine([[xx - 8, yy], [xx - 11 + s * .7, yy - hh * .8], [xx - 2, yy - 2], [xx + 1 + s, yy - hh], [xx + 4, yy - 2], [xx + 12 + s * .8, yy - hh * .7], [xx + 8, yy]], sw, col, 'ink', 0);
    }
  }
  function bush(x, y, s, col, key, shadowLen = 0) {
    boilSeed('bush' + key);
    if (shadowLen) paint([[x - s * .6, y], [x + s * .2, y - s * .12], [x + s * shadowLen, y - s * .05], [x + s * shadowLen + s * .3, y + s * .06], [x + s * .2, y + s * .14]], { wash: SHC, washOp: 90, ink: null, curv: .5 });
    paint(ellPts(x, y - s * .45, s * .8, s * .5, 18, s * .05), { wash: col, fill: mixCol(col, PAL.ink, .35), fillOp: 70, tex: .6, ink: PAL.ink, sw: .5, curv: .3 });
  }
  // the ground: horizon haze, far field, the wet path, puddles. P = palette. xs = world x range.
  function ground(cam, t, P, key, xs = [-1600, 4800]) {
    const [x0, x1] = xs, w = x1 - x0;
    boilSeed(key + 'field');
    paint(rectPts(x0, HY - 6, w, 1400), { wash: P.field, ink: null });
    boilSeed(key + 'fieldDk');
    paint(rectPts(x0, GY + 70, w, 700), { wash: P.fieldDk, washOp: 90, ink: null });
    boilSeed(key + 'fieldDk2');
    paint(rectPts(x0, GY + 150, w, 600), { wash: P.fieldDk, washOp: 110, ink: null });
    boilSeed(key + 'haze');
    paint(rectPts(x0, HY - 8, w, 60), { wash: P.haze, washOp: 80, ink: null });
    boilSeed(key + 'haze2');
    paint(rectPts(x0, HY - 4, w, 26), { wash: P.haze, washOp: 90, ink: null });
    boilSeed(key + 'path');
    const top = [], bot = [];
    for (let x = x0; x <= x1; x += 200) { top.push([x, GY - 24 + 5 * Math.sin(x / 310)]); bot.push([x, GY + 30 + 6 * Math.sin(x / 270 + 1)]); }
    paint(top.concat(bot.reverse()), { wash: P.path, ink: null });
    boilSeed(key + 'pathEdge');
    paint(bot.map(([x, y]) => [x, y - 12]).concat(bot.slice().reverse()), { wash: P.pathDk, washOp: 70, ink: null });
  }
  function puddles(cam, P, key, n0, n1) {
    for (let i = n0; i < n1; i++) {
      const x = i * 430 + 140 * hash(i * 3.1), rx = 55 + 45 * hash(i + 7);
      if (!ECH.inView(cam, x, 200)) continue;
      boilSeed(key + 'pud' + i);
      paint(ellPts(x, GY + 4 + 8 * hash(i + 2), rx, 9 + 4 * hash(i), 18), { wash: P.puddle, fill: P.puddleLt, fillOp: 90, bleed: .1, tex: .3, ink: PAL.ink, sw: .4 });
      inkLine([[x - rx * .5, GY + 2], [x + rx * .2, GY + 1]], .6, PAL.cream, 'inkfine', 0);
    }
  }
  // a soft painted beam of light in screen space, from (x0, y0) w0 wide to (x1, y1) w1 wide
  function beam(x0, y0, x1, y1, w0, w1, k, key, col = C.goldLt) {
    if (k <= .01) return;
    for (let i = 0; i <= 7; i++) { const q = i / 7; glow(lerp(x0, x1, q), lerp(y0, y1, q), lerp(w0, w1, q) * .95, col, .3 * k); }
    boilSeed('beam' + key);
    paint([[x0 - w0 / 2, y0], [x0 + w0 / 2, y0], [x1 + w1 / 2, y1], [x1 - w1 / 2, y1]], { wash: col, washOp: 40 * k, ink: null });
    for (let i = 0; i < 3; i++) {   // brighter shafts inside the beam
      boilSeed('beamst' + key + i);
      const a = (hash(i * 3.1 + 1) - .5) * .6, b = a + .08 + .1 * hash(i + 4);
      paint([[x0 + a * w0, y0], [x0 + b * w0, y0], [x1 + b * w1, y1 - 10], [x1 + a * w1, y1 - 10]], { wash: PAL.cream, washOp: 55 * k, ink: null });
    }
  }
  function stone(x, y, litT, t, key) {
    boilSeed('stone' + key);
    const a = t - litT, on = a >= 0, pop = on ? backOut(seg(a, 0, .25)) : 0;
    if (on) glow(x, y, 50 + 40 * Math.exp(-a * 3), C.goldLt, .5 + .5 * Math.exp(-a * 2));
    paint(ellPts(x, y, 24 * (1 + (on ? .12 * pop * Math.exp(-a * 4) : 0)), 8, 14), { wash: on ? mixCol('#77708A', C.goldLt, pop) : '#6F6A80', ink: PAL.ink, sw: .5 });
  }

  // ---------- shot I: the ray ----------
  const XI = 520;
  let KI = stopBy([[S.I, 1]], T_STOP);
  KI = stopBy(KI.concat([[bt(237), 0], [bt(237) + .15, 1]]), bt(239) + .4);
  KI = KI.concat([[T_TROT - .12, 0], [T_TROT + .3, 2], [bt(254), 2], [bt(254) + .45, 1]]);
  const wI = t => ECH.walkOn(t, XI, U, KI);
  const RX0 = wI(T_STOP).x + 200, LEAD0 = RX0 - wI(T_SLIDE).x;
  const leadI = t => t < bt(251) + .15 ? kf(t, [[T_SLIDE, LEAD0], [bt(246), 190]]) : lerp(190, 0, seg(t, bt(251) + .15, bt(253) + .3));
  const rxI = t => t < T_SLIDE ? RX0 : wI(t).x + leadI(t);
  const STONES = [245, 246, 247, 248, 249, 250, 251].map(n => [rxI(bt(n)), bt(n)]);
  function camI(t) {
    const w = wI(t);
    const off = kf(t, [[S.I, 330], [bt(232), 330], [T_STOP, 230], [bt(237), 200], [bt(240), 70], [T_SLIDE, 70], [bt(247), 300], [bt(251), 300], [bt(254), 120]]);
    const z = kf(t, [[S.I, 1.05], [113, 1], [bt(237), 1], [bt(240), 1.3], [T_SLIDE + .2, 1.3], [bt(247), 1]]);
    const cy = kf(t, [[S.I, 540], [bt(237), 540], [bt(240), 690], [T_SLIDE + .2, 690], [bt(247), 540]]);
    return { cx: w.x + off, cy, z, w };
  }
  // the cloud gap sits (on its parallax layer) just above where the ray lands
  const CLOUD_P = .25, GX = (() => { const cam = camI(T_RAY), [px] = [960 + (RX0 - cam.cx) * cam.z]; return 960 + (cam.cx - 960) * CLOUD_P + (px - 60 - 960); })();
  const PI_ = L => ({
    field: mixCol('#727650', mixCol(C.field, C.duskBot, .22), L), fieldDk: mixCol('#4A5238', C.fieldDk, L), haze: mixCol('#B8908A', C.duskBot, L),
    path: mixCol('#8D7D6E', '#C2A27C', L), pathDk: '#6E5E58', puddle: mixCol('#8A7C9E', C.goldLt, L * .8), puddleLt: mixCol('#B7A0B0', PAL.cream, L),
  });
  function shotI(t, lt, dur) {
    const cam = camI(t), w = cam.w, L = ease(seg(t, bt(232), bt(232) + 1.3));
    const P = PI_(L), gust = 26 * Math.exp(-lt * 2.2) * Math.cos(lt * 5);
    // sky, the light behind the clouds, the clouds
    ECH.skyGrad(mixCol('#4A4675', C.duskTop, L), mixCol('#C69080', C.duskBot, L), 'isky', 6, -60, lpt(cam, .1, 0, HY)[1] + 60);
    const half = -120 - 30 * ease(seg(t, bt(232) - .3, bt(232))) + 530 * easeOut(seg(t, bt(232), bt(232) + 1.5)) + 100 * seg(t, bt(232) + 1.5, S.J);
    const [gx, gy] = lpt(cam, CLOUD_P, GX, 250), lz = 1 + (cam.z - 1) * CLOUD_P;
    boilSeed('igap');
    if (L > .01) paint(ellPts(gx, gy - 60, 380 * lz, 230 * lz, 24, 8), { fill: C.goldLt, fillOp: 170 * L, bleed: .3, tex: .3, ink: null });
    glow(gx, gy - 30, 520 * lz, C.goldLt, .15 + .85 * L);
    glow(gx, gy - 30, 220 * lz, PAL.cream, .1 + .9 * L);
    ECH.layer(cam, .06, () => { boilSeed('ifar'); paint(ellPts(GX + 900, 470, 700, 40, 18, 6), { wash: mixCol('#9C7F9A', '#E7B7A0', L), washOp: 120, ink: null }); });
    ECH.layer(cam, CLOUD_P, () => {
      const dr = 6 * (t - S.I);
      cloudMass(GX - half + dr, 250, 150, -1, L, 'icl');
      cloudMass(GX + half + dr, 235, 155, 1, L, 'icr');
    });
    // far hills and a line of trees
    ECH.layer(cam, .35, () => {
      boilSeed('ihill1'); paint(hillPts(-1400, 3600, HY + 4, 70, 220, 3), { wash: mixCol('#7C6E8E', '#B08C94', L), ink: null, curv: .5 });
    });
    ECH.layer(cam, .6, () => {
      boilSeed('ihill2'); paint(hillPts(-1400, 4200, HY + 14, 40, 260, 11), { wash: mixCol('#5E6A4E', '#7E8656', L), ink: null, curv: .5 });
      for (let i = 0; i < 9; i++) bush(-600 + i * 520 + 160 * hash(i), HY + 22, 34 + 16 * hash(i + 2), mixCol('#4E5A44', '#5E6E44', L), 'if' + i);
    });
    // the field, the path, the pool of light, the stones
    camBegin(cam.cx, cam.cy, cam.z);
    ground(cam, t, P, 'ig');
    puddles(cam, P, 'ig', -2, 11);
    tufts(cam, t, HY + 40, GY - 60, 150, -1200, 4600, 'itm', mixCol('#4F5A3A', '#6E7A44', L), 16, gust * .5, .8);
    const rayK = seg(t, T_RAY - .35, T_RAY - .1), land = seg(t, T_RAY - .3, T_RAY), rx = rxI(t);
    const narrow = seg(t, bt(254), S.J - .06);
    if (land > 0) {
      const flare = t > T_RAY ? Math.exp(-(t - T_RAY) * 3) : 0, pr = 190 * (1 + .25 * flare) * lerp(1, .7, narrow) * easeOut(land);
      boilSeed('ipool');
      paint(ellPts(rx, GY + 6, pr, pr * .2, 24, 3), { wash: mixCol(P.path, C.goldLt, .75), washOp: 230, fill: C.goldLt, fillOp: 120, bleed: .25, tex: .3, ink: null });
      glow(rx, GY, pr * 1.2, C.goldLt, .6 + .4 * flare);
    }
    STONES.forEach(([sx, st], i) => { if (ECH.inView(cam, sx, 60)) stone(sx, GY + 12, st, t, 'i' + i); });
    [0, 1, 2].forEach(i => { const sx = STONES[6][0] + 88 * (i + 1); if (ECH.inView(cam, sx, 60)) stone(sx, GY + 12, 99999, t, 'ix' + i); });
    const feet = toScreen(w.x, GY), pool = toScreen(rx, GY);
    camEnd();
    // the ray: a painted beam from the cloud gap down to the path
    if (rayK > 0) {
      const tx = clamp(pool[0] - 90 * cam.z, gx - half * lz + 70, gx + half * lz - 70), ty = gy - 60;
      const by = lerp(ty, pool[1], easeIn(land));
      beam(tx, ty, pool[0], by, 110 * lz, 330 * cam.z * lerp(1, .6, narrow), rayK * (1 - .4 * narrow), 'i');
    }
    // Clawd, the bird, the foreground grass
    camBegin(cam.cx, cam.cy, cam.z);
    const mood = emotions(t, [[S.I - 5, 'neutral'], [T_STOP, 'surprised'], [118.55, 'hopeful'], [T_TROT - .05, 'happy', { emote: 'spark' }]], { take: .8 });
    const hd = ECH.heading(t, .25, [[118.05, .125], [T_SLIDE + .2, .25]]);
    const lean = kf(t, [[bt(235), 0], [bt(235) + .45, -.14], [bt(237) - .1, -.14], [bt(237) + .2, -.03], [118.0, -.03], [118.3, -.07], [T_SLIDE, -.07], [T_SLIDE + .3, 0]]);
    const lift = t < 118.3 ? 0 : t < 118.42 ? -.06 * ease(seg(t, 118.3, 118.42)) : lerp(-.06, 1, backOut(seg(t, 118.42, 118.95)));
    const push = ease(seg(t, 118.12, 118.34)) * (1 - ease(seg(t, 118.95, 119.4)));
    const look = ease(seg(t, T_SLIDE, T_SLIDE + .2));
    const upArms = ease(seg(t, bt(235) + .2, bt(236)));   // surprised arms relax while it gazes up
    const o = { ...mood, ...hd, dy: mood.dy + w.dy, rot: (mood.rot || 0) + lean,
      walk: hd.view === 'side' ? w.walk : null,
      aL: w.moving ? w.aL + (mood.aL - .4) * .3 : lerp(mood.aL, .45, upArms * (t < 118.55 ? 1 : 0)),
      aR: lerp(w.moving ? w.aR : lerp(mood.aR, .4, upArms * (t < 118.55 ? 1 : 0)), 1.4, push),
      lookX: lerp(mood.lookX || 0, 1, look), lookY: t > T_SLIDE ? lerp(mood.lookY || 0, 0, look) : mood.lookY,
      ...liftOpts(hd.view, lift), boilKey: 'clawdI' };
    if (t > 118.3 && t < T_SLIDE + .5) glow(w.x, GY - 5 * U, 7 * U, C.goldLt, .35);
    ECH.masked(w.x, GY, U, o);
    // the bird of light: comes down the beam, flutters ahead in it, rises and fades into the light at the end
    const bk = seg(t, T_SLIDE, T_SLIDE + .4) * (1 - seg(t, bt(253), bt(254) + .2));
    if (bk > 0) {
      const down = easeOut(seg(t, T_SLIDE, T_SLIDE + 1.1)), up = easeIn(seg(t, bt(253) - .2, bt(254) + .3));
      const bx = rx + 50 + 40 * Math.sin(t * 2.3) - 60 * up, by = lerp(GY - 720, GY - 240, down) - 30 * Math.sin(t * 3.1) - 480 * up;
      ECH.lightBird(bx, by, 34, t * 5.5, bk, 'i');
    }
    tufts(cam, t, GY + 110, GY + 220, 120, -1200, 4600, 'ifg', mixCol('#3E4A30', '#4E5E36', L), 34, gust, 1.2);
    camEnd();
    // I → J: the light narrows onto Clawd's feet
    if (narrow > 0) {
      const k = ease(narrow), fx = feet[0], fy = feet[1] - 8;
      const tx = lerp(pool[0] - 90, fx, k), ty = lerp(-200, fy + 10, easeIn(seg(narrow, .45, 1)));
      beamIris(fx, fy, lerp(1900, 130, k), tx, ty, lerp(1300, 20, k));
    }
    // scraps of paper from the burst screens still riding the gust across the field
    for (let i = 0; i < 8; i++) {
      const a = lt - .12 * i; if (a < 0 || a > 2.4) continue;
      const x = -120 + a * (620 + 140 * hash(i + 1)) + 260 * hash(i * 3.7), y = 120 + 560 * hash(i * 5.3) + 50 * Math.sin(a * 3 + i) + 60 * a * a;
      ECH.petal(x, y, 24 + 12 * hash(i + 2), a * (5 + 3 * hash(i)) + i, i % 3 ? '#F6E7C8' : '#E9C9A0', 'iscrap' + i);
    }
    if (lt < .7) flash(1 - ease(lt / .7), '#FFF1D8');
  }

  // ---------- shot J: shadows and fog ----------
  const W0 = wI(S.J).walk * 2, XJ = 400;
  let KJ = stopBy([[S.J, 1]], bt(260), W0);
  KJ = stopBy(KJ.concat([[bt(273), 0], [bt(273) + .2, 1]]), bt(278) + .3, W0);
  const wJ = t => { const w = ECH.walkOn(t, XJ, U, KJ); w.walk += W0 / 2; return w; };
  const KSH = stopBy([[S.J, 1]], bt(262) + .1, W0);   // the shadow walks on two beats after Clawd stops
  const FX = wJ(S.K).x + 5 * U;
  const T_PEEL = bt(264), T_SPLIT = 130.8, T_WRAP = 131.5, T_LOOSE = 133.0, T_FOG = bt(272), T_FORK = bt(280), T_VEIL = S.K - 1.2;
  function camJ(t) {
    const w = wJ(t);
    const off = kf(t, [[S.J, 120], [127.2, 120], [128.7, 250], [129.7, 230], [130.8, 90], [134.3, 90], [135.4, 240], [137.2, 220], [138.2, 40]]);
    const z = kf(t, [[S.J, 1], [129.7, 1], [130.8, 1.3], [133.9, 1.3], [135.2, 1], [137.5, 1], [138.4, 1.28]]);
    const cy = kf(t, [[S.J, 540], [129.7, 540], [130.8, 610], [133.9, 610], [135.2, 540], [137.5, 540], [138.4, 700]]);
    return { cx: w.x + off, cy, z, w };
  }
  const PJ = { field: '#9C9A5A', fieldDk: '#62683E', haze: '#F0A06E', path: '#D0A67C', pathDk: '#8A6A58', puddle: '#F2B27A', puddleLt: '#FFE3B0' };
  // the silhouette of Clawd in profile, feet at the origin, as one outline (for the shadows)
  function silPts(u, walk, arm) {
    const leg = (x0, off) => { const ph = ((walk ?? 0) + off) * TAU, sx = walk == null ? 0 : Math.sin(ph) * .55, lf = walk == null ? 0 : Math.max(0, Math.cos(ph)) * .8; return [x0 + sx, -lf]; };
    const [a, la] = leg(.9, 0), [b, lb] = leg(-2.6, .5);
    return [[-2.6, -8], [2.6, -8], [3.1, -7.4], [3.1, -5], [4.3, -4.9 - arm], [4.4, -4.2 - arm], [3.1, -3.9], [3.1, -2.3],
      [a + 1, -2.3], [a + 1, la], [a, la], [a, -2.3], [b + 1, -2.3], [b + 1, lb], [b, lb], [b, -2.3], [-3.1, -2.3], [-3.1, -7.4]].map(([x, y]) => [x * u, y * u]);
  }
  function shadowSelf(x, y, u, o) {
    if (o.alpha <= .01) return;
    boilSeed('shd' + o.key);
    push(); translate(x, y); scale(1, o.flat); rotate(o.ang); scale(1, o.len);
    const P = silPts(u, o.walk, o.arm || 0).map(([x, y]) => [x + jit(u * .12), y + jit(u * .12)]);   // a living, wavering edge
    paint(P, { wash: SHC, washOp: 255 * clamp(o.alpha), fill: '#140F22', fillOp: 110 * clamp(o.alpha), bleed: .06, tex: .5, border: .6, ink: null, curv: .3 });
    pop();
  }
  // the shadows' state at time t: a list of silhouettes, plus the coils round the feet
  function shadowsJ(t) {
    const bp = bpOf(t), fade = 1 - seg(t, 134.6, 136.6);
    const sway = .07 * Math.sin(bp * Math.PI + 1.9) + .04 * Math.sin(bp * Math.PI * .5 + .7);
    const lyingLen = kf(t, [[S.J, 2.1], [127.1, 2.1], [128.1, 3.0], [129.1, 3.5], [130.1, 3.3]]) + .2 * Math.sin(bp * Math.PI * .5 + 2);
    const shWalk = ECH.walkOn(t - BEAT * .5, 0, U, KSH).walk + W0 / 2;
    const peel = backOut(seg(t, T_PEEL, T_PEEL + .65)), split = backOut(seg(t, T_SPLIT, T_SPLIT + .55));
    const wrap = ease(seg(t, T_WRAP, T_WRAP + .7)), loose = seg(t, T_LOOSE, T_LOOSE + .35), back = ease(seg(t, T_LOOSE + .1, T_LOOSE + .5));
    const L = [];
    if (t < T_PEEL || back >= 1) {
      const settle = back >= 1 ? 1.9 + .3 * spring(t, T_LOOSE + .5, 5, 14) : lyingLen;
      L.push({ ang: 1.45 + (back >= 1 ? .02 * Math.sin(bp * Math.PI) : sway), flat: .3, len: settle, alpha: .78 * fade, walk: back >= 1 ? null : shWalk, arm: back >= 1 ? 0 : .6 * Math.max(0, Math.sin(bp * Math.PI * .5)), key: 'c' });
      return { L, coil: 0, burst: 0 };
    }
    for (let i = -1; i <= 1; i++) {
      const fl = 1 + .09 * Math.sin(t * 19 + i * 2) + .06 * Math.sin(t * 31 + i * 5) * split, fa = .8 + .2 * Math.sin(t * 25 + i * 3) * split;
      let ang = lerp(1.45 + sway, .45 + sway * .6, peel) + i * .8 * split + .05 * Math.sin(t * 13 + i);
      let len = lerp(lyingLen, 2.05, peel) * (i ? lerp(1, [.85, 0, .75][i + 1], split) : 1) * fl, flat = lerp(.3, 1, clamp(peel));
      // curl down and round the feet, then snap back flat on the ground when shaken loose
      ang = lerp(ang, i < 0 ? -1.5 : 1.5, wrap); len = lerp(len, i ? .7 : 1, wrap); flat = lerp(flat, .4, wrap);
      ang = lerp(ang, 1.45, back); len = lerp(len, 1.9, back); flat = lerp(flat, .3, back);
      const a = (i ? split * lerp(1, 0, back) : 1) * .86 * fa;
      L.push({ ang, flat, len, alpha: a, walk: null, arm: .3 + .3 * Math.sin(t * 9 + i), key: 's' + i });
    }
    return { L, coil: wrap * (1 - loose), burst: loose };
  }
  function coils(x, y, u, k, burst, t) {
    if (k <= .01 && (burst <= 0 || burst >= 1)) return;
    for (let i = 0; i < 3; i++) {
      boilSeed('coil' + i);
      const cx = x + (i - 1) * 1.3 * u, cy = y - (.5 + .55 * i) * u, rx = (2.4 + .5 * i) * u * (1 + 1.6 * burst), ry = .6 * u * (1 + burst);
      const a0 = -.3 + i * .4 + .3 * Math.sin(t * 7 + i), span = Math.PI * 1.2 * (burst > 0 ? 1 : k), P = [];
      for (let j = 0; j <= 10; j++) { const a = a0 + span * j / 10; P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry + .15 * u * Math.sin(t * 11 + j)]); }
      if (span > .2) paint(ribbon(P, 1.05 * u, .2 * u), { wash: SHC, washOp: 240 * (1 - burst) * (burst > 0 ? 1 : clamp(k * 2)), ink: null });
    }
  }
  // fog banks in screen space: they roll in from the right after T_FOG and flatten into a layer at the end
  function fogBanks(t, front) {
    const k = seg(t, T_FOG, T_FOG + 1), flat = ease(seg(t, 140.2, S.K));
    const N = front ? 4 : 6;
    for (let i = 0; i < N; i++) {
      const id = front ? 10 + i : i, t0 = T_FOG + .45 * i + (front ? 1.2 : 0), arr = easeOut(seg(t, t0, t0 + 3.2));
      if (arr <= 0) continue;
      const tx = front ? 1500 - i * 480 : 1650 - i * 330, x = lerp(W + 900, tx, arr) - 18 * (t - t0);
      let y = front ? 1040 - 30 * (i % 2) : 490 + 60 * (i % 3) + 30 * hash(i), ry = (front ? 110 : 120 + 50 * hash(id + 3)) * lerp(1, .5, flat);
      y = lerp(y, front ? 930 : 660, flat);
      boilSeed('fogb' + id);
      const rx = (760 + 300 * hash(id + 1)) * lerp(1, 1.4, flat);
      // stacked thin washes give the bank a soft edge (a big watercolour fill here can mix to a dark green)
      for (let j = 0; j < 3; j++) {
        const sc = 1 - j * .22;
        paint(ellPts(x + rx * .06 * j, y + ry * .08 * j, rx * sc, ry * sc, 24, 12 * sc), { wash: j ? C.fog : mixCol(C.fog, PAL.cream, .3), washOp: (front ? 80 : 95) * k, ink: null });
      }
    }
  }
  // a path branch that grows out along P (k 0..1), like a stroke being painted
  const T_FORKGROW = 135.0;
  function branch(P, w0, w1, k, key) {
    if (k <= .02) return;
    const D = through(P, 8), n = Math.max(2, Math.ceil(D.length * k));
    boilSeed(key);
    paint(ribbon(D.slice(0, n), w0, lerp(w0, w1, k)), { wash: PJ.path, ink: null });
  }
  function shotJ(t, lt, dur) {
    const cam = camJ(t), w = cam.w, bp = bpOf(t);
    const fogK = seg(t, T_FOG, T_FOG + 4.2), rayK = 1 - ease(seg(t, 134.4, 136.6));
    // sky: low sun on the left, thin warm clouds
    ECH.skyGrad(mixCol(C.duskTop, '#8C84A8', fogK * .5), mixCol('#F3A06C', C.fog, fogK * .6), 'jsky', 6, -60, lpt(cam, .1, 0, HY)[1] + 60);
    const [sx, sy] = lpt(cam, .08, 230, HY - 30);
    glow(sx, sy, 700, '#FFB870', (.9 - .5 * fogK));
    glow(sx, sy, 200, C.goldLt, 1 - .6 * fogK);
    ECH.layer(cam, .08, () => { boilSeed('jsun'); paint(ellPts(230, HY - 30, 70, 70, 24), { wash: mixCol('#FFE0A0', C.fog, fogK * .6), ink: null }); });
    ECH.layer(cam, .2, () => {
      for (let i = 0; i < 6; i++) {
        boilSeed('jcl' + i);
        const cx = -200 + i * 520 + 120 * hash(i + 4), cy = 120 + 110 * hash(i + 8);
        paint(ellPts(cx, cy, 300 + 120 * hash(i), 34 + 16 * hash(i + 1), 18, 6), { wash: mixCol('#C9869A', C.fog, fogK * .5), fill: '#E6A08E', fillOp: 90, bleed: .2, tex: .4, ink: null });
      }
    });
    ECH.layer(cam, .35, () => { boilSeed('jhill1'); paint(hillPts(-1400, 4200, HY + 4, 70, 220, 23), { wash: mixCol('#9A7488', C.fog, fogK * .5), ink: null, curv: .5 }); });
    ECH.layer(cam, .6, () => {
      boilSeed('jhill2'); paint(hillPts(-1400, 4600, HY + 14, 40, 260, 31), { wash: mixCol('#7E7A4E', C.fog, fogK * .4), ink: null, curv: .5 });
    });
    camBegin(cam.cx, cam.cy, cam.z);
    ground(cam, t, PJ, 'jg');
    // the fork: one branch climbs to the horizon, one runs on, one curves down toward us
    branch([[FX - 40, GY + 2], [FX + 250, GY - 60], [FX + 560, HY + 70], [FX + 900, HY + 14]], 52, 8, ease(seg(t, T_FORKGROW, T_FORKGROW + 1.5)), 'jfork');
    branch([[FX - 40, GY + 10], [FX + 200, GY + 90], [FX + 420, GY + 260], [FX + 640, GY + 420]], 54, 190, ease(seg(t, T_FORKGROW + .5, T_FORKGROW + 2)), 'jfork2');
    puddles(cam, PJ, 'jg', -1, 9);
    for (let i = 0; i < 7; i++) bush(-100 + i * 560 + 200 * hash(i + 20), GY - 110 - 60 * hash(i + 3), 44 + 20 * hash(i + 6), '#56603C', 'j' + i, 4.5 * (1 - fogK));
    tufts(cam, t, HY + 40, GY - 60, 150, -1200, 4600, 'jtm', '#5E6A3A', 16, 0, .8);
    const rxj = wJ(Math.min(t, 134.4)).x + 10;
    boilSeed('jpool');
    paint(ellPts(rxj, GY + 6, 170, 34, 24, 3), { wash: '#F6CE8E', washOp: 220 * rayK, fill: C.goldLt, fillOp: 110 * rayK, bleed: .25, tex: .3, ink: null });
    glow(rxj, GY, 210, C.goldLt, .5 * rayK);
    const pool = toScreen(rxj, GY), feet = toScreen(w.x, GY);
    camEnd();
    beam(pool[0] - 620 * cam.z, -120, pool[0], pool[1], 90, 280 * cam.z, rayK * .9, 'j');
    fogBanks(t, false);
    const veil = .24 * ease(seg(t, T_FOG + .8, 138.6));
    if (veil > .01) { boilSeed('jveil'); paint(rectPts(-80, -80, W + 160, H + 160), { wash: C.fog, washOp: 255 * veil, ink: null }); }
    // Clawd and its shadows
    camBegin(cam.cx, cam.cy, cam.z);
    const mood = emotions(t, [[S.J - 5, 'happy'], [bt(261), 'surprised'], [129.2, 'nervous'], [130.35, 'scared'], [133.55, 'nervous'], [T_FORK, 'confused'], [139.85, 'sad']], { take: .7 });
    const hd = ECH.heading(t, .25, [[T_FORK, 0], [138.25, -.125], [138.85, .125], [139.35, 0]], .2);   // looks left, right, then up
    const stum = seg(t, 132.05, 132.3) * (1 - seg(t, 132.9, 133.0));
    const hop = jump(t, T_LOOSE + .02, T_LOOSE + .36, 2.2);
    const noticed = ease(seg(t, bt(261), bt(261) + .3)) * (1 - ease(seg(t, T_FOG, T_FOG + .4)));
    const lx = kf(t, [[138.2, 0], [138.36, -1], [138.85, -1], [139.0, 1], [139.35, 1], [139.5, 0]]);
    const ly = kf(t, [[139.35, 0], [139.5, -1], [139.85, -1], [140.0, .3]]);
    const looking = t > 138.2 && t < 140.0;
    const lift = t < 140.1 ? 1 : t < 140.22 ? 1 + .05 * ease(seg(t, 140.1, 140.22)) : lerp(1.05, 0, ease(seg(t, 140.22, 140.6)));
    const pull = ease(seg(t, 139.95, 140.15)) * (1 - ease(seg(t, 140.6, 141.0)));
    const dxS = (mood.dx || 0) + stum * .5 * Math.sin(t * TAU * 2.1);
    if (rayK > .05) glow(w.x, GY - 4 * U, 6 * U, C.goldLt, .25 * rayK);
    const S_ = shadowsJ(t);
    for (const s of S_.L) shadowSelf(w.x + dxS * U, GY, U, s);
    const upK = ease(seg(t, 139.38, 139.55)) * (1 - ease(seg(t, 139.85, 140.05)));
    const o = { ...mood, ...hd, dx: dxS, dy: mood.dy + w.dy + hop.dy - .3 * upK, sq: mood.sq + hop.sq - .08 * upK,
      rot: (mood.rot || 0) + stum * .14 * Math.sin(t * TAU * 2.1 + .6) + (looking ? .05 * lx - .05 * ease(seg(t, 139.4, 139.6)) * (1 - ease(seg(t, 139.85, 140.05))) : 0),
      walk: hd.view === 'side' ? w.walk + stum * .14 * Math.sin(t * TAU * 4.1) + (hop.dy < 0 ? .25 * Math.sin(t * TAU * 5) : 0) : null,
      aL: w.moving ? w.aL : mood.aL, aR: lerp(w.moving ? w.aR : mood.aR, 1.35, pull),
      lookX: looking ? lx : noticed ? .6 : mood.lookX, lookY: looking ? ly : noticed ? .9 : mood.lookY,
      ...liftOpts(hd.view, lift), boilKey: 'clawdJ' };
    ECH.masked(w.x, GY, U, o);
    coils(w.x + dxS * U, GY, U, S_.coil, S_.burst, t);
    tufts(cam, t, GY + 110, GY + 220, 120, -1200, 4600, 'jfg', '#4A5230', 34, 0, 1.2);
    camEnd();
    fogBanks(t, true);
    const veil2 = .14 * ease(seg(t, T_FOG + 1.5, 139));
    if (veil2 > .01) { boilSeed('jveil2'); paint(rectPts(-80, -80, W + 160, H + 160), { wash: C.fog, washOp: 255 * veil2, ink: null }); }
    // J → K: the fog settles flat over everything
    if (t > T_VEIL) ECH.fogVeil(ease(seg(t, T_VEIL, S.K)), t);
    // I → J: the foot ellipse opens
    if (lt < .95) { const r = lerp(130, 2600, easeIn(seg(lt, 0, .95))); irisShape(ellPts(feet[0], feet[1] - 8, r, r * .36, 36), IRIS); }
  }

  shots([[ECH.S.I, shotI], [ECH.S.J, shotJ]]);
})();
