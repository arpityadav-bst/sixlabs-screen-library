"use client";

// A box that scrolls sideways when its content is wider than it. While it overflows it takes a tab stop and
// names itself as a region, so a keyboard reader can scroll it with the arrow keys. When everything fits it
// is a plain box, with no stop that does nothing.
import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScrollBox({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // the observer reports once on observe, then on every resize of the box or its content
    const ro = new ResizeObserver(() => setScrolls(el.scrollWidth > el.clientWidth + 1));
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className={className}
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? "region" : undefined}
      aria-label={scrolls ? label : undefined}
    >
      {children}
    </div>
  );
}
