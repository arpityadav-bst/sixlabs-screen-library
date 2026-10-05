### Icons

#### Values

Lucide line icons only, on a ladder of sizes from 12 to 24, each with its own `strokeWidth`. Every size and stroke, with its token, is Icon sizes (3.24), generated from the ladder the Icon part reads.

The gap between an icon and its label sits outside the icon's square: 6 at 12 and 14, 8 at 16 and 18 (every button from sm up), 10 in a list lead. Colour is `currentColor` and nothing else.

#### Use for

The size follows the icon's role and the box it sits in, never the size of the text beside it: a Tag sets a 16 by its 13px label, and an xs Button a 14 by its 12px one. 12 in badges. 14 in xs controls, the chip's check and remove, and inline with 13px text. 16 as a list lead (a Tag, a menu row) and in sm and md controls, the sm and md fields included. 18 inside the 40 and 44 boxes and beside the lg and xl pill labels, the lg field included. 20 in a 48 box, the xl icon button. 24 standalone, for an icon that names a state on its own, such as the terminal's pointer or an empty state.

#### Never for

Sizes between the steps (the site's 17 and 22 move to 16 and 20). A stroke picked by eye or left at lucide's default of 2 above 14. A rotating icon as a loader, which is the Spinner's job. The brand marks, which are their own artwork at 32, 36 and 44 and live in Logo and identity (6.1).

#### Reasons

`strokeWidth` is measured in the 24-unit grid, so a fixed stroke renders thinner as the icon shrinks and heavier as it grows. Setting it per size (2.25 at 12 down to 1.5 at 24) holds the rendered line between 1.13px (at 12) and 1.33px (at 20) wherever a label sits beside the icon, the weight of the Inter labels, so a 14 in the footer and an 18 in a round button read as one set, and only the standalone 24 renders a heavier 1.5px, because it has no label to match. Colour follows the control because the icon is part of its label: when the label turns accent on hover, so does the icon, and a disabled control greys both at once.

#### Custom glyphs

Two shipped glyphs are not lucide: the FAQ's plus, two 16px bars 1.5px tall that turn into a minus, and the two CSS ring spinners. Any new glyph is drawn on the same 24 grid with 2 units of padding, round caps and joins, at strokeWidth 1.75, so it sits in the set without a second weight.

#### Icon

**Purpose.** The one way to draw a lucide icon, so the size picks the stroke and nobody writes a strokeWidth again.

**Anatomy.** The glyph's square, equal to its size. The boxed form adds a circle round it: white, a 1px hairline, 32 for icons up to 16, 40 at 18, 48 from 20.

**Variants.** Standalone sits inside a control, which centres it. Inline sits in a line of text and is shifted -0.125em, because an icon on the text baseline floats above the x-height while the shift centres it on the lowercase letters. Boxed gives a lone icon a surface of its own, for a list lead or an empty state, where a bare glyph on the page ground reads as a stray mark.

**Sizes.** The six steps above. Icon sizes never change at a breakpoint. The control round them does.

**States.** None of its own. It takes its parent's colour: ink at rest, accent on hover where the control turns accent, quiet when disabled.

**Props.** `icon` (a LucideIcon), `size` (12, 14, 16, 18, 20 or 24, 16 by default), `label`, `form` (standalone, inline or boxed), `box` (32, 40 or 48) and `className`.

**Motion.** None. A control may turn or swap its icon (the language globe tips 20 degrees, IconButton cross-fades Menu to X), and that motion belongs to the control.

**Accessibility.** Decorative by default (`aria-hidden`), because a visible label beside it already names the action and a second name would be read twice. With `label` it becomes `role="img"` with that name, for the rare icon that carries meaning alone. An icon-only control names itself through the control (IconButton's required `label`), never through the icon. See Accessibility baseline (2.11).

**Responsive.** The same at every width.

**Do / Don't.**
- Do take the size from the text or the box the icon sits in.
- Do leave the colour to `currentColor`.
- Don't mix strokes in one row, because three weights read as three icon sets.
- Don't scale an icon up to fill a larger box. Move to the next step, or box it.
