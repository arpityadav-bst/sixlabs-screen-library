// Data for the Hero pattern: the pins measured inside each frame, the bill of materials, the states and the
// drawer rows, each with the file:line it is read from (Hero.tsx unless named).
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PartId } from "@/app/design-system/frame/_parts";
import { pr } from "../components/display-values";
import { site } from "../foundations/foundation-assert";
import type { BomItem } from "./pattern-parts";
import { read } from "./pattern-values";

const W = "components/website/";
const HERO = "main > section";
const COPY = `${HERO} h1`;

const CONTAINER_PINS: readonly AnatomyPin[] = [
  { selector: HERO, name: "Container", token: "--ds-color-container", value: "max 1400 · 664 (720) · radius 48 (32)", source: "Hero.tsx:125", expect: "max-w-[1400px] mx-auto rounded-[48px]", side: "left" },
  { selector: `${HERO} > div:has(h1)`, name: "Copy layer", value: "px 24, 64 from md · pt 40, 64 from md", source: "Hero.tsx:170", expect: "px-6 md:px-16 pt-10 md:pt-16", padding: true, side: "left" },
  { selector: COPY, name: "Headline", token: "--ds-type-hero-size", value: "Outfit 34, 56 from md · 500 · 1.05", source: "Hero.tsx:187", expect: "\"text-[34px] md:text-[56px]\"", side: "left" },
  { selector: `${COPY} + p`, name: "Lede", token: "--ds-type-lede-size", value: "14, 15 from md · #475569 · max 440", source: "Hero.tsx:205", expect: "md:text-[15px] mt-5 max-w-[440px]", side: "left" },
  { selector: `${COPY} + p > a`, name: "Link", value: "See what it does · underline offset 4", source: "Hero.tsx:212", expect: "underline underline-offset-4", side: "right" },
  { selector: `${COPY} + p + div`, name: "Call to action", value: "Try now · mt 32 (24)", source: "Hero.tsx:228", expect: "\"mt-8 max-md:mt-6\"", side: "right" },
  { selector: `${COPY} + p + div + div`, name: "Social proof", value: "dot 8 · 13px · mt 32 (24)", source: "Hero.tsx:236", expect: "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr]", side: "right" },
  { selector: `${HERO} + div`, name: "Under-row", value: "grid 1fr auto 1fr · mt 40 (32)", source: "Hero.tsx:101", expect: "mt-10 max-md:mt-8", side: "left" },
  { selector: `${HERO} + div > div:first-child`, name: "Scroll cue", value: "from md · -ml 40", source: "Hero.tsx:102", expect: "-ml-10 max-md:hidden", side: "left" },
  { selector: `${HERO} + div > dl`, name: "Numbers", value: "centred · gap 56 (32)", source: "Hero.tsx:105", expect: "{numbers(false)}", side: "right" },
  { selector: `${HERO} + div > div:last-child`, name: "Wave, bare", value: "from md · icon 16", source: "Hero.tsx:108", expect: "flex justify-end max-md:hidden", side: "right" },
  { selector: `${HERO} > div:last-child`, name: "Wave, pill", value: "phones · bottom 20 right 20", source: "Hero.tsx:258", expect: "absolute bottom-5 right-5 z-20 md:hidden", side: "right" },
];

const FULL_PINS: readonly AnatomyPin[] = [
  { selector: HERO, name: "Floor box", token: "--ds-color-container", value: "100svh, min 640 · edge to edge", source: "Hero.tsx:124", expect: "h-svh min-h-[640px]", side: "left" },
  { selector: `${HERO} > div:has(h1)`, name: "Copy grid", token: "--ds-container-full", value: "max 1448 · px 24 (16)", source: "Hero.tsx:169", expect: "max-w-[1448px] px-6 max-md:px-4", padding: true, side: "left" },
  { selector: COPY, name: "Headline", token: "--ds-type-hero-full-size", value: "34 to 88 over seven steps", source: "Hero.tsx:18", expect: "min-[561px]:text-[36px]", side: "left" },
  { selector: `${COPY} + p`, name: "Lede", token: "--ds-type-lede-full-size", value: "16 to 22 · max 470 to 680", source: "Hero.tsx:20", expect: "min-[561px]:text-[16.5px]", side: "left" },
  { selector: `${COPY} + p + div`, name: "Numbers", value: "left-aligned in the copy · mt 24 (28)", source: "Hero.tsx:220", expect: "{numbers(true)}", side: "right" },
  { selector: `${COPY} + p + div + div`, name: "Call to action", value: "Try now · mt 24 (28)", source: "Hero.tsx:228", expect: "\"mt-6 min-[1600px]:mt-7\"", side: "right" },
  { selector: `${HERO} > div:nth-last-child(2)`, name: "Scroll cue", value: "from lg · bottom clamp(96px, 16vh, 168px)", source: "Hero.tsx:269", expect: "bottom-[clamp(96px,16vh,168px)]", side: "left" },
  { selector: `${HERO} > div:last-child`, name: "Wave, pill", value: "bottom 32 right 32 (20)", source: "Hero.tsx:282", expect: "absolute bottom-8 right-8", side: "right" },
];

