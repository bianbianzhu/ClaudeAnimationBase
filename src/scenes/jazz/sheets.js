// jazz/sheets.js: model sheets for "Where Can You Be" (reference only, labels allowed):
//   node render.mjs --loop=jazzcast --sheet=0.3 --cols=1 --w=1920 --out=out/check/jazz_cast.jpg
//   node render.mjs --loop=jazzshapes --sheet=0.3,0.6 --cols=1 --w=1920 --out=out/check/jazz_shapes.jpg
(() => {
  const label = (txt, x, y, size = 22, col = JZ.cream) => letter(txt, x, y, size, col, { ink: false, alpha: .85 });

  LOOPS.jazzcast = t => {
    plate('cast');
    ground(JZ.ink);
    block(rectPts(0, 600, W, 480), JZ.blue, { ink: null });
    block(ellPts(1560, 250, 190, 190, 40), JZ.mustard, { ink: null });
    halftone('ramp', W / 2, 840, W, 480, JZ.blueDk, .8);
    spotlight(420, -40, 330, 620, 520, { key: 'a' });
    const [ba, bi] = sinceBeat(t), [bb] = sinceBackbeat(t);
    // singer
    const sg = singer(330, 620, 30, t, { ...feel('sad', t, { eyes: 'closed' }), mouth: 'open', sing: false, key: 'sg' });
    voiceCurls(sg.mouth[0] + 30, sg.mouth[1] - 20, 13 + (t % 2), { s: 1 });
    label('singer', 330, 700);
    // sax
    const sx = saxist(800, 620, 24, t, { ...feel('cool', t), shine: frac(t * .7), key: 'sx' });
    saxRibbon(flowPath(sx.bell[0], sx.bell[1], -.7, 520, t, { amp: 50, curl: 60 }), 44, t, { key: 'sx' });
    label('sax', 800, 700);
    // trumpet
    const tp = trumpeter(1150, 620, 22, t, { blow: .5 + .5 * Math.sin(t * 3), shine: frac(t * .5 + .3), key: 'tp' });
    rays(tp.bell[0] + 8, tp.bell[1], -.35, (t % 2) * .9, { len: 360, n: 4, hold: 1.2 });
    label('trumpet', 1150, 700);
    // bass
    const bs = bassist(1550, 620, 22, t, { pluck: [ba, 9, 9, 9], key: 'bs' });
    ripples(bs.body[0], bs.body[1], [ba, ba + BEAT], { speed: 380, key: 'bs', life: 1.2 });
    label('bass', 1560, 700);
    // piano + drums, lower row, smaller
    pianist(260, 1020, 16, t, { key: 'pn' });
    pianoTiles(250, 760, 34, 6, 1, [ba, ba + BEAT], { key: 'pn' });
    label('piano', 420, 1050);
    const kit = drummer(1000, 1020, 20, t, {
      hit: { snare: bb, ride: ba }, key: 'dr',
      left: { a: -.3 + .5 * Math.exp(-bb * 8), sa: -.9 }, right: { a: .1, sa: -.4 },
    });
    shards(kit.snare[0], kit.snare[1], bb, bi, { dist: 200 });
    shimmer(kit.ride[0], kit.ride[1], 70, 14, ba, { key: 'dr' });
    label('drums', 1000, 1050);
    lover(1500, 1010, 20, { view: 'qback' });
    lover(1680, 1010, 20, { view: 'side', flip: true, sil: JZ.cream });
    label('the one who left', 1590, 1050);
    // the table
    const top = cafeTable(1850, 1030, .4);
    candle(1800, top, .9, t);
    phone(1880, top, .6);
  };
  LOOPS.jazzcast.len = 4;

  // the players at acting size, to judge each design
  LOOPS.jazzbig = t => {
    plate('big');
    ground(JZ.ink);
    block(rectPts(0, 520, W, 560), JZ.blue, { ink: null });
    halftone('ramp', W / 2, 800, W, 560, JZ.blueDk, .7);
    const [ba] = sinceBeat(t), [bb, bbi] = sinceBackbeat(t);
    const sg = singer(300, 500, 34, t, { mouth: 'open', sing: false, aL: -.4, key: 'sg' });
    voiceCurls(sg.mouth[0] + 40, sg.mouth[1] - 10, 13.4 + (t % 2), { s: 1.4 });
    const sx = saxist(900, 500, 34, t, { shine: frac(t * .7), key: 'sx' });
    saxRibbon(flowPath(sx.bell[0], sx.bell[1], -1.0, 380, t, { amp: 40, curl: 50 }), 46, t, { key: 'sx', grow: .8 });
    const tp = trumpeter(1420, 500, 34, t, { blow: .7, shine: frac(t * .5 + .3), key: 'tp' });
    rays(tp.bell[0] + 8, tp.bell[1], -.1, .5, { len: 240, n: 4, hold: 1.2 });
    const bs = bassist(260, 1040, 26, t, { pluck: [ba, 9, 9, 9], key: 'bs' });
    pianist(760, 1040, 26, t, { key: 'pn' });
    const kit = drummer(1620, 1040, 26, t, { hit: { snare: bb, ride: ba }, key: 'dr', left: { a: -.1, sa: -1.0 }, right: { a: .2, sa: 1.0 } });
  };
  LOOPS.jazzbig.len = 4;

  LOOPS.jazzshapes = t => {
    plate('shapes');
    ground(JZ.cream);
    block(rectPts(0, 0, W / 2, H / 2), JZ.ink, { ink: null });
    block(rectPts(W / 2, 0, W / 2, H / 2), JZ.blue, { ink: null });
    block(rectPts(0, H / 2, W / 2, H / 2), JZ.mustard, { ink: null });
    const [ba, bi] = sinceBeat(t), [bb, bbi] = sinceBackbeat(t);
    saxRibbon(flowPath(80, 300, -.1, 820, t, { amp: 80, curl: 70 }), 60, t, { key: 'r1', shine: 1 });
    ripples(1440, 270, [ba, ba + BEAT, ba + 2 * BEAT], { key: 'r' });
    pianoTiles(120, 820, 60, 9, 2, [ba], { key: 't', gap: 8 });
    shards(1400, 800, bb, bbi, { dist: 260, size: 40 });
    rays(1060, 1000, -.6, (t % 2), { len: 700, hold: 1.2 });
    halftone('disc', 1700, 900, 300, 300, JZ.verm, 1);
    halftone('ramp', 1250, 620, 300, 200, JZ.ink, 1);
    label('sax ribbon', 300, 480); label('bass ripples', 1440, 480); label('piano tiles', 420, 1040, 22, JZ.ink); label('drum shards · trumpet rays · halftone', 1440, 1040, 22, JZ.ink);
  };
  LOOPS.jazzshapes.len = 4;
})();
