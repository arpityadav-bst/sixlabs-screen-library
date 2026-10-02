"use client";

// The section list, built only from the catalog, so its labels and order are the page's. Used twice: in
// the sticky sidebar and in the phone drawer. The current link carries aria-current and a 2px navy bar,
// and is kept in view inside the list's own scroll as the reader moves down the page. The brand goes to the
// guide's own top, and a small link under it leaves for the Screen Library at /.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { GROUPS, SECTION_IDS, type CatalogSection } from "../_data/catalog";
import { useCurrentSection } from "./spy";

/** Consecutive sections that share a sub-label, so each sub-label prints once above its run. */
function runs(sections: readonly CatalogSection[]) {
  const out: { sub?: string; items: CatalogSection[] }[] = [];
  for (const s of sections) {
    const last = out[out.length - 1];
    if (last && last.sub === s.sub) last.items.push(s);
    else out.push({ sub: s.sub, items: [s] });
  }
  return out;
}

export function Nav({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const current = useCurrentSection();
  const box = useRef<HTMLElement>(null);

  // keep the current link visible inside whichever box scrolls the list (the sidebar or the drawer)
  useEffect(() => {
    const nav = box.current;
    const scroller = nav?.parentElement;
    const link = nav?.querySelector<HTMLElement>("[aria-current]");
    if (!scroller || !link) return;
    const l = link.getBoundingClientRect();
    const b = scroller.getBoundingClientRect();
    if (l.top < b.top + 64 || l.bottom > b.bottom - 48) scroller.scrollTop += l.top - b.top - b.height / 3;
  }, [current]);

  return (
    <nav ref={box} className="ds-nav" aria-label="Design system sections">
      <a
        href="#ds-content"
        className="ds-brand"
        onClick={onNavigate ? () => onNavigate(SECTION_IDS[0]) : undefined}
      >
        6labs <span>design system</span>
      </a>
      <Link href="/" className="ds-nav-home">
        Screen Library
      </Link>
      {GROUPS.map((group) => (
        <div key={group.id}>
          <p className="ds-nav-group">{group.title}</p>
          {runs(group.sections).map((run) => (
            <div key={run.items[0].id}>
              {run.sub && <p className="ds-nav-sub">{run.sub}</p>}
              <ul className="ds-nav-list">
                {run.items.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="ds-nav-link"
                      aria-current={s.id === current ? "location" : undefined}
                      onClick={onNavigate ? () => onNavigate(s.id) : undefined}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
