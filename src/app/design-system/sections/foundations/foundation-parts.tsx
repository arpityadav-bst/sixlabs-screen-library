// Small server parts the five scale sections share: the assertion chip that turns red when a
// transcribed value has left its source, and the bar list for spacing steps and measures.
import type { CSSProperties } from "react";
import type { Assertion } from "./foundation-assert";
import { check } from "./foundation-scan";
import s from "./foundation.module.css";

/** "Jobs.tsx:106" while the text is still in the file, a red "drifted" chip when it is not. */
export function AssertChip({ a }: { a: Assertion }) {
  const r = check(a);
  if (r.ok) return <span className="ds-chip ds-chip--static">{r.at}</span>;
  return (
    <span className={`ds-chip ds-chip--static ${s["ds-drift"]}`} title={`missing: ${r.missing.join(" | ")}`}>
      drifted from {r.at}
    </span>
  );
}

export type Bar = {
  name: string;
  /** the length in px */
  px: number;
  /** what the step is for, or where the value is used */
  note?: string;
  /** the right-hand figure, the px value by default */
  value?: string;
  /** a step the site does not use */
  dim?: boolean;
};

/**
 * scale "px" draws each bar at its true length (spacing). scale "fit" draws them against the longest,
 * so wide values (measures) share one column.
 */
export function BarList({ bars, scale = "px", label }: { bars: readonly Bar[]; scale?: "px" | "fit"; label: string }) {
  const max = Math.max(...bars.map((b) => b.px));
  return (
    <ul className={s["ds-bars"]} aria-label={label}>
      {bars.map((b) => {
        const style: CSSProperties = scale === "px" ? { width: b.px } : { width: `${(b.px / max) * 100}%` };
        return (
          <li key={b.name} className={`${s["ds-bar-row"]} ${b.dim ? s["ds-bar-row--dim"] : ""}`}>
            <span className={s["ds-bar-name"]}>{b.name}</span>
            <span className={s["ds-bar-track"]}>
              <span className={`${s["ds-bar"]} ${b.dim ? s["ds-bar--dim"] : ""}`} style={style} aria-hidden="true" />
              {b.note && <span className={s["ds-bar-note"]}>{b.note}</span>}
            </span>
            <span className={s["ds-bar-value"]}>{b.value ?? `${b.px}px`}</span>
          </li>
        );
      })}
    </ul>
  );
}
