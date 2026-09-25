// f_country.js: "Beach Day" shots F, G, H (51.885 → 88.135). See STORYBOARD_beach.md.
//   F (51.885–68.135): the gang lands in the pasture on the downbeat, trots along the fence past cows; a sheep hops the
//                      fence and falls in step; they turn one by one; the sheep freezes; laughter; it bounces home.
//                      The camera tilts up to the mountains; green brush wipe.
//   G (68.135–82.135): the climb (breakdown): heavy steps, Floatie flops, Spike hops back and pushes. A gull glides
//                      over (build): hope, then determination; faster, then a sprint and a leap over the crest.
//   H (82.135–88.135): the drop: the sea! Arms up from behind, a turn to camera, starstruck; they race downhill and
//                      Floatie rolls past in the ring. Whip pan down.
(() => {
  const { bar, C, buddy } = BCH;
  const T_F = 51.885, T_LAND = bar(26), T_G = bar(34), T_H = bar(41);
  const GREEN = ['#4E7F42', '#8CC063'];
  const NAMES = ['clawd', 'spike', 'floatie', 'shades'];
  const lin = x => x;

  // distance travelled under a piecewise-linear speed profile K = [[t, px/s], ...] (closed form, so frames stay pure)
  function dist(t, K) {
    let d = 0;
    for (let i = 0; i + 1 < K.length; i++) {
      const [t0, v0] = K[i], [t1, v1] = K[i + 1]; if (t <= t0) return d;
      const te = Math.min(t, t1), ve = lerp(v0, v1, (te - t0) / (t1 - t0)); d += (v0 + ve) / 2 * (te - t0);
    }
    const [tl, vl] = K[K.length - 1]; if (t > tl) d += vl * (t - tl);
    return d;
  }
  // a parallax layer: p = 0 stays on screen, p = 1 moves with the main camera
  function layer(cam, p, fn) { camBegin(960 + (cam.cx - 960) * p, 540 + (cam.cy - 540) * p, 1 + (cam.z - 1) * p); fn(); camEnd(); }
  const inView = (cam, x, m = 300, p = 1) => Math.abs(x - (960 + (cam.cx - 960) * p)) < W / 2 / (1 + (cam.z - 1) * p) + m;
  // headings: a0 at the start, then drawn turns [[t0, a1], ...] (each .25 s)
  function heading(t, a0, seq) {
    let a = a0, r = { ...spinView(a0), smear: 0 };
    for (const [ts, a1] of seq) { if (t < ts) break; r = turn(t, ts, ts + .25, a, a1); a = a1; }
    return r;
  }
  // the props the friends carry in the near arm; the parasol is counter-rotated so it stays upright
  function carry(n, o) {
    if (n === 'spike') return { armL: (u) => BCH.vball(u * .95, 0, u * 1.05, 0, 'carry') };
    if (n === 'shades') return { armL: (u) => { push(); rotate(o.view === 'side' ? -(.7 - (o.aL ?? .2)) : (o.aL ?? .2)); BCH.parasol(0, u * 1.2, u * 1.25, 0, 0, 'carry'); pop(); } };
    return {};
  }
  const TIRED = { mouth: 'open', emote: 'sweat', eyes: 'sleepy' };

  // ---------- creatures ----------
  // A cow in profile facing right: (x, y) = ground between the feet, s = unit. o.head: 0 level, + grazing, - mooing.
  function cow(x, y, s, o = {}) {
    boilSeed('cow' + o.key);
    push(); translate(x, y); if (o.flip) scale(-1, 1);
    const P = pts => pts.map(([a, b]) => [a * s, b * s]), sw = .8, tw = o.tail || 0;
    inkLine(P([[-4.8, -6.4], [-5.6 + .3 * tw, -4.6], [-5.4 + .9 * tw, -3]]), sw, PAL.ink, 'ink', .5);
    paint(ellPts((-5.4 + .9 * tw) * s, -2.8 * s, .35 * s, .55 * s, 8), { wash: '#4A3B3B', ink: null });
    for (const [lx, far] of [[-3.9, 1], [-2.7, 0], [2.1, 1], [3.3, 0]]) {
      paint(rectPts(lx * s, -3 * s, .95 * s, 3 * s), { wash: far ? '#D8CFC0' : '#F1E9DA', ink: PAL.ink, sw: sw * .7 });
      paint(rectPts(lx * s, -.5 * s, .95 * s, .5 * s), { wash: '#4A3B3B', ink: null });
    }
    paint(rrPts(-5 * s, -7.4 * s, 9.6 * s, 4.8 * s, 1.6 * s), { wash: '#F4EDE0', ink: null });
    paint(ellPts(-2.4 * s, -5.6 * s, 1.5 * s, 1.1 * s, 14, .1 * s, .3), { wash: '#4A3B3B', ink: null });
    paint(ellPts(1.5 * s, -6.5 * s, 1.1 * s, .7 * s, 12, .1 * s), { wash: '#4A3B3B', ink: null });
    paint(ellPts(1.3 * s, -2.7 * s, .8 * s, .45 * s, 10), { wash: '#F2B6A6', ink: PAL.ink, sw: sw * .5 });
    paint(rrPts(-5 * s, -7.4 * s, 9.6 * s, 4.8 * s, 1.6 * s), { ink: PAL.ink, sw });
    push(); translate(4.1 * s, -6.6 * s); rotate(o.head || 0);
    paint(ellPts(.1 * s, -1.2 * s, .9 * s, .38 * s, 10, 0, -.5), { wash: '#F4EDE0', ink: PAL.ink, sw: sw * .6 });   // ear
    paint(P([[.9, -1.5], [1.2, -2.3], [1.5, -1.5]]), { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });               // horn
    paint(rrPts(0, -1.4 * s, 2.9 * s, 2.7 * s, .9 * s), { wash: '#F4EDE0', ink: PAL.ink, sw });
    paint(rrPts(1.8 * s, -.3 * s, 1.6 * s, 1.6 * s, .6 * s), { wash: '#F2B6A6', ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(2.9 * s, .2 * s, .14 * s, .2 * s, 8), { wash: PAL.ink, ink: null });
    if (o.moo) paint(ellPts(2.5 * s, 1.1 * s, .5 * s * o.moo, .35 * s * o.moo + .05 * s, 10), { wash: '#6A2A3A', ink: PAL.ink, sw: sw * .5 });
    if (o.head < -.2) inkLine(P([[1, -.7], [1.5, -.85]]), sw, PAL.ink, 'ink', 0);                                     // shut, blissful eye
    else paint(ellPts(1.3 * s, -.6 * s, .2 * s, .28 * s, 8), { wash: PAL.ink, ink: null });
    pop(); pop();
  }
  // A sheep in profile facing right. o: walk (leg phase or null), eyes 'happy' | 'wide', flip, sq, blush.
  function sheep(x, y, s, o = {}) {
    boilSeed('sheep' + o.key);
    push(); translate(x, y); if (o.flip) scale(-1, 1); scale(1 + (o.sq || 0) * .5, 1 - (o.sq || 0));
    const legs = [[-2.2, 1, 0], [1.4, 1, .5], [-1.6, 0, .5], [2, 0, 0]];
    for (const [lx, far, ph] of legs) {
      let sx = 0, h = 2.2;
      if (o.walk != null) { const a = (o.walk + ph) * TAU; sx = Math.sin(a) * .5; h = 2.2 - Math.max(0, Math.cos(a)) * .7; }
      paint(rectPts((lx + sx) * s, -2.4 * s, .6 * s, h * s), { wash: far ? '#3A3240' : '#4A4048', ink: PAL.ink, sw: .5 });
    }
    const B = [];
    for (let i = 0; i < 30; i++) { const a = i / 30 * TAU, r = 1 + .1 * Math.abs(Math.sin(a * 5)); B.push([Math.cos(a) * 3.5 * s * r, -4 * s + Math.sin(a) * 2.2 * s * r]); }
    paint(B, { wash: '#F7F0E2', fill: '#D8CDBA', fillOp: 60, tex: .6, ink: PAL.ink, sw: .8, curv: .3 });
    push(); translate(3.2 * s, -4.9 * s); rotate(o.headRot || 0);
    paint(ellPts(-.4 * s, -.1 * s, .8 * s, .35 * s, 10, 0, .5), { wash: '#4A4048', ink: PAL.ink, sw: .5 });            // ear
    paint(ellPts(.7 * s, .3 * s, 1.05 * s, 1.35 * s, 16, 0, -.4), { wash: '#4A4048', ink: PAL.ink, sw: .7 });
    paint(ellPts(0, -.9 * s, .9 * s, .55 * s, 12), { wash: '#F7F0E2', ink: PAL.ink, sw: .5 });                         // topknot
    if (o.eyes === 'wide') { paint(ellPts(.9 * s, 0, .38 * s, .42 * s, 10), { wash: PAL.cream, ink: null }); paint(ellPts(1.05 * s, 0, .16 * s, .22 * s, 8), { wash: PAL.ink, ink: null }); }
    else inkLine([[.6 * s, .05 * s], [.95 * s, -.2 * s], [1.3 * s, .05 * s]], .7, PAL.cream, 'inkfine', .6);
    if (o.blush) paint(ellPts(1.1 * s, .75 * s, .35 * s, .2 * s, 8), { wash: PAL.rose, washOp: 200 * o.blush, ink: null });
    pop(); pop();
  }

  // ---------- set pieces ----------
  function mountains(key, base, cols = ['#9FB3D6', '#8AA0C8'], scale = 1, x0 = 0) {
    const PK = [[-200, 540], [150, 360], [420, 470], [760, 250], [1050, 410], [1350, 170], [1720, 380], [2000, 290], [2350, 480], [2600, 420]];
    boilSeed('mtn' + key);
    const P = PK.map(([x, y]) => [x0 + x * scale, base - (base - y) * scale]);
    const R = []; for (let i = 0; i + 1 < P.length; i++) { const a = P[i], b = P[i + 1]; R.push(a, [lerp(a[0], b[0], .35), lerp(a[1], b[1], .35) + (b[1] > a[1] ? -12 : 14) * scale], [lerp(a[0], b[0], .7), lerp(a[1], b[1], .7) + (b[1] > a[1] ? -6 : 18) * scale]); } R.push(P[P.length - 1]);
    paint([[P[0][0], base + 300]].concat(R, [[P[P.length - 1][0], base + 300]]), { wash: cols[0], fill: cols[1], fillOp: 80, bleed: .1, tex: .5, ink: PAL.ink, sw: .6, curv: .25 });
    for (let i = 1; i < PK.length - 1; i++) {   // snow caps on the tall ones
      if (PK[i][1] > 400) continue;
      const [px, py] = P[i], d = (base - py) * .22, L = P[i - 1], Rt = P[i + 1];
      const kl = d / (L[1] - py), kr = d / (Rt[1] - py);
      paint([[px, py], [lerp(px, Rt[0], kr), py + d], [lerp(px, Rt[0], kr * .5), py + d * .75], [px, py + d * 1.1], [lerp(px, L[0], kl * .5), py + d * .8], [lerp(px, L[0], kl), py + d]], { wash: PAL.cream, ink: PAL.ink, sw: .5, curv: .2 });
    }
  }
  function windmill(x, y, s, t, key) {
    boilSeed('mill' + key);
    paint([[x - s * .5, y], [x - s * .3, y - s * 1.9], [x + s * .3, y - s * 1.9], [x + s * .5, y]], { wash: '#E8D9BE', fill: '#B99F7A', fillOp: 70, ink: PAL.ink, sw: .6 });
    paint([[x - s * .42, y - s * 1.85], [x, y - s * 2.3], [x + s * .42, y - s * 1.85]], { wash: '#B8573E', ink: PAL.ink, sw: .6 });
    const a0 = bpOf(t) * .25 * TAU / 4, hx = x, hy = y - s * 1.95;
    for (let i = 0; i < 4; i++) {
      const a = a0 + i * TAU / 4, c = Math.cos(a), sn = Math.sin(a), q = (d, w) => [hx + c * d - sn * w, hy + sn * d + c * w];
      paint([q(s * .1, 0), q(s * 1.25, 0), q(s * 1.25, s * .24), q(s * .3, s * .2)], { wash: PAL.cream, ink: PAL.ink, sw: .5 });
    }
    paint(ellPts(hx, hy, s * .08, s * .08, 8), { wash: PAL.ink, ink: null });
  }
  function tree(x, y, s, key, col = '#6FA24E') {
    boilSeed('tree' + key);
    paint(rectPts(x - s * .08, y - s * .6, s * .16, s * .6), { wash: C.trunk, ink: PAL.ink, sw: .5 });
    paint(ellPts(x, y - s * .9, s * .5, s * .45, 18, s * .04), { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 60, tex: .6, ink: PAL.ink, sw: .6, curv: .3 });
  }
  function pine(x, y, h, key, col = '#3F6E5A') {
    boilSeed('pine' + key);
    paint(rectPts(x - h * .04, y - h * .18, h * .08, h * .2), { wash: '#6B4A36', ink: PAL.ink, sw: .5 });
    for (let i = 0; i < 3; i++) {
      const w = h * (.36 - i * .08), yb = y - h * (.15 + i * .24), yt = yb - h * .42;
      paint([[x - w, yb], [x + w, yb], [x, yt]], { wash: mixCol(col, '#7FB08A', i * .12), fill: mixCol(col, PAL.ink, .3), fillOp: 50, tex: .5, ink: PAL.ink, sw: .6 });
    }
  }
  function rock(x, y, s, key, col = '#A7A5B4') {
    boilSeed('rock' + key);
    paint([[x - s, y], [x - s * .8, y - s * .5], [x - s * .2, y - s * .8], [x + s * .5, y - s * .6], [x + s, y]], { wash: col, fill: mixCol(col, PAL.indigo, .3), fillOp: 70, tex: .6, ink: PAL.ink, sw: .6 });
  }
  function tufts(cam, y0, key, col, step = 95, from = -600, to = 4200) {
    for (let x = from; x < to; x += step) {
      const i = Math.round(x / step); if (!inView(cam, x, 100)) continue;
      boilSeed(key + i);
      const xx = x + 40 * hash(i + 3), yy = y0 + 70 * hash(i + 11), s = wob(T, .5, hash(i) * 3) * 5;
      for (const k of [-1, 0, 1]) inkLine([[xx + k * 8, yy], [xx + k * 13 + s, yy - 22 - 10 * hash(i + k)]], .8, col, 'inkfine', .4);
    }
  }

  // =====================================================================================================
  // F · pasture
  // =====================================================================================================
  const FB = { clawd: 1300, spike: 1060, floatie: 820, shades: 580 }, FY = 900, FU = 22;
  const FK = [[52.3, 0], [52.8, 150], [59.8, 150], [60.3, 0], [64.8, 0], [65.3, 150]];
  const DF = t => dist(t, FK);
  const TB = { shades: 60.135, floatie: 60.5, spike: 60.85, clawd: 61.2 };     // turn back, one by one
  const TFW = { clawd: 64.45, spike: 64.58, floatie: 64.71, shades: 64.84 };   // turn on again
  const FKEYS = {};
  NAMES.forEach((n, i) => { FKEYS[n] = [[51.5, 'excited'], [52.75 + i * .13, 'happy'], [TB[n] + .12, 'confused'], [62.85 + (3 - i) * .15, 'laugh'], [TFW[n] + .08, 'happy']]; });
  const SH_UP = 58.135, SH_LAND = 58.6, FREEZE = 62.135, SH_BACK = 64.135;
  const COWS = [[980, 0], [1760, 1], [2950, 2]];
  const MOO = 55.135;

  function fCam(t) {
    const d = DF(t);
    const z = kf(t, [[52.4, 1], [53.5, .8], [54.4, .8], [55.6, 1.12], [60.2, 1.12], [61.2, 1.2], [62.05, 1.2], [62.3, 1.5], [62.8, 1.5], [63.1, 1.2], [64.3, 1.2], [65.3, 1.1], [65.9, 1.1], [68.2, 1]]);
    const shift = kf(t, [[57.6, 0], [58.6, -140], [60.2, -140], [61.2, -200], [62.05, -200], [62.3, -520], [62.8, -520], [63.1, -200], [64.3, -200], [65.6, 0]]);   // make room for the sheep
    const cy = kf(t, [[52.4, 540], [53.5, 500], [54.4, 500], [55.6, 600], [62.05, 600], [62.3, 720], [62.8, 720], [63.1, 600], [65.9, 600], [68.2, -420]]) + 6 * wob(t, .23);
    return { cx: 960 + d + shift + 10 * wob(t, .17), cy, z };
  }
  function fSky(t, cam) {
    BCH.skyGrad('#9BD0EA', '#F6EBC3', 'fsky', 7);
    layer(cam, .04, () => { BCH.cloud(380 - t * 6 + 300, 170, 150, PAL.cream, 0, 'f1', { sw: .6 }); BCH.cloud(1500 - t * 5 + 250, 110, 110, PAL.cream, 0, 'f2', { sw: .6, ph: 1 }); BCH.cloud(2300 - t * 6 + 300, 230, 120, PAL.cream, 0, 'f3', { sw: .6, ph: 2 }); });
    layer(cam, .12, () => mountains('f', 660, ['#A9BCDD', '#8FA3CB'], 1.15, 60));
    layer(cam, .3, () => {
      boilSeed('fhill');
      paint(ellPts(500, 780, 1100, 230, 36, 3), { wash: '#B8D47E', fill: '#98B862', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
      paint(ellPts(2000, 800, 1200, 240, 36, 3), { wash: '#AECF74', fill: '#8FB05C', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
      windmill(1780, 600, 90, t, 'a');
      tree(900, 620, 110, 'h1', '#86B45A'); tree(990, 630, 80, 'h2', '#7AA852');
    });
    layer(cam, .6, () => {
      boilSeed('fmid');
      paint(ellPts(1200, 900, 1700, 250, 40, 3), { wash: '#A2CB66', fill: '#86B052', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .7 });
      paint(ellPts(3300, 910, 1500, 250, 40, 3), { wash: '#9BC662', fill: '#86B052', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .7 });
      // a red barn on the far field
      boilSeed('barn');
      paint([[2380, 700], [2380, 610], [2450, 560], [2520, 610], [2520, 700]], { wash: '#C0533F', fill: '#8E3A2E', fillOp: 60, tex: .5, ink: PAL.ink, sw: .6 });
      paint(rectPts(2430, 640, 40, 60), { wash: PAL.cream, ink: PAL.ink, sw: .4 });
      tree(1500, 700, 150, 'm1'); tree(3000, 700, 130, 'm2', '#7FAE55');
    });
  }
  function fGround(t, cam) {
    boilSeed('fground');
    const xl = cam.cx - W / cam.z, xr = cam.cx + W / cam.z;
    for (let x = Math.floor(xl / 1200) * 1200; x < xr; x += 1200) {
      boilSeed('fg' + x);
      paint(rectPts(x - 10, 720, 1220, 900), { wash: '#93C25E', ink: null });
      paint(rectPts(x - 10, 720, 1220, 90), { fill: '#B8D67C', fillOp: 90, bleed: .2, tex: .5, ink: null });
      paint(rectPts(x - 10, 862, 1220, 96), { wash: '#E5CD96', fill: '#C9AA72', fillOp: 60, bleed: .08, tex: .6, ink: null });
      inkLine([[x, 862 + jit(2)], [x + 600, 860 + jit(2)], [x + 1210, 862 + jit(2)]], .5, '#9C8456', 'inkfine', .3);
    }
    inkLine([[xl, 722], [xr, 720]], .6, PAL.ink, 'ink', .2);
  }
  function fence(t, cam) {
    for (let k = -8; k < 40; k++) {
      const x = k * 120; if (!inView(cam, x, 200)) continue;
      boilSeed('fence' + k);
      paint(rectPts(x - 7, 742, 14, 108, 1), { wash: '#C79A63', fill: '#8A6A42', fillOp: 60, tex: .5, ink: PAL.ink, sw: .6 });
      for (const ry of [768, 806]) paint(rectPts(x - 1, ry, 122, 10, 1), { wash: '#D6AA70', ink: PAL.ink, sw: .45 });
    }
  }
  function fCows(t, cam) {
    for (const [x, i] of COWS) {
      if (!inView(cam, x, 300)) continue;
      const moo = i === 1 ? seg(t, MOO, MOO + .12) * (1 - seg(t, MOO + .8, MOO + 1)) : 0;
      const head = i === 1 ? kf(t, [[MOO - .35, .8], [MOO - .05, -.45], [MOO + 1.1, -.45], [MOO + 1.6, .8]]) : .8 + .08 * Math.sin(t * 2.3 + i);
      cow(x, 790, 13, { key: i, head, moo, tail: Math.sin(t * 3 + i * 2), flip: i === 2 });
      const age = t - MOO - .1;
      if (i === 1 && age > 0 && age < 1.5) { boilSeed('moonote'); BCH.note(x + 110 + age * 60, 690 - age * 110, 24, seg(age, 0, .2) * (1 - seg(age, 1.2, 1.5)), .25 * Math.sin(age * 5), PAL.violet); }
    }
    // two sheep grazing near the one who'll jump
    if (t < 66) for (const [x, i] of [[1000, 1], [1290, 2]]) if (inView(cam, x)) sheep(x, 785, 13, { key: 'g' + i, headRot: .5 + .1 * Math.sin(t * 2 + i), walk: null, eyes: 'happy' });
  }
  // The jumping sheep: returns { x, y, o, front } (front = on the path side of the fence)
  function fSheepState(t) {
    const shX = tt => FB.shades + DF(tt);
    const x0 = shX(SH_UP) - 280, x1 = shX(SH_LAND) - 235;
    if (t < SH_UP - .12) return { x: x0, y: 790, front: false, o: { eyes: 'happy', headRot: kf(t, [[56.9, .5], [57.2, -.1]]), sq: .06 * pulse(t) * seg(t, 57.2, 57.5), walk: null } };
    if (t < SH_UP) return { x: x0, y: 790, front: false, o: { eyes: 'happy', sq: .2 * seg(t, SH_UP - .12, SH_UP) } };
    if (t < SH_LAND) { const k = seg(t, SH_UP, SH_LAND), p = arcPt([x0, 790], [x1, FY], 150, k); return { x: p[0], y: p[1], front: k > .5, o: { eyes: 'happy', sq: -.12, walk: null } }; }
    const land = t - SH_LAND, sqL = .2 * Math.exp(-8 * land) * Math.cos(20 * land);
    if (t < FREEZE) { const w = bpOf(t); return { x: shX(t) - 235, y: FY, front: true, o: { eyes: 'happy', walk: w, sq: sqL + .05 * Math.max(0, Math.cos(w * TAU * 2)), dy: -Math.abs(Math.sin(w * TAU)) * 10 } }; }
    const xs = shX(FREEZE) - 235, wf = bpOf(FREEZE) - .08;
    if (t < SH_BACK) { const tk = take(t, FREEZE + .05, .8); return { x: xs, y: FY, front: true, o: { eyes: 'wide', walk: wf, sq: tk.sq, dy: tk.dy * 11 * 2, blush: seg(t, 63.1, 63.6), sweat: seg(t, FREEZE + .15, FREEZE + .4) } }; }
    const hops = [[SH_BACK, SH_BACK + .45, xs, xs - 90, FY, 790, 140], [64.7, 65.05, xs - 90, xs - 240, 790, 790, 60], [65.2, 65.55, xs - 240, xs - 390, 790, 790, 60], [65.7, 66.05, xs - 390, xs - 540, 790, 790, 60]];
    for (const [a, b, xa, xb, ya, yb, h] of hops) {
      if (t < a) return { x: xa, y: ya, front: false, o: { flip: true, eyes: 'happy', sq: .15 * seg(t, a - .1, a) } };
      if (t < b) { const k = seg(t, a, b), p = arcPt([xa, ya], [xb, yb], h, k); return { x: p[0], y: p[1], front: ya > 850 && k < .5, o: { flip: true, eyes: 'happy', sq: -.1 } }; }
    }
    const a = t - 66.05; return { x: xs - 540, y: 790, front: false, o: { flip: true, eyes: 'happy', sq: .15 * Math.exp(-8 * a) * Math.cos(20 * a) } };
  }
  function drawSheep(t, st) {
    sheep(st.x, st.y, 15, { key: 'j', ...st.o });
    if (st.o.sweat > 0) { boilSeed('sheepbang'); emote('!', st.x + 20, st.y - 150, 26, seg(t, FREEZE + .05, FREEZE + .25) * (1 - seg(t, 63.4, 63.7)), t - FREEZE); }
    if (st.o.sweat > 0) { boilSeed('sheepsweat'); emote('sweat', st.x + 90, st.y - 120, 24, st.o.sweat, t - FREEZE); }
  }
  function fChar(n, i, t) {
    const d = DF(t), m = clamp(kf(t, FK, lin) / 150), x = FB[n] + d, walk = d / 75 + BCH.CAST[n].ph;
    const mood = emotions(t, FKEYS[n]), hd = heading(t, .25, [[TB[n], n === 'spike' || n === 'floatie' ? -.25 : -.125], [TFW[n], .25]]);
    const o = { ...mood, ...hd }, s = Math.sin(walk * TAU);
    if (m > .02) o.walk = walk;
    o.dy = lerp(mood.dy || 0, -Math.abs(Math.sin(walk * TAU)) * .55, m);
    o.aL = lerp(mood.aL ?? .2, .3 * s, m); o.aR = lerp(mood.aR ?? .2, -.3 * s, m);
    o.rot = lerp(mood.rot || 0, -.03, m);
    o.sq = lerp(mood.sq || 0, .05 * Math.max(0, Math.cos(walk * TAU * 2)), m);
    const lt = t - T_F;
    if (lt < .25) { const k = lt / .25; o.dy = -11.82 * (1 - k * k); o.sq = lerp(-.12, -.05, k); o.aL = o.aR = .9; o.walk = null; }
    else { const a = t - T_LAND, k = ease(seg(t, T_LAND + .05, T_LAND + .5)); o.sq += .24 * Math.exp(-8 * a) * Math.cos((18 + i * 1.7) * a); o.aL = lerp(.9, o.aL, k); o.aR = lerp(.9, o.aR, k); }
    buddy(n, x, FY, FU, { ...o, ukeBack: n === 'clawd' && (o.view === 'side' || o.view === 'q'), ...carry(n, o) });
  }
  function shotF(t, lt, dur) {
    const cam = fCam(t);
    fSky(t, cam);
    camBegin(cam.cx, cam.cy, cam.z);
    fGround(t, cam);
    const st = fSheepState(t);
    fCows(t, cam);
    if (!st.front) drawSheep(t, st);
    fence(t, cam);
    for (let i = 3; i >= 0; i--) fChar(NAMES[i], i, t);
    if (st.front) drawSheep(t, st);
    tufts(cam, 985, 'ftuft', '#5E8F4A');
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, GREEN);
  }

  // =====================================================================================================
  // G · the mountain
  // =====================================================================================================
  const GB = { clawd: 1100, shades: 890, spike: 690, floatie: 500 }, GU = 23, SL = .4;
  const GK = [[68.135, 55], [72.1, 55], [72.6, 0], [78.135, 0], [78.6, 190], [80.135, 190], [80.6, 420]];
  const Dg = t => dist(t, GK);
  const FLOP = 72.2, HOP0 = 73.3, HOP1 = 73.9, PUSH0 = 74.2, PUSH1 = 76.1, GO = 78.135, RUN = 80.135;
  const LEAP = { clawd: 81.8, shades: 81.86, floatie: 81.92, spike: 81.98 };
  const XC = GB.clawd + Dg(LEAP.clawd) + 40;                                    // the crest
  const gy = x => x < XC ? 900 - (x - 600) * SL : 900 - (XC - 600) * SL + (x - XC) * 1.1;
  const FIN = { clawd: 0, shades: -170, floatie: -340, spike: -510 };
  const pushD = t => 95 * ease(seg(t, PUSH0, PUSH1));
  const xFl = t => GB.floatie + Dg(Math.min(t, FLOP)) + pushD(t) + Math.max(0, Dg(t) - Dg(GO));
  function rawX(n, t) {
    if (n === 'floatie') return xFl(t);
    if (n !== 'spike' || t < HOP0) return GB[n] + Dg(t);
    const x1 = xFl(HOP1) - 165;
    return t < HOP1 ? lerp(GB.spike + Dg(HOP0), x1, ease(seg(t, HOP0, HOP1))) : xFl(t) - 165;
  }
  const xG = (n, t) => t < RUN ? rawX(n, t) : lerp(rawX(n, t), rawX('clawd', t) + FIN[n], ease(seg(t, RUN, 81.6)));
  const GHEAD = {
    clawd: [[73.6, -.125], [76.3, 0], [77.95, .25]],
    shades: [[73.9, -.125], [78.02, .25]],
    spike: [[72.85, -.25], [73.95, .25]],
    floatie: [],
  };
  const GKEYS = {
    clawd: [[68, 'sleepy', TIRED], [73.7, 'neutral'], [74.45, 'happy'], [76.6, 'hopeful'], [78.135, 'determined'], [80.2, 'excited']],
    shades: [[68, 'sleepy', TIRED], [74.1, 'relieved'], [77.25, 'hopeful'], [78.2, 'determined'], [80.3, 'excited']],
    spike: [[68, 'sleepy', TIRED], [72.8, 'surprised'], [73.12, 'determined'], [76.25, 'relieved'], [77.35, 'hopeful'], [78.27, 'determined'], [80.4, 'excited']],
    floatie: [[68, 'sleepy', TIRED], [FLOP, 'sleepy', { mouth: 'wobble', emote: 'sweat', eyes: 'squeeze' }], [74.35, 'relieved'], [77.45, 'hopeful'], [GO, 'determined'], [80.5, 'excited']],
  };
  const GULL0 = 76.135, GULL1 = 78.5;
  const gullAt = t => { const k = seg(t, GULL0, GULL1); return [lerp(2100, -200, k), 430 - 90 * Math.sin(k * Math.PI) + 14 * Math.sin(t * 3)]; };
  function gCam(t) {
    const xs = NAMES.map(n => xG(n, t)), mid = (Math.max(...xs) + Math.min(...xs)) / 2;
    const focus = (xFl(t) + rawX('spike', t)) / 2 + 60;   // the flop and the push
    const lead = kf(t, [[79.5, 0], [80.6, 240]]), cx = lerp(mid, focus, seg(t, 71.6, 72.4) * (1 - seg(t, 76, 76.6))) + 60 + lead;
    const up = kf(t, [[75.8, 0], [76.5, 120], [77.9, 120], [78.6, 0], [81.3, 0], [82.2, 260]], ease);
    const z = kf(t, [[68.1, 1.2], [71.6, 1.12], [72.5, 1.3], [75.9, 1.3], [76.6, 1.05], [78.3, 1.1], [80.2, 1.1], [81, .98]]);
    return { cx, cy: gy(cx) - 150 - up + 5 * wob(t, .21), z };
  }
  function gBack(t, cam) {
    BCH.skyGrad('#78B2E0', '#DCEEF4', 'gsky', 7);
    const bright = seg(t, 79.6, 82.1);
    layer(cam, .05, () => { BCH.cloud(1500, 180, 170, PAL.cream, 0, 'g1', { sw: .6 }); BCH.cloud(400, 120, 120, PAL.cream, 0, 'g2', { sw: .6, ph: 1.4 }); });
    layer(cam, .12, () => mountains('g', 900, ['#B7C7E4', '#9DB0D6'], 1.25, -300));
    layer(cam, .3, () => {   // a far misty ridge with pines
      boilSeed('gridge');
      const ry = x => 1000 - (x + 800) * .14 + 40 * Math.sin((x + 800) / 300 * 1.7);
      const P = []; for (let i = 0; i <= 14; i++) { const x = -800 + i * 300; P.push([x, ry(x)]); }
      paint(P.concat([[3400, 2200], [-800, 2200]]), { wash: '#A7BFD3', fill: '#8FA9C2', fillOp: 70, tex: .5, ink: PAL.ink, sw: .5, curv: .3 });
      for (let i = 0; i < 16; i++) { const x = -700 + i * 250 + 90 * hash(i); if (inView(cam, x, 200, .3)) pine(x, ry(x) + 25, 90 + 40 * hash(i + 2), 'r' + i, '#6F8FA3'); }
    });
    if (bright > 0) layer(cam, 1, () => { glow(XC + 150, gy(XC) + 40, 1000, '#FFE9B0', .8 * bright); BCH.beams(XC + 260, gy(XC) + 160, -Math.PI / 2 - .35, 1100, bright, t, 'crest', 6, .2); });
  }
  function gGround(t, cam) {
    const xl = cam.cx - W / cam.z - 200, xr = cam.cx + W / cam.z + 200, P = [];
    for (let x = xl; x <= xr; x += 60) P.push([x, gy(x)]);
    if (xl < XC && xr > XC) { P.push([XC, gy(XC)]); P.sort((a, b) => a[0] - b[0]); }
    boilSeed('gground');
    paint(P.concat([[xr, gy(xl) + 1400], [xl, gy(xl) + 1400]]), { wash: '#86A96F', fill: '#6E8F6A', fillOp: 60, bleed: .1, tex: .6, ink: null });
    paint(P.map(([x, y]) => [x, y + 4]).concat(P.slice().reverse().map(([x, y]) => [x, y + 70])), { fill: '#B5B08A', fillOp: 110, bleed: .1, tex: .6, ink: null });   // the path
    for (let i = 0; i + 1 < P.length; i += 8) inkLine(P.slice(i, i + 9), .8, PAL.ink, 'ink', .2);
    for (let k = -4; k < 30; k++) {   // rocks and pines on the near slope
      const x = 300 + k * 230 + 80 * hash(k + 40); if (!inView(cam, x, 200)) continue;
      if (k % 3 === 0) rock(x, gy(x) + 120 + 60 * hash(k), 30 + 20 * hash(k + 3), 'g' + k);
      else if (k % 3 === 1) pine(x, gy(x) + 230, 200 + 60 * hash(k + 9), 'gp' + k);
    }
  }
  function gChar(n, i, t) {
    const x = xG(n, t), v = (xG(n, t + .02) - xG(n, t - .02)) / .04, mv = clamp(Math.abs(v) / 45);
    const mood = emotions(t, GKEYS[n]), hd = heading(t, .25, GHEAD[n]), o = { ...mood, ...hd };
    const walk = x / 62 + BCH.CAST[n].ph, s = Math.sin(walk * TAU), fast = clamp((v - 200) / 200);
    if (mv > .02) o.walk = walk;
    o.dy = lerp(mood.dy || 0, -Math.abs(Math.sin(walk * TAU)) * lerp(.35, 1.3, fast), mv);
    o.aL = lerp(mood.aL ?? .2, lerp(.2, .9, fast) * s, mv); o.aR = lerp(mood.aR ?? .2, -lerp(.2, .9, fast) * s, mv);
    o.rot = lerp(mood.rot || 0, lerp(.1, .17, fast), mv);
    let y = gy(x);
    if (n === 'floatie' && t > FLOP && t < GO + .1) {                            // flopped on the path, sliding when pushed
      const a = t - FLOP; o.sq = (o.sq || 0) + .3 - .25 * Math.exp(-7 * a) * Math.cos(16 * a); o.walk = null; o.rot = .06; o.aL = -.6; o.aR = -.5;
    }
    if (n === 'floatie' && t >= GO) { const j = jump(t, GO + .15, GO + .55, 2.5); o.dy += j.dy; o.sq += j.sq; }
    if (n === 'spike' && t >= HOP0 && t < HOP1) { const j = jump(t, HOP0, HOP1, 2.4); o.dy = j.dy; o.sq = j.sq; o.walk = null; o.rot = 0; o.aL = .9; }
    if (n === 'spike' && t >= PUSH0 - .1 && t < PUSH1 + .2) {                     // the push: arm straight out on Floatie's back
      const k = seg(t, PUSH0 - .1, PUSH0 + .05) * (1 - seg(t, PUSH1, PUSH1 + .2)); o.aL = lerp(o.aL, .05, k); o.rot = lerp(o.rot, .15, k); o.sq += .04 * k * Math.sin(t * TAU * 2);
    }
    if (n === 'clawd' && t > 76.2 && t < 78.2) { const g = gullAt(t); if (!o.squint) o.eyes = 'wide'; o.lookX = clamp((g[0] - toScreen(x, y)[0]) / 500, -1, 1); o.lookY = -1; }
    if ((n === 'shades' || n === 'spike' || n === 'floatie') && t > 77.2 && t < 78.2) { o.lookY = -.9; o.lookX = clamp((gullAt(t)[0] - toScreen(x, y)[0]) / 500, -1, 1); }
    if (n === 'clawd' && t > 74.4 && t < 76.2) o.aR = 1.1 + .45 * Math.sin((t - 74.4) * TAU * 2);   // cheering them on
    if (t > LEAP[n] - .2) { const j = jump(t, LEAP[n], LEAP[n] + .7, 4); o.dy += j.dy; o.sq += j.sq; if (t > LEAP[n]) { o.aL = 1.1; o.walk = null; } }
    buddy(n, x, y, GU, { ...o, ukeBack: n === 'clawd' && (o.view === 'side' || o.view === 'q'), ...carry(n, o) });
  }
  function shotG(t, lt, dur) {
    const cam = gCam(t);
    gBack(t, cam);
    camBegin(cam.cx, cam.cy, cam.z);
    gGround(t, cam);
    for (const n of ['spike', 'floatie', 'shades', 'clawd']) gChar(n, NAMES.indexOf(n), t);
    const pa = t - FLOP;
    if (pa > 0 && pa < .7) { const fx = xFl(t), fy = gy(fx); boilSeed('flopdust'); for (let k = 0; k < 5; k++) { const dx = (k - 2) * 50 * (1 + pa * 2), r = (18 + 10 * hash(k)) * (1 + pa); paint(ellPts(fx + dx, fy - 8 - 30 * pa * hash(k + 3), r, r * .6, 12), { wash: '#E5DCC0', washOp: 230 * (1 - pa / .7), ink: null }); } }
    for (let k = 0; k < 16; k++) {   // foreground ferns
      const x = 150 + k * 260 + 60 * hash(k + 70); if (!inView(cam, x, 200)) continue;
      boilSeed('gfg' + k); const y = gy(x) + 330;
      for (let j = -2; j <= 2; j++) inkLine([[x, y], [x + j * 30 + 8 * wob(t, .4, k), y - 90 - 20 * hash(k + j)]], 2.2, '#4E7A55', 'dry', .5);
    }
    camEnd();
    if (t > GULL0 && t < GULL1) { const [gx, gyy] = gullAt(t); BCH.gull(gx, gyy, 120, t * 1.1, 'g'); }
    if (lt < .3) brushWipe(.5 + lt / .6, GREEN);
  }

  // =====================================================================================================
  // H · the summit: the sea!
  // =====================================================================================================
  const HB = { shades: 500, floatie: 790, spike: 1080, clawd: 1370 }, HG = 900, HU = 22, HX = 1650;
  const HLAND = { clawd: 82.36, spike: 82.41, floatie: 82.46, shades: 82.51 };
  const HTURN = { clawd: 84.2, spike: 84.36, floatie: 84.52, shades: 84.68 };
  const HRUN = { floatie: 86.15, clawd: 86.3, spike: 86.4, shades: 86.5 };
  const ROLL = 86.33;
  const gH = x => x < HX ? HG : HG + (x - HX) * .55;
  const HKEYS = {};
  NAMES.forEach(n => { HKEYS[n] = [[82, 'excited'], [HTURN[n] + .22, 'starstruck'], [HRUN[n] + .05, 'excited']]; });
  function hCam(t) {
    const z = kf(t, [[82.135, 1.1], [83.4, 1], [84.3, 1], [86.1, 1.1], [87.9, 1]], easeOut);
    const k = ease(seg(t, 86.5, 88.2));
    return { cx: lerp(960, 1900, k) + 8 * wob(t, .2), cy: lerp(560, 1000, k), z };
  }
  const shoreY = x => 720 - 60 * Math.sin(clamp((x + 300) / 2900) * Math.PI) * -.4 - 40 * Math.sin(clamp((x + 300) / 2900) * Math.PI);
  function hBack(t, cam) {
    BCH.skyGrad('#5FB9E4', '#E6F6F2', 'hsky', 7, -60, 440);
    layer(cam, .06, () => {
      BCH.sun(1640, 140, 55, t, null, { key: 'h', glowR: 3 });
      BCH.cloud(420, 160, 150, PAL.cream, 0, 'h1', { sw: .6 }); BCH.cloud(1060, 250, 100, PAL.cream, 0, 'h2', { sw: .6, ph: 2 });
      for (let i = 0; i < 2; i++) { const a = t * .6 + i * 2.6; BCH.gull(1150 + 240 * Math.cos(a) + i * 220, 300 + 50 * Math.sin(a * 1.3), 34, t * 1.4 + i * .3, 'h' + i); }
    });
    layer(cam, .2, () => {
      BCH.sea(t, -600, 3000, 430, 1400, 'hsea', ['#8FE0D6', '#2FAFB6', '#237E9C']);
      boilSeed('hisle');
      paint([[-500, 432], [-330, 380], [-120, 362], [80, 395], [230, 432]], { wash: '#6FA56A', fill: '#4E7F52', fillOp: 70, tex: .5, ink: PAL.ink, sw: .6, curv: .3 });
      paint([[2150, 432], [2300, 405], [2450, 412], [2560, 432]], { wash: '#7FA9A0', ink: PAL.ink, sw: .5, curv: .3 });
      for (let i = 0; i < 7; i++) {   // the sea sparkles on the drop, then keeps twinkling
        const t0 = T_H + i * .08, x = 280 + i * 250 + 60 * hash(i + 5), y = 470 + 150 * hash(i + 9);
        BCH.sparkle(x, y, 34 + 14 * hash(i), t < t0 + 1.2 ? seg(t, t0, t0 + .7) : frac((t - t0 - 1.2) / 1.4 + hash(i)) * 1.1);
      }
    });
    layer(cam, .4, () => {   // the crescent beach and the green coast far below
      boilSeed('hbeach');
      const E = []; for (let i = 0; i <= 20; i++) { const x = lerp(-600, 3300, i / 20); E.push([x, shoreY(x)]); }
      paint(E.concat([[3300, 1800], [-600, 1800]]), { wash: C.sand, fill: C.sandDk, fillOp: 50, bleed: .1, tex: .6, ink: null });
      const lap = 8 * Math.sin(bpOf(t) / 4 * TAU);
      for (let i = 0; i + 1 < E.length; i += 4) { boilSeed('hfoam' + i); paint(ribbon(E.slice(i, i + 5).map(([x, y]) => [x, y - 3 + lap]), 7, 7), { wash: PAL.foam, washOp: 230, ink: null }); }
      const G = []; for (let i = 0; i <= 20; i++) { const x = lerp(-600, 3300, i / 20); G.push([x, shoreY(x) + 90 + 30 * Math.sin(i * 1.3)]); }
      paint(G.concat([[3300, 1800], [-600, 1800]]), { wash: '#86BC5E', fill: '#5F9A4C', fillOp: 70, bleed: .1, tex: .6, ink: PAL.ink, sw: .6, curv: .3 });
      for (let i = 0; i < 9; i++) { const x = -300 + i * 380 + 80 * hash(i + 2); BCH.palm(x, shoreY(x) + 70, 60 + 14 * hash(i), Math.sin(t * 1.3 + i), 'hb' + i, .22 * (i % 2 ? 1 : -1)); }
      for (let i = 0; i < 8; i++) { const x = -200 + i * 420 + 100 * hash(i + 30); tree(x, shoreY(x) + 150 + 60 * hash(i + 31), 60, 'hc' + i, '#6FA54E'); }
    });
  }
  function hGround(t, cam) {
    boilSeed('hground');
    const P = [[-700, HG + 20]];
    for (let x = -600; x <= HX; x += 150) P.push([x, HG + 8 * Math.sin(x * .01)]);
    for (let x = HX + 200; x <= 3600; x += 200) P.push([x, gH(x) + 15 * Math.sin(x * .02)]);
    paint(P.concat([[3600, 2800], [-700, 2800]]), { wash: '#7FB04F', fill: '#5E8F43', fillOp: 80, bleed: .1, tex: .6, ink: null });
    paint(P.map(([x, y]) => [x, y + 2]).concat(P.slice().reverse().map(([x, y]) => [x, y + 26])), { fill: '#B9D98A', fillOp: 120, bleed: .1, tex: .5, ink: null });   // the sunlit lip
    for (let i = 0; i + 1 < P.length; i += 5) inkLine(P.slice(i, i + 6), 1, PAL.ink, 'ink', .3);
    rock(200, HG + 50, 60, 'h1'); rock(1900, gH(1900) + 70, 50, 'h2'); rock(2700, gH(2700) + 100, 70, 'h3');
    for (let k = 0; k < 20; k++) {   // flowers on the summit
      const x = -300 + k * 190 + 60 * hash(k), y = gH(x) + 50 + 140 * hash(k + 4); if (!inView(cam, x, 100)) continue;
      boilSeed('hfl' + k); paint(starPts(x, y, 11, .5, 5, k), { wash: ['#FFF1D6', '#F2C14E', '#E27A92'][k % 3], ink: PAL.ink, sw: .4 });
    }
  }
  function hChar(n, i, t) {
    const mood = emotions(t, HKEYS[n]), hd = heading(t, .5, [[HTURN[n], 0], [HRUN[n], .25]]), o = { ...mood, ...hd };
    let x = HB[n];
    if (t < HLAND[n]) { const k = seg(t, T_H, HLAND[n]); o.dy = -4 * (1 - k * k); o.aL = o.aR = 1.3; o.sq = -.08; }
    else { const a = t - HLAND[n]; o.sq = (o.sq || 0) + .22 * Math.exp(-8 * a) * Math.cos((18 + i * 1.5) * a); }
    if (t < HTURN[n] + .3 && t > HLAND[n]) { o.aL = 1.2 + .35 * Math.sin((t + i * .2) * TAU * 2); o.aR = 1.2 - .35 * Math.sin((t + i * .3) * TAU * 2.1); }
    if (n === 'floatie' && t > HRUN[n]) {                                          // tucks into the ring and rolls
      const d = dist(t, [[ROLL, 0], [ROLL + .35, 1000]]), xr = x + d, ang = d / (4.3 * HU);
      const crouch = seg(t, HRUN[n], ROLL);
      if (t < ROLL) { o.sq = .25 * crouch; buddy(n, x, gH(x), HU, { ...o, view: 'side', flip: false }); return; }
      const cy = gH(xr) - 4.3 * HU;
      push(); translate(xr, cy); rotate(ang);
      buddy(n, 0, 4.3 * HU, HU, { ...o, view: 'side', flip: false, noShadow: true, walk: null, aL: -.8, eyes: 'squeeze', mouth: 'open', sq: .08 });
      pop();
      boilSeed('rolldust'); for (let k = 1; k < 4; k++) paint(ellPts(xr - k * 60, gH(xr - k * 60) - 10, 22 - k * 4, 12 - k * 2, 10), { wash: '#E5D9B8', washOp: 200 - k * 50, ink: null });
      return;
    }
    if (t > HRUN[n] + .1) {
      const d = dist(t, [[HRUN[n] + .1, 0], [HRUN[n] + .5, 460]]), walk = d / 80 + BCH.CAST[n].ph, s = Math.sin(walk * TAU);
      x += d; o.walk = walk; o.dy = -Math.abs(Math.sin(walk * TAU)) * 1.2; o.aL = .9 * s; o.aR = -.9 * s; o.rot = x > 1450 ? .1 : -.08;
    }
    buddy(n, x, gH(x), HU, { ...o, ukeBack: n === 'clawd' && (o.view === 'side' || o.view === 'q'), ...carry(n, o) });
    if (o.view === 'front' && t < HRUN[n]) for (let k = 0; k < 3; k++) {   // starstruck twinkles round the head
      const age = t - HTURN[n] - .3 - k * .35; if (age < 0) continue;
      boilSeed('tw' + n + k); BCH.sparkle(x + (k - 1) * 5.5 * HU, gH(x) - 10.5 * HU + 25 * Math.sin(k * 2 + i), 22, frac(age / 1.1));
    }
  }
  function shotH(t, lt, dur) {
    const cam = hCam(t);
    hBack(t, cam);
    camBegin(cam.cx, cam.cy, cam.z);
    hGround(t, cam);
    const order = t > ROLL ? ['shades', 'spike', 'clawd', 'floatie'] : ['shades', 'floatie', 'spike', 'clawd'];
    for (const n of order) hChar(n, NAMES.indexOf(n), t);
    camEnd();
    if (lt < .1) flash(.35 * (1 - lt / .1), '#FFFBEA');                         // the drop: a burst of light
    BCH.whip(seg(lt, dur - .25, dur), 'v');
  }

  shots([[T_F, shotF], [T_G, shotG], [T_H, shotH]]);
})();
