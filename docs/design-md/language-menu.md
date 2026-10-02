### Language menu

**Purpose.** A region and language picker (US English, KR, JP, CN) in the header from md and in the phone sheet. It stays small in the bar (a globe and a two-letter code) and opens a short list in which each language is written in its own script, so a reader finds theirs without reading English. The choice is cosmetic today: it changes no locale and is not saved.

**Anatomy.** Trigger: a pill, px 10 py 6 (about 30 tall), Globe 18 and the code at 12/500 in a fixed 18px slot so the trigger does not change width between codes. Panel: 192 wide, p 6, radius 16, white at 95% with a slate-200 stroke at 70% and the pop shadow, hung 12px under the trigger's right edge and opening from that corner. Rows: px 12 py 10 at radius 12 (the panel's radius less its padding, so the corners nest), the code at 11/600 in slate-400, the label at 15, a Check 16 on the selected row. One highlight (slate-100) glides between rows through a single `layoutId`.

**Variants.** None. The header's instance and the sheet's are the same part mounted twice, each with its own state.

**Sizes.** One, the trigger and panel above. It never steps with the viewport.

**States.** Trigger: rest in slate-500, hover in accent over 200ms, open with a slate-200 fill at 60% and the globe turned 20°. Rows: active (the highlight under it, from the pointer or the arrow keys, wrapping at the ends) and selected (label at 500 in ink and the Check). When the pointer leaves the panel the highlight returns to the selected row, so the panel never shows a stale hover.

**Props.** None. The list and the state are internal.

**Motion.** Everything rides one spring, stiffness 460, damping 34, mass 0.7 (`spring-pop`, `SPRING.pop` in motion.ts): the globe's turn, the panel's arrival (opacity, scale 0.94 to 1, 8px down), the rows (staggered 35ms after a 40ms delay) and the highlight's glide. The exit is a 140ms ease-in, faster than the entrance, because a closing list is already out of the reader's attention.

**Keyboard.** While the trigger has focus: ArrowUp and ArrowDown move the highlight, Enter or Space choose and close, Escape closes. A pointerdown anywhere else closes it.

**Accessibility.** The trigger is named "Language: English" and the rows are options in a listbox. The gaps: `aria-activedescendant` sits on the list, which never takes focus, so screen readers do not follow the highlight. The fix is to put it on the focused trigger (with `aria-controls`) or to move focus into the list. The ids `lang-0` to `lang-3` and the `layoutId` are not scoped per instance, so two menus on one page collide (the guide wraps its one live instance in a LayoutGroup). Tab leaves the panel open. The visible code "US" is not in the accessible name "Language: English". Country codes stand in for language codes. There is no focus ring.

**Performance.** The panel uses `backdrop-blur-xl` and animates `filter: blur()` on the way in and out. Both break the compositor-safe rule (5.13), which the rest of the shell keeps, for as long as the panel is open. New pickers use the system Select, which keeps this panel's geometry on a solid white ground and animates only opacity, scale and y.

**Responsive.** The header's instance is hidden below md, and the sheet carries the phone's.

**Do / Don't.**
- Do nest the row radius inside the panel's (16 less 6 gives 12 or less).
- Do keep the trigger's code slot fixed width.
- Don't add blur to a popover, or animate a filter.
- Don't mount two instances without a LayoutGroup each.
