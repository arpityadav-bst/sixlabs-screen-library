### Back to top and scroll cue

**Purpose.** Two quiet aids to moving through a long page. Back to top is a small round button fixed in the bottom right that appears once the reader is deep in the page and glides them home. The scroll cue is a label and a bobbing arrow under the hero that says the page continues, and leaves as soon as the reader has acted on it.

**Back to top: anatomy.** A 44 circle (40 on phones), white, a slate-200 hairline at 80% and the float shadow (`--ds-shadow-float`), an ArrowUp 18 / 1.75 in ink, 24 from the corner (16 on phones), at z 40 over the water (20) and the players (30). It carries its own white ground because it crosses the accent water, where a bare arrow would read as part of the picture.

**Scroll cue: anatomy.** A label "Scroll" at 11 / 500 in caps with 0.18em tracking over an ArrowDown 16 / 1.75, gap 6, in slate-400. The arrow bobs 4px over 1.8s, ease-in-out, forever.

**Variants.** None for either part.

**Sizes.** One each: Back to top's circle and the cue's label and arrow below, with Back to top a step smaller on phones.

**Back to top: states.** Hidden, shown, hover (lifts 2px and turns slate-50, over 300ms). No focus ring and no pressed state today.

**Back to top: visibility.** It shows once the foot of `#model-line` is inside the view, so from the players on, the point where the way back is long enough to need a shortcut. On phones it shows only while the reader is scrolling up (a change of more than 4px, so a jitter is no change of direction) and never while the footer is in view, because the footer has its own Back to top and the thumb is busy with content on the way down. Hidden is opacity 0, 8px down, no pointer events and tabIndex -1.

**Scroll cue: states.** Present at scroll 0, away (opacity 0 over 300ms) past 40px. Its threshold is ten times the header's 4px on purpose: the header reacts to any scroll so it never lags, while the cue waits for a deliberate one so a nudge does not dismiss it.

**Scroll cue: placement.** Under the container hero at its left from md, at the full view's foot from lg. Never on phones, where the hero already runs past the fold and a cue would crowd the call to action.

**Props.** None. Both read the window: Back to top watches `#model-line` and the footer, the cue the scroll position.

**Back to top: motion.** Show and hide fade and move 8px over 300ms. A press runs the page's glide to the top, as Shell behaviours (6.7) sets out.

**Accessibility.** The cue is decorative (`aria-hidden`, no pointer events), so it is never a control and needs no keyboard twin. Its bob stops under reduced motion. Back to top gaps: when hidden it is still in the accessibility tree (tabIndex -1 but no `aria-hidden` or `inert`), the glide ignores reduced motion, and on desktop it shows beside the footer's own Back to top. Its rule is hard-wired to `#model-line` and the footer, so it works on these two pages only.

**Responsive.** Back to top changes size, inset and visibility rule at 768. The cue's placement changes at md on `/website` and at lg on the full view.

**Do / Don't.**
- Do keep the floating button's own white ground and shadow wherever it can cross the blue.
- Do hide the floating button while the footer is in view on phones.
- Don't make the cue clickable. It is a hint, and a second way down would compete with the scroll itself.
- Don't share one threshold between the header and the cue. They answer different questions.
