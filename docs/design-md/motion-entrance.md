### Entrance and reveal

#### Values

The section rise is opacity 0 to 1 with 28px of travel over 0.7s on the ease (`RISE`). Understands staggers its two cards and the "vs" 0.15s apart and starts when 40% of each is in view. Jobs starts its heading at 25% in view and its cards 0.1s plus 0.12s per card once 15% of the row is in view. The hero numbers rise 6px over 0.6s, 1.2s after the floor is ready. The players reveal is 24px over 0.5s, cards 0.05s apart, the portrait at 0.1s, the switch at 0.15s and the detail column at 0.2s.

#### Use for

The rise is the default entrance for a light section's heading, cards and comparison. Use a stagger of 0.12 to 0.15s for two to four siblings, and a smaller one (0.05s) when there are many small parts that belong together. Wait on a dependency (the floor, the water) when the part means nothing without it.

#### Never for

- Content that is already in view on first paint. The hero copy fades in CSS from first paint instead, so it never waits for the scripts.
- Replays. Light sections enter once (`viewport.once`), because a section that rises again on the way back up makes the reader re-read it.
- Long travel or long staggers. More than about 30px, or a full sequence longer than a second, keeps the reader waiting for words they already scrolled to.

#### Reasons

- The rise tells the reader where the next thing is without asking for a look. 28px is enough to read as arrival and short enough to finish before the eye gets there.
- Thresholds are set by the part's size. A tall comparison waits for 40%, so it rises where it can be read. A swipe row waits for only 15%, because on a phone most of it is off to the side.
- The numbers wait for the floor because the figures describe what the floor shows. Landing on a loading floor would put the claim before the proof.
- The players reveal is the one entrance that is not once. It follows the water, which the scroll drives both ways, so the section leaves as the water drains and comes back with it.

#### Reduced motion

The site sets no `MotionConfig`, so every motion/react entrance still travels when the visitor asks for less motion. New work keeps the opacity change and drops the travel, as Reduced motion (4.6) sets out.

#### Responsive

The values do not change by breakpoint. What changes is the trigger geometry: below xl the Jobs cards sit in a swipe row, which is why that row uses an IntersectionObserver on the row rather than one per card.
