// Text link: one inline link spec in three tones, where the site sets three drifted ones by hand. The
// prose lives in DESIGN.md 7.3.
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { DRIFT_COLUMNS, DRIFT_ROWS } from "./text-link-data";
import { TextLinkAnatomy, TextLinkDecisions, TextLinkForms, TextLinkLines, TextLinkStates } from "./text-link-specs";

export function TextLinkSection() {
  return (
    <Section
      id="text-link"
      lead="An underlined word inside a sentence that goes somewhere. One spec, three tones, where the site writes the same link three ways."
    >
      <TextLinkAnatomy />
      <TextLinkLines />
      <TextLinkStates />
      <TextLinkForms />
      <Spec
        title="Where the site drifts"
        source={{ from: "@/components/design-system/TextLink", name: "TextLink" }}
        role="The three shipped links disagree on offset, thickness and timing, and the last row is the one the system keeps."
        note="The shipped links are inline markup inside Hero, Closing and Footer, not a part, so they are compared here by their values."
      >
        <SpecTable
          caption="Shipped links against the system TextLink"
          columns={DRIFT_COLUMNS}
          rows={DRIFT_ROWS}
          mono={[1, 2, 5]}
          minWidth={720}
        />
      </Spec>
      <TextLinkDecisions />
    </Section>
  );
}
