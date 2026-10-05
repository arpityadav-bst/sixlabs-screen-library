// The Button section's data: anatomy pins, drawer rows, the shipped Try now's per-state values and the
// snippets. Values come from tokens.ts through tv wherever a token holds them.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { BUTTON_SIZE, BUTTON_VARIANT, SELECTABLE, type ButtonSize, type ButtonVariant } from "@/components/design-system/button-styles";
import { FORCE_PROP } from "./act-sel-rows";
import { heightOf, sizeNames, sv, tv, type Pin } from "./display-values";

/** The rungs, read from BUTTON_SIZE's own box classes, so the ladder cannot drift from the part. */
export const BUTTON_SIZES: readonly { name: ButtonSize; height: number }[] = sizeNames(BUTTON_SIZE).map((name) => ({
  name,
  height: heightOf(BUTTON_SIZE[name].box),
}));

/** The light-ground variants in the order a view reaches for them. */
export const LIGHT_VARIANTS: readonly ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "ghost",
  "link",
  "destructive",
  "destructivePrimary",
];
export const BLUE_VARIANTS: readonly ButtonVariant[] = ["inverse", "glass"];

/** Specimen labels: Try now and Sign in are the site's own, the rest is filler. */
export const VARIANT_LABEL: Record<ButtonVariant, string> = {
  primary: "Try now",
  secondary: "Sign in",
  tertiary: "Continue",
  ghost: "Cancel",
  link: "Read more",
  destructive: "Delete",
  destructivePrimary: "Delete",
  inverse: "Try now",
  glass: "Sign in",
};

export const BUTTON_STATES = [
  "rest",
  "hover",
  "focus-visible",
  "pressed",
  "disabled",
  "loading",
  "selected",
  "selected-hover",
] as const;
export const BLUE_STATES = ["rest", "hover", "focus-visible", "pressed", "disabled", "loading"] as const;

/** Which state a variant does not have, shown as an empty cell. Selected follows the part's own list. */
export function hasState(variant: ButtonVariant, state: string): boolean {
  if (state === "selected" || state === "selected-hover") return SELECTABLE.includes(variant);
  if (variant === "link") return state !== "pressed" && state !== "loading";
  return true;
}

/** The token the ghost variant's selected fill reads, from its class string, or none once it loses selected. */
const GHOST_SELECTED = SELECTABLE.includes("ghost")
  ? /aria-pressed:bg-\(--ds-([\w-]+)\)/.exec(BUTTON_VARIANT.ghost)?.[1]
  : undefined;

export const CTA_PINS: readonly Pin[] = [
  { selector: "[data-pin=cta] button", name: "Pill", token: "--ds-radius-full", value: "px 40, py 14, min-w 220, about 50.5 tall", source: "PrimaryCta.tsx:100", expect: "min-w-[220px] overflow-hidden rounded-full px-10 py-3.5", padding: true },
  { selector: "[data-pin=cta] button > svg", name: "Shifted fill", value: "covers the pill, #0c1e42 over what the band has crossed", source: "PrimaryCta.tsx:102,108", expect: ["<svg", "fill={NAVY_SHIFT}"] },
  { selector: "[data-pin=cta] button > canvas", name: "Dot band", value: "the CtaDots canvas, a 34px band of dots crossing the pill", source: "PrimaryCta.tsx:111", expect: "<CtaDots t={t} opacity={opacity} size={size} band={DOT_BAND} />" },
  { selector: "[data-pin=cta] button > span", name: "Label", token: "--ds-type-cta", value: "Inter 15 / 500 · white", source: "PrimaryCta.tsx:100,148", expect: ["text-[15px] font-medium text-white", '<span className="relative">{children}</span>'] },
];

export const CTA_STATE_ROWS: readonly KeyRow[] = [
  { key: "rest", value: "Navy #0a152d at scale 1, the band idle.", source: "PrimaryCta.tsx:98" },
  { key: "hover", value: "Grows to 1.04 on spring 400 / 25. The band crosses in 1s on [0.45, 0, 0.25, 1] and the navy behind it shifts to #0c1e42.", source: "PrimaryCta.tsx:85" },
  { key: "hover end", value: "The shifted fill fades over 0.3s. The band never runs back.", source: "PrimaryCta.tsx:87" },
  { key: "pressed", value: "Settles to 0.97 on the same spring.", source: "PrimaryCta.tsx:97" },
  { key: "focus-visible", value: "The browser outline only, with no sweep and no grow.", source: "PrimaryCta.tsx:90" },
  { key: "reduced motion", value: "No band. The fill shifts at once and the grow stays.", source: "PrimaryCta.tsx:83" },
];

