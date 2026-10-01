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
// Reduced motion keeps them looking straight ahead. With `poster` (the clip's straight-ahead still) the
// portrait is there from the start: the WebM shows it until its first seek lands (the video's own poster),
// the stacked canvas carries it as its background until the first frame is drawn on it, so switching to a
// player whose clip is still loading shows them at once instead of an empty space. With ?perf each seek's
// time to land and the first frame's wait are noted for the readout (window.__perfVideo, perf.ts).
// Where the browser can decode it itself (WebCodecs, clip-frames.ts), a stacked clip is not seeked at all:
// each step of the turn is decoded straight onto the canvas, in a few ms instead of a seek's 70 to 190; the
// hidden <video> takes the clip only where that cannot run. The turn follows the cursor only while the
// portrait is on (or about to come on) screen, so moving the mouse elsewhere on the page decodes nothing.
import { useEffect, useRef, type RefObject } from "react";
import { stackedAlpha } from "./stacked-alpha";
import { canDecode, clipFrames, type ClipFrames } from "./clip-frames";

const REACH = 0.5;
// The turn eases after the cursor rather than jumping to it (seconds to close about two thirds of the way):
// steps between the frames it can show read as one motion, and a player whose clip has just come in turns
// from straight ahead (its still) toward the cursor instead of snapping there.
const FOLLOW_S = 0.09;
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
  poster,
}: {
  src: string;
  straight?: number;
  className?: string;
  label: string;
  videoRef?: RefObject<HTMLVideoElement | null>; // for a caller that reads its frames (PortraitSwap.tsx)
  load?: boolean; // false keeps the clip from downloading until it is wanted
  stacked?: string; // the stacked-alpha MP4 to play instead, drawn to a canvas
  frameRef?: RefObject<HTMLCanvasElement | null>; // that canvas, for a caller that reads its frames
  poster?: string; // the still shown until the clip's first frame is
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
    const decode = !!(stacked && draw && load && canDecode());
    const perf = (window as unknown as { __perfVideo?: PerfVideo }).__perfVideo;
    if (perf) perf.format = stacked ? (decode ? "decoded" : "stacked") : "webm";
    const born = performance.now();
    let asked = 0,
      reported = false;
    const landed = (ms: number) => {
      if (!perf) return;
      perf.seeks.push([performance.now(), ms]);
      if (!reported) perf.first.push([performance.now(), performance.now() - born]);
      reported = true;
    };
    const paint = (from: HTMLVideoElement | VideoFrame = video) => {
      if (!draw) return;
      draw(from);
      if (canvas) canvas.style.backgroundImage = ""; // the first frame is in: the still steps aside
    };
    const paintVideo = () => paint(video); // as a listener: its argument is the event
    const shown = canvas ?? video;
    let target = 0,
      seeking = false,
      onScreen = false,
      frames: ClipFrames | null = null;
    const duration = () => frames?.duration ?? video.duration;
    const seek = () => {
      if (frames) return frames.show(target);
      if (
        !video.duration ||
        seeking ||
        Math.abs(video.currentTime - target) < 0.001
      )
        return;
      seeking = true;
      asked = performance.now();
      video.currentTime = target;
    };
    const onSeeked = () => {
      if (asked) landed(performance.now() - asked);
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
    // the clip's time for that look, eased toward (FOLLOW_S) from where the turn is now
    let goal = straight,
      eased: number | null = null,
      easing = 0,
      lastT = 0;
    const follow = (now: number) => {
      const length = duration();
      if (!length) return void (easing = 0);
      const dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60;
      lastT = now;
      eased ??= straight; // first shown: from straight ahead, as its still stands
      eased += (goal - eased) * (1 - Math.exp(-dt / FOLLOW_S));
      if (Math.abs(goal - eased) < 0.002) eased = goal;
      target = eased * length;
      seek();
      easing = eased === goal ? 0 : requestAnimationFrame(follow);
      if (!easing) lastT = 0;
    };
    const aim = () => {
      if (!duration() || !onScreen) return;
      const d = look();
      goal = d < 0 ? straight * (1 + d) : straight + d * (1 - straight);
      if (!easing) easing = requestAnimationFrame(follow);
    };
    // the decoded frames, once the clip is in; where they cannot run, the hidden <video> takes the clip
    const gone = new AbortController();
    if (decode)
      clipFrames(stacked!, paint, landed, gone.signal)
        .catch(() => null)
        .then((f) => {
          if (gone.signal.aborted) return f?.close();
          if (!f) video.src = stacked!;
          else if (perf) perf.format = `decoded ${f.kind}`; // which decoder: sw, hw, or the browser's pick
          frames = f;
          aim();
        });
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadeddata", paintVideo);
    video.addEventListener("loadedmetadata", aim);
    if (video.readyState >= 1) aim();
    // the module listener was added first, so it has noted the pointer by the time this runs
    window.addEventListener("mousemove", aim, { passive: true });
    // on screen (or within 200px of it), the portrait follows; touch: the sway runs frame by frame meanwhile
    let raf = 0;
    const tick = () => {
      aim();
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) aim();
        if (!touch || still) return;
        if (onScreen && !raf) raf = requestAnimationFrame(tick);
        if (!onScreen) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(shown);
    return () => {
      gone.abort();
      frames?.close();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", paintVideo);
      video.removeEventListener("loadedmetadata", aim);
      window.removeEventListener("mousemove", aim);
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(easing);
    };
  }, [src, straight, ref, load, stacked, frame]);

  if (stacked)
    return (
      <>
        <video
          ref={ref}
          src={load && !canDecode() ? stacked : undefined} // decoded instead where it can be (clip-frames.ts)
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
          style={
            poster
              ? {
                  backgroundImage: `url(${poster})`,
                  backgroundSize: "100% 100%",
                }
              : undefined
          }
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
      poster={poster}
      aria-label={label}
      className={className}
    />
  );
}

// the readout's clip timings (perf.ts): when and how long each seek took to land, and each clip's wait
// from mounting to its first landed frame
export type PerfVideo = {
  seeks: [number, number][];
  first: [number, number][];
  format?: string;
};
