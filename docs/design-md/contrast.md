### Contrast

Contrast on 6labs is computed, never claimed. The guide works every ratio out from the token values with the WCAG 2 relative-luminance formula, composites any alpha over its ground first, and rounds down, so a pair never reads as passing when it does not. This chapter records what the grades mean for the system and the rules that follow.

#### Values

The bars are WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold) and 3:1 for a line or icon a reader needs to see (1.4.11). The guide also marks AAA at 7:1.

The readings that set the rules, rounded down:

| Pair | Ratio |
| --- | --- |
| Body `#475569` on the container `#f5f6f8` | 7.00 |
| Muted `#64748b` on the container | 4.40 |
| Muted on white | 4.75 |
| Quiet slate-400 on white | 2.63 |
| Accent `#1a6dff` on the page | 4.29 |
| Accent on white | 4.49 |
| Accent on the container | 4.15 |
| White on the accent | 4.49 |
| White 80% on the accent | 3.42 |
| Field line `#848fa1` on white | 3.26 |
| Card hairline on white | 1.18 |
| Ink `#0a1b33` against primary `#0a152d` | 1.05 |

#### Use for

- Copy a reader must read sits on a pair that clears 4.5:1 at its size.
- Large type, 24px and up or 18.66px bold and up, may use a pair from 3:1.
- Field edges, focus rings and meaningful icons clear 3:1 against their ground.

#### Never for

- Muted on the container, where body takes its place.
- The accent on small copy on any light ground. It marks display words, icons, dots, links on hover and the focus ring.
- Small copy on the accent blue, in any white. Text there is large. The system parts that still set small white labels on the water are open, decision 2 in Decisions pending (10.3).
- Quiet slate-400 for anything a reader must read on a light ground.
- The card hairline as the only edge of a field.

#### Reasons

**The container moves the line.** The hero container is a step darker than white, and the drop is enough to push muted from 4.75 to 4.40, under the bar. A text colour is chosen for the ground it lands on, which is why the matrix grades every pair rather than every colour once.

**The accent is a display colour.** At 4.29:1 on the page and 4.49:1 on white, it misses the text bar by a hair and clears the large-text bar, which suits a word in a heading and nothing smaller. The site uses it for small copy in two places today, "Yours next." on the container and the player card's "Running", and the guide lists both with their file and line.

**The blue takes large type.** White itself is 4.49:1 on the accent. Headings on the accent water are therefore white and large. The player body, white at 80% in 16 to 18px regular type, falls short of that, and the guide lists it as a shortfall to fix rather than a pattern to copy.

**Non-text needs 3:1 too.** A field edge a visitor has to find is held to 3:1, which the hairline does not reach. That is why the field line exists. A hairline round a card needs no such bar, because the content inside it already marks the edge.

**Shipped pairs under the line.** Besides the accent and player body cases, the player card's "Model 01" meta in quiet slate-400 is 2.63:1 on white, and the terminal's prompt and labels in Tailwind v4 slate-500 are 3.83:1 on its body at 12.5px. The full view's "Loading" label is the same slate-500 at 11px on the hero grey, 4.40:1, the muted-on-container pair this chapter rules out. The comparison's vs is ink at 30% on its white disc, 1.93:1, and stays there because the word is incidental: the paired cards already say versus, so it falls under the decorative exemption of 1.4.3. The system parts made for the water set their labels in full white at 12 to 15px, 4.49:1, a hair under the bar: the glass Button, the on-blue Chip, Segmented's segments, the Switch's label and the label rows of Slider and Progress on blue. They are open, decision 2 in Decisions pending (10.3), and Known gaps (10.2) lists them. The on-blue Badge, white on its 15% glass, is lower still, as Badge, status dot, tag (7.14) records.

**Pending: an accent ink for small text.** A darker accent, `#1559d6`, reaches 5.85:1 on the page, 6.11 on white and 5.65 on the container, enough for small accent copy on every light ground. It is decision 1 in Decisions pending (10.3), and new work keeps small copy out of the accent meanwhile.

**How to change a colour safely.** Change the token, then read the matrix and the swatch cards. Every grade in the guide recomputes from the new value, so a change that breaks a pair shows as a fail where that pair lives.
