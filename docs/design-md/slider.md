### Slider

**Purpose.** Picking a level on a range by eye: how curious a modelled player is, how wide a skill band to test. The site shows these levels as the players' trait bars (PlayerTraits.tsx), which only display. The Slider is that bar made interactive, so the control a studio would use to set a trait looks like the trait it sets.

**Anatomy.** A label row on the terminal bars' layout (JobTerminal.tsx:266-270): the label at the left in Inter 13/18 at 500, the value at the right in tabular figures, so the number holds still while it changes. Under it the rail, the navy range from the start (or between two thumbs), the white thumb, and optional ticks with optional tick labels. While a thumb is dragged a bubble above it shows the value.

**Variants.** Two grounds (`ground`, light or blue, under Values) and two forms, one thumb or a range of two, chosen by giving `value` one number or two.

**Sizes.** Rails of 2, 4 and 6 with thumbs of 14, 18 and 22. md is the default. sm sits in dense settings rows, lg in a page where the slider is the main control. Every thumb answers a 40px circle round its centre, so the smallest thumb is as easy to catch as the largest. The rail is inset by half a thumb at each end, so a thumb at either end stays inside the slider's box.

**Values.**
- *Light ground:* rail slate 200 (`--ds-color-line`), slate 300 under the pointer, range navy #0a152d, thumb white with the 1px field line and a 0 1px 3px shadow in ink at 25%, ticks slate 300 (navy inside the range).
- *Bubble:* navy with white Inter 12/16 at 500 in tabular figures, radius 8, 8px above the thumb, `--ds-shadow-tooltip`.
- *On blue:* the trait bar's own values, a white 20% rail and a white range, with a white thumb ringed 2px in navy, a white bubble with ink text, and the label in white at 75% as the trait labels are.

**States.** Rest. Hover: the rail firms and the thumb grows to 1.1, because the pointer is now over something that moves. Focus-visible: the accent ring 2px off the thumb (white on blue). Dragging: the thumb grows to 1.15 and the bubble rises, because a finger or a cursor covers the thumb and the label row is too far away to watch. Disabled: the slider at 40%, out of the tab order. Range: two thumbs that never cross, each stopping at the other.

**Props.** `label`, `hideLabel`, `value` or `defaultValue` (one number, or two for a range), `onChange`, `onCommit` (once a drag or a key press ends, for anything that should not run on every frame), `min`, `max`, `step`, `formatValue`, `size`, `disabled`, `ticks` (true, or the values to mark), `tickLabels`, `ground` ("light" or "blue"), `forceState`.

**Pointer.** A press anywhere on the track moves the nearest thumb there and starts a drag, captured so it keeps working outside the box. The track sets `touch-action: pan-y`, so a vertical swipe across it still scrolls the page on a phone and only a sideways drag moves the thumb.

**Motion.** The thumb's scale and the bubble change over 200ms on the ease. The thumb itself follows the pointer with no easing, because a lagging thumb feels broken. The shipped trait bars ease to their value over 700ms because they are shown, not handled. Under reduced motion the bubble appears without rising.

**Accessibility.** Each thumb is a `role="slider"` with its min, max, now and a spoken `aria-valuetext` from `formatValue`, so "72%" is heard as a percentage rather than a bare number. The arrows move one step, Page Up and Page Down a tenth of the range, Home and End the ends (in a range, the other thumb). Each thumb in a range is named "minimum" or "maximum" after the label. Handled keys stay inside the slider, so page shortcuts never fire while adjusting.

**Responsive.** Nothing changes with width. The 40px hit circle and `pan-y` are what make it usable on a phone.

**When to use a slider.** For a rough position the reader judges by eye, where the exact number matters less than where it sits on the range. For an exact figure (137 players, a price) use a number field, because hitting one value out of hundreds with a drag takes several tries.

**Do / Don't.**
- Do show the value in the label row, formatted as the reader says it.
- Do use ticks when the step is coarse, so the landing points are visible before the drag.
- Don't use a slider for an exact number.
- Don't put a light slider on the blue. On the accent water use `ground="blue"`, the trait bar's own colours.
