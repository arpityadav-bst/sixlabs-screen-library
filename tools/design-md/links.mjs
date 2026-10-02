// Heading anchors and cross-reference links for DESIGN.md. A reference names its section and gives the
// number in brackets, as in "Tile states (5.3)", says "chapter 3", or cites "decision 4", and the linker
// turns each into a link to its heading. A number that resolves to nothing is an error, and so is a bracket
// whose lead-in does not name its target: after a renumber an old number lands on a different section, and
// the lead-in is how the build tells.
import { slug } from "./slug.mjs";

export { slug };

/** Letters and digits only, so "Shell behaviours" matches "the shell **behaviours**". */
const words = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

/** The anchors GitHub gives a document's headings, in order, with its -1, -2 suffixes on repeats. */
export function headingAnchors(lines) {
  const seen = new Map();
  const out = [];
  let fenced = false;
  lines.forEach((line, i) => {
    if (line.startsWith("```")) fenced = !fenced;
    const m = !fenced && /^(#{1,6}) (.+)$/.exec(line);
    if (!m) return;
    const base = slug(m[2]);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.push({ line: i, level: m[1].length, text: m[2], anchor: n ? `${base}-${n}` : base });
  });
  return out;
}

/**
 * A linker over the document's numbers. `refs` maps "5.3" and "5" to `{ anchor, title }`, `decisions`
 * maps "4" to the anchor of decision 4, `withSections` holds the chapters that have numbered sections, and
 * `maxChapter` is the last chapter. Problems go to the caller's `errors` and `warnings`.
 */
export function makeLinker({ refs, decisions = new Map(), withSections, maxChapter, errors, warnings }) {
  let count = 0;

  function segment(seg, where) {
    const out = seg.replace(/\((\d{1,2})\.(\d{1,2})\)/g, (m, major, minor, at) => {
      const num = `${major}.${minor}`;
      const ref = refs.get(num);
      if (ref) {
        if (!words(seg.slice(Math.max(0, at - 160), at)).endsWith(words(ref.title))) {
          errors.push(`${where}: "(${num})" should follow its section's title, ${ref.title}`);
        }
        count++;
        return `([${num}](#${ref.anchor}))`;
      }
      // A value in brackets (0.6, 1.3, 0.05) is not a reference: chapters 0 and 1 have no sections, and a
      // minor written with a leading zero is never a section number.
      if (!minor.startsWith("0") && (withSections.has(major) || Number(major) > maxChapter)) {
        errors.push(`${where}: no section ${num}`);
      }
      return m;
    });
    return out
      .replace(/\b([Cc]hapter) (\d{1,2})(\.\d{1,2})?\b/g, (m, word, num, minor) => {
        if (minor) {
          warnings.push(`${where}: "${m}" names a section, so write its title and (${num}${minor})`);
          return m;
        }
        const ref = refs.get(num);
        if (!ref) {
          errors.push(`${where}: no chapter ${num}`);
          return m;
        }
        count++;
        return `[${word} ${num}](#${ref.anchor})`;
      })
      .replace(/\b([Dd]ecision) (\d{1,2})\b/g, (m, word, num) => {
        const anchor = decisions.get(num);
        if (!anchor) {
          errors.push(`${where}: no decision ${num} in Decisions pending`);
          return m;
        }
        count++;
        return `[${word} ${num}](#${anchor})`;
      });
  }

  /** Links the references in prose, leaving code spans, fenced blocks and headings alone. */
  function linkify(md, where) {
    let fenced = false;
    return md
      .split("\n")
      .map((line) => {
        if (line.startsWith("```")) fenced = !fenced;
        if (fenced || line.startsWith("```") || /^#{1,6} /.test(line)) return line;
        return line
          .split("`")
          .map((seg, i) => (i % 2 ? seg : segment(seg, where)))
          .join("`");
      })
      .join("\n");
  }

  return { linkify, count: () => count };
}
