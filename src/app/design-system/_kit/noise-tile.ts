"use client";

// The accent water's grain as a background tile: 160px of grey noise at alpha 18/255 (7%), as AccentWave's
// GRAIN 0.07 reads on the homepage, drawn once on a 2D canvas and seeded so it never changes. Alpha compositing
// only, no blend. The on-blue Canvas and every frame that stands on the water (the bar over the water, the
// players, the phone carousel) lay it over #1a6dff, so all of them sit on the page's own blue.
import { useEffect, type RefObject } from "react";

let tile: string | null = null;

/** The tile as a data URL, or "" where no 2D canvas can be had (the server). */
export function noiseTile(): string {
  if (tile) return tile;
  if (typeof document === "undefined") return "";
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 160;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(160, 160);
  let seed = 7;
  for (let i = 0; i < img.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const v = seed >>> 24;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 18;
  }
  ctx.putImageData(img, 0, 0);
  tile = c.toDataURL("image/png");
  return tile;
}

/** Lays the grain tile on an element while `on`, at 160px, and takes it off again. */
export function useGrain(ref: RefObject<HTMLElement | null>, on = true) {
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const url = noiseTile();
    if (!url) return;
    el.style.backgroundImage = `url(${url})`;
    el.style.backgroundSize = "160px 160px";
    return () => {
      el.style.backgroundImage = "";
      el.style.backgroundSize = "";
    };
  }, [ref, on]);
}
