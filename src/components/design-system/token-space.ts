// Space, layout, breakpoints and the z-scale. Spacing is Tailwind's 4px scale, named by its Tailwind step
// (space-2-5 is p-2.5, 10px). Layout values mirror the site's containers, measures and header.
import { tk, type MediaKey, type Token } from "./token-types";

const W = "components/website/";

const OFF_GRID = "Off-grid values, new work stays on 4 (and on 8 above 32)";

/** step, px, use, and a neverFor that replaces the shared one for a site-only step */
const SPACE: readonly (readonly [string, number, string, string?])[] = [
  ["0-5", 2, "the hover lift of cards and BackToTop"], ["1", 4, "track inset of rails and toggles (the segmented track's 1px line plus 3px)"],
  ["1-5", 6, "icon to label in small controls"], ["2", 8, "chip and badge gaps"],
  ["2-5", 10, "icon to label, list gaps"], ["3", 12, "control padding, button groups"],
  ["3-5", 14, "tab padding, tag panel"], ["4", 16, "card grid gap, page gutter on phones, section heading to subline"],
  ["5", 20, "hero and closing headline to their line, FAQ row padding"], ["6", 24, "card padding, card gutter"],
  ["7", 28, "comparison padding, job card top"], ["8", 32, "nav gap, page gutter from md, CTA top"],
  ["9", 36, "the comparison card's padding from md, site only",
    "New work, since 36 is off the 8 grid above 32 (take space-8 or space-10)"],
  ["10", 40, "traits and toggle top, grid gaps"],
  ["12", 48, "jobs row top"], ["14", 56, "stats gap"], ["16", 64, "section inner gutter from md"],
  ["24", 96, "main top padding, the section rhythm's floor"], ["32", 128, "FAQ foot padding"],
];

export const SPACING: readonly Token[] = SPACE.map(([step, px, use, never]) =>
  tk(`space-${step}`, `${px}px`, `Space ${px}`, use, never ?? OFF_GRID,
    "Tailwind 4 spacing scale", { utility: `p-${step.replace("-", ".")}` }),
);

export const LAYOUT: readonly Token[] = [
  tk("container", "1400px", "Content width", "Header inner, hero, players, every light section, the footer",
    "Full-bleed grounds", `${W}Jobs.tsx:103`, { utility: "max-w-[1400px]" }),
  tk("container-full", "1448px", "Full-view copy grid", "The full-view hero copy (1400 plus two 24px edges)",
    "Sections", `${W}Hero.tsx:169`, { utility: "max-w-[1448px]" }),
  tk("gutter-page", "16px", "Page gutter on phones", "main's side padding under md", "Section inners",
    "app/website/page.tsx:25", { utility: "px-4" }),
  tk("gutter-page-md", "32px", "Page gutter from md", "main's side padding from md", "Section inners",
    "app/website/page.tsx:25", { utility: "md:px-8" }),
  tk("gutter-section-md", "64px", "Section inner from md", "Understands, Jobs, FAQ, Closing, the footer inner",
    "Phones, which take 16", `${W}Jobs.tsx:103`, { utility: "md:px-16" }),
  tk("measure-line", "980px", "Scroll line measure", "The scroll line statement", "Body", `${W}ScrubLine.tsx:120`),
  tk("measure-answer", "680px", "Answer measure", "FAQ answers and the widest full lede", "Headings", `${W}Faq.tsx:68`),
  tk("measure-subline", "520px", "Subline measure", "Section sublines, the closing line, carousel body",
    "Long body", `${W}Jobs.tsx:109`),
  tk("measure-body", "480px", "Player body measure", "The player body and its column", "Light sections",
    `${W}Players.tsx:132`),
  tk("measure-lede", "440px", "Lede measure", "The container lede and the traits", "Sublines", `${W}Hero.tsx:205`),
  tk("rhythm-section", "clamp(96px, 9vw, 144px)", "Section rhythm",
    "The top padding of Jobs and the comparison's offset under the header", "Spacing inside a section",
    `${W}Jobs.tsx:103`, { utility: "pt-[clamp(96px,9vw,144px)]" }),
  // the FAQ and the closing open on their own clamps: a quieter step after a full section
  tk("rhythm-faq", "clamp(72px, 7vw, 120px)", "FAQ rhythm", "The top padding of the FAQ",
    "Other sections, which take rhythm-section", `${W}Faq.tsx:18`, { utility: "pt-[clamp(72px,7vw,120px)]" }),
  tk("rhythm-closing-top", "clamp(40px, 4vw, 72px)", "Closing top", "The top padding of the closing section",
    "Other sections", `${W}Closing.tsx:12`, { utility: "pt-[clamp(40px,4vw,72px)]" }),
  tk("rhythm-closing-foot", "clamp(92px, 10vw, 150px)", "Closing foot", "The room under the closing, above the footer",
    "Other sections", `${W}Closing.tsx:12`, { utility: "pb-[clamp(92px,10vw,150px)]" }),
  tk("header-h", "73px", "Header height on phones", "Offsets under the fixed header below md",
    "Hard-coded offsets, which drift (70 at Understands.tsx:64)", `${W}Header.tsx:52`),
  tk("header-h-md", "80px", "Header height from md", "Offsets under the fixed header from md",
    "Hard-coded offsets, which drift (89 at Hero.tsx)", `${W}Header.tsx:52`),
];

