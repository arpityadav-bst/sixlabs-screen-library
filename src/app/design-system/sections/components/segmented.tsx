// Segmented control: the site's two drifted switches (Human / AI on the blue, the jobs switch on white),
// then the one system control that replaces both. The prose lives in DESIGN.md 7.4.
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { ShippedSegmented } from "./segmented-shipped";
import {
  SegmentedAnatomy,
  SegmentedDecisions,
  SegmentedGrounds,
  SegmentedSizes,
  SegmentedStates,
} from "./segmented-specs";

export function SegmentedSection() {
  return (
    <Section
      id="segmented"
      lead="Two to four short options chosen in place on one pill. The site ships two versions of it, and the system folds them into one control with three grounds."
    >
      <Sub title="Human / AI and jobs switches">
        <ShippedSegmented />
      </Sub>
      <Sub title="Segmented">
        <SegmentedAnatomy />
        <SegmentedGrounds />
        <SegmentedStates />
        <SegmentedSizes />
        <SegmentedDecisions />
      </Sub>
    </Section>
  );
}
