### Stats and typed word

**Purpose.** The two text parts on the site that behave. HeroNumbers (HeroBits.tsx) gives the claim a size, 2B human players beside the running count of their digital copies. TypedWord types a headline's accent words behind a caret, "models" in the hero and "2 billion to go" in the closing line. Both are shipped and both are specimened as they ship.

**Anatomy.** HeroNumbers is a description list of two figures, 56px apart (32 under md). Each figure is a value in Outfit 30 at 500, leading 1, tight tracking and tabular figures, over a label in Inter 14 (15 from md) in the muted slate, 8px under it. The value comes first in reading order through `order`, while the markup keeps the term before its description. TypedWord is the word as one span per letter, every letter holding its place from the start, transparent until its turn, so nothing reflows as the word appears, and a thin accent caret at the right edge of the letter being typed.

**Variants.** HeroNumbers has two tones and two placements. The humans are navy and the copies are the accent, the headline's "models" colour, so the figure that moves is the one in the colour that means "the model". The tone arrives as a class string, `text-[#0a1b33]` or `text-accent`, rather than a named tone. That is a gap: a new figure can pass any class at all, so new work keeps to these two. The pair sits centred under the container by default, and `left` sets it into the full view's copy. TypedWord has three ways to start. Immediate is the hero's: it starts the moment the CSS applies, never waiting for scripts or the floor, because the headline is the first thing read. `onView` is the closing line's: it waits, paused, until 60% of the words are in view, then types once. `hold` is the full view's: it waits for as long as the loader runs, so the typing starts with the copy rather than behind it.

**Sizes.** None of their own. The figures are Outfit 30 at every width, and TypedWord takes the size of the line it sits in.

**States.** HeroNumbers: waiting for the floor, shown, and the brief brighten of each tick. TypedWord: waiting (for its view or its loader), typing, and done, with the caret gone.

**The tick.** The copies count rises by one each time a tile converts on the floor. Each new value remounts its span and brightens from 0.4 to 1 over 0.45s, and it never moves, so a figure that changes every few seconds never jumps the line or pulls the eye with motion. Tabular figures keep the width steady as the digits change.

**Props.** HeroNumbers: `stats` (each `{ value, label, tone, live }`, where `label` holds the label's lines and `live` marks the count that brightens as it ticks), `ready` (the floor is in, so the entrance may run) and `left` (the full view's placement, with no entrance of its own). TypedWord: `word`, `className`, `onView` and `hold`, the two ways to wait above.

**Motion.** Under the container the pair waits for the floor: the placeholder logo leaves, the tiles fade in, then at 1.2s the figures rise 6px over 0.6s. In the full view the pair is part of the copy and shows with its fade from the first paint, because that copy already waits for its loader. TypedWord's letter i appears at 0.5s plus i times 90ms, the caret stands at its right edge for its own 90ms, and after the last letter the caret blinks once over 1s and goes. The caret's keyframes end on 0, so a frame held while the page is busy holds an unlit caret, never two lit ones. Under reduced motion TypedWord shows the words at once with no caret, and HeroNumbers keeps its fade and its brighten, which change opacity only and travel 6px at most.

**Accessibility and gaps.**
- The live count has no aria-live. That is right while it ticks every few seconds (an announcement each time would drown the page), but it is not written down in the component.
- The letters are separate spans. Most screen readers join them, but an aria-label on the word with the letters hidden would be safer.
- The caret colour is a fixed `#1a6dff` in globals.css, not currentColor, so on a word that is not the accent the caret stays blue.
- TypedWord's start and step are CSS constants with no props.

**Responsive.** The narrower phone gap and the single-line labels keep both figures on one row at 375, where a wrapped label would set the two values at different heights. TypedWord inherits its size from the line it sits in.

**Do / Don't.**
- Do keep the accent on the one figure that moves.
- Do type only the accent words of a headline, once.
- Don't type a word in ink. Its caret stays blue.
- Don't add a third figure to the pair. Two is a comparison, and three is a table.
