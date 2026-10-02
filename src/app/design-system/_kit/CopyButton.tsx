"use client";

// The code snippet's copy control: a kit ghost xs button that reads "Copied" for a moment after a copy. Its
// name says what it copies ("Copy Try now code"), and the outcome, "Copied" or "Copy failed", is said through
// the guide's one status region (announce), so the button's own name never changes.
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { announce } from "./go";

export function CopyButton({ text, label = "Copy", of }: { text: string; label?: string; of?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      announce("Copy failed");
      return;
    }
    announce("Copied");
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 1400);
  };

  const Icon = done ? Check : Copy;
  return (
    <button type="button" className="ds-btn" aria-label={of ? `${label} ${of} code` : undefined} onClick={copy}>
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      <span>{done ? "Copied" : label}</span>
    </button>
  );
}
