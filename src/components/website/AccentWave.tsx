"use client";

// Between the scroll line and the players, the accent blue rises up the view and takes it over. It rises
// with the scroll over the last stretch of the scroll line's track (WAVE_VH of a screen, a few scrolls),
// while that section is still pinned, so it comes up over it; scrolling back drains it. Its leading edge
// is one arc (higher in the middle) of wide halftone: far from the blue the dots are tiny and faint, and
// nearer it they grow and strengthen, continuously, until they touch and merge into the solid colour. It
// sits above the scroll line and below the players section and the header. When the view is full it
// announces it (window event "accentwave", detail { filled }); the players section waits for that. Past
// the players the light page rises back from the bottom over DRAIN_VH of a screen, pushing the blue up and
// off (its edge the mirror of the entry arc), as the next section (Understands.tsx) comes up; one scroll
// down from the players glides through that, and one
// scroll up from the next section glides back into the players.
import { useEffect, useRef } from "react";
import { COMPLETE_AT, WAVE_VH } from "./ScrubLine";
import { easeOut, glideTo, gliding, stopGlide } from "./glide";

const ACCENT = [26, 109, 255];
const ARC = 90; // how much higher the middle of the edge is than its ends, px
const BAND = 480; // depth of the halftone above the solid colour, px
const GRAIN = 0.07; // noise strength on the blue
// A nudge (NUDGE px) past where the line in the scroll line section finishes filling, the page glides
// the rest of the way into the players by itself; the same the other way, and into and out of the
// section after the players. Every one of those four glides is the same: GLIDE_S long, moving the moment
// it starts and settling at the end (easeOut), so each one scroll is answered at once.
const NUDGE = 8;
const FULL_AT = 0.9; // how full the view is when it announces full (it counts as drained below 0.8)
const GLIDE_S = 1.8;
const DRAIN_VH = 1; // the way out past the players: a screen, as the next section comes up
const PITCH = 6; // halftone grid, px; a dot of radius PITCH / 2 touches its neighbours

export function AccentWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current,
      line = document.getElementById("model-line"),
      players = document.getElementById("players");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !line) return;
    let lastY = window.scrollY,
      lastT = performance.now(),
      speed = 0,
      glided = false,
      glidedUp = true, // disarmed until the view has been full once
      drainGlided = false,
      drainUpGlided = true; // disarmed until the drain has run once
    let p = 0, // the rise, 0..1
      q = 0, // the drain past the players, 0..1
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
      ctx.clearRect(0, 0, w, h);
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
        for (let gx = PITCH / 2; gx < w; gx += PITCH) {
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
    const glide = (to: number, v0: number, seconds: number) =>
      glideTo(to, seconds, easeOut, v0);
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
      // Where the line has just finished filling (ScrubLine.tsx): past it on the way down (a nudge is
      // enough), the page glides by itself through the rest of the line's track and the whole rise, to
      // where the water fills the view and the players are in place; it re-arms back at that point.
      // Scrolling back up out of the players glides back to exactly that point (the line full, the water
      // drained), so the very next scroll up starts emptying the line; it re-arms once the view is full.
      const y = window.scrollY,
        down = y > lastY,
        now = performance.now();
      const fillEnd =
        end -
        WAVE_VH * h -
        (1 - COMPLETE_AT) * (line.offsetHeight - h * (1 + WAVE_VH));
      // the visitor's scroll speed, px per ms, for the glide to carry on from
      if (!gliding()) speed = (y - lastY) / Math.max(8, now - lastT);
      const lastYBefore = lastY;
      lastY = y;
      lastT = now;
      // the drain: from where the players section's foot meets the view's (on a phone it runs longer)
      const drainStart = players
        ? players.getBoundingClientRect().bottom + y - h
        : Infinity;
      q = Math.min(1, Math.max(0, (y - drainStart) / (DRAIN_VH * h)));
      if (y <= drainStart + 1) drainGlided = false;
      if (q >= 0.995) drainUpGlided = false;
      if (y <= fillEnd + 1) glided = false;
      if (p >= 0.995) glidedUp = false;
      if (down && !glided && y > fillEnd + NUDGE && p < 1) {
        glided = true;
        glide(end + 4, Math.min(Math.max(speed, 0), 2.5), GLIDE_S); // a few px past the end, so it lands full
      } else if (!down && y < lastYBefore && !glidedUp && p < 0.97 && p > 0) {
        glidedUp = true;
        glide(fillEnd, Math.max(Math.min(speed, 0), -2.5), GLIDE_S); // back to the full line, drained
      } else if (
        down &&
        !drainGlided &&
        p >= 1 &&
        y > drainStart + NUDGE &&
        q < 1
      ) {
        drainGlided = true;
        glide(
          drainStart + DRAIN_VH * h + 2,
          Math.min(Math.max(speed, 0), 2.5),
          GLIDE_S,
        ); // on to the next section
      } else if (
        !down &&
        y < lastYBefore &&
        !drainUpGlided &&
        q < 0.97 &&
        q > 0
      ) {
        drainUpGlided = true;
        glide(drainStart, Math.max(Math.min(speed, 0), -2.5), GLIDE_S); // back into the players, full
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      stopGlide();
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
