// Accordion: the shipped FAQ (its only direct mount in the guide, id "faq") and the new Accordion, which
// carries the FAQ row's look to any list. States, sizes and the single or multiple choice are in
// accordion-states.tsx.
import { Accordion } from "@/components/design-system/Accordion";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { FaqOpenFirst } from "./accordion-live";
import { AccordionStates, SYS } from "./accordion-states";
import {
  ACC_CODE,
  ACC_PINS,
  ACC_PROPS,
  ACC_VALUES,
  FAQ_CODE,
  FAQ_ITEMS,
  FLUSH_PINS,
  FAQ_PINS,
  FAQ_STATES,
  FAQ_VALUES,
} from "./accordion-data";

const FAQ = { from: "@/components/website/Faq", name: "Faq" };
/** a list's width in a panel or a column */
const LIST = { width: 560, maxWidth: "100%" };
const THREE = FAQ_ITEMS.slice(0, 3);

export function AccordionSection() {
  return (
    <Section
      id="accordion"
      lead="Rows that open in place to their content: the shipped FAQ, and the Accordion that carries its look to any list of questions or details."
    >
      <Spec
        title="FAQ"
        source={FAQ}
        role="Each row opens on its own and in place, so a reader compares answers without losing their spot in the list."
        drawer={{ values: FAQ_VALUES, code: FAQ_CODE }}
        note="The shipped rows draw no focus ring and link no region to their trigger. The Accordion below adds both."
      >
        <Anatomy ground="grain" layout="stack" pins={FAQ_PINS} label="FAQ anatomy">
          <FaqOpenFirst />
        </Anatomy>
        <KeyRows label="FAQ states" rows={FAQ_STATES} />
      </Spec>

      <Spec
        title="Accordion"
        source={SYS}
        props="variant icon"
        role="The card is the FAQ row as it ships, and flush rows divide a white panel, so both read as the page's own lists."
        drawer={{ values: ACC_VALUES, props: ACC_PROPS, code: ACC_CODE }}
      >
        <Anatomy ground="page" pins={ACC_PINS} label="Accordion anatomy, card">
          <div style={LIST}>
            <Accordion items={THREE} defaultOpen={["q0"]} />
          </div>
        </Anatomy>
        <Anatomy ground="surface" pins={FLUSH_PINS} label="Accordion anatomy, flush with chevrons">
          <div style={LIST}>
            <Accordion variant="flush" icon="chevron" items={FAQ_ITEMS.slice(1, 4)} />
          </div>
        </Anatomy>
      </Spec>

      <AccordionStates />

      <Spec
        title="Across widths"
        source={SYS}
        role="Under md the card takes the FAQ's own phone step, tighter padding and a smaller question, so both lists change together."
        caption="375 · 768 · 1280"
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview
            part="accordion-phone"
            title="Accordion at phone, tablet and desktop width"
            height={560}
            widths={[375, 768, 1280]}
            width={375}
            fitHeight
          />
        </Canvas>
      </Spec>

      <DoDont>
        <Do reason="A FAQ opens rows independently, so the answer being read stays put while the next one opens.">
          <div style={LIST}>
            <Accordion items={THREE} defaultOpen={["q0", "q1"]} size="sm" />
          </div>
        </Do>
        <Dont reason="Single on a FAQ closes the answer being read and shifts the list under the pointer.">
          <div style={LIST}>
            <Accordion type="single" items={THREE} defaultOpen={["q0"]} size="sm" />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do ground="surface" reason="Inside a white panel the rows go flush, divided by a hairline, so the panel stays one surface.">
          <div style={LIST}>
            <Accordion variant="flush" items={THREE} size="sm" />
          </div>
        </Do>
        <Dont ground="surface" reason="White cards on a white panel lean on their hairlines alone and read as boxes inside a box.">
          <div style={LIST}>
            <Accordion items={THREE} size="sm" />
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
