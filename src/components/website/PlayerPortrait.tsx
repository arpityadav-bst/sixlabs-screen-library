"use client";

// A player's portrait as a video the cursor scrubs: the clip runs from the player looking to the left to
// looking to the right, so moving the mouse right turns them right and moving it left turns them back.
// Mouse-scrub mechanics after the Mainframe hero prompt: the horizontal change in the pointer, as a share
// of the window width, times SENSITIVITY, times the clip's length, moves the target time (clamped to the
// clip); one seek runs at a time and the next is queued when it lands (onSeeked), so seeks never flood.
// It starts in the middle, looking ahead. Never autoplays.
import { useEffect, useRef } from "react";

const SENSITIVITY = 0.8;

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
    let prevX: number | null = null,
      target = 0,
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
      if (prevX === null) prevX = e.clientX;
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      if (!video.duration) return;
      target = Math.min(
        video.duration,
        Math.max(
          0,
          target + (delta / window.innerWidth) * SENSITIVITY * video.duration,
        ),
      );
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
