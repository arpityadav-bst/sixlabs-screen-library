// The accent water's values, written once: the constants the specimen passes to accentWaveGL, the level
// formula AccentWave runs on the scroll, the pins, the drawer rows and the event contract. The rise's
// length comes from ScrubLine's own WAVE_VH, a client export, so that row lives in scrub-exports.ts.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { HeldPin } from "./held-pin";

/** AccentWave.tsx:20-26, passed to accentWaveGL as the site passes them */
export const WATER = { accent: [26, 109, 255], arc: 90, band: 480, pitch: 6, grain: 0.07 };
export const FULL_AT = 0.9;
export const DRAINED_BELOW = 0.8;
export const WATER_H = 640;

export type Dir = 1 | -1;

/** The edge's middle for a share k of the rise (dir 1) or of the drain (dir -1), eased by smoothstep,
 *  as AccentWave.tsx:87-91 works it out from the scroll. */
export function waterLevel(k: number, dir: Dir, h: number, band = WATER.band): number {
  const ke = k * k * (3 - 2 * k);
  const { arc, pitch } = WATER;
  return dir === -1 ? h + arc + pitch * 2 - ke * (h + arc + band + pitch * 5) : h + band - ke * (h + band + arc + pitch * 3);
}

export type WaterPreset = "empty" | "rising" | "full" | "draining";
export const PRESETS: Record<WaterPreset, { k: number; dir: Dir }> = {
  empty: { k: 0, dir: 1 },
  rising: { k: 0.55, dir: 1 },
  full: { k: 1, dir: 1 },
  draining: { k: 0.5, dir: -1 },
};
export const PRESET_OPTIONS = [
  { value: "empty" as const, label: "Empty" },
  { value: "rising" as const, label: "Rising" },
  { value: "full" as const, label: "Full" },
  { value: "draining" as const, label: "Draining" },
];

/** the parts the anatomy pins: boxes laid over the canvas at the edge's middle, from the same geometry */
export function waterMarks(level: number, dir: Dir, h: number) {
  const { arc, band, pitch } = WATER;
  const span = (a: number, b: number) => {
    const top = Math.max(0, Math.min(h, Math.min(a, b)));
    const bottom = Math.max(0, Math.min(h, Math.max(a, b)));
    return { top, height: bottom - top };
  };
  return dir === 1
    ? { band: span(level - band, level), edge: span(level, level + arc), solid: span(level + pitch * 2, h) }
    : { band: span(level, level + band), edge: span(level - arc, level), solid: span(0, level - pitch * 2) };
}

export const WATER_PINS: readonly HeldPin[] = [
  {
    selector: '[data-ds="water-stage"]',
    name: "Water canvas",
    token: "--ds-z-copy",
    value: "fixed inset-0 at z 20 on the site, viewport x DPR up to 2",
    source: "AccentWave.tsx:193",
    expect: "fixed inset-0 z-20",
    side: "left",
  },
  {
    selector: '[data-ds="water-band"]',
    name: "Halftone band",
    value: "6px grid over 480px, dots 0.35 to 4.32px by s^1.4",
    source: "accent-wave-gl.ts:28,39-41",
    expect: ["into < uBand + uPitch * 2.0", "pow(s, 1.4)", "0.15 + s * 0.95"],
    side: "right",
  },
  {
    selector: '[data-ds="water-edge"]',
    name: "Edge arc",
    value: "90px deep, level + dir x 90 x (2x / w - 1)^2",
    source: "accent-wave-gl.ts:19",
    expect: "uLevel + uDir * uArc * u * u",
    side: "right",
  },
  {
    selector: '[data-ds="water-solid"]',
    name: "Solid",
    token: "--ds-color-accent",
    value: "#1a6dff mixed 7% toward grey grain, 12px short of the edge",
    source: "accent-wave-gl.ts:24,48",
    expect: ["e + uDir * uPitch * 2.0", "mix(uAccent, vec3(grain), uGrain)"],
    side: "left",
  },
];

