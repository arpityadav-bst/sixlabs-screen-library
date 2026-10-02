// The player carousel's written values: Anatomy pins, the per-state rows the shipped part cannot be forced
// into, and the drawer. Every value cites the line of PlayerCarousel.tsx it is read from.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { Pin } from "./display-values";

const F = "PlayerCarousel.tsx";
const ACTIVE = 'article[aria-hidden="false"]';

export const CAROUSEL_PINS: readonly Pin[] = [
  { selector: 'button[aria-label="Next player"]', name: "Arrow", token: "--ds-color-on-blue-15", value: "36 circle", source: `${F}:16`, expect: "grid h-9 w-9 place-items-center rounded-full" },
  { selector: '[class*="snap-mandatory"]', name: "Track", value: "snap-x, one slide per width", source: `${F}:74`, expect: "flex snap-x snap-mandatory overflow-x-auto" },
  { selector: ACTIVE, name: "Slide", value: "full width, px 4", source: `${F}:80`, expect: "w-full shrink-0 snap-center px-1", padding: true },
  { selector: `${ACTIVE} h3`, name: "Title", token: "--ds-type-carousel-title", value: "28, 36 from md", source: `${F}:84`, expect: ["text-[28px]", "md:text-[36px]"] },
  { selector: `${ACTIVE} p`, name: "Body", token: "--ds-color-on-blue-80", value: "15, 16 from md", source: `${F}:87`, expect: ["text-[15px]", "md:text-[16px]"] },
  { selector: `${ACTIVE} dl`, name: "Traits", value: "PlayerTraits dense, mt 20", source: `${F}:90`, expect: '<PlayerTraits traits={p.traits} dense className="mt-5" />' },
  { selector: 'button[aria-current="false"]', name: "Dot target", value: "32 tall, px 6", source: `${F}:104`, expect: "grid h-8 place-items-center px-1.5", padding: true },
  { selector: 'button[aria-current="true"] > span', name: "Active dot", token: "--ds-color-surface", value: "24 by 6", source: `${F}:108,109`, expect: ["block h-1.5 rounded-full", '"w-6 bg-white"'] },
];

export const CAROUSEL_STATES: readonly KeyRow[] = [
  { key: "dot active", value: "24 by 6, white", source: `${F}:109` },
  { key: "dot rest", value: "6 by 6, white at 40%", source: `${F}:109` },
  { key: "dot hover, press", value: "nothing drawn", source: `${F}:104` },
  { key: "arrow enabled", value: "white 15% fill, white 25% inset ring", source: `${F}:16` },
  { key: "arrow disabled", value: "opacity 0.3, the previous arrow on the first slide and the next on the last", source: `${F}:134` },
  { key: "arrow hover, press", value: "nothing drawn", source: `${F}:16` },
  { key: "focus-visible", value: "the browser's default ring on dots and arrows", source: `${F}:98` },
  { key: "swipe", value: "counts once the track has rested 120ms", source: `${F}:63` },
  { key: "dot or arrow pick", value: "glides the track by smooth scroll, the slides it passes do not count", source: `${F}:42` },
];

export const CAROUSEL_VALUES: readonly ValueRow[] = [
  { part: "Track", value: "flex, snap-x mandatory, overflow-x auto, overscroll-x contain, no scrollbar", source: `${F}:74` },
  { part: "Slide", value: "w-full, shrink-0, snap-center, px 4, aria-hidden off the active slide", source: `${F}:77-80` },
  { part: "Column from md", value: "max-w 560, centred", source: `${F}:83` },
  { part: "Title", token: "--ds-type-carousel-title", value: "Outfit 28 / 500, leading 1.1, tight, 36 from md, white", source: `${F}:84` },
  { part: "Body", token: "--ds-color-on-blue-80", value: "Inter 15 (16 from md), leading snug, max-w 520, balanced", source: `${F}:87` },
  { part: "Traits", value: "PlayerTraits dense, mt 20", source: `${F}:90` },
  { part: "Dots row", value: "mt 16, centred", source: `${F}:96` },
  { part: "Dot target", value: "h 32, px 6, so 18 wide at rest and 36 active", source: `${F}:104` },
  { part: "Dot", token: "--ds-color-on-blue-40", value: "h 6, w 6 at 40% white, w 24 white when active", source: `${F}:106-109` },
  { part: "Dot motion", token: "--ds-dur-line", value: "width and colour, 300ms", source: `${F}:108` },
  { part: "Rest debounce", value: "120ms after the last scroll event", source: `${F}:63` },
  { part: "Arrow", token: "--ds-color-on-blue-15", value: "36 circle, white 15%, inset ring 1px white 25%", source: `${F}:16` },
  { part: "Arrow icon", token: "--ds-icon-18", value: "ChevronLeft, ChevronRight, 18, stroke 2", source: `${F}:138` },
  { part: "Arrow disabled", value: "opacity 0.3, opacity transition 200ms", source: `${F}:16` },
  { part: "Arrow place", value: "absolute, left 0 or right 0, vertically centred on the portrait box", source: `${F}:136` },
];

export const CAROUSEL_PROPS: readonly PropRow[] = [
  { name: "active", type: "number", note: "the index into PLAYERS" },
  { name: "onChange", type: "(k: number) => void", note: "called once a swipe rests, or on a dot or arrow" },
];

export const CAROUSEL_CODE = `import { PlayerArrows, PlayerCarousel } from "@/components/website/PlayerCarousel";

const [active, setActive] = useState(0);

<div className="relative">
  {/* the portrait */}
  <PlayerArrows active={active} onChange={setActive} />
</div>
<PlayerCarousel active={active} onChange={setActive} />`;
