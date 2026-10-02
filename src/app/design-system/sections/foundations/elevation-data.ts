// The stroke and elevation section's data: which line token sits on which ground, which shadow tile ships
// on which ground, and the Don't panel's black shadow. Every value is a token from tokens.
import { GROUNDS as KIT_GROUNDS } from "@/app/design-system/_kit/contrast";
import { INK, LINES, SHADOW, STROKE, TERMINAL, type Token } from "@/components/design-system/tokens";
import type { Assertion } from "./foundation-assert";

const find = (list: readonly Token[], name: string) => {
  const t = list.find((x) => x.name === name);
  if (!t) throw new Error(`design-system elevation: no token ${name}`);
  return t;
};

/** A token as a colour the contrast maths can read: its sRGB hex, with the alpha its value carries. */
export function lineColor(t: Token): string {
  const m = t.srgb?.match(/^(#[0-9a-f]{6})(?: at (\d+)%)?$/i);
  if (!m) return t.value;
  if (!m[2]) return m[1];
  const n = parseInt(m[1].slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Number(m[2]) / 100})`;
}

export type LineGround = { ground: "surface" | "page" | "container" | "terminal"; hex: string; lines: readonly Token[] };

const LIGHT = ["color-line", "color-line-strong", "color-line-hover", "color-line-field"].map((n) => find(LINES, n));

export const LINE_GROUNDS: readonly LineGround[] = [
  { ground: "surface", hex: KIT_GROUNDS.surface, lines: LIGHT },
  { ground: "page", hex: KIT_GROUNDS.page, lines: LIGHT },
  { ground: "container", hex: KIT_GROUNDS.container, lines: [find(INK, "color-ink-08"), find(LINES, "color-line-faint")] },
  { ground: "terminal", hex: find(TERMINAL, "color-terminal-bg").value, lines: [find(TERMINAL, "color-terminal-rule")] },
];

const lineTokens = [...LIGHT, find(INK, "color-ink-08"), find(LINES, "color-line-faint"), find(TERMINAL, "color-terminal-rule")];
export const LINE_VALUES = lineTokens.map((t) => ({ part: t.role, token: `--ds-${t.name}`, value: t.value, source: t.source }));

export const STROKES = STROKE;
export const STROKE_VALUES = STROKE.map((t) => ({ part: t.useFor, token: `--ds-${t.name}`, value: t.value, source: t.source }));

/** Shadows by the ground they ship on. The three player card shadows (rest, hover lift, selected) live on
 *  the accent, where Players.tsx writes them. */
const ON_BLUE = new Set(["shadow-player", "shadow-lift", "shadow-player-selected"]);
const DEPTH = SHADOW.filter((t) => t.name.startsWith("shadow-"));
/** Lowest to highest: the hero container first, as it rests on the page, then each level by its blur. */
const ORDER = ["shadow-container", "shadow-thumb", "shadow-tooltip", "shadow-float", "shadow-pop", "shadow-modal"];
const rank = (t: Token) => (ORDER.includes(t.name) ? ORDER.indexOf(t.name) : ORDER.length);
export const LIGHT_SHADOWS = DEPTH.filter((t) => !ON_BLUE.has(t.name)).sort((x, y) => rank(x) - rank(y));
export const BLUE_SHADOWS = [...ON_BLUE].map((n) => find(SHADOW, n));
export const SHADOW_VALUES = DEPTH.map((t) => ({ part: t.useFor, token: `--ds-${t.name}`, value: t.value, source: t.source }));

/** The two accent glows, for the drawer. The sheen's has no CSS form, so only the caret's is drawn. */
export const GLOW_VALUES = SHADOW.filter((t) => t.name.startsWith("glow-")).map((t) => ({
  part: `${t.useFor}${t.css === false ? ", no CSS form, a value only" : ""}`,
  token: `--ds-${t.name}`,
  value: t.value,
  source: t.source,
}));

/** The light-ground hover lift: the system Card takes shadow-lift on hover through its lift prop. */
export const CARD_LIFT: Assertion = {
  file: "components/design-system/card.module.css",
  needles: ["[data-lift]:not([data-disabled]):hover", "box-shadow: var(--ds-shadow-lift)"],
};

/** The caret glow's specimen line, the container hero's headline as the site types it. */
export const CARET_LINE = { before: "Making", word: "models", after: "of" } as const;

/** The flat surfaces: cards in the flow on light grounds carry no shadow by design. */
export const FLAT = { name: "none", use: "Comparison, job and FAQ cards" };

/** The Don't panel: shadow-float's geometry in black, to set beside the navy original. */
export const BLACK_FLOAT = "0 1px 2px rgba(0,0,0,0.06), 0 12px 28px -12px rgba(0,0,0,0.35)";

export const ELEVATION_CODE = `import { cssVar } from "@/components/design-system/tokens";

<div style={{ boxShadow: cssVar("shadow-pop"), borderRadius: cssVar("radius-sm") }}>...</div>`;

export const CARD_COPY = { title: "Intelligence", body: "Your KPIs show what happened. The model tells you why it happened." };
