// The accordion section's data: the specimen items (questions quoted from faq-data.ts), the Anatomy pins,
// the shipped FAQ's per-state rows, and the drawers for the FAQ and the new Accordion.
import { QUESTIONS } from "@/components/website/faq-data";
import type { AccordionItem } from "@/components/design-system/Accordion";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import type { CheckedRow, Pin } from "./display-values";

const FQ = "Faq.tsx";
const CSS = "Accordion.module.css";

/** The first four questions, as items. */
export const FAQ_ITEMS: readonly AccordionItem[] = QUESTIONS.slice(0, 4).map((x, k) => ({
  id: `q${k}`,
  title: x.q,
  content: x.a,
}));

const firstSentence = (s: string) => s.slice(0, s.indexOf(". ") + 1) || s;

/** One short item for the state cells: "What can I use it for?" and the first sentence of its answer. */
export const ONE: AccordionItem = { id: "one", title: QUESTIONS[2].q, content: firstSentence(QUESTIONS[2].a) };
export const TWO: AccordionItem = { id: "two", title: QUESTIONS[0].q, content: firstSentence(QUESTIONS[0].a) };

export const ACC_STATES = ["closed", "hover", "pressed", "focus-visible", "open", "disabled", "loading"] as const;
export type AccState = (typeof ACC_STATES)[number];

export const ACC_SIZES = [
  { name: "sm", spec: 48 },
  { name: "md", spec: 64.75 },
  { name: "lg", spec: 76 },
] as const;

export const FAQ_PINS: readonly Pin[] = [
  { selector: "li", name: "Row", token: "--ds-radius-row", value: "radius 14, white, hairline", source: `${FQ}:33`, expect: "rounded-[14px] border bg-white" },
  { selector: "li button", name: "Trigger", value: "px 24, py 20, gap 24 (px 20 py 16 gap 16 under md)", source: `${FQ}:43`, expect: ["gap-6 px-6 py-5", "max-md:gap-4 max-md:px-5 max-md:py-4"], padding: true },
  { selector: "li button > span:first-child", name: "Question", token: "--ds-type-question", value: "Outfit 18 / 500", source: `${FQ}:45`, expect: "md:text-[18px] font-medium" },
  { selector: 'li button > span[aria-hidden="true"]', name: "Plus", value: "16, two 1.5 bars", source: `${FQ}:49-50`, expect: ["h-4 w-4", "h-[1.5px]"] },
  { selector: "li p", name: "Answer", token: "--ds-color-text-body", value: "15 / 1.6, max 680", source: `${FQ}:68`, expect: ["max-w-[680px]", "text-[15px] leading-[1.6]"], padding: true },
  { selector: "ul", name: "List", value: "gap 10, 8 under md", source: `${FQ}:26`, expect: "gap-2.5 max-md:gap-2" },
];

export const ACC_PINS: readonly Pin[] = [
  { selector: "[data-acc-item]", name: "Item", token: "--ds-radius-row", value: "radius 14, hairline", source: `${CSS}:26-27`, expect: ["--ds-color-line", "--ds-radius-row"] },
  { selector: "[data-acc-item] h3", name: "Heading", value: "h3 by default, round the trigger", source: "Accordion.tsx:115", expect: "<H className" },
  { selector: "[data-acc-trigger]", name: "Trigger", value: "px 24, py 20, gap 24", source: `${CSS}:184`, expect: "padding: var(--ds-space-5) var(--ds-space-6)", padding: true },
  { selector: "[data-acc-title]", name: "Title", token: "--ds-type-question", value: "18 / 500, 16 under md", source: `${CSS}:101-102,186`, expect: ["--ds-font-display", "font-weight: 500", "--ds-type-question-size"] },
  { selector: "[data-acc-icon]", name: "Icon", token: "--ds-icon-16", value: "plus or chevron", source: `${CSS}:117,189`, expect: [".ds-acc-plus", "width: 16px; height: 16px"] },
  { selector: "[data-acc-panel] > div", name: "Answer", token: "--ds-color-text-body", value: "15 / 1.6, max 680", source: `${CSS}:169-170,190`, expect: ["max-width: 680px", "--ds-color-text-body", "--ds-text-15"], padding: true },
];

/** The flush variant's own parts: the rule between rows, the trigger on the text edge and the chevron. */
export const FLUSH_PINS: readonly Pin[] = [
  { selector: "[data-acc-item]", name: "Rule", token: "--ds-color-line-divider", value: "1px under every row but the last", source: `${CSS}:31`, expect: "--ds-color-line-divider" },
  { selector: "[data-acc-trigger]", name: "Trigger", value: "no side padding, on the panel's text edge", source: `${CSS}:208`, expect: "padding-inline: 0", padding: true },
  { selector: "[data-acc-icon]", name: "Chevron", token: "--ds-icon-16", value: "ink, turns 180 when open", source: `${CSS}:143,147`, expect: ["--ds-color-ink", "rotate: 180deg"], side: "right" },
];

