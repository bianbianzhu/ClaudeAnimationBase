// jazz/cast.js: the band (STORYBOARD_jazz.md "Cast"). Each is the standard Clawd in costume with its instrument, and
// returns world points (bell, mouth, hands) for the sound shapes to come from.
//   o: the usual clawd() options (emotion spreads, sil, view, flip, boilKey...) plus per-player ones below.

// the singer: front / q view at the ribbon mic, gardenia + bow tie; the mouth follows the sung words
function singer(x, y, u, t, o = {}) {
  const view = o.view || 'q', f = o.flip ? -1 : 1, V = VIEWS[view];
  const mouthX = V.face ? (V.face.cx + V.face.mx * V.face.fw) : 0;
  const mo = o.sing === false ? (o.mouth ?? null) : (singMouth(t) ?? o.mouth ?? null);
  const hold = o.mic !== false && view !== 'front';
  clawd(x, y, u, { eyes: 'closed', hat: ['gardenia', 'bowtie'], ...o, view, mouth: mo, ...(hold ? { aR: o.aR ?? .45 } : {}) });
  let mic = null;
  if (o.mic !== false) {
    const mx = x + f * (view === 'front' ? 0 : 7.2) * u, my = y + (o.micDy ?? 0);
    mic = ribbonMic(mx, my, (o.micH ?? 5.3) * u, { s: u / 26, tilt: f * -.35, lean: -f * .1, shine: o.micShine, key: o.key });
  }
  return { mouth: [x + f * mouthX * u, y + ((o.dy || 0) - 4.3) * u], mic, head: [x, y + ((o.dy || 0) - 8) * u] };
}

// the saxophonist: side view, pork-pie hat, shades; the sax hangs in front, the near arm on the keys
function saxist(x, y, u, t, o = {}) {
  const f = o.flip ? -1 : 1, sc = o.sc ?? 1.15, shine = o.shine;
  let bell = null;
  clawd(x, y, u, {
    eyes: 'shades', hat: 'porkpie', ...o, view: 'side', aL: o.aL ?? .05,
    draw: (uu, sw) => {
      const s = sax(uu, sw, { sc, shine, glow: o.glow });
      bell = s.bell;
      // the hands on the keys (little clay mittens over the horn)
      for (const [kx, ky] of s.hands) paint(rrPts(kx - .75 * uu, ky - .32 * uu, .95 * uu, .64 * uu, .25 * uu), { wash: o.col || PAL.clay, ink: PAL.ink, sw: sw * .7 });
      if (o.draw) o.draw(uu, sw);
    },
  });
  const sq = (o.sq || 0), dy = (o.dy || 0) * u;
  return { bell: bell ? [x + f * bell[0] * (1 + sq * .6), y + dy + bell[1] * (1 - sq)] : [x + f * 6.6 * u, y - 5 * u] };
}

// the trumpeter: side view, beret; cheeks puff (blush + squash) on o.blow
function trumpeter(x, y, u, t, o = {}) {
  const f = o.flip ? -1 : 1, bl = o.blow ?? 0;
  let bell = null;
  clawd(x, y, u, {
    eyes: bl > .5 ? 'squeeze' : 'closed', hat: 'beret', blush: .3 + .5 * bl, ...o, view: 'side', aL: o.aL ?? .75, sq: (o.sq || 0) - .05 * bl,
    draw: (uu, sw) => {
      const tr = trumpet(uu, sw, { sc: o.sc ?? 1.25, shine: o.shine });
      bell = tr.bell;
      paint(rrPts(tr.valves[0] - .45 * uu, tr.valves[1] - .75 * uu, .9 * uu, .7 * uu, .25 * uu), { wash: o.col || PAL.clay, ink: PAL.ink, sw: sw * .7 });
      if (bl > .02) paint(ellPts(2.5 * uu, -4.2 * uu, .55 * uu * (1 + bl * .6), .5 * uu * (1 + bl * .6), 12), { wash: PAL.clayLt, ink: PAL.ink, sw: sw * .5 });
    },
  });
  const dy = (o.dy || 0) * u;
  return { bell: bell ? [x + f * bell[0], y + dy + bell[1]] : [x + f * 7.5 * u, y - 4.3 * u] };
}

