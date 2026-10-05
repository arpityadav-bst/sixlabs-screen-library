// Data for Loading, empty and failure: the copy (obvious filler where the site has no words, quoted where
// it has, through the Assertion that holds it), the pins, the banner's state grid and the drawer rows. The
// job tags' icons come from badge-tag-data (tagsOf), the one map held to Jobs.tsx.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { BannerTone } from "@/components/design-system/Banner";
import { site, system } from "../foundations/foundation-assert";
import { pr, sv, tv } from "../components/display-values";
import { read, rv } from "./pattern-values";

const W = "components/website/";
const D = "components/design-system/";

export const FALLBACK = {
  note: "The live floor is not available on this device.",
  still: "/brand/sixlabs-mark-floor.webp",
} as const;

/** The container's social proof line, quoted from Hero.tsx:243-247. */
export const PROOF = {
  line: "One million players have a copy.",
  next: "Yours next.",
  held: site("Hero.tsx", "One million players have a copy.", "Yours next."),
} as const;

export const OFFLINE = {
  title: "You are offline.",
  body: "The page shows what it loaded before the connection dropped.",
  retry: "Retry",
} as const;

export const FAILED = {
  title: "The jobs did not load",
  body: "The rest of the page is here. Trying again loads only this row.",
  retry: "Try again",
} as const;

/** One banner per tone, each with obvious filler copy. */
export const BANNER_TONES: readonly { tone: BannerTone; title: string; body: string }[] = [
  { tone: "offline", title: OFFLINE.title, body: OFFLINE.body },
  { tone: "info", title: "A new build is out.", body: "Reload to see it." },
  { tone: "success", title: "Back online.", body: "Everything on the page is current." },
  { tone: "warning", title: "This view is out of date.", body: "Some numbers are from an earlier run." },
  { tone: "danger", title: "Saving failed.", body: "Your changes are kept on this device." },
];

export const BANNER_STATES = ["rest", "hover", "focus-visible", "pressed", "loading"] as const;
export const BANNER_PARTS = ["action", "close"] as const;

const F = '[data-pin="fallback"]';

export const FALLBACK_PINS: readonly AnatomyPin[] = [
  { selector: F, name: "Container", token: "--ds-color-container", value: "the hero's box, 664 (720), unchanged", source: "Hero.tsx:125", expect: "h-[664px] max-md:h-[720px]", side: "left" },
  { selector: `${F} img`, name: "Still mark", value: "the floor mark at 60%, tilted, not turning", source: "HeroBits.tsx:152", expect: "floor-spin w-full h-full opacity-60", side: "right" },
  { selector: `${F} p:first-of-type`, name: "Headline", value: "the same copy, in place from the first paint", source: "Hero.tsx:190", expect: "Making", side: "left" },
  { selector: '[data-pin="cta"]', name: "Try now", value: "still the one primary", source: "Hero.tsx:231", expect: "<PrimaryCta>Try now</PrimaryCta>", side: "left" },
  { selector: '[data-pin="note"]', name: "Note", token: "--ds-color-text-body", value: "13px · one quiet line under the CTA", source: "system-states.module.css:81", expect: "margin: 16px 0 0;", side: "right" },
  { selector: '[data-pin="proof"]', name: "Social proof", value: "the live dot held still · 13px · mt 32 (24)", source: "Hero.tsx:236", expect: "mt-8 max-md:mt-6 grid grid-cols-[8px_1fr]", side: "right" },
  { selector: '[data-pin="numbers"]', name: "Numbers", value: "the under-row's HeroNumbers, centred", source: "Hero.tsx:105", expect: "{numbers(false)}", side: "right" },
];

export const BANNER_PINS: readonly AnatomyPin[] = [
  { selector: '[data-pin="banner"] [role="status"]', name: "Row", token: "--ds-radius-sm", value: "radius 16 · px 16 py 12 · hairline", source: "banner-styles.ts:9", expect: "rounded-(--ds-radius-sm) border px-4 py-3", padding: true, side: "left" },
  { selector: '[data-pin="banner"] [role="status"] svg', name: "Icon", value: "16 · the tone's colour", source: "Banner.tsx:70", expect: "size={16}", side: "left" },
  { selector: '[data-pin="banner"] [role="status"] p', name: "Copy", value: "14/20 · title 500, body #475569", source: "banner-styles.ts:37", expect: "text-(--ds-color-ink)", side: "left" },
  { selector: '[data-pin="banner"] [role="status"] button', name: "Retry", value: "secondary sm · busy while it runs", source: "Banner.tsx:79", expect: "variant=\"secondary\" size=\"sm\"", side: "right" },
  { selector: '[data-pin="banner"] h4', name: "Error in place", value: "EmptyState error where the row was", source: "EmptyState.tsx:55", expect: "export function EmptyState", side: "right" },
];

