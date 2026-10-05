### Type

Type on 6labs is three faces and a set of named roles. A part never picks a size, weight and tracking one by one: it takes a role, and the role carries all its values (face, size, leading, tracking, weight, case and figures) with their breakpoint steps. The roles mirror the classes the site writes today, and the guide asserts each one against its file, so a role that drifts from the site shows red there before it misleads anyone here.

#### Values

| Family | Token | Weights set | Job |
| --- | --- | --- | --- |
| Outfit | `--ds-font-display` | 400, 500, 600 | display lines, names, numbers, the wordmark |
| Inter | `--ds-font-sans` | 400, 500, 600 | reading text, labels, controls |
| JetBrains Mono | `--ds-font-mono` | 400, 500 | machine text: the terminal, card meta and code at 400, badge labels at 500 |

Roles come in three kinds, display in Outfit, text in Inter and mono, and each prints `--ds-type-<role>-family`, `-size`, `-leading`, `-tracking`, `-weight`, `-case` and `-numeric`, so a caps or tabular role keeps its caps and its figures. The full list, with every value and step, is Type roles (3.31).

The scale for new work is Type scale (3.16), from 11 to 56, plus the two display clamps, `clamp(38px, 5.2vw, 74px)` for a closing line and `clamp(84px, 19vw, 300px)` for the footer word.

Settings by kind:

- *Tracking.* Display runs from -0.02em at 16 to -0.055em at the footer word, tighter as it grows. Text sits at 0 to -0.02em, the tightest being the footer's column heads (`footer-head`). Capitals at 11px open to 0.14em (mono) and 0.18em (sans).
- *Leading.* One- and two-line display sits at 1.05 to 1.1. A display line that wraps as a statement (the scroll line) opens to 1.3. Reading text runs 1.4 to 1.65, the most open being the footer's intro (`footer-intro`).
- *Weights.* 500 for display and emphasis, and for badge labels in mono. 400 for reading, and for the vs and the 6labs name on navy, which sits a step lighter so white on navy matches ChatGPT's 500 on grey. 600 only for the footer word, the footer's column heads (`footer-head`), the code tag and a badge's count.

#### Use for

- **A role first.** New work names the role it plays (a section heading is `h2`, a card's line is `body-s`) and inherits every value. A step from the scale is for a new kind of line no role covers, and that line becomes a role once it ships twice.
- **Outfit** for anything the eye should land on before it reads: headings, names, numbers, questions, menu rows.
- **Inter** for anything read through: ledes, sublines, answers, labels, buttons.
- **JetBrains Mono** for what the model or a machine says: terminal output, model numbers and status, badge labels. A badge's count is a number to read, so it is Inter with tabular figures.
- **The accent on a word** for emphasis inside a heading, never a heavier weight.

#### Never for

- Outfit in a paragraph, or Inter in a display line above 24px.
- Mono for prose, labels or anything a person says.
- Sizes between steps in new work. The terminal's 12.5 and 11.5, the 13.5 of the large caption and the footer head, the full lede's 16.5, the vs word's 27 on a phone and the full hero's own ladder stay with the roles that own them and go no further.
- The `font-mono` utility. In this project it is Tailwind's system mono, so text written with it renders in Menlo or Consolas rather than JetBrains Mono. Write `--ds-font-mono`, or `font-[family-name:var(--font-jbmono)]` in site code.
- Weight 700. It is loaded and never set, and bold reads as shouting next to the 500 the headings use.

#### Reasons

- **Three faces, three kinds of line.** A reader sorts a page by its faces before reading a word. Keeping each face to one kind of line lets the change of face do the work of a divider: where Outfit stops, reading starts, and mono always means output.
- **Display runs tight.** A face's default spacing is drawn for text sizes. At 30px and above those gaps grow with the glyphs until the space inside a word competes with the space between words, so tracking tightens as size grows.
- **Short display leading, open reading leading.** A headline is one or two lines read as one unit, and loose leading splits it into two statements. A paragraph is many lines read in sequence, and the eye needs the extra air to find the start of the next line.
- **Wide caps.** Capitals have no ascenders or descenders to separate them, so at 11px they need added space or the word reads as one block.
- **A closed scale.** Two sizes a pixel apart (13 and 13.5) look like a mistake rather than a choice. A closed list of steps keeps every pair of sizes on a page clearly different.
- **Clamps follow the window.** The closing line and the footer word scale with `vw`, so their size depends on the window, not the column they sit in. That is why the guide measures them in a frame at true widths.
- **The full hero keeps its own ladder.** Its headline and lede step at 561, 901, 1280, 1600, 1920 and 2560, the ladder the onBlue creators hero was tuned on, for the reason in Responsive ladder (9.6). The ladder for new work is in Layout and breakpoints (2.6).

#### Gaps

- Player card meta uses `font-mono` (Players.tsx), so it renders in the system mono while the terminal renders in JetBrains Mono. Mapping `--font-mono` to `var(--font-jbmono)` in the site's `@theme` fixes both at once, decision 8 in Decisions pending (10.3).
- Inter 700 is loaded in `app/layout.tsx` and never set, a font file on every visit for nothing. JetBrains Mono 500 is loaded and set only by the system Badge, which the site does not ship yet.
- The player cards' `max-lg` sizes never render, because the card grid is hidden below lg. They are not roles.
