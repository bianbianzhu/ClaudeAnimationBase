// a_home.js: shot A (0–16.135), home at dawn, over the solo-ukulele intro.
//   A window-shaped iris opens on Clawd asleep. The sun rises in the window and its beam slides down onto Clawd's face.
//   Clawd wakes, looks up at the beach picture over the bed, gets the idea, hops out of bed, snatches the uke off
//   the wall and strums along with the intro. Then uke on the back, a trot to the door, the door opens on bright light
//   and Clawd runs into it: the light floods the frame (shot B fades out of it).
(() => {
  const { bt, bar, C } = BCH;
  const FLOOR = 900, BED = [470, 770], BU = 24, PEG = [1010, 700], DOOR = [1580, 330, 220, 570], WIN = [1100, 170, 320, 370];
  const T_WAKE = 4.35, T_LOOK = 5.3, T_IDEA = bar(3), T_OUT0 = 7.1, T_OUT1 = bt(15), T_HOP0 = 8.0, T_HOP1 = 8.45, T_GRAB = 8.22, T_HELD = 8.55;
  const T_TURN = bar(6), T_DOOR = 14.75, T_RUN = 15.1, T_END = bar(8);

  const dawn = t => ease(seg(t, 1.2, 5.2));   // 0 = blue dawn, 1 = warm morning light
  const sunY = t => kf(t, [[0, 560], [2.1, 520], [4.1, 330], [16, 250]], x => 1 - Math.pow(1 - x, 2));

  // ---------- the room ----------
  function room(t) {
    const k = dawn(t), wall = mixCol('#A99BC2', '#F0CDB6', k);
    boilSeed('wall'); paint(rectPts(-400, -300, W + 1000, FLOOR + 300), { wash: wall, ink: null });
    for (let i = 0; i < 11; i++) { boilSeed('stripe' + i); const x = 60 + i * 230; paint(rectPts(x, -100, 70, FLOOR + 100), { fill: mixCol(wall, '#FFFFFF', .35), fillOp: 55, bleed: .05, tex: .5, ink: null }); }
    boilSeed('rail'); inkLine([[-300, 150], [W / 2, 152], [W + 600, 150]], 1, mixCol(wall, PAL.ink, .4), 'ink', 0);
    boilSeed('floor'); paint(rectPts(-400, FLOOR, W + 1000, 600), { wash: mixCol('#8E6E7A', '#C08A5E', k), fill: '#8A5634', fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 6; i++) { boilSeed('plank' + i); const y = FLOOR + 30 + i * 32 + i * i * 4; inkLine([[-300, y], [W + 600, y + 2]], .5, mixCol('#8A5634', PAL.ink, .3), 'inkfine', 0); }
    boilSeed('rug'); paint(ellPts(1010, 975, 330, 55, 30, 2), { wash: mixCol('#9B7BA8', PAL.rose, k), fill: PAL.violet, fillOp: 50, tex: .5, ink: PAL.ink, sw: .8 });
    window_(t); picture(t); door(t); peg(t);
  }
  function window_(t) {
    const [x, y, w, h] = WIN, k = dawn(t);
    boilSeed('winsky'); paint(rectPts(x, y, w, h), { wash: mixCol('#8F86C4', '#9ED1EA', k), ink: null });
    paint(rectPts(x, y + h * .45, w, h * .55), { fill: mixCol('#F2A98C', '#FBE1B8', k), fillOp: 200, bleed: .2, tex: .3, ink: null });
    const sy = sunY(t);
    BCH.sun(x + w * .56, sy, 44, t, null, { glow: .7 + .3 * k, glowR: 3.2, key: 'win' });
    boilSeed('roofs');   // town rooftops, the sun rises from behind them
    const R = [[x - 5, y + h + 5], [x - 5, y + h - 80]];
    for (let i = 0; i < 6; i++) { const rx = x + i * w / 6, rh = 70 + 50 * hash(i + 2); R.push([rx, y + h - rh], [rx + w / 12, y + h - rh - 30], [rx + w / 6, y + h - rh]); }
    R.push([x + w + 5, y + h - 80], [x + w + 5, y + h + 5]);
    paint(R, { wash: mixCol('#6E5E8E', '#C98E86', k), ink: null });
    boilSeed('winframe');
    const fr = '#F6E9D6';
    for (const r of [[x - 18, y - 18, w + 36, 20], [x - 18, y + h - 2, w + 36, 24], [x - 18, y - 18, 20, h + 36], [x + w - 2, y - 18, 20, h + 36], [x + w / 2 - 8, y, 16, h], [x, y + h / 2 - 8, w, 16]])
      paint(rectPts(...r), { wash: fr, ink: PAL.ink, sw: .8 });
    for (const s of [-1, 1]) {   // curtains, stirring
      boilSeed('curtain' + s);
      const cx = s < 0 ? x - 30 : x + w + 30, sway = 8 * Math.sin(t * 1.3 + s);
      paint([[cx - 45, y - 40], [cx + 45, y - 40], [cx + 40 + s * 10 + sway, y + h * .6], [cx + 55 + sway, y + h + 60], [cx - 55 + sway, y + h + 60], [cx - 40 + sway, y + h * .6]],
        { wash: mixCol('#B0708E', '#E58FA0', k), fill: '#C4506E', fillOp: 50, tex: .5, ink: PAL.ink, sw: .8, curv: .3 });
      inkLine([[cx - 10, y - 30], [cx - 5 + sway * .5, y + h * .5], [cx + sway, y + h + 50]], .5, '#8E3A5A', 'inkfine', .5);
    }
    boilSeed('rod'); inkLine([[x - 110, y - 42], [x + w + 110, y - 42]], 1.6, PAL.ink, 'ink', 0);
    boilSeed('plant');   // a small plant on the sill
    const px = x + 60, py = y + h + 20;
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .45 + .06 * Math.sin(t * 1.7 + i); paint(ribbon([[px, py - 30], [px + Math.cos(a) * 45, py - 30 + Math.sin(a) * 45]], 4, 18), { wash: C.leaf, ink: PAL.ink, sw: .5 }); }
    paint([[px - 22, py - 32], [px + 22, py - 32], [px + 16, py + 4], [px - 16, py + 4]], { wash: PAL.clay, ink: PAL.ink, sw: .6 });
  }
  function picture(t) {   // the beach picture over the bed: the whole film's promise
    const x = 350, y = 230, w = 300, h = 200;
    boilSeed('pic');
    paint(rectPts(x - 16, y - 16, w + 32, h + 32), { wash: '#B98A5A', ink: PAL.ink, sw: 1 });
    paint(rectPts(x, y, w, h), { wash: '#A8DCEB', ink: null });
    paint(rectPts(x, y + h * .52, w, h * .2), { wash: C.sea, ink: null });
    paint([[x, y + h * .72], [x + w, y + h * .66], [x + w, y + h], [x, y + h]], { wash: C.sand, ink: null });
    BCH.sun(x + w * .7, y + h * .38, 20, t, null, { glow: 0, key: 'pic' });
    boilSeed('picpalm'); BCH.palm(x + w * .22, y + h * .92, 120, .2 * Math.sin(t), 'pic', .3);
    boilSeed('picframe'); paint(rectPts(x, y, w, h), { ink: PAL.ink, sw: .8 });
    inkLine([[x + w / 2, y - 16], [x + w / 2, y - 60]], .5, PAL.ink, 'inkfine', 0);
  }
  function door(t) {
    const [x, y, w, h] = DOOR, op = ease(seg(t, T_DOOR, T_DOOR + .3));
    boilSeed('doorframe'); paint(rectPts(x - 20, y - 20, w + 40, h + 20), { wash: '#F6E9D6', ink: PAL.ink, sw: .9 });
    boilSeed('doorway');
    paint(rectPts(x, y, w, h), { wash: op > 0 ? mixCol('#8D7FA6', '#FFF5E2', op) : '#8D7FA6', ink: null });
    if (op > 0) { glow(x + w / 2, y + h / 2, 420 * op + 60 * Math.sin(t * 6) * op, '#FFE6A8', op); beams(x + w / 2, y + h * .75, Math.PI * .92, 700, op, t); }
    boilSeed('door');
    const pw = lerp(w, 34, op);   // the panel swings toward us on its right hinge: a flat drawing that narrows
    paint(rectPts(x + w - pw, y, pw, h), { wash: mixCol('#3F8FA0', '#4FA6A8', dawn(t)), fill: '#2B6F85', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
    if (op < .7) {
      for (const r of [[.15, .08, .7, .36], [.15, .52, .7, .38]]) paint(rectPts(x + w - pw + r[0] * pw, y + r[1] * h, r[2] * pw, r[3] * h), { fill: '#2B6F85', fillOp: 90, tex: .5, ink: PAL.ink, sw: .5 });
      paint(ellPts(x + w - pw + pw * .12, y + h * .55, 11, 11, 10), { wash: PAL.ochre, ink: PAL.ink, sw: .6 });
    }
  }
  function beams(x, y, dir, len, k, t) { BCH.beams(x, y, dir, len, k, t, 'door', 5, .12); }
  function peg(t) { boilSeed('peg'); paint(ellPts(PEG[0], PEG[1] - 238, 9, 9, 10), { wash: '#8A5634', ink: PAL.ink, sw: .6 }); }
  // the uke hanging on its peg (head up), until Clawd snatches it
  function ukeOnWall(t) {
    if (t >= T_GRAB) return;
    boilSeed('wallukebody');
    push(); translate(PEG[0], PEG[1]); rotate(Math.PI / 2 + .04 * Math.sin(t * 1.1)); BCH.ukeShape(BU, 1.6, 0); pop();
  }
  // the uke in flight from the peg into Clawd's hands (t in T_GRAB..T_HELD), world space
  function ukeFlying(t, cx, cy) {
    if (t < T_GRAB || t >= T_HELD) return;
    const k = ease(seg(t, T_GRAB, T_HELD)), to = [cx + 3.2 * BU, cy - 2.0 * BU];
    const p = arcPt(PEG, to, 70, k);
    boilSeed('flyuke'); push(); translate(p[0], p[1]); rotate(lerp(Math.PI / 2, .22 - TAU, k)); BCH.ukeShape(BU, 1.6, 0); pop();
  }
  function bed(t, front) {
    const off = seg(t, T_OUT0, T_OUT0 + .4);
    if (!front) {
      boilSeed('headboard'); paint(rrPts(150, 560, 70, 340, 26), { wash: '#B98A5A', fill: '#8A5634', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
      boilSeed('bedframe'); paint(rectPts(150, 780, 690, 90), { wash: '#B98A5A', fill: '#8A5634', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1 });
      for (const lx of [165, 815]) paint(rectPts(lx, 860, 22, 42), { wash: '#8A5634', ink: PAL.ink, sw: .7 });
      boilSeed('mattress'); paint(rrPts(200, 735, 630, 60, 20), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
      boilSeed('pillow'); paint(rrPts(215, 650 + 6 * off, 150, 90 - 6 * off, 36), { wash: '#F6E9D6', fill: '#D8C6E0', fillOp: 70, ink: PAL.ink, sw: .8 });
      return;
    }
    // the quilt, over Clawd; it slumps flat when Clawd hops out
    boilSeed('quilt');
    const top = lerp(698, 742, ease(off)), bump = lerp(40, 4, ease(off)), k = dawn(t);
    const Q = [[320, top + 30]];
    for (let i = 0; i <= 10; i++) { const x = lerp(340, 840, i / 10), d = Math.exp(-(((x - BED[0]) / 140) ** 2)); Q.push([x, top - bump * d + 6 * Math.sin(i * 1.7) + (i === 10 ? 20 : 0)]); }
    Q.push([860, 850], [320, 850]);
    paint(Q, { wash: mixCol('#5E6FA8', '#4FA6A8', k), fill: '#2B6F85', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1, curv: .2 });
    for (let i = 0; i < 4; i++) { const x = 420 + i * 110; inkLine([[x, top + 20], [x + 8, 845]], .5, PAL.cream, 'inkfine', .3); }
    inkLine([[330, top + 55], [850, top + 60]], .5, PAL.cream, 'inkfine', .3);
  }

  // ---------- Clawd ----------
  const MOOD = [[0, 'sleepy', { eyes: 'closed', mouth: 'o' }], [T_WAKE, 'surprised', { lookX: .9, lookY: -.3 }], [T_LOOK, 'thinking', { lookX: .15, lookY: -1, emote: null }],
                [T_IDEA, 'idea', { lookY: -.6 }], [6.75, 'excited', { lookX: .8 }], [T_HELD + .15, 'happy', { emote: 'music' }], [T_TURN + .1, 'excited', { emote: null }]];
  function hero(t) {
    const mood = emotions(t, MOOD, { take: .8 });
    if (t < T_OUT0) {   // in bed: lying back a little, legs under the quilt
      const sit = ease(seg(t, T_WAKE, T_WAKE + .3));
      BCH.buddy('clawd', BED[0], BED[1], BU, { ...mood, noLegs: true, noShadow: true, rot: lerp(-.1, 0, sit) + (mood.rot || 0), dy: (mood.dy || 0) - .7 * sit, aL: Math.min(mood.aL ?? .2, .3), aR: Math.min(mood.aR ?? .2, .3) });
      return [BED[0], BED[1]];
    }
    if (t < T_HOP0) {   // hop out of bed onto the rug, then face the uke
      const k = seg(t, T_OUT0, T_OUT1), p = arcPt(BED, [PEG[0] - 20, FLOOR], 150, ease(k)), j = jump(t, T_OUT0, T_OUT1, 0);
      const x = t < T_OUT1 ? p[0] : PEG[0] - 20, y = t < T_OUT1 ? p[1] : FLOOR;
      BCH.buddy('clawd', x, y, BU, { ...mood, sq: (mood.sq || 0) + j.sq, aL: 1.2, aR: 1.2, noLegs: t < T_OUT0 + .12 });
      return [x, y];
    }
    if (t < T_HELD) {   // the hop up to snatch the uke
      const j = jump(t, T_HOP0, T_HOP1, 3.4), x = lerp(PEG[0] - 20, PEG[0], ease(seg(t, T_HOP0, T_HOP1)));
      BCH.buddy('clawd', x, FLOOR, BU, { ...mood, dy: (mood.dy || 0) + j.dy, sq: (mood.sq || 0) + j.sq, aR: t < T_GRAB ? 1.5 : .6, aL: t < T_GRAB ? 1.1 : .4, lookY: -1 });
      return [x, FLOOR];
    }
    if (t < T_TURN) {   // strumming along with the intro
      const playing = t > bt(18) - .1;
      BCH.player('clawd', PEG[0], FLOOR, BU, mood, {
        strum: playing ? BCH.strumBeat(t) : lerp(-1.2, -2.3, ease(seg(t, T_HELD, bt(18)))), ring: playing ? BCH.ringBeat(t) : 0,
        mouth: t > bt(20) ? BCH.sing(t) : undefined, tilt: .06 * Math.sin(bpOf(t) * Math.PI / 2) });
      return [PEG[0], FLOOR];
    }
    // uke on the back, trot to the door, open it, run into the light
    const x = kf(t, [[T_TURN, PEG[0]], [T_TURN + .25, PEG[0]], [14.6, 1500], [T_RUN, 1500], [T_END, 1760]], ease);
    const moving = (t > T_TURN + .25 && t < 14.6) || t > T_RUN;
    const tr = BCH.trot(t, 0, t > T_RUN ? 1.5 : 1);
    const o = t < T_TURN + .25 ? { ...mood, ...turn(t, T_TURN, T_TURN + .22, 0, .25) } : { ...mood, ...(moving ? tr : { view: 'side', walk: 0 }), sq: (mood.sq || 0) + (moving ? tr.sq : 0), dy: (mood.dy || 0) * .3 + (moving ? tr.dy : 0) };
    if (t > 14.6 && t < T_RUN) { o.aL = lerp(.2, .55, ease(seg(t, 14.6, T_DOOR))); o.view = 'side'; }
    if (t > T_DOOR) { const tk = take(t, T_DOOR + .12, .7); o.sq = (o.sq || 0) + tk.sq; o.dy = (o.dy || 0) + tk.dy; }   // the light hits: a take
    BCH.buddy('clawd', x, FLOOR, BU, { ...o, ukeBack: true });
    return [x, FLOOR];
  }

  // ---------- the sunbeam ----------
  function sunbeam(t) {
    const k = seg(t, 1.6, 2.6) * (1 - .5 * seg(t, 7, 9));
    if (k <= 0) return;
    const p = seg(t, 2.1, 4.1), cx = lerp(560, BED[0] + 10, ease(p)), cy = lerp(330, BED[1] - 6 * BU, ease(p));
    const [x, y, w, h] = WIN;
    boilSeed('sunbeam');
    paint([[x + 10, y + 20], [x + 10, y + h - 20], [cx - 30, cy + 110], [cx - 70, cy - 90]], { wash: '#FFE9B8', washOp: 60 * k, ink: null });
    paint(ellPts(cx - 50, cy + 10, 110, 120, 20), { wash: '#FFE9B8', washOp: 70 * k, ink: null });
  }

  // ---------- the shot ----------
  function shotA(t, lt, dur) {
    // camera: wide, a nudge to Clawd and the picture, back out for the hop, push into the strum, pan to the door, push into the light
    const cam = kf(t, [[0, [960, 540, 1]], [3.9, [900, 560, 1.04]], [5.6, [560, 520, 1.3]], [6.9, [620, 520, 1.25]], [7.6, [860, 560, 1.08]],
                       [8.7, [880, 600, 1.12]], [10.2, [1010, 740, 1.55]], [12.1, [1010, 745, 1.62]], [13.1, [1250, 620, 1.18]], [14.6, [1480, 600, 1.2]], [16.2, [1700, 610, 1.85]]]);
    camBegin(cam[0] + 6 * wob(t, .23), cam[1] + 4 * wob(t, .17, .3), cam[2]);
    room(t);
    ukeOnWall(t);
    bed(t, false);
    const [hx, hy] = hero(t);
    bed(t, true);
    ukeFlying(t, PEG[0], FLOOR);
    sunbeam(t);
    if (t > T_WAKE - .15 && t < 8) glow(BED[0] + 10, BED[1] - 6 * BU, 150, '#FFD99A', .45 * seg(t, 3.6, 4.1) * (1 - seg(t, 6.8, 7.4)));
    // notes from the strum drift up toward the window
    BCH.noteStream(t, 18, 23, 2.4, (n, age) => {
      const k = age / 2.4, sx = PEG[0] + 90, sy = FLOOR - 190;
      return [sx + 260 * k + 30 * Math.sin(age * 3 + n), sy - 300 * easeOut(k) - 40 * k, 20, seg(age, 0, .2) * (1 - seg(age, 2, 2.4)), .2 * Math.sin(age * 2 + n)];
    }, 'home');
    const face = toScreen(BED[0], BED[1] - 6 * BU);
    camEnd();
    // in: a window-shaped iris opens on sleeping Clawd; out: the doorway light floods the frame
    if (lt < 1.6) { const r = lerp(0, 1500, easeIn(seg(lt, .15, 1.6))); if (r < 4) iris(0, 0, 0); else irisShape(rrPts(face[0] - r * .86, face[1] - r, r * 1.72, r * 2, r * .12), PAL.ink); }
    flash(easeIn(seg(t, 15.35, T_END)), PAL.cream);
  }
  shots([[0, shotA]]);
})();
