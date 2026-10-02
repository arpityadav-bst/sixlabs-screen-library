// A progress bar with the semantics the shipped trait bars lack: role progressbar, its range and value,
// and a value text that names the status. Determinate fills ease over 700ms, indeterminate runs a 35%
// segment by transform alone and leaves aria-valuenow out, complete and error take the status colours,
// paused holds still. Segments split the rail into steps for a count of stages. In forced colours the rail
// keeps an outline and the done part fills Highlight (progress.module.css). Server or client.
import styles from "./progress.module.css";
import { fillColour, LABEL, RAIL, valueText, type ProgressStatus, type ProgressVariant } from "./progress-styles";

export type { ProgressStatus, ProgressVariant } from "./progress-styles";
export type ProgressSize = 2 | 4 | 6 | 8;

const HEIGHT: Record<ProgressSize, string> = { 2: "h-0.5", 4: "h-1", 6: "h-1.5", 8: "h-2" };

export type ProgressProps = {
  /** the amount done, 0 to max (in steps when segments is set) */
  value?: number;
  max?: number;
  /** the accessible name, shown above the rail with showLabel */
  label: string;
  showLabel?: boolean;
  /** the value or status at the row's end */
  showValue?: boolean;
  size?: ProgressSize;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  status?: ProgressStatus;
  /** split the rail into this many steps, filled whole */
  segments?: number;
  className?: string;
};

export function Progress({
  value = 0,
  max: maxProp = 100,
  label,
  showLabel = false,
  showValue = false,
  size = 4,
  variant = "light",
  indeterminate = false,
  status,
  segments,
  className = "",
}: ProgressProps) {
  const max = segments ?? maxProp;
  const done = status === "complete" ? max : Math.min(max, Math.max(0, value));
  const pct = Math.round((done / max) * 100);
  const text = valueText(pct, status, indeterminate);
  const fill = fillColour(variant, status);
  const tone = LABEL[variant];
  const h = HEIGHT[size];

  const rail = segments ? (
    <span className={`flex w-full gap-0.5 ${h}`}>
      {Array.from({ length: segments }, (_, k) => (
        <span
          key={k}
          data-on={k < done || undefined}
          className={`${styles["ds-progress-fill"]} ${styles["ds-progress-rail"]} h-full flex-1 rounded-full`}
          style={{ backgroundColor: k < done ? fill : RAIL[variant] }}
        />
      ))}
    </span>
  ) : (
    <span
      className={`${styles["ds-progress-rail"]} relative block w-full overflow-hidden rounded-full ${h}`}
      style={{ backgroundColor: RAIL[variant] }}
    >
      {indeterminate ? (
        <span className={`${styles["ds-progress-run"]} absolute inset-y-0 left-0 rounded-full`} style={{ backgroundColor: fill }} />
      ) : (
        <span
          data-on=""
          className={`${styles["ds-progress-fill"]} block h-full rounded-full`}
          style={{ width: `${pct}%`, backgroundColor: fill }}
        />
      )}
    </span>
  );

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : done}
      aria-valuetext={text}
      aria-busy={indeterminate && status !== "paused" ? true : undefined}
      data-paused={status === "paused" ? "" : undefined}
      className={`w-full ${className}`}
    >
      {(showLabel || showValue) && (
        <span aria-hidden className="mb-2 flex items-baseline justify-between gap-3 font-sans text-[13px] leading-5">
          <span className={showLabel ? tone.name : "sr-only"}>{label}</span>
          {showValue && <span className={`tabular-nums ${tone.value}`}>{text}</span>}
        </span>
      )}
      {rail}
    </div>
  );
}
