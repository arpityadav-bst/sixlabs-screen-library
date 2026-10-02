// The five looks side by side: a top face, the state's parameter colours as a ramp, its look and timing.
// The default face is the floor's own render of a resting tile with a bust (tools/tiles/tile-boot.js).
// The others are schematics of the params, because the engine has no API to pin a state and its static
// renderer cannot serve the holograms yet. The sheet scrolls sideways in its own box under 920px.
import type { TileState } from "./tile-states-data";
import s from "./floor.module.css";

function Face({ face, id }: Pick<TileState, "face" | "id">) {
  if ("image" in face) {
    return (
      <div className={s["ds-st-top"]}>
        {/* eslint-disable-next-line @next/next/no-img-element -- one still from public/, served as is */}
        <img src={face.image} width={face.width} height={face.height} alt={`A ${id} tile, rendered by the floor`} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className={s["ds-st-top"]} aria-hidden="true">
      <div className={s["ds-st-face"]} style={{ background: face.fill, boxShadow: `inset 0 0 0 2px ${face.rim}` }} />
    </div>
  );
}

/** One flat top face in a tint, with its caption, for the Do / Don't pair. */
export function TintFace({ color, label }: { color: string; label: string }) {
  return (
    <figure className="ds-item">
      <div className={s["ds-st-top"]} aria-hidden="true" style={{ width: 160 }}>
        <div className={s["ds-st-face"]} style={{ background: color, boxShadow: "inset 0 0 0 2px #ffffff" }} />
      </div>
      <figcaption className="ds-label">{label}</figcaption>
    </figure>
  );
}

export function StateSheet({ states }: { states: readonly TileState[] }) {
  return (
    <div className={s["ds-st-scroll"]}>
      <div className={s["ds-st-sheet"]} role="list" aria-label="Tile states">
        {states.map((st) => (
          <div key={st.id} className={s["ds-st-col"]} role="listitem">
            <p className={s["ds-st-name"]}>{st.id}</p>
            <Face face={st.face} id={st.id} />
            <div className={s["ds-st-ramp"]} role="list" aria-label={`${st.id} colours`}>
              {st.ramp.map((c) => (
                <span
                  key={c.name}
                  role="listitem"
                  className={s["ds-st-chip"]}
                  style={{ background: c.color }}
                  title={`${c.name} ${c.color}`}
                  aria-label={`${c.name} ${c.color}`}
                />
              ))}
            </div>
            <ul className={s["ds-st-facts"]}>
              {st.look.map((l) => (
                <li key={l}>{l}</li>
              ))}
              <li>
                <code>{st.timing}</code>
              </li>
            </ul>
            <p className="ds-label">{st.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
