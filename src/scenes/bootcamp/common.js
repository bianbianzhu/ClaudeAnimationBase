// bootcamp/common.js: the blueprint world for "Blueprint to System" (see STORYBOARD_bootcamp.md).
// Music: assets/jingle_extended.mp3, ~151.3 BPM, beat map in beatmap.js; use barT(k) for bar lines.
//
// The whole film happens on ONE big blueprint sheet (world px). Every component of the AI system has a fixed place on
// it, and every shot is a camera move across the sheet. A component is drawn in one of two states:
//   - pencil: planned, not built. Pale blue dashed outlines, a pencil label. `p` (0..1) reveals it along its outline.
//   - ink:    built. Cream chalk-ink outlines, flat warm washes, a cream label, and glow() when lit (Act II).
// Conventions:
//   - The request (the packet) and Clawd always travel left → right.
//   - Components are platforms: Clawd stands on their top edges (feet = the `stand` point).
//   - Labels are English, hand-lettered with letter(), sized so they stay readable when the camera pulls out.
const BC = (() => {
  const B = BEAT;
  const bb = (k, beats = 0) => barT(k) + beats * B;          // time of bar k plus some beats

  // ---------- palette ----------
  const C = {
    sheet: '#1C2A4E', sheetDk: '#16213F', sheetLt: '#263863', card: '#2A4274', cardLt: '#34508A', grid: '#2F4476', gridMaj: '#3D5898',
    pencil: '#A8C6F2', pencilDk: '#7F9DD0', chalk: '#F4EAD2', chalkDk: '#D9CBB0',
    warm: '#FFC766', note: '#F2B45A', red: '#E4574C', redLt: '#FF8A7A', grey: '#8C95AE', packet: '#FFE6A3', packetCore: '#FFF6DC',
    clay: PAL.clay, ochre: '#E8AA38', teal: '#3FA7A0', rose: '#E27A92', violet: '#8B6CC0',
  };

  // ---------- geometry helpers (closed paths repeat their first point) ----------
  const close = P => P.concat([P[0]]);
  const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  const RR = (x, y, w, h, r) => close(rrPts(x, y, w, h, r));
  const CIRC = (cx, cy, r, n = 28) => close(ellPts(cx, cy, r, r, n));
  const ELL = (cx, cy, rx, ry, n = 28) => close(ellPts(cx, cy, rx, ry, n));
  const ARC = (cx, cy, rx, ry, a0, a1, n = 16) => { const P = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); P.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return P; };
  const L = (...pts) => pts;

  function lenOf(P) { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }
  // The sub-polyline of P between arc lengths a and b.
  function subPath(P, a, b) {
    const out = []; let s = 0;
    for (let i = 1; i < P.length; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i], l = Math.hypot(x1 - x0, y1 - y0); if (l < 1e-6) continue;
      const s1 = s + l;
      if (s1 >= a && s <= b) {
        const ka = clamp((a - s) / l), kb = clamp((b - s) / l);
        if (!out.length) out.push([lerp(x0, x1, ka), lerp(y0, y1, ka)]);
        out.push([lerp(x0, x1, kb), lerp(y0, y1, kb)]);
      }
      s = s1; if (s > b) break;
    }
    return out;
  }
  // A point at arc-length fraction k along P.
  function along(P, k) { const l = lenOf(P), s = subPath(P, 0, Math.max(1e-3, clamp(k) * l)); return s.length ? s[s.length - 1] : P[0]; }

  // ---------- strokes ----------
  // Dashed pencil line along P, revealed up to fraction p. Dash period is in world px, fixed, so dashes don't crawl
  // when the camera zooms.
  const DASH = 46, DUTY = .6;
  function pencilPath(P, p = 1, sw = .7, col = C.pencil) {
    if (p <= 0 || P.length < 2) return;
    const Lt = lenOf(P) * clamp(p);
    for (let s = 0; s < Lt; s += DASH) {
      const d = subPath(P, s, Math.min(s + DASH * DUTY, Lt));
      if (d.length >= 2) inkLine(d, sw, col, 'inkfine', 0);
    }
  }
  // Solid chalk-ink line along P, revealed up to fraction p (Act II: building).
  function inkPath(P, p = 1, sw = 1, col = C.chalk) {
    if (p <= 0 || P.length < 2) return;
    const d = p >= 1 ? P : subPath(P, 0, lenOf(P) * p);
    if (d.length >= 2) inkLine(d, sw, col, 'ink', 0);
  }
  // Draw a list of paths as one drawing revealed in sequence (by length) with progress p.
  function drawPaths(paths, p, mode, sw) {
    const lens = paths.map(lenOf), tot = lens.reduce((a, b) => a + b, 0) || 1;
    let s = 0;
    for (let i = 0; i < paths.length; i++) {
      const k = clamp((p * tot - s) / lens[i]); s += lens[i];
      if (k <= 0) break;
      if (mode === 'ink') inkPath(paths[i], k, sw); else pencilPath(paths[i], k, sw * 1.1);
    }
  }

  // ---------- the map: every component, in world px ----------
  // stand = where Clawd's feet go on it; label = [text, x, y]; viewOf(id) = the camera that frames it in Act I.
  const COMP = {};
  const def = (id, o) => { COMP[id] = { id, ...o }; };

  def('frontend', {
    label: ['Frontend', 420, 1400], stand: [80, 1400],
    solid: [0],
    paths: () => [RR(200, 950, 500, 400, 26), L([200, 1012], [700, 1012]), CIRC(236, 981, 9, 10), CIRC(266, 981, 9, 10), CIRC(296, 981, 9, 10),
      RR(230, 1268, 380, 52, 22), CIRC(652, 1294, 25, 14), L([640, 1294], [664, 1294]), L([654, 1284], [664, 1294], [654, 1304])],
  });
  // API Gateway: where requests enter the backend; identity (the barrier and the lock) and rate limits live here.
  def('auth', {
    label: ['API Gateway', 1060, 1360], stand: [1020, 990],
    solid: [0],
    paths: () => [RR(860, 990, 320, 320, 22), R(900, 1030, 40, 250), R(1100, 1030, 40, 250),
      RR(992, 1232, 56, 46, 8), ARC(1020, 1232, 18, 22, Math.PI, TAU, 10)],
    // the barrier arm is drawn separately so it can lift: see gateArm()
  });
  def('backend', {
    label: ['Backend', 1480, 1570], stand: [1480, 800],
    solid: [0],
    paths: () => [RR(1340, 800, 1600, 720, 32), L([1380, 850], [1500, 850]), L([1380, 880], [1500, 880]), L([1380, 910], [1500, 910]),
      CIRC(1530, 850, 7, 8), CIRC(1530, 880, 7, 8), CIRC(1530, 910, 7, 8)],
  });
  const LOOP = { cx: 1720, cy: 1160, r: 170 };
  def('loop', {
    label: ['Agent Loop', 1720, 1395], stand: [1760, 800],
    paths: () => {
      const { cx, cy, r } = LOOP, P = [];
      for (let i = 0; i < 3; i++) {                                  // think → act → observe: three arrows round the loop
        const a0 = -Math.PI / 2 + i * TAU / 3 + .2, a1 = a0 + TAU / 3 - .4, tip = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
        const tg = a1 + Math.PI / 2, bk = [Math.cos(tg), Math.sin(tg)], nr = [Math.cos(a1), Math.sin(a1)];
        P.push(ARC(cx, cy, r, r, a0, a1, 14));
        P.push(L([tip[0] - bk[0] * 30 + nr[0] * 18, tip[1] - bk[1] * 30 + nr[1] * 18], tip, [tip[0] - bk[0] * 30 - nr[0] * 18, tip[1] - bk[1] * 30 - nr[1] * 18]));
        P.push(CIRC(cx + Math.cos(a0 - .2) * r, cy + Math.sin(a0 - .2) * r, 16, 12));
      }
      return P;
    },
  });
  const cyl = (cx, top, rx, h, ry = 34) => [ELL(cx, top, rx, ry), L([cx - rx, top], [cx - rx, top + h]), L([cx + rx, top], [cx + rx, top + h]), ARC(cx, top + h, rx, ry, 0, Math.PI, 16)];
  def('memory', {
    label: ['Memory', 2200, 2175], stand: [2020, 1838],
    paths: () => [...cyl(2020, 1840, 140, 240), ...cyl(2380, 1840, 140, 240),
      ...[[-60, 60], [10, 30], [70, 90], [-40, 140], [40, 170], [-80, 200]].map(([dx, dy]) => CIRC(2020 + dx, 1840 + dy, 10, 8)),   // vectors
      ARC(2380, 1920, 140, 34, 0, Math.PI, 14), ARC(2380, 2000, 140, 34, 0, Math.PI, 14)],                                             // table rows
  });
  def('context', {
    label: ['Context', 2560, 1395], stand: [2560, 1018],
    solid: [0, 1, 2],
    paths: () => [R(2386, 1016, 300, 240), R(2410, 1040, 300, 240), R(2434, 1064, 300, 240),
      L([2464, 1110], [2690, 1110]), L([2464, 1150], [2650, 1150]), L([2464, 1190], [2670, 1190]), L([2464, 1230], [2600, 1230])],
  });
  const chip = (x, y, w, h) => { const P = [R(x, y, w, h)]; for (let i = 1; i < 4; i++) { const px = x + w * i / 4; P.push(L([px, y - 18], [px, y]), L([px, y + h], [px, y + h + 18])); } return P; };
  // AI Gateway: one entry in front of many models (the chips behind it); routing and fallbacks are added in W12.
  def('llm', {
    label: ['AI Gateway', 3300, 1372], stand: [3300, 1000],
    solid: [0],
    paths: () => [RR(3160, 1000, 280, 320, 22), L([3190, 1160], [3290, 1160]), L([3290, 1160], [3390, 1085]), L([3290, 1160], [3390, 1235]),
      L([3362, 1080], [3390, 1085], [3378, 1111]), L([3362, 1240], [3390, 1235], [3378, 1209]),
      L([3440, 1160], [3530, 1160], [3530, 980], [3620, 980]), L([3530, 1160], [3530, 1340], [3620, 1340]),
      ...chip(3620, 925, 200, 110), ...chip(3620, 1285, 200, 110)],
  });
  const globe = (cx, cy, r) => [CIRC(cx, cy, r, 20), ELL(cx, cy, r * .45, r, 16), L([cx - r, cy], [cx + r, cy])];
  def('tools', {
    label: ['MCP Tools', 3800, 2140], stand: [3800, 1800],
    solid: [0],
    paths: () => [RR(3650, 1800, 300, 280, 22),
      ...[0, 1, 2].flatMap(i => { const y = 1850 + i * 80; return [R(3950, y, 40, 34), L([3990, y + 8], [4020, y + 8]), L([3990, y + 26], [4020, y + 26]), L([4020, y + 17], [4200, 1840 + i * 100])]; }),
      ...globe(4250, 1840, 40), R(4205, 1912, 90, 60), L([4205, 1912], [4250, 1946], [4295, 1912]), R(4205, 2014, 90, 64), L([4205, 2035], [4295, 2035]), L([4235, 2014], [4235, 2078])],
  });
  // Tracing: a gantt of the request's own journey, one bar per stop, under a time axis.
  const STOPX = [450, 1020, 1400, 1720, 2020, 2560, 3300, 3800, 3870];
  def('tracing', {
    label: ['Tracing', 3440, 2530], stand: [3870, 2372], focus: [3300, 2360, 3960, 2560],
    paths: () => {
      const P = [L([350, 2470], [3960, 2470])];
      for (let x = 400; x <= 3900; x += 250) P.push(L([x, 2470], [x, 2490]));
      for (let i = 0; i + 1 < STOPX.length; i++) { const y = 2380 + (i % 3) * 28; P.push(R(STOPX[i], y, STOPX[i + 1] - STOPX[i], 18)); }
      return P;
    },
  });
  def('evals', {
    label: ['Evals', 4300, 2620], stand: [4300, 2280],
    solid: [0],
    paths: () => [RR(4150, 2280, 300, 290, 22),
      ...[0, 1, 2].flatMap(i => { const y = 2320 + i * 76; return [R(4185, y, 38, 38), L([4193, y + 20], [4203, y + 30], [4218, y + 8]), L([4245, y + 19], [4410, y + 19])]; })],
  });
  def('cloud', {
    label: ['Cloud · VPC', 900, 2880],
    solid: [0],
    // the cloud first and the slab starting top-left, so a half-built platform is inked from the left end
    paths: () => { const P = rrPts(100, 2700, 4600, 110, 50), slab = close(P.slice(18).concat(P.slice(0, 18)));
      return [ARC(230, 2700, 70, 60, Math.PI, TAU, 12), ARC(330, 2680, 80, 80, Math.PI * 1.1, TAU, 12), ARC(440, 2700, 60, 50, Math.PI, TAU * .98, 12), slab]; },
  });
  def('guard', {
    label: ['Guardrails', 2400, 628],
    paths: () => [RR(60, 640, 4700, 2020, 90)],
  });
  def('dev', {
    label: ['Claude Code', -380, 2865], stand: [-120, 2560], solid: [4],
    paths: () => [L([-720, 2560], [-20, 2560]), L([-690, 2560], [-690, 2800]), L([-50, 2560], [-50, 2800]),
      RR(-560, 2330, 280, 190, 14), L([-600, 2560], [-560, 2520], [-280, 2520], [-240, 2560]),
      L([-525, 2385], [-495, 2410], [-525, 2435]), L([-480, 2440], [-435, 2440])],
  });
  const ORDER = ['frontend', 'auth', 'backend', 'loop', 'memory', 'context', 'llm', 'tools', 'tracing', 'evals', 'cloud', 'guard', 'dev'];
  // A camera that fits a world rectangle [x0, y0, x1, y1]: [cx, cy, zoom].
  const fit = (r, zmax = 1.3) => [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2, Math.min(zmax, W / (r[2] - r[0]), H / (r[3] - r[1]))];
  // bounding boxes for culling (computed on first use: the shape helpers need p5, which isn't ready at load)
  function boxOf(id) {
    const c = COMP[id]; if (c.box) return c.box;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const P of c.paths()) for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return (c.box = [x0, y0, x1, y1]);
  }
  const MAP_VIEW = [2025, 1760, .334];                         // the whole sheet
  // The camera that frames a component with Clawd standing on it and its label: [cx, cy, zoom].
  const U = 24;
  function viewOf(id) {
    const c = COMP[id]; if (c.view) return c.view;
    const b = c.focus || boxOf(id), [sx, sy] = c.stand, [, lx, ly] = c.label;
    const x0 = Math.min(b[0], sx - 6 * U, lx - 160), x1 = Math.max(b[2], sx + 6 * U, lx + 160);
    const y0 = Math.min(b[1], sy - 10.5 * U), y1 = Math.max(b[3], ly + 40);
    const z = clamp(Math.min(W / (x1 - x0 + 260), H / (y1 - y0 + 220)), .8, 1.3);
    return (c.view = [(x0 + x1) / 2, (y0 + y1) / 2, z]);
  }

  // ---------- camera ----------
  const viewRect = cam => { const hw = W / 2 / cam[2], hh = H / 2 / cam[2]; return [cam[0] - hw, cam[1] - hh, cam[0] + hw, cam[1] + hh]; };
  const toScreenAt = (cam, x, y) => [W / 2 + (x - cam[0]) * cam[2], H / 2 + (y - cam[1]) * cam[2]];
  const visible = (box, cam, m = 80) => { const [a, b, c, d] = viewRect(cam); return box[2] > a - m && box[0] < c + m && box[3] > b - m && box[1] < d + m; };

  // ---------- sheet ----------
  function sheet(cam) {
    boilSeed('sheet');
    paint(rectPts(-80, -80, W + 160, H + 160), { wash: C.sheet, ink: null });
    camBegin(cam[0], cam[1], cam[2]);
    // soft watercolour blotches, fixed on the sheet
    for (let i = 0; i < 9; i++) {
      const x = -600 + hash(i * 3.1) * 5600, y = 500 + hash(i * 7.7) * 2600, r = 500 + hash(i * 1.3) * 700;
      if (!visible([x - r, y - r, x + r, y + r], cam)) continue;
      boilSeed('blot' + i);
      paint(ellPts(x, y, r, r * .7, 18, 30), { fill: i % 2 ? C.sheetLt : C.sheetDk, fillOp: 60, bleed: .25, tex: .6, ink: null });
    }
    // the grid: minor every 120, major every 600; only what's on screen, in segments no longer than ~1500
    const [a, b, c, d] = viewRect(cam), step = cam[2] < .6 ? 240 : 120;
    boilSeed('grid');
    for (let x = Math.ceil(a / step) * step; x <= c; x += step) {
      const maj = x % 600 === 0; for (let y = b; y < d; y += 1500) inkLine([[x, y], [x, Math.min(d, y + 1500)]], maj ? .5 : .3, maj ? C.gridMaj : C.grid, 'HB', 0);
    }
    for (let y = Math.ceil(b / step) * step; y <= d; y += step) {
      const maj = y % 600 === 0; for (let x = a; x < c; x += 1500) inkLine([[x, y], [Math.min(c, x + 1500), y]], maj ? .5 : .3, maj ? C.gridMaj : C.grid, 'HB', 0);
    }
    camEnd();
  }

  // ---------- components ----------
  // st = { p: pencil reveal 0..1, ink: ink reveal 0..1 (may stop at .5 for a half-built part), solid: 0..1 flat wash,
  //        lit: 0..1 glow, glowCol }
  function comp(id, st, cam) {
    const c = COMP[id]; if (!st || (!(st.p > 0) && !(st.ink > 0))) return;
    const b = boxOf(id); if (!visible(b, cam)) return;
    const paths = c.paths();
    if (st.lit > 0) {
      // glows add up, so a wide shot of many lit parts turns to haze: smaller and fainter when the camera is far out
      const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, r = Math.min(650, Math.max(b[2] - b[0], b[3] - b[1]) * .75);
      const far = clamp(.3 + (cam[2] - MAP_VIEW[2]) / .55 * .7, .3, 1);
      boilSeed('glow-' + id); glow(cx, cy, r, st.glowCol || C.warm, .55 * st.lit * far);
    }
    boilSeed('comp-' + id);
    if (st.p > 0 && !(st.ink >= 1 && st.solid >= 1)) drawPaths(paths, st.p, 'pencil', id === 'guard' ? 1.2 : 1);
    if (st.solid > 0) for (const i of c.solid || []) { boilSeed('solid-' + id + i); paint(paths[i], { wash: C.card, washOp: 255 * st.solid, ink: null }); }
    if (st.ink > 0) { boilSeed('ink-' + id); drawPaths(paths, st.ink, 'ink', id === 'guard' || id === 'cloud' ? 1.5 : 1.15); }
  }
  // A hand-lettered label, written on letter by letter (k 0..1); stays readable when the camera pulls out.
  // L = [text, x, y] (default: the component's own label).
  function label(id, k, cam, col = C.pencil, Lb = null, scale = 1) {
    if (k <= 0) return;
    const [txt, x, y] = Lb || COMP[id].label, n = Math.max(1, Math.ceil(txt.length * clamp(k)));
    const size = Math.min(90, Math.max(50, 36 / cam[2])) * scale;
    letter(txt.slice(0, n), x, y, size, col, { ink: false, alpha: .95 });
  }
  // A revision tag: a chalk ring with the week number, stamped next to what that week built (pop 0..1).
  function tag(n, x, y, k, cam) {
    if (k <= 0) return;
    const s = backOut(clamp(k)), r = 38 * s * Math.max(1, .5 / cam[2]);
    boilSeed('tag' + n + '-' + x);
    paint(ellPts(x, y, r, r, 18), { wash: C.note, washOp: 255, ink: C.chalk, sw: .9 });
    letter('W' + n, x, y + 2 * s, r * .95, C.sheetDk, { ink: false, pop: clamp(k * 1.4) });
  }
  // The Auth barrier arm, lifting (0..1) as the packet passes.
  function gateArm(p, lift, ink = 0, x0 = 940, y0 = 1150, len = 160, id = 'gate-arm', col = C.chalk, sw = 1.3) {
    if (p <= 0) return;
    const a = -1.25 * ease(lift), l = len * clamp(p * 1.5), P = [[x0, y0], [x0 + Math.cos(a) * l, y0 + Math.sin(a) * l]];
    boilSeed(id);
    if (ink > 0) inkPath(P, 1, sw, col); else pencilPath(P, 1, .9);
  }

  // ---------- the packet (one user request, a small warm light) ----------
  function packet(x, y, t, k = 1, r = 15) {
    if (k <= 0) return;
    const s = 1 + .25 * pulse2(t, 5);
    glow(x, y, 95 * s * k, C.warm, .9 * k);
    boilSeed('packet');
    paint(ellPts(x, y, r * s * k, r * s * k, 12), { wash: C.packet, ink: null });
    glow(x, y, 30 * k, C.packetCore, .8 * k);
  }
  // Travel along P from t0 to t1 in eighth-note ticks: each tick eases, so the packet steps on the ostinato.
  function tickAlong(t, t0, t1) {
    const n = Math.max(1, Math.round((t1 - t0) / (B / 2))), k = seg(t, t0, t1) * n, i = Math.floor(k);
    return i >= n ? 1 : (i + easeOut(k - i)) / n;
  }

  return { B, bb, C, U, COMP, ORDER, viewOf, fit, LOOP, STOPX, MAP_VIEW, R, RR, CIRC, ELL, ARC, L, lenOf, subPath, along, pencilPath, inkPath,
    sheet, comp, label, tag, gateArm, packet, tickAlong, visible, viewRect, boxOf, toScreenAt };
})();
