### Responsive ladder

**Purpose.** Where the page changes as the window widens, and the rule for where new work may change. The guide lists every step read from the source. This chapter says why the steps are where they are.

**The ladder.**

| Width | What changes |
| --- | --- |
| base (375 up, until the steps below) | phones: the burger, Sign in at 13, the footer in two columns, the jobs as a swipe row, the players as one view, the container hero 34 / 720 / radius 32 |
| 561 | the full hero's type, one step, and nothing else |
| 768 (md) | tabs and language in the header, the footer in three columns, the copy line picture, the page gutter at 32, the container hero 56 / 664 / radius 48 |
| 901 | the full hero's type, one step |
| 1024 (lg) | the players' two columns and four cards, the full hero's scroll cue, the copy line's labels, the full floor pulled back (distScale 1.5) |
| 1280 (xl) | the jobs three across, the full hero's type, the short-screen cap |
| 1600, 1920, 2560 | the full hero's type and measure, the floating tiles' wide places at 1600 |
| 1920, dense screens only | the players scale up to 1.35 |

**The full-hero exception.** The full hero keeps the ladder it was tuned on, from the onBlue creators hero: the title 34 / 36 / 42 / 54 / 64 / 76 / 88 and the lede 16 / 16.5 / 15 / 16 / 18 / 20 / 22 at a measure of 470 / 440 / 540 / 620 / 680. At 901 the lede drops to 15 as its measure narrows to 440, as the onBlue scale has it: size and measure move as a pair, so the line length holds while the title grows. The ladder stays in the full hero. Nothing else may use 561, 901, 1600, 1920 or 2560, with the one exception below.

**The players' scale, the second exception.** The players section is laid out for windows up to 1920. Past 1920, on a dense screen only, its content scales up evenly by the window's width over 1920, to at most 1.35, as Scroll line to players (9.3) sets out. It is a transform rather than a breakpoint, so nothing reflows, and it reads the width and the density in script, not in a media query.

**The rule for new work.** A page changes at Tailwind's breakpoints only: md (768) for the phone to tablet split of gutters, type and rhythm, lg (1024) for layouts that change shape, xl (1280) for wide grids. Write `xl`, never `min-[1280px]`. A part that steps its size steps down one rung under md. Inside a part, the named component widths 400, 480 and 560 may also be used, where a row of actions or choices stops fitting a phone, and a part that answers its own box (EmptyState) takes a container query rather than a media query, as Layout and breakpoints (2.6) lists.

**Height, pointer and density.** Width is one axis of four.
- **Short screens.** `(min-width: 1280px) and (max-height: 720px)` caps the full title at 48, so a laptop with a short window still shows the copy, the numbers and the cue in one screen.
- **Small viewport units.** The full hero and the players' portrait use `svh`, the height with a phone's toolbar showing, so nothing is cropped when the toolbar comes back.
- **Hover and fine pointers.** `(hover: hover)` gates anything that answers a cursor (the glyph field's pool, the floating tiles' drift), and `(hover: hover) and (pointer: fine)` gates the liquid over the line and desktop Safari's smooth scroll. Touch gets the still form, never a broken hover.
- **Pixel density.** A devicePixelRatio of 1.5 and up, read in script, lets the players scale past 1920. A wide CSS width at that density is a big physical screen seen up close, while a 1440p monitor at density 1 is a desk screen at arm's length and keeps the layout.
- **Safe areas.** The footer's legal row pads `env(safe-area-inset-bottom)`, so the home bar never covers the links.

**The tight band.** From 768 to about 900 the header's row is at its narrowest, as Header (6.2) describes. A fifth tab does not fit there, so it goes in the menu or waits for a wider step.

#### Reasons

- **Shared steps reflow together.** When every part changes at md, the page changes once at 768 and the visitor sees one new layout. Parts on private widths make a window size that is half one design and half another.
- **lg for shape, xl for density.** The players need the room of 1024 to hold a side column beside a 720 portrait. The jobs need 1280 to hold three terminals side by side at a readable width.
- **The hero ladder is one set piece.** Its title, lede and measure were tuned together. Moving one step onto Tailwind's widths would retune the whole block.
- **A touch screen is not a small mouse.** A hover effect without a hover is either invisible or stuck on, so the pointer media decide, not the width.

#### Do / Don't

- Do change new work at md, lg and xl, and inside a part at 400, 480 or 560.
- Do gate cursor effects on `(hover: hover)`.
- Don't write any other custom width outside the full hero and the players' scale.
- Don't size a full-screen part with `vh` on a phone.
