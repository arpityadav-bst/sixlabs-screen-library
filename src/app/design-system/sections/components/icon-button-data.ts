// The Icon button section's data: sizes, state lists, anatomy pins, drawer rows and snippets.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { ICON_BUTTON_SIZE, type IconButtonSize, type IconButtonVariant } from "@/components/design-system/icon-button-styles";
import { FORCE_PROP } from "./act-sel-rows";
import { sizeNames, sv, tv, type Pin } from "./display-values";

/** The rungs and their icons, read from ICON_BUTTON_SIZE, so the ladder and its captions cannot drift. */
export const ICON_SIZES: readonly { name: IconButtonSize; px: number; icon: number }[] = sizeNames(ICON_BUTTON_SIZE).map((name) => ({
  name,
  px: ICON_BUTTON_SIZE[name].px,
  icon: ICON_BUTTON_SIZE[name].icon,
}));
const boxes = ICON_SIZES.map((s) => s.px).join(" / ");
const icons = ICON_SIZES.map((s) => s.icon).join(" / ");
/** "xs 28 · sm 32 ... · icons 14 / 16 ..." for the matrix caption. */
export const ICON_SIZE_LINE = `${ICON_SIZES.map((s) => `${s.name} ${s.px}`).join(" · ")} · icons ${icons}`;

export const LIGHT_ICON_VARIANTS: readonly IconButtonVariant[] = ["elevated", "outline", "ghost", "solid"];

export const ICON_STATES = ["rest", "hover", "focus-visible", "pressed", "disabled", "loading", "toggled", "toggled-hover"] as const;
export const GLASS_STATES = ["rest", "hover", "focus-visible", "pressed", "disabled", "loading", "toggled", "toggled-hover"] as const;

/** Solid is an action, never a toggle, so its toggled cell prints none rather than a copy of rest. */
export function hasIconState(variant: IconButtonVariant, state: string): boolean {
  return !(variant === "solid" && state.startsWith("toggled"));
}

/** Labels: Back to top, Next wave and Next player are the site's own names, Close and Add are filler. */
export const ICON_LABEL: Record<IconButtonVariant, string> = {
  elevated: "Back to top",
  outline: "Next wave",
  ghost: "Close",
  solid: "Add",
  glass: "Next player",
};

export const WAVE_PINS: readonly Pin[] = [
  { selector: "[data-pin=wave] button", name: "Pill", token: "--ds-radius-full", value: "h 40, px 12, white 90%, hairline", source: "HeroBits.tsx:96", expect: "h-10 rounded-full border border-slate-200/80 bg-white/90 px-3", padding: true },
  { selector: "[data-pin=wave] button > svg", name: "Icon", token: "--ds-icon-16", value: "Waves 16, stroke 1.75", source: "HeroBits.tsx:116", expect: '<Waves className="w-4 h-4" strokeWidth={1.75} />' },
];

export const ARROW_PINS: readonly Pin[] = [
  { selector: "[data-pin=arrows] button", index: 0, name: "Circle", token: "--ds-color-on-blue-15", value: "36, white 15%, 25% inset ring, 0.3 when an end disables it", source: "PlayerCarousel.tsx:16", expect: ["grid h-9 w-9 place-items-center rounded-full bg-white/15", "ring-white/25"] },
  { selector: "[data-pin=arrows] button svg", index: 0, name: "Chevron", token: "--ds-icon-18", value: "18, stroke 2", source: "PlayerCarousel.tsx:138", expect: "<ChevronLeft size={18} strokeWidth={2} />" },
];

