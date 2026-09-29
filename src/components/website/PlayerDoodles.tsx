"use client";

// Doodles around a player's head in the players section (Players.tsx): white line drawings of what that
// player is about, sketched one stroke after another as if someone were doodling around them. The hand
// starts DELAY_S after the player comes into view; its lines waver (a noise displacement) like drawn by
// hand. When the portrait switches to the AI copy (`mode`), the AI copies the drawing: it retraces every
// stroke in the same order, exactly over the hand's line, clean and glowing, twice as fast, a bright pen
// point at its tip, and each hand line stays whole under the copy while it is traced and fades once it
// is done.
// A stroke the hand has not finished yet is copied as soon as it is. Switching back to Human puts the
// AI's copy away and the hand sketches it all again. Everything leaves with the player (another pick) and
// is wiped when the section leaves view. The drawings are in player-doodles.ts (coordinates in the
// portrait video's own 810 x 1080 frame); one stroke is DoodleStroke.tsx.
import { useEffect, useId, useRef, useState } from "react";
import { animate, motionValue } from "motion/react";
import { DOODLES } from "./player-doodles";
import { DoodleStroke } from "./DoodleStroke";
import type { Mode } from "./ModeToggle";

const DELAY_S = 5;
// the hand's unevenness: lines pushed off their path by smooth noise, WOBBLE frame px at most, over
// waves about 1 / ROUGH_FREQ long, so no stroke runs perfectly clean
const WOBBLE = 6;
const ROUGH_FREQ = 0.03;
const AI_LEAD_S = 0.6; // after the switch, while the portrait's sweep is under way, the copying begins
const AI_PACE = 0.5; // the copy's timing against the hand's: twice as fast
// the hand's pace against the drawings' written timing (player-doodles.ts), first time and again after
// the AI's copy is put away: brisk, so it has finished before the portrait first turns AI
const HAND_PACE = 0.6;
const AI_GLOW = "#7fb2ff";
const ease = "easeInOut" as const;
const REDUCED = "(prefers-reduced-motion: reduce)";

export function PlayerDoodles({
  id,
  start,
  mode,
}: {
  id: string;
  start: boolean;
  mode: Mode;
}) {
  const strokes = DOODLES[id];
  const uid = useId();
  // per stroke: the hand's line and the AI's copy, each how far drawn, begun, and faded
  const [mv] = useState(() =>
    (DOODLES[id] ?? []).map(() => ({
      len: motionValue(0),
      show: motionValue(0),
      fade: motionValue(1),
      aiLen: motionValue(0),
      aiShow: motionValue(0),
      aiFade: motionValue(1),
    })),
  );
  const handDone = useRef<number[]>([]); // when each hand stroke is (or will be) finished, ms
  const lastMode = useRef<Mode | null>(null); // the mode the doodles last showed, null before they start

  // The hand: draws every stroke DELAY_S after the player comes into view; all is wiped when out of view.
  useEffect(() => {
    if (!strokes) return;
    const still = window.matchMedia(REDUCED).matches;
    const now = performance.now();
    strokes.forEach((s, i) => {
      const v = mv[i];
      if (!start) {
        for (const m of [v.len, v.show, v.aiLen, v.aiShow])
          animate(m, 0, { duration: 0.2 });
        return;
      }
      v.fade.set(1);
      v.aiFade.set(1);
      if (still) {
        v.len.set(1);
        v.show.set(1);
        handDone.current[i] = now;
        return;
      }
      const at = DELAY_S + s.at * HAND_PACE,
        dur = s.dur * HAND_PACE;
      animate(v.len, 1, { delay: at, duration: dur, ease });
      animate(v.show, 1, { delay: at, duration: 0.01 });
      handDone.current[i] = now + (at + dur) * 1000;
    });
  }, [start, strokes, mv]);

  // The AI's copy, when the portrait turns AI; the hand again, when it turns back.
  useEffect(() => {
    if (!strokes) return;
    if (!start) {
      lastMode.current = null;
      return;
    }
    const prev = lastMode.current;
    lastMode.current = mode;
    const still = window.matchMedia(REDUCED).matches;
    const now = performance.now();
    if (mode === "ai" && prev !== "ai") {
      strokes.forEach((s, i) => {
        const v = mv[i];
        // in the hand's order at twice its pace, but never before the hand has finished that stroke
        const begin = Math.max(
          now + (AI_LEAD_S + s.at * AI_PACE) * 1000,
          handDone.current[i] ?? now,
        );
        const delay = still ? 0 : (begin - now) / 1000,
          dur = still ? 0 : s.dur * AI_PACE;
        v.aiLen.set(0);
        v.aiShow.set(0);
        v.aiFade.set(1);
        animate(v.aiLen, 1, { delay, duration: dur, ease: "linear" });
        animate(v.aiShow, 1, { delay, duration: 0.01 });
        // the hand's line stays whole under the copy while it is traced, and fades once it is complete
        animate(v.fade, 0, { delay: delay + dur, duration: still ? 0 : 0.4 });
      });
    } else if (mode === "human" && prev === "ai") {
      strokes.forEach((s, i) => {
        const v = mv[i];
        animate(v.aiFade, 0, { duration: still ? 0 : 0.3 });
        const at = still ? 0 : AI_LEAD_S + s.at * HAND_PACE,
          dur = still ? 0 : s.dur * HAND_PACE;
        v.len.set(0);
        v.show.set(1);
        v.fade.set(1);
        animate(v.len, 1, { delay: at, duration: dur, ease });
        handDone.current[i] = now + (at + dur) * 1000;
      });
    }
  }, [mode, start, strokes, mv]);

  if (!strokes) return null;
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
      {/* the AI's line: its own clean stroke over a soft blue glow */}
      <filter
        id={`${uid}-glow`}
        filterUnits="userSpaceOnUse"
        x="-400"
        y="-300"
        width="1610"
        height="1680"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation={4} result="blur" />
        <feFlood floodColor={AI_GLOW} floodOpacity={0.9} />
        <feComposite in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <g filter={`url(#${uid}-rough)`}>
        {strokes.map((s, i) => (
          <DoodleStroke
            key={i}
            s={s}
            maskId={`${uid}-h${i}`}
            len={mv[i].len}
            show={mv[i].show}
            fade={mv[i].fade}
          />
        ))}
      </g>
      <g filter={`url(#${uid}-glow)`}>
        {strokes.map((s, i) => (
          <DoodleStroke
            key={i}
            s={s}
            maskId={`${uid}-a${i}`}
            len={mv[i].aiLen}
            show={mv[i].aiShow}
            fade={mv[i].aiFade}
            ai
          />
        ))}
      </g>
    </svg>
  );
}
