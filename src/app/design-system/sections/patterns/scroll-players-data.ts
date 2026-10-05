// Data for Scroll line to players: the pins measured inside the players frame at each width, the bill of
// materials, how the section comes in, and the drawer rows (Players.tsx unless named).
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { Assertion } from "../foundations/foundation-assert";
import { tv } from "../components/display-values";
import type { BomItem } from "./pattern-parts";
import { read } from "./pattern-values";

const W = "components/website/";
const INNER = "#players > div";
const LEFT = "#players div:has(> div > h3)";

export const PLAYERS_PINS: readonly AnatomyPin[] = [
  { selector: "#players", name: "Section", value: "max 1400 · -mt 100vh · min-h-screen · pt 96 (72, 88)", source: "Players.tsx:103", expect: "-mt-[100vh] flex min-h-screen", side: "left" },
  { selector: `${INNER} > div[aria-hidden]`, name: "Glow", token: "--ds-color-accent-glow-28", value: "620 × 520 · 380 × 360 below lg", source: "Players.tsx:111", expect: "h-[520px] w-[620px]", side: "right" },
  { selector: "#players h3", name: "Title", token: "--ds-type-hero-size", value: "Outfit 34, 56 from md · white", source: "Players.tsx:124", expect: "text-[34px] md:text-[56px]", side: "left" },
  { selector: "#players h3 + p", name: "Body", token: "--ds-measure-body", value: "16, 18 from md · white 80% · max 480", source: "Players.tsx:127", expect: "max-w-[480px]", side: "left" },
  { selector: `${LEFT} > :nth-child(2)`, name: "Traits", value: "mt 40 · from lg", source: "Players.tsx:134", expect: "mt-10 max-lg:hidden", side: "left" },
  { selector: `${LEFT} > :nth-child(3)`, name: "Switch", value: "mt 40 · default 112 options", source: "Players.tsx:136", expect: "mt-10 max-lg:mt-5", side: "left" },
  { selector: `${INNER} > div:nth-of-type(2) > div:nth-child(2)`, name: "Portrait", value: "--ph tall · runs 24.4% under the cards", source: "Players.tsx:143", expect: "lg:mb-[calc(var(--ph)*-0.244)]", side: "right" },
  { selector: `${INNER} > div:nth-of-type(3)`, name: "Selector cards", value: "4 columns · gap 16 · mt 32 · from lg", source: "Players.tsx:207", expect: "grid grid-cols-4 gap-4 max-lg:hidden", side: "right" },
  { selector: 'button[aria-label="Previous player"]', name: "Arrows", value: "36 · below lg", source: "PlayerCarousel.tsx:16", expect: "grid h-9 w-9", side: "left" },
  { selector: `${INNER} > div:nth-of-type(2) > div:nth-child(3)`, name: "Slim switch", value: "96 options · rides up 20% of --ph", source: "Players.tsx:193", expect: "-mt-[calc(var(--ph)*0.2)]", side: "right" },
  { selector: `${INNER} > div:nth-of-type(4)`, name: "Carousel", value: "mt calc(66px - 20% of --ph) · below lg", source: "Players.tsx:277", expect: "mt-[calc(66px-var(--ph)*0.2)] lg:hidden", side: "right" },
];

export const PLAYERS_WIDTHS = [375, 1024, 1440] as const;

export const PLAYERS_BOM: readonly BomItem[] = [
  { part: "AccentWave", job: "the water the section stands on, the page's one accent fill", at: "accent-water" },
  { part: "ModeToggle", job: "the human or the AI copy, in the side column, slim on the portrait below lg", at: "segmented" },
  { part: "PlayerTraits", job: "the trait bars, dense in the carousel", at: "progress" },
  { part: "PortraitSwap", job: "the portrait and the sweep to its AI copy", at: "portrait-sweep" },
  { part: "PlayerDoodles", job: "the hand drawing behind the portrait, retraced by the copy", at: "doodles" },
  { part: "selector card", job: "the four models on file along the bottom, from lg", at: "card" },
  { part: "PlayerCarousel", job: "name, line and traits as slides below lg", at: "carousel" },
  { part: "PlayerArrows", job: "previous and next beside the portrait below lg", at: "carousel" },
];

/** A behaviour row held to the text it was read off (through read, so a slip throws), which Coverage
 *  collects, so the row turns red the day the site stops writing it. */
const held = (key: string, value: string, source: string, ...needles: string[]): KeyRow & { readonly assert: Assertion } => ({
  key,
  value,
  source,
  assert: read(key, value, `${W}${source}`, undefined, ...needles).assert,
});

