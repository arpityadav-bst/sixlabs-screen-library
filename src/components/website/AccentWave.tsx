"use client";

// Between the scroll line and the players, the page turns the accent blue: a dot-matrix wave sweeps the
// view left to right, tied to the scroll. It starts as the scroll line releases the screen (its track
// ends) and has crossed by the time the players section (#players) reaches the top; scrolling back wipes
// it out again. Behind the blue, a band of accent dots runs just ahead of the front, dense at the edge and
// thinning out, so the white dissolves into blue rather than being cut. Fixed behind every section.
import { useEffect, useRef } from "react";

const BAND = 26; // dot band width, % of the viewport

export function AccentWave() {
  const fill = useRef<HTMLDivElement>(null),
    dots = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = document.getElementById("model-line"),
      players = document.getElementById("players");
    if (!line || !players) return;
    let queued = false;
    const paint = () => {
      queued = false;
      const y = window.scrollY,
        vh = window.innerHeight;
      const start =
        line.getBoundingClientRect().top + y + line.offsetHeight - vh;
      const end = players.getBoundingClientRect().top + y;
      const t = Math.min(
        1,
        Math.max(0, (y - start) / Math.max(1, end - start)),
      );
      const front = t * (100 + BAND); // % across the view; the band runs ahead of it
      if (fill.current)
        fill.current.style.clipPath = `inset(0 ${Math.max(0, 100 - front)}% 0 0)`;
      if (dots.current) {
        dots.current.style.left = `${front}%`;
        dots.current.style.opacity = t > 0 && t < 1 ? "1" : "0";
      }
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={fill}
        className="absolute inset-0 bg-accent"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      />
      <div
        ref={dots}
        className="dot-front absolute inset-y-0 opacity-0"
        style={{ width: `${BAND}%` }}
      />
    </div>
  );
}
