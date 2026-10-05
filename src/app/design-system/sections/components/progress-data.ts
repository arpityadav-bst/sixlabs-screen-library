// Data for the traits and progress section: pins on the shipped trait bars and on the system bar and
// circle, drawer values and props. The trait values are the site's own (players-data.ts).
import { pr, sv, tv, type Pin } from "./display-values";

export const TRAIT_PINS: readonly Pin[] = [
  { selector: ".ds-a-traits dl > div", name: "Row", value: "label 130 then the bar, gap 16, rows 16 apart", source: "PlayerTraits.tsx:22,29,32", expect: ['"space-y-4 "', "grid items-center", "grid-cols-[130px_1fr] gap-4"] },
  { selector: ".ds-a-traits dt", name: "Label", token: "--ds-color-on-blue-75", value: "Inter 14, white 75%", source: "PlayerTraits.tsx:37,38", expect: ["font-sans text-white/75", '"text-[14px]"'] },
  { selector: ".ds-a-traits dd", name: "Track", token: "--ds-color-on-blue-20", value: "6 tall, white 20%", source: "PlayerTraits.tsx:43", expect: "h-1.5 rounded-full bg-white/20" },
  { selector: ".ds-a-traits dd > div", name: "Fill", value: "white, width = value, 0.7s on the ease", source: "PlayerTraits.tsx:45,48", expect: ["h-full rounded-full bg-white", "duration: 0.7"] },
];

const BAR = ".ds-a-progress [role=progressbar]";
export const PROGRESS_PINS: readonly Pin[] = [
  { selector: `${BAR} > span:first-child`, name: "Label row", value: "Inter 13 / 20, the value at the end, mb 8", source: "Progress.tsx:94", expect: "mb-2 flex items-baseline justify-between gap-3 font-sans text-[13px] leading-5" },
  { selector: `${BAR} > span:last-child`, name: "Rail", token: "--ds-color-ink-08", value: "2, 4, 6 or 8 tall, round", source: "Progress.tsx:12,66", expect: ['{ 2: "h-0.5", 4: "h-1", 6: "h-1.5", 8: "h-2" }', "rounded-full ${h}"] },
  { selector: `${BAR} > span:last-child > span`, name: "Fill", token: "--ds-color-primary", value: "width eases over 700ms", source: "Progress.tsx:74,75", expect: ['styles["ds-progress-fill"]', "width: `${pct}%`"] },
  { selector: ".ds-a-progress svg > circle", name: "Track", token: "--ds-color-ink-08", value: "the whole ring, at the arc's stroke", source: "ProgressCircle.tsx:59", expect: "stroke={RAIL[variant]}" },
  { selector: ".ds-a-progress svg circle + g circle", name: "Arc", value: "from twelve o'clock, round cap", source: "ProgressCircle.tsx:61,69,72", expect: ["<circle", 'strokeLinecap="round"', "rotate(-90"] },
  { selector: ".ds-a-progress svg + span", name: "Value", value: "Inter 11 / 500 tabular, 13 at 64, Done when complete", source: "ProgressCircle.tsx:79,80", expect: ["font-sans font-medium tabular-nums", "size >= 64 ? 13 : 11"], side: "right" },
];

const PT = "PlayerTraits.tsx";

export const TRAIT_VALUES = [
  sv("Width", "max 440", `${PT}:22`, undefined, "max-w-[440px]"),
  sv("Rows", "16 apart, dense 10", `${PT}:22`, undefined, '(dense ? "space-y-2.5 " : "space-y-4 ")'),
  sv("Columns", "130 then 1fr at gap 16, dense 124 at gap 12", `${PT}:31`, undefined, '"grid-cols-[124px_1fr] gap-3"', '"grid-cols-[130px_1fr] gap-4"'),
  sv("Label", "Inter 14, dense 13, white 75%", `${PT}:38`, "--ds-color-on-blue-75", '"font-sans text-white/75 "', '(dense ? "text-[13px]" : "text-[14px]")'),
  sv("Track", "6 tall, round, white 20%", `${PT}:43`, "--ds-color-on-blue-20", "h-1.5 rounded-full bg-white/20"),
  sv("Fill", "white, width = value x 100%", `${PT}:45`, undefined, "h-full rounded-full bg-white", "width: `${t.value * 100}%`"),
  sv("Slide", "0.7s on the ease, no grow-in on first mount", `${PT}:48`, "--ds-dur-rise", "initial={false}", "transition={{ duration: 0.7, ease }}"),
] as const;

