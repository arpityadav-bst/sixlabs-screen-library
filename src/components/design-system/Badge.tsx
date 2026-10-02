// A non-interactive label: a status, a live state or a count. The label is set in JetBrains Mono caps, as
// the player cards' meta line is. Status tones sit on 8% tints of their colour, so they stay quiet beside
// the navy and the accent. A clickable label is a Chip, never a Badge.
import type { ReactNode } from "react";
import { StatusDot } from "./StatusDot";

export type BadgeTone = "neutral" | "live" | "success" | "warning" | "danger" | "inverse" | "onBlue";

const TONE: Record<BadgeTone, string> = {
  neutral: "border-transparent bg-(--ds-color-fill-highlight) text-(--ds-color-text-body)",
  live: "border-(--ds-color-line) bg-(--ds-color-surface) text-(--ds-color-ink)",
  success: "border-transparent bg-(--ds-color-success-tint) text-(--ds-color-success)",
  warning: "border-transparent bg-(--ds-color-warning-tint) text-(--ds-color-warning)",
  danger: "border-transparent bg-(--ds-color-danger-tint) text-(--ds-color-danger-ink)",
  inverse: "border-transparent bg-(--ds-color-primary) text-white",
  onBlue: "border-(--ds-color-on-blue-25) bg-(--ds-color-on-blue-15) text-white",
};

const SIZE = {
  sm: "h-[18px] gap-1.5 px-1.5 text-[11px] tracking-[0.08em]",
  md: "h-[22px] gap-1.5 px-2 text-[11px] tracking-[0.12em]",
} as const;

export type BadgeProps = {
  tone?: BadgeTone;
  size?: keyof typeof SIZE;
  /** a leading dot in the badge's colour (live shows the accent dot) */
  dot?: boolean;
  /** the live dot pulses, on by default for live */
  pulse?: boolean;
  /** the count form: a navy numeral pill, 99+ past 99 */
  count?: number;
  /** pins the count form to the top-right of a relative parent, 4px out */
  pinned?: boolean;
  /** an accessible name for a count ("3 new"), which a bare number lacks */
  label?: string;
  children?: ReactNode;
  className?: string;
};

export function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  pulse,
  count,
  pinned = false,
  label,
  children,
  className = "",
}: BadgeProps) {
  if (count !== undefined) {
    return (
      <span
        className={
          "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 " +
          "bg-(--ds-color-primary) font-sans text-[11px] font-semibold leading-none text-white tabular-nums " +
          (pinned ? "absolute -right-1 -top-1 " : "") +
          className
        }
      >
        <span aria-hidden={label ? true : undefined}>{count > 99 ? "99+" : count}</span>
        {label && <span className="sr-only">{label}</span>}
      </span>
    );
  }
  const showDot = dot || tone === "live";
  return (
    <span
      className={
        "inline-flex items-center whitespace-nowrap rounded-full border font-(family-name:--ds-font-mono) " +
        "font-medium uppercase leading-none " +
        `${SIZE[size]} ${TONE[tone]} ${className}`
      }
    >
      {showDot &&
        (tone === "live" ? (
          <StatusDot size={6} tone="live" motion={(pulse ?? true) ? "pulse" : "none"} />
        ) : (
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
        ))}
      {children}
    </span>
  );
}
