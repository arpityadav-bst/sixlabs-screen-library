"use client";

// The hero's close: the call to action, and under it, quieter, the line with the live twin count as the
// model's own prompt, in the terminal's type with a blinking block caret. At onBlue's dark hero's sizes and in
// its entrance (b2b.css): the button rising from 94%, the line after it, as its "Already part of onBlue?" line.
import { useEffect, useRef, type CSSProperties } from "react";
import { ScrambleLink } from "./Scramble";

type Bind = (set: (s: string) => void) => () => void;

const MONO = "font-[family-name:var(--font-jbmono)]";

// the twin count, set as each twin lands
function Live({ bind, start, className }: { bind: Bind; start: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      bind((s) => {
        if (el.current) el.current.textContent = s;
      }),
    [bind],
  );
  return (
    <span ref={el} className={className}>
      {start}
    </span>
  );
}

export function CtaBlock({ start, bind }: { start: string; bind: Bind }) {
  return (
    <div data-grid-clear className="mx-auto flex w-fit flex-col items-center">
      <ScrambleLink
        href="#"
        text="See how it works"
        className="b2b-btn b2b-btn-solid b2b-in-btn h-[var(--cta-h)] px-[var(--cta-pad)] [font-size:var(--cta-fs)]"
        style={{ "--d": "1.5s" } as CSSProperties}
      />
      <p
        className={`${MONO} b2b-in-soft mt-[var(--actions-mt)] tracking-[-0.01em] text-[var(--b2b-muted)] [font-size:var(--alt)]`}
        style={{ "--d": "1.58s" } as CSSProperties}
      >
        <span className="text-accent/70">›</span> <Live bind={bind} start={start} className="text-accent/80" /> players have a twin. Yours next
        <span aria-hidden className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.16em] animate-pulse bg-accent/60" />
      </p>
    </div>
  );
}
