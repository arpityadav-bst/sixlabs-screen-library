// UI colour roles. Each mirrors the value the site writes (raw hex or a Tailwind class, cited by file:line
// from src/), or is a system addition where the site has none (status, the field line, the modal veil).
// Tailwind v4 slate classes resolve to oklch, so their value is the oklch and srgb carries the hex.
import { tk, type Token } from "./token-types";

const W = "components/website/";
const G = "app/globals.css";

export const ACCENT: readonly Token[] = [
  tk("color-accent", "#1a6dff", "The brand accent",
    "Accent words, links on hover, dots, the caret, the focus ring and the players' water",
    "Selected or checked fills, and any fill outside the players section", `${G}:9`, { utility: "text-accent" }),
  tk("color-accent-glow-55", "rgb(26 109 255 / 0.55)", "Caret glow", "The typed caret's 10px glow",
    "Text, lines or fills", `${G}:108`),
  tk("color-accent-glow-50", "rgb(26 109 255 / 0.5)", "Sheen bloom", "The card sheen's 7px bloom",
    "Text, lines or fills", `${G}:253`),
  tk("color-accent-glow-30", "rgb(26 109 255 / 0.3)", "Sheen falloff", "The sheen's radial stop at 34%",
    "Text, lines or fills", `${G}:254`),
  tk("color-accent-glow-28", "rgb(26 109 255 / 0.28)", "Players glow core", "The radial glow behind the players",
    "Any light ground", `${W}Players.tsx:108`),
  tk("color-accent-glow-08", "rgb(26 109 255 / 0.08)", "Players glow edge", "The players glow at 55%",
    "Any light ground", `${W}Players.tsx:108`),
  tk("color-accent-ping", "rgb(26 109 255 / 0.4)", "Live dot halo", "The ping ring round a live dot",
    "Fills larger than a dot", `${W}Hero.tsx:238`, { utility: "bg-accent/40" }),
];

export const INK: readonly Token[] = [
  tk("color-ink", "#0a1b33", "Primary text and icons",
    "Headings, body ink, icons, the wordmark and the ink of every shadow", "Solid fills, which take color-primary",
    `${W}Header.tsx:73`, { utility: "text-[#0a1b33]" }),
  tk("color-ink-70", "rgb(10 27 51 / 0.7)", "Quiet control ink", "Icon and label on the white wave pill",
    "Body copy", `${W}HeroBits.tsx:96`, { utility: "text-[#0a1b33]/70" }),
  tk("color-ink-45", "rgb(10 27 51 / 0.45)", "Guide key line", "The touch-target key in Accessibility",
    "Any text a reader must read", "system"),
  tk("color-ink-40", "rgb(10 27 51 / 0.4)", "Guide outline",
    "Dashed guide outlines, full-view keys and the clear-space box", "Body copy", "system"),
  tk("color-ink-30", "rgb(10 27 51 / 0.3)", "Leader line", "The footer copy line's leader, the vs word",
    "Text a reader must read (the vs is decorative and aria-hidden)", `${W}CopyLine.tsx:111`,
    { utility: "bg-[#0a1b33]/30" }),
  tk("color-ink-20", "rgb(10 27 51 / 0.2)", "Menu veil", "The veil behind the mobile menu",
    "A modal veil, which takes color-veil-modal", `${W}MobileMenu.tsx:72`, { utility: "bg-[#0a1b33]/20" }),
  tk("color-ink-15", "rgb(10 27 51 / 0.15)", "Unlit words", "Scroll line words before they fill",
    "Any text a reader must read now", `${W}ScrubLine.tsx:136`, { utility: "text-[#0a1b33]/15" }),
  tk("color-ink-08", "rgb(10 27 51 / 0.08)", "Hairline on a tinted ground", "The hero foot and footer tail rules",
    "Lines on white, which take color-line", `${W}Footer.tsx:85`, { utility: "border-[#0a1b33]/[0.08]" }),
];

export const PRIMARY: readonly Token[] = [
  tk("color-primary", "#0a152d", "The solid primary fill",
    "Try now, the selected tab, checked, pressed and selected fills, the 6labs card",
    "Text, which takes color-ink", `${W}PrimaryCta.tsx:20`),
  tk("color-primary-hover", "#0c1e42", "Primary fill on hover", "The primary moved 10% toward the accent",
    "A rest fill", `${W}PrimaryCta.tsx:21`),
];

