### Hero

**Purpose.** The first screen states what 6labs does ("Making models of human players."), proves it with the live tile floor behind the copy, and offers one call, Try now. It ships in two variants. `/website` has the rounded container with the numbers, scroll cue and wave under it. `/6labs-fullview` has the floor edge to edge under a clear header, with the numbers in the copy and the cue and wave inside the floor.

**Composition.** Three layers in one box. The floor (TileFloor, WebGL) fills it at z 0. A loading layer sits over the floor until it is ready: FloorLogo in the container, HeroLoader in the full view. The copy layer sits at z 20 and lets the pointer through to the tiles everywhere except its controls, so the floor stays playable under the words. Reading order is headline, lede ending in its link, Try now, then the social proof (container) or the numbers before Try now (full).

**Geometry.**

| Part | Container | Full |
| --- | --- | --- |
| Box | max 1400, 664 tall (720 under md), radius 48 (32) | 100svh, min 640, edge to edge, an ink 8% hairline at the foot |
| Copy layer | px 24, 64 from md, pt 40, 64 from md | max 1448, px 24 (16), pt clears the header plus clamp(48px, 9vh, 120px) |
| Headline | Outfit 34, 56 from md | 34 to 88 over seven steps, Responsive ladder (9.6) |
| Lede | 14, 15 from md, max 440 | 16 to 22, max 470 to 680 |
| Numbers | centred under the box | left, between the lede and Try now |
| Cue and wave | under the box's corners, from md | cue low left from lg, wave bottom right |

**States.** The container shows its copy from the first paint and its mark on the grey until the floor is ready, then the tiles rise and the numbers, cue and wave follow. The full view shows only its loader and holds the page at its top, then lets the copy in, then the floor, then the corners. The timings are in Choreography (4.5). On a phone the floor's view lowers until its highest tile sits just under the copy's last line (`setClearTop`, `CLEAR = -12`), so the tiles never run behind the words.

**Accessibility.** The headline is the page's one h1. The lede's link is a real anchor to the jobs, so a keyboard reaches the second action without a second button. The typed word is in the DOM from the start, so a screen reader reads the whole headline at once. The full view's scroll hold releases after 12s at most, so a visitor without WebGL is never trapped.

**Responsive.** The container changes at md (height, radius, type, the under-row collapsing to the numbers, the wave moving inside the box as a pill). The full view follows its own ladder and adds a short-screen cap. Both are previewed at true widths in the guide.

#### Reasons

- **The claim reads before the proof arrives.** The copy is in from the first paint and the floor comes after, because a visitor on a slow device should know what the page is about before the GPU has finished.
- **The floor is behind the words, not beside them.** Copy over a live field makes the field the evidence for the sentence on top of it. A split layout would make them two things to look at.
- **One call per screen.** The second action is the lede's last words as a link, so Try now is the only solid shape. Two solid buttons would ask for a decision the visitor cannot make yet.
- **The phone clearance moves the floor, not the copy.** Fading tiles under the text would hide the floor exactly where the visitor is looking. Lowering the view keeps every tile whole.

#### Gaps

- No designed WebGL-failure state. The full view gives up after 12s and shows the copy on bare grey, and the container keeps its turning mark forever. The state it should reach is under Loading, empty and failure (9.8).
- Hero.tsx is near the 300-line limit. The social proof, the under-row and the full view's corners should be split out before any further edit.
- The two type ramps and the container look are inline class strings rather than tokens.

#### Do / Don't

- Do keep one typed word in the headline.
- Do end the lede on the second action as a link.
- Don't put a second solid button beside Try now.
- Don't put anything interactive over the floor except the copy layer's own controls.
