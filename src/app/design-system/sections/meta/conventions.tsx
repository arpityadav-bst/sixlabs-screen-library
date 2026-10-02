// Conventions: how the system and this guide are kept, so the next part goes in the same way. Two lists of
// written rules, then the code rules, the measurable ones measured at build.
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ADD_CODE, ADD_STEPS, HOUSE, codeRules } from "./conventions-data";

const SOURCE = { from: "@/app/design-system/sections/meta/conventions-data", file: "conventions-data.ts" };

export function ConventionsSection() {
  const rules = codeRules();
  return (
    <Section id="conventions" lead="How the system and this guide are kept, so the next person adds to them the same way.">
      <Spec
        title="House conventions"
        source={{ ...SOURCE, name: "HOUSE" }}
        role="Six habits that keep the guide true to the site as both of them change."
      >
        <KeyRows label="House conventions" rows={HOUSE} />
      </Spec>

      <Spec
        title="Adding a spec"
        source={{ from: "@/app/design-system/_data/catalog", name: "SECTIONS", file: "catalog.ts" }}
        role="One entry in the catalog drives the nav, the page, the counts and the coverage, so a spec starts there."
        drawer={{ label: "A catalog entry and its section", code: ADD_CODE }}
      >
        <KeyRows label="Steps to add a spec" rows={ADD_STEPS} />
      </Spec>

      <Spec
        title="Code rules"
        source={{ ...SOURCE, name: "codeRules" }}
        chips={["measured at build"]}
        role="The rules a file has to pass, with the line limit, the em dash and the semicolon counted from the files themselves."
      >
        <KeyRows label="Code rules" rows={rules} />
      </Spec>
    </Section>
  );
}
