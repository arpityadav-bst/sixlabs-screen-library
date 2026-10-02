// The data behind Contrast: the matrix's text colours and grounds (read from the tokens), the site's pairs
// that sit under the line today (their file:line found by the scan), the lines and icons that need 3:1, and
// the open accent-ink decision. Ratios are never written here. Every one is worked out where it is shown.
import type { Ground } from "@/app/design-system/_kit/Canvas";
import type { GroundName } from "@/app/design-system/_kit/contrast";
import { PLAYERS } from "@/components/website/players-data";
import { readable, tok } from "./colour-kit";
import { at } from "./colour-scan";
import { FAQ_HEAD, HERO_LEDE } from "./colour-roles-data";

export type Fg = { readonly label: string; readonly token: string; readonly value: string };
export type MatrixGround = { readonly label: string; readonly ground: Ground; readonly token: string; readonly value: string };

const fg = (label: string, token: string): Fg => ({ label, token, value: readable(tok(token)) });
const ground = (label: string, g: Ground, token: string): MatrixGround => ({ label, ground: g, token, value: tok(token).value });

/** The rows: every colour the site sets text in. */
export const FOREGROUNDS: readonly Fg[] = [
  fg("Ink", "color-ink"),
  fg("Body", "color-text-body"),
  fg("Muted", "color-text-muted"),
  fg("Quiet", "color-text-quiet"),
  fg("Accent", "color-accent"),
  fg("White", "color-surface"),
  fg("White 80%", "color-on-blue-80"),
];

/** The columns: every ground the site sets text on. */
export const MATRIX_GROUNDS: readonly MatrixGround[] = [
  ground("Page", "page", "color-page"),
  ground("Surface", "surface", "color-surface"),
  ground("Container", "container", "color-container"),
  ground("Navy", "navy", "color-primary"),
  ground("Accent", "on-blue", "color-accent"),
  ground("Terminal", "terminal", "color-terminal-bg"),
];

const W = "src/components/website/";

export type SitePair = {
  readonly key: string;
  readonly what: string;
  readonly fg: string;
  readonly bg: GroundName | string;
  readonly bgName: string;
  readonly source: string;
};

/** Text the site ships today under 4.5:1 at its size, each found in the source by the scan. */
export const SITE_PAIRS: readonly SitePair[] = [
  {
    key: "Yours next.",
    what: "accent, 13px medium, on the hero container",
    fg: readable(tok("color-accent")),
    bg: "container",
    bgName: "container",
    source: at(`${W}Hero.tsx`, /font-medium text-accent/),
  },
  {
    key: "Running",
    what: "accent, 11px mono caps, on a white player card",
    fg: readable(tok("color-accent")),
    bg: "surface",
    bgName: "white",
    source: at(`${W}Players.tsx`, /\(on \? "text-accent" : ""\)/),
  },
  {
    key: "Model 01",
    what: "quiet slate-400, 11px mono caps, on a white player card",
    fg: readable(tok("color-text-quiet")),
    bg: "surface",
    bgName: "white",
    source: at(`${W}Players.tsx`, /border-slate-200\/70 text-slate-400/),
  },
  {
    key: "Player body",
    what: "white 80%, 16px on phones and 18px from md, on the blue",
    fg: readable(tok("color-on-blue-80")),
    bg: tok("color-accent").value,
    bgName: "the blue",
    source: at(`${W}Players.tsx`, /leading-relaxed text-white\/80/),
  },
  {
    key: "$ and labels",
    what: "slate-500 (about #62748e), 12.5px mono, in the terminal",
    fg: "#62748e",
    bg: tok("color-terminal-bg").value,
    bgName: "the terminal",
    source: at(`${W}JobTerminal.tsx`, /text-slate-500/),
  },
];

export type NonText = { readonly key: string; readonly token: string; readonly grounds: readonly GroundName[] };

/** Lines and icons, where the bar is 3:1 against the ground. */
export const NON_TEXT: readonly NonText[] = [
  { key: "Field border", token: "color-line-field", grounds: ["surface", "page"] },
  { key: "Card hairline", token: "color-line", grounds: ["surface", "page"] },
  { key: "Firm hairline", token: "color-line-strong", grounds: ["surface", "page"] },
  { key: "Focus ring", token: "focus-color", grounds: ["page", "surface", "container"] },
  { key: "Quiet icon", token: "color-text-quiet", grounds: ["surface", "page", "container"] },
];

/** The open decision: a darker accent for small accent text, pending the owner. */
export const ACCENT_INK = {
  candidate: "#1559d6",
  sample: "Yours next.",
  source: at(`${W}Hero.tsx`, /font-medium text-accent/),
} as const;

/** Specimen copy for the rule pairs, quoted from the site. */
export const RULE_COPY = {
  lede: HERO_LEDE,
  question: FAQ_HEAD,
  playerTitle: PLAYERS[0].title,
  playerTagline: PLAYERS[0].tagline,
} as const;
