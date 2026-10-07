"use client";

// onBlue's CTA decode (onblue-vesper/design.md, Micro-interactions): on hover or focus each character is held
// at its own width, then glyph noise settles into the real letters left to right, so the label never reflows.
// The link is the trigger (its padding included), so it is a link here. Under reduced motion it does nothing.
import { useRef, type CSSProperties } from "react";

const NOISE = "!<>-_\\/[]{}=+*^?#01";
const RUN_MS = 520;

export function ScrambleLink({ text, href, className, style }: { text: string; href: string; className?: string; style?: CSSProperties }) {
  const box = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const run = () => {
    const el = box.current;
    if (!el || busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    const cells = [...el.children] as HTMLSpanElement[];
    cells.forEach((c) => {
      c.style.width = `${c.getBoundingClientRect().width}px`;
    });
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / RUN_MS);
      cells.forEach((c, i) => {
        const ch = text[i];
        c.textContent = ch === " " || k >= (i + 1) / cells.length ? ch : NOISE[Math.floor(Math.random() * NOISE.length)];
      });
      if (k < 1) return requestAnimationFrame(step);
      cells.forEach((c) => (c.style.width = ""));
      busy.current = false;
    };
    requestAnimationFrame(step);
  };

  return (
    <a href={href} className={className} style={style} onMouseEnter={run} onFocus={run}>
      <span className="sr-only">{text}</span>
      <span ref={box} aria-hidden className="inline-flex whitespace-pre">
        {[...text].map((ch, i) => (
          <span key={i} className="inline-block text-center">
            {ch}
          </span>
        ))}
      </span>
    </a>
  );
}
