"use client";

// Doodles around a player's head in the players section (Players.tsx): sleek white line drawings of what
// that player is about, sketched in one stroke after another as if someone were doodling around them.
// They start DELAY_S after the player comes into view and stay drawn until another player is picked
// (the portrait and its doodles leave together). Coordinates are the portrait video's own frame
// (810 x 1080, the head in its upper middle); the drawings sit beside and above the head, past the frame's
// sides where needed. A dotted stroke is revealed through a mask that is itself drawn on, so the dots
// appear along the line in order. Every line wavers a little (a noise displacement), like drawn by hand.
// The drawings themselves are in player-doodles.ts.
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DOODLES, type Stroke } from "./player-doodles";

const DELAY_S = 5;
const SIZE = 0.7; // each drawing's size against how its strokes are written, about its own centre
// the hand's unevenness: lines pushed off their path by smooth noise, WOBBLE frame px at most, over
// waves about 1 / ROUGH_FREQ long, so no stroke runs perfectly clean
const WOBBLE = 6;
const ROUGH_FREQ = 0.03;

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
                ? `translate(${(s.to ?? s.o)[0]} ${(s.to ?? s.o)[1]}) scale(${SIZE * (s.scale ?? 1)}) translate(${-s.o[0]} ${-s.o[1]})`
                : undefined
            }
            // the line keeps its weight however small the drawing is
            strokeWidth={
              (s.dotted ? 5 : 3.5) / (s.o ? SIZE * (s.scale ?? 1) : 1)
            }
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
                  strokeDasharray={`0 ${15 / (s.o ? SIZE * (s.scale ?? 1) : 1)}`}
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
