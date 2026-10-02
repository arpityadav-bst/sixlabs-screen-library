### Scroll line to players

**Purpose.** The middle of the page. The scroll line (a 390vh track with a sticky stage) fills its sentence word by word, the accent water rises over its last screen, and the players section arrives standing on the water: the selected player's name, body, traits and Human / AI switch, their portrait, and four cards to pick another. It is the only stretch of the site filled with the accent.

**Why it is the one accent fill.** The water is a transition the visitor causes by scrolling. It turns the page from talking about models to showing them, and the players are the models. Giving the players a ground no other section has makes them the centre of the page without a heading saying so.

**Composition.** From lg: a 480 column on the left (Outfit 34 / 56 title, an 18px body at white 80%, the traits 40 below, the switch 40 below that) and the portrait filling the rest over a soft radial glow, its chest running under the four selector cards along the bottom. Below lg it is one view: the portrait with arrows at its sides, the slim switch riding up over its faded chest, then a carousel of name, body and dense traits.

**How it comes in.**
- **The overlap.** The section is pulled up a screen (`-mt-[100vh]`) over the scroll line's last view, so it is already in place when the water has filled the screen. Without the overlap the visitor would scroll through an empty blue screen to reach it.
- **The reveal gate.** It waits for the water's `accentwave` event with `filled: true`, sent as Accent water (5.9) sets out, and for 20% of itself to be in view. Both are needed: the event alone would reveal it while still off screen on a tall window, the view alone would reveal it on the light page before the water. Once revealed it stays, so scrolling back and forth does not replay the entrance or redraw the doodles.
- **The entrance.** Each part rises 24px over 0.5s on the one ease, the cards first and 0.05s apart, then the portrait, the switch, and the column and carousel last.

**The portrait height.** `--ph = min(720px, (100svh - 344px) / 0.756)`. 344 is the room the header clearance and the cards need. 0.756 is the share of the portrait that adds to the section, since the cards cover its bottom 24.4%. Below lg the formula changes to fit the portrait, switch and carousel in one screen, capped at 520 and at the content width. The section always fits one view, so picking a player and seeing them never needs a scroll.

**Auto mode.** While the section is shown, the portrait swaps between the human and the AI copy every 10s, so a visitor who never touches the switch still sees both. The first pick stops it for that player.

**Accessibility.** The cards are toggle buttons with `aria-pressed`. The switch is a radiogroup. Only type in white (or on a white card) sits on the water, because white is the most contrast the blue allows (4.49:1) and navy reaches only about 3.8:1. The section is the page's one scroll-snap magnet, set to proximity, so it catches a scroll that ends near it and leaves every other scroll alone.

**Responsive.** One switch at lg. Below lg the side column and the cards give way to the carousel and the arrows.

#### Gaps

- The accent ground is not part of the section. It lives in AccentWave, so the section cannot stand alone (the guide frames it on a solid accent ground and sends the event itself).
- The selector card and the player detail block are inline in Players.tsx, which is near the 300-line limit.
- The entrance has no reduced-motion branch, and the selector cards differ mainly by opacity.

#### Do / Don't

- Do keep every word on the water white, or on a white card.
- Do let the water reveal the section rather than the scroll position alone.
- Don't add a second section on the water.
- Don't set navy type straight on the blue.
