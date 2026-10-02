// The shape of a transcribed value, kept free of node APIs so data modules can import it. The check
// itself runs at build in foundation-scan.ts.

/** Every needle is exact text that must still be in the file. The path is repo-relative ("src/..."), or
 *  the older path from src/ ("components/..."), which repoPath turns into the repo-relative one. */
export type Assertion = { readonly file: string; readonly needles: readonly string[] };

/** The folders a repo-relative path starts with; any other path is read as one from src/. */
const ROOTS = /^(?:src|public|tools|docs|scripts)\//;

/** An assertion's file as a repo-relative path, whichever form it was written in. */
export const repoPath = (file: string) => (ROOTS.test(file) ? file : `src/${file}`);

/** A website file: site("Jobs.tsx", "text-[30px] md:text-[44px]"). */
export const site = (file: string, ...needles: string[]): Assertion => ({
  file: `components/website/${file}`,
  needles,
});
