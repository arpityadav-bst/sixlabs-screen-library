// Data for the Text fields section: anatomy pins, the drawer's values and props, the code snippets and
// the specimen copy. Values cite the component file that writes them (paths from src/components/design-system).
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import { tokenColour, type CheckedRow, type Pin } from "../display-values";

const FS = "field-styles.ts";
const TA = "TextArea.tsx";

/** A token's ratio on white, rounded down as every badge rounds it. */
const onWhite = (name: string) => `${formatRatio(contrastRatio(tokenColour(name), "#ffffff") ?? 0)}:1 on white`;

/** Every look the box takes, and the two that focus lays over invalid and read-only. */
export const FIELD_STATES = [
  "rest",
  "hover",
  "focus",
  "filled",
  "disabled",
  "read-only",
  "read-only-focus",
  "invalid",
  "invalid-focus",
  "success",
] as const;
export type FieldState = (typeof FIELD_STATES)[number];
export const FIELD_SIZES = ["sm", "md", "lg"] as const;

export const AREA_STATES = [
  "rest",
  "hover",
  "focus",
  "filled",
  "near-limit",
  "over-limit-typing",
  "over-limit",
  "invalid",
  "invalid-focus",
  "disabled",
  "read-only",
  "read-only-focus",
] as const;
export type AreaState = (typeof AREA_STATES)[number];

/** The states a field shows with focus forced on: over the limit while typing is still in the field. */
export const FOCUSED: readonly string[] = ["focus", "invalid-focus", "read-only-focus", "over-limit-typing"];

/** Specimen copy: obvious filler for a studio signing up. */
export const COPY = {
  email: "Work email",
  emailHint: "you@studio.com",
  emailValue: "mira@northwind.games",
  emailError: "Enter an email like you@studio.com.",
  emailOk: "Access details go to this address.",
  studio: "Studio name",
  studioValue: "Northwind Games",
  studioHelper: "Shown on your invoices.",
  studioError: "That name is already in use.",
  notes: "What should the players test?",
  notesHelper: "A sentence or two is plenty.",
  notesError: "Add a line about what to test.",
  notesShort: "The first ten minutes of the tutorial.",
  notesNear: "The first ten minutes of the tutorial, the shop and the second boss fight on hard mode",
  notesOver: "The first ten minutes of the tutorial, the shop, the second boss fight on hard mode and the co-op lobby",
} as const;

/** The textarea's soft limit in the specimens, so near and over fit in a cell. */
export const NOTES_MAX = 90;

/** Two fields: the first at rest with its helper and counter, the second invalid with its message. */
/** The label pin both fields share: FIELD_LABEL, Inter 13/18 500. */
const LABEL_PIN: Pin = {
  selector: "[data-slot=label]",
  name: "Label",
  value: "Inter 13/18 500, -0.01em, 8 above the box",
  source: `${FS}:82-83`,
  expect: ["FIELD_LABEL", "mb-2 block font-sans text-[13px] font-medium leading-[18px] tracking-[-0.01em]"],
  side: "left",
};
const HELPER_PIN: Pin = {
  selector: "[data-slot=helper]",
  name: "Helper",
  token: "--ds-color-text-muted",
  value: "13/18, 6 below",
  source: "Field.tsx:105,107",
  expect: ["pt-1.5", 'data-slot="helper"'],
  side: "left",
};

export const FIELD_PINS: readonly Pin[] = [
  LABEL_PIN,
  { selector: "[data-slot=box]", name: "Box", token: "--ds-color-line-field", value: "44 tall, radius 12, px 14", source: `${FS}:24,26-27,52`, expect: ['"h-11"', '"px-3.5"', "rounded-(--ds-radius-xs)", "border-(--ds-color-line-field)"], padding: true, side: "right" },
  { selector: "[data-slot=icon]", name: "Leading icon", token: "--ds-icon-16", value: "16, slate 500", source: "TextInput.tsx:120-121,123", expect: ['data-slot="icon"', "size={s.icon}", "text-(--ds-color-text-muted)"], side: "left" },
  { selector: "[data-slot=value]", name: "Value", value: "Inter 15/22, 16 under md", source: `${FS}:25`, expect: "text-[15px] leading-[22px] max-md:text-[16px]", side: "left" },
  { selector: "[data-slot=trailing]", name: "Trailing slot", value: "unit, action or check", source: "TextInput.tsx:148", expect: 'data-slot="trailing"', side: "right" },
  HELPER_PIN,
  { selector: "[data-slot=counter]", name: "Counter", value: "Inter 12 tabular, count/max", source: "Field.tsx:115,117", expect: ["text-[12px] leading-[18px] tabular-nums", "{count}/{maxLength}"], side: "right" },
  { selector: "[data-slot=box]", index: 1, name: "Invalid box", token: "--ds-color-danger", value: "the line in danger, halo 16% on focus", source: `${FS}:57-58`, expect: ["border-(--ds-color-danger)", "--ds-focus-halo-danger"], side: "right" },
  { selector: "[data-slot=message]", name: "Message", token: "--ds-color-danger-ink", value: "13/18 with a 14 icon", source: "Field.tsx:134,136", expect: ['data-slot="message"', "<CircleAlert aria-hidden size={14}"], side: "left" },
];

