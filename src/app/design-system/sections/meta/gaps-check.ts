// Reads each defect's evidence from the source at build: the line it sits on, or how many files write a
// spelling. A defect is open while all its evidence holds. When any piece has moved or gone, the row asks
// for a fresh read, because the defect may be fixed or may only have moved.
import { AREAS, GAPS, type Evidence, type Gap } from "./gaps-data";
import { locate, readRepo } from "@/app/design-system/_kit/source";
import { filesWriting } from "./meta-scan";

export type EvidenceRead = { holds: boolean; where: string };
export type GapRead = Gap & { open: boolean; reads: EvidenceRead[] };

/** The file name, with its folder when the name alone is a Next special file ("tiles/page.tsx"). */
function base(rel: string): string {
  const parts = rel.split("/");
  const name = parts.pop() ?? rel;
  return /^(page|layout)\./.test(name) ? `${parts.pop()}/${name}` : name;
}

function read(e: Evidence): EvidenceRead {
  if ("counts" in e) {
    const parts = e.counts.map((c) => ({ c, n: filesWriting(e.dir, c) }));
    // one spelling drifts when more than one file declares it, several when more than one is in use
    const holds = parts.length === 1 ? parts[0].n > 1 : parts.filter((p) => p.n > 0).length > 1;
    return { holds, where: parts.map((p) => `${p.c} in ${p.n}`).join(", ") };
  }
  if ("dir" in e) {
    const n = filesWriting(e.dir, e.absent);
    return { holds: n === 0, where: n === 0 ? `${e.dir}: no file writes ${e.absent}` : `${e.dir}: ${n} files write ${e.absent}` };
  }
  if ("absent" in e) {
    const text = readRepo(e.file);
    const line = locate(e.file, e.anchor);
    const holds = text !== null && !text.includes(e.absent) && line !== null;
    return { holds, where: line === null ? base(e.file) : `${base(e.file)}:${line}` };
  }
  const line = locate(e.file, e.needle);
  return { holds: line !== null, where: line === null ? base(e.file) : `${base(e.file)}:${line}` };
}

let memo: GapRead[] | null = null;

/** Every defect with its evidence read, in the data's order. */
export function gapReads(): GapRead[] {
  memo ??= GAPS.map((g) => {
    const reads = g.evidence.map(read);
    return { ...g, reads, open: reads.every((r) => r.holds) };
  });
  return memo;
}

/** The defects grouped by area, in the areas' order. */
export function gapsByArea() {
  const all = gapReads();
  return AREAS.map((a) => ({ ...a, gaps: all.filter((g) => g.area === a.id) })).filter((a) => a.gaps.length > 0);
}
