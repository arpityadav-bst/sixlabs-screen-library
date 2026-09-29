"use client";

// Between the scroll line and the players, the page fills with the accent blue like water rising. Once the
// scroll line releases the screen (its track ends), the water plays up the view from the bottom on its own
// (RISE_S), and drains back down if the page is scrolled back above that point. Its leading edge is a
// dot matrix: fine dense dots first, then larger ones, then the solid blue, all following a wavy surface
// that keeps drifting while it is in view, with a paler wave just behind the solid one. When the water
// has filled the view it announces it (window event "accentwave", detail { filled }), which is what the
// players section waits for before it comes in. Fixed behind every section.
import { useEffect, useRef, useState } from "react";

const AMP = 18; // wave height, px
const LENGTH = 520; // wavelength, px
const FINE = 70,
  COARSE = 90; // heights of the fine-dot band (on top) and the coarse-dot band, px
const SPEED = 0.0012; // wave drift, radians per ms
const RISE_S = 1.2; // seconds to fill the view (and to drain it)

export function AccentWave() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const front = useRef<SVGPathElement>(null),
    back = useRef<SVGPathElement>(null);
  const fine = useRef<SVGPathElement>(null),
    coarse = useRef<SVGPathElement>(null);

  useEffect(() => {
    const line = document.getElementById("model-line"),
      players = document.getElementById("players");
    if (!line || !players) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = 0,
      target = 0,
      raf = 0,
      last = 0,
      filled = false,
      w = window.innerWidth,
      h = window.innerHeight;

    const surface = (level: number, phase: number, amp: number) => {
      const pts: string[] = [];
      for (let x = 0; x <= w + 16; x += 16)
        pts.push(
          `${x} ${(level + amp * Math.sin((x / LENGTH) * Math.PI * 2 + phase)).toFixed(1)}`,
        );
      return pts;
    };
    const between = (upper: string[], lower: string[]) =>
      `M ${upper.join(" L ")} L ${[...lower].reverse().join(" L ")} Z`;
    const announce = (on: boolean) => {
      if (on === filled) return;
      filled = on;
      window.dispatchEvent(
        new CustomEvent("accentwave", { detail: { filled: on } }),
      );
    };

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
      // the solid surface rises from below the view to above it, its dot bands included
      const level = h + AMP * 2 - p * (h + AMP * 4 + FINE + COARSE);
      const phase = still ? 0 : now * SPEED;
      const solid = surface(level, phase, AMP),
        mid = surface(level - COARSE, phase, AMP),
        top = surface(level - COARSE - FINE, phase, AMP);
      front.current?.setAttribute(
        "d",
        `M 0 ${h} L ${solid.join(" L ")} L ${w + 16} ${h} Z`,
      );
      back.current?.setAttribute(
        "d",
        `M 0 ${h} L ${surface(level - AMP * 0.9, phase * 0.8 + 1.7, AMP * 0.8).join(" L ")} L ${w + 16} ${h} Z`,
      );
      coarse.current?.setAttribute("d", between(mid, solid));
      fine.current?.setAttribute("d", between(top, mid));
      if (p >= 1) announce(true);
      if (p !== target || (!still && p > 0 && p < 1))
        raf = requestAnimationFrame(draw);
      else last = 0;
    };
    const measure = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      setSize({ w, h });
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
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      viewBox={`0 0 ${size.w} ${size.h}`}
    >
      <defs>
        <pattern
          id="wave-fine"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.8" fill="#1a6dff" />
        </pattern>
        <pattern
          id="wave-coarse"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="4" cy="4" r="2.4" fill="#1a6dff" />
        </pattern>
      </defs>
      <path ref={fine} fill="url(#wave-fine)" />
      <path ref={coarse} fill="url(#wave-coarse)" />
      <path ref={back} fill="#1a6dff" fillOpacity={0.45} />
      <path ref={front} fill="#1a6dff" />
    </svg>
  );
}
