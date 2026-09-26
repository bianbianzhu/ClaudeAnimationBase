// echoes/p_dawn.js: shot P · the city at dawn (220.60 → 236.34, bars 112–120, chorus 3 first half). See STORYBOARD_echoes.md.
//   Beats n are counted from the shot start (bar 112).
//   n0–8    O|P: out of the door's light. Cream flash 1 → 0 (0.9 s) while the door of light behind Clawd closes. The
//           street from B at dawn (rain gone, gold puddles). Merged Clawd skips right, unmasked and happy; masked
//           passers-by walk left, no umbrellas. The shop window from C waits ahead.
//   n8–16   the window: Clawd's reflection walks in the glass, in step; both stop (n10.5), both turn to face out (n11),
//           look at each other, both smile on the downbeat (n12), both nod (n13), hold, turn and go on (n15).
//   n16–24  Clawd sings (mouth shapes on the beats, rings and painted notes). A small passer-by stops, lowers its mask
//           (n19–20), smiles (n20.5) and lets the mask fall (n22.5).
//   n24–32  one per beat (n24, 25, 26, 27) the others' masks pop off and fall like leaves; happy faces. Clawd sings on,
//           then sets off right; the camera whips right: ECH.whipSmear 0 → 1 over the last 0.35 s (P|Q seam).
(() => {
  const { C, S } = ECH;
  const T0 = S.P, END = S.Q, nb = n => T0 + n * BEAT;
  const GY = 820, FY = 880, U = 24, CROWD_Y = 846;   // shop line, Clawd's walking line (nearer us), the crowd's line
  const WX = 912, WW = 900, WH = 560;                 // the shop window (shot C's glass, at dawn)
  const REFL_DX = 190, REFL_Y = GY - 34, REFL_S = .9;   // where the reflection stands inside the glass

  // ---------- Clawd ----------
  const WALK = [[T0, 1.5], [nb(9), 1.5], [nb(10.5), 0], [nb(16.2), 0], [nb(16.8), 2], [nb(20.5), 2], [nb(21.5), 0], [nb(30.2), 0], [nb(31.2), 2]];
  const CK = [[T0, 'happy'], [nb(11.5), 'hopeful', { lookX: .45, lookY: -.55 }], [nb(12), 'happy', { lookX: .3, lookY: -.4 }],
    [nb(16), 'happy', { eyes: 'happy' }], [nb(21.7), 'excited', { eyes: 'happy', emote: null }], [nb(30), 'happy']];
  const HEAD = [[nb(10.9), 0], [nb(15.1), .25], [nb(21.6), .125], [nb(30), .25]];
  const singing = t => t > nb(16) && t < nb(30.5);
  function clawdState(t) {
    const w = ECH.walkOn(t, 520, U, WALK), emo = emotions(t, CK, { take: .6 }), hd = ECH.heading(t, .25, HEAD);
    const p = { ...emo, ...hd, walk: w.moving ? w.walk : null, dy: w.dy + emo.dy * (w.moving ? .35 : .6), sq: emo.sq };
    if (w.moving) { p.aL = w.aL + .45; p.aR = .35; if (hd.view === 'side') p.view = 'side'; }
    if (t > nb(13) && t < nb(14.2)) { const k = seg(t, nb(13), nb(14.2)); p.sq += .13 * Math.sin(k * TAU * 2) * (1 - k * .4); p.dy += .25 * Math.sin(k * TAU * 2); }   // the nod
    if (singing(t)) {
      const f = frac(bpOf(t)), bn = beatN(t);
      p.mouth = f < .6 ? (bn % 2 ? 'O' : 'open') : 'smile';
      if (t > nb(22.3)) { p.aL = .9 + .3 * Math.sin(bpOf(t) * Math.PI); p.aR = .7 + .25 * Math.sin(bpOf(t) * Math.PI + 1); }
    }
    return { x: w.x, p, moving: w.moving };
  }
  function strip(pose) { const { col, dk, lt, ...q } = pose; return q; }
  // the merged Clawd's ember sits low in the chest (0, -3u), clear of the mouth (film-wide convention)
  const chest = key => (u) => ECH.ember(0, -3 * u, u * .55, T, .5, 'chest' + key);
  function merged(x, y, u, pose, key) { ECH.masked(x, y, u, { ...strip(pose), noMask: true, emberK: 0, ...ECH.MERGED_COL, tint: null, boilKey: key, draw: chest(key) }); }
  // the mouth in world space (for rings and notes); side and q views put it toward the heading
  function mouthAt(c) { const V = VIEWS[c.p.view] || VIEWS.front, mx = V.face ? (V.face.cx + V.face.mx * V.face.fw) : 0; return [c.x + mx * U * (c.p.flip ? -1 : 1), FY + ((c.p.dy || 0) - 4.3) * U]; }

  // ---------- the crowd ----------
  // x0: world x at the shot start; sp: steps per beat; stop: beat it stops (then faces Clawd); drop: beat its mask comes off.
  const CROWD = [
    { key: 'c0', x0: 150, u: 22, col: 3, sp: 1, seed: 1 },
    { key: 'c1', x0: 800, u: 19, col: 4, sp: 1, seed: 2 },
    { key: 'c2', x0: 1040, u: 21, col: 0, sp: 1, seed: 3 },
    { key: 'kid', x0: 2900, u: 16, col: 1, sp: 1.5, stop: 19, kid: true, seed: 4, y: 26 },
    { key: 'g1', x0: 3091, u: 21, col: 2, sp: 1, stop: 21, drop: 24, seed: 5, y: -12 },
    { key: 'g2', x0: 3320, u: 20, col: 5, sp: 1, stop: 22, drop: 25, seed: 6, y: 20 },
    { key: 'g3', x0: 3668, u: 22, col: 3, sp: 1, stop: 22.5, drop: 26, seed: 7, y: -18 },
    { key: 'g4', x0: 3794, u: 19, col: 0, sp: 1, stop: 23.5, drop: 27, seed: 8, y: 8 },
  ];
  function crowdState(m, t) {
    const K = m.stop ? [[T0, m.sp], [nb(m.stop - 1), m.sp], [nb(m.stop), 0]] : [[T0, m.sp]];
    const w = ECH.walkOn(t, 0, m.u, K), x = m.x0 - (w.x);
    const turned = m.stop && t > nb(m.stop + .2);
    const hd = turned ? turn(t, nb(m.stop + .2), nb(m.stop + .45), -.25, -.125) : { view: 'side', flip: true, smear: 0 };
    const o = { key: m.key, col: m.col, umbrella: 0, walk: w.moving ? w.walk : null, dy: w.dy, view: hd.view, flip: hd.flip, seed: m.seed, aL: .15 + .25 * Math.sin(w.walk * TAU) * (w.moving ? 1 : 0), aR: .1 };
    if (!w.moving) { const b = move('idle', t, m.seed); o.dy = b.dy + .1 * Math.sin(t * 2 + m.seed); o.sq = b.sq; }
    // the kid lowers its mask with both hands, smiles, then lets it drop
    if (m.kid) {
      const k = ease(seg(t, nb(19.2), nb(20.4)));
      if (t < nb(22.5)) { o.maskOff = [0, 4.3 * k]; o.aL = lerp(o.aL, -.35, k); o.aR = lerp(.1, -.4, k); }
      else o.noMask = true;
      if (t > nb(20.3)) Object.assign(o, faceOf(t, nb(20.3), m.seed));
    }
    if (m.drop) {
      const td = nb(m.drop);
      if (t > td - .12 && t < td) o.maskLift = .35 * seg(t, td - .12, td);
      if (t >= td) { o.noMask = true; Object.assign(o, faceOf(t, td, m.seed)); }
    }
    return { x, y: CROWD_Y + (m.y || 0), o };
  }
  // an unmasked face: a blink of surprise, then a real smile
  function faceOf(t, t0, seed) {
    const e = emotions(t, [[t0 - 1, 'neutral'], [t0, 'surprised'], [t0 + .45, 'happy']], { take: .5 });
    return { eyes: e.eyes, mouth: e.mouth, squint: e.squint, dy: e.dy * .6, sq: e.sq, lookX: -.4, emote: null };
  }
  // masks falling like leaves: pop up off the face, then flutter down on side-to-side arcs to the pavement
  function fallingMask(m, t, t0, fx, fy, u, i) {
    const a = t - t0; if (a < 0) return;
    const ground = FY + 40 + 20 * hash(i), up = 60 * easeOut(seg(a, 0, .35)), fallT = Math.max(0, a - .35);
    let y = fy - up + 70 * fallT + 10 * fallT * fallT, x = fx - 26 * a + 42 * Math.sin(fallT * 3.4 + i) * Math.min(1, fallT * 2);
    let rot = .55 * Math.sin(fallT * 3.4 + i + 1) * Math.min(1, fallT * 2) + a * .3, sx = .55 + .45 * Math.min(1, a * 4);
    if (y > ground) { y = ground; rot = .15 * (i % 2 ? 1 : -1); sx = 1; }
    else sx *= .75 + .25 * Math.abs(Math.cos(fallT * 3.4 + i));
    ECH.looseMask(x, y, u * .72, rot, { key: m.key, sx });
  }

  // ---------- the camera ----------
  function camAt(t, cx0) {
    const lead = kf(t, [[T0, 280], [nb(8), 220], [nb(11), 95], [nb(15.5), 95], [nb(19), 380], [nb(24), 450]]);
    let cx = cx0 + lead;
    const z = kf(t, [[T0, 1], [nb(10), 1], [nb(12.2), 1.42], [nb(15.2), 1.45], [nb(17.8), 1]]);
    const cy = kf(t, [[T0, 540], [nb(10), 540], [nb(12.2), 690], [nb(15.2), 690], [nb(17.8), 540]]);
    const wk = seg(t, END - .35, END); cx += 1500 * easeIn(wk);
    return { cx, cy, z };
  }

  function shotP(t, lt, dur) {
    const c = clawdState(t), cam = camAt(t, c.x);
    ECH.street(cam, t, { dawn: 1, gy: GY, key: 'p' });   // opens the camera
    // gold puddles on the pavement
    for (let i = Math.floor((cam.cx - 1300) / 430); i <= Math.floor((cam.cx + 1300) / 430); i++) {
      const px = i * 430 + 160 * hash(i * 3.1), py = 905 + 110 * hash(i * 5.3), rw = 110 + 90 * hash(i + 2);
      boilSeed('pud' + i);
      paint(ellPts(px, py, rw, rw * .16, 20, 2), { wash: '#F6CF7A', washOp: 150, fill: C.goldLt, fillOp: 90, bleed: .2, ink: null });
    }
    // the shop window, with the reflection walking inside it in perfect sync
    ECH.glassWindow(WX, GY, WW, WH, t, 1, () => {
      const rx = c.x + kf(t, [[nb(15.5), REFL_DX], [nb(20.5), REFL_DX + 150]]), lk = { lookX: -(c.p.lookX || 0) * .8, lookY: -(c.p.lookY || 0) };
      if (rx > WX - 140 && rx < WX + WW + 140) ECH.echo(rx, REFL_Y, U * REFL_S, { ...strip(c.p), ...(t > nb(11.5) && t < nb(15.2) ? lk : {}), emberK: 0, halo: .25, boilKey: 'pglass', noShadow: true, draw: chest('pglass') });
    });
    // the window's side pillars (they also hide the reflection as it slides in and out of the pane)
    const wallC = mixCol('#3F3868', '#CFA9A6', .8);
    for (const x0 of [WX - 150, WX + WW]) { boilSeed('pillar' + x0); paint(rectPts(x0, GY - WH - 150, 150, WH + 130, 2), { wash: wallC, fill: mixCol(wallC, PAL.ink, .35), fillOp: 55, tex: .55, ink: PAL.ink, sw: .8 }); }
    // out of the door's light
    const dk = 1 - ease(seg(lt, .25, 1.9));
    if (dk > 0) { ECH.door(360, FY, 470, dk, t, { mirror: false, key: 'p' }); glow(c.x, FY - 100, 520 * dk, C.goldLt, dk); }
    // the crowd behind Clawd
    const CS = CROWD.map(m => ({ m, s: crowdState(m, t) }));
    for (const { m, s } of CS) if (ECH.inView(cam, s.x, 200)) ECH.passerby(s.x, s.y, m.u, s.s ? s.o : s.o);
    // Echo in the puddles, then Clawd
    ECH.mirror(FY, () => ECH.echo(c.x, FY, U, { ...strip(c.p), emberK: 0, halo: .3, boilKey: 'ppud', noShadow: true, draw: chest('ppud') }));
    boilSeed('pwet'); paint(rectPts(c.x - 200, FY + 4, 400, 230), { wash: '#C9A7A8', washOp: 70, ink: null });
    merged(c.x, FY, U, c.p, 'pclawd');
    // falling masks
    CS.forEach(({ m, s }, i) => {
      if (m.drop) fallingMask(m, t, nb(m.drop), s.x - 1.2 * m.u, s.y - 5.3 * m.u, m.u, i);
      if (m.kid) fallingMask(m, t, nb(22.5), s.x - 1 * m.u, s.y - 1.1 * m.u, m.u, i);
    });
    // the song: rings from the mouth and painted notes floating up and right
    if (singing(t)) {
      const [mx, my] = mouthAt(c);
      for (let n = 16; n < 30; n += (n < 24 ? 2 : 1)) {
        const a = t - nb(n); if (a < 0 || a > 1.6) continue;
        ECH.rings(mx + 30, my, a, { key: 'ps' + n, n: 2, gap: .2, life: 1.2, speed: 300, col: PAL.cream, sw: 1.3 });
      }
      for (let n = 16.5; n < 30; n += 1) {
        const a = t - nb(n); if (a < 0 || a > 2.2) continue;
        const k = a / 2.2, p = arcPt([mx + 40, my - 20], [mx + 260 + 60 * hash(n), my - 260 - 60 * hash(n + 1)], 60, easeOut(k));
        boilSeed('pnote' + n); emote('music', p[0] + 16 * Math.sin(a * 5 + n), p[1], 13, k < .8 ? seg(a, 0, .25) : 1 - seg(k, .8, 1) * 1.02, a);
      }
    }
    camEnd();
    if (lt < .9) flash(1 - ease(lt / .9), PAL.cream);
    const wk = seg(t, END - .35, END); if (wk > 0) ECH.whipSmear(wk, t);
  }
  shots([[ECH.S.P, shotP]]);
})();
