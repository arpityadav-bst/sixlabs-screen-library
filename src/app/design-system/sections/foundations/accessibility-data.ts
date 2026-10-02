// Accessibility baseline: target sizes, the keyboard model per pattern (each row names the system part
// that carries it), and the semantics rules. The site's own misses live in Meta, not here.
import type { ReactNode } from "react";
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";

export const TARGET_MIN = 24;
export const TARGET_TOUCH = 44;

export type Target = { select: string; name: string; index?: number };

/** System parts at the low end of their ladders. Stable arrays, so the meter measures once per change. */
export const SYS_TARGETS = {
  iconXs: [{ select: "button", name: "IconButton xs" }],
  chipSm: [{ select: "button", name: "Chip sm" }],
  iconLg: [{ select: "button", name: "IconButton lg" }],
} as const satisfies Record<string, readonly Target[]>;

/** The site's controls under the touch size, measured where they ship. */
export const SITE_TARGETS = {
  arrow: [{ select: "[aria-label='Previous player']", name: "Player arrow" }],
  dots: [
    { select: "button[aria-current='false']", name: "Carousel dot" },
    { select: "button[aria-current='true']", name: "Current dot" },
  ],
  wave: [{ select: "button", name: "Bare wave button" }],
} as const satisfies Record<string, readonly Target[]>;

/** The site's menu button, its cited line held to the expect at build. */
export const BURGER_PINS: readonly (AnatomyPin & { expect: string })[] = [
  { selector: "button[aria-label='Open menu']", name: "Menu button", token: "--ds-radius-full",
    value: "40 × 40 circle · 4 short of 44", source: "MobileMenu.tsx:53", expect: "grid h-10 w-10 place-items-center rounded-full" },
];

export const TARGET_VALUES: readonly ValueRow[] = [
  { part: "Minimum", value: `${TARGET_MIN} × ${TARGET_MIN}, or 24px clear round a smaller one`, source: "WCAG 2.2 · 2.5.8" },
  { part: "Touch", value: `${TARGET_TOUCH} × ${TARGET_TOUCH}`, source: "WCAG 2.2 · 2.5.5" },
  { part: "Carousel dot", value: "18 × 32, the current one 36 × 32", source: "PlayerCarousel.tsx:104" },
  { part: "Player arrow", value: "36 × 36", source: "PlayerCarousel.tsx:15" },
  { part: "Bare wave button", value: "24 × 24", source: "HeroBits.tsx:97" },
  { part: "Menu button", value: "40 × 40, phones only", source: "MobileMenu.tsx:53" },
  { part: "Floating Back to top", value: "44 × 44, 40 × 40 under md", source: "BackToTop.tsx:62" },
  { part: "Smallest system targets", value: "Button xs, IconButton xs and Chip sm at 28", source: "button-styles.ts:27" },
];

export const KEY_COLUMNS = ["Pattern", "Keys", "Focus", "System part"];

const ROWS: readonly (readonly [string, string, string, string])[] = [
  ["Button", "Enter or Space presses", "stays on the button", "Button, IconButton"],
  ["Link", "Enter follows", "moves with the page", "TextLink"],
  ["Toggle", "Enter or Space flips aria-pressed", "stays on the control", "Button selected, Chip filter"],
  ["Checkbox, switch", "Space toggles", "stays on the control", "Checkbox, Switch"],
  ["Radio group", "one Tab stop on the checked radio, arrows move and select, the set wraps", "moves with the choice",
    "Radio, Segmented"],
  ["Tab list", "one Tab stop, Left and Right move, Home and End jump, Enter or Space selects in manual mode",
    "Tab leaves for the panel", "Tabs"],
  ["Listbox", "Enter, Space or Down opens, arrows move, Enter picks, Escape closes, typing jumps",
    "back to the trigger on close", "Select"],
  ["Combobox", "typing filters, Down and Up move, Enter picks, Escape clears the query and closes the list", "stays in the field",
    "SearchField"],
  ["Accordion", "each header is a button, Enter or Space opens it, Up, Down, Home and End move between headers",
    "stays on the header", "Accordion"],
  ["Dialog", "focus moves in on open, Tab stays in the dialog, the browser's own controls aside, Escape closes",
    "back to the opener on close", "Dialog"],
  ["Toast", "Alt+T moves focus to the front toast's first control, Enter or Space presses it", "stays on the toast",
    "Toaster, Toast"],
  ["Slider", "arrows step, Page Up and Down move a tenth, Home and End reach the ends", "stays on the thumb", "Slider"],
];

export const KEY_ROWS: readonly ReactNode[][] = ROWS.map((r) => [...r]);

export const SEMANTIC_ROWS: readonly KeyRow[] = [
  { key: "Values", value: "A bar that reports a quantity is a meter (min, max, now and a spoken value). A bar that tracks work is a progressbar.",
    source: "Progress.tsx" },
  { key: "Decorative windows", value: "A visual that plays on its own is aria-hidden, and one visually hidden sentence says what it shows.",
    source: "JobTerminal.tsx:134" },
  { key: "Live regions", value: "aria-live speaks only what the visitor asked for, such as a toast after their action. Loops, typed words and counters stay silent." },
  { key: "Icons", value: "A decorative icon is aria-hidden. An icon-only control carries its name in label, which IconButton requires.",
    source: "Icon.tsx:53" },
  { key: "Busy", value: "A working control sets aria-busy and keeps its name, and its spinner is decorative.", source: "Button.tsx:102" },
  { key: "State", value: "Two states are aria-pressed, one of a set is aria-checked, a panel it opens is aria-expanded." },
  { key: "Motion", value: "Under prefers-reduced-motion loops stop and travel drops to none, while state still changes." },
  { key: "Forced colours", value: "Rings switch to Highlight and every control keeps a 1px border, so shapes survive the system palette.",
    source: "focus.ts:11" },
];
