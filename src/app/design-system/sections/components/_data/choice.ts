// Data for the Checkbox, radio, switch section: states, pins, the drawer's values and props, and code.
// Copy is the site's own (the jobs and player types) or obvious settings filler.
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { ICON_STROKE } from "@/components/design-system/token-shape";
import { WATER } from "../contrast-pairs";
import { tokenColour, type CheckedRow, type Pin } from "../display-values";

const CS = "choice-styles.ts";
const SW = "Switch.tsx";
const RD = "Radio.tsx";

export const SIZES = ["sm", "md", "lg"] as const;

/** Each control's states, with the checked or on twin of every state the value changes the look of, and
 *  invalid-checked, which keeps the checked navy (markTone, choice-styles.ts:86-88): a ticked box is never
 *  the wrong one, so only the group's message carries the error. */
export const CHECK_STATES = [
  "unchecked",
  "hover",
  "checked",
  "checked-hover",
  "indeterminate",
  "focus-visible",
  "pressed",
  "disabled",
  "disabled-checked",
  "invalid",
  "invalid-checked",
  "read-only",
  "read-only-checked",
] as const;
export type CheckState = (typeof CHECK_STATES)[number];

export const RADIO_STATES = [
  "unchecked",
  "hover",
  "checked",
  "checked-hover",
  "focus-visible",
  "pressed",
  "disabled",
  "disabled-checked",
  "invalid",
  "read-only",
  "read-only-checked",
] as const;
export type RadioState = (typeof RADIO_STATES)[number];

/** The card radio's own look: its hover line, the 2px checked line, the ring round the card, its press, and
 *  the invalid, read-only and disabled forms with their checked twins. */
export const CARD_RADIO_STATES = [
  "rest",
  "hover",
  "checked",
  "checked-hover",
  "focus-visible",
  "pressed",
  "disabled",
  "disabled-checked",
  "invalid",
  "read-only",
  "read-only-checked",
] as const;
export type CardRadioState = (typeof CARD_RADIO_STATES)[number];

export const SWITCH_STATES = [
  "off",
  "on",
  "hover",
  "on-hover",
  "focus-visible",
  "pressed",
  "on-pressed",
  "disabled",
  "disabled-on",
  "loading",
  "loading-off",
  "read-only",
  "read-only-on",
] as const;
export type SwitchState = (typeof SWITCH_STATES)[number];
export const SWITCH_BLUE_STATES = [
  "off",
  "on",
  "hover",
  "on-hover",
  "focus-visible",
  "pressed",
  "on-pressed",
  "disabled",
  "disabled-on",
  "loading",
  "loading-off",
  "read-only",
  "read-only-on",
] as const;

/** The interaction a state forces, read off its name, so a checked twin forces the same as its rest one. */
export function forcedBy(state: string): "hover" | "focus-visible" | "pressed" | undefined {
  if (state.endsWith("hover")) return "hover";
  if (state === "focus-visible") return "focus-visible";
  if (state.endsWith("pressed")) return "pressed";
  return undefined;
}

/** A switch's label on the water: white, as Switch.tsx:189 sets it on the blue ground. */
export const SWITCH_BLUE_LABEL = { fg: tokenColour("color-surface"), bg: WATER };
export const SWITCH_BLUE_MISS = (contrastRatio(SWITCH_BLUE_LABEL.fg, SWITCH_BLUE_LABEL.bg) ?? 0) < 4.5;

export const JOB_OPTIONS = JOBS.map((j) => ({ value: j.id, label: j.title, description: j.body }));
export const PLAYER_OPTIONS = PLAYERS.map((p) => ({ value: p.id, label: p.title, description: p.tagline }));

