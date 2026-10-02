// The coverage tables' cells: a part's sections as links to their anchors, the states it shows, the
// required states it still owes, in red, so a short row reads as a gap without a legend, and the owed states
// that do not apply to it, quiet, as n/a.
import type { ReactNode } from "react";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { COVERAGE_COLUMNS, partCells, type PartRow } from "./coverage-data";
import s from "./meta.module.css";

function Sections({ list }: { list: { id: string; title: string }[] }) {
  return list.map((sec, i) => (
    <span key={sec.id}>
      {i > 0 && ", "}
      <a className={s["ds-mt-link"]} href={`#${sec.id}`}>
        {sec.title}
      </a>
    </span>
  ));
}

function Owed({ owed, missing, na }: { owed: string; missing: string[]; na: string[] }): ReactNode {
  if (!owed) return <span className={s["ds-mt-quiet"]}>not a control</span>;
  return (
    <>
      {owed}
      {missing.length > 0 && <span className={s["ds-mt-owed"]}>{`no ${missing.join(", ")}`}</span>}
      {na.length > 0 && <span className={s["ds-mt-na"]}>{`n/a ${na.join(", ")}`}</span>}
    </>
  );
}

export function PartTable({ rows, caption }: { rows: readonly PartRow[]; caption: string }) {
  const body = rows.map((r) => {
    const c = partCells(r);
    return [
      c.part,
      c.source,
      <Sections key="s" list={c.sections} />,
      c.variants || <span className={s["ds-mt-quiet"]}>none listed</span>,
      c.states.length ? c.states.join(" ") : <span className={s["ds-mt-quiet"]}>none listed</span>,
      <Owed key="o" owed={c.owed} missing={c.missing} na={c.na} />,
      c.ships || <span className={s["ds-mt-quiet"]}>guide only</span>,
    ];
  });
  return <SpecTable caption={caption} columns={COVERAGE_COLUMNS} rows={body} mono={[0, 1]} minWidth={980} />;
}
