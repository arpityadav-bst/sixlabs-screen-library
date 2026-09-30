"use client";

// The page's own glides between sections (AccentWave.tsx): a slow eased scroll to a point, ours rather
// than the browser's quick smooth scroll. With the site's smooth scrolling on (SmoothScroll.tsx) it runs
// on that, which holds the visitor's input while it runs, so the two never fight and the transition is
// always seen whole. Without it, a fallback of its own: it starts on the visitor's scroll speed (v0, px
// per ms) and eases to rest at the point, holding the wheel, touch and keys meanwhile.
import { getLenis } from "./SmoothScroll";

export const easeIn = (k: number) => 1 - Math.cos((k * Math.PI) / 2); // a slow start that gathers pace
export const easeOut = (k: number) => 1 - (1 - k) ** 3; // a quick start that settles

let raf = 0;
let holding = false;
const KEYS = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"];

// the fallback glide holds the page's own scrolling while it runs (added once, on the first glide)
function holdInput() {
  if (holding) return;
  holding = true;
  const hold = (e: Event) => {
    if (raf) e.preventDefault();
  };
  window.addEventListener("wheel", hold, { passive: false });
  window.addEventListener("touchmove", hold, { passive: false });
  window.addEventListener("keydown", (e) => {
    if (raf && KEYS.includes(e.key)) e.preventDefault();
  });
}

export const gliding = () => raf !== 0;

export function stopGlide() {
  cancelAnimationFrame(raf);
  raf = 0;
}

export function glideTo(
  to: number,
  seconds: number,
  easing: (k: number) => number,
  v0 = 0,
) {
  stopGlide();
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(to, { duration: seconds, easing, lock: true, force: true });
    return;
  }
  holdInput();
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
    raf = k < 1 ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}
