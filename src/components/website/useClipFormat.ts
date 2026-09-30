"use client";

// Which of a player's clip files this browser plays (players-data.ts). Most play the see-through WebM
// directly ("webm"). Safari, and every browser on iPhone and iPad (all WebKit underneath), plays WebM but
// draws its transparency black, so there the clips are the "stacked" MP4s (colour above, transparency
// below, put together by stacked-alpha.ts), or the stills if WebGL is missing ("still"). The server and the
// first render assume WebM; the check runs in the browser. For a check without a Mac or an iPhone, ?clips=stacked
// in the address makes any browser take the stacked MP4s (and ?clips=still the stills), as Safari does.
import { useSyncExternalStore } from "react";

export type ClipFormat = "webm" | "stacked" | "still";

const noop = () => () => {};
let cached: ClipFormat | null = null;

function clipFormat(): ClipFormat {
  if (cached) return cached;
  const forced = new URLSearchParams(location.search).get("clips");
  if (forced === "stacked" || forced === "still")
    return (cached =
      forced === "stacked" &&
      document.createElement("canvas").getContext("webgl")
        ? "stacked"
        : "still");
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
