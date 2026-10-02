### Glyph field

**What it is.** One 2D canvas of monospace glyphs on a 15px grid, ported from the onBlue creators page (`ascii-field.js`). At rest only about one cell in twenty draws, faint and in navy, so the field reads as texture and never as text. Under the pointer a pool brightens the cells, rolls their glyphs and warms their ink toward the accent, with a thin red and cyan fringe at its rim. Two hosts run it: the page backdrop (`AsciiBackdrop`, fixed behind every section at z -10) and each idle jobs terminal (`JobTerminal`).

**Why it is drawn this way.** A canvas cannot blend with the page, so the field is told its two inks (`--ascii-a` at rest, `--ascii-b` in the pool) and mixes between them by the pool's strength. It reads them off its host, not the root, so a host with its own palette (the dark terminal) gets glyphs in its own colours from the same code. Each glyph is stamped from an atlas drawn once per colour, because a `fillText` per glyph per frame was where Safari spent its time.

**Parameters.**

| Parameter | Page | Terminal | Default in `ascii-field.js` |
| --- | --- | --- | --- |
| `reach` | 120 | 420 | 190 |
| `lens` | 0.24 | 0.5 | 0.42 |
| `pointer` | hover devices only | false | true |
| `pool` | none | held at 0.5, 0.6 | none |
| `--ascii-a` | 10, 27, 51 | 148, 163, 184 | |
| `--ascii-b` | 26, 109, 255 | 110, 168, 255 | |
| `--ascii` (canvas opacity) | 0.4 | 0.5 | 0.4 |

Cell 15, glyphs 11px ui-monospace on the ramp `' .,:;i1tfLCG08@'`, ambient 0.075 on cells whose seed passes 0.948, fringe on. The page runs a smaller, softer pool than onBlue's defaults, so it stays a texture under the content rather than a spotlight on it. The terminal holds a wide pool in place with no pointer, which makes a waiting window a bed of glyphs brightest at its middle.

**Motion.** At rest the sparse cells breathe on a sine of about 5.7s and each glyph walks the ramp about every 8.3s. The canvas repaints at most every 68ms (about 14.7 fps), the pace a glyph readout needs and a quarter of a display's frames. The throttle lifts only while a sweep band runs, and the site never calls the sweep. Under reduced motion the breath and the roll stop and the pool still answers the pointer, because a pool that follows the cursor is a response to the visitor rather than an animation.

**When it hides.** Off screen an IntersectionObserver parks its loop. AsciiBackdrop also hides it past the foot of `#model-line`, where the water and then the grained block cover the ground, and while a `[data-covers-view]` part (the full-view hero) fills the screen. It hides by visibility, so the canvas keeps its size and its seed, and scrolling back into the line does not rebuild a viewport-sized canvas mid-scroll. Touch screens get the ambient field without the pool. `?off=ascii` removes it.

**Performance rules.** One canvas per host, its pixel ratio capped at 2. A covered field still costs a repaint every 68ms, so hide it with visibility wherever something covers it and call `wake()` when it is back. Never tint the canvas with a CSS blend or filter: change `--ascii-a` and `--ascii-b` on the host.

**How to change it safely.** There is no teardown. Its ResizeObserver, IntersectionObserver and pointer listeners outlive the host, so mount it once per host and guard on `host.firstChild`, as AsciiBackdrop and JobTerminal do, or React's second effect run in development puts a second canvas in. A new host needs a position and a height. Change the page's numbers in AsciiBackdrop's call, not in `ascii-field.js`, whose defaults are onBlue's and still give the terminal its cell and ambient. Only the fringe colours are tokens today (`color-fringe-red-ascii`, `color-fringe-cyan-ascii`). Cell, reach, lens and ambient are numbers in code.
