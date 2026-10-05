### Tile states

**What it is.** Every tile on the floor is in one of five states: default, focused, activated, spent or resetting. The pointer drives default, focused and activated. The floor's own clock moves an activated tile to spent, and autoplay's wave, `reset()` or the R key bring tiles back. The logic is `src/tiles/interact.js`, the looks are `focus-rig.js`, `materials.js`, `textures.js` and `opaque-glass.js`.

**A naming trap.** In `floor-params.json` the focused look is `states.default` and the activated look is `states.shine`. "default" there is the default raised look, not the resting tile.

**Each look in parameters.**
- **Default.** The resting frosted tile: top `#f4f5f7`, opaque and colour-matched on the live floor. Two faint ghost bands (darkness 0.04, width 0.025) inside the upper edges stand for the far bottom edges seen through the glass. White rim lines at 0.55 on the sides and a trace of 0.15 top and bottom. Each wall is up to 12% darker at its foot, fading to none 0.07 up, about 70% of the way up the wall (`footShade`, `footBand`), so it runs light at the top. The top's rear corner is 8% darker in a soft falloff about 0.3 of the tile wide (`frostCorner`, `frostCornerR`), baked into the frost.
- **Focused.** The glass tile and a cobalt slab rise together by 0.07 while the slab fades in over it, and the glass hides once covered. Slab top `#244a92` to `#2d5db4` over a `#050d22` body, a navy pool at the rear corner, a sheen, a reflection band and a soft head glow. Metallic walls (0.6) mirror the floor. On both slabs the wall's dark foot holds over its lower 30% before it ramps to the light (`actFootHold`), and a foot shade darkens that stretch, fading out toward the top, at 0.25 here and 0.12 activated (`actWallShade`). A contact shadow (0.42) darkens the neighbours' tops. No floor glow.
- **Activated.** A brighter slab, top `#2f78e0` to `#3f8eec` with a `#6fb4ff` rim. Deep navy walls `#0d2a66` that glow from `#4a92f0` at the foot to `#2f77e2` at the top, held at the foot's colour over the lower 30% and shaded 0.12 there, no mirror. A blue pool spreads on the floor (`#2a8ff2`), a halo `#3c82ff` and a pale spill `#7fb2f2` light the neighbours, and the contact shadow lifts to 0.1. The bust becomes its hologram.
- **Spent.** The tile sinks back already carrying its tint, keeps its hologram and ignores the pointer. The walls' glow takes the tint in full and the rim line half of it.
- **Resetting.** The wave flips the tile in place, about the axis through its centre parallel to its top-right edge, with no lift, so the lower half passes into the floor. Edge-on it swaps to the other cast's human and lands as a default tile.

**Transitions and timings.** Every stage runs `animSpeed` 1.69 times faster than its written time, so the floor's whole tempo has one knob. Rise and sink ease exponentially toward their target with `riseTau` 0.12 (0.071s on the wall clock), which lets any change interrupt any other without a jump. The activation's fade-in is 0.08 (0.047s). The activation runs `ACT_SECONDS` 0.9 (0.53s). Deactivation fades everything together over `DEACT_SECONDS` 1.05 (0.62s), for the reason in Activation sweep (5.4). Two focus rigs let one tile settle while the next rises, and with both locked by clicks a new hover is ignored.

**Reasons.**
- A click locks the tile because a half-converted bust snapping back to human reads as a glitch, never as a choice.
- Spent tiles ignore the pointer so a played character cannot be replayed until the wave brings a new one. Each tile is one visitor's turn.
- The spent tint is TileFloor's `#e3f3ff`, a light wash of the holograms' sky blue, because the params file's `#e3e5e8`, the hero's earlier container grey, would leave a played tile indistinguishable from a fresh one. Which of the tint's three values wins, and how to change it, is in Special palettes (2.2).
- The wave flips rather than fades, so a change of cast reads as the floor turning over its cards, one by one, in reading order.

**The commit rule.** `COMMIT_SECONDS` 0.25 says an activation left by the pointer after that point finishes before it fades, and one left earlier reverts. Every click locks today, which skips the rule, so it never fires. Keep it if an unlocked activation (a hover that activates) is ever added, and remove it otherwise.

**Accessibility.** The tiles are pointer only: no focus, no keyboard activation and no announcement. The cursor turns to a pointer over live tiles only. A keyboard path would need a focusable stand-in per on-screen tile and an announcement when a character converts.

**Gaps.** No API pins a state, so the guide cannot show a forced focused or activated tile. Activated stills cannot be rendered offline, for the reason under Characters and holograms (5.5). The comment at `interact.js:6` still calls the spent tint "a slight charcoal tint", and it is blue today.

**Do / Don't.**
- Do pass `spentTint` from TileFloor, so the played state stays visible.
- Do keep focused and activated as two slabs with one set of keys, so a rig can crossfade them.
- Don't let a spent tile answer hover.
- Don't add a state that only the pointer can reach without a keyboard twin.

**How to change it safely.** Edit `states.default` or `states.shine` in the params file, keeping the two blocks' keys the same. The shading keys sit outside both blocks, at the top level, so they apply to every look: `footShade` and `footBand` (the resting walls), `actFootHold` (both slabs' walls) and `frostCorner` and `frostCornerR` (the resting tops). `actWallShade` is per state. `frostCorner` and `frostCornerR` are baked into the frost, so a change to either needs the bake. Run `tools/tiles/bake-textures.mjs`, then hover and click a tile on the live floor and watch a full turn of autoplay, the only places the states are drawn.
