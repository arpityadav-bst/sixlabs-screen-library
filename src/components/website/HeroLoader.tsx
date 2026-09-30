"use client";

// The full view's loader (Hero.tsx, full): until the tile floor is ready, the hero shows only its grey and,
// in the middle, the header's logo art (public/brand/sixlabs-mark-3d.png) with "Loading" under it.
// It is there from the first paint (in the server's HTML, no fade in) and moves at once: its three arcs,
// one at a time, ease a little out from the core and back, round clockwise from the arc that reaches up to
// the top right, each starting as the one before settles (.logo-arc-* in globals.css). The art is cut into
// its arcs and its core by masks of the mark's own shapes (brand-marks.tsx), each piece its own layer, so
// the browser moves them off the main thread and they stay smooth while the floor is being built. When the
// floor is ready, it fades.
import { useId, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ARCS } from "./brand-marks";

const ease = [0.22, 1, 0.36, 1] as const;
const VIEW = "12 7 107 117"; // the mark with room round it for the arcs' travel
// the right arc (up to the top right), then clockwise: the bottom left one, the top left one; their turns a
// third of the cycle apart, the delays negative so the first hop is under way at the first frame
const ORDER = [1, 2, 0];
// the 192px art laid over the mark's shapes, fitted so the pieces' masks take in all but 19 of its pixels
// and no two pieces share one
const ART = {
  href: "/brand/sixlabs-mark-3d.png",
  x: 11.635,
  y: 11.935,
  width: 106.967,
  height: 107.651,
};
const EDGE = 3.2; // the masks grow by half this past each shape, taking in the art's bevelled rims

// one piece of the art: the image seen through a mask of the given shape
function Piece({ id, shape }: { id: string; shape: ReactNode }) {
  return (
    <svg viewBox={VIEW} className="h-full w-full">
      <mask id={id} maskUnits="userSpaceOnUse">
        {shape}
      </mask>
      <image {...ART} preserveAspectRatio="none" mask={`url(#${id})`} />
    </svg>
  );
}

export function HeroLoader({ show }: { show: boolean }) {
  const id = useId();
  const paint = {
    fill: "#fff",
    stroke: "#fff",
    strokeWidth: EDGE,
    strokeLinejoin: "round" as const,
  };
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
            <div className="absolute inset-0">
              <Piece
                id={`${id}-core`}
                shape={
                  <circle
                    cx="65.52"
                    cy="65.76"
                    r={15.41 + EDGE / 2}
                    fill="#fff"
                  />
                }
              />
            </div>
            {ORDER.map((k, i) => (
              <div
                key={k}
                className={`logo-arc-${k} absolute inset-0`}
                style={{ animationDelay: `${i * 0.5 - 1.5}s` }}
              >
                <Piece
                  id={`${id}-${k}`}
                  shape={<path d={ARCS[k]} {...paint} />}
                />
              </div>
            ))}
          </div>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Loading
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
