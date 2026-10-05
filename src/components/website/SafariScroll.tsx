"use client";

// Desktop Safari only: the page scrolled by Lenis, in step with its own drawing. Safari moves the page on a
// thread of its own, ahead of the page's drawing, so what the page draws from the scroll (the accent water's
// edge and halftone, AccentWave.tsx) trailed behind it, by up to a section on a quick scroll, as if glued to
// the background and pulled two ways. Chrome keeps the two in step, so it keeps the browser's own scrolling.
// Lenis cannot take CSS scroll snap (globals.css turns it off under Lenis), so the players' magnet is its own
// here: a scroll that comes to rest within MAGNET of a screen of the players' point glides the last stretch.
// Touch screens scroll natively everywhere (Lenis smooths the wheel and trackpad only).
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { easeOut, glideTo, gliding, setLenis } from "./glide";

const MAGNET = 0.6; // share of a screen either side of the players' point
const MAGNET_S = 0.6; // s, the pull's glide
const REST_MS = 120; // no scroll for this long: the scroll has come to rest

export function SafariScroll() {
  useEffect(() => {
    const safari = /^((?!chrome|chromium|crios|fxios|edg|android).)*safari/i.test(navigator.userAgent);
    if (!safari || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return nativeMagnet();
    const lenis = new Lenis({
      lerp: 0.15, // how much of the way to the wheel's target each frame covers: smooth, but close behind it
      smoothWheel: true,
      autoRaf: true,
    });
    setLenis(lenis);
    let rest = 0;
    const off = lenis.on("scroll", () => {
      window.clearTimeout(rest);
      rest = window.setTimeout(() => {
        const players = document.getElementById("players");
        if (!players || gliding()) return;
        const d = players.getBoundingClientRect().top; // the players' top against the view's
        if (Math.abs(d) > 1 && Math.abs(d) < window.innerHeight * MAGNET)
          lenis.scrollTo(window.scrollY + d, { duration: MAGNET_S, easing: easeOut });
      }, REST_MS);
    });
    return () => {
      off();
      window.clearTimeout(rest);
      setLenis(null);
      lenis.destroy();
    };
  }, []);
  return null;
}

// Everywhere else the page scrolls natively. The CSS snap (globals.css) only catches a scroll that ends very
// near the players, so a scroll that comes to rest within MAGNET of a screen of them glides the rest of the
// way here too (glide.ts holds the input and the snap for its MAGNET_S).
function nativeMagnet() {
  let rest = 0;
  const onScroll = () => {
    window.clearTimeout(rest);
    rest = window.setTimeout(() => {
      const players = document.getElementById("players");
      if (!players || gliding()) return;
      const d = players.getBoundingClientRect().top;
      if (Math.abs(d) > 1 && Math.abs(d) < window.innerHeight * MAGNET) glideTo(window.scrollY + d, MAGNET_S, easeOut);
    }, REST_MS);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(rest);
  };
}
