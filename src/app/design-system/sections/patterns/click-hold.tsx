"use client";

// The site pages' click hold (ClickLock.tsx), scoped to one box of the guide: a click, a middle click or an
// Enter on a link or a data-cta control inside it is stopped before the page or the part's handlers see it,
// so a shipped part mounted inline (the Closing's Sign in is href="#") never jumps the guide to its top or
// rewrites the hash. Hover and focus still show, and nothing outside the box is touched.
import type { MouseEvent, ReactNode } from "react";

const HELD = "a, [data-cta]";

function stop(e: MouseEvent<HTMLDivElement>) {
  const hit = (e.target as Element | null)?.closest?.(HELD);
  if (!hit || !e.currentTarget.contains(hit)) return;
  e.preventDefault();
  e.stopPropagation();
}

export function ClickHold({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={className} onClickCapture={stop} onAuxClickCapture={stop}>
      {children}
    </div>
  );
}
