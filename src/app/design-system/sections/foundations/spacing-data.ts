// The spacing section's data: the rhythm gaps and component paddings, each transcribed from the site
// and asserted against the exact class text it came from. The scale itself is SPACING in tokens.
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import { SPACING } from "@/components/design-system/tokens";
import { site, type Assertion } from "./foundation-assert";
import { check } from "./foundation-scan";

/** The Tailwind step of a spacing token: "space-2-5" is step "2.5". */
export const stepOf = (name: string) => name.replace(/^space-/, "").replace("-", ".");

export const SPACE_VALUES = SPACING.map((t) => ({ part: t.useFor, token: `--ds-${t.name}`, value: t.value, source: t.utility }));

export const SPACE_CODE = `import { cssVar } from "@/components/design-system/tokens";

<div style={{ display: "grid", gap: cssVar("space-4"), padding: cssVar("space-6") }}>...</div>`;

export type Gap = { key: string; cls: string; value: string; assert: Assertion };

/** The container hero's copy, top to bottom: the gaps the ruler measures. */
export const RHYTHM_GAPS: readonly Gap[] = [
  { key: "Headline to lede", cls: "mt-5", value: "20", assert: site("Hero.tsx", "md:text-[15px] mt-5 max-w-[440px]") },
  { key: "Lede to call to action", cls: "mt-8 max-md:mt-6", value: "32, 24 under md", assert: site("Hero.tsx", '"mt-8 max-md:mt-6"') },
  { key: "Call to action to proof", cls: "mt-8 max-md:mt-6", value: "32, 24 under md",
    assert: site("Hero.tsx", "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr]") },
];

/** Rhythm the specimen does not show, from the other blocks. */
export const OTHER_GAPS: readonly Gap[] = [
  { key: "Section heading to subline", cls: "mt-4", value: "16", assert: site("Jobs.tsx", "mt-4 max-w-[520px]") },
  { key: "Closing line to button", cls: "mt-[34px]", value: "34, off the grid", assert: site("Closing.tsx", '<div className="mt-[34px]">') },
  { key: "Full-view lede", cls: "mt-[18px] min-[901px]:mt-[14px] min-[1600px]:mt-[22px]", value: "18, 14 from 901, 22 from 1600",
    assert: site("Hero.tsx", "mt-[18px] min-[901px]:mt-[14px] min-[1600px]:mt-[22px]") },
];

/** The proof line's own class text, asserted so the specimen is the site's. */
export const PROOF = {
  cls: "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr] items-center gap-x-2.5 font-sans text-[13px] leading-relaxed",
  assert: site("Hero.tsx", "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr] items-center gap-x-2.5 font-sans text-[13px] leading-relaxed"),
};

export const HERO_COPY = {
  lede: "Our model watched millions of hours of gameplay. Now it understands the game player.",
  proof: "One million players have a copy.",
  next: "Yours next.",
};

export type Pad = { part: string; padding: string; phone: string; assert: Assertion };

export const PADDINGS: readonly Pad[] = [
  { part: "Comparison card", padding: "28, 36 from md, 64 left on the 6labs card", phone: "28",
    assert: site("Understands.tsx", "border p-7 md:p-9", "md:pl-16") },
  { part: "Job card", padding: "28 top, 24 sides and foot", phone: "20 sides",
    assert: site("Jobs.tsx", "px-6 pb-6 pt-7", "max-md:px-5") },
  { part: "Player card", padding: "24", phone: "hidden below lg", assert: site("Players.tsx", "rounded-[28px] border p-6") },
  { part: "FAQ row", padding: "20 by 24", phone: "16 by 20",
    assert: site("Faq.tsx", "px-6 py-5 text-left max-md:gap-4 max-md:px-5 max-md:py-4") },
  { part: "FAQ answer", padding: "24 sides and foot", phone: "20", assert: site("Faq.tsx", "px-6 pb-6", "max-md:px-5 max-md:pb-5") },
  { part: "Mobile menu sheet", padding: "4 top, 16 sides, 24 foot, rows 16", phone: "the same",
    assert: site("MobileMenu.tsx", "px-4 pb-6 pt-1 md:hidden", "border-slate-100 py-4") },
  { part: "Terminal", padding: "16, bar 12 by 16", phone: "the same",
    assert: site("JobTerminal.tsx", "px-4 py-4 font-[family-name:var(--font-jbmono)]", "bg-[#111d31] px-4 py-3") },
  { part: "Tag panel", padding: "14 by 16", phone: "the same", assert: site("Jobs.tsx", "px-4 py-3.5") },
  { part: "Call to action", padding: "14 by 40, at least 220 wide", phone: "the same", assert: site("PrimaryCta.tsx", "min-w-[220px]", "px-10 py-3.5") },
  { part: "Sign in", padding: "8 by 20", phone: "6 by 14", assert: site("Header.tsx", "px-5 py-2 max-md:px-3.5 max-md:py-1.5") },
  { part: "Jobs tabs", padding: "6 by 14 in a 4 rail", phone: "12 sides under 380",
    assert: site("Jobs.tsx", "bg-white p-1 xl:hidden", "rounded-full px-3.5 py-1.5", "max-[380px]:px-3") },
  { part: "Language panel", padding: "6, rows 10 by 12", phone: "the same", assert: site("LanguageMenu.tsx", "w-48 p-1.5", "px-3 py-2.5") },
];

const padOf = (part: string) => {
  const p = PADDINGS.find((x) => x.part === part);
  if (!p) throw new Error(`design-system spacing: no padding row ${part}`);
  return p;
};

/** A padding pinned on its real part, its file:line and expect read off the row's assertion at build. */
function padPin(part: string, pin: Omit<AnatomyPin, "source" | "name">): AnatomyPin & { expect: string } {
  const a = padOf(part).assert;
  return { ...pin, name: part, source: check(a).at, expect: a.needles[0] };
}

/** The two paddings drawn on real parts. */
export const PAD_CTA: AnatomyPin = padPin("Call to action", {
  selector: "[data-ds-pad='cta'] button", token: "--ds-space-3-5, --ds-space-10", value: "14 by 40, at least 220 wide", padding: true,
});
export const PAD_FAQ: AnatomyPin = padPin("FAQ row", {
  selector: "#faq ul li button", token: "--ds-space-5, --ds-space-6", value: "20 by 24, 16 by 20 on phones", padding: true,
});
