### Footer and copy line

**Purpose.** The foot of both pages, in three bands. First the lockup with its line, the Explore links and Back to top. Then the copy line, the giant 6labs standing in front of a picture of players walking toward the mark and leaving as blue copies. Last the tail, with the copyright and the legal links. It sits a shade darker than the closing section (black at 4% over the page) so the page ends on a ground of its own, with the noise still showing through.

**Anatomy.**
- Top grid: two columns on phones (the brand block across both), then 1.7fr / 1fr / auto from md, gap 40, pt 60, inside a 1400 row with 16 / 64 side padding. The brand column is widest because the tagline needs the measure.
- Brand block: the lockup in its `.ai` form and the tagline at 14 / 1.65, 22 below.
- Explore: an h3 at 13.5 / 600 in ink, then the links at 13 in muted grey, 13 apart.
- Back to top: a text button at 13.5 in ink with ArrowUp 14 / 2.
- Copy line band: the word at `clamp(84px, 19vw, 300px)`, Outfit 600, tracking -0.055em, with clear air above it (72px plus 0.46em, 150px plus 0.46em from md). The mark crests from behind it at 0.95em, fading into the word. A pale red copy nudged 3px left and a pale cyan copy 3px right, each fading out by 16%, show only where a copy slips past a letter's edge.
- Spec labels (from 1024): pills at 12 on a 28px leader with an end dot, default (white at 85%) and strong (navy), pinned in the picture's coordinates.
- Tail: black at 4% again under an ink hairline at 8%, py 22, safe-area padding at the foot. The slate hairline used elsewhere disappears on this tinted ground, so the tail's hairline is ink.

**Variants.** None by prop. The footer has three compositions by width instead. Phone: mark and word only, the tail centred. Tablet (768 to 1023): the picture behind the word. Desktop (from 1024): the two spec labels too. The labels wait for 1024 because below it they crowd the heads they point at.

**Sizes.** One. The word is sized by the window, `clamp(84px, 19vw, 300px)`, rather than by a size step.

**How the picture is drawn.** `CopyLinePicture` draws the picture on a canvas the size of the band. Each pixel's darkness becomes its alpha (a multiply done once, in the canvas), its colour is re-derived against the footer's own ground, and a radial `destination-in` fades it round the word. No CSS blend mode or mask is ever on screen, under the compositor-safe rule (5.13). The cost is that the ground is baked in: the band only looks right on the footer's ground (`#f9fafb` at 96%). It loads 800px before view and picks the 1344 source on narrow or low-density bands.

**States.** Links: muted at rest, accent on hover over 300ms (legal links turn their underline accent too). Back to top: ink, accent on hover. No focus ring on any control.

**Props.** None. The links, the copy and the picture are written in Footer.tsx and CopyLine.tsx.

**Motion.** Colour only. The band is still: a footer that moves pulls the eye back down a page the reader is leaving.

**Accessibility.** The band is `aria-hidden`, since the wordmark and labels repeat what the lockup and the page already say. The Explore links are a labelled `nav`. Gaps: the stub links (Case Studies, Terms of Use, Privacy Policy) are anchors without `href`, so a keyboard never reaches them. The h3 has no h2 above it in the footer.

**Responsive.** The word is sized in vw and the picture's breakpoints are viewport queries, while the picture and labels scale with the band's own width. The two only register at a true viewport, which is why the guide shows the footer in a frame and never as a direct import.

**Gaps.** No social links, contact or newsletter slot. The Explore list and the header's tabs are separate sources and differ. The year is hard-coded. On desktop the floating Back to top and this one show together. Phones load and process the picture although they never draw it.

**Do / Don't.**
- Do keep the band on the footer's ground, or re-derive the picture against the new one.
- Do give every footer link an `href`, or render it as text until it has one.
- Don't put a blend mode or mask on the picture to "fix" its edge. Change the canvas pass instead.
- Don't add a third spec label without moving the existing two: they are placed on specific heads.
