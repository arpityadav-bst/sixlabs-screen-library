// Contrast: which text may sit on which ground, worked out rather than claimed. The matrix grades every
// text colour on every ground, three pairs teach the rules that follow, then the lines and icons that need
// 3:1, the shipped pairs under the line today, and the open accent-ink decision.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge, ContrastRow } from "@/app/design-system/_kit/ContrastBadge";
import { KeyRows, type KeyRow } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { typeStyle } from "@/components/design-system/tokens";
import { readable, shortSource, tok, valueRows } from "./colour-kit";
import { ACCENT_INK, FOREGROUNDS, MATRIX_GROUNDS, NON_TEXT, SITE_PAIRS } from "./colour-contrast-data";
import { AccentAtDisplaySize, BodyOnContainer, LargeOnBlue } from "./colour-contrast-dodont";
import { ContrastMatrix, PAIR_COUNT } from "./colour-contrast-matrix";
import m from "./colour-contrast.module.css";

/** A drawer row for a token in a pair, named for the part it plays. */
const pairRow = (part: string, token: string) => ({ ...valueRows([tok(token)])[0], part });

const MATRIX_VALUES = [...FOREGROUNDS, ...MATRIX_GROUNDS].map((c) => pairRow(`${c.label} (${"ground" in c ? "ground" : "text"})`, c.token));

const MATRIX_CODE = [
  'import { contrastRatio, formatRatio, grade } from "@/app/design-system/_kit/contrast";',
  "",
  'const r = contrastRatio("#64748b", "#f5f6f8"); // alpha is composited over the ground first',
  "formatRatio(r!); // two decimals, rounded down",
  'grade(r!); // "AAA" from 7, "AA" from 4.5, "AA large" from 3, else "fail"',
].join("\n");

const NON_TEXT_VALUES = NON_TEXT.map((n) => pairRow(n.key, n.token));

const SITE_VALUES = SITE_PAIRS.map((p) => ({ part: p.key, value: `${p.fg} on ${p.bgName}`, source: p.source }));

const NON_TEXT_ROWS: readonly KeyRow[] = NON_TEXT.map((n) => {
  const t = tok(n.token);
  return { key: n.key, value: <ContrastRow fg={readable(t)} grounds={n.grounds} />, source: shortSource(t.source) };
});

const SITE_ROWS: readonly KeyRow[] = SITE_PAIRS.map((p) => ({
  key: p.key,
  value: (
    <>
      <ContrastBadge fg={p.fg} bg={p.bg} bgName={p.bgName} /> {p.what}
    </>
  ),
  source: p.source,
}));

function AccentInkPick({ ground }: { ground: "page" | "container" }) {
  const now = tok("color-accent").value;
  return (
    <div className={m["ds-cm-duo"]}>
      {[now, ACCENT_INK.candidate].map((c) => (
        <span key={c} className={m["ds-cm-pick"]}>
          <span style={{ ...typeStyle("caption"), fontWeight: 500, color: c }}>{ACCENT_INK.sample}</span>
          <ContrastBadge fg={c} bg={ground} />
        </span>
      ))}
    </div>
  );
}

export function ContrastSection() {
  return (
    <Section
      id="contrast"
      lead="Which text may sit on which ground, graded against WCAG 2 from the shipped values, and the rules that follow from the grades."
    >
      <Spec
        title="Text on every ground"
        source={{ from: "@/app/design-system/_kit/contrast", name: "contrastRatio", file: "contrast.ts" }}
        role="What may sit on what, worked out from the token values rather than typed in, so a changed token regrades itself."
        caption={`${PAIR_COUNT} pairs · each sample at 14 and 24px · alpha composited over the ground · ratios rounded down`}
        drawer={{ values: MATRIX_VALUES, code: MATRIX_CODE }}
      >
        <ContrastMatrix />
      </Spec>

      <Sub title="The rules the grades set">
        <BodyOnContainer />
        <AccentAtDisplaySize />
        <LargeOnBlue />
      </Sub>

      <Sub title="Lines and icons">
        <Spec
          title="Non-text contrast"
          level={4}
          role="Field edges, focus rings and icons that carry meaning need 3:1 against their ground. Hairlines that only group content are exempt."
          note="For a line or an icon the bar is 3:1, which the badge prints as AA large."
          drawer={{ values: NON_TEXT_VALUES }}
        >
          <KeyRows label="Lines and icons against their grounds" rows={NON_TEXT_ROWS} />
        </Spec>
      </Sub>

      <Sub title="Where the site sits under the line">
        <Spec
          title="Shipped text under its grade"
          level={4}
          role="Text the site sets under its grade today, each found in the source at build with its file and line."
          note="WCAG counts text as large from 24px, or 18.66px bold, so the player body at 16 and 18px regular sits under the large-text line."
          drawer={{ values: SITE_VALUES }}
        >
          <KeyRows label="Shipped pairs under their grade" rows={SITE_ROWS} />
        </Spec>
      </Sub>

      <Sub title="Open decision">
        <Spec
          title="Accent ink for small text"
          level={4}
          chips={[ACCENT_INK.source]}
          role="A darker accent candidate beside today's accent, on the two grounds where small accent copy lands."
          caption={`left ${tok("color-accent").value}, the accent today · right ${ACCENT_INK.candidate}, the candidate`}
          note="The candidate is not a token. Nothing ships in it until the owner decides."
          drawer={{
            values: [
              pairRow("Accent today", "color-accent"),
              { part: "Candidate accent ink", value: ACCENT_INK.candidate, source: "pending the owner" },
              { part: "Sample line", value: ACCENT_INK.sample, source: ACCENT_INK.source },
            ],
          }}
        >
          <Canvas ground="container" label="On the container">
            <AccentInkPick ground="container" />
          </Canvas>
          <Canvas ground="page" label="On the page">
            <AccentInkPick ground="page" />
          </Canvas>
        </Spec>
      </Sub>
    </Section>
  );
}