export const GROUNDS: readonly Token[] = [
  tk("color-page", "#f9fafb", "The page ground", "The page, the ring round the vs disc, the grain's fade",
    "Cards and controls, which take color-surface", `${G}:13`, { utility: "bg-[rgb(var(--page-rgb))]" }),
  tk("color-page-92", "rgb(249 250 251 / 0.92)", "Header strip", "The fixed header over the page",
    "Panels that need to hide what is under them", `${W}Header.tsx:59`),
  tk("color-surface", "#ffffff", "Cards and controls", "Job cards, FAQ rows, BackToTop, the tab rail, sheets",
    "The page ground", `${W}Jobs.tsx:162`, { utility: "bg-white" }),
  tk("color-container", "#e3e5e8", "The hero container look", "The hero container and the ChatGPT card",
    "Controls inside it, which take color-surface", `${W}Hero.tsx:122`, { utility: "bg-[#e3e5e8]" }),
  tk("color-surface-sunken", "#f6f7f9", "Inset panel", "The jobs tag panel and disabled fields",
    "A raised card", `${W}Jobs.tsx:184`, { utility: "bg-[#f6f7f9]" }),
  tk("color-footer", "rgb(0 0 0 / 0.04)", "Footer ground", "Laid over the page under the footer",
    "Any other surface", `${W}Footer.tsx:26`, { utility: "bg-black/[0.04]" }),
  tk("color-footer-tail", "rgb(0 0 0 / 0.04)", "Footer tail",
    "Laid over the footer ground, so the tail reads 8%. color-footer's value, named apart for its own job",
    "Any other surface", `${W}Footer.tsx:85`, { utility: "bg-black/[0.04]" }),
  tk("color-surface-95", "rgb(255 255 255 / 0.95)", "Menu panel", "The language panel, solid enough to read on",
    "A panel that would need blur to read", `${W}LanguageMenu.tsx:78`, { utility: "bg-white/95" }),
  tk("color-surface-90", "rgb(255 255 255 / 0.9)", "Pill on the container", "The wave pill and outline icon buttons",
    "Cards", `${W}HeroBits.tsx:96`, { utility: "bg-white/90" }),
  tk("color-surface-85", "rgb(255 255 255 / 0.85)", "Chip on the footer", "The footer copy line's chips",
    "Cards", `${W}CopyLine.tsx:105`, { utility: "bg-white/85" }),
  tk("color-surface-70", "rgb(255 255 255 / 0.7)", "Outline hover fill", "Sign in and secondary buttons on hover",
    "A rest fill", `${W}Header.tsx:102`, { utility: "hover:bg-white/70" }),
];

export const FILLS: readonly Token[] = [
  tk("color-fill-hover", "oklch(98.4% 0.003 247.858)", "White control on hover", "BackToTop and elevated icon buttons",
    "A selected fill", `${W}BackToTop.tsx:62`, { utility: "hover:bg-slate-50", srgb: "#f8fafc" }),
  tk("color-fill-highlight", "oklch(96.8% 0.007 247.896)", "List highlight", "The active row of a menu, neutral badges",
    "A selected fill, which takes color-primary", `${W}LanguageMenu.tsx:93`, { utility: "bg-slate-100", srgb: "#f1f5f9" }),
  tk("color-fill-open", "oklch(92.9% 0.013 255.508 / 0.6)", "Open or quiet hover fill",
    "An open trigger, ghost hover", "Cards and selected fills, which take color-primary", `${W}LanguageMenu.tsx:59`,
    { utility: "bg-slate-200/60", srgb: "#e2e8f0 at 60%" }),
  tk("color-skeleton", "oklch(92.9% 0.013 255.508 / 0.7)", "Skeleton fill",
    "Skeleton shapes on white and the page. color-line-soft's value, named apart so a fill never reads as a line",
    "Lines, which take color-line", "system", { srgb: "#e2e8f0 at 70%" }),
  tk("color-skeleton-container", "rgb(255 255 255 / 0.55)", "Skeleton on the container",
    "Skeleton shapes on the container grey", "White grounds, where it vanishes", "system"),
  tk("color-shimmer", "rgb(255 255 255 / 0.6)", "Shimmer light", "The band crossing a skeleton", "Fills", "system"),
];

export const TEXT: readonly Token[] = [
  tk("color-text-body", "#475569", "Secondary body", "The hero lede, the social proof line, FAQ answers",
    "Headings, which take color-ink", `${W}Faq.tsx:68`, { utility: "text-[#475569]" }),
  tk("color-text-muted", "#64748b", "Muted text", "Stat labels, card taglines, sublines, the footer base",
    "Long reading at 14px and under on the container", `${W}Jobs.tsx:109`, { utility: "text-[#64748b]" }),
  tk("color-text-quiet", "oklch(70.4% 0.04 256.788)", "Quiet text", "Eyebrow caps, quiet icons, card status",
    "Anything a reader must read, since it is under 3:1 on white", `${W}ScrollCue.tsx:21`,
    { utility: "text-slate-400", srgb: "#90a1b9" }),
];

