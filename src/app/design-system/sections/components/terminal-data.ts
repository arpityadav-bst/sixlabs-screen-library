// The job terminal's written values. JobTerminal keeps its timings as module constants it does not export,
// so they are transcribed here with their lines (Meta > Coverage asserts the source still says them). The
// step kinds table and each run's timeline are computed from the real JOBS data, never retyped.
import { JOBS, type Step } from "@/components/website/jobs-data";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import type { Pin } from "./display-values";

const F = "JobTerminal.tsx";

/** JobTerminal.tsx:27-29 and 116 */
export const TIMING = { typeMs: 34, afterCmdMs: 280, loadMs: 1300, step: { out: 420, kv: 420, check: 200, bar: 360 } } as const;

const T = TIMING.step;
/** TIMING held to JobTerminal's own constants, the needles written from the numbers above, so this one copy
 *  is the one Coverage checks (Choreography and Meta read it from here). */
export const TIMING_ASSERT: readonly Assertion[] = [
  site(F, `const TYPE_MS = ${TIMING.typeMs};`),
  site(F, `const STEP_MS = { out: ${T.out}, kv: ${T.kv}, check: ${T.check}, bar: ${T.bar} } as const;`),
  site(F, `const LOAD_MS = ${TIMING.loadMs};`),
  site(F, `await wait(${TIMING.afterCmdMs});`),
];

/** How long a step holds the run before the next one starts, in ms. */
export function stepMs(s: Step): number {
  if (s.t === "cmd") return s.text.length * TIMING.typeMs + TIMING.afterCmdMs;
  if (s.t === "load") return s.ms ?? TIMING.loadMs;
  return TIMING.step[s.t];
}

/** What a step prints, as the terminal writes it, for the timeline labels here and in Choreography. */
export const stepText = (s: Step): string => {
  if (s.t === "kv") return `${s.k}  ${s.v}`;
  if (s.t === "bar") return `${s.text} ${s.value}%`;
  return s.text;
};

const LANE: Record<Step["t"], string> = { cmd: "typed", load: "working", out: "lines", kv: "lines", check: "lines", bar: "lines" };

/** A run as timeline lanes, in seconds from the moment it plays. */
export function runLanes(run: readonly Step[]): TimelineLane[] {
  const lanes = new Map<string, { label: string; at: number; to: number }[]>();
  let t = 0;
  for (const s of run) {
    const d = stepMs(s);
    const key = LANE[s.t];
    const list = lanes.get(key) ?? [];
    list.push({ label: stepText(s), at: t / 1000, to: (t + d) / 1000 });
    lanes.set(key, list);
    t += d;
  }
  return ["typed", "working", "lines"].filter((k) => lanes.has(k)).map((k) => ({ label: k, items: lanes.get(k)! }));
}

export const runSeconds = (run: readonly Step[]) => run.reduce((n, s) => n + stepMs(s), 0) / 1000;

type Kind = { name: string; match: (s: Step) => boolean; ink: string; source: string };

const KINDS: readonly Kind[] = [
  { name: "cmd", match: (s) => s.t === "cmd", ink: "white after a slate-500 $", source: `${F}:199-205` },
  { name: "load", match: (s) => s.t === "load", ink: "slate-400, a spinner then a tick, a 2px fill at white 40%", source: `${F}:207-230` },
  { name: "out dim", match: (s) => s.t === "out" && s.tone !== "ink", ink: "slate-400", source: `${F}:241` },
  { name: "out ink", match: (s) => s.t === "out" && s.tone === "ink", ink: "slate-200", source: `${F}:241` },
  { name: "kv", match: (s) => s.t === "kv" && !s.accent, ink: "key slate-500 in 9ch, value slate-200", source: `${F}:249-251` },
  { name: "kv accent", match: (s) => s.t === "kv" && !!s.accent, ink: "value #6ea8ff, the run's answer", source: `${F}:32` },
  { name: "check", match: (s) => s.t === "check", ink: "slate-500 tick, slate-200 text", source: `${F}:256-262` },
  { name: "bar", match: (s) => s.t === "bar", ink: "label slate-300, value slate-200 in 4ch, a 2px bar at white 40%", source: `${F}:264-281` },
];

const dwell = (s: Step) =>
  s.t === "cmd" ? `${TIMING.typeMs}ms a character, then ${TIMING.afterCmdMs}ms` : `${stepMs(s)}ms`;

/** The first sample of every step kind, from JOBS: kind, sample, job, ink, dwell, source. */
export const STEP_KIND_ROWS: string[][] = KINDS.map((k) => {
  for (const j of JOBS) {
    const s = j.run.find(k.match);
    if (s) return [k.name, stepText(s), j.title, k.ink, dwell(s), k.source];
  }
  return [k.name, "no sample in JOBS", "", k.ink, "", k.source];
});