export const CHECK_PINS: readonly Pin[] = [
  { selector: "[data-slot=box]", name: "Box", token: "--ds-color-primary", value: "18, radius 4, line 1.5", source: `${CS}:24,35`, expect: ['md: { box: "h-[18px] w-[18px] rounded-(--ds-radius-mark-sm)"', "border-[1.5px]"], side: "left" },
  { selector: "[data-slot=tick]", name: "Tick", value: "12 at stroke 3, drawn over 160ms", source: "Checkbox.tsx:140,151", expect: ["strokeWidth={3}", "duration-(--ds-dur-quick)"], side: "left" },
  { selector: "[data-slot=label]", name: "Label", value: "Inter 14/20, 10 from the box", source: `${CS}:10,17`, expect: ["gap-2.5", 'CHOICE_LABEL = "text-[14px] leading-5'], side: "right" },
  { selector: "[data-slot=description]", name: "Description", token: "--ds-color-text-muted", value: "13/18", source: `${CS}:18`, expect: 'CHOICE_DESC = "text-[13px] leading-[18px] text-(--ds-color-text-muted)"', side: "right" },
  { selector: "[data-slot=checkbox]", name: "Row", value: "24 tall at least, 32 on touch", source: `${CS}:10`, expect: ["min-h-6", "pointer-coarse:min-h-8"], side: "left" },
];

export const RADIO_PINS: readonly Pin[] = [
  { selector: "[data-slot=legend]", name: "Legend", value: "Inter 13/18 500, the field label", source: "field-styles.ts:82-83", expect: ["FIELD_LABEL", "text-[13px] font-medium leading-[18px]"], side: "left" },
  { selector: "[data-slot=circle]", index: 1, name: "Circle", token: "--ds-color-primary", value: "18, line 1.5", source: `${CS}:24,35`, expect: ['circle: "h-[18px] w-[18px]"', "border-[1.5px]"], side: "left" },
  { selector: "[data-slot=dot]", index: 1, name: "Dot", value: "8, on the thumb spring", source: `Radio.tsx:110, ${CS}:24`, expect: ["SPRING.thumb", 'dot: "h-2 w-2"'], side: "left" },
  { selector: "[data-slot=label]", index: 1, name: "Label", value: "Inter 14/20", source: `${CS}:17`, expect: 'CHOICE_LABEL = "text-[14px] leading-5', side: "right" },
  { selector: "[data-slot=description]", index: 1, name: "Description", token: "--ds-color-text-muted", value: "13/18", source: `${CS}:18`, expect: 'CHOICE_DESC = "text-[13px] leading-[18px] text-(--ds-color-text-muted)"', side: "right" },
];

export const SWITCH_PINS: readonly Pin[] = [
  { selector: "[data-slot=track]", name: "Track", token: "--ds-color-primary", value: "36 x 20, on", source: "Switch.tsx:22,32", expect: ['md: { track: "h-5 w-9"', 'on: "bg-(--ds-color-primary)"'], padding: true, side: "left" },
  { selector: "[data-slot=thumb]", name: "Thumb", token: "--ds-color-surface", value: "16, inset 2, 0 1px 3px", source: `Switch.tsx:168,170,173, ${CS}:96`, expect: ['data-slot="thumb"', "width: s.thumb + grow", "absolute left-0.5 top-0.5", "shadow-[0_1px_3px_color-mix(in_srgb,var(--ds-color-ink)_25%,transparent)]"], side: "left" },
  { selector: "[data-slot=glyph]", name: "Glyph", token: "--ds-icon-12", value: `Check or X 12 at stroke ${ICON_STROKE[12]}`, source: "Switch.tsx:179,181", expect: ['<Check size={12} strokeWidth={ICON_STROKE[12]} data-slot="glyph" />', '<X size={12} strokeWidth={ICON_STROKE[12]} data-slot="glyph"'], side: "left" },
  { selector: "[data-slot=label]", name: "Label", value: "Inter 14/20", source: `${CS}:17`, expect: 'CHOICE_LABEL = "text-[14px] leading-5', side: "right" },
  { selector: "[data-slot=description]", name: "Description", token: "--ds-color-text-muted", value: "13/18", source: `${CS}:18`, expect: 'CHOICE_DESC = "text-[13px] leading-[18px] text-(--ds-color-text-muted)"', side: "right" },
];

/** A token's ratio on white, rounded down as every badge rounds it. */
const onWhite = (name: string) => `${formatRatio(contrastRatio(tokenColour(name), "#ffffff") ?? 0)}:1`;

