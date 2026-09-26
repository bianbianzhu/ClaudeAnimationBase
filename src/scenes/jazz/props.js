// jazz/props.js: instruments and props for "Where Can You Be", painted flat (drawn key views, never 3D).
// Instruments are drawn in a character's body-local space (inside clawd()'s draw hook, so they squash, flip and
// silhouette with the player), in units of u, for the SIDE view facing right unless noted:
//   side view: the body spans x -3.1u..3.1u, y -8u..-2u; the mouth is near (2.3u, -4.3u); the near arm pivots at (1.6u, -4.2u).
// World-space props (table, candle, phone, mic, piano, drum kit, city) take a position and a size.

// A tube of varying width along a path (one outline): wf(k) gives the width at k = 0..1 along it.
function tube(P, wf) {
  const C = through(P, 5), n = C.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = wf(i / (n - 1)) / 2;
    L.push([C[i][0] - dy / d * w, C[i][1] + dx / d * w]); R.push([C[i][0] + dy / d * w, C[i][1] - dx / d * w]);
  }
  return { pts: L.concat(R.reverse()), C, L, R: R.slice().reverse() };
}
const US = (u, P) => P.map(([a, b]) => [a * u, b * u]);
// a brass glint: a short bright stroke and a little real light at point k (0..1) along a centreline C
function glint(C, k, u, a = 1) {
  const i = Math.floor(clamp(k) * (C.length - 2)), p = C[i], q = C[i + 1];
  if (a > .05) glow(p[0], p[1], u * 1.1, '#FFE7A8', .45 * a);
  inkLine([[p[0] - (q[1] - p[1]) * .3, p[1] + (q[0] - p[0]) * .3], [q[0] - (q[1] - p[1]) * .3, q[1] + (q[0] - p[0]) * .3]], .9, JZ.brassLt, 'ink', 0);
}

// ---------- tenor sax (side view, mouthpiece at the player's mouth) ----------
// o: shine 0..1 (the glint's position along the horn), glow 0..1 (how much it catches the light), sc (size)
function sax(u, sw, o = {}) {
  const s = o.sc ?? 1, v = (x, y) => [(2.55 + x * s) * u, (-4.35 + y * s) * u];
  const P = [v(0, 0), v(.8, -.05), v(1.45, .35), v(1.75, 1.2), v(1.9, 2.4), v(2.0, 3.35), v(2.45, 3.95), v(3.2, 3.85), v(3.6, 3.1), v(3.8, 2.0), v(3.95, .95)];
  const T = tube(P, k => u * s * (k < .12 ? .32 + k * 2.5 : k < .7 ? .62 + (k - .12) * 1.4 : 1.43 + (k - .7) * 1.6));
  // mouthpiece and ligature
  paint([v(-.35, -.17), v(.2, -.15), v(.2, .15), v(-.35, .17)], { wash: JZ.ink2, ink: JZ.ink, sw: sw * .5 });
  paint(T.pts, { wash: JZ.brass, fill: JZ.brassDk, fillOp: 30, tex: .4, border: .3, ink: JZ.ink, sw: sw * .9 });
  // a flat shadow band down the back of the horn, a highlight down the front
  paint(tube(P.slice(2), k => u * s * (.25 + k * .5)).pts.map(([x, y]) => [x + .22 * u * s, y]), { wash: JZ.brassDk, washOp: 150, ink: null });
  inkLine(T.C.slice(4, -3).map(([x, y], i) => [x - u * s * .12, y]), sw * .7, JZ.brassLt, 'inkfine', .5);
  // the bell: a flared opening facing up and forward
  const e = T.C[T.C.length - 1];
  paint(ellPts(e[0] + .15 * u * s, e[1] - .1 * u * s, 1.25 * u * s, .5 * u * s, 18, 0, -.25), { wash: JZ.brassDk, fill: JZ.ink, fillOp: 90, ink: JZ.ink, sw: sw * .9 });
  // pearl keys down the body
  for (let i = 0; i < 5; i++) { const q = T.C[6 + i * 3] || e; paint(ellPts(q[0] - u * s * .12, q[1], .26 * u * s, .24 * u * s, 10), { wash: JZ.cream, ink: JZ.ink, sw: sw * .45 }); }
  if (o.shine != null) glint(T.C, o.shine, u * s, o.glow ?? 1);
  return { bell: [e[0] + .15 * u * s, e[1] - .2 * u * s], hands: [T.C[Math.floor(T.C.length * .3)], T.C[Math.floor(T.C.length * .5)]], C: T.C };
}

