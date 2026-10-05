// The three effect families and each instance's values, written once. `at` is the guide section that
// shows the instance live, so the family tables link out rather than repeat it.
import type { SectionId } from "@/app/design-system/_data/catalog";
import type { HeldPin } from "./held-pin";

type Instance = { name: string; cells: readonly string[]; source: string; at?: SectionId };

/** the Try now pill as the Button section measures it: min-w 220, py 14 round 15px type, about 50.5 tall */
export const CTA_SIZE = { w: 220, h: 50.5 };
export const CTA_BAND = 34;

export const CTA_PINS: readonly HeldPin[] = [
  {
    selector: '[data-ds="cta-stage"]',
    name: "Stand-in pill",
    token: "--ds-color-primary",
    value: "#0a152d as PrimaryCta.tsx:98 · 220 × 50.5, the shipped pill's min-w 220 px 40 py 14 (PrimaryCta.tsx:100) · no label, no shifted fill",
    source: "app/design-system/sections/effects/fx-live.module.css:105-109",
    expect: [".ds-cta-stage {", "background: var(--ds-color-primary, #0a152d);"],
    side: "left",
  },
  {
    selector: '[data-ds="cta-stage"] canvas',
    name: "Dot canvas",
    value: "covers the pill, the band crosses it 34 wide · 3.5px grid, r 0.95, #9cc0ff",
    source: "CtaDots.tsx:14-17,98",
    expect: ["const PITCH = 3.5,", 'COLOUR = "#9cc0ff",', "absolute inset-0 h-full w-full"],
    side: "right",
  },
];

export const HALFTONE_COLUMNS = ["Instance", "Grid", "Dot radius", "Opacity", "Ink", "Source", "Live in"] as const;
export const HALFTONES: readonly Instance[] = [
  { name: "Accent water", cells: ["6px", "0.35 to 4.32 by s^1.4", "0.15 + 0.95 s", "#1a6dff"], source: "accent-wave-gl.ts:39-41", at: "accent-water" },
  { name: "Human / AI sweep", cells: ["7 frame px", "up to 5.04 by s^1.3", "1 inside a dot", "the incoming copy, split"], source: "PortraitSwap.tsx:23,149", at: "portrait-sweep" },
  { name: "Try now dot band", cells: ["3.5px", "0.95", "peak 0.75, 5px soft sides", "#9cc0ff"], source: "CtaDots.tsx:14-17, PrimaryCta.tsx:72", at: "button" },
];

export const CHROMA_COLUMNS = ["Instance", "Split", "Colours", "Where it shows", "Source", "Live in"] as const;
export const CHROMAS: readonly Instance[] = [
  { name: "Footer wordmark", cells: ["3px either side", "#e89fa4 left, #9ed5dd right", "the word's two ends, gone by 16%"], source: "app/globals.css:196-213", at: "footer" },
  { name: "Glyph pool", cells: ["1px either side", "255, 90, 90 and 90, 200, 255 at 0.14", "the pool's rim"], source: "ascii-field.js:178-183", at: "ascii-field" },
  { name: "Tile glint", cells: ["glintCA 1 x 0.12", "red right, blue left", "the glint's rounded ends"], source: "tiles/textures.js:121,133", at: "tile-activation" },
  { name: "Human / AI sweep", cells: ["10 frame px either side", "red and blue channels", "inside the halftone band"], source: "PortraitSwap.tsx:24-29", at: "portrait-sweep" },
  { name: "Liquid lens", cells: ["aberration 0.225", "RGB along the lens direction", "round the cursor, desktop only"], source: "liquid/shaders.ts:171, liquid-sim.ts:13", at: "scroll-line" },
];

export const GRAIN_COLUMNS = ["Instance", "Kind", "Tile", "Strength", "Moves", "Source"] as const;
export const GRAINS: readonly Instance[] = [
  { name: "Page grain", cells: ["fractal noise as black specks", "200px", "0.045 after a 240px fade", "no"], source: "app/globals.css:214-236" },
  { name: "Water grain", cells: ["random grey mixed into the accent", "160px", "0.07", "no"], source: "accent-wave-gl.ts:47-48,85-89" },
  { name: "Floor film grain", cells: ["per-pixel hash in the last pass", "none", "0.025", "no"], source: "public/tiles/floor-params.json:112, tiles/lean.js:71" },
  { name: "Liquid grain", cells: ["noise in the cursor lens only", "none", "0.3 of the demo's", "yes"], source: "liquid/liquid-sim.ts:13" },
];

export const GRAIN_FADE = 240;
