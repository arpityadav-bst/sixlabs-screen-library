"use client";

// Prints one computed CSS property of the specimen it wraps under it, so the caption is the browser's
// value rather than a transcription: "radius-sm · measured 16px".
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Computed({ prop, label, children }: { prop: string; label: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const target = box.current?.firstElementChild;
    if (!target) return;
    const raf = requestAnimationFrame(() => setValue(getComputedStyle(target).getPropertyValue(prop)));
    return () => cancelAnimationFrame(raf);
  }, [prop]);

  return (
    <figure className="ds-item">
      <div ref={box}>{children}</div>
      <figcaption className="ds-label">
        {label} · measured {value || "…"}
      </figcaption>
    </figure>
  );
}
