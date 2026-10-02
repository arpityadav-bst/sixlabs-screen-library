### Spacing and rhythm

Spacing on 6labs is Tailwind 4's 4px scale, used as the site already uses it. The system names each step by its Tailwind step (`--ds-space-2-5` is `p-2.5`, 10px), and the guide counts how often the site writes each one, straight from the source, so the scale stays a description of the site rather than a wish.

#### Values

Every step, with its token, is Spacing (3.17), and the guide counts how often the site writes each one. The steps fall in three ranges: the half and small steps up to 14 inside controls, 16 to 40 inside cards and blocks, and 48 and up between blocks.

Rhythm inside a block, top to bottom:

- Section heading to subline: 16 (`--ds-space-4`, `mt-4`). Hero and closing headline to their line: 20 (`--ds-space-5`, `mt-5`).
- Copy to the call to action: 32, and 24 under md.
- Call to action to the line of social proof: 32, and 24 under md.
- Section to section: the top padding scales with the window, from 96 to 144 (`clamp(96px, 9vw, 144px)` on the jobs section), so sections never crowd on a laptop or float apart on a wide screen.

Padding by surface, smallest to largest: 6 inside a menu panel, 10 by 12 on its rows, 14 by 16 in the tag panel, 16 in the terminal, 20 by 24 on an FAQ row, 24 in a player or job card (28 on the job card's top), 28 then 36 in a comparison card.

#### Use for

- **4 below 32, 8 above.** New work takes any step of 4 up to 32, and steps of 8 above it. 36 (`--ds-space-9`) is the one step the site writes off that grid, the comparison card's padding from md, and it stays with that card. The half steps (2, 6, 10 and 14) are for the inside of controls, where a jump of 4 is too coarse. A gap between two controls is 12, a grid of small cards takes a 16 gutter and a grid of wide ones 24, a card's padding is 24.
- **Growing gaps.** Inside a block, each gap is at least as large as the one before it: heading to line, line to action, action to proof.
- **Optical fits in the parts, not the gaps.** When a pairing looks off by a pixel (a tight title over its body), fix the leading of the type, then keep the gap on the scale.

#### Never for

- Arbitrary pixel values (`mt-[13px]`) in new work.
- One gap repeated through a whole block. It flattens the order of reading.
- Spacing on 2 above 16, or on 4 above 32. Both read as noise at those sizes.

#### Reasons

- **A shared grid lines up for free.** When every gap is a step of the same base, two blocks built months apart still share edges and baselines. Off-grid values break that silently, one pixel at a time.
- **Coarser steps as gaps grow.** The eye resolves a 4px difference between two 12px gaps, but not between 36 and 40. Above 32 only steps of 8 are far enough apart to read as a decision.
- **Rhythm is the reading order.** A block tells the visitor what goes together by how close it sits. Close spacing groups the copy into one message, and the jump before the button marks the change from reading to doing.
- **Padding follows the surface.** A row is scanned many at a time, so it stays dense. A card is read alone, so its copy needs distance from the edge to read as content rather than border.

#### Off the grid

The guide lists every arbitrary spacing value in the site with its file and line: 3, 3.5, 7, 9, 11, 13, 18, 22, 26, 34 and 60px today. Most arrived with the sections that follow the onBlue creators pages (the footer, the closing call, the jobs cards, the terminal and the full-view hero), where they matched that page's own type. The slim mode toggle's 7 keeps it 2px shorter than the full toggle. When a section is next touched, each value folds to its nearest step, and the list in the guide shrinks to show it.
