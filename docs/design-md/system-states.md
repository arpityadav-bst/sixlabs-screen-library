### Loading, empty and failure

**Purpose.** The three ways a page can fall short of its content: still waiting for it, unable to run the floor, or cut off by a failed request or connection. The site ships none of these states today, so this chapter sets them before the first page that needs them.

**Skeleton or spinner.** Spinner and skeleton (7.21) sets the choice: a skeleton where the shape of what is coming is known, a spinner where it is not or inside the control that started the wait. At page level a spinner is never the only thing on screen.

**The hero without WebGL.** The floor needs WebGL. When it is not there (an old GPU, a blocked context, a driver crash), the hero keeps its box, its copy and Try now, and changes three things:
- The floor's mark lies still at 60% where the floor would run, tilted as the loader tilts it but not turning, because a turning mark says something is loading and nothing is coming.
- One line under Try now, 13px in the body slate: "The live floor is not available on this device."
- The full view stops holding the scroll the moment the failure is known, rather than after 12s.

Neither variant reaches this today, so it stays a gap until the hero adopts it. The mark's soft edge is a CSS mask on the shipped loader, and the fallback drops it under the compositor rule, so the feather belongs baked into the image.

**Empty and error placement.** An empty or failed part shows its EmptyState where its content would be, at the content's size, and the rest of the page stays. A failed row of cards becomes one contained EmptyState in the row's place. A failed page (nothing to show at all) is the only place an EmptyState stands alone at page level.

**Retry.** A retry is the secondary Button in the EmptyState or the Banner, and it turns busy while it runs. It retries only the part that failed. After two failures the copy says so and offers a way out (Contact support) beside the retry. A retry never reloads the page, because that would throw away everything that did load.

#### Reasons

- **The hero's job survives the floor.** The visitor came for the claim and the call. The floor is evidence, and losing evidence is worth one quiet sentence, not an error panel.
- **A failure stays where it happened.** An error in place of the one row that failed tells the visitor exactly what is missing and that everything else is fine.
- **Banners for conditions, toasts for events.** "You are offline" is true until it is not, so it stays. "Saved" happened once, so it goes.

#### Do / Don't

- Do use a skeleton shaped like the content for a known layout.
- Do keep the hero's copy and Try now when the floor cannot run.
- Do retry only the part that failed.
- Don't put a page spinner in front of content whose shape is known.
- Don't replace the hero with an error.

#### Banner

**Purpose.** A notice for a condition that holds until it ends: offline, a stale view, a save that failed. It sits in the flow above the view it is about. It is not a toast (it does not time out) and not a dialog (the page keeps working under it).

**Anatomy.** One row at the panel radius (16): a 16px icon in its tone's colour, the title in Inter 14 at 500, the body after it in the body slate, then an optional secondary sm action and an optional ghost sm close. Padding 12 / 16, gap 12, a 1px hairline.

**Variants.** `tone`: info (the accent icon), offline (the muted icon), success, warning and danger. Info, offline and success sit on white. Warning and danger take their 8% tint and danger its own line, so the two that need attention stand out without a fill. No tone fills with the accent.

**Sizes.** One. A banner is a page-level row, and a smaller one would be a toast.

**States.** The banner itself has none. Its action and close are the system Button and IconButton with their full states: rest, hover, focus-visible, pressed, and loading on the action while a retry runs.

**Props.** `tone`, `title`, `body`, `icon`, `action` (`label`, `onClick`, `loading`), `dismissible`, `onDismiss`, `forceAction`, `forceClose`, `className`.

**Motion.** None of its own. It appears and goes with the content it is about, so it never slides over anything.

**Accessibility.** Danger is `role="alert"`, every other tone `role="status"`, so only a failure interrupts a screen reader. The title is a sentence with a full stop, so it reads well announced alone. The close is labelled Dismiss. A banner for a condition that is still true has no close, because dismissing it would hide something that is still the case.

**Responsive.** Under 480 the actions wrap below the copy, lined up with it past the icon.

**Do / Don't.**
- Do use a banner for a condition that holds until it ends, and a toast for an event that happened once.
- Do write the title as a sentence that reads well announced alone.
- Don't give a banner a close while its condition still holds.
- Don't fill a banner with the accent, on any tone.
