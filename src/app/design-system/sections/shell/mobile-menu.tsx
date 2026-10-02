import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { MenuButtonSpecimen } from "./shell-live";
import * as D from "./mobile-menu-data";
import { Cell } from "./shell-common";

const SRC = { from: "@/components/website/MobileMenu", name: "MobileMenu" };
// the sheet and a band of veil under it
const CROP = { x: 0, y: 0, width: 375, height: 520 };

export function MobileMenuSection() {
  return (
    <Section
      id="mobile-menu"
      lead="The phone's sheet under the bar: the tabs as large rows, the language and the call to action. It exists only below 768."
    >
      <Spec
        title="Mobile menu"
        source={{ ...SRC, line: 20 }}
        props="links"
        role="Below 768 the four tabs become thumb-sized rows in a white sheet, and the page under the veil holds still."
        note="This frame is live: tap the X, the veil or the language row. Under ClickLock a row does not close the sheet, and a language chosen here resets when it reopens."
        drawer={{ values: D.MENU_VALUES, props: D.MENU_PROPS, code: D.MENU_CODE }}
      >
        <Anatomy frame layout="stack" ground="container" pins={D.MENU_PINS} label="Mobile menu anatomy">
          <ViewportPreview part="menu-open" title="Mobile menu, open" interactive height={720} widths={[375]} />
        </Anatomy>
      </Spec>

      <Spec
        title="Menu states"
        source={{ ...SRC, line: 48 }}
        role="Closed it is one round button in the bar. Open it adds the veil and the sheet together, and the icon turns to an X."
      >
        <StateGrid
          label="Mobile menu states"
          ground="container"
          states={D.MENU_STATES}
          live={false}
          minCell={240}
          render={({ state }) => (
            <Cell>
              <ViewportPreview
                part={state === "open" ? "menu-open" : "header-phone"}
                title={`Mobile menu, ${state}`}
                height={720}
                widths={[375]}
                crop={CROP}
              />
            </Cell>
          )}
        />
        <KeyRows label="Motion and behaviour" rows={D.MENU_BEHAVIOUR} />
      </Spec>

      <DoDont>
        <Do reason="The menu button is a phone's only way to the sections, so it takes the full 44px touch target." ground="page">
          <MenuButtonSpecimen size="lg" />
        </Do>
        <Dont reason="A 32px target is easy to miss with a thumb. The shipped button is 40, which the gaps list tracks." ground="page">
          <MenuButtonSpecimen size="sm" />
        </Dont>
      </DoDont>
    </Section>
  );
}
