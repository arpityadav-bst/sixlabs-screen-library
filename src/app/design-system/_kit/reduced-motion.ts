"use client";

// The reader's prefers-reduced-motion setting, live, for the toolbar pill and any specimen that has to
// say which reading the reader is seeing. False on the server and in the first paint (useMedia).
import { useMedia } from "@/components/design-system/use-media";

const REDUCE = "(prefers-reduced-motion: reduce)";

/** A shared do-nothing handler, for a specimen that needs a callback it never acts on. */
export const noop = () => {};

// the system's own media hook, so the guide and the parts read the setting the same way: one query, one
// subscription per reader, false until the page is interactive

export function useReducedMotionSetting(): boolean {
  return useMedia(REDUCE);
}
