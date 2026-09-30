"use client";

// A headline's accent words, typed in behind a caret, as the onBlue creators page does it
// (blueai/public/experiments/onblue-vesper). Pure CSS (.tw-* in globals.css): each letter already holds its
// place (transparent until its turn), so nothing reflows; letter i appears at START + i x STEP, a thin
// glowing accent caret stands against it for its turn, and after the last letter the caret blinks a moment
// and fades. In the hero it starts the moment the page is painted, never waiting for the scripts or the
// tile floor. With `onView` (the closing line) it waits, paused, until the words come into view, then types
// once. With `hold` it waits, paused, for as long as that is true (the full view's hero, whose copy comes in
// only after its loader), then types. Reduced motion shows the words as they are.
import { useEffect, useRef, useState } from "react";

export function TypedWord({
  word,
  className,
  onView,
  hold = false,
}: {
  word: string;
  className?: string;
  onView?: boolean;
  hold?: boolean;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(!onView);

  useEffect(() => {
    const el = box.current;
    if (!onView || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onView]);

  const last = word.length - 1;
  return (
    <span ref={box} className={(className ?? "") + (seen && !hold ? "" : " tw-wait")}>
      {[...word].map((ch, i) => (
        <span
          key={i}
          className={"tw-letter" + (i === last ? " tw-last" : "")}
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
