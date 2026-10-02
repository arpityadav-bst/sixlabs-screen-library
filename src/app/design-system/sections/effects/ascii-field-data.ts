// The glyph field's values, written once: the specs each specimen mounts, the drawer rows and the rules
// that cannot be shown. Sources are file:line under src/components/website unless named otherwise.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";

export type FieldMode = "page" | "terminal" | "resting" | "pool" | "page-on-terminal";

type FieldSpec = { reach?: number; lens?: number; pointer: boolean | "hover"; pool?: { x: number; y: number } };

/** what each specimen passes to mountAsciiField (besides its host) */
export const FIELD_SPECS: Record<FieldMode, FieldSpec> = {
  page: { reach: 120, lens: 0.24, pointer: "hover" },
  terminal: { pointer: false, pool: { x: 0.5, y: 0.6 }, reach: 420, lens: 0.5 },
  resting: { reach: 120, lens: 0.24, pointer: false },
  pool: { reach: 120, lens: 0.24, pointer: false, pool: { x: 0.5, y: 0.5 } },
  "page-on-terminal": { pointer: false, pool: { x: 0.5, y: 0.6 }, reach: 420, lens: 0.5 },
};

/** the terminal's own tints, set on its host as JobTerminal sets them */
export const TERMINAL_TINT = { "--ascii-a": "148, 163, 184", "--ascii-b": "110, 168, 255", "--ascii": "0.5" };

export const FIELD_PINS: readonly AnatomyPin[] = [
  { selector: ".ascii-host", name: "Host", token: "--ascii-a, --ascii-b", value: "tints read off the host", source: "globals.css:63-66", side: "left" },
  { selector: ".ascii-bg", name: "Glyph canvas", token: "--ascii", value: "opacity 0.4, pixel ratio up to 2", source: "globals.css:67-74", side: "right" },
];

export const PAGE_VALUES: readonly ValueRow[] = [
  { part: "Grid", value: "15px cells, 11px ui-monospace", source: "ascii-field.js:29,76" },
  { part: "Ramp", value: "' .,:;i1tfLCG08@'", source: "ascii-field.js:28" },
  { part: "Ambient", value: "5.2% of cells (seed > 0.948) at 0.075, breathing 47%", source: "ascii-field.js:122" },
  { part: "Pool reach", value: "120px (onBlue 190)", source: "AsciiBackdrop.tsx:25" },
  { part: "Pool lens", value: "0.24, falloff (1 - d / reach)^2", source: "AsciiBackdrop.tsx:26, ascii-field.js:127" },
  { part: "Resting ink", token: "--ascii-a", value: "10, 27, 51 (#0a1b33)", source: "app/globals.css:64" },
  { part: "Pool ink", token: "--ascii-b", value: "26, 109, 255 (#1a6dff)", source: "app/globals.css:65" },
  { part: "Canvas", token: "--ascii", value: "opacity 0.4", source: "app/globals.css:73" },
  { part: "Fringe", token: "--ds-color-fringe-red-ascii, --ds-color-fringe-cyan-ascii", value: "1px either side at alpha x 0.14, where 4 x lens x (1 - lens) > 0.18", source: "ascii-field.js:178-183" },
  { part: "Repaint", value: "68ms at most (about 14.7 fps)", source: "ascii-field.js:216" },
  { part: "Shimmer", value: "sin(now x 0.0011 + seed x 40), about 5.7s", source: "ascii-field.js:122" },
  { part: "Roll", value: "one walk of the ramp about every 8.3s", source: "ascii-field.js:175" },
  { part: "Layer", token: "--ds-z-backdrop", value: "fixed inset-0, -z-10, pointer-events none", source: "AsciiBackdrop.tsx:61" },
];

export const FIELD_PROPS: readonly PropRow[] = [
  { name: "host", type: "HTMLElement", note: "needs a position, the canvas goes in as its first child" },
  { name: "cell", type: "number", default: "15" },
  { name: "reach", type: "number", default: "190", note: "the page passes 120, the terminal 420" },
  { name: "lens", type: "number", default: "0.42", note: "the page passes 0.24, the terminal 0.5" },
  { name: "ambient", type: "number", default: "0.075" },
  { name: "fringe", type: "boolean", default: "true" },
  { name: "track", type: "EventTarget", default: "host", note: "the page listens on the document, because the field sits behind the content" },
  { name: "pointer", type: "boolean", default: "true", note: "false leaves the pool unwired" },
  { name: "pool", type: "{ x, y }", note: "a pool held at these fractions of the host with no pointer" },
  { name: "expose", type: "(api: { sweep, wake }) => void", note: "wake draws again after a hide" },
];

export const PAGE_CODE = `import { mountAsciiField } from "@/components/website/ascii-field";

// once per host: the field has no teardown
if (!host.firstChild)
  mountAsciiField({ host, reach: 120, lens: 0.24, pointer: matchMedia("(hover: hover)").matches });`;

export const TERMINAL_VALUES: readonly ValueRow[] = [
  { part: "Resting ink", token: "--ascii-a", value: "148, 163, 184", source: "JobTerminal.tsx:45" },
  { part: "Pool ink", token: "--ascii-b", value: "110, 168, 255", source: "JobTerminal.tsx:46" },
  { part: "Canvas", token: "--ascii", value: "opacity 0.5", source: "JobTerminal.tsx:47" },
  { part: "Pool", value: "held at 0.5, 0.6 of the window, reach 420, lens 0.5, no pointer", source: "JobTerminal.tsx:66-72" },
  { part: "Lifetime", value: "display none 800ms after the run begins, which stops its drawing", source: "JobTerminal.tsx:74-79" },
];

export const TERMINAL_CODE = `mountAsciiField({ host, pointer: false, pool: { x: 0.5, y: 0.6 }, reach: 420, lens: 0.5 });
// host style: --ascii-a 148, 163, 184 · --ascii-b 110, 168, 255 · --ascii 0.5`;

export const FIELD_RULES: readonly KeyRow[] = [
  { key: "off screen", value: "an IntersectionObserver parks the loop", source: "ascii-field.js:267-274" },
  { key: "hidden", value: "past the foot of #model-line, or while a [data-covers-view] part fills the view: visibility hidden, the canvas kept at its size, wake() resumes", source: "AsciiBackdrop.tsx:37-47" },
  { key: "touch", value: "no pool where (hover: hover) fails, the ambient shimmer stays", source: "AsciiBackdrop.tsx:27" },
  { key: "reduced motion", value: "shimmer and roll stop, the pool still answers the pointer", source: "ascii-field.js:122,175" },
  { key: "?off=ascii", value: "the host is display none", source: "app/globals.css:268" },
  { key: "teardown", value: "none: its observers and listeners outlive the host, so mount once and guard host.firstChild", source: "AsciiBackdrop.tsx:21" },
  { key: "unused", value: "runSweep, a full-width band in #2f6dff over 0.85s, is exposed and never called", source: "ascii-field.js:236-259" },
];
