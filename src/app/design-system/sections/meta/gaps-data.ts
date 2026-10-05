// Known gaps: what the guide cannot catch, and the defects in the site and the system found while building
// it. Each defect names its evidence, the exact text that shows it, so the line it sits on is read from the
// file at build and a row whose evidence has moved or gone reads "recheck" instead of a stale file:line.
// Paths are repo-relative.

export type Severity = "high" | "medium" | "low";
export type Area = "perf" | "a11y" | "behaviour" | "drift" | "dead" | "stale" | "tooling";

export type Evidence =
  /** the defect holds while the file still writes this */
  | { file: string; needle: string }
  /** it holds while the file does not write `absent`, and `anchor` gives the line to point at */
  | { file: string; absent: string; anchor: string }
  /** it holds while no file of the folder writes `absent` */
  | { dir: string; absent: string }
  /** drift: how many files of the folder write each spelling */
  | { dir: string; counts: readonly string[] };

export type Gap = { area: Area; severity: Severity; part: string; effect: string; evidence: readonly Evidence[] };

const W = "src/components/website/";
const DS = "src/components/design-system/";
const CSS = "src/app/globals.css";

/** The system parts that set 12 to 15px white text straight on the accent, each by the text that writes it.
 *  Decisions pending ("accent-label") reads the same list for its figures. */
export const WHITE_ON_ACCENT = [
  { part: "Segmented, a segment at rest", file: `${DS}segmented-styles.ts`, needle: "text-white enabled:hover:bg-(--ds-color-on-blue-15)" },
  { part: "Slider label and value", file: `${DS}slider-styles.ts`, needle: 'label: "text-[14px] leading-5 text-white"' },
  { part: "Slider tick labels", file: `${DS}Slider.tsx`, needle: 'text-[12px] leading-4 tabular-nums ${ground === "blue" ? "text-white"' },
  { part: "Switch label", file: `${DS}Switch.tsx`, needle: 'const labelClass = blue ? "text-[14px] leading-5 text-white"' },
  { part: "Switch description", file: `${DS}Switch.tsx`, needle: '"text-[13px] leading-[18px] text-white"' },
  { part: "Progress name and value", file: `${DS}progress-styles.ts`, needle: 'blue: { name: "text-white", value: "text-white" }' },
  { part: "Chip on blue", file: `${DS}chip-styles.ts`, needle: "border-(--ds-color-on-blue-40) bg-transparent text-white" },
  { part: "Glass Button", file: `${DS}button-styles.ts`, needle: 'glass: "rounded-full border border-(--ds-color-on-blue-40) bg-transparent text-white' },
] as const;

export const AREAS: readonly { id: Area; title: string }[] = [
  { id: "perf", title: "Performance" },
  { id: "a11y", title: "Accessibility" },
  { id: "behaviour", title: "Behaviour" },
  { id: "drift", title: "Drift" },
  { id: "dead", title: "Dead code" },
  { id: "stale", title: "Stale comments" },
  { id: "tooling", title: "Tooling" },
];

