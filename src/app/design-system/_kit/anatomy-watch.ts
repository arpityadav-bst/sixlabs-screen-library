"use client";

// Anatomy's watching, apart from its drawing. It measures again on resize, on DOM changes, on frame load and
// scroll, when fonts land, and when a part moves without changing the DOM's shape: a style or class write
// (motion's entrances write transform every frame, so those are read at most every 120ms and once more when
// they stop) and the end of a CSS animation or transition. All of it is connected only while the stage is
// within half a viewport of the screen, so a specimen far off screen (FloatingBadges writes styles on every
// pointer move) costs nothing, and it measures once more each time it comes back near.
import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";
import { measurePins, type AnatomyPin, type Measured } from "./anatomy-measure";

export type AnatomyState = { w: number; h: number; m: Measured[] };

/** what a part's movement looks like to the DOM: its shape (childList), and style and class writes */
const WATCH: MutationObserverInit = { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] };
/** a CSS entrance or hover settles with one of these, captured from anywhere inside */
const SETTLE_EVENTS = ["animationend", "transitionend"] as const;
const LAZY_MS = 120;
/** how near the screen the stage must be for the observers to run */
const NEAR = "50% 0px";

export function useAnatomyWatch(
  stage: RefObject<HTMLDivElement | null>,
  pins: RefObject<readonly AnatomyPin[]>,
  frame: true | string | undefined,
  count: number,
  setSt: Dispatch<SetStateAction<AnatomyState>>,
) {
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    let last = "";
    const warned = new Set<string>();
    let watched: { win: Window; doc: Document; mo: MutationObserver } | null = null;
    const timers: number[] = [];
    let lazy = 0;
    let lazyAt = 0;
    let on = false;

    const measure = () => {
      raf = 0;
      if (!on) return;
      const r = el.getBoundingClientRect();
      const m = measurePins(el, pins.current, frame);
      const next = { w: r.width, h: r.height, m };
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setSt(next);
      }
      watchFrame();
      if (process.env.NODE_ENV !== "production") {
        m.forEach((x, i) => {
          const sel = pins.current[i]?.selector;
          if (x.status !== "lost" || !sel || warned.has(sel)) return;
          warned.add(sel);
          console.warn(`[ds] Anatomy pin lost: ${sel}`);
        });
      }
    };
    const schedule = () => {
      if (on && !raf) raf = requestAnimationFrame(measure);
    };
    // style and class writes come every frame while motion animates, so they measure at most every 120ms,
    // with a last measure once the writes stop (the part at rest)
    const soon = () => {
      if (lazy) return;
      lazy = window.setTimeout(() => {
        lazy = 0;
        lazyAt = performance.now();
        schedule();
      }, Math.max(0, LAZY_MS - (performance.now() - lazyAt)));
    };
    const onMutate = (records: MutationRecord[]) => {
      if (records.some((r) => r.type === "childList")) schedule();
      else soon();
    };

    // a frame's own scroll, resize and DOM changes move its parts, so they are watched too
    const watchFrame = () => {
      if (!frame) return;
      const f = el.querySelector<HTMLIFrameElement>(frame === true ? "iframe" : frame);
      let win: Window | null = null;
      try {
        win = f?.contentWindow && f.contentDocument?.readyState === "complete" ? f.contentWindow : null;
      } catch {
        win = null;
      }
      if (watched?.win === win) return;
      unwatch();
      const doc = f?.contentDocument;
      if (!win || !doc) return;
      const mo = new MutationObserver(onMutate);
      mo.observe(doc.documentElement, WATCH);
      win.addEventListener("scroll", schedule, { passive: true });
      win.addEventListener("resize", schedule);
      for (const t of SETTLE_EVENTS) doc.addEventListener(t, schedule, true);
      watched = { win, doc, mo };
    };
    const unwatch = () => {
      if (!watched) return;
      watched.mo.disconnect();
      watched.win.removeEventListener("scroll", schedule);
      watched.win.removeEventListener("resize", schedule);
      for (const t of SETTLE_EVENTS) watched.doc.removeEventListener(t, schedule, true);
      watched = null;
    };
    const onLoad = () => {
      schedule();
      timers.push(window.setTimeout(schedule, 300), window.setTimeout(schedule, 1200));
    };

    const ro = new ResizeObserver(schedule);
    const mo = new MutationObserver(onMutate);
    const connect = () => {
      if (on) return;
      on = true;
      ro.observe(el);
      mo.observe(el, WATCH);
      el.addEventListener("load", onLoad, true);
      for (const t of SETTLE_EVENTS) el.addEventListener(t, schedule, true);
      window.addEventListener("resize", schedule);
      schedule();
    };
    const disconnect = () => {
      if (!on) return;
      on = false;
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(lazy);
      lazy = 0;
      timers.splice(0).forEach((t) => window.clearTimeout(t));
      ro.disconnect();
      mo.disconnect();
      unwatch();
      el.removeEventListener("load", onLoad, true);
      for (const t of SETTLE_EVENTS) el.removeEventListener(t, schedule, true);
      window.removeEventListener("resize", schedule);
    };

    const near = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      if (e.isIntersecting) connect();
      else disconnect();
    }, { rootMargin: NEAR });
    near.observe(el);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      near.disconnect();
      disconnect();
    };
  }, [stage, pins, frame, count, setSt]);
}
