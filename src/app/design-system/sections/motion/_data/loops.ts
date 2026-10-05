// Every loop on the site that runs by itself: how often, how far, on which curve, what it does under
// reduced motion and where it is written. Tailwind's own loops are listed with Tailwind's keyframes.
import type { CheckedRow } from "@/app/design-system/sections/components/display-values";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";
import { BADGES } from "@/components/website/floating-badges-data";

const W = "components/website/";
const G = "app/globals.css";

export type LoopRow = { loop: string; where: string; period: string; travel: string; curve: string; reduced: string; source: string };

export const LOOP_ROWS: readonly LoopRow[] = [
  { loop: "scroll-bob", where: "Scroll cue arrow", period: "1.8s", travel: "4px down", curve: "ease-in-out", reduced: "stops", source: `${G}:55` },
  { loop: "badge-bob", where: "Floating tiles", period: "5.5s", travel: "7px up", curve: "ease-in-out", reduced: "stops", source: `${G}:82` },
  { loop: "logo-arc", where: "Full view loader", period: "1.5s, an arc each third", travel: "3px out", curve: "ease-in-out", reduced: "stops", source: `${G}:153` },
  { loop: "floor-spin", where: "Container loader logo", period: "90s a turn", travel: "turns in place", curve: "linear", reduced: "lies still, tilted", source: `${G}:43` },
  { loop: "term-hint", where: "Jobs terminal cursor, mouse only", period: "2.4s", travel: "scale 0.95 to 1.05, ring 0.4 to 1.9", curve: "ease-in-out, ring ease-out", reduced: "stops, ring hidden", source: `${G}:169` },
  { loop: "tw-linger", where: "Typed word's last caret", period: "1s, once", travel: "none, it blinks", curve: "steps", reduced: "caret hidden", source: `${G}:115` },
  { loop: "animate-ping", where: "Hero live dot", period: "1s", travel: "scale to 2, fading", curve: "cubic-bezier(0, 0, 0.2, 1)", reduced: "keeps running", source: `${W}Hero.tsx:238` },
  { loop: "animate-pulse", where: "Player card dot, terminal cursor", period: "2s", travel: "opacity 1 to 0.5", curve: "cubic-bezier(0.4, 0, 0.6, 1)", reduced: "keeps running", source: `${W}Players.tsx:269` },
  { loop: "animate-spin", where: "Wave button busy, terminal steps", period: "1s a turn", travel: "turns in place", curve: "linear", reduced: "keeps running", source: `${W}HeroBits.tsx:114` },
  { loop: "ASCII shimmer", where: "Glyph field, brightest cells", period: "about 5.7s", travel: "brightness only", curve: "sine", reduced: "still", source: `${W}ascii-field.js:122` },
  { loop: "ASCII roll", where: "Glyph field", period: "about 8.3s", travel: "glyphs cycle in place", curve: "linear", reduced: "still", source: `${W}ascii-field.js:175` },
  { loop: "Badge flip", where: "Floating tiles", period: "every 3.5 to 6.5s, 0.8s a flip", travel: "a quarter turn out, a quarter turn back", curve: "ease in, then Tailwind ease-out", reduced: "no flips", source: `${W}FloatingBadges.tsx:32` },
  { loop: "Touch sway", where: "Player portrait on touch screens", period: "9s", travel: "0.85 of the turn each way", curve: "sine", reduced: "looks straight ahead", source: `${W}PlayerPortrait.tsx:37` },
  { loop: "Human / AI flip", where: "Players, in view, until a choice", period: "every 5s", travel: "the 1.5s portrait sweep, near a third of each period", curve: "in-out cubic", reduced: "flips without the sweep", source: `${W}usePlayerMode.ts:11` },
  { loop: "Tile autoplay", where: "Tile floor", period: "a tile every 380 + 220ms, then a wave", travel: "rise, sweep and flip", curve: "in-out cubic", reduced: "keeps running", source: "tiles/autoplay.js:11" },
];

export const LOOP_COLUMNS = ["Loop", "Where", "Period", "Travel", "Curve", "Reduced motion", "Source"];

export const LOOP_TABLE = LOOP_ROWS.map((r) => [r.loop, r.where, r.period, r.travel, r.curve, r.reduced, r.source]);

/** The live specimens' captions. */
export const LIVE_LOOPS = {
  bob: "scroll-bob · 1.8s · 4px",
  badge: "badge-bob · 5.5s · 7px",
  loader: "logo-arc · 1.5s · 3px",
  ping: "StatusDot ping · 1s",
  pulse: "StatusDot pulse · 2s",
} as const;

/** The tile window's stage, px. The tiles take their spots as shares of it and their sizes from the window's
 *  width, as on the site. 1200 tall keeps the third tile (10%, 56% from 1600) clear of the first's window,
 *  and every other spot sits far to the right or below at each width. */
export const TILE_STAGE = { width: 1600, height: 1200 } as const;

/** The first tile's spots by width, read from BADGES, so the window follows the data. */
export const TILE_SPOT = BADGES[0];

export const LOOP_VALUES: readonly CheckedRow[] = [
  { part: "Travel ceiling", token: "--ds-loop-max", value: "8px", source: "system" },
  { part: "Period floor", value: "1.5s", source: "system" },
  { part: "Scroll cue", value: "translateY 0 to 4px, 1.8s ease-in-out", source: `${G}:52` },
  { part: "Floating tile", value: "translateY 0 to -7px, 5.5s ease-in-out", source: `${G}:79` },
  { part: "Loader arcs", value: "3px out in the first third of 1.5s, delays i x 0.5 - 1.5s", source: `${W}HeroLoader.tsx:40` },
  { part: "StatusDot ping and pulse", value: "stop under reduced motion (motion-reduce:animate-none)",
    source: "components/design-system/StatusDot.tsx:31, 39", assert: system("StatusDot.tsx", "animate-ping rounded-full motion-reduce:animate-none", "animate-pulse motion-reduce:animate-none") },
];

export const LOOP_CODE = `import { ScrollCue } from "@/components/website/ScrollCue";
import { StatusDot } from "@/components/design-system/StatusDot";

<ScrollCue />
<StatusDot tone="live" motion="ping" />`;
