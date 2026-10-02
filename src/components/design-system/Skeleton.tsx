// Placeholder shapes for content on its way. Each shape keeps the size of what it stands for, so the swap
// to real content shifts nothing. The shimmer moves by transform alone and stops under reduced motion.
// Shapes are aria-hidden. Wrap a composite in SkeletonGroup, which is aria-busy with a hidden label.
import type { CSSProperties, ReactNode } from "react";
import styles from "./atoms.module.css";

export type SkeletonShape = "line" | "title" | "circle" | "rect";

const SHAPE: Record<SkeletonShape, { h: number; w: string; r: string }> = {
  line: { h: 12, w: "100%", r: "var(--ds-radius-full)" },
  title: { h: 22, w: "60%", r: "var(--ds-radius-bubble)" },
  circle: { h: 40, w: "40px", r: "var(--ds-radius-full)" },
  rect: { h: 120, w: "100%", r: "var(--ds-radius-sm)" },
};

export type SkeletonProps = {
  shape?: SkeletonShape;
  /** a CSS width, or px as a number */
  width?: string | number;
  /** a CSS height, or px as a number */
  height?: string | number;
  /** a CSS radius, or px as a number */
  radius?: string | number;
  /** line only: how many lines, the last at 60% */
  lines?: number;
  /** the container grey takes a white fill */
  ground?: "light" | "container";
  className?: string;
};

const px = (v: string | number | undefined) => (typeof v === "number" ? `${v}px` : v);

export function Skeleton({ shape = "line", width, height, radius, lines = 1, ground = "light", className = "" }: SkeletonProps) {
  const s = SHAPE[shape];
  const box = (k: number, last: boolean): CSSProperties => ({
    width: px(width) ?? (shape === "line" && last && lines > 1 ? "60%" : s.w),
    height: px(height) ?? (shape === "circle" ? px(width) ?? s.h : s.h),
    borderRadius: px(radius) ?? s.r,
    marginTop: k > 0 ? 10 : undefined,
  });
  const count = shape === "line" ? Math.max(1, lines) : 1;
  return (
    <span aria-hidden className={`block ${className}`}>
      {Array.from({ length: count }, (_, k) => (
        <span key={k} data-ground={ground} className={`block ${styles["ds-skeleton"]}`} style={box(k, k === count - 1)} />
      ))}
    </span>
  );
}

export function SkeletonGroup({
  label = "Loading",
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
