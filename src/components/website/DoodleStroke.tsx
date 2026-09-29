"use client";

// One stroke of a player's doodles (PlayerDoodles.tsx), in either hand: the human's (drawn inside the
// wobble filter, soft white) or the AI's copy of it (clean, brighter, a bright pen point riding its tip
// while it draws). How far along it is (`len`), whether it has begun (`show`) and its fade are motion
// values PlayerDoodles runs. A dotted stroke is revealed through a mask that is itself drawn on, so its
// dots appear along the line in order.
import { useEffect, useRef } from "react";
import { motion, type MotionValue } from "motion/react";
import type { Stroke } from "./player-doodles";

export const SIZE = 0.7; // each drawing's size against how its strokes are written, about its own centre
const PEN_R = 5; // the AI pen point's radius, frame px

export function DoodleStroke({
  s,
  maskId,
  len,
  show,
  fade,
  ai,
}: {
  s: Stroke;
  maskId: string;
  len: MotionValue<number>;
  show: MotionValue<number>;
  fade: MotionValue<number>;
  ai?: boolean;
}) {
  const k = s.o ? SIZE * (s.scale ?? 1) : 1; // how much the drawing is shrunk
  const path = useRef<SVGPathElement>(null);
  const pen = useRef<SVGCircleElement>(null);

  // the AI's pen point sits on the stroke's growing end while it draws, and is gone before and after
  useEffect(() => {
    if (!ai) return;
    return len.on("change", (v) => {
      const p = path.current,
        c = pen.current;
      if (!p || !c) return;
      const drawing = v > 0.001 && v < 0.999;
      c.style.opacity = drawing ? "1" : "0";
      if (!drawing) return;
      const at = p.getPointAtLength(v * p.getTotalLength());
      c.setAttribute("cx", `${at.x}`);
      c.setAttribute("cy", `${at.y}`);
    });
  }, [ai, len]);

  return (
    <g
      transform={
        s.o
          ? `translate(${(s.to ?? s.o)[0]} ${(s.to ?? s.o)[1]}) scale(${k}) translate(${-s.o[0]} ${-s.o[1]})`
          : undefined
      }
      // the line keeps its weight however small the drawing is
      strokeWidth={(s.dotted ? 5 : 3.5) / k}
    >
      <motion.g style={{ opacity: fade }}>
        {s.dotted ? (
          <>
            <mask
              id={maskId}
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
                style={{ pathLength: len, opacity: show }}
              />
            </mask>
            <path
              ref={path}
              d={s.d}
              mask={`url(#${maskId})`}
              strokeDasharray={`0 ${15 / k}`}
              strokeOpacity={ai ? 1 : 0.85}
            />
          </>
        ) : (
          <motion.path
            ref={path}
            d={s.d}
            strokeOpacity={ai ? 1 : 0.85}
            style={{ pathLength: len, opacity: show }}
          />
        )}
        {ai && (
          <circle
            ref={pen}
            r={PEN_R / k}
            fill="#ffffff"
            stroke="none"
            style={{ opacity: 0 }}
          />
        )}
      </motion.g>
    </g>
  );
}
