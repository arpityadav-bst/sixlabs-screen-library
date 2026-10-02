"use client";

// Which section the reader is in. One IntersectionObserver watches every section, and the current one is
// the first section crossing the band under the toolbar in DOM order (catalog order is DOM order), so the
// highlight never lands on a later link while an earlier section still fills the band. Between sections,
// when nothing crosses it, the last answer stands.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SECTION_IDS, type SectionId } from "../_data/catalog";
import { GUIDE_TOP } from "./guide-metrics";

const CurrentSection = createContext<SectionId>(SECTION_IDS[0]);

export function useCurrentSection(): SectionId {
  return useContext(CurrentSection);
}

export function SpyProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<SectionId>(SECTION_IDS[0]);

  useEffect(() => {
    const live = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target.id);
          else live.delete(e.target.id);
        }
        const first = SECTION_IDS.find((id) => live.has(id));
        if (first) setCurrent(first);
      },
      { rootMargin: `-${GUIDE_TOP}px 0px -65% 0px` },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return <CurrentSection.Provider value={current}>{children}</CurrentSection.Provider>;
}
