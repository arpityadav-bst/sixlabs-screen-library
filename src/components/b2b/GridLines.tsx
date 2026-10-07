"use client";

// The hero's ground: fine grid lines on square cells, strongest through the middle and fading out evenly in
// every direction (an ellipse of the hero's own shape), with one line down the middle on the model's line.
// Only in the open space: every element marked data-grid-clear (the stage, the numbers, the copy) clears the
// grid under it, feathered off round its box (over CLEAR px, or the attribute's own value), so the lines show
// only between things; the feather eases in slowly, so the lines rise out of the open space with no edge.
// Drawn once per size on a plain canvas, each cell edge at the strength of its own midpoint (a CSS grid could
// not fade without a mask, which the SixLabs pages do not carry on an animated page), so it costs nothing
// while the page runs.
import { useEffect, useRef } from "react";

const CELL = 56; // px
const INK = "10, 27, 51";
const ALPHA = 0.05; // at full strength
const CLEAR = 28; // px of feather round a cleared box

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

export function GridLines({ ink = INK }: { ink?: string }) {
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
      ctx.lineWidth = 1;
      // the boxes to keep clear, in the canvas's own coordinates
      const box = c.getBoundingClientRect();
      const host = c.closest("section") ?? c.parentElement;
      const clear = [...(host?.querySelectorAll("[data-grid-clear]") ?? [])].map((el) => {
        const r = el.getBoundingClientRect();
        const f = Number(el.getAttribute("data-grid-clear")) || CLEAR;
        return [r.left - box.left, r.top - box.top, r.right - box.left, r.bottom - box.top, f];
      });
      // the fade: full inside the middle, nothing by the ellipse's rim, and nothing on or near a cleared box
      const at = (x: number, y: number) => {
        const d = Math.hypot((x - w / 2) / (w / 2), (y - h * 0.45) / (h * 0.55));
        let open = 1;
        for (const [l, t, r, b, f] of clear) open = Math.min(open, smooth(0, f, Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b))) ** 2);
        return ALPHA * (1 - smooth(0.25, 1, d)) * open;
      };
      const x0 = (w / 2) % CELL, y0 = (h * 0.45) % CELL, half = CELL / 4;
      const seg = (ax: number, ay: number, bx: number, by: number) => {
        const a = at((ax + bx) / 2, (ay + by) / 2);
        if (a < 0.003) return;
        ctx.strokeStyle = `rgba(${ink}, ${a.toFixed(4)})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      };
      // in quarter-cell pieces, so the feather round a cleared box follows it closely
      for (let x = x0; x <= w; x += CELL) {
        const px = Math.round(x) + 0.5;
        for (let y = y0 - CELL; y < h; y += half) seg(px, y, px, y + half);
      }
      for (let y = y0; y <= h; y += CELL) {
        const py = Math.round(y) + 0.5;
        for (let x = x0 - CELL; x < w; x += half) seg(x, py, x + half, py);
      }
    };
    // again whenever the layout under it moves (the copy's type arriving, the entrance's rise settling)
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    (c.closest("section") ?? c.parentElement)?.querySelectorAll("[data-grid-clear]").forEach((el) => ro.observe(el));
    document.fonts.ready.then(draw);
    const settled = window.setTimeout(draw, 1700); // once the entrance has put everything in its place
    return () => {
      ro.disconnect();
      window.clearTimeout(settled);
    };
  }, [ink]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 block h-full w-full" />;
}
