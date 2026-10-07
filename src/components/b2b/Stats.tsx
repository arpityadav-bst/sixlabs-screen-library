"use client";

// The hero's two numbers, the people (2B) and the twins made (counting up as each lands), out at the stage's
// edges over the crowd and the wall, with the 6labs mark between them over the line. Drawn as dot-matrix
// numerals, in the same dots as the twins and the line. `bind` hands the hero a setter for the twin count, so
// it can tick without React.
import { useEffect, useRef } from "react";
import { ModelMark } from "./ModelMark";

type Bind = (set: (text: string) => void) => () => void; // returns the unbind

const MONO = "font-[family-name:var(--font-jbmono)]";
const LABEL = `${MONO} text-[10px] uppercase tracking-[0.12em] text-[var(--b2b-muted)] md:text-[11px]`;
const ROW = "mx-auto grid w-full shrink-0 grid-cols-[1fr_auto_1fr] items-end px-5 md:px-[4vw]";

// 5 x 7 dot-matrix numerals, a comma and a B
const GLYPH: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  ",": ["0", "0", "0", "0", "0", "1", "1"],
};

// a number drawn in dots on a canvas, redrawn when the hero sets it
function Matrix({ text, color, bind, right }: { text: string; color: string; bind?: Bind; right?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const draw = (s: string) => {
      const p = window.innerWidth < 768 ? 3.4 : 4.6, dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cols = [...s].reduce((n, ch) => n + (GLYPH[ch]?.[0].length ?? 3) + 1, -1);
      c.style.width = `${cols * p}px`;
      c.style.height = `${7 * p}px`;
      c.width = Math.round(cols * p * dpr);
      c.height = Math.round(7 * p * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let x = 0;
      for (const ch of s) {
        const g = GLYPH[ch] ?? GLYPH["0"];
        g.forEach((row, j) =>
          [...row].forEach((v, i) => {
            ctx.fillStyle = color;
            ctx.globalAlpha = v === "1" ? 1 : 0.1;
            ctx.beginPath();
            ctx.arc(x + i * p + p / 2, j * p + p / 2, p * 0.36, 0, Math.PI * 2);
            ctx.fill();
          }),
        );
        x += (g[0].length + 1) * p;
      }
    };
    draw(text);
    return bind?.(draw);
  }, [text, color, bind]);
  return <canvas ref={ref} aria-label={text} className={"block " + (right ? "ml-auto" : "")} />;
}

export function Stats({ start, bind }: { start: string; bind: Bind }) {
  return (
    <div className={ROW}>
      <div>
        <Matrix text="2B" color="#0a1b33" />
        <p className={LABEL + " mt-3"}>human players</p>
      </div>
      <ModelMark />
      <div className="text-right">
        <Matrix text={start} color="#1a6dff" bind={bind} right />
        <p className={LABEL + " mt-3"}>twins made</p>
      </div>
    </div>
  );
}
