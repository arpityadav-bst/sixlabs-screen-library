// The motion tokens section's rows, read from token-motion.ts so a value is written once. Each curve's run
// length is the job it ships for (the rise for the ease, the Human / AI sweep for in-out).
import type { Bezier, EaseInput, SpringEase } from "@/app/design-system/_kit/EaseDemo";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { DURATIONS, EASES, SPRINGS, SPRING_VALUES, TRAVEL } from "@/components/design-system/token-motion";
import type { Token } from "@/components/design-system/token-types";

const valueRow = (t: Token): ValueRow => ({ part: t.role, token: `--ds-${t.name}`, value: t.value, source: t.source });

function curveOf(t: Token): EaseInput {
  if (t.name === "ease-glide") return "glide";
  if (t.value === "linear") return "linear";
  const n = t.value.match(/-?\d*\.?\d+/g)?.map(Number) ?? [0, 0, 1, 1];
  return [n[0], n[1], n[2], n[3]] as Bezier;
}

/** seconds each curve runs for in its card: the length of the job it ships for */
const RUN: Record<string, number> = {
  "ease-out": 0.7,
  "ease-out-tw": 0.7,
  "ease-in-out": 1.5,
  "ease-sweep": 1,
  "ease-in": 0.4,
  "ease-linear": 1,
  "ease-glide": 1.4,
};

/** extra facts for a card's caption */
const NOTE: Record<string, string> = {
  "ease-out": "9 local copies",
  "ease-out-tw": "hero fades",
  "ease-in-out": "portrait sweep, tile flip",
  "ease-sweep": "the CTA dot band",
  "ease-in": "badge flip, first half",
  "ease-linear": "loops, spinners, load bars",
  "ease-glide": "1 - (1 - k)^3, a 2000px glide",
};

export type EaseCard = { key: string; label: string; ease: EaseInput; duration: number; caption: string };

const card = (t: Token): EaseCard => ({
  key: t.name,
  label: t.role,
  ease: curveOf(t),
  duration: RUN[t.name] ?? 0.6,
  caption: `${t.value === "linear" ? "linear" : t.name === "ease-glide" ? "easeOut" : t.value} · ${RUN[t.name] ?? 0.6}s · ${NOTE[t.name] ?? t.useFor}`,
});

export const THE_EASE = card(EASES[0]);
export const OTHER_EASES: readonly EaseCard[] = EASES.slice(1).map(card);
export const EASE_VALUES: readonly ValueRow[] = EASES.map(valueRow);

export const EASE_PROPS: readonly PropRow[] = [
  { name: "EASE", type: "[number, number, number, number]", default: "[0.22, 1, 0.36, 1]", note: "for motion/react transitions" },
  { name: "EASE_CSS", type: "string", default: "cubic-bezier(0.22, 1, 0.36, 1)", note: "for CSS transitions" },
  { name: "--ds-ease-out", type: "custom property", note: "the same curve inside the guide and frames" },
];

export const EASE_CODE = `import { EASE } from "@/components/design-system/motion";

<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} />`;

/** The ladder's rungs: every duration token, shortest first. */
export const LADDER = DURATIONS.map((t) => ({
  name: t.role,
  ms: parseFloat(t.value),
  job: t.useFor,
})).sort((a, b) => a.ms - b.ms);

export const DURATION_VALUES: readonly ValueRow[] = DURATIONS.map(valueRow);

export const DURATION_PROPS: readonly PropRow[] = [
  { name: "DUR.exit", type: "number", default: "0.14", note: "seconds" },
  { name: "DUR.ui", type: "number", default: "0.2" },
  { name: "DUR.line", type: "number", default: "0.3" },
  { name: "DUR.panel", type: "number", default: "0.35" },
  { name: "DUR.rise", type: "number", default: "0.7" },
  { name: "DUR.sweep", type: "number", default: "1" },
];

export const DURATION_CODE = `import { DUR, EASE } from "@/components/design-system/motion";

transition={{ duration: DUR.panel, ease: EASE }}   // an answer opening
className="transition-colors duration-(--ds-dur-ui)" // a control's hover colour`;

export type SpringCard = { key: string; label: string; ease: SpringEase; caption: string };

const SPRING_KEY = { press: "spring-press", thumb: "spring-thumb", pop: "spring-pop", drift: "spring-drift" } as const;

export const SPRING_CARDS: readonly SpringCard[] = (Object.keys(SPRING_KEY) as (keyof typeof SPRING_KEY)[]).map((k) => {
  const t = SPRINGS.find((s) => s.name === SPRING_KEY[k]);
  return { key: k, label: t?.role ?? k, ease: SPRING_VALUES[k], caption: `${t?.value ?? ""} · ${t?.useFor ?? ""}` };
});

export const SPRING_VALUES_ROWS: readonly ValueRow[] = SPRINGS.map(valueRow);

export const SPRING_PROPS: readonly PropRow[] = [
  { name: "SPRING.press", type: "Transition", default: "spring 400 / 25", note: "grow and press" },
  { name: "SPRING.thumb", type: "Transition", default: "spring 500 / 40", note: "a thumb or check settling on a choice" },
  { name: "SPRING.pop", type: "Transition", default: "spring 460 / 34, mass 0.7", note: "a panel opening from its trigger" },
];

export const SPRING_CODE = `import { SPRING } from "@/components/design-system/motion";

<motion.button whileTap={{ scale: 0.97 }} transition={SPRING.press} />`;

/** Each travel distance drawn true size on the canvas, and its row in the drawer with what it is for. */
export const TRAVEL_MARKS = TRAVEL.map((t) => ({ key: t.name, px: parseFloat(t.value), label: `${t.role} · ${t.value}` }));

export const TRAVEL_VALUES: readonly ValueRow[] = TRAVEL.map((t) => ({
  ...valueRow(t),
  value: `${t.value}, ${t.useFor.toLowerCase()}`,
}));

/** Do and Don't: the same 0.3s colour change on the ease and on an overshooting curve. */
export const DO_EASE = { label: "The ease at 0.3s", ease: EASES[0] ? curveOf(EASES[0]) : "linear", duration: 0.3 } as const;
export const DONT_EASE = { label: "Overshoot at 0.3s", ease: [0.34, 1.56, 0.64, 1] as Bezier, duration: 0.3 } as const;
