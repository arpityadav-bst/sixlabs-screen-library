// The bust decal on one tile, drawn by the guide in plan view at 200px to the tile: the rounded tile, the
// real bust picture laid on it as the engine lays it (turned 45 degrees, stretched along the diagonal,
// pushed toward the camera corner, clipped to the tile) and the plane's full outline, numbered as the rows
// under it. Every size comes from floor-params.json.
import { FP } from "./floor-params-data";
import s from "./floor.module.css";

const U = 200; // px per tile unit
const C = 170; // the tile's centre
const NAVY = "#0a152d";
const MUTED = "#475569";

export function DecalDiagram({ picture }: { picture: string }) {
  const half = (FP.tile / 2) * U;
  const r = FP.radius * FP.tile * U;
  const inset = FP.charInset * U;
  const across = FP.charSize * U;
  const along = FP.charSize * FP.charStretch * U;
  const push = FP.charForward * U * Math.SQRT1_2; // the same split as characters.js:131
  const cx = C + push;
  const plane = `translate(${cx} ${cx}) rotate(-45)`;
  const box = { x: -across / 2, y: -along / 2, width: across, height: along };
  const disc = (n: number, x: number, y: number, tx: number, ty: number) => (
    <g key={n}>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={NAVY} strokeOpacity={0.4} strokeWidth={1} />
      <circle cx={x} cy={y} r={9} fill={NAVY} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ffffff">
        {n}
      </text>
    </g>
  );
  return (
    <div className={s["ds-dg-scroll"]}>
      <svg
        className={s["ds-dg"]}
        width={340}
        height={340}
        viewBox="0 0 340 340"
        role="img"
        aria-label="One tile in plan view: the bust picture turned 45 degrees with its head to the rear corner, stretched along the diagonal, pushed toward the camera corner and clipped to the tile's rounded outline."
      >
        <defs>
          <clipPath id="ds-decal-clip">
            <rect x={C - half + inset} y={C - half + inset} width={2 * (half - inset)} height={2 * (half - inset)} rx={r} />
          </clipPath>
        </defs>
        <rect x={C - half} y={C - half} width={2 * half} height={2 * half} rx={r} fill={FP.topColor} stroke={NAVY} strokeWidth={1.5} />
        <g clipPath="url(#ds-decal-clip)">
          <g transform={plane}>
            <image href={picture} {...box} preserveAspectRatio="none" />
          </g>
        </g>
        <g transform={plane}>
          <rect {...box} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
        </g>
        <line x1={C - half} y1={C - half} x2={C + half} y2={C + half} stroke={MUTED} strokeWidth={1} strokeDasharray="2 4" />
        <line x1={C} y1={C} x2={cx} y2={cx} stroke={NAVY} strokeWidth={2} />
        <circle cx={C} cy={C} r={3} fill={NAVY} />
        <text x={14} y={56} fontSize={12} fill={MUTED}>
          rear corner
        </text>
        <text x={336} y={332} textAnchor="end" fontSize={12} fill={MUTED}>
          camera corner
        </text>
        {disc(1, 318, 92, C + half + 1, 108)}
        {disc(2, 22, 196, 41, 171)}
        {disc(3, 232, 128, cx - 2, cx - 2)}
      </svg>
    </div>
  );
}
