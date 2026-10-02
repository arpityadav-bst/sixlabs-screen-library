// The tile's state machine, drawn by the guide: four states on one row, resetting under them, an arrow
// per transition. Activated is filled navy, the system's one state fill. It scrolls sideways in its own
// box under 912px, so its 12px labels never shrink.
import s from "./floor.module.css";

type Node = { id: string; x: number; y: number; fill?: boolean };

const W = 132;
const H = 44;
const NODES: readonly Node[] = [
  { id: "default", x: 24, y: 50 },
  { id: "focused", x: 268, y: 50 },
  { id: "activated", x: 512, y: 50, fill: true },
  { id: "spent", x: 756, y: 50 },
  { id: "resetting", x: 390, y: 178 },
];

type Edge = { d: string; label: string; lx: number; ly: number };

const EDGES: readonly Edge[] = [
  { d: "M156 64 H264", label: "hover", lx: 210, ly: 54 },
  { d: "M268 86 Q212 122 160 88", label: "pointer leaves", lx: 212, ly: 128 },
  { d: "M400 72 H508", label: "click, locked", lx: 454, ly: 62 },
  { d: "M644 72 H752", label: "S ≥ 0.9, fade 1", lx: 698, ly: 62 },
  { d: "M822 94 V200 H526", label: "R, the wave or reset()", lx: 672, ly: 192 },
  { d: "M390 200 H90 V98", label: "lands default, new human", lx: 240, ly: 192 },
];

const INK = "#0a1b33";
const NAVY = "#0a152d";
const MUTED = "#475569";

export function StateMachine() {
  return (
    <div className={s["ds-dg-scroll"]}>
      <svg
        className={s["ds-dg"]}
        width={912}
        height={240}
        viewBox="0 0 912 240"
        role="img"
        aria-label="Tile states: default to focused on hover, back when the pointer leaves, focused to activated on click, activated to spent at S 0.9, spent through resetting back to default"
      >
        <defs>
          <marker id="ds-ts-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={NAVY} />
          </marker>
        </defs>
        {EDGES.map((e) => (
          <g key={e.label}>
            <path d={e.d} fill="none" stroke={NAVY} strokeWidth={1.5} markerEnd="url(#ds-ts-arrow)" />
            <text x={e.lx} y={e.ly} textAnchor="middle" fontSize={12} fill={MUTED}>
              {e.label}
            </text>
          </g>
        ))}
        {NODES.map((nd) => (
          <g key={nd.id}>
            <rect
              x={nd.x}
              y={nd.y}
              width={W}
              height={H}
              rx={H / 2}
              fill={nd.fill ? NAVY : "#ffffff"}
              stroke={NAVY}
              strokeWidth={1.5}
            />
            <text x={nd.x + W / 2} y={nd.y + 27} textAnchor="middle" fontSize={14} fontWeight={500} fill={nd.fill ? "#ffffff" : INK}>
              {nd.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
