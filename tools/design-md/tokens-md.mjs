// Chapter 3's tables, generated from tokens.ts: one per token family, then the type roles. Each table ends
// on the section that gives its family's reasons, so a reader who finds a value can go straight to why.

/** Where each family's reasons are written: catalog section ids, or "chapter N" for a chapter of its own. */
const REASONS = {
  accent: ["colour", "chapter 8"],
  ink: ["colour"],
  primary: ["colour"],
  grounds: ["colour", "surfaces"],
  fills: ["colour"],
  text: ["colour", "contrast"],
  lines: ["colour", "elevation"],
  status: ["colour"],
  veils: ["colour"],
  "on-blue": ["colour-special"],
  terminal: ["colour-special"],
  hologram: ["colour-special"],
  fringe: ["colour-special"],
  brand: ["colour-special", "identity"],
  families: ["type"],
  "type-scale": ["type"],
  spacing: ["spacing"],
  layout: ["layout"],
  breakpoints: ["layout", "responsive"],
  radius: ["radius"],
  stroke: ["elevation"],
  shadow: ["elevation"],
  focus: ["focus"],
  icons: ["icons"],
  z: ["layer-stack"],
  eases: ["motion-tokens"],
  durations: ["motion-tokens"],
  springs: ["motion-tokens"],
  travel: ["motion-tokens"],
  scales: ["motion-tokens", "motion-micro"],
  roles: ["type"],
};

const FACE = { display: "Outfit", sans: "Inter", mono: "JetBrains Mono" };
/** Every step in pixels, so the steps column reads one way whatever the media key. */
const AT = {
  "min-561": "from 561",
  md: "from 768",
  "min-901": "from 901",
  lg: "from 1024",
  xl: "from 1280",
  "min-1600": "from 1600",
  "min-1920": "from 1920",
  "min-2560": "from 2560",
  "max-lg": "under 1024",
  "max-md": "under 768",
  short: "short screens",
};

const code = (s) => `\`${s}\``;
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
const table = (head, rows) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join(
    "\n",
  );
/** A source that is a file prints as code, with the class the site writes. "system" and the like print as words. */
const source = (t) =>
  /^[\w@./-]+\.[a-z]+(?::\d+(?:-\d+)?)?$/i.test(t.source) ? code(t.source) + (t.utility ? `, as ${code(t.utility)}` : "") : t.source;
const value = (t) => code(t.value) + (t.srgb ? ` (sRGB ${code(t.srgb)})` : "") + (t.css === false ? ", no CSS" : "");
const name = (t) => code(t.css === false ? t.name : `--ds-${t.name}`);

/**
 * A family's table. When most rows share one Never for, it prints once under the table, and the column
 * keeps a cell only on the rows that differ. When every row shares it, the column goes.
 */
function familyTable(tokens) {
  const tally = new Map();
  for (const t of tokens) tally.set(t.neverFor, (tally.get(t.neverFor) ?? 0) + 1);
  const [top, n] = [...tally].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
  const shared = tokens.length > 1 && n * 2 > tokens.length ? top : null;
  const all = shared !== null && n === tokens.length;
  const head = ["Token", "Value", "Role", "Use for", ...(all ? [] : ["Never for"]), "Source"];
  const never = (t) => (all ? [] : [shared !== null && t.neverFor === shared ? "" : t.neverFor]);
  const rows = tokens.map((t) => [name(t), value(t), t.role, t.useFor, ...never(t), source(t)]);
  const where = all ? "on every row" : "unless its row says otherwise";
  const note = shared === null ? "" : `\n\nNever for, ${where}: ${shared.replace(/\.$/, "")}.`;
  return table(head, rows) + note;
}

/**
 * The sections of chapter 3. `place(id)` gives a reasons target as "Title (N.N)" or "Title (chapter N)",
 * and a family with no entry in REASONS is reported through `warn`.
 */
export function tokenSections({ TOKEN_GROUPS, TYPE_ROLES }, place, warn) {
  const reasons = (id) => {
    const at = (REASONS[id] ?? []).map(place).filter(Boolean);
    if (!at.length) warn(`token family ${id} has no reasons section in tools/design-md/tokens-md.mjs`);
    return at.length ? `\n\nReasons: ${at.join(", ")}.` : "";
  };
  const groups = TOKEN_GROUPS.map((g) => ({ title: g.title, body: familyTable(g.tokens) + reasons(g.id) }));
  const triple = (o) => [o.size, o.leading, o.tracking].filter(Boolean).join(" / ");
  const face = (r) => [`${FACE[r.family]} ${r.weight}`, r.caps && "caps", r.tabular && "tabular"].filter(Boolean).join(", ");
  const steps = (r) => (r.steps?.length ? r.steps.map((st) => `${AT[st.at] ?? st.at}: ${triple(st)}`).join(", ") : "none");
  groups.push({
    title: "Type roles",
    body:
      table(
        ["Role", "Face", "Size / leading / tracking", "Steps", "What it is", "Use for", "Never for", "Source"],
        TYPE_ROLES.map((r) => [code(`--ds-type-${r.name}-*`), face(r), code(triple(r)), steps(r), r.role, r.useFor, r.neverFor, source(r)]),
      ) + reasons("roles"),
  });
  return groups;
}
