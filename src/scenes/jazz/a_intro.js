// jazz/a_intro.js: shots A–D (0–11.9 s). The match, the cover, the ride, the sax's first ribbon, the pianist's profile.

// The record-cover composition (built here in B, rebuilt from every sound shape in T). k = { disc, band, wedge, bars,
// fig } arrival progress 0..1 each; o.fig(x, y) draws the figure(s) standing on the band instead of the lone singer.
const COVER = { disc: [700, 410, 300], bandY: 770, bars: [[1190, 520], [1290, 380], [1390, 620], [1490, 300], [1590, 470], [1690, 560], [1790, 350]] };
function cover(t, k, o = {}) {
  const [dx, dy, dr] = COVER.disc, e = v => backOut(clamp(v));
  boilSeed('cover-ground'); ground(o.groundCol || JZ.cream, { tex: 30 });
  // the vermilion wedge slides in from the lower left
  if (k.wedge > 0) { const q = 1 - e(k.wedge); boilSeed('cover-wedge'); block([[-40 - 700 * q, 1120], [-40 - 700 * q, 560], [620 - 700 * q, 1120]], JZ.verm, { ink: JZ.ink, sw: 1.6 }); }
  // the disc (ride cymbal / moon) grows from its centre
  if (k.disc > 0) { boilSeed('cover-disc'); const r = dr * e(k.disc); block(ellPts(dx, dy, r, r, 48), JZ.mustard, { ink: JZ.ink, sw: 1.8 }); halftone('disc', dx + r * .28, dy + r * .25, r * 1.3, r * 1.3, JZ.mustDk, .45 * clamp(k.disc)); }
  // the blue band (the bass) sweeps in from the right
  if (k.band > 0) { const q = 1 - e(k.band); boilSeed('cover-band'); block(rectPts(-40 + W * q, COVER.bandY, W + 80, 150), JZ.blue, { ink: JZ.ink, sw: 1.6 }); halftone('ramp', W / 2 + W * q, COVER.bandY + 110, W + 80, 90, JZ.blueDk, .8); }
  // ink bars (piano keys) drop in one after another
  COVER.bars.forEach(([bx, bh], i) => {
    const q = clamp((k.bars ?? 0) * COVER.bars.length - i); if (q <= 0) return;
    boilSeed('cover-bar' + i);
    const drop = (1 - e(q)) * -900, sq = q < 1 ? 0 : spring(t, o.barsAt ? o.barsAt + i * .06 : -9, 7, 22) * .06;
    block(rectPts(bx - 34, COVER.bandY - bh + drop, 68, bh * (1 + sq)), i % 2 ? JZ.ink2 : JZ.ink, { ink: JZ.ink, sw: 1.2 });
  });
  if (k.fig > 0) {
    if (o.fig) o.fig(k.fig);
    else {
      const p = e(k.fig), u = 25 * p; boilSeed('cover-fig');
      silhouette(JZ.ink, () => { if (p > .1) ribbonMic(890 + 7.2 * u, COVER.bandY, 5.3 * u, { s: u / 26, tilt: -.35, lean: -.1 }); });
      clawd(890, COVER.bandY, u, { eyes: 'closed', hat: singerHat(), view: 'q', aR: .45, sil: JZ.ink, boilKey: 'coverfig' });
    }
  }
}

