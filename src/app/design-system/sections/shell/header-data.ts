// Values for the header section: pins measured inside the frames, the state strip, the triggers and the
// drawer rows, each with the file:line it is read from.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { PartId } from "@/app/design-system/frame/_parts";
import type { Pin } from "@/app/design-system/sections/components/display-values";

export const HEADER_PINS: readonly Pin[] = [
  { selector: "#site-head", name: "Bar", token: "--ds-color-page-92", value: "px 24 py 20 · 16 all round on phones", source: "Header.tsx:53", expect: "px-6 py-5 max-md:px-4 max-md:py-4", padding: true, side: "left" },
  { selector: "#site-head > div", name: "Inner row", token: "--ds-container", value: "max 1400, centred", source: "Header.tsx:63", expect: "max-w-[1400px] mx-auto", side: "left" },
  { selector: "#site-head > div > a", name: "Lockup", value: "mark 32 · gap 10 · Outfit 24/500", source: "Header.tsx:64,71,73", expect: ["gap-2.5", "w-8 h-8", "font-display text-2xl font-medium"], side: "left" },
  { selector: "#site-head > div > div:nth-of-type(1)", name: "Tabs", token: "--ds-type-nav-size", value: "gap 32 · 15/400 · from md", source: "Header.tsx:78,86", expect: ["md:flex items-center gap-8", "text-[15px] font-normal"] },
  { selector: '#site-head button[aria-haspopup="listbox"]', name: "Language trigger", value: "Globe 18 · code 12/500 · from md", source: "Header.tsx:95-96, LanguageMenu.tsx:63,65", expect: ["max-md:hidden", "<LanguageMenu />", "w-[18px] h-[18px]", "text-[12px] font-medium"], side: "right" },
  { selector: "#site-head button[data-cta]", name: "Sign in", token: "--ds-color-line-strong", value: "px 20 py 8 · 14px · about 39 tall", source: "Header.tsx:102", expect: "text-[14px] px-5 py-2", padding: true, side: "right" },
  { selector: '#site-head button[aria-label="Open menu"]', name: "Menu button", value: "40 · Menu 22/1.75 · phones only", source: "MobileMenu.tsx:53,58", expect: ["h-10 w-10", "md:hidden", "<Menu size={22} strokeWidth={1.75} />"], side: "right" },
  { selector: "#site-head > div > div:nth-of-type(2)", name: "Right cluster", value: "gap 16 · 6 on phones", source: "Header.tsx:93", expect: "gap-4 max-md:gap-1.5", side: "right" },
];

/** The bar's grounds, each a frame at 1280 reached the way the live page reaches it. */
export const HEADER_STRIP: readonly { part: PartId; title: string; label: string }[] = [
  { part: "header-rest", title: "Header at rest", label: "default, top · page at 92% · stroke transparent" },
  { part: "header-scrolled", title: "Header scrolled", label: "scrolled · scrollY over 4 · stroke slate-300 at 80%" },
  { part: "header-onblue", title: "Header on blue", label: "onBlue · accentwave filled · solid white" },
  { part: "header-clear-top", title: "Clear header at the top", label: "clear, top · after heroloaded · no ground" },
  { part: "header-clear-held", title: "Clear header held", label: "clear, held · until heroloaded · invisible, on purpose" },
];

export const PHONE_STRIP: readonly { part: PartId; title: string; label: string }[] = [
  { part: "header-phone", title: "Phone header at rest", label: "375 · rest · Sign in 13px, about 33 tall" },
  { part: "header-scrolled", title: "Phone header scrolled", label: "375 · scrolled" },
];

/** What flips the bar. The full window contract is in Shell behaviours. */
export const HEADER_TRIGGERS: readonly KeyRow[] = [
  { key: "scrollY > 4", value: "scrolled: the stroke shows. Read on scroll only, so a reload restored mid-page shows the top state until the first scroll", source: "Header.tsx:44" },
  { key: "accentwave", value: "onBlue: solid white over either variant while the water fills the view (true at 90%, false below 80%)", source: "AccentWave.tsx:68" },
  { key: "heroloaded", value: "clear only: invisible from the first paint until loading ends, or 12s, then there at once with no fade", source: "Header.tsx:32" },
  { key: "clear", value: "the prop: no ground at the top of the full view, so the floor reads edge to edge", source: "Header.tsx:26" },
  { key: "md 768px", value: "below it the tabs and the language move into the menu, and Sign in drops to 13px", source: "Header.tsx:78" },
];

/** Per-state values of the bar's controls, which cannot be forced (Tailwind hover, no props). */
export const HEADER_CONTROL_STATES: readonly KeyRow[] = [
  { key: "tab rest", value: "ink #0a1b33 at 15/400", source: "Header.tsx:86" },
  { key: "tab hover", value: "accent #1a6dff over 300ms", source: "Header.tsx:86" },
  { key: "tab focus", value: "the browser's own outline, no ring of the system's yet" },
  { key: "tab current", value: "missing: no aria-current and no scroll spy" },
  { key: "Sign in rest", value: "no fill, 1px slate-300 stroke", source: "Header.tsx:102" },
  { key: "Sign in hover", value: "white at 70% and a #b7c0cb stroke over 200ms. On the white onBlue bar only the stroke moves", source: "Header.tsx:102" },
  { key: "Sign in focus, pressed", value: "missing" },
];

export const HEADER_VALUES: readonly ValueRow[] = [
  { part: "Ground", token: "--ds-color-page-92", value: "rgb(249 250 251 / 0.92), no blur", source: "Header.tsx:59" },
  { part: "Ground, onBlue", token: "--ds-color-surface", value: "#ffffff", source: "Header.tsx:56" },
  { part: "Ground, clear top", value: "transparent", source: "Header.tsx:58" },
  { part: "Stroke, scrolled", token: "--ds-color-line-scrolled", value: "slate-300 at 80%, 1px, always in the box", source: "Header.tsx:60" },
  { part: "Padding", value: "24 × 20 from md, 16 × 16 below", source: "Header.tsx:53" },
  { part: "Height", token: "--ds-header-h-md", value: "80 from md, 73 on phones (computed)" },
  { part: "Layer", token: "--ds-z-header", value: "40, shared with BackToTop", source: "Header.tsx:53" },
  { part: "Colour change", token: "--ds-dur-line", value: "300ms, Tailwind's default ease", source: "Header.tsx:53" },
  { part: "Inner row", token: "--ds-container", value: "1400 max, centred", source: "Header.tsx:63" },
  { part: "Tabs", token: "--ds-type-nav-size", value: "15 · 400 · tracking -0.01em · gap 32", source: "Header.tsx:86" },
  { part: "Sign in", value: "14 · px 20 py 8 · pill · 13 and px 14 py 6 on phones", source: "Header.tsx:102" },
  { part: "Sign in hover stroke", token: "--ds-color-line-hover", value: "#b7c0cb", source: "Header.tsx:102" },
];

export const HEADER_PROPS: readonly PropRow[] = [
  { name: "clear", type: "boolean", default: "false", note: "the full view: no ground at the top, held until heroloaded" },
];

export const HEADER_CODE = `import { Header } from "@/components/website/Header";

<Header />        // /website
<Header clear />  // /6labs-fullview`;
