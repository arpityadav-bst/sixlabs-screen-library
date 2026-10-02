// Shape: radius, stroke, elevation and glow, the focus ring and icon sizes. Every shadow is drawn in navy
// rgba(10,27,51,x) except the hero container's, which is the one black shadow on the site.
import { tk, type Token } from "./token-types";

const W = "components/website/";
const G = "app/globals.css";

export const RADIUS: readonly Token[] = [
  tk("radius-caret", "1px", "Caret", "The typed caret", "Controls", `${G}:106`),
  // the small-mark steps: system additions for marks and focus wraps under 12px, folded to four values
  tk("radius-mark-xs", "2px", "Link focus wrap", "The focus ring's corner round a text link", "Boxes and marks", "system"),
  tk("radius-mark-sm", "4px", "Small mark", "Checkboxes at sm and md, a text action's and the lockup's focus wrap",
    "Rows and panels", "system"),
  tk("radius-mark", "6px", "Mark", "The lg checkbox, key caps, a tab's focus wrap and its panel", "Rows and panels", "system"),
  tk("radius-bubble", "8px", "Bubble", "Tooltip and slider value bubbles, the skeleton title",
    "Panels, which take radius-sm", "system"),
  tk("radius-xs", "12px", "Rows and inset panels", "Menu rows, the tag panel, inner rows at 6px padding",
    "Cards", `${W}Jobs.tsx:184`, { utility: "rounded-[12px]" }),
  tk("radius-row", "14px", "List row", "FAQ rows and accordion cards", "Cards", `${W}Faq.tsx:33`, { utility: "rounded-[14px]" }),
  tk("radius-sm", "16px", "Panels", "The terminal window, menu panels, toasts", "Cards",
    `${W}JobTerminal.tsx:135`, { utility: "rounded-[16px]" }),
  tk("radius-md", "24px", "Cards on phones", "Job cards under md", "Desktop cards", `${W}Jobs.tsx:162`,
    { utility: "max-md:rounded-[24px]" }),
  tk("radius-lg", "28px", "Cards", "Player, job and comparison cards, dialogs, the sheen", "Rows", `${W}Jobs.tsx:162`,
    { utility: "rounded-[28px]" }),
  tk("radius-container-sm", "32px", "Container on phones", "The hero container under md", "Cards", `${W}Hero.tsx:125`,
    { utility: "max-md:rounded-[32px]" }),
  tk("radius-xl", "36px", "Comparison cards", "The comparison cards from md, the empty state and the index card",
    "Rows", `${W}Understands.tsx:22`,
    { utility: "rounded-[36px]" }),
  tk("radius-2xl", "48px", "The container", "The hero container", "Anything inside it", `${W}Hero.tsx:125`,
    { utility: "rounded-[48px]" }),
  tk("radius-full", "9999px", "Pill", "Buttons, chips, badges, dots, toggles, tabs", "Cards", `${W}PrimaryCta.tsx:100`,
    { utility: "rounded-full" }),
  tk("radius-model", "28%", "Model square", "A player model's avatar, as a share of its size",
    "People, who take radius-full", "system"),
];

export const STROKE: readonly Token[] = [
  tk("stroke-hairline", "1px", "Hairline", "Every border", "Emphasis, which takes a stronger colour", `${W}Jobs.tsx:162`),
  tk("stroke-sheen", "1.5px", "Sheen line", "The pointer light along a card", "Borders", `${G}:243`),
  tk("stroke-dot", "2px", "Dot ring", "The leader's end dot", "Borders", `${W}CopyLine.tsx:112`),
  tk("stroke-spinner", "1.75px", "Spinner ring", "The 16px spinner", "Borders", `${W}HeroBits.tsx:114`),
  tk("stroke-ring-vs", "6px", "Page ring", "The page-colour ring round the vs disc", "Anything else", `${W}Understands.tsx:87`),
];

