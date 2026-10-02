// A token group's use table, for its drawer: what each token is for, what it is never for and, for the colour
// tiers, how many site files write it. The swatch cards stay a glance (TokenSwatch), so these facts live here,
// beside the values. Server only, because the file count comes from the colour scan.
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import type { Token } from "@/components/design-system/tokens";
import { filesFor } from "./colour-scan";

/** How many site files write a token, or why there is no count. */
function fileCount(t: Token): string {
  if (t.source === "system") return "system addition";
  const n = filesFor(t);
  return n === undefined ? "not counted" : String(n);
}

/** files adds the site-file count, level matches the spec's (its heading sits under the drawer's). */
export function UseTable({ tokens, files = false, level = 3 }: { tokens: readonly Token[]; files?: boolean; level?: 3 | 4 }) {
  const H = level === 4 ? "h5" : "h4";
  const columns = ["Token", "Use for", "Never for", ...(files ? ["Site files"] : [])];
  const rows = tokens.map((t) => [`--ds-${t.name}`, t.useFor, t.neverFor, ...(files ? [fileCount(t)] : [])]);
  return (
    <div>
      <H className="ds-h4">Use and never</H>
      <SpecTable caption="Use and never" columns={columns} rows={rows} mono={[0]} />
    </div>
  );
}
