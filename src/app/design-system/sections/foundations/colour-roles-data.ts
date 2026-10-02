// The data behind Colour roles: the tiers (which token group, which grounds its cards grade on), the text
// lines quoted from the site, and the drift probes the source scan runs. Lines and counts are read from the
// source here, so nothing below is typed in twice.
import { ACCENT, FILLS, GROUNDS, INK, LINES, PRIMARY, STATUS, TEXT, VEILS, type Token } from "@/components/design-system/tokens";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { ALL_TOKENS, TYPE_ROLES } from "@/components/design-system/tokens";
import { JOBS } from "@/components/website/jobs-data";
import { at, hexProbe } from "./colour-scan";
import { LIGHT, type Grade } from "./colour-kit";

export type Tier = {
  readonly title: string;
  /** the export in tokens, for the source chip and the snippet */
  readonly exportName: string;
  readonly tokens: readonly Token[];
  /** the grounds each card grades on, or false */
  readonly grade: (t: Token) => Grade;
};

const never = () => false as const;
const text = (t: Token): Grade => (/-(?:08|20|30)$/.test(t.name) ? false : LIGHT);

export const TIERS = {
  ink: { title: "Ink and its alpha ladder", exportName: "INK", tokens: INK, grade: text },
  primary: { title: "Primary", exportName: "PRIMARY", tokens: PRIMARY, grade: never },
  grounds: { title: "Grounds and surfaces", exportName: "GROUNDS", tokens: GROUNDS, grade: never },
  fills: { title: "Fills", exportName: "FILLS", tokens: FILLS, grade: never },
  text: { title: "Text", exportName: "TEXT", tokens: TEXT, grade: () => LIGHT },
  lines: { title: "Lines", exportName: "LINES", tokens: LINES, grade: () => ["surface", "page"] },
  accent: {
    title: "Accent",
    exportName: "ACCENT",
    tokens: ACCENT,
    grade: (t: Token) => (t.name === "color-accent" ? ["page", "surface", "container", "navy"] : false),
  },
  status: {
    title: "Status",
    exportName: "STATUS",
    tokens: STATUS,
    grade: (t: Token) => (/tint|line|halo/.test(t.name) ? false : /on-dark/.test(t.name) ? ["navy"] : LIGHT),
  },
  veils: { title: "Veils and halos", exportName: "VEILS", tokens: VEILS, grade: never },
} satisfies Record<string, Tier>;

const W = "src/components/website/";

export type TextLine = {
  readonly token: string;
  /** a type role from tokens */
  readonly type: string;
  readonly caps?: boolean;
  readonly text: string;
  readonly source: string;
};

/** The hero lede, quoted from Hero.tsx (it is written inline there, so it cannot be imported). */
export const HERO_LEDE = "Our model watched millions of hours of gameplay. Now it understands the game player.";