export const CTA_VALUES: readonly ValueRow[] = [
  sv("Fill", "#0a152d (NAVY)", "PrimaryCta.tsx:20", undefined, 'const NAVY = "#0a152d";'),
  sv("Shift fill", "#0c1e42 (NAVY_SHIFT)", "PrimaryCta.tsx:21", undefined, 'const NAVY_SHIFT = "#0c1e42";'),
  sv("Sweep", "1s (SWEEP_S) on [0.45, 0, 0.25, 1]", "PrimaryCta.tsx:85", undefined, "const SWEEP_S = 1;", "ease: [0.45, 0, 0.25, 1]"),
  sv("Band", "34px (DOT_BAND), opacity 0 to 0.75 by 12%, held to 88%", "PrimaryCta.tsx:69", undefined, "const DOT_BAND = 34;", "[-1, 0, 0.12, 0.88, 1]", "[0, 0, 0.75, 0.75, 0]"),
  sv("Grow and press", "1.04 and 0.97 on spring 400 / 25", "PrimaryCta.tsx:96", undefined, "whileHover={{ scale: 1.04 }}", "whileTap={{ scale: 0.97 }}", 'type: "spring", stiffness: 400, damping: 25'),
  sv("Box", "px-10 py-3.5 · min-w-[220px] · text-[15px] font-medium", "PrimaryCta.tsx:100", undefined, "min-w-[220px] overflow-hidden rounded-full px-10 py-3.5 text-[15px] font-medium"),
];

export const CTA_CODE = `import { PrimaryCta } from "@/components/website/PrimaryCta";

<PrimaryCta>Try now</PrimaryCta>`;

export const SWEEP_FRAMES = [0.2, 0.5, 0.8] as const;

export const SWEEP_VALUES: readonly ValueRow[] = [
  tv("Run", "dur-sweep"),
  tv("Ease", "ease-sweep"),
  tv("Dots", "color-holo-dot"),
  sv("Band width", "34px, SWEEP_BAND in the system copy", "ButtonSweep.tsx:24"),
  sv("Band opacity", "0 at the start, 0.75 from 12% to 88%, 0 at the end", "PrimaryCta.tsx:69", undefined, "[-1, 0, 0.12, 0.88, 1]", "[0, 0, 0.75, 0.75, 0]"),
  sv("Grid", "3.5px pitch · r 0.95 · 5px soft sides", "CtaDots.tsx:14", undefined, "PITCH = 3.5", "R = 0.95", "BLUR = 5"),
];

export const SWEEP_CODE = `import { CtaDots } from "@/components/website/CtaDots";

const t = useMotionValue(0.5); // sweep progress, -1 idle
const opacity = useMotionValue(0.75);
<CtaDots t={t} opacity={opacity} size={{ w: 220, h: 52 }} band={34} />`;

const BS = "button-styles.ts";

export const BUTTON_PINS: readonly Pin[] = [
  { selector: "[data-pin=btn] button", name: "Pill", token: "--ds-radius-full", value: "1px border, lg 48 tall, px 28", source: `${BS}:35`, expect: "h-12 gap-2 px-7", padding: true },
  { selector: "[data-pin=btn] button > span > svg", index: 0, name: "Leading icon", token: "--ds-icon-18", value: "18, stroke from the icon ladder", source: "Button.tsx:128", expect: "<Leading aria-hidden size={icon} strokeWidth={stroke}" },
  { selector: "[data-pin=btn] button > span > span", name: "Label", token: "--ds-type-button-label", value: "Inter 15 / 500 at lg, -0.01em", source: `${BS}:24-25,35, Button.tsx:129`, expect: ["font-sans font-medium", "tracking-[-0.01em]", "text-[15px]", "<span>{children}</span>"] },
  { selector: "[data-pin=btn] button > span > svg", index: 1, name: "Trailing icon", token: "--ds-icon-18", value: "gap 8", source: "Button.tsx:130", expect: "<Trailing aria-hidden size={icon} strokeWidth={stroke}" },
];

export const SWEPT_PINS: readonly Pin[] = [
  { selector: "[data-pin=xl] button", name: "Pill", token: "--ds-radius-full", value: "xl, 52 tall, min-w 220, px 40", source: `${BS}:36`, expect: "h-[52px] min-w-[220px] gap-2 px-10", padding: true },
  { selector: "[data-pin=xl] button > svg", name: "Shifted fill", token: "--ds-color-primary-hover", value: "covers the pill, the hover navy over what the band has crossed", source: "ButtonSweep.tsx:60", expect: "<svg" },
  { selector: "[data-pin=xl] button > canvas", name: "Dot band", value: "the site's CtaDots canvas, its band at 34", source: "ButtonSweep.tsx:68", expect: "<CtaDots t={t} opacity={opacity} size={size} band={SWEEP_BAND} />" },
  { selector: "[data-pin=xl] button > span > span", name: "Label", token: "--ds-type-button-label", value: "Inter 15 / 500, white", source: "Button.tsx:129", expect: "<span>{children}</span>" },
];

