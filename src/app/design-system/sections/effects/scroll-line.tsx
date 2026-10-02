// Scroll line, liquid and floating tiles: section two runs on window scroll over a 390vh sticky track,
// so it is shown live in its own frame (the real ScrubLine, AccentWave, Players and Understands), with
// the word fill's rules and the floating tiles beside it.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { ScrubRules } from "./scroll-line-live";
import { FloatingTiles } from "./scroll-line-tiles";
import { SETPIECE_PINS, SETPIECE_PROPS, SETPIECE_VALUES } from "./scroll-line-data";

const SCRUB = { from: "@/components/website/ScrubLine", name: "ScrubLine" };
const WIDTHS = [375, 768, 1280, 1920] as const;

export function ScrollLineSection() {
  return (
    <Section
      id="scroll-line"
      lead="Section two: one sentence filled word by word as the page scrolls, under a liquid the cursor stirs, with glass tiles floating round it."
    >
      <Sub title="The set-piece">
        <Spec
          title="Line, liquid and tiles, live"
          level={4}
          source={SCRUB}
          chips={["LiquidLine", "FloatingBadges", "AccentWave"]}
          role="The line is read at the pace the reader scrolls, so the statement lands one word at a time before the water takes the view."
          caption="frame scroll-set-piece · 760 tall · 5 WebGL units plus the frame"
          drawer={{ values: SETPIECE_VALUES, props: SETPIECE_PROPS }}
          note="Scroll inside the frame: the words fill, then the water rises over the line and the players come in. The liquid runs from 1024 wide with a mouse."
        >
          <Anatomy frame pins={SETPIECE_PINS} ground="container" layout="stack" label="Scroll set-piece">
            <ViewportPreview
              part="scroll-set-piece"
              title="Scroll set-piece, 5 WebGL units"
              height={760}
              widths={WIDTHS}
              cost={{ gl: 5 }}
            />
          </Anatomy>
        </Spec>

        <Spec
          title="Word fill"
          level={4}
          source={SCRUB}
          role="The fill finishes early and empties fast going back, so the whole line holds for a beat and a reader turning back is never stuck."
        >
          <ScrubRules />
        </Spec>
      </Sub>

      <Sub title="Floating tiles">
        <FloatingTiles />
      </Sub>
    </Section>
  );
}
