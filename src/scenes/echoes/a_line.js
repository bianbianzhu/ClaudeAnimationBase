// echoes/a_line.js: shot A (0 → 12.07, bars 0–6), "the line". See STORYBOARD_echoes.md.
//   0.00–0.27  black.
//   0.27–2.73  a thin gold line grows left → right across the middle, one short stroke per koto pick (eighth notes).
//   2.73–4.90  the line opens like an eyelid (black lids, screen space): a crack first (2.73), then wide (3.30–4.90).
//              Above: the rainy night street (gy = 540, so the opening line IS the street's ground line); below: its
//              wet reflection. The camera starts pushed in (z 1.6) and eases back to z 1 while drifting right.
//   4.20–      Clawd (UNMASKED, neutral, a little lonely, u 18) walks in from the left at 1 step per beat, entering the
//              frame ≈5.1; Echo walks feet-to-feet under the line, in step.
//   8.40–9.12  a raindrop swells on an awning tip just ahead of Clawd (glint), falls, just misses it and hits the line
//              behind its heel, between Clawd and Echo, on the beat (9.12): a splash crown and three rings across the line.
//   9.12–10.1  the ripple shakes the reflection; Clawd walks on and doesn't notice. On the downbeat of bar 5 Echo misses the step:
//              it stalls half a beat (10.11–10.35), stumbles, walks half a beat late, then scurries to catch up
//              (11.30–11.80), still a hair behind.
//   10.30–12.07 the camera pushes in (z 1 → 2.3) on the ripple and decelerates into the cut; the last ring's upper half
//              fills into an umbrella canopy (11.35–12.07). Match cut on the downbeat of bar 6 to B, whose first frame
//              is that same umbrella canopy (same screen place and size), which B then pulls back from.
(() => {
  const { C, bt, bar } = ECH;
  const GY = 540, U = 18;
  const DRIP = [712, GY - 334], T_DROP = bt(18), T_DOWN = bar(5), T_END = ECH.S.B;
  const CK = [[bar(2), 1]];                                   // Clawd: 1 step per beat from bar 2
  const X0 = DRIP[0] + 75 - (T_DROP - bar(2)) / BEAT * 2 * U;       // so the drop just misses: it lands behind the heel, between them
  const LID = '#0B0A12', UMB_COL = ECH.UMB[1];
  // the match: at the cut the hero ring's centre is at screen (960, 540) with rx = 7·28·1.7 px, which is B's first-frame
  // umbrella canopy (u 28 under B's opening zoom 1.7)
  const Z_END = 2.3, R_HERO = 7 * 28 * 1.7 / Z_END;

  // the gold line's picks: 10 strokes on the eighth notes of bar 0 and the first beat of bar 1
  const NP = 10, PX = (() => { const w = []; let s = 0; for (let i = 0; i < NP; i++) { w.push(.6 + hash(i * 5.3 + 1)); s += w[i]; } const X = [-40]; for (let i = 0; i < NP; i++) X.push(X[i] + w[i] / s * (W + 80)); return X; })();
  const pickT = i => bt(i / 2);

  function camA(t) {
    if (t < 10.3) {
      return { cx: lerp(1205, 1245, ease(seg(t, 2.73, 10.3))), cy: 540, z: lerp(1.6, 1, ease(seg(t, 2.73, 8.9))) };
    }
    // the push: the ripple's screen x eases to the centre while the zoom grows geometrically
    const k = ease(seg(t, 10.3, T_END)), z = Math.exp(lerp(0, Math.log(Z_END), k)), sx = lerp(960 + (DRIP[0] - 1245), 960, k);
    return { cx: DRIP[0] - (sx - 960) / z, cy: 540, z };
  }
  // Echo's lag behind Clawd (s): in sync, then it misses the step (stalls half a beat), walks late, then scurries.
  function lagOf(t) {
    if (t < T_DOWN) return 0;
    if (t < T_DOWN + BEAT / 2) return t - T_DOWN;
    return lerp(BEAT / 2, .07, ease(seg(t, 11.3, 11.8)));
  }

  // one painted ring arc (upper or lower half of an ellipse), as an open ink line
  function arc(x, y, rx, ry, up, sw, col) {
    if (sw < .05) return;
    const P = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * i / 24; P.push([x - Math.cos(a) * rx, y + (up ? -1 : 1) * Math.sin(a) * ry]); }
    inkLine(P, sw, col, 'ink', .5);
  }
  // the umbrella canopy (same outline as ECH.umbrellaLocal), centred on its rim at (x, y), unit uu, opacity k
  function canopy(x, y, uu, k) {
    if (k <= .01) return;
    boilSeed('a-canopy');
    const P = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([x + Math.cos(a) * 7 * uu, y + Math.sin(a) * 3.4 * uu]); }
    P.push([x + 7 * uu, y], [x + 3.5 * uu, y + .5 * uu], [x, y], [x - 3.5 * uu, y + .5 * uu], [x - 7 * uu, y]);
    const sw = clamp(uu / 15, .45, 2.4);
    paint(P, { wash: UMB_COL, washOp: 255 * k, fill: mixCol(UMB_COL, PAL.ink, .35), fillOp: 70 * k, bleed: .06, tex: .5, ink: k > .5 ? PAL.ink : null, sw: sw * .8, curv: .15 });
    if (k > .6) for (const dx of [-3.5, 0, 3.5]) inkLine([[x, y - 3.4 * uu], [x + dx * uu, y + .3 * uu]], sw * .45 * seg(k, .6, 1), PAL.ink, 'inkfine', .3);
  }
  // the ripple: a splash crown on impact, then three rings; the last one lingers and becomes the umbrella
  function ripple(t) {
    const a0 = t - T_DROP; if (a0 < 0) return;
    const [x, y] = [DRIP[0], GY];
    if (a0 < .45) {   // crown: little droplets thrown up on arcs, and a flash of light
      glow(x, y, 90 * (1 - a0 / .45), C.rain, .8 * (1 - a0 / .45));
      for (let i = 0; i < 7; i++) {
        const ang = Math.PI * (.15 + .7 * i / 6), sp = 60 + 40 * hash(i + 3), k = a0 / .45;
        const px = x + Math.cos(ang) * sp * k * 1.3, py = y - Math.sin(ang) * sp * 1.6 * k + 260 * k * k;
        if (py > y + 2) continue;
        boilSeed('a-crown' + i);
        paint(ellPts(px, py, 3.2 * (1 - k * .5), 4.6 * (1 - k * .5), 8), { wash: PAL.cream, washOp: 230, ink: null });
      }
    }
    const morph = ease(seg(t, 11.35, T_END));
    for (let i = 0; i < 3; i++) {
      const a = a0 - i * BEAT / 2; if (a < 0) continue;
      const hero = i === 2, L = hero ? 2.6 : 2.3 - i * .2, R = hero ? (R_HERO - 12) / easeOut((T_END - T_DROP - BEAT) / 2.6) : 560 - 180 * i;
      const r = 12 + R * easeOut(a / L), fade = hero ? 1 : 1 - seg(a, .3, L);
      if (fade <= .02) continue;
      boilSeed('a-ring' + i);
      const sw = (hero ? 1.5 : 1.3) * fade + .15, ry = r * .486;
      arc(x, y, r, ry, true, sw * (hero ? 1 - morph * .6 : 1), PAL.cream);
      arc(x, y, r, ry, false, sw * (hero ? 1 - morph : 1) * .8, C.rain);
      if (hero) canopy(x, y, r / 7, morph);
    }
  }
  // the drop: swells on the awning tip with a glint, then falls onto the line on the beat
  function drop(t) {
    const tf = T_DROP - .36;
    if (t < 8.4 || t > T_DROP) return;
    let [x, y] = DRIP, s = 4 + 7 * backOut(seg(t, 8.4, tf - .08)) + 1.2 * Math.sin(seg(t, 8.4, tf) * Math.PI * 3), st = 1;
    if (t > tf) { const k = easeIn(seg(t, tf, T_DROP)); y = lerp(DRIP[1] + 10, GY - 6, k); st = 1 + 1.4 * k; s = 10 - 2 * k; }
    else y += s * .9;
    const gl = 1 + .5 * Math.exp(-Math.max(0, t - 8.55) * 4) * seg(t, 8.4, 8.55);   // a glint as it catches the lamp light
    glow(x, y, (40 + 4 * s) * gl, C.rain, .95);
    glow(x, y, (14 + s) * gl, PAL.cream, .85);
    boilSeed('a-drop');
    paint([[x, y - s * 1.6 * st], [x + s * .75, y + s * .1], [x + s * .6, y + s * .7], [x, y + s], [x - s * .6, y + s * .7], [x - s * .75, y + s * .1]],
      { wash: '#DCE6FF', washOp: 240, ink: PAL.ink, sw: .45, curv: .5 });
  }
  // the lids: a lens-shaped opening that grows from the line (screen space)
  function lids(t) {
    if (t >= 4.95) return;
    const p = t < 2.73 ? 0 : t < 3.3 ? .08 * easeOut(seg(t, 2.73, 3.08)) : lerp(.08, 1, ease(seg(t, 3.3, 4.9)));
    const A = lerp(0, 760, Math.pow(p, 1.25)), Rx = lerp(840, 2600, Math.pow(p, 1.6)), h = x => A * Math.sqrt(Math.max(0, 1 - Math.pow((x - 960) / Rx, 2)));
    const top = [], bot = [];
    for (let i = 0; i <= 16; i++) { const x = lerp(W + 60, -60, i / 16); top.push([x, 540 - h(x)]); bot.push([x, 540 + h(x)]); }
    boilSeed('a-lid-top');
    if (Math.max(...top.map(q => q[1])) > -50) paint([[-60, -80], [W + 60, -80], ...top.map(([x, y]) => [x, Math.max(-80, y)])], { wash: LID, ink: null });
    boilSeed('a-lid-bot');
    if (Math.min(...bot.map(q => q[1])) < H + 50) paint([[W + 60, H + 80], [-60, H + 80], ...bot.slice().reverse().map(([x, y]) => [x, Math.min(H + 80, y)])], { wash: LID, ink: null });
    if (p > 0 && p < 1) {   // the lash lines keep a little of the gold as they part
      const k = 1 - seg(p, .3, .9);
      boilSeed('a-lash');
      inkLine(top.map(([x, y]) => [x, y + 1]), 1.1 * k + .1, C.gold, 'ink', .4);
      inkLine(bot.map(([x, y]) => [x, y - 1]), 1.1 * k + .1, C.gold, 'ink', .4);
    }
  }
  // the gold line, stroke by stroke (screen space: the camera keeps gy on y = 540)
  function goldLine(t) {
    const kAll = t < 2.73 ? 1 : lerp(1, .55, ease(seg(t, 2.73, 5))) * (1 - .7 * ease(seg(t, 11.2, T_END))) * (1 + .15 * pulse(t, 5));
    for (let i = 0; i < NP; i++) {
      const tp = pickT(i); if (t < tp) break;
      const g = easeOut(seg(t, tp, tp + .1)), x1 = lerp(PX[i], PX[i + 1], g);
      ECH.theLine(PX[i] - 2, x1, 540, kAll, { key: 'a' + i, glow: .45 * (1 - seg(t, 2.4, 2.72)), glowR: 150, sw: 1.7, wob: .8 });
      const sp = Math.exp(-(t - tp) * 7);   // the pick: a spark at the stroke's tip
      if (sp > .03 && t < 3) { glow(x1, 540, 50 + 70 * sp, C.goldLt, .9 * sp); glow(x1, 540, 18, PAL.cream, sp); }
    }
    // once the street is open, a few soft glows along the whole line (each glow composites the paint: keep them few)
    const kg = seg(t, 2.4, 2.72);
    if (kg > 0) for (let x = 80; x < W; x += 350) glow(x, 540, 170, C.gold, .4 * kAll * kg);
  }

  function shotA(t, lt, dur) {
    if (t < 2.73) {   // black with the line
      boilSeed('a-black'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: LID, ink: null });
      goldLine(t); return;
    }
    const cam = camA(t);
    ECH.street(cam, t, { gy: GY, lampEvery: 2 });
    ECH.splashes(t, cam.cx - 1000 / cam.z, cam.cx + 1000 / cam.z, GY, { n: 12, key: 'a' });
    ripple(t);
    drop(t);

    const mood = emotions(t, [[0, 'neutral', { lookY: .25, gloom: .12 }]]);
    const w = ECH.walkOn(t, X0, U, CK);
    // Echo: the same walk, evaluated late
    const lag = lagOf(t), te = t - lag, we = ECH.walkOn(te, X0, U, CK);
    const trip = t > T_DOWN + BEAT / 2 - .05 ? Math.exp(-(t - (T_DOWN + BEAT / 2 - .05)) * 3.2) : 0;
    const stall = t > T_DOWN && t < T_DOWN + BEAT / 2 + .05 ? Math.sin(seg(t, T_DOWN, T_DOWN + BEAT / 2 + .05) * Math.PI) : 0;
    const hurry = Math.sin(seg(t, 11.25, 11.9) * Math.PI);
    const quake = t > T_DROP ? Math.exp(-(t - T_DROP) * 2.2) * seg(t, T_DROP, T_DROP + .1) : 0;   // the ripple shakes the reflection
    const emo = emotions(t, [[0, 'neutral', { eyes: 'shine', lookY: .2 }], [T_DOWN + .12, 'surprised', { eyes: 'wide', emote: null, lookY: .5 }],
      [11.2, 'determined', { eyes: 'shine', lookY: .6 }], [11.95, 'neutral', { eyes: 'shine', lookY: .7 }]], { take: .6 });
    ECH.mirror(GY, () => ECH.echo(we.x, GY, U, { ...emo, ...we, dy: we.dy + emo.dy * .5 - .5 * stall, sq: (emo.sq || 0) + .12 * stall,
      rot: .22 * stall + .08 * trip * Math.sin((t - T_DOWN) * 18) + .1 * hurry, aL: we.aL + 1.1 * stall + .5 * hurry * Math.sin(t * 28), aR: .2 + .9 * stall,
      walk: we.walk + .12 * hurry * Math.sin(t * 20), sx: 1 + .12 * quake * Math.sin((t - T_DROP) * 34), dx: .35 * quake * Math.sin((t - T_DROP) * 21), halo: .45, boilKey: 'a-echo' }));
    clawd(w.x, GY, U, { ...mood, ...w, dy: w.dy + mood.dy * .4, sq: mood.sq, aL: w.aL, aR: w.aR, boilKey: 'a-clawd' });
    camEnd();

    ECH.rain(t);
    lids(t);
    goldLine(t);
  }
  shots([[ECH.S.A, shotA]]);
})();
