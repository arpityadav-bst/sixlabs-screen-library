# The design system guide kit

The guide is one long page at `/design-system`, plus a bare page per part at `/design-system/frame/<part>` for iframes. This file is the kit's whole API. Read it before you write a section.

## Folder layout

```
src/app/design-system/
  (guide)/layout.tsx        guide chrome (GuideShell) + TokenStyle + the five kit stylesheets + metadata
  (guide)/page.tsx          force-static, renders every section in catalog order, refuses to build on a problem
  frame/layout.tsx          bare page: TokenStyle and ds.css only
  frame/[part]/page.tsx     one part per page, generateStaticParams over PARTS, dynamicParams false
  frame/_parts/ids.ts       PARTS, PartId, isPart and frameHref (no components, so client code can import it)
  frame/_parts/index.ts     FRAME_PARTS, every part id to its component (tsc fails on a missing one)
  _data/catalog.ts          the single source: GROUPS, SECTIONS, lookups, counts, checks (pure data)
  _data/catalog-types.ts    the catalog's types, SITE_IDS and the cover helpers (site, tiles, sys)
  _data/catalog-*.ts        the entries, one file per group or two
  _data/catalog-check.ts    the checks that read the source (server only)
  _data/specimens.ts        specimen copy a section and a frame part both show
  _kit/                     this kit (components, helpers and the five ds-*.css stylesheets)
  sections/registry.tsx     catalog id to section component
  sections/<group>/<file>   one file per section
```

Import with the alias, for example `import { Spec } from "@/app/design-system/_kit/Spec"`.

## Rules every section follows

