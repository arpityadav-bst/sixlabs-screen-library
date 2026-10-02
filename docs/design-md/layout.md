### Layout and breakpoints

Every section on 6labs sits in the same box: a page gutter on `main`, a 1400px container centred inside it, and an inner gutter inside the container. Text inside the box is capped by a measure. Widths change at Tailwind's breakpoints, except in the full-view hero, which keeps the ladder it was built on.

#### Values

The parts of the box are the container (written by hand as `max-w-[1400px]` in each section), the full view's wider copy grid, the page gutter on `main`, each section's inner gutter, the text measures and the header's height. Every value, with its token and source, is Layout (3.18), and the widths are Breakpoints (3.19).

Breakpoints for new work are Tailwind's: sm 640, md 768, lg 1024, xl 1280. Inside a part, three named component widths may also be used, 400, 480 and 560, where a row of actions, choices or a banner's copy stops fitting a phone (ButtonGroup and EmptyState's actions stack under 400, a horizontal radio row and a banner's actions wrap under 480, EmptyState's padding drops under 560). A part that answers its own box rather than the window, as EmptyState does, steps on a container query at those widths instead of a media query. The full-view hero's ladder is 561, 901, 1280, 1600, 1920 and 2560. Responsive ladder (9.6) gives the reasons for both. One narrow edge at 380 tightens the jobs tabs. Two media gates sit beside the widths: a short screen (`min-width: 1280px` and `max-height: 720px`) caps the full headline, and a fine pointer (`hover: hover` and `pointer: fine`) is required before a part shows a hover-only hint.

The z-scale lives in Layer stack (5.1).

#### Use for

- **md as the main split.** Phone to tablet is where gutters, type steps and rhythm change. lg is where layouts change shape (the players' two columns), and xl is for wide grids (the three jobs cards).
- **A measure on every block of text** wider than a card: 520 for a subline, 680 for an answer, 440 for a lede beside a visual.
- **The header tokens** for anything that starts under the fixed bar, as `calc(var(--ds-header-h) + <gap>)`.
- **Full bleed** only for a ground (the accent water, the grain band), never for text.

#### Never for

- A custom width (`min-[901px]`) outside the full-view hero and the three named component widths.
- `min-[1280px]` in new work. It is `xl` written a second way.
- A hard-coded header offset. The site has three today (70 and 73 for the same phone bar, 89 for a bar about 80 tall), and none of them agree with the bar.
- Text that runs to the container's edge on a phone, or past 980 anywhere.

#### Reasons

- **One box, one edge.** When every section shares the container and both gutters, the first letter of every heading falls on one vertical line from the header to the footer. The eye uses that line to scan down the page, and a section that leaves it reads as an interruption.
- **The page gutter and the inner gutter do different jobs.** The page gutter keeps content clear of the screen's physical edge on every width. The inner gutter is the section's own margin and widens from md, where there is room for the copy to stand clear of the container's edge.
- **Measures keep lines trackable.** The longer the line, the harder the return trip to the start of the next one. Each measure is set against its type size, so lines hold about 45 to 90 characters where the full container would hold 170 at body size.
- **The header is a token, not a number.** The bar's height comes from its padding and the Sign in button inside it, so it changes when either does. An offset written as a number stays behind when the bar moves.

#### Gaps

- The players section takes a 20px side padding on phones where every other section takes 16 (Players.tsx), so its copy sits 4px in from the line above it.
- The hero row takes `max-md:px-2` (8px) inside the page gutter where every other row takes 16 (Hero.tsx).
