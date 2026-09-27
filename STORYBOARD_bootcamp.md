# Blueprint to System: storyboard

A course film for the AI Engineer Bootcamp. Clawd is the engineer. It first traces what a real AI agent system
needs (11 layers of real components), then builds that system week by week through the 13-week bootcamp, fixing
the 6 most-overlooked pitfalls on the way, until the whole architecture map is lit and running.

Source material: `Curriculum/lessons/ai-engineer-landscape-talk/docs/AI_AGENT_SYSTEM_COVERAGE.md`
(11 layers × bootcamp coverage, the 6 overlooked points, the 13-week schedule).

## Music

`assets/jingle_extended.mp3`, 85.16 s. It is an extension of `assets/jingle.mp3` ("Jingle!", Suno, instrumental,
40.75 s; downloaded from usesuno.com, a third-party site: confirm the licence before publishing). A security audit
of the original found a clean MPEG-1 Layer III file (SHA-256 `8cd4a1c4…d4c6`).

- Tempo about 151.3 BPM, steady (Suno drift < 1 BPM). Beat = 0.397 s, bar = 1.586 s. First downbeat 0.223 s.
- The extension is spliced on bar lines where the song repeats itself (bar similarity 71–93 %), with 12 ms
  crossfades. Original bars, in order: `0–6 | 3–6 | 7–19 | 12–21 | 14–21 | 14–25`. All five seams measure like
  ordinary downbeats (onset flux 6–15 against a p90 of 15).
- Beat map: generate it at build time with
  `tools/audio/beats.py assets/jingle_extended.mp3 --js src/scenes/bootcamp/beatmap.js` and use `barT(k)`.
- **Breaks:** in bars 19, 22, 27, 30, 35, 38, 43 and 46 the bass drops out for one bar. Each is a breath where
  the picture holds too. Six of them carry the six pitfalls.

| bars | time (s) | music | act |
|---|---|---|---|
| 0–1 | 0.22–3.38 | solo xylophone intro, bell pickup | I · one chat box |
| 2–13 | 3.38–22.36 | verse: toy percussion, bass plucks | I · follow one request, sketch the blueprint |
| 14–15 | 22.36–25.53 | pre-chorus build | II · W1 |
| 16–47 | 25.53–76.30 | four rounds of chorus + call-and-response, breaks at 19, 22, 27, 30, 35, 38, 43, 46 | II · W2–W13 |
| 48–51 | 76.30–82.66 | final chorus, fullest and loudest | III · the lit system runs |
| 52–53 | 82.66–85.16 | glockenspiel tag, resolves | III · sparkle and close |

## Vision

**Logline:** Clawd wants to build a real AI agent system, but one request turns out to need eleven layers of parts
it has never built, so it works through the bootcamp one week at a time until every layer is lit and the same
request runs through the whole system.

**No metaphors.** The pieces on screen are the real components, drawn as an engineer draws them on a whiteboard:
browser window, API gateway, backend server, databases (cylinders), vector store, AI gateway, agent loop, MCP tool server,
trace timeline, guardrail boundary, cloud region. Clawd moves between them and builds them; its movement is the
learning.

**World:** one big blueprint sheet. The whole film happens on it, and the camera travels across it. There are
almost no hard cuts: every "shot" is a camera move to another region of the same map.

- Paper: deep blueprint indigo with a faint grid (a `fill` wash plus `hash()`-placed grid strokes, no gradients).
- **Planned** (not yet built): pale blue pencil, dashed outlines, pencil labels.
- **Built**: cream chalk-ink outlines, flat warm washes (clay, ochre, rose, teal), cream labels, and a `glow()`
  when the part is lit.
- **Colour arc:** cold (all dashed pencil on indigo) → warming week by week as parts light → the final chorus is
  a warm, glowing map on the indigo sheet.
- Clawd (standard clay) is the warmest thing on the sheet from the first frame, so it always reads.

**Honest coverage:** Access & Tenancy (layer 2, drawn as the `API Gateway`) and Cloud & Deploy (layer 10) are covered at their core, not fully.
They are built **half**: half the outline inked and lit, the rest left in pencil. At the very end, a few pencil-only
boxes trail off the edge of the sheet (IaC, multi-region, drift detection): the map after graduation. They get no
labels.

**Text.** The film uses English hand-lettered labels (`letter()`), because the components are real and must be
named. Everything else is still shown, not written.