// ---------- trumpet (side view, held level, bell forward) ----------
function trumpet(u, sw, o = {}) {
  const s = o.sc ?? 1, v = (x, y) => [(2.6 + x * s) * u, (-4.35 + y * s) * u];
  // main pipe: mouthpiece → valves → the bell
  const P = [v(0, 0), v(1.2, 0), v(2.4, 0), v(3.6, -.02), v(4.4, -.05), v(5.1, -.1)];
  const T = tube(P, k => u * s * (k < .75 ? .36 : .36 + Math.pow((k - .75) / .25, 2.2) * 2.3));
  // the lower loop under the valves
  const lp = tube([v(1.4, 0), v(1.1, .7), v(1.6, 1.05), v(3.6, 1.05), v(4.0, .6), v(3.7, .15)], () => u * s * .32);
  paint(lp.pts, { wash: JZ.brass, fill: JZ.brassDk, fillOp: 60, ink: JZ.ink, sw: sw * .7 });
  paint(T.pts, { wash: JZ.brass, fill: JZ.brassDk, fillOp: 60, tex: .5, ink: JZ.ink, sw: sw * .9 });
  for (let i = 0; i < 3; i++) {   // three valve casings with pearl caps
    const [x, y] = v(2.0 + i * .52, -.55);
    paint(rectPts(x - .19 * u * s, y, .38 * u * s, 1.35 * u * s), { wash: JZ.brass, fill: JZ.brassDk, fillOp: 70, ink: JZ.ink, sw: sw * .6 });
    paint(ellPts(x, y - .08 * u * s, .24 * u * s, .16 * u * s, 10), { wash: JZ.cream, ink: JZ.ink, sw: sw * .4 });
  }
  const e = v(5.15, -.1);
  paint(ellPts(e[0], e[1], .35 * u * s, 1.3 * u * s, 18), { wash: JZ.brassDk, fill: JZ.ink, fillOp: 80, ink: JZ.ink, sw: sw * .9 });
  inkLine([v(.3, -.13), v(4.3, -.18)], sw * .6, JZ.brassLt, 'inkfine', .3);
  if (o.shine != null) glint(T.C, o.shine, u * s, o.glow ?? 1);
  return { bell: e, valves: v(2.5, -.6), C: T.C };
}

// ---------- upright bass (world space; x, y = the endpin on the floor, h = its height, lean = tilt back) ----------
function uprightBass(x, y, h, o = {}) {
  const sw = o.sw ?? clamp(h / 300, .6, 2.2), k = h / 20;   // 20 units tall
  boilSeed('bass' + (o.key || ''));
  push(); translate(x, y); rotate(o.lean ?? -.12);
  const P = pts => pts.map(([a, b]) => [a * k, b * k]);
  // the body: two bouts and a waist, one outline, from a half-width profile (bottom → top)
  const prof = [[0, 2.2], [.05, 3.5], [.18, 4.0], [.34, 3.7], [.48, 2.7], [.57, 2.45], [.69, 3.0], [.81, 2.9], [.92, 1.8], [1, .55]];
  const side = through(prof.map(([a, w]) => [w, -.6 - a * 11.8]), 4);
  const outline = side.concat(side.slice().reverse().map(([a, b]) => [-a, b]));
  paint(P(outline), { wash: o.col || JZ.wood, fill: mixCol(o.col || JZ.wood, JZ.ink, .4), fillOp: 90, tex: .6, border: .6, ink: JZ.ink, sw, curv: .4 });
  paint(P(ellPts(-1.2, -7.2, 1.3, 3, 18)), { fill: o.lt || JZ.woodLt, fillOp: 110, bleed: .15, tex: .7, border: .8, ink: null });
  // f-holes
  for (const s of [-1, 1]) inkLine(P([[s * 1.3, -5.2], [s * 1.5, -6.1], [s * 1.2, -7.1], [s * 1.4, -8]]), sw * .9, JZ.ink, 'ink', .6);
  // bridge, tailpiece
  paint(P([[-1.1, -6.6], [1.1, -6.6], [.9, -6], [-.9, -6]]), { wash: JZ.cream, ink: JZ.ink, sw: sw * .5 });
  paint(P([[-.45, -1.3], [.45, -1.3], [.3, -3.6], [-.3, -3.6]]), { wash: JZ.ink2, ink: JZ.ink, sw: sw * .5 });
  // neck, fingerboard, scroll
  paint(P([[-.5, -11.8], [.5, -11.8], [.38, -19], [-.38, -19]]), { wash: JZ.ink2, ink: JZ.ink, sw: sw * .8 });
  paint(P(ellPts(0, -19.4, .7, .8, 12)), { wash: o.col || JZ.wood, ink: JZ.ink, sw: sw * .7 });
  inkLine(P([[.2, -19.9], [.55, -19.5], [.3, -19.1]]), sw * .6, JZ.ink, 'inkfine', .5);
  // endpin
  inkLine(P([[0, -.6], [0, 0]]), sw * 1.2, JZ.ink, 'ink', 0);
  // strings: each vibrates when plucked (o.pluck = [age of string 0..3])
  for (let i = 0; i < 4; i++) {
    const sx = (i - 1.5) * .17, a = o.pluck?.[i] ?? 9, amp = .22 * Math.exp(-a * 5) * Math.sin(a * 60);
    inkLine(P([[sx * 2.4, -1.4], [sx * 1.7 + amp, -9], [sx, -18.8]]), sw * .35, JZ.cream, 'inkfine', .5);
  }
  pop();
  // world positions for the player's hands: the plucking point and a hand high on the neck
  const rot = o.lean ?? -.12, W2 = (a, b) => [x + (a * Math.cos(rot) - b * Math.sin(rot)) * k, y + (a * Math.sin(rot) + b * Math.cos(rot)) * k];
  return { pluck: W2(.1, -8.6), neck: W2(0, -15.5), top: W2(0, -19.4) };
}

