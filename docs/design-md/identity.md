### Logo and identity

**Purpose.** The identity is one mark (three blades round a core circle) and one wordmark (6labs in Outfit with an accent 6). They meet as a lockup in the header and the footer, and the mark appears alone as the footer's crest and, redrawn in outline, on the comparison cards. The system adds `Lockup` so a page never rebuilds the pair by hand.

**Anatomy.**
- Mark: the logo file `public/brand/sixlabs-mark.svg`, drawn in code by `SixLabsLogo` (flat, or fading down its last 40% in SVG gradients). Blades `#1770EF` (`--ds-color-logo-blue`), core `#030D2D` (`--ds-color-logo-navy`).
- Wordmark: `Word` from `CopyLine.tsx`, the 6 in `--ds-color-accent`, the rest in the ink around it. `Word plain` drops the accent.
- Lockup: mark, gap, wordmark, and an optional `.ai` suffix (the footer's form).
- Line mark: `SixLabsMark`, the mark as outlines in `currentColor` at the ChatGPT mark's weight.

**Variants.** Ink (the logo file and the accent 6, on the page, surface and container) and onBlue (the outline mark and the plain word, both white, on the accent water only).

**Sizes.** sm, md and lg: mark 24 / 32 / 44, wordmark 18 / 24 / 32 at 500, gap 8 / 10 / 12. md is the header's lockup, and the other two keep its ratio so they read as the same lockup scaled rather than a second design. The smallest mark is 20, where the three blades still read as three. On the comparison cards the outline mark is 44 (36 on a phone), beside a name of its own size rather than a lockup step. The outline mark has no optical sizes: its line is in viewBox units, so it thins at 16 and thickens at 64. Use it from 24 up.

**Clear space.** The core circle's diameter (0.292 of the mark) on every side: 7 at sm, 9 at md, 13 at lg. It is measured from the mark because the mark is the part that defines the lockup's height. Nothing else (a tab, a pill, the bar's edge) comes inside it.

**Colour.** Two brand colours and two interface colours meet here and must not be swapped. The blades keep the logo file's `#1770EF` and the core its `#030D2D`, because they are the logo, not the interface. The 6 takes the interface accent `#1a6dff` and the word takes the ink `#0a1b33`, because the wordmark is set type. The two blues sit side by side on purpose, and neither is "corrected" to the other.

**States.** As a link (`href`) the lockup has rest and focus-visible only. It has no hover, matching the shipped header and footer, because it is a way home and not an offer competing with the calls to action. Focus takes `--ds-focus-color`, or the white ring on blue.

**Props.** `size`, `tone`, `suffix`, `href`, `forceState`, `className`. Paths that start with `/` use a Next Link.

**Motion.** None. The lockup never moves in the shell, because a way home that moves would compete with the calls to action. The line mark on the comparison cards rides its card's entrance and nothing more.

**Accessibility.** The mark is decorative (`alt=""`, `aria-hidden`) and the wordmark is real text, so the link's name is "6labs" (or "6labs.ai") with no extra label. `ChatGptMark` is OpenAI's mark from Simple Icons. It names the model a card compares against, appears only beside that comparison, and never stands for 6labs.

**Responsive.** The shipped lockup is the same 32 / 24 at every width. A new surface picks sm below 400 only when the bar has no room for md.

**Do / Don't.**
- Do use `Lockup` wherever the mark and word appear together, at one of its three sizes.
- Do use the onBlue tone on the accent water, where the flat blades would sink into the water.
- Don't place the flat logo on the accent: `#1770EF` on `#1a6dff` leaves only the core visible.
- Don't recolour the blades to the accent, or the 6 to the blade blue.
- Don't set the wordmark in any other face or weight, or draw it as an image.
