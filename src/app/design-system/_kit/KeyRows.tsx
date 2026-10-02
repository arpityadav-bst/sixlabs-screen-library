// Key / value rows for systems that cannot be shown (the layer stack, the glyph field, window events).
// Rows come from a _data module, never inline literals, so a value is written once.
import type { ReactNode } from "react";

export type KeyRow = {
  readonly key: string;
  readonly value: ReactNode;
  /** file:line the value is read from */
  readonly source?: string;
};

export function KeyRows({ rows, label }: { rows: readonly KeyRow[]; label?: string }) {
  return (
    <dl className="ds-keyrows" aria-label={label}>
      {rows.map((r) => (
        <div key={r.key} className="ds-keyrow">
          <dt>{r.key}</dt>
          <dd>
            {r.value}
            {r.source && <span className="ds-src">{r.source}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
