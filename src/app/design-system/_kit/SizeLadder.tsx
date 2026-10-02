"use client";

// Each size rendered, then measured. The rendered box is read from its layout size (transforms such as
// a hover scale do not count) and printed beside the spec, "sm · spec 32 · measured 32.0". A size that
// drifts from its token prints the wrong number in red, in plain sight. The specimens stand on one
// hairline, so their heights read against each other.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, type Ground } from "./Canvas";

export type LadderRung = {
  /** the size's name, "sm" */
  name: string;
  /** the written size in px */
  spec: number;
  /** the rendered size */
  node: ReactNode;
  /** what to measure inside the rung (its first element by default) */
  select?: string;
};

export type SizeLadderProps = {
  sizes: readonly LadderRung[];
  /** which side the spec names (height by default) */
  axis?: "height" | "width";
  ground?: Ground;
  /** names the ladder as a group */
  label?: string;
  /** the drift that still reads as equal, px */
  tolerance?: number;
};

function Rung({ rung, axis, tolerance }: { rung: LadderRung; axis: "height" | "width"; tolerance: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [got, setGot] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    const target = el && (rung.select ? el.querySelector(rung.select) : el.firstElementChild);
    if (!target) return;
    const ro = new ResizeObserver(([e]) => {
      const s = e.borderBoxSize?.[0];
      const v = s ? (axis === "height" ? s.blockSize : s.inlineSize) : e.target.getBoundingClientRect()[axis];
      setGot(Math.round(v * 10) / 10);
    });
    ro.observe(target, { box: "border-box" });
    return () => ro.disconnect();
  }, [rung.select, axis]);

  const drift = got !== null && Math.abs(got - rung.spec) > tolerance;
  return (
    <div className="ds-ladder-rung">
      <div ref={box} className="ds-ladder-spec">
        {rung.node}
      </div>
      <p className={drift ? "ds-label ds-ladder-drift" : "ds-label"}>
        {rung.name} · spec {rung.spec} · measured {got === null ? "…" : got.toFixed(1)}
        {drift && <span className="ds-sr"> (drifts from the spec)</span>}
      </p>
    </div>
  );
}

export function SizeLadder({ sizes, axis = "height", ground = "page", label, tolerance = 0.05 }: SizeLadderProps) {
  return (
    <Canvas ground={ground} label={label}>
      <div className="ds-ladder">
        {sizes.map((r) => (
          <Rung key={r.name} rung={r} axis={axis} tolerance={tolerance} />
        ))}
      </div>
    </Canvas>
  );
}
