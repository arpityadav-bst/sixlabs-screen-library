// Icon button: the shipped wave button and player arrows first, then the system IconButton that puts every
// icon-only action on one size ladder. The prose lives in DESIGN.md 7.2.
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { IconButtonDecisions, IconButtonToggle } from "./icon-button-more";
import { ShippedIconButtons } from "./icon-button-shipped";
import { IconButtonAnatomy, IconButtonMatrix, IconButtonSizes, IconButtonStates } from "./icon-button-specs";

export function IconButtonSection() {
  return (
    <Section
      id="icon-button"
      lead="Round actions with no visible word: the two the site ships, then one IconButton in five sizes and five variants, each named for screen readers."
    >
      <Sub title="Wave button and player arrows">
        <ShippedIconButtons />
      </Sub>
      <Sub title="IconButton">
        <IconButtonAnatomy />
        <IconButtonMatrix />
        <IconButtonStates />
        <IconButtonSizes />
        <IconButtonToggle />
        <IconButtonDecisions />
      </Sub>
    </Section>
  );
}
