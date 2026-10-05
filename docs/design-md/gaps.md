### Known gaps

The guide records these and the owner decides. Nothing here was fixed while building the guide, because guide work never changes the live site, and each fix is a product change with its own review.

#### What the guide cannot catch, and what covers it instead

- **Forced states on shipped parts.** Hover written as a Tailwind `hover:` class, and state held in a motion value, cannot be switched on from outside the component. The guide falls back to a live cell and a written value list, which can fall behind the part, so a change to a shipped part's hover needs a look at its section.
- **Reduced motion.** A page has no way to turn `prefers-reduced-motion` on for itself. The OS switch or devtools emulation is the only real test.
- **Mac Chrome compositing.** The 30 fps fallback appears only in Chrome on Intel and dual-GPU Macs, and no page can read its own compositing mode. The rule is kept by reading the code, and the frame rate by testing on such a Mac.
- **Device GPU limits.** A phone has its own WebGL context limit and slows as it heats. Only the device shows either.
- **Copy drift.** Site copy outside an assertion can change without a trace here. A copy pass belongs on the site page.
- **Unasserted drawers.** Every drawer row that cites a system file carries needles, the exact text it was read off, and a row with none fails Coverage. A row the Components helper makes from a site file carries them too. Rows written by hand against a site file, most of them in the shell, effect and motion sections and a few in Components (the FAQ, the carousel, the terminal), cite their `file:line` with no needle, as do the rows that cite the floor's code under `src/tiles`. One of them can go stale without turning Coverage red, so a change to a part those sections show needs a look at its drawer, and a row that gains a needle leaves this list.
- **Quoted site values.** DESIGN.md's build checks each site value listed in `tools/design-md/facts.mjs` against its source file, and fails when one is gone or when its partial stops saying it. Any other value a partial quotes carries no assertion, so a site change outside that list needs a look at the partial that describes the part, and a new quoted value earns a fact.
- **Rendered drift.** A passing assertion proves the text is still in the source. A Tailwind upgrade or a new font file can still move pixels, so a visual pass after either is the cover.

#### Site defects

Severity: **high** breaks a rule the site states for itself (the compositor rule, keyboard access), **medium** degrades a real visit, **low** is drift or housekeeping. Line numbers are as of 2026-10-05. The guide reads them from each defect's evidence when it builds, so its table is the current one.