// ---------- the ribbon microphone on its stand (x, y = the base on the floor, h = height of the capsule) ----------
function ribbonMic(x, y, h, o = {}) {
  const s = o.s ?? h / 330, sw = clamp(s * 1.3, .5, 2.4);
  boilSeed('mic' + (o.key || ''));
  paint(ellPts(x, y, 60 * s, 12 * s, 20), { wash: JZ.ink2, ink: JZ.ink, sw });
  inkLine([[x, y - 4 * s], [x + (o.lean || 0) * h * .5, y - h * .5], [x + (o.lean || 0) * h, y - h + 40 * s]], sw * 2.6, JZ.ink, 'ink', .2);
  const cx = x + (o.lean || 0) * h, cy = y - h;
  push(); translate(cx, cy); rotate(o.tilt || 0);
  inkLine([[0, 40 * s], [0, 22 * s]], sw * 2, JZ.ink, 'ink', 0);
  // the capsule: a rounded chrome lozenge with ribbed grille, in cream and ink
  paint(rrPts(-24 * s, -34 * s, 48 * s, 62 * s, 22 * s), { wash: '#CFC8B8', fill: '#8F8878', fillOp: 70, tex: .5, ink: JZ.ink, sw });
  for (let i = 0; i < 6; i++) inkLine([[-17 * s, (-22 + i * 8.5) * s], [17 * s, (-22 + i * 8.5) * s]], sw * .45, JZ.ink, 'inkfine', 0);
  inkLine([[-12 * s, -28 * s], [-18 * s, -10 * s]], sw * .8, JZ.cream, 'inkfine', .4);
  pop();
  if (o.shine) glow(cx - 10 * s, cy - 14 * s, 40 * s, '#FFF1C8', o.shine);
  return [cx, cy];
}

