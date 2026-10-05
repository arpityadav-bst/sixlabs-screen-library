// The coverage report: the catalog's covers matched against the exported components the source scan finds,
// with the states each part shows against the five every control owes (an owed state a cover marks n/a, such
// as a field's pressed, counts as met and prints as n/a), and the site pages it ships on. A part that is a
// piece of another on purpose (INTERNAL_PARTS) owes neither a specimen nor states, and is listed apart.
// Nothing here is typed by hand except the state names and their synonyms.
import { GROUPS, INTERNAL_PARTS, SECTIONS, catalogCounts, type Cover } from "@/app/design-system/_data/catalog";
import { assertionReport } from "./meta-asserts";
import { allExports, shipsOn, specsIn, type ExportedPart } from "./meta-scan";

/** The five states every control owes. Rest is shown by any specimen of the part. */
export const REQUIRED = ["rest", "hover", "focus-visible", "pressed", "disabled"] as const;

/** The state names sections use for the same required state. */
const SYNONYMS: Record<(typeof REQUIRED)[number], readonly string[]> = {
  rest: [],
  hover: ["hover", "checked-hover"],
  "focus-visible": ["focus-visible", "focus"],
  pressed: ["pressed", "row-pressed", "dragging"],
  disabled: ["disabled"],
};

export type PartRow = ExportedPart & {
  sections: { id: string; title: string }[];
  variants: string[];
  states: string[];
  /** owed states the covers mark as not applying to this part */
  na: string[];
  missing: string[];
  ships: string[];
};

const key = (source: string, component: string) => `${source}#${component}`;
/** A part's file without the src/components/ prefix, for the tables and the worklist. */
export const short = (source: string) => source.replace(/^src\/components\//, "");

function owed(interactive: boolean, covered: boolean, states: readonly string[], na: readonly string[]): string[] {
  if (!interactive) return [];
  return REQUIRED.filter((r) => !na.includes(r) && (r === "rest" ? !covered : !SYNONYMS[r].some((s) => states.includes(s))));
}

let memo: ReturnType<typeof build> | null = null;

function build() {
  const covers = new Map<string, { cover: Cover; sections: { id: string; title: string }[] }[]>();
  for (const s of SECTIONS) {
    for (const c of s.covers) {
      const k = key(c.source, c.component);
      const list = covers.get(k) ?? [];
      list.push({ cover: c, sections: [{ id: s.id, title: s.title }] });
      covers.set(k, list);
    }
  }

  const parts = allExports();
  const known = new Set(parts.map((p) => key(p.source, p.component)));
  const internal = new Set(INTERNAL_PARTS.map((p) => key(p.source, p.component)));
  const isInternal = (p: ExportedPart) => internal.has(key(p.source, p.component));
  const rows: PartRow[] = parts.map((p) => {
    const hits = covers.get(key(p.source, p.component)) ?? [];
    const variants = [...new Set(hits.flatMap((h) => h.cover.variants ?? []))];
    const states = [...new Set(hits.flatMap((h) => h.cover.states ?? []))];
    const na = [...new Set(hits.flatMap((h) => h.cover.na ?? []))].filter((n) => (REQUIRED as readonly string[]).includes(n));
    return {
      ...p,
      sections: hits.flatMap((h) => h.sections),
      variants,
      states,
      na,
      missing: isInternal(p) ? [] : owed(p.interactive, hits.length > 0, states, na),
      ships: p.dir === "src/components/design-system" ? [] : shipsOn(p.source),
    };
  });

  const covered = rows.filter((r) => r.sections.length > 0);
  const owing = rows.filter((r) => !isInternal(r));
  const controls = owing.filter((r) => r.interactive);
  const owedTotal = controls.length * REQUIRED.length;
  const owedShown = controls.reduce((n, r) => n + REQUIRED.length - r.missing.length, 0);
  // a cover naming an export the scan cannot find: a rename the catalog has not caught up with
  const unresolved = [...covers.keys()].filter((k) => !known.has(k)).map((k) => k.replace("#", " · "));
  const asserts = assertionReport();

  return {
    rows,
    shipped: covered.filter((r) => r.dir !== "src/components/design-system"),
    system: covered.filter((r) => r.dir === "src/components/design-system"),
    uncovered: owing.filter((r) => r.sections.length === 0),
    internal: rows.filter(isInternal).map((r) => ({ ...r, of: INTERNAL_PARTS.find((p) => key(p.source, p.component) === key(r.source, r.component))?.of ?? "" })),
    unresolved,
    exported: rows.length,
    /** the exports that owe a specimen: every one but the internal parts */
    owing: owing.length,
    specimened: covered.length,
    percent: owing.length ? Math.round((covered.length / owing.length) * 100) : 0,
    owedTotal,
    owedShown,
    asserts,
  };
}

/** The report, built once per build. */
export function coverageReport() {
  memo ??= build();
  return memo;
}

/** One table row for SpecTable. */
export function partCells(r: PartRow) {
  return {
    part: `<${r.component}>`,
    source: `${short(r.source)}:${r.line}`,
    sections: r.sections,
    variants: r.variants.length ? r.variants.join(" ") : "",
    states: r.states,
    owed: r.interactive ? `${REQUIRED.length - r.missing.length}/${REQUIRED.length}` : "",
    missing: r.missing,
    na: r.interactive ? r.na : [],
    ships: r.ships.join(" · "),
  };
}

/** The group doors on the overview: each group but Start, its sections and its spec panels. */
export function groupDoors() {
  return GROUPS.filter((g) => g.id !== "start").map((g) => {
    const folder = g.sections[0]?.file.split("/").slice(-2, -1)[0] ?? g.id;
    return {
      id: g.id,
      title: g.title,
      sections: g.sections.length,
      specs: specsIn(folder),
      names: g.sections.slice(0, 3).map((s) => s.title),
    };
  });
}

/** The headline numbers: what the catalog shows and how much of the source that is. */
export function headline() {
  const c = catalogCounts();
  const r = coverageReport();
  return { ...c, percent: r.percent, exported: r.exported, owing: r.owing, specimened: r.specimened };
}

export const COVERAGE_COLUMNS = ["Part", "Source", "Shown in", "Variants", "States", "Owed", "Ships on"];

export const METHOD_ROWS = [
  { key: "Exports", value: "exported function and component consts in the .tsx files of the three folders" },
  { key: "Covered", value: "listed in a catalog section's covers" },
  { key: "Internal", value: "a piece of another part on purpose (INTERNAL_PARTS), listed apart, owing no specimen and no states" },
  { key: "Control", value: "renders a native control or a control role itself" },
  { key: "Owed", value: "rest, hover, focus-visible, pressed, disabled, less any a cover marks n/a for the part" },
  { key: "Ships on", value: "reached by the import graph of the website or fullview page" },
  { key: "Assertions", value: "exact text still in its file, or a token's value on the line it cites" },
  { key: "Pins", value: "every Anatomy pin's file:line inside its file, its hooks still written there or beside it" },
  { key: "Modules", value: "every data file under sections/ walked by Coverage, and no pin list kept in a section file" },
] as const;