// the pianist: side view on the bench at the grand piano, round spectacles; the near arm on the keys.
// x, y = the floor under the player; the piano is drawn to its right (o.flip mirrors). Returns the piano's points.
function pianist(x, y, u, t, o = {}) {
  const f = o.flip ? -1 : 1, s = o.ps ?? u / 64;
  // the bench
  boilSeed('bench' + (o.key || ''));
  if (!o.noBench) {
    const col = o.sil || JZ.ink2;
    paint(rectPts(x - 3.8 * u, y - 2.6 * u, 7.6 * u, .8 * u), { wash: col, ink: JZ.ink, sw: 1 });
    for (const lx of [-3.3, 3]) paint(rectPts(x + lx * u, y - 1.9 * u, .45 * u, 1.9 * u), { wash: col, ink: JZ.ink, sw: .8 });
  }
  clawd(x, y - 1.2 * u, u, { hat: ['specs', 'beanie'], eyes: 'closed', ...o, view: 'side', noLegs: true, aL: o.aL ?? .35 });
  const px = x + f * 4.3 * u, py = y;
  let pts = null;
  if (o.piano !== false) {
    const draw = () => { push(); if (f < 0) { translate(px, 0); scale(-1, 1); translate(-px, 0); } pts = grandPiano(px + 70 * s, py, s, { key: o.key, col: o.pianoCol }); pop(); };
    if (o.sil) silhouette(o.sil, draw); else draw();
  }
  return { piano: pts, hands: [x + f * 4.2 * u, y - 5 * u] };
}

// the bassist: side view, newsboy cap, the upright bass in front (leaning back onto the player); o.pluck = string ages
function bassist(x, y, u, t, o = {}) {
  const f = o.flip ? -1 : 1, bh = (o.bh ?? 16) * u;
  clawd(x, y, u, { eyes: 'closed', hat: 'cap', ...o, view: 'side', aL: o.aL ?? -.1 });
  const bx = x + f * 4.4 * u;
  let pts;
  const draw = () => { push(); if (f < 0) { translate(bx, 0); scale(-1, 1); translate(-bx, 0); } pts = uprightBass(bx, y, bh, { lean: -.2, pluck: o.pluck, key: o.key }); pop(); };
  if (o.sil) silhouette(o.sil, draw); else draw();
  // hands: one plucking (over the strings), one high on the neck
  const hand = (hx, hy) => paint(rrPts(hx - .5 * u, hy - .35 * u, u, .7 * u, .3 * u), { wash: o.sil || PAL.clay, ink: o.sil || PAL.ink, sw: clamp(u / 15, .45, 2.4) * .7 });
  const mir = p => f < 0 ? [2 * bx - p[0], p[1]] : p;
  const pl = mir(pts.pluck), nk = mir(pts.neck);
  hand(pl[0] - f * .3 * u, pl[1] + (o.pluckDy ?? 0));
  hand(nk[0], nk[1]);
  return { pluck: pl, neck: nk, body: [bx, y - bh * .3] };
}

// the drummer: front view behind the kit, red headband; o.left / o.right = { a: arm angle, stick: stick options }
function drummer(x, y, u, t, o = {}) {
  const ks = o.ks ?? u / 40;
  const L = o.left || {}, R = o.right || {};
  clawd(x, y - (o.seat ?? 2.8) * u, u, {
    eyes: 'determined', hat: 'band', ...o, view: 'front', noLegs: true,
    aL: L.a ?? -.2, aR: R.a ?? -.2,
    armL: (uu, sw) => stick(uu, sw, { a: L.sa ?? -.6, brush: o.brushes, smear: L.smear, dir: 1, ...L.stick }),
    armR: (uu, sw) => stick(uu, sw, { a: R.sa ?? -.6, brush: o.brushes, smear: R.smear, dir: 1, ...R.stick }),
  });
  let kit;
  const draw = () => { kit = drumKit(x, y, ks, { hit: o.hit, key: o.key }); };
  if (o.sil) silhouette(o.sil, draw); else draw();
  return kit;
}

// the one who left: only ever a faceless cream figure with an ink outline (a rose fill read as an animal), wearing the
// gardenia's twin. Pass sil / silInk to recolour it (e.g. an ink shadow on a lit window).
function lover(x, y, u, o = {}) { clawd(x, y, u, { hat: 'gardenia', view: 'back', ...o, sil: o.sil || JZ.cream, silInk: o.silInk || (o.sil ? o.sil : JZ.ink) }); }
