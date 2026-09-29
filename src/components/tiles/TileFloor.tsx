"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. onReady fires the moment the
// tiles start fading in.
import { useEffect, useRef } from "react";

export function TileFloor({ className, onReady }: { className?: string; onReady?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let handle: { dispose(): void } | undefined;
    import("@/tiles/floor.js").then(({ createFloor }) =>
      createFloor(ref.current, { base: "/tiles" }).then((h: { dispose(): void }) => {
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
