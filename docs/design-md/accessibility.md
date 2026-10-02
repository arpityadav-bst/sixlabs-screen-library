### Accessibility baseline

The rules every part meets before it ships. Each component chapter ends with an Accessibility line that names what it adds to this baseline. Where the shipped site falls short today, Known gaps (10.2) lists it with its file and line, so this chapter stays a rule book rather than an audit.

#### Contrast

Text meets 4.5:1 on its ground and large text (24px, or 18.66px bold) 3:1. Lines that carry meaning (field borders, the focus ring, a checkbox edge) meet 3:1. The ratios per colour and ground are in Contrast (2.3).

#### Use of colour

Colour is never the only carrier of a state or a meaning (1.4.1). The status parts are the pattern: a status dot sits beside the words that name its state, a progress bar's value text says Complete or Failed at 60%, a chosen chip grows its check, an error comes with its icon and its message, and a link in running text keeps its underline. A reader who cannot tell the navy from the ink, or sees the screen in glare, still reads every state.

#### Focus

Every focusable part shows the ring from Focus (2.10) on `:focus-visible`, in the tone of its ground. A part never removes the browser's ring without drawing this one.

#### Targets

- *Values.* 24 × 24 at least (WCAG 2.2, 2.5.8), or a smaller target with 24px of clear space round its centre. 44 × 44 for a control a thumb reaches first on a phone (2.5.5).
- *Use for.* The smallest system controls are 28 (Button xs, IconButton xs, Chip sm), which clears 24 and suits dense desktop rows. A control that stands alone on a phone, opens a menu or closes a sheet takes 44 or more.
- *Never for.* A visual size taken as the hit size. A dot, a bar or a bare icon gets its target from padding round it, never from its drawn shape.
- *Reasons.* 24 is the floor below which a pointer misses on a first try. 44 is the pad of a thumb, which covers the control as it presses, so a smaller target leaves the visitor guessing where it landed.

#### Keyboard

Each pattern has one model, and one system part carries it, so a key means the same thing on every page:
- Button and link: Tab reaches them, Enter activates, Space presses a button.
- Toggle, checkbox, switch: Space flips the state, which is announced as pressed or checked.
- Radio group and segmented control: one Tab stop on the current choice, the arrows move and select. Tabs work the same way, with Home and End, and in manual mode Enter or Space selects.
- Listbox (Select): Enter, Space or Down opens, the arrows move, Enter picks, Escape closes, letters jump, and focus returns to the trigger.
- Combobox (SearchField): focus stays in the field while the arrows move through results, and Escape clears the query.
- Accordion: each header is a button. The arrows, Home and End move between headers.
- Dialog: focus moves in on open, Tab stays in the dialog (the browser's own controls aside), Escape closes, focus returns to the opener.
- Slider: the arrows step, Page Up and Down move a tenth, Home and End reach the ends.

Keys typed into a field (TextInput, TextArea, SearchField) and the keys Select, Slider and ChipGroup handle stop at the part and never reach the window, because the page's own shortcuts (the tile floor resets on R) must not fire from inside a field.

#### Semantics

- A bar that reports a value is a `meter` or a `progressbar` with its min, max, now and a spoken value, never a bare div.
- A visual that plays by itself (the terminal, the floor, a hologram) is `aria-hidden`, and one visually hidden sentence says what it shows, so a screen reader hears the point without the frames.
- `aria-live` is for what the visitor caused: a toast after their action, a result count after they type. Ambient loops, typed words and counters never announce, because a region that talks on its own drowns out the page.
- A working control keeps its name and sets `aria-busy`. Its spinner is decorative.
- Headings follow the page outline, one `h1` per page, with no level skipped for the sake of size.

#### Reflow, zoom and text spacing

- *Reflow.* At 320 CSS px wide, a 1280 window at 400% zoom, every page reads in one column with no sideways scroll of the page (1.4.10). A part that needs two dimensions to mean anything (the tile floor, a wide table) scrolls inside its own box. The guide's narrowest frame is 375, so 320 is checked by zooming a real window.
- *Text resize.* Text reaches 200% through the browser's zoom with nothing cut off (1.4.4). The type scale is written in px, which zoom enlarges but a reader's default font size setting does not, so zoom is the route the system supports. That is why nothing that holds text has a fixed height: a line that grows wraps instead of clipping.
- *Text spacing.* A part keeps its content when a reader sets line height to 1.5, paragraph spacing to 2em, letter spacing to 0.12em and word spacing to 0.16em (1.4.12), so a box that holds text never clips its overflow.

#### Language of parts

The document declares English on `html`, and a passage in another language carries its own `lang`, so a screen reader switches its voice for it (3.1.2). The LanguageMenu's rows, each language written in its own script, are the case the page has today, and they carry no `lang`, a gap Known gaps (10.2) lists.

#### Motion

Under `prefers-reduced-motion` loops stop and travel goes, while every state change still happens and a busy spinner still turns, slower. Reduced motion (4.6) has the rule and the table.

#### Forced colours

In Windows High Contrast the system replaces every colour and drops fills, so anything a fill alone carries would vanish. Rings switch to `Highlight`. Every control keeps a real edge: a 1px border (transparent at rest on the variants that show none), or, on a part with no border of its own, a line drawn for forced colours, as the Switch track draws `CanvasText` and the tab list its hairline. A chosen state that a fill carries opts out of the system colours and fills `Highlight` instead: a pressed toggle button, a switch that is on, the Segmented thumb, the tab indicator and the radio's dot. Ticks and icons follow `currentColor`, so they take the system's text colour.

#### Do / Don't

- Do give a small control its target through padding.
- Do name an icon-only control on the control itself.
- Don't announce what the visitor did not ask for.
- Don't let a part's shortcut reach the window.