/** The FAQ heading, quoted from Faq.tsx, its last word in the accent. */
export const FAQ_HEAD = { lead: "Questions, ", accent: "answered.", source: at(`${W}Faq.tsx`, /text-accent">answered\./) } as const;

/** The text roles on one ground, each line quoted from the site. */
export const TEXT_LINES: readonly TextLine[] = [
  { token: "color-text-quiet", type: "card-meta", caps: true, text: "Model 01", source: at(`${W}Players.tsx`, /text-slate-400"/) },
  { token: "color-ink", type: "card-title", text: "One model. Three jobs.", source: at(`${W}Jobs.tsx`, /One model\./) },
  { token: "color-text-body", type: "lede", text: HERO_LEDE, source: at(`${W}Hero.tsx`, /"font-sans text-\[#475569\] "/) },
  { token: "color-text-muted", type: "body-s", text: JOBS[0].body, source: at(`${W}Jobs.tsx`, /min-h-\[2\.8em\]/) },
];

/** Tokens a strip draws on the container rather than on white, because that is where they ship. */
export const ON_CONTAINER = ["color-line-faint", "color-skeleton-container", "color-shimmer"];

type Probe = { readonly label: string; readonly re: RegExp; readonly reads: string; readonly swatch: string };
export type DriftRole = { readonly role: string; readonly probes: readonly Probe[] };

/** A Tailwind palette class under any of the colour utilities. */
const tw = (name: string) =>
  new RegExp(`(?<![\\w-])(?:text|bg|border|divide|ring|fill|stroke|decoration|outline)-${name.replace("/", "\\/")}(?![\\w/.\\[-])`);
/** Any colour utility on the @theme accent, with or without an alpha. */
const ACCENT_CLASS = /(?<![\w-])(?:text|bg|border|decoration|ring|fill|stroke|outline|caret|shadow)-accent(?![\w-])/;
const hex = (h: string, reads: string): Probe => ({ label: h, re: hexProbe(h), reads, swatch: h });

/** Every way the site writes one role today. The scan counts each, so the table shows where a role has drifted. */
export const DRIFT: readonly DriftRole[] = [
  {
    role: "The navies",
    probes: [
      hex("#0a1b33", "ink, for type"),
      hex("#0a152d", "primary, for fills"),
      hex("#0b1526", "the terminal body"),
      hex("#030D2D", "the logo core"),
    ],
  },
  {
    role: "Body text",
    probes: [
      hex("#475569", "Tailwind v3 slate-600"),
      { label: "slate-600 class", re: tw("slate-600"), reads: "Tailwind v4 oklch, about #45556c", swatch: "#45556c" },
    ],
  },
  {
    role: "Muted text",
    probes: [
      hex("#64748b", "Tailwind v3 slate-500"),
      { label: "slate-500 class", re: tw("slate-500"), reads: "Tailwind v4 oklch, about #62748e", swatch: "#62748e" },
    ],
  },
  {
    role: "Hairline",
    probes: ["80", "70", "50"].map((a) => ({
      label: `slate-200/${a}`,
      re: tw(`slate-200/${a}`),
      reads: `#e2e8f0 at ${a}%`,
      swatch: `rgb(226 232 240 / 0.${a.slice(0, 1)})`,
    })),
  },
  {
    role: "Strong hairline",
    probes: [
      { label: "slate-300", re: tw("slate-300"), reads: "#cad5e2", swatch: "#cad5e2" },
      { label: "slate-300/80", re: tw("slate-300/80"), reads: "#cad5e2 at 80%", swatch: "rgb(202 213 226 / 0.8)" },
      hex("#b7c0cb", "the outline hover border"),
    ],
  },
  {
    role: "Accent",
    probes: [
      hex("#1a6dff", "the accent as a hex"),
      { label: "accent classes", re: ACCENT_CLASS, reads: "text-accent, bg-accent and kin, from @theme", swatch: "#1a6dff" },
      { label: "26, 109, 255", re: /\b26,\s*109,\s*255\b|\b26 109 255\b/, reads: "the accent as rgb numbers", swatch: "#1a6dff" },
      hex("#2f6dff", "the glyph sweep's band ink"),
      hex("#3c82ff", "the floor's halo"),
      hex("#2a8ff2", "the floor's glow"),
    ],
  },
  {
    role: "Accent on dark",
    probes: [
      hex("#6ea8ff", "the terminal's answer"),
      { label: "110, 168, 255", re: /\b110,\s*168,\s*255\b/, reads: "the same, as rgb numbers", swatch: "#6ea8ff" },
      hex("#7fb2ff", "the hologram glow"),
      { label: "120, 175, 255", re: /\b120,\s*175,\s*255\b|120\s*\/\s*255,\s*175\s*\/\s*255/, reads: "the laser glow", swatch: "#78afff" },
      hex("#9cc0ff", "the CTA dot band"),
    ],
  },
  {
    role: "Greys round the container",
    probes: [
      hex("#e3e5e8", "the container"),
      hex("#f6f7f9", "the sunken panel"),
      hex("#e0e2e5", "the floor's colour"),
      hex("#d8dade", "the floor's fog"),
    ],
  },
];

/** What TokenStyle prints, counted from the tokens rather than typed in. */
const printed = ALL_TOKENS.filter((t) => t.css !== false);
export const TOKEN_STYLE_ROWS: readonly KeyRow[] = [
  { key: "mounted by", value: "(guide)/layout.tsx and frame/layout.tsx, so every specimen and frame has the values" },
  { key: "selector", value: ":root, or any selector passed in" },
  { key: "prefix", value: "--ds-, which no site file reads" },
  {
    key: "declarations",
    value: `${printed.length} tokens and ${TYPE_ROLES.length} type roles, ${printed.filter((t) => t.name.startsWith("color-")).length} of the tokens colours`,
  },
  { key: "left out", value: `${ALL_TOKENS.length - printed.length} tokens with no CSS form (springs and one glow)` },
];
