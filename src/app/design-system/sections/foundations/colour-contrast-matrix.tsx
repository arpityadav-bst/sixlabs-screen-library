// The contrast matrix: every text colour on every ground the site sets text on. Each cell is a kit Canvas
// of its ground, with the pair at 14px and at 24px, the ratio worked out from the token values and the
// grade it earns. A real table, so a screen reader hears the row and column for every reading.
import { ALargeSmall, Check, X } from "lucide-react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { contrastRatio, formatRatio, grade, sameColor } from "@/app/design-system/_kit/contrast";
import { FOREGROUNDS, MATRIX_GROUNDS, type MatrixGround } from "./colour-contrast-data";
import { tint } from "./colour-strip";
import m from "./colour-contrast.module.css";

const ICON = { AAA: Check, AA: Check, "AA large": ALargeSmall, fail: X } as const;

function Cell({ fg, g }: { fg: string; g: MatrixGround }) {
  if (sameColor(fg, g.value)) {
    return (
      <Canvas ground={g.ground} layout="bleed" className={m["ds-cm-cell"]}>
        <span className={m["ds-cm-same"]}>same colour</span>
      </Canvas>
    );
  }
  const ratio = contrastRatio(fg, g.value);
  const verdict = ratio === null ? "fail" : grade(ratio);
  const Icon = ICON[verdict];
  return (
    <Canvas ground={g.ground} layout="bleed" className={m["ds-cm-cell"]}>
      <span className={m["ds-cm-samples"]} style={{ color: fg }} aria-hidden="true">
        <span className={m["ds-cm-14"]}>Aa</span>
        <span className={m["ds-cm-24"]}>Aa</span>
      </span>
      <span className={m["ds-cm-read"]}>
        <span className={m["ds-cm-ratio"]}>{ratio === null ? "unreadable" : formatRatio(ratio)}</span>
        <span className={m["ds-cm-grade"]}>
          <Icon size={14} strokeWidth={2} aria-hidden="true" />
          {verdict}
        </span>
      </span>
    </Canvas>
  );
}

export function ContrastMatrix() {
  return (
    <div className={m["ds-cm-wrap"]}>
      <table className={m["ds-cm"]}>
        <caption className="ds-sr">Each text colour on each ground, with its ratio and grade</caption>
        <thead>
          <tr>
            <th scope="col">Text</th>
            {MATRIX_GROUNDS.map((g) => (
              <th key={g.token} scope="col">
                {g.label}
                <span className={m["ds-cm-hex"]}>{g.value}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FOREGROUNDS.map((f) => (
            <tr key={f.token}>
              <th scope="row">
                <span className={m["ds-cm-fg"]} style={tint(f.value)}>
                  {f.label}
                </span>
                <span className={m["ds-cm-hex"]}>{f.token}</span>
              </th>
              {MATRIX_GROUNDS.map((g) => (
                <td key={g.token}>
                  <Cell fg={f.value} g={g} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "42 pairs" for the caption, counted from the data. */
export const PAIR_COUNT = FOREGROUNDS.length * MATRIX_GROUNDS.length;