export const TERMINAL_PINS: readonly Pin[] = [
  { selector: '[class*="bg-[#0b1526]"]', name: "Window", token: "--ds-color-terminal-bg", value: "radius 16", source: `${F}:135`, expect: "overflow-hidden rounded-[16px] bg-[#0b1526]" },
  { selector: '[class*="bg-[#111d31]"]', name: "Title bar", token: "--ds-color-terminal-bar", value: "px 16, py 12", source: `${F}:137`, expect: "bg-[#111d31] px-4 py-3", padding: true },
  { selector: '[class*="bg-[#ff5f57]"]', name: "Window dots", token: "--ds-color-terminal-red", value: "10 round, gap 6", source: `${F}:137,138`, expect: ["flex gap-1.5", "h-2.5 w-2.5 rounded-full bg-[#ff5f57]"] },
  { selector: '[class*="h-[300px]"]', name: "Body", token: "--ds-type-terminal", value: "300 tall (292 on phones), p 16, JetBrains 12.5 / 22 (11.5 / 20 on phones)", source: `${F}:142`, expect: ["h-[300px] px-4 py-4", "text-[12.5px] leading-[22px]", "max-md:h-[292px]", "max-md:text-[11.5px] max-md:leading-[20px]"], padding: true },
  { selector: '[class*="radial-gradient"]', name: "Foot glow", token: "--ds-color-accent-on-dark-glow", value: "ellipse at the foot", source: `${F}:149`, expect: "radial-gradient(ellipse_75%_65%_at_50%_100%" },
  { selector: ".term-hint", name: "Hint", token: "--ds-icon-24", value: "fine pointer only", source: `${F}:151,152,157`, expect: ["[@media(hover:hover)_and_(pointer:fine)]:flex", "term-hint relative block", "h-6 w-6"] },
  { selector: '[class*="mr-[1ch]"]', name: "Prompt", value: "$ in slate-500, 1ch", source: `${F}:167`, expect: "mr-[1ch] text-slate-500" },
];

/** A played run: each output step indented under its command, the result lines on a label column, and
 *  the 11px gap that opens a new group of steps. */
export const RUN_PINS: readonly Pin[] = [
  { selector: '[class*="pl-[2ch]"]', name: "Step", value: "indented 2ch under its command", source: `${F}:189`, expect: 'const OUT = "pl-[2ch]";' },
  { selector: '[class*="grid-cols-[9ch_1fr]"]', name: "Result line", value: "a 9ch label column, then the value", source: `${F}:190`, expect: 'const KEY = "grid grid-cols-[9ch_1fr]";', side: "right" },
  { selector: '[class*="mt-[11px]"]', name: "Group gap", value: "11 above a step that opens a group", source: `${F}:198`, expect: 'const gap = s.gap ? "mt-[11px]" : "";' },
];

export const TERMINAL_STATES: readonly KeyRow[] = [
  { key: "idle, mouse", value: "an empty prompt with a blinking cursor over the ASCII field and the foot glow, the pointer hint breathing on a 2.4s loop", source: `${F}:143-169` },
  { key: "idle, touch", value: "no hint, the run starts once 60% of the window is in view", source: `${F}:82-96` },
  { key: "playing", value: "the command types in, then each step lands after its dwell (the step kinds below)", source: `${F}:105-125` },
  { key: "done", value: "the whole run stays, and it never plays again", source: `${F}:56` },
  { key: "reduced motion", value: "the finished run appears the moment it is asked for", source: `${F}:104-107` },
];

export const TERMINAL_VALUES: readonly ValueRow[] = [
  { part: "Window", token: "--ds-color-terminal-bg, --ds-radius-sm", value: "#0b1526, radius 16, overflow hidden, aria-hidden", source: `${F}:132-136` },
  { part: "Title bar", token: "--ds-color-terminal-bar, --ds-color-terminal-rule", value: "#111d31, px 16, py 12, gap 6, foot rule white 6%", source: `${F}:137` },
  { part: "Window dots", token: "--ds-color-terminal-red, --ds-color-terminal-amber, --ds-color-terminal-green", value: "10 round, #ff5f57 #febc2e #28c840", source: `${F}:138-140` },
  { part: "Body", token: "--ds-type-terminal", value: "300 tall (292 under md), p 16, JetBrains Mono 12.5 / 22 (11.5 / 20 under md), slate-400", source: `${F}:142` },
  { part: "Foot glow", token: "--ds-color-accent-on-dark-glow", value: "radial ellipse 75% 65% at 50% 100%, #6ea8ff at 11%", source: `${F}:149` },
  { part: "ASCII field", value: "slate warming to #6ea8ff at half strength, pool x 0.5 y 0.6, reach 420, lens 0.5", source: `${F}:44-72` },
  { part: "Hint", token: "--ds-icon-24", value: "MousePointer2 24, fill white 35%, stroke white 90% at 1.5, ring 32 white 55%", source: `${F}:151-159` },
  { part: "Prompt and cursor", value: "$ slate-500 then 1ch, cursor 7 by 14 slate-300 pulsing", source: `${F}:41-42` },
  { part: "Output indent", value: "2ch under its command", source: `${F}:189` },
  { part: "Label column", value: "9ch, then the value", source: `${F}:190` },
  { part: "Step gap", value: "11 before a step marked gap", source: `${F}:198` },
  { part: "Answer", token: "--ds-color-accent-on-dark", value: "#6ea8ff, the accent kv only", source: `${F}:32` },
  { part: "Line in", token: "--ds-ease-out", value: "opacity 0 to 1, y 3 to 0, 0.25s", source: `${F}:193-196` },
  { part: "Bar grow", value: "scaleX 0 to 1, 0.6s", source: `${F}:273-279` },
  { part: "Idle fade", value: "700ms, then the field stops drawing at 800ms", source: `${F}:76-78` },
];

export const TERMINAL_PROPS: readonly PropRow[] = [
  { name: "run", type: "Step[]", note: "from jobs-data.ts" },
  { name: "play", type: "boolean", default: "false", note: "true starts the run once, a later false does not stop it" },
];

export const TERMINAL_CODE = `import { JobTerminal } from "@/components/website/JobTerminal";
import { JOBS } from "@/components/website/jobs-data";

const [play, setPlay] = useState(false);

<div onPointerEnter={() => setPlay(true)}>
  <JobTerminal key={n} run={JOBS[0].run} play={play} />
</div>`;

/** The Don't run: two jobs back to back, past what the 300px body holds. */
export const LONG_RUN: Step[] = [...JOBS[2].run, ...JOBS[1].run.map((s) => ({ ...s, gap: s.gap || s.t === "cmd" }))];
