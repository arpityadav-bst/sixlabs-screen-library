// What every moving part does under prefers-reduced-motion: reduce, and where that answer is written. The
// parts with no answer are listed too, so the gap is in plain sight.
import type { CheckedRow } from "@/app/design-system/sections/components/display-values";
import { system } from "@/app/design-system/sections/foundations/foundation-assert";

const W = "components/website/";
const G = "app/globals.css";

export type ReducedRow = { part: string; reduced: string; handled: boolean; source: string };

export const REDUCED_ROWS: readonly ReducedRow[] = [
  { part: "CSS loops (scroll-bob, badge-bob, floor-spin, logo-arc, term-hint)", reduced: "stop, each at its rest frame", handled: true, source: `${G}:45` },
  { part: "TypedWord", reduced: "the word shows whole, no caret", handled: true, source: `${G}:160` },
  { part: "Hero copy fade", reduced: "shows at once", handled: true, source: `${G}:162` },
  { part: "ScrubLine", reduced: "the line shows filled", handled: true, source: `${W}ScrubLine.tsx:69` },
  { part: "LiquidLine", reduced: "off, the line shows without the liquid", handled: true, source: `${W}LiquidLine.tsx:18` },
  { part: "PlayerDoodles", reduced: "the strokes land with no drawing", handled: true, source: `${W}PlayerDoodles.tsx:59` },
  { part: "Portrait sweep (PortraitSwap, StackedSwap)", reduced: "the new copy settles in place, no sweep", handled: true, source: `${W}PortraitSwap.tsx:84` },
  { part: "Portrait touch sway", reduced: "looks straight ahead", handled: true, source: `${W}PlayerPortrait.tsx:133` },
  { part: "FloatingBadges", reduced: "no pointer drift, no flips", handled: true, source: `${W}FloatingBadges.tsx:71` },
  { part: "JobTerminal", reduced: "shows the finished run", handled: true, source: `${W}JobTerminal.tsx:107` },
  { part: "PrimaryCta sweep", reduced: "keeps the grow and the fill, drops the band", handled: true, source: `${W}PrimaryCta.tsx:83` },
  { part: "ASCII field", reduced: "still glyphs, a swap in place of the scan", handled: true, source: `${W}ascii-field.js:249` },
  { part: "Tile floor (intro, autoplay, waves, sweeps)", reduced: "runs as usual", handled: false, source: "tiles/autoplay.js:11" },
  { part: "In-page glide", reduced: "runs as usual", handled: false, source: `${W}glide.ts:38` },
  { part: "Players magnet", reduced: "desktop Safari's catch still glides in over 0.6s. Elsewhere it is the CSS snap alone", handled: false, source: `${W}SafariScroll.tsx:37` },
  { part: "Human / AI auto flip", reduced: "still swaps every 5s, without the sweep", handled: false, source: `${W}usePlayerMode.ts:19` },
  { part: "animate-ping and animate-pulse", reduced: "keep running", handled: false, source: `${W}Hero.tsx:238` },
  { part: "motion/react entrances and menus", reduced: "travel as usual, no MotionConfig", handled: false, source: `${W}Understands.tsx:44` },
];

export const REDUCED_COLUMNS = ["Part", "Under reduced motion", "Handled", "Source"];

export const REDUCED_TABLE = REDUCED_ROWS.map((r) => [r.part, r.reduced, r.handled ? "yes" : "no", r.source]);

export const READOUT_QUERY = "matchMedia('(prefers-reduced-motion: reduce)')";

export const READOUT_VALUES: readonly CheckedRow[] = [
  { part: "Query", value: "(prefers-reduced-motion: reduce)", source: "app/design-system/_kit/reduced-motion.ts:7" },
  { part: "Spinner, reduced", value: "1.5s a turn instead of 1s", source: "components/design-system/Spinner.tsx:51-52",
    assert: system("Spinner.tsx", "animate-spin rounded-full", "motion-reduce:animate-[spin_1.5s_linear_infinite]") },
  { part: "StatusDot, reduced", value: "ping and pulse stop", source: "components/design-system/StatusDot.tsx:31, 39",
    assert: system("StatusDot.tsx", "animate-ping rounded-full motion-reduce:animate-none", "animate-pulse motion-reduce:animate-none") },
];

export const READOUT_CODE = `import { useReducedMotion } from "motion/react";

const still = useReducedMotion();          // in a component
className="motion-reduce:animate-none"      // on a Tailwind loop`;
