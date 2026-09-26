// echoes/e_puddles.js: "Echoes of Myself" shot E (puddles), 47.48–63.22. See STORYBOARD_echoes.md.
//   In: cut on action from D's pull-out: E opens tight on the painted eye-slit of Clawd's mask and keeps pulling out.
//   47.48–51.4   Pull out to the street: masked Clawd walking right among the masked umbrella crowd (walking left).
//   51.4–55.35   Tilt down to the split frame (line at 55%): Echo, unmasked and teary, walks under the line, half a beat
//                late. A tear falls "up" from its eye onto the line: ripple rings.
//   55.35–58.3   A passer-by stops in front of Clawd and nods; Clawd turns 3/4 and nods back. The ember lights up in
//                Clawd's chest; a start, a sweat drop, and the near arm snaps over it (glow leaking round the arm).
//   58.3–61.2    The passer-by walks on. Below, Echo lifts its own ember out and carries it openly like a lantern.
//                The rain gets heavier.
//   61.2–63.22   Clawd stops and looks down into the puddle for the first time; a beat later Echo looks up. Hold.
//   Out: the camera dives toward the water line under ECH.splashWipe (p 0 → .5 over the last .45 s, full cover at the cut).
(() => {
  const { C, S, bt } = ECH;
  const TE = S.E, TF = S.F, B = BEAT, LAG = B / 2;
  const GY = 820, U = 24, X0 = 3000, UG = 22;
  const lin = x => x;
  // Clawd: walks, slows to a stop for the greeting (bar 28), walks on, stops again to look down (bar 31)
  const KC = [[bt(96), 1], [bt(110), 1], [bt(112), 0], [bt(118), 0], [bt(120), 1], [bt(122), 1], [bt(124), 0]];
  // the passer-by who greets Clawd: stops facing it at the same time, walks on at bt(118)
  const KG = [[TE, 1], [bt(110), 1], [bt(112), 0], [bt(118), 0], [bt(120), 2]];
  const XG0 = X0 + 15 * 2 * U + 290 + 15 * 2 * UG;
  const T_NOD_G = bt(113), T_NOD = bt(114), T_GLOW = bt(115), T_PRESS = bt(116), T_ON = bt(118), T_HOLD = bt(119);
  const T_TEAR = bt(108), T_DOWN = bt(124) + .2, T_UP = bt(125) + .25;
  const bump = (t, t0, d) => t > t0 && t < t0 + d ? Math.sin(seg(t, t0, t0 + d) * Math.PI) : 0;
  // the crowd (walking left, a little behind Clawd): x at TE, size, colour, walk phase
  const CROWD = [
    { x0: 2750, u: 20, col: 4, ph: .3, k: 'e' }, { x0: 3300, u: 21, col: 5, ph: .1, k: 'f' },
    { x0: 3560, u: 20, col: 0, ph: .6, k: 'a' }, { x0: 3850, u: 21, col: 2, ph: .85, k: 'b' },
  ];
  const crowdAt = (c, t) => { const st = (t - TE) / B * 1.02; return { x: c.x0 - st * 2 * c.u, walk: st / 2 + c.ph }; };

  // ---------- poses ----------
  function clawdPose(t) {
    const w = ECH.walkOn(t, X0, U, KC), sp = clamp(kf(t, KC, lin));
    const base = feel('neutral', t);
    const hd = ECH.heading(t, .25, [[bt(111) + .1, .125], [T_ON - .1, .25]]);
    const press = backOut(seg(t, T_PRESS - .1, T_PRESS + .16));
    const tk = take(t, T_GLOW + .3, .7);
    // the ember: lights up by itself, then only a glow leaks out once the arm is over it
    const emberK = kf(t, [[T_GLOW, 0], [T_GLOW + .35, .95], [T_PRESS, .95], [T_PRESS + .3, .55], [T_ON, .5], [T_ON + .4, .28]]);
    const nod = bump(t, T_NOD - .05, .5), look = ease(seg(t, T_DOWN, T_DOWN + .45)), antic = bump(t, T_DOWN - .18, .3);
    const q = hd.view === 'q';
    let aL = lerp(base.aL, w.aL, sp);
    if (q) aL = lerp(aL, -2.9, press);
    else if (t > T_ON) aL = lerp(-.1, w.aL * .5, sp);      // walking on stiffly, arm held close
    const o = { ...base, x: w.x, walk: w.walk, view: hd.view, flip: hd.flip, smear: hd.smear, smearDir: 0,
      dy: base.dy * (1 - sp) + w.dy + tk.dy + .25 * nod + .15 * look, sq: base.sq + tk.sq + .04 * nod + (q ? .05 * press : 0),
      rot: .13 * nod + .085 * look - .03 * antic + .01 * Math.sin(t * 1.3) * look, aL, aR: lerp(base.aR, w.aR, sp) - .4 * look,
      maskTilt: .05 * look, sy: 1 - .05 * look, emberK: 0, emote: t > T_PRESS - .1 && t < T_ON + .8 ? 'sweat' : null,
      emoteK: seg(t, T_PRESS - .1, T_PRESS + .15) * (1 - seg(t, T_ON + .4, T_ON + .8)), emoteAge: t - T_PRESS, boilKey: 'clawdE' };
    // the ember sits in the body where the mask doesn't cover it, and the pressing arm is drawn over it
    o.draw = (u, sw) => {
      const ex = q ? -3.2 * u : -1.7 * u, ey = -4.4 * u;
      if (emberK > .01 && q) ECH.ember(ex, ey, u * .68, t, emberK, 'clawdE');
      else if (emberK > .01) glow(ex, ey, u * 3.2 * (1 + .15 * pulse(t, 5)), C.ember, emberK * 1.3);   // hidden: only the glow leaks out
      if (q && press > .02) {
        const a = aL, cols = tintCols(o);
        push(); translate((-4.7 - .55 * clamp((Math.abs(a) - .7) / .9)) * u, -4.5 * u); rotate(a);
        paint(rectPts(-2.9 * u, -.5 * u, 2.9 * u, u), { wash: cols.col, washOp: 255, fill: cols.dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
        pop();
      }
    };
    return o;
  }
  function echoPose(t) {
    const w = ECH.walkOn(t - LAG, X0, U, KC), sp = clamp(kf(t - LAG, KC, lin));
    const emo = emotions(t, [[TE - 4, 'sad', { eyes: 'teary' }], [T_GLOW + .15, 'cry'], [T_HOLD - .35, 'sad', { eyes: 'teary', lookX: .7, lookY: .5 }],
      [T_UP, 'sad', { eyes: 'shine', lookX: .15, lookY: 1, mouth: 'wobble' }]], { take: .7 });
    const chestK = kf(t, [[T_PRESS - .1, 0], [T_PRESS + .35, .9], [T_HOLD - .2, .9], [T_HOLD + .25, 0]]);
    const handK = kf(t, [[T_HOLD - .25, 0], [T_HOLD + .3, 1]]);
    const hold = ease(seg(t, T_HOLD - .35, T_HOLD + .1));
    const aR = lerp(lerp(emo.aR, w.aR, sp), .45 + .05 * Math.sin(t * 2.2), hold);
    return { ...emo, x: w.x, walk: w.walk, view: 'q', dy: emo.dy * (1 - sp) * .6 + w.dy, sq: emo.sq * (1 - .5 * sp), rot: (emo.rot || 0) * .5,
      aL: lerp(emo.aL, w.aL, sp), aR, emote: null, emberK: chestK, halo: .5, boilKey: 'echoE',
      armR: handK > .01 ? (u, sw) => { push(); rotate(aR); ECH.ember(u * .5, -u * .75, u * .6, t, handK, 'echohand'); pop(); } : null };
  }
  function greetPose(t) {
    const st = ECH.dist(t, KG.map(([tt, s]) => [tt, s / B])), sp = clamp(kf(t, KG, lin));
    const nod = bump(t, T_NOD_G - .05, .5), lean = ease(seg(t, T_GLOW + .2, T_GLOW + .5)) * (1 - ease(seg(t, T_PRESS + .5, T_ON - .1)));
    return { x: XG0 - st * 2 * UG, walk: st / 2, dy: -Math.abs(Math.sin(st * Math.PI)) * .3 * sp + .2 * nod, rot: -.12 * nod - .07 * lean, dx: -.3 * lean,
            umbTilt: -.05 * nod - .04 * lean };
  }

  const tearX = () => ECH.walkOn(T_TEAR - LAG, X0, U, KC).x + 3.35 * U;

  // ---------- camera ----------
  function camE(t) {
    const cp = clawdPose(t), sq = cp.sq || 0;
    const ex = cp.x + 2.73 * U * (1 + sq * .6), ey = GY + (cp.dy || 0) * U - 6.3 * U * (1 - sq);
    const zk = [[48.9, 1.18], [51.4, 1.05], [53.2, 1.0], [55.0, 1.0], [55.9, 1.14], [58.3, 1.14], [59.4, 1.04], [61.2, 1.06], [62.77, 1.4]];
    let z = t < 48.9 ? Math.exp(lerp(Math.log(12), Math.log(1.18), easeOut(seg(t, TE, 48.9)))) : kf(t, zk);
    const cyF = kf(t, [[TE, 420], [51.4, 420], [53.3, 770], [55.0, 770], [55.9, 705], [58.3, 705], [59.4, 790], [61.2, 790], [62.6, 812]]);
    const lead = kf(t, [[49.6, 170], [53.0, 150], [55.4, 150], [58.3, 150], [60, 110], [61.6, 45]]);
    const b = ease(seg(t, TE, 49.8));
    let cx = lerp(ex, cp.x + lead, b), cy = lerp(ey, cyF, b);
    // the dive: down toward the water line under the splash
    const dv = easeIn(seg(t, TF - .45, TF));
    z *= 1 + .7 * dv; cy += 190 * dv;
    return { cx, cy, z };
  }

  function shotE(t, lt, dur) {
    const cam = camE(t);
    ECH.street(cam, t, { gy: GY });
    const vx0 = cam.cx - W / 2 / cam.z - 200, vx1 = cam.cx + W / 2 / cam.z + 200;
    const cp = clawdPose(t), ep = echoPose(t), gp = greetPose(t);
    const crowd = CROWD.map(c => ({ c, ...crowdAt(c, t) })).filter(m => m.x > vx0 - 300 && m.x < vx1 + 300);
    // reflections in the wet pavement: the crowd (still masked, dimmed by the water), then Echo, bright and unmasked
    for (const m of crowd) ECH.mirror(GY - 8, () => ECH.passerby(m.x, GY - 8, m.c.u, { col: m.c.col, walk: m.walk, key: 'r' + m.c.k, seed: m.c.ph * 7, noShadow: true }));
    if (gp.x > vx0 - 300 && gp.x < vx1 + 300) ECH.mirror(GY - 8, () => ECH.passerby(gp.x, GY - 8, UG, { ...gp, col: 1, key: 'rg', noShadow: true, emote: null }));
    boilSeed('wetveil');
    paint(rectPts(vx0, GY, vx1 - vx0, 900), { wash: C.street, washOp: 105, ink: null });
    ECH.mirror(GY, () => {
      ECH.echo(ep.x, GY, U, ep);
      // the tear: it falls from Echo's eye down onto the line, which is "up" for us
      const tk = seg(t, T_TEAR, T_TEAR + .5);
      if (tk > 0 && tk < 1) {
        const tx = tearX(), ty = lerp(GY - 4.9 * U, GY, easeIn(tk)), r = 9;
        glow(tx, ty, 40, PAL.cream, .5);
        boilSeed('tear');
        paint([[tx, ty - r * (1.6 + 1.2 * tk)], [tx + r * .8, ty], [tx, ty + r * .8], [tx - r * .8, ty]], { wash: '#BFE0F4', fill: PAL.cream, fillOp: 90, ink: PAL.ink, sw: .6, curv: .6 });
      }
    });
    ECH.ripples(t, vx0, vx1, GY + 30, GY + 420, { key: 'e', col: C.rain, n: 22 });
    const tx0 = tearX();
    if (t > T_TEAR + .5) {
      ECH.rings(tx0, GY + 2, t - T_TEAR - .5, { n: 3, gap: .25, life: 1.8, speed: 110, ry: .25, key: 'tear', col: PAL.cream, sw: 1.2 });
      glow(tx0, GY, 90, C.goldLt, .6 * Math.exp(-3 * (t - T_TEAR - .5)));
    }
    // the line between the worlds, faint until they look at each other
    ECH.theLine(vx0, vx1, GY, .35 + .45 * ease(seg(t, T_UP, T_UP + .8)) + .3 * Math.exp(-3 * Math.max(0, t - T_TEAR - .5)) * (t > T_TEAR + .5 ? 1 : 0), { key: 'e', glow: 0, sw: 1.2 });
    glow(cp.x, GY, 260, C.gold, .25 + .35 * ease(seg(t, T_UP, T_UP + .8)));
    // the street: crowd behind, then the passer-by, then Clawd
    for (const m of crowd) ECH.passerby(m.x, GY - 8, m.c.u, { col: m.c.col, walk: m.walk, key: m.c.k, seed: m.c.ph * 7 });
    if (gp.x > vx0 - 300 && gp.x < vx1 + 300) ECH.passerby(gp.x, GY - 8, UG, { ...gp, col: 1, key: 'g' });
    ECH.masked(cp.x, GY, U, cp);
    ECH.splashes(t, vx0, vx1, GY + 60, { key: 'e1', n: 9, dy: 0 });
    ECH.splashes(t + .2, vx0, vx1, GY + 190, { key: 'e2', n: 6 });
    camEnd();
    ECH.rain(t, { n: Math.round(lerp(70, 150, seg(t, T_ON, T_ON + 1.2))), speed: lerp(1500, 1800, seg(t, T_ON, T_ON + 1.2)) });
    if (t > TF - .45) ECH.splashWipe(.5 * seg(t, TF - .45, TF));
  }

  shots([[ECH.S.E, shotE]]);
})();
