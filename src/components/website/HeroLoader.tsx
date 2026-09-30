"use client";

// The full view's loader (Hero.tsx, full): until the tile floor is ready, the hero shows only its grey and,
// in the middle, the SixLabs mark (the header's logo art, flat as its logo file) with "Loading" under it.
// Its three arcs take turns: starting from the one that reaches up to the top right and going clockwise, each
// hops a little out from the core and back (.logo-hop in globals.css). When the floor is ready, it fades.
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ARCS } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
const HOP = 5; // how far an arc hops out, in the mark's units (about 3px at this size)
const ORDER = [1, 2, 0]; // the right arc (up to the top right), the bottom left one, the top left one

// each arc's hop: away from the core, toward its own centre (ARCS order: top left, right, bottom left)
const HOPS = [
  [-0.538, -0.843],
  [1, -0.011],
  [-0.565, 0.825],
].map(([x, y]) => ({ x: x * HOP, y: y * HOP }));

export function HeroLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease } }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-5"
          role="status"
        >
          <svg viewBox="12 7 107 117" className="h-16 w-16" aria-hidden>
            <circle cx="65.52" cy="65.76" r="15.41" fill="#030D2D" />
            {ORDER.map((k, i) => (
              <path
                key={k}
                d={ARCS[k]}
                fill="#1770EF"
                className="logo-hop"
                style={
                  {
                    "--hx": `${HOPS[k].x}px`,
                    "--hy": `${HOPS[k].y}px`,
                    animationDelay: `${i * 0.4}s`,
                  } as CSSProperties
                }
              />
            ))}
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Loading
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