export const LINES: readonly Token[] = [
  tk("color-line", "oklch(92.9% 0.013 255.508 / 0.8)", "Hairline", "Card, row and control borders at rest",
    "A field border, which must reach 3:1", `${W}Jobs.tsx:162`, { utility: "border-slate-200/80", srgb: "#e2e8f0 at 80%" }),
  tk("color-line-soft", "oklch(92.9% 0.013 255.508 / 0.7)", "Hairline on a panel", "The language panel, the card meta rule",
    "New work, which takes color-line", `${W}LanguageMenu.tsx:78`, { utility: "border-slate-200/70", srgb: "#e2e8f0 at 70%" }),
  tk("color-line-faint", "oklch(92.9% 0.013 255.508 / 0.5)", "Hairline on the container", "The hero container and ChatGPT card",
    "Lines on white", `${W}Hero.tsx:125`, { utility: "border-slate-200/50", srgb: "#e2e8f0 at 50%" }),
  tk("color-line-strong", "oklch(86.9% 0.022 252.894)", "Firm hairline", "Hover and open borders, Sign in, link underlines",
    "A field border", `${W}Header.tsx:102`, { utility: "border-slate-300", srgb: "#cad5e2" }),
  tk("color-line-scrolled", "oklch(86.9% 0.022 252.894 / 0.8)", "Header rule once scrolled", "The header's foot",
    "New work", `${W}Header.tsx:60`, { utility: "border-slate-300/80", srgb: "#cad5e2 at 80%" }),
  tk("color-line-hover", "#b7c0cb", "Outline hover border", "Sign in and secondary buttons on hover",
    "A rest border", `${W}Header.tsx:102`, { utility: "hover:border-[#b7c0cb]" }),
  tk("color-line-divider", "oklch(96.8% 0.007 247.896)", "Row divider", "Rows of the mobile menu",
    "Card borders", `${W}MobileMenu.tsx:91`, { utility: "border-slate-100", srgb: "#f1f5f9" }),
  tk("color-line-field", "#848fa1", "Field border", "Text fields and checkboxes, 3.26:1 on white",
    "Card borders, since it is too strong for them", "system"),
];

export const STATUS: readonly Token[] = [
  tk("color-danger", "#d92d20", "Danger", "Invalid borders, destructive fills, the danger dot",
    "Text under 18px, which takes color-danger-ink", "system"),
  tk("color-danger-ink", "#b42318", "Danger text", "Error messages and destructive labels", "Fills", "system"),
  tk("color-danger-line", "rgb(217 45 32 / 0.35)", "Danger outline", "The destructive button's border",
    "Text", "system"),
  tk("color-danger-tint", "rgb(217 45 32 / 0.08)", "Danger tint", "Danger badges, destructive hover", "Text", "system"),
  tk("color-danger-halo", "rgb(217 45 32 / 0.16)", "Invalid field halo", "The 3px halo of an invalid field",
    "Anything but fields", "system"),
  tk("color-success", "#15803d", "Success", "Success text, badges and dots", "Fills larger than a badge", "system"),
  tk("color-success-tint", "rgb(21 128 61 / 0.08)", "Success tint", "Success badges", "Text", "system"),
  tk("color-warning", "#b54708", "Warning", "Warning text and badges", "Fills larger than a badge", "system"),
  tk("color-warning-tint", "rgb(181 71 8 / 0.08)", "Warning tint", "Warning badges", "Text", "system"),
  tk("color-success-on-dark", "#5fd38d", "Success on navy", "Toast and terminal success icons", "Light grounds", "system"),
  tk("color-danger-on-dark", "#ff8a80", "Danger on navy", "Toast error icons", "Light grounds", "system"),
];

export const VEILS: readonly Token[] = [
  tk("color-veil-modal", "rgb(10 27 51 / 0.4)", "Modal veil", "Behind a dialog or sheet, solid and never blurred",
    "The mobile menu, which keeps color-ink-20", "system"),
  tk("color-focus-halo", "rgb(26 109 255 / 0.18)", "Field focus halo", "The 3px halo of a focused field",
    "Buttons and cards, which take the outline", "system"),
];