- Component labels: one or two words, written on as the part is sketched (pencil), re-inked when it is built.
- Revision tags: `W1`…`W13`, stamped beside what each week built.
- Pitfalls: the action shows the problem and the fix; one label names the fix after it lands.
- No captions, sentences, speech bubbles or numbers beyond the revision tags (see open question 1).

**The map (world layout, left → right = request flow):**

```
          ┌──────────────── Guardrails (dashed ring around everything, built W11) ────────────────┐
  User →  Frontend → API Gateway → Backend ─ Agent Loop ─ Context → AI Gateway ─ LLM chips (W12: Router)
                                  │        │  │
                              Memory  Vector DB · SQL      MCP Tools → outside world (web, email, CRM)
                                  │
                           Tracing · Evals (dashboard)
          └──────────────── Cloud · VPC (platform under everything, built half in W12) ──────────────┘
  Claude Code workbench (Dev) sits at the bottom-left corner of the sheet, outside the ring: where the system is built.
```

**Motifs:**
- **The packet**: a small warm dot of light that is one user request. In Act I it rides the dashed wires and
  shows the path. In Act III the same packet runs the finished system and returns as an answer.
- **The chat box**: opens the film (empty, cold) and closes it (the answer arrives, warm). The ending rhymes with the
  opening.
- **Pencil → ink**: every part appears first as a dashed pencil sketch, then is inked and lit when Clawd builds it.
- **The revision tags**: each week stamps a `W#` chalk tag beside what it built, so the finished map shows the whole
  13-week schedule.

**Screen direction:** the request and Clawd always travel left → right. Going back (the answer returning in Act
III) travels right → left on the same wires.

**Clawd's arc:** curious (A) → wide-eyed, then overwhelmed (B, the empty map) → determined, puts on the hard hat
(W1) → focused and busy (W2–W8), with a scared take at each pitfall and a relieved beat when it is fixed →
proud (W11–W13) → starstruck, then happy (the lit system runs) → hopeful, glancing at the pencil boxes beyond the
edge (tag).

**Motion language (dynamic, but hand-made):**
- **Camera as editor:** whip pans along the wires with a smear, pushes into a component to show its inside, and
  pull-outs that reveal the map. Stay in 2D: depth comes only from scale and overlap.
- **On the beat:** the xylophone ostinato is the packet ticking along the wire, one step per eighth note (`pulse2`).
  Parts drop in on downbeats with squash, stretch and settle. Wires are drawn on with `inkLine` in one stroke per beat.
- **Fast actions, held meanings:** each part snaps in quickly, then its label holds for at least ~1 s before the
  camera moves on.
- **Breaks:** in each bass drop-out bar, the camera stops and the picture holds on one clear moment (a pitfall, or
  a first run).

## Shots

Times are video seconds (bar starts from the beat map of the extended song). "Reads" are what the viewer must take
in, in order.

### Act I · What a real AI system needs (0–22.4 s)

**A · one chat box · bars 0–1 · 0.00–3.38** `[in: the indigo sheet fades up from ink; the chat box outline draws itself on the bell pickup]`
- Centre frame: an empty chat box (a browser window with an input bar), dashed pencil. Clawd (u ≈ 26, medium)
  pops up from below the frame edge on the first downbeat, curious, and types. The event: a message bubble (squiggle
  lines, no words) is sent, and it rolls up into the **packet**.
- reads:
  - 0.0–1.2: the chat box on the sheet. Nothing competes with it.
  - 1.2–2.3: Clawd arrives and types (the eye goes to the warm clay shape).
  - 2.3–3.38: the message becomes a glowing packet and leaves right along a wire. Clawd's eyes follow it (lead the
    eye); `lookX` goes to +1.

**B · follow the request · bars 2–11 · 3.38–19.19** `[transition: the camera whips right, following the packet]`
- The camera tracks the packet left → right, one stop per bar. At each stop a dashed pencil box sketches itself on
  the downbeat and its pencil label writes on. Clawd trots after the packet (side view, `walk`), a step behind, and
  peers at each new box. The event of every bar: a new part appears that the request needs.
- Stops, one per bar, in the order a request really flows (so the path always runs left → right): `Frontend`
  (bar 2, the chat window gets its label) · `API Gateway` (3, where requests enter: a barrier the packet waits at until it lifts, and a lock for identity) · `Backend` (4, a
  server box) · `Agent Loop` (5, three arrows inside Backend; the packet laps it once) · `Memory` (6, cylinders under
  Backend: vector DB + SQL; the packet dips in) · `Context` (7, a stack of cards the packet collects) · `AI Gateway` (8, one
  entry in front of two model chips; the chips are labelled `LLM` in W4) · `MCP Tools` (9, plugs to the outside world) · `Tracing` (10, a gantt of the request's
  own journey) · `Evals` (11, a checklist).
