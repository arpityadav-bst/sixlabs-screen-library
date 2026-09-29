"use client";

// Small frosted glass badges of the floor's characters floating around the scroll line (ScrubLine.tsx):
// four humans and two AI copies. Each sits at its own depth and drifts with the cursor by that much (a
// soft spring, nearer ones further), so they parallax against each other; each also bobs slowly on its
// own. Touch screens and reduced motion keep them still.
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Badge = {
  src: string;
  x: string;
  y: string;
  size: number;
  depth: number;
  tilt: number;
  delay: number;
};

const BADGES: Badge[] = [
  {
    src: "/tiles/chars/03-braids.webp",
    x: "11%",
    y: "20%",
    size: 84,
    depth: 1.4,
    tilt: -6,
    delay: 0,
  },
  {
    src: "/tiles/chars-ai/06-bearded-headphones.webp",
    x: "84%",
    y: "17%",
    size: 72,
    depth: 0.8,
    tilt: 5,
    delay: 1.2,
  },
  {
    src: "/tiles/chars/19-ginger-streamer.webp",
    x: "5%",
    y: "55%",
    size: 64,
    depth: 0.6,
    tilt: 4,
    delay: 2.1,
  },
  {
    src: "/tiles/chars/24-pink-hair-rhythm.webp",
    x: "91%",
    y: "52%",
    size: 88,
    depth: 1.6,
    tilt: -4,
    delay: 0.6,
  },
  {
    src: "/tiles/chars-ai/13-hijab-headset.webp",
    x: "17%",
    y: "83%",
    size: 70,
    depth: 1,
    tilt: 6,
    delay: 1.7,
  },
  {
    src: "/tiles/chars/10-cap-cheer.webp",
    x: "79%",
    y: "85%",
    size: 76,
    depth: 1.2,
    tilt: -5,
    delay: 0.3,
  },
];

const DRIFT = 22; // px a depth-1 badge moves with the cursor at the edge of the screen

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
        <FloatingBadge key={b.src} badge={b} sx={sx} sy={sy} />
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
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: b.x, top: b.y, x, y }}
    >
      <div className="badge-bob" style={{ animationDelay: `${-b.delay}s` }}>
        <div
          className="overflow-hidden rounded-[22px] border border-white/80 bg-white/55 p-1.5 shadow-[0_18px_40px_-18px_rgba(10,27,51,0.35)] backdrop-blur-md"
          style={{ width: b.size, height: b.size, rotate: `${b.tilt}deg` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the floor's own character art */}
          <img
            src={b.src}
            alt=""
            className="h-full w-full rounded-[16px] bg-slate-100 object-cover object-top"
          />
        </div>
      </div>
    </motion.div>
  );
}
