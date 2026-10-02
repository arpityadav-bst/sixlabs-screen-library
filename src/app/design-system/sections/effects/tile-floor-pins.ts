// The live floor's and the wave button's Anatomy pins and the box shapes, kept apart from the scene data
// so the client leaves never pull floor-params.json into the browser bundle.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";

const W = "components/website/";
const CSS = "app/design-system/sections/effects/floor.module.css";

/** The live floor's introDelay, the container hero's (Hero.tsx:139), in seconds. */
export const INTRO_DELAY = 0.5;

/** The live floor spec's anchor, which the tile states section links to. */
export const FLOOR_LIVE_ID = "ds-floor-live";

/** The live floor's parts that are always in the DOM (the canvas only exists while the slot is live). These
 *  two are the guide's stand-ins, measured as drawn here, with the hero's own values beside them. */
export const FLOOR_PINS: readonly AnatomyPin[] = [
  {
    selector: "[data-floor-box]",
    name: "Stand-in box",
    token: "--ds-color-container · --ds-radius-2xl",
    value: "radius 48, 32 in the phone shape, as the hero's (Hero.tsx:125) · 520 tall, the hero's is 664 · the floor fills it",
    source: `${CSS}:14-24`,
  },
  {
    selector: "[data-floor-wave]",
    name: "Wave wrapper",
    value: "bottom 20 · right 20 · z 20 · the hero's sits there on phones only (Hero.tsx:258), from md the button is under the box",
    source: `${CSS}:25-30`,
  },
];

/** The box shapes the live specimen can take, to watch the camera reframe. */
export const SHAPES = [
  { value: "hero", label: "Full width" },
  { value: "design", label: "16:9" },
  { value: "phone", label: "Phone" },
] as const;

export type Shape = (typeof SHAPES)[number]["value"];

/** The wave button. */
export const WAVE_PINS: readonly AnatomyPin[] = [
  { selector: "button", name: "Pill", token: "--ds-radius-full", value: "40 tall · px 12 · white 90% · hairline", source: `${W}HeroBits.tsx:96`, padding: true },
  { selector: "button svg", name: "Icon", value: "Waves 16 at 1.75", source: `${W}HeroBits.tsx:116` },
];
