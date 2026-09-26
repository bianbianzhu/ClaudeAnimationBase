# Echoes of Myself (Out of Sync): storyboard

Music: `assets/echoes.mp3` ("Echoes of Myself -Out of Sync-", Suno, vocal), 272.83 s. Funk with koto picking.
Tempo 122 BPM (Suno drifts about ±0.05 s around the grid), first downbeat 0.27 s. Beat = 0.4918 s, bar = 1.9672 s.
Bar k starts at `0.27 + 1.9672 k`. Sung lines start on 4-bar boundaries (often with a pickup a beat early).

| bars | time | music | lyric | shot |
|---|---|---|---|---|
| 0–6 | 0.27–12.07 | soft koto intro | | A · the line |
| 6–16 | 12.07–31.75 | groove enters | | B · the city of smiles |
| 16–20 | 31.75–39.61 | verse 1, sparse | Whose face is staring back inside the glass? | C · the glass |
| 20–24 | 39.61–47.48 | verse 1 | What lies hidden deep behind these eyes? | D · behind the eyes |
| 24–32 | 47.48–63.22 | verse 1 | The smile I wear conceals a secret truth / A little lie that I can't tell to anyone | E · puddles |
| 32–40 | 63.22–78.96 | chorus 1 | Am I the person I'm supposed to be? / A voice keeps echoing into the night | F · the mirror line |
| 40–48 | 78.96–94.70 | chorus 1 | Somewhere the answer is waiting for me / A world exists that I am longing to find | G · the door on the line |
| 48–56 | 94.70–110.43 | interlude (koto) | | H · the paper screens |
| 56–64 | 110.43–126.17 | verse 2 | Through the parting clouds a ray of light shines / Guiding me along just like a sign | I · the ray |
| 64–72 | 126.17–141.91 | verse 2 | But shadows flicker, swaying at my feet / The path ahead of me is still unclear | J · shadows and fog |
| 72–80 | 141.91–157.65 | chorus 2 | Am I the person I'm supposed to be? / A voice inside my heart is crying out | K · the lake |
| 80–88 | 157.65–173.38 | chorus 2 | Somewhere the answer is waiting for me / A world exists that I am longing to find | L · the crack |
| 88–96 | 173.38–189.12 | bridge, quiet then building | I'll send these feelings riding on the wind / From deep inside my chest, I'll let them fly | M · the wind |
| 96–104 | 189.12–204.86 | bridge peak, long held note | When dream and reality finally meet / Will I discover who I truly am? | N · the shatter |
| 104–112 | 204.86–220.60 | instrumental | | O · in sync |
| 112–120 | 220.60–236.34 | chorus 3 | Am I the person I'm supposed to be? / A voice keeps echoing into the night | P · the city at dawn |
| 120–128 | 236.34–252.07 | chorus 3 | Somewhere the answer is waiting for me / A world exists that I am longing to find | Q · the shore |
| 128–end | 252.07–272.83 | outro, fade from 267.8 | | R · the line again |

**Logline:** Clawd hides behind a painted smile like everyone else in a rainy city, but its reflection won't keep
the lie: it lags, lifts its mask and calls out from the other side of every surface. So Clawd follows it toward a
light where the two worlds meet, lets the mask go, shatters the line between them, and walks on as one, in sync.

**Cast:**
- **Clawd**: the standard clay Clawd. For most of the film it wears the **smile mask**: a cream paper plate over the
  face with painted closed "happy" eye-arcs, rose cheeks and a wide ink smile. The mask is drawn with the `draw()` hook,
  sized to the face in each view (front, q, side).
- **Echo**: Clawd's reflection. Same body, painted in the inner-world colours: indigo body, violet shading, cream rim,
  eyes that shine. Always unmasked. It lives upside-down under the line (mirrored with `scale(1, -1)` about the
  line). It is **out of sync**: it copies Clawd half a beat to a beat late, and sometimes acts on its own.
- **The ember**: a small warm light in Clawd's chest (the secret, the true self). Drawn with `glow()` plus a small
  painted flame. It beats on the beat like a heart.
- **The masked crowd**: Clawd-kin in grey-blue, slate and mauve (desaturated tints), under umbrellas, all wearing the
  same smile mask, walking right → left against Clawd. Sizes and seeds vary; nobody moves in unison.

**World and colour arc:** black → rainy night city (indigo, slate, warm amber lamps, rose shop light) → the inner world
(deep violet, cream stars, teal) → warm lamplit paper screens → gold dusk field after rain → grey fog → silver
moonlit lake → lavender pre-dawn hill → the merge (violet and gold bleeding together) → rose-gold dawn city → sunrise
gold shore → a gold line on black.