// ---------- the table: candle, red telephone, gardenia, chair ----------
// x, y = the floor point under the table's centre; s = scale (1 → the tabletop is 300 px wide)
function candleFlame(x, y, s, t, o = {}) {
  const f = o.flame ?? 1; if (f <= .01) return;
  const fl = 1 + .08 * Math.sin(t * 23) + .05 * Math.sin(t * 37), lean = .15 * Math.sin(t * 3.1) + (o.lean || 0);
  glow(x, y - 14 * s * f, 120 * s * f, '#FFC766', .9 * f * (o.light ?? 1));
  glow(x, y - 12 * s * f, 36 * s * f, '#FFE9B0', f);
  const h = 30 * s * f * fl, w = 8 * s * f;
  paint([[x - w, y], [x - w * .9, y - h * .45], [x + lean * h, y - h], [x + w * .9, y - h * .45], [x + w, y]], { wash: JZ.mustLt, fill: JZ.orange, fillOp: 90, ink: JZ.ink, sw: .5 * s, curv: .7 });
  paint(ellPts(x, y - h * .25, w * .45, h * .22, 10), { wash: JZ.cream, ink: null });
}
function candle(x, y, s, t, o = {}) {
  boilSeed('candle' + (o.key || ''));
  const hgt = (o.height ?? 1) * 46 * s;
  paint(ellPts(x, y, 26 * s, 7 * s, 16), { wash: JZ.mustard, ink: JZ.ink, sw: .8 * s });
  paint(rectPts(x - 9 * s, y - hgt, 18 * s, hgt), { wash: JZ.cream, fill: JZ.smoke, fillOp: 60, ink: JZ.ink, sw: .8 * s });
  inkLine([[x, y - hgt], [x + 1 * s, y - hgt - 6 * s]], .6 * s, JZ.ink, 'inkfine', 0);
  candleFlame(x + s, y - hgt - 5 * s, s, t, o);
  return [x + s, y - hgt - 5 * s];
}
function phone(x, y, s, o = {}) {   // a red rotary telephone, the receiver on its cradle (o.lift 0..1 lifts it, o.ring shakes it)
  boilSeed('phone' + (o.key || ''));
  const r = o.ring ? Math.sin(T * 70) * 2.2 * s * o.ring : 0;
  push(); translate(x + r, y);
  paint([[-40 * s, 0], [40 * s, 0], [30 * s, -34 * s], [-30 * s, -34 * s]].map(p => p), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 60, ink: JZ.ink, sw: .9 * s, curv: .2 });
  paint(ellPts(0, -14 * s, 17 * s, 11 * s, 18), { wash: JZ.cream, ink: JZ.ink, sw: .6 * s });
  for (let i = 0; i < 8; i++) { const a = -2.4 + i * .6; paint(ellPts(Math.cos(a) * 11 * s, -14 * s + Math.sin(a) * 7 * s, 2.2 * s, 2 * s, 8), { wash: JZ.ink, ink: null }); }
  const ly = -(o.lift || 0) * 50 * s, lr = (o.lift || 0) * -.4 + (o.ring ? Math.sin(T * 50) * .06 * o.ring : 0);
  push(); translate(0, -38 * s + ly); rotate(lr);
  paint(through([[-44 * s, 2 * s], [-30 * s, -8 * s], [0, -10 * s], [30 * s, -8 * s], [44 * s, 2 * s], [36 * s, 8 * s], [24 * s, 2 * s], [0, 0], [-24 * s, 2 * s], [-36 * s, 8 * s]]), { wash: JZ.verm, fill: JZ.vermDk, fillOp: 50, ink: JZ.ink, sw: .9 * s, curv: .5 });
  pop(); pop();
  return [x + 40 * s, y - 6 * s];   // where the cord leaves
}
function chair(x, y, s, o = {}) {   // a bentwood café chair in profile (facing left if o.flip)
  boilSeed('chair' + (o.key || ''));
  const f = o.flip ? -1 : 1, P = pts => pts.map(([a, b]) => [x + f * a * s, y + b * s]), sw = 1.3 * s * (o.sw ?? 1), col = o.col || JZ.ink2;
  inkLine(P([[-40, 0], [-34, -110]]), sw * 1.6, col, 'ink', 0);
  inkLine(P([[40, 0], [34, -110]]), sw * 1.6, col, 'ink', 0);
  paint(P([[-46, -110], [46, -110], [46, -122], [-46, -122]]), { wash: col, ink: JZ.ink, sw: sw * .6 });
  inkLine(P([[40, -118], [44, -200], [30, -250], [4, -262], [-10, -250]]), sw * 1.7, col, 'ink', .6);
  inkLine(P([[42, -170], [10, -185], [16, -228]]), sw * 1.1, col, 'ink', .6);
}
function cafeTable(x, y, s, o = {}) {   // a small round café table (flat: a thick top, a pedestal, a foot)
  boilSeed('table' + (o.key || ''));
  const sw = 1.2 * s, col = o.col || JZ.ink2;
  paint(rectPts(x - 18 * s, y - 175 * s, 36 * s, 170 * s), { wash: col, ink: JZ.ink, sw: sw * .7 });
  paint(ellPts(x, y, 70 * s, 12 * s, 18), { wash: col, ink: JZ.ink, sw: sw * .7 });
  paint(rectPts(x - 160 * s, y - 196 * s, 320 * s, 24 * s, 2 * s), { wash: o.top || JZ.cream, fill: JZ.smoke, fillOp: 70, ink: JZ.ink, sw });
  paint(rectPts(x - 160 * s, y - 176 * s, 320 * s, 10 * s), { wash: mixCol(o.top || JZ.cream, JZ.ink, .35), ink: null });
  return y - 196 * s;   // the tabletop's height
}
function gardeniaAt(x, y, s, rot = 0) {   // a gardenia lying on a surface (or anywhere)
  push(); translate(x, y); rotate(rot); hat(s, 'gardenia', clamp(s / 15, .45, 2)); pop();
}

