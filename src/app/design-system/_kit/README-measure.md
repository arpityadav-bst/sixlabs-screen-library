# The measuring kit

The half of the guide kit that measures and previews. Every number it prints is read from the rendered DOM, so a part that drifts from its spec shows the wrong number in plain sight. Read `README.md` first for the page, the Spec panel and the rules.

| Name | File | Server section can use it directly |
| --- | --- | --- |
| `Anatomy` | `Anatomy.tsx`, `anatomy-measure.ts` | yes (pins are data) |
| `StateGrid` | `StateGrid.tsx` | yes, it has no state of its own, so `render` may be a function from a server file |
| `Forced` | `Forced.tsx` | yes, it has no state of its own |
| `SizeLadder` | `SizeLadder.tsx` | yes (rungs are data plus elements) |
| `TokenSwatch`, `SwatchGrid` | `TokenSwatch.tsx` | yes |
| `ContrastBadge`, `ContrastRow`, contrast maths | `ContrastBadge.tsx`, `contrast.ts` | yes |
| `ViewportPreview` | `ViewportPreview.tsx` | yes (`onLoad` needs a client section) |
| `HeavySlot`, `BudgetPill`, the budget | `HeavySlot.tsx`, `gl-budget.ts` | yes |
| `EaseDemo` | `EaseDemo.tsx` | yes for a bezier, a spring, `"glide"` or `"linear"`. A function ease needs a client section |
| `Timeline` | `Timeline.tsx` | yes |
| `useMetrics`, `Metrics` | `useMetrics.ts`, `Metrics.tsx` | `Metrics` yes, the hook in a client leaf |

Anatomy, StateGrid and SizeLadder render their own `Canvas`, so put them straight inside a `Spec`, not inside another Canvas. Timeline and SwatchGrid sit in a Spec with a 16px margin, like SpecTable.

## Anatomy

```tsx
<Spec title="Try now" source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}>
  <Anatomy ground="container" pins={CTA_PINS}>
    <PrimaryCta>Try now</PrimaryCta>
  </Anatomy>
</Spec>
// CTA_PINS in _data: { selector: "a", name: "Pill", token: "px 40 py 14", value: "52 tall", source: "PrimaryCta.tsx:90", padding: true }
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `pins` | `readonly AnatomyPin[]` | | from a `_data` module |
| `frame` | `true \| string` | | measure inside the first iframe in the specimen (a ViewportPreview), or the iframe matching the selector |
| `ground` | `Ground` | `"page"` | the Canvas ground |
| `layout` | `"flow" \| "stack"` | `"flow"` | flow centres and wraps at gap 16, stack is a full-width column (use it round a ViewportPreview) |
| `gutter` | `number` | `40` | the side margins the discs sit in |
| `minHeight` | `number` | | |
| `view` | `"anatomy" \| "specimen"` | `"specimen"` | the view it opens on: the clean part first, the overlay one switch away. Pass `"anatomy"` only where the spec is about the measures (the Overview's teaching panel). The foot's Specimen / Anatomy switch changes it |
| `legend` | `boolean` | `true` | |
| `label`, `isolateKeys` | | | passed to the Canvas |

`AnatomyPin`: `{ selector, name, n?, index?, token?, value?, source?, expect?, padding?, side? }`. `expect` is the text the cited line must contain (or a list of them across a cite that names several lines), so a cite that drifts onto a brace or a blank line fails Coverage. `selector` is a CSS selector inside the specimen (or inside the frame's document in frame mode), `index` picks the nth match, `n` overrides the disc number (the pin's place by default), `padding: true` draws the part's computed padding as hatched bands, `side: "left" | "right"` pins the disc to one margin (the nearer one by default).

Drawing: a 1px rgb(10 27 51 / 0.4) outline round each part over a 3px white 70% halo, a 20px navy disc with an Inter 12/600 white numeral in the side margin, and a leader to the part's nearer edge, level with the disc where it can be, haloed the same way. The hatch carries a line of each ink. So a pin reads on a navy part on a light ground as well as on a white one. Discs on one side never overlap (24px apart). The foot's Specimen / Anatomy switch is named after the canvas (`<label> view`). On navy, terminal and on-blue grounds the lines and discs turn white over a navy halo. The overlay is an SVG with `pointer-events: none`, so the specimen stays live under it.

Its watching lives in `anatomy-watch.ts` and runs only while the stage is within half a viewport of the screen (a specimen far off screen costs nothing, and it measures once more each time it comes near). It measures again on a resize of the stage or the window, on a DOM change inside the stage (a Replay remount, a HeavySlot going live), on a style or class write inside it (a motion entrance writes transform every frame, so those measure at most every 120ms and once more when the writes stop, the part at rest), at the end of any CSS animation or transition, on any load inside it, when fonts land, and inside a frame on the frame's own scroll, resize, DOM, style and class changes and animation ends (plus 300ms and 1200ms after its load, for late layout).

Legend rows: number, part, token, value, source. A pin's status shows under its part name: `pin lost: <selector>` in red when the selector matches nothing (the drift alarm, also warned once in the dev console), "not shown at this width" when it matches a zero-size or out-of-view element, "measures when the frame has loaded" in frame mode before load. The foot prints `5 pins · 1 lost · measured at 1100 wide`.

`anatomy-measure.ts` exports the React-free parts: `measurePins(stage, pins, frame?)` returns `Measured[]` (`{ status: "ok" | "hidden" | "lost" | "pending", box?, pad? }` in stage px), `layoutCallouts(pins, measured, width, gutter)` places the discs and anchors, and `padBands(box, pad)` gives the four padding rects. In a frame the frame's own rect gives the offset and the scale, so a scaled ViewportPreview needs no extra props, and parts outside its box count as hidden.

## StateGrid

```tsx
<StateGrid
  label="Button states"
  states={["rest", "hover", "focus-visible", "pressed", "disabled"]}
  variants={["primary", "secondary", "ghost"]}
  render={({ variant, force }) => <Button variant={variant} forceState={force}>Request access</Button>}
