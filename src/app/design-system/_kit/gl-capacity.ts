// The budget's pool sizes and the cost a heavy specimen claims, kept free of React so server modules
// (the performance section's tables) can read the same numbers the client ledger in gl-budget.ts enforces.
export type HeavyCost = {
  /** WebGL units: one per live context (a canvas, a liquid, a portrait) */
  gl?: number;
  /** holds the one tile floor slot */
  floor?: boolean;
  /** live iframes */
  frames?: number;
};

export type Pools = { gl: number; floor: number; frames: number };
export const CAPACITY: Readonly<Pools> = { gl: 8, floor: 1, frames: 8 };
