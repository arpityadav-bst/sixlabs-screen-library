### Focus

#### Values

A solid outline drawn outside the border box, a step further off a card than a control, following the element's own radius. Three tones: the accent on the page, surface and container, white on the accent water, and the lifted accent on navy and the terminal. Fields take a halo with an accent border in place of the outline. Every width, offset, tone and halo, with its token, is Focus (3.23). The class strings live in `focus.ts`: `FOCUS`, `FOCUS_INVERSE`, `FOCUS_DARK`, `FOCUS_CARD`, `FOCUS_INSET`, `FIELD_FOCUS` and `focusRing(tone)`.

| Ring | Ground | Ratio |
| --- | --- | --- |
| #1a6dff | page #f9fafb | 4.29 |
| #1a6dff | surface #ffffff | 4.49 |
| #1a6dff | container #e3e5e8 | 3.55 |
| #1a6dff | navy #0a152d | 4.03 |
| #ffffff | accent #1a6dff | 4.49 |
| #6ea8ff | navy #0a152d | 7.51 |
| #6ea8ff | terminal #0b1526 | 7.57 |

Every pair clears the 3:1 that WCAG 1.4.11 asks of a focus indicator. Ratios are rounded down.

#### Use for

Every element that takes keyboard focus: buttons, links, chips, segments, tabs, cards that act, menu triggers, the skip link. The inset form (`FOCUS_INSET`, offset -2) for items inside a sideways scroll row. The halo for text fields, selects and the search field.

#### Never for

Pointer focus: the ring shows on `:focus-visible` only. Hover, which has its own state. A selected or checked state, which is navy. Box shadows on buttons as a stand-in, which disappear in forced colours.

#### Reasons

- *An outline, not a border or a shadow.* An outline takes no layout space, so focus never nudges a row, and it follows `border-radius`, so a pill gets a pill-shaped ring. In forced colours the outline is repainted in `Highlight`, where a shadow would vanish.
- *Outside, with a gap.* The 2px gap shows the ground between ring and control, so the ring reads as a separate line on a navy fill as clearly as on a white one. Cards take 3px because their larger radius and hairline need more air to read as two shapes.
- *Accent on light.* The accent is the system's attention colour, and focus is where attention is. It is the one accent line every light ground may carry. Whether it stays the accent or turns navy is decision 6 in Decisions pending (10.3).
- *White on the blue.* An accent ring on the accent water measures 1:1, so it is not there at all.
- *Lifted blue on dark.* The accent passes on navy at 4.03, but #6ea8ff is the accent the terminal already writes on dark, so the ring stays in the family and roughly doubles its margin next to white type.
- *Inside in scroll rows.* `overflow-x: auto` clips both axes, so an outer ring loses three of its edges.
- *A halo on fields.* A field already has a border, and an outline round it would draw two lines. The accent border plus a soft halo marks the box that will take the typing.
- *No transition.* The ring appears in the frame focus lands, because a fading ring lags a fast Tab.

#### How to apply it

Add the string to the element's classes and give it a radius. A part that takes `forceState` prints `data-force="focus"`, and every string carries a `data-[force=focus]` twin, so a forced cell and a real Tab are pixel for pixel the same.

#### SkipLink

**Purpose.** Lets a keyboard visitor start at the content. Without it, every page begins with a walk through the header's links.

**Anatomy.** A fixed wrapper 16px from the top left at z 70 (`--ds-z-tooltip`), above the header's 40, holding the primary sm Button: 32 tall, navy, "Skip to content".

**Variants.** Fixed, for the page. Inline, which keeps it in the flow, for documentation.

**Sizes.** One. sm is large enough to read at a glance and small enough to cover only the header's logo.

**States.** Rest: invisible and deaf to the pointer, though still in the tab order and the accessibility tree. Focus: shown at once, with the ring. Hover and pressed: the primary's hover fill and its press, while it holds focus.

**Props.** `href` (`#main` by default), `children` ("Skip to content"), `forceState`, `inline` and `className`.

**Motion.** None. It appears in the frame it gains focus, like the ring.

**Accessibility.** It must be the first focusable element in `<body>`, and its target must be the page's main landmark with a matching id. Opacity, not `display: none`, hides it, so it stays reachable.

**Responsive.** The same at every width. 16px from the corner sits inside the phone gutter.

**Do / Don't.**
- Do point it at `main`, never at the first heading, so the landing spot is a landmark.
- Do keep it first in the document, before the header.
- Don't show it at rest. Sighted pointer visitors never need it, and it would cover the logo.
- Don't animate it in.
