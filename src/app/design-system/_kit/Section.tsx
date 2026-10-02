// A guide section: the element the nav links to and the scroll spy watches. Its title and DESIGN.md
// chapter come from the catalog by id, so the h2, the nav label and the chapter link cannot disagree.
// The chapter link opens DESIGN.md (at the repo root) on GitHub at the heading that holds the reasons, so the
// prose lives once, there, and a browser reader can still reach the why. Its anchor ("DESIGN.md#71-button")
// comes from tools/design-md/slug.mjs, the one rule the build writes its headings with. The section is a
// plain section, not a named region, so the eighty of them do not flood the landmarks list. Its h2 takes
// focus after a jump (tabIndex -1). SectionLink is the checked way for one section to point at another.
import type { ReactNode } from "react";
import { numberedAnchor } from "../../../../tools/design-md/slug.mjs";
import { sectionById, type SectionId } from "../_data/catalog";

/** DESIGN.md as the repo serves it (github.com/arpityadav-bst/sixlabs-screen-library, branch main). */
export const DESIGN_MD_URL = "https://github.com/arpityadav-bst/sixlabs-screen-library/blob/main/DESIGN.md";

export function Section({ id, lead, children }: { id: SectionId; lead?: ReactNode; children?: ReactNode }) {
  const s = sectionById(id);
  const heading = s.designMd.includes(".") ? s.title : (s.designMdTitle ?? s.title);
  return (
    <section id={id} className="ds-section">
      <div className="ds-section-head">
        <h2 id={`${id}-h`} className="ds-h2" tabIndex={-1}>
          {s.title}
        </h2>
        <a
          className="ds-chip ds-chip--link"
          href={`${DESIGN_MD_URL}#${numberedAnchor(s.designMd, heading)}`}
          target="_blank"
          rel="noreferrer"
        >
          {`DESIGN.md ${s.designMd}`}
          <span className="ds-sr"> (the reasons, on GitHub, in a new tab)</span>
        </a>
      </div>
      {lead && <p className="ds-lead">{lead}</p>}
      {children}
    </section>
  );
}

/** A link to another section, its text the section's title from the catalog unless given, its id checked by
 *  tsc, so a cross-link can never point at nothing or name a section by an old title. */
export function SectionLink({ id, children }: { id: SectionId; children?: ReactNode }) {
  return <a href={`#${id}`}>{children ?? sectionById(id).title}</a>;
}

/** One component or topic inside a section: an h3 (Outfit 20/28), an optional lead, then its specs. */
export function Sub({ title, lead, children }: { title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <div className="ds-sub">
      <h3 className="ds-h3">{title}</h3>
      {lead && <p className="ds-sub-lead">{lead}</p>}
      {children}
    </div>
  );
}

/** A sub-part label (Inter 12/16 caps): "Sizes", "States", "On blue". */
export function PartLabel({ children }: { children: ReactNode }) {
  return <h4 className="ds-h4">{children}</h4>;
}
