// echoes/common.js: shared cast, props and set pieces for "Echoes of Myself" (see STORYBOARD_echoes.md).
// Music: 122 BPM, first downbeat 0.27 s, bar = 1.9672 s. Every shot file is an IIFE that reads what it needs from ECH.
//
// Conventions used by every shot:
//   - Clawd always travels left → right; the masked crowd walks right → left.
//   - "The line" is a horizontal line at y = LY (world px). Reality is above it; Echo (the reflection / inner self) is
//     drawn mirrored below it with ECH.mirror(LY, () => ...). Inside mirror(), draw exactly as if above the line:
//     feet on LY, body going up. It comes out upside-down underneath.
//   - Poses are functions of time, so Echo can lag: pose(t - lag). That is the whole "out of sync" device.
const ECH = (() => {
  const bt = n => OFF + n * BEAT;                 // time of beat n
  const bar = k => OFF + k * 4 * BEAT;            // time of bar k

  // shot start times (bar lines), see the storyboard table
  const S = {
    A: 0, B: bar(6), C: bar(16), D: bar(20), E: bar(24), F: bar(32), G: bar(40), H: bar(48), I: bar(56), J: bar(64),
    K: bar(72), L: bar(80), M: bar(88), N: bar(96), O: bar(104), P: bar(112), Q: bar(120), R: bar(128), END: DUR,
  };

  // ---------- palette ----------
  const C = {
    // rainy night city
    nightTop: '#1C1E3E', nightBot: '#39406E', street: '#2E3358', streetLt: '#4A5186', wall: '#3A3F6A', wallDk: '#282C50',
    amber: '#F2B45A', amberLt: '#FFD58A', roseLight: '#E27A92', rain: '#9FB0DA',
    // inner world
    void: '#241B45', voidLt: '#3A2C66', violet: '#7B5CA8', star: '#FFF1CF', teal: '#4FB3AE',
    // Echo
    echo: '#7478CC', echoDk: '#474A96', echoLt: '#C0BBF2',
    // the merged Clawd
    mergedDk: '#7B5CA8', mergedLt: '#FFD9B0',
    // mask
    mask: '#FFF3DF', maskDk: '#E8D6BC', cheek: '#EF8EA8',
    // light
    gold: '#F4C95D', goldLt: '#FFE6A3', ember: '#FFB35C', emberCore: '#FFF0C2',
    // dusk field, fog, lake, hill, dawn
    field: '#8E9A5A', fieldDk: '#5E6E44', duskTop: '#6C6AA8', duskBot: '#F2B27A', fog: '#CFCAD8',
    lakeTop: '#1D2550', lakeBot: '#3A4C88', moon: '#F4EBD0', hillTop: '#9A8CC8', hillBot: '#F1C3B5', grass: '#6F7FA8',
    dawnTop: '#F3B8A6', dawnBot: '#FFE3B0', sea: '#F0A98E', seaDk: '#C67A7A',
  };
  // Crowd body colours: desaturated Clawd-kin.
  const CROWD = [
    { col: '#8C94A8', dk: '#5E6478', lt: '#B9C0D2' }, { col: '#A48DA0', dk: '#6E5A6C', lt: '#CBB7C8' },
    { col: '#7F93A8', dk: '#556478', lt: '#AFC0D2' }, { col: '#9A9A88', dk: '#68685A', lt: '#C4C4B2' },
    { col: '#A0869A', dk: '#6A566A', lt: '#C9B1C2' }, { col: '#8A9AA0', dk: '#5C6A70', lt: '#B8C6CC' },
  ];
  const UMB = ['#5C6690', '#7A5C82', '#4F6E80', '#6E6A5A', '#80586A', '#56607A'];
  const ECHO_COL = { col: C.echo, dk: C.echoDk, lt: C.echoLt };
  const MERGED_COL = { col: PAL.clay, dk: C.mergedDk, lt: C.mergedLt };

  // ---------- helpers ----------
  const lin = x => clamp(x);
  // Mirror everything drawn in fn about the horizontal line y = ly (reflections, Echo, the inner world).
  function mirror(ly, fn) { push(); translate(0, 2 * ly); scale(1, -1); fn(); pop(); }
  // A parallax layer: p = 0 stays on screen, p = 1 moves with the camera cam = { cx, cy, z, rot }.
  function layer(cam, p, fn) { camBegin(960 + (cam.cx - 960) * p, 540 + (cam.cy - 540) * p, 1 + (cam.z - 1) * p, (cam.rot || 0) * p); fn(); camEnd(); }
  const inView = (cam, x, m = 300, p = 1) => Math.abs(x - (960 + (cam.cx - 960) * p)) < W / 2 / (1 + (cam.z - 1) * p) + m;
  // Distance travelled under a piecewise-linear speed profile K = [[t, px/s], ...] (closed form, so frames stay pure).
  function dist(t, K) {
    let d = 0;
    for (let i = 0; i + 1 < K.length; i++) {
      const [t0, v0] = K[i], [t1, v1] = K[i + 1]; if (t <= t0) return d;
      const te = Math.min(t, t1), ve = lerp(v0, v1, (te - t0) / (t1 - t0)); d += (v0 + ve) / 2 * (te - t0);
    }
    const [tl, vl] = K[K.length - 1]; if (t > tl) d += vl * (t - tl);
    return d;
  }
  // Side-view walk locked to the beat: one step per beat, the feet never slide. x = x0 + distance walked.
  // K is a speed profile in "steps per beat" (0 = standing, 1 = walking, 2 = trotting), e.g. [[t0, 1], [t1, 1], [t1 + .3, 0]].
  // Returns { x, walk, view, dy, aL, aR } for clawd(); stride = 2u per step.
  function walkOn(t, x0, u, K) {
    const Ks = K.map(([tt, s]) => [tt, s / BEAT]), steps = dist(t, Ks), sp = kf(t, K, lin);
    const walk = steps / 2, bob = Math.abs(Math.sin(walk * TAU)) * clamp(sp);
    return { x: x0 + steps * 2 * u, walk, view: 'side', dy: -bob * .35, aL: .15 + .35 * Math.sin(walk * TAU) * clamp(sp), aR: .15, moving: sp > .05 };
  }
  // The heading helper: a0 at the start, then drawn turns [[t0, a1], ...] (each .25 s).
  function heading(t, a0, seq, dur = .25) {
    let a = a0, r = { ...spinView(a0), smear: 0 };
    for (const [ts, a1] of seq) { if (t < ts) break; r = turn(t, ts, ts + dur, a, a1); a = a1; }
    return r;
  }

  // ---------- the smile mask ----------
  // Draws the mask in Clawd's body-local space; call it from clawd()'s draw hook:  draw: (u, sw) => ECH.mask(u, sw, o)
  //   o.view:  the same view you gave clawd() (front, q, side, qback, back)
  //   o.lift:  0 = on the face, 1 = pushed up onto the top of the head (the eyes show underneath)
  //   o.crack: 0..1 a crack across the smile.   o.tilt: extra rotation (radians), e.g. while being taken off.
  //   o.off:   [dx, dy] in u, for taking it off by hand.   o.alpha: 0..1 fade.
  function mask(u, sw, o = {}) {
    const V = VIEWS[o.view || 'front'];
    const lift = o.lift || 0, a = o.alpha ?? 1;
    if (!V.face) {   // back views: the ribbon tied round the head
      if (lift > .5) return;
      const y = -6.2 * u;
      inkLine([[V.L * u, y], [0, y - .15 * u], [V.R * u, y]], sw * 1.1, C.maskDk, 'ink', .5);
      paint(ellPts(0, y, .5 * u, .32 * u, 10), { wash: C.maskDk, ink: PAL.ink, sw: sw * .5 });
      return;
    }
    const F = V.face;
    push(); translate(F.cx * u + (o.off ? o.off[0] * u : 0), -lift * 4.1 * u + (o.off ? o.off[1] * u : 0)); scale(F.fw, 1 - lift * .12);
    rotate((o.tilt || 0) - lift * .12);
    // the tie ribbon, running back from the mask's edge (hidden when lifted high)
    if (lift < .6 && !o.off) for (const sd of F.sides.length > 1 ? [] : [-1]) inkLine([[sd * 3.9 * u, -6 * u], [sd * 5.6 * u, -6.2 * u]], sw, C.maskDk, 'ink', .3);
    const P = [];
    for (let i = 0; i < 30; i++) { const t = i / 30 * TAU, sq = Math.pow(Math.abs(Math.cos(t)), .8) * Math.sign(Math.cos(t)); P.push([sq * 4.05 * u, -5.4 * u + Math.sin(t) * 2.3 * u * (Math.sin(t) > 0 ? 1.05 : 1)]); }
    paint(P, { wash: C.mask, washOp: 255 * a, fill: C.maskDk, fillOp: 50 * a, bleed: .05, tex: .5, ink: PAL.ink, sw: sw * .8, curv: .3 });
    if (a > .5) {
      // painted face: closed happy eye-arcs, rose cheeks, a wide smile
      for (const s of [-1, 1]) {
        inkLine([[s * 3.25 * u, -5.9 * u], [s * 2.5 * u, -6.75 * u], [s * 1.75 * u, -5.9 * u]], sw * 1.1, PAL.ink, 'ink', .8);
        paint(ellPts(s * 3.2 * u, -4.75 * u, .62 * u, .34 * u, 10), { wash: C.cheek, washOp: 170, ink: null });
      }
      const sm = [[-2.3 * u, -4.75 * u], [-1.2 * u, -3.85 * u], [0, -3.6 * u], [1.2 * u, -3.85 * u], [2.3 * u, -4.75 * u]];
      paint(sm.concat([[1.3 * u, -4.35 * u], [0, -4.15 * u], [-1.3 * u, -4.35 * u]]), { wash: '#8A3A4E', ink: PAL.ink, sw: sw * .7, curv: .5 });
      const k = clamp(o.crack || 0);
      if (k > 0) {   // a jagged crack from the top edge down through the smile
        const Cr = [[-.6, -8], [-.1, -7.1], [-.8, -6.3], [.3, -5.4], [-.3, -4.6], [.6, -3.7], [.2, -3.1]];
        const n = Math.max(2, Math.ceil(Cr.length * k));
        inkLine(Cr.slice(0, n).map(([x, y]) => [x * u, y * u]), sw * 1.2, PAL.ink, 'ink', 0);
        if (k > .6) inkLine([[-.8 * u, -6.3 * u], [-1.7 * u, -6.0 * u], [-2.1 * u, -5.4 * u]], sw * .8, PAL.ink, 'inkfine', 0);
      }
    }
    pop();
  }
  // The mask on its own (held in a hand, on the ground, blowing in the wind). (x, y) = its centre, s = u.
  function looseMask(x, y, s, rot = 0, o = {}) {
    boilSeed('loosemask' + (o.key || ''));
    push(); translate(x, y); rotate(rot); if (o.flip) scale(-1, 1); if (o.sx) scale(o.sx, 1); translate(0, 5.5 * s);
    mask(s, clamp(s / 15, .45, 2.4), { view: 'front', crack: o.crack, alpha: o.alpha });
    pop();
  }

  // ---------- the ember ----------
  // The little warm light: a glow and a painted flame that beats on the beat. k = 0..1 strength.
  function ember(x, y, s, t, k = 1, key = '') {
    if (k <= .01) return;
    const b = 1 + .18 * pulse(t, 5);
    glow(x, y, s * 5 * b * k, C.ember, .9 * k);
    glow(x, y, s * 2.2 * b, C.emberCore, .8 * k);
    boilSeed('ember' + key);
    const r = s * b * (.6 + .4 * k), fl = Math.sin(t * 9) * .12;
    paint([[x, y - r * 1.9], [x + r * (.75 + fl), y - r * .2], [x + r * .55, y + r * .6], [x, y + r * .85], [x - r * .55, y + r * .6], [x - r * (.75 - fl), y - r * .2]],
      { wash: C.ember, washOp: 255 * clamp(k * 1.5), fill: C.emberCore, fillOp: 120, bleed: .1, ink: null, curv: .5 });
    paint(ellPts(x, y + r * .15, r * .32, r * .45, 10), { wash: C.emberCore, washOp: 255 * clamp(k * 1.5), ink: null });
  }

  // ---------- characters ----------
  // Clawd wearing the mask. o = any clawd() options plus maskLift, maskCrack, maskTilt, maskOff, noMask.
  function masked(x, y, u, o = {}) {
    const d = o.draw;
    clawd(x, y, u, { ...o, draw: (uu, sw) => {
      if (o.emberK) ember(0, -4.4 * uu, uu * .55, T, o.emberK, 'chest' + (o.boilKey || ''));
      if (!o.noMask) mask(uu, sw, { view: o.view, lift: o.maskLift, crack: o.maskCrack, tilt: o.maskTilt, off: o.maskOff });
      if (d) d(uu, sw);
    } });
  }
  // Echo: Clawd's reflection, in inner-world colours. Draw it inside mirror() to put it under the line. It glows
  // softly so it separates from the dark inner world. o.masked puts the mask on it (shot C).
  function echo(x, y, u, o = {}) {
    if (o.halo !== 0) glow(x, y - 4 * u, u * 9, C.echoLt, (o.halo ?? .45));
    const e = { eyes: 'shine', ...o, ...ECHO_COL, tint: null };
    if (o.masked || o.emberK) masked(x, y, u, { ...e, noMask: !o.masked });
    else clawd(x, y, u, e);
  }
  // A masked passer-by under an umbrella. o: col (CROWD index), umb (colour), flip (true = walking left), walk,
  // maskLift, face (eyes when unmasked), seed, key.
  function passerby(x, y, u, o = {}) {
    const cc = CROWD[(o.col ?? 0) % CROWD.length], uc = o.umb || UMB[(o.col ?? 0) % UMB.length];
    const umbK = o.umbrella ?? 1;
    const opts = { view: o.view || 'side', flip: o.flip ?? true, walk: o.walk, dy: o.dy || 0, sq: o.sq || 0, rot: o.rot || 0,
      eyes: o.eyes || 'sad', mouth: o.mouth ?? null, lookX: o.lookX, lookY: o.lookY, squint: o.squint, seed: o.seed, gloom: o.gloom,
      aL: o.aL ?? (umbK > 0 ? 1.1 : .15), aR: o.aR ?? .15, boilKey: 'pb' + o.key, noShadow: o.noShadow, emote: o.emote, emoteK: o.emoteK, emoteAge: o.emoteAge, ...cc,
      draw: (uu, sw) => {
        if (!o.noMask) mask(uu, sw, { view: o.view || 'side', lift: o.maskLift, off: o.maskOff, tilt: o.maskTilt });
        if (umbK > 0) umbrellaLocal(uu, sw, uc, o.umbTilt || 0, o.key);
      } };
    clawd(x, y, u, opts);
  }
  // Umbrella in body-local space (held in the near arm, canopy over the head).
  function umbrellaLocal(u, sw, col, tilt = 0, key = '') {
    push(); translate(3.7 * u, -5.6 * u); rotate(tilt);
    inkLine([[0, 0], [0, -7.5 * u]], sw * 1.2, PAL.ink, 'ink', 0);
    inkLine([[0, 0], [0, .9 * u], [-.6 * u, 1.2 * u]], sw * 1.2, PAL.ink, 'ink', .6);
    const P = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([Math.cos(a) * 7 * u, -7 * u + Math.sin(a) * 3.4 * u]); }
    for (let i = 5; i >= 0; i--) { const x = lerp(-7, 7, i / 5) * u; P.push([x + .7 * u, -6.6 * u], [x, -7 * u]); }
    paint(P.slice(0, 17).concat([[7 * u, -7 * u], [3.5 * u, -6.5 * u], [0, -7 * u], [-3.5 * u, -6.5 * u], [-7 * u, -7 * u]]),
      { wash: col, fill: mixCol(col, PAL.ink, .35), fillOp: 70, bleed: .06, tex: .5, ink: PAL.ink, sw: sw * .8, curv: .15 });
    for (const x of [-3.5, 0, 3.5]) inkLine([[0, -10.4 * u], [x * u, -6.7 * u]], sw * .45, PAL.ink, 'inkfine', .3);
    pop();
  }

  // ---------- rain ----------
  // Screen-space rain streaks, a pure function of t. n streaks, len px, col, alpha, speed px/s, slant.
  function rain(t, o = {}) {
    const n = o.n ?? 70, len = o.len ?? 46, sp = o.speed ?? 1500, sl = o.slant ?? .18, col = o.col || C.rain;
    boilSeed('rain' + (o.key || ''));
    for (let i = 0; i < n; i++) {
      const x0 = hash(i * 1.37 + 3) * (W + 400) - 200, ph = hash(i * 2.91 + 7), y = frac(ph + t * sp / (H + 200) * (.8 + .4 * hash(i + 5))) * (H + 200) - 100;
      const x = x0 + (y + 100) * sl;
      inkLine([[x, y], [x + len * sl, y + len]], (o.sw ?? .5) * (.6 + .6 * hash(i + 9)), col, 'inkfine', 0);
    }
  }
  // Rain splashes on a surface at y (world), over x0..x1: little crowns that pop and fade, a pure function of t.
  function splashes(t, x0, x1, y, o = {}) {
    const n = o.n ?? 16, per = o.per ?? .55;
    for (let i = 0; i < n; i++) {
      const ph = hash(i * 4.1 + 2), cyc = Math.floor(t / per + ph), age = frac(t / per + ph) * per;
      if (age > .3) continue;
      const x = lerp(x0, x1, hash(i * 7.3 + cyc * 1.9)), k = age / .3;
      boilSeed('spl' + (o.key || '') + i);
      paint(ellPts(x, y + (o.dy ?? 0), 6 + 26 * k, 2 + 6 * k, 14), { ink: o.col || C.rain, sw: .5 * (1 - k) + .1, br: 'inkfine' });
    }
  }

  // ---------- city set pieces ----------
  // Layered sky from top to bottom colour, in screen space (draw before the camera).
  function skyGrad(top, bot, key = 'sky', n = 6, y0 = -60, y1 = H + 60) {
    boilSeed(key);
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: top, ink: null });
    for (let i = 1; i < n; i++) {
      const y = lerp(y0, y1, i / n), c = mixCol(top, bot, i / (n - 1));
      paint(rectPts(-80, y, W + 160, H + 200 - y), { wash: c, ink: null });
      paint(rectPts(-80, y - 40, W + 160, 80), { fill: c, fillOp: 90, bleed: .3, tex: .3, border: .2, ink: null });
    }
  }
  // A row of buildings along y = base (ground line), between x0 and x1. o.cols = [wall, dark], o.lit = window glow
  // chance, o.seed. Windows are small washes; lit ones get a glow if o.glow.
  function skyline(x0, x1, base, o = {}) {
    const cols = o.cols || [C.wall, C.wallDk], seed = o.seed || 0, lit = o.lit ?? .35, hMin = o.hMin ?? 260, hMax = o.hMax ?? 560;
    let x = x0, i = 0;
    while (x < x1) {
      const w = 170 + 170 * hash(seed + i * 3.3), h = hMin + (hMax - hMin) * hash(seed + i * 5.9 + 1), col = mixCol(cols[0], cols[1], hash(seed + i * 2.1));
      if (!o.cam || inView(o.cam, x + w / 2, w, o.p ?? 1)) {
        boilSeed('bld' + seed + i);
        paint(rectPts(x, base - h, w - 8, h + 40, 3), { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 50, tex: .5, ink: o.ink === null ? null : PAL.ink, sw: .6 });
        if (o.windows !== false) {
          const cw = 34, ch = 46, nx = Math.floor((w - 40) / (cw + 22)), ny = Math.floor((h - 60) / (ch + 30));
          for (let a = 0; a < nx; a++) for (let b = 0; b < ny; b++) {
            const hv = hash(seed + i * 17 + a * 5 + b * 11), wx = x + 24 + a * (cw + 22), wy = base - h + 36 + b * (ch + 30);
            const on = hv < lit, c = on ? (o.litCol || C.amber) : mixCol(col, PAL.ink, .35);
            paint(rectPts(wx, wy, cw, ch), { wash: c, washOp: on ? 230 : 200, ink: null });
            if (on && o.glow) glow(wx + cw / 2, wy + ch / 2, 50, o.litCol || C.amber, o.glow);
          }
        }
      }
      x += w; i++;
    }
  }
  // A street lamp standing on (x, y), h tall, with a warm glow. k = light 0..1 (flicker it for tension).
  function lamp(x, y, h, k = 1, key = '') {
    boilSeed('lamp' + key);
    inkLine([[x, y], [x, y - h]], 2.2, '#1E1A2C', 'ink', 0);
    inkLine([[x, y - h], [x + 18, y - h - 16], [x + 44, y - h - 6]], 2, '#1E1A2C', 'ink', .6);
    if (k > .02) { glow(x + 44, y - h + 14, 230 * k, C.amber, k); glow(x + 44, y - h + 14, 80, C.amberLt, k); }
    paint([[x + 30, y - h - 6], [x + 58, y - h - 6], [x + 54, y - h + 14], [x + 34, y - h + 14]], { wash: k > .3 ? C.amberLt : '#6A6070', ink: PAL.ink, sw: .6 });
  }

  // ---------- the line and its light ----------
  // The line from x0 to x1 at y: a gold ink line with a soft glow. k 0..1 fades it; drawn in chunks (p5.brush quirk).
  function theLine(x0, x1, y, k = 1, o = {}) {
    if (k <= .01 || x1 - x0 < 2) return;
    const col = o.col || C.gold, sw = o.sw ?? 1.6;
    if (o.glow !== 0) for (let x = x0; x <= x1; x += 160) glow(Math.min(x, x1), y, (o.glowR ?? 90), col, (o.glow ?? .5) * k);
    boilSeed('line' + (o.key || ''));
    const step = 700;
    for (let a = x0; a < x1; a += step) {
      const b = Math.min(x1, a + step), P = [];
      for (let i = 0; i <= 6; i++) P.push([lerp(a, b, i / 6), y + jit(o.wob ?? 1.2)]);
      inkLine(P, sw * k, col, 'ink', .3);
    }
  }
  // Soft horizontal ripple dashes over a reflection (makes a surface read as water). Pure function of t.
  function ripples(t, x0, x1, y0, y1, o = {}) {
    const n = o.n ?? 24, col = o.col || PAL.cream;
    boilSeed('rip' + (o.key || ''));
    for (let i = 0; i < n; i++) {
      const y = lerp(y0, y1, Math.pow(hash(i * 3.7 + 1), 1.4)), x = lerp(x0, x1, hash(i * 5.1 + 2)) + 40 * Math.sin(t * .7 + i), w = 30 + 110 * hash(i + 8) * (.4 + (y - y0) / (y1 - y0 + 1));
      inkLine([[x - w, y], [x, y + 1.5], [x + w, y]], (o.sw ?? .5), col, 'inkfine', .5);
    }
  }
  // Expanding painted rings (a voice, an echo, a ripple) from (x, y). age s since it started; rings every gap s.
  function rings(x, y, age, o = {}) {
    const n = o.n ?? 3, gap = o.gap ?? .22, life = o.life ?? 1.6, sp = o.speed ?? 520, ry = o.ry ?? 1, col = o.col || PAL.cream;
    for (let i = 0; i < n; i++) {
      const a = age - i * gap; if (a < 0 || a > life) continue;
      const r = 20 + sp * easeOut(a / life) * (life / 1.2), k = 1 - a / life;
      boilSeed('ring' + (o.key || '') + i);
      paint(ellPts(x, y, r, r * ry, 36, 2), { ink: col, sw: (o.sw ?? 1.4) * k + .15, br: o.br || 'ink' });
    }
  }
  // The door of light: an arched doorway standing on the line at (x, y) (its sill on the line), h tall, open k 0..1.
  // It reflects under the line on its own when o.mirror is set.
  function door(x, y, h, k, t, o = {}) {
    if (k <= .01) return;
    const w = h * .42 * (o.open ?? 1) * ease(k), pul = 1 + .05 * pulse(t, 4);
    const arch = (yy, sgn) => { const P = [[x - w / 2, yy]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; P.push([x + Math.cos(a) * w / 2, yy - sgn * (h - w / 2) + sgn * Math.sin(a) * w / 2]); } P.push([x + w / 2, yy]); return P; };
    glow(x, y - h * .45, h * 1.1 * pul * k, C.gold, .8 * k);
    glow(x, y + h * .45, h * 1.0 * pul * k, C.violet, .5 * k);
    boilSeed('door' + (o.key || ''));
    if (w > 4) {
      paint(arch(y, 1), { wash: C.goldLt, washOp: 255 * k, fill: C.gold, fillOp: 90, bleed: .15, tex: .4, ink: PAL.ink, sw: .8 * k });
      if (o.mirror !== false) paint(arch(y, -1), { wash: mixCol(C.goldLt, C.echoLt, .5), washOp: 220 * k, fill: C.violet, fillOp: 60, bleed: .15, tex: .4, ink: PAL.ink, sw: .8 * k });
      glow(x, y - h * .4, h * .5, PAL.cream, .7 * k);
    }
  }
  // A glass shard: a jagged triangle centred on (x, y), s = size, rot, filled half with colA (reality) and half with
  // colB (the inner world), with a cream glint.
  function shard(x, y, s, rot, colA, colB, key = '') {
    boilSeed('shard' + key);
    push(); translate(x, y); rotate(rot);
    const a = hash(key.length + s) * .4;
    const P = [[-s, -s * (.3 + a)], [s * .9, -s * .6], [s * (.4 + a), s * .8]];
    paint(P, { wash: colA, fill: colB, fillOp: 150, bleed: .2, tex: .5, ink: PAL.ink, sw: .6 });
    inkLine([[-s * .5, -s * .3], [s * .2, -s * .45]], .6, PAL.cream, 'inkfine', 0);
    pop();
  }
  // A small bird of light (the released feelings): two swept wings and a body, s = half span, flap = phase (turns).
  function lightBird(x, y, s, flap, k = 1, key = '') {
    if (k <= .01) return;
    glow(x, y, s * 3, C.goldLt, .7 * k);
    boilSeed('bird' + key);
    const f = Math.sin(flap * TAU), tip = -s * .55 * f;
    for (const sd of [-1, 1]) paint(ribbon([[x, y], [x + sd * s * .5, y - s * .3 + s * .1 * f], [x + sd * s, y + tip]], s * .28, s * .05), { wash: C.goldLt, washOp: 255 * k, ink: PAL.ink, sw: .45 });
    paint(ellPts(x + s * .12, y + s * .05, s * .3, s * .12, 10), { wash: PAL.cream, washOp: 255 * k, ink: PAL.ink, sw: .4 });
  }
  // A drifting petal (wind), s = size.
  function petal(x, y, s, rot, col = PAL.rose, key = '') {
    boilSeed('petal' + key);
    push(); translate(x, y); rotate(rot);
    paint([[-s, 0], [0, -s * .45], [s, 0], [0, s * .4]], { wash: col, ink: PAL.ink, sw: .4, curv: .6 });
    pop();
  }
  // Wind streaks: long thin curls sweeping right. age drives them; n streaks over the frame (screen space).
  function windStreaks(t, o = {}) {
    const n = o.n ?? 10, col = o.col || PAL.cream, sp = o.speed ?? 900;
    for (let i = 0; i < n; i++) {
      const per = (W + 900) / sp, ph = hash(i * 2.3 + 4), x = frac(t / per + ph) * (W + 900) - 600, y = 120 + (H - 240) * hash(i * 6.1 + 1);
      boilSeed('wind' + (o.key || '') + i);
      const L = 260 + 200 * hash(i + 3), P = [];
      for (let k = 0; k <= 6; k++) P.push([x + L * k / 6, y + 16 * Math.sin(k * .9 + t * 3 + i)]);
      if (hash(i + 11) > .6) P.push([x + L + 30, y - 30], [x + L, y - 50], [x + L - 20, y - 26]);
      inkLine(P, o.sw ?? .7, col, 'inkfine', .6);
    }
  }
  // Paper cut-out silhouettes floating in the inner world. kind: house | moon | door | small | star.
  function cutout(kind, x, y, s, rot, col = C.voidLt, key = '') {
    boilSeed('cut' + kind + key);
    push(); translate(x, y); rotate(rot);
    const o = { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 60, tex: .6, ink: PAL.cream, sw: .6 };
    if (kind === 'house') paint([[-s, s], [-s, -s * .2], [0, -s], [s, -s * .2], [s, s]], o);
    else if (kind === 'moon') { const P = []; for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([Math.cos(a) * s, Math.sin(a) * s]); } for (let i = 16; i >= 0; i--) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([Math.cos(a) * s * .45, Math.sin(a) * s * .92]); } paint(P, o); }
    else if (kind === 'door') { paint(rectPts(-s * .5, -s, s, s * 2), o); paint(ellPts(s * .28, 0, s * .07, s * .07, 8), { wash: PAL.cream, ink: null }); }
    else if (kind === 'small') { paint(rectPts(-s * .8, -s * .7, s * 1.6, s), o); for (const lx of [-.6, -.25, .15, .5]) paint(rectPts(lx * s, s * .3, s * .18, s * .35), o); }
    else paint(starPts(0, 0, s, .45, 5), o);
    pop();
  }
  // The inner world backdrop (screen space or world, whatever is current): deep violet void with fixed stars.
  function innerSky(x0, y0, w, h, t, key = 'inner', o = {}) {
    boilSeed(key);
    paint(rectPts(x0, y0, w, h), { wash: o.col || C.void, ink: null });
    paint(ellPts(x0 + w * .5, y0 + h * .5, w * .45, h * .4, 24, 10), { fill: o.col2 || C.voidLt, fillOp: 90, bleed: .3, tex: .4, ink: null });
    const n = o.stars ?? 40;
    for (let i = 0; i < n; i++) {
      const sx = x0 + w * hash(i * 3.3 + 11), sy = y0 + h * hash(i * 7.7 + 5), tw = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      boilSeed(key + 'st' + i);
      paint(starPts(sx, sy, (3 + 5 * hash(i + 2)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: 150 + 100 * tw, ink: null });
    }
  }

  // ---------- the city street (shots B, E, P share it, so it is the same place at night and at dawn) ----------
  // One shopfront, index i, left edge x, on the ground line gy. dawn 0..1 shifts it to morning colours.
  const SHOP_W = 620;
  function shopfront(i, x, gy, dawn, o = {}) {
    const h = 520 + 90 * hash(i * 3.1 + 2), wallC = mixCol(mixCol(C.wall, '#4A3E66', hash(i * 1.7)), mixCol('#C9A0A0', '#D8B7A0', hash(i)), dawn * .8);
    const awn = mixCol([C.roseLight, '#5E8A8C', C.amber, '#8C6AA8', '#6A7FB0'][((i % 5) + 5) % 5], PAL.ink, .25 * (1 - dawn));
    boilSeed('shop' + i + (o.key || ''));
    paint(rectPts(x, gy - h, SHOP_W - 10, h + 10, 3), { wash: wallC, fill: mixCol(wallC, PAL.ink, .35), fillOp: 55, tex: .55, ink: PAL.ink, sw: .7 });
    // the big window with a warm interior
    const wx = x + 70, wy = gy - 330, ww = 330, wh = 250, lit = o.lit ?? (.55 + .45 * hash(i * 9.1)) * (1 - dawn * .6);
    paint(rectPts(wx, wy, ww, wh), { wash: mixCol(mixCol('#2A2440', C.amber, lit * .55), '#EBCDB4', dawn * .75), fill: C.amber, fillOp: 60 * lit, bleed: .2, tex: .4, ink: PAL.ink, sw: .9 });
    if (lit > .2 && o.glow !== false) glow(wx + ww / 2, wy + wh / 2, 240, C.amber, lit * .55 * (1 - dawn * .5));
    inkLine([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], .8, PAL.ink, 'ink', 0);
    // the awning (scalloped) and a door
    const A = [[wx - 30, wy - 70], [wx + ww + 30, wy - 70], [wx + ww + 50, wy - 18]];
    for (let k = 6; k >= 0; k--) A.push([wx - 50 + (ww + 100) * k / 6, wy - 18 + (k % 2 ? 14 : 0)]);
    paint(A, { wash: awn, fill: mixCol(awn, PAL.ink, .3), fillOp: 60, tex: .5, ink: PAL.ink, sw: .7 });
    paint(rectPts(x + 450, gy - 250, 110, 250), { wash: mixCol(wallC, PAL.ink, .45), ink: PAL.ink, sw: .7 });
    paint(ellPts(x + 540, gy - 125, 6, 6, 8), { wash: C.amberLt, ink: null });
    // upstairs windows
    for (let k = 0; k < 3; k++) {
      const on = hash(i * 13 + k) < .45 * (1 - dawn), c = on ? C.amber : mixCol(mixCol(wallC, PAL.ink, .4), '#E6C8B2', dawn * .6);
      paint(rectPts(x + 60 + k * 170, gy - h + 60, 90, 110), { wash: c, ink: PAL.ink, sw: .5 });
      if (on && o.glow !== false) glow(x + 105 + k * 170, gy - h + 115, 90, C.amber, .45);
    }
  }
  // The street for a camera cam = { cx, cy, z }. o: gy (ground line, world px, default 800), dawn 0..1, rain 0..1 (streaks),
  // reflect (default true: the wet pavement mirrors the shops, with ripples), shopFrom/shopTo (index range), lampEvery.
  // Draws the sky in screen space, the far skyline with parallax, then opens the main camera (cam) and LEAVES IT OPEN
  // so the shot can draw its characters in world space; the shot must call camEnd() itself.
  function street(cam, t, o = {}) {
    const gy = o.gy ?? 800, dawn = o.dawn || 0;
    skyGrad(mixCol(C.nightTop, C.dawnTop, dawn), mixCol(C.nightBot, C.dawnBot, dawn), 'streetsky' + (o.key || ''));
    if (dawn > .3) glow(W * .75, H * .55, 700, C.goldLt, (dawn - .3) * .6);
    layer(cam, .35, () => skyline(-1600, 9000, gy - 80, { seed: 7, cam, p: .35, cols: [mixCol('#2C3160', '#C8A3B4', dawn), mixCol('#232650', '#B994A8', dawn)], lit: .25 * (1 - dawn), hMin: 300, hMax: 640, ink: null }));
    camBegin(cam.cx, cam.cy, cam.z, cam.rot || 0);
    const vx0 = cam.cx - W / 2 / cam.z - SHOP_W, vx1 = cam.cx + W / 2 / cam.z + 50;
    const i0 = Math.max(o.shopFrom ?? -99, Math.floor(vx0 / SHOP_W)), i1 = Math.min(o.shopTo ?? 999, Math.floor(vx1 / SHOP_W));
    // pavement
    boilSeed('pave' + (o.key || ''));
    const pc = mixCol(C.street, '#B89A9E', dawn * .7);
    paint(rectPts(vx0 - 200, gy, vx1 - vx0 + 800, 900), { wash: pc, ink: null });
    if (o.reflect !== false) {
      mirror(gy, () => { for (let i = i0; i <= i1; i++) shopfront(i, i * SHOP_W, gy, dawn, { glow: false, key: 'r', lit: .3 }); });
      paint(rectPts(vx0 - 200, gy, vx1 - vx0 + 800, 900), { wash: pc, washOp: 150, ink: null });
      ripples(t, vx0, vx1, gy + 20, gy + 420, { key: 'street' + (o.key || ''), col: mixCol(C.rain, PAL.cream, dawn), n: 30 });
    }
    inkLine([[vx0, gy], [lerp(vx0, vx1, .5), gy + 1], [vx1 + 300, gy]], 1, PAL.ink, 'ink', 0);
    for (let i = i0; i <= i1; i++) shopfront(i, i * SHOP_W, gy, dawn, { key: o.key });
    const le = o.lampEvery ?? 3;
    for (let i = i0; i <= i1; i++) if (((i % le) + le) % le === 0) lamp(i * SHOP_W - 20, gy, 420, (o.lampK ?? 1) * (1 - dawn * .8), 'st' + i);
  }

  // ---------- the shop window (shots C and P: the same glass, at night and at dawn) ----------
  // A tall pane of glass standing on the ground line gy, left edge x, w × h. inside() draws the reflection (in world
  // space, same orientation, NOT mirrored; keep it inside the pane). dawn 0..1.
  function glassWindow(x, gy, w, h, t, dawn, inside) {
    boilSeed('glassframe');
    const wallC = mixCol('#3F3868', '#CFA9A6', dawn * .8);
    paint(rectPts(x - 90, gy - h - 150, w + 180, h + 160, 3), { wash: wallC, fill: mixCol(wallC, PAL.ink, .35), fillOp: 55, tex: .55, ink: PAL.ink, sw: .8 });
    boilSeed('glass');
    const gc = mixCol('#1F1D38', '#B9A7B8', dawn * .7);
    paint(rectPts(x, gy - h - 20, w, h, 1), { wash: gc, fill: mixCol(gc, C.amber, .4), fillOp: 70, bleed: .2, tex: .4, ink: null });
    // a faint interior: shelves and a hanging lamp, behind the glass
    for (let k = 0; k < 3; k++) { boilSeed('shelf' + k); paint(rectPts(x + 40, gy - h + 120 + k * 150, w - 80, 10), { wash: mixCol(gc, C.amber, .35), ink: null }); }
    glow(x + w * .7, gy - h + 60, 200, C.amber, .35 * (1 - dawn * .5));
    if (inside) inside();
    // glints on the glass, then the frame on top
    for (let k = 0; k < 3; k++) { boilSeed('glint' + k); const gx = x + w * (.15 + .3 * k); paint([[gx, gy - h - 10], [gx + 60 + 20 * k, gy - h - 10], [gx - 160 + 20 * k, gy - 30], [gx - 220, gy - 30]], { wash: PAL.cream, washOp: 28 + 10 * dawn, ink: null }); }
    boilSeed('glassedge');
    paint(rectPts(x, gy - h - 20, w, h, 1), { ink: PAL.ink, sw: 1.4 });
    paint(rectPts(x - 20, gy - 24, w + 40, 24), { wash: mixCol(wallC, PAL.ink, .4), ink: PAL.ink, sw: .8 });
  }

  // ---------- shared transitions (both sides of a seam call the same function, so the cut matches) ----------
  // splashWipe(p): the camera dives through the water (E → F). Pale water strokes rise from the bottom and cover the frame
  // (p 0 → .5), then carry on up and off the top (p .5 → 1). Cut at p = .5. Screen space, call last.
  function splashWipe(p, cols = ['#9FB0DA', '#E9E4F4']) {
    if (p <= 0 || p >= 1) return;
    const n = 6, bw = (W + 400) / n + 30;
    for (let i = 0; i < n; i++) {
      const x0 = -200 + i * (W + 400) / n, d = [0, .12, .05, .16, .08, .1][i];
      const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
      const yTop = p < .5 ? lerp(H + 300, -300, q) : -300, yBot = p < .5 ? H + 300 : lerp(H + 300, -300, q);
      if (yBot - yTop < 30) continue;
      boilSeed('splash' + i);
      const P = [];
      for (let k = 0; k <= 6; k++) P.push([x0 + bw * k / 6, yTop - 60 * Math.sin(k / 6 * Math.PI) + jit(6)]);
      for (let k = 6; k >= 0; k--) P.push([x0 + bw * k / 6, yBot + jit(6)]);
      paint(P, { wash: i % 2 ? cols[0] : cols[1], fill: i % 2 ? cols[1] : cols[0], fillOp: 70, bleed: .05, tex: .7, border: .5, ink: null,
        hatch: { d: 38, a: .08, o: { rand: .6, gradient: .4 }, b: 'charcoal', c: i % 2 ? PAL.cream : '#7F8FC0', w: .7 } });
    }
  }
  // fogVeil(k, t): full-frame fog (J → K). k 0..1 opacity; drifting wisps on top. At the J/K cut k = 1.
  function fogVeil(k, t, col = C.fog) {
    if (k <= .01) return;
    boilSeed('fogveil');
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: col, washOp: 255 * clamp(k), ink: null });
    for (let i = 0; i < 7; i++) {
      boilSeed('fogwisp' + i);
      const y = 80 + i * 150, x = ((t * (30 + 12 * i) + hash(i) * 2000) % (W + 1200)) - 600;
      paint(ellPts(x, y, 520 + 200 * hash(i + 3), 70 + 30 * hash(i + 5), 24, 8), { fill: mixCol(col, PAL.cream, .5), fillOp: 120 * clamp(k * 1.5), bleed: .3, tex: .3, ink: null });
    }
  }
  // petalWipe(p, t): a gust of petals (L → M). Lavender and rose strokes sweep in from the left (p 0 → .5) and off to the
  // right (p .5 → 1), with petals tumbling on top. Cut at p = .5.
  function petalWipe(p, t) {
    if (p <= 0 || p >= 1) return;
    brushWipe(p, ['#9A8CC8', '#E7A3B4']);
    for (let i = 0; i < 26; i++) {
      const k = p * 1.6 - hash(i * 3.3) * .5; if (k < 0 || k > 1.1) continue;
      const x = lerp(-200, W + 200, k) + 120 * Math.sin(i), y = 60 + (H - 120) * hash(i * 5.7 + 1) + 60 * Math.sin(k * 6 + i);
      petal(x, y, 16 + 10 * hash(i + 2), k * 9 + i, i % 3 ? '#F2B8C6' : PAL.cream, 'pw' + i);
    }
  }
  // whipSmear(k, t, cols): a whip pan's motion blur (P → Q). k 0..1: 1 = the frame fully smeared (cut there).
  function whipSmear(k, t, cols = [C.dawnTop, C.dawnBot, '#E9A08C']) {
    if (k <= .01) return;
    for (let i = 0; i < 14; i++) {
      boilSeed('whip' + i);
      const y = -40 + i * (H + 80) / 14, h = (H + 80) / 14 + 30, L = (W + 800) * clamp(k * (1.2 + .4 * hash(i))), x = -400 + (W + 800 - L) * hash(i + 7) * (1 - k);
      paint([[x, y], [x + L, y + 6], [x + L, y + h - 6], [x, y + h]], { wash: cols[i % cols.length], washOp: 255 * clamp(k * 1.4), ink: null });
      if (k < .95) inkLine([[x + L * .1, y + h / 2], [x + L * .9, y + h / 2 + 4]], .6, PAL.ink, 'inkfine', 0);
    }
  }

  return { glassWindow, splashWipe, fogVeil, petalWipe, whipSmear,
    bt, bar, S, C, CROWD, UMB, ECHO_COL, MERGED_COL, mirror, layer, inView, dist, walkOn, heading,
    mask, looseMask, ember, masked, echo, passerby, umbrellaLocal, rain, splashes, skyGrad, skyline, lamp,
    theLine, ripples, rings, door, shard, lightBird, petal, windStreaks, cutout, innerSky, street, shopfront, SHOP_W };
})();

