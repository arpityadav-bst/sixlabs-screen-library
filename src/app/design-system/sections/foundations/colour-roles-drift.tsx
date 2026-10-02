// Two specs of Colour roles that read the source rather than show a colour: the drift table, built by the
// source scan at build, and TokenStyle, the one place a token becomes CSS.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { tokenCss } from "@/components/design-system/TokenStyle";
import { DRIFT, TOKEN_STYLE_ROWS } from "./colour-roles-data";
import { find, scan, siteFiles } from "./colour-scan";
import { tint } from "./colour-strip";
import s from "./colour.module.css";

const base = (p: string) => p.split("/").pop() ?? p;

function where(files: readonly string[]): string {
  if (files.length === 0) return "none";
  const named = files.slice(0, 3).map(base).join(", ");
  return files.length > 3 ? `${named} and ${files.length - 3} more` : named;
}

export function DriftSpec() {
  const rows = DRIFT.flatMap((r) =>
    r.probes.map((p, i) => {
      const hit = scan(p.re);
      return [
        i === 0 ? r.role : "",
        <span key="v" className={s["ds-col-drift"]} style={tint(p.swatch)}>
          {p.label}
        </span>,
        p.reads,
        String(hit.files.length),
        String(hit.uses),
        where(hit.files),
      ];
    }),
  );
  const values = DRIFT.reduce((n, r) => n + r.probes.length, 0);
  return (
    <Spec
      title="Drift in the source"
      level={4}
      role="Each role as the site writes it today, counted at build, so a merge on the site shows here the day it lands."
      caption={`${values} spellings of ${DRIFT.length} roles · ${siteFiles().length} site files scanned at build`}
    >
      <SpecTable
        caption="Every spelling of a colour role in the site's source"
        columns={["Role", "Written as", "Reads as", "Files", "Uses", "First files"]}
        rows={rows}
        mono={[1, 3, 4, 5]}
        minWidth={820}
      />
    </Spec>
  );
}

/** The first colour declarations TokenStyle prints, cut from its own output. */
function excerpt(): string {
  const decls = tokenCss(":root").match(/--ds-color-[\w-]+:[^;]+;/g) ?? [];
  return [":root {", ...decls.slice(0, 8).map((d) => `  ${d}`), `  /* and ${Math.max(0, decls.length - 8)} more colours */`, "}"].join("\n");
}

export function TokenStyleSpec() {
  const line = find("src/components/design-system/TokenStyle.tsx", /export function TokenStyle\b/)?.line;
  return (
    <Spec
      title="TokenStyle"
      level={4}
      source={{ from: "@/components/design-system/TokenStyle", name: "TokenStyle", line }}
      props="selector"
      role="The one place a token becomes CSS: a single style element on the guide's root, printed from the TypeScript values."
      drawer={{
        props: [{ name: "selector", type: "string", default: '":root"', note: "the rule the properties are declared on" }],
        code: 'import { TokenStyle } from "@/components/design-system/TokenStyle";\n\n<TokenStyle />',
      }}
    >
      <Canvas ground="page" layout="stack" label="What TokenStyle prints">
        <div className="ds-code">
          <pre>
            <code>{excerpt()}</code>
          </pre>
        </div>
      </Canvas>
      <KeyRows label="TokenStyle facts" rows={TOKEN_STYLE_ROWS} />
    </Spec>
  );
}
