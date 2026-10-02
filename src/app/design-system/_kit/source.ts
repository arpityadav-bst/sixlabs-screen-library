// The guide's one reader of the repo's own source, for build-time facts: a file's text, the files of a
// folder, where a needle is written and the line an export starts on. Paths are repo-relative ("src/..."),
// text is read once and cached with LF line ends. The guide page is prerendered (force-static), so every
// read runs once, at build. Server only: a client module must never import this file.
import { readdirSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";

const ROOT = process.cwd();
const cache = new Map<string, string | null>();

/** A repo file with LF line ends, or null when it is missing or a folder. */
export function readRepo(rel: string): string | null {
  if (!cache.has(rel)) {
    let text: string | null = null;
    try {
      text = readFileSync(join(/*turbopackIgnore: true*/ ROOT, rel), "utf8").split("\r\n").join("\n");
    } catch {
      text = null;
    }
    cache.set(rel, text);
  }
  return cache.get(rel) ?? null;
}

/** The 1-based line of a character index in a text. */
export const lineAt = (text: string, index: number) => text.slice(0, index).split("\n").length;

/** The 1-based line of the first place the needle is written, or null when the file no longer says it. */
export function locate(rel: string, needle: string): number | null {
  const text = readRepo(rel);
  if (text === null) return null;
  const i = text.indexOf(needle);
  return i < 0 ? null : lineAt(text, i);
}

/** The files of one folder (not its subfolders), repo-relative, sorted. */
export function filesIn(dir: string, ext = /\.(tsx?|jsx?|css)$/): string[] {
  try {
    return readdirSync(join(/*turbopackIgnore: true*/ ROOT, dir), { withFileTypes: true })
      .filter((d) => d.isFile() && ext.test(d.name))
      .map((d) => `${dir}/${d.name}`)
      .sort();
  } catch {
    return [];
  }
}

/** Every file under a folder, its subfolders included, repo-relative, sorted. */
export function filesDeep(dir: string, ext = /\.(tsx?|jsx?|css|md)$/): string[] {
  let out: string[] = [];
  try {
    for (const d of readdirSync(join(/*turbopackIgnore: true*/ ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${d.name}`;
      if (d.isDirectory()) out = out.concat(filesDeep(rel, ext));
      else if (ext.test(d.name)) out.push(rel);
    }
  } catch {
    return out;
  }
  return out.sort();
}

// A function component, or an arrow / forwardRef / memo const whose name reads as a component.
const EXPORT_RE =
  /^export (?:default )?(?:async )?function ([A-Z][A-Za-z0-9]*)|^export const ([A-Z][a-z][A-Za-z0-9]*)\s*(?::[^=\n]+)?=\s*(?:\(|forwardRef|memo)/gm;

/** The components a file exports, each with the line it starts on. */
export function componentsOf(rel: string): { component: string; line: number }[] {
  const text = readRepo(rel);
  if (text === null) return [];
  return [...text.matchAll(EXPORT_RE)].map((m) => ({ component: m[1] ?? m[2], line: lineAt(text, m.index ?? 0) }));
}

/** The line a named export starts on, for a spec's file:line chip, or undefined when the file does not
 *  export it (any export: a component, a function, a const, a class or a type). */
export function exportLine(rel: string, name: string): number | undefined {
  const text = readRepo(rel);
  if (text === null) return undefined;
  const re = new RegExp(`^export (?:default )?(?:async )?(?:function|const|let|class|type|interface|enum) ${name}\\b`, "m");
  const m = re.exec(text);
  return m ? lineAt(text, m.index) : undefined;
}

const IMPORT_RE = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|^\s*import\s+["']([^"']+)["']/gm;
const EXTS = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts"];

/** The repo file an import names, from the file that writes it, or null for a package. */
export function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = `src/${spec.slice(2)}`;
  else if (spec.startsWith(".")) base = posix.normalize(posix.join(posix.dirname(from), spec));
  else return null;
  for (const ext of EXTS) if (readRepo(base + ext) !== null) return base + ext;
  return null;
}

/** Every repo file a module reaches through its imports, itself included, staying inside `within`. */
export function reach(entry: string, within = "src/"): Set<string> {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length) {
    const file = queue.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const m of (readRepo(file) ?? "").matchAll(IMPORT_RE)) {
      const next = resolveImport(file, m[1] ?? m[2] ?? m[3]);
      if (next && next.startsWith(within) && !seen.has(next)) queue.push(next);
    }
  }
  return seen;
}
