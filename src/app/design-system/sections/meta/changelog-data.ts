// The changelog, newest first, read from DESIGN.md's own changelog partial (docs/design-md/changelog.md) as
// the page builds, so the guide and the document can never tell the same day two ways. Each "#### date"
// heading opens an entry and each bullet under it is one change. The newest entry also carries one line
// counted from the catalog, so it describes the guide as it stands rather than a figure typed on the day.
import { readRepo } from "@/app/design-system/_kit/source";
import { catalogCounts } from "@/app/design-system/_data/catalog";

export type Entry = { date: string; title: string; items: readonly string[] };

/** The one source of the changelog, a DESIGN.md partial. */
export const CHANGELOG_MD = "docs/design-md/changelog.md";

/** A bullet's text as plain words: code spans, emphasis and links keep their words and lose their marks. */
const plain = (t: string) =>
  t
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*|\*([^*]+)\*/g, "$1$2")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();

/** The dated entries of the partial, in its order (newest first). A heading may name the entry after its
 *  date ("#### 2026-10-02 · The system"), else the title counts its changes. */
export function parseChangelog(md: string): Entry[] {
  const out: { date: string; title: string; items: string[] }[] = [];
  for (const line of md.split(/\r?\n/)) {
    const head = /^#{2,6}\s+(\d{4}-\d{2}-\d{2})\b[\s·:,.-]*(.*)$/.exec(line);
    if (head) {
      out.push({ date: head[1], title: plain(head[2]), items: [] });
      continue;
    }
    const cur = out[out.length - 1];
    if (!cur) continue;
    const item = /^[-*]\s+(.*)$/.exec(line);
    if (item) cur.items.push(plain(item[1]));
    else if (/^\s{2,}\S/.test(line) && cur.items.length) cur.items[cur.items.length - 1] += ` ${plain(line)}`;
  }
  return out.map((e) => ({ ...e, title: e.title || `${e.items.length} ${e.items.length === 1 ? "change" : "changes"}` }));
}

export function entries(): readonly Entry[] {
  const md = readRepo(CHANGELOG_MD);
  const list = md ? parseChangelog(md) : [];
  if (!list.length) throw new Error(`Changelog: no dated entry in ${CHANGELOG_MD}`);
  const c = catalogCounts();
  const now = `As built: ${c.groups} groups, ${c.sections} sections and ${c.components} parts (${c.shipped} imported from the site, ${c.added} built new), with ${c.states} states shown, counted from the catalog.`;
  return [{ ...list[0], items: [now, ...list[0].items] }, ...list.slice(1)];
}

export const ENTRY_CODE = `<!-- ${CHANGELOG_MD}, newest first -->
#### YYYY-MM-DD

- One line per change, present tense, with the reason when it is not plain.`;
