### Checkbox, radio, switch

**Purpose.** Three controls for yes or no and one of a few. Checkbox is a choice submitted with a form, any number of them. Radio is one choice out of a set that is all in view. Switch is a setting that takes effect the moment it flips. The site ships none of them, so all three are system parts in its language: white marks with the field line, navy when checked.

**Why navy, never the accent.** A checked box is a state, and state is carried by the primary navy #0a152d, the same fill as a pressed button or a selected tab, as the accent rule (chapter 8) has it. A list of ticked boxes in blue would read as a list of links.

**The glyph carries the state.** A checked box draws a tick, an indeterminate one a bar, a checked radio a dot, and a switch can show a check or a cross in its thumb. Each state differs by shape as well as fill, so it survives colour blindness and glare on a phone. Windows forced colours drop fills and keep lines and `currentColor` glyphs, so the tick and the bar stay as glyphs, while the radio's dot and a switch that is on fill `Highlight` and the switch track draws a `CanvasText` line, and each state still shows.

**Native under the drawing.** Checkbox and Radio keep a real `input` in the page, invisible and laid over the drawn mark. The browser then owns the keyboard (Space, and the arrows inside a radio set), the form value, the label click and the role, and a screen reader's focus box lands on the mark. Switch is a `button` with `role="switch"`, which has no native input to borrow.

**Anatomy.**
- *Checkbox:* the box (1.5px field line, white), the tick (lucide's check path at stroke 3, drawn with a dash offset), the label (Inter 14/20 ink, 10px from the box) and an optional description (13/18 muted).
- *Radio:* the circle (1.5px line, white), the dot, the same label and description. Its group is a `fieldset` whose `legend` is styled as a field label.
- *Switch:* the track, the white thumb inset 2px with a 0 1px 3px shadow in ink at 25%, the optional glyph, the label and description.

**Variants.** The three controls Purpose names. Radio comes as a list or as cards (`variant`), and Switch takes a light or an accent-water ground (`ground`).

**Sizes.** Box and circle 16, 18 and 20 (radius 4, 4 and 6 on the box, `--ds-radius-mark-sm` and `--ds-radius-mark`), tick 12, 12 and 14, dot 6, 8 and 9. Switch tracks are 28 × 16, 36 × 20 and 44 × 24 with thumbs of 12, 16 and 20. md is the default, matching 14px labels and the 44 field. Every row is at least 24 tall, and 32 under a coarse pointer, so a finger can hit the label as well as the mark.

**States.**
- *Checkbox:* unchecked, hover (the line darkens to #64748b and the box takes slate 50), checked (navy fill, white tick), checked hover (#0c1e42), indeterminate (navy with a bar, `aria-checked="mixed"`), focus-visible (the accent ring 2px off the box), pressed (0.92), disabled (the row at 40%), invalid (the danger line), invalid checked (the checked navy kept, since a ticked box is never the wrong one, so the group's message carries the error), read-only (the sunken box with the field line, a checked fill of the muted #64748b at 4.75:1, still focusable).
- *Radio:* unchecked, hover, checked (navy line, white centre, navy dot), focus-visible, pressed, disabled, invalid, read-only (the sunken circle, and checked a #64748b line and dot). The white centre is deliberate: a filled circle would read as a checkbox at a glance.
- *Switch:* off (the field line grey), on (navy), hover (#64748b off, #0c1e42 on), focus-visible, pressed, disabled, loading (a spinner in the thumb, `aria-busy`, the old position held), read-only (off, a sunken track drawn by a 1.5px field line #848fa1 at 3.26:1, on, a track filled the muted #64748b at 4.75:1, so the two differ by shape as well as fill, and over the water white at 15% off and 50% on), and on blue.

**On the accent water.** Off is a track of white at 25%, on is a white track with a navy thumb, and the ring is white. White marks on, for the reason in the accent rule (chapter 8), and the navy thumb keeps the on state from reading as an empty white bar.

**Groups.** Checkboxes and radios that answer one question sit in a `ChoiceGroup`: a fieldset, a legend that asks the question, an optional helper and one error under the set. The error belongs to the set because the answer is the set ("Pick at least one job."), and the group hands its helper and error ids to every control in it. Lists stack at a 12px gap. A horizontal radio row runs at a 24px gap and stacks under 480, before a label wraps.

**Card radios.** When each choice needs a sentence, a radio card is white with the hairline, radius 28 and 24px in, the radio at its top right 16px in, a 20px Outfit title and a 14px muted line. The whole card is the target. Selected draws a 2px navy line as a 1px border plus a 1px inset, so the card never shifts by a pixel. Cards run three across from 640 and stack under it.

**Props.** Checkbox: `label`, `description`, `hideLabel`, `checked`, `defaultChecked`, `indeterminate`, `onChange`, `size`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `value`, `aria-describedby`, `forceState`. Radio and RadioGroup: `legend`, `options`, `value`, `defaultValue`, `onChange`, `name`, `size`, `orientation`, `variant` ("list" or "card"), `helper`, `error`, `disabled`, `readOnly`. Switch: `label` or `aria-label`, `description`, `checked`, `defaultChecked`, `onChange`, `size`, `disabled`, `readOnly`, `loading`, `icons`, `ground`, `labelPosition`, `forceState`.

**Motion.** Fills and lines change over 200ms. The tick draws itself over 160ms on the ease. The radio dot and the switch thumb move on the thumb spring (500 / 40), the same one as the site's Human / AI toggle (ModeToggle.tsx:50), so every two-position control on the page settles alike. A pressed switch widens its thumb 4px toward the travel. Under reduced motion the tick, dot and thumb arrive at once.

**Accessibility.** Each control is labelled by its visible label. Read-only marks keep focus and say so (`aria-readonly`), because a disabled control drops out of the tab order and a reader then cannot find out what was chosen. A loading switch keeps its name and its old state until the save lands, so it never announces a setting that did not happen.

**Responsive.** Rows grow to 32 under a coarse pointer. The radio row stacks under 480 and the card row under 640. Nothing else changes with width.

**Switch or checkbox.** A switch acts now. A checkbox waits for a submit. Put a switch inside a form with a submit button and the reader cannot tell whether flipping it saved anything, so forms use checkboxes and settings pages use switches.

**Do / Don't.**
- Do write checkbox labels as the thing chosen, not as a question.
- Do put the error under the group, not under each box.
- Do keep radio sets to about five. Past that, use a Select.
- Don't fill a checked mark with the accent.
- Don't use a switch for a choice that waits for a submit.
- Don't make a disabled control the only place a chosen value shows.
