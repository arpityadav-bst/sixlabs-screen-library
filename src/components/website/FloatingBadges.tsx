"use client";

// Floating tiles around the scroll line (ScrubLine.tsx): the floor's own glass tiles with their
// characters, pre-rendered each at its spot's own angle (tools/tiles/tile-boot.js) and tilted a little
// more. Each sits at its own depth and drifts with the cursor by that much (a soft spring, nearer ones
// further), so they parallax against each other, and bobs slowly on its own. Every few seconds (a relaxed,
// random FLIP_EVERY) one tile, at random and only one at a time, flips round its vertical middle and lands
// showing the next human of its spot's cast. The casts avoid the four characters the players section
// uses. Touch screens and reduced motion keep them still.
import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Badge = {
  cast: string[];
  x: string;
  y: string;
  size: number;
  depth: number;
  tilt: number;
  delay: number;
};

const BADGES: Badge[] = [
  {
    cast: [
      "03-braids",
      "02-pink-buns",
      "21-purple-braids-fighter",
      "16-top-knot",
    ],
    x: "15%",
    y: "27%",
    size: 220,
    depth: 1.4,
    tilt: -6,
    delay: 0,
  },
  {
    cast: [
      "18-afro-esports",
      "01-snapback",
      "23-mohawk-speedrunner",
      "20-turban-simracer",
    ],
    x: "82%",
    y: "25%",
    size: 196,
    depth: 0.8,
    tilt: 5,
    delay: 1.2,
  },
  {
    cast: [
      "19-ginger-streamer",
      "11-blue-hair",
      "07-curls-glasses",
      "28-pixie-cozy",
    ],
    x: "10%",
    y: "56%",
    size: 180,
    depth: 0.6,
    tilt: 4,
    delay: 2.1,
  },
  {
    cast: [
      "24-pink-hair-rhythm",
      "04-silver-shades",
      "29-longhair-retro",
      "08-bucket-hat",
    ],
    x: "88%",
    y: "53%",
    size: 232,
    depth: 1.6,
    tilt: -4,
    delay: 0.6,
  },
  {
    cast: [
      "14-silver-bob-cat-ears",
      "05-ponytail-headset",
      "25-braid-strategist",
      "17-platinum-crop",
    ],
    x: "20%",
    y: "77%",
    size: 188,
    depth: 1,
    tilt: 6,
    delay: 1.7,
  },
  {
    cast: [
      "10-cap-cheer",
      "09-beanie-wink",
      "13-hijab-headset",
      "30-holo-cosplay",
    ],
    x: "77%",
    y: "79%",
    size: 204,
    depth: 1.2,
    tilt: -5,
    delay: 0.3,
  },
];

const DRIFT = 22; // px a depth-1 badge moves with the cursor at the edge of the screen
const FLIP_EVERY: [number, number] = [3.5, 6.5]; // s between flips, picked at random in this range
const FLIP_S = 0.8; // one flip, seconds
// bump when the tile renders change, so browsers fetch the new ones instead of their cached copies
const TILES_V = 5;
const src = (name: string) => `/tiles/float/${name}.webp?v=${TILES_V}`;

export function FloatingBadges() {
  // pointer position, -1..1 across the viewport, smoothed
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }),
    sy = useSpring(my, { stiffness: 60, damping: 18 });
  // which member of its cast each tile shows
  const [shown, setShown] = useState(() => BADGES.map(() => 0));

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    BADGES.forEach((b) =>
      b.cast.forEach((n) => {
        new Image().src = src(n);
      }),
    ); // ready before their turn
    let last = -1,
      timer = 0;
    const next = () => {
      const [lo, hi] = FLIP_EVERY;
      timer = window.setTimeout(
        () => {
          let k = Math.floor(Math.random() * BADGES.length);
          if (k === last) k = (k + 1) % BADGES.length; // never the same tile twice running
          last = k;
          setShown((s) =>
            s.map((v, i) => (i === k ? (v + 1) % BADGES[i].cast.length : v)),
          );
          next();
        },
        (lo + Math.random() * (hi - lo)) * 1000,
      );
    };
    next();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {BADGES.map((b, i) => (
        <FloatingBadge
          key={b.cast[0]}
          badge={b}
          name={b.cast[shown[i]]}
          sx={sx}
          sy={sy}
        />
      ))}
    </div>
  );
}

function FloatingBadge({
  badge: b,
  name,
  sx,
  sy,
}: {
  badge: Badge;
  name: string;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * DRIFT * b.depth);
  const y = useTransform(sy, (v) => v * DRIFT * b.depth);
  // The flip: turn edge-on, swap the picture, turn back from the other side.
  const turn = useMotionValue(0);
  const [face, setFace] = useState(name);
  useEffect(() => {
    if (name === face) return;
    let live = true;
    animate(turn, 90, { duration: FLIP_S / 2, ease: [0.4, 0, 1, 1] }).then(
      () => {
        if (!live) return;
        setFace(name);
        turn.set(-90);
        animate(turn, 0, { duration: FLIP_S / 2, ease: [0, 0, 0.2, 1] });
      },
    );
    return () => {
      live = false;
    };
  }, [name, face, turn]);

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: b.x, top: b.y, x, y }}
    >
      <div className="badge-bob" style={{ animationDelay: `${-b.delay}s` }}>
        <div style={{ perspective: 900 }}>
          <motion.div
            className="drop-shadow-[0_6px_8px_rgba(10,27,51,0.05)]"
            style={{ width: b.size, rotate: b.tilt, rotateY: turn }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-rendered tile art */}
            <img
              src={src(face)}
              alt=""
              className="block h-auto w-full select-none"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
