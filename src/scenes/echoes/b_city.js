// echoes/b_city.js: shot B (12.07 → 31.75, bars 6–16), "the city of smiles". See STORYBOARD_echoes.md.
//   12.07      match cut from A: the first frame is a foreground passer-by's umbrella canopy exactly where A's last ripple
//              ring was (screen centre, same size). The camera pulls back (z 1.7 → 1) as that commuter hurries off left,
//              revealing Clawd (unmasked, u 24, gy 820) walking right in the rain, alone, 1 step per beat.
//   12.07–15.9 tracking medium shot, Clawd walks alone; lamps and shopfronts pass; its reflection (Echo) walks below.
//   14.4–19.9  the masked umbrella crowd arrives from the right, walking left, sizes/colours/speeds/phases all different.
//   19.94      (bar 10) one passer-by stops, sags; its mask slips down askew (20.05–20.35): tired, sleepy eyes, gloom.
//   19.96–20.41 Clawd slows to a stop, staring.   20.93 Clawd: surprised take.
//   21.2       the passer-by notices it's seen, panics; 21.66–21.91 (bar 11) shoves the mask back; hurries off left.
//   22.75      Clawd turns to camera, watching it go.   23.88 (bar 12) nervous (sweat), looks side to side.
//   25.2–26.0  reaches behind its back and brings out a smile mask (it slides out from behind the body).
//   26.0–27.3  holds it out and looks at it.   27.32 anticipation.   27.81 (bar 14) slaps it on: impact, stiff body.
//   28.3–28.55 turns to walk; 28.79 walks on with a bouncy fake-calm bob on the beat, like the walkers leaving left.
//   29.78–31.75 the camera slides right onto the big shop window and settles into tracking.
//   31.745 seam (C): street gy 820, cam { cx 5200, cy 540, z 1 }, masked Clawd side view walking right at 1 step per beat,
//              u 24, x 5000 (screen 760), leg phase walk = 11 (an even step count), camera moving at Clawd's speed; no crowd
//              on screen. C's shop window (glassWindow at x 5480, its pier 5315–5480, kerb lamp) is already in frame.
//              Echo walks as Clawd's puddle reflection until the mask goes on, then sinks away (28.4–30.0), so there is
//              no puddle reflection at the cut (C has none).
(() => {
  const { C, bt, bar, S } = ECH;
  const GY = 820, U = 24, V = 2 * U / BEAT, GX = 5480;   // GX: left edge of C's shop window pane
  // Clawd's walk, planned back from the seam: stops with its legs neutral (walk ≡ .25), restarts on beat 58, and has
  // walked exactly 22 steps at the cut, so its leg phase there is the same as a fresh walkOn started at the cut.
  // (a linear 0 ↔ 1 step-per-beat ramp of d seconds covers d / 2 / BEAT steps)
  const T_STOP0 = S.B + 16.5 * BEAT - .225, T_STOP1 = T_STOP0 + .45, T_GO1 = S.C - (22 - 16.5 - .25 / BEAT) * BEAT, T_GO0 = T_GO1 - .5;
  const CK = [[S.B, 1], [T_STOP0, 1], [T_STOP1, 0], [T_GO0, 0], [T_GO1, 1]];
  const X0 = 5000 - 22 * 2 * U;
  const walkC = t => ECH.walkOn(t, X0, U, CK);
  const T_SLIP = bar(10), T_TAKE = bt(42), T_SHOVE = bar(11), T_NERV = bar(12), T_ON = bar(14);

  // ---------- camera ----------
  // A base that follows Clawd (with its own softer stop and start), plus framing offsets; everything eases into the seam.
  const CBK = [[S.B, V], [19.6, V], [21.0, 0], [T_GO0, 0], [T_GO0 + .7, V]];
  const OFFK = [[S.B, 170], [19.3, 170], [20.9, 142], [22.4, 142], [23.9, 40], [27.3, 22], [28.5, 22], [29.78, 70], [S.C, 200]];
  const ZK = [[S.B, 1], [19.3, 1], [20.6, 1.2], [22.4, 1.18], [23.9, 1.24], [27.3, 1.32], [28.5, 1.3], [29.78, 1.06], [S.C, 1]];
  const CB0 = 5200 - 200 - ECH.dist(S.C, CBK);
  function track(t) {
    const drift = (1 - ease(seg(t, 29.78, S.C))) * seg(t, S.B, S.B + 2);
    return { cx: CB0 + ECH.dist(t, CBK) + kf(t, OFFK) + 10 * Math.sin((t - S.B) * .45) * drift, cy: 540, z: kf(t, ZK) * (1 + .012 * Math.sin((t - S.B) * .3) * drift) };
  }

  // ---------- the crowd ----------
  // P0: the foreground commuter whose umbrella is the match cut. Hurries left at 2 steps per beat, in front of Clawd.
  const P0 = { u: 28, y: GY + 30, x0: walkC(S.B).x + 10, v: 2 * 2 * 28 / BEAT };
  function p0Pose(t) {
    const walk = 2 * (t - S.B) / BEAT / 2 + .1;
    return { x: P0.x0 - P0.v * (t - S.B), walk, dy: -Math.abs(Math.sin(walk * TAU)) * .3 };
  }
  const canopyAt = t => { const p = p0Pose(t); return [p.x - 3.7 * P0.u, P0.y + p.dy * P0.u - 12.6 * P0.u]; };
  const C0 = canopyAt(S.B);
  function camB(t) {
    const tr = track(t), k = ease(seg(t, S.B, S.B + 1.7));
    if (k >= 1) return tr;
    return { cx: lerp(C0[0], tr.cx, k), cy: lerp(C0[1], tr.cy, k), z: Math.exp(lerp(Math.log(1.7), Math.log(tr.z), k)) };
  }

  // The slipping passer-by (P*): walks in, stops at bar 10, mask slips, shoves it back at bar 11, hurries off.
  const PS = { u: 23, col: 0, stopX: 5020 };
  const PSK = [[12, 4 * PS.u / BEAT], [17.5, 4 * PS.u / BEAT], [18, 2 * PS.u / BEAT], [19.45, 2 * PS.u / BEAT], [T_SLIP, 0], [22.15, 0], [22.6, 4 * PS.u / BEAT]];
  const PS_X0 = PS.stopX + ECH.dist(T_SLIP, PSK), PS_PH = .25 - frac(ECH.dist(T_SLIP, PSK) / (4 * PS.u));
  function psPose(t) { const d = ECH.dist(t, PSK); return { x: PS_X0 - d, walk: d / (4 * PS.u) + PS_PH, sp: kf(t, PSK, x => x) }; }

  // The rest of the crowd hurries (2 steps per beat, so speed goes with size): each passes Clawd's x at tp. One goes
  // ahead of the tired one; the others come on behind it, far enough back that they only reach its spot after it has
  // gone, pass behind Clawd while it's nervous (before the mask comes out), and have all left the frame by the cut.
  const CROWD = [
    { tp: 19.3, u: 25, col: 2, umb: 2, ph: .1 }, { tp: 24.9, u: 26, col: 1, umb: 4, ph: .8 },
    { tp: 25.7, u: 23, col: 3, umb: 5, ph: .45 }, { tp: 26.5, u: 25, col: 5, umb: 0, ph: .3 },
  ].map((m, i) => ({ ...m, key: 'm' + i, v: 2 * 2 * m.u / BEAT, xp: walkC(m.tp).x }));
  const crowdX = (m, t) => m.xp + m.v * (m.tp - t);

  function drawPasserby(x, y, u, o) {
    const walk = o.walk, bob = o.moving === false ? 0 : -Math.abs(Math.sin(walk * TAU)) * .3;
    ECH.passerby(x, y, u, { flip: true, view: 'side', umbTilt: .05 * Math.sin(walk * TAU + (o.ph || 0) * 5), ...o, dy: (o.dy || 0) + bob });
  }

  // ---------- Clawd's mask business (front view, body-local u units) ----------
  const tipR = a => [4.9 + .55 * clamp((Math.abs(a) - .7) / .9) + 2.2 * Math.cos(a), -4.5 - 2.2 * Math.sin(a)];
  const HOLD = [3.3, -.25], BEHIND = [.6, -5.3], FACE = [0, -5.4];
  const T_OUT0 = 25.45, T_OUT1 = 26.0, T_ANT = bt(55), T_SW = T_ON - .25;
  const ARK = [[25.15, -.1], [T_OUT0, -1.45], [T_OUT1, .3], [T_ANT, .3], [T_ANT + .18, .12], [T_ON, .95], [T_ON + .22, -1.35]];
  function armR(t) { return t < T_ON ? kf(t, ARK, t < T_OUT1 && t > T_OUT0 ? backOut : ease) : kf(t, ARK); }
  // mask centre in body-local u, its tilt, and whether it is behind the body (drawn from the arm) or in front
  function maskPath(t, aR) {
    const tp = tipR(aR), held = [tp[0] + HOLD[0], tp[1] + HOLD[1]];
    if (t < T_OUT0) return null;
    if (t < T_OUT1) { const k = ease(seg(t, T_OUT0 + .1, T_OUT1)); return { c: [lerp(BEHIND[0], held[0], k), lerp(BEHIND[1], held[1], k)], tilt: .15 * k, behind: true }; }
    if (t < T_SW) return { c: held, tilt: .12 + .06 * Math.sin((t - T_OUT1) * 5), behind: true };
    const a = tipR(armR(T_SW)), h0 = [a[0] + HOLD[0], a[1] + HOLD[1]], k = easeIn(seg(t, T_SW, T_ON));
    return { c: [lerp(h0[0], FACE[0], k), lerp(h0[1], FACE[1], k)], tilt: lerp(.12 + .06 * Math.sin((T_SW - T_OUT1) * 5), 0, k), behind: false };
  }
  function drawMaskAt(u, sw, c, tilt) { push(); translate(c[0] * u, c[1] * u); rotate(tilt); ECH.mask(u, sw, { view: 'front', off: [0, 5.4] }); pop(); }

  // ---------- Clawd's pose ----------
  function clawdPose(t) {
    const w = walkC(t), sp = clamp(kf(t, CK, x => x)), hd = ECH.heading(t, .25, [[22.75, 0], [28.3, .25]]);
    const mood = emotions(t, [[S.B, 'neutral', { lookY: .1, lookX: .2 }], [15.9, 'neutral', { lookX: .7, lookY: -.1 }],
      [T_TAKE, 'surprised', { lookX: .8 }], [T_NERV, 'nervous'], [T_ON, 'neutral', { emote: null }]]);
    const o = { ...mood, ...hd, walk: hd.view === 'front' ? undefined : w.walk };
    if (t > 22.5 && t < T_NERV + .3) o.lookX = lerp(o.lookX, -.95, seg(t, 22.5, 22.8) * (1 - seg(t, T_NERV, T_NERV + .3)));   // watching it go
    o.dy = (mood.dy || 0) * (1 - sp * .6) + w.dy;
    o.aL = lerp(mood.aL ?? .2, w.aL, sp); o.aR = lerp(mood.aR ?? .2, w.aR, sp);
    // the mask: reach behind, hold it out and look at it, slap it on
    if (t > 25.15 && t < T_ON + .3) {
      const k = seg(t, 25.15, 25.35); o.aR = lerp(o.aR, armR(t), k);
      if (t > T_OUT1 - .2 && t < T_ANT + .1) { o.lookX = lerp(o.lookX || 0, .95, seg(t, T_OUT1 - .2, T_OUT1)); o.lookY = .15; }
      if (t > T_ANT && t < T_ON) { o.sq = (o.sq || 0) + .07 * Math.sin(seg(t, T_ANT, T_SW) * Math.PI / 2) * (1 - seg(t, T_SW, T_ON)); o.rot = (o.rot || 0) - .05 * seg(t, T_ANT, T_SW); }
    }
    const masked = t >= T_ON;
    if (masked) {   // on: an impact squash, then stiff as a board with a tiny shiver; then the fake-calm bob
      const imp = Math.exp(-(t - T_ON) * 9), stiff = seg(t, T_ON, T_ON + .08) * (1 - seg(t, 28.35, 28.7));
      o.sq = (o.sq || 0) * (1 - stiff) + .16 * imp * Math.cos((t - T_ON) * 20) - .07 * stiff;
      o.dx = (o.dx || 0) * (1 - stiff) + .05 * stiff * Math.sin(t * 70);
      o.rot = (o.rot || 0) * (1 - stiff); o.aL = lerp(o.aL, -1.3, stiff); if (t > T_ON + .22) o.aR = lerp(o.aR, -1.3, stiff);
      const bob = seg(t, T_GO0, T_GO1);
      o.dy += -.55 * Math.abs(Math.sin(bpOf(t) * Math.PI)) * bob;
      o.aL = lerp(o.aL, .1 + .45 * Math.sin(w.walk * TAU), bob); o.aR = lerp(o.aR, .1, bob);
    }
    return { w, o, masked, mp: masked ? null : maskPath(t, o.aR), mood };
  }

  function shotB(t, lt, dur) {
    const cam = camB(t);
    ECH.street(cam, t, { gy: GY });
    const vx0 = cam.cx - W / 2 / cam.z - 300, vx1 = cam.cx + W / 2 / cam.z + 300;
    // C's big shop window, its pier and the kerb lamp past it, exactly as shot C paints them (so the cut is seamless)
    if (vx1 > GX - 200) {
      ECH.glassWindow(GX, GY, 720, 540, t, 0, null);
      boilSeed('pier');
      const wallC = '#3F3868';
      paint(rectPts(GX - 165, GY - 540 - 170, 165, 540 + 172, 2), { wash: wallC, fill: mixCol(wallC, PAL.ink, .35), fillOp: 55, tex: .55, ink: PAL.ink, sw: .8 });
      inkLine([[GX - 12, GY - 540 - 150], [GX - 12, GY - 4]], .7, mixCol(wallC, PAL.ink, .5), 'inkfine', 0);
      ECH.lamp(GX + 720 + 150, GY, 430, 1, 'glasslamp');
    }
    if (t < 30.8) ECH.splashes(t, vx0, vx1, GY, { n: 18, key: 'b' });

    // the crowd behind Clawd
    for (const m of CROWD) {
      const x = crowdX(m, t); if (x < vx0 - 200 || x > vx1 + 300) continue;
      drawPasserby(x, GY, m.u, { col: m.col, umb: ECH.UMB[m.umb], walk: (t - m.tp) / BEAT + m.ph, ph: m.ph, key: m.key, seed: m.ph * 10 });
    }
    // the slipping passer-by
    const ps = psPose(t);
    if (ps.x > vx0 - 200 && ps.x < vx1 + 300) {
      const hd = ECH.heading(t, -.25, [[T_SLIP + .02, -.125], [22.05, -.25]]);
      const fe = emotions(t, [[0, 'neutral'], [T_SLIP + .05, 'sleepy', { eyes: 'sad', squint: .25, emote: null, mouth: 'frown', gloom: .5, lookY: .45, lookX: -.3 }],
        [21.2, 'scared', { emote: 'sweat', lookX: -.8 }], [22.3, 'neutral', { emote: null }]], { take: .7 });
      const slip = backOut(seg(t, T_SLIP + .1, T_SLIP + .42)) * (1 - easeIn(seg(t, T_SHOVE - .25, T_SHOVE)));
      const sag = Math.sin(seg(t, T_SLIP - .1, T_SLIP + .5) * Math.PI) * .12, shv = Math.exp(-Math.max(0, t - T_SHOVE) * 8) * (t > T_SHOVE ? 1 : 0);
      drawPasserby(ps.x, GY, PS.u, { col: PS.col, walk: ps.walk, moving: ps.sp > 1, key: 'ps', seed: 3, view: hd.view, flip: hd.flip,
        eyes: fe.eyes, mouth: fe.mouth, gloom: fe.gloom, squint: fe.squint, lookX: fe.lookX, lookY: fe.lookY, emote: fe.emote, emoteK: fe.emoteK, emoteAge: fe.emoteAge,
        dy: fe.dy * .5 + sag * 2, sq: (fe.sq || 0) * .6 + sag + .14 * shv * Math.cos((t - T_SHOVE) * 22),
        aR: .15 + 1.1 * Math.sin(seg(t, T_SHOVE - .3, T_SHOVE + .1) * Math.PI),
        maskOff: slip > .001 ? [1.2 * slip, 2.7 * slip] : undefined, maskTilt: -.5 * slip, umbTilt: .32 * ease(seg(t, T_SLIP - .2, T_SLIP + .4)) * (1 - ease(seg(t, 21.95, 22.4))) + .03 * Math.sin(t * 2) });
    }

    // Clawd and its reflection
    const P = clawdPose(t), cx = P.w.x;
    const eKeys = [[S.B, 'neutral', { eyes: 'shine', lookY: .1 }], [T_TAKE, 'surprised', { eyes: 'wide', emote: null }], [T_NERV, 'nervous', { eyes: 'shine', emote: null }], [T_ON + .12, 'sad', { emote: null, eyes: 'sad' }]];
    const ef = emotions(t, eKeys, { take: .5 });
    const eo = { ...P.o, eyes: ef.eyes, mouth: ef.mouth, squint: ef.squint, gloom: ef.gloom, blush: 0, emote: null, draw: undefined, armR: undefined, halo: .3, boilKey: 'b-echo' };
    // once the mask is on, the reflection comes loose from Clawd's feet and sinks away out of the puddle (it turns up
    // again in C, in the shop window)
    const sink = easeIn(seg(t, T_ON + .55, 30.0));
    if (sink < 1) ECH.mirror(GY, () => ECH.echo(cx, GY, U, { ...eo, dy: (eo.dy || 0) - 14 * sink, halo: .3 * (1 - sink) }));
    const mp = P.mp;
    ECH.masked(cx, GY, U, { ...P.o, noMask: !P.masked, boilKey: 'b-clawd',
      armR: mp && mp.behind ? (u, sw) => { const a = P.o.aR, tp = tipR(a); push(); rotate(a); translate(-tp[0] * u, -tp[1] * u); drawMaskAt(u, sw, mp.c, mp.tilt); pop(); } : undefined,
      draw: mp && !mp.behind ? (u, sw) => drawMaskAt(u, sw, mp.c, mp.tilt) : undefined });

    // the foreground commuter (the match cut's umbrella)
    const p0 = p0Pose(t);
    if (p0.x > vx0 - 300) drawPasserby(p0.x, P0.y, P0.u, { col: 1, walk: p0.walk, key: 'p0', seed: 7, umbTilt: lt < .05 ? 0 : .04 * Math.sin(p0.walk * TAU) * seg(lt, 0, .5) });
    // the slap: short ink dashes flick out around the mask as it lands
    const sl = t - T_ON;
    if (sl > 0 && sl < .22) {
      boilSeed('b-slap');
      const k = sl / .22, fy = GY + (P.o.dy || 0) * U - 5.4 * U;
      for (const [ax, ay] of [[-1, -.6], [1, -.6], [-1.15, .15], [1.15, .15], [0, -1]]) {
        const d = lerp(5.2, 7.2, easeOut(k)) * U, L = U * 1.1 * (1 - k);
        const nx = ax / Math.hypot(ax, ay), ny = ay / Math.hypot(ax, ay);
        inkLine([[cx + nx * d, fy + ny * d * .6], [cx + nx * (d + L), fy + ny * (d + L) * .6]], 1.3 * (1 - k) + .2, PAL.cream, 'ink', 0);
      }
    }
    if (t >= 30.8) ECH.splashes(t, cam.cx - 900 / cam.z, cam.cx + 900 / cam.z, GY + 30, { key: 'c', n: 10 });   // C's splashes
    camEnd();
    ECH.rain(t);
  }
  shots([[ECH.S.B, shotB]]);
})();
