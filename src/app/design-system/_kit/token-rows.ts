// The one place a drawer row is made from a token or a site value, for every section's _data module. A token
// row reads its value and source from tokens.ts, so a drawer never prints a value the system does not hold,
// and every helper throws on an unknown name, so a typo fails the build instead of printing "missing token".
import { tokenByName, type Token } from "@/components/design-system/tokens";
import type { ValueRow } from "./SpecDrawer";

function token(name: string, where: string): Token {
  const t = tokenByName(name);
  if (!t) throw new Error(`design-system ${where}: tokens.ts holds no ${name}`);
  return t;
}

/** A token's value ("#0a1b33"), read from tokens.ts. */
export function tokenValue(name: string): string {
  return token(name, "tokenValue").value;
}

/** A drawer row for a system token: the value comes from the token, the source from the line that uses it
 *  or the line the token mirrors (tokens.ts for a system addition). */
export function tokenRow(part: string, name: string, source?: string): ValueRow {
  const t = token(name, `row "${part}"`);
  return { part, token: `--ds-${name}`, value: t.value, source: source ?? (t.source !== "system" ? t.source : "tokens.ts") };
}

/** A drawer row for a value written in a site file, with the file:line it was read from, and the token that
 *  mirrors it when there is one (checked, so a row cannot name a token that is not there). */
export function siteRow(part: string, value: string, source: string, tokenName?: string): ValueRow {
  if (!tokenName) return { part, value, source };
  token(tokenName, `row "${part}"`);
  return { part, token: `--ds-${tokenName}`, value, source };
}
