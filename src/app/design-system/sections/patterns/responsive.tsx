// Responsive: what changes at each width, the full hero's own type steps with every value asserted
// against Hero.tsx, the height and pointer rules, and the real full page at seven widths. The reasons live
// in DESIGN.md 9.6.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { AssertChip } from "../foundations/foundation-parts";
import { FULL_PINS, FULL_WIDTHS, LADDER, MEDIA_ROWS, TYPE_LADDER } from "./responsive-data";
import { Wave } from "./responsive-live";

const HERO = { from: "@/components/website/Hero", name: "Hero", at: "const FULL_TITLE =" };

const LADDER_ROWS = LADDER.map((r) => [r.width, r.at, r.changes, <AssertChip key={r.width} a={r.a} />]);
const TYPE_ROWS = TYPE_LADDER.map((r) => [r.from, r.title, r.lede, r.measure, <AssertChip key={r.from} a={r.a} />]);

export function ResponsiveSection() {
  return (
    <Section
      id="responsive"
      lead="What changes at each width, read from the source. New work changes at Tailwind's md, lg and xl, and the full hero keeps the type steps it was tuned on."
    >
      <Spec
        title="What changes at each width"
        source={{ from: "@/components/website/Header", name: "Header", at: "hidden md:flex items-center gap-8" }}
        role="Each width changes a few things at once, so the page reflows in steps a visitor can predict."
        caption="the base row from 0 is what a phone shows, framed at 375 under Across widths · each chip turns red when its class leaves the source"
      >
        <SpecTable caption="Changes by width" columns={["From", "Step", "What changes", "Source"]} rows={LADDER_ROWS} mono={[0, 1]} minWidth={760} />
      </Spec>

      <Spec
        title="Full hero type steps"
        source={HERO}
        chips={["--ds-type-hero-full-size", "--ds-type-lede-full-size"]}
        role="The full hero's title and lede step together on their own widths, so the copy keeps its shape from a phone to a 2560 screen."
      >
        <SpecTable caption="Full hero title, lede and measure" columns={["From", "Title", "Lede", "Measure", "Source"]} rows={TYPE_ROWS} mono={[0, 1, 2, 3]} minWidth={560} />
      </Spec>

      <Spec
        title="Across widths"
        source={{ from: "@/app/6labs-fullview/page", name: "FullviewPage", file: "page.tsx" }}
        role="The real full page, framed at seven widths, so each width's changes are seen where they happen."
        caption="the whole route in a frame, scroll inside it · it shares the floor slot with the Hero section"
        note="Only one floor runs at a time on this page, so the Hero preview pauses while this one is live."
      >
        <Anatomy frame layout="stack" ground="container" pins={FULL_PINS} label="Full page anatomy">
          <ViewportPreview src="/6labs-fullview" title="The full page" height={900} widths={FULL_WIDTHS} width={1280} cost={{ floor: true, gl: 7 }} gateInput />
        </Anatomy>
      </Spec>

      <Spec
        title="Height, pointer and safe areas"
        source={HERO}
        role="Width is not the only axis, so a short screen, a touch screen and a notch each get their own rule."
      >
        <KeyRows label="Media beyond width" rows={MEDIA_ROWS} />
      </Spec>

      <DoDont>
        <Do ground="container" reason="Under md the wave becomes the 40px pill in the container's corner, a target a thumb can hit.">
          <Wave form="pill" />
        </Do>
        <Dont reason="The bare form is about 24px across and needs a pointer's precision, so it ships from md only.">
          <Wave form="bare" />
        </Dont>
      </DoDont>
    </Section>
  );
}
