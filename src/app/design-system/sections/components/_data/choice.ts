// Data for the Checkbox, radio, switch section: states, pins, the drawer's values and props, and code.
// Copy is the site's own (the jobs and player types) or obvious settings filler.
import { contrastRatio, formatRatio } from "@/app/design-system/_kit/contrast";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { WATER } from "../contrast-pairs";
import { tokenColour, type Pin } from "../display-values";

const CS = "choice-styles.ts";

export const SIZES = ["sm", "md", "lg"] as const;

/** Each control's states, with the checked or on twin of every state the value changes the look of. */
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
  { selector: "[data-slot=glyph]", name: "Glyph", value: "Check or X 10", source: "Switch.tsx:179,181", expect: ['<Check size={10} strokeWidth={3} data-slot="glyph" />', '<X size={10} strokeWidth={3} data-slot="glyph"'], side: "left" },
  { selector: "[data-slot=label]", name: "Label", value: "Inter 14/20", source: `${CS}:17`, expect: 'CHOICE_LABEL = "text-[14px] leading-5', side: "right" },
  { selector: "[data-slot=description]", name: "Description", token: "--ds-color-text-muted", value: "13/18", source: `${CS}:18`, expect: 'CHOICE_DESC = "text-[13px] leading-[18px] text-(--ds-color-text-muted)"', side: "right" },
];

/** A token's ratio on white, rounded down as every badge rounds it. */
const onWhite = (name: string) => `${formatRatio(contrastRatio(tokenColour(name), "#ffffff") ?? 0)}:1`;

export const CHECK_VALUES: readonly ValueRow[] = [
  { part: "Box sm / md / lg", value: "16 / 18 / 20, radius 4 / 4 / 6", source: `${CS}:23-25` },
  { part: "Line at rest", token: "--ds-color-line-field", value: "1.5px #848fa1", source: `${CS}:35, 46` },
  { part: "Hover", token: "--ds-color-text-muted, --ds-color-fill-hover", value: "#64748b line, slate 50 fill", source: `${CS}:59` },
  { part: "Checked", token: "--ds-color-primary", value: "#0a152d fill, white tick", source: `${CS}:47` },
  { part: "Checked hover", token: "--ds-color-primary-hover", value: "#0c1e42", source: `${CS}:63` },
  { part: "Tick", value: "10 / 12 / 14 at stroke 3, dashoffset over 160ms", source: "Checkbox.tsx:151" },
  { part: "Indeterminate", value: "a bar in place of the tick, aria-checked mixed", source: "Checkbox.tsx:53" },
  { part: "Pressed", token: "--ds-scale-press-mark", value: "scale 0.92", source: `${CS}:39-40` },
  { part: "Invalid", token: "--ds-color-danger", value: "#d92d20 line", source: `${CS}:48` },
  { part: "Read-only, off", token: "--ds-color-line-field, --ds-color-surface-sunken", value: `the field line (${onWhite("color-line-field")}) on the sunken fill, focusable`, source: `${CS}:49-51` },
  { part: "Read-only, checked", token: "--ds-color-text-muted", value: `a muted fill (${onWhite("color-text-muted")}) with a white tick, focusable`, source: `${CS}:52` },
  { part: "Disabled", value: "the whole row at 40%", source: `${CS}:11` },
  { part: "Focus", token: "--ds-focus-color", value: "2px ring, 2px off the box", source: `${CS}:29-32` },
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

export const RADIO_VALUES: readonly ValueRow[] = [
  { part: "Circle sm / md / lg", value: "16 / 18 / 20, line 1.5", source: `${CS}:23-25, 35` },
  { part: "Checked", token: "--ds-color-primary", value: "navy line, white centre, navy dot", source: `${CS}:74` },
  { part: "Dot sm / md / lg", value: "6 / 8 / 9", source: `${CS}:23-25` },
  { part: "Dot in", token: "--ds-spring-thumb", value: "scale 0 to 1, stiffness 500, damping 40", source: "Radio.tsx:110" },
  { part: "Group gap", value: "12 stacked, 24 across, stacks under 480", source: "ChoiceGroup.tsx:52-56" },
  { part: "Card", token: "--ds-radius-lg", value: "white, hairline, radius 28, p 24, radio at 16 from the top right", source: "Radio.tsx:49-50" },
  { part: "Card selected", token: "--ds-color-primary", value: "a 2px navy line drawn as border plus inset", source: "Radio.tsx:55" },
  { part: "Card row", value: "three across from 640, stacked under it", source: "Radio.tsx:202" },
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

export const SWITCH_VALUES: readonly ValueRow[] = [
  { part: "Track sm / md / lg", value: "28 x 16 / 36 x 20 / 44 x 24", source: "Switch.tsx:21-23" },
  { part: "Thumb", value: "12 / 16 / 20, inset 2, 0 1px 3px ink at 25%", source: `Switch.tsx:165-173, ${CS}:96` },
  { part: "Off", token: "--ds-color-line-field", value: "#848fa1, hover #64748b", source: "Switch.tsx:28-31" },
  { part: "On", token: "--ds-color-primary", value: "#0a152d, hover #0c1e42", source: "Switch.tsx:32-35" },
  { part: "Travel", token: "--ds-spring-thumb", value: "stiffness 500, damping 40", source: "Switch.tsx:170-171" },
  { part: "Track colour", token: "--ds-dur-ui", value: "200ms", source: "Switch.tsx:160" },
  { part: "Pressed", value: "the thumb 4px wider, toward the travel", source: "Switch.tsx:135, 170" },
  { part: "Loading", value: "Spinner 8 (12 at md and lg) in the thumb, aria-busy", source: "Switch.tsx:176" },
  { part: "Read-only, off", token: "--ds-color-line-field, --ds-color-surface-sunken", value: `a sunken track with the field line (${onWhite("color-line-field")}) inside it, focusable`, source: "Switch.tsx:36-38" },
  { part: "Read-only, on", token: "--ds-color-text-muted", value: `the muted text (${onWhite("color-text-muted")}), focusable`, source: "Switch.tsx:39" },
  { part: "On blue, off", token: "--ds-color-on-blue-25", value: "white 25% track", source: "Switch.tsx:42" },
  { part: "On blue, on", value: "white track, navy thumb, white ring", source: "Switch.tsx:46, 130" },
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
