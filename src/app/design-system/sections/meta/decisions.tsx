// Decisions pending: the calls only the owner can make, one white Card each. Every card sets the two
// options side by side with real parts, says what each one changes, marks the recommendation in navy and
// keeps its figures (contrast, file counts, source lines) in a closed drawer.
import type { ReactNode } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Section } from "@/app/design-system/_kit/Section";
import { SpecDrawer } from "@/app/design-system/_kit/SpecDrawer";
import { Badge } from "@/components/design-system/Badge";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";
import { decisions, type Decision, type Option } from "./decisions-data";
import { optionsFor } from "./decisions-options";
import s from "./meta.module.css";

type PaneGround = "page" | "surface" | "on-blue";

function Pane({ letter, option, picked, ground, children }: { letter: string; option: Option; picked: boolean; ground: PaneGround; children: ReactNode }) {
  return (
    <div className={s["ds-dc-opt"]} data-pick={picked ? "" : undefined}>
      <div className={s["ds-dc-opt-head"]}>
        <span>{`${letter} · ${option.label}`}</span>
        {picked && (
          <Badge tone="inverse" size="sm">
            Recommended
          </Badge>
        )}
      </div>
      <Canvas ground={ground} label={`Option ${letter}: ${option.label}`} isolateKeys>
        {children}
      </Canvas>
      <p className={s["ds-dc-cost"]}>{option.changes}</p>
    </div>
  );
}

function DecisionCard({ d, n }: { d: Decision; n: number }) {
  const sheenAt = d.values.map((v) => `${v.part}: ${v.value}`).join("\n");
  const pair = optionsFor(d.id, sheenAt);
  const ground: PaneGround = pair.ground ?? "page";
  return (
    <Card aria-label={d.title}>
      <div className={s["ds-dc-head"]}>
        <span className={s["ds-dc-n"]} aria-hidden="true">
          {String(n).padStart(2, "0")}
        </span>
        <CardTitle>{d.title}</CardTitle>
      </div>
      <CardBody>{d.question}</CardBody>
      <div className={s["ds-dc-opts"]}>
        <Pane letter="A" option={d.a} picked={d.pick === "a"} ground={ground}>
          {pair.a}
        </Pane>
        <Pane letter="B" option={d.b} picked={d.pick === "b"} ground={ground}>
          {pair.b}
        </Pane>
      </div>
      <CardMeta start={`Touches ${d.touches}`} end="Owner call" />
      <div className={s["ds-dc-drawer"]}>
        <SpecDrawer label="Figures behind it" values={d.values} />
      </div>
    </Card>
  );
}

export function DecisionsSection() {
  const list = decisions();
  return (
    <Section
      id="decisions"
      lead={`${list.length} calls only the owner can make. Each shows both options with real parts, what each one changes and the option recommended.`}
    >
      <div className={s["ds-dc-list"]}>
        {list.map((d, i) => (
          <DecisionCard key={d.id} d={d} n={i + 1} />
        ))}
      </div>
    </Section>
  );
}
