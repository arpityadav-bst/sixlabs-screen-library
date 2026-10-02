// Page composition: the whole page as a sequence of grounds, what the shell does in each stretch, the two
// pages side by side and the rules a new page keeps. The reasons live in DESIGN.md 9.5.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { PAGE_CODE, PAGE_RULES, PAGES_COLUMNS, PAGES_ROWS, STRETCHES, TWO_WATERS } from "./composition-data";
import { Strip } from "./composition-strip";
import s from "./composition.module.css";

const SRC = { from: "@/app/website/page", name: "WebsitePage", file: "page.tsx" };

const STRETCH_COLUMNS = ["Stretch", "Height", "Header", "Glyph field", "Snap", "Back to top", "Source"] as const;
const STRETCH_ROWS = STRETCHES.map((t) => [t.name, t.height, t.header, t.ascii, t.snap, t.back, t.source]);

export function PageSection() {
  return (
    <Section
      id="page"
      lead="The page is one sequence: a light first screen, the scroll line, the water and the players, then the grained light page to the foot. The shell changes with each stretch."
    >
      <Spec
        title="Rhythm map"
        source={SRC}
        role="Light, water, light: the one blue stretch sits in the middle, so the page opens and closes on the same ground."
        caption="/website top to bottom, read left to right · each stretch sized by the screens it lasts"
        drawer={{ code: PAGE_CODE }}
      >
        <Canvas ground="surface" label="The page as a strip">
          <Strip segments={STRETCHES} label="The stretches of /website" />
        </Canvas>
        <SpecTable caption="What the shell does in each stretch" columns={STRETCH_COLUMNS} rows={STRETCH_ROWS} mono={[6]} minWidth={880} />
      </Spec>

      <Spec
        title="Two pages"
        source={{ from: "@/app/6labs-fullview/page", name: "FullviewPage", file: "page.tsx" }}
        role="The two pages differ only in their first screen, so a change from the line down lands on both."
      >
        <SpecTable caption="/website and /6labs-fullview" columns={PAGES_COLUMNS} rows={PAGES_ROWS} mono={[3]} minWidth={720} />
      </Spec>

      <Spec
        title="Page rules"
        source={SRC}
        role="A new page keeps these, because each one is what makes the next stretch read as part of the same page."
      >
        <KeyRows label="Page rules" rows={PAGE_RULES} />
      </Spec>

      <DoDont>
        <Do reason="One blue stretch makes the water an event, and the light either side frames it." layout="stack">
          <div className={s["ds-strip-wrap"]}>
            <Strip segments={STRETCHES} label="One water" />
          </div>
        </Do>
        <Dont reason="A second blue stretch turns the event into a theme, and the players lose the ground that was theirs." layout="stack">
          <div className={s["ds-strip-wrap"]}>
            <Strip segments={TWO_WATERS} label="Two waters" />
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
