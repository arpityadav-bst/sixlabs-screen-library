// Principles: the eight rules the rest of the guide enforces, each linked to the section that shows it
// held, then the navy state rule taught as a Do / Don't on the system Segmented.
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { sectionById } from "@/app/design-system/_data/catalog";
import { StatePair } from "./principles-pair";
import { PRINCIPLES } from "./principles-data";
import s from "./start.module.css";

export function PrinciplesSection() {
  return (
    <Section id="principles" lead="Eight rules. Every later section either applies one or checks that the site still keeps it.">
      <Spec
        title="The eight rules"
        source={{ from: "@/app/design-system/sections/start/principles-data", name: "PRINCIPLES", file: "principles-data.ts" }}
        role="Each rule points at the section that enforces it, so no rule stands without a place where it is checked."
      >
        <ol className={s["ds-pr-list"]}>
          {PRINCIPLES.map((p, i) => {
            const at = sectionById(p.at);
            return (
              <li key={p.title} className={s["ds-pr-item"]}>
                <span className={s["ds-pr-n"]} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className={s["ds-pr-title"]}>{p.title}</h4>
                  <p className={s["ds-pr-rule"]}>{p.rule}</p>
                  <a className={`ds-chip ${s["ds-pr-link"]}`} href={`#${at.id}`}>
                    {`${at.groupTitle} · ${at.title}`}
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </Spec>

      <StatePair />
    </Section>
  );
}