// A test sheet of the cast: node render.mjs --loop=echoCast --sheet=0.5 --out=out/check/cast.jpg
LOOPS.echoCast = t => {
  const { C } = ECH;
  ECH.skyGrad(C.nightTop, C.nightBot, 'castsky');
  ECH.theLine(0, W, 640, 1);
  ECH.masked(260, 640, 22, { ...feel('neutral', t), view: 'front' });
  ECH.masked(560, 640, 22, { ...feel('neutral', t), view: 'q' });
  ECH.masked(820, 640, 22, { ...feel('neutral', t), view: 'side', maskCrack: 1 });
  ECH.masked(1080, 640, 22, { ...feel('sad', t), view: 'front', maskLift: 1 });
  ECH.passerby(1380, 640, 20, { col: 1, walk: t * 2, key: 'a' });
  ECH.passerby(1680, 640, 20, { col: 3, walk: t * 2 + .3, key: 'b', view: 'q', flip: true });
  ECH.mirror(640, () => { ECH.echo(260, 640, 22, { ...feel('sad', t), view: 'front' }); ECH.echo(820, 640, 22, { view: 'side', emberK: 1 }); });
  ECH.ember(1180, 900, 14, t, 1);
  ECH.door(1500, 1000, 200, 1, t, { mirror: false });
  ECH.lightBird(1750, 900, 40, t * 2, 1);
  ECH.shard(1850, 780, 50, .4, C.gold, C.violet, 'x');
  ECH.rings(1250, 250, frac(t / 1.5) * 1.5, { key: 'r' });
  ECH.lamp(100, 640, 320, 1);
  ECH.rain(t);
};
LOOPS.echoCast.len = 2;
// The street at night (t < 1) and at dawn (t >= 1): node render.mjs --loop=echoStreet --sheet=0.5,1.5 --out=out/check/street.jpg
LOOPS.echoStreet = t => {
  const dawn = t < 1 ? 0 : 1, u = 24, w = ECH.walkOn(t, 700, u, [[0, 1]]), cam = { cx: w.x + 200, cy: 540, z: 1 };
  ECH.street(cam, t, { dawn, gy: 820 });
  ECH.mirror(820, () => ECH.echo(w.x, 820, u, { ...w, halo: .3 }));
  ECH.passerby(w.x + 520, 820, 22, { col: 2, walk: t * 2, key: 'p1' });
  ECH.masked(w.x, 820, u, { ...w });
  camEnd();
  if (!dawn) ECH.rain(t);
};
LOOPS.echoStreet.len = 2;
// The shared transitions at their cut points and the glass: node render.mjs --loop=echoTrans --sheet=0.1,0.3,0.5,0.7,0.9,1.1 --out=out/check/trans.jpg
LOOPS.echoTrans = t => {
  const { C } = ECH;
  if (t < 1) {
    ECH.skyGrad(C.nightTop, C.nightBot, 'tsky');
    ECH.glassWindow(400, 900, 1100, 640, t, 0, () => ECH.masked(900, 860, 24, { view: 'front', eyes: 'sad', maskLift: 1, tintK: 0 }));
    const k = t * 4 % 4;
    if (k < 1) ECH.splashWipe(.3 + k * .4); else if (k < 2) ECH.fogVeil(.7, t); else if (k < 3) ECH.petalWipe(.2 + (k - 2) * .5, t); else ECH.whipSmear(.7, t);
  } else { ECH.skyGrad(C.dawnTop, C.dawnBot, 'tsky2'); ECH.glassWindow(400, 900, 1100, 640, t, 1, null); }
};
LOOPS.echoTrans.len = 1.2;