export const BANNER_VALUES = [
  tv("Radius", "radius-sm"),
  tv("Hairline", "color-line"),
  tv("Ground", "color-surface"),
  tv("Danger ground", "color-danger-tint"),
  tv("Danger line", "color-danger-line"),
  tv("Warning ground", "color-warning-tint"),
  sv("Padding", "px 16 · py 12 · gap 12", `${D}banner-styles.ts:9`, undefined, "gap-3 rounded-(--ds-radius-sm) border px-4 py-3"),
  sv("Copy", "14/20 · title 500 ink · body #475569", `${D}banner-styles.ts:9, 37-39`, undefined, "text-[14px] leading-5",
    'BANNER_TEXT = "min-w-0 flex-1 text-(--ds-color-ink)', 'BANNER_TITLE = "font-medium"', 'BANNER_BODY = "text-(--ds-color-text-body)"'),
  { ...sv("Icon", "16 · accent on info, muted on offline, status colour otherwise", `${D}banner-styles.ts:21-27, Banner.tsx:70`),
    assert: [system("banner-styles.ts", 'info: "text-(--ds-color-accent)"', 'offline: "text-(--ds-color-text-muted)"', 'success: "text-(--ds-color-success)"',
      'warning: "text-(--ds-color-warning)"', 'danger: "text-(--ds-color-danger-ink)"'), system("Banner.tsx", "<Icon icon={glyph} size={16} />")] },
  sv("Under 480", "the actions wrap under the copy, in line past the icon", `${D}banner-styles.ts:10, 41`, undefined,
    "max-[480px]:flex-wrap", "max-[480px]:ml-7"),
  sv("Role", "danger is an alert, every other tone a polite status", `${D}Banner.tsx:65`, undefined,
    'const urgent = tone === "danger";', 'role={urgent ? "alert" : "status"}'),
] as const;

export const BANNER_PROPS = [
  pr("tone", '"info" | "offline" | "warning" | "danger" | "success"', '"info"'),
  pr("title", "string", undefined, "a short sentence. It ends with a full stop"),
  pr("body", "ReactNode"),
  pr("icon", "LucideIcon", undefined, "replaces the tone's icon"),
  pr("action", "{ label, onClick?, loading? }", undefined, "a secondary sm Button"),
  pr("dismissible", "boolean", "false", "shows the close. Leave it off while the condition holds"),
  pr("onDismiss", "() => void"),
  pr("forceAction", "ForceState"),
  pr("forceClose", "ForceState"),
];

export const BANNER_CODE = `import { Banner } from "@/components/design-system/Banner";

<Banner
  tone="offline"
  title="You are offline."
  body="The page shows what it loaded before the connection dropped."
  action={{ label: "Retry", onClick: retry, loading: retrying }}
/>`;

export const FALLBACK_VALUES = [
  tv("Note colour", "color-text-body"),
  rv("Note size", "caption"),
  read("Still", "the floor mark, opacity 0.6, perspective(2400px) rotateX(50deg), no spin", `${W}HeroBits.tsx:148`, undefined, 'src="/brand/sixlabs-mark-floor.webp"', "floor-spin w-full h-full opacity-60"),
  read("Spin today", "90s a turn while the floor loads, removed in the fallback", "app/globals.css:38", undefined, "@keyframes floor-spin", "animation: floor-spin 90s linear infinite;"),
  read("Gives up", "12s without a floor", `${W}hero-intro.ts:19`, undefined, "const GIVE_UP = 12;"),
  read("Note gap", "16 under Try now", "app/design-system/sections/patterns/system-states.module.css:81", undefined, ".ds-fb-note {", "margin: 16px 0 0;"),
  read("Left out", "the scroll cue and the wave button, since a wave has no floor to land on", `${W}Hero.tsx:101`, undefined, "<ScrollCue />", "{wave}"),
] as const;

export const LOADING_VALUES = [
  sv("Skeleton", "the job card's composite, same box as the card it stands for", "sections/components/loading-composites.tsx:7"),
  tv("Shimmer", "dur-shimmer"),
  sv("Busy", "aria-busy on the group, a hidden Loading", `${D}Skeleton.tsx:52, 61-62`, undefined, 'label = "Loading",',
    '<div aria-busy="true"', '<span className="sr-only">{label}</span>'),
] as const;
