// Overview: the guide's cover. The page's one h1 with the site's own typed word, the headline numbers in
// the site's own HeroNumbers (read from the catalog and the source scan at build, never typed), the site
// in one strip with the names the guide uses for it, one real spec panel with its parts pinned so a reader
// learns the panel once, and a door to each group.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";
import { HeroNumbers } from "@/components/website/HeroBits";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { TypedWord } from "@/components/website/TypedWord";
import { sectionById } from "@/app/design-system/_data/catalog";
import { entries } from "../meta/changelog-data";
import { groupDoors, headline } from "../meta/coverage-data";
import { STRETCHES } from "../patterns/composition-data";
import { Strip } from "../patterns/composition-strip";
import { CTA_CODE, CTA_PROPS, CTA_VALUES, GLOSSARY, HOWTO, SPEC_CODE, SPEC_PROPS } from "./overview-data";
import s from "./start.module.css";

const INK = "text-(--ds-color-ink)";

export function OverviewSection() {
  const h = headline();
  const doors = groupDoors();
  const updated = entries()[0]?.date;
  const glossary = GLOSSARY.map((g) => {
    const at = sectionById(g.at);
    return {
      key: g.term,
      value: (
        <>
          {g.means} <a href={`#${at.id}`}>{at.title}</a>
        </>
      ),
    };
  });
  const stats = [
    { value: String(h.components), label: ["Components"], tone: INK, live: false },
    { value: String(h.states), label: ["States shown"], tone: INK, live: false },
    { value: `${h.percent}%`, label: ["Coverage"], tone: INK, live: false },
  ];

  return (
    <>
      <header className={s["ds-ov-cover"]}>
        {updated && (
          <p className={s["ds-ov-eyebrow"]}>
            <SectionLink id="changelog">Updated {updated}</SectionLink>
          </p>
        )}
        <h1 className={s["ds-ov-title"]}>
          6labs design <TypedWord word="system" className="text-accent" />
        </h1>
        <p className={s["ds-ov-lede"]}>Every token, part and pattern of the site, rendered from its own components.</p>
        <div className={s["ds-ov-numbers"]}>
          <HeroNumbers stats={stats} ready left />
        </div>
      </header>

      <Section
        id="overview"
        lead={
          `${h.groups} groups and ${h.sections} sections. Shipped parts are imported from the site and new ones are built in ` +
          "its language, so both read the same, and the file chip tells them apart: one starting website/ or tiles/ is live " +
          "on the site, one starting design-system/ is a system addition. The written spec, DESIGN.md, sits at the repo root."
        }
      >
        <Spec
          title="The site in one view"
          source={{ from: "@/app/website/page", name: "WebsitePage", file: "page.tsx" }}
          role="Later sections call the site's stretches and parts by these names, so each name is met here once, before it is used."
          caption="/website top to bottom, read left to right · each name links to the section that owns it"
        >
          <Canvas ground="surface" label="The site as a strip">
            <Strip segments={STRETCHES} label="The stretches of /website" />
          </Canvas>
          <KeyRows label="The site's names" rows={glossary} />
        </Spec>

        <Spec
          title="How to read a spec"
          source={{ from: "@/app/design-system/_kit/Spec", name: "Spec" }}
          role="Each panel reads in three layers: the canvas at a glance, the role line in one sentence, the drawer for depth."
          drawer={{ props: SPEC_PROPS, code: SPEC_CODE }}
        >
          <Anatomy ground="page" layout="stack" view="anatomy" pins={HOWTO} label="The parts of a spec panel" gutter={48}>
            <div className={s["ds-ov-example"]} data-ds-howto="">
              <Spec
                title="Try now"
                level={4}
                source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}
                props="children"
                role="The hero's one call to action, a navy pill whose dot band runs across it on hover."
                caption="On the hero container, the ground it ships on"
                drawer={{ values: CTA_VALUES, props: CTA_PROPS, code: CTA_CODE }}
              >
                <Canvas ground="container">
                  <PrimaryCta>Try now</PrimaryCta>
                </Canvas>
              </Spec>
            </div>
          </Anatomy>
        </Spec>

        <Sub title="The groups" lead="Each group opens on its first section. The counts are read from the catalog and the section files at build.">
          <nav aria-label="Guide groups" className={s["ds-ov-doors"]}>
            {doors.map((d) => (
              <Card key={d.id} variant="clickable" as="a" href={`#${d.id}`}>
                <CardTitle as="h4">{d.title}</CardTitle>
                <CardBody>{d.names.join(", ")}</CardBody>
                <CardMeta start={`${d.sections} sections`} end={`${d.specs} specimens`} />
              </Card>
            ))}
          </nav>
        </Sub>
      </Section>
    </>
  );
}
