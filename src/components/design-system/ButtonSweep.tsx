"use client";

// The xl primary's hover layer, so the system button reads as Try now's family. As the pointer arrives
// (or focus arrives from the keyboard), a band of dots crosses the pill left to right over 1s and the navy
// behind it shifts to the hover navy. The band is the site's own CtaDots canvas, so the two cannot drift.
// The shifted fill is an SVG path whose leading edge is the band's centre line: a quadratic from the
// pill's top to its foot, bowed like the pill's left end as it enters, straight in the middle, bowed like
// the right end as it leaves. Leaving, the shift fades over 0.3s. Reduced motion keeps the shift and
// drops the band. No filter, mask or blend: the dots are drawn on a canvas.
import { useRef, useState, type RefObject } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CtaDots } from "@/components/website/CtaDots";
import { DUR } from "./motion";
import { EASE_SWEEP } from "./token-motion";

/** The band's width in px, the site's DOT_BAND (PrimaryCta.tsx:26). */
export const SWEEP_BAND = 34;

type Box = { w: number; h: number };

/** Where the band's centre crosses the pill's top at progress p, and how far its foot bows back. */
function centreLine(p: number, { w, h }: Box) {
  const x = p * (w + h) - h / 2;
  const across = Math.min(1, Math.max(0, x / w));
  return { x, bow: h * (1 - 2 * across) };
}

/** The region the band has crossed: from off the left edge to its centre line. */
function crossed(p: number, box: Box) {
  const { x, bow } = centreLine(p, box);
  const { h } = box;
  return `M ${-h} -2 L ${x} -2 Q ${x - bow} ${h / 2} ${x} ${h + 2} L ${-h} ${h + 2} Z`;
}

/** The layer itself: the shifted fill and the dot band, laid under the label. */
export function ButtonSweep({
  t,
  shift,
  opacity,
  size,
  box,
}: {
  t: MotionValue<number>;
  shift: MotionValue<number>;
  opacity: MotionValue<number>;
  size: Box;
  box: RefObject<Box>;
}) {
  // the box is read by motion on each frame, outside React's render
  const fill = useTransform(t, (p) => crossed(p, box.current));
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <motion.path d={fill} style={{ opacity: shift, fill: "var(--ds-color-primary-hover)" }} />
      </svg>
      <CtaDots t={t} opacity={opacity} size={size} band={SWEEP_BAND} />
    </>
  );
}

/** The sweep for one button: start on hover or keyboard focus, end on leave or blur, and its layer. */
export function useButtonSweep(host: RefObject<HTMLElement | null>) {
  const t = useMotionValue(-1); // progress 0 to 1, -1 idle
  const shift = useMotionValue(0); // the shifted fill's opacity
  const opacity = useTransform(t, [-1, 0, 0.12, 0.88, 1], [0, 0, 0.75, 0.75, 0]);
  const [size, setSize] = useState<Box>({ w: 220, h: 52 });
  const box = useRef<Box>(size);
  const still = useReducedMotion();

  const start = () => {
    const el = host.current;
    if (el) {
      box.current = { w: el.offsetWidth, h: el.offsetHeight };
      setSize(box.current);
    }
    shift.stop();
    shift.set(1);
    if (still) {
      t.set(1); // the whole pill shifted, no band
      return;
    }
    t.set(0);
    animate(t, 1, { duration: DUR.sweep, ease: [...EASE_SWEEP] });
  };
  const end = () => {
    animate(shift, 0, { duration: DUR.line });
  };
  const layer = <ButtonSweep t={t} shift={shift} opacity={opacity} size={size} box={box} />;
  return { start, end, layer };
}