**Screen direction:** Clawd always travels left → right. The crowd walks right → left. Echo mirrors Clawd under
the line, so it also travels right.

**Motifs:**
- **The line**: a horizontal line through the frame that splits reality (above) from reflection / inner world
  (below). It opens the film (a line of light on black), becomes the wet street, the lake surface, is shattered at
  the bridge peak, becomes the true horizon at sunrise, and closes the film.
- **The mask**: put on in B, lifted by the reflection in C, cracks in L, given to the wind in M; the crowd drops
  theirs in P.
- **The ember**: seen in the inner world in D, hidden in E, held openly by Echo in F, released as a flock of light
  in M, glowing in the merged Clawd from N on.
- **The door of light**: a tall painted doorway standing on the line, half above, half below. Far away in G, closer
  in L, reached in O. In Q it is the sun rising at the same spot.
- **Sync**: Echo lags in A, C, F, K. From O on, the reflection moves exactly with Clawd. The final button: Echo winks
  on its own once, a friendly echo.

**Clawd's arc:** neutral, lonely → nervous (the crowd) → masked (fake calm) → surprised, confused (the glass) → sad
(the puddle truth) → longing (chorus 1) → uneasy (the screens) → hopeful (the ray) → scared (the shadows) → lost
(the fog) → crying out (the lake) → determined (the crack) → relieved and brave (the wind) → wonder (the merge) → joy
(in sync) → love (the sunrise) → peace.

**Transitions (every seam different, all tied to the story):** line opens like an eyelid · ripple becomes umbrella ·
camera slides onto a window frame · push through the pupil · pull out on action to the mask's eye-slit · camera dives
through the water surface · rings sweep the frame · a paper screen slides across · screens blow open · beam narrows
to the feet · fog settles into a mirror · a gust of petals · the flock becomes the line · shards become stepping
stones · through the door of light · pan with the song rings · eyelid closes to a line.

**No text anywhere.** Singing and calling are painted rings and mouth shapes, never words.

## Shots

Times in video seconds. Readable shots stay long; the viewer's eye is noted where it matters.

**A · 0–12.07 · the line** [in: from black, a line of light draws across]
- Seen: black. A thin gold line draws across the middle, one short brush stroke per koto pick. It opens top and
  bottom like an eyelid: above, a rainy night street; below, the same street upside-down on wet ground.
- EVENT: Clawd walks in from the left; Echo walks in below, feet to feet. A raindrop hits the line between them:
  Echo misses a step, half a beat late. Clawd doesn't notice. The viewer does.

| time | read |
|---|---|
| 0–2.7 | Black. The gold line grows left → right in picks. |
| 2.7–5.2 | The line opens vertically: street above, reflection below. Rain, lamps. |
| 5.2–8.6 | Clawd walks in from the left (u ≈ 18), Echo below, in step. Camera drifts right. |
| 8.6–10.3 | A raindrop falls onto the line in front of them: a ripple. |
| 10.3–12.07 | Echo stumbles a half beat late and hurries to catch up. Camera pushes in on the ripple. |

**B · 12.07–31.75 · the city of smiles** [in: the ripple rings become the top of an umbrella, on the downbeat]
- Seen: tracking medium shot (u ≈ 24) along a rainy street: lamps, dark shopfronts with warm glows, rain streaks.
  Umbrella passersby walk the other way, all with the same smile mask.
- EVENT: a passerby's mask slips: a tired face underneath, fixed in a hurry. Clawd sees it, gets nervous, and puts
  on its own smile mask on the downbeat of bar 14.

| time | read |
|---|---|
| 12.07–15.9 | Clawd walks right through rain, on the beat, alone. Lamps pass. |
| 15.9–19.9 | The crowd arrives from the right: umbrellas, identical smiles. Clawd looks at them. |
| 19.9–23.9 | One passerby's mask slips: tired eyes, a frown. It shoves the mask back. Clawd: surprised take. |
| 23.9–27.8 | Clawd nervous (sweat), looks side to side, pulls a mask from behind its back. |
| 27.8–29.8 | On the downbeat it puts the mask on. The body goes stiff, then bobs in step with the crowd. |
| 29.8–31.75 | Camera slides right onto a big shop window. |

**C · 31.75–39.61 · the glass** [in: the camera move carries onto the window frame]
- Seen: side-on, a tall dark shop window with a faint warm interior. Clawd's reflection walks in the glass.
- EVENT: Clawd stops; the reflection stops a beat late. Clawd turns to the glass; the reflection turns late too. Then
  the reflection lifts its mask by itself: the true face stares back. Clawd grabs at its own mask: still on.

