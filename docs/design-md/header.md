### Header

**Purpose.** One fixed bar on both pages: the lockup (home), four tabs that glide to their sections, the language picker, and Sign in. It stays put while the page moves so the visitor can always get home or jump ahead, and it carries the only control the hero's Try now has to share the first view with.

**Anatomy.** `nav#site-head`, fixed at z 40, padding 20 by 24 from md and 16 all round below, a 1px bottom stroke that is always in the box (so the bar never changes height when it shows). Inside, a row capped at 1400: the lockup at left, the tabs (gap 32, Inter 15/400 in ink) in the middle, and the right cluster (gap 16, 6 on phones) holding the language picker, Sign in and the phone's menu button.

**Variants.** Default (`/website`) and `clear` (`/6labs-fullview`). Clear exists because the full view's tile floor runs under the bar. A ground at the top would cut the floor into a strip, so the bar is transparent until the page scrolls, and it hides while the loader shows so nothing interactive sits over a page that cannot be used yet.

**Grounds and their triggers.** The bar reads the window, not its parent, which is why the guide shows it in frames.
- Rest: the page colour at 92%, no stroke. Sections show faintly through as they pass, which says "the page goes on under here" without a blur.
- Scrolled (`scrollY > 4`): the slate stroke appears, separating the bar from content now under it. Four pixels, not zero, so a trackpad's settle does not flicker it.
- onBlue (`accentwave` with `filled: true`): solid white, because a 92% page colour over the accent water reads as a pale blue smear. The event's two thresholds, set in Accent water (5.9), keep the bar from flickering at the water's edge.
- Clear, held: invisible from the first paint until `heroloaded` (or 12s). It appears at once, with no fade, so the bar is simply there when the page is.
- Clear, top: transparent until the first 4px of scroll, then the default scrolled bar.

**Sizes.** One bar. Sign in is medium (14px, about 39 tall) from md and small (13px, about 33) below, tied to the breakpoint rather than a prop, because the bar only ever has one width class.

**States.** The bar's own states are its grounds above. Its tabs rest in ink and turn accent on hover over 300ms. Sign in is outlined in slate-300, and on hover takes white at 70% with a `#b7c0cb` stroke over 200ms. Sign in is outlined so Try now stays the one solid call to action in view.

**Props.** `clear?: boolean`.

**Motion.** Ground and stroke change over 300ms on Tailwind's default ease. No hide on scroll and no shrink on scroll: the bar is small already, and a moving header competes with the scroll line's own motion.

**Accessibility.** Today the bar has no focus ring of its own on any control, no current-section state on the tabs (no `aria-current`, no scroll spy), no skip link, and the outer element is a `nav` without a label holding non-navigation controls too. New work adds the system focus ring to every control, a `header` landmark with a labelled `nav` for the tabs, and `aria-current="location"` on the tab of the section in view.

**Responsive.** One breakpoint, md 768. Below it the tabs and the language move into the mobile menu and the burger appears. 768 to about 900 is the tight band, where lockup, tabs and cluster fill the row with little air. Nothing new is added to the bar without checking that band first.

**Gaps.** No scrolled state on mount (a reload restored mid-page shows the top state until the first scroll). Sign in has no `type` and no pressed or focus state. On the white onBlue bar Sign in's hover fill is invisible and only its stroke moves. The tab list and the footer's Explore list are two sources and already differ.

**Do / Don't.**
- Do keep Sign in outlined and medium. The large solid pill belongs to the hero.
- Do keep the bar unfrosted. A backdrop blur on a fixed bar breaks the compositor-safe rule (5.13) for the whole page.
- Don't add a fifth tab before the 768 to 900 band is checked.
- Don't listen for scroll to restyle the bar in a new way. Add a window event to the contract in Shell behaviours (6.7) instead.
