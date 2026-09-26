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
