// The glide's length against the distance it covers: min(2.2, 0.9 + distance / 4000) seconds, plotted
// from 0 to 8000px. It climbs a second for every 4000px and flattens at 2.2s from 5200px.
import { GLIDE_TICKS, glideSeconds } from "./_data/choreography";
import styles from "./motion.module.css";

const VW = 560;
const VH = 200;
const L = 44; // room for the seconds
const B = 28; // room for the distances
const T = 12;
const R = 16;
const MAX_PX = 8000;
const MAX_S = 2.4;

const x = (px: number) => L + (px / MAX_PX) * (VW - L - R);
const y = (s: number) => T + (1 - s / MAX_S) * (VH - T - B);

const POINTS = Array.from({ length: 81 }, (_, i) => (i / 80) * MAX_PX);
const PATH = POINTS.map((px, i) => `${i ? "L" : "M"}${x(px).toFixed(1)},${y(glideSeconds(px)).toFixed(1)}`).join("");
const SECONDS = [0, 0.9, 1.4, 1.9, 2.2];

export function GlidePlot() {
  return (
    <svg
      className={styles["ds-mo-plot"]}
      viewBox={`0 0 ${VW} ${VH}`}
      role="img"
      aria-label="Glide length over distance: 0.9s at 0px, 1.4s at 2000px, 1.9s at 4000px, 2.2s from 5200px on"
    >
      {SECONDS.map((s) => (
        <g key={s}>
          <line className={styles["ds-mo-plot-grid"]} x1={L} x2={VW - R} y1={y(s)} y2={y(s)} />
          <text x={L - 8} y={y(s) + 4} textAnchor="end">
            {s}s
          </text>
        </g>
      ))}
      <line className={styles["ds-mo-plot-axis"]} x1={L} x2={VW - R} y1={y(0)} y2={y(0)} />
      {GLIDE_TICKS.map((px) => (
        <text key={px} x={x(px)} y={VH - 8} textAnchor={px === MAX_PX ? "end" : "middle"}>
          {px}px
        </text>
      ))}
      <path className={styles["ds-mo-plot-line"]} d={PATH} />
      {GLIDE_TICKS.slice(0, 4).map((px) => (
        <circle key={px} className={styles["ds-mo-plot-dot"]} cx={x(px)} cy={y(glideSeconds(px))} r={3} />
      ))}
    </svg>
  );
}