| time | read |
|---|---|
| 31.75–33.7 | Clawd walks past the window; the reflection walks along in the glass. |
| 33.7–35.7 | Clawd stops. The reflection takes one more step, then stops. |
| 35.7–37.6 | Clawd turns to face the glass; the reflection turns a beat later. Clawd: suspicious. |
| 37.6–39.61 | The reflection lifts its mask up onto its forehead: sad, searching eyes. Clawd: big take, touches its own mask. |

**D · 39.61–47.48 · behind the eyes** [in: push into the reflection's eye; the pupil opens into the inner world]
- Seen: extreme close-up of the reflection's eye, then through the pupil: a deep violet void with slowly floating
  paper cut-outs (a small house, a moon, a closed door, a little Clawd), and at the centre, the ember, beating.
- EVENT: the ember flickers; a cream mask-white shape slides over it and dims it. Hard pull back out.

| time | read |
|---|---|
| 39.61–41.6 | Push into the reflection's eye; lamp highlights in it. |
| 41.6–44.5 | Through the pupil: the inner world, the floating cut-outs, the ember beating on the beat. |
| 44.5–46.6 | The mask-white shape closes over the ember like a lid. The world dims. |
| 46.6–47.48 | Fast pull back out along the same path. |

**E · 47.48–63.22 · puddles** [in: pull-out cut on action lands on the eye-slit of Clawd's mask]
- Seen: the street as a split frame: upper 55% the street with the masked crowd; lower 45% the wet pavement where
  everything reflects upside-down.
- EVENT: above, masked Clawd walks in the crowd. Below, Echo walks unmasked and crying. A passerby greets Clawd;
  Clawd nods and hides the ember glowing through its chest. At the end Clawd looks down and sees Echo looking up.

| time | read |
|---|---|
| 47.48–51.4 | Camera pulls from the mask to the split frame: masked Clawd walking in the crowd. |
| 51.4–55.35 | Camera tilts down: Echo, unmasked, teary, walking under the line. A tear drops "up" onto the line: ripple. |
| 55.35–58.3 | A passerby stops and looks at Clawd. Clawd nods; the ember glows through its chest; Clawd presses an arm over it. |
| 58.3–61.2 | The passerby moves on. Below, Echo holds the ember openly, glowing. Rain heavier. |
| 61.2–63.22 | Clawd looks down into the puddle for the first time. Echo looks up. Hold. |

**F · 63.22–78.96 · the mirror line** [in: the camera dives down through the water surface, a splash wipe]
- Seen: a symmetrical frame, the line exactly through the middle. Above: masked Clawd, night city silhouettes, lamps.
  Below: Echo in the inner world (violet, stars, floating shapes), upside-down. Camera tracks right with parallax.
- EVENT: Clawd stops; Echo keeps walking two steps, turns and looks up. Echo calls out: rings spread across the line
  and echo off the city.

| time | read |
|---|---|
| 63.22–66.2 | Both walk right, mirrored. Clean and wide. |
| 66.2–68.2 | Clawd stops. Echo walks on two steps (out of sync). |
| 68.2–71.09 | Echo turns back and looks up at Clawd. Clawd looks down: confused `?`. |
| 71.09–74.0 | Echo calls out: painted rings grow from its mouth and cross the line, rippling it. |
| 74.0–78.96 | The rings bounce between the buildings above, windows lighting in rings. Clawd clutches its mask. |

**G · 78.96–94.70 · the door on the line** [in: the camera pans right with the last ring]
- Seen: the same mirrored world, wider. Far right, a door of light stands on the line, half above, half below.
- EVENT: the door appears; Echo points; they walk toward it in perfect sync for the first time, but it stays far.

| time | read |
|---|---|
| 78.96–82.9 | A light appears far right on the line and opens into a tall doorway (glow). |
| 82.9–86.83 | Both look at it. Echo points. Clawd: hopeful. |
| 86.83–92.8 | They walk toward it, now in sync. Camera pulls wide: the door is far away. |
| 92.8–94.70 | The door dims; a ring from it sweeps across the frame into the next shot. |

**H · 94.70–110.43 · the paper screens** [in: a paper screen slides across the frame]
- Seen: a long covered walkway lined with lamplit paper screens (grid frames, warm light behind). Clawd walks right
  in front of them, masked, and its shadow falls on each screen.
- EVENT: on each screen the shadow is a different self: a horned monster, a tiny cowering one, a crowned one, a
  crying one. The last shadow is Clawd's true shape with the ember, walking the wrong way. A gust blows the screens open.

| time | read |
|---|---|
| 94.70–98.6 | Clawd walks along the screens; its shadow on the paper matches. |
| 98.6–102.6 | Screen by screen (one per bar): horned shadow, tiny shadow. Clawd glances, walks faster. |
| 102.6–106.5 | Crowned shadow, crying shadow. Clawd nervous. |
| 106.5–108.5 | The last shadow: true shape, ember glowing, walking left. Clawd stops. |
| 108.5–110.43 | A gust: the screens blow open outward to daylight. |

**I · 110.43–126.17 · the ray** [in: the screens blow open onto the field]
- Seen: an open field after rain at gold dusk, big clouds. Clawd walks right along a path.
- EVENT: the clouds part and a ray lands in front of Clawd. Clawd lifts the mask up onto its forehead to look. The
  ray slides ahead; stepping stones light one per beat, and a small bird of light leads the way.

| time | read |
|---|---|
| 110.43–114.4 | Wide field, heavy clouds. Clawd walks right, masked. |
| 114.4–118.3 | The clouds slide apart; a ray lands in front of Clawd. Clawd stops, looks up. |
| 118.3–120.3 | Clawd pushes the mask up onto its forehead: hopeful eyes in the light. |
| 120.3–126.17 | The ray slides right; stones light on the beats; a light bird flutters in it. Clawd follows, trotting. |

**J · 126.17–141.91 · shadows and fog** [in: the ray narrows onto Clawd's feet]
- Seen: the same field later, low sun, long shadows.
- EVENT: Clawd's shadow peels off the ground, splits into three swaying shadows and wraps its feet. Clawd shakes
  them off. Fog rolls in, the path forks, the ray is gone. Clawd pulls the mask back down.

| time | read |
|---|---|
| 126.17–130.1 | Clawd's shadow stretches and sways on its own. Clawd notices. |
| 130.1–134.04 | The shadow splits into three, flickering, wrapping the feet. Clawd stumbles, scared, shakes loose. |
| 134.04–138.0 | Fog rolls in from the right. The ray fades. The path forks three ways. |
| 138.0–141.91 | Clawd looks left, right, up: lost. Pulls the mask back down. The fog settles flat into a mirror. |

**K · 141.91–157.65 · the lake** [in: the fog settles into the lake's mirror surface]
- Seen: a moonlit lake. Clawd walks on the waterline; Echo walks beneath, feet to feet. Moon above and below.
- EVENT: the camera rolls 180° (a flat 2D roll) so Echo is on top; both stop and stare; the camera rolls back. Echo
  pounds on the surface from below, crying out. Clawd kneels; their arms meet at the surface, and it glows.

| time | read |
|---|---|
| 141.91–145.8 | Clawd walks across the lake; Echo below. Wide, silver. |
| 145.8–149.78 | The camera rolls 180°: Echo above, Clawd below. They stop and look at each other. Roll back. |
| 149.78–153.7 | Echo pounds the surface on the beats, rings on each hit, mouth wide. |
| 153.7–157.65 | Clawd kneels and reaches down; Echo reaches up; they touch at the line: a glow. |

**L · 157.65–173.38 · the crack** [in: the glow flares and the camera pulls back]
- Seen: the lake, wider; at the far end, the door of light on the line, much closer now.
- EVENT: the door appears again, close. Both walk to it. On a downbeat the mask cracks across the smile. Clawd touches
  the crack; the wind rises.

| time | read |
|---|---|
| 157.65–161.6 | The door lights up at the far end, closer. Both look. |
| 161.6–165.52 | They walk toward it, in step. |
| 165.52–169.45 | On the downbeat the mask cracks. Clawd stops, touches it. |
| 169.45–173.38 | Wind: ripples race, petals blow in from the left and fill the frame. |

**M · 173.38–189.12 · the wind** [in: the gust of petals wipes the frame]
- Seen: a hilltop over the lake before dawn, lavender sky, tall grass bending, wind streaks.
- EVENT: at the crest Clawd takes off the cracked mask and lets the wind take it; the mask tumbles away. Then Clawd
  opens its arms and the ember rises out of its chest and bursts into a flock of little birds of light.

| time | read |
|---|---|
| 173.38–177.3 | Clawd climbs right to the crest, masked, into the wind. |
| 177.3–181.25 | Clawd takes the mask off, looks at it, and opens its arm: the wind takes it away, tumbling. The true face: relieved. |
| 181.25–185.2 | Clawd opens both arms; the ember rises from its chest, glowing. |
| 185.2–189.12 | It bursts into a flock of birds of light that spiral up and right on the wind. |

**N · 189.12–204.86 · the shatter** [in: the flock streams into one horizontal line of light, rhyming the opening]
- Seen: abstract. The line across the middle; above Clawd (real hill colours), below Echo (inner violet), facing.
- EVENT: they both reach; the line bends, cracks and shatters into shards on the pickup of "Will I discover". The two
  worlds' colours pour into each other. Clawd and Echo meet in the middle, spin once around each other and merge into
  one Clawd, with a flash of light. The new Clawd opens its eyes and smiles.

| time | read |
|---|---|
| 189.12–191.1 | The line; Clawd above, Echo below, both reach toward it. |
| 191.1–193.06 | The line bends under their arms; cracks race left and right. |
| 193.06–195.5 | It shatters: shards fly out on arcs. The backgrounds bleed together. |
| 195.5–198.5 | Clawd and Echo float toward each other and spin once around each other (drawn key views). |
| 198.5–200.5 | They merge: a flash of light. |
| 200.5–204.86 | The merged Clawd: clay body with violet shading and a cream rim, the ember glowing in its chest. Eyes open, first real smile. Slow push in; shards orbit like stars. |

**O · 204.86–220.60 · in sync** [in: the shards become stepping stones as the camera pulls back]
- Seen: a dreamlike landscape where both worlds are woven together: city silhouettes with inner-world stars,
  floating shards over a lake.
- EVENT: Clawd hops right from shard to shard, on the beats. Its reflection in the water moves exactly with it, and
  the three shadows from J now dance along in step. The door of light appears; Clawd walks through it.

| time | read |
|---|---|
| 204.86–208.8 | Clawd hops from stone to stone; the reflection below is exactly in sync. |
| 208.8–212.7 | The three shadows join, dancing in step on the water. |
| 212.7–216.7 | The door of light rises ahead on the line. |
| 216.7–220.60 | Clawd walks into it; light floods the frame. |

**P · 220.60–236.34 · the city at dawn** [in: out of the door's light onto the street]
- Seen: the street from B at dawn: rain stopped, gold puddles, the masked crowd walking left.
- EVENT: Clawd passes the same shop window, unmasked; its reflection moves exactly with it and smiles when it
  smiles. Clawd sings (rings and notes); the rings reach the crowd, and one by one they lower their masks.

| time | read |
|---|---|
| 220.60–224.5 | Dawn street. Clawd walks right, unmasked, among the masked crowd. |
| 224.5–228.47 | The shop window: the reflection stops, turns and smiles in perfect sync. |
| 228.47–232.4 | Clawd sings: rings and notes float out. A small passerby lowers its mask and smiles. |
| 232.4–236.34 | Then another, and another, on the beats; masks fall like leaves. |

**Q · 236.34–252.07 · the shore** [in: the camera pans right with the song rings]
- Seen: the waterfront at the end of the street; the sea's horizon is the line.
- EVENT: the sun rises exactly where the door of light stood, its reflection below. Clawd and a few unmasked
  friends watch it; Clawd turns to camera.

| time | read |
|---|---|
| 236.34–240.3 | Clawd and a few unmasked passersby reach the shore. The horizon glows. |
| 240.3–244.2 | The sun rises on the line; its reflection rises below. |
| 244.2–248.1 | Everyone watches. Clawd: love, eyes shining. |
| 248.1–252.07 | Clawd turns to camera and smiles. Light floods. |

**R · 252.07–272.83 · the line again** [out: the frame closes like an eyelid back to a gold line on black]
- Seen: wide silhouette along the shore; Clawd walks right along the waterline, the reflection below in sync.
- EVENT: the frame closes back to a line; just before it shuts, the reflection winks on its own.

| time | read |
|---|---|
| 252.07–259.9 | Wide: Clawd walks right along the shore, reflection in sync, the sun above the line. |
| 259.9–264.5 | Camera pulls wider; the frame starts to close top and bottom. |
| 264.5–266.5 | Just before it shuts, the reflection winks, alone. |
| 266.5–269.5 | It closes to a thin gold line on black. |
| 269.5–272.83 | The line fades out with the last note. |

## Checks

- An event in every shot: yes (see EVENT lines).
- Reads: each at least ~1.9 s (one bar); key reveals (C's lifted mask, N's merge) get 2–4 s holds.
- A transition at every seam: listed on each shot.
- No text: none; singing and calling are rings and notes.
- The ending rhymes with the opening: the gold line on black, the reflection now in sync, with one friendly wink.
