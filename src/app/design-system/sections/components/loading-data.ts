// The Spinner and skeleton section's data: anatomy pins, drawer rows, props and snippets. Values come from
// tokens.ts wherever a token holds them. The two spinners the site hand-rolls are cited where they live.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import type { SpinnerSize } from "@/components/design-system/Spinner";
import { SPINNER_BORDER } from "@/components/design-system/token-shape";
import { sv, tokenSource, tv, type CheckedRow, type Pin } from "./display-values";

const SP = "Spinner.tsx";
const SK = "Skeleton.tsx";

/** The sizes and their borders, read from SPINNER_BORDER (the map Spinner draws with), so a label never
 *  prints a border the ring does not have. */
export const SPINNER_SIZES: readonly { size: SpinnerSize; border: string }[] = (
  Object.keys(SPINNER_BORDER).map(Number) as SpinnerSize[]
).map((size) => ({ size, border: String(SPINNER_BORDER[size]) }));

export const SPINNER_PINS: readonly Pin[] = [
  { selector: "[data-pin=alone] .animate-spin", name: "Ring", token: "--ds-stroke-spinner", value: "16 · border 1.75 · top clear", source: `${SP}:49,51`, expect: ["SPINNER_BORDER[size]", "animate-spin rounded-full border-current border-t-transparent"] },
  { selector: "[data-pin=alone] [role=status]", name: "Status, with a hidden Loading label", value: "role status round the ring and the label", source: `${SP}:67,69`, expect: ['role="status"', "sr-only"] },
  { selector: "[data-pin=busy] button", name: "Busy control", value: "aria-busy, label at opacity 0", source: "Button.tsx:106,127", expect: ['"aria-busy": loading || undefined', '${loading ? "opacity-0" : ""}'], padding: true },
  { selector: "[data-pin=busy] .animate-spin", name: "Decorative ring", value: "aria-hidden, no delay", source: "Button.tsx:134", expect: "<Spinner size={spinner} delay={0} decorative />" },
];

export const SPINNER_VALUES: readonly CheckedRow[] = [
  sv("Ring", "currentColor border, border-top transparent", `${SP}:51`, undefined, "rounded-full border-current border-t-transparent"),
  tv("Border at 16", "stroke-spinner"),
  sv("Borders by size", SPINNER_SIZES.map((s) => `${s.size}: ${s.border}`).join(" · "), "token-shape.ts:111", undefined, `= { ${SPINNER_SIZES.map((s) => `${s.size}: ${s.border}`).join(", ")} };`),
  sv("Turn", "animate-spin, 1s linear", `${SP}:51`, undefined, '"block shrink-0 animate-spin '),
  sv("Turn, reduced motion", "1.5s linear, still turning", `${SP}:52`, undefined, "motion-reduce:animate-[spin_1.5s_linear_infinite]"),
  { part: "Delay", value: "300ms at opacity 0, then shown", source: `${SP}:41, 57-58, atoms.module.css:5-6`, assert: [system(SP, "delay = 300,", 'const wait = delay > 0 ? styles["ds-delay-in"] : "";', "animationDelay: `${delay}ms`"), system("atoms.module.css", ".ds-delay-in {", "opacity: 0;", "animation: ds-delay-in 0s linear forwards;")] },
  tv("Quiet tone", "color-text-quiet", `${SP}:22`, 'quiet: "text-(--ds-color-text-quiet)",'),
  tv("On dark tone", "color-on-blue-80", `${SP}:23`, 'onDark: "text-(--ds-color-on-blue-80)",'),
  sv("Replaces", "the wave button's 16 ring", "components/website/HeroBits.tsx:114", undefined, "block h-4 w-4 animate-spin rounded-full border-[1.75px] border-current border-t-transparent"),
  sv("Replaces", "the terminal's 8 ring", "components/website/JobTerminal.tsx:216", undefined, "block h-2 w-2 animate-spin rounded-full border border-slate-500 border-t-transparent"),
];

export const SPINNER_PROPS: readonly PropRow[] = [
  { name: "size", type: "8 | 12 | 16 | 20 | 24", default: "16" },
  { name: "tone", type: "\"inherit\" | \"quiet\" | \"onDark\"", default: "\"inherit\"" },
  { name: "delay", type: "number", default: "300", note: "ms before it shows, 0 at once" },
  { name: "label", type: "string", default: "\"Loading\"", note: "the hidden status text" },
  { name: "decorative", type: "boolean", default: "false", note: "inside a busy control, aria-hidden" },
];

