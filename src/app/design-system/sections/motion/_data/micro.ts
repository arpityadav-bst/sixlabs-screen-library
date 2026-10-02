// Every micro-interaction the site ships: the trigger, the part, what it does, how long it takes and the
// line it is written on. The live row above the table refers to these numbers.
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";

const W = "components/website/";

export type MicroRow = { n: number; trigger: string; part: string; response: string; timing: string; source: string };

const rows: Omit<MicroRow, "n">[] = [
  { trigger: "hover", part: "PrimaryCta", response: "grows to 1.04, the fill shifts toward the accent, the dot band sweeps", timing: "spring 400 / 25 · band 1s (0.45, 0, 0.25, 1)", source: `${W}PrimaryCta.tsx:96` },
  { trigger: "hover end", part: "PrimaryCta", response: "the shifted fill eases off", timing: "0.3s", source: `${W}PrimaryCta.tsx:87` },
  { trigger: "press", part: "PrimaryCta", response: "shrinks to 0.97", timing: "spring 400 / 25", source: `${W}PrimaryCta.tsx:97` },
  { trigger: "hover", part: "Header link", response: "ink to accent", timing: "300ms colour", source: `${W}Header.tsx:86` },
  { trigger: "hover", part: "Sign in", response: "white 70% fill, border to #b7c0cb", timing: "200ms colour", source: `${W}Header.tsx:102` },
  { trigger: "page leaves the top", part: "Header bar", response: "ground and hairline change", timing: "300ms colour", source: `${W}Header.tsx:53` },
  { trigger: "hover", part: "Jobs tab", response: "label colour", timing: "200ms colour", source: `${W}Jobs.tsx:128` },
  { trigger: "hover", part: "WaveButton", response: "the label widens 0 to 80px and fades in", timing: "200ms all", source: `${W}HeroBits.tsx:105` },
  { trigger: "open", part: "LanguageMenu", response: "globe turns 20deg, panel from scale 0.94 and y -8, rows 0.035s apart", timing: "spring 460 / 34, mass 0.7", source: `${W}LanguageMenu.tsx:22` },
  { trigger: "close", part: "LanguageMenu", response: "panel to scale 0.97 and y -4", timing: "0.14s ease in", source: `${W}LanguageMenu.tsx:23` },
  { trigger: "pointer or arrow key", part: "LanguageMenu row", response: "the highlight glides to the row", timing: "spring 460 / 34, mass 0.7", source: `${W}LanguageMenu.tsx:93` },
  { trigger: "open", part: "MobileMenu", response: "veil fades in, sheet drops 8px in", timing: "0.25s · sheet on the ease", source: `${W}MobileMenu.tsx:79` },
  { trigger: "press", part: "MobileMenu row", response: "ink to accent", timing: "200ms colour", source: `${W}MobileMenu.tsx:91` },
  { trigger: "open", part: "Faq answer", response: "height 0 to auto with opacity", timing: "0.35s on the ease", source: `${W}Faq.tsx:65` },
  { trigger: "open", part: "Faq icon and row", response: "the plus bar turns and fades to a minus, the border darkens", timing: "300ms", source: `${W}Faq.tsx:53` },
  { trigger: "hover", part: "Player card", response: "lifts 2px onto the lift shadow, opacity 0.85 when unselected", timing: "300ms", source: `${W}Players.tsx:221` },
  { trigger: "hover", part: "Jobs card sheen", response: "the stroke light fades in and follows the pointer", timing: "0.4s ease", source: "app/globals.css:260" },
  { trigger: "choose", part: "ModeToggle", response: "the white thumb slides to the choice", timing: "spring 500 / 40", source: `${W}ModeToggle.tsx:50` },
  { trigger: "choose", part: "Carousel dot", response: "the active dot widens 6 to 24px and turns white", timing: "300ms all", source: `${W}PlayerCarousel.tsx:108` },
  { trigger: "scroll past the hero", part: "BackToTop", response: "rises 8px in and fades in, lifts 2px on hover", timing: "300ms", source: `${W}BackToTop.tsx:62` },
  { trigger: "first paint or in view", part: "TypedWord", response: "a letter every 90ms after 0.5s, the last caret lingers", timing: "90ms per letter · linger 1s", source: "app/globals.css:93" },
  { trigger: "point at a tile", part: "Tile floor", response: "the tile rises, then the activation sweeps it", timing: "rise settle 0.12s · sweep 0.9s · floor clock x1.69", source: "tiles/sweep.js:10" },
  { trigger: "leave a tile", part: "Tile floor", response: "past 0.25s it finishes, then fades out", timing: "commit 0.25s · fade 1.05s", source: "tiles/sweep.js:13" },
  { trigger: "press", part: "WaveButton", response: "every tile flips back, staggered across the screen", timing: "spread 1.3s · flip 0.75s", source: "tiles/autoplay.js:12" },
];

export const MICRO_ROWS: readonly MicroRow[] = rows.map((r, i) => ({ n: i + 1, ...r }));

export const MICRO_COLUMNS = ["#", "Trigger", "Part", "Response", "Timing", "Source"];

export const MICRO_TABLE = MICRO_ROWS.map((r) => [String(r.n), r.trigger, r.part, r.response, r.timing, r.source]);

/** Row numbers the live specimens answer to. */
export const LIVE = {
  cta: [1, 2, 3],
  wave: [8],
  language: [9, 10, 11],
  mode: [18],
} as const;

export const rowsLabel = (ns: readonly number[]) => (ns.length === 1 ? `row ${ns[0]}` : `rows ${ns.join(", ")}`);

export const LIVE_VALUES: readonly ValueRow[] = [
  { part: "PrimaryCta grow and press", token: "spring-press", value: "1.04 hover, 0.97 press, 400 / 25", source: `${W}PrimaryCta.tsx:99` },
  { part: "PrimaryCta band", token: "--ds-ease-sweep", value: "1s, cubic-bezier(0.45, 0, 0.25, 1)", source: `${W}PrimaryCta.tsx:85` },
  { part: "WaveButton label", token: "--ds-dur-ui", value: "max-width 0 to 80px, 200ms", source: `${W}HeroBits.tsx:107` },
  { part: "LanguageMenu spring", token: "spring-pop", value: "460 / 34, mass 0.7", source: `${W}LanguageMenu.tsx:17` },
  { part: "LanguageMenu exit", token: "--ds-dur-exit", value: "0.14s ease in", source: `${W}LanguageMenu.tsx:23` },
  { part: "ModeToggle thumb", token: "spring-thumb", value: "500 / 40, layoutId", source: `${W}ModeToggle.tsx:50` },
];

export const LIVE_CODE = `import { LayoutGroup } from "motion/react";
import { LanguageMenu } from "@/components/website/LanguageMenu";

// a second LanguageMenu on one page: its highlight's layoutId stays inside this group
<LayoutGroup id="ds-lang-micro"><LanguageMenu /></LayoutGroup>`;
