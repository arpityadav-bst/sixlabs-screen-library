"use client";

// Which of a player's clip files this browser plays (players-data.ts). Most play the see-through WebM
// directly ("webm"). Safari, and every browser on iPhone and iPad (all WebKit underneath), plays WebM but
// draws its transparency black, so there the clips are the "stacked" MP4s (colour above, transparency
// below, put together by swap-gl.ts), or the stills if WebGL is missing ("still"). The server and the
// first render assume WebM; the check runs in the browser. Where the browser decodes the clips itself
// (WebCodecs with an H.264 decoder, clip-frames.ts), every browser takes the stacked MP4s, Chrome too: their
// frames go straight onto a canvas with no seeking, which is what made the turn step on a slow machine. That
// check answers a moment after load, well before the players are near; until then the rest stay on WebM.
// For a check without a Mac or an iPhone, ?clips=stacked in the address makes any browser take the stacked
// MP4s (and ?clips=still the stills), as Safari does; ?clips=webm keeps the WebMs wherever they play.
import { useSyncExternalStore } from "react";
import { canDecode } from "./clip-frames";

export type ClipFormat = "webm" | "stacked" | "still";

let cached: ClipFormat | null = null;
// whether this browser decodes the stacked clips itself (null: not asked yet), and who to tell when it does
let decodes: boolean | null = null;
const heard = new Set<() => void>();
function subscribe(changed: () => void) {
  heard.add(changed);
  if (decodes === null && canDecode()) {
    decodes = false;
    VideoDecoder.isConfigSupported({ codec: "avc1.640032", codedWidth: 810, codedHeight: 2160 }) // the clips' own (mp4-samples.ts)
      .then((r) => {
        if (!r.supported) return;
        decodes = true;
        cached = null;
        heard.forEach((f) => f());
      })
      .catch(() => {});
  }
  return () => {
    heard.delete(changed);
  };
}

function clipFormat(): ClipFormat {
  if (cached) return cached;
  const forced = new URLSearchParams(location.search).get("clips");
  if (forced === "webm") return (cached = "webm");
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
  if (!(apple || safari) && !decodes) return (cached = "webm");
  const gl = document.createElement("canvas").getContext("webgl");
  if (!(apple || safari)) return (cached = gl ? "stacked" : "webm");
  return (cached = gl ? "stacked" : "still");
}

export function useClipFormat() {
  return useSyncExternalStore(subscribe, clipFormat, () => "webm" as ClipFormat);
}
