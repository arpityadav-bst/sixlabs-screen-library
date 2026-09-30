"use client";

// A player's portrait as a video the cursor scrubs: the clip runs from the player looking to the left to
// looking to the right, through looking straight ahead at `straight` (a share of the clip). The pointer's
// place across the screen, measured from the portrait itself, picks the moment: over the portrait they
// look straight ahead, and the turn is complete REACH of the way from the portrait to either edge of the
// window (halfway), holding there beyond. The pointer is followed from page load (pointerX), so a
// portrait that appears later already faces the cursor. One seek runs at a time and the next is queued
// when it lands (onSeeked, after the Mainframe hero prompt), so seeks never flood. Before the pointer has
// moved at all they look straight ahead. Never autoplays. With `stacked` (Safari and iPhones, where a
// WebM's transparency shows black) the clip is the stacked-alpha MP4, playing unseen, and each frame it
// lands on is put together on a canvas (stacked-alpha.ts), which is what shows. A touch screen has no
// cursor to follow: there, while the portrait is on screen, the player looks slowly from side to side by
// themselves (SWAY of the turn each way, a full look left and right every SWAY_S seconds, eased at the
// ends like a head turning), on one clock for every portrait so a player and their AI copy move as one.
// Reduced motion keeps them looking straight ahead.
import { useEffect, useRef, type RefObject } from "react";
import { stackedAlpha } from "./stacked-alpha";

const REACH = 0.5;
const SWAY = 0.85;
const SWAY_S = 9;
const T0 = typeof performance !== "undefined" ? performance.now() : 0;
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
  load = true,
  stacked,
  frameRef,
}: {
  src: string;
  straight?: number;
  className?: string;
  label: string;
  videoRef?: RefObject<HTMLVideoElement | null>; // for a caller that reads its frames (PortraitSwap.tsx)
  load?: boolean; // false keeps the clip from downloading until it is wanted
  stacked?: string; // the stacked-alpha MP4 to play instead, drawn to a canvas
  frameRef?: RefObject<HTMLCanvasElement | null>; // that canvas, for a caller that reads its frames
}) {
  const own = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? own;
  const ownFrame = useRef<HTMLCanvasElement>(null);
  const frame = frameRef ?? ownFrame;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // stacked: what shows is the canvas, drawn from each frame the hidden clip lands on
    const canvas = stacked ? frame.current : null;
    const draw = canvas ? stackedAlpha(canvas) : null;
    const paint = () => draw?.(video);
    const shown = canvas ?? video;
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
      paint();
      seeking = false;
      seek(); // the target may have moved while that seek ran
    };
    const touch = window.matchMedia("(hover: none)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // -1 (fully turned left) .. 0 (straight ahead) .. 1 (fully turned right): on a touch screen the sway,
    // otherwise where the pointer is, each side of the portrait covering its side of the turn
    const look = () => {
      if (touch)
        return still
          ? 0
          : SWAY *
              Math.sin(
                ((performance.now() - T0) / 1000) * ((2 * Math.PI) / SWAY_S),
              );
      const r = shown.getBoundingClientRect(),
        cx = r.left + r.width / 2;
      return pointerX === null
        ? 0
        : pointerX < cx
          ? Math.max(-1, (pointerX - cx) / (cx * REACH))
          : Math.min(1, (pointerX - cx) / ((window.innerWidth - cx) * REACH));
    };
    // the clip's time for that look
    const aim = () => {
      if (!video.duration) return;
      const d = look();
      const share = d < 0 ? straight * (1 + d) : straight + d * (1 - straight);
      target = share * video.duration;
      seek();
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", paint);
    video.addEventListener("loadedmetadata", aim);
    if (video.readyState >= 1) aim();
    // the module listener was added first, so it has noted the pointer by the time this runs
    window.addEventListener("mousemove", aim, { passive: true });
    // touch: the sway runs frame by frame while the portrait is on screen
    let raf = 0;
    const tick = () => {
      aim();
      raf = requestAnimationFrame(tick);
    };
    const io =
      touch && !still
        ? new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !raf) raf = requestAnimationFrame(tick);
            if (!e.isIntersecting) {
              cancelAnimationFrame(raf);
              raf = 0;
            }
          })
        : null;
    io?.observe(shown);
    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", paint);
      video.removeEventListener("loadedmetadata", aim);
      window.removeEventListener("mousemove", aim);
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [src, straight, ref, load, stacked, frame]);

  if (stacked)
    return (
      <>
        <video
          ref={ref}
          src={load ? stacked : undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
        />
        <canvas
          ref={frame}
          width={810}
          height={1080}
          role="img"
          aria-label={label}
          className={className}
        />
      </>
    );
  return (
    <video
      ref={ref}
      src={load ? src : undefined}
      muted
      playsInline
      preload="auto"
      aria-label={label}
      className={className}
    />
  );
}
