"use client";

// A frame part or a real route in an iframe at a true CSS width, scaled into the panel by transform
// alone (scale from the top left), so the frame's own media queries, scroll and window events are the
// ones the site answers to. The box keeps the frame's aspect ratio before any script runs, so nothing
// jumps when the scale is measured. It mounts through HeavySlot (one frame plus the target's declared
// cost) and is same-origin, so an Anatomy around it can pin parts inside the frame. A preview is a picture
// by default: out of the Tab order, its body inert, so a keyboard reader never lands in a scaled-down page.
// The full view's frames hold the wheel while their floor loads, so those take the pointer only once loading
// has ended, and the guide keeps scrolling under the reader's pointer meanwhile.
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { HERO_LOADED } from "@/components/website/hero-intro";
import { frameHref, type PartId } from "../frame/_parts/ids";
import type { HeavyCost } from "./gl-budget";
import { HeavySlot } from "./HeavySlot";
import { KitSeg } from "./KitSeg";

export const VIEWPORT_WIDTHS = [375, 768, 1024, 1280, 1440, 1920] as const;

/** The full view's own give-up (hero-intro.ts GIVE_UP), after which its page no longer holds the wheel. */
const HOLD_MS = 12_000;

export type Crop = { x: number; y: number; width: number; height: number };

export type ViewportPreviewProps = {
  /** a frame part (resolved to /design-system/frame/<part>) */
  part?: PartId;
  /** or any same-origin route, "/website" */
  src?: string;
  /** the iframe's accessible name */
  title: string;
  /** the true CSS height of the frame's viewport */
  height: number;
  /** a different height at some widths, { 375: 720 } */
  heights?: Partial<Record<number, number>>;
  /** the widths on the switcher. One width hides the switcher. */
  widths?: readonly number[];
  /** the width it opens at (1280 when listed, else the first) */
  width?: number;
  /** after load (and on each width change) scroll the frame to this y, or to this selector's top */
  scrollTo?: number | string;
  /** fit the height to the frame's scrollHeight after load, and again whenever its content resizes (for
   *  content without vh heights) */
  fitHeight?: boolean;
  /** show only this window of the frame, in its own CSS px */
  crop?: Crop;
  /** what the target costs beyond the frame itself, { gl: 5 } or { floor: true, gl: 5 } */
  cost?: HeavyCost;
  /** a still for the waiting card */
  poster?: string;
  /** a preview meant to be operated (hovered, pressed, Tabbed through). Off by default: the frame is out of
   *  the Tab order and its body is inert */
  interactive?: boolean;
  /** keep the pointer off the frame until its page sends HERO_LOADED (12s at most), because the full view
   *  cancels the wheel while it loads. On by default for the hero-full part and /6labs-fullview */
  gateInput?: boolean;
  onLoad?: (frame: HTMLIFrameElement) => void;
};

function scrollFrame(f: HTMLIFrameElement, to: number | string) {
  try {
    const win = f.contentWindow;
    const doc = f.contentDocument;
    if (!win || !doc) return;
    if (typeof to === "number") return win.scrollTo(0, to);
    const el = doc.querySelector(to);
    if (el) win.scrollTo(0, el.getBoundingClientRect().top + win.scrollY);
  } catch {
    // a cross-origin route cannot be scrolled from here
  }
}

