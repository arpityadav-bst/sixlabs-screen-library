### Page composition

**Purpose.** The page is one sequence, and every part of the shell answers to where in it the visitor is. This chapter is the map a new page or a new section follows.

**The section order.** `main` (the page gutter, 96 top for the fixed header) holds, in order: the hero, the scroll line, the players, then one grain block with Understands, Jobs, FAQ, the closing and the footer. AsciiBackdrop and AccentWave sit behind everything, BackToTop floats over it, and ClickLock, PerfBoot and SafariScroll are behaviour with no look.

**Grounds per stretch.** Light first (the page with the glyph field round the hero), then the line on the same light page, then the water and the players, then the grain to the foot. The page opens and closes light, and the one blue stretch sits in its middle.

**The shell per stretch.**

| Stretch | Header | Glyph field | Snap | Back to top |
| --- | --- | --- | --- | --- |
| Hero | at rest, its stroke after 4px of scroll | on | none | hidden |
| Scroll line | scrolled, then solid white once the water is 90% up | on until the line's foot | none | hidden |
| Water and players | solid white | paused | `#players`, proximity snap plus a catch within 0.6 of a screen | shown, on phones only while scrolling up |
| Grain block | scrolled | covered | none | as above |
| Footer | scrolled | covered | none | on phones hidden, the footer has its own |

**The two pages.** `/website` and `/6labs-fullview` differ only above the line: the default header and the container hero on one, the clear header and the full hero on the other. From the scroll line down they are the same components in the same order, so a fix below the line ships to both.

**Rules a new page follows.**
1. One solid primary per view, for the reason in Hero (9.2). Try now is the call, Sign in is outlined.
2. The grain starts at the first section after the players and runs to the foot in one block.
3. The accent fills only the water.
4. One snap point, the players. Every other scroll rests where the visitor leaves it.
5. Every section sits in the 1400 container.
6. A section id is rendered once, because the in-page links and the glide target it.

#### Reasons

- **The shell follows the ground so the content does not have to.** The header turns white on the water because a page-tinted bar would be a pale stripe on blue. The glyph field pauses under the water and the grain because nobody can see it there, and drawing it would cost frames for nothing. BackToTop appears only past the line because above it the top is a short scroll away.
- **One magnet, because a magnet is a decision.** The players are the one place the page wants the visitor to stop. A second snap point would make scrolling feel sticky, and the visitor would stop trusting the wheel. For the same reason the magnet's catch fires only once a scroll has rested 120ms, so it never tugs at a scroll still under way.
- **The two pages share everything below the line** so the variant is a choice about the first impression only, never a second site to maintain.

#### Do / Don't

- Do add a new section inside the grain block, between the players and the footer.
- Do keep the order light, water, light.
- Don't add a second blue stretch, a second snap point or a second solid primary in one view.
- Don't render a section id twice.
