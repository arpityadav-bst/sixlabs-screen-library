// The Text link section's data: the three shipped links and how they drift, anatomy pins, drawer rows. The
// specimen lines are quoted from the site and held to it (LINE_CHECKS), so a reworded line turns Coverage red.
import type { PropRow } from "@/app/design-system/_kit/SpecDrawer";
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import { HERO_LEDE, HERO_LEDE_SOURCE } from "@/app/design-system/_data/specimens";
import { FORCE_PROP } from "./act-sel-rows";
import { sv, tv, type CheckedRow, type Pin } from "./display-values";

export const LINK_TONES = ["inherit", "ink", "muted"] as const;
export const LINK_STATES = ["rest", "hover", "focus-visible", "pressed", "visited"] as const;

/** Specimen copy quoted from the site: the hero lede, the closing line and the footer's legal links. */
export const LINE_COPY = {
  lede: HERO_LEDE,
  ledeLink: "See what it does",
  closing: "Already have an account?",
  closingLink: "Sign in",
  legal: ["Terms of Use", "Privacy Policy"],
} as const;

/** The quoted copy held to the files it comes from, the lede by the guide's one copy in specimens.ts. */
export const LINE_CHECKS: readonly Assertion[] = [
  HERO_LEDE_SOURCE,
  site("Hero.tsx", LINE_COPY.ledeLink),
  site("Closing.tsx", LINE_COPY.closing, LINE_COPY.closingLink),
  site("Footer.tsx", ...LINE_COPY.legal.map((l) => `>${l}</a>`)),
];

export const DRIFT_COLUMNS = ["Link", "Offset", "Thickness", "Colour", "Hover", "Source"];

export const DRIFT_ROWS: readonly string[][] = [
  ["See what it does", "4px", "auto", "inherits #475569", "accent over 200ms", "Hero.tsx:212"],
  ["Sign in", "3px", "1px", "#0a1b33", "accent over 300ms", "Closing.tsx:38"],
  ["Terms of Use", "3px", "1px", "inherits #64748b", "accent over 300ms", "Footer.tsx:23"],
  ["TextLink", "3px under 15px, 4px from 15px", "1px", "tone: inherit, ink or muted", "accent over 300ms", "TextLink.tsx:20-23"],
];

export const LINK_PINS: readonly Pin[] = [
  { selector: "[data-pin=link] a", name: "Link", token: "--ds-color-line-strong", value: "underline, 1px, offset 4 at 15px", source: "TextLink.tsx:21-22", expect: ["underline decoration-1 decoration-(--ds-color-line-strong)", "underline-offset-[clamp(3px,1em_-_11px,4px)]"] },
  { selector: "[data-pin=arrow] a svg", name: "Arrow", token: "--ds-icon-14", value: "moves 2px on hover", source: "TextLink.tsx:63,69", expect: ["<ArrowRight", "group-hover:translate-x-0.5"] },
  { selector: "[data-pin=external] a svg", name: "External mark", token: "--ds-icon-14", value: "plus a hidden new-tab note", source: "TextLink.tsx:75-76", expect: ["<ArrowUpRight aria-hidden size={14}", "(opens in a new tab)"], side: "right" },
];

export const LINK_VALUES: readonly CheckedRow[] = [
  tv("Underline", "color-line-strong"),
  tv("Hover text and underline", "color-accent"),
  tv("Hover duration", "dur-line"),
  tv("Ease", "ease-out"),
  tv("Ink tone", "color-ink"),
  tv("Muted tone", "color-text-muted"),
  tv("Focus ring", "focus-color"),
  tv("Ring offset", "focus-offset"),
  sv("Offset", "clamp(3px, 1em - 11px, 4px): 3 under 15px, 4 from 15px", "TextLink.tsx:22", undefined, "underline-offset-[clamp(3px,1em_-_11px,4px)]"),
  sv("Thickness", "1px, 2px while pressed", "TextLink.tsx:21, 25", undefined, "underline decoration-1", "active:decoration-2"),
  tv("Ring radius", "radius-mark-xs", "TextLink.tsx:21", "group rounded-(--ds-radius-mark-xs)"),
  sv("Visited", "the same as rest", "TextLink.tsx:3", undefined, "Visited looks the"),
];

export const LINK_PROPS: readonly PropRow[] = [
  { name: "href", type: "string", note: "required, no href means it is not a link" },
  { name: "tone", type: "inherit | ink | muted", default: "inherit" },
  { name: "external", type: "boolean", default: "false", note: "new tab, rel noopener, ArrowUpRight 14" },
  { name: "arrow", type: "boolean", default: "false", note: "a trailing ArrowRight 14" },
  { name: "onClick", type: "(e) => void" },
  FORCE_PROP,
];

export const LINK_CODE = `import { TextLink } from "@/components/design-system/TextLink";

<p>Already have an account? <TextLink href="/sign-in" tone="ink">Sign in</TextLink></p>`;
