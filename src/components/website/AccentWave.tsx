"use client";

// Between the scroll line and the players, the accent blue rises up the view and takes it over. It rises
// with the scroll over the last stretch of the scroll line's track (WAVE_VH of a screen, a few scrolls),
// while that section is still pinned, so it comes up over it; scrolling back drains it. Its leading edge
// is one arc (higher in the middle) of wide halftone: far from the blue the dots are tiny and faint, and
// nearer it they grow and strengthen, continuously, until they touch and merge into the solid colour. It
// sits above the scroll line and below the players section and the header. When the view is full it
// announces it (window event "accentwave", detail { filled }); the players section waits for that. Past
// the players the light page rises back from the bottom over DRAIN_VH of a screen, pushing the blue up and
// off (its edge the mirror of the entry arc), as the next section (Understands.tsx) comes up. All of it
// follows the scroll as it is; a scroll that comes to rest near the players settles them in place, the
// water full (the players' magnet, globals.css).
import { useEffect, useRef } from "react";
import { WAVE_VH } from "./ScrubLine";
import { isOff } from "./perf";
import { accentWaveGL } from "./accent-wave-gl";

const ACCENT = [26, 109, 255];
const ARC = 90; // how much higher the middle of the edge is than its ends, px
const BAND = 480; // depth of the halftone above the solid colour, px
const GRAIN = 0.07; // noise strength on the blue
const FULL_AT = 0.9; // how full the view is when it announces full (it counts as drained below 0.8)
const DRAIN_VH = 1; // the way out past the players: a screen, as the next section comes up
const PITCH = 6; // halftone grid, px; a dot of radius PITCH / 2 touches its neighbours

export function AccentWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current,
      line = document.getElementById("model-line"),
      players = document.getElementById("players");
    if (!canvas || !line) return;
    // drawn on the GPU in one pass (accent-wave-gl.ts); the 2D canvas below only where WebGL is missing
    const gpu = accentWaveGL(canvas, { accent: ACCENT, arc: ARC, band: BAND, pitch: PITCH, grain: GRAIN });
    const ctx = gpu ? null : canvas.getContext("2d");
    if (!gpu && !ctx) return;
    let p = 0, // the rise, 0..1
      q = 0, // the drain past the players, 0..1
      raf = 0,
      filled = false,
      w = 0,
      h = 0,
      dpr = 1;
    const fill = `rgb(${ACCENT.join(",")})`;
    const dots = !isOff("wave"); // ?off=wave: the solid blue alone, for measuring the dots (perf.ts)
    // Film-grain noise laid over the blue (dots included): one tile of random light and dark pixels,
    // repeated, at GRAIN strength.
    const grainTile = document.createElement("canvas");
    grainTile.width = grainTile.height = 160;
    const gctx = ctx && grainTile.getContext("2d");
    if (gctx) {
      const img = gctx.createImageData(160, 160);
      for (let k = 0; k < img.data.length; k += 4) {
        const v = Math.random() * 255;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
        img.data[k + 3] = 255;
      }
      gctx.putImageData(img, 0, 0);
    }
    const grain = ctx?.createPattern(grainTile, "repeat") ?? null;

    const announce = (on: boolean) => {
      if (on === filled) return;
      filled = on;
      window.dispatchEvent(
        new CustomEvent("accentwave", { detail: { filled: on } }),
      );
    };
    // The edge's height at x for a given level. On the way in (dir 1) the blue is below it and the edge is
    // an arc highest in the middle; on the way out (dir -1) the light page rises under the blue, which is
    // above the edge, and the arc is the mirror: lowest in the middle.
    const edge = (x: number, level: number, dir: number) =>
      level + dir * ARC * ((2 * x) / w - 1) ** 2;

    const draw = () => {
      raf = 0;
      // some slack before it counts as drained, so scrolling back a step does not undo the players
      const f = Math.min(p, 1 - q); // how full the view is: risen, less pushed out
      if (f < 0.8) announce(false);
      // Both ways the edge travels up the view, eased so it starts and settles gently. In, it runs from
      // below the view (halftone included) until the solid covers it (p 1, which is when it announces
      // full); out (q), from the solid covering the view until the blue and its halftone have left the top.
      const out = q > 0,
        dir = out ? -1 : 1;
      const k = out ? q : p,
        ke = k * k * (3 - 2 * k);
      const level = out
        ? h + ARC + PITCH * 2 - ke * (h + ARC + BAND + PITCH * 5)
        : h + BAND - ke * (h + BAND + ARC + PITCH * 3);
      if (gpu) {
        // unchanged (the view full of blue, scrolling on through the players): nothing is drawn again
        gpu.draw(f > 0 ? { w, h, level, dir, dots } : null, dpr);
        if (f >= FULL_AT) announce(true);
        return;
      }
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      if (f > 0) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        // the solid colour stops a little short of the edge; the grown dots cover the seam between
        const from = out ? 0 : h;
        ctx.moveTo(0, from);
        for (let x = 0; x <= w; x += 12)
          ctx.lineTo(x, edge(x, level, dir) + dir * PITCH * 2);
        ctx.lineTo(w, edge(w, level, dir) + dir * PITCH * 2);
        ctx.lineTo(w, from);
        ctx.closePath();
        ctx.fill();
        // the halftone on the far side of the edge: s runs 0 (the band's outer side) to 1 (at the edge).
        // The dots keep growing past touching (radius PITCH / 2) to covering their whole cell (PITCH *
        // 0.72, over half the diagonal) and carry on a few rows into the solid, so it melts in, no seam.
        for (let gx = PITCH / 2; gx < (dots ? w : 0); gx += PITCH) {
          const e = edge(gx, level, dir);
          const a = e - dir * BAND,
            b = e + dir * PITCH * 3;
          for (
            let gy = Math.floor(Math.min(a, b) / PITCH) * PITCH + PITCH / 2;
            gy < Math.max(a, b);
            gy += PITCH
          ) {
            const s = Math.min(1, 1 - (dir * (e - gy)) / BAND);
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
      // full enough to call it (FULL_AT): the players start coming in while the last of the blue settles
      if (f >= FULL_AT) announce(true);
    };
    const measure = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== window.innerWidth || h !== window.innerHeight) {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const y = window.scrollY;
      // the drain: from where the players section's foot meets the view's (on a phone it runs longer)
      const drainStart = players
        ? players.getBoundingClientRect().bottom + y - h
        : Infinity;
      q = Math.min(1, Math.max(0, (y - drainStart) / (DRAIN_VH * h)));
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
