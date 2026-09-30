// The hero headline's accent word, typed in behind a caret, as the onBlue creators hero does it
// (blueai/public/experiments/onblue-vesper). Pure CSS (.tw-* in globals.css), so it starts the moment the
// page is painted, never waiting for the page's scripts or the tile floor: each letter already holds its
// place (transparent until its turn), so nothing reflows; letter i appears at START + i x STEP, a thin
// glowing accent caret stands against it for its turn, and after the last letter the caret blinks a moment
// and fades. Reduced motion shows the word as it is.

export function TypedWord({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const last = word.length - 1;
  return (
    <span className={className}>
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
