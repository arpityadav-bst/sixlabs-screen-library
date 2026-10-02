// Button: the shipped Try now first, as the site ships it, then the system Button that reproduces it as a
// working control and widens it into a family. The prose lives in DESIGN.md 7.1.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { CTA_CODE, CTA_PINS, CTA_STATE_ROWS, CTA_VALUES, SWEEP_CODE, SWEEP_VALUES } from "./button-data";
import { ButtonMatrix, ButtonSizes, ButtonStates } from "./button-matrix";
import { ButtonAnatomy, ButtonDecisions, ButtonGroupSpec, ButtonSlots } from "./button-slots";
import { SweepStrip } from "./button-sweep-strip";

const CTA = { from: "@/components/website/PrimaryCta", name: "PrimaryCta", at: "<motion.button" };

export function ButtonSection() {
  return (
    <Section
      id="button"
      lead="The page's one call to action as it ships, then the system Button that carries the same pill into every variant, size and state."
    >
      <Sub title="Try now">
        <Spec
          level={4}
          title="Try now"
          source={CTA}
          props="children"
          role="The hero and the closing call share one navy pill, so the visitor learns the next step once."
          caption="xl · min-w 220 · hover and press are live"
          drawer={{ values: CTA_VALUES, code: CTA_CODE }}
          note="Try now has no onClick or href, which is why the system Button exists beside it."
        >
          <Anatomy pins={CTA_PINS} ground="container" label="Try now anatomy">
            <span data-pin="cta">
              <PrimaryCta>Try now</PrimaryCta>
            </span>
          </Anatomy>
          <Canvas ground="page" label="Try now on the page">
            <PrimaryCta>Try now</PrimaryCta>
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Try now states"
          source={CTA}
          role="Its hover runs on motion values, so the states are read live here and listed with their values."
        >
          <Canvas ground="container" label="Try now, live">
            <Item label="live · hover or press here">
              <PrimaryCta>Try now</PrimaryCta>
            </Item>
          </Canvas>
          <KeyRows label="Try now per state" rows={CTA_STATE_ROWS} />
        </Spec>
        <Spec
          level={4}
          title="The dot band"
          source={{ from: "@/components/website/CtaDots", name: "CtaDots" }}
          props="t opacity size band"
          role="The band bows like the pill's end as it enters and leaves, so the light seems to wrap the pill."
          caption="the band alone, three stills of the 1s run · band 34 · opacity 0.75 · no shifted fill or label"
          drawer={{ values: SWEEP_VALUES, code: SWEEP_CODE }}
        >
          <Canvas ground="page" label="The dot band at three moments">
            <SweepStrip />
          </Canvas>
        </Spec>
      </Sub>
      <Sub title="Button">
        <ButtonAnatomy />
        <ButtonMatrix />
        <ButtonStates />
        <ButtonSizes />
        <ButtonSlots />
        <ButtonGroupSpec />
        <ButtonDecisions />
      </Sub>
    </Section>
  );
}
