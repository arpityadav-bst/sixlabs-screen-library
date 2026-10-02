"use client";

// The type metrics caption for a server section: it wraps a type specimen and prints the measured line
// of its first element (or of the element matching select) as a Label under it.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { metricsCaption, metricsOf } from "./useMetrics";

export function Metrics({
  select,
  source,
  children,
}: {
  /** what to measure inside (the first element by default) */
  select?: string;
  /** file:line printed after the metrics */
  source?: string;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState("");

  useEffect(() => {
    const el = box.current;
    const target = el && (select ? el.querySelector(select) : el.firstElementChild);
    if (!target) return;
    let raf = 0;
    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          setLine(metricsCaption(metricsOf(target)));
        });
    };
    schedule();
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, [select]);

  return (
    <figure className="ds-metrics">
      <div ref={box}>{children}</div>
      <figcaption className="ds-label">
        {line || "measuring"}
        {source && <span className="ds-src">{source}</span>}
      </figcaption>
    </figure>
  );
}
