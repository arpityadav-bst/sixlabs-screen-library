// The tile's five states: the parameter colours of each look, read from floor-params.json, and the
// transitions between them with their timings. Focused is the params' states.default, activated is
// states.shine, and spent takes the tint TileFloor passes.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { FP, n, PARAMS, secs, type SlabState } from "./floor-params-data";

const T = "tiles/";
const F = FP.states.default;
const A = FP.states.shine;
const SPENT = "#e3f3ff"; // TileFloor's spentTint default (components/tiles/TileFloor.tsx:29)

export type Swatch = { name: string; color: string };
export type TileState = {
  id: "default" | "focused" | "activated" | "spent" | "resetting";
  /** the top face: the floor's own render, or a gradient schematic of the params */
  face: { image: string; width: number; height: number } | { fill: string; rim: string };
  ramp: readonly Swatch[];
  look: readonly string[];
  timing: string;
  source: string;
};

const angle = (d: readonly number[]) => Math.round((Math.atan2(d[1], d[0]) * 180) / Math.PI + 90);
const slab = (s: SlabState) => ({
  fill: `linear-gradient(${angle(s.actGradDir)}deg, ${s.actDarkCol}, ${s.actLightCol})`,
  rim: s.actRim,
});

export const TILE_STATES: readonly TileState[] = [
  {
    id: "default",
    face: { image: "/tiles/float/01-snapback.webp", width: 768, height: 721 },
    ramp: [
      { name: "top", color: FP.topColor },
      { name: "far tops", color: FP.topAtten },
      { name: "floor", color: FP.floorColor },
      { name: "fog", color: FP.fogColor },
    ],
    look: [`ghost bands ${FP.ghostDark} dark, ${FP.ghostWidth} wide`, `white rims ${FP.rimLine}, a trace ${FP.rimTopBottom} top and bottom`],
    timing: `rises on hover, tau ${FP.riseTau} (${secs(FP.riseTau)})`,
    source: `${T}textures.js:153-170 · ${T}materials.js:72-87`,
  },
  {
    id: "focused",
    face: slab(F),
    ramp: [
      { name: "top dark", color: F.actDarkCol },
      { name: "top light", color: F.actLightCol },
      { name: "body", color: F.actBody },
      { name: "navy pool", color: F.actUnderCol },
      { name: "sheen", color: F.actSheenCol },
      { name: "band", color: F.actBandCol },
      { name: "head glow", color: F.actHeadCol },
      { name: "walls", color: F.actSide },
      { name: "foot line", color: F.actLowRimCol },
    ],
    look: [`lifts ${FP.lift}, the slab fading in over the glass`, `metal walls ${F.actSideMetal} mirror the floor, contact shadow ${F.nearShadow}`],
    timing: "sinks back the moment the pointer leaves",
    source: `${T}focus-rig.js:60-77 · ${PARAMS} states.default`,
  },
  {
    id: "activated",
    face: slab(A),
    ramp: [
      { name: "top dark", color: A.actDarkCol },
      { name: "top light", color: A.actLightCol },
      { name: "rim", color: A.actRim },
      { name: "beam", color: A.actShineCol },
      { name: "walls", color: A.actSide },
      { name: "wall glow", color: A.actSideDark },
      { name: "floor pool", color: FP.glowCol },
      { name: "halo", color: A.haloCol },
      { name: "spill", color: A.nearSpillCol },
    ],
    look: [`emissive ${A.actEmis}, walls glow ${A.actSideGlowI}, no mirror`, `floor pool ${A.glowS}, halo ${A.haloAmt}, spill ${A.nearSpill}`],
    timing: `locked for ACT 0.9 (${secs(0.9)}), the bust turns hologram`,
    source: `${T}sweep.js:10 · ${PARAMS} states.shine`,
  },
  {
    id: "spent",
    face: { fill: SPENT, rim: "#ffffff" },
    ramp: [
      { name: "TileFloor", color: SPENT },
      { name: "params file", color: FP.spentTint },
      { name: "engine fallback", color: "#b8bbc1" },
    ],
    look: ["keeps its hologram, ignores the pointer", "wall glow takes the tint in full, the rim line half"],
    timing: `fades over DEACT 1.05 (${secs(1.05)}), then sinks`,
    source: `${T}interact.js:46-48 · ${T}opaque-glass.js:34-49`,
  },
  {
    id: "resetting",
    face: { fill: `linear-gradient(90deg, ${SPENT} 50%, ${FP.topColor} 50%)`, rim: "#ffffff" },
    ramp: [
      { name: "from", color: SPENT },
      { name: "to", color: FP.topColor },
    ],
    look: ["flips in place about its top-right edge", "edge-on, it swaps to the other cast's human"],
    timing: "0.75s per tile, staggered 1.3s left to right",
    source: `${T}autoplay.js:11-12 · ${T}autoplay.js:57-82`,
  },
];

