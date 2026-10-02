// Slider class maps: the three sizes and the two grounds, written out in full for Tailwind's scanner.
// The light ground follows the trait bars' shape in navy, the blue ground is the trait bars themselves
// (PlayerTraits.tsx:43-45: a white 20% rail and a white fill) made draggable, its label row in full white,
// the most the accent allows (4.49:1).
import { THUMB_SHADOW } from "./choice-styles";

export type SliderSize = "sm" | "md" | "lg";
export type SliderGround = "light" | "blue";

/** Rail 2 / 4 / 6, thumb 14 / 18 / 22. Every thumb answers a 40px circle round its centre. */
export const SLIDER_SIZE: Record<SliderSize, { rail: string; thumb: string; px: number }> = {
  sm: { rail: "h-0.5", thumb: "h-3.5 w-3.5", px: 14 },
  md: { rail: "h-1", thumb: "h-[18px] w-[18px]", px: 18 },
  lg: { rail: "h-1.5", thumb: "h-[22px] w-[22px]", px: 22 },
};

export const SLIDER_TONE: Record<
  SliderGround,
  { rail: string; railHover: string; range: string; thumb: string; tick: string; tickOn: string; label: string; value: string; bubble: string }
> = {
  light: {
    rail: "bg-(--ds-color-line)",
    railHover: "group-hover/slider:bg-(--ds-color-line-strong) group-data-[force=hover]/slider:bg-(--ds-color-line-strong)",
    range: "bg-(--ds-color-primary)",
    thumb: `border border-(--ds-color-line-field) bg-(--ds-color-surface) ${THUMB_SHADOW}`,
    tick: "bg-(--ds-color-line-strong)",
    tickOn: "bg-(--ds-color-primary)",
    label: "text-[13px] font-medium leading-[18px] tracking-[-0.01em] text-(--ds-color-ink)",
    value: "text-[13px] leading-[18px] text-(--ds-color-text-body)",
    bubble: "bg-(--ds-color-primary) text-white shadow-(--ds-shadow-tooltip)",
  },
  blue: {
    rail: "bg-(--ds-color-on-blue-20)",
    railHover: "group-hover/slider:bg-(--ds-color-on-blue-25) group-data-[force=hover]/slider:bg-(--ds-color-on-blue-25)",
    range: "bg-(--ds-color-surface)",
    thumb: `border-2 border-(--ds-color-primary) bg-(--ds-color-surface) ${THUMB_SHADOW}`,
    tick: "bg-(--ds-color-on-blue-40)",
    tickOn: "bg-(--ds-color-surface)",
    label: "text-[14px] leading-5 text-white",
    value: "text-[14px] leading-5 text-white",
    bubble: "bg-(--ds-color-surface) text-(--ds-color-ink) shadow-(--ds-shadow-tooltip)",
  },
};

export const THUMB_BASE =
  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full outline-offset-(--ds-focus-offset) transition-[scale] " +
  "duration-(--ds-dur-ui) ease-(--ds-ease-out) before:absolute before:left-1/2 before:top-1/2 before:h-10 " +
  "before:w-10 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-['']";

/** The thumb under the pointer grows, the one hovered only (its 40px circle counts), never its pair. */
export const THUMB_HOVER = "hover:scale-110 data-[force=hover]:scale-110";

export const BUBBLE =
  "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-(--ds-radius-bubble) px-2 py-1 " +
  "font-sans text-[12px] font-medium leading-4 tabular-nums transition-[opacity,translate] duration-(--ds-dur-ui) " +
  "ease-(--ds-ease-out) motion-reduce:transition-none";
