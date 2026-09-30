"use client";

// Smooth scrolling for the website (Lenis): wheel and trackpad scroll glide with a soft, weighted ease
// instead of jumping in steps, and in-page links (#players) glide too. The accent water's auto-glide
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
      anchors: true,
    });
    return () => {
      instance?.destroy();
      instance = null;
    };
  }, []);
  return null;
}
