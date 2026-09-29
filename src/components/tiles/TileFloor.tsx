"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. onReady fires once the floor
// is ready; the tiles then wait introDelay seconds before fading in (so a loader can leave first).
import { useEffect, useRef } from "react";

export function TileFloor({ className, onReady, introDelay = 0 }: { className?: string; onReady?: () => void; introDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let handle: { dispose(): void } | undefined;
    import("@/tiles/floor.js").then(({ createFloor }) =>
      createFloor(ref.current, { base: "/tiles", introDelay }).then((h: { dispose(): void }) => {
        if (alive) {
          handle = h;
          onReady?.();
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
