// The scroll line's track laid end to end, in screens of scroll from the moment the line reaches the top of
// the view: the words filling, the held line, the water rising over the pinned stage, the players and
// the drain. Widths are the screens each part takes. The bar and its axis scroll sideways on a narrow screen
// (in a ScrollBox, a tab stop while it overflows), the legend wraps beneath them.
import { TRACK } from "./_data/choreography";
import { ScrollBox } from "./scroll-box";
import styles from "./motion.module.css";

const words = (TRACK.height - 1 - TRACK.wave) * TRACK.completeAt; // the words fill over 0.82 of their scroll
const pinned = TRACK.height - 1; // the stage lets go when the track's foot reaches the view's foot
const SEGS = [
  { tone: "fill", label: "words fill", from: 0, to: words },
  { tone: "hold", label: "line held", from: words, to: pinned - TRACK.wave },
  { tone: "water", label: "water rises", from: pinned - TRACK.wave, to: pinned },
  { tone: "players", label: "players", from: pinned, to: pinned + 1 },
  { tone: "drain", label: "drain", from: pinned + 1, to: pinned + 1 + TRACK.drain },
] as const;
const END = SEGS[SEGS.length - 1].to;
const MARKS = [
  { at: 0, label: "0" },
  { at: words, label: "" },
  { at: pinned - TRACK.wave, label: "" },
  { at: pinned, label: " players snap" },
];
const fmt = (n: number) => String(+n.toFixed(2));

export function ScrollTrack() {
  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <ScrollBox className={styles["ds-mo-strack-wrap"]} label="The scroll line's track in screens">
        <div className={styles["ds-mo-strack"]} role="img" aria-label={SEGS.map((s) => `${s.label} ${fmt(s.from)} to ${fmt(s.to)} screens`).join(", ")}>
          <div className={styles["ds-mo-strack-bar"]}>
            {SEGS.map((s) => (
              <span key={s.tone} className={styles["ds-mo-seg"]} data-tone={s.tone} style={{ flexGrow: s.to - s.from, flexBasis: 0 }} title={s.label}>
                {s.to - s.from >= 0.9 ? s.label : ""}
              </span>
            ))}
          </div>
          <div className={styles["ds-mo-strack-axis"]} aria-hidden="true">
            {MARKS.map((m, i) => (
              <span
                key={m.at}
                className={styles["ds-mo-strack-mark"]}
                data-edge={i === 0 ? "start" : undefined}
                data-row={i % 2 ? "2" : undefined}
                style={{ left: `${(m.at / END) * 100}%` }}
              >
                {i === 0 ? m.label : fmt(m.at) + m.label}
              </span>
            ))}
          </div>
        </div>
      </ScrollBox>
      <ul className={styles["ds-mo-legend"]}>
        {SEGS.map((s) => (
          <li key={s.tone}>
            <i className={styles["ds-mo-key"]} data-tone={s.tone} aria-hidden="true" />
            {s.label} · {s.tone === "players" ? "at least a screen" : `${fmt(s.to - s.from)} ${s.to - s.from === 1 ? "screen" : "screens"}`}
          </li>
        ))}
      </ul>
    </figure>
  );
}
