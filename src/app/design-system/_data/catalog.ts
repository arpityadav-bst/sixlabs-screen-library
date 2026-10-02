// The guide's single source: groups, then sections, in page order. The nav, the page, the index card's
// counts and the coverage table read only this, so they cannot disagree, and nav order is page order (the
// onBlue guide's scroll spy went wrong where the two differed). Pure data with no component imports, so
// src/app/page.tsx can read the counts without pulling in the guide.
import { SITE_IDS, type Cover, type GroupDef, type GroupId, type SectionDef } from "./catalog-types";
import { FOUNDATIONS, MOTION, START } from "./catalog-foundations";
import { EFFECTS, SHELL } from "./catalog-effects";
import { COMPONENTS } from "./catalog-components";
import { META, PATTERNS } from "./catalog-patterns";

export type { Cover, GroupId, SiteId } from "./catalog-types";
export { SITE_IDS } from "./catalog-types";

const DEFS = [START, FOUNDATIONS, MOTION, EFFECTS, SHELL, COMPONENTS, PATTERNS, META] as const;

/** Every section id, as a closed union: a typo in <Section id> or the registry fails tsc. */
export type SectionId = (typeof DEFS)[number]["sections"][number]["id"];

export type CatalogSection = Omit<SectionDef, "id"> & {
  readonly id: SectionId;
  readonly group: GroupId;
  readonly groupTitle: string;
};

export type CatalogGroup = {
  readonly id: GroupId;
  readonly title: string;
  readonly lead: string;
  readonly sections: readonly CatalogSection[];
};

export const GROUPS: readonly CatalogGroup[] = (DEFS as readonly GroupDef[]).map((g) => ({
  id: g.id,
  title: g.title,
  lead: g.lead,
  sections: g.sections.map((s) => ({ ...s, id: s.id as SectionId, group: g.id, groupTitle: g.title })),
}));

export const SECTIONS: readonly CatalogSection[] = GROUPS.flatMap((g) => g.sections);

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map((s) => s.id);

const BY_ID = new Map<string, CatalogSection>(SECTIONS.map((s) => [s.id, s]));

export function sectionById(id: SectionId): CatalogSection {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`design-system catalog has no section "${id}"`);
  return s;
}

/** The states a section's cover of one component lists (empty when the section has no such cover). */
export function statesOf(id: SectionId, component: string): readonly string[] {
  return sectionById(id).covers.find((c) => c.component === component)?.states ?? [];
}

/** "src/components/website/..." and "src/components/tiles/..." ship on the site, the rest is new. */
export const isShipped = (c: Cover) =>
  c.source.startsWith("src/components/website/") || c.source.startsWith("src/components/tiles/");

/** The counts the index card and the overview print. A part covered by two sections counts once,
 *  with the union of its states. */
export function catalogCounts() {
  const parts = new Map<string, { shipped: boolean; states: Set<string> }>();
  for (const s of SECTIONS) {
    for (const c of s.covers) {
      const key = `${c.source}#${c.component}`;
      const p = parts.get(key) ?? { shipped: isShipped(c), states: new Set<string>() };
      for (const st of c.states ?? []) p.states.add(st);
      parts.set(key, p);
    }
  }
  let shipped = 0;
  let states = 0;
  for (const p of parts.values()) {
    if (p.shipped) shipped += 1;
    states += p.states.size;
  }
  return {
    groups: GROUPS.length,
    sections: SECTIONS.length,
    components: parts.size,
    shipped,
    added: parts.size - shipped,
    states,
  };
}

/** The system parts that are pieces of another part on purpose, so no section specimens them on their own:
 *  coverage lists them apart from the parts still owed a specimen. */
export const INTERNAL_PARTS: readonly (Pick<Cover, "component" | "source"> & { readonly of: string })[] = [
  { component: "CardTitle", source: "src/components/design-system/CardParts.tsx", of: "Card" },
  { component: "CardBody", source: "src/components/design-system/CardParts.tsx", of: "Card" },
  { component: "CardMeta", source: "src/components/design-system/CardParts.tsx", of: "Card" },
  { component: "DialogPanel", source: "src/components/design-system/DialogPanel.tsx", of: "Dialog" },
  { component: "TooltipBubble", source: "src/components/design-system/TooltipBubble.tsx", of: "Tooltip" },
  { component: "SelectPanel", source: "src/components/design-system/select-panel.tsx", of: "Select" },
];

/** Ids the guide document must never render at all (the site's scroll and header code looks them up). */
export const FORBIDDEN_IDS = ["players", "model-line", "site-head"] as const;

/** Data mistakes the page refuses to build with: a duplicate id, an id the site already uses, two
 *  sections mounting the same site id, a part marked internal that a section covers, or a state listed as
 *  both shown and not applying. The checks that read the source are in catalog-check.ts. */
export function catalogProblems(): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const ids = [...GROUPS.map((g) => g.id), ...SECTIONS.map((s) => s.id)];
  for (const id of ids) {
    if (seen.has(id)) out.push(`id "${id}" appears twice`);
    if ((SITE_IDS as readonly string[]).includes(id)) out.push(`id "${id}" is a site id`);
    seen.add(id);
  }
  const mounted = new Map<string, string>();
  for (const s of SECTIONS) {
    for (const r of s.renders ?? []) {
      if ((FORBIDDEN_IDS as readonly string[]).includes(r)) out.push(`${s.id} renders forbidden #${r}`);
      const other = mounted.get(r);
      if (other) out.push(`#${r} is rendered by both ${other} and ${s.id}`);
      mounted.set(r, s.id);
    }
    for (const c of s.covers) {
      if (INTERNAL_PARTS.some((p) => p.component === c.component && p.source === c.source)) {
        out.push(`${s.id} covers ${c.component}, which is marked internal`);
      }
      for (const n of c.na ?? []) if (c.states?.includes(n)) out.push(`${s.id}: ${c.component} both shows and waives ${n}`);
    }
  }
  return out;
}