export const CHECK_VALUES: readonly CheckedRow[] = [
  { part: "Box sm / md / lg", value: "16 / 18 / 20, radius 4 / 4 / 6", source: `${CS}:23-25`, assert: system(CS, 'box: "h-4 w-4 rounded-(--ds-radius-mark-sm)"', 'box: "h-[18px] w-[18px] rounded-(--ds-radius-mark-sm)"', 'box: "h-5 w-5 rounded-(--ds-radius-mark)"') },
  { part: "Line at rest", token: "--ds-color-line-field", value: "1.5px #848fa1", source: `${CS}:35, 46`, assert: system(CS, "border-[1.5px]", 'off: "border-(--ds-color-line-field)') },
  { part: "Hover", token: "--ds-color-text-muted, --ds-color-fill-hover", value: "#64748b line, slate 50 fill", source: `${CS}:59`, assert: system(CS, "group-hover/choice:border-(--ds-color-text-muted) group-hover/choice:bg-(--ds-color-fill-hover)") },
  { part: "Checked", token: "--ds-color-primary", value: "#0a152d fill, white tick", source: `${CS}:47`, assert: system(CS, 'on: "border-(--ds-color-primary) bg-(--ds-color-primary) text-white"') },
  { part: "Checked hover", token: "--ds-color-primary-hover", value: "#0c1e42", source: `${CS}:63`, assert: system(CS, "group-hover/choice:border-(--ds-color-primary-hover) group-hover/choice:bg-(--ds-color-primary-hover)") },
  { part: "Tick", value: "12 / 12 / 14 at stroke 3, dashoffset over 160ms", source: `${CS}:23-25, Checkbox.tsx:140,151`, assert: [system(CS, 'tick: 12, dot: "h-1.5 w-1.5"', 'tick: 12, dot: "h-2 w-2"', 'tick: 14, dot: "h-[9px] w-[9px]"'), system("Checkbox.tsx", "strokeWidth={3}", "transition-[stroke-dashoffset] duration-(--ds-dur-quick)")] },
  { part: "Indeterminate", value: "a bar in place of the tick, aria-checked mixed", source: "Checkbox.tsx:53, 85, 89", assert: system("Checkbox.tsx", 'const BAR = "M5 12h14";', "const glyph = indeterminate ? BAR : TICK;", "input.current.indeterminate = indeterminate;") },
  { part: "Pressed", token: "--ds-scale-press-mark", value: "scale 0.92", source: `${CS}:39-40`, assert: system(CS, "group-active/choice:scale-(--ds-scale-press-mark)") },
  { part: "Invalid", token: "--ds-color-danger", value: "#d92d20 line", source: `${CS}:48`, assert: system(CS, 'invalid: "border-(--ds-color-danger) bg-(--ds-color-surface)"') },
  { part: "Read-only, off", token: "--ds-color-line-field, --ds-color-surface-sunken", value: `the field line (${onWhite("color-line-field")}) on the sunken fill, focusable`, source: `${CS}:49-51`, assert: system(CS, 'readOnlyOff: "border-(--ds-color-line-field) bg-(--ds-color-surface-sunken)"') },
  { part: "Read-only, checked", token: "--ds-color-text-muted", value: `a muted fill (${onWhite("color-text-muted")}) with a white tick, focusable`, source: `${CS}:52`, assert: system(CS, 'readOnlyOn: "border-(--ds-color-text-muted) bg-(--ds-color-text-muted) text-white"') },
  { part: "Disabled", value: "the whole row at 40%", source: `${CS}:11`, assert: system(CS, "data-disabled:opacity-40") },
  { part: "Focus", token: "--ds-focus-color", value: "2px ring, 2px off the box", source: `${CS}:29-32`, assert: system(CS, "outline-offset-(--ds-focus-offset) peer-focus-visible:outline-(length:--ds-focus-width)", "peer-focus-visible:outline-(--ds-focus-color)") },
];

