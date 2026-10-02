// Icons: the ladder rows, the site's icons as shipped (each value read from its file:line) and the drawer
// rows. The ladder's strokes come from token-shape.ts through ICON_STROKE, never written twice, and the
// system's own file:lines are found in the source at build (foundation-scan's cite), so they follow the code,
// and each pin's expect is the text its line writes, which Coverage holds to that line.
// Server only: the client specimens read their icons from icons-set.ts.
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clapperboard,
  Eye,
  Footprints,
  Globe,
  Languages,
  Layers,
  Lightbulb,
  Menu,
  MousePointer2,
  Plug,
  ScanSearch,
  ShieldCheck,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { ICON_BOX, renderedStroke } from "@/components/design-system/Icon";
import { ICON_STROKE, type IconSize } from "@/components/design-system/tokens";
import { cite } from "./foundation-scan";
import { BUTTON_PAIRS, LADDER_SIZES } from "./icons-set";

const DS = "src/components/design-system";
const ICON = `${DS}/Icon.tsx`;
const FOOTER = "src/components/website/Footer.tsx";
const INLINE = cite(ICON, "align-[-0.125em]");
const BOXED = cite(ICON, "border border-(--ds-color-line) bg-(--ds-color-surface)");
const BOX = cite(ICON, "export const ICON_BOX");
/** The footer's Back to top writes its own 7px gap, the system pairs a 14 icon at the 6 step. */
const FOOTER_GAP = cite(FOOTER, "gap-[7px]").source;

export const LADDER_VALUES: readonly ValueRow[] = LADDER_SIZES.map((px) => ({
  part: `${px}`,
  token: `--ds-icon-${px}, --ds-icon-${px}-stroke`,
  value: `${px}px · strokeWidth ${ICON_STROKE[px]} · renders ${renderedStroke(px).toFixed(2)}px`,
  source: cite(`${DS}/token-shape.ts`, `[${px}, ${ICON_STROKE[px]}, "`).source,
}));

export const ICON_PROPS: readonly PropRow[] = [
  { name: "icon", type: "LucideIcon", note: "required" },
  { name: "size", type: "12 | 14 | 16 | 18 | 20 | 24", default: "16", note: "picks the stroke" },
  { name: "label", type: "string", note: "role img with this name, aria-hidden without it" },
  { name: "form", type: '"standalone" | "inline" | "boxed"', default: '"standalone"' },
  { name: "box", type: "32 | 40 | 48", default: "32 to 16, 40 at 18, 48 from 20", note: "boxed only" },
  { name: "className", type: "string" },
];

export const ICON_CODE = `import { Icon } from "@/components/design-system/Icon";
import { Waves } from "lucide-react";

<Icon icon={Waves} size={16} />
<Icon icon={Waves} size={16} label="Next wave" />
<Icon icon={Waves} size={14} form="inline" />
<Icon icon={Waves} size={18} form="boxed" />`;

export const FORM_PINS: readonly AnatomyPin[] = [
  { selector: "[data-pin='inline'] svg", name: "Inline glyph", token: "--ds-icon-14, --ds-icon-14-stroke",
    value: "14 · stroke 2 · shifted -0.125em", ...INLINE },
  { selector: "[data-pin='inline']", name: "Label", token: "--ds-space-1-5",
    value: `13.5px text · the system gap 6 outside the glyph, where ${FOOTER_GAP} ships 7`, ...cite(FOOTER, "gap-[7px]") },
  { selector: "[data-pin='boxed'] > span", name: "Box", token: "--ds-color-surface, --ds-color-line",
    value: "40 circle · 1px hairline", ...BOXED },
  { selector: "[data-pin='boxed'] svg", name: "Boxed glyph", token: "--ds-icon-18, --ds-icon-18-stroke", value: "18 · stroke 1.75",
    ...cite(ICON, "<Glyph aria-hidden size={size}") },
];

export const BOXED_SIZES: readonly IconSize[] = [16, 18, 20];
export const BOXED_RUNGS = BOXED_SIZES.map((px) => ({ px, box: ICON_BOX[px] }));

export const FORM_VALUES: readonly ValueRow[] = [
  { part: "Inline shift", value: "vertical-align -0.125em", source: INLINE.source },
  { part: "Box fill", token: "--ds-color-surface", value: "#ffffff", source: BOXED.source },
  { part: "Box line", token: "--ds-color-line", value: "1px oklch(92.9% 0.013 255.508 / 0.8)", source: BOXED.source },
  ...BOXED_RUNGS.map((r) => ({ part: `Box at ${r.px}`, value: `${r.box} circle`, source: BOX.source })),
];

/** Icon beside text: the size steps with the line it sits in, at the system gap. Labels are the site's own
 *  words, and `site` notes a shipped gap that differs from the system's. */