export const SPINNER_CODE = `import { Spinner } from "@/components/design-system/Spinner";

<Spinner />                      // 16, waits 300ms, role status
<Spinner size={24} tone="quiet" label="Loading answers" />`;

export const SKELETON_VALUES: readonly CheckedRow[] = [
  tv("Fill on white and the page", "color-skeleton", "atoms.module.css:19", "background: var(--ds-color-skeleton);"),
  tv("Fill on the container", "color-skeleton-container", "atoms.module.css:22", "background: var(--ds-color-skeleton-container);"),
  tv("Shimmer band", "color-shimmer", "atoms.module.css:29", "linear-gradient(90deg, transparent, var(--ds-color-shimmer), transparent);"),
  tv("Shimmer pass", "dur-shimmer", "atoms.module.css:31", "animation: ds-shimmer var(--ds-dur-shimmer) linear infinite;"),
  sv("Shimmer travel", "40% band, translateX -100% to 250%, transform only", "atoms.module.css:28, 35, 38", undefined, "width: 40%;", "transform: translateX(-100%);", "transform: translateX(250%);"),
  sv("line", "12 tall, full width, pill", `${SK}:10`, undefined, 'line: { h: 12, w: "100%", r: "var(--ds-radius-full)" },'),
  sv("title", "22 tall, 60% wide, radius 8", `${SK}:11`, undefined, 'title: { h: 22, w: "60%", r: "var(--ds-radius-bubble)" },'),
  sv("circle", "40, pill", `${SK}:12`, undefined, 'circle: { h: 40, w: "40px", r: "var(--ds-radius-full)" },'),
  sv("rect", "120 tall, radius 16", `${SK}:13`, undefined, 'rect: { h: 120, w: "100%", r: "var(--ds-radius-sm)" },'),
  sv("Reduced motion", "no shimmer, the fill stays", "atoms.module.css:41-45", undefined, "@media (prefers-reduced-motion: reduce) {", "animation: none;", "opacity: 0;"),
  sv("Group", "aria-busy true, hidden \"Loading\"", `${SK}:52, 61-62`, undefined, 'label = "Loading",', '<div aria-busy="true"', '<span className="sr-only">{label}</span>'),
];

export const SKELETON_PROPS: readonly PropRow[] = [
  { name: "shape", type: "\"line\" | \"title\" | \"circle\" | \"rect\"", default: "\"line\"" },
  { name: "width", type: "string | number", note: "px as a number" },
  { name: "height", type: "string | number" },
  { name: "radius", type: "string | number", note: "the content's own radius" },
  { name: "lines", type: "number", default: "1", note: "line only, the last at 60%" },
  { name: "ground", type: "\"light\" | \"container\"", default: "\"light\"" },
];

export const SKELETON_CODE = `import { Skeleton, SkeletonGroup } from "@/components/design-system/Skeleton";

<SkeletonGroup label="Loading the job">
  <Skeleton shape="title" />
  <Skeleton lines={2} />
  <Skeleton shape="rect" height={300} radius={16} />
</SkeletonGroup>`;

export const COMPOSITE_PINS: readonly Pin[] = [
  { selector: "[data-pin=title] [data-ground]", name: "Title line", value: "22 tall, 60% wide", source: `${SK}:11`, expect: 'title: { h: 22, w: "60%"' },
  { selector: "[data-pin=lines]", name: "Text lines", value: "two 12 lines, the last at 60%", source: `${SK}:10,36`, expect: ["line: { h: 12", '"60%"'] },
  { selector: "[data-pin=terminal] [data-ground]", name: "Terminal block", token: "--ds-radius-sm", value: "300 tall, radius 16", source: tokenSource("radius-sm"), expect: "rounded-[16px]" },
  { selector: "[data-pin=tags] [data-ground]", name: "Tag panel", token: "--ds-radius-xs", value: "44 tall, radius 12", source: tokenSource("radius-xs"), expect: "rounded-[12px]" },
];

/** The swap demo's content, quoted from the site's job data. */
export const SWAP_JOB = 0;
