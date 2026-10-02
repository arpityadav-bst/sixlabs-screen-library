### Reduced motion

#### The rule

When a visitor sets `prefers-reduced-motion: reduce`, keep every state change, drop the travel, stop the loops and keep a busy spinner turning, slower.

- **Keep state changes.** A menu still opens, a choice still shows as chosen, a count still updates. These carry information, so they happen at once or as a short fade.
- **Drop travel.** Rises, drops, sweeps and pans go. An entrance becomes an opacity change or nothing, and the part shows at its end state.
- **Stop loops.** Bobs, turns, flips, shimmers and pings stop at their rest frame. Nothing ambient moves.
- **Keep the spinner.** A busy state still has to say busy, so the system Spinner turns at 1.5s a turn instead of 1s. Stopping it would look like a fault.

#### Where it is handled today

Every CSS loop in `globals.css` has a reduce rule. TypedWord shows the word whole, the hero copy shows at once, ScrubLine shows its line filled, the liquid is off, the doodles land without drawing, the portrait settles without its sweep and looks straight ahead on touch, the floating tiles neither drift nor flip, the terminal shows its finished run, the primary CTA keeps its grow and fill but drops the band, and the ASCII field holds still and swaps instead of scanning. The guide's table gives the line for each.

#### Gaps

These have no reduced answer yet. Known gaps (10.2) tracks them.

- The tile floor (intro rise, autoplay, waves and sweeps) runs as usual.
- The in-page glide runs as usual. Under reduced motion it should jump.
- Tailwind's `animate-ping` and `animate-pulse` on the hero dot, the player card dot and the terminal cursor keep running.
- motion/react entrances and menus travel as usual, because the site wraps no `MotionConfig` round them.

#### How to build for it

In motion/react, read `useReducedMotion()` and swap travel for opacity, or wrap a tree in `MotionConfig reducedMotion="user"`. In CSS, put a `prefers-reduced-motion: reduce` rule beside every keyframe. On a Tailwind loop, add `motion-reduce:animate-none` (or a slower spin for a spinner). In canvas or WebGL code, read `matchMedia("(prefers-reduced-motion: reduce)")` once, draw the end frame and skip the loop.

#### Reasons

Large or continuous motion makes some visitors dizzy or sick, and others simply cannot read while something moves. The setting is the visitor asking for less. Keeping state changes matters as much as dropping motion: a reduced page that stops telling the visitor what happened is broken in a different way.

#### Testing

Turn on Reduce motion in the operating system's accessibility settings, or emulate `prefers-reduced-motion` in the browser's rendering tools, and reload. The guide's readout says which reading is on, and every CSS loop specimen in the guide uses the site's real class, so it stops too.
