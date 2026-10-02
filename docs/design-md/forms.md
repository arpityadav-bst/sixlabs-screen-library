### Forms

**Purpose.** The site has no form yet. The first three it needs are the waitlist line (one email and Request access), sign in, and a contact form. They are built from the system's fields, choices and buttons, and every form after them follows the same layout and timing.

**Layout.**
- Labels sit above their fields, never inside them as placeholders. A placeholder is a format hint ("you@studio.com") and disappears as the visitor types.
- 20 between fields (`--ds-space-5`), 32 before the actions (`--ds-space-8`).
- One column. Two fields share a row only when they are one answer (a first and a last name).
- On the container grey, a form sits in a white card. On the page or white it sits straight on the ground.
- The waitlist line is the one inline form: the field and the xl button share a row, centred on each other, and stack under 560.
- Actions sit in a ButtonGroup with the primary last. A dialog's single action goes full width.

**Validation timing.**
- Nothing is checked while the visitor types into a fresh field.
- A field is checked once it is left with something in it. An empty field left alone is not an error yet.
- On submit every field is checked, the first wrong one takes focus, and the visitor's text is kept.
- Once a field has shown an error it is checked on each keystroke, so the error clears the moment the value is right.
- The browser's own validation is off (`noValidate`), so every message is the system's.

**Messages.** An error says what to type ("Enter an email like you@studio.com."), not that something failed. It sits under the field in the danger ink with its icon, and the field takes the danger border and halo. A helper sits in the same place in the muted slate and gives way to the error.

**Long forms.** Past about five fields, a submit with errors also puts an error summary at the top of the form (a danger Banner listing each error as a link to its field) and moves focus to it, so a visitor who cannot see the whole form still learns what to fix.

**Submit states.** The submit Button turns busy (its label held, a centred spinner, clicks ignored) while the request runs, and the fields go read-only so the sent value cannot change under it: TextInput, TextArea, Select, Checkbox, Radio and Switch take `readOnly`. Slider, Segmented and ChipGroup have no read-only form, so they go disabled for the request instead, and come back as they were. A failure keeps everything and shows the reason in a danger Banner above the actions. A success resets the line and confirms with a success toast, or replaces the form with its result when there is one.

**Accessibility.** Every field has a visible label tied to it. Errors are linked to their fields through `aria-describedby` and the field is `aria-invalid`. Grouped choices sit in a fieldset with a legend. Focus moves to the first error on submit and never moves while the visitor types. The password's Show button changes its own name (Show password, Hide password) as well as the field's type.

#### Reasons

- **Errors after leaving, not while typing.** A field that turns red at the first keystroke tells the visitor they are wrong before they have finished. Waiting for them to leave is the earliest moment the value is meant to be complete.
- **Then live, so the fix is seen.** Once an error is showing, checking on each keystroke lets it clear as soon as the fix is in, so the visitor does not have to leave the field again to find out.
- **Labels above, because placeholders vanish.** A label inside the field is gone the moment the visitor types, which is when they most need to check what the field asked for.
- **A white card on the grey.** A white field on grey has nothing round it and reads as a gap in the section. The card gives the field a ground of its own.
- **Read-only while sending.** A value changed mid-request is a value the server never saw.

#### Do / Don't

- Do say in the error what to type.
- Do keep the visitor's text after an error.
- Don't check a field while it is still being typed into for the first time.
- Don't put a form straight on the container grey.
- Don't disable the submit button to signal errors. Let the press show them.
