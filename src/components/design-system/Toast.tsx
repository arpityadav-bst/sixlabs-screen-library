"use client";

// One toast: a navy panel at the terminal window's 16px radius, a status icon in its on-dark colour, a title,
// an optional body, an optional text action in the lifted accent and a close. It holds no timer and no
// position, so the guide shows it in normal flow and the Toaster stacks the same part. Both controls take
// the dark ring (#6ea8ff), because the accent ring would vanish on navy. The Toaster's hotkey lands on the
// first control (the action, else the close), which carries it as aria-keyshortcuts.
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { FOCUS_DARK } from "./focus";
import { forceAttr, type ForceState } from "./force";
import { Spinner } from "./Spinner";
import { ICON_STROKE } from "./token-shape";
import type { ToastAction, ToastTone } from "./toast-store";

const ICON = { success: CircleCheck, error: CircleAlert, info: Info } as const;

const ICON_TONE: Record<Exclude<ToastTone, "loading">, string> = {
  success: "text-(--ds-color-success-on-dark)",
  error: "text-(--ds-color-danger-on-dark)",
  info: "text-(--ds-color-accent-on-dark)",
};

const SURFACE =
  "flex min-h-[52px] w-full flex-col justify-center rounded-(--ds-radius-sm) bg-(--ds-color-primary) px-4 py-3.5 " +
  "text-left font-sans text-white shadow-(--ds-shadow-float)";

// a forced press shows the hover too, as a real press does
const ACTION =
  "-my-0.5 shrink-0 rounded-(--ds-radius-mark-sm) px-0.5 text-[13px] font-medium leading-5 text-(--ds-color-accent-on-dark) " +
  "transition-[color,scale] duration-(--ds-dur-ui) ease-(--ds-ease-out) hover:text-white data-[force=hover]:text-white " +
  "data-[force=pressed]:text-white active:scale-(--ds-scale-press-pill) data-[force=pressed]:scale-(--ds-scale-press-pill) " +
  FOCUS_DARK;

const CLOSE =
  "-my-1 -mr-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-(--ds-color-on-blue-50) " +
  "transition-[color,background-color,scale] duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "hover:bg-(--ds-color-on-blue-15) hover:text-white data-[force=hover]:bg-(--ds-color-on-blue-15) " +
  "data-[force=hover]:text-white data-[force=pressed]:bg-(--ds-color-on-blue-15) data-[force=pressed]:text-white " +
  "active:scale-(--ds-scale-press-round) data-[force=pressed]:scale-(--ds-scale-press-round) " +
  FOCUS_DARK;

export type ToastProps = {
  tone?: ToastTone;
  title: string;
  body?: string;
  action?: ToastAction;
  /** the close button's press. Without it the close still shows, as it does on every toast. */
  onDismiss?: () => void;
  /** the key that focuses this toast's first control, set by the Toaster on the front toast */
  shortcut?: string;
  /** a StateGrid cell's state on the action */
  forceAction?: ForceState;
  /** a StateGrid cell's state on the close */
  forceClose?: ForceState;
  className?: string;
};

export function Toast({
  tone = "info",
  title,
  body,
  action,
  onDismiss,
  shortcut,
  forceAction,
  forceClose,
  className = "",
}: ToastProps) {
  const Icon = tone === "loading" ? null : ICON[tone];
  return (
    <div data-part="surface" data-tone={tone} className={`${SURFACE} ${className}`}>
      <div className="flex items-start gap-3">
        <span
          data-part="icon"
          className={`mt-px grid h-[18px] w-[18px] shrink-0 place-items-center ${Icon ? ICON_TONE[tone as keyof typeof ICON] : ""}`}
        >
          {Icon ? (
            <Icon aria-hidden size={18} strokeWidth={ICON_STROKE[18]} />
          ) : (
            <Spinner size={16} tone="onDark" delay={0} decorative />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p data-part="title" className="text-[14px] font-medium leading-5">
            {title}
          </p>
          {body && (
            <p data-part="body" className="mt-0.5 text-[13px] leading-[18px] text-(--ds-color-on-blue-75)">
              {body}
            </p>
          )}
        </div>
        {action && (
          <button
            type="button"
            data-part="action"
            data-force={forceAttr(forceAction)}
            aria-keyshortcuts={shortcut}
            onClick={action.onClick}
            className={ACTION}
          >
            {action.label}
          </button>
        )}
        <button
          type="button"
          data-part="close"
          aria-label={`Dismiss ${title}`}
          data-force={forceAttr(forceClose)}
          aria-keyshortcuts={action ? undefined : shortcut}
          onClick={onDismiss}
          className={CLOSE}
        >
          <X aria-hidden size={14} strokeWidth={ICON_STROKE[14]} />
        </button>
      </div>
    </div>
  );
}
