### Activation sweep

**What it is.** The step from focused to activated: a light beam runs round the slab's top rim from the corner nearest the camera, the brighter activated slab sweeps in behind it from front to back, the shadows and floor turn blue, and the human crossfades to the hologram. It was matched frame by frame to a 30 fps reference recording (`src/tiles/sweep.js`), which is why its times are oddly exact.

**The rim coordinate.** `u = (x + z) / tile` runs along the rim: +0.92 at the front (camera) corner, 0 at both side corners, -0.92 at the rear. Every part of the sweep is a function of where its head is on `u`, so the beam, the bright slab and the spill share one geometry.

**Parameters.** All times are sweep time S. Wall-clock time is S / 1.69.

| From S | To S | What happens |
| --- | --- | --- |
| 0 | 0.08 | the activated slab fades in over the focused one |
| 0 | | the beam appears at the front corner, with a white-hot spot `#d9efff` x2.2 |
| 0.17 | | the beam reaches the middle of both front edges |
| 0.30 | 0.80 | the beam reaches both side corners, then runs faint along the back edges (0.55) |
| 0.30 | 0.45 | the right corner flares, `#d9efff` x3.4 |
| 0.10 | 0.90 | the bright head sweeps front to back (soft edge 0.55), and `amount` turns the shadows, floor glow and point light blue |
| 0 | 0.75 | the blue spill and halo spread out from under the front corner |
| 0.25 | 0.85 | the human crossfades to the hologram |
| 0.90 | | `ACT_SECONDS` reached, the tile is spent |

The beam colour is `#8cc8ff` at 2.4. The beam head follows `0.95 - (S / 0.3) * 0.95` to the side corners, then `-((S - 0.3) / 0.5) * 1.1` along the back.

**The glint.** A painted highlight near the rear corner, shaped like a loaf: top arch 0.6 (exponent 0.55), bottom bulge 0.52 (exponent 0.3), droop 0.1, turned 45 degrees, about 12% of the tile across, blurred 20 texture px. Focused, it is a cool grey `#dcdde2` with a pale edge and a dark navy ring `#0e2152`, plus faint warm specks. Activated, it is near white `#eef3fa` with a white edge, a blue ring `#123a86` and a cyan halo `#96d4ff`, and a chromatic split fringes its right end red and its left end blue. As it activates it widens 22% along its length. Two glint meshes, one per state, crossfade by `amount`.

**Motion.** Starting the light at the camera corner puts the brightest moment nearest the eye, then carries it away into the floor. Deactivation is not a reverse sweep: everything fades together over `DEACT_SECONDS` 1.05, so the end of a turn is quieter than its start and never reads as a second activation. `COMMIT_SECONDS` 0.25 is the point where conversion has started, under the commit rule in Tile states (5.3).

**Performance rules.** The frost, the raised slab's gradient and the glint are procedural textures, baked ahead of time into `public/tiles/baked/` by `tools/tiles/bake-textures.mjs`. Each baked picture records every setting it read, and is used only while they all still match. The frost's settings include the rear corner's shade (`frostCorner`, `frostCornerR`), so a change to either is one the bake must follow. After any params edit that touches them, the page paints them again at load on its main thread, about 1.4s of the first load on a 2019 MacBook Pro, until the bake is run again. The animation itself (beam, sweep, glint move, spill) is drawn by the shaders over the baked pictures, so it costs no texture work per frame.

**How to change it safely.** Change a time in `sweepValues` only against the reference recording, and change the tempo through `animSpeed`, never by scaling one lane. Keep the beam, the bright head and the spill on the same `u`, or the light separates from the slab it lights. Re-bake after any glint or gradient edit, then click a tile on the live floor at full speed.
