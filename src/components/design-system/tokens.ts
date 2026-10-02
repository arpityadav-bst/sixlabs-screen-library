// Every token of the 6labs system as data, in one place. The values mirror the shipped site (each token
// cites the file:line it mirrors) and add only what the site lacks. TokenStyle turns them into --ds-*
// custom properties. Section files read the groups for swatches, tables and drawers.
import { ACCENT, FILLS, GROUNDS, INK, LINES, PRIMARY, STATUS, TEXT, VEILS } from "./token-colour";
import { BRAND, FRINGE, HOLOGRAM, ON_BLUE, TERMINAL } from "./token-palettes";
import { DURATIONS, EASES, SCALES, SPRINGS, TRAVEL } from "./token-motion";
import { FOCUS_TOKENS, ICONS, RADIUS, SHADOW, STROKE } from "./token-shape";
import { BREAKPOINTS, LAYOUT, MEDIA, SPACING, Z } from "./token-space";
import { FAMILIES, TYPE_ROLES, TYPE_SCALE } from "./token-type";
import type { Token, TokenGroup } from "./token-types";

export type { MediaKey, Token, TokenGroup, TypeRole, TypeStep } from "./token-types";
export { cssVar } from "./token-types";
export { ACCENT, FILLS, GROUNDS, INK, LINES, PRIMARY, STATUS, TEXT, VEILS };
export { BRAND, FRINGE, HOLOGRAM, ON_BLUE, TERMINAL };
export { DURATIONS, EASES, SCALES, SPRINGS, TRAVEL, EASE_OUT, EASE_SWEEP } from "./token-motion";
export { FOCUS_TOKENS, ICONS, ICON_STROKE, RADIUS, SHADOW, STROKE, type IconSize } from "./token-shape";
export { BREAKPOINTS, LAYOUT, MEDIA, SPACING, Z };
export { FAMILIES, TYPE_ROLES, TYPE_SCALE };
export { typeStyle } from "./token-type";

/** Every token group, in the order the guide shows them. Type roles are separate (TYPE_ROLES). */
export const TOKEN_GROUPS: readonly TokenGroup[] = [
  { id: "accent", title: "Accent", tokens: ACCENT },
  { id: "ink", title: "Ink and its alpha ladder", tokens: INK },
  { id: "primary", title: "Primary", tokens: PRIMARY },
  { id: "grounds", title: "Grounds and surfaces", tokens: GROUNDS },
  { id: "fills", title: "Fills", tokens: FILLS },
  { id: "text", title: "Text", tokens: TEXT },
  { id: "lines", title: "Lines", tokens: LINES },
  { id: "status", title: "Status", tokens: STATUS },
  { id: "veils", title: "Veils and halos", tokens: VEILS },
  { id: "on-blue", title: "On blue", tokens: ON_BLUE },
  { id: "terminal", title: "Terminal", tokens: TERMINAL },
  { id: "hologram", title: "Hologram and glow", tokens: HOLOGRAM },
  { id: "fringe", title: "Chromatic fringe", tokens: FRINGE },
  { id: "brand", title: "Brand mark", tokens: BRAND },
  { id: "families", title: "Type families", tokens: FAMILIES },
  { id: "type-scale", title: "Type scale", tokens: TYPE_SCALE },
  { id: "spacing", title: "Spacing", tokens: SPACING },
  { id: "layout", title: "Layout", tokens: LAYOUT },
  { id: "breakpoints", title: "Breakpoints", tokens: BREAKPOINTS },
  { id: "radius", title: "Radius", tokens: RADIUS },
  { id: "stroke", title: "Stroke", tokens: STROKE },
  { id: "shadow", title: "Elevation and glow", tokens: SHADOW },
  { id: "focus", title: "Focus", tokens: FOCUS_TOKENS },
  { id: "icons", title: "Icon sizes", tokens: ICONS },
  { id: "z", title: "Z-scale", tokens: Z },
  { id: "eases", title: "Eases", tokens: EASES },
  { id: "durations", title: "Durations", tokens: DURATIONS },
  { id: "springs", title: "Springs", tokens: SPRINGS },
  { id: "scales", title: "Press and grow scales", tokens: SCALES },
  { id: "travel", title: "Travel", tokens: TRAVEL },
];

export const ALL_TOKENS: readonly Token[] = TOKEN_GROUPS.flatMap((g) => g.tokens);

const BY_NAME = new Map(ALL_TOKENS.map((t) => [t.name, t]));

/** A token by its name ("color-ink"), or undefined. */
export function tokenByName(name: string): Token | undefined {
  return BY_NAME.get(name);
}

/** Names that appear twice, for the coverage check. Empty when the data is sound. */
export function tokenProblems(): string[] {
  const seen = new Set<string>();
  const twice: string[] = [];
  for (const t of ALL_TOKENS) {
    if (seen.has(t.name)) twice.push(`duplicate token ${t.name}`);
    seen.add(t.name);
  }
  for (const r of TYPE_ROLES) if (seen.has(`type-${r.name}`)) twice.push(`type role clashes ${r.name}`);
  return twice;
}
