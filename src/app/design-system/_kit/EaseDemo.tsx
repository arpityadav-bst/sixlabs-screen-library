"use client";

// An easing, drawn and run. The plot is a 120 by 80 curve of progress over time (a spring is simulated
// with its own stiffness, damping and mass, so its overshoot shows). Run sends a 12px navy dot along a
// 240px track through motion's animate with the same curve, duration or spring, so the dot moves as the
// site's parts do. "glide" is the real easeOut exported by @/components/website/glide.
import { animate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { easeOut } from "@/components/website/glide";

export type Bezier = readonly [number, number, number, number];
export type SpringEase = { stiffness: number; damping: number; mass?: number };
export type EaseInput = Bezier | SpringEase | "glide" | "linear" | ((t: number) => number);

export type EaseDemoProps = {
  /** the curve's name, "out" */
  label: string;
  ease: EaseInput;
  /** seconds. A spring settles in its own time. */
  duration?: number;
  /** a mono fact line. By default it prints the curve and the duration. */
  caption?: ReactNode;
};

const W = 120;
const H = 80;
const TRACK = 240;

/** A CSS cubic-bezier as y(x), by Newton steps with a bisection fallback. */
export function cubicBezier([x1, y1, x2, y2]: Bezier): (x: number) => number {
  const bx = (t: number) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t: number) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  const dx = (t: number) => 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
  return (x) => {
    if (x <= 0 || x >= 1) return x <= 0 ? 0 : 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (bx(t) - x) / d;
    }
    if (t < 0 || t > 1 || Math.abs(bx(t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      for (let i = 0; i < 40; i++) {
        t = (lo + hi) / 2;
        if (bx(t) < x) lo = t;
        else hi = t;
      }
    }
    return by(t);
  };
}

/** A spring from 0 to 1, sampled at 240Hz until it rests: [samples, seconds]. */
function springSamples({ stiffness, damping, mass = 1 }: SpringEase): [number[], number] {
  const dt = 1 / 240;
  let x = 0;
  let v = 0;
  const out = [0];
  for (let i = 0; i < 240 * 10; i++) {
    v += ((-stiffness * (x - 1) - damping * v) / mass) * dt;
    x += v * dt;
    out.push(x);
    if (i > 24 && Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
  }
  return [out, (out.length - 1) * dt];
}

const isSpring = (e: EaseInput): e is SpringEase => typeof e === "object" && "stiffness" in e;

function easeFn(e: Exclude<EaseInput, SpringEase>): (t: number) => number {
  if (e === "glide") return easeOut;
  if (e === "linear") return (t) => t;
  if (typeof e === "function") return e;
  return cubicBezier(e);
}

function describe(e: EaseInput, duration: number, settle: number): string {
  if (isSpring(e)) return `spring ${e.stiffness} / ${e.damping} / ${e.mass ?? 1} · settles ${settle.toFixed(2)}s`;
  const curve =
    e === "glide" ? "easeOut 1 - (1 - k)^3" : e === "linear" ? "linear" : typeof e === "function" ? "custom" : `cubic-bezier(${e.join(", ")})`;
  return `${curve} · ${duration}s`;
}

export function EaseDemo({ label, ease, duration = 0.6, caption }: EaseDemoProps) {
  const dot = useRef<HTMLSpanElement>(null);
  const run = useRef<{ stop: () => void } | null>(null);

  const [samples, settle] = isSpring(ease)
    ? springSamples(ease)
    : [Array.from({ length: 61 }, (_, i) => easeFn(ease)(i / 60)), duration];
  const lo = Math.min(0, ...samples);
  const hi = Math.max(1, ...samples);
  const y = (v: number) => 4 + (H - 8) * (1 - (v - lo) / (hi - lo));
  const d = samples.map((v, i) => `${i ? "L" : "M"}${((i / (samples.length - 1)) * W).toFixed(2)},${y(v).toFixed(2)}`).join("");

  useEffect(() => () => run.current?.stop(), []);

  const play = () => {
    const el = dot.current;
    if (!el) return;
    run.current?.stop();
    const options = isSpring(ease)
      ? { type: "spring" as const, stiffness: ease.stiffness, damping: ease.damping, mass: ease.mass ?? 1 }
      : { duration, ease: Array.isArray(ease) ? [...ease] : easeFn(ease as Exclude<EaseInput, SpringEase>) };
    run.current = animate(el, { x: [0, TRACK] }, options as Parameters<typeof animate>[2]);
  };

  return (
    <figure className="ds-ease">
      <div className="ds-ease-head">
        <span className="ds-ease-name">{label}</span>
        <button type="button" className="ds-btn ds-btn--line" aria-label={`Run ${label}`} onClick={play}>
          Run
        </button>
      </div>
      <div className="ds-ease-body">
        <svg className="ds-ease-plot" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <line className="ds-ease-guide" x1="0" y1={y(0)} x2={W} y2={y(0)} />
          <line className="ds-ease-guide" x1="0" y1={y(1)} x2={W} y2={y(1)} />
          <path className="ds-ease-curve" d={d} />
        </svg>
        <span className="ds-ease-track" aria-hidden="true">
          <span ref={dot} className="ds-ease-dot" />
        </span>
      </div>
      <figcaption className="ds-label">{caption ?? describe(ease, duration, settle)}</figcaption>
    </figure>
  );
}
