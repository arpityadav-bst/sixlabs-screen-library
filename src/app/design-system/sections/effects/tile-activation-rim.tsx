// The rim of an activated tile, drawn by the guide on the slab's navy: the top face as the camera sees
// it (front corner down), the beam's lit front edges and faint back edges, the hot spot, the flare and
// the glint, numbered as the rows under it. A fixed 360px figure that scrolls in its own box when narrower.
import { RIM_COLOURS } from "./tile-activation-data";
import s from "./floor.module.css";

const WHITE_SOFT = "rgb(255 255 255 / 0.72)";
const LINE = "rgb(255 255 255 / 0.4)";

type Disc = { n: number; x: number; y: number; from: [number, number]; to: [number, number] };

const DISCS: readonly Disc[] = [
  { n: 1, x: 180, y: 242, from: [180, 214], to: [180, 232] },
  { n: 2, x: 22, y: 164, from: [112, 164], to: [32, 164] },
  { n: 3, x: 338, y: 124, from: [312, 124], to: [328, 124] },
  { n: 4, x: 338, y: 62, from: [246, 82], to: [328, 64] },
  { n: 5, x: 22, y: 66, from: [150, 66], to: [32, 66] },
];

export function RimDiagram() {
  const { beam, hot, ring, fill } = RIM_COLOURS;
  return (
    <div className={s["ds-dg-scroll"]}>
      <svg
        className={s["ds-dg"]}
        width={360}
        height={264}
        viewBox="0 0 360 264"
        role="img"
        aria-label="An activated tile's top face: the beam lights the two front edges from the front corner to the side corners, then runs faint along the back edges. A hot spot sits at the front corner, a flare at the right corner, the glint near the rear corner."
      >
        <path d="M180 44 L300 124 L180 204 L60 124 Z" fill="rgb(255 255 255 / 0.04)" stroke={LINE} strokeWidth={1} />
        <path d="M60 124 L180 44 L300 124" fill="none" stroke={beam} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="5 5" />
        <path d="M60 124 L180 204 L300 124" fill="none" stroke={beam} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={180} cy={66} rx={28} ry={7} fill={fill} stroke={ring} strokeWidth={2} />
        <circle cx={180} cy={204} r={9} fill={hot} />
        <circle cx={300} cy={124} r={7} fill={hot} />
        <text x={196} y={226} fontSize={12} fill={WHITE_SOFT} className={s["ds-dg-mono"]}>
          u +0.92
        </text>
        <text x={268} y={148} fontSize={12} fill={WHITE_SOFT} className={s["ds-dg-mono"]}>
          u 0
        </text>
        <text x={196} y={34} fontSize={12} fill={WHITE_SOFT} className={s["ds-dg-mono"]}>
          u -0.92
        </text>
        {DISCS.map((d) => (
          <g key={d.n}>
            <line x1={d.from[0]} y1={d.from[1]} x2={d.to[0]} y2={d.to[1]} stroke={LINE} strokeWidth={1} />
            <circle cx={d.x} cy={d.y} r={9} fill="#ffffff" />
            <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0a152d">
              {d.n}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
