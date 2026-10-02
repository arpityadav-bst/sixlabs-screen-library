// The banner's class maps, kept beside Banner.tsx so the scanner reads every class. One size: a 16px icon,
// 14px copy and a small secondary action in a white row at the panel radius. Status tones tint the row
// and its line, the quiet tones stay white, so a banner is never an accent fill.
import { CircleAlert, CircleCheck, Info, TriangleAlert, WifiOff, type LucideIcon } from "lucide-react";

export type BannerTone = "info" | "offline" | "warning" | "danger" | "success";

export const BANNER_ROOT =
  "flex w-full min-w-0 items-center gap-3 rounded-(--ds-radius-sm) border px-4 py-3 font-sans text-[14px] leading-5 " +
  "max-[480px]:flex-wrap";

export const BANNER_TONE: Record<BannerTone, string> = {
  info: "border-(--ds-color-line) bg-(--ds-color-surface)",
  offline: "border-(--ds-color-line) bg-(--ds-color-surface)",
  success: "border-(--ds-color-line) bg-(--ds-color-surface)",
  warning: "border-(--ds-color-line) bg-(--ds-color-warning-tint)",
  danger: "border-(--ds-color-danger-line) bg-(--ds-color-danger-tint)",
};

/** The icon's colour: the accent is allowed on an icon, the status colours on their own tones. */
export const BANNER_ICON_TONE: Record<BannerTone, string> = {
  info: "text-(--ds-color-accent)",
  offline: "text-(--ds-color-text-muted)",
  success: "text-(--ds-color-success)",
  warning: "text-(--ds-color-warning)",
  danger: "text-(--ds-color-danger-ink)",
};

export const BANNER_ICON: Record<BannerTone, LucideIcon> = {
  info: Info,
  offline: WifiOff,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

export const BANNER_TEXT = "min-w-0 flex-1 text-(--ds-color-ink) max-[480px]:basis-[calc(100%-28px)]";
export const BANNER_TITLE = "font-medium";
export const BANNER_BODY = "text-(--ds-color-text-body)";
/** under 480 the actions wrap below the copy, lined up with it past the icon */
export const BANNER_ACTIONS = "flex shrink-0 items-center gap-1 max-[480px]:ml-7";
