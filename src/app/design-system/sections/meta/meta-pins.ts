// Every Anatomy pin the data modules export, held to its source at build: the cited file must exist and each
// line it names must be inside it, the pin's `expect` (the text the part is drawn from) must still be written
// on one of those lines, and each hook the selector leans on (a data-slot, a data-part or a site class) must
// still be written in the cited file or a file beside it that it imports or is imported by. A pin with no
// `expect` fails, because without it nothing reads the cited line and a cite to a brace or a blank passes.
// The browser's "pin lost" row only fires when someone opens the section, so this is the check that always
// runs. It also holds the module list to the folder: a data file Coverage does not walk is a failing row.
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import { SECTIONS } from "@/app/design-system/_data/catalog";
import type { AssertRow } from "./meta-asserts";
import { filesDeep, filesIn, readRepo } from "@/app/design-system/_kit/source";

const SECTIONS_DIR = "src/app/design-system/sections";
const COLLECTABLE = /(-data|-pins)\.ts$|\/_data\/[^/]+\.ts$/;
/** This check's own files, which hold no values. */
const OWN = /\/meta\/meta-[\w-]+\.ts$/;
/** "Hero.tsx:125", "CtaDots.tsx:14-17,98": a file and the lines it names, which may be left off. */
const CITED = /^([\w./@-]+\.(?:tsx?|jsx?|mjs|cjs|css|json|md))(?::(\d+(?:-\d+)?(?:,\s*\d+(?:-\d+)?)*))?$/;

/** The section title a module's values show in, or its path when no section shares its name. */
export function shownIn(path: string): string {
  const parts = path.split("/");
  const name = (parts.pop() ?? path).replace(/-(data|pins)$/, "");
  const folder = parts.filter((p) => p !== "_data").join("/");
  const sec =
    SECTIONS.find((s) => s.file === `${SECTIONS_DIR}/${folder}/${name}.tsx`) ?? SECTIONS.find((s) => s.id === name);
  return sec ? sec.title : path;
}

const isPin = (v: unknown): v is AnatomyPin =>
  typeof v === "object" && v !== null && typeof (v as AnatomyPin).selector === "string" && typeof (v as AnatomyPin).name === "string";

function pinsIn(v: unknown, out: AnatomyPin[], depth = 0): void {
  if (depth > 6 || v === null || typeof v !== "object") return;
  if (isPin(v)) {
    out.push(v);
    return;
  }
  for (const child of Array.isArray(v) ? v : Object.values(v)) pinsIn(child, out, depth + 1);
}

let index: Map<string, string[]> | null = null;

/** Repo files by base name, so "Hero.tsx" finds src/components/website/Hero.tsx. */
function byName(name: string): string[] {
  index ??= ["src", "tools", "public/tiles"]
    .flatMap((d) => filesDeep(d, /\.(tsx?|jsx?|mjs|cjs|css|json|md)$/))
    .reduce((m, f) => {
      const b = f.split("/").pop() ?? f;
      m.set(b, [...(m.get(b) ?? []), f]);
      return m;
    }, new Map<string, string[]>());
  return index.get(name) ?? [];
}

/** The files a cited path may mean: a path from src/ or the repo, or every file of that base name. */
function candidates(cited: string): string[] {
  if (!cited.includes("/")) return byName(cited);
  const exact = [`src/${cited}`, cited].filter((f) => readRepo(f) !== null);
  return exact.length ? exact : byName(cited.split("/").pop() ?? cited).filter((f) => f.endsWith(cited));
}

type Hook = { label: string; written: (text: string) => boolean };

