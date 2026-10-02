"use client";

// The glow the site draws without a filter: the explorer's drawing as the AI's copy, every stroke through
// the real DoodleStroke, held fully drawn. Its glow is five faint lines under each stroke. The motion
// values are made here, once, because a server section cannot hand them across the boundary.
import { useState } from "react";
import { motionValue } from "motion/react";
import { DoodleStroke } from "@/components/website/DoodleStroke";
import { DOODLES } from "@/components/website/player-doodles";

const STROKES = DOODLES.explorer ?? [];

export function GlowStack() {
  const [mv] = useState(() => STROKES.map(() => ({ len: motionValue(1), show: motionValue(1), fade: motionValue(1) })));
  return (
    <svg
      aria-hidden="true"
      viewBox="-120 -110 1050 600"
      width="100%"
      style={{ maxWidth: 420, overflow: "visible" }}
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {STROKES.map((s, i) => (
        <DoodleStroke key={i} s={s} len={mv[i].len} show={mv[i].show} fade={mv[i].fade} ai />
      ))}
    </svg>
  );
}
