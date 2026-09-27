// bootcamp/b_weeks.js: Act II (bar 13.85 → bar 48, 22.1 → 76.3 s), "build it, week by week". See STORYBOARD_bootcamp.md.
// Every week: the camera whips to that week's part of the map, Clawd (hard hat, chalk in hand) drops in from above and
// lands on the downbeat, a revision tag `W#` is stamped, Clawd scribbles with the chalk and the part is inked and lights
// up; then Clawd leaps out of the top of the frame and the camera whips on. Pitfall weeks: the problem in one bar, the
// fix lands on the next downbeat and one warm label names it. What is built when is in world.js (INK, TAGS).
(() => {
  const { B, bb, C, COMP, WEEK, INK } = BC;
  const U = BC.U;
  const START = bb(13, 3.35);                                  // Act II takes over as Clawd leaps off Evals

  // ---------- Clawd's week plan ----------
  // at: feet; flip: faces left; moods: emotion keys (0 = the landing); draw: build windows (scribbling with the chalk);
  // hops: [[t0, t1, [x, y]]] moves to another spot inside the week, on an arc.
  const wk = n => WEEK[n];
  const landT = n => bb(wk(n)[0], 0), leaveT = n => bb(wk(n)[1], -.95);
  const PLAN = [
    { n: 0, at: COMP.evals.stand, flip: true, land: -Infinity, leave: bb(13, 3.45), moods: [[-1e9, 'idea', { lookX: -.8 }]] },
    { n: 1, at: COMP.dev.stand, flip: true, moods: [[0, 'determined'], [bb(14, 1), 'excited'], [bb(14, 1.6), 'determined'], [bb(15, 2.4), 'proud']],
      draw: [[bb(14, 1.2), bb(14, 3.2)]], type: [bb(14, 1.2), bb(15, 1.8)] },
    { n: 2, at: [470, 950], moods: [[0, 'determined', { lookY: .7 }], [bb(17, 1.4), 'proud']], draw: [INK.frontend] },
    { n: 3, at: [2150, 800], moods: [[0, 'determined', { lookX: -.6, lookY: .5 }], [bb(18, 1.2), 'determined', { lookX: .7, lookY: .5 }],
      [bb(18, 2.2), 'determined', { lookX: -1, lookY: .4 }], [bb(19, .1), 'excited', { lookX: -.5 }], [bb(19, 2.6), 'happy']],
      draw: [INK.backend, INK.context, INK.auth] },
    { n: 4, at: COMP.llm.stand, moods: [[0, 'determined', { lookY: .6 }], [bb(20, 2), 'excited', { lookX: .8 }], [bb(21, 2.8), 'proud']], draw: [INK.llm] },
    { n: 5, at: COMP.dev.stand, flip: true, moods: [[0, 'determined'], [bb(22, 1.3), 'scared', { lookX: 1 }], [bb(23, .3), 'relieved'], [bb(23, 2), 'proud']] },
    { n: 6, at: COMP.evals.stand, moods: [[0, 'determined', { lookY: .6 }], [bb(25, 0), 'determined', { lookX: -.8, lookY: .5 }], [bb(26, 1), 'proud'],
      [bb(26, 2.4), 'suspicious', { lookX: -1 }], [bb(27, 1.6), 'scared', { lookX: .6 }], [bb(28, .3), 'relieved'], [bb(28, 2), 'proud']],
      draw: [INK.evals, INK.tracing, [bb(25, 2), bb(26, .2)]] },
    { n: 7, at: COMP.memory.stand, moods: [[0, 'determined', { lookY: -.6 }], [bb(29, 1.9), 'determined', { lookX: -.8, lookY: -.6 }], [bb(30, 0), 'happy', { lookX: -.6, lookY: -.5 }]],
      draw: [INK.memory, INK.loop] },
    { n: 8, at: COMP.tools.stand, moods: [[0, 'determined', { lookY: .6 }], [bb(31, 2), 'excited', { lookX: .8 }], [bb(32, 2), 'proud']], draw: [INK.tools] },
    { n: 9, at: [1880, 800], moods: [[0, 'determined', { lookX: -.5, lookY: .6 }], [bb(34, 0), 'determined', { lookX: .6, lookY: .6 }],
      [bb(35, 1.2), 'surprised', { lookX: .5, lookY: .7 }], [bb(36, 0), 'proud', { lookY: .5 }]],
      draw: [[bb(33, .8), bb(33, 2)], INK.approval], hops: [[bb(35, 2.8), bb(36, 0), [2090, 1040]]] },
    { n: 10, at: COMP.ltm.stand, moods: [[0, 'determined', { lookY: .7 }], [bb(37, 2.8), 'thinking', { lookY: .7 }], [bb(38, .4), 'neutral', { lookY: .7 }], [bb(38, 2.4), 'proud']],
      draw: [INK.ltm, [bb(37, 2.8), bb(37, 3.6)]] },
    { n: 11, at: [1880, 800], moods: [[0, 'determined', { lookX: -.4, lookY: .6 }], [bb(39, 3), 'scared', { lookX: -.4, lookY: .6 }], [bb(40, .3), 'relieved'], [bb(40, 2.2), 'proud']],
      draw: [[bb(39, .4), bb(39, 1.8)]] },
    { n: 12, at: COMP.llm.stand, moods: [[0, 'determined', { lookY: .6 }], [bb(43, 2), 'proud'], [bb(44, .2), 'determined', { lookY: .4 }],
      [bb(44, 2.6), 'scared', { lookX: 1 }], [bb(45, .3), 'relieved', { lookX: .8 }], [bb(45, 2), 'proud']],
      draw: [[bb(43, .4), bb(43, 1.4)], [bb(44, .3), bb(44, 2)]], hops: [[bb(43, 3.2), bb(44, .1), [760, 2700], true]] },
    { n: 13, at: COMP.tools.stand, moods: [[0, 'determined', { lookX: .6 }], [bb(46, 1.4), 'suspicious', { lookX: .9 }], [bb(46, 3), 'scared', { lookX: .9 }],
      [bb(47, .3), 'relieved'], [bb(47, 2), 'proud']] },
  ];
  for (const p of PLAN) if (p.n > 0) { p.land = landT(p.n); p.leave = leaveT(p.n); }
  const DROP = .3, LEAP = .32;

  function clawdII(t) {
    const p = PLAN.find(q => t >= q.land - DROP && t < q.leave + LEAP); if (!p) return;
    let [sx, sy] = p.at, hopSq = 0, hopAir = false;
    let flip = !!p.flip;
    for (const [h0, h1, to, f] of p.hops || []) {
      if (t >= (h0 + h1) / 2 && f !== undefined) flip = f;
      if (t >= h1) [sx, sy] = to;
      else if (t > h0) { [sx, sy] = arcPt([sx, sy], to, 220, ease(seg(t, h0, h1))); hopAir = true; hopSq = jump(t, h0, h1, 0).sq; }
      else hopSq = jump(t, h0, h1, 0).sq;
      if (t > h1) hopSq = jump(t, h0, h1, 0).sq;
    }
    let y = sy, sq = hopSq, air = hopAir;
    if (t < p.land) { const k = seg(t, p.land - DROP, p.land); y = sy - 1100 * (1 - easeIn(k)); sq = -.18; air = true; }          // drop in
    else if (t < p.leave && t - p.land < .6) sq += .24 * Math.exp(-(t - p.land) * 9) * Math.cos((t - p.land) * 26);               // land
    if (t > p.leave - .12 && t < p.leave) sq = .2 * ease(seg(t, p.leave - .12, p.leave));                                        // crouch
    if (t >= p.leave) { const k = seg(t, p.leave, p.leave + LEAP); y = sy - 1300 * easeIn(k); sq = -.2; air = true; }              // leap out
    const mood = emotions(t, p.moods.map(([tt, e, o]) => [tt === 0 ? p.land : tt, e, o]));
    const drawing = (p.draw || []).some(([a, b]) => t > a && t < b), typing = p.type && t > p.type[0] && t < p.type[1];
    const pose = {};
    if (drawing) Object.assign(pose, { aR: 1 + .35 * Math.sin(t * 34), aL: .2 });
    if (typing) Object.assign(pose, { aL: .15 + .45 * pulse2(t, 9), aR: .1 + .45 * pulse2(t + B / 4, 9) });
    if (air) Object.assign(pose, { aL: 1.3, aR: 1.1 });
    clawd(sx, y, U, { ...mood, ...pose, view: 'q', flip, sq: (mood.sq || 0) + sq, hat: t > bb(14, 1) ? 'hard' : undefined,
      armR: (u, sw) => paint(rrPts(-.2 * u, -.35 * u, 1.5 * u, .7 * u, .3 * u), { wash: C.chalk, ink: PAL.ink, sw: sw * .8 }) });
  }

  // ---------- camera ----------
  const VL = BC.fit([1480, 470, 2400, 1450]), VG = BC.fit([3080, 740, 3900, 1450]), VT = BC.fit([3600, 1560, 4400, 2200]);
  const V = {
    1: BC.fit([-780, 2170, 40, 2930]), 2: BC.fit([150, 690, 760, 1470]), 3: BC.fit([380, 740, 2780, 1620]), 4: VG,
    5: BC.fit([-780, 2170, 40, 2930]), 6: BC.fit([3300, 2020, 4760, 2720]), 7: BC.fit([1480, 950, 2560, 2230]), 8: VT,
    9: VL, 10: BC.fit([1850, 1560, 2900, 2230]), 11: VL, 12: VG, 13: VT,
  };
  // extra camera moves inside a week: [t0, t1, view] (eased from whatever came before)
  const MOVES = {
    11: [[bb(40, 2.6), bb(41, 1.2), BC.MAP_VIEW], [bb(41, 1.2), bb(42, 1.5), [BC.MAP_VIEW[0] + 60, BC.MAP_VIEW[1], BC.MAP_VIEW[2] * 1.04]]],
    12: [[bb(43, 3.1), bb(44, .05), BC.fit([-20, 2250, 1250, 2950])]],
  };
  let CAMK = null;
  function camKeys() {
    const K = [[START, BC.camI(START)]];
    for (let n = 1; n <= 13; n++) {
      const land = PLAN[n].land, prev = K[K.length - 1][1];
      const whip = n === 12 ? .9 : .42;                                  // out of the wide map: a longer push in
      K.push([land - whip, prev], [land - .04, V[n]]);
      let last = V[n];
      for (const [a, b, v] of MOVES[n] || []) { K.push([a, [last[0] + 15, last[1], last[2] * 1.01]], [b, v]); last = v; }
      if (!MOVES[n]) K.push([PLAN[n].leave + .05, [last[0] + 20, last[1], last[2] * 1.02]]);
    }
    return K;
  }
  function camAt(t) {
    const K = CAMK || (CAMK = camKeys()); if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t < K[i][0]) {
      const [ta, a] = K[i - 1], [tb, b] = K[i], k = ease((t - ta) / (tb - ta));
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), k))];
    }
    return K[K.length - 1][1];
  }
  // Whip smear: pale streaks across the frame along the camera's motion when it moves fast (screen space).
  function smear(t) {
    const a = camAt(t), b = camAt(t + 1 / 24), vx = (b[0] - a[0]) * a[2] * 24, vy = (b[1] - a[1]) * a[2] * 24, v = Math.hypot(vx, vy);
    if (v < 2500) return;
    const k = clamp((v - 2500) / 9000), dx = vx / v, dy = vy / v, nx = -dy, ny = dx, len = 250 + 700 * k;
    for (let i = 0; i < 16; i++) {
      const o = (hash(i * 3.7) - .5) * 1500, c = (hash(i * 9.1) - .5) * 1600, x = 960 + nx * o + dx * c, y = 540 + ny * o + dy * c;
      boilSeed('smear' + i);
      inkLine([[x - dx * len / 2, y - dy * len / 2], [x + dx * len / 2, y + dy * len / 2]], .5 + .6 * hash(i), i % 3 ? C.pencil : C.chalk, 'dry', 0);
    }
  }

  // ---------- props ----------
  const pop = (t, t0, d = .3) => backOut(seg(t, t0, t0 + d));
  function inked(P, k, sw = 1, col = C.chalk) { if (k > 0) BC.inkPath(P, k, sw, col); }
  // W1: a clipboard with the spec and a checklist, ticked on three beats
  function clipboard(t) {
    const k = pop(t, bb(15, 0)); if (k <= 0) return;
    boilSeed('clip');
    const x = -715, y = 2560 - 150 * k;
    paint(BC.RR(x, y, 90, 150 * k, 10), { wash: C.card, ink: C.chalk, sw: .9 });
    for (let i = 0; i < 3; i++) {
      const ty = y + 38 + i * 38; if (ty > 2548) continue;
      inked([[x + 14, ty], [x + 30, ty]], 1, .8, C.chalkDk);
      const tk = seg(t, bb(15, 1 + i * .5), bb(15, 1.2 + i * .5));
      if (tk > 0) inked([[x + 44, ty - 2], [x + 52, ty + 8], [x + 72, ty - 12]], tk, 1.1, '#9BD67A');
    }
  }
  // W2: the chat UI's four states pop in on four beats: waiting, success, failure, human review
  function uiStates(t) {
    const T = [bb(16, 2), bb(16, 3), bb(17, 0), bb(17, 1)], X = [300, 410, 520, 630], y = 1150;
    for (let i = 0; i < 4; i++) {
      const k = pop(t, T[i]); if (k <= 0) continue;
      const x = X[i], r = 34 * k; boilSeed('ui' + i);
      paint(ellPts(x, y, r, r, 16), { wash: C.card, ink: C.chalkDk, sw: .7 });
      if (i === 0) inked(BC.ARC(x, y, r * .55, r * .55, t * 6, t * 6 + 4.2, 12), 1, 1, C.chalk);
      if (i === 1) inked([[x - r * .45, y], [x - r * .1, y + r * .35], [x + r * .5, y - r * .4]], 1, 1.2, '#9BD67A');
      if (i === 2) { inked([[x - r * .4, y - r * .4], [x + r * .4, y + r * .4]], 1, 1.2, C.redLt); inked([[x + r * .4, y - r * .4], [x - r * .4, y + r * .4]], 1, 1.2, C.redLt); }
      if (i === 3) { inked(BC.CIRC(x, y - r * .25, r * .22, 10), 1, 1, C.note); inked(BC.ARC(x, y + r * .45, r * .45, r * .35, Math.PI, TAU, 10), 1, 1, C.note); }
    }
  }
  // W3, break 19: the first end-to-end run of the tiny MVP, and its answer coming back
  function mvpRun(t) {
    const t0 = bb(19, 0), tm = bb(19, 2), t1 = bb(19, 3.6); if (t < t0 || t > t1 + .2) return;
    const P = [[560, 1150], [1020, 1150], [1420, 1160], [2560, 1150]];
    const q = t < tm ? BC.tickAlong(t, t0, tm) : 1 - BC.tickAlong(t, tm, t1), [x, y] = BC.along(P, q);
    BC.packet(x, y, t, t > t1 ? 1 - seg(t, t1, t1 + .2) : 1);
  }
  // W4: the gateway calls a model and the answer comes back (call and response), twice
  function modelCalls(t) {
    const a = bb(21, 0); if (t < a || t > bb(21, 4)) return;
    const b = bpOf(t) - bpOf(a), i = Math.floor(b / 2), f = (b % 2) / 2, tgt = i ? [3620, 1340] : [3620, 980];
    const q = f < .5 ? easeOut(f * 2) : 1 - easeOut((f - .5) * 2), P = [[3300, 1160], [3530, 1160], [3530, tgt[1]], tgt];
    const [x, y] = BC.along(P, q); BC.packet(x, y, t, 1, 12);
  }
  // W5 · pitfall 6: the coding assistant reaches for a secret; a hook clamps it
  const KEY = [-600, 2540];
  function hooks(t) {
    if (t < bb(22, 0)) return;
    boilSeed('key');
    paint(BC.CIRC(KEY[0] - 14, KEY[1] - 8, 14, 12), { wash: C.note, ink: C.chalk, sw: .7 });
    inked([[KEY[0], KEY[1] - 8], [KEY[0] + 36, KEY[1] - 8], [KEY[0] + 36, KEY[1] + 2]], 1, 1, C.chalk);
    const t0 = bb(22, 1), t1 = bb(23, 0), fix = t >= t1;
    const path = [[-420, 2425], [-480, 2380], [-560, 2420], [-575, 2505]];
    const q = fix ? 1 : BC.tickAlong(t, t0, t1) * .98, [x, y] = BC.along(path, q);
    if (t > t0 && !fix) {                                                  // the red spark crawls toward the key
      glow(x, y, 110, C.red, 1); boilSeed('spark' + Math.floor(t * 12));
      paint(starPts(x, y, 30 + 9 * pulse2(t), .38, 4, t * 3), { wash: C.redLt, ink: C.red, sw: .6 });
      inked(BC.subPath(path, 0, BC.lenOf(path) * q), 1, 1.3, C.red);
    }
    if (fix) {                                                            // the hook slams down over it and it fizzles out
      const d = seg(t, t1, t1 + .12), hy = lerp(y - 260, y, easeIn(d));
      boilSeed('hook');
      paint([[x - 44, hy - 60], [x + 44, hy - 60], [x + 44, hy + 30], [x + 26, hy + 30], [x + 26, hy - 42], [x - 26, hy - 42], [x - 26, hy + 30], [x - 44, hy + 30]],
        { wash: C.note, ink: C.chalk, sw: 1 });
      const f = seg(t, t1, t1 + .6); if (f < 1) { glow(x, y, 70 * (1 - f), C.grey, .7 * (1 - f)); }
      if (t < t1 + .15) glow(x, y, 160, C.note, 1 - seg(t, t1, t1 + .15));
    }
  }
  // W6: the golden set, then pitfall 4: a change rolls in, a golden test flips red, the eval gate drops
  function evalGate(t) {
    for (let i = 0; i < 3; i++) {                                           // golden cards over Evals
      const k = pop(t, bb(25, 2 + i * .5)); if (k <= 0) continue;
      const x = 4478 + i * 90, y = 2330, red = i === 1 && t > bb(27, 1.5);
      const flip = i === 1 ? Math.abs(Math.cos(Math.PI * seg(t, bb(27, 1.2), bb(27, 1.5)))) : 1, w = 64 * k * (t > bb(27, 1.2) && t < bb(27, 1.5) ? flip : 1);
      boilSeed('gold' + i);
      paint(BC.RR(x + 32 - w / 2, y, Math.max(4, w), 96 * k, 8), { wash: red ? '#6E2E3A' : C.card, ink: red ? C.redLt : C.chalk, sw: .8 });
      if (!red) inked([[x + 18, y + 50], [x + 28, y + 62], [x + 46, y + 36]], seg(t, bb(25, 2.2 + i * .5), bb(25, 2.4 + i * .5)), 1, '#9BD67A');
      else { inked([[x + 18, y + 34], [x + 46, y + 66]], 1, 1.1, C.redLt); inked([[x + 46, y + 34], [x + 18, y + 66]], 1, 1.1, C.redLt); }
      if (red) glow(x + 32, y + 48, 80, C.red, .6 * (1 - seg(t, bb(28, 0), bb(28, 1))) + .2);
    }
    // the change: a small diff card sliding in from the left along the trace axis; it bounces back off the gate
    const t0 = bb(26, 2), t1 = bb(27, 0), tf = bb(28, 0); if (t < t0) return;
    let x = lerp(3380, 4020, easeOut(seg(t, t0, t1)));
    if (t > tf) x = lerp(4020, 3820, elasticOut(seg(t, tf, tf + .7)) * .9 + .1 * seg(t, tf, tf + .7));
    boilSeed('change');
    paint(BC.RR(x - 60, 2290, 120, 130, 12), { wash: C.cardLt, ink: C.chalk, sw: .9 });
    inked([[x - 28, 2335], [x - 8, 2335]], 1, 1, '#9BD67A'); inked([[x - 18, 2325], [x - 18, 2345]], 1, 1, '#9BD67A');
    inked([[x - 28, 2372], [x - 8, 2372]], 1, 1, C.redLt); inked([[x + 4, 2335], [x + 32, 2335]], 1, .7, C.chalkDk); inked([[x + 4, 2372], [x + 32, 2372]], 1, .7, C.chalkDk);
    if (t > t1 && t < tf) glow(4600, 2380, 200, C.note, .25 * pulse(t, 3));        // the golden set checks it (scanning)
    // the eval gate: a post, and an arm that drops on the downbeat
    const gk = seg(t, tf - .05, tf + .1), gx = 4110;
    if (t > t1) {
      boilSeed('evalgate');
      paint(BC.R(gx - 12, 2250, 24, 310), { wash: C.note, ink: C.chalk, sw: .9 });
      const a = lerp(-Math.PI / 2, -Math.PI, easeIn(gk)), L = 240;
      inked([[gx, 2270], [gx + Math.cos(a) * L, 2270 + Math.sin(a) * L]], 1, 2, C.note);
      if (t > tf && t < tf + .2) glow(gx - 120, 2270, 180, C.note, 1 - seg(t, tf, tf + .2));
    }
  }

  // W7: documents fall into the vector store and are chunked; at break 30 the loop runs and an answer comes back cited
  function rag(t) {
    for (let i = 0; i < 3; i++) {
      const t0 = bb(29, .4 + i * .5), k = seg(t, t0, t0 + .45); if (k <= 0 || k >= 1) continue;
      const x = 1960 + i * 60, y = lerp(1560, 1850, easeIn(k)), s = 1 - .5 * seg(k, .7, 1);
      boilSeed('doc' + i);
      paint(BC.R(x - 28 * s, y - 36 * s, 56 * s, 72 * s), { wash: C.cardLt, ink: C.chalk, sw: .7 });
    }
    const a = bb(30, 0), m = bb(30, 2), b = bb(30, 3.8); if (t < a || t > b + .2) return;
    const P = [[1550, 1160], [1600, 1290], [1720, 1332], [1860, 1332], [2020, 1500], [2020, 1700], [2020, 1975]];
    const q = t < m ? BC.tickAlong(t, a, m) : 1 - BC.tickAlong(t, m, b), [x, y] = BC.along(P, q);
    BC.packet(x, y, t, t > b ? 1 - seg(t, b, b + .2) : 1);
    if (t > m) { boilSeed('cite'); paint([[x + 16, y - 34], [x + 44, y - 34], [x + 44, y + 4], [x + 30, y - 8], [x + 16, y + 4]], { wash: C.note, ink: C.chalk, sw: .6 }); }
  }
  // W8: the three plugs click in on three beats, then the agent calls each outside tool once
  function plugs(t) {
    for (let i = 0; i < 3; i++) {
      const t0 = bb(31, 2 + i), y = 1867 + i * 80; if (t < t0) continue;
      if (t < t0 + .3) glow(4005, y, 90, C.note, 1 - seg(t, t0, t0 + .3));
      boilSeed('plug' + i); BC.inkPath([[3990, y - 9], [4020, y - 9]], 1, 1.1, C.note); BC.inkPath([[3990, y + 9], [4020, y + 9]], 1, 1.1, C.note);
    }
    const a = bb(32, 0); if (t < a || t > bb(32, 3.8)) return;
    const b = (bpOf(t) - bpOf(a)) / 1.25, i = Math.floor(b), f = b - i; if (i > 2) return;
    const tgt = [[4250, 1840], [4250, 1942], [4250, 2046]][i], P = [[3800, 1940], [3990, 1867 + i * 80], [4020, 1867 + i * 80], tgt];
    const q = f < .5 ? easeOut(f * 2) : 1 - easeOut((f - .5) * 2), [x, y] = BC.along(P, q); BC.packet(x, y, t, 1, 12);
  }
  // W9: bounds (a stop sign and a step budget), then pitfall 2: a payment tries to go out; the approval gate holds it
  // until Clawd (the human) approves it
  function bounded(t) {
    const { cx, cy } = BC.LOOP;
    const sk = pop(t, bb(33, 1)); if (sk > 0) { boilSeed('stop'); paint(starPts(cx, cy, 52 * sk, .92, 8, Math.PI / 8), { wash: '#B8483F', ink: C.chalk, sw: .9 }); BC.inkPath([[cx - 26 * sk, cy], [cx + 26 * sk, cy]], 1, 1.6, C.chalk); }
    for (let i = 0; i < 5; i++) {                                       // the step budget: five dots, used up one per beat
      const t0 = bb(33, 1.5); if (t < t0) break;
      const on = t > t0 + (i + 1) * B * .5 && t < bb(34, 2), x = cx - 100 + i * 50, y = cy + 95;
      boilSeed('step' + i); paint(ellPts(x, y, 12, 12, 10), { wash: on ? C.note : C.card, ink: C.chalkDk, sw: .6 });
    }
    // the approval gate's barrier arm (lifts once approved) and its button
    const ap = BC.state('approval', t), lift = seg(t, bb(36, .1), bb(36, .6));
    BC.gateArm(ap.p, lift, ap.ink > .5 ? 1 : 0, 2036, 1160, 108, 'appr-arm', C.note, 2.8);
    if (t > bb(36, 0)) glow(2090, 1245, 60, '#9BD67A', 1 - .5 * seg(t, bb(36, 0), bb(36, 1)));
    // the payment: a coin shot out of the loop; it stops at the gate, then passes once approved
    const a = bb(35, .1), h = bb(35, 1), go = bb(36, .5); if (t < a) return;
    let x = lerp(1890, 1990, easeOut(seg(t, a, h)));
    if (t > go) x = lerp(1990, 2600, easeIn(seg(t, go, go + .5)));
    const bump = t > h && t < h + .3 ? 12 * Math.sin((t - h) * 40) * (1 - seg(t, h, h + .3)) : 0;
    if (x < 2560) { boilSeed('coin'); glow(x + bump, 1160, 70, C.note, .8); paint(BC.CIRC(x + bump, 1160, 26, 16), { wash: C.note, ink: C.chalk, sw: .8 }); BC.inkPath(BC.CIRC(x + bump, 1160, 14, 12), 1, .7, C.clayDk); }
  }
  // W10: long-term memory: one drawer's card is corrected; at break 38 another drawer is emptied (deleted)
  function drawers(t) {
    const o1 = seg(t, bb(37, 2), bb(37, 2.4)) * (1 - seg(t, bb(37, 3.6), bb(38, 0))), o2 = seg(t, bb(38, .2), bb(38, .6)) * (1 - seg(t, bb(38, 2.4), bb(38, 2.8)));
    for (const [i, o] of [[0, o1], [1, o2]]) {
      if (o <= 0) continue;
      const y = 1872 + i * 65, x = 2620 + 150 * ease(o); boilSeed('drawer' + i);
      paint(BC.R(x, y, 180, 56), { wash: C.cardLt, ink: C.chalk, sw: .8 });
      const gone = i === 1 ? seg(t, bb(38, 1), bb(38, 1.8)) : 0;                       // the deleted card crumples and fades
      if (gone < 1) {
        const s = 1 - .7 * gone; paint(BC.R(x + 110 - 40 * s, y - 40 * s + 20 * gone, 80 * s, 50 * s), { wash: C.chalk, washOp: 255 * (1 - gone), ink: null });
        if (i === 0) { BC.inkPath([[x + 80, y - 2], [x + 138, y - 2]], seg(t, bb(37, 2.8), bb(37, 3.1)), .8, C.redLt); BC.inkPath([[x + 80, y + 10], [x + 132, y + 10]], seg(t, bb(37, 3.1), bb(37, 3.5)), .8, '#9BD67A'); }
      }
      if (gone > 0 && gone < 1) glow(x + 110, y - 15, 70, C.grey, .6 * (1 - gone));
    }
  }
  // W11: checkpoints on the loop; pitfall 3: a long task crashes halfway and resumes from the last checkpoint
  const PIN_A = [-Math.PI / 2 + .2 - .2, -Math.PI / 2 + TAU / 3, -Math.PI / 2 + 2 * TAU / 3];
  function harness(t) {
    const { cx, cy, r } = BC.LOOP, crash = bb(39, 3), resume = bb(40, 0);
    for (let i = 0; i < 3; i++) {
      const k = pop(t, bb(39, .5 + i * .5)); if (k <= 0) continue;
      const x = cx + Math.cos(PIN_A[i]) * r, y = cy + Math.sin(PIN_A[i]) * r; boilSeed('pin' + i);
      BC.inkPath([[x, y], [x, y - 70 * k]], 1, 1, C.chalk);
      paint([[x, y - 70 * k], [x + 44 * k, y - 58 * k], [x, y - 46 * k]], { wash: C.note, ink: C.chalk, sw: .6 });
    }
    // the long task: the packet laps the loop from beat 1.5; it dies at the crash and comes back at the last pin passed
    const a = bb(39, 1.5), lap = t => Math.PI + BC.tickAlong(t, a, bb(41, 0)) * TAU * 1.5;
    const lastPin = PIN_A[0] + TAU;                                      // the top pin: the last one it passed before the crash
    if (t > a && (t < crash || t > resume) && t < bb(41, .2)) {
      const ang = t < crash ? lap(t) : lastPin + (lap(t) - lap(resume)) * 1.1, k = t > resume ? backOut(seg(t, resume, resume + .25)) : 1;
      BC.packet(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, t, k);
    }
    if (t > crash && t < resume + .3) {                                   // the crack
      const f = 1 - seg(t, resume, resume + .3); boilSeed('crack');
      BC.inkPath([[cx + 60, cy - 200], [cx + 20, cy - 110], [cx + 70, cy - 60], [cx + 10, cy + 20], [cx + 60, cy + 90], [cx + 20, cy + 200]], f, 1.6, C.red);
      glow(cx, cy, 260, C.red, .5 * f);
    }
  }
  // W12: a router inside the AI Gateway; pitfall 5: data slips toward the edge of the region and bounces off the VPC wall
  function residency(t) {
    const rk = pop(t, bb(43, .5));
    if (rk > 0) { boilSeed('router'); paint([[3290, 1160 - 40 * rk], [3330, 1160], [3290, 1160 + 40 * rk], [3250, 1160]], { wash: C.violet, ink: C.chalk, sw: .8 }); }
    for (let i = 0; i < 2; i++) {                                          // two requests routed to the big and the small model
      const a = bb(43, 1.5 + i); if (t < a || t > a + B * 1.2) continue;
      const tgt = i ? [3620, 1340] : [3620, 980], q = easeOut(seg(t, a, a + B)), [x, y] = BC.along([[3250, 1160], [3530, 1160], [3530, tgt[1]], tgt], q);
      BC.packet(x, y, t, 1 - seg(t, a + B, a + B * 1.2), 11);
    }
    const a = bb(44, 2), hit = bb(45, 0), wx = 60; if (t < a) return;
    let x = lerp(640, wx + 30, easeIn(seg(t, a, hit)));
    if (t > hit) x = lerp(wx + 30, 420, easeOut(seg(t, hit, hit + .6)));
    boilSeed('data'); glow(x, 2640, 70, C.teal, .9); paint(BC.CIRC(x, 2640, 20, 14), { wash: '#8FE0D8', ink: C.chalk, sw: .7 });
    if (t > hit - .05) {                                                   // the VPC wall stands up on the region's edge
      const k = seg(t, hit - .05, hit + .1); boilSeed('wall');
      BC.inkPath([[wx, 2700], [wx, 2700 - 330 * k]], 1, 2.2, C.note);
      if (t < hit + .25) glow(wx, 2560, 220, C.note, 1 - seg(t, hit, hit + .25));
    }
  }
  // W13 · pitfall 1: a web page carries a hidden instruction that snakes toward the tools; the boundary turns it into
  // plain data and it drops away
  function injection(t) {
    const a = bb(46, .6), hit = bb(47, 0); if (t < a) return;
    const P = [[4250, 1840], [4200, 1780], [4140, 1830], [4090, 1770], [4030, 1820]], q = t < hit ? BC.tickAlong(t, a, hit) : 1;
    const head = BC.along(P, q), fall = seg(t, hit, hit + .7);
    boilSeed('inject');
    const col = t < hit ? C.red : mixCol(C.red, C.grey, seg(t, hit, hit + .15));
    const S = BC.subPath(P, 0, BC.lenOf(P) * q).map(([x, y]) => [x, y + 300 * easeIn(fall)]);
    if (S.length > 1 && fall < 1) BC.inkPath(S, 1, 1.8, col);
    if (t < hit) { glow(head[0], head[1], 70, C.red, .9); }
    if (t > hit - .05) {                                                    // the boundary lights up at the tools' door
      const k = seg(t, hit - .05, hit + .1); boilSeed('shield');
      BC.inkPath([[3995, 1800], [3995, 1800 + 280 * k]], 1, 2.2, C.note);
      if (t < hit + .25) glow(3995, 1940, 200, C.note, 1 - seg(t, hit, hit + .25));
    }
  }

  // warm labels that name each pitfall's fix; they stay on the map
  const NOTES = [['Hooks', -560, 2230, bb(23, .25)], ['Eval Gate', 3990, 2630, bb(28, .25)], ['Checkpoint', 1545, 975, bb(40, .3)],
    ['Data Residency', 330, 2565, bb(45, .3)], ['Prompt Injection', 4150, 1690, bb(47, .3)]];
  function notes(t, cam) {
    for (const [txt, x, y, t0] of NOTES) if (t > t0) BC.label(null, seg(t, t0, t0 + .6), cam, C.note, [txt, x, y], .95);
    if (t > bb(36, .3)) BC.label('approval', seg(t, bb(36, .3), bb(36, 1.1)), cam, C.note, null, .95);
    if (t > bb(20, 2)) BC.label(null, seg(t, bb(20, 2), bb(20, 2.8)), cam, C.chalk, ['LLM', 3720, 1165], .8);
    if (t > bb(43, .9)) BC.label(null, seg(t, bb(43, .9), bb(43, 1.6)), cam, C.chalk, ['Router', 3300, 1055], .7);
  }

  function actII(t) {
    const cam = camAt(t);
    BC.world(t, cam, {
      hook: t => { clipboard(t); uiStates(t); mvpRun(t); modelCalls(t); hooks(t); evalGate(t); rag(t); plugs(t); bounded(t); drawers(t); harness(t); residency(t); injection(t); clawdII(t); },
      labels: notes,
    });
    smear(t);
    if (t > bb(39, 3) && t < bb(39, 3) + .1) flash(.35 * (1 - seg(t, bb(39, 3), bb(39, 3) + .1)), C.red);   // the crash: a smash frame
  }
  BC.actII = actII; BC.camII = camAt;
  shots([[START, actII]]);
})();
