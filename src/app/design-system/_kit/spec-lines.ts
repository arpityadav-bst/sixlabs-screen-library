// The line every spec source's chip cites, read from the source at build, so a spec head's file:line chip
// follows the file instead of a number typed by hand: the export's own line, or with `at`, the line that text
// is written on. The guide page (a server component, prerendered) builds the map once and hands it to
// ExportLines, which the identity chips read, and refuses to build on any source problem below. Server only.
import { exportLine, filesDeep, lineAt, locate, readRepo } from "./source";
import { isIdentifier, sourceFile, sourceKey, type SpecSource } from "./spec-source";

const SOURCE = /\{\s*from:\s*"(@\/[^"]+)"([^}]*)\}/g;
const NAME = /\bname:\s*"([^"]*)"/;
const FILE = /\bfile:\s*"([\w.-]+)"/;
const AT = /\bat:\s*("(?:[^"\\]|\\.)*")/;
const LINE = /\bline:\s*(\d+)/;

/** A field written as code (`name: exportName`, a shorthand `file`, `line: hit?.line`): the source is built at
 *  build by its section, so only the parts written as literals can be read here. */
const COMPUTED = /\b(name|file|at|line)\b(?!:\s*(?:"|\d))/;

type Found = { where: string; s: SpecSource; computed: boolean };

const unquote = (lit: string) => {
  try {
    return JSON.parse(lit) as string;
  } catch {
    return lit.slice(1, -1);
  }
};

let scanned: Found[] | null = null;

/** Every `{ from, ... }` source literal the sections write, with the file:line it is written on. */
function scan(): Found[] {
  if (scanned) return scanned;
  const out: Found[] = [];
  for (const file of filesDeep("src/app/design-system/sections", /\.tsx?$/)) {
    const text = readRepo(file) ?? "";
    for (const m of text.matchAll(SOURCE)) {
      const rest = m[2];
      const at = AT.exec(rest)?.[1];
      const line = LINE.exec(rest)?.[1];
      const s: SpecSource = {
        from: m[1],
        name: NAME.exec(rest)?.[1],
        file: FILE.exec(rest)?.[1],
        ...(at ? { at: unquote(at) } : {}),
        ...(line ? { line: Number(line) } : {}),
      };
      const where = `${file.replace("src/app/design-system/", "")}:${lineAt(text, m.index ?? 0)}`;
      out.push({ where, s, computed: COMPUTED.test(rest.replace(/"(?:[^"\\]|\\.)*"/g, '""')) });
    }
  }
  scanned = out;
  return out;
}

/** The line a source's chip cites, or undefined when it cites none (no export named, no needle found). */
function citedLine(s: SpecSource): number | undefined {
  const file = sourceFile(s);
  if (s.at) return locate(file, s.at) ?? undefined;
  return s.name ? exportLine(file, s.name) : undefined;
}

let memo: Record<string, number> | null = null;

/** sourceKey to the 1-based line its chip cites, for every source the sections write. */
export function specLines(): Readonly<Record<string, number>> {
  if (memo) return memo;
  const out: Record<string, number> = {};
  for (const { s, computed } of scan()) {
    if (computed) continue;
    const line = citedLine(s);
    if (line !== undefined) out[sourceKey(s)] = line;
  }
  memo = out;
  return out;
}

/** Sources the build refuses: a file that does not exist, a name the file does not export, a needle the file
 *  no longer holds, and a typed line (which drifts) without a needle or that differs from its needle's line.
 *  A source built by code is its section's to check, so it is skipped. */
export function specSourceProblems(): string[] {
  const out: string[] = [];
  for (const { where, s, computed } of scan()) {
    if (computed) continue;
    const file = sourceFile(s);
    if (readRepo(file) === null) {
      out.push(`${where}: source ${s.from}${s.file ? ` (file ${s.file})` : ""} names ${file}, which does not exist`);
      continue;
    }
    const exported = s.name && isIdentifier(s.name) ? exportLine(file, s.name) : undefined;
    if (s.name !== undefined && exported === undefined) {
      out.push(`${where}: ${file} does not export "${s.name}" (a point inside a file takes label, not name)`);
    }
    const at = s.at === undefined ? null : locate(file, s.at);
    if (s.at !== undefined && at === null) out.push(`${where}: at "${s.at}" is not in ${file}`);
    if (s.line === undefined) continue;
    if (s.at === undefined) {
      const own =
        exported === undefined ? "" : exported === s.line ? ", the export's own line, so drop it" : ` (the export starts on ${exported})`;
      out.push(`${where}: types line ${s.line}${own}. A line inside the part takes an at needle instead`);
    } else if (at !== null && at !== s.line) {
      out.push(`${where}: types line ${s.line} but at "${s.at}" is on line ${at}, so drop the line`);
    }
  }
  return out;
}
