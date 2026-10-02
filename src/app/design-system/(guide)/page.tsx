// The guide page: every section in catalog order, grouped as the nav groups them. Each group opens on its
// title (Outfit 38, a step above the section titles, and a level-2 heading, so heading navigation stops
// there) and one lead, and a sub-label (Actions, Inputs, The floor and so on) prints over the first section
// of its run in the 12px caps, as the sidebar prints it. A server
// component prerendered at build (force-static), so the source scans run once, then and there, and the page
// refuses to build on a catalog, token or source problem.
import { Fragment } from "react";
import { tokenProblems } from "@/components/design-system/tokens";
import { GROUPS, catalogProblems } from "../_data/catalog";
import { sourceProblems } from "../_data/catalog-check";
import { ExportLines } from "../_kit/ExportLines";
import { specLines } from "../_kit/spec-lines";
import { SECTION_COMPONENTS } from "../sections/registry";

export const dynamic = "force-static";

export default function DesignSystemPage() {
  const problems = [...catalogProblems(), ...tokenProblems(), ...sourceProblems()];
  if (problems.length > 0) throw new Error(`design-system catalog: ${problems.join(", ")}`);

  return (
    <ExportLines lines={specLines()}>
      {GROUPS.map((group, i) => (
        <div key={group.id} id={group.id} className="ds-group">
          {i > 0 && (
            <>
              <p className="ds-group-label" role="heading" aria-level={2}>
                {group.title}
              </p>
              <p className="ds-group-lead">{group.lead}</p>
            </>
          )}
          {group.sections.map((s, k) => {
            const Body = SECTION_COMPONENTS[s.id];
            const opensRun = s.sub && s.sub !== group.sections[k - 1]?.sub;
            return (
              <Fragment key={s.id}>
                {opensRun && <p className="ds-h4 ds-run-label">{s.sub}</p>}
                <Body />
              </Fragment>
            );
          })}
        </div>
      ))}
    </ExportLines>
  );
}