// ---------- grand piano in profile, lid up (x, y = floor under the keyboard end; s = scale, 1 → 900 px long) ----------
function grandPiano(x, y, s, o = {}) {
  boilSeed('piano' + (o.key || ''));
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), sw = 1.5 * s, col = o.col || JZ.ink2;
  // legs and pedal lyre
  for (const lx of [40, 820]) paint(P([[lx - 16, -300], [lx + 16, -300], [lx + 10, 0], [lx - 10, 0]]), { wash: col, ink: JZ.ink, sw: sw * .7 });
  paint(P([[300, -300], [330, -300], [325, -30], [305, -30]]), { wash: col, ink: JZ.ink, sw: sw * .6 });
  // the lid, propped open
  paint(P([[30, -470], [880, -700], [900, -660], [60, -455]]), { wash: col, ink: JZ.ink, sw });
  inkLine(P([[520, -480], [470, -575]]), sw * 1.2, JZ.ink, 'ink', 0);
  // the case: long, with the curved tail
  paint(P([[0, -470], [620, -470], [760, -450], [880, -420], [900, -380], [880, -300], [0, -300]]), { wash: col, fill: JZ.ink, fillOp: 60, ink: JZ.ink, sw, curv: .3 });
  inkLine(P([[10, -455], [860, -440]]), sw * .6, mixCol(col, JZ.cream, .35), 'inkfine', .2);   // a highlight along the rim
  // the keyboard at the front end: a cream strip with the black keys as dashes
  paint(P([[-70, -350], [10, -350], [10, -320], [-70, -320]]), { wash: JZ.cream, ink: JZ.ink, sw: sw * .6 });
  paint(P([[-78, -360], [10, -360], [10, -350], [-78, -350]]), { wash: col, ink: JZ.ink, sw: sw * .5 });
  return { keys: [x - 30 * s, y - 350 * s], lidTip: [x + 890 * s, y - 680 * s], strings: [x + 450 * s, y - 470 * s] };
}
// a straight-on keyboard for close-ups: x, y = top-left, w, h; down(i) = 0..1 how far white key i is pressed
function keyboard(x, y, w, h, n, down = () => 0, o = {}) {
  boilSeed('keys' + (o.key || ''));
  const kw = w / n, sw = clamp(kw / 30, .5, 2);
  for (let i = 0; i < n; i++) { const d = down(i); paint(rectPts(x + i * kw, y + d * h * .04, kw, h), { wash: d > .3 ? JZ.mustLt : JZ.cream, ink: JZ.ink, sw }); }
  for (let i = 0; i < n - 1; i++) { if ([2, 6].includes(i % 7)) continue; paint(rectPts(x + (i + .68) * kw, y, kw * .64, h * .6), { wash: JZ.ink, ink: JZ.ink, sw: sw * .6 }); }
}

