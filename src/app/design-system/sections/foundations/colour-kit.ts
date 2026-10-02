// Shared helpers for the three colour sections: a token as a swatch card, as drawer rows and as strip items,
// the colour the contrast maths can read for it, and where its group is written in tokens. Server only,
// because the card's file count comes from the source scan.
import type { ReactNode } from "react";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { SpecSource } from "@/app/design-system/_kit/SpecHead";
import type { TokenSwatchProps } from "@/app/design-system/_kit/TokenSwatch";
import { parseColor, type GroundName } from "@/app/design-system/_kit/contrast";
import { tokenByName, type Token } from "@/components/design-system/tokens";
import { filesFor, find } from "./colour-scan";
import type { SampleMode, StripItem } from "./colour-strip";

/** The grounds a card grades a colour on, or false for a fill, a line or a glow. */
export type Grade = readonly (GroundName | string)[] | false;

export const LIGHT: readonly GroundName[] = ["page", "surface", "container"];

export const cssName = (t: Token) => `--ds-${t.name}`;
export const shortName = (t: Token) => t.name.replace(/^color-/, "");

/** A token that must exist. A rename in tokens fails the build here rather than drawing an empty swatch. */
export function tok(name: string): Token {
  const t = tokenByName(name);
  if (!t) throw new Error(`design-system colour: no token ${name}`);
  return t;
}

/** "Header.tsx:73" from "components/website/Header.tsx:73". */
export function shortSource(source: string): string {
  return source === "system" ? "system addition" : (source.split("/").pop() ?? source);
}

/** The colour the contrast maths can read: the value, or its sRGB hex ("#e2e8f0 at 80%" becomes an rgb with alpha). */
export function readable(t: Token): string {
  if (parseColor(t.value)) return t.value;
  const m = /^#([0-9a-f]{6})(?: at (\d+)%)?$/i.exec(t.srgb ?? "");
  if (!m) return t.value;
  if (!m[2]) return `#${m[1]}`;
  const n = (i: number) => parseInt(m[1].slice(i, i + 2), 16);
  return `rgb(${n(0)} ${n(2)} ${n(4)} / ${Number(m[2]) / 100})`;
}

/** A token card. The kit's maths reads hex and rgb, so an oklch value shows no grades on its card. Its
 *  grades live in the contrast matrix, worked from the sRGB beside it. */
export function swatchOf(t: Token, grade: Grade = false): TokenSwatchProps {
  return {
    name: cssName(t),
    value: t.value,
    use: t.useFor,
    never: t.neverFor,
    files: filesFor(t),
    source: shortSource(t.source),
    contrast: grade && parseColor(t.value) ? grade : false,
  };
}

/** The drawer's values table for a group: role, CSS name, value (with its sRGB), source and the site's class. */
export function valueRows(tokens: readonly Token[]): ValueRow[] {
  return tokens.map((t) => ({
    part: t.role,
    token: cssName(t),
    value: t.srgb ? `${t.value}, about ${t.srgb}` : t.value,
    source: t.utility ? `${t.source} · ${t.utility}` : t.source,
  }));
}

type ItemOpts = {
  caption?: (t: Token) => ReactNode;
  on?: (t: Token) => string | undefined;
  onName?: (t: Token) => string | undefined;
};

/** Strip items for a list of tokens, each drawn in its own mode. */
export function itemsOf(tokens: readonly Token[], mode: SampleMode | ((t: Token) => SampleMode), opts: ItemOpts = {}): StripItem[] {
  return tokens.map((t) => ({
    name: shortName(t),
    value: readable(t),
    mode: typeof mode === "function" ? mode(t) : mode,
    caption: opts.caption?.(t),
    on: opts.on?.(t),
    onName: opts.onName?.(t),
  }));
}

/** Where a token group is declared: the tokens import, its export and the line of the declaration. */
export function groupSource(exportName: string, file: "token-colour.ts" | "token-palettes.ts"): SpecSource {
  const hit = find(`src/components/design-system/${file}`, new RegExp(`export const ${exportName}\\b`));
  return { from: "@/components/design-system/tokens", name: exportName, file, line: hit?.line };
}

/** The snippet a drawer copies for a group: the import and the two ways a value is read. */
export function groupCode(exportName: string, sample: Token): string {
  return [
    `import { ${exportName}, cssVar } from "@/components/design-system/tokens";`,
    "",
    `// CSS, once TokenStyle is mounted`,
    `color: var(${cssName(sample)});`,
    "",
    `// TSX`,
    `<span style={{ color: cssVar("${sample.name}") }} />`,
  ].join("\n");
}

/** "8 tokens · 2 system additions" for a group's caption. */
export function groupCaption(tokens: readonly Token[]): string {
  const added = tokens.filter((t) => t.source === "system").length;
  const n = `${tokens.length} ${tokens.length === 1 ? "token" : "tokens"}`;
  return added ? `${n} · ${added} system ${added === 1 ? "addition" : "additions"}` : n;
}
