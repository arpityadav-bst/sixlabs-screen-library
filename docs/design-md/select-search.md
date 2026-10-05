### Select and search

**Purpose.** Select picks one value from a list that is too long to show as radios. SearchField finds something by typing part of it. Neither exists on the site yet. Both open the same list panel, which is the header's language menu (LanguageMenu.tsx:78-109) made solid, so the one list a visitor has already used is the one every list looks like.

**The panel.** Solid white, a 70% slate hairline, radius 16, 6px of padding, 8px below its trigger, at most 320 tall before it scrolls, and `--ds-shadow-pop` (0 18px 50px -12px at 18% ink). Rows are 10px by 12px at radius 12, Inter 15/22 in the secondary grey, the selected row in 500 ink with a 16px check. The active row sits on a slate 100 highlight that glides from row to row. Group labels are 11px caps at 0.14em in slate 400. A disabled row sits at 40% and the keys skip it. An optional code column (the language menu's US, KR) sits at 11px semibold before the label.

**Why no blur.** The shipped menu blurs what is under it (`backdrop-blur-xl`) and blurs itself in and out. Any blur on screen breaks the compositor-safe rule (5.13) for as long as it shows. At 95% white the blur adds nothing a reader can see, so the system panel is plain white and drops the filter from its transitions. The shipped menu keeps its look until the site itself is changed.

**Anatomy, Select.** The Field shell (label, helper, message), then the trigger: the md field box with the value or the placeholder and a 16px chevron in the muted grey that turns 180 degrees as the list opens. The panel opens under it at full width.

**Anatomy, SearchField.** A pill in the field's white and line, a leading 16px glass at 14px and the text starting at 40. The right edge holds one thing at a time: the shortcut chip (20 tall, radius 6, JetBrains Mono 11) while the field is empty and unfocused, the clear button (an xs ghost IconButton with an X at 14) once it holds text, or a spinner while results load. Results open in the same panel, with the letters that matched set in 500 ink.

**Variants.** Two parts on one panel, Select and SearchField. Select also renders as the native `select`, under md by default (`native` auto) or always, as Responsive explains.

**Sizes.** The Select trigger takes the field heights, 36, 44 and 52, so it lines up with the inputs in a form. SearchField runs 32, 40 and 48 with text at 13, 14 and 15, a step shorter, because it lives in toolbars and section heads beside sm and md buttons rather than in forms.

**States.**
- *Select trigger:* rest, hover (the darker line), focus (accent line and halo), open (focus plus the turned chevron), filled, disabled, read-only (inset grey, focusable, the list does not open), read-only focus (the inset grey under the focus line and halo), invalid (danger line and message), invalid focus (the danger line's halo with the accent outline) and open over an invalid trigger, all from the field box.
- *Select row:* rest, active (the highlight), selected (500 ink and the check) and disabled (40%).
- *SearchField:* empty (the chip), hover, focus (the chip hides), filled (the clear button), searching (the spinner and `aria-busy`), no results (a status row) and disabled.

**Props.** Select: `label`, `options` (`{ value, label, code?, disabled?, group? }`), `value`, `defaultValue`, `onChange`, `placeholder`, `size`, `helper`, `error`, `optional`, `disabled`, `readOnly`, `required`, `name`, `native`, `inline` with `active` (the guide's open-in-flow form), `forceState`. SearchField: `label`, `value`, `defaultValue`, `onChange`, `placeholder`, `suggestions`, `onSelect`, `size`, `loading`, `shortcut`, `bindShortcut`, `disabled`, `inline`, `forceState`.

**Motion.** The panel opens from scale 0.94 and 8px up on the pop spring (460 / 34, mass 0.7), its rows following 35ms apart from 40ms, each 4px up. It closes in 140ms ease-in to 0.97, faster than it opened, because a closing list is already the past. The highlight glides between rows on the same spring. Under reduced motion the panel only fades and the highlight jumps.

**Keyboard, Select.** The select-only combobox pattern. Focus stays on the trigger the whole time and the active row is named through `aria-activedescendant`, so a screen reader follows it without focus moving. Down, Enter or Space opens on the current value. Up and Home or End open at the ends. While open the arrows move, Home and End jump, Page keys move ten, letters typed within half a second jump to the first match, Enter or Space picks and closes, Escape closes without picking, Tab closes and moves on. A press outside closes it.

**Keyboard, SearchField.** The combobox pattern inside a `search` landmark. The arrows move through results while the caret stays in the field, Enter picks the active result. Escape clears the query, which also closes the results, and focus stays in the field so the next search can start at once. The shortcut (usually `/`) focuses the field from anywhere outside another field. Where another control owns that key, as the guide's Jump field does, `bindShortcut={false}` shows the chip without listening.

**Accessibility.** The trigger is named by the label and the current value together, so it is heard as "Player type, The explorer". Grouped options sit in `role="group"` lists named by their label. The no-results row is a polite status that names the query, so silence never stands in for an answer. Keys the list answers stay inside it, so page shortcuts never fire while choosing.

**Responsive.** Under md Select hands over to the native `select`, styled as the same trigger. A phone's own picker is larger, scrolls with momentum and knows the keyboard and the screen reader better than any panel. Group names fold into the option text there, because native groups render unevenly across phones. SearchField keeps its own results on phones, with its text at 16px.

**Choosing between them.** Two to five options that fit in view are radios or a segmented control, because a visible choice needs no click to compare. Six to about fifteen are a Select. Past that, or when the reader knows what they want by name, it is a SearchField.

**Do / Don't.**
- Do keep option labels short enough to fit the trigger without truncation.
- Do say when a search found nothing, and name what was searched.
- Don't hide two or three options behind a Select.
- Don't blur a panel or animate a filter on it.
- Don't move focus into the list. The trigger keeps it.
