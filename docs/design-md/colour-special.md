### Special palettes

Some colours belong to one context: the accent water, the jobs terminal, the holograms and their glow, the chromatic fringe, the floor scene and the logo. Each set lives apart from the UI roles of Colour roles (2.1), under its own token names, so a part outside the context cannot pick one up by accident. The rule for all of them is the same. A contextual colour styles its context and nothing else.

#### Values

Every token of these palettes, with its role, use, misuse and source, is in chapter 3: On blue (3.10), Terminal (3.11), Hologram and glow (3.12), Chromatic fringe (3.13) and Brand mark (3.14). The floor scene has no tokens: its fog, floor, environment, top, hemisphere and glow colours and the two tile-state ramps are read from `public/tiles/floor-params.json`, the file the floor itself reads.

#### Use for

- **On blue:** text, tracks, rings and glass on the accent water of the players section, and quiet white on navy (a toast's close, a tooltip's shortcut). Body takes 80%, trait labels 75%, quiet controls 50% (on navy, and on blue for the read-only switch and paused progress), the rest dot and the glass lines 40%, rings 25%, tracks 20% and glass fills 15%.
- **Terminal:** the jobs terminal window only. Its default text is the quiet text role, and the run's one answer is the lifted accent.
- **Hologram and glow:** the AI doodles, the Human / AI laser, the primary button's dot band and the glyph field's sweep, all drawn in canvas or WebGL.
- **Fringe:** the footer wordmark's chromatic split and the glyph pool's colour fringe.
- **Floor scene:** the tile floor's lighting and materials, read by `src/tiles/floor.js`, `materials.js`, `halo.js` and `floor-material.js`.
- **Brand mark:** the 6labs logo as its file draws it, and nothing else.

#### Never for

- On-blue whites never sit on a light ground, where they vanish.
- The terminal palette never styles UI outside the window, and its window dots never stand for status, which takes the status tier.
- The lifted accent `#6ea8ff` never sits on a light ground, where it is 2.41:1 on white.
- Glow, fringe and floor colours never colour text, a control or a line.
- The logo's blue and navy never stand in for the accent or ink, and the accent never recolours the logo.

#### Reasons

**Kept apart by name.** The lifted accent alone is written four ways today (`#6ea8ff`, `#7fb2ff`, `rgba(120,175,255,0.95)`, `#9cc0ff`), each tuned to its effect. Folding them into the UI accent would retune every effect, and leaving them unnamed lets them leak into UI. Each gets one token in its own palette.

**The blue needs its own ladder.** The water under the players moves, so its whites are fixed alphas of one colour rather than tints of the blue, and each strength has one job. Their contrast is in Contrast (2.3).

**The terminal lifts the accent.** `#1a6dff` on `#0b1526` is 4.06:1. `#6ea8ff` reaches 7.57:1, which lets one highlighted value carry the result of a run. The window's traffic-light dots are the operating system's colours, kept because a terminal without them stops reading as one.

**Light is the material.** Glows and fringes carry the brand's look of glass and light, so they are drawn on canvas or in WebGL under the compositor-safe rule (5.13), never in CSS.

**The floor palette is read live.** The guide fetches `floor-params.json` with no cache on every load, so a params edit shows in the guide the moment it lands. That is deliberate. The palette's truth is the file the floor reads, not a copy.

**The spent tint has three values.** `TileFloor.tsx` passes `#e3f3ff` as its default prop, `floor-params.json` says `#e3e5e8`, and `floor.js` falls back to `#b8bbc1`. The prop is always passed, and `floor.js` merges it over the params file, so `#e3f3ff` is the one on screen, for the reason in Tile states (5.3). To change the tint safely, change the prop default or pass the prop, and bring the params value in line so the next reader is not misled.

**The logo keeps its own fills.** `#1770EF` sits 1.01:1 from the accent and `#030D2D` sits 1.10:1 from ink. Beside a UI part they read as a mistake, so UI parts take the accent and ink, and the line mark drawn as an icon takes ink.
