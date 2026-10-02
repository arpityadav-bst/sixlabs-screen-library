"use client";

// One 1x1 high-performance WebGL context, cleared twice a second while the page is in view, as the site's own
// src/tiles/gpu-awake.js keeps the floor's. A two-GPU Mac switches GPUs, and freezes the page for about a
// second, when the last high-performance context goes, and powers an idle discrete GPU down, which freezes it
// again on wake. HeavySlot releases specimens as they scroll away (the floor, the liquid, the water, the hero
// frames), so without this the reader would hit that freeze each time a slot let go. It starts with the first
// claim the budget grants (in the same call, before the specimen mounts its own context) and then runs for the
// life of the guide page, so it precedes every release, and a reader who never nears a WebGL slot never wakes
// the discrete GPU for it. It is not a specimen and draws nothing on screen, so it sits outside HeavySlot and
// the budget. A hidden tab rests it.
import { useEffect } from "react";
import { budgetNow, onBudget, type BudgetSnapshot } from "./gl-budget";

const BEAT_MS = 500;

const inUse = (b: BudgetSnapshot) => b.gl + b.floor + b.frames > 0;

export function GpuAwake() {
  useEffect(() => {
    let gl: WebGLRenderingContext | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let timer = 0;
    let retry = 0;

    const beat = () => {
      if (document.hidden || !gl || gl.isContextLost()) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.flush(); // sent to the GPU now, not held for a frame that never comes
    };
    // the browser may take it back when contexts run short (it is the oldest), so it starts again, newest
    const onLost = () => {
      stop();
      retry = window.setTimeout(start, 1000);
    };
    const stop = () => {
      window.clearInterval(timer);
      canvas?.removeEventListener("webglcontextlost", onLost);
      gl = null;
      canvas = null;
    };
    function start() {
      canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      canvas.addEventListener("webglcontextlost", onLost);
      try {
        gl = canvas.getContext("webgl", {
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
        });
      } catch {
        gl = null;
      }
      if (gl) timer = window.setInterval(beat, BEAT_MS);
    }

    // wait for the first granted claim, then keep beating
    let off: (() => void) | null = null;
    if (inUse(budgetNow())) start();
    else {
      off = onBudget((b) => {
        if (!inUse(b) || !off) return;
        off();
        off = null;
        start();
      });
    }
    // leaving the guide only stops the beat: losing the context here would be the GPU switch it exists to avoid
    return () => {
      off?.();
      window.clearTimeout(retry);
      stop();
    };
  }, []);
  return null;
}
