// Checks on the partials that report without failing the build: the ten labels every part's chapter
// carries and their order, and the --ds-* names the prose mentions, which must be names TokenStyle prints.

/** The template of a part's chapter (chapters 6 and 7, and a part nested anywhere), in its reading order. */
export const LABELS = ["Purpose", "Anatomy", "Variants", "Sizes", "States", "Props", "Motion", "Accessibility", "Responsive", "Do / Don't"];

const RANK = new Map(LABELS.map((l, i) => [l.toLowerCase(), i]));

/**
 * The labels a part's text opens its paragraphs with, in reading order. A label may join two
 * ("**Variants and sizes.**"), name a sub-part first ("**Back to top: anatomy.**") or a part after
 * ("**Anatomy, Select.**"). A #### heading counts as a label too ("#### Do / Don't").
 */
function labelsIn(body) {
  const found = [];
  for (const line of body.split("\n")) {
    const bold = /^\*\*([^*\n]+?)\.?\*\*/.exec(line);
    const head = /^#### (.+)$/.exec(line);
    if (bold) {
      const text = bold[1].toLowerCase().replace(/^[^:]*: /, "");
      for (const part of text.split(/, | and /)) found.push(part.trim());
    } else if (head) {
      found.push(head[1].trim().toLowerCase());
    }
  }
  return found;
}

/** The labels of the template a part's text does not open a paragraph with. */
export function missingLabels(body) {
  const found = new Set(labelsIn(body));
  return LABELS.filter((l) => !found.has(l.toLowerCase()));
}

/** The first label that comes after one it should precede, as "Props before Variants", or null. */
export function labelOrder(body) {
  let last = -1;
  for (const l of labelsIn(body)) {
    const r = RANK.get(l);
    if (r === undefined) continue;
    if (r < last) return `${LABELS[last]} before ${LABELS[r]}`;
    last = r;
  }
  return null;
}

/**
 * A partial split into its own text and the parts nested in it: each #### block whose first paragraph is
 * a **Purpose.**, up to the next #### heading. The nested parts are checked on their own.
 */
export function nestedParts(body) {
  const lines = body.split("\n");
  const own = [];
  const parts = [];
  let part = null;
  for (let i = 0; i < lines.length; i++) {
    const head = /^#### (.+)$/.exec(lines[i]);
    if (head) {
      const next = lines.slice(i + 1).find((l) => l.trim());
      part = next?.startsWith("**Purpose.**") ? { title: head[1].trim(), lines: [] } : null;
      if (part) {
        parts.push(part);
        continue;
      }
    }
    (part ? part.lines : own).push(lines[i]);
  }
  return { own: own.join("\n"), parts: parts.map((p) => ({ title: p.title, body: p.lines.join("\n") })) };
}

/** The warnings for one part's text: labels it lacks, and labels out of the template's order. */
export function partWarnings(body, where) {
  const out = [];
  const miss = missingLabels(body);
  if (miss.length) out.push(`${where} has no ${miss.join(", ")}`);
  const order = labelOrder(body);
  if (order) out.push(`${where} puts ${order}, against the template's order`);
  return out;
}

/**
 * Every --ds-* name the text mentions that TokenStyle does not print. `printed` holds the custom
 * properties it writes and `jsOnly` the token names that have no CSS (a spring). Patterns such as
 * `--ds-z-*` or `--ds-type-<role>-size` stand for a family and are not checked.
 */
export function unknownNames(text, printed, jsOnly) {
  const out = [];
  for (const [raw] of text.matchAll(/--ds-[\w<>*-]+/g)) {
    if (/[<*]/.test(raw)) continue;
    const n = raw.replace(/-+$/, "");
    if (printed.has(n)) continue;
    const bare = n.slice(5);
    out.push(jsOnly.has(bare) ? `${n} has no CSS (${bare} exists only in JS)` : `${n} is not a printed token`);
  }
  return [...new Set(out)];
}

/** The custom properties TokenStyle prints, and the token names that print none. */
export function printedNames(TOKEN_GROUPS, TYPE_ROLES) {
  const printed = new Set();
  const jsOnly = new Set();
  for (const g of TOKEN_GROUPS) {
    for (const t of g.tokens) (t.css === false ? jsOnly : printed).add(t.css === false ? t.name : `--ds-${t.name}`);
  }
  for (const r of TYPE_ROLES) {
    for (const p of ["family", "size", "leading", "tracking", "weight", "case", "numeric"]) printed.add(`--ds-type-${r.name}-${p}`);
  }
  return { printed, jsOnly };
}