export const FAQ_STATES: readonly KeyRow[] = [
  { key: "closed", value: "border slate-200 at 80%, the plus", source: `${FQ}:36` },
  { key: "hover", value: "the border firms to slate-300 over 300ms", source: `${FQ}:33-36` },
  { key: "open", value: "border slate-300, the plus turns to a minus, the answer opens by height and opacity", source: `${FQ}:35, 51-56` },
  { key: "several open", value: "each row opens on its own, keyed by its question", source: `${FQ}:14, 42` },
  { key: "focus-visible", value: "the browser's default ring, nothing drawn by the row", source: `${FQ}:39-44` },
  { key: "first render", value: "no animation, AnimatePresence initial false", source: `${FQ}:59` },
];

export const FAQ_VALUES: readonly ValueRow[] = [
  { part: "Section", value: "max-w 1400, px 16 (64 from md), pt clamp(72px, 7vw, 120px), pb 128", source: `${FQ}:18` },
  { part: "Grid", value: "one column at gap 40, from lg 360 and 1fr at gap 64", source: `${FQ}:20` },
  { part: "List", value: "grid, gap 10 (8 under md)", source: `${FQ}:26` },
  { part: "Row", token: "--ds-radius-row, --ds-color-line, --ds-color-line-strong", value: "white, radius 14, slate-200/80, slate-300 on hover and open, 300ms", source: `${FQ}:32-37` },
  { part: "Trigger", value: "button, aria-expanded, px 24 py 20 gap 24 (px 20 py 16 gap 16 under md)", source: `${FQ}:39-44` },
  { part: "Question", token: "--ds-type-question, --ds-color-ink", value: "Outfit 18 / 500 (16 under md), leading snug, -0.02em", source: `${FQ}:45` },
  { part: "Plus", value: "16 box, two 1.5 bars, the second rotate 90 to 0 and fading, 300ms", source: `${FQ}:49-57` },
  { part: "Open", token: "--ds-dur-panel, --ds-ease-out", value: "height 0 to auto and opacity, 0.35s", source: `${FQ}:61-66` },
  { part: "Answer", token: "--ds-color-text-body", value: "Inter 15 / 1.6 (14 under md), max-w 680, px 24 pb 24 (20 under md)", source: `${FQ}:68` },
];

