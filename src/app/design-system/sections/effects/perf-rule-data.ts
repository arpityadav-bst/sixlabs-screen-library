// The performance contract's values, written once: what never goes on screen and what the site draws
// instead, the measuring switches (each opens the real page with it set), and the WebGL contexts the
// site and the guide hold.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { CAPACITY } from "@/app/design-system/_kit/gl-capacity";

export const RULE_COLUMNS = ["Never on screen", "Draw it instead", "Where the site does"] as const;
export const RULES: readonly (readonly string[])[] = [
  ["backdrop-filter", "a solid ground at 92% of the page colour", "Header.tsx:59"],
  ["mix-blend-mode", "alpha specks that darken by their own transparency, or compositing inside a canvas (lighter, multiply, source-atop)", "app/globals.css:214-236, PortraitSwap.tsx:126-135"],
  ["mask, mask-image", "a gradient in the ground's own colour laid over the edge, or the fade drawn on a canvas", "app/globals.css:228, CopyLinePicture.tsx:95-105"],
  ["filter (blur, drop-shadow)", "stacked strokes for a glow, a pre-drawn picture for a shadow, an offscreen ctx.filter baked once", "DoodleStroke.tsx:17-25, JobTerminal.tsx:35-40, tiles/textures.js:63"],
];

export type Switch = { flag: string; does: string; source: string };
export const SWITCH_COLUMNS = ["Switch", "What it does", "Source", "Open"] as const;
export const SWITCHES: readonly Switch[] = [
  { flag: "off=ascii", does: "hides the glyph field", source: "app/globals.css:268" },
  { flag: "off=wave", does: "draws the water's blue without its dots", source: "AccentWave.tsx:47" },
  { flag: "off=liquid", does: "leaves the line in its own ink", source: "LiquidLine.tsx:42" },
  { flag: "off=tiles", does: "hides the floating tiles", source: "app/globals.css:269" },
  { flag: "off=doodles", does: "hides the doodles", source: "app/globals.css:270" },
  { flag: "off=grain", does: "hides the page grain", source: "app/globals.css:271" },
  { flag: "off=fx", does: "strips every backdrop blur, blend mode, CSS mask and filter on the page", source: "app/globals.css:274" },
  { flag: "off=ascii,wave,liquid", does: "any number at once, comma separated, carried on html[data-off]", source: "perf.ts:26-33" },
  { flag: "perf", does: "a readout of fps, slow frames, long tasks, the floor's ratio and anti-aliasing, the GPU and clip seeks, with a Copy log", source: "perf.ts:3-14" },
  { flag: "perf=bench", does: "the readout plus the floor benchmark", source: "perf.ts:11" },
  { flag: "gpu=low", does: "the floor and the liquid on a two-GPU laptop's low-power GPU", source: "perf.ts:24, liquid/liquid-sim.ts:19" },
  { flag: "gpu=high", does: "the water and the portrait on the faster GPU", source: "accent-wave-gl.ts:58" },
  { flag: "clips=stacked", does: "forces the stacked portrait clips (webm and still too)", source: "useClipFormat.ts:42-48" },
];

export const CONTEXT_COLUMNS = ["Context", "Units", "When", "On loss or leave", "Source"] as const;
export const CONTEXTS: readonly (readonly string[])[] = [
  ["Tile floor", "1", "the hero, from first paint", "no recovery from a lost context", "tiles/floor.js:38"],
  ["Liquid", "1", "desktops only, WebGL2", "destroy() does not force the loss", "liquid/liquid-sim.ts:16-20"],
  ["Accent water", "1", "always, full viewport", "rebuilt when restored", "accent-wave-gl.ts:51-60"],
  ["Portrait", "1, 2 during a player change", "the stacked format", "rebuilt when restored, no dispose", "swap-gl.ts:76, Players.tsx:142"],
  ["Format probe", "1 to 2", "the first clip format check", "never released", "useClipFormat.ts:47,55"],
  ["GPU name", "1", "?perf only, when the floor's own is not up", "never released", "perf.ts:36-46"],
];

export const GUIDE_BUDGET: readonly KeyRow[] = [
  { key: "WebGL units", value: `${CAPACITY.gl} live at once, one per context`, source: "_kit/gl-capacity.ts" },
  { key: "tile floor", value: `${CAPACITY.floor}, in the guide or inside a framed page`, source: "_kit/gl-capacity.ts" },
  { key: "iframes", value: `${CAPACITY.frames} live at once`, source: "_kit/gl-capacity.ts" },
  { key: "claim", value: "within half a viewport, and when the pools are full, queued and granted on screen first, then nearest the view", source: "_kit/HeavySlot.tsx · _kit/gl-budget.ts" },
  { key: "release", value: "past one and a half viewports: the specimen unmounts, its contexts are lost through WEBGL_lose_context and its frames are blanked", source: "_kit/HeavySlot.tsx" },
  { key: "browser limit", value: "about 16 contexts a page in Chrome, after which the oldest is lost" },
];

/** the Don't panel's code, shown as text and never applied */
export const FILTER_CODE = ["filter: drop-shadow(0 0 4px #7fb2ff);", "backdrop-filter: blur(12px);"] as const;