export const BREAKPOINTS: readonly Token[] = [
  tk("bp-sm", "640px", "Tailwind sm", "Rare phone splits", "The full-view hero", "Tailwind default"),
  tk("bp-md", "768px", "Tailwind md", "Phone to tablet, the main split of new work", "The full-view hero", "Tailwind default"),
  tk("bp-lg", "1024px", "Tailwind lg", "Tablet to desktop, the players layout", "The full-view hero", "Tailwind default"),
  tk("bp-xl", "1280px", "Tailwind xl", "Wide desktop, the jobs grid", "The full-view hero", "Tailwind default"),
  tk("bp-hero-561", "561px", "Full hero ladder", "The full-view hero only", "New work", `${W}Hero.tsx:18`),
  tk("bp-hero-901", "901px", "Full hero ladder", "The full-view hero only", "New work", `${W}Hero.tsx:18`),
  tk("bp-hero-1600", "1600px", "Full hero ladder", "The full-view hero and the floating badges", "New work", `${W}Hero.tsx:18`),
  tk("bp-hero-1920", "1920px", "Full hero ladder", "The full-view hero only", "New work", `${W}Hero.tsx:18`),
  tk("bp-hero-2560", "2560px", "Full hero ladder", "The full-view hero only", "New work", `${W}Hero.tsx:18`),
  tk("bp-edge", "380px", "Narrow phone edge", "The jobs tabs' tighter padding", "Layout splits", `${W}Jobs.tsx:128`),
];

/** The media query each responsive step uses, in cascade order. TokenStyle prints steps in this order. */
export const MEDIA: Readonly<Record<Exclude<MediaKey, "base">, string>> = {
  "min-561": "(width >= 561px)",
  md: "(width >= 768px)",
  "min-901": "(width >= 901px)",
  lg: "(width >= 1024px)",
  xl: "(width >= 1280px)",
  "min-1600": "(width >= 1600px)",
  "min-1920": "(width >= 1920px)",
  "min-2560": "(width >= 2560px)",
  "max-lg": "(width < 1024px)",
  "max-md": "(width < 768px)",
  short: "(min-width: 1280px) and (max-height: 720px)",
};

export const Z: readonly Token[] = [
  tk("z-backdrop", "-10", "Behind the page", "The fixed ASCII field, the doodle layer", "Content",
    `${W}AsciiBackdrop.tsx:61`, { utility: "-z-10" }),
  tk("z-floor", "0", "The tile floor", "The hero's WebGL floor", "Controls", `${W}Hero.tsx:132`, { utility: "z-0" }),
  tk("z-raised", "10", "Raised in a section", "Player cards, the vs disc, the carousel, the floor logo",
    "Anything fixed", `${W}Understands.tsx:87`, { utility: "z-10" }),
  tk("z-copy", "20", "Copy over the floor", "Hero copy, the wave button, the scroll cue, the accent water",
    "Overlays", `${W}AccentWave.tsx:193`, { utility: "z-20" }),
  tk("z-stage", "30", "Loader and players", "The hero loader and the players section", "Overlays",
    `${W}Players.tsx:108`, { utility: "z-30" }),
  tk("z-header", "40", "Fixed chrome", "The header and BackToTop", "Popovers", `${W}Header.tsx:53`, { utility: "z-40" }),
  tk("z-popover", "45", "Popovers", "Menus and select panels above the header",
    "Dialogs and sheets, which open with showModal in the top layer over every z value", "system"),
  tk("z-toast", "60", "Toasts",
    "Over the header and popovers, under an open modal, so a dialog's outcome is toasted after it closes",
    "Tooltips", "system"),
  tk("z-tooltip", "70", "Tooltips", "Tooltips and the skip link, the top of the stack", "Anything else", "system"),
];
