// Frame part accordion-phone: the card accordion at a true viewport width, so its phone step (gap 8,
// padding 16 / 20, the question at 16) shows under 768 and the FAQ's own values from 768. The first row is
// open. Questions from faq-data.ts.
import { Accordion } from "@/components/design-system/Accordion";
import { QUESTIONS } from "@/components/website/faq-data";

const ITEMS = QUESTIONS.slice(0, 4).map((x, k) => ({ id: `q${k}`, title: x.q, content: x.a }));

export function AccordionPhone() {
  return (
    <div style={{ padding: "32px 16px" }}>
      <Accordion items={ITEMS} defaultOpen={["q0"]} />
    </div>
  );
}
