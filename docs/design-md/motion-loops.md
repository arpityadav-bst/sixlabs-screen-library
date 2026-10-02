### Ambient loops

#### Values

The loops that run by themselves today range from the 1.8s scroll-cue bob (4px) to the 90s floor-logo turn, and the guide's table lists each one's period, travel, curve, reduced-motion answer and source. The limits for any loop that is ambience: travel 8px or less (`--ds-loop-max`), a period of 1.5s or longer, transform and opacity only.

#### Use for

A loop says "this is alive" or "there is more here": the scroll cue, the floating tiles drifting, a loader saying it is still working, a live dot next to a count. It sits at the edge of attention and is never the thing being read.

#### Never for

- Content. A loop never carries text or a value the visitor needs, because a moving word cannot be read.
- Attention. A loop that moves more than 8px or faster than every 1.5s reads as an alert and pulls the eye off the copy.
- Anything that keeps running out of view. Loops with a cost (the badge flips, the ASCII field, the touch sway) run only while their part is near the view.
- Running under reduced motion. Every CSS loop on the site has a `prefers-reduced-motion: reduce` rule that stops it at its rest frame, and a new one ships with that rule in the same commit.

#### Reasons

- The page is calm because nothing competes with the floor and the copy. Short travel and long periods keep the loops below the threshold where the eye starts tracking them.
- Ease-in-out on a bob makes it rest at both ends, so it breathes rather than vibrates. Linear is kept for turning and cycling, where an ease would show a stutter at each end.
- Compositor loops (transform and opacity on their own layer) keep running while the main thread builds the floor, so a loader never freezes at the moment it matters.

#### Known gaps

- Tailwind's `animate-ping` (the hero's live dot) runs a 1s period, under the 1.5s floor. Neither it nor `animate-pulse` (the player card dot and the terminal cursor) has a reduced-motion guard yet, one of the gaps in Reduced motion (4.6). The system StatusDot adds `motion-reduce:animate-none` to both.
- `animate-spin` on the wave button and the terminal steps is a busy state, not ambience, so it keeps turning, and the system Spinner slows rather than stops.

#### How to add a loop safely

Write it as a CSS keyframe on transform or opacity, check it against the two limits, add the reduced-motion rule beside it, and pause it out of view if it costs anything. Then add its row to the loop table.