/>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `states` | `readonly S[]` | | the columns, in the order the catalog lists them |
| `variants` | `readonly V[]` | | the rows. Leave it out for one row with no row header |
| `render` | `(cell: { state: S \| "live", variant: V, force?: S }) => ReactNode` | | one instance per cell |
| `live` | `boolean` | `true` | adds the live column, rendered with `force` undefined |
| `liveCaption` | `string` | `"hover or Tab here"` | under the live instance |
| `ground` | `Ground` | `"page"` | |
| `label` | `string` | | the table's accessible name, required |
| `minCell` | `number` | `120` | the least column width. The grid scrolls sideways in its own box below that, the row heads held at the left, and the box takes a tab stop while it scrolls (`ScrollBox.tsx`, as SpecTable, Timeline and the drawer's code do). A cell for a state the row lacks renders `<None />` (`Label.tsx`) |
| `isolateKeys` | `boolean` | | |

**How a part reads a forced state.** Every forced cell is wrapped in `<div class="ds-sg-cell" data-ds-state="hover" inert>`. A new component in `src/components/design-system` takes the state in either of two ways:

1. the prop: `forceState?: "hover" | "pressed" | ...`, which the component turns into `data-force="hover"` on its own root, styled together with the real pseudo-class (`.x:hover, .x[data-force="hover"]`). This is the plan's way and the one to use.
2. the attribute: CSS keyed on the ancestor, `[data-ds-state="hover"] .x`, for a part whose props you cannot change.

Forced cells are `inert` (the cell is a `Forced` box, below), so they are out of the tab order and the pointer, and they never fight the real state. Each forced cell carries a screen-reader line outside the inert box ("primary, hover"), so a reader walking the table hears what the picture shows. Cells centre their part as a flex box, never through `text-align`, so block text inside a part keeps the start alignment it has on a page. The live cell is the only interactive one. A shipped part that cannot be forced (Tailwind `hover:`, motion values) gets a grid with `states={[]}` and the live column only, and its per-state values go in a KeyRows under it.

## Forced

```tsx
<Forced state="focus" label="Email field">
  <TextInput label="Work email" forceState="focus" />
</Forced>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `state` | `string` | | the state the picture shows, set as `data-ds-state` and read to a screen reader, required |
| `label` | `string` | | what the part is, read before the state ("Email field, focus") |
| `as` | `"div" \| "span"` | `"div"` | `span` inside phrasing content, such as an Anatomy pin |
| `className` | `string` | `"ds-forced"` | `ds-forced` is `display: contents`, so the wrapper never moves the specimen |

A forced specimen outside a StateGrid (a focus ring in Foundations, a field shown focused on a card, a tooltip held open in an Anatomy, a slider shown mid-drag) goes in `Forced`, the same inert box and screen-reader line a forced grid cell uses (StateGrid renders its forced cells through it). The part still takes its `forceState` prop. Without the wrapper the specimen is a live, tabbable control with its state already drawn, which a keyboard reader lands in and a pointer can fight. Canvas and Anatomy set no inert of their own. A specimen meant to be used stays outside it.

## SizeLadder

```tsx
<SizeLadder label="Button sizes" sizes={BUTTON_SIZES.map((s) => ({ name: s.name, spec: s.height, node: <Button size={s.name}>Request access</Button> }))} />
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `sizes` | `readonly { name, spec, node, select? }[]` | | `spec` in px, `node` the rendered size, `select` what to measure inside the rung (its first element by default) |
| `axis` | `"height" \| "width"` | `"height"` | |
| `ground` | `Ground` | `"page"` | |
| `label` | `string` | | names the Canvas as a group |
| `tolerance` | `number` | `0.05` | the drift that still reads as equal |

Each rung reads its target's layout border box through a ResizeObserver (a hover scale does not count) and prints `sm · spec 32 · measured 32.0`. A drift prints in red, with "drifts from the spec" for a screen reader. The specimens stand on one hairline.

## TokenSwatch, SwatchGrid, ContrastBadge, ContrastRow, contrast.ts

```tsx
<SwatchGrid label="Ink">
  {INK.map((t) => <TokenSwatch key={t.name} {...t} />)}
</SwatchGrid>
// { name: "--ds-color-ink", value: "#0a1b33", use: "headings and body", never: "fills", files: 41, source: "tokens.ts:12" }
```

TokenSwatch props: `name`, `value` (any CSS colour), `use?`, `contrast?` (the grounds to grade on: all four by default, a list, or `false` for a ground or fill token, so only text colours carry the row). The card keeps to what a glance needs. `never`, `files` and `source` are still accepted but no longer printed: they belong in the tier's drawer. The 56px swatch sits on a checkerboard when the value has alpha. When `name` is a custom property the swatch is drawn from the live variable (`var(--x, value)`), and if the page's value differs from the written one the card prints `live <value>` in red.

`ContrastBadge` props: `fg`, `bg` (a ground name or any colour), `bgName?`, `kind?`. It shows an "Aa" sample on the ground, the ratio to two decimals (rounded down, so it never reads as passing when it does not) and the grade: `AAA` from 7, `AA` from 4.5, `AA large` from 3, `fail`. With `kind="non-text"` (a ring, a field line, a mark) the sample is a line and the grade is 1.4.11's `3:1 pass` or `3:1 fail` (`nonTextGrade`). `ContrastRow` renders one colour's badges on a list of grounds (all four by default) and passes `kind` on.

`contrast.ts`: `CONTRAST_GROUNDS` (page, surface, container and navy, read from `color-page`, `color-surface`, `color-container` and `color-primary` in tokens.ts, `GROUNDS` kept as a deprecated alias), `GROUND_NAMES`, `isGround`, `parseColor` (hex 3/4/6/8, `rgb()` and `rgba()` in comma or space syntax), `composite`, `luminance`, `contrastRatio(fg, bg)` (alpha is composited over the ground first, `null` for an unparsable colour), `grade`, `formatRatio`, `groundColor`, `sameColor`.

## ViewportPreview

```tsx
<Spec title="Header at rest" source={{ from: "@/components/website/Header", name: "Header" }}>
  <Canvas ground="container" layout="stack">
    <ViewportPreview part="header-rest" title="Header at rest" height={96} widths={[375, 768, 1280, 1440]} />
  </Canvas>
</Spec>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `part` | `PartId` | | resolves to `/design-system/frame/<part>` (a type-only import, so the frame registry stays out of the bundle) |
| `src` | `string` | | or any same-origin route, `"/website"` |
| `title` | `string` | | the iframe's accessible name and the waiting card's label |
| `height` | `number` | | the frame's true CSS viewport height |
| `heights` | `Partial<Record<number, number>>` | | a different height at some widths, `{ 375: 720 }` |
| `widths` | `readonly number[]` | `375 768 1024 1280 1440 1920` | the switcher's widths (`VIEWPORT_WIDTHS`). One width hides the switcher |
| `width` | `number` | 1280 when listed, else the first | the width it opens at |
| `scrollTo` | `number \| string` | | after load and on each width change, scroll the frame to this y or to this selector's top |
| `fitHeight` | `boolean` | | fit the height to the frame's scrollHeight after load, and again whenever its content resizes (a font swap, an entrance, a part opening late). Only for content without vh heights, or it grows with itself |
| `interactive` | `boolean` | `false` | a preview meant to be operated. Off, the iframe is out of the Tab order and its body is inert, so a keyboard reader never lands in a scaled-down page |
| `gateInput` | `boolean` | on for `hero-full` and `/6labs-fullview` | keeps the pointer off the frame until its page sends HERO_LOADED (12s at most), because the full view cancels the wheel while it loads and the guide would stop scrolling under the reader's pointer |
| `crop` | `{ x, y, width, height }` | | show only this window of the frame, in its own CSS px |
| `cost` | `HeavyCost` | | what the target costs beyond the frame itself (`{ gl: 5 }`, `{ floor: true, gl: 5 }`) |
| `poster` | `string` | | a still for the waiting card |
| `onLoad` | `(frame) => void` | | client sections only |

The iframe is laid out at the true width and height and scaled into the panel with `transform: scale(panel / width)` from the top left (transform only). The box keeps the frame's aspect ratio before any script runs, so nothing jumps. Inside, the media queries, scroll and window events are the frame's own. It mounts through HeavySlot with `frames: 1` plus `cost`. The caption reads `1280 × 96 · scale 0.86` (plus the crop). Put an Anatomy round it with `frame` and `layout="stack"` to pin inside it.

## HeavySlot, BudgetPill, gl-budget.ts

```tsx
<HeavySlot cost={{ gl: 1, floor: true }} label="The tile floor" height={560} poster="/tiles/...">
  <TileFloor className="..." />
</HeavySlot>
```

| Prop | Type | Notes |
| --- | --- | --- |
| `cost` | `{ gl?: number, floor?: boolean, frames?: number }` | what it holds while live |
| `label` | `string` | read on the waiting card |
| `poster` | `string` | a still from `public/`, behind the card |
| `height`, `minHeight`, `fill` | | the box, the same live and waiting. `fill` takes the parent's height. Without any, the card is 240 tall |
| `className`, `style`, `children` | | children mount only while live |

The budget is one module ledger with three pools: 8 WebGL units, 1 tile floor, 8 live iframes (`CAPACITY`). A slot claims its cost when it comes within half a viewport and releases it when it is more than one and a half viewports away, so a slot on the edge never flickers. A third observer tells the ledger when a slot is on screen (`see`). A claim that does not fit waits in a queue, and when room frees the waiting claims on screen, then the nearest, are granted first. A waiting claim that comes into view evicts holders that are off screen, least recently seen first, so a slot in view never waits behind one out of it, and the same promotion runs again whenever a holder scrolls off screen and after every release. While waiting, the card reads `Paused to keep the page light: 3 live views` with a Show live button (named `Show live: <label>`), which evicts the holders in its way, off screen ones first. An evicted holder rejoins the queue and comes back on its own when room frees. Show live hands focus to the specimen's first focusable part, else to the slot itself (`tabIndex -1`, the kit ring). Only the waiting card reads the ledger's count, so a claim never re-renders a live slot. A cost bigger than a whole pool still fits that pool when it is empty.

On release the specimen unmounts first (its own cleanup runs), then every WebGL context that was inside, including canvases inside same-origin frames, is lost through `WEBGL_lose_context` (accentWaveGL, swapGL and createLiquid have no dispose), and every iframe is blanked. Contexts are found without making any: a canvas that answers `getContext("2d")` holds none, and only one that does not is asked for its WebGL context. The guide's own GpuAwake context outlives every release, so letting a high-performance renderer go never switches a two-GPU Mac's GPU.

`gl-budget.ts` also exports `claim`, `release`, `touch`, `see`, `force` (for a gate of your own), `onBudget(cb)` and `budgetNow()` for code outside React (GpuAwake), and `useGlBudget()`, which returns `{ gl, floor, frames, live, waiting }`, zero on the server. `BudgetPill` prints `GL 3/8 · floor 0/1 · frames 2/8`, a developer's reading mounted in the Compositor-safe rule section, not in the toolbar.

## EaseDemo

```tsx
<EaseDemo label="out" ease={[0.22, 1, 0.36, 1]} duration={0.6} caption="cubic-bezier(0.22, 1, 0.36, 1) · 9 local copies" />
<EaseDemo label="glide" ease="glide" duration={1.4} />
<EaseDemo label="Mode toggle thumb" ease={{ stiffness: 500, damping: 40 }} />
```

Props: `label`, `ease` (a cubic-bezier tuple, a spring `{ stiffness, damping, mass? }`, `"glide"` for the real `easeOut` from `@/components/website/glide`, `"linear"`, or a function in a client section), `duration?` (seconds, 0.6 by default, a spring settles in its own time), `caption?` (by default the curve and duration, or the spring and its settle time).

It plots progress over time as a 120 by 80 curve (1.5px navy), with dashed guides at 0 and 1 so an overshoot shows. Run sends a 12px navy dot along a 240px track through motion's `animate`, with the same curve, duration or spring. `cubicBezier(tuple)` is exported for other plots.

## Timeline

```tsx
<Timeline label="Container hero intro" axisLabel="from first paint" lanes={HERO_INTRO} />
// HERO_INTRO: [{ label: "Copy", items: [{ label: "fade", at: 0, to: 0.6 }] }, { label: "Tiles", items: [{ label: "wait", at: 0, to: 0.5 }, { label: "rise", at: 0.5, to: 1.4 }, { label: "numbers", at: 1.2 }] }]
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `lanes` | `readonly { label, items: { label, at, to? }[] }[]` | | an item with `to` is a duration, without it a mark |
| `unit` | `"s" \| "ms"` | `"s"` | |
| `axisLabel` | `string` | `"seconds"` | the axis name in the label column |
| `start`, `end`, `step` | `number` | 0, the last time rounded up, a round step for about 8 ticks | |
| `second` | `{ label, factor, unit?, step? }` | | a second clock under the chart, its value is the time times `factor` (the floor's wall clock is `factor: 1 / 1.69`) |
| `times` | `boolean` | `true` | prints each item's time with its label ("rise 0.9s from 0.5s", "numbers at 1.2s") |
| `label` | `string` | | the chart's accessible name |
| `minWidth` | `number` | `560` | it scrolls sideways in its own box below this |

Each item has its own row inside its lane, so labels never collide. A mark is a 10px navy dot, a duration a 6px bar in rgb(10 27 51 / 0.15) with a navy start cap.

## useMetrics and Metrics

```tsx
const [ref, caption] = useMetrics<HTMLHeadingElement>();   // client leaf
<h1 ref={ref} className="...">Own an AI that works for you</h1>
<Label>{caption}</Label>

<Metrics source="Hero.tsx:88"><h1 className="...">...</h1></Metrics>  // server section
```

`useMetrics<T>()` returns `[ref, caption, metrics]`. The caption reads `44px / 500 · -0.025em · 1.1 · Outfit` (size / weight · tracking · line height over size · family), from `getComputedStyle`, and is read again on window resize because the site's sizes change at its breakpoints. It is `""` until measured. `Metrics` wraps a specimen and prints the line of its first element (or `select`) as a Label, with an optional `source`. `metricsOf(el)`, `metricsCaption(m)` and `familyName(stack)` (strips quotes and next/font's hash) are exported too.

## KitSeg

`KitSeg` (`KitSeg.tsx`, client) is the kit's segmented switch for chrome (Anatomy's view, the preview widths): `options: { value, label }[]`, `value`, `onChange`, `label`. One tab stop, arrows, Home and End. The selected segment is navy. It is never a specimen of the system Segmented.
