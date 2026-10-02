// Build-time reads for the Start and Meta sections: the exported components of the three part folders, the
// import graph of the two site pages, where a piece of text sits in a file, and how many spec panels each
// guide folder holds. The guide page is prerendered (force-static), so every read runs once, at build, and
// a number on the page is the source's number at that moment. Paths are repo-relative ("src/..."), and every
// read goes through the kit's one source reader (_kit/source.ts).
import { filesIn, lineAt, reach, readRepo } from "@/app/design-system/_kit/source";

/** How many files of a folder (not its subfolders) write the needle. */
export const filesWriting = (dir: string, needle: string) =>
  filesIn(dir).filter((f) => (readRepo(f) ?? "").includes(needle)).length;

/** The three folders a part can come from, in the order the coverage tables read them. */
export const PART_DIRS = ["src/components/website", "src/components/tiles", "src/components/design-system"] as const;
export type PartDir = (typeof PART_DIRS)[number];

export type ExportedPart = {
  component: string;
  /** repo-relative file, as the catalog's covers write it */
  source: string;
  line: number;
  dir: PartDir;
  /** renders a control of its own (not a page section that holds other parts) */
  interactive: boolean;
};

// A function component, or an arrow / forwardRef / memo const whose name reads as a component
// (CardContext, a createContext, is not one).
const EXPORT_RE =
  /^export (?:default )?(?:async )?function ([A-Z][A-Za-z0-9]*)|^export const ([A-Z][a-z][A-Za-z0-9]*)\s*(?::[^=\n]+)?=\s*(?:\(|forwardRef|memo)/gm;
const CONTROL_RE =
  /<(?:motion\.)?(?:button|input|select|textarea)\b|<(?:motion\.)?a\s|<Link\b|role=["'](?:button|tab|switch|slider|checkbox|radio|option|menuitem|radiogroup|tablist|listbox|combobox)["']/;
const SECTION_ROOT_RE = /return\s*\(?\s*(?:<>\s*)?<(?:motion\.)?(?:section|footer|header|nav|main)\b/;

/** The components one file exports, each with the line it starts on and whether it is a control. */
export function exportsOf(rel: string, dir: PartDir): ExportedPart[] {
  const text = readRepo(rel);
  if (text === null) return [];
  const found = [...text.matchAll(EXPORT_RE)];
  return found.map((m, k) => {
    const start = m.index ?? 0;
    const next = found[k + 1]?.index ?? text.length;
    const body = text.slice(start, next);
    return {
      component: m[1] ?? m[2],
      source: rel,
      line: lineAt(text, start),
      dir,
      interactive: CONTROL_RE.test(body) && !SECTION_ROOT_RE.test(body),
    };
  });
}

let partsMemo: ExportedPart[] | null = null;

/** Every exported component of the three part folders, in folder then file order. */
export function allExports(): ExportedPart[] {
  partsMemo ??= PART_DIRS.flatMap((dir) => filesIn(dir, /\.tsx$/).flatMap((f) => exportsOf(f, dir)));
  return partsMemo;
}

/** The kit's own reader, passed through for the one caller still importing it from here (overview.tsx).
 *  Delete this line once that import moves to _kit/source. */
export { exportLine } from "@/app/design-system/_kit/source";

/** The site pages a part ships on, from the import graph of each page. */
export const SITE_PAGES = [
  { name: "website", entry: "src/app/website/page.tsx" },
  { name: "fullview", entry: "src/app/6labs-fullview/page.tsx" },
] as const;

let pagesMemo: { name: string; files: Set<string> }[] | null = null;

export function shipsOn(source: string): string[] {
  pagesMemo ??= SITE_PAGES.map((p) => ({ name: p.name, files: reach(p.entry) }));
  return pagesMemo.filter((p) => p.files.has(source)).map((p) => p.name);
}

/** How many spec panels the files of a guide folder render (an opening <Spec tag each). */
export function specsIn(folder: string): number {
  return filesIn(`src/app/design-system/sections/${folder}`, /\.tsx$/).reduce(
    (n, f) => n + ((readRepo(f) ?? "").match(/<Spec\b/g)?.length ?? 0),
    0,
  );
}
