// The circular form of Progress, for a place too small for a bar (a tile, a button, a list row). The arc
// starts at twelve o'clock and eases its length over 700ms. Indeterminate turns a quarter arc by
// transform alone. From 40px it can print its value in the middle. Strokes grow with the size so the ring
// keeps its weight: 2, 2.5, 3 and 4, read from the busy-ring table in token-shape.ts.
import styles from "./progress.module.css";
import { fillColour, RAIL, valueText, type ProgressStatus, type ProgressVariant } from "./progress-styles";
import { CIRCLE_STROKE } from "./token-shape";

export { CIRCLE_STROKE } from "./token-shape";
export type ProgressCircleSize = 16 | 24 | 40 | 64;

export type ProgressCircleProps = {
  value?: number;
  max?: number;
  label: string;
  size?: ProgressCircleSize;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  status?: ProgressStatus;
  /** the percentage in the middle, from 40px */
  showValue?: boolean;
  className?: string;
};

export function ProgressCircle({
  value = 0,
  max = 100,
  label,
  size = 24,
  variant = "light",
  indeterminate = false,
  status,
  showValue = false,
  className = "",
}: ProgressCircleProps) {
  const stroke = CIRCLE_STROKE[size];
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const done = status === "complete" ? max : Math.min(max, Math.max(0, value));
  const pct = Math.round((done / max) * 100);
  const shown = indeterminate ? 0.25 : done / max;
  const text = valueText(pct, status, indeterminate);
  const middle = showValue && size >= 40 && !indeterminate;

  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : done}
      aria-valuetext={text}
      aria-busy={indeterminate && status !== "paused" ? true : undefined}
      data-paused={status === "paused" ? "" : undefined}
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="block">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={RAIL[variant]} strokeWidth={stroke} />
        <g className={indeterminate ? styles["ds-progress-spin"] : undefined}>
          <circle
            className={styles["ds-progress-arc"]}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={fillColour(variant, status)}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={length}
            strokeDashoffset={length * (1 - shown)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </g>
      </svg>
      {middle && (
        <span
          aria-hidden
          className={`absolute font-sans font-medium tabular-nums ${variant === "light" ? "text-(--ds-color-ink)" : "text-white"}`}
          style={{ fontSize: size >= 64 ? 13 : 11 }}
        >
          {status === "complete" ? "Done" : `${pct}%`}
        </span>
      )}
    </span>
  );
}