export type HeroVariant = "container" | "full";

export const HERO_VARIANTS: Readonly<Record<HeroVariant, { label: string; part: PartId; title: string; pins: readonly AnatomyPin[] }>> = {
  container: { label: "Container, /website", part: "hero-container", title: "Container hero", pins: CONTAINER_PINS },
  full: { label: "Full, /6labs-fullview", part: "hero-full", title: "Full hero", pins: FULL_PINS },
};

export const HERO_WIDTHS = [375, 768, 1280, 1440, 1920] as const;

export const HERO_BOM: readonly BomItem[] = [
  { part: "TileFloor", job: "the glass floor behind the copy, in WebGL", at: "tile-floor" },
  { part: "FloorLogo", job: "the container's mark on the grey until the floor is ready", at: "floor-lifecycle" },
  { part: "HeroLoader", job: "the full view's loader, the mark's arcs taking turns", at: "floor-lifecycle" },
  { part: "TypedWord", job: "models, typed in behind the caret", at: "stats-typed" },
  { part: "PrimaryCta", job: "Try now, the one solid primary on the screen", at: "button" },
  { part: "HeroNumbers", job: "2B and the live count of copies", at: "stats-typed" },
  { part: "WaveButton", job: "the next wave, bare under the container, a pill in a corner", at: "icon-button" },
  { part: "ScrollCue", job: "the hint to scroll, under the container or low in the full view", at: "back-to-top" },
  {
    part: "live dot",
    job: "the social proof line's dot, written inline in Hero.tsx:237 as two animate-ping spans",
    at: "badge-tag",
    note: "StatusDot is the system part that draws the same live dot",
  },
  { part: "Header", job: "default over the container, clear over the full view", at: "header" },
];

export const HERO_STATES: readonly KeyRow[] = [
  { key: "container, loading", value: "FloorLogo turns on the grey until the floor is ready. The copy is in from the first paint", source: "Hero.tsx:159" },
  { key: "container, ready", value: "tiles wait 0.5s and rise over 0.9s, the numbers follow at 1.2s, the cue and the wave at 1.8s", source: "hero-intro.ts:18" },
  { key: "full, held", value: "only the grey and HeroLoader, the page held at its top, the header hidden", source: "hero-intro.ts:36" },
  { key: "full, ready", value: "copy at 0.35s, floor at 1.7s, tiles at 1.85s, cue and wave at 3.45s", source: "hero-intro.ts:17" },
  { key: "no WebGL", value: "the full view lets go after 12s and shows the copy on bare grey. Neither variant says why", source: "hero-intro.ts:19" },
  { key: "phone", value: "the floor's view lowers until its highest tile sits under the copy's last line", source: "Hero.tsx:50" },
];

const H = `${W}Hero.tsx`;

