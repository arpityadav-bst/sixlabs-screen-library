"use client";

// One glyph field on a panel host: the real mountAsciiField, called once per host (it has no teardown, so
// the host.firstChild guard keeps React's second effect run from mounting a second canvas). The pool
// listens on the host, so it follows the pointer inside this panel only. The terminal modes set the
// terminal's tints on the host, as JobTerminal does. "page-on-terminal" keeps the page's own tints.
import { useEffect, useRef, type CSSProperties } from "react";
import { mountAsciiField } from "@/components/website/ascii-field";
import { FIELD_SPECS, TERMINAL_TINT, type FieldMode } from "./ascii-field-data";
import s from "./fx-live.module.css";

export function AsciiPanel({ mode, height, cell }: { mode: FieldMode; height?: number; cell?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || host.firstChild) return;
    const { pointer, ...rest } = FIELD_SPECS[mode];
    mountAsciiField({
      host,
      ...rest,
      pointer: pointer === "hover" ? window.matchMedia("(hover: hover)").matches : pointer,
    });
  }, [mode]);

  const tint = mode === "terminal" ? (TERMINAL_TINT as CSSProperties) : undefined;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`ascii-host ${cell ? s["ds-ascii-cell"] : s["ds-ascii-host"]}`}
      style={height ? { ...tint, height } : tint}
    />
  );
}
