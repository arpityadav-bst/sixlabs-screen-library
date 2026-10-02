### Accordion

**Purpose.** Rows that open in place to their content. The FAQ is the shipped case: ten questions, each answered under its own row, so a reader scans the questions and opens only what they need. The Accordion is that row as a component, for any list of questions or details, with the focus, ARIA and states the FAQ lacks.

**Anatomy.** A list of items. Each item is a heading holding one button, the trigger, which spans the row: the title at the left and the icon at the right. Under it, while open, the panel: the content in Inter at leading 1.6 in the secondary body colour, capped at 680 so a long answer keeps a reading measure inside a wide row.

**Variants.** Card is the FAQ row as it ships (white, radius 14, a hairline that firms on hover and while open, rows 10 apart), for a list standing on the page ground. Flush drops the card and divides rows with a light rule and no side padding, for a list inside a white panel, where white cards would read as boxes in a box. The icon is a plus that turns into a minus, the FAQ's and the default, because the minus says what the next press does. The chevron that turns over is for lists of details rather than questions.

**Sizes.** md is the FAQ row: 64.75 tall closed, from its 18px question at leading 1.375. sm (48) suits a narrow panel or a sidebar and lg (76) a page where the list is the main content. All three keep the same ratio of padding to type.

**States.** Closed. Hover: the hairline firms. Pressed: the row tints while held. Focus-visible: an accent ring on the card row's own radius, or round the trigger when flush. Open: the hairline stays firm and the icon turns. Disabled: 40% opacity, as every disabled part takes, not-allowed, no hover. Loading: open, with three skeleton lines in place of the content and aria-busy on the panel. No state moves the row except opening it, because a row that shifted on hover would slide the next row under the pointer.

**Single and multiple.** Multiple is the default and the FAQ's behaviour: each row opens on its own. Opening a row should not close one the reader may still be reading, and closing it would shift the list under the pointer. Single fits rows that are steps of one task, where only the current step matters.

**Props.** `items` (`id`, `title`, `content`, optional `disabled` and `loading`), `type`, `defaultOpen`, `size`, `variant`, `icon`, `headingLevel`, `forceState` (applied to the first item, for the state grid) and `className`.

**Motion.** The panel opens and closes by height and opacity over 350ms on the one ease, the icon turns over 300ms and the hairline changes over 300ms. Rows in `defaultOpen` render open without animating, so nothing moves on page load. Under reduced motion the panel opens at once.

**Accessibility.** The trigger is a real button inside a heading (h3 by default, `headingLevel` fits it to the page outline), with aria-expanded and, while open, aria-controls naming its panel. The panel is a region labelled by its trigger while the list has six items or fewer, because more regions than that crowd the landmarks list. Up and Down move between triggers, Home and End jump to the ends, Enter and Space toggle. A disabled row is skipped by Tab and by the arrows. The shipped FAQ has aria-expanded and nothing more: no focus ring, no aria-controls and no region.

**Responsive.** Under md the card takes the FAQ's phone step: rows 8 apart, padding 16 by 20, the question at 16 and the answer at 14. lg steps down by one size. The steps follow the viewport, so the Accordion and the FAQ change together on one page.

**Do / Don't.**
- Do use multiple for a FAQ.
- Do use card on the page ground and flush inside a white panel.
- Do write each title as a full question or label, since it is the heading screen readers list.
- Don't use single where rows are independent answers.
- Don't nest an accordion inside another's panel, where the arrow keys and the heading levels stop matching.
