"use client";

// The hero's entrance (Hero.tsx), timed from the moment the tile floor is ready; the floor then holds its
// tiles for its introDelay before they rise in over 0.9s.
// full (the full view): while it loads there is only the loader on the hero's grey, and the page holds still;
// then the loader fades, the copy (title, line, numbers, call to action) comes in, then the floor and its
// tiles, then the header, very smoothly (Header.tsx, intro), then the scroll cue and the wave button.
// Otherwise (the container): the same as before, except the scroll cue and the wave button come in last,
// once the tiles are in.
import { useEffect, useState } from "react";
import { getLenis } from "./SmoothScroll";

export const FULL_TILES_AT = 1; // s after ready: the full view's tiles start rising (its floor's introDelay)
const FULL = { copy: 0.35, floor: 0.85, header: 1.9, extras: 2.6 }; // s after ready
const BOX_EXTRAS = 1.8; // the container's introDelay (0.5s) and rise (0.9s), then a breath
const GIVE_UP = 12; // s: a floor that never comes (no WebGL) does not keep the page behind the loader

// tells the header (Header.tsx, intro) its turn has come; the flag covers a header that mounts later
export const HEADER_IN = "heroheader";
const showHeader = () => {
  document.documentElement.dataset.heroHeader = "in";
  window.dispatchEvent(new Event(HEADER_IN));
};

export function useHeroIntro(full: boolean, ready: boolean) {
  const [on, setOn] = useState({ copy: false, floor: false, extras: false });
  const [late, setLate] = useState(false);
  const go = ready || late;

  useEffect(() => {
    if (!full) return;
    const id = window.setTimeout(() => setLate(true), GIVE_UP * 1000);
    return () => window.clearTimeout(id);
  }, [full]);

  // the page holds still at its top while the full view loads
  useEffect(() => {
    if (!full || go) return;
    const html = document.documentElement,
      prev = html.style.overflow,
      lenis = getLenis();
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      html.style.overflow = prev;
      lenis?.start();
    };
  }, [full, go]);

  useEffect(() => {
    if (!go) return;
    const at = (s: number, f: () => void) => window.setTimeout(f, s * 1000);
    const set = (k: keyof typeof on) => () =>
      setOn((v) => ({ ...v, [k]: true }));
    const ids = full
      ? [
          at(FULL.copy, set("copy")),
          at(FULL.floor, set("floor")),
          at(FULL.header, showHeader),
          at(FULL.extras, set("extras")),
        ]
      : [at(BOX_EXTRAS, set("extras"))];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [go, full]);

  return {
    loading: full && !go,
    copy: !full || on.copy,
    floor: !full || on.floor,
    extras: on.extras,
  };
}
