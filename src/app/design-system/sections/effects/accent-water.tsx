// Accent water: the real accentWaveGL on a panel canvas with its level under the reader's hand, the event
// contract the header and the players listen to, and the band decision. AccentWave itself is fixed,
// full-viewport and scroll-bound, and the guide never mounts it.
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { BandPanel, WaterSpec } from "./accent-water-live";
import { WATER, WATER_EVENTS } from "./accent-water-data";

export function AccentWaterSection() {
  return (
    <Section
      id="accent-water"
      lead="The site's one accent fill: a halftone tide that rises over the scroll line, carries the players, then drains as the light page comes back."
    >
      <Sub title="The water">
        <WaterSpec />
        <Spec
          title="Event contract"
          level={4}
          source={{ from: "@/components/website/AccentWave", name: "AccentWave" }}
          role="The header and the players wait on one event from the water, so the takeover and what it carries arrive together."
        >
          <KeyRows label="Accent water events and rules" rows={WATER_EVENTS} />
        </Spec>
      </Sub>

      <Sub title="The band">
        <DoDont>
          <Do
            layout="stack"
            reason={`The ${WATER.band}px band grows specks into the solid over most of a screen, so the blue reads as water rising.`}
          >
            <BandPanel band={WATER.band} />
          </Do>
          <Dont layout="stack" reason="A short band turns the edge into a stripe, and the blue reads as a panel sliding up.">
            <BandPanel band={120} />
          </Dont>
        </DoDont>
      </Sub>
    </Section>
  );
}
