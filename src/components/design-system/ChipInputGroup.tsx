"use client";

// Input chips as one set: a labelled group of Chip kind input whose removal never drops focus to the page.
// It records which chip held focus before the value goes, then moves focus to the remove button now in
// that place (the next chip), or the one before when the last went, and to the fallback (the field that
// adds values) once the set is empty. A removal made with the pointer, while focus is elsewhere, moves
// nothing.
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Chip } from "./Chip";
import type { ChipGround, ChipSize } from "./chip-styles";

export type ChipInputItem = {
  id: string;
  /** the value, also in its remove button's name */
  label: string;
  icon?: LucideIcon;
  /** a leading 20px Avatar */
  avatar?: ReactNode;
  disabled?: boolean;
};

export type ChipInputGroupProps = {
  items: readonly ChipInputItem[];
  /** removes one value. The caller drops it from items. */
  onRemove: (id: string) => void;
  /** the set's accessible name */
  label: string;
  size?: ChipSize;
  ground?: ChipGround;
  /** where focus goes once the last chip has gone, usually the field that adds values */
  fallback?: RefObject<HTMLElement | null>;
  className?: string;
};

export function ChipInputGroup({
  items,
  onRemove,
  label,
  size = "md",
  ground = "light",
  fallback,
  className = "",
}: ChipInputGroupProps) {
  const box = useRef<HTMLDivElement>(null);
  const refocus = useRef<number | null>(null);

  useEffect(() => {
    const at = refocus.current;
    refocus.current = null;
    if (at === null) return;
    // one remove button per chip, in order, so the button at the old place is the next chip's
    const all = Array.from(box.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const from = Math.min(at, all.length - 1);
    const to =
      all.slice(from).find((b) => !b.disabled) ??
      all.slice(0, Math.max(from, 0)).reverse().find((b) => !b.disabled) ??
      fallback?.current;
    to?.focus();
  }, [items, fallback]);

  const remove = (id: string) => {
    const at = items.findIndex((it) => it.id === id);
    if (at >= 0 && box.current?.contains(document.activeElement)) refocus.current = at;
    onRemove(id);
  };

  return (
    <div ref={box} role="group" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((it) => (
        <Chip
          key={it.id}
          kind="input"
          size={size}
          ground={ground}
          icon={it.icon}
          avatar={it.avatar}
          disabled={it.disabled}
          onRemove={() => remove(it.id)}
        >
          {it.label}
        </Chip>
      ))}
    </div>
  );
}
