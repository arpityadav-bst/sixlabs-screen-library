"use client";

// Doodles around a player's head in the players section (Players.tsx): white line drawings of what that
// player is about, sketched one stroke after another as if someone were doodling around them. The hand
// starts DELAY_S after the player comes into view; its lines waver (a noise displacement) like drawn by
// hand. When the portrait switches to the AI copy (`mode`), the AI copies the drawing: it retraces every
// stroke in the same order, exactly over the hand's line, clean and glowing, twice as fast, a bright pen
// point at its tip, and each hand line dims as the copy starts over it and is gone once the copy is done.
// A stroke the hand has not finished yet is copied as soon as it is. Switching back to Human puts the
// AI's copy away and the hand sketches it all again. Everything leaves with the player (another pick) and
// is wiped when the section leaves view. The drawings are in player-doodles.ts (coordinates in the
// portrait video's own 810 x 1080 frame); one stroke is DoodleStroke.tsx.
import { useEffect, useRef, useState } from "react";
import { animate, motionValue } from "motion/react";
import { DOODLES } from "./player-doodles";
import { DoodleStroke } from "./DoodleStroke";
import type { Mode } from "./ModeToggle";

const DELAY_S = 5;
const AI_LEAD_S = 0.6; // after the switch, while the portrait's sweep is under way, the copying begins
const AI_PACE = 0.5; // the copy's timing against the hand's: twice as fast
// the hand's pace against the drawings' written timing (player-doodles.ts), first time and again after
// the AI's copy is put away: brisk, so it has finished before the portrait first turns AI
const HAND_PACE = 0.6;
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
  // what the doodles were last set to show; acting only when it changes keeps React's second effect run
  // (in development) from undoing the first
  const applied = useRef<{ start: boolean; mode: Mode } | null>(null);

  useEffect(() => {
    if (!strokes) return;
    const prev = applied.current;
    if (prev && prev.start === start && prev.mode === mode) return;
    applied.current = { start, mode };
    const still = window.matchMedia(REDUCED).matches;
    const now = performance.now();

    // out of view: cancel whatever is still booked (a hand line's fade from a copy under way), then wipe
    const wipe = () =>
      mv.forEach((v) => {
        v.fade.stop();
        v.aiFade.stop();
        for (const m of [v.len, v.show, v.aiLen, v.aiShow])
          animate(m, 0, { duration: 0.2 });
      });
    // into view: the hand draws every stroke DELAY_S later (jump() also cancels anything still booked)
    const hand = () =>
      strokes.forEach((s, i) => {
        const v = mv[i];
        v.fade.jump(1);
        v.aiFade.jump(1);
        v.aiLen.jump(0);
        v.aiShow.jump(0);
        if (still) {
          v.len.jump(1);
          v.show.jump(1);
          handDone.current[i] = now;
          return;
        }
        const at = DELAY_S + s.at * HAND_PACE,
          dur = s.dur * HAND_PACE;
        animate(v.len, 1, { delay: at, duration: dur, ease });
        animate(v.show, 1, { delay: at, duration: 0.01 });
        handDone.current[i] = now + (at + dur) * 1000;
      });
    // the AI's copy: in the hand's order at twice its pace, never before the hand has finished a stroke
    const copy = () =>
      strokes.forEach((s, i) => {
        const v = mv[i];
        const begin = Math.max(
          now + (AI_LEAD_S + s.at * AI_PACE) * 1000,
          handDone.current[i] ?? now,
        );
        const delay = still ? 0 : (begin - now) / 1000,
          dur = still ? 0 : s.dur * AI_PACE;
        v.aiLen.jump(0);
        v.aiShow.jump(0);
        v.aiFade.jump(1);
        animate(v.aiLen, 1, { delay, duration: dur, ease: "linear" });
        animate(v.aiShow, 1, { delay, duration: 0.01 });
        // the hand's line dims as the copy starts over it, and is gone once the copy is complete
        animate(v.fade, [1, 0.3, 0], {
          delay,
          duration: dur + 0.3,
          times: [0, 0.1, 1],
        });
      });
    // back to Human: the AI's copy is put away and the hand sketches it all again
    const again = () =>
      strokes.forEach((s, i) => {
        const v = mv[i];
        animate(v.aiFade, 0, { duration: still ? 0 : 0.3 });
        const at = still ? 0 : AI_LEAD_S + s.at * HAND_PACE,
          dur = still ? 0 : s.dur * HAND_PACE;
        v.len.jump(0);
        v.show.jump(1);
        v.fade.jump(1); // also cancels a hand-line fade still booked from the copy
        animate(v.len, 1, { delay: at, duration: dur, ease });
        handDone.current[i] = now + (at + dur) * 1000;
      });

    if (!start) return wipe();
    if (!prev?.start) {
      hand();
      if (mode === "ai") copy();
    } else if (mode === "ai") copy();
    else again();
  }, [start, mode, strokes, mv]);

  if (!strokes) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 810 1080"
      className="player-doodles pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* the hand's lines, then the AI's copies over them (DoodleStroke.tsx: no filters, no masks) */}
      <g>
        {strokes.map((s, i) => (
          <DoodleStroke
            key={i}
            s={s}
            len={mv[i].len}
            show={mv[i].show}
            fade={mv[i].fade}
          />
        ))}
      </g>
      <g>
        {strokes.map((s, i) => (
          <DoodleStroke
            key={i}
            s={s}
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
