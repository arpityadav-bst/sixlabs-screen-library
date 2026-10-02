"use client";

// Runs a motion specimen again by remounting its children. The trigger is a kit ghost xs button at the
// top-right of the Canvas it sits in (the Canvas is its positioning box), so use one Replay per Canvas. Its
// name says what it replays ("Replay Typed word"): `of` when given, else the title of the spec it sits in,
// read once it is mounted, so a list of the page's buttons tells the dozens of Replays apart.
import { RotateCcw } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

export function Replay({ children, label = "Replay", of }: { children: ReactNode; label?: string; of?: string }) {
  const [run, setRun] = useState(0);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const b = button.current;
    if (of || !b) return;
    const title = b.closest(".ds-spec")?.querySelector(".ds-spec-title")?.textContent?.trim();
    if (title) b.setAttribute("aria-label", `${label} ${title}`);
  }, [of, label]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="ds-btn ds-replay"
        aria-label={of ? `${label} ${of}` : undefined}
        onClick={() => setRun((n) => n + 1)}
      >
        <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
        {label}
      </button>
      <Fragment key={run}>{children}</Fragment>
    </>
  );
}
