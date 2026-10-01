"use client";

// Smooth scrolling for the website (Lenis): wheel and trackpad scroll glide with a soft, weighted ease
// instead of jumping in steps. In-page links glide on it by their own route (jump.ts), to where each
// section rests, so its own anchor handling stays off. The accent water's auto-glide
// (AccentWave.tsx) drives the same instance, so a hand-off from the visitor's scroll to it is one motion.
// Reduced motion keeps native scrolling (Lenis honours it), and so does lite mode (perf.ts, mounted here for
// every page): on a machine that cannot keep up, scrolling that waits on the page's frames turns every
// dropped frame into a jolt, where the browser's own scrolling stays smooth.
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { isLite, LITE, watchPerf } from "./perf";

let instance: Lenis | null = null;
export const getLenis = () => instance;

export function SmoothScroll() {
  useEffect(() => {
    const stopWatch = watchPerf();
    const off = () => {
      instance?.destroy();
      instance = null;
    };
    if (!isLite())
      instance = new Lenis({
        lerp: 0.15, // how much of the way to the wheel's target each frame covers: smooth, but close behind it
        smoothWheel: true,
        autoRaf: true,
      });
    window.addEventListener(LITE, off);
    return () => {
      stopWatch();
      window.removeEventListener(LITE, off);
      off();
    };
  }, []);
  return null;
}
