// The live floor's and the wave button's Anatomy pins and the box shapes, kept apart from the scene data
// so the client leaves never pull floor-params.json into the browser bundle.
import type { HeldPin } from "./held-pin";

const W = "components/website/";
const CSS = "app/design-system/sections/effects/floor.module.css";

/** The live floor's introDelay, the container hero's (Hero.tsx:139), in seconds. */
export const INTRO_DELAY = 0.5;

/** The live floor spec's anchor, which the tile states section links to. */
export const FLOOR_LIVE_ID = "ds-floor-live";

/** The live floor's parts that are always in the DOM (the canvas only exists while the slot is live). These
 *  two are the guide's stand-ins, measured as drawn here, with the hero's own values beside them. */
export const FLOOR_PINS: readonly HeldPin[] = [
  {
    selector: "[data-floor-box]",
    name: "Stand-in box",
    token: "--ds-color-container · --ds-radius-2xl",
    value: "radius 48, 32 in the phone shape, as the hero's (Hero.tsx:125) · 520 tall, the hero's is 664 · the floor fills it",
    source: `${CSS}:17,20-21,24`,
    expect: ["height: 520px;", "border-radius: 48px;", "background: var(--ds-color-container);", "border-radius: 32px;"],
  },
  {
    selector: "[data-floor-wave]",
    name: "Wave wrapper",
    value: "bottom 20 · right 20 · z 20 · the hero's sits there on phones only (Hero.tsx:258), from md the button is under the box",
    source: `${CSS}:27-29`,
    expect: ["right: 20px;", "z-index: 20;"],
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
export const WAVE_PINS: readonly HeldPin[] = [
  {
    selector: "button",
    name: "Pill",
    token: "--ds-radius-full",
    value: "40 tall · px 12 · white 90% · hairline",
    source: `${W}HeroBits.tsx:96`,
    expect: "h-10 rounded-full border border-slate-200/80 bg-white/90 px-3",
    padding: true,
  },
  { selector: "button svg", name: "Icon", value: "Waves 16 at 1.75", source: `${W}HeroBits.tsx:116`, expect: 'className="w-4 h-4" strokeWidth={1.75}' },
];
