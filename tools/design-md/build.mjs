// Assembles DESIGN.md at the project root from the chapter partials in docs/design-md, which are the
// editable source. The guide's catalog gives the order, the numbers and the titles, tokens.ts gives the
// tables of chapter 3, and every "Title (N.N)", "chapter N" or "decision N" reference becomes a link. The
// changelog partial is also the guide's changelog (changelog-data.ts reads it), so its entries live there.
// Run from anywhere: node tools/design-md/build.mjs, which writes the file, or with --check, which writes
// nothing and fails when DESIGN.md is not what the partials build. Either way it exits 1 on an error: a
// missing or orphan partial, a catalog number out of order, a reference to nothing or one whose lead-in
// is not its target's title, a numbered heading whose anchor repeats, an em dash or a semicolon in prose.
// Warnings (a title that differs from the catalog, a part missing one of its ten labels or holding them
// out of order, an unknown --ds-* name) are printed and pass.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import { headingAnchors, makeLinker, slug } from "./links.mjs";
import { numberedAnchor } from "./slug.mjs";
import { tokenSections } from "./tokens-md.mjs";
import { nestedParts, partWarnings, printedNames, unknownNames } from "./checks.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const PARTS = join(ROOT, "docs/design-md");
const OUT = join(ROOT, "DESIGN.md");
const CHECK = process.argv.includes("--check");
const jiti = createJiti(import.meta.url, { alias: { "@/": `${join(ROOT, "src")}/` } });
const { GROUPS } = await jiti.import(join(ROOT, "src/app/design-system/_data/catalog.ts"));
const TOKENS = await jiti.import(join(ROOT, "src/components/design-system/tokens.ts"));

/** Chapters with no guide section of their own, and the partial that holds each. */
const EXTRA = [
  { n: 3, file: "tokens-reference", generated: true },
  { n: 8, file: "accent-rule" },
];
/** Chapters whose sections are parts, so each section carries the ten labels (checks.mjs). A part nested
 *  anywhere else (a #### block opening on Purpose) is checked on its own. */
const PART_CHAPTERS = new Set([6, 7]);
/** Sections of those chapters that document contracts rather than a part, with no labels to carry. */
const NOT_A_PART = new Set(["behaviours"]);
/** A grouped chapter's optional opening, before its first section. */
const groupFile = (id) => `group-${id}`;

const errors = [];
const warnings = [];
const partials = new Map();

function readPartial(file) {
  let text;
  try {
    text = readFileSync(join(PARTS, `${file}.md`), "utf8").replace(/\r\n/g, "\n").trim();
  } catch {
    return null;
  }
  partials.set(file, text);
  const [first, ...rest] = text.split("\n");
  if (!first.startsWith("### ")) {
    errors.push(`${file}.md does not open with a ### heading`);
    return { heading: file, body: text };
  }
  return { heading: first.slice(4).trim(), body: rest.join("\n").trim() };
}

const absent = (id) => `_No chapter text yet: write \`docs/design-md/${id}.md\` and rebuild._`;
const sameTitle = (file, heading, title) => {
  if (heading !== title) warnings.push(`${file}.md is headed "${heading}", the catalog says "${title}"`);
};

