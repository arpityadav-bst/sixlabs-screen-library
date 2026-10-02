// Two drawn diagrams for the layout section, both computed from the layout tokens rather than drawn by
// hand: the nesting of page gutter, container and inner gutter at a window width, and the two
// breakpoint ladders on one axis.
import { BREAKPOINT_ROWS, CONTAINER_FULL, RULER_MAX, TICKS, nestAt } from "./layout-data";
import s from "./layout.module.css";

const grow = (n: number) => ({ flexGrow: n });

export function NestBar({ width }: { width: number }) {
  const n = nestAt(width);
  const full = width >= CONTAINER_FULL ? CONTAINER_FULL : 0;
  const parts = [
    { key: "page gutter", value: n.gutter, cls: "" },
    ...(n.margin > 0 ? [{ key: "auto margin", value: n.margin, cls: s["ds-seg-margin"] }] : []),
    { key: "container", value: n.box, cls: s["ds-key-box"] },
    { key: "inner gutter", value: n.inner, cls: s["ds-seg-inner"] },
    { key: "content", value: n.content, cls: s["ds-seg-content"] },
    ...(full ? [{ key: "full-view copy grid", value: full, cls: s["ds-key-full"] }] : []),
  ];
  return (
    <figure className={s["ds-nest"]}>
      <figcaption className={s["ds-nest-head"]}>{width} window</figcaption>
      <div className={s["ds-nest-bar"]} aria-hidden="true">
        <span className={s["ds-seg-gutter"]} style={grow(n.gutter)} />
        {n.margin > 0 && <span className={s["ds-seg-margin"]} style={grow(n.margin)} />}
        <span className={s["ds-seg-box"]} style={grow(n.box)}>
          <span className={s["ds-seg-inner"]} style={grow(n.inner)} />
          <span className={s["ds-seg-content"]} style={grow(n.content)} />
          <span className={s["ds-seg-inner"]} style={grow(n.inner)} />
        </span>
        {n.margin > 0 && <span className={s["ds-seg-margin"]} style={grow(n.margin)} />}
        <span className={s["ds-seg-gutter"]} style={grow(n.gutter)} />
        {full > 0 && (
          <span className={s["ds-seg-full"]} style={{ left: `${((width - full) / 2 / width) * 100}%`, width: `${(full / width) * 100}%` }} />
        )}
      </div>
      <ul className={s["ds-legend"]}>
        {parts.map((p) => (
          <li key={p.key}>
            <i className={p.cls || s["ds-seg-gutter"]} />
            {p.key} {p.value}
          </li>
        ))}
      </ul>
    </figure>
  );
}

const LANES = ["Tailwind", "Full hero", "Edge"] as const;

export function BreakpointRuler({ counts }: { counts: ReadonlyMap<string, number> }) {
  return (
    <div className={s["ds-bp-wrap"]}>
      <div className={s["ds-bp"]} role="img" aria-label={BREAKPOINT_ROWS.map((b) => `${b.ladder} ${b.px}`).join(", ")}>
        {LANES.map((lane) => (
          <div key={lane} className={s["ds-bp-lane"]}>
            <span className={s["ds-bp-name"]}>{lane}</span>
            <div className={s["ds-bp-track"]}>
              {TICKS.filter((b) => b.ladder === lane).map((b) => {
                const n = b.prefixes.reduce((sum, p) => sum + (counts.get(p) ?? 0), 0);
                return (
                  <span
                    key={b.name}
                    className={`${s["ds-bp-tick"]} ${n === 0 ? s["ds-bp-tick--dim"] : ""}`}
                    style={{ left: `${(b.px / RULER_MAX) * 100}%` }}
                  >
                    <b>{b.px}</b>
                    <small>{n}×</small>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
