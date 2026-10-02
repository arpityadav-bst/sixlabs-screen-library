// The type section's data: which role each specimen row sets, the copy it quotes from the site, the class
// string it renders with and the exact source text that string is asserted against. Role values (size,
// steps, leading, tracking) come from TYPE_ROLES in tokens, never from here.
import { JOBS_HEAD } from "@/app/design-system/_data/specimens";
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import { FAMILIES, TYPE_ROLES, TYPE_SCALE, type TypeRole } from "@/components/design-system/tokens";
import { site, type Assertion } from "./foundation-assert";
import { check } from "./foundation-scan";

export type Tone = "ink" | "body" | "muted" | "quiet" | "white" | "on-blue";

export type RoleRow = {
  role: string;
  /** quoted from the site's source */
  copy: string;
  /** the class string it renders with, when it differs from the role's own classes */
  render?: string;
  tone: Tone;
  assert: Assertion;
};

const FULL_TITLE_SIZES =
  "text-[34px] min-[561px]:text-[36px] min-[901px]:text-[42px] min-[1280px]:text-[54px] min-[1600px]:text-[64px] min-[1920px]:text-[76px] min-[2560px]:text-[88px]";
const FULL_LEDE_TYPE =
  "text-[16px] min-[561px]:text-[16.5px] min-[901px]:text-[15px] min-[1280px]:text-[16px] min-[1600px]:text-[18px] min-[1920px]:text-[20px] min-[2560px]:text-[22px] leading-[1.55] tracking-[-0.015em]";
const HERO_H1 = "font-display font-medium tracking-tight leading-[1.05]";

export const HERO_ROWS: readonly RoleRow[] = [
  { role: "hero", copy: "Making models of human players.", tone: "ink",
    assert: site("Hero.tsx", HERO_H1, '"text-[34px] md:text-[56px]"') },
  { role: "stat", copy: "2B", tone: "ink", assert: site("HeroBits.tsx", "font-display text-[30px] font-medium leading-none tracking-tight tabular-nums") },
];

export const DISPLAY_ROWS: readonly RoleRow[] = [
  { role: "hero-full", copy: "Making models of human players.", render: `${HERO_H1} ${FULL_TITLE_SIZES}`, tone: "ink",
    assert: site("Hero.tsx", FULL_TITLE_SIZES, HERO_H1) },
  { role: "closing", copy: "1 million made", tone: "ink",
    assert: site("Closing.tsx", "font-display text-[clamp(38px,5.2vw,74px)] font-medium leading-[1.05] tracking-[-0.045em]") },
  { role: "h2", copy: "One model. Three jobs.", tone: "ink",
    assert: site("Jobs.tsx", "font-display text-[30px] md:text-[44px] font-medium leading-[1.1] tracking-tight") },
  { role: "scroll-line", copy: "A model is built from what the person does, not what they say.", tone: "ink",
    assert: site("ScrubLine.tsx", "font-display text-[26px] md:text-[44px] font-medium leading-[1.3] tracking-tight") },
  { role: "comparison", copy: "Watches millions of hours of gameplay", tone: "ink",
    assert: site("Understands.tsx", "font-display text-[20px] md:text-[26px] font-normal leading-[1.3] tracking-tight") },
  { role: "card-name", copy: "The explorer", tone: "ink",
    assert: site("Players.tsx", "font-display text-[22px]", "font-medium leading-tight tracking-tight") },
  { role: "card-title", copy: "Intelligence", tone: "ink",
    assert: site("Jobs.tsx", "font-display text-[20px] font-medium leading-tight tracking-[-0.03em]") },
  { role: "menu-row", copy: "What it does", tone: "ink",
    assert: site("MobileMenu.tsx", "font-display text-[20px] font-normal tracking-tight") },
  { role: "question", copy: "What is a player model?", tone: "ink",
    assert: site("Faq.tsx", "font-display text-[16px] md:text-[18px] font-medium leading-snug tracking-[-0.02em]") },
  { role: "wordmark", copy: "6labs", tone: "ink", assert: site("Header.tsx", "font-display text-2xl font-medium tracking-tight") },
];

export const FOOTER_ROW: RoleRow = {
  role: "footer-word", copy: "6labs", render: "font-display text-[clamp(84px,19vw,300px)] font-semibold leading-none tracking-[-0.055em]",
  tone: "ink", assert: site("CopyLine.tsx", "font-display text-[clamp(84px,19vw,300px)]", "foot-word font-semibold tracking-[-0.055em]"),
};

export const HERO_TEXT_ROWS: readonly RoleRow[] = [
  { role: "lede", copy: "Our model watched millions of hours of gameplay.", render: "font-sans text-[14px] md:text-[15px] leading-relaxed",
    tone: "body", assert: site("Hero.tsx", "text-[14px] md:text-[15px] mt-5 max-w-[440px] leading-relaxed") },
  { role: "caption", copy: "One million players have a copy.", tone: "body",
    assert: site("Hero.tsx", "font-sans text-[13px] leading-relaxed") },
];

