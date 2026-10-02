// A reference table (loops, micro-interactions, breakpoints). It scrolls sideways inside its own box on
// phones, so the page never does, and that box takes a tab stop while it scrolls (ScrollBox). Rows come from a
// _data module, never inline literals. A `stack` table (the values drawer) turns each row into a block under
// 600px instead, the first cell as its label and every other cell under its column name, as the key rows do.
// Its roles are written out, because a table drawn as blocks loses them in some browsers.
import type { ReactNode } from "react";
import { ScrollBox } from "./ScrollBox";

export type SpecTableProps = {
  columns: readonly string[];
  rows: readonly (readonly ReactNode[])[];
  /** column indexes set in mono (names, tokens, values) */
  mono?: readonly number[];
  /** the table's accessible name */
  caption?: string;
  /** a floor for the table's width before it scrolls, in px */
  minWidth?: number;
  /** stack the rows as blocks under 600px */
  stack?: boolean;
};

const empty = (cell: ReactNode) => cell === "" || cell === null || cell === undefined || cell === false;

export function SpecTable({ columns, rows, mono = [], caption, minWidth, stack }: SpecTableProps) {
  const role = <T extends string>(r: T) => (stack ? r : undefined);
  return (
    <ScrollBox className="ds-table-wrap" label={caption ?? columns.join(", ")}>
      <table
        className={stack ? "ds-table ds-table--stack" : "ds-table"}
        style={minWidth ? { minWidth } : undefined}
        role={role("table")}
      >
        {caption && <caption className="ds-sr">{caption}</caption>}
        <thead role={role("rowgroup")}>
          <tr role={role("row")}>
            {columns.map((c) => (
              <th key={c} scope="col" role={role("columnheader")}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role={role("rowgroup")}>
          {rows.map((row, i) => (
            <tr key={i} role={role("row")}>
              {row.map((cell, j) => (
                <td key={j} className={mono.includes(j) ? "ds-mono" : undefined} role={role("cell")}>
                  {stack && j > 0 && !empty(cell) && (
                    <span className="ds-table-label" aria-hidden="true">
                      {columns[j]}
                    </span>
                  )}
                  {empty(cell) ? null : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollBox>
  );
}
