"use client";

// The Try now button's dot band (PrimaryCta.tsx): a band DOT_BAND wide with curved sides (each a quadratic
// from the pill's top edge to its foot, bowed as the pill's end at that point is), crossing left to right as
// the sweep runs (t), soft at its sides, and showing a dot matrix (#9cc0ff, radius 0.95 px on a 3.5 px grid)
// at the sweep's opacity. It was an SVG pattern seen through a mask blurred with feGaussianBlur (5 px), redrawn
// every frame of the sweep: a filter and a mask on screen, which Safari draws on the processor and which
// stop Chrome on a Mac from handing its frames to the system as they are. It is drawn here on a small canvas,
// the same dots, each at the mask's value at its centre, worked out from the same blur (a 5 px Gaussian across
// the band's two sides, and at the pill's top and foot) instead of rendered through one.
import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

const PITCH = 3.5,
  R = 0.95,
  BLUR = 5,
  COLOUR = "#9cc0ff",
  LEVELS = 64; // opacity steps the dots are batched in (a step is 1/64 of the band's peak, unseen)

// the standard normal's cumulative distribution: how much of a Gaussian blur of an edge has crossed x
function phi(x: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x / Math.SQRT2));
  const e = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
  return x < 0 ? (1 - e) / 2 : (1 + e) / 2;
}

export function CtaDots({
  t,
  opacity,
  size,
  band,
}: {
  t: MotionValue<number>;
  opacity: MotionValue<number>;
  size: { w: number; h: number };
  band: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current,
      ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const { w, h } = size,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    let raf = 0;
    const draw = () => {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const p = t.get(),
        op = opacity.get();
      if (op <= 0.001 || p < 0) return;
      // the band's sides at progress p (PrimaryCta's dotBand): x at the top, and how far each bows
      const side = (dx: number) => {
        const x = -h / 2 + p * (w + h) + dx;
        return [x, h * (1 - 2 * Math.min(1, Math.max(0, x / w)))];
      };
      const [xl, bl] = side(-band / 2),
        [xr, br] = side(band / 2);
      const reach = Math.max(Math.abs(bl), Math.abs(br)) / 2 + BLUR * 3;
      const paths = Array.from({ length: LEVELS + 1 }, () => new Path2D());
      const used = new Set<number>();
      for (let cx = PITCH / 2; cx < w + PITCH; cx += PITCH) {
        if (cx < xl - reach || cx > xr + reach) continue;
        for (let cy = PITCH / 2; cy < h + PITCH; cy += PITCH) {
          const k = (cy + 2) / (h + 4),
            bow = 2 * k * (1 - k); // the quadratic's pull toward its control point at this height
          const across = phi((cx - (xl - bl * bow)) / BLUR) - phi((cx - (xr - br * bow)) / BLUR);
          const down = phi((cy + 2) / BLUR) - phi((cy - h - 2) / BLUR);
          const level = Math.round(op * across * down * LEVELS);
          if (level <= 0) continue;
          paths[level].moveTo(cx + R, cy);
          paths[level].arc(cx, cy, R, 0, Math.PI * 2);
          used.add(level);
        }
      }
      ctx.fillStyle = COLOUR;
      for (const level of used) {
        ctx.globalAlpha = level / LEVELS;
        ctx.fill(paths[level]);
      }
      ctx.globalAlpha = 1;
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const offT = t.on("change", ask),
      offO = opacity.on("change", ask);
    draw();
    return () => {
      offT();
      offO();
      cancelAnimationFrame(raf);
    };
  }, [t, opacity, size, band]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
