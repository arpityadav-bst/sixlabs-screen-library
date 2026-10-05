// How the floor arrives, plays itself and resets, and its two loaders. Intro and loader times are the
// constants in code. The autoplay turn adds them up from the moment a tile is picked, on the wall clock.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import { FP, n, wall } from "./floor-params-data";

const T = "tiles/";
const W = "components/website/";

// the container hero, from the floor's onReady
const DELAY = 0.5; // Hero.tsx:139
const RISE = 0.9; // intro.js:12
export const INTRO_LANES: readonly TimelineLane[] = [
  { label: "Floor logo", items: [{ label: "fades and shrinks out", at: 0, to: 0.45 }] },
  {
    label: "Bare floor",
    items: [
      { label: "captured, drawn once", at: 0 },
      { label: "holds introDelay", at: 0, to: DELAY },
    ],
  },
  {
    label: "Field",
    items: [
      { label: "rises from -0.102, ease-out cubic", at: DELAY, to: DELAY + RISE },
      { label: "crossfade from the capture", at: DELAY, to: DELAY + RISE },
    ],
  },
  { label: "Autoplay", items: [{ label: "first pick, the middle tile", at: DELAY + RISE }] },
  { label: "Page", items: [{ label: "scroll cue and wave button in", at: 1.8 }] },
];

// one autoplay turn on the wall clock, from the pick
const FOCUS = 0.38;
const ACT = wall(0.9);
const FADE = wall(1.05);
const SINK = (FP.riseTau / FP.animSpeed) * Math.log(1000); // settleTo's 0.001 stop, interact.js:34
const r2 = (v: number) => +v.toFixed(2);
const a1 = r2(FOCUS + ACT);
const a2 = r2(a1 + FADE);
const a3 = r2(a2 + SINK);
export const TURN_LANES: readonly TimelineLane[] = [
  { label: "Focus", items: [{ label: "hover, held", at: 0, to: FOCUS }] },
  { label: "Activate", items: [{ label: "click, the sweep", at: FOCUS, to: a1 }] },
  {
    label: "Settle",
    items: [
      { label: "tinted, everything fades", at: a1, to: a2 },
      { label: "sinks", at: a2, to: a3 },
    ],
  },
  { label: "Gap", items: [{ label: "once both rigs are idle", at: a3, to: r2(a3 + 0.22) }] },
  { label: "Next", items: [{ label: "next pick", at: r2(a3 + 0.22) }] },
];

// the reset wave, from the moment its flip begins
const SPREAD = 1.3;
const FLIP = 0.75;
export const WAVE_LANES: readonly TimelineLane[] = [
  { label: "Wave button", items: [{ label: "busy ends", at: 0 }] },
  {
    label: "Leftmost tile",
    items: [
      { label: "flips, in-out cubic", at: 0, to: FLIP },
      { label: "edge-on, swaps cast", at: FLIP / 2 },
    ],
  },
  {
    label: "Rightmost tile",
    items: [
      { label: "flips", at: SPREAD, to: SPREAD + FLIP },
      { label: "edge-on, swaps cast", at: r2(SPREAD + FLIP / 2) },
    ],
  },
  { label: "Floor", items: [{ label: "inert to the pointer", at: 0, to: SPREAD + FLIP }] },
  { label: "Autoplay", items: [{ label: "restarts from the middle", at: r2(SPREAD + FLIP + 0.22) }] },
];

