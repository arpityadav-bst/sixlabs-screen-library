// Moving through a list of options from the keyboard: the next enabled row in a direction, the first and
// last enabled rows, and type-ahead (letters typed within 500ms build one query, matched from the row
// after the current one). Shared by Select and SearchField.
import { useRef } from "react";
import type { SelectOption } from "./select-panel";

/** The next enabled index from `from` in `dir`, clamped at the ends. -1 when nothing is enabled. */
export function step(options: readonly SelectOption[], from: number, dir: 1 | -1, by = 1): number {
  let k = from;
  let moved = 0;
  let found = from >= 0 && from < options.length && !options[from].disabled ? from : -1;
  while (moved < by) {
    k += dir;
    if (k < 0 || k >= options.length) break;
    if (!options[k].disabled) {
      found = k;
      moved += 1;
    }
  }
  if (found === -1) return edge(options, dir === 1 ? "first" : "last");
  return found;
}

export function edge(options: readonly SelectOption[], which: "first" | "last"): number {
  const order = which === "first" ? options.map((_, k) => k) : options.map((_, k) => options.length - 1 - k);
  return order.find((k) => !options[k].disabled) ?? -1;
}

/** Returns find(key, from): the index type-ahead lands on, or -1. */
export function useTypeahead(options: readonly SelectOption[]) {
  const buffer = useRef("");
  const timer = useRef(0);
  return (key: string, from: number): number => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => (buffer.current = ""), 500);
    buffer.current += key.toLowerCase();
    const q = buffer.current;
    const n = options.length;
    for (let i = 1; i <= n; i += 1) {
      const k = (Math.max(from, 0) + (q.length > 1 ? i - 1 : i)) % n;
      const o = options[k];
      if (!o.disabled && o.label.toLowerCase().startsWith(q)) return k;
    }
    return -1;
  };
}
