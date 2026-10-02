### Mobile menu

**Purpose.** Below 768 the four tabs and the language picker do not fit the bar, so a round menu button opens a white sheet straight under it with the tabs as large rows, the language row and the primary Try now. It exists only on phones: every part is `md:hidden`.

**Anatomy.** Menu button (40 round, lucide Menu or X at 22 / 1.75 in ink). Veil (ink at 20% from the bar's foot, a tap closes). Sheet (white, px 16, pt 4, pb 24, a slate-200 stroke at 80% under it). Rows (Outfit 20 at 400, py 16, a slate-100 rule, a trailing ArrowRight 18 in slate-400). Language row (a 13px muted label and the LanguageMenu, raised over the call to action so its panel opens over it). Try now (the shipped PrimaryCta stretched to full width).

**Variants and sizes.** One. Rows are about 61 tall, well past a thumb's target, because on a phone they are the only way to the sections.

**States.** Closed (the button only) and open (the X, the veil and the sheet). A row shows accent while pressed, since touch has no hover. A tap on a row closes the sheet, frees the page and glides to the section.

**Props.** `links`, an array of `{ label, to }` where `to` is a `Spot`: the header's own tab list.

**Motion.** The veil fades over 250ms. The sheet fades and rises 8px over 250ms on the system ease, short enough that the menu feels like part of the bar, not a page change. The icon swaps at once. Exit is the same motion reversed.

**The page hold.** While open the document's overflow is clipped so the page under the veil holds still. Overflow `clip`, not `hidden`, because clip does not create a scroll container and leaves the scroll position alone.

**Accessibility.** The sheet is not yet a dialog: no `role="dialog"`, no `aria-modal`, focus is not moved into it on open nor returned to the button on close, and Tab can leave it. The button is 40, under the 44 touch target. Escape, the veil and the X close it. New work makes the sheet a modal dialog with a focus trap and a 44 button.

**Responsive.** If the window widens past 768 while the sheet is open, the sheet hides but the page hold stays on until a reload or a second toggle. Any change here closes the sheet on that resize.

**Known behaviour under ClickLock.** The rows are links, so ClickLock swallows their click: the sheet stays open and nothing glides. The veil and the X still work. A language chosen in the sheet is lost on close, because the sheet's LanguageMenu unmounts and remounts at English, and it is separate state from the desktop picker.

**Do / Don't.**
- Do give the menu button the full 44 target.
- Do keep the primary call to action as the sheet's last row, at full width.
- Don't put the tabs back into a phone bar at a smaller size. The rows exist so each target is thumb-sized.
- Don't animate the sheet's height. It mounts whole and moves 8px, which keeps the motion on transform and opacity.
