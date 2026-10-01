"use client";

// The in-page links (the header's tabs, the footer's Explore, the hero's "See what it does"): each glides to
// where its section rests, not to its raw top. The line (#model-line) rests where it has just filled and the
// players where the water has filled the view (their magnet's point, globals.css); every other section lands
// with its own top padding showing under the fixed header. While a glide runs the players' magnet is off
// (glide.ts), so a glide that passes the players is not caught by it.
import { easeOut, glideTo } from "./glide";
import { COMPLETE_AT, WAVE_VH } from "./ScrubLine";

export type Spot = "top" | "model-line" | "players" | "jobs" | "faq";

function restAt(spot: Spot): number | null {
  if (spot === "top") return 0;
  const y = window.scrollY,
    h = window.innerHeight;
  if (spot === "model-line" || spot === "players") {
    const line = document.getElementById("model-line");
    if (!line) return null;
    const top = line.getBoundingClientRect().top + y,
      len = line.offsetHeight;
    return spot === "model-line"
      ? top + COMPLETE_AT * (len - h * (1 + WAVE_VH)) // the line just full
      : top + len - h; // the rise's end, where the players' magnet holds them
  }
  const el = document.getElementById(spot);
  if (!el) return null;
  const head = document.getElementById("site-head")?.offsetHeight ?? 0;
  return el.getBoundingClientRect().top + y - head;
}

export function jumpTo(spot: Spot) {
  const to = restAt(spot);
  if (to === null) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const at = Math.max(0, Math.min(max, to));
  const far = Math.abs(at - window.scrollY);
  glideTo(at, Math.min(2.2, 0.9 + far / 4000), easeOut);
}

// an in-page link's props: its hash (so it still works without the scripts) and a click that glides
export const linkTo = (spot: Spot) => ({
  href: spot === "top" ? "#" : `#${spot}`,
  onClick: (e: React.MouseEvent) => {
    e.preventDefault();
    jumpTo(spot);
  },
});
