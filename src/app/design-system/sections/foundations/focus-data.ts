// Focus: the ring's values (read from the focus tokens, never written twice), its anatomy pins, the
// contrast pairs the drawer grades, and the SkipLink's pins, values and props. Every file:line is found in
// the source at build (foundation-scan's cite), so a moved line moves the chip, and each pin's expect is the
// text its line writes, which Coverage holds to that line. Server only.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { tokenValue as value } from "@/app/design-system/_kit/token-rows";
import type { CheckedRow } from "@/app/design-system/sections/components/display-values";
import { system } from "./foundation-assert";
import { cite } from "./foundation-scan";

const DS = "src/components/design-system";
/** Where a token is declared in tokens' shape or space file, "token-shape.ts:68". */
const def = (file: string, name: string) => cite(`${DS}/${file}`, `tk("${name}"`);
const shape = (name: string) => def("token-shape.ts", name);
const BUTTON = `${DS}/button-styles.ts`;
const FOCUS_TS = `${DS}/focus.ts`;
const SM = cite(BUTTON, "sm: { box:");
const PILL = cite(BUTTON, 'primary: "rounded-full');
const SKIP = `${DS}/SkipLink.tsx`;
const PIN = cite(SKIP, "fixed left-4 top-4 z-(--ds-z-tooltip)");
/** The needle a token row is held to: its tk() line writing the value the row prints. */
const held = (file: string, name: string) => system(file, `tk("${name}", "${value(name)}"`);

export const RING = {
  light: value("focus-color"),
  inverse: value("focus-color-inverse"),
  dark: value("focus-color-dark"),
} as const;

export const RING_VALUES: readonly CheckedRow[] = [
  { part: "Width", token: "--ds-focus-width", value: value("focus-width"), source: shape("focus-width").source, assert: held("token-shape.ts", "focus-width") },
  { part: "Offset on controls", token: "--ds-focus-offset", value: value("focus-offset"), source: shape("focus-offset").source, assert: held("token-shape.ts", "focus-offset") },
  { part: "Offset on cards", token: "--ds-focus-offset-card", value: value("focus-offset-card"), source: shape("focus-offset-card").source, assert: held("token-shape.ts", "focus-offset-card") },
  { part: "Colour on light", token: "--ds-focus-color", value: RING.light, source: shape("focus-color").source, assert: held("token-shape.ts", "focus-color") },
  { part: "Colour on blue", token: "--ds-focus-color-inverse", value: RING.inverse, source: shape("focus-color-inverse").source, assert: held("token-shape.ts", "focus-color-inverse") },
  { part: "Colour on dark", token: "--ds-focus-color-dark", value: RING.dark, source: shape("focus-color-dark").source, assert: held("token-shape.ts", "focus-color-dark") },
  { part: "Field halo", token: "--ds-focus-halo", value: value("focus-halo"), source: shape("focus-halo").source, assert: held("token-shape.ts", "focus-halo") },
  { part: "Forced colours", value: "outline-color Highlight", source: cite(FOCUS_TS, "forced-colors:focus-visible:outline-[Highlight]").source,
    assert: system("focus.ts", "forced-colors:focus-visible:outline-[Highlight]") },
  { part: "Shows on", value: ":focus-visible only, no transition", source: cite(FOCUS_TS, "export const FOCUS =").source,
    assert: system("focus.ts", "export const FOCUS =", "focus-visible:outline-(length:--ds-focus-width)") },
];

export const RING_PROPS: readonly PropRow[] = [
  { name: "FOCUS", type: "string", note: "accent ring, page, surface and container" },
  { name: "FOCUS_INVERSE", type: "string", note: "white ring, on the accent water" },
  { name: "FOCUS_DARK", type: "string", note: "#6ea8ff ring, navy and the terminal" },
  { name: "FOCUS_CARD", type: "string", note: "offset 3, cards and large surfaces" },
  { name: "FOCUS_INSET", type: "string", note: "offset -2, items in a scroll row" },
  { name: "FIELD_FOCUS", type: "string", note: "accent border and the 3px halo" },
  { name: "focusRing(tone)", type: '"default" | "inverse" | "dark" | "card" | "inset"', default: '"default"' },
];

export const RING_CODE = `import { FOCUS, FIELD_FOCUS, focusRing } from "@/components/design-system/focus";
import { forceAttr } from "@/components/design-system/force";

<button className={\`rounded-full \${FOCUS}\`} data-force={forceAttr(forceState)}>Sign in</button>
<a className={focusRing("card")} href="/jobs">…</a>
<input className={FIELD_FOCUS} />`;

