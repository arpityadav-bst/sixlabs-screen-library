// The activation, frame by frame: the sweep timeline in sweep time S (sweep.js sweepValues), the rim's
// parts, and the glint, every colour read from floor-params.json.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import type { Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import BAKED from "@/tiles/baked-manifest.js";
import { FP, n, PARAMS, secs } from "./floor-params-data";

const T = "tiles/";
const F = FP.states.default;
const A = FP.states.shine;

/** The clocks: S is sweep time, wall clock is S / animSpeed. */
export const WALL_CLOCK = { label: "wall clock", factor: 1 / FP.animSpeed, unit: "s", step: 0.1 };

export const SWEEP_LANES: readonly TimelineLane[] = [
  {
    label: "Rim beam",
    items: [
      { label: "front corner", at: 0 },
      { label: "mid front edges", at: 0.17 },
      { label: "side corners", at: 0.3 },
      { label: "faint on the back edges", at: 0.3, to: 0.8 },
    ],
  },
  { label: "Flare", items: [{ label: "right corner", at: 0.3, to: 0.45 }] },
  {
    label: "Slab",
    items: [
      { label: "fade-in", at: 0, to: 0.08 },
      { label: "bright head, front to back", at: 0.1, to: 0.9 },
    ],
  },
  { label: "Blue light", items: [{ label: "shadows, floor glow, point light", at: 0.1, to: 0.9 }] },
  { label: "Spill and halo", items: [{ label: "out from the front corner", at: 0, to: 0.75 }] },
  { label: "Bust", items: [{ label: "human to hologram", at: 0.25, to: 0.85 }] },
  { label: "End", items: [{ label: "ACT reached, spent", at: 0.9 }] },
];

/** The drawer: the curve each lane follows, as sweepValues writes it. */
export const SWEEP_VALUES: readonly ValueRow[] = [
  { part: "Beam head", value: "0.95 to 0 by S 0.3, then to -1.1 by S 0.8", source: `${T}sweep.js:21` },
  { part: "Flare", value: "fade × smoothstep(0.3, 0.45, S)", source: `${T}sweep.js:22` },
  { part: "Bright head", value: "1.5 to -1.5 over S 0.1 to 0.9, soft edge 0.55", source: `${T}sweep.js:23` },
  { part: "Spill head", value: "1.5 to -1.5 over S 0 to 0.75", source: `${T}sweep.js:24` },
  { part: "Amount", value: "fade × smoothstep(0.1, 0.9, S)", source: `${T}sweep.js:25` },
  { part: "Convert", value: "smoothstep(0.25, 0.85, S)", source: `${T}sweep.js:26` },
  { part: "Clock", token: "animSpeed", value: `${FP.animSpeed}: the whole activation is ${secs(0.9)} on the wall clock`, source: `${T}interact.js:40` },
  { part: "Timings", value: "ACT 0.9, DEACT 1.05, COMMIT 0.25, all in S", source: `${T}sweep.js:10-13` },
];

/** The rim, numbered as the diagram numbers it. u = (x + z) / tile. */
export const RIM_ROWS: readonly KeyRow[] = [
  { key: "1 Front corner", value: `u +0.92, toward the camera: the beam starts here with a white-hot spot ${A.actHotCol} × ${A.actHotF}`, source: `${T}materials.js:141` },
  { key: "2 Front edges", value: `lit where u is ahead of the head, ${A.actShineCol} × ${A.actShine}`, source: `${T}materials.js:139-141` },
  { key: "3 Side corners", value: `u 0, reached at S 0.3, the right one flares ${A.actHotCol} × ${A.actHotR}`, source: `${T}materials.js:142` },
  { key: "4 Back edges", value: `the beam runs on at ${A.actBackRim} strength`, source: `${T}materials.js:139` },
  { key: "5 Glint", value: "near the rear corner, u -0.92, turned 45°", source: `${T}focus-rig.js:64` },
];

/** The glint: its shape, and its look in each state. */
export const GLINT_ROWS: readonly KeyRow[] = [
  {
    key: "Shape",
    value: `a loaf: top arch ${FP.glintTop} (exponent ${FP.glintTopQ}), bottom bulge ${FP.glintBottom} (exponent ${FP.glintBottomQ}), droop ${FP.glintDroop}, width ${FP.glintW}, about 12% of the tile, blurred ${FP.glintBlur} texture px`,
    source: `${T}textures.js:100-146`,
  },
  {
    key: "Focused",
    value: `fill ${F.glintFillCol} at ${F.glintFill} · edge ${F.glintEdgeCol} at ${F.glintEdgeA} · ring ${F.glintRingCol} at ${F.glintRingA}, width ${F.glintRingW} · warm specks ${F.glintWarm}`,
    source: `${PARAMS} states.default`,
  },
  {
    key: "Activated",
    value: `fill ${A.glintFillCol} at ${A.glintFill} · edge ${A.glintEdgeCol} at ${A.glintEdgeA} · ring ${A.glintRingCol} at ${A.glintRingA} · halo ${A.glintHaloCol} at ${A.glintHaloA}`,
    source: `${PARAMS} states.shine`,
  },
  {
    key: "Chromatic split",
    value: `glintCA ${A.glintCA}: red fringes the right end, blue the left · the glint widens ${n(FP.glintSpread * 100, 0)}% along its length as it activates`,
    source: `${T}focus-rig.js:70`,
  },
  { key: "Crossfade", value: "two glint meshes, the focused one fading out as the activated one fades in by amount", source: `${T}focus-rig.js:71-72` },
];

type Bake = { readonly file: string; readonly params: Readonly<Record<string, unknown>> };

/** The floor's own test for a bake, which bakedGlint copies. The build checks the text is still in the file,
 *  and the Glint spec shows it drifted when it is not. */
export const GLINT_MATCH: Assertion = {
  file: "tiles/baked-textures.js",
  needles: [
    "const matches = (P, params) => Object.entries(params).every(([k, v]) => JSON.stringify(P[k] ?? null) === JSON.stringify(v));",
  ],
};

/** The glint picture the floor loads for one look: the bake whose every setting still matches it, as
 *  GLINT_MATCH picks, or null when none does and the floor paints it at load. */
function bakedGlint(look: object): string | null {
  const P: Record<string, unknown> = { ...FP, ...look };
  const hit = (BAKED.glint as readonly Bake[]).find((e) =>
    Object.entries(e.params).every(([k, v]) => JSON.stringify(P[k] ?? null) === JSON.stringify(v)),
  );
  return hit ? `/tiles/baked/${hit.file}` : null;
}

/** The two glints as the floor loads them, each on a ground its ring or halo reads on. */
export const GLINT_PICTURES = [
  { look: "Focused", ground: "container", src: bakedGlint(F), alt: "The focused glint: a pale grey loaf inside a soft dark navy ring." },
  { look: "Activated", ground: "navy", src: bakedGlint(A), alt: "The activated glint: a near-white loaf in a light blue halo, its ends fringed red and blue." },
] as const;

/** The rim diagram's colours, from the activated look. */
export const RIM_COLOURS = { beam: A.actShineCol, hot: A.actHotCol, ring: A.glintRingCol, fill: A.glintFillCol };
