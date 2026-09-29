"use client";

// A player's portrait as a video the cursor scrubs: the clip runs from the player looking to the left to
// looking to the right, through looking straight ahead at `straight` (a share of the clip). The pointer's
// place across the screen, measured from the portrait itself, picks the moment: over the portrait they
// look straight ahead, and the turn is complete REACH of the way from the portrait to either edge of the
// window (halfway), holding there beyond. The pointer is followed from page load (pointerX), so a
// portrait that appears later already faces the cursor. One seek runs at a time and the next is queued
// when it lands (onSeeked, after the Mainframe hero prompt), so seeks never flood. Before the pointer has
// moved at all they look straight ahead. Never autoplays.
import { useEffect, useRef, type RefObject } from "react";

const REACH = 0.5;
// the pointer's last x in the window, px (null until it first moves)
let pointerX: number | null = null;
if (typeof window !== "undefined")
  window.addEventListener(
    "mousemove",
    (e) => {
      pointerX = e.clientX;
    },
    { passive: true },
  );

export function PlayerPortrait({
  src,
  straight = 0.5,
  className,
  label,
  videoRef,
}: {
  src: string;
  straight?: number;
  className?: string;
  label: string;
  videoRef?: RefObject<HTMLVideoElement | null>; // for a caller that reads its frames (PortraitSwap.tsx)
}) {
  const own = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? own;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let target = 0,
      seeking = false;
    const seek = () => {
      if (
        !video.duration ||
        seeking ||
        Math.abs(video.currentTime - target) < 0.001
      )
        return;
      seeking = true;
      video.currentTime = target;
    };
    const onSeeked = () => {
      seeking = false;
      seek(); // the target may have moved while that seek ran
    };
    // the clip's time for where the pointer is; each side of the portrait covers its side of the turn
    const aim = () => {
      if (!video.duration) return;
      // -1 (fully turned left) .. 0 (straight ahead, over the portrait) .. 1 (fully turned right)
      const r = video.getBoundingClientRect(),
        cx = r.left + r.width / 2;
      const d =
        pointerX === null
          ? 0
          : pointerX < cx
            ? Math.max(-1, (pointerX - cx) / (cx * REACH))
            : Math.min(1, (pointerX - cx) / ((window.innerWidth - cx) * REACH));
      const share = d < 0 ? straight * (1 + d) : straight + d * (1 - straight);
      target = share * video.duration;
      seek();
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", aim);
    if (video.readyState >= 1) aim();
    // the module listener was added first, so it has noted the pointer by the time this runs
    window.addEventListener("mousemove", aim, { passive: true });
    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", aim);
      window.removeEventListener("mousemove", aim);
    };
  }, [src, straight, ref]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      aria-label={label}
      className={className}
    />
  );
}
