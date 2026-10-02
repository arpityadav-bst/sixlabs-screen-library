"use client";

// The kit's own segmented switch, for guide chrome only (Specimen / Anatomy, the preview widths). One tab
// stop, arrows move and select, Home and End jump. The selected segment is filled navy, the guide's one
// selected fill. The system Segmented is a specimen and is never used as chrome.
import { useRef, type KeyboardEvent } from "react";

export type KitSegOption<T extends string | number> = { value: T; label: string };

export function KitSeg<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly KitSegOption<T>[];
  value: T;
  onChange: (v: T) => void;
  /** the group's accessible name */
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (at + 1) % options.length
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (at - 1 + options.length) % options.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : -1;
    if (to < 0) return;
    e.preventDefault();
    e.stopPropagation();
    onChange(options[to].value);
    refs.current[to]?.focus();
  };

  return (
    <div className="ds-seg" role="radiogroup" aria-label={label} onKeyDown={onKey}>
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === at}
          tabIndex={i === at ? 0 : -1}
          className="ds-seg-opt"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
