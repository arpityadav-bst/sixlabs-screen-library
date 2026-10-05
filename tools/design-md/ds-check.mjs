// The design system's one failing check, `npm run ds:check`, kept apart from next build so documentation drift
// fails a command instead of the deploy. Three steps, each run even when an earlier one fails, and any failure
// exits 1:
//   1. TypeScript: tsc --noEmit -p . on the whole project.
//   2. DESIGN.md: node tools/design-md/build.mjs --check, which fails when the file is not what the partials
//      build or a partial breaks one of its rules.
//   3. The guide's own build checks: the catalog's data checks (catalogProblems), the token list's
//      (tokenProblems), the checks that read the source (sourceProblems: section files, covers, spec sources,
//      state columns, live frames) and the Coverage section's assertion report (every transcribed value, token
//      cite, Anatomy pin, data module and drawer needle). The guide page throws on the first three at build
//      and prints the fourth in Coverage. Here every failure is printed.
// Run from anywhere: node tools/design-md/ds-check.mjs. With --guide it runs step 3 alone.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
// the guide's source reader resolves repo paths from the working directory, as next build does
process.chdir(ROOT);
const failed = [];
const GUIDE_ONLY = process.argv.includes("--guide");

/** A node script as a child process, its output passed through, so a Windows shell never sits in between. */
function run(name, args) {
  console.log(`\n== ${name}`);
  const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) failed.push(name);
}

if (!GUIDE_ONLY) {
  run("TypeScript", [createRequire(import.meta.url).resolve("typescript/bin/tsc"), "--noEmit", "-p", "."]);
  run("DESIGN.md", [join(ROOT, "tools/design-md/build.mjs"), "--check"]);
}

console.log("\n== Guide checks");
const jiti = createJiti(import.meta.url, { alias: { "@/": `${join(ROOT, "src")}/` }, jsx: true });
const load = (file) => jiti.import(join(ROOT, file));
const { catalogProblems } = await load("src/app/design-system/_data/catalog.ts");
const { tokenProblems } = await load("src/components/design-system/tokens.ts");
const { sourceProblems } = await load("src/app/design-system/_data/catalog-check.ts");
const { assertionReport } = await load("src/app/design-system/sections/meta/meta-asserts.ts");
const problems = [
  ...catalogProblems().map((p) => `catalog: ${p}`),
  ...tokenProblems().map((p) => `tokens: ${p}`),
  ...sourceProblems().map((p) => `source: ${p}`),
];
const report = assertionReport();
console.log(`${problems.length} catalog, token and source problems, assertions ${report.passing} of ${report.total} passing`);
for (const p of problems) console.log(`error: ${p}`);
for (const r of report.failed) console.log(`failed: ${r.kind} ${r.file}: ${r.expected} (${r.at}), shown in ${r.shownIn}`);
if (problems.length || report.failed.length) failed.push("Guide checks");

console.log(failed.length ? `\nds:check failed: ${failed.join(", ")}` : "\nds:check passed");
if (failed.length) process.exitCode = 1;
