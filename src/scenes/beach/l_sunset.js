// l_sunset.js: shots L–N of "Beach Day" (see STORYBOARD_beach.md), 112.135 → 153.
//   L  (112.1–124.1): the jam on the sand, facing the camera with the sea behind. Clawd plays alone, then Spike's shaker,
//                     Floatie drumming on the volleyball and Shades' tambourine join a bar apart; the light turns gold.
//   M  (124.1–130.1): the break: the music drops, the sun touches the sea, everyone stops and turns round to look; the
//                     camera pulls back to a wide from behind as the music returns and they sway.
//   N2 (130.1–138.1): the reverse angle, faces in the orange light: Clawd's slow strums, the others lean in.
//   N3 (138.1–146.1): wide from behind: gulls cross, the sun sinks, the last sliver goes with a flash on the lift, arms
//                     up, the first stars.
//   N4 (146.1–153):   dusk, faces again: Clawd yawns and nods off on Floatie's shoulder; an iris closes on the four.
(() => {
  const B = BCH, bt = B.bt, bar = B.bar;
  const T_L = bar(56), T_M = bar(62), T_N2 = bar(65), T_N3 = bar(69), T_N4 = bar(73);   // 112.135 124.135 130.135 138.135 146.135
  const GOLD = ['#E8AA38', '#F4C95D'];

  // colour keys through time: gold afternoon → orange, rose, violet → indigo dusk
  const colKf = (t, keys) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return mixCol(keys[i - 1][1], keys[i][1], ease(seg(t, keys[i - 1][0], keys[i][0])));
    return keys[keys.length - 1][1];
  };
  const SKY_TOP = [[112, '#9CCBE3'], [120, '#B9C6D2'], [124.1, '#D8A7A2'], [128, '#C27C96'], [138, '#8E5E9C'], [144, '#56488A'], [146.5, '#34376F']];
  const SKY_BOT = [[112, '#F8E2AE'], [120, '#F9D18E'], [124.1, '#F8B374'], [128, '#F59C60'], [138, '#F08058'], [144, '#D8706E'], [146.5, '#A45C7E']];
  const SEA_L = [[112, '#A8E2D8'], [122, '#F4D2A2'], [128, '#F6B48A'], [140, '#E58C78'], [146, '#8C5E8C']];
  const SEA_M = [[112, '#4FB5BA'], [122, '#6FA8B4'], [128, '#8B8FB0'], [140, '#6E5F9A'], [146, '#3A3A74']];
  const SEA_D = [[112, '#2B7F9A'], [122, '#3F6F92'], [128, '#4E5588'], [140, '#3E3C72'], [146, '#262A5A']];
  const SAND = [[112, '#F0D5A2'], [122, '#F0C996'], [128, '#E6AE8C'], [140, '#C58C8E'], [146, '#7A6490']];
  const dusk = t => kf(t, [[124, 0], [130, .25], [140, .5], [146, .75]]);   // how far things fall into silhouette

  // ---------- the west (looking out to sea): L, M, N3 ----------
  const HOR = 520, SHORE = 690, GND = 900, U = 24;
  const X = { spike: 370, clawd: 770, floatie: 1170, shades: 1610 };
  const BALL = [X.floatie + 7.6 * U, GND - 1.8 * U, 1.8 * U];
  function sunAt(t) {
    return { x: 1000, y: kf(t, [[112, 160], [118, 250], [124.135, 418], [126.135, 452], [132, 510], [138, 565], [142, 614], [144.0, 646], [144.135, 650], [144.26, 690]], x => x),
             r: kf(t, [[112, 62], [124, 105], [138, 140], [144, 150]]), core: colKf(t, [[112, '#FFF0B6'], [124, '#FFD27A'], [134, '#FFA860'], [144, '#F77A58']]),
             rim: colKf(t, [[112, '#F6C24C'], [124, '#F4A044'], [134, '#EE7A44'], [144, '#D9564E']]) };
  }
  function palmC(x, y, s, sway, key, lean, dk) {
    const C = B.C, trunk = mixCol(C.trunk, '#3A2A45', dk), leaf = mixCol(C.leaf, '#35304F', dk), leafDk = mixCol(C.leafDk, '#241F3A', dk);
    boilSeed('palm' + key);
    const top = [x + s * lean + sway * s * .04, y - s];
    const P = [[x, y], [x + s * lean * .2, y - s * .4], [x + s * lean * .65, y - s * .78], top];
    paint(ribbon(P, s * .085, s * .05), { wash: trunk, fill: mixCol(trunk, PAL.ink, .3), fillOp: 70, tex: .7, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 7; i++) {
      boilSeed('frond' + key + i);
      const a = -Math.PI / 2 + (i - 3) * .66 + sway * .14 * (1 + hash(i)) + .05 * Math.sin(T * 2.2 + i), L = s * (.46 + .12 * hash(i + 4));
      const dir = Math.cos(a) >= 0 ? 1 : -1, droop = (.12 + .45 * Math.abs(Math.cos(a))) * L;
      const Cv = through([top, [top[0] + Math.cos(a) * L * .5, top[1] + Math.sin(a) * L * .5 - L * .18], [top[0] + Math.cos(a) * L * .9 + dir * L * .05, top[1] + Math.sin(a) * L * .9 + droop]], 5);
      const n = Cv.length, Lf = [], Rt = [];
      for (let j = 0; j < n; j++) {
        const p = Cv[j], q = Cv[Math.min(n - 1, j + 1)], r = Cv[Math.max(0, j - 1)], dx = q[0] - r[0], dy = q[1] - r[1], d = Math.hypot(dx, dy) || 1;
        const k = j / (n - 1), w = s * .085 * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (j % 2 ? 1.3 : .75);
        Lf.push([p[0] - dy / d * w, p[1] + dx / d * w]); Rt.push([p[0] + dy / d * w * .8, p[1] - dx / d * w * .8]);
      }
      paint(Lf.concat(Rt.reverse()), { wash: i % 2 ? leaf : mixCol(leaf, leafDk, .45), fill: leafDk, fillOp: 50, tex: .5, ink: PAL.ink, sw: .7 });
    }
  }
  function shore(t, x0, x1, y, seaCol, foam, key) {
    const lap = Math.sin((bpOf(t) / 4) * TAU) * 16;
    boilSeed(key);
    const P = []; for (let i = 0; i <= 16; i++) { const x = lerp(x0, x1, i / 16); P.push([x, y + lap + 8 * Math.sin(i * 1.3 + t * .8)]); }
    paint(P.concat([[x1, y - 120], [x0, y - 120]]), { wash: seaCol, ink: null });
    inkLine(P, 2.2, foam, 'dry', .5);
    inkLine(P.map(([a, b]) => [a, b - 12]), .8, foam, 'inkfine', .5);
  }
  // Everything in the west world that isn't a character: sea, sun, glitter, sand, palms. Inside the camera.
  function west(t) {
    const S = sunAt(t), dk = dusk(t), sm = colKf(t, SEA_M), foam = mixCol(B.C.foam, '#F6C6A0', dk);
    // the sun (painted before the sea, so the sea swallows its lower part as it sets)
    glow(S.x, S.y, S.r * 3.2, mixCol('#FFD97A', '#FF8A50', seg(t, 120, 140)), 1);
    B.sun(S.x, S.y, S.r, t, null, { col: S.core, rim: S.rim, glow: 0, rays: t < 121, key: 'w', ink: null });
    boilSeed('sunline'); paint(ellPts(S.x, S.y, S.r, S.r, 36, 1.2), { ink: mixCol(PAL.ink, S.rim, .5), sw: .7 });
    B.sea(t, -1500, 3500, HOR, SHORE + 20, 'seaW', [colKf(t, SEA_L), sm, colKf(t, SEA_D)]);
    boilSeed('horizon'); inkLine([[-1500, HOR], [1000, HOR + 1], [3500, HOR]], .7, mixCol(PAL.ink, sm, .4), 'inkfine', 0);
    // the sun's path of light on the water
    const gl = seg(t, 116, 124);
    for (let i = 0; i < 14; i++) {
      boilSeed('glitter' + i);
      const k = i / 13, y = lerp(HOR + 8, SHORE - 10, k * k), w = lerp(.4, 2.2, k) * S.r * (.5 + .5 * hash(i + 2)), tw = .5 + .5 * Math.sin(t * 3 + i * 2.1);
      const x = S.x + (hash(i * 7) - .5) * lerp(.5, 2.4, k) * S.r;
      if (gl > .05) inkLine([[x - w / 2, y], [x + w / 2, y + jit(1)]], (1.2 + 2.2 * k) * tw * gl, mixCol(S.core, PAL.cream, .3), 'inkfine', 0);
    }
    if (t > 118) glow(S.x, HOR + 60, S.r * 2.2, '#FF9A58', .45 * seg(t, 118, 126) * (1 - seg(t, 143, 146)));
    shore(t, -1500, 3500, SHORE, sm, foam, 'shoreW');
    boilSeed('sandW');
    const sand = colKf(t, SAND);
    paint(rectPts(-1500, SHORE + 16, 5000, 1400), { wash: sand, ink: null });
    paint(rectPts(-1500, SHORE + 16, 5000, 90), { fill: mixCol(sand, '#8A6A5A', .3), fillOp: 90, bleed: .2, tex: .5, ink: null });
    for (let i = 0; i < 26; i++) {   // pebbles and shells, fixed
      boilSeed('peb' + i);
      const px = -600 + 3200 * hash(i + 3), py = SHORE + 60 + 500 * hash(i + 11);
      paint(ellPts(px, py, 5 + 7 * hash(i), 3 + 4 * hash(i + 1), 8), { wash: mixCol(sand, PAL.ink, .18), ink: null });
    }
    const sway = Math.sin(t * 1.3) * .8 + .3 * Math.sin(t * 3.1);
    B.parasol(215, 830, 150, 1, -.1, 'planted');
    palmC(60, 760, 600, sway, 'L', .28, dk * .9);
    palmC(1960, 740, 560, sway * .9, 'R', -.26, dk * .9);
  }
  const shadow = (x, u, key) => { boilSeed('shd' + key); paint(ellPts(x, GND + .1 * u, 5.8 * u, .9 * u, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); };
  // a sitting buddy: no legs, body on the sand. y is the ground.
  const sitO = (u) => ({ noLegs: true, noShadow: true });
  const warm = (o, t, name) => {   // the light: golden afternoon, then falling into sunset silhouette
    const c = tintCols(o), k = dusk(t) * (o.view === 'back' || o.view === 'qback' ? 1 : .4);
    return { ...o, col: mixCol(c.col, '#5E3A5E', k * .75), dk: mixCol(c.dk, '#3A2548', k * .75), lt: mixCol(c.lt, '#F6A07A', k * .6), tint: null };
  };

  // ---------- percussion props ----------
  function shaker(u, sw, shake) {   // an egg shaker in the hand (arm space)
    push(); rotate(-.5 + .25 * shake);
    paint(ellPts(.9 * u, -.2 * u, .95 * u, .7 * u, 16), { wash: B.C.ballB, ink: PAL.ink, sw: sw * .7 });
    inkLine([[.4 * u, -.7 * u], [.6 * u, .3 * u]], sw * .9, PAL.rose, 'ink', .3);
    inkLine([[1.2 * u, -.8 * u], [1.35 * u, .25 * u]], sw * .9, PAL.rose, 'ink', .3);
    if (shake > .3) for (const k of [-1, 1]) inkLine([[.9 * u + k * 1.4 * u, -1.1 * u], [.9 * u + k * 1.9 * u, -1.5 * u]], sw * .5, PAL.ink, 'inkfine', 0);
    pop();
  }
  function tambourine(u, sw, hit) {   // held up in the hand (arm space); jingles flare on the hit
    push(); translate(1.4 * u, 0); rotate(.3 * hit);
    paint(ellPts(0, 0, 1.6 * u, 1.6 * u, 22), { wash: '#C98B4A', ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(0, 0, 1.2 * u, 1.2 * u, 20), { wash: PAL.cream, fill: '#EBCB7E', fillOp: 60, ink: PAL.ink, sw: sw * .5 });
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3; paint(ellPts(Math.cos(a) * 1.4 * u, Math.sin(a) * 1.4 * u, .38 * u, .22 * u, 8, 0, a), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .4 }); }
    if (hit > .2) for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .9, r0 = 2 * u, r1 = (2.3 + 1.2 * hit) * u; inkLine([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], sw * .6, PAL.ink, 'inkfine', 0); }
    pop();
  }
  // Clawd's uke seen from behind: only the neck and head poke out past the right edge (body space, back view)
  function ukeFromBehind(u, sw) {
    push(); translate(4.7 * u, -3.9 * u); rotate(-.22);
    paint([[0, -.27 * u], [2.4 * u, -.27 * u], [2.4 * u, .25 * u], [0, .3 * u]], { wash: B.C.ukeDk, ink: PAL.ink, sw: sw * .7 });
    paint([[2.3 * u, -.36 * u], [3.5 * u, -.55 * u], [3.6 * u, .52 * u], [2.3 * u, .36 * u]], { wash: '#5E3A2A', ink: PAL.ink, sw: sw * .7 });
    pop();
  }

  // ---------- the band, in the west world ----------
  const JOIN = { clawd: T_L - 4, spike: bar(57), floatie: bar(58), shades: bar(59) };   // each joins on a bar line
  const STOP = T_M;                                                                      // the break: everyone stops
  const TURN = { clawd: 124.85, floatie: 125.02, spike: 125.18, shades: 125.34 };      // the turn to the sea, staggered
  const SWAY = (t, ph) => .055 * Math.sin((bpOf(t) / 8 + ph) * TAU) * seg(t, T_M + 1.8, T_M + 3);
  function band(t) {
    const playing = n => t >= JOIN[n] && t < STOP, heard = t < STOP;
    const bp = bpOf(t), sPh = n => B.CAST[n].ph;
    // everyone's mood: listening, the joining take, singing; then the break: surprised, then love for the view
    const mood = n => {
      const keys = [[0, 'happy']];
      if (n !== 'clawd') keys.push([JOIN[n] - .05, 'excited'], [JOIN[n] + .9, 'happy']);
      keys.push([STOP + .25 + .08 * Object.keys(TURN).indexOf(n), 'surprised'], [TURN[n] + .6, 'love', { emote: null }]);
      const m = emotions(t, keys, { take: .8 });
      if (playing(n) && t > JOIN[n] + .9) m.mouth = B.sing(t, sPh(n) * 2);
      if (n === 'shades') m.eyes = 'shades';
      return m;
    };
    const turned = n => turn(t, TURN[n], TURN[n] + .26, 0, .5);
    const isBack = n => t >= TURN[n];
    const rotOf = n => SWAY(t, sPh(n));
    const leanIn = n => (t > 125.6 ? 1 : 0);

    // Spike: shaker on the eighths once in
    {
      const n = 'spike', x = X[n], m = mood(n), on = playing(n);
      const sh = on ? .5 + .5 * Math.cos(bp * TAU * 2) : 0;
      shadow(x, U, n);
      const o = { ...m, ...sitO(U), aR: on ? .75 + .35 * sh : .5 + .1 * Math.sin(bp * Math.PI), aL: on ? .25 + .25 * Math.abs(Math.sin(bp * Math.PI)) : .2,
                  armR: (u, sw) => shaker(u, sw, sh), rot: (m.rot || 0) * .5 + rotOf(n) };
      if (isBack(n)) Object.assign(o, turned(n), { aL: -.5, aR: -.2 });
      B.buddy(n, x, GND + 2 * U, U, warm(o, t, n));
    }
    // Clawd: the uke. Solo from the start, stops dead on the break, turns round with it.
    {
      const n = 'clawd', x = X[n], m = mood(n);
      shadow(x, U, n);
      if (!isBack(n)) {
        const strum = t < STOP ? B.strumBeat(t) : lerp(-2.02, -2.4, ease(seg(t, STOP + .2, STOP + .7)));
        const ring = t < STOP ? B.ringBeat(t) : Math.exp(-(t - STOP) * 3);
        if (t < STOP) m.mouth = B.sing(t);
        B.player(n, x, GND + 2 * U, U, warm({ ...m, rot: (m.rot || 0) * .4 }, t, n), { strum, ring, extra: sitO(U) });
      } else {
        const o = { ...m, ...sitO(U), ...turned(n), aL: .05, aR: -.9 - .25 * (t > T_M + 2 ? Math.exp(-frac(bpOf(t) / 4) * 3) : 0), rot: rotOf(n),
                    draw: (u, sw) => { if (t > TURN[n] + .26) ukeFromBehind(u, sw); } };
        B.buddy(n, x, GND + 2 * U, U, warm(o, t, n));
      }
    }
    // Floatie: drums on the volleyball beside it, one hand on each beat, the other on the off-beats
    {
      const n = 'floatie', x = X[n], m = mood(n), on = playing(n);
      const f = frac(bp), hitR = on ? Math.exp(-f * 7) : 0, hitL = on ? Math.exp(-frac(bp + .5) * 7) : 0;
      const bsq = .18 * hitR, [bx, by, br] = BALL;
      boilSeed('ballsh'); paint(ellPts(bx, GND + 2, br * 1.1, br * .3, 14), { fill: PAL.ink, fillOp: 70, bleed: .2, ink: null });
      push(); translate(bx, by + br); scale(1 + bsq * .6, 1 - bsq); translate(-bx, -(by + br));
      B.vball(bx, by, br, .3 + .1 * Math.floor(bp), 'drum'); pop();
      shadow(x, U, n);
      const o = { ...m, ...sitO(U), aR: on ? lerp(.55, -.05, hitR) : .3, aL: on ? lerp(.1, -.45, hitL) : .2, rot: rotOf(n) };
      if (isBack(n)) Object.assign(o, turned(n), { aL: -.4, aR: -.4, draw: (u, sw) => { if (o.view === 'back') B.floatRing(u, sw, 'back'); } });
      B.buddy(n, x, GND + 2 * U, U, warm(o, t, n));
    }
    // Shades: tambourine up high, hit on beats 2 and 4
    {
      const n = 'shades', x = X[n], m = mood(n), on = playing(n);
      const bb = bp - 1, hit = on ? Math.exp(-frac(bb / 2) * 2 * 6) : 0;
      shadow(x, U, n);
      const o = { ...m, ...sitO(U), aR: on ? 1.05 + .25 * hit : .3, aL: on ? .4 + .5 * hit : .2, armR: on || t < JOIN[n] ? (u, sw) => tambourine(u, sw, hit) : null, rot: rotOf(n) };
      if (t < JOIN[n]) { o.aR = .2; }
      if (t >= STOP) { o.armR = (u, sw) => tambourine(u, sw, 0); o.aR = lerp(1.05, -.3, ease(seg(t, STOP + .2, STOP + .7))); }
      if (isBack(n)) Object.assign(o, turned(n), { aL: -.5, aR: -.35, armR: null });
      B.buddy(n, x, GND + 2 * U, U, warm(o, t, n));
    }
    // notes on the sea breeze, blowing left, from whoever is playing
    if (heard) B.noteStream(t, Math.floor(bpOf(T_L)) - 2, Math.floor(bpOf(STOP)), 2.2, (nb, age) => {
      const who = ['clawd', 'spike', 'floatie', 'shades'][((nb % 4) + 4) % 4];
      if (bt(nb) < JOIN[who] || bt(nb) >= STOP) return null;
      const x0 = X[who] + 2 * U, y0 = GND - 7 * U;
      return [x0 - age * 150 - 40 * Math.sin(age * 3 + nb), y0 - age * 170, 21, seg(age, 0, .25) * (1 - seg(age, 1.7, 2.2)), -.2 + .3 * Math.sin(age * 4 + nb)];
    }, 'band');
  }

  // ---------- L: the jam ----------
  function shotL(t, lt, dur) {
    B.skyGrad(colKf(t, SKY_TOP), colKf(t, SKY_BOT), 'skyL', 9, -60, 560);
    const [cx, cy, z] = kf(t, [[112.135, [X.clawd, 705, 1.95]], [113.4, [X.clawd, 705, 1.9]], [113.95, [575, 715, 1.55]], [115.4, [585, 715, 1.52]],
                               [115.95, [1010, 715, 1.45]], [117.4, [1030, 715, 1.42]], [118.0, [985, 640, 1.14]], [124.135, [985, 612, 1.08]]]);
    camBegin(cx + 8 * Math.sin(t * .6), cy, z);
    west(t);
    band(t);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, GOLD);
  }

  // ---------- M: the break, the turn, the pull back ----------
  function shotM(t, lt, dur) {
    B.skyGrad(colKf(t, SKY_TOP), colKf(t, SKY_BOT), 'skyL', 9, -60, 560);
    const k = ease(seg(t, 125.7, 128.6));
    camBegin(lerp(985, 995, k) + 6 * Math.sin(t * .5), lerp(612, 605, k), lerp(1.08, .92, k));
    west(t);
    const S = sunAt(t), touch = seg(t, T_M, T_M + .6);
    if (touch > 0 && touch < 1) B.sparkle(S.x, HOR, 60, touch);
    band(t);
    camEnd();
    if (lt > dur - .25) B.whip(seg(lt, dur - .25, dur), 'h', ['#FFE2C0', '#E79A7A']);
  }

  // ---------- the east (the reverse angle, faces lit by the sunset): N2, N4 ----------
  const GE = 990, UE = 30, XE = { shades: 360, floatie: 760, clawd: 1150, spike: 1540 };
  function east(t, night) {
    boilSeed('dunes');
    const d1 = mixCol('#E7B79A', '#4A4478', night), d2 = mixCol('#D9A08C', '#3B3868', night), sand = mixCol('#F0BE96', '#6A5C8C', night);
    paint(ellPts(300, 900, 900, 230, 30, 3), { wash: d1, fill: mixCol(d1, PAL.indigo, .3), fillOp: 60, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    paint(ellPts(1600, 920, 900, 260, 30, 3), { wash: d2, fill: mixCol(d2, PAL.indigo, .3), fillOp: 60, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    const sway = Math.sin(t * 1.3) * .8;
    palmC(140, 850, 520, sway, 'E1', .3, .3 + .6 * night);
    palmC(1830, 870, 470, sway * .9, 'E2', -.22, .3 + .6 * night);
    for (let i = 0; i < 16; i++) {   // dune grass stirring in the breeze
      boilSeed('dg' + i);
      const x = 60 + i * 120 + 50 * hash(i + 2), y = 760 + 90 * hash(i + 5) + (i > 7 ? 30 : 0), s = 6 * Math.sin(t * 1.6 + i);
      for (const k of [-1, 0, 1]) inkLine([[x + k * 6, y], [x + k * 10 + s, y - 26 - 10 * hash(i + k + 3)]], .7, mixCol('#7C8F58', '#3A3A5A', night), 'inkfine', .4);
    }
    boilSeed('sandE');
    paint(rectPts(-200, 880, W + 400, 500), { wash: sand, ink: null });
    paint(rectPts(-200, 880, W + 400, 70), { fill: mixCol(sand, '#8A5A6A', .3), fillOp: 90, bleed: .2, tex: .5, ink: null });
  }
  const shadowE = (x, u, key) => { boilSeed('shdE' + key); paint(ellPts(x, GE + .1 * u, 5.8 * u, .9 * u, 20), { fill: PAL.ink, fillOp: 80, bleed: .25, tex: .3, border: .1, ink: null }); };
  const glowCol = (o, k) => { const c = tintCols(o); return { ...o, col: mixCol(c.col, '#F08A5A', .3 * k), lt: mixCol(c.lt, '#FFD0A0', .5 * k), tint: null }; };
  const nightCol = (o, k) => { const c = tintCols(o); return { ...o, col: mixCol(c.col, '#7A5A8E', .35 * k), dk: mixCol(c.dk, '#3E2E5A', .35 * k), lt: mixCol(c.lt, '#B8A0C8', .4 * k), tint: null }; };

  // ---------- N2: faces in the orange light ----------
  function shotN2(t, lt, dur) {
    B.skyGrad(colKf(t, [[130, '#8A70AE'], [138, '#6E5A9C']]), colKf(t, [[130, '#F4B093'], [138, '#E8948A']]), 'skyE', 8, -60, 900);
    camBegin(960 + 20 * Math.sin(lt * .4), 700 - 8 * lt, 1.02 + .012 * lt);
    east(t, 0);
    const bp = bpOf(t), sway = n => .05 * Math.sin((bp / 8 + B.CAST[n].ph) * TAU);
    // the lean toward Clawd (134.1–136), then they look at the sun together
    const lean = ease(seg(t, bar(67) - .1, bar(67) + .8));
    const shared = n => ({ ...sitO(UE), rot: sway(n) });
    shadowE(XE.shades, UE, 's'); shadowE(XE.floatie, UE, 'f'); shadowE(XE.spike, UE, 'p'); shadowE(XE.clawd, UE, 'c');
    const mk = (n, keys) => { const m = emotions(t, keys, { take: .6 }); if (n === 'shades') m.eyes = 'shades'; return m; };
    {
      const m = mk('shades', [[0, 'relieved', { emote: null }], [bar(68), 'cool', { emote: null }]]);
      B.buddy('shades', XE.shades, GE + 2 * UE, UE, glowCol({ ...m, ...shared('shades'), aL: -.6, aR: -.5, rot: sway('shades') - .06 * lean }, 1));
    }
    {
      const m = mk('floatie', [[0, 'relieved', { emote: null }], [bar(67) + .2, 'love', { emote: null }]]);
      B.buddy('floatie', XE.floatie, GE + 2 * UE, UE, glowCol({ ...m, ...shared('floatie'), aL: -.6, aR: -.6, rot: sway('floatie') * (1 - lean) + .11 * lean, dx: .5 * lean, lookX: .6 * lean }, 1));
    }
    {
      const m = mk('spike', [[0, 'relieved', { emote: null }], [bar(67) + .45, 'happy']]);
      B.buddy('spike', XE.spike, GE + 2 * UE, UE, glowCol({ ...m, ...shared('spike'), aL: -.5, aR: -.7, rot: sway('spike') * (1 - lean) - .1 * lean, dx: -.5 * lean, lookX: -.6 * lean }, 1));
    }
    {
      // Clawd: one slow soft strum per bar from 132.1, eyes closed, a single note drifting up from each
      const m = mk('clawd', [[0, 'relieved', { emote: null }], [bar(66) - .3, 'happy'], [bar(68), 'love', { emote: null }]]);
      const f = t - bar(Math.floor((t - OFF) / 2)), soft = t >= bar(66) ? f : 5;
      const strum = soft < 1.6 ? lerp(-2.05, -2.5, ease(soft / 1.6)) : -2.5;
      const pre = t >= bar(66) - .5 ? ease(seg(frac((t - OFF) / 2 + .25), .75, 1)) : 0;   // lift before each strum
      B.player('clawd', XE.clawd, GE + 2 * UE, UE, glowCol({ ...m, rot: sway('clawd') }, 1),
               { strum: strum + .45 * pre, ring: t >= bar(66) ? Math.exp(-soft * 1.5) : 0, extra: sitO(UE) });
      for (const b of [66, 67, 68]) {
        const age = t - bar(b); if (age < 0 || age > 3.5) continue;
        boilSeed('softnote' + b);
        B.note(XE.clawd + 90 - age * 30, GE - 7 * UE - age * 110, 20, seg(age, 0, .3) * (1 - seg(age, 3, 3.5)), -.2 + .2 * Math.sin(age * 2), ['#C4506E', '#7B5CA8', '#C4506E'][b - 66]);
      }
    }
    // warm light on everyone from the sun behind the camera
    glow(960, 780, 900, '#FF9A58', .18);
    camEnd();
    if (lt < .3) B.whip(1 - seg(lt, 0, .3), 'h', ['#FFE2C0', '#E79A7A']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#C4506E', '#E79A7A']);
  }

  // ---------- N3: the sun goes down ----------
  const LIFT = bar(72);   // 144.135: the last sliver goes, with the music's lift
  const STARS = []; for (let i = 0; i < 26; i++) STARS.push([60 + 1800 * hash(i * 4.1 + 7), 30 + 400 * hash(i * 2.7 + 3) ** 1.3, 5 + 9 * hash(i + 31), hash(i + 51)]);
  function stars(t, t0, key, k0 = 1) {
    for (let i = 0; i < STARS.length; i++) {
      const [x, y, r, h] = STARS[i], a = seg(t, t0 + h * 1.6, t0 + h * 1.6 + .35) * k0; if (a <= 0) continue;
      const tw = .75 + .25 * Math.sin(t * (2 + 3 * h) + i);
      glow(x, y, r * 5 * tw, '#FFE6B0', .55 * a);
      boilSeed('star' + key + i); paint(starPts(x, y, r * backOut(a) * tw, .4, 4), { wash: PAL.cream, ink: null });
    }
  }
  function shotN3(t, lt, dur) {
    B.skyGrad(colKf(t, SKY_TOP), colKf(t, SKY_BOT), 'skyL', 9, -60, 560);
    const zk = ease(seg(t, T_N3, LIFT));
    camBegin(1000 + 10 * Math.sin(t * .4), lerp(610, 700, zk), lerp(.88, 1.14, zk));
    west(t);
    // gulls cross in front of the sun (140.1–142.5)
    for (const [i, t0, y, s] of [[0, bar(70), 330, 36], [1, bar(70) + .45, 370, 26]]) {
      const k = seg(t, t0, t0 + 2.6); if (k <= 0 || k >= 1) continue;
      B.gull(lerp(-150, 2100, k), y - 40 * Math.sin(k * Math.PI), s, t * 1.8 + i * .3, 'g' + i, mixCol('#3A2A48', '#5A3A58', i));
    }
    // the flash as the last sliver goes
    const fl = t > LIFT ? Math.exp(-(t - LIFT) * 3.5) : 0;
    if (fl > .02) { glow(1000, HOR, 380 * (1 + (1 - fl)), '#FFC890', fl); B.sparkle(1000, HOR - 10, 150, seg(t, LIFT, LIFT + .8)); }
    // the four from behind, swaying; lean forward as the sun goes (anticipation), arms flung up on the lift
    const bp = bpOf(t), order = ['spike', 'clawd', 'floatie', 'shades'];
    order.forEach((n, i) => {
      const x = X[n], ph = B.CAST[n].ph, dly = i * .06, up = backOut(seg(t, LIFT + dly, LIFT + dly + .2)) * (1 - ease(seg(t, LIFT + 1.35 + dly * 2, LIFT + 1.95 + dly * 2)));
      const lean = ease(seg(t, LIFT - 2, LIFT - .2)) * (1 - seg(t, LIFT, LIFT + .1));
      const tk = jump(t, LIFT + .02 + dly, LIFT + .55 + dly, 3.2);
      shadow(x, U, n);
      const o = { ...sitO(U), view: 'back', rot: SWAY(t, ph) * (1 - lean), sq: .06 * lean + tk.sq, dy: tk.dy, sy: 1,
                  aL: lerp(-.5, .75 + .2 * Math.sin(t * 9 + i), up), aR: lerp(n === 'clawd' ? -.9 - .25 * Math.exp(-frac(bpOf(t) / 4) * 3) : -.45, .75 + .2 * Math.sin(t * 8 + i + 1), up) };
      if (n === 'clawd') o.draw = (u, sw) => { if (up < .3) ukeFromBehind(u, sw); };
      if (n === 'floatie') o.draw = (u, sw) => B.floatRing(u, sw, 'back');
      B.buddy(n, x, GND + 2 * U, U, warm(o, t, n));
    });
    camEnd();
    if (fl > .02) flash(.45 * fl * fl, '#FFE7C8');
    stars(t, LIFT + .3, 'n3');
    if (lt < .3) brushWipe(.5 + lt / .6, ['#C4506E', '#E79A7A']);
    if (lt > dur - .25) B.whip(seg(lt, dur - .25, dur), 'h', ['#B8A0C8', '#34376F']);
  }

  // ---------- N4: dusk; Clawd nods off; iris ----------
  function shotN4(t, lt, dur) {
    B.skyGrad(colKf(t, [[146, '#262C62'], [153, '#1F2550']]), colKf(t, [[146, '#6A558E'], [153, '#4E4588']]), 'skyN', 8, -60, 900);
    stars(t, T_N4 - 3, 'n4');
    // a thin crescent moon rising in the east
    boilSeed('moon'); glow(1540, 190, 150, '#FFF0C8', .5);
    paint(ellPts(1540, 190, 46, 46, 28), { wash: '#FFF1CF', ink: PAL.ink, sw: .6 });
    paint(ellPts(1562, 180, 42, 44, 28), { wash: '#262C62', ink: null });
    camBegin(955, 740 + 6 * Math.sin(lt * .5), 1.06 + .01 * lt);
    east(t, 1);
    const bp = bpOf(t);
    const T_YAWN = 147.85, T_NOD = 149.0, T_LOOK = 150.1;
    const nod = ease(seg(t, T_NOD, T_NOD + .9)), drift = .03 * Math.sin((bp / 8) * TAU);
    shadowE(XE.shades, UE, 's'); shadowE(XE.floatie, UE, 'f'); shadowE(XE.spike, UE, 'p'); shadowE(XE.clawd, UE, 'c');
    {
      const m = emotions(t, [[0, 'relieved', { emote: null }]]); m.eyes = 'shades';
      B.buddy('shades', XE.shades, GE + 2 * UE, UE, nightCol({ ...m, ...sitO(UE), aL: -.6, aR: -.5, rot: .05 + drift, seed: 3.7 }, 1));
    }
    {
      const m = emotions(t, [[0, 'relieved', { emote: null }], [T_LOOK, 'love', { emote: null, eyes: 'happy', lookX: .8 }]], { take: .4 });
      B.buddy('floatie', XE.floatie, GE + 2 * UE, UE, nightCol({ ...m, ...sitO(UE), aL: -.6, aR: -.6, rot: .06 + drift * .5 + .03 * nod, dx: .3 * nod }, 1));
    }
    {
      const m = emotions(t, [[0, 'relieved', { emote: null }]]);
      B.buddy('spike', XE.spike, GE + 2 * UE, UE, nightCol({ ...m, ...sitO(UE), aL: -.5, aR: -.7, rot: -.07 + drift }, 1));
    }
    {
      // Clawd: content, the yawn, then the head droops onto Floatie's shoulder (zzz); the uke rests
      const m = emotions(t, [[0, 'relieved', { emote: null }], [T_YAWN, 'sleepy', { emote: null, mouth: 'yawn', eyes: 'closed' }], [T_NOD - .1, 'sleepy', { eyes: 'closed' }]], { take: .5 });
      if (t > T_NOD - .1) { m.rot = 0; m.sq = (m.sq || 0) * .4; }
      const yawnStretch = Math.sin(Math.PI * seg(t, T_YAWN, T_YAWN + 1)) * .12;
      B.player('clawd', XE.clawd, GE + 2 * UE, UE, nightCol({ ...m, sq: (m.sq || 0) - yawnStretch }, 1),
               { strum: -2.45, ring: 0, rot: -.2 * nod + drift * (1 - nod), extra: { ...sitO(UE), dx: -1.2 * nod, emoteK: m.emote ? m.emoteK : 0 } });
    }
    const at = toScreen(lerp(XE.floatie, XE.clawd, .55), GE - 6.2 * UE);
    camEnd();
    if (lt < .3) B.whip(1 - seg(lt, 0, .3), 'h', ['#B8A0C8', '#34376F']);
    // the iris closes on the four, holds on Clawd and Floatie, and shuts
    const T_IRIS = 150.8;
    if (t > T_IRIS) {
      const r = kf(t, [[T_IRIS, 1500], [151.7, 340], [152.25, 310], [152.6, 0]], ease);
      iris(at[0], at[1], r, PAL.ink);
    }
  }

  shots([[T_L, shotL], [T_M, shotM], [T_N2, shotN2], [T_N3, shotN3], [T_N4, shotN4]]);
})();
