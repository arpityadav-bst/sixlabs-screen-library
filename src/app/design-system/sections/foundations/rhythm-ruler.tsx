"use client";

// Measures the vertical gaps between the direct children of its stage and draws each as a band with its
// size in px, read from the rendered boxes. It measures again on any resize of the stage or a child
// (the md steps change the gaps) and when fonts land, so a drifted margin shows its real number.
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./spacing.module.css";

type Gap = { top: number; height: number };

export function RhythmRuler({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const [gaps, setGaps] = useState<Gap[]>([]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const top = el.getBoundingClientRect().top;
      const kids = Array.from(el.children);
      const next: Gap[] = [];
      for (let i = 1; i < kids.length; i++) {
        const a = kids[i - 1].getBoundingClientRect();
        const b = kids[i].getBoundingClientRect();
        next.push({ top: a.bottom - top, height: b.top - a.bottom });
      }
      setGaps(next);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    for (const k of Array.from(el.children)) ro.observe(k);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={s["ds-ruler"]}>
      <div ref={stage} className={s["ds-ruler-stage"]}>
        {children}
      </div>
      <div className={s["ds-ruler-marks"]} aria-hidden="true">
        {gaps.map((g, i) => (
          <span key={i} className={s["ds-ruler-band"]} style={{ top: g.top, height: g.height }}>
            <b>{Math.round(g.height * 10) / 10}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
