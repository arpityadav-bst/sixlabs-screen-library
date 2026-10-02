"use client";

// A media query read live, false on the server and in the first paint, so server and client markup agree
// and the switch happens once the page is interactive. Breakpoint queries come from MEDIA in token-space.ts,
// so every part agrees on where a phone ends.
import { useSyncExternalStore } from "react";

export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", notify);
      return () => m.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
