### Surfaces

**Purpose.** A surface is the ground a section stands on. The site has six, and this chapter gives each one its job. Outside the players, what a section groups takes the hero container look (light grey, rounded, a faint hairline, navy type). The accent's place is the accent rule, chapter 8.

**The six surfaces and their jobs.**

| Surface | Token | Job |
| --- | --- | --- |
| Page | `--ds-color-page` `#f9fafb` | The ground of the light page, and under the grain from Understands to the foot. |
| White card | `--ds-color-surface` | A thing the visitor reads or uses: job cards, FAQ rows, the tab rail, fields. |
| Container | `--ds-color-container` `#f5f6f8` | A set piece or a grouped block: the hero. The ChatGPT side of the comparison keeps the earlier grey `#e3e5e8` (`--ds-color-container-deep`). |
| Navy | `--ds-color-primary` `#0a152d` | The one card a view leans on (the 6labs side) and the primary fill. |
| Terminal | `--ds-color-terminal-bg` `#0b1526` | The agent's window inside a job card, and only there. |
| Accent water | `--ds-color-accent` with 7% grain | The players section. Drawn by AccentWave, never by a section. |

**The container look.** The grey `#f5f6f8`, a 1px hairline in `--ds-color-line-faint` and navy type, with the radius set by the block's size: 48 (32 under md) for the hero's container, and 36 (28 under md) for a card-sized block, the index card, and the ChatGPT card, which takes the same shape on the earlier grey `#e3e5e8`. The empty state takes 36 at every width, because it sizes from its own box rather than the window. The container shadow `0 40px 100px -20px rgba(0,0,0,0.03)` goes only on a block that stands alone on the page, the hero's container and the index card, and it is almost nothing on purpose: it lifts the box off the page by a breath without reading as a card. The ChatGPT card and the empty state sit flat. Type on it is navy, and the muted slate steps up to the body slate `#475569`, because `#64748b` loses contrast on the grey. Today the look is written inline in Hero.tsx:125 and in the comparison card. New work reads it from the tokens.

**How a new section picks its surface.** It stands on the page (or the grain, if it comes after the players). If it is a set piece that groups its content, it takes the container look. If it holds things to read or press, they are white cards on that ground. Navy is for one emphasised card at most per view. A section never invents a seventh ground.

#### Reasons

- **Grey groups, white holds.** The container's grey says "these belong together" without a heavy border. White on grey then reads as the thing inside, which is why fields and cards on the container sit in white rather than straight on the grey.
- **Each ground is a section boundary.** Because a section keeps its ground, a change of ground tells the visitor a new section has started without a divider.

#### Do / Don't

- Do give a set piece the container look, and put what it holds in white.
- Don't put a field straight on the container grey.
- Don't add a ground. If none of the six fits, the section is doing two jobs.
