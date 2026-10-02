"use client";

// A page-level notice that stays until the condition ends: offline, a stale view, a failed load. It sits in
// the flow above what it is about, never over it, so nothing it covers is lost. One row: an icon in its
// tone's colour, a medium title and a body in the body slate, then an optional secondary action (Retry,
// busy while it runs) and an optional close. Danger is an alert, the rest are polite status. The page
// keeps working under it, which is why it is not a dialog, and it does not time out, which is why it is
// not a toast.
import { X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import type { ForceState } from "./force";
import {
  BANNER_ACTIONS,
  BANNER_BODY,
  BANNER_ICON,
  BANNER_ICON_TONE,
  BANNER_ROOT,
  BANNER_TEXT,
  BANNER_TITLE,
  BANNER_TONE,
  type BannerTone,
} from "./banner-styles";

export type { BannerTone } from "./banner-styles";

export type BannerAction = { label: string; onClick?: () => void; loading?: boolean };

export type BannerProps = {
  tone?: BannerTone;
  title: string;
  body?: ReactNode;
  /** replaces the tone's icon */
  icon?: LucideIcon;
  /** a secondary sm Button, busy while `loading` */
  action?: BannerAction;
  /** shows the close button. A banner without one stays until its condition ends */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** a StateGrid cell's state on the action */
  forceAction?: ForceState;
  /** a StateGrid cell's state on the close */
  forceClose?: ForceState;
  className?: string;
};

export function Banner({
  tone = "info",
  title,
  body,
  icon,
  action,
  dismissible = false,
  onDismiss,
  forceAction,
  forceClose,
  className = "",
}: BannerProps) {
  const glyph = icon ?? BANNER_ICON[tone];
  const urgent = tone === "danger";
  return (
    <div
      role={urgent ? "alert" : "status"}
      data-tone={tone}
      className={`${BANNER_ROOT} ${BANNER_TONE[tone]} ${className}`}
    >
      <span className={`shrink-0 ${BANNER_ICON_TONE[tone]}`}>
        <Icon icon={glyph} size={16} />
      </span>
      <p className={BANNER_TEXT}>
        <span className={BANNER_TITLE}>{title}</span>
        {body && <span className={BANNER_BODY}> {body}</span>}
      </p>
      {(action || dismissible) && (
        <div className={BANNER_ACTIONS}>
          {action && (
            <Button variant="secondary" size="sm" loading={action.loading} onClick={action.onClick} forceState={forceAction}>
              {action.label}
            </Button>
          )}
          {dismissible && (
            <IconButton icon={X} label="Dismiss" size="sm" variant="ghost" onClick={onDismiss} forceState={forceClose} />
          )}
        </div>
      )}
    </div>
  );
}
