// A row of colour samples, each drawn the way the colour is seen on the site: a fill as a block, a line as a
// 1px box, a text colour as type, a halo as a ring, a glow as a radial and a dot as a dot. Under each sample
// sit its name, an optional caption and an optional contrast reading on the ground it ships on. No hooks, so
// server sections and the floor palette's client leaf share it.
import type { CSSProperties, ReactNode } from "react";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import s from "./colour.module.css";

export type SampleMode = "fill" | "line" | "text" | "halo" | "glow" | "dot";

export type StripItem = {
  /** the label under the sample, a short token name */
  readonly name: string;
  /** any CSS colour */
  readonly value: string;
  readonly mode: SampleMode;
  readonly caption?: ReactNode;
  /** grade the colour on this ground (a ground name or a colour) */
  readonly on?: string;
  readonly onName?: string;
};

/** The sample colour as a custom property on the element, so the CSS module draws every mode from one value. */
export const tint = (value: string) => ({ "--ds-col-c": value }) as CSSProperties;

export function Sample({ value, mode }: { value: string; mode: SampleMode }) {
  return (
    <span className={`${s["ds-col-sample"]} ${s[`ds-col-sample--${mode}`]}`} style={tint(value)} aria-hidden="true">
      {mode === "text" ? "Aa" : null}
    </span>
  );
}

export function Strip({ items, label }: { items: readonly StripItem[]; label: string }) {
  return (
    <ul className={s["ds-col-strip"]} aria-label={label}>
      {items.map((it) => (
        <li key={it.name} className={s["ds-col-item"]}>
          <Sample value={it.value} mode={it.mode} />
          <span className={s["ds-col-name"]}>{it.name}</span>
          {it.caption && <span className={s["ds-col-cap"]}>{it.caption}</span>}
          {it.on && <ContrastBadge fg={it.value} bg={it.on} bgName={it.onName} />}
        </li>
      ))}
    </ul>
  );
}
