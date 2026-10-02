"use client";

// The ground a part ships on, so each part is judged where it lives rather than on the guide's white.
// "grain" is the site's own .page-grain class. "on-blue" is #1a6dff under the water's 160px grey noise tile
// at 7% alpha (noise-tile.ts, the same grain AccentWave draws, alpha only, no blend). isolateKeys
// stops keydown at the canvas, so typing in a specimen never reaches window listeners (the floor resets on R).
import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useGrain } from "./noise-tile";

export type Ground =
  | "page"
  | "surface"
  | "container"
  | "footer"
  | "grain"
  | "on-blue"
  /** the plan's name for the on-blue ground, kept as an alias */
  | "accent"
  | "navy"
  | "terminal";

export type CanvasLayout = "flow" | "grid" | "stack" | "bleed";

export type CanvasProps = {
  ground?: Ground;
  layout?: CanvasLayout;
  /** min-height 320 */
  tall?: boolean;
  /** any other floor, in px (grain already holds 480) */
  minHeight?: number;
  isolateKeys?: boolean;
  /** names the canvas as a group for assistive tech */
  label?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const stopKeys = (e: KeyboardEvent<HTMLDivElement>) => e.stopPropagation();

export function Canvas({
  ground = "page",
  layout = "flow",
  tall,
  minHeight,
  isolateKeys,
  label,
  className,
  style,
  children,
}: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const g = ground === "accent" ? "on-blue" : ground;
  useGrain(ref, g === "on-blue");

  const cls = [
    "ds-canvas",
    `ds-canvas--${g}`,
    `ds-canvas--${layout}`,
    tall ? "ds-canvas--tall" : "",
    g === "grain" ? "page-grain" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={cls}
      style={minHeight ? { ...style, minHeight } : style}
      role={label ? "group" : undefined}
      aria-label={label}
      onKeyDown={isolateKeys ? stopKeys : undefined}
    >
      {children}
    </div>
  );
}