export const PROGRESS_VALUES = [
  tv("Rail, light", "color-ink-08"),
  tv("Fill, light", "color-primary"),
  tv("Rail, blue", "color-on-blue-20"),
  tv("Fill, blue", "color-surface"),
  tv("Rail, dark", "color-terminal-track"),
  tv("Fill, dark", "color-terminal-fill"),
  tv("Complete", "color-success"),
  tv("Complete, dark", "color-success-on-dark"),
  tv("Error", "color-danger"),
  tv("Error, dark", "color-danger-on-dark"),
  tv("Paused, light", "color-text-muted", "progress-styles.ts:25", 'paused: { light: "var(--ds-color-text-muted)"'),
  tv("Paused, blue", "color-on-blue-50", "progress-styles.ts:25", 'blue: "var(--ds-color-on-blue-50)"'),
  tv("Paused, dark", "color-on-blue-20", "progress-styles.ts:25", 'blue: "var(--ds-color-on-blue-50)", dark: "var(--ds-color-on-blue-20)"'),
  tv("Fill time", "dur-rise"),
  tv("Fill ease", "ease-out"),
  sv("Indeterminate", "a 35% segment, translateX over 1.4s, ease-in-out", "progress.module.css", undefined, "width: 35%;", "animation: ds-progress-run 1.4s var(--ds-ease-in-out) infinite;", "transform: translateX(-100%);"),
  sv("Heights", "2, 4, 6, 8", "Progress.tsx:12", undefined, '{ 2: "h-0.5", 4: "h-1", 6: "h-1.5", 8: "h-2" }'),
  sv("Circle strokes", "16: 2, 24: 2.5, 40: 3, 64: 4", "token-shape.ts:112", undefined, "CIRCLE_STROKE: Readonly<Record<16 | 24 | 40 | 64, number>> = { 16: 2, 24: 2.5, 40: 3, 64: 4 }"),
  sv("Segments", "2px gaps, each filled whole", "Progress.tsx:54, 60", undefined, "flex w-full gap-0.5", "backgroundColor: k < done ? fill : RAIL[variant]"),
] as const;

export const PROGRESS_PROPS = [
  pr("value", "number", "0", "in steps when segments is set"),
  pr("max", "number", "100"),
  pr("label", "string", "required", "the accessible name"),
  pr("showLabel", "boolean", "false"),
  pr("showValue", "boolean", "false", "35%, Complete, Failed at 60%"),
  pr("size", "2 | 4 | 6 | 8", "4", "circle: 16 | 24 | 40 | 64"),
  pr("variant", '"light" | "blue" | "dark"', '"light"'),
  pr("indeterminate", "boolean", "false", "aria-valuenow left out"),
  pr("status", '"complete" | "error" | "paused"'),
  pr("segments", "number", undefined, "bar only"),
] as const;

export const TRAIT_PROPS = [
  pr("traits", "{ label, value: 0..1 }[]"),
  pr("dense", "boolean", "false", "the carousel's tighter rows"),
  pr("className", "string"),
] as const;

export const PROGRESS_CODE = `import { Progress } from "@/components/design-system/Progress";
import { ProgressCircle } from "@/components/design-system/ProgressCircle";

<Progress label="Building the model" value={35} showLabel showValue />
<Progress label="Reading the build" indeterminate variant="dark" />
<ProgressCircle label="Upload" value={60} size={40} showValue />`;

export const TRAIT_CODE = `import { PlayerTraits } from "@/components/website/PlayerTraits";
import { PLAYERS } from "@/components/website/players-data";

<PlayerTraits traits={PLAYERS[k].traits} />`;

export const STATES = ["determinate", "indeterminate", "complete", "error", "paused"] as const;
export type ProgressState = (typeof STATES)[number];
