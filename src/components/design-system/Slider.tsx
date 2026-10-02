"use client";

// Choosing a value on a range: the trait bars made interactive. A label row on the terminal bars' layout
// (label left, value in tabular figures right), a rounded rail with a navy range, and a white thumb that
// grows to 1.1 under the pointer and 1.15 while dragged, when a bubble shows the value. Each thumb has
// the slider role with a spoken value, arrows step, Page keys move a tenth, Home and End reach the ends.
// Two values make a range, whose thumbs never cross. On the players' blue it is the trait bar itself.
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { BUBBLE, SLIDER_SIZE, SLIDER_TONE, THUMB_BASE, THUMB_HOVER, type SliderGround, type SliderSize } from "./slider-styles";

export type SliderValue = number | readonly [number, number];
export type SliderForce = ForceState | "dragging";

export type SliderProps = {
  label: string;
  hideLabel?: boolean;
  /** one number, or two for a range */
  value?: SliderValue;
  defaultValue?: SliderValue;
  onChange?: (value: SliderValue) => void;
  /** once a drag or a key press ends */
  onCommit?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  /** the shown and spoken value, "72%" */
  formatValue?: (value: number) => string;
  size?: SliderSize;
  disabled?: boolean;
  /** marks under the rail: true for every step (up to 11) or quarters, or the values to mark */
  ticks?: boolean | readonly number[];
  /** prints each tick's value under it */
  tickLabels?: boolean;
  ground?: SliderGround;
  /** hover, focus-visible and dragging show as forced, disabled as the prop */
  forceState?: SliderForce;
  className?: string;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function Slider({
  label,
  hideLabel,
  value,
  defaultValue = 50,
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => String(v),
  size = "md",
  disabled: disabledProp,
  ticks,
  tickLabels,
  ground = "light",
  forceState,
  className = "",
}: SliderProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rail = useRef<HTMLDivElement>(null);
  const thumbs = useRef<(HTMLDivElement | null)[]>([]);
  const [inner, setInner] = useState<SliderValue>(defaultValue);
  const [drag, setDrag] = useState<number | null>(null);
  const current = value ?? inner;
  const vals = typeof current === "number" ? [current] : [current[0], current[1]];
  const range = vals.length === 2;
  const pseudo = forceState === "dragging" ? undefined : forceState;
  const disabled = !!disabledProp || forces(pseudo, "disabled");
  const force = disabled ? undefined : forceAttr(pseudo);
  const forcedDrag = !disabled && forceState === "dragging";
  const s = SLIDER_SIZE[size];
  const t = SLIDER_TONE[ground];
  const half = s.px / 2;
  const span = max - min || 1;
  const decimals = (String(step).split(".")[1] ?? "").length;
  const pct = (v: number) => ((clamp(v, min, max) - min) / span) * 100;
  const at = (p: number) => `calc(${half}px + ${p / 100} * (100% - ${s.px}px))`;

  const snap = (v: number) => Number(clamp(Math.round((v - min) / step) * step + min, min, max).toFixed(decimals));
  const emit = (next: number[]) => (range ? ([next[0], next[1]] as const) : next[0]);
  const setAt = (k: number, v: number): number[] => {
    const next = [...vals];
    next[k] = range ? (k === 0 ? Math.min(snap(v), vals[1]) : Math.max(snap(v), vals[0])) : snap(v);
    if (next[k] === vals[k]) return vals;
    if (value === undefined) setInner(emit(next));
    onChange?.(emit(next));
    return next;
  };
  const fromX = (x: number) => {
    const r = rail.current?.getBoundingClientRect();
    if (!r || r.width === 0) return vals[0];
    return min + clamp((x - r.left) / r.width, 0, 1) * span;
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    const v = fromX(e.clientX);
    const k = !range ? 0 : v <= vals[0] ? 0 : v >= vals[1] ? 1 : v - vals[0] <= vals[1] - v ? 0 : 1;
    setDrag(k);
    setAt(k, v);
    thumbs.current[k]?.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (drag !== null) setAt(drag, fromX(e.clientX));
  };
  const up = () => {
    if (drag === null) return;
    setDrag(null);
    onCommit?.(emit(vals));
  };

  const big = Math.max(step, Math.round(span / 10 / step) * step);
  const key = (k: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const floor = range && k === 1 ? vals[0] : min;
    const ceil = range && k === 0 ? vals[1] : max;
    const moves: Record<string, number> = {
      ArrowRight: vals[k] + step,
      ArrowUp: vals[k] + step,
      ArrowLeft: vals[k] - step,
      ArrowDown: vals[k] - step,
      PageUp: vals[k] + big,
      PageDown: vals[k] - big,
      Home: floor,
      End: ceil,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    e.stopPropagation();
    onCommit?.(emit(setAt(k, moves[e.key])));
  };

  const marks =
    ticks === true
      ? span / step <= 10
        ? Array.from({ length: Math.round(span / step) + 1 }, (_, i) => min + i * step)
        : [0, 0.25, 0.5, 0.75, 1].map((f) => min + f * span)
      : ticks || [];
  const lo = range ? vals[0] : min;
  const hi = range ? vals[1] : vals[0];
  const shown = range ? `${formatValue(vals[0])} to ${formatValue(vals[1])}` : formatValue(vals[0]);
  const ring = ground === "blue" ? FOCUS_INVERSE : FOCUS;

  return (
    <div
      data-slot="slider"
      data-force={force}
      data-disabled={disabled || undefined}
      className={`group/slider min-w-0 font-sans select-none ${disabled ? "opacity-40" : ""} ${className}`}
    >
      <div className={hideLabel ? "sr-only" : "mb-2 flex items-baseline justify-between gap-3"}>
        <span id={`${uid}-label`} data-slot="label" className={t.label}>
          {label}
        </span>
        <span aria-hidden data-slot="value-text" className={`shrink-0 text-right tabular-nums ${t.value}`}>
          {shown}
        </span>
      </div>
      <div
        data-slot="track"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className={`relative h-6 touch-pan-y ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          ref={rail}
          data-slot="rail"
          style={{ left: half, right: half }}
          className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-colors duration-(--ds-dur-ui) ${s.rail} ${t.rail} ${disabled ? "" : t.railHover}`}
        >
          <div
            data-slot="range"
            style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
            className={`absolute inset-y-0 rounded-full ${t.range}`}
          />
        </div>
        {vals.map((v, k) => {
          const dragging = forcedDrag || drag === k;
          const name = range ? (k === 0 ? "minimum" : "maximum") : "";
          return (
            <div
              key={k}
              ref={(el) => {
                thumbs.current[k] = el;
              }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-labelledby={range ? `${uid}-label ${uid}-t${k}` : `${uid}-label`}
              aria-valuemin={range && k === 1 ? vals[0] : min}
              aria-valuemax={range && k === 0 ? vals[1] : max}
              aria-valuenow={v}
              aria-valuetext={formatValue(v)}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              data-slot="thumb"
              data-force={(force === "focus" || force === "hover") && k === 0 ? force : undefined}
              onKeyDown={key(k)}
              style={{ left: at(pct(v)) }}
              className={`${THUMB_BASE} ${s.thumb} ${t.thumb} ${ring} ${dragging ? "scale-[1.15]" : disabled ? "" : THUMB_HOVER}`}
            >
              {range && (
                <span id={`${uid}-t${k}`} className="sr-only">
                  {name}
                </span>
              )}
              <span
                aria-hidden
                data-slot="bubble"
                className={`${BUBBLE} ${t.bubble} ${dragging ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
              >
                {formatValue(v)}
              </span>
            </div>
          );
        })}
      </div>
      {marks.length > 0 && (
        <div aria-hidden data-slot="ticks" className="relative mt-1 h-1.5">
          {marks.map((m) => (
            <span
              key={m}
              style={{ left: at(pct(m)) }}
              className={`absolute top-0 h-1.5 w-px -translate-x-1/2 ${m >= lo && m <= hi ? t.tickOn : t.tick}`}
            />
          ))}
        </div>
      )}
      {marks.length > 0 && tickLabels && (
        <div aria-hidden className="relative mt-1 h-4">
          {marks.map((m) => (
            <span
              key={m}
              style={{ left: at(pct(m)) }}
              className={`absolute top-0 -translate-x-1/2 text-[12px] leading-4 tabular-nums ${ground === "blue" ? "text-white" : "text-(--ds-color-text-muted)"}`}
            >
              {formatValue(m)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
