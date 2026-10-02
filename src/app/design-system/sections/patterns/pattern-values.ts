// Drawer rows for the Patterns sections that the shared helpers do not cover. A role row reads a type role
// from TYPE_ROLES (tokenByName holds only the token groups, so a type size asked of tv prints nothing), and a
// read row cites a file by its path from src/ and carries the exact text it was read off as an Assertion,
// which Coverage collects, so the day the file stops saying it the row turns red. Both throw on a slip, so a
// typo fails the build instead of printing a blank.
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { TYPE_ROLES } from "@/components/design-system/tokens";
import type { Assertion } from "../foundations/foundation-assert";

export type ReadRow = ValueRow & { readonly assert: Assertion };

/** "from md", "under lg", "from 1600", "on a short screen" */
const at = (key: string) =>
  key === "short" ? "on a short screen" : key.startsWith("max-") ? `under ${key.slice(4)}` : `from ${key.replace(/^min-/, "")}`;

/** A type role's size as a drawer row: base size, each breakpoint step, weight and leading. */
export function rv(part: string, role: string): ValueRow {
  const r = TYPE_ROLES.find((x) => x.name === role);
  if (!r) throw new Error(`Patterns drawer: "${part}" names the type role ${role}, which TYPE_ROLES does not hold`);
  const steps = (r.steps ?? []).map((s) => `${s.size} ${at(s.at)}`);
  const value = [[r.size, ...steps].join(", "), String(r.weight), r.leading].join(" · ");
  return { part, token: `--ds-type-${r.name}-size`, value, source: r.source };
}

/** A value read off a file. `source` is "components/website/Hero.tsx:125", the needles the text on it. */
export function read(part: string, value: string, source: string, token: string | undefined, ...needles: string[]): ReadRow {
  const file = source.split(":")[0];
  if (!/\.\w+$/.test(file)) throw new Error(`Patterns drawer: "${part}" cites ${source}, which is not a file`);
  if (needles.length === 0) throw new Error(`Patterns drawer: "${part}" cites ${source} with no needle to hold it to`);
  const row: ValueRow = token ? { part, token, value, source } : { part, value, source };
  return { ...row, assert: { file, needles } };
}
