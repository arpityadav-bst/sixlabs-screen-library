"use client";

// Between the scroll line and the players, the accent blue rises up the view and takes it over. It rises
// with the scroll over the last stretch of the scroll line's track (WAVE_VH of a screen, a few scrolls),
// while that section is still pinned, so it comes up over it; scrolling back drains it. Its leading edge
// is one arc (higher in the middle) of wide halftone: far from the blue the dots are tiny and faint, and
// nearer it they grow and strengthen, continuously, until they touch and merge into the solid colour. It
// sits above the scroll line and below the players section and the header. When the view is full it
// announces it (window event "accentwave", detail { filled }); the players section waits for that.
import { useEffect, useRef } from "react";
import { COMPLETE_AT, WAVE_VH } from "./ScrubLine";
import { getLenis } from "./SmoothScroll";

const ACCENT = [26, 109, 255];
const ARC = 90; // how much higher the middle of the edge is than its ends, px
const BAND = 480; // depth of the halftone above the solid colour, px
const GRAIN = 0.07; // noise strength on the blue
// A nudge (NUDGE px) past where the line in the scroll line section finishes filling, the page glides
// the rest of the way into the players by itself: slowly (GLIDE_DOWN_S, easing in: a slow start) so "The
// players" in the water can be read. Going back up out of the players glides back to that point quicker
// (GLIDE_UP_S).
const NUDGE = 8;
const GLIDE_DOWN_S = 3.2;
const GLIDE_UP_S = 1.8;
const WORD = "The players"; // the next section's name, huge in the halftone
const WORD_ALPHA = 0.3;
const WORD_DROP = 50; // px the word sits lower in the water
const PITCH = 6; // halftone grid, px; a dot of radius PITCH / 2 touches its neighbours

export function AccentWave() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current,
      line = document.getElementById("model-line");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !line) return;
    let lastY = window.scrollY,
      lastT = performance.now(),
      speed = 0,
      glided = false,
      glidedUp = true; // disarmed until the view has been full once
    let p = 0,
      raf = 0,
      filled = false,
      w = 0,
      h = 0;
    const fill = `rgb(${ACCENT.join(",")})`;
    // the display font (next/font names it on the root)
    const display =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-outfit")
        .trim() || "sans-serif";
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
      // some slack before it counts as drained, so scrolling back a step does not undo the players
      if (p < 0.8) announce(false);
      ctx.clearRect(0, 0, w, h);
      // the level runs from below the view, halftone included (p 0), up until the solid covers it (p 1)
      // p 1 is the moment the solid colour covers the view (its lowest points, the arc's ends, reach the
      // top): that is when it reads as full, so that is when it announces it
      // eased, so the water starts gently and settles gently
      const pe = p * p * (3 - 2 * p);
      const level = h + BAND - pe * (h + BAND + ARC + PITCH * 3);
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
        // The word, huge and faint, riding the halftone: painted only where the blue already is, so in the
        // dot rows it is made of dots and it turns solid as it sinks into the colour. It rises with the water.
        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = WORD_ALPHA;
        ctx.fillStyle = "#ffffff";
        ctx.font = `500 ${Math.round(w * 0.14)}px ${display}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(WORD, w / 2, level + BAND * 0.12 + WORD_DROP);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = fill;
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
      if (p >= 0.995) announce(true); // a hair of slack: a scroll can land a fraction short
    };
    // A slow eased glide to `to` (GLIDE_DOWN_S or GLIDE_UP_S), ours rather than the browser's quick smooth scroll. It runs
    // to the end, and while it runs the page's own scrolling (wheel, touch, keys) is held, so the two
    // never fight and the transition is always seen whole.
    let glideRaf = 0;
    const stopGlide = () => {
      cancelAnimationFrame(glideRaf);
      glideRaf = 0;
    };
    const hold = (e: Event) => {
      if (glideRaf) e.preventDefault();
    };
    const holdKeys = (e: KeyboardEvent) => {
      if (
        glideRaf &&
        [
          " ",
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
        ].includes(e.key)
      )
        e.preventDefault();
    };
    window.addEventListener("wheel", hold, { passive: false });
    window.addEventListener("touchmove", hold, { passive: false });
    window.addEventListener("keydown", holdKeys);
    // It picks up where the page really is on its first frame (a wheel scroll may still be animating when
    // it triggers) and at the speed the visitor was already scrolling, then eases to a stop at `to`: a
    // cubic that starts on the visitor's velocity and ends at rest, so mouse and glide are one motion.
    const glide = (to: number, v0: number, seconds: number) => {
      stopGlide();
      // with the site's smooth scrolling (SmoothScroll.tsx) the glide runs on it: it carries on from the
      // scroll's own motion and eases out to `to`, holding the visitor's input meanwhile
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(to, {
          duration: seconds,
          // down, a slow start that gathers pace to the players; up, a quicker settle
          easing:
            to > window.scrollY
              ? (k) => 1 - Math.cos((k * Math.PI) / 2) // down: eases in, a slow start that gathers pace
              : (k) => 1 - (1 - k) ** 3,
          lock: true,
          force: true,
        });
        return;
      }
      let from = 0,
        t0 = 0,
        v = 0;
      const T = seconds * 1000;
      const step = (now: number) => {
        if (!t0) {
          t0 = now;
          from = window.scrollY;
          // capped so the curve only ever moves forward (a cubic like this overshoots past 3x the distance)
          const reach = (1.5 * (to - from)) / T;
          v =
            reach >= 0
              ? Math.min(Math.max(v0, 0), reach)
              : Math.max(Math.min(v0, 0), reach);
        }
        const k = Math.min(1, (now - t0) / T);
        const pos =
          from +
          (to - from) * (3 * k * k - 2 * k * k * k) +
          v * T * (k * k * k - 2 * k * k + k);
        window.scrollTo({ top: pos, behavior: "instant" });
        glideRaf = k < 1 ? requestAnimationFrame(step) : 0;
      };
      glideRaf = requestAnimationFrame(step);
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
      if (!glideRaf) speed = (y - lastY) / Math.max(8, now - lastT);
      const lastYBefore = lastY;
      lastY = y;
      lastT = now;
      if (y <= fillEnd + 1) glided = false;
      if (p >= 0.995) glidedUp = false;
      if (down && !glided && y > fillEnd + NUDGE && p < 1) {
        glided = true;
        glide(end + 4, Math.min(Math.max(speed, 0), 2.5), GLIDE_DOWN_S); // a few px past the end, so it lands full
      } else if (!down && y < lastYBefore && !glidedUp && p < 0.97 && p > 0) {
        glidedUp = true;
        glide(fillEnd, Math.max(Math.min(speed, 0), -2.5), GLIDE_UP_S); // back to the full line, drained
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
