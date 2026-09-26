// echoes/c_glass.js: "Echoes of Myself" shots C (the glass) and D (behind the eyes). See STORYBOARD_echoes.md.
//   C 31.75–39.61  In: cut on action from B (night street, cam cx 5200, masked Clawd walking right at x 5000, u 24).
//     31.75–33.7   The camera carries the move on and settles on the big shop window (ECH.glassWindow, left edge GX);
//                  Clawd's reflection (Echo, masked, u 22) walks out from behind the pier into the pane.
//     33.7–35.7    Clawd slows to a stop on the downbeat; the reflection takes one more step and stops a beat late.
//                  Clawd half-glances at the glass; the reflection copies the glance a beat late.
//     35.7–37.6    Clawd turns to the glass (back view); the reflection turns to face us a beat later. Suspicious sway,
//                  copied late.
//     37.6–39.61   The reflection flicks its mask up onto its head: sad, searching shining eyes. Clawd: big take ('!'),
//                  both arms up to its own (still tied) mask. The camera pushes toward the reflection's eye.
//   D 39.61–47.48  In: the push carries on into the reflection's right eye (lamp glints in it).
//     39.61–41.6   Push in; the pupil dilates and opens into the inner world.
//     41.6–44.5    Deep violet void, floating paper cut-outs (house, moon, door, small Clawd), the ember beating.
//     44.5–46.6    The ember flickers; a cream smile mask slides down over it like a lid; the world dims.
//     46.6–47.48   Fast pull back out through the pupil (cut on action into E, still pulling out).
(() => {
  const { C, S, bt } = ECH;
  const TC = S.C, TD = S.D, TE = S.E, B = BEAT;
  const GY = 820, U = 24, UR = 22, RY = 796;
  const GX = 5480, GW = 720, GH = 540, RO = 400, X0 = 5000;
  // speed profiles in steps per beat: Clawd slows to a stop on the downbeat of bar 17 (3 steps); the reflection takes
  // one more step and stops a beat later (4 steps)
  const KC = [[TC, 1], [bt(66), 1], [bt(68), 0]];
  const KR = [[TC, 1], [bt(67), 1], [bt(69), 0]];
  const T_LIFT = bt(76), T_OPEN = bt(77), T_TAKE = bt(78);
  const lin = x => x;

  // ---------- poses ----------
  function clawdPose(t) {
    const w = ECH.walkOn(t, X0, U, KC), sp = clamp(kf(t, KC, lin));
    const emo = emotions(t, [[TC - 4, 'neutral'], [bt(73) + .25, 'suspicious'], [T_TAKE, 'surprised']]);
    const hd = ECH.heading(t, .25, [[34.7, .375], [35.05, .25], [bt(72), .5]]);
    // after the take both arms go up to the mask, one a touch after the other
    const up = ease(seg(t, T_TAKE + .32, T_TAKE + .6)), up2 = ease(seg(t, T_TAKE + .4, T_TAKE + .7));
    const aL = lerp(lerp(emo.aL, w.aL, sp), 1.05 + .05 * Math.sin(t * 7), up), aR = lerp(lerp(emo.aR, w.aR, sp), .98 + .05 * Math.sin(t * 6), up2);
    const hop = { dy: 0, sq: 0 };
    return { ...emo, x: w.x, walk: w.walk, view: hd.view, flip: hd.flip, smear: hd.smear, smearDir: 0,
      dy: emo.dy * (1 - sp) + w.dy + hop.dy, sq: emo.sq + hop.sq, aL, aR, dx: (emo.dx || 0) * (1 - sp) * (1 - up) + .05 * Math.sin(t * 45) * up,
      rot: (emo.rot || 0) * (1 - up) * .8, emote: t > T_TAKE ? '!' : null, emoteK: t > T_TAKE ? emo.emoteK : 0, emoteAge: emo.emoteAge };
  }
  // the reflection is farther away than Clawd (behind the glass), so the camera's move shifts it right (parallax)
  const camX0 = t => 5200 + ECH.dist(t, [[TC, 97.6], [32.6, 150], [33.9, 60], [34.8, 0]]) + 10 * Math.sin((t - TC) * .5);
  function reflPose(t) {
    const w = ECH.walkOn(t, X0 + RO, UR, KR), sp = clamp(kf(t, KR, lin));
    w.x += (camX0(t) - 5200) * .5;
    const emo = emotions(t - B, [[TC - 4, 'neutral'], [bt(73) + .25, 'suspicious']]);
    const hd = ECH.heading(t, .25, [[34.7 + B, .125], [35.05 + B, .25], [bt(73), 0]]);
    const lift = backOut(seg(t, T_LIFT + .22, T_OPEN + .05));
    // the near arm flicks the mask up (small dip first), then drops
    const aR = kf(t, [[T_LIFT - .2, lerp(emo.aR, w.aR, sp)], [T_LIFT + .08, -.35], [T_LIFT + .3, 1.35], [T_OPEN + .1, 1.5], [T_OPEN + .45, -.3]]);
    const open = seg(t, T_LIFT + .3, T_OPEN);
    const settle = ease(seg(t, T_OPEN, T_OPEN + .5));
    // searching: the eyes wander, then settle on the camera for the dive
    const search = Math.sin((t - T_OPEN) * 2.6) * .75 * (1 - ease(seg(t, T_TAKE + .6, TD - .1)));
    const o = { ...emo, x: w.x, walk: w.walk, view: hd.view, flip: hd.flip, smear: hd.smear, smearDir: 0,
      dy: emo.dy * (1 - sp) + w.dy - .25 * Math.exp(-6 * Math.max(0, t - T_LIFT - .3)) * (t > T_LIFT + .3 ? 1 : 0),
      sq: lerp(emo.sq, .05 + .02 * Math.sin(bpOf(t) * Math.PI / 2), settle) + (t > T_LIFT - .15 && t < T_LIFT + .25 ? .08 * Math.sin(seg(t, T_LIFT - .15, T_LIFT + .25) * Math.PI) : 0),
      aL: lerp(lerp(emo.aL, w.aL, sp), -.55, settle), aR, rot: (emo.rot || 0) * (1 - settle), dx: (emo.dx || 0) * (1 - sp) * (1 - settle),
      maskLift: lift, masked: true, halo: .32, emote: null, boilKey: 'refl' };
    if (open > 0) Object.assign(o, { eyes: 'shine', mouth: 'frown', gloom: .3 * settle, squint: t < T_OPEN + .12 ? .5 * (1 - seg(t, T_OPEN - .05, T_OPEN + .12)) : 0,
      lookX: search, lookY: .15 * Math.sin((t - T_OPEN) * 1.7) * (1 - ease(seg(t, T_TAKE + .6, TD - .1))), blush: 0, tint: null });
    return o;
  }
  // the reflection's right eye (centre of the dark shine pupil), world px
  function eyePos(t) {
    const p = reflPose(t), u = UR, sq = p.sq || 0;
    const lx = (p.lookX || 0) * u * .5 * .6, ly = (p.lookY || 0) * u * .4 * .6;
    return [p.x + (p.dx || 0) * u + (2.5 * u + lx) * (1 + sq * .6), RY + (p.dy || 0) * u + (-6 * u + ly) * (1 - sq)];
  }

  // ---------- the set ----------
  // The street, the glass (with the reflection inside it), the pier it walks out from, the lamp and Clawd.
  function glassScene(t, cam, o = {}) {
    ECH.street(cam, t, { gy: GY });
    const rp = reflPose(t);
    ECH.glassWindow(GX, GY, GW, GH, t, 0, () => {
      ECH.echo(rp.x, RY, UR, rp);
      // warm lamp glints caught in the reflection's pupil (they read in the close-up)
      if (rp.view === 'front' && rp.maskLift > .5) {
        const [ex, ey] = eyePos(t);
        boilSeed('eyeglint');
        glow(ex + 4, ey - 7, 7, C.amberLt, .8);
        paint(rrPts(ex + 2.2, ey - 10, 4.2, 5.4, 1.2), { wash: C.amberLt, ink: null });
        paint(ellPts(ex - 5.5, ey + 8, 1.6, 1.1, 8), { wash: C.amber, washOp: 220, ink: null });
      }
    });
    // the pier the reflection walks out from behind
    boilSeed('pier');
    const wallC = '#3F3868';
    paint(rectPts(GX - 165, GY - GH - 170, 165, GH + 172, 2), { wash: wallC, fill: mixCol(wallC, PAL.ink, .35), fillOp: 55, tex: .55, ink: PAL.ink, sw: .8 });
    inkLine([[GX - 12, GY - GH - 150], [GX - 12, GY - 4]], .7, mixCol(wallC, PAL.ink, .5), 'inkfine', 0);
    ECH.lamp(GX + GW + 150, GY, 430, 1, 'glasslamp');   // a lamp at the kerb past the glass lights the pane
    const cp = clawdPose(t);
    ECH.masked(cp.x, GY, U, { ...cp, boilKey: 'clawdC' });
    ECH.splashes(t, cam.cx - 900 / cam.z, cam.cx + 900 / cam.z, GY + 30, { key: 'c', n: 10 });
    camEnd();
  }

  // camera for C: carries B's tracking move on, eases onto the window, then pushes toward the reflection's eye
  function camC(t) {
    const cx0 = camX0(t);
    const cy0 = 540 + 36 * ease(seg(t, 32, 35.5));
    let z = 1 + .24 * ease(seg(t, 31.9, 34.8)) + .04 * seg(t, 34.8, T_OPEN);
    z += .12 * ease(seg(t, T_OPEN, 39.0)) + 1.0 * easeIn(seg(t, 39.0, TD));
    const b = ease(seg(t, 38.85, TD)), [ex, ey] = eyePos(t);
    return { cx: lerp(cx0, ex, b), cy: lerp(cy0, ey, b), z };
  }

  function shotC(t, lt, dur) {
    glassScene(t, camC(t));
    ECH.rain(t, { n: 70 });
  }

  // ---------- D: behind the eyes ----------
  const Z0 = 2.4, V0 = 2.15, T1 = 1.7, ZMAX = Z0 * Math.exp(V0 * T1 / 2);
  function zoomD(t) {
    const s = Math.min(t - TD, T1);
    let lz = Math.log(Z0) + V0 * (s - s * s / (2 * T1));
    if (t > 46.6) lz = lerp(Math.log(ZMAX), Math.log(4.5), easeIn(seg(t, 46.6, TE)));
    return Math.exp(lz);
  }
  const CUTS = [
    ['house', -600, -250, 100, .12, '#5B4A94'], ['moon', 580, -280, 108, -.3, '#6A58A6'], ['door', -500, 250, 104, -.08, '#3F6F86'],
    ['small', 470, 255, 84, .1, '#6A58A6'], ['star', -170, -390, 34, 0, '#7B68B0'], ['star', 260, 400, 28, .5, '#4F8C98'],
    ['house', 880, 60, 52, -.2, '#44387A'], ['moon', -880, 30, 48, .6, '#44387A'],
  ];
  // the inner world, laid out around (ox, oy) at scale sc; clip = [rx, ry] keeps it inside the opening pupil.
  function innerWorld(t, ox, oy, sc, clip) {
    const inside = (x, y, m = 0) => !clip || ((x - ox) / Math.max(1, clip[0] - m)) ** 2 + ((y - oy) / Math.max(1, clip[1] - m)) ** 2 < 1;
    const fly = .045 * Math.max(0, t - 40.9) * (1 - .6 * seg(t, 45.5, 46.6));
    const dim = ease(seg(t, 45.45, 46.3));
    boilSeed('dvoid');
    if (clip) {
      paint(ellPts(ox, oy, clip[0], clip[1], 40), { wash: C.void, ink: null });
      paint(ellPts(ox, oy, clip[0] * .75, clip[1] * .65, 24, 4), { fill: C.voidLt, fillOp: 90, bleed: .3, tex: .4, ink: null });
    } else ECH.innerSky(-80, -80, W + 160, H + 160, t, 'dinner', { stars: 0 });
    // stars, flying slowly outward (we drift in)
    for (let i = 0; i < 64; i++) {
      const dd = .5 + hash(i + 40), f = sc * (1 + fly * dd * 4);
      const x = ox + (hash(i * 3.3 + 11) - .5) * 2300 * f, y = oy + (hash(i * 7.7 + 5) - .5) * 1300 * f;
      if (!inside(x, y) || x < -40 || x > W + 40 || y < -40 || y > H + 40) continue;
      const tw = .5 + .5 * Math.sin(t * 2 + i * 1.7);
      boilSeed('dst' + i);
      paint(starPts(x, y, (4 + 7 * hash(i + 2)) * (.7 + .3 * tw) * Math.max(.4, Math.sqrt(sc)) * (1 + fly), .35, 4), { wash: C.star, washOp: (140 + 100 * tw) * (1 - .6 * dim), ink: null });
    }
    // floating paper cut-outs
    CUTS.forEach(([kind, bx, by, s, r0, col], i) => {
      const f = sc * (1 + fly * 1.6 * (.7 + .3 * hash(i))), sink = 40 * dim;
      const x = ox + (bx + 22 * Math.sin(t * .5 + i * 2)) * f, y = oy + (by + 18 * Math.sin(t * .8 + i) - 6 * pulse(t + i * .06, 4) + sink) * f;
      if (!inside(x, y, s * f)) return;
      ECH.cutout(kind, x, y, s * f, r0 + .12 * Math.sin(t * .45 + i * 1.3), mixCol(col, C.void, .45 * dim), 'd' + i);
    });
    if (dim > 0) { boilSeed('ddim'); paint(clip ? ellPts(ox, oy, clip[0], clip[1], 40) : rectPts(-80, -80, W + 160, H + 160), { wash: '#160F2E', washOp: 150 * dim, ink: null }); }
    // the ember at the centre, beating; it flickers, then the lid closes over it
    const fl = t > 44.0 && t < 44.55 ? 1 - .55 * Math.max(0, Math.sin((t - 44.0) * 40)) * Math.sin(seg(t, 44.0, 44.55) * Math.PI) : 1;
    const land = 45.52, drop = seg(t, 44.62, land);
    const ek = lerp(1, .32, ease(seg(t, land - .05, land + .6))) * fl;
    const es = 40 * sc * (1 + fly * .5);
    if (t > land - .05) glow(ox, oy + 10 * sc, es * 7 * (1 + .12 * pulse(t, 5)), C.ember, .7 * seg(t, land - .05, land + .3) * (1 - .5 * seg(t, 46.2, 47)));   // leaking round the lid
    ECH.ember(ox, oy, es, t, ek, 'inner');
    // the lid: a cream smile mask sliding down over the ember (heavy, inevitable), a squash on landing
    if (t > 44.5) {
      const my = lerp(-760, 8, easeIn(drop) * .35 + ease(drop) * .65), sqz = t > land ? .1 * Math.exp(-7 * (t - land)) * Math.cos(18 * (t - land)) : 0;
      const ms = 50 * sc * (1 + fly * .5), mx = ox + 6 * Math.sin(t * .7) * sc, myy = oy + my * sc;
      if (inside(mx, myy, 0) || !clip) {
        push(); translate(mx, myy); scale(1 + sqz, 1 - sqz); translate(-mx, -myy);
        ECH.looseMask(mx, myy, ms, .06 * Math.sin(t * .9) * (1 - seg(t, land, land + .5)), { key: 'lid' });
        pop();
      }
    }
  }

  function shotD(t, lt, dur) {
    const z = zoomD(t), [ex, ey] = eyePos(t);
    // how far the pupil has opened (in pupil radii): dilates on the way in, contracts on the way out
    const mult = t < 46.6 ? lerp(.45, 7.5, easeIn(seg(t, 40.95, 41.8))) : lerp(7.5, .45, ease(seg(t, 46.6, 47.0)));
    const rx = .78 * UR * z * mult, ry = 1.12 * UR * z * mult;
    const full = (960 / rx) ** 2 + (540 / ry) ** 2 < 1;
    const opening = t > 40.95;
    if (!full) {
      glassScene(t, { cx: ex, cy: ey, z });
      if (!opening || t > 46.6) ECH.rain(t, { n: 70 });
    }
    if (opening) innerWorld(t, W / 2, H / 2, Math.min(1, ry / 1100), full ? null : [rx, ry]);
  }

  shots([[ECH.S.C, shotC], [ECH.S.D, shotD]]);
})();
