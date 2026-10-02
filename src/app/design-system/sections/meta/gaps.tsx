// Known gaps: what this guide cannot catch, then the site and system defects found while building it,
// recorded and left unfixed for the owner. Each defect's file:line is read from its evidence at build, so a
// fix or a move shows as a row to recheck rather than a stale line number.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { PartLabel, Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { Badge } from "@/components/design-system/Badge";
import { gapReads, gapsByArea } from "./gaps-check";
import { BLIND_SPOTS, SEVERITY_TONE, type Severity } from "./gaps-data";
import s from "./meta.module.css";

const SEVERITIES: readonly Severity[] = ["high", "medium", "low"];
const LABEL: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };

const GAP_CODE = `// sections/meta/gaps-data.ts, one row per defect
{ area: "a11y", severity: "medium", part: "PlayerTraits",
  effect: "One sentence on what a visitor meets.",
  evidence: [{ file: "src/components/website/PlayerTraits.tsx", absent: "role=", anchor: "export function PlayerTraits" }] },`;

export function GapsSection() {
  const all = gapReads();
  const open = all.filter((g) => g.open).length;
  const values = [
    ...SEVERITIES.map((sev) => ({ part: LABEL[sev], value: String(all.filter((g) => g.severity === sev).length), source: "gaps-data.ts" })),
    { part: "Open", value: String(open) },
    { part: "To recheck", value: String(all.length - open) },
  ];

  return (
    <Section id="gaps" lead="What this guide cannot catch, and the defects in the site and the system found while building it. The guide records them, and the owner decides.">
      <Spec
        title="What the guide cannot catch"
        source={{ from: "@/app/design-system/sections/meta/gaps-data", name: "BLIND_SPOTS", file: "gaps-data.ts" }}
        role="A green page proves less than it seems, and these are the places where a person still has to look."
      >
        <KeyRows label="Blind spots" rows={BLIND_SPOTS} />
      </Spec>

      <Spec
        title="Site and system defects"
        source={{ from: "@/app/design-system/sections/meta/gaps-data", name: "GAPS", file: "gaps-data.ts" }}
        chips={["read at build"]}
        role="Found while building the guide and left as they are, because a fix to the site or the system is the owner's call."
        drawer={{ values, code: GAP_CODE }}
      >
        <Canvas ground="page" label="Defects by severity">
          <div className={s["ds-mt-strip"]}>
            {SEVERITIES.map((sev) => (
              <span key={sev} className={s["ds-mt-tally"]}>
                <b>{all.filter((g) => g.severity === sev).length}</b>
                <Badge tone={SEVERITY_TONE[sev]} size="sm">
                  {LABEL[sev]}
                </Badge>
              </span>
            ))}
            <span className={s["ds-mt-tally"]}>
              <b>{open}</b> open
            </span>
            <span className={s["ds-mt-tally"]}>
              <b>{all.length - open}</b> to recheck
            </span>
          </div>
        </Canvas>
        {gapsByArea().map((area) => (
          <div key={area.id} className={s["ds-mt-block"]}>
            <PartLabel>{area.title}</PartLabel>
            <SpecTable
              caption={`${area.title} defects`}
              columns={["Severity", "Part", "Effect", "Where", "Status"]}
              mono={[3]}
              minWidth={760}
              rows={area.gaps.map((g) => [
                <Badge key="sev" tone={SEVERITY_TONE[g.severity]} size="sm">
                  {LABEL[g.severity]}
                </Badge>,
                g.part,
                g.effect,
                <span key="w" className={s["ds-mt-lines"]}>
                  {g.reads.map((r, i) => (
                    <span key={i}>{r.where}</span>
                  ))}
                </span>,
                g.open ? (
                  "open"
                ) : (
                  <Badge key="st" tone="warning" size="sm">
                    Recheck
                  </Badge>
                ),
              ])}
            />
          </div>
        ))}
      </Spec>
    </Section>
  );
}
