// The two options of each decision, drawn with real parts: the shipped site parts where they exist, the
// system atoms otherwise, and a remapped token where an option only changes a value. Forced focus samples
// sit in an inert box, so they stay out of the tab order. Copy is quoted from the site's source through the
// data that holds it to its line (LINES and SIDES in comparison-data). The comparison's keep option is the
// shipped section itself, in its frame, and the container option redraws both of its cards with the same lines.
import type { CSSProperties, ReactNode } from "react";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import type { Ground } from "@/app/design-system/_kit/Canvas";
import { Metrics } from "@/app/design-system/_kit/Metrics";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { PEOPLE } from "@/app/design-system/_data/specimens";
import { Accordion } from "@/components/design-system/Accordion";
import { Avatar } from "@/components/design-system/Avatar";
import { Badge } from "@/components/design-system/Badge";
import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardTitle } from "@/components/design-system/CardParts";
import { StatusDot } from "@/components/design-system/StatusDot";
import { tokenByName, typeStyle } from "@/components/design-system/tokens";
import { QUESTIONS } from "@/components/website/faq-data";
import { JOBS } from "@/components/website/jobs-data";
import { LINES, SIDES } from "../components/comparison-data";
import { ACCENT_INK, type DecisionId } from "./decisions-data";
import s from "./meta.module.css";

type Pair = { a: ReactNode; b: ReactNode; ground?: Extract<Ground, "page" | "surface" | "on-blue"> };

