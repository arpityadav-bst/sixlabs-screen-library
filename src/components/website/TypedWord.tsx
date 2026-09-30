"use client";

// The hero headline's accent word, typed in behind a blinking caret, after the onBlue creators hero
// (blueai/public/experiments/onblue-vesper): the rest of the headline arrives as usual, then this word's
// letters appear one by one, LETTER_MS apart, each already holding its place (they are only transparent
// until typed), so nothing reflows. The caret, a thin glowing accent bar, sits against the last letter
// shown, measured from that letter's own box, and fades away a moment after the word is complete.
// Reduced motion shows the word as it is.
import { useEffect, useRef, useState } from "react";

const START_MS = 700; // after the hero copy has faded in
const LETTER_MS = 90;
const LINGER_MS = 700; // the caret stays this long once the word is done

export function TypedWord({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const caret = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0); // letters shown
  const [gone, setGone] = useState(false); // the caret, once it has faded

  useEffect(() => {
    const timers: number[] = [];
    const later = (ms: number, f: () => void) =>
      timers.push(window.setTimeout(f, ms));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      later(0, () => {
        setN(word.length);
        setGone(true);
      });
    } else {
      for (let k = 1; k <= word.length; k++)
        later(START_MS + k * LETTER_MS, () => setN(k));
      later(START_MS + word.length * LETTER_MS + LINGER_MS, () =>
        setGone(true),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [word]);

  // the caret against the last letter shown (or the word's start before the first)
  useEffect(() => {
    const b = box.current,
      c = caret.current;
    if (!b || !c) return;
    const letters = b.querySelectorAll<HTMLSpanElement>("[data-letter]");
    const frame = b.getBoundingClientRect();
    const ref = letters[Math.max(0, n - 1)]?.getBoundingClientRect();
    if (!ref) return;
    const x = n === 0 ? ref.left : ref.right;
    c.style.left = `${x - frame.left}px`;
    c.style.top = `${ref.top - frame.top + ref.height * 0.15}px`;
    c.style.height = `${ref.height * 0.7}px`;
  }, [n]);

  return (
    <span ref={box} className={"relative " + (className ?? "")}>
      {[...word].map((ch, i) => (
        <span
          key={i}
          data-letter
          className="transition-opacity duration-150"
          style={{ opacity: i < n ? 1 : 0 }}
        >
          {ch}
        </span>
      ))}
      <span
        ref={caret}
        aria-hidden
        className={
          "type-caret pointer-events-none absolute w-[2px] rounded-[1px] bg-accent " +
          (gone ? "is-done" : "")
        }
      />
    </span>
  );
}
