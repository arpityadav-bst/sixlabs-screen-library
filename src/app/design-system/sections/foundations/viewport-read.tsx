"use client";

// The window width the measured type answers to. vw clamps and md steps follow the window, not the
// panel, so every reading on the page says which window it came from.
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};

export function ReadAt() {
  const w = useSyncExternalStore(subscribe, () => window.innerWidth, () => 0);
  if (!w) return <>measuring the window</>;
  return <>measured in a {w}px window, md steps {w >= 768 ? "on" : "off"}</>;
}
