"use client";

// Between the scroll line and the players, the accent blue rises up the view and takes it over. It rises
// with the scroll over the last stretch of the scroll line's track (WAVE_VH of a screen, a few scrolls),
// while that section is still pinned, so it comes up over it; scrolling back drains it. Its leading edge
// is one arc (higher in the middle) of wide halftone: far from the blue the dots are tiny and faint, and
// nearer it they grow and strengthen, continuously, until they touch and merge into the solid colour. It
// sits above the scroll line and below the players section and the header. When the view is full it
// announces it (window event "accentwave", detail { filled }); the players section waits for that.
import { useEffect, useRef } from "react";
import { WAVE_VH } from "./ScrubLine";

const ACCENT = [26, 109, 255];
const ARC = 90; // how much higher the middle of the edge is than its ends, px
const BAND = 480; // depth of the halftone above the solid colour, px
const GRAIN = 0.07; // noise strength on the blue
const PITCH = 6; // halftone grid, px; a dot of radius PITCH / 2 touches its neighbours

export function AccentWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current,
      line = document.getElementById("model-line");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !line) return;
    let p = 0,
      raf = 0,
      filled = false,
      w = 0,
      h = 0;
    const fill = `rgb(${ACCENT.join(",")})`;
    // Film-grain noise laid over the blue (dots included): one tile of random light and dark pixels,
    // repeated, at GRAIN strength.
    const grainTile = document.createElement("canvas");
    grainTile.width = grainTile.height = 160;
    const gctx = grainTile.getContext("2d");
    if (gctx) {
      const img = gctx.createImageData(160, 160);
      for (let k = 0; k < img.data.length; k += 4) {
        const v = Math.random() * 255;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
        img.data[k + 3] = 255;
      }
      gctx.putImageData(img, 0, 0);
    }
    const grain = ctx.createPattern(grainTile, "repeat");

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

    const draw = () => {
      raf = 0;
      if (p < 1) announce(false);
      ctx.clearRect(0, 0, w, h);
      // the level runs from below the view, halftone included (p 0), up until the solid covers it (p 1)
      // p 1 is the moment the solid colour covers the view (its lowest points, the arc's ends, reach the
      // top): that is when it reads as full, so that is when it announces it
      const level = h + BAND - p * (h + BAND + ARC + PITCH * 3);
      if (p > 0) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(0, h);
        // the solid colour starts a little under the edge; the grown dots cover the seam between
        for (let x = 0; x <= w; x += 12)
          ctx.lineTo(x, edge(x, level) + PITCH * 2);
        ctx.lineTo(w, edge(w, level) + PITCH * 2);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
        // halftone above the edge: s runs 0 (top of the band) to 1 (at the edge). The dots keep growing
        // past touching (radius PITCH / 2) to covering their whole cell (PITCH * 0.72, over half the
        // diagonal) and carry on a few rows under the edge, so they melt into the solid with no seam.
        for (let gx = PITCH / 2; gx < w; gx += PITCH) {
          const e = edge(gx, level);
          for (
            let gy = Math.floor((e - BAND) / PITCH) * PITCH + PITCH / 2;
            gy < e + PITCH * 3;
            gy += PITCH
          ) {
            const s = Math.min(1, 1 - (e - gy) / BAND);
            if (s <= 0 || gy < -PITCH || gy > h + PITCH) continue;
            ctx.globalAlpha = Math.min(1, 0.15 + s * 0.95);
            ctx.beginPath();
            ctx.arc(
              gx,
              gy,
              0.35 + (PITCH * 0.72 - 0.35) * s ** 1.4,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        // the grain, only where the blue already is
        if (grain) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.globalAlpha = GRAIN;
          ctx.fillStyle = grain;
          ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = fill;
        }
        ctx.globalAlpha = 1;
      }
      if (p >= 1) announce(true);
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
      // the rise runs over the last WAVE_VH of the scroll line's track, while its stage is still pinned
      const end =
        line.getBoundingClientRect().top +
        window.scrollY +
        line.offsetHeight -
        h;
      p = Math.min(
        1,
        Math.max(0, (window.scrollY - (end - WAVE_VH * h)) / (WAVE_VH * h)),
      );
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
