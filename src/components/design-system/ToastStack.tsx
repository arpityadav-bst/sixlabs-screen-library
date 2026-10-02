"use client";

// The toast stack: the newest three, newest nearest the screen edge, the older ones tucked 8px behind at
// 0.96 and 0.9 opacity a step. Hover or focus inside fans them out at an 8px gap and holds every timer, so a
// toast never leaves while it is being read. On a coarse pointer the front toast swipes away down 40px.
// Dismissing a toast from inside the stack moves focus to the next toast's close, or back to where it was
// before focus entered the stack, so it never falls to the page. live false keeps the same layout with no
// timers or swipe, for the guide's static stack.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { SCALE, SPRING } from "./motion";
import { EASE_IN, OVERLAY } from "./overlay-motion";
import { Toast } from "./Toast";
import { lifeOf, type ToastItem } from "./toast-store";
import { useMedia } from "./use-media";

/** toasts on screen at once */
export const STACK_VISIBLE = 3;
const GAP = 8;
const PEEK = 8;
const SWIPE = 40;
const FALLBACK_H = 52;

/** Runs a toast's time, held while paused, restarted when its version changes. */
function useLife(ms: number, paused: boolean, version: number, done: () => void) {
  const left = useRef(ms);
  const doneRef = useRef(done);
  useEffect(() => {
    doneRef.current = done;
  });
  useEffect(() => {
    left.current = ms;
  }, [ms, version]);
  useEffect(() => {
    if (paused || !Number.isFinite(left.current)) return;
    const start = Date.now();
    const id = window.setTimeout(() => doneRef.current(), left.current);
    return () => {
      window.clearTimeout(id);
      left.current -= Date.now() - start;
    };
  }, [paused, ms, version]);
}

type ItemProps = {
  t: ToastItem;
  k: number;
  y: number;
  expanded: boolean;
  live: boolean;
  swipe: boolean;
  reduced: boolean;
  dismiss: (id: string) => void;
  report: (id: string, h: number) => void;
  hotkey?: string;
};

function StackItem({ t, k, y, expanded, live, swipe, reduced, dismiss, report, hotkey }: ItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => report(t.id, e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [t.id, report]);
  useLife(live ? lifeOf(t) : Infinity, expanded, t.version, () => dismiss(t.id));

  const scale = expanded ? 1 : 1 - 0.04 * k;
  const opacity = expanded ? 1 : 1 - 0.1 * k;
  const act = t.action;
  return (
    <motion.li
      ref={ref}
      data-toast={t.id}
      className="pointer-events-auto absolute inset-x-0 bottom-0 origin-bottom"
      style={{ zIndex: STACK_VISIBLE - k }}
      initial={reduced ? { opacity: 0, y } : { opacity: 0, y: y + 16, scale: SCALE.panel }}
      animate={{ opacity, y, scale, transition: reduced ? { duration: OVERLAY.reducedFade } : SPRING.pop }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: OVERLAY.reducedFade } }
          : { opacity: 0, y: y + 8, transition: { duration: OVERLAY.toastOut, ease: EASE_IN } }
      }
      drag={swipe && k === 0 ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.8 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > SWIPE) dismiss(t.id);
      }}
    >
      <Toast
        tone={t.tone}
        title={t.title}
        body={t.body}
        action={
          act && {
            label: act.label,
            onClick: () => {
              act.onClick?.();
              dismiss(t.id);
            },
          }
        }
        onDismiss={() => dismiss(t.id)}
        shortcut={k === 0 ? hotkey : undefined}
      />
    </motion.li>
  );
}

export type ToastStackProps = {
  items: readonly ToastItem[];
  onDismiss?: (id: string) => void;
  /** timers and swipe on (the Toaster), or a still stack (the guide) */
  live?: boolean;
  /** docs: hold the stack fanned out */
  expanded?: boolean;
  /** the key that focuses the front toast (the Toaster's), written on its first control */
  hotkey?: string;
  className?: string;
};

export function ToastStack({ items, onDismiss, live = true, expanded: forced, hotkey, className = "" }: ToastStackProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const reduced = !!useReducedMotion();
  const coarse = useMedia("(pointer: coarse)");
  const expanded = forced ?? (hovered || focused);
  const shown = items.slice(-STACK_VISIBLE).reverse();

  const report = useCallback(
    (id: string, h: number) => setHeights((m) => (m[id] === h ? m : { ...m, [id]: h })),
    [],
  );
  const list = useRef<HTMLOListElement>(null);
  const back = useRef<HTMLElement | null>(null);
  const dismiss = useCallback(
    (id: string) => {
      const ol = list.current;
      if (ol && ol.contains(document.activeElement)) {
        const next = Array.from(ol.querySelectorAll<HTMLElement>("[data-toast] [data-part=close]")).find(
          (b) => b.closest("[data-toast]")?.getAttribute("data-toast") !== id,
        );
        const to = next ?? (back.current?.isConnected ? back.current : null);
        to?.focus();
      }
      onDismiss?.(id);
    },
    [onDismiss],
  );
  const onFocus = (e: FocusEvent<HTMLOListElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) back.current = e.relatedTarget as HTMLElement | null;
    setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLOListElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const offsets: number[] = [];
  let run = 0;
  for (let k = 0; k < shown.length; k++) {
    offsets.push(expanded ? -run : -PEEK * k);
    run += (heights[shown[k].id] ?? FALLBACK_H) + GAP;
  }
  const front = shown.length ? (heights[shown[0].id] ?? FALLBACK_H) : 0;
  const height = !shown.length ? 0 : expanded ? run - GAP : front + PEEK * (shown.length - 1);

  return (
    <ol
      ref={list}
      data-part="stack"
      data-expanded={expanded || undefined}
      className={`pointer-events-none relative data-[expanded]:pointer-events-auto ${className}`}
      style={{ height }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <AnimatePresence initial={live}>
        {shown.map((t, k) => (
          <StackItem
            key={t.id}
            t={t}
            k={k}
            y={offsets[k]}
            expanded={expanded}
            live={live}
            swipe={live && coarse}
            reduced={reduced}
            dismiss={dismiss}
            report={report}
            hotkey={hotkey}
          />
        ))}
      </AnimatePresence>
    </ol>
  );
}
