// Content and voice: how the site writes, so new copy sounds like the shipped copy. Every example is quoted
// from the source, checked against it at build and shown in the part or type it ships in, with the tables in
// the drawers. The reasons live in DESIGN.md 9.9.
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { SectionHead } from "@/components/design-system/SectionHead";
import { AssertChip } from "../foundations/foundation-parts";
import { Quote } from "./pattern-parts";
import { LabelRow, RuleCells } from "./voice-context";
import { FILLER, HEADS, LABEL_COLUMNS, LABELS, PUNCTUATION, RULES, VOCABULARY } from "./voice-data";
import s from "./voice.module.css";

const SRC = { from: "@/components/website/Jobs", name: "Jobs", at: "One model. <span" };

const RULE_ROWS = RULES.map((r) => [r.rule, <Quote key={r.rule} text={r.example} accent={r.accent} />, <AssertChip key={`${r.rule}-a`} a={r.a} />]);
const LABEL_ROWS = LABELS.map((l) => [l.label, l.where, l.does, <AssertChip key={l.label} a={l.a} />]);

function Panel({ copy }: { copy: { title: string; body: string } }) {
  return (
    <div className={s["ds-vc-card"]}>
      <Card tone="surface" size="compact">
        <CardTitle as="h4">{copy.title}</CardTitle>
        <CardBody>{copy.body}</CardBody>
      </Card>
    </div>
  );
}

export function VoiceSection() {
  return (
    <Section
      id="voice"
      lead="The site writes in short sentences that state a fact and stop, in the present for what is true now and the past only for what the model has done. New copy follows the rules below, each shown in a line the site already ships."
    >
      <Spec
        title="Rules"
        source={SRC}
        role="Each rule is read off the shipped copy, so a new line can be checked against a real one rather than a taste."
        caption="each line quoted from source and set as it ships · a chip turns red when the line leaves its file"
        drawer={{
          label: "The rules as a table",
          children: <SpecTable caption="Voice rules with shipped examples" columns={["Rule", "Shipped example", "Source"]} rows={RULE_ROWS} minWidth={640} />,
        }}
      >
        <RuleCells rules={RULES} />
      </Spec>

      <Spec
        title="Vocabulary"
        source={{ from: "@/components/website/players-data", name: "PLAYERS", file: "players-data.ts", at: "aiVideo?: Clip;" }}
        role="One word for each thing, so a visitor never wonders whether a copy and a model are two products."
      >
        <KeyRows label="Vocabulary" rows={VOCABULARY} />
      </Spec>

      <Spec
        title="Labels"
        source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}
        role="A label is a verb and what it acts on, two or three words, so it reads as what happens on a press."
        caption="PrimaryCta from the site, the outlined Button and TextLink from the system · presses held"
        drawer={{
          label: "Every label, where it ships",
          children: <SpecTable caption="Button and link labels" columns={LABEL_COLUMNS} rows={LABEL_ROWS} mono={[0]} minWidth={620} />,
        }}
      >
        <LabelRow />
      </Spec>

      <Spec
        title="Punctuation"
        source={{ from: "@/components/website/faq-data", name: "QUESTIONS", file: "faq-data.ts", at: "already have a digital copy" }}
        role="Plain marks only, so a sentence ends where it says it does."
      >
        <KeyRows label="Punctuation" rows={PUNCTUATION} />
      </Spec>

      <DoDont>
        <Do reason="Short sentences with full stops state the fact and stop, and the accent lands on the noun.">
          <SectionHead as="h3" title={HEADS.shipped.title} accent={HEADS.shipped.accent} />
        </Do>
        <Dont reason="Adjectives and an exclamation sell rather than say, and the accent ends on the adjective.">
          <SectionHead as="h3" title={HEADS.sold.title} accent={HEADS.sold.accent} />
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Obvious filler in a new part's specimen can never be mistaken for a promise the product makes.">
          <Panel copy={FILLER.ok} />
        </Do>
        <Dont reason="An invented figure reads as a claim, and it travels from a specimen into a deck.">
          <Panel copy={FILLER.invented} />
        </Dont>
      </DoDont>
    </Section>
  );
}
