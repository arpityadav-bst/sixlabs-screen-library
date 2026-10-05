// The Chip section's data: labels quoted from the site (the players' traits and types), state lists,
// anatomy pins, drawer rows and the snippet.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import type { ChipKind, ChipSize } from "@/components/design-system/Chip";
import { CHIP_SIZE } from "@/components/design-system/chip-styles";
import { FORCE_PROP } from "./act-sel-rows";
import { heightOf, sizeNames, sv, tv, type CheckedRow, type Pin } from "./display-values";

/** The trait labels (players-data.ts:31) filter, the player types (players-data.ts:40) are one choice. */
export const TRAITS = ["Curiosity", "Patience", "Price sensitivity", "Skill"] as const;
export const TYPES = ["The explorer", "The grinder", "The spender", "The one you lose"] as const;
export const JOB_TITLES = ["Intelligence", "Testing", "Game creation"] as const;

export const CHIP_KINDS: readonly ChipKind[] = ["filter", "choice", "input"];
export const CHIP_STATES = [
  "rest",
  "hover",
  "focus-visible",
  "pressed",
  "selected",
  "selected-hover",
  "disabled",
  "remove-hover",
] as const;

/** Which state a kind does not have: input holds a value (no press, no selected), only input removes. */
export function chipHas(kind: ChipKind, state: string): boolean {
  if (state === "remove-hover") return kind === "input";
  if (kind === "input") return state !== "pressed" && state !== "selected" && state !== "selected-hover";
  return true;
}

/** The rungs, read from CHIP_SIZE, so the ladder cannot drift from the part. */
export const CHIP_SIZES: readonly { name: ChipSize; px: number }[] = sizeNames(CHIP_SIZE).map((name) => ({ name, px: heightOf(CHIP_SIZE[name]) }));

/** The part and its class maps, cited by path: the guide's own kit has a Chip.tsx too. */
const CH = "components/design-system/Chip.tsx";
const CS = "components/design-system/chip-styles.ts";

export const CHIP_PINS: readonly Pin[] = [
  { selector: "[data-pin=filter] button", name: "Pill", token: "--ds-radius-full", value: "px 12, 1px border, md, 32 tall", source: `${CS}:8,11, ${CH}:102`, expect: ['md: "h-8"', "rounded-full border", '"px-3"'], padding: true },
  { selector: "[data-pin=filter] button > span:first-child", name: "Check", token: "--ds-icon-14", value: "grows from width 0 over 200ms", source: `${CH}:114-115,118`, expect: ["duration-(--ds-dur-ui)", '"mr-1.5 w-3.5 opacity-100" : "w-0 opacity-0"', "<Check size={14}"] },
  { selector: "[data-pin=filter] button > span:last-child", name: "Label", value: "Inter 13 / 500, white when selected", source: `${CS}:12,22, ${CH}:123`, expect: ["text-[13px] font-medium", "data-selected:text-white", "<span>{children}</span>"] },
  { selector: "[data-pin=input] > span > span:first-child", name: "Avatar", value: "Avatar 20, mr 6", source: `${CH}:121`, expect: '<span className="mr-1.5 inline-flex shrink-0">{avatar}</span>', side: "right" },
  { selector: "[data-pin=input] > span > button", name: "Remove", value: "X 14 in a 20 circle, 24 hit area", source: `${CS}:47, ${CH}:144,146`, expect: ["ml-1.5 grid h-5 w-5", 'styles["ds-hit"]', "<X aria-hidden size={14}"], side: "right" },
];

export const CHIP_VALUES: readonly CheckedRow[] = [
  tv("Rest fill", "color-surface"),
  tv("Rest border", "color-line"),
  tv("Rest label", "color-text-body"),
  tv("Hover border", "color-line-strong"),
  tv("Hover label", "color-ink"),
  tv("Selected fill", "color-primary"),
  tv("Selected hover fill", "color-primary-hover", `${CS}:29`, "data-selected:hover:bg-(--ds-color-primary-hover)"),
  tv("Remove hover", "color-fill-open"),
  tv("Line on blue", "color-on-blue-40", `${CS}:36`, "border-(--ds-color-on-blue-40)"),
  tv("Focus ring on blue", "focus-color-inverse", `${CH}:101`, 'const ring = ground === "onBlue" ? FOCUS_INVERSE : FOCUS;'),
  sv("Label on blue", "white, on the blue itself with no fill under it", `${CS}:36`, undefined, "bg-transparent text-white"),
  tv("Hover fill on blue", "color-on-blue-15", `${CS}:39`, "hover:bg-(--ds-color-on-blue-15)"),
  tv("Selected on blue", "color-surface", `${CS}:37`, "data-selected:bg-(--ds-color-surface)"),
  tv("Remove hover on blue", "color-on-blue-25", `${CS}:42`, "enabled:hover:bg-(--ds-color-on-blue-25)"),
  tv("Colour and check", "dur-ui"),
  sv("Heights", CHIP_SIZES.map((s) => `${s.name} ${s.px}`).join(" · "), `${CS}:8`, undefined, ...CHIP_SIZES.map((s) => `${s.name}: "${CHIP_SIZE[s.name]}"`)),
  {
    ...sv("Label", "Inter 13 / 500, px 12, gap 6", `${CS}:11-12, ${CH}:102, 115`),
    assert: [system("chip-styles.ts", "rounded-full border font-sans", "text-[13px] font-medium"), system("Chip.tsx", ': "px-3";', '"mr-1.5 w-3.5 opacity-100"')],
  },
  tv("Press", "scale-press-pill", `${CS}:16`, "active:scale-(--ds-scale-press-pill)"),
  sv("Remove", "collapses over 160ms, at once under reduced motion", `${CH}:80, 99`, undefined, "if (still || !el) return onRemove();", "max-width var(--ds-dur-quick) var(--ds-ease-out)"),
  sv("Row gap", "8px, wrapping by default"),
];

export const CHIP_PROPS: readonly PropRow[] = [
  { name: "kind", type: "filter | choice | input", default: "filter" },
  { name: "selected", type: "boolean", default: "false", note: "navy with a check" },
  { name: "onToggle", type: "(next: boolean) => void" },
  { name: "onRemove", type: "() => void", note: "input: the remove button, Backspace or Delete" },
  { name: "icon", type: "LucideIcon", note: "at 14" },
  { name: "avatar", type: "ReactNode", note: "a 20px Avatar" },
  { name: "size", type: "sm | md | lg", default: "md" },
  { name: "ground", type: "light | onBlue", default: "light" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "children", type: "string", note: "the label, also the remove button's name" },
  FORCE_PROP,
];

export const CHIP_CODE = `import { Chip } from "@/components/design-system/Chip";

<div role="group" aria-label="Filter by trait" className="flex flex-wrap gap-2">
  <Chip selected={on} onToggle={setOn}>Curiosity</Chip>
</div>`;