/** The ring drawn out: the control, the 2px gap that shows the ground, the 2px line. */
export const RING_PINS: readonly AnatomyPin[] = [
  { selector: "[data-probe='ring']", name: "Ring", token: "--ds-focus-width, --ds-focus-color", value: `2px ${RING.light}`,
    ...shape("focus-width"), side: "left" },
  { selector: "[data-probe='gap']", name: "Offset", token: "--ds-focus-offset", value: "2px of ground",
    ...shape("focus-offset"), side: "left" },
  { selector: "[data-ring-control] > button", name: "Control", token: "--ds-radius-full",
    value: "the ring follows its radius", ...PILL, side: "right" },
];

/** Ring colour against each ground it is drawn on, graded in the drawer. */
export const RING_CONTRAST: readonly { fg: string; bg: string; bgName?: string }[] = [
  { fg: RING.light, bg: "page" },
  { fg: RING.light, bg: "surface" },
  { fg: RING.light, bg: "container" },
  { fg: RING.light, bg: "navy" },
  { fg: RING.inverse, bg: value("color-accent"), bgName: "accent" },
  { fg: RING.dark, bg: "navy" },
  { fg: RING.dark, bg: value("color-terminal-bg"), bgName: "terminal" },
];

/** Where each of the site's live controls is written, for the live strip's drawer. */
export const LIVE_VALUES: readonly ValueRow[] = [
  { part: "Try now", value: "no focus style, browser default", source: "PrimaryCta.tsx:90" },
  { part: "Wave button", value: "no focus style, browser default", source: "HeroBits.tsx:89" },
  { part: "Language trigger", value: "no focus style, browser default", source: "LanguageMenu.tsx:51" },
  { part: "Human / AI switch", value: "no focus style, browser default", source: "ModeToggle.tsx:34" },
  { part: "FAQ row", value: "no focus style, browser default", source: "Faq.tsx:39" },
];

export const SKIP_PINS: readonly AnatomyPin[] = [
  { selector: "[data-skip-link]", name: "Pin", token: "--ds-z-tooltip", value: "fixed · top 16 · left 16 · z 70",
    ...PIN, side: "right" },
  { selector: "[data-skip-link] a", name: "Link", token: "--ds-color-primary, --ds-radius-full",
    value: "Button primary sm · 32 tall · px 14", ...SM, padding: true, side: "right" },
  { selector: "[data-skip-link] a > span > span", name: "Label", token: "--ds-text-13", value: "Inter 13 / 500",
    ...SM, side: "right" },
];

export const SKIP_VALUES: readonly CheckedRow[] = [
  { part: "Position", value: "fixed · top 16 · left 16", source: PIN.source, assert: system("SkipLink.tsx", "fixed left-4 top-4 z-(--ds-z-tooltip)") },
  { part: "Layer", token: "--ds-z-tooltip", value: value("z-tooltip"), source: def("token-space.ts", "z-tooltip").source,
    assert: held("token-space.ts", "z-tooltip") },
  { part: "Box, Button sm", value: "h-8 · px-3.5 · 13px label", source: SM.source, assert: system("button-styles.ts", 'sm: { box: "h-8 gap-2 px-3.5 text-[13px]"') },
  { part: "Fill", token: "--ds-color-primary", value: value("color-primary"), source: PILL.source,
    assert: system("button-styles.ts", 'primary: "rounded-full border border-transparent bg-(--ds-color-primary)') },
  { part: "Reveal", value: "opacity 0 to 1 while focus is inside, no transition", source: cite(SKIP, "const REVEAL =").source,
    assert: system("SkipLink.tsx", "opacity-0 pointer-events-none focus-within:opacity-100") },
  { part: "Target", value: "#main, the main landmark", source: cite(SKIP, 'href = "#main"').source, assert: system("SkipLink.tsx", 'href = "#main"') },
];

export const SKIP_PROPS: readonly PropRow[] = [
  { name: "href", type: "string", default: '"#main"', note: "the main landmark's id" },
  { name: "children", type: "string", default: '"Skip to content"' },
  { name: "forceState", type: "ForceState", note: "focus, hover and pressed show it" },
  { name: "inline", type: "boolean", default: "false", note: "in the flow, for docs" },
  { name: "className", type: "string" },
];

export const SKIP_CODE = `import { SkipLink } from "@/components/design-system/SkipLink";

// the first child of <body>, before the header
<SkipLink />
<Header />
<main id="main">…</main>`;

/** Rest and focus only: the link shows only while it holds focus, so a hover or press without the ring
 *  never happens. The live cell takes both with a real ring. */
export const SKIP_STATES = ["rest", "focus-visible"] as const;
