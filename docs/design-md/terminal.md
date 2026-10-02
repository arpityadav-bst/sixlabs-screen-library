### Terminal

**Purpose.** Each job card shows the agent doing that job instead of describing it. The terminal plays the job's run once, when the reader points at it, and keeps the result on screen as the card's evidence. Only the window being looked at moves, so the section asks for no attention it has not been given.

**Anatomy.** A flat dark window with no shadow, so it sits in the white card as a screen rather than a floating panel. A title bar holding only the three traffic-light dots, because a title or buttons would compete with the run. A fixed body set like a real terminal: JetBrains Mono, a command at the left after its prompt, everything it prints indented 2ch under it, and one grid for all output (a glyph or label column, then the text). While it waits the body is not an empty box: the page's ASCII field churns in it, brightest at the middle, over a faint glow rising from the foot, and on a mouse device a breathing pointer with a spreading ring says that pointing runs it.

**Variants.** None. There is one dark window, and what it plays is data, the run below. A light theme is one of its gaps.

**Sizes.** One. The body is 300 tall with type at 12.5 / 22, stepping down on a phone as Responsive says.

**The Step schema.** A run is an array of steps from jobs-data.ts, each `{ gap? }` plus one kind: `cmd { text }`, `load { text, ms? }`, `out { text, tone?: "dim" | "ink" }`, `kv { k, v, accent? }`, `check { text }`, `bar { text, value, of }`. `gap` puts a blank line before a step, between a command's working and its result. `accent` marks the run's answer and nothing else. A bar is drawn against the largest share in its group (`of`), so the leading share fills its track and the others read relative to it. Every figure in a run comes from the job's example on the page, none is new.

**Colours.** Commands white, working slate-400, results slate-200, labels and glyphs slate-500. The answer takes the accent lifted to #6ea8ff, because #1a6dff is too dark to read on #0b1526 and one bright line is where the eye should land. The window colours (#0b1526, #111d31 and the dots) are terminal tokens and never leave the terminal.

**States.** Idle on a mouse device: the empty prompt with its blinking cursor, the field, the glow and the hint. Idle on touch: no hint, since nothing can be pointed at, and the run starts once 60% of the window is in view. Playing. Done: the whole run stays and never replays, because the finished run is the card's content. Reduced motion: the finished run appears the moment it is asked for.

**Props.** `run: Step[]` and `play: boolean`. `play` starts the run once, a later false does not stop it, and a fresh run needs a remount (a new `key`).

**Motion.** A command types at 34ms a character and then holds 280ms. Each later step dwells before the next one starts: out and kv 420ms, check 200ms, bar 360ms, load 1300ms or its own `ms`. A line enters over 0.25s (opacity and a 3px rise), a bar grows over 0.6s and a load bar fills linearly over its dwell. The three runs take 3.6 to 6.7 seconds, short enough to watch to the end and long enough to read as work. The idle layer fades over 700ms and the field stops drawing at 800ms.

**Accessibility.** The whole window is aria-hidden, so the run's answer, the most useful line in the card, never reaches assistive tech. A visually hidden summary of the result belongs beside it. With nothing focusable inside, a keyboard cannot start it either, and only the touch path or the card's pointer does.

**Responsive.** Under md the body drops from 300 to 292 tall and the type from 12.5 / 22 to 11.5 / 20, so the longest run still fits a phone card. The hint shows only where there is hover and a fine pointer.

**Performance.** A waiting terminal runs its ASCII field on an animation frame loop while it is on screen, and the loop ends once the run has faded the field out. A view should hold as few idle terminals as it can. The hint's soft shadow is a pre-blurred SVG picture, not a CSS drop-shadow, under the compositor-safe rule (5.13).

**Gaps.** The height is fixed with no scroll, so a longer run clips at the foot. There is no replay control, no failed or warning step kind and no light theme. The timings are module constants JobTerminal does not export.

**Do / Don't.**
- Do keep a run inside the body, about eleven lines with its gaps.
- Do put the accent on the answer only.
- Don't add a shadow, a title or controls to the window.
- Don't mount several idle terminals in one view.
