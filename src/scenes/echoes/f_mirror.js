// echoes/f_mirror.js: shots F (63.22 → 78.96, "the mirror line") and G (78.96 → 94.70, "the door on the line").
// Chorus 1. See STORYBOARD_echoes.md. One world for both shots: the line lies exactly across the middle of the frame
// (world y = LY, the camera's cy is always LY, so zooms keep it centred). Above: masked Clawd in the night city.
// Below: Echo, upside-down, in the inner world (violet void, stars, hanging paper cut-outs), holding the ember.
//   F 63.22  splash wipe .5 → 1 reveals the mirror frame; both walk right (Echo half a beat late); camera tracks.
//     66.17  Clawd slows to a stop on the beat; Echo walks two more steps.
//     68.14  Echo turns back and looks up; 69.12 Clawd leans down: confused '?'.
//     71.09  Echo calls (three bursts on 71.09 / 72.07 / 73.05): rings cross the line and ripple it.
//     74.04  the rings echo from building to building above (74.04, 75.02, 76.00, 76.99): windows light in rings.
//            Clawd turns to camera and clutches its mask, trembling.
//     77.97  the last echo rings out on the line far right; the camera pans right with it into G.
//   G 79.26  a point of light on the line there; 80.93 it opens into the door (half above, half below).
//     80.25  Echo turns to it; 83.87 Echo points; 84.85 Clawd hopeful, steps over to stand right above Echo.
//     86.83  they walk toward it IN SYNC (lag 0) while the camera pulls wide; the door drifts on, staying far.
//     92.73  the door dims; a ring from it sweeps the frame; they stop, sad. 94.15 a paper screen slides across (→ H).
(() => {
  const { C, S, bar } = ECH;
  const LY = 540, U = 26, B = BEAT, X0 = 700, LAG = B / 2;
  const F0 = S.F, G0 = S.G, H0 = S.H;
  const TS = bar(33.5), TE = TS + 2 * B;                    // Clawd stops; Echo stops two steps later
  const TTURN = bar(34.5), TQ = bar(35);
  const CALLS = [bar(36), bar(36.5), bar(37)];
  const EV = [[bar(37.5), 540, 250], [bar(38), 1390, 205], [bar(38.5), 250, 320], [bar(39), 1660, 240]];   // echoes: screen pos at the time
  const TLAST = bar(39.5), TCLUTCH = bar(37.5) + .1;
  const TLIGHT = bar(40) + .3, TOPEN = bar(41), TEYES = bar(40.5) + .3, TPOINT = bar(42.5), THOPE = bar(43), TCATCH = THOPE + B / 2;
  const TW = bar(44), TDIM = bar(47), TSW = TDIM + .2;
  const WALK_G = [[TW, 0], [TW + .5 * B, 1], [TW + 12.25 * B, 1], [TW + 14.25 * B, 0]];
  const KC = [[F0, 1], [TS - 2 * B, 1], [TS, 0], [TCATCH, 0], [TCATCH + .5 * B, 1], [TCATCH + 2 * B, 1], [TCATCH + 2.5 * B, 0], ...WALK_G];
  const KE = [[F0, 1], [TE - 2 * B, 1], [TE, 0], ...WALK_G];
  const teOf = t => t < 80 ? t - LAG : t;                   // Echo's clock: half a beat late in F, in sync in G

  const cW = t => ECH.walkOn(t, X0, U, KC);
  const eW = t => ECH.walkOn(teOf(t), X0, U, KE);
  const XW = X0 + 7 * 2 * U;                                 // where both stand when the sync walk starts
  const DX0 = XW + 1050;
  const doorX = t => DX0 + 1.8 * Math.max(0, cW(t).x - XW);  // it drifts on as they walk: it stays far

  function camAt(t) {
    const off = kf(t, [[F0, 150], [TS, 175], [TTURN + .4, 230], [TLAST, 230], [TLAST + 1.7, 560], [TW, 560], [bar(46.5), 400]]);
    const z0 = kf(t, [[F0, 1.1], [F0 + 2.8, .96], [TS, 1], [CALLS[0], 1.05], [EV[0][0], 1], [TW, 1], [bar(46.5), .62], [H0, .6]]);
    const bump = .012 * Math.exp(-frac(bpOf(t) / 4) * 8);   // a small push on every downbeat
    return { cx: cW(t).x + off, cy: LY, z: z0 * (1 + bump) };
  }
  const viewOf = (cam, p = 1, m = 120) => {
    const lz = 1 + (cam.z - 1) * p, lcx = 960 + (cam.cx - 960) * p;
    return { x0: lcx - 960 / lz - m, x1: lcx + 960 / lz + m, y0: 540 - 540 / lz - m, y1: 540 + 540 / lz + m, lz, lcx };
  };
  const toLayer = (cam, p, sx, sy) => { const v = viewOf(cam, p, 0); return [v.lcx + (sx - 960) / v.lz, 540 + (sy - 540) / v.lz]; };

  // ---------- rings as arcs (big circles lose their outline in p5.brush, so draw only the visible runs) ----------
  function arcRing(cx, cy, r, sw, col, v, key, yMax = Infinity) {
    if (r < 2 || sw < .05) return;
    const N = Math.max(40, Math.ceil(TAU * r / 36)), runs = [];
    let run = [];
    for (let i = 0; i <= N; i++) {
      const a = i / N * TAU, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const ok = x > v.x0 && x < v.x1 && y > v.y0 && y < Math.min(v.y1, yMax);
      if (ok) { run.push([x, y]); if (run.length >= 22) { runs.push(run); run = [[x, y]]; } }
      else if (run.length) { runs.push(run); run = []; }
    }
    if (run.length) runs.push(run);
    boilSeed('arc' + key);
    for (const R of runs) if (R.length > 1) inkLine(R, sw, col, 'ink', .4);
  }
  const ringR = a => 20 + 1150 * easeOut(a / 2.2);          // echoes among the buildings
  const callR = a => 20 + 900 * easeOut(a / 1.8);           // Echo's voice
  const sweepR = a => 30 + 3300 * easeOut(a / 1.7);         // the door's last ring

  // Every ring crossing the line bends it locally: a list of { x, amp, w }.
  function lineBumps(t) {
    const B2 = [];
    const [mx, my] = mouthAt();
    for (const tc of CALLS) for (let k = 0; k < 3; k++) {
      const a = t - tc - k * .16; if (a < 0 || a > 1.8) continue;
      const r = callR(a), d = my - LY; if (r <= d) continue;
      const xi = Math.sqrt(r * r - d * d), amp = 18 * Math.pow(1 - a / 1.8, 1.5) * (k ? .6 : 1);
      B2.push({ x: mx - xi, amp, w: 36 + .08 * xi }, { x: mx + xi, amp, w: 36 + .08 * xi });
    }
    const a4 = t - TLAST;
    if (a4 > 0 && a4 < 2.2) { const r = ringR(a4), dx = doorX(TLAST); B2.push({ x: dx - r, amp: 14 * (1 - a4 / 2.2), w: 50 }, { x: dx + r, amp: 14 * (1 - a4 / 2.2), w: 50 }); }
    const a5 = t - TSW;
    if (a5 > 0 && a5 < 1.7) { const r = sweepR(a5); B2.push({ x: doorX(TSW) - r, amp: 22 * (1 - a5 / 1.7), w: 70 }); }
    return B2;
  }
  function theLine(v, bumps, t) {
    const pk = 1 + .6 * pulse(t, 5);
    for (let x = Math.floor(v.x0 / 180) * 180; x < v.x1; x += 180) glow(x, LY, 95, C.gold, .42 * pk);
    boilSeed('fg-line');
    let P = [];
    for (let x = v.x0; x <= v.x1 + 20; x += 20) {
      let dy = 0; for (const b of bumps) dy += b.amp * Math.exp(-Math.pow((x - b.x) / b.w, 2));
      P.push([x, LY - dy + jit(.8)]);
      if (P.length >= 30) { inkLine(P, 1.9, C.gold, 'ink', .4); P = [P[P.length - 1]]; }
    }
    if (P.length > 1) inkLine(P, 1.9, C.gold, 'ink', .4);
    for (const b of bumps) if (b.amp > 6) glow(b.x, LY - b.amp * .6, 70, C.goldLt, b.amp / 22);
  }

  // ---------- the city above ----------
  const SLOT = 290;
  const bld = i => ({ x: i * SLOT + 30 * hash(i * 3.1 + 1), w: 185 + 85 * hash(i * 5.3 + 2), h: 170 + 250 * hash(i * 7.7 + 3), c: mixCol(C.wall, C.wallDk, hash(i * 2.9 + 4)) });
  function echoesIn(cam0) {   // the echo origins in the near layer's own coordinates (fixed once they ring out)
    const L = EV.map(([te, sx, sy]) => { const [x, y] = toLayer(camAt(te), .6, sx, sy); return { t: te, x, y }; });
    const cl = camAt(TLAST), sx = 960 + (doorX(TLAST) - cl.cx) * cl.z, [x, y] = toLayer(cl, .6, sx, LY);
    L.push({ t: TLAST, x, y, last: true });
    return L;
  }
  function winLight(seed, x, y, t, evs) {
    let L = hash(seed) < .13 ? .55 : 0, fl = 0;
    for (let e = 0; e < evs.length; e++) {
      const ev = evs[e], a = t - ev.t; if (a < 0) continue;
      const d = Math.hypot(x - ev.x, y - ev.y), r = ringR(a);
      if (a < 3) fl = Math.max(fl, Math.exp(-Math.pow((d - r) / 55, 2)) * clamp(1 - a / 3));
      if (d < r && hash(seed * 1.7 + e * 3.3) < .7) L = Math.max(L, lerp(.95, .62, clamp((a - d / 600) / 5)));
    }
    return [L, fl];
  }
  function city(t, v, evs) {
    const G = [];
    for (let i = Math.floor(v.x0 / SLOT) - 1; i <= Math.floor(v.x1 / SLOT); i++) {
      const b = bld(i), dark = mixCol(b.c, PAL.ink, .35);
      boilSeed('fgb' + i);
      paint(rectPts(b.x, LY - b.h, b.w, b.h + 4, 2), { wash: b.c, fill: mixCol(b.c, PAL.ink, .3), fillOp: 50, tex: .5, ink: PAL.ink, sw: .6 });
      if (hash(i * 9.1) > .55) inkLine([[b.x + b.w * .72, LY - b.h], [b.x + b.w * .72, LY - b.h - 46], [b.x + b.w * .72 + 16, LY - b.h - 40]], .8, PAL.ink, 'ink', 0);
      const nx = Math.floor((b.w - 30) / 44), ny = Math.floor((b.h - 50) / 58), ox = b.x + (b.w - nx * 44 + 18) / 2;
      for (let a = 0; a < nx; a++) for (let c = 0; c < ny; c++) {
        const wx = ox + a * 44, wy = LY - b.h + 30 + c * 58, sd = i * 31 + a * 7 + c * 13;
        const [L, fl] = winLight(sd, wx + 13, wy + 17, t, evs);
        const col = mixCol(mixCol(dark, C.amber, L), C.goldLt, fl);
        paint(rectPts(wx, wy, 26, 34), { wash: col, ink: null });
        if (fl > .45) G.push([wx + 13, wy + 17, fl]);
      }
    }
    G.sort((a, b) => b[2] - a[2]);
    for (const [x, y, f] of G.slice(0, 22)) glow(x, y, 58, C.amberLt, f * .9);
  }
  function echoRings(t, v, evs) {
    for (const ev of evs) {
      if (ev.last) continue;
      const a0 = t - ev.t; if (a0 < 0 || a0 > 2.8) continue;
      if (a0 < .4) glow(ev.x, ev.y, 150, C.goldLt, 1 - a0 / .4);
      for (let k = 0; k < 3; k++) { const a = a0 - k * .2; if (a < 0 || a > 2.2) continue; arcRing(ev.x, ev.y, ringR(a), 2.4 * (1 - a / 2.2) + .25, k ? PAL.cream : C.goldLt, v, 'ev' + ev.t + k, LY); }
    }
  }

  // ---------- the inner world below (drawn inside mirror(): it comes out upside-down) ----------
  function farCutouts(v) {
    const K = ['house', 'house', 'door', 'house', 'small', 'house'];
    for (let i = Math.floor(v.x0 / 230) - 1; i <= Math.floor(v.x1 / 230); i++) {
      const s = 42 + 48 * hash(i * 2.7 + 5), kind = K[Math.floor(hash(i * 1.9 + 2) * K.length)];
      ECH.cutout(kind, i * 230 + 60 * hash(i * 3.3), LY - s, s, 0, '#342A62', 'far' + i);
    }
  }
  function floaters(t, v) {
    const K = ['moon', 'star', 'small', 'house', 'door', 'star'];
    for (let i = Math.floor(v.x0 / 340) - 1; i <= Math.floor(v.x1 / 340); i++) {
      const kind = K[Math.floor(hash(i * 4.9 + 1) * K.length)], s = 24 + 26 * hash(i * 6.1 + 2);
      const x = i * 340 + 120 * hash(i * 1.3 + 7), y = LY - 190 - 230 * hash(i * 4.3 + 3) + 14 * Math.sin(t * .9 + i * 1.7);
      const col = hash(i * 8.8) > .5 ? C.voidLt : '#4C3C84';
      if (kind === 'star' || kind === 'moon') glow(x, y, s * 2.6, kind === 'moon' ? C.star : C.teal, .25 + .2 * pulse(t + i * B, 4));
      ECH.cutout(kind, x, y, s, .3 * Math.sin(t * .35 + i), col, 'fl' + i);
    }
  }
  function lamps(t, v) {
    for (let i = Math.floor(v.x0 / 620) - 1; i <= Math.floor(v.x1 / 620); i++) {
      const lx = i * 620 + 90;
      ECH.lamp(lx, LY, 290, .9 + .1 * pulse(t, 4), 'fg' + i);
      ECH.mirror(LY, () => {   // under each lamp, a paper star hangs in the inner world
        const sway = .15 * Math.sin(t * 1.3 + i), hx = lx + 44, hy = LY - 150;
        boilSeed('fgthread' + i);
        inkLine([[hx, LY], [hx + sway * 40, hy]], .5, C.echoLt, 'inkfine', 0);
        glow(hx + sway * 40, hy - 22, 100, C.teal, .5 + .2 * pulse(t, 4));
        ECH.cutout('star', hx + sway * 40, hy - 22, 22, sway, C.teal, 'fgst' + i);
      });
    }
  }
  function rainTop(t) {
    boilSeed('fg-rain');
    for (let i = 0; i < 34; i++) {
      const x0 = hash(i * 1.37 + 3) * (W + 400) - 200, ph = hash(i * 2.91 + 7);
      const y = frac(ph + t * 1400 / (LY + 100) * (.8 + .4 * hash(i + 5))) * (LY + 100) - 100, x = x0 + (y + 100) * .18, y2 = Math.min(y + 40, LY - 2);
      if (y2 - y < 6) continue;
      inkLine([[x, y], [x + (y2 - y) * .18, y2]], .5 * (.6 + .6 * hash(i + 9)), C.rain, 'inkfine', 0);
    }
  }

  // ---------- the cast ----------
  const CL_EMO = [[F0, 'neutral'], [TQ, 'confused'], [TCLUTCH + .15, 'scared', { tintK: .2 }], [TLAST + .15, 'neutral'],
    [THOPE, 'hopeful', { emote: 'spark' }], [TDIM + .3, 'sad', { emote: null }]];
  const EC_EMO = [[F0, 'neutral', { eyes: 'shine' }], [TTURN + .2, 'sad', { eyes: 'shine', emote: null, lookY: .9, lookX: .4 }],
    [CALLS[0] - .25, 'determined', { eyes: 'shine', mouth: 'O', lookY: .9, lookX: .3 }], [EV[0][0] - .1, 'sad', { eyes: 'teary', emote: null, lookY: .9, lookX: .4 }],
    [TEYES, 'surprised', { eyes: 'shine', emote: null, lookX: .6 }], [TPOINT, 'excited', { eyes: 'shine', emote: null, mouth: 'grin' }],
    [TW, 'hopeful', { eyes: 'shine' }], [TDIM + .3, 'sad', { eyes: 'shine', emote: null }]];
  function mouthAt() { return [eW(CALLS[0]).x - 1.72 * U, LY + 4.1 * U]; }

  // Two arm nubs drawn over the mask (the front view's own arms sit behind the body): hands clutching its edges.
  function clutchArms(a, col, dk) {
    return (u, sw) => {
      for (const s of [-1, 1]) {
        const aa = a + (s > 0 ? .06 : 0) * Math.sin(T * 40);
        push(); translate(s * 5.45 * u, -4.5 * u); rotate(s < 0 ? aa : -aa);
        paint(rectPts(s < 0 ? -2.3 * u : 0, -.5 * u, 2.3 * u, u, u * .04), { wash: col, washOp: 255, fill: dk, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
        pop();
      }
    };
  }
  function clawdPose(t) {
    const w = cW(t), em = emotions(t, CL_EMO, { take: .55 });
    const hd = ECH.heading(t, .25, [[TTURN + .55, .125], [TCLUTCH, 0], [TLAST + .1, .125], [THOPE - .25, .25]]);
    const o = { ...em, ...hd, walk: w.walk, noShadow: true, boilKey: 'fgClawd' };
    if (w.moving) { o.view = 'side'; o.flip = false; o.aL = w.aL; o.aR = w.aR; o.dy = w.dy + em.dy * .3; o.smear = 0; }
    // leaning down to look at Echo
    const lean = seg(t, TTURN + .5, TQ) * (1 - seg(t, TCLUTCH - .2, TCLUTCH + .1));
    o.rot = (o.rot || 0) + .16 * ease(lean);
    // clutching the mask: turns to camera, arms up to the mask's edges, trembling
    const cl = ease(seg(t, TCLUTCH + .1, TCLUTCH + .4)) * (1 - ease(seg(t, TLAST, TLAST + .35)));
    if (cl > 0) {
      const a = lerp(.3, 2.25, backOut(cl)) + .05 * Math.sin(t * 31);
      o.aL = o.aR = a; o.sq = (o.sq || 0) + .08 * cl; o.dx = (o.dx || 0) + .06 * Math.sin(t * 37) * cl;
      o.draw = clutchArms(a, mixCol(PAL.clay, TINT.pale, .12), PAL.clayDk);
    }
    // hopeful: rises onto its toes and leans toward the door, near arm reaching
    const hp = seg(t, THOPE, THOPE + .4) * (1 - seg(t, TW - .2, TW + .2));
    if (hp > 0 && !w.moving) { o.aL = lerp(o.aL ?? .2, 1.0, ease(hp)); o.rot = (o.rot || 0) + .06 * hp; o.sq = (o.sq || 0) - .06 * hp; }
    if (t > TW + 1) o.emoteK = (o.emoteK ?? 1) * (1 - seg(t, TW + 1, TW + 1.5));
    if (t > TDIM + .3) { o.aL = lerp(o.aL ?? .2, -.6, ease(seg(t, TDIM + .3, TDIM + .9))); o.rot = (o.rot || 0) + .05 * seg(t, TDIM + .3, TDIM + .9); }
    return { x: w.x, o };
  }
  function echoPose(t) {
    const w = eW(t), em = emotions(t, EC_EMO);
    const hd = ECH.heading(t, .25, [[TTURN, -.125], [TEYES - .05, .125], [TPOINT - .3, .25]]);
    const o = { ...em, ...hd, walk: w.walk, noShadow: true, emberK: .85 + .15 * pulse(t, 4), halo: .5, boilKey: 'fgEcho' };
    if (w.moving) { o.view = 'side'; o.flip = false; o.aL = w.aL; o.aR = w.aR; o.dy = w.dy + (em.dy || 0) * .3; o.smear = 0; }
    // calling: a breath in, then a stretch toward the line on each burst, arms reaching down (toward Clawd)
    for (const tc of CALLS) {
      const pre = seg(t, tc - .18, tc) * (t < tc ? 1 : 0), aft = t >= tc ? Math.exp(-(t - tc) * 3) : 0;
      o.sq = (o.sq || 0) + .12 * pre - .16 * aft;
      o.dy = (o.dy || 0) - .6 * aft;
    }
    const reach = seg(t, CALLS[0] - .2, CALLS[0]) * (1 - seg(t, TEYES - .3, TEYES));
    if (reach > 0) { o.aL = lerp(o.aL ?? .2, -1.15 + .1 * Math.sin(t * 5), ease(reach)); o.aR = lerp(o.aR ?? .2, -.8, ease(reach)); }
    // pointing at the door: a small wind-up, then the near arm snaps out straight
    if (t > TPOINT - .15 && t < TW) {
      const up = seg(t, TPOINT - .15, TPOINT), out = backOut(seg(t, TPOINT, TPOINT + .3));
      o.aL = t < TPOINT ? lerp(.2, -.5, up) : lerp(-.5, .72, out) + .04 * Math.sin(t * 6);
      o.aR = .1; o.view = 'side'; o.flip = false;
      o.dy = (o.dy || 0) * .3; o.rot = -.04;
    }
    if (t > TDIM + .3) o.aL = lerp(o.aL ?? .2, -.6, ease(seg(t, TDIM + .3, TDIM + .9)));
    return { x: w.x, o };
  }

  // ---------- the frame ----------
  function frame(t) {
    const cam = camAt(t), v = viewOf(cam, 1), vn = viewOf(cam, .6), vf = viewOf(cam, .25), evs = echoesIn();
    ECH.skyGrad(C.nightTop, C.nightBot, 'fg-sky', 5, -60, LY + 40);
    glow(960, LY - 40, 900, C.amber, .1);
    ECH.innerSky(-80, LY, W + 160, H - LY + 80, t, 'fg-inner', { stars: 44 });
    glow(960, LY + 120, 800, C.violet, .22);
    for (let k = 0; k < 3; k++) {   // one star sparks on every beat in the inner sky
      const n = beatN(t) - k, a = (t - (OFF + n * B)) / (3 * B); if (a < 0 || a > 1) continue;
      const sx = 80 + (W - 160) * hash(n * 3.7 + 1), sy = LY + 60 + (H - LY - 100) * hash(n * 5.3 + 2), r = 26 * (1 - a) * (n % 4 === 0 ? 1.5 : 1);
      glow(sx, sy, r * 4, C.star, .7 * (1 - a));
      boilSeed('spk' + n);
      paint(starPts(sx, sy, r, .22, 4, a * .6), { wash: C.star, washOp: 255 * (1 - a), ink: null });
    }
    ECH.layer(cam, .25, () => {
      ECH.skyline(-4000, 9000, LY, { seed: 21, cam, p: .25, cols: ['#2B2F60', '#20234C'], windows: false, hMin: 230, hMax: 520, ink: null });
      ECH.mirror(LY, () => farCutouts(vf));
    });
    ECH.layer(cam, .6, () => {
      city(t, vn, evs);
      echoRings(t, vn, evs);
      ECH.mirror(LY, () => floaters(t, vn));
    });
    camBegin(cam.cx, cam.cy, cam.z);
    lamps(t, v);
    ECH.splashes(t, v.x0, v.x1, LY, { n: 8, key: 'fg', col: C.rain });
    // the door (G) and its first spark
    const dx = doorX(t), sp = ease(seg(t, TLIGHT, TLIGHT + .8)), dk = ease(seg(t, TOPEN, TOPEN + 1.4)) * (1 - .65 * ease(seg(t, TDIM, TDIM + .9)));
    if (sp > 0) {
      const k = sp * (1 - .8 * dk) * (1 - .5 * seg(t, TDIM, TDIM + .9));
      glow(dx, LY, 60 + 200 * sp, C.goldLt, k); glow(dx, LY, 30 + 50 * sp, PAL.cream, k);
      boilSeed('fg-spark');
      if (k > .05) paint(starPts(dx, LY, (14 + 26 * sp) * (1 + .15 * pulse(t, 5)), .28, 4), { wash: PAL.cream, washOp: 255 * clamp(k * 1.5), ink: null });
    }
    if (dk > 0) ECH.door(dx, LY, 340, dk, t, { key: 'fg' });
    theLine(v, lineBumps(t), t);
    const E = echoPose(t), Cl = clawdPose(t);
    ECH.mirror(LY, () => ECH.echo(E.x, LY, U, E.o));
    ECH.masked(Cl.x, LY, U, Cl.o);
    // Echo's voice: rings from its mouth, through the line
    const [mx, my] = mouthAt();
    for (const tc of CALLS) for (let k = 0; k < 3; k++) {
      const a = t - tc - k * .16; if (a < 0 || a > 1.8) continue;
      arcRing(mx, my, callR(a), 2.6 * (1 - a / 1.8) + .3, k === 1 ? C.echoLt : PAL.cream, v, 'call' + tc + k);
    }
    // the last echo rings out on the line far right (both halves), and the door's farewell ring sweeps the frame
    for (let k = 0; k < 3; k++) {
      const a = t - TLAST - k * .2; if (a > 0 && a < 2.2) arcRing(doorX(TLAST), LY, ringR(a), 2.6 * (1 - a / 2.2) + .3, k ? PAL.cream : C.goldLt, v, 'last' + k);
      const b = t - TSW - k * .14; if (b > 0 && b < 1.7) arcRing(doorX(TSW), LY, sweepR(b), 3.4 * (1 - b / 1.7) + .4, k ? PAL.cream : C.goldLt, v, 'sweep' + k);
    }
    if (t - TLAST > 0 && t - TLAST < .5) glow(doorX(TLAST), LY, 160, C.goldLt, 1 - (t - TLAST) / .5);
    camEnd();
    rainTop(t);
  }

  // ---------- the shoji wipe (G → H), shared with h_screens.js ----------
  // A lamplit paper screen slides in from the right and shuts the frame (p 0 → .5), then slides back open to the
  // right (p .5 → 1). Cut at p = .5. Screen space.
  function shojiWipe(p) {
    if (p <= 0 || p >= 1) return;
    const PW = W + 200, xL = p < .5 ? lerp(W + 40, -100, easeOut(p * 2)) : lerp(-100, W + 60, ease((p - .5) * 2));
    const wood = '#4E3324';
    boilSeed('shoji-sh');
    paint(rectPts(xL - 70, -80, 80, H + 160), { fill: PAL.ink, fillOp: 70, bleed: .3, tex: .3, ink: null });
    boilSeed('shoji-paper');
    paint(rectPts(xL, -80, PW, H + 160), { wash: '#F3DCA8', fill: '#E3B774', fillOp: 70, bleed: .15, tex: .6, ink: null });
    for (let k = 0; k < 3; k++) glow(xL + 520 + k * 700, 540, 520, C.amber, .45);
    boilSeed('shoji-grid');
    for (let x = xL + 150; x < Math.min(W + 60, xL + PW); x += 190) if (x > -40) inkLine([[x, -80], [x + 1, H / 2], [x, H + 80]], 2.4, wood, 'ink', 0);
    for (let y = 70; y < H; y += 160) {
      const a = Math.max(xL, -60), b = Math.min(W + 60, xL + PW);
      if (b - a < 10) continue;
      const m = (a + b) / 2; inkLine([[a, y], [m, y + 1]], 2.4, wood, 'ink', 0); inkLine([[m, y + 1], [b, y]], 2.4, wood, 'ink', 0);
    }
    boilSeed('shoji-frame');
    paint(rectPts(xL - 14, -80, 50, H + 160, 2), { wash: wood, fill: '#2E1E16', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(xL, H - 40, PW, 90, 2), { wash: wood, ink: PAL.ink, sw: 1 });
    paint(rectPts(xL, -60, PW, 80, 2), { wash: wood, ink: PAL.ink, sw: 1 });
    paint(ellPts(xL + 90, 560, 12, 40, 12), { wash: '#2E1E16', ink: PAL.ink, sw: .6 });   // the finger pull
  }
  window.FGH_shojiWipe = shojiWipe;

  function shotF(t, lt, dur) {
    frame(t);
    if (lt < .45) ECH.splashWipe(.5 + .5 * lt / .45);        // E | F: the dive through the water surface
  }
  function shotG(t, lt, dur) {
    frame(t);
    if (lt > dur - .55) shojiWipe(.5 * (lt - (dur - .55)) / .55);
  }
  shots([[ECH.S.F, shotF], [ECH.S.G, shotG]]);
})();
