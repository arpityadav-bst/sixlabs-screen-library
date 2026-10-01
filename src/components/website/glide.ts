"use client";

// The in-page links' glide (jump.ts, BackToTop.tsx): a slow eased scroll to a point, ours rather than the
// browser's quick smooth scroll. It holds the wheel, touch and keys while it runs, so it is always seen
// whole, and turns the players' magnet (the page's scroll snap, globals.css) off meanwhile, so a glide that
// passes the players is not caught by it. The page's own scrolling is the browser's, as it is.
export const easeOut = (k: number) => 1 - (1 - k) ** 3; // a quick start that settles

let raf = 0;
let holding = false;
const KEYS = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"];

// the glide holds the page's own scrolling while it runs (added once, on the first glide)
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

export function glideTo(to: number, seconds: number, easing: (k: number) => number) {
  cancelAnimationFrame(raf);
  holdInput();
  const root = document.documentElement;
  root.style.scrollSnapType = "none";
  let from = 0,
    t0 = 0;
  const T = seconds * 1000;
  const step = (now: number) => {
    if (!t0) {
      t0 = now;
      from = window.scrollY;
    }
    const k = Math.min(1, (now - t0) / T);
    window.scrollTo({ top: from + (to - from) * easing(k), behavior: "instant" });
    raf = k < 1 ? requestAnimationFrame(step) : 0;
    if (!raf) root.style.scrollSnapType = "";
  };
  raf = requestAnimationFrame(step);
}