// The chapters, from the catalog: a designMd of "N" is a whole chapter, "N.M" a section inside chapter N.
const chapters = new Map();
const chapterOf = (n) => {
  if (!chapters.has(n)) chapters.set(n, { n, title: "", group: "", body: "", sections: [], generated: false });
  return chapters.get(n);
};
const used = new Set();
let lastKey = -1;
for (const g of GROUPS) {
  for (const s of g.sections) {
    used.add(s.id);
    const [major, minor] = s.designMd.split(".").map(Number);
    const key = major * 1000 + (minor ?? 0);
    if (key <= lastKey) errors.push(`${s.id}: DESIGN.md ${s.designMd} is out of order or repeated in the catalog`);
    lastKey = Math.max(lastKey, key);
    const c = chapterOf(major);
    const p = readPartial(s.id);
    // A whole chapter may be headed apart from its guide section (designMdTitle), a numbered section never.
    const title = minor === undefined ? (s.designMdTitle ?? s.title) : s.title;
    if (!p) errors.push(`no partial for ${s.id}: write docs/design-md/${s.id}.md`);
    else sameTitle(s.id, p.heading, title);
    if (minor === undefined) {
      c.title = title;
      c.body = p?.body ?? absent(s.id);
      continue;
    }
    if (!c.group) {
      c.group = g.title;
      const intro = readPartial(groupFile(g.id));
      if (intro) {
        used.add(groupFile(g.id));
        sameTitle(groupFile(g.id), intro.heading, g.title);
        c.body = intro.body;
      }
    }
    c.sections.push({ id: s.id, num: s.designMd, title: s.title, body: p?.body ?? absent(s.id) });
    if (p && PART_CHAPTERS.has(major) && !NOT_A_PART.has(s.id)) {
      warnings.push(...partWarnings(nestedParts(p.body).own, `${s.id}.md (${s.designMd})`));
    }
  }
}
for (const x of EXTRA) {
  if (chapters.has(x.n)) errors.push(`chapter ${x.n} is in the catalog and also built from ${x.file}.md`);
  used.add(x.file);
  const c = chapterOf(x.n);
  const p = readPartial(x.file);
  if (!p) errors.push(`no partial for chapter ${x.n}: write docs/design-md/${x.file}.md`);
  c.title = p?.heading ?? x.file;
  c.body = p?.body ?? absent(x.file);
  c.generated = Boolean(x.generated);
}
const list = [...chapters.values()].sort((a, b) => a.n - b.n);
for (const c of list) c.title ||= c.group;
for (let i = 0; i < list.length; i++) if (list[i].n !== i) errors.push(`no chapter ${i}`);

// Parts nested in any chapter, each checked against the template on its own.
for (const [file, md] of partials) {
  for (const part of nestedParts(md).parts) warnings.push(...partWarnings(part.body, `${file}.md, ${part.title}`));
}

// Partials that nothing reaches.
for (const f of readdirSync(PARTS)) {
  if (f.endsWith(".md") && !used.has(f.slice(0, -3))) errors.push(`${f} is not in the catalog, so it is not in DESIGN.md`);
}

// Anchors and titles for every chapter and section number.
const refs = new Map();
const sectionById = new Map();
for (const c of list) {
  refs.set(String(c.n), { anchor: numberedAnchor(c.n, c.title), title: c.title });
  for (const s of c.sections) {
    refs.set(s.num, { anchor: numberedAnchor(s.num, s.title), title: s.title });
    sectionById.set(s.id, s);
  }
}

// Chapter 3's sections, generated, each closed by the line naming where its reasons are. They are made
// before the linker, so a reference into chapter 3 is checked like any other.
const place = (id) => {
  const ch = /^chapter (\d+)$/.exec(id);
  if (ch) return refs.has(ch[1]) ? `${refs.get(ch[1]).title} (chapter ${ch[1]})` : null;
  const s = sectionById.get(id);
  return s ? `${s.title} (${s.num})` : null;
};
for (const c of list.filter((x) => x.generated)) {
  c.sections = tokenSections(TOKENS, place, (w) => warnings.push(w)).map((s, i) => {
    const num = `${c.n}.${i + 1}`;
    refs.set(num, { anchor: numberedAnchor(num, s.title), title: s.title });
    return { num, ...s };
  });
}

