// Content and voice in context: each rule's shipped line set the way the page sets it, a head as SectionHead,
// a claim and its reason as a card, any other line in its own type role on the ground it ships on, with the
// rule as its caption and the chip that holds the quote to its file. The labels row is the real calls.
import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { SectionHead } from "@/components/design-system/SectionHead";
import { TextLink } from "@/components/design-system/TextLink";
import { typeStyle } from "@/components/design-system/tokens";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { TypedWord } from "@/components/website/TypedWord";
import { AssertChip } from "../foundations/foundation-parts";
import { ClickHold } from "./click-hold";
import { Quote } from "./pattern-parts";
import type { VoiceRule } from "./voice-data";
import s from "./voice.module.css";

function Accented({ text, accent, typed }: { text: string; accent?: string; typed?: boolean }) {
  const at = accent ? text.indexOf(accent) : -1;
  if (!accent || at < 0) return text;
  const tone = "text-(--ds-color-accent)";
  return (
    <>
      {text.slice(0, at)}
      {typed ? <TypedWord word={accent} className={tone} onView /> : <span className={tone}>{accent}</span>}
      {text.slice(at + accent.length)}
    </>
  );
}

function Sample({ r }: { r: VoiceRule }) {
  const f = r.form;
  if (f.kind === "head") {
    const title = r.accent ? r.example.slice(0, r.example.indexOf(r.accent)).trim() : r.example;
    return <SectionHead as="h3" title={title} accent={r.accent} />;
  }
  if (f.kind === "card") {
    return (
      <Card tone="surface" size="compact">
        <CardTitle as="h4">{f.title}</CardTitle>
        <CardBody>{r.example}</CardBody>
      </Card>
    );
  }
  if (f.kind === "label") return <Quote text={`aria-label="${r.example}"`} />;
  const tone = f.ground === "container" && f.role !== "hero" && f.role !== "stat" ? s["ds-vc-body"] : s["ds-vc-ink"];
  return (
    <p className={tone} style={typeStyle(f.role)}>
      <Accented text={r.example} accent={r.accent} typed={r.typed} />
    </p>
  );
}

export function RuleCells({ rules }: { rules: readonly VoiceRule[] }) {
  return (
    <ul className={s["ds-vc-grid"]} aria-label="Voice rules in context">
      {rules.map((r) => (
        <li key={r.rule} className={s["ds-vc-cell"]}>
          <div className={s["ds-vc-sample"]} data-ground={r.form.kind === "type" ? (r.form.ground ?? "page") : "page"}>
            <Sample r={r} />
          </div>
          <p className={s["ds-vc-rule"]}>{r.rule}</p>
          <AssertChip a={r.a} />
        </li>
      ))}
    </ul>
  );
}

/** The calls: PrimaryCta from the site, then the system's outlined Button for the second action and the
 *  system's TextLink for the in-line link. Held, so a press never moves the guide. */
export function LabelRow() {
  return (
    <ClickHold className={s["ds-vc-labels"]}>
      <PrimaryCta>Try now</PrimaryCta>
      <Button variant="secondary">Sign in</Button>
      <TextLink href="#jobs">See what it does</TextLink>
    </ClickHold>
  );
}