export const TEXT_ROWS: readonly RoleRow[] = [
  { role: "lede-full", copy: "Our model watched millions of hours of gameplay.", render: `font-sans ${FULL_LEDE_TYPE}`, tone: "body",
    assert: site("Hero.tsx", FULL_LEDE_TYPE) },
  { role: "body-l", copy: "Every studio that joins makes the model better for every studio after it.", tone: "muted",
    assert: site("Closing.tsx", "font-sans text-[15px] leading-[1.5]", "md:text-[16px]") },
  { role: "nav", copy: "What it does", tone: "ink", assert: site("Header.tsx", "text-[15px] font-normal tracking-[-0.01em]") },
  { role: "cta", copy: "Try now", tone: "ink", assert: site("PrimaryCta.tsx", "text-[15px] font-medium") },
  { role: "body-s", copy: "Your KPIs show what happened. The model tells you why it happened.", tone: "muted",
    assert: site("Jobs.tsx", "font-sans text-[14px] leading-[1.4] tracking-[-0.01em]") },
  { role: "caption-l", copy: "Already have an account?", tone: "muted",
    assert: site("Closing.tsx", "font-sans text-[13.5px] tracking-[-0.01em]") },
  { role: "micro", copy: "Real players", tone: "ink", assert: site("CopyLine.tsx", "text-[12px] tracking-[-0.01em]") },
  { role: "eyebrow", copy: "Scroll", tone: "muted", assert: site("ScrollCue.tsx", "text-[11px] font-medium uppercase tracking-[0.18em]") },
  { role: "code-tag", copy: "US", tone: "muted", assert: site("LanguageMenu.tsx", "text-[11px] font-semibold tracking-wide") },
  { role: "subline", copy: JOBS_HEAD.sub, tone: "muted",
    assert: site("Jobs.tsx", "mt-4 max-w-[520px] font-sans text-[15px] md:text-[16px] leading-snug") },
  { role: "answer", copy: "A model of how people really play, built from what they do rather than what they say.", tone: "body",
    assert: site("Faq.tsx", "font-sans text-[15px] leading-[1.6] text-[#475569]", "max-md:text-[14px]") },
  { role: "stat-label", copy: "Human players", tone: "muted",
    assert: site("HeroBits.tsx", "mt-2 font-sans text-[14px] md:text-[15px] leading-snug") },
  { role: "tab-label", copy: "Intelligence", tone: "muted", assert: site("Jobs.tsx", "px-3.5 py-1.5 font-sans text-[13px] font-medium") },
  { role: "footer-base", copy: "© 2026 6labs.ai · All rights reserved.", tone: "muted",
    assert: site("Footer.tsx", "font-sans text-[13px] tracking-[-0.01em] text-[#64748b]") },
  { role: "footer-intro", copy: "Behavioral models of game players.", tone: "muted",
    assert: site("Footer.tsx", "text-[14px] leading-[1.65] tracking-[-0.015em]") },
  { role: "footer-head", copy: "Explore", tone: "ink", assert: site("Footer.tsx", "text-[13.5px] font-semibold tracking-[-0.02em]") },
];

export const BLUE_ROWS: readonly RoleRow[] = [
  { role: "carousel-title", copy: "The explorer", tone: "white",
    assert: site("PlayerCarousel.tsx", "font-display text-[28px] font-medium leading-[1.1] tracking-tight", "md:text-[36px]") },
  { role: "player-body", copy: "Opens every menu. Walks the wrong way on purpose. Finds your bugs before QA does.", tone: "on-blue",
    assert: site("Players.tsx", "font-sans text-[16px] md:text-[18px] leading-relaxed") },
];

export const MONO_ROWS: readonly RoleRow[] = [
  { role: "card-meta", copy: "Model 01", tone: "quiet", assert: site("Players.tsx", "font-mono text-[11px] uppercase tracking-[0.14em]") },
];

export const TERMINAL_ROW: RoleRow = {
  role: "terminal", copy: 'ask "why are payments abandoned?"', tone: "quiet",
  render: "font-[family-name:var(--font-jbmono)] text-[12.5px] leading-[22px] max-md:text-[11.5px] max-md:leading-[20px]",
  assert: site("JobTerminal.tsx", "font-[family-name:var(--font-jbmono)] text-[12.5px] leading-[22px]", "max-md:text-[11.5px] max-md:leading-[20px]"),
};

const ALL_ROWS = [
  ...HERO_ROWS, ...DISPLAY_ROWS, FOOTER_ROW, ...HERO_TEXT_ROWS, ...TEXT_ROWS, ...BLUE_ROWS, ...MONO_ROWS, TERMINAL_ROW,
];

