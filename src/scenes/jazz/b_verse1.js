// jazz/b_verse1.js: shots E–M (11.90–76.46 s): verse 1 and the pre-chorus.
//   E the singer + the empty table · F the bassist's fingers · G the phone, the cord → the wire → the empty booth
//   H the lamps and the silhouette at the corner · I1 the drummer · I2 the piano-key stairs · J the zebra crossing
//   K the clock tower and the moon · L the shrinking spotlight · M the memory on the bench (silhouette switch)
(() => {
  const B = beatT, bt = (bar, beat = 0) => beatT(bar * 4 + beat);
  const SPEED = mixCol(JZ.ink, JZ.cream, .4);
  // cubic hermite from a to b over u 0..1 with start / end velocities (in units per whole u)
  const herm = (u, a, b, va = 0, vb = 0) => { u = clamp(u); const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * a + (u3 - 2 * u2 + u) * va + (-2 * u3 + 3 * u2) * b + (u3 - u2) * vb; };
  // a gardenia lying at (x, y) (props.js gardeniaAt draws the flower offset by the hat's (-3.9u, -8.1u); this centres it)
  function gard(x, y, s, rot = 0, key = '') { boilSeed('gard' + key); push(); translate(x, y); rotate(rot); translate(3.9 * s, 8.1 * s); hat(s, 'gardenia', clamp(s / 15, .45, 2)); pop(); }
  // horizontal dry-brush speed lines in screen space (k = strength 0..1, shift = how far they've slid)
  function speedLines(k, key, shift = 0, dir = -1, gap = null) {
    if (k < .04) return;
    boilSeed('speed' + key);
    for (let i = 0; i < 9; i++) {
      const y = 30 + i * 118 + 30 * hash(i * 3.1);
      if (gap && Math.abs(y - gap[0]) < gap[1]) continue;
      const L = 1100 * k * (.55 + .6 * hash(i * 1.3)), x0 = 200 + 1500 * hash(i * 7.7) + dir * shift * (.7 + .5 * hash(i));
      inkLine([[x0, y], [x0 - dir * L, y + 10 * (hash(i * 9.1) - .5)]], 2 + 4 * k, SPEED, 'dry', 0);
    }
  }
  // the ringing / dialling telephone's dial repainted at an angle (props.js phone() has a fixed dial)
  function dial(x, y, s, th) {
    boilSeed('dial' + x);
    const cx = x, cy = y - 14 * s;
    paint(ellPts(cx, cy, 17 * s, 11 * s, 18), { wash: JZ.cream, ink: JZ.ink, sw: .6 * s });
    for (let i = 0; i < 8; i++) { const a = -2.4 + i * .6 + th; paint(ellPts(cx + Math.cos(a) * 11 * s, cy + Math.sin(a) * 7 * s, 2.2 * s, 2 * s, 8), { wash: JZ.ink, ink: null }); }
    paint(ellPts(cx, cy, 4 * s, 2.8 * s, 10), { wash: JZ.verm, ink: JZ.ink, sw: .4 * s });
    return (i, th2 = th) => { const a = -2.4 + i * .6 + th2; return [cx + Math.cos(a) * 11 * s, cy + Math.sin(a) * 7 * s]; };
  }
  // a coiled telephone cord along a path; coil(k) = loop size at k (0 = taut)
  function coilCord(P, coil, sw, key, col = JZ.vermDk) {
    boilSeed('cord' + key);
    const C = through(P, 8), out = [];
    let d = 0;
    for (let i = 0; i < C.length; i++) {
      if (i) d += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]);
      const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      const r = coil(i / (C.length - 1)), ph = d / 16;
      out.push([C[i][0] + dx / L * r * .7 * Math.cos(ph) - dy / L * r * Math.sin(ph), C[i][1] + dy / L * r * .7 * Math.cos(ph) + dx / L * r * Math.sin(ph)]);
    }
    inkLine(out, sw * 1.6, JZ.ink, 'ink', .3);
    inkLine(out, sw, col, 'ink', .3);
  }
  // a clay arm (Clawd's nub) reaching from off-frame (x0, y0) to its tip (x1, y1), w thick
  function nubArm(x0, y0, x1, y1, w, key, o = {}) {
    boilSeed('nub' + key);
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, a = Math.atan2(dy, dx);
    if (o.sm) for (let i = 0; i < 3; i++) inkLine([[x1 - o.sm[0] * (1 + i * .5), y1 - o.sm[1] * (1 + i * .5) + (i - 1) * w * .3], [x1 - o.sm[0] * .2, y1 + (i - 1) * w * .3]], 3 - i * .6, mixCol(PAL.clay, JZ.ink, .2 + i * .2), 'dry', 0);
    push(); translate(x1, y1); rotate(a);
    paint(rrPts(-L, -w / 2, L + w * .12, w, w * .42), { wash: o.col || PAL.clay, fill: PAL.clayDk, fillOp: 70, tex: .5, ink: JZ.ink, sw: o.sw ?? 1.6 });
    paint(rectPts(-L, w * .1, L, w * .32), { fill: PAL.clayDk, fillOp: 90, bleed: .05, tex: .6, border: .4, ink: null });
    pop();
  }

  // ---------- E · "Where can you be, my love?" (11.90–19.57) ----------
  // The whip from D lands on the singer at the ribbon mic (cut on action). Eyes closed, singing into the light, cream
  // curls rising. As the line ends the singer opens its eyes and looks right; the camera follows the look to the empty
  // table (candle, red telephone, gardenia, empty chair) and holds there; only the flame moves.
  const TBL = { x: 2330, y: 880, s: 1.3 };
  function clubTable(t, o = {}) {
    const { x, y, s } = TBL;
    glow(x - 92 * s, y - 280 * s, 480 * s, '#FFC766', .4 * (o.flame ?? 1));
    chair(x + 265 * s, y, s * 1.05, { key: 'tbl' + (o.key || ''), col: JZ.wood });
    const top = cafeTable(x, y, s, { key: 'tbl' + (o.key || ''), col: mixCol(JZ.wood, JZ.ink, .35) });
    gard(x + 10 * s, top - 3 * s, 12 * s, .25, 'tbl');
    phone(x + 88 * s, top, s * .95, { key: 'tbl' + (o.key || '') });
    const fl = candle(x - 92 * s, top, s * 1.2, t, { key: 'tbl' + (o.key || ''), height: o.candleH ?? 1, flame: o.flame ?? 1 });
    return { top, flame: fl };
  }
  function clubRoom(tt, key) {
    ground(JZ.ink);
    boilSeed('E-wall');
    // the window behind the table: the blue night outside, rooftops and a telephone wire (it pays off in G)
    block(rectPts(1980, 120, 700, 520), JZ.blue, { ink: JZ.ink, sw: 2.6 });
    halftone('ramp', 2330, 430, 700, 520, JZ.blueDk, .6);
    block([[1990, 640], [1990, 520], [2130, 520], [2130, 470], [2260, 470], [2260, 545], [2420, 545], [2420, 430], [2520, 430], [2520, 500], [2670, 500], [2670, 640]], JZ.blueDk, { ink: null });
    inkLine([[1985, 300], [2675, 330]], 1.4, JZ.ink, 'inkfine', .4);
    inkLine([[2330, 120], [2330, 640]], 5, JZ.ink, 'ink', 0);
    inkLine([[1980, 380], [2680, 380]], 5, JZ.ink, 'ink', 0);
    // the stage curtain behind the singer, lit by the spot
    boilSeed('E-curtain');
    block(rectPts(-900, -400, 2560, 1260), JZ.blueDk, { ink: JZ.ink, sw: 2.4 });
    for (let i = 0; i < 12; i++) { const fx = -800 + i * 205; inkLine([[fx, -380], [fx + 18, 200], [fx - 10, 560], [fx + 12, 850]], 5, i % 2 ? JZ.ink : JZ.blue, 'ink', .6); }
    halftone('disc', 780, 520, 1200, 1000, JZ.blueLt, .22);
    halftone('ramp', 400, 760, 2600, 300, JZ.ink, .5);
    // the floor
    boilSeed('E-floor');
    block(rectPts(-900, 850, 4600, 420), JZ.ink2, { ink: null });
    halftone('ramp', 1400, 1000, 4600, 300, JZ.blueDk, .7);
    inkLine([[-900, 852], [3700, 852]], 2.2, JZ.ink, 'ink', 0);
    smoke(tt, -300, 40, 3400, 760, { key, n: 9, op: 22 });
  }
  function E(t, lt, dur) {
    const tt = lt < .3 ? t : onTwos(t);
    const arrive = seg(t, 11.9, 12.15), whip = 1 - easeOut(arrive);
    const tb = ease(seg(t, bt(9, 0), bt(9, 0) + 1.0));
    const cx = lerp(850 + 20 * ease(seg(t, 12.1, 16.1)), TBL.x + 40 + 20 * seg(t, 17.1, 19.6), tb) - 520 * whip;
    const cy = lerp(672 - 6 * ease(seg(t, 12.1, 16.1)), 640, tb), z = lerp(1.62 + .1 * ease(seg(t, 12.1, 16.1)), 1.42 + .05 * seg(t, 17.1, 19.6), tb);
    camBegin(cx, cy, z);
    clubRoom(tt, 'E');
    spotlight(620, -200, 800, 862, 700, { key: 'E' });
    // the singer: longing, eyes closed; on the held "my… love" it opens its eyes to the light and reaches out; as
    // the line ends it looks right, at the table
    const u = 36, x = 740, y = 858, lineEnd = 15.85;
    const base = { emote: null, gloom: .08, tintK: .2 };
    const mood = emotions(tt, [[0, 'sad', { ...base, eyes: 'closed' }], [14.55, 'sad', { ...base, eyes: 'sad', lookX: -.2, lookY: -.7 }], [lineEnd, 'sad', { ...base, eyes: 'sad', lookX: 1, lookY: .1 }]], { take: .5 });
    // the free arm: hangs, dips (anticipation), reaches up and out on "my", holds with a tremble through "love", falls
    const reach = kf(tt, [[12.0, -.7], [14.35, -.75], [14.62, -.95], [14.95, 1.05], [15.55, .9], [15.95, .45], [16.6, -.7]]) + .06 * Math.sin(tt * 11) * seg(tt, 14.95, 15.2) * (1 - seg(tt, 15.9, 16.1));
    const lean = kf(tt, [[12.1, 0], [12.35, -.05], [12.8, 0], [14.62, .03], [15.0, -.07], [15.9, -.05], [16.5, 0]]);
    const rise = -.25 * Math.sin(Math.PI * seg(tt, 12.2, 12.9)) - .3 * Math.sin(Math.PI * seg(tt, 14.7, 16.0));
    const sg = singer(x, y, u, tt, { ...mood, aL: reach, rot: (mood.rot || 0) + lean, dy: (mood.dy || 0) + rise, sq: (mood.sq || 0) - .05 * Math.sin(Math.PI * seg(tt, 14.8, 15.9)), boilKey: 'E-singer', key: 'E' });
    voiceCurls(sg.mouth[0] + 60, sg.mouth[1] - 30, tt, { s: 1.6, dx: 60, rise: 140 });
    clubTable(t, { key: 'E' });
    camEnd();
    // the whip lands (cut on action from D): speed lines sliding out as the camera brakes
    speedLines(whip, 'E', 900 * easeOut(arrive), -1);
  }

  // ---------- F · the bassist's fingers (19.57–21.29, bar 11) ----------
  // Extreme close-up: a clay nub plucks the thick strings, one walking note per beat, each sending a blue ripple
  // out across the frame. The last ripple swells into a blue wipe.
  const FS = { x: [810, 915, 1020, 1125], py: 560 };
  function F(t, lt, dur) {
    const notes = [0, 1, 2, 3].map(i => bt(11, i)), S = [3, 2, 1, 2], X = FS.x, PY = FS.py;
    ground(JZ.ink);
    camBegin(960 + 26 * lt, 520 - 12 * lt, 1.0 + .035 * lt, -.08);
    boilSeed('F-body');
    block([[140, -400], [230, 60], [330, 470], [250, 860], [60, 1500], [2300, 1500], [2300, -400]], JZ.wood, { ink: JZ.ink, sw: 2.6, curv: .5, tex: 50 });
    paint(ellPts(560, 700, 360, 500, 24), { fill: JZ.woodLt, fillOp: 80, bleed: .2, tex: .7, border: .8, ink: null });
    halftone('ramp', 1500, 900, 1400, 900, JZ.ink, .35);
    // the f-hole
    boilSeed('F-fhole');
    inkLine([[1540, 170], [1600, 330], [1520, 560], [1590, 790]], 16, JZ.ink, 'ink', .7);
    for (const [fx, fy] of [[1540, 160], [1592, 800]]) paint(ellPts(fx, fy, 20, 20, 12), { wash: JZ.ink, ink: null });
    // the fingerboard's end
    boilSeed('F-board');
    block([[740, -400], [1190, -400], [1180, 440], [750, 440]], JZ.ink2, { ink: JZ.ink, sw: 2.2 });
    inkLine([[760, 436], [1172, 436]], 3, mixCol(JZ.ink2, JZ.cream, .3), 'inkfine', 0);
    // which note is sounding / gripped
    let ni = -1; for (let i = 0; i < 4; i++) if (t >= notes[i] - .2) ni = i;
    const pull = i => { if (i < 0) return 0; return t < notes[i] ? 58 * ease(seg(t, notes[i] - .2, notes[i])) : 0; };
    // strings: pulled into a V while gripped, then ringing (a smear of ghost strings while the swing is wide)
    for (let j = 0; j < 4; j++) {
      boilSeed('F-str' + j);
      let off = 0, amp = 0;
      for (let i = 0; i < 4; i++) if (S[i] === j) {
        if (t >= notes[i] - .2 && t < notes[i]) off = pull(i);
        else if (t >= notes[i]) { const a = t - notes[i]; amp = 44 * Math.exp(-a * 4.5); off = amp * Math.sin(a * 62); }
      }
      if (j === S[0] && t < notes[1] - .2) { const a = t - notes[0]; amp = 44 * Math.exp(-a * 4.5); off = amp * Math.sin(a * 62); }
      const P = [[X[j] - 30, -400], [X[j] + off, PY], [X[j] + 26, 1500]];
      if (amp > 8) for (const s of [-1, 1]) inkLine([[X[j] - 30, -400], [X[j] + s * amp, PY], [X[j] + 26, 1500]], 4, mixCol(JZ.smoke, JZ.wood, .5), 'dry', .5);
      inkLine(P, 11, JZ.ink, 'ink', amp > 2 ? .5 : 0);
      inkLine(P, 6.5, j < 2 ? '#CFC8B8' : JZ.brassLt, 'ink', amp > 2 ? .5 : 0);
    }
    // the plucking nub: grips a string, drags it, lets it snap, follows through, moves on to the next string
    const keys = [];
    for (let i = 0; i < 4; i++) {
      const xs = X[S[i]];
      if (i > 0) { keys.push([notes[i] - .2, xs + 30]); keys.push([notes[i], xs + 88]); }
      else keys.push([notes[0] - .01, xs + 88]);
      keys.push([notes[i] + .08, xs + 250]);
      keys.push([i < 3 ? notes[i + 1] - .3 : notes[i] + .4, i < 3 ? X[S[i + 1]] + 120 : xs + 330]);
    }
    const nx = kf(t, keys, easeOut), snap = keys.some(([k0], q) => false);
    const since = t - notes[Math.max(0, ni)], fast = since > 0 && since < .09;
    const ny = PY + 30 - 40 * hitK(since, 9);
    nubArm(2300, ny + 380, nx, ny, 170, 'F', { sw: 2.2, sm: fast ? [170, 0] : null });
    // the ripples: one per note, from where the string was plucked
    notes.forEach((n, i) => ripples(X[S[i]], PY, [t - n], { speed: 950, life: 1.25, sw: 8, rings: 2, gap: 70, r0: 30, key: 'F' + i }));
    const wc = toScreen(X[S[3]], PY);
    camEnd();
    // out: the last ripple swells into a blue wipe
    const wk = easeIn(seg(t, notes[3] + .12, barT(12)));
    if (wk > 0) { const r = 2300 * wk; boilSeed('F-wipe'); paint(ellPts(wc[0], wc[1], r, r, 40), { wash: JZ.blue, ink: JZ.ink, sw: 3 }); inkLine(ellPts(wc[0], wc[1], r * .82, r * .82, 40).concat([[wc[0] + r * .82, wc[1]]]), 6, JZ.blueLt, 'ink', .5); }
  }

  // ---------- G · "Why don't you answer your phone?" (21.29–28.18, bars 12–15) ----------
  // G1: the red phone on the table, close. The singer's nubs lift the receiver and dial (the dial winds and runs back).
  // The camera follows the cord off the table, up the wall and through the window: the coils pull taut into a straight
  // line (the match cut, 24.31) ...
  const PH = { x: 760, y: 700, s: 4.6 };
  function G1(t, lt, dur) {
    const tt = onTwos(t), s = PH.s;
    const pan = easeIn(seg(t, 23.35, bt(13, 3)));
    const cx = lerp(790 + 20 * seg(t, 21.3, 23.35), 2300, pan), cy = lerp(520, 548, pan), z = lerp(1.22 + .05 * ease(seg(t, 21.3, 23.35)), 1.0, pan);
    camBegin(cx, cy, z);
    ground(JZ.ink);
    boilSeed('G-wall');
    block(rectPts(-600, -400, 3600, 1100), JZ.ink2, { ink: null });
    halftone('ramp', 1300, 300, 3600, 900, JZ.ink, .5, Math.PI);
    // the window onto the night, the cord's way out
    block(rectPts(1780, 110, 1000, 470), JZ.blue, { ink: JZ.ink, sw: 3.4 });
    halftone('ramp', 2280, 350, 1000, 470, JZ.blueDk, .7);
    block([[1790, 580], [1790, 470], [1960, 470], [1960, 400], [2110, 400], [2110, 500], [2330, 500], [2330, 350], [2460, 350], [2460, 450], [2770, 450], [2770, 580]], JZ.blueDk, { ink: null });
    inkLine([[2280, 110], [2280, 580]], 7, JZ.ink, 'ink', 0);
    block(rectPts(1750, 575, 1060, 34), JZ.ink, { ink: null });
    candleFlame(90, 410, 3.4, t, { flame: 1, light: .9 });
    boilSeed('G-candle');
    paint(rectPts(58, 420, 70, 280), { wash: JZ.cream, fill: JZ.smoke, fillOp: 60, ink: JZ.ink, sw: 2.2 });
    paint(ellPts(93, 700, 110, 26, 16), { wash: JZ.mustard, ink: JZ.ink, sw: 2.2 });
    // the tabletop
    boilSeed('G-table');
    block(rectPts(-600, 700, 2150, 60), JZ.cream, { ink: JZ.ink, sw: 2.4 });
    block(rectPts(-600, 760, 2150, 30), mixCol(JZ.cream, JZ.ink, .4), { ink: null });
    gard(1210, 694, 30, .2, 'G');
    // the cord: coiled on the table, off the edge, up the wall, pulled taut along the sill and out of the window
    const cord0 = [PH.x + 40 * s, PH.y - 6 * s];
    coilCord([cord0, [cord0[0] + 180, PH.y - 4], [1400, PH.y - 6], [1560, 730], [1640, 700], [1700, 600], [1790, 560], [2100, 552], [2600, 548], [3100, 546]], k => k < .55 ? 16 : k < .8 ? 16 * (1 - (k - .55) / .25) : 0, 5, 'G1');
    // the receiver, lifted by one nub; the other nub dials
    const lift = ease(seg(tt, 21.42, 21.75)) * (1 - ease(seg(tt, 23.25, 23.5)) * 0);
    const d1 = seg(tt, 21.95, 22.3), r1 = seg(tt, 22.3, 22.62), d2 = seg(tt, 22.78, 23.02), r2 = seg(tt, 23.02, 23.24);
    const th = t < 22.62 ? 2.1 * ease(d1) * (1 - easeOut(r1)) : 1.2 * ease(d2) * (1 - easeOut(r2));
    const recv = [PH.x, PH.y - 38 * s - 50 * s * lift], lr = -.4 * lift;
    const rl = [recv[0] - 44 * s * Math.cos(lr), recv[1] - 44 * s * Math.sin(lr)];
    coilCord([[PH.x - 40 * s, PH.y - 8 * s], [PH.x - 60 * s, PH.y - 30 * s], rl], k => 11 * Math.sin(Math.PI * k) + 2, 4, 'G-recv');
    phone(PH.x, PH.y, s, { lift, key: 'G' });
    const hole = dial(PH.x, PH.y, s, th);
    // the receiver hand from above
    if (lift > .02) nubArm(recv[0] - 300, -500, recv[0] + 10, recv[1] - 50, 110, 'G-hold', { sw: 2 });
    // the dialling nub from the lower left: reaches in, hooks a hole, winds it, lets go
    const inK = ease(seg(tt, 21.6, 21.95)) * (1 - ease(seg(tt, 23.24, 23.55)));
    if (inK > .01) {
      const hIdx = t < 22.7 ? 6 : 3, thH = t < 22.62 ? 2.1 * ease(d1) : 1.2 * ease(d2);
      const released = (t > 22.3 && t < 22.7) || t > 23.02;
      let tip = hole(hIdx, released ? (t < 22.7 ? 2.1 : 1.2) : thH);
      if (t > 22.62 && t < 22.78) { const a = hole(6, 2.1), b = hole(3, 0); const k = ease(seg(t, 22.62, 22.78)); tip = [lerp(a[0], b[0], k), lerp(a[1], b[1], k) - 30 * Math.sin(Math.PI * k)]; }
      const off = [-900, 1400];
      nubArm(tip[0] + off[0] * (1 - inK * .72) - 120, tip[1] + off[1] * (1 - inK * .72) + 60, lerp(tip[0] - 600, tip[0], inK), lerp(tip[1] + 700, tip[1], inK), 60, 'G-dial', { sw: 1.8 });
    }
    camEnd();
    // in: the blue ripple from F passes over the frame and opens
    const ik = seg(lt, 0, .42);
    if (ik < 1) { const r = 2200 * easeOut(ik), c = [900, 470]; iris(c[0], c[1], r, JZ.blue); boilSeed('G-ring'); inkLine(ellPts(c[0], c[1], r + 30, r + 30, 44).concat([[c[0] + r + 30, c[1]]]), 7 * (1 - ik) + 1, JZ.blueLt, 'ink', .5); }
    if (pan > .3) speedLines(pan * .8, 'G1', 900 * pan, -1, [540, 150]);
  }
  // G2: ... outside, the line is a telephone wire: it runs over the rooftops to a lit phone booth on a corner,
  // ringing, the receiver jiggling. Nobody there.
  const BOOTH = { x: 3300, y: 900, s: 1.12 };
  const ringOn = t => { const b = bpOf(t) - 4 * Math.floor(bpOf(t) / 4); return b < 1.6 ? .6 + .4 * Math.abs(Math.sin(b * Math.PI * 3)) : 0; };
  function G2(t, lt, dur) {
    const tt = onTwos(t), v0 = 3 * 1490 / (bt(13, 3) - 23.35);       // the pan's speed at the cut (px/s)
    const T1 = 1.7, u = seg(t, t - lt, t - lt + T1);
    const out = easeIn(seg(t, 27.72, barT(16)));
    const cx = herm(u, 700, BOOTH.x + 60, v0 * T1, 0) + 700 * out, cy = lerp(490, 650, ease(seg(lt, .5, T1 + .3))), z = lerp(1.0, 1.42, ease(seg(lt, .5, T1 + .6))) + .03 * seg(t, 26, 28);
    camBegin(cx, cy, z);
    ground(JZ.blue, { tex: 20 });
    boilSeed('G2-sky');
    halftone('ramp', 2000, 250, 5200, 700, JZ.blueDk, .75, Math.PI);
    for (let i = 0; i < 26; i++) { const sx = -400 + hash(i * 4.4) * 5000, sy = 60 + hash(i * 8.1) * 300; paint(starPts(sx, sy, 6 + 5 * hash(i), .35, 4), { wash: JZ.cream, washOp: 200, ink: null }); }
    // rooftops
    const roofs = [[-600, 560], [-150, 640], [260, 520], [700, 610], [1080, 480], [1500, 590], [1900, 540], [2350, 650], [2750, 700]];
    roofs.forEach(([rx, ry], i) => { boilSeed('G2-roof' + i); block(rectPts(rx, ry, 470, 900), i % 2 ? JZ.blueDk : JZ.ink2, { ink: JZ.ink, sw: 1.4 }); for (let j = 0; j < 3; j++) if (hash(i * 3 + j) > .5) paint(rectPts(rx + 60 + j * 130, ry + 70, 40, 60), { wash: JZ.mustLt, ink: null }); });
    // the street and the corner
    boilSeed('G2-street');
    block(rectPts(2900, 900, 2200, 400), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    block(rectPts(2900, 880, 2200, 26), mixCol(JZ.blueDk, JZ.cream, .15), { ink: JZ.ink, sw: 1.2 });
    building(3700, 890, 900, 590, { col: JZ.blueDk, key: 'G2b', seed: 3, roof: true });
    // poles and the wire (one line from the window to the booth)
    boilSeed('G2-wire');
    for (const px of [1250, 2650]) {
      paint(rectPts(px - 9, 420, 18, 900), { wash: JZ.ink, ink: null });
      paint(rectPts(px - 80, 430, 160, 14), { wash: JZ.ink, ink: null });
      for (const ix of [-62, 62]) paint(ellPts(px + ix, 424, 8, 10, 10), { wash: JZ.cream, ink: JZ.ink, sw: 1 });
    }
    const wire = []; const WP = [[-800, 460], [1250, 440], [2650, 440], [BOOTH.x + 10, 900 - 405 * BOOTH.s]];
    for (let q = 0; q < WP.length - 1; q++) for (let k = 0; k <= 10; k++) { const a = WP[q], b = WP[q + 1], f = k / 10; wire.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f) + 60 * Math.sin(Math.PI * f)]); }
    inkLine(wire, 8, JZ.ink, 'ink', .4);
    inkLine(wire, 5, JZ.vermDk, 'ink', .4);
    // the booth: lit, ringing on the first two beats of every bar
    const rg = t > 24.74 ? ringOn(t) : 0;
    glow(BOOTH.x, BOOTH.y - 200, 700, '#FFD27A', .35);
    halftone('disc', BOOTH.x, BOOTH.y + 10, 900, 120, JZ.mustLt, .5);
    const bp = phoneBooth(BOOTH.x, BOOTH.y, BOOTH.s, { lit: true, ring: rg, key: 'G2' });
    // big painted ring marks, jumping out on every ring
    if (rg > .05) { boilSeed('G2-ring'); for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const a = (sd > 0 ? 0 : Math.PI) + (i - 1) * .5, r0 = 120, r1 = 175 + 25 * rg; inkLine([[bp[0] + Math.cos(a) * r0 * sd * sd, bp[1] - 30 + Math.sin(a) * r0], [bp[0] + Math.cos(a) * r1, bp[1] - 30 + Math.sin(a) * r1]], 7 * rg, JZ.cream, 'ink', 0); } }
    camEnd();
    if (lt < .3) speedLines(.8 * (1 - lt / .3), 'G2', 600 * lt / .3, -1, [540, 150]);
    if (out > .1) speedLines(out, 'G2o', 900 * out, -1);
  }


  // ---------- H · "Have you vanished from my life?" (28.18–35.06, bars 16–19) ----------
  // The pan carries on down a side-on street at night. On every snare backbeat a street lamp lights with a burst of
  // red shards, marching right; far ahead a small rose silhouette walks to the corner, turns into the side street and is
  // gone just before the last lamp lights the empty corner. A petal of its gardenia drifts down where it was.
  const LAMPS = [0, 1, 2, 3, 4].map(i => ({ x: 900 + i * 520, at: B(4 * 16 + 3 + 2 * i) }));
  const CORNER = 3300;
  // a bigger street lamp than props.js streetLamp (its head doesn't scale): a cone of light and a pool when on
  function lamp(x, y, h, on, key) {
    boilSeed('lamp' + key);
    const hx = x + 70, hy = y - h + 18;
    if (on > .01) {
      paint([[hx - 30, hy + 10], [hx + 30, hy + 10], [hx + 190, y], [hx - 190, y]], { wash: JZ.mustLt, washOp: 40 * on, fill: JZ.mustLt, fillOp: 30 * on, bleed: .06, tex: .4, border: .5, ink: null });
      paint(ellPts(hx, y + 4, 210, 22, 24), { wash: JZ.mustLt, washOp: 110 * on, ink: null });
      halftone('disc', hx, y + 4, 520, 70, JZ.mustLt, .6 * on);
      glow(hx, hy + 20, 330 * on, '#FFC766', .9 * on);
    }
    paint(rectPts(x - 7, y - h, 14, h), { wash: JZ.ink, ink: null });
    paint(ellPts(x, y, 22, 7, 12), { wash: JZ.ink, ink: null });
    inkLine([[x, y - h + 4], [x + 30, y - h - 24], [x + 70, y - h - 6]], 8, JZ.ink, 'ink', .5);
    paint([[hx - 34, hy + 8], [hx - 18, hy - 22], [hx + 18, hy - 22], [hx + 34, hy + 8]], { wash: JZ.ink2, ink: JZ.ink, sw: 1.6 });
    paint(ellPts(hx, hy + 9, 26, 9, 14), { wash: on > .5 ? JZ.cream : mixCol(JZ.ink2, JZ.cream, .2), ink: JZ.ink, sw: 1 });
    return [hx, hy];
  }
  function lampOn(t, at) { if (t < at) return 0; const a = t - at; return clamp(a / .05) * (a < .16 ? .55 + .45 * Math.abs(Math.cos(a * 40)) : 1); }
  function H(t, lt, dur) {
    const tt = onTwos(t), t0 = t - lt;
    // the pan from G2 lands (a braking offset), then glides with the lamps as they light, and settles on the corner
    const cx = 900 + 2140 * ease(seg(t, 28.5, 33.4)) - 900 * (1 - easeOut(seg(t, t0, t0 + .6))) + 16 * seg(t, 33.4, 35.1);
    camBegin(cx, 668, 1.55);
    ground(JZ.blueDk, { tex: 20 });
    boilSeed('H-sky'); halftone('ramp', 1800, 330, 6000, 400, JZ.ink, .6, Math.PI);
    for (let i = 0; i < 30; i++) { boilSeed('H-star' + i); const sx = -400 + hash(i * 4.4) * 4400, sy = 330 + hash(i * 8.1) * 150, tw = .6 + .4 * Math.sin(t * 2 + i); paint(starPts(sx, sy, (5 + 4 * hash(i)) * tw, .35, 4), { wash: JZ.cream, washOp: 200, ink: null }); }
    // the far row and the street front
    const far = [[-420, 500], [60, 560], [520, 470], [980, 530], [1420, 480], [1880, 550], [2340, 460], [2800, 520], [3260, 490], [3720, 540]];
    far.forEach(([bx, by], i) => building(bx, 870, 470, 870 - by, { col: i % 2 ? mixCol(JZ.blue, JZ.ink, .25) : mixCol(JZ.blue, JZ.ink, .5), key: 'Hb' + i, cell: 60, lit: id => hash(id * 2.3 + i * 17) > .9 ? .75 : 0, roof: i % 3 === 0 }));
    boilSeed('H-street');
    block(rectPts(-1000, 870, 5800, 34), mixCol(JZ.blueDk, JZ.cream, .18), { ink: JZ.ink, sw: 1.4 });
    block(rectPts(-1000, 904, 5800, 400), JZ.ink2, { ink: null });
    for (let i = 0; i < 14; i++) paint(rectPts(-900 + i * 420, 990, 180, 12), { wash: mixCol(JZ.ink2, JZ.cream, .25), ink: null });
    // the side street at the corner: a gap of dark, a faint far lamp
    boilSeed('H-gap');
    block(rectPts(CORNER - 250, 380, 250, 492), JZ.ink2, { ink: null });
    glow(CORNER - 120, 600, 120, '#FFC766', .25);
    // lamps: light on the backbeats, with a burst of shards
    LAMPS.forEach((L, i) => {
      const on = lampOn(t, L.at), hd = lamp(L.x, 872, 380, on, 'H' + i);
      shards(hd[0], hd[1], t - L.at, 40 + i, { n: 9, dist: 190, size: 24, life: .75, dir: -Math.PI / 2, spread: 4.4 });
    });
    // the silhouette: walks to the corner ahead of the lights, turns up the side street, gone as the last lamp lights
    const ut = 15, w0 = 30.4, w1 = 32.35, w2 = 32.95;
    if (t > w0 && t < w2) {
      const inSide = seg(t, w1 + .15, w2), x = t < w1 ? lerp(2500, CORNER - 190, seg(t, w0, w1)) : lerp(CORNER - 190, CORNER - 60, inSide);
      const y = 872 - 40 * inSide, uu = ut * (1 - .2 * inSide);
      const tv = t < w1 ? { view: 'side' } : turn(tt, w1, w1 + .16, .25, .5);
      lover(x, y, uu, { ...tv, walk: (tt - w0) * 1.6, dy: -.25 * Math.abs(Math.sin((tt - w0) * 1.6 * TAU)), boilKey: 'H-lover' });
    }
    // the corner building, in front of the side street
    building(CORNER, 872, 900, 480, { col: mixCol(JZ.blue, JZ.ink, .35), key: 'Hc', cell: 60, lit: id => id === 3 || id === 8 ? .75 : 0, roof: true });
    // the petal it leaves behind, drifting down to the pavement
    const pk = seg(tt, 33.0, 34.5);
    if (pk > 0) { boilSeed('H-petal'); const px = CORNER - 110 - 150 * pk + 30 * Math.sin(pk * 9), py = lerp(700, 884, easeOut(pk)), rr = Math.sin(pk * 11) * .8; paint(ellPts(px, py, 18, 8 + 5 * Math.abs(Math.cos(pk * 11)), 12, 0, rr), { wash: JZ.cream, ink: JZ.ink, sw: 1.1 }); }
    camEnd();
    if (lt < .35) speedLines(.8 * (1 - lt / .35), 'H', 500 * lt / .35, -1);
  }

  // ---------- I1 · the drummer (35.06–38.94, bars 20–22) ----------
  // The drummer's intro: the full kit, brushes. Ride on the beats and the swung "and"s, the brush slaps the snare on
  // 2 and 4 and red shards fly. In the last bar a piano run steps in as a falling line of tiles above the kit: the
  // staircase of the next shot.
  const DR = { x: 960, y: 980, u: 44 };
  const STEP = { x0: 170, y0: 300, dx: 142, dy: 50, n: 11, w: 132 };
  function hitsIn(t0, t1, pattern) { const out = []; for (let b = Math.floor(bpOf(t0)) - 1; b <= bpOf(t1) + 1; b++) for (const p of pattern(b)) out.push(B(b + p)); return out.sort((a, b) => a - b); }
  // swing a limb between hits: returns { q: 0 at a hit .. 1 at the top, smear }
  function swingBetween(t, hits) {
    let prev = -9, next = 9e9; for (const h of hits) { if (h <= t) prev = h; else { next = h; break; } }
    const span = Math.min(next - prev, .6), q = t - prev < span ? (t - prev) / span : 1;
    const up = q < .35 ? easeOut(q / .35) : 1 - easeIn(seg(t, next - span * .45, next));
    return { up: clamp(up), age: t - prev, smear: (next - t) < .06 && (next - t) > 0 ? 1 : 0 };
  }
  function I1(t, lt, dur) {
    const tt = onTwos(t);
    ground(JZ.ink);
    camBegin(985 + 12 * Math.sin(lt * .7), 690 - 6 * lt, 1.48 + .03 * lt);
    boilSeed('I1-disc');
    block(ellPts(985, 640, 610, 610, 56), JZ.blue, { ink: JZ.ink, sw: 2 });
    halftone('disc', 1080, 720, 1000, 1000, JZ.blueDk, .5);
    block(rectPts(-400, 980, 2800, 400), JZ.ink2, { ink: null });
    glow(960, 300, 700, '#FFE2A8', .35);
    smoke(tt, 0, 80, 1920, 800, { key: 'I1', n: 6, op: 20 });
    const ride = hitsIn(t - 1, t + 1, b => (((b % 4) + 4) % 4) % 2 ? [0, .67] : [0]);
    const snare = hitsIn(t - 1, t + 1, b => (((b % 4) + 4) % 4) % 2 ? [0] : []);
    const R = swingBetween(tt, ride), S = swingBetween(tt, snare);
    const ks = DR.u / 34;
    const body = { dy: -.15 * hitK(S.age, 7), sq: .05 * hitK(S.age, 8), rot: .03 * Math.sin(bpOf(tt) * Math.PI / 2) };
    // the snare stroke: the brush lifts high after each backbeat, hangs, whips down (a smear frame) and slaps the head
    const LA = { a: -.2 + 1.25 * S.up, sa: 2.79 + .5 * S.up + .08 * Math.sin(tt * 7) * (1 - S.up), smear: S.smear };
    const kit = drummer(DR.x, DR.y, DR.u, tt, {
      ...feel('cool', tt), eyes: 'closed', mouth: null, emote: null, brushes: true, ks, ...body,
      left: LA,
      right: { a: 1.0 + .2 * R.up, sa: .75 - .35 * R.up, smear: R.smear }, seat: 4.0,
      hit: { snare: S.age, ride: R.age, kick: agesAt(tt, [B(80), B(82), B(84), B(86)]).pop() },
      boilKey: 'I1-drummer', key: 'I1',
    });
    // the brush hand, repainted over the kit (drummer() paints the kit over its arms, which hides the brush on the snare)
    {
      const u = DR.u, sw = clamp(u / 15, .45, 2.4), by = DR.y - 4.0 * u + body.dy * u, c = Math.cos(body.rot), sn = Math.sin(body.rot);
      const lx = -4.9 * u * (1 + body.sq * .6), ly = -4.5 * u * (1 - body.sq);
      boilSeed('I1-hand');
      push(); translate(DR.x + lx * c - ly * sn, by + lx * sn + ly * c); rotate(LA.a + body.rot);
      paint(rectPts(-2.2 * u, -.5 * u, 2.2 * u, u, u * .04), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
      translate(-2.2 * u, 0); scale(-1, 1); stick(u, sw, { a: LA.sa, brush: true, smear: LA.smear, dir: 1, len: 4.6 });
      pop();
    }
    // the hit: the head flashes and rings
    { const k = hitK(S.age, 9); if (k > .05) { boilSeed('I1-slap'); glow(kit.snare[0], kit.snare[1], 160 * k, '#FFF1C8', .9 * k); inkLine(ellPts(kit.snare[0], kit.snare[1], (80 + 70 * (1 - k)) * ks, (16 + 14 * (1 - k)) * ks, 26).concat([[kit.snare[0] + (80 + 70 * (1 - k)) * ks, kit.snare[1]]]), 4 * k, JZ.cream, 'ink', .5); } }
    // the downstroke smear: dry-brush streaks along the brush's path in the two frames before the hit
    { const nx = snare.find(h => h > tt); const d = nx ? nx - tt : 9; if (d < .09) { boilSeed('I1-smear'); const hx = kit.snare[0] - 20 * ks, hy = kit.snare[1] - 40 * ks; for (let i = 0; i < 4; i++) inkLine([[hx - 120 * ks + i * 18, hy - 150 * ks + i * 8], [hx - 60 * ks + i * 12, hy - 60 * ks], [hx + i * 12, hy]], 3.2 - i * .6, mixCol(JZ.cream, JZ.blue, .15 + i * .15), 'dry', .6); } }
    shimmer(kit.ride[0], kit.ride[1], 150 * ks, 26 * ks, R.age, { key: 'I1' });
    snare.forEach((h, i) => shards(kit.snare[0], kit.snare[1] - 6, tt - h, 60 + Math.round(h * 7), { n: 9, dist: 300, size: 30, life: .8, dir: -Math.PI / 2 - .25, spread: 2.8 }));
    camEnd();
    // the piano run: tiles step down across the top of the frame in triplets, in the last bar (screen space, laid
    // exactly where I2's key tops are)
    stepTiles(tt, i => B(4 * 21 + 1 + i / 3), { lit: false });
  }
  // the falling line of piano tiles (I1) that becomes the staircase of keys (I2): tile i appears at when(i)
  function stepTiles(t, when, o = {}) {
    for (let i = 0; i < STEP.n; i++) {
      const a = t - when(i); if (a < 0) continue;
      boilSeed('stile' + i);
      const k = backOut(clamp(a / .18)), x = STEP.x0 + i * STEP.dx, y = STEP.y0 + i * STEP.dy - 60 * (1 - k), c = STEP.w * clamp(k, 0, 1.2);
      const col = i % 2 ? JZ.ink : JZ.cream;
      paint(rectPts(x + (STEP.w - c) / 2, y, c, c * .45), { wash: col, ink: i % 2 ? JZ.cream : JZ.ink, sw: 1.4 });
    }
  }

  // ---------- I2 · "Are you trying to run away" (38.94–41.96, bars 22–23) ----------
  // Cut on beat 2: the tiles are the tops of a staircase of piano keys. The rose silhouette runs down it, one key per
  // eighth, and each key lights as it's touched (a run up the keyboard, played by its feet).
  const KEYH = 520;
  const BLACK = [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1];
  // key i's rectangle (k: 0 = staircase, 1 = laid flat into a zebra stripe)
  function keyRect(i, k) {
    const x0 = STEP.x0 + i * STEP.dx, y0 = STEP.y0 + i * STEP.dy;
    const x1 = 180 + i * 150, y1 = 250, w1 = 84, h1 = 590;
    return [lerp(x0, x1, k), lerp(y0, y1, k), lerp(STEP.w, w1, k), lerp(KEYH, h1, k)];
  }
  const hopT = i => B(4 * 22 + 2 + i * .5);
  const keyLit = (t, i) => { const a = t - hopT(i); return a < 0 ? 0 : a < .06 ? 1 : Math.max(.35, 1 - (a - .06) / .9); };
  function keysStair(t, kOf, o = {}) {
    for (let i = 0; i < STEP.n; i++) {
      const k = kOf(i), [x, y, w, h] = keyRect(i, k), lit = o.lit ? o.lit(i) : 0;
      boilSeed('key' + i);
      if (lit > .02) glow(x + w / 2, y + 20, 200 * lit, '#FFD27A', .8 * lit);
      block(rectPts(x, y, w, h), lit > .5 ? JZ.mustLt : mixCol(JZ.cream, JZ.mustLt, lit * 2), { ink: JZ.ink, sw: 2 });
      if (k < .05) inkLine([[x + 6, y + 8], [x + w - 6, y + 8]], 2, JZ.paper, 'inkfine', 0);
    }
    // the black keys, sitting on the lower key against the higher one's side
    for (let i = 0; i < STEP.n - 1; i++) {
      if (!BLACK[i]) continue;
      const k = kOf(i), [x, y, w] = keyRect(i, k), [, y2] = keyRect(i + 1, k), sh = 1 - ease(clamp(k * 1.6));
      if (sh < .02) continue;
      boilSeed('bkey' + i);
      block(rectPts(x + w * .66, y2, w * .68, (KEYH * .5) * sh), JZ.ink, { ink: JZ.ink, sw: 1.4 });
    }
  }
  function I2(t, lt, dur) {
    const tt = onTwos(t);
    ground(JZ.blue, { tex: 20 });
    boilSeed('I2-sky'); halftone('ramp', 960, 700, 2200, 900, JZ.blueDk, .8);
    const cf = ease(seg(lt, .25, dur));
    camBegin(960 + 80 * cf, 540 + 90 * cf, 1);
    keysStair(tt, () => 0, { lit: i => keyLit(tt, i) });
    // the runner: hops from key top to key top, one per eighth, then off to the right
    const u = 19;
    if (tt > hopT(-1) - .1) {
      let x, y, sq = 0;
      const n = STEP.n;
      const top = i => { const [kx, ky, kw] = keyRect(clamp(i, 0, n - 1), 0); return [kx + kw / 2 + (i >= n ? (i - n + 1) * 300 : 0), ky + (i >= n ? 0 : 0)]; };
      let i = -1; while (i < n + 2 && tt >= hopT(i + 1)) i++;
      const a = hopT(i), b = hopT(i + 1), q = seg(tt, a, b), p0 = i < 0 ? [top(0)[0] - 300, top(0)[1]] : top(i), p1 = top(i + 1);
      const P = arcPt(p0, p1, 70, ease(q)); x = P[0]; y = P[1];
      sq = q < .2 ? .18 * (1 - q / .2) : q > .85 ? -.08 : -.1;
      lover(x, y, u, { view: 'side', walk: q * .5 + i * .5, sq, dy: 0, rot: .12, aL: .8, boilKey: 'I2-lover' });
    }
    camEnd();
  }


  // ---------- J · "Leaving nothing left to say" (41.96–48.42, bars 24–27) ----------
  // The keys lie down, one after another, into the stripes of a zebra crossing seen from above. An empty crossing at
  // night; a single gardenia petal drifts down onto the stripes. The light changes to walk, and nobody walks. The wind
  // turns the petal over; the camera leans in on it, then rises off, faster and faster, over the roofs.
  const PET = { x: 1047, y: 600 };
  function J(t, lt, dur) {
    const t0 = t - lt, T0 = t0, tt = lt < 1.1 ? t : onTwos(t);
    const kOf = i => ease(seg(t, T0 + i * .045, T0 + .45 + i * .045)), kAll = ease(seg(t, T0, T0 + .95));
    const push = ease(seg(tt, 45.6, 46.6)), rise = easeIn(seg(t, 47.2, t0 + dur));
    const z = lerp(1, 1.75, push) * Math.pow(.26 / 1.75, rise), cx = lerp(960, PET.x, push) + 80 * (1 - kAll), cy = lerp(540, PET.y, push) + 90 * (1 - kAll);
    ground(mixCol(JZ.blue, JZ.ink2, kAll), { tex: 20 });
    if (kAll < 1) { boilSeed('I2-sky'); halftone('ramp', 960, 700, 2200, 900, JZ.blueDk, .8 * (1 - kAll)); }
    camBegin(cx, cy, z);
    // roofs around the junction (only seen as the camera rises)
    if (rise > 0) for (let i = 0; i < 16; i++) {
      boilSeed('J-roof' + i);
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2), bx = side < 0 ? -2600 + hash(i) * 300 : 2250 + hash(i) * 300, by = -3000 + row * 820;
      block(rectPts(bx, by, 2200, 700), [JZ.blueDk, JZ.ink, mixCol(JZ.blue, JZ.ink, .4)][i % 3], { ink: JZ.ink, sw: 3 });
      paint(rectPts(bx + 300 + hash(i * 3) * 1200, by + 200, 160, 160), { wash: JZ.ink2, ink: JZ.ink, sw: 2 });
    }
    // the pavements slide in as the stairs lie down
    const pv = mixCol(JZ.blueDk, JZ.cream, .2);
    boilSeed('J-pave');
    block(rectPts(-1800 - 900 * (1 - kAll), -3200, 1920, 7400), pv, { ink: null });
    block(rectPts(1800 + 900 * (1 - kAll), -3200, 1800, 7400), pv, { ink: null });
    if (kAll > .05) {
      inkLine([[120 - 900 * (1 - kAll), -3200], [120 - 900 * (1 - kAll), 4200]], 10, JZ.cream, 'ink', 0);
      inkLine([[1800 + 900 * (1 - kAll), -3200], [1800 + 900 * (1 - kAll), 4200]], 10, JZ.cream, 'ink', 0);
    }
    // lane dashes up and down the road, and the stop lines
    const mk = ease(seg(t, T0 + .7, T0 + 1.1));
    if (mk > 0) { boilSeed('J-marks'); for (let j = -8; j < 10; j++) { const y = j * 260; if (y > 120 && y < 900) continue; paint(rectPts(952, y + 40, 16, 150 * mk), { wash: JZ.cream, ink: null }); } for (const y of [190, 900]) paint(rectPts(160, y, 1600 * mk, 14), { wash: JZ.cream, washOp: 200, ink: null }); }
    keysStair(t, kOf, { lit: i => keyLit(t, i) * (1 - kOf(i)) });
    // the signal on the far pavement (slides in with it): red, then walk
    const walk = t >= 44.545, sig = [1846 + 900 * (1 - kAll), 130];
    boilSeed('J-signal');
    glow(sig[0], sig[1] + 150, 460, walk ? '#9FD08A' : '#FF7A5C', .6 * mk);
    paint(rrPts(sig[0] - 50, sig[1], 100, 250, 22), { wash: JZ.ink, ink: JZ.ink, sw: 2 });
    paint(ellPts(sig[0], sig[1] + 66, 34, 34, 16), { wash: walk ? JZ.ink2 : JZ.verm, ink: JZ.ink, sw: 1.2 });
    paint(ellPts(sig[0], sig[1] + 180, 34, 34, 16), { wash: walk ? mixCol(JZ.leaf, JZ.cream, .35) : JZ.ink2, ink: JZ.ink, sw: 1.2 });
    if (walk) glow(sig[0], sig[1] + 180, 130, '#B8E0A0', 1 - .4 * seg(t, 44.55, 44.8));
    else glow(sig[0], sig[1] + 66, 130, '#FF8A6A', .9 * mk);
    // the petal: drifts down onto the stripes, lies there; the wind turns it over at bar 26
    const fall = seg(tt, 42.7, 43.55), gust = seg(tt, 45.405, 45.85);
    if (fall > 0) {
      boilSeed('J-petal');
      const px = lerp(PET.x - 260, PET.x, easeOut(fall)) + 70 * Math.sin(fall * 7) * (1 - fall) + 36 * ease(gust), py = lerp(-120, PET.y, easeOut(fall)) - 30 * Math.sin(Math.PI * gust);
      const rot = .7 + .9 * fall + 1.4 * Math.sin(fall * 6) * (1 - fall) + 2.2 * ease(gust), fl = Math.abs(Math.cos(gust * Math.PI)) * .7 + .3;
      const pet = (ox, oy) => { const P = []; for (let i = 0; i <= 18; i++) { const a = i / 18 * TAU, rr = 1 - .45 * Math.max(0, Math.cos(a)); P.push([ox + Math.cos(rot) * Math.cos(a) * 44 * rr - Math.sin(rot) * Math.sin(a) * 24 * fl * rr, oy + Math.sin(rot) * Math.cos(a) * 44 * rr + Math.cos(rot) * Math.sin(a) * 24 * fl * rr]); } return P; };
      if (fall >= 1) paint(pet(px + 7, py + 8), { fill: JZ.ink, fillOp: 110, bleed: .1, tex: .3, border: .1, ink: null });
      paint(pet(px, py), { wash: gust > .3 && gust < .7 ? mixCol(JZ.cream, JZ.smoke, .8) : JZ.cream, fill: '#E3D3AE', fillOp: 80, tex: .5, ink: JZ.ink, sw: 1.5, curv: .6 });
      inkLine([[px - 30 * Math.cos(rot), py - 30 * Math.sin(rot)], [px + 22 * Math.cos(rot), py + 22 * Math.sin(rot)]], 1.2, mixCol(JZ.smoke, JZ.ink, .35), 'inkfine', .4);
    }
    camEnd();
  }

  // ---------- K · "Every silent passing hour" (48.42–56.17, bars 27–32) ----------
  // The camera keeps rising, up past the roofs to a clock tower against a huge mustard moon. The minute hand jumps a
  // quarter on every beat: the hours go by. The sax plays and its orange ribbon drifts in and wraps round the tower,
  // then points at the moon, and the camera follows it in: the moon's disc is the next shot's spotlight.
  const TW = { x: 700, top: 250, w: 250, cr: 100 };
  const MOON = { x: 1180, y: 430, r: 400 };
  function tower(t) {
    const { x, top, w } = TW, cy = top + 120;
    boilSeed('K-tower');
    block(rectPts(x - w / 2, top, w, 2400), mixCol(JZ.blueDk, JZ.ink, .35), { ink: JZ.ink, sw: 2.4 });
    block([[x - w / 2 - 24, top + 6], [x, top - 200], [x + w / 2 + 24, top + 6]], JZ.ink2, { ink: JZ.ink, sw: 2.4 });
    inkLine([[x, top - 196], [x, top - 300]], 5, JZ.ink, 'ink', 0);
    paint(ellPts(x, top - 304, 9, 9, 10), { wash: JZ.mustard, ink: JZ.ink, sw: 1 });
    for (const ly of [top + 250, top + 520, top + 790]) block(rectPts(x - w / 2 - 14, ly, w + 28, 20), JZ.ink2, { ink: JZ.ink, sw: 1.4 });
    for (let j = 0; j < 4; j++) for (const sx of [-1, 1]) paint(rrPts(x + sx * 58 - 18, top + 300 + j * 270, 36, 110, 18), { wash: j === 1 && sx > 0 ? JZ.mustLt : JZ.ink, ink: JZ.ink, sw: 1.2 });
    // the clock face
    boilSeed('K-clock');
    glow(x, cy, 190, '#FFE9B0', .45);
    paint(ellPts(x, cy, TW.cr + 14, TW.cr + 14, 36), { wash: JZ.ink2, ink: JZ.ink, sw: 2 });
    paint(ellPts(x, cy, TW.cr, TW.cr, 36), { wash: JZ.cream, fill: JZ.smoke, fillOp: 50, ink: JZ.ink, sw: 2 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = i % 3 ? .86 : .76; inkLine([[x + Math.cos(a) * TW.cr * r0, cy + Math.sin(a) * TW.cr * r0], [x + Math.cos(a) * TW.cr * .93, cy + Math.sin(a) * TW.cr * .93]], i % 3 ? 2 : 4, JZ.ink, 'ink', 0); }
    // the hands: the minute hand jumps a quarter turn on every beat (with an overshoot), the hour hand creeps
    const bp = bpOf(t), b0 = Math.floor(bp), q = bp - b0, jumpK = backOut(clamp(q / .16)) + .06 * spring(t, B(b0) + .16, 10, 30);
    const steps = b0 - 4 * 27 + jumpK, ma = -Math.PI / 2 + steps * TAU / 4, ha = -Math.PI / 2 + (10 + steps / 4) / 12 * TAU;
    boilSeed('K-hands');
    inkLine([[x, cy], [x + Math.cos(ha) * TW.cr * .5, cy + Math.sin(ha) * TW.cr * .5]], 11, JZ.ink, 'ink', 0);
    const mx = Math.cos(ma), my = Math.sin(ma), nx = -my * 6, ny = mx * 6;
    paint([[x - mx * 16 + nx, cy - my * 16 + ny], [x + mx * TW.cr * .84, cy + my * TW.cr * .84], [x - mx * 16 - nx, cy - my * 16 - ny]], { wash: JZ.verm, ink: JZ.ink, sw: 1.2 });
    paint(ellPts(x, cy, 10, 10, 10), { wash: JZ.verm, ink: JZ.ink, sw: 1 });
    // a tick mark flicks out on each jump
    if (q < .25) { const a = ma, k = q / .25; inkLine([[x + Math.cos(a) * (TW.cr + 24 + 20 * k), cy + Math.sin(a) * (TW.cr + 24 + 20 * k)], [x + Math.cos(a) * (TW.cr + 50 + 30 * k), cy + Math.sin(a) * (TW.cr + 50 + 30 * k)]], 5 * (1 - k), JZ.cream, 'ink', 0); }
  }
  // the ribbon's path: in from the left, a turn and a half round the tower, then off toward the moon
  function wrapPath(t) {
    const P = [], cy0 = TW.top + 520, R = TW.w * .9;
    for (let i = 0; i <= 14; i++) { const k = i / 14; P.push([lerp(-500, TW.x - R, k), cy0 + 40 + 60 * Math.sin(k * 5 + t * 1.3) * (1 - k)]); }
    for (let i = 1; i <= 40; i++) { const th = Math.PI + i / 40 * 3 * Math.PI; P.push([TW.x + R * Math.cos(th), cy0 - (th - Math.PI) * 32 + R * .3 * Math.sin(th) + 8 * Math.sin(t * 2 + i * .4), Math.sin(th)]); }
    const e = P[P.length - 1];
    for (let i = 1; i <= 18; i++) { const k = i / 18; P.push([lerp(e[0], MOON.x - 60, k), lerp(e[1], MOON.y + 40, k) - 120 * Math.sin(Math.PI * k) + 20 * Math.sin(k * 6 + t * 1.5)]); }
    return P.map(p => p.length > 2 ? p : [p[0], p[1], -1]);
  }
  function ribbonRuns(P, n, front) {
    const runs = []; let cur = [];
    for (let i = 0; i < n; i++) { const f = P[i][2] > 0; if (f === front) cur.push([P[i][0], P[i][1]]); else if (cur.length) { runs.push(cur); cur = []; } }
    if (cur.length) runs.push(cur);
    return runs.filter(r => r.length > 2);
  }
  function K(t, lt, dur) {
    const t0 = t - lt, tt = onTwos(t);
    const up = seg(t, t0, t0 + 1.3);
    const cyEnd = MOON.y + (540 - 470) / 1.15, ck = TW.top + 120;
    const cx = kf(t, [[t0, 940], [50.3, 925], [51.1, TW.x + 40], [52.25, TW.x + 30], [53.1, 900], [55.1, 930], [t0 + dur, MOON.x]]);
    const cz = kf(t, [[t0 + 1.3, 1], [50.3, 1.02], [51.1, 1.75], [52.25, 1.8], [53.1, 1.05], [55.1, 1.04], [t0 + dur, 1.15]]);
    const cy = t < t0 + 1.3 ? 1750 - 1210 * easeOut(up) : kf(t, [[t0 + 1.3, 540], [50.3, 540], [51.1, ck + 30], [52.25, ck + 28], [53.1, 530], [55.1, 520], [t0 + dur, cyEnd]]);
    ground(JZ.blueDk, { tex: 20 });
    camBegin(cx, cy, cz);
    boilSeed('K-sky'); halftone('ramp', 960, 2000, 4000, 3600, JZ.blue, .7);
    for (let i = 0; i < 36; i++) { boilSeed('K-star' + i); const sx = -900 + hash(i * 5.4) * 3800, sy = -500 + hash(i * 8.7) * 1400, tw = .6 + .4 * Math.sin(t * 2.3 + i); paint(starPts(sx, sy, (5 + 6 * hash(i)) * tw, .35, 4), { wash: JZ.cream, washOp: 210, ink: null }); }
    moon(MOON.x, MOON.y, MOON.r, { glow: .7, ink: JZ.ink, sw: 2 });
    // far roofs, then the tower, then near roofs
    for (let i = 0; i < 9; i++) building(-700 + i * 380, 2600, 380, 1700 - 60 * ((i * 7) % 5), { col: mixCol(JZ.blue, JZ.blueDk, .5), key: 'Kf' + i, cell: 64, lit: id => hash(id * 1.9 + i * 13) > .9 ? .7 : 0, ink: null });
    const P = wrapPath(tt), grow = easeOut(seg(tt, 52.35, 54.6)), n = Math.floor(P.length * grow);
    const sw = 1.6;
    if (n > 2) for (const r of ribbonRuns(P, n, false)) saxRibbon(r, 80, tt, { grow: 1, key: 'Kb' + r.length, twist: 2, sw, col: JZ.orangeDk, back: mixCol(JZ.orangeDk, JZ.ink, .3) });
    tower(tt);
    for (let i = 0; i < 7; i++) { const bx = -600 + i * 470 + 60 * hash(i * 3), top = 1080 + 160 * hash(i * 9.3); boilSeed('K-near' + i); block(rectPts(bx, top, 480, 1600), i % 2 ? JZ.ink2 : JZ.ink, { ink: JZ.ink, sw: 1.8 }); if (i % 3 === 1) paint(rectPts(bx + 120, top - 90, 60, 90), { wash: JZ.ink2, ink: JZ.ink, sw: 1.4 }); }
    if (n > 2) for (const r of ribbonRuns(P, n, true)) saxRibbon(r, 80, tt, { grow: 1, key: 'Kf' + r.length, twist: 2, sw, shine: true });
    camEnd();
    // the rise carries on from J: vertical streaks for the first moments
    if (lt < .35) { boilSeed('K-speed'); const k = 1 - lt / .35; for (let i = 0; i < 8; i++) { const x = 90 + i * 250 + 60 * hash(i), y0 = -200 + 900 * hash(i * 2.2) + 700 * lt / .35, L = 900 * k; inkLine([[x, y0], [x + 6, y0 + L]], 2 + 4 * k, SPEED, 'dry', 0); } }
  }

  // ---------- L · "Steals a little of my power" (56.17–62.64, bars 32–35) ----------
  // Match cut: the moon is the spotlight's disc behind the singer, close. On every backbeat the light shrinks a notch
  // and the singer sinks with it, bluer, the gloom rising. The candle in the dark behind burns down. At bar 35 the
  // frame goes to pure silhouette, the camera draws back and the disc swallows the frame: the memory.
  const SG = { x: 900, y: 900, u: 60 };
  function L(t, lt, dur) {
    const t0 = t - lt, tt = onTwos(t), silT = barT(35);
    const notches = [1, 2, 3, 4, 5].map(i => B(4 * 32 + 1 + 2 * i));
    let r = MOON.r * 1.15, sink = 0;
    notches.forEach(b => { const k = backOut(seg(tt, b, b + .18)); r *= lerp(1, .87, k); sink += k; });
    const sil = tt >= silT, grow = easeIn(seg(t, 62.16, t0 + dur));
    r = lerp(r, 3600, grow);
    const back = ease(seg(t, 61.25, t0 + dur));
    camBegin(lerp(960, 554, back), lerp(540, 434, back), lerp(1 + .03 * seg(t, t0, silT), BN.u / SG.u, back));
    ground(JZ.ink);
    boilSeed('L-floor'); block(rectPts(-3000, 900, 7000, 2400), sil ? JZ.ink : JZ.ink2, { ink: null });
    // the disc: mustard light, then cream in the silhouette
    boilSeed('L-disc');
    if (!sil) glow(960, 470, r * 1.4, '#FFD890', .5);
    block(ellPts(960, 470, r, r, 48), sil ? JZ.cream : JZ.mustard, { ink: JZ.ink, sw: 2.2 });
    if (!sil) halftone('disc', 960 + r * .25, 470 + r * .2, r * 1.2, r * 1.2, JZ.mustDk, .45);
    // the table with the candle behind, burning down
    const drawTable = () => {
      boilSeed('L-table');
      paint(rectPts(222, 640, 26, 262), { wash: JZ.ink2, ink: JZ.ink, sw: 1.2 });
      paint(rectPts(100, 626, 270, 20), { wash: JZ.ink2, ink: JZ.ink, sw: 1.2 });
      candle(200, 626, 1.3, t, { key: 'L', height: lerp(1, .38, seg(t, t0, t0 + dur)), flame: 1 });
    };
    if (sil) { silhouette(JZ.ink, drawTable); candleFlame(201, 626 - 46 * 1.3 * .42 - 6, 1.3, t, { flame: .8 }); } else drawTable();
    // the singer: sinks a notch on every notch of the light, bluer, gloomier
    const k = sink / 5;
    // acting: eyes closed into the line; on the long held word the eyes open, wet, up at the shrinking light, and the
    // free arm reaches for it, trembling; the light steps down again, the arm falls to the chest and the eyes shut
    const ov = { emote: null, gloom: lerp(.15, .85, k), tint: 'blue', tintK: lerp(.3, 1, k) };
    const mood = emotions(tt, [[0, 'sad', { ...ov, eyes: 'closed' }], [59.05, 'sad', { ...ov, eyes: 'teary', lookX: .25, lookY: -.9 }], [60.95, 'sad', { ...ov, eyes: 'closed' }]], { take: .6 });
    Object.assign(mood, ov);
    const flinch = notches.reduce((a, b) => a + .06 * hitK(tt - b, 6), 0);
    const arm = kf(tt, [[56.2, -.3], [58.9, -.45], [59.2, -.65], [59.6, .95], [60.5, 1.15], [60.95, .8], [61.4, -.2], [62.6, -.85]]) + .07 * Math.sin(tt * 13) * seg(tt, 59.6, 59.8) * (1 - seg(tt, 60.7, 60.95));
    const reachK = Math.sin(Math.PI * seg(tt, 59.2, 61.3));
    const o = { ...mood, sq: (mood.sq || 0) + .03 * k + flinch - .05 * reachK, rot: -.02 * k - .05 * reachK, dy: (mood.dy || 0) + .1 * k - .25 * reachK, aL: arm, micShine: sil ? 0 : .3, boilKey: 'L-singer', key: 'L' };
    if (sil) silhouette(JZ.ink, () => singer(SG.x, SG.y, SG.u, tt, { ...o, sil: JZ.ink })); else {
      const sg = singer(SG.x, SG.y, SG.u, tt, o);
      voiceCurls(sg.mouth[0] + 90, sg.mouth[1] - 40, tt, { s: 2.2, dx: 60, rise: 170, max: 4 });
    }
    camEnd();
  }

  // ---------- M · the memory (62.64–76.46, bars 36–43) ----------
  // Silhouette switch: the singer and the love side by side on a bench. The silhouettes stay put; on every second bar
  // line the world behind them changes colour (cream dawn → mustard noon → vermilion dusk → blue rain) as the days
  // pass, with a small change each time (the love turns to the singer, leans in, a heart; they share an umbrella).
  // Then the lights go out: in the dark only the lamp lights the singer, and the love gets up and walks out of the
  // light to the left. The lamp gutters and an iris closes on the singer, alone.
  const BN = { x: 960, seat: 640, gy: 742, lx: 752, sx: 1168, u: 32, lamp: 1690 };
  // the love's exit, in seconds: settle (anticipation), hop up off the bench, land, turn back to the singer and hold
  // the look (the lights go out during it), turn away, walk out of the lamp's light to the left
  const EX = { settle: 73.62, rise: 73.84, land: 74.3, look: 74.42, turn: 75.06, walk: 75.2, gone: 75.96 };
  function umbrella(hx, hy, tilt, s) {
    silhouette(JZ.ink, () => {
      boilSeed('M-umb');
      push(); translate(hx, hy); rotate(tilt); scale(s);
      inkLine([[0, 0], [0, -210]], 7, JZ.ink, 'ink', 0);
      inkLine([[0, 0], [0, 26], [14, 34]], 7, JZ.ink, 'ink', .6);
      const C = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; C.push([Math.cos(a) * 300, -200 + Math.sin(a) * 120]); }
      for (let i = 6; i >= 0; i--) C.push([-300 + i * 100, -200 - (i % 2 ? 0 : 18)]);
      paint(C, { wash: JZ.ink });
      inkLine([[0, -320], [0, -350]], 6, JZ.ink, 'ink', 0);
      pop();
    });
  }
  function M(t, lt, dur) {
    const t0 = t - lt, tt = onTwos(t), u = BN.u, sit = y => y + 2 * u;
    const ph = t < barT(38) ? 0 : t < barT(40) ? 1 : t < barT(42) ? 2 : t < barT(43) ? 3 : 4;
    const bg = [JZ.cream, JZ.mustard, JZ.verm, JZ.blue, JZ.ink][ph];
    plate('M' + ph);
    ground(bg, ph === 4 ? {} : { tex: 25 });   // (an ink ground with a texture fill comes out as bare paper)
    // the sun (then the moon) in a new place for each colour: the days going by
    const suns = [[300, 330, 120, JZ.mustard], [560, 170, 105, JZ.cream], [1420, 300, 125, JZ.mustard], [330, 190, 90, JZ.cream]];
    if (ph < 4) { const [sx, sy, sr, sc] = suns[ph], dr = 10 * Math.sin(tt * 1.3); boilSeed('M-sun' + ph); block(ellPts(sx, sy + dr, sr, sr, 36), sc, { ink: JZ.ink, sw: 1.6 }); halftone('disc', sx + sr * .2, sy + dr + sr * .2, sr * 1.3, sr * 1.3, mixCol(sc, JZ.ink, .35), .35); }
    boilSeed('M-ground');
    block(rectPts(-100, BN.gy, W + 200, 440), mixCol(bg, JZ.ink, ph === 4 ? 0 : .3), { ink: null });
    // the lamp post (lit only in the dark), its light on the singer
    const on = ph === 4 ? clamp(seg(t, barT(43), barT(43) + .06)) * (t > 75.78 && t < 75.95 ? .75 + .25 * Math.sin(t * 90) : 1) : 0;
    const lh = [BN.lamp - 130, 120];
    boilSeed('M-lamp');
    if (on > .01) {
      paint([[lh[0] - 40, lh[1] + 30], [lh[0] + 40, lh[1] + 30], [BN.sx + 300, BN.gy], [BN.sx - 330, BN.gy]], { wash: JZ.cream, washOp: 80 * on, fill: JZ.cream, fillOp: 50 * on, bleed: .05, tex: .4, border: .5, ink: null });
      paint(ellPts(BN.sx - 20, BN.gy, 400, 34, 24), { wash: JZ.cream, washOp: 150 * on, ink: null });
      glow(lh[0], lh[1] + 30, 300 * on, '#FFE2A8', .8 * on);
    }
    silhouette(JZ.ink, () => {
      paint(rectPts(BN.lamp - 10, 100, 20, BN.gy - 96), { wash: JZ.ink });
      inkLine([[BN.lamp, 104], [BN.lamp - 50, 78], [lh[0], 98]], 10, JZ.ink, 'ink', .5);
      paint([[lh[0] - 46, lh[1] + 30], [lh[0] - 22, lh[1] - 12], [lh[0] + 22, lh[1] - 12], [lh[0] + 46, lh[1] + 30]], { wash: JZ.ink });
    });
    if (on > .01) paint(ellPts(lh[0], lh[1] + 32, 40, 10, 12), { wash: JZ.cream, ink: null });
    // the bench, across the middle of the frame
    silhouette(JZ.ink, () => {
      boilSeed('M-bench');
      paint(rectPts(BN.x - 480, BN.seat - 190, 960, 30), { wash: JZ.ink });
      paint(rectPts(BN.x - 480, BN.seat - 120, 960, 16), { wash: JZ.ink });
      paint(rectPts(BN.x - 500, BN.seat, 1000, 28), { wash: JZ.ink });
      for (const lx of [-440, 430]) paint(rectPts(BN.x + lx - 9, BN.seat - 190, 18, 190), { wash: JZ.ink });
      for (const lx of [-460, 450]) paint(rectPts(BN.x + lx - 12, BN.seat + 24, 24, BN.gy - BN.seat - 20), { wash: JZ.ink });
    });
    // rain in the blue and the dark
    if (ph >= 3) { boilSeed('M-rain' + Math.floor(tt * 12)); for (let i = 0; i < 50; i++) { const x = hash(i * 3.3) * 2100 - 100 + (tt * 120) % 60, y = ((hash(i * 7.7) * 1100 + tt * 1300) % 1150) - 80; inkLine([[x, y], [x - 13, y + 52]], 2.2, ph === 3 ? JZ.blueLt : mixCol(JZ.blueLt, JZ.ink, .35), 'inkfine', 0); } }
    const legs = (x, y, col, swing, key) => { boilSeed('M-legs' + key); for (let i = 0; i < 2; i++) paint(rectPts(x + (i ? .8 : -1.8) * u + swing * (i ? 1 : -1) * .25 * u, y, u, 2.1 * u), { wash: col, ink: JZ.ink, sw: 1.3 }); };
    // the love: turns to the singer (cream), leans in (mustard), sways (vermilion), sits close under the umbrella
    // (blue); then gets up and goes (see EX)
    const lean = ph === 1 ? ease(seg(tt, barT(38) + .3, barT(38) + 1)) : ph === 2 ? .7 : ph === 3 ? .55 * (1 - ease(seg(tt, EX.settle - .25, EX.settle))) : 0;
    const sway = ph === 2 ? Math.sin(bpOf(tt) * Math.PI / 2) : 0;
    if (tt < EX.rise) {
      const turned = ph > 0 || tt > 64.9;
      const settle = Math.sin(Math.PI * .5 * seg(tt, EX.settle, EX.rise));   // sinks into the seat: the anticipation
      legs(BN.lx, BN.seat + 12, JZ.cream, ph === 3 ? .2 * Math.sin(tt * 2) : Math.sin(tt * 3.2), 'L');
      lover(BN.lx + lean * 1.1 * u + sway * .25 * u, sit(BN.seat), u, { view: turned ? 'q' : 'front', noLegs: true, rot: .1 * lean + .05 * sway - .06 * settle, sq: (ph === 0 ? .03 * Math.sin(bpOf(tt) * Math.PI / 2) : 0) + .16 * settle, boilKey: 'M-love' });
    } else {
      // up off the bench on an arc (stretch), down in front of it (squash), a settle; the look back; then away
      const r = seg(tt, EX.rise, EX.land), ld = tt - EX.land, wk = seg(tt, EX.walk, EX.gone);
      const p0 = [BN.lx - .2 * u, sit(BN.seat)], p1 = [BN.lx - 1.6 * u, BN.gy + 4];
      const P = tt < EX.land ? arcPt(p0, p1, 2.2 * u, ease(r)) : [lerp(p1[0], -260, wk * wk * .35 + wk * .65), p1[1]];
      const sq = tt < EX.land ? -.14 * Math.sin(Math.PI * r) : .16 * hitK(ld, 9) - .05 * spring(tt, EX.land + .12, 8, 20);
      const view = tt < EX.turn ? { view: 'q' } : turn(tt, EX.turn, EX.walk, .15, -.25);
      // the look back: a slow lean toward the singer, held
      const look = ease(seg(tt, EX.look, EX.look + .25)) * (1 - ease(seg(tt, EX.turn - .08, EX.turn + .06)));
      lover(P[0], P[1], u, { ...view, walk: tt > EX.walk ? (tt - EX.walk) * 1.8 : null, sq, rot: .07 * look - (tt > EX.walk ? .04 : 0), dy: tt > EX.walk ? -.2 * Math.abs(Math.sin((tt - EX.walk) * 1.8 * TAU)) : 0, noLegs: tt < EX.rise + .1, boilKey: 'M-love' });
    }
    // the singer: stays put; holds the umbrella in the rain; answers the look (leans after the love), then sags
    const sLean = ph === 1 ? -.6 * ease(seg(tt, barT(38) + .5, barT(38) + 1.2)) : ph === 2 ? -.3 : ph === 3 ? -.25 * (1 - ease(seg(tt, EX.settle - .25, EX.settle))) : 0;
    const sSway = ph === 2 ? Math.sin(bpOf(tt) * Math.PI / 2 + .6) : 0;
    const answer = ease(seg(tt, EX.look + .3, EX.look + .6)) * .5 + ease(seg(tt, EX.walk + .1, EX.walk + .45)) * .7;
    const sag = ease(seg(tt, EX.walk + .5, EX.gone));
    const umb = ph === 3 ? 1 : ph === 4 ? 1 - .6 * ease(seg(tt, EX.walk + .4, EX.gone)) : 0;
    legs(BN.sx, BN.seat + 12, JZ.ink, ph === 4 ? 0 : Math.sin(tt * 2.6 + 1), 'S');
    clawd(BN.sx + sLean * u - answer * .6 * u, sit(BN.seat), u, { view: 'q', flip: true, noLegs: true, hat: ['gardenia', 'bowtie'], rot: .08 * sLean - .05 * sSway - .12 * answer + .1 * sag, sq: .08 * sag + .06 * hitK(tt - (EX.walk + .1), 5) * (ph === 4 ? 1 : 0), aL: umb > 0 ? .9 : -.6, aR: ph === 4 ? -.6 + 1.1 * ease(seg(tt, EX.walk + .1, EX.walk + .4)) * (1 - sag) : -.6, sil: JZ.ink, boilKey: 'M-singer' });
    if (umb > 0) umbrella(BN.sx - 3.1 * u - answer * .6 * u, BN.seat - 4.6 * u, ph === 4 ? .45 * (1 - umb) + .05 : .12, 1.22);
    // a heart between them (mustard)
    if (ph === 1) { const hk = seg(tt, 67.75, 68.05) * (1 - seg(tt, 69.2, 69.5)); emote('heart', (BN.lx + BN.sx) / 2 + 20, BN.seat - 9 * u - 30 * Math.sin(tt * 2), 44, hk, tt - 67.75); }
    // out: an iris closes on the singer; the frame is ink before the next section
    const ik = seg(t, 75.98, 76.38);
    if (ik > 0) iris(BN.sx - 1.2 * u, BN.seat - 3.5 * u, kf(t, [[75.98, 1100], [76.16, 300], [76.3, 250], [76.39, 0]]), JZ.ink);
    if (t >= 76.38) ground(JZ.ink);
  }

  shots([[11.9, E], [barT(11), F], [barT(12), G1], [bt(13, 3), G2], [barT(16), H], [barT(20), I1], [bt(22, 1), I2], [barT(24), J], [bt(27, 3), K], [bt(32, 1), L], [barT(36), M]]);
})();
