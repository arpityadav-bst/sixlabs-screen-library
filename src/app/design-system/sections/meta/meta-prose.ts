// The prose a code file carries, read at build: its comments and its JSX text, found by the TypeScript
// parser so a string, a regex or a type is never mistaken for a comment. CSS keeps only block comments,
// read as written. Conventions counts the files whose prose holds a semicolon, which the house rule bans.
// Backtick spans and HTML entities are code inside the prose, so they are taken out before the count.
import ts from "typescript";
import { filesDeep, readRepo } from "@/app/design-system/_kit/source";

const CODE_SPAN = /`[^`\n]*`/g;
const ENTITY = /&(?:#\d+|#x[\da-f]+|[a-z]+);/gi;

const kindOf = (file: string) =>
  /\.tsx$/.test(file) ? ts.ScriptKind.TSX : /\.jsx$/.test(file) ? ts.ScriptKind.JSX : /\.(mjs|cjs|js)$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS;

/** Every comment and JSX text run of a script, each once. */
function scriptProse(file: string, text: string): string[] {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false, kindOf(file));
  const seen = new Set<number>();
  const out: string[] = [];
  const take = (ranges: readonly ts.CommentRange[] | undefined) => {
    for (const r of ranges ?? []) {
      if (seen.has(r.pos)) continue;
      seen.add(r.pos);
      out.push(text.slice(r.pos, r.end));
    }
  };
  // every token, so a comment inside JSX braces or before a closing bracket is reached too
  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.JsxText) {
      const t = (node as ts.JsxText).text;
      if (t.trim()) out.push(t);
      return;
    }
    take(ts.getLeadingCommentRanges(text, node.pos));
    take(ts.getTrailingCommentRanges(text, node.end));
    for (const child of node.getChildren(sf)) visit(child);
  };
  visit(sf);
  return out;
}

/** The prose of one file: a script's comments and JSX text, a stylesheet's block comments. */
export function proseOf(file: string): string[] {
  const text = readRepo(file) ?? "";
  if (file.endsWith(".css")) return [...text.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => m[0]);
  return scriptProse(file, text);
}

/** How many semicolons a file's prose holds, once code spans and entities are out. */
export function proseSemicolons(file: string): number {
  return proseOf(file)
    .map((t) => t.replace(CODE_SPAN, "").replace(ENTITY, ""))
    .reduce((n, t) => n + (t.match(/;/g) ?? []).length, 0);
}

/** The files of these folders whose prose holds a semicolon, with the count, and how many were read. */
export function semicolonFiles(dirs: readonly string[]): { files: { file: string; n: number }[]; scanned: number } {
  const all = dirs.flatMap((d) => filesDeep(d, /\.(tsx?|jsx?|mjs|cjs|css)$/));
  const files = all.map((file) => ({ file, n: proseSemicolons(file) })).filter((f) => f.n > 0);
  return { files, scanned: all.length };
}
