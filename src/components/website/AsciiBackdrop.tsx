"use client";

// Page background: the onBlue ambient ASCII field (ascii-field.js) on a fixed, viewport-sized layer behind
// every section, so it shows only on the page's own white. The content sits on top, so the field listens
// for the pointer on the whole document. Glyphs rest in navy and warm to the accent blue under the cursor.
// Touch screens get the ambient field without the pointer pool.
import { useEffect, useRef } from "react";
import { mountAsciiField } from "./ascii-field";

export function AsciiBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || host.firstChild) return;
    mountAsciiField({
      host,
      track: document.documentElement,
      reach: 120, // cursor pool radius in px (onBlue: 190)
      lens: 0.24, // how much the pool brightens a glyph (onBlue: 0.42)
      pointer: window.matchMedia("(hover: hover)").matches,
    });
  }, []);

  return <div ref={ref} aria-hidden className="ascii-host pointer-events-none fixed inset-0 -z-10" />;
}
