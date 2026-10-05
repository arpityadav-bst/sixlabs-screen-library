// Data for the Slider section: states, pins, the drawer's values and props, code, and the keyboard model.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { contrastRatio } from "@/app/design-system/_kit/contrast";
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import { SLIDER_TONE } from "@/components/design-system/slider-styles";
import { WATER, restColour } from "../contrast-pairs";
import type { CheckedRow, Pin } from "../display-values";

const SS = "slider-styles.ts";

export const SIZES = ["sm", "md", "lg"] as const;
export const SLIDER_STATES = ["rest", "hover", "focus-visible", "dragging", "disabled", "range"] as const;
export type SliderState = (typeof SLIDER_STATES)[number];
export const SLIDER_BLUE_STATES = ["rest", "hover", "focus-visible", "dragging", "disabled", "range"] as const;

/** The label on the water, read from the blue tone's class. */
export const SLIDER_BLUE_LABEL = { fg: restColour(SLIDER_TONE.blue.label, "text"), bg: WATER };
export const SLIDER_BLUE_MISS = (contrastRatio(SLIDER_BLUE_LABEL.fg, SLIDER_BLUE_LABEL.bg) ?? 0) < 4.5;

export const SLIDER_PINS: readonly Pin[] = [
  { selector: "[data-slot=label]", name: "Label", value: "Inter 13/18 500, left on the label row", source: `${SS}:28`, expect: "text-[13px] font-medium leading-[18px] tracking-[-0.01em]", side: "left" },
  { selector: "[data-slot=value-text]", name: "Value", value: "tabular-nums, right, slate 600", source: `${SS}:29`, expect: "text-[13px] leading-[18px] text-(--ds-color-text-body)", side: "right" },
  { selector: "[data-slot=rail]", name: "Rail", token: "--ds-color-line", value: "4 at md, slate 200", source: `${SS}:13,22`, expect: ['md: { rail: "h-1"', 'rail: "bg-(--ds-color-line)"'], side: "left" },
  { selector: "[data-slot=range]", name: "Range", token: "--ds-color-primary", value: "navy", source: `${SS}:24`, expect: 'range: "bg-(--ds-color-primary)"', side: "left" },
  { selector: "[data-slot=thumb]", name: "Thumb", token: "--ds-color-line-field", value: "18, a 40 hit circle", source: `${SS}:13,25,47`, expect: ['thumb: "h-[18px] w-[18px]"', "border border-(--ds-color-line-field) bg-(--ds-color-surface)", "before:h-10"], side: "right" },
  { selector: "[data-slot=bubble]", name: "Bubble", token: "--ds-shadow-tooltip", value: "navy, 12 tabular, while dragged", source: `${SS}:30,55`, expect: ["bg-(--ds-color-primary) text-white shadow-(--ds-shadow-tooltip)", "text-[12px] font-medium leading-4 tabular-nums"], side: "right" },
  { selector: "[data-slot=ticks]", name: "Ticks", token: "--ds-color-line-strong", value: "1 x 6, navy inside the range", source: "Slider.tsx:226,231", expect: ['data-slot="ticks"', "h-1.5 w-px"], side: "right" },
];

