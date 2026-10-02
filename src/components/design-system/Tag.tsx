// A descriptive tag: what something is or holds, never an action. The panel is the job card's skills list
// (Jobs.tsx:184), a sunken grey box in two columns that drops to one under md. The pill stands alone on a
// surface and the plain form has no box at all. The icon is a field of the item, so a label with no icon
// shows no icon on purpose, never because a lookup by label missed. A tag that does something is a Chip.
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ICON_STROKE } from "./tokens";

export type TagVariant = "pill" | "plain";
export type TagItem = { label: string; icon?: LucideIcon };

const ICON = "h-4 w-4 shrink-0 text-(--ds-color-accent)";

const VARIANT: Record<TagVariant, string> = {
  plain: "",
  pill: "h-7 rounded-full border border-(--ds-color-line) bg-(--ds-color-surface) px-2.5",
};

export function Tag({
  icon: Icon,
  variant = "plain",
  as = "span",
  className = "",
  children,
}: {
  icon?: LucideIcon;
  variant?: TagVariant;
  /** li inside a TagList */
  as?: "span" | "li";
  className?: string;
  children: ReactNode;
}) {
  const El = as;
  const gap = variant === "pill" ? "gap-2" : "gap-2.5";
  return (
    <El
      className={
        `${as === "li" ? "flex" : "inline-flex"} min-w-0 items-center ${gap} font-sans text-[13px] leading-5 ` +
        `text-(--ds-color-ink) ${VARIANT[variant]} ${className}`
      }
    >
      {Icon && <Icon aria-hidden className={ICON} strokeWidth={ICON_STROKE[16]} />}
      {children}
    </El>
  );
}

export function TagList({
  items,
  columns = 2,
  panel = true,
  label,
  className = "",
}: {
  items: readonly TagItem[];
  /** 2 drops to 1 under md, so a narrow card never squeezes two columns */
  columns?: 1 | 2;
  /** the sunken panel, or a bare list */
  panel?: boolean;
  /** an accessible name for the list, when the heading above does not give one */
  label?: string;
  className?: string;
}) {
  const grid = columns === 2 ? "grid-cols-2 max-md:grid-cols-1" : "grid-cols-1";
  const box = panel
    ? "rounded-(--ds-radius-xs) border border-(--ds-color-line) bg-(--ds-color-surface-sunken) px-4 py-3.5"
    : "";
  return (
    <ul aria-label={label} className={`grid gap-x-4 gap-y-3 ${grid} ${box} ${className}`}>
      {items.map((t) => (
        <Tag key={t.label} as="li" icon={t.icon}>
          {t.label}
        </Tag>
      ))}
    </ul>
  );
}
