"use client";

// The hero's field as the drum's own ground: a pale sky, a floor a shade deeper, and between them a horizon that
// curves as the stage does, seen on the inside of the same drum (twin-drum.ts): at the stage's foot in the middle,
// bowing down toward the ends as the rows and lanes do, with the faintest contact shadow under the middle. Drawn
// once per size on a canvas in narrow columns, each with its own gradient set on the horizon's height there, so
// the light follows the curve. Measured against the stage's box ([data-stage]).
import { useEffect, useRef } from "react";
import { EDGE_A, EDGE_K, K } from "./twin-drum";

const SKY = ["#fafbfc", "#f5f6f8"], HORIZON = "#f1f2f5", FLOOR = ["#edeff2", "#f2f3f5"], FOOT = "#f6f7f8";

export function HorizonField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    const sec = c?.closest("section");
    if (!c || !ctx || !sec) return;
    const draw = () => {
      const stage = sec.querySelector("[data-stage]");
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!w || !h || !stage) return;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const a = sec.getBoundingClientRect(), b = stage.getBoundingClientRect();
      // the drum, as the stage draws it: its middle height, its radius, and the bottom row's feet below the middle
      const cy = b.top - a.top + b.height / 2, cx = w / 2, R = w / 2 / (Math.sin(EDGE_A) * EDGE_K);
      const d = (b.height - 16) / (2 * EDGE_K) + 6;
      // the horizon's height at a screen x: walked round the drum, then read off by x
      const xs: number[] = [], ys: number[] = [];
      for (let ang = -1.7; ang <= 1.7; ang += 0.01) {
        xs.push(cx + R * Math.sin(ang) * K(ang));
        ys.push(cy + d * K(ang));
      }
      const yAt = (x: number) => {
        let i = 1;
        while (i < xs.length - 1 && xs[i] < x) i++;
        const t = Math.min(1, Math.max(0, (x - xs[i - 1]) / (xs[i] - xs[i - 1] || 1)));
        return ys[i - 1] + (ys[i] - ys[i - 1]) * t;
      };
      const STRIP = 4, band = h * 0.22, stop = (y: number) => Math.min(1, Math.max(0, y / h));
      for (let x = 0; x < w; x += STRIP) {
        const y = yAt(x + STRIP / 2);
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, SKY[0]);
        g.addColorStop(stop(y - band), SKY[1]);
        g.addColorStop(stop(y), HORIZON);
        g.addColorStop(stop(y + h * 0.03), FLOOR[0]);
        g.addColorStop(stop(y + band), FLOOR[1]);
        g.addColorStop(1, FOOT);
        ctx.fillStyle = g;
        ctx.fillRect(x, 0, STRIP + 0.5, h);
      }
      // the faintest contact shadow, under the middle of the drum's foot
      const y0 = yAt(cx);
      ctx.save();
      ctx.translate(cx, y0);
      ctx.scale(1, 0.18);
      const s = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.34);
      s.addColorStop(0, "rgba(10, 27, 51, 0.035)");
      s.addColorStop(1, "rgba(10, 27, 51, 0)");
      ctx.fillStyle = s;
      ctx.fillRect(-w, -w, 2 * w, 2 * w);
      ctx.restore();
    };
    const ro = new ResizeObserver(draw);
    ro.observe(sec);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 block h-full w-full" />;
}
