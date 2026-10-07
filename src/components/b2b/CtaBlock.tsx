"use client";

// The hero's close: the line with the live twin count as the model's own prompt, in the terminal's type with a
// blinking block caret, the count in blue, and under it the call to action.
import { useEffect, useRef } from "react";
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
    <div className="flex flex-col items-center">
      <p className={`${MONO} text-[13px] tracking-[-0.01em] text-[#0a1b33] md:text-[15px]`}>
        <span className="text-accent">›</span> <Live bind={bind} start={start} className="font-medium text-accent" /> players have a twin. Yours next
        <span aria-hidden className="ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-accent" />
      </p>
      <ScrambleLink href="#" text="See how it works" className="b2b-btn b2b-btn-solid mt-5 h-[46px] px-7 text-[15px]" />
    </div>
  );
}
