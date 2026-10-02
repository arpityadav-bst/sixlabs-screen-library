### Tabs

**Purpose.** Switching between panels of content that share one place on the page, such as the views of an account or the parts of a report. The site has no line tabs yet. Its one tab list, the jobs switch, is a segmented control and is covered there. Tabs exist for the cases a segmented control cannot hold: more options, longer labels, and real panels for screen readers to land in.

**Anatomy.** A list: one row of tabs on a 1px hairline drawn inside its box. Each tab: an optional icon, the label, an optional count. The indicator: a 2px navy line under the chosen tab, as wide as its label. Under the list, the panel of the chosen tab.

**Why navy, and why a line.** The indicator is navy, the system's selected colour, never the accent (chapter 8). A line rather than a fill keeps the tabs light enough to sit above dense content without competing with it.

**Variants.** One look, two activations. Auto, the default: the arrow keys move along the row and choose as they go, which suits panels that render at once. Manual: the arrows move focus only and Enter or Space chooses, which suits panels that load or cost something to show, so passing over a tab does not fetch it.

**Sizes.** sm 36 with 13px Inter labels, for a card or a panel header. md 44 with 15px Inter, the default for a page section. lg 52 with 18px Outfit at -0.01em, for tabs that head a whole page, set in the display face as the site's titles are. Labels sit 20, 28 and 32 apart. The chosen label turns to 500, and every label reserves its 500 width at rest, so choosing a tab never nudges the row.

**States.** Rest: the muted grey. Hover: ink. Chosen: ink at 500 with the indicator. Focus-visible: an accent ring drawn 2px inside the tab on a 6px radius, inside rather than out because the list scrolls and its overflow would clip an outer ring. Pressed: the label settles to 0.97 while the indicator stays put. Disabled: the quiet grey, a not-allowed cursor, and the arrows skip it.

**Props.** `items` (`id`, `label`, optional `icon`, `count`, `disabled`), `value`, `onChange`, `label` (the list's accessible name), `size`, `activation`, `panels`, `indicatorId`, `forceState`, `forceOn` and `className`.

**Motion.** The indicator slides to the new tab on the thumb spring (stiffness 500, damping 40), the same spring as the segmented thumb, so every selection mark in the system moves alike. The leaving panel fades out over 140ms while the new one fades in over 200ms with a 4px rise, overlapping so the space never empties. Under reduced motion the indicator moves at once and the panel fades without the rise.

**Accessibility.** The list is a tablist with an accessible name, each tab a tab with aria-selected, and the chosen tab names its panel with aria-controls. The panel is a tabpanel labelled by its tab and is itself a tab stop, so Tab moves from the list into the content. One tab stop in the list (the roving tabindex): Left and Right move, Home and End jump to the ends, disabled tabs are skipped. Focus leaving the list returns the tab stop to the chosen tab.

**Responsive.** The list never wraps and never shrinks its labels. When the row is wider than its box it scrolls sideways inside its own box, with no visible scrollbar, and the chosen tab is scrolled into view with 16px to spare, so a phone always shows where the reader is. The page itself never scrolls sideways.

**Do / Don't.**
- Do use Tabs for panels, Segmented for a few short options.
- Do keep labels to one or two words.
- Do use manual activation when a panel loads data.
- Don't colour the indicator with the accent.
- Don't use tabs to move between pages, which is navigation and takes links.
- Don't nest one tab list inside another's panel.
