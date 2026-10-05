// Values for the shell behaviours section: what ClickLock stops, where each in-page link rests, how long
// a glide runs, and the window contracts the shell's parts talk through, each with its file:line.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { site, type Assertion } from "../foundations/foundation-assert";

export const LOCK_COLUMNS = ["Control", "Where", "Matches", "On click"] as const;

export const LOCK_ROWS: readonly (readonly string[])[] = [
  ["Lockup link", "Header, Footer", "a", "locked"],
  ["Tabs", "Header", "a", "locked"],
  ["Sign in", "Header", "[data-cta]", "locked"],
  ["Try now", "Hero, Closing, phone sheet", "[data-cta]", "locked"],
  ["Explore and legal links", "Footer", "a", "locked"],
  ["Back to top (text)", "Footer", "[data-cta]", "locked"],
  ["Menu rows", "Phone sheet", "a", "locked, so the sheet stays open"],
  ["Menu button, veil", "Phone sheet", "neither", "works"],
  ["Language menu", "Header, phone sheet", "neither", "works"],
  ["Back to top (floating)", "Page corner", "neither", "works"],
  ["Wave button, players' switch and arrows", "Players", "neither", "works"],
  ["FAQ rows, jobs tabs", "FAQ, Jobs", "neither", "works"],
];

export const LOCK_VALUES: readonly ValueRow[] = [
  { part: "Selector", value: "a, [data-cta]", source: "ClickLock.tsx:11" },
  { part: "Listeners", value: "click and auxclick on document, capture phase: preventDefault and stopPropagation", source: "ClickLock.tsx:20" },
  { part: "Keyboard", value: "Enter on a link and Space on a [data-cta] button fire a click, so both are locked too" },
  { part: "Feedback", value: "none: hover still shows, the cursor does not change" },
  { part: "Mounted on", value: "/website and /6labs-fullview, and every shell frame of this guide", source: "website/page.tsx:31" },
];

export const LOCK_CODE = `import { ClickLock } from "@/components/website/ClickLock";

// once per page, anywhere: it renders nothing. Remove it to lift the lock
<ClickLock />`;

export const SPOT_COLUMNS = ["Spot", "Target", "Rests at", "Why there"] as const;

export const SPOT_ROWS: readonly (readonly string[])[] = [
  ["top", "the page", "0", "home"],
  ["model-line", "#model-line", "line top + 0.82 × (line height − view × 2.3)", "the line has just filled"],
  ["players", "#model-line", "line top + line height − view", "the water has filled the view"],
  ["jobs", "#jobs", "its top − #site-head height", "the section's own padding shows under the bar"],
  ["faq", "#faq", "its top − #site-head height", "as jobs"],
];

export const GLIDE_VALUES: readonly ValueRow[] = [
  { part: "Ease", token: "--ds-ease-glide", value: "1 − (1 − k)³, a quick start that settles", source: "glide.ts:10" },
  { part: "Duration", value: "min(2.2, 0.9 + distance / 4000) s: 1000px 1.15s, 4000px 1.9s, 5200px on 2.2s", source: "jump.ts:38" },
  { part: "Input", value: "wheel, touchmove and the scroll keys held for the whole run, with no way to cancel", source: "glide.ts:25" },
  { part: "Snap", value: "the html scroll snap off during the run, restored after", source: "glide.ts:48" },
  { part: "Safari", value: "runs on Lenis (lock, force) in place of the frame loop", source: "glide.ts:41" },
  { part: "No script", value: "each link keeps its #hash, which lands under the bar (no scroll-margin-top)", source: "jump.ts:42" },
];

export const GLIDE_CODE = `import { linkTo, jumpTo } from "@/components/website/jump";

<a {...linkTo("players")}>The players</a>
<button onClick={() => jumpTo("top")}>Back to top</button>`;

export const WINDOW_CONTRACTS: readonly KeyRow[] = [
  { key: "heroloaded", value: "an Event as the full view's loading ends, or after 12s. The clear header waits for it", source: "hero-intro.ts:62" },
  { key: "accentwave", value: "a CustomEvent with { filled }, true at 90% of the view, false below 80%. The header turns white and the players wait", source: "AccentWave.tsx:68" },
  { key: "scrollY > 4", value: "the header's stroke", source: "Header.tsx:44" },
  { key: "scrollY > 40", value: "the scroll cue fades away", source: "ScrollCue.tsx:11" },
  { key: "#model-line", value: "the scroll line's track. BackToTop, the spots, the water and the ASCII field all read it", source: "ScrubLine.tsx:107" },
  { key: "#site-head", value: "the header, whose height a spot subtracts", source: "jump.ts:28" },
  { key: "#players", value: "the magnet's point: CSS scroll snap, and in desktop Safari, where the snap is off, Lenis's catch", source: "Players.tsx:100" },
  { key: "[data-covers-view]", value: "the full view's hero fills the screen, so the ASCII field pauses under it", source: "Hero.tsx:120" },
  { key: "onblue:theme", value: "the ASCII field reads its tint again", source: "ascii-field.js:107" },
];

/** Each row with the text it was read off where it can be, so Coverage holds it to SafariScroll (or globals.css). */
export const SAFARI_ROWS: readonly (KeyRow & { readonly a?: Assertion })[] = [
  { key: "when", value: "desktop Safari with a fine pointer scrolls on Lenis. Every other browser and every touch screen keep native scrolling, with the CSS snap as the whole magnet (elsewhere, below)", source: "SafariScroll.tsx:21-22", a: site("SafariScroll.tsx", 'window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;') },
  { key: "why", value: "Safari moves the page ahead of its drawing, so the water's edge trailed a quick scroll" },
  { key: "lerp", value: "0.15 of the way to the wheel's target each frame", source: "SafariScroll.tsx:24", a: site("SafariScroll.tsx", "lerp: 0.15,") },
  { key: "magnet", value: "a scroll that rests 120ms within 0.3 of a screen of #players glides the last stretch in 0.6s, on Lenis, unless a link's glide is under way", source: "SafariScroll.tsx:15-17,34-37", a: site("SafariScroll.tsx", "const MAGNET = 0.3;", "const MAGNET_S = 0.6;", "const REST_MS = 120;") },
  { key: "elsewhere", value: "every other browser and every touch screen: the CSS snap alone, which catches only a scroll that ends near #players. No catch in script and no input hold", source: "globals.css:25-27,31-33", a: { file: "app/globals.css", needles: ["scroll-snap-type: y proximity;", "scroll-snap-align: start;"] } },
  { key: "glides", value: "the in-page links' glide runs on Lenis while it is on", source: "SafariScroll.tsx:28" },
];
