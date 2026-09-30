"use client";

// For the time being (a walkthrough where the page is only scrolled): every link and call to action on the
// website pages does nothing when clicked. They still show their hover. A click (or Enter, or a middle
// click) on any link, or on a control marked data-cta (Try now, Sign in, the footer's Back to top), is
// stopped before the page or its handlers see it. The page's own controls (the wave button, the players'
// switch and arrows, the FAQ, the jobs' tabs, the language menu, the floating back-to-top button) still
// work. To lift it, remove <ClickLock /> from the pages.
import { useEffect } from "react";

const LOCKED = "a, [data-cta]";

export function ClickLock() {
  useEffect(() => {
    const stop = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.(LOCKED)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("click", stop, true);
    document.addEventListener("auxclick", stop, true);
    return () => {
      document.removeEventListener("click", stop, true);
      document.removeEventListener("auxclick", stop, true);
    };
  }, []);
  return null;
}
