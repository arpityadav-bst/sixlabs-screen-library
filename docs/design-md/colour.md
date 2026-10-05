### Colour roles

Every interface colour on 6labs has a role name, and a part picks its colour by role, never by eye. The values mirror what the site ships today, and the system adds only what the site lacks. The full table of names, values and sources is generated from `src/components/design-system/tokens.ts` in chapter 3, so this chapter gives the tiers and the reasons.

#### Values

The tiers are accent, ink and its alpha ladder, primary, grounds, fills, text, lines, status, and veils and halos. Every value, with its role, its use, its misuse and the source line it mirrors, is in chapter 3, from Accent (3.1) to Veils and halos (3.9), generated from the tokens, so this chapter does not type them again.

Tailwind v4 slate classes resolve to oklch. Each of those tokens keeps the oklch as its value and carries the sRGB hex beside it, so the contrast maths has a plain base.

#### Use for

- **Ink** is the colour of headings, body ink, icons, the wordmark and the shadow ink. Its alpha steps each do one job: the quiet control label (70), the touch-target key (45), dashed guide outlines (40), the leader line and the vs word (30), the menu veil (20), the unlit scroll words (15) and the hairline on a tinted ground (8). The 45 and 40 steps are the guide's own, and no site part reads them.
- **Primary** is the fill of Try now, the 6labs card, the selected tab, and every checked, pressed or selected control on a light ground, the container included. On the accent water the chosen state is white with ink instead, for the reason in the accent rule (chapter 8).
- **Grounds** nest in one order: page, container, surface, sunken. The footer lays black at 4% over the page, and its tail lays it twice.
- **Text** runs ink for headings, body for copy that must be read, muted for labels and taglines on white, and quiet for eyebrows and status that the reader can skip.
- **Lines** draw card and row edges at rest in the hairline, hover and open edges in the strong line, and every field edge in the field line.
- **Accent** is for display words, links on hover, the hero's live ping, the typed caret and the focus ring. The system's dots are pending, decision 3 in Decisions pending (10.3).
- **Status** labels a result or an error, on its own 8% tint.

#### Never for

- Ink never fills, and primary never sets type. They differ by 1.05:1, so the only thing that keeps them apart is the role.
- The accent never fills anything outside the players section, and never fills a selected or checked state.
- Muted never carries copy on the container, and quiet never carries anything a reader must read.
- A hairline never draws a field edge.
- A fill token never marks a selected state.
- A veil is never blurred.

#### Reasons

**Two navies.** The site writes `#0a1b33` for type across its parts and `#0a152d` for the call to action, the 6labs card and the selected tab. Merging them would change the live site, and keeping both with no names would let them swap at random. So each keeps its value and gets a role. The terminal body `#0b1526` and the logo core `#030D2D` are two more navies a point or two away. They belong to their contexts, under Special palettes (2.2), and never stand in for either.

**One accent fill.** The accent's two jobs, the water and attention, and why selected, checked and pressed states take navy instead, are the accent rule in chapter 8.

**The container is darker than white.** `#f5f6f8` is the hero container look, a step lighter than the white floor draws under its lighting, so the loader box and the loaded floor read as one colour. The ChatGPT card keeps the earlier grey `#e3e5e8` as its own token, `--ds-color-container-deep`. Text greys are graded on the container separately, in Contrast (2.3).

**The field line is new.** The card hairline is 1.18:1 on white, which groups content but cannot mark an edge a visitor has to find. `#848fa1` reaches 3.26:1, the non-text bar, and stays quieter than ink.

**Status colours are system additions.** The site has no error, success or warning state today, so these are the system's own. Each text step clears AA on white, and the 8% tints keep a status from shouting over the navy.

**A veil is solid ink.** A blurred veil breaks the compositor-safe rule (5.13). Ink at 40% hides the page as well and costs nothing.

**Raw values today.** The site writes nearly every colour as a raw hex or a Tailwind class, with only the accent and two fonts in `@theme`. The guide's drift table counts each spelling at build. It shows `#64748b` beside `text-slate-500` (about `#62748e`), `#475569` beside `text-slate-600`, three alphas of the slate-200 hairline, and the accent written as a hex, a class and rgb numbers. Until the owner merges them on the site, every new part reads the token instead of any of these spellings. Chapter 0 says how a token is added or changed.
