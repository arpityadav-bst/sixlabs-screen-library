// The floor's look settings, read from the very file the engine fetches (public/tiles/floor-params.json),
// so every value the floor sections print is the value the floor draws with at this build. Read only.
import raw from "../../../../../public/tiles/floor-params.json";

export const FP = raw;
export const PARAMS = "floor-params.json";

/** Sweep seconds (the engine's clock) to wall-clock seconds: every stage runs animSpeed times faster. */
export const wall = (s: number) => s / FP.animSpeed;

/** A number as the source writes it, at most `d` decimals. */
export const n = (v: number, d = 3) => String(+v.toFixed(d));

/** A wall-clock time in seconds, two decimals ("0.53s"). */
export const secs = (s: number) => `${n(wall(s), 2)}s`;

/** The look of one focused or activated slab, as the params file names it. */
export type SlabState = (typeof FP.states)["default"];
