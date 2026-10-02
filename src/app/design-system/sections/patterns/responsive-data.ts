// Data for Responsive: what changes at each width, the full hero's type steps, and the height,
// pointer and safe-area rules. Every transcribed value carries the exact source text it was copied from,
// so the chip beside it turns red when the site moves.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { site, type Assertion } from "../foundations/foundation-assert";

export type Step = { readonly width: string; readonly at: string; readonly changes: string; readonly a: Assertion };

/** The full hero's own sizes live in TYPE_LADDER, so a step that only moves them points there. */
const TYPE_STEP = "the full hero's next type step, see below";

export const LADDER: readonly Step[] = [
  {
    width: "0",
    at: "base",
    changes: "burger menu, Sign in at 13 · footer in two columns · jobs as a swipe row with a switch · players as one view · container hero 34, 720 tall, radius 32",
    a: site("Header.tsx", "max-md:text-[13px]"),
  },
  { width: "561", at: "min-[561px]", changes: TYPE_STEP, a: site("Hero.tsx", "min-[561px]:text-[36px]") },
  {
    width: "768",
    at: "md",
    changes: "tabs and language in the bar, the burger goes · footer in three columns · the copy line picture draws · page gutter 32 · container hero 56, 664 tall, radius 48",
    a: site("Header.tsx", "hidden md:flex items-center gap-8"),
  },
  { width: "901", at: "min-[901px]", changes: TYPE_STEP, a: site("Hero.tsx", "min-[901px]:text-[42px]") },
  {
    width: "1024",
    at: "lg",
    changes: "players in two columns with four cards · the full hero's scroll cue · the copy line labels · the full floor pulls back to distScale 1.5",
    a: site("Players.tsx", "lg:grid-cols-[minmax(0,480px)_1fr]"),
  },
  { width: "1280", at: "xl", changes: `jobs three across and the switch hides · ${TYPE_STEP}`, a: site("Jobs.tsx", "xl:grid-cols-3") },
  { width: "1600", at: "min-[1600px]", changes: `the floating tiles take their wide places · ${TYPE_STEP}`, a: site("Hero.tsx", "min-[1600px]:text-[64px]") },
  { width: "1920", at: "min-[1920px]", changes: TYPE_STEP, a: site("Hero.tsx", "min-[1920px]:text-[76px]") },
  { width: "2560", at: "min-[2560px]", changes: TYPE_STEP, a: site("Hero.tsx", "min-[2560px]:text-[88px]") },
];

export type TypeStep = {
  readonly from: string;
  readonly title: string;
  readonly lede: string;
  readonly measure: string;
  readonly a: Assertion;
};

/** The full hero's type steps, Hero.tsx:17-20, each asserted on its title, lede and measure classes. */
export const TYPE_LADDER: readonly TypeStep[] = [
  { from: "base", title: "34", lede: "16", measure: "470", a: site("Hero.tsx", "text-[34px] min-[561px]", "text-[16px] min-[561px]", "max-w-[470px]") },
  { from: "561", title: "36", lede: "16.5", measure: "470", a: site("Hero.tsx", "min-[561px]:text-[36px]", "min-[561px]:text-[16.5px]") },
  { from: "901", title: "42", lede: "15", measure: "440", a: site("Hero.tsx", "min-[901px]:text-[42px]", "min-[901px]:text-[15px]", "min-[901px]:max-w-[440px]") },
  { from: "1280", title: "54", lede: "16", measure: "440", a: site("Hero.tsx", "min-[1280px]:text-[54px]", "min-[1280px]:text-[16px]") },
  { from: "1600", title: "64", lede: "18", measure: "540", a: site("Hero.tsx", "min-[1600px]:text-[64px]", "min-[1600px]:text-[18px]", "min-[1600px]:max-w-[540px]") },
  { from: "1920", title: "76", lede: "20", measure: "620", a: site("Hero.tsx", "min-[1920px]:text-[76px]", "min-[1920px]:text-[20px]", "min-[1920px]:max-w-[620px]") },
  { from: "2560", title: "88", lede: "22", measure: "680", a: site("Hero.tsx", "min-[2560px]:text-[88px]", "min-[2560px]:text-[22px]", "min-[2560px]:max-w-[680px]") },
  { from: "short", title: "48", lede: "as its width", measure: "as its width", a: site("Hero.tsx", "[@media(min-width:1280px)_and_(max-height:720px)]:text-[48px]!") },
];

export const MEDIA_ROWS: readonly KeyRow[] = [
  { key: "short screen", value: "(min-width: 1280px) and (max-height: 720px) caps the full title at 48, so the copy, numbers and cue still fit", source: "Hero.tsx:18" },
  { key: "svh", value: "the full hero and the portrait size from 100svh, so a phone's moving toolbar never crops them", source: "Hero.tsx:124" },
  { key: "hover", value: "(hover: hover) gates the glyph field's pointer pool and the floating tiles' drift, so touch gets the still forms", source: "AsciiBackdrop.tsx:27" },
  { key: "fine pointer", value: "(hover: hover) and (pointer: fine) gates the liquid over the line and desktop Safari's smooth scroll", source: "LiquidLine.tsx:18" },
  { key: "safe area", value: "the footer's legal row pads env(safe-area-inset-bottom), so the home bar never covers it", source: "Footer.tsx:85" },
  { key: "768 to 900", value: "the header's tabs, language and Sign in share the bar at their narrowest, so a new tab goes in the menu", source: "Header.tsx:78" },
];

const COPY = "main > section:first-of-type";

export const FULL_PINS: readonly AnatomyPin[] = [
  { selector: "#site-head", name: "Header", value: "the burger under md, the tabs from md", source: "Header.tsx:78", expect: "hidden md:flex items-center gap-8", side: "left" },
  { selector: `${COPY} h1`, name: "Title", token: "--ds-type-hero-full-size", value: "the ladder step for this width", source: "Hero.tsx:18", expect: "min-[2560px]:text-[88px]", side: "left" },
  { selector: `${COPY} h1 + p`, name: "Lede", token: "--ds-type-lede-full-size", value: "size and measure step together", source: "Hero.tsx:20", expect: "min-[2560px]:text-[22px]", side: "left" },
  { selector: `${COPY} > div:nth-last-child(2)`, name: "Scroll cue", value: "from lg only", source: "Hero.tsx:269", expect: "max-lg:hidden", side: "right" },
];

export const FULL_WIDTHS = [375, 561, 768, 901, 1280, 1600, 1920] as const;