// Each decision is a "#### N. Title" heading in its partial, so "decision N" links to it.
const decisions = new Map();
for (const m of (partials.get("decisions") ?? "").matchAll(/^#### (\d+)\. (.+)$/gm)) decisions.set(m[1], slug(`${m[1]}. ${m[2]}`));

const withSections = new Set(list.filter((c) => c.sections.length).map((c) => String(c.n)));
const linker = makeLinker({ refs, decisions, withSections, maxChapter: list.length - 1, errors, warnings });

// The document body, then the contents over it. A part specced inside another chapter (a #### heading
// whose text opens on Purpose) is listed under its section, so a reader finds it from the contents.
const body = [];
for (const c of list) {
  body.push("", `## ${c.n} ${c.title}`, "", linker.linkify(c.body, `chapter ${c.n}`));
  for (const s of c.sections) body.push("", `### ${s.num} ${s.title}`, "", linker.linkify(s.body, s.num));
}
const bodyLines = body.join("\n").replace(/\n{3,}/g, "\n\n").split("\n");
const headings = headingAnchors(bodyLines);
// Every link target must be the anchor its heading really gets, so no numbered heading or decision may
// repeat an earlier heading's text and take GitHub's -1 suffix.
const real = new Set(headings.map((h) => h.anchor));
for (const [num, r] of refs) if (!real.has(r.anchor)) errors.push(`heading ${num} ${r.title} does not get the anchor #${r.anchor}`);
for (const [n, a] of decisions) if (!real.has(a)) errors.push(`decision ${n} does not get the anchor #${a}`);
const nested = new Map();
let under = "";
for (const h of headings) {
  if (h.level <= 3) under = h.text.split(" ")[0];
  const next = bodyLines.slice(h.line + 1).find((l) => l.trim());
  if (h.level === 4 && next?.startsWith("**Purpose.**")) {
    if (!nested.has(under)) nested.set(under, []);
    nested.get(under).push(`    - [${h.text}](#${h.anchor})`);
  }
}
const out = [
  "# 6labs design system",
  "",
  "<!-- Built by tools/design-md/build.mjs from docs/design-md/*.md, the guide's catalog and tokens.ts. Do not edit by hand. -->",
  "",
  "_Assembled from `docs/design-md/` by `node tools/design-md/build.mjs`. Edit the partials, not this file._",
  "",
  "## Contents",
  "",
];
for (const c of list) {
  out.push(`- [${c.n} ${c.title}](#${refs.get(String(c.n)).anchor})`);
  for (const s of c.sections) out.push(`  - [${s.num} ${s.title}](#${refs.get(s.num).anchor})`, ...(nested.get(s.num) ?? []));
}
const text = `${[...out, ...bodyLines].join("\n").replace(/\n{3,}/g, "\n\n")}\n`;

// Checks on the text as built.
const lines = text.split("\n");
const prose = (l) => l.split("`").filter((_, i) => i % 2 === 0).join("");
const EM_DASH = String.fromCharCode(0x2014);
const dashes = lines.flatMap((l, i) => (l.includes(EM_DASH) ? [i + 1] : []));
if (dashes.length) errors.push(`em dash on DESIGN.md lines ${dashes.join(", ")}`);
const semis = lines.flatMap((l, i) => (!l.startsWith("<!--") && prose(l).includes(";") ? [i + 1] : []));
if (semis.length) errors.push(`semicolon outside code on DESIGN.md lines ${semis.join(", ")}`);
const { printed, jsOnly } = printedNames(TOKENS.TOKEN_GROUPS, TOKENS.TYPE_ROLES);
for (const [file, md] of partials) for (const n of unknownNames(md, printed, jsOnly)) warnings.push(`${file}.md: ${n}`);

if (CHECK) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8").replace(/\r\n/g, "\n");
  } catch {}
  if (current !== text) errors.push("DESIGN.md is out of date: run node tools/design-md/build.mjs and commit the result");
} else {
  writeFileSync(OUT, text);
}

const sections = list.reduce((n, c) => n + c.sections.length, 0);
console.log(
  `DESIGN.md${CHECK ? " (check)" : ""}: ${list.length} chapters, ${sections} sections, ${linker.count()} links, ${lines.length} lines`,
);
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
if (errors.length) process.exitCode = 1;
