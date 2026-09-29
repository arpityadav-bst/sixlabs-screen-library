"use client";

// Which of a player's clip files this browser plays (players-data.ts). Most play the see-through WebM
// directly ("webm"). Safari, and every browser on iPhone and iPad (all WebKit underneath), plays WebM but
// draws its transparency black, so there the clips are the "stacked" MP4s (colour above, transparency
// below, put together by stacked-alpha.ts), or the stills if WebGL is missing ("still"). The server and the
// first render assume WebM; the check runs in the browser.
import { useSyncExternalStore } from "react";

export type ClipFormat = "webm" | "stacked" | "still";

const noop = () => () => {};
let cached: ClipFormat | null = null;

function clipFormat(): ClipFormat {
  if (cached) return cached;
  const ua = navigator.userAgent;
  const apple =
    /iP(hone|ad|od)/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports a Mac
  const safari = /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\//.test(ua);
  if (!(apple || safari)) return (cached = "webm");
  const gl = document.createElement("canvas").getContext("webgl");
  return (cached = gl ? "stacked" : "still");
}

export function useClipFormat() {
  return useSyncExternalStore(noop, clipFormat, () => "webm" as ClipFormat);
}
