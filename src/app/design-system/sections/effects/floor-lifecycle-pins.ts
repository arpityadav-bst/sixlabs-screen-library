// The two loaders' Anatomy pins, kept apart from the lifecycle data so the client leaf never pulls
// floor-params.json into the browser bundle. Each pin's expect is the class or attribute text its line writes.
import type { HeldPin } from "./held-pin";

const W = "components/website/";

/** The full-view loader. */
export const LOADER_PINS: readonly HeldPin[] = [
  {
    selector: "[role='status']",
    name: "Layer",
    value: "inset 0 · z 30 · gap 20",
    source: `${W}HeroLoader.tsx:29`,
    expect: "absolute inset-0 z-30 flex flex-col items-center justify-center gap-5",
  },
  { selector: "[role='status'] > div", name: "Mark", value: "64 × 64", source: `${W}HeroLoader.tsx:32`, expect: "relative h-16 w-16" },
  {
    selector: "circle",
    name: "Core",
    token: "--ds-color-logo-navy",
    value: "r 15.41 · #030D2D",
    source: `${W}HeroLoader.tsx:34`,
    expect: 'r="15.41" fill={NAVY}',
  },
  {
    selector: "[class*='logo-arc-1'] path",
    name: "Arc",
    token: "--ds-color-logo-blue",
    value: "#1770EF · its own layer",
    source: `${W}HeroLoader.tsx:43`,
    expect: "fill={BLUE}",
  },
  {
    selector: "[role='status'] > span",
    name: "Label",
    value: "11 / 500 · caps · 0.18em · slate-500",
    source: `${W}HeroLoader.tsx:48`,
    expect: "text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500",
  },
];

/** The container hero's loader. */
export const LOGO_PINS: readonly HeldPin[] = [
  {
    selector: "div:has(> img)",
    name: "Positioner",
    value: "top 77% · left 80% · 70% wide · z 10",
    source: `${W}HeroBits.tsx:144`,
    expect: ["top-[77%] left-[80%]", "z-10 aspect-square w-[70%]"],
  },
  {
    selector: "img",
    name: "Still",
    value: "1200 square · 60% · tilted 50° by floor-spin, which turns it endlessly, so its box is measured at one moment of the 90s turn",
    source: `${W}HeroBits.tsx:150-152, app/globals.css:39`,
    expect: ["width={1200}", "floor-spin w-full h-full opacity-60", "rotateX(50deg)"],
  },
];
