// echoes/h_screens.js: shot H (94.70 → 110.43, "the paper screens"), the koto interlude. See STORYBOARD_echoes.md.
// A covered walkway at night, lined with lamplit paper screens (shoji). Masked Clawd walks right along them; a lamp
// in front throws its shadow onto the paper. The posts sit exactly where the shadow is on each bar line, so every bar
// the shadow slides onto a new screen, flickers, and is a different self:
//   94.70  the shoji wipe slides open (from G). The shadow matches Clawd (the mask's bump in profile).
//   98.63  bar 50: a horned monster. 99.13 Clawd glances back at it (take), 99.62 walks faster (trot).
//  100.60  bar 51: a tiny cowering self.   102.56 bar 52: a crowned, strutting self; Clawd nervous (sweat).
//  104.53  bar 53: a crying self, slumped, tears dripping.
//  106.50  bar 54: Clawd's true shape, no mask, the ember glowing in its chest, turns and walks LEFT (the wrong way).
//  107.47  Clawd slows to a stop, '!', turns to watch it go.
//  108.47  bar 55: a gust: lanterns swing, the paper shivers; 108.96 the screens blow open, away into bright light.
//  109.93  flash to #FFF1D8 (1 at the cut into I).
(() => {
  const { C, S, bar } = ECH;
  const H0 = S.H, B = BEAT, U = 24, FY = 900, PT = 250, PB = 770, SS = 1.35 * U, SOFF = -150;   // the lamp is ahead of Clawd, so its shadow trails behind it
  const TFAST = bar(50.5), TTRUE = bar(54), TSTOP = bar(54.5), TG = bar(55), TBLOW = bar(55.25);
  const KH = [[H0, 1], [TFAST, 1], [TFAST + 2 * B, 2], [TTRUE, 2], [TSTOP, 0]];
  const X0 = 600;
  const cW = t => ECH.walkOn(t, X0, U, KH);
  const shX = t => cW(t).x + SOFF;
  const KINDS = [[bar(50), 'horned'], [bar(51), 'tiny'], [bar(52), 'crown'], [bar(53), 'cry'], [TTRUE, 'true']];
  const P50 = shX(bar(50)), P54 = shX(TTRUE);
  const postX = k => k < 50 ? P50 - 384 * (50 - k) : k > 54 ? P54 + 384 * (k - 54) : shX(bar(k));
  const PAPER = '#F4DCA8', SHC = '#4B2E30', WOOD = '#553826', WOOD_DK = '#35231A';
  const lin = x => x;

  function camAt(t) {
    const lt = t - H0;
    return { cx: cW(t).x + 20 + 24 * Math.sin(lt * .3), cy: 615, z: 1.28 + .05 * ease(clamp(lt / 14)) + .006 * Math.exp(-frac(bpOf(t) / 4) * 8) };
  }
  const blowK = (i, t) => easeIn(seg(t, TBLOW + .12 * hash(i * 3.7 + 1), TBLOW + .95 + .12 * hash(i * 3.7 + 1)));
  const shiver = t => (t > TG && t < TBLOW + .2 ? Math.sin(t * 60) * seg(t, TG, TBLOW) : 0);

  // ---------- shadow selves: flat dark washes on the paper, no outline, no face ----------
  // (x, y) = the ground point on the paper; s = unit; facing right unless o.flip. al = 0..1 how dark (it flickers).
  function shade(kind, x, y, s, t, al, o = {}) {
    if (al <= .02) return;
    const col = mixCol(PAPER, SHC, .82 * al), sh = { wash: col, washOp: 255, ink: null };
    const walk = o.walk ?? 0;
    let sq = 0, rot = 0, dy = 0, sc = 1, arm = .2 + .3 * Math.sin(walk * TAU), lift = .8;
    if (kind === 'horned') { sc = 1.22; arm = .9 + .15 * Math.sin(t * 7); }
    if (kind === 'tiny') { sc = .55; sq = .22; rot = -.12; arm = 1.7 + .1 * Math.sin(t * 30); dy = .05 * Math.sin(t * 40); }
    if (kind === 'crown') { sc = 1.08; sq = -.1; rot = -.1; arm = -.4; lift = 1.4; }
    if (kind === 'cry') { const sob = Math.abs(Math.sin(bpOf(t) * Math.PI)); sq = .1 + .06 * sob; rot = .2; arm = 2.05 + .12 * Math.sin(t * 14); dy = -.2 * sob; lift = .4; }
    s *= sc;
    push(); translate(x, y + dy * s); rotate((o.flip ? -1 : 1) * rot); scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);
    const S2 = pts => pts.map(([a, b]) => [a * s, b * s]);
    boilSeed('shade' + kind + (o.key || ''));
    // legs (side view: diagonal pairs swing together)
    [[-2.1, 0], [1.3, .5], [-2.6, .5], [.9, 0]].forEach(([lx, ph]) => {
      const a = (walk + ph) * TAU, sx = Math.sin(a) * .55, h = 2.4 - Math.max(0, Math.cos(a)) * lift;
      paint(rectPts((lx + sx) * s, -2.3 * s, s, h * s), sh);
    });
    if (kind === 'horned') {   // tail and back spikes behind the body
      const sw = Math.sin(t * 3) * .6;
      paint(ribbon(S2([[-2.8, -3.2], [-5.2, -2.4 + sw * .4], [-6.8, -4 + sw], [-7.4, -6 + sw]]), 1.1 * s, .15 * s), sh);
      for (let k = 0; k < 4; k++) paint(S2([[-3 + k * 1.1, -7.9], [-2.6 + k * 1.1, -9.2 - .3 * (k % 2)], [-2 + k * 1.1, -7.9]]), sh);
    }
    paint(rectPts(-3.1 * s, -8 * s, 6.2 * s, 6 * s, s * .05), sh);
    if (kind === 'normal') paint(ellPts(3.15 * s, -5.3 * s, .55 * s, 2.25 * s, 14), sh);          // the mask, in profile
    if (kind === 'horned') {
      paint(ribbon(S2([[1.2, -7.8], [2.2, -9.6], [1.6, -11.4], [.4, -12.2]]), .9 * s, .08 * s), sh);
      paint(ribbon(S2([[-1.2, -7.8], [-1.4, -9.8], [-2.6, -11.2], [-3.8, -11.4]]), .9 * s, .08 * s), sh);
      paint(S2([[3.1, -4], [4.2, -3.7], [3.1, -3.3], [4.0, -2.9], [3.1, -2.6]]), sh);                 // jagged jaw
    }
    if (kind === 'crown') paint(S2([[-1.7, -7.8], [-1.7, -10.3], [-.7, -9.1], [.3, -10.9], [1.3, -9.1], [2.3, -10.3], [2.3, -7.8]]), sh);
    // the near arm
    push(); translate(1.6 * s, -4.2 * s); rotate(.7 - arm);
    paint(rectPts(-.2 * s, -.45 * s, 2.4 * s, .9 * s), sh);
    if (kind === 'horned') for (let k = 0; k < 3; k++) paint(S2([[2.1, -.4 + k * .35], [2.9, -.5 + k * .45], [2.1, -.1 + k * .35]]), sh);
    pop();
    pop();
    if (kind === 'cry') for (let i = 0; i < 5; i++) {   // tears dripping from its face, falling on the paper
      const ph = frac(t * 1.4 + i / 5), fx = x + (o.flip ? -1 : 1) * (3.9 + .5 * (i % 2) + 1.2 * ph) * s, fy = y - 5.6 * s + ph * ph * 5.4 * s, r = (.34 + .1 * (i % 2)) * s;
      boilSeed('tear' + i);
      paint([[fx, fy - 1.6 * r], [fx + r, fy + .2 * r], [fx, fy + r], [fx - r, fy + .2 * r]], { wash: col, washOp: 255, ink: null, curv: .5 });
    }
    if (kind === 'cry') for (let i = 0; i < 4; i++) {   // and spurting off in little arcs, sobbing on the beat
      const ph = frac(bpOf(t) + i / 4), d = o.flip ? -1 : 1, p = arcPt([x + d * 3.2 * s, y - 6.6 * s], [x + d * (6.4 + .8 * (i % 2)) * s, y - 2.6 * s], 2.2 * s, ph);
      boilSeed('spurt' + i);
      paint(ellPts(p[0], p[1], .32 * s * (1 - .4 * ph), .42 * s * (1 - .4 * ph), 10), { wash: col, washOp: 255, ink: null });
    }
  }
  function kindAt(t) { let k = 'normal'; for (const [tb, n] of KINDS) if (t >= tb) k = n; return k; }
  function flickerAl(t) { let a = 1; for (const [tb] of KINDS) a = Math.min(a, clamp(Math.abs(t - tb) / .11)); return a; }

  // ---------- the set ----------
  function panelsIn(v) {
    const L = [];
    for (let k = 40; k < 64; k++) { const a = postX(k), b = postX(k + 1); if (b > v.x0 - 50 && a < v.x1 + 50) L.push([k, a, b]); }
    return L;
  }
  function paperPanel(k, a, b, t, withGrid = true) {   // drawn around its own centre, so it can fly
    const w = b - a, h = PB - PT, pc = mixCol(PAPER, '#EFCB8C', hash(k * 2.3));
    boilSeed('paper' + k);
    paint(rectPts(-w / 2, -h / 2, w, h), { wash: pc, fill: '#E2B06C', fillOp: 55, bleed: .12, tex: .6, ink: null });
    return { w, h };
  }
  function grid(k, w, h) {
    boilSeed('grid' + k);
    const n = Math.max(2, Math.round(w / 115));
    for (let i = 1; i < n; i++) { const x = -w / 2 + w * i / n; inkLine([[x, -h / 2], [x, h / 2]], 1.5, WOOD, 'ink', 0); }
    for (let y = -h / 2 + 104; y < h / 2 - 20; y += 104) inkLine([[-w / 2, y], [w / 2, y]], 1.5, WOOD, 'ink', 0);
  }
  function lantern(x, y, t, i, swing) {
    boilSeed('lantern' + i);
    const a = swing, bx = x + Math.sin(a) * 140, by = y + (1 - Math.cos(a)) * 140;
    inkLine([[x, y - 160], [bx, by - 46]], .8, PAL.ink, 'ink', 0);
    glow(bx, by, 220, C.amber, .8); glow(bx, by, 70, C.amberLt, .8);
    push(); translate(bx, by); rotate(-a * .8);
    paint(ellPts(0, 0, 34, 46, 22), { wash: '#F2B868', fill: '#E08A4A', fillOp: 70, bleed: .1, tex: .5, ink: PAL.ink, sw: .8 });
    for (const yy of [-28, -12, 4, 20]) { const r = 34 * Math.sqrt(1 - Math.pow(yy / 46, 2)); inkLine([[-r, yy], [0, yy + 4], [r, yy]], .5, '#9A5A30', 'inkfine', .5); }
    paint(rectPts(-16, -54, 32, 10), { wash: PAL.ink, ink: null }); paint(rectPts(-16, 44, 32, 10), { wash: PAL.ink, ink: null });
    pop();
  }

  function shotH(t, lt, dur) {
    const cam = camAt(t), v = { x0: cam.cx - 960 / cam.z - 150, x1: cam.cx + 960 / cam.z + 150 };
    const blowAll = seg(t, TBLOW, TBLOW + 1.1), gustK = seg(t, TG, TBLOW);
    // the dark under-eave and the far wall behind
    boilSeed('h-bg');
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: '#2A1E2C', ink: null });
    camBegin(cam.cx, cam.cy, cam.z);
    const panels = panelsIn(v);
    // behind the screens: bright daylight (it only shows once they blow away)
    if (t > TBLOW) {
      boilSeed('h-behind');
      paint(rectPts(v.x0, PT - 10, v.x1 - v.x0, PB - PT + 20), { wash: mixCol('#F6D9A0', '#FFF1D8', blowAll), fill: C.goldLt, fillOp: 90, bleed: .2, tex: .3, ink: null });
      for (let x = Math.floor(v.x0 / 400) * 400; x < v.x1; x += 400) glow(x + 200, 510, 420, PAL.cream, .7 * blowAll);
    }
    // ceiling beams
    boilSeed('h-ceil');
    paint(rectPts(v.x0, -200, v.x1 - v.x0, 400), { wash: '#2E2230', fill: '#1E1520', fillOp: 90, tex: .5, ink: null });
    for (let x = Math.floor(v.x0 / 260) * 260; x < v.x1; x += 260) { boilSeed('raf' + x); inkLine([[x, -60], [x + 40, 180]], 3, '#1A121A', 'ink', 0); }
    // paper panels (they fly off in the gust)
    const flying = [];
    for (const [k, a, b] of panels) {
      const bk = blowK(k, t);
      if (bk > 0) { flying.push([k, a, b, bk]); continue; }
      const sv = shiver(t) * (hash(k) - .3) * 6;
      push(); translate((a + b) / 2 + sv, (PT + PB) / 2);
      paperPanel(k, a, b, t);
      pop();
    }
    // the shadows on the paper
    const kind = kindAt(t), al = flickerAl(t) * (1 - seg(t, TBLOW - .05, TBLOW + .25));
    const w = cW(t);
    if (t < TTRUE) {
      const wk = kind === 'tiny' ? w.walk * 1.6 : w.walk;
      shade(kind, shX(t), PB, SS, t, al, { walk: wk, key: 'main' });
    } else {
      const tw = ECH.walkOn(t, 0, SS, [[TTRUE, 0], [TTRUE + .2, 1]]), tx = P54 - tw.x;
      shade('true', tx, PB, SS, t, al, { walk: tw.walk, flip: true, key: 'true' });
      if (al > .05) ECH.ember(tx - .2 * SS, PB - 4.6 * SS, SS * .5, t, al * seg(t, TTRUE + .05, TTRUE + .4), 'trueShadow');
    }
    // lamplight behind the paper (it also lights the shadows through), dipping when a shadow flickers
    const fl = .75 + .25 * flickerAl(t);
    for (const [k, a, b] of panels) if (blowK(k, t) <= 0) glow((a + b) / 2, 500, Math.min(340, (b - a) * .9), C.amber, .38 * fl);
    for (const [k, a, b] of panels) {
      if (blowK(k, t) > 0) continue;
      push(); translate((a + b) / 2 + shiver(t) * (hash(k) - .3) * 6, (PT + PB) / 2); grid(k, b - a, PB - PT); pop();
    }
    // flying panels: shrinking away into the light, turning, lifted by the wind
    for (const [k, a, b, bk] of flying) {
      push(); translate((a + b) / 2 + (120 + 200 * hash(k * 5.1)) * bk, (PT + PB) / 2 - 520 * bk * (.6 + .6 * hash(k * 1.9)));
      rotate((hash(k * 7.3) - .5) * 1.4 * bk); scale(1 - .7 * bk);
      const { w: pw, h: ph } = paperPanel(k, a, b, t); grid(k, pw, ph);
      boilSeed('pfr' + k); paint(rectPts(-pw / 2, -ph / 2, pw, ph), { ink: WOOD, sw: 2.2 });
      pop();
    }
    // frame: head rail, posts, kickboard
    boilSeed('h-rail');
    paint(rectPts(v.x0, PT - 50, v.x1 - v.x0, 52, 2), { wash: WOOD, fill: WOOD_DK, fillOp: 90, tex: .5, ink: null });
    paint(rectPts(v.x0, PB, v.x1 - v.x0, 64, 2), { wash: WOOD, fill: WOOD_DK, fillOp: 90, tex: .5, ink: null });
    for (let x = v.x0; x < v.x1; x += 700) { inkLine([[x, PT - 2], [Math.min(v.x1, x + 700), PT - 2]], 1, PAL.ink, 'ink', 0); inkLine([[x, PB], [Math.min(v.x1, x + 700), PB]], 1, PAL.ink, 'ink', 0); }
    for (let k = 40; k < 64; k++) {
      const x = postX(k); if (x < v.x0 - 40 || x > v.x1 + 40) continue;
      boilSeed('post' + k);
      paint(rectPts(x - 17, PT - 90, 34, PB - PT + 170, 2), { wash: WOOD, fill: WOOD_DK, fillOp: 90, tex: .6, ink: PAL.ink, sw: .8 });
    }
    // the floor (engawa boards), with the screens' warm light pooled on it
    boilSeed('h-floor');
    paint(rectPts(v.x0, PB + 62, v.x1 - v.x0, 500), { wash: '#6B4834', fill: '#4A3024', fillOp: 70, tex: .5, ink: null });
    for (const y of [880, 945, 1025]) for (let x = v.x0; x < v.x1; x += 700) { boilSeed('board' + y + x); inkLine([[x, y], [Math.min(v.x1, x + 700), y + 1]], .7, '#3A261C', 'inkfine', 0); }
    for (const [k, a, b] of panels) glow((a + b) / 2, PB + 110, 200, C.amber, .25 * fl * (1 - blowK(k, t)));
    if (t > TBLOW) glow(cam.cx, PB + 80, 900, PAL.cream, .5 * blowAll);
    // Clawd
    const em = emotions(t, [[H0, 'neutral'], [bar(50) + .5, 'surprised', { emote: '!' }], [bar(52), 'nervous'], [TSTOP - .1, 'surprised', { emote: '!' }], [TBLOW, 'scared', { tintK: .15, emote: null }]], { take: .45 });
    const hd = ECH.heading(t, .25, [[bar(50) + .45, .375], [TFAST - .05, .25], [TSTOP + .25, -.125], [TBLOW - .1, 0]]);
    const o = { ...em, ...hd, walk: w.walk, boilKey: 'hClawd' };
    if (w.moving) { o.view = hd.view === 'qback' ? 'qback' : 'side'; o.flip = false; o.aL = w.aL; o.aR = w.aR; o.dy = w.dy + (em.dy || 0) * .3; o.dx = 0; o.rot = (o.rot || 0) * .3; }
    if (t > TG) {   // braced against the gust, leaning back, near arm up against the light
      const g = ease(seg(t, TG, TBLOW));
      o.rot = lerp(o.rot || 0, -.14, g) + .02 * Math.sin(t * 25) * g; o.aL = lerp(o.aL ?? .2, 1.3, g); o.aR = lerp(o.aR ?? .2, .9, g); o.sq = (o.sq || 0) + .06 * g;
    }
    ECH.masked(w.x, FY, U, o);
    camEnd();
    // foreground: hanging lanterns, nearer than the walkway (parallax), swinging in the gust
    ECH.layer(cam, 1.25, () => {
      const lv0 = 960 + (cam.cx - 960) * 1.25;
      for (let i = Math.floor((lv0 - 1300) / 820); i <= Math.floor((lv0 + 1300) / 820); i++) {
        const sw = .05 * Math.sin(t * 1.4 + i) + gustK * .35 * (1 + .3 * Math.sin(t * 9 + i)) + blowAll * .25;
        lantern(i * 820 + 300, 330 + 24 * hash(i), t, i, sw);
      }
    });
    // the gust itself
    if (t > TG - .2) {
      const g = seg(t, TG - .2, TBLOW);
      ECH.windStreaks(t, { n: Math.round(4 + 10 * g), col: PAL.cream, speed: 1600, key: 'h', sw: .9 });
      for (let i = 0; i < 18; i++) {   // scraps of paper and leaves, carried right and up
        const k = seg(t, TG + .05 * i, TG + .05 * i + 1.3); if (k <= 0 || k >= 1) continue;
        const x = lerp(-100, W + 200, k) + 200 * hash(i), y = 200 + 700 * hash(i * 3.1) - 300 * k + 40 * Math.sin(k * 9 + i);
        ECH.petal(x, y, 12 + 8 * hash(i + 2), k * 12 + i, i % 3 ? '#F4DCA8' : '#D98A5A', 'hsc' + i);
      }
    }
    if (lt < .55) FGH_shojiWipe(.5 + .5 * lt / .55);                 // G | H: the screen slides back open
    if (lt > dur - .5) flash(seg(lt, dur - .5, dur), '#FFF1D8');      // H | I: into bright light
  }
  shots([[ECH.S.H, shotH]]);
})();
