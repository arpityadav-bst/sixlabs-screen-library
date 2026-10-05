"use client";

// The players section (Players.tsx) is built for screens up to 1920px wide: its content caps at 1400px and
// its portrait at 720px tall. On a wider screen (a 24" iMac shows about 2240px) that block sat small in a
// sea of blue, as if the page were at 1080p. Past BASE the content is scaled up evenly by how much wider the
// screen is (never past MAX), and never so far that it would no longer fit between the header clearance and
// the section's foot. A transform, so the section's own layout (its pull up over the scroll line, its full
// screen height) is untouched; at BASE and below nothing changes. Only on dense (Retina-class) screens, where a
// wide CSS width means a big physical screen seen up close; a 1440p monitor at 100% (density 1) keeps the layout.
import { useEffect, type RefObject } from "react";

const BASE = 1920; // px of viewport width the section is designed at
const MAX = 1.35;
const CLEAR = 96 + 40; // the section's top padding (header clearance) and foot padding
const DENSE = 1.5; // devicePixelRatio from which the scale applies

export function usePlayersScale(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const h = el.offsetHeight; // layout height, unaffected by the transform
      const s = (window.devicePixelRatio || 1) < DENSE ? 1 : Math.max(1, Math.min(MAX, window.innerWidth / BASE, h ? (window.innerHeight - CLEAR) / h : 1));
      el.style.transform = s > 1.001 ? `scale(${s.toFixed(4)})` : "";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      el.style.transform = "";
    };
  }, [ref]);
}