(() => {
  const B = beatT;

  // ---------- A · the match (0–0.62) ----------
  // Black. The drum pickup (0.21) scrapes a match; the flame catches on the second hit (0.34) and finds a curve of
  // brass in the dark: the sax's bell, with the flame reflected in it. It breathes in, and the first chord (0.62) blows
  // the frame open.
  function A(t, lt) {
    ground(JZ.ink);
    const strike = .21, catchT = .34, boom = B(0);
    const L = clamp((t - catchT) / .14) * (1 - .3 * seg(t, boom - .12, boom));   // how much light
    const gut = seg(t, boom - .12, boom);                                          // the flame gutters: the breath in
    // the brass bell, huge, filling the right side, only as bright as the flame makes it
    if (L > 0) {
      boilSeed('A-bell');
      const bc = mixCol(JZ.ink, JZ.brassLt, .2 + .8 * L), bd = mixCol(JZ.ink, JZ.brassDk, .25 + .75 * L), bm = mixCol(JZ.ink, JZ.brass, .2 + .6 * L);
      paint(ellPts(1560, 430, 600, 660, 48, 0, .1), { wash: bm, ink: JZ.ink, sw: 2.6 });
      paint(ellPts(1600, 450, 470, 530, 44, 0, .1), { wash: bd, ink: JZ.ink, sw: 1.8 });
      paint(ellPts(1650, 470, 330, 390, 40, 0, .1), { wash: JZ.ink2, ink: null });
      // the rim catches the light: a bright arc, and a highlight that slides as the flame moves
      const k = seg(t, catchT, boom);
      inkLine(ellPts(1560, 430, 585, 645, 60, 0, .1).slice(24, 44), 4 * L, bc, 'ink', .6);
      const hp = ellPts(1560, 430, 590, 650, 60, 0, .1)[Math.floor(30 + k * 10)];
      glow(hp[0], hp[1], 130 * L, '#FFE7A8', L);
      // the flame, reflected small and bent in the bell
      candleFlame(1360, 560, 2.4 * L, t, { flame: L * (1 - .4 * gut), light: .5 });
    }
    // the matchbox's striking strip, low in frame
    // (hidden in the dark until the strike, so frame 0 is pure black and the film loops cleanly from its black end)
    boilSeed('A-box');
    const seen = seg(t, strike - .05, strike);
    if (seen > 0) {
      const bx = mixCol(JZ.ink, JZ.vermDk, seen * (.25 + .6 * Math.max(L, seg(t, strike - .02, strike + .04) * (1 - seg(t, strike + .06, strike + .14)))));
      paint([[180, 820], [1120, 780], [1140, 1120], [160, 1120]], { wash: bx, hatch: { d: 9, a: 1.2, b: 'charcoal', c: mixCol(JZ.ink, JZ.ink2, 1 - seen), w: .7 }, ink: mixCol(JZ.ink, JZ.ink, 1), sw: 2 });
    }
    // the match: a stroke along the strip (a smear frame while it strikes), sparks, then the flame catches
    boilSeed('A-match');
    const ms = seg(t, strike - .04, strike + .06), hx = lerp(1060, 640, easeOut(ms)), hy = lerp(790, 740, easeOut(ms)) - 90 * ease(seg(t, catchT, boom));
    if (t >= strike - .04) {
      push(); translate(hx, hy); rotate(-.42 - .1 * ease(seg(t, catchT, boom)));
      if (ms > 0 && ms < 1) for (let i = 0; i < 4; i++) inkLine([[30, (i - 1.5) * 12], [30 + 420 * (1 - ms), (i - 1.5) * 16]], 4 - i * .6, mixCol(JZ.cream, JZ.ink, .35 + i * .12), 'dry', 0);
      paint(rectPts(10, -16, 720, 32), { wash: mixCol(JZ.ink2, '#E9D2A0', .2 + .7 * L), ink: JZ.ink, sw: 1.8 });
      paint(ellPts(0, 0, 34, 26, 16), { wash: mixCol(JZ.vermDk, JZ.verm, .4 + .6 * L), fill: JZ.ink, fillOp: 40 * L, ink: JZ.ink, sw: 1.8 });
      pop();
      const sa = t - strike;
      if (sa > 0 && sa < .3) for (let i = 0; i < 13; i++) {
        const a = -2.9 + hash(i * 3.3) * 2.2, d = 60 + 380 * hash(i * 7.1) * easeOut(sa / .3), x = 760 + Math.cos(a) * d, y = 760 + Math.sin(a) * d + 700 * sa * sa;
        inkLine([[x, y], [x + Math.cos(a) * 34 * (1 - sa / .3), y + Math.sin(a) * 34 * (1 - sa / .3)]], 2.6, i % 3 ? JZ.mustLt : JZ.cream, 'ink', 0);
      }
      if (sa > -.01 && sa < .14) glow(760, 760, 320 * (1 - clamp(sa / .14)), '#FFD27A', 1);
      if (t >= catchT) {
        const q = clamp((t - catchT) / .08);
        candleFlame(hx - 20, hy - 20, 6.5 * (.4 + .6 * backOut(q)) * (1 - .35 * gut), t, { flame: 1, light: 1.3, lean: -.35 * gut });
      }
    }
  }

  // ---------- B1 · the cover assembles (0.62–4.13, bars 0–1) ----------
  // The chord blows the frame open: a flash, the disc bursts out of the flame, and on each beat a block lands.
  const WEDGES = [JZ.verm, JZ.mustard, JZ.blue, JZ.cream, JZ.ink2, JZ.orange, JZ.mustard, JZ.verm, JZ.blue];
  function B1(t, lt, dur) {
    const tt = t < B(2) ? t : onTwos(t), b = bpOf(tt);
    const k = { disc: seg(b, .25, .8), band: seg(b, 1, 1.6), wedge: seg(b, 2, 2.5), bars: seg(b, 3, 5), fig: seg(b, 5.5, 6.2) };
    camBegin(W / 2 + 12 * Math.sin(lt * .8), H / 2, 1.08 - .06 * ease(seg(b, 0, 7)) + .025 * hitK(t - B(Math.floor(b)), 7));
    cover(tt, k, { barsAt: B(3) });
    shards(700, 410, t - B(0) - .1, 3, { n: 14, dist: 900, size: 70, life: 1.1 });
    camEnd();
    // the explosion: the whole frame is blocks of colour for two frames, then they fly apart from the flame's point
    const ex = lt - .08;
    if (ex < .45) {
      const cx = 700, cy = 520, n = WEDGES.length, d = ex < 0 ? 0 : 1900 * Math.pow(ex / .45, 1.6);
      for (let i = 0; i < n; i++) {
        boilSeed('wedge' + i);
        const a0 = -Math.PI + i / n * TAU + .2 * hash(i), a1 = -Math.PI + (i + 1) / n * TAU + .2 * hash(i + 1), am = (a0 + a1) / 2, R = 2600;
        const ox = Math.cos(am) * d, oy = Math.sin(am) * d, rot = (hash(i * 5) - .5) * 1.2 * seg(ex, 0, .45);
        const pts = [[0, 0], [Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(am) * R * 1.1, Math.sin(am) * R * 1.1], [Math.cos(a1) * R, Math.sin(a1) * R]];
        push(); translate(cx + ox, cy + oy); rotate(rot);
        block(pts, WEDGES[i], { ink: JZ.ink, sw: 2.4, misK: .6 });
        if (i % 3 === 0) halftone('ramp', Math.cos(am) * 500, Math.sin(am) * 500, 900, 900, mixCol(WEDGES[i], JZ.ink, .45), .5, am);
        pop();
      }
    }
    flash(1 - seg(t, B(0), B(0) + .05), '#FFE7A8');
  }

  // ---------- B2 · the ride (4.13–5.86, bars 2–3) ----------
  // Match cut: the disc IS the ride cymbal. A wire brush sweeps across it (smear), shimmer ripples out.
  function B2(t, lt, dur) {
    const [dx, dy, dr] = COVER.disc, tt = onTwos(t), m = ease(seg(lt, 0, .18));
    ground(JZ.ink);
    block(rectPts(-40, 820, W + 80, 300), JZ.blueDk, { ink: null });
    halftone('ramp', W / 2, 700, W + 100, 900, JZ.blue, .35);
    camBegin(dx + 60 * ease(seg(lt, 0, dur)), dy + 40, 1 + .12 * ease(seg(lt, 0, dur)));
    // the cymbal: the disc flattening into a tilted ride (flat 2D: a wide ellipse, a bell, lathe rings)
    const ry = lerp(dr, dr * .36, m), rx = lerp(dr, dr * 1.25, m);
    boilSeed('B2-stand'); inkLine([[dx, dy + ry * .5], [dx + 10, dy + 900]], 5, JZ.ink2, 'ink', 0);
    const hits = [B(9), B(10.66), B(11), B(12.66)], [ha] = [agesAt(t, hits).pop() ?? 9];
    const wob = Math.exp(-ha * 7) * Math.sin(ha * 40) * .025;
    boilSeed('B2-ride');
    block(ellPts(dx, dy, rx, ry, 48, 0, -.1 + wob), JZ.mustard, { ink: JZ.ink, sw: 1.8, misK: m });
    for (let i = 1; i < 4; i++) inkLine(ellPts(dx, dy, rx * i / 4.2, ry * i / 4.2, 40, 0, -.1 + wob).concat([[dx + rx * i / 4.2, dy]]), .8, JZ.mustDk, 'inkfine', .5);
    paint(ellPts(dx, dy - 6, rx * .16, ry * .22, 18, 0, -.1), { wash: JZ.mustLt, ink: JZ.ink, sw: 1 });
    glow(dx - rx * .4, dy - ry * .2, 180, '#FFE2A0', .5 + .5 * hitK(ha, 4));
    shimmer(dx, dy, rx * .9, ry * .9, ha, { key: 'B2' });
    // the brush: sweeps across on the swung beats, a smear frame at full speed
    const sw0 = B(9) - .12, swp = t < B(11) ? seg(t, sw0, B(9) + .08) : seg(t, B(11) - .12, B(11) + .08), dirn = t < B(11) ? 1 : -1;
    const bxp = dirn > 0 ? lerp(dx + rx * 1.1, dx - rx * .6, easeOut(swp)) : lerp(dx - rx * .6, dx + rx * 1.1, easeOut(swp));
    const fast = swp > .05 && swp < .95;
    boilSeed('B2-brush');
    // the brush head lies on the cymbal; its handle runs up and off the frame to the drummer's hand
    if (fast) for (let i = 0; i < 5; i++) inkLine([[bxp - 40, dy - 30 + i * 14], [bxp - 40 + dirn * 320, dy - 30 + i * 18]], 3.4 - i * .5, mixCol(JZ.cream, JZ.ink, .25 + i * .12), 'dry', 0);
    push(); translate(bxp, dy - 18); rotate(-.62);
    paint(rectPts(110, -11, 1100, 22), { wash: JZ.ink2, ink: JZ.ink, sw: 1.3 });
    paint(rectPts(80, -14, 60, 28), { wash: '#9A9486', ink: JZ.ink, sw: 1 });
    for (let i = 0; i < 13; i++) inkLine([[90, (i - 6) * 1.5], [-70, (i - 6) * 9 + jit(3)]], .8, '#C9C2B2', 'inkfine', 0);
    pop();
    camEnd();
  }

  // ---------- C · the sax enters (5.86–9.29, bars 3–4) ----------
  // The saxophonist in a hard spotlight. A breath in (stretch, the horn tilts back), and the first note (6.36)
  // unfurls the orange ribbon across the frame; the camera follows its tip. At the end the ribbon swells into a wipe.
  function C(t, lt, dur) {
    const tt = onTwos(t), n1 = 6.36;
    const breath = seg(tt, B(12), n1), blow = seg(tt, n1, n1 + .2);
    ground(JZ.ink);
    block(rectPts(-60, 780, W + 120, 400), JZ.ink2, { ink: null });
    halftone('ramp', 960, 900, W + 200, 360, JZ.blueDk, .6);
    const camX = lerp(820, 1240, ease(seg(tt, n1 + .3, 8.9))), camY = lerp(560, 470, ease(seg(tt, n1, 8.9)));
    camBegin(camX, camY, 1.0 + .04 * ease(seg(lt, 0, dur)));
    spotlight(700, -160, 640, 820, 760, { key: 'C' });
    smoke(tt, 100, 60, 1700, 700, { key: 'C', op: 26 });
    const u = 46, x = 560, y = 820;
    // the breath in: a stretch up and back that holds until the note, then a squash into the first note
    const inhale = ease(breath) * (1 - blow);
    const body = { sq: -.2 * inhale + .14 * hitK(tt - n1, 7), rot: -.13 * inhale + .04 * blow, dy: -.55 * inhale };
    const sx = saxist(x, y, u, tt, { ...body, shine: frac(.2 + seg(tt, n1, 9) * 1.3), glow: .8, key: 'C' });
    // the ribbon: born at the first note, unfurling right across the frame, riding the swing
    const grow = easeOut(seg(tt, n1, 7.4));
    if (grow > 0) {
      const tip = saxRibbon(flowPath(sx.bell[0], sx.bell[1] - 10, -.42 + .36 * ease(seg(tt, n1, 7.6)), 300 + 1500 * grow, tt, { amp: 90, waves: 1.4, speed: .8, curl: 110 * seg(tt, 7.2, 8), lift: k => -90 * Math.sin(k * Math.PI) }), 104, tt, { grow: 1, key: 'C', tspeed: 1.6, shine: 1 });
    }
    camEnd();
    // out: the ribbon's orange swells over the frame (the wipe into D)
    if (lt > dur - .38) brushWipe((lt - (dur - .38)) / .76, [JZ.orangeDk, JZ.orange]);
  }

  // ---------- D · the pianist's profile (9.29–11.90, bars 5–6) ----------
  // Pure profile silhouette against a big mustard window, spectacles catching light; tiles hop over the keys on the
  // chords. Then a whip pan to the stage (the cut on action into E).
  function D(t, lt, dur) {
    const tt = onTwos(t);
    ground(JZ.blueDk, { tex: 25 });
    const whip = seg(t, dur + (t - lt) - .3, dur + (t - lt));
    camBegin(980 + 900 * easeIn(whip), 560, 1.1 + .04 * ease(seg(lt, 0, dur)));
    boilSeed('D-window');
    block(rectPts(120, 40, 1000, 900), JZ.mustard, { ink: JZ.ink, sw: 2.4 });
    inkLine([[620, 40], [620, 940]], 4, JZ.ink, 'ink', 0);
    inkLine([[120, 500], [1120, 500]], 4, JZ.ink, 'ink', 0);
    halftone('disc', 620, 470, 1100, 1000, JZ.mustDk, .35);
    block(rectPts(-300, 930, 2800, 400), JZ.ink, { ink: null });
    // the pianist, pure silhouette in profile against the window, leaning into the keys; and the piano
    const u = 62, x = 470, y = 1010;
    const [ba] = sinceBeat(tt), bp = bpOf(tt);
    const nod = -.06 * hitK(ba, 5), lean = .05 + .03 * Math.sin(bp * Math.PI / 2);
    const pn = pianist(x, y, u, tt, { sil: JZ.ink, hat: ['specs', 'beanie'], dy: nod, rot: lean, aL: .2 + .12 * hitK(ba, 6), piano: false, key: 'D' });
    boilSeed('D-piano'); grandPiano(x + 4.3 * u + 70 * u / 64, y, u / 64, { key: 'D', col: JZ.ink2 });
    // the spectacles: the only lit thing on the silhouette
    boilSeed('D-specs');
    const ex = x + 2.73 * u + lean * 6 * u, ey = y - 1.2 * u + (nod - 6) * u;
    paint(ellPts(ex, ey, .8 * u, 1.45 * u, 22), { wash: JZ.cream, washOp: 120, ink: JZ.cream, sw: 1.6 });
    inkLine([[ex - .3 * u, ey - .9 * u], [ex + .15 * u, ey - 1.25 * u]], 1.6, '#FFFFFF', 'inkfine', 0);
    glow(ex, ey, 110, '#FFF1C8', .55);
    // chords: tiles hop off the keyboard, one wave per beat
    const hits = []; for (let b = Math.floor(bpOf(t0D)); b <= bp; b++) hits.push(tt - B(b));
    pianoTiles(x + 4.4 * u, y - 7.4 * u, 52, 9, 1, hits.filter(a => a < 1.2), { key: 'D', h: 110, stairs: 16 });
    camEnd();
    if (lt < .38) brushWipe(.5 + lt / .76, [JZ.orangeDk, JZ.orange]);
    camBegin(980 + 900 * easeIn(whip), 560, 1.1 + .04 * ease(seg(lt, 0, dur)));
    // the whip pan: speed lines (a smear frame)
    if (whip > .1) for (let i = 0; i < 9; i++) inkLine([[1100 + 400 * whip + i * 60, 100 + i * 100], [1100 + 400 * whip + i * 60 + 900 * whip, 100 + i * 100]], 4, mixCol(JZ.ink, JZ.cream, .4), 'dry', 0);
    camEnd();
  }
  const t0D = beatT(4 * 5);

  shots([[0, A], [beatT(0), B1], [barT(2), B2], [barT(3), C], [barT(5), D]]);
})();