export const SHADOW: readonly Token[] = [
  tk("shadow-container", "0 40px 100px -20px rgba(0,0,0,0.03)", "The container", "The hero container only",
    "Cards at rest on light grounds", `${W}Hero.tsx:125`),
  tk("shadow-float", "0 1px 2px rgba(10,27,51,0.06), 0 12px 28px -12px rgba(10,27,51,0.35)", "Float",
    "BackToTop, elevated icon buttons, toasts", "Cards in the flow", `${W}BackToTop.tsx:62`),
  tk("shadow-pop", "0 18px 50px -12px rgba(10,27,51,0.18)", "Pop", "Menus and select panels",
    "Cards", `${W}LanguageMenu.tsx:78`),
  tk("shadow-thumb", "0 6px 16px -8px rgba(10,27,51,0.45)", "Thumb", "The toggle and segmented thumb",
    "Cards", `${W}ModeToggle.tsx:49`),
  tk("shadow-lift", "0 1px 2px rgba(10,27,51,0.05), 0 24px 48px -24px rgba(10,27,51,0.22)", "Lift",
    "A clickable card on hover", "Rest states", `${W}Players.tsx:221`),
  tk("shadow-player", "0 24px 48px -28px rgba(10,27,51,0.35)", "Player card rest", "Player cards on blue",
    "Light grounds", `${W}Players.tsx:25`),
  tk("shadow-player-selected", "0 28px 56px -26px rgba(10,27,51,0.45)", "Player card selected",
    "The selected player card on blue", "Light grounds", `${W}Players.tsx:219`),
  tk("shadow-tooltip", "0 8px 24px -8px rgba(10,27,51,0.35)", "Bubble",
    "Tooltip and slider value bubbles: float's ink with a shorter throw, since a bubble sits on its trigger",
    "Panels", "system"),
  tk("shadow-modal", "0 40px 100px -20px rgba(10,27,51,0.28)", "Modal", "Dialogs and sheets", "Anything in the flow", "system"),
  tk("glow-caret", "0 0 10px rgba(26,109,255,0.55)", "Caret glow", "The typed caret", "Controls", `${G}:108`),
  tk("glow-sheen", "0 0 7px rgba(26,109,255,0.5)", "Sheen bloom", "The sheen's bloom, as a value only",
    "A CSS filter, which the compositor rule forbids", `${G}:253`, { css: false }),
];

export const FOCUS_TOKENS: readonly Token[] = [
  // the ring strings in focus.ts read these three, so a change here moves every ring
  tk("focus-width", "2px", "Ring width", "Every focus-visible outline", "Borders", "system"),
  tk("focus-offset", "2px", "Ring offset on controls", "Buttons, chips, links, fields with an outline", "Cards", "system"),
  tk("focus-offset-card", "3px", "Ring offset on cards", "Cards and large surfaces", "Controls", "system"),
  tk("focus-color", "#1a6dff", "Ring on light", "Page, surface and container grounds", "Blue and dark grounds", "system"),
  tk("focus-color-inverse", "#ffffff", "Ring on blue", "Controls on the players' accent ground", "Light grounds", "system"),
  tk("focus-color-dark", "#6ea8ff", "Ring on dark", "Controls on navy and the terminal", "Light grounds", "system"),
  tk("focus-offset-inset", "-2px", "Ring offset inside", "Items in a scroll row, whose overflow would clip the ring",
    "Controls with room round them", "system"),
  tk("focus-halo", "0 0 0 3px var(--ds-color-focus-halo)", "Field halo", "A focused text field, in place of the outline",
    "Buttons", "system"),
  tk("focus-halo-danger", "0 0 0 3px var(--ds-color-danger-halo)", "Invalid field halo",
    "An invalid field, at rest and under focus, where focus adds the outline", "Valid fields", "system"),
];

// uses by role, not by the text beside them: Tag sets a 16 by its 13px label, an xs Button a 14 by its 12px one
const ICON: readonly (readonly [number, number, string])[] = [
  [12, 2.25, "Badges"], [14, 2, "xs controls, chip check and remove, inline with 13px text"],
  [16, 1.75, "List leads (a Tag, a menu row), sm and md controls"],
  [18, 1.75, "In 40 and 44 boxes, beside lg and xl pill labels"],
  [20, 1.6, "In a 48 box (the xl icon button)"], [24, 1.5, "Standalone, the terminal pointer"],
];

/** Icon size and its stroke: the rendered stroke is 1.13 to 1.33px at 12 to 20, and 1.5 at a standalone 24. */
export const ICONS: readonly Token[] = ICON.flatMap(([px, stroke, use]) => [
  tk(`icon-${px}`, `${px}px`, `Icon ${px}`, use, "Sizes between steps (17 and 22 on the site normalise)", "system"),
  tk(`icon-${px}-stroke`, String(stroke), `Stroke at ${px}`, `lucide strokeWidth at ${px}px`, "Other sizes", "system"),
]);

export type IconSize = 12 | 14 | 16 | 18 | 20 | 24;

/** strokeWidth for a lucide icon at a ladder size, read from the ladder above. */
export const ICON_STROKE = Object.fromEntries(ICON.map(([px, stroke]) => [px, stroke])) as Readonly<
  Record<IconSize, number>
>;

/** The busy rings' line weights, by size, in one table: the Spinner's border (16 is stroke-spinner, the wave
 *  button's 1.75) and ProgressCircle's stroke. Component values that grow with the size, so the ring keeps
 *  its weight. A busy control takes the spinner of its icon size rounded down to this ladder. */
export const SPINNER_BORDER: Readonly<Record<8 | 12 | 16 | 20 | 24, number>> = { 8: 1, 12: 1.5, 16: 1.75, 20: 2, 24: 2 };
export const CIRCLE_STROKE: Readonly<Record<16 | 24 | 40 | 64, number>> = { 16: 2, 24: 2.5, 40: 3, 64: 4 };
