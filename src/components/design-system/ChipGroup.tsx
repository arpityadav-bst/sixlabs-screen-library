"use client";

// Choice chips as one control: a radiogroup of Chip kind choice with one tab stop, on the picked chip or the
// first enabled one. The arrows move the pick and wrap, Home and End reach the ends, disabled chips are
// skipped, as Segmented's radios do (roving.ts). Filter chips need no group part: each is its own toggle
// button with its own tab stop, inside any element that names the set.
import type { LucideIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Chip, type ChipGround, type ChipSize } from "./Chip";
import { rovingTarget, tabStop } from "./roving";

export type ChipOption<T extends string> = { id: T; label: string; icon?: LucideIcon; disabled?: boolean };

export type ChipGroupProps<T extends string> = {
  options: readonly ChipOption<T>[];
  /** the picked chip, or null while none is */
  value: T | null;
  onChange: (id: T) => void;
  /** the group's accessible name */
  label: string;
  size?: ChipSize;
  ground?: ChipGround;
  disabled?: boolean;
  className?: string;
};

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  ground = "light",
  disabled = false,
  className = "",
}: ChipGroupProps<T>) {
  const items = options.map((o) => ({ id: o.id, disabled: disabled || o.disabled }));
  const stop = tabStop(items, value);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const chips = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]"));
    const at = chips.indexOf(e.target as HTMLButtonElement);
    const next = rovingTarget(items, at >= 0 ? options[at].id : (value ?? undefined), e.key, true);
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    chips[options.findIndex((o) => o.id === next)]?.focus();
    if (next !== value) onChange(next);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {options.map((o) => (
        <Chip
          key={o.id}
          kind="choice"
          selected={o.id === value}
          onToggle={() => o.id !== value && onChange(o.id)}
          icon={o.icon}
          size={size}
          ground={ground}
          disabled={disabled || o.disabled}
          tabIndex={o.id === stop && !disabled ? 0 : -1}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  );
}
