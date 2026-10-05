import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import crop from "@/app/design-system/_kit/crop.module.css";
import { Understands } from "@/components/website/Understands";
import { COMPARISON_PINS, COMPARISON_VALUES } from "./comparison-data";
import { SketchPair, type SketchTone } from "./comparison-sketch";

const SRC = { from: "@/components/website/Understands", name: "Understands" };
const SKETCH = "sketch at the shipped proportions";

function Sketch({ tones, subgrid, flat }: { tones: readonly [SketchTone, SketchTone]; subgrid?: boolean; flat?: boolean }) {
  return (
    <Item label={SKETCH} align="start">
      <SketchPair tones={tones} subgrid={subgrid} flat={flat} />
    </Item>
  );
}

export function ComparisonSection() {
  return (
    <Section id="comparison" lead="ChatGPT and 6labs side by side as the site ships them, two cards that share their rows and a vs that joins them.">
      <Spec
        title="Comparison pair"
        source={SRC}
        role="The one place the page argues with a rival, so each line sits level with its counterpart and reads across."
        caption="direct mount on the grain, top padding cropped · each line in its card's one ink · Replay runs the rise again"
        drawer={{ values: COMPARISON_VALUES }}
        note={
          <>
            Whether the full navy card and the missing accent word meet the one-accent rule is an open question
            under <SectionLink id="decisions" />.
          </>
        }
      >
        <Anatomy ground="grain" layout="stack" pins={COMPARISON_PINS} label="Comparison anatomy">
          <Replay>
            <div className={crop["ds-crop"]}>
              <Understands />
            </div>
          </Replay>
        </Anatomy>
      </Spec>
      <Spec
        title="Across widths"
        source={SRC}
        role="On a phone the pair becomes one column and the vs moves onto the seam between the cards."
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview part="section-understands" title="Comparison section" height={640} widths={[375, 768, 1280, 1440]} width={1280} fitHeight />
        </Canvas>
      </Spec>
      <DoDont>
        <Do layout="stack" reason="Make each name its card's heading and the two lines its body, so the eye takes the rival first, then the claim.">
          <Sketch tones={["container", "navy"]} />
        </Do>
        <Dont layout="stack" reason="Lines set at the names' size compete with them, so nothing leads and every line reads as a heading.">
          <Sketch tones={["container", "navy"]} flat />
        </Dont>
      </DoDont>
      <DoDont>
        <Do layout="stack" reason="Set the two sides on two grounds, the ChatGPT card's grey and the navy, so the eye takes a side at once.">
          <Sketch tones={["container", "navy"]} />
        </Do>
        <Dont layout="stack" reason="Two white cards read as two of the same, and the comparison has to be read word by word.">
          <Sketch tones={["white", "white"]} />
        </Dont>
      </DoDont>
      <DoDont>
        <Do layout="stack" reason="Share the rows on a subgrid, so the longer first line pushes both second lines down together.">
          <Sketch tones={["container", "navy"]} />
        </Do>
        <Dont layout="stack" reason="Two loose columns let each card wrap on its own, so the second lines drift apart and stop reading across.">
          <Sketch tones={["container", "navy"]} subgrid={false} />
        </Dont>
      </DoDont>
    </Section>
  );
}
