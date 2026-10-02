"use client";

// Type metrics read from the rendered element, never transcribed: getComputedStyle gives the family,
// size, weight, line height and tracking, and the caption reads "44px / 500 · -0.025em · 1.1 · Outfit".
// It reads again when the window resizes, because the site's sizes change at its breakpoints.
import { useCallback, useEffect, useState } from "react";

export type TypeMetrics = {
  family: string;
  size: number;
  weight: string;
  /** line height over size, or "normal" */
  leading: number | "normal";
  /** letter spacing in em, 0 for normal */
  tracking: number;
};

const trim = (n: number, places: number) => String(+n.toFixed(places));

/** The family the reader sees: the first in the stack, without quotes or next/font's hash. */
export function familyName(stack: string): string {
  const first = stack.split(",")[0]?.trim().replace(/^["']|["']$/g, "") ?? "";
  return first.replace(/^_+/, "").replace(/_[0-9a-f]{5,}$/i, "").replace(/_/g, " ").trim();
}

export function metricsOf(el: Element): TypeMetrics {
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize) || 0;
  const lh = cs.lineHeight === "normal" ? "normal" : size ? parseFloat(cs.lineHeight) / size : 0;
  const ls = cs.letterSpacing === "normal" ? 0 : size ? parseFloat(cs.letterSpacing) / size : 0;
  return { family: familyName(cs.fontFamily), size, weight: cs.fontWeight, leading: lh, tracking: ls };
}

/** "44px / 500 · -0.025em · 1.1 · Outfit" */
export function metricsCaption(m: TypeMetrics): string {
  const tracking = m.tracking === 0 ? "0em" : `${trim(m.tracking, 3)}em`;
  const leading = m.leading === "normal" ? "normal" : trim(m.leading, 2);
  return `${trim(m.size, 2)}px / ${m.weight} · ${tracking} · ${leading} · ${m.family}`;
}

/** const [ref, caption] = useMetrics<HTMLHeadingElement>(). The caption is "" until measured. */
export function useMetrics<T extends Element>(): [(el: T | null) => void, string, TypeMetrics | null] {
  const [el, setEl] = useState<T | null>(null);
  const [m, setM] = useState<TypeMetrics | null>(null);
  const ref = useCallback((node: T | null) => setEl(node), []);

  useEffect(() => {
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      setM(metricsOf(el));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    schedule();
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, [el]);

  return [ref, m ? metricsCaption(m) : "", m];
}