// ---------- drum kit, front view (x, y = floor under the kick; s = scale, 1 → the kick is 260 px across) ----------
// o.hit = { snare, kick, ride, hat } ages in seconds (hits wobble and flash); returns world points for sticks to meet
function drumKit(x, y, s, o = {}) {
  boilSeed('kit' + (o.key || ''));
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), sw = 1.3 * s, h = o.hit || {};
  const wob = a => a == null ? 0 : Math.exp(-a * 9) * Math.sin(a * 55);
  // ride cymbal (a big tilted disc on a stand, flat), right
  const rw = wob(h.ride) * .06;
  inkLine(P([[250, 0], [250, -360]]), sw * 1.2, JZ.ink, 'ink', 0);
  paint(P(ellPts(250, -372 + wob(h.ride) * 6, 150, 26, 26, 0, -.12 + rw)), { wash: JZ.mustard, fill: JZ.mustDk, fillOp: 80, tex: .6, ink: JZ.ink, sw });
  // hi-hat, left: two thin discs
  inkLine(P([[-250, 0], [-250, -300]]), sw, JZ.ink, 'ink', 0);
  for (const dy of [0, 10]) paint(P(ellPts(-250, -306 + dy - (h.hat != null ? Math.exp(-h.hat * 12) * 6 : 0) * (dy ? 0 : 1), 88, 14, 20, 0, .05)), { wash: JZ.mustard, fill: JZ.mustDk, fillOp: 90, ink: JZ.ink, sw: sw * .8 });
  // kick drum: a big cream head with a vermilion hoop
  const kb = h.kick != null ? Math.exp(-h.kick * 10) : 0;
  paint(P(ellPts(0, -130, 130 * (1 + kb * .03), 130 * (1 - kb * .02), 32)), { wash: JZ.verm, ink: JZ.ink, sw });
  paint(P(ellPts(0, -130, 112, 112, 30)), { wash: JZ.cream, fill: JZ.smoke, fillOp: 60, ink: JZ.ink, sw: sw * .7 });
  // a painted emblem on the head: a mustard disc and an ink bar (no lettering)
  paint(P(ellPts(0, -130, 46, 46, 20)), { wash: JZ.mustard, ink: null });
  paint(P([[-60, -126], [60, -126], [60, -112], [-60, -112]]), { wash: JZ.ink, ink: null });
  // snare, left of the kick: a short drum seen from the front and a little above (a flat ellipse over a band)
  const sb = wob(h.snare) * 4;
  inkLine(P([[-150, 0], [-150, -210]]), sw, JZ.ink, 'ink', 0);
  paint(P([[-230, -250], [-70, -250], [-70, -205], [-230, -205]]), { wash: JZ.cream, fill: JZ.verm, fillOp: 50, ink: JZ.ink, sw });
  for (let i = 0; i < 5; i++) inkLine(P([[-220 + i * 36, -250], [-205 + i * 36, -205]]), sw * .5, JZ.ink, 'inkfine', 0);
  paint(P(ellPts(-150, -250 + sb, 80, 16, 22)), { wash: JZ.cream, ink: JZ.ink, sw });
  // a small tom on the kick
  paint(P([[-60, -300], [60, -300], [60, -262], [-60, -262]]), { wash: JZ.verm, ink: JZ.ink, sw });
  paint(P(ellPts(0, -300, 60, 12, 18)), { wash: JZ.cream, ink: JZ.ink, sw: sw * .8 });
  return { snare: [x - 150 * s, y - 250 * s], ride: [x + 250 * s, y - 372 * s], hat: [x - 250 * s, y - 306 * s], tom: [x, y - 300 * s] };
}
// a drum stick or a wire brush held at the arm tip (arm space: +x along the arm); smear 0..1 draws it as a smear frame
function stick(u, sw, o = {}) {
  const L = (o.len ?? 3.4) * u, a = o.a || 0, sm = o.smear || 0;
  push(); rotate(a);
  if (sm > .05) for (let i = 1; i <= 3; i++) inkLine([[0, 0], [L, -i * sm * .5 * u * (o.dir || 1)]], sw * (1.4 - i * .3), mixCol(JZ.cream, JZ.ink, .1 + i * .15), 'dry', 0);
  if (o.brush) {
    inkLine([[-.2 * u, 0], [L * .6, 0]], sw * 1.3, JZ.ink, 'ink', 0);
    for (let i = 0; i < 7; i++) inkLine([[L * .6, 0], [L, (i - 3) * .12 * u + jit(.03 * u)]], sw * .35, '#9A9486', 'inkfine', 0);
  } else paint([[-.3 * u, -.22 * u], [L, -.12 * u], [L + .18 * u, 0], [L, .12 * u], [-.3 * u, .22 * u]], { wash: JZ.cream, ink: JZ.ink, sw: sw * .7 });
  pop();
}

