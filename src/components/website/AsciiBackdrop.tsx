"use client";

// Page background: the onBlue ambient ASCII field (ascii-field.js) on a fixed, viewport-sized layer behind
// every section, so it shows only on the page's own white. The content sits on top, so the field listens
// for the pointer on the whole document. Glyphs rest in navy and warm to the accent blue under the cursor.
// Touch screens get the ambient field without the pointer pool. Past the line (#model-line, section 2) it
// is paused: from there the players' water covers it and then the noise's ground (.page-grain), so it is
// hidden (display none), which its own visibility watch reads as off screen and stops drawing; it wakes
// the moment the view is back in the line. It is hidden too while something marked data-covers-view (the
// full view's hero) fills the whole screen, where none of it would show, and for good in lite mode (perf.ts).
import { useEffect, useRef } from "react";
import { mountAsciiField } from "./ascii-field";
import { isLite, LITE } from "./perf";

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

  useEffect(() => {
    const host = ref.current;
    const line = document.getElementById("model-line");
    if (!host || !line) return;
    // past the line: its foot at or above the view's, where the water has filled the view
    const cover = document.querySelector("[data-covers-view]");
    const check = () => {
      const h = window.innerHeight,
        past = line.getBoundingClientRect().bottom <= h + 1,
        c = cover?.getBoundingClientRect(),
        covered = !!c && c.top <= 0 && c.bottom >= h;
      host.style.display = past || covered || isLite() ? "none" : "";
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    window.addEventListener(LITE, check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.removeEventListener(LITE, check);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="ascii-host pointer-events-none fixed inset-0 -z-10"
    />
  );
}
