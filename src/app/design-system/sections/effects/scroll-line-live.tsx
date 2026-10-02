"use client";

// The client leaves of the scroll line section. The word fill's rules, printed from ScrubLine's own exports:
// ScrubLine is a client module, so its numbers are only real on the client side of the boundary, and this
// leaf is where they are read. And the floating tiles' stage, which mounts the real FloatingBadges only while
// it is near the view, because the part's cursor drift listens on the window with no gate of its own.
import { useEffect, useRef, useState } from "react";
import { FloatingBadges } from "@/components/website/FloatingBadges";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { SCRUB_FILL_ROWS } from "./scrub-exports";
import s from "./fx-live.module.css";

export function ScrubRules() {
  return <KeyRows label="Word fill rules" rows={SCRUB_FILL_ROWS} />;
}

/** The stage at its height, holding FloatingBadges from half a viewport away and letting it go past one and
 *  a half, as HeavySlot does, so its window listener and its flips go with it. */
export function TilesStage({ height }: { height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const last = (es: IntersectionObserverEntry[]) => es[es.length - 1]?.isIntersecting;
    const close = new IntersectionObserver((es) => {
      if (last(es)) setNear(true);
    }, { rootMargin: "50% 0px" });
    const far = new IntersectionObserver((es) => {
      if (last(es) === false) setNear(false);
    }, { rootMargin: "150% 0px" });
    close.observe(el);
    far.observe(el);
    return () => {
      close.disconnect();
      far.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-ds="tiles-stage" className={s["ds-tiles-stage"]} style={{ height }}>
      {near && <FloatingBadges />}
    </div>
  );
}