export const TEXT_PAIRS: readonly {
  size: IconSize; icon: LucideIcon; text: string; px: number; gap: number; from: string; site?: string;
}[] = [
  { size: 12, icon: Waves, text: "Next wave", px: 12, gap: 6, from: "HeroBits.tsx:111" },
  { size: 14, icon: ArrowUp, text: "Back to top", px: 13.5, gap: 6, from: FOOTER_GAP, site: "gap 7" },
  { size: 16, icon: Clapperboard, text: "Evidence clips", px: 15, gap: 8, from: "Jobs.tsx:36" },
];

export const PAIR_VALUES: readonly ValueRow[] = [
  ...TEXT_PAIRS.map((p) => ({
    part: `${p.size} with ${p.px}px text`,
    token: p.gap === 6 ? "--ds-space-1-5" : "--ds-space-2",
    value: p.site ? `${p.site} (${p.from}), the system ${p.gap}` : `gap ${p.gap}`,
    source: p.from,
  })),
  ...BUTTON_PAIRS.map((p) => ({ part: `IconButton ${p.size}`, value: `${p.box} box · icon ${p.size === "xl" ? 20 : 18}`,
    source: cite(`${DS}/icon-button-styles.ts`, `${p.size}: { box:`).source })),
];

export type ShippedTone = "ink" | "ink-70" | "muted" | "quiet" | "accent" | "white";
export type ShippedGround = "light" | "on-blue" | "terminal";

export type ShippedIcon = {
  where: string;
  icons: readonly LucideIcon[];
  size: number;
  stroke: number;
  source: string;
  tone: ShippedTone;
  ground: ShippedGround;
  /** the ladder step it moves to, or nothing when it is on scale */
  fix?: string;
};

export const SHIPPED: readonly ShippedIcon[] = [
  { where: "Wave button", icons: [Waves], size: 16, stroke: 1.75, source: "HeroBits.tsx:116", tone: "ink-70", ground: "light" },
  { where: "Scroll cue", icons: [ArrowDown], size: 16, stroke: 1.75, source: "ScrollCue.tsx:26", tone: "quiet", ground: "light" },
  { where: "Language trigger", icons: [Globe], size: 18, stroke: 2, source: "LanguageMenu.tsx:63", tone: "muted",
    ground: "light", fix: "18 / 1.75" },
  { where: "Chosen language", icons: [Check], size: 16, stroke: 2, source: "LanguageMenu.tsx:99", tone: "ink",
    ground: "light", fix: "16 / 1.75" },
  { where: "Menu button", icons: [Menu, X], size: 22, stroke: 1.75, source: "MobileMenu.tsx:56", tone: "ink",
    ground: "light", fix: "18 / 1.75 in its 40 box" },
  { where: "Menu rows", icons: [ArrowRight], size: 18, stroke: 1.75, source: "MobileMenu.tsx:94", tone: "quiet", ground: "light" },
  { where: "Footer Back to top", icons: [ArrowUp], size: 14, stroke: 2, source: "Footer.tsx:77", tone: "ink", ground: "light" },
  { where: "Floating Back to top", icons: [ArrowUp], size: 18, stroke: 1.75, source: "BackToTop.tsx:66", tone: "ink",
    ground: "light" },
  {
    where: "Job tags",
    icons: [Lightbulb, Clapperboard, Plug, CircleCheck, Footprints, Layers, Languages, ScanSearch, ShieldCheck, Eye],
    size: 17,
    stroke: 1.6,
    source: "Jobs.tsx:193",
    tone: "accent",
    ground: "light",
    fix: "16 / 1.75",
  },
  { where: "Player arrows", icons: [ChevronLeft, ChevronRight], size: 18, stroke: 2, source: "PlayerCarousel.tsx:138",
    tone: "white", ground: "on-blue", fix: "18 / 1.75" },
  { where: "Terminal hint", icons: [MousePointer2], size: 24, stroke: 1.5, source: "JobTerminal.tsx:156", tone: "white",
    ground: "terminal" },
];

export const TONE_VAR: Readonly<Record<ShippedTone, string>> = {
  ink: "var(--ds-color-ink)",
  "ink-70": "var(--ds-color-ink-70)",
  muted: "var(--ds-color-text-muted)",
  quiet: "var(--ds-color-text-quiet)",
  accent: "var(--ds-color-accent)",
  white: "#ffffff",
};

export const SHIPPED_VALUES: readonly ValueRow[] = SHIPPED.map((s) => ({
  part: s.where,
  value: `${s.size} / ${s.stroke} · ${s.fix ? `normalise to ${s.fix}` : "on scale"}`,
  source: s.source,
}));
