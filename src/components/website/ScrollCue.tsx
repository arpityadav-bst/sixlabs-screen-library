"use client";

// "Scroll" cue in the row under the hero: a small label with an arrow centred under it; the arrow bobs gently. It fades away
// once the page has been scrolled.
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

export function ScrollCue() {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const onScroll = () => setAway(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none flex flex-col items-center gap-1.5 p-1 text-slate-400 transition-opacity duration-300 " +
        (away ? "opacity-0" : "opacity-100")
      }
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.18em]">Scroll</span>
      <ArrowDown className="scroll-bob h-4 w-4" strokeWidth={1.75} />
    </div>
  );
}
