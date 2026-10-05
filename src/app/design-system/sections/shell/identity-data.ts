// Values for the identity section: pins, sizes and drawer rows, each with the file:line it is read from.
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { Pin } from "@/app/design-system/sections/components/display-values";
import { LOCKUP_SIZES, type LockupSize } from "@/components/design-system/Lockup";

/** The header's own lockup, measured inside the header-rest frame. */
export const SHIPPED_LOCKUP_PINS: readonly Pin[] = [
  { selector: "#site-head > div > a", name: "Lockup link", value: "gap 10 · no hover", source: "Header.tsx:64", expect: "gap-2.5", side: "left" },
  { selector: "#site-head > div > a > img", name: "Mark", value: "32 × 32 · the logo file", source: "Header.tsx:67,71", expect: ["/brand/sixlabs-mark.svg", "w-8 h-8"], side: "left" },
  { selector: "#site-head > div > a > span", name: "Wordmark", token: "--ds-color-ink", value: "Outfit 24/32 · 500 · tracking -0.025em", source: "Header.tsx:73", expect: "font-display text-2xl font-medium tracking-tight text-[#0a1b33]", side: "right" },
  { selector: "#site-head > div > a > span > span", name: "Accent 6", token: "--ds-color-accent", value: "#1a6dff", source: "Header.tsx:74", expect: "text-accent", side: "right" },
];

/** The system Lockup at lg, measured in place. Each pin's expect is held to its cited line at build. */
export const LOCKUP_PINS: readonly Pin[] = [
  { selector: "[data-lockup]", name: "Lockup", value: "gap 12 at lg · 8 sm · 10 md", source: "Lockup.tsx:18-20,26", expect: "gap-3", side: "left" },
  { selector: "[data-lockup-mark]", name: "Mark", value: "44 at lg", source: "Lockup.tsx:20,26", expect: "h-11 w-11", side: "left" },
  { selector: "[data-lockup-word]", name: "Wordmark", token: "--ds-font-display", value: "Outfit 32/44 · 500", source: "Lockup.tsx:26,59", expect: "text-[32px] leading-[44px]", side: "right" },
  { selector: "[data-lockup-word] > span", name: "Accent 6", token: "--ds-color-accent", value: "the real Word", source: "CopyLine.tsx:52", expect: "text-accent", side: "right" },
];

export const LOCKUP_LADDER: readonly { name: LockupSize; spec: number }[] = (["sm", "md", "lg"] as const).map((name) => ({
  name,
  spec: LOCKUP_SIZES[name].mark,
}));

export const LOCKUP_VALUES: readonly ValueRow[] = [
  { part: "Mark", value: "24 / 32 / 44 (sm / md / lg)", source: "Lockup.tsx:18-20" },
  { part: "Wordmark", token: "--ds-font-display", value: "Outfit 500 · 18/24, 24/32, 32/44 · tracking -0.025em", source: "Lockup.tsx:24-26,59" },
  { part: "Gap", value: "8 / 10 / 12", source: "Lockup.tsx:18-20,24-26" },
  { part: "Clear space", value: "the core circle's diameter, 0.292 of the mark: 7 / 9 / 13", source: "brand-marks.tsx:85" },
  { part: "Minimum mark", value: "20", source: "Lockup.tsx:24" },
  { part: "Ink wordmark", token: "--ds-color-ink", value: "#0a1b33", source: "Header.tsx:73" },
  { part: "Accent 6", token: "--ds-color-accent", value: "#1a6dff", source: "CopyLine.tsx:52" },
  { part: "Logo blades", token: "--ds-color-logo-blue", value: "#1770EF", source: "brand-marks.tsx:86" },
  { part: "Logo core", token: "--ds-color-logo-navy", value: "#030D2D", source: "brand-marks.tsx:85" },
  { part: "onBlue", value: "SixLabsMark outline and the plain Word, both white", source: "Lockup.tsx:60" },
  { part: "Focus ring", token: "--ds-focus-color", value: "2px at 2px offset, white on blue", source: "focus.ts:8" },
];

export const LOCKUP_PROPS: readonly PropRow[] = [
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', note: "md is the header's" },
  { name: "tone", type: '"ink" | "onBlue"', default: '"ink"', note: "onBlue only on the accent water" },
  { name: "suffix", type: "string", note: '".ai" in the footer' },
  { name: "href", type: "string", note: "a link home, with the focus ring" },
  { name: "forceState", type: "ForceState", note: "rest or focus-visible for a StateGrid cell" },
  { name: "className", type: "string" },
];

export const LOCKUP_CODE = `import { Lockup } from "@/components/design-system/Lockup";

<Lockup href="/" />
<Lockup size="sm" tone="onBlue" suffix=".ai" />`;

export const WORD_VALUES: readonly ValueRow[] = [
  { part: "Word", token: "--ds-color-accent", value: "the 6 in the accent, labs in the inherited colour", source: "CopyLine.tsx:50" },
  { part: "Word plain", value: "no accent, for the colour-split copies and white use", source: "CopyLine.tsx:52" },
  { part: "Header", value: "inlines its own spans in place of Word", source: "Header.tsx:74" },
  { part: "Footer", value: "Word plus .ai", source: "Footer.tsx:44" },
];

export const WORD_PROPS: readonly PropRow[] = [{ name: "plain", type: "boolean", default: "false" }];

export const LOGO_VALUES: readonly ValueRow[] = [
  { part: "viewBox", value: "18 12.99 95.04 105.54", source: "brand-marks.tsx:73" },
  { part: "Core circle", token: "--ds-color-logo-navy", value: "r 15.41 · #030D2D", source: "brand-marks.tsx:85" },
  { part: "Blades", token: "--ds-color-logo-blue", value: "three paths · #1770EF", source: "brand-marks.tsx:86" },
  { part: "fade", value: "solid to 60%, then a smoothstep to 0 at the foot, in SVG gradients", source: "brand-marks.tsx:68" },
];

export const LOGO_PROPS: readonly PropRow[] = [
  { name: "className", type: "string", note: "sets the size" },
  { name: "fade", type: "boolean", default: "false", note: "the footer's crest" },
];

export const MARKS_VALUES: readonly ValueRow[] = [
  { part: "SixLabsMark viewBox", value: "14.5 9.5 102 112.5", source: "brand-marks.tsx:33" },
  { part: "Line", value: "5.5 viewBox units, so 0.8px at 16 and 3.1px at 64", source: "brand-marks.tsx:27" },
  { part: "Ring", value: "r 14.75, the core grown by half a line", source: "brand-marks.tsx:51" },
  { part: "ChatGptMark", value: "viewBox 0 0 24 24 · filled in currentColor · Simple Icons", source: "brand-marks.tsx:8" },
  { part: "On the cards", value: "36 on phones and 44 from md, beside the comparison cards' names, the only place they ship", source: "Understands.tsx:69,76" },
];

/** The ladder's rungs: the two shipped sizes (the comparison cards) between a small and a large one. */
export const MARKS_LADDER = [
  { px: 16, name: "16" },
  { px: 36, name: "comparison card, phone" },
  { px: 44, name: "comparison card, from md" },
  { px: 64, name: "64" },
] as const;

export const MARKS_CODE = `import { ChatGptMark, SixLabsMark } from "@/components/website/brand-marks";

// the comparison cards' size: 36 on phones, 44 from md
<SixLabsMark className="h-9 w-9 md:h-11 md:w-11" />
<ChatGptMark className="h-9 w-9 md:h-11 md:w-11" />`;
