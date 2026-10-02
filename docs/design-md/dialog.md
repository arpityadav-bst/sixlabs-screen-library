### Dialog and sheet

**Purpose.** A task or a confirm that has to be finished, or turned down, before the visitor goes on: requesting access, signing in, removing something. The site has none, and its MobileMenu sheet has no dialog role, no focus move and no focus return. A dialog takes the page away on purpose, so it is kept for moments that earn it. A message that only reports belongs in a toast, and a choice that can wait belongs on the page.

**Anatomy.** A solid veil of ink at 40%, then a white panel with the hairline and the modal shadow, radius 28 and padding 32. The header holds the title (Outfit 24/30 at 500, -0.03em) and a description under it (Inter 15/22 in #64748b), with room on the right for the close, an md ghost icon button 16 in from the top and right corner. The body follows at 24 and scrolls inside the panel once the panel reaches the viewport less 96. The footer follows at 32: actions right-aligned at a gap of 12, the primary last.

**Variants.** dialog, centred, for a task. alertdialog, for a confirm: the veil does not close it, and the destructive action is the primary (destructivePrimary) beside a named way out. The sheet is the dialog's phone form, attached to the bottom edge with its top corners at 28, a 36 × 4 handle 8 from the top in #cbd5e1, at most 90svh tall, and its foot padded past the home indicator.

**Sizes.** sm 400 for a confirm, md 520 for a form, lg 680 for reading. The width follows the job, because a short question in a wide panel leaves the eye hunting across empty white.

**Header, body and footer rules.** The title asks or names the task in a few words ("Remove this player?", "Request access"). The description gives the consequence in a sentence. The body holds the task and nothing else, never a second dialog. Button labels are verbs that say what happens ("Remove player", "Keep player"), never Yes and No, which send the visitor back to reread the question.

**States.** Closed, opening, open, busy, closing, and for the sheet, dragging. Busy is the work running after the confirm: the close, Escape, the veil and the drag are all held, so a half-sent request cannot be dropped. The footer follows when its actions are DialogActions: the primary spins (loading) and every other action holds (disabled). A footer of plain Buttons is the caller's to hold. Nested dialogs are not allowed. A second step replaces the content of the open dialog.

**Props.** `open`, `onOpenChange`, `title`, `description`, `size`, `role`, `presentation` (auto, dialog or sheet), `footer`, `busy`, `initialFocus` and the body as children. `inline` and `forceState` are for the guide only: the panel alone in the flow, with no dialog element, veil, trap or scroll hold. `DialogAction` is a footer Button that reads the dialog's busy state, so `busy` is passed once, to the Dialog: it takes every Button prop plus `primary`, which marks the action that spins. Outside a dialog it is a plain Button.

**Motion.** The veil fades over 250ms on the one ease, the MobileMenu veil's timing, so the two overlays feel like one family. The panel comes in from scale 0.96 and 8px low with opacity, on the pop spring (stiffness 460, damping 34, mass 0.7), and leaves faster, at scale 0.98 over 140ms on the ease in. The sheet rises from 100% on a firmer spring (stiffness 400, damping 40), so a tall panel lands without a bounce, and leaves over 200ms. Under reduced motion all of it is a 140ms fade (`--ds-dur-exit`).

**The native dialog.** It is a `dialog` element opened with showModal. The browser then makes the rest of the page inert, keeps focus inside without a hand-written trap, turns Escape into a close request and puts the dialog in the top layer, above every z value. The cost is that anything outside it, a toast or a tooltip portalled to the body, sits under it. So a tooltip inside a dialog portals into the dialog, and a dialog's outcome is toasted after it closes.

**Focus.** On open, focus goes to the first field. In an alertdialog it goes to the first footer action, the least destructive one since the primary goes last, so a stray Enter never confirms a loss. With neither, it goes to the primary. On close it returns to the control that opened the dialog. The page behind holds still with overflow clip, as MobileMenu holds it.

**The veil.** Solid ink at 40%, never blurred, because a blurred backdrop breaks the compositor-safe rule (5.13). The solid veil also keeps the page legible enough to remember where the visitor was.

**Accessibility.** The dialog is labelled by its title and described by its description. An alertdialog carries that role so screen readers announce it as a confirm. The close is a named button, and Escape works except while busy. Dragging the sheet is never the only way to close it.

**Responsive.** With presentation auto, the panel centres from md and becomes the sheet below, because on a phone the bottom edge is where the thumb already is. Under md the centred panel steps down to radius 24 and padding 24. The sheet's footer stacks at full width with the primary on top.

**Do / Don't.**
- Do name both actions of a confirm with verbs.
- Do hold every way out while the work runs.
- Do return focus to the trigger on close.
- Don't blur the veil.
- Don't open a dialog from inside a dialog.
- Don't use a dialog for a message that only reports, which is a toast.
