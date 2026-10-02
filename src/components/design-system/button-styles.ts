// The button's class maps, written out in full so Tailwind's scanner sees every class. BUTTON_VARIANT holds
// each variant's rest and selected look, BUTTON_HOVER its pointer feedback, which Button adds only to a live
// control: Tailwind's hover also matches a disabled, aria-disabled or busy element, so a held control never
// answers the pointer. Each hover class has a data-[force=hover] and a data-[force=pressed] twin, so a
// forced cell matches a real hover or press (a real press is a hover too). Selected rides on aria-pressed,
// a real attribute, and fills navy, never the accent. In forced colours a pressed toggle takes Highlight,
// because a fill alone would vanish there.
import type { IconSize } from "./token-shape";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "link"
  | "destructive"
  | "destructivePrimary"
  | "inverse"
  | "glass";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export const BUTTON_BASE =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap font-sans font-medium " +
  "tracking-[-0.01em] transition-[color,background-color,border-color,text-decoration-color] " +
  "ease-(--ds-ease-out) disabled:cursor-not-allowed disabled:opacity-40 " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-busy:cursor-progress";

/** Pill sizes: height, padding, label, gap. The label is Inter 500 as the shipped Try now is. A 16 or 18
 *  icon sits 8 from the label, a 14 icon 6. The spinner is the icon size rounded down to its ladder. */
export const BUTTON_SIZE: Record<ButtonSize, { box: string; icon: IconSize; spinner: 12 | 16 }> = {
  xs: { box: "h-7 gap-1.5 px-3 text-[12px]", icon: 14, spinner: 12 },
  sm: { box: "h-8 gap-2 px-3.5 text-[13px]", icon: 16, spinner: 16 },
  md: { box: "h-10 gap-2 px-5 text-[14px]", icon: 16, spinner: 16 },
  lg: { box: "h-12 gap-2 px-7 text-[15px]", icon: 18, spinner: 16 },
  xl: { box: "h-[52px] min-w-[220px] gap-2 px-10 text-[15px]", icon: 18, spinner: 16 },
};

/** The link variant keeps the label size and gap but drops the box. Offset 3 under 15px, 4 from 15px. */
export const LINK_SIZE: Record<ButtonSize, string> = {
  xs: "gap-1.5 text-[12px] underline-offset-3",
  sm: "gap-2 text-[13px] underline-offset-3",
  md: "gap-2 text-[14px] underline-offset-3",
  lg: "gap-2 text-[15px] underline-offset-4",
  xl: "gap-2 text-[15px] underline-offset-4",
};

/** A pressed toggle in forced colours: Highlight fill and line, HighlightText label. */
export const PRESSED_FORCED =
  "forced-colors:aria-pressed:forced-color-adjust-none forced-colors:aria-pressed:border-[color:Highlight] " +
  "forced-colors:aria-pressed:bg-[color:Highlight] forced-colors:aria-pressed:text-[color:HighlightText]";

const SELECTED_NAVY =
  "aria-pressed:border-(--ds-color-primary) aria-pressed:bg-(--ds-color-primary) aria-pressed:text-white";

/** A selected toggle under the pointer: the navy moves to the primary hover and the label stays white. The
 *  aria-pressed:data-[force=*] twins outrank the plain forced hover, so a forced selected-hover cell shows
 *  the selected hover and never the rest hover's light fill. Shared by Button and IconButton. */
export const SELECTED_HOVER =
  "aria-pressed:hover:border-(--ds-color-primary-hover) aria-pressed:hover:bg-(--ds-color-primary-hover) " +
  "aria-pressed:hover:text-white aria-pressed:data-[force=hover]:border-(--ds-color-primary-hover) " +
  "aria-pressed:data-[force=hover]:bg-(--ds-color-primary-hover) aria-pressed:data-[force=hover]:text-white " +
  "aria-pressed:data-[force=pressed]:border-(--ds-color-primary-hover) " +
  "aria-pressed:data-[force=pressed]:bg-(--ds-color-primary-hover) aria-pressed:data-[force=pressed]:text-white";

