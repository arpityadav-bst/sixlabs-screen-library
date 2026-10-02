### Tooltip

**Purpose.** A short label for a control that shows only an icon, or for a line cut short. The only stand-in on the site is the wave button's "Next wave", which widens in on hover (HeroBits.tsx:105) and never shows on keyboard focus or touch. A tooltip makes the same words reachable from a keyboard. It is never the only place a fact lives: the words are also the control's accessible name, and anything longer belongs on the page.

**Anatomy.** A bubble of navy #0a152d with white Inter 12/16 at 500, padding 6 by 8, radius 8, at most 240 wide, and the tooltip shadow. An optional shortcut sits 6 after the words in mono 11 at white 50%. An optional 8 × 4 arrow points at the trigger. It sits 8 from the trigger.

**Variants.** Four sides, top by default. Default navy for every light ground, and inverse (white with ink words) on the terminal, where a navy bubble would sink into the dark window. The arrow is off by default because the site's pills and panels are clean shapes with no tails. Turn it on where a bubble could be read as belonging to the wrong one of several close triggers.

**Sizes.** One. The bubble grows with its words up to 240 wide, and nothing in it steps with the viewport.

**Placement.** The live bubble is placed against the viewport with an 8px collision margin. If it would cross the edge on its side and the far side has room, it flips. Then it slides along the edge to stay inside, and the arrow moves to keep pointing at the trigger's centre.

**States.** Hidden, entering, open and leaving. It opens 400ms after the pointer arrives, so a pointer crossing the page does not set off labels. Within 600ms of one tooltip closing, the next opens at once, so moving along a row of icon buttons costs one wait. Keyboard focus opens it at once, since a keyboard visitor has already chosen the control. It closes when the pointer leaves (after a 100ms grace to cross onto the bubble), on blur, on a press of the trigger and on Escape. On scroll and resize it moves with its trigger, and closes once the trigger leaves the viewport.

**Props.** `content`, `side`, `delay`, `shortcut`, `arrow`, `tone`, and the trigger as `children`. `open` and `forceState` are for the guide only: they draw the bubble in place with no hover, portal or listeners.

**Motion.** In: opacity, a scale from 0.96 and 4px of travel from the trigger's side over 160ms (`--ds-dur-quick`) on the one ease, so the bubble seems to come out of the control. Out: 120ms of opacity (`--ds-dur-press`) on the ease in, faster than in, because a leaving label should never hold the eye. Under reduced motion it fades only.

**Accessibility.** The bubble has role tooltip. The trigger is described by it through aria-describedby, unless the words are already the trigger's aria-label, which is the usual case for an icon button. Then the description is skipped so a screen reader does not read the name twice. It follows WCAG 1.4.13: hoverable (the pointer can move onto the bubble without it closing), dismissable (Escape closes it without moving focus or the pointer, and Escape is used up so a dialog around it stays open), and persistent (it stays until one of those happens). It holds no links or buttons, because it cannot be reached by Tab.

**Touch.** Touch opens nothing. A long press is the system's own gesture on phones, and a tooltip that needs one is a label the visitor will not find. So on touch the control's name must stand on its own, which is the same rule that keeps the tooltip from being the only route to the words.

**Layering.** The live bubble goes into a portal at fixed coordinates, so no panel's overflow clips it. The portal is the body, or the open dialog the trigger sits in, because a modal dialog lives in the browser's top layer and would cover anything outside it. Outside a dialog it takes the top of the z-scale, 70.

**Responsive.** It does not change with the viewport. Placement does the work at every width.

**Do / Don't.**
- Do give every icon-only control a tooltip with the same words as its name.
- Do keep the words to a short label, a few words at most.
- Do use the inverse bubble on the terminal.
- Don't put a tooltip on a control whose label is already visible.
- Don't put links, buttons or anything a visitor must read to go on inside a tooltip.
- Don't open a tooltip on touch.
