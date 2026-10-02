"use client";

// Development-only copy checks on the guide's own prose (role lines and notes). It warns in the console
// when a role line runs over 25 words, when a sentence appears twice on the page, and when prose carries
// an em dash or a semicolon. Nothing runs in production.
import { useEffect, type RefObject } from "react";

const counts = new Map<string, number>();

const sentencesOf = (text: string) =>
  text
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.split(" ").length >= 4);

export function useProseCheck(ref: RefObject<HTMLElement | null>, kind: "role" | "note") {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const text = (ref.current?.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) return;
    const words = text.split(" ").length;
    if (kind === "role" && words > 25) console.warn(`[design-system] role line runs ${words} words (max 25): "${text}"`);
    if (text.includes("\u2014")) console.warn(`[design-system] em dash in ${kind}: "${text}"`);
    if (text.includes(";")) console.warn(`[design-system] semicolon in ${kind}: "${text}"`);
    const mine = sentencesOf(text);
    for (const s of mine) {
      const n = (counts.get(s) ?? 0) + 1;
      counts.set(s, n);
      if (n === 2) console.warn(`[design-system] sentence appears twice on the page: "${s}"`);
    }
    return () => {
      for (const s of mine) {
        const n = (counts.get(s) ?? 1) - 1;
        if (n <= 0) counts.delete(s);
        else counts.set(s, n);
      }
    };
  }, [ref, kind]);
}
