// Data for Surfaces and the accent rule: the six grounds a section may stand on, the container
// composition's pins, where the accent may appear, and the drawer rows, each with the file:line it mirrors.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { tv } from "../components/display-values";
import { read, rv } from "./pattern-values";

const W = "components/website/";

export type SurfaceKind = "page" | "card" | "container" | "navy" | "terminal" | "accent";

export type Surface = {
  readonly kind: SurfaceKind;
  readonly name: string;
  readonly value: string;
  /** where it ships, a fact for the tile */
  readonly where: string;
};

export const SURFACES: readonly Surface[] = [
  { kind: "page", name: "Page", value: "#f9fafb", where: "every light section, the grain from Understands down" },
  { kind: "card", name: "White card", value: "#ffffff · radius 28", where: "job cards, FAQ rows, the tab rail" },
  { kind: "container", name: "Container", value: "#f5f6f8 · radius 48", where: "the hero (the ChatGPT card keeps the earlier #e3e5e8)" },
  { kind: "navy", name: "Navy", value: "#0a152d · radius 36", where: "the 6labs card, the primary fill" },
  { kind: "terminal", name: "Terminal", value: "#0b1526 · radius 16", where: "the jobs terminal window" },
  { kind: "accent", name: "Accent water", value: "#1a6dff · grain 7%", where: "the players section only" },
];

export const SURFACE_VALUES = [
  tv("Page", "color-page"),
  tv("White card", "color-surface"),
  tv("Card radius", "radius-lg"),
  tv("Card hairline", "color-line"),
  tv("Container", "color-container"),
  tv("Container radius", "radius-2xl"),
  tv("Container radius on phones", "radius-container-sm"),
  tv("Container hairline", "color-line-faint"),
  tv("Container shadow", "shadow-container"),
  tv("Navy", "color-primary"),
  read("Navy card radius", "36, 28 on phones", `${W}Understands.tsx:22`, "--ds-radius-xl", "rounded-[36px] max-md:rounded-[28px]"),
  tv("Terminal", "color-terminal-bg"),
  read("Terminal radius", "16", `${W}JobTerminal.tsx:135`, "--ds-radius-sm", "rounded-[16px] bg-[#0b1526]"),
  tv("Accent water", "color-accent"),
  read("Water grain", "noise at 0.07, alpha only", `${W}AccentWave.tsx:22`, undefined, "const GRAIN = 0.07;"),
] as const;

/** The container recipe's own rows: the box's tokens, then the hero type it is set in. */
export const RECIPE_VALUES = [
  ...SURFACE_VALUES.slice(4, 9),
  rv("Headline", "hero"),
  rv("Lede", "lede"),
  tv("Lede measure", "measure-lede"),
  tv("Lede colour", "color-text-body"),
] as const;

const BOX = '[data-pin="box"]';
const HEAD = `${BOX} [data-pin="headline"]`;

export const CONTAINER_PINS: readonly AnatomyPin[] = [
  { selector: BOX, name: "Container", token: "--ds-color-container", value: "radius 48 (32) · hairline · shadow", source: "Hero.tsx:125", expect: "rounded-[48px] border border-slate-200/50", padding: true, side: "left" },
  { selector: HEAD, name: "Headline", token: "--ds-type-hero-size", value: "the hero's type: Outfit 34, 56 from md · 500 · navy", source: "Hero.tsx:187", expect: "\"text-[34px] md:text-[56px]\"", side: "left" },
  { selector: `${HEAD} > span`, name: "Accent word", token: "--ds-color-accent", value: "one word, typed in", source: "Hero.tsx:193", expect: "className=\"text-accent\"", side: "right" },
  { selector: `${BOX} [data-pin="lede"]`, name: "Lede", token: "--ds-color-text-body", value: "#475569 · 14, 15 from md · max 440", source: "Hero.tsx:205", expect: "md:text-[15px] mt-5 max-w-[440px]", side: "left" },
  { selector: '[data-pin="cta"]', name: "Try now", token: "--ds-color-primary", value: "the one solid primary", source: "Hero.tsx:231", expect: "<PrimaryCta>Try now</PrimaryCta>", side: "right" },
  { selector: '[data-pin="numbers"] dl', name: "Numbers", value: "under the box, centred, as the under-row sets them", source: "Hero.tsx:105", expect: "{numbers(false)}", side: "right" },
];

/** Every place the accent may appear outside the water, with the shipped instance it is read from. */
export const ACCENT_PLACES: readonly KeyRow[] = [
  { key: "type", value: "a word or two at the end of a line: models, Three jobs., answered., 2 billion to go", source: "Jobs.tsx:107" },
  { key: "icons", value: "the tag icons on the job cards, 17px at stroke 1.6", source: "Jobs.tsx:194" },
  { key: "dots", value: "the live dot under Try now and the Running dot on the picked player", source: "Hero.tsx:239" },
  { key: "links", value: "text and underline on hover, never at rest", source: "Hero.tsx:212" },
  { key: "focus", value: "the 2px focus ring on light grounds", source: "tokens: focus-color" },
  { key: "water", value: "the one fill: the players section's ground, drawn by AccentWave", source: "AccentWave.tsx:36" },
];

/** The Do / Don't heading, quoted from Jobs.tsx:107 and Faq.tsx:23. */
export const HEADS = {
  jobs: { title: "One model.", accent: "Three jobs." },
  faq: { title: "Questions,", accent: "answered." },
} as const;

export const SURFACES_CODE = `import { typeStyle } from "@/components/design-system/tokens";
import { HeroNumbers } from "@/components/website/HeroBits";
import { PrimaryCta } from "@/components/website/PrimaryCta";

// the container look: #f5f6f8, radius 48 (32 under md), the faint hairline, the container shadow
<div className="rounded-(--ds-radius-2xl) max-md:rounded-(--ds-radius-container-sm) border border-(--ds-color-line-faint) bg-(--ds-color-container) shadow-(--ds-shadow-container) px-6 py-10 md:p-16">
  <p className="text-(--ds-color-ink)" style={typeStyle("hero")}>
    Making <span className="text-(--ds-color-accent)">models</span> of human players.
  </p>
  <p className="mt-5 max-w-(--ds-measure-lede) text-(--ds-color-text-body)" style={typeStyle("lede")}>...</p>
  <div className="mt-8 max-md:mt-6"><PrimaryCta>Try now</PrimaryCta></div>
</div>
// the numbers sit under the box, as the hero's under-row puts them, never inside it
<HeroNumbers stats={stats} ready left={false} />`;