/** The hooks a selector depends on that its component file writes: data-slot and data-part values, site classes. */
function hooks(selector: string): Hook[] {
  const out: Hook[] = [];
  for (const m of selector.matchAll(/\[(data-(?:slot|part))(?:=["']?([\w-]+)["']?)?\]/g)) {
    const [attr, value] = [m[1], m[2]];
    out.push({
      label: value ? `${attr}=${value}` : attr,
      written: (t) => (value ? new RegExp(`${attr}=\\{?["'\`]${value}["'\`]`).test(t) : t.includes(attr)),
    });
  }
  const bare = selector.replace(/\[[^\]]*\]|\([^)]*\)/g, " ");
  for (const m of bare.matchAll(/\.(-?[a-zA-Z_][\w-]*)/g)) {
    const cls = m[1];
    if (cls.startsWith("ds-")) continue; // the guide's own classes, written in the guide
    out.push({ label: `.${cls}`, written: (t) => new RegExp(`(^|[\\s"'\`.])${cls}($|[\\s"'\`:{,])`, "m").test(t) });
  }
  return out;
}

const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whether f imports target, written with or without its extension ("./forms.module.css", "./dialog-styles"). */
function imports(f: string, target: string): boolean {
  const base = target.split("/").pop() ?? target;
  const stem = base.replace(/\.(tsx?|jsx?)$/, "");
  return new RegExp(`from\\s*["']\\./(?:${escape(base)}|${escape(stem)})["']`).test(readRepo(f) ?? "");
}

/** The cited file's neighbours in its folder: the files it imports and the files that import it, since a
 *  pin citing a styles file (dialog-styles.ts) leans on hooks its component (DialogPanel.tsx) writes. */
function neighbours(file: string): string[] {
  const dir = file.slice(0, file.lastIndexOf("/"));
  return filesIn(dir, /\.(tsx?|jsx?)$/).filter((f) => f !== file && (imports(file, f) || imports(f, file)));
}

function linesOf(spec: string): number[] {
  return spec.split(",").flatMap((part) => {
    const [a, b] = part.trim().split("-").map(Number);
    return b ? [a, b] : [a];
  });
}

type Verdict = { ok: boolean; at: string; file: string };
type Read = Verdict & { found: readonly string[] };

/** The text a pin's cited lines must still write: its `expect`, one needle or a list across its cites. */
function needlesOf(p: AnatomyPin): readonly string[] {
  const e = (p as AnatomyPin & { expect?: unknown }).expect;
  if (typeof e === "string") return e ? [e] : [];
  return Array.isArray(e) ? e.filter((x): x is string => typeof x === "string" && x.length > 0) : [];
}

/** One citation ("Hero.tsx:125") against the pin's hooks, and which of its needles the cited lines write.
 *  Of several files with the cited name, the one whose lines write the most needles is taken. */
function judgeOne(p: AnatomyPin, source: string, needles: readonly string[]): Read {
  const m = CITED.exec(source);
  const none: readonly string[] = [];
  if (!m) return { ok: false, at: source ? `"${source}" is not a file:line` : "no source", file: "", found: none };
  const [, cited, spec] = m;
  const files = candidates(cited);
  if (!files.length) return { ok: false, at: `${cited} not found`, file: cited, found: none };
  if (!spec) return { ok: false, at: `${source} names no line`, file: files[0], found: none };
  const nums = linesOf(spec);
  let why = "";
  let best: Read | null = null;
  for (const file of files) {
    const text = readRepo(file) ?? "";
    const lines = text.split("\n");
    const past = nums.find((n) => n < 1 || n > lines.length);
    if (past !== undefined) {
      why = `line ${past} past the end (${lines.length})`;
      continue;
    }
    const near = [text, ...neighbours(file).map((f) => readRepo(f) ?? "")];
    const lost = hooks(p.selector).filter((h) => !near.some((t) => h.written(t)));
    if (lost.length) {
      why = `${lost.map((h) => h.label).join(", ")} not written there`;
      continue;
    }
    const found = needles.filter((x) => nums.some((n) => lines[n - 1].includes(x)));
    if (!best || found.length > best.found.length) best = { ok: true, at: source, file, found };
  }
  return best ?? { ok: false, at: `${source}, ${why}`, file: files[0], found: none };
}

/** A pin may cite more than one file ("HeroBits.tsx:147, globals.css:39"). It holds while every cite does
 *  and each needle of its `expect` is written on one of the cited lines. */
function judge(p: AnatomyPin): Verdict {
  const all = (p.source ?? "").trim();
  const needles = needlesOf(p);
  const reads = all.split(/,\s*(?=[\w./@-]+\.\w+:)/).map((src) => judgeOne(p, src, needles));
  const failed = reads.find((v) => !v.ok);
  if (failed) return failed;
  const file = reads[0].file;
  if (!needles.length) return { ok: false, at: `${all}, no expect, so nothing reads the cited line`, file };
  const missing = needles.filter((x) => !reads.some((r) => r.found.includes(x)));
  if (missing.length) return { ok: false, at: `${all} no longer writes ${missing.map((x) => `"${x}"`).join(", ")}`, file };
  return { ok: true, at: all, file };
}

/** One row per pin, deduped across modules (a variant map and its pin list are the same pins). */
export function pinRows(modules: Readonly<Record<string, object>>): AssertRow[] {
  const seen = new Set<string>();
  const rows: AssertRow[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const found: AnatomyPin[] = [];
    pinsIn(Object.values(mod), found);
    for (const p of found) {
      const key = `${p.selector}|${p.name}|${p.source ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const v = judge(p);
      rows.push({ kind: "pin", file: v.file, expected: `${p.name}: ${p.selector}`, at: v.at, ok: v.ok, shownIn: shownIn(path) });
    }
  }
  return rows;
}

/** The module list against the folder: every data file collected, and no pin list kept in a section file. */
export function moduleRows(modules: Readonly<Record<string, object>>, skipped: readonly string[]): AssertRow[] {
  const all = filesDeep(SECTIONS_DIR, /\.tsx?$/);
  const key = (f: string) => f.slice(SECTIONS_DIR.length + 1).replace(/\.tsx?$/, "");
  const rows: AssertRow[] = all
    .filter((f) => COLLECTABLE.test(f) && !OWN.test(f))
    .map((f) => {
      const ok = key(f) in modules || skipped.includes(key(f));
      const at = ok ? "meta-modules.ts" : "not listed in meta-modules.ts";
      return { kind: "module", file: f, expected: "walked by Coverage", at, ok, shownIn: shownIn(key(f)) };
    });
  for (const f of all.filter((x) => x.endsWith(".tsx") && /:\s*readonly AnatomyPin\[\]\s*=/.test(readRepo(x) ?? ""))) {
    const expected = "pins kept in a data module, so Coverage can walk them";
    rows.push({ kind: "module", file: f, expected, at: "pins in a section file", ok: false, shownIn: shownIn(key(f)) });
  }
  return rows;
}
