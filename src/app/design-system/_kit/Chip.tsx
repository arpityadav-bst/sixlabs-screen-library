"use client";

// A mono chip that names a part ("TileFloor · tiles/TileFloor.tsx:21", "DESIGN.md 7.1") and copies itself, or
// its `value`, on click. The copy is confirmed by a green outline and said through the guide's one status
// region (announce), so the chip's own name never changes and it never changes width. A failed copy is said
// there too.
import { useEffect, useRef, useState } from "react";
import { announce } from "./go";

export function Chip({ children, value, label }: { children: string; value?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value ?? children);
    } catch {
      announce("Copy failed");
      return;
    }
    announce("Copied");
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      type="button"
      className="ds-chip"
      data-copied={copied || undefined}
      title={label ?? "Copy"}
      aria-label={label}
      onClick={copy}
    >
      {children}
    </button>
  );
}
