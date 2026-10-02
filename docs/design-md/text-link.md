### Text link

**Purpose.** A word or phrase inside running text that takes the reader somewhere else. The site writes three by hand (the hero lede's "See what it does", the closing line's "Sign in" and the footer's legal links), and they disagree on underline offset, thickness, colour and timing. TextLink is the one spec all three become.

**Anatomy.** The anchor itself, carrying a 1px underline in the firm hairline colour. An optional trailing arrow, or an optional corner arrow for a new tab, each at 14 on the text baseline. A hidden "(opens in a new tab)" note rides with the corner arrow for screen readers.

**The one spec.** The underline sits 3px under the text below 15px and 4px from 15px up. The offset is worked out from the font size with a clamp, so a link inside any type role gets the right gap without a size prop. Thickness is always 1px, because the default thickness changes with the font and the weight, and the hero link's default reads heavier than its own lede. On hover the text and the underline both turn accent over 300ms, the slower of the two shipped timings, because a link in body copy is read rather than pressed.

**Variants.** Three tones and two forms. *Tones:* Inherit takes the colour of the line it sits in, for a link inside secondary body copy such as the hero lede. Ink sets the link in the heading navy on a muted line, the closing section's Sign in, so the one actionable word stands out from its sentence. Muted keeps the link in the muted grey, for footers and legal lines where every word is a link and none should lead.

*Forms:* Arrow adds a trailing arrow that moves 2px on hover, for a link that leads further into the same page or product. External adds the corner arrow, opens a new tab and sets rel noopener, for a link that leaves the site. A link takes one of the two at most, since each says a different thing about where it goes.

**Sizes.** None. A link takes the size of the line it sits in, and its arrows stay at 14.

**States.** Rest. Hover: accent text and underline. Focus-visible: the 2px accent ring at a 2px offset on a 2px radius, which hugs the words rather than boxing the line. Pressed: the underline thickens to 2px in the accent, so the press shows where a scale would make a line of text jump. Visited looks the same as rest on purpose: the site's links are few and repeated, and a purple one would read as a second colour system.

**Props.** `href` (required), `tone`, `external`, `arrow`, `onClick`, `forceState` and `className`.

**Motion.** Colour only, 300ms on the one ease, plus the arrow's 2px slide over the same time, small enough to keep under reduced motion.

**Accessibility.** No href means it is not a link: an action that changes the page in place is a Button (the link variant if it must look like text). The underline is always on, so the link is found without colour, which matters most in the muted tone where the contrast with the line around it is lowest. Link text names the destination ("See what it does", "Sign in"), never "here". Internal paths render a Next Link, so prefetching and client navigation work.

**Responsive.** TextLink has no breakpoints of its own. Its offset follows the line's font size, so where a lede steps from 14 to 15 at md, the underline steps from 3 to 4 with it.

**Do / Don't.**
- Do put links inside sentences and name where they go.
- Do pick the tone from the line around the link, not from the link.
- Do use the external form for anything that leaves the site.
- Don't use a link as the page's call to action.
- Don't remove the underline to make a link look cleaner.
- Don't put an arrow and a corner arrow on one link.
