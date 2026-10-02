// One WCAG reading: a sample of the colour on its ground, the ratio to two decimals and the grade. The
// sample is the ground itself, so the badge says which ground without a word, and the ground's name is
// still there for a screen reader. A text colour is graded AAA, AA, AA large or fail (1.4.3). A ring, a
// field line or a mark (kind "non-text") is graded pass or fail at 3:1 (1.4.11), and its sample is a line,
// not letters. Works in server and client sections alike.
import { contrastRatio, formatRatio, grade, groundColor, isGround, nonTextGrade, type GroundName } from "./contrast";

export type ContrastKind = "text" | "non-text";

export type ContrastBadgeProps = {
  /** the colour under test (text, icon or line), any CSS hex or rgb() */
  fg: string;
  /** a ground name (page, surface, container, navy) or any colour */
  bg: GroundName | string;
  /** names the ground for assistive tech when bg is a raw colour */
  bgName?: string;
  /** text (the default) or a ring, line or mark, graded at 3:1 */
  kind?: ContrastKind;
};

export function ContrastBadge({ fg, bg, bgName, kind = "text" }: ContrastBadgeProps) {
  const ground = groundColor(bg);
  const name = bgName ?? (isGround(bg) ? bg : ground);
  const ratio = contrastRatio(fg, ground);
  if (ratio === null) {
    return <span className="ds-cb ds-cb--fail">unreadable colour</span>;
  }
  const line = kind === "non-text";
  const g = line ? nonTextGrade(ratio) : grade(ratio);
  const r = formatRatio(ratio);
  const bar = line ? ", a line or mark, needs 3:1" : "";
  return (
    <span className="ds-cb" data-grade={g.replace(" ", "-")} title={`${r}:1 on ${name} ${ground}${bar}`}>
      <span
        className="ds-cb-sample"
        style={line ? { background: ground, boxShadow: `inset 0 0 0 2px ${fg}` } : { background: ground, color: fg }}
        aria-hidden="true"
      >
        {line ? "" : "Aa"}
      </span>
      <span className="ds-cb-ratio">{r}</span>
      <span className="ds-cb-grade">{line ? `3:1 ${g}` : g}</span>
      <span className="ds-sr">
        {" "}
        on {name}
        {bar}
      </span>
    </span>
  );
}

/** The four badges of one colour against the guide's grounds, in a wrapping row. */
export function ContrastRow({
  fg,
  grounds = ["page", "surface", "container", "navy"],
  kind,
}: {
  fg: string;
  grounds?: readonly (GroundName | string)[];
  kind?: ContrastKind;
}) {
  return (
    <span className="ds-cb-row">
      {grounds.map((bg) => (
        <ContrastBadge key={bg} fg={fg} bg={bg} kind={kind} />
      ))}
    </span>
  );
}
