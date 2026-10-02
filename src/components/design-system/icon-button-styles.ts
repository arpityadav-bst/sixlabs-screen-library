// IconButton's class maps, written out in full for Tailwind's scanner. ICON_BUTTON_VARIANT holds rest and
// toggled, ICON_BUTTON_HOVER the pointer feedback IconButton adds only to a live control, since Tailwind's
// hover also matches a disabled or busy one. Hover classes carry data-[force=hover] and data-[force=pressed]
// twins, and so does a toggled button's hover. Toggled rides on aria-pressed: ghost, outline and elevated
// fill navy, glass turns white with a navy icon. Solid is a pure action with no toggled state, since its
// inverse would be a white fill on a light ground where selected is navy. In forced colours a toggled
// button takes Highlight, because a fill alone would vanish there.
import { PRESSED_FORCED, SELECTED_HOVER } from "./button-styles";
import type { IconSize } from "./token-shape";

export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconButtonVariant = "elevated" | "outline" | "ghost" | "glass" | "solid";

/** Variants that show aria-pressed as toggled. Solid is an action only. */
export const ICON_TOGGLES: readonly IconButtonVariant[] = ["elevated", "outline", "ghost", "glass"];

/** 28 / 32 / 40 / 44 / 48, icons 14 / 16 / 18 / 18 / 20. The spinner is the icon size rounded down to its
 *  ladder. px is the height, from which the widening form's side padding is derived (revealPad). */
export const ICON_BUTTON_SIZE: Record<
  IconButtonSize,
  { box: string; h: string; px: number; icon: IconSize; spinner: 12 | 16 | 20 }
> = {
  xs: { box: "h-7 w-7", h: "h-7", px: 28, icon: 14, spinner: 12 },
  sm: { box: "h-8 w-8", h: "h-8", px: 32, icon: 16, spinner: 16 },
  md: { box: "h-10 w-10", h: "h-10", px: 40, icon: 18, spinner: 16 },
  lg: { box: "h-11 w-11", h: "h-11", px: 44, icon: 18, spinner: 16 },
  xl: { box: "h-12 w-12", h: "h-12", px: 48, icon: 20, spinner: 20 },
};

/** The widening form's side padding: half of the height less the icon, so at rest it is still a circle. */
export function revealPad(size: IconButtonSize): number {
  const s = ICON_BUTTON_SIZE[size];
  return (s.px - s.icon) / 2;
}

const TOGGLE_NAVY =
  "aria-pressed:border-(--ds-color-primary) aria-pressed:bg-(--ds-color-primary) aria-pressed:text-white";

export const ICON_BUTTON_VARIANT: Record<IconButtonVariant, string> = {
  elevated:
    "border border-(--ds-color-line) bg-(--ds-color-surface) text-(--ds-color-ink) shadow-(--ds-shadow-float) " +
    `duration-(--ds-dur-line) ${TOGGLE_NAVY} ${PRESSED_FORCED}`,
  outline:
    "border border-(--ds-color-line) bg-(--ds-color-surface-90) text-(--ds-color-ink-70) duration-(--ds-dur-ui) " +
    `${TOGGLE_NAVY} ${PRESSED_FORCED}`,
  ghost: `border border-transparent bg-transparent text-(--ds-color-ink) duration-(--ds-dur-ui) ${TOGGLE_NAVY} ${PRESSED_FORCED}`,
  glass:
    "border border-(--ds-color-on-blue-25) bg-(--ds-color-on-blue-15) text-white duration-(--ds-dur-ui) " +
    "aria-pressed:border-transparent aria-pressed:bg-(--ds-color-surface) aria-pressed:text-(--ds-color-ink) " +
    PRESSED_FORCED,
  solid: "border border-transparent bg-(--ds-color-primary) text-white duration-(--ds-dur-ui)",
};

/** Pointer feedback, live controls only. A toggled button keeps its toggled colours and takes a quieter
 *  step of them on hover: the navy ones the shared SELECTED_HOVER, glass a 90% white. */
export const ICON_BUTTON_HOVER: Record<IconButtonVariant, string> = {
  elevated:
    "hover:-translate-y-0.5 hover:bg-(--ds-color-fill-hover) data-[force=hover]:-translate-y-0.5 " +
    "data-[force=hover]:bg-(--ds-color-fill-hover) data-[force=pressed]:-translate-y-0.5 " +
    `data-[force=pressed]:bg-(--ds-color-fill-hover) ${SELECTED_HOVER}`,
  outline:
    "hover:text-(--ds-color-accent) data-[force=hover]:text-(--ds-color-accent) " +
    `data-[force=pressed]:text-(--ds-color-accent) ${SELECTED_HOVER}`,
  ghost:
    "hover:bg-(--ds-color-fill-open) data-[force=hover]:bg-(--ds-color-fill-open) " +
    `data-[force=pressed]:bg-(--ds-color-fill-open) ${SELECTED_HOVER}`,
  glass:
    "hover:bg-(--ds-color-on-blue-25) data-[force=hover]:bg-(--ds-color-on-blue-25) " +
    "data-[force=pressed]:bg-(--ds-color-on-blue-25) aria-pressed:hover:bg-(--ds-color-surface-90) " +
    "aria-pressed:data-[force=hover]:bg-(--ds-color-surface-90) aria-pressed:data-[force=pressed]:bg-(--ds-color-surface-90)",
  solid:
    "hover:bg-(--ds-color-primary-hover) data-[force=hover]:bg-(--ds-color-primary-hover) " +
    "data-[force=pressed]:bg-(--ds-color-primary-hover)",
};

export const ICON_BUTTON_BASE =
  "group relative inline-flex shrink-0 select-none items-center justify-center rounded-full " +
  "transition-[translate,color,background-color,border-color] ease-(--ds-ease-out) " +
  "disabled:cursor-not-allowed disabled:opacity-40 aria-busy:cursor-progress";

/** The widening label (the wave button's pattern): 0 to 80px on keyboard focus over 200ms, and on hover
 *  through REVEAL_HOVER, which IconButton adds only to a live control, as it does the other hover feedback. */
export const REVEAL_LABEL =
  "max-w-0 overflow-hidden whitespace-nowrap text-[12px] leading-none opacity-0 " +
  "transition-[max-width,opacity,margin] duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "group-focus-visible:mr-1.5 group-focus-visible:max-w-20 group-focus-visible:opacity-100 " +
  "group-data-[force=focus]:mr-1.5 group-data-[force=focus]:max-w-20 group-data-[force=focus]:opacity-100";

export const REVEAL_HOVER =
  "group-hover:mr-1.5 group-hover:max-w-20 group-hover:opacity-100 " +
  "group-data-[force=hover]:mr-1.5 group-data-[force=hover]:max-w-20 group-data-[force=hover]:opacity-100";