export const CHECK_PROPS: readonly PropRow[] = [
  { name: "label", type: "ReactNode" },
  { name: "description", type: "ReactNode" },
  { name: "checked, defaultChecked, onChange", type: "boolean, (checked, e) => void" },
  { name: "indeterminate", type: "boolean" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "disabled, readOnly, invalid, required", type: "boolean" },
  { name: "name, value", type: "string", note: "submitted with the form" },
  { name: "forceState", type: "ForceState" },
];

export const CHECK_CODE = `import { Checkbox } from "@/components/design-system/Checkbox";
import { ChoiceGroup } from "@/components/design-system/ChoiceGroup";

<ChoiceGroup legend="Which jobs do you need?" error={error}>
  {({ describedBy, invalid }) =>
    jobs.map((j) => (
      <Checkbox key={j.id} label={j.title} invalid={invalid} aria-describedby={describedBy} />
    ))
  }
</ChoiceGroup>`;

export const RADIO_VALUES: readonly CheckedRow[] = [
  { part: "Circle sm / md / lg", value: "16 / 18 / 20, line 1.5", source: `${CS}:23-25, 35`, assert: system(CS, 'circle: "h-4 w-4"', 'circle: "h-[18px] w-[18px]"', 'circle: "h-5 w-5"', "border-[1.5px]") },
  { part: "Checked", token: "--ds-color-primary", value: "navy line, white centre, navy dot", source: `${CS}:74`, assert: system(CS, 'on: "border-(--ds-color-primary) bg-(--ds-color-surface) text-(--ds-color-primary)"') },
  { part: "Dot sm / md / lg", value: "6 / 8 / 9", source: `${CS}:23-25`, assert: system(CS, 'dot: "h-1.5 w-1.5"', 'dot: "h-2 w-2"', 'dot: "h-[9px] w-[9px]"') },
  { part: "Dot in", token: "--ds-spring-thumb", value: "scale 0 to 1, stiffness 500, damping 40", source: `${RD}:109-110`, assert: system(RD, "animate={{ scale: checked ? 1 : 0 }}", "SPRING.thumb") },
  { part: "Group gap", value: "12 stacked, 24 across, stacks under 480", source: "ChoiceGroup.tsx:52-56", assert: system("ChoiceGroup.tsx", '"flex flex-row flex-wrap gap-x-6 gap-y-3 max-[480px]:flex-col"', '"flex flex-col gap-3"') },
  { part: "Card", token: "--ds-radius-lg", value: "white, hairline, radius 28, p 24, radio at 16 from the top right", source: `${RD}:49-50, 88`, assert: system(RD, "rounded-(--ds-radius-lg) border border-(--ds-color-line) bg-(--ds-color-surface) p-6 pr-12", "absolute right-4 top-4") },
  { part: "Card selected", token: "--ds-color-primary", value: "a 2px navy line drawn as border plus inset", source: `${RD}:55`, assert: system(RD, 'const CARD_ON = "border-(--ds-color-primary) shadow-[inset_0_0_0_1px_var(--ds-color-primary)]";') },
  { part: "Card row", value: "three across from 640, stacked under it", source: `${RD}:202`, assert: system(RD, '"grid grid-cols-1 gap-4 sm:grid-cols-3"') },
];

