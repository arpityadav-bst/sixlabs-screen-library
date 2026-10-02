### Micro-interactions

#### Values

The trigger table, each row with its part, response, timing and source line, lives in the guide. The pattern under it is short: colour changes on small controls take 200ms (`--ds-dur-ui`), lines, borders and lifts take 300ms (`--ds-dur-line`), an answer or detail opening takes 350ms (`--ds-dur-panel`), a closing panel 140ms (`--ds-dur-exit`), and every press, thumb and popover rides a spring.

#### Use for

Any new control takes its timing from the row whose trigger and job match. A new toggle's thumb takes the thumb spring because ModeToggle's does. A new disclosure takes the Faq's 0.35s height and 300ms icon turn.

#### Never for

- Meaning carried by hover alone. Whatever a hover reveals (a label, a lift that says "this is a card you can press") has a twin on `:focus-visible`, or a keyboard visitor gets less than a mouse one.
- Hover effects on touch. Tailwind v4's `hover:` variant applies only under `(hover: hover)`, and new CSS hovers are written inside the same query, so a tap never leaves a part stuck in its hover look.
- Animating layout properties on a hot path. Width and height transitions (the wave label, the carousel dot, the Faq answer) are kept to small, rare parts. New work moves transforms and opacity.
- Blur or filter in a transition. The LanguageMenu panel animates `filter: blur()` today, which breaks the compositor-safe rule (5.13) while it runs. New popovers use scale, y and opacity only.

#### Reasons

- A shared table keeps the site consistent without anyone remembering numbers, and a visitor who learns the rhythm on one control can predict the next.
- Colour is quick because it is information the visitor is waiting for. Movement is a little slower because the eye has to follow it.
- Exits are faster than entrances. A closing menu is already out of the visitor's attention, so it should get out of the way.
- Springs on presses and thumbs carry their velocity into the next input, so a quick double click never queues a second animation.

#### Accessibility

Every hover response must be reachable from the keyboard and must not be the only carrier of a state. The WaveButton's label is the known gap: it widens on hover only, so a keyboard visitor tabs onto an icon whose name is visually hidden. The system IconButton's `showLabelOnHover` widens on focus too.

#### Responsive

Timings do not change by breakpoint. Below md the hover rows simply do not fire, and the press rows (MobileMenu rows, carousel dots) carry the feedback.
