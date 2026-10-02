// What the jump field searches, built once from the catalog and the token list: each section's title, group,
// sub-label and id, the parts it covers (every cover's export) and the site ids it mounts, every token's CSS
// name filed under the section that shows its tier, and a few words a reader types for a rule (z-index,
// shadow, accent rule). A hit found through anything but the section's own words names what matched, on the
// option's right. Sections whose own words match come first, then the rest, each in page order.
import { TOKEN_GROUPS, TYPE_ROLES } from "@/components/design-system/tokens";
import { SECTIONS, type CatalogSection, type SectionId } from "../_data/catalog";

export type Hit = { s: CatalogSection; part?: string };

/** The section that shows each token tier. A tier left out here is found by its section's own words. */
const TIER_SECTION: Partial<Record<string, SectionId>> = {
  accent: "colour",
  ink: "colour",
  primary: "colour",
  grounds: "colour",
  fills: "colour",
  text: "colour",
  lines: "colour",
  status: "colour",
  veils: "colour",
  "on-blue": "colour-special",
  terminal: "colour-special",
  hologram: "colour-special",
  fringe: "colour-special",
  brand: "colour-special",
  families: "type",
  "type-scale": "type",
  spacing: "spacing",
  layout: "layout",
  breakpoints: "layout",
  radius: "radius",
  stroke: "elevation",
  shadow: "elevation",
  focus: "focus",
  icons: "icons",
  z: "layer-stack",
  eases: "motion-tokens",
  durations: "motion-tokens",
  springs: "motion-tokens",
  travel: "motion-tokens",
};

/** Words for a rule that no title holds, each with the section it lives in. */
const ALIASES: readonly { words: string; at: SectionId }[] = [
  { words: "accent rule", at: "surfaces" },
  { words: "z-index", at: "layer-stack" },
  { words: "shadow", at: "elevation" },
  { words: "elevation", at: "elevation" },
  { words: "breakpoint", at: "layout" },
  { words: "reduced motion", at: "motion-reduced" },
];

type Entry = { s: CatalogSection; text: string; names: string[] };

function build(): Entry[] {
  const extra = new Map<string, string[]>();
  const add = (id: string, name: string) => extra.set(id, [...(extra.get(id) ?? []), name]);
  for (const g of TOKEN_GROUPS) {
    const at = TIER_SECTION[g.id];
    if (at) for (const t of g.tokens) add(at, `--ds-${t.name}`);
  }
  for (const r of TYPE_ROLES) add("type", `--ds-type-${r.name}`);
  for (const a of ALIASES) add(a.at, a.words);
  return SECTIONS.map((s) => ({
    s,
    text: `${s.title} ${s.groupTitle} ${s.sub ?? ""} ${s.id}`.toLowerCase(),
    names: [...new Set([...s.covers.map((c) => c.component), ...(s.renders ?? []), ...(extra.get(s.id) ?? [])])],
  }));
}

const HAY = build();

/** Up to `max` sections for a query: every word must be in the section's words or in one of its names. */
export function matches(q: string, max: number): Hit[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const own: Hit[] = [];
  const via: Hit[] = [];
  for (const h of HAY) {
    const lower = h.names.map((n) => n.toLowerCase());
    if (!words.every((w) => h.text.includes(w) || lower.some((n) => n.includes(w)))) continue;
    const outside = words.filter((w) => !h.text.includes(w));
    if (!outside.length) {
      own.push({ s: h.s });
      continue;
    }
    // the name that holds the most of the words the section's own text does not
    let best = -1;
    let part: string | undefined;
    lower.forEach((n, i) => {
      const held = outside.filter((w) => n.includes(w)).length;
      if (held > best) {
        best = held;
        part = h.names[i];
      }
    });
    via.push({ s: h.s, part });
  }
  return [...own, ...via].slice(0, max);
}
