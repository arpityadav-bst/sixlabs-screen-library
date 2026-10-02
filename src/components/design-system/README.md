# 6labs system components

The tokens and the shared atoms every section reuses. They are new parts the site lacks, built in the site's own language (Tailwind classes, navy and white on the light grounds, Inter labels, the one ease), and the guide shows them exactly like shipped ones. Nothing here restyles the site: every value reaches the page as a `--ds-*` custom property, and the site reads none of them.

Import with the alias, for example `import { Button } from "@/components/design-system/Button"`.

## Rules

- **Mount TokenStyle first.** Every atom reads `var(--ds-*)`. `(guide)/layout.tsx` and `frame/layout.tsx` mount `<TokenStyle />`, so anything inside the guide or a frame has the values. A page outside them (the index card) mounts its own.
- **Values live in tokens.ts.** A new value goes into a `token-*.ts` file with its role, use, misuse and source, and reaches CSS through TokenStyle. Never write a raw hex in an atom.
- **Selected is navy.** No atom fills with the accent `#1a6dff`. The status dot is the one accent fill a light ground carries.
- **Compositor rule.** No `backdrop-filter`, `mix-blend-mode`, CSS `mask`, CSS `filter` or `blur`. The xl sweep draws its dots on the site's own CtaDots canvas.
- **Files stay under 300 lines.** Class maps live in `*-styles.ts` beside their component.

## Tokens (`tokens.ts`)

Each token is `{ name, value, role, useFor, neverFor, source, utility?, srgb?, css? }`. `source` is the `file:line` from `src/` it mirrors, or `"system"` for an addition the site has no value for. `utility` is the Tailwind class the site writes. `srgb` is the hex of an oklch or alpha value, for contrast maths. `css: false` keeps a token out of the CSS (springs, the sheen bloom that only a filter could draw).

| Export | What it is |
| --- | --- |
| `TOKEN_GROUPS` | `{ id, title, tokens }[]` in guide order |
| `ALL_TOKENS` | every token, flat |
| `tokenByName(name)` | one token, or undefined |
| `tokenProblems()` | duplicate names, empty when sound |
| `cssVar(name)` | `"var(--ds-<name>)"` |
| `TYPE_ROLES` | `TypeRole[]`: `{ name, family, weight, size, leading, tracking, caps?, tabular?, steps?, role, useFor, neverFor, source, classes }` |
| `typeStyle(name)` | an inline style object reading a role's `--ds-type-*` properties |
| `MEDIA` | the media query for each step key (`md`, `min-1600`, `max-md`, `short` and so on) |
| `EASE_OUT`, `EASE_SWEEP`, `ICON_STROKE`, `IconSize` | raw values for JS |

Every token prints as `--ds-<name>`, for example `--ds-color-ink`. The full list, with each value, role, use, misuse and source, is chapter 3 of `DESIGN.md` (Tokens reference), and the data itself is the `token-*.ts` files that `tokens.ts` gathers. This README keeps no copy of the list, so it cannot drift from them. Each type role also prints `type-<role>-case` and `type-<role>-numeric`, which `typeStyle` reads.

### TokenStyle (`TokenStyle.tsx`, server)

`<TokenStyle selector?=":root" />` prints one `<style>` with every token and type role. `tokenCss(selector)` returns the same text for anything that needs it as a string.

## Shared helpers