/** The drawer for the intro and autoplay timelines. */
export const LIFECYCLE_VALUES: readonly ValueRow[] = [
  { part: "Intro rise", value: `${RISE}s, 1 - (1 - t)³, field y from -${n(FP.core + FP.bevelT)} to 0`, source: `${T}intro.js:7-12` },
  { part: "Intro delay", token: "introDelay", value: "container 0.5, full view 1.85 (FULL_TILES_AT)", source: `${W}Hero.tsx:139 · ${W}hero-intro.ts:16` },
  { part: "While it holds", value: "one frame drawn, then none, so the main thread stays free", source: `${T}intro.js:35-38` },
  { part: "Resize mid-intro", value: "the field snaps to its place", source: `${T}floor.js:250-252` },
  { part: "Focus hold", token: "FOCUS_MS", value: "380ms", source: `${T}autoplay.js:11` },
  { part: "Gap", token: "GAP_MS", value: "220ms", source: `${T}autoplay.js:11` },
  { part: "Resume", token: "RESUME_MS", value: "500ms after the pointer leaves the tiles", source: `${T}autoplay.js:11` },
  { part: "On screen", token: "MIN_SHOWN", value: "0.4 of a tile's top in view, 0.02 for the wave", source: `${T}autoplay.js:11` },
  { part: "Next cast", token: "PREPARE_AT", value: "starts loading once 70% of the tiles on screen have played", source: `${T}autoplay.js:13` },
  { part: "Wave", token: "WAVE_SPREAD", value: "1.3s left to right, FLIP_SECONDS 0.75 per tile, in place about the top-right edge", source: `${T}autoplay.js:12 · ${T}floor.js:131-151` },
  { part: "Held", value: "off screen or a hidden tab: nothing plays, nothing is drawn", source: `${T}floor.js:272-275` },
  { part: "Give up", token: "GIVE_UP", value: "12s, a floor that never comes does not keep the full view behind its loader", source: `${W}hero-intro.ts:19` },
];

export const AUTOPLAY_ROWS: readonly KeyRow[] = [
  { key: "Picking", value: "first the tile nearest the middle, then a random unspent one with 0.4 of its top in view", source: `${T}autoplay.js:114-116` },
  { key: "Waiting on a copy", value: "a tile whose hologram has not landed is skipped and picked again, a failed one plays human", source: `${T}autoplay.js:117-119` },
  { key: "The visitor wins", value: "a pointer on a live tile pauses autoplay, a clicked tile still finishes", source: `${T}autoplay.js:31-35` },
  { key: "reset()", value: "a wave over every character tile on screen now, resolving as its flip begins", source: `${T}autoplay.js:135-140` },
];

export const LOADER_VALUES: readonly ValueRow[] = [
  { part: "Hop", value: "1.5s ease-in-out loop, out and back in its first third", source: "app/globals.css:153-155" },
  { part: "Order", value: "arcs 1, 2, 0 (clockwise from the top right), delays i × 0.5 - 1.5s, under way at the first frame", source: `${W}HeroLoader.tsx:17 · ${W}HeroLoader.tsx:40` },
  { part: "Travel", value: "arc 0 (-1.6, -2.5), arc 1 (3, 0), arc 2 (-1.7, 2.5) px", source: "app/globals.css:156-158" },
  { part: "Label", value: "slate-500, about 3.8:1 on the hero grey, role status carries the word to a screen reader", source: `${W}HeroLoader.tsx:30 · ${W}HeroLoader.tsx:48` },
  { part: "Exit", value: "opacity 0 over 0.45s, ease (0.22, 1, 0.36, 1)", source: `${W}HeroLoader.tsx:28` },
  { part: "First paint", value: "in the server HTML, no fade in", source: `${W}HeroLoader.tsx:27` },
  { part: "Reduced motion", value: "the arcs hold still", source: "app/globals.css:163" },
];

export const LOGO_VALUES: readonly ValueRow[] = [
  { part: "Still", value: "/brand/sixlabs-mark-floor.webp, 1200 × 1200, 16 KB on disk", source: `${W}HeroBits.tsx:148` },
  { part: "Mask", value: "radial-gradient(closest-side, #000 72%, transparent 98%), a compositor-rule exception", source: `${W}HeroBits.tsx:152` },
  { part: "Tilt and spin", value: "perspective(2400px) rotateX(50deg), rotateZ 0 to 360 over 90s linear", source: "app/globals.css:38-44" },
  { part: "Enter", value: "opacity 0 to 1 over 0.4s", source: `${W}HeroBits.tsx:138` },
  { part: "Exit", value: "opacity 0 and scale 0.96 over 0.45s", source: `${W}HeroBits.tsx:139-142` },
  { part: "Reduced motion", value: "no spin, the tilt stays", source: "app/globals.css:45-47" },
  { part: "Shown while", value: "the container hero's floor is not ready", source: `${W}Hero.tsx:159` },
];

export const LOADER_PROPS: readonly PropRow[] = [
  { name: "show", type: "boolean", note: "AnimatePresence plays the exit when it turns false" },
];

export const LOADER_CODE = `import { HeroLoader } from "@/components/website/HeroLoader";
import { FloorLogo } from "@/components/website/HeroBits";

<HeroLoader show={loading} />   // the full view
<FloorLogo show={!floorReady} /> // the container hero`;
