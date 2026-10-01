"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. onReady fires once the floor
// is ready; the tiles then wait introDelay seconds before fading in (so a loader can leave first).
// onConvert fires each time a character on the floor becomes their AI copy. distScale and mixWaves pass to
// the engine (floor.js): the camera pulled back for smaller, more tiles; the second wave's cast in the middle.
// aiBase is where the AI copies' pictures are read from (chars-ai/ under it), the humans staying in /tiles;
// spentTint, the colour a used tile rests in (floor-params.json's own otherwise). On a phone (below md) the
// tiles' pictures are the 512px copies (tiles/512/, tiles-holo/512/): the tiles are small there, and they
// look the same at a little over half the download.
// Two screens past it, the floor is let go entirely (floor.js dispose): its drawing buffers, its pictures and
// its hold on the faster GPU (a two-GPU Mac keeps its Radeon powered, and warm, while any page holds it). It
// is built again, its tiles already in place (no load-in), once the visitor is back within a screen of it, or
// the moment a glide to the top starts (wakeFloor: the back-to-top button, an in-page link to the top), so it
// is drawing before it is in view. onReady fires once, with a handle that reaches whichever floor is built.
import { useEffect, useRef } from "react";

const wakers = new Set<() => void>();
export const wakeFloor = () => wakers.forEach((w) => w());

export type FloorHandle = {
  dispose(): void;
  reset(): Promise<void> | void; // resolves as the wave begins (it may wait for the next cast, autoplay.js)
  setClearTop(px: number): void; // lowers the view so the field's top tile sits px down (floor.js)
};

export function TileFloor({
  className,
  onReady,
  onConvert,
  introDelay = 0,
  distScale = 1,
  mixWaves = false,
  aiBase,
  spentTint,
}: {
  className?: string;
  onReady?: (floor: FloorHandle) => void;
  onConvert?: () => void;
  introDelay?: number;
  distScale?: number;
  mixWaves?: boolean;
  aiBase?: string;
  spentTint?: string;
}) {
  const convert = useRef(onConvert);
  useEffect(() => {
    convert.current = onConvert;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    let alive = true,
      wanted = false, // near enough to be built
      building = false,
      builds = 0,
      floor: FloorHandle | undefined,
      clearTop = 0;
    const release = () => {
      wanted = false;
      floor?.dispose();
      floor = undefined;
    };
    const handle: FloorHandle = {
      dispose: release,
      reset: () => floor?.reset(),
      setClearTop: (px) => {
        clearTop = px;
        floor?.setClearTop(px);
      },
    };
    const build = () => {
      wanted = true;
      if (floor || building || !alive) return;
      building = true;
      const again = builds++ > 0;
      import("@/tiles/floor.js")
        .then(({ createFloor }) =>
          createFloor(box, {
            base: "/tiles",
            aiBase: aiBase ?? "/tiles",
            res: window.matchMedia("(max-width: 767px)").matches ? 512 : 768,
            spentTint,
            introDelay: again ? 0 : introDelay,
            introSeconds: again ? 0 : undefined,
            distScale,
            mixWaves,
            onConvert: () => convert.current?.(),
          }),
        )
        .then((f: FloorHandle) => {
          building = false;
          if (!alive || !wanted) return f.dispose();
          floor = f;
          if (clearTop) f.setClearTop(clearTop);
          if (!again) onReady?.(handle);
        })
        .catch(() => (building = false));
    };
    const near = new IntersectionObserver(([e]) => e.isIntersecting && build(), { rootMargin: "100% 0px" });
    const far = new IntersectionObserver(([e]) => !e.isIntersecting && release(), { rootMargin: "200% 0px" });
    near.observe(box);
    far.observe(box);
    wakers.add(build);
    return () => {
      alive = false;
      near.disconnect();
      far.disconnect();
      wakers.delete(build);
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the floor's options are read as it is built; onReady once
  }, []);

  return <div ref={ref} className={className} />;
}
