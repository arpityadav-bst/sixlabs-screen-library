### Section head

**Purpose.** The light page's heading, written twice on the site as raw markup (Jobs "One model. Three jobs." and the FAQ's "Questions, answered.") and once more in the closing line at a larger size. The system SectionHead makes it one part, so the accent rule and the entrance are applied the same way everywhere.

**Anatomy.** An optional eyebrow, then the heading line in navy with its closing words in the accent, then an optional subline. The eyebrow is Inter 11 at 500 in caps, tracked 0.18em, 12px above the line. The subline is Inter 15 (16 from md), snug, in the muted slate, at most 520px wide and 16px under the line.

**The accent rule.** The accent takes the closing word or two, never the whole line. A sentence stresses its end, and the navy before it is what makes the accent read as stress. A fully blue line has nothing to stand against, and on a page whose one accent fill is the accent water, a blue line also starts to read as a surface. The accent is a node, so a TypedWord can sit in it and type the stressed words in.

**Variants.** Two alignments and two grounds. Start by default, matching the sections' left edge. Centred for a closing or a standalone moment, where the subline centres with it and balances its lines. `ground` is the page or the container, and on the container the subline takes the body slate, for the reason under The subline.

**Sizes.** h2 (Outfit 30, 44 from md, 500, leading 1.1, tracking -0.025em) heads every light section. Display (clamp(38px, 5.2vw, 74px), leading 1.05, tracking -0.045em) is the closing line's size, once a page, where the heading is the last thing said rather than a label for what follows. The tighter tracking at display keeps the large letters from spreading apart.

**The subline.** One sentence that says what the section gives, never a second heading. It is slate on the page and steps to the darker body slate on the container grey, where the lighter one falls under 4.5:1.

**The eyebrow.** A short label above the line for a page with many sections of one kind. It uses the muted slate rather than the scroll cue's quiet slate-400, because at 11px caps it needs 4.5:1 and slate-400 gives about 2.5:1 on the page.

**States.** None. A section head is read, never pressed, so it has no hover or focus of its own.

**Props.** `title`, `accent`, `accentBreak`, `sub`, `eyebrow`, `size`, `align`, `as` (h2 or h3), `ground`, `rise`, `id`.

**Motion.** With `rise` it enters as Jobs does: 28px up over 0.7s on the one ease, once a quarter of it is in view, once. The FAQ head ships without it. The system applies it to every section head, so no section arrives differently from its neighbours. Under reduced motion it appears in place.

**Accessibility.** It renders one real heading, h2 by default, so the page outline stays a list of sections. The accent is a span inside the heading, so the line is read as one sentence. Give the heading an `id` and point the section's aria-labelledby at it.

**Responsive.** The steps live in the type roles, the line and the subline both at md, so a section head needs no breakpoint of its own. The display size is fluid between its bounds and has no step.

**Do / Don't.**
- Do put the accent on the closing word or two.
- Do keep one sentence of subline.
- Do use the display size once a page.
- Don't colour the whole line.
- Don't stack an eyebrow, a heading and a subline that all say the same thing.
