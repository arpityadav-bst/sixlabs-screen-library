// The tile floor's values: the scene read from floor-params.json, the wrapper's props and the wave
// button's per-state values, each with the line it is read from.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { FP, n, PARAMS } from "./floor-params-data";
import { INTRO_DELAY } from "./tile-floor-pins";

const T = "tiles/";
const W = "components/website/";

/** The scene, grouped as the engine builds it. Every number comes from the params file at build time. */
export const SCENE_ROWS: readonly KeyRow[] = [
  {
    key: "Camera",
    value: `fov ${FP.fov} · elevation ${FP.elev}° · azimuth ${FP.azim}° · distance ${FP.dist} × distScale, pulled back up to ${FP.maxPull}× in a tall box`,
    source: `${PARAMS} · ${T}viewport.js:12-13`,
  },
  {
    key: "Design frame",
    value: "1920 × 1080, with the grid and casts built to cover aspects 0.45 to 2.6",
    source: `${T}floor.js:31 · ${T}viewport.js:9`,
  },
  {
    key: "Grid",
    value: `tile ${FP.tile} · gap ${FP.gap} (pitch ${n(FP.tile + FP.gap)}) · one inner edge, through the bottom at ${FP.bandBottomX}`,
    source: `${T}floor.js:69-70`,
  },
  {
    key: "Tile shape",
    value: `corner radius ${FP.radius} · body ${FP.core} + bevel ${FP.bevelT} = ${n(FP.core + FP.bevelT)} tall · 412 triangles at rest`,
    source: `${PARAMS} · ${T}floor.js:80`,
  },
  {
    key: "Glass top",
    value: `${FP.topColor} · roughness ${FP.topRough} · transmission ${FP.topTrans} in stills, opaque and colour-matched live · rear corner ${FP.frostCorner} darker (radius ${FP.frostCornerR}), baked into the frost`,
    source: `${T}opaque-glass.js:18-31 · ${T}textures.js:165-166`,
  },
  {
    key: "Ground and fog",
    value: `floor ${FP.floorColor}, clearcoat ${FP.floorCoat} · fog ${FP.fogColor} from distance + ${FP.fogNear} to + ${FP.fogFar}`,
    source: `${T}floor.js:45-48 · ${T}floor-material.js:15`,
  },
  {
    key: "Light rig",
    value: `studio panels (top ${FP.envTop}, ground ${FP.envGround}, two strips ${FP.envStrip}) on ${FP.envBase} at ${FP.envI} · hemisphere ${FP.hemi} over ${FP.hemiGround} · key light ${FP.dir}`,
    source: `${T}materials.js:10-39 · ${T}floor.js:166-169`,
  },
  {
    key: "Output pass",
    value: `Neutral tone mapping at exposure ${FP.exposure} · static film grain ${FP.filmGrain} · 8-bit sRGB with 4x MSAA at full DPR`,
    source: `${T}lean.js:50-71 · ${T}floor-perf.js:1-8`,
  },
];

/** The live specimen's box and what the floor costs while it is on screen. */
export const FLOOR_VALUES: readonly ValueRow[] = [
  { part: "Box", token: "--ds-color-container", value: "#e3e5e8, radius 48 (32 under md), overflow hidden, the floor fills it", source: `${W}Hero.tsx:122-125` },
  { part: "Aspect", value: "0.45 to 2.6, outside it the field's built edge shows", source: `${T}viewport.js:9` },
  { part: "Pictures", value: "768px, 512px under 768 wide, chosen once at mount", source: "components/tiles/TileFloor.tsx:53" },
  { part: "Intro delay", value: `${INTRO_DELAY} here and in the container hero, 1.85 (FULL_TILES_AT) in the full view`, source: `${W}Hero.tsx:139 · ${W}hero-intro.ts:16` },
  { part: "Camera pull", token: "distScale", value: "1, and 1.5 in the full view from 1024 wide (smaller tiles)", source: `${W}Hero.tsx:143-149` },
  { part: "Clear top", value: "the hero lowers the view so the highest tile sits 12 under the copy", source: `${W}Hero.tsx:26` },
  { part: "Cost", value: "1 WebGL context, about 74 pictures per cast, GPU memory in the hundreds of MB", source: `${T}lean.js:4-9` },
  { part: "Window listeners", value: "keydown R (resets every character) and window.__floorReady", source: `${T}interact.js:123-130 · ${T}floor.js:279` },
];