export const BUTTON_VALUES: readonly ValueRow[] = [
  tv("Primary fill", "color-primary"),
  tv("Primary hover", "color-primary-hover"),
  tv("Secondary border", "color-line-strong"),
  tv("Secondary hover border", "color-line-hover"),
  tv("Secondary hover fill", "color-surface-70"),
  ...(GHOST_SELECTED ? [tv("Ghost selected fill", GHOST_SELECTED, `${BS}:76`)] : []),
  tv("Selected hover", "color-primary-hover", `${BS}:59-64`),
  tv("Destructive text", "color-danger-ink"),
  tv("Destructive border", "color-danger-line"),
  tv("Destructive hover", "color-danger-tint"),
  tv("Destructive primary fill", "color-danger"),
  tv("Glass line on blue", "color-on-blue-40", `${BS}:86`),
  tv("Glass hover fill", "color-on-blue-15", `${BS}:121`),
  tv("Colour change", "dur-ui"),
  tv("Link colour change", "dur-line"),
  tv("Grow and press", "spring-press"),
  tv("Ring on light", "focus-color"),
  tv("Ring on blue", "focus-color-inverse"),
  sv("Heights", BUTTON_SIZES.map((s) => s.height).join(" / "), `${BS}:31-37`),
  sv("Side padding", "12 / 14 / 20 / 28 / 40", `${BS}:31-37`),
  sv("Label", "12 / 13 / 14 / 15 / 15 at 500, -0.01em", `${BS}:24-25, 31-37`, "--ds-type-button-label"),
  sv("Grow", "1.04 at lg and xl, 1.02 below, solid fills only", "Button.tsx:87"),
  sv("Press", "0.97 at every size (SCALE.pressPill), none on the link", "Button.tsx:88"),
  sv("Disabled", "opacity 0.4, not-allowed", `${BS}:26`),
];

export const BUTTON_PROPS: readonly PropRow[] = [
  { name: "variant", type: "primary | secondary | tertiary | ghost | link | destructive | destructivePrimary | inverse | glass", default: "primary" },
  { name: "size", type: "xs | sm | md | lg | xl", default: "md" },
  { name: "leadingIcon, trailingIcon", type: "LucideIcon", note: "sized from the icon ladder" },
  { name: "loading", type: "boolean", default: "false", note: "aria-busy, centred spinner, clicks ignored" },
  { name: "selected", type: "boolean", note: "a toggle (aria-pressed) on secondary, tertiary and ghost" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "fullWidth", type: "boolean", default: "false" },
  { name: "href", type: "string", note: "an anchor, a Next Link for paths from /" },
  { name: "onClick", type: "(e) => void" },
  { name: "type", type: "button | submit | reset", default: "button" },
  FORCE_PROP,
];

export const BUTTON_CODE = `import { Button } from "@/components/design-system/Button";

<Button variant="primary" size="md" onClick={send}>Try now</Button>`;

export const GROUP_VALUES: readonly ValueRow[] = [
  tv("Gap", "space-3"),
  sv("Order", "reading order, the primary last and on the right", "ButtonGroup.tsx:13"),
  sv("Under 400px", "a full-width column, reversed so the primary is on top", "ButtonGroup.tsx:21-22"),
];

export const GROUP_PINS: readonly Pin[] = [
  { selector: "[data-pin=group] [role=group]", name: "Row", token: "--ds-space-3", value: "gap 12, wraps", source: "ButtonGroup.tsx:21", expect: "flex flex-wrap items-center gap-3" },
  { selector: "[data-pin=group] [role=group] > :first-child", name: "Least action", value: "ghost, first in reading order", source: "ButtonGroup.tsx:13", expect: "buttons in reading order" },
  { selector: "[data-pin=group] [role=group] > :last-child", name: "Primary", value: "primary, last on the right", source: "ButtonGroup.tsx:13", expect: "the primary last", side: "right" },
];

export const GROUP_CODE = `import { ButtonGroup } from "@/components/design-system/ButtonGroup";

<ButtonGroup>
  <Button variant="ghost">Cancel</Button>
  <Button>Try now</Button>
</ButtonGroup>`;
