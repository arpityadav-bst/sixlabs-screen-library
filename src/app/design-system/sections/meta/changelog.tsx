// Changelog: what changed and when, newest first, one dated entry per change set, read from DESIGN.md's
// changelog partial so the two never disagree.
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { CHANGELOG_MD, ENTRY_CODE, entries } from "./changelog-data";
import s from "./meta.module.css";

export function ChangelogSection() {
  const list = entries();
  return (
    <Section id="changelog" lead="What changed and when, newest first.">
      <Spec
        title="Entries"
        source={{ from: "@/app/design-system/sections/meta/changelog-data", name: "entries", file: "changelog-data.ts" }}
        chips={[CHANGELOG_MD]}
        role="One dated entry per change set, read from DESIGN.md's changelog, so a reader can tell what a screenshot of the guide predates."
        drawer={{ label: "Adding an entry", code: ENTRY_CODE }}
      >
        <ol className={s["ds-cl-list"]}>
          {list.map((e) => (
            <li key={e.date + e.title} className={s["ds-cl-entry"]}>
              <time className={s["ds-cl-date"]} dateTime={e.date}>
                {e.date}
              </time>
              <div>
                <h4 className={s["ds-cl-title"]}>{e.title}</h4>
                <ul className={s["ds-cl-items"]}>
                  {e.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Spec>
    </Section>
  );
}
