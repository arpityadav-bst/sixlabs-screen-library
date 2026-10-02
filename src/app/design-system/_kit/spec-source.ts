// Where a spec's part lives, and the names the spec head and the build-time line map share for it. Pure, so
// a client chip and a server scan compute the same file and key.

/** Where a part lives. `from` is the import path. `name` is an identifier the file exports (the build checks
 *  it), and the chip copies its import line. `label` names a point inside the file that is not an export ("rim
 *  beam", "the pill"), printed in the name's place, and the chip then copies the file's path. The chip's line
 *  is read at build (spec-lines.ts): the export's own line, or with `at`, the line that text is written on.
 *  An `at` needle must not hold a closing brace, because the build reads sources as `{ ... }` literals. */
export type SpecSource = {
  from: string;
  name?: string;
  label?: string;
  /** file name when it differs from the import path's last segment plus .tsx */
  file?: string;
  /** text written on the line to cite, for a line inside the part */
  at?: string;
  /** a line a section finds in code at build. Typed as a number it drifts from the file, so the build refuses
   *  a literal one without `at`: give `at` instead */
  line?: number;
};

/** The repo-relative file a source names, "src/components/tiles/TileFloor.tsx". */
export function sourceFile(s: Pick<SpecSource, "from" | "file">): string {
  const rel = s.from.startsWith("@/") ? `src/${s.from.slice(2)}` : s.from;
  const dir = rel.slice(0, rel.lastIndexOf("/"));
  return `${dir}/${s.file ?? `${rel.slice(rel.lastIndexOf("/") + 1)}.tsx`}`;
}

/** The key the line map files a source's line under: the file, the export and the needle. */
export const sourceKey = (s: Pick<SpecSource, "from" | "file" | "name" | "at">) =>
  `${sourceFile(s)}#${s.name ?? ""}${s.at ? `@${s.at}` : ""}`;

/** The file as the identity chip prints it, from the components folder down ("tiles/TileFloor.tsx"). */
export const shortFile = (s: SpecSource) => sourceFile(s).replace(/^src\/(components\/)?/, "");

/** The line a reader copies to use the part, or null for a source that names no export. */
export const importLine = (s: SpecSource): string | null =>
  s.name ? `import { ${s.name} } from "${s.from}";` : null;

/** An identifier, as an export's name must be. */
export const isIdentifier = (name: string) => /^[A-Za-z_$][\w$]*$/.test(name);
