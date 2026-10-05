// Drawer rows that cite the system's own files, held to their needles. A row whose source names a file in
// src/components/design-system must carry an Assertion (sv, tv or system() give it one), so the day that file
// stops writing what the row prints, Coverage turns red. A row with no needle is a failing row here, whether
// it was made by a helper or written as a plain object. A token row citing tokens.ts is exempt, because its
// value is read from tokens.ts itself and cannot drift from it. Rows citing the site's files are held where
// they are made (display-values.ts), and the rest of the site rows are listed in Known gaps.
import { readRepo } from "@/app/design-system/_kit/source";
import type { AssertRow } from "./meta-asserts";
import { shownIn } from "./meta-pins";

const SYS = "src/components/design-system";

type Row = { part: string; value: string; source: string; assert?: unknown };

const isRow = (v: unknown): v is Row =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Row).part === "string" &&
  typeof (v as Row).value === "string" &&
  typeof (v as Row).source === "string";

function rowsIn(v: unknown, out: Row[], depth = 0): void {
  if (depth > 6 || v === null || typeof v !== "object") return;
  if (isRow(v)) {
    out.push(v);
    return;
  }
  for (const child of Array.isArray(v) ? v : Object.values(v)) rowsIn(child, out, depth + 1);
}

/** The system file a source names first, repo-relative, or null when it names another file or none. */
function systemFile(source: string): string | null {
  const name = source.split(":")[0].trim().replace(/^src\//, "");
  if (!name || name === "tokens.ts") return null;
  let file: string | null = null;
  if (name.startsWith("components/design-system/")) file = `src/${name}`;
  else if (!name.includes("/")) file = `${SYS}/${name}`;
  return file && readRepo(file) !== null ? file : null;
}

/** One failing row per drawer row that cites a system file with no needle, deduped across modules. */
export function bareRows(modules: Readonly<Record<string, object>>): AssertRow[] {
  const seen = new Set<string>();
  const out: AssertRow[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const found: Row[] = [];
    rowsIn(Object.values(mod), found);
    for (const r of found) {
      if (r.assert) continue;
      const file = systemFile(r.source);
      const key = `${r.part}|${r.source}`;
      if (!file || seen.has(key)) continue;
      seen.add(key);
      out.push({ kind: "value", file, expected: `${r.part}: a needle`, at: `${r.source}, no needle`, ok: false, shownIn: shownIn(path) });
    }
  }
  return out;
}
