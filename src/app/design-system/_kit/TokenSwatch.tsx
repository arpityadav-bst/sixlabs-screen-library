"use client";

// A token card, 200px wide, kept to what a glance needs: the swatch (a checkerboard under alpha values, so 8%
// reads as 8%), the name chip, the written value, what it is for, and for a text colour its contrast on the
// four grounds. Nothing else is on the card: its source line sits in the tier's drawer with the exact values,
// and the never, files and source props are still accepted but no longer drawn. A custom property is drawn
// from the live variable, and when the page's value differs from the written one the card prints the live
// value in red, so the drift is seen where it happens.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Chip } from "./Chip";
import { ContrastRow } from "./ContrastBadge";
import { GROUND_NAMES, parseColor, sameColor, type GroundName } from "./contrast";

export type TokenSwatchProps = {
  /** the token's name, "--ds-color-ink" or a plain label */
  name: string;
  /** the written value, any CSS colour */
  value: string;
  use?: ReactNode;
  /** @deprecated accepted, not drawn: the card shows what a glance needs */
  never?: ReactNode;
  /** @deprecated accepted, not drawn */
  files?: number;
  /** @deprecated accepted, not drawn: the tier's drawer lists the source with the exact values */
  source?: string;
  /** the grounds to grade it on, or false for a ground or fill token where text contrast means nothing */
  contrast?: false | readonly (GroundName | string)[];
};

export function TokenSwatch({ name, value, use, contrast = GROUND_NAMES }: TokenSwatchProps) {
  const isVar = name.startsWith("--");
  const ref = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!isVar || !el) return;
    const id = requestAnimationFrame(() => {
      const v = getComputedStyle(el).getPropertyValue(name).trim();
      setLive(v && !sameColor(v, value) ? v : null);
    });
    return () => cancelAnimationFrame(id);
  }, [isVar, name, value]);

  const alpha = (parseColor(value)?.a ?? 1) < 1;
  const fill = isVar ? `var(${name}, ${value})` : value;

  return (
    <figure className="ds-swatch">
      <span ref={ref} className={alpha ? "ds-swatch-chip ds-swatch-chip--alpha" : "ds-swatch-chip"}>
        <span style={{ background: fill }} />
      </span>
      <figcaption className="ds-swatch-body">
        <Chip>{name}</Chip>
        <span className="ds-swatch-value">{value}</span>
        {live && <span className="ds-swatch-live">live {live}</span>}
        {use && (
          <span className="ds-swatch-use">
            <b>Use for</b> {use}
          </span>
        )}
        {contrast && <ContrastRow fg={value} grounds={contrast} />}
      </figcaption>
    </figure>
  );
}

/** Lays token cards out at 200px, wrapping. */
export function SwatchGrid({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="ds-swatch-grid" role={label ? "group" : undefined} aria-label={label}>
      {children}
    </div>
  );
}