export const AREA_PINS: readonly Pin[] = [
  { ...LABEL_PIN, value: "Inter 13/18 500" },
  { selector: "[data-slot=box]", name: "Box", token: "--ds-color-line-field", value: "112 at rest with its line, grows to 280", source: `TextArea.tsx:12, ${FS}:29`, expect: ["const MAX_H = 280;", 'area: "min-h-[110px]"'], side: "right" },
  { selector: "[data-slot=value]", name: "Text", value: "py 12, px 14", source: "TextArea.tsx:138", expect: 'py-3 ${size === "lg" ? "px-4" : "px-3.5"}', padding: true, side: "left" },
  { ...HELPER_PIN, value: "13/18, 6 below" },
  { selector: "[data-slot=counter]", name: "Counter", value: "ink near the limit, red past it", source: "Field.tsx:82,84", expect: ["text-(--ds-color-danger-ink)", "text-(--ds-color-ink)"], side: "right" },
];

export const TEXT_INPUT_VALUES: readonly CheckedRow[] = [
  { part: "Height sm / md / lg", value: "36 / 44 / 52", source: `${FS}:16, 24, 32`, assert: system(FS, 'h: "h-9"', 'h: "h-11"', 'h: "h-13"') },
  { part: "Text sm / md / lg", token: "--ds-text-14, --ds-text-15, --ds-text-16", value: "14/20, 15/22, 16/24", source: `${FS}:17, 25, 33`, assert: system(FS, 'text: "text-[14px] leading-5', 'text: "text-[15px] leading-[22px]', 'text: "text-[16px] leading-6"') },
  { part: "Text under md", value: "16/24 at every size", source: `${FS}:17, 25`, assert: system(FS, "leading-5 max-md:text-[16px] max-md:leading-6", "leading-[22px] max-md:text-[16px] max-md:leading-6") },
  { part: "Padding x", value: "12 / 14 / 16", source: `${FS}:18, 26, 34`, assert: system(FS, 'pad: "px-3",', 'pad: "px-3.5",', 'pad: "px-4",') },
  { part: "Radius", token: "--ds-radius-xs, --ds-radius-row", value: "12 / 12 / 14", source: `${FS}:19, 27, 35`, assert: system(FS, 'radius: "rounded-(--ds-radius-xs)"', 'radius: "rounded-(--ds-radius-row)"') },
  { part: "Line at rest", token: "--ds-color-line-field", value: `${tokenColour("color-line-field")}, ${onWhite("color-line-field")}`, source: `${FS}:52`, assert: system(FS, "border-(--ds-color-line-field) bg-(--ds-color-surface)") },
  { part: "Line on hover", token: "--ds-color-text-muted", value: "#64748b", source: `${FS}:53`, assert: system(FS, "hover:not-focus-within:border-(--ds-color-text-muted)") },
  { part: "Focus", token: "--ds-color-accent, --ds-focus-halo", value: "accent line, 0 0 0 3px accent 18%", source: `${FS}:54`, assert: system(FS, "focus-within:border-(--ds-color-accent) focus-within:shadow-(--ds-focus-halo)") },
  { part: "Invalid", token: "--ds-color-danger, --ds-color-danger-halo", value: "#d92d20, halo 16% on focus", source: `${FS}:57-58`, assert: system(FS, "border-(--ds-color-danger) bg-(--ds-color-surface)", "focus-within:shadow-(--ds-focus-halo-danger)") },
  { part: "Success", token: "--ds-color-success", value: "#15803d at 60%, a 16 check (18 at lg)", source: `${FS}:36, 62, TextInput.tsx:151`, assert: [system(FS, "border-(--ds-color-success)/60", "icon: 18,"), system("TextInput.tsx", "<CircleCheck aria-hidden size={s.icon}")] },
  { part: "Disabled", token: "--ds-color-surface-sunken", value: "#f6f7f9, slate 200 line, slate 400 text", source: `${FS}:67`, assert: system(FS, "cursor-not-allowed border-(--ds-color-line) bg-(--ds-color-surface-sunken) text-(--ds-color-text-quiet)") },
  { part: "Read-only", token: "--ds-color-surface-sunken", value: "#f6f7f9 with a hairline, focusable", source: `${FS}:69-71`, assert: system(FS, '"border-(--ds-color-line) bg-(--ds-color-surface-sunken) "', "focus-within:border-(--ds-color-accent)") },
  { part: "Caret", token: "--ds-color-accent", value: "#1a6dff", source: `${FS}:77`, assert: system(FS, "caret-(--ds-color-accent)") },
  { part: "Placeholder", token: "--ds-color-text-muted", value: `${tokenColour("color-text-muted")}, ${onWhite("color-text-muted")}`, source: `${FS}:78`, assert: system(FS, "placeholder:text-(--ds-color-text-muted)") },
  { part: "Autofill", value: "white fill, ink text", source: `${FS}:79`, assert: system(FS, "autofill:shadow-[inset_0_0_0_1000px_var(--ds-color-surface)]", "autofill:[-webkit-text-fill-color:var(--ds-color-ink)]") },
  { part: "Message enter", token: "--ds-dur-ui, --ds-ease-out", value: "height auto, y -2, 200ms", source: "Field.tsx:128-131", assert: system("Field.tsx", "{ height: 0, opacity: 0, y: -2 }", '{ height: "auto", opacity: 1, y: 0 }', "duration: still ? 0 : DUR.ui, ease: EASE") },
];

