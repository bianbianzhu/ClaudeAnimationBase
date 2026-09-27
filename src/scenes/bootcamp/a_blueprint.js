// bootcamp/a_blueprint.js: Act I (0 → bar 14, 22.36 s), "what a real AI system needs". See STORYBOARD_bootcamp.md.
//   bars 0–1   the sheet fades up from ink; an empty chat window sketches itself on the xylophone; Clawd pops up from
//              below, types, and sends: the message floats up as a bubble.
//   bar  2     the bubble rolls up into the packet (one request, a small warm light); then `Frontend` is written.
//   bars 3–11  one stop per bar: the packet ticks along a pencil wire (eighth notes, from beat 2.6), lands on the
//              downbeat, the next component sketches itself around it and its label writes on. Clawd hops with it,
//              always left → right, landing on the component's top edge on the same downbeat.
//              API Gateway · Backend · Agent Loop · Memory · Context · AI Gateway · MCP Tools · Tracing · Evals.
//   bars 12–13 the camera pulls out to the whole sheet while the platform (`Cloud · VPC`), the ring (`Guardrails`) and
//              the desk (`Claude Code`) sketch in. Hold on the empty map; Clawd's overwhelmed take; an idea: it turns
//              toward the desk (Act II starts there).
(() => {
  const { B, bb, C, COMP, U } = BC;
  const { STOP, DEP, REST, WIRE, arrive, depart } = BC;


  // ---------- camera ----------
  let CAMK = null;                                             // built on first use (the shape helpers need p5)
  const camKeys = () => {
    const K = [[0, [400, 1180, 1.45]], [bb(1, 0), [400, 1180, 1.45]], [bb(2, 0), BC.viewOf('frontend')]];
    for (let k = 2; k <= 11; k++) {
      const v = BC.viewOf(STOP[k]);
      K.push([bb(k, .3), v], [depart(k), [v[0] + 25, v[1], v[2] * 1.015]]);        // hold with a slow drift and push
    }
    const ev = BC.viewOf('evals'), M = BC.MAP_VIEW, [ex, ey] = COMP.evals.stand;
    K.push([bb(12, 0), [ev[0] + 30, ev[1], ev[2] * 1.02]]);
    K.push([bb(12, 3.2), M], [bb(13, 1), [M[0] - 30, M[1], M[2] * 1.02]]);                    // hold on the empty map
    K.push([bb(13, 1.9), [ex - 260, ey - 150, .62]], [bb(14, 0), [ex - 300, ey - 150, .64]]);  // push in on Clawd for the take
    return K;
  };
  // zoom interpolates geometrically, so a pull-out doesn't lurch at the end
  function camAt(t) {
    const K = CAMK || (CAMK = camKeys()); if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t < K[i][0]) {
      const [ta, a] = K[i - 1], [tb, b] = K[i], k = ease((t - ta) / (tb - ta));
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), k))];
    }
    return K[K.length - 1][1];
  }

  // ---------- the packet ----------
  function packetAt(t) {
    if (t < bb(2, 0)) return null;
    for (let k = 2; k <= 11; k++) {
      if (k < 11 && t >= depart(k) && t < arrive(k + 1)) return BC.along(WIRE[k], BC.tickAlong(t, depart(k), arrive(k + 1)));
      if (t >= arrive(k) && t < (k < 11 ? depart(k) : Infinity)) {
        if (k === 5) {                                                          // one lap round the Agent Loop
          const q = BC.tickAlong(t, bb(5, .25), bb(5, 2.25)), a = Math.PI + q * TAU;
          return [BC.LOOP.cx + Math.cos(a) * BC.LOOP.r, BC.LOOP.cy + Math.sin(a) * BC.LOOP.r];
        }
        return REST[k];
      }
    }
    return REST[2];
  }

  // ---------- Clawd ----------
  const standOf = k => (k <= 2 ? COMP.frontend.stand : k >= 11 ? COMP.evals.stand : COMP[STOP[k]].stand);
  function clawdPos(t) {
    if (t < bb(1, 1)) {                                                       // pops up from below the frame
      const k = seg(t, bb(1, 0) - .1, bb(1, 1));
      return { x: 80, y: lerp(1760, 1400, easeOut(k)), air: false, sq: jump(t, bb(1, 0) - .1, bb(1, 1), 0).sq };
    }
    for (let k = 2; k <= 10; k++) {
      const t0 = bb(k, DEP), t1 = arrive(k + 1);
      if (t >= t0 && t < t1) {
        const a = standOf(k), b = standOf(k + 1), h = 150 + .12 * Math.hypot(b[0] - a[0], b[1] - a[1]);
        const [x, y] = arcPt(a, b, h, ease(seg(t, t0, t1)) * .15 + seg(t, t0, t1) * .85);
        return { x, y, air: true, sq: jump(t, t0, t1, 0).sq };
      }
    }
    let k = 2; while (k < 11 && t >= arrive(k + 1)) k++;
    const s = standOf(k), prevLand = k > 2 ? arrive(k) : bb(1, 1);
    return { x: s[0], y: s[1], air: false, sq: jump(t, prevLand - .3, prevLand, 0).sq };
  }
  const MOOD = [[0, 'neutral'], [bb(1, 1.6), 'happy', { lookX: .7, lookY: .35 }], [bb(2, .1), 'hopeful', { lookX: .5, lookY: -.1 }],
    [arrive(3), 'hopeful', { lookY: .5 }], [arrive(4), 'surprised', { lookX: .6 }], [arrive(5), 'thinking', { lookX: -.2, lookY: .6 }],
    [arrive(6), 'hopeful', { lookY: .6 }], [arrive(7), 'thinking', { lookY: .6 }], [arrive(8), 'excited'], [arrive(9), 'surprised', { lookY: .5 }],
    [arrive(10), 'thinking', { lookX: -.6, lookY: .6 }], [arrive(11), 'nervous'], [bb(13, 1.4), 'scared', { lookY: -.4 }],
    [bb(13, 3), 'idea', { lookX: -.8 }]];
  function drawClawd(t) {
    if (t < bb(1, 0) - .1) return;
    const p = clawdPos(t), mood = emotions(t, MOOD);
    let pose = { view: p.air ? 'side' : 'q', flip: false };
    if (t > bb(13, 3.1)) pose = turn(t, bb(13, 3.1), bb(13, 3.1) + .22, .25, -.25);      // toward the desk
    const typing = t > bb(1, 1.2) && t < bb(1, 3) ? 1 : 0;
    clawd(p.x, p.y, U, { ...mood, ...pose, sq: (mood.sq || 0) + p.sq,
      ...(typing ? { aL: .15 + .45 * pulse2(t, 9), aR: .1 + .45 * pulse2(t + B / 4, 9) } : {}),
      ...(p.air ? { aL: .9, aR: .6 } : {}) });
  }

  // ---------- the chat window's own story (bars 0–2) ----------
  function chatStory(t) {
    // typing: a pencil squiggle grows in the input bar
    const ty = seg(t, bb(1, 1.2), bb(1, 2.9));
    if (ty > 0 && t < bb(1, 3)) {
      const P = []; for (let x = 250; x <= 250 + 320 * ty; x += 12) P.push([x, 1294 + 7 * Math.sin(x * .09)]);
      boilSeed('typing'); if (P.length > 1) BC.pencilPath(P, 1, .8, C.chalk);
    }
    // send: the bubble sketches in, then rolls up into the packet
    const bs = seg(t, bb(1, 3), bb(2, 0)), shrink = ease(seg(t, bb(2, .1), bb(2, .8)));
    if (bs > 0 && shrink < 1) {
      const s = 1 - shrink, cx = 550, cy = 1120, sc = P => P.map(([x, y]) => [cx + (x - cx) * s, cy + (y - cy) * s]);
      boilSeed('bubble');
      BC.pencilPath(sc(BC.RR(440, 1080, 220, 80, 26)), easeOut(bs), .8, C.chalk);
      for (let i = 0; i < 2; i++) BC.pencilPath(sc([[465, 1106 + i * 28], [465 + (i ? 110 : 165), 1106 + i * 28]]), seg(bs, .4 + i * .2, .8 + i * .2), .8, C.chalk);
    }
    return shrink;
  }

  function actI(t) {
    const cam = camAt(t);
    BC.world(t, cam, {
      gateLift: t => seg(t, bb(3, 1.4), bb(3, 2.1)) * (1 - seg(t, bb(3, 3.3), bb(3, 3.9))),
      hook: t => {
        const shrink = chatStory(t), pk = packetAt(t);
        if (pk) BC.packet(pk[0], pk[1], t, t < bb(2, .8) ? ease(shrink) : 1);
        drawClawd(t);
      },
    });
    if (t < .7) flash(1 - ease(t / .7), '#0D1224');                            // transition in: fade up from ink
  }

  BC.actI = actI; BC.camI = camAt;
  shots([[0, actI]]);
})();
