// The calls only the owner can make. Each has two options, what each one changes and the recommendation.
// The numbers in the drawers are worked out here at build (contrast from the hex values, file counts from
// the site's source), so a decision never argues from a stale figure.
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { contrastRatio, formatRatio, GROUNDS } from "@/app/design-system/_kit/contrast";
import { tokenByName } from "@/components/design-system/tokens";
import { locate } from "@/app/design-system/_kit/source";
import { WHITE_ON_ACCENT } from "./gaps-data";
import { filesWriting } from "./meta-scan";

export type DecisionId =
  | "accent-ink" | "accent-label" | "dots" | "navies" | "understands" | "ring" | "theme" | "mono" | "sheen" | "faq";

export type Option = { label: string; changes: string };

export type Decision = {
  id: DecisionId;
  title: string;
  question: string;
  a: Option;
  b: Option;
  pick: "a" | "b";
  touches: string;
  values: readonly ValueRow[];
};

const SITE = "src/components/website";
const DS = "src/components/design-system";
/** A token's value. An unknown name throws, so a decision never argues from a blank. */
const hex = (name: string) => {
  const t = tokenByName(name);
  if (!t) throw new Error(`Decisions: --ds-${name} is not in tokens.ts`);
  return t.value;
};
const ratio = (fg: string, bg: string) => {
  const r = contrastRatio(fg, bg);
  return r === null ? "unreadable" : `${formatRatio(r)}:1`;
};
const at = (file: string, needle: string) => {
  const line = locate(file, needle);
  return `${file.split("/").pop()}${line ? `:${line}` : ""}`;
};

/** The accent ink the gaps audit proposes for accent text under 24px. Not a token until the owner says so. */
export const ACCENT_INK = "#1559d6";