/** The specimen row of a role, for pins that cite the same assertion. */
export function rowOf(role: string): RoleRow {
  const row = ALL_ROWS.find((r) => r.role === role);
  if (!row) throw new Error(`design-system type: no row for ${role}`);
  return row;
}

export const ROLE_CODE = `import { typeStyle } from "@/components/design-system/tokens";

<h2 style={typeStyle("h2")}>One model. Three jobs.</h2>`;

export const FAMILY_CODE = `import { cssVar } from "@/components/design-system/tokens";

<p style={{ fontFamily: cssVar("font-mono") }}>Model 01</p>`;

export const SCALE_CODE = `import { cssVar } from "@/components/design-system/tokens";

<span style={{ fontSize: cssVar("text-14") }}>Body S</span>`;

const ROLE = new Map(TYPE_ROLES.map((r) => [r.name, r]));

/** A role by name. Every row above names one, so a missing role is a data mistake worth failing on. */
export function roleOf(name: string): TypeRole {
  const r = ROLE.get(name);
  if (!r) throw new Error(`design-system type: no role ${name}`);
  return r;
}

const stepsOf = (r: TypeRole) => [r.size, ...(r.steps ?? []).map((s) => `${s.at} ${s.size}`)].join(" · ");

/** The drawer table for a group of rows: role, sizes by breakpoint, leading, tracking, weight, use, source. */
export function roleTable(rows: readonly RoleRow[]): string[][] {
  return rows.map(({ role }) => {
    const r = roleOf(role);
    return [r.name, stepsOf(r), r.leading, r.tracking, String(r.weight), r.useFor, r.source];
  });
}

export const ROLE_COLUMNS = ["Role", "Size by width", "Leading", "Tracking", "Weight", "Use for", "Source"];

export type Family = {
  token: string;
  name: string;
  /** the site's class for the family */
  cls: string;
  weights: readonly number[];
  /** loaded and never set */
  unused: readonly number[];
  assert: Assertion;
};

const LAYOUT = (...needles: string[]): Assertion => ({ file: "app/layout.tsx", needles });

export const FAMILY_CARDS: readonly Family[] = [
  { token: "font-display", name: "Outfit", cls: "font-display", weights: [400, 500, 600], unused: [],
    assert: LAYOUT("const outfit = Outfit({", 'weight: ["400", "500", "600"],\n  variable: "--font-outfit"') },
  { token: "font-sans", name: "Inter", cls: "font-sans", weights: [400, 500, 600], unused: [700],
    assert: LAYOUT("const inter = Inter({", 'weight: ["400", "500", "600", "700"],\n  variable: "--font-inter"') },
  { token: "font-mono", name: "JetBrains Mono", cls: "font-[family-name:var(--font-jbmono)]", weights: [400], unused: [500],
    assert: LAYOUT("const jbmono = JetBrains_Mono({", 'weight: ["400", "500"],\n  variable: "--font-jbmono"') },
];

export const FAMILY_VALUES = FAMILIES.map((t) => ({ part: t.role, token: `--ds-${t.name}`, value: t.value, source: t.source }));

const ON_SCALE = new Set(TYPE_SCALE.map((t) => t.value));

/** Per role, the sizes it sets that are not on the scale (off steps and clamps), read from the roles. */
export const OFF_SCALE = TYPE_ROLES.flatMap((r) => {
  const off = [{ at: "base", size: r.size }, ...(r.steps ?? [])].filter((s) => !ON_SCALE.has(s.size));
  if (off.length === 0) return [];
  const sizes = off.map((s) => (s.at === "base" ? s.size : `${s.size} at ${s.at}`)).join(", ");
  return [{ key: r.name, value: `${r.role}: ${sizes}`, source: r.source.split("/").pop() }];
});

export const SCALE_VALUES = TYPE_SCALE.map((t) => ({ part: t.useFor, token: `--ds-${t.name}`, value: t.value }));

/** The scale as numbers, for the ladder. */
export const SCALE_STEPS = TYPE_SCALE.map((t) => ({ name: t.name, px: parseFloat(t.value) }));

/** A role pinned where the frame renders it: its sizes by width, read from the role, and the line its
 *  specimen row is asserted on, which the pin's expect holds to its needle. */
function rolePin(role: string, selector: string, name: string): AnatomyPin & { expect: string } {
  const r = roleOf(role);
  const a = rowOf(role).assert;
  const value = [r.size, ...(r.steps ?? []).map((st) => `${st.size} at ${st.at}`)].join(", ");
  return { selector, name, token: `--ds-type-${r.name}-size`, value, source: check(a).at, expect: a.needles[0] };
}

/** The closing block in a frame at true widths: headline, subline and sign-in line. */
export const FRAME_PINS: readonly AnatomyPin[] = [
  rolePin("closing", "#get-access h2", "Closing headline"),
  rolePin("body-l", "#get-access h2 + p", "Subline"),
  rolePin("caption-l", "#get-access > p:last-of-type", "Sign-in line"),
];