export const ACC_VALUES: readonly CheckedRow[] = [
  { part: "Card item", token: "--ds-radius-row, --ds-color-line, --ds-color-surface", value: "white, radius 14, 1px hairline, gap 10 (8 under md)", source: `${CSS}:15-28, 199`, assert: system(CSS, "gap: var(--ds-space-2-5);", "border: 1px solid var(--ds-color-line);", "border-radius: var(--ds-radius-row);", "background: var(--ds-color-surface);", '.ds-acc[data-variant="card"] { gap: var(--ds-space-2); }') },
  { part: "Flush item", token: "--ds-color-line-divider", value: "a rule between rows, no side padding", source: `${CSS}:30-35, 208`, assert: system(CSS, "border-bottom: 1px solid var(--ds-color-line-divider);", "border-bottom-width: 0;", '.ds-acc[data-variant="flush"] .ds-acc-trigger { padding-inline: 0; }') },
  { part: "Hover and open", token: "--ds-color-line-strong, --ds-dur-line", value: "the hairline firms over 300ms", source: `${CSS}:22, 37-43`, assert: system(CSS, "border-color var(--ds-dur-line) var(--ds-ease-out),", ".ds-acc-item[data-open] {", "border-color: var(--ds-color-line-strong);") },
  { part: "Pressed", token: "--ds-color-fill-hover", value: "the row tints while held", source: `${CSS}:44-47`, assert: system(CSS, ".ds-acc-item:not([data-disabled]):has(.ds-acc-trigger:active),", "background-color: var(--ds-color-fill-hover);") },
  { part: "Focus", token: "--ds-focus-width, --ds-focus-color, --ds-focus-offset", value: "2px ring 2px off the card row, round the trigger when flush", source: `${CSS}:78-91`, assert: system(CSS, '.ds-acc[data-variant="card"] .ds-acc-item:has(.ds-acc-trigger:focus-visible),', '.ds-acc[data-variant="flush"] .ds-acc-trigger:focus-visible,', "outline: var(--ds-focus-width) solid var(--ds-focus-color);", "outline-offset: var(--ds-focus-offset);") },
  { part: "Disabled", value: "opacity 0.4, not-allowed, no hover", source: `${CSS}:38, 49-51, 71-73`, assert: system(CSS, ".ds-acc-item:not([data-disabled]):hover,", "opacity: 0.4;", "cursor: not-allowed;") },
  { part: "sm", value: "trigger 48: py 14 px 16 gap 16, title 15 / 20, icon 14, answer 14", source: `${CSS}:179-182`, assert: system(CSS, '.ds-acc[data-size="sm"] .ds-acc-trigger { gap: var(--ds-space-4); padding: var(--ds-space-3-5) var(--ds-space-4); }', '.ds-acc[data-size="sm"] .ds-acc-q { font-size: var(--ds-text-15); line-height: 20px; }', '.ds-acc[data-size="sm"] .ds-acc-plus { width: 14px; height: 14px; }', '.ds-acc[data-size="sm"] .ds-acc-a { padding: 0 var(--ds-space-4) var(--ds-space-4); font-size: var(--ds-text-14); }') },
  { part: "md", token: "--ds-type-question", value: "trigger 64.75: py 20 px 24 gap 24, title 18, icon 16, answer 15, the FAQ's step under md", source: `${CSS}:184-190, 200-201`, assert: system(CSS, '.ds-acc[data-size="md"] .ds-acc-trigger { gap: var(--ds-space-6); padding: var(--ds-space-5) var(--ds-space-6); }', "font-size: var(--ds-type-question-size);", '.ds-acc[data-size="md"] .ds-acc-plus { width: 16px; height: 16px; }', '.ds-acc[data-size="md"] .ds-acc-a { padding: 0 var(--ds-space-6) var(--ds-space-6); font-size: var(--ds-text-15); }', '.ds-acc[data-size="md"] .ds-acc-trigger { gap: var(--ds-space-4); padding: var(--ds-space-4) var(--ds-space-5); }') },
  { part: "lg", value: "trigger 76: py 24 px 28 gap 24, title 20 / 28, icon 18, answer 16", source: `${CSS}:192-195`, assert: system(CSS, '.ds-acc[data-size="lg"] .ds-acc-trigger { gap: var(--ds-space-6); padding: var(--ds-space-6) var(--ds-space-7); }', '.ds-acc[data-size="lg"] .ds-acc-q { font-size: var(--ds-text-20); line-height: 28px; }', '.ds-acc[data-size="lg"] .ds-acc-plus { width: 18px; height: 18px; }', '.ds-acc[data-size="lg"] .ds-acc-a { padding: 0 var(--ds-space-7) var(--ds-space-7); font-size: var(--ds-text-16); }') },
  { part: "Answer", token: "--ds-color-text-body", value: "Inter, leading 1.6, max-w 680", source: `${CSS}:168-173`, assert: system(CSS, "max-width: 680px;", "color: var(--ds-color-text-body);", "font-family: var(--ds-font-sans);", "line-height: 1.6;") },
  { part: "Open", token: "--ds-dur-panel, --ds-ease-out", value: "height 0 to auto and opacity, at once under reduced motion", source: "Accordion.tsx:154-157", assert: system("Accordion.tsx", "initial={{ height: 0, opacity: 0 }}", 'animate={{ height: "auto", opacity: 1 }}', "transition={{ duration: still ? 0 : DUR.panel, ease: EASE }}") },
  { part: "Icon motion", token: "--ds-dur-line, --ds-ease-out", value: "the plus bar turns 90 to 0 and fades, the chevron turns 180", source: `${CSS}:116-148`, assert: system(CSS, "rotate: 90deg;", "rotate: 0deg;", "opacity: 0;", "rotate: 180deg;", "opacity var(--ds-dur-line) var(--ds-ease-out);", "transition: rotate var(--ds-dur-line) var(--ds-ease-out);") },
  { part: "Region", value: "role region labelled by its trigger while there are six items or fewer", source: "Accordion.tsx:71, 151-152", assert: system("Accordion.tsx", "const regions = items.length <= 6;", 'role={regions ? "region" : undefined}', "aria-labelledby={regions ? tid : undefined}") },
  { part: "Loading", token: "--ds-color-skeleton", value: "open, three Skeleton lines, aria-busy", source: "Accordion.tsx:103, 153, 162-163", assert: system("Accordion.tsx", 'const isOpen = open.includes(it.id) || f === "open" || loading;', "aria-busy={loading || undefined}", "<Skeleton lines={3} />") },
];

export const ACC_PROPS: readonly PropRow[] = [
  { name: "items", type: "{ id, title, content, disabled?, loading? }[]", note: "content as a string renders one paragraph" },
  { name: "type", type: '"single" | "multiple"', default: '"multiple"' },
  { name: "defaultOpen", type: "string[]", default: "[]", note: "open on first render, without animating" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "variant", type: '"card" | "flush"', default: '"card"' },
  { name: "icon", type: '"plus" | "chevron"', default: '"plus"' },
  { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3" },
  { name: "forceState", type: 'ForceState | "open"', note: "the first item only, for the StateGrid" },
  { name: "className", type: "string" },
];

export const ACC_CODE = `import { Accordion } from "@/components/design-system/Accordion";

<Accordion
  items={[{ id: "what", title: "What is a player model?", content: "A model of how people really play..." }]}
  defaultOpen={["what"]}
/>`;

export const FAQ_CODE = `import { Faq } from "@/components/website/Faq";

<Faq />`;
