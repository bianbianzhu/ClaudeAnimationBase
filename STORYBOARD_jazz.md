# Where Can You Be: storyboard

Music: `assets/where_can_you_be.mp3` ("Where Can You Be", Suno, jazz ballad with vocals), 234.65 s.
Beat map: `src/scenes/jazz/beatmap.js` (tools/audio/beats.py). The tempo drifts from ~139.7 to ~135 bpm, so every
time below comes from `barT(k)` (bar k's first beat), never from a constant grid. First downbeat 0.621 s, average
~138 bpm, a bar is ~1.74 s. Lyrics timed by tools/audio/lyrics.py into `assets/where_can_you_be_lyrics.srt`; they
are burned in as subtitles after rendering (docs/MUSIC_SYNC.md). The painted frame itself stays text-free.

Instruments, by ear:
- 0–0.5 s: drum pickup. 0.5–6 s: piano and cymbals. 6–9 s: tenor sax enters, over cymbals. 9–12 s: piano. 12 s: voice.
- Solo 104–132 s: piano 104–106, sax 106–120, trumpet 120–127, piano 127–132.
- Solo pitch contour (the melody's height, used to fly the camera): `out/audio/wcyb_solo_pitch.json`, MIDI per frame.
  It climbs highest in bars 73–74 (127–130 s, piano, up to ~F5).

## Song map

| bars | time (s) | section | lyric lines | shots |
|---|---|---|---|---|
| −1–0 | 0–0.62 | drum pickup | | A |
| 0–6 | 0.62–12.72 | intro: piano + cymbals, sax 6–9 s | | B, C, D |
| 7–35 | 12.72–62.64 | verse 1 | 1–8 | E–L |
| 36–43 | 62.64–76.46 | pre-chorus | 9–12 | M |
| 44–59 | 76.46–104.14 | chorus 1 | 13–20 | N1–N5 |
| 60–75 | 104.14–132.03 | instrumental solo | | O1–O4 |
| 76–92 | 132.03–161.79 | verse 2 | 21–28 | P1–P5 |
| 93–100 | 161.79–175.84 | bridge (bass drops out, bars 94–99) | 29–32 | Q1–Q3 |
| 101–117 | 175.84–205.60 | final chorus (break bars 116–117) | 33–40 | R1–R5 |
| 118–125 | 205.60–219.72 | outro (break bar 125) | 41–42 | S |
| 126–131 | 219.72–230.33 | full-band ending, last chord | | T |
| 132–134 | 230.33–234.65 | fade | | U |

## Logline

Every night the singer Clawd lights a candle on the empty table where its love used to sit, and sings to it. The
song's sounds take shape (an orange sax ribbon, blue bass ripples, red drum shards, black-and-white piano tiles,
gold trumpet rays) and pour out of the club to search the whole city for the one who left. They light the streets,
start the trains and fly over the roofs, but find only a silhouette that is always turning the corner. At the last
chord every shape comes home and locks into one picture, the album cover. Then Clawd blows out the candle, and the
film loops back to the match that lights it again tomorrow night.

## Look: a 1960s jazz record cover that moves

- **Palette (four main colours plus two instrument accents):** ink `#1E1A1F` (never pure black), cream `#F1E4C8`,
  mustard `#E2A62A`, vermilion `#D6452B`; accents: bass blue `#1F3D72`, sax orange `#EE7A2A`. Clawd stays clay
  (`#D97757`), which sits between vermilion and mustard, and is always staged against ink, cream, blue or mustard,
  never on a vermilion field (no contrast). Everything else is built from these.
- **Big flat blocks and thick lines.** Backgrounds are a few hard-edged flat blocks (Saul Bass / Reid Miles
  layouts): a mustard disc, an ink band, a cream field. No soft skies, no gradients except painted halftone.
- **Print texture.** Each flat colour block is printed slightly off its ink line (misregistration, 4–10 px, a fixed
  offset per shot so it doesn't jitter). Halftone dot fields do the shading (spotlight falloff, shadows, night
  sky). The kit's paper grain stays over everything.
- **Boil.** Everything boils at 12 drawings/s (the kit's default).
- **Frame rate is rhythm.** Quiet sections (intro piano, verses, pre-chorus, bridge, outro) are animated on twos
  (`onTwos`, 12 fps). Bursts (the explosion, choruses, solo, full-band ending) go to ones (24 fps).
- **Smears, not motion blur.** Drum sticks and brushes, fingers across keys, the sax player's swing: drawn smear
  frames (stretched shapes plus dry-brush streaks), one or two frames each.
- **Light carries the mood.** A club full of smoke (slow drifting cream wash shapes), cones of spotlight (a flat
  cream wedge + halftone falloff + `glow`), a highlight that slides along the brass on every note.
- **Sound is never notes on a staff.** No music notes, no staves. Sound is only the shapes below.

## The sound shapes (the core idea)

Each instrument's sound has a shape and colour, and it only appears when that instrument plays:

| instrument | shape | colour | what drives it |
|---|---|---|---|
| tenor sax | a long flowing ribbon (one `ribbon()` outline) that unfurls from the bell and curls | sax orange, ink edge | the melody: ribbon height follows the pitch contour in the solo |
| upright bass | expanding concentric ripples, one per walking-bass note | bass blue | every beat (walking bass on the beat) |
| drums | shattered geometric shards (triangles, wedges) bursting out; the ride is a mustard disc | vermilion, mustard | snare on 2 and 4 burst shards; ride shimmer on the swing eighths |
| piano | hopping black-and-white square tiles (a checkerboard that jumps) | ink, cream | chord hits and runs; a run = tiles climbing like stairs |
| trumpet | sharp straight rays fanning from the bell (searchlights) | mustard, cream | each long note throws a ray |
| voice | soft cream smoke curls rising from the mic | cream | the sung words (from the lyric word timings) |

When two instruments play together, their shapes chase and wrap each other: the ribbon threads through the ripples,
shards knock tiles out of their grid.

## Cast (new costumes, all on the standard Clawd model)

All band members are the clay Clawd; hats, props and instruments tell them apart, so their silhouettes read at a
glance. Every instrument is drawn in flat 2D, in key views like Clawd (front, 3/4, side). No 3D.

- **The singer** (lead): a tilted top hat with a vermilion band, a dinner jacket (ink jacket and trousers, a cream shirt
  front), a cream gardenia by the left eye and a rose bow tie (`SINGER_LOOK` in cast.js). The hat and jacket were added
  after viewers mixed the singer up with the one who left (who wears the matching gardenia) in wide shots. Stands at
  a tall vintage ribbon microphone (a chrome capsule on a thin stand with a round base). Its mouth opens on the sung
  words (lyric word timings), eyes mostly closed or sad. Arms: one on the mic stand, one free and acting.
- **The saxophonist**: a pork-pie hat (flat low crown, short brim, mustard band) and sunglasses. A tenor sax held
  diagonally, the bell turned up and forward, brass with an ink outline and a sliding highlight.
- **The trumpeter**: a vermilion beret, tilted. A trumpet held level, the bell to the right. Its body squashes and
  cheeks puff (sq) on the high notes.
- **The pianist**: round spectacles. Sits in profile at a black grand piano (the lid up: one iconic silhouette).
- **The bassist**: a flat newsboy cap. An upright bass twice Clawd's height, leaning on its shoulder.
- **The drummer**: a red headband. A small kit: kick (cream head), snare, hi-hat, one big ride cymbal; brushes in the
  intro and verses, sticks in the choruses and ending.
- **The one who left** ("the love"): a Clawd seen only as a silhouette, never with a face: cream or rose against
  the night, always walking away or turning a corner. Wore a matching gardenia (the singer wears its pair).
- **Props / motifs:** the candle (a short cream candle in a mustard holder), the matchbox, the red table telephone,
  the empty chair, the gardenia.

## Motifs

- **The match and the candle**: the film opens with a match lighting the candle and ends with the candle blown out
  into black, which is the first frame again (a perfect loop).
- **The empty table**: candle, red telephone, empty chair. Seen in E, remembered in M, left behind in S.
- **The silhouette that's always leaving**: turns a corner in H, runs down the stairs in I, rides the train out in
  N3, dissolves in P4. Never caught.
- **The cover**: the Saul-Bass-style composition assembled in B (disc, bars, blocks, a Clawd silhouette) is
  assembled again from every sound shape in T, and freezes on the last chord.
- **Shape match cuts**: sax bell → tunnel; ride cymbal → moon; piano keys → stairs / zebra crossing; bass string →
  telephone wire / power line; drum head → a puddle rippling.

## Cutting rules

- Musician intros (B–F) cut on bar lines (beat 1).
- Every other hard cut lands on a snare backbeat (beat 2 or 4). `beatT()` gives the exact time.
- Every seam has a transition: a match cut, a colour wipe (on piano runs), a push through an object, a silhouette
  switch, a bar-line grid, or a cut on action.
- The bottom 16% of the frame is kept calm (no key action) for the subtitles.

## Emotional arc (the singer)

longing (A–E: `sad`, eyes closed, singing) → worry (G–H: `nervous`, looks toward the door) → slipping (K–L: `sad`,
gloom rising, tint blue) → warm memory (M: `love`, then `sad` as the memory walks away) → anguish (N: `cry` bursts,
then `determined` on "I need to know") → lost in the music (O: eyes closed, the band carries it) → loneliness (P:
`sad`, `teary`) → hope (Q: `hopeful`, reaching out) → defiant, full voice (R: `determined`, `proud` on "Love is still
my only way") → quiet acceptance (S: `sad` → `relieved`, a small smile to the empty chair) → the candle goes out.

Colour arc: black → the club's warm mustard and ink → the city's blue night lit by vermilion and mustard lamps → a
cream memory → full-colour blasts in the choruses → abstract flat colour in the solo → cold blue small hours in verse
2 → a single candle in the bridge → everything lit at once in the final chorus → the empty club → the cover → black.

## Shots

Times are video seconds; `barT(k)` values in brackets. `lt` = time in the shot.

### A · the match  0.00–0.62  (drum pickup)  [in: from black]
Full black. On the pickup a match scrapes: a few sparks, then a flame blooms (glow). Its light finds an extreme
close-up of a brass curve (the sax's bell resting on its stand beside the table) and a highlight slides across it;
behind, two eye glints (the singer). At 0.621 (the first piano chord and cymbal) the frame explodes.
- reads: 0–0.2 black + sparks (the sound of the scrape) · 0.2–0.6 the flame, brass shine · 0.62 BANG.
- 24 fps.

### B · the cover assembles, then the ride  0.62–5.86  [bars 0–3]  [in: the explosion]
B1 0.62–4.13 (bars 0–1): the explosion throws flat colour blocks across the frame; on each piano chord, a block
slams into place: a mustard disc, ink bars (keys), a cream field, a vermilion wedge, a small clay Clawd silhouette.
It becomes a record-cover layout (no text). Piano tiles hop along the bars.
B2 4.13–5.86 (bars 2–3): cut on the bar line: the mustard disc IS a ride cymbal (match cut on the circle): close-up,
a wire brush sweeps across it in a smear, shimmer lines ripple out. The drummer's intro.
- reads: blocks landing, one per chord (each ~0.4 s) · the full cover held for a beat · the cymbal + brush sweep.
- on twos, the explosion itself on ones.

### C · the sax enters  5.86–9.29  [bars 3–5]  [in: bar-line cut]
The saxophonist in a hard spotlight on ink, 3/4 view, medium (u ≈ 24). A breath in (anticipation: body stretches up,
sax tilts back), then the first sax note: the orange ribbon unfurls from the bell across the frame, curling on the
swing. The highlight slides down the brass. The camera follows the ribbon's tip left → right.
- reads: the saxophonist (hat, glasses, horn) · the breath · the ribbon's birth (the core idea's first reveal).

### D · the pianist's profile  9.29–12.72  [bars 5–6]  [in: the ribbon's tip wipes the frame]
The pianist in pure profile silhouette against a big mustard window block; only the spectacles catch light.
Black-and-white tiles hop above the keys on each chord. On the last beats the camera pushes past the piano, across
the smoky room, toward the stage, where the singer steps up to the mic (cut on action at 12.2, the vocal pickup).
- reads: the profile (1.5 s) · the tiles · the push that finds the singer.

### E · "Where can you be, my love?"  12.72–19.57  [bars 7–10]  (line 1: 12.25)  [in: cut on action]
The singer at the ribbon mic, medium, spotlight cone, smoke. Eyes closed, mouth opening on the words, cream smoke
curls rising. Bar 9: the camera drifts right and finds the empty table: a candle, the red telephone, the gardenia,
an empty chair. Hold on it.
- reads: the singer singing (12.7–15.5) · the camera moves (15.5–16.2) · the empty table (16.2–19.5), the candle's
  flame the only movement.

### F · the bassist's fingers  19.57–21.29  [bar 11]  (line 2 "I can't reach you tonight")  [in: bar-line cut]
Extreme close-up: an arm nub plucks a thick bass string; each note sends a blue ripple across the frame. The bass
intro, and the string sets up the wire match cut later.
- reads: fingers + string (0.5 s) · the ripples (1.2 s).

### G · "Why don't you answer your phone?"  21.29–28.18  [bars 12–15]  (line 3)  [in: a blue ripple wipes]
The red table phone, close. Its cord runs off frame; the camera follows the cord (a slow pan) until it becomes a
telephone wire outside the window (match cut on the line, bar 14), which leads across the blue night to a phone booth
on a corner, lit and ringing (painted ring marks, the receiver jiggling), with nobody there.
- reads: the phone (21.3–23.5) · the cord → wire (23.5–25) · the booth ringing, empty (25–28).

### H · "Have you vanished from my life?"  28.18–35.06  [bars 16–19]  (line 4: 30.38)  [in: pan continues]
A wide street, blue night, flat building blocks. On every snare backbeat (2 and 4) a streetlamp lights (vermilion
shards burst from each lamp as it lights), marching toward the far end of the street, where a small rose
silhouette turns the corner and is gone, just as the last lamp lights.
- reads: lamps lighting on the backbeats (28.2–32.5) · the eye travels with them to the far corner · the silhouette
  turns and vanishes (32.5–34) · the empty corner (34–35).

### I · the drummer / "Are you trying to run away"  35.06–41.96  [bars 20–23]  (line 5: 38.98)  [in: cut on beat 2]
I1 35.06–38.51 (bars 20–21): the drummer, full kit, 3/4, brushes; on the backbeats vermilion shards fly from the
snare. The drummer's full intro.
I2 38.51–41.96 (bars 22–23): cut on beat 2 to a piano-key staircase (a match cut from the tiles): the silhouette
runs down it, each step lighting like a key as it's touched.
- reads: the drummer + shards · the stairs (a keyboard!) · the running silhouette.

### J · "Leaving nothing left to say"  41.96–48.85  [bars 24–27]  (line 6: 41.36)  [in: the stairs flatten into a zebra crossing]
The staircase lays down into a zebra crossing (a match cut on the stripes). Overhead view: an empty crossing, a
traffic light changing; one gardenia petal lying on the stripes. The camera rises off it.
- reads: stairs → crossing (a GIF moment) · the empty crossing · the petal.

### K · "Every silent passing hour"  48.85–55.74  [bars 28–31]  (line 7: 52.48)  [in: camera rise continues]
Rising over the rooftops to a clock tower against a huge mustard moon. The minute hand jumps a notch on every beat
(swing time), hours pass; the orange sax ribbon drifts past and wraps around the tower.
- reads: the tower and moon · the hand ticking on the beat · the ribbon's wrap.

### L · "Steals a little of my power"  55.74–62.64  [bars 32–35]  (line 8: 57.74)  [in: the moon match-cuts to the spotlight]
The moon's disc becomes the spotlight's disc on the stage floor. The singer, close-up (u ≈ 50). On each backbeat
the spotlight shrinks a notch; the singer tints blue, gloom rises. The candle in the background burns lower.
At bar 35 the frame goes to pure silhouette (the transition into M).
- reads: the singer close · the light shrinking in steps · the gloom.

### M · the memory (pre-chorus)  62.64–76.46  [bars 36–43]  (lines 9–12)  [in: silhouette switch]
Two Clawd silhouettes side by side on a bench (the singer and the love, both gardenias). The silhouettes stay put;
every two bars the background colour switches (cream → mustard → vermilion → blue: days passing, "side by side
through every day"), with small changes (the love leans in, they share an umbrella, a heart emote). On "You would
never walk away" (bar 42) the background goes ink and the love's silhouette stands up and walks out of frame left;
the singer's stays.
- reads: two together (62.6–66) · each colour switch lands on a bar line, ~3.4 s each · the walk-away (73–76.5).
- on twos.

### N · chorus 1  76.46–104.14  [bars 44–59]  (lines 13–20)
N1 76.46–81.67 (bars 44–46) "Now you escape": smash (on beat 1 of bar 45, the chorus hit): the club door slams, a
rose silhouette just gone through it; the whole band hits and every sound shape bursts out after it through the door
into the street. 24 fps from here.
N2 81.67–85.13 (bars 47–48) "What have I done wrong?": the singer, close, `cry` burst, cymbal crash: shards and
tiles whirl around it.
N3 85.13–90.32 (bars 49–51) "I need to know / Before you're really gone": the subway: blue bass ripples roll the
train's wheels, the train pulls out of the station, the love's silhouette in the last window; the sax ribbon races
after it into the tunnel (through-object: the tunnel mouth = the sax bell).
N4 90.32–97.23 (bars 52–55) "I fear to stay alone / Love has always been my way": out of the bell: the singer alone in
the middle of a huge ink stage, one cone of light; the band behind reduced to silhouettes; all the shapes orbit the
singer slowly.
N5 97.23–104.14 (bars 56–59) "I can't help this aching heart / Since your love went away": the singer turns away;
the pianist's run at the end (bar 59) drives a colour wipe: a mustard block sweeps the frame left → right and leaves
the solo's abstract space behind it.

### O · the solo  104.14–132.03  [bars 60–75]
The band's shapes take over; background leaves reality.
O1 104.14–105.88 (bar 60) piano: a checkerboard of tiles flips across the frame, beat by beat.
O2 105.88–119.81 (bars 61–68) sax: the saxophonist centre, others as silhouettes. The ribbon floods the frame,
then the ribbon becomes a road through the sky: the camera rides it over a flat night city of rooftops, and the
camera's height follows the solo's pitch (higher note → higher). Bar 65 (112.84): the camera flies into the sax's
bell and out of the far end over a different part of the city (through-object transition).
O3 119.81–126.80 (bars 69–72) trumpet: the trumpeter on a rooftop; mustard rays fan from the bell like
searchlights across the sky. Each ray is a long note.
O4 126.80–132.03 (bars 73–75) piano: the tiles climb into a staircase to the sky; the camera climbs them as the
piano run goes to its top notes (bars 73–74), up to the moon. At bar 76 the moon becomes the ride cymbal (match
cut) and the brush sweeps it: back to the song.
- reads: each instrument's takeover lands exactly on its entrance; the camera height visibly follows the melody.
- 24 fps throughout.

### P · verse 2  132.03–161.79  [bars 76–92]  (lines 21–28)  on twos
P1 132.03–137.27 (bars 76–78) "Every memory calls your name": the cymbal → a quiet blue city after the solo. In
windows across the city, lit one per beat, the love's silhouette (memories).
P2 137.27–140.78 (bars 79–80) "Nothing feels the same": the singer walking the street alone, side view, left → right,
the lamps off.
P3 140.78–147.78 (bars 81–84) "Empty rooms and sleepless nights / Hide my tears from morning light": the singer's
room: a bed, two cups (one untouched), a window; the singer awake in the dark, `teary`. The cold cup's surface
ripples in blue on the bass notes.
P4 147.78–154.79 (bars 85–88) "If I hurt you, let me know / Don't disappear without a word": the phone booth from G,
the singer inside, dialing. The ring leaves as a blue ripple across the city; on "disappear" the love's silhouette
at the far end breaks into tiles and scatters.
P5 154.79–161.79 (bars 89–92) "One last chance is all I pray / Don't let love just fade away": back at the club
table. The singer strikes a match (the opening's match, now seen from outside) and relights the candle, which had
gone out.

### Q · bridge  161.79–175.84  [bars 93–100]  (lines 29–32)  on twos, the bass drops out
Q1 161.79–167.06 (bars 93–95) "If there's still a spark inside": the flame, very close; a single spark lifts off it.
Q2 167.06–170.57 (bars 96–97) "Don't let all our dreams just die": the spark rises through the dark club, lighting
the band one by one as it passes (each lights up in its colour).
Q3 170.57–175.84 (bars 98–100) "Take my hand, don't close the door / We can find what we had before": the club door, a
tall bar of light narrowing as it closes. The singer runs and reaches out an arm; the orange ribbon shoots past and
wedges the door, which holds open a crack. The light spills in.

### R · final chorus  175.84–205.60  [bars 101–117]  (lines 33–40)  24 fps
R1 175.84–182.84 (bars 101–104) "Now you escape / What have I done wrong?": the door bursts open and the whole band
pours out into the street playing, shapes everywhere.
R2 182.84–189.85 (bars 105–108) "I need to know / I've waited for so long": bar-line grid: the frame splits into four
panes (singer, sax, drums, bass), each pane popping in on beat 1, then eight panes (adding piano, trumpet, the empty
table, the moon), then merging back to full.
R3 189.85–196.85 (bars 109–112) "I fear to stay alone / Love is still my only way": trading fours (strict 4-bar swap
is the grid's rhythm here, 2+2 bars): split screen, singer ↔ sax, answering each other; at bar 111 it swaps to
drums ↔ trumpet.
R4 196.85–202.09 (bars 113–115) "My heart will never cease to weep": the whole city lit by the band: lamps (drums),
trains (bass), the ribbon over the roofs (sax), rays (trumpet), tiles in windows (piano); a huge crane up.
R5 202.09–205.60 (bars 116–117) "Until you find your way": the break: everything stops dead; one ray of light on the
singer; the shapes hang in the air, frozen (boil only).

### S · outro  205.60–219.72  [bars 118–125]  (lines 41–42)  on twos
After hours: chairs up on tables, the band packing (the sax going into its case, the drummer's brushes into a
pocket). The singer sits at the empty table, candle and gardenia. On "I'm still waiting here for you" the singer
takes the gardenia from its own head and lays it by the other one, and gives the empty chair a small smile.
- reads: the club emptying (205.6–208) · the singer at the table (208–212.5) · the gardenia laid down (213–216.9) · the
  smile (217–219.7).

### T · the cover  219.72–230.33  [bars 126–131]  24 fps
The full-band ending. From every corner, every sound shape comes home: the ribbon, ripples, shards, tiles, rays and
smoke fly in and lock, hit by hit, into the cover composition from B (the disc, bars, blocks), with the whole band
as silhouettes in it and the singer and the candle at its centre. The last chord (bar 131, 228.55–230.33) lands the
final piece. Freeze (boil only).

### U · out  230.33–234.65  [bars 132–134]  [out: to black = the first frame]
The cover holds, then its colours drain away, block by block, into the candle's flame, until only the flame and the
singer's face are left. The singer blows it out. Black. (Loop: frame 0 is black, and the match strikes again.)

## Checks against the guide

- An event in every shot: yes (see each shot's reads).
- Reads have time: the fast sections (N, O, R) carry one big read per 1–2 bars; verses hold 3–7 s per read.
- Transitions at every seam: listed per shot.
- Text: none in the frame (subtitles are burned in afterwards, as the user asked).
- The ending rhymes with the opening: the match / candle, and the cover from B is rebuilt in T.

---

## As built

The film as it was finally made, which differs from the plan above where review showed something read better. Times
are the shot starts registered in the scene files (resolved from the beat map); the one-line notes are what each shot
actually does. Section files: `a_intro.js` (A–D), `b_verse1.js` (E–M), `d_chorus1.js` (N), `e_solo.js` (O),
`f_verse2.js` (P–Q), `h_final.js` (R–U).

### Changes from the plan, overall
- **Hard cuts moved onto snare backbeats.** Most shot boundaries after D sit on beat 2 or 4 of a bar rather than on
  the bar line (the plan's rule for hard cuts), so many starts below are a beat or two off the planned bar times.
- **The singer's costume.** A tilted top hat and a dinner jacket were added (see Cast) because viewers mixed the singer
  up with the one who left in wide shots.
- **The one who left** is a faceless cream figure with an ink outline (`lover()`), not a rose silhouette: a rose fill
  read as an animal.
- **Scale.** The first pass of most sections put characters too small in big fields; every section was revised to
  medium (u ≈ 24–36) or close-ups (u 45+) for the reads that matter.

### Shots

| shot | start–end (s) | what happens |
|---|---|---|
| A | 0.00–0.62 | Pure black; the match strikes on the drum pickup (0.21) along the box's strip, catches (0.34), lights a huge brass bell with the flame reflected in it; it gutters (the breath in). The box stays hidden until the strike so frame 0 is black (the loop). |
| B1 | 0.62–4.13 | The first chord: one pale flash frame, the whole frame as wedges of colour, which fly apart from the flame's point; the cover builds beat by beat (disc, blue band, vermilion wedge, ink bars dropping in, the singer's ink silhouette at the mic). |
| B2 | 4.13–5.86 | Match cut: the disc flattens into the ride cymbal; a wire brush (its handle running off frame) sweeps it with smear frames and shimmer. |
| C | 5.86–9.29 | The saxophonist in a hard spotlight: a visible breath in (stretch, lean back), the first note at 6.36 unfurls the orange ribbon across the frame, the camera follows its tip; the ribbon's orange becomes a brush wipe. |
| D | 9.29–11.90 | The pianist in pure profile silhouette (beanie, lit spectacles) against a mustard window, the grand piano in ink; tiles hop over the keys on the beats; a whip pan right. |
| E | 11.90–19.57 | Catches the whip on the singer (medium, u ≈ 36 on screen); eyes open on the held "my… love", the free arm reaches; it looks right and the camera follows to the empty table (candle, red phone, gardenia, chair), held ~2.5 s. |
| F | 19.57–21.29 | The bassist's fingers, extreme close-up: four walking notes, four ripples; the last swells into a blue wipe. |
| G1 | 21.29–24.31 | The phone: the receiver lifts, a nub dials, the camera follows the cord to the window. |
| G2 | 24.31–28.18 | Match cut cord → telephone wire, running to an empty booth ringing on beats 1–2. |
| H | 28.18–35.06 | The street closer, five big lamps lighting on the backbeats with shard bursts; the lover walks into the light and turns the corner (32.35) just before the last lamp; a petal drifts onto the empty corner. |
| I1 | 35.06–38.94 | The drummer's intro in a circular vignette: ride shimmer, the brush lifts, whips down (smear) and hits the snare on 2 and 4; tiles fall into a staircase. |
| I2 | 38.94–41.96 | The tiles are key-steps; the lover runs down them (u ≈ 19), each key lighting. |
| J | 41.96–48.42 | The keys lie down one by one into a zebra crossing; a petal; the walk light, nobody crosses; the camera rises. |
| K | 48.42–56.17 | The clock tower against the moon; the minute hand jumps each beat; the sax ribbon wraps the tower. |
| L | 56.17–62.64 | The moon match-cuts to the spotlight disc behind the singer; it shrinks on five backbeats, the singer goes blue and gloomy (acted with `emotions()`, a trembling reach at the light); silhouette at bar 35. |
| M | 62.64–76.46 | The bench (u ≈ 32): the colour switches on bar lines (cream → mustard with a heart → vermilion → blue with an umbrella); at bar 43 dark, a lamp; the love settles, rises, holds a look back (~0.65 s), walks out left; the singer leans after it, sags; an iris to black by 76.38. |
| N1a | 76.46–79.50 | From black: a sliver of door light; the lover glances back and leaves; the door slams on 78.19; the club snaps to colour and every sound shape bursts out and blows the door open on the backbeat. |
| N1b | 79.50–81.23 | The flood down the night street; the lover turns into a side street; the ribbon arrives too late and curls round the empty corner. |
| N2 | 81.23–85.56 | The singer close before the mustard disc: the crash rings it, a cry burst with a whirl of shards and tiles; `determined` at 84.26, looking after the whirl. |
| N3 | 85.56–90.32 | The subway: the lover in the last window, bass ripples roll the wheels, the ribbon races after the train into a brass bell-rimmed tunnel until the mouth fills the frame. |
| N4 | 90.32–97.67 | Out of the bell onto a huge ink stage with one cone of light; the band goes dark one by one; a slow push-in (u ≈ 27 → 35); the shapes wheel round the singer on the beat; the reach for the ribbon held on the backbeat, then the sag. |
| N5 | 97.67–104.14 | The singer turns from the mic, walks upstage, looks back once (eyes, then head, a hold), turns away; the bar-59 piano run drives a tile staircase and a mustard block across the frame: full mustard at 104.14. |
| O1 | 104.14–105.88 | From mustard, a checkerboard flips across the frame on beats 1–3; the tiles hop away to show the saxophonist breathing in. |
| O2a | 105.88–109.35 | The ribbon bursts out on the bar line, loops round the frame and scoops the player up; the band shrinks to blue silhouettes; the camera dives into the ribbon. |
| O2b | 109.35–112.84 | Over the city from straight above; the player rides the melody (higher note → the city shrinks, the shadow falls away); into the bell. |
| O2c | 112.84–119.81 | Brass rings rush past inside the horn; out over a river district with ripples on the water; the big climb at 117–118; the last note's giant ribbon covers the frame at 119.81. |
| O3 | 119.81–126.80 | The trumpeter on a rooftop, rays from 11 measured note onsets; a low-angle cutaway (122.86–124.61, cut on backbeats) of the rays raking the skyline and lighting windows; back for the crane up the long note at 124.8. |
| O4 | 126.80–132.03 | The trade as a split screen (checkerboard over each half); the pianist (u 30) climbs a staircase of piano keys, the stood-on key lit; the moon rises in (~128.5) and grows; the top step on the bar-75 downbeat; the camera rises past to the moon: r 260 at (960, 400) held from 131.6. |
| P1 | 132.03–136.84 | The moon tips flat into the ride cymbal (two brush sweeps), back into the moon over the blue city; one window per beat lights with the love inside. |
| P2 | 136.84–140.34 | The singer walks the dark street side-on (u ≈ 38 on screen), each step rippling the wet pavement; a dead lamp stutters on the backbeat; a whip into a black wall. |
| P3 | 140.34–145.59 | Awake in bed: medium, then a push to the untouched cup as the eyes go to it, then a close-up (u ≈ 60) for two tears; it turns away. |
| P3b | 145.59–147.78 | The cold cup from above, rippling blue on every bass note. |
| P4a | 147.78–149.10 | The cup's rim match-cuts to the phone dial; the singer dials. |
| P4b | 149.10–154.35 | The booth (60% of frame height, the teary face through the glass); three blue rings light windows; the love stops, half-turns, and on "disappear" breaks into tiles; the receiver dangles; a checkerboard wipe. |
| TABLE | 154.35–167.50 | One continuous setup: the cold table, the candle out; the singer strikes a match on the box (the opening's match, from outside) and relights it; a push-in to the flame, the face turns hopeful; a spark lifts off (the shot is registered twice, at 154.35 and 161.79). |
| Q2 | 167.50–170.13 | The spark rises past the band (u 20–22); each player lights in its colour with a puff of its sound shape; a pull back to all five lit. |
| Q3 | 170.13–175.84 | The spark flies into the closing door's light; the singer (a large rim-lit foreground figure, u 44) runs, ducks the ribbon, reaches; the ribbon jams the door; the end frame is the agreed seam (door light x 860–1060, y 180–1000, ribbon wedged, the singer reaching at the left). |
| R1 | 175.84–182.84 | Opens on Q3's exact last frame; the door bursts, the singer is thrown back, a cream flash; the band pours into the street playing, all shapes at once. |
| R2 | 182.84–189.85 | The bar-line grid: four panes on bar 105, eight on bar 107, the singer's pane grows over the frame on bar 108. |
| R3 | 189.85–196.85 | Trading as a diagonal split, singer ↔ sax (the split leans to whoever has the phrase), swapping to drums ↔ trumpet on bar 111. |
| R4 | 196.85–202.09 | The panes slide apart onto the street; the ribbon lifts the singer and the camera cranes up through the lit city (tile windows, lamps, a viaduct train on ripples, rays past the moon). |
| R5 | 202.09–205.60 | The break: everything stops in mid-air, the city dims, one ray finds the singer, a slow push-in. |
| S | 205.60–219.72 | After hours under a work light: chairs up, the band packing; a push-in to the table (u ≈ 40, then ≈ 55); the singer takes the gardenia off and lays it beside the other; a small smile at the empty chair on the last word. |
| T | 219.72–230.33 | The club blows apart into wedges (echoing B1); the pieces lock into `cover()` on the hits (rays → disc, ripples → band, shards → wedge, tiles → bars, the band as ink silhouettes, u ≈ 18–20, the singer and candle in the centre); the ribbon wraps the disc on the last chord; freeze. |
| U | 230.33–234.65 | The blocks slide into the flame one after another, the ground darkening to ink; the flame-lit face breathes in and blows; an ember and a smoke thread; pure ink from ~233.3 (frame 0 is black: the loop). |

### Seams between sections (contracts the section builders worked to)
| at (s) | from → to | the frame at the seam |
|---|---|---|
| 11.90 | D → E | a whip pan right with dark speed lines; E starts mid-whip and decelerates onto the singer |
| 76.46 | M → N | fully ink (JZ.ink) |
| 104.14 | N → O | fully flat mustard (JZ.mustard) |
| 132.03 | O → P | a mustard disc (the moon), r 260 at screen (960, 400), on JZ.blueDk |
| 175.84 | Q → R | the club door: ink wall, a cream bar of light at x 860–1060, y 180–1000, the ribbon wedged in it, the singer reaching at the left |
| 234.65 | U → A (loop) | fully ink; A's frame 0 is black too |
