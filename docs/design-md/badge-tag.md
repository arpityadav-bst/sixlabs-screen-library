### Badge, status dot, tag

**Purpose.** Labels that never take a press. A Badge names a status, a live state or a count. A StatusDot confirms a state beside the words that name it. A Tag says what something is or holds. The site has each of these inline (the selector card's Running / Ready line, the hero's pinging social-proof dot, the job cards' skills list) and none as a part, so the system builds all three in the site's own type.

**Anatomy.**
- *Badge:* A pill at radius full, 18px tall at sm and 22 at md, with 6 / 8px of side padding and a 6px gap to an optional dot. The label is JetBrains Mono 11 in caps at 500, tracked 0.08em at sm and 0.12em at md, the selector card's meta voice, so a badge reads as a machine label and never as a sentence. The count form is its own shape: an 18px navy pill in Inter 11 at 600 with tabular figures, pinned 4px past the top right of its parent, printing 99+ past 99.
- *Tag:* A line icon at 16px and stroke 1.75 in the accent, a 10px gap, then the label in Inter 13 at 20 in ink. In a TagList the tags sit in the job card's panel: the sunken grey, a hairline, radius 12, padding 14 by 16, two columns at a 16 / 12 gap that drop to one under md.
- *StatusDot:* a 6 or 8px disc, and for the live ping a halo of the same size round it.

**Variants.** Badge tones: Neutral is the slate on the light slate fill, for a plain state such as Ready. Live is white with a hairline, ink text and the pulsing accent dot, for something running now. Success, warning and danger sit on 8% tints of their own colour, quiet enough to stand beside the navy and the accent without competing. Inverse is navy for a badge that must stand out on white. onBlue is white at 15% with a 25% line, for the accent water. Tag forms: The pill form stands alone on a surface at 28px tall, white with a hairline. The plain form has no box and runs inline. The dot's kinds are under The status dot.

**Contrast on the tints.** The labels are small, so each tone needs 4.5:1. Neutral, warning and danger clear it on the page. Success on its tint over the page falls just short, and the white onBlue label on its glass is well under it. Both are open in the system part. Until they are fixed, set a success badge on a white surface, where its tint just clears 4.5:1, and keep onBlue badges to a word or two that the copy around them also says.

**Sizes.** sm for dense rows and table cells, md as the default. 18 and 22 are off the 4px grid on purpose: a badge is measured by the row it sits in, and each centres on whole pixels there, 7 above and below in a 32 row and 9 in a 40.

**States.** None. A badge, a dot and a tag never take a press, so they have no hover, focus or pressed look, and a label that needs one is a Chip.

**The status dot.** Live ping is the hero's pair exactly: an accent core under an animate-ping halo at accent 40%, 8px. Live pulse is the selector card's running dot, 6px, fading on animate-pulse. Idle is the strong slate, success and danger the status colours. The dot is decorative (aria-hidden), so the words beside it always carry the status.

**Props.** Badge: `tone`, `size`, `dot`, `pulse`, `count`, `pinned`, `label`. StatusDot: `size`, `tone`, `motion`. Tag: `icon`, `variant` (pill or plain). TagList: `items`, `columns`, `panel`, `label`.

**Motion.** Only the live dots move: the ping's halo on animate-ping and the pulse's fade on animate-pulse. Both stand still under reduced motion, which the shipped ping and pulse do not. Badges and tags never move.

**The status dot and the accent.** The live dots fill with the accent on light grounds, which is pending: decision 3 in Decisions pending (10.3). The hero's ping is the site's own, and the system's dots wait on the call, as the accent rule (chapter 8) lists them. A badge never fills with the accent at any size.

**The icon is data.** The job cards look each icon up by its label (TAG_ICON in Jobs.tsx), so a new tag with no entry quietly renders no icon. The system TagList takes the icon as a field of each item. A tag with no icon is then a choice that is visible in the data, never a lookup that missed.

**A clickable tag is a Chip.** A tag that filters, toggles or removes something needs a press, a pressed state and a focus ring, which is what the Chip is. A Tag has none of those, so a row of tags used as filters reads as broken.

**Accessibility.** A count needs `label` ("3 new"), since a bare number gives a screen reader nothing to say. A badge inside a control adds to that control's name only if the control has no aria-label of its own. A TagList is a real list, so a screen reader announces how many tags it holds.

**Responsive.** The two-column TagList drops to one column under md, so a narrow card never squeezes two labels into a line. Badges and dots do not change with the viewport.

**Do / Don't.**
- Do name a status in words and let the dot confirm it.
- Do give a count badge its accessible name.
- Do pass each tag's icon with the tag.
- Don't use a Tag where a person is meant to press it.
- Don't fill a badge with the accent.
- Don't show a status dot alone.
