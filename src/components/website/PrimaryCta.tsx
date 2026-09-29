"use client";

// The page's primary CTA (Try now). On hover it grows a little, its fill lifts 5% toward white, and a
// prism-like spectrum band sweeps across it left to right. The band's shape follows the pill: entering, it
// curves like the pill's left end; through the middle it straightens to a vertical line; leaving, it
// curves like the right end. Seven spectral stripes, blended as light over the navy, make the prism
// edge. Reduced motion keeps the grow and the fill, not the sweep.
import { useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";

const NAVY = "#0a152d";
const NAVY_LIFT = "#162138"; // NAVY mixed 5% toward white
const SWEEP_S = 0.65;
// A prism's spread: the spectrum in order across the band (red leads, violet trails), stripes a few px
// apart and only lightly blurred, so the colours stay separate the way refracted light does.
const SPECTRUM = [
  "#ff3b3b",
  "#ff8a1f",
  "#ffe14d",
  "#46f08c",
  "#2fdcff",
  "#3d7bff",
  "#9b5cff",
];
const GAP = 4.5;
const STRANDS = SPECTRUM.map((color, k) => ({
  dx: (SPECTRUM.length / 2 - k) * GAP,
  color,
}));

export function PrimaryCta({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ w: 220, h: 52 });
  const box = useRef(size); // read by the band's path, which motion calls outside React's render
  const t = useMotionValue(-1); // sweep progress 0..1; -1 idle
  const still = useReducedMotion();

  // The band's path at progress p: a quadratic from the top edge to the bottom edge at x, bowed by b.
  // b runs from the left end's curve (+h) through straight (0) to the right end's curve (-h).
  const path = (p: number, dx: number) => {
    const { w, h } = box.current;
    const x = -h / 2 + p * (w + h) + dx;
    const u = Math.min(1, Math.max(0, x / w));
    const b = h * (1 - 2 * u);
    return `M ${x} -2 Q ${x - b} ${h / 2} ${x} ${h + 2}`;
  };
  const ds = [
    useTransform(t, (p) => path(p, STRANDS[0].dx)),
    useTransform(t, (p) => path(p, STRANDS[1].dx)),
    useTransform(t, (p) => path(p, STRANDS[2].dx)),
    useTransform(t, (p) => path(p, STRANDS[3].dx)),
    useTransform(t, (p) => path(p, STRANDS[4].dx)),
    useTransform(t, (p) => path(p, STRANDS[5].dx)),
    useTransform(t, (p) => path(p, STRANDS[6].dx)),
  ];
  const opacity = useTransform(t, [-1, 0, 0.12, 0.88, 1], [0, 0, 0.75, 0.75, 0]);

  const sweep = () => {
    const el = ref.current;
    if (el) {
      box.current = { w: el.offsetWidth, h: el.offsetHeight };
      setSize(box.current);
    }
    if (still) return;
    t.set(0);
    animate(t, 1, { duration: SWEEP_S, ease: [0.45, 0, 0.25, 1] });
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onHoverStart={sweep}
      whileHover={{ scale: 1.04, backgroundColor: NAVY_LIFT }}
      whileTap={{ scale: 0.97 }}
      initial={{ backgroundColor: NAVY }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative min-w-[220px] overflow-hidden rounded-full px-10 py-3.5 text-[15px] font-medium text-white"
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="cta-sweep-blur"
            x="-50%"
            y="-10%"
            width="200%"
            height="120%"
          >
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <motion.g
          style={{ opacity }}
          filter="url(#cta-sweep-blur)"
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
        >
          {STRANDS.map((st, k) => (
            <motion.path
              key={st.color}
              d={ds[k]}
              stroke={st.color}
              strokeOpacity={0.75}
            />
          ))}
        </motion.g>
      </svg>
      <span className="relative">{children}</span>
    </motion.button>
  );
}
