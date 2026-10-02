### Radius

Corners on 6labs grow with the surface. A row is barely rounded, a card is soft, the hero container is the roundest box on the page, and anything a finger presses is a pill. The ladder below covers every corner the site draws, under one name per value, and adds the small-mark steps the system needs for marks and focus wraps under 12.

#### Values

Every step, with its token, its surfaces, its misuse and the source line it mirrors, is Radius (3.20), generated from the tokens. This chapter gives the rules that pick a step.

#### Use for

- **36 for a card-sized block in the container look:** the comparison cards and the index card from md, and the empty state at every width.
- **Step down on phones.** A large surface takes one step less under md (cards 28 to 24, the comparison and index cards 36 to 28, the container 48 to 32), because the same radius on a narrow box eats a larger share of its width. A part that sizes from its own box, as the empty state does, keeps its radius and steps its padding instead.
- **Nesting.** An inner corner is the outer radius less the padding between them, rounded to the nearest step: the 16 language panel at 6 padding holds 12 rows. When the padding is as large as the outer radius, the inner corner can go square.
- **The pill** for anything pressed or toggled, so a control never reads as a card.
- **The 14 row** only for list rows that open (the FAQ), which need to read as a stack of rows rather than a stack of cards.
- **A small-mark step** (2, 4, 6 or 8) for a mark, a bubble or a focus wrap under 24px, where the 12 step would round a 16 box or a ring hugging a word into a near circle. These steps are system additions, with no site value to mirror.
- **The model square** at 28% of its size, a share rather than a step, so a player model reads as the same shape from a 20 avatar to a 96 one.

#### Never for

- A radius off the ladder, the small-mark steps included. 22 appears once in the site (player cards below lg) and never renders, because that grid is hidden there, so the compact card that takes that size snaps it to 24.
- A small-mark step on a surface. A card, a row or a panel takes 12 or more.
- The same radius inside and outside a padded surface.
- A pill on a surface that holds more than one line of content.
- Two spellings of one value in new code. The site writes 16 as `rounded-[16px]` (terminal) and `rounded-2xl` (language panel), and 12 as `rounded-[12px]` (tag panel) and `rounded-xl` (language rows). New work writes the token.

#### Reasons

- **Radius says size and layer.** A rounder corner reads as a larger, outer surface. Keeping the ladder in step with surface size lets a reader tell a row from the card that holds it and the card from the container without a border or a shadow.
- **Concentric corners.** Two curves drawn round the same centre keep an even band between them. If the inner corner keeps the outer radius, the two curves no longer share a centre and the band swells to about 1.4 times the padding at each corner, which reads as a mistake in the padding.
- **Pills for action.** The site's controls are all fully round and its surfaces never are, so shape alone separates something to press from something to read.
