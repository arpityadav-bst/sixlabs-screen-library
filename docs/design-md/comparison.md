### Comparison cards

**Purpose.** The page's one direct argument with a rival: ChatGPT on the left, 6labs on the right, joined by a vs. It ships as one component, Understands, with its copy written in the file. It is a composition, not a reusable card, so the guide shows it once as it ships, and Card (7.11) covers cards in general.

**Anatomy.** Two cards on a two-column grid from md, 24px apart. Each card opens with its maker's lockup, the card's heading: a 44px mark (36 on a phone) and the name in Outfit 34 at 1.1 (26 on a phone), 12px apart. Then come two lines of body text in Inter 18 at 1.5 (16 on a phone) at 400, the first 24 under the lockup and the second 12 under the first. Each line is set whole in its card's one ink, navy on the grey and white on the navy: the verbs are the same kind on both sides and the rest differs, so the pair reads as one claim answered twice. The vs is an 80px white disc (64 on a phone) with the word in Outfit 34 (27 on a phone) at ink 30%, lifted 0.07em into the disc's optical middle because the lower-case word has no ascenders, set over the gutter at the cards' middle.

**Variants.** None. It is one composition, shown once as it ships.

**Sizes.** One, with its phone steps under Responsive.

**The subgrid.** From md each card spans the grid's three rows as a subgrid. That keeps each line level with its counterpart whatever its length, so the pair reads across, row by row, the way a comparison is meant to be read. Without the subgrid a longer line on one side pushes everything below it down, and the rows drift out of step.

**Two grounds, one weight.** ChatGPT's card wears the hero container's look (the grey, a faint hairline, navy type, no shadow) and 6labs' wears the primary navy with white type, so the two sides differ in ground at a glance. White on navy reads heavier than navy on grey, so the 6labs name sits a step lighter (400 against ChatGPT's 500) for the two to look the same weight. 6labs' card also takes 64px of left padding from md, to keep its copy clear of the vs.

**The vs depends on the page.** Its 6px ring is the page colour, `rgb(var(--page-rgb))`, which makes the disc read as cut into both cards. On any ground but the page that ring shows as a band of a different grey. Moving the section onto another surface means giving the ring that surface's colour.

**States.** None. The cards are not interactive, so after the entrance they have only their rest.

**Props.** None, its copy lives in `LINES` in Understands.tsx.

**Motion.** Each card rises 28px over 0.7s on the one ease when 40% of it is in view, once: the left card first, the right at 0.15s, the vs at 0.3s, so the argument is made in reading order.

**Accessibility.** The vs may sit as light as ink at 30% on white (1.93:1) because the word is incidental: the two cards side by side, each under its maker's lockup, already say versus, so the word carries nothing a reader must read, which is the decorative exemption of WCAG 1.4.3. It is also aria-hidden, which only keeps a screen reader from saying it, and is not the reason it may be light. The cards are not interactive and carry no focus. The names look like each card's heading but are spans, and the section has no heading, so heading navigation passes over it. An h3 per name under a visually hidden h2 fixes it without changing the look. Both lines are full ink: navy `#0a1b33` on the grey `#e3e5e8` at 13.66:1, and white on the navy `#0a152d` at 18.13:1.

**Responsive.** The stacked pair keeps the vs on its seam because that is still where the two sides meet. Radius and padding both drop from 36 to 28 there, so the cards keep the proportions of the phone's other cards, and the marks step from 44 to 36, the names from 34 to 26, the lines from 18 to 16, the disc from 80 to 64 and its word from 34 to 27.

**Open decision.** The owner's rule gives sections other than the players the container look with the accent on a word or two. This section has no accent word, and its 6labs card is a full primary navy fill. Navy is not the accent, but whether a full navy surface fits the rule is decision 5 in Decisions pending (10.3).

**Do / Don't.**
- Do give the two sides two grounds, so the eye takes a side before it reads.
- Do keep the rows level with a subgrid.
- Don't set the pair on a surface other than the page without recolouring the vs ring.
- Don't use two white cards for a comparison.
