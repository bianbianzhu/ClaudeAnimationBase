// echoes/o_sync.js: shot O · in sync (204.86 → 220.60, bars 104–112, instrumental). See STORYBOARD_echoes.md.
//   Beats n are counted from the shot start (bar 104); lt = n · BEAT.
//   n0–4    N|O: gold flash .9 → 0 over 0.8 s while the camera pulls back from the merged Clawd close-up. The orbiting
//           shards settle into a row of stepping stones over the lake (the line). Clawd, happy, turns right (n3.2).
//   n4–8    four hops, landing on the beats (n5, 6, 7, 8): stone, stone, stone, then onto the water itself. Echo below
//           moves in perfect sync (lag 0). Used stones float up and away.
//   n8–12   the water holds. The three shadows from J rise out of the lake one per beat (n9, 10, 11), smiling; Clawd
//           takes, then beams.
//   n12–16  all four dance in step on the water (sway, then hop), their reflections in step below.
//   n16–20  a glint far right: the door of light rises on the line; everyone looks; the camera pans right; new shards
//           rise as a path. The shadows wave Clawd on.
//   n20–24  three hops toward the door, landing on the line at its threshold (n23). Clawd turns and waves goodbye.
//   n26–32  Clawd walks into the door; the light swallows it; the camera pushes in; gold then cream floods the frame
//           (cream = 1 at 220.60, the O|P seam; P fades out of it).
(() => {
  const { C, S } = ECH;
  const T0 = S.O, nb = n => T0 + n * BEAT;
  const LY = 700, U = 22, STH = 34;   // the line (lake surface), Clawd's size, how high the stones float
  const lin = x => clamp(x);

  // ---------- stepping stones (ECH.shard, turned so the top edge is flat) ----------
  const STONES = [
    { x: 520, s: 60 }, { x: 705, s: 56 }, { x: 890, s: 62 }, { x: 1075, s: 58 },
    { x: 1510, s: 57, rise: 18 }, { x: 1690, s: 61, rise: 18.6 },
  ];
  const OFFS = [4.28, 5.28, 6.28, 7.28, 21.28, 22.28];   // beat each stone is left
  const LANDS = [null, 5, 6, 7, null, 21, 22];
  // a stepping stone: a flat glass shard (painted like ECH.shard: gold one side, the inner world's periwinkle bleeding
  // through, ink edge, a cream glint), its top edge flat so Clawd can stand on it. (0, 0) = the middle of the top edge.
  function slab(s, key) {
    boilSeed('slab' + key);
    const h = hash(key.length * 7 + s), P = [[-s, -2 + 4 * h], [-.2 * s, -4], [s * .95, 1], [s * .7, s * .28], [s * (.1 + .3 * h), s * .62], [-s * .55, s * .34]];
    paint(P, { wash: C.goldLt, fill: C.echoLt, fillOp: 150, bleed: .2, tex: .5, ink: PAL.ink, sw: .7 });
    inkLine([[-s * .6, s * .08], [s * .15, s * .05]], .7, PAL.cream, 'inkfine', 0);
  }
  // orbit position (the end of shot N: shards circling the merged Clawd)
  const orbit = (i, t) => { const a = i * 2.39 + (t - T0) * .7, r = 170 + 70 * hash(i * 3.1); return [520 + Math.cos(a) * r * 1.3, 530 + Math.sin(a) * r * .8]; };
  function stoneState(i, t) {
    const st = STONES[i], lt = t - T0;
    let x = st.x, y = LY - STH + 3 * Math.sin(t * 2.1 + i * 1.7), sc = 1, rot = 0;
    const ln = LANDS[i + 1] ?? LANDS[i]; // not used
    if (i > 0 && i < 4) {   // settles from its orbit into the row
      const k = ease(seg(lt, .3 + .15 * i, 1.4 + .25 * i)), o = orbit(i, t);
      x = lerp(o[0], x, k); y = lerp(o[1], y, k); rot = (1 - k) * (1.2 + i);
    }
    if (st.rise) { const k = seg(t, nb(st.rise), nb(st.rise + 1.2)); sc = backOut(k); y += (1 - easeOut(k)) * 60; }
    const land = [null, nb(5), nb(6), nb(7), null, nb(21), nb(22)][i];
    if (land && t > land) y += 9 * Math.exp(-5 * (t - land)) * Math.cos(14 * (t - land));   // dips under the landing
    const off = nb(OFFS[i]);
    if (t > off + .1) { const k = ease(seg(t, off + .1, off + 3.2)); y -= 480 * k; x += 60 * k; rot += .5 * k * (i % 2 ? 1 : -1); sc *= 1 - .6 * k; }
    return { x, y, sc, rot };
  }
  function drawStone(i, t) {
    const S_ = stoneState(i, t), st = STONES[i];
    if (S_.sc <= .02) return;
    push(); translate(S_.x, S_.y); rotate(S_.rot); scale(S_.sc);
    if (st.rise) glow(0, 20, 120 * (1 - seg(t, nb(st.rise + .6), nb(st.rise + 2))), C.goldLt, .8);
    slab(st.s * 1.25, 'st' + i);
    pop();
  }

  // ---------- the three shadows from J, now friends ----------
  const BODY = [[-5, -8], [5, -8], [5, -2], [4, -2], [4, -.1], [3, -.1], [3, -2], [2, -2], [2, -.1], [1, -.1], [1, -2], [-1, -2], [-1, -.1], [-2, -.1], [-2, -2],
    [-3, -2], [-3, -.1], [-4, -.1], [-4, -2], [-5, -2]];
  const SHADES = [{ x: 1110, u: 18, n: 9 }, { x: 870, u: 15.5, n: 10 }, { x: 630, u: 19.5, n: 11 }];
  function shade(x, y, u, p, k, key, refl) {
    if (k <= .01) return;
    boilSeed('shade' + key + (refl ? 'r' : ''));
    const col = '#2A1D4A', op = (refl ? 120 : 215) * clamp(k * 1.6), sq = p.sq || 0;
    push(); translate(x + (p.dx || 0) * u, y + (p.dy || 0) * u); rotate(p.rot || 0); scale(1 + sq * .6, (1 - sq) * backOut(k));
    for (const [s, a] of [[-1, p.aL ?? .2], [1, p.aR ?? .2]]) {
      push(); translate(s * 4.9 * u, -4.5 * u); rotate(s < 0 ? a : -a);
      paint(rectPts(s < 0 ? -2.2 * u : 0, -.5 * u, 2.2 * u, u), { wash: col, washOp: op, ink: null });
      pop();
    }
    paint(BODY.map(([a, b]) => [a * u, b * u + jit(u * .05)]), { wash: col, washOp: op, fill: '#4A3478', fillOp: 90, bleed: .12, tex: .5, border: .4, ink: null });
    // wispy top edge: they are still made of shadow
    for (let i = 0; i < 3; i++) inkLine([[(-3 + i * 2.6) * u, -8 * u], [(-3.2 + i * 2.6) * u + jit(u * .2), (-8.7 - hash(i + key.length) * .6) * u]], .6, col, 'inkfine', .4);
    if (!refl && k > .7) {   // smiling cream eyes
      const sw = clamp(u / 13, .6, 2);
      for (const s of [-1, 1]) inkLine([[s * 2.5 * u - .9 * u, -5.7 * u], [s * 2.5 * u, -6.7 * u], [s * 2.5 * u + .9 * u, -5.7 * u]], sw * 1.2, PAL.cream, 'ink', .6);
      inkLine([[-.8 * u, -4.5 * u], [0, -4 * u], [.8 * u, -4.5 * u]], sw, PAL.cream, 'ink', .6);
    }
    pop();
  }
  // dance style shared by everyone (so they are in step)
  const danceOn = t => t >= nb(11.75) && t < nb(16.1);
  const danceStyle = t => t < nb(14) ? 'sway' : 'hop';
  function shadePose(i, t) {
    const sh = SHADES[i], lt = t - nb(sh.n);
    if (danceOn(t)) return move(danceStyle(t), t);
    const b = move('idle', t, i);
    const wv = Math.sin(t * TAU * 2.1 + i * 1.3);
    if (t < nb(12)) return { ...b, aR: 1.1 + .35 * wv, aL: .1 };                           // hello, Clawd
    if (t > nb(18) + i * .15) return { ...b, aR: 1.0 + .4 * wv, aL: .3 + .1 * wv };         // go on, go on
    return { ...b, aL: .2, aR: .3 };
  }
  const shadeK = (i, t) => seg(t, nb(SHADES[i].n) - .05, nb(SHADES[i].n) + .4);

  // ---------- Clawd: hops, dance, the door ----------
  const W1 = [1340, LY], W2 = [1860, LY];
  const HOPS = [[4.28, 5, 0, 1, 3.4], [5.28, 6, 1, 2, 3.4], [6.28, 7, 2, 3, 3.4], [7.28, 8, 3, 'W1', 4.6], [20.28, 21, 'W1', 4, 4], [21.28, 22, 4, 5, 3.6], [22.28, 23, 5, 'W2', 3.8]];
  const spot = (id, t) => id === 'W1' ? W1 : id === 'W2' ? W2 : (s => [s.x, s.y])(stoneState(id, t));
  const CK = [[T0, 'hopeful', { mouth: 'smile' }], [nb(1.6), 'happy'], [nb(9.15), 'surprised', { lookX: -.9 }], [nb(10.2), 'happy', { lookX: -.8 }],
    [nb(11.6), 'excited', { eyes: 'happy', mouth: 'grin', emote: 'music' }], [nb(16.25), 'surprised', { lookX: .8 }], [nb(17.3), 'hopeful', { lookX: .8 }],
    [nb(20), 'happy', { mouth: 'grin' }], [nb(24.2), 'happy', { lookX: -.8 }], [nb(25.6), 'hopeful', { lookX: .5 }]];
  const HEAD = [[nb(3.2), .25], [nb(8.55), 0], [nb(16.3), .125], [nb(19.9), .25], [nb(24.05), 0], [nb(25.5), .25]];
  function clawdState(t) {
    const emo = emotions(t, CK, { take: .7 }), hd = ECH.heading(t, 0, HEAD);
    let x = 520, y = stoneState(0, t).y, p = { ...emo, ...hd }, air = false;
    let last = null;
    for (const h of HOPS) if (t >= nb(h[0]) - .12) last = h;
    if (last) {
      const [n0, n1, a, b, hh] = last, t0 = nb(n0), t1 = nb(n1), j = jump(t, t0, t1, hh);
      const P1 = spot(b, Math.min(t, t1));
      if (t < t0) { [x, y] = spot(a, t); }
      else if (t < t1) {
        const P0 = spot(a, t0), k = (t - t0) / (t1 - t0); x = lerp(P0[0], P1[0], k); y = lerp(P0[1], P1[1], k); air = true;
      } else { [x, y] = spot(b, t); }
      p.dy = j.dy + (air ? 0 : emo.dy * .4); p.sq = j.sq + emo.sq * .5;
      if (air || t < t0) Object.assign(p, { view: 'side', flip: false, smear: 0 });
      if (air) Object.assign(p, { eyes: 'happy', mouth: 'open', aL: 1.35, aR: 1, noShadow: true, squint: 0 });
    } else { p.dy = emo.dy * .5; }
    if (danceOn(t)) { const m = move(danceStyle(t), t); Object.assign(p, m, { walk: null, sq: m.sq + emo.sq * .4, dy: m.dy + emo.dy * .3 }); }
    if (t > nb(18.6) && t < nb(19.4)) p.sq += .12 * Math.sin(seg(t, nb(18.6), nb(19.4)) * TAU * 2);   // a nod: two dips
    if (t > nb(24.2) && t < nb(25.6)) { p.aL = 1.2 + .45 * Math.sin((t - nb(24.2)) * TAU * 2.2); p.aR = .2; }   // goodbye wave
    if (t > nb(25.6)) {   // walk into the door
      const w = ECH.walkOn(t, W2[0], U, [[nb(25.7), 0], [nb(26), 1], [nb(30.3), 1], [nb(30.8), 0]]);
      x = w.x; Object.assign(p, { walk: w.moving ? w.walk : null, dy: w.dy + p.dy * .3, aL: w.aL + .3, aR: w.aR });
    }
    return { x, y, p };
  }
  // the merged Clawd's ember sits low in the chest (0, -3u), clear of the mouth (film-wide convention)
  const chest = key => (u) => ECH.ember(0, -3 * u, u * .55, T, .5, 'chest' + key);
  function merged(x, y, u, pose) {
    const { col, dk, lt, ...q } = pose;
    ECH.mirror(LY, () => ECH.echo(x, y, u, { ...q, emberK: 0, halo: .35, boilKey: 'oecho', draw: chest('oecho') }));
    ECH.masked(x, y, u, { ...q, noMask: true, emberK: 0, ...ECH.MERGED_COL, tint: null, boilKey: 'oclawd', draw: chest('oclawd') });
  }

  // ---------- the door ----------
  const DX = 2060, DH = 470;
  const doorH = t => DH * easeOut(seg(t, nb(16.5), nb(19.5)));
  const doorK = t => ease(seg(t, nb(16.3), nb(17.6)));
  function archPts(x, y, h, w, sgn = 1) {
    const P = [[x - w / 2, y]]; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; P.push([x + Math.cos(a) * w / 2, y - sgn * (h - w / 2) + sgn * Math.sin(a) * w / 2]); }
    P.push([x + w / 2, y]); return P;
  }

  // ---------- camera ----------
  function camAt(t) {
    const lt = t - T0;
    const cx = kf(t, [[T0, 520], [nb(4), 790], [nb(8), 1050], [nb(12), 1020], [nb(16), 1080], [nb(20), 1600], [nb(23), 1800], [nb(27), 1960], [nb(32), 2060]]);
    const cy = kf(t, [[T0, 530], [nb(6.5), 575], [nb(26), 570], [nb(32), 470]]);
    const z = kf(lt, [[0, 2.5], [nb(6.5) - T0, 1.04], [nb(12) - T0, 1.06], [nb(16) - T0, 1.04], [nb(20) - T0, 1.0], [nb(26) - T0, 1.02], [nb(32) - T0, 1.9]]);
    return { cx, cy, z };
  }

  // ---------- backdrop: both worlds woven together ----------
  const SKY_T = '#2B2156', SKY_B = '#EAA79C', WAT_T = '#B98AB0', WAT_B = '#1F1942';
  function bands(y0, y1, c0, c1, n, key) {
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const ya = lerp(y0, y1, i / n), c = mixCol(c0, c1, i / (n - 1));
      paint(rectPts(-80, ya, W + 160, y1 - ya + 80), { wash: c, ink: null });
      if (i) paint(rectPts(-80, ya - 30, W + 160, 60), { fill: c, fillOp: 80, bleed: .3, tex: .3, border: .2, ink: null });
    }
  }
  function backdrop(t, cam) {
    const yS = 540 + (LY - cam.cy) * cam.z;
    ECH.skyGrad(SKY_T, SKY_B, 'osky', 6, -60, yS + 20);
    glow(960 + (DX - cam.cx) * cam.z * .35, yS - 40, 520, C.gold, .45);
    bands(yS, H + 60, WAT_T, WAT_B, 5, 'owater');
    // parallax layers: stars (p .12), the far city (p .35), paper cutouts (p .6). base = the line in each layer.
    const lay = (p, fn) => { const cyp = 540 + (cam.cy - 540) * p, zp = 1 + (cam.z - 1) * p; ECH.layer(cam, p, () => fn(cyp + (yS - 540) / zp)); };
    lay(.12, base => {
      for (let i = 0; i < 44; i++) {
        const sx = -700 + 3400 * hash(i * 3.3 + 11), up = i < 30, dy = 30 + (up ? 520 : 380) * Math.pow(hash(i * 7.7 + 5), up ? .9 : 1.2), sy = up ? base - dy - 60 : base + dy;
        const tw = .5 + .5 * Math.sin(t * 2.2 + i * 1.7);
        boilSeed('ost' + i);
        paint(starPts(sx, sy, (4 + 6 * hash(i + 2)) * (.7 + .3 * tw), .35, 4), { wash: C.star, washOp: 140 + 110 * tw, ink: null });
      }
    });
    lay(.35, base => {
      ECH.mirror(base, () => ECH.skyline(-1400, 4200, base, { seed: 23, cam, p: .35, cols: ['#5A4684', '#4A3A74'], windows: false, hMin: 90, hMax: 230, ink: null }));
      boilSeed('ocityveil'); paint(rectPts(-1400, base, 5600, 360), { wash: WAT_T, washOp: 120, ink: null });
      ECH.skyline(-1400, 4200, base, { seed: 23, cam, p: .35, cols: ['#5E4680', '#4C3A72'], lit: .18, litCol: C.goldLt, hMin: 90, hMax: 230, ink: null });
    });
    lay(.6, base => {
      const CU = [['moon', 250, -430, 44], ['house', 900, -300, 40], ['star', 1500, -470, 30], ['door', 2150, -350, 38], ['small', 2800, -260, 36], ['house', 3300, -420, 34]];
      CU.forEach(([k, x, dy, s], i) => ECH.cutout(k, x + 30 * Math.sin(t * .4 + i), base + dy + 14 * Math.sin(t * .9 + i * 2), s, .15 * Math.sin(t * .5 + i), '#5A4690', 'o' + i));
      ECH.mirror(base, () => [['small', 600, -200, 34], ['moon', 1800, -260, 40], ['door', 2700, -200, 34]].forEach(([k, x, dy, s], i) =>
        ECH.cutout(k, x + 20 * Math.sin(t * .5 + i), base + dy + 10 * Math.sin(t * .8 + i), s, .2 * Math.sin(t * .4 + i), '#3E3272', 'ob' + i)));
    });
    return yS;
  }

  function shotO(t, lt, dur) {
    const cam = camAt(t);
    backdrop(t, cam);
    camBegin(cam.cx, cam.cy, cam.z);
    const vx0 = cam.cx - 1060 / cam.z, vx1 = cam.cx + 1060 / cam.z;
    ECH.ripples(t, vx0, vx1, LY + 14, LY + 520, { key: 'o', col: '#F6D7C0', n: 22 });
    // ambient shards: from their orbit (shot N) out to drift in the sky
    for (let i = 0; i < 7; i++) {
      const k = ease(seg(lt, .2 + .1 * i, 2.4 + .15 * i)), o = orbit(i + 5, t), home = [100 + i * 400, 120 + 200 * hash(i * 4.3)];
      const x = lerp(o[0], home[0], k), y = lerp(o[1], home[1], k) + 12 * Math.sin(t * 1.3 + i);
      ECH.shard(x, y, 12 + 9 * hash(i + 9), t * .3 * (hash(i) - .5) + i, i % 2 ? C.goldLt : '#F2B8C6', C.echoLt, 'amb' + i);
    }
    // reflections below the line: stones, shadows
    ECH.mirror(LY, () => { for (let i = 0; i < STONES.length; i++) drawStone(i, t); });
    SHADES.forEach((sh, i) => ECH.mirror(LY, () => shade(sh.x, LY, sh.u, shadePose(i, t), shadeK(i, t), 's' + i, true)));
    // the door (it mirrors itself)
    const glint = seg(t, nb(15.8), nb(16.3)) * (1 - seg(t, nb(17), nb(18)));
    if (glint > 0) { glow(DX, LY, 260 * glint, C.goldLt, 1); boilSeed('oglint'); paint(starPts(DX, LY, 60 * backOut(glint), .25, 4, t * .5), { wash: PAL.cream, ink: null }); }
    ECH.door(DX, LY, Math.max(1, doorH(t)), doorK(t), t, { key: 'o' });
    ECH.theLine(vx0 - 100, vx1 + 100, LY, 1, { key: 'o', glow: 0, sw: 1.8 });
    if (doorK(t) > .1) { glow(DX, LY, 380, C.goldLt, .6 * doorK(t)); ECH.theLine(1760, 2360, LY, doorK(t), { key: 'od', glow: 0, sw: 2.6, col: C.goldLt }); }
    for (let i = 0; i < STONES.length; i++) drawStone(i, t);
    // landing ripples on the water
    for (const [n, x, key] of [[8, W1[0], 'w1'], [23, W2[0], 'w2'], ...SHADES.map((s, i) => [s.n, s.x, 'sh' + i])]) {
      const a = t - nb(n); if (a > 0 && a < 2) ECH.rings(x, LY, a, { key: 'or' + key, ry: .12, speed: 200, life: 1.3, col: C.goldLt, n: 3, sw: 1 });
    }
    SHADES.forEach((sh, i) => shade(sh.x, LY, sh.u, shadePose(i, t), shadeK(i, t), 's' + i, false));
    const c = clawdState(t);
    merged(c.x, c.y, U, c.p);
    // the light swallows Clawd as it walks in
    const inK = seg(c.x, DX - 150, DX - 30), dw = DH * .42;
    if (inK > 0) {
      glow(DX, LY - 200, 520 * inK, PAL.cream, inK);
      boilSeed('odoorin');
      paint(archPts(DX, LY, DH, dw), { wash: C.goldLt, washOp: 235 * ease(inK), fill: PAL.cream, fillOp: 120, bleed: .15, ink: null });
      paint(archPts(DX, LY, DH, dw, -1), { wash: mixCol(C.goldLt, C.echoLt, .5), washOp: 210 * ease(inK), ink: null });
    }
    camEnd();
    if (lt < .8) flash(.9 * (1 - ease(lt / .8)), C.goldLt);
    flash(.75 * ease(seg(t, nb(28.3), nb(31))), C.goldLt);
    flash(easeIn(seg(t, nb(29.6), nb(32))), PAL.cream);
  }
  shots([[ECH.S.O, shotO]]);
})();
