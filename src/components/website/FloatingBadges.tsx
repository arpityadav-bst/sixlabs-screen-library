"use client";

// Floating tiles around the scroll line (ScrubLine.tsx): the floor's own glass tiles with their
// characters, pre-rendered each at its spot's own angle (tools/tiles/tile-boot.js) and tilted a little
// more. Each sits at its own depth and drifts with the cursor by that much (a soft spring, nearer ones
// further), so they parallax against each other, and bobs slowly on its own. Every few seconds (a relaxed,
// random FLIP_EVERY) one tile, at random and only one at a time, flips round its vertical middle and lands
// showing the next human of its spot's cast. The casts avoid the four characters the players section
// uses. The flipping (and fetching the rest of each cast) runs only while the tiles are near the view.
// Below 1600px (where the line would run under the middle tiles) they sit three above the line and three
// below it: 80% size on laptops, 65% on tablets, half on phones (mx, my, ty). Touch screens and
// reduced motion keep them still.
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import {
  BADGES,
  sizesOf,
  src,
  srcSet,
  type Badge,
} from "./floating-badges-data";

const DRIFT = 22; // px a depth-1 badge moves with the cursor at the edge of the screen
const FLIP_EVERY: [number, number] = [3.5, 6.5]; // s between flips, picked at random in this range
const FLIP_S = 0.8; // one flip, seconds

export function FloatingBadges() {
  // pointer position, -1..1 across the viewport, smoothed
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 }),
    sy = useSpring(my, { stiffness: 60, damping: 18 });
  // which member of its cast each tile shows
  const [shown, setShown] = useState(() => BADGES.map(() => 0));
  // near the view (within half a screen); only then do the tiles flip and the rest of the casts download
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "50% 0px",
    });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

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
    if (!near) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    BADGES.forEach((b) =>
      b.cast.forEach((n) => {
        const im = new Image();
        im.sizes = sizesOf(b.size);
        im.srcset = srcSet(n); // the same pick as the tile's own
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
  }, [near]);

  return (
    <div
      ref={box}
      aria-hidden
      className="floating-badges pointer-events-none absolute inset-0"
    >
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
      className="absolute -translate-x-1/2 -translate-y-1/2 left-(--x) top-(--y) max-[1600px]:left-(--mx) max-md:top-(--my) md:max-[1600px]:top-(--ty)"
      style={
        {
          "--x": b.x,
          "--y": b.y,
          "--mx": b.mx,
          "--my": b.my,
          "--ty": b.ty,
          x,
          y,
        } as unknown as MotionStyle
      }
    >
      <div className="badge-bob" style={{ animationDelay: `${-b.delay}s` }}>
        <div style={{ perspective: 900 }}>
          <motion.div
            className="w-(--s) max-md:w-[calc(var(--s)*0.5)] md:max-xl:w-[calc(var(--s)*0.65)] xl:max-[1600px]:w-[calc(var(--s)*0.8)]"
            style={
              {
                "--s": `${b.size}px`,
                rotate: b.tilt,
                rotateY: turn,
              } as unknown as MotionStyle
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-rendered tile art */}
            <img
              src={src(face)}
              srcSet={srcSet(face)}
              sizes={sizesOf(b.size)}
              alt=""
              className="block h-auto w-full select-none"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
