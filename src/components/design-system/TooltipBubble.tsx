"use client";

// The tooltip's bubble: navy with white Inter 12/16 (white with ink on the dark terminal), 6 by 8 padding,
// radius 8, at most 240 wide, the tooltip shadow, an optional mono shortcut and an optional 8 by 4 arrow.
// All four arrows are drawn and the bubble's data-side shows the one that points at the trigger, so a live
// bubble that flips near an edge turns its arrow without a render.
import { motion, type HTMLMotionProps } from "motion/react";
import type { TooltipSide } from "./tooltip-place";

export type TooltipTone = "default" | "inverse";

const TONE: Record<TooltipTone, string> = {
  default: "bg-(--ds-color-primary) text-white",
  inverse: "bg-(--ds-color-surface) text-(--ds-color-ink)",
};

const KBD: Record<TooltipTone, string> = {
  default: "text-(--ds-color-on-blue-50)",
  inverse: "text-(--ds-color-text-muted)",
};

const FILL: Record<TooltipTone, string> = {
  default: "text-(--ds-color-primary)",
  inverse: "text-(--ds-color-surface)",
};

const BUBBLE =
  "group block w-max max-w-[240px] rounded-(--ds-radius-bubble) px-2 py-1.5 text-left font-sans text-[12px] font-medium " +
  "leading-4 shadow-(--ds-shadow-tooltip)";

/** Each arrow sits on the bubble's edge nearest the trigger, at --ds-tt-arrow along it (the middle by default). */
const ARROWS: readonly { side: TooltipSide; w: number; h: number; d: string; at: string }[] = [
  {
    side: "top",
    w: 8,
    h: 4,
    d: "M0 0H8L4 4Z",
    at: "top-full left-[var(--ds-tt-arrow,50%)] -translate-x-1/2 group-data-[side=top]:block",
  },
  {
    side: "bottom",
    w: 8,
    h: 4,
    d: "M0 4H8L4 0Z",
    at: "bottom-full left-[var(--ds-tt-arrow,50%)] -translate-x-1/2 group-data-[side=bottom]:block",
  },
  {
    side: "left",
    w: 4,
    h: 8,
    d: "M0 0V8L4 4Z",
    at: "left-full top-[var(--ds-tt-arrow,50%)] -translate-y-1/2 group-data-[side=left]:block",
  },
  {
    side: "right",
    w: 4,
    h: 8,
    d: "M4 0V8L0 4Z",
    at: "right-full top-[var(--ds-tt-arrow,50%)] -translate-y-1/2 group-data-[side=right]:block",
  },
];

export type TooltipBubbleProps = Omit<HTMLMotionProps<"span">, "content" | "children"> & {
  id: string;
  content: string;
  side: TooltipSide;
  tone: TooltipTone;
  shortcut?: string;
  arrow?: boolean;
};

export function TooltipBubble({
  id,
  content,
  side,
  tone,
  shortcut,
  arrow = false,
  className = "",
  ...motionProps
}: TooltipBubbleProps) {
  return (
    <motion.span
      role="tooltip"
      id={id}
      data-part="bubble"
      data-side={side}
      className={`${BUBBLE} ${TONE[tone]} ${className}`}
      {...motionProps}
    >
      {content}
      {shortcut && (
        <kbd data-part="shortcut" className={`ml-1.5 font-(family-name:--ds-font-mono) text-[11px] ${KBD[tone]}`}>
          {shortcut}
        </kbd>
      )}
      {arrow &&
        ARROWS.map((a) => (
          <svg
            key={a.side}
            aria-hidden
            data-part="arrow"
            data-arrow={a.side}
            width={a.w}
            height={a.h}
            viewBox={`0 0 ${a.w} ${a.h}`}
            className={`absolute hidden ${a.at} ${FILL[tone]}`}
          >
            <path d={a.d} fill="currentColor" />
          </svg>
        ))}
    </motion.span>
  );
}
