"use client";

// The players section's portrait (PortraitSwap.tsx) where the browser shows the stacked clips (useClipFormat.ts:
// Chrome and Safari): both copies' cursor-scrubbed turns (PlayerPortrait.tsx), each handing its frames to one
// shared canvas, and the Human / AI switch (ModeToggle.tsx), all drawn by one shader (swap-gl.ts) from frames
// already on the GPU. The switch sweeps a wide band up the portrait as before, over SWEEP_S on the same ease.
// Only the copy on screen follows the cursor, so only its frames are decoded; the other rests on its last
// frame, and is woken to turn to the cursor the moment a switch begins (both follow while the band runs).
// Until a copy's first frame is in, the canvas shows its still. Reduced motion swaps at once.
import { useCallback, useEffect, useRef } from "react";
import { PlayerPortrait } from "./PlayerPortrait";
import type { Mode } from "./ModeToggle";
import { SIZE, SWEEP, swapGL, type SwapGL } from "./swap-gl";

type Clip = { src: string; straight: number; stacked: string; still: string };
const SWEEP_S = 1.5; // the band's run up the portrait, seconds

export function StackedSwap({
  human,
  ai,
  mode,
  label,
  className,
  load = true,
}: {
  human: Clip;
  ai: Clip;
  mode: Mode;
  label: string;
  className?: string;
  load?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // what the copies and the switch share: the renderer, the copy on screen, the band under way, the stills
  const gl = useRef<SwapGL | null>(null);
  const shown = useRef<0 | 1>(0);
  const sweep = useRef<{ into: 0 | 1; mid: number } | null>(null);
  const stills = useRef(["", ""]);
  const wakeHuman = useRef<(() => void) | null>(null),
    wakeAi = useRef<(() => void) | null>(null);
  // the renderer, made on first use
  const renderer = useCallback(() => {
    if (!gl.current && canvas.current) gl.current = swapGL(canvas.current);
    return gl.current;
  }, []);
  const redraw = useCallback(() => {
    const g = renderer(),
      cv = canvas.current;
    if (!g || !cv) return;
    g.draw(shown.current, sweep.current);
    // its still under the canvas until the copy on screen has a frame of its own
    cv.style.backgroundImage = g.has(shown.current) ? "none" : `url(${stills.current[shown.current]})`;
  }, [renderer]);
  // each copy's frames, and whether it follows the cursor now
  const drawTo = useCallback(
    (slot: 0 | 1, frame: HTMLVideoElement | VideoFrame) => {
      const g = renderer();
      if (!g) return;
      g.upload(slot, frame);
      if (slot === shown.current || sweep.current) redraw();
    },
    [renderer, redraw],
  );
  const drawHuman = useCallback((f: HTMLVideoElement | VideoFrame) => drawTo(0, f), [drawTo]),
    drawAi = useCallback((f: HTMLVideoElement | VideoFrame) => drawTo(1, f), [drawTo]);
  const humanActive = useCallback(() => shown.current === 0 || !!sweep.current, []),
    aiActive = useCallback(() => shown.current === 1 || !!sweep.current, []);
  const onScreen = useRef<Mode | null>(null); // the copy actually showing, null before the first

  useEffect(() => {
    stills.current = [human.still, ai.still];
    const wake = [wakeHuman, wakeAi];
    const into: 0 | 1 = mode === "ai" ? 1 : 0;
    const from = onScreen.current;
    onScreen.current = mode;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const g = renderer();
    // only a change from the copy on screen sweeps, once both copies have a frame to show; the first showing
    // (and React running an effect twice in development) just settles
    if (from === null || from === mode || reduced || !g || !g.has(into) || !g.has((1 - into) as 0 | 1)) {
      sweep.current = null;
      shown.current = into;
      wake[into].current?.();
      return redraw();
    }
    const H = SIZE.h,
      t0 = performance.now();
    sweep.current = { into, mid: H + SWEEP.band / 2 }; // under way (the band still below the portrait), so
    wake[into].current?.(); // the new copy, woken now, follows the cursor: it turns to it if it had been resting
    let raf = 0;
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / (SWEEP_S * 1000));
      const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
      // the dome's top, from the whole band just below the portrait to the whole band just above it
      sweep.current = { into, mid: H + SWEEP.band / 2 - e * (H + SWEEP.band + SWEEP.rise) };
      if (k >= 1) {
        sweep.current = null;
        shown.current = into;
      }
      redraw();
      if (k < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      sweep.current = null;
      shown.current = into;
    };
  }, [mode, renderer, redraw, human.still, ai.still]);

  const copy = (c: Clip, slot: 0 | 1, name: string) => (
    <PlayerPortrait
      src={c.src}
      straight={c.straight}
      label={name}
      load={load}
      stacked={c.stacked}
      drawTo={slot ? drawAi : drawHuman}
      boxRef={canvas}
      active={slot ? aiActive : humanActive}
      wakeRef={slot ? wakeAi : wakeHuman}
    />
  );
  return (
    <div className="relative">
      <canvas
        ref={canvas}
        width={SIZE.w}
        height={SIZE.h}
        role="img"
        aria-label={mode === "ai" ? `${label}, AI copy` : label}
        className={"block " + (className ?? "")}
        style={{ backgroundSize: "100% 100%" }}
      />
      {copy(human, 0, label)}
      {copy(ai, 1, `${label}, AI copy`)}
    </div>
  );
}
