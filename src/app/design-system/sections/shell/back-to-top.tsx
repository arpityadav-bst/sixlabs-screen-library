import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { frameHref } from "@/app/design-system/frame/_parts/ids";
import { BackButtonSpecimen } from "./shell-live";
import * as D from "./back-to-top-data";
import { Cell, Shot } from "./shell-common";

const BACK = { from: "@/components/website/BackToTop", name: "BackToTop" };
const CUE = { from: "@/components/website/ScrollCue", name: "ScrollCue" };

export function BackToTopSection() {
  return (
    <Section
      id="back-to-top"
      lead="Two quiet aids to moving through the page: a round button that takes the reader home from the players on, and a cue under the hero that says the page goes on."
    >
      <Spec
        title="Back to top"
        source={{ ...BACK, line: 13 }}
        role="A small white button in the corner that appears only once the reader is deep in the page, then glides them back."
        note="The frame is live: hover the button to see the lift."
        drawer={{ values: D.BACK_VALUES, code: D.BACK_CODE }}
      >
        <Anatomy frame layout="stack" ground="page" pins={D.BACK_PINS} gutter={56} label="Back to top anatomy">
          <ViewportPreview
            part="back-to-top"
            title="Back to top, shown"
            interactive
            height={220}
            widths={[1280]}
            crop={D.BACK_CROP}
          />
        </Anatomy>
      </Spec>

      <Spec
        title="When it shows"
        source={{ ...BACK, line: 23 }}
        role="On a desktop it stays from the players down. On a phone it shows only while the reader scrolls back up."
      >
        <StateGrid
          label="Back to top visibility"
          states={D.BACK_STATES}
          variants={D.BACK_VARIANTS}
          live={false}
          minCell={160}
          render={({ state, variant }) => {
            if (state === "live") return null;
            const c = D.BACK_CELLS[variant][state];
            return (
              <Cell>
                <ViewportPreview
                  src={frameHref(c.part, c.query)}
                  title={`Back to top, ${variant}, ${state}`}
                  height={c.height}
                  widths={[c.width]}
                  crop={c.crop}
                />
              </Cell>
            );
          }}
        />
        <KeyRows label="Visibility and press" rows={D.BACK_RULES} />
      </Spec>

      <DoDont>
        <Do reason="The floating button crosses the accent water, so it carries its own white ground and shadow." ground="on-blue">
          <BackButtonSpecimen variant="elevated" />
        </Do>
        <Dont reason="A bare navy arrow on the water reads as part of the picture, with no edge to aim a thumb at." ground="on-blue">
          <BackButtonSpecimen variant="ghost" />
        </Dont>
      </DoDont>

      <Spec
        title="Scroll cue"
        source={{ ...CUE, line: 8 }}
        role="A small caps label over a bobbing arrow under the hero, gone as soon as the reader has scrolled 40px."
        note="It is decorative and hidden from assistive tech, so it is never a control."
        drawer={{ values: D.CUE_VALUES }}
      >
        <Anatomy frame layout="stack" ground="page" pins={D.CUE_PINS} gutter={56} label="Scroll cue anatomy">
          <ViewportPreview part="scroll-cue" title="Scroll cue, present" height={120} widths={[320]} />
        </Anatomy>
        <Canvas ground="page" layout="stack" label="Scroll cue, away">
          <Shot label="away · scrollY over 40 · opacity 0">
            <ViewportPreview part="scroll-cue-away" title="Scroll cue, away" height={120} widths={[320]} />
          </Shot>
        </Canvas>
      </Spec>
    </Section>
  );
}
