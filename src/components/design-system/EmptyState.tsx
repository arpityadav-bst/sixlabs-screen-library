// What a view shows when it has nothing yet, finds nothing or fails: an icon, a title that names the state,
// a body with the reason or the way on, and one action that moves the visitor forward. Contained, it takes
// the hero container look (the grey, radius 36, the faint hairline) and stands at page level. Uncontained,
// it sits inside a card that already draws the edge. It sizes from its own width (a container query), not
// the window's, because the same part sits in a page column and in a narrow card: under 560 the padding
// drops to 32, under 400 the actions stack. The body is #475569, since #64748b reads 3.77:1 on the grey.
import { CircleAlert, Inbox, Lock, SearchX, WifiOff, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SixLabsLogo } from "@/components/website/brand-marks";
import styles from "./empty-state.module.css";
import { ICON_STROKE } from "./token-shape";

export type EmptyStateVariant = "firstUse" | "noResults" | "error" | "offline" | "noAccess";

const ICON: Record<EmptyStateVariant, LucideIcon> = {
  firstUse: Inbox,
  noResults: SearchX,
  error: CircleAlert,
  offline: WifiOff,
  noAccess: Lock,
};

const CONTAINED =
  "rounded-(--ds-radius-xl) border border-(--ds-color-line-faint) bg-(--ds-color-container) p-12 @max-[560px]:p-8";
const OPEN = "px-6 py-10 @max-[560px]:px-4 @max-[560px]:py-8";

const BOX =
  "grid h-12 w-12 shrink-0 place-items-center rounded-full border border-(--ds-color-line) bg-(--ds-color-surface)";

const ACTIONS =
  "mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 " +
  "@max-[400px]:flex-col @max-[400px]:items-stretch @max-[400px]:self-stretch";

export type EmptyStateProps = {
  variant?: EmptyStateVariant;
  /** another icon than the variant's own */
  icon?: LucideIcon;
  /** the 44px brand mark in place of the boxed icon, for brand moments */
  mark?: boolean;
  title: string;
  body?: ReactNode;
  /** a primary md Button, the one way forward */
  primaryAction?: ReactNode;
  /** a TextLink or a secondary Button */
  secondaryAction?: ReactNode;
  /** the container look at page level (true), or bare inside a card */
  contained?: boolean;
  /** the title's heading level, one under the view's own heading */
  headingLevel?: 2 | 3 | 4;
  /** role alert, only when it replaces content after the visitor's own action */
  announce?: boolean;
  className?: string;
};

export function EmptyState({
  variant = "firstUse",
  icon,
  mark = false,
  title,
  body,
  primaryAction,
  secondaryAction,
  contained = true,
  headingLevel = 3,
  announce = false,
  className = "",
}: EmptyStateProps) {
  const Icon = icon ?? ICON[variant];
  const Title = `h${headingLevel}` as "h2" | "h3" | "h4";
  const tint = variant === "error" ? "text-(--ds-color-danger-ink)" : "text-(--ds-color-ink)";
  return (
    <div
      data-part="root"
      data-variant={variant}
      role={announce ? "alert" : undefined}
      className={`@container w-full ${className}`}
    >
      <div data-part="container" className={`${contained ? CONTAINED : OPEN} ${styles["ds-rise"]}`}>
        <div className="mx-auto flex max-w-[400px] flex-col items-center text-center">
          {mark ? (
            <SixLabsLogo className="h-11 w-11" />
          ) : (
            <span data-part="icon" className={`${BOX} ${tint}`}>
              <Icon aria-hidden size={24} strokeWidth={ICON_STROKE[24]} />
            </span>
          )}
          <Title
            data-part="title"
            className="mt-4 font-display text-[20px] font-medium leading-tight tracking-[-0.03em] text-(--ds-color-ink)"
          >
            {title}
          </Title>
          {body && (
            <p data-part="body" className="mt-2 text-pretty font-sans text-[14px] leading-normal text-(--ds-color-text-body)">
              {body}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div data-part="actions" className={ACTIONS}>
              {primaryAction}
              {secondaryAction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
