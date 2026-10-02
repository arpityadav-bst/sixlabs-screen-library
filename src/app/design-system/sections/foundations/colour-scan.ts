// The colour sections' source scan. It reads the site's own files on the server, once per build (the guide
// page is force-static), through the kit's one reader (_kit/source.ts) and its cache, and counts where a value
// is written. The drift table, the "in N files" line on a token card and every file:line these sections print
// come from here, so a fix on the site shows in the guide without anyone editing it. Every path is
// repo-relative ("src/components/website/Hero.tsx"). Only server sections import this file.
import { filesDeep, readRepo } from "@/app/design-system/_kit/source";
import type { Token } from "@/components/design-system/tokens";

/** What the scan reads: the site's parts, the floor scene, its CSS and its routes. */
const ROOTS = [
  "src/components/website",
  "src/components/tiles",
  "src/tiles",
  "src/app/globals.css",
  "src/app/website",
  "src/app/6labs-fullview",
  "src/app/tiles",
  "public/tiles/floor-params.json",
] as const;

const TEXT_FILE = /\.(tsx?|jsx?|mjs|css|json)$/;

export type SourceFile = { readonly path: string; readonly text: string };
export type Hits = { readonly files: readonly string[]; readonly uses: number };

let site: SourceFile[] | null = null;

/** A root's text files: the root itself when it is a file, else every file under it. */
const filesOf = (root: string) => (TEXT_FILE.test(root) && readRepo(root) !== null ? [root] : filesDeep(root, TEXT_FILE));

/** Every text file of the site, read once. */
export function siteFiles(): readonly SourceFile[] {
  site ??= ROOTS.flatMap(filesOf).map((path) => ({ path, text: readRepo(path) ?? "" }));
  return site;
}

const everywhere = (re: RegExp) => new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);

/** The files that write a pattern, and how many times it is written in all. */
export function scan(re: RegExp): Hits {
  const g = everywhere(re);
  const files: string[] = [];
  let uses = 0;
  for (const f of siteFiles()) {
    const n = f.text.match(g)?.length ?? 0;
    if (n > 0) {
      files.push(f.path);
      uses += n;
    }
  }
  return { files, uses };
}

/** The first match in one file: its 1-based line and its groups, or undefined when the file no longer says it. */
export function find(path: string, re: RegExp): { line: number; groups: readonly string[] } | undefined {
  const text = readRepo(path);
  if (!text) return undefined;
  const m = new RegExp(re.source, re.flags.replace("g", "")).exec(text);
  if (!m) return undefined;
  return { line: text.slice(0, m.index).split("\n").length, groups: m.slice(1) };
}

/** "Hero.tsx:244" for the first line of a file that matches, or "Hero.tsx, moved" when none does. */
export function at(path: string, re: RegExp): string {
  const name = path.split("/").pop() ?? path;
  const hit = find(path, re);
  return hit ? `${name}:${hit.line}` : `${name}, moved`;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** A Tailwind class as written, never matching a longer class that starts with it ("bg-white" not "bg-white/90"). */
export function classProbe(cls: string): RegExp {
  return new RegExp(`(?<![\\w-])${esc(cls)}(?![\\w/.\\[-])`);
}

/** A hex anywhere, in any case, not as the start of a longer hex. */
export function hexProbe(hex: string): RegExp {
  return new RegExp(`${esc(hex)}(?![0-9a-f])`, "i");
}

/** How a token is found in the site: its hex, or the class the site writes for it, or both. */
function tokenProbe(t: Token): RegExp | undefined {
  if (t.source === "system") return undefined;
  const parts: string[] = [];
  if (/^#[0-9a-f]{6}$/i.test(t.value)) parts.push(hexProbe(t.value).source);
  if (t.utility) parts.push(classProbe(t.utility.replace(/^(?:[\w-]+:)+/, "")).source);
  return parts.length ? new RegExp(parts.join("|"), "i") : undefined;
}

/** The number of site files that write a token, or undefined for a system addition or a value with no probe. */
export function filesFor(t: Token): number | undefined {
  const p = tokenProbe(t);
  return p ? scan(p).files.length : undefined;
}
