### Spinner and skeleton

**Purpose.** Two ways to wait, chosen by what is coming. A spinner says "working" where the result has no shape yet: a control that sent something, a step in the terminal run. A skeleton says "this is on its way" where the result has a known shape: a card, a row, a profile. The site hand-rolls two spinners today (the wave button's 16px ring at HeroBits.tsx:114 and the terminal's 8px ring at JobTerminal.tsx:216) and no skeleton. The system Spinner replaces both rings with one part, and the Skeleton fills the gap. The brand loader, HeroLoader, is neither: it is the page's own load-in and belongs to Load-in, autoplay and loaders (5.6), never to a control or a card.

**When to use which.** A wait inside a control is a spinner, in place of the label, so the control keeps its size and stays the one thing that changed. A wait for a region of content is a skeleton of that content, so the layout settles once and the eye already knows where to look. A wait for the whole page is the brand loader. A wait longer than a few seconds needs words as well (a status line, a progress bar), because a ring that turns for ten seconds stops meaning anything.

**Anatomy.** Spinner: a circle with a currentColor border and a transparent top, plus a hidden "Loading" when it stands alone. Skeleton: a filled block in the shape and size of what it replaces, with a band of light crossing it. A composite is several shapes laid out like the real part, line for line.

**Variants.** Spinner tones: inherit takes the text colour, so a ring in a navy button is white and a ring in ink text is ink. Quiet is slate 400, for a ring under a caption. On dark is white at 80%, for navy and the terminal. Skeleton shapes: line, title, circle and rect, and a ground of light (white and the page) or container (the hero grey, where the fill turns to white at 55% because the slate fill would vanish).

**Sizes.** Spinner 8, 12, 16, 20 and 24, with borders 1, 1.5, 1.75, 2 and 2, so the stroke reads at about the same weight at every size. 8 sits inline with mono terminal text, 12 and 16 in xs to md controls, 20 in lg and xl controls and fields, 24 alone in a section. Skeleton line is 12 tall for 14 to 15px text, title 22 at 60% width, circle 40, rect 120 at the panel radius 16. A composite overrides height and radius to match its content (the job card's terminal block is 300 tall at 16).

**States.** Spinner: waiting (its first 300ms, drawn at opacity 0), spinning, and slowed under reduced motion. Skeleton: shimmering, still under reduced motion, and gone once the content lands. Neither is interactive, so neither has hover, focus or pressed.

**Props.** Spinner: `size`, `tone`, `delay` (300 by default, 0 for a control that is already busy), `label`, `decorative`. Skeleton: `shape`, `width`, `height`, `radius`, `lines`, `ground`. SkeletonGroup: `label` and the composite as children.

**Motion.** The ring turns at 1s a turn, linear, as the site's rings do. The 300ms delay is the reason a fast response never shows a ring at all: the eye reads a flash shorter than that as a glitch. The shimmer is a 40% band moved by transform from -100% to 250% over 1.6s, so it stays on the compositor (an animated background position would repaint every frame). Content replaces a skeleton with a 300ms fade.

**Reduced motion.** The ring keeps turning at 1.5s a turn rather than stopping, because a stopped ring reads as a finished one and the motion here carries the status. The shimmer stops and the fill stays, because the shimmer only decorates.

**Accessibility.** A standalone spinner is a polite status with a hidden label, so a screen reader hears "Loading" once. Inside a busy control it is decorative and the control carries aria-busy, so the status is announced on the thing that is busy. Skeleton shapes are aria-hidden, and their group is aria-busy with a hidden label, so a screen reader hears that the region is loading rather than a run of empty shapes. When the content arrives, the group drops aria-busy and the content is read as normal.

**Responsive.** Neither changes with the viewport. A composite follows its part: a job card skeleton takes the card's own phone radius and padding because it is built inside the same Card.

**No layout shift.** A skeleton is only worth its cost if the swap moves nothing. Each skeleton line sits in a box the height of the text line it stands for (a 12px bar in a 19.6px box for 14px text at 1.4), so the composite and the content measure the same. Where the content's height is truly unknown (a free-length answer), reserve the expected height and let it grow below the fold rather than above it.

**Do / Don't.**
- Do build a skeleton from the real part's layout, so the swap moves nothing.
- Do put the spinner inside the busy control, never beside it.
- Do keep the 300ms delay unless the control has already changed state.
- Don't show a lone spinner in a large empty box, which tells the visitor nothing about what is coming.
- Don't run a skeleton shimmer under reduced motion, or pulse it instead.
- Don't use the brand loader for anything smaller than the page.
