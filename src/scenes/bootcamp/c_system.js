// bootcamp/c_system.js: Act III (bar 47.75 → end, 75.9 → 85.16 s), "the system runs". See STORYBOARD_bootcamp.md.
//   bar 48      the camera pulls out to the whole sheet; a wave of light runs across the finished map, left → right.
//   bar 49      a push back in to the chat window (the opening, rhymed): Clawd drops in where it first stood, types the
//               same message and sends it.
//   bars 50–51  wide again: the packet runs the whole lit route, left → right, and comes back right → left as the
//               answer; the camera pushes in as the answer lands in the chat window with a tick. Clawd is starstruck.
//   bars 52–53  the glockenspiel tag: sparkles run along the window and the wire; pencil boxes sketch in off the
//               left edge of the sheet (what to learn next, no labels); Clawd glances at them, hopeful; an iris
//               closes on Clawd on the last note.
(() => {
  const { B, bb, C, COMP, WIRE, U } = BC;
  const START = bb(47, 3);
  const MAP = BC.MAP_VIEW, CHAT = BC.fit([-260, 820, 920, 1560]), TAG = BC.fit([-820, 700, 980, 1600]);
  const ROUTE = (() => { const P = []; for (let k = 2; k <= 10; k++) P.push(...(P.length ? WIRE[k].slice(1) : WIRE[k])); return P; })();
  const T = { land: bb(49, 0), send: bb(49, 2.4), run: bb(49, 3), turn: bb(50, 3.2), home: bb(51, 1.2), tag: bb(52, 0), iris: bb(53, .2) };

  let CAMK = null;
  const camKeys = () => [[START, BC.camII(START)], [bb(48, .6), MAP], [bb(49, -.7), [MAP[0] + 40, MAP[1], MAP[2] * 1.02]],
    [T.land - .05, CHAT], [T.run - .1, [CHAT[0] + 15, CHAT[1], CHAT[2] * 1.01]], [T.run + .6, MAP], [T.turn, [MAP[0] + 30, MAP[1], MAP[2] * 1.02]],
    [T.home - .05, CHAT], [T.tag, [CHAT[0] - 10, CHAT[1], CHAT[2] * 1.01]], [bb(53, 0), TAG], [DUR, [TAG[0] + 20, TAG[1], TAG[2] * 1.02]]];
  function camAt(t) {
    const K = CAMK || (CAMK = camKeys()); if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t < K[i][0]) {
      const [ta, a] = K[i - 1], [tb, b] = K[i], k = ease((t - ta) / (tb - ta));
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), k))];
    }
    return K[K.length - 1][1];
  }

  // the wave of light across the finished map (bar 48)
  function wave(t) {
    const t0 = bb(48, 0); if (t < t0 - .2 || t > t0 + 2) return;
    for (const id of BC.ALL) {
      const b = BC.boxOf(id), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, tc = t0 + (cx + 800) / 5600 * 1.3, a = Math.exp(-Math.pow((t - tc) / .22, 2));
      if (a > .02) { boilSeed('wave-' + id); glow(cx, cy, Math.min(700, Math.max(b[2] - b[0], b[3] - b[1]) * .8), C.warm, .55 * a); }
    }
  }
  // the chat window's second message: typing, the bubble, and the answer that comes back
  function chat(t) {
    const ty = seg(t, bb(49, .6), bb(49, 2.2));
    if (ty > 0 && t < T.send) { const P = []; for (let x = 250; x <= 250 + 320 * ty; x += 12) P.push([x, 1294 + 7 * Math.sin(x * .09)]); boilSeed('typing2'); if (P.length > 1) BC.inkPath(P, 1, .8, C.chalk); }
    const bs = seg(t, T.send, T.send + .25), sh = ease(seg(t, T.run - .15, T.run + .1));
    if (bs > 0) {                                                            // the user's bubble (right), it stays as sent
      boilSeed('ubub'); paint(BC.RR(440, 1060, 220, 70, 24), { wash: C.cardLt, washOp: 255 * bs, ink: C.chalk, sw: .8 });
      BC.inkPath([[465, 1085], [620, 1085]], bs, .8, C.chalkDk); BC.inkPath([[465, 1108], [570, 1108]], bs, .8, C.chalkDk);
      if (sh < 1 && t < T.run + .1) BC.packet(550, 1095, t, bs * (1 - .3 * sh));
    }
    const ak = pop(t, T.home + .05);
    if (ak > 0) {                                                            // the answer (left), with a tick
      boilSeed('abub'); glow(340, 1195, 200, C.warm, .5 * ak);
      paint(BC.RR(225, 1145, 250 * ak, 90, 24), { wash: C.card, ink: C.chalk, sw: .9 });
      BC.inkPath([[250, 1175], [400, 1175]], seg(t, T.home + .2, T.home + .45), .8, C.chalk);
      BC.inkPath([[250, 1203], [360, 1203]], seg(t, T.home + .35, T.home + .6), .8, C.chalk);
      BC.inkPath([[420, 1192], [436, 1208], [462, 1170]], seg(t, T.home + .6, T.home + .8), 1.4, '#9BD67A');
    }
  }
  const pop = (t, t0, d = .3) => backOut(seg(t, t0, t0 + d));
  // the request runs the finished route and the answer comes back
  function run(t) {
    if (t < T.run || t > T.home) return;
    const fwd = t < T.turn, q = fwd ? BC.tickAlong(t, T.run, T.turn) : 1 - easeIn(seg(t, T.turn, T.home - .1));
    const [x, y] = BC.along(ROUTE, q);
    BC.packet(x, y, t, 2.6, 15);
    for (let i = 1; i <= 4; i++) {                                         // a short trail of light behind it
      const [tx, ty] = BC.along(ROUTE, clamp(q + (fwd ? -1 : 1) * i * .012)); glow(tx, ty, 200 - 35 * i, C.warm, .5 - .1 * i);
    }
  }
  // the next map: pencil boxes that trail off the left edge of the sheet, fainter as they go
  function future(t) {
    const B0 = [[-420, 820, 260, 180], [-720, 1080, 220, 160], [-1000, 900, 200, 150], [-640, 1330, 240, 150]];
    B0.forEach(([x, y, w, h], i) => {
      const k = seg(t, T.tag + i * .25, T.tag + .5 + i * .25); if (k <= 0) return;
      boilSeed('future' + i); BC.pencilPath(BC.RR(x, y, w, h, 18), easeOut(k), .9, mixCol(C.pencil, C.sheet, .15 + i * .18));
    });
  }
  function sparkles(t) {
    for (let i = 0; i < 8; i++) {                                          // one glint per eighth note, left → right
      const t0 = T.tag + i * B / 2, a = t - t0; if (a < 0 || a > .5) continue;
      const x = 220 + i * 110, y = i % 2 ? 950 : 1350, k = Math.sin(Math.PI * a / .5);
      glow(x, y, 90 * k, '#FFF1CF', .9 * k); boilSeed('glint' + i); paint(starPts(x, y, 26 * k, .3, 4, .3), { wash: '#FFF6DC', ink: null });
    }
  }
  const MOOD = [[0, 'proud'], [T.land, 'happy', { lookX: .7, lookY: .3 }], [T.send + .1, 'hopeful', { lookX: .6, lookY: -.2 }],
    [T.home + .3, 'starstruck', { lookX: .5 }], [bb(51, 3.4), 'happy'], [T.tag + .8, 'hopeful', { lookX: -1, lookY: -.2 }], [bb(53, .1), 'happy']];
  function hero(t) {
    if (t < T.land - .3) return;
    const [sx, sy] = COMP.frontend.stand, k = seg(t, T.land - .3, T.land);
    const y = t < T.land ? sy - 1100 * (1 - easeIn(k)) : sy, sq = t < T.land ? -.18 : .24 * Math.exp(-(t - T.land) * 9) * Math.cos((t - T.land) * 26);
    const mood = emotions(t, MOOD), typing = t > bb(49, .6) && t < T.send;
    clawd(sx, y, U, { ...mood, view: 'q', sq: (mood.sq || 0) + sq, hat: 'hard',
      ...(typing ? { aL: .15 + .45 * pulse2(t, 9), aR: .1 + .45 * pulse2(t + B / 4, 9) } : {}), ...(t < T.land ? { aL: 1.3, aR: 1.1 } : {}) });
  }

  function actIII(t) {
    const cam = camAt(t);
    BC.world(t, cam, { hook: t => { wave(t); future(t); chat(t); run(t); sparkles(t); hero(t); } });
    if (t > T.iris) {                                                       // out: an iris closes on Clawd (over the labels too)
      flushLetters();
      const [sx, sy] = COMP.frontend.stand, at = BC.toScreenAt(cam, sx, sy - 4 * U), k = seg(t, T.iris, DUR - .25);
      iris(at[0], at[1], lerp(1500, 0, easeIn(k)), C.sheetDk);
    }
  }
  shots([[START, actIII]]);
})();
