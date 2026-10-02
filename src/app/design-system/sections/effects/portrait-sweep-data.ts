// The Human / AI sweep's values, written once. The frame size and the band and dome depths are read from
// swap-gl's own exports (SIZE, SWEEP), so the guide prints what the shader runs on.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import { SIZE, SWEEP } from "@/components/website/swap-gl";

export const SWEEP_S = 1.5;

export const SWEEP_PINS: readonly AnatomyPin[] = [
  { selector: '[data-ds="sweep-portrait"]', name: "Portrait", value: `${SIZE.w} x ${SIZE.h} frame, height set by its parent`, source: "PortraitSwap.tsx:213", side: "left" },
  { selector: '[data-ds="sweep-portrait"] canvas', name: "Band canvas", value: `band ${SWEEP.band}, dome ${SWEEP.rise}, pitch 7, chroma 10 (frame px)`, source: "PortraitSwap.tsx:20-24", side: "right" },
  { selector: '[data-ds="sweep-stage"] [role="radiogroup"]', name: "Human / AI switch", value: "white 15% track, white thumb on spring 500/40", source: "ModeToggle.tsx:26-51", side: "right" },
];

export const SWEEP_VALUES: readonly ValueRow[] = [
  { part: "Frame", value: `${SIZE.w} x ${SIZE.h} (SIZE), every number below in its px`, source: "swap-gl.ts:68" },
  { part: "Band", value: `0.6 of the height, ${SWEEP.band} deep`, source: "PortraitSwap.tsx:20, swap-gl.ts:74" },
  { part: "Dome", value: `0.35 of the height, ${SWEEP.rise} tall: line = mid + rise x (1 - sqrt(1 - u^2))`, source: "PortraitSwap.tsx:21,108-111" },
  { part: "Halftone", value: "7px grid, radius 7 x 0.72 x s^1.3 (up to 5.04), dropped under 0.3", source: "PortraitSwap.tsx:23,149" },
  { part: "Chromatic split", value: "red and blue 10px to either side, held to the copy's outline", source: "PortraitSwap.tsx:24-29" },
  { part: "Laser", token: "--ds-color-holo-laser", value: "3px white core, glow rgb(120, 175, 255) at 0.142 x exp(-d^2 / 128)", source: "swap-gl.ts:56,73" },
  { part: "Duration", token: "--ds-dur-swap", value: "1.5s", source: "PortraitSwap.tsx:19" },
  { part: "Ease", token: "--ds-ease-in-out", value: "4k^3 under 0.5, else 1 - (-2k + 2)^3 / 2", source: "PortraitSwap.tsx:187" },
  { part: "Travel", value: "mid from H + band / 2 to -(band / 2 + rise)", source: "PortraitSwap.tsx:189" },
];

export const SWEEP_PROPS: readonly PropRow[] = [
  { name: "human, ai", type: "Clip", note: "{ src, straight, stacked, still } from PLAYERS" },
  { name: "mode", type: '"human" | "ai"', note: "the first value settles, every change sweeps" },
  { name: "label", type: "string", note: "the portrait's accessible name, the AI copy adds ', AI copy'" },
  { name: "format", type: '"webm" | "stacked" | "still"', default: '"webm"', note: "the site passes useClipFormat()" },
  { name: "load", type: "boolean", default: "true", note: "false holds both clips back" },
  { name: "className", type: "string", note: "sizes the portrait, Players passes h-[var(--ph)] w-auto" },
];

export const SWEEP_CODE = `import { PortraitSwap } from "@/components/website/PortraitSwap";
import { ModeToggle } from "@/components/website/ModeToggle";

<PortraitSwap human={p.video!} ai={p.aiVideo!} mode={mode} label={p.title} format="still" className="h-[480px] w-auto" />
<ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-sweep" />`;

export const SWEEP_LANES: readonly TimelineLane[] = [
  { label: "Band", items: [{ label: "runs up the portrait", at: 0, to: SWEEP_S }, { label: "fastest, half way", at: SWEEP_S / 2 }] },
  { label: "Copies", items: [{ label: "both follow the cursor", at: 0, to: SWEEP_S }, { label: "the new copy settles", at: SWEEP_S }] },
  { label: "Doodles", items: [{ label: "the AI starts copying", at: 0.6 }] },
];

export const FORMAT_ROWS: readonly KeyRow[] = [
  { key: "stacked", value: "one WebGL canvas draws both copies and the band from frames already on the GPU (Chrome, Safari, iPhones)", source: "StackedSwap.tsx:18, swap-gl.ts:76" },
  { key: "webm", value: "two layers cut by a clip-path polygon every frame, plus a 2D band canvas", source: "PortraitSwap.tsx:176-205" },
  { key: "still", value: "the same 2D path over the two stills, no video", source: "PortraitSwap.tsx:213-258" },
  { key: "?clips", value: "webm, stacked or still forces one format for a visit", source: "useClipFormat.ts:42" },
  { key: "at once", value: "the first showing, an unchanged mode, reduced motion or a copy with no frame yet swap with no band", source: "PortraitSwap.tsx:84" },
  { key: "auto", value: "flips every 10s while in view, until the visitor uses the switch", source: "usePlayerMode.ts:11" },
  { key: "cost", value: "stacked holds one context and two hidden videos, two during a player change (popLayout)", source: "Players.tsx:142" },
  { key: "teardown", value: "swapGL has no dispose, so the guide loses its context when the panel scrolls away", source: "swap-gl.ts:76" },
];

export const SWITCH_ROWS: readonly KeyRow[] = [
  { key: "rest", value: "white 80% label on the white 15% track", source: "ModeToggle.tsx:43" },
  { key: "hover", value: "white label, 200ms colour", source: "ModeToggle.tsx:41,43" },
  { key: "selected", value: "#0a1b33 label on the white thumb, shadow 0 6px 16px -8px", source: "ModeToggle.tsx:43,49" },
  { key: "thumb", value: "slides on layoutId, spring 500 / 40", source: "ModeToggle.tsx:47-50" },
  { key: "focus-visible", value: "the browser's own ring, the switch sets none", source: "ModeToggle.tsx:40-44" },
];
