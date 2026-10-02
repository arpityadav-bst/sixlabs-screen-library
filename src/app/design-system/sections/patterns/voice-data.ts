// Data for Content and voice: each rule with a shipped example, the form it ships in (a head, a card, a line
// in its type role, an accessible name) and the exact source text it is quoted from, the vocabulary, the
// labels and the punctuation rules. A chip turns red when the copy moves.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import { JOBS } from "@/components/website/jobs-data";
import { site, type Assertion } from "../foundations/foundation-assert";

/** How a quoted line ships: as a section head, a card's title and line, or a line set in its type role. */
export type VoiceForm =
  | { readonly kind: "head" }
  | { readonly kind: "card"; readonly title: string }
  | { readonly kind: "type"; readonly role: string; readonly ground?: "page" | "container" }
  | { readonly kind: "label" };

export type VoiceRule = {
  readonly rule: string;
  readonly example: string;
  /** the accent words inside the example, if the rule is about them */
  readonly accent?: string;
  /** the accent is typed in behind a caret once in view, as the closing line does it */
  readonly typed?: boolean;
  readonly form: VoiceForm;
  readonly a: Assertion;
};

export const RULES: readonly VoiceRule[] = [
  {
    rule: "Present tense for what is true now, short sentences, each ending in a full stop",
    example: "One model. Three jobs.",
    accent: "Three jobs.",
    form: { kind: "head" },
    a: site("Jobs.tsx", 'One model. <span className="text-accent">Three jobs.</span>'),
  },
  {
    rule: "Past tense only for what the model has done",
    example: "Our model watched millions of hours of gameplay.",
    form: { kind: "type", role: "lede", ground: "container" },
    a: site("Hero.tsx", "Our model watched millions of hours of gameplay."),
  },
  {
    rule: "A claim, then the reason it matters, in two sentences",
    example: "Your KPIs show what happened. The model tells you why it happened.",
    form: { kind: "card", title: JOBS[0].title },
    a: site("jobs-data.ts", "Your KPIs show what happened. The model tells you why it happened."),
  },
  { rule: "Figures in stats and labels, as digits", example: "2B", form: { kind: "type", role: "stat", ground: "container" }, a: site("Hero.tsx", 'value: "2B"') },
  { rule: "A floor written with a plus", example: "1,000,000+ player models", form: { kind: "type", role: "micro" }, a: site("CopyLine.tsx", '"1,000,000+ player models"') },
  { rule: "Scale in a headline, a digit and a word", example: "1 million made", form: { kind: "type", role: "closing" }, a: site("Closing.tsx", "1 million made") },
  {
    rule: "The accent on a word or two",
    example: "Making models of human players.",
    accent: "models",
    form: { kind: "type", role: "hero", ground: "container" },
    a: site("Hero.tsx", 'word="models"'),
  },
  {
    rule: "Most often the closing words",
    example: "Questions, answered.",
    accent: "answered.",
    form: { kind: "head" },
    a: site("Faq.tsx", 'Questions, <span className="text-accent">answered.</span>'),
  },
  {
    rule: "Sometimes the noun the claim turns on",
    example: "Put a million models on a new build and you know how it will land before anyone plays it.",
    accent: "a million models",
    form: { kind: "type", role: "scroll-line" },
    a: site("ScrubLine.tsx", "Put a million models on a new build and you know how it will land before anyone plays it.", 'const ACCENT = ["a", "million", "models"]'),
  },
  {
    rule: "Even when typed in",
    example: "2 billion to go",
    accent: "2 billion to go",
    typed: true,
    form: { kind: "type", role: "closing" },
    a: site("Closing.tsx", 'word="2 billion to go"'),
  },
  {
    rule: "A copy is what the model makes of a player",
    example: "One million players have a copy.",
    form: { kind: "type", role: "caption", ground: "container" },
    a: site("Hero.tsx", "One million players have a copy."),
  },
  {
    rule: "The AI copy, never a clone or an avatar",
    example: "Show the human or their AI copy",
    form: { kind: "label" },
    a: site("ModeToggle.tsx", "Show the human or their AI copy"),
  },
];

export const VOCABULARY: readonly KeyRow[] = [
  { key: "player", value: "a real person who plays games, the subject of every model", source: "Hero.tsx:70" },
  { key: "model", value: "what 6labs builds of a player, from what they do rather than what they say", source: "faq-data.ts:10" },
  { key: "copy", value: "a player's digital copy, what the model makes. Counted as digital copies made", source: "Hero.tsx:76" },
  { key: "AI copy", value: "the copy beside the human in the Human / AI switch", source: "ModeToggle.tsx:28" },
  { key: "hologram", value: "the AI copy's look, the blue scan-line figure. A design word, never on the page", source: "players-data.ts:21" },
  { key: "job", value: "what the model does for a studio: intelligence, testing, game creation", source: "jobs-data.ts:33" },
  { key: "wave", value: "the floor turning to its next cast of faces", source: "HeroBits.tsx:111" },
];

export const LABEL_COLUMNS = ["Label", "Where", "What it does", "Source"] as const;

export const LABELS: readonly { label: string; where: string; does: string; a: Assertion }[] = [
  { label: "Try now", where: "hero, closing, menu", does: "the one solid call", a: site("Hero.tsx", "<PrimaryCta>Try now</PrimaryCta>") },
  { label: "Sign in", where: "header, closing", does: "the outlined second action", a: site("Header.tsx", "Sign in") },
  { label: "See what it does", where: "the hero's lede", does: "glides to the jobs", a: site("Hero.tsx", "See what it does") },
  { label: "Next wave", where: "the wave button", does: "sends the floor's next cast", a: site("HeroBits.tsx", "Next wave") },
  { label: "Back to top", where: "footer, the floating button", does: "glides to the top", a: site("Footer.tsx", "Back to top") },
];

export const PUNCTUATION: readonly KeyRow[] = [
  { key: "em dash", value: "never. A comma, a colon, a full stop or brackets do its job" },
  { key: "semicolon", value: "never in copy. Two sentences instead. One shipped answer still has one", source: "faq-data.ts:43" },
  { key: "case", value: "sentence case for heads, labels and buttons: Try now, Sign in, Questions, answered.", source: "Faq.tsx:23" },
  { key: "full stops", value: "on heads that are sentences, never on a button or a link", source: "Jobs.tsx:107" },
  { key: "figures", value: "commas in thousands, a plus for a floor, B for billions in a stat", source: "Hero.tsx:69" },
];

/** Obvious filler for new parts, and the kind of claim a specimen must never invent. */
export const FILLER = {
  ok: { title: "Panel one", body: "Panel one copy." },
  invented: { title: "Churn down 40%", body: "Studios that switch keep 40% more of their players." },
} as const;

export const HEADS = {
  shipped: { title: "One model.", accent: "Three jobs." },
  sold: { title: "The one amazing model that powers", accent: "three incredible jobs!" },
} as const;
