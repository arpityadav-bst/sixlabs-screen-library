// The two loaders' Anatomy pins, kept apart from the lifecycle data so the client leaf never pulls
// floor-params.json into the browser bundle.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";

const W = "components/website/";

/** The full-view loader. */
export const LOADER_PINS: readonly AnatomyPin[] = [
  { selector: "[role='status']", name: "Layer", value: "inset 0 · z 30 · gap 20", source: `${W}HeroLoader.tsx:29` },
  { selector: "[role='status'] > div", name: "Mark", value: "64 × 64", source: `${W}HeroLoader.tsx:32` },
  { selector: "circle", name: "Core", token: "--ds-color-logo-navy", value: "r 15.41 · #030D2D", source: `${W}HeroLoader.tsx:34` },
  { selector: "[class*='logo-arc-1'] path", name: "Arc", token: "--ds-color-logo-blue", value: "#1770EF · its own layer", source: `${W}HeroLoader.tsx:43` },
  { selector: "[role='status'] > span", name: "Label", value: "11 / 500 · caps · 0.18em", source: `${W}HeroLoader.tsx:48` },
];

/** The container hero's loader. */
export const LOGO_PINS: readonly AnatomyPin[] = [
  { selector: "div:has(> img)", name: "Positioner", value: "top 77% · left 80% · 70% wide · z 10", source: `${W}HeroBits.tsx:144` },
  {
    selector: "img",
    name: "Still",
    value: "1200 square · 60% · tilted 50° by floor-spin, which turns it endlessly, so its box is measured at one moment of the 90s turn",
    source: `${W}HeroBits.tsx:147-153, app/globals.css:39`,
  },
];
