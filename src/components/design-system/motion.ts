// The motion values new components read, built from token-motion.ts so no local copy of the ease, a
// duration or the rise appears. A name that is not in the token set throws, so a typo never reads as 0.
import { DURATIONS, EASE_OUT, SCALES, SPRING_VALUES, TRAVEL } from "./token-motion";

export const EASE: [number, number, number, number] = [...EASE_OUT];
export const EASE_CSS = `cubic-bezier(${EASE_OUT.join(", ")})`;

const seconds = (name: string) => {
  const t = DURATIONS.find((d) => d.name === `dur-${name}`);
  if (!t) throw new Error(`motion.ts: no duration token dur-${name}`);
  return parseFloat(t.value) / 1000;
};

/** Durations in seconds, as motion/react takes them. */
export const DUR = {
  press: seconds("press"),
  exit: seconds("exit"),
  quick: seconds("quick"),
  ui: seconds("ui"),
  line: seconds("line"),
  panel: seconds("panel"),
  rise: seconds("rise"),
  sweep: seconds("sweep"),
} as const;

/** Springs as motion/react transitions. */
export const SPRING = {
  press: { type: "spring", ...SPRING_VALUES.press },
  thumb: { type: "spring", ...SPRING_VALUES.thumb },
  pop: { type: "spring", ...SPRING_VALUES.pop },
} as const;

const scale = (name: string) => {
  const t = SCALES.find((d) => d.name === `scale-${name}`);
  if (!t) throw new Error(`motion.ts: no scale token scale-${name}`);
  return parseFloat(t.value);
};

/** Press and grow scales, one per job, read from the SCALES tokens. Classes read the presses as
 *  --ds-scale-press-* (scale-(--ds-scale-press-pill) and so on), never a copied number. */
export const SCALE = {
  /** round small targets: icon buttons, avatars */
  pressRound: scale("press-round"),
  /** pills, chips, segments, tabs and text actions */
  pressPill: scale("press-pill"),
  /** whole cards */
  pressCard: scale("press-card"),
  /** choice marks under a held press */
  pressMark: scale("press-mark"),
  /** panels arriving and leaving: menus, select panels, tooltips, toasts, dialogs */
  panel: scale("panel"),
  /** a solid pill growing on hover below lg, and from lg as Try now does */
  grow: scale("grow"),
  growLarge: scale("grow-large"),
} as const;

const travel = (name: string) => {
  const t = TRAVEL.find((d) => d.name === name);
  if (!t) throw new Error(`motion.ts: no travel token ${name}`);
  return parseFloat(t.value);
};

/** The section entrance: rise-y up over dur-rise on the ease. */
export const RISE = { y: travel("rise-y"), duration: seconds("rise") } as const;