- Clawd hops with the packet: they leave each stop on beat 2.6 and land together on the next downbeat, Clawd on the
  component's top edge. Then the box sketches itself and the label writes on.
- reads (each bar): 0–0.45 s the packet and Clawd land and the box sketches in around the packet · 0.25–1.0 s the
  label writes on and holds · 1.0 s on, the packet and Clawd leave together and the camera follows.
- The packet ticks along the wires on eighth notes; Clawd's trot lands on beats.

**C · the empty blueprint · bars 12–13 · 19.19–22.36** `[transition: the camera move carries on and pulls out]`
- The camera pulls out to the whole sheet. On the way the last two pieces sketch in: `Cloud · VPC` (a long
  platform under everything) and `Guardrails` (a dashed ring drawn around the whole system). Bottom-left, a small
  desk: `Claude Code` (the Dev layer). The whole map is dashed pencil, cold, with 11 layers named. Clawd is tiny in the
  full wide, so after the hold the camera pushes back in on it (screen u ≈ 15) for its overwhelmed take (scared,
  sweat).
- reads:
  - 19.19–20.4: the ring and the platform close the map (the eye follows the ring's pen).
  - 20.4–21.4: the whole empty map: "this is everything a real system needs".
  - 21.4–22.36: Clawd's overwhelmed take, then a gulp. Then an idea squint: Clawd turns toward the desk.

### Act II · Build it, week by week (22.4–76.3 s)

Pattern for each week (built as designed in `b_weeks.js`; what is inked when is in `world.js`):
- The camera **whips** to that week's part of the map, with pale smear streaks across the frame.
- Clawd (hard hat, chalk in hand) **drops in from above** and lands on the downbeat.
- A **revision tag** (`W#`, an ochre chalk ring) is stamped beside what the week builds. Tags are a real blueprint
  convention; by the end they show on the map which week built what. (They replace the planned week stones: hopping
  to a stone and then to the part did not fit in a 3.2 s week.)
- Clawd scribbles with the chalk, and the part is inked from pencil to cream, gets a flat wash and lights up (`glow()`).
- Clawd leaps out of the top of the frame about a beat before the next week.

Clawd is medium or close for every build (u 24 world, 19–31 on screen), except the wide in W11.

| week | bars | time | what is built | pitfall / hold |
|---|---|---|---|---|
| W1 | 14–15 | 22.36–25.53 | at the `Claude Code` desk: the hard hat goes on, Clawd types, the desk and laptop ink in, a clipboard (spec and checklist) ticks three items | |
| W2 | 16–17 | 25.53–28.70 | `Frontend` inked; the chat UI's four states pop in on four beats: waiting, success, failure, human review | |
| W3 | 18–19 | 28.70–31.87 | `Backend` and `Context` inked; `API Gateway` built **half** | break 19: the first request runs end to end and back (a tiny MVP) |
| W4 | 20–21 | 31.87–35.05 | `AI Gateway` inked; the model chips are labelled `LLM` | bar 21: two calls and answers, on the call-and-response |
| W5 | 22–23 | 35.05–38.22 | back at the desk | **pitfall 6** (bar 22 → 23) |
| W6 | 24–28 | 38.22–46.15 | `Evals` inked **before** the knowledge base, then `Tracing`; three golden test cards | **pitfall 4** (bar 27 → 28) |
| W7 | 29–30 | 46.15–49.33 | `Memory`: documents fall into the vector store; then the `Agent Loop` is inked | break 30: the loop fetches from Memory and the answer comes back with a citation tag |
| W8 | 31–32 | 49.33–52.50 | `MCP Tools` inked; three plugs click in on three beats | bar 32: the agent calls each outside tool once |
| W9 | 33–36 | 52.50–58.85 | bounds on the loop: a stop sign and a five-step budget; the `Approval` gate | **pitfall 2** (bar 35 → 36) |
| W10 | 37–38 | 58.85–62.02 | `Long-term` memory: a cabinet of drawers; one card is corrected | break 38: another drawer's card is deleted |
| W11 | 39–42 | 62.02–68.37 | checkpoint pins on the loop | **pitfall 3** (crash at bar 39 beat 3 → resume on bar 40); bars 40.6–42: pull out, `Guardrails` inked round the whole map |
| W12 | 43–45 | 68.37–73.13 | a `Router` inside the AI Gateway (big and small model); Clawd leaps to the left end of the platform: `Cloud · VPC` built **half** | **pitfall 5** (bar 44 → 45) |
| W13 | 46–47 | 73.13–76.30 | red-team at `MCP Tools` | **pitfall 1** (bar 46 → 47) |

**The six pitfalls.** Reads: the problem first (Clawd's scared or suspicious take), then the fix snaps in on the
next downbeat, and one warm ochre label names it. The labels stay on the map, so the final wide shows all six. Four
of the six problems fall on the song's bass drop-outs (bars 22, 27, 35, 46).

| # | week · bars | the problem | the fix | label |
|---|---|---|---|---|
| 6 | W5 · 22 → 23 | a red spark crawls from the laptop toward a key (a secret) on the desk | a hook slams down over it; it fizzles out | `Hooks` |
| 4 | W6 · 26.5 → 28 | a change card slides in along the trace axis; one golden test card flips red | the eval gate's arm drops; the change bounces back | `Eval Gate` |
| 2 | W9 · 35 → 36 | the loop shoots out a payment coin | the approval gate's bar holds it until Clawd (the human) presses the button; then it passes | `Approval` |
| 3 | W11 · 39 → 40 | a long task laps the loop; halfway the loop cracks (a red smash frame) and the task dies | it resumes from the last checkpoint it passed, not from the start | `Checkpoint` |
| 5 | W12 · 44 → 45 | a data packet rolls toward the edge of the region | a VPC wall stands up at the edge; the packet bounces back in | `Data Residency` |
| 1 | W13 · 46 → 47 | a hidden red instruction snakes out of a web page toward the tools | a boundary lights up at the tools' door; the instruction turns grey (plain data) and drops away | `Prompt Injection` |

### Act III · The system runs (76.3–85.16 s)

**D · everything lit · bars 48–51 · 76.30–82.66** `[transition: the W13 pull-out carries on to the full sheet]`
- The final chorus. The whole map is inked and glowing warm, except the honest half-pencil parts of `API Gateway` and
  `Cloud · VPC`. A wave of light runs across it, left → right. The camera pushes back in to the chat box, where Clawd drops in and
  sends the same message as in shot A. Wide again: the packet runs the finished route fast (the viewer already knows
  it) and returns right → left as the answer; the camera pushes in as it lands in the chat box with a tick.
- reads:
  - 76.30–77.9: the lit map, wide. Hold it: this is the payoff of Act I's empty map.
  - 77.9–79.5: Clawd sends the message (the eye moves to the chat box).
  - 79.5–81.1: the packet runs the lit route (the eye follows the one moving light).
  - 81.1–82.66: the answer lands with a tick; Clawd is starstruck, then happy.

**E · the tag · bars 52–53 · 82.66–85.16** `[out: an iris closes on Clawd]`
- The glockenspiel flourish: sparkles run along the chat window and its wire (one per eighth note, left → right).
  Pencil boxes sketch in off the left edge of the sheet, fainter as they go. Clawd, in its hard hat, glances at them (hopeful: there is more to
  learn), then back to camera. An iris closes on Clawd on the last note and holds a beat on the indigo sheet.
- reads: 82.66–83.6 the sparkle run · 83.6–84.4 the glance at the pencil boxes · 84.4–85.16 the iris closes and holds.

`[transition out: the iris shuts to the indigo sheet on the final glockenspiel note]`

## Checks against the guide

- An event in every shot: A sends, B reveals one part per bar, C overwhelms, every week builds, every pitfall
  breaks and gets fixed, D runs, E closes.
- Reads: one per ~1–1.6 s in Act I (labels persist and are re-read on the pull-out); one build per week; pitfalls
  each get their own break bar. **Act I is the tightest part**: verify it with fixed-step sheets first.
- Transitions: the fade and draw-on in, then camera moves (whips, pushes, pull-outs, a match cut) between regions,
  and the iris out. No plain cuts, except the crack in pitfall 3, which is a deliberate smash cut.
- Text: only component labels, revision tags and pitfall fix labels, all hand-lettered. No sentences.
- Rhyme: the chat box and the same message open and close the film. The empty map in C is paid off by the lit map in D.

## Open questions

1. Should the end tag also show the key numbers (for example `11 layers · 13 weeks · 1 system`) as one hand-lettered
   line? It is currently left out, because the lit map carries the message.
2. Should the course project (CareKind, aged-care compliance) be named anywhere? It is currently left unnamed.
