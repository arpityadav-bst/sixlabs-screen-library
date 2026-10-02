### Player carousel

**Purpose.** Below lg the players section has no room for four selector cards beside the portrait, so the cards and the side column collapse into one swipeable row under it. A slide is one player: the name, a line of description and the dense trait bars. The portrait and the Human / AI switch above it stay put, so whatever a pick changes is still in view.

**Anatomy.** A scroll-snap track with one full-width slide per player, a dots row under it, and two arrows that sit outside the carousel, at the sides of the portrait box. The arrows and the carousel are separate exports (`PlayerCarousel`, `PlayerArrows`) on one index held by the parent (Players.tsx), because they live in different parts of the layout.

**Variants.** One. The md step is a viewport response, not a variant (see Responsive below).

**Sizes.** None. The dot target is 32 tall and 18 or 36 wide and the arrows are 36 round, set by the slide's density rather than by a size scale.

**States.** Dots: active (widened and solid white) and rest. Arrows: enabled, and disabled on the first and last slide. They dim rather than wrap because four players are a set with edges: wrapping from the last player back to the first would read as an endless loop. Neither part draws hover, pressed or focus-visible, which is a gap.

**The swipe and rest rule.** A swipe counts only once the track has rested 120ms after its last scroll event. Changing the player while the track still moves re-renders the page, and the browser then re-snaps the track to where it came from, so the pick waits for the finger to finish. A dot or arrow pick is the opposite case: the track glides there by smooth scroll and ignores the slides it passes, so the portrait does not flicker through every player in between.

**Props.** `active` (an index into PLAYERS) and `onChange(k)`. Both parts read PLAYERS directly, so neither can show other content until it takes an items prop.

**Motion.** Native smooth scroll and snap on the track, a 300ms width and colour change on the dots, a 200ms opacity on an arrow as it disables. Nothing else moves, because the portrait above is where a change is meant to be seen.

**Accessibility.** Off-screen slides are aria-hidden. Each dot is named by its player's title and the active one carries aria-current. The arrows are named "Previous player" and "Next player". Gaps: every target is under 44 (32 × 18 dots, 36 arrows), the dots belong in a carousel pattern (a group with aria-roledescription "carousel", slides labelled "n of 4", selected tabs) rather than aria-current, the track takes no arrow keys, and no focus ring is drawn.

**Responsive.** It mounts only below lg. From lg the selector cards and the side column return and Players.tsx hides it. From md the column centres at 560 and the title steps from 28 to 36 and the body from 15 to 16, because a tablet-wide slide would otherwise strand short lines at its left edge. The step follows the viewport rather than the box, which is why the guide shows the phone composition in a frame at a true width.

**Do / Don't.**
- Do keep it on the accent water. Its type, dots and bars are white by design and vanish on a light ground.
- Do drive the arrows and the carousel from one index.
- Don't count a swipe before the track rests.
- Don't use it from lg up, where the cards and the side column have room.
- Don't reuse it for other content before it takes an items prop.
