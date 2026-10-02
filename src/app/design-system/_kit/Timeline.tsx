// A time axis with lanes. Each item has its own row, so labels never collide: a mark is a 10px navy dot
// at one time, a duration a 6px bar with a navy start cap. Times print with every label, so the chart
// is also its own table. An optional second axis reads the same times on another clock (the floor's
// sweep S over wall clock S/1.69). Positions are percentages, so it needs no measuring, and it scrolls
// sideways in its own box under its least width, a box that takes a tab stop while it scrolls (ScrollBox).
// Works in server and client sections alike.
import type { CSSProperties } from "react";
import { ScrollBox } from "./ScrollBox";

export type TimelineItem = {
  label: string;
  /** a mark's time, or a duration's start */
  at: number;
  /** a duration's end */
  to?: number;
};

export type TimelineLane = { label: string; items: readonly TimelineItem[] };

export type TimelineProps = {
  lanes: readonly TimelineLane[];
  unit?: "s" | "ms";
  /** the axis' name in the label column ("from first paint") */
  axisLabel?: string;
  start?: number;
  /** the axis' end (the last time, rounded up, by default) */
  end?: number;
  /** tick spacing (a round step that gives about eight ticks by default) */
  step?: number;
  /** a second clock: its value is the time times factor */
  second?: { label: string; factor: number; unit?: string; step?: number };
  /** print each item's time after its label (on by default) */
  times?: boolean;
  /** the chart's accessible name */
  label: string;
  minWidth?: number;
};

/** A round step that gives at most `count` ticks over a span. */
export function niceStep(span: number, count = 8): number {
  if (!(span > 0)) return 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

const num = (n: number) => String(+n.toFixed(3));

function ticks(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  const first = Math.ceil(from / step - 1e-9) * step;
  for (let t = first; t <= to + 1e-9; t += step) out.push(+t.toFixed(6));
  return out;
}

export function Timeline({
  lanes,
  unit = "s",
  axisLabel,
  start = 0,
  end,
  step,
  second,
  times = true,
  label,
  minWidth = 560,
}: TimelineProps) {
  const last = Math.max(start, ...lanes.flatMap((l) => l.items.map((i) => i.to ?? i.at)));
  const s0 = step ?? niceStep((end ?? last) - start);
  const stop = end ?? Math.ceil(last / s0 - 1e-9) * s0;
  const span = stop - start || 1;
  const pct = (t: number) => `${((t - start) / span) * 100}%`;
  const fmt = (t: number) => `${num(t)}${unit}`;
  const main = ticks(start, stop, s0);
  const s2 = second && (second.step ?? niceStep(span * second.factor));
  const alt = second && s2 ? ticks(start * second.factor, stop * second.factor, s2) : [];
  const grid = { "--ds-tl-min": `${minWidth}px` } as CSSProperties;

  const text = (i: TimelineItem) =>
    !times ? i.label : i.to === undefined ? `${i.label} at ${fmt(i.at)}` : `${i.label} ${fmt(i.to - i.at)} from ${fmt(i.at)}`;

  return (
    <figure className="ds-tl" aria-label={label} role="group">
      <ScrollBox className="ds-tl-scroll" label={label}>
        <div className="ds-tl-grid" style={grid}>
          <div className="ds-tl-row ds-tl-axis">
            <span className="ds-tl-lane">{axisLabel ?? (unit === "s" ? "seconds" : "milliseconds")}</span>
            <div className="ds-tl-track">
              {main.map((t) => (
                <span key={t} className="ds-tl-tick" style={{ left: pct(t) }}>
                  {num(t)}
                </span>
              ))}
            </div>
          </div>
          {lanes.map((lane) =>
            lane.items.map((item, i) => {
              const far = (item.to ?? item.at) > start + span * 0.62;
              const at: CSSProperties = far ? { right: `calc(100% - ${pct(item.to ?? item.at)})` } : { left: pct(item.at) };
              return (
                <div key={`${lane.label}-${i}`} className={i === 0 ? "ds-tl-row ds-tl-first" : "ds-tl-row"}>
                  <span className="ds-tl-lane">{i === 0 ? lane.label : ""}</span>
                  <div className="ds-tl-track">
                    {main.map((t) => (
                      <span key={t} className="ds-tl-rule" style={{ left: pct(t) }} />
                    ))}
                    <span className="ds-tl-text" style={at}>
                      {text(item)}
                    </span>
                    {item.to === undefined ? (
                      <span className="ds-tl-mark" style={{ left: pct(item.at) }} />
                    ) : (
                      <span className="ds-tl-span" style={{ left: pct(item.at), width: `${((item.to - item.at) / span) * 100}%` }} />
                    )}
                  </div>
                </div>
              );
            }),
          )}
          {second && (
            <div className="ds-tl-row ds-tl-axis ds-tl-axis--second">
              <span className="ds-tl-lane">{second.label}</span>
              <div className="ds-tl-track">
                {alt.map((u) => (
                  <span key={u} className="ds-tl-tick" style={{ left: pct(u / second.factor) }}>
                    {num(u)}
                    {second.unit ?? ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollBox>
    </figure>
  );
}