| Area | Severity | Part | Where | Fix direction |
| --- | --- | --- | --- | --- |
| Performance | high | LanguageMenu | LanguageMenu.tsx:21-23, 78 | drop the blur variants and the backdrop blur, keep the spring and the solid white panel |
| Performance | high | Card sheen | globals.css:246-262 | redraw with background layers, as the system Card does, decision 9 in Decisions pending (10.3) |
| Performance | medium | FloorLogo | HeroBits.tsx:152 | fade the logo's edge in its artwork or a canvas, not mask-image |
| Performance | low | /tiles hint | tiles/page.tsx:14 | a solid pill, since the page exists to measure the floor |
| Accessibility | high | Focus | src/components/website | one ring for every control, the system's focus helpers |
| Accessibility | high | ModeToggle | ModeToggle.tsx:27 | arrow keys and a roving tab stop, as the system Segmented has |
| Accessibility | high | Jobs tabs | Jobs.tsx:116 | arrow keys, a roving tab stop and aria-controls, as the system Tabs has |
| Accessibility | medium | PlayerTraits | PlayerTraits.tsx | role meter with its value, minimum and maximum |
| Accessibility | medium | JobTerminal | JobTerminal.tsx:134 | hide the decoration, keep the answer line readable |
| Accessibility | medium | Small targets | PlayerCarousel.tsx:16, 104 | 44px arrows (the lg icon button) and taller dot hit areas |
| Accessibility | low | BackToTop | BackToTop.tsx:60 | inert while hidden |
| Accessibility | medium | Glide and floor | glide.ts, SafariScroll.tsx, usePlayerMode.ts, src/tiles | under reduced motion: jump instead of glide, settle desktop Safari's players magnet at once, hold the players' auto switch, and hold the floor's intro |
| Accessibility | medium | Ping and pulse | Hero.tsx:238, Players.tsx:269 | the motion-safe variant on both loops |
| Accessibility | medium | Accent text | Header.tsx:86, Hero.tsx:245 | the accent ink for text under 24px, decision 1 in Decisions pending (10.3) |
| Accessibility | medium | Skip link | website/page.tsx:25 | a SkipLink first in the body, and an id on `main` for it to land on |
| Accessibility | low | Footer stubs | Footer.tsx:18, 94-95 | an `href` on each link, or plain text until it has one |
| Accessibility | medium | Glide focus and hash | jump.ts:38 | move focus to the target's heading and update the hash with `history.replaceState` |
| Accessibility | medium | LanguageMenu highlight | LanguageMenu.tsx:72 | `aria-activedescendant` on the focused trigger, with `aria-controls` |
| Accessibility | low | Comparison headings | Understands.tsx:70, 77 | an h3 per name under a visually hidden h2, so heading navigation finds the section, with no change to the look |
| Accessibility | low | Language of parts | LanguageMenu.tsx:96 | a `lang` on each row's label (ko, ja, zh) |
| Accessibility | medium | HeroLoader label | HeroLoader.tsx:48 | the body slate `#475569` for the label (7.0:1), since its slate-500 holds near 4.4:1 on the hero grey |
| Behaviour | medium | Mobile menu rows | ClickLock.tsx:11, MobileMenu.tsx:86 | close the sheet before ClickLock's capture, or let ClickLock spare the menu |
| Behaviour | medium | Page hold | MobileMenu.tsx:17 | release the hold when the md query starts to match |
| Behaviour | low | Language in the sheet | MobileMenu.tsx:108 | lift the chosen language above the sheet |
| Behaviour | low | Header on reload | Header.tsx:44 | read the scroll once on mount |
| Drift | low | Navies | website | ink and primary by role, terminal and logo core as their own tokens, decision 4 in Decisions pending (10.3) |
| Drift | low | Slates | website | one source per role, the v4 classes or the hex, never both |
| Drift | low | Hairlines | website | one alpha for the hairline, one named step for the firm line |
| Drift | medium | Ease | website | one ease token in the theme, decision 7 in Decisions pending (10.3) |
| Drift | low | Radius | website | one spelling per step |
| Drift | low | Header offsets | Understands.tsx:64, Hero.tsx:169 | one header height token |
| Drift | low | Players gutter | Players.tsx:112 | 16 on phones, as every other section takes |
| Drift | low | Hero row gutter | Hero.tsx:101 | 16 on phones, as every other row takes |
| Drift | medium | font-mono | Players.tsx:252, globals.css | map --font-mono, decision 8 in Decisions pending (10.3) |
| Dead code | low | Player card classes | Players.tsx:212, 220 | remove the classes a hidden grid never shows |
| Dead code | low | Prism sweep | PrimaryCta.tsx:25, 112 | remove the branch, which also breaks the compositor rule |
| Stale comment | low | Charcoal copies | characters.js:5, interact.js:6 | say blue hologram |
| Stale comment | low | Doodle pace | PlayerDoodles.tsx:22-23 | say the hand ends just after the first switch and the copy waits on it |
| Stale comment | low | Hero waves | Hero.tsx:32 | describe the waves Hero asks for |
| Stale comment | low | Floating tiles | FloatingBadges.tsx:11 | say what touch screens do |
| Tooling | medium | render.cjs | render.cjs:13 | add the /tiles-holo/ route |
| Tooling | low | floorRough | floor-material.js:15 | set floorRough in floor-params.json or drop the read |

#### System parts under a bar

The system's own parts, which the guide shows and the site does not ship yet. Each waits on a call or a fix in the part.

| Area | Severity | Part | Where | Fix direction |
| --- | --- | --- | --- | --- |
| Accessibility | medium | White labels on the accent | segmented-styles.ts, slider-styles.ts, Slider.tsx, Switch.tsx, progress-styles.ts, chip-styles.ts, button-styles.ts | full white at 12 to 15px reads 4.49:1, a hair under 4.5: small labels onto a white surface in ink, decision 2 in Decisions pending (10.3) |
| Accessibility | medium | On-blue Badge | Badge.tsx | its white label on the 15% glass is well under 4.5:1: drop the glass, as the Chip did, or keep it to words the copy around it also says |
| Accessibility | low | Success Badge on the page | Badge.tsx | the success text on its tint falls just short over the page: a darker success ink, or a white surface under it |
| Accent rule | medium | Dots on a light ground | StatusDot.tsx, Avatar.tsx, Badge.tsx | the live dots fill with the accent outside the players: name them the rule's one exception, decision 3 in Decisions pending (10.3) |

**Why record and not fix.** A guide that quietly repairs the site stops being a record of it, and each repair needs the owner's eye on the live page. Every row names its evidence, so when one is fixed its row in the guide turns to "recheck" on the next build, and the entry here can be closed.