// ---------- the city (world space) ----------
// a flat building: x, y = its foot on the street, w, h; windows lit by lit(i) = 0..1
function building(x, y, w, h, o = {}) {
  boilSeed('bld' + (o.key ?? x));
  const col = o.col || JZ.blueDk;
  block(rectPts(x, y - h, w, h), col, { ink: o.ink === undefined ? JZ.ink : o.ink, sw: o.sw ?? 1.2 });
  if (o.roof) block([[x - 6, y - h], [x + w + 6, y - h], [x + w + 6, y - h - 14], [x - 6, y - h - 14]], mixCol(col, JZ.ink, .4), { ink: null });
  const cw = o.cell ?? 46, nx = Math.max(1, Math.floor((w - 20) / cw)), ny = Math.max(1, Math.floor((h - 50) / (cw * 1.3)));
  const ox = x + (w - nx * cw) / 2 + cw * .22;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const id = i + j * nx, L = o.lit ? o.lit(id, i, j) : (hash(id * 3.7 + (o.seed || 0)) > .55 ? 1 : 0);
    const wx = ox + i * cw, wy = y - h + 34 + j * cw * 1.3;
    paint(rectPts(wx, wy, cw * .56, cw * .78), { wash: L > .5 ? mixCol(JZ.blue, JZ.mustLt, clamp(L)) : mixCol(col, JZ.ink, .35), ink: null });
    if (o.inWindow && L > .5) o.inWindow(id, wx + cw * .28, wy + cw * .78, cw);
  }
}
// a street lamp: x, y = foot, h = height; on 0..1 (it lights with a burst of drum shards: see shards())
function streetLamp(x, y, h, on, o = {}) {
  boilSeed('lamp' + (o.key ?? x));
  inkLine([[x, y], [x, y - h]], 2.4 * (o.s ?? 1), JZ.ink, 'ink', 0);
  inkLine([[x, y - h], [x + 24, y - h - 16], [x + 44, y - h - 6]], 2 * (o.s ?? 1), JZ.ink, 'ink', .5);
  const lx = x + 44, ly = y - h + 4;
  if (on > .01) { glow(lx, ly + 10, 160 * on, '#FFC766', .85 * on); halftone('disc', lx, y, 260 * on, 50 * on, JZ.mustLt, .5 * on); }
  paint([[lx - 16, ly - 10], [lx + 16, ly - 10], [lx + 10, ly + 10], [lx - 10, ly + 10]], { wash: on > .5 ? JZ.mustLt : JZ.ink2, ink: JZ.ink, sw: 1 });
  return [lx, ly];
}
// a phone booth: x, y = foot; s = scale (1 → 400 px tall); ring 0..1
function phoneBooth(x, y, s, o = {}) {
  boilSeed('booth' + (o.key || ''));
  const P = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), sw = 1.5 * s;
  block(P([[-80, 0], [80, 0], [80, -380], [-80, -380]]), JZ.verm, { ink: JZ.ink, sw });
  paint(P([[-90, -380], [90, -380], [80, -410], [-80, -410]]), { wash: JZ.vermDk, ink: JZ.ink, sw });
  // glass panes, lit from inside
  for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) paint(P(rectPts(-62 + i * 64, -350 + j * 72, 58, 64)), { wash: o.lit ? JZ.mustLt : JZ.blueLt, ink: JZ.ink, sw: sw * .5 });
  if (o.lit) glow(x, y - 200 * s, 260 * s, '#FFD27A', .7);
  if (o.inside) o.inside(x, y - 20 * s, s);
  const [px, py] = [x + 30 * s, y - 210 * s];
  phone(px, py, .9 * s, { ring: o.ring, lift: o.lift, key: 'booth' });
  if (o.ring > .05) for (let i = 0; i < 3; i++) {   // painted ring marks, jumping out on each ring
    const a = -1.2 + i * .5, r0 = 70 * s, r1 = (105 + 20 * Math.sin(T * 30)) * s;
    inkLine([[px + Math.cos(a) * r0, py - 40 * s + Math.sin(a) * r0], [px + Math.cos(a) * r1, py - 40 * s + Math.sin(a) * r1]], sw * 1.2 * o.ring, JZ.cream, 'ink', 0);
  }
  return [px, py];
}
// the moon, a mustard disc with halftone craters (also the ride cymbal's rhyme)
function moon(x, y, r, o = {}) {
  boilSeed('moon' + (o.key || ''));
  glow(x, y, r * 2.2, '#FFD890', o.glow ?? .6);
  block(ellPts(x, y, r, r, 40), o.col || JZ.mustard, { ink: o.ink === undefined ? null : o.ink, sw: o.sw ?? 1.2 });
  halftone('disc', x + r * .25, y + r * .2, r * 1.2, r * 1.2, JZ.mustDk, .5);
}
