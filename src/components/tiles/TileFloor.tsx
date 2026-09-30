"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. onReady fires once the floor
// is ready; the tiles then wait introDelay seconds before fading in (so a loader can leave first).
// onConvert fires each time a character on the floor becomes their AI copy. distScale and mixWaves pass to
// the engine (floor.js): the camera pulled back for smaller, more tiles; the second wave's cast in the middle.
// aiBase is where the AI copies' pictures are read from (chars-ai/ under it), the humans staying in /tiles;
// spentTint, the colour a used tile rests in (floor-params.json's own otherwise).
import { useEffect, useRef } from "react";

export type FloorHandle = {
  dispose(): void;
  reset(): void;
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
    let alive = true;
    let handle: FloorHandle | undefined;
    import("@/tiles/floor.js").then(({ createFloor }) =>
      createFloor(ref.current, {
        base: "/tiles",
        aiBase: aiBase ?? "/tiles",
        spentTint,
        introDelay,
        distScale,
        mixWaves,
        onConvert: () => convert.current?.(),
      }).then((h: FloorHandle) => {
        if (alive) {
          handle = h;
          onReady?.(h);
        } else h.dispose();
      }),
    );
    return () => {
      alive = false;
      handle?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the floor mounts once; onReady is read when it resolves
  }, []);

  return <div ref={ref} className={className} />;
}
