### Traits and progress

**Purpose.** Showing an amount. The site ships one kind, the player's trait bars on the blue, which show a profile rather than progress. The system adds a progress family for work that advances (a model being built, a run of tests, an upload) with the semantics the trait bars lack.

**The trait bars.** PlayerTraits draws four rows: a label in Inter 14 at white 75% in a 130px column, then a 6px track at white 20% with a white fill at the trait's value. Rows sit 16px apart (10 in the carousel's dense form, with a 124px label column and 13px labels). When another player is picked the fills slide to the new values over 0.7s on the one ease, so the change reads as the same four measures moving rather than a new chart. They have no grow-in on first mount. They carry no meter role and no value, so a screen reader hears each label followed by an empty description. That is a known gap: a meter role with aria-valuenow from 0 to 100 would fix it without changing the look.

**Anatomy.** An optional label row (the name in Inter 13, the value or status at its end), then a round rail with a round fill. The circle draws the same rail and fill as two rings.

**Variants.** Three grounds (`variant`). Light takes a rail of ink at 8% and a primary navy fill, navy and not the accent because a bar is a fill (chapter 8). Blue takes the trait bar's white on white 20%, and dark the terminal's white 40% on white 8%. Two shapes, the bar and the circle, and the bar can split into segments (States below).

**Sizes.** Bars stand 2, 4, 6 and 8 tall. 2 under a header or a card's edge, 4 as the default, 6 to match the trait bars on the blue, 8 for a page-level step. The circle comes at 16, 24, 40 and 64 with strokes of 2, 2.5, 3 and 4, so the ring keeps its weight as it grows. From 40 it can print its value in the middle.

**States.** Determinate: the fill shows the value. Indeterminate: a 35% segment runs across the rail, and aria-valuenow is left out, since an invented number is worse than none. Complete: the fill turns the success green (white on the blue, where the label says it). Error: the danger red, and the value text says where it stopped. Paused: the fill turns the muted slate on light grounds (white at 50% on blue, 20% on dark), so the amount done still reads, and an indeterminate segment holds where it is. Segments split the rail into steps filled whole, for a count of stages where a percentage would mislead.

**Words, not only colour.** The value text names every state in words: "35%", "Complete", "Failed at 60%", "Paused at 35%". It is the aria-valuetext as well, so the status is never carried by colour alone. On the blue, where green and red would lose against the water, the words are the only status carrier.

**Props.** Two exports. `Progress`, the bar: `value`, `max` (100 by default), `label` (required), `showLabel`, `showValue`, `size` (2, 4, 6 or 8), `variant` (light, blue, dark), `indeterminate`, `status` (complete, error, paused), `segments` and `className`. `ProgressCircle`, the ring: `value`, `max`, `label`, `size` (16, 24, 40 or 64), `variant`, `indeterminate`, `status`, `showValue` and `className`, with no segments and no visible label row, since the label is its accessible name.

**Motion.** The determinate fill eases its width over 700ms on the one ease, the trait bars' time, so all bars on the site move alike. The indeterminate segment crosses the rail by transform alone over 1.4s. Under reduced motion the determinate fill jumps to its value, the indeterminate segment rests at the middle of the rail, and the circle's arc stands still. The label still says what is happening.

**Accessibility.** role progressbar with aria-valuemin, aria-valuemax and aria-valuenow (left out when indeterminate), aria-valuetext as above, and aria-busy while indeterminate work runs. The label is required: a bar with no name says only that something is happening.

**Responsive.** A bar fills its container's width. The trait bars switch to their dense form inside the carousel below lg.

**Do / Don't.**
- Do show the amount when it is known, and run the indeterminate segment only when it is not.
- Do name a failure and where it stopped.
- Do keep bars navy on light grounds.
- Don't fill a bar with the accent.
- Don't leave a bar without a label.
