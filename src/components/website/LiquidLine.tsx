"use client";

// The scroll line's sentence under liquid (ScrubLine.tsx), on desktops only (a wide screen, a mouse, motion
// allowed): the words are drawn into a picture exactly where the page lays them out (each word at its own
// place, in the line's own font, size and tracking) and in their fill as the scroll leaves it, and a canvas
// over them shows that picture through Canvas UI's liquid (liquid/liquid-sim.ts): the cursor drags the words
// about, splits their colours round it and lights them where it flows. Once the canvas is live, onLive(true)
// tells the line to make its own words transparent; they stay in place for layout, selection and reading.
import { useEffect, useRef, type RefObject } from "react";

const M = 56; // px of room round the words for the liquid to drag them into
const FILL_S = 0.2; // a word's fill from faint to full, as the words' own transition (200ms)
const INK = [10, 27, 51],
  ACCENT = [26, 109, 255];
const FAINT = 0.15; // an unlit word's opacity, as text-[#0a1b33]/15
const DESKTOP =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type Word = { text: string; x: number; y: number; accent: boolean };

export function LiquidLine({
  para,
  lit,
  accents,
  onLive,
}: {
  para: RefObject<HTMLParagraphElement | null>;
  lit: number;
  accents: boolean[];
  onLive: (live: boolean) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const litNow = useRef(lit);
  useEffect(() => {
    litNow.current = lit;
  }, [lit]);

  useEffect(() => {
    const p = para.current,
      c = canvas.current;
    const mq = window.matchMedia(DESKTOP);
    if (!p || !c || !mq.matches) return;
    const pic = document.createElement("canvas"),
      ctx = pic.getContext("2d");
    if (!ctx) return;
    let words: Word[] = [],
      level: number[] = [],
      dpr = 1,
      dirty = true,
      ready = false,
      last = performance.now();

    // where each word sits, in the picture (the paragraph and M round it)
    const layout = () => {
      const pr = p.getBoundingClientRect(),
        cs = getComputedStyle(p);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      pic.width = Math.round((pr.width + 2 * M) * dpr);
      pic.height = Math.round((pr.height + 2 * M) * dpr);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.letterSpacing =
        cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      const ascent = ctx.measureText("Hg").fontBoundingBoxAscent;
      words = Array.from(p.querySelectorAll(":scope > span"), (s, k) => {
        const r = s.getClientRects()[0];
        return {
          text: (s.textContent ?? "").trim(),
          x: r.left - pr.left + M,
          y: r.top - pr.top + M + ascent,
          accent: accents[k],
        };
      });
      if (level.length !== words.length)
        level = words.map((_, k) => (k < litNow.current ? 1 : 0));
      dirty = true;
    };
    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pic.width, pic.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      words.forEach((w, k) => {
        const f = level[k],
          to = w.accent ? ACCENT : INK,
          [r, g, b] = INK.map((v, i) => Math.round(v + (to[i] - v) * f));
        ctx.fillStyle = `rgba(${r},${g},${b},${FAINT + (1 - FAINT) * f})`;
        ctx.fillText(w.text, w.x, w.y);
      });
    };
    // before each frame: the words' fill follows the scroll at the words' own pace; redrawn when it moved
    const frame = () => {
      const now = performance.now(),
        step = (now - last) / 1000 / FILL_S;
      last = now;
      if (!ready) return false;
      level = level.map((f, k) => {
        const to = k < litNow.current ? 1 : 0;
        if (f === to) return f;
        dirty = true;
        return to > f ? Math.min(to, f + step) : Math.max(to, f - step);
      });
      if (!dirty) return false;
      dirty = false;
      draw();
      return true;
    };

    let sim: { destroy(): void } | null = null,
      gone = false;
    const ro = new ResizeObserver(layout);
    // the simulation loads with the effect only, once the line's font is in (the words are drawn in it)
    Promise.all([document.fonts.ready, import("./liquid/liquid-sim")]).then(
      ([, { createLiquid }]) => {
        if (gone) return;
        layout();
        ro.observe(p);
        sim = createLiquid(c, pic, frame);
        if (!sim) return;
        ready = true;
        onLive(true);
      },
    );
    // narrowed below a desktop, the canvas hides (max-lg:hidden) and the words show their own ink again
    const onChange = () => ready && onLive(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      gone = true;
      mq.removeEventListener("change", onChange);
      ro.disconnect();
      sim?.destroy();
      onLive(false);
    };
  }, [para, accents, onLive]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none absolute max-lg:hidden"
      style={{
        left: -M,
        top: -M,
        width: `calc(100% + ${2 * M}px)`,
        height: `calc(100% + ${2 * M}px)`,
      }}
    />
  );
}