export const TEXT_INPUT_PROPS: readonly PropRow[] = [
  { name: "label", type: "string", note: "always set, hideLabel keeps it for assistive tech" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "helper", type: "ReactNode" },
  { name: "error", type: "ReactNode", note: "set on blur or submit, marks the box invalid" },
  { name: "success", type: "ReactNode" },
  { name: "optional", type: "boolean", note: 'prints "(optional)"' },
  { name: "leadingIcon", type: "LucideIcon" },
  { name: "trailing", type: "ReactNode" },
  { name: "disabled, readOnly, required", type: "boolean" },
  { name: "maxLength, showCount", type: "number, boolean", note: "a hard limit with the counter" },
  { name: "type", type: '"text" | "email" | "password" | "tel" | "url" | "search" | "number"', default: '"text"' },
  { name: "value, defaultValue, onChange", type: "string, (value, e) => void" },
  { name: "forceState", type: "ForceState", note: "hover and focus for the StateGrid" },
];

export const TEXT_INPUT_CODE = `import { Mail } from "lucide-react";
import { TextInput } from "@/components/design-system/TextInput";

<TextInput
  label="Work email"
  type="email"
  leadingIcon={Mail}
  placeholder="you@studio.com"
  error={touched && !valid ? "Enter an email like you@studio.com." : undefined}
  onBlur={() => setTouched(true)}
/>`;

export const TEXT_AREA_VALUES: readonly CheckedRow[] = [
  { part: "Min height sm / md / lg", value: "88 / 112 / 136 with its line", source: `${FS}:21, 29, 37`, assert: system(FS, 'area: "min-h-[86px]"', 'area: "min-h-[110px]"', 'area: "min-h-[134px]"') },
  { part: "Padding", value: "12 top and bottom, 14 sides (16 at lg)", source: `${TA}:138`, assert: system(TA, 'py-3 ${size === "lg" ? "px-4" : "px-3.5"}') },
  { part: "Grows to", value: "280, then scrolls", source: `${TA}:12, 92`, assert: system(TA, "const MAX_H = 280;", 'natural > MAX_H - 2 ? "auto" : "hidden"') },
  { part: "Growth", value: "height over 120ms, none under reduced motion", source: `${TA}:139`, assert: system(TA, "transition-[height] duration-(--ds-dur-press) ease-(--ds-ease-out) motion-reduce:transition-none") },
  { part: "Counter near the limit", token: "--ds-color-ink", value: "from 90% of maxLength", source: "Field.tsx:80, 84", assert: system("Field.tsx", "count >= Math.floor(maxLength * 0.9)", '? "text-(--ds-color-ink)"') },
  { part: "Counter over the limit", token: "--ds-color-danger-ink", value: "#b42318 at once, 500", source: "Field.tsx:79, 82", assert: system("Field.tsx", "const over = counting && count > maxLength;", '"font-medium text-(--ds-color-danger-ink)"') },
  { part: "Box over the limit", token: "--ds-color-danger", value: "after the first blur", source: `${TA}:74`, assert: system(TA, "const overError = over > 0 && touched") },
];

export const TEXT_AREA_PROPS: readonly PropRow[] = [
  { name: "label", type: "string" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "autoGrow", type: "boolean", default: "true" },
  { name: "maxLength", type: "number", note: "soft: the text is kept, the counter turns red" },
  { name: "touched", type: "boolean", note: "unset, the field tracks its own blur" },
  { name: "helper, error", type: "ReactNode" },
  { name: "disabled, readOnly, required", type: "boolean" },
  { name: "value, defaultValue, onChange", type: "string, (value, e) => void" },
  { name: "forceState", type: "ForceState" },
];

export const TEXT_AREA_CODE = `import { TextArea } from "@/components/design-system/TextArea";

<TextArea label="What should the players test?" helper="A sentence or two is plenty." maxLength={280} />`;
