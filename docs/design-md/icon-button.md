### Icon button

**Purpose.** An action shown as an icon alone, for the controls a page repeats or that everyone already reads by shape: close, next, back to top, the floor's next wave. The site ships three (the wave button, the player arrows, Back to top), each with its own size and none with a designed focus or press. The IconButton puts them on one ladder with one set of states.

**Anatomy.** A circle, or a pill when the label widens in. The icon at its optical centre on the ladder's stroke. An optional label span that grows from nothing beside the icon. An optional badge pinned to the top right, 4px out, for a count or a status dot.

**Variants.** Elevated is white with a hairline and the float shadow, for a button that hovers over content, as Back to top does. Outline is white at 90% with a hairline and 70% ink, the wave pill's look, for a control sitting on the grey container. Ghost has no box until hover and lives inside rows and toolbars. Solid is the navy primary in round form, for the one committing icon action in a view. Glass is white at 15% with a 25% ring and white icon, the player arrows' look, and only works on the accent water.

**Sizes.** xs 28, sm 32, md 40, lg 44, xl 48, with icons 14, 16, 18, 18 and 20. The heights match the Button's rows up to md, then step by 4, because a round target looks larger than a pill of the same height. lg (44) is the least a control a thumb reaches first on a phone takes, the floor in Accessibility baseline (2.11), which is why the shipped 36px player arrows move to lg as system parts, and md (40) is for rows a pointer works. No size is 36, the height of the sm field and the lg chip, so beside those an icon button takes sm (32) centred on the row.

**States.** Rest. Hover: elevated lifts 2px and lightens, outline turns its icon accent, ghost takes the open fill, glass brightens to a 25% fill and solid shifts to the hover navy. Focus-visible: the accent ring, white on blue. Pressed: 0.94 on the press spring, a deeper press than the Button's because the target is smaller. Disabled: 40%. Loading: a spinner of the icon's size takes its place, so the circle never changes size. Toggled: aria-pressed, which fills ghost, outline and elevated navy and turns glass white with a navy icon. Solid is an action and has no toggled state, because its inverse would be a white fill on a light ground, where selected is navy. In forced colours a toggled button fills `Highlight`.

**The label.** The `label` prop is required and becomes the accessible name. With `showLabelOnHover` it also widens in to the icon's left, from 0 to 80px over 200ms, the wave button's pattern, on hover and on keyboard focus alike. The shipped wave button reveals on hover only, so a keyboard visitor never sees its name. A Tooltip carries the label for icon buttons that do not widen.

**Props.** `icon`, `label`, `size`, `variant`, `selected`, `toggledIcon`, `loading`, `disabled`, `showLabelOnHover`, `href`, `onClick`, `badge` and `forceState`.

**Motion.** Colour over 200ms, the elevated lift over 300ms, the press on stiffness 400 and damping 25. A toggle with a `toggledIcon` cross-fades the two icons over 160ms (`--ds-dur-quick`) while each turns a quarter, so Menu becomes X in place. Under reduced motion the swap is instant, with no fade and no turn.

**Accessibility.** A native button, or an anchor with an href. The label is always present as aria-label, so no icon button is ever announced as "button" alone. A toggle reports aria-pressed and keeps one label ("Menu"), because a label that also flips would say the state twice. A count badge needs its own accessible name ("3 new"), because a bare numeral read after the label says nothing.

**Responsive.** The system part keeps its size at every width. Placement is the view's call: the hero puts the wave button bare under the row from md and as a pill inside the container on phones, and the players show their arrows only below lg, where the portrait fills the width.

**Do / Don't.**
- Do give every icon button a label, and keep it short and verb-led.
- Do use lg or larger for anything a thumb reaches first on a phone.
- Do use glass only on the accent water.
- Don't show toggled with the accent.
- Don't use an icon that needs its label to be understood without showing that label somewhere.
- Don't let a badge be the only place a count is announced.
