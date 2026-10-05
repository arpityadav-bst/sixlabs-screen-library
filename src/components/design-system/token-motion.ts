// Motion: the eases, the duration ladder by job, the springs, the press and grow scales and the travel
// distances. The JS forms new components read (EASE, DUR, SPRING, SCALE, RISE) are exported from motion.ts
// and are built from these values.
import { tk, type Token } from "./token-types";

const W = "components/website/";

/** The one ease, cubic-bezier(0.22, 1, 0.36, 1). The site declares it 9 times as a local const. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SWEEP = [0.45, 0, 0.25, 1] as const;

export const EASES: readonly Token[] = [
  tk("ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "The ease", "Every entrance, panel, bar and settle",
    "Loops, which run linear or ease-in-out", `${W}Players.tsx:23`),
  tk("ease-out-tw", "cubic-bezier(0, 0, 0.2, 1)", "Tailwind ease-out", "The hero's opacity fades only",
    "New work, which takes ease-out", `${W}Hero.tsx:37`, { utility: "ease-out" }),
  tk("ease-in-out", "cubic-bezier(0.65, 0, 0.35, 1)", "In-out cubic", "The Human / AI sweep and the tile flip",
    "Entrances", `${W}PortraitSwap.tsx:187`),
  tk("ease-sweep", "cubic-bezier(0.45, 0, 0.25, 1)", "CTA sweep", "The primary button's dot band run",
    "Anything else", `${W}PrimaryCta.tsx:85`),
  tk("ease-in", "cubic-bezier(0.4, 0, 1, 1)", "Ease in", "Exits and the badge flip's first half",
    "Entrances", `${W}FloatingBadges.tsx:138`),
  tk("ease-linear", "linear", "Linear", "Loops, spinners, load bars", "Anything that settles", `${W}HeroBits.tsx:114`),
  tk("ease-glide", "cubic-bezier(0.33, 1, 0.68, 1)", "Glide", "In-page link glides (1 - (1 - k)^3)",
    "UI transitions", `${W}glide.ts:10`),
];

export const DURATIONS: readonly Token[] = [
  tk("dur-press", "120ms", "Press", "A press settling, a field growing a line, a tooltip leaving", "Colour changes",
    "system"),
  tk("dur-exit", "140ms", "Exit", "A menu or panel closing, every overlay's fade under reduced motion", "Entrances",
    `${W}LanguageMenu.tsx:23`),
  tk("dur-quick", "160ms", "Quick", "A tooltip arriving, a toast leaving, a chip collapsing, an icon swap",
    "Hover colour, which takes dur-ui", "system"),
  tk("dur-ui", "200ms", "UI colour", "Hover colour on controls, chip checks, label reveals", "Lines and lifts",
    `${W}Header.tsx:102`, { utility: "duration-200" }),
  tk("dur-menu", "250ms", "Menu", "The mobile sheet and its veil", "Panels", `${W}MobileMenu.tsx:79`),
  tk("dur-line", "300ms", "Line and lift", "Links, borders, card lifts, the FAQ row", "Colour on small controls",
    `${W}Header.tsx:86`, { utility: "duration-300" }),
  tk("dur-panel", "350ms", "Panel", "An accordion answer opening, a detail swap", "Hover", `${W}Faq.tsx:65`),
  tk("dur-sheen", "400ms", "Sheen", "The card sheen fading in", "Hover colour", "app/globals.css:260"),
  tk("dur-exit-long", "450ms", "Long exit", "Loaders leaving, a live count settling", "Controls", `${W}HeroBits.tsx:65`),
  tk("dur-reveal", "500ms", "Reveal", "The players reveal and portrait swap", "Controls", `${W}Players.tsx:88`),
  tk("dur-numbers", "600ms", "Numbers", "The hero numbers rising", "Controls", `${W}HeroBits.tsx:35`),
  tk("dur-rise", "700ms", "Rise", "Section entrances and trait bars", "Controls", `${W}Understands.tsx:48`),
  tk("dur-tiles", "900ms", "Tiles", "The tile floor rising in", "UI", "tiles/intro.js:12"),
  tk("dur-sweep", "1000ms", "Sweep", "The primary button's dot band", "UI colour", `${W}PrimaryCta.tsx:22`),
  tk("dur-swap", "1500ms", "Swap", "The Human / AI sweep up the portrait", "UI", `${W}PortraitSwap.tsx:19`),
  tk("dur-shimmer", "1600ms", "Shimmer", "The skeleton shimmer's pass", "Anything that settles", "system"),
];

/** Spring values, as motion/react takes them. The SPRINGS tokens below are written from these. */
export const SPRING_VALUES = {
  press: { stiffness: 400, damping: 25 },
  thumb: { stiffness: 500, damping: 40 },
  pop: { stiffness: 460, damping: 34, mass: 0.7 },
  drift: { stiffness: 60, damping: 18 },
} as const;

