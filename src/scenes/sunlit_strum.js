// sunlit_strum.js: "Sunlit Strum", cut to the song (123 BPM, first downbeat 0.12 s). See STORYBOARD.md.
//   Shot A (0–5.97):    grey morning on a hilltop, the sun asleep behind a cloud. One strum sends a note up that bonks
//                       the cloud; light cracks out. Clawd plays and sings, the notes nudge the cloud aside. Push in.
//   Shot B (5.97–9.88): close-up, Clawd sings eyes shut; the sun breaks out and lights Clawd up; eyes open, starstruck,
//                       the big note. Golden brush wipe.
//   Shot C (9.88–end):  the same hill, now sunny. The sun bops, flowers pop open on the beat, a finale jump, a proud
//                       hold, the sun winks back, and a sunburst iris closes.
(() => {
  const bt = n => OFF + n * BEAT;                       // time of beat n
  const T_AB = bt(12), T_BC = bt(20);                   // 5.97, 9.88: cuts on bar lines
  const GOLD = ['#E8AA38', '#F4C95D'];                  // wipe colours: sunshine

  // how sunny the world is, 0 (grey) .. 1 (full sun), across the whole video: the colour arc
  const sunK = t => kf(t, [[0, 0], [3.0, 0], [3.3, .14], [4.1, .2], [5.97, .42], [7.9, .55], [8.3, 1]]);
  const C = (dull, bright, t) => mixCol(dull, bright, sunK(t));

  // ---------- set pieces ----------
  function sky(t) {
    boilSeed('sky');
    paint(rectPts(-500, -400, W + 1000, H + 800), { wash: C('#A7B1C4', '#93CCEA', t), ink: null });   // oversized: the camera moves
    paint(ellPts(W * .5, H * .8, W * .85, H * .38, 28, 10), { fill: PAL.cream, fillOp: 60 + 60 * sunK(t), bleed: .3, tex: .5, ink: null });
  }
  function farHills(t, dy = 0) {
    boilSeed('far');
    const a = C('#98A5B4', '#86C1B0', t), b = C('#A2AEBC', '#A3D0B2', t);
    paint(ellPts(1560, 1010 + dy, 950, 280, 36, 3), { wash: a, fill: mixCol(a, PAL.indigo, .2), fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
    paint(ellPts(120, 990 + dy, 720, 220, 32, 3), { wash: b, fill: mixCol(b, PAL.indigo, .2), fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .6 });
  }

  // The main hill. Clawd stands on its crest at x = 820 in shots A and C.
  const HILL = [820, 1250, 1250, 470];
  const hillY = x => HILL[1] - HILL[3] * Math.sqrt(Math.max(0, 1 - ((x - HILL[0]) / HILL[2]) ** 2));
  function hill(t) {
    boilSeed('hill');
    const col = C('#7E977D', '#76B159', t);
    paint(ellPts(...HILL, 48, 2), { wash: col, fill: mixCol(col, PAL.ink, .25), fillOp: 70, bleed: .08, tex: .6, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 22; i++) {   // grass tufts along the crest, swaying
      boilSeed('tuft' + i);
      const x = -120 + i * 100 + 40 * hash(i + 40), y = hillY(x) + 6 + 30 * hash(i + 60), s = wob(t, .5, hash(i) * 3) * 5;
      for (const k of [-1, 0, 1]) inkLine([[x + k * 7, y], [x + k * 11 + s, y - 20 - 8 * hash(i + k)]], .7, mixCol(col, PAL.cream, .35), 'inkfine', .4);
    }
  }

  // Flowers down the hill face, in pairs spreading out from Clawd. Buds in the grey morning; each pair pops open on a
  // beat in shot C, and they all bounce on the finale.
  const FLOWERS = [];
  for (let i = 0; i < 10; i++) {
    const side = i % 2 ? 1 : -1, k = Math.floor(i / 2);
    const x = 820 + side * (side < 0 ? 250 + k * 125 : 270 + k * 160) + 30 * hash(i + 5);
    FLOWERS.push({ x, y: hillY(x) + 55 + 45 * hash(i + 9), col: ['#E27A92', '#FFF1D6', '#F2C14E', '#9B7BCB', '#EE9A6A'][i % 5], bloom: bt(22 + k) });
  }
  const T_JUMP = bt(28), T_LAND = T_JUMP + .5;
  function flower(f, i, t) {
    boilSeed('flower' + i);
    const k = seg(t, f.bloom, f.bloom + .32), bounce = 14 * spring(t, T_LAND, 5, 16), sway = wob(t, .45, hash(i) * 3) * 4 + bounce;
    const h = 52 + 18 * hash(i + 3), tx = f.x + sway, ty = f.y - h - Math.abs(bounce) * .5;
    inkLine([[f.x, f.y], [f.x + sway * .3, f.y - h * .5], [tx, ty]], .8, mixCol(PAL.sap, PAL.ink, .35), 'ink', .5);
    if (k <= 0) { paint(ellPts(tx, ty - 7, 9, 14, 12), { wash: C('#8C9B84', '#7FA85E', t), ink: PAL.ink, sw: .6 }); return; }
    const r = 30 * backOut(k), P = [], ph = hash(i) * 2;
    for (let a = 0; a < 40; a++) {
      const th = a / 40 * TAU + ph, rr = r * (.55 + .45 * Math.abs(Math.cos(th * 2.5 - ph * 2.5)));
      P.push([tx + Math.cos(th) * rr, ty + Math.sin(th) * rr]);
    }
    paint(P, { wash: f.col, ink: PAL.ink, sw: .7, curv: .3 });
    paint(ellPts(tx, ty, r * .3, r * .3, 12), { wash: f.col === '#F2C14E' ? PAL.clay : PAL.ochre, ink: PAL.ink, sw: .5 });
    sparkle(tx, ty - 14, 40, seg(t, f.bloom, f.bloom + .45));
  }

  // The sun: rays, a painted disc and a face. face: 'sleep' | 'happy' | 'wink'.
  function sun(x, y, r, t, face, o = {}) {
    glow(x, y, r * (2.4 + .25 * (o.beat ?? 0)), '#FFD97A', o.glow ?? 1);
    boilSeed('sunrays');
    paint(starPts(x, y, r * (1.42 + .1 * (o.beat ?? 0)), .74, 12, t * .12), { wash: '#F4B444', fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: .8 });
    boilSeed('sun');
    paint(ellPts(x, y, r, r, 36, 1.2), { wash: '#FAD46C', fill: '#F4B444', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: 1 });
    const e = r * .34, ey = y - r * .1, lw = clamp(r / 70, .6, 1.5);
    const shut = (cx, up) => inkLine([[cx - e * .42, ey], [cx, ey + (up ? -e * .32 : e * .28)], [cx + e * .42, ey]], lw, PAL.ink, 'ink', .8);
    const open = cx => { paint(ellPts(cx, ey, e * .2, e * .3, 12), { wash: PAL.ink, ink: null }); paint(ellPts(cx + e * .07, ey - e * .12, e * .07, e * .07, 8), { wash: PAL.cream, ink: null }); };
    if (face === 'sleep') { shut(x - e, false); shut(x + e, false); }
    else if (face === 'wink') { open(x - e); shut(x + e, true); }
    else { shut(x - e, true); shut(x + e, true); }
    for (const s of [-1, 1]) paint(ellPts(x + s * e * 1.55, y + r * .22, r * .16, r * .09, 12), { fill: PAL.rose, fillOp: 170, bleed: .15, ink: null });
    if (face === 'sleep') paint(ellPts(x, y + r * .36, r * .07, r * .09, 10), { wash: PAL.ink, ink: null });
    else inkLine([[x - e * .6, y + r * .28], [x, y + r * .48], [x + e * .6, y + r * .28]], lw, PAL.ink, 'ink', .8);
  }

  // A fat cumulus, s = half-width. sq squashes it (the bonk); col shifts grey → cream with the light.
  function cloud(x, y, s, col, sq = 0, key = '') {
    boilSeed('cloud' + key);
    const P = [];
    for (let i = 0; i < 44; i++) {
      const a = i / 44 * TAU, up = Math.sin(a) < 0, bump = up ? 1 + .24 * Math.pow(Math.abs(Math.sin(a * 3.5 + .4)), .6) : 1;
      P.push([x + Math.cos(a) * s * bump * (1 + sq * .6), y + Math.sin(a) * s * (up ? .5 : .28) * bump * (1 - sq)]);
    }
    paint(P, { wash: col, fill: mixCol(col, PAL.indigo, .3), fillOp: 55, bleed: .12, tex: .5, ink: PAL.ink, sw: .9, curv: .4 });
  }

  // Sunbeams: long pale wedges fanning out from (x, y) toward angle `dir`. k 0..1 grows them.
  function beams(x, y, dir, len, k, t, key = '') {
    if (k <= .01) return;
    for (let i = 0; i < 4; i++) {
      boilSeed('beam' + key + i);
      const a = dir + (i - 1.5) * .17 + .02 * Math.sin(t * .8 + i), w = (.035 + .02 * hash(i + 3)) * (1 + .15 * Math.sin(t * 1.3 + i * 2)), L = len * k * (.75 + .25 * hash(i + 11));
      paint([[x, y], [x + Math.cos(a - w) * L, y + Math.sin(a - w) * L], [x + Math.cos(a + w) * L, y + Math.sin(a + w) * L]], { wash: PAL.cream, washOp: 100 * k, ink: null });
    }
  }

  const sparkle = (x, y, r, k) => { if (k > 0 && k < 1) paint(starPts(x, y, r * backOut(k) * (1 - k * .6), .25, 4, k * 2), { wash: PAL.cream, washOp: 255 * (1 - k * k), ink: PAL.ink, sw: .4 }); };

  // One painted eighth note, s = size; k 0..1 pops it in with overshoot.
  function note(x, y, s, k, rot = 0, col = PAL.ink) {
    const p = backOut(k); if (p < .03) return;
    push(); translate(x, y); rotate(rot); scale(p);
    const sw = clamp(s / 16, .5, 1.4);
    paint(ellPts(0, 0, .72 * s, .5 * s, 14, 0, -.35), { wash: col, ink: PAL.ink, sw: sw * .6 });
    inkLine([[.6 * s, -.1 * s], [.64 * s, -1.4 * s], [.68 * s, -2.6 * s]], sw, PAL.ink, 'ink', 0);
    paint(ribbon([[.66 * s, -2.6 * s], [1.3 * s, -2.1 * s], [1.55 * s, -1.2 * s]], .5 * s, .15 * s), { wash: PAL.ink, ink: null });
    pop();
  }
  const NOTE_COLS = [PAL.ink, '#7B5CA8', '#C4506E', PAL.ink, '#3A7FA0'];
  // One note per beat, beats n0..n1. fly(n, age) returns [x, y, size, k, rot] for a note `age` seconds old, or null.
  function noteStream(t, n0, n1, life, fly) {
    for (let n = n0; n <= n1; n++) {
      const age = t - bt(n); if (age < 0 || age > life) continue;
      boilSeed('note' + n); const f = fly(n, age); if (f) note(...f, NOTE_COLS[n % NOTE_COLS.length]);
    }
  }

  // ---------- Clawd and the guitar ----------
  // The guitar, drawn in Clawd's body space (front view): its body over Clawd's lower right, the neck running up-left
  // to the left hand. tilt raises the neck; ring 0..1 shakes the strings after a strum.
  const GUITAR = [3.4, -1.6], G_ANG = .17;
  function guitar(u, sw, tilt, ring) {
    const U = pts => pts.map(([a, b]) => [a * u, b * u]);
    push(); translate(GUITAR[0] * u, GUITAR[1] * u); rotate(G_ANG + tilt);
    paint(U([[-10.2, -.3], [-3, -.34], [-3, .34], [-10.2, .3]]), { wash: '#8A5634', ink: PAL.ink, sw: sw * .7 });                     // neck
    paint(U([[-10.1, -.42], [-11.5, -.62], [-11.6, .6], [-10.1, .42]]), { wash: '#5E3A2A', ink: PAL.ink, sw: sw * .7 });             // head
    for (const [px, py] of [[-10.6, -.62], [-11.2, -.7], [-10.6, .62], [-11.2, .68]]) paint(ellPts(px * u, py * u, .16 * u, .16 * u, 8), { wash: PAL.cream, ink: PAL.ink, sw: sw * .35 });
    const B = [];
    for (let a = -1.95; a <= 1.951; a += .15) B.push([1.9 * Math.cos(a), 1.9 * Math.sin(a)]);
    B.push([-1.25, 1.05]);
    for (let a = 1.15; a <= TAU - 1.15; a += .2) B.push([-2.35 + 1.4 * Math.cos(a), 1.4 * Math.sin(a)]);
    B.push([-1.25, -1.05]);
    paint(U(B), { wash: '#8466B5', fill: PAL.indigo, fillOp: 55, bleed: .05, tex: .6, ink: PAL.ink, sw: sw * .9, curv: .3 });        // body
    paint(ellPts(-1.2 * u, 0, .78 * u, .78 * u, 18), { wash: PAL.cream, ink: null });                                                  // rosette
    paint(ellPts(-1.2 * u, 0, .58 * u, .58 * u, 18), { wash: '#2B2233', ink: null });                                                  // sound hole
    paint(U([[.7, -.75], [1.3, -.75], [1.3, .75], [.7, .75]]), { wash: '#5E3A2A', ink: PAL.ink, sw: sw * .5 });                       // bridge
    for (const fx of [-4, -4.9, -5.8, -6.7, -7.6, -8.5, -9.4]) inkLine([[fx * u, -.3 * u], [fx * u, .3 * u]], sw * .3, PAL.cream, 'inkfine', 0);
    for (let j = 0; j < 3; j++) {   // strings, shaking after each strum
      const y = (j - 1) * .17 * u, v = ring * Math.sin(T * 95 + j * 2) * .14 * u;
      inkLine([[1 * u, y], [-4.5 * u, y + v], [-10.1 * u, y * 1.4]], sw * .28, PAL.cream, 'inkfine', .3);
    }
    pop();
  }
  // Repaint an arm over the guitar, so the hands sit on the neck and the strings (front-view arms are drawn behind
  // the body). Same pivot, angle and boil seed as the arm clawd() draws underneath, so the two line up; len can be
  // longer than the real 2.2u so the strumming hand reaches the strings.
  function armOver(u, sw, which, a, len, col, dk, id) {
    const dir = which === 'L' ? -1 : 1;
    boilSeed(`clawd ${id} arm${which}`);
    push(); translate(dir * (4.9 + .55 * clamp((Math.abs(a) - .7) / .9)) * u, -4.5 * u); rotate(dir < 0 ? a : -a);
    paint(rectPts(dir < 0 ? -len * u : 0, -.5 * u, len * u, u, u * .07 * .6), { wash: col, washOp: 255, fill: dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    pop();
  }
  // Clawd playing: mood from emotions(); p = { strum (right arm angle), fret (left arm angle), tilt, ring, mouth, dy, sq, rot }.
  function player(x, y, u, mood, p) {
    const o = { ...mood, aL: p.fret, aR: p.strum, boilKey: 'player',
                dy: (mood.dy || 0) + (p.dy || 0), sq: (mood.sq || 0) + (p.sq || 0), rot: (mood.rot || 0) + (p.rot || 0) };
    if (p.mouth !== undefined) o.mouth = p.mouth;
    o.draw = (u, sw) => {
      const c = tintCols(o);
      guitar(u, sw, p.tilt || 0, p.ring || 0);
      armOver(u, sw, 'L', p.fret, 2.2, c.col, c.dk, 'player');
      armOver(u, sw, 'R', p.strum, p.reach ?? 3, c.col, c.dk, 'player');
    };
    clawd(x, y, u, o);
  }
  // strumming on every beat: a quick downstroke on the beat, an easy upstroke after it
  const strumBeat = t => { const f = frac(bpOf(t)); return f < .18 ? lerp(-2.5, -2.02, easeOut(f / .18)) : lerp(-2.02, -2.5, ease((f - .18) / .82)); };
  const ringBeat = t => Math.exp(-frac(bpOf(t)) * 4);
  // wordless singing: a new mouth shape each beat, a breath at the end of each bar
  const SING = ['open', 'O', 'o', 'smile', 'open', 'O', 'cat', 'open'];
  const sing = t => { const b = bpOf(t), n = Math.floor(b); return (((n % 4) + 4) % 4 === 3 && frac(b) > .55) ? 'smile' : SING[((n % 8) + 8) % 8]; };
  // the fretting hand: shifts chord on each bar
  const fretAt = t => -.75 + .07 * (Math.floor(bpOf(t) / 4) % 2) + .03 * wob(t, .7);

  // ---------- shot A: the grey morning ----------
  const PX = 820, PY = hillY(820) + 4, PU = 30;                           // Clawd on the crest
  const T_STRUM = bt(4), T_BONK = bt(6), NOTE0 = [PX + 60, PY - 60];      // 2.07, 3.05
  const SUN = [1460, 250];
  const aNotes = [8, 9, 10, 11];                                          // beats whose notes fly to the cloud
  const arrive = n => bt(n) + .95;
  function cloudA(t) {                                                    // the cloud's x and squash in shot A
    let x = 1435 + 25 * ease(seg(t, T_BONK, T_BONK + .3)), sq = .14 * spring(t, T_BONK, 6, 16);
    for (const n of aNotes) { x += 48 * ease(seg(t, arrive(n), arrive(n) + .3)); sq += .07 * spring(t, arrive(n), 7, 18); }
    return [x, sq];
  }
  function shotA(t, lt, dur) {
    const pk = easeIn(seg(t, bt(11), dur));   // the push into Clawd's face, into the cut
    camBegin(lerp(900 + 18 * Math.sin(t * .5), PX, pk), 540, lerp(1 + .012 * t, 1.95, pk));
    sky(t);
    const [cx, csq] = cloudA(t);
    beams(SUN[0], SUN[1], 2.55, 900, clamp(sunK(t) * 3.5), t, 'A');
    sun(...SUN, 100, t, 'sleep', { glow: .25 + 1.5 * sunK(t) });
    cloud(cx, 265, 235, C('#C3C7D2', '#EFE6D8', t), csq, 'A');
    if (t > T_BONK) glow(cx - 170, 300, 140 * Math.exp(-(t - T_BONK) * 1.5) + 40, '#FFE3A0', .7 * Math.exp(-(t - T_BONK) * 2));
    farHills(t);
    hill(t);
    FLOWERS.forEach((f, i) => flower(f, i, t));

    const mood = emotions(t, [[0, 'sad', { emote: null, lookX: .55, lookY: -.95 }], [1.4, 'determined', { lookX: .25, lookY: .9 }],
                              [2.3, 'hopeful', { lookX: .75, lookY: -.9 }], [bt(7), 'surprised', { lookX: .7, lookY: -.8 }],
                              [3.95, 'excited'], [bt(9), 'happy', { emote: 'music' }]]);
    let strum = -2.3 + .03 * wob(t, .5), ring = 0;
    if (t > 1.75 && t < T_STRUM) strum = lerp(-2.3, -1.4, ease(seg(t, 1.75, T_STRUM)));                          // wind-up
    else if (t >= T_STRUM && t < 3.9) { strum = kf(t, [[T_STRUM, -1.4], [T_STRUM + .09, -2.15], [2.6, -2.3]], easeOut); ring = Math.exp(-(t - T_STRUM) * 2.5); }
    else if (t >= 3.9 && t < bt(8)) strum = lerp(-2.3, -2.5, ease(seg(t, 3.9, bt(8))));
    else if (t >= bt(8)) { strum = strumBeat(t); ring = ringBeat(t); }
    player(PX, PY, PU, mood, { strum, fret: fretAt(t), ring, mouth: t > bt(9) ? sing(t) : undefined });

    // the first note: up on an arc to the cloud, BONK
    boilSeed('note-first');
    if (t > T_STRUM && t < T_BONK + .12) {
      const k = ease(seg(t, T_STRUM, T_BONK)), p = arcPt(NOTE0, [cx - 120, 320], 170, k);
      note(p[0], p[1], 26, seg(t, T_STRUM, T_STRUM + .18) * (1 - seg(t, T_BONK, T_BONK + .12)), .25 * Math.sin(t * 9));
    }
    for (let i = 0; i < 6; i++) sparkle(cx - 120 + Math.cos(i * 1.05) * 90 * seg(t, T_BONK, T_BONK + .5), 320 + Math.sin(i * 1.05) * 60 * seg(t, T_BONK, T_BONK + .5), 18, seg(t, T_BONK, T_BONK + .5));
    // then one per beat once Clawd is playing, each nudging the cloud
    noteStream(t, aNotes[0], aNotes[aNotes.length - 1], .95, (n, age) => {
      const k = ease(age / .95), p = arcPt(NOTE0, [cx - 130 + 40 * hash(n), 330 + 30 * hash(n + 1)], 120 + 60 * hash(n + 2), k);
      return [p[0], p[1], 20, seg(age, 0, .15) * (1 - seg(age, .85, .95)), .3 * Math.sin(age * 8 + n)];
    });
    const eye = toScreen(PX, PY - 5 * PU);
    camEnd();
    boilSeed('transition');
    if (lt < .55) iris(...eye, lerp(0, 1500, easeIn(lt / .55)));
  }

  // ---------- shot B: close-up, the sun breaks out ----------
  const BX = 960, BY = 1030, BU = 48;
  const T_BREAK = bt(16), T_OPEN = 8.25, T_STAR = 8.6, T_BIG = bt(18);   // 7.93, 8.9
  function shotB(t, lt, dur) {
    camBegin(960 + 10 * Math.sin(t * .6), 540, kf(t, [[T_AB, 1], [T_BREAK, 1.025], [T_BIG - .1, 1.0], [T_BIG + .6, 1.05]], ease));
    sky(t);
    const SB = [1700, 90], out = easeIn(seg(t, T_BREAK - .05, T_BREAK + .4));
    const bk = ease(seg(t, T_BREAK, T_BREAK + .35));
    beams(...SB, 2.4, 1500, .35 + .65 * bk, t, 'B');
    sun(...SB, 140, t, 'happy', { glow: .6 + .8 * bk, beat: pulse(t, 5) * bk });
    cloud(1640 + 60 * seg(t, T_AB, T_BREAK) + 900 * out, 120, 330, C('#C3C7D2', '#EFE6D8', t), .05 * spring(t, T_BREAK, 6, 16), 'B');
    farHills(t, 60);
    boilSeed('hillB');
    const col = C('#7E977D', '#76B159', t);
    paint(ellPts(960, 1560, 1500, 560, 48, 2), { wash: col, fill: mixCol(col, PAL.ink, .25), fillOp: 70, bleed: .08, tex: .6, ink: PAL.ink, sw: 1 });

    const mood = emotions(t, [[T_AB, 'happy', { emote: 'music' }], [T_OPEN, 'surprised', { lookX: .8, lookY: -.8 }], [T_STAR, 'starstruck', { lookX: .5, lookY: -.6 }]]);
    const tiltK = backOut(seg(t, T_STAR, T_BIG)), tilt = .2 * tiltK;
    let strum = strumBeat(t), ring = ringBeat(t);
    if (t > T_STAR) { strum = t < T_BIG ? lerp(strumBeat(T_STAR), -1.3, ease(seg(t, T_STAR, T_BIG))) : kf(t, [[T_BIG, -1.3], [T_BIG + .08, -2.25]], easeOut); ring = t > T_BIG ? Math.exp(-(t - T_BIG) * 1.2) : 0; }
    const sway = t < T_OPEN ? .05 * Math.sin(bpOf(t) * Math.PI / 2) : 0, lean = -.1 * tiltK;
    const mouth = t < T_OPEN - .05 ? sing(t) : t > T_BIG ? 'O' : undefined;
    const big = t > T_BIG ? { sq: -.1 * ease(seg(t, T_BIG, T_BIG + .15)) - .03 * pulse(t, 4), dy: 0 } : { sq: .1 * ease(seg(t, T_STAR + .1, T_BIG)) };
    player(BX, BY, BU, mood, { strum, fret: lerp(fretAt(t), .95, tiltK), tilt, ring, mouth, rot: sway + lean, ...big });

    // notes rise from the song, left and right in turn; bigger on the big note
    noteStream(t, 12, 19, 1.9, (n, age) => {
      if (bt(n) > T_OPEN - .2 && bt(n) < T_BIG - .01) return null;
      const s = n >= 18 ? 38 : 28, side = n % 2 ? 1 : -1;
      return [BX + side * (260 + 120 * age) + 30 * Math.sin(age * 5 + n), BY - 420 - 260 * age, s, seg(age, 0, .2) * (1 - seg(age, 1.5, 1.9)), .3 * Math.sin(age * 6 + n)];
    });
    glow(BX + 60, BY - 330, 560, '#FFD27A', .45 * bk);   // the sunlight on Clawd, over the paint
    if (t > T_BIG) for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .4, q = seg(t, T_BIG + i * .025, T_BIG + .55 + i * .025); sparkle(BX + Math.cos(a) * 420 * q, BY - 300 + Math.sin(a) * 380 * q, 30, q); }
    camEnd();
    boilSeed('transition');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, GOLD);
  }

  // ---------- shot C: the same hill, sunny ----------
  const T_WIND = 12.95, T_PROUD = T_LAND + .05, T_WINK = bt(30);         // 13.78 jump, 14.28 land, 14.75 wink
  function shotC(t, lt, dur) {
    const shake = t > T_LAND ? shakeXY(t, 5 * Math.exp(-(t - T_LAND) * 8)) : [0, 0];
    camBegin(920 + 14 * Math.sin(t * .5) + shake[0], 540 + shake[1], kf(t, [[T_BC, .97], [T_WIND, 1], [T_JUMP, 1.04], [DUR, 1.07]], ease));
    sky(t);
    const bop = pulse(t, 5);
    beams(SUN[0], SUN[1], 2.55, 1000, 1, t, 'C');
    const sy = SUN[1] - 10 * bop - 22 * Math.max(0, spring(t, T_JUMP + .05, 6, 14)) - 14 * Math.max(0, spring(t, T_WINK, 7, 16));
    sun(SUN[0], sy, 100, t, t > T_WINK && t < T_WINK + .6 ? 'wink' : 'happy', { glow: 1.6, beat: bop });
    if (t > T_WINK) sparkle(SUN[0] + 60, sy - 40, 30, seg(t, T_WINK, T_WINK + .5));
    cloud(1830 + 40 * (t - T_BC), 175, 105, '#F6EEDF', 0, 'C');
    farHills(t);
    hill(t);
    FLOWERS.forEach((f, i) => flower(f, i, t));

    const mood = emotions(t, [[T_BC, 'happy', { emote: 'music' }], [T_WIND, 'determined', { lookX: .2, lookY: .3 }], [T_JUMP, 'excited'], [T_PROUD, 'proud']]);
    const jmp = jump(t, T_JUMP, T_LAND, 3.2), crouch = .14 * ease(seg(t, T_WIND + .2, T_JUMP - .15)) * (t < T_JUMP - .12 ? 1 : 0);
    let strum = strumBeat(t), ring = ringBeat(t);
    if (t > T_WIND) {
      if (t < T_JUMP) { strum = lerp(strumBeat(T_WIND), -1.25, ease(seg(t, T_WIND, T_JUMP - .1))); ring = 0; }
      else if (t < T_PROUD) { strum = kf(t, [[T_JUMP, -1.25], [T_JUMP + .08, -2.25]], easeOut); ring = Math.exp(-(t - T_JUMP) * 1.5); }
      else { strum = lerp(-2.25, 1.15, backOut(seg(t, T_PROUD, T_PROUD + .3))); ring = Math.exp(-(t - T_JUMP) * 1.5); }
    }
    const mouth = t < T_WIND ? sing(t) : undefined;
    player(PX, PY, PU, mood, { strum, fret: fretAt(t), ring, mouth, reach: t > T_PROUD ? 2.2 : 3, dy: jmp.dy, sq: jmp.sq + crouch, rot: t < T_WIND ? .05 * Math.sin(bpOf(t) * Math.PI / 2) : 0 });
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * .45, q = seg(t, T_LAND + i * .02, T_LAND + .5 + i * .02); sparkle(PX + Math.cos(a) * 230 * q, PY - 110 + Math.sin(a) * 170 * q, 22, q); }

    // a few notes drift up toward the sun while Clawd plays
    noteStream(t, 20, 25, 1.7, (n, age) => n % 2 ? null : [PX + 90 + 260 * age, PY - 200 - 170 * age + 18 * Math.sin(age * 5), 18, seg(age, 0, .2) * (1 - seg(age, 1.3, 1.7)), .3 * Math.sin(age * 6 + n)]);
    const eye = toScreen(PX, PY - 5 * PU + jmp.dy * PU);
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, GOLD);
    const tI = DUR - .6;   // sunburst iris: close to Clawd, hold, shut
    if (t > tI) {
      const r = t < tI + .3 ? lerp(1500, 240, ease(seg(t, tI, tI + .3))) : t < DUR - .18 ? 240 - 30 * seg(t, tI + .3, DUR - .18) : lerp(210, 0, easeIn(seg(t, DUR - .18, DUR - .04)));
      if (r < 4) iris(0, 0, 0); else irisShape(starPts(eye[0], eye[1], r, .8, 14, t * .6), PAL.ink);
    }
  }

  shots([[0, shotA], [T_AB, shotB], [T_BC, shotC]]);
})();
