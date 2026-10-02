// Tabs' class maps, written out in full for Tailwind's scanner. Hover and press carry data-[force=*] twins.
// Selected rides on aria-selected, a real attribute, so it needs no twin. In forced colours the hairline is
// a real border and the indicator fills Highlight, since a shadow or a fill alone would vanish there.
import type { IconSize } from "./token-shape";

export type TabsSize = "sm" | "md" | "lg";

/** Height, label and gap. Each tab carries 4px each side for its inset ring, so the gaps here are the
 * label-to-label 20 / 28 / 32 less those 8px. lg sets the label in Outfit, as the site's titles are. */
export const TAB_SIZE: Record<TabsSize, { tab: string; gap: string; icon: IconSize }> = {
  sm: { tab: "h-9 text-[13px] font-sans", gap: "gap-3", icon: 14 },
  md: { tab: "h-11 text-[15px] font-sans", gap: "gap-5", icon: 16 },
  lg: { tab: "h-13 text-[18px] font-(family-name:--ds-font-display) tracking-[-0.01em]", gap: "gap-6", icon: 18 },
};

/** The list: one row that scrolls sideways on its own, its hairline drawn inside so the indicator covers it. */
export const TAB_LIST =
  "relative flex overflow-x-auto overflow-y-hidden overscroll-x-contain shadow-[inset_0_-1px_0_var(--ds-color-line)] " +
  "forced-colors:border-b forced-colors:border-[color:CanvasText] " +
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export const TAB =
  "group relative inline-flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap rounded-(--ds-radius-mark) px-1 " +
  "text-(--ds-color-text-muted) transition-colors duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "enabled:hover:text-(--ds-color-ink) data-[force=hover]:text-(--ds-color-ink) " +
  "data-[force=pressed]:text-(--ds-color-ink) aria-selected:text-(--ds-color-ink) " +
  "disabled:cursor-not-allowed disabled:text-(--ds-color-text-quiet)";

/** The label settles to scale-press-pill (SCALE.pressPill, 0.97) under a press, the indicator does not. */
export const TAB_LABEL =
  "inline-flex items-center gap-1.5 transition-[scale] duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "group-enabled:group-active:scale-(--ds-scale-press-pill) group-data-[force=pressed]:scale-(--ds-scale-press-pill)";

/** The 2px navy indicator, as wide as the label, over the list's hairline. */
export const TAB_INDICATOR =
  "absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-(--ds-color-primary) " +
  "forced-colors:forced-color-adjust-none forced-colors:bg-[color:Highlight]";
