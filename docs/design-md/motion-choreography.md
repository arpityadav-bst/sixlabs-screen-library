### Choreography

#### Values

The staged sequences below each run on their own clock.

- **Container hero** (from the floor's `onReady`): the floor logo leaves over 0.45s, the tiles hold 0.5s and rise over 0.9s, the numbers rise at 1.2s, the scroll cue and wave button fade in at 1.8s. The copy is not on this clock: it fades in CSS from first paint (`.hero-copy-in`, 0.6s).
- **Full view** (from `onReady`, or after 12s if it never comes): the loader leaves and the `heroloaded` window event fires at 0, the copy fades in at 0.35s, the floor at 1.7s, the tiles start rising at 1.85s, the extras at 3.45s. All fades are 700ms.
- **Scroll line track** (in screens of scroll, from the moment the 390vh track reaches the top of the view): the words fill over the first 1.31 screens (0.82 of their scroll), the line holds to 1.6, the accent water rises over the last 1.3 screens to 2.9, the players snap in place there, and the water drains over one screen past them.
- **Players** (from the reveal: the water filled and 20% of the section in view): the cards rise 0.05s apart, then the portrait, the switch and the column. The hand draws from 1s, the portrait first turns AI at 5s and every 5s after, and the AI copy starts 0.6s after each switch. The CSS snap catches a scroll that ends near the players, and in desktop Safari a scroll that rests within 0.3 of a screen of them glides in over 0.6s, on no clock but the scroll's.
- **Terminal run** (from `play`): each step dwells by its kind, from 34ms a typed character to 1300ms for a load, with every dwell listed in Terminal (7.19).

The in-page glide is a shell behaviour, specified in Shell behaviours (6.7).

#### Triggers

The hero sequences start from TileFloor's `onReady`. The full view's `heroloaded` event releases the clear header, and the water's `accentwave` event, set in Accent water (5.9), releases the players reveal. Both belong to the shell's window contract in Shell behaviours (6.7). A terminal plays when the visitor points at it with a mouse, or when 60% of it is in view on a touch screen.

#### Reasons

- Every hero part waits for the one it sits on. The numbers describe the floor, so they land after it. The scroll cue and wave button act on the finished hero, so they come last.
- The full view holds scroll while it loads because its first screen is the floor. Letting the visitor scroll past a half-built hero would make the first impression the loading state, and the page would jump when the floor arrived. The hold catches only wheel, touchmove and the scroll keys, and leaves overflow alone, so the scrollbar never shifts the layout. The 12s give-up keeps a device with no WebGL from being stuck behind the loader.
- The scroll line is scroll-driven, not timed, so the visitor sets the pace and scrolling back plays it in reverse. The 0.82 completion point leaves the finished line on screen for a beat before the water comes.
- Typing at 34ms a character is quick enough not to bore and slow enough to show that something typed it. The pauses after a command and between lines sit where a real agent would be working.

#### Performance

Each sequence is timers plus transform and opacity, except the floor's own intro, which is a crossfade inside its last render pass. Only the one terminal being looked at runs. The one CSS effect in these sequences is the floor logo's feathered edge, a mask on a still image (HeroBits.tsx:152), which leaves before the tiles come in. New sequences use no CSS blur, filter, blend or mask.

#### How to change a sequence safely

Change the constants where they are declared (`hero-intro.ts`, `ScrubLine.tsx`, `AccentWave.tsx`, `jump.ts`, `JobTerminal.tsx`, `PlayerDoodles.tsx`, `usePlayerMode.ts`, `SafariScroll.tsx`) rather than adding delays elsewhere, because the parts read each other's numbers. The container's 1.8s extras assume the 0.5s hold and the 0.9s rise, and the doodles' delay and pace are set against the players' first switch: the delay and the switch moved to 1s and 5s with the pace left at 0.6, and the hand no longer finishes first. Keep the hold and the give-up together. Re-check the timelines in the guide afterwards.

#### Reduced motion

The terminal shows its finished run and the scroll line shows the filled line. The hero intros, the glide and the players' auto switch and desktop Safari's magnet do not change yet, gaps tracked in Reduced motion (4.6). The water needs no change, since its level is the scroll.
