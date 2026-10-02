// Data for the stats and typed word section: pins, the typing timeline and the drawers. Hero.tsx keeps its
// figures private, so the guide's one checked copy of them (COPIES_BASE, the tones, heroStats and the
// HERO_FIGURES Assertion that holds them to Hero.tsx) lives in _data/specimens.ts, which the frames read
// too, and is re-exported here, so Coverage walks the check with the section that shows it.
import { COPIES_BASE, HERO_FIGURES, TONE_COPIES, TONE_HUMANS, heroStats } from "@/app/design-system/_data/specimens";
import { pr, sv, tv, type Pin } from "./display-values";

export { COPIES_BASE, HERO_FIGURES, TONE_COPIES, TONE_HUMANS, heroStats };
export const TICK_MS = 2400;

export const STATS_PINS: readonly Pin[] = [
  { selector: ".ds-a-stats dl", name: "List", value: "gap 56, 32 under md", source: "HeroBits.tsx:36", expect: "gap-14 max-md:gap-8", padding: false },
  { selector: ".ds-a-stats dd", index: 1, name: "Live value", token: "--ds-type-stat", value: "Outfit 30 / 500, tabular, accent", source: "HeroBits.tsx:55", expect: "font-display text-[30px] font-medium leading-none tracking-tight tabular-nums" },
  { selector: ".ds-a-stats dt", index: 1, name: "Label", value: "Inter 14, 15 from md, #64748b, mt 8", source: "HeroBits.tsx:46", expect: "mt-2 font-sans text-[14px] md:text-[15px] leading-snug text-[#64748b]" },
];

export const TYPED_PINS: readonly Pin[] = [
  { selector: ".ds-a-typed .tw-letter", name: "Letter", value: "in at 0.5s + i x 90ms", source: "globals.css:92,93", expect: ["--tw-start: 0.5s;", "--tw-step: 90ms;"] },
  { selector: ".ds-a-typed .tw-last", name: "Last letter", value: "its caret lingers 1s", source: "globals.css:114,115", expect: [".tw-last::after", "animation: tw-linger 1s linear;"] },
];

const WORD = "models";
export const TYPED_LANES = [
  { label: "Letters", items: [...WORD].map((ch, i) => ({ label: ch, at: 0.5 + i * 0.09 })) },
  { label: "Caret", items: [{ label: "each turn 90ms", at: 0.5, to: 0.5 + WORD.length * 0.09 }, { label: "linger", at: 0.5 + (WORD.length - 1) * 0.09, to: 1.45 + (WORD.length - 1) * 0.09 }] },
  { label: "Numbers", items: [{ label: "wait", at: 0, to: 1.2 }, { label: "rise", at: 1.2, to: 1.8 }] },
  { label: "Live tick", items: [{ label: "brighten", at: 0, to: 0.45 }] },
] as const;

export const STATS_VALUES = [
  sv("Value", "Outfit 30 / 500, leading 1, tight, tabular", "HeroBits.tsx:55", "--ds-type-stat", "font-display text-[30px] font-medium leading-none tracking-tight tabular-nums"),
  sv("Label", "Inter 14, 15 from md, snug, #64748b, nowrap on phones", "HeroBits.tsx:46", undefined, "text-[14px] md:text-[15px] leading-snug text-[#64748b] max-md:whitespace-nowrap"),
  sv("Gap", "56, 32 under md", "HeroBits.tsx:36", undefined, "gap-14 max-md:gap-8"),
  sv("Tones", "humans ink, copies accent, as class strings", "Hero.tsx:71", undefined, `tone: "${TONE_HUMANS}"`, `tone: "${TONE_COPIES}"`),
  sv("Entrance", "y 6 to 0, 0.6s, delay 1.2s once ready (container only)", "HeroBits.tsx:34", undefined, "{ opacity: 0, y: 6 }", "duration: 0.6, ease, delay: ready ? 1.2 : 0"),
  sv("Tick", "opacity 0.4 to 1 over 0.45s, the figure never moves", "HeroBits.tsx:63", undefined, "initial={s.live ? { opacity: 0.4 } : false}", "duration: 0.45, ease"),
  tv("Rise travel", "numbers-y"),
  tv("Rise time", "dur-numbers"),
] as const;

export const STATS_PROPS = [
  pr("stats", "{ value, label: string[], tone: string, live }[]", undefined, "tone is a text colour class"),
  pr("ready", "boolean", undefined, "the container waits for it"),
  pr("left", "boolean", undefined, "the full view's left column, no entrance"),
] as const;

export const TYPED_VALUES = [
  sv("Start", "0.5s after the CSS applies", "globals.css:92", undefined, "--tw-start: 0.5s;"),
  sv("Step", "90ms a letter", "globals.css:93", undefined, "--tw-step: 90ms;"),
  sv("Caret", "2px, 70% of the line, right -3, radius 1", "globals.css:99", undefined, "right: -3px;", "height: 70%;", "width: 2px;", "border-radius: 1px;"),
  sv("Caret colour", "#1a6dff, written in globals.css", "globals.css:107", "--ds-color-accent", "background: #1a6dff;"),
  tv("Caret glow", "glow-caret"),
  sv("Linger", "1s: on, off, on, off", "globals.css:129", undefined, "animation: tw-linger 1s linear;", "35%, 59% { opacity: 0; }"),
  sv("onView", "IntersectionObserver at 0.6, once", "TypedWord.tsx:37", undefined, "{ threshold: 0.6 }", "io.disconnect();"),
  sv("Held", "tw-wait pauses every letter", "globals.css:136", undefined, ".tw-wait .tw-letter,", "animation-play-state: paused;"),
  sv("Reduced motion", "letters shown, no caret", "globals.css:160", undefined, ".tw-letter { animation: none; opacity: 1; }", ".tw-letter::after { display: none; }"),
] as const;

export const TYPED_PROPS = [
  pr("word", "string"),
  pr("className", "string", undefined, "the accent class in use"),
  pr("onView", "boolean", "false", "waits until 60% is in view"),
  pr("hold", "boolean", "false", "paused while true"),
] as const;

export const STATS_CODE = `import { HeroNumbers } from "@/components/website/HeroBits";

<HeroNumbers stats={stats} ready={floorReady} left={false} />`;

export const TYPED_CODE = `import { TypedWord } from "@/components/website/TypedWord";

Making <TypedWord word="models" className="text-accent" /> of human players.`;
