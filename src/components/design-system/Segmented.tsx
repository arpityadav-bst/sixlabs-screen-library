"use client";

// Two to four short options chosen in place, on one pill. The site has two drifted ones, ModeToggle on
// the blue (a sliding white thumb) and the Jobs switch on white (a navy fill that jumps). This is both on
// one spec with three grounds: the thumb always slides on the thumb spring, selected is navy on light
// grounds and white on blue, never the accent. It is one tab stop with the arrows moving the choice,
// as a radio group is, or a tab list when it switches content in place.
import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, type KeyboardEvent } from "react";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { SPRING } from "./motion";
import { rovingTarget, tabStop } from "./roving";
import {
  SEG_GROUND,
  SEG_OPTION,
  SEG_SIZE,
  SEG_TRACK,
  type SegmentedGround,
  type SegmentedSize,
} from "./segmented-styles";

export type { SegmentedGround, SegmentedSize } from "./segmented-styles";

export type SegmentedOption<T extends string> = { id: T; label: string; disabled?: boolean };

export type SegmentedProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (id: T) => void;
  /** the group's accessible name */
  label: string;
  size?: SegmentedSize;
  ground?: SegmentedGround;
  /** every segment as wide as the widest */
  equal?: boolean;
  /** radio (a choice) by default, tab when it switches content in place */
  role?: "radio" | "tab";
  /** the thumb's layoutId. Unique per instance by default, so two mounted controls never trade thumbs */
  thumbId?: string;
  /** tab role: each segment's id and the panel it controls */
  optionId?: (id: T) => string;
  controls?: (id: T) => string;
  disabled?: boolean;
  /** a StateGrid cell: hover and pressed show on forceOn (the first other option by default), focus-visible
   * on the selected one, disabled turns the whole control off */
  forceState?: ForceState;
  forceOn?: T;
  className?: string;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  ground = "light",
  equal = false,
  role = "radio",
  thumbId,
  optionId,
  controls,
  disabled: disabledProp = false,
  forceState,
  forceOn,
  className = "",
}: SegmentedProps<T>) {
  const auto = useId();
  const still = useReducedMotion();
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const disabled = disabledProp || forces(forceState, "disabled");
  const force = forceAttr(forceState);
  const stop = tabStop(options, value);
  const target =
    force === "focus" ? value : (forceOn ?? options.find((o) => o.id !== value && !o.disabled)?.id);
  const g = SEG_GROUND[ground];
  const ring = ground === "blue" ? FOCUS_INVERSE : FOCUS;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const from = options.find((o) => refs.current.get(o.id) === e.target)?.id ?? value;
    const next = rovingTarget(options, from, e.key, role === "radio");
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    refs.current.get(next)?.focus();
    if (next !== value) onChange(next);
  };

  return (
    <div
      role={role === "tab" ? "tablist" : "radiogroup"}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      className={[
        equal ? "inline-grid auto-cols-fr grid-flow-col" : "inline-flex",
        SEG_TRACK,
        g.track,
        disabled ? "cursor-not-allowed opacity-40" : "",
        className,
      ].join(" ")}
    >
      {options.map((o) => {
        const on = o.id === value;
        const off = disabled || !!o.disabled;
        return (
          <button
            key={o.id}
            ref={(el) => {
              if (el) refs.current.set(o.id, el);
              else refs.current.delete(o.id);
            }}
            type="button"
            id={optionId?.(o.id)}
            role={role}
            aria-checked={role === "radio" ? on : undefined}
            aria-selected={role === "tab" ? on : undefined}
            aria-controls={role === "tab" ? controls?.(o.id) : undefined}
            tabIndex={o.id === stop && !disabled ? 0 : -1}
            disabled={off}
            data-force={o.id === target ? force : undefined}
            onClick={() => !on && onChange(o.id)}
            className={[
              SEG_OPTION,
              SEG_SIZE[size],
              ring,
              on ? g.on : g.rest,
              o.disabled && !disabled ? "cursor-not-allowed opacity-40" : "",
              disabled ? "cursor-not-allowed" : "",
            ].join(" ")}
          >
            {on && (
              <motion.span
                aria-hidden
                layoutId={thumbId ?? `ds-seg-${auto}`}
                className={`absolute inset-0 rounded-full ${g.thumb}`}
                transition={still ? { duration: 0 } : SPRING.thumb}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
