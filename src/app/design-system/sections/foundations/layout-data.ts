// The layout section's data: the widths the container diagram is drawn at, the breakpoint ladders with the
// variant prefixes the source scan counts, the media gates and the header offsets, each transcribed value
// asserted against its source. Widths and measures are LAYOUT and BREAKPOINTS in tokens.
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import { BREAKPOINTS, LAYOUT } from "@/components/design-system/tokens";
import { site, type Assertion } from "./foundation-assert";
import { check } from "./foundation-scan";

const px = (name: string) => {
  const t = LAYOUT.find((l) => l.name === name);
  if (!t) throw new Error(`design-system layout: no token ${name}`);
  return parseFloat(t.value);
};

export const CONTAINER = px("container");
export const CONTAINER_FULL = px("container-full");

/** The nesting at a window width: page gutter, the auto margin, the inner gutter and the content. */
export function nestAt(width: number) {
  const md = width >= 768;
  const gutter = px(md ? "gutter-page-md" : "gutter-page");
  const inner = md ? px("gutter-section-md") : px("gutter-page");
  const box = Math.min(CONTAINER, width - 2 * gutter);
  const margin = (width - 2 * gutter - box) / 2;
  return { width, gutter, margin, box, inner, content: box - 2 * inner };
}

export const DIAGRAM_WIDTHS = [1920, 1280, 375] as const;

export const MEASURES = LAYOUT.filter((t) => t.name.startsWith("measure-")).map((t) => ({
  name: t.name,
  px: parseFloat(t.value),
  note: t.useFor,
}));

export const LAYOUT_VALUES = LAYOUT.map((t) => ({ part: t.role, token: `--ds-${t.name}`, value: t.value, source: t.source }));

export const LAYOUT_CODE = `import { cssVar } from "@/components/design-system/tokens";

<section style={{ maxWidth: cssVar("container"), marginInline: "auto" }}>...</section>`;

/** Which ladder each breakpoint token belongs to, and the variant prefixes that open it in the site. */
export const LADDERS: Record<string, { ladder: "Tailwind" | "Full hero" | "Edge"; prefixes: readonly string[] }> = {
  "bp-sm": { ladder: "Tailwind", prefixes: ["sm", "max-sm"] },
  "bp-md": { ladder: "Tailwind", prefixes: ["md", "max-md"] },
  "bp-lg": { ladder: "Tailwind", prefixes: ["lg", "max-lg"] },
  "bp-xl": { ladder: "Tailwind", prefixes: ["xl", "max-xl"] },
  "bp-hero-561": { ladder: "Full hero", prefixes: ["min-[561px]"] },
  "bp-hero-901": { ladder: "Full hero", prefixes: ["min-[901px]"] },
  "bp-hero-1600": { ladder: "Full hero", prefixes: ["min-[1600px]", "max-[1600px]"] },
  "bp-hero-1920": { ladder: "Full hero", prefixes: ["min-[1920px]"] },
  "bp-hero-2560": { ladder: "Full hero", prefixes: ["min-[2560px]"] },
  "bp-edge": { ladder: "Edge", prefixes: ["max-[380px]"] },
};

export const BREAKPOINT_ROWS = BREAKPOINTS.map((t) => ({ ...t, px: parseFloat(t.value), ...LADDERS[t.name] }));

export type Tick = { name: string; px: number; ladder: "Tailwind" | "Full hero" | "Edge"; prefixes: readonly string[] };

/** The full hero ladder reuses xl as min-[1280px], so its lane carries that tick too. */
export const TICKS: readonly Tick[] = [
  ...BREAKPOINT_ROWS,
  { name: "bp-xl-hero", px: parseFloat(BREAKPOINTS.find((b) => b.name === "bp-xl")?.value ?? "1280"),
    ladder: "Full hero" as const, prefixes: ["min-[1280px]"] },
];

export const ALL_PREFIXES = TICKS.flatMap((t) => t.prefixes);

/** The axis end of the ruler, the widest breakpoint. */
export const RULER_MAX = Math.max(...BREAKPOINT_ROWS.map((b) => b.px));

export type Gate = { key: string; value: string; assert: Assertion };

export const MEDIA_GATES: readonly Gate[] = [
  { key: "Short screen", value: "(min-width: 1280px) and (max-height: 720px) caps the full headline at 48",
    assert: site("Hero.tsx", "[@media(min-width:1280px)_and_(max-height:720px)]:text-[48px]!") },
  { key: "Fine pointer", value: "(hover: hover) and (pointer: fine) shows the terminal's pointer hint",
    assert: site("JobTerminal.tsx", "[@media(hover:hover)_and_(pointer:fine)]:flex") },
  { key: "Liquid desktop", value: "min-width 1024 with hover, a fine pointer and motion allowed runs the liquid line",
    assert: site("LiquidLine.tsx", '"(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"') },
  { key: "Dense screen", value: "devicePixelRatio 1.5 and up, read in script, lets the players' content scale up to 1.35 past 1920",
    assert: site("usePlayersScale.ts", "const BASE = 1920;", "const MAX = 1.35;", "const DENSE = 1.5;") },
];

export const HEADER_OFFSETS: readonly Gate[] = [
  { key: "Full hero", value: "73 on phones, 89 from md", assert: site("Hero.tsx", "pt-[calc(73px+40px)] md:pt-[calc(89px+clamp(48px,9vh,120px))]") },
  { key: "Understands", value: "70 on phones, 89 from md", assert: site("Understands.tsx", "pt-[calc(70px+96px)]", "md:pt-[calc(89px+") },
  { key: "Header bar", value: "py-5, py-4 on phones, under a 1px rule", assert: site("Header.tsx", "px-6 py-5 max-md:px-4 max-md:py-4 border-b") },
];

export const HEADER_TOKENS = LAYOUT.filter((t) => t.name.startsWith("header-h"));

/** The full-view copy grid's own class text, asserted so the diagram's 1448 is the site's. */
export const FULL_GRID = site("Hero.tsx", "mx-auto w-full max-w-[1448px] px-6 max-md:px-4");
export const SECTION_INNER = site("Closing.tsx", "max-w-[1400px] flex-col items-center px-4");
export const SUBLINE = site("Closing.tsx", "mt-5 max-w-[520px] text-balance");
export const PAGE_GUTTER: Assertion = { file: "app/website/page.tsx", needles: ["px-4 md:px-8 pt-24"] };

/** A pin's file:line and expect, both from the assertion its value was read off. */
const cited = (a: Assertion) => ({ source: check(a).at, expect: a.needles[0] });

/** The closing section in a frame at true widths: the page gutter, the container and the subline measure. */
export const FRAME_PINS: readonly AnatomyPin[] = [
  { selector: "[data-ds-gutter]", name: "Page gutter", token: "--ds-gutter-page, --ds-gutter-page-md",
    value: "16, 32 from md", ...cited(PAGE_GUTTER), padding: true },
  { selector: "#get-access", name: "Container and inner gutter", token: "--ds-container, --ds-gutter-section-md",
    value: "1400 at most, inner 16, 64 from md", ...cited(SECTION_INNER), padding: true },
  { selector: "#get-access h2 + p", name: "Subline measure", token: "--ds-measure-subline", value: "520 at most",
    ...cited(SUBLINE) },
];

export const PHONE_COPY = "Opens every menu. Walks the wrong way on purpose. Finds your bugs before QA does.";
