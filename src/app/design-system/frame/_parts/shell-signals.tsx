"use client";

// Helpers for the shell's frame parts (the header, the menu, the footer, back to top, the scroll cue). Each
// one acts on the frame's own window once the real parts are mounted and listening, so a part shows a state
// the way the live page reaches it: a real scroll, a real window event, a real click. The frame's URL can
// override them: ?y=0 or ?y=900,860 sets the scroll, ?signal=off and ?open=0 skip the event and the click.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { HERO_LOADED } from "@/components/website/hero-intro";
import { useGrain } from "../../_kit/noise-tile";

const param = (name: string) => new URLSearchParams(window.location.search).get(name);

/** Scrolls the frame's window to each y in turn, 150ms apart, so a part that reads direction sees a scroll
 *  down and then up. The first runs a beat after mount, once the parts' scroll listeners are on. */
export function ScrollTo({ y }: { y: number | readonly number[] }) {
  const key = typeof y === "number" ? String(y) : y.join(",");
  useEffect(() => {
    const ys = (param("y") ?? key).split(",").map(Number);
    const ids = ys.map((v, k) =>
      window.setTimeout(() => window.scrollTo({ top: v, behavior: "instant" }), 80 + k * 150),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [key]);
  return null;
}

/** The window events the shell answers to: the full view's end of loading, and the water's fill. */
export type SignalName = typeof HERO_LOADED | "accentwave";

/** Sends a window event a beat after mount: HERO_LOADED, or "accentwave" with { filled }. */
export function Signal({ name, detail }: { name: SignalName; detail?: Record<string, unknown> }) {
  const json = JSON.stringify(detail ?? null);
  useEffect(() => {
    if (param("signal") === "off") return;
    const d = JSON.parse(json) as Record<string, unknown> | null;
    const id = window.setTimeout(
      () => window.dispatchEvent(d ? new CustomEvent(name, { detail: d }) : new Event(name)),
      80,
    );
    return () => window.clearTimeout(id);
  }, [name, json]);
  return null;
}

/** Clicks the first match once the page has hydrated, to open a part whose open state is internal. */
export function ClickFirst({ selector }: { selector: string }) {
  useEffect(() => {
    if (param("open") === "0") return;
    const id = window.setTimeout(() => document.querySelector<HTMLElement>(selector)?.click(), 300);
    return () => window.clearTimeout(id);
  }, [selector]);
  return null;
}

/** Room to scroll, in viewport heights. */
export function Spacer({ vh }: { vh: number }) {
  return <div aria-hidden style={{ height: `${vh}vh` }} />;
}

const TONES = {
  /** the players' ground, where the water has filled the view */
  accent: "var(--ds-color-accent)",
  /** the hero's grey, where the tile floor runs */
  container: "var(--ds-color-container)",
} as const;

/** A fixed ground under the frame's parts. The accent carries the water's grain (noise-tile.ts), so a frame
 *  on the water stands on the page's own blue. */
export function Ground({ tone, children }: { tone: keyof typeof TONES; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGrain(ref, tone === "accent");
  const style: CSSProperties = { position: "fixed", inset: 0, backgroundColor: TONES[tone] };
  return (
    <div ref={ref} aria-hidden style={style}>
      {children}
    </div>
  );
}
