"use client";

// Back to the top: a small round button fixed at the page's bottom right, in the page's light look (white,
// hairline, soft shadow, navy arrow). It shows once the page is past the scroll line section (from the
// players on) and leaves above it. A press glides the page to the top in one smooth run (glide.ts), and
// the section glides it passes through wait for it rather than take over.
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { easeOut, glideTo } from "./glide";

export function BackToTop() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const line = document.getElementById("model-line");
    let queued = false;
    const check = () => {
      queued = false;
      if (!line) return;
      // the scroll line's track has run out: the players are in
      const past =
        line.getBoundingClientRect().bottom <= window.innerHeight + 2;
      setOn(past);
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(check);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // longer runs take a little longer, never a drag
  const toTop = () =>
    glideTo(0, Math.min(2.2, 0.9 + window.scrollY / 4000), easeOut);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={toTop}
      tabIndex={on ? 0 : -1}
      className={
        "fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-slate-200/80 bg-white text-[#0a1b33] shadow-[0_1px_2px_rgba(10,27,51,0.06),0_12px_28px_-12px_rgba(10,27,51,0.35)] transition-[opacity,translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-slate-50 max-md:bottom-4 max-md:right-4 max-md:h-10 max-md:w-10 " +
        (on ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0")
      }
    >
      <ArrowUp className="h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
}