- **The live site does not change.** Never edit `src/components/website/**`, `src/components/tiles/**`, `src/tiles/**`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/website/**`, `src/app/6labs-fullview/**`, `src/app/tiles/**`, `public/**`, `next.config.ts` or `package.json`.
- **Real parts only.** A specimen of a shipped part imports it from `@/components/website/...` or `@/components/tiles/...`, or frames a real route. Never copy its markup or class strings.
- **New parts look shipped.** A part from `src/components/design-system` is shown exactly like a shipped one. No "proposed" or "shipped" tags anywhere.
- **Chrome is ds- prefixed.** Guide classes start with `ds-`. Section CSS goes in a CSS module beside the section (`button.module.css`), and its class names still start with `ds-`. Nothing may restyle the site.
- **Compositor rule.** No `backdrop-filter`, `mix-blend-mode`, CSS `mask`, CSS `filter` or `blur` anywhere in new code.
- **Accent rule.** Accent-blue `#1a6dff` fills only on players grounds (`ground="on-blue"`), the water specimen and Don't panels. Selected and checked fills are navy `#0a152d`.
- **Copy.** No em dash (U+2014) and no semicolons in prose or comments (code is fine). Present tense, reasons not adjectives. Specimen text is quoted from the site's source or is obvious filler.
- **Values live in data.** Rows for KeyRows and SpecTable come from a `_data` module, never inline literals. Exact values go in the SpecDrawer, not in the role line.
- **WebGL goes in HeavySlot.** TileFloor, the liquid, the swap-gl portrait and the accent water canvas mount only inside the measuring kit's HeavySlot.
- **Ids.** The guide document must never render `#players`, `#model-line` or `#site-head`. If a section mounts a site part that carries an id (`understands`, `faq`, `get-access`, `jobs`), list that id in the section's `renders` in the catalog, so two sections never mount the same one. A Spec `id` must not equal a site id or a catalog id.
- **Files stay under 300 lines.** Split before that.
- **Never name a file under `sections/` after a Next special file**: `page`, `layout`, `loading`, `error`, `template`, `not-found`, `default`, `route`, `global-error`, `forbidden`, `unauthorized`. `sections/` is a plain folder inside `app/`, so such a file becomes a real route or boundary. That is why three plan files moved (see below).
- **Check your own work** with `npx tsc --noEmit -p .` and `npx eslint <your files>`. Never run `next build`, a dev server or a browser.

## Adding a section

1. Add its entry to the group's `catalog-*.ts` file, in page order: `id`, `title`, `file`, `designMd` (its DESIGN.md number, which must keep the catalog's order, `build.mjs` warns otherwise), `covers`, and `renders` when it mounts a site part that carries an id. A Components entry takes a `sub`.
2. Write the file at `file`, exporting the section component under the name `sections/registry.tsx` imports (PascalCase of the id plus `Section`), and add the one registry line.
3. Write its DESIGN.md partial, `docs/design-md/<id>.md`, opening on a `### ` heading, and rebuild with `node tools/design-md/build.mjs`.

To split a big section, keep the main file exporting the section component and import siblings into it (`button.tsx` imports `button-matrix.tsx`). A section file is a server component unless it needs hooks. Add `"use client"` only to the leaf that needs it.

### The order of a section's specs

Specs run in one order everywhere, so sibling sections read alike: the part as it ships on the site first, then anatomy, variants, states, sizes, grounds, across widths (the ViewportPreview), and Do / Don't last, bare under its own `PartLabel`. Skip what a part does not have, never reorder what it does.

### Three files moved from the plan

| Section id | Plan path | Real path |
| --- | --- | --- |
| `layout` | `sections/foundations/layout.tsx` | `sections/foundations/layout-breakpoints.tsx` |
| `page` | `sections/patterns/page.tsx` | `sections/patterns/page-composition.tsx` |
| `loading` | `sections/components/loading.tsx` | `sections/components/spinner-skeleton.tsx` |

The catalog's `file` field is the truth for every section.

## The catalog (`_data/catalog.ts`)

The nav, the page order, the index card's counts and the coverage table read only this. It is pure data with no component imports.

| Export | What it is |
| --- | --- |
| `GROUPS` | `CatalogGroup[]`: `{ id, title, sections }` in page order |
| `SECTIONS` | every `CatalogSection` flat, in page order |
| `SECTION_IDS` | the ids in page order |
| `SectionId` | type, the closed union of ids (a typo fails tsc) |
| `sectionById(id)` | the entry: `{ id, title, group, groupTitle, sub?, file, designMd, designMdTitle?, renders?, covers }` |
| `statesOf(id, component)` | the states one section lists for one part (the index card's tile count reads it) |
| `isShipped(cover)` | true for `src/components/website` and `src/components/tiles` sources |
| `catalogCounts()` | `{ groups, sections, components, shipped, added, states }` (a part covered twice counts once). `src/app/page.tsx` hands them to the index card |
| `SITE_IDS`, `FORBIDDEN_IDS` | ids the site's own parts carry (a section's `renders` is typed from them), and the three the guide may never render |
| `INTERNAL_PARTS` | system parts that are pieces of another on purpose (CardTitle, DialogPanel, TooltipBubble, SelectPanel), which no section covers |
| `catalogProblems()` | data mistakes (duplicate ids, a site id used as a section id, a forbidden or doubled `renders`, an internal part covered, a state both shown and waived) |

`catalog-check.ts` adds the checks that read the source: every system part a section names as a spec `source` must be one of that section's covers, and a whole chapter's DESIGN.md heading must match the catalog (`designMdTitle` when it differs from the title). `(guide)/page.tsx` throws on any of these and on `tokenProblems()` at build. Each group carries a one-sentence `lead`, printed under its label.

A cover says which part a section specimens: `{ component, source, variants?, states?, na? }`. `component` is the export name the source scan reads. `na` lists owed states that do not apply (a field is never pressed, a link never disabled), which coverage counts as met. Write covers with the helpers from `catalog-types.ts`:

```ts
site("PrimaryCta", { states: "rest hover pressed" })      // src/components/website/PrimaryCta.tsx
site("HeroNumbers", { file: "HeroBits" })                  // export in a differently named file
tiles("TileFloor", { states: "default focused activated" }) // src/components/tiles/TileFloor.tsx
sys("Button", { variants: "primary secondary", states: "rest hover focus-visible" })
```

`variants` and `states` are space-separated, with a dash inside a name (`focus-visible`, `near-limit`). If your section shows a state or variant the catalog does not list, or drops one, edit that section's entry in its `catalog-*.ts` file. Only list what the section really shows, because the index card counts it.

## Page chrome (you do not render these)

- **GuideShell** (`GuideShell.tsx`, client): the 264px sticky sidebar plus the main column (toolbar, then sections capped at 1180px, padding 0 40px 160px). Under 900px the sidebar goes and the toolbar's Sections button opens the drawer. It holds the skip link to `#ds-content`, and mounts, once for the page, the system `Toaster`, the polite status region `announce()` writes to, and `GpuAwake`.
- **GpuAwake** (`GpuAwake.tsx`, client): one 1x1 high-performance WebGL context, started by the budget's first granted claim and then kept for the page's life, cleared twice a second while the page is in view, so a HeavySlot release is never the last high-performance context and a two-GPU Mac never switches GPUs mid-read. A reader who never nears a WebGL slot never wakes the GPU for it. Not a specimen, so outside HeavySlot and the budget.
- **Nav** (`Nav.tsx`, client): built only from the catalog. The brand goes to the guide's top (`#ds-content`) and a small Screen Library link under it leaves for `/`. Group labels, the Components and Signature effects sub-labels, one anchor per section. The current link carries `aria-current="location"` and a 2px navy bar, and stays in view inside the list's own scroll. The page prints the same group labels (as level-2 headings, with the group's lead) and sub-labels.
- **Drawer** (`Drawer.tsx`, client): the nav on narrow windows, a native `<dialog>` opened with `showModal`, so everything else is inert (the skip link and the toast region too). Solid ink 40% `::backdrop`, focus moves in, Escape, the veil, the close button and links close it, and focus then lands on the chosen section's h2. Under 600px it carries the Jump field. Links are 44px tall under 900px.
- **Toolbar** (`Toolbar.tsx`, client): sticky, 56px, z 30, solid page ground with a hairline. Group / section breadcrumb (the group name ellipsizes first), the Jump field and the reduced-motion pill in its short form, the full sentence in its title. Under 900px the Sections button is 44px tall. The WebGL ledger (`BudgetPill`) is a developer's reading, shown in the Compositor-safe rule section.
- **Jump** (`Jump.tsx`, client, haystack in `jump-hay.ts`): a combobox over the catalog and the token list: section titles, groups, sub-labels, every cover's export, every rendered site id, every token's CSS name under the section that shows its tier, and a few rule words (z-index, shadow, accent rule). A match found through anything but the section's own words names it on the option's right. `/` focuses it from outside a field (and claims the key only when it took focus). Escape clears the query, and on an empty field keeps focus in the toolbar or lets the drawer close. One always-mounted status line says the count once typing settles. Picking a section moves focus to its h2. Its keydown and keyup never reach window listeners.
- **go.ts** (client): `goTo(id)`, `scrollToSection(id)`, `focusHeading(id)`, and `announce(message)`, which says a short outcome ("Copied", "Copy failed") through the shell's status region.
- **SpyProvider and useCurrentSection** (`spy.tsx`, client): one IntersectionObserver (rootMargin `-GUIDE_TOP 0px -65% 0px`), first intersecting section in DOM order wins. `useCurrentSection()` returns the current `SectionId`. `guide-metrics.ts` holds `GUIDE_TOP` (72, the scroll offset, set on `.ds-root` as `--dsg-top`) and `GUIDE_NAV_BP` (900, where the drawer takes over).

## Section API

### Section, Sub, PartLabel (`Section.tsx`)

```tsx
<Section id="button" lead="The full button family, the shipped Try now first.">
  <Sub title="Sizes" lead="Optional one or two sentences.">
    <PartLabel>On blue</PartLabel>
    ...specs
  </Sub>
</Section>
```

| Prop | Type | Notes |
| --- | --- | --- |
| `id` | `SectionId` | the title and the DESIGN.md chip come from the catalog by this id |
| `lead` | `ReactNode` | one or two sentences, Inter 15/1.6, 68ch |
| `children` | `ReactNode` | |

`Sub` takes `title`, `lead?`, `children` and renders an h3 (Outfit 20/28). `PartLabel` renders an h4 (Inter 12/16 caps). Sections sit 96px apart and scroll to 72px under the top. A section is a plain `section` (no accessible name, so it is not a landmark), its h2 takes focus after a jump (`tabIndex={-1}`), and the chapter chip is a link that opens DESIGN.md (at the repo root) on GitHub at its heading, the anchor from `tools/design-md/slug.mjs`, the rule the build writes its headings with. `<SectionLink id="tile-states" />` links to another section by its checked id, its text the catalog title unless given. In a lead, role line, note, key row or table an unclassed link is ink with an underline (ds.css). A link inside guide prose takes no class.

### Spec (`Spec.tsx`)

The specimen panel. Read in three layers: the canvas at a glance, one role line, the drawer for depth.

```tsx
<Spec
  title="Try now"
  source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}
  props="children"
  role="One solid primary per view, because two read as a choice the visitor did not ask for."
  caption="xl · 52 · measured 52.0"
  drawer={{ values: CTA_VALUES, props: CTA_PROPS, code: CTA_CODE }}
  note="ClickLock keeps the press from navigating on the live page."
>
  <Canvas ground="page"><PrimaryCta>Try now</PrimaryCta></Canvas>
  <Canvas ground="container"><PrimaryCta>Try now</PrimaryCta></Canvas>
</Spec>
```

| Prop | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Outfit 16/24 |
| `source` | `SpecSource` | `{ from, name?, label?, file?, at? }`. One identity chip, `PrimaryCta · website/PrimaryCta.tsx:90`. `name` must be an identifier the file exports (checked at build), and the chip copies its import line. `label` names a point inside the file that is not an export ("the pill"), and the chip then copies the file's path. The line is read at build (`spec-lines.ts`): the export's own line, or with `at`, the line that text is written on (a needle with no closing brace), so it follows the file. A typed `line` number fails the build. `file` defaults to the path's last segment plus `.tsx`, and a file that does not exist fails the build |
| `props` | `string` | the props this spec varies ("variant size"), listed in the drawer |
| `chips` | `string[]` | the first shows in the head when it is a behaviour flag (WebGL, pointer only, live, frame, read at build). A first chip holding `--`, `:`, `/` or `=` is a name, so it goes to the drawer with the rest, and development warns |
| `role` | `ReactNode` | one sentence of why, 25 words at most |
| `level` | `3 \| 4` | title heading level, 4 inside a `Sub` |
| `caption` | `ReactNode` | a mono fact row under the canvases |
| `drawer` | `SpecDrawerProps` | renders a SpecDrawer at the panel's foot |
| `note`, `warn` | `ReactNode` | a Note or Warn just under the panel |
| `id` | `string` | an anchor for this spec, never a site or catalog id |
| `children` | `ReactNode` | one or more `Canvas`, or KeyRows / SpecTable directly (they get a 16px margin) |

The panel has `transform: translate(0)`, so a `position: fixed` part stays inside it, and `overflow: clip`, so a popover specimen needs a tall canvas.

### SpecHead and Chip (`SpecHead.tsx`, `Chip.tsx`)

Spec renders SpecHead for you. Use SpecHead alone only for a custom panel. It takes `title`, `source`, `chip`, `role`, `level`. The guide page wraps every section in `ExportLines` (the build-time line map), which the identity chip reads.

`Chip` (client) is a mono chip that copies itself on click (a green outline and `announce("Copied")` confirm it, so its name never changes). Props: `children: string`, `value?: string` (what to copy, the label by default), `label?: string` (its accessible name, which must hold the visible text). The section `chip` imports the system Chip too, so alias one of them: `import { Chip as KitChip } from "@/app/design-system/_kit/Chip"`. For a non-copying chip use `<span className="ds-chip ds-chip--static">`.

### RoleLine (`RoleLine.tsx`)

`<RoleLine>One sentence.</RoleLine>`, Inter 13/20 slate. Spec renders it from `role`. In development it warns in the console when a line runs over 25 words, when a sentence already appears on the page (role lines and notes are counted together), and on an em dash or a semicolon.

### Canvas (`Canvas.tsx`, client)

The product ground a part ships on.

```tsx
<Canvas ground="container" layout="grid" tall isolateKeys label="Button sizes">...</Canvas>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `ground` | `"page" \| "surface" \| "container" \| "footer" \| "grain" \| "on-blue" \| "navy" \| "terminal"` | `"page"` | `accent` is an alias of `on-blue` |
| `layout` | `"flow" \| "grid" \| "stack" \| "bleed"` | `"flow"` | flow wraps centred at gap 16, grid is auto-fit minmax(240px,1fr), stack is a column at gap 16, bleed has no padding |
| `tall` | `boolean` | | min-height 320 |
| `minHeight` | `number` | | any other floor in px |
| `isolateKeys` | `boolean` | | stops keydown at the canvas (use it round any field near the floor, which resets on R) |
| `label` | `string` | | names the canvas as a group |
| `className`, `style` | | | |

Grounds, each read from its token in `ds-spec.css`: page `--ds-color-page`, surface, container, footer (its 4% black over page), grain the site's real `.page-grain` class (480px floor), navy `--ds-color-primary`, terminal `--ds-color-terminal-bg`, on-blue `--ds-color-accent` under the water's 160px grey noise tile at 7% alpha (`noise-tile.ts`, which the frames on the water use too). Padding is 32, 24 under 768px. Two canvases in one Spec are split by a hairline. Navy and terminal set white type and lighten captions and kit buttons. On the blue no 12px text passes, so a caption there sits on a white pill and a kit button is the solid white pill. On container the caption takes the body ink.

### Label and Item (`Label.tsx`)

Captions carry facts, never reasons. `<Label>md · 40 · measured 40.0</Label>` is the mono caption line. `<Item label="md · 40">{specimen}</Item>` pairs one specimen with its caption in a figure. `align="start"` left-aligns it (centre by default).

### Note and Warn (`Note.tsx`, client)

```tsx
<Note>Under ClickLock the rows do not close the sheet.</Note>
<Warn>Pressing R anywhere on the window resets every character.</Warn>
```

Note (a quiet sunken panel) holds a fact the specimen cannot show. Warn (red) is kept for real traps, so it stays loud. Both take `children` and sit 4px tighter to the spec above. Spec's `note` and `warn` props render them for you.

### KeyRows (`KeyRows.tsx`)

```tsx
<KeyRows label="Window contracts" rows={WINDOW_EVENTS} />
// rows: readonly { key: string, value: ReactNode, source?: string }[]
```

For systems that cannot be shown. Keys mono 12, values Inter 13/20, `source` prints as a mono `file:line` after the value.

### SpecTable (`SpecTable.tsx`)

```tsx
<SpecTable caption="Ambient loops" columns={["Loop", "Period", "Travel", "Source"]} rows={LOOP_ROWS} mono={[0, 3]} minWidth={640} />
```

`columns: string[]`, `rows: ReactNode[][]`, `mono?: number[]` (column indexes set in mono), `caption?` (the accessible name), `minWidth?` (the width before it scrolls). It scrolls sideways in its own box, never the page.

### SpecDrawer (`SpecDrawer.tsx`)

A closed `details` whose summary names what it holds ("Values", "Values and code", "Props and code"). Usually passed as Spec's `drawer`, which also hands it the spec's `props` and its chips past the first, its title's level (the drawer's headings sit one under it) and its title (the copy button's name, "Copy Try now code").

| Prop | Type |
| --- | --- |
| `values` | `readonly { part, token?, value, source? }[]` |
| `props` | `readonly { name, type, default?, note? }[]` |
| `code` | `string`, the import plus a minimal usage, with a Copy button |
| `label` | `string`, the summary line, when the default does not fit |
| `children` | anything else, after the tables and before the code |

`CopyButton` (`CopyButton.tsx`, client, `text`, `label?`, `of?`) is the snippet's copy control if you need it elsewhere. `of` names what it copies.

### Drawer rows (`token-rows.ts`)

`tokenRow(part, name, source?)` makes a values row from a token (its value and source from `tokens.ts`), `siteRow(part, value, source, token?)` one from a value written in a site file, and `tokenValue(name)` reads one value. All three throw on an unknown token name, so a typo fails the build.

### DoDont, Do, Dont (`DoDont.tsx`)

```tsx
<DoDont>
  <Do reason="Navy carries the one primary, so the accent stays for attention." ground="page">
    <Button variant="primary">Request access</Button>
  </Do>
  <Dont reason="An accent fill outside the players section competes with the water.">
    ...
  </Dont>
</DoDont>
```

Each panel takes `reason`, `ground?`, `layout?`, `tall?`, `isolateKeys?`, `children`, and draws a 2px rule (green for Do, red for Don't), a Canvas, then the verdict and the reason. Both hold real components. A Don't panel is the one place outside a players ground where an accent fill may show.

### Replay (`Replay.tsx`, client)

```tsx
<Canvas ground="container"><Replay><TypedWord word="system" className="text-accent" /></Replay></Canvas>
```

Remounts its children on click. The kit ghost xs button sits at the top-right of the Canvas it is in, so use one Replay per Canvas. `label?` changes the button text, and its name says what it replays (`of`, else the title of the spec it sits in). Every motion specimen has one.

### useReducedMotionSetting (`reduced-motion.ts`, client)

`const reduced = useReducedMotionSetting()` returns the reader's `prefers-reduced-motion`, live, through the system's `useMedia`. False on the server and in the first paint. The toolbar pill reads it. The file also exports `noop`, for a specimen that needs a callback it never acts on.

### Kit button classes

Guide chrome buttons use `className="ds-btn"` (ghost xs, 28 tall, 12px label), with `ds-btn--line` for the outlined form. They take the kit focus ring (2px accent, 2px offset). Never use them as specimens of the system Button.

## Frame parts

A frame is a bare page at `/design-system/frame/<part>` with the root layout's fonts, the site's globals and the tokens, for an iframe (ViewportPreview). The names are `PARTS` in `frame/_parts/ids.ts`, each prerendered, and `FRAME_PARTS` in `frame/_parts/index.ts` maps every name to its component, checked with `satisfies Record<PartId, ComponentType>`, so a name without a part fails tsc. To add one:

1. Add the name to `PARTS` in `ids.ts`.
2. Write the part in `frame/_parts/`, one file per family (`shell-header.tsx` exports `HeaderRest`, `HeaderScrolled` and so on). Add `"use client"` where it needs effects. It renders real site components, mounts ClickLock where the site does, and keeps the page's width chain: a light section goes in `LightColumn` (`page-column.tsx`, main's gutter and clip with the grain bleeding over it, its grain starting 240px above the frame, past the fade, as deep in the page, except for Understands, which opens the block: `lead={false}`), any other part deep in the grained run stands in `GrainLead`, and a part on the water stands on `Ground tone="accent"`, which carries the water's grain. It never imports guide chrome, and data it shares with a section lives in `_data/specimens.ts`.
3. Add its line to `FRAME_PARTS`.
4. Point a ViewportPreview at it with `part="<name>"`, or build a URL with `frameHref(part, query?)`.

The signal helpers live in `frame/_parts/shell-signals.tsx`: `ScrollTo`, `Signal` (HERO_LOADED or "accentwave"), `ClickFirst`, `Spacer` and `Ground`. Their effects can be switched off from the frame's URL (`?y=0`, `?signal=off`, `?open=0`). Frames are separate documents, so a frame may render `#players` or `#site-head`.

## The measuring kit

Anatomy, StateGrid and Forced, SizeLadder, TokenSwatch and ContrastBadge, ViewportPreview, HeavySlot and the GL budget, EaseDemo, Timeline, useMetrics and Metrics are documented in `README-measure.md` beside this file. Their styles are `ds-measure.css` and `ds-chart.css`, imported in `(guide)/layout.tsx` after `ds-spec.css`. A new kit stylesheet is imported there after `ds-chart.css`.

## Build-time source reads

`source.ts` (server only) is the kit's one reader of the repo: `readRepo` (repo-relative, LF, cached), `lineAt`, `locate`, `filesIn`, `filesDeep`, `componentsOf`, `exportLine`, `resolveImport` and `reach`. A scanner in a section reads through it. `spec-lines.ts` builds the identity chips' line map from it, and `crop.module.css` holds the comparison crop the Comparison section and its frame share.

