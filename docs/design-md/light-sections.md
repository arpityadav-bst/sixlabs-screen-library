### Light sections

**Purpose.** The four sections after the players, on the grained light page: the comparison (Understands), the three jobs, the questions (FAQ) and the closing call. They argue the case the hero and the players set up, then ask once more.

**Composition and bill of materials.**

| Section | Opens with | Holds | Specced under |
| --- | --- | --- | --- |
| Understands | no head, the cards are the argument | the ChatGPT and 6labs pair joined by a vs | Comparison cards (7.12) |
| Jobs | a section head, "One model. Three jobs." with a subline (raw markup today, specced as Section head (7.16)) | the three-job switch below xl, three job cards with terminals and tags | Segmented control (7.4), Card (7.11), Terminal (7.19), Badge, status dot, tag (7.14) |
| FAQ | a section head, "Questions, answered.", in a 360 column from lg (raw markup today, specced as Section head (7.16)) | ten questions in rows | Accordion (7.20) |
| Closing | the mark | "1 million made / 2 billion to go", one line of why, Try now, a sign-in line | this section |

**The shared box.** Every light section sits in the container and gutters of Layout and breakpoints (2.6), so heads start on one left edge from section to section. The closing is the one centred section, because it is the end of the page rather than a step in it.

**The padding rhythm.** Each section's top and bottom padding is a clamp on the window's width: Jobs `clamp(96px, 9vw, 144px)` over a 96 foot, FAQ `clamp(72px, 7vw, 120px)` over a 128 foot, the closing `clamp(40px, 4vw, 72px)` over `clamp(92px, 10vw, 150px)`. Understands adds the header's height to its top (`calc(89px + clamp(96px, 9vw, 144px))` from md, `calc(70px + 96px)` on phones), so that when its top meets the window's top, as it does when the light page rises back over the water, its cards sit one block's distance under the fixed bar rather than behind it. Both offsets are hand-written numbers that do not match the bar, the header-offset drift in Known gaps (10.2). A new light section uses the same clamps rather than a fixed step, so the gaps between sections grow together.

**The grain.** From Understands to the footer, one `.page-grain` block covers the glyph field with the page colour and a 4.5% noise, fading in over its first 240px. It starts at the fourth section because that is where the page turns from the set pieces (floor, line, water) to reading. A new section after the players goes inside this block, never in a block of its own.

**The head rule.** A new light section that opens with a head uses the system SectionHead at its h2 size, as Section head (7.16) specs it. Jobs and the FAQ write the same head as raw markup today. The display size is kept for the closing call only.

**The closing.** Centred: the 44 mark, the two-line promise with its second line typed in once 60% of it is in view, one line of why at 520, Try now, and "Already have an account? Sign in" at 13.5. The numbers are written as a digit and a word, because the words carry the scale.

**Accessibility.** Each section carries its own id (`understands`, `jobs`, `faq`, `get-access`). `jobs` and `faq` are targets of the in-page links (the header's tabs and the footer's Explore). `understands` and `get-access` carry ids that no link targets yet, as Shell behaviours (6.7) notes. The typed line is in the DOM from the start.

**Responsive.** Jobs swaps its grid for a snap row with a switch below xl. The FAQ stacks its head over its rows below lg. The comparison becomes one column on a phone. The closing only scales its type.

#### Reasons

- **Clamps, not steps.** A fixed padding that jumps at md makes a 767 window and a 768 window look like two designs. A clamp grows with the window, so no width is a seam.
- **The grain marks the reading half.** The set pieces above it move. The grain says the page has settled and the rest is to be read.

#### Gaps

- The closing's 34px gaps and its 13.5px line are off the spacing and type scales.
- Sign in in the closing is a dead `href="#"`.
- Jobs rises into view and the FAQ does not.

#### Do / Don't

- Do open a new light section with SectionHead on the container's left edge.
- Do reuse the section clamps for its padding.
- Don't start a grain block of your own.
- Don't centre a head except the closing's.