const vars = (v: Record<string, string>) => v as CSSProperties;
/** A token's value. An unknown name throws, so an option never draws from a blank. */
const hex = (name: string): string => {
  const v = tokenByName(name)?.value;
  if (!v) throw new Error(`Decisions: --ds-${name} is not in tokens.ts`);
  return v;
};
const ACCENT = hex("color-accent");
const INK = hex("color-ink");
const MONO: CSSProperties = { fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" };
const ITEMS = QUESTIONS.slice(0, 3).map((q, i) => ({ id: `dc-faq-${i}`, title: q.q, content: q.a }));

function AccentText({ color }: { color: string }) {
  return (
    <span className={s["ds-dc-col"]}>
      <span className={s["ds-dc-sample"]} style={{ color }}>
        Yours next.
      </span>
      <ContrastBadge fg={color} bg="page" />
      <ContrastBadge fg={color} bg="container" />
    </span>
  );
}

function InkAndFill({ merged }: { merged?: boolean }) {
  const style = merged ? vars({ "--ds-color-primary": "var(--ds-color-ink)" }) : undefined;
  return (
    <span className={s["ds-dc-col"]} style={style}>
      <span className="text-(--ds-color-ink)" style={typeStyle("card-title")}>
        One model. Three jobs.
      </span>
      <Button variant="primary" size="md">
        Try now
      </Button>
    </span>
  );
}

function Rings({ navy }: { navy?: boolean }) {
  const style = navy ? vars({ "--ds-focus-color": "var(--ds-color-primary)" }) : undefined;
  return (
    <div className={s["ds-dc-row"]} style={style} inert>
      <Button variant="primary" size="md" forceState="focus">
        Try now
      </Button>
      <Button variant="secondary" size="md" forceState="focus">
        Sign in
      </Button>
    </div>
  );
}

function MonoLine({ mapped }: { mapped?: boolean }) {
  const style = mapped ? { ...MONO, fontFamily: "var(--ds-font-mono)" } : MONO;
  return (
    <Metrics>
      <span className={`${mapped ? "" : "font-mono"} ${s["ds-dc-meta"]}`} style={style}>
        <span>Model 01</span>
        <span>Running</span>
      </span>
    </Metrics>
  );
}

/** ModeToggle's own label, white on the water at the size each option sets it. */
function WhiteLabel({ large }: { large?: boolean }) {
  return (
    <span className={s["ds-dc-col"]}>
      <span className="font-medium text-white" style={{ fontSize: large ? 24 : 14, lineHeight: 1.3 }}>
        Human
      </span>
      <ContrastBadge fg="#ffffff" bg={ACCENT} bgName="the accent" />
    </span>
  );
}

/** The same label on a white surface in ink, the way ModeToggle sets its chosen state. */
function LabelOnWhite() {
  return (
    <span className={s["ds-dc-col"]}>
      <span className={s["ds-dc-white"]}>Human</span>
      <ContrastBadge fg={INK} bg="surface" />
    </span>
  );
}

/** The live dots of three system parts, in the accent or, remapped, in the navy. */
function Dots({ navy }: { navy?: boolean }) {
  const style = navy ? vars({ "--ds-color-accent": "var(--ds-color-primary)" }) : undefined;
  return (
    <span className={s["ds-dc-row"]} style={style}>
      <Badge tone="live" pulse={false}>
        Live
      </Badge>
      <Avatar name={PEOPLE[0].name} size={40} status="live" />
      <StatusDot tone="live" />
    </span>
  );
}

/** Both comparison cards on the container grey, the same lines as the frame, the 6labs rests in the accent. */
function ContainerPair() {
  return (
    <span className={s["ds-dc-col"]}>
      <span className={s["ds-dc-pair"]}>
        {SIDES.map(({ side, name }) => (
          <Card key={side} tone="container" size="compact">
            <CardTitle as="span">{name}</CardTitle>
            {LINES[side].map(([verb, rest]) => (
              <span key={verb + rest} className="mt-2 block text-(--ds-color-ink)" style={typeStyle("comparison")}>
                {verb} {side === "ours" ? <span className="text-(--ds-color-accent)">{rest}</span> : rest}
              </span>
            ))}
          </Card>
        ))}
      </span>
      <ContrastBadge fg={ACCENT} bg="container" />
    </span>
  );
}

const CODE_RAW = `<p className="text-[#0a1b33]">`;
const CODE_THEME = `@theme { --color-ink: #0a1b33; }
<p className="text-ink">`;

export function optionsFor(id: DecisionId, sheenAt: string): Pair {
  switch (id) {
    case "accent-ink":
      return { a: <AccentText color={ACCENT} />, b: <AccentText color={ACCENT_INK} /> };
    case "navies":
      return { a: <InkAndFill />, b: <InkAndFill merged /> };
    case "accent-label":
      return { a: <WhiteLabel large />, b: <LabelOnWhite />, ground: "on-blue" };
    case "dots":
      return { a: <Dots />, b: <Dots navy /> };
    case "understands":
      return {
        a: (
          <ViewportPreview
            part="section-understands"
            title="Comparison section, as it ships"
            height={640}
            widths={[1280]}
            width={1280}
            fitHeight
          />
        ),
        b: <ContainerPair />,
      };
    case "ring":
      return { a: <Rings />, b: <Rings navy /> };
    case "theme":
      return {
        a: <pre className={s["ds-dc-mono"]}>{CODE_RAW}</pre>,
        b: <pre className={s["ds-dc-mono"]}>{CODE_THEME}</pre>,
        ground: "surface",
      };
    case "mono":
      return { a: <MonoLine />, b: <MonoLine mapped /> };
    case "sheen":
      return {
        a: <p className={s["ds-dc-mono"]}>{`Not drawn here, so the guide keeps no mask or filter on screen.\n${sheenAt}`}</p>,
        b: (
          <Card variant="clickable" as="button" size="compact" sheen>
            <CardTitle>{JOBS[0].title}</CardTitle>
            <CardBody>{JOBS[0].body}</CardBody>
          </Card>
        ),
      };
    case "faq":
      return {
        a: <Accordion items={ITEMS} type="multiple" size="sm" headingLevel={4} defaultOpen={[ITEMS[0].id, ITEMS[1].id]} />,
        b: <Accordion items={ITEMS} type="single" size="sm" headingLevel={4} defaultOpen={[ITEMS[0].id]} />,
      };
  }
}