export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "rounded-full border border-transparent bg-(--ds-color-primary) text-white duration-(--ds-dur-ui)",
  secondary:
    "rounded-full border border-(--ds-color-line-strong) bg-transparent text-(--ds-color-ink) duration-(--ds-dur-ui) " +
    `${SELECTED_NAVY} ${PRESSED_FORCED}`,
  tertiary:
    "rounded-full border border-(--ds-color-line) bg-(--ds-color-surface) text-(--ds-color-ink) duration-(--ds-dur-ui) " +
    `${SELECTED_NAVY} ${PRESSED_FORCED}`,
  ghost:
    "rounded-full border border-transparent bg-transparent text-(--ds-color-ink) duration-(--ds-dur-ui) " +
    "aria-pressed:bg-(--ds-color-primary) aria-pressed:text-white " +
    PRESSED_FORCED,
  link:
    "rounded-(--ds-radius-mark-xs) border-0 bg-transparent text-(--ds-color-ink) underline decoration-1 " +
    "decoration-(--ds-color-line-strong) duration-(--ds-dur-line)",
  destructive:
    "rounded-full border border-(--ds-color-danger-line) bg-transparent text-(--ds-color-danger-ink) duration-(--ds-dur-ui)",
  destructivePrimary: "rounded-full border border-transparent bg-(--ds-color-danger) text-white duration-(--ds-dur-ui)",
  inverse: "rounded-full border border-transparent bg-(--ds-color-surface) text-(--ds-color-ink) duration-(--ds-dur-ui)",
  // no fill at rest, so the white label sits on the blue itself (4.49:1): a 15% white fill under it drops to 3.57
  glass: "rounded-full border border-(--ds-color-on-blue-40) bg-transparent text-white duration-(--ds-dur-ui)",
};

/** Pointer feedback, live controls only. A selected toggle moves its navy to the primary hover. */
export const BUTTON_HOVER: Record<ButtonVariant, string> = {
  primary:
    "hover:bg-(--ds-color-primary-hover) data-[force=hover]:bg-(--ds-color-primary-hover) " +
    "data-[force=pressed]:bg-(--ds-color-primary-hover)",
  secondary:
    "hover:border-(--ds-color-line-hover) hover:bg-(--ds-color-surface-70) " +
    "data-[force=hover]:border-(--ds-color-line-hover) data-[force=hover]:bg-(--ds-color-surface-70) " +
    "data-[force=pressed]:border-(--ds-color-line-hover) data-[force=pressed]:bg-(--ds-color-surface-70) " +
    SELECTED_HOVER,
  tertiary:
    "hover:border-(--ds-color-line-strong) hover:bg-(--ds-color-fill-hover) " +
    "data-[force=hover]:border-(--ds-color-line-strong) data-[force=hover]:bg-(--ds-color-fill-hover) " +
    "data-[force=pressed]:border-(--ds-color-line-strong) data-[force=pressed]:bg-(--ds-color-fill-hover) " +
    SELECTED_HOVER,
  ghost:
    "hover:text-(--ds-color-accent) data-[force=hover]:text-(--ds-color-accent) " +
    `data-[force=pressed]:text-(--ds-color-accent) ${SELECTED_HOVER}`,
  link:
    "hover:text-(--ds-color-accent) hover:decoration-(--ds-color-accent) " +
    "data-[force=hover]:text-(--ds-color-accent) data-[force=hover]:decoration-(--ds-color-accent)",
  destructive:
    "hover:border-(--ds-color-danger) hover:bg-(--ds-color-danger-tint) " +
    "data-[force=hover]:border-(--ds-color-danger) data-[force=hover]:bg-(--ds-color-danger-tint) " +
    "data-[force=pressed]:border-(--ds-color-danger) data-[force=pressed]:bg-(--ds-color-danger-tint)",
  destructivePrimary:
    "hover:bg-(--ds-color-danger-ink) data-[force=hover]:bg-(--ds-color-danger-ink) " +
    "data-[force=pressed]:bg-(--ds-color-danger-ink)",
  inverse:
    "hover:bg-(--ds-color-surface-90) data-[force=hover]:bg-(--ds-color-surface-90) " +
    "data-[force=pressed]:bg-(--ds-color-surface-90)",
  glass:
    "hover:bg-(--ds-color-on-blue-15) data-[force=hover]:bg-(--ds-color-on-blue-15) " +
    "data-[force=pressed]:bg-(--ds-color-on-blue-15)",
};

/** The xl primary: its hover fill is painted by the sweep, so only the forced cells set it. */
export const PRIMARY_SWEEP =
  "rounded-full border border-transparent bg-(--ds-color-primary) text-white overflow-hidden " +
  "data-[force=hover]:bg-(--ds-color-primary-hover) data-[force=pressed]:bg-(--ds-color-primary-hover)";

/** Variants that sit on the players' accent ground and take the white ring. */
export const ON_BLUE_VARIANTS: readonly ButtonVariant[] = ["inverse", "glass"];

/** Solid fills grow on hover as Try now does. */
export const GROWS: readonly ButtonVariant[] = ["primary", "destructivePrimary"];

/** Variants that show aria-pressed as selected. */
export const SELECTABLE: readonly ButtonVariant[] = ["secondary", "tertiary", "ghost"];