export const GAPS: readonly Gap[] = [
  { area: "perf", severity: "high", part: "LanguageMenu panel",
    effect: "Backdrop blur on the panel and a blur filter in its motion hold Mac Chrome at 30 fps while it is open.",
    evidence: [{ file: `${W}LanguageMenu.tsx`, needle: 'filter: "blur(4px)"' }, { file: `${W}LanguageMenu.tsx`, needle: "backdrop-blur-xl" }] },
  { area: "perf", severity: "high", part: "Card sheen",
    effect: "Every job card carries a mask and a drop-shadow filter at all times, so the page is composited by hand on a Mac.",
    evidence: [{ file: CSS, needle: "-webkit-mask: linear-gradient" }, { file: CSS, needle: "filter: drop-shadow(" }] },
  { area: "perf", severity: "medium", part: "FloorLogo",
    effect: "The loading logo fades its edge with mask-image while the floor loads.",
    evidence: [{ file: `${W}HeroBits.tsx`, needle: "[mask-image:" }] },
  { area: "perf", severity: "low", part: "/tiles hint",
    effect: "The floor test page's hint pill uses backdrop blur over a live WebGL floor.",
    evidence: [{ file: "src/app/tiles/page.tsx", needle: "backdrop-blur" }] },

  { area: "a11y", severity: "high", part: "Focus",
    effect: "No part of the site styles keyboard focus, so a keyboard reader sees only the browser's own ring.",
    evidence: [{ dir: "src/components/website", absent: "focus-visible" }] },
  { area: "a11y", severity: "high", part: "ModeToggle",
    effect: "A radiogroup without arrow keys or a roving tab stop, so it does not answer the keys its role promises.",
    evidence: [{ file: `${W}ModeToggle.tsx`, absent: "ArrowRight", anchor: 'role="radiogroup"' }] },
  { area: "a11y", severity: "high", part: "Jobs tabs",
    effect: "A tablist without arrow keys or aria-controls tying each tab to its panel.",
    evidence: [{ file: `${W}Jobs.tsx`, absent: "ArrowRight", anchor: 'role="tablist"' }] },
  { area: "a11y", severity: "medium", part: "PlayerTraits",
    effect: "The trait bars carry values but no meter role, so a screen reader hears labels without amounts.",
    evidence: [{ file: `${W}PlayerTraits.tsx`, absent: "role=", anchor: "export function PlayerTraits" }] },
  { area: "a11y", severity: "medium", part: "JobTerminal",
    effect: "The whole run window is aria-hidden, so the answer each job gives is out of reach for a screen reader.",
    evidence: [{ file: `${W}JobTerminal.tsx`, needle: "aria-hidden" }] },
  { area: "a11y", severity: "medium", part: "Small targets",
    effect: "The player arrows are 36px and the carousel dots 32px tall, under the 44px a thumb needs.",
    evidence: [{ file: `${W}PlayerCarousel.tsx`, needle: "grid h-9 w-9 place-items-center" }, { file: `${W}PlayerCarousel.tsx`, needle: "grid h-8 place-items-center px-1.5" }] },
  { area: "a11y", severity: "low", part: "BackToTop",
    effect: "Hidden, it leaves the tab order but stays in the accessibility tree, with no aria-hidden or inert.",
    evidence: [{ file: `${W}BackToTop.tsx`, needle: "tabIndex={on ? 0 : -1}" }] },
  { area: "a11y", severity: "medium", part: "Glide and floor",
    effect: "The page glide, the players magnet's glide (which holds the wheel, touch and keys for its 0.6s) and the tile floor play the same under reduced motion.",
    evidence: [
      { file: `${W}glide.ts`, absent: "reduce", anchor: "export const easeOut" },
      { file: `${W}SafariScroll.tsx`, absent: "reduce", anchor: "const MAGNET = 0.6;" },
      { dir: "src/tiles", absent: "prefers-reduced-motion" },
    ] },
  { area: "a11y", severity: "medium", part: "Human / AI auto flip",
    effect: "The portrait flips between Human and AI by itself every 5s while the section is in view, under reduced motion too, and nothing on the page stops it short of the visitor picking a copy for each player.",
    evidence: [{ file: `${W}usePlayerMode.ts`, needle: "const AUTO_S = 5;" }, { file: `${W}usePlayerMode.ts`, absent: "reduce", anchor: "const AUTO_S = 5;" }] },
  { area: "a11y", severity: "low", part: "Comparison headings",
    effect: "The two names read as the cards' headings but are spans, and the section has no heading, so heading navigation skips the comparison. An h3 per name under a visually hidden h2 would carry it.",
    evidence: [{ file: `${W}Understands.tsx`, needle: 'name + " font-medium"' }, { file: `${W}Understands.tsx`, absent: "<h2", anchor: 'id="understands"' }] },
  { area: "a11y", severity: "medium", part: "Ping and pulse",
    effect: "The live dot's ping and the running dot's pulse loop on under reduced motion.",
    evidence: [{ file: `${W}Hero.tsx`, needle: "animate-ping" }, { file: `${W}Players.tsx`, needle: "bg-accent animate-pulse" }] },
  { area: "a11y", severity: "medium", part: "Accent text",
    effect: "Accent type under 24px reads under the 4.5:1 that small text needs, on the page and on the container.",
    evidence: [{ file: `${W}Header.tsx`, needle: "hover:text-accent transition-colors duration-300" }, { file: `${W}Hero.tsx`, needle: "Yours next." }] },
  { area: "a11y", severity: "medium", part: "White labels on the accent",
    effect: "Segmented, Slider, Switch, Progress, Chip and the glass Button set small white text on the accent water, just under 4.5:1. Decisions pending holds the call.",
    evidence: WHITE_ON_ACCENT.map(({ file, needle }) => ({ file, needle })) },
  { area: "a11y", severity: "medium", part: "Entrances",
    effect: "The motion/react entrances (the cards rising in, the players' panels) still travel under reduced motion, because no MotionConfig asks them to stop.",
    evidence: [
      { dir: "src/components/website", absent: "MotionConfig" },
      { dir: "src/app", absent: "MotionConfig" },
      { file: `${W}Understands.tsx`, needle: "initial: { opacity: 0, y: 28 }" },
      { file: `${W}Jobs.tsx`, needle: "initial: { opacity: 0, y: 28 }" },
      { file: `${W}Players.tsx`, needle: "initial: { opacity: 0, y: 24 }" },
    ] },

  { area: "a11y", severity: "medium", part: "Skip link",
    effect: "No skip link, so a keyboard reader tabs through the whole bar before the page on every visit.",
    evidence: [{ dir: "src/components/website", absent: "Skip to" }, { dir: "src/app/website", absent: "SkipLink" }] },
  { area: "a11y", severity: "medium", part: "Header landmark",
    effect: "The bar is a nav with no label that also holds the calls, and no tab says which section is in view.",
    evidence: [{ file: `${W}Header.tsx`, absent: "aria-label", anchor: "<nav" }, { file: `${W}Header.tsx`, absent: "aria-current", anchor: "<nav" }] },
  { area: "a11y", severity: "medium", part: "Footer stub links",
    effect: "Case Studies, Terms of Use and Privacy Policy are anchors without an href, so a keyboard never reaches them.",
    evidence: [{ file: `${W}Footer.tsx`, needle: '{ label: "Case Studies" }' }, { file: `${W}Footer.tsx`, needle: "<a className={LEGAL}>Terms of Use</a>" }] },
  { area: "a11y", severity: "low", part: "Footer heading",
    effect: "The footer's h3 has no h2 above it, so its heading level skips one.",
    evidence: [{ file: `${W}Footer.tsx`, absent: "<h2", anchor: "<h3 className=" }] },
  { area: "a11y", severity: "medium", part: "Glide focus and hash",
    effect: "The glide moves neither focus nor the URL hash, so Back does not return and a screen reader stays where it was.",
    evidence: [{ file: `${W}jump.ts`, absent: "focus(", anchor: "export function jumpTo" }, { file: `${W}jump.ts`, absent: "history.", anchor: "export function jumpTo" }] },
  { area: "a11y", severity: "medium", part: "LanguageMenu highlight",
    effect: "aria-activedescendant sits on the list, which never takes focus, so a screen reader does not follow the highlight.",
    evidence: [{ file: `${W}LanguageMenu.tsx`, needle: "aria-activedescendant={`lang-${active}`}" }] },
  { area: "a11y", severity: "low", part: "LanguageMenu ids",
    effect: "The option ids and the highlight's layoutId are not scoped per instance, so two menus on one page collide.",
    evidence: [{ file: `${W}LanguageMenu.tsx`, needle: "id={`lang-${k}`}" }, { file: `${W}LanguageMenu.tsx`, needle: 'layoutId="lang-highlight"' }] },
  { area: "a11y", severity: "low", part: "LanguageMenu Tab",
    effect: "Tab moves on and leaves the panel open.",
    evidence: [{ file: `${W}LanguageMenu.tsx`, absent: '"Tab"', anchor: "const onKey = (e: React.KeyboardEvent) => {" }] },
  { area: "a11y", severity: "low", part: "LanguageMenu rows",
    effect: "The rows carry no lang, so each language's own name is read in an English voice.",
    evidence: [{ file: `${W}LanguageMenu.tsx`, absent: "lang={", anchor: 'role="option"' }] },
  { area: "a11y", severity: "low", part: "HeroLoader label",
    effect: "The loader's slate-500 word is about 3.8:1 on the hero grey, still under the 4.5:1 text minimum.",
    evidence: [{ file: `${W}HeroLoader.tsx`, needle: "tracking-[0.18em] text-slate-500" }] },

  { area: "behaviour", severity: "medium", part: "Mobile menu rows",
    effect: "ClickLock swallows clicks on links, so a row's own handler never runs and the sheet stays open.",
    evidence: [{ file: `${W}ClickLock.tsx`, needle: 'const LOCKED = "a, [data-cta]";' }, { file: `${W}MobileMenu.tsx`, needle: "href={`#${to}`}" }] },
  { area: "behaviour", severity: "medium", part: "Page hold",
    effect: "Widening past md with the sheet open hides it but leaves the page clipped until a reload.",
    evidence: [{ file: `${W}MobileMenu.tsx`, needle: 'document.documentElement.style.overflow = on ? "clip" : "";' }] },
  { area: "behaviour", severity: "low", part: "Language in the sheet",
    effect: "The sheet mounts a fresh LanguageMenu each time it opens, so a chosen language resets to English.",
    evidence: [{ file: `${W}MobileMenu.tsx`, needle: "<LanguageMenu />" }, { file: `${W}LanguageMenu.tsx`, needle: "const [selected, setSelected] = useState(0);" }] },
  { area: "behaviour", severity: "low", part: "Header on reload",
    effect: "The scrolled state is read on scroll only, so a reload restored mid-page shows the top bar until the first scroll.",
    evidence: [{ file: `${W}Header.tsx`, needle: "const onScroll = () => setScrolled(window.scrollY > 4);" }] },

  { area: "drift", severity: "low", part: "Four navies",
    effect: "Ink, primary, terminal and the logo core sit 1 to 3 points apart under four spellings.",
    evidence: [{ dir: "src/components/website", counts: ["#0a1b33", "#0a152d", "#0b1526", "#030D2D"] }] },
  { area: "drift", severity: "low", part: "Two slate scales",
    effect: "The v3 hex slates and the v4 oklch classes both carry the muted and body roles.",
    evidence: [{ dir: "src/components/website", counts: ["#64748b", "text-slate-500", "#475569", "text-slate-600"] }] },
  { area: "drift", severity: "low", part: "Hairline alphas",
    effect: "One hairline role is written at four alphas.",
    evidence: [{ dir: "src/components/website", counts: ["slate-200/80", "slate-200/70", "slate-200/60", "slate-200/50"] }] },
  { area: "drift", severity: "medium", part: "The ease",
    effect: "The one ease is declared again in each file that uses it.",
    evidence: [{ dir: "src/components/website", counts: ["[0.22, 1, 0.36, 1]"] }] },
  { area: "drift", severity: "low", part: "Radius spellings",
    effect: "16 and 12 are each written two ways.",
    evidence: [{ dir: "src/components/website", counts: ["rounded-[16px]", "rounded-2xl", "rounded-[12px]", "rounded-xl"] }] },
  { area: "drift", severity: "low", part: "Header offsets",
    effect: "The phone bar is offset as 70px and 73px, and the md bar as 89px where its classes give about 80.",
    evidence: [{ file: `${W}Understands.tsx`, needle: "pt-[calc(70px+96px)]" }, { file: `${W}Hero.tsx`, needle: "pt-[calc(73px+40px)]" }] },
  { area: "drift", severity: "medium", part: "font-mono",
    effect: "The theme maps no --font-mono, so the player card footers fall back to the system mono, not JetBrains Mono.",
    evidence: [{ file: `${W}Players.tsx`, needle: "pt-4 font-mono text-[11px]" }, { file: CSS, absent: "--font-mono", anchor: "--font-display" }] },

  { area: "drift", severity: "low", part: "Players gutter",
    effect: "The players section takes 20px side padding on phones where every other section takes 16, so its copy sits 4px in.",
    evidence: [{ file: `${W}Players.tsx`, needle: 'className="relative px-5 md:px-16"' }] },
  { area: "drift", severity: "low", part: "Hero under-row gutter",
    effect: "The hero's under-row takes max-md:px-2 (8px) inside the page gutter where every other row takes 16.",
    evidence: [{ file: `${W}Hero.tsx`, needle: "px-8 max-md:px-2 md:px-16" }] },

  { area: "dead", severity: "low", part: "Player card max-lg classes",
    effect: "The card grid is hidden below lg, so its max-lg and max-sm classes never render.",
    evidence: [{ file: `${W}Players.tsx`, needle: "grid grid-cols-4 gap-4 max-lg:hidden" }, { file: `${W}Players.tsx`, needle: "max-lg:min-h-0 max-lg:rounded-[22px]" }] },
  { area: "dead", severity: "low", part: "Prism sweep",
    effect: "The prism branch is switched off by a constant, and it would use a blend and a blur.",
    evidence: [{ file: `${W}PrimaryCta.tsx`, needle: 'const SWEEP: "dots" | "prism" = "dots";' }, { file: `${W}PrimaryCta.tsx`, needle: '{SWEEP === "prism" && (' }] },

  { area: "stale", severity: "low", part: "Charcoal copies",
    effect: "Comments still call the AI copy charcoal, where it is now a blue hologram.",
    evidence: [{ file: "src/tiles/characters.js", needle: "its charcoal AI copy" }, { file: "src/tiles/interact.js", needle: "keeps a slight charcoal tint" }] },
  { area: "stale", severity: "low", part: "Hero waves",
    effect: "The Hero comment describes mixed waves, which Hero never asks the floor for.",
    evidence: [{ file: `${W}Hero.tsx`, needle: "the next wave's new faces in the middle" }, { file: `${W}Hero.tsx`, absent: "mixWaves", anchor: "export function Hero" }] },
  { area: "stale", severity: "low", part: "Floating tiles",
    effect: "The comment says touch screens keep the tiles still, while they still bob and flip there.",
    evidence: [{ file: `${W}FloatingBadges.tsx`, needle: "Touch screens and" }] },
  { area: "stale", severity: "low", part: "Doodle pace comment",
    effect: "The hand's pace comment says it finishes before the portrait first turns AI, but the longest drawing runs about 5.5s from the reveal, past the 5s flip.",
    evidence: [{ file: `${W}PlayerDoodles.tsx`, needle: "brisk, so it has finished before the portrait first turns AI" }] },

  { area: "tooling", severity: "medium", part: "render.cjs",
    effect: "The still renderer serves /tiles/ but not /tiles-holo/, so a render that waits for the holograms fails.",
    evidence: [{ file: "tools/tiles/render.cjs", absent: "tiles-holo", anchor: "const ROUTES = [" }] },
  { area: "tooling", severity: "low", part: "floorRough",
    effect: "The floor material reads floorRough, which the params file never sets, so three keeps its default.",
    evidence: [{ file: "src/tiles/floor-material.js", needle: "roughness: P.floorRough" }, { file: "public/tiles/floor-params.json", absent: "floorRough", anchor: "{" }] },
];

/** What no specimen or assertion here can see. Values for KeyRows. */
export const BLIND_SPOTS = [
  { key: "Forced states on shipped parts", value: "Shown live, with their per-state values written beside them." },
  { key: "Reduced motion", value: "Read from the reader's setting, never switched on by the page." },
  { key: "Mac Chrome compositing", value: "Kept as a rule in the code, the frame rate itself never measured." },
  { key: "Device GPU limits", value: "Budgeted on this page, untested on a phone." },
  { key: "Copy drift", value: "Checked only where an assertion holds the text." },
  { key: "Rendered drift", value: "Assertions read the source text, not the pixels it draws." },
  { key: "Unasserted drawers", value: "Rows written by hand against a site file carry no needle, so a site value can move with no row failing. Rows citing a system file always carry one." },
] as const;

export const SEVERITY_TONE = { high: "danger", medium: "warning", low: "neutral" } as const;
