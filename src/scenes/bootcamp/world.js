// bootcamp/world.js: WHEN things happen on the map, for the whole film, and one function that draws the map at any t.
// Every act draws the sheet with BC.world(t, cam), so a component's state (pencil, inked, lit) is the same whichever
// shot is on screen. See STORYBOARD_bootcamp.md for the schedule.
(() => {
  const { bb, C, COMP } = BC;
  const B = BEAT;

  // ---------- Act I: the request's path (one stop per bar) ----------
  const STOP = { 2: 'frontend', 3: 'auth', 4: 'backend', 5: 'loop', 6: 'memory', 7: 'context', 8: 'llm', 9: 'tools', 10: 'tracing', 11: 'evals' };
  const DEP = 2.6;                                             // the packet and Clawd leave each stop at this beat
  const arrive = k => bb(k, 0), depart = k => bb(k, DEP);
  const REST = { 2: [550, 1120], 3: [870, 1150], 4: [1420, 1160], 5: [1550, 1160], 6: [2020, 1975], 7: [2560, 1150],
    8: [3300, 1160], 9: [3800, 1945], 10: [3870, 2425], 11: [4300, 2440] };
  const WIRE = {
    2: [[550, 1120], [640, 1150], [700, 1150], [870, 1150]],
    3: [[870, 1150], [1020, 1150], [1140, 1155], [1340, 1160], [1420, 1160]],
    4: [[1420, 1160], [1550, 1160]],
    5: [[1550, 1160], [1600, 1290], [1720, 1332], [1860, 1332], [2020, 1500], [2020, 1700], [2020, 1975]],
    6: [[2020, 1975], [2020, 1800], [2150, 1640], [2300, 1450], [2440, 1300], [2560, 1150]],
    7: [[2560, 1150], [2740, 1160], [3160, 1160], [3300, 1160]],
    8: [[3300, 1160], [3440, 1160], [3530, 1160], [3560, 1500], [3800, 1720], [3800, 1945]],
    9: [[3800, 1945], [3800, 2080], [3840, 2250], [3870, 2425]],
    10: [[3870, 2425], [4000, 2432], [4150, 2436], [4300, 2440]],
  };
  // pencil reveal of each component (Act I)
  const PENCIL = { frontend: [.22, 1.7], cloud: [bb(12, .2), bb(12, 2.2)], guard: [bb(12, .8), bb(13, 0), 'lin'], dev: [bb(12, 2), bb(12, 3.6)] };
  for (const k in STOP) if (k > 2) PENCIL[STOP[k]] = [arrive(+k), arrive(+k) + (STOP[k] === 'backend' ? .6 : .45)];
  const LABEL = { frontend: [bb(2, .9), bb(2, 1.7)], cloud: [bb(12, 1.4), bb(12, 2.4)], guard: [bb(12, 2.8), bb(13, .2)], dev: [bb(13, 0), bb(13, 1)] };
  for (const k in STOP) if (k > 2) LABEL[STOP[k]] = [arrive(+k) + .25, arrive(+k) + .7];
  LABEL.approval = [bb(36, .3), bb(36, 1.1)]; LABEL.ltm = [bb(37, 1.6), bb(37, 2.4)];

  // ---------- Act II: the weeks ----------
  // Bars per week. Pitfall weeks: the problem in one bar, the fix on the next downbeat (breaks: 19, 22, 27, 30, 35, 38, 43, 46).
  const WEEK = { 1: [14, 16], 2: [16, 18], 3: [18, 20], 4: [20, 22], 5: [22, 24], 6: [24, 29], 7: [29, 31], 8: [31, 33],
    9: [33, 37], 10: [37, 39], 11: [39, 43], 12: [43, 46], 13: [46, 48] };
  // ink (build) of each component: [t0, t1, how far (1 = whole, .5 = half: covered at its core)]
  const INK = {
    dev: [bb(14, 1.2), bb(14, 3.2), 1],
    frontend: [bb(16, .4), bb(16, 1.8), 1],
    backend: [bb(18, .2), bb(18, 1.2), 1], context: [bb(18, 1.2), bb(18, 2.2), 1], auth: [bb(18, 2.2), bb(18, 3.4), .5],
    llm: [bb(20, .4), bb(20, 1.8), 1],
    evals: [bb(24, .4), bb(24, 2.2), 1], tracing: [bb(25, 0), bb(25, 2), 1],
    memory: [bb(29, .4), bb(29, 1.9), 1], loop: [bb(29, 1.9), bb(29, 3.4), 1],
    tools: [bb(31, .4), bb(31, 1.9), 1],
    approval: [bb(34, 0), bb(34, 1.6), 1],
    ltm: [bb(37, .3), bb(37, 1.8), 1],
    guard: [bb(40, 3.5), bb(42, 1), 1],
    cloud: [bb(44, 0), bb(44, 2), .5],
  };
  // parts that only exist from Act II on are sketched in pencil just before they are inked
  for (const id of ['approval', 'ltm']) PENCIL[id] = [INK[id][0] - .5, INK[id][0]];
  const GLOW = { memory: C.teal, evals: '#9BD67A', guard: C.note, tools: C.rose, loop: C.clay, llm: C.violet, auth: C.grey, cloud: C.grey };

  // revision tags [week, x, y, t]
  const TAGS = [
    [1, -640, 2860, bb(14, .6)], [2, 700, 1400, bb(16, .6)], [3, 2780, 1395, bb(18, .6)], [4, 3500, 1372, bb(20, .6)],
    [5, -120, 2240, bb(22, .6)], [6, 4460, 2620, bb(24, .6)], [7, 2420, 2175, bb(29, .6)], [8, 4030, 2140, bb(31, .6)],
    [9, 2200, 950, bb(33, .6)], [10, 2880, 2135, bb(37, .6)], [11, 2800, 628, bb(41, .6)], [12, 3520, 1030, bb(43, .6)],
    [13, 4420, 1740, bb(46, .6)],
  ];

  const ek = (t, a, b, e) => (e === 'lin' ? seg(t, a, b) : ease(seg(t, a, b)));
  function state(id, t) {
    const P = PENCIL[id], I = INK[id];
    const p = P ? ek(t, P[0], P[1], P[2]) : 0;
    if (!I) return { p };
    const ink = ek(t, I[0], I[1], 'lin') * I[2], done = t >= I[1];
    const full = I[2] >= 1 && done, lit = done ? ease(seg(t, I[1], I[1] + .3)) * (1 + .9 * Math.exp(-(t - I[1]) * 3.5)) : 0;
    return { p, ink, solid: full ? ease(seg(t, I[1], I[1] + .35)) : 0, lit: lit * (I[2] >= 1 ? 1 : .5), glowCol: GLOW[id] || C.warm };
  }
  const built = (id, t) => { const I = INK[id]; return I ? ek(t, I[0], I[1], 'lin') : 0; };
  // A wire inks once the parts at both of its ends are built (a half-built part counts).
  const wireInk = (k, t) => { const a = INK[STOP[k]], b = INK[STOP[k + 1]]; if (!a || !b) return 0; const t0 = Math.max(a[1], b[1]); return ease(seg(t, t0, t0 + .6)); };

  // ---------- extra components that appear in Act II (added to BC.COMP) ----------
  const { R, RR, L, CIRC } = BC;
  COMP.approval = { id: 'approval', label: ['Approval', 2090, 1330], stand: [2090, 1040], solid: [],
    paths: () => [R(2010, 1040, 26, 240), R(2144, 1040, 26, 240), CIRC(2090, 1245, 20, 12)] };
  COMP.ltm = { id: 'ltm', label: ['Long-term', 2710, 2135], stand: [2710, 1850], solid: [0],
    paths: () => [RR(2600, 1850, 220, 230, 14), R(2620, 1872, 180, 56), R(2620, 1937, 180, 56), R(2620, 2002, 180, 56),
      L([2690, 1900], [2730, 1900]), L([2690, 1965], [2730, 1965]), L([2690, 2030], [2730, 2030])] };
  const ALL = ['guard', 'cloud', 'dev', 'frontend', 'auth', 'backend', 'loop', 'approval', 'memory', 'ltm', 'context', 'llm', 'tools', 'tracing', 'evals'];

  // ---------- draw the map ----------
  // o.hook(t, cam) draws the act's own things (props, packet, Clawd) inside the camera, before the labels.
  function world(t, cam, o = {}) {
    BC.sheet(cam);
    camBegin(cam[0], cam[1], cam[2]);
    for (let k = 2; k <= 10; k++) {                                              // wires
      const w = BC.tickAlong(t, depart(k), arrive(k + 1)), wi = wireInk(k, t);
      if (w > 0 && wi < 1) { boilSeed('wire' + k); BC.pencilPath(WIRE[k], w, .8); }
      if (wi > 0) { boilSeed('wirei' + k); BC.inkPath(WIRE[k], wi, .9, C.chalkDk); }
    }
    for (const id of ALL) BC.comp(id, state(id, t), cam);
    const au = state('auth', t);                                                // the API Gateway's barrier arm
    BC.gateArm(au.p, (o.gateLift || (() => 0))(t), au.ink > .3 ? 1 : 0);
    if (o.hook) o.hook(t, cam);
    // labels: pencil when planned, chalk when built
    for (const id of ALL) {
      const Lt = LABEL[id]; if (!Lt) continue;
      const k = seg(t, Lt[0], Lt[1]); if (k <= 0) continue;
      const bk = INK[id] ? seg(t, INK[id][1] - .1, INK[id][1] + .3) : 0;
      BC.label(id, k, cam, mixCol(C.pencil, C.chalk, bk));
    }
    for (const [n, x, y, t0] of TAGS) if (t > t0) BC.tag(n, x, y, seg(t, t0, t0 + .35), cam);
    if (o.labels) o.labels(t, cam);
    camEnd();
  }

  Object.assign(BC, { STOP, DEP, arrive, depart, REST, WIRE, WEEK, INK, TAGS, state, built, world, ALL });
})();
