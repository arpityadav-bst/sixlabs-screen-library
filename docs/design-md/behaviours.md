### Shell behaviours

**Purpose.** The shell's invisible parts: ClickLock, the glide every in-page link takes, Safari's scroll, and the window contracts the shell's parts talk through. None has a look, so the guide lists them as tables, and this chapter gives the reasons.

**ClickLock.** A temporary lock for the walkthrough, where the page is only scrolled. On both website pages every `a` and every `[data-cta]` control does nothing on click or middle click, while hover still shows, so a reviewer sees each link's response without leaving the scroll. Click and auxclick are caught on the document in the capture phase, before React sees them. The page's own controls (the menu button, the veil, the language menu, the floating Back to top, the wave button, the players' controls, the FAQ, the jobs tabs) carry no `data-cta` and keep working. To lift it, remove `<ClickLock />` from the pages.
- Side effects: the mobile menu's rows are links, so tapping one no longer closes the sheet. Enter on a link and Space on a `[data-cta]` button fire a click, so the keyboard is locked too. A locked control gives no feedback.
- Never mount it in a document that has navigation of its own (the guide included). It is document-wide. The guide mounts it only inside the shell's frames, which are separate documents.

**The glide.** Each in-page link glides to where its section rests, not to its raw top: the scroll line rests where it has just filled, the players where the water has filled the view, every other section with its top padding showing under the fixed bar. The run is the page's own rather than the browser's smooth scroll because the browser's is quick and fixed, while a long page needs a run the eye can follow.
- Ease: `1 − (1 − k)³`, a quick start that settles (`--ds-ease-glide` is its CSS twin).
- Duration: `min(2.2, 0.9 + distance / 4000)` seconds. Short hops still read as motion, long ones never drag past 2.2s.
- Input: wheel, touchmove and the scroll keys are held for the whole run, so it is always seen whole and never fights the reader's own scroll.
- Snap: the page's scroll snap (the players' magnet) is off for the run and restored after, so a glide that passes the players is not caught by it.
- On desktop Safari the glide runs on Lenis with its lock in place of the frame loop.
- Without scripts each link keeps its `#hash`, so it still jumps.

**Safari scroll and the magnet.** Outside desktop Safari the players' magnet is only the CSS proximity snap on `#players` (globals.css), which catches only a scroll that ends near the players. There is no catch in script there and nothing holds the input. Desktop Safari moves the page on a thread of its own, ahead of the page's drawing, so the accent water's edge trailed a quick scroll. There the page scrolls on Lenis (lerp 0.15), in step with the drawing, and Lenis cannot take CSS scroll snap (globals.css turns it off under Lenis), so the magnet is a catch in script (SafariScroll.tsx): a scroll that rests 120ms within 0.3 of a screen of `#players` glides the rest of the way in 0.6s on the glide's ease, run as a Lenis `scrollTo` without the lock. It does not start while a link's glide is under way. Touch screens scroll natively everywhere (Lenis smooths only the wheel and trackpad), so they get the snap alone. A catch of 0.6 of a screen in every browser kept pulling the page back to the players as the visitor scrolled away, so the catch stays small and Safari's own.

**Window contracts.** The shell's parts never import each other's state. They meet on the window, which makes these names the shell's state API:
- `heroloaded` (Event): the full view's loading has ended, or 12s have passed. The clear header waits for it.
- `accentwave` (CustomEvent, `{ filled }`): sent by the water as it fills and drains, with the thresholds set in Accent water (5.9). The header turns white and the players wait for it.
- Scroll thresholds: 4px (the header's stroke), 40px (the cue leaves).
- Ids: `#model-line` (the scroll line's track, read by BackToTop, the spots, the water and the ASCII field), `#site-head` (the bar, whose height a spot subtracts), `#players` (the magnet's point), `[data-covers-view]` (the full view's hero fills the screen), and the `onblue:theme` event the ASCII field listens for.

**How to change it safely.** Add a new signal as a window event with a constant exported from the file that sends it (as `HERO_LOADED` is), and list it in the guide's contract table. Never rename an id without a search across `src/components/website`, because each is a string repeated in several files. Never render `#players`, `#model-line` or `#site-head` in a document that also runs the site's scroll code.

**Gaps.** The glide ignores reduced motion (a 0.9 to 2.2s forced animation) and cannot be cancelled. Desktop Safari's magnet ignores it too, a 0.6s glide on Lenis. It moves neither focus nor the URL hash, so Back does not return and a screen reader stays where it was. Sections have no `scroll-margin-top`, so the no-script hash lands under the bar. Understands and Closing have no spot, and Case Studies has no target. New work: under reduced motion jump at once, move focus to the target's heading, update the hash with `history.replaceState`, and give every section a `scroll-margin-top` of the bar's height.
