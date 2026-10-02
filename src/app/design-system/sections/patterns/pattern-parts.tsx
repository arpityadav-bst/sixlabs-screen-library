// Small server parts the pattern sections share. Bom is a composition's bill of materials: each part, its
// job in this composition and a link to the section that specs it, so a pattern points at its parts rather
// than mounting them twice. A part the site writes inline is named as markup, with the system part that does
// the same job as a note under it. The link titles come from the catalog, so they always match the nav.
import { sectionById, type SectionId } from "@/app/design-system/_data/catalog";
import s from "./patterns.module.css";

export type BomItem = {
  /** the export name, as the source writes it */
  readonly part: string;
  /** its job in this composition */
  readonly job: string;
  /** the section that specs it */
  readonly at: SectionId;
  /** the system part that does the same job, when the site writes it inline */
  readonly note?: string;
};

export function Bom({ items, label }: { items: readonly BomItem[]; label: string }) {
  return (
    <ul className={s["ds-bom"]} aria-label={label}>
      {items.map((i) => (
        <li key={i.part} className={s["ds-bom-row"]}>
          <span className={`ds-chip ds-chip--static ${s["ds-bom-part"]}`}>{i.part}</span>
          <span className={s["ds-bom-job"]}>
            {i.job}
            {i.note && <span className={s["ds-bom-note"]}>{i.note}</span>}
          </span>
          <a className={`ds-chip ${s["ds-bom-link"]}`} href={`#${i.at}`}>
            {sectionById(i.at).title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** A quoted line with its accent words in the accent, for tables of shipped copy. */
export function Quote({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.includes(accent)) return <span className={s["ds-quote"]}>{text}</span>;
  const at = text.indexOf(accent);
  return (
    <span className={s["ds-quote"]}>
      {text.slice(0, at)}
      <span className={s["ds-quote-accent"]}>{accent}</span>
      {text.slice(at + accent.length)}
    </span>
  );
}

/** A link to another section of the guide, titled from the catalog so it always reads as the nav does.
 *  Swap for the kit's SectionLink when it lands. */
export function SecLink({ id }: { id: SectionId }) {
  return <a href={`#${id}`}>{sectionById(id).title}</a>;
}
