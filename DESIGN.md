# 6labs design system

<!-- Built by tools/design-md/build.mjs from docs/design-md/*.md, the guide's catalog and tokens.ts. Do not edit by hand. -->

_Assembled from `docs/design-md/` by `node tools/design-md/build.mjs`. Edit the partials, not this file._

## Start here

**What this is.** The 6labs design system comes in two halves. The live guide at `/design-system` renders every part from the site's own components, with its states forced and its exact values in a drawer. This file gives the rule and the reason behind each part. The guide shows, this file explains, and each guide section carries a chip with its number here. About this document ([chapter 0](#0-about-this-document)) has the full contract between the two.

**Where things live.**
- `src/app/design-system/` is the guide. `_data/catalog*.ts` is its one catalog of groups, sections and covers, `sections/<group>/` holds a file and a data module per section, and `_kit/` holds the building blocks, with its API in `_kit/README.md`.
- `src/components/design-system/` holds the system's own parts and the tokens: `tokens.ts` and its `token-*.ts` families.
- `src/components/website/` and `src/components/tiles/` are the live site. The guide imports them and never edits them.
- `docs/design-md/` holds the partials this file is built from, one per guide section. `tools/design-md/` holds the build and the checks.

**Add a part.** Build it in `src/components/design-system/` from `--ds-*` tokens only. Show it in its section with a Spec and a state grid, add it to that section's covers in the catalog with the states the grid shows, and spec it in the section's partial under the ten labels, Purpose first. A piece that only lives inside another part goes in `INTERNAL_PARTS` instead, and owes no specimen.

**Add a section.** Add its entry to its group's `catalog-*.ts` file (id, title, file, its number here, covers), write the section file under `sections/<group>/` and import it in `sections/registry.tsx`, keep its values in a data module listed in `meta/meta-modules.ts`, then write `docs/design-md/<id>.md` headed with the section's title. The catalog number places it in this file.

**Change a token.** Edit its entry in its `token-*.ts` family with the source it mirrors, then rebuild this file so the Tokens reference ([chapter 3](#3-tokens-reference)) carries the new row. About this document ([chapter 0](#0-about-this-document)) lists the steps. A token never reaches the live site, which does not read `--ds-*`.

**Run the checks.** `node tools/design-md/build.mjs` rebuilds this file after a partial or a token changes. `npm run ds:check` runs TypeScript, the DESIGN.md check and the guide's own build checks (the catalog, the tokens, the source reads and every assertion), and exits non-zero on any failure. It is not part of `next build`, so documentation drift never blocks a deploy.

**Where values come from.** A value the guide prints is one of three kinds: a token read from `tokens.ts`, a value copied from a site or system file with the `file:line` it was read off and, wherever an assertion holds it, the exact text there (its needle), or a measurement the guide takes as the page builds or in the browser. Coverage ([10.1](#101-coverage)) counts every assertion and turns red when a file stops saying what the guide prints. Known gaps ([10.2](#102-known-gaps)) lists what no assertion reaches.

## Contents

- [Start here](#start-here)
- [0 About this document](#0-about-this-document)
- [1 Principles](#1-principles)
- [2 Foundations](#2-foundations)
  - [2.1 Colour roles](#21-colour-roles)
  - [2.2 Special palettes](#22-special-palettes)
  - [2.3 Contrast](#23-contrast)
  - [2.4 Type](#24-type)
  - [2.5 Spacing and rhythm](#25-spacing-and-rhythm)
  - [2.6 Layout and breakpoints](#26-layout-and-breakpoints)
  - [2.7 Radius](#27-radius)
  - [2.8 Stroke and elevation](#28-stroke-and-elevation)
  - [2.9 Icons](#29-icons)
    - [Icon](#icon)
  - [2.10 Focus](#210-focus)
    - [SkipLink](#skiplink)
  - [2.11 Accessibility baseline](#211-accessibility-baseline)
- [3 Tokens reference](#3-tokens-reference)
  - [3.1 Accent](#31-accent)
  - [3.2 Ink and its alpha ladder](#32-ink-and-its-alpha-ladder)
  - [3.3 Primary](#33-primary)
  - [3.4 Grounds and surfaces](#34-grounds-and-surfaces)
  - [3.5 Fills](#35-fills)
  - [3.6 Text](#36-text)
  - [3.7 Lines](#37-lines)
  - [3.8 Status](#38-status)
  - [3.9 Veils and halos](#39-veils-and-halos)
  - [3.10 On blue](#310-on-blue)
  - [3.11 Terminal](#311-terminal)
  - [3.12 Hologram and glow](#312-hologram-and-glow)
  - [3.13 Chromatic fringe](#313-chromatic-fringe)
  - [3.14 Brand mark](#314-brand-mark)
  - [3.15 Type families](#315-type-families)
  - [3.16 Type scale](#316-type-scale)
  - [3.17 Spacing](#317-spacing)
  - [3.18 Layout](#318-layout)
  - [3.19 Breakpoints](#319-breakpoints)
  - [3.20 Radius](#320-radius)
  - [3.21 Stroke](#321-stroke)
  - [3.22 Elevation and glow](#322-elevation-and-glow)
  - [3.23 Focus](#323-focus)
  - [3.24 Icon sizes](#324-icon-sizes)
  - [3.25 Z-scale](#325-z-scale)
  - [3.26 Eases](#326-eases)
  - [3.27 Durations](#327-durations)
  - [3.28 Springs](#328-springs)
  - [3.29 Press and grow scales](#329-press-and-grow-scales)
  - [3.30 Travel](#330-travel)
  - [3.31 Type roles](#331-type-roles)
- [4 Motion](#4-motion)
  - [4.1 Easing, duration, springs](#41-easing-duration-springs)
  - [4.2 Entrance and reveal](#42-entrance-and-reveal)
  - [4.3 Micro-interactions](#43-micro-interactions)
  - [4.4 Ambient loops](#44-ambient-loops)
  - [4.5 Choreography](#45-choreography)
  - [4.6 Reduced motion](#46-reduced-motion)
- [5 Signature effects](#5-signature-effects)
  - [5.1 Layer stack](#51-layer-stack)
  - [5.2 The glass tile floor](#52-the-glass-tile-floor)
  - [5.3 Tile states](#53-tile-states)
  - [5.4 Activation sweep](#54-activation-sweep)
  - [5.5 Characters and holograms](#55-characters-and-holograms)
  - [5.6 Load-in, autoplay and loaders](#56-load-in-autoplay-and-loaders)
  - [5.7 Glyph field](#57-glyph-field)
  - [5.8 Scroll line, liquid and floating tiles](#58-scroll-line-liquid-and-floating-tiles)
  - [5.9 Accent water](#59-accent-water)
  - [5.10 Human / AI swap](#510-human--ai-swap)
  - [5.11 Doodles](#511-doodles)
  - [5.12 Halftone, chromatic split, grain](#512-halftone-chromatic-split-grain)
  - [5.13 Compositor-safe rule](#513-compositor-safe-rule)
- [6 Shell](#6-shell)
  - [6.1 Logo and identity](#61-logo-and-identity)
  - [6.2 Header](#62-header)
  - [6.3 Mobile menu](#63-mobile-menu)
  - [6.4 Language menu](#64-language-menu)
  - [6.5 Footer and copy line](#65-footer-and-copy-line)
  - [6.6 Back to top and scroll cue](#66-back-to-top-and-scroll-cue)
  - [6.7 Shell behaviours](#67-shell-behaviours)
- [7 Components](#7-components)
  - [7.1 Button](#71-button)
  - [7.2 Icon button](#72-icon-button)
  - [7.3 Text link](#73-text-link)
  - [7.4 Segmented control](#74-segmented-control)
  - [7.5 Tabs](#75-tabs)
  - [7.6 Chip](#76-chip)
  - [7.7 Text fields](#77-text-fields)
  - [7.8 Select and search](#78-select-and-search)
  - [7.9 Checkbox, radio, switch](#79-checkbox-radio-switch)
  - [7.10 Slider](#710-slider)
  - [7.11 Card](#711-card)
  - [7.12 Comparison cards](#712-comparison-cards)
  - [7.13 Stats and typed word](#713-stats-and-typed-word)
  - [7.14 Badge, status dot, tag](#714-badge-status-dot-tag)
  - [7.15 Avatar](#715-avatar)
  - [7.16 Section head](#716-section-head)
  - [7.17 Traits and progress](#717-traits-and-progress)
  - [7.18 Player carousel](#718-player-carousel)
  - [7.19 Terminal](#719-terminal)
  - [7.20 Accordion](#720-accordion)
  - [7.21 Spinner and skeleton](#721-spinner-and-skeleton)
  - [7.22 Empty state](#722-empty-state)
  - [7.23 Tooltip](#723-tooltip)
  - [7.24 Toast](#724-toast)
  - [7.25 Dialog and sheet](#725-dialog-and-sheet)
- [8 The accent rule](#8-the-accent-rule)
- [9 Patterns](#9-patterns)
  - [9.1 Surfaces](#91-surfaces)
  - [9.2 Hero](#92-hero)
  - [9.3 Scroll line to players](#93-scroll-line-to-players)
  - [9.4 Light sections](#94-light-sections)
  - [9.5 Page composition](#95-page-composition)
  - [9.6 Responsive ladder](#96-responsive-ladder)
  - [9.7 Forms](#97-forms)
  - [9.8 Loading, empty and failure](#98-loading-empty-and-failure)
    - [Banner](#banner)
  - [9.9 Content and voice](#99-content-and-voice)
- [10 Meta](#10-meta)
  - [10.1 Coverage](#101-coverage)
  - [10.2 Known gaps](#102-known-gaps)
  - [10.3 Decisions pending](#103-decisions-pending)
  - [10.4 Conventions](#104-conventions)
  - [10.5 Changelog](#105-changelog)

## 0 About this document

**What it is.** DESIGN.md holds the rules of the 6labs design system and the reason behind each one. Its pair is the live guide at `/design-system`, which renders the same system from the site's own components. The two split the work: the guide shows a thing, this document says why it is so. A sentence lives in one of them, never both, because two copies of a reason drift apart the first time one is edited and the reader cannot tell which is current.

**How to read the two together.** Each guide section carries a chip with the number of its chapter here, and every numbered section of this document is headed with its guide section's title. Read a chapter for the intent and the limits, then open the section to see the part on the ground it ships on, with its states forced and its values in the drawer. Two chapters have no section of their own. The tokens reference ([chapter 3](#3-tokens-reference)) lists every value the sections draw with, and the accent rule ([chapter 8](#8-the-accent-rule)) is the one rule that every section using the blue applies. It is a chapter of its own, rather than a part of Surfaces ([9.1](#91-surfaces)), because it binds parts of every group, from a chip's selected state to a heading's last word, and a rule that binds every group belongs to none of them.

**Where the text lives.** DESIGN.md is assembled, and its source is the folder `docs/design-md/`. Each guide section has one partial there, named after the section's id (`button.md` holds 7.1), plus `tokens-reference.md` and `accent-rule.md` for the two chapters without a section, `start-here.md` for the unnumbered page that opens the file, and an optional `group-<id>.md` that opens a grouped chapter before its first section. The build, `node tools/design-md/build.mjs` run from the project root, reads the guide's catalog (`src/app/design-system/_data/catalog.ts`) for the order, the numbers and the titles, joins the partials under them, writes the contents and the links, and generates the tables of [chapter 3](#3-tokens-reference) from `src/components/design-system/tokens.ts`. Edit a partial or a token, then rebuild. An edit made in DESIGN.md itself is lost at the next build. `node tools/design-md/build.mjs --check` writes nothing and fails when DESIGN.md is not what the partials build, so a stale file is caught before it is read. `npm run ds:check` runs that check with TypeScript and the guide's own build checks (the catalog, the tokens, the source reads and every assertion Coverage counts), and exits non-zero on any failure. It stays out of `next build`, so a stale document never blocks a deploy. Either way the build fails on a missing or orphan partial, a catalog number out of order, a reference to nothing or one whose lead-in is not its target's title, an em dash or a semicolon in prose, and it warns, without failing, on a heading that differs from its catalog title, a part that lacks one of its ten labels or holds them out of their order, and a `--ds-*` name that TokenStyle does not print. A part counts wherever it is specced: a section of chapters 6 and 7, or a `####` block that opens on its Purpose in any chapter.

**Cross-references.** A reference names its section and gives the number in brackets, as in Tile states ([5.3](#53-tile-states)), says "[chapter 3](#3-tokens-reference)" for a whole chapter, or cites a call as [decision 6](#6-focus-ring-colour). The build turns each one into a link and fails on any number the catalog does not have, and on a bracket whose words before it are not its section's title. That second check is what catches a renumber: an old number that now lands on a different section still resolves, but its lead-in names the section that moved, so the build fails rather than linking to the wrong place. [Chapter 3](#3-tokens-reference)'s sections are generated from the token groups, so a new group renumbers them, and the same check finds every reference to fix.

**Writing a value pair.** A pair of paddings is written vertical by horizontal, the order CSS shorthand takes: padding 14 by 16 is 14 above and below and 16 at the sides. A three-part padding names its sides (28 at the top, 24 at the sides and the foot).

**Tokens.** Every value has one name, a `--ds-*` custom property printed by `TokenStyle` and read only by the guide and the system parts. The site itself still writes raw values (`text-[#0a1b33]`, `[0.22, 1, 0.36, 1]`). Moving those into the site's `@theme` is the owner's call, [decision 7](#7-tokens-in-the-sites-theme) in Decisions pending ([10.3](#103-decisions-pending)), so until then a token is a mirror, and an assertion checks that the source still says what the mirror says. The prefix is what keeps the system from restyling the live page as it grows, because the site never reads it.

**Changing a token.**
1. Edit its entry in the `token-*.ts` file of its family in `src/components/design-system/`: the value, and the role, use, misuse and source that travel with it. A new token starts there too, with the same fields, the first time a second part needs the value.
2. Keep the source true. A mirrored value cites the `file:line` under `src/` it copies, and moves with it when the site's file changes. A value the site does not ship has the source "system".
3. Read the guide. `TokenStyle` prints the new value, and every swatch, drawer and contrast grade recomputes from it, so a change that breaks a pair shows as a fail in Contrast ([2.3](#23-contrast)) and on its swatch.
4. Rebuild DESIGN.md, so [chapter 3](#3-tokens-reference) carries the new row.

A token edit never reaches the live site, because the site does not read `--ds-*`. Changing what the site draws is an edit to the site, with its own review.

**How the guide stays true to the site.**
- It imports the shipped components instead of redrawing them (principle 1 in [chapter 1](#1-principles)), so a change on the site shows in the guide the same day.
- Parts that answer the window rather than their box (the header, the footer, the hero) are framed at true widths, because a viewport query reads the window and a narrow column would show the wrong layout.
- Counts (parts, states, coverage) are read from the catalog and the source when the page builds. None is typed, so none goes stale after an edit.
- A value copied by hand carries an assertion against its source: the type, spacing, layout and radius data, the terminal's private timings, every token that cites a `file:line`, every Anatomy pin, and every drawer row that cites a system file or that the Components helper makes from a site file, each held to the exact text it was read off (its needle). A drawer row that cites a system file with no needle is a failing row of its own. Coverage ([10.1](#101-coverage)) counts them all and turns red when one stops matching. Drawer rows written by hand against a site file, most of them in the shell, effect and motion sections, carry no needle yet, a blind spot Known gaps ([10.2](#102-known-gaps)) lists.
- The floor's palette is read live from the file the floor reads, as Special palettes ([2.2](#22-special-palettes)) explains.
- What none of this can catch, and what covers it instead, is listed in Known gaps ([10.2](#102-known-gaps)).

A figure in this document is a reason ("about 4.3:1 on the page"), never a count, so it holds when a part is added.

**Copy.** Specimen text is quoted from the site's source or is plain filler, never new marketing copy, so the guide cannot put words in the brand's mouth. Prose here and in the guide is present tense and gives reasons rather than adjectives. No em dashes and no semicolons: a comma, a colon, a full stop or brackets do the work, and one punctuation habit across the site, the guide and this file keeps the voice single. Content and voice ([9.9](#99-content-and-voice)) has the rest of the rules.

**Why a guide at all.** The site was built page by page, so its values repeat with small differences (navies a point apart, two slate scales, the ease declared again in every file that uses it). Without a single list, every new part either copies one of those differences or adds another. The guide is that list, kept honest by rendering the real parts instead of describing them.

## 1 Principles

Each principle has the reason it exists, the failure it prevents and the rule that enforces it, linked.

1. **Real parts only.** A specimen that re-draws a part is a second implementation, and the two separate on the first change to either. Importing the shipped component means a change to the site shows up in the guide the same day. *Prevents:* a style guide that looks right and describes a site that no longer exists. *Rule:* Conventions ([10.4](#104-conventions)).

2. **One accent fill.** The players section is the only place the brand blue becomes a surface, because there it is the water that the whole scroll set-piece fills. A second blue surface anywhere else competes with that moment and turns the accent into wallpaper. *Prevents:* the water losing its arrival, and a page that reads as blue everywhere and therefore nowhere. *Rule:* the accent rule ([chapter 8](#8-the-accent-rule)).

3. **Navy carries state, the accent carries attention.** State has to read at a glance and stay readable under white text, and navy does both (white on navy is 18:1). The accent at small sizes fails AA on the light grounds and would also blur the line between "chosen" and "look here". *Prevents:* selected chips, tabs and checkboxes that compete with links and the focus ring for the eye. *Rule:* the accent rule ([chapter 8](#8-the-accent-rule)) and Colour roles ([2.1](#21-colour-roles)).

4. **Light is the material.** The brand is glass, holograms, halftone, grain and the colour split, and every one of them is drawn in canvas or WebGL. CSS blur, blend modes, masks and filters make Chrome on a Mac composite every frame itself. *Prevents:* the 30 fps fallback on Intel and dual-GPU Macs, which drags the floor, the water and the liquid down together. *Rule:* Compositor-safe rule ([5.13](#513-compositor-safe-rule)).

5. **Holograms are the only AI look.** An AI copy is always the faceless blue scan-line hologram, so a visitor learns the sign once and reads it everywhere: the tiles, the Human / AI switch, the footer. *Prevents:* a second AI look (a robot, a glow, a gradient avatar) that splits one idea into two. *Rule:* Characters and holograms ([5.5](#55-characters-and-holograms)).

6. **Every control is complete.** A control that lacks a state shows the gap to someone, usually a keyboard or touch reader, at the worst moment. Rest, hover, focus-visible, pressed and disabled are the floor, with loading, selected or open where the control has them. *Prevents:* the site's present gap, where no part styles keyboard focus at all. *Rule:* Focus ([2.10](#210-focus)), Accessibility baseline ([2.11](#211-accessibility-baseline)) and the States of every part in [chapter 7](#7-components).

7. **One ease, short travel.** One curve makes the whole page feel like one hand moved it. Ambient loops stay small and slow so they sit under reading rather than over it, and they stop when the reader asks for less motion. *Prevents:* a local copy of the ease in every file that uses it, each free to drift apart, and loops that pull the eye off the copy. *Rule:* Easing, duration, springs ([4.1](#41-easing-duration-springs)) and Reduced motion ([4.6](#46-reduced-motion)).

8. **Say it once.** A value with two names gets two values within a month, and a reason written twice gets edited once. *Prevents:* drift between tokens, guide and this document, the failure every other principle is guarded against. *Rule:* About this document ([chapter 0](#0-about-this-document)).

## 2 Foundations

The values every part is drawn with: colour and its contrast, type, spacing, layout, radius, lines and depth, icons, focus and the accessibility baseline. Read Colour roles ([2.1](#21-colour-roles)) and Contrast ([2.3](#23-contrast)) first, because every later chapter picks its colours by role and checks them against those grades. The tables of names and values are in [chapter 3](#3-tokens-reference), so these chapters give the tiers and the reasons.

### 2.1 Colour roles

Every interface colour on 6labs has a role name, and a part picks its colour by role, never by eye. The values mirror what the site ships today, and the system adds only what the site lacks. The full table of names, values and sources is generated from `src/components/design-system/tokens.ts` in [chapter 3](#3-tokens-reference), so this chapter gives the tiers and the reasons.

#### Values

The tiers are accent, ink and its alpha ladder, primary, grounds, fills, text, lines, status, and veils and halos. Every value, with its role, its use, its misuse and the source line it mirrors, is in [chapter 3](#3-tokens-reference), from Accent ([3.1](#31-accent)) to Veils and halos ([3.9](#39-veils-and-halos)), generated from the tokens, so this chapter does not type them again.

Tailwind v4 slate classes resolve to oklch. Each of those tokens keeps the oklch as its value and carries the sRGB hex beside it, so the contrast maths has a plain base.

#### Use for

- **Ink** is the colour of headings, body ink, icons, the wordmark and the shadow ink. Its alpha steps each do one job: the quiet control label (70), the touch-target key (45), dashed guide outlines (40), the leader line and the vs word (30), the menu veil (20), the unlit scroll words (15) and the hairline on a tinted ground (8). The 45 and 40 steps are the guide's own, and no site part reads them.
- **Primary** is the fill of Try now, the 6labs card, the selected tab, and every checked, pressed or selected control on a light ground, the container included. On the accent water the chosen state is white with ink instead, for the reason in the accent rule ([chapter 8](#8-the-accent-rule)).
- **Grounds** nest in one order: page, container, surface, sunken. The footer lays black at 4% over the page, and its tail lays it twice.
- **Text** runs ink for headings, body for copy that must be read, muted for labels and taglines on white, and quiet for eyebrows and status that the reader can skip.
- **Lines** draw card and row edges at rest in the hairline, hover and open edges in the strong line, and every field edge in the field line.
- **Accent** is for display words, links on hover, the hero's live ping, the typed caret and the focus ring. The system's dots are pending, [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)).
- **Status** labels a result or an error, on its own 8% tint.

#### Never for

- Ink never fills, and primary never sets type. They differ by 1.05:1, so the only thing that keeps them apart is the role.
- The accent never fills anything outside the players section, and never fills a selected or checked state.
- Muted never carries copy on the container, and quiet never carries anything a reader must read.
- A hairline never draws a field edge.
- A fill token never marks a selected state.
- A veil is never blurred.

#### Reasons

**Two navies.** The site writes `#0a1b33` for type across its parts and `#0a152d` for the call to action, the 6labs card and the selected tab. Merging them would change the live site, and keeping both with no names would let them swap at random. So each keeps its value and gets a role. The terminal body `#0b1526` and the logo core `#030D2D` are two more navies a point or two away. They belong to their contexts, under Special palettes ([2.2](#22-special-palettes)), and never stand in for either.

**One accent fill.** The accent's two jobs, the water and attention, and why selected, checked and pressed states take navy instead, are the accent rule in [chapter 8](#8-the-accent-rule).

**The container is darker than white.** `#e3e5e8` is the hero container look, reused for the ChatGPT card. Text greys are graded on it separately, in Contrast ([2.3](#23-contrast)).

**The field line is new.** The card hairline is 1.18:1 on white, which groups content but cannot mark an edge a visitor has to find. `#848fa1` reaches 3.26:1, the non-text bar, and stays quieter than ink.

**Status colours are system additions.** The site has no error, success or warning state today, so these are the system's own. Each text step clears AA on white, and the 8% tints keep a status from shouting over the navy.

**A veil is solid ink.** A blurred veil breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)). Ink at 40% hides the page as well and costs nothing.

**Raw values today.** The site writes nearly every colour as a raw hex or a Tailwind class, with only the accent and two fonts in `@theme`. The guide's drift table counts each spelling at build. It shows `#64748b` beside `text-slate-500` (about `#62748e`), `#475569` beside `text-slate-600`, three alphas of the slate-200 hairline, and the accent written as a hex, a class and rgb numbers. Until the owner merges them on the site, every new part reads the token instead of any of these spellings. [Chapter 0](#0-about-this-document) says how a token is added or changed.

### 2.2 Special palettes

Some colours belong to one context: the accent water, the jobs terminal, the holograms and their glow, the chromatic fringe, the floor scene and the logo. Each set lives apart from the UI roles of Colour roles ([2.1](#21-colour-roles)), under its own token names, so a part outside the context cannot pick one up by accident. The rule for all of them is the same. A contextual colour styles its context and nothing else.

#### Values

Every token of these palettes, with its role, use, misuse and source, is in [chapter 3](#3-tokens-reference): On blue ([3.10](#310-on-blue)), Terminal ([3.11](#311-terminal)), Hologram and glow ([3.12](#312-hologram-and-glow)), Chromatic fringe ([3.13](#313-chromatic-fringe)) and Brand mark ([3.14](#314-brand-mark)). The floor scene has no tokens: its fog, floor, environment, top, hemisphere and glow colours and the two tile-state ramps are read from `public/tiles/floor-params.json`, the file the floor itself reads.

#### Use for

- **On blue:** text, tracks, rings and glass on the accent water of the players section, and quiet white on navy (a toast's close, a tooltip's shortcut). Body takes 80%, trait labels 75%, quiet controls 50% (on navy, and on blue for the read-only switch and paused progress), the rest dot and the glass lines 40%, rings 25%, tracks 20% and glass fills 15%.
- **Terminal:** the jobs terminal window only. Its default text is the quiet text role, and the run's one answer is the lifted accent.
- **Hologram and glow:** the AI doodles, the Human / AI laser, the primary button's dot band and the glyph field's sweep, all drawn in canvas or WebGL.
- **Fringe:** the footer wordmark's chromatic split and the glyph pool's colour fringe.
- **Floor scene:** the tile floor's lighting and materials, read by `src/tiles/floor.js`, `materials.js`, `halo.js` and `floor-material.js`.
- **Brand mark:** the 6labs logo as its file draws it, and nothing else.

#### Never for

- On-blue whites never sit on a light ground, where they vanish.
- The terminal palette never styles UI outside the window, and its window dots never stand for status, which takes the status tier.
- The lifted accent `#6ea8ff` never sits on a light ground, where it is 2.41:1 on white.
- Glow, fringe and floor colours never colour text, a control or a line.
- The logo's blue and navy never stand in for the accent or ink, and the accent never recolours the logo.

#### Reasons

**Kept apart by name.** The lifted accent alone is written four ways today (`#6ea8ff`, `#7fb2ff`, `rgba(120,175,255,0.95)`, `#9cc0ff`), each tuned to its effect. Folding them into the UI accent would retune every effect, and leaving them unnamed lets them leak into UI. Each gets one token in its own palette.

**The blue needs its own ladder.** The water under the players moves, so its whites are fixed alphas of one colour rather than tints of the blue, and each strength has one job. Their contrast is in Contrast ([2.3](#23-contrast)).

**The terminal lifts the accent.** `#1a6dff` on `#0b1526` is 4.06:1. `#6ea8ff` reaches 7.57:1, which lets one highlighted value carry the result of a run. The window's traffic-light dots are the operating system's colours, kept because a terminal without them stops reading as one.

**Light is the material.** Glows and fringes carry the brand's look of glass and light, so they are drawn on canvas or in WebGL under the compositor-safe rule ([5.13](#513-compositor-safe-rule)), never in CSS.

**The floor palette is read live.** The guide fetches `floor-params.json` with no cache on every load, so a params edit shows in the guide the moment it lands. That is deliberate. The palette's truth is the file the floor reads, not a copy.

**The spent tint has three values.** `TileFloor.tsx` passes `#e3f3ff` as its default prop, `floor-params.json` says `#e3e5e8`, and `floor.js` falls back to `#b8bbc1`. The prop is always passed, and `floor.js` merges it over the params file, so `#e3f3ff` is the one on screen, for the reason in Tile states ([5.3](#53-tile-states)). To change the tint safely, change the prop default or pass the prop, and bring the params value in line so the next reader is not misled.

**The logo keeps its own fills.** `#1770EF` sits 1.01:1 from the accent and `#030D2D` sits 1.10:1 from ink. Beside a UI part they read as a mistake, so UI parts take the accent and ink, and the line mark drawn as an icon takes ink.

### 2.3 Contrast

Contrast on 6labs is computed, never claimed. The guide works every ratio out from the token values with the WCAG 2 relative-luminance formula, composites any alpha over its ground first, and rounds down, so a pair never reads as passing when it does not. This chapter records what the grades mean for the system and the rules that follow.

#### Values

The bars are WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text (24px, or 18.66px bold) and 3:1 for a line or icon a reader needs to see (1.4.11). The guide also marks AAA at 7:1.

The readings that set the rules, rounded down:

| Pair | Ratio |
| --- | --- |
| Body `#475569` on the container `#e3e5e8` | 6.00 |
| Muted `#64748b` on the container | 3.77 |
| Muted on white | 4.75 |
| Quiet slate-400 on white | 2.63 |
| Accent `#1a6dff` on the page | 4.29 |
| Accent on white | 4.49 |
| Accent on the container | 3.55 |
| White on the accent | 4.49 |
| White 80% on the accent | 3.42 |
| Field line `#848fa1` on white | 3.26 |
| Card hairline on white | 1.18 |
| Ink `#0a1b33` against primary `#0a152d` | 1.05 |

#### Use for

- Copy a reader must read sits on a pair that clears 4.5:1 at its size.
- Large type, 24px and up or 18.66px bold and up, may use a pair from 3:1.
- Field edges, focus rings and meaningful icons clear 3:1 against their ground.

#### Never for

- Muted on the container, where body takes its place.
- The accent on small copy on any light ground. It marks display words, icons, dots, links on hover and the focus ring.
- Small copy on the accent blue, in any white. Text there is large. The system parts that still set small white labels on the water are open, [decision 2](#2-white-labels-on-the-accent) in Decisions pending ([10.3](#103-decisions-pending)).
- Quiet slate-400 for anything a reader must read on a light ground.
- The card hairline as the only edge of a field.

#### Reasons

**The container moves the line.** The hero container is darker than white, and the drop is enough to push muted from 4.75 to 3.77. A text colour is chosen for the ground it lands on, which is why the matrix grades every pair rather than every colour once.

**The accent is a display colour.** At 4.29:1 on the page and 4.49:1 on white, it misses the text bar by a hair and clears the large-text bar, which suits a word in a heading and nothing smaller. The site uses it for small copy in two places today, "Yours next." on the container and the player card's "Running", and the guide lists both with their file and line.

**The blue takes large type.** White itself is 4.49:1 on the accent. Headings on the accent water are therefore white and large. The player body, white at 80% in 16 to 18px regular type, falls short of that, and the guide lists it as a shortfall to fix rather than a pattern to copy.

**Non-text needs 3:1 too.** A field edge a visitor has to find is held to 3:1, which the hairline does not reach. That is why the field line exists. A hairline round a card needs no such bar, because the content inside it already marks the edge.

**Shipped pairs under the line.** Besides the accent and player body cases, the player card's "Model 01" meta in quiet slate-400 is 2.63:1 on white, and the terminal's prompt and labels in Tailwind v4 slate-500 are 3.83:1 on its body at 12.5px. The full view's "Loading" label is the same slate-500 at 11px on the hero grey, 3.77:1, the muted-on-container pair this chapter rules out. The comparison's vs is ink at 30% on its white disc, 1.93:1, and stays there because the word is incidental: the paired cards already say versus, so it falls under the decorative exemption of 1.4.3. The system parts made for the water set their labels in full white at 12 to 15px, 4.49:1, a hair under the bar: the glass Button, the on-blue Chip, Segmented's segments, the Switch's label and the label rows of Slider and Progress on blue. They are open, [decision 2](#2-white-labels-on-the-accent) in Decisions pending ([10.3](#103-decisions-pending)), and Known gaps ([10.2](#102-known-gaps)) lists them. The on-blue Badge, white on its 15% glass, is lower still, as Badge, status dot, tag ([7.14](#714-badge-status-dot-tag)) records.

**Pending: an accent ink for small text.** A darker accent, `#1559d6`, reaches 5.85:1 on the page, 6.11 on white and 4.84 on the container, enough for small accent copy on every light ground. It is [decision 1](#1-accent-text-under-24px) in Decisions pending ([10.3](#103-decisions-pending)), and new work keeps small copy out of the accent meanwhile.

**How to change a colour safely.** Change the token, then read the matrix and the swatch cards. Every grade in the guide recomputes from the new value, so a change that breaks a pair shows as a fail where that pair lives.

### 2.4 Type

Type on 6labs is three faces and a set of named roles. A part never picks a size, weight and tracking one by one: it takes a role, and the role carries all its values (face, size, leading, tracking, weight, case and figures) with their breakpoint steps. The roles mirror the classes the site writes today, and the guide asserts each one against its file, so a role that drifts from the site shows red there before it misleads anyone here.

#### Values

| Family | Token | Weights set | Job |
| --- | --- | --- | --- |
| Outfit | `--ds-font-display` | 400, 500, 600 | display lines, names, numbers, the wordmark |
| Inter | `--ds-font-sans` | 400, 500, 600 | reading text, labels, controls |
| JetBrains Mono | `--ds-font-mono` | 400, 500 | machine text: the terminal, card meta and code at 400, badge labels at 500 |

Roles come in three kinds, display in Outfit, text in Inter and mono, and each prints `--ds-type-<role>-family`, `-size`, `-leading`, `-tracking`, `-weight`, `-case` and `-numeric`, so a caps or tabular role keeps its caps and its figures. The full list, with every value and step, is Type roles ([3.31](#331-type-roles)).

The scale for new work is Type scale ([3.16](#316-type-scale)), from 11 to 56, plus the two display clamps, `clamp(38px, 5.2vw, 74px)` for a closing line and `clamp(84px, 19vw, 300px)` for the footer word.

Settings by kind:

- *Tracking.* Display runs from -0.02em at 16 to -0.055em at the footer word, tighter as it grows. Text sits at 0 to -0.02em, the tightest being the footer's column heads (`footer-head`). Capitals at 11px open to 0.14em (mono) and 0.18em (sans).
- *Leading.* One- and two-line display sits at 1.05 to 1.1. A display line that wraps as a statement (the scroll line) opens to 1.3. Reading text runs 1.4 to 1.65, the most open being the footer's intro (`footer-intro`).
- *Weights.* 500 for display and emphasis, and for badge labels in mono. 400 for reading, and for the vs and the 6labs name on navy, which sits a step lighter so white on navy matches ChatGPT's 500 on grey. 600 only for the footer word, the footer's column heads (`footer-head`), the code tag and a badge's count.

#### Use for

- **A role first.** New work names the role it plays (a section heading is `h2`, a card's line is `body-s`) and inherits every value. A step from the scale is for a new kind of line no role covers, and that line becomes a role once it ships twice.
- **Outfit** for anything the eye should land on before it reads: headings, names, numbers, questions, menu rows.
- **Inter** for anything read through: ledes, sublines, answers, labels, buttons.
- **JetBrains Mono** for what the model or a machine says: terminal output, model numbers and status, badge labels. A badge's count is a number to read, so it is Inter with tabular figures.
- **The accent on a word** for emphasis inside a heading, never a heavier weight.

#### Never for

- Outfit in a paragraph, or Inter in a display line above 24px.
- Mono for prose, labels or anything a person says.
- Sizes between steps in new work. The terminal's 12.5 and 11.5, the 13.5 of the large caption and the footer head, the full lede's 16.5, the vs word's 27 on a phone and the full hero's own ladder stay with the roles that own them and go no further.
- The `font-mono` utility. In this project it is Tailwind's system mono, so text written with it renders in Menlo or Consolas rather than JetBrains Mono. Write `--ds-font-mono`, or `font-[family-name:var(--font-jbmono)]` in site code.
- Weight 700. It is loaded and never set, and bold reads as shouting next to the 500 the headings use.

#### Reasons

- **Three faces, three kinds of line.** A reader sorts a page by its faces before reading a word. Keeping each face to one kind of line lets the change of face do the work of a divider: where Outfit stops, reading starts, and mono always means output.
- **Display runs tight.** A face's default spacing is drawn for text sizes. At 30px and above those gaps grow with the glyphs until the space inside a word competes with the space between words, so tracking tightens as size grows.
- **Short display leading, open reading leading.** A headline is one or two lines read as one unit, and loose leading splits it into two statements. A paragraph is many lines read in sequence, and the eye needs the extra air to find the start of the next line.
- **Wide caps.** Capitals have no ascenders or descenders to separate them, so at 11px they need added space or the word reads as one block.
- **A closed scale.** Two sizes a pixel apart (13 and 13.5) look like a mistake rather than a choice. A closed list of steps keeps every pair of sizes on a page clearly different.
- **Clamps follow the window.** The closing line and the footer word scale with `vw`, so their size depends on the window, not the column they sit in. That is why the guide measures them in a frame at true widths.
- **The full hero keeps its own ladder.** Its headline and lede step at 561, 901, 1280, 1600, 1920 and 2560, the ladder the onBlue creators hero was tuned on, for the reason in Responsive ladder ([9.6](#96-responsive-ladder)). The ladder for new work is in Layout and breakpoints ([2.6](#26-layout-and-breakpoints)).

#### Gaps

- Player card meta uses `font-mono` (Players.tsx), so it renders in the system mono while the terminal renders in JetBrains Mono. Mapping `--font-mono` to `var(--font-jbmono)` in the site's `@theme` fixes both at once, [decision 8](#8-the-mono-family) in Decisions pending ([10.3](#103-decisions-pending)).
- Inter 700 is loaded in `app/layout.tsx` and never set, a font file on every visit for nothing. JetBrains Mono 500 is loaded and set only by the system Badge, which the site does not ship yet.
- The player cards' `max-lg` sizes never render, because the card grid is hidden below lg. They are not roles.

### 2.5 Spacing and rhythm

Spacing on 6labs is Tailwind 4's 4px scale, used as the site already uses it. The system names each step by its Tailwind step (`--ds-space-2-5` is `p-2.5`, 10px), and the guide counts how often the site writes each one, straight from the source, so the scale stays a description of the site rather than a wish.

#### Values

Every step, with its token, is Spacing ([3.17](#317-spacing)), and the guide counts how often the site writes each one. The steps fall in three ranges: the half and small steps up to 14 inside controls, 16 to 40 inside cards and blocks, and 48 and up between blocks.

Rhythm inside a block, top to bottom:

- Section heading to subline: 16 (`--ds-space-4`, `mt-4`). Hero and closing headline to their line: 20 (`--ds-space-5`, `mt-5`).
- Copy to the call to action: 32, and 24 under md.
- Call to action to the line of social proof: 32, and 24 under md.
- Section to section: the top padding scales with the window, from 96 to 144 (`clamp(96px, 9vw, 144px)` on the jobs section), so sections never crowd on a laptop or float apart on a wide screen.

Padding by surface, smallest to largest: 6 inside a menu panel, 10 by 12 on its rows, 14 by 16 in the tag panel, 16 in the terminal, 20 by 24 on an FAQ row, 24 in a player or job card (28 on the job card's top), 28 then 36 in a comparison card.

#### Use for

- **4 below 32, 8 above.** New work takes any step of 4 up to 32, and steps of 8 above it. 36 (`--ds-space-9`) is the one step the site writes off that grid, the comparison card's padding from md, and it stays with that card. The half steps (2, 6, 10 and 14) are for the inside of controls, where a jump of 4 is too coarse. A gap between two controls is 12, a grid of small cards takes a 16 gutter and a grid of wide ones 24, a card's padding is 24.
- **Growing gaps.** Inside a block, each gap is at least as large as the one before it: heading to line, line to action, action to proof.
- **Optical fits in the parts, not the gaps.** When a pairing looks off by a pixel (a tight title over its body), fix the leading of the type, then keep the gap on the scale.

#### Never for

- Arbitrary pixel values (`mt-[13px]`) in new work.
- One gap repeated through a whole block. It flattens the order of reading.
- Spacing on 2 above 16, or on 4 above 32. Both read as noise at those sizes.

#### Reasons

- **A shared grid lines up for free.** When every gap is a step of the same base, two blocks built months apart still share edges and baselines. Off-grid values break that silently, one pixel at a time.
- **Coarser steps as gaps grow.** The eye resolves a 4px difference between two 12px gaps, but not between 36 and 40. Above 32 only steps of 8 are far enough apart to read as a decision.
- **Rhythm is the reading order.** A block tells the visitor what goes together by how close it sits. Close spacing groups the copy into one message, and the jump before the button marks the change from reading to doing.
- **Padding follows the surface.** A row is scanned many at a time, so it stays dense. A card is read alone, so its copy needs distance from the edge to read as content rather than border.

#### Off the grid

The guide lists every arbitrary spacing value in the site with its file and line: 3, 3.5, 7, 9, 11, 13, 18, 22, 26, 34 and 60px today. Most arrived with the sections that follow the onBlue creators pages (the footer, the closing call, the jobs cards, the terminal and the full-view hero), where they matched that page's own type. The slim mode toggle's 7 keeps it 2px shorter than the full toggle. When a section is next touched, each value folds to its nearest step, and the list in the guide shrinks to show it.

### 2.6 Layout and breakpoints

Every section on 6labs sits in the same box: a page gutter on `main`, a 1400px container centred inside it, and an inner gutter inside the container. Text inside the box is capped by a measure. Widths change at Tailwind's breakpoints, except in the full-view hero, which keeps the ladder it was built on.

#### Values

The parts of the box are the container (written by hand as `max-w-[1400px]` in each section), the full view's wider copy grid, the page gutter on `main`, each section's inner gutter, the text measures and the header's height. Every value, with its token and source, is Layout ([3.18](#318-layout)), and the widths are Breakpoints ([3.19](#319-breakpoints)).

Breakpoints for new work are Tailwind's: sm 640, md 768, lg 1024, xl 1280. Inside a part, three named component widths may also be used, 400, 480 and 560, where a row of actions, choices or a banner's copy stops fitting a phone (ButtonGroup and EmptyState's actions stack under 400, a horizontal radio row and a banner's actions wrap under 480, EmptyState's padding drops under 560). A part that answers its own box rather than the window, as EmptyState does, steps on a container query at those widths instead of a media query. The full-view hero's ladder is 561, 901, 1280, 1600, 1920 and 2560. Responsive ladder ([9.6](#96-responsive-ladder)) gives the reasons for both. One narrow edge at 380 tightens the jobs tabs. Three gates sit beside the widths: a short screen (`min-width: 1280px` and `max-height: 720px`) caps the full headline, a fine pointer (`hover: hover` and `pointer: fine`) is required before a part shows a hover-only hint, and a dense screen (devicePixelRatio 1.5 and up, read in script) wider than 1920 lets the players scale up to 1.35.

The z-scale lives in Layer stack ([5.1](#51-layer-stack)).

#### Use for

- **md as the main split.** Phone to tablet is where gutters, type steps and rhythm change. lg is where layouts change shape (the players' two columns), and xl is for wide grids (the three jobs cards).
- **A measure on every block of text** wider than a card: 520 for a subline, 680 for an answer, 440 for a lede beside a visual.
- **The header tokens** for anything that starts under the fixed bar, as `calc(var(--ds-header-h) + <gap>)`.
- **Full bleed** only for a ground (the accent water, the grain band), never for text.

#### Never for

- A custom width (`min-[901px]`) outside the full-view hero and the three named component widths.
- `min-[1280px]` in new work. It is `xl` written a second way.
- A hard-coded header offset. The site has three today (70 and 73 for the same phone bar, 89 for a bar about 80 tall), and none of them agree with the bar.
- Text that runs to the container's edge on a phone, or past 980 anywhere.

#### Reasons

- **One box, one edge.** When every section shares the container and both gutters, the first letter of every heading falls on one vertical line from the header to the footer. The eye uses that line to scan down the page, and a section that leaves it reads as an interruption.
- **The page gutter and the inner gutter do different jobs.** The page gutter keeps content clear of the screen's physical edge on every width. The inner gutter is the section's own margin and widens from md, where there is room for the copy to stand clear of the container's edge.
- **Measures keep lines trackable.** The longer the line, the harder the return trip to the start of the next one. Each measure is set against its type size, so lines hold about 45 to 90 characters where the full container would hold 170 at body size.
- **The header is a token, not a number.** The bar's height comes from its padding and the Sign in button inside it, so it changes when either does. An offset written as a number stays behind when the bar moves.

#### Gaps

- The players section takes a 20px side padding on phones where every other section takes 16 (Players.tsx), so its copy sits 4px in from the line above it.
- The hero row takes `max-md:px-2` (8px) inside the page gutter where every other row takes 16 (Hero.tsx).

### 2.7 Radius

Corners on 6labs grow with the surface. A row is barely rounded, a card is soft, the hero container is the roundest box on the page, and anything a finger presses is a pill. The ladder below covers every corner the site draws, under one name per value, and adds the small-mark steps the system needs for marks and focus wraps under 12.

#### Values

Every step, with its token, its surfaces, its misuse and the source line it mirrors, is Radius ([3.20](#320-radius)), generated from the tokens. This chapter gives the rules that pick a step.

#### Use for

- **36 for a card-sized block in the container look:** the comparison cards and the index card from md, and the empty state at every width.
- **Step down on phones.** A large surface takes one step less under md (cards 28 to 24, the comparison and index cards 36 to 28, the container 48 to 32), because the same radius on a narrow box eats a larger share of its width. A part that sizes from its own box, as the empty state does, keeps its radius and steps its padding instead.
- **Nesting.** An inner corner is the outer radius less the padding between them, rounded to the nearest step: the 16 language panel at 6 padding holds 12 rows. When the padding is as large as the outer radius, the inner corner can go square.
- **The pill** for anything pressed or toggled, so a control never reads as a card.
- **The 14 row** only for list rows that open (the FAQ), which need to read as a stack of rows rather than a stack of cards.
- **A small-mark step** (2, 4, 6 or 8) for a mark, a bubble or a focus wrap under 24px, where the 12 step would round a 16 box or a ring hugging a word into a near circle. These steps are system additions, with no site value to mirror.
- **The model square** at 28% of its size, a share rather than a step, so a player model reads as the same shape from a 20 avatar to a 96 one.

#### Never for

- A radius off the ladder, the small-mark steps included. 22 appears once in the site (player cards below lg) and never renders, because that grid is hidden there, so the compact card that takes that size snaps it to 24.
- A small-mark step on a surface. A card, a row or a panel takes 12 or more.
- The same radius inside and outside a padded surface.
- A pill on a surface that holds more than one line of content.
- Two spellings of one value in new code. The site writes 16 as `rounded-[16px]` (terminal) and `rounded-2xl` (language panel), and 12 as `rounded-[12px]` (tag panel) and `rounded-xl` (language rows). New work writes the token.

#### Reasons

- **Radius says size and layer.** A rounder corner reads as a larger, outer surface. Keeping the ladder in step with surface size lets a reader tell a row from the card that holds it and the card from the container without a border or a shadow.
- **Concentric corners.** Two curves drawn round the same centre keep an even band between them. If the inner corner keeps the outer radius, the two curves no longer share a centre and the band swells to about 1.4 times the padding at each corner, which reads as a mistake in the padding.
- **Pills for action.** The site's controls are all fully round and its surfaces never are, so shape alone separates something to press from something to read.

### 2.8 Stroke and elevation

Light grounds on 6labs are separated by lines, not by depth. A hairline draws every card, row and control at rest, and a shadow appears only under something that sits above the page. Every shadow but one is drawn in the ink navy.

#### Values

Lines, by ground: on white and the page, the hairline (`--ds-color-line`) draws card, row and control edges at rest, the strong line hover and open edges, the hover line an outlined button under the pointer, and the field line a field or checkbox edge. On the tinted grounds, ink at 8% draws the hero foot and footer tail rules. The faint hairline is the container look's own edge, and white at 6% the terminal bar's foot. Every value is in Lines ([3.7](#37-lines)), and the widths, 1px for every border with one width per other job, in Stroke ([3.21](#321-stroke)).

Elevation, lowest to highest, every value in Elevation and glow ([3.22](#322-elevation-and-glow)):

| Level | Token | Where |
| --- | --- | --- |
| none | | comparison, job and FAQ cards, the terminal |
| thumb | `--ds-shadow-thumb` | the mode toggle's and the segmented control's thumb |
| tooltip | `--ds-shadow-tooltip` | tooltip bubbles |
| float | `--ds-shadow-float` | BackToTop, elevated icon buttons, toasts |
| lift | `--ds-shadow-lift` | a clickable card on hover |
| pop | `--ds-shadow-pop` | menus and select panels |
| modal | `--ds-shadow-modal` | dialogs and sheets |
| player, player selected | `--ds-shadow-player`, `--ds-shadow-player-selected` | the player cards, on the accent only |

The container shadow (`--ds-shadow-container`) is not a level. It is a breath under the hero's container and the index card, black at 3% with a 100px blur, so faint it lifts the block without putting it above anything, and it stays out of the ladder for that reason. Glows are separate from elevation too: the caret's glow and the sheen's bloom are light, not height.

#### Use for

- **A hairline** on every light surface at rest. The strong line marks a surface the pointer is on or that is open.
- **The field line** for any edge that is the only sign of a control, because it is the one grey that meets the 3:1 a control's boundary needs (WCAG 1.4.11).
- **A shadow** for a part that floats: fixed buttons, menus, tooltips, toasts, dialogs, and a card lifting under the pointer.
- **Navy ink in every new shadow**, `rgba(10,27,51,x)`, with a negative spread so the shade sits under the part rather than round it.

#### Never for

- A shadow on a card that rests in the flow of a light section.
- Borders thicker than 1px for emphasis. A heavier line has one job each (the sheen, a ring, a dot), and emphasis comes from the strong line colour.
- Black shadows in new work.
- A glow as depth, or the sheen bloom as a CSS `filter: drop-shadow`. The bloom is listed as a value so nothing copies the filter the site uses today.

#### Reasons

- **Lines for structure, shadows for height.** If cards in the flow carried shadows, a shadow would no longer say that something floats, and a menu over the page would look like one more card. Keeping light sections flat leaves depth free to mean one thing.
- **Navy, not black.** The page is near-white and its type is navy. A black shadow on that ground mixes to a cold grey that matches nothing else on the page, while a navy shadow is a darker step of the colours already there. The hero container's black shadow is so faint (3%) that its hue does not show, which is why it stays.
- **Height grows with distance.** The blur grows level by level, from the thumb resting on its rail to a dialog over everything, so the shadow alone tells the order of the stack.
- **The field line is the exception in strength.** Every other line can be faint because the surface it edges also differs in fill or content. A text field is often white on white, and its border is all that marks it.
- **Glows are light.** The caret and the sheen show the accent catching light, which the page uses for attention. Putting them on the elevation ladder would read light as height.

#### Gaps

- The sheen's bloom is drawn with `filter: drop-shadow` and its outline with a CSS mask (globals.css), both of which the compositor rule forbids in new work. Redrawing it with background layers is [decision 9](#9-the-card-sheen) in Decisions pending ([10.3](#103-decisions-pending)).
- The site has three spellings of the strong hairline (slate-300, slate-300 at 80% and `#b7c0cb`) and three alphas of the rest hairline (80, 70 and 50%), for overlapping jobs.

### 2.9 Icons

#### Values

Lucide line icons only, on a ladder of sizes from 12 to 24, each with its own `strokeWidth`. Every size and stroke, with its token, is Icon sizes ([3.24](#324-icon-sizes)), generated from the ladder the Icon part reads.

The gap between an icon and its label sits outside the icon's square: 6 at 12 and 14, 8 at 16 and 18 (every button from sm up), 10 in a list lead. Colour is `currentColor` and nothing else.

#### Use for

The size follows the icon's role and the box it sits in, never the size of the text beside it: a Tag sets a 16 by its 13px label, and an xs Button a 14 by its 12px one. 12 in badges. 14 in xs controls, the chip's check and remove, and inline with 13px text. 16 as a list lead (a Tag, a menu row) and in sm and md controls, the sm and md fields included. 18 inside the 40 and 44 boxes and beside the lg and xl pill labels, the lg field included. 20 in a 48 box, the xl icon button. 24 standalone, for an icon that names a state on its own, such as the terminal's pointer or an empty state.

#### Never for

Sizes between the steps (the site's 17 and 22 move to 16 and 20). A stroke picked by eye or left at lucide's default of 2 above 14. A rotating icon as a loader, which is the Spinner's job. The brand marks, which are their own artwork at 32, 36 and 44 and live in Logo and identity ([6.1](#61-logo-and-identity)).

#### Reasons

`strokeWidth` is measured in the 24-unit grid, so a fixed stroke renders thinner as the icon shrinks and heavier as it grows. Setting it per size (2.25 at 12 down to 1.5 at 24) holds the rendered line between 1.13px (at 12) and 1.33px (at 20) wherever a label sits beside the icon, the weight of the Inter labels, so a 14 in the footer and an 18 in a round button read as one set, and only the standalone 24 renders a heavier 1.5px, because it has no label to match. Colour follows the control because the icon is part of its label: when the label turns accent on hover, so does the icon, and a disabled control greys both at once.

#### Custom glyphs

Two shipped glyphs are not lucide: the FAQ's plus, two 16px bars 1.5px tall that turn into a minus, and the two CSS ring spinners. Any new glyph is drawn on the same 24 grid with 2 units of padding, round caps and joins, at strokeWidth 1.75, so it sits in the set without a second weight.

#### Icon

**Purpose.** The one way to draw a lucide icon, so the size picks the stroke and nobody writes a strokeWidth again.

**Anatomy.** The glyph's square, equal to its size. The boxed form adds a circle round it: white, a 1px hairline, 32 for icons up to 16, 40 at 18, 48 from 20.

**Variants.** Standalone sits inside a control, which centres it. Inline sits in a line of text and is shifted -0.125em, because an icon on the text baseline floats above the x-height while the shift centres it on the lowercase letters. Boxed gives a lone icon a surface of its own, for a list lead or an empty state, where a bare glyph on the page ground reads as a stray mark.

**Sizes.** The six steps above. Icon sizes never change at a breakpoint. The control round them does.

**States.** None of its own. It takes its parent's colour: ink at rest, accent on hover where the control turns accent, quiet when disabled.

**Props.** `icon` (a LucideIcon), `size` (12, 14, 16, 18, 20 or 24, 16 by default), `label`, `form` (standalone, inline or boxed), `box` (32, 40 or 48) and `className`.

**Motion.** None. A control may turn or swap its icon (the language globe tips 20 degrees, IconButton cross-fades Menu to X), and that motion belongs to the control.

**Accessibility.** Decorative by default (`aria-hidden`), because a visible label beside it already names the action and a second name would be read twice. With `label` it becomes `role="img"` with that name, for the rare icon that carries meaning alone. An icon-only control names itself through the control (IconButton's required `label`), never through the icon. See Accessibility baseline ([2.11](#211-accessibility-baseline)).

**Responsive.** The same at every width.

**Do / Don't.**
- Do take the size from the text or the box the icon sits in.
- Do leave the colour to `currentColor`.
- Don't mix strokes in one row, because three weights read as three icon sets.
- Don't scale an icon up to fill a larger box. Move to the next step, or box it.

### 2.10 Focus

#### Values

A solid outline drawn outside the border box, a step further off a card than a control, following the element's own radius. Three tones: the accent on the page, surface and container, white on the accent water, and the lifted accent on navy and the terminal. Fields take a halo with an accent border in place of the outline. Every width, offset, tone and halo, with its token, is Focus ([3.23](#323-focus)). The class strings live in `focus.ts`: `FOCUS`, `FOCUS_INVERSE`, `FOCUS_DARK`, `FOCUS_CARD`, `FOCUS_INSET`, `FIELD_FOCUS` and `focusRing(tone)`.

| Ring | Ground | Ratio |
| --- | --- | --- |
| #1a6dff | page #f9fafb | 4.29 |
| #1a6dff | surface #ffffff | 4.49 |
| #1a6dff | container #e3e5e8 | 3.55 |
| #1a6dff | navy #0a152d | 4.03 |
| #ffffff | accent #1a6dff | 4.49 |
| #6ea8ff | navy #0a152d | 7.51 |
| #6ea8ff | terminal #0b1526 | 7.57 |

Every pair clears the 3:1 that WCAG 1.4.11 asks of a focus indicator. Ratios are rounded down.

#### Use for

Every element that takes keyboard focus: buttons, links, chips, segments, tabs, cards that act, menu triggers, the skip link. The inset form (`FOCUS_INSET`, offset -2) for items inside a sideways scroll row. The halo for text fields, selects and the search field.

#### Never for

Pointer focus: the ring shows on `:focus-visible` only. Hover, which has its own state. A selected or checked state, which is navy. Box shadows on buttons as a stand-in, which disappear in forced colours.

#### Reasons

- *An outline, not a border or a shadow.* An outline takes no layout space, so focus never nudges a row, and it follows `border-radius`, so a pill gets a pill-shaped ring. In forced colours the outline is repainted in `Highlight`, where a shadow would vanish.
- *Outside, with a gap.* The 2px gap shows the ground between ring and control, so the ring reads as a separate line on a navy fill as clearly as on a white one. Cards take 3px because their larger radius and hairline need more air to read as two shapes.
- *Accent on light.* The accent is the system's attention colour, and focus is where attention is. It is the one accent line every light ground may carry. Whether it stays the accent or turns navy is [decision 6](#6-focus-ring-colour) in Decisions pending ([10.3](#103-decisions-pending)).
- *White on the blue.* An accent ring on the accent water measures 1:1, so it is not there at all.
- *Lifted blue on dark.* The accent passes on navy at 4.03, but #6ea8ff is the accent the terminal already writes on dark, so the ring stays in the family and roughly doubles its margin next to white type.
- *Inside in scroll rows.* `overflow-x: auto` clips both axes, so an outer ring loses three of its edges.
- *A halo on fields.* A field already has a border, and an outline round it would draw two lines. The accent border plus a soft halo marks the box that will take the typing.
- *No transition.* The ring appears in the frame focus lands, because a fading ring lags a fast Tab.

#### How to apply it

Add the string to the element's classes and give it a radius. A part that takes `forceState` prints `data-force="focus"`, and every string carries a `data-[force=focus]` twin, so a forced cell and a real Tab are pixel for pixel the same.

#### SkipLink

**Purpose.** Lets a keyboard visitor start at the content. Without it, every page begins with a walk through the header's links.

**Anatomy.** A fixed wrapper 16px from the top left at z 70 (`--ds-z-tooltip`), above the header's 40, holding the primary sm Button: 32 tall, navy, "Skip to content".

**Variants.** Fixed, for the page. Inline, which keeps it in the flow, for documentation.

**Sizes.** One. sm is large enough to read at a glance and small enough to cover only the header's logo.

**States.** Rest: invisible and deaf to the pointer, though still in the tab order and the accessibility tree. Focus: shown at once, with the ring. Hover and pressed: the primary's hover fill and its press, while it holds focus.

**Props.** `href` (`#main` by default), `children` ("Skip to content"), `forceState`, `inline` and `className`.

**Motion.** None. It appears in the frame it gains focus, like the ring.

**Accessibility.** It must be the first focusable element in `<body>`, and its target must be the page's main landmark with a matching id. Opacity, not `display: none`, hides it, so it stays reachable.

**Responsive.** The same at every width. 16px from the corner sits inside the phone gutter.

**Do / Don't.**
- Do point it at `main`, never at the first heading, so the landing spot is a landmark.
- Do keep it first in the document, before the header.
- Don't show it at rest. Sighted pointer visitors never need it, and it would cover the logo.
- Don't animate it in.

### 2.11 Accessibility baseline

The rules every part meets before it ships. Each component chapter ends with an Accessibility line that names what it adds to this baseline. Where the shipped site falls short today, Known gaps ([10.2](#102-known-gaps)) lists it with its file and line, so this chapter stays a rule book rather than an audit.

#### Contrast

Text meets 4.5:1 on its ground and large text (24px, or 18.66px bold) 3:1. Lines that carry meaning (field borders, the focus ring, a checkbox edge) meet 3:1. The ratios per colour and ground are in Contrast ([2.3](#23-contrast)).

#### Use of colour

Colour is never the only carrier of a state or a meaning (1.4.1). The status parts are the pattern: a status dot sits beside the words that name its state, a progress bar's value text says Complete or Failed at 60%, a chosen chip grows its check, an error comes with its icon and its message, and a link in running text keeps its underline. A reader who cannot tell the navy from the ink, or sees the screen in glare, still reads every state.

#### Focus

Every focusable part shows the ring from Focus ([2.10](#210-focus)) on `:focus-visible`, in the tone of its ground. A part never removes the browser's ring without drawing this one.

#### Targets

- *Values.* 24 × 24 at least (WCAG 2.2, 2.5.8), or a smaller target with 24px of clear space round its centre. 44 × 44 for a control a thumb reaches first on a phone (2.5.5).
- *Use for.* The smallest system controls are 28 (Button xs, IconButton xs, Chip sm), which clears 24 and suits dense desktop rows. A control that stands alone on a phone, opens a menu or closes a sheet takes 44 or more.
- *Never for.* A visual size taken as the hit size. A dot, a bar or a bare icon gets its target from padding round it, never from its drawn shape.
- *Reasons.* 24 is the floor below which a pointer misses on a first try. 44 is the pad of a thumb, which covers the control as it presses, so a smaller target leaves the visitor guessing where it landed.

#### Keyboard

Each pattern has one model, and one system part carries it, so a key means the same thing on every page:
- Button and link: Tab reaches them, Enter activates, Space presses a button.
- Toggle, checkbox, switch: Space flips the state, which is announced as pressed or checked.
- Radio group and segmented control: one Tab stop on the current choice, the arrows move and select. Tabs work the same way, with Home and End, and in manual mode Enter or Space selects.
- Listbox (Select): Enter, Space or Down opens, the arrows move, Enter picks, Escape closes, letters jump, and focus returns to the trigger.
- Combobox (SearchField): focus stays in the field while the arrows move through results, and Escape clears the query.
- Accordion: each header is a button. The arrows, Home and End move between headers.
- Dialog: focus moves in on open, Tab stays in the dialog (the browser's own controls aside), Escape closes, focus returns to the opener.
- Slider: the arrows step, Page Up and Down move a tenth, Home and End reach the ends.

Keys typed into a field (TextInput, TextArea, SearchField) and the keys Select, Slider and ChipGroup handle stop at the part and never reach the window, because the page's own shortcuts (the tile floor resets on R) must not fire from inside a field.

#### Semantics

- A bar that reports a value is a `meter` or a `progressbar` with its min, max, now and a spoken value, never a bare div.
- A visual that plays by itself (the terminal, the floor, a hologram) is `aria-hidden`, and one visually hidden sentence says what it shows, so a screen reader hears the point without the frames.
- `aria-live` is for what the visitor caused: a toast after their action, a result count after they type. Ambient loops, typed words and counters never announce, because a region that talks on its own drowns out the page.
- A working control keeps its name and sets `aria-busy`. Its spinner is decorative.
- Headings follow the page outline, one `h1` per page, with no level skipped for the sake of size.

#### Reflow, zoom and text spacing

- *Reflow.* At 320 CSS px wide, a 1280 window at 400% zoom, every page reads in one column with no sideways scroll of the page (1.4.10). A part that needs two dimensions to mean anything (the tile floor, a wide table) scrolls inside its own box. The guide's narrowest frame is 375, so 320 is checked by zooming a real window.
- *Text resize.* Text reaches 200% through the browser's zoom with nothing cut off (1.4.4). The type scale is written in px, which zoom enlarges but a reader's default font size setting does not, so zoom is the route the system supports. That is why nothing that holds text has a fixed height: a line that grows wraps instead of clipping.
- *Text spacing.* A part keeps its content when a reader sets line height to 1.5, paragraph spacing to 2em, letter spacing to 0.12em and word spacing to 0.16em (1.4.12), so a box that holds text never clips its overflow.

#### Language of parts

The document declares English on `html`, and a passage in another language carries its own `lang`, so a screen reader switches its voice for it (3.1.2). The LanguageMenu's rows, each language written in its own script, are the case the page has today, and they carry no `lang`, a gap Known gaps ([10.2](#102-known-gaps)) lists.

#### Motion

Under `prefers-reduced-motion` loops stop and travel goes, while every state change still happens and a busy spinner still turns, slower. Reduced motion ([4.6](#46-reduced-motion)) has the rule and the table.

#### Forced colours

In Windows High Contrast the system replaces every colour and drops fills, so anything a fill alone carries would vanish. Rings switch to `Highlight`. Every control keeps a real edge: a 1px border (transparent at rest on the variants that show none), or, on a part with no border of its own, a line drawn for forced colours, as the Switch track draws `CanvasText` and the tab list its hairline. A chosen state that a fill carries opts out of the system colours and fills `Highlight` instead: a pressed toggle button, a switch that is on, the Segmented thumb, the tab indicator and the radio's dot. Ticks and icons follow `currentColor`, so they take the system's text colour.

#### Do / Don't

- Do give a small control its target through padding.
- Do name an icon-only control on the control itself.
- Don't announce what the visitor did not ask for.
- Don't let a part's shortcut reach the window.

## 3 Tokens reference

Every token of the system, one table per family, in the order the guide shows them. The tables are generated from `src/components/design-system/tokens.ts` each time DESIGN.md is built, so they cannot disagree with the values `TokenStyle` prints. Each table ends on the section that gives its family's reasons: most are in Foundations ([chapter 2](#2-foundations)), the motion values in Easing, duration, springs ([4.1](#41-easing-duration-springs)), the z-scale in Layer stack ([5.1](#51-layer-stack)) and the brand mark also in Logo and identity ([6.1](#61-logo-and-identity)). [Chapter 0](#0-about-this-document) says how a token is changed.

Each row gives the CSS name, the value, the role, what the token is for and never for, and its source. A source is the `file:line` under `src/` that the value mirrors, with the class the site writes when it writes one, or "system" for a value the site does not ship. A value written in oklch or as an alpha carries its sRGB hex beside it, because the contrast maths in Contrast ([2.3](#23-contrast)) runs on sRGB. A value marked "no CSS" is not printed as a custom property: a spring exists only in JS, and the sheen's bloom is listed so that nothing copies the filter it is drawn with. A Never for that every row of a table shares is printed once under it. Type roles close the chapter, each with its steps by width, and each prints `--ds-type-<role>-family`, `-size`, `-leading`, `-tracking`, `-weight`, `-case` and `-numeric`.

### 3.1 Accent

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-accent` | `#1a6dff` | The brand accent | Accent words, links on hover, dots, the caret, the focus ring and the players' water | Selected or checked fills, and any fill outside the players section | `app/globals.css:9`, as `text-accent` |
| `--ds-color-accent-glow-55` | `rgb(26 109 255 / 0.55)` | Caret glow | The typed caret's 10px glow | Text, lines or fills | `app/globals.css:108` |
| `--ds-color-accent-glow-50` | `rgb(26 109 255 / 0.5)` | Sheen bloom | The card sheen's 7px bloom | Text, lines or fills | `app/globals.css:253` |
| `--ds-color-accent-glow-30` | `rgb(26 109 255 / 0.3)` | Sheen falloff | The sheen's radial stop at 34% | Text, lines or fills | `app/globals.css:254` |
| `--ds-color-accent-glow-28` | `rgb(26 109 255 / 0.28)` | Players glow core | The radial glow behind the players | Any light ground | `components/website/Players.tsx:111` |
| `--ds-color-accent-glow-08` | `rgb(26 109 255 / 0.08)` | Players glow edge | The players glow at 55% | Any light ground | `components/website/Players.tsx:111` |
| `--ds-color-accent-ping` | `rgb(26 109 255 / 0.4)` | Live dot halo | The ping ring round a live dot | Fills larger than a dot | `components/website/Hero.tsx:238`, as `bg-accent/40` |

Reasons: Colour roles ([2.1](#21-colour-roles)), The accent rule ([chapter 8](#8-the-accent-rule)).

### 3.2 Ink and its alpha ladder

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-ink` | `#0a1b33` | Primary text and icons | Headings, body ink, icons, the wordmark and the ink of every shadow | Solid fills, which take color-primary | `components/website/Header.tsx:73`, as `text-[#0a1b33]` |
| `--ds-color-ink-70` | `rgb(10 27 51 / 0.7)` | Quiet control ink | Icon and label on the white wave pill | Body copy | `components/website/HeroBits.tsx:96`, as `text-[#0a1b33]/70` |
| `--ds-color-ink-45` | `rgb(10 27 51 / 0.45)` | Guide key line | The touch-target key in Accessibility | Any text a reader must read | system |
| `--ds-color-ink-40` | `rgb(10 27 51 / 0.4)` | Guide outline | Dashed guide outlines, full-view keys and the clear-space box | Body copy | system |
| `--ds-color-ink-30` | `rgb(10 27 51 / 0.3)` | Leader line | The footer copy line's leader, the vs word | Text a reader must read (the vs is decorative and aria-hidden) | `components/website/CopyLine.tsx:111`, as `bg-[#0a1b33]/30` |
| `--ds-color-ink-20` | `rgb(10 27 51 / 0.2)` | Menu veil | The veil behind the mobile menu | A modal veil, which takes color-veil-modal | `components/website/MobileMenu.tsx:72`, as `bg-[#0a1b33]/20` |
| `--ds-color-ink-15` | `rgb(10 27 51 / 0.15)` | Unlit words | Scroll line words before they fill | Any text a reader must read now | `components/website/ScrubLine.tsx:136`, as `text-[#0a1b33]/15` |
| `--ds-color-ink-08` | `rgb(10 27 51 / 0.08)` | Hairline on a tinted ground | The hero foot and footer tail rules | Lines on white, which take color-line | `components/website/Footer.tsx:85`, as `border-[#0a1b33]/[0.08]` |

Reasons: Colour roles ([2.1](#21-colour-roles)).

### 3.3 Primary

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-primary` | `#0a152d` | The solid primary fill | Try now, the selected tab, checked, pressed and selected fills, the 6labs card | Text, which takes color-ink | `components/website/PrimaryCta.tsx:20` |
| `--ds-color-primary-hover` | `#0c1e42` | Primary fill on hover | The primary moved 10% toward the accent | A rest fill | `components/website/PrimaryCta.tsx:21` |

Reasons: Colour roles ([2.1](#21-colour-roles)).

### 3.4 Grounds and surfaces

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-page` | `#f9fafb` | The page ground | The page, the ring round the vs disc, the grain's fade | Cards and controls, which take color-surface | `app/globals.css:13`, as `bg-[rgb(var(--page-rgb))]` |
| `--ds-color-page-92` | `rgb(249 250 251 / 0.92)` | Header strip | The fixed header over the page | Panels that need to hide what is under them | `components/website/Header.tsx:59` |
| `--ds-color-surface` | `#ffffff` | Cards and controls | Job cards, FAQ rows, BackToTop, the tab rail, sheets | The page ground | `components/website/Jobs.tsx:162`, as `bg-white` |
| `--ds-color-container` | `#e3e5e8` | The hero container look | The hero container and the ChatGPT card | Controls inside it, which take color-surface | `components/website/Hero.tsx:122`, as `bg-[#e3e5e8]` |
| `--ds-color-surface-sunken` | `#f6f7f9` | Inset panel | The jobs tag panel and disabled fields | A raised card | `components/website/Jobs.tsx:184`, as `bg-[#f6f7f9]` |
| `--ds-color-footer` | `rgb(0 0 0 / 0.04)` | Footer ground | Laid over the page under the footer | Any other surface | `components/website/Footer.tsx:26`, as `bg-black/[0.04]` |
| `--ds-color-footer-tail` | `rgb(0 0 0 / 0.04)` | Footer tail | Laid over the footer ground, so the tail reads 8%. color-footer's value, named apart for its own job | Any other surface | `components/website/Footer.tsx:85`, as `bg-black/[0.04]` |
| `--ds-color-surface-95` | `rgb(255 255 255 / 0.95)` | Menu panel | The language panel, solid enough to read on | A panel that would need blur to read | `components/website/LanguageMenu.tsx:78`, as `bg-white/95` |
| `--ds-color-surface-90` | `rgb(255 255 255 / 0.9)` | Pill on the container | The wave pill and outline icon buttons | Cards | `components/website/HeroBits.tsx:96`, as `bg-white/90` |
| `--ds-color-surface-85` | `rgb(255 255 255 / 0.85)` | Chip on the footer | The footer copy line's chips | Cards | `components/website/CopyLine.tsx:105`, as `bg-white/85` |
| `--ds-color-surface-70` | `rgb(255 255 255 / 0.7)` | Outline hover fill | Sign in and secondary buttons on hover | A rest fill | `components/website/Header.tsx:102`, as `hover:bg-white/70` |

Reasons: Colour roles ([2.1](#21-colour-roles)), Surfaces ([9.1](#91-surfaces)).

### 3.5 Fills

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-fill-hover` | `oklch(98.4% 0.003 247.858)` (sRGB `#f8fafc`) | White control on hover | BackToTop and elevated icon buttons | A selected fill | `components/website/BackToTop.tsx:62`, as `hover:bg-slate-50` |
| `--ds-color-fill-highlight` | `oklch(96.8% 0.007 247.896)` (sRGB `#f1f5f9`) | List highlight | The active row of a menu, neutral badges | A selected fill, which takes color-primary | `components/website/LanguageMenu.tsx:93`, as `bg-slate-100` |
| `--ds-color-fill-open` | `oklch(92.9% 0.013 255.508 / 0.6)` (sRGB `#e2e8f0 at 60%`) | Open or quiet hover fill | An open trigger, ghost hover | Cards and selected fills, which take color-primary | `components/website/LanguageMenu.tsx:59`, as `bg-slate-200/60` |
| `--ds-color-skeleton` | `oklch(92.9% 0.013 255.508 / 0.7)` (sRGB `#e2e8f0 at 70%`) | Skeleton fill | Skeleton shapes on white and the page. color-line-soft's value, named apart so a fill never reads as a line | Lines, which take color-line | system |
| `--ds-color-skeleton-container` | `rgb(255 255 255 / 0.55)` | Skeleton on the container | Skeleton shapes on the container grey | White grounds, where it vanishes | system |
| `--ds-color-shimmer` | `rgb(255 255 255 / 0.6)` | Shimmer light | The band crossing a skeleton | Fills | system |

Reasons: Colour roles ([2.1](#21-colour-roles)).

### 3.6 Text

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-text-body` | `#475569` | Secondary body | The hero lede, the social proof line, FAQ answers | Headings, which take color-ink | `components/website/Faq.tsx:68`, as `text-[#475569]` |
| `--ds-color-text-muted` | `#64748b` | Muted text | Stat labels, card taglines, sublines, the footer base | Long reading at 14px and under on the container | `components/website/Jobs.tsx:109`, as `text-[#64748b]` |
| `--ds-color-text-quiet` | `oklch(70.4% 0.04 256.788)` (sRGB `#90a1b9`) | Quiet text | Eyebrow caps, quiet icons, card status | Anything a reader must read, since it is under 3:1 on white | `components/website/ScrollCue.tsx:21`, as `text-slate-400` |

Reasons: Colour roles ([2.1](#21-colour-roles)), Contrast ([2.3](#23-contrast)).

### 3.7 Lines

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-line` | `oklch(92.9% 0.013 255.508 / 0.8)` (sRGB `#e2e8f0 at 80%`) | Hairline | Card, row and control borders at rest | A field border, which must reach 3:1 | `components/website/Jobs.tsx:162`, as `border-slate-200/80` |
| `--ds-color-line-soft` | `oklch(92.9% 0.013 255.508 / 0.7)` (sRGB `#e2e8f0 at 70%`) | Hairline on a panel | The language panel, the card meta rule | New work, which takes color-line | `components/website/LanguageMenu.tsx:78`, as `border-slate-200/70` |
| `--ds-color-line-faint` | `oklch(92.9% 0.013 255.508 / 0.5)` (sRGB `#e2e8f0 at 50%`) | Hairline on the container | The hero container and ChatGPT card | Lines on white | `components/website/Hero.tsx:125`, as `border-slate-200/50` |
| `--ds-color-line-strong` | `oklch(86.9% 0.022 252.894)` (sRGB `#cad5e2`) | Firm hairline | Hover and open borders, Sign in, link underlines | A field border | `components/website/Header.tsx:102`, as `border-slate-300` |
| `--ds-color-line-scrolled` | `oklch(86.9% 0.022 252.894 / 0.8)` (sRGB `#cad5e2 at 80%`) | Header rule once scrolled | The header's foot | New work | `components/website/Header.tsx:60`, as `border-slate-300/80` |
| `--ds-color-line-hover` | `#b7c0cb` | Outline hover border | Sign in and secondary buttons on hover | A rest border | `components/website/Header.tsx:102`, as `hover:border-[#b7c0cb]` |
| `--ds-color-line-divider` | `oklch(96.8% 0.007 247.896)` (sRGB `#f1f5f9`) | Row divider | Rows of the mobile menu | Card borders | `components/website/MobileMenu.tsx:91`, as `border-slate-100` |
| `--ds-color-line-field` | `#848fa1` | Field border | Text fields and checkboxes, 3.26:1 on white | Card borders, since it is too strong for them | system |

Reasons: Colour roles ([2.1](#21-colour-roles)), Stroke and elevation ([2.8](#28-stroke-and-elevation)).

### 3.8 Status

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-danger` | `#d92d20` | Danger | Invalid borders, destructive fills, the danger dot | Text under 18px, which takes color-danger-ink | system |
| `--ds-color-danger-ink` | `#b42318` | Danger text | Error messages and destructive labels | Fills | system |
| `--ds-color-danger-line` | `rgb(217 45 32 / 0.35)` | Danger outline | The destructive button's border | Text | system |
| `--ds-color-danger-tint` | `rgb(217 45 32 / 0.08)` | Danger tint | Danger badges, destructive hover | Text | system |
| `--ds-color-danger-halo` | `rgb(217 45 32 / 0.16)` | Invalid field halo | The 3px halo of an invalid field | Anything but fields | system |
| `--ds-color-success` | `#15803d` | Success | Success text, badges and dots | Fills larger than a badge | system |
| `--ds-color-success-tint` | `rgb(21 128 61 / 0.08)` | Success tint | Success badges | Text | system |
| `--ds-color-warning` | `#b54708` | Warning | Warning text and badges | Fills larger than a badge | system |
| `--ds-color-warning-tint` | `rgb(181 71 8 / 0.08)` | Warning tint | Warning badges | Text | system |
| `--ds-color-success-on-dark` | `#5fd38d` | Success on navy | Toast and terminal success icons | Light grounds | system |
| `--ds-color-danger-on-dark` | `#ff8a80` | Danger on navy | Toast error icons | Light grounds | system |

Reasons: Colour roles ([2.1](#21-colour-roles)).

### 3.9 Veils and halos

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-veil-modal` | `rgb(10 27 51 / 0.4)` | Modal veil | Behind a dialog or sheet, solid and never blurred | The mobile menu, which keeps color-ink-20 | system |
| `--ds-color-focus-halo` | `rgb(26 109 255 / 0.18)` | Field focus halo | The 3px halo of a focused field | Buttons and cards, which take the outline | system |

Reasons: Colour roles ([2.1](#21-colour-roles)).

### 3.10 On blue

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-on-blue-80` | `rgb(255 255 255 / 0.8)` | Body on blue | Player body, carousel body, ModeToggle rest text | Light grounds | `components/website/Players.tsx:127`, as `text-white/80` |
| `--ds-color-on-blue-75` | `rgb(255 255 255 / 0.75)` | Trait label on blue | The trait bar labels | Light grounds | `components/website/PlayerTraits.tsx:37`, as `text-white/75` |
| `--ds-color-on-blue-50` | `rgb(255 255 255 / 0.5)` | Quiet white on navy and blue | Toast close and tooltip shortcut at rest, inverse card meta, the read-only switch on blue, paused progress | Text a reader must read | system |
| `--ds-color-on-blue-40` | `rgb(255 255 255 / 0.4)` | Rest dot and line on blue | Carousel dots at rest, terminal bar fills, the glass Button and on-blue Chip lines, the segmented blue track, Slider ticks and the Switch track's hover on blue | Text | `components/website/PlayerCarousel.tsx:109`, as `bg-white/40` |
| `--ds-color-on-blue-25` | `rgb(255 255 255 / 0.25)` | Ring on blue | The ModeToggle track and arrow rings | Text | `components/website/ModeToggle.tsx:29`, as `ring-white/25` |
| `--ds-color-on-blue-20` | `rgb(255 255 255 / 0.2)` | Track on blue | The trait bar track | Text | `components/website/PlayerTraits.tsx:43`, as `bg-white/20` |
| `--ds-color-on-blue-15` | `rgb(255 255 255 / 0.15)` | Glass fill on blue | The ModeToggle track, glass hover fills, the IconButton glass fill, the on-blue Badge | Light grounds, where it vanishes | `components/website/ModeToggle.tsx:29`, as `bg-white/15` |

Reasons: Special palettes ([2.2](#22-special-palettes)).

### 3.11 Terminal

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-terminal-bg` | `#0b1526` | Terminal body | The jobs terminal window | UI outside the terminal | `components/website/JobTerminal.tsx:135`, as `bg-[#0b1526]` |
| `--ds-color-terminal-bar` | `#111d31` | Terminal title bar | The bar holding the window dots | UI outside the terminal | `components/website/JobTerminal.tsx:137`, as `bg-[#111d31]` |
| `--ds-color-terminal-rule` | `rgb(255 255 255 / 0.06)` | Terminal rule | The bar's foot rule | Light grounds | `components/website/JobTerminal.tsx:137`, as `border-white/[0.06]` |
| `--ds-color-terminal-track` | `rgb(255 255 255 / 0.08)` | Terminal track | Load and score bar tracks | Light grounds | `components/website/JobTerminal.tsx:222`, as `bg-white/[0.08]` |
| `--ds-color-terminal-fill` | `rgb(255 255 255 / 0.4)` | Terminal fill | Load and score bar fills | Light grounds | `components/website/JobTerminal.tsx:224`, as `bg-white/40` |
| `--ds-color-accent-on-dark` | `#6ea8ff` | Accent lifted for dark | The terminal's answer, the dark focus ring, info toasts | Light grounds, where it fails contrast | `components/website/JobTerminal.tsx:32` |
| `--ds-color-accent-on-dark-glow` | `rgb(110 168 255 / 0.11)` | Terminal foot glow | The radial at the terminal's foot | Text or lines | `components/website/JobTerminal.tsx:149` |
| `--ds-color-terminal-red` | `#ff5f57` | Window dot | The terminal's first dot | Status, which takes color-danger | `components/website/JobTerminal.tsx:138` |
| `--ds-color-terminal-amber` | `#febc2e` | Window dot | The terminal's second dot | Status, which takes color-warning | `components/website/JobTerminal.tsx:139` |
| `--ds-color-terminal-green` | `#28c840` | Window dot | The terminal's third dot | Status, which takes color-success | `components/website/JobTerminal.tsx:140` |

Reasons: Special palettes ([2.2](#22-special-palettes)).

### 3.12 Hologram and glow

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-holo-glow` | `#7fb2ff` | Hologram glow | The AI doodle's glow lines and pen halos |  | `components/website/DoodleStroke.tsx:18` |
| `--ds-color-holo-laser` | `rgb(120 175 255 / 0.95)` | Laser glow | The Human / AI sweep's laser line glow |  | `components/website/PortraitSwap.tsx:30` |
| `--ds-color-holo-dot` | `#9cc0ff` | CTA dot band | The primary button's sweeping dot band |  | `components/website/CtaDots.tsx:17` |
| `--ds-color-doodle` | `rgb(255 255 255 / 0.85)` | Hand doodle line | The doodles round the players | Light grounds | `components/website/DoodleStroke.tsx:94` |
| `--ds-color-band-ink` | `#2f6dff` | Glyph sweep ink | The ASCII field's sweep band | UI, which takes color-accent | `components/website/ascii-field.js:62` |

Never for, unless its row says otherwise: Text or UI.

Reasons: Special palettes ([2.2](#22-special-palettes)).

### 3.13 Chromatic fringe

| Token | Value | Role | Use for | Source |
| --- | --- | --- | --- | --- |
| `--ds-color-fringe-red` | `#e89fa4` | Chromatic split, warm side | The footer wordmark's left copy | `app/globals.css:208` |
| `--ds-color-fringe-cyan` | `#9ed5dd` | Chromatic split, cool side | The footer wordmark's right copy | `app/globals.css:212` |
| `--ds-color-fringe-red-ascii` | `rgb(255 90 90)` | Glyph fringe, warm | The ASCII pool's red fringe at 0.14 | `components/website/ascii-field.js:181` |
| `--ds-color-fringe-cyan-ascii` | `rgb(90 200 255)` | Glyph fringe, cool | The ASCII pool's cyan fringe at 0.14 | `components/website/ascii-field.js:182` |

Never for, on every row: Text or UI.

Reasons: Special palettes ([2.2](#22-special-palettes)).

### 3.14 Brand mark

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-color-logo-blue` | `#1770EF` | Logo blades | The 6labs mark only | UI, which takes color-accent | `components/website/brand-marks.tsx:86` |
| `--ds-color-logo-navy` | `#030D2D` | Logo core | The 6labs mark only | UI, which takes color-ink | `components/website/brand-marks.tsx:85` |

Reasons: Special palettes ([2.2](#22-special-palettes)), Logo and identity ([6.1](#61-logo-and-identity)).

### 3.15 Type families

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-font-display` | `var(--font-outfit), ui-sans-serif, system-ui, sans-serif` | Outfit 400, 500, 600 | Headlines, names, numbers, the wordmark | Reading text | `app/layout.tsx:11`, as `font-display` |
| `--ds-font-sans` | `var(--font-inter), ui-sans-serif, system-ui, sans-serif` | Inter 400, 500, 600 | Body, labels, controls | Display lines | `app/layout.tsx:5`, as `font-sans` |
| `--ds-font-mono` | `var(--font-jbmono), ui-monospace, SFMono-Regular, Menlo, monospace` | JetBrains Mono 400, 500 | Machine text: the terminal, card meta and code at 400, badges at 500 | Prose | `app/layout.tsx:18`, as `font-[family-name:var(--font-jbmono)]` |

Reasons: Type ([2.4](#24-type)).

### 3.16 Type scale

| Token | Value | Role | Use for | Source |
| --- | --- | --- | --- | --- |
| `--ds-text-11` | `11px` | Type step 11 | eyebrow caps, card meta, code tags | system |
| `--ds-text-12` | `12px` | Type step 12 | micro labels, the copy line's pills | system |
| `--ds-text-13` | `13px` | Type step 13 | captions, tabs, chips, small controls | system |
| `--ds-text-14` | `14px` | Type step 14 | body S, controls, the container lede | system |
| `--ds-text-15` | `15px` | Type step 15 | body L, nav, the CTA label | system |
| `--ds-text-16` | `16px` | Type step 16 | body L from md, FAQ question, comparison lines on phones | system |
| `--ds-text-18` | `18px` | Type step 18 | player body, FAQ question from md, comparison lines from md | system |
| `--ds-text-20` | `20px` | Type step 20 | card titles, menu rows | system |
| `--ds-text-22` | `22px` | Type step 22 | card names | system |
| `--ds-text-24` | `24px` | Type step 24 | the wordmark | system |
| `--ds-text-26` | `26px` | Type step 26 | scroll line, comparison names on phones | system |
| `--ds-text-28` | `28px` | Type step 28 | the carousel title | system |
| `--ds-text-30` | `30px` | Type step 30 | section h2, stats | system |
| `--ds-text-34` | `34px` | Type step 34 | hero headline, the vs word and comparison names from md | system |
| `--ds-text-36` | `36px` | Type step 36 | the carousel title from md | system |
| `--ds-text-44` | `44px` | Type step 44 | section h2 and scroll line from md | system |
| `--ds-text-56` | `56px` | Type step 56 | hero and player headline from md | system |

Never for, on every row: Sizes between steps.

Reasons: Type ([2.4](#24-type)).

### 3.17 Spacing

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-space-0-5` | `2px` | Space 2 | the hover lift of cards and BackToTop |  | Tailwind 4 spacing scale |
| `--ds-space-1` | `4px` | Space 4 | track inset of rails and toggles (the segmented track's 1px line plus 3px) |  | Tailwind 4 spacing scale |
| `--ds-space-1-5` | `6px` | Space 6 | icon to label in small controls |  | Tailwind 4 spacing scale |
| `--ds-space-2` | `8px` | Space 8 | chip and badge gaps |  | Tailwind 4 spacing scale |
| `--ds-space-2-5` | `10px` | Space 10 | icon to label, list gaps |  | Tailwind 4 spacing scale |
| `--ds-space-3` | `12px` | Space 12 | control padding, button groups |  | Tailwind 4 spacing scale |
| `--ds-space-3-5` | `14px` | Space 14 | tab padding, tag panel |  | Tailwind 4 spacing scale |
| `--ds-space-4` | `16px` | Space 16 | card grid gap, page gutter on phones, section heading to subline |  | Tailwind 4 spacing scale |
| `--ds-space-5` | `20px` | Space 20 | hero and closing headline to their line, FAQ row padding |  | Tailwind 4 spacing scale |
| `--ds-space-6` | `24px` | Space 24 | card padding, card gutter |  | Tailwind 4 spacing scale |
| `--ds-space-7` | `28px` | Space 28 | comparison padding, job card top |  | Tailwind 4 spacing scale |
| `--ds-space-8` | `32px` | Space 32 | nav gap, page gutter from md, CTA top |  | Tailwind 4 spacing scale |
| `--ds-space-9` | `36px` | Space 36 | the comparison card's padding from md, site only | New work, since 36 is off the 8 grid above 32 (take space-8 or space-10) | Tailwind 4 spacing scale |
| `--ds-space-10` | `40px` | Space 40 | traits and toggle top, grid gaps |  | Tailwind 4 spacing scale |
| `--ds-space-12` | `48px` | Space 48 | jobs row top |  | Tailwind 4 spacing scale |
| `--ds-space-14` | `56px` | Space 56 | stats gap |  | Tailwind 4 spacing scale |
| `--ds-space-16` | `64px` | Space 64 | section inner gutter from md |  | Tailwind 4 spacing scale |
| `--ds-space-24` | `96px` | Space 96 | main top padding, the section rhythm's floor |  | Tailwind 4 spacing scale |
| `--ds-space-32` | `128px` | Space 128 | FAQ foot padding |  | Tailwind 4 spacing scale |

Never for, unless its row says otherwise: Off-grid values, new work stays on 4 (and on 8 above 32).

Reasons: Spacing and rhythm ([2.5](#25-spacing-and-rhythm)).

### 3.18 Layout

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-container` | `1400px` | Content width | Header inner, hero, players, every light section, the footer | Full-bleed grounds | `components/website/Jobs.tsx:103`, as `max-w-[1400px]` |
| `--ds-container-full` | `1448px` | Full-view copy grid | The full-view hero copy (1400 plus two 24px edges) | Sections | `components/website/Hero.tsx:169`, as `max-w-[1448px]` |
| `--ds-gutter-page` | `16px` | Page gutter on phones | main's side padding under md | Section inners | `app/website/page.tsx:25`, as `px-4` |
| `--ds-gutter-page-md` | `32px` | Page gutter from md | main's side padding from md | Section inners | `app/website/page.tsx:25`, as `md:px-8` |
| `--ds-gutter-section-md` | `64px` | Section inner from md | Understands, Jobs, FAQ, Closing, the footer inner | Phones, which take 16 | `components/website/Jobs.tsx:103`, as `md:px-16` |
| `--ds-measure-line` | `980px` | Scroll line measure | The scroll line statement | Body | `components/website/ScrubLine.tsx:120` |
| `--ds-measure-answer` | `680px` | Answer measure | FAQ answers and the widest full lede | Headings | `components/website/Faq.tsx:68` |
| `--ds-measure-subline` | `520px` | Subline measure | Section sublines, the closing line, carousel body | Long body | `components/website/Jobs.tsx:109` |
| `--ds-measure-body` | `480px` | Player body measure | The player body and its column | Light sections | `components/website/Players.tsx:127` |
| `--ds-measure-lede` | `440px` | Lede measure | The container lede and the traits | Sublines | `components/website/Hero.tsx:205` |
| `--ds-rhythm-section` | `clamp(96px, 9vw, 144px)` | Section rhythm | The top padding of Jobs and the comparison's offset under the header | Spacing inside a section | `components/website/Jobs.tsx:103`, as `pt-[clamp(96px,9vw,144px)]` |
| `--ds-rhythm-faq` | `clamp(72px, 7vw, 120px)` | FAQ rhythm | The top padding of the FAQ | Other sections, which take rhythm-section | `components/website/Faq.tsx:18`, as `pt-[clamp(72px,7vw,120px)]` |
| `--ds-rhythm-closing-top` | `clamp(40px, 4vw, 72px)` | Closing top | The top padding of the closing section | Other sections | `components/website/Closing.tsx:12`, as `pt-[clamp(40px,4vw,72px)]` |
| `--ds-rhythm-closing-foot` | `clamp(92px, 10vw, 150px)` | Closing foot | The room under the closing, above the footer | Other sections | `components/website/Closing.tsx:12`, as `pb-[clamp(92px,10vw,150px)]` |
| `--ds-header-h` | `73px` | Header height on phones | Offsets under the fixed header below md | Hard-coded offsets, which drift (70 at Understands.tsx:64) | `components/website/Header.tsx:52` |
| `--ds-header-h-md` | `80px` | Header height from md | Offsets under the fixed header from md | Hard-coded offsets, which drift (89 at Hero.tsx) | `components/website/Header.tsx:52` |

Reasons: Layout and breakpoints ([2.6](#26-layout-and-breakpoints)).

### 3.19 Breakpoints

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-bp-sm` | `640px` | Tailwind sm | Rare phone splits | The full-view hero | Tailwind default |
| `--ds-bp-md` | `768px` | Tailwind md | Phone to tablet, the main split of new work | The full-view hero | Tailwind default |
| `--ds-bp-lg` | `1024px` | Tailwind lg | Tablet to desktop, the players layout | The full-view hero | Tailwind default |
| `--ds-bp-xl` | `1280px` | Tailwind xl | Wide desktop, the jobs grid | The full-view hero | Tailwind default |
| `--ds-bp-hero-561` | `561px` | Full hero ladder | The full-view hero only | New work | `components/website/Hero.tsx:18` |
| `--ds-bp-hero-901` | `901px` | Full hero ladder | The full-view hero only | New work | `components/website/Hero.tsx:18` |
| `--ds-bp-hero-1600` | `1600px` | Full hero ladder | The full-view hero and the floating badges | New work | `components/website/Hero.tsx:18` |
| `--ds-bp-hero-1920` | `1920px` | Full hero ladder | The full-view hero only | New work | `components/website/Hero.tsx:18` |
| `--ds-bp-hero-2560` | `2560px` | Full hero ladder | The full-view hero only | New work | `components/website/Hero.tsx:18` |
| `--ds-bp-edge` | `380px` | Narrow phone edge | The jobs tabs' tighter padding | Layout splits | `components/website/Jobs.tsx:128` |

Reasons: Layout and breakpoints ([2.6](#26-layout-and-breakpoints)), Responsive ladder ([9.6](#96-responsive-ladder)).

### 3.20 Radius

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-radius-caret` | `1px` | Caret | The typed caret | Controls | `app/globals.css:106` |
| `--ds-radius-mark-xs` | `2px` | Link focus wrap | The focus ring's corner round a text link | Boxes and marks | system |
| `--ds-radius-mark-sm` | `4px` | Small mark | Checkboxes at sm and md, a text action's and the lockup's focus wrap | Rows and panels | system |
| `--ds-radius-mark` | `6px` | Mark | The lg checkbox, key caps, a tab's focus wrap and its panel | Rows and panels | system |
| `--ds-radius-bubble` | `8px` | Bubble | Tooltip and slider value bubbles, the skeleton title | Panels, which take radius-sm | system |
| `--ds-radius-xs` | `12px` | Rows and inset panels | Menu rows, the tag panel, inner rows at 6px padding | Cards | `components/website/Jobs.tsx:184`, as `rounded-[12px]` |
| `--ds-radius-row` | `14px` | List row | FAQ rows and accordion cards | Cards | `components/website/Faq.tsx:33`, as `rounded-[14px]` |
| `--ds-radius-sm` | `16px` | Panels | The terminal window, menu panels, toasts | Cards | `components/website/JobTerminal.tsx:135`, as `rounded-[16px]` |
| `--ds-radius-md` | `24px` | Cards on phones | Job cards under md | Desktop cards | `components/website/Jobs.tsx:162`, as `max-md:rounded-[24px]` |
| `--ds-radius-lg` | `28px` | Cards | Player, job and comparison cards, dialogs, the sheen | Rows | `components/website/Jobs.tsx:162`, as `rounded-[28px]` |
| `--ds-radius-container-sm` | `32px` | Container on phones | The hero container under md | Cards | `components/website/Hero.tsx:125`, as `max-md:rounded-[32px]` |
| `--ds-radius-xl` | `36px` | Comparison cards | The comparison cards from md, the empty state and the index card | Rows | `components/website/Understands.tsx:22`, as `rounded-[36px]` |
| `--ds-radius-2xl` | `48px` | The container | The hero container | Anything inside it | `components/website/Hero.tsx:125`, as `rounded-[48px]` |
| `--ds-radius-full` | `9999px` | Pill | Buttons, chips, badges, dots, toggles, tabs | Cards | `components/website/PrimaryCta.tsx:100`, as `rounded-full` |
| `--ds-radius-model` | `28%` | Model square | A player model's avatar, as a share of its size | People, who take radius-full | system |

Reasons: Radius ([2.7](#27-radius)).

### 3.21 Stroke

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-stroke-hairline` | `1px` | Hairline | Every border | Emphasis, which takes a stronger colour | `components/website/Jobs.tsx:162` |
| `--ds-stroke-sheen` | `1.5px` | Sheen line | The pointer light along a card |  | `app/globals.css:243` |
| `--ds-stroke-dot` | `2px` | Dot ring | The leader's end dot |  | `components/website/CopyLine.tsx:112` |
| `--ds-stroke-spinner` | `1.75px` | Spinner ring | The 16px spinner |  | `components/website/HeroBits.tsx:114` |
| `--ds-stroke-ring-vs` | `6px` | Page ring | The page-colour ring round the vs disc | Anything else | `components/website/Understands.tsx:87` |

Never for, unless its row says otherwise: Borders.

Reasons: Stroke and elevation ([2.8](#28-stroke-and-elevation)).

### 3.22 Elevation and glow

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-shadow-container` | `0 40px 100px -20px rgba(0,0,0,0.03)` | The container | The hero container only | Cards at rest on light grounds | `components/website/Hero.tsx:125` |
| `--ds-shadow-float` | `0 1px 2px rgba(10,27,51,0.06), 0 12px 28px -12px rgba(10,27,51,0.35)` | Float | BackToTop, elevated icon buttons, toasts | Cards in the flow | `components/website/BackToTop.tsx:62` |
| `--ds-shadow-pop` | `0 18px 50px -12px rgba(10,27,51,0.18)` | Pop | Menus and select panels | Cards | `components/website/LanguageMenu.tsx:78` |
| `--ds-shadow-thumb` | `0 6px 16px -8px rgba(10,27,51,0.45)` | Thumb | The toggle and segmented thumb | Cards | `components/website/ModeToggle.tsx:49` |
| `--ds-shadow-lift` | `0 1px 2px rgba(10,27,51,0.05), 0 24px 48px -24px rgba(10,27,51,0.22)` | Lift | A clickable card on hover | Rest states | `components/website/Players.tsx:224` |
| `--ds-shadow-player` | `0 24px 48px -28px rgba(10,27,51,0.35)` | Player card rest | Player cards on blue | Light grounds | `components/website/Players.tsx:26` |
| `--ds-shadow-player-selected` | `0 28px 56px -26px rgba(10,27,51,0.45)` | Player card selected | The selected player card on blue | Light grounds | `components/website/Players.tsx:222` |
| `--ds-shadow-tooltip` | `0 8px 24px -8px rgba(10,27,51,0.35)` | Bubble | Tooltip and slider value bubbles: float's ink with a shorter throw, since a bubble sits on its trigger | Panels | system |
| `--ds-shadow-modal` | `0 40px 100px -20px rgba(10,27,51,0.28)` | Modal | Dialogs and sheets | Anything in the flow | system |
| `--ds-glow-caret` | `0 0 10px rgba(26,109,255,0.55)` | Caret glow | The typed caret | Controls | `app/globals.css:108` |
| `glow-sheen` | `0 0 7px rgba(26,109,255,0.5)`, no CSS | Sheen bloom | The sheen's bloom, as a value only | A CSS filter, which the compositor rule forbids | `app/globals.css:253` |

Reasons: Stroke and elevation ([2.8](#28-stroke-and-elevation)).

### 3.23 Focus

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-focus-width` | `2px` | Ring width | Every focus-visible outline | Borders | system |
| `--ds-focus-offset` | `2px` | Ring offset on controls | Buttons, chips, links, fields with an outline | Cards | system |
| `--ds-focus-offset-card` | `3px` | Ring offset on cards | Cards and large surfaces | Controls | system |
| `--ds-focus-color` | `#1a6dff` | Ring on light | Page, surface and container grounds | Blue and dark grounds | system |
| `--ds-focus-color-inverse` | `#ffffff` | Ring on blue | Controls on the players' accent ground | Light grounds | system |
| `--ds-focus-color-dark` | `#6ea8ff` | Ring on dark | Controls on navy and the terminal | Light grounds | system |
| `--ds-focus-offset-inset` | `-2px` | Ring offset inside | Items in a scroll row, whose overflow would clip the ring | Controls with room round them | system |
| `--ds-focus-halo` | `0 0 0 3px var(--ds-color-focus-halo)` | Field halo | A focused text field, in place of the outline | Buttons | system |
| `--ds-focus-halo-danger` | `0 0 0 3px var(--ds-color-danger-halo)` | Invalid field halo | An invalid field, at rest and under focus, where focus adds the outline | Valid fields | system |

Reasons: Focus ([2.10](#210-focus)).

### 3.24 Icon sizes

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-icon-12` | `12px` | Icon 12 | Badges | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-12-stroke` | `2.25` | Stroke at 12 | lucide strokeWidth at 12px | Other sizes | system |
| `--ds-icon-14` | `14px` | Icon 14 | xs controls, chip check and remove, inline with 13px text | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-14-stroke` | `2` | Stroke at 14 | lucide strokeWidth at 14px | Other sizes | system |
| `--ds-icon-16` | `16px` | Icon 16 | List leads (a Tag, a menu row), sm and md controls | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-16-stroke` | `1.75` | Stroke at 16 | lucide strokeWidth at 16px | Other sizes | system |
| `--ds-icon-18` | `18px` | Icon 18 | In 40 and 44 boxes, beside lg and xl pill labels | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-18-stroke` | `1.75` | Stroke at 18 | lucide strokeWidth at 18px | Other sizes | system |
| `--ds-icon-20` | `20px` | Icon 20 | In a 48 box (the xl icon button) | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-20-stroke` | `1.6` | Stroke at 20 | lucide strokeWidth at 20px | Other sizes | system |
| `--ds-icon-24` | `24px` | Icon 24 | Standalone, the terminal pointer | Sizes between steps (17 and 22 on the site normalise) | system |
| `--ds-icon-24-stroke` | `1.5` | Stroke at 24 | lucide strokeWidth at 24px | Other sizes | system |

Reasons: Icons ([2.9](#29-icons)).

### 3.25 Z-scale

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-z-backdrop` | `-10` | Behind the page | The fixed ASCII field, the doodle layer | Content | `components/website/AsciiBackdrop.tsx:61`, as `-z-10` |
| `--ds-z-floor` | `0` | The tile floor | The hero's WebGL floor | Controls | `components/website/Hero.tsx:132`, as `z-0` |
| `--ds-z-raised` | `10` | Raised in a section | Player cards, the vs disc, the carousel, the floor logo | Anything fixed | `components/website/Understands.tsx:87`, as `z-10` |
| `--ds-z-copy` | `20` | Copy over the floor | Hero copy, the wave button, the scroll cue, the accent water | Overlays | `components/website/AccentWave.tsx:193`, as `z-20` |
| `--ds-z-stage` | `30` | Loader and players | The hero loader and the players section | Overlays | `components/website/Players.tsx:103`, as `z-30` |
| `--ds-z-header` | `40` | Fixed chrome | The header and BackToTop | Popovers | `components/website/Header.tsx:53`, as `z-40` |
| `--ds-z-popover` | `45` | Popovers | Menus and select panels above the header | Dialogs and sheets, which open with showModal in the top layer over every z value | system |
| `--ds-z-toast` | `60` | Toasts | Over the header and popovers, under an open modal, so a dialog's outcome is toasted after it closes | Tooltips | system |
| `--ds-z-tooltip` | `70` | Tooltips | Tooltips and the skip link, the top of the stack | Anything else | system |

Reasons: Layer stack ([5.1](#51-layer-stack)).

### 3.26 Eases

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | The ease | Every entrance, panel, bar and settle | Loops, which run linear or ease-in-out | `components/website/Players.tsx:23` |
| `--ds-ease-out-tw` | `cubic-bezier(0, 0, 0.2, 1)` | Tailwind ease-out | The hero's opacity fades only | New work, which takes ease-out | `components/website/Hero.tsx:37`, as `ease-out` |
| `--ds-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | In-out cubic | The Human / AI sweep and the tile flip | Entrances | `components/website/PortraitSwap.tsx:187` |
| `--ds-ease-sweep` | `cubic-bezier(0.45, 0, 0.25, 1)` | CTA sweep | The primary button's dot band run | Anything else | `components/website/PrimaryCta.tsx:85` |
| `--ds-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Ease in | Exits and the badge flip's first half | Entrances | `components/website/FloatingBadges.tsx:138` |
| `--ds-ease-linear` | `linear` | Linear | Loops, spinners, load bars | Anything that settles | `components/website/HeroBits.tsx:114` |
| `--ds-ease-glide` | `cubic-bezier(0.33, 1, 0.68, 1)` | Glide | In-page link glides (1 - (1 - k)^3) | UI transitions | `components/website/glide.ts:10` |

Reasons: Easing, duration, springs ([4.1](#41-easing-duration-springs)).

### 3.27 Durations

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-dur-press` | `120ms` | Press | A press settling, a field growing a line, a tooltip leaving | Colour changes | system |
| `--ds-dur-exit` | `140ms` | Exit | A menu or panel closing, every overlay's fade under reduced motion | Entrances | `components/website/LanguageMenu.tsx:23` |
| `--ds-dur-quick` | `160ms` | Quick | A tooltip arriving, a toast leaving, a chip collapsing, an icon swap | Hover colour, which takes dur-ui | system |
| `--ds-dur-ui` | `200ms` | UI colour | Hover colour on controls, chip checks, label reveals | Lines and lifts | `components/website/Header.tsx:102`, as `duration-200` |
| `--ds-dur-menu` | `250ms` | Menu | The mobile sheet and its veil | Panels | `components/website/MobileMenu.tsx:79` |
| `--ds-dur-line` | `300ms` | Line and lift | Links, borders, card lifts, the FAQ row | Colour on small controls | `components/website/Header.tsx:86`, as `duration-300` |
| `--ds-dur-panel` | `350ms` | Panel | An accordion answer opening, a detail swap | Hover | `components/website/Faq.tsx:65` |
| `--ds-dur-sheen` | `400ms` | Sheen | The card sheen fading in | Hover colour | `app/globals.css:260` |
| `--ds-dur-exit-long` | `450ms` | Long exit | Loaders leaving, a live count settling | Controls | `components/website/HeroBits.tsx:65` |
| `--ds-dur-reveal` | `500ms` | Reveal | The players reveal and portrait swap | Controls | `components/website/Players.tsx:88` |
| `--ds-dur-numbers` | `600ms` | Numbers | The hero numbers rising | Controls | `components/website/HeroBits.tsx:35` |
| `--ds-dur-rise` | `700ms` | Rise | Section entrances and trait bars | Controls | `components/website/Understands.tsx:48` |
| `--ds-dur-tiles` | `900ms` | Tiles | The tile floor rising in | UI | `tiles/intro.js:12` |
| `--ds-dur-sweep` | `1000ms` | Sweep | The primary button's dot band | UI colour | `components/website/PrimaryCta.tsx:22` |
| `--ds-dur-swap` | `1500ms` | Swap | The Human / AI sweep up the portrait | UI | `components/website/PortraitSwap.tsx:19` |
| `--ds-dur-shimmer` | `1600ms` | Shimmer | The skeleton shimmer's pass | Anything that settles | system |

Reasons: Easing, duration, springs ([4.1](#41-easing-duration-springs)).

### 3.28 Springs

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `spring-press` | `stiffness 400, damping 25`, no CSS | Press | Button grow and press, icon button press | Panels | `components/website/PrimaryCta.tsx:99` |
| `spring-thumb` | `stiffness 500, damping 40`, no CSS | Thumb | Toggle and segmented thumbs, selected checks | Panels | `components/website/ModeToggle.tsx:50` |
| `spring-pop` | `stiffness 460, damping 34, mass 0.7`, no CSS | Pop | Menus, select panels, toasts, dialogs | Presses | `components/website/LanguageMenu.tsx:17` |
| `spring-drift` | `stiffness 60, damping 18`, no CSS | Drift | The floating badges following the pointer | Controls | `components/website/FloatingBadges.tsx:39` |

Reasons: Easing, duration, springs ([4.1](#41-easing-duration-springs)).

### 3.29 Press and grow scales

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-scale-press-mark` | `0.92` | Mark press | Choice marks under a held press | Whole controls | system |
| `--ds-scale-press-round` | `0.94` | Round press | Round small targets: icon buttons, avatars, the toast close | Pills, which take scale-press-pill | system |
| `--ds-scale-press-pill` | `0.97` | Pill press | Pills, chips, segments, tabs and text actions | Whole cards | `components/website/PrimaryCta.tsx:97` |
| `--ds-scale-press-card` | `0.985` | Card press | Whole cards and the index card | Small targets | system |
| `scale-panel` | `0.96`, no CSS | Panel scale | Menus, select panels, tooltips, toasts and dialogs arriving and leaving | Presses | system |
| `scale-grow` | `1.02`, no CSS | Grow | A solid pill growing on hover below lg | Cards | system |
| `scale-grow-large` | `1.04`, no CSS | Large grow | A solid pill growing on hover from lg, as Try now does | Cards | `components/website/PrimaryCta.tsx:96` |

Reasons: Easing, duration, springs ([4.1](#41-easing-duration-springs)), Micro-interactions ([4.3](#43-micro-interactions)).

### 3.30 Travel

| Token | Value | Role | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- |
| `--ds-rise-y` | `28px` | Entrance travel | Section entrances | Controls | `components/website/Understands.tsx:45` |
| `--ds-reveal-y` | `24px` | Reveal travel | The players reveal | Controls | `components/website/Players.tsx:86` |
| `--ds-numbers-y` | `6px` | Small rise | The hero numbers, small content swaps | Sections | `components/website/HeroBits.tsx:33` |
| `--ds-lift-y` | `2px` | Hover lift | Cards and floating buttons on hover | Text | `components/website/BackToTop.tsx:62` |
| `--ds-loop-max` | `8px` | Loop ceiling | The most an ambient loop may travel | Entrances | system |

Reasons: Easing, duration, springs ([4.1](#41-easing-duration-springs)).

### 3.31 Type roles

| Role | Face | Size / leading / tracking | Steps | What it is | Use for | Never for | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `--ds-type-footer-word-*` | Outfit 600 | `clamp(84px, 19vw, 300px) / 1 / -0.055em` | none | Footer wordmark | The giant 6labs at the page's foot | Any other line | `components/website/CopyLine.tsx:67` |
| `--ds-type-hero-full-*` | Outfit 500 | `34px / 1.05 / -0.025em` | from 561: 36px, from 901: 42px, from 1280: 54px, from 1600: 64px, from 1920: 76px, from 2560: 88px, short screens: 48px | Hero headline, full view | The one h1 of the full-view hero | Section headings | `components/website/Hero.tsx:18` |
| `--ds-type-closing-*` | Outfit 500 | `clamp(38px, 5.2vw, 74px) / 1.05 / -0.045em` | none | Closing headline | The closing line before the footer | Section heads | `components/website/Closing.tsx:22` |
| `--ds-type-hero-*` | Outfit 500 | `34px / 1.05 / -0.025em` | from 768: 56px | Hero and player headline | The container hero h1 and the player title | Section heads | `components/website/Hero.tsx:187` |
| `--ds-type-h2-*` | Outfit 500 | `30px / 1.1 / -0.025em` | from 768: 44px | Section heading | Jobs and FAQ heads, new section heads | Card titles | `components/website/Jobs.tsx:106` |
| `--ds-type-scroll-line-*` | Outfit 500 | `26px / 1.3 / -0.025em` | from 768: 44px | Scroll line statement | The centred statement that fills on scroll | Headings | `components/website/ScrubLine.tsx:120` |
| `--ds-type-carousel-title-*` | Outfit 500 | `28px / 1.1 / -0.025em` | from 768: 36px | Carousel player title | The player name under lg | Light grounds | `components/website/PlayerCarousel.tsx:84` |
| `--ds-type-stat-*` | Outfit 500, tabular | `30px / 1 / -0.025em` | none | Stat number | Hero numbers | Prose numbers | `components/website/HeroBits.tsx:55` |
| `--ds-type-comparison-name-*` | Outfit 500 | `26px / 1.1 / -0.025em` | from 768: 34px | Comparison name | The maker's name heading each comparison card, 500 on the grey and 400 (6labs) on the navy | Section heads | `components/website/Understands.tsx:31` |
| `--ds-type-vs-*` | Outfit 400 | `27px / 1 / -0.025em` | from 768: 34px | The vs word | The vs on the disc between the comparison cards, decorative and aria-hidden | Text a reader must read | `components/website/Understands.tsx:87` |
| `--ds-type-card-name-*` | Outfit 500 | `22px / 1.25 / -0.025em` | none | Card name | Player cards | Section heads | `components/website/Players.tsx:230` |
| `--ds-type-wordmark-*` | Outfit 500 | `24px / 32px / -0.025em` | none | Logo wordmark | The 6labs lockup in the header and footer | Headings | `components/website/Header.tsx:73` |
| `--ds-type-card-title-*` | Outfit 500 | `20px / 1.25 / -0.03em` | none | Card title | Job cards and new card titles | Body | `components/website/Jobs.tsx:164` |
| `--ds-type-menu-row-*` | Outfit 400 | `20px / 1.5 / -0.025em` | none | Mobile menu row | Rows of the mobile menu | Desktop nav | `components/website/MobileMenu.tsx:91` |
| `--ds-type-question-*` | Outfit 500 | `16px / 1.375 / -0.02em` | from 768: 18px | FAQ question | Accordion triggers | Body | `components/website/Faq.tsx:45` |
| `--ds-type-lede-full-*` | Inter 400 | `16px / 1.55 / -0.015em` | from 561: 16.5px, from 901: 15px, from 1280: 16px, from 1600: 18px, from 1920: 20px, from 2560: 22px | Lede, full view | The full-view hero's lede | Body copy | `components/website/Hero.tsx:20` |
| `--ds-type-lede-*` | Inter 400 | `14px / 1.625 / 0` | from 768: 15px | Lede, container hero | The line under the container h1 | Long body | `components/website/Hero.tsx:205` |
| `--ds-type-player-body-*` | Inter 400 | `16px / 1.625 / 0` | from 768: 18px | Player body | The player description on blue | Light grounds | `components/website/Players.tsx:127` |
| `--ds-type-comparison-*` | Inter 400 | `16px / 1.5 / 0` | from 768: 18px | Comparison line | The two lines inside each comparison card, in the card's one ink | Headings | `components/website/Understands.tsx:32` |
| `--ds-type-body-l-*` | Inter 400 | `15px / 1.5 / 0` | from 768: 16px | Body L | The closing line | Labels | `components/website/Closing.tsx:27` |
| `--ds-type-subline-*` | Inter 400 | `15px / 1.375 / 0` | from 768: 16px | Section subline | Section sublines, the carousel body on blue | Long reading | `components/website/Jobs.tsx:109` |
| `--ds-type-answer-*` | Inter 400 | `14px / 1.6 / 0` | from 768: 15px | FAQ answer | Accordion answers | Labels | `components/website/Faq.tsx:68` |
| `--ds-type-stat-label-*` | Inter 400 | `14px / 1.375 / 0` | from 768: 15px | Stat label | The words under the hero numbers | Body | `components/website/HeroBits.tsx:46` |
| `--ds-type-nav-*` | Inter 400 | `15px / 1.5 / -0.01em` | none | Nav link | Header links, menu rows | Body | `components/website/Header.tsx:86` |
| `--ds-type-cta-*` | Inter 500 | `15px / 1.5 / 0` | none | Primary CTA label | Try now only. System buttons take button-label | Body | `components/website/PrimaryCta.tsx:100` |
| `--ds-type-button-label-*` | Inter 500 | `14px / 1.5 / -0.01em` | none | Button label | System Button labels: 12 / 13 / 14 / 15 / 15 at xs to xl (14 is md), all at -0.01em | Try now, which keeps cta | `components/design-system/button-styles.ts:25` |
| `--ds-type-dialog-title-*` | Outfit 500 | `24px / 30px / -0.03em` | none | Dialog title | The title of a Dialog or sheet | Section heads | `components/design-system/dialog-styles.ts:33` |
| `--ds-type-dialog-description-*` | Inter 400 | `15px / 22px / 0` | none | Dialog description | The line under a dialog title | The body, which takes dialog-body | `components/design-system/dialog-styles.ts:35` |
| `--ds-type-dialog-body-*` | Inter 400 | `15px / 1.6 / 0` | none | Dialog body | The scrolling body of a Dialog | Labels | `components/design-system/dialog-styles.ts:37` |
| `--ds-type-field-label-*` | Inter 500 | `13px / 18px / -0.01em` | none | Field label | The label over a field, a Select, a SearchField and a Slider, and a choice group's legend | Body | `components/design-system/field-styles.ts:83` |
| `--ds-type-helper-*` | Inter 400 | `13px / 18px / 0` | none | Helper line | Field helper and error lines, choice descriptions, the toast body, the Slider value | Labels | `components/design-system/Field.tsx:107` |
| `--ds-type-counter-*` | Inter 400, tabular | `12px / 18px / 0` | none | Character count | The count under a field with a maxLength | Prose numbers | `components/design-system/Field.tsx:115` |
| `--ds-type-choice-label-*` | Inter 400 | `14px / 20px / 0` | none | Choice label | Checkbox, Radio and Switch labels | Field labels, which take field-label | `components/design-system/choice-styles.ts:17` |
| `--ds-type-list-row-*` | Inter 400 | `15px / 22px / 0` | none | List row | Select and SearchField option rows and their empty line | Body | `components/design-system/select-panel.tsx:134` |
| `--ds-type-toast-title-*` | Inter 500 | `14px / 20px / 0` | none | Toast title | The first line of a toast | Body | `components/design-system/Toast.tsx:84` |
| `--ds-type-tooltip-*` | Inter 500 | `12px / 16px / 0` | none | Tooltip words | The words in a tooltip bubble | Body | `components/design-system/TooltipBubble.tsx:28` |
| `--ds-type-group-caps-*` | Inter 500, caps | `11px / 16px / 0.14em` | none | Group caps | The group names inside a Select or SearchField list | Sentences | `components/design-system/select-panel.tsx:187` |
| `--ds-type-body-s-*` | Inter 400 | `14px / 1.4 / -0.01em` | none | Body S | Job body and card body | Long reading | `components/website/Jobs.tsx:167` |
| `--ds-type-card-tagline-*` | Inter 400 | `14px / 1.375 / 0` | none | Card tagline | The tagline under a player card's name, hidden under lg | Body | `components/website/Players.tsx:238` |
| `--ds-type-trait-label-*` | Inter 400 | `14px / 1.5 / 0` | none | Trait label | The trait bar labels on blue, 13px in the dense card | Light grounds | `components/website/PlayerTraits.tsx:37` |
| `--ds-type-caption-l-*` | Inter 400 | `13.5px / 1.5 / -0.01em` | none | Caption 13.5 | The closing small line, footer links | New work, which takes 13 or 14 | `components/website/Closing.tsx:34` |
| `--ds-type-caption-*` | Inter 400 | `13px / 1.625 / 0` | none | Caption 13 | The social proof line | Body | `components/website/Hero.tsx:236` |
| `--ds-type-tab-label-*` | Inter 500 | `13px / 1.5 / 0` | none | Tab label | The jobs switch's tabs | Body | `components/website/Jobs.tsx:128` |
| `--ds-type-footer-base-*` | Inter 400 | `13px / 1.5 / -0.01em` | none | Footer base | The footer's own text, which its links and legal line inherit | Body | `components/website/Footer.tsx:26` |
| `--ds-type-footer-intro-*` | Inter 400 | `14px / 1.65 / -0.015em` | none | Footer intro | The line under the footer lockup | Body | `components/website/Footer.tsx:48` |
| `--ds-type-footer-head-*` | Inter 600 | `13.5px / 1.5 / -0.02em` | none | Footer column head | The footer's column titles | New work, which takes 13 or 14 | `components/website/Footer.tsx:57` |
| `--ds-type-micro-*` | Inter 400 | `12px / 1.5 / -0.01em` | none | Micro 12 | The footer copy line's model pills | Body | `components/website/CopyLine.tsx:102` |
| `--ds-type-eyebrow-*` | Inter 500, caps | `11px / 1.5 / 0.18em` | none | Eyebrow caps | The scroll cue and the loader label | Sentences | `components/website/ScrollCue.tsx:25` |
| `--ds-type-code-tag-*` | Inter 600 | `11px / 1.5 / 0.025em` | none | Code tag | Language codes in the menu | Labels | `components/website/LanguageMenu.tsx:95` |
| `--ds-type-card-meta-*` | JetBrains Mono 400, caps | `11px / 1.5 / 0.14em` | under 1024: 10px / 0.08em | Card meta | Model number and status on player cards | Sentences, badge labels | `components/website/Players.tsx:247` |
| `--ds-type-badge-*` | JetBrains Mono 500, caps | `11px / 1 / 0.12em` | none | Badge label | Badge labels: 0.12em at md, 0.08em at sm | Sentences | `components/design-system/Badge.tsx:21` |
| `--ds-type-terminal-*` | JetBrains Mono 400 | `12.5px / 22px / 0` | under 768: 11.5px / 20px | Terminal text | The jobs terminal | Light grounds | `components/website/JobTerminal.tsx:142` |

Reasons: Type ([2.4](#24-type)).

## 4 Motion

How things move: the eases, durations and springs, then entrances, the small answers to a press or a hover, the loops that run on their own, the staged sequences and the reduced-motion rule. Read Easing, duration, springs ([4.1](#41-easing-duration-springs)) first, since every other chapter here takes its timings from it, and Reduced motion ([4.6](#46-reduced-motion)) before shipping anything that moves.

### 4.1 Easing, duration, springs

#### Values

One ease, `cubic-bezier(0.22, 1, 0.36, 1)` (`--ds-ease-out`, `EASE` in `src/components/design-system/motion.ts`). Every other curve has one job. A ladder of durations named by job, from the 120ms press to the 1600ms shimmer (`--ds-dur-*`, `DUR`). Its two quickest steps are system additions for the new parts: 120ms (`--ds-dur-press`) for a press settling, a field growing a line and a tooltip leaving, and 160ms (`--ds-dur-quick`) for a tooltip arriving, a toast leaving, a chip collapsing and an icon swap. Every overlay's reduced-motion fade takes the 140ms exit. The springs (`spring-press` 400 / 25, `spring-thumb` 500 / 40, `spring-pop` 460 / 34 mass 0.7, `spring-drift` 60 / 18) exist only in JS (`SPRING`). A ladder of press and grow scales, one per job (`--ds-scale-*`, `SCALE`). Travel distances run from the 28px section rise down to the 2px hover lift, with an 8px ceiling for loops. Every value, with its role, use, misuse and source line, is in [chapter 3](#3-tokens-reference), from Eases ([3.26](#326-eases)) through Durations ([3.27](#327-durations)), Springs ([3.28](#328-springs)) and Press and grow scales ([3.29](#329-press-and-grow-scales)) to Travel ([3.30](#330-travel)).

#### Use for

- The ease: anything that arrives, opens, fills or settles. Entrances, panels, bars, the trait fill, a menu row.
- In-out cubic: a sweep that has to start and end at rest because something is swapped at its middle (the Human / AI sweep, the tile flip).
- The CTA sweep curve: the primary button's dot band, nothing else.
- Ease in: the first half of a flip and a panel leaving, where the part should accelerate away.
- Linear: anything that repeats (spinners, load bars, a turning logo), because an eased loop visibly pauses at each end.
- Glide: the in-page link scroll only.
- Springs: direct manipulation. A press, a thumb sliding to a choice, a panel opening from the control that was just pressed, the badges following the pointer.
- The scales, by what is pressed: 0.94 for round small targets (icon buttons, avatars, the toast's close), 0.97 for pills, chips, segments, tabs and text actions, 0.985 for a whole card, and 0.92 for a choice mark under a held press. Panels arrive from 0.96. A solid pill grows to 1.02 on hover below lg and to 1.04 from lg, as Try now does. The smaller the target, the deeper the press, so the change still shows under a finger.

#### Never for

- A curve that overshoots (a back or bounce ease) on a control. It reads as play, and the site never settles that way.
- A spring on something the visitor did not touch (an entrance, a reveal). A spring promises that it follows the hand.
- A new duration picked by feel. Choose the job first, then take its duration from the ladder.
- Tailwind's `ease-out` (`0, 0, 0.2, 1`) in new work. The hero's opacity fades use it today, and that is history, not a choice.

#### Reasons

- One curve is what makes many parts feel like one product. A quick start answers the input at once, and the long tail lets the eye arrive with the part, so nothing snaps.
- A link that colours in 200ms in one place and 300ms in another feels like two sites, which is why durations are named by job rather than by length.
- An interrupted spring turns round from where it is, with its velocity, so a press released halfway never jumps back to a keyframe.
- Travel scales with the size of what moves. Large travel on a small part reads as a jump, small travel on a section reads as nothing.

#### Known drift

The site declares the ease as a local const in every file that uses it, which the guide's drift table counts. It also has three near-duplicates on the ladder: 0.45s loader exits against 0.5s reveals, 0.6s hero numbers against 0.7s section rises, and 200ms against 300ms for the same kind of link hover (Sign in and the hero inline link at 200, the header and footer links at 300). New parts import `motion.ts`, so the count stops growing. Folding the duplicates changes the live site, so it waits for the owner. LanguageMenu's exit eases on motion's named `easeIn`, `cubic-bezier(0.42, 0, 1, 1)`, a near twin of the ease-in token's `cubic-bezier(0.4, 0, 1, 1)` that the eye cannot tell apart and a search for the token misses.

### 4.2 Entrance and reveal

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

The site sets no `MotionConfig`, so every motion/react entrance still travels when the visitor asks for less motion. New work keeps the opacity change and drops the travel, as Reduced motion ([4.6](#46-reduced-motion)) sets out.

#### Responsive

The values do not change by breakpoint. What changes is the trigger geometry: below xl the Jobs cards sit in a swipe row, which is why that row uses an IntersectionObserver on the row rather than one per card.

### 4.3 Micro-interactions

#### Values

The trigger table, each row with its part, response, timing and source line, lives in the guide. The pattern under it is short: colour changes on small controls take 200ms (`--ds-dur-ui`), lines, borders and lifts take 300ms (`--ds-dur-line`), an answer or detail opening takes 350ms (`--ds-dur-panel`), a closing panel 140ms (`--ds-dur-exit`), and every press, thumb and popover rides a spring.

#### Use for

Any new control takes its timing from the row whose trigger and job match. A new toggle's thumb takes the thumb spring because ModeToggle's does. A new disclosure takes the Faq's 0.35s height and 300ms icon turn.

#### Never for

- Meaning carried by hover alone. Whatever a hover reveals (a label, a lift that says "this is a card you can press") has a twin on `:focus-visible`, or a keyboard visitor gets less than a mouse one.
- Hover effects on touch. Tailwind v4's `hover:` variant applies only under `(hover: hover)`, and new CSS hovers are written inside the same query, so a tap never leaves a part stuck in its hover look.
- Animating layout properties on a hot path. Width and height transitions (the wave label, the carousel dot, the Faq answer) are kept to small, rare parts. New work moves transforms and opacity.
- Blur or filter in a transition. The LanguageMenu panel animates `filter: blur()` today, which breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)) while it runs. New popovers use scale, y and opacity only.

#### Reasons

- A shared table keeps the site consistent without anyone remembering numbers, and a visitor who learns the rhythm on one control can predict the next.
- Colour is quick because it is information the visitor is waiting for. Movement is a little slower because the eye has to follow it.
- Exits are faster than entrances. A closing menu is already out of the visitor's attention, so it should get out of the way.
- Springs on presses and thumbs carry their velocity into the next input, so a quick double click never queues a second animation.

#### Accessibility

Every hover response must be reachable from the keyboard and must not be the only carrier of a state. The WaveButton's label is the known gap: it widens on hover only, so a keyboard visitor tabs onto an icon whose name is visually hidden. The system IconButton's `showLabelOnHover` widens on focus too.

#### Responsive

Timings do not change by breakpoint. Below md the hover rows simply do not fire, and the press rows (MobileMenu rows, carousel dots) carry the feedback.

### 4.4 Ambient loops

#### Values

The loops that run by themselves today range from the 1.8s scroll-cue bob (4px) to the 90s floor-logo turn, and the guide's table lists each one's period, travel, curve, reduced-motion answer and source. The limits for any loop that is ambience: travel 8px or less (`--ds-loop-max`), a period of 1.5s or longer, transform and opacity only.

#### Use for

A loop says "this is alive" or "there is more here": the scroll cue, the floating tiles drifting, a loader saying it is still working, a live dot next to a count. It sits at the edge of attention and is never the thing being read.

#### Never for

- Content. A loop never carries text or a value the visitor needs, because a moving word cannot be read.
- Attention. A loop that moves more than 8px or faster than every 1.5s reads as an alert and pulls the eye off the copy.
- Anything that keeps running out of view. Loops with a cost (the badge flips, the ASCII field, the touch sway) run only while their part is near the view.
- Running under reduced motion. Every CSS loop on the site has a `prefers-reduced-motion: reduce` rule that stops it at its rest frame, and a new one ships with that rule in the same commit.

#### Reasons

- The page is calm because nothing competes with the floor and the copy. Short travel and long periods keep the loops below the threshold where the eye starts tracking them.
- Ease-in-out on a bob makes it rest at both ends, so it breathes rather than vibrates. Linear is kept for turning and cycling, where an ease would show a stutter at each end.
- Compositor loops (transform and opacity on their own layer) keep running while the main thread builds the floor, so a loader never freezes at the moment it matters.

#### Known gaps

- Tailwind's `animate-ping` (the hero's live dot) runs a 1s period, under the 1.5s floor. Neither it nor `animate-pulse` (the player card dot and the terminal cursor) has a reduced-motion guard yet, one of the gaps in Reduced motion ([4.6](#46-reduced-motion)). The system StatusDot adds `motion-reduce:animate-none` to both.
- `animate-spin` on the wave button and the terminal steps is a busy state, not ambience, so it keeps turning, and the system Spinner slows rather than stops.

#### How to add a loop safely

Write it as a CSS keyframe on transform or opacity, check it against the two limits, add the reduced-motion rule beside it, and pause it out of view if it costs anything. Then add its row to the loop table.

### 4.5 Choreography

#### Values

The staged sequences below each run on their own clock.

- **Container hero** (from the floor's `onReady`): the floor logo leaves over 0.45s, the tiles hold 0.5s and rise over 0.9s, the numbers rise at 1.2s, the scroll cue and wave button fade in at 1.8s. The copy is not on this clock: it fades in CSS from first paint (`.hero-copy-in`, 0.6s).
- **Full view** (from `onReady`, or after 12s if it never comes): the loader leaves and the `heroloaded` window event fires at 0, the copy fades in at 0.35s, the floor at 1.7s, the tiles start rising at 1.85s, the extras at 3.45s. All fades are 700ms.
- **Scroll line track** (in screens of scroll, from the moment the 390vh track reaches the top of the view): the words fill over the first 1.31 screens (0.82 of their scroll), the line holds to 1.6, the accent water rises over the last 1.3 screens to 2.9, the players snap in place there, and the water drains over one screen past them.
- **Players** (from the reveal: the water filled and 20% of the section in view): the cards rise 0.05s apart, then the portrait, the switch and the column. The hand draws from 1s, the portrait first turns AI at 5s and every 5s after, and the AI copy starts 0.6s after each switch. The CSS snap catches a scroll that ends near the players, and in desktop Safari a scroll that rests within 0.3 of a screen of them glides in over 0.6s, on no clock but the scroll's.
- **Terminal run** (from `play`): each step dwells by its kind, from 34ms a typed character to 1300ms for a load, with every dwell listed in Terminal ([7.19](#719-terminal)).

The in-page glide is a shell behaviour, specified in Shell behaviours ([6.7](#67-shell-behaviours)).

#### Triggers

The hero sequences start from TileFloor's `onReady`. The full view's `heroloaded` event releases the clear header, and the water's `accentwave` event, set in Accent water ([5.9](#59-accent-water)), releases the players reveal. Both belong to the shell's window contract in Shell behaviours ([6.7](#67-shell-behaviours)). A terminal plays when the visitor points at it with a mouse, or when 60% of it is in view on a touch screen.

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

The terminal shows its finished run and the scroll line shows the filled line. The hero intros, the glide and the players' auto switch and desktop Safari's magnet do not change yet, gaps tracked in Reduced motion ([4.6](#46-reduced-motion)). The water needs no change, since its level is the scroll.

### 4.6 Reduced motion

#### The rule

When a visitor sets `prefers-reduced-motion: reduce`, keep every state change, drop the travel, stop the loops and keep a busy spinner turning, slower.

- **Keep state changes.** A menu still opens, a choice still shows as chosen, a count still updates. These carry information, so they happen at once or as a short fade.
- **Drop travel.** Rises, drops, sweeps and pans go. An entrance becomes an opacity change or nothing, and the part shows at its end state.
- **Stop loops.** Bobs, turns, flips, shimmers and pings stop at their rest frame. Nothing ambient moves.
- **Keep the spinner.** A busy state still has to say busy, so the system Spinner turns at 1.5s a turn instead of 1s. Stopping it would look like a fault.

#### Where it is handled today

Every CSS loop in `globals.css` has a reduce rule. TypedWord shows the word whole, the hero copy shows at once, ScrubLine shows its line filled, the liquid is off, the doodles land without drawing, the portrait settles without its sweep and looks straight ahead on touch, the floating tiles neither drift nor flip, the terminal shows its finished run, the primary CTA keeps its grow and fill but drops the band, and the ASCII field holds still and swaps instead of scanning. The guide's table gives the line for each.

#### Gaps

These have no reduced answer yet. Known gaps ([10.2](#102-known-gaps)) tracks them.

- The tile floor (intro rise, autoplay, waves and sweeps) runs as usual.
- The in-page glide runs as usual. Under reduced motion it should jump.
- The players' auto switch keeps cutting every 5s. Under reduced motion it should hold the copy on screen and leave the switch to the visitor.
- In desktop Safari the players' magnet glides 0.6s on Lenis. Under reduced motion it should settle at once. Every other browser has only the CSS snap, with no glide of the page's own.
- Tailwind's `animate-ping` and `animate-pulse` on the hero dot, the player card dot and the terminal cursor keep running.
- motion/react entrances and menus travel as usual, because the site wraps no `MotionConfig` round them.

#### How to build for it

In motion/react, read `useReducedMotion()` and swap travel for opacity, or wrap a tree in `MotionConfig reducedMotion="user"`. In CSS, put a `prefers-reduced-motion: reduce` rule beside every keyframe. On a Tailwind loop, add `motion-reduce:animate-none` (or a slower spin for a spinner). In canvas or WebGL code, read `matchMedia("(prefers-reduced-motion: reduce)")` once, draw the end frame and skip the loop.

#### Reasons

Large or continuous motion makes some visitors dizzy or sick, and others simply cannot read while something moves. The setting is the visitor asking for less. Keeping state changes matters as much as dropping motion: a reduced page that stops telling the visitor what happened is broken in a different way.

#### Testing

Turn on Reduce motion in the operating system's accessibility settings, or emulate `prefers-reduced-motion` in the browser's rendering tools, and reload. The guide's readout says which reading is on, and every CSS loop specimen in the guide uses the site's real class, so it stops too.

## 5 Signature effects

The set pieces that make the page 6labs: the tile floor and its states, the holograms, the glyph field, the scroll line, the accent water and the families of halftone, fringe and grain. Each chapter says what the effect is, how it is drawn and how to change it safely. Layer stack ([5.1](#51-layer-stack)) opens the group because every effect sits on one of its planes, and the Compositor-safe rule ([5.13](#513-compositor-safe-rule)) closes it because every effect keeps it.

### 5.1 Layer stack

**What it is.** The page is one root stacking context with seven planes. From the bottom: the ground (the body's `#f9fafb`), the glyph field (fixed, z -10, its canvas at 40%), flow content (z auto: the hero, the scroll line's sticky stage, then the `.page-grain` block), the accent water (fixed, z 20), Players (relative, z 30), the header and BackToTop (fixed, z 40) and the `?perf` readout (z 2147483647, only when asked for).

**Why this order.** A z on the root is kept for the planes that must cross flow content: the water rises over the scroll line, Players stands on the water and the fixed chrome stays over both. Everything else stacks by DOM order, so a new section never has to know the page's numbers. The glyph field sits under everything so it shows only where a plane above leaves the ground open, which is the scroll line's transparent stage. The water is fixed above flow content so it can rise over the scroll line and drain away before the light sections, which never have to cover it themselves. Players at 30 stands on the full water. The fixed chrome at 40 stays readable over every effect, which is why the header turns solid white while the water fills the view. `.page-grain` brings its own ground, so from Understands to the footer the glyph field is covered without a z.

**Values.** The z-scale is the `--ds-z-*` family in Z-scale ([3.25](#325-z-scale)), generated from the tokens, so its steps are written once. Inside parts the site also sets three small local values: the footer band's word at z 1 and its spec labels at z 2 (CopyLine.tsx:126 and :90), held inside the band, whose container query makes it a stacking context of its own, and the job card sheen's light at z 3 (globals.css:250), which only has to clear the card's own content and sits far under the water's 20.

**Use for.** A popover sits at 45 because menus hang from the header and must open over it. Toasts at 60 sit over the header and any open menu, so an outcome is never hidden behind the chrome. Tooltips at 70 top every z value, because a tooltip labels whatever is under the pointer, a toast's action included. A modal leaves the z-scale altogether: Dialog opens with `showModal`, which puts the dialog and its veil in the browser's top layer, above every z value. So a toast fired while a dialog is open sits under it, a dialog's outcome is toasted once the dialog has closed, and a tooltip inside a dialog portals into the dialog, as Dialog and sheet ([7.25](#725-dialog-and-sheet)) sets out. The 50 step is for a non-modal panel that must clear the popovers. A modal dialog never takes it, because it lives in the top layer.

**Never for.** Never give a new layer z 20 or 30. The water and the hero copy share 20, and Players and the hero loader share 30. Never set a z on a child of a section that is not isolated, because the value leaks into the root context and competes with the page's effects.

**The two collisions.** The hero section is not isolated, so its floor (0), floor logo (10), copy and controls (20) and loader (30) all join the root context. Its copy ties with the water at 20, and the hero comes later in the DOM, so it would paint over the water if the two ever met. They do not meet today only because the water rises after the hero has scrolled away. The second collision is the header and BackToTop at 40. BackToTop comes later in the DOM and wins, which is harmless while they sit in opposite corners.

**Reasons for the fix.** `isolate` on the hero section keeps its four inner values inside it, so the water and Players can never be crossed by the hero's own layers, and the hero can add a layer without reading the whole page. It costs nothing at paint time.

**How to change it safely.** Add `isolate` to a section before giving its children a z. Give a new fixed layer a step from the scale, and check it at three scroll points: the top, the players section with the water full, and the drain back to the light page. A fixed layer over the water needs its own ground, as the header and BackToTop carry theirs.

### 5.2 The glass tile floor

**What it is.** The hero's signature: a deterministic three.js render of an endless field of identical frosted glass tiles on a pale grey floor, each carrying a player's bust that turns into their hologram. `TileFloor` (`src/components/tiles/TileFloor.tsx`) mounts the engine (`src/tiles/floor.js`) into its own div on the client and tears it down on unmount. It fills whatever box it is given.

**Parameters.** Every look value lives in `public/tiles/floor-params.json`, which the engine fetches at load and the browser revalidates on every visit (`next.config.ts`), so a new value shows on the next load instead of waiting out a cache. The camera is a long lens (fov 14) at elevation 40 and azimuth 48, distance 13.3 times `distScale`. A narrow field of view keeps the tiles nearly one size from front to back, so the grid reads as a calm pattern rather than a road running away. The grid is one square grid of tile 1.0 and gap 0.018, built on the half-plane `i >= 0`, so the field has a single inner edge: one straight diagonal through the bottom of the screen with empty floor beyond it.

**Material families.** Resting tiles are frosted white glass (`#f4f5f7`, roughness 0.3), each wall shaded up to 12% darker toward its foot (`footShade`) and each top's rear corner 8% darker (`frostCorner`), so a tile reads lit from above rather than flat. Live, they are drawn opaque and colour-matched to the floor rather than with real transmission, because anything see-through makes three.js render the scene once more each frame, a full-resolution 4x multisampled image. Stills use real transmission with TAA, and the two were matched by eye (`opaque-glass.js`). The raised tile is a separate slab per state, as Tile states ([5.3](#53-tile-states)) describes. Light comes from a studio environment of soft panels, whose two low strips draw the crisp white rim lines, plus a hemisphere and one key light.

**Output.** An 8-bit sRGB target with 4x MSAA at full device pixel ratio, Neutral tone mapping written into every material, and one final pass that encodes, adds static film grain 0.025 and runs the intro crossfade.

**Motion.** The floor draws only while something moves. Autoplay and the reset wave draw their own frames. It holds when the box leaves the screen or the tab hides. `keepGpuAwake` clears a 1 × 1 target every 500ms while the page is visible, so a dual-GPU Mac never powers its discrete GPU down between frames.

**Responsive.** The design frame is 1920 × 1080. A wider box keeps the camera and shows more floor at the sides. A taller box pulls the camera back along its line of sight, at most 2.4 times. The grid and casts are built for aspects 0.45 to 2.6, and outside that band the field's built edge can come into view. Under 768 wide the pictures are the 512px copies. The full view pulls the camera back 1.5 times from 1024 wide for smaller, more tiles, and the hero lowers the view with `setClearTop` so the highest tile sits under the copy.

**Performance rules.**
- Mount at most one floor in a document. The engine swaps a global three.js shader chunk for its own tone curve (`lean.js:62`), so two floors fight over it, and disposing either breaks the other's later recompiles. A second floor goes in its own iframe.
- Never mount a static floor beside a live one, for the same reason.
- Budget one WebGL context, about 74 picture downloads per cast and GPU memory in the hundreds of MB. Mount it where it is seen and release it when it is far away. The guide does this through HeavySlot's single floor slot.
- No CSS blur, blend, mask or filter over the canvas, under the compositor-safe rule ([5.13](#513-compositor-safe-rule)).

**Props.** `className`, `onReady(handle)` (fires before the intro, the handle has `reset()`, `setClearTop(px)` and `dispose()`), `onConvert()` (once per character converted), `introDelay` (0), `distScale` (1), `mixWaves` (false), `aiBase` (`/tiles-holo`), `spentTint` (`#e3f3ff`). Every prop is read once at mount.

**The wave button.** `WaveButton` calls the handle's `reset()`. Two forms. `full` is a 40 tall white pill at 90% with a hairline, for over the floor and in the full view, because the moving tiles behind a bare icon leave it nowhere to be found. Bare is the icon alone in slate-400, for the page row under the container hero, where the ground is calm. Rest shows the icon only. Hover turns it accent over 200ms and widens the label "Next wave" in. Busy swaps the icon for a 16px spinning ring, with `aria-busy`, until the wave's flip begins, which can wait for the next cast to load. The label stays in the accessibility tree at rest, so the button is named.

**Accessibility.** The wave button has no focus ring of its own, so a keyboard visitor sees only the browser's outline. It needs the system ring. The floor itself has no keyboard path, as Tile states ([5.3](#53-tile-states)) sets out.

**Gaps.** No reduced-motion mode anywhere in `src/tiles`: the intro, autoplay and waves always run. No `webglcontextlost` handling, so a lost context leaves a dead canvas. The handle cannot focus, activate, pause autoplay or read state. `floorRough` is read but missing from the params file, so three warns and keeps roughness 1.0. `Hero.tsx:32` describes `mixWaves`, which the hero never passes. The engine listens for R on `window`, so a keystroke in any field on the page resets every character unless the field stops its keydown.

**Do / Don't.**
- Do give the floor a sized box with the container grey behind it, the colour that shows while it boots.
- Do use the pill form of the wave button over the floor.
- Don't mount a second floor in the same document.
- Don't put a CSS effect over the canvas to soften a control. Give the control a solid fill.

**How to change it safely.** Edit `floor-params.json`, then run `tools/tiles/bake-textures.mjs` so the baked textures match. Check the live floor at a wide, a 16:9 and a phone-shaped box, and a static render. Keep any new box between aspects 0.45 and 2.6.

### 5.3 Tile states

**What it is.** Every tile on the floor is in one of five states: default, focused, activated, spent or resetting. The pointer drives default, focused and activated. The floor's own clock moves an activated tile to spent, and autoplay's wave, `reset()` or the R key bring tiles back. The logic is `src/tiles/interact.js`, the looks are `focus-rig.js`, `materials.js`, `textures.js` and `opaque-glass.js`.

**A naming trap.** In `floor-params.json` the focused look is `states.default` and the activated look is `states.shine`. "default" there is the default raised look, not the resting tile.

**Each look in parameters.**
- **Default.** The resting frosted tile: top `#f4f5f7`, opaque and colour-matched on the live floor. Two faint ghost bands (darkness 0.04, width 0.025) inside the upper edges stand for the far bottom edges seen through the glass. White rim lines at 0.55 on the sides and a trace of 0.15 top and bottom. Each wall is up to 12% darker at its foot, fading to none 0.07 up, about 70% of the way up the wall (`footShade`, `footBand`), so it runs light at the top. The top's rear corner is 8% darker in a soft falloff about 0.3 of the tile wide (`frostCorner`, `frostCornerR`), baked into the frost.
- **Focused.** The glass tile and a cobalt slab rise together by 0.07 while the slab fades in over it, and the glass hides once covered. Slab top `#244a92` to `#2d5db4` over a `#050d22` body, a navy pool at the rear corner, a sheen, a reflection band and a soft head glow. Metallic walls (0.6) mirror the floor. On both slabs the wall's dark foot holds over its lower 30% before it ramps to the light (`actFootHold`), and a foot shade darkens that stretch, fading out toward the top, at 0.25 here and 0.12 activated (`actWallShade`). A contact shadow (0.42) darkens the neighbours' tops. No floor glow.
- **Activated.** A brighter slab, top `#2f78e0` to `#3f8eec` with a `#6fb4ff` rim. Deep navy walls `#0d2a66` that glow from `#4a92f0` at the foot to `#2f77e2` at the top, held at the foot's colour over the lower 30% and shaded 0.12 there, no mirror. A blue pool spreads on the floor (`#2a8ff2`), a halo `#3c82ff` and a pale spill `#7fb2f2` light the neighbours, and the contact shadow lifts to 0.1. The bust becomes its hologram.
- **Spent.** The tile sinks back already carrying its tint, keeps its hologram and ignores the pointer. The walls' glow takes the tint in full and the rim line half of it.
- **Resetting.** The wave flips the tile in place, about the axis through its centre parallel to its top-right edge, with no lift, so the lower half passes into the floor. Edge-on it swaps to the other cast's human and lands as a default tile.

**Transitions and timings.** Every stage runs `animSpeed` 1.69 times faster than its written time, so the floor's whole tempo has one knob. Rise and sink ease exponentially toward their target with `riseTau` 0.12 (0.071s on the wall clock), which lets any change interrupt any other without a jump. The activation's fade-in is 0.08 (0.047s). The activation runs `ACT_SECONDS` 0.9 (0.53s). Deactivation fades everything together over `DEACT_SECONDS` 1.05 (0.62s), for the reason in Activation sweep ([5.4](#54-activation-sweep)). Two focus rigs let one tile settle while the next rises, and with both locked by clicks a new hover is ignored.

**Reasons.**
- A click locks the tile because a half-converted bust snapping back to human reads as a glitch, never as a choice.
- Spent tiles ignore the pointer so a played character cannot be replayed until the wave brings a new one. Each tile is one visitor's turn.
- The spent tint is TileFloor's `#e3f3ff`, a light wash of the holograms' sky blue, because the params file's container grey would leave a played tile indistinguishable from a fresh one. Which of the tint's three values wins, and how to change it, is in Special palettes ([2.2](#22-special-palettes)).
- The wave flips rather than fades, so a change of cast reads as the floor turning over its cards, one by one, in reading order.

**The commit rule.** `COMMIT_SECONDS` 0.25 says an activation left by the pointer after that point finishes before it fades, and one left earlier reverts. Every click locks today, which skips the rule, so it never fires. Keep it if an unlocked activation (a hover that activates) is ever added, and remove it otherwise.

**Accessibility.** The tiles are pointer only: no focus, no keyboard activation and no announcement. The cursor turns to a pointer over live tiles only. A keyboard path would need a focusable stand-in per on-screen tile and an announcement when a character converts.

**Gaps.** No API pins a state, so the guide cannot show a forced focused or activated tile. Activated stills cannot be rendered offline, for the reason under Characters and holograms ([5.5](#55-characters-and-holograms)). The comment at `interact.js:6` still calls the spent tint "a slight charcoal tint", and it is blue today.

**Do / Don't.**
- Do pass `spentTint` from TileFloor, so the played state stays visible.
- Do keep focused and activated as two slabs with one set of keys, so a rig can crossfade them.
- Don't let a spent tile answer hover.
- Don't add a state that only the pointer can reach without a keyboard twin.

**How to change it safely.** Edit `states.default` or `states.shine` in the params file, keeping the two blocks' keys the same. The shading keys sit outside both blocks, at the top level, so they apply to every look: `footShade` and `footBand` (the resting walls), `actFootHold` (both slabs' walls) and `frostCorner` and `frostCornerR` (the resting tops). `actWallShade` is per state. `frostCorner` and `frostCornerR` are baked into the frost, so a change to either needs the bake. Run `tools/tiles/bake-textures.mjs`, then hover and click a tile on the live floor and watch a full turn of autoplay, the only places the states are drawn.

### 5.4 Activation sweep

**What it is.** The step from focused to activated: a light beam runs round the slab's top rim from the corner nearest the camera, the brighter activated slab sweeps in behind it from front to back, the shadows and floor turn blue, and the human crossfades to the hologram. It was matched frame by frame to a 30 fps reference recording (`src/tiles/sweep.js`), which is why its times are oddly exact.

**The rim coordinate.** `u = (x + z) / tile` runs along the rim: +0.92 at the front (camera) corner, 0 at both side corners, -0.92 at the rear. Every part of the sweep is a function of where its head is on `u`, so the beam, the bright slab and the spill share one geometry.

**Parameters.** All times are sweep time S. Wall-clock time is S / 1.69.

| From S | To S | What happens |
| --- | --- | --- |
| 0 | 0.08 | the activated slab fades in over the focused one |
| 0 | | the beam appears at the front corner, with a white-hot spot `#d9efff` x2.2 |
| 0.17 | | the beam reaches the middle of both front edges |
| 0.30 | 0.80 | the beam reaches both side corners, then runs faint along the back edges (0.55) |
| 0.30 | 0.45 | the right corner flares, `#d9efff` x3.4 |
| 0.10 | 0.90 | the bright head sweeps front to back (soft edge 0.55), and `amount` turns the shadows, floor glow and point light blue |
| 0 | 0.75 | the blue spill and halo spread out from under the front corner |
| 0.25 | 0.85 | the human crossfades to the hologram |
| 0.90 | | `ACT_SECONDS` reached, the tile is spent |

The beam colour is `#8cc8ff` at 2.4. The beam head follows `0.95 - (S / 0.3) * 0.95` to the side corners, then `-((S - 0.3) / 0.5) * 1.1` along the back.

**The glint.** A painted highlight near the rear corner, shaped like a loaf: top arch 0.6 (exponent 0.55), bottom bulge 0.52 (exponent 0.3), droop 0.1, turned 45 degrees, about 12% of the tile across, blurred 20 texture px. Focused, it is a cool grey `#dcdde2` with a pale edge and a dark navy ring `#0e2152`, plus faint warm specks. Activated, it is near white `#eef3fa` with a white edge, a blue ring `#123a86` and a cyan halo `#96d4ff`, and a chromatic split fringes its right end red and its left end blue. As it activates it widens 22% along its length. Two glint meshes, one per state, crossfade by `amount`.

**Motion.** Starting the light at the camera corner puts the brightest moment nearest the eye, then carries it away into the floor. Deactivation is not a reverse sweep: everything fades together over `DEACT_SECONDS` 1.05, so the end of a turn is quieter than its start and never reads as a second activation. `COMMIT_SECONDS` 0.25 is the point where conversion has started, under the commit rule in Tile states ([5.3](#53-tile-states)).

**Performance rules.** The frost, the raised slab's gradient and the glint are procedural textures, baked ahead of time into `public/tiles/baked/` by `tools/tiles/bake-textures.mjs`. Each baked picture records every setting it read, and is used only while they all still match. The frost's settings include the rear corner's shade (`frostCorner`, `frostCornerR`), so a change to either is one the bake must follow. After any params edit that touches them, the page paints them again at load on its main thread, about 1.4s of the first load on a 2019 MacBook Pro, until the bake is run again. The animation itself (beam, sweep, glint move, spill) is drawn by the shaders over the baked pictures, so it costs no texture work per frame.

**How to change it safely.** Change a time in `sweepValues` only against the reference recording, and change the tempo through `animSpeed`, never by scaling one lane. Keep the beam, the bright head and the spill on the same `u`, or the light separates from the slab it lights. Re-bake after any glint or gradient edit, then click a tile on the live floor at full speed.

### 5.5 Characters and holograms

**The rule.** Every AI copy on the site is a faceless blue scan-line hologram of its human, and never another rendering: not a tint, not a filter, not a second illustration style. One look means the visitor learns it once, on the hero's tiles, and recognises the model everywhere after.

**Where it appears.** Three places. The tiles: each activated bust crossfades from `/tiles/chars/<name>.webp` to `/tiles-holo/chars-ai/<name>.webp`. The players: the Human / AI switch plays `/players-holo/<id>-ai.webm` (with a stacked MP4 and a still for browsers without WebM alpha). The footer: the copy line's picture, `/footer/copy-line-holo.webp`.

**Casts.** The floor has two casts, `chars` and `chars2`, 37 names each, in `floor-params.json`. Paths are derived: the hologram of `chars/<name>` is always `chars-ai/<name>`. 37 is enough to fill the view with no face twice. Each reset wave swaps every tile to the other cast. Tiles are cast most visible first, and each takes the least recently used name that no tile within two cells shows, so neighbours never repeat. Every picture has a 768px copy and a 512px copy for phones, all alpha WebP.

**Decal geometry.** The bust is a plane laid flat on the tile's top, turned 45 degrees so the head points to the rear corner and the chest to the camera corner. It is 0.92 of the tile, stretched 1.35 along the diagonal to undo the foreshortening of the camera's 40 degree tilt, and pushed 0.08 toward the camera corner along the same diagonal. It floats 0.002 above the top and rides the tile as it rises. It is clipped to the tile's rounded outline, inset 0.01 with a 0.015 soft edge, so a bust never spills over the glass edge. The material is unlit and not tone-mapped, so the picture keeps its own colours, with a -8 polygon offset so it never fights the glass, and a -0.75 mip bias for a sharper pick at the long lens.

**States of a bust.** Blank until its picture is on the GPU. Human. Crossfading, both drawn, the hologram's opacity following the sweep's convert value. AI, once converted. AI pending: the hologram has not landed, so the tile stays human and autoplay picks another. AI failed: it plays as human. The crossfade is a plain opacity fade across the whole bust, not a wipe, despite its uniform's name (`uScan`).

**Loading plan.** The first frame depends on the on-screen humans alone, most central first. Then come the humans off screen (there for a resize), then the hologram autoplay converts first, then the other holograms in the same central-first order. Pictures decode off the main thread and go up to the GPU one per idle moment, because a burst of uploads made a visible jerk in the first activation. Only the cast on screen stays on the GPU. The other is fetched when a wave is near and let go after it, which saves about 230 MB that stalled an Intel MacBook Pro after the first wave.

**Performance rules.** Never hold both casts on the GPU. Never decode a picture on the main thread. Never make the floor wait for a hologram before its first frame.

**Gaps.** The comment at `characters.js:5` still calls the AI copy charcoal. `tools/tiles/render.cjs` (lines 13 to 14) does not serve `/tiles-holo/`, so a static render that waits for the holograms fails.

**How to change it safely.**
- *Decal geometry.* The stretch (`charStretch` 1.35) and the push toward the camera (`charForward` 0.08) are tied to the camera's elevation (`elev` 40) and its field of view (`fov` 14), all in `floor-params.json`. Change one and retune the other two with it, or every bust lands squashed or off its tile. The size, inset and soft edge (`charSize`, `charInset`, `charEdgeSoft`) keep a bust inside the glass, so a larger bust needs a matching inset.
- *Casts.* Keep both casts the same size and no smaller than the number of tiles on screen at the widest view, today 37, so a wave never shows a face twice and the swap between casts stays even.
- *The crossfade.* `uScan` is a plain opacity crossfade driven by the sweep's convert value, whatever its name suggests, so a change to it is a change to how every tile converts.
- *Check it.* A static render of the floor (`tools/tiles/render.cjs`) for the decals' placement, then a full live wave on the page, since only a live wave shows the casts swap and the crossfade run.

**How to add a character.** Put the human at `public/tiles/chars/<name>.webp` and its hologram, with the same name and framing, at `public/tiles-holo/chars-ai/<name>.webp`, plus both 512px copies. Add the name to one cast in `floor-params.json` and keep each cast at 37. Make the hologram from the human with the same scan-line treatment as the others, never by tinting the human picture.

### 5.6 Load-in, autoplay and loaders

**What it is.** How the floor arrives, plays itself and resets, and what the hero shows until it is ready. The intro is `src/tiles/intro.js`, autoplay and the wave `src/tiles/autoplay.js`, the loaders `HeroLoader` (full view) and `FloorLogo` (container hero, in `HeroBits.tsx`).

**Intro.** Nothing is drawn until the params, the on-screen humans, the baked textures and the shader warm-up are all in, so the container's own grey shows. Then the engine captures one frame of the bare floor, holds it for `introDelay` (0.5s in the container hero, 1.85s in the full view), and raises the field from -0.102 to 0 over 0.9s on an ease-out cubic while the final pass crossfades from the capture to the live scene. The crossfade runs in screen space from that captured frame, which is what keeps the ground still. During the hold one frame is drawn and then none, because drawing the floor every frame there stuttered the full view's typed title on a phone. A resize or dispose mid-intro snaps the field into place. The delay exists so the loader can leave first.

**Autoplay.** Once the tiles are in, the floor plays itself. It picks the unspent tile nearest the middle of the screen, among those with at least 40% of their top in view, so play starts in the middle and works outwards to the edges. It hovers it for 380ms, clicks it, waits until both rigs are idle and then 220ms more. A turn takes a little over two seconds, long enough to follow one character's change before the next begins. A tile whose hologram has not arrived is passed over and picked again later. The visitor always wins: a pointer on a live tile pauses autoplay, a clicked tile still finishes, and autoplay resumes half a second after the pointer leaves the tiles. Off screen or in a hidden tab nothing plays and nothing is drawn.

**Reset wave.** When every tile on screen is spent, or `reset()` is called, a wave runs left to right. Once 70% of the tiles on screen have played, the other cast starts loading so it is in by the wave. Each tile flips in place over 0.75s on an in-out cubic, staggered over 1.3s by its position, and edge-on at 90 degrees it swaps to the other cast's human and lands as a default tile. Tiles are inert during the wave. `reset()` resolves as the flip begins, which may wait for the next cast to load, and the wave button shows busy for exactly that wait.

**Full-view loader.** `HeroLoader` is in the server HTML from the first paint, with no fade in, so the full view is never an empty grey screen. It is the 6labs mark at 64 × 64, its core in the mark's own navy `#030D2D` and its three arcs in the mark's own blue `#1770EF` (the brand-mark tokens `--ds-color-logo-navy` and `--ds-color-logo-blue`, not the site's ink and accent). Each arc hops a few pixels out from the core and back in the first third of a 1.5s loop, in clockwise order with delays a third apart, so one is always moving and the first hop is already under way at the first frame. Each arc is its own transformed layer, so the compositor runs the loop smoothly while the main thread builds the floor. "Loading" sits under it in 11px caps at 0.18em, in slate-500. It fades out over 0.45s on the one ease. A floor that never comes (no WebGL) gives up after 12s, so the page is never held behind the loader.

**Container loader.** `FloorLogo` lays a pre-rendered still of the mark in the tiles' white glass on the floor, toward the bottom right where the tiles will rise, at 60% opacity. A CSS tilt (`perspective(2400px) rotateX(50deg)`) lays it back at the tiles' camera angle, and it turns about the floor's vertical axis once every 90s. It fades in over 0.4s and out with a slight shrink over 0.45s, just before the tiles rise. One still of 16 KB and a compositor spin cost almost nothing to load and run.

**Performance rules.** Loaders animate transform and opacity only. The floor holds during the intro delay. The container loader's feathered edge is a CSS `mask-image`, one of the effects the compositor rule forbids, and it is on screen while the container hero loads. It is a known exception, listed in Known gaps ([10.2](#102-known-gaps)), and the fix is to bake the feather into the still's alpha.

**Accessibility.** `HeroLoader` is `role="status"`, so its word reaches a screen reader. Its label is slate-500, about 3.8:1 on the hero grey, under the 4.5:1 a status word needs. The body slate `#475569`, at 6.0:1, is the fix. `FloorLogo` is decorative (`alt=""`). Under reduced motion both loaders hold still (the floor logo keeps its tilt), but the intro, autoplay and waves still run, because `src/tiles` has no reduced-motion mode.

**Do / Don't.**
- Do put a loader on the hero's grey, the ground the floor lands on.
- Do leave the loader before the tiles rise, which is what `introDelay` is for.
- Don't fade the full-view loader in. It is there from the first paint.
- Don't add a mask, blur or filter to a loader. Bake the look into its picture.

**How to change it safely.** Change `introDelay` together with the loader's exit (0.45s) and the hero's own entrance times in `hero-intro.ts`, which are timed from the floor's ready. Change autoplay's constants together, then watch at least one full cycle and one wave on the live floor. Keep the give-up timeout, whatever else changes.

### 5.7 Glyph field

**What it is.** One 2D canvas of monospace glyphs on a 15px grid, ported from the onBlue creators page (`ascii-field.js`). At rest only about one cell in twenty draws, faint and in navy, so the field reads as texture and never as text. Under the pointer a pool brightens the cells, rolls their glyphs and warms their ink toward the accent, with a thin red and cyan fringe at its rim. Two hosts run it: the page backdrop (`AsciiBackdrop`, fixed behind every section at z -10) and each idle jobs terminal (`JobTerminal`).

**Why it is drawn this way.** A canvas cannot blend with the page, so the field is told its two inks (`--ascii-a` at rest, `--ascii-b` in the pool) and mixes between them by the pool's strength. It reads them off its host, not the root, so a host with its own palette (the dark terminal) gets glyphs in its own colours from the same code. Each glyph is stamped from an atlas drawn once per colour, because a `fillText` per glyph per frame was where Safari spent its time.

**Parameters.**

| Parameter | Page | Terminal | Default in `ascii-field.js` |
| --- | --- | --- | --- |
| `reach` | 120 | 420 | 190 |
| `lens` | 0.24 | 0.5 | 0.42 |
| `pointer` | hover devices only | false | true |
| `pool` | none | held at 0.5, 0.6 | none |
| `--ascii-a` | 10, 27, 51 | 148, 163, 184 | |
| `--ascii-b` | 26, 109, 255 | 110, 168, 255 | |
| `--ascii` (canvas opacity) | 0.4 | 0.5 | 0.4 |

Cell 15, glyphs 11px ui-monospace on the ramp `' .,:;i1tfLCG08@'`, ambient 0.075 on cells whose seed passes 0.948, fringe on. The page runs a smaller, softer pool than onBlue's defaults, so it stays a texture under the content rather than a spotlight on it. The terminal holds a wide pool in place with no pointer, which makes a waiting window a bed of glyphs brightest at its middle.

**Motion.** At rest the sparse cells breathe on a sine of about 5.7s and each glyph walks the ramp about every 8.3s. The canvas repaints at most every 68ms (about 14.7 fps), the pace a glyph readout needs and a quarter of a display's frames. The throttle lifts only while a sweep band runs, and the site never calls the sweep. Under reduced motion the breath and the roll stop and the pool still answers the pointer, because a pool that follows the cursor is a response to the visitor rather than an animation.

**When it hides.** Off screen an IntersectionObserver parks its loop. AsciiBackdrop also hides it past the foot of `#model-line`, where the water and then the grained block cover the ground, and while a `[data-covers-view]` part (the full-view hero) fills the screen. It hides by visibility, so the canvas keeps its size and its seed, and scrolling back into the line does not rebuild a viewport-sized canvas mid-scroll. Touch screens get the ambient field without the pool. `?off=ascii` removes it.

**Performance rules.** One canvas per host, its pixel ratio capped at 2. A covered field still costs a repaint every 68ms, so hide it with visibility wherever something covers it and call `wake()` when it is back. Never tint the canvas with a CSS blend or filter: change `--ascii-a` and `--ascii-b` on the host.

**How to change it safely.** There is no teardown. Its ResizeObserver, IntersectionObserver and pointer listeners outlive the host, so mount it once per host and guard on `host.firstChild`, as AsciiBackdrop and JobTerminal do, or React's second effect run in development puts a second canvas in. A new host needs a position and a height. Change the page's numbers in AsciiBackdrop's call, not in `ascii-field.js`, whose defaults are onBlue's and still give the terminal its cell and ambient. Only the fringe colours are tokens today (`color-fringe-red-ascii`, `color-fringe-cyan-ascii`). Cell, reach, lens and ambient are numbers in code.

### 5.8 Scroll line, liquid and floating tiles

**What it is.** Section two is one sentence played out on scroll: "A model is built from what the person does, not what they say. Put a million models on a new build and you know how it will land before anyone plays it." Its track (`section#model-line`) is 390vh tall and its stage sticks to the view, so the reader scrolls through the sentence while each of its 32 words fills from faint ink to full, and "a million models" fills to the accent. On desktops the words show through a liquid the cursor stirs. Six of the floor's glass tiles float round it. For its last 1.3 screens the stage stays pinned while the accent water rises over it.

**The fill rule.** The track's progress `p` runs over its height less 2.3 screens (one for the stage, 1.3 for the water). Words lit = floor(min(1, p / 0.82) x 32). The fill completes at 82% of the scroll (`COMPLETE_AT`), so the finished line holds for a beat before the water comes. Going back up it empties three times as fast (`BACK`), and refilling runs at that pace until it has caught the scroll, so the line gets out of the way of a reader heading back to the hero. The track's `aria-label` carries the whole sentence and the spans are `aria-hidden`, so assistive tech reads it once, whole.

**Liquid.** LiquidLine draws the sentence into a picture exactly where and how the page lays it out (each word at its own rect, in the line's font, size and tracking), and a canvas 56px larger on every side shows that picture through a small fluid simulation, after Canvas UI's Liquid Object. The cursor drags the words, splits their colours in a lens and lights them where the flow runs, and a click splashes. Every setting is 30% of the demo's (`HOVER` 0.3) and there is no idle drift, so the words hold still until the cursor comes. Once live, the real words turn transparent but stay in place, for layout, selection and reading. It runs only where min-width 1024, hover, a fine pointer and motion allowed all hold, and it needs WebGL2. A still flow draws no frame at all.

**Floating tiles.** Each tile is one of the hero floor's own glass tiles, pre-rendered at its own angle with a character (`tools/tiles/tile-boot.js`), so the floor's material carries on round the line without another WebGL context. Six tiles at 198 to 255px, each with its own depth (0.6 to 1.6), tilt (-6 to 6 degrees) and bob delay. They parallax with the cursor through a soft spring (60 / 18, 22px times depth at the screen's edge), bob 7px over 5.5s, and every 3.5 to 6.5s one tile, never the same one twice running, flips to the next character of its cast. The casts leave out the four players, whose faces belong to the next section. Flips, and the download of the rest of each cast, run only within half a screen of the view.

**Responsive.** From 1600: two columns of three beside the line, at full size. From 768 to 1599: three above the line and three below, at 0.65x up to xl and 0.8x up to 1600. Phones: two rows offset from the line's own height (`--line-h`, set on the stage by a ResizeObserver), at half size, so the rows stay clear however many lines the sentence wraps to. The line is 26px, 44px from md. The liquid is off below 1024.

**Motion and reduced motion.** The words change colour over 200ms and the liquid's picture follows at 0.2s a word, so the two never disagree. Reduced motion shows the line filled, leaves the liquid off and stops the tiles' parallax, bob and flips.

**Performance rules.** The liquid holds one WebGL2 context and stops its loop off screen. Its `destroy()` disposes everything but does not force the context's loss, so a remount piles contexts up until garbage collection: mount it once. Tiles use srcset (384, 512 and 768) with a size per breakpoint, because a 768px picture shrunk to a phone tile went soft and shimmered at its edges. Once the track has run out the stage is hidden by visibility: the water covers it, and the light page rising back past the players would otherwise flash its last screen. `?off=liquid` and `?off=tiles` switch each off for a visit.

**How to change it safely.** The sentence is one constant (`LINE`) and its accent phrase another (`ACCENT`), and the spans and the liquid's picture both read them, so a new sentence changes only the fill's step. Keep `COMPLETE_AT` under 1, or the line never holds before the water. `WAVE_VH` is shared with AccentWave, which reads it for the rise: change it in ScrubLine only. Tile places, sizes and casts live in `floating-badges-data.ts`. Bump `TILES_V` when the renders change. FloatingBadges' header says touch screens keep the tiles still. They still bob and flip there, and only the parallax is off.

### 5.9 Accent water

**What it is.** A fixed, full-viewport canvas at z 20 that fills the view with the accent as the reader scrolls from the line into the players, and drains as the light page returns. Its leading edge is one arc of wide halftone: specks far from the blue, growing into dots that touch and merge into the solid. It is the site's only accent-blue fill. The players section has no background of its own and stands on it.

**Why a fixed canvas, not a section background.** The takeover has to rise over the line while the line's stage is still pinned, hold under the players while they scroll, then leave as Understands comes up. No section's own background can sit above one section and below the next across those three stages. A fixed layer driven by the scroll can. It is drawn by one shader pass on the GPU because the 2D canvas it replaced filled some twenty thousand dots a frame, which Safari ran on the processor at a few frames a second.

**Geometry.** edge(x) = level + dir x 90 x (2x / w - 1)^2. Rising (dir 1) the arc is highest in the middle, draining (dir -1) it is the mirror, lowest in the middle, as the light page pushes the blue up and off. The solid stops 12px (two pitches) short of the edge and the grown dots close the seam. The halftone runs 480px on the far side of the edge on a 6px grid. Its strength s goes from 0 at the band's outer side to 1 at the edge, the dot radius from 0.35 to 4.32px (0.72 of the pitch, past touching) by s^1.4, the opacity min(1, 0.15 + 0.95 s), and the dots carry on three rows into the solid. Overlapping dots add up, as they did on the 2D canvas.

**Colour and grain.** The accent `#1a6dff` is mixed 7% toward a 160px tile of random greys, dots included, so the solid reads as a material and averages about `#216ef6`. Judge anything that sits on the players' ground against that, not against flat `#1a6dff`. The guide's on-blue ground draws the same kind of tile at the same strength for that reason.

**Motion.** None of its own: its level is a function of the scroll, so it needs no reduced-motion branch. The rise runs over the scroll line's last `WAVE_VH` (1.3) screens and the drain over one screen past the players' foot (`DRAIN_VH`), both eased by smoothstep so the edge starts and settles gently. Near the players the magnet settles a scroll that comes to rest close to full: the document's scroll snap (proximity, `#players` as its start), and in desktop Safari, where the snap is off, a catch in script that glides in a scroll resting within 0.3 of a screen, as Shell behaviours ([6.7](#67-shell-behaviours)) sets out.

**Event contract.** At 0.9 full it dispatches `accentwave` on window with `{ filled: true }`, and below 0.8 it dispatches `{ filled: false }`. The gap keeps one step back from undoing the players. The header turns solid white while filled, since its 92% page strip would read grey over the blue. The players start their entrance on filled. Anything new that must react to the takeover listens to the same event rather than measuring the scroll again.

**Performance rules.** The canvas is the viewport times the pixel ratio, capped at 2. An unchanged frame is not drawn (the draw keys on width, height, level, direction, dots and ratio), so scrolling through the players with the view full costs nothing. A lost context is rebuilt and drawn again. Without WebGL a 2D canvas draws the same geometry. `?off=wave` draws the blue without its dots, for measuring them, and `?gpu=high` asks for the faster GPU.

**How to change it safely.** Keep the band near its 480px: a short band turns the edge into a stripe. Keep the radius (0.72 of the pitch) and the solid's stop (two pitches) tied to the pitch, since together they keep the seam closed. The constants live twice, in AccentWave (the level and the 2D path) and in the call to `accentWaveGL`, and the halftone shares no token with the sweep (pitch 7) or the button's dot band (pitch 3.5). `accentWaveGL` has no dispose: a page that mounts it twice has to lose the first context itself, as the guide does through `WEBGL_lose_context`.

### 5.10 Human / AI swap

**What it is.** Switching Human / AI sweeps a wide band up the player's portrait, bottom to top, shaped as a tall dome. Below the dome's line is the new copy and above it the old. Across the band the new copy shows as a halftone with its red and blue channels pulled apart, and along the line a thin laser glows wherever it crosses the body. The AI copy is the faceless blue scan-line hologram, so this is the one place the page shows a person turning into their model.

**Three formats.** `useClipFormat` picks one per browser. Stacked: the clips as stacked-alpha MP4s (colour above, alpha as grey below), with both copies and the band drawn by one shader from frames already on the GPU (StackedSwap and `swap-gl.ts`, for Chrome, Safari and iPhones). WebM: two layers cut by a clip-path polygon every frame, plus a 2D canvas for the band (PortraitSwap). Still: the same 2D path over the two stills. `?clips=webm|stacked|still` forces one for a visit. Geometry and timing are the same in all three.

**Geometry.** In the frame's own 810 × 1080 px. The band is 0.6 of the height (648) and the dome 0.35 (378): line = mid + rise x (1 - sqrt(1 - u^2)), flat on top and steep at the sides, so it reads as a plane of light passing up through the body rather than a wipe. Halftone on a 7px grid, radius 7 x 0.72 x s^1.3 (up to 5.04), dropped under 0.3. The channels are pulled 10px to either side and held to the copy's own outline, so the fringe never spills onto the water. The laser is a 3px white core in a glow of rgb(120, 175, 255) at 0.142 x exp(-d^2 / 128), drawn only where the incoming copy is opaque.

**Timing and easing.** 1.5s on an in-out cubic (4k^3 under half, then its mirror), the dome's top travelling from the whole band below the portrait to the whole band above it. Both copies follow the cursor while the band runs, and only the copy on screen does once it settles, so only its frames are decoded. The doodles' AI copy begins 0.6s after the switch, inside the sweep, so the drawing and the body change together.

**When it does not sweep.** The first showing, an unchanged mode, reduced motion and a copy with no frame yet all swap at once. React's second effect run in development falls under the first rule. While in view and untouched the portrait flips by itself every 5s (`AUTO_S` in `usePlayerMode`), until the visitor uses the switch.

**The switch.** ModeToggle is a radiogroup pill on the water: a white 15% track with a 25% inset ring, a white thumb with a soft ink shadow, the chosen label in ink and the other in white at 80%, white on hover. The thumb slides on a motion layoutId with spring 500 / 40. Each mounted switch needs its own `thumbId`, or the desktop and phone placements trade thumbs. It sets no focus style of its own and shows the browser's ring.

**Performance rules.** Stacked holds one WebGL context and two hidden videos per portrait, and two portraits for a moment during a player change (AnimatePresence popLayout). `swapGL` has no dispose. The webm path reshapes a CSS clip-path every frame of the sweep, a known cost. The 2D band composites inside its canvas (lighter, multiply, destination-in) and lights the laser with a canvas shadow, none of it CSS. `?gpu=high` puts the portrait on the faster GPU.

**How to change it safely.** `BAND`, `DOME`, `PITCH`, `CHROMA` and `SWEEP_S` are written in PortraitSwap.tsx, StackedSwap.tsx and swap-gl.ts. Change all three together, or the formats drift apart by browser. `swap-gl`'s `SIZE` is the frame ({ w: 810, h: 1080 }) and `doodle-geometry`'s `SIZE` is a scale (0.7): one name, two meanings. A new player needs both clips in all three formats, or that browser falls back to an instant swap.

### 5.11 Doodles

**What it is.** White line drawings round each player's head, of what that player is about (the explorer's compass, dotted route, pin and peak), sketched one stroke after another as if by hand. When the portrait turns AI, the AI retraces every stroke in the same order, exactly over the hand's line: clean, glowing, twice as fast, with a bright pen point at its tip, while each hand line dims under it. Back to Human, the AI's copy is put away and the hand sketches it all again. The drawings live in `player-doodles.ts`, in the portrait's own 810 × 1080 frame.

**Drawing rules.** Hand: 3.5px white at stroke-opacity 0.85, round caps and joins, its points pushed off the path once by a seeded two-octave noise (6px at frequency 0.03, a point every 2px, at least 32 a piece), so every visit wavers the same way. Dotted strokes are 5px dots every 15px that appear as the line reaches them. AI: the same path, clean, at 3.5px, over its glow. Each drawing is shrunk to 0.7 about its own centre and placed just clear of that player's measured outline. The layer sits at -z-10 inside an isolated box: behind the portrait, above the players' glow.

**Glow without filters.** The AI's glow is five wider, fainter strokes under its line in `#7fb2ff` (widths 26, 20, 14, 9 and 5 at opacities 0.04, 0.05, 0.06, 0.08 and 0.10), the falloff of the 4px blur it replaced. The pen point is a white disc of r 5 with halos of r 9 at 0.2 and r 13 at 0.1. The waver used to be an SVG feTurbulence and feDisplacementMap over the whole drawing and the glow an SVG blur. Both were redrawn every frame a stroke drew in, on the processor in Safari, and held the players at 3 to 7 fps there. Points and stacked strokes cost nothing per frame beyond the strokes themselves.

**Timing.** The hand starts 1s after `start` (`DELAY_S`) and plays each stroke at 0.6x its written timing (`HAND_PACE`) on easeInOut, so the longest drawing, the explorer's, ends about 5.5s in, just after the first switch at 5s. The copy never overtakes it: each stroke's copy starts at the switch plus 0.6s (`AI_LEAD_S`, inside the 1.5s sweep) plus half its written start, runs at 0.5x and linear, and never starts before the hand has finished that stroke. Each hand line fades [1, 0.3, 0] over its copy's length plus 0.3s. Back to Human the copy fades in 0.3s and the hand redraws from 0.6s. `start` false wipes everything to 0 over 0.2s.

**Reduced motion and switches.** Under reduced motion every stroke is drawn at once. `?off=doodles` hides the layer.

**How to change it safely.** Write strokes in frame px with `at` and `dur` in seconds of the written timing, and give each drawing its centre `o` and its place `to`. Keep the doodles on the water: they are white for it. A drawing is fixed for an instance's life (its motion values are made once), so a new player needs a remount. `DELAY_S` is hard-coded, which is why a specimen waits 1s for the hand. `HAND_PACE`'s comment still says the hand finishes before the portrait first turns AI. That held with the old 5s start and 10s switch, and no longer does: three of the four drawings end after the first switch at 5s, so the copy waits on the hand there. The delay, the pace and the switch (`AUTO_S` in usePlayerMode.ts) are one clock, as Choreography ([4.5](#45-choreography)) sets out, and change together. The header comment says the doodles are wiped when the section leaves view, but Players passes `revealed`, which stays true once the section has shown, so nothing wipes them. Any new effect on the strokes is made from points or more strokes, never an SVG filter or mask.

### 5.12 Halftone, chromatic split, grain

**What it is.** Three treatments that recur across the page with different values. Each instance is tuned to its place, but the three stay recognisably one family each, so the page's light reads as one material from the hero to the footer. None of them is a token yet: the values are numbers in each part's own code.

**Halftone.** Dots on a grid that grow from specks to solid across a band, adding up where they overlap. Accent water ([5.9](#59-accent-water)): a 6px grid over a 480px band. Human / AI swap ([5.10](#510-human--ai-swap)): a 7 frame px grid in the incoming copy's own colours. Try now dot band: 3.5px, radius 0.95, `#9cc0ff`, a 34px band with 5px soft sides at a peak of 0.75, each dot set to the value a Gaussian blur of the band's edges would give rather than rendered through one. The rule: a halftone is always a band with a direction, an edge rising or a sweep travelling, never a still fill pattern.

**Chromatic split.** A colour fringe where light bends, never across a whole surface. Footer wordmark: copies 3px left in `#e89fa4` and 3px right in `#9ed5dd`, each fading out by 16% from its own end, drawn as gradients clipped to the letters in the colours the old multiply over the footer's ground gave. Glyph pool: red and cyan copies 1px either side at 0.14 where 4 x lens x (1 - lens) passes 0.18, so it peaks at the pool's rim and is absent at its centre. Tile glint: `glintCA` 1, red shifted right and blue left at the glint's rounded ends. Sweep: red and blue 10 frame px either side, held to the copy's outline. Liquid lens: aberration 0.225 along the lens direction. The rule: warm one way and cool the other, a few px, at an edge.

**Grain.** Page grain: SVG fractal noise (baseFrequency 0.75, 4 octaves, stitched, a 200px tile) drawn as black specks whose alpha is their darkness, at 0.045, from Understands to the footer, faded in over its first 240px by the page's own colour laid over it. Water grain: random greys mixed 7% into the accent, as Accent water ([5.9](#59-accent-water)) draws it. Floor film grain: a 0.025 per-pixel hash in the floor's last pass. Liquid grain: only inside the cursor lens. The rule: grain darkens by alpha or inside a canvas. The page grain replaced a multiply and a masked fade, either of which stopped Chrome on a Mac from passing frames straight through.

**Which ones move.** Only the liquid's grain is animated. The halftones move because their band moves, never their dots. Every grain and every fringe is still.

**How to change it safely.** Change an instance's values in its own file and its row in the guide's family table: with no shared token, nothing propagates. Keep the radius at about 0.72 of the pitch at full strength, so a band closes into solid with no seam. A page-grain panel needs about 480px, or the 240px fade leaves almost nothing to see. A new fringe takes the footer's or the glyph pool's pair of hues, never a third. The accent [26, 109, 255] and the ink [10, 27, 51] are repeated as literals in AccentWave, LiquidLine, the glyph tints and the typed caret, so a palette change has to find every copy.

### 5.13 Compositor-safe rule

**The rule.** Nothing on screen uses `backdrop-filter`, `mix-blend-mode`, a CSS `mask` or `mask-image`, or a CSS `filter`. With any one of them anywhere on screen, Chrome on a Mac stops handing a frame's canvases and layers to the system as they are and puts the whole frame together itself, which holds Intel and dual-GPU Macs at 30 fps. The rule is page-wide because the cost is: a small blurred pill in a corner slows the tile floor, the water and the liquid with it.

**What to draw instead.**
- A glow: stacked strokes, each wider and fainter (the AI doodles), or a picture drawn once (the terminal hint cursor's shadow).
- A multiply or a grain: alpha specks that darken by their own transparency (the page grain), or compositing inside a canvas (lighter, multiply, source-atop and destination-in in the sweep).
- A mask or a fade: a gradient in the ground's own colour laid over the edge (the page grain's top), or the fade drawn on a canvas (the footer's copy line picture).
- A frosted strip: a solid ground at 92% of the page colour (the header).
- A blur inside a texture: an offscreen `ctx.filter` baked once (`tiles/textures.js:63`), which is fine, because it never reaches the screen as CSS.

**Measuring switches.** `?off=` takes any of ascii, wave, liquid, tiles, doodles, grain and fx, comma separated, for one visit, and `<html data-off>` carries them for the CSS ones. `fx` strips every backdrop blur, blend mode, mask and filter on the page, so a before and an after on one machine show what they cost. `?perf` shows a readout (fps, slow frames, long tasks, the floor's ratio and anti-aliasing, the GPU, clip seeks) with a Copy log of the last three minutes, and `?perf=bench` adds the floor benchmark. `?gpu=low` puts the floor and the liquid on a two-GPU laptop's low-power GPU, `?gpu=high` the water and the portrait on the faster one. `?clips=` forces a portrait format. Without them nothing changes.

**WebGL budget.** At once the site holds the tile floor, the liquid (desktops), the water and one portrait (two during a player change), plus probe contexts from `useClipFormat` and, under `?perf`, `gpuName`, which are never released. Chrome loses the oldest context past about 16 a page, and the floor and the liquid do not recover from a loss. So a new WebGL effect needs a reason to be a new context. A page that mounts many, as the guide does, rations them: eight units, one floor and eight iframes live at once, each claimed as it nears the view and released, its contexts lost through `WEBGL_lose_context`, past one and a half viewports.

**Known violations.** These break the rule on or near the page today: the job cards' sheen (a drop-shadow filter and a mask on every card, even while the light is at opacity 0), FloorLogo's mask-image while the container hero loads, LanguageMenu's blur on open with its backdrop-blur-xl, the /tiles page's hint pill, and a dead PrimaryCta prism branch with mix-blend-screen and feGaussianBlur. Known gaps ([10.2](#102-known-gaps)) lists them with their lines and severity.

**How to test a change.** Open the page with `?perf` on a Mac in Chrome and scroll its whole length, then again with `?off=fx`. If the two differ, something on screen breaks the rule. Before an effect ships, check its CSS for the four properties, including the ones a library writes for you: motion's `filter` animations and Tailwind's `blur-*`, `backdrop-blur-*` and `mix-blend-*` classes.

## 6 Shell

The parts every page wears: the identity, the header and its phone menu, the language picker, the footer, Back to top and the window contracts they talk through. They answer the window rather than their box, so the guide frames them at true widths. Shell behaviours ([6.7](#67-shell-behaviours)) holds the contracts the other chapters here lean on.

### 6.1 Logo and identity

**Purpose.** The identity is one mark (three blades round a core circle) and one wordmark (6labs in Outfit with an accent 6). They meet as a lockup in the header and the footer, and the mark appears alone as the footer's crest and, redrawn in outline, on the comparison cards. The system adds `Lockup` so a page never rebuilds the pair by hand.

**Anatomy.**
- Mark: the logo file `public/brand/sixlabs-mark.svg`, drawn in code by `SixLabsLogo` (flat, or fading down its last 40% in SVG gradients). Blades `#1770EF` (`--ds-color-logo-blue`), core `#030D2D` (`--ds-color-logo-navy`).
- Wordmark: `Word` from `CopyLine.tsx`, the 6 in `--ds-color-accent`, the rest in the ink around it. `Word plain` drops the accent.
- Lockup: mark, gap, wordmark, and an optional `.ai` suffix (the footer's form).
- Line mark: `SixLabsMark`, the mark as outlines in `currentColor` at the ChatGPT mark's weight.

**Variants.** Ink (the logo file and the accent 6, on the page, surface and container) and onBlue (the outline mark and the plain word, both white, on the accent water only).

**Sizes.** sm, md and lg: mark 24 / 32 / 44, wordmark 18 / 24 / 32 at 500, gap 8 / 10 / 12. md is the header's lockup, and the other two keep its ratio so they read as the same lockup scaled rather than a second design. The smallest mark is 20, where the three blades still read as three. On the comparison cards the outline mark is 44 (36 on a phone), beside a name of its own size rather than a lockup step. The outline mark has no optical sizes: its line is in viewBox units, so it thins at 16 and thickens at 64. Use it from 24 up.

**Clear space.** The core circle's diameter (0.292 of the mark) on every side: 7 at sm, 9 at md, 13 at lg. It is measured from the mark because the mark is the part that defines the lockup's height. Nothing else (a tab, a pill, the bar's edge) comes inside it.

**Colour.** Two brand colours and two interface colours meet here and must not be swapped. The blades keep the logo file's `#1770EF` and the core its `#030D2D`, because they are the logo, not the interface. The 6 takes the interface accent `#1a6dff` and the word takes the ink `#0a1b33`, because the wordmark is set type. The two blues sit side by side on purpose, and neither is "corrected" to the other.

**States.** As a link (`href`) the lockup has rest and focus-visible only. It has no hover, matching the shipped header and footer, because it is a way home and not an offer competing with the calls to action. Focus takes `--ds-focus-color`, or the white ring on blue.

**Props.** `size`, `tone`, `suffix`, `href`, `forceState`, `className`. Paths that start with `/` use a Next Link.

**Motion.** None. The lockup never moves in the shell, because a way home that moves would compete with the calls to action. The line mark on the comparison cards rides its card's entrance and nothing more.

**Accessibility.** The mark is decorative (`alt=""`, `aria-hidden`) and the wordmark is real text, so the link's name is "6labs" (or "6labs.ai") with no extra label. `ChatGptMark` is OpenAI's mark from Simple Icons. It names the model a card compares against, appears only beside that comparison, and never stands for 6labs.

**Responsive.** The shipped lockup is the same 32 / 24 at every width. A new surface picks sm below 400 only when the bar has no room for md.

**Do / Don't.**
- Do use `Lockup` wherever the mark and word appear together, at one of its three sizes.
- Do use the onBlue tone on the accent water, where the flat blades would sink into the water.
- Don't place the flat logo on the accent: `#1770EF` on `#1a6dff` leaves only the core visible.
- Don't recolour the blades to the accent, or the 6 to the blade blue.
- Don't set the wordmark in any other face or weight, or draw it as an image.

### 6.2 Header

**Purpose.** One fixed bar on both pages: the lockup (home), four tabs that glide to their sections, the language picker, and Sign in. It stays put while the page moves so the visitor can always get home or jump ahead, and it carries the only control the hero's Try now has to share the first view with.

**Anatomy.** `nav#site-head`, fixed at z 40, padding 20 by 24 from md and 16 all round below, a 1px bottom stroke that is always in the box (so the bar never changes height when it shows). Inside, a row capped at 1400: the lockup at left, the tabs (gap 32, Inter 15/400 in ink) in the middle, and the right cluster (gap 16, 6 on phones) holding the language picker, Sign in and the phone's menu button.

**Variants.** Default (`/website`) and `clear` (`/6labs-fullview`). Clear exists because the full view's tile floor runs under the bar. A ground at the top would cut the floor into a strip, so the bar is transparent until the page scrolls, and it hides while the loader shows so nothing interactive sits over a page that cannot be used yet.

**Grounds and their triggers.** The bar reads the window, not its parent, which is why the guide shows it in frames.
- Rest: the page colour at 92%, no stroke. Sections show faintly through as they pass, which says "the page goes on under here" without a blur.
- Scrolled (`scrollY > 4`): the slate stroke appears, separating the bar from content now under it. Four pixels, not zero, so a trackpad's settle does not flicker it.
- onBlue (`accentwave` with `filled: true`): solid white, because a 92% page colour over the accent water reads as a pale blue smear. The event's two thresholds, set in Accent water ([5.9](#59-accent-water)), keep the bar from flickering at the water's edge.
- Clear, held: invisible from the first paint until `heroloaded` (or 12s). It appears at once, with no fade, so the bar is simply there when the page is.
- Clear, top: transparent until the first 4px of scroll, then the default scrolled bar.

**Sizes.** One bar. Sign in is medium (14px, about 39 tall) from md and small (13px, about 33) below, tied to the breakpoint rather than a prop, because the bar only ever has one width class.

**States.** The bar's own states are its grounds above. Its tabs rest in ink and turn accent on hover over 300ms. Sign in is outlined in slate-300, and on hover takes white at 70% with a `#b7c0cb` stroke over 200ms. Sign in is outlined so Try now stays the one solid call to action in view.

**Props.** `clear?: boolean`.

**Motion.** Ground and stroke change over 300ms on Tailwind's default ease. No hide on scroll and no shrink on scroll: the bar is small already, and a moving header competes with the scroll line's own motion.

**Accessibility.** Today the bar has no focus ring of its own on any control, no current-section state on the tabs (no `aria-current`, no scroll spy), no skip link, and the outer element is a `nav` without a label holding non-navigation controls too. New work adds the system focus ring to every control, a `header` landmark with a labelled `nav` for the tabs, and `aria-current="location"` on the tab of the section in view.

**Responsive.** One breakpoint, md 768. Below it the tabs and the language move into the mobile menu and the burger appears. 768 to about 900 is the tight band, where lockup, tabs and cluster fill the row with little air. Nothing new is added to the bar without checking that band first.

**Gaps.** No scrolled state on mount (a reload restored mid-page shows the top state until the first scroll). Sign in has no `type` and no pressed or focus state. On the white onBlue bar Sign in's hover fill is invisible and only its stroke moves. The tab list and the footer's Explore list are two sources and already differ.

**Do / Don't.**
- Do keep Sign in outlined and medium. The large solid pill belongs to the hero.
- Do keep the bar unfrosted. A backdrop blur on a fixed bar breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)) for the whole page.
- Don't add a fifth tab before the 768 to 900 band is checked.
- Don't listen for scroll to restyle the bar in a new way. Add a window event to the contract in Shell behaviours ([6.7](#67-shell-behaviours)) instead.

### 6.3 Mobile menu

**Purpose.** Below 768 the four tabs and the language picker do not fit the bar, so a round menu button opens a white sheet straight under it with the tabs as large rows, the language row and the primary Try now. It exists only on phones: every part is `md:hidden`.

**Anatomy.** Menu button (40 round, lucide Menu or X at 22 / 1.75 in ink). Veil (ink at 20% from the bar's foot, a tap closes). Sheet (white, px 16, pt 4, pb 24, a slate-200 stroke at 80% under it). Rows (Outfit 20 at 400, py 16, a slate-100 rule, a trailing ArrowRight 18 in slate-400). Language row (a 13px muted label and the LanguageMenu, raised over the call to action so its panel opens over it). Try now (the shipped PrimaryCta stretched to full width).

**Variants and sizes.** One. Rows are about 61 tall, well past a thumb's target, because on a phone they are the only way to the sections.

**States.** Closed (the button only) and open (the X, the veil and the sheet). A row shows accent while pressed, since touch has no hover. A tap on a row closes the sheet, frees the page and glides to the section.

**Props.** `links`, an array of `{ label, to }` where `to` is a `Spot`: the header's own tab list.

**Motion.** The veil fades over 250ms. The sheet fades and rises 8px over 250ms on the system ease, short enough that the menu feels like part of the bar, not a page change. The icon swaps at once. Exit is the same motion reversed.

**The page hold.** While open the document's overflow is clipped so the page under the veil holds still. Overflow `clip`, not `hidden`, because clip does not create a scroll container and leaves the scroll position alone.

**Accessibility.** The sheet is not yet a dialog: no `role="dialog"`, no `aria-modal`, focus is not moved into it on open nor returned to the button on close, and Tab can leave it. The button is 40, under the 44 touch target. Escape, the veil and the X close it. New work makes the sheet a modal dialog with a focus trap and a 44 button.

**Responsive.** If the window widens past 768 while the sheet is open, the sheet hides but the page hold stays on until a reload or a second toggle. Any change here closes the sheet on that resize.

**Known behaviour under ClickLock.** The rows are links, so ClickLock swallows their click: the sheet stays open and nothing glides. The veil and the X still work. A language chosen in the sheet is lost on close, because the sheet's LanguageMenu unmounts and remounts at English, and it is separate state from the desktop picker.

**Do / Don't.**
- Do give the menu button the full 44 target.
- Do keep the primary call to action as the sheet's last row, at full width.
- Don't put the tabs back into a phone bar at a smaller size. The rows exist so each target is thumb-sized.
- Don't animate the sheet's height. It mounts whole and moves 8px, which keeps the motion on transform and opacity.

### 6.4 Language menu

**Purpose.** A region and language picker (US English, KR, JP, CN) in the header from md and in the phone sheet. It stays small in the bar (a globe and a two-letter code) and opens a short list in which each language is written in its own script, so a reader finds theirs without reading English. The choice is cosmetic today: it changes no locale and is not saved.

**Anatomy.** Trigger: a pill, px 10 py 6 (about 30 tall), Globe 18 and the code at 12/500 in a fixed 18px slot so the trigger does not change width between codes. Panel: 192 wide, p 6, radius 16, white at 95% with a slate-200 stroke at 70% and the pop shadow, hung 12px under the trigger's right edge and opening from that corner. Rows: px 12 py 10 at radius 12 (the panel's radius less its padding, so the corners nest), the code at 11/600 in slate-400, the label at 15, a Check 16 on the selected row. One highlight (slate-100) glides between rows through a single `layoutId`.

**Variants.** None. The header's instance and the sheet's are the same part mounted twice, each with its own state.

**Sizes.** One, the trigger and panel above. It never steps with the viewport.

**States.** Trigger: rest in slate-500, hover in accent over 200ms, open with a slate-200 fill at 60% and the globe turned 20°. Rows: active (the highlight under it, from the pointer or the arrow keys, wrapping at the ends) and selected (label at 500 in ink and the Check). When the pointer leaves the panel the highlight returns to the selected row, so the panel never shows a stale hover.

**Props.** None. The list and the state are internal.

**Motion.** Everything rides one spring, stiffness 460, damping 34, mass 0.7 (`spring-pop`, `SPRING.pop` in motion.ts): the globe's turn, the panel's arrival (opacity, scale 0.94 to 1, 8px down), the rows (staggered 35ms after a 40ms delay) and the highlight's glide. The exit is a 140ms ease-in, faster than the entrance, because a closing list is already out of the reader's attention.

**Keyboard.** While the trigger has focus: ArrowUp and ArrowDown move the highlight, Enter or Space choose and close, Escape closes. A pointerdown anywhere else closes it.

**Accessibility.** The trigger is named "Language: English" and the rows are options in a listbox. The gaps: `aria-activedescendant` sits on the list, which never takes focus, so screen readers do not follow the highlight. The fix is to put it on the focused trigger (with `aria-controls`) or to move focus into the list. The ids `lang-0` to `lang-3` and the `layoutId` are not scoped per instance, so two menus on one page collide (the guide wraps its one live instance in a LayoutGroup). Tab leaves the panel open. The visible code "US" is not in the accessible name "Language: English". Country codes stand in for language codes. There is no focus ring.

**Performance.** The panel uses `backdrop-blur-xl` and animates `filter: blur()` on the way in and out. Both break the compositor-safe rule ([5.13](#513-compositor-safe-rule)), which the rest of the shell keeps, for as long as the panel is open. New pickers use the system Select, which keeps this panel's geometry on a solid white ground and animates only opacity, scale and y.

**Responsive.** The header's instance is hidden below md, and the sheet carries the phone's.

**Do / Don't.**
- Do nest the row radius inside the panel's (16 less 6 gives 12 or less).
- Do keep the trigger's code slot fixed width.
- Don't add blur to a popover, or animate a filter.
- Don't mount two instances without a LayoutGroup each.

### 6.5 Footer and copy line

**Purpose.** The foot of both pages, in three bands. First the lockup with its line, the Explore links and Back to top. Then the copy line, the giant 6labs standing in front of a picture of players walking toward the mark and leaving as blue copies. Last the tail, with the copyright and the legal links. It sits a shade darker than the closing section (black at 4% over the page) so the page ends on a ground of its own, with the noise still showing through.

**Anatomy.**
- Top grid: two columns on phones (the brand block across both), then 1.7fr / 1fr / auto from md, gap 40, pt 60, inside a 1400 row with 16 / 64 side padding. The brand column is widest because the tagline needs the measure.
- Brand block: the lockup in its `.ai` form and the tagline at 14 / 1.65, 22 below.
- Explore: an h3 at 13.5 / 600 in ink, then the links at 13 in muted grey, 13 apart.
- Back to top: a text button at 13.5 in ink with ArrowUp 14 / 2.
- Copy line band: the word at `clamp(84px, 19vw, 300px)`, Outfit 600, tracking -0.055em, with clear air above it (72px plus 0.46em, 150px plus 0.46em from md). The mark crests from behind it at 0.95em, fading into the word. A pale red copy nudged 3px left and a pale cyan copy 3px right, each fading out by 16%, show only where a copy slips past a letter's edge.
- Spec labels (from 1024): pills at 12 on a 28px leader with an end dot, default (white at 85%) and strong (navy), pinned in the picture's coordinates.
- Tail: black at 4% again under an ink hairline at 8%, py 22, safe-area padding at the foot. The slate hairline used elsewhere disappears on this tinted ground, so the tail's hairline is ink.

**Variants.** None by prop. The footer has three compositions by width instead. Phone: mark and word only, the tail centred. Tablet (768 to 1023): the picture behind the word. Desktop (from 1024): the two spec labels too. The labels wait for 1024 because below it they crowd the heads they point at.

**Sizes.** One. The word is sized by the window, `clamp(84px, 19vw, 300px)`, rather than by a size step.

**How the picture is drawn.** `CopyLinePicture` draws the picture on a canvas the size of the band. Each pixel's darkness becomes its alpha (a multiply done once, in the canvas), its colour is re-derived against the footer's own ground, and a radial `destination-in` fades it round the word. No CSS blend mode or mask is ever on screen, under the compositor-safe rule ([5.13](#513-compositor-safe-rule)). The cost is that the ground is baked in: the band only looks right on the footer's ground (`#f9fafb` at 96%). It loads 800px before view and picks the 1344 source on narrow or low-density bands.

**States.** Links: muted at rest, accent on hover over 300ms (legal links turn their underline accent too). Back to top: ink, accent on hover. No focus ring on any control.

**Props.** None. The links, the copy and the picture are written in Footer.tsx and CopyLine.tsx.

**Motion.** Colour only. The band is still: a footer that moves pulls the eye back down a page the reader is leaving.

**Accessibility.** The band is `aria-hidden`, since the wordmark and labels repeat what the lockup and the page already say. The Explore links are a labelled `nav`. Gaps: the stub links (Case Studies, Terms of Use, Privacy Policy) are anchors without `href`, so a keyboard never reaches them. The h3 has no h2 above it in the footer.

**Responsive.** The word is sized in vw and the picture's breakpoints are viewport queries, while the picture and labels scale with the band's own width. The two only register at a true viewport, which is why the guide shows the footer in a frame and never as a direct import.

**Gaps.** No social links, contact or newsletter slot. The Explore list and the header's tabs are separate sources and differ. The year is hard-coded. On desktop the floating Back to top and this one show together. Phones load and process the picture although they never draw it.

**Do / Don't.**
- Do keep the band on the footer's ground, or re-derive the picture against the new one.
- Do give every footer link an `href`, or render it as text until it has one.
- Don't put a blend mode or mask on the picture to "fix" its edge. Change the canvas pass instead.
- Don't add a third spec label without moving the existing two: they are placed on specific heads.

### 6.6 Back to top and scroll cue

**Purpose.** Two quiet aids to moving through a long page. Back to top is a small round button fixed in the bottom right that appears once the reader is deep in the page and glides them home. The scroll cue is a label and a bobbing arrow under the hero that says the page continues, and leaves as soon as the reader has acted on it.

**Back to top: anatomy.** A 44 circle (40 on phones), white, a slate-200 hairline at 80% and the float shadow (`--ds-shadow-float`), an ArrowUp 18 / 1.75 in ink, 24 from the corner (16 on phones), at z 40 over the water (20) and the players (30). It carries its own white ground because it crosses the accent water, where a bare arrow would read as part of the picture.

**Scroll cue: anatomy.** A label "Scroll" at 11 / 500 in caps with 0.18em tracking over an ArrowDown 16 / 1.75, gap 6, in slate-400. The arrow bobs 4px over 1.8s, ease-in-out, forever.

**Variants.** None for either part.

**Sizes.** One each: Back to top's circle and the cue's label and arrow below, with Back to top a step smaller on phones.

**Back to top: states.** Hidden, shown, hover (lifts 2px and turns slate-50, over 300ms). No focus ring and no pressed state today.

**Back to top: visibility.** It shows once the foot of `#model-line` is inside the view, so from the players on, the point where the way back is long enough to need a shortcut. On phones it shows only while the reader is scrolling up (a change of more than 4px, so a jitter is no change of direction) and never while the footer is in view, because the footer has its own Back to top and the thumb is busy with content on the way down. Hidden is opacity 0, 8px down, no pointer events and tabIndex -1.

**Scroll cue: states.** Present at scroll 0, away (opacity 0 over 300ms) past 40px. Its threshold is ten times the header's 4px on purpose: the header reacts to any scroll so it never lags, while the cue waits for a deliberate one so a nudge does not dismiss it.

**Scroll cue: placement.** Under the container hero at its left from md, at the full view's foot from lg. Never on phones, where the hero already runs past the fold and a cue would crowd the call to action.

**Props.** None. Both read the window: Back to top watches `#model-line` and the footer, the cue the scroll position.

**Back to top: motion.** Show and hide fade and move 8px over 300ms. A press runs the page's glide to the top, as Shell behaviours ([6.7](#67-shell-behaviours)) sets out.

**Accessibility.** The cue is decorative (`aria-hidden`, no pointer events), so it is never a control and needs no keyboard twin. Its bob stops under reduced motion. Back to top gaps: when hidden it is still in the accessibility tree (tabIndex -1 but no `aria-hidden` or `inert`), the glide ignores reduced motion, and on desktop it shows beside the footer's own Back to top. Its rule is hard-wired to `#model-line` and the footer, so it works on these two pages only.

**Responsive.** Back to top changes size, inset and visibility rule at 768. The cue's placement changes at md on `/website` and at lg on the full view.

**Do / Don't.**
- Do keep the floating button's own white ground and shadow wherever it can cross the blue.
- Do hide the floating button while the footer is in view on phones.
- Don't make the cue clickable. It is a hint, and a second way down would compete with the scroll itself.
- Don't share one threshold between the header and the cue. They answer different questions.

### 6.7 Shell behaviours

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
- `accentwave` (CustomEvent, `{ filled }`): sent by the water as it fills and drains, with the thresholds set in Accent water ([5.9](#59-accent-water)). The header turns white and the players wait for it.
- Scroll thresholds: 4px (the header's stroke), 40px (the cue leaves).
- Ids: `#model-line` (the scroll line's track, read by BackToTop, the spots, the water and the ASCII field), `#site-head` (the bar, whose height a spot subtracts), `#players` (the magnet's point), `[data-covers-view]` (the full view's hero fills the screen), and the `onblue:theme` event the ASCII field listens for.

**How to change it safely.** Add a new signal as a window event with a constant exported from the file that sends it (as `HERO_LOADED` is), and list it in the guide's contract table. Never rename an id without a search across `src/components/website`, because each is a string repeated in several files. Never render `#players`, `#model-line` or `#site-head` in a document that also runs the site's scroll code.

**Gaps.** The glide ignores reduced motion (a 0.9 to 2.2s forced animation) and cannot be cancelled. Desktop Safari's magnet ignores it too, a 0.6s glide on Lenis. It moves neither focus nor the URL hash, so Back does not return and a screen reader stays where it was. Sections have no `scroll-margin-top`, so the no-script hash lands under the bar. Understands and Closing have no spot, and Case Studies has no target. New work: under reduced motion jump at once, move focus to the target's heading, update the hash with `history.replaceState`, and give every section a `scroll-margin-top` of the bar's height.

## 7 Components

The parts a page is built from, each chapter in one order: Purpose, Anatomy, Variants, Sizes, States, Props, Motion, Accessibility, Responsive and Do / Don't, with the reasons a part needs beside them. A few parts are specced where their reasons live instead, each as a block of its own that the contents lists under its section: Icon in Icons ([2.9](#29-icons)), SkipLink in Focus ([2.10](#210-focus)) and Banner in Loading, empty and failure ([9.8](#98-loading-empty-and-failure)). Lockup is the subject of Logo and identity ([6.1](#61-logo-and-identity)) itself, so that chapter is its spec. Every part keeps the accent rule ([chapter 8](#8-the-accent-rule)) and meets Accessibility baseline ([2.11](#211-accessibility-baseline)).

**Using a part.** Import it by the alias, one file per part: `import { Button } from "@/components/design-system/Button"`. Every part reads its values as `--ds-*` custom properties, so `<TokenStyle />` must be mounted above it, or the part renders without its colours, radii and timings. The guide's layouts mount it for every section and frame. A page outside the guide mounts its own, scoped to a class so the values reach only that part of the page (`<TokenStyle selector=".ds-index" />` is how the index card does it), and the site's own parts never read them. The parts' file layout, exports and code rules are in `src/components/design-system/README.md`.

### 7.1 Button

**Purpose.** A labelled action. The site ships one, Try now, as the hero's and the closing section's call to action, and it carries no onClick or href: it is a picture of a button for a walkthrough. The system Button is the same pill made into a working control, then widened into a family so a form, a dialog or a toolbar can rank its actions without inventing new shapes.

**Anatomy.** A pill: a 1px border on every variant (transparent where the variant has no line), side padding, an optional leading icon, the Inter 500 label at -0.01em, an optional trailing icon. The border is always there so swapping a variant never changes the box by a pixel. At xl the primary adds two layers under the label: a shifted fill drawn as an SVG path and the site's own CtaDots canvas, the same band Try now runs.

**Variants.** Primary is the navy commitment, one per view. Secondary is the outlined second choice, as the header's Sign in is. Tertiary is a white tile for actions on grey grounds, where an outline would vanish. Ghost is a quiet action inside a row or a toolbar, turning accent only as text on hover. Link is a button that looks like a link, for an action that reads as part of a sentence and still does not navigate. Destructive outlines in red for an action that loses something, and destructivePrimary fills red for the last confirmation of it. Inverse and glass belong to the accent water: inverse is white with ink, glass is a white 40% line on the water with no fill, taking white at 15% only on hover, so its white label sits on the blue itself. No variant fills with the accent ([chapter 8](#8-the-accent-rule)).

**Sizes.** xs 28, sm 32, md 40, lg 48, xl 52. Each size shares its height with one neighbour of another kind, so a row that pairs them keeps one top edge and one baseline: xs and sm with the xs and sm icon buttons and the sm and md chips, md with the md icon button, lg with the xl icon button, and xl with the lg field. No button matches the md field (44), whose partner is the lg icon button, so a form keeps its md buttons on their own row under the fields. md is the default for forms and dialogs, lg for a section's call to action, xl only for the page's one call to action, where the sweep runs. Labels step 12, 13, 14, 15, 15 and icons 14, 16, 16, 18, 18.

**States.** Rest. Hover: solid fills grow to 1.04 at lg and xl and 1.02 below, outlines firm and take a light fill, ghost and link turn accent. Focus-visible: the 2px accent ring at a 2px offset, white on the blue. Pressed: 0.97 at every size (`--ds-scale-press-pill`), and none on link, which reads as text. Disabled: 40% opacity and a not-allowed cursor, and a link drops its href. Loading: the label goes to opacity 0 and keeps its width, a centred spinner shows, aria-busy is set and clicks are ignored, so a double press cannot send twice. Selected exists only on secondary, tertiary and ghost, as a toggle with aria-pressed, and fills navy with white text on all three, the selected colour of [chapter 8](#8-the-accent-rule). In forced colours it fills `Highlight`.

**Props.** `Button`: `variant`, `size`, `leadingIcon`, `trailingIcon`, `loading`, `selected`, `disabled`, `fullWidth`, `href`, `onClick`, `type` (button by default, so a button inside a form never submits by accident), `aria-label`, `forceState` and `className`. `ButtonGroup` lays out a row of actions (`align`, `className`, and the buttons as `children`). The xl primary's sweep is `ButtonSweep`: the layer, its hook `useButtonSweep(ref)` and the band width `SWEEP_BAND`. Button wires it itself, so a page never mounts it.

**Motion.** Colour changes over 200ms on the one ease, the link's over 300ms to match the text links it sits among. The grow and the press ride the press spring (stiffness 400, damping 25), the one Try now uses, so the two cannot feel different under a finger. At xl the band crosses in 1s on the sweep curve as the pointer arrives, and also once on keyboard focus, which Try now never does. Leaving, the shifted fill fades over 300ms and the band never runs back. Under reduced motion the fill shifts at once and the band does not run.

**Accessibility.** It renders a native button, or an anchor when it has an href (a Next Link for paths from /), so Enter, Space and the context menu behave as people expect. A disabled anchor keeps its place in the reading order with aria-disabled and no href. Loading is announced through aria-busy, and the spinner inside is decorative. An icon-only action is an IconButton, never a Button with an empty label. Every size clears the 24px minimum target, and lg and up clear the 44 that a control a thumb reaches first on a phone needs, the floor in Accessibility baseline ([2.11](#211-accessibility-baseline)).

**Responsive.** The Button does not change with the viewport on its own. A view steps its buttons down one size under md, so a phone's call to action is lg rather than xl. ButtonGroup is the part that answers the viewport: under 400px it stacks to full width and reverses, so the primary lands on top where the thumb rests.

**Try now and the system Button.** Try now stays the hero's call to action exactly as shipped. The system xl primary is its working twin, with an onClick and an href, drawing the same CtaDots at the same band width and sweep time. Two things differ on purpose. Try now is padded rather than sized (14 above and below a 15px label at the page's leading, about 50 tall) with no tracking, while xl is a fixed 52 at the label's -0.01em, so it lines up with the lg field and the rest of the ladder. Its two constants live in the site's file unexported, so the system keeps its own copy of the band width beside a comment naming the source line. Changing the band or the sweep means changing both.

**Do / Don't.**
- Do give each view one primary and rank the rest as secondary, ghost or link.
- Do put the primary last in a group, on the right.
- Do use destructivePrimary only to confirm a loss already chosen with a destructive button.
- Don't place two primaries side by side.
- Don't fill a button with the accent, on any ground.
- Don't use xl anywhere but the page's single call to action.

### 7.2 Icon button

**Purpose.** An action shown as an icon alone, for the controls a page repeats or that everyone already reads by shape: close, next, back to top, the floor's next wave. The site ships three (the wave button, the player arrows, Back to top), each with its own size and none with a designed focus or press. The IconButton puts them on one ladder with one set of states.

**Anatomy.** A circle, or a pill when the label widens in. The icon at its optical centre on the ladder's stroke. An optional label span that grows from nothing beside the icon. An optional badge pinned to the top right, 4px out, for a count or a status dot.

**Variants.** Elevated is white with a hairline and the float shadow, for a button that hovers over content, as Back to top does. Outline is white at 90% with a hairline and 70% ink, the wave pill's look, for a control sitting on the grey container. Ghost has no box until hover and lives inside rows and toolbars. Solid is the navy primary in round form, for the one committing icon action in a view. Glass is white at 15% with a 25% ring and white icon, the player arrows' look, and only works on the accent water.

**Sizes.** xs 28, sm 32, md 40, lg 44, xl 48, with icons 14, 16, 18, 18 and 20. The heights match the Button's rows up to md, then step by 4, because a round target looks larger than a pill of the same height. lg (44) is the least a control a thumb reaches first on a phone takes, the floor in Accessibility baseline ([2.11](#211-accessibility-baseline)), which is why the shipped 36px player arrows move to lg as system parts, and md (40) is for rows a pointer works. No size is 36, the height of the sm field and the lg chip, so beside those an icon button takes sm (32) centred on the row.

**States.** Rest. Hover: elevated lifts 2px and lightens, outline turns its icon accent, ghost takes the open fill, glass brightens to a 25% fill and solid shifts to the hover navy. Focus-visible: the accent ring, white on blue. Pressed: 0.94 on the press spring, a deeper press than the Button's because the target is smaller. Disabled: 40%. Loading: a spinner of the icon's size takes its place, so the circle never changes size. Toggled: aria-pressed, which fills ghost, outline and elevated navy and turns glass white with a navy icon. Solid is an action and has no toggled state, because its inverse would be a white fill on a light ground, where selected is navy. In forced colours a toggled button fills `Highlight`.

**The label.** The `label` prop is required and becomes the accessible name. With `showLabelOnHover` it also widens in to the icon's left, from 0 to 80px over 200ms, the wave button's pattern, on hover and on keyboard focus alike. The shipped wave button reveals on hover only, so a keyboard visitor never sees its name. A Tooltip carries the label for icon buttons that do not widen.

**Props.** `icon`, `label`, `size`, `variant`, `selected`, `toggledIcon`, `loading`, `disabled`, `showLabelOnHover`, `href`, `onClick`, `badge` and `forceState`.

**Motion.** Colour over 200ms, the elevated lift over 300ms, the press on stiffness 400 and damping 25. A toggle with a `toggledIcon` cross-fades the two icons over 160ms (`--ds-dur-quick`) while each turns a quarter, so Menu becomes X in place. Under reduced motion the swap is instant, with no fade and no turn.

**Accessibility.** A native button, or an anchor with an href. The label is always present as aria-label, so no icon button is ever announced as "button" alone. A toggle reports aria-pressed and keeps one label ("Menu"), because a label that also flips would say the state twice. A count badge needs its own accessible name ("3 new"), because a bare numeral read after the label says nothing.

**Responsive.** The system part keeps its size at every width. Placement is the view's call: the hero puts the wave button bare under the row from md and as a pill inside the container on phones, and the players show their arrows only below lg, where the portrait fills the width.

**Do / Don't.**
- Do give every icon button a label, and keep it short and verb-led.
- Do use lg or larger for anything a thumb reaches first on a phone.
- Do use glass only on the accent water.
- Don't show toggled with the accent.
- Don't use an icon that needs its label to be understood without showing that label somewhere.
- Don't let a badge be the only place a count is announced.

### 7.3 Text link

**Purpose.** A word or phrase inside running text that takes the reader somewhere else. The site writes three by hand (the hero lede's "See what it does", the closing line's "Sign in" and the footer's legal links), and they disagree on underline offset, thickness, colour and timing. TextLink is the one spec all three become.

**Anatomy.** The anchor itself, carrying a 1px underline in the firm hairline colour. An optional trailing arrow, or an optional corner arrow for a new tab, each at 14 on the text baseline. A hidden "(opens in a new tab)" note rides with the corner arrow for screen readers.

**The one spec.** The underline sits 3px under the text below 15px and 4px from 15px up. The offset is worked out from the font size with a clamp, so a link inside any type role gets the right gap without a size prop. Thickness is always 1px, because the default thickness changes with the font and the weight, and the hero link's default reads heavier than its own lede. On hover the text and the underline both turn accent over 300ms, the slower of the two shipped timings, because a link in body copy is read rather than pressed.

**Variants.** Three tones and two forms. *Tones:* Inherit takes the colour of the line it sits in, for a link inside secondary body copy such as the hero lede. Ink sets the link in the heading navy on a muted line, the closing section's Sign in, so the one actionable word stands out from its sentence. Muted keeps the link in the muted grey, for footers and legal lines where every word is a link and none should lead.

*Forms:* Arrow adds a trailing arrow that moves 2px on hover, for a link that leads further into the same page or product. External adds the corner arrow, opens a new tab and sets rel noopener, for a link that leaves the site. A link takes one of the two at most, since each says a different thing about where it goes.

**Sizes.** None. A link takes the size of the line it sits in, and its arrows stay at 14.

**States.** Rest. Hover: accent text and underline. Focus-visible: the 2px accent ring at a 2px offset on a 2px radius, which hugs the words rather than boxing the line. Pressed: the underline thickens to 2px in the accent, so the press shows where a scale would make a line of text jump. Visited looks the same as rest on purpose: the site's links are few and repeated, and a purple one would read as a second colour system.

**Props.** `href` (required), `tone`, `external`, `arrow`, `onClick`, `forceState` and `className`.

**Motion.** Colour only, 300ms on the one ease, plus the arrow's 2px slide over the same time, small enough to keep under reduced motion.

**Accessibility.** No href means it is not a link: an action that changes the page in place is a Button (the link variant if it must look like text). The underline is always on, so the link is found without colour, which matters most in the muted tone where the contrast with the line around it is lowest. Link text names the destination ("See what it does", "Sign in"), never "here". Internal paths render a Next Link, so prefetching and client navigation work.

**Responsive.** TextLink has no breakpoints of its own. Its offset follows the line's font size, so where a lede steps from 14 to 15 at md, the underline steps from 3 to 4 with it.

**Do / Don't.**
- Do put links inside sentences and name where they go.
- Do pick the tone from the line around the link, not from the link.
- Do use the external form for anything that leaves the site.
- Don't use a link as the page's call to action.
- Don't remove the underline to make a link look cleaner.
- Don't put an arrow and a corner arrow on one link.

### 7.4 Segmented control

**Purpose.** A choice among two to four short, equal options, made in place and seen whole. The site has two: Human / AI on the accent water, with a white thumb that slides, and the jobs switch on white below xl, with a navy fill that jumps. They are one idea built twice. Segmented is that idea once, with three grounds and the keyboard model neither shipped version has.

**Anatomy.** A track: a pill with a 1px border and 3px inside it, the 4px inset the segments sit in. A border rather than a shadow ring, so the track keeps its outline in forced colours. The segments, each a label with 14px either side. The thumb: one element that sits under the chosen segment and travels to the next one when the choice changes.

**Variants.** Three grounds. Light is the jobs switch made whole: a white track with a hairline, a navy thumb and white text when chosen, the muted grey at rest. Container is for the grey hero container: a 70% white track with no line, the same navy thumb with white text, and the body slate at rest, because navy is the chosen colour on every light ground. Blue keeps Human / AI's white thumb with ink, and sets its other labels straight on the water in full white inside a white 40% line, where ModeToggle lays 15% glass under them at 80%, so a label at rest keeps the 4.49:1 that white has on the accent. White is the chosen colour on blue for the reason in the accent rule ([chapter 8](#8-the-accent-rule)), as navy is on light ones. In forced colours the thumb fills `Highlight` on every ground.

**Sizes.** The size names the segment, not the track: sm 32, md 36, lg 40, with labels at 13, 14 and 15. The track adds 8 around it, so sm stands 40 tall, close to the jobs switch, and md 44, close to Human / AI. Naming the segment lets a segmented sm line up its segments with a 32 button in the same toolbar. `equal` gives every segment the width of the widest, for options whose lengths differ but whose weight should not.

**States.** Rest. Hover on an unchosen segment: its label takes the ground's strong colour. Chosen: the thumb under it. Focus-visible: the ring around the chosen segment, which holds the one tab stop, white on blue. Pressed: the segment settles to 0.97. A disabled segment drops to 40% and the arrows skip it. A disabled control drops the whole track to 40% and takes no input.

**Props.** `options` (`id`, `label`, optional `disabled`), `value`, `onChange`, `label` (the group's accessible name), `size`, `ground`, `equal`, `role`, `thumbId`, `optionId` and `controls` for the tab role, `disabled`, `forceState` and `forceOn`.

**Motion.** The thumb slides on the thumb spring (stiffness 500, damping 40), the one Human / AI uses, on every ground. Labels change colour over 200ms. The thumb is a shared layout element, so `thumbId` must be unique among mounted controls, or motion animates one thumb between two of them. The players section mounts Human / AI twice (a desktop and a phone placement) and gives the phone copy its own thumb id for this reason. The system control makes its own unique id when none is given. Under reduced motion the thumb moves at once.

**Accessibility.** As a choice, it is a radio group: one tab stop on the chosen segment, Left and Right (and Up and Down) move the choice and wrap, Home and End jump. Selection follows focus, as a radio group's does. As a switch of content in place, it takes the tab role, and `optionId` and `controls` tie each segment to the content it shows. Human / AI is a radio group whose radios are both tab stops and ignore the arrows, and the jobs switch has tab roles with no panels or arrow keys, which is the drift the system control closes.

**Segmented or Tabs.** Segmented is for a few short options of equal weight that change a view in place, where every option should stay in sight. Tabs are for switching between panels of content, for longer labels, and for more than four options, because the tab line scrolls and a segmented control should never need to.

**Responsive.** The control keeps its size at every width. Where a phone runs short of room, the answer is fewer or shorter options, or Tabs, rather than a smaller size. The jobs switch shows only below xl, where its cards become a swipe row it names, and hides from xl, where the three cards sit side by side.

**Do / Don't.**
- Do keep options to two to four short labels.
- Do use the blue ground only on the accent water and the container ground only on the grey container.
- Do give every mounted control its own thumb id when it sets one.
- Don't let a segmented control scroll or wrap.
- Don't use it to switch whole panels of content.
- Don't show the chosen segment in the accent.

### 7.5 Tabs

**Purpose.** Switching between panels of content that share one place on the page, such as the views of an account or the parts of a report. The site has no line tabs yet. Its one tab list, the jobs switch, is a segmented control and is covered there. Tabs exist for the cases a segmented control cannot hold: more options, longer labels, and real panels for screen readers to land in.

**Anatomy.** A list: one row of tabs on a 1px hairline drawn inside its box. Each tab: an optional icon, the label, an optional count. The indicator: a 2px navy line under the chosen tab, as wide as its label. Under the list, the panel of the chosen tab.

**Why navy, and why a line.** The indicator is navy, the system's selected colour, never the accent ([chapter 8](#8-the-accent-rule)). A line rather than a fill keeps the tabs light enough to sit above dense content without competing with it.

**Variants.** One look, two activations. Auto, the default: the arrow keys move along the row and choose as they go, which suits panels that render at once. Manual: the arrows move focus only and Enter or Space chooses, which suits panels that load or cost something to show, so passing over a tab does not fetch it.

**Sizes.** sm 36 with 13px Inter labels, for a card or a panel header. md 44 with 15px Inter, the default for a page section. lg 52 with 18px Outfit at -0.01em, for tabs that head a whole page, set in the display face as the site's titles are. Labels sit 20, 28 and 32 apart. The chosen label turns to 500, and every label reserves its 500 width at rest, so choosing a tab never nudges the row.

**States.** Rest: the muted grey. Hover: ink. Chosen: ink at 500 with the indicator. Focus-visible: an accent ring drawn 2px inside the tab on a 6px radius, inside rather than out because the list scrolls and its overflow would clip an outer ring. Pressed: the label settles to 0.97 while the indicator stays put. Disabled: the quiet grey, a not-allowed cursor, and the arrows skip it.

**Props.** `items` (`id`, `label`, optional `icon`, `count`, `disabled`), `value`, `onChange`, `label` (the list's accessible name), `size`, `activation`, `panels`, `indicatorId`, `forceState`, `forceOn` and `className`.

**Motion.** The indicator slides to the new tab on the thumb spring (stiffness 500, damping 40), the same spring as the segmented thumb, so every selection mark in the system moves alike. The leaving panel fades out over 140ms while the new one fades in over 200ms with a 4px rise, overlapping so the space never empties. Under reduced motion the indicator moves at once and the panel fades without the rise.

**Accessibility.** The list is a tablist with an accessible name, each tab a tab with aria-selected, and the chosen tab names its panel with aria-controls. The panel is a tabpanel labelled by its tab and is itself a tab stop, so Tab moves from the list into the content. One tab stop in the list (the roving tabindex): Left and Right move, Home and End jump to the ends, disabled tabs are skipped. Focus leaving the list returns the tab stop to the chosen tab.

**Responsive.** The list never wraps and never shrinks its labels. When the row is wider than its box it scrolls sideways inside its own box, with no visible scrollbar, and the chosen tab is scrolled into view with 16px to spare, so a phone always shows where the reader is. The page itself never scrolls sideways.

**Do / Don't.**
- Do use Tabs for panels, Segmented for a few short options.
- Do keep labels to one or two words.
- Do use manual activation when a panel loads data.
- Don't colour the indicator with the accent.
- Don't use tabs to move between pages, which is navigation and takes links.
- Don't nest one tab list inside another's panel.

### 7.6 Chip

**Purpose.** Small interactive pills for narrowing, choosing and holding values: filtering a list by trait, picking one player type, showing the values a person has added and letting them take one back. The site does not ship any. The Chip is drawn in the site's own language, white with a hairline and navy when chosen, so it can sit beside the shipped parts without reading as an import.

**Anatomy.** A pill with 12px either side and a 6px gap. A check slot that has no width until the chip is chosen. An optional 14px icon or a 20px Avatar. The label in Inter 13 at 500. On input chips, a 20px remove circle with an X at 14 and a 24px hit area that reaches past the circle without growing the chip.

**Variants.** Three kinds, each with its role. Filter chips are toggle buttons with aria-pressed, each on or off on its own, set inside an element with role group and a label that says what they filter. Choice chips are radios with aria-checked inside a radiogroup with a label: one tab stop on the chosen chip, the arrows move the choice. Input chips hold a value, with a remove button named "Remove" plus the value, which Backspace and Delete also fire. A label that is not pressed is a Badge or a Tag, never a Chip.

**Sizes.** sm 28, md 32, lg 36. The heights match the small controls they sit beside: sm beside an xs button, md beside an sm button or a segmented sm segment, lg beside a 36 field. The label stays 13 at every size, because chips are read in rows and a row of mixed label sizes reads as mixed importance.

**States.** Rest: white, the hairline, the secondary body grey. Hover: the firm hairline and ink. Focus-visible: the accent ring at a 2px offset (on the remove button for input chips). Pressed: 0.97. Selected: a navy fill and border with white text, and the check growing in. Disabled: 40% and not-allowed. Remove-hover: the open fill behind the remove circle only, so it is clear the press removes rather than toggles.

**Why the check.** Selected adds a shape as well as a colour. A chosen chip is wider by the check, which tells a reader who cannot see the navy (or sees it in a grey ground's glare) which chips are on. The fill is navy, never the accent ([chapter 8](#8-the-accent-rule)).

**On blue.** On the accent water the chip has no fill at rest: a white 40% line round a full-white label that sits on the blue itself, white at 15% on hover, and the remove circle takes white at 25% on its hover. Selected turns white with ink, the chosen state on the water that the accent rule ([chapter 8](#8-the-accent-rule)) gives the reason for.

**Props.** `Chip`: `kind`, `selected`, `onToggle`, `onRemove`, `icon`, `avatar`, `size`, `ground`, `disabled`, `tabIndex` (set by ChipGroup), `forceState`, `className`, and the label as `children` (a string, since it also names the remove button). `ChipGroup` is the radiogroup for choice chips: `options` (each `id`, `label`, optional `icon` and `disabled`), `value` (null while none is picked), `onChange`, `label` (the group's accessible name, required), `size`, `ground`, `disabled` and `className`. `ChipInputGroup` is the set of input chips: `items` (each `id`, `label`, optional `icon`, `avatar` and `disabled`), `onRemove` (the caller drops the value from `items`), `label` (required), `size`, `ground`, `fallback` (where focus goes once the set is empty) and `className`. Filter chips need no group part, only an element that names the set.

**Motion.** Colour over 200ms. The check grows from width 0 over 200ms as the chip is chosen, so the label slides aside rather than jumping. A removed chip collapses its width and fades over 160ms, then leaves the row, so its neighbours close the gap smoothly. Under reduced motion it leaves at once.

**Accessibility.** The group or radiogroup carries the label the chips need for context ("Filter by trait"). Choice chips are one tab stop, the group owning the arrow keys. Input chips sit in a ChipInputGroup, which owns their removal: when a chip goes while focus is in the set, focus moves to the next chip's remove button, or the previous one at the end of the row, and to the field that adds values once the set is empty, so a keyboard visitor is never dropped at the top of the page. A lone Chip moves no focus of its own. The remove button's name includes the value, so "Remove The explorer" is clear out of context.

**Responsive.** Rows wrap by default at an 8px gap, because every filter should stay in view when the row is the control. A single line that scrolls sideways in its own box fits a row heading a list on a phone, where the list matters more than the filters above it. The page never scrolls sideways for a row of chips.

**Do / Don't.**
- Do keep chip labels to one to three words.
- Do label the group, not only the chips.
- Do use choice chips for one of a few, and a Select once there are more than about six.
- Don't show selected with colour alone.
- Don't fill a chip with the accent.
- Don't use a chip as a link to another page.

### 7.7 Text fields

**Purpose.** Typed answers: a work email, a studio name, a note for the testers. The site ships no field today, so Field, TextInput and TextArea are system parts drawn in its own language. A white box, a hairline strong enough to find, navy type, and the accent kept for the two moments a reader needs to locate the cursor: the caret and the focus line.

**Anatomy.** Field is the shell and owns everything outside the box: the label (Inter 13/18 at 500, -0.01em, 8px above), an optional "(optional)" in the muted grey, the helper (13/18 muted, 6px under the box), the message (13/18 with a 14px icon) and the counter (12, tabular figures, at the right of the helper's line). The box holds an optional leading icon (16, 18 at lg), the value and a trailing slot for a unit, an action button or the success check. TextInput and TextArea are the box plus the shell, and the Select trigger borrows the same box.

**Why a white box with its own line.** The site's hairline (slate 200 at 80%) is a card edge. It sits near 1.2:1 on white, which is fine for a card that is found by its content and fails for a control that is found by its edge. WCAG asks 3:1 for a boundary that tells the reader where to click. `--ds-color-line-field` (#848fa1) is the lightest slate that clears it on white (3.26:1) and on the page (3.12:1), so the field reads as a field without turning into a heavy outline.

**Variants.** TextInput for one line, TextArea for a sentence or more. Both take a helper, an error and the optional mark. TextInput adds the leading icon (only when it names the kind of value: a mail glyph for an email, never decoration), the trailing slot and the success state. TextArea adds auto-grow and a soft limit.

**Sizes.** sm 36, md 44, lg 52, with text 14/20, 15/22 and 16/24, padding 12, 14 and 16, and radius 12, 12 and 14 (`--ds-radius-xs`, then `--ds-radius-row` at lg). md is the default because 44 is the touch floor and the height of the large icon button beside it. lg shares its 52 with the xl button, so a one-line form such as the waitlist line keeps one top edge and one baseline. sm is for dense desktop tables and filters only. TextArea rests at 88, 112 and 136, three lines at each size.

**States.**
- *Rest:* white, the field line, ink value, placeholder in the muted grey (4.75:1, so a hint is still readable).
- *Hover:* the line darkens to #64748b. It changes only while the box is not focused, so moving the pointer over a focused field never flickers the focus look.
- *Focus:* the accent line and a 3px halo at 18% in place of an outline. Text fields show it on every focus, mouse included, because the caret position is the information.
- *Filled:* the rest look with a value. A field never changes colour for having a value.
- *Disabled:* the inset grey #f6f7f9, a slate 200 line and slate 400 text, out of the tab order. Use it only when the reason is visible nearby.
- *Read-only:* the inset grey with a hairline, but focusable, selectable and copyable, and announced as read-only.
- *Invalid:* the danger line #d92d20, and on focus its 16% halo with the 2px accent outline, since the halo alone barely changes the box, and a message with a CircleAlert. The message text is #b42318, the darker red at 6.57:1, so a 13px line reads as text rather than as a warning light.
- *Success:* the success green at 60% and a CircleCheck in the trailing slot, for answers checked against the server (a free studio name), never for "looks fine".

**Validation timing.** Errors appear on blur or on submit, never while the first keys land, and once shown they clear on the keystroke that fixes them, so the reader is told late and forgiven early. Forms ([9.7](#97-forms)) sets the full timing and its reasons.

**Text under md.** Below 768 every size sets its text at 16px. iOS zooms the page into any field whose text is under 16px and leaves it zoomed, which breaks the layout for the rest of the visit. The box keeps its height, so only the type changes.

**Autofill.** Browsers paint autofilled fields pale yellow or blue. The system covers that with a white inset and ink text, so a saved address looks like a typed one. The accent never stands in for autofill.

**Props.** TextInput: `label`, `hideLabel`, `size`, `helper`, `error`, `success`, `optional`, `leadingIcon`, `trailing`, `disabled`, `readOnly`, `required`, `maxLength` with `showCount`, `type`, `value`, `defaultValue`, `onChange`, `onBlur`, `placeholder`, `name`, `autoComplete`, `inputMode`, `forceState`. TextArea: `label`, `hideLabel`, `size`, `helper`, `error`, `optional`, `autoGrow`, `maxLength` (a soft limit, with its counter always shown), `touched`, `disabled`, `readOnly`, `required`, `value`, `defaultValue`, `onChange`, `onBlur`, `placeholder`, `name`, `forceState`, `id` and `className`. It has no success state, leading icon, trailing slot, `type`, `autoComplete` or `inputMode`. Field: `label`, `hideLabel`, `optional`, `helper`, `error`, `success`, `count` and `maxLength`, `labelAs`, and a render function that receives the ids.

**Motion.** The line and halo change over 200ms on the one ease. A message opens from height 0 with a 2px drop over 200ms, so the form below moves once rather than jumping. TextArea grows over 120ms as lines are added. Under reduced motion all three are instant.

**Accessibility.**
- The label is a real `label` with `for`, never a placeholder. `hideLabel` keeps it for screen readers where the context already names the field.
- `aria-describedby` lists the helper, the message and the counter that are actually rendered, so nothing is announced twice or missing.
- `aria-invalid` follows the error, and the message sits in a polite live region, so it is heard when it appears without stealing focus.
- Required fields use the native `required`. Optional ones say "(optional)" in words, because a form that marks the few optional fields is shorter to read than one that stars the many required ones.
- Typed keys stay in the field, so the floor's R reset and other page shortcuts never fire mid-word.

**Responsive.** Fields take the width of their column, capped by the form's measure (about 480). The 16px rule above is the only change across breakpoints.

**TextArea limits.** `maxLength` on TextArea is soft. A pasted draft is kept whole, the counter turns ink from 90% and red past the limit at once, and the box turns red only after the reader leaves it, with a message saying how far over it is. Cutting text silently loses the end of someone's sentence.

**Follow-ons.** Password reveal (an eye IconButton in the trailing slot that switches the type and its label), one-time codes (six single-digit boxes that move focus and accept a paste), and a phone prefix (a compact Select in the leading slot). Each reuses the box and the shell.

**Do / Don't.**
- Do put fields on the page or a white card.
- Do keep the label above the box, always visible.
- Do write the error as the fix ("Enter an email like you@studio.com.").
- Don't place a field straight on the hero container's grey #e3e5e8, where its line falls to 2.58:1.
- Don't use the placeholder as the label.
- Don't validate on the first keystroke.

### 7.8 Select and search

**Purpose.** Select picks one value from a list that is too long to show as radios. SearchField finds something by typing part of it. Neither exists on the site yet. Both open the same list panel, which is the header's language menu (LanguageMenu.tsx:78-109) made solid, so the one list a visitor has already used is the one every list looks like.

**The panel.** Solid white, a 70% slate hairline, radius 16, 6px of padding, 8px below its trigger, at most 320 tall before it scrolls, and `--ds-shadow-pop` (0 18px 50px -12px at 18% ink). Rows are 10px by 12px at radius 12, Inter 15/22 in the secondary grey, the selected row in 500 ink with a 16px check. The active row sits on a slate 100 highlight that glides from row to row. Group labels are 11px caps at 0.14em in slate 400. A disabled row sits at 40% and the keys skip it. An optional code column (the language menu's US, KR) sits at 11px semibold before the label.

**Why no blur.** The shipped menu blurs what is under it (`backdrop-blur-xl`) and blurs itself in and out. Any blur on screen breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)) for as long as it shows. At 95% white the blur adds nothing a reader can see, so the system panel is plain white and drops the filter from its transitions. The shipped menu keeps its look until the site itself is changed.

**Anatomy, Select.** The Field shell (label, helper, message), then the trigger: the md field box with the value or the placeholder and a 16px chevron in the muted grey that turns 180 degrees as the list opens. The panel opens under it at full width.

**Anatomy, SearchField.** A pill in the field's white and line, a leading 16px glass at 14px and the text starting at 40. The right edge holds one thing at a time: the shortcut chip (20 tall, radius 6, JetBrains Mono 11) while the field is empty and unfocused, the clear button (an xs ghost IconButton with an X at 14) once it holds text, or a spinner while results load. Results open in the same panel, with the letters that matched set in 500 ink.

**Variants.** Two parts on one panel, Select and SearchField. Select also renders as the native `select`, under md by default (`native` auto) or always, as Responsive explains.

**Sizes.** The Select trigger takes the field heights, 36, 44 and 52, so it lines up with the inputs in a form. SearchField runs 32, 40 and 48 with text at 13, 14 and 15, a step shorter, because it lives in toolbars and section heads beside sm and md buttons rather than in forms.

**States.**
- *Select trigger:* rest, hover (the darker line), focus (accent line and halo), open (focus plus the turned chevron), filled, disabled, read-only (inset grey, focusable, the list does not open), read-only focus (the inset grey under the focus line and halo), invalid (danger line and message), invalid focus (the danger line's halo with the accent outline) and open over an invalid trigger, all from the field box.
- *Select row:* rest, active (the highlight), selected (500 ink and the check) and disabled (40%).
- *SearchField:* empty (the chip), hover, focus (the chip hides), filled (the clear button), searching (the spinner and `aria-busy`), no results (a status row) and disabled.

**Props.** Select: `label`, `options` (`{ value, label, code?, disabled?, group? }`), `value`, `defaultValue`, `onChange`, `placeholder`, `size`, `helper`, `error`, `optional`, `disabled`, `readOnly`, `required`, `name`, `native`, `inline` with `active` (the guide's open-in-flow form), `forceState`. SearchField: `label`, `value`, `defaultValue`, `onChange`, `placeholder`, `suggestions`, `onSelect`, `size`, `loading`, `shortcut`, `bindShortcut`, `disabled`, `inline`, `forceState`.

**Motion.** The panel opens from scale 0.94 and 8px up on the pop spring (460 / 34, mass 0.7), its rows following 35ms apart from 40ms, each 4px up. It closes in 140ms ease-in to 0.97, faster than it opened, because a closing list is already the past. The highlight glides between rows on the same spring. Under reduced motion the panel only fades and the highlight jumps.

**Keyboard, Select.** The select-only combobox pattern. Focus stays on the trigger the whole time and the active row is named through `aria-activedescendant`, so a screen reader follows it without focus moving. Down, Enter or Space opens on the current value. Up and Home or End open at the ends. While open the arrows move, Home and End jump, Page keys move ten, letters typed within half a second jump to the first match, Enter or Space picks and closes, Escape closes without picking, Tab closes and moves on. A press outside closes it.

**Keyboard, SearchField.** The combobox pattern inside a `search` landmark. The arrows move through results while the caret stays in the field, Enter picks the active result. Escape clears the query, which also closes the results, and focus stays in the field so the next search can start at once. The shortcut (usually `/`) focuses the field from anywhere outside another field. Where another control owns that key, as the guide's Jump field does, `bindShortcut={false}` shows the chip without listening.

**Accessibility.** The trigger is named by the label and the current value together, so it is heard as "Player type, The explorer". Grouped options sit in `role="group"` lists named by their label. The no-results row is a polite status that names the query, so silence never stands in for an answer. Keys the list answers stay inside it, so page shortcuts never fire while choosing.

**Responsive.** Under md Select hands over to the native `select`, styled as the same trigger. A phone's own picker is larger, scrolls with momentum and knows the keyboard and the screen reader better than any panel. Group names fold into the option text there, because native groups render unevenly across phones. SearchField keeps its own results on phones, with its text at 16px.

**Choosing between them.** Two to five options that fit in view are radios or a segmented control, because a visible choice needs no click to compare. Six to about fifteen are a Select. Past that, or when the reader knows what they want by name, it is a SearchField.

**Do / Don't.**
- Do keep option labels short enough to fit the trigger without truncation.
- Do say when a search found nothing, and name what was searched.
- Don't hide two or three options behind a Select.
- Don't blur a panel or animate a filter on it.
- Don't move focus into the list. The trigger keeps it.

### 7.9 Checkbox, radio, switch

**Purpose.** Three controls for yes or no and one of a few. Checkbox is a choice submitted with a form, any number of them. Radio is one choice out of a set that is all in view. Switch is a setting that takes effect the moment it flips. The site ships none of them, so all three are system parts in its language: white marks with the field line, navy when checked.

**Why navy, never the accent.** A checked box is a state, and state is carried by the primary navy #0a152d, the same fill as a pressed button or a selected tab, as the accent rule ([chapter 8](#8-the-accent-rule)) has it. A list of ticked boxes in blue would read as a list of links.

**The glyph carries the state.** A checked box draws a tick, an indeterminate one a bar, a checked radio a dot, and a switch can show a check or a cross in its thumb. Each state differs by shape as well as fill, so it survives colour blindness and glare on a phone. Windows forced colours drop fills and keep lines and `currentColor` glyphs, so the tick and the bar stay as glyphs, while the radio's dot and a switch that is on fill `Highlight` and the switch track draws a `CanvasText` line, and each state still shows.

**Native under the drawing.** Checkbox and Radio keep a real `input` in the page, invisible and laid over the drawn mark. The browser then owns the keyboard (Space, and the arrows inside a radio set), the form value, the label click and the role, and a screen reader's focus box lands on the mark. Switch is a `button` with `role="switch"`, which has no native input to borrow.

**Anatomy.**
- *Checkbox:* the box (1.5px field line, white), the tick (lucide's check path at stroke 3, drawn with a dash offset), the label (Inter 14/20 ink, 10px from the box) and an optional description (13/18 muted).
- *Radio:* the circle (1.5px line, white), the dot, the same label and description. Its group is a `fieldset` whose `legend` is styled as a field label.
- *Switch:* the track, the white thumb inset 2px with a 0 1px 3px shadow in ink at 25%, the optional glyph, the label and description.

**Variants.** The three controls Purpose names. Radio comes as a list or as cards (`variant`), and Switch takes a light or an accent-water ground (`ground`).

**Sizes.** Box and circle 16, 18 and 20 (radius 4, 4 and 6 on the box, `--ds-radius-mark-sm` and `--ds-radius-mark`), tick 12, 12 and 14, dot 6, 8 and 9. Switch tracks are 28 × 16, 36 × 20 and 44 × 24 with thumbs of 12, 16 and 20. md is the default, matching 14px labels and the 44 field. Every row is at least 24 tall, and 32 under a coarse pointer, so a finger can hit the label as well as the mark.

**States.**
- *Checkbox:* unchecked, hover (the line darkens to #64748b and the box takes slate 50), checked (navy fill, white tick), checked hover (#0c1e42), indeterminate (navy with a bar, `aria-checked="mixed"`), focus-visible (the accent ring 2px off the box), pressed (0.92), disabled (the row at 40%), invalid (the danger line), invalid checked (the checked navy kept, since a ticked box is never the wrong one, so the group's message carries the error), read-only (the sunken box with the field line, a checked fill of the muted #64748b at 4.75:1, still focusable).
- *Radio:* unchecked, hover, checked (navy line, white centre, navy dot), focus-visible, pressed, disabled, invalid, read-only (the sunken circle, and checked a #64748b line and dot). The white centre is deliberate: a filled circle would read as a checkbox at a glance.
- *Switch:* off (the field line grey), on (navy), hover (#64748b off, #0c1e42 on), focus-visible, pressed, disabled, loading (a spinner in the thumb, `aria-busy`, the old position held), read-only (off, a sunken track drawn by a 1.5px field line #848fa1 at 3.26:1, on, a track filled the muted #64748b at 4.75:1, so the two differ by shape as well as fill, and over the water white at 15% off and 50% on), and on blue.

**On the accent water.** Off is a track of white at 25%, on is a white track with a navy thumb, and the ring is white. White marks on, for the reason in the accent rule ([chapter 8](#8-the-accent-rule)), and the navy thumb keeps the on state from reading as an empty white bar.

**Groups.** Checkboxes and radios that answer one question sit in a `ChoiceGroup`: a fieldset, a legend that asks the question, an optional helper and one error under the set. The error belongs to the set because the answer is the set ("Pick at least one job."), and the group hands its helper and error ids to every control in it. Lists stack at a 12px gap. A horizontal radio row runs at a 24px gap and stacks under 480, before a label wraps.

**Card radios.** When each choice needs a sentence, a radio card is white with the hairline, radius 28 and 24px in, the radio at its top right 16px in, a 20px Outfit title and a 14px muted line. The whole card is the target. Selected draws a 2px navy line as a 1px border plus a 1px inset, so the card never shifts by a pixel. Cards run three across from 640 and stack under it.

**Props.** Checkbox: `label`, `description`, `hideLabel`, `checked`, `defaultChecked`, `indeterminate`, `onChange`, `size`, `disabled`, `readOnly`, `invalid`, `required`, `name`, `value`, `aria-describedby`, `forceState`. Radio and RadioGroup: `legend`, `options`, `value`, `defaultValue`, `onChange`, `name`, `size`, `orientation`, `variant` ("list" or "card"), `helper`, `error`, `disabled`, `readOnly`. Switch: `label` or `aria-label`, `description`, `checked`, `defaultChecked`, `onChange`, `size`, `disabled`, `readOnly`, `loading`, `icons`, `ground`, `labelPosition`, `forceState`.

**Motion.** Fills and lines change over 200ms. The tick draws itself over 160ms on the ease. The radio dot and the switch thumb move on the thumb spring (500 / 40), the same one as the site's Human / AI toggle (ModeToggle.tsx:50), so every two-position control on the page settles alike. A pressed switch widens its thumb 4px toward the travel. Under reduced motion the tick, dot and thumb arrive at once.

**Accessibility.** Each control is labelled by its visible label. Read-only marks keep focus and say so (`aria-readonly`), because a disabled control drops out of the tab order and a reader then cannot find out what was chosen. A loading switch keeps its name and its old state until the save lands, so it never announces a setting that did not happen.

**Responsive.** Rows grow to 32 under a coarse pointer. The radio row stacks under 480 and the card row under 640. Nothing else changes with width.

**Switch or checkbox.** A switch acts now. A checkbox waits for a submit. Put a switch inside a form with a submit button and the reader cannot tell whether flipping it saved anything, so forms use checkboxes and settings pages use switches.

**Do / Don't.**
- Do write checkbox labels as the thing chosen, not as a question.
- Do put the error under the group, not under each box.
- Do keep radio sets to about five. Past that, use a Select.
- Don't fill a checked mark with the accent.
- Don't use a switch for a choice that waits for a submit.
- Don't make a disabled control the only place a chosen value shows.

### 7.10 Slider

**Purpose.** Picking a level on a range by eye: how curious a modelled player is, how wide a skill band to test. The site shows these levels as the players' trait bars (PlayerTraits.tsx), which only display. The Slider is that bar made interactive, so the control a studio would use to set a trait looks like the trait it sets.

**Anatomy.** A label row on the terminal bars' layout (JobTerminal.tsx:266-270): the label at the left in Inter 13/18 at 500, the value at the right in tabular figures, so the number holds still while it changes. Under it the rail, the navy range from the start (or between two thumbs), the white thumb, and optional ticks with optional tick labels. While a thumb is dragged a bubble above it shows the value.

**Variants.** Two grounds (`ground`, light or blue, under Values) and two forms, one thumb or a range of two, chosen by giving `value` one number or two.

**Sizes.** Rails of 2, 4 and 6 with thumbs of 14, 18 and 22. md is the default. sm sits in dense settings rows, lg in a page where the slider is the main control. Every thumb answers a 40px circle round its centre, so the smallest thumb is as easy to catch as the largest. The rail is inset by half a thumb at each end, so a thumb at either end stays inside the slider's box.

**Values.**
- *Light ground:* rail slate 200 (`--ds-color-line`), slate 300 under the pointer, range navy #0a152d, thumb white with the 1px field line and a 0 1px 3px shadow in ink at 25%, ticks slate 300 (navy inside the range).
- *Bubble:* navy with white Inter 12/16 at 500 in tabular figures, radius 8, 8px above the thumb, `--ds-shadow-tooltip`.
- *On blue:* the trait bar's own values, a white 20% rail and a white range, with a white thumb ringed 2px in navy, a white bubble with ink text, and the label in white at 75% as the trait labels are.

**States.** Rest. Hover: the rail firms and the thumb grows to 1.1, because the pointer is now over something that moves. Focus-visible: the accent ring 2px off the thumb (white on blue). Dragging: the thumb grows to 1.15 and the bubble rises, because a finger or a cursor covers the thumb and the label row is too far away to watch. Disabled: the slider at 40%, out of the tab order. Range: two thumbs that never cross, each stopping at the other.

**Props.** `label`, `hideLabel`, `value` or `defaultValue` (one number, or two for a range), `onChange`, `onCommit` (once a drag or a key press ends, for anything that should not run on every frame), `min`, `max`, `step`, `formatValue`, `size`, `disabled`, `ticks` (true, or the values to mark), `tickLabels`, `ground` ("light" or "blue"), `forceState`.

**Pointer.** A press anywhere on the track moves the nearest thumb there and starts a drag, captured so it keeps working outside the box. The track sets `touch-action: pan-y`, so a vertical swipe across it still scrolls the page on a phone and only a sideways drag moves the thumb.

**Motion.** The thumb's scale and the bubble change over 200ms on the ease. The thumb itself follows the pointer with no easing, because a lagging thumb feels broken. The shipped trait bars ease to their value over 700ms because they are shown, not handled. Under reduced motion the bubble appears without rising.

**Accessibility.** Each thumb is a `role="slider"` with its min, max, now and a spoken `aria-valuetext` from `formatValue`, so "72%" is heard as a percentage rather than a bare number. The arrows move one step, Page Up and Page Down a tenth of the range, Home and End the ends (in a range, the other thumb). Each thumb in a range is named "minimum" or "maximum" after the label. Handled keys stay inside the slider, so page shortcuts never fire while adjusting.

**Responsive.** Nothing changes with width. The 40px hit circle and `pan-y` are what make it usable on a phone.

**When to use a slider.** For a rough position the reader judges by eye, where the exact number matters less than where it sits on the range. For an exact figure (137 players, a price) use a number field, because hitting one value out of hundreds with a drag takes several tries.

**Do / Don't.**
- Do show the value in the label row, formatted as the reader says it.
- Do use ticks when the step is coarse, so the landing points are visible before the drag.
- Don't use a slider for an exact number.
- Don't put a light slider on the blue. On the accent water use `ground="blue"`, the trait bar's own colours.

### 7.11 Card

**Purpose.** A surface that holds one thing: a job, a player, a choice, a result. The site ships three card shapes and none of them is a component. The job card (Jobs.tsx) is a static article with a pointer light on its stroke, the player selector card (Players.tsx) is a pressed button that only lives on the blue, and the comparison pair (Understands.tsx) is a fixed composition. None has a focus ring, a pressed state or a disabled state. The system Card is one part that covers all three jobs and finishes the states, so the next section with cards does not invent a fourth shape.

**Anatomy.** The surface (a 1px hairline round a fill, no shadow on light grounds), then the content slots in the job card's type: a title in Outfit 20 at 500 and -0.03em, a body in Inter 14 at 1.4 in the muted slate, and an optional meta footer in mono caps over a hairline, taken from the selector card's Model 01 / Running line. A selected card adds a 20px navy disc with a white check at its top right, 16px in. The meta footer pushes itself to the card's foot, so cards in a row share a baseline whatever their copy.

**Variants.** Two axes, kept apart on purpose. `variant` is the card's behaviour: static, clickable or selectable. `tone` says where it sits: surface is the white card on the page, container is the hero container's grey for a softer card, inverse is the primary navy for the one card a view leans on (the 6labs side of the comparison), onBlue is the white card on the accent water. The site's selector card is selectable on onBlue, the job card static on surface. Folding the two axes into one list would make an onBlue card that is not a picker impossible to name.

**Sizes.** Feature (radius 28, 24 under md, padding 28 at the top and 24 at the sides and the foot, 20 at the sides on a phone) is the job card's size and the default. Compact (radius 24, padding 16) is the selector card's size below lg, its never-rendered 22 snapped to the ladder, for pickers and dense grids. Row (radius 14, padding 12 by 16, laid out in a line) is for lists. The radii come from the radius scale, so a card never sits beside a container or a field on an off-scale curve.

**States.** Rest. Hover on a pointer that can hover: the line firms to the strong slate, and a clickable card also lifts 2px with the lift shadow, because lifting says "this goes somewhere" where a pick only needs to firm. Pressed: scale 0.985 for 120ms. Selected: a navy line doubled by a 1px inset ring, so it reads as 2px without shifting the content, plus the check. Focus-visible: the accent ring 3px off the card (white on the blue). Disabled: the whole card at 40% opacity, the system's one disabled strength, and a not-allowed cursor, with the reason in the meta footer rather than in a tooltip, since a disabled card cannot be hovered on a phone. Loading: the content gives way to a skeleton composite of the same size and the card is aria-busy.

**Selection on the blue.** The site holds unpicked cards back with opacity 0.6, which fades the title, the tagline and the footer together and leaves the slate tagline under 3:1 against the faded card. Dimming only the surface does not rescue the slate, which reads no better on white at 60% over blue. So the system dims the surface to white at 60% and moves the body to ink at 70%, a colour that passes on both the dimmed card and a white one. The pick is still navy, never an accent fill ([chapter 8](#8-the-accent-rule)).

**Props.** `variant`, `tone`, `size`, `as` (article, a or button, chosen from the variant by default), `href`, `onClick`, `onToggle`, `selected`, `disabled`, `loading`, `sheen`, `inset` and `forceState`. The parts are `CardTitle` (`as`), `CardBody` and `CardMeta` (`start`, `end`).

**Motion.** The line and fill change over 200ms on the one ease, the lift and its shadow over 300ms, the sheen fades over 400ms. Colour transitions ride registered custom properties, so a gradient border animates instead of jumping. The check pops in on the thumb spring (500 / 40) from 0.6, so a pick feels placed rather than switched. Under reduced motion every transition is instant and the lift is dropped.

**The sheen without a filter.** The job card's light is a masked pseudo-element under a drop-shadow, a CSS mask and a CSS filter on a box that is always on screen, which breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)) even at opacity 0. The system sheen is three background layers on the card itself: the fill clipped to the padding box over a 260px radial light and the hairline, both clipped to the border box, under a 1.5px transparent border. Its strength is a registered number that transitions. It loses the 7px bloom, a deliberate difference from the shipped sheen. It shows for a pointer only, since a light that follows nothing would only flash on focus.

**Accessibility.** A card is one interactive element: the whole card is the link or the button, so a keyboard meets it once and a screen reader hears its whole text as the name. Nothing inside a clickable or selectable card takes focus. A selectable card is a toggle button with aria-pressed, for a single pick as for a multiple one, which is the selector card's own pattern and needs no roving focus. Inside a button the title renders as a span, because a button holds phrasing content only.

**Responsive.** The feature size steps its radius to 24 and its side padding to 20 under md. A row that scrolls sideways (the job cards below xl) clips everything outside its box, which is why a card inside one takes `inset`. Grids decide the columns, the card fills its cell.

**The index card.** `IndexCard` is the screen library's door to this system (`src/app/page.tsx`), one card that is wholly a link to `/design-system`. It takes the container look at the card size: the container grey, the faint hairline, the container shadow and radius 36 (`--ds-radius-xl`), 400 tall from md, and under md it stacks its art under its copy and steps to radius 28. The copy column, 420 at most and padded 40 (28 on a phone), holds a caps eyebrow, a heading in Outfit 40 (34 on a phone) whose last word is the site's TypedWord in the accent, one line in the body slate, the site's HeroNumbers and a pill drawn as the primary lg Button in a span, since the whole card is the link. The art beside it is the glyph field with two pinned labels. It lifts 2px with the lift shadow on hover, lights the pill on hover and on keyboard focus, presses to the card scale (`--ds-scale-press-card`) and takes the card focus ring. Props: `counts` (components, states and groups, read from the catalog by the page) and `tileStates`, so its numbers never go stale and the card never reads the guide itself. It mounts a TokenStyle scoped to itself, because the index page sits outside the guide.

**Do / Don't.**
- Do make the whole card the link or the button.
- Do dim the surface of an unpicked card on the blue and keep its text at a readable ink.
- Do put a disabled card's reason in its footer.
- Don't nest a button or a link inside a clickable card.
- Don't mark a pick with an accent fill.
- Don't lift a selectable card on hover. The lift belongs to cards that go somewhere.

### 7.12 Comparison cards

**Purpose.** The page's one direct argument with a rival: ChatGPT on the left, 6labs on the right, joined by a vs. It ships as one component, Understands, with its copy written in the file. It is a composition, not a reusable card, so the guide shows it once as it ships, and Card ([7.11](#711-card)) covers cards in general.

**Anatomy.** Two cards on a two-column grid from md, 24px apart. Each card opens with its maker's lockup, the card's heading: a 44px mark (36 on a phone) and the name in Outfit 34 at 1.1 (26 on a phone), 12px apart. Then come two lines of body text in Inter 18 at 1.5 (16 on a phone) at 400, the first 24 under the lockup and the second 12 under the first. Each line is set whole in its card's one ink, navy on the grey and white on the navy: the verbs are the same kind on both sides and the rest differs, so the pair reads as one claim answered twice. The vs is an 80px white disc (64 on a phone) with the word in Outfit 34 (27 on a phone) at ink 30%, lifted 0.07em into the disc's optical middle because the lower-case word has no ascenders, set over the gutter at the cards' middle.

**Variants.** None. It is one composition, shown once as it ships.

**Sizes.** One, with its phone steps under Responsive.

**The subgrid.** From md each card spans the grid's three rows as a subgrid. That keeps each line level with its counterpart whatever its length, so the pair reads across, row by row, the way a comparison is meant to be read. Without the subgrid a longer line on one side pushes everything below it down, and the rows drift out of step.

**Two grounds, one weight.** ChatGPT's card wears the hero container's look (the grey, a faint hairline, navy type, no shadow) and 6labs' wears the primary navy with white type, so the two sides differ in ground at a glance. White on navy reads heavier than navy on grey, so the 6labs name sits a step lighter (400 against ChatGPT's 500) for the two to look the same weight. 6labs' card also takes 64px of left padding from md, to keep its copy clear of the vs.

**The vs depends on the page.** Its 6px ring is the page colour, `rgb(var(--page-rgb))`, which makes the disc read as cut into both cards. On any ground but the page that ring shows as a band of a different grey. Moving the section onto another surface means giving the ring that surface's colour.

**States.** None. The cards are not interactive, so after the entrance they have only their rest.

**Props.** None, its copy lives in `LINES` in Understands.tsx.

**Motion.** Each card rises 28px over 0.7s on the one ease when 40% of it is in view, once: the left card first, the right at 0.15s, the vs at 0.3s, so the argument is made in reading order.

**Accessibility.** The vs may sit as light as ink at 30% on white (1.93:1) because the word is incidental: the two cards side by side, each under its maker's lockup, already say versus, so the word carries nothing a reader must read, which is the decorative exemption of WCAG 1.4.3. It is also aria-hidden, which only keeps a screen reader from saying it, and is not the reason it may be light. The cards are not interactive and carry no focus. The names look like each card's heading but are spans, and the section has no heading, so heading navigation passes over it. An h3 per name under a visually hidden h2 fixes it without changing the look. Both lines are full ink: navy `#0a1b33` on the grey `#e3e5e8` at 13.66:1, and white on the navy `#0a152d` at 18.13:1.

**Responsive.** The stacked pair keeps the vs on its seam because that is still where the two sides meet. Radius and padding both drop from 36 to 28 there, so the cards keep the proportions of the phone's other cards, and the marks step from 44 to 36, the names from 34 to 26, the lines from 18 to 16, the disc from 80 to 64 and its word from 34 to 27.

**Open decision.** The owner's rule gives sections other than the players the container look with the accent on a word or two. This section has no accent word, and its 6labs card is a full primary navy fill. Navy is not the accent, but whether a full navy surface fits the rule is [decision 5](#5-the-comparisons-navy-card) in Decisions pending ([10.3](#103-decisions-pending)).

**Do / Don't.**
- Do give the two sides two grounds, so the eye takes a side before it reads.
- Do keep the rows level with a subgrid.
- Don't set the pair on a surface other than the page without recolouring the vs ring.
- Don't use two white cards for a comparison.

### 7.13 Stats and typed word

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

### 7.14 Badge, status dot, tag

**Purpose.** Labels that never take a press. A Badge names a status, a live state or a count. A StatusDot confirms a state beside the words that name it. A Tag says what something is or holds. The site has each of these inline (the selector card's Running / Ready line, the hero's pinging social-proof dot, the job cards' skills list) and none as a part, so the system builds all three in the site's own type.

**Anatomy.**
- *Badge:* A pill at radius full, 18px tall at sm and 22 at md, with 6 / 8px of side padding and a 6px gap to an optional dot. The label is JetBrains Mono 11 in caps at 500, tracked 0.08em at sm and 0.12em at md, the selector card's meta voice, so a badge reads as a machine label and never as a sentence. The count form is its own shape: an 18px navy pill in Inter 11 at 600 with tabular figures, pinned 4px past the top right of its parent, printing 99+ past 99.
- *Tag:* A line icon at 16px and stroke 1.75 in the accent, a 10px gap, then the label in Inter 13 at 20 in ink. In a TagList the tags sit in the job card's panel: the sunken grey, a hairline, radius 12, padding 14 by 16, two columns at a 16 / 12 gap that drop to one under md.
- *StatusDot:* a 6 or 8px disc, and for the live ping a halo of the same size round it.

**Variants.** Badge tones: Neutral is the slate on the light slate fill, for a plain state such as Ready. Live is white with a hairline, ink text and the pulsing accent dot, for something running now. Success, warning and danger sit on 8% tints of their own colour, quiet enough to stand beside the navy and the accent without competing. Inverse is navy for a badge that must stand out on white. onBlue is white at 15% with a 25% line, for the accent water. Tag forms: The pill form stands alone on a surface at 28px tall, white with a hairline. The plain form has no box and runs inline. The dot's kinds are under The status dot.

**Contrast on the tints.** The labels are small, so each tone needs 4.5:1. Neutral, warning and danger clear it on the page. Success on its tint over the page falls just short, and the white onBlue label on its glass is well under it. Both are open in the system part. Until they are fixed, set a success badge on a white surface, where its tint just clears 4.5:1, and keep onBlue badges to a word or two that the copy around them also says.

**Sizes.** sm for dense rows and table cells, md as the default. 18 and 22 are off the 4px grid on purpose: a badge is measured by the row it sits in, and each centres on whole pixels there, 7 above and below in a 32 row and 9 in a 40.

**States.** None. A badge, a dot and a tag never take a press, so they have no hover, focus or pressed look, and a label that needs one is a Chip.

**The status dot.** Live ping is the hero's pair exactly: an accent core under an animate-ping halo at accent 40%, 8px. Live pulse is the selector card's running dot, 6px, fading on animate-pulse. Idle is the strong slate, success and danger the status colours. The dot is decorative (aria-hidden), so the words beside it always carry the status.

**Props.** Badge: `tone`, `size`, `dot`, `pulse`, `count`, `pinned`, `label`. StatusDot: `size`, `tone`, `motion`. Tag: `icon`, `variant` (pill or plain). TagList: `items`, `columns`, `panel`, `label`.

**Motion.** Only the live dots move: the ping's halo on animate-ping and the pulse's fade on animate-pulse. Both stand still under reduced motion, which the shipped ping and pulse do not. Badges and tags never move.

**The status dot and the accent.** The live dots fill with the accent on light grounds, which is pending: [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)). The hero's ping is the site's own, and the system's dots wait on the call, as the accent rule ([chapter 8](#8-the-accent-rule)) lists them. A badge never fills with the accent at any size.

**The icon is data.** The job cards look each icon up by its label (TAG_ICON in Jobs.tsx), so a new tag with no entry quietly renders no icon. The system TagList takes the icon as a field of each item. A tag with no icon is then a choice that is visible in the data, never a lookup that missed.

**A clickable tag is a Chip.** A tag that filters, toggles or removes something needs a press, a pressed state and a focus ring, which is what the Chip is. A Tag has none of those, so a row of tags used as filters reads as broken.

**Accessibility.** A count needs `label` ("3 new"), since a bare number gives a screen reader nothing to say. A badge inside a control adds to that control's name only if the control has no aria-label of its own. A TagList is a real list, so a screen reader announces how many tags it holds.

**Responsive.** The two-column TagList drops to one column under md, so a narrow card never squeezes two labels into a line. Badges and dots do not change with the viewport.

**Do / Don't.**
- Do name a status in words and let the dot confirm it.
- Do give a count badge its accessible name.
- Do pass each tag's icon with the tag.
- Don't use a Tag where a person is meant to press it.
- Don't fill a badge with the accent.
- Don't show a status dot alone.

### 7.15 Avatar

**Purpose.** A person or a player model in small form: in a list of testers, on a model's record, in a group of players a studio follows. The site has no avatar yet, but it has the pictures an avatar shows, the tiles' characters and their AI copies, so the system builds the part in the site's own grounds.

**Anatomy.** The face fills the box: the picture cropped to cover, or the initials in Outfit 500, ink on the container grey, on the type scale by size (`--ds-text-*`): 11 at 24, 13 at 32, 16 at 40, 20 at 48, 26 at 64 and 34 at 96, and none at 20. An optional status dot sits at the bottom right, a quarter of the size and never under 6px, ringed 2px in the page colour so it reads as cut out of the face.

**Variants.** Two shapes. A circle is a person. A rounded square at 28% of its size is a player model. The site's whole story is a human and the model made of them, so the shape tells the two apart before any picture has loaded and without colour. An AI copy keeps the model's square and sits on the primary navy, because its hologram is a light blue that would wash out on the grey.

**Sizes.** 20, 24, 32, 40, 48, 64 and 96. 20 and 24 sit in a dense row or beside a chip label, 32 and 40 in lists and cards, 48 and 64 on a record, 96 on a profile. The initials step with the face, and at 20 there are none, because two letters in a 20px face read as a smudge, so it shows the picture or the person icon. Below 32 prefer the picture.

**Fallbacks.** The picture fades in over 200ms once it has loaded, so a slow image never pops. If it fails, the face falls back to the initials, and without a name it shows a person icon in the muted slate. The slot never shows a broken image or an empty circle.

**Status.** Live is the accent, pending [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)), online is the success green, idle is the strong slate. The status is spoken after the name ("Person one, online"), so the dot is never the only carrier.

**States.** As a button (with `onClick`) the avatar rings 2px in the strong slate on hover, presses to 0.94 (`--ds-scale-press-round`), takes the accent focus ring 2px off its own shape, and fades to 40% when disabled. A plain avatar has no states.

**Group.** Faces overlap by a quarter of their size, each ringed 2px in the page colour so the edges stay read where they cross. A group shows four at most and then a +N disc in the light slate fill with the count in Inter 12 at 500, so the row keeps one length whatever the list's size. The group is named as a whole ("6 players") and the disc says how many it stands for.

**Props.** Avatar: `name`, `src`, `size`, `shape`, `fill`, `status`, `onClick`, `disabled`, `ringed`, `forceState`. AvatarGroup: `people`, `size`, `shape`, `max`, `label`.

**Motion.** The picture fades in over 200ms once it has loaded. A clickable avatar's ring and press change over the same 200ms on the one ease. Nothing else moves, and under reduced motion the picture appears at once.

**Accessibility.** A plain avatar is an image named by the person or model (role img with an aria-label), and its picture is decorative inside it, so the name is read once. A clickable avatar is a button with the same name. A group is a labelled group, so a screen reader can skip it whole.

**Responsive.** One face fewer on a phone keeps a group of 40s inside a narrow card. The avatar itself does not change with the viewport.

**Do / Don't.**
- Do give every player model the rounded square.
- Do pass a name even with a picture. It is the accessible name and the fallback.
- Don't show a model in a circle.
- Don't show more than four faces in a row.

### 7.16 Section head

**Purpose.** The light page's heading, written twice on the site as raw markup (Jobs "One model. Three jobs." and the FAQ's "Questions, answered.") and once more in the closing line at a larger size. The system SectionHead makes it one part, so the accent rule and the entrance are applied the same way everywhere.

**Anatomy.** An optional eyebrow, then the heading line in navy with its closing words in the accent, then an optional subline. The eyebrow is Inter 11 at 500 in caps, tracked 0.18em, 12px above the line. The subline is Inter 15 (16 from md), snug, in the muted slate, at most 520px wide and 16px under the line.

**The accent rule.** The accent takes the closing word or two, never the whole line. A sentence stresses its end, and the navy before it is what makes the accent read as stress. A fully blue line has nothing to stand against, and on a page whose one accent fill is the accent water, a blue line also starts to read as a surface. The accent is a node, so a TypedWord can sit in it and type the stressed words in.

**Variants.** Two alignments and two grounds. Start by default, matching the sections' left edge. Centred for a closing or a standalone moment, where the subline centres with it and balances its lines. `ground` is the page or the container, and on the container the subline takes the body slate, for the reason under The subline.

**Sizes.** h2 (Outfit 30, 44 from md, 500, leading 1.1, tracking -0.025em) heads every light section. Display (clamp(38px, 5.2vw, 74px), leading 1.05, tracking -0.045em) is the closing line's size, once a page, where the heading is the last thing said rather than a label for what follows. The tighter tracking at display keeps the large letters from spreading apart.

**The subline.** One sentence that says what the section gives, never a second heading. It is slate on the page and steps to the darker body slate on the container grey, where the lighter one falls under 4.5:1.

**The eyebrow.** A short label above the line for a page with many sections of one kind. It uses the muted slate rather than the scroll cue's quiet slate-400, because at 11px caps it needs 4.5:1 and slate-400 gives about 2.5:1 on the page.

**States.** None. A section head is read, never pressed, so it has no hover or focus of its own.

**Props.** `title`, `accent`, `accentBreak`, `sub`, `eyebrow`, `size`, `align`, `as` (h2 or h3), `ground`, `rise`, `id`.

**Motion.** With `rise` it enters as Jobs does: 28px up over 0.7s on the one ease, once a quarter of it is in view, once. The FAQ head ships without it. The system applies it to every section head, so no section arrives differently from its neighbours. Under reduced motion it appears in place.

**Accessibility.** It renders one real heading, h2 by default, so the page outline stays a list of sections. The accent is a span inside the heading, so the line is read as one sentence. Give the heading an `id` and point the section's aria-labelledby at it.

**Responsive.** The steps live in the type roles, the line and the subline both at md, so a section head needs no breakpoint of its own. The display size is fluid between its bounds and has no step.

**Do / Don't.**
- Do put the accent on the closing word or two.
- Do keep one sentence of subline.
- Do use the display size once a page.
- Don't colour the whole line.
- Don't stack an eyebrow, a heading and a subline that all say the same thing.

### 7.17 Traits and progress

**Purpose.** Showing an amount. The site ships one kind, the player's trait bars on the blue, which show a profile rather than progress. The system adds a progress family for work that advances (a model being built, a run of tests, an upload) with the semantics the trait bars lack.

**The trait bars.** PlayerTraits draws four rows: a label in Inter 14 at white 75% in a 130px column, then a 6px track at white 20% with a white fill at the trait's value. Rows sit 16px apart (10 in the carousel's dense form, with a 124px label column and 13px labels). When another player is picked the fills slide to the new values over 0.7s on the one ease, so the change reads as the same four measures moving rather than a new chart. They have no grow-in on first mount. They carry no meter role and no value, so a screen reader hears each label followed by an empty description. That is a known gap: a meter role with aria-valuenow from 0 to 100 would fix it without changing the look.

**Anatomy.** An optional label row (the name in Inter 13, the value or status at its end), then a round rail with a round fill. The circle draws the same rail and fill as two rings.

**Variants.** Three grounds (`variant`). Light takes a rail of ink at 8% and a primary navy fill, navy and not the accent because a bar is a fill ([chapter 8](#8-the-accent-rule)). Blue takes the trait bar's white on white 20%, and dark the terminal's white 40% on white 8%. Two shapes, the bar and the circle, and the bar can split into segments (States below).

**Sizes.** Bars stand 2, 4, 6 and 8 tall. 2 under a header or a card's edge, 4 as the default, 6 to match the trait bars on the blue, 8 for a page-level step. The circle comes at 16, 24, 40 and 64 with strokes of 2, 2.5, 3 and 4, so the ring keeps its weight as it grows. From 40 it can print its value in the middle.

**States.** Determinate: the fill shows the value. Indeterminate: a 35% segment runs across the rail, and aria-valuenow is left out, since an invented number is worse than none. Complete: the fill turns the success green (white on the blue, where the label says it). Error: the danger red, and the value text says where it stopped. Paused: the fill turns the muted slate on light grounds (white at 50% on blue, 20% on dark), so the amount done still reads, and an indeterminate segment holds where it is. Segments split the rail into steps filled whole, for a count of stages where a percentage would mislead.

**Words, not only colour.** The value text names every state in words: "35%", "Complete", "Failed at 60%", "Paused at 35%". It is the aria-valuetext as well, so the status is never carried by colour alone. On the blue, where green and red would lose against the water, the words are the only status carrier.

**Props.** Two exports. `Progress`, the bar: `value`, `max` (100 by default), `label` (required), `showLabel`, `showValue`, `size` (2, 4, 6 or 8), `variant` (light, blue, dark), `indeterminate`, `status` (complete, error, paused), `segments` and `className`. `ProgressCircle`, the ring: `value`, `max`, `label`, `size` (16, 24, 40 or 64), `variant`, `indeterminate`, `status`, `showValue` and `className`, with no segments and no visible label row, since the label is its accessible name.

**Motion.** The determinate fill eases its width over 700ms on the one ease, the trait bars' time, so all bars on the site move alike. The indeterminate segment crosses the rail by transform alone over 1.4s. Under reduced motion the determinate fill jumps to its value, the indeterminate segment rests at the middle of the rail, and the circle's arc stands still. The label still says what is happening.

**Accessibility.** role progressbar with aria-valuemin, aria-valuemax and aria-valuenow (left out when indeterminate), aria-valuetext as above, and aria-busy while indeterminate work runs. The label is required: a bar with no name says only that something is happening.

**Responsive.** A bar fills its container's width. The trait bars switch to their dense form inside the carousel below lg.

**Do / Don't.**
- Do show the amount when it is known, and run the indeterminate segment only when it is not.
- Do name a failure and where it stopped.
- Do keep bars navy on light grounds.
- Don't fill a bar with the accent.
- Don't leave a bar without a label.

### 7.18 Player carousel

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

### 7.19 Terminal

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

**Performance.** A waiting terminal runs its ASCII field on an animation frame loop while it is on screen, and the loop ends once the run has faded the field out. A view should hold as few idle terminals as it can. The hint's soft shadow is a pre-blurred SVG picture, not a CSS drop-shadow, under the compositor-safe rule ([5.13](#513-compositor-safe-rule)).

**Gaps.** The height is fixed with no scroll, so a longer run clips at the foot. There is no replay control, no failed or warning step kind and no light theme. The timings are module constants JobTerminal does not export.

**Do / Don't.**
- Do keep a run inside the body, about eleven lines with its gaps.
- Do put the accent on the answer only.
- Don't add a shadow, a title or controls to the window.
- Don't mount several idle terminals in one view.

### 7.20 Accordion

**Purpose.** Rows that open in place to their content. The FAQ is the shipped case: ten questions, each answered under its own row, so a reader scans the questions and opens only what they need. The Accordion is that row as a component, for any list of questions or details, with the focus, ARIA and states the FAQ lacks.

**Anatomy.** A list of items. Each item is a heading holding one button, the trigger, which spans the row: the title at the left and the icon at the right. Under it, while open, the panel: the content in Inter at leading 1.6 in the secondary body colour, capped at 680 so a long answer keeps a reading measure inside a wide row.

**Variants.** Card is the FAQ row as it ships (white, radius 14, a hairline that firms on hover and while open, rows 10 apart), for a list standing on the page ground. Flush drops the card and divides rows with a light rule and no side padding, for a list inside a white panel, where white cards would read as boxes in a box. The icon is a plus that turns into a minus, the FAQ's and the default, because the minus says what the next press does. The chevron that turns over is for lists of details rather than questions.

**Sizes.** md is the FAQ row: 64.75 tall closed, from its 18px question at leading 1.375. sm (48) suits a narrow panel or a sidebar and lg (76) a page where the list is the main content. All three keep the same ratio of padding to type.

**States.** Closed. Hover: the hairline firms. Pressed: the row tints while held. Focus-visible: an accent ring on the card row's own radius, or round the trigger when flush. Open: the hairline stays firm and the icon turns. Disabled: 40% opacity, as every disabled part takes, not-allowed, no hover. Loading: open, with three skeleton lines in place of the content and aria-busy on the panel. No state moves the row except opening it, because a row that shifted on hover would slide the next row under the pointer.

**Single and multiple.** Multiple is the default and the FAQ's behaviour: each row opens on its own. Opening a row should not close one the reader may still be reading, and closing it would shift the list under the pointer. Single fits rows that are steps of one task, where only the current step matters.

**Props.** `items` (`id`, `title`, `content`, optional `disabled` and `loading`), `type`, `defaultOpen`, `size`, `variant`, `icon`, `headingLevel`, `forceState` (applied to the first item, for the state grid) and `className`.

**Motion.** The panel opens and closes by height and opacity over 350ms on the one ease, the icon turns over 300ms and the hairline changes over 300ms. Rows in `defaultOpen` render open without animating, so nothing moves on page load. Under reduced motion the panel opens at once.

**Accessibility.** The trigger is a real button inside a heading (h3 by default, `headingLevel` fits it to the page outline), with aria-expanded and, while open, aria-controls naming its panel. The panel is a region labelled by its trigger while the list has six items or fewer, because more regions than that crowd the landmarks list. Up and Down move between triggers, Home and End jump to the ends, Enter and Space toggle. A disabled row is skipped by Tab and by the arrows. The shipped FAQ has aria-expanded and nothing more: no focus ring, no aria-controls and no region.

**Responsive.** Under md the card takes the FAQ's phone step: rows 8 apart, padding 16 by 20, the question at 16 and the answer at 14. lg steps down by one size. The steps follow the viewport, so the Accordion and the FAQ change together on one page.

**Do / Don't.**
- Do use multiple for a FAQ.
- Do use card on the page ground and flush inside a white panel.
- Do write each title as a full question or label, since it is the heading screen readers list.
- Don't use single where rows are independent answers.
- Don't nest an accordion inside another's panel, where the arrow keys and the heading levels stop matching.

### 7.21 Spinner and skeleton

**Purpose.** Two ways to wait, chosen by what is coming. A spinner says "working" where the result has no shape yet: a control that sent something, a step in the terminal run. A skeleton says "this is on its way" where the result has a known shape: a card, a row, a profile. The site hand-rolls two spinners today (the wave button's 16px ring at HeroBits.tsx:114 and the terminal's 8px ring at JobTerminal.tsx:216) and no skeleton. The system Spinner replaces both rings with one part, and the Skeleton fills the gap. The brand loader, HeroLoader, is neither: it is the page's own load-in and belongs to Load-in, autoplay and loaders ([5.6](#56-load-in-autoplay-and-loaders)), never to a control or a card.

**When to use which.** A wait inside a control is a spinner, in place of the label, so the control keeps its size and stays the one thing that changed. A wait for a region of content is a skeleton of that content, so the layout settles once and the eye already knows where to look. A wait for the whole page is the brand loader. A wait longer than a few seconds needs words as well (a status line, a progress bar), because a ring that turns for ten seconds stops meaning anything.

**Anatomy.** Spinner: a circle with a currentColor border and a transparent top, plus a hidden "Loading" when it stands alone. Skeleton: a filled block in the shape and size of what it replaces, with a band of light crossing it. A composite is several shapes laid out like the real part, line for line.

**Variants.** Spinner tones: inherit takes the text colour, so a ring in a navy button is white and a ring in ink text is ink. Quiet is slate 400, for a ring under a caption. On dark is white at 80%, for navy and the terminal. Skeleton shapes: line, title, circle and rect, and a ground of light (white and the page) or container (the hero grey, where the fill turns to white at 55% because the slate fill would vanish).

**Sizes.** Spinner 8, 12, 16, 20 and 24, with borders 1, 1.5, 1.75, 2 and 2, so the stroke reads at about the same weight at every size. 8 sits inline with mono terminal text, 12 and 16 in xs to md controls, 20 in lg and xl controls and fields, 24 alone in a section. Skeleton line is 12 tall for 14 to 15px text, title 22 at 60% width, circle 40, rect 120 at the panel radius 16. A composite overrides height and radius to match its content (the job card's terminal block is 300 tall at 16).

**States.** Spinner: waiting (its first 300ms, drawn at opacity 0), spinning, and slowed under reduced motion. Skeleton: shimmering, still under reduced motion, and gone once the content lands. Neither is interactive, so neither has hover, focus or pressed.

**Props.** Spinner: `size`, `tone`, `delay` (300 by default, 0 for a control that is already busy), `label`, `decorative`. Skeleton: `shape`, `width`, `height`, `radius`, `lines`, `ground`. SkeletonGroup: `label` and the composite as children.

**Motion.** The ring turns at 1s a turn, linear, as the site's rings do. The 300ms delay is the reason a fast response never shows a ring at all: the eye reads a flash shorter than that as a glitch. The shimmer is a 40% band moved by transform from -100% to 250% over 1.6s, so it stays on the compositor (an animated background position would repaint every frame). Content replaces a skeleton with a 300ms fade.

**Reduced motion.** The ring keeps turning at 1.5s a turn rather than stopping, because a stopped ring reads as a finished one and the motion here carries the status. The shimmer stops and the fill stays, because the shimmer only decorates.

**Accessibility.** A standalone spinner is a polite status with a hidden label, so a screen reader hears "Loading" once. Inside a busy control it is decorative and the control carries aria-busy, so the status is announced on the thing that is busy. Skeleton shapes are aria-hidden, and their group is aria-busy with a hidden label, so a screen reader hears that the region is loading rather than a run of empty shapes. When the content arrives, the group drops aria-busy and the content is read as normal.

**Responsive.** Neither changes with the viewport. A composite follows its part: a job card skeleton takes the card's own phone radius and padding because it is built inside the same Card.

**No layout shift.** A skeleton is only worth its cost if the swap moves nothing. Each skeleton line sits in a box the height of the text line it stands for (a 12px bar in a 19.6px box for 14px text at 1.4), so the composite and the content measure the same. Where the content's height is truly unknown (a free-length answer), reserve the expected height and let it grow below the fold rather than above it.

**Do / Don't.**
- Do build a skeleton from the real part's layout, so the swap moves nothing.
- Do put the spinner inside the busy control, never beside it.
- Do keep the 300ms delay unless the control has already changed state.
- Don't show a lone spinner in a large empty box, which tells the visitor nothing about what is coming.
- Don't run a skeleton shimmer under reduced motion, or pulse it instead.
- Don't use the brand loader for anything smaller than the page.

### 7.22 Empty state

**Purpose.** What a view shows when there is nothing to show: it has no content yet, the search or filter found nothing, it failed to load, the visitor is offline, or the visitor may not see it. The site has none today. Every one of these moments is a place a visitor can leave, so the part's whole job is to explain what happened in a line and offer the next step.

**Anatomy.** A centred column at most 400 wide: an icon (24px in a 48px white circle with a hairline) or the 44px brand mark for a brand moment, a title in Outfit 20 at 500 and -0.03em, a body in Inter 14 at 1.5, and an actions row. Contained, the column sits in the container look at the card size: the #e3e5e8 grey, radius 36 and the faint hairline, with no shadow, at 48 padding. The radius stays 36 at every width, since the part answers its own box and only its padding steps down. Uncontained, it sits bare inside a card, at 40 by 24.

**Variants.** firstUse invites the visitor to make the first thing (Inbox icon). noResults names what was searched and offers the way back, usually Clear filters as a secondary (SearchX). error says what failed and that nothing was lost, with Try again as a secondary and a support link, and its icon turns danger ink, the only tint the part carries (CircleAlert). offline says what needs the connection and that the view recovers on its own (WifiOff). noAccess says whose the content is and how to get in (Lock). The variant only picks the icon, so a new case never needs a new variant, just new words.

**Copy.** The title names the state in plain words ("No sessions match ‘refund’", not "Oops"). The body gives the reason or the way on in one or two short sentences. The primary action fixes the cause where it can (Clear filters, Try again, Sign in), and the secondary is a link to help. Never blame the visitor and never leave the view without an action, except offline, where the body says it recovers by itself.

**Sizes.** One size, which adapts to its own width: under 560 the padding drops to 32, and under 400 the actions stack, the primary on top and full width.

**States.** Static, and the action's own states. A retry shows its work in the button (loading), and the message holds still, so the visitor sees the attempt rather than a flicker of the whole view. If the retry fails again the part stays as it was, which is the honest result.

**Props.** `variant`, `title`, `body`, `primaryAction` (one md Button), `secondaryAction` (a TextLink or a secondary Button), `contained`, `icon`, `mark`, `headingLevel` (3 by default, one level under the view's own heading) and `announce`.

**Motion.** It rises 12px and fades in over 500ms on the one ease when it mounts, transform and opacity only, so an empty view arriving after a load reads as a result rather than a gap. Nothing moves under reduced motion.

**Accessibility.** The title is a real heading at the level the view needs, so the empty state can be found by heading navigation. The icon is decorative. The body is #475569, not the site's #64748b, because #64748b reads 3.77:1 on the container grey and fails AA at 14px, while #475569 holds 6.0:1. Set `announce` (role alert) only when the empty state replaces content after the visitor's own action, such as a search that returns nothing. An empty state that is simply there on arrival is read in the normal order.

**Responsive.** It sizes from its own width (a container query), not the window's. The same part sits in a full page column and in a narrow card on a wide screen, and only its own width says how much room it has.

**Do / Don't.**
- Do end every empty state on one action that moves the visitor forward.
- Do name the query in a no-results title, so the visitor can see what to change.
- Do keep the body at #475569 on the container grey.
- Don't contain it inside a card, which already draws an edge.
- Don't use an illustration in place of the words.
- Don't give an empty state two primaries.

### 7.23 Tooltip

**Purpose.** A short label for a control that shows only an icon, or for a line cut short. The only stand-in on the site is the wave button's "Next wave", which widens in on hover (HeroBits.tsx:105) and never shows on keyboard focus or touch. A tooltip makes the same words reachable from a keyboard. It is never the only place a fact lives: the words are also the control's accessible name, and anything longer belongs on the page.

**Anatomy.** A bubble of navy #0a152d with white Inter 12/16 at 500, padding 6 by 8, radius 8, at most 240 wide, and the tooltip shadow. An optional shortcut sits 6 after the words in mono 11 at white 50%. An optional 8 × 4 arrow points at the trigger. It sits 8 from the trigger.

**Variants.** Four sides, top by default. Default navy for every light ground, and inverse (white with ink words) on the terminal, where a navy bubble would sink into the dark window. The arrow is off by default because the site's pills and panels are clean shapes with no tails. Turn it on where a bubble could be read as belonging to the wrong one of several close triggers.

**Sizes.** One. The bubble grows with its words up to 240 wide, and nothing in it steps with the viewport.

**Placement.** The live bubble is placed against the viewport with an 8px collision margin. If it would cross the edge on its side and the far side has room, it flips. Then it slides along the edge to stay inside, and the arrow moves to keep pointing at the trigger's centre.

**States.** Hidden, entering, open and leaving. It opens 400ms after the pointer arrives, so a pointer crossing the page does not set off labels. Within 600ms of one tooltip closing, the next opens at once, so moving along a row of icon buttons costs one wait. Keyboard focus opens it at once, since a keyboard visitor has already chosen the control. It closes when the pointer leaves (after a 100ms grace to cross onto the bubble), on blur, on a press of the trigger and on Escape. On scroll and resize it moves with its trigger, and closes once the trigger leaves the viewport.

**Props.** `content`, `side`, `delay`, `shortcut`, `arrow`, `tone`, and the trigger as `children`. `open` and `forceState` are for the guide only: they draw the bubble in place with no hover, portal or listeners.

**Motion.** In: opacity, a scale from 0.96 and 4px of travel from the trigger's side over 160ms (`--ds-dur-quick`) on the one ease, so the bubble seems to come out of the control. Out: 120ms of opacity (`--ds-dur-press`) on the ease in, faster than in, because a leaving label should never hold the eye. Under reduced motion it fades only.

**Accessibility.** The bubble has role tooltip. The trigger is described by it through aria-describedby, unless the words are already the trigger's aria-label, which is the usual case for an icon button. Then the description is skipped so a screen reader does not read the name twice. It follows WCAG 1.4.13: hoverable (the pointer can move onto the bubble without it closing), dismissable (Escape closes it without moving focus or the pointer, and Escape is used up so a dialog around it stays open), and persistent (it stays until one of those happens). It holds no links or buttons, because it cannot be reached by Tab.

**Touch.** Touch opens nothing. A long press is the system's own gesture on phones, and a tooltip that needs one is a label the visitor will not find. So on touch the control's name must stand on its own, which is the same rule that keeps the tooltip from being the only route to the words.

**Layering.** The live bubble goes into a portal at fixed coordinates, so no panel's overflow clips it. The portal is the body, or the open dialog the trigger sits in, because a modal dialog lives in the browser's top layer and would cover anything outside it. Outside a dialog it takes the top of the z-scale, 70.

**Responsive.** It does not change with the viewport. Placement does the work at every width.

**Do / Don't.**
- Do give every icon-only control a tooltip with the same words as its name.
- Do keep the words to a short label, a few words at most.
- Do use the inverse bubble on the terminal.
- Don't put a tooltip on a control whose label is already visible.
- Don't put links, buttons or anything a visitor must read to go on inside a tooltip.
- Don't open a tooltip on touch.

### 7.24 Toast

**Purpose.** A short, passing word that something happened: a link copied, a run saved, an answer that failed to load. The site has none today, and its locked controls give no feedback at all. A toast confirms an outcome the visitor caused without taking them away from what they were doing. It is never the only record of an outcome that matters: a saved run also shows in the list, a failed answer also shows in its own view.

**Anatomy.** A navy #0a152d panel at radius 16, the terminal window's, with padding 14 by 16, a 52 minimum height and the float shadow. Left to right: an 18px status icon, the title (Inter 14/20 at 500, white), an optional body under it (13/18 at white 75%), an optional text action (13 at 500 in the lifted accent #6ea8ff, white on hover) and a 28px close.

**Variants.** Four tones. Success takes a CircleCheck in #5fd38d, error a CircleAlert in #ff8a80, info an Info in #6ea8ff, and loading a 16px spinner in white at 80%. The tones change only the icon and its colour, each lifted so it reads on navy, and never the panel. A colour that only works on white (the danger red #d92d20, the accent #1a6dff) would fail on navy.

**Sizes.** One. A toast stands at least 52 tall in its column and grows with a body line. The column's width is under Placement.

**Placement.** Bottom centre, 24 up, at min(420px, 100vw - 32px) wide. Under md the stack spans the width, and BackToTop sits at bottom 16 right 16 as a 40px disc, so the stack rises to 64 plus the safe area and clears it by 8. From md the 420 column is well clear of BackToTop at bottom right. Bottom centre keeps the stack away from the header and from the hero's top-left copy.

**Stacking.** Three at most on screen, the newest nearest the edge. The older ones tuck 8 up behind it, each step 0.04 smaller and 0.1 fainter, so a burst reads as one object. Hover or focus inside fans them out 8 apart. A fourth waits until one leaves.

**Timing.** 5s on screen. A toast with an action stays until it is dismissed, because its only keyboard path is the hotkey and no timer can know how long a visitor needs to reach it (WCAG 2.2.1). Errors and loading never leave on their own either: an error may need the visitor, and loading turns into success or error in place. Hover or focus inside the stack holds every clock, so a toast never leaves while it is being read.

**States.** Entering, visible, held (hover or focus), leaving, swiped and, for a task, loading turning into success or error in place. The action and the close each have rest, hover, focus-visible and pressed.

**Props.** `toast({ tone, title, body, action, duration })` returns an id. `toast.update(id, patch)` changes a toast in place and restarts its time, `toast.dismiss(id)` removes it, and `toast.promise(work, { loading, success, error })` runs the loading-to-result pattern. Mount `Toaster` once near the root, and `TOAST_HOTKEY` names its key. The `Toast` part itself takes `tone`, `title`, `body`, `action` and `onDismiss`. `ToastStack` draws the stack the Toaster holds: `items`, `onDismiss`, `live` (timers and swipe, off for a still stack in the guide), `expanded` (held fanned out), `hotkey` (written on the front toast's first control) and `className`. A page never mounts ToastStack itself.

**Motion.** In: 16px up, from scale 0.98, with opacity, on the pop spring (stiffness 460, damping 34, mass 0.7), the spring the site's menus open on. Out: 8px down and fading over 160ms on the ease in. The stack's shifts ride the same spring. Under reduced motion every change is a 140ms fade (`--ds-dur-exit`).

**Accessibility.** The Toaster mounts two hidden live regions before any toast exists: a polite status for success, info and loading, and an alert for errors. They carry the words, so a screen reader hears each outcome once whatever is on screen. A toast never takes focus. Its controls sit in the "Notifications" region at the end of the body, so Tab reaches them only after the rest of the page. Alt+T moves focus to the front toast's first control (the region carries `aria-keyshortcuts`), and a toast with an action names that route in the words it speaks ("Try again available, press Alt+T"), so a screen reader hears how to reach the button. Every toast action also exists on the page itself (a Try again on the failed part, the saved run in its list), and the toast is only the quick route. The action and the close take the dark ring #6ea8ff, because the accent ring would vanish on navy.

**With a dialog.** A toast fired while a modal dialog is open sits under it, for the reason in Dialog and sheet ([7.25](#725-dialog-and-sheet)). Toast a dialog's outcome once the dialog has closed.

**Responsive.** The width and the lift change under md as above. On a coarse pointer the front toast swipes away down 40px, the gesture phone notifications already teach.

**Do / Don't.**
- Do confirm an outcome the visitor caused, in a few words.
- Do give an error an action (Try again) and let it stay until closed.
- Do keep one action at most, and give it a twin on the page.
- Don't use a toast for a step the visitor must take to go on, which belongs in a dialog.
- Don't fire a toast while a dialog is open.
- Don't let a toast be the only place an outcome is recorded.

### 7.25 Dialog and sheet

**Purpose.** A task or a confirm that has to be finished, or turned down, before the visitor goes on: requesting access, signing in, removing something. The site has none, and its MobileMenu sheet has no dialog role, no focus move and no focus return. A dialog takes the page away on purpose, so it is kept for moments that earn it. A message that only reports belongs in a toast, and a choice that can wait belongs on the page.

**Anatomy.** A solid veil of ink at 40%, then a white panel with the hairline and the modal shadow, radius 28 and padding 32. The header holds the title (Outfit 24/30 at 500, -0.03em) and a description under it (Inter 15/22 in #64748b), with room on the right for the close, an md ghost icon button 16 in from the top and right corner. The body follows at 24 and scrolls inside the panel once the panel reaches the viewport less 96. The footer follows at 32: actions right-aligned at a gap of 12, the primary last.

**Variants.** dialog, centred, for a task. alertdialog, for a confirm: the veil does not close it, and the destructive action is the primary (destructivePrimary) beside a named way out. The sheet is the dialog's phone form, attached to the bottom edge with its top corners at 28, a 36 × 4 handle 8 from the top in #cbd5e1, at most 90svh tall, and its foot padded past the home indicator.

**Sizes.** sm 400 for a confirm, md 520 for a form, lg 680 for reading. The width follows the job, because a short question in a wide panel leaves the eye hunting across empty white.

**Header, body and footer rules.** The title asks or names the task in a few words ("Remove this player?", "Request access"). The description gives the consequence in a sentence. The body holds the task and nothing else, never a second dialog. Button labels are verbs that say what happens ("Remove player", "Keep player"), never Yes and No, which send the visitor back to reread the question.

**States.** Closed, opening, open, busy, closing, and for the sheet, dragging. Busy is the work running after the confirm: the close, Escape, the veil and the drag are all held, so a half-sent request cannot be dropped. The footer follows when its actions are DialogActions: the primary spins (loading) and every other action holds (disabled). A footer of plain Buttons is the caller's to hold. Nested dialogs are not allowed. A second step replaces the content of the open dialog.

**Props.** `open`, `onOpenChange`, `title`, `description`, `size`, `role`, `presentation` (auto, dialog or sheet), `footer`, `busy`, `initialFocus` and the body as children. `inline` and `forceState` are for the guide only: the panel alone in the flow, with no dialog element, veil, trap or scroll hold. `DialogAction` is a footer Button that reads the dialog's busy state, so `busy` is passed once, to the Dialog: it takes every Button prop plus `primary`, which marks the action that spins. Outside a dialog it is a plain Button.

**Motion.** The veil fades over 250ms on the one ease, the MobileMenu veil's timing, so the two overlays feel like one family. The panel comes in from scale 0.96 and 8px low with opacity, on the pop spring (stiffness 460, damping 34, mass 0.7), and leaves faster, at scale 0.98 over 140ms on the ease in. The sheet rises from 100% on a firmer spring (stiffness 400, damping 40), so a tall panel lands without a bounce, and leaves over 200ms. Under reduced motion all of it is a 140ms fade (`--ds-dur-exit`).

**The native dialog.** It is a `dialog` element opened with showModal. The browser then makes the rest of the page inert, keeps focus inside without a hand-written trap, turns Escape into a close request and puts the dialog in the top layer, above every z value. The cost is that anything outside it, a toast or a tooltip portalled to the body, sits under it. So a tooltip inside a dialog portals into the dialog, and a dialog's outcome is toasted after it closes.

**Focus.** On open, focus goes to the first field. In an alertdialog it goes to the first footer action, the least destructive one since the primary goes last, so a stray Enter never confirms a loss. With neither, it goes to the primary. On close it returns to the control that opened the dialog. The page behind holds still with overflow clip, as MobileMenu holds it.

**The veil.** Solid ink at 40%, never blurred, because a blurred backdrop breaks the compositor-safe rule ([5.13](#513-compositor-safe-rule)). The solid veil also keeps the page legible enough to remember where the visitor was.

**Accessibility.** The dialog is labelled by its title and described by its description. An alertdialog carries that role so screen readers announce it as a confirm. The close is a named button, and Escape works except while busy. Dragging the sheet is never the only way to close it.

**Responsive.** With presentation auto, the panel centres from md and becomes the sheet below, because on a phone the bottom edge is where the thumb already is. Under md the centred panel steps down to radius 24 and padding 24. The sheet's footer stacks at full width with the primary on top.

**Do / Don't.**
- Do name both actions of a confirm with verbs.
- Do hold every way out while the work runs.
- Do return focus to the trigger on close.
- Don't blur the veil.
- Don't open a dialog from inside a dialog.
- Don't use a dialog for a message that only reports, which is a toast.

## 8 The accent rule

The brand blue `#1a6dff` does two jobs on 6labs. As a fill it is the water the players stand on, and that stretch of the page is the only place it fills anything. On a light ground it marks attention: the word to read first, the link under the pointer, the thing that is live, the control that has focus. Every chapter that uses the blue applies this rule and points here for the reasons, so they are written once.

#### Where the accent may appear

| Use | Where | Why it is allowed |
| --- | --- | --- |
| The water | the players section, drawn by AccentWave, Accent water ([5.9](#59-accent-water)) | it is the one fill |
| A word or two of type | the closing words of a heading, the noun a claim turns on, the typed word | display sizes, where it clears the large-text bar of Contrast ([2.3](#23-contrast)) |
| Icons | the job tags, a link's arrow on hover | an icon is read by its shape, against a 3:1 bar |
| Shipped dots | the hero's live ping (Hero.tsx) and the pin dots on the label leaders of the footer copy line (CopyLine.tsx) | shipped fact, recorded as the site draws it |
| System dots, pending | StatusDot's live tones, an avatar's live dot, the live badge's dot (the index card's pins are navy) | pending [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)). Until the call they are an open exception, not part of the rule |
| Links on hover | text links, the header tabs, the footer links | a passing state, never the resting colour of small copy |
| The focus ring | every light ground, Focus ([2.10](#210-focus)) | focus is where attention is |
| The caret and the sheen | TypedWord's caret, the card sheen's light | light catching, never depth, as Stroke and elevation ([2.8](#28-stroke-and-elevation)) has it |

On dark grounds the accent lifts to `#6ea8ff` (`--ds-color-accent-on-dark`): the terminal's answer line, the ring on navy, a toast's action. On the water itself white takes the accent's job, for the reason under Reasons below.

#### Never

- A fill on a control, a chip, a tab, a checkbox, a card, a badge, a bar or a section, on any ground.
- A selected, checked, pressed or toggled state. Those take the primary navy `#0a152d` on every light ground, the container included, and a read-only checked mark takes the muted slate `#64748b`, so it reads as set but not live. On the accent water the chosen state is white with ink, for the reason below.
- Small copy on a light ground (under 24px, or 18.66px bold) while the accent ink is undecided, [decision 1](#1-accent-text-under-24px) in Decisions pending ([10.3](#103-decisions-pending)).
- A whole line of a heading. Section head ([7.16](#716-section-head)) gives the typographic reason.
- A second blue surface anywhere, the guide's own chrome included. The guide fills with the accent only to show the water and to show a Don't.

#### Reasons

- **One fill makes the water an event.** The page builds to the moment the water rises over the scroll line and the players arrive on it. A second blue fill anywhere would turn that moment into a colour scheme, and the players would lose the ground that marks them out.
- **An accent that stays small keeps its meaning.** On a light page the eye goes to the blue first. When the blue is one word, that word is what the visitor reads first. When it is a whole box, there is nothing left to point at.
- **Navy carries state because the accent carries attention.** If a selected chip were blue, the page would have two blues meaning two things, and the water would read as "selected". Navy also holds white type at 18:1, where the accent gives 4.49:1, so a chosen state stays legible at any size.
- **White is the chosen state on the water.** Nothing on the blue can stand out by being bluer, and navy is not the brightest thing there, so on the water white takes the accent's job and a chosen control is white with ink, as ModeToggle ships it. Every part with an on-blue form points here for this reason.
- **The dot is a light, not a fill, if the owner agrees.** At 6 to 8px a status or pin dot has no area to read as a surface, and the accent is the colour the page already uses to mark a point: a live state, the spot a label names. That is the case for [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)). Until the call, the hero's shipped ping and the copy line's pins are the site's own fact, the system's dots are pending, and a badge round a dot never fills.

## 9 Patterns

How parts and surfaces combine into the page: the six surfaces, the hero, the players stretch, the light sections, the page's order, the responsive ladder, forms, the loading and failure states, and the voice. Read Surfaces ([9.1](#91-surfaces)) first, since each later pattern stands on one of its grounds.

### 9.1 Surfaces

**Purpose.** A surface is the ground a section stands on. The site has six, and this chapter gives each one its job. Outside the players, what a section groups takes the hero container look (light grey, rounded, a faint hairline, navy type). The accent's place is the accent rule, [chapter 8](#8-the-accent-rule).

**The six surfaces and their jobs.**

| Surface | Token | Job |
| --- | --- | --- |
| Page | `--ds-color-page` `#f9fafb` | The ground of the light page, and under the grain from Understands to the foot. |
| White card | `--ds-color-surface` | A thing the visitor reads or uses: job cards, FAQ rows, the tab rail, fields. |
| Container | `--ds-color-container` `#e3e5e8` | A set piece or a grouped block: the hero, the ChatGPT side of the comparison. |
| Navy | `--ds-color-primary` `#0a152d` | The one card a view leans on (the 6labs side) and the primary fill. |
| Terminal | `--ds-color-terminal-bg` `#0b1526` | The agent's window inside a job card, and only there. |
| Accent water | `--ds-color-accent` with 7% grain | The players section. Drawn by AccentWave, never by a section. |

**The container look.** The grey `#e3e5e8`, a 1px hairline in `--ds-color-line-faint` and navy type, with the radius set by the block's size: 48 (32 under md) for the hero's container, and 36 (28 under md) for a card-sized block, the ChatGPT card and the index card. The empty state takes 36 at every width, because it sizes from its own box rather than the window. The container shadow `0 40px 100px -20px rgba(0,0,0,0.03)` goes only on a block that stands alone on the page, the hero's container and the index card, and it is almost nothing on purpose: it lifts the box off the page by a breath without reading as a card. The ChatGPT card and the empty state sit flat. Type on it is navy, and the muted slate steps up to the body slate `#475569`, because `#64748b` loses contrast on the grey. Today the look is written inline in Hero.tsx:125 and in the comparison card. New work reads it from the tokens.

**How a new section picks its surface.** It stands on the page (or the grain, if it comes after the players). If it is a set piece that groups its content, it takes the container look. If it holds things to read or press, they are white cards on that ground. Navy is for one emphasised card at most per view. A section never invents a seventh ground.

#### Reasons

- **Grey groups, white holds.** The container's grey says "these belong together" without a heavy border. White on grey then reads as the thing inside, which is why fields and cards on the container sit in white rather than straight on the grey.
- **Each ground is a section boundary.** Because a section keeps its ground, a change of ground tells the visitor a new section has started without a divider.

#### Do / Don't

- Do give a set piece the container look, and put what it holds in white.
- Don't put a field straight on the container grey.
- Don't add a ground. If none of the six fits, the section is doing two jobs.

### 9.2 Hero

**Purpose.** The first screen states what 6labs does ("Making models of human players."), proves it with the live tile floor behind the copy, and offers one call, Try now. It ships in two variants. `/website` has the rounded container with the numbers, scroll cue and wave under it. `/6labs-fullview` has the floor edge to edge under a clear header, with the numbers in the copy and the cue and wave inside the floor.

**Composition.** Three layers in one box. The floor (TileFloor, WebGL) fills it at z 0. A loading layer sits over the floor until it is ready: FloorLogo in the container, HeroLoader in the full view. The copy layer sits at z 20 and lets the pointer through to the tiles everywhere except its controls, so the floor stays playable under the words. Reading order is headline, lede ending in its link, Try now, then the social proof (container) or the numbers before Try now (full).

**Geometry.**

| Part | Container | Full |
| --- | --- | --- |
| Box | max 1400, 664 tall (720 under md), radius 48 (32) | 100svh, min 640, edge to edge, an ink 8% hairline at the foot |
| Copy layer | px 24, 64 from md, pt 40, 64 from md | max 1448, px 24 (16), pt clears the header plus clamp(48px, 9vh, 120px) |
| Headline | Outfit 34, 56 from md | 34 to 88 over seven steps, Responsive ladder ([9.6](#96-responsive-ladder)) |
| Lede | 14, 15 from md, max 440 | 16 to 22, max 470 to 680 |
| Numbers | centred under the box | left, between the lede and Try now |
| Cue and wave | under the box's corners, from md | cue low left from lg, wave bottom right |

**States.** The container shows its copy from the first paint and its mark on the grey until the floor is ready, then the tiles rise and the numbers, cue and wave follow. The full view shows only its loader and holds the page at its top, then lets the copy in, then the floor, then the corners. The timings are in Choreography ([4.5](#45-choreography)). On a phone the floor's view lowers until its highest tile sits just under the copy's last line (`setClearTop`, `CLEAR = -12`), so the tiles never run behind the words.

**Accessibility.** The headline is the page's one h1. The lede's link is a real anchor to the jobs, so a keyboard reaches the second action without a second button. The typed word is in the DOM from the start, so a screen reader reads the whole headline at once. The full view's scroll hold releases after 12s at most, so a visitor without WebGL is never trapped.

**Responsive.** The container changes at md (height, radius, type, the under-row collapsing to the numbers, the wave moving inside the box as a pill). The full view follows its own ladder and adds a short-screen cap. Both are previewed at true widths in the guide.

#### Reasons

- **The claim reads before the proof arrives.** The copy is in from the first paint and the floor comes after, because a visitor on a slow device should know what the page is about before the GPU has finished.
- **The floor is behind the words, not beside them.** Copy over a live field makes the field the evidence for the sentence on top of it. A split layout would make them two things to look at.
- **One call per screen.** The second action is the lede's last words as a link, so Try now is the only solid shape. Two solid buttons would ask for a decision the visitor cannot make yet.
- **The phone clearance moves the floor, not the copy.** Fading tiles under the text would hide the floor exactly where the visitor is looking. Lowering the view keeps every tile whole.

#### Gaps

- No designed WebGL-failure state. The full view gives up after 12s and shows the copy on bare grey, and the container keeps its turning mark forever. The state it should reach is under Loading, empty and failure ([9.8](#98-loading-empty-and-failure)).
- Hero.tsx is near the 300-line limit. The social proof, the under-row and the full view's corners should be split out before any further edit.
- The two type ramps and the container look are inline class strings rather than tokens.

#### Do / Don't

- Do keep one typed word in the headline.
- Do end the lede on the second action as a link.
- Don't put a second solid button beside Try now.
- Don't put anything interactive over the floor except the copy layer's own controls.

### 9.3 Scroll line to players

**Purpose.** The middle of the page. The scroll line (a 390vh track with a sticky stage) fills its sentence word by word, the accent water rises over its last screen, and the players section arrives standing on the water: the selected player's name, body, traits and Human / AI switch, their portrait, and four cards to pick another. It is the only stretch of the site filled with the accent.

**Why it is the one accent fill.** The water is a transition the visitor causes by scrolling. It turns the page from talking about models to showing them, and the players are the models. Giving the players a ground no other section has makes them the centre of the page without a heading saying so.

**Composition.** From lg: a 480 column on the left (Outfit 34 / 56 title, an 18px body at white 80%, the traits 40 below, the switch 40 below that) and the portrait filling the rest over a soft radial glow, its chest running under the four selector cards along the bottom. Below lg it is one view: the portrait with arrows at its sides, the slim switch riding up over its faded chest, then a carousel of name, body and dense traits.

**How it comes in.**
- **The overlap.** The section is pulled up a screen (`-mt-[100vh]`) over the scroll line's last view, so it is already in place when the water has filled the screen. Without the overlap the visitor would scroll through an empty blue screen to reach it.
- **The reveal gate.** It waits for the water's `accentwave` event with `filled: true`, sent as Accent water ([5.9](#59-accent-water)) sets out, and for 20% of itself to be in view. Both are needed: the event alone would reveal it while still off screen on a tall window, the view alone would reveal it on the light page before the water. Once revealed it stays, so scrolling back and forth does not replay the entrance or redraw the doodles.
- **The entrance.** Each part rises 24px over 0.5s on the one ease, the cards first and 0.05s apart, then the portrait, the switch, and the column and carousel last.

**The portrait height.** `--ph = min(720px, (100svh - 344px) / 0.756)`. 344 is the room the header clearance and the cards need. 0.756 is the share of the portrait that adds to the section, since the cards cover its bottom 24.4%. Below lg the formula changes to fit the portrait, switch and carousel in one screen, capped at 520 and at the content width. The section always fits one view, so picking a player and seeing them never needs a scroll.

**Auto mode.** While the section is shown, the portrait swaps between the human and the AI copy every 5s (`AUTO_S`), so a visitor who never touches the switch still sees both. The first pick stops it for that player.

**Accessibility.** The cards are toggle buttons with `aria-pressed`. The switch is a radiogroup. Only type in white (or on a white card) sits on the water, because white is the most contrast the blue allows (4.49:1) and navy reaches only about 3.8:1. The section is the page's one magnet, CSS scroll snap (in desktop Safari, where the snap is off, a JS catch within 0.3 of a screen), so it catches a scroll that comes to rest near it and leaves every other scroll alone. The auto switch starts by itself and keeps going, and using a player's switch stops it for that player only, so another pick starts it again. WCAG 2.2.2 (Pause, Stop, Hide) asks for one way to stop it, such as holding every player once the visitor uses any switch.

**Responsive.** One switch at lg. Below lg the side column and the cards give way to the carousel and the arrows. Past 1920 on a dense screen (devicePixelRatio 1.5 and up) the content scales up evenly, by the window's width over 1920, to at most 1.35, and never past what fits between the header clearance and the foot (usePlayersScale.ts). It is a transform, so the layout, the pull up and the full height are untouched. A wide CSS width at that density is a big physical screen seen up close, and a 1440p monitor at density 1 keeps the layout.

#### Gaps

- The accent ground is not part of the section. It lives in AccentWave, so the section cannot stand alone (the guide frames it on a solid accent ground and sends the event itself).
- The selector card and the player detail block are inline in Players.tsx, which is near the 300-line limit.
- The entrance has no reduced-motion branch, and the selector cards differ mainly by opacity.

#### Do / Don't

- Do keep every word on the water white, or on a white card.
- Do let the water reveal the section rather than the scroll position alone.
- Don't add a second section on the water.
- Don't set navy type straight on the blue.

### 9.4 Light sections

**Purpose.** The four sections after the players, on the grained light page: the comparison (Understands), the three jobs, the questions (FAQ) and the closing call. They argue the case the hero and the players set up, then ask once more.

**Composition and bill of materials.**

| Section | Opens with | Holds | Specced under |
| --- | --- | --- | --- |
| Understands | no section head, each card headed by its maker's name | the ChatGPT and 6labs pair joined by a vs | Comparison cards ([7.12](#712-comparison-cards)) |
| Jobs | a section head, "One model. Three jobs." with a subline (raw markup today, specced as Section head ([7.16](#716-section-head))) | the three-job switch below xl, three job cards with terminals and tags | Segmented control ([7.4](#74-segmented-control)), Card ([7.11](#711-card)), Terminal ([7.19](#719-terminal)), Badge, status dot, tag ([7.14](#714-badge-status-dot-tag)) |
| FAQ | a section head, "Questions, answered.", in a 360 column from lg (raw markup today, specced as Section head ([7.16](#716-section-head))) | ten questions in rows | Accordion ([7.20](#720-accordion)) |
| Closing | the mark | "1 million made / 2 billion to go", one line of why, Try now, a sign-in line | this section |

**The shared box.** Every light section sits in the container and gutters of Layout and breakpoints ([2.6](#26-layout-and-breakpoints)), so heads start on one left edge from section to section. The closing is the one centred section, because it is the end of the page rather than a step in it.

**The padding rhythm.** Each section's top and bottom padding is a clamp on the window's width: Jobs `clamp(96px, 9vw, 144px)` over a 96 foot, FAQ `clamp(72px, 7vw, 120px)` over a 128 foot, the closing `clamp(40px, 4vw, 72px)` over `clamp(92px, 10vw, 150px)`. Understands adds the header's height to its top (`calc(89px + clamp(96px, 9vw, 144px))` from md, `calc(70px + 96px)` on phones), so that when its top meets the window's top, as it does when the light page rises back over the water, its cards sit one block's distance under the fixed bar rather than behind it. Both offsets are hand-written numbers that do not match the bar, the header-offset drift in Known gaps ([10.2](#102-known-gaps)). A new light section uses the same clamps rather than a fixed step, so the gaps between sections grow together.

**The grain.** From Understands to the footer, one `.page-grain` block covers the glyph field with the page colour and a 4.5% noise, fading in over its first 240px. It starts at the fourth section because that is where the page turns from the set pieces (floor, line, water) to reading. A new section after the players goes inside this block, never in a block of its own.

**The head rule.** A new light section that opens with a head uses the system SectionHead at its h2 size, as Section head ([7.16](#716-section-head)) specs it. Jobs and the FAQ write the same head as raw markup today. The display size is kept for the closing call only.

**The closing.** Centred: the 44 mark, the two-line promise with its second line typed in once 60% of it is in view, one line of why at 520, Try now, and "Already have an account? Sign in" at 13.5. The numbers are written as a digit and a word, because the words carry the scale.

**Accessibility.** Each section carries its own id (`understands`, `jobs`, `faq`, `get-access`). `jobs` and `faq` are targets of the in-page links (the header's tabs and the footer's Explore). `understands` and `get-access` carry ids that no link targets yet, as Shell behaviours ([6.7](#67-shell-behaviours)) notes. The typed line is in the DOM from the start.

**Responsive.** Jobs swaps its grid for a snap row with a switch below xl. The FAQ stacks its head over its rows below lg. The comparison becomes one column on a phone. The closing only scales its type.

#### Reasons

- **Clamps, not steps.** A fixed padding that jumps at md makes a 767 window and a 768 window look like two designs. A clamp grows with the window, so no width is a seam.
- **The grain marks the reading half.** The set pieces above it move. The grain says the page has settled and the rest is to be read.

#### Gaps

- The closing's 34px gaps and its 13.5px line are off the spacing and type scales.
- Sign in in the closing is a dead `href="#"`.
- Jobs rises into view and the FAQ does not.

#### Do / Don't

- Do open a new light section with SectionHead on the container's left edge.
- Do reuse the section clamps for its padding.
- Don't start a grain block of your own.
- Don't centre a head except the closing's.

### 9.5 Page composition

**Purpose.** The page is one sequence, and every part of the shell answers to where in it the visitor is. This chapter is the map a new page or a new section follows.

**The section order.** `main` (the page gutter, 96 top for the fixed header) holds, in order: the hero, the scroll line, the players, then one grain block with Understands, Jobs, FAQ, the closing and the footer. AsciiBackdrop and AccentWave sit behind everything, BackToTop floats over it, and ClickLock, PerfBoot and SafariScroll are behaviour with no look.

**Grounds per stretch.** Light first (the page with the glyph field round the hero), then the line on the same light page, then the water and the players, then the grain to the foot. The page opens and closes light, and the one blue stretch sits in its middle.

**The shell per stretch.**

| Stretch | Header | Glyph field | Snap | Back to top |
| --- | --- | --- | --- | --- |
| Hero | at rest, its stroke after 4px of scroll | on | none | hidden |
| Scroll line | scrolled, then solid white once the water is 90% up | on until the line's foot | none | hidden |
| Water and players | solid white | paused | `#players`, proximity snap (in desktop Safari a catch within 0.3 of a screen) | shown, on phones only while scrolling up |
| Grain block | scrolled | covered | none | as above |
| Footer | scrolled | covered | none | on phones hidden, the footer has its own |

**The two pages.** `/website` and `/6labs-fullview` differ only above the line: the default header and the container hero on one, the clear header and the full hero on the other. From the scroll line down they are the same components in the same order, so a fix below the line ships to both.

**Rules a new page follows.**
1. One solid primary per view, for the reason in Hero ([9.2](#92-hero)). Try now is the call, Sign in is outlined.
2. The grain starts at the first section after the players and runs to the foot in one block.
3. The accent fills only the water.
4. One snap point, the players. Every other scroll rests where the visitor leaves it.
5. Every section sits in the 1400 container.
6. A section id is rendered once, because the in-page links and the glide target it.

#### Reasons

- **The shell follows the ground so the content does not have to.** The header turns white on the water because a page-tinted bar would be a pale stripe on blue. The glyph field pauses under the water and the grain because nobody can see it there, and drawing it would cost frames for nothing. BackToTop appears only past the line because above it the top is a short scroll away.
- **One magnet, because a magnet is a decision.** The players are the one place the page wants the visitor to stop. A second snap point would make scrolling feel sticky, and the visitor would stop trusting the wheel. For the same reason the snap is proximity, and desktop Safari's catch fires only within 0.3 of a screen once a scroll has rested 120ms, so it never tugs at a scroll still under way or one leaving the players. A 0.6-screen catch in every browser kept pulling the page back to them, and came out.
- **The two pages share everything below the line** so the variant is a choice about the first impression only, never a second site to maintain.

#### Do / Don't

- Do add a new section inside the grain block, between the players and the footer.
- Do keep the order light, water, light.
- Don't add a second blue stretch, a second snap point or a second solid primary in one view.
- Don't render a section id twice.

### 9.6 Responsive ladder

**Purpose.** Where the page changes as the window widens, and the rule for where new work may change. The guide lists every step read from the source. This chapter says why the steps are where they are.

**The ladder.**

| Width | What changes |
| --- | --- |
| base (375 up, until the steps below) | phones: the burger, Sign in at 13, the footer in two columns, the jobs as a swipe row, the players as one view, the container hero 34 / 720 / radius 32 |
| 561 | the full hero's type, one step, and nothing else |
| 768 (md) | tabs and language in the header, the footer in three columns, the copy line picture, the page gutter at 32, the container hero 56 / 664 / radius 48 |
| 901 | the full hero's type, one step |
| 1024 (lg) | the players' two columns and four cards, the full hero's scroll cue, the copy line's labels, the full floor pulled back (distScale 1.5) |
| 1280 (xl) | the jobs three across, the full hero's type, the short-screen cap |
| 1600, 1920, 2560 | the full hero's type and measure, the floating tiles' wide places at 1600 |
| 1920, dense screens only | the players scale up to 1.35 |

**The full-hero exception.** The full hero keeps the ladder it was tuned on, from the onBlue creators hero: the title 34 / 36 / 42 / 54 / 64 / 76 / 88 and the lede 16 / 16.5 / 15 / 16 / 18 / 20 / 22 at a measure of 470 / 440 / 540 / 620 / 680. At 901 the lede drops to 15 as its measure narrows to 440, as the onBlue scale has it: size and measure move as a pair, so the line length holds while the title grows. The ladder stays in the full hero. Nothing else may use 561, 901, 1600, 1920 or 2560, with the one exception below.

**The players' scale, the second exception.** The players section is laid out for windows up to 1920. Past 1920, on a dense screen only, its content scales up evenly by the window's width over 1920, to at most 1.35, as Scroll line to players ([9.3](#93-scroll-line-to-players)) sets out. It is a transform rather than a breakpoint, so nothing reflows, and it reads the width and the density in script, not in a media query.

**The rule for new work.** A page changes at Tailwind's breakpoints only: md (768) for the phone to tablet split of gutters, type and rhythm, lg (1024) for layouts that change shape, xl (1280) for wide grids. Write `xl`, never `min-[1280px]`. A part that steps its size steps down one rung under md. Inside a part, the named component widths 400, 480 and 560 may also be used, where a row of actions or choices stops fitting a phone, and a part that answers its own box (EmptyState) takes a container query rather than a media query, as Layout and breakpoints ([2.6](#26-layout-and-breakpoints)) lists.

**Height, pointer and density.** Width is one axis of four.
- **Short screens.** `(min-width: 1280px) and (max-height: 720px)` caps the full title at 48, so a laptop with a short window still shows the copy, the numbers and the cue in one screen.
- **Small viewport units.** The full hero and the players' portrait use `svh`, the height with a phone's toolbar showing, so nothing is cropped when the toolbar comes back.
- **Hover and fine pointers.** `(hover: hover)` gates anything that answers a cursor (the glyph field's pool, the floating tiles' drift), and `(hover: hover) and (pointer: fine)` gates the liquid over the line and desktop Safari's smooth scroll. Touch gets the still form, never a broken hover.
- **Pixel density.** A devicePixelRatio of 1.5 and up, read in script, lets the players scale past 1920. A wide CSS width at that density is a big physical screen seen up close, while a 1440p monitor at density 1 is a desk screen at arm's length and keeps the layout.
- **Safe areas.** The footer's legal row pads `env(safe-area-inset-bottom)`, so the home bar never covers the links.

**The tight band.** From 768 to about 900 the header's row is at its narrowest, as Header ([6.2](#62-header)) describes. A fifth tab does not fit there, so it goes in the menu or waits for a wider step.

#### Reasons

- **Shared steps reflow together.** When every part changes at md, the page changes once at 768 and the visitor sees one new layout. Parts on private widths make a window size that is half one design and half another.
- **lg for shape, xl for density.** The players need the room of 1024 to hold a side column beside a 720 portrait. The jobs need 1280 to hold three terminals side by side at a readable width.
- **The hero ladder is one set piece.** Its title, lede and measure were tuned together. Moving one step onto Tailwind's widths would retune the whole block.
- **A touch screen is not a small mouse.** A hover effect without a hover is either invisible or stuck on, so the pointer media decide, not the width.

#### Do / Don't

- Do change new work at md, lg and xl, and inside a part at 400, 480 or 560.
- Do gate cursor effects on `(hover: hover)`.
- Don't write any other custom width outside the full hero and the players' scale.
- Don't size a full-screen part with `vh` on a phone.

### 9.7 Forms

**Purpose.** The site has no form yet. The first three it needs are the waitlist line (one email and Request access), sign in, and a contact form. They are built from the system's fields, choices and buttons, and every form after them follows the same layout and timing.

**Layout.**
- Labels sit above their fields, never inside them as placeholders. A placeholder is a format hint ("you@studio.com") and disappears as the visitor types.
- 20 between fields (`--ds-space-5`), 32 before the actions (`--ds-space-8`).
- One column. Two fields share a row only when they are one answer (a first and a last name).
- On the container grey, a form sits in a white card. On the page or white it sits straight on the ground.
- The waitlist line is the one inline form: the field and the xl button share a row, centred on each other, and stack under 560.
- Actions sit in a ButtonGroup with the primary last. A dialog's single action goes full width.

**Validation timing.**
- Nothing is checked while the visitor types into a fresh field.
- A field is checked once it is left with something in it. An empty field left alone is not an error yet.
- On submit every field is checked, the first wrong one takes focus, and the visitor's text is kept.
- Once a field has shown an error it is checked on each keystroke, so the error clears the moment the value is right.
- The browser's own validation is off (`noValidate`), so every message is the system's.

**Messages.** An error says what to type ("Enter an email like you@studio.com."), not that something failed. It sits under the field in the danger ink with its icon, and the field takes the danger border and halo. A helper sits in the same place in the muted slate and gives way to the error.

**Long forms.** Past about five fields, a submit with errors also puts an error summary at the top of the form (a danger Banner listing each error as a link to its field) and moves focus to it, so a visitor who cannot see the whole form still learns what to fix.

**Submit states.** The submit Button turns busy (its label held, a centred spinner, clicks ignored) while the request runs, and the fields go read-only so the sent value cannot change under it: TextInput, TextArea, Select, Checkbox, Radio and Switch take `readOnly`. Slider, Segmented and ChipGroup have no read-only form, so they go disabled for the request instead, and come back as they were. A failure keeps everything and shows the reason in a danger Banner above the actions. A success resets the line and confirms with a success toast, or replaces the form with its result when there is one.

**Accessibility.** Every field has a visible label tied to it. Errors are linked to their fields through `aria-describedby` and the field is `aria-invalid`. Grouped choices sit in a fieldset with a legend. Focus moves to the first error on submit and never moves while the visitor types. The password's Show button changes its own name (Show password, Hide password) as well as the field's type.

#### Reasons

- **Errors after leaving, not while typing.** A field that turns red at the first keystroke tells the visitor they are wrong before they have finished. Waiting for them to leave is the earliest moment the value is meant to be complete.
- **Then live, so the fix is seen.** Once an error is showing, checking on each keystroke lets it clear as soon as the fix is in, so the visitor does not have to leave the field again to find out.
- **Labels above, because placeholders vanish.** A label inside the field is gone the moment the visitor types, which is when they most need to check what the field asked for.
- **A white card on the grey.** A white field on grey has nothing round it and reads as a gap in the section. The card gives the field a ground of its own.
- **Read-only while sending.** A value changed mid-request is a value the server never saw.

#### Do / Don't

- Do say in the error what to type.
- Do keep the visitor's text after an error.
- Don't check a field while it is still being typed into for the first time.
- Don't put a form straight on the container grey.
- Don't disable the submit button to signal errors. Let the press show them.

### 9.8 Loading, empty and failure

**Purpose.** The three ways a page can fall short of its content: still waiting for it, unable to run the floor, or cut off by a failed request or connection. The site ships none of these states today, so this chapter sets them before the first page that needs them.

**Skeleton or spinner.** Spinner and skeleton ([7.21](#721-spinner-and-skeleton)) sets the choice: a skeleton where the shape of what is coming is known, a spinner where it is not or inside the control that started the wait. At page level a spinner is never the only thing on screen.

**The hero without WebGL.** The floor needs WebGL. When it is not there (an old GPU, a blocked context, a driver crash), the hero keeps its box, its copy and Try now, and changes three things:
- The floor's mark lies still at 60% where the floor would run, tilted as the loader tilts it but not turning, because a turning mark says something is loading and nothing is coming.
- One line under Try now, 13px in the body slate: "The live floor is not available on this device."
- The full view stops holding the scroll the moment the failure is known, rather than after 12s.

Neither variant reaches this today, so it stays a gap until the hero adopts it. The mark's soft edge is a CSS mask on the shipped loader, and the fallback drops it under the compositor rule, so the feather belongs baked into the image.

**Empty and error placement.** An empty or failed part shows its EmptyState where its content would be, at the content's size, and the rest of the page stays. A failed row of cards becomes one contained EmptyState in the row's place. A failed page (nothing to show at all) is the only place an EmptyState stands alone at page level.

**Retry.** A retry is the secondary Button in the EmptyState or the Banner, and it turns busy while it runs. It retries only the part that failed. After two failures the copy says so and offers a way out (Contact support) beside the retry. A retry never reloads the page, because that would throw away everything that did load.

#### Reasons

- **The hero's job survives the floor.** The visitor came for the claim and the call. The floor is evidence, and losing evidence is worth one quiet sentence, not an error panel.
- **A failure stays where it happened.** An error in place of the one row that failed tells the visitor exactly what is missing and that everything else is fine.
- **Banners for conditions, toasts for events.** "You are offline" is true until it is not, so it stays. "Saved" happened once, so it goes.

#### Do / Don't

- Do use a skeleton shaped like the content for a known layout.
- Do keep the hero's copy and Try now when the floor cannot run.
- Do retry only the part that failed.
- Don't put a page spinner in front of content whose shape is known.
- Don't replace the hero with an error.

#### Banner

**Purpose.** A notice for a condition that holds until it ends: offline, a stale view, a save that failed. It sits in the flow above the view it is about. It is not a toast (it does not time out) and not a dialog (the page keeps working under it).

**Anatomy.** One row at the panel radius (16): a 16px icon in its tone's colour, the title in Inter 14 at 500, the body after it in the body slate, then an optional secondary sm action and an optional ghost sm close. Padding 12 / 16, gap 12, a 1px hairline.

**Variants.** `tone`: info (the accent icon), offline (the muted icon), success, warning and danger. Info, offline and success sit on white. Warning and danger take their 8% tint and danger its own line, so the two that need attention stand out without a fill. No tone fills with the accent.

**Sizes.** One. A banner is a page-level row, and a smaller one would be a toast.

**States.** The banner itself has none. Its action and close are the system Button and IconButton with their full states: rest, hover, focus-visible, pressed, and loading on the action while a retry runs.

**Props.** `tone`, `title`, `body`, `icon`, `action` (`label`, `onClick`, `loading`), `dismissible`, `onDismiss`, `forceAction`, `forceClose`, `className`.

**Motion.** None of its own. It appears and goes with the content it is about, so it never slides over anything.

**Accessibility.** Danger is `role="alert"`, every other tone `role="status"`, so only a failure interrupts a screen reader. The title is a sentence with a full stop, so it reads well announced alone. The close is labelled Dismiss. A banner for a condition that is still true has no close, because dismissing it would hide something that is still the case.

**Responsive.** Under 480 the actions wrap below the copy, lined up with it past the icon.

**Do / Don't.**
- Do use a banner for a condition that holds until it ends, and a toast for an event that happened once.
- Do write the title as a sentence that reads well announced alone.
- Don't give a banner a close while its condition still holds.
- Don't fill a banner with the accent, on any tone.

### 9.9 Content and voice

**Purpose.** How the site writes, so a new line sounds like the lines already there. The guide shows each rule beside a shipped line it is read from. This chapter gives the rules their reasons.

**The rules.**
- **Present tense for what is true now, past only for what the model has done. Short sentences, full stops.** "One model. Three jobs." "Our model watched millions of hours of gameplay. Now it understands the game player." A heading that is a sentence ends in a full stop.
- **A claim, then why it matters.** "Your KPIs show what happened. The model tells you why it happened." Two short sentences rather than one long one joined by a dash.
- **No adjectives doing the selling.** The site never calls the model powerful or the jobs amazing. The figures and the verbs carry it.
- **The accent on a word or two.** Most often the closing words ("Three jobs.", "answered.", "2 billion to go"), sometimes the noun the claim turns on ("models"). Never a whole line.
- **Second person for the visitor, the model as the subject.** "Your players are next." "Now it understands the game player." The company speaks as "our model" at most, never "we".

**Vocabulary.**
- **player**: a real person who plays games. The site models players, never users or gamers.
- **model**: what 6labs builds of a player, from what they do rather than what they say.
- **copy**: what the model makes of a player, a digital copy. Counted as digital copies made.
- **AI copy**: the copy shown beside the human in the Human / AI switch. Never a clone, a twin or an avatar.
- **hologram**: the design's word for how an AI copy looks, the blue scan-line figure. It is used in code and docs, never on the page, where the copy is simply the AI copy.
- **job**: what the model does for a studio. There are three: intelligence, testing and game creation.
- **wave**: the floor turning to its next cast of faces.

**Number formats.** Figures as digits in stats and labels ("2B", "1,009,271"). Commas in thousands. A plus marks a floor ("1,000,000+ player models"). In a headline, scale is a digit and a word ("1 million made"), because the word is what the eye takes in at that size. Units are written out in copy and abbreviated only in the guide.

**Button and link labels.** A verb first, two or three words, sentence case, no full stop: Try now, Sign in, See what it does, Next wave, Back to top. The label says what happens on a press. A link inside a sentence is the words that describe where it goes, never "click here".

**Punctuation.**
- **No em dash.** A comma, a colon, a full stop or brackets do its job.
- **No semicolon.** Two sentences instead. One shipped FAQ answer still carries one (faq-data.ts:43), and it should become two sentences.
- **Sentence case** on every head, label and button, never title case.
- **Straight to the point.** No exclamation marks, no ellipses.

**Filler for new parts.** A specimen of a new component uses copy quoted from the site when the site has the words, and obvious filler when it does not ("Panel one", "Panel one copy."). It never invents a product claim, a figure or a customer.

#### Reasons

- **Short sentences can be checked.** A claim that ends at its full stop can be true or false. A long sentence full of adjectives cannot, and visitors read it as marketing.
- **One word per thing.** If the page says copy in one place and clone in another, a visitor wonders whether those are two products.
- **Digits are scannable, words carry scale.** In a stat the eye compares numbers, so digits. In a headline the eye takes in meaning, so "1 million" lands faster than "1,000,000".
- **Verbs on buttons say what happens.** A label that names the outcome lets the visitor decide before they press.
- **Invented copy travels.** A made-up figure in a specimen ends up in a deck, and then it is a claim the company has to defend.

#### Do / Don't

- Do end a sentence where the fact ends.
- Do use the vocabulary above, one word for each thing.
- Do label a button with a verb.
- Don't use an em dash, a semicolon or an exclamation mark.
- Don't sell with adjectives.
- Don't put an invented figure in a specimen.

## 10 Meta

How the system is kept: what Coverage counts, the gaps the guide records rather than fixes, the calls only the owner can make, the conventions for adding to the guide, and the changelog. Known gaps ([10.2](#102-known-gaps)) and Decisions pending ([10.3](#103-decisions-pending)) are the two to read before changing the live site.

### 10.1 Coverage

**What it is.** A measure of how much of the code the guide shows, taken when the page builds. It is computed, never typed: the catalog's covers on one side, a scan of the source on the other.

**The method.** Coverage counts components, states and assertions. It does not count CSS classes, because the site is written in Tailwind utilities and a class count says nothing about whether a part has been shown.

- **Components.** Every exported function component, and every exported arrow, forwardRef or memo component, in the `.tsx` files of `src/components/website`, `src/components/tiles` and `src/components/design-system`. A part counts as specimened when a catalog section lists it in its covers.
- **Controls and owed states.** A part that renders a native control or a control role itself owes five states: rest, hover, focus-visible, pressed and disabled. A page section that only holds other parts owes none, since its controls are counted on their own. Rest is shown by any specimen. The others are matched by name, with the synonyms sections use (focus for focus-visible, dragging for pressed).
- **Ships on.** A shipped part's pages come from the import graph of `src/app/website/page.tsx` and `src/app/6labs-fullview/page.tsx`. System parts ship on no page yet.
- **Assertions.** A transcribed value (a class string, a timing the source keeps private, a drawer row's needle) must still be in its file as exact text, and a drawer row that cites a system file must carry one. An Anatomy pin's text must still be written on the lines it cites, and every data module must be walked. A token that cites a `file:line` must still find its value or its Tailwind class on that line or the one either side, with spacing, quotes and number formats normalised. A token whose site value is computed (a next/font family, a JS curve, a height that comes from padding) is listed as derived with its reason, never counted as passing.

**Reading the worklist.** The owed column is the one to work from. A shipped part short of focus-visible is a real gap on the live site, not a guide gap, since no shipped part styles focus. A system part short of a state means a section has not shown it yet. The Not specimened chips are exports no section covers yet, and a new public part should not stay there. Internal parts (a card's title slot, a dialog's panel, the index page's card), listed in `INTERNAL_PARTS`, follow apart: they owe no specimen and no states, and the percentage leaves them out. A cover that matches no export is a rename the catalog missed, and shows as a warning.

**Why at build.** The guide page is prerendered, so the scan costs nothing at runtime and the numbers are exactly the source's at that build. `npm run ds:check` runs the same checks outside the build and fails on a red one. A green assertions count means every written value still matches. It does not mean the parts draw the same, which Known gaps ([10.2](#102-known-gaps)) lists as a blind spot.

### 10.2 Known gaps

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
| Performance | high | Card sheen | globals.css:246-262 | redraw with background layers, as the system Card does, [decision 9](#9-the-card-sheen) in Decisions pending ([10.3](#103-decisions-pending)) |
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
| Accessibility | medium | Ping and pulse | Hero.tsx:238, Players.tsx:264 | the motion-safe variant on both loops |
| Accessibility | medium | Accent text | Header.tsx:86, Hero.tsx:245 | the accent ink for text under 24px, [decision 1](#1-accent-text-under-24px) in Decisions pending ([10.3](#103-decisions-pending)) |
| Accessibility | medium | Skip link | website/page.tsx:25 | a SkipLink first in the body, and an id on `main` for it to land on |
| Accessibility | low | Footer stubs | Footer.tsx:18, 94-95 | an `href` on each link, or plain text until it has one |
| Accessibility | medium | Glide focus and hash | jump.ts:38 | move focus to the target's heading and update the hash with `history.replaceState` |
| Accessibility | medium | LanguageMenu highlight | LanguageMenu.tsx:72 | `aria-activedescendant` on the focused trigger, with `aria-controls` |
| Accessibility | low | Comparison headings | Understands.tsx:70, 77 | an h3 per name under a visually hidden h2, so heading navigation finds the section, with no change to the look |
| Accessibility | low | Language of parts | LanguageMenu.tsx:96 | a `lang` on each row's label (ko, ja, zh) |
| Accessibility | medium | HeroLoader label | HeroLoader.tsx:48 | the body slate `#475569` for the label (6.0:1), since its slate-500 holds near 3.8:1 on the hero grey |
| Behaviour | medium | Mobile menu rows | ClickLock.tsx:11, MobileMenu.tsx:86 | close the sheet before ClickLock's capture, or let ClickLock spare the menu |
| Behaviour | medium | Page hold | MobileMenu.tsx:17 | release the hold when the md query starts to match |
| Behaviour | low | Language in the sheet | MobileMenu.tsx:108 | lift the chosen language above the sheet |
| Behaviour | low | Header on reload | Header.tsx:44 | read the scroll once on mount |
| Drift | low | Navies | website | ink and primary by role, terminal and logo core as their own tokens, [decision 4](#4-two-navies) in Decisions pending ([10.3](#103-decisions-pending)) |
| Drift | low | Slates | website | one source per role, the v4 classes or the hex, never both |
| Drift | low | Hairlines | website | one alpha for the hairline, one named step for the firm line |
| Drift | medium | Ease | website | one ease token in the theme, [decision 7](#7-tokens-in-the-sites-theme) in Decisions pending ([10.3](#103-decisions-pending)) |
| Drift | low | Radius | website | one spelling per step |
| Drift | low | Header offsets | Understands.tsx:64, Hero.tsx:169 | one header height token |
| Drift | low | Players gutter | Players.tsx:107 | 16 on phones, as every other section takes |
| Drift | low | Hero row gutter | Hero.tsx:101 | 16 on phones, as every other row takes |
| Drift | medium | font-mono | Players.tsx:247, globals.css | map --font-mono, [decision 8](#8-the-mono-family) in Decisions pending ([10.3](#103-decisions-pending)) |
| Dead code | low | Player card classes | Players.tsx:207, 220 | remove the classes a hidden grid never shows |
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
| Accessibility | medium | White labels on the accent | segmented-styles.ts, slider-styles.ts, Slider.tsx, Switch.tsx, progress-styles.ts, chip-styles.ts, button-styles.ts | full white at 12 to 15px reads 4.49:1, a hair under 4.5: small labels onto a white surface in ink, [decision 2](#2-white-labels-on-the-accent) in Decisions pending ([10.3](#103-decisions-pending)) |
| Accessibility | medium | On-blue Badge | Badge.tsx | its white label on the 15% glass is well under 4.5:1: drop the glass, as the Chip did, or keep it to words the copy around it also says |
| Accessibility | low | Success Badge on the page | Badge.tsx | the success text on its tint falls just short over the page: a darker success ink, or a white surface under it |
| Accent rule | medium | Dots on a light ground | StatusDot.tsx, Avatar.tsx, Badge.tsx | the live dots fill with the accent outside the players: name them the rule's one exception, [decision 3](#3-dots-on-a-light-ground) in Decisions pending ([10.3](#103-decisions-pending)) |

**Why record and not fix.** A guide that quietly repairs the site stops being a record of it, and each repair needs the owner's eye on the live page. Every row names its evidence, so when one is fixed its row in the guide turns to "recheck" on the next build, and the entry here can be closed.

### 10.3 Decisions pending

Calls only the owner can make. For each: the two options, the scope of the change each one means, and the recommendation with its reason. Until a call is made the site stays as it is, and the guide marks the recommendation without acting on it. Each decision is cited by its number, as [decision 1](#1-accent-text-under-24px), and the citation links here.

#### 1. Accent text under 24px

A, keep `#1a6dff` for all accent text. B, add an accent ink `#1559d6` for accent text under 24px and for link hovers. *Scope:* A, none. B, one token and the hover and small-text classes of the files that hover links to the accent. *Recommend B.* The brand blue stays wherever it reads as brand (display type, icons, dots, the ring, the water), and the darker ink appears only where reading is the job. WCAG asks 4.5:1 of small text, and the blue gives about 4.3:1 on the page and 3.6:1 on the container.

#### 2. White labels on the accent

White on the accent is 4.49:1, a hair under the 4.5:1 that copy under 24px needs, and the system parts made for the water set their labels in full white at 12 to 15px: Segmented's segments at rest, the Slider's label, value and ticks, the Switch's label and description, the Progress name and value, the on-blue Chip and the glass Button. A, set them large: labels and values on the water grow to 24px, or 18.66px bold, where 3:1 is enough, and each control grows with them. B, put them on a white surface: small labels sit on white in ink, as ModeToggle ships its chosen state, and the water keeps only large type, icons and rings. *Scope:* A, the type and the size of those six parts on blue. B, their on-blue forms, which move their small labels onto white. *Recommend B.* Ink on white clears every bar with room to spare, and a white pill is already how the water shows a chosen control, so B adds no new look. A would make every control on the water large enough to compete with the players for the eye. Until the call, Known gaps ([10.2](#102-known-gaps)) lists the parts and Contrast ([2.3](#23-contrast)) names them as shipped pairs under the line.

#### 3. Dots on a light ground

The system's live dots fill with the accent on light grounds: StatusDot's live tones, an avatar's live dot and the live badge's dot, as the hero's shipped ping does. The accent rule lists no such fill. A, accent, a named exception: the rule gains one line, that a live dot of 8px at most may take the accent on a light ground, as the hero's ships. B, navy dots: live dots take the navy, as the index card's pin dots already do, so the accent fills nothing outside the water, and a live dot loses the colour that sets it apart. *Scope:* A, none, the rule gains a line. B, StatusDot, Avatar and Badge. *Recommend A.* At 6 to 8px a dot has no area to read as a surface, and the accent is the colour the page already uses to mark a live point, while a navy dot beside navy words reads as a bullet and loses "live". Until the call, the accent rule ([chapter 8](#8-the-accent-rule)) lists these dots as pending, and the rule itself stands as written: the accent fills nothing outside the players section.

#### 4. Two navies

A, keep ink `#0a1b33` for type and primary `#0a152d` for fills. B, merge them into one value. *Scope:* A, none. B, the primary fills move to the ink. *Recommend A.* At 1.05:1 the merge saves no visible colour, while two names let a fill and a line of type change on their own later.

#### 5. The comparison's navy card

A, keep the 6labs card in primary navy with no accent word. B, move it to the container look with accent key words. *Scope:* A, none. B, the card and its lines in Understands.tsx. *Recommend A.* The navy is the primary, not the accent, so the one-accent rule holds, and the pair exists to contrast. Accent words on the grey would also read at about 3.6:1.

#### 6. Focus ring colour

A, the accent ring. B, a navy ring. *Scope:* A, none. B, the focus token and every ring that reads it. *Recommend A.* The ring asks for attention, which is the accent's job, and the 2px offset leaves the ground showing between ring and control, so it reads on a navy fill too. A navy ring beside a navy button looks like the button's own border.

#### 7. Tokens in the site's theme

A, the site keeps writing raw values and the `--ds-*` tokens stay mirrors. B, the values move into `@theme` in `globals.css`. *Scope:* A, none, with the assertions watching for drift. B, every site file, one page at a time. *Recommend B, as its own pass.* Only B ends the drift the audit found (a local copy of the ease in every file that uses it, the navies a point apart) rather than watching it, and the guide's assertions give each page a check before it ships.

#### 8. The mono family

A, leave `--font-mono` unmapped. B, map it to JetBrains Mono, which the site already loads. *Scope:* A, none. B, one line in `@theme`. *Recommend B.* The system mono in the player card footers is an accident of the theme, not a choice, and it puts two monos on one page.

#### 9. The card sheen

A, keep the site's sheen with its mask and drop-shadow filter. B, redraw it with background layers only. *Scope:* A, none. B, the `.sheen` rules in `globals.css`. *Recommend B.* The sheen is decoration, and the compositor cost of its mask and filter falls on the whole page for as long as a job card is on screen.

#### 10. FAQ open behaviour

A, several answers open at once. B, one at a time. *Scope:* A, none. B, the open state in Faq.tsx. *Recommend A.* The questions run in pairs (what it is, how it differs from ChatGPT), and a reader comparing two answers should not lose the first.

**Closing a decision.** The owner picks an option, the change ships on the site with its own review, the entry moves to the changelog with its date, and it leaves this chapter.

### 10.4 Conventions

How the system and its guide are kept, so the next part goes in the way the last one did.

#### House conventions

- **One token, one value.** A value earns a `--ds-*` name the first time a second part needs it. One name per value means a change happens in one place and a search finds every use.
- **Say it once.** [Chapter 0](#0-about-this-document) sets the split between this document and the guide. When the two disagree, the guide's rendering is the fact and the chapter is out of date.
- **Measure, do not transcribe.** A typed number is right on the day it is typed and wrong from the next edit. Reading it from the DOM or the source keeps it current, and an assertion covers the rare value that has to be copied by hand (a timing a component keeps private), so a source change turns Coverage red rather than leaving a wrong figure on show.
- **Effects are ambience, not content.** Because no copy and no control waits on an effect, the guide can pause one to keep its WebGL budget and the site can drop one under reduced motion, and a visitor loses nothing they came for.
- **Nothing loops unattended.** An idle loop off screen spends battery and GPU time on no one, and a loop that ignores reduced motion overrides a choice the reader has already made.
- **Real parts only.** Importing means the guide breaks the day the site changes, which is the point. Parts the site lacks carry no "proposed" tag, because a tag invites a second, looser standard for what ships.

#### Adding to the guide

1. **Catalog first.** A section missing from the catalog has no nav link, no place in the page and no row in the counts. Covers list only what the section really shows, because the index card and Coverage count them.
2. **One section file, under 300 lines.** It exports `<Id>Section` and is listed in `sections/registry.tsx`, the one map the page renders from, so a section outside it never shows. Split a long section into siblings in the same folder.
3. **Assert what you write.** Any value copied from the site's source by hand gets an assertion.
4. **Declare the cost.** WebGL and iframes mount through HeavySlot or ViewportPreview with their cost, so the page keeps to its budget of 8 GL units, 1 floor and 8 frames.
5. **Ids once.** A site id (`understands`, `faq`, `get-access`, `jobs`) renders once on the guide and is listed in the section's renders. `#players`, `#model-line` and `#site-head` never render, because the site's scroll and header code looks them up on the document.
6. **Write the chapter.** A partial in `docs/design-md`, named after the section's id, with the reasons in this document's voice. Then rebuild DESIGN.md, as [chapter 0](#0-about-this-document) describes.

#### Code rules, and why

- **Prefixes.** The guide shares a document with the site's globals, so an unprefixed class could restyle a shipped part with no one noticing. `ds-` classes and `--ds-*` tokens make that impossible by name.
- **Compositor rule.** The guide page holds more live effects than any page of the site, so the Mac Chrome cost of one blur or mask there is larger, not smaller.
- **Accent fill.** A guide that breaks the owner rule in its own chrome teaches the opposite of the rule it documents.
- **300 lines.** A file that fits on a few screens can be reviewed whole, and a split forced early lands on a natural seam rather than a desperate one.
- **Punctuation.** Commas, colons and full stops carry every sentence, so comments, the guide and these chapters read in one voice.
- **Quoted copy.** The guide must not invent brand copy, so a specimen says what the site says or says something plainly filler.

### 10.5 Changelog

Dated entries, newest first. An entry says what changed and, when it is not plain, why. A decision from Decisions pending ([10.3](#103-decisions-pending)) lands here on the day it ships. This partial is the one source of the changelog: the guide's Changelog section reads its entries from here as the page builds, so the guide and this document cannot tell the same day two ways. Write a `#### YYYY-MM-DD` heading and one bullet per change, then rebuild DESIGN.md.

#### 2026-10-05

- The players' magnet goes back to how it was before the catch in script below: outside desktop Safari it is the CSS scroll snap alone, which catches only a scroll that ends near the players, and desktop Safari keeps its catch on Lenis at 0.3 of a screen over 0.6s. The 0.6-screen catch kept pulling the page back to the players as the visitor scrolled away. Shell behaviours ([6.7](#67-shell-behaviours)), Accent water ([5.9](#59-accent-water)), Scroll line to players ([9.3](#93-scroll-line-to-players)), Page composition ([9.5](#95-page-composition)), Choreography ([4.5](#45-choreography)), Reduced motion ([4.6](#46-reduced-motion)) and Known gaps ([10.2](#102-known-gaps)) follow.
- The comparison's names become each card's heading in Outfit 34 (26 on a phone) beside 44px marks (36 on a phone), and its lines become body text in Inter 18 at 1.5 (16 on a phone). Comparison cards ([7.12](#712-comparison-cards)) and Type ([2.4](#24-type)) follow, and Known gaps ([10.2](#102-known-gaps)) records that the names are spans, not headings.
- The players' doodles start 1s after the section is in view, and the portrait switches between Human and AI every 5s, so the hand now ends just after the first switch. Doodles ([5.11](#511-doodles)), Human / AI swap ([5.10](#510-human--ai-swap)), Scroll line to players ([9.3](#93-scroll-line-to-players)) and Choreography ([4.5](#45-choreography)) follow, the last with a players clock.
- On a dense screen (devicePixelRatio 1.5 and up) wider than 1920 the players' content scales up to 1.35. Scroll line to players ([9.3](#93-scroll-line-to-players)), Responsive ladder ([9.6](#96-responsive-ladder)) and Layout and breakpoints ([2.6](#26-layout-and-breakpoints)) follow, with density as a fourth axis.
- The players' magnet gains a catch in script in every browser: a scroll that rests within 0.6 of a screen glides in over 0.6s, where the CSS snap alone caught only a scroll ending very near. Shell behaviours ([6.7](#67-shell-behaviours)), Accent water ([5.9](#59-accent-water)), Page composition ([9.5](#95-page-composition)) and Reduced motion ([4.6](#46-reduced-motion)) follow.
- The resting tiles' walls darken toward the foot and their tops' rear corner 8%, baked into the frost, and both raised slabs hold their dark foot over the lower 30% with a foot shade in each state. Tile states ([5.3](#53-tile-states)), The glass tile floor ([5.2](#52-the-glass-tile-floor)) and Activation sweep ([5.4](#54-activation-sweep)) follow.
- The full view's "Loading" label turns slate-500, about 3.8:1 on the hero grey, still under the 4.5:1 bar. Known gaps ([10.2](#102-known-gaps)), Load-in, autoplay and loaders ([5.6](#56-load-in-autoplay-and-loaders)) and Contrast ([2.3](#23-contrast)) follow.
- DESIGN.md's build checks the site values its partials quote against their source files (`tools/design-md/facts.mjs`), so a value that drifts from the site fails it.

#### 2026-10-02

- The comparison cards set each line whole in its card's one ink, navy on the grey and white on the navy, where the verb used to sit in a softer ink (site commit 1184ee4). The vs word grows to Outfit 34 (27 on a phone) at ink 30%, lifted 0.07em into the disc's optical middle (2e092b0). Comparison cards ([7.12](#712-comparison-cards)) and the ink ladder of Colour roles ([2.1](#21-colour-roles)) follow: the 45 step is the touch-target key, the 40 step dashed guide outlines, and the 30 step the leader line and the vs word.
- Decisions pending gains two calls, [decision 2](#2-white-labels-on-the-accent) on white labels on the accent and [decision 3](#3-dots-on-a-light-ground) on dots on a light ground, and each decision is now a heading, so a citation links to it. The index card's pin dots turn navy, so the card holds no accent fill.
- The press and grow scales become tokens, Press and grow scales ([3.29](#329-press-and-grow-scales)), and the parts read them instead of copying the numbers.
- DESIGN.md's build gains a `--check` mode, and a semicolon, a reference to nothing, a reference whose lead-in is not its target's title, a catalog number out of order or a partial nothing reaches now fails it, so the file cannot drift from its partials unseen. A reference into [chapter 3](#3-tokens-reference) is checked like any other.
- The design system and its guide, at `/design-system`, in groups from Start to Meta. Shipped parts are imported from the site, and the parts it lacked are built in its language and shown the same way.
- Tokens start as mirrors: they name the site's raw values without changing the site, until the theme decision is made.
- This document: one partial per guide section, plus the tokens reference ([chapter 3](#3-tokens-reference)) and the accent rule ([chapter 8](#8-the-accent-rule)), assembled into DESIGN.md.
- The screen library gains a System row with a card to the guide.
