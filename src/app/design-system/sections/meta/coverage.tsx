// Coverage: what the guide shows, measured at build. The headline is the site's own HeroNumbers, one per
// figure in a wrapping grid so a phone never clips the last one, the tables match the catalog's covers to the
// exports the scan finds, the worklist names every export no section covers yet, and the assertions table
// lists any written value, token, pin or module its source no longer holds.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { SECTIONS } from "@/app/design-system/_data/catalog";
import { HeroNumbers } from "@/components/website/HeroBits";
import { coverageReport, METHOD_ROWS, short } from "./coverage-data";
import { PartTable } from "./coverage-table";
import { PART_DIRS } from "./meta-scan";
import s from "./meta.module.css";

const SOURCE = { from: "@/app/design-system/sections/meta/coverage-data", name: "coverageReport", file: "coverage-data.ts" };
const INK = "text-(--ds-color-ink)";

export function CoverageSection() {
  const r = coverageReport();
  const a = r.asserts;
  const stats = [
    { value: `${r.specimened}/${r.exported}`, label: ["Components", "specimened"], tone: INK, live: false },
    { value: `${r.owedShown}/${r.owedTotal}`, label: ["Control states", "shown"], tone: INK, live: false },
    { value: `${a.passing}/${a.total}`, label: ["Assertions", "passing"], tone: INK, live: false },
  ];
  const held = (rows: { ok: boolean }[]) => `${rows.filter((x) => x.ok).length} of ${rows.length} hold`;
  const values = [
    { part: "Exports scanned", value: String(r.exported), source: PART_DIRS.join(", ") },
    { part: "Specimened", value: `${r.specimened} (${r.percent}%)` },
    { part: "Controls", value: String(r.rows.filter((x) => x.interactive).length) },
    { part: "Derived tokens", value: String(a.derived.length) },
  ];
  const byDir = PART_DIRS.map((dir) => ({ dir, parts: r.uncovered.filter((p) => p.dir === dir) })).filter((d) => d.parts.length);

  return (
    <Section id="coverage" lead="What the guide shows, measured from the source as the page builds, with the rest as a worklist.">
      <Spec
        title="Measured at build"
        source={SOURCE}
        role="The numbers come from the catalog and a scan of the source, so they move the moment either one changes."
        caption={`${PART_DIRS.length} folders · ${r.exported} exports · ${SECTIONS.length} sections · read at build`}
        drawer={{ values, children: <KeyRows label="Method" rows={METHOD_ROWS} /> }}
      >
        <Canvas ground="page">
          <div className={s["ds-mt-stats"]}>
            {stats.map((st) => (
              <HeroNumbers key={st.label[0]} stats={[st]} ready left />
            ))}
          </div>
        </Canvas>
      </Spec>

      <Spec
        title="Shipped parts"
        chips={["src/components/website", "src/components/tiles"]}
        role="A shipped part owes the five control states like any other, so a short row here is a gap on the live site."
      >
        <PartTable rows={r.shipped} caption="Shipped parts and the sections that show them" />
      </Spec>

      <Spec
        title="System parts"
        chips={["src/components/design-system"]}
        role="The parts the site lacked, built in its language, measured by the same rule as the shipped ones."
      >
        <PartTable rows={r.system} caption="System parts and the sections that show them" />
      </Spec>

      <Spec
        title="Not specimened"
        source={SOURCE}
        role="The worklist: exports no catalog section lists in its covers yet, each with the line it starts on."
        warn={r.unresolved.length ? `Covers that match no export: ${r.unresolved.join(", ")}` : undefined}
      >
        <Canvas ground="page" layout="stack" label="Exports without a specimen">
          {byDir.length === 0 && <p className={s["ds-mt-quiet"]}>Every export has a specimen.</p>}
          {byDir.map((d) => (
            <div key={d.dir} className={s["ds-mt-chips"]} aria-label={d.dir} role="group">
              {d.parts.map((p) => (
                <span key={`${p.source}#${p.component}`} className="ds-chip ds-chip--static">
                  {`<${p.component}> ${short(p.source)}:${p.line}`}
                </span>
              ))}
            </div>
          ))}
        </Canvas>
      </Spec>

      <Spec
        title="Assertions"
        source={{ from: "@/app/design-system/sections/meta/meta-asserts", name: "assertionReport", file: "meta-asserts.ts" }}
        role="A written value, token, pin or data module fails here once its source stops holding it, so the guide cannot drift from the site."
        drawer={{
          label: "Derived tokens, read by hand",
          children: <KeyRows label="Derived tokens" rows={a.derived.map((d) => ({ key: `--ds-${d.name}`, value: d.reason }))} />,
        }}
      >
        <KeyRows
          label="Assertion tally"
          rows={[
            { key: "Transcribed values", value: held(a.values) },
            { key: "Token values", value: held(a.tokens) },
            { key: "Anatomy pins", value: held(a.pins) },
            { key: "Data modules", value: held(a.modules) },
            { key: "Failing", value: a.failed.length ? `${a.failed.length}, listed below` : "none" },
          ]}
        />
        {a.failed.length > 0 && (
          <SpecTable
            caption="Failed assertions"
            columns={["File", "Expected", "Looked at", "Shown in"]}
            rows={a.failed.map((f) => [f.file, f.expected, f.at, f.shownIn])}
            mono={[0, 1, 2]}
            minWidth={760}
          />
        )}
      </Spec>
    </Section>
  );
}
