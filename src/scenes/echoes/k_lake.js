// echoes/k_lake.js: shots K (141.91–157.65, "the lake") and L (157.65–173.38, "the crack"), chorus 2.
//   K: the fog from J sinks into the flat mirror of a moonlit lake (fogVeil 1 → 0 over 1.5 s). Masked Clawd walks on the
//      waterline, Echo beneath, feet to feet, half a beat late: ripples at every step (Clawd's on the beat, Echo's off it).
//      145.84 they stop and turn front; 146.1–147.45 the camera rolls 180° (Echo on top, upright; Clawd upside-down);
//      they look at each other, Echo reaches; 148.75–149.72 it rolls back. 149.78–153.22 Echo kneels and pounds the
//      surface like glass, one pound per beat (8), rings on each hit and voice rings from its wailing mouth; Clawd
//      flinches, then gets nervous. 153.7 Clawd kneels; both reach (Echo first); 155.68 (bar 79) the arms meet at the
//      line: a glow, which flares to the cut (flash .85), camera pushing in on the touch.
//   L: the flare fades while the camera pulls back wide off the touch; they get up. 159.62 the door of light opens at
//      the far end, much closer than in G; Echo sees it and points, Clawd turns: hopeful. 161.58–165.52 they walk to it
//      in step. 165.52 (bar 84) the mask cracks (flash, take, push in); Clawd stops and touches it; 167.49 determined.
//      169.45 wind: ripples race, petals blow in from the left, the cracked mask rattles; Clawd looks back at the gust
//      and walks on with it. Ends with ECH.petalWipe 0 → .5 over the last 0.5 s.
(() => {
  const { S, C, bar } = ECH;
  const LY = 560, U = 24, LAG = BEAT / 2, PI = Math.PI;
  const SILVER = mixCol(C.moon, C.gold, .3), FLARE = mixCol(C.moon, C.goldLt, .5);
  const SHORE = '#141A3A', WTOP = mixCol(C.lakeBot, C.lakeTop, .3);
  const MX = 560, MY = LY - 340;                       // the moon, in its parallax layer
  const mod = (a, n) => ((a % n) + n) % n;
  const bi = t => Math.round((t - OFF) / BEAT);        // beat index at (or nearest) t
  const btm = n => OFF + n * BEAT;

  // ---------- camera ----------
  // A parallax layer that rolls with the camera and keeps the line where the main camera puts it.
  function lay(cam, p, fn) {
    const zp = 1 + (cam.z - 1) * p, cx = 960 + (cam.cx - 960) * p;
    camBegin(cx, LY + (cam.cy - LY) * cam.z / zp, zp, cam.rot || 0); fn(cx, zp); camEnd();
  }

  // ---------- the lake ----------
  function bands(x, y0, w, y1, c0, c1, n, key) {
    for (let i = 0; i < n; i++) {
      const a = lerp(y0, y1, i / n), b = lerp(y0, y1, (i + 1) / n);
      boilSeed(key + i);
      paint(rectPts(x, Math.min(a, b) - 2, w, Math.abs(b - a) + 4), { wash: mixCol(c0, c1, i / (n - 1)), ink: null });
    }
    for (let i = 1; i < n; i++) {
      boilSeed(key + 's' + i);
      paint(rectPts(x, lerp(y0, y1, i / n) - 60, w, 120), { fill: mixCol(c0, c1, (i - .5) / (n - 1)), fillOp: 90, bleed: .35, tex: .3, border: .1, ink: null });
    }
  }
  function moonDisc(a) {
    glow(MX, MY, 470, C.moon, .38 * a); glow(MX, MY, 150, PAL.cream, .55 * a);
    boilSeed('moon');
    paint(ellPts(MX, MY, 64, 64, 30), { wash: C.moon, washOp: 255 * a, fill: '#E1D4B2', fillOp: 90 * a, bleed: .1, tex: .6, ink: mixCol(C.moon, PAL.ink, .45), sw: .6 });
    paint(ellPts(MX - 20, MY - 12, 15, 12, 14), { fill: '#D6C7A2', fillOp: 120 * a, bleed: .1, tex: .5, ink: null });
    paint(ellPts(MX + 22, MY + 16, 10, 8, 12), { fill: '#D6C7A2', fillOp: 110 * a, bleed: .1, tex: .5, ink: null });
  }
  function shorePts(cx) {
    const x0 = Math.floor((cx - 1500) / 40) * 40, P = [];
    for (let x = x0; x <= cx + 1500; x += 40) {
      const k = Math.round(x / 40), h = 30 + 20 * Math.sin(x * .0029 + 1.3) + 14 * Math.sin(x * .0083 + .4);
      if (hash(k * 1.3) > .72) { const th = h + 26 + 30 * hash(k + 3); P.push([x - 13, LY - h - 4], [x, LY - th], [x + 13, LY - h - 4]); }
      else P.push([x, LY - h]);
    }
    P.push([P[P.length - 1][0], LY + 3], [x0, LY + 3]);
    return P;
  }
  function star(x, y, r, col, a, key) {
    boilSeed(key);
    paint(starPts(x, y, r, .35, 4), { wash: col, washOp: 255 * a, ink: null });
  }
  // o.violet: how far the underwater half has drifted to the inner world; o.wind: 0..1; o.windD: ripple travel (px)
  function lakeBG(cam, t, o = {}) {
    const v = o.violet ?? .4;
    const deep = mixCol(mixCol(C.lakeTop, C.void, .5), C.void, v);
    lay(cam, 0, () => {
      bands(-400, LY - 1350, 2720, LY, C.lakeTop, mixCol(C.lakeBot, '#6C74A8', .3), 9, 'lksky');
      bands(-400, LY, 2720, LY + 1350, WTOP, deep, 9, 'lkwat');
      boilSeed('lkinner');
      paint(ellPts(960, LY + 380, 1000, 250, 24, 10), { fill: mixCol(C.voidLt, C.violet, .3), fillOp: 40 + 70 * v, bleed: .3, tex: .3, ink: null });
    });
    // sky stars
    lay(cam, .05, (cx) => {
      const span = 2800, x0 = cx - span / 2;
      for (let i = 0; i < 24; i++) {
        const x = x0 + mod(hash(i * 3.1 + 1) * span - x0, span), y = LY - 110 - 1100 * Math.pow(hash(i * 7.3 + 2), .8), tw = .5 + .5 * Math.sin(t * 2.2 + i * 1.9);
        star(x, y, (3 + 4 * hash(i + 4)) * (.75 + .25 * tw), C.star, .5 + .4 * tw, 'lks' + i);
      }
    });
    // the moon and its reflection
    lay(cam, .1, () => {
      moonDisc(1);
      ECH.mirror(LY, () => moonDisc(.6));
    });
    // the far shore, and its reflection
    lay(cam, .3, (cx) => {
      const P = shorePts(cx);
      boilSeed('shore');
      paint(P, { wash: SHORE, ink: null });
      boilSeed('shoreR');
      ECH.mirror(LY, () => paint(P, { wash: mixCol(SHORE, WTOP, .45), washOp: 230, ink: null }));
    });
    // water: soften the reflections, then the moon path and the inner-world stars on top
    camBegin(cam.cx, cam.cy, cam.z, cam.rot || 0);
    const R = 1300 / cam.z;
    boilSeed('lkover');
    paint(rectPts(cam.cx - R, LY + 2, 2 * R, R), { wash: WTOP, washOp: 70, ink: null });
    camEnd();
    lay(cam, .1, () => {
      const wd = (o.windD || 0) * .1;
      for (let k = 0; k < 12; k++) {
        const y = LY + 18 + k * 32, w = (118 - k * 6) * (.8 + .2 * Math.sin(t * 1.7 + k * 1.3)), off = 14 * Math.sin(t * .9 + k * 2.1) + mod(wd * (1 + k * .2), 40) - 20;
        boilSeed('mpath' + k);
        inkLine([[MX - w + off, y], [MX + off, y + 2], [MX + w + off, y]], 1.5 - k * .06, C.moon, 'inkfine', .5);
      }
    });
    lay(cam, .05, (cx) => {
      const span = 2800, x0 = cx - span / 2;
      for (let i = 0; i < 34; i++) {
        const x = x0 + mod(hash(i * 5.7 + 9) * span - x0, span), y = LY + 70 + 1100 * Math.pow(hash(i * 2.9 + 6), .9), tw = .5 + .5 * Math.sin(t * 1.8 + i * 2.3);
        const col = mixCol(C.star, C.echoLt, .25 + .4 * hash(i + 2));
        if (i % 5 === 0) glow(x, y, 26, C.echoLt, .35 * tw * (.5 + v));
        star(x, y, (3 + 5 * hash(i + 7)) * (.7 + .3 * tw), col, (.35 + .45 * tw) * (.6 + .5 * v), 'lkr' + i);
      }
    });
  }
  // Ripple dashes on the water; windD slides them right (the wind makes them race).
  function ripplesW(cam, t, windD = 0, wk = 0) {
    const R = 1300 / cam.z, span = 2 * R, x0 = cam.cx - R;
    for (let i = 0; i < 32; i++) {
      const y = LY + 10 + 520 * Math.pow(hash(i * 3.7 + 1), 1.3), base = hash(i * 5.1 + 2) * 2600 + 30 * Math.sin(t * .6 + i) + windD * (.6 + .6 * hash(i + 4));
      const x = x0 + mod(base - x0, span), w = (26 + 90 * hash(i + 8)) * (1 + 1.2 * wk);
      boilSeed('rw' + i);
      inkLine([[x - w, y], [x, y + 1.5], [x + w, y]], .55 + .3 * wk, mixCol(C.rain, PAL.cream, .5), 'inkfine', .5);
    }
  }
  // The waterline: a silver ink line with a soft glow; bumps = [[x, amp]] bulge it up where Echo hits it.
  function lakeLine(cam, t, bumps = [], k = 1) {
    if (k <= .01) return;
    const R = 1300 / cam.z, x0 = cam.cx - R, x1 = cam.cx + R;
    for (let x = Math.floor(x0 / 220) * 220; x <= x1; x += 220) glow(x, LY, 80, SILVER, .3 * k);
    for (const [bx, a] of bumps) if (a > .5) glow(bx, LY - a * .5, 60 + 4 * a, C.echoLt, .5);
    boilSeed('lkline');
    for (let a = x0; a < x1; a += 500) {
      const P = [];
      for (let i = 0; i <= 10; i++) {
        const x = lerp(a, Math.min(x1, a + 500), i / 10);
        let y = LY + jit(1);
        for (const [bx, am] of bumps) y -= am * Math.exp(-Math.pow((x - bx) / 70, 2));
        P.push([x, y]);
      }
      inkLine(P, 1.5 * k, SILVER, 'ink', .4);
    }
  }
  // The fog from J settling flat onto the lake (world space, above and reflected).
  function fogBand(cam, t, lt) {
    const k = 1 - ease(seg(lt, .4, 3.4)); if (k <= .01) return;
    const h = lerp(40, 420, Math.pow(k, 1.4)), R = 1300 / cam.z;
    for (let i = 0; i < 12; i++) {
      const r = i % 3, x = cam.cx - R + (i + .5 * r) * 2 * R / 11 + 90 * Math.sin(t * .35 + i * 1.7), y = h * (.12 + .32 * r);
      boilSeed('fb' + i);
      paint(ellPts(x, LY - y, 620 + 120 * hash(i), 18 + h * .13, 22, 3), { wash: mixCol(C.fog, PAL.cream, .3), washOp: (70 - 12 * r) * k, ink: null, curv: .6 });
      boilSeed('fbr' + i);
      paint(ellPts(x + 60, LY + y * .7, 620 + 120 * hash(i + 1), 14 + h * .09, 22, 3), { wash: C.fog, washOp: (40 - 8 * r) * k, ink: null, curv: .6 });
    }
  }

  // ---------- acting helpers ----------
  // Where the tip of a front-view arm of length L (in u) lands in world space: the same maths as clawd().
  function armTip(x, y, u, o, side, L) {
    const a = side > 0 ? (o.aR ?? .2) : (o.aL ?? .2), px = (4.9 + .55 * clamp((Math.abs(a) - .7) / .9)) * side;
    const lx = (px + side * L * Math.cos(a)) * u, ly = (-4.5 - L * Math.sin(a)) * u;
    const sq = o.sq || 0, X = lx * (1 + sq * .6), Y = ly * (1 - sq), r = o.rot || 0;
    return [x + (o.dx || 0) * u + X * Math.cos(r) - Y * Math.sin(r), y + (o.dy || 0) * u + X * Math.sin(r) + Y * Math.cos(r)];
  }
  // How much longer that arm must stretch (in u) for its tip to touch the line (y = LY in the drawing space).
  function reachExt(x, u, o, side, ty = LY) {
    const y0 = armTip(x, LY, u, o, side, 2.2)[1], y1 = armTip(x, LY, u, o, side, 3.2)[1];
    if (Math.abs(y1 - y0) < 1e-3) return 0;
    return clamp((ty - y0) / (y1 - y0), 0, 2.4);
  }
  // Echo is drawn mirrored under the line, then (when it lets go of the line) somersaulted by th about its middle and
  // sunk by drift px: at th = PI it floats upright under the surface, head toward the line.
  const ECY = 4 * U;
  function echoToScreen(e, [lx, ly]) {
    const cx = e.x, cy = LY + ECY, px = lx - cx, py = 2 * LY - ly - cy, c = Math.cos(e.th), s = Math.sin(e.th);
    return [cx + px * c - py * s, cy + px * s + py * c + e.drift];
  }
  // local y an upright Echo's arm must reach for its tip to touch the line on screen
  const echoLineY = e => LY - 2 * ECY - e.drift;
  function drawEcho(e) {
    push(); translate(0, e.drift); translate(e.x, LY + ECY); rotate(e.th); translate(-e.x, -(LY + ECY));
    ECH.mirror(LY, () => ECH.echo(e.x, LY, U, e.o));
    pop();
  }
  // A cartoon stretch: the arm grows ext u longer (drawn from the arm tip, in arm space).
  const stretch = (ext, cols) => ext > .03 ? (u, sw) => {
    paint(rectPts(-.4 * u, -.5 * u, (ext + .4) * u, u), { wash: cols.col, washOp: 255, fill: cols.dk, fillOp: 60, tex: .5, ink: null });
    inkLine([[-.3 * u, -.5 * u], [ext * u, -.5 * u], [ext * u + .08 * u, 0], [ext * u, .5 * u], [-.3 * u, .5 * u]], sw * .8, PAL.ink, 'ink', 0);
  } : undefined;
  // Blend a walkOn() result in; the legs settle into the four-feet-down drawing as the walk stops.
  function walkPose(w, e, tStop, t) {
    const k = ease(seg(t, tStop - .35, tStop)), ct = Math.round((w.walk - .25) * 2) / 2 + .25;
    return { walk: lerp(w.walk, ct, k), dy: w.dy + (e.dy || 0) * .25, aL: w.aL, aR: w.aR, rot: (e.rot || 0) * .3, sq: (e.sq || 0) * .5 };
  }
  // Step rings on the water for a walker: one per beat while it is moving.
  function stepRings(t, tA, tB, lag, posAt, speedAt, col, key) {
    for (let n = bi(Math.max(tA, t - 1.5)) - 1; n <= bi(Math.min(tB, t)); n++) {
      const tb = btm(n) + lag, age = t - tb;
      if (btm(n) < tA - .01 || btm(n) > tB + .01 || age < 0 || age > 1.4 || speedAt(btm(n)) < .5) continue;
      ECH.rings(posAt(btm(n)), LY, age, { n: 2, gap: .2, life: 1.4, speed: 170, ry: .2, sw: 1, col, key: key + n });
    }
  }

  // ---------- K: poses ----------
  const WK = [[S.K - BEAT / 2, 1], [bar(74) - 2 * BEAT, 1], [bar(74), 0]];
  const XK0 = 1000, cw = t => ECH.walkOn(t, XK0, U, WK), cwSpeed = t => kf(t, WK, x => clamp(x));
  const XS = cw(S.L).x;
  const H0 = bar(76), HITS = [...Array(7)].map((_, i) => H0 + (i + 1) * BEAT), FOFF = .07, FLIP = [149.3, 149.8];
  const CK = [[S.K - 2, 'neutral'], [147.3, 'sad', { emote: null, gloom: 0 }], [H0 + .06, 'surprised'], [bar(77), 'nervous'], [153.5, 'sad', { emote: null, gloom: 0 }]];
  const EK = [[S.K - 2, 'sad', { emote: null, lookY: .5 }], [147.1, 'sad', { emote: null, lookY: 1 }], [149.4, 'cry', { lookY: .6 }], [153.4, 'sad', { emote: null, lookY: 1 }], [154.05, 'hopeful', { lookY: 1, lookX: .3 }]];

  // an upright Echo's arm while pounding: cocked down (REST), slammed up against the surface (HIT) on each beat
  function poundArm(t, off, base) {
    const tt = t - off, HIT = 1.3, REST = -.05, h0 = HITS[0], hl = HITS[HITS.length - 1];
    if (tt < h0 - .2) return lerp(base, REST, ease(seg(tt, FLIP[0], FLIP[1] + .1)));
    if (tt < h0) return lerp(REST, HIT, easeIn(seg(tt, h0 - .2, h0)));
    if (tt >= hl) return lerp(HIT, .45, ease(seg(tt, hl + .15, hl + .7)));
    const i = Math.floor((tt - h0) / BEAT), f = (tt - h0) / BEAT - i;
    if (f < .2) return HIT;
    if (f < .64) return lerp(HIT, REST, easeOut(seg(f, .2, .64)));
    return lerp(REST, HIT, easeIn(seg(f, .62, 1)));
  }
  // 1 at a fist's impact (and just before it), fading as the arm lifts: drives the stretch and the lunge
  function hitK(t, off) {
    const tt = t - off; let k = 0;
    for (const h of HITS) { const a = tt - h; if (a >= 0) k = Math.max(k, a < .09 ? 1 : Math.exp(-(a - .09) * 16)); else if (a > -.06) k = Math.max(k, 1 + a / .06); }
    return k;
  }
  const lastHitAge = t => { let a = 9; for (const h of HITS) if (t >= h) a = t - h; return a; };
  function kneelK(t, t0, dur = .38) { return easeOut(seg(t, t0, t0 + dur)); }

  function clawdK(t) {
    const w = cw(t), e = emotions(t, CK, { take: .8 }), hd = ECH.heading(t, .25, [[145.95, 0]]);
    const o = { ...e, ...hd, boilKey: 'clawdKL' };
    if (t < 145.95) Object.assign(o, walkPose(w, e, bar(74), t));
    o.sq = (o.sq || 0) + .06 * ring(t, HITS, 9, 24);
    const kn = kneelK(t, 153.7);
    if (kn > 0) {
      o.dy = lerp(o.dy || 0, 1.95, kn); o.noLegs = kn > .3;
      o.sq = (o.sq || 0) * (1 - kn) + .12 * Math.exp(-9 * Math.max(0, t - 154.08)) * (t > 154.08 ? 1 : 0);
      o.aL = lerp(o.aL ?? .2, -.35, kn);
    }
    const ra = kf(t, [[154.25, 0], [154.8, .5], [155.2, .55], [155.68, 1]]);
    if (ra > 0) { o.aR = lerp(o.aR ?? .2, -1.35, ra); o.rot = lerp(o.rot || 0, .1, ra); }
    const ext = reachExt(w.x, U, o, 1) * ease(seg(t, 155.3, 155.68));
    o.armR = stretch(ext, tintCols(o));
    o.emberK = .7 * ease(seg(t, 155.6, 156.2));
    return { x: w.x, o, ext };
  }
  function echoK(t) {
    const w = cw(t - LAG), e = emotions(t, EK, { take: .8 }), hd = ECH.heading(t, .25, [[146.3, 0]]);
    const o = { ...e, ...hd, boilKey: 'echoKL', halo: .5 };
    if (t < 146.3) Object.assign(o, walkPose(w, e, bar(74) + LAG, t));
    // on top during the roll it reaches toward Clawd
    const rk = kf(t, [[147.65, 0], [148.0, 1], [148.5, 1], [148.95, 0]]);
    if (rk > 0) o.aR = lerp(o.aR ?? .2, -1.0, rk);
    // lets go of the line and somersaults upright under the surface, then pounds on it
    const fk = ease(seg(t, FLIP[0], FLIP[1])), ha = lastHitAge(t);
    const E = { x: w.x, o, th: PI * fk, drift: .35 * U * fk };
    if (fk > 0) {
      o.noShadow = true;
      o.dy = (o.dy || 0) * (1 - fk) - .45 * Math.exp(-ha * 10);
      o.sq = (o.sq || 0) * .4 + .1 * Math.exp(-ha * 9) - .12 * Math.sin(fk * PI);
      if (t < 154.6) { o.aL = poundArm(t, 0, o.aL ?? .2); o.aR = poundArm(t, FOFF, o.aR ?? .2); }
      if (t > 149.7 && t < 153.5) o.mouth = frac((t - H0) / BEAT) < .55 ? 'wail' : 'open';
    }
    let extL = 0, extR = 0;
    if (t > HITS[0] - .1 && t < 153.6) {
      extL = reachExt(w.x, U, o, -1, echoLineY(E)) * hitK(t, 0);
      extR = reachExt(w.x, U, o, 1, echoLineY(E)) * hitK(t, FOFF);
    }
    // reaches up to Clawd's hand: its left arm (the right one on screen, as it is turned over)
    const ra = kf(t, [[154.1, 0], [154.6, .6], [155.0, .6], [155.6, 1]]);
    if (t >= 154.1) {
      o.aR = lerp(o.aR, -.2, ease(seg(t, 154.1, 154.6)));
      o.aL = lerp(o.aL, 1.35, ra); o.rot = lerp(o.rot || 0, -.08, ra); o.sq = (o.sq || 0) * (1 - ra) + .02;
      // drift sideways so the hands meet
      const rel = armTip(0, LY, U, o, -1, 2.2)[0];
      E.x = lerp(w.x, XC0 + rel, ease(seg(t, 154.1, 155.5)));
      extL = reachExt(E.x, U, o, -1, echoLineY(E)) * ease(seg(t, 155.2, 155.6));
    }
    o.armL = stretch(extL, ECH.ECHO_COL); o.armR = stretch(extR, ECH.ECHO_COL);
    return E;
  }
  const XC = (() => { const c = clawdK(S.L - .001); return armTip(c.x, LY, U, { ...c.o }, 1, 2.2 + c.ext)[0]; })(), XC0 = XC;

  function camK(t) {
    const x = cw(t).x;
    const off = kf(t, [[S.K, 150], [145.0, 150], [146.1, 0], [153.7, 0], [155.68, XC - XS]]);
    const z = kf(t, [[S.K, 1.15], [145.3, 1.02], [146.0, 1.02], [146.6, .92], [147.2, 1.05], [148.6, 1.05], [148.98, .96], [149.35, 1.02], [H0, 1.1], [153.7, 1.12], [155.68, 1.38], [S.L, 1.45]]);
    const rot = kf(t, [[146.0, 0], [147.2, PI], [148.6, PI], [149.35, 0]]);
    const sh = t > H0 - .05 && t < 153.6 ? shakeXY(t, 6 * Math.exp(-lastHitAge(t) * 9)) : [0, 0];
    return { cx: x + off + sh[0], cy: LY + sh[1], z, rot };
  }

  function shotK(t, lt, dur) {
    const cam = camK(t), v = lerp(.25, .85, ease(seg(t, S.K, 155.7)));
    lakeBG(cam, t, { violet: v });
    camBegin(cam.cx, cam.cy, cam.z, cam.rot);
    ripplesW(cam, t);
    fogBand(cam, t, lt);
    const c = clawdK(t), e = echoK(t);
    // Echo, mirrored under the line
    drawEcho(e);
    // the waterline, bulging up where Echo's fists hit it
    const bumps = [];
    for (const [side, off] of [[-1, 0], [1, FOFF]]) for (const h of HITS) {
      const a = t - h - off; if (a < 0 || a > 1) continue;
      const eh = echoK(h + off + .001), tipX = echoToScreen(eh, armTip(eh.x, LY, U, eh.o, side, 2.2 + reachExt(eh.x, U, eh.o, side, echoLineY(eh))))[0];
      bumps.push([tipX, 14 * Math.exp(-a * 7)]);
      ECH.rings(tipX, LY, a, { n: 3, gap: .16, life: 1.2, speed: 300, ry: .28, sw: 1.3, col: C.echoLt, key: 'hit' + side + h.toFixed(2) });
    }
    lakeLine(cam, t, bumps, ease(seg(lt, .3, 2)));
    stepRings(t, S.K, bar(74), 0, tb => cw(tb).x, cwSpeed, PAL.cream, 'cs');
    stepRings(t, S.K, bar(74), LAG, tb => cw(tb).x, cwSpeed, C.echoLt, 'es');
    // Echo's cries: rings from its mouth every other pound, crossing the line into Clawd's world
    for (let i = 0; i < 7; i += 2) {
      const a = t - HITS[i]; if (a < 0 || a > 1.7) continue;
      ECH.rings(e.x, LY + 3.7 * U + e.drift, a, { n: 3, gap: .18, life: 1.7, speed: 620, sw: 1.2, col: mixCol(PAL.cream, C.echoLt, .5), key: 'cry' + i });
    }
    ECH.masked(c.x, LY, U, c.o);
    // the touch
    const gk = ease(seg(t, 155.6, 155.95)), fk = easeIn(seg(t, 156.9, S.L));
    if (gk > 0) {
      glow(XC, LY, (130 + 40 * pulse(t, 4)) * gk + 1000 * fk, FLARE, .8 * gk + .2 * fk);
      glow(XC, LY, (50 + 16 * pulse(t, 4)) * gk + 300 * fk, PAL.cream, .9 * gk);
    }
    camEnd();
    if (lt < 1.5) ECH.fogVeil(1 - ease(lt / 1.5), t);
    flash(.85 * fk, FLARE);
  }

  // ---------- L: poses ----------
  const WL = [[161.4, 0], [161.58, 1], [bar(84), 1], [bar(84) + BEAT, 0], [171.2, 0], [bar(87), 1]];
  const lw = t => ECH.walkOn(t, XS, U, WL), lwSpeed = t => kf(t, WL, x => clamp(x));
  const XD = XS + 1150, TC = bar(84);
  const CL = [[S.L - 2, 'sad', { emote: null, gloom: 0 }], [158.7, 'neutral'], [160.35, 'hopeful'], [TC, 'surprised'], [165.95, 'sad', { emote: null, gloom: 0 }], [bar(85), 'determined']];
  const EL = [[S.L - 2, 'hopeful', { lookY: 1, lookX: .3 }], [159.95, 'hopeful', { lookY: 0, lookX: .8 }], [TC + .1, 'surprised', { lookY: 1, emote: null }], [166.5, 'hopeful', { lookY: 1 }], [169.9, 'hopeful', { lookY: .3 }]];
  const walking = t => (t > 161.4 && t < TC + BEAT + .3) || t > 171.2;
  const windK = t => ease(seg(t, bar(86), 171.4));

  function clawdL(t) {
    const w = lw(t), e = emotions(t, CL, { take: .8 }), hd = ECH.heading(t, 0, [[160.25, .25], [169.95, -.12], [171.05, .25]]);
    const o = { ...e, ...hd, boilKey: 'clawdKL' };
    if (o.view === 'side' && t > 160.3) Object.assign(o, walkPose(w, e, walking(t) && t < 170 ? TC + BEAT : 999, t));
    // still kneeling from K, arm on the water; lets go and stands up
    const kn = 1 - ease(seg(t, 158.25, 158.7)), rel = ease(seg(t, 157.95, 158.45));
    if (kn > 0) { o.dy = lerp(o.dy || 0, 1.95, kn); o.noLegs = kn > .3; o.aL = lerp(o.aL ?? .2, -.35, kn); }
    o.aR = lerp(-1.35, o.aR ?? .2, rel); o.rot = lerp(.1, o.rot || 0, rel);
    const ext = reachExt(w.x, U, o, 1) * (1 - ease(seg(t, 157.8, 158.1)));
    o.armR = stretch(ext, tintCols(o));
    o.emberK = .7 * (1 - ease(seg(t, 157.9, 159)));
    // the crack, then the touch
    o.maskCrack = easeOut(seg(t, TC, TC + .14));
    const tk = kf(t, [[165.85, 0], [166.25, 1], [167.15, 1], [167.5, 0]]);
    if (tk > 0) {
      o.aL = lerp(o.aL ?? .2, 1.95, tk); o.rot = (o.rot || 0) + .04 * Math.sin((t - 166.25) * 5) * tk;
      // the side view draws the mask over the near arm, so the touching arm is drawn again on top of it
      const aT = o.aL, cols = tintCols(o);
      o.draw = (u, sw) => { push(); translate(1.6 * u, -4.2 * u); rotate(.7 - aT); paint(rectPts(-.2 * u, -.45 * u, 2.3 * u, .9 * u), { wash: cols.col, washOp: 255, fill: cols.dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 }); pop(); };
    }
    const wk = windK(t);
    if (wk > 0) {
      o.maskTilt = wk * (.05 * Math.sin(t * 31) + .03 * Math.sin(t * 17 + 1));
      if (t > 171.2) o.rot = (o.rot || 0) + .06 * wk;
    }
    return { x: w.x, o };
  }
  function echoL(t) {
    const w = lw(t), e = emotions(t, EL, { take: .8 }), hd = ECH.heading(t, 0, [[159.95, .25], [165.9, 0], [168.9, .25], [169.85, -.12], [171.0, .25]]);
    const o = { ...e, ...hd, boilKey: 'echoKL', halo: .5 };
    if (o.view === 'side' && t > 160) Object.assign(o, walkPose(w, e, t < 168 ? TC + BEAT : (t < 171 ? 0 : 999), t));
    if (o.view === 'side' && t > 168 && t < 171.2) { o.walk = Math.round((w.walk - .25) * 2) / 2 + .25; }
    // still floating upright from K, hand on the surface: lets go and somersaults back onto its feet under the line
    const rel = ease(seg(t, 157.95, 158.4)), fk = 1 - ease(seg(t, 158.2, 158.7));
    o.aL = lerp(1.35, o.aL ?? .2, rel); o.aR = lerp(-.2, o.aR ?? .2, rel); o.rot = lerp(-.08, o.rot || 0, rel);
    if (rel < 1) o.sq = lerp(.02, o.sq || 0, rel) - .12 * Math.sin(fk * PI) * (fk < 1 ? 1 : 0);
    if (fk > 0) o.noShadow = true;
    const E = { x: w.x, o, th: PI * fk, drift: .35 * U * fk };
    E.x = lerp(w.x, XC0 + armTip(0, LY, U, { ...o, aL: 1.35, rot: -.08, sq: .02 }, -1, 2.2)[0], fk);
    const ext = reachExt(E.x, U, o, -1, echoLineY(E)) * (1 - ease(seg(t, 157.8, 158.1)));
    o.armL = stretch(ext, ECH.ECHO_COL);
    // Echo points at the door
    const pk = kf(t, [[160.3, 0], [160.55, 1], [161.25, 1], [161.5, 0]]);
    if (pk > 0) o.aL = lerp(o.aL ?? .2, 1.05, pk);
    // after the crack: looks up at Clawd and opens its arms, hopeful
    const ok = kf(t, [[166.6, 0], [167.1, 1], [168.6, 1], [168.9, 0]]);
    if (ok > 0) { o.aL = lerp(o.aL ?? .2, .9, ok); o.aR = lerp(o.aR ?? .2, .7, ok); }
    if (windK(t) > 0 && t > 171.2) o.rot = (o.rot || 0) + .06 * windK(t);
    return E;
  }

  function camL(t) {
    const x = lw(t).x;
    const off = kf(t, [[S.L, XC - XS], [159.8, 470], [161.5, 470], [165.0, 170], [TC + .6, 70], [bar(86), 80], [171.4, 300], [173.4, 320]]);
    const cy = kf(t, [[165.0, LY], [TC + .6, LY - 70], [bar(86), LY - 70], [171.4, LY]]);
    const z = kf(t, [[S.L, 1.45], [159.8, .85], [161.5, .85], [165.0, 1.0], [TC, 1.12], [TC + .6, 1.35], [bar(86), 1.38], [171.4, 1.0], [173.4, .96]]);
    const sa = 10 * Math.exp(-Math.max(0, t - TC) * 6) * (t >= TC ? 1 : 0) + 3 * windK(t), sh = shakeXY(t, sa);
    return { cx: x + off + sh[0], cy: cy + sh[1], z, rot: 0 };
  }

  // screen-space gust: wind streaks and petals from the left
  function gust(t) {
    const wk = windK(t); if (wk <= 0) return;
    for (let i = 0; i < 14; i++) {
      const ts = bar(86) + i * .2 + .2 * hash(i); if (t < ts) continue;
      const per = 1.1 + .5 * hash(i + 2), a = mod(t - ts, per), x = -520 + a / per * (W + 1040), y = 90 + (H - 180) * hash(i * 5.3 + 1), L = 240 + 160 * hash(i + 3);
      const P = []; for (let k = 0; k <= 6; k++) P.push([x + L * k / 6, y + 14 * Math.sin(k * .9 + t * 3 + i)]);
      if (hash(i + 11) > .55) P.push([x + L + 28, y - 26], [x + L, y - 46], [x + L - 18, y - 24]);
      boilSeed('lgw' + i);
      inkLine(P, .8, PAL.cream, 'inkfine', .6);
    }
    const PC = ['#F2B8C6', PAL.cream, '#E7A3B4', C.hillTop];
    for (let i = 0; i < 90; i++) {
      const ts = 169.6 + 3.5 * Math.pow(i / 90, .8) + .12 * hash(i * 1.9); if (t < ts) continue;
      const a = t - ts, v = 620 + 520 * hash(i + 1), x = -60 + a * v; if (x > W + 80) continue;
      const y = H * (.05 + .9 * hash(i * 2.7 + 3)) + 50 * Math.sin(a * 3 + i) - a * 60 * (hash(i + 5) - .3);
      ECH.petal(x, y, 20 + 16 * hash(i + 6), a * 7 * (hash(i + 8) - .5) * 2 + i, PC[i % 4], 'lp' + i);
    }
  }

  function shotL(t, lt, dur) {
    const cam = camL(t), wk = windK(t), windD = ECH.dist(t, [[bar(86), 0], [171.4, 750]]);
    lakeBG(cam, t, { violet: .85, windD });
    camBegin(cam.cx, cam.cy, cam.z, 0);
    ripplesW(cam, t, windD, wk);
    // the door of light at the far end, standing on the line
    const dk = ease(seg(t, bar(81), 160.9));
    if (dk < 1 && t > bar(81) - .3) glow(XD, LY, 40 + 200 * dk, C.goldLt, clamp((t - bar(81) + .3) / .3) * (1 - dk));
    ECH.door(XD, LY, 420, dk * (1 + .15 * wk), t, { key: 'L' });
    const c = clawdL(t), e = echoL(t);
    drawEcho(e);
    lakeLine(cam, t);
    stepRings(t, 161.4, 173.4, 0, tb => lw(tb).x, lwSpeed, PAL.cream, 'lcs');
    stepRings(t, 161.4, 173.4, .03, tb => lw(tb).x, lwSpeed, C.echoLt, 'les');
    // the touch glow fading from K's flare
    const fk = 1 - ease(seg(lt, 0, 1.1));
    if (fk > 0) { glow(XC, LY, 170 + 1000 * fk * fk, FLARE, .8 * fk + .2); glow(XC, LY, 60 + 300 * fk, PAL.cream, .9 * fk); }
    else glow(XC, LY, 170 * (1 - ease(seg(lt, 1.1, 2.4))) + 1, FLARE, .9 * (1 - ease(seg(lt, 1.1, 2.4))));
    ECH.masked(c.x, LY, U, c.o);
    // the crack's flash on the mask
    const ca = t - TC;
    if (ca > 0 && ca < 1) glow(c.x + 1.2 * U, LY - 5.6 * U, 90 + 160 * ca, PAL.cream, Math.exp(-ca * 5));
    camEnd();
    flash(.85 * (1 - ease(lt / .9)), FLARE);
    if (ca > 0 && ca < .5) flash(.3 * Math.exp(-ca * 9), PAL.cream);
    gust(t);
    if (lt > dur - .5) ECH.petalWipe((lt - (dur - .5)) / 1, t);
  }

  shots([[ECH.S.K, shotK], [ECH.S.L, shotL]]);
})();
