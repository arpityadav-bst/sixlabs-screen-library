// The card section's data: Anatomy pins, drawer values, props and snippets. Pins on shipped cards are
// measured inside their frames, so a site change that moves a part shows as a lost pin.
import { pr, sv, tv, type Pin } from "./display-values";

export const JOB_PINS: readonly Pin[] = [
  { selector: "article.sheen", name: "Card", token: "--ds-radius-lg", value: "radius 28, hairline, pt 28, px 24, pb 24", source: "Jobs.tsx:162", expect: ["rounded-[28px]", "border border-slate-200/80 bg-white"], padding: true },
  { selector: "article.sheen h3", name: "Title", value: "Outfit 20 / 500, -0.03em", source: "Jobs.tsx:164", expect: "font-display text-[20px] font-medium leading-tight tracking-[-0.03em]" },
  { selector: "article.sheen h3 + p", name: "Body", value: "Inter 14 / 1.4, #64748b, min-h 2.8em", source: "Jobs.tsx:167", expect: ["text-[14px] leading-[1.4]", "min-h-[2.8em]"] },
  { selector: "article.sheen > div", name: "Terminal slot", value: "mt 26", source: "Jobs.tsx:171", expect: 'className="mt-[26px]"' },
  { selector: "article.sheen ul", name: "Tag panel", token: "--ds-color-surface-sunken", value: "radius 12, #f6f7f9, px 16, py 14", source: "Jobs.tsx:184", padding: true },
  { selector: "article.sheen ul li", name: "Tag", value: "icon 17 at 1.6, gap 10, Inter 13 / 20", source: "Jobs.tsx:190,194,195", expect: ["flex items-center gap-2.5 font-sans text-[13px] leading-5", "h-[17px] w-[17px]", "strokeWidth={1.6}"] },
];

const PICKED = '.grid-cols-4 > button[aria-pressed="true"]';
export const SELECTOR_PINS: readonly Pin[] = [
  { selector: PICKED, name: "Selected card", token: "--ds-radius-lg", value: "radius 28, p 24, min-h 176, shadow 0 28 56 -26", source: "Players.tsx:220,222", expect: ["min-h-[176px]", "rounded-[28px] border p-6", "shadow-[0_28px_56px_-26px_rgba(10,27,51,0.45)]"], padding: true },
  { selector: '.grid-cols-4 > button[aria-pressed="false"]', name: "Unselected card", value: "opacity 0.6, shadow 0 24 48 -28", source: "Players.tsx:26,28", expect: ["shadow-[0_24px_48px_-28px_rgba(10,27,51,0.35)]", "const UNSELECTED = 0.6;"] },
  { selector: `${PICKED} > span > span`, name: "Title", value: "Outfit 22 / 500", source: "Players.tsx:230", expect: "text-[22px] max-lg:text-[18px] font-medium" },
  { selector: `${PICKED} > span:last-child`, name: "Footer", value: "mono 11 caps, 0.14em, pt 16 over a hairline", source: "Players.tsx:247", expect: "border-t pt-4 font-mono text-[11px] uppercase tracking-[0.14em]" },
  { selector: `${PICKED} > span:last-child > span:last-child > span`, name: "Running dot", value: "6px accent, pulse", source: "Players.tsx:263,264", expect: ["h-1.5 w-1.5 rounded-full", "bg-accent animate-pulse"] },
];

export const CARD_PINS: readonly Pin[] = [
  { selector: ".ds-a-card", name: "Surface", token: "--ds-radius-lg", value: "28, pt 28, px 24, pb 24", source: "card-styles.ts:12", expect: "rounded-(--ds-radius-lg) px-6 pb-6 pt-7", padding: true },
  { selector: ".ds-a-title", name: "Title", token: "--ds-type-card-title", value: "Outfit 20 / 500, -0.03em", source: "CardParts.tsx:24,31", expect: ["text-[20px] leading-tight tracking-[-0.03em]", "block font-display font-medium"] },
  { selector: ".ds-a-body", name: "Body", value: "Inter 14 / 1.4, muted", source: "CardParts.tsx:47", expect: "font-sans text-[14px] leading-[1.4]" },
  { selector: ".ds-a-meta > span", name: "Meta", token: "--ds-type-card-meta", value: "mono 11 caps over a hairline", source: "CardParts.tsx:68,69", expect: ["border-t pt-4 font-(family-name:--ds-font-mono)", "text-[11px] uppercase"] },
  { selector: "[data-card-check]", name: "Check", token: "--ds-color-primary", value: "20 circle, Check 12", source: "Card.tsx:83,85", expect: ["grid h-5 w-5 place-items-center rounded-full", "<Check size={12}"] },
];

const JOB = "Jobs.tsx";
const PL = "Players.tsx";

