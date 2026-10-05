### Text fields

**Purpose.** Typed answers: a work email, a studio name, a note for the testers. The site ships no field today, so Field, TextInput and TextArea are system parts drawn in its own language. A white box, a hairline strong enough to find, navy type, and the accent kept for the two moments a reader needs to locate the cursor: the caret and the focus line.

**Anatomy.** Field is the shell and owns everything outside the box: the label (Inter 13/18 at 500, -0.01em, 8px above), an optional "(optional)" in the muted grey, the helper (13/18 muted, 6px under the box), the message (13/18 with a 14px icon) and the counter (12, tabular figures, at the right of the helper's line). The box holds an optional leading icon (16, 18 at lg), the value and a trailing slot for a unit, an action button or the success check. TextInput and TextArea are the box plus the shell, and the Select trigger borrows the same box.

**Why a white box with its own line.** The site's hairline (slate 200 at 80%) is a card edge. It sits near 1.2:1 on white, which is fine for a card that is found by its content and fails for a control that is found by its edge. WCAG asks 3:1 for a boundary that tells the reader where to click. `--ds-color-line-field` (#848fa1) is the lightest slate that clears it on white (3.26:1) and on the page (3.12:1), so the field reads as a field without turning into a heavy outline.

**Variants.** TextInput for one line, TextArea for a sentence or more. Both take a helper, an error and the optional mark. TextInput adds the leading icon (only when it names the kind of value: a mail glyph for an email, never decoration), the trailing slot and the success state. TextArea adds auto-grow and a soft limit.

**Sizes.** sm 36, md 44, lg 52, with text 14/20, 15/22 and 16/24, padding 12, 14 and 16, and radius 12, 12 and 14 (`--ds-radius-xs`, then `--ds-radius-row` at lg). md is the default because 44 is the touch floor and the height of the large icon button beside it. lg shares its 52 with the xl button, so a one-line form such as the waitlist line keeps one top edge and one baseline. sm is for dense desktop tables and filters only. TextArea rests at 88, 112 and 136, three lines at each size.

**States.**
- *Rest:* white, the field line, ink value, placeholder in the muted grey (4.75:1, so a hint is still readable).
- *Hover:* the line darkens to #64748b. It changes only while the box is not focused, so moving the pointer over a focused field never flickers the focus look.
- *Focus:* the accent line and a 3px halo at 18% in place of an outline. Text fields show it on every focus, mouse included, because the caret position is the information.
- *Filled:* the rest look with a value. A field never changes colour for having a value.
- *Disabled:* the inset grey #f6f7f9, a slate 200 line and slate 400 text, out of the tab order. Use it only when the reason is visible nearby.
- *Read-only:* the inset grey with a hairline, but focusable, selectable and copyable, and announced as read-only.
- *Invalid:* the danger line #d92d20, and on focus its 16% halo with the 2px accent outline, since the halo alone barely changes the box, and a message with a CircleAlert. The message text is #b42318, the darker red at 6.57:1, so a 13px line reads as text rather than as a warning light.
- *Success:* the success green at 60% and a CircleCheck in the trailing slot, for answers checked against the server (a free studio name), never for "looks fine".

**Validation timing.** Errors appear on blur or on submit, never while the first keys land, and once shown they clear on the keystroke that fixes them, so the reader is told late and forgiven early. Forms (9.7) sets the full timing and its reasons.

**Text under md.** Below 768 every size sets its text at 16px. iOS zooms the page into any field whose text is under 16px and leaves it zoomed, which breaks the layout for the rest of the visit. The box keeps its height, so only the type changes.

**Autofill.** Browsers paint autofilled fields pale yellow or blue. The system covers that with a white inset and ink text, so a saved address looks like a typed one. The accent never stands in for autofill.

**Props.** TextInput: `label`, `hideLabel`, `size`, `helper`, `error`, `success`, `optional`, `leadingIcon`, `trailing`, `disabled`, `readOnly`, `required`, `maxLength` with `showCount`, `type`, `value`, `defaultValue`, `onChange`, `onBlur`, `placeholder`, `name`, `autoComplete`, `inputMode`, `forceState`. TextArea: `label`, `hideLabel`, `size`, `helper`, `error`, `optional`, `autoGrow`, `maxLength` (a soft limit, with its counter always shown), `touched`, `disabled`, `readOnly`, `required`, `value`, `defaultValue`, `onChange`, `onBlur`, `placeholder`, `name`, `forceState`, `id` and `className`. It has no success state, leading icon, trailing slot, `type`, `autoComplete` or `inputMode`. Field: `label`, `hideLabel`, `optional`, `helper`, `error`, `success`, `count` and `maxLength`, `labelAs`, and a render function that receives the ids.

**Motion.** The line and halo change over 200ms on the one ease. A message opens from height 0 with a 2px drop over 200ms, so the form below moves once rather than jumping. TextArea grows over 120ms as lines are added. Under reduced motion all three are instant.

**Accessibility.**
- The label is a real `label` with `for`, never a placeholder. `hideLabel` keeps it for screen readers where the context already names the field.
- `aria-describedby` lists the helper, the message and the counter that are actually rendered, so nothing is announced twice or missing.
- `aria-invalid` follows the error, and the message sits in a polite live region, so it is heard when it appears without stealing focus.
- Required fields use the native `required`. Optional ones say "(optional)" in words, because a form that marks the few optional fields is shorter to read than one that stars the many required ones.
- Typed keys stay in the field, so the floor's R reset and other page shortcuts never fire mid-word.

**Responsive.** Fields take the width of their column, capped by the form's measure (about 480). The 16px rule above is the only change across breakpoints.

**TextArea limits.** `maxLength` on TextArea is soft. A pasted draft is kept whole, the counter turns ink from 90% and red past the limit at once, and the box turns red only after the reader leaves it, with a message saying how far over it is. Cutting text silently loses the end of someone's sentence.

**Follow-ons.** Password reveal (an eye IconButton in the trailing slot that switches the type and its label), one-time codes (six single-digit boxes that move focus and accept a paste), and a phone prefix (a compact Select in the leading slot). Each reuses the box and the shell.

**Do / Don't.**
- Do put fields on the page or a white card.
- Do keep the label above the box, always visible.
- Do write the error as the fix ("Enter an email like you@studio.com.").
- Don't place a field straight on the hero container's grey #f5f6f8, where its line clears 3:1 only by a hair (3.02:1) and the white box barely parts from the ground.
- Don't use the placeholder as the label.
- Don't validate on the first keystroke.
