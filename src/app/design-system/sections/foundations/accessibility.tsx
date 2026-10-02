// Accessibility baseline: target sizes measured on real parts, the keyboard model per pattern, and the
// semantics rules. Contrast and focus have their own sections, the site's misses live in Meta.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { BURGER_PINS, KEY_COLUMNS, KEY_ROWS, SEMANTIC_ROWS, TARGET_MIN, TARGET_TOUCH, TARGET_VALUES } from "./accessibility-data";
import { SiteTargets, SystemTargets, TouchDo, TouchDont } from "./a11y-targets";

const LEGEND = `solid · the part's box   dotted · ${TARGET_MIN} minimum   dashed · ${TARGET_TOUCH} touch`;

export function AccessibilitySection() {
  return (
    <Section
      id="accessibility"
      lead="The floor every part stands on: targets a finger can hit, one keyboard model per pattern, roles that match what shows, and motion that stops on request."
    >
      <Sub title="Targets">
        <Spec
          title="Target size"
          level={4}
          chips={["WCAG 2.5.8", "WCAG 2.5.5"]}
          role="Every target clears 24px, and a control a thumb reaches first clears 44."
          caption={LEGEND}
          drawer={{ values: TARGET_VALUES }}
        >
          <SystemTargets />
        </Spec>
        <Spec
          title="Under 44 on the site"
          level={4}
          source={{ from: "@/components/website/PlayerCarousel", name: "PlayerCarousel" }}
          chips={["PlayerArrows", "WaveButton", "MobileMenu"]}
          role="The site's small controls, measured where they ship, so the distance to 44 is read off the part."
          caption={LEGEND}
        >
          <SiteTargets>
            <Anatomy frame pins={BURGER_PINS} layout="stack" label="The phone header's menu button">
              <ViewportPreview part="header-phone" title="Header on a phone" height={80} widths={[375]} />
            </Anatomy>
          </SiteTargets>
        </Spec>
        <DoDont>
          <Do reason="44 gives a thumb the whole box, so the one control on a phone row lands first time.">
            <TouchDo />
          </Do>
          <Dont reason="28 clears the 24 minimum, yet a touch-first control leaves a thumb 16px short.">
            <TouchDont />
          </Dont>
        </DoDont>
      </Sub>

      <Sub title="Keyboard">
        <Spec
          title="Keyboard models"
          level={4}
          role="Each pattern has one keyboard model, carried by one system part, so a key means the same thing everywhere."
        >
          <SpecTable caption="Keyboard model per pattern" columns={KEY_COLUMNS} rows={KEY_ROWS} mono={[3]} minWidth={760} />
        </Spec>
      </Sub>

      <Sub title="Semantics">
        <Spec
          title="Roles and names"
          level={4}
          role="What a screen reader hears matches what the page shows, in the same order and under the same names."
        >
          <KeyRows label="Semantics rules" rows={SEMANTIC_ROWS} />
        </Spec>
      </Sub>
    </Section>
  );
}
