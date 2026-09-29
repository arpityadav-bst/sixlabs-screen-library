"use client";

// Mounts the SixLabs glass tile floor (src/tiles) into its own box. The engine is loaded on the client
// only, fills whatever size this element has, and is torn down on unmount. The box stays hidden while the
// engine warms up, then fades in and rises a few pixels once the floor is ready.
import { useEffect, useRef, useState } from "react";

export function TileFloor({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let handle: { dispose(): void } | undefined;
    import("@/tiles/floor.js").then(({ createFloor }) =>
      createFloor(ref.current, { base: "/tiles" }).then((h: { dispose(): void }) => {
        if (alive) {
          handle = h;
          setReady(true);
        } else h.dispose();
      }),
    );
    return () => {
      alive = false;
      handle?.dispose();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (ready ? "opacity-100 translate-y-0 " : "opacity-0 translate-y-2.5 ") +
        (className ?? "")
      }
    />
  );
}
