"use client";

// A player's portrait as a video the cursor scrubs: the clip runs from the player looking to the left to
// looking to the right, through looking straight ahead at its midpoint. Where the pointer is across the
// window picks the moment: the left edge is the first frame, the middle is straight ahead, the right edge
// is the last. One seek runs at a time and the next is queued when it lands (onSeeked, after the
// Mainframe hero prompt), so seeks never flood. It starts in the middle. Never autoplays.
import { useEffect, useRef } from "react";

export function PlayerPortrait({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

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
    const onReady = () => {
      target = video.duration / 2;
      seek();
    };
    const onMove = (e: MouseEvent) => {
      if (!video.duration) return;
      target =
        Math.min(1, Math.max(0, e.clientX / window.innerWidth)) *
        video.duration;
      seek();
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onReady);
    if (video.readyState >= 1) onReady();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onReady);
      window.removeEventListener("mousemove", onMove);
    };
  }, [src]);

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
