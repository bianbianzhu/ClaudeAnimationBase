// b_city.js: "Beach Day" shots B–E, the town (16.135 → 51.885). See STORYBOARD_beach.md.
//   B (16.135): out of the light onto the street; Clawd knocks, Spike bursts out, the ball bonks Clawd's head.
//   C (26.135): the plaza fountain; Floatie asleep on the ring; Spike's lob; splash; Floatie hops out and shakes.
//   D (36.135): the café; Shades pops the parasol on the downbeat, high-fives down the line; the four march.
//   E (48.135): the edge of town; the break bar; they look at each other, nod, and jump (cut at the apex, 51.885).
(() => {
  const { bt, bar } = BCH;
  const B0 = bar(8), C0 = bar(13), D0 = bar(18), E0 = bar(24), E1 = bt(103.5);   // 16.135, 26.135, 36.135, 48.135, 51.885
  const U = 22;

  // ---------- helpers ----------
  const add = (a, b) => { const o = { ...a, ...b }; for (const f of ['dy', 'sq', 'rot', 'dx']) o[f] = (a[f] || 0) + (b[f] || 0); return o; };
  // distance covered: accelerate over acc s to speed v, then cruise
  const go = (t, t0, v, acc = .3) => { const k = t - t0; return k <= 0 ? 0 : k < acc ? v * k * k / (2 * acc) : v * (k - acc / 2); };
  // distance covered cruising at v from t0, braking to a stop at tStop over dec s
  const cruise = (t, t0, v, tStop, dec = .5) => {
    const k = t - t0, ks = tStop - t0, kd = ks - dec;
    if (k <= kd) return v * k;
    if (k <= ks) { const a = k - kd; return v * kd + v * a - v * a * a / (2 * dec); }
    return v * kd + v * dec / 2;
  };
  // a trot step driven by distance, so the legs stop when the body stops. mv 0..1 fades the bob.
  function stride(x, u, ph = 0, mv = 1) {
    const w = x / (6 * u) + ph, s = Math.sin(w * TAU);
    return { view: 'side', walk: w, dy: -Math.abs(Math.sin(w * Math.PI * 2)) * .55 * mv, sq: .05 * Math.max(0, Math.cos(w * TAU * 2)) * mv, aL: .25 * s * mv, rot: -.03 * mv };
  }
  // a walker: the mood's face over a trot (the mood's own bounce is damped so the trot reads)
  function walker(mood, x, u, ph, mv = 1) {
    const s = stride(x, u, ph, mv);
    return { ...mood, ...s, dy: (mood.dy || 0) * .25 + s.dy, sq: (mood.sq || 0) * .5 + s.sq, rot: s.rot };
  }
  const headTop = (y, u, o) => y + (o.dy || 0) * u - 8 * u * (1 - (o.sq || 0));
  // the near arm's tip in side view (world), plus `ext` u further along the arm: where a held ball sits
  function sideTip(x, y, u, o, ext = 1) {
    const f = o.flip ? -1 : 1, a = o.aL ?? .2, ang = .7 - a, L = 2.1 + ext;
    return [x + f * (1.6 + Math.cos(ang) * L) * u, y + (o.dy || 0) * u + (-4.2 + Math.sin(ang) * L) * u * (1 - (o.sq || 0))];
  }
  const ballHook = (key) => (u) => BCH.vball(u * 1.0, 0, u * 1.05, 0, key);
  const knockP = (t, kt) => t < kt - .12 ? 0 : t < kt ? -.5 * ease(seg(t, kt - .12, kt)) : Math.exp(-(t - kt) * 11);

  // ---------- the town ----------
  const BCOL = ['#F4B6A6', '#F7D9A0', '#A8D5C8', '#C9B8E0', '#F2C1C8', '#BFDCEB', '#EFD1A8', '#B8D8B0'];
  const ROOF = ['#C4506E', '#7B5CA8', '#3A7FA0', '#D97757'];
  function makeRow(seed, x0, x1) {
    const out = []; let x = x0, i = 0;
    while (x < x1) {
      const w = 250 + 150 * hash(seed + i * 1.7), h = 430 + 220 * hash(seed * 3 + i * 2.9 + 5);
      out.push({ id: seed * 100 + i, x, w, h, col: BCOL[Math.floor(hash(seed + i * 5.3) * BCOL.length)], roof: Math.floor(hash(seed + i * 7.7) * 3), door: x + w * (.3 + .4 * hash(seed + i * 9.1)), doorCol: ['#C4506E', '#7B5CA8', '#D97757', '#9A6A45'][i % 4] });
      x += w + 14 + 40 * hash(seed + i * 4.1); i++;
    }
    return out;
  }
  // give the building at x a special door there (moving it so the door sits inside)
  function fixDoor(row, x, o) { const b = row.find(b => b.x - 20 < x && x < b.x + b.w + 20); if (b.x + 80 > x || b.x + b.w - 80 < x) b.x = x - b.w / 2; Object.assign(b, { door: x }, o); return b; }

  function door(x, base, col, open = 0, inside = '#3A2E3F', key = '', shake = 0) {
    const w = 120, h = 210, x0 = x - w / 2 + shake, top = base - h;
    boilSeed('door' + key);
    paint(rectPts(x0 - 12, top - 14, w + 24, h + 14), { wash: mixCol(col, PAL.cream, .55), ink: PAL.ink, sw: .8 });
    paint(rectPts(x0, top, w, h), { wash: open > 0 ? inside : col, fill: open > 0 ? null : mixCol(col, PAL.ink, .3), fillOp: 50, tex: .5, ink: PAL.ink, sw: .8 });
    if (open <= 0) {
      paint(rectPts(x0 + 18, top + 20, w - 36, 70), { ink: mixCol(col, PAL.ink, .5), sw: .5 });
      paint(rectPts(x0 + 18, top + 110, w - 36, 80), { ink: mixCol(col, PAL.ink, .5), sw: .5 });
      paint(ellPts(x0 + w - 20, top + 110, 7, 7, 8), { wash: PAL.ochre, ink: PAL.ink, sw: .4 });
    } else {   // swung out toward us: a narrow panel left of the hinge
      const pw = w * (1 - .75 * clamp(open)) ;
      paint([[x0, top], [x0 - pw, top - 16 * open], [x0 - pw, base + 12 * open], [x0, base]], { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 60, ink: PAL.ink, sw: .8 });
      paint(ellPts(x0 - pw * .8, top + 110, 6, 7, 8), { wash: PAL.ochre, ink: PAL.ink, sw: .4 });
    }
    paint(rectPts(x0 - 20, base - 6, w + 40, 16), { wash: '#D9C6A8', ink: PAL.ink, sw: .6 });   // step
  }
  function building(b, base, t) {
    boilSeed('bld' + b.id);
    const { x, w, h } = b, col = mixCol(b.col, PAL.cream, .3), dk = mixCol(col, PAL.ink, .2), top = base - h, rc = ROOF[b.id % 4];
    if (b.roof === 0) paint([[x - 18, top + 4], [x + w / 2, top - Math.min(150, h * .24)], [x + w + 18, top + 4]], { wash: rc, fill: mixCol(rc, PAL.ink, .3), fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    if (b.roof === 2) paint(rectPts(x + w * .7, top - 70, 38, 72, 1), { wash: rc, ink: PAL.ink, sw: .8 });
    paint(rectPts(x, top, w, h, 2), { wash: col, fill: dk, fillOp: 45, bleed: .08, tex: .5, border: .5, ink: PAL.ink, sw: 1 });
    if (b.roof === 1) paint(rectPts(x - 14, top - 22, w + 28, 28, 1), { wash: mixCol(col, PAL.cream, .4), ink: PAL.ink, sw: .8 });
    if (b.roof === 2) paint(rectPts(x - 8, top - 12, w + 16, 16, 1), { wash: dk, ink: PAL.ink, sw: .7 });
    const nc = w > 330 ? 3 : 2, nr = Math.max(1, Math.floor((h - 280) / 130)), ww = 58, wh = 78;
    for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) {
      const wx = x + (c + .5) * w / nc - ww / 2, wy = base - 290 - r * 130 - wh;
      if (wy < top + 24) continue;
      paint(rrPts(wx, wy, ww, wh, 10), { wash: '#FFF3DC', fill: '#BFE3F0', fillOp: 110, tex: .3, ink: PAL.ink, sw: .8 });
      inkLine([[wx + ww / 2, wy + 5], [wx + ww / 2, wy + wh - 5]], .5, PAL.ink, 'inkfine', 0);
      if (hash(b.id * 1.3 + r * 3 + c) > .55) {   // window box with flowers
        paint(rectPts(wx - 6, wy + wh - 6, ww + 12, 14, 1), { wash: '#8C6A4A', ink: PAL.ink, sw: .5 });
        for (let f = 0; f < 3; f++) paint(ellPts(wx + 8 + f * 21, wy + wh - 9, 7, 7, 8), { wash: [PAL.rose, PAL.cream, PAL.ochre][(f + b.id) % 3], ink: null });
      }
    }
    if (!b.noDoor && !b.special && !NODOOR.some(([x, r]) => Math.abs(b.door - x) < r)) door(b.door, base, b.doorCol, 0, '', 'b' + b.id);
  }
  function lamp(x, base, key) {
    boilSeed('lamp' + key);
    inkLine([[x, base + 150], [x, base - 120], [x, base - 330]], 2.6, '#4A4458', 'ink', 0);
    inkLine([[x, base - 330], [x + 18, base - 356], [x + 44, base - 350]], 2, '#4A4458', 'ink', .6);
    paint([[x + 30, base - 352], [x + 58, base - 352], [x + 64, base - 318], [x + 24, base - 318]], { wash: '#FFF1C9', ink: PAL.ink, sw: .7 });
    paint(rectPts(x - 12, base + 136, 24, 18), { wash: '#4A4458', ink: null });
  }
  function streetTree(x, base, key, t) {
    boilSeed('tree' + key);
    const sw = 6 * wob(t, .4, hash(x * .01));
    paint(rectPts(x - 36, base + 110, 72, 44, 1), { wash: '#C98B6A', ink: PAL.ink, sw: .7 });
    inkLine([[x, base + 112], [x + 2, base - 60], [x + sw, base - 150]], 3, C_TRUNK, 'ink', .5);
    paint(ellPts(x + sw, base - 210, 100, 90, 22, 4), { wash: '#7DB36A', fill: '#4F8A4E', fillOp: 70, bleed: .12, tex: .6, ink: PAL.ink, sw: .9 });
    paint(ellPts(x + sw - 30, base - 240, 40, 28, 12), { fill: '#B9DC8F', fillOp: 110, bleed: .2, ink: null });
  }
  const C_TRUNK = '#8A5C3C';
  // sidewalk and road in 600-px tiles, each with its own seed, so scrolling never re-boils them
  function street(x0, x1, base, key = 's') {
    for (let k = Math.floor(x0 / 600); k * 600 < x1; k++) {
      const x = k * 600;
      boilSeed('st' + key + k);
      paint(rectPts(x - 4, base, 608, 184), { wash: '#EADBC4', fill: '#D8C3A5', fillOp: 55, tex: .6, border: .2, ink: null });
      paint(rectPts(x - 4, base + 184, 608, 480), { wash: '#B9B3C2', fill: '#9C95A8', fillOp: 50, tex: .5, ink: null });
      paint(rectPts(x - 4, base + 172, 608, 20), { wash: '#F6EEDD', ink: null });
      inkLine([[x - 4, base + 171], [x + 604, base + 171]], .8, PAL.ink, 'ink', 0);
      inkLine([[x - 4, base + 192], [x + 604, base + 192]], .6, PAL.ink, 'inkfine', 0);
      inkLine([[x - 4, base], [x + 604, base]], .9, PAL.ink, 'ink', 0);
      for (let j = 0; j < 5; j++) inkLine([[x + j * 120 + 30, base + 6], [x + j * 120 + 18, base + 166]], .4, mixCol('#D8C3A5', PAL.ink, .3), 'inkfine', 0);
      for (let j = 0; j < 2; j++) paint(rectPts(x + j * 300 + 60, base + 320, 150, 14), { wash: '#F6EEDD', ink: null });
    }
  }
  // pale towers far behind, in screen space, scrolling at a third of the camera
  function skyline(scroll, base, key = 'sk', col = '#CFD8EA') {
    const P = 210, i0 = Math.floor((scroll - 200) / P);
    for (let i = i0; i < i0 + 12; i++) {
      boilSeed(key + i);
      const x = i * P - scroll, h = 330 + 260 * hash(i * 3.3 + 1), w = 150 + 50 * hash(i * 1.9);
      paint(rectPts(x, base - h, w, h + 40), { wash: mixCol(col, '#E9E4F2', hash(i * 5.1) * .6), ink: mixCol(col, PAL.ink, .35), sw: .5 });
      if (hash(i * 2.2) > .6) paint([[x + w * .3, base - h], [x + w * .5, base - h - 60], [x + w * .7, base - h]], { wash: mixCol(col, PAL.ink, .1), ink: null });
    }
  }
  function townSky(t, scroll, key) {
    BCH.skyGrad('#9FD3EC', '#FCE3C8', 'sky' + key, 8);
    for (let i = 0; i < 3; i++) {
      const x = ((200 + i * 760 - t * 14 - scroll * .08) % 2400 + 2400) % 2400 - 250;
      BCH.cloud(x, 150 + 90 * hash(i + 2), 120 + 50 * hash(i + 7), PAL.cream, 0, key + i, { shade: '#9FB8E0', ph: i });
    }
  }
  function drawRow(row, base, t, cx, zoom) {
    const hw = W / 2 / zoom + 80;
    for (const b of row) if (b.x + b.w > cx - hw - 100 && b.x < cx + hw + 100) building(b, base, t);
  }
  let NODOOR = [];   // [[x, r], ...]: no ordinary doors (or street props) within r of x, so a special door is the only one
  function props(x0, x1, base, t, key, every = 900, off = 300) {
    for (let k = Math.floor((x0 - off) / every); k * every + off < x1 + 100; k++) {
      const x = k * every + off;
      if (NODOOR.some(([nx, r]) => Math.abs(x - nx) < r)) continue;
      if (k % 2) lamp(x, base, key + k); else streetTree(x, base, key + k, t);
    }
  }
  // knock marks: three short strokes springing off a point
  function knockMarks(x, y, age, dir) {
    if (age < 0 || age > .28) return;
    const k = easeOut(age / .28);
    for (let i = 0; i < 3; i++) { const a = (dir > 0 ? 0 : Math.PI) + (i - 1) * .6, r0 = 16 + 14 * k, r1 = r0 + 26 * (1 - k * .5); inkLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], 1.3 * (1 - k * .6), PAL.ink, 'ink', 0); }
  }
  function puff(x, y, age, s = 1, key = '') {
    if (age < 0 || age > .6) return;
    const k = easeOut(age / .6);
    for (let i = 0; i < 3; i++) { boilSeed('puff' + key + i); const r = (26 + 10 * i) * s * (1 - k * .4); paint(ellPts(x + (i - 1) * 40 * s * (1 + k), y - 16 * s - 30 * k * s - 8 * i * s, r, r * .8, 14, r * .06), { fill: PAL.cream, fillOp: 200 * (1 - k), bleed: .15, tex: .4, ink: null }); }
  }
  const star = (x, y, r, k) => BCH.sparkle(x, y, r, k);

  // ======================= B · the street: Spike =======================
  const GYB = 860, BASEB = 800, HOMEX = 880, DOORX = 1900, KX = DOORX + 235, SX = DOORX - 160, FXB = 1990;
  const B_STOP = 19.45, KNOCKS = [bt(39.5), bt(40)], B_OPEN = bt(41), B_LAND = 21.05;        // 19.885, 20.135, 20.635
  const B_TOSS = bt(43), B_BUMP = bt(44), B_BONK = bt(45.5), B_CATCH = bt(47), B_OFF = bt(49); // 21.635, 22.135, 22.885, 23.635, 24.635
  const rowB = makeRow(11, -600, 5600);
  fixDoor(rowB, HOMEX, { special: 'home', col: '#F2C1C8' });
  fixDoor(rowB, DOORX, { special: 'spike', col: '#F7D9A0' });
  const xClawdB = t => t < 24.8 ? lerp(HOMEX + 20, KX, 1 - Math.pow(1 - seg(t, B0, B_STOP), 1.7)) : KX + go(t, 24.8, 330);
  const xSpikeB = t => SX + go(t, 24.85, 330);
  function shotB(t, lt, dur) {
    const xc = xClawdB(t);
    const cx = t < 24.8 ? lerp(xc + 180, FXB, ease(seg(t, 18.9, 19.9))) : FXB + (xc - KX);
    const zoom = kf(t, [[B0, 1.08], [19.0, 1.08], [20.2, 1.3], [24.7, 1.3], [25.8, 1.08]]), cy = kf(t, [[19, 580], [20.2, 640], [24.7, 640], [25.8, 580]]);
    NODOOR = [[DOORX + 100, 520], [HOMEX, 380]];
    townSky(t, cx * .3, 'B');
    skyline(cx * .3, 760, 'skB');
    camBegin(cx, cy, zoom);
    street(cx - 1200, cx + 1200, BASEB, 'B');
    drawRow(rowB, BASEB, t, cx, zoom);
    // Clawd's front door: open, warm light spilling out
    door(HOMEX, BASEB, '#E27A92', 1, '#FFE3A6', 'home');
    glow(HOMEX, BASEB - 100, 260, '#FFD98A', .8 * (1 - seg(t, B0, B0 + 3)));
    // Spike's blue door: knocked, then banged open
    const open = t < B_OPEN ? 0 : backOut(seg(t, B_OPEN, B_OPEN + .18));
    const dshake = t < B_OPEN ? KNOCKS.reduce((s, k) => s + 3 * Math.exp(-(t - k) * 20) * (t > k ? 1 : 0), 0) : 6 * spring(t, B_OPEN, 9, 50);
    door(DOORX, BASEB, '#4C7FC0', open, '#3A2E3F', 'spike', dshake);
    props(cx - 1100, cx + 1100, BASEB, t, 'B');
    puff(DOORX - 90, BASEB - 10, t - B_OPEN, 1, 'door');

    // ---- Spike: pose first, so the ball can sit on it ----
    let sp = null, spX = SX, spY = GYB, spU = U + 2;
    if (t >= B_OPEN + .03) {
      const moodS = emotions(t, [[B_OPEN, 'excited'], [21.5, 'happy', { lookY: -1 }], [22.95, 'laugh'], [24.6, 'happy']]);
      if (t < B_LAND) {   // bursts out of the doorway, growing as it comes toward us
        const k = seg(t, B_OPEN + .03, B_LAND);
        [spX, spY] = arcPt([DOORX, BASEB + 10], [SX, GYB], 150, k); spU = lerp(U - 4, U + 2, k);
        sp = { ...moodS, sq: -.15 * Math.sin(k * Math.PI), aL: 1.25, aR: 1.3 };
      } else if (t < B_OFF) {
        const land = .22 * Math.exp(-8 * (t - B_LAND)) * Math.cos(20 * (t - B_LAND));
        const armsUp = t < B_TOSS + .05 ? 1.25 : t > B_CATCH - .35 ? lerp(.4, 1.25, backOut(seg(t, B_CATCH - .35, B_CATCH - .1))) : .35;
        const head = t > B_BUMP - .15 ? (t < B_BUMP ? { sq: .14 * ease(seg(t, B_BUMP - .15, B_BUMP)) } : { dy: -1.2 * Math.exp(-7 * (t - B_BUMP)), sq: -.18 * Math.exp(-6 * (t - B_BUMP)) }) : {};
        sp = add({ ...moodS, aL: armsUp, aR: armsUp + .05, lookX: t > B_BUMP ? 1 : .2, sq: (moodS.sq || 0) + land }, head);
        if (t > 22.95 && t < B_CATCH - .35) { sp.aL = -.4; sp.aR = -.35; }
      } else {
        sp = { ...walker(moodS, xSpikeB(t), spU, BCH.CAST.spike.ph, seg(t, 24.85, 25.1)), ...turn(t, B_OFF, B_OFF + .17, 0, .25), armL: ballHook('B') };
        if (t > B_OFF + .17) Object.assign(sp, stride(xSpikeB(t), spU, BCH.CAST.spike.ph, seg(t, 24.85, 25.1)), { armL: ballHook('B') });
        spX = xSpikeB(t);
      }
    }
    // ---- Clawd ----
    const moodC = emotions(t, [[B0, 'happy'], [B_OPEN + .07, 'surprised', { lookX: -1 }], [21.35, 'excited', { lookX: -1 }], [22.25, 'neutral', { lookY: -1 }], [B_BONK + .05, 'dizzy'], [23.9, 'laugh'], [24.6, 'happy']]);
    let cl;
    if (t < B_STOP) cl = walker(moodC, xc, U + 2, 0, 1 - seg(t, B_STOP - .35, B_STOP));
    else if (t < B_OFF) {
      const kn = KNOCKS.reduce((s, k) => s + knockP(t, k), 0);
      cl = { ...moodC, ...turn(t, B_STOP, B_STOP + .17, .25, 0) };
      if (t < B_OPEN + .07) Object.assign(cl, { aL: .12 + .22 * kn, rot: -.07 * kn, lookX: -1, eyes: 'happy', mouth: 'smile', squint: 0 });
      if (t > B_BONK) cl.sq = (cl.sq || 0) + .34 * Math.exp(-7 * (t - B_BONK)) * Math.cos(15 * (t - B_BONK));
    } else {
      cl = { ...moodC, ...turn(t, B_OFF, B_OFF + .17, 0, .25) };
      if (t > B_OFF + .17) cl = walker(moodC, xc, U + 2, 0, seg(t, 24.8, 25.05));
    }
    // the ball
    let ball = null;
    const spTop = sp ? headTop(spY, spU, sp) : 0, clTop = headTop(GYB, U + 2, cl), R = 1.3 * (U + 2);
    if (sp && t < B_OFF) {
      const inHands = [spX, spTop - 2.1 * spU];
      if (t < B_TOSS) ball = inHands;
      else if (t < B_BUMP) ball = arcPt(inHands, [spX, spTop - R], 190, seg(t, B_TOSS, B_BUMP));
      else if (t < B_BONK) ball = arcPt([spX, spTop - R], [xc, clTop - R], 330, seg(t, B_BUMP, B_BONK));
      else if (t < B_CATCH) ball = arcPt([xc, clTop - R], inHands, 240, seg(t, B_BONK, B_CATCH));
      else ball = inHands;
      if (t > 22.2 && t < B_BONK) { cl.lookX = clamp((ball[0] - xc) / 300, -1, 1); cl.lookY = -1; }
    }
    if (sp) BCH.buddy('spike', spX, spY, spU, sp);
    BCH.buddy('clawd', xc, GYB, U + 2, { ...cl, ukeBack: true });
    KNOCKS.forEach(k => knockMarks(DOORX + 66, BASEB - 108, t - k, 1));
    if (ball) { BCH.vball(ball[0], ball[1], R, t * 9, 'B'); if (t > B_BONK && t < B_BONK + .35) star(xc, clTop - 10, 60, seg(t, B_BONK, B_BONK + .35)); }
    camEnd();
    flash(1 - ease(seg(lt, 0, .5)), PAL.cream);
    BCH.whip(seg(lt, dur - .25, dur), 'h');
  }

  // ======================= C · the fountain: Floatie =======================
  const GYC = 950, FC = 700, RIMY = 790, WY = 806, LX = 880, ZC = 1.4, CYC = 693;
  const C_STOP = 27.6, C_TURN = 27.95, C_WAVE = bt(57), C_LOOK = 29.35, C_THROW = bt(60), C_SPLASH = 30.85, C_HOP = bt(65), C_HLAND = 33.05, C_OFF = bt(68);
  const SPX = 900;   // where the ball splashes down
  const stopC = { clawd: 1430, spike: 1170 };
  const dC = t => cruise(t, C0, 380, C_STOP, .8);
  const dC0 = cruise(C_STOP + 1, C0, 380, C_STOP, .8);
  const xCwalk = (n, t) => stopC[n] - dC0 + dC(t);
  const offC = (t, lag = 0) => go(t, C_OFF + .2 + lag, 320);
  const floatX = t => 760 + 22 * Math.sin(t * .9);
  const camC = t => kf(t, [[C0, 720], [C_STOP + .2, 1000]]) + 10 * Math.sin(t * .4) * (1 - seg(t, 33, 34.3)) + offC(t) * ease(seg(t, 34.4, 35.3));
  function fountainBack(t) {
    boilSeed('fbase');
    paint(ellPts(FC, RIMY, 380, 84, 36, 1), { wash: '#E6DCCB', fill: '#BFB2A0', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
    paint(ellPts(FC, WY - 4, 345, 66, 36, 1), { wash: '#7CCBD0', fill: '#4FA7B5', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 3; i++) { boilSeed('fring' + i); const k = frac(t * .35 + i / 3); paint(ellPts(FC + 60, WY, 80 + 240 * k, 16 + 44 * k, 24), { ink: PAL.foam, sw: 1.2 * (1 - k), br: 'inkfine' }); }
    boilSeed('fcol');
    paint(rectPts(FC - 34, 560, 68, 250, 1), { wash: '#E6DCCB', fill: '#BFB2A0', fillOp: 80, tex: .6, ink: PAL.ink, sw: .9 });
    paint(ellPts(FC, 562, 130, 26, 24), { wash: '#E6DCCB', fill: '#BFB2A0', fillOp: 60, ink: PAL.ink, sw: .9 });
    paint(ellPts(FC, 555, 112, 16, 20), { wash: '#7CCBD0', ink: null });
    paint(rectPts(FC - 12, 470, 24, 90, 1), { wash: '#E6DCCB', ink: PAL.ink, sw: .8 });
    // water: a spout and four falling sheets, their dashes running down
    for (let i = 0; i < 4; i++) {
      boilSeed('fall' + i);
      const s = i < 2 ? -1 : 1, far = i % 2 ? 1 : .6, P = [[FC + s * 110 * far, 566], [FC + s * 150 * far, 640], [FC + s * 175 * far, WY - 8]];
      inkLine(P, 2.2, '#DDF4F4', 'dry', .5);
      for (let d = 0; d < 3; d++) { const k = frac(t * 1.4 + d / 3 + i * .17), p = through(P, 6)[Math.floor(k * 12)]; if (p) paint(ellPts(p[0], p[1], 5, 8, 8), { wash: PAL.foam, ink: null }); }
    }
    boilSeed('spout');
    const sp = [[FC, 470], [FC - 18, 420], [FC - 60, 440], [FC - 95, 552]], sp2 = sp.map(([x, y]) => [2 * FC - x, y]);
    inkLine(sp, 2.4, '#DDF4F4', 'dry', .5); inkLine(sp2, 2.4, '#DDF4F4', 'dry', .5);
    glow(FC, 440, 60, '#FFFFFF', .25);
  }
  function fountainFront() {
    boilSeed('ffront');
    const top = [], bot = [];
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI, x = FC + Math.cos(a) * 380, y = RIMY + Math.sin(a) * 84; top.push([x, y]); bot.push([x, y + 92]); }
    paint(top.concat(bot.reverse()), { wash: '#E9DFCF', fill: '#BFB2A0', fillOp: 80, tex: .7, border: .5, ink: PAL.ink, sw: 1 });
    inkLine(top.map(([x, y]) => [x, y + 16]), .6, mixCol('#BFB2A0', PAL.ink, .3), 'inkfine', .5);
    for (let i = 1; i < 8; i++) { const a = i / 8 * Math.PI, x = FC + Math.cos(a) * 380, y = RIMY + Math.sin(a) * 84; inkLine([[x, y + 18], [x, y + 90]], .5, mixCol('#BFB2A0', PAL.ink, .3), 'inkfine', 0); }
  }
  function plaza(t, cx) {
    townSky(t, cx * .3, 'C');
    skyline(cx * .3 + 400, 700, 'skC');
    camBegin(cx, CYC, ZC);
    const row = ROWC;
    drawRow(row, 740, t, cx, ZC);
    boilSeed('plaza');
    paint(rectPts(-800, 740, 4200, 500), { wash: '#EFDFC6', fill: '#D9C19E', fillOp: 60, tex: .6, border: .2, ink: null });
    inkLine([[-800, 740], [3400, 740]], .9, PAL.ink, 'ink', 0);
    for (let i = 0; i < 26; i++) { boilSeed('cob' + i); const x = -300 + ((i * 263) % 3000), y = 780 + ((i * 97) % 280); paint(ellPts(x, y, 26, 10, 10), { ink: mixCol('#D9C19E', PAL.ink, .35), sw: .5, br: 'inkfine' }); }
  }
  const ROWC = makeRow(23, -900, 4600);
  function shotC(t, lt, dur) {
    const cx = camC(t);
    NODOOR = [[FC, 420]];
    plaza(t, cx);
    lamp(1780, 740, 'C1'); streetTree(-40, 740, 'C2', t); streetTree(2350, 740, 'C3', t);
    fountainBack(t);
    // ---- Floatie ----
    const moodF = emotions(t, [[C0, 'sleepy'], [bt(62), 'surprised', { lookX: .7 }], [bt(63.5), 'happy', { lookX: 1, eyes: 'shine' }], [33.15, 'laugh', { eyes: 'squeeze', mouth: 'grin', emote: null }], [34.0, 'happy', { eyes: 'shine' }]]);
    const handX = floatX(t) + 7.1 * U;
    let fx = floatX(t), fy = WY + 2.95 * U - 4, fo, inWater = t < C_HOP + .12;
    let fball = null;   // the ball, while it's loose
    const ballR = 1.05 * U;
    if (t < C_HOP) {
      const bob = .12 * Math.sin(bpOf(t) * Math.PI);
      fo = { ...moodF, noLegs: true, noShadow: true, dy: (moodF.dy || 0) * .2 + bob, rot: .04 * Math.sin(t * .9) };
      if (t > 32.25) fo.aR = lerp(fo.aR ?? .2, -.05, ease(seg(t, 32.25, C_HOP)));
    } else if (t < C_HLAND) {
      const k = seg(t, C_HOP, C_HLAND);
      [fx, fy] = arcPt([floatX(C_HOP), WY + 2.95 * U - 4], [LX, GYC], 190, k);
      fo = { ...moodF, noLegs: k < .25, noShadow: k < .5, sq: -.14 * Math.sin(k * Math.PI), aL: .9, aR: 1.1 };
    } else if (t < C_OFF) {
      const a = t - C_HLAND, sh = seg(t, 33.15, 33.3) * (1 - seg(t, 33.85, 34.0));
      fx = LX; fy = GYC;
      fo = add({ ...moodF, aL: .6 + .4 * Math.sin(a * 40) * sh, aR: 1.15 }, { sq: .22 * Math.exp(-8 * a) * Math.cos(20 * a), rot: .22 * Math.sin(a * TAU * 7) * sh, dx: .5 * Math.sin(a * TAU * 7 + 1) * sh });
    } else {
      fx = LX + offC(t, .2);
      fo = { ...moodF, ...turn(t, C_OFF + .15, C_OFF + .32, 0, .25) };
      if (t > C_OFF + .32) fo = walker(moodF, fx, U, BCH.CAST.floatie.ph, seg(t, C_OFF + .4, C_OFF + .6));
    }
    if (t < C_THROW) fball = null;
    else if (t < C_SPLASH) fball = arcPt(SPINE_THROW, [SPX, WY - 6], 300, seg(t, C_THROW, C_SPLASH));
    else if (t < C_HOP) fball = [lerp(SPX, handX + ballR * .9, ease(seg(t, 31.4, 32.5))), WY - 8 + 5 * Math.sin(t * 5)];
    // Floatie holds the ball from the grab until the toss to Spike
    const holdF = t >= C_HOP && t < 34.5;
    if (holdF) { if (t < C_OFF + .25) fo.armR = ballHook('C'); else fo.armL = ballHook('C'); }
    if (inWater) {   // floating: draw, then the water's front edge over the bottom of the body
      BCH.buddy('floatie', fx, fy, U, fo);
      boilSeed('ripple');
      paint(ellPts(fx, WY + 24, 6.2 * U, 13, 20), { wash: '#7CCBD0', washOp: 240, ink: null });
      inkLine([[fx - 6.4 * U, WY + 16], [fx, WY + 26], [fx + 6.4 * U, WY + 16]], .9, PAL.foam, 'inkfine', .5);
      if (t < C_HOP && t > 27 && moodF.emote === 'zzz') {}   // (zzz comes from the sleepy emote)
    }
    if (fball) BCH.vball(fball[0], fball[1], ballR, t * 7, 'C');
    BCH.drops(SPX, WY - 10, 12, t - C_SPLASH, 420, 'splash', '#A9E0EC', 1.3);
    if (t > C_SPLASH) for (let i = 0; i < 2; i++) { boilSeed('sring' + i); const k = seg(t, C_SPLASH + i * .15, C_SPLASH + 1.1 + i * .15); if (k > 0 && k < 1) paint(ellPts(SPX, WY, 30 + 170 * k, 8 + 34 * k, 20), { ink: PAL.foam, sw: 1.6 * (1 - k), br: 'inkfine' }); }
    BCH.drops(floatX(C_HOP), WY, 8, t - C_HOP, 320, 'hop', '#A9E0EC', 1);
    fountainFront();
    if (!inWater) BCH.buddy('floatie', fx, fy, U, fo);
    [33.22, 33.48, 33.74].forEach((s, i) => BCH.drops(LX, GYC - 5 * U, 12, t - s, 640, 'shake' + i, '#A9E0EC', 1.6));

    // ---- Clawd and Spike ----
    const moodC = emotions(t, [[C0, 'happy'], [C_TURN + .12, 'surprised', { lookX: -1 }], [28.5, 'happy', { lookX: -1 }], [C_LOOK, 'confused', { lookX: -.6 }], [C_SPLASH + .1, 'surprised', { lookX: -1 }], [bt(63.5), 'happy', { lookX: -1 }], [33.3, 'nervous', { emote: 'sweat', lookX: -1 }], [C_OFF, 'laugh']]);
    const moodS = emotions(t, [[C0, 'happy'], [29.55, 'mischief', { lookX: 1 }], [C_THROW, 'excited', { lookX: -1 }], [C_SPLASH + .1, 'laugh'], [33.3, 'nervous', { emote: 'sweat', lookX: -1 }], [C_OFF, 'happy']], { take: .5 });
    const pose = (n, mood, ph, waveOff) => {
      const x = t < C_OFF ? xCwalk(n, t) : stopC[n] + offC(t, n === 'spike' ? .1 : 0);
      let o;
      if (t < C_STOP) o = walker(mood, x, U, ph, 1 - seg(t, C_STOP - .4, C_STOP));
      else if (t < C_OFF + .05) {
        o = { ...mood, ...turn(t, C_TURN + (ph ? .08 : 0), C_TURN + .2 + (ph ? .08 : 0), .25, -.02) };
        if (t > C_WAVE - .1 && t < C_LOOK) { const b = bpOf(t) + waveOff; o.aL = 1.15 + .5 * Math.sin(b * TAU * 2); o.lookX = -1; }
        if (t > 33.2) o.rot = (o.rot || 0) + .1 * ease(seg(t, 33.2, 33.35)) * (1 - seg(t, 33.95, 34.1)), o.lookX = -1;
      } else {
        const lag = n === 'spike' ? .1 : 0;
        o = { ...mood, ...turn(t, C_OFF + lag, C_OFF + lag + .17, 0, .25) };
        if (t > C_OFF + lag + .17) o = walker(mood, x, U, ph, seg(t, C_OFF + .25, C_OFF + .45));
      }
      return [x, o];
    };
    const [xs, so] = pose('spike', moodS, BCH.CAST.spike.ph, .3);
    const [xc2, co] = pose('clawd', moodC, 0, 0);
    // Spike: carries the ball in, winds up and lobs it; later catches Floatie's pass
    if (t < C_STOP) so.armL = ballHook('C');
    else if (t < C_THROW) {
      so.armL = ballHook('C');
      if (t > C_LOOK) { so.aL = lerp(so.aL ?? .2, -.9, ease(seg(t, C_THROW - .35, C_THROW))); so.sq = (so.sq || 0) + .07 * ease(seg(t, C_THROW - .35, C_THROW)); }
    } else if (t < C_THROW + .5) so.aL = lerp(1.5, .4, ease(seg(t, C_THROW, C_THROW + .5)));
    if (t > 35.0) so.armL = ballHook('C');
    BCH.buddy('spike', xs, GYC, U, so);
    BCH.buddy('clawd', xc2, GYC, U, { ...co, ukeBack: true });
    // the pass back, Floatie → Spike, on the move
    if (t >= 34.5 && t <= 35.0) {
      const p0 = sideTip(fx, GYC, U, fo, 1), p1 = sideTip(xs, GYC, U, so, 1);
      const b = arcPt(p0, p1, 190, seg(t, 34.5, 35.0)); BCH.vball(b[0], b[1], ballR, t * 7, 'C');
    }
    camEnd();
    BCH.whip(1 - seg(lt, 0, .3), 'h');
  }
  // where Spike's lob leaves the hand: the arm tip at the release pose (front view, left arm raised to 1.5)
  const SPINE_THROW = [stopC.spike - (4.9 + .55 * clamp((1.5 - .7) / .9) + 2.2 * Math.cos(1.5) + 1) * U, 950 - (4.5 + 2.2 * Math.sin(1.5)) * U];

  // screen positions of the three at the C→D cut, so D picks them up exactly
  const C_END = D0;
  const cutX = n => ({ clawd: stopC.clawd + offC(C_END), spike: stopC.spike + offC(C_END, .1), floatie: LX + offC(C_END, .2) })[n];   // world x, same camera

  // ======================= D · the café: Shades =======================
  const GYD = 950, BASED = 870, D_STOP = 38.4, SHY = 902;
  const D_LOOK = bt(76), D_HOP = 38.95, D_HLAND = 39.35, D_POP = bt(80), D_SS = bt(80.5), D_GO = bt(84), D_MARCH = bt(88);  // 38.135, 40.135, 40.385, 42.135, 44.135
  const HIFIVE = [bt(85), bt(86), bt(87)];                                   // 42.635, 43.135, 43.635
  const TRIO = ['clawd', 'spike', 'floatie'];
  const dD = t => cruise(t, D0, 320, D_STOP, .5), dDend = cruise(D_STOP + 1, D0, 320, D_STOP, .5);
  const stopD = n => cutX(n) + dDend;
  const CL = stopD('clawd'), CAFE = CL + 120, TABX = CL + 540, SHL = CL + 260;   // Clawd's stop, the café, its table, where Shades lands
  const marchD = (t, n) => go(t, D_MARCH + .25 + { clawd: 0, spike: .05, floatie: .1, shades: .25 }[n], 300);
  // Shades floats over the trio under the open parasol, passing over each of them on a beat, to the back of the line
  const BX = stopD('floatie') - 320, D_LAND = 44.1, GLIDE_H = 300;
  const shadesPathX = t => kf(t, [[D_GO + .1, SHL], [HIFIVE[0], CL], [HIFIVE[1], stopD('spike')], [HIFIVE[2], stopD('floatie')], [D_LAND, BX]], x => x);
  const glideY = x => { const k = clamp((SHL - x) / (SHL - BX)); return GYD - GLIDE_H * Math.pow(Math.sin(k * Math.PI), .7); };
  const ROWD = makeRow(37, -800, 7000).filter(b => b.x + b.w < CAFE - 20 || b.x > CAFE + 700);
  function cafe(t) {
    boilSeed('cafe');
    const x = CAFE, w = 680, h = 540, top = BASED - h;
    paint(rectPts(x, top, w, h, 2), { wash: '#FBE3B8', fill: '#E7C68E', fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 16, top - 26, w + 32, 30, 1), { wash: '#3A9C98', ink: PAL.ink, sw: .8 });
    for (let c = 0; c < 3; c++) paint(rrPts(x + 40 + c * 215, top + 50, 170, 110, 12), { wash: '#FFF3DC', fill: '#BFE3F0', fillOp: 110, tex: .3, ink: PAL.ink, sw: .8 });
    paint(rectPts(x + 40, BASED - 250, 360, 230), { wash: '#FFF0D2', fill: '#E8CFA0', fillOp: 60, tex: .4, ink: PAL.ink, sw: .9 });   // shop window
    for (let i = 0; i < 4; i++) paint(ellPts(x + 90 + i * 85, BASED - 120, 26, 18, 12), { wash: ['#E27A92', '#C98B4A', '#F2C14E', '#E8AA38'][i], ink: PAL.ink, sw: .5 });  // cakes
    inkLine([[x + 60, BASED - 90], [x + 380, BASED - 90]], .8, PAL.ink, 'ink', 0);
    door(x + 540, BASED, '#3A9C98', 0, '', 'cafe');
    // the striped awning, flapping a little on the beat
    boilSeed('awning');
    const ay = top + 190, flap = 5 * Math.sin(bpOf(t) * Math.PI);
    for (let i = 0; i < 10; i++) {
      const x0 = x - 30 + i * (w + 60) / 10, x1 = x0 + (w + 60) / 10;
      paint([[x0 + 10, ay], [x1 + 10, ay], [x1 + 30, ay + 110 + flap], [x0 + 30, ay + 110 + flap]], { wash: i % 2 ? PAL.cream : '#3A9C98', ink: null });
      const sc = []; for (let j = 0; j <= 6; j++) sc.push([lerp(x0 + 30, x1 + 30, j / 6), ay + 110 + flap + Math.sin(j / 6 * Math.PI) * 22]);
      paint(sc, { wash: i % 2 ? PAL.cream : '#3A9C98', ink: null });
    }
    const O = [[x - 20, ay], [x + w + 40, ay]]; for (let j = 0; j <= 40; j++) O.push([lerp(x + w + 60, x, j / 40), ay + 110 + flap + Math.abs(Math.sin(j / 4 * Math.PI)) * 22]);
    paint(O, { ink: PAL.ink, sw: .9 });
    for (const px of [x + 20, x + w - 20]) { boilSeed('pot' + px); paint(rrPts(px - 34, BASED - 60, 68, 64, 10), { wash: '#C98B6A', ink: PAL.ink, sw: .7 }); paint(ellPts(px, BASED - 110, 50, 60, 16, 3), { wash: '#7DB36A', fill: '#4F8A4E', fillOp: 70, ink: PAL.ink, sw: .7 }); }
  }
  function table(t, drinkOn) {
    boilSeed('table');
    inkLine([[TABX, 832], [TABX, 948]], 3, '#4A4458', 'ink', 0);
    paint(ellPts(TABX, 952, 50, 9, 14), { wash: '#4A4458', ink: null });
    paint(ellPts(TABX, 830, 118, 20, 24), { wash: '#F6EEDD', fill: '#CFC2AE', fillOp: 60, ink: PAL.ink, sw: .9 });
    if (!drinkOn) return;
    boilSeed('drink');
    const gx = TABX + 58;
    paint([[gx - 20, 752], [gx + 20, 752], [gx + 15, 826], [gx - 15, 826]], { wash: '#F4A6B8', fill: '#E27A92', fillOp: 70, tex: .4, ink: PAL.ink, sw: .7 });
    paint(rectPts(gx - 18, 752, 36, 14), { wash: '#FBD9E2', ink: null });
    inkLine([[gx + 4, 790], [gx + 12, 720], [gx + 30, 706]], 1.2, '#3A9C98', 'ink', .4);
    paint([[gx - 28, 736], [gx - 2, 718], [gx + 2, 740]], { wash: PAL.ochre, ink: PAL.ink, sw: .5 });   // paper umbrella
    paint(ellPts(gx - 6, 762, 9, 9, 8), { wash: '#F2C14E', ink: PAL.ink, sw: .4 });                      // lemon
  }
  // Shades' parasol, held in the arm-tip hook: the pole kept at world tilt `tilt`, the hand a fifth of the way up
  const paraHook = (a, open, tilt = 0) => (u) => { push(); rotate(a + tilt); const s = 5.6 * u; BCH.parasol(0, 1.7 * s * .25, s, open, 0, 'sh'); pop(); };
  const paraBack = (open) => (u) => { push(); translate(-1.6 * u, -5.4 * u); rotate(-.45); BCH.parasol(0, 1.2 * u, 5.6 * u, open, 0, 'sh'); pop(); };
  const paraTop = (u) => { push(); translate(1.2 * u, -7.6 * u); rotate(.08); BCH.parasol(0, 0, 5 * u, 1, 0, 'sh'); pop(); };
  function shotD(t, lt, dur) {
    const midMarch = t => { let s = 0; for (const n of ['clawd', 'spike', 'floatie']) s += stopD(n) + marchD(t, n); return (s + BX + marchD(t, 'shades')) / 4; };
    const cxS = kf(t, [[D0, camC(C_END)], [D_STOP + .3, CL + 60], [D_GO, CL + 60], [D_LAND, CL - 330]], ease);
    const cx = t < D_LAND ? cxS : lerp(CL - 330, midMarch(t) + 200, ease(seg(t, D_LAND, D_LAND + 1.4)));
    const zoom = kf(t, [[D0, ZC], [D_STOP + .3, 1.25], [D_MARCH, 1.25], [D_MARCH + 1.5, 1.1]]);
    const cy = kf(t, [[D0, CYC], [D_STOP + .3, 660], [D_MARCH, 660], [D_MARCH + 1.5, 700]]);
    NODOOR = [[CL - 60, 1000]];
    townSky(t, cx * .3, 'D');
    skyline(cx * .3 + 900, 780, 'skD');
    camBegin(cx, cy, zoom);
    street(cx - 1300 / zoom, cx + 1300 / zoom, BASED, 'D');
    drawRow(ROWD, BASED, t, cx, zoom);
    cafe(t);
    props(cx - 1300 / zoom, cx + 1300 / zoom, BASED, t, 'D', 1100, 150);

    // ---- Shades ----
    const moodSh = emotions(t, [[D0, 'cool'], [D_LOOK + .05, 'smug'], [D_POP, 'proud'], [D_GO, 'happy'], [D_MARCH, 'cool']]);
    let shx = TABX, shy = SHY, sh;
    const openK = t < D_POP ? 0 : backOut(seg(t, D_POP, D_POP + .28));
    if (t < D_HOP) {
      sh = { ...moodSh, sq: (moodSh.sq || 0) + .06, aR: -.25, armR: paraHook(-.25, 0, -.12) };
      if (t > D_LOOK) Object.assign(sh, turn(t, D_LOOK, D_LOOK + .15, 0, -.12), { rot: (sh.rot || 0) - .05 });
      if (t > D_HOP - .2) sh.sq += .12 * ease(seg(t, D_HOP - .2, D_HOP));
    } else if (t < D_HLAND) {
      const k = seg(t, D_HOP, D_HLAND); [shx, shy] = arcPt([TABX, SHY], [SHL, GYD], 120, k);
      sh = { ...moodSh, sq: -.14 * Math.sin(k * Math.PI), aR: .1, armR: paraHook(.1, 0, -.1) };
    } else if (t < D_GO + .15) {
      shx = SHL; shy = GYD;
      const a = t - D_HLAND, wind = ease(seg(t, D_POP - .45, D_POP - .05)), flick = backOut(seg(t, D_POP - .08, D_POP + .12));
      const aR = t < D_POP - .08 ? lerp(.1, -.55, wind) : lerp(-.55, 1.2, flick);
      sh = { ...moodSh, sq: (moodSh.sq || 0) + .22 * Math.exp(-8 * a) * Math.cos(20 * a) + .14 * wind * (1 - flick), aR, aL: t > D_POP ? -.6 : moodSh.aL, armR: paraHook(aR, openK, t < D_POP ? -.1 : .12 + .06 * Math.sin(t * 3)) };
      if (t > D_POP) sh.dy = (sh.dy || 0) - .8 * spring(t, D_POP, 5, 14);
      if (t > D_GO - .02) Object.assign(sh, turn(t, D_GO - .02, D_GO + .15, 0, -.25), { armR: null, draw: paraBack(1) });
    } else if (t < D_LAND) {   // the float: side view facing left, legs dangling, parasol overhead
      shx = shadesPathX(t); shy = glideY(shx);
      const k = seg(t, D_GO + .1, D_LAND);
      sh = { ...moodSh, view: 'side', flip: true, walk: .15 + .05 * Math.sin(t * 9), aL: 1.45, sq: -.08 * Math.sin(k * Math.PI), rot: .06 * Math.sin(t * 5), noShadow: false, draw: paraTop };
    } else if (t < D_MARCH + .45) {
      shx = BX; shy = GYD;
      const a = t - D_LAND;
      sh = { ...moodSh, ...turn(t, D_MARCH + .15, D_MARCH + .32, -.25, .25), sq: (moodSh.sq || 0) + .24 * Math.exp(-8 * a) * Math.cos(20 * a), draw: paraBack(1) };
      if (t < D_MARCH + .15) Object.assign(sh, { view: 'side', flip: true });
    } else {
      shx = BX + marchD(t, 'shades');
      sh = { ...walker(moodSh, shx, U, BCH.CAST.shades.ph), draw: paraBack(1) };
    }
    const drawShades = () => BCH.buddy('shades', shx, shy, U, sh);
    if (t < D_HOP + .12) drawShades();
    table(t, true);
    if (t > D_POP) for (let i = 0; i < 4; i++) star(SHL + 120 + [-160, 150, -60, 90][i], GYD - 13.5 * U + [20, -10, -80, -70][i], 40, seg(t, D_POP + i * .06, D_POP + .45 + i * .06));

    // ---- the trio ----
    const moods = {
      clawd: emotions(t, [[D0, 'happy'], [D_LOOK + .3, 'happy', { lookX: 1 }], [D_SS, 'starstruck'], [D_GO, 'happy', { lookX: 1 }], [D_MARCH, 'happy']]),
      spike: emotions(t, [[D0, 'happy'], [D_SS + .06, 'starstruck'], [D_GO, 'excited', { lookX: 1 }], [D_MARCH, 'happy']]),
      floatie: emotions(t, [[D0, 'happy'], [D_SS + .12, 'starstruck'], [D_GO, 'happy', { lookX: 1 }], [D_MARCH, 'excited']]),
    };
    const draws = [];
    TRIO.forEach((n, i) => {
      const ph = BCH.CAST[n].ph, m = moods[n], lag = i * .07;
      let x, o;
      if (t < D_STOP + .05) { x = cutX(n) + dD(t); o = walker(m, x, U, ph + (n === 'clawd' ? 0 : 0), 1 - seg(t, D_STOP - .4, D_STOP)); }
      else if (t < D_MARCH) {
        x = stopD(n); o = { ...m, ...turn(t, D_STOP + .1 + lag, D_STOP + .27 + lag, .25, 0) };
        if (t > D_GO && t < D_LAND + .2) {   // watch Shades float over, and hop as it passes
          const sx = shadesPathX(t), hop = jump(t, HIFIVE[i] - .12, HIFIVE[i] + .33, 1.5), up = Math.exp(-Math.abs(t - HIFIVE[i] - .1) * 5);
          Object.assign(o, { lookX: clamp((sx - x) / 250, -1, 1), lookY: -1, dy: (o.dy || 0) * .3 + hop.dy, sq: (o.sq || 0) * .3 + hop.sq, aL: lerp(.3, 1.3, up), aR: lerp(.3, 1.35, up) });
        }
        if (t > D_MARCH - .3 + lag * .5) Object.assign(o, turn(t, D_MARCH - .3 + lag * .5, D_MARCH - .13 + lag * .5, 0, .25));
      } else { x = stopD(n) + marchD(t, n); o = walker(m, x, U, ph, seg(t, D_MARCH + .2, D_MARCH + .4)); }
      if (n === 'spike' && (o.view === 'side')) o.armL = ballHook('D');
      if (n === 'spike' && o.view !== 'side') o.armR = null;
      draws.push(() => BCH.buddy(n, x, GYD, U, n === 'clawd' ? { ...o, ukeBack: true } : o));
      if (Math.abs(t - HIFIVE[i] - .1) < .3) draws.push(() => star(x + 30, GYD - 11 * U, 50, seg(t, HIFIVE[i] - .02, HIFIVE[i] + .3)));
    });
    // draw back to front: the trio, then Shades walking in front of them
    draws.forEach(d => d());
    if (t >= D_HOP + .12) drawShades();
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#E27A92', '#3A9C98']);
  }

  // ======================= E · the edge of town =======================
  const GYE = 900, FINAL = { clawd: 1300, spike: 1060, floatie: 820, shades: 580 }, ORDER = ['shades', 'floatie', 'spike', 'clawd'];
  const E_STOP = bar(25), E_NOD = bt(102), E_TAKE = 51.585;               // 50.135, 51.135
  const dE = t => cruise(t, E0, 300, E_STOP, .5), dEend = cruise(E_STOP + 1, E0, 300, E_STOP, .5);
  const ROWE = makeRow(51, -1700, 640);
  function edgeWorld(t, cx, zoom) {
    BCH.skyGrad('#8FD0EE', '#FDEBCB', 'skyE', 8);
    for (let i = 0; i < 3; i++) BCH.cloud(((300 + i * 700 - t * 16 - cx * .08) % 2400 + 2400) % 2400 - 250, 140 + 80 * hash(i + 4), 130 + 40 * hash(i), PAL.cream, 0, 'E' + i, { shade: '#9FB8E0', ph: i });
    // the open country beyond town, in screen space with a slow parallax: far blue hills, then green ones with trees
    const px = -cx * .2;
    boilSeed('hillE0'); paint(ellPts(1650 + px, 800, 1000, 250, 36, 3), { wash: '#B9D6C8', fill: '#98BFB4', fillOp: 60, bleed: .1, tex: .4, ink: PAL.ink, sw: .5 });
    boilSeed('hillE1'); paint(ellPts(1250 + px * 1.3, 860, 760, 230, 36, 3), { wash: '#A7D08A', fill: '#7FB069', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    boilSeed('hillE2'); paint(ellPts(2150 + px * 1.3, 850, 800, 260, 36, 3), { wash: '#B8D98E', fill: '#86B86A', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 7; i++) {   // little round trees dotting the hills
      boilSeed('htree' + i);
      const x = 1000 + i * 150 + 60 * hash(i + 2) + px * 1.3, y = 660 + 50 * hash(i + 5) - (i > 3 ? 20 : 0);
      inkLine([[x, y + 34], [x, y + 8]], 1.2, '#6B4A33', 'ink', 0);
      paint(ellPts(x, y, 24, 22, 12, 1), { wash: '#6FA65A', fill: '#4F8A4E', fillOp: 70, ink: PAL.ink, sw: .5 });
    }
    camBegin(cx, 540, zoom);
    // the green beyond the pavement: grass from x 1440 on, a fence running off into the fields
    boilSeed('fieldE');
    const FT = []; for (let i = 0; i <= 12; i++) FT.push([lerp(1100, 3300, i / 12), 792 - 22 * Math.sin(i * .9) - 10 * hash(i)]);
    paint(FT.concat([[3300, 1300], [1100, 1300]]), { wash: '#9CCB72', fill: '#6FA152', fillOp: 70, tex: .6, border: .3, ink: null, curv: .3 });
    for (let i = 0; i < 18; i++) { boilSeed('tuftE' + i); const x = 1480 + i * 70 + 30 * hash(i), y = 790 + 260 * hash(i + 3), s = 5 * wob(t, .5, hash(i) * 3); for (const k of [-1, 0, 1]) inkLine([[x + k * 7, y], [x + k * 11 + s, y - 22 - 8 * hash(i + k)]], .7, '#4F8A4E', 'inkfine', .4); }
    for (let i = 0; i < 6; i++) { boilSeed('fenceE' + i); const x = 1640 + i * 150; inkLine([[x, 800], [x, 720]], 2.2, '#8A5C3C', 'ink', 0); }
    boilSeed('railE'); inkLine([[1640, 740], [2400, 740]], 1.6, '#8A5C3C', 'ink', 0); inkLine([[1640, 772], [2400, 772]], 1.6, '#8A5C3C', 'ink', 0);
    // the last houses and the pavement, which simply stops
    drawRow(ROWE, 800, t, cx, zoom);
    for (let k = Math.floor((cx - 1500) / 600); k * 600 < 1440; k++) {
      boilSeed('pvE' + k);
      const x = k * 600, x1 = Math.min(x + 604, 1440);
      paint(rectPts(x - 4, 800, x1 - x + 4, 184), { wash: '#EADBC4', fill: '#D8C3A5', fillOp: 55, tex: .6, ink: null });
      paint(rectPts(x - 4, 984, x1 - x + 4, 300), { wash: '#B9B3C2', fill: '#9C95A8', fillOp: 50, tex: .5, ink: null });
      inkLine([[x - 4, 800], [x1, 800]], .9, PAL.ink, 'ink', 0);
      inkLine([[x - 4, 984], [x1, 984]], .8, PAL.ink, 'ink', 0);
    }
    boilSeed('edgeE');
    paint([[1440, 800], [1470, 830], [1452, 900], [1480, 980], [1462, 1260], [1440, 1260]], { wash: '#EADBC4', ink: PAL.ink, sw: .9, curv: .4 });
    paint(ellPts(1640, 1000, 90, 20, 16), { wash: '#C9A57A', ink: null });   // a dirt path starts where the pavement ends
    lamp(420, 800, 'E1'); streetTree(-260, 800, 'E2', t);
  }
  function shotE(t, lt, dur) {
    const lead = dEend - dE(t), cx = W / 2 - lead * .62;
    NODOOR = [];
    edgeWorld(t, cx, 1);
    const moods = {}, keysBase = [[E0, 'happy'], [E_NOD - .25, 'determined'], [E_TAKE - .02, 'excited']];
    ORDER.forEach((n, i) => {
      const x = FINAL[n] - lead, ph = BCH.CAST[n].ph, m = emotions(t, keysBase.map(([k, e]) => [k + (k > E0 ? i * .03 : 0), e]), { take: .6 });
      let o;
      const tt = 50.25 + (3 - i) * .12;            // heads turn one by one: Clawd first, then back down the line
      if (t < E_STOP + .02) o = walker(m, x, U, ph, 1 - seg(t, E_STOP - .4, E_STOP));
      else if (t < 51.2) {
        o = { ...m, ...turn(t, tt, tt + .15, .25, 0) };
        o.lookX = t < tt + .15 ? 1 : ((beatN(t) + i) % 2 ? 1 : -1) * (i === 0 ? -1 : i === 3 ? 1 : 1);
        if (i === 0) o.lookX = 1; if (i === 3) o.lookX = -1;
        const nod = Math.exp(-Math.abs(t - (E_NOD + i * .04)) * 10);
        o.dy = (o.dy || 0) + .35 * nod; o.sq = (o.sq || 0) + .1 * nod; o.lookY = .4 * nod;
      } else {
        o = { ...m, ...turn(t, 51.2 + i * .02, 51.33 + i * .02, 0, .25) };
        const crouch = ease(seg(t, 51.33, E_TAKE)), k = seg(t, E_TAKE, E1 + .001);
        if (t < E_TAKE) { o.sq = .2 * crouch + .02 * i; o.dy = 0; o.aL = lerp(.2, -.5, crouch); }
        else { o.dy = -11.82 * easeOut(k); o.sq = lerp(-.24, -.12, k); o.aL = lerp(-.3, .9 + .05 * (i - 1.5), easeOut(seg(t, E_TAKE, E_TAKE + .15))); o.walk = .25 + .1 * i; }
        o.eyes = t > E_TAKE - .05 ? 'wide' : o.eyes; o.mouth = t > E_TAKE ? 'open' : o.mouth;
      }
      if (n === 'spike' && o.view === 'side') o.armL = ballHook('E');
      if (n === 'shades') {   // Shades furls the parasol during the break, and carries it closed into the jump (as shot F does)
        if (t < 51.2) o.draw = paraBack(1 - ease(seg(t, 50.35, 50.8)));
        else o.armL = (u) => { push(); rotate(-(.7 - (o.aL ?? .2))); BCH.parasol(0, u * 1.2, u * 1.25, 0, 0, 'carry'); pop(); };
      }
      BCH.buddy(n, x, GYE, U, n === 'clawd' ? { ...o, ukeBack: true } : o);
    });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#E27A92', '#3A9C98']);
  }

  shots([[B0, shotB], [C0, shotC], [D0, shotD], [E0, shotE]]);
})();