export const HERO_VALUES = [
  read("Container box", "max 1400 · 664 tall, 720 under md · radius 48, 32 under md", `${H}:125`, "--ds-radius-2xl", "max-w-[1400px] mx-auto rounded-[48px]", "h-[664px] max-md:h-[720px] max-md:rounded-[32px]"),
  read("Container ground", "#f5f6f8 · slate-200 at 50% · 0 40px 100px -20px rgb(0 0 0 / 0.03)", `${H}:122,125`, "--ds-shadow-container", "bg-[#f5f6f8]", "border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)]"),
  read("Full box", "100svh, min 640 · -mx 16 (32) · -mt 96 · ink 8% hairline foot", `${H}:124`, undefined, "-mx-4 md:-mx-8 -mt-24 h-svh min-h-[640px] border-b border-[#0a1b33]/[0.08]"),
  read("Container copy", "px 24, 64 from md · pt 40, 64 from md · pb 40, 48 from md", `${H}:170`, undefined, '"px-6 md:px-16 pt-10 md:pt-16"', "pb-10 md:pb-12"),
  read("Full copy", "max 1448 · px 24 (16) · pt calc(73px + 40px), calc(89px + clamp(48px, 9vh, 120px)) from md", `${H}:169`, "--ds-container-full", "max-w-[1448px] px-6 max-md:px-4 pt-[calc(73px+40px)] md:pt-[calc(89px+clamp(48px,9vh,120px))]"),
  read("Container title", "Outfit 34, 56 from md · 500 · 1.05 · tracking tight", `${H}:187`, "--ds-type-hero-size", '"font-display font-medium tracking-tight leading-[1.05] text-[#0a1b33] "', '"text-[34px] md:text-[56px]"'),
  read("Full title", "34 / 36 / 42 / 54 / 64 / 76 / 88 · 48 on a short screen", `${H}:18`, "--ds-type-hero-full-size", "text-[34px] min-[561px]:text-[36px] min-[901px]:text-[42px] min-[1280px]:text-[54px] min-[1600px]:text-[64px] min-[1920px]:text-[76px] min-[2560px]:text-[88px]", "max-height:720px)]:text-[48px]!"),
  read("Container lede", "14, 15 from md · relaxed · mt 20 · max 440", `${H}:205`, "--ds-measure-lede", '"text-[14px] md:text-[15px] mt-5 max-w-[440px] leading-relaxed"'),
  read("Full lede", "16 to 22 · 1.55 · -0.015em · max 470 to 680", `${H}:20`, undefined, '"text-[16px] min-[561px]', "min-[2560px]:text-[22px] leading-[1.55] tracking-[-0.015em]"),
  read("Lede link", "underline offset 4 · slate-300 · accent on hover over 200ms", `${H}:212`, undefined, "underline underline-offset-4 decoration-slate-300 hover:text-accent hover:decoration-accent transition-colors duration-200"),
  read("Call to action", "mt 32 (24) · full mt 24, 28 from 1600", `${H}:228`, undefined, '(full ? "mt-6 min-[1600px]:mt-7" : "mt-8 max-md:mt-6")'),
  read("Social proof", "grid 8px 1fr · gap 10 · 13px · mt 32 (24)", `${H}:236`, undefined, "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr] items-center gap-x-2.5 font-sans text-[13px]"),
  read("Under-row", "max 1400 · mt 40 (32) · px 64 from md · grid 1fr auto 1fr", `${H}:101`, undefined, "max-w-[1400px] mx-auto mt-10 max-md:mt-8", "md:px-16 grid grid-cols-[1fr_auto_1fr]"),
  read("Floor", "introDelay 0.5, 1.85 full · distScale 1.5 full from 1024", `${H}:139`, undefined, "introDelay={full ? FULL_TILES_AT : 0.5}", '"(min-width: 1024px)"', "? 1.5"),
  read("Phone clearance", "CLEAR -12, through setClearTop", `${H}:26`, undefined, "const CLEAR = -12;", "setClearTop("),
  read("Copies", "start at 1,009,271, one more per conversion", `${H}:24`, undefined, "const COPIES_BASE = 1_009_271;", "setCopies((c) => c + 1)"),
] as const;

export const HERO_PROPS = [pr("full", "boolean", "false", "the 6labs-fullview variant, under <Header clear />")];

export const HERO_CODE = `import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";

// /website: the rounded container
<Header />
<Hero />

// /6labs-fullview: the floor edge to edge under the clear header
<Header clear />
<Hero full />`;

/** The link that ends the lede, as the site words it (Hero.tsx:214). */
export const HERO_LINK = { text: "See what it does", held: site("Hero.tsx", "See what it does") } as const;

/** The headline, quoted from Hero.tsx:190-198, for the Do / Don't pair. */
export const HEADLINE = { before: "Making", word: "models", after: "of", line2: "human players." } as const;
export const HEADLINE_HELD = site("Hero.tsx", `${HEADLINE.before}{" "}`, `word="${HEADLINE.word}"`, HEADLINE.line2);