export const SLIDER_VALUES: readonly CheckedRow[] = [
  { part: "Rail sm / md / lg", value: "2 / 4 / 6", source: `${SS}:12-14`, assert: system(SS, 'sm: { rail: "h-0.5"', 'md: { rail: "h-1"', 'lg: { rail: "h-1.5"') },
  { part: "Thumb sm / md / lg", value: "14 / 18 / 22, a 40 circle hit area", source: `${SS}:12-14, 47-48`, assert: system(SS, 'thumb: "h-3.5 w-3.5"', 'thumb: "h-[18px] w-[18px]"', 'thumb: "h-[22px] w-[22px]"', "before:h-10 ", "before:w-10", "before:rounded-full") },
  { part: "Rail", token: "--ds-color-line", value: "slate 200, slate 300 on hover", source: `${SS}:22-23`, assert: system(SS, 'rail: "bg-(--ds-color-line)"', 'railHover: "group-hover/slider:bg-(--ds-color-line-strong)') },
  { part: "Range", token: "--ds-color-primary", value: "#0a152d", source: `${SS}:24`, assert: system(SS, 'range: "bg-(--ds-color-primary)"') },
  { part: "Thumb", token: "--ds-color-line-field", value: "white, 1px #848fa1, 0 1px 3px ink at 25%", source: `${SS}:25, choice-styles.ts:96`, assert: [system(SS, "thumb: `border border-(--ds-color-line-field) bg-(--ds-color-surface) ${THUMB_SHADOW}`"), system("choice-styles.ts", "shadow-[0_1px_3px_color-mix(in_srgb,var(--ds-color-ink)_25%,transparent)]")] },
  { part: "Hover", value: "thumb scale 1.1", source: `${SS}:51`, assert: system(SS, 'THUMB_HOVER = "hover:scale-110 data-[force=hover]:scale-110"') },
  { part: "Dragging", value: "thumb scale 1.15 and the bubble", source: "Slider.tsx:207, 217", assert: system("Slider.tsx", 'dragging ? "scale-[1.15]"', 'dragging ? "translate-y-0 opacity-100"') },
  { part: "Bubble", token: "--ds-color-primary", value: "navy, white 12/16 500 tabular, radius 8, 8 above", source: `${SS}:30, 53-55`, assert: system(SS, 'bubble: "bg-(--ds-color-primary) text-white', "absolute bottom-full left-1/2 mb-2", "rounded-(--ds-radius-bubble) px-2 py-1", "text-[12px] font-medium leading-4 tabular-nums") },
  { part: "Page step", value: "a tenth of the range, at least one step", source: "Slider.tsx:118", assert: system("Slider.tsx", "const big = Math.max(step, Math.round(span / 10 / step) * step);") },
  { part: "On blue rail", token: "--ds-color-on-blue-20", value: "white 20%, the trait bar's", source: `${SS}:33`, assert: system(SS, 'rail: "bg-(--ds-color-on-blue-20)"') },
  { part: "On blue range", token: "--ds-color-surface", value: "white", source: `${SS}:35`, assert: system(SS, 'range: "bg-(--ds-color-surface)"') },
  { part: "On blue thumb", token: "--ds-color-primary", value: "white with a 2px navy ring", source: `${SS}:36`, assert: system(SS, "thumb: `border-2 border-(--ds-color-primary) bg-(--ds-color-surface)") },
  { part: "Pointer", value: "touch-action pan-y, the page still scrolls", source: "Slider.tsx:171", assert: system("Slider.tsx", "relative h-6 touch-pan-y") },
];

export const SLIDER_PROPS: readonly PropRow[] = [
  { name: "label", type: "string" },
  { name: "value, defaultValue", type: "number | [number, number]", default: "50", note: "two numbers make a range" },
  { name: "onChange, onCommit", type: "(value) => void", note: "onCommit once a drag or key press ends" },
  { name: "min, max, step", type: "number", default: "0, 100, 1" },
  { name: "formatValue", type: "(value) => string", note: "the shown and spoken value" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "ticks, tickLabels", type: "boolean | number[], boolean" },
  { name: "ground", type: '"light" | "blue"', default: '"light"' },
  { name: "disabled", type: "boolean" },
  { name: "forceState", type: 'ForceState | "dragging"' },
];

export const SLIDER_CODE = `import { Slider } from "@/components/design-system/Slider";

<Slider
  label="Curiosity"
  value={curiosity}
  onChange={(v) => setCuriosity(v as number)}
  formatValue={(v) => \`\${v}%\`}
/>`;

export const SLIDER_KEYS: readonly KeyRow[] = [
  { key: "Arrow right, up", value: "one step up", source: "Slider.tsx:124" },
  { key: "Arrow left, down", value: "one step down", source: "Slider.tsx:126" },
  { key: "Page up, down", value: "a tenth of the range", source: "Slider.tsx:128" },
  { key: "Home, End", value: "the minimum and the maximum, or the other thumb in a range", source: "Slider.tsx:130" },
  { key: "Spoken value", value: "aria-valuetext from formatValue, so 72% is read as 72 percent", source: "Slider.tsx:200" },
];
