"use client";

// The page's primary CTA (Try now). On hover it grows a little, its fill shifts 10% toward the accent blue
// behind the band as it passes, and a
// prism-like spectrum band sweeps across it left to right. The band's shape follows the pill: entering, it
// curves like the pill's left end; through the middle it straightens to a vertical line; leaving, it
// curves like the right end. Seven spectral stripes, blended as light over the navy, make the prism
// edge. Reduced motion keeps the grow and the fill, not the sweep.
import { useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { SPECTRUM } from "./prism";

const NAVY = "#0a152d";
const NAVY_SHIFT = "#0c1e42"; // NAVY moved 10% toward the accent (#1a6dff)
const SWEEP_S = 1;
// Which wave crosses the pill: "dots" (a dense dot-matrix band, as on the floating badges) or "prism"
// (seven spectral stripes).
const SWEEP: "dots" | "prism" = "dots";
const DOT_BAND = 34; // dot band width, px

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
  // its SVG ids, unique per button: shared ids would point every copy at the first one's mask
  const uid = useId();

  // The band's path at progress p: a quadratic from the top edge to the bottom edge at x, bowed by b.
  // b runs from the left end's curve (+h) through straight (0) to the right end's curve (-h).
  const path = (p: number, dx: number) => {
    const { w, h } = box.current;
    const x = -h / 2 + p * (w + h) + dx;
    const u = Math.min(1, Math.max(0, x / w));
    const b = h * (1 - 2 * u);
    return `M ${x} -2 Q ${x - b} ${h / 2} ${x} ${h + 2}`;
  };
  // The shifted fill: everything the band's centre line has already crossed.
  const filled = useTransform(t, (p) => {
    const { w, h } = box.current;
    const x = -h / 2 + p * (w + h);
    const b = h * (1 - 2 * Math.min(1, Math.max(0, x / w)));
    return `M ${-h} -2 L ${x} -2 Q ${x - b} ${h / 2} ${x} ${h + 2} L ${-h} ${h + 2} Z`;
  });
  // The dot band: the region between two copies of the curved front, DOT_BAND apart.
  const dotBand = useTransform(t, (p) => {
    const { w, h } = box.current;
    const edge = (dx: number) => {
      const x = -h / 2 + p * (w + h) + dx;
      return [x, h * (1 - 2 * Math.min(1, Math.max(0, x / w)))];
    };
    const [xl, bl] = edge(-DOT_BAND / 2),
      [xr, br] = edge(DOT_BAND / 2);
    return `M ${xl} -2 Q ${xl - bl} ${h / 2} ${xl} ${h + 2} L ${xr} ${h + 2} Q ${xr - br} ${h / 2} ${xr} -2 Z`;
  });
  const shift = useMotionValue(0); // the shifted fill's opacity: on while hovered, eases off after
  const ds = [
    useTransform(t, (p) => path(p, STRANDS[0].dx)),
    useTransform(t, (p) => path(p, STRANDS[1].dx)),
    useTransform(t, (p) => path(p, STRANDS[2].dx)),
    useTransform(t, (p) => path(p, STRANDS[3].dx)),
    useTransform(t, (p) => path(p, STRANDS[4].dx)),
    useTransform(t, (p) => path(p, STRANDS[5].dx)),
    useTransform(t, (p) => path(p, STRANDS[6].dx)),
  ];
  const opacity = useTransform(
    t,
    [-1, 0, 0.12, 0.88, 1],
    [0, 0, 0.75, 0.75, 0],
  );

  const sweep = () => {
    const el = ref.current;
    if (el) {
      box.current = { w: el.offsetWidth, h: el.offsetHeight };
      setSize(box.current);
    }
    shift.stop();
    shift.set(1);
    if (still) return t.set(1);
    t.set(0);
    animate(t, 1, { duration: SWEEP_S, ease: [0.45, 0, 0.25, 1] });
  };
  const leave = () => animate(shift, 0, { duration: 0.3 });

  return (
    <motion.button
      ref={ref}
      type="button"
      data-cta
      onHoverStart={sweep}
      onHoverEnd={leave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{ backgroundColor: NAVY }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative min-w-[220px] overflow-hidden rounded-full px-10 py-3.5 text-[15px] font-medium text-white"
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <motion.path d={filled} fill={NAVY_SHIFT} style={{ opacity: shift }} />
      </svg>
      {SWEEP === "dots" && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={`${uid}-dots`}
              width="3.5"
              height="3.5"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.75" cy="1.75" r="0.95" fill="#9cc0ff" />
            </pattern>
            <filter
              id={`${uid}-soft`}
              x="-50%"
              y="-20%"
              width="200%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <mask
              id={`${uid}-mask`}
              maskUnits="userSpaceOnUse"
              x="-100"
              y="-10"
              width={size.w + 200}
              height={size.h + 20}
            >
              <motion.path
                d={dotBand}
                fill="#fff"
                filter={`url(#${uid}-soft)`}
              />
            </mask>
          </defs>
          <motion.rect
            x="-100"
            y="-10"
            width={size.w + 200}
            height={size.h + 20}
            fill={`url(#${uid}-dots)`}
            mask={`url(#${uid}-mask)`}
            style={{ opacity }}
          />
        </svg>
      )}
      {SWEEP === "prism" && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id={`${uid}-blur`}
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
            filter={`url(#${uid}-blur)`}
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
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}
