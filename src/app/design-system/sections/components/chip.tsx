// Chip: interactive filter, choice and input pills, which the site does not have yet. Built in its own
// language (white, hairline, navy when chosen). The prose lives in DESIGN.md 7.6.
import { Section } from "@/app/design-system/_kit/Section";
import { ChipAnatomy, ChipDecisions, ChipKinds, ChipOnBlue, ChipRows, ChipSizes, ChipStates } from "./chip-specs";

export function ChipSection() {
  return (
    <Section
      id="chip"
      lead="Small pills a person presses to filter, to pick one of a set, or to hold a value they can take back. Chosen is navy with a check."
    >
      <ChipAnatomy />
      <ChipKinds />
      <ChipStates />
      <ChipSizes />
      <ChipRows />
      <ChipOnBlue />
      <ChipDecisions />
    </Section>
  );
}
