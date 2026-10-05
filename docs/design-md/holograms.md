### Characters and holograms

**The rule.** Every AI copy on the site is a faceless blue scan-line hologram of its human, and never another rendering: not a tint, not a filter, not a second illustration style. One look means the visitor learns it once, on the hero's tiles, and recognises the model everywhere after.

**Where it appears.** Three places. The tiles: each activated bust crossfades from `/tiles/chars/<name>.webp` to `/tiles-holo/chars-ai/<name>.webp`. The players: the Human / AI switch plays `/players-holo/<id>-ai.webm` (with a stacked MP4 and a still for browsers without WebM alpha). The footer: the copy line's picture, `/footer/copy-line-holo.webp`.

**Casts.** The floor has two casts, `chars` and `chars2`, 37 names each, in `floor-params.json`. Paths are derived: the hologram of `chars/<name>` is always `chars-ai/<name>`. 37 is enough to fill the view with no face twice. Each reset wave swaps every tile to the other cast. Tiles are cast most visible first, and each takes the least recently used name that no tile within two cells shows, so neighbours never repeat. Every picture has a 768px copy and a 512px copy for phones, all alpha WebP.

**Decal geometry.** The bust is a plane laid flat on the tile's top, turned 45 degrees so the head points to the rear corner and the chest to the camera corner. It is 0.92 of the tile, stretched 1.35 along the diagonal to undo the foreshortening of the camera's 40 degree tilt, and pushed 0.08 toward the camera corner along the same diagonal. It floats 0.002 above the top and rides the tile as it rises. It is clipped to the tile's rounded outline, inset 0.01 with a 0.015 soft edge, so a bust never spills over the glass edge. The material is unlit and not tone-mapped, so the picture keeps its own colours, with a -8 polygon offset so it never fights the glass, and a -0.75 mip bias for a sharper pick at the long lens.

**States of a bust.** Blank until its picture is on the GPU. Human. Crossfading, both drawn, the hologram's opacity following the sweep's convert value. AI, once converted. AI pending: the hologram has not landed, so the tile stays human and autoplay picks another. AI failed: it plays as human. The crossfade is a plain opacity fade across the whole bust, not a wipe, despite its uniform's name (`uScan`).

**Loading plan.** The on-screen humans come first, most central first, then the hologram autoplay converts first, the other on-screen holograms in the same order, and last the humans and holograms off screen (there for a resize). The floor waits for the on-screen humans and then up to 3s more for the rest of the cast, so a first visit starts as a reload does: every picture is in and on the GPU under the loader, and none arrives mid-intro. A slow connection waits no longer than that and takes the rest as it lands. A picture that lands later decodes off the main thread and goes up to the GPU one per idle moment, because a burst of uploads made a visible jerk in the first activation. Only the cast on screen stays on the GPU. The other is fetched when a wave is near and let go after it, which saves about 230 MB that stalled an Intel MacBook Pro after the first wave.

**Performance rules.** Never hold both casts on the GPU. Never decode a picture on the main thread. Never make the floor wait for a hologram before its first frame.

**Gaps.** The comment at `characters.js:5` still calls the AI copy charcoal. `tools/tiles/render.cjs` (lines 13 to 14) does not serve `/tiles-holo/`, so a static render that waits for the holograms fails.

**How to change it safely.**
- *Decal geometry.* The stretch (`charStretch` 1.35) and the push toward the camera (`charForward` 0.08) are tied to the camera's elevation (`elev` 40) and its field of view (`fov` 14), all in `floor-params.json`. Change one and retune the other two with it, or every bust lands squashed or off its tile. The size, inset and soft edge (`charSize`, `charInset`, `charEdgeSoft`) keep a bust inside the glass, so a larger bust needs a matching inset.
- *Casts.* Keep both casts the same size and no smaller than the number of tiles on screen at the widest view, today 37, so a wave never shows a face twice and the swap between casts stays even.
- *The crossfade.* `uScan` is a plain opacity crossfade driven by the sweep's convert value, whatever its name suggests, so a change to it is a change to how every tile converts.
- *Check it.* A static render of the floor (`tools/tiles/render.cjs`) for the decals' placement, then a full live wave on the page, since only a live wave shows the casts swap and the crossfade run.

**How to add a character.** Put the human at `public/tiles/chars/<name>.webp` and its hologram, with the same name and framing, at `public/tiles-holo/chars-ai/<name>.webp`, plus both 512px copies. Add the name to one cast in `floor-params.json` and keep each cast at 37. Make the hologram from the human with the same scan-line treatment as the others, never by tinting the human picture.