export const RADIO_PROPS: readonly PropRow[] = [
  { name: "legend", type: "ReactNode" },
  { name: "options", type: "{ value, label, description?, disabled? }[]" },
  { name: "value, defaultValue, onChange", type: "string, (value) => void" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"' },
  { name: "variant", type: '"list" | "card"', default: '"list"' },
  { name: "helper, error", type: "ReactNode" },
  { name: "disabled, readOnly", type: "boolean" },
];

export const RADIO_CODE = `import { RadioGroup } from "@/components/design-system/Radio";

<RadioGroup
  legend="First job"
  variant="card"
  options={jobs.map((j) => ({ value: j.id, label: j.title, description: j.body }))}
  onChange={setJob}
/>`;

export const SWITCH_VALUES: readonly CheckedRow[] = [
  { part: "Track sm / md / lg", value: "28 x 16 / 36 x 20 / 44 x 24", source: `${SW}:21-23`, assert: system(SW, 'track: "h-4 w-7"', 'track: "h-5 w-9"', 'track: "h-6 w-11"') },
  { part: "Thumb", value: "12 / 16 / 20, inset 2, 0 1px 3px ink at 25%", source: `${SW}:21-23, 173, ${CS}:96`, assert: [system(SW, "thumb: 12,", "thumb: 16,", "thumb: 20,", "absolute left-0.5 top-0.5"), system(CS, "shadow-[0_1px_3px_color-mix(in_srgb,var(--ds-color-ink)_25%,transparent)]")] },
  { part: "Off", token: "--ds-color-line-field", value: "#848fa1, hover #64748b", source: `${SW}:28-31`, assert: system(SW, 'off: "bg-(--ds-color-line-field)"', "group-hover/choice:bg-(--ds-color-text-muted)") },
  { part: "On", token: "--ds-color-primary", value: "#0a152d, hover #0c1e42", source: `${SW}:32-35`, assert: system(SW, 'on: "bg-(--ds-color-primary)"', "group-hover/choice:bg-(--ds-color-primary-hover)") },
  { part: "Travel", token: "--ds-spring-thumb", value: "stiffness 500, damping 40", source: `${SW}:170-171`, assert: system(SW, "SPRING.thumb") },
  { part: "Track colour", token: "--ds-dur-ui", value: "200ms", source: `${SW}:160`, assert: system(SW, "transition-colors duration-(--ds-dur-ui)") },
  { part: "Pressed", value: "the thumb 4px wider, toward the travel", source: `${SW}:135, 170`, assert: system(SW, "const grow = pressed ? 4 : 0;", "x: on ? s.travel - grow : 0, width: s.thumb + grow") },
  { part: "Loading", value: "Spinner 8 (12 at md and lg) in the thumb, aria-busy", source: `${SW}:21-23, 146, 176`, assert: system(SW, "spin: 8 }", "travel: 16, spin: 12 }", "travel: 20, spin: 12 }", "aria-busy={loading || undefined}", "<Spinner size={s.spin}") },
  { part: "Read-only, off", token: "--ds-color-line-field, --ds-color-surface-sunken", value: `a sunken track with the field line (${onWhite("color-line-field")}) inside it, focusable`, source: `${SW}:38`, assert: system(SW, 'readOff: "bg-(--ds-color-surface-sunken) shadow-[inset_0_0_0_1.5px_var(--ds-color-line-field)]"') },
  { part: "Read-only, on", token: "--ds-color-text-muted", value: `the muted text (${onWhite("color-text-muted")}), focusable`, source: `${SW}:39`, assert: system(SW, 'readOn: "bg-(--ds-color-text-muted)"') },
  { part: "On blue, off", token: "--ds-color-on-blue-25", value: "white 25% track", source: `${SW}:42`, assert: system(SW, 'off: "bg-(--ds-color-on-blue-25)"') },
  { part: "On blue, on", value: "white track, navy thumb, white ring", source: `${SW}:46, 130, 162`, assert: system(SW, 'on: "bg-(--ds-color-surface)"', 'blue && on ? "bg-(--ds-color-primary) text-white"', "blue ? FOCUS_INVERSE : FOCUS") },
];

export const SWITCH_PROPS: readonly PropRow[] = [
  { name: "label, description", type: "ReactNode", note: "or aria-label without a visible label" },
  { name: "checked, defaultChecked, onChange", type: "boolean, (checked) => void" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
  { name: "loading", type: "boolean" },
  { name: "icons", type: "boolean", note: "a check or a cross in the thumb" },
  { name: "ground", type: '"light" | "onBlue"', default: '"light"' },
  { name: "labelPosition", type: '"start" | "end"', default: '"end"' },
  { name: "disabled, readOnly", type: "boolean" },
  { name: "forceState", type: "ForceState" },
];

export const SWITCH_CODE = `import { Switch } from "@/components/design-system/Switch";

<Switch
  label="Email me when a run finishes"
  checked={notify}
  loading={saving}
  onChange={(on) => save({ notify: on })}
/>`;