export const FLOOR_PROPS: readonly PropRow[] = [
  { name: "className", type: "string", note: "the box the engine fills, give it a size" },
  { name: "onReady", type: "(floor: FloorHandle) => void", note: "fires before the intro, the handle has reset, setClearTop and dispose" },
  { name: "onConvert", type: "() => void", note: "once per character that becomes their AI copy" },
  { name: "introDelay", type: "number", default: "0", note: "seconds the bare floor holds before the tiles rise" },
  { name: "distScale", type: "number", default: "1", note: "pulls the camera back for smaller tiles" },
  { name: "mixWaves", type: "boolean", default: "false", note: "the second cast in the middle of the first wave" },
  { name: "aiBase", type: "string", default: '"/tiles-holo"', note: "where chars-ai/ is read from" },
  { name: "spentTint", type: "string", default: '"#e3f3ff"', note: "overrides the params file's value" },
];

export const FLOOR_CODE = `import { TileFloor, type FloorHandle } from "@/components/tiles/TileFloor";
import { WaveButton } from "@/components/website/HeroBits";

<div className="relative h-[520px] overflow-hidden rounded-[48px] max-md:rounded-[32px] bg-[#e3e5e8]">
  <TileFloor className="absolute inset-0" introDelay={${INTRO_DELAY}} onReady={setFloor} />
  <div className="absolute bottom-5 right-5 z-20">
    <WaveButton full busy={busy} onClick={sendWave} />
  </div>
</div>`;

export const WAVE_STATES: readonly KeyRow[] = [
  { key: "rest", value: "the icon alone, ink at 70% in the pill, slate-400 bare", source: `${W}HeroBits.tsx:96-97` },
  { key: "hover", value: "text turns accent over 200ms, the label 'Next wave' fades in and widens 0 to 80 in the pill", source: `${W}HeroBits.tsx:94-108` },
  { key: "focus-visible", value: "no ring of its own, the browser's default outline shows", source: `${W}HeroBits.tsx:89-98` },
  { key: "busy", value: "a 16 ring at 1.75 spins in the icon's place, aria-busy, until the wave's flip begins", source: `${W}HeroBits.tsx:113-114` },
];

export const WAVE_VALUES: readonly ValueRow[] = [
  { part: "Pill", value: "h 40, rounded full, border slate-200 80%, white 90%, px 12, #0a1b33 at 70%", source: `${W}HeroBits.tsx:96` },
  { part: "Bare", value: "p 4, gap 6, slate-400, margin-right -40 (0 under md)", source: `${W}HeroBits.tsx:97` },
  { part: "Label", value: "12px, leading 1, opacity 0 to 1, max-width 0 to 80 and margin 6 on hover, 200ms", source: `${W}HeroBits.tsx:105-108` },
  { part: "Busy ring", value: "16 × 16, border 1.75 currentColor, top transparent, animate-spin", source: `${W}HeroBits.tsx:114` },
];

export const WAVE_PROPS: readonly PropRow[] = [
  { name: "full", type: "boolean", note: "the pill, for over the floor and the full view, bare otherwise" },
  { name: "busy", type: "boolean", default: "false", note: "the next cast still loading" },
  { name: "onClick", type: "() => void", note: "calls the floor handle's reset()" },
];

export const WAVE_CODE = `import { WaveButton } from "@/components/website/HeroBits";

<WaveButton full busy={busy} onClick={sendWave} />`;
