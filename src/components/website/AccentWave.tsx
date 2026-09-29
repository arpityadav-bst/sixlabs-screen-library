"use client";

// Between the scroll line and the players, the accent blue rises up the view and takes it over. Once the
// scroll line releases the screen (its track ends), it plays up from the bottom on its own (RISE_S), and
// drains back down if the page is scrolled back above that point. Its leading edge is one arc (higher in
// the middle) of halftone: far from the blue the dots are tiny and faint, and nearer it they grow and
// strengthen, continuously, until they touch and merge into the solid colour. It sits above the scroll
// line (covering it) and below the players section and the header, which come in on top of it. When the
// view is full it announces it (window event "accentwave", detail { filled }); the players section waits
// for that. Drawn on one canvas, only while it moves.
import { useEffect, useRef } from "react";

const ACCENT = [26, 109, 255];
const ARC = 90; // how much higher the middle of the edge is than its ends, px
const BAND = 220; // depth of the halftone above the solid colour, px
const PITCH = 6; // halftone grid, px; a dot of radius PITCH / 2 touches its neighbours
const RISE_S = 1.2; // seconds to fill the view (and to drain it)

export function AccentWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current,
      line = document.getElementById("model-line");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !line) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = 0,
      target = 0,
      raf = 0,
      last = 0,
      filled = false,
      w = 0,
      h = 0;
    const fill = `rgb(${ACCENT.join(",")})`;

    const announce = (on: boolean) => {
      if (on === filled) return;
      filled = on;
      window.dispatchEvent(
        new CustomEvent("accentwave", { detail: { filled: on } }),
      );
    };
    // the edge's height at x for a given level: an arc, highest in the middle
    const edge = (x: number, level: number) =>
      level + ARC * ((2 * x) / w - 1) ** 2;

    const draw = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      p = still
        ? target
        : target > p
          ? Math.min(target, p + dt / RISE_S)
          : Math.max(target, p - dt / RISE_S);
      if (p < 1) announce(false);
      ctx.clearRect(0, 0, w, h);
      // the level runs from below the view, halftone included (p 0), to above it, arc included (p 1)
      const level = h + BAND - p * (h + BAND * 2 + ARC);
      if (p > 0) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, edge(x, level));
        ctx.lineTo(w, edge(w, level));
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
        // halftone above the edge: s runs 0 (top of the band) to 1 (at the colour)
        for (let gx = PITCH / 2; gx < w; gx += PITCH) {
          const e = edge(gx, level);
          for (
            let gy = Math.floor((e - BAND) / PITCH) * PITCH + PITCH / 2;
            gy < e;
            gy += PITCH
          ) {
            const s = 1 - (e - gy) / BAND;
            if (s <= 0 || gy < -PITCH || gy > h + PITCH) continue;
            ctx.globalAlpha = Math.min(1, 0.15 + s * 0.95);
            ctx.beginPath();
            ctx.arc(
              gx,
              gy,
              0.35 + (PITCH / 2 - 0.35) * s ** 1.4,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
      if (p >= 1) announce(true);
      if (p !== target) raf = requestAnimationFrame(draw);
      else last = 0;
    };
    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== window.innerWidth || h !== window.innerHeight) {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const release =
        line.getBoundingClientRect().top +
        window.scrollY +
        line.offsetHeight -
        h;
      target = window.scrollY > release + 20 ? 1 : 0;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
}
