### The glass tile floor

**What it is.** The hero's signature: a deterministic three.js render of an endless field of identical frosted glass tiles on a pale grey floor, each carrying a player's bust that turns into their hologram. `TileFloor` (`src/components/tiles/TileFloor.tsx`) mounts the engine (`src/tiles/floor.js`) into its own div on the client and tears it down on unmount. It fills whatever box it is given.

**Parameters.** Every look value lives in `public/tiles/floor-params.json`, which the engine fetches at load and the browser revalidates on every visit (`next.config.ts`), so a new value shows on the next load instead of waiting out a cache. The camera is a long lens (fov 14) at elevation 40 and azimuth 48, distance 13.3 times `distScale`. A narrow field of view keeps the tiles nearly one size from front to back, so the grid reads as a calm pattern rather than a road running away. The grid is one square grid of tile 1.0 and gap 0.018, built on the half-plane `i >= 0`, so the field has a single inner edge: one straight diagonal through the bottom of the screen with empty floor beyond it.

**Material families.** Resting tiles are frosted white glass (`#f4f5f7`, roughness 0.3). Live, they are drawn opaque and colour-matched to the floor rather than with real transmission, because anything see-through makes three.js render the scene once more each frame, a full-resolution 4x multisampled image. Stills use real transmission with TAA, and the two were matched by eye (`opaque-glass.js`). The raised tile is a separate slab per state, as Tile states (5.3) describes. Light comes from a studio environment of soft panels, whose two low strips draw the crisp white rim lines, plus a hemisphere and one key light.

**Output.** An 8-bit sRGB target with 4x MSAA at full device pixel ratio, Neutral tone mapping written into every material, and one final pass that encodes, adds static film grain 0.025 and runs the intro crossfade.

**Motion.** The floor draws only while something moves. Autoplay and the reset wave draw their own frames. It holds when the box leaves the screen or the tab hides. `keepGpuAwake` clears a 1 × 1 target every 500ms while the page is visible, so a dual-GPU Mac never powers its discrete GPU down between frames.

**Responsive.** The design frame is 1920 × 1080. A wider box keeps the camera and shows more floor at the sides. A taller box pulls the camera back along its line of sight, at most 2.4 times. The grid and casts are built for aspects 0.45 to 2.6, and outside that band the field's built edge can come into view. Under 768 wide the pictures are the 512px copies. The full view pulls the camera back 1.5 times from 1024 wide for smaller, more tiles, and the hero lowers the view with `setClearTop` so the highest tile sits under the copy.

**Performance rules.**
- Mount at most one floor in a document. The engine swaps a global three.js shader chunk for its own tone curve (`lean.js:62`), so two floors fight over it, and disposing either breaks the other's later recompiles. A second floor goes in its own iframe.
- Never mount a static floor beside a live one, for the same reason.
- Budget one WebGL context, about 74 picture downloads per cast and GPU memory in the hundreds of MB. Mount it where it is seen and release it when it is far away. The guide does this through HeavySlot's single floor slot.
- No CSS blur, blend, mask or filter over the canvas, under the compositor-safe rule (5.13).

**Props.** `className`, `onReady(handle)` (fires before the intro, the handle has `reset()`, `setClearTop(px)` and `dispose()`), `onConvert()` (once per character converted), `introDelay` (0), `distScale` (1), `mixWaves` (false), `aiBase` (`/tiles-holo`), `spentTint` (`#e3f3ff`). Every prop is read once at mount.

**The wave button.** `WaveButton` calls the handle's `reset()`. Two forms. `full` is a 40 tall white pill at 90% with a hairline, for over the floor and in the full view, because the moving tiles behind a bare icon leave it nowhere to be found. Bare is the icon alone in slate-400, for the page row under the container hero, where the ground is calm. Rest shows the icon only. Hover turns it accent over 200ms and widens the label "Next wave" in. Busy swaps the icon for a 16px spinning ring, with `aria-busy`, until the wave's flip begins, which can wait for the next cast to load. The label stays in the accessibility tree at rest, so the button is named.

**Accessibility.** The wave button has no focus ring of its own, so a keyboard visitor sees only the browser's outline. It needs the system ring. The floor itself has no keyboard path, as Tile states (5.3) sets out.

**Gaps.** No reduced-motion mode anywhere in `src/tiles`: the intro, autoplay and waves always run. No `webglcontextlost` handling, so a lost context leaves a dead canvas. The handle cannot focus, activate, pause autoplay or read state. `floorRough` is read but missing from the params file, so three warns and keeps roughness 1.0. `Hero.tsx:32` describes `mixWaves`, which the hero never passes. The engine listens for R on `window`, so a keystroke in any field on the page resets every character unless the field stops its keydown.

**Do / Don't.**
- Do give the floor a sized box with the container grey behind it, the colour that shows while it boots.
- Do use the pill form of the wave button over the floor.
- Don't mount a second floor in the same document.
- Don't put a CSS effect over the canvas to soften a control. Give the control a solid fill.

**How to change it safely.** Edit `floor-params.json`, then run `tools/tiles/bake-textures.mjs` so the baked textures match. Check the live floor at a wide, a 16:9 and a phone-shaped box, and a static render. Keep any new box between aspects 0.45 and 2.6.
