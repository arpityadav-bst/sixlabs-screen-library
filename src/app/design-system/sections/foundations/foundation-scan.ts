// Build-time reads of the site's own source for the type, spacing, layout, radius and elevation
// sections. The guide page is prerendered, so each read runs once at build, through the kit's one reader
// (_kit/source.ts) and its cache. A transcribed value is an assertion: the exact text it was copied from
// must still be in its file, or the guide shows it as drifted. Counts come from the same files, so a
// number on the page is the source's number. Server only.
import { filesIn, locate, readRepo } from "@/app/design-system/_kit/source";
import { repoPath, type Assertion } from "./foundation-assert";

const SITE = "src/components/website";

export type AssertResult = {
  ok: boolean;
  /** "Jobs.tsx:106", the line of the first needle, or the bare file name when it is missing */
  at: string;
  missing: string[];
};

const lineOf = (text: string, index: number) => text.slice(0, index).split("\n").length;
const base = (file: string) => file.split("/").pop() ?? file;

export function check(a: Assertion): AssertResult {
  const text = readRepo(repoPath(a.file));
  if (text === null) return { ok: false, at: base(a.file), missing: [...a.needles] };
  const missing = a.needles.filter((n) => !text.includes(n));
  const first = text.indexOf(a.needles[0] ?? "");
  const at = first >= 0 ? `${base(a.file)}:${lineOf(text, first)}` : base(a.file);
  return { ok: missing.length === 0, at, missing };
}

/** A pin's citation of exact text in a repo file: "Icon.tsx:48" where the text is first written (or "Icon.tsx,
 *  moved" once it is not), and the text itself as the pin's expect, which Coverage holds to that line. */
export function cite(file: string, needle: string): { source: string; expect: string } {
  const line = locate(file, needle);
  return { source: line === null ? `${base(file)}, moved` : `${base(file)}:${line}`, expect: needle };
}

/** The site's own files, as repo paths. */
const siteFiles = () => filesIn(SITE, /\.tsx?$/);
const siteText = (file: string) => readRepo(file) ?? "";

const SPACE_PROPS = "p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y";
const EDGE = String.raw`(?:^|[\s"'` + "`" + String.raw`:!])`;
const END = String.raw`(?=[\s"'` + "`" + String.raw`!]|$)`;

/** How many times each Tailwind spacing step is written on padding, margin, gap and space utilities. */
export function spacingCounts(): Map<string, number> {
  const re = new RegExp(String.raw`${EDGE}-?(?:${SPACE_PROPS})-(\d+(?:\.\d+)?)${END}`, "g");
  const counts = new Map<string, number>();
  for (const f of siteFiles()) {
    for (const m of siteText(f).matchAll(re)) counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  }
  return counts;
}

export type OffGrid = { px: number; uses: string[] };

/** Arbitrary spacing values that are not a step of the scale (steps in px), each with its file:lines. */
export function offGridSpacing(steps: ReadonlySet<number>): OffGrid[] {
  const re = new RegExp(String.raw`${EDGE}-?(?:${SPACE_PROPS})-\[(\d+(?:\.\d+)?)px\]`, "g");
  const found = new Map<number, string[]>();
  for (const f of siteFiles()) {
    siteText(f)
      .split("\n")
      .forEach((l, i) => {
        for (const m of l.matchAll(re)) {
          const px = Number(m[1]);
          if (steps.has(px)) continue;
          const uses = found.get(px) ?? [];
          const at = `${base(f)}:${i + 1}`;
          if (!uses.includes(at)) uses.push(at);
          found.set(px, uses);
        }
      });
  }
  return [...found].sort((a, b) => a[0] - b[0]).map(([px, uses]) => ({ px, uses }));
}

const escape = (p: string) => p.replace(/[[\]().*+?^$|\\]/g, "\\$&");

/** How many times each variant prefix ("md", "max-md", "min-[901px]") opens a class in the site. */
export function variantCounts(prefixes: readonly string[]): Map<string, number> {
  const texts = siteFiles().map(siteText);
  const counts = new Map<string, number>();
  for (const p of prefixes) {
    const re = new RegExp(`${EDGE}${escape(p)}:`, "g");
    counts.set(p, texts.reduce((n, t) => n + [...t.matchAll(re)].length, 0));
  }
  return counts;
}
