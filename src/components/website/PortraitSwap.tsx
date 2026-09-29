"use client";

// The players section's portrait (Players.tsx): the player's cursor-scrubbed turn (PlayerPortrait.tsx),
// with their AI copy's own turn stacked over it. Switching Human / AI (ModeToggle.tsx) sweeps a wide band
// up the portrait, bottom to top, shaped as a tall dome (its middle far ahead, its sides curving steeply
// down): below the dome's line the new copy, above it the old, and across it the new
// copy drawn as a halftone whose dots grow from specks at the band's edges into solid at its middle, with
// its colour channels pulled apart sideways (chromatic aberration). The band is drawn on a canvas from the
// playing video's own frames, so it turns with the cursor like the rest; a thin glowing laser runs along
// the dome's line where it crosses her, like a plane of light passing through the body. Reduced motion swaps at once.
import { useEffect, useRef } from "react";
import { PlayerPortrait } from "./PlayerPortrait";
import type { Mode } from "./ModeToggle";

type Clip = { src: string; straight: number };

const SWEEP_S = 1.5; // the band's run up the portrait, seconds
const BAND = 0.6; // the band's depth, a share of the portrait's height
const DOME = 0.35; // how far the dome's middle stands above its ends, a share of the portrait's height
const DOME_STEPS = 32; // points along the dome for the reveal's outline
const PITCH = 7; // halftone grid, video px
const CHROMA = 10; // how far the red and blue channels are pulled out to either side, video px
const CHANNELS: [string, number][] = [
  ["#ff0000", -CHROMA],
  ["#00ff00", 0],
  ["#0000ff", CHROMA],
];
const LASER_GLOW = "rgba(120, 175, 255, 0.95)"; // the laser line's glow; its core is white
const HIDDEN = "inset(100% 0 0 0)";

export function PortraitSwap({
  human,
  ai,
  mode,
  label,
  className,
}: {
  human: Clip;
  ai: Clip;
  mode: Mode;
  label: string;
  className?: string;
}) {
  const humanVideo = useRef<HTMLVideoElement>(null);
  const aiVideo = useRef<HTMLVideoElement>(null);
  const aiLayer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const layer = aiLayer.current,
      cv = canvas.current;
    if (!layer || !cv) return;
    const settle = () => {
      layer.style.clipPath = mode === "ai" ? "none" : HIDDEN;
      cv.style.opacity = "0";
    };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const incoming = (mode === "ai" ? aiVideo : humanVideo).current;
    const ctx = cv.getContext("2d");
    if (first.current || still || !incoming || !ctx) {
      first.current = false;
      return settle();
    }
    const W = incoming.videoWidth || 810,
      H = incoming.videoHeight || 1080;
    cv.width = W;
    cv.height = H;
    // one colour channel at a time is built here, then added onto the band
    const work = document.createElement("canvas");
    work.width = W;
    work.height = H;
    const wx = work.getContext("2d");
    if (!wx) return settle();
    const band = BAND * H,
      rise = DOME * H;
    // the dome's drop below its middle at x: an ellipse, flat on top and steep at the sides
    const drop = (x: number) => {
      const u = Math.min(1, Math.abs((2 * x) / W - 1));
      return rise * (1 - Math.sqrt(1 - u * u));
    };
    const cols: number[] = [];
    for (let gx = PITCH / 2; gx < W; gx += PITCH) cols.push(gx);
    const colDrop = cols.map(drop);

    // `mid` is the top of the dome, its middle; the band runs band / 2 either side of the dome's line
    const draw = (mid: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      const top = Math.max(0, Math.floor(mid - band / 2)),
        h = Math.min(H, Math.ceil(mid + rise + band / 2)) - top;
      if (h <= 0) return;
      // the new copy's frame, channel by channel, each shifted sideways, added back together
      ctx.globalCompositeOperation = "lighter";
      for (const [colour, dx] of CHANNELS) {
        wx.globalCompositeOperation = "copy";
        wx.drawImage(incoming, 0, top, W, h, dx, top, W, h);
        wx.globalCompositeOperation = "multiply";
        wx.fillStyle = colour;
        wx.fillRect(0, top, W, h);
        wx.globalCompositeOperation = "destination-in"; // back to the character's own outline
        wx.drawImage(incoming, 0, top, W, h, dx, top, W, h);
        ctx.drawImage(work, 0, top, W, h, 0, top, W, h);
      }
      // kept only inside the halftone: dots from specks at the band's edges to solid on the dome's line
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#000";
      ctx.beginPath();
      for (
        let gy = Math.floor(top / PITCH) * PITCH + PITCH / 2;
        gy < top + h;
        gy += PITCH
      ) {
        cols.forEach((gx, i) => {
          const s = 1 - Math.abs(gy - mid - colDrop[i]) / (band / 2);
          if (s <= 0) return;
          const r = PITCH * 0.72 * s ** 1.3;
          if (r < 0.3) return;
          ctx.moveTo(gx + r, gy);
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
        });
      }
      ctx.fill();
      // the laser: a thin glowing line along the dome's line, only where it passes through her, so it
      // reads as a plane of light cutting across the body
      wx.globalCompositeOperation = "source-over";
      wx.clearRect(0, top, W, h);
      wx.save();
      wx.shadowColor = LASER_GLOW;
      wx.shadowBlur = 16;
      wx.strokeStyle = "#ffffff";
      wx.lineWidth = 3;
      wx.beginPath();
      for (let x = 0; x <= W; x += 6)
        if (x === 0) wx.moveTo(x, mid + drop(x));
        else wx.lineTo(x, mid + drop(x));
      wx.stroke();
      wx.restore();
      wx.globalCompositeOperation = "destination-in";
      wx.drawImage(incoming, 0, top, W, h, 0, top, W, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(work, 0, top, W, h, 0, top, W, h);
    };
    // the dome's line as clip-path points, left to right, in % of the portrait
    const line = (mid: number) =>
      Array.from({ length: DOME_STEPS + 1 }, (_, i) => {
        const x = (i / DOME_STEPS) * W;
        return `${(i / DOME_STEPS) * 100}% ${((mid + drop(x)) / H) * 100}%`;
      });

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const k = Math.min(1, (now - t0) / (SWEEP_S * 1000));
      const e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
      // the dome's top, from the whole band just below the portrait to the whole band just above it
      const mid = H + band / 2 - e * (H + band + rise);
      const pts = line(mid);
      // the AI copy shows below the dome's line on the way to AI, above it on the way back
      layer.style.clipPath =
        mode === "ai"
          ? `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`
          : `polygon(0% 0%, 100% 0%, ${pts.reverse().join(", ")})`;
      draw(mid);
      if (k < 1) raf = requestAnimationFrame(frame);
      else settle();
    };
    cv.style.opacity = "1";
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <div className="relative">
      <PlayerPortrait
        src={human.src}
        straight={human.straight}
        label={label}
        className={className}
        videoRef={humanVideo}
      />
      <div
        ref={aiLayer}
        className="absolute inset-0"
        style={{ clipPath: HIDDEN }}
      >
        <PlayerPortrait
          src={ai.src}
          straight={ai.straight}
          label={`${label}, AI copy`}
          className="h-full w-full"
          videoRef={aiVideo}
        />
      </div>
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