type SpringValue = { stiffness: number; damping: number; mass?: number };
const spring = (s: SpringValue) =>
  `stiffness ${s.stiffness}, damping ${s.damping}` + (s.mass ? `, mass ${s.mass}` : "");

export const SPRINGS: readonly Token[] = [
  tk("spring-press", spring(SPRING_VALUES.press), "Press", "Button grow and press, icon button press",
    "Panels", `${W}PrimaryCta.tsx:99`, { css: false }),
  tk("spring-thumb", spring(SPRING_VALUES.thumb), "Thumb", "Toggle and segmented thumbs, selected checks",
    "Panels", `${W}ModeToggle.tsx:50`, { css: false }),
  tk("spring-pop", spring(SPRING_VALUES.pop), "Pop", "Menus, select panels, toasts, dialogs",
    "Presses", `${W}LanguageMenu.tsx:17`, { css: false }),
  tk("spring-drift", spring(SPRING_VALUES.drift), "Drift", "The floating badges following the pointer",
    "Controls", `${W}FloatingBadges.tsx:39`, { css: false }),
];

/** The press and grow ladder, one scale per job. Classes read the presses as --ds-scale-*, the panel and
 *  the grows are motion values only (css false). SCALE in motion.ts is built from these. */
export const SCALES: readonly Token[] = [
  tk("scale-press-mark", "0.92", "Mark press", "Choice marks under a held press", "Whole controls", "system"),
  tk("scale-press-round", "0.94", "Round press", "Round small targets: icon buttons, avatars, the toast close",
    "Pills, which take scale-press-pill", "system"),
  tk("scale-press-pill", "0.97", "Pill press", "Pills, chips, segments, tabs and text actions", "Whole cards",
    `${W}PrimaryCta.tsx:97`),
  tk("scale-press-card", "0.985", "Card press", "Whole cards and the index card", "Small targets", "system"),
  tk("scale-panel", "0.96", "Panel scale", "Menus, select panels, tooltips, toasts and dialogs arriving and leaving",
    "Presses", "system", { css: false }),
  tk("scale-grow", "1.02", "Grow", "A solid pill growing on hover below lg", "Cards", "system", { css: false }),
  tk("scale-grow-large", "1.04", "Large grow", "A solid pill growing on hover from lg, as Try now does", "Cards",
    `${W}PrimaryCta.tsx:96`, { css: false }),
];

export const TRAVEL: readonly Token[] = [
  tk("rise-y", "28px", "Entrance travel", "Section entrances", "Controls", `${W}Understands.tsx:45`),
  tk("reveal-y", "24px", "Reveal travel", "The players reveal", "Controls", `${W}Players.tsx:86`),
  tk("numbers-y", "6px", "Small rise", "The hero numbers, small content swaps", "Sections", `${W}HeroBits.tsx:33`),
  tk("lift-y", "2px", "Hover lift", "Cards and floating buttons on hover", "Text", `${W}BackToTop.tsx:62`),
  tk("loop-max", "8px", "Loop ceiling", "The most an ambient loop may travel", "Entrances", "system"),
];
