"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount.
import { useEffect, useRef } from "react";

export function TileFloor({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let handle: { dispose(): void } | undefined;
    import("@/tiles/floor.js").then(({ createFloor }) =>
      createFloor(ref.current, { base: "/tiles" }).then((h: { dispose(): void }) => {
        if (alive) handle = h;
        else h.dispose();
      }),
    );
    return () => {
      alive = false;
      handle?.dispose();
    };
  }, []);

  return <div ref={ref} className={className} />;
}
