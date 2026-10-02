### Chip

**Purpose.** Small interactive pills for narrowing, choosing and holding values: filtering a list by trait, picking one player type, showing the values a person has added and letting them take one back. The site does not ship any. The Chip is drawn in the site's own language, white with a hairline and navy when chosen, so it can sit beside the shipped parts without reading as an import.

**Anatomy.** A pill with 12px either side and a 6px gap. A check slot that has no width until the chip is chosen. An optional 14px icon or a 20px Avatar. The label in Inter 13 at 500. On input chips, a 20px remove circle with an X at 14 and a 24px hit area that reaches past the circle without growing the chip.

**Variants.** Three kinds, each with its role. Filter chips are toggle buttons with aria-pressed, each on or off on its own, set inside an element with role group and a label that says what they filter. Choice chips are radios with aria-checked inside a radiogroup with a label: one tab stop on the chosen chip, the arrows move the choice. Input chips hold a value, with a remove button named "Remove" plus the value, which Backspace and Delete also fire. A label that is not pressed is a Badge or a Tag, never a Chip.

**Sizes.** sm 28, md 32, lg 36. The heights match the small controls they sit beside: sm beside an xs button, md beside an sm button or a segmented sm segment, lg beside a 36 field. The label stays 13 at every size, because chips are read in rows and a row of mixed label sizes reads as mixed importance.

**States.** Rest: white, the hairline, the secondary body grey. Hover: the firm hairline and ink. Focus-visible: the accent ring at a 2px offset (on the remove button for input chips). Pressed: 0.97. Selected: a navy fill and border with white text, and the check growing in. Disabled: 40% and not-allowed. Remove-hover: the open fill behind the remove circle only, so it is clear the press removes rather than toggles.

**Why the check.** Selected adds a shape as well as a colour. A chosen chip is wider by the check, which tells a reader who cannot see the navy (or sees it in a grey ground's glare) which chips are on. The fill is navy, never the accent (chapter 8).

**On blue.** On the accent water the chip has no fill at rest: a white 40% line round a full-white label that sits on the blue itself, white at 15% on hover, and the remove circle takes white at 25% on its hover. Selected turns white with ink, the chosen state on the water that the accent rule (chapter 8) gives the reason for.

**Props.** `Chip`: `kind`, `selected`, `onToggle`, `onRemove`, `icon`, `avatar`, `size`, `ground`, `disabled`, `tabIndex` (set by ChipGroup), `forceState`, `className`, and the label as `children` (a string, since it also names the remove button). `ChipGroup` is the radiogroup for choice chips: `options` (each `id`, `label`, optional `icon` and `disabled`), `value` (null while none is picked), `onChange`, `label` (the group's accessible name, required), `size`, `ground`, `disabled` and `className`. `ChipInputGroup` is the set of input chips: `items` (each `id`, `label`, optional `icon`, `avatar` and `disabled`), `onRemove` (the caller drops the value from `items`), `label` (required), `size`, `ground`, `fallback` (where focus goes once the set is empty) and `className`. Filter chips need no group part, only an element that names the set.

**Motion.** Colour over 200ms. The check grows from width 0 over 200ms as the chip is chosen, so the label slides aside rather than jumping. A removed chip collapses its width and fades over 160ms, then leaves the row, so its neighbours close the gap smoothly. Under reduced motion it leaves at once.

**Accessibility.** The group or radiogroup carries the label the chips need for context ("Filter by trait"). Choice chips are one tab stop, the group owning the arrow keys. Input chips sit in a ChipInputGroup, which owns their removal: when a chip goes while focus is in the set, focus moves to the next chip's remove button, or the previous one at the end of the row, and to the field that adds values once the set is empty, so a keyboard visitor is never dropped at the top of the page. A lone Chip moves no focus of its own. The remove button's name includes the value, so "Remove The explorer" is clear out of context.

**Responsive.** Rows wrap by default at an 8px gap, because every filter should stay in view when the row is the control. A single line that scrolls sideways in its own box fits a row heading a list on a phone, where the list matters more than the filters above it. The page never scrolls sideways for a row of chips.

**Do / Don't.**
- Do keep chip labels to one to three words.
- Do label the group, not only the chips.
- Do use choice chips for one of a few, and a Select once there are more than about six.
- Don't show selected with colour alone.
- Don't fill a chip with the accent.
- Don't use a chip as a link to another page.