export const PLAYERS_FLOW: readonly KeyRow[] = [
  { key: "overlap", value: "pulled up a screen over the scroll line's last view, so it is in place the moment the water fills it", source: "Players.tsx:103" },
  { key: "reveal", value: "the accentwave event says filled, and 20% of the section is in view. Once in, it stays", source: "Players.tsx:56" },
  { key: "entrance", value: "cards at 0.05s apart, the portrait at 0.1s, the slim switch at 0.15s, the column and carousel at 0.2s", source: "Players.tsx:85" },
  { key: "layout", value: "from lg the side column and four cards, below it one view: portrait, slim switch, carousel", source: "Players.tsx:114" },
  { key: "--ph", value: "min(720px, (100svh - 344px) / 0.756), and clamp(240px, ..., 520px) below lg", source: "Players.tsx:36" },
  held("wide", "past 1920 on screens of dpr 1.5 and up, the content scales by min(1.35, width / 1920, (view height - 136) / its height), never under 1. A transform, so the layout is untouched", "usePlayersScale.ts:12-15", "const BASE = 1920;", "const MAX = 1.35;", "const CLEAR = 96 + 40;", "const DENSE = 1.5;"),
  held("auto", "Human / AI swaps every 5s while the section is shown, until the visitor picks", "usePlayerMode.ts:11", "const AUTO_S = 5;"),
  { key: "clips", value: "start loading within two screens of the section, the other players' prefetched", source: "Players.tsx:67" },
  held("snap", "#players is the page's one magnet: CSS scroll snap (proximity), which catches only a scroll that ends near. In desktop Safari, where the snap is off, a scroll resting 120ms within 0.3 of a screen glides in over 0.6s on Lenis", "SafariScroll.tsx:15-17", "const MAGNET = 0.3;", "const MAGNET_S = 0.6;", "const REST_MS = 120;"),
];

export const PLAYERS_VALUES = [
  tv("Ground", "color-accent"),
  read("Section box", "max 1400 · pt 96, 72 on phones, 88 md to lg · pb 40, 12 below lg", `${W}Players.tsx:103`, "--ds-container", "max-w-[1400px] mx-auto -mt-[100vh]", "pt-24 pb-10 max-md:pt-[72px] md:max-lg:pt-[88px] max-lg:pb-3"),
  read("Inner gutter", "px 20, 64 from md", `${W}Players.tsx:107`, undefined, 'className="relative px-5 md:px-16"'),
  read("Glow", "radial accent 28% to 8% at 55% · 620 × 520, 380 × 360 below lg", `${W}Players.tsx:111`, "--ds-color-accent-glow-28", "h-[520px] w-[620px]", "max-lg:h-[360px] max-lg:w-[380px]", "rgba(26,109,255,0.28),rgba(26,109,255,0.08)_55%"),
  read("Grid", "minmax(0, 480px) 1fr from lg · gap 32, 16 below lg", `${W}Players.tsx:114`, undefined, "gap-8 max-lg:gap-4 lg:grid-cols-[minmax(0,480px)_1fr]"),
  read("Title", "Outfit 34, 56 from md · 500 · 1.05 · white", `${W}Players.tsx:124`, undefined, "font-display text-[34px] md:text-[56px] font-medium leading-[1.05] tracking-tight text-white"),
  read("Body", "16, 18 from md · relaxed · white 80% · max 480", `${W}Players.tsx:127`, "--ds-color-on-blue-80", "max-w-[480px] text-balance font-sans text-[16px] md:text-[18px] leading-relaxed text-white/80"),
  read("Traits and switch", "mt 40 each", `${W}Players.tsx:134`, undefined, 'className="mt-10 max-lg:hidden"'),
  read("Portrait height", "--ph, the cards cover its bottom 24.4%", `${W}Players.tsx:34`, undefined, "const PORTRAIT_UNDER = 0.244;", '"--ph": `min(720px, calc((100svh - 344px) / ${1 - PORTRAIT_UNDER}))`'),
  read("Cards", "4 columns · gap 16 · mt 32 · min 176 · radius 28 · p 24", `${W}Players.tsx:207`, undefined, "mt-8 grid grid-cols-4 gap-4 max-lg:hidden", "min-h-[176px] flex-col justify-between rounded-[28px] border p-6"),
  read("Unpicked card", "opacity 0.6, 0.85 on hover", `${W}Players.tsx:28`, undefined, "const UNSELECTED = 0.6;", "whileHover={{ opacity: on ? 1 : 0.85 }}"),
  read("Change of player", "text 8px up and out over 0.35s, portrait scale 0.97 in over 0.5s", `${W}Players.tsx:119`, undefined, "initial={{ opacity: 0, y: 8 }}", "transition={{ duration: 0.35, ease }}", "initial={{ opacity: 0, scale: 0.97 }}"),
] as const;

export const PLAYERS_CODE = `import { AccentWave } from "@/components/website/AccentWave";
import { Players } from "@/components/website/Players";
import { ScrubLine } from "@/components/website/ScrubLine";

// the players need the water under them and the line above them: it is the water that reveals them
<AccentWave />
<ScrubLine />
<Players />`;