| File | Exports |
| --- | --- |
| `motion.ts` | `EASE` `[0.22,1,0.36,1]`, `EASE_CSS` (written from it), `DUR` `{ press, exit, quick, ui, line, panel, rise, sweep }` in seconds, `SPRING` `{ press, thumb, pop }` as motion transitions, `SCALE` (one press or grow scale per job, read from the SCALES tokens, which classes read as `--ds-scale-press-*`), `RISE` (rise-y over dur-rise). A name missing from the tokens throws. |
| `control-heights.ts` | `CONTROL_HEIGHTS`: every control height and the sizes of each family that reach it, read from each family's own size map. Every family counts its outer box, so Segmented stands 40 / 44 / 48 (its segment plus the track's 4px inset). Size names differ by family (a field's md is 44, a button's md is 40), so line controls up by height, never by name |
| `focus.ts` | `FOCUS` (accent), `FOCUS_INVERSE` (white, on blue), `FOCUS_DARK` (#6ea8ff, on navy and the terminal), `FOCUS_CARD` (3px offset), `FOCUS_INSET` (inside, for scroll rows), `FIELD_FOCUS` (border and 3px halo), `focusRing(tone)` |
| `force.ts` | `ForceState`, `forceAttr(state)` (the data-force value), `forces(state, ...names)` |

### Forced states

Every atom takes `forceState` for the StateGrid. `hover`, `focus` (or `focus-visible`), `pressed` and `remove-hover` print as `data-force`, and each class has a `data-[force=...]` twin of its pseudo-class, so a forced cell looks like a real one. `disabled`, `loading`, `selected` and `toggled` switch the real props on. `rest` prints nothing. Write your own classes the same way: `hover:x data-[force=hover]:x`, and pair a ring from `focus.ts`.

## Atoms

All take `className`. The ones with hooks are client components, the rest render on the server or the client.

### Button (`Button.tsx`, client)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "ghost" \| "link" \| "destructive" \| "destructivePrimary" \| "inverse" \| "glass"` | `"primary"` | inverse and glass sit on the accent ground and take the white ring |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | 28 / 32 / 40 / 48 / 52 tall, label 12 / 13 / 14 / 15 / 15, icons 14 / 16 / 16 / 18 / 18, xl min-width 220 |
| `leadingIcon`, `trailingIcon` | `LucideIcon` | | sized and stroked from the icon ladder |
| `loading` | `boolean` | `false` | aria-busy, label at opacity 0, centred Spinner, clicks ignored |
| `selected` | `boolean` | unset | a toggle (aria-pressed) on secondary, tertiary and ghost, each filling navy. Leave unset on a plain action |
| `disabled` | `boolean` | `false` | opacity 0.4, not-allowed. On a link it drops the href and sets aria-disabled |
| `fullWidth` | `boolean` | `false` | |
| `href` | `string` | | an anchor, a Next Link when it starts with `/` |
| `onClick` | `(e) => void` | | |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | |
| `forceState` | `ForceState` | | |
| `aria-label` | `string` | | |

Primary is navy `#0a152d`, hover `#0c1e42`, and grows to 1.04 at lg and xl (1.02 below) on the press spring 400/25. Pressed is 0.97 at every size. Hover answers only a live button, never a disabled, aria-disabled or busy one. Glass has no fill at rest, so its white label sits on the blue itself. Under reduced motion the grow and the press are dropped and the colours stay. At xl the shifted fill and the CtaDots band sweep it over 1s (`ButtonSweep.tsx`: `ButtonSweep`, `useButtonSweep(ref)`, `SWEEP_BAND`), on hover and on keyboard focus. Reduced motion keeps the shift and drops the band. The shipped `PrimaryCta` stays the hero's call to action.

### ButtonGroup (`ButtonGroup.tsx`)

`align?: "start" | "end" | "between"` (end), `children` in reading order with the primary last. Gap 12. Under 400px it stacks at full width with the primary on top.

### IconButton (`IconButton.tsx`, client)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `LucideIcon` | required | |
| `label` | `string` | required | the accessible name, and the widening label with `showLabelOnHover` |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | 28 / 32 / 40 / 44 / 48, icons 14 / 16 / 18 / 18 / 20 |
| `variant` | `"elevated" \| "outline" \| "ghost" \| "glass" \| "solid"` | `"ghost"` | elevated is BackToTop's, outline the wave pill's, glass the carousel arrows' |
| `selected` | `boolean` | unset | toggled: navy fill on elevated, outline and ghost, white with a navy icon on glass. Solid is an action only: it ignores selected (with a warning in development) |
| `toggledIcon` | `LucideIcon` | | cross-fades in with a quarter turn over dur-quick (160ms) |
| `loading`, `disabled` | `boolean` | `false` | loading swaps the icon for a same-size Spinner |
| `showLabelOnHover` | `boolean` | `false` | the label widens 0 to 80px on hover or keyboard focus |
| `href`, `onClick` | | | as Button |
| `badge` | `ReactNode` | | a pinned count Badge or a StatusDot |
| `forceState` | `ForceState` | | |

Pressed is 0.94 on the press spring.

### TextLink (`TextLink.tsx`)

`href` (required), `tone?: "inherit" | "ink" | "muted"` (inherit), `external?` (ArrowUpRight 14, new tab, rel noopener, a hidden note), `arrow?` (ArrowRight 14 that moves 2px on hover), `onClick?`, `forceState?`, `children`. A 1px underline in color-line-strong, offset 3 under 15px and 4 from 15px, accent text and underline on hover over 300ms. A Next Link for paths that start with `/`.

### Chip (`Chip.tsx`, client)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `kind` | `"filter" \| "choice" \| "input"` | `"filter"` | filter is a toggle button (aria-pressed), choice a radio (aria-checked, the radiogroup owns the arrow keys), input a value with a remove button |
| `selected` | `boolean` | `false` | navy fill with a Check 14 that grows in over 200ms |
| `onToggle` | `(next: boolean) => void` | | |
| `onRemove` | `() => void` | | input: the remove button, Backspace or Delete. The chip collapses over 160ms first. Set input chips in ChipInputGroup, which moves focus on |
| `icon` | `LucideIcon` | | at 14 |
| `avatar` | `ReactNode` | | a 20px Avatar |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 28 / 32 / 36 |
| `ground` | `"light" \| "onBlue"` | `"light"` | onBlue sets the white label on the blue itself inside a white 40% line, selected turns white with ink text |
| `tabIndex` | `number` | | a choice chip's place in its group's one tab stop, set by ChipGroup |
| `disabled` | `boolean` | `false` | |
| `forceState` | `ForceState` | | adds `remove-hover` |
| `children` | `string` | required | the label, also in the remove button's name |

### ChipGroup (`ChipGroup.tsx`, client)

`options` (`{ id, label, icon?, disabled? }[]`), `value` (or null), `onChange(id)`, `label` (the accessible name), `size?`, `ground?`, `disabled?`. The radiogroup round choice chips: one tab stop on the picked chip, the arrows move the pick and wrap, Home and End reach the ends, as Segmented does.

### ChipInputGroup (`ChipInputGroup.tsx`, client)

`items` (`{ id, label, icon?, avatar?, disabled? }[]`), `onRemove(id)` (the caller drops it from items), `label` (the accessible name), `size?`, `ground?`, `fallback?` (a ref to focus once the set is empty, usually the field that adds values). A labelled group of input chips. When a value goes while focus is in the set, focus moves to the remove button now in its place, or the one before, or the fallback, so it never drops to the page.

### Badge (`Badge.tsx`)

`tone?: "neutral" | "live" | "success" | "warning" | "danger" | "inverse" | "onBlue"` (neutral), `size?: "sm" | "md"` (18 / 22), `dot?`, `pulse?` (on by default for live), `children`. Labels are JetBrains Mono 11 caps at 500 in both sizes. Status tones sit on 8% tints. The count form: `count` (99+ past 99), `pinned` (top-right of a relative parent, 4px out), `label` (the accessible name a bare number lacks).

### StatusDot (`StatusDot.tsx`)

`size?: 6 | 8` (8), `tone?: "live" | "idle" | "success" | "danger"` (live), `motion?: "ping" | "pulse" | "none"` (none). Live ping is the hero's social-proof pair, live pulse the player card's running dot. aria-hidden, still under reduced motion.

### Spinner (`Spinner.tsx`)

`size?: 8 | 12 | 16 | 20 | 24` (16, borders 1 / 1.5 / 1.75 / 2 / 2), `tone?: "inherit" | "quiet" | "onDark"`, `delay?` (300ms, 0 shows at once), `label?` ("Loading"), `decorative?` (inside a busy control: aria-hidden, no status role). Standalone it is role status. 1s a turn, 1.5s under reduced motion.

### Skeleton and SkeletonGroup (`Skeleton.tsx`)

`shape?: "line" | "title" | "circle" | "rect"` (line 12 tall, title 22 at 60%, circle 40, rect 120 at radius 16), `width?`, `height?`, `radius?` (CSS strings or px numbers), `lines?` (line only, the last at 60%), `ground?: "light" | "container"`. The shimmer is a 40% band moved by transform over 1.6s, off under reduced motion. Shapes are aria-hidden. `SkeletonGroup` (`label?`, `children`) is the aria-busy wrapper with a hidden "Loading".
