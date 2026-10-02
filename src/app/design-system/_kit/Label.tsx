// Captions carry facts only, never reasons: "md · 40 · measured 40.0". Label is the caption line,
// Item pairs one specimen with its caption, and None is the state grid's cell for a state a variant does not
// have ("none"), the one copy every grid uses.
import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <p className="ds-label">{children}</p>;
}

export function Item({
  label,
  align = "center",
  children,
}: {
  label: ReactNode;
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <figure className={align === "start" ? "ds-item ds-item--start" : "ds-item"}>
      {children}
      <figcaption className="ds-label">{label}</figcaption>
    </figure>
  );
}

/** A state grid cell for a state the part does not take in this row, in the caption's type. */
export function None({ children = "none" }: { children?: string }) {
  return <span className="ds-label ds-none">{children}</span>;
}
