"use client";

// Smooth scrolling for the website (Lenis): wheel and trackpad scroll glide with a soft, weighted ease
// instead of jumping in steps. In-page links glide on it by their own route (jump.ts), to where each
// section rests, so its own anchor handling stays off. The accent water's auto-glide
// (AccentWave.tsx) drives the same instance, so a hand-off from the visitor's scroll to it is one motion.
// Reduced motion keeps native scrolling (Lenis honours it).
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let instance: Lenis | null = null;
export const getLenis = () => instance;

export function SmoothScroll() {
  useEffect(() => {
    instance = new Lenis({
      lerp: 0.15, // how much of the way to the wheel's target each frame covers: smooth, but close behind it
      smoothWheel: true,
      autoRaf: true,
    });
    return () => {
      instance?.destroy();
      instance = null;
    };
  }, []);
  return null;
}