export function ViewportPreview({
  part,
  src,
  title,
  height,
  heights,
  widths = VIEWPORT_WIDTHS,
  width,
  scrollTo,
  fitHeight,
  crop,
  cost,
  poster,
  interactive = false,
  gateInput,
  onLoad,
}: ViewportPreviewProps) {
  const href = src ?? (part ? frameHref(part) : "about:blank");
  const gated = gateInput ?? (part === "hero-full" || !!src?.startsWith("/6labs-fullview"));
  const [w, setW] = useState(() => width ?? (widths.includes(1280) ? 1280 : widths[0]));
  const [fitted, setFitted] = useState<Record<number, number>>({});
  const [boxW, setBoxW] = useState(0);
  const [held, setHeld] = useState(gated);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement | null>(null);
  const watch = useRef<(() => void) | null>(null);

  const h = fitted[w] ?? heights?.[w] ?? height;
  const vw = crop?.width ?? w;
  const vh = crop?.height ?? h;
  const scale = boxW ? Math.min(1, boxW / vw) : 1;
  const latest = useRef({ w, h, fitHeight, scrollTo });
  useEffect(() => {
    latest.current = { w, h, fitHeight, scrollTo };
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the frame's own watchers (its content's size, its loading signal) end with the frame: on unmount, and
  // when HeavySlot releases it
  const setFrame = useCallback((el: HTMLIFrameElement | null) => {
    frame.current = el;
    if (!el) {
      watch.current?.();
      watch.current = null;
    }
  }, []);

  function fit(f: HTMLIFrameElement) {
    const { w: cw, h: ch, fitHeight: on } = latest.current;
    if (!on) return;
    try {
      const sh = f.contentDocument?.documentElement.scrollHeight;
      if (sh && sh !== ch) setFitted((m) => (m[cw] === sh ? m : { ...m, [cw]: sh }));
    } catch {
      // cross-origin: keep the given height
    }
  }

  function settle(f: HTMLIFrameElement) {
    fit(f);
    const to = latest.current.scrollTo;
    if (to !== undefined) scrollFrame(f, to);
  }

  // a width change re-applies the scroll and the fitted height once the frame has reflowed
  useEffect(() => {
    const f = frame.current;
    if (!f || (scrollTo === undefined && !fitHeight)) return;
    const id = requestAnimationFrame(() => settle(f));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- settle reads the latest props itself
  }, [w]);

  /** On each load: the frame goes inert unless operable, its content is watched for late size changes (a font
   *  swap, an entrance, a part opening after hydration), and a gated frame waits for its page's signal. */
  function arm(f: HTMLIFrameElement) {
    watch.current?.();
    const stops: (() => void)[] = [];
    try {
      const doc = f.contentDocument;
      const win = f.contentWindow;
      if (doc && win && win.location.href !== "about:blank") {
        if (!interactive) doc.body?.setAttribute("inert", "");
        if (fitHeight) {
          let raf = 0;
          const ro = new ResizeObserver(() => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => fit(f));
          });
          ro.observe(doc.documentElement);
          stops.push(() => {
            cancelAnimationFrame(raf);
            ro.disconnect();
          });
        }
        if (gated) {
          const open = () => setHeld(false);
          win.addEventListener(HERO_LOADED, open);
          const t = window.setTimeout(open, HOLD_MS);
          stops.push(() => {
            window.clearTimeout(t);
            win.removeEventListener(HERO_LOADED, open);
          });
        }
      }
    } catch {
      // a cross-origin route keeps its own document
    }
    watch.current = () => stops.forEach((s) => s());
  }

  const frameStyle: CSSProperties = {
    width: w,
    height: h,
    transform: `translate(${-(crop?.x ?? 0) * scale}px, ${-(crop?.y ?? 0) * scale}px) scale(${scale})`,
    pointerEvents: gated && held ? "none" : undefined,
  };

  return (
    <figure className="ds-vp">
      <div className="ds-vp-bar">
        {widths.length > 1 && (
          <KitSeg
            label="Viewport width"
            options={widths.map((v) => ({ value: v, label: String(v) }))}
            value={w}
            onChange={setW}
          />
        )}
        <figcaption className="ds-label">
          {w} × {h} · scale {scale.toFixed(2)}
          {crop && ` · crop ${crop.width} × ${crop.height} at ${crop.x}, ${crop.y}`}
          {gated && held && " · scrolls once loaded"}
        </figcaption>
      </div>
      <div ref={box} className="ds-vp-box" style={{ aspectRatio: `${vw} / ${vh}`, maxWidth: vw }}>
        <HeavySlot cost={{ ...cost, frames: (cost?.frames ?? 0) + 1 }} label={title} poster={poster} fill>
          <iframe
            ref={setFrame}
            className="ds-vp-frame"
            src={href}
            title={title}
            tabIndex={interactive ? undefined : -1}
            style={frameStyle}
            onLoad={(e) => {
              const f = e.currentTarget;
              if (gated) setHeld(true);
              arm(f);
              settle(f);
              onLoad?.(f);
            }}
          />
        </HeavySlot>
      </div>
    </figure>
  );
}
