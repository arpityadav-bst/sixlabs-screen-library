// Type specimens: one row per role (the role, the assertion chip, then the quoted copy set with the
// site's class string and its measured line), and one card per family.
import { Metrics } from "@/app/design-system/_kit/Metrics";
import { AssertChip } from "./foundation-parts";
import s from "./foundation.module.css";
import t from "./type.module.css";
import { roleOf, type Family, type RoleRow, type Tone } from "./type-data";

const TONE: Record<Tone, string> = {
  ink: s["ds-tone-ink"],
  body: s["ds-tone-body"],
  muted: s["ds-tone-muted"],
  quiet: s["ds-tone-quiet"],
  white: s["ds-tone-white"],
  "on-blue": s["ds-tone-on-blue"],
};

/** stack puts the role above its specimen, for a line too wide to share the row (the footer word). */
export function TypeRows({ rows, stack }: { rows: readonly RoleRow[]; stack?: boolean }) {
  return (
    <div className={t["ds-rows"]}>
      {rows.map((r) => (
        <div key={r.role} className={`${t["ds-row"]} ${stack ? t["ds-row--stack"] : ""}`}>
          <div className={t["ds-row-meta"]}>
            <span className={t["ds-row-role"]}>{r.role}</span>
            <AssertChip a={r.assert} />
          </div>
          <div className={t["ds-row-spec"]}>
            <Metrics>
              <p className={`${r.render ?? roleOf(r.role).classes} ${TONE[r.tone]}`}>{r.copy}</p>
            </Metrics>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FamilyCard({ f }: { f: Family }) {
  return (
    <figure className={`${t["ds-family"]} ${f.cls}`}>
      <Metrics>
        <p className={t["ds-family-aa"]}>Aa</p>
      </Metrics>
      <p className={t["ds-family-line"]}>ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz</p>
      <div className={t["ds-family-figures"]}>
        <span>0123456789</span>
        <span className={t["ds-family-tab"]}>
          0123456789 <small className={s["ds-tone-muted"]}>tabular</small>
        </span>
      </div>
      <div className={t["ds-family-weights"]}>
        {f.weights.map((w) => (
          <span key={w} style={{ fontWeight: w }}>
            Aa<small>{w}</small>
          </span>
        ))}
      </div>
      <figcaption className={t["ds-family-foot"]}>
        <span className="ds-chip ds-chip--static">--ds-{f.token}</span>
        <AssertChip a={f.assert} />
      </figcaption>
    </figure>
  );
}
