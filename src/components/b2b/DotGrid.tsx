"use client";

// The hero's dot grid: tiny dots on a wide, even grid, quiet behind everything, fading out evenly toward the
// sides and down into the page's white at the foot. Centred so one column runs down the middle, on the
// model's line. Drawn once per size on a plain canvas (a CSS dot pattern could not fade without a mask, which
// the SixLabs pages do not carry on an animated page), so it costs nothing while the page runs.
import { useEffect, useRef } from "react";

const GAP = 28; // px between dots
const R = 1.05; // dot radius, px
const INK = "11, 11, 13";
const ALPHA = 0.11; // at full strength

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

export function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const draw = () => {
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!w || !h) return;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const x0 = (w / 2) % GAP, edge = Math.min(260, w * 0.18);
      for (let y = GAP / 2; y < h; y += GAP) {
        const fy = 1 - smooth(h * 0.55, h * 0.97, y); // down into the white
        if (fy <= 0) continue;
        for (let x = x0; x < w; x += GAP) {
          const a = ALPHA * fy * smooth(0, edge, x) * smooth(0, edge, w - x);
          if (a < 0.004) continue;
          ctx.fillStyle = `rgba(${INK}, ${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 block h-full w-full" />;
}
