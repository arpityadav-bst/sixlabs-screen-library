// States as columns, variants as rows, every cell a live instance. A forced cell is rendered with
// force set to its state and sits in a wrapper carrying data-ds-state="<state>", so a part can take the
// state from its forceState prop or from that attribute in its CSS. Forced cells are inert: they are
// pictures of a state, out of the tab order and deaf to the pointer, so they never fight the real one.
// Each carries a screen-reader line outside the inert box ("primary, hover"), so a reader walking the
// table hears what the picture shows. That box is Forced (Forced.tsx), which a forced specimen outside a
// grid wears too. The live column renders the part free, to hover, press or Tab into.
// Its box scrolls sideways on a phone with the row heads held at the left, and takes a tab stop while it
// scrolls (ScrollBox). Works in server and client sections alike, because it holds no state of its own.
import type { ReactNode } from "react";
import { Canvas, type Ground } from "./Canvas";
import { Forced } from "./Forced";
import { ScrollBox } from "./ScrollBox";

export type StateGridCell<S extends string, V extends string> = {
  /** the column: a state, or "live" for the free instance */
  state: S | "live";
  /** the row, the empty string in a grid with no variants */
  variant: V;
  /** the state to force (pass it as forceState), undefined in the live cell */
  force?: S;
};

export type StateGridProps<S extends string, V extends string> = {
  states: readonly S[];
  /** the rows. Leave it out for a single row with no row header. */
  variants?: readonly V[];
  /** one cell's instance */
  render: (cell: StateGridCell<S, V>) => ReactNode;
  /** adds the live column (on by default) */
  live?: boolean;
  /** the live cell's caption */
  liveCaption?: string;
  ground?: Ground;
  /** the table's accessible name */
  label: string;
  /** a column's least width, px */
  minCell?: number;
  isolateKeys?: boolean;
};

/** One row of the grid: its variant, or none for a grid of states alone. */
type Row<V extends string> = { key: string; variant?: V };

export function StateGrid<S extends string, V extends string = string>({
  states,
  variants,
  render,
  live = true,
  liveCaption = "hover or Tab here",
  ground = "page",
  label,
  minCell = 120,
  isolateKeys,
}: StateGridProps<S, V>) {
  const rows: Row<V>[] = variants ? variants.map((v) => ({ key: v, variant: v })) : [{ key: "row" }];
  const named = !!variants;
  const cols = states.length + (live ? 1 : 0);
  const minWidth = cols * minCell + (named ? 120 : 0);
  // a grid without variants has one row with no variant, which its render receives as the empty string
  const cell = (state: S | "live", row: Row<V>, force?: S) =>
    render({ state, variant: (row.variant ?? "") as V, ...(force ? { force } : {}) });

  return (
    <Canvas ground={ground} layout="bleed" isolateKeys={isolateKeys}>
      <ScrollBox className="ds-sg-wrap" label={label}>
        <table className="ds-sg" style={{ minWidth }} aria-label={label}>
          <thead>
            <tr>
              {named && <td className="ds-sg-corner" />}
              {states.map((s) => (
                <th key={s} scope="col">
                  <span className="ds-sg-head">{s}</span>
                </th>
              ))}
              {live && (
                <th scope="col" className="ds-sg-livehead">
                  <span className="ds-sg-head">live</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                {named && (
                  <th scope="row" className="ds-sg-variant">
                    <span className="ds-sg-head">{row.variant}</span>
                  </th>
                )}
                {states.map((s) => (
                  <td key={s}>
                    <Forced state={s} label={row.variant} className="ds-sg-cell">
                      {cell(s, row, s)}
                    </Forced>
                  </td>
                ))}
                {live && (
                  <td className="ds-sg-livecell">
                    <div className="ds-sg-cell">{cell("live", row)}</div>
                    <p className="ds-label">{liveCaption}</p>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollBox>
    </Canvas>
  );
}
