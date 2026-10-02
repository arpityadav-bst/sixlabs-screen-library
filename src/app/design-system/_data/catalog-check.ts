// The catalog's build-time checks that need the source: the guide page runs them beside catalogProblems and
// refuses to build on any. Server only (it reads files), so catalog.ts stays pure data for the nav, the index
// card and tools/design-md/build.mjs.
//   1. A section's file must exist and be imported by sections/registry.tsx, so a typo never passes quietly.
//   2. A spec whose source is a system part must be one of its own section's covers, so Coverage and the
//      index card count every part a section specimens. Parts that are pieces of another on purpose
//      (INTERNAL_PARTS) are exempt.
//   3. A whole chapter's DESIGN.md heading must be the one the chapter chip's anchor is built from.
//   4. Every spec source must resolve, name a real export and cite no typed line (spec-lines.ts).
//   5. A cover's states must be the columns its state grids show (catalog-states.ts).
//   6. A frame that promises a live hand (live-check.ts) must be an interactive one.
import { componentsOf, readRepo, reach, resolveImport } from "../_kit/source";
import { specSourceProblems } from "../_kit/spec-lines";
import { INTERNAL_PARTS, SECTIONS } from "./catalog";
import { stateProblems } from "./catalog-states";
import { liveProblems } from "./live-check";

const SYS = "src/components/design-system";
const SYS_SOURCE = /\{\s*from:\s*"@\/components\/design-system\/([\w-]+)"([^}]*)\}/g;
const NAME = /\bname:\s*"([A-Za-z0-9_]+)"/;
const FILE = /\bfile:\s*"([\w.-]+)"/;
const REGISTRY = "src/app/design-system/sections/registry.tsx";
const FROM = /\bfrom\s*["']([^"']+)["']/g;

const internal = new Set(INTERNAL_PARTS.map((p) => `${p.source}#${p.component}`));

/** Every system part a section's files name as a spec source, as `source#component`. */
function sysSources(entry: string): Set<string> {
  const out = new Set<string>();
  for (const file of reach(entry, "src/app/design-system/sections/")) {
    for (const m of (readRepo(file) ?? "").matchAll(SYS_SOURCE)) {
      const rest = m[2];
      const name = NAME.exec(rest)?.[1] ?? m[1];
      const base = FILE.exec(rest)?.[1] ?? `${m[1]}.tsx`;
      // only components count: a token list or a hook cited as a source is not a part
      if (!componentsOf(`${SYS}/${base}`).some((c) => c.component === name)) continue;
      out.add(`${SYS}/${base}#${name}`);
    }
  }
  return out;
}

/** The files the registry imports directly. */
function registered(): Set<string> {
  const out = new Set<string>();
  for (const m of (readRepo(REGISTRY) ?? "").matchAll(FROM)) {
    const file = resolveImport(REGISTRY, m[1]);
    if (file) out.add(file);
  }
  return out;
}

export function sourceProblems(): string[] {
  const out: string[] = [];
  const inRegistry = registered();
  for (const s of SECTIONS) {
    if (readRepo(s.file) === null) out.push(`${s.id}: its file ${s.file} does not exist`);
    else if (!inRegistry.has(s.file)) out.push(`${s.id}: sections/registry.tsx does not import ${s.file}`);
    const covered = new Set(s.covers.map((c) => `${c.source}#${c.component}`));
    for (const key of sysSources(s.file)) {
      if (covered.has(key) || internal.has(key)) continue;
      out.push(`${s.id} specimens ${key.replace(`${SYS}/`, "")} but has no cover for it`);
    }
    if (s.designMd.includes(".")) continue;
    const heading = readRepo(`docs/design-md/${s.id}.md`)?.split("\n")[0]?.replace(/^###\s+/, "").trim();
    const want = s.designMdTitle ?? s.title;
    if (heading && heading !== want) out.push(`${s.id}: DESIGN.md heads chapter ${s.designMd} "${heading}", the catalog says "${want}"`);
  }
  return [...out, ...specSourceProblems(), ...stateProblems(), ...liveProblems()];
}
