"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. onReady fires once the floor
// is ready; the tiles then wait introDelay seconds before fading in (so a loader can leave first).
// onConvert fires each time a character on the floor becomes their AI copy. distScale and mixWaves pass to
// the engine (floor.js): the camera pulled back for smaller, more tiles; the second wave's cast in the middle.
import { useEffect, useRef } from "react";

export type FloorHandle = { dispose(): void; reset(): void };

export function TileFloor({
  className,
  onReady,
  onConvert,
  introDelay = 0,
  distScale = 1,
  mixWaves = false,
}: {
  className?: string;
  onReady?: (floor: FloorHandle) => void;
  onConvert?: () => void;
  introDelay?: number;
  distScale?: number;
  mixWaves?: boolean;
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