/** The transitions, one row per edge of the machine. */
export const TRANSITIONS: readonly KeyRow[] = [
  { key: "default → focused", value: "the pointer over a live tile, the cursor turns to a pointer only there", source: `${T}interact.js:112-114` },
  { key: "focused → default", value: "the pointer leaves: the same motion, reversed", source: `${T}interact.js:86-89` },
  { key: "focused → activated", value: "a click: the tile locks and plays to the end whatever the pointer does", source: `${T}interact.js:118-122` },
  { key: "activated → spent", value: `S reaches ACT 0.9 and the fade reaches 1: tinted at once, then it sinks`, source: `${T}interact.js:44-48` },
  { key: "spent → resetting", value: "the R key, autoplay's wave once all on screen are spent, or reset()", source: `${T}interact.js:123-130 · ${T}autoplay.js:96-110` },
  { key: "resetting → default", value: "lands as a default tile with a new human, live again", source: `${T}autoplay.js:65-75` },
  { key: "two rigs", value: "one tile settles while the next rises, and with both locked a new hover is ignored", source: `${T}floor.js:165` },
];

/** The drawer: the motion constants behind every transition. */
export const STATE_VALUES: readonly ValueRow[] = [
  { part: "Speed", token: "animSpeed", value: `${FP.animSpeed}, every stage plays this much faster`, source: `${T}interact.js:40` },
  { part: "Rise and sink", token: "riseTau", value: `${FP.riseTau} exponential ease, ${secs(FP.riseTau)} on the wall clock`, source: `${T}interact.js:61` },
  { part: "Activation fade-in", value: `0.08 linear, then smoothstep (${secs(0.08)})`, source: `${T}interact.js:52-56` },
  { part: "Commit", token: "COMMIT_SECONDS", value: `0.25 of sweep (${secs(0.25)}): an unlocked activation left after it finishes first. Every click locks today, so it never fires`, source: `${T}sweep.js:13 · ${T}interact.js:25-30` },
  { part: "Activation", token: "ACT_SECONDS", value: `0.9 (${secs(0.9)})`, source: `${T}sweep.js:10` },
  { part: "Deactivation", token: "DEACT_SECONDS", value: `1.05, everything fades together (${secs(1.05)})`, source: `${T}sweep.js:10` },
  { part: "Lift", token: "lift", value: `${FP.lift} of a tile`, source: PARAMS },
  { part: "Glass hides", value: `once the slab covers it, slab opacity min(1, L × ${n(1.25)})`, source: `${T}focus-rig.js:60-77` },
];

/** The drawer: every colour of every ramp, named, with where it is read from. */
export const RAMP_VALUES: readonly ValueRow[] = TILE_STATES.flatMap((st) =>
  st.ramp.map((c) => ({ part: `${st.id}, ${c.name}`, value: c.color, source: st.source })),
);

/** The Do / Don't pair: which spent tint wins. */
export const SPENT_DO = { color: SPENT, label: `TileFloor spentTint ${SPENT}` };
export const SPENT_DONT = { color: FP.spentTint, label: `params spentTint ${FP.spentTint}` };
