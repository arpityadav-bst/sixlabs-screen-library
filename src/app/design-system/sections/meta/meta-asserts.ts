// Every value the guide writes down, checked against the source it was copied from, at build. Four kinds:
// the exact text the sections transcribe (each an Assertion, a module's own or a drawer row's assert,
// collected from every data module in meta-modules.ts, plus the job terminal's timings, which its spec
// transcribes because JobTerminal does not export them, and a failing row for each drawer row that cites a
// system file with no needle, meta-rows.ts), every token that cites a file:line, whose value or Tailwind class must still sit on that
// line or the one either side of it, every Anatomy pin (meta-pins.ts), and the module list itself. A token
// whose site value has no literal form (a next/font family, a JS curve, a height that comes from padding)
// is listed as derived with its reason, never counted as passing.
import { check } from "../foundations/foundation-scan";
import { site, type Assertion } from "../foundations/foundation-assert";
import { TOKEN_GROUPS } from "@/components/design-system/tokens";
import { TIMING } from "../components/terminal-data";
import { DATA_MODULES, NOT_COLLECTED } from "./meta-modules";
import { moduleRows, pinRows, shownIn } from "./meta-pins";
import { bareRows } from "./meta-rows";
import { readRepo } from "@/app/design-system/_kit/source";

/** JobTerminal.tsx keeps its timings as module constants, so the terminal spec transcribes them once, in
 *  terminal-data's TIMING. The needles are written from those numbers, so the check holds that one copy. */
const T = TIMING.step;
const TERMINAL: readonly Assertion[] = [
  site("JobTerminal.tsx", `const TYPE_MS = ${TIMING.typeMs};`),
  site("JobTerminal.tsx", `const STEP_MS = { out: ${T.out}, kv: ${T.kv}, check: ${T.check}, bar: ${T.bar} } as const;`),
  site("JobTerminal.tsx", `const LOAD_MS = ${TIMING.loadMs};`),
  site("JobTerminal.tsx", `await wait(${TIMING.afterCmdMs});`),
];

/** Every data module, each with the section its values are shown in, and the terminal's timings. */
const sources = () => [
  ...Object.entries(DATA_MODULES).map(([path, mod]) => ({ shownIn: shownIn(path), mod })),
  { shownIn: "Terminal", mod: { TERMINAL } },
];

/** Tokens whose site value is computed rather than written, with the reason a reader checks it by hand. */
export const DERIVED: Readonly<Record<string, string>> = {
  "color-page-92": "written as rgb(var(--page-rgb)/0.92), the page colour through a variable",
  "color-doodle": "white drawn at strokeOpacity 0.85 on the SVG path",
  "font-display": "a next/font family, declared as Outfit() in layout.tsx",
  "font-sans": "a next/font family, declared as Inter() in layout.tsx",
  "font-mono": "a next/font family, declared as JetBrains_Mono() in layout.tsx",
  "header-h": "the bar's height, which comes from its padding and the logo",
  "header-h-md": "the bar's height from md, from its padding and the logo",
  "stroke-hairline": "Tailwind's bare border class, 1px",
  "stroke-dot": "Tailwind's border-2 class",
  "ease-in-out": "a cubic in-out written as a JS function",
  "ease-linear": "the linear timing inside animate-spin",
  "ease-glide": "easeOut written as a JS function, plotted as its bezier",
};

export type AssertRow = {
  kind: "value" | "token" | "pin" | "module";
  /** repo-relative file */
  file: string;
  /** the text that must still be there */
  expected: string;
  /** "Jobs.tsx:106", where it was found, or the file name when it was not */
  at: string;
  ok: boolean;
  shownIn: string;
};

const isAssertion = (v: unknown): v is Assertion =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Assertion).file === "string" &&
  Array.isArray((v as Assertion).needles);

function collect(v: unknown, out: Assertion[], depth = 0): void {
  if (depth > 6 || v === null || typeof v !== "object") return;
  if (isAssertion(v)) {
    out.push(v);
    return;
  }
  for (const child of Array.isArray(v) ? v : Object.values(v)) collect(child, out, depth + 1);
}

function valueRows(): AssertRow[] {
  const seen = new Set<string>();
  const rows: AssertRow[] = [];
  for (const { shownIn: where, mod } of sources()) {
    const found: Assertion[] = [];
    collect(Object.values(mod), found);
    for (const a of found) {
      const key = `${a.file}|${a.needles.join("|")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = check(a);
      rows.push({
        kind: "value",
        file: `src/${a.file}`,
        expected: (r.missing.length ? r.missing : a.needles).join(" + "),
        at: r.at,
        ok: r.ok,
        shownIn: where,
      });
    }
  }
  return rows;
}

const flat = (s: string) => s.toLowerCase().replace(/[\s_"'`]+/g, "");
const numbers = (s: string) => (s.match(/-?\d*\.?\d+/g) ?? []).map(Number);
const holdsRun = (hay: number[], run: number[]) =>
  run.length > 0 && hay.some((_, i) => run.every((v, k) => hay[i + k] === v));

function tokenRows(): { rows: AssertRow[]; derived: { name: string; reason: string }[] } {
  const rows: AssertRow[] = [];
  const derived: { name: string; reason: string }[] = [];
  for (const g of TOKEN_GROUPS) {
    for (const t of g.tokens) {
      const m = /^([\w./-]+\.\w+):(\d+)/.exec(t.source);
      if (!m) continue;
      if (DERIVED[t.name]) {
        derived.push({ name: t.name, reason: DERIVED[t.name] });
        continue;
      }
      const file = `src/${m[1]}`;
      const n = Number(m[2]);
      const lines = (readRepo(file) ?? "").split("\n");
      const near = [lines[n - 2], lines[n - 1], lines[n]].filter((l) => l !== undefined).join(" ");
      const texts = [t.utility, t.value].filter((x): x is string => Boolean(x)).map(flat);
      const run = numbers(t.value.replace(/var\([^)]*\)/g, ""));
      const runs = /^\d+ms$/.test(t.value) ? [run, [run[0] / 1000]] : [run];
      const hay = numbers(near);
      const ok = texts.some((x) => flat(near).includes(x)) || runs.some((r) => holdsRun(hay, r));
      rows.push({
        kind: "token",
        file,
        expected: `--ds-${t.name}: ${t.utility ?? t.value}`,
        at: `${m[1].split("/").pop()}:${n}`,
        ok,
        shownIn: `Tokens, ${g.title}`,
      });
    }
  }
  return { rows, derived };
}

let memo: ReturnType<typeof build> | null = null;

function build() {
  const values = [...valueRows(), ...bareRows(DATA_MODULES)];
  const tokens = tokenRows();
  const pins = pinRows(DATA_MODULES);
  const modules = moduleRows(DATA_MODULES, NOT_COLLECTED);
  const rows = [...values, ...tokens.rows, ...pins, ...modules];
  return {
    rows,
    values,
    tokens: tokens.rows,
    pins,
    modules,
    derived: tokens.derived,
    passing: rows.filter((r) => r.ok).length,
    total: rows.length,
    failed: rows.filter((r) => !r.ok),
  };
}

/** The whole report, built once per build. */
export function assertionReport() {
  memo ??= build();
  return memo;
}
