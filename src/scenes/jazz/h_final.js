// jazz/h_final.js: shots R–U (175.84–234.65 s). The final chorus (the door bursts, the band pours into the street, the
// bar-line grid, trading fours, the city lit by the band, the break), the outro (after hours: the gardenia laid down),
// the cover (every sound shape flies home and locks into the B composition) and the out (colours drain into the candle,
// the singer blows it out, black: the breath before the match at 0.21 s).
(() => {
  const B = beatT, bar = k => barT(k), bt = (k, j) => beatT(4 * k + j);   // bt(bar, beat 0..3)
  const SEC_END = 234.65;

  // ---------- small local helpers ----------
  // a gardenia centred at (x, y), size s (the hat's flower is drawn at (-3.9s, -8.1s) of its origin)
  function flowerAt(x, y, s, rot = 0) { push(); translate(x, y); rotate(rot); translate(3.9 * s, 8.1 * s); hat(s, 'gardenia', clamp(s / 15, .45, 2)); pop(); }
  // run a drawing function without painting anything, to learn the points it returns (a bell, a snare) first
  function probe(fn) {
    const P = paint, L = inkLine, G = glow, Hf = halftone;
    paint = () => {}; inkLine = () => {}; glow = () => {}; halftone = () => {};
    try { return fn(); } finally { paint = P; inkLine = L; glow = G; halftone = Hf; }
  }
  // the singer's mood across the final chorus
  const moodR = t => emotions(t, [[175.4, 'determined'], [192.0, 'proud'], [202.1, 'hopeful']], { take: .6 });
  // a flat ink gutter (a thick printed rule) between panes, from p0 to p1, w wide, grown k 0..1 from its middle
  function gutter(p0, p1, w, k = 1, key = '') {
    if (k <= .01) return;
    boilSeed('gut' + key);
    const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, a = [lerp(mx, p0[0], k), lerp(my, p0[1], k)], b = [lerp(mx, p1[0], k), lerp(my, p1[1], k)];
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d * w / 2, ny = dx / d * w / 2;
    paint([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], { wash: JZ.ink, ink: JZ.ink, sw: 1.4 });
  }
  // a pane: its flat colour block (bleeding past its edges under the gutters / past the frame), then content drawn
  // around its centre, popped in by scale k
  function pane(x, y, w, h, col, draw, o = {}) {
    const e = 40, x0 = x <= 1 ? -e : x - 16, y0 = y <= 1 ? -e : y - 16, x1 = x + w >= W - 1 ? W + e : x + w + 16, y1 = y + h >= H - 1 ? H + e : y + h + 16;
    boilSeed('pane' + (o.key || ''));
    block(rectPts(x0, y0, x1 - x0, y1 - y0), col, { ink: null });
    if (o.ht) halftone(o.ht, x + w / 2, y + h * .75, w + 40, h * .6, mixCol(col, JZ.ink, .35), .5);
    const k = o.pop ?? 1, cx = x + w / 2, cy = y + h / 2;
    push(); translate(cx, cy); scale(k); translate(-cx, -cy);
    draw(cx, cy, w, h);
    pop();
  }

  // ---------- the band, as parade players ----------
  // the drummer with a marching snare on a strap (side view); strike 0..1 = the stick coming down onto the head
  function marchDrummer(x, y, u, t, o = {}) {
    const f = o.flip ? -1 : 1, up = o.up ?? 0;
    clawd(x, y, u, {
      eyes: 'determined', hat: 'band', ...o, view: 'side', aL: lerp(.15, 1.2, up),
      armL: (uu, sw) => stick(uu, sw, { a: lerp(.55, -.5, up), len: 2.2 }),
      draw: (uu, sw) => {
        inkLine([[-.8 * uu, -7.6 * uu], [3.4 * uu, -3.3 * uu]], sw * 1.4, JZ.cream, 'ink', 0);
        paint(rectPts(2.5 * uu, -3.4 * uu, 2.8 * uu, 1.25 * uu), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 60, ink: JZ.ink, sw: sw * .8 });
        for (let i = 0; i < 4; i++) inkLine([[(2.7 + i * .7) * uu, -3.35 * uu], [(3.0 + i * .7) * uu, -2.2 * uu]], sw * .45, JZ.cream, 'inkfine', 0);
        paint(ellPts(3.9 * uu, -3.4 * uu, 1.45 * uu, .34 * uu, 16), { wash: JZ.cream, ink: JZ.ink, sw: sw * .7 });
      },
    });
    const dy = (o.dy || 0) * u;
    return { snare: [x + f * 3.9 * u, y + dy - 3.5 * u] };
  }
  // the pianist on the march, playing a keyboard strap-on (side view), spectacles
  function keytarist(x, y, u, t, o = {}) {
    const f = o.flip ? -1 : 1;
    clawd(x, y, u, {
      eyes: 'closed', hat: ['specs', 'beanie'], ...o, view: 'side', aL: o.aL ?? -.05,
      draw: (uu, sw) => {
        push(); translate(2.2 * uu, -3.5 * uu); rotate(-.28);
        paint(rectPts(-1.4 * uu, -.55 * uu, 6 * uu, 1.1 * uu), { wash: JZ.ink2, ink: JZ.ink, sw: sw * .8 });
        for (let i = 0; i < 9; i++) paint(rectPts((-1.1 + i * .6) * uu, -.35 * uu, .55 * uu, .8 * uu), { wash: (o.down ?? -1) === i ? JZ.mustLt : JZ.cream, ink: null });
        for (let i = 0; i < 8; i++) if (i % 7 !== 2) paint(rectPts((-.75 + i * .6) * uu, -.35 * uu, .3 * uu, .45 * uu), { wash: JZ.ink, ink: null });
        pop();
      },
    });
    const dy = (o.dy || 0) * u;
    return { keys: [x + f * 4.4 * u, y + dy - 4.6 * u] };
  }

  // ---------- R1 · the door bursts; the band pours into the street (175.84–182.84, bars 101–104) ----------
  const DOOR = [860, 300, 200, 500];   // exterior door: x, y, w, h (its sill at y 800)
  const R1P = [   // id, emerge beat, spot x, feet y, u, flip; drawn in this order (back row first)
    ['dr', 4 * 101 + 5, 690, 812, 20, false],
    ['pn', 4 * 101 + 7, 1235, 812, 19, true],
    ['tp', 4 * 101 + 3, 410, 862, 23, false],
    ['sx', 4 * 101 + 4, 1480, 870, 23, true],
    ['bs', 4 * 101 + 6, 1730, 852, 21, true],
  ];
  function streetSet(t, key) {
    ground(JZ.blueDk);
    halftone('ramp', W / 2, 250, W + 200, 600, JZ.blue, .5, Math.PI);
    // neighbours
    building(-120, 800, 480, 640, { col: JZ.blue, key: key + 'b1', seed: 3, cell: 50, roof: true });
    building(1560, 800, 520, 700, { col: JZ.blue, key: key + 'b2', seed: 7, cell: 50, roof: true });
    // the club: a warm brick front, round portholes, an awning over the door
    boilSeed(key + 'club');
    block(rectPts(360, 70, 1200, 740), mixCol(JZ.wood, JZ.ink, .4), { ink: JZ.ink, sw: 2, tex: 40 });
    halftone('ramp', 960, 560, 1200, 500, JZ.ink, .45);
    for (const px of [590, 1330]) { block(ellPts(px, 450, 52, 52, 26), JZ.mustLt, { ink: JZ.ink, sw: 2 }); glow(px, 450, 130, '#FFC766', .5); halftone('disc', px + 10, 460, 90, 90, JZ.mustDk, .5); }
    block([[800, 250], [1120, 250], [1160, 300], [760, 300]], JZ.mustard, { ink: JZ.ink, sw: 1.6 });
    for (let i = 0; i < 6; i++) block(rectPts(770 + i * 64, 300, 32, 26), JZ.verm, { ink: null });
    // the doorway, full of light
    const [dx, dy, dw, dh] = DOOR;
    glow(dx + dw / 2, dy + dh * .6, 420, '#FFE2A8', .9);
    block(rectPts(dx, dy, dw, dh), JZ.cream, { ink: JZ.ink, sw: 2.4 });
    halftone('disc', dx + dw / 2, dy + dh * .55, dw * 1.2, dh * .9, JZ.mustLt, .5);
    // the door itself, flung open against the wall (a thin dark leaf to the left)
    block([[dx - 110, dy + 10], [dx, dy], [dx, dy + dh], [dx - 110, dy + dh - 10]], JZ.ink2, { ink: JZ.ink, sw: 1.6 });
    // pavement and road; the light spills out of the door onto the pavement
    boilSeed(key + 'street');
    block(rectPts(-60, 800, W + 120, 130), JZ.ink2, { ink: null });
    block(rectPts(-60, 928, W + 120, 200), JZ.ink, { ink: null });
    inkLine([[-40, 928], [W + 40, 928]], 3, JZ.smoke, 'ink', 0);
    paint([[dx, 800], [dx + dw, 800], [dx + dw + 190, 930], [dx - 190, 930]], { wash: JZ.cream, washOp: 90, ink: null });
    halftone('ramp', 960, 870, 700, 120, JZ.cream, .5, Math.PI);
  }
  function playerAt(id, x, y, u, t, o, key) {
    const bk = key + id, P = { ...o, boilKey: bk, key: bk };
    if (id === 'tp') return trumpeter(x, y, u, t, P);
    if (id === 'sx') return saxist(x, y, u, t, P);
    if (id === 'dr') return marchDrummer(x, y, u, t, P);
    if (id === 'pn') return keytarist(x, y, u, t, P);
    if (id === 'bs') return bassist(x, y, u, t, P);
  }
  // each player's sound, from its landing on (t0)
  function playerSound(id, pt, t, t0, flip, u, key) {
    const f = flip ? -1 : 1, bp = bpOf(t);
    if (t < t0) return;
    if (id === 'tp') {   // a long note every two beats: a fan of rays up and out
      const b0 = Math.floor(bpOf(t0) + .01), n = Math.floor((bp - b0) / 2), a = t - B(b0 + 2 * n);
      rays(pt.bell[0] + f * 6, pt.bell[1], f > 0 ? -1.0 : Math.PI + 1.0, a, { len: 460 * u / 21, n: 5, hold: BEAT * 1.5, spread: .42, w: 16 * u / 21, key: key + 'tp', seed: n });
    } else if (id === 'sx') {
      const g = easeOut(seg(t, t0, t0 + .8));
      saxRibbon(flowPath(pt.bell[0], pt.bell[1] - 6, flip ? -2.05 : -1.1, 1000 * g * u / 22, t, { amp: 60 * u / 22, waves: 1.3, speed: .9, curl: 60, lift: k => 120 * k * k }), 44 * u / 22, t, { key: key + 'sx', tspeed: 1.8, shine: 1 });
    } else if (id === 'dr') {
      const [a, bi] = sinceBackbeat(t);
      if (t - a >= t0 - .01) shards(pt.snare[0], pt.snare[1], a, bi, { n: 8, dist: 230 * u / 19, size: 26 * u / 19, dir: -Math.PI / 2 + (flip ? -.3 : .3), spread: 2.6, fall: 300 });
    } else if (id === 'pn') {
      const b0 = Math.ceil(bpOf(t0) - .01), hits = [];
      for (let b = Math.max(b0, Math.floor(bp) - 2); b <= bp; b++) hits.push(t - B(b));
      pianoTiles(pt.keys[0] - (flip ? 175 : 0), pt.keys[1] - 175, 28, 6, 1, hits, { key: key + 'pn', h: 60, stairs: flip ? -14 : 14 });
    }
  }
  // the pose of a player who hopped out of the door at te: arc from the sill to its spot, growing (coming toward us)
  function hopOut(t, te, sx, sy, u) {
    const t1 = te + BEAT, k = seg(t, te, t1), from = [DOOR[0] + DOOR[2] / 2, DOOR[1] + DOOR[3]];
    const p = arcPt(from, [sx, sy], 170, ease(k)), uu = lerp(u * .5, u, easeOut(k)), j = jump(t, te, t1, 0);
    return { x: p[0], y: p[1], u: uu, sq: j.sq, air: k > 0 && k < 1, landed: t >= t1, t1 };
  }
  function R1(t, lt, dur) {
    plate('R1');
    const t0 = bar(101);
    if (lt < .16) { R1burst(t, lt); return; }
    const land = bt(101, 2), bp = bpOf(t);
    const push_ = ease(seg(t, land, t0 + dur)), [sxk, syk] = shakeXY(t, 9 * hitK(t - land, 7));
    camBegin(960 + sxk, 610 + 25 * push_ + syk, 1.17 + .06 * push_);
    streetSet(t, 'R1');
    // lamps either side of the club, lit by the drummer's first backbeats
    const drLand = B(R1P[0][1]) + BEAT;
    [[470, bt(102, 3)], [1450, bt(103, 1)]].forEach(([lx, on], i) => {
      const k = seg(t, on, on + .06), lp = streetLamp(lx, 812, 430, k, { key: 'R1lamp' + i });
      if (t >= on) shards(lp[0], lp[1], t - on, 50 + i, { n: 9, dist: 260, size: 30, life: .8 });
    });
    // the bass's ripples sit behind the band
    { const q = R1P.find(r => r[0] === 'bs'), te = B(q[1]), t1 = te + BEAT;
      if (t >= t1) { const f = q[5] ? -1 : 1, bx = q[2] + f * 4.4 * q[4], by = q[3] - 16 * q[4] * .3, bp0 = Math.ceil(bpOf(t1) - .01), ages = [];
        for (let b = Math.max(bp0, Math.floor(bp) - 3); b <= bp; b++) ages.push(t - B(b));
        ripples(bx, by, ages, { speed: 300, life: 1.3, flat: .5, key: 'R1bs', sw: 5, rings: 2 }); } }
    // the players, back row first; their sounds are drawn first, behind the band (their anchors probed)
    const specs = [];
    for (const [id, eb, x, y, u, flip] of R1P) {
      const te = B(eb), h = hopOut(t, te, x, y, u);
      if (t < te) continue;
      const b = bpOf(t), bob = h.landed ? -.5 * Math.abs(Math.sin((b + hash(eb)) * Math.PI)) : 0;
      const [ba] = sinceBeat(t), [bb] = sinceBackbeat(t);
      const o = { flip, sq: h.sq + (h.landed ? .05 * hitK(ba, 8) : 0), dy: bob, rot: h.air ? (flip ? .12 : -.12) : 0 };
      if (id === 'tp') Object.assign(o, { blow: h.landed ? .5 + .5 * hitK(ba, 3) : 0, shine: frac(b * .25) });
      if (id === 'sx') Object.assign(o, { shine: frac(b * .3 + .4), rot: (o.rot || 0) + (h.landed ? -.06 * Math.sin(b * Math.PI / 2) : 0) });
      if (id === 'dr') o.up = h.landed ? 1 - hitK(bb, 14) : .5;
      if (id === 'bs') Object.assign(o, { pluck: [ba, 9, ba + .2, 9] });
      if (id === 'pn') o.down = Math.floor(b * 2) % 9;
      specs.push({ id, h, o, flip, t1: h.t1 });
    }
    for (const q of specs) playerSound(q.id, probe(() => playerAt(q.id, q.h.x, q.h.y, q.h.u, t, q.o, 'R1')), t, q.t1, q.flip, q.h.u, 'R1');
    for (const q of specs) playerAt(q.id, q.h.x, q.h.y, q.h.u, t, q.o, 'R1');
    // the singer leaps out first, straight at us, and leads
    const sLand = land, sk = seg(t, t0 + .02, sLand), from = [960, 800];
    const sp = arcPt(from, [960, 905], 150, ease(sk)), su = lerp(15, 29, easeOut(sk)), sj = jump(t, t0 + .02, sLand, 0);
    const m = moodR(t);
    const sg = singer(sp[0], sp[1], su, t, { ...m, view: 'front', mic: false, sq: (m.sq || 0) + sj.sq, aL: sk < 1 ? 1.3 : .75 + .35 * Math.sin(bp * Math.PI / 2), aR: sk < 1 ? 1.3 : .55 - .3 * Math.sin(bp * Math.PI / 2), boilKey: 'R1sg' });
    voiceCurls(sg.mouth[0], sg.mouth[1] - 10, t, { s: 1.2, rise: 240 });
    camEnd();
    // the flood of light fading off
    flash(1 - seg(lt, .16, .5), JZ.cream);
    // out: the bar lines slam down (R2 finishes them)
    const g = seg(t, t0 + dur - .1, t0 + dur);
    if (g > 0) { gutter([W / 2, 0], [W / 2, H], 26, easeIn(g), 'o1'); gutter([0, H / 2], [W, H / 2], 26, easeIn(g), 'o2'); }
  }
  // the first frames: the club door from inside, exactly as Q3 left it (frame 824–1336, the crack of light 860–1060,
  // the leaf 1060–1300 pinning the ribbon, the singer reaching at x 560). The leaf swings back on its hinge, the light
  // floods out over everything and throws the singer back; under the full cream flash we cut outside.
  function R1burst(t, lt) {
    const J = 860, top = 180, bot = 1000, dR = 1300, k = easeIn(seg(lt, .0, .08)), fk = easeIn(seg(lt, .05, .15));
    const g = lerp(200, dR - J, k);
    boilSeed('Q3-wall'); ground(JZ.ink);
    halftone('ramp', 960, 200, 2600, 600, JZ.ink2, .5, Math.PI);
    block(rectPts(-400, bot, 2800, 400), JZ.ink2, { ink: null });
    boilSeed('R1b-light');
    glow(J + g / 2, 560, 420 + 1200 * fk, '#FFE2A8', .75 + .25 * fk);
    paint([[J, bot], [J + g, bot], [J + g * 1.9 + 120 + 900 * fk, 1200], [J - 120 - 900 * fk, 1200]], { wash: JZ.cream, washOp: 110, fill: JZ.cream, fillOp: 40, bleed: .06, tex: .5, border: .5, ink: null });
    paint(rectPts(J, top, g, bot - top), { wash: JZ.cream, ink: null });
    // the leaf swinging back to its hinge (a smear on the frame it moves)
    const lf = mixCol(JZ.ink, JZ.ink2, .6);
    if (k < 1) { boilSeed('Q3-door'); paint(rectPts(J + g, top, dR - J - g, bot - top), { wash: lf, ink: JZ.ink, sw: 1.8 }); }
    if (k > 0 && k < 1) for (let i = 0; i < 3; i++) inkLine([[J + g + 12, top + 160 + i * 250], [J + g + 12 + 200 * (1 - k), top + 170 + i * 250]], 2.4, mixCol(JZ.ink2, JZ.cream, .35), 'inkfine', 0);
    boilSeed('R1b-frame');
    paint([[J - 30, top - 30], [dR + 30, top - 30], [dR + 30, bot], [dR, bot], [dR, top], [J, top], [J, bot], [J - 30, bot]], { wash: mixCol(JZ.ink2, JZ.ink, .5), ink: JZ.ink, sw: 1.6 });
    // the flood: slivers of light burst out of the doorway
    if (fk > 0) for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + .2 * hash(i), r0 = 150, r1 = 500 + 1500 * fk, w = .045 + .03 * hash(i * 3), cx = J + g / 2, cy = 590;
      boilSeed('R1b-ray' + i);
      paint([[cx + Math.cos(a - w) * r0, cy + Math.sin(a - w) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a + w) * r0, cy + Math.sin(a + w) * r0]], { wash: i % 2 ? JZ.mustLt : JZ.cream, ink: null });
    }
    // the ribbon, let go by the door, whips on through the light
    const A = [-260, 300], Bp = [lerp(J + 214, 1900, easeIn(k)), lerp(610, 520, k)], P = [];
    for (let i = 0; i <= 26; i++) { const q = i / 26, env = Math.pow(Math.sin(Math.PI * q), .8); P.push([lerp(A[0], Bp[0], q), lerp(A[1], Bp[1], q * q * .6 + q * .4) + 34 * env * Math.sin(q * 2.6 * TAU - t * 3.4) - 60 * Math.sin(Math.PI * q)]); }
    saxRibbon(P, 70, t, { key: 'Q3', tspeed: 1.4, taper: true, shine: 1 });
    // the singer: Q3's big back-lit foreground figure (screen space, u 44, reaching for the crack), thrown back by the
    // blast of light; its rim goes from mustard to full cream as the light floods past it
    const u = 44, fy = 1012, x = 540 - 50 * fk, tk = take(t, bar(101) + .02, 1.1), reach = 1 - .6 * seg(lt, .03, .12);
    glow(x + 3 * u, fy - 5 * u, 260 + 300 * fk, '#FFE2A8', .55 + .45 * fk);
    singer(x, fy, u, t, {
      view: 'side', mic: false, sing: false, noShadow: true, rot: .06 - .16 * seg(lt, .02, .12), sq: -.07 + tk.sq, dy: tk.dy,
      aL: 1.56 + .35 * seg(lt, .02, .12), boilKey: 'Q3s',
      armL: (uu, sw) => { const ext = uu * (.2 + 1.5 * reach); paint(rectPts(-2.3 * uu, -.45 * uu, 2.3 * uu + ext, .9 * uu), { wash: PAL.clay, ink: JZ.ink, sw: sw * .8 }); },
      sil: mixCol(JZ.ink2, PAL.clay, .28), silInk: mixCol(JZ.mustLt, JZ.cream, fk),
    });
    flash(easeIn(seg(lt, .08, .16)), JZ.cream);
  }

  // ---------- pane content (R2, R3): each draws around (cx, cy) in a w×h box, scaled to fit (o.sc overrides); the
  // feet sit at o.fy (fraction of h below the centre)
  const fit = (w, h, nw) => Math.min(w / nw, h / 540);
  const C = {
    singer(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 560), u = 28 * sc, x = cx - (o.dx ?? 90) * sc, y = cy + h * (o.fy ?? .38);
      spotlight(x + 40 * sc, cy - h / 2 - 20, x + 40 * sc, y, 360 * sc, { key: 'pS' + (o.key || ''), a: .8 });
      const m = moodR(t), bp = bpOf(t);
      const sg = singer(x, y, u, t, { ...m, view: 'q', aL: -.2 + .9 * Math.max(0, Math.sin(bp * Math.PI / 4)), micShine: .5, boilKey: 'pS' + (o.key || ''), key: 'pS' + (o.key || '') });
      voiceCurls(sg.mouth[0] + 10 * sc, sg.mouth[1] - 10 * sc, t, { s: sc, rise: 150, max: 4 });
    },
    sax(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 560), u = 26 * sc, x = cx + (o.dx ?? 150) * sc, y = cy + h * (o.fy ?? .38), b = bpOf(t);
      const sx = saxist(x, y, u, t, { flip: true, shine: frac(b * .3), rot: -.06 * Math.sin(b * Math.PI / 2), sq: .04 * pulse(t, 7), boilKey: 'pX' + (o.key || ''), key: 'pX' + (o.key || '') });
      if (o.ribbon !== false) saxRibbon(flowPath(sx.bell[0], sx.bell[1] - 4, -2.0, (o.len ?? 330) * sc, t, { amp: 30 * sc, waves: 1.1, speed: .9, curl: 36 * sc }), 30 * sc, t, { key: 'pX' + (o.key || ''), tspeed: 1.8 });
      return sx;
    },
    drums(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 620), u = 19 * sc, x = cx + (o.dx ?? 0) * sc, y = cy + h * (o.fy ?? .44);
      const [bb, bi] = sinceBackbeat(t), [ba] = sinceBeat(t, 2), sm = bb < .05 ? 1 : 0;
      const kit = drummer(x, y, u, t, { ks: .5 * sc, hit: { snare: bb, ride: ba }, key: 'pD' + (o.key || ''), boilKey: 'pD' + (o.key || ''),
        left: { a: -.35 + .9 * (1 - hitK(bb, 9)), sa: -.9, smear: sm }, right: { a: .15 + .25 * hitK(ba, 10), sa: .9 } });
      if (o.shards !== false) shards(kit.snare[0], kit.snare[1], bb, bi, { n: 8, dist: 150 * sc, size: 20 * sc, dir: -Math.PI / 2, spread: 2.2 });
      shimmer(kit.ride[0], kit.ride[1], 60 * sc, 12 * sc, ba, { key: 'pD' + (o.key || '') });
      return kit;
    },
    bass(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 520), u = 21 * sc, x = cx - 100 * sc, y = cy + h * (o.fy ?? .42), bp = bpOf(t);
      const [ba] = sinceBeat(t), ages = []; for (let b = Math.floor(bp) - 2; b <= bp; b++) ages.push(t - B(b));
      ripples(x + 4.4 * u, y - 16 * u * .3, ages, { speed: 200 * sc, life: 1.1, flat: .55, key: 'pB' + (o.key || ''), sw: 4 * sc });
      bassist(x, y, u, t, { pluck: [ba, 9, 9, 9], rot: -.03 * Math.sin(bp * Math.PI / 2), key: 'pB' + (o.key || ''), boilKey: 'pB' + (o.key || '') });
    },
    piano(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 440), u = 17 * sc, x = cx - 150 * sc, y = cy + h * .4, bp = bpOf(t), [ba] = sinceBeat(t);
      pianist(x, y, u, t, { key: 'pP' + (o.key || ''), boilKey: 'pP' + (o.key || ''), dy: -.1 * hitK(ba, 6), aL: .3 + .15 * hitK(ba, 8) });
      const hits = []; for (let b = Math.floor(bp) - 1; b <= bp; b++) hits.push(t - B(b));
      pianoTiles(x + 30 * sc, y - 250 * sc, 34 * sc, 6, 1, hits, { key: 'pP' + (o.key || ''), h: 60 * sc, stairs: 12 * sc });
    },
    trumpet(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 520), u = 23 * sc, x = cx - (o.flip ? -150 : 150) * sc, y = cy + h * (o.fy ?? .38), bp = bpOf(t);
      const note = Math.floor((bp - 1) / 2) * 2 + 1, a = t - B(note);
      const tp = trumpeter(x, y, u, t, { flip: o.flip, blow: .4 + .6 * hitK(a, 2), shine: frac(bp * .25), key: 'pT' + (o.key || ''), boilKey: 'pT' + (o.key || '') });
      if (o.rays !== false) rays(tp.bell[0], tp.bell[1], o.flip ? Math.PI + .35 : -.35, a, { len: (o.len ?? 300) * sc, n: 4, hold: BEAT * 1.5, spread: .4, w: 16 * sc, key: 'pT' + (o.key || ''), seed: note });
      return tp;
    },
    table(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 440), gy = cy + h * .4;
      spotlight(cx, cy - h / 2 - 20, cx, gy, 380 * sc, { key: 'pTb', a: .5 });
      chair(cx + 150 * sc, gy, .75 * sc, { key: 'pTb' });
      const top = cafeTable(cx - 20 * sc, gy, .8 * sc, { key: 'pTb' });
      flowerAt(cx - 80 * sc, top - 12 * sc, 16 * sc, .3);
      candle(cx + 40 * sc, top, 1.3 * sc, t, { key: 'pTb' });
    },
    moon(t, cx, cy, w, h, o = {}) {
      const sc = o.sc ?? fit(w, h, 440);
      moon(cx + 20 * sc, cy - 50 * sc, 150 * sc, { key: 'pM' });
      boilSeed('pM-roofs');
      block([[cx - w / 2 - 20, cy + h / 2 + 20], [cx - w / 2 - 20, cy + 150 * sc], [cx - 90 * sc, cy + 150 * sc], [cx - 90 * sc, cy + 100 * sc], [cx + 40 * sc, cy + 100 * sc], [cx + 40 * sc, cy + 170 * sc], [cx + w / 2 + 20, cy + 170 * sc], [cx + w / 2 + 20, cy + h / 2 + 20]], JZ.ink, { ink: null });
      smoke(t, cx - w / 2, cy - h / 2, w, h * .6, { key: 'pM', n: 3, op: 30 });
    },
  };

  // ---------- R2 · the bar-line grid (182.84–189.85, bars 105–108) ----------
  // Beat 1 of bar 105: two bar lines slam across and the frame is four panes (singer, sax, drums, bass). Beat 1 of bar
  // 107: every pane splits (piano, trumpet, the empty table, the moon join). Bar 108: the singer's pane grows over all.
  function R2(t, lt, dur) {
    plate('R2');
    const g4 = bar(105), g8 = bar(107), gm = bar(108);
    const pk = t0 => t < t0 ? .9 : lerp(.9, 1, backOut(seg(t, t0, t0 + .16)));
    const [sx, sy] = shakeXY(t, 10 * hitK(t - (t < g8 ? g4 : t < gm ? g8 : gm), 9));
    push(); translate(sx, sy);
    ground(JZ.ink);
    if (t < g8) {
      const hw = W / 2, hh = H / 2;
      pane(hw, 0, hw, hh, JZ.blue, (cx, cy, w, h) => C.sax(t, cx, cy, w, h, { key: 4, sc: 1.35, dx: 130 }), { key: 'sx4', pop: pk(g4 + .04), ht: 'ramp' });
      pane(0, 0, hw, hh, JZ.mustard, (cx, cy, w, h) => C.singer(t, cx, cy, w, h, { key: 4, sc: 1.35, dx: 60 }), { key: 'sg4', pop: pk(g4) });
      pane(0, hh, hw, hh, JZ.blue, (cx, cy, w, h) => C.drums(t, cx, cy, w, h, { key: 4, sc: 1.5 }), { key: 'dr4', pop: pk(g4 + .08), ht: 'ramp' });
      pane(hw, hh, hw, hh, JZ.mustard, (cx, cy, w, h) => C.bass(t, cx, cy, w, h, { key: 4, sc: 1.3 }), { key: 'bs4', pop: pk(g4 + .12) });
      const k = easeOut(seg(t, g4 - .02, g4 + .08));
      gutter([hw, -40], [hw, H + 40], 26, k, 'v'); gutter([-40, hh], [W + 40, hh], 26, k, 'h');
    } else {
      const cw = W / 4, hh = H / 2, cells = [
        ['piano', 1, 0, JZ.cream, .0], ['sax', 2, 0, JZ.blue, .04], ['trumpet', 3, 0, JZ.ink2, .08],
        ['drums', 0, 1, JZ.blue, .02], ['table', 1, 1, JZ.ink2, .06], ['bass', 2, 1, JZ.mustard, .1], ['moon', 3, 1, JZ.blue, .12],
      ];
      for (const [id, i, j, col, d] of cells) pane(i * cw, j * hh, cw, hh, col, (cx, cy, w, h) => C[id](t, cx, cy, w, h, { key: 8, len: 200 }), { key: id + 8, pop: pk(g8 + d), ht: col === JZ.blue ? 'ramp' : null });
      const k = easeOut(seg(t, g8 - .02, g8 + .08)), km = ease(seg(t, gm, gm + .45));
      for (let i = 1; i < 4; i++) gutter([i * cw, -40], [i * cw, H + 40], 24, i === 2 ? 1 : k, 'v' + i);
      gutter([-40, hh], [W + 40, hh], 24, 1, 'h');
      // the singer's pane (top left); on bar 108 it grows over the whole frame
      const sw = lerp(cw, W, km), sh = lerp(hh, H, km);
      pane(0, 0, sw, sh, JZ.mustard, (cx, cy, w, h) => C.singer(t, cx, cy, w, h, { key: 8, sc: lerp(fit(cw, hh, 560), 1.75, km), dx: lerp(90, 60, km), fy: .37 }), { key: 'sg8', pop: pk(g8) });
      if (km < 1) { gutter([sw, -40], [sw, sh + 12], 24, 1, 'mv'); gutter([-40, sh], [sw + 12, sh], 24, 1, 'mh'); }
    }
    pop();
  }

  // ---------- R3 · trading fours: split screens (189.85–196.85, bars 109–112) ----------
  // A diagonal split on a strict bar grid. Bars 109–110: the singer (left) ↔ the sax (right); the split leans toward
  // whoever has the phrase, and the sax's answer crosses the gutter. Bar 111: drums ↔ trumpet; shards fly right, rays cut back.
  function R3(t, lt, dur) {
    plate('R3');
    const t0 = bar(109), sw = bar(111);
    const [kx, ky] = shakeXY(t, 8 * hitK(t - (t < sw ? t0 : sw), 9));
    push(); translate(kx, ky);
    ground(JZ.ink);
    if (t < sw) {
      const lean = kf(t, [[t0, 1150], [191.35, 1150], [191.6, 800], [192.0, 800], [192.3, 1160], [193.35, 1160]], ease);
      const slide = 1 - easeOut(seg(t, t0 - .02, t0 + .14)), s0 = lean + 900 * slide, sl = 110;
      boilSeed('R3-lb'); block(rectPts(-40, -40, W + 80, H + 80), JZ.mustard, { ink: null });
      C.singer(t, 560, H / 2, 1120, H, { sc: 1.75, dx: 60, fy: .37, key: 'L' });
      const R = [[s0 + sl, -40], [W + 900, -40], [W + 900, H + 40], [s0 - sl, H + 40]];
      boilSeed('R3-rb'); block(R, JZ.blue, { ink: null }); halftone('ramp', s0 + 500, 800, W, 600, JZ.blueDk, .6);
      const sx = C.sax(t, s0 + (W - s0) / 2 + 60, H / 2, W - s0, H, { sc: 1.65, key: 'R', ribbon: false, fy: .37 });
      gutter([s0 + sl * 1.04, -40], [s0 - sl * 1.04, H + 40], 30, 1, 'd');
      // the sax's phrase grows in its own pane, then its answer crosses the gutter into the singer's pane
      const ag = easeOut(seg(t, 191.4, 191.85)) * (1 - ease(seg(t, 192.6, 193.3)));
      const g1 = easeOut(seg(t, t0 + .05, t0 + .6)) * (1 - seg(t, 191.0, 191.4));
      if (g1 > 0) saxRibbon(flowPath(sx.bell[0], sx.bell[1] - 4, -1.75, 360 * g1, t, { amp: 50, waves: 1, speed: .8, curl: 50 }), 64, t, { key: 'R3r0', tspeed: 1.8 });
      if (ag > 0) saxRibbon(flowPath(sx.bell[0], sx.bell[1] - 4, -2.75, 1500 * ag, t, { amp: 110, waves: 1.4, speed: .9, curl: 80, lift: k => -120 * Math.sin(k * Math.PI) }), 90, t, { key: 'R3r1', tspeed: 1.8, shine: 1 });
    } else R3b(t, 1 - easeOut(seg(t, sw - .02, sw + .14)), 0);
    pop();
  }
  // drums ↔ trumpet; slide = the new split sliding in (1 → 0); open = the two panes pulled apart like doors (0 → 1)
  function R3b(t, slide, open) {
    const sw = bar(111), s0 = 960 - 1000 * slide, sl = -110, dx = 1150 * open;
    push(); translate(dx, 0);
    boilSeed('R3-rt'); block([[s0 - sl - 30, -40], [W + 40, -40], [W + 40, H + 40], [s0 + sl - 30, H + 40]], JZ.ink2, { ink: null });
    const tp = C.trumpet(t, (s0 + W) / 2 + 40, H / 2, W - s0, H, { sc: 1.55, flip: true, key: 'R', rays: false, fy: .37 });
    pop();
    push(); translate(-dx, 0);
    boilSeed('R3-lb2'); block([[-900, -40], [s0 + sl, -40], [s0 - sl, H + 40], [-900, H + 40]], JZ.cream, { ink: null }); halftone('ramp', s0 / 2, 850, s0 + 200, 500, JZ.smoke, .6);
    const kit = C.drums(t, s0 / 2 - 40, H / 2, s0, H, { sc: 1.9, key: 'L', shards: false, fy: .4 });
    pop();
    if (open > 0) { gutter([s0 + sl + dx, -40], [s0 - sl + dx, H + 40], 30, 1, 'd2r'); gutter([s0 + sl - dx, -40], [s0 - sl - dx, H + 40], 30, 1, 'd2l'); }
    else gutter([s0 + sl * 1.04, -40], [s0 - sl * 1.04, H + 40], 30, 1, 'd2');
    if (open > 0) return;
    const [bb, bi] = sinceBackbeat(t);
    if (t - bb >= sw) shards(kit.snare[0], kit.snare[1], bb, bi, { n: 12, dist: 820, size: 42, dir: -.45, spread: 1.1, life: 1, fall: 300 });
    const note = Math.floor(bpOf(t) / 2) * 2, a = t - B(note);
    if (B(note) >= sw - .01) rays(tp.bell[0], tp.bell[1], Math.PI + .62, a, { len: 1000, n: 5, hold: BEAT * 1.3, spread: .38, w: 24, key: 'R3t', seed: note });
  }

  // ---------- R4 · the city lit by the band, a huge crane up (196.85–202.09, bars 113–115) ----------
  // ---------- R5 · the break: everything stops dead, one ray on the singer (202.09–205.60, bars 116–117) ----------
  // One painted city in layers (far skyline, the viaduct and its train, mid roofs, the near street) that slide down at
  // different speeds as the camera rises: c = crane progress 0 (street) → 1 (over the roofs). tf = the shapes' clock
  // (it stops dead at the break); dim = 0..1 (the city's light drops in the break).
  const FREEZE = bar(116);
  const LAYERS = { far: .35, via: .55, mid: .8, near: 1 };
  const CRANE = 1260;
  function lay(p, c, z) { const oy = -CRANE * p * (1 - c); push(); translate(W / 2, H / 2); scale(z); translate(-W / 2, -H / 2 + oy); return oy; }
  function cityWin(tf, id, dim) {   // windows are piano tiles: they flip cream/ink on the beats
    const b = Math.floor(bpOf(tf)), h = hash(id * 5.1);
    return (((id + b + Math.floor(h * 3)) % 3 === 0) ? 1 : h > .55 ? .8 : 0) * (1 - dim * .5);
  }
  function city(t, tf, c, dim) {
    const z = lerp(1.14, 1, ease(c)), D = col => mixCol(col, JZ.ink, dim * .55), bp = bpOf(tf);
    ground(D(JZ.blueDk));
    halftone('ramp', W / 2, 330, W + 300, 700, D(JZ.blue), .6, Math.PI);
    // moon high on the right
    lay(.12, c, z); moon(1490, 210, 130, { key: 'R4', glow: .6 * (1 - dim * .6), col: D(JZ.mustard) }); pop();
    // far skyline: small, blue, windows flipping
    lay(LAYERS.far, c, z);
    for (let i = 0; i < 11; i++) {
      const w = 150 + 90 * hash(i * 2.3), x = -100 + i * 195, h = 300 + 200 * hash(i * 4.7);
      building(x, 760, w, h, { col: D(JZ.blue), key: 'far' + i, ink: null, cell: 34, lit: (id) => cityWin(tf, id + i * 40, dim) });
    }
    pop();
    // the viaduct and the train (bass): ripples roll off its wheels on every beat
    lay(LAYERS.via, c, z);
    boilSeed('via');
    block(rectPts(-60, 700, W + 120, 34), D(JZ.ink2), { ink: JZ.ink, sw: 1.4 });
    for (let i = 0; i < 9; i++) { const ax = -40 + i * 250; block([[ax, 734], [ax + 250, 734], [ax + 250, 900], [ax + 215, 900], [ax + 200, 790], [ax + 125, 760], [ax + 50, 790], [ax + 35, 900], [ax, 900]], D(JZ.ink2), { ink: JZ.ink, sw: 1.2, curv: .2 }); }
    const trX = lerp(-1200, 2600, seg(tf, bar(113), bar(116) + 1.2)), [ba] = sinceBeat(tf);
    for (let k = 0; k < 5; k++) {
      const cx = trX - k * 300; if (cx < -300 || cx > W + 300) continue;
      if (k % 2 === 0) ripples(cx, 700, [ba + k * .05, ba + BEAT + k * .05], { speed: 230, life: 1.0, flat: .22, key: 'via' + k, sw: 4, col: D(JZ.blueLt) });
      boilSeed('car' + k);
      block(rrPts(cx - 140, 590, 280, 108, 16), D(k ? JZ.blueLt : JZ.verm), { ink: JZ.ink, sw: 1.4 });
      for (let j = 0; j < 4; j++) block(rectPts(cx - 115 + j * 60, 610, 42, 34), D(JZ.mustLt), { ink: JZ.ink, sw: .8 });
      if (!dim) glow(cx, 630, 110, '#FFD27A', .35);
      for (const wx of [-85, 85]) paint(ellPts(cx + wx, 700, 18, 18, 12), { wash: JZ.ink, ink: JZ.cream, sw: .8 });
    }
    pop();
    // mid roofs: the trumpeter on a water-tower roof, searchlight rays sweeping the sky on each long note
    lay(LAYERS.mid, c, z);
    for (let i = 0; i < 7; i++) {
      const w = 230 + 90 * hash(i * 7.9), x = -80 + i * 300, h = 330 + 160 * hash(i * 3.3);
      building(x, 1180, w, h, { col: D(mixCol(JZ.blueDk, JZ.ink2, .5)), key: 'mid' + i, cell: 44, roof: true, lit: (id) => cityWin(tf, id * 3 + i * 17, dim) });
    }
    boilSeed('tower'); inkLine([[1690, 870], [1690, 790]], 4, JZ.ink, 'ink', 0); inkLine([[1790, 870], [1790, 790]], 4, JZ.ink, 'ink', 0);
    block(rrPts(1670, 700, 140, 95, 20), D(JZ.wood), { ink: JZ.ink, sw: 1.4 });
    const note = Math.floor((bp - 1) / 2) * 2 + 1, na = tf - B(note);
    const tp = trumpeter(1740, 700, 12, tf, { blow: .8, flip: true, key: 'R4tp', boilKey: 'R4tp' });
    rays(tp.bell[0], tp.bell[1], -2.05 + .3 * Math.sin(note * 1.3), na, { len: 1250, n: 5, hold: BEAT * 1.6, spread: .3, w: 18, key: 'R4r', seed: note, glow: !dim });
    pop();
    // near street: lamps flash with the snare (shards), the near facades light up in tiles as we pass
    lay(LAYERS.near, c, z);
    for (const [x, w, h, col] of [[-120, 560, 1060, JZ.ink2], [1480, 560, 1120, JZ.ink2]]) building(x, 2080, w, h, { col: D(col), key: 'near' + x, cell: 58, roof: true, lit: (id) => cityWin(tf, id * 7 + x, dim) });
    boilSeed('street4'); block(rectPts(-60, 2080, W + 120, 400), D(JZ.ink), { ink: null }); inkLine([[-40, 2080], [W + 40, 2080]], 3, D(JZ.smoke), 'ink', 0);
    const [bb, bi] = sinceBackbeat(tf);
    [[520, 0], [960, 1], [1400, 0]].forEach(([lx, ph], i) => {
      const lp = streetLamp(lx, 2080, 400, 1 - dim * .6, { key: 'R4lamp' + i });
      if ((bi + ph) % 2 === 0) shards(lp[0], lp[1], bb, bi * 3 + i, { n: 8, dist: 220, size: 28, life: .8 });
    });
    const out = { z };
    pop();
    return out;
  }
  // the singer on the sax ribbon: a road of sound lifting it over the roofs. Screen space. rise 0..1.
  function ribbonRoad(tf, rise, c) {
    const baseY = lerp(2070, 1500, 0) - CRANE * (1 - c), sy = lerp(900, 600, ease(rise)), sxp = lerp(760, 820, ease(rise));
    const P = [[-120, baseY + 60], [200, lerp(baseY - 120, 900, rise)], [sxp - 180, sy + 40], [sxp + 40, sy + 8], [sxp + 400, sy - 40], [1300, sy - 200], [1700, sy - 90], [2100, sy - 260]];
    return { P, at: [sxp, sy] };
  }
  // the road of sound: from the sax's bell (world, on the near layer) under the singer and away over the roofs; screen space
  function r4Road(tf, c, rise, bell) {
    const z = lerp(1.14, 1, ease(c)), sb = [(bell[0] - W / 2) * z + W / 2, (bell[1] - CRANE * (1 - c) - H / 2) * z + H / 2];
    const sy = lerp((2080 - CRANE - H / 2) * 1.14 + H / 2, 500, rise), sxp = lerp(760, 830, rise);
    const road = [sb, [sb[0] + 200, sb[1] - 160], [sxp - 200, sy + 30], [sxp + 30, sy + 4], [sxp + 360, sy - 30], [1250, sy - 170 + 40 * Math.sin(tf * 2)], [1650, sy - 60], [2150, sy - 250]];
    return { road: road.map(([x, y], i) => [x, y + (i > 1 ? 16 * Math.sin(tf * 3 + i) : 0)]), sxp, sy };
  }
  const R4sax = tf => saxist(330, 2080, 24, tf, { shine: frac(bpOf(tf) * .3), rot: -.08, boilKey: 'R4sx', key: 'R4sx' });
  function R4(t, lt, dur) {
    plate('R4');
    const tf = Math.min(t, FREEZE), c = ease(seg(t, bt(113, 1), bt(115, 2))), lift = seg(t, bt(113, 1.6), bt(114, 1));
    city(t, tf, c, 0);
    // the band in the street below (on the near layer)
    const z = lerp(1.14, 1, ease(c));
    lay(1, c, z);
    const m = moodR(t), bpp = bpOf(t);
    const kit = marchDrummer(1180, 2080, 22, tf, { up: 1 - hitK(sinceBackbeat(tf)[0], 14), dy: -.4 * Math.abs(Math.sin(bpp * Math.PI)), boilKey: 'R4dr', key: 'R4dr' });
    const [bb, bi] = sinceBackbeat(tf);
    shards(kit.snare[0], kit.snare[1], bb, bi + 400, { n: 8, dist: 220, size: 28, dir: -Math.PI / 2, spread: 2.4 });
    const bs = bassist(1560, 2080, 22, tf, { flip: true, pluck: [sinceBeat(tf)[0], 9, 9, 9], boilKey: 'R4bs', key: 'R4bs' });
    const sx = R4sax(tf);
    pop();
    // the ribbon from the sax's bell: it swoops under the singer and carries it up
    const rise = ease(lift), { road, sxp, sy } = r4Road(tf, c, rise, sx.bell);
    const g = easeOut(seg(t, bt(113, .2), bt(113, 1.4)));
    saxRibbon(road, 64, tf, { key: 'R4road', grow: g, tspeed: 1.4, twist: 5, shine: 1 });
    const bob = 6 * Math.sin(tf * 3 + 3);
    const su = lerp(24 * 1.14, 22, rise), jj = jump(t, bt(113, 1.5), bt(113, 2.1), 0);
    const sg = singer(sxp, sy + bob, su, t, { ...m, view: 'front', mic: false, sq: (m.sq || 0) + jj.sq, aL: .9 + .25 * Math.sin(bpp * Math.PI / 2), aR: 1.2, boilKey: 'R4sg' });
    voiceCurls(sg.mouth[0], sg.mouth[1] - 10, tf, { s: 1, rise: 200 });
    // in: the split screens from R3 slide apart like two doors
    if (lt < .4) R3b(t, 0, ease(seg(lt, 0, .38)));
  }
  function R5(t, lt, dur) {
    plate('R4');
    const tf = FREEZE, c = 1, dim = ease(seg(t, FREEZE, FREEZE + .3));
    const pushK = ease(seg(t, FREEZE + .5, bar(118))), sxp = 830, sy = 500;
    const stop = spring(t, FREEZE, 9, 30) * .012;
    push(); translate(sxp, sy); scale(1 + .5 * pushK + stop); translate(-sxp + (960 - sxp) * .55 * pushK / 1.5, -sy + 110 * pushK / 1.5);
    city(t, tf, c, dim);
    const { road } = r4Road(tf, 1, 1, probe(() => R4sax(tf)).bell);
    saxRibbon(road, 64, tf, { key: 'R4road', tspeed: 1.4, twist: 5, col: mixCol(JZ.orange, JZ.ink, dim * .3), back: mixCol(JZ.orangeDk, JZ.ink, dim * .3) });
    // one ray of light finds the singer
    const rk = ease(seg(t, FREEZE + .15, FREEZE + .5));
    if (rk > 0) {
      spotlight(sxp + 160, -200, sxp, sy + 10, 330, { key: 'R5', a: rk, pool: true });
      boilSeed('R5beam'); paint([[sxp + 130, -200], [sxp + 190, -200], [sxp + 150, sy - 40], [sxp - 150, sy - 40]], { fill: JZ.cream, fillOp: 70 * rk, bleed: .1, tex: .4, border: .7, ink: null });
      for (let i = 0; i < 4; i++) glow(lerp(sxp + 160, sxp, i / 3), lerp(-100, sy - 90, i / 3), 150 + 40 * i, '#FFE9B8', .45 * rk);
    }
    const bob = 6 * Math.sin(tf * 3 + 3), m = emotions(t, [[175.4, 'determined'], [192.0, 'proud'], [FREEZE + .3, 'hopeful', { eyes: 'closed' }]], { take: .5 });
    const sg = singer(sxp, sy + bob, 22, t, { ...m, view: 'front', mic: false, aL: lerp(1.1, .35, ease(seg(t, FREEZE + .3, FREEZE + 1.2))), aR: lerp(1.2, -.5, ease(seg(t, FREEZE + .3, FREEZE + 1))), boilKey: 'R4sg' });
    voiceCurls(sg.mouth[0], sg.mouth[1] - 10, t, { s: 1, rise: 160, max: 3 });
    pop();
    // out: the ray becomes the work light over the empty table (a match cut); a short cream flash on the cut
  }

  // ---------- the table group: the singer seated (front view, mirrored so its gardenia is on the table side), the café
  // table with the candle and the lover's gardenia, the empty chair. (gx, gy) = the floor under the table; s = scale.
  // o: mood (clawd options), take 0..1 (the arm's journey: rest → .35 at the flower on its head → 1 laid on the table),
  // flameK, light, dark 0..1 (colours drained), tf (the flame's clock).
  // Geometry (u = 20s): the body sits on the chair seat; the near arm (L, mirrored to screen right) pivots at
  // (4.9u, -4.5u) from the singer's ground point and reaches 2.2u; the flower is held 1.72u beyond the hand, so the
  // hand meets the flower on the head at a = 1.977 and lays it on the tabletop at a = GA.lay.
  const GA = (() => {
    const s = 1, u = 20, sy = -27, top = -117.6, ty = top - .45 * u, sin = (-4.5 - (ty - sy) / u) / 3.92, lay = Math.asin(clamp(sin, -1, 1));
    return { lay, layX: (4.9 + 3.92 * Math.cos(lay)) * u, layY: ty };   // relative to (sx, gy)
  })();
  // chair() from props.js, but painted as filled strips (its ink strokes break up under the close zoom in U)
  function chairP(x, y, s, o = {}) {
    boilSeed('chairP' + (o.key || ''));
    const f = o.flip ? -1 : 1, P = pts => pts.map(([a, b]) => [x + f * a * s, y + b * s]), col = o.col || JZ.ink2, w = 5.5;
    const strip = (pts, ww) => paint(ribbon(P(pts), ww * s, ww * s * .8), { wash: col, ink: null });
    strip([[-40, 0], [-34, -110]], w); strip([[40, 0], [34, -110]], w);
    paint(P([[-46, -110], [46, -110], [46, -122], [-46, -122]]), { wash: col, ink: null });
    strip([[40, -118], [44, -200], [30, -250], [4, -262], [-10, -250]], w * 1.1);
    strip([[42, -170], [10, -185], [16, -228]], w * .7);
  }
  function tableGroup(t, gx, gy, s, o = {}) {
    const u = 20 * s, sx = gx - 232 * s, sy = gy - 27 * s, dk = o.dark || 0, D = c => mixCol(c, JZ.ink, dk);
    const chairCol = o.chairCol || JZ.ink2;
    chairP(sx - 18 * s, gy, .55 * s, { flip: true, key: 'tg1', col: D(chairCol) });
    chairP(gx + 128 * s, gy, .55 * s, { key: 'tg2', col: D(chairCol) });
    const top = cafeTable(gx, gy, .6 * s, { key: 'tg', top: D(JZ.cream), col: D(o.tableCol || JZ.ink2) });
    const k = o.take ?? 0, touch = .35;
    const a = k < touch ? lerp(-.55, 1.977, ease(k / touch)) : lerp(1.977, GA.lay, ease((k - touch) / (1 - touch)));
    const held = k >= touch && k < 1, laid = k >= 1;
    const dim = fn => dk > .02 ? silhouette(mixCol(JZ.cream, JZ.ink, dk * .8), fn) : fn();
    flowerAt(sx + GA.layX * s + 44 * s, gy + GA.layY * s + 1 * s, 17 * s, -.3);
    if (laid) flowerAt(sx + GA.layX * s, gy + GA.layY * s, u, 0);
    let fl;
    if (dk > .02) { fl = dim(() => candle(gx + 52 * s, top, 1.15 * s, o.tf ?? t, { key: 'tg', flame: 0 })); candleFlame(fl[0], fl[1], 1.15 * s, o.tf ?? t, { flame: o.flameK ?? 1, light: o.light ?? 1, lean: o.flameLean || 0 }); }
    else fl = candle(gx + 52 * s, top, 1.15 * s, o.tf ?? t, { key: 'tg', flame: o.flameK ?? 1, light: o.light ?? 1 });
    const hats = dk > .4 ? [] : singerHat({ noGardenia: held || laid });
    const m = o.mood || feel('sad', t);
    const sg = singer(sx, sy, u, t, {
      ...m, view: 'front', flip: true, mic: false, hat: hats, aL: a, aR: m.aR ?? -.6, noShadow: true,
      armL: held ? (uu) => flowerAt(1.72 * uu, 0, uu, 0) : undefined,
      ...(dk ? { col: D(PAL.clay), dk: D(PAL.clayDk), lt: D('#F5B394'), tint: null, blush: (m.blush || 0) * (1 - dk) } : {}),
      boilKey: 'tgS' + (o.key || ''), sing: o.sing,
    });
    return { flame: fl, singer: sg, sx, sy, u, top };
  }

  // ---------- S · after hours (205.60–219.72, bars 118–125), on twos ----------
  // reads: the club emptying (205.6–208: chairs up, the sax goes into its case, the drummer pockets its brushes, the
  // bassist walks out) · the push in to the singer at the table (208–212.5, "Where can you be, my love?") · it takes the
  // gardenia from its head and lays it by the other (213.2–215.5) · it looks at the two · a small smile to the empty
  // chair (217–219.7, "I'm still waiting here for you").
  const SG = [960, 880];
  const S_TAKE = [bt(122, 1.2), bt(122, 2.0), bt(123, 2.6)];   // start, touch, laid (213.5 → 213.9 → 215.4)
  const S_CAM = t => {
    const z0 = ease(seg(t, 205.75, 206.9)), zk = ease(seg(t, 207.7, 209.9)), zk2 = ease(seg(t, 214.8, 219.4));
    const bx = lerp(764, 960, z0), by = lerp(811, 540, z0), bz = lerp(1.65, 1, z0);
    // then in on the table for the song (u ≈ 40 on screen), and closer still for the gardenia and the smile (u ≈ 55),
    // framed from the singer to the empty chair
    const zk3 = ease(seg(t, 212.2, 213.35));
    const x1 = lerp(bx, SG[0] - 50, zk), y1 = lerp(by, SG[1] - 175, zk), z1 = lerp(bz, 2.0, zk);
    return [lerp(x1, SG[0] - 92, zk3) - 12 * zk2, lerp(y1, SG[1] - 118, zk3) - 6 * zk2, lerp(z1, 2.72, zk3) + .08 * zk2];
  };
  function upChairs(x, y, s, key) {   // a café table with two chairs upside down on it
    const tp = cafeTable(x, y, s, { key: 'St' + key, col: JZ.ink, top: JZ.ink });
    for (const [dx, fl] of [[-60, false], [70, true]]) { const cx = x + dx * s / .7; push(); translate(cx, tp); scale(1, -1); translate(-cx, -tp); chair(cx, tp, s * .75, { key: 'Sc' + key + dx, flip: fl, col: JZ.ink }); pop(); }
  }
  function S(t, lt, dur) {
    plate('S');
    const tt = onTwos(t), [gx, gy] = SG, [ccx, ccy, cz] = S_CAM(tt);
    camBegin(ccx, ccy, cz);
    // the dim room: back wall, the empty stage, tables with their chairs up
    ground(mixCol(JZ.blue, JZ.blueDk, .35), { tex: 25 });
    halftone('ramp', 960, 150, 2600, 800, JZ.blueDk, .8, Math.PI);
    boilSeed('S-wain'); inkLine([[-300, 560], [2300, 560]], 3, JZ.ink2, 'ink', 0);
    boilSeed('S-floor'); block(rectPts(-400, gy, 2800, 500), JZ.ink2, { ink: null }); halftone('ramp', 960, gy + 200, 2600, 400, JZ.ink, .5);
    // the stage, back left: the piano with its lid down, the kit
    boilSeed('S-stage'); block(rectPts(-300, 700, 820, 180), mixCol(JZ.wood, JZ.ink, .35), { ink: JZ.ink, sw: 1.6 });
    push(); translate(40, 0); silhouette(JZ.ink, () => grandPiano(-40, 700, .3, { key: 'Spn' })); pop();
    upChairs(250 + 320, gy, .7, 'a'); upChairs(1500, gy, .7, 'b'); upChairs(1840, gy, .7, 'c');
    // the band packing up
    // the sax case on the floor: open (orange lining showing), the horn laid in, the lid shut
    boilSeed('S-case'); const cx = 1330, cl = ease(seg(tt, 206.95, 207.35)), saxIn = tt >= 206.9, cs = 180;
    if (tt < 207.55) {
    paint(rrPts(cx - cs / 2, gy - 34, cs, 34, 8), { wash: JZ.wood, ink: JZ.ink, sw: 1.2 });
    if (cl < 1) paint(rrPts(cx - cs / 2 + 8, gy - 30, cs - 16, 12, 4), { wash: JZ.orange, ink: null });
    if (saxIn && cl < .8) { push(); translate(cx + 20, gy + 26); rotate(-1.57); sax(11, .7, { sc: 1 }); pop(); }
    push(); translate(cx + cs / 2, gy - 34); rotate(lerp(.95, 0, cl)); paint(rrPts(-cs, -26, cs, 26, 8), { wash: JZ.wood, ink: JZ.ink, sw: 1.2 }); if (cl < .7) paint(rrPts(-cs + 8, -20, cs - 16, 14, 4), { wash: JZ.orange, ink: null }); pop();
    }
    // …then picks the case up and walks out to the right
    const bend = Math.sin(Math.PI * seg(tt, 206.0, 207.3)), pick = tt >= 207.55, wx = lerp(cx - 150, 2350, easeIn(seg(tt, 207.7, 209.6)));
    if (wx < 2300) clawd(wx, gy, 18, { ...feel('neutral', tt), eyes: 'shades', hat: 'porkpie', view: 'side', rot: .4 * bend - .1 * Math.sin(Math.PI * seg(tt, 207.4, 207.7)), aL: pick ? -1.1 : -.6 * bend - .1, boilKey: 'Ssx',
      walk: pick ? (wx - cx + 150) / 72 : null, dy: pick ? -.3 * Math.abs(Math.sin((wx - cx + 150) / 72 * Math.PI)) : 0,
      armL: pick ? (uu, sw) => { paint(rrPts(.1 * uu, -cs * .45, 2 * uu, cs * .9, 6), { wash: JZ.wood, ink: JZ.ink, sw }); } : undefined,
      draw: saxIn ? undefined : (uu, sw) => { sax(uu, sw, { sc: 1.1 }); } });
    const dr = seg(tt, 206.3, 207.0);
    clawd(260, 700, 15, { ...feel('bored', tt), hat: 'band', view: 'q', aR: lerp(.7, -1.3, ease(dr)), aL: -.6, boilKey: 'Sdr',
      armR: dr < .85 ? (uu, sw) => stick(uu, sw, { a: -.4, brush: true, len: 2.6 }) : undefined });
    const bx = lerp(1640, 2400, ease(seg(tt, 205.6, 208.4)));
    if (bx < 2300) bassist(bx, gy, 16, tt, { walk: (bx - 1640) / 64, dy: -.3 * Math.abs(Math.sin((bx - 1640) / 64 * Math.PI)), boilKey: 'Sbs', key: 'Sbs' });
    // the work light: one bare bulb over the table (the break's ray, rhymed)
    boilSeed('S-bulb'); inkLine([[gx - 30, -400], [gx - 30, 250]], 2, JZ.ink, 'ink', 0);
    paint(ellPts(gx - 30, 262, 14, 18, 12), { wash: JZ.cream, ink: JZ.ink, sw: 1 }); glow(gx - 30, 262, 140, '#FFE9B0', .9);
    spotlight(gx - 30, 262, gx - 90, gy, 560, { key: 'S', a: .8, glow: false });
    smoke(tt, 300, 150, 1400, 600, { key: 'S', n: 5, op: 18 });
    // the singer at the empty table
    const k = tt < S_TAKE[0] ? 0 : tt < S_TAKE[1] ? .35 * seg(tt, S_TAKE[0], S_TAKE[1]) : .35 + .65 * seg(tt, S_TAKE[1] + .15, S_TAKE[2]);
    const mood = emotions(tt, [[205.6, 'sad', { eyes: 'sad', lookY: .6, lookX: -.5, emote: null }], [208.0, 'sad', { eyes: 'closed', emote: null }], [212.7, 'neutral', { eyes: 'sad', lookX: -.9, lookY: .7, aR: -.6 }],
      [S_TAKE[2] + .1, 'sad', { eyes: 'look', lookX: -.9, lookY: .8, mouth: null, emote: null, gloom: .1 }], [bt(124, 3), 'relieved', { eyes: 'normal', lookX: -.95, lookY: -.1, mouth: 'smile', emote: null, blush: .45 }]], { take: .4 });
    // the last word ("you…", 218.66) is hummed through a small smile at the empty chair
    tableGroup(tt, gx, gy, 1, { mood, take: k, key: 'S', sing: tt < 218.62, chairCol: mixCol(JZ.woodLt, JZ.wood, .4) });
    camEnd();
    // in: the ray → the work light (a cream flash on the cut)
    flash(.35 * (1 - seg(lt, 0, .12)), JZ.cream);
  }

  // ---------- T · the cover (219.72–230.33, bars 126–131) ----------
  // Every sound shape flies home and locks, hit by hit, into the composition from B1: rays close into the disc, the
  // ripples roll in as the blue band, shards snap into the wedge, tiles stack into the bars, the band hops on as ink
  // silhouettes around the singer's table, and on the last chord the sax ribbon wraps the disc. Then a freeze.
  const TG = [1020, 770, 1.1];
  const T_CHAIR = mixCol(JZ.wood, JZ.ink, .15);
  const S_END = () => { const [cx, cy, z] = S_CAM(bar(126)); return [(SG[0] - cx) * z + W / 2, (SG[1] - cy) * z + H / 2, z]; };   // the table group on the cover
  const LOCK = { disc: bt(126, 2), band: bt(127, 0), wedge: bt(127, 2), bars0: bt(128, 0), bars1: bt(128, 3), band0: bt(129, 0), ribbon: bt(131, 0) };
  // the band as ink silhouettes (u 19), each placed so its instrument reads against cream or mustard: the pianist at
  // its grand (lid up) and the bassist (scroll against the disc) on the floor; the trumpet, the sax and the marching
  // snare standing on the bars like bandstand risers, each instrument clear of its neighbours. [id, x, feet y, lands on]
  const BY = COVER.bandY;
  const BANDS = [['pn', 70, BY, bt(129, 0)], ['bs', 470, BY, bt(129, 1)], ['tp', 1190, BY - 520, bt(129, 2)],
    ['sx', 1590, BY - 470, bt(129, 3)], ['dr', 1790, BY - 350, bt(130, 0)]];
  const WEDGES = [JZ.verm, JZ.mustard, JZ.blue, JZ.cream, JZ.ink2, JZ.orange, JZ.mustard, JZ.verm, JZ.blue];
  function coverBand(t, key) {
    for (const [id, x, fy, at] of BANDS) {
      const k = seg(t, at - .3, at); if (k <= 0) continue;
      const j = jump(t, at - .3, at, 0), bk = key + id, yy = fy - (1 - easeIn(k)) * 900, u = 19;
      const o = { sil: JZ.ink, boilKey: bk, key: bk, sq: j.sq };
      if (id === 'bs') bassist(x, yy, u, t, { ...o, bh: 16 });
      else if (id === 'pn') pianist(x, yy, u, t, { ...o, aL: .45 });
      else if (id === 'tp') trumpeter(x, yy, u, t, { ...o, flip: true, aL: .75 });
      else if (id === 'sx') saxist(x, yy, u, t, { ...o, flip: true });
      else if (id === 'dr') marchDrummer(x, yy, u, t, { ...o, up: .7 });
    }
  }
  // the sax ribbon wrapped round the disc: one ribbon, one slow twist. It starts at the lower right (where it lands) and
  // runs anticlockwise round the top, leaving a gap at the bottom where the singer sits. g = how far round it has wrapped.
  const RING = { a0: 1.22, span: TAU - .55, r: COVER.disc[2] + 12 };
  function discRing(t, g, tw) {
    const [dx, dy] = COVER.disc, P = [], n = Math.max(3, Math.round(44 * Math.max(.06, g)));
    for (let i = 0; i <= n; i++) { const a = RING.a0 - (i / 44) * RING.span; P.push([dx + Math.cos(a) * RING.r, dy + Math.sin(a) * RING.r]); }
    saxRibbon(P, 46, .94, { key: 'Tring', twist: .6, tspeed: 1 });   // one face all the way round: no flips
  }
  // the ribbon's flight home: a curve in from the top right that meets the ring's start on the last chord
  const RIB_Q = q => { const P0 = [2150, 250], P1 = [1650, -150], P2 = [1150, 520], P3 = [COVER.disc[0] + Math.cos(RING.a0) * RING.r, COVER.disc[1] + Math.sin(RING.a0) * RING.r], m = 1 - q;
    return [0, 1].map(d => m * m * m * P0[d] + 3 * m * m * q * P1[d] + 3 * m * q * q * P2[d] + q * q * q * P3[d]); };
  function T(t, lt, dur) {
    plate('T');
    const t0 = bar(126), ex = lt;
    const fz = Math.min(t, LOCK.ribbon + .5);   // the clock the shapes run on; freeze after the last chord settles
    const e = (a, d = .14) => seg(t, a, a + d);
    const nb = clamp(Math.floor((t - LOCK.bars0) / ((LOCK.bars1 - LOCK.bars0) / 6)) + 1, 0, 7) / 7;
    const k = { disc: e(LOCK.disc), band: e(LOCK.band, .22), wedge: e(LOCK.wedge, .18), bars: t < LOCK.bars0 ? 0 : nb, fig: 1 };
    const hitTs = [t0, LOCK.disc, LOCK.band, LOCK.wedge, ...[0, 1, 2, 3, 4, 5, 6].map(i => LOCK.bars0 + i * (LOCK.bars1 - LOCK.bars0) / 6), ...BANDS.map(b => b[3]), LOCK.ribbon];
    const lastHit = hitTs.filter(h => h <= t).pop() ?? t0, bump = hitK(t - lastHit, 9) * (lastHit === LOCK.ribbon ? 1.6 : 1);
    // the pull back from the table close-up to the cover
    const pb = ease(seg(t, t0 + .05, t0 + .6)), [gx, gy, gs] = TG, S0 = S_END();
    const z = 1 + .02 * bump, [shx, shy] = shakeXY(t, 5 * bump);
    camBegin(W / 2 + shx, H / 2 + shy, z);
    cover(fz, k, {
      fig: () => {
        // the last chord: the ribbon sweeps in from the top right, dives behind the singer and wraps the disc
        const rg = seg(t, LOCK.ribbon - .75, LOCK.ribbon);
        if (rg > 0) {
          if (rg < 1) { const q = ease(rg), P = []; for (let i = 0; i <= 14; i++) P.push(RIB_Q(Math.max(0, q - i * .035))); saxRibbon(P.reverse(), 46, .94, { key: 'Tfly', twist: .6, tspeed: 1 }); }
          else discRing(t, easeOut(seg(t, LOCK.ribbon, LOCK.ribbon + .3)), LOCK.ribbon);
        }
        coverBand(fz, 'T');
        const mood = t < LOCK.ribbon ? feel('relieved', fz, { eyes: 'normal', lookX: -.95, mouth: 'smile', emote: null, blush: .4 }) : emotions(fz, [[0, 'relieved', { eyes: 'normal', lookX: -.95, mouth: 'smile', emote: null, blush: .4 }], [LOCK.ribbon, 'relieved', { eyes: 'closed', mouth: 'smile', emote: null, blush: .5 }]], { take: .3 });
        tableGroup(fz, lerp(S0[0], gx, pb), lerp(S0[1], gy, pb), lerp(S0[2], gs, pb), { mood, take: 1, key: 'T', sing: false, tf: Math.min(t, LOCK.ribbon + .1), chairCol: T_CHAIR });
      },
    });
    // the shapes flying home, each until it locks
    const [dx, dy, dr] = COVER.disc;
    if (t < LOCK.disc + .05) for (let i = 0; i < 4; i++) {   // rays from the four corners close in on the disc
      const q = easeIn(seg(t, LOCK.disc - .55, LOCK.disc)), cx = [-80, W + 80, -80, W + 80][i], cy = [-80, -80, H + 80, H + 80][i], a = Math.atan2(dy - cy, dx - cx);
      if (t > LOCK.disc - .55) rays(lerp(cx, dx, q * .8), lerp(cy, dy, q * .8), a, Math.min(.3, t - (LOCK.disc - .55)), { len: 700 * (1 - q) + 160, n: 4, hold: 1, spread: .3, w: 26, key: 'Tr' + i, seed: i, glow: false });
    }
    if (t > LOCK.band - .55 && t < LOCK.band + .05) {   // ripples roll in from the right
      const q = seg(t, LOCK.band - .55, LOCK.band);
      ripples(lerp(W + 300, W * .6, q), COVER.bandY + 75, [.2, .45, .7].map(a => a + q * .6), { speed: 500, life: 1.6, flat: .3, key: 'Trip', sw: 8 });
    }
    if (t > LOCK.wedge - .55 && t < LOCK.wedge + .02) for (let i = 0; i < 14; i++) {   // shards converge on the wedge
      const q = easeIn(seg(t, LOCK.wedge - .55, LOCK.wedge)), a = -1.5 + i * .2 + .1 * hash(i), r = (1100 + 300 * hash(i * 3)) * (1 - q) + 60;
      const x = 180 + Math.cos(a) * r, y = 930 + Math.sin(a) * r * .7, rt = i + q * 7, sz = 45 + 30 * hash(i * 7);
      boilSeed('Tsh' + i); paint([[x + Math.cos(rt) * sz, y + Math.sin(rt) * sz], [x + Math.cos(rt + 2.2) * sz, y + Math.sin(rt + 2.2) * sz], [x + Math.cos(rt + 4) * sz * .7, y + Math.sin(rt + 4) * sz * .7]], { wash: i % 3 ? JZ.verm : JZ.vermDk, ink: JZ.ink, sw: 1.2 });
    }
    if (t > LOCK.bars0 - .45 && t < LOCK.bars1 + .05) COVER.bars.forEach(([bx, bh], i) => {   // tiles fall and stack into the bars
      const at = LOCK.bars0 + i * (LOCK.bars1 - LOCK.bars0) / 6, q = seg(t, at - .4, at); if (q <= 0 || q >= 1) return;
      const n = Math.ceil(bh / 70);
      for (let j = 0; j < n; j++) { boilSeed('Ttile' + i + '_' + j); const y = COVER.bandY - 68 - j * 70 - (1 - easeIn(q)) * (700 + j * 160); paint(rectPts(bx - 34, y, 68, 66), { wash: (i + j) % 2 ? JZ.cream : JZ.ink, ink: JZ.ink, sw: 1 }); }
    });
    if (t >= LOCK.ribbon) { glow(dx, dy, 420 * hitK(t - LOCK.ribbon, 3), '#FFE7A8', .35); }
    camEnd();
    // in: the club blows apart into flat colour, flying out from the candle (B1's explosion, rhymed)
    if (ex < .5) {
      const S0 = S_END(), cx = S0[0] + 52 * S0[2], cy = S0[1] - 130 * S0[2], n = WEDGES.length, d = 1900 * Math.pow(clamp(ex / .5), 1.5);
      for (let i = 0; i < n; i++) {
        boilSeed('Twedge' + i);
        const a0 = -Math.PI + i / n * TAU + .2 * hash(i + 3), a1 = -Math.PI + (i + 1) / n * TAU + .2 * hash(i + 4), am = (a0 + a1) / 2, R = 2600, rr = 120 + 60 * hash(i);
        const ox = Math.cos(am) * (d + rr), oy = Math.sin(am) * (d + rr);
        push(); translate(cx + ox, cy + oy); rotate((hash(i * 5) - .5) * seg(ex, 0, .5));
        block([[0, 0], [Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(am) * R * 1.1, Math.sin(am) * R * 1.1], [Math.cos(a1) * R, Math.sin(a1) * R]], i % 2 ? JZ.ink2 : WEDGES[i], { ink: JZ.ink, sw: 2.4, misK: .6 });
        pop();
      }
    }
    flash(1 - seg(lt, 0, .06), '#FFE7A8');
  }

  // ---------- U · out (230.33–234.65, bars 132–134) ----------
  // The cover holds; then block by block its colours drain into the candle's flame, the cream last, closing on the
  // flame until only it and the singer's face are left. A breath in, and the singer blows it out. A thread of smoke.
  // Black: the breath before the match that opens the film.
  // Every block slides and shrinks into the flame in turn on the fading chord (disc last), while the cream under them
  // darkens to ink; the frame arrives at the flame and the lit face on ink by ~232.4. Then the breath, the blow.
  const DRAIN = { bars: [230.75, .55], band0: [230.95, .5], wedge: [231.15, .55], band: [231.4, .6], ring: [231.6, .55], disc: [231.8, .65] };
  const GROUND_DK = [230.8, 232.4], BLOW = 232.95, OUT = BLOW + .2;
  function U(t, lt, dur) {
    plate('T');
    const [gx, gy, gs] = TG, fz = LOCK.ribbon + .5, [dx, dy, dr] = COVER.disc;
    const pushK = kf(t, [[230.6, 0], [231.7, .12], [232.65, 1]], ease);   // hold wide while the blocks go, push in with the disc
    const F = [gx + 52 * gs + 1.15 * gs, gy - 117.6 * gs - 46 * 1.15 * gs - 5 * 1.15 * gs];   // the flame
    const sgx = gx - 232 * gs;   // the singer
    const cz = lerp(1, 2.25, pushK), ccx = lerp(W / 2, (sgx + F[0]) / 2 + 10, pushK), ccy = lerp(H / 2, F[1] + 20, pushK);
    const Fs = [(F[0] - ccx) * cz + W / 2, (F[1] - ccy) * cz + H / 2];
    // after the blow-out: black, the ember dying on the wick and a thread of smoke; then only black (= frame 0)
    if (t >= OUT) {
      ground(JZ.ink);
      const em = 1 - seg(t, OUT, OUT + .45);
      if (em > 0) { glow(Fs[0], Fs[1] + 14, 40 * em, '#FF9A4A', .8 * em); boilSeed('Uember'); paint(ellPts(Fs[0], Fs[1] + 14, 3.5, 3.5, 8), { wash: mixCol(JZ.orange, JZ.ink, 1 - em), ink: null }); }
      const sm = seg(t, OUT - .05, 233.85);
      if (sm < 1) { boilSeed('Usmoke'); const P = []; for (let i = 0; i <= 10; i++) { const q = i / 10; P.push([Fs[0] + (22 * Math.sin(q * 5 + sm * 3) * q + 18 * q) * (.5 + sm), Fs[1] + 10 - q * 260 * (.35 + sm)]); } inkLine(P, 3.2 * (1 - sm), mixCol(JZ.smoke, JZ.ink, .25 + .75 * sm), 'inkfine', .6); }
      return;
    }
    camBegin(ccx, ccy, cz);
    const gk = ease(seg(t, GROUND_DK[0], GROUND_DK[1]));
    boilSeed('cover-ground'); ground(mixCol(JZ.cream, JZ.ink, gk), { tex: 30 * (1 - gk) });
    // q(id): 0 in place → 1 swallowed. Each block slides toward the flame and shrinks about it (ease in: it's sucked in)
    const q = id => { const [a, d] = DRAIN[id]; return easeIn(seg(t, a, a + d)); };
    const into = (pts, k) => pts.map(([x, y]) => [lerp(x, F[0], k), lerp(y, F[1], k)]);
    const at = (x, y, k) => [lerp(x, F[0], k), lerp(y, F[1], k)];
    let k = q('wedge'); boilSeed('cover-wedge'); if (k < 1) block(into([[-40, 1120], [-40, 560], [620, 1120]], k), JZ.verm, { ink: JZ.ink, sw: 1.6 });
    k = q('disc'); boilSeed('cover-disc');
    if (k < 1) { const [cx, cy] = at(dx, dy, k), r = dr * (1 - k); block(ellPts(cx, cy, r, r, 48), JZ.mustard, { ink: JZ.ink, sw: 1.8 }); halftone('disc', cx + r * .28, cy + r * .25, r * 1.3, r * 1.3, JZ.mustDk, .45); }
    k = q('band'); boilSeed('cover-band');
    if (k < 1) { const P = into(rectPts(-40, COVER.bandY, W + 80, 150), k); block(P, JZ.blue, { ink: JZ.ink, sw: 1.6 }); const [hx, hy] = at(W / 2, COVER.bandY + 110, k); halftone('ramp', hx, hy, (W + 80) * (1 - k), 90 * (1 - k), JZ.blueDk, .8); }
    COVER.bars.forEach(([bx, bh], i) => {   // the bars go first, one after another from the far end
      const kk = easeIn(seg(t, DRAIN.bars[0] + (6 - i) * .06, DRAIN.bars[0] + (6 - i) * .06 + DRAIN.bars[1])); if (kk >= 1) return;
      boilSeed('cover-bar' + i); block(into(rectPts(bx - 34, COVER.bandY - bh, 68, bh), kk), i % 2 ? JZ.ink2 : JZ.ink, { ink: JZ.ink, sw: 1.2 });
    });
    k = q('ring'); if (k < 1) { push(); translate(lerp(0, F[0] - dx, k) + dx, lerp(0, F[1] - dy, k) + dy); scale(1 - k); translate(-dx, -dy); discRing(t, 1, LOCK.ribbon); pop(); }
    // the band goes with the bars (the risers) and with the floor, shrinking into the flame
    k = q('band0');
    if (k < 1) { push(); translate(F[0], F[1]); scale(1 - k); translate(-F[0], -F[1]); translate((F[0] - W / 2) * 0, 0); coverBand(fz, 'T'); pop(); }
    // each colour flares in the flame as it's swallowed
    for (const [id, col] of [['wedge', JZ.verm], ['band', JZ.blueLt], ['ring', JZ.orange], ['disc', JZ.mustard]]) {
      const [a, d] = DRAIN[id], f = seg(t, a + d * .7, a + d + .25); if (f > 0 && f < 1) glow(F[0], F[1], 140 * Math.sin(Math.PI * f), col, .8);
    }
    const blow = seg(t, BLOW - .02, OUT), fl = 1 - easeIn(blow), leanK = Math.sin(Math.PI * .5 * seg(t, BLOW - .06, OUT)) * 1.4;
    const inhale = seg(t, 232.45, BLOW), ex_ = seg(t, BLOW, BLOW + .5);
    const mood = { ...feel('relieved', fz, { eyes: 'closed', mouth: 'smile', emote: null, blush: .4 }),
      ...(t > 232.3 ? { eyes: 'normal', lookX: -.95, lookY: .3, mouth: t > BLOW - .08 ? 'o' : 'smile', blush: .2 } : {}),
      sq: -.18 * easeOut(inhale) * (t < BLOW ? 1 : 0) + (t >= BLOW ? -.18 * (1 - ease(seg(t, BLOW, BLOW + .12))) + .14 * Math.sin(Math.PI * ex_) : 0), dy: -.35 * easeOut(inhale) * (t < BLOW ? 1 : 1 - ease(seg(t, BLOW, BLOW + .2))) };
    const grp = tableGroup(fz, gx, gy, gs, { mood, take: 1, key: 'T', sing: false, dark: .86 * gk, flameK: fl, light: fl, flameLean: leanK, tf: fz + (t - fz) * .15, chairCol: T_CHAIR });
    if (gk > 0 && fl > 0) glow(lerp(grp.singer.mouth[0], F[0], .35), grp.singer.mouth[1] - 20 * gs, 170 * gs, '#FFB766', .6 * fl * gk);
    // the puff of breath that blows it out
    if (t > BLOW - .05) { const pq = seg(t, BLOW - .05, OUT); boilSeed('Upuff'); paint(ellPts(lerp(grp.singer.mouth[0] + 8, F[0] - 4, pq), lerp(grp.singer.mouth[1], F[1] - 6, pq), 8 * (1 - pq) + 3, 5 * (1 - pq) + 2, 10), { wash: JZ.cream, washOp: 170 * (1 - pq), ink: null }); }
    camEnd();
  }

  shots([[bar(101), R1], [bar(105), R2], [bar(109), R3], [bar(113), R4], [FREEZE, R5], [bar(118), S], [bar(126), T], [bar(132), U]]);
})();
