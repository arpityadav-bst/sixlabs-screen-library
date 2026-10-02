// Halftone, chromatic split, grain: the three treatments that recur with different values, each shown as
// one family. Every row links to the section that shows that instance live, so the values are listed
// here once and the specimens are not mounted twice.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { Label } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { sectionById } from "@/app/design-system/_data/catalog";
import { CopyLine } from "@/components/website/CopyLine";
import { CtaStill } from "./families-live";
import {
  CHROMAS,
  CHROMA_COLUMNS,
  CTA_PINS,
  GRAINS,
  GRAIN_COLUMNS,
  GRAIN_FADE,
  HALFTONES,
  HALFTONE_COLUMNS,
} from "./families-data";
import s from "./fx-live.module.css";

type Instance = (typeof HALFTONES)[number];

/** a family's rows: the name, its cells, the source, and a link to the section that shows it live */
function rows(list: readonly Instance[], link = true) {
  return list.map((i) => [
    i.name,
    ...i.cells,
    i.source,
    ...(link
      ? [
          i.at ? (
            <a key={i.at} className={s["ds-link"]} href={`#${i.at}`}>
              {sectionById(i.at).title}
            </a>
          ) : (
            ""
          ),
        ]
      : []),
  ]);
}

export function FamiliesSection() {
  return (
    <Section
      id="families"
      lead="Three treatments recur across the page with different values: halftone, chromatic split and grain. Each is one family here, with every instance it has."
    >
      <Sub title="Halftone">
        <Spec
          title="Halftone family"
          level={4}
          source={{ from: "@/components/website/CtaDots", name: "CtaDots" }}
          props="t opacity size band"
          role="Every halftone grows dots from specks to solid across a band, so the water, the sweep and the button read as one family."
          caption="the band alone, held at t 0.5 · opacity 0.75 · on a 220 × 50.5 stand-in pill, without the label or the shifted fill"
        >
          <Anatomy pins={CTA_PINS} ground="page" label="Try now dot band alone">
            <CtaStill />
          </Anatomy>
          <SpecTable caption="Halftone instances" columns={HALFTONE_COLUMNS} rows={rows(HALFTONES)} mono={[1, 2, 3, 4, 5]} minWidth={860} />
        </Spec>
      </Sub>

      <Sub title="Chromatic split">
        <Spec
          title="Chromatic family"
          level={4}
          source={{ from: "@/components/website/CopyLine", name: "CopyLine" }}
          chips={[".foot-word"]}
          role="The split shows only at an edge, a rim or a band, so a fringe marks where light bends and never tints a whole surface."
          caption="footer wordmark · #e89fa4 3px left · #9ed5dd 3px right · each gone by 16% of the word"
        >
          <Canvas ground="footer" layout="stack" label="Footer wordmark with its colour split">
            <CopyLine />
          </Canvas>
          <SpecTable caption="Chromatic split instances" columns={CHROMA_COLUMNS} rows={rows(CHROMAS)} mono={[1, 2, 4]} minWidth={860} />
        </Spec>
      </Sub>

      <Sub title="Grain">
        <Spec
          title="Grain family"
          level={4}
          source={{ from: "app/globals.css", name: ".page-grain", file: "globals.css", line: 214 }}
          role="Grain is drawn as alpha specks or mixed inside a canvas, so it darkens what is under it with no blend mode on screen."
        >
          <Canvas ground="grain" label="Page grain">
            <Label>{`.page-grain · 200px tile · opacity 0.045 · fades in over the first ${GRAIN_FADE}px`}</Label>
          </Canvas>
          <Canvas ground="on-blue" tall label="Players ground grain">
            <Label>{"on-blue · 160px grey tile at 7% · the water's grain, drawn once"}</Label>
          </Canvas>
          <SpecTable caption="Grain instances" columns={GRAIN_COLUMNS} rows={rows(GRAINS, false)} mono={[2, 3, 5]} minWidth={760} />
        </Spec>

        <DoDont>
          <Do reason={`The first ${GRAIN_FADE}px of the grain is its fade in, so a panel needs about 480px before the noise reads at full strength.`}>
            <div className={`page-grain ${s["ds-grain-box"]}`} style={{ height: 480 }} />
          </Do>
          <Dont reason="On a 120px panel the fade never finishes, and the grain is too faint to read.">
            <div className={`page-grain ${s["ds-grain-box"]}`} style={{ height: 120 }} />
          </Dont>
        </DoDont>
      </Sub>
    </Section>
  );
}