export const ICON_PINS: readonly Pin[] = [
  { selector: "[data-pin=badge] button", name: "Circle", token: "--ds-radius-full", value: "md 40, ghost", source: "icon-button-styles.ts:25,46", expect: ['md: { box: "h-10 w-10"', "border border-transparent bg-transparent"] },
  { selector: "[data-pin=badge] button > svg", name: "Icon", token: "--ds-icon-18", value: "18, stroke from the ladder", source: "IconButton.tsx:123", expect: "<Icon aria-hidden size={s.icon} strokeWidth={stroke} />" },
  { selector: "[data-pin=badge] button > span", name: "Count badge", token: "--ds-color-primary", value: "18 tall, pinned 4px out", source: "Badge.tsx:56,58", expect: ["h-[18px] min-w-[18px]", "absolute -right-1 -top-1"] },
  { selector: "[data-pin=label] button > span", index: 0, name: "Widening label", token: "--ds-dur-ui", value: "max-w 0 to 80, 12px, over 200ms", source: "icon-button-styles.ts:83,84,90", expect: ["REVEAL_LABEL", "max-w-0 overflow-hidden whitespace-nowrap text-[12px]", "group-hover:max-w-20"], side: "right" },
];

export const WAVE_ROWS: readonly KeyRow[] = [
  { key: "wave hover", value: "Text turns accent and the Next wave label widens in, both over 200ms.", source: "HeroBits.tsx:94" },
  { key: "wave busy", value: "A 16px spinner takes the icon's place. Repeat presses are ignored by the hero.", source: "HeroBits.tsx:114" },
  { key: "wave focus", value: "The browser outline only, and the label does not widen.", source: "HeroBits.tsx:93" },
];

export const ARROW_ROWS: readonly KeyRow[] = [
  { key: "hover and press", value: "None designed. The opacity eases over 200ms when an end disables one.", source: "PlayerCarousel.tsx:16" },
  { key: "focus", value: "The browser outline only.", source: "PlayerCarousel.tsx:136" },
];

export const ICON_VALUES: readonly ValueRow[] = [
  tv("Elevated fill", "color-surface"),
  tv("Elevated shadow", "shadow-float"),
  tv("Elevated hover fill", "color-fill-hover"),
  tv("Elevated hover lift", "lift-y"),
  tv("Outline fill", "color-surface-90"),
  tv("Outline icon", "color-ink-70"),
  tv("Ghost hover fill", "color-fill-open"),
  tv("Solid fill", "color-primary"),
  tv("Solid hover", "color-primary-hover"),
  tv("Glass fill", "color-on-blue-15"),
  tv("Glass ring", "color-on-blue-25"),
  tv("Hairline", "color-line"),
  tv("Colour change", "dur-ui"),
  tv("Lift", "dur-line"),
  tv("Press", "spring-press"),
  sv("Sizes", `${boxes}, icons ${icons}`, "icon-button-styles.ts:23-27"),
  sv("Pressed", "scale 0.94 (SCALE.pressRound)", "IconButton.tsx:100-101"),
  sv("Toggled", "ghost, outline and elevated fill navy, glass turns white", "icon-button-styles.ts:36-37, 49"),
  tv("Toggled hover", "color-primary-hover", "button-styles.ts:59-64"),
  sv("Icon swap", "160ms cross-fade with a quarter turn", "IconButton.tsx:109"),
];

export const ICON_PROPS: readonly PropRow[] = [
  { name: "icon", type: "LucideIcon", note: "required" },
  { name: "label", type: "string", note: "required, the accessible name and the widening label" },
  { name: "size", type: "xs | sm | md | lg | xl", default: "md" },
  { name: "variant", type: "elevated | outline | ghost | glass | solid", default: "ghost" },
  { name: "selected", type: "boolean", note: "a toggle (aria-pressed), leave unset on an action" },
  { name: "toggledIcon", type: "LucideIcon", note: "the icon a toggled button shows" },
  { name: "loading, disabled", type: "boolean", default: "false" },
  { name: "showLabelOnHover", type: "boolean", default: "false" },
  { name: "href, onClick", type: "string, (e) => void" },
  { name: "badge", type: "ReactNode", note: "a pinned count Badge or a StatusDot" },
  FORCE_PROP,
];

export const ICON_CODE = `import { X } from "lucide-react";
import { IconButton } from "@/components/design-system/IconButton";

<IconButton icon={X} label="Close" variant="ghost" onClick={close} />`;

export const SHIPPED_CODE = `import { WaveButton } from "@/components/website/HeroBits";
import { PlayerArrows } from "@/components/website/PlayerCarousel";

<WaveButton full busy={busy} onClick={sendWave} />
<PlayerArrows active={active} onChange={setActive} />`;
