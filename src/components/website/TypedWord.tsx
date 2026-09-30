"use client";

// The hero headline's accent word, typed in behind a blinking caret, as the onBlue creators hero does it
// (blueai/public/experiments/onblue-vesper): the rest of the headline arrives as usual, then this word's
// letters appear one by one, each already holding its place (transparent until typed), so nothing
// reflows. Each letter books the next only once it has appeared (a chain, never a batch of timers), so a
// busy moment on the page can delay the typing but never bunch it into one jump. The caret, a thin glowing
// accent bar, shows only while typing, against the last letter shown (measured from that letter's own
// box), and fades a moment after the word is done. Reduced motion shows the word as it is.
import { useEffect, useRef, useState } from "react";

const START_MS = 600; // after the hero copy has faded in
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
  const [phase, setPhase] = useState<"wait" | "typing" | "done">("wait");

  useEffect(() => {
    let t = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      t = window.setTimeout(() => {
        setN(word.length);
        setPhase("done");
      }, 0);
      return () => clearTimeout(t);
    }
    let k = 0;
    const next = () => {
      k++;
      setN(k);
      if (k < word.length) t = window.setTimeout(next, LETTER_MS);
      else t = window.setTimeout(() => setPhase("done"), LINGER_MS);
    };
    t = window.setTimeout(() => {
      setPhase("typing");
      next();
    }, START_MS);
    return () => clearTimeout(t);
  }, [word]);

  // the caret against the last letter shown
  useEffect(() => {
    const b = box.current,
      c = caret.current;
    if (!b || !c || n === 0) return;
    const letter = b.querySelectorAll<HTMLSpanElement>("[data-letter]")[n - 1];
    if (!letter) return;
    const frame = b.getBoundingClientRect(),
      r = letter.getBoundingClientRect();
    c.style.left = `${r.right - frame.left}px`;
    c.style.top = `${r.top - frame.top + r.height * 0.15}px`;
    c.style.height = `${r.height * 0.7}px`;
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
          "pointer-events-none absolute w-[2px] rounded-[1px] bg-accent " +
          (phase === "typing"
            ? "type-caret"
            : phase === "done"
              ? "type-caret is-done"
              : "opacity-0")
        }
      />
    </span>
  );
}