export function decisions(): readonly Decision[] {
  const accent = hex("color-accent");
  const ink = hex("color-ink");
  const primary = hex("color-primary");
  return [
    {
      id: "accent-ink", title: "Accent text under 24px",
      question: "Small accent type reads under 4.5:1 on the light grounds. Keep the one accent, or add a darker ink for text only?",
      a: { label: "Keep #1a6dff", changes: "Nothing moves. Accent links and small accent words stay under AA on the page and the container." },
      b: { label: `Add ${ACCENT_INK} for text`, changes: "One new token. Accent text under 24px and link hovers take it, and display type, icons, dots and the ring keep #1a6dff." },
      pick: "b", touches: `${filesWriting(SITE, "hover:text-accent")} files that hover to the accent`,
      values: [
        { part: "#1a6dff on page", value: ratio(accent, GROUNDS.page), source: at(`${SITE}/Hero.tsx`, "Yours next.") },
        { part: "#1a6dff on container", value: ratio(accent, GROUNDS.container) },
        { part: `${ACCENT_INK} on page`, value: ratio(ACCENT_INK, GROUNDS.page) },
        { part: `${ACCENT_INK} on container`, value: ratio(ACCENT_INK, GROUNDS.container) },
      ],
    },
    {
      id: "accent-label", title: "White labels on the accent",
      question: "Small white text on the accent water reads just under 4.5:1. Set those labels large, or sit them on a white surface?",
      a: { label: "Set them large", changes: "Labels and values on the water grow to 24px, or 19px bold, where 3:1 is enough, and each control grows with them." },
      b: { label: "On a white surface", changes: "Small labels sit on white in ink, as ModeToggle ships its chosen state, and the water keeps only large type, icons and rings." },
      pick: "b", touches: `${new Set(WHITE_ON_ACCENT.map((w) => w.file)).size} system files that set white text on the accent`,
      values: [
        { part: "White on the accent", value: ratio("#ffffff", accent) },
        { part: "Ink on white", value: ratio(ink, "#ffffff") },
        ...WHITE_ON_ACCENT.map((w) => ({ part: w.part, value: "white on the accent", source: at(w.file, w.needle) })),
      ],
    },
    {
      id: "dots", title: "Dots on a light ground",
      question: "The system's live dots fill with the accent on light grounds, which the accent rule does not list. Name them its exception, or take the navy?",
      a: { label: "Accent, a named exception", changes: "Nothing moves. The rule gains one line: a live dot, 8px at most, may take the accent on a light ground, as the hero's ships." },
      b: { label: "Navy dots", changes: "Live dots take the navy, as the index card's pin dots already do, so the accent fills nothing outside the water, and a live dot loses the colour that sets it apart." },
      pick: "a", touches: "StatusDot, Avatar and Badge",
      values: [
        { part: "Hero live dot", value: "accent, shipped", source: at(`${SITE}/Hero.tsx`, "relative h-2 w-2 rounded-full bg-accent") },
        { part: "StatusDot live", value: "accent", source: at(`${DS}/StatusDot.tsx`, 'live: "bg-(--ds-color-accent)"') },
        { part: "Avatar live", value: "accent", source: at(`${DS}/Avatar.tsx`, 'live: "bg-(--ds-color-accent)"') },
        { part: "Badge live", value: "the StatusDot live dot", source: at(`${DS}/Badge.tsx`, '<StatusDot size={6} tone="live"') },
        { part: "Index card pins", value: "navy, already", source: at(`${DS}/index-card-art.tsx`, "navy pin dots") },
        { part: "Accent dot on page", value: ratio(accent, GROUNDS.page) },
        { part: "Navy dot on page", value: ratio(primary, GROUNDS.page) },
      ],
    },
    {
      id: "navies", title: "Two navies",
      question: "Ink and primary are two navies a step apart. Keep both by role, or merge them into one value?",
      a: { label: "Keep both, by role", changes: "Nothing on screen. The two names keep the intent: type and icons in ink, solid fills in primary." },
      b: { label: "Merge into one", changes: `The ${filesWriting(SITE, primary)} files that fill with ${primary} move to the ink, a shift no eye can see.` },
      pick: "a", touches: `${filesWriting(SITE, ink)} files for ink, ${filesWriting(SITE, primary)} for primary`,
      values: [
        { part: "Ink", token: "--ds-color-ink", value: ink, source: tokenByName("color-ink")?.source },
        { part: "Primary", token: "--ds-color-primary", value: primary, source: tokenByName("color-primary")?.source },
        { part: "Ink against primary", value: ratio(ink, primary) },
      ],
    },
    {
      id: "understands", title: "The comparison's navy card",
      question: "The 6labs card is a full navy fill and carries no accent word. Keep it, or move it to the container look the rule asks for?",
      a: { label: "Keep the navy card", changes: "Nothing. The one inverse surface on the light page carries the contrast with ChatGPT's grey card." },
      b: { label: "Container look, accent words", changes: "Both cards turn grey, so the pair loses its contrast, and accent words on the grey read under AA." },
      pick: "a", touches: "Understands.tsx",
      values: [
        { part: "White on primary", value: ratio("#ffffff", primary), source: at(`${SITE}/Understands.tsx`, "bg-[#0a152d]") },
        { part: "Accent on container", value: ratio(accent, GROUNDS.container) },
        { part: "Ink on container", value: ratio(ink, GROUNDS.container) },
      ],
    },
    {
      id: "ring", title: "Focus ring colour",
      question: "The system's ring is the accent. Keep it, or draw the ring in navy?",
      a: { label: "Accent ring", changes: "Nothing. The ring is attention, the accent's job, and it never sits on a fill of its own colour." },
      b: { label: "Navy ring", changes: "Stronger on light grounds, but next to a navy primary the ring reads as the button's own edge." },
      pick: "a", touches: "focus.ts and the --ds-focus-color token",
      values: [
        { part: "Accent on page", token: "--ds-focus-color", value: ratio(accent, GROUNDS.page) },
        { part: "Accent on container", value: ratio(accent, GROUNDS.container) },
        { part: "Navy on page", value: ratio(primary, GROUNDS.page) },
        { part: "Navy on container", value: ratio(primary, GROUNDS.container) },
      ],
    },
    {
      id: "theme", title: "Tokens in the site's theme",
      question: "The --ds-* tokens mirror values the site writes raw. Leave the site as it is, or move the values into @theme in globals.css?",
      a: { label: "Keep raw values", changes: "Nothing moves. Every token stays a mirror, held to the site by the assertions in Coverage." },
      b: { label: "Move into @theme", changes: "One pass through the site, page by page, each change checked by the same assertions before it ships." },
      pick: "b", touches: `${filesWriting(SITE, ink)} files write ${ink}, ${filesWriting(SITE, "[0.22, 1, 0.36, 1]")} declare the ease`,
      values: [
        { part: "Files writing the ink", value: String(filesWriting(SITE, ink)), source: SITE },
        { part: "Files declaring the ease", value: String(filesWriting(SITE, "[0.22, 1, 0.36, 1]")), source: SITE },
        { part: "Theme today", value: at("src/app/globals.css", "@theme") },
      ],
    },
    {
      id: "mono", title: "The mono family",
      question: "The theme maps no --font-mono, so the site's font-mono falls back to the system mono. Map it to JetBrains Mono?",
      a: { label: "Leave it unmapped", changes: "The player card footers keep the system mono, a second mono beside the terminal's." },
      b: { label: "Map to JetBrains Mono", changes: "One line in @theme. The footers take the mono the site already loads for the terminal." },
      pick: "b", touches: "globals.css, one line",
      values: [
        { part: "font-mono in use", value: at(`${SITE}/Players.tsx`, "pt-4 font-mono text-[11px]") },
        { part: "JetBrains Mono loaded", value: at("src/app/layout.tsx", "JetBrains_Mono") },
      ],
    },
    {
      id: "sheen", title: "The card sheen",
      question: "The job cards' sheen is drawn with a mask and a drop-shadow filter. Keep it, or redraw it the way the system Card does?",
      a: { label: "Keep the site's sheen", changes: "Every job card keeps a mask and a filter on screen, which holds Mac Chrome at 30 fps on that page." },
      b: { label: "Background layers only", changes: "The same light along the stroke, drawn as gradients on a box one stroke wider, with no mask or filter." },
      pick: "b", touches: "globals.css, the .sheen rules",
      values: [
        { part: "Mask", value: at("src/app/globals.css", "-webkit-mask: linear-gradient") },
        { part: "Filter", value: at("src/app/globals.css", "filter: drop-shadow(") },
        { part: "System sheen", value: "background layers", source: "card.module.css" },
      ],
    },
    {
      id: "faq", title: "FAQ open behaviour",
      question: "The FAQ lets several answers stay open. Keep that, or close the last answer when the next one opens?",
      a: { label: "Several open", changes: "Nothing. A reader can hold two answers open and compare them." },
      b: { label: "One at a time", changes: "Opening an answer closes the last, so the list stays short on a phone and the page does not jump far." },
      pick: "a", touches: "Faq.tsx",
      values: [{ part: "Open state", value: "one flag per question", source: at(`${SITE}/Faq.tsx`, "const on = !!open[q];") }],
    },
  ];
}
