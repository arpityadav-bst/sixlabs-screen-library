"use client";

// Between the scroll line and the players, the page fills with the accent blue like water rising: a fill
// comes up from the bottom of the view, tied to the scroll, with a wavy surface that keeps moving. Two
// waves (a paler one just behind and above) give it the look of water, and a band of accent dots rides
// just above the surface, fading upward, so the white dissolves into it. It starts as the scroll line
// releases the screen (its track ends) and has filled the view by the time the players section
// (#players) reaches the top; scrolling back drains it again. Fixed behind every section.
import { useEffect, useRef, useState } from "react";

const AMP = 18; // wave height, px
const LENGTH = 520; // wavelength, px
const DOTS = 110; // dot band above the surface, px
const SPEED = 0.0012; // wave drift, radians per ms

export function AccentWave() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  const front = useRef<SVGPathElement>(null),
    back = useRef<SVGPathElement>(null);
  const band = useRef<SVGPathElement>(null),
    fade = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    const line = document.getElementById("model-line"),
      players = document.getElementById("players");
    if (!line || !players) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 0,
      raf = 0,
      w = window.innerWidth,
      h = window.innerHeight;

    // the surface at height `level`, as points every 16px, shifted by `phase`
    const surface = (level: number, phase: number, amp: number) => {
      const pts: string[] = [];
      for (let x = 0; x <= w + 16; x += 16)
        pts.push(
          `${x} ${(level + amp * Math.sin((x / LENGTH) * Math.PI * 2 + phase)).toFixed(1)}`,
        );
      return pts;
    };
    const draw = (now: number) => {
      raf = 0;
      // the surface rises from below the view (t 0) to above it, dots included (t 1)
      const level = h + AMP * 2 - t * (h + AMP * 4 + DOTS);
      const phase = still ? 0 : now * SPEED;
      const f = surface(level, phase, AMP),
        b = surface(level - AMP * 0.9, phase * 0.8 + 1.7, AMP * 0.8);
      front.current?.setAttribute(
        "d",
        `M 0 ${h} L ${f.join(" L ")} L ${w + 16} ${h} Z`,
      );
      back.current?.setAttribute(
        "d",
        `M 0 ${h} L ${b.join(" L ")} L ${w + 16} ${h} Z`,
      );
      const top = surface(level - DOTS, phase, AMP);
      band.current?.setAttribute(
        "d",
        `M ${top.join(" L ")} L ${[...f].reverse().join(" L ")} Z`,
      );
      fade.current?.setAttribute("y1", String(level - DOTS));
      fade.current?.setAttribute("y2", String(level));
      // keep the water moving only while the surface is in view
      if (!still && t > 0 && t < 1) raf = requestAnimationFrame(draw);
    };
    const measure = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      setSize({ w, h });
      const y = window.scrollY;
      const start =
        line.getBoundingClientRect().top + y + line.offsetHeight - h;
      const end = players.getBoundingClientRect().top + y;
      t = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
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
          id="wave-dots"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="1.4" fill="#1a6dff" />
        </pattern>
        <linearGradient
          ref={fade}
          id="wave-fade"
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask
          id="wave-dot-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={size.w}
          height={size.h}
        >
          <rect width={size.w} height={size.h} fill="url(#wave-fade)" />
        </mask>
      </defs>
      <path ref={band} fill="url(#wave-dots)" mask="url(#wave-dot-mask)" />
      <path ref={back} fill="#1a6dff" fillOpacity={0.45} />
      <path ref={front} fill="#1a6dff" />
    </svg>
  );
}
