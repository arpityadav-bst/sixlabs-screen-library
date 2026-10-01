"use client";

// One stroke of a player's doodles (PlayerDoodles.tsx), in either hand: the human's (wavering, soft white) or
// the AI's copy of it (clean, brighter, in a soft blue glow, a bright pen point riding its tip while it
// draws). How far along it is (`len`), whether it has begun (`show`) and its fade are motion values
// PlayerDoodles runs. A dotted stroke's dots appear along the line in order as it is drawn.
// No SVG filter or mask: those were redrawn every frame a stroke drew in, on the processor in Safari, which
// held the players' section at 3 to 7 fps there. The hand's waver is in its points (doodle-geometry.ts), the
// AI's glow is a few wide faint lines under its own (GLOW: as the 4px blur of the line in #7fb2ff at 90% it
// replaces fell off), and a dotted stroke is its dots, shown as far as the line has been drawn.
import { useEffect, useRef } from "react";
import { motion, type MotionValue } from "motion/react";
import type { Stroke } from "./player-doodles";
import { scaleOf, strokeDots, waveredPath } from "./doodle-geometry";

export { SIZE } from "./doodle-geometry";
const PEN_R = 5; // the AI pen point's radius, frame px
const AI_GLOW = "#7fb2ff";
const GLOW: [number, number][] = [ // frame px wide, opacity: widest first
  [26, 0.04],
  [20, 0.05],
  [14, 0.06],
  [9, 0.08],
  [5, 0.1],
];
const REACH = 14; // how far ahead of the line's drawn end a dot already shows, frame px

type Dot = { x: number; y: number; at: number };
const dotPath = (dots: Dot[], upTo: number) =>
  dots
    .filter((d) => d.at <= upTo)
    .map((d) => `M${d.x.toFixed(1)} ${d.y.toFixed(1)}l0 0`)
    .join("");

export function DoodleStroke({
  s,
  len,
  show,
  fade,
  ai,
}: {
  s: Stroke;
  len: MotionValue<number>;
  show: MotionValue<number>;
  fade: MotionValue<number>;
  ai?: boolean;
}) {
  const k = scaleOf(s); // how much the drawing is shrunk
  const path = useRef<SVGPathElement>(null);
  const pen = useRef<SVGGElement>(null);
  const dotted = useRef<(SVGPathElement | null)[]>([]);
  // the hand's wavering line, worked out once in the browser (it measures the path) and set on the line
  // itself: until then it holds the stroke as written, unseen (nothing shows before it starts drawing)
  const handLine = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (!ai && !s.dotted) handLine.current?.setAttribute("d", waveredPath(s));
  }, [s, ai]);

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
      c.setAttribute("transform", `translate(${at.x} ${at.y})`);
    });
  }, [ai, len]);

  // a dotted stroke: its dots as far as the line has been drawn
  useEffect(() => {
    if (!s.dotted) return;
    const dots = strokeDots(s, !ai);
    probeLength ??= document.createElementNS("http://www.w3.org/2000/svg", "path");
    probeLength.setAttribute("d", s.d);
    const reach = REACH / k / Math.max(1, probeLength.getTotalLength());
    const draw = (v: number) => {
      const d = v > 0 ? dotPath(dots, v + reach) : "";
      dotted.current.forEach((el) => el?.setAttribute("d", d));
    };
    draw(len.get());
    return len.on("change", draw);
  }, [s, ai, len, k]);

  // the hand: in the frame itself (its points already placed and wavering), its line at 3.5 px
  if (!ai) {
    if (s.dotted)
      return (
        <motion.g style={{ opacity: fade }}>
          <motion.path ref={(el) => void (dotted.current[0] = el)} strokeWidth={5} strokeOpacity={0.85} style={{ opacity: show }} />
        </motion.g>
      );
    return (
      <motion.g style={{ opacity: fade }}>
        <motion.path ref={handLine} d={s.d} strokeWidth={3.5} strokeOpacity={0.85} style={{ pathLength: len, opacity: show }} />
      </motion.g>
    );
  }

  // the AI's copy: clean, in the stroke's own placement, its glow under it
  return (
    <g
      transform={
        s.o
          ? `translate(${(s.to ?? s.o)[0]} ${(s.to ?? s.o)[1]}) scale(${k}) translate(${-s.o[0]} ${-s.o[1]})`
          : undefined
      }
    >
      <motion.g style={{ opacity: fade }}>
        {GLOW.map(([w, o], i) =>
          s.dotted ? (
            <motion.path key={i} ref={(el) => void (dotted.current[i + 1] = el)} stroke={AI_GLOW} strokeWidth={(w + 1.5) / k} strokeOpacity={o} style={{ opacity: show }} />
          ) : (
            <motion.path key={i} d={s.d} stroke={AI_GLOW} strokeWidth={w / k} strokeOpacity={o} style={{ pathLength: len, opacity: show }} />
          ),
        )}
        {s.dotted ? (
          <>
            <motion.path ref={(el) => void (dotted.current[0] = el)} strokeWidth={5 / k} style={{ opacity: show }} />
            <path ref={path} d={s.d} stroke="none" />
          </>
        ) : (
          <motion.path ref={path} d={s.d} strokeWidth={3.5 / k} style={{ pathLength: len, opacity: show }} />
        )}
        <g ref={pen} style={{ opacity: 0 }}>
          <circle r={(PEN_R + 8) / k} fill={AI_GLOW} fillOpacity={0.1} stroke="none" />
          <circle r={(PEN_R + 4) / k} fill={AI_GLOW} fillOpacity={0.2} stroke="none" />
          <circle r={PEN_R / k} fill="#ffffff" stroke="none" />
        </g>
      </motion.g>
    </g>
  );
}
let probeLength: SVGPathElement | null = null;
