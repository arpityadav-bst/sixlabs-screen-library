"use client";

// A short label for an icon-only control or a truncated line. Hover opens it after 400ms, and any tooltip
// opened within 600ms of the last one closing opens at once, so a row of icon buttons reads in one sweep.
// Keyboard focus opens it at once. It stays while the pointer crosses onto it, and Escape, blur, a press or
// leaving closes it (WCAG 1.4.13). A scroll moves it with its trigger and closes it only once the trigger has
// left the viewport. Touch opens nothing, so the words must also be the control's name. A shortcut is also
// set on the trigger as aria-keyshortcuts.
// The live bubble goes into a portal at fixed coordinates: the body, or the open dialog the trigger sits in,
// because a modal's top layer would cover anything outside it. With open set it renders in place instead,
// as a picture for the guide, with no listeners.
import { AnimatePresence, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { EASE, SCALE } from "./motion";
import { EASE_IN, OVERLAY } from "./overlay-motion";
import { TooltipBubble, type TooltipTone } from "./TooltipBubble";
import { placeTooltip, type TooltipSide } from "./tooltip-place";

export type { TooltipSide } from "./tooltip-place";
export type { TooltipTone } from "./TooltipBubble";

/** a second tooltip opens at once inside this window, ms */
export const TOOLTIP_SKIP = 600;
/** the time the pointer has to cross from the trigger onto the bubble, ms */
const GRACE = 100;
/** when the last tooltip on the page closed, for the skip window */
let lastClosed = 0;

export type TooltipProps = {
  /** the words, short and with no interactive content */
  content: string;
  side?: TooltipSide;
  /** ms from hover to open, 400 by default (keyboard focus opens at once) */
  delay?: number;
  /** a key hint, set in mono after the words */
  shortcut?: string;
  arrow?: boolean;
  tone?: TooltipTone;
  /** docs: render it open in place beside the trigger, with no hover, portal or listeners */
  open?: boolean;
  /** docs, with open: one frame of the way in or out */
  forceState?: "entering" | "leaving";
  /** the trigger, one focusable control */
  children: ReactNode;
  className?: string;
};

/** In place: the bubble's spot beside the trigger, by side. */
const IN_PLACE: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

/** The 4px start offset, toward the trigger, and the scale origin on the trigger's side. */
const TOWARD: Record<TooltipSide, { x?: number; y?: number; originX?: number; originY?: number }> = {
  top: { y: 4, originY: 1 },
  bottom: { y: -4, originY: 0 },
  left: { x: 4, originX: 1 },
  right: { x: -4, originX: 0 },
};

const FRAME = {
  entering: (s: TooltipSide) => ({ opacity: 0.6, scale: 0.98, x: (TOWARD[s].x ?? 0) / 2, y: (TOWARD[s].y ?? 0) / 2 }),
  leaving: () => ({ opacity: 0.4 }),
};

const FOCUSABLE = "button, a[href], input, select, textarea, [tabindex]";

export function Tooltip({
  content,
  side = "top",
  delay = 400,
  shortcut,
  arrow = false,
  tone = "default",
  open,
  forceState,
  children,
  className = "",
}: TooltipProps) {
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();
  const docs = open !== undefined;

  const clear = () => window.clearTimeout(timer.current);
  const show = () => {
    const el = wrap.current;
    if (!el) return;
    setHost(el.closest("dialog") ?? document.body);
    setShown(true);
  };
  const hide = () => {
    clear();
    if (shown) lastClosed = Date.now();
    setShown(false);
  };

  const onEnter = (e: PointerEvent) => {
    if (docs || e.pointerType === "touch") return;
    clear();
    if (shown) return;
    if (Date.now() - lastClosed < TOOLTIP_SKIP) show();
    else timer.current = window.setTimeout(show, delay);
  };
  const onLeave = () => {
    if (docs) return;
    clear();
    timer.current = window.setTimeout(hide, GRACE);
  };
  const onFocus = (e: FocusEvent) => {
    if (docs || !(e.target instanceof Element) || !e.target.matches(":focus-visible")) return;
    clear();
    show();
  };
  const onBlur = () => {
    if (!docs) hide();
  };

  // the trigger is described by the words, unless they already are its name, and carries the shortcut
  useEffect(() => {
    const t = wrap.current?.querySelector<HTMLElement>(FOCUSABLE);
    if (!t) return;
    const keys = t.getAttribute("aria-keyshortcuts");
    if (shortcut && keys === null) t.setAttribute("aria-keyshortcuts", shortcut);
    const describe = t.getAttribute("aria-label") !== content;
    const prev = t.getAttribute("aria-describedby");
    if (describe) t.setAttribute("aria-describedby", prev ? `${prev} ${id}` : id);
    return () => {
      if (shortcut && keys === null) t.removeAttribute("aria-keyshortcuts");
      if (!describe) return;
      if (prev) t.setAttribute("aria-describedby", prev);
      else t.removeAttribute("aria-describedby");
    };
  }, [content, id, shortcut]);

  // place the live bubble by writing its position straight to the node. Returns false once the trigger has
  // left the viewport, when the bubble has nothing left to point at.
  const place = () => {
    const b = bubble.current;
    const t = wrap.current;
    if (!b || !t) return true;
    const r = t.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) return false;
    const p = placeTooltip(r, b.offsetWidth, b.offsetHeight, side, window.innerWidth, window.innerHeight);
    b.style.left = `${p.x}px`;
    b.style.top = `${p.y}px`;
    b.dataset.side = p.side;
    b.style.setProperty("--ds-tt-arrow", `${p.arrow}px`);
    return true;
  };
  const placeRef = useRef(place);
  useLayoutEffect(() => {
    placeRef.current = place;
  });

  // Escape closes the live bubble, and is used up here so a dialog round it stays. A scroll or a resize
  // moves it with its trigger, and closes it once the trigger is out of view.
  useEffect(() => {
    if (!shown) return;
    const close = () => {
      lastClosed = Date.now();
      setShown(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      close();
    };
    const follow = () => {
      if (!placeRef.current()) close();
    };
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", follow, true);
    window.addEventListener("resize", follow);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", follow, true);
      window.removeEventListener("resize", follow);
    };
  }, [shown]);

  // place the live bubble before it paints
  useLayoutEffect(() => {
    if (shown) placeRef.current();
  }, [shown, side, content, shortcut]);

  useEffect(() => clear, []);

  const toward = TOWARD[side];
  const frame = docs && forceState ? FRAME[forceState](side) : undefined;

  return (
    <span
      ref={wrap}
      className={`relative inline-flex ${className}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onBlur}
    >
      {children}
      {docs && open && (
        <TooltipBubble
          id={id}
          content={content}
          side={side}
          tone={tone}
          shortcut={shortcut}
          arrow={arrow}
          initial={false}
          style={{ originX: toward.originX, originY: toward.originY, ...frame }}
          className={`pointer-events-none absolute z-(--ds-z-tooltip) ${IN_PLACE[side]}`}
        />
      )}
      {!docs && !shown && (
        <span id={id} hidden>
          {shortcut ? `${content} ${shortcut}` : content}
        </span>
      )}
      {!docs &&
        host &&
        createPortal(
          <AnimatePresence>
            {shown && (
              <TooltipBubble
                key="bubble"
                ref={bubble}
                id={id}
                content={content}
                side={side}
                tone={tone}
                shortcut={shortcut}
                arrow={arrow}
                className="pointer-events-auto fixed left-0 top-0 z-(--ds-z-tooltip)"
                style={{ originX: toward.originX, originY: toward.originY }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: SCALE.panel, x: toward.x ?? 0, y: toward.y ?? 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: OVERLAY.tooltipIn, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: OVERLAY.tooltipOut, ease: EASE_IN } }}
                onPointerEnter={clear}
                onPointerLeave={onLeave}
              />
            )}
          </AnimatePresence>,
          host,
        )}
    </span>
  );
}
