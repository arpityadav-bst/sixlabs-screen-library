"use client";

// The full view's loader (Hero.tsx, full): until the tile floor is ready, the hero shows only its grey and,
// in the middle, the SixLabs mark (its own SVG shapes and colours, public/brand/sixlabs-mark.svg) with
// "Loading" under it. It is there from the first paint (in the server's HTML, no fade in) and moves at once:
// its three arcs, one at a time, ease a little out from the core and back, round clockwise from the arc that
// reaches up to the top right, each starting as the one before settles (.logo-arc-* in globals.css). Each
// piece is its own layer, so the browser moves them off the main thread and they stay smooth while the floor
// is being built. When the floor is ready, it fades.
import { AnimatePresence, motion } from "motion/react";
import { ARCS } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
const VIEW = "12 7 107 117"; // the mark with room round it for the arcs' travel
// the right arc (up to the top right), then clockwise: the bottom left one, the top left one; their turns a
// third of the cycle apart, the delays negative so the first hop is under way at the first frame
const ORDER = [1, 2, 0];
const NAVY = "#030D2D",
  BLUE = "#1770EF"; // the mark's own colours

export function HeroLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-5"
          role="status"
        >
          <div className="relative h-16 w-16" aria-hidden>
            <svg viewBox={VIEW} className="absolute inset-0 h-full w-full">
              <circle cx="65.52" cy="65.76" r="15.41" fill={NAVY} />
            </svg>
            {ORDER.map((k, i) => (
              <div
                key={k}
                className={`logo-arc-${k} absolute inset-0`}
                style={{ animationDelay: `${i * 0.5 - 1.5}s` }}
              >
                <svg viewBox={VIEW} className="h-full w-full">
                  <path d={ARCS[k]} fill={BLUE} />
                </svg>
              </div>
            ))}
          </div>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Loading
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
