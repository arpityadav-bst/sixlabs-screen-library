// Shared bits for the shell sections: a captioned frame, a full-width cell and a row of frames. A frame URL
// with a query comes from frameHref in frame/_parts/ids.
import type { ReactNode } from "react";
import s from "./shell.module.css";

/** A frame with its caption under it, at full width. */
export function Shot({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <figure className={s["ds-shot"]}>
      {children}
      <figcaption className="ds-label">{label}</figcaption>
    </figure>
  );
}

/** A full-width cell, for a frame inside a StateGrid. */
export function Cell({ children }: { children: ReactNode }) {
  return <div className={s["ds-cell"]}>{children}</div>;
}

/** Frames side by side. */
export function Shots({ children }: { children: ReactNode }) {
  return <div className={s["ds-shots"]}>{children}</div>;
}
