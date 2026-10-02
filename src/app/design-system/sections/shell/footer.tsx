import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import * as D from "./footer-data";
import { Cell } from "./shell-common";

const SRC = { from: "@/components/website/Footer", name: "Footer" };

export function FooterSection() {
  return (
    <Section
      id="footer"
      lead="The foot of both pages: the lockup and its line, the Explore links and Back to top, the giant wordmark band, then the tail. It lives in a frame because the word is sized to the viewport and its picture switches at viewport widths."
    >
      <Spec
        title="Footer"
        source={{ ...SRC, line: 24 }}
        chips={["CopyLine", "CopyLinePicture"]}
        role="A shade darker than the closing section, so the page ends on a ground of its own with the noise still showing."
        note="The band's picture is multiplied into the ground and faded round the word on its own canvas, so no blend mode or mask is ever on screen."
        drawer={{ values: D.FOOTER_VALUES, code: D.FOOTER_CODE }}
      >
        <Anatomy frame layout="stack" ground="page" pins={D.FOOTER_PINS} label="Footer anatomy">
          <ViewportPreview part="footer" title="Footer" height={480} widths={D.FOOTER_WIDTHS} width={1440} fitHeight />
        </Anatomy>
        <KeyRows label="Compositions by width" rows={D.COMPOSITIONS} />
      </Spec>

      <Spec
        title="Links and Back to top"
        source={{ ...SRC, line: 60 }}
        role="Footer links sit muted and turn accent on hover, while Back to top keeps the ink so it reads as the one action here."
      >
        <StateGrid
          label="Footer links, live"
          states={[]}
          liveCaption="hover the links or Back to top"
          render={() => (
            <Cell>
              <ViewportPreview
                part="footer"
                title="Footer links"
                interactive
                height={900}
                widths={[1440]}
                crop={{ x: 0, y: 0, width: 1440, height: 260 }}
              />
            </Cell>
          )}
        />
        <KeyRows label="Link states" rows={D.FOOTER_LINK_STATES} />
      </Spec>
    </Section>
  );
}
