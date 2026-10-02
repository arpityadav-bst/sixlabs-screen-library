// The light sections' vertical rhythm, drawn at half size: each section's top and bottom padding as a
// hatched band whose height is the section's own clamp(), so the bands are true to this window's width.
// Each row carries the chip that turns red when the padding has left its source.
import type { CSSProperties } from "react";
import { AssertChip } from "../foundations/foundation-parts";
import { RHYTHM } from "./light-sections-data";
import s from "./light-sections.module.css";

const half = (len: string): CSSProperties => ({ height: `calc((${len}) / 2)` });

export function RhythmMap() {
  return (
    <ol className={s["ds-rh"]} aria-label="Light section padding, from md, at half size">
      {RHYTHM.map((r) => (
        <li key={r.name} className={s["ds-rh-row"]}>
          <div className={s["ds-rh-name"]}>
            <span>{r.name}</span>
            <AssertChip a={r.a} />
          </div>
          <div className={s["ds-rh-col"]}>
            <div className={s["ds-rh-pad"]} style={half(r.top)}>
              <span>pt {r.top}</span>
            </div>
            <div className={s["ds-rh-body"]}>{r.content}</div>
            {r.bottom !== "0px" && (
              <div className={s["ds-rh-pad"]} style={half(r.bottom)}>
                <span>pb {r.bottom}</span>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
