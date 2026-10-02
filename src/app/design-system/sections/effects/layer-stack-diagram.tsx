// The exploded stack, drawn by the guide: one tilted plane per layer, the ground at the bottom. Static,
// because the real layers only exist together on the full page (AccentWave and AsciiBackdrop are fixed
// to the window and never mount in the guide).
import type { Layer, MiniPlane, PlaneLook } from "./layer-stack-data";
import s from "./layer-stack.module.css";

const LOOK: Record<PlaneLook, string> = {
  ground: "",
  glyphs: s["ds-ls-glyphs"],
  flow: s["ds-ls-flow"],
  water: s["ds-ls-water"],
  players: s["ds-ls-players"],
  chrome: s["ds-ls-chrome"],
  readout: s["ds-ls-readout"],
};

function Plane({ look, hot }: { look: PlaneLook; hot?: boolean }) {
  const cls = [s["ds-ls-plane"], LOOK[look], hot ? s["ds-ls-hot"] : ""].filter(Boolean).join(" ");
  return (
    <div className={s["ds-ls-stage"]} aria-hidden="true">
      <div className={cls} />
    </div>
  );
}

/** The seven planes with their numbers, names, z and what each holds. Ground first in the DOM. */
export function LayerDiagram({ layers }: { layers: readonly Layer[] }) {
  return (
    <ol className={s["ds-ls"]} aria-label="Page layers, bottom to top">
      {layers.map((l) => (
        <li key={l.n} className={s["ds-ls-row"]}>
          <Plane look={l.look} />
          <div className={s["ds-ls-text"]}>
            <span className={s["ds-ls-num"]} aria-hidden="true">
              {l.n}
            </span>
            {l.name}
            <span className="ds-chip ds-chip--static">z {l.z}</span>
            <span className={s["ds-ls-holds"]}>{l.holds}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A three-plane stack for a Do or Don't panel, bottom plane first. */
export function MiniStack({ planes, label }: { planes: readonly MiniPlane[]; label: string }) {
  return (
    <ol className={`${s["ds-ls"]} ${s["ds-ls--mini"]}`} aria-label={label}>
      {planes.map((p) => (
        <li key={p.name} className={s["ds-ls-row"]}>
          <Plane look={p.look} hot={p.hot} />
          <div className={s["ds-ls-text"]}>
            {p.name}
            <span className="ds-chip ds-chip--static">z {p.z}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
