"use client";

// The footer's copy line picture (CopyLine.tsx), drawn on a canvas the size of the band, from a tablet up.
// It used to be the picture twice (its two halves), each clipped to its side, multiplied into the footer's
// ground with a CSS blend mode and faded round the word with a CSS mask. Any blend mode or mask on screen
// makes Chrome on a Mac put every frame together itself, which held the page at 30 fps there (perf.ts,
// ?off=fx), so the same is done here, inside the canvas, with nothing of the kind left on the page:
//   - once per picture, each pixel becomes the colour and transparency that, drawn normally over the
//     footer's ground (GROUND: the page #f9fafb under its 4% black), give what the multiply gave (white goes
//     clear, so the page's noise still shows through), worked out a slice at a time in idle moments;
//   - on every resize, the two halves are drawn where the page drew them (SPREAD, SCALE, FEET), then the
//     fade round the word (the RISE ellipse: clear to 45% of it, whole by its rim) cuts into them.
// It loads as the footer comes near; the bigger picture only where the band is drawn wider than the smaller.
import { useEffect, useRef } from "react";

const GROUND = [249, 250, 251].map((v) => (v * 0.96) / 255);
const SPREAD = { l: 0.03, r: 0.06 },
  SCALE = 0.85,
  FEET = 0.88,
  ASPECT = 1152 / 2688;
const ROWS = 48; // rows worked out per idle slice
const idle = () =>
  new Promise<void>((r) =>
    "requestIdleCallback" in window ? requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 16),
  );

// the picture made see-through, as described above
async function clearPicture(url: string, gone: () => boolean) {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(img, 0, 0);
  const data = x.getImageData(0, 0, c.width, c.height),
    px = data.data,
    [fr, fg, fb] = GROUND;
  for (let y = 0; y < c.height; y += ROWS) {
    if (gone()) return null;
    await idle();
    const end = Math.min(c.height, y + ROWS) * c.width * 4;
    for (let i = y * c.width * 4; i < end; i += 4) {
      const r = px[i] / 255,
        g = px[i + 1] / 255,
        b = px[i + 2] / 255;
      const a = 1 - Math.min(r, g, b);
      if (a <= 0) {
        px[i + 3] = 0;
        continue;
      }
      px[i] = (255 * fr * (r - 1 + a)) / a;
      px[i + 1] = (255 * fg * (g - 1 + a)) / a;
      px[i + 2] = (255 * fb * (b - 1 + a)) / a;
      px[i + 3] = 255 * a;
    }
  }
  x.putImageData(data, 0, 0);
  return c;
}

export function CopyLinePicture({ pic }: { pic: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current,
      band = canvas?.parentElement;
    if (!canvas || !band) return;
    let gone = false,
      src: HTMLCanvasElement | null = null,
      loading = false;
    const draw = () => {
      const W = band.clientWidth,
        H = band.clientHeight,
        dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!src || !W || !window.matchMedia("(min-width: 768px)").matches) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const x = canvas.getContext("2d")!;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.imageSmoothingQuality = "high";
      // the picture's box (FIT in CopyLine.tsx): the band's width at its own shape, a twentieth of its extra
      // height cropped from the top; each half pushed out by SPREAD and shrunk by SCALE toward the feet
      const h = W * ASPECT,
        top = (H - h) * 0.05,
        sw = src.width,
        sh = src.height;
      const y0 = top + FEET * h * (1 - SCALE),
        dh = h * SCALE,
        dw = (W / 2) * SCALE;
      x.drawImage(src, 0, 0, sw / 2, sh, -SPREAD.l * W, y0, dw, dh);
      x.drawImage(src, sw / 2, 0, sw / 2, sh, (1 + SPREAD.r) * W - dw, y0, dw, dh);
      // the fade round the word: an ellipse 32% x 58% of the band at its foot's middle
      const rx = 0.32 * W,
        ry = 0.58 * H;
      x.globalCompositeOperation = "destination-in";
      x.translate(W / 2, H);
      x.scale(1, ry / rx);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.45, "rgba(0,0,0,0)");
      g.addColorStop(1, "#000");
      x.fillStyle = g;
      x.fillRect(-W, (-H * 2 * rx) / ry, W * 2, (H * 4 * rx) / ry);
      x.globalCompositeOperation = "source-over";
    };
    const load = () => {
      if (loading) return;
      loading = true;
      const wide = band.clientWidth * Math.min(window.devicePixelRatio || 1, 2) > 1344 * 1.15;
      clearPicture(`/footer/${wide ? pic : pic.replace(".webp", "-1344.webp")}`, () => gone)
        .then((c) => {
          if (!c || gone) return;
          src = c;
          draw();
        })
        .catch(() => {});
    };
    const near = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "800px" });
    near.observe(band);
    const ro = new ResizeObserver(draw);
    ro.observe(band);
    return () => {
      gone = true;
      near.disconnect();
      ro.disconnect();
    };
  }, [pic]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full max-md:hidden" />;
}