export const JOB_VALUES = [
  sv("Radius", "28, 24 under md", `${JOB}:162`, undefined, "rounded-[28px] max-md:rounded-[24px]"),
  sv("Line", "1px slate-200 at 80%", `${JOB}:162`, "--ds-color-line", "border border-slate-200/80 bg-white"),
  sv("Padding", "pt 28, px 24 (20 under md), pb 24", `${JOB}:162`, undefined, "px-6 pb-6 pt-7", "max-md:px-5"),
  sv("Swipe width", "min(100% - 20px, 560px) below xl", `${JOB}:162`, undefined, "max-xl:w-[min(calc(100%-20px),560px)]"),
  sv("Sheen stroke", "1.5px, radial 260px at the pointer", "globals.css:243", "--ds-stroke-sheen", "--sheen-w: 1.5px;", "radial-gradient(260px circle at var(--gx, 50%) var(--gy, 50%)"),
  // glow-sheen is a value only (never emitted), so the row carries no token chip: its one use is this filter
  sv("Sheen bloom", "drop-shadow 0 0 7px accent 50%, the value of glow-sheen", "globals.css:253", undefined, "filter: drop-shadow(0 0 7px rgba(26, 109, 255, 0.5));"),
  sv("Sheen fade", "opacity 0.4s ease on hover", "globals.css:260", "--ds-dur-sheen", "transition: opacity 0.4s ease;"),
  sv("Entrance", "y 28 to 0 over 0.7s, 0.1 + k x 0.12s", `${JOB}:147`, undefined, "initial={{ opacity: 0, y: 28 }}", "delay: 0.1 + k * 0.12"),
] as const;

export const SELECTOR_VALUES = [
  sv("Radius", "28 from lg, 22 below", `${PL}:220`, undefined, "rounded-[28px]", "max-lg:rounded-[22px]"),
  sv("Padding", "24 from lg, 16 below", `${PL}:220`, undefined, "border p-6", "max-lg:p-4"),
  sv("Rest shadow", "0 24px 48px -28px ink 35%", `${PL}:26`, "--ds-shadow-player", "shadow-[0_24px_48px_-28px_rgba(10,27,51,0.35)]"),
  sv("Selected shadow", "0 28px 56px -26px ink 45%", `${PL}:222`, "--ds-shadow-player-selected", "shadow-[0_28px_56px_-26px_rgba(10,27,51,0.45)]"),
  sv("Hover shadow", "lift, -2px", `${PL}:224`, "--ds-shadow-lift", "hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(10,27,51,0.05),0_24px_48px_-24px_rgba(10,27,51,0.22)]"),
  sv("Unselected opacity", "0.6, 0.85 on hover", `${PL}:28, 215`, undefined, "const UNSELECTED = 0.6;", "whileHover={{ opacity: on ? 1 : 0.85 }}"),
  sv("Footer", "mono 11 caps 0.14em, slate-400", `${PL}:247-248`, undefined, "font-mono text-[11px] uppercase tracking-[0.14em]", "border-slate-200/70 text-slate-400"),
] as const;

export const CARD_VALUES = [
  tv("Surface", "color-surface"),
  tv("Line", "color-line"),
  tv("Hover line", "color-line-strong"),
  tv("Container fill", "color-container"),
  tv("Inverse fill", "color-primary"),
  tv("Inverse hover", "color-primary-hover"),
  tv("Feature radius", "radius-lg"),
  tv("Phone radius", "radius-md"),
  tv("Row radius", "radius-row"),
  tv("Compact radius", "radius-md", "card-styles.ts:13", 'compact: "flex-col rounded-(--ds-radius-md) p-4"'),
  tv("Lift shadow", "shadow-lift"),
  tv("Lift travel", "lift-y"),
  tv("Pressed", "scale-press-card", "card.module.css:68-70", '.ds-card[data-interactive][data-force="pressed"] { scale: var(--ds-scale-press-card); }'),
  tv("Selected line", "color-primary"),
  tv("Check spring", "spring-thumb"),
  tv("Sheen stroke", "stroke-sheen"),
  tv("Sheen fade", "dur-sheen"),
  tv("Focus offset", "focus-offset-card"),
  tv("On blue shadow", "shadow-player"),
  tv("On blue selected", "shadow-player-selected"),
  sv("Disabled", "opacity 0.4, not-allowed", "card.module.css:96", undefined, ".ds-card[data-disabled] { opacity: 0.4; cursor: not-allowed; }"),
] as const;

export const CARD_PROPS = [
  pr("variant", '"static" | "clickable" | "selectable"', '"static"', "what it does"),
  pr("tone", '"surface" | "container" | "inverse" | "onBlue"', '"surface"', "where it sits"),
  pr("size", '"feature" | "compact" | "row"', '"feature"'),
  pr("as", '"article" | "button" | "a"', "from variant", "article, a with href, button"),
  pr("href", "string"),
  pr("onClick", "() => void"),
  pr("onToggle", "(next: boolean) => void", undefined, "selectable"),
  pr("selected", "boolean", "false", "aria-pressed on a selectable card"),
  pr("disabled", "boolean", "false"),
  pr("loading", "boolean", "false", "a skeleton composite, aria-busy"),
  pr("sheen", "boolean", "false", "pointer hover only"),
  pr("inset", "boolean", "false", "focus ring inside, for scroll rows"),
  pr("forceState", "ForceState"),
  pr("CardTitle as", '"h2" | "h3" | "h4" | "span"', "h3, span in a button"),
  pr("CardMeta", "start, end: ReactNode"),
] as const;

export const CARD_CODE = `import { Card } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";

<Card variant="selectable" selected={on} onToggle={setOn}>
  <CardTitle>The explorer</CardTitle>
  <CardBody>Maps every corner before the main path.</CardBody>
  <CardMeta start="Model 01" end="Ready" />
</Card>`;

export const CARD_SIZES = [
  { size: "feature", caption: "feature · radius 28 · pt 28 px 24 pb 24" },
  { size: "compact", caption: "compact · radius 24 · p 16" },
  { size: "row", caption: "row · radius 14 · px 16 py 12" },
] as const;
