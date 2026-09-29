"use client";

// Page background: a grid of tiny monochrome SixLabs marks that shows only in a soft circle around the
// cursor, very faintly. One repeating SVG tile (public/brand/mark-grid-16.svg, named by mark size so a
// change always busts the browser cache), revealed by a radial
// mask that follows the pointer through CSS variables (no re-renders). It sits behind everything, so the
// containers cover it and it only shows on the page's own white. Off for touch and reduced motion.
import { useEffect, useRef } from "react";

export function LogoGridGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !window.matchMedia(
        "(hover: hover) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
      el.style.opacity = "1";
    };
    const leave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="logo-grid-glow pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-500"
    />
  );
}