export const WATER_VALUES: readonly ValueRow[] = [
  { part: "Accent", token: "--ds-color-accent", value: "[26, 109, 255] (#1a6dff)", source: "AccentWave.tsx:20" },
  { part: "Perceived solid", value: "about #216ef6, the accent under 7% grain", source: "AccentWave.tsx:23" },
  { part: "Edge", value: "y = level + dir x 90 x (2x / w - 1)^2", source: "AccentWave.tsx:21, accent-wave-gl.ts:19" },
  { part: "Band", value: "480px of halftone on the far side of the edge", source: "AccentWave.tsx:22" },
  { part: "Grid", value: "6px, a dot of radius 3 touches its neighbours", source: "AccentWave.tsx:26" },
  { part: "Dot radius", value: "0.35 to 4.32px (pitch x 0.72) by s^1.4", source: "accent-wave-gl.ts:39" },
  { part: "Dot opacity", value: "min(1, 0.15 + 0.95 s), overlaps add up, 3 rows into the solid", source: "accent-wave-gl.ts:34,41" },
  { part: "Solid stop", value: "12px (pitch x 2) short of the edge", source: "accent-wave-gl.ts:24" },
  { part: "Grain", value: "160px random grey tile mixed in at 0.07", source: "accent-wave-gl.ts:47-48,85-89" },
  { part: "Drain", value: "1 screen past the players' foot, the mirror arc", source: "AccentWave.tsx:25,176" },
  { part: "Full", value: `announced at ${FULL_AT}, drained below ${DRAINED_BELOW}`, source: "AccentWave.tsx:24,81,95" },
];

export const WATER_PROPS: readonly PropRow[] = [
  { name: "accentWaveGL(canvas, k)", type: "{ draw(frame, dpr) } | null", note: "null where WebGL is missing, size the canvas first" },
  { name: "k.accent", type: "number[]", default: "[26, 109, 255]" },
  { name: "k.arc", type: "number", default: "90" },
  { name: "k.band", type: "number", default: "480" },
  { name: "k.pitch", type: "number", default: "6" },
  { name: "k.grain", type: "number", default: "0.07" },
  { name: "frame", type: "{ w, h, level, dir: 1 | -1, dots } | null", note: "null clears it, an unchanged frame is not drawn" },
];

export const WATER_CODE = `import { accentWaveGL } from "@/components/website/accent-wave-gl";

canvas.width = w * dpr;
canvas.height = h * dpr;
const water = accentWaveGL(canvas, { accent: [26, 109, 255], arc: 90, band: 480, pitch: 6, grain: 0.07 });
water?.draw({ w, h, level, dir: 1, dots: true }, dpr);`;

export const WATER_EVENTS: readonly KeyRow[] = [
  { key: "accentwave", value: `window CustomEvent, detail { filled: true } once the view is ${FULL_AT * 100}% full`, source: "AccentWave.tsx:64-70,95" },
  { key: "drained", value: `detail { filled: false } below ${DRAINED_BELOW * 100}%, so a step back does not undo the players`, source: "AccentWave.tsx:81" },
  { key: "Header", value: "turns solid white while filled", source: "Header.tsx:40,56" },
  { key: "Players", value: "come in once filled", source: "Players.tsx:53-56" },
  { key: "redraw", value: "an unchanged frame is not drawn again", source: "accent-wave-gl.ts:113-115" },
  { key: "context lost", value: "rebuilt and drawn again when it is restored", source: "accent-wave-gl.ts:52-56,104-108" },
  { key: "no WebGL", value: "a 2D canvas draws the same geometry", source: "AccentWave.tsx:98-150" },
  { key: "?off=wave", value: "the solid blue alone, no dots", source: "AccentWave.tsx:47" },
  { key: "teardown", value: "none: the guide loses the context through WEBGL_lose_context when the panel scrolls away", source: "accent-wave-gl.ts:51" },
];
