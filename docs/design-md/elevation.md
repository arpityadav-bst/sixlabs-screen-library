### Stroke and elevation

Light grounds on 6labs are separated by lines, not by depth. A hairline draws every card, row and control at rest, and a shadow appears only under something that sits above the page. Every shadow but one is drawn in the ink navy.

#### Values

Lines, by ground: on white and the page, the hairline (`--ds-color-line`) draws card, row and control edges at rest, the strong line hover and open edges, the hover line an outlined button under the pointer, and the field line a field or checkbox edge. On the tinted grounds, ink at 8% draws the hero foot and footer tail rules. The faint hairline is the container look's own edge, and white at 6% the terminal bar's foot. Every value is in Lines (3.7), and the widths, 1px for every border with one width per other job, in Stroke (3.21).

Elevation, lowest to highest, every value in Elevation and glow (3.22):

| Level | Token | Where |
| --- | --- | --- |
| none | | comparison, job and FAQ cards, the terminal |
| thumb | `--ds-shadow-thumb` | the mode toggle's and the segmented control's thumb |
| tooltip | `--ds-shadow-tooltip` | tooltip bubbles |
| float | `--ds-shadow-float` | BackToTop, elevated icon buttons, toasts |
| lift | `--ds-shadow-lift` | a clickable card on hover |
| pop | `--ds-shadow-pop` | menus and select panels |
| modal | `--ds-shadow-modal` | dialogs and sheets |
| player, player selected | `--ds-shadow-player`, `--ds-shadow-player-selected` | the player cards, on the accent only |

The container shadow (`--ds-shadow-container`) is not a level. It is a breath under the hero's container and the index card, black at 3% with a 100px blur, so faint it lifts the block without putting it above anything, and it stays out of the ladder for that reason. Glows are separate from elevation too: the caret's glow and the sheen's bloom are light, not height.

#### Use for

- **A hairline** on every light surface at rest. The strong line marks a surface the pointer is on or that is open.
- **The field line** for any edge that is the only sign of a control, because it is the one grey that meets the 3:1 a control's boundary needs (WCAG 1.4.11).
- **A shadow** for a part that floats: fixed buttons, menus, tooltips, toasts, dialogs, and a card lifting under the pointer.
- **Navy ink in every new shadow**, `rgba(10,27,51,x)`, with a negative spread so the shade sits under the part rather than round it.

#### Never for

- A shadow on a card that rests in the flow of a light section.
- Borders thicker than 1px for emphasis. A heavier line has one job each (the sheen, a ring, a dot), and emphasis comes from the strong line colour.
- Black shadows in new work.
- A glow as depth, or the sheen bloom as a CSS `filter: drop-shadow`. The bloom is listed as a value so nothing copies the filter the site uses today.

#### Reasons

- **Lines for structure, shadows for height.** If cards in the flow carried shadows, a shadow would no longer say that something floats, and a menu over the page would look like one more card. Keeping light sections flat leaves depth free to mean one thing.
- **Navy, not black.** The page is near-white and its type is navy. A black shadow on that ground mixes to a cold grey that matches nothing else on the page, while a navy shadow is a darker step of the colours already there. The hero container's black shadow is so faint (3%) that its hue does not show, which is why it stays.
- **Height grows with distance.** The blur grows level by level, from the thumb resting on its rail to a dialog over everything, so the shadow alone tells the order of the stack.
- **The field line is the exception in strength.** Every other line can be faint because the surface it edges also differs in fill or content. A text field is often white on white, and its border is all that marks it.
- **Glows are light.** The caret and the sheen show the accent catching light, which the page uses for attention. Putting them on the elevation ladder would read light as height.

#### Gaps

- The sheen's bloom is drawn with `filter: drop-shadow` and its outline with a CSS mask (globals.css), both of which the compositor rule forbids in new work. Redrawing it with background layers is decision 9 in Decisions pending (10.3).
- The site has three spellings of the strong hairline (slate-300, slate-300 at 80% and `#b7c0cb`) and three alphas of the rest hairline (80, 70 and 50%), for overlapping jobs.
