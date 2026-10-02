### The accent rule

The brand blue `#1a6dff` does two jobs on 6labs. As a fill it is the water the players stand on, and that stretch of the page is the only place it fills anything. On a light ground it marks attention: the word to read first, the link under the pointer, the thing that is live, the control that has focus. Every chapter that uses the blue applies this rule and points here for the reasons, so they are written once.

#### Where the accent may appear

| Use | Where | Why it is allowed |
| --- | --- | --- |
| The water | the players section, drawn by AccentWave, Accent water (5.9) | it is the one fill |
| A word or two of type | the closing words of a heading, the noun a claim turns on, the typed word | display sizes, where it clears the large-text bar of Contrast (2.3) |
| Icons | the job tags, a link's arrow on hover | an icon is read by its shape, against a 3:1 bar |
| Shipped dots | the hero's live ping (Hero.tsx) and the pin dots on the label leaders of the footer copy line (CopyLine.tsx) | shipped fact, recorded as the site draws it |
| System dots, pending | StatusDot's live tones, an avatar's live dot, the live badge's dot (the index card's pins are navy) | pending decision 3 in Decisions pending (10.3). Until the call they are an open exception, not part of the rule |
| Links on hover | text links, the header tabs, the footer links | a passing state, never the resting colour of small copy |
| The focus ring | every light ground, Focus (2.10) | focus is where attention is |
| The caret and the sheen | TypedWord's caret, the card sheen's light | light catching, never depth, as Stroke and elevation (2.8) has it |

On dark grounds the accent lifts to `#6ea8ff` (`--ds-color-accent-on-dark`): the terminal's answer line, the ring on navy, a toast's action. On the water itself white takes the accent's job, for the reason under Reasons below.

#### Never

- A fill on a control, a chip, a tab, a checkbox, a card, a badge, a bar or a section, on any ground.
- A selected, checked, pressed or toggled state. Those take the primary navy `#0a152d` on every light ground, the container included, and a read-only checked mark takes the muted slate `#64748b`, so it reads as set but not live. On the accent water the chosen state is white with ink, for the reason below.
- Small copy on a light ground (under 24px, or 18.66px bold) while the accent ink is undecided, decision 1 in Decisions pending (10.3).
- A whole line of a heading. Section head (7.16) gives the typographic reason.
- A second blue surface anywhere, the guide's own chrome included. The guide fills with the accent only to show the water and to show a Don't.

#### Reasons

- **One fill makes the water an event.** The page builds to the moment the water rises over the scroll line and the players arrive on it. A second blue fill anywhere would turn that moment into a colour scheme, and the players would lose the ground that marks them out.
- **An accent that stays small keeps its meaning.** On a light page the eye goes to the blue first. When the blue is one word, that word is what the visitor reads first. When it is a whole box, there is nothing left to point at.
- **Navy carries state because the accent carries attention.** If a selected chip were blue, the page would have two blues meaning two things, and the water would read as "selected". Navy also holds white type at 18:1, where the accent gives 4.49:1, so a chosen state stays legible at any size.
- **White is the chosen state on the water.** Nothing on the blue can stand out by being bluer, and navy is not the brightest thing there, so on the water white takes the accent's job and a chosen control is white with ink, as ModeToggle ships it. Every part with an on-blue form points here for this reason.
- **The dot is a light, not a fill, if the owner agrees.** At 6 to 8px a status or pin dot has no area to read as a surface, and the accent is the colour the page already uses to mark a point: a live state, the spot a label names. That is the case for decision 3 in Decisions pending (10.3). Until the call, the hero's shipped ping and the copy line's pins are the site's own fact, the system's dots are pending, and a badge round a dot never fills.
