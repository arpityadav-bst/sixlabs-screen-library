"use client";

// Floating tiles around the scroll line (ScrubLine.tsx): the floor's own glass tiles with their
// characters, pre-rendered each at its own angle (tools/tiles/tile-boot.js) and tilted a little more. Each sits at its own depth and drifts with the cursor by
// that much (a soft spring, nearer ones further), so they parallax against each other, and bobs slowly
// on its own. Hovering one sweeps a dense dot-matrix band across it that turns the human into their AI
// copy behind it; leaving eases back. The cast avoids the four characters the players section uses.
// Touch screens and reduced motion keep them still.
import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Badge = {
  name: string;
  x: string;
  y: string;
  size: number;
  depth: number;
  tilt: number;
  delay: number;
};

const BADGES: Badge[] = [
  {
    name: "03-braids",
    x: "15%",
    y: "27%",
    size: 220,
    depth: 1.4,
    tilt: -6,
    delay: 0,
  },
  {
    name: "18-afro-esports",
    x: "82%",
    y: "25%",
    size: 196,
    depth: 0.8,
    tilt: 5,
    delay: 1.2,
  },
  {
    name: "19-ginger-streamer",
    x: "10%",
    y: "56%",
    size: 180,
    depth: 0.6,
    tilt: 4,
    delay: 2.1,
  },
  {
    name: "24-pink-hair-rhythm",
    x: "88%",
    y: "53%",
    size: 232,
    depth: 1.6,
    tilt: -4,
    delay: 0.6,
  },
  {
    name: "14-silver-bob-cat-ears",
    x: "20%",
    y: "77%",
    size: 188,
    depth: 1,
    tilt: 6,
    delay: 1.7,
  },
  {
    name: "10-cap-cheer",
    x: "77%",
    y: "79%",
    size: 204,
    depth: 1.2,
    tilt: -5,
    delay: 0.3,
  },
];

const DRIFT = 22; // px a depth-1 badge moves with the cursor at the edge of the screen
const SWEEP_S = 1;
// bump when the tile renders change, so browsers fetch the new ones instead of their cached copies
const TILES_V = 2;
const BAND = 34; // band width, % of the tile

export function FloatingBadges() {
  // pointer position, -1..1 across the viewport, smoothed
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }),
    sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (
      !window.matchMedia(
        "(hover: hover) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {BADGES.map((b) => (
        <FloatingBadge key={b.name} badge={b} sx={sx} sy={sy} />
      ))}
    </div>
  );
}

function FloatingBadge({
  badge: b,
  sx,
  sy,
}: {
  badge: Badge;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * DRIFT * b.depth);
  const y = useTransform(sy, (v) => v * DRIFT * b.depth);
  // sweep progress 0..1: the band's centre runs from just off the left edge to just off the right
  const p = useMotionValue(0);
  const centre = useTransform(p, (v) => -BAND / 2 + v * (100 + BAND));
  const reveal = useTransform(
    centre,
    (c) => `inset(0 ${Math.max(0, 100 - c)}% 0 0)`,
  ); // AI copy, left of the band
  const bandLeft = useTransform(centre, (c) => `${c - BAND / 2}%`);
  const bandOpacity = useTransform(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const ai = useMotionValue(0); // the AI copy's opacity: on while hovered, eases off after

  const enter = () => {
    ai.stop();
    ai.set(1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return p.set(1);
    p.set(0);
    animate(p, 1, { duration: SWEEP_S, ease: [0.45, 0, 0.25, 1] });
  };
  const leave = () => animate(ai, 0, { duration: 0.35 });

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: b.x, top: b.y, x, y }}
    >
      <div className="badge-bob" style={{ animationDelay: `${-b.delay}s` }}>
        <motion.div
          onHoverStart={enter}
          onHoverEnd={leave}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="pointer-events-auto relative drop-shadow-[0_8px_10px_rgba(10,27,51,0.10)]"
          style={{ width: b.size, rotate: b.tilt }}
        >
          <Tile src={`/tiles/float/${b.name}.webp?v=${TILES_V}`} />
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: reveal, opacity: ai }}
          >
            <Tile src={`/tiles/float/${b.name}-ai.webp?v=${TILES_V}`} />
          </motion.div>
          {/* the dot-matrix wave: a dense halftone of accent dots, soft at both edges, kept to the tile */}
          <div
            className="absolute inset-0"
            style={{
              maskImage: `url(/tiles/float/${b.name}.webp?v=${TILES_V})`,
              maskSize: "100% 100%",
            }}
          >
            <motion.div
              className="dot-wave absolute inset-y-0"
              style={{
                left: bandLeft,
                width: `${BAND}%`,
                opacity: bandOpacity,
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// One floating tile: the floor's glass tile with its character, pre-rendered (tools/tiles/tile-boot.js).
function Tile({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-rendered tile art
    <img src={src} alt="" className="block h-auto w-full select-none" />
  );
}
