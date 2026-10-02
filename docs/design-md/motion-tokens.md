### Easing, duration, springs

#### Values

One ease, `cubic-bezier(0.22, 1, 0.36, 1)` (`--ds-ease-out`, `EASE` in `src/components/design-system/motion.ts`). Every other curve has one job. A ladder of durations named by job, from the 120ms press to the 1600ms shimmer (`--ds-dur-*`, `DUR`). Its two quickest steps are system additions for the new parts: 120ms (`--ds-dur-press`) for a press settling, a field growing a line and a tooltip leaving, and 160ms (`--ds-dur-quick`) for a tooltip arriving, a toast leaving, a chip collapsing and an icon swap. Every overlay's reduced-motion fade takes the 140ms exit. The springs (`spring-press` 400 / 25, `spring-thumb` 500 / 40, `spring-pop` 460 / 34 mass 0.7, `spring-drift` 60 / 18) exist only in JS (`SPRING`). A ladder of press and grow scales, one per job (`--ds-scale-*`, `SCALE`). Travel distances run from the 28px section rise down to the 2px hover lift, with an 8px ceiling for loops. Every value, with its role, use, misuse and source line, is in chapter 3, from Eases (3.26) through Durations (3.27), Springs (3.28) and Press and grow scales (3.29) to Travel (3.30).

#### Use for

- The ease: anything that arrives, opens, fills or settles. Entrances, panels, bars, the trait fill, a menu row.
- In-out cubic: a sweep that has to start and end at rest because something is swapped at its middle (the Human / AI sweep, the tile flip).
- The CTA sweep curve: the primary button's dot band, nothing else.
- Ease in: the first half of a flip and a panel leaving, where the part should accelerate away.
- Linear: anything that repeats (spinners, load bars, a turning logo), because an eased loop visibly pauses at each end.
- Glide: the in-page link scroll only.
- Springs: direct manipulation. A press, a thumb sliding to a choice, a panel opening from the control that was just pressed, the badges following the pointer.
- The scales, by what is pressed: 0.94 for round small targets (icon buttons, avatars, the toast's close), 0.97 for pills, chips, segments, tabs and text actions, 0.985 for a whole card, and 0.92 for a choice mark under a held press. Panels arrive from 0.96. A solid pill grows to 1.02 on hover below lg and to 1.04 from lg, as Try now does. The smaller the target, the deeper the press, so the change still shows under a finger.

#### Never for

- A curve that overshoots (a back or bounce ease) on a control. It reads as play, and the site never settles that way.
- A spring on something the visitor did not touch (an entrance, a reveal). A spring promises that it follows the hand.
- A new duration picked by feel. Choose the job first, then take its duration from the ladder.
- Tailwind's `ease-out` (`0, 0, 0.2, 1`) in new work. The hero's opacity fades use it today, and that is history, not a choice.

#### Reasons

- One curve is what makes many parts feel like one product. A quick start answers the input at once, and the long tail lets the eye arrive with the part, so nothing snaps.
- A link that colours in 200ms in one place and 300ms in another feels like two sites, which is why durations are named by job rather than by length.
- An interrupted spring turns round from where it is, with its velocity, so a press released halfway never jumps back to a keyframe.
- Travel scales with the size of what moves. Large travel on a small part reads as a jump, small travel on a section reads as nothing.

#### Known drift

The site declares the ease as a local const in every file that uses it, which the guide's drift table counts. It also has three near-duplicates on the ladder: 0.45s loader exits against 0.5s reveals, 0.6s hero numbers against 0.7s section rises, and 200ms against 300ms for the same kind of link hover (Sign in and the hero inline link at 200, the header and footer links at 300). New parts import `motion.ts`, so the count stops growing. Folding the duplicates changes the live site, so it waits for the owner. LanguageMenu's exit eases on motion's named `easeIn`, `cubic-bezier(0.42, 0, 1, 1)`, a near twin of the ease-in token's `cubic-bezier(0.4, 0, 1, 1)` that the eye cannot tell apart and a search for the token misses.
