"use client";

// Whether this browser shows the players' see-through clips (VP9 WebM with alpha). Safari, and every
// browser on iPhone and iPad (all WebKit underneath), plays the clips but draws their transparent parts
// black, so there the players section shows each copy's still instead (players-data.ts `still`). The
// server and the first render assume the clips; the check runs in the browser.
import { useSyncExternalStore } from "react";

const noop = () => () => {};

function clipsShowAlpha() {
  const ua = navigator.userAgent;
  const apple =
    /iP(hone|ad|od)/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports a Mac
  const safari = /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\//.test(ua);
  return !(apple || safari);
}

export function useAlphaVideo() {
  return useSyncExternalStore(noop, clipsShowAlpha, () => true);
}
