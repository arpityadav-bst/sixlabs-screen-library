// Tabs: line tabs for switching panels in place, with the full keyboard model. The site has none yet,
// its one tab list (the jobs switch) is a segmented control in the Segmented section. The prose lives
// in DESIGN.md 7.5.
import { Section } from "@/app/design-system/_kit/Section";
import { TabsAnatomy, TabsDecisions, TabsLive, TabsPhone, TabsSizes, TabsStates } from "./tabs-specs";

export function TabsSection() {
  return (
    <Section
      id="tabs"
      lead="A row of labels on a hairline that switches the panel under it. A navy line marks the chosen one, and the row scrolls on its own when a phone runs out of width."
    >
      <TabsAnatomy />
      <TabsStates />
      <TabsSizes />
      <TabsLive />
      <TabsPhone />
      <TabsDecisions />
    </Section>
  );
}
