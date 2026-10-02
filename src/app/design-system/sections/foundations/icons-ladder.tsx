"use client";

// The ladder specimen: six sizes, each drawing the same six icons, measured by the kit's SizeLadder.
// The Keylines toggle lays lucide's 24-unit grid over every icon: the 2-unit padding square, the
// 20-unit circle and 18-unit square keylines, and a line every 4 units.
import type { LucideIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Icon, renderedStroke } from "@/components/design-system/Icon";
import { ICON_STROKE, type IconSize } from "@/components/design-system/tokens";
import { LADDER_SET, LADDER_SIZES } from "./icons-set";
import styles from "./icons.module.css";

const Keylines = createContext(false);
const GRID = [4, 8, 12, 16, 20];

function KeylineGrid() {
  return (
    <svg className={styles["ds-keylines"]} viewBox="0 0 24 24" aria-hidden="true">
      {GRID.map((v) => (
        <g key={v}>
          <line x1={v} y1={0} x2={v} y2={24} />
          <line x1={0} y1={v} x2={24} y2={v} />
        </g>
      ))}
      <rect className={styles["ds-keyline"]} x={2} y={2} width={20} height={20} />
      <rect className={styles["ds-keyline"]} x={3} y={3} width={18} height={18} rx={2} />
      <circle className={styles["ds-keyline"]} cx={12} cy={12} r={10} />
    </svg>
  );
}

function Glyph({ icon, size }: { icon: LucideIcon; size: IconSize }) {
  const on = useContext(Keylines);
  return (
    <span className={styles["ds-icon-cell"]} style={{ width: size, height: size }}>
      <Icon icon={icon} size={size} />
      {on && <KeylineGrid />}
    </span>
  );
}

function Column({ size }: { size: IconSize }) {
  return (
    <div className={styles["ds-icon-col"]}>
      <div className={styles["ds-icon-set"]}>
        {LADDER_SET.map((g) => (
          <Glyph key={g.name} icon={g.icon} size={size} />
        ))}
      </div>
      <p className={styles["ds-icon-stroke"]}>
        {ICON_STROKE[size]} · {renderedStroke(size).toFixed(2)}px
      </p>
    </div>
  );
}

export function IconLadder() {
  const [on, setOn] = useState(false);
  return (
    <Keylines.Provider value={on}>
      <div className={styles["ds-icon-tools"]}>
        <button type="button" className="ds-btn ds-btn--line" aria-pressed={on} onClick={() => setOn((v) => !v)}>
          Keylines
        </button>
      </div>
      <SizeLadder
        label="Icon sizes, each with its stroke"
        sizes={LADDER_SIZES.map((px) => ({ name: String(px), spec: px, node: <Column size={px} />, select: "svg" }))}
      />
    </Keylines.Provider>
  );
}
