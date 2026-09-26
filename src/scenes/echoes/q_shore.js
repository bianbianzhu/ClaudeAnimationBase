// echoes/q_shore.js: shots Q and R of "Echoes of Myself" (see STORYBOARD_echoes.md), 236.34 → 272.8 (the end).
//
// Staging: a low camera at the water's edge on a mirror-still dawn sea. The horizon IS the line (y = 540 on screen,
// the camera always zooms about it): sky above, the same sky reflected below; Clawd (merged, unmasked) walks ON the
// line and its reflection (Echo colours) walks under it in perfect sync, feet to feet.
//   Q 236.34–252.07 "the shore" (bars 120–128)
//     236.34  P|Q contract: whipSmear 1 → 0 over .35 s as the whipping camera settles on the end of the street (the last
//             buildings on the left) and the open sea. Clawd + three unmasked friends walk right onto the shore.
//     239.78  Clawd stops (friends stop a beat apart). The horizon glows centre-right, where the door stood.
//     240.27  the sun breaks the line at x 1340 and rises; its reflection rises below. Friends: small takes; one points.
//     240.76  Clawd: hopeful.   244.2 turn to 3/4 + camera push-in; 244.69 love, eyes shining (hearts).
//     248.14  Clawd turns to camera; 248.63 smiles. 249.6 the rays grow; 250.3 → 252.07 light floods (warm flash → 1).
//   R 252.07–272.8 "the line again" (bars 128–end)
//     252.07  the flood fades off (flash 1 → 0) on a wide: Clawd walks right along the waterline, reflection in sync, the
//             sun high on the right, friends wave goodbye behind, three birds of light cross the sky.
//     259.94  the camera pulls wider; dark eyelids (screen space, a lens-shaped opening) start to close top and bottom.
//     262.4   Clawd stops; 262.89 turns to camera (reflection turns with it); 263.38 → 264.86 push-in on the pair.
//     265.35  the reflection alone winks (one eye shut, grin, spark) for a beat and a half; Clawd does not.
//     266.34 → 269.29  the lids close onto the gold horizon: a thin gold line on black.
//     269.8 → 272.4  the line un-draws left → right and fades with the last note; the last frames are black.
(() => {
  const C = ECH.C, bt = ECH.bt, S = ECH.S;
  const LY = 540, BLACK = '#101018', FLOOD = '#FFF1D8';

  // ---------- the dawn sea (screen space; the line is always at y = LY) ----------
  function bands(y0, y1, c0, c1, n, key) {
    for (let i = 0; i < n; i++) {
      const a = lerp(y0, y1, i / n), c = mixCol(c0, c1, i / (n - 1)), ya = Math.min(a, y1), yb = Math.max(a, y1);
      boilSeed(key + i);
      paint(rectPts(-80, ya, W + 160, yb - ya), { wash: c, ink: null });
      if (i) paint(rectPts(-80, a - 34, W + 160, 68), { fill: c, fillOp: 80, bleed: .3, tex: .3, border: .2, ink: null });
    }
  }
  const skyTop = w => mixCol(C.dawnTop, '#F2A47E', w * .7), skyBot = w => mixCol(C.dawnBot, '#FFE09A', w);
  function skySea(w, key) {
    const top = skyTop(w), bot = skyBot(w);
    bands(-80, LY, top, bot, 6, key + 'sky');
    bands(H + 80, LY, mixCol(top, C.seaDk, .6), mixCol(bot, C.sea, .3), 5, key + 'sea');
  }
  // long thin dawn clouds with lit undersides (draw once as is, once inside mirror for the reflection)
  const CL = [[330, 150, 300, 24], [1560, 96, 380, 28], [860, 290, 230, 15], [1770, 350, 170, 11], [110, 405, 160, 10]];
  function clouds(t, w, key) {
    CL.forEach(([x, y, rx, ry], i) => {
      const xx = x + (t - S.Q) * (3 + 3 * hash(i + 4));
      boilSeed(key + 'cl' + i);
      paint(ellPts(xx, y, rx, ry, 20, 3), { fill: mixCol('#E592A0', '#EE9E86', w), fillOp: 150, bleed: .25, tex: .5, border: .4, ink: null });
      paint(ellPts(xx + rx * .12, y + ry * .4, rx * .78, ry * .38, 16, 2), { wash: mixCol('#FFE2C4', C.goldLt, w), washOp: 170, ink: null });
    });
  }
  // The sun, centre (x, cy), radius r, clipped to above the line (inside mirror() it comes out as the reflection).
  function sun(x, cy, r, t, o = {}) {
    if (cy - r >= LY - 1) return;
    const k = o.k ?? 1, fl = o.flood || 0, gy = Math.min(cy, LY - 2), cl = P => P.map(([a, b]) => [a, Math.min(b, LY)]);
    glow(x, gy, r * (4 + 7 * fl), C.gold, (o.refl ? .45 : .8) * k);
    glow(x, gy, r * (1.9 + 2 * fl), C.emberCore, (o.refl ? .5 : .9) * k);
    const rays = o.rays || 0;
    if (rays > .01) for (let i = 0; i < 16; i++) {
      const a = i / 16 * TAU + (t - S.Q) * .04, dx = Math.cos(a), dy = Math.sin(a);
      let s0 = r * 1.25, s1 = r * (1.75 + .55 * hash(i * 3.1) + (i % 2 ? .3 * pulse(t, 3) : 0) + 1.6 * fl) * (.4 + .6 * rays);
      if (Math.abs(dy) < 1e-3) { if (cy > LY - 6) continue; } else { const sl = (LY - 6 - cy) / dy; if (dy < 0) s0 = Math.max(s0, sl); else s1 = Math.min(s1, sl); }
      if (s1 - s0 < 10) continue;
      boilSeed((o.key || '') + 'ray' + i);
      const P = [[x + dx * s0, cy + dy * s0], [x + dx * (s0 + s1) / 2, cy + dy * (s0 + s1) / 2], [x + dx * s1, cy + dy * s1]];
      paint(ribbon(P, r * (i % 2 ? .13 : .2), r * .03), { wash: i % 2 ? C.goldLt : C.gold, washOp: 200 * k * rays, ink: null });
    }
    boilSeed((o.key || '') + 'disc');
    paint(cl(ellPts(x, cy, r * 1.16, r * 1.16, 36)), { fill: '#FFD27A', fillOp: 120 * k, bleed: .2, tex: .3, ink: null });
    paint(cl(ellPts(x, cy, r, r, 36, 1)), { wash: '#FFC75E', washOp: 255 * k, fill: '#FF9A48', fillOp: 70, bleed: .08, tex: .4, ink: '#D97A3A', sw: .8 });
    paint(cl(ellPts(x - r * .1, cy - r * .1, r * .68, r * .68, 24)), { wash: '#FFE49A', washOp: 230 * k, ink: null });
    paint(cl(ellPts(x - r * .22, cy - r * .22, r * .34, r * .34, 16)), { wash: '#FFF8DE', washOp: 220 * k, ink: null });
  }
  // The sun's broken path of light on the water (screen space, under the characters).
  function glitter(t, x, r, k, key) {
    if (k <= .01) return;
    const f = Math.floor(t * 6);
    for (let i = 0; i < 16; i++) {
      const d = i / 15, y = LY + 10 + 330 * d * d, w = r * lerp(.25, 1.3, d) * (.5 + .5 * hash(i + 2)), tw = .4 + .6 * hash(i * 1.3 + f * .77);
      const xx = x + (hash(i * 7.1 + f * .31) - .5) * r * lerp(.6, 2.6, d);
      boilSeed(key + 'gl' + i);
      inkLine([[xx - w / 2, y], [xx, y + 1.5], [xx + w / 2, y]], (1 + 2.4 * d) * tw * k, i % 3 ? '#FFB34E' : '#FFF1C0', 'inkfine', .4);
    }
  }
  // Ripple dashes that slide with parallax (near water faster), so a tracking camera reads as moving over the sea.
  function waterMarks(t, cam, key, n = 32) {
    const Pd = 3400;
    for (let i = 0; i < n; i++) {
      const d = Math.pow(hash(i * 3.7 + 1), 1.3), par = lerp(.25, 1.1, d), zE = 1 + (cam.z - 1) * par;
      const dy = (16 + (H - LY) * .95 * d) * zE; if (dy > H - LY + 30) continue;
      const rel = hash(i * 5.1 + 2) * Pd + 25 * Math.sin(t * .8 + i) - cam.cx * par, m = ((rel % Pd) + Pd) % Pd - Pd / 2;
      const sx = 960 + m * zE, w = (24 + 110 * d * (.5 + hash(i + 8))) * zE;
      if (sx < -300 || sx > W + 300) continue;
      boilSeed(key + 'wm' + i);
      inkLine([[sx - w, LY + dy], [sx, LY + dy + 1.5], [sx + w, LY + dy]], .45 + .7 * d, mixCol(PAL.cream, C.goldLt, .3), 'inkfine', .5);
    }
  }
  // The film's eyelid (shot A opened the film with it): dark lids with a lens-shaped opening, hc = half-height at the centre.
  function lids(hc, key) {
    const Rx = 1150, N = 40, top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const x = lerp(-70, W + 70, i / N), h = Math.max(0, hc * (1 - Math.pow((x - 960) / Rx, 2)));
      top.push([x, Math.max(-70, LY - h)]); bot.push([x, Math.min(H + 70, LY + h)]);
    }
    if (top.every(p => p[1] <= -70)) return;
    boilSeed(key + 'lidT');
    paint([[-90, -90], [W + 90, -90]].concat(top.slice().reverse()), { wash: BLACK, fill: '#1E1A2A', fillOp: 70, tex: .5, bleed: .05, ink: null });
    boilSeed(key + 'lidB');
    paint([[W + 90, H + 90], [-90, H + 90]].concat(bot), { wash: BLACK, fill: '#1E1A2A', fillOp: 70, tex: .5, bleed: .05, ink: null });
    // a warm rim of light along each lid edge, strongest at the centre
    if (hc < 1400) {
      const rim = mixCol(BLACK, C.gold, .55 * (1 - hc / 1400));
      for (const E of [top, bot]) for (const half of [E.slice(0, 21), E.slice(20)]) {
        boilSeed(key + 'rim' + (E === top) + half[0][0]);
        inkLine(half.filter(p => p[1] > -60 && p[1] < H + 60), 1.1, rim, 'ink', .5);
      }
    }
  }

  // ---------- characters on the line ----------
  const noShadow = true;
  // The ember is drawn a little lower in the chest than ECH.masked puts it (-3u instead of -4.4u), so it doesn't cover
  // the mouth: the smile is this shot's payoff and the close-up must show it.
  const chest = key => (uu, sw) => ECH.ember(0, -3 * uu, uu * .52, T, .5, 'chest' + key);
  const merged = (pose, key) => ({ ...pose, ...ECH.MERGED_COL, tint: null, noMask: true, emberK: 0, noShadow, draw: chest(key) });
  const clawdAt = (x, u, pose, key) => ECH.masked(x, LY, u, { ...merged(pose, key), boilKey: key });
  // the reflection: same pose (perfect sync), same boil seeds, so it is Clawd's drawing, mirrored
  const echoAt = (x, u, pose, key) => ECH.mirror(LY, () => ECH.echo(x, LY, u, { ...pose, tint: null, noShadow, halo: 0, emberK: 0, draw: chest(key), boilKey: key }));
  const friend = (x, u, o) => ECH.passerby(x, LY, u, { noMask: true, umbrella: 0, eyes: 'happy', mouth: 'smile', flip: false, noShadow, ...o });
  // Clawd's pose on a beat-locked walk that stops with all four feet down, with an emotion track and drawn turns.
  function walker(t, x0, u, K, keys, turns, take = .8) {
    const w = ECH.walkOn(t, x0, u, K), sp = clamp(kf(t, K, x => x)), emo = emotions(t, keys, { take });
    const hd = ECH.heading(t, .25, turns, .28), side = hd.view === 'side';
    return { x: w.x, pose: { ...emo, ...hd, walk: side ? w.walk : null, dy: (emo.dy || 0) * (1 - .5 * sp) + w.dy,
      aL: lerp(emo.aL ?? .2, w.aL, sp), aR: lerp(emo.aR ?? .2, w.aR, sp) } };
  }
  // Walks end on a half step so walk ≡ .25 (mod .5): all four feet planted, legs spread, no snap when the legs stop.
  const walkLen = (u, K) => ECH.walkOn(K[K.length - 1][0] + 1, 0, u, K).x;

  // ================= Q · the shore =================
  const UQ = 24, XC = 1000, SXQ = 1340;
  const KQ = [[S.Q, 1], [bt(486), 1], [bt(487), 0]];
  const XQ0 = XC - walkLen(UQ, KQ);
  const QKEYS = [[S.Q - 1, 'happy'], [bt(489), 'hopeful', { lookX: .3 }], [bt(497), 'love', { eyes: 'shine', tint: null }],
    [bt(505), 'happy', { eyes: 'shine', mouth: 'smile', emote: null, tint: null }]];
  const QTURNS = [[bt(496), .125], [bt(504), 0]];
  const FQ = [
    { key: 'f1', col: 1, u: 21, xs: XC - 250, stop: bt(488), ph: .5, bob: .1, point: true, seed: 3 },
    { key: 'f2', col: 3, u: 17, xs: XC - 450, stop: bt(489), ph: 0, bob: .6, seed: 7 },
    { key: 'f3', col: 4, u: 19, xs: XC - 650, stop: bt(490), ph: .5, bob: .35, seed: 11 },
  ].map(f => { const K = [[S.Q, 1], [f.stop - BEAT, 1], [f.stop, 0]]; return { ...f, K, x0: f.xs - walkLen(f.u, K) }; });
  function friendQ(f, t, i) {
    const w = ECH.walkOn(t, f.x0, f.u, f.K), sp = clamp(kf(t, f.K, x => x)), bp = bpOf(t);
    const bob = -.4 * Math.abs(Math.sin((bp + f.bob) * Math.PI)) * (1 - sp), tk = take(t, bt(488.5) + .16 * i, .45);
    const point = f.point ? kf(t, [[bt(489.5), 0], [bt(490.5), 1], [bt(494), 1], [bt(495.5), 0]]) : 0;
    const idleA = .12 + .08 * Math.sin((bp + f.bob) * Math.PI);
    return { x: w.x, o: { key: f.key, col: f.col, seed: f.seed, walk: w.walk + f.ph, dy: w.dy + bob + tk.dy * .5, sq: tk.sq,
      aL: lerp(idleA, w.aL, sp) + point * 1.05, aR: .15, lookY: -.35 * (1 - sp) } };
  }
  function camQ(t, x) {
    const lt = t - S.Q, whip = -1000 * Math.pow(1 - seg(lt, 0, 1.5), 3);
    const push = ease(seg(t, bt(496), bt(503))), p2 = ease(seg(t, bt(504), S.R));
    return { cx: lerp(x + 260, XC + 230, push) + whip + 10 * Math.sin(lt * .45), cy: LY, z: 1 + .55 * push + .1 * p2 };
  }
  function shotQ(t, lt) {
    const warm = ease(seg(t, bt(484), bt(500)));
    const cl = walker(t, XQ0, UQ, KQ, QKEYS, QTURNS), cam = camQ(t, cl.x), zs = 1 + (cam.z - 1) * .25;
    const fr = FQ.map((f, i) => friendQ(f, t, i));
    // the sun: breaks the line on bar 122, clear of it by bar 124, then keeps climbing slowly; floods at the end
    const r = 90 * zs, rise = ease(seg(t, bt(488), bt(496))), cy = lerp(LY + r, LY - 1.3 * r, rise) - .25 * r * seg(t, bt(496), S.R);
    const flood = easeIn(seg(t, bt(507), S.R)), rays = ease(seg(t, bt(491), bt(495)));
    const sx = SXQ - (cam.cx - XC - 260) * .04;

    skySea(warm, 'q');
    const hk = .45 + .55 * seg(t, S.Q, bt(488));   // the horizon glows where the door of light stood
    boilSeed('qhz'); paint(ellPts(sx, LY, 640, 60 + 30 * rise, 26, 4), { fill: C.goldLt, fillOp: 150 * hk, bleed: .3, tex: .3, ink: null });
    glow(sx, LY, 520 + 200 * rise, C.gold, .55 * hk);
    clouds(t, warm, 'q'); ECH.mirror(LY, () => clouds(t, warm, 'qr'));
    ECH.mirror(LY, () => sun(sx, cy, r, t, { refl: true, rays, flood, key: 'qr' }));
    sun(sx, cy, r, t, { rays, flood, key: 'q' });
    // the end of the street: the last buildings of the city (far, parallax) and a lamp on the promenade, all reflected
    const city = () => ECH.skyline(-2600, 500, LY, { seed: 31, cam, p: .55, cols: ['#E6BCB6', '#DCB0AE'], lit: .08, litCol: C.amberLt, hMin: 200, hMax: 430, ink: null });
    ECH.layer(cam, .55, () => { ECH.mirror(LY, city); city(); });
    ECH.layer(cam, 1, () => {
      fr.forEach((f, i) => ECH.mirror(LY, () => friend(f.x, FQ[i].u, f.o)));
    });
    // the water over the reflections
    boilSeed('qwash'); paint(rectPts(-80, LY, W + 160, H - LY + 80), { wash: mixCol(skyBot(warm), C.sea, .5), washOp: 80, ink: null });
    glitter(t, sx, r, rise, 'q');
    waterMarks(t, cam, 'q');
    ECH.theLine(-40, W + 40, LY, .55 + .3 * rise, { key: 'qhz', glow: .18, glowR: 220 });
    ECH.layer(cam, 1, () => {
      echoAt(cl.x, UQ, cl.pose, 'clQ');
      fr.forEach((f, i) => friend(f.x, FQ[i].u, f.o));
      clawdAt(cl.x, UQ, cl.pose, 'clQ');
    });
    flash(flood, FLOOD);
    if (lt < .36) ECH.whipSmear(1 - ease(seg(lt, 0, .35)), t);
  }

  // ================= R · the line again =================
  const UR = 18, XR0 = 300, SXR = 1310;
  const KR = [[S.R, 1], [bt(532), 1], [bt(533), 0]];
  const XRS = XR0 + walkLen(UR, KR);
  const RKEYS = [[S.R - 1, 'happy'], [bt(535), 'happy', { eyes: 'shine', mouth: 'smile', emote: null }]];
  // the reflection's own track: the same, plus the wink (one eye shut, a grin, a spark), the one thing it does alone
  const EKEYS = RKEYS.concat([[bt(539), 'happy', { eyes: ['happy', 'shine'], mouth: 'grin', emote: 'spark' }],
    [bt(540.5), 'happy', { eyes: 'shine', mouth: 'smile', emote: 'spark' }]]);
  const RTURNS = [[bt(534), 0]];
  const FR = [
    { key: 'f1', col: 1, u: 14, x: XR0 - 210, ph: 0, wave: 1, seed: 3 },
    { key: 'f2', col: 3, u: 11.5, x: XR0 - 390, ph: .3, wave: 0, seed: 7 },
    { key: 'f3', col: 4, u: 13, x: XR0 - 560, ph: .55, wave: 1, seed: 11 },
  ];
  function friendR(f, t) {
    const bp = bpOf(t), ab = Math.abs(Math.sin((bp + f.ph) * Math.PI));
    const o = { key: f.key, col: f.col, seed: f.seed, view: 'front', dy: -.5 * ab, sq: .06 * pulse(t + f.ph * BEAT) };
    if (f.wave) Object.assign(o, { aR: 1.25 + .45 * Math.sin((bp + f.ph) * TAU), aL: .1 + .05 * Math.sin(bp * Math.PI) });
    else Object.assign(o, { aL: 1.2 + .25 * Math.sin((bp + f.ph) * TAU), aR: 1.2 - .25 * Math.sin((bp + f.ph) * TAU) });
    return o;
  }
  function camR(t, x) {
    const wide = ease(seg(t, ECH.bar(132), bt(535))), push = ease(seg(t, bt(535), bt(538))), p2 = seg(t, bt(538), bt(547));
    return { cx: lerp(700 + (x - XR0) * .6, XRS, push) + 8 * Math.sin((t - S.R) * .4) * (1 - push), cy: LY, z: lerp(1 - .2 * wide, 1.4, push) + .12 * p2 };
  }
  // lens half-height: open, then closing from bar 132, holding a band around the pair for the wink, then shut
  const lidH = t => t < ECH.bar(132) ? 3000 : t < bt(537) ? lerp(2300, 250, ease(seg(t, ECH.bar(132), bt(537))))
    : t < bt(541) ? lerp(250, 228, seg(t, bt(537), bt(541))) : lerp(228, 0, ease(seg(t, bt(541), bt(547))));
  function finalLine(t, hc) {
    const out = seg(t, bt(548), 272.4), k = clamp(1 - hc / 260) * (1 - ease(out));
    if (k <= .01) return;
    ECH.theLine(lerp(-40, W + 40, ease(out)), W + 40, LY, k, { key: 'end', glow: .3, glowR: 230, sw: 1.8 });
  }
  function shotR(t, lt) {
    const hc = lidH(t);
    if (hc < .5) { paint(rectPts(-60, -60, W + 120, H + 120), { wash: BLACK, ink: null }); finalLine(t, 0); return; }
    const cl = walker(t, XR0, UR, KR, RKEYS, RTURNS, .7), ec = walker(t, XR0, UR, KR, EKEYS, RTURNS, .7);
    const cam = camR(t, cl.x), zs = 1 + (cam.z - 1) * .2;
    const r = 86 * zs, cy = 300 - 10 * seg(t, S.R, bt(547)), sx = SXR - (cam.cx - 700) * .03;

    skySea(1, 'r');
    boilSeed('rhz'); paint(ellPts(sx, LY, 700, 70, 26, 4), { fill: C.goldLt, fillOp: 140, bleed: .3, tex: .3, ink: null });
    glow(sx, LY, 600, C.gold, .45);
    clouds(t, 1, 'r'); ECH.mirror(LY, () => clouds(t, 1, 'rr'));
    ECH.mirror(LY, () => sun(sx, cy, r, t, { refl: true, rays: 1, key: 'rr' }));
    sun(sx, cy, r, t, { rays: 1, key: 'r' });
    // three birds of light cross high up, heading the way Clawd walks
    const birds = refl => { for (let i = 0; i < 3; i++) {
      const k = seg(t, S.R + 1 + i * .7, S.R + 9 + i * .7); if (k <= 0 || k >= 1) continue;
      ECH.lightBird(lerp(-80, W + 80, k), 150 + 55 * i + 30 * Math.sin(k * 7 + i), 26 - 4 * i, bpOf(t) + i * .3, refl ? .5 : 1, 'rb' + i + refl);
    } };
    ECH.mirror(LY, () => birds(1)); birds(0);
    const fo = FR.map(f => friendR(f, t));
    ECH.layer(cam, 1, () => FR.forEach((f, i) => ECH.mirror(LY, () => friend(f.x, f.u, fo[i]))));
    boilSeed('rwash'); paint(rectPts(-80, LY, W + 160, H - LY + 80), { wash: mixCol(skyBot(1), C.sea, .5), washOp: 80, ink: null });
    glitter(t, sx, r, 1, 'r');
    waterMarks(t, cam, 'r');
    ECH.theLine(-40, W + 40, LY, .85, { key: 'rhz', glow: .2, glowR: 220 });
    ECH.layer(cam, 1, () => {
      echoAt(ec.x, UR, ec.pose, 'clR');
      FR.forEach((f, i) => friend(f.x, f.u, fo[i]));
      clawdAt(cl.x, UR, cl.pose, 'clR');
    });
    if (lt < .85) flash(1 - ease(seg(lt, 0, .8)), FLOOD);
    lids(hc, 'r');
    finalLine(t, hc);
  }

  shots([[S.Q, shotQ], [S.R, shotR]]);
})();
