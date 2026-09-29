"use client";

// Doodles around a player's head in the players section (Players.tsx): sleek white line drawings of what
// that player is about, sketched in one stroke after another as if someone were doodling around them.
// They start DELAY_S after the player comes into view and stay drawn until another player is picked
// (the portrait and its doodles leave together). Coordinates are the portrait video's own frame
// (810 x 1080, the head in its upper middle); the drawings sit beside and above the head, past the frame's
// sides where needed. A dotted stroke is revealed through a mask that is itself drawn on, so the dots
// appear along the line in order. Every line wavers a little (a noise displacement), like drawn by hand.
// Only the explorer has doodles so far.
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

// `o` is the centre of the drawing a stroke belongs to, which it is shrunk towards (SIZE)
type Stroke = {
  d: string;
  at: number;
  dur: number;
  dotted?: boolean;
  o?: [number, number];
};

const DELAY_S = 5;
const SIZE = 0.7; // each drawing's size against how its strokes are written, about its own centre
// the hand's unevenness: lines pushed off their path by smooth noise, WOBBLE frame px at most, over
// waves about 1 / ROUGH_FREQ long, so no stroke runs perfectly clean
const WOBBLE = 6;
const ROUGH_FREQ = 0.03;
const circle = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} a ${r} ${r} 0 1 1 -0.1 0`;
const sparkle = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} Q ${x} ${y} ${x + s} ${y} Q ${x} ${y} ${x} ${y + s} Q ${x} ${y} ${x - s} ${y} Q ${x} ${y} ${x} ${y - s}`;

// The explorer: a compass and a dotted route over the head to a map pin, the pin's trail on to an X, a
// magnifying glass, a peak with a flag, and a few sparkles. `at` is when each stroke starts, seconds.
const EXPLORER: Stroke[] = [
  { d: circle(-50, 150, 46), at: 0, dur: 0.7, o: [-50, 140] },
  {
    d: "M -50 116 L -41 150 L -50 184 L -59 150 Z",
    at: 0.6,
    dur: 0.4,
    o: [-50, 140],
  },
  { d: "M -57 88 L -50 74 L -43 88", at: 0.95, dur: 0.25, o: [-50, 140] },
  { d: "M 30 70 Q 400 -130 770 60", at: 1.15, dur: 1.2, dotted: true },
  {
    d: "M 830 190 C 800 150 790 130 790 110 A 40 40 0 1 1 870 110 C 870 130 860 150 830 190 Z",
    at: 2.15,
    dur: 0.6,
    o: [830, 140],
  },
  { d: circle(830, 108, 14), at: 2.65, dur: 0.3, o: [830, 140] },
  {
    d: "M 838 205 C 875 250 845 290 900 320 S 955 370 935 398",
    at: 2.85,
    dur: 0.8,
    dotted: true,
    o: [830, 140],
  },
  { d: "M 918 408 L 950 440", at: 3.55, dur: 0.2, o: [830, 140] },
  { d: "M 950 408 L 918 440", at: 3.75, dur: 0.2, o: [830, 140] },
  { d: circle(-70, 430, 40), at: 4.05, dur: 0.6, o: [-60, 440] },
  { d: "M -42 459 L 2 503", at: 4.55, dur: 0.3, o: [-60, 440] },
  { d: "M -94 424 A 25 25 0 0 1 -74 404", at: 4.85, dur: 0.25, o: [-60, 440] },
  {
    d: "M 700 560 L 770 480 L 805 515 L 870 430 L 960 560",
    at: 5.15,
    dur: 0.8,
    o: [830, 470],
  },
  { d: "M 848 458 L 866 472 L 886 454", at: 5.85, dur: 0.25, o: [830, 470] },
  { d: "M 870 430 L 870 360", at: 6.05, dur: 0.25, o: [830, 470] },
  { d: "M 870 362 L 912 377 L 870 392", at: 6.25, dur: 0.3, o: [830, 470] },
  { d: sparkle(150, 26, 18), at: 6.55, dur: 0.3, o: [150, 26] },
  { d: sparkle(650, 4, 14), at: 6.75, dur: 0.3, o: [650, 4] },
  { d: sparkle(-150, 300, 12), at: 6.95, dur: 0.3, o: [-150, 300] },
  { d: sparkle(990, 250, 12), at: 7.15, dur: 0.3, o: [990, 250] },
];

const DOODLES: Record<string, Stroke[]> = { explorer: EXPLORER };

export function PlayerDoodles({ id, start }: { id: string; start: boolean }) {
  const strokes = DOODLES[id];
  const uid = useId();
  const reduce = useReducedMotion();
  if (!strokes) return null;
  // drawn (after DELAY_S, each at its turn) once `start` holds; wiped quickly if it lapses
  const draw = (s: Stroke) =>
    start
      ? {
          animate: { pathLength: 1, opacity: 1 },
          transition: reduce
            ? { duration: 0 }
            : {
                pathLength: {
                  delay: DELAY_S + s.at,
                  duration: s.dur,
                  ease: "easeInOut" as const,
                },
                opacity: { delay: DELAY_S + s.at, duration: 0.01 },
              },
        }
      : {
          animate: { pathLength: 0, opacity: 0 },
          transition: { duration: 0.2 },
        };

  return (
    <svg
      aria-hidden
      viewBox="0 0 810 1080"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <filter
        id={`${uid}-rough`}
        filterUnits="userSpaceOnUse"
        x="-400"
        y="-300"
        width="1610"
        height="1680"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={ROUGH_FREQ}
          numOctaves={2}
          seed={7}
        />
        <feDisplacementMap in="SourceGraphic" scale={WOBBLE * 2} />
      </filter>
      <g filter={`url(#${uid}-rough)`}>
        {strokes.map((s, i) => (
          <g
            key={i}
            transform={
              s.o
                ? `translate(${s.o[0]} ${s.o[1]}) scale(${SIZE}) translate(${-s.o[0]} ${-s.o[1]})`
                : undefined
            }
            // the line keeps its weight however small the drawing is
            strokeWidth={(s.dotted ? 5 : 3.5) / (s.o ? SIZE : 1)}
          >
            {s.dotted ? (
              <>
                <mask
                  id={`${uid}-${i}`}
                  maskUnits="userSpaceOnUse"
                  x="-400"
                  y="-300"
                  width="1610"
                  height="1680"
                >
                  <motion.path
                    d={s.d}
                    stroke="#ffffff"
                    strokeWidth={28}
                    initial={{ pathLength: 0, opacity: 0 }}
                    {...draw(s)}
                  />
                </mask>
                <path
                  d={s.d}
                  mask={`url(#${uid}-${i})`}
                  strokeDasharray={`0 ${15 / (s.o ? SIZE : 1)}`}
                  strokeOpacity={0.85}
                />
              </>
            ) : (
              <motion.path
                d={s.d}
                strokeOpacity={0.85}
                initial={{ pathLength: 0, opacity: 0 }}
                {...draw(s)}
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
