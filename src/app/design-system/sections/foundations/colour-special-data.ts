// The data behind Special palettes: the strips for each context, the pins on the real parts that use them,
// the lines of a run quoted from jobs-data.ts, and the spent tile tint read from all three files that name
// it. Lines and values are read from the source by the scan, so they follow the site, and each pin's expect
// is the exact text its line writes, which Coverage holds to that line.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import { BRAND, FRINGE, HOLOGRAM, ON_BLUE, TERMINAL, type Token } from "@/components/design-system/tokens";
import { JOBS, type Step } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { itemsOf, tok } from "./colour-kit";
import { find } from "./colour-scan";
import type { SampleMode, StripItem } from "./colour-strip";
import { cite } from "./foundation-scan";

const W = "src/components/website/";
const role = (t: Token) => t.role;

/** The white ladder on the blue. Text steps carry their reading on the ground they ship on. */
const BLUE = tok("color-accent").value;
const TEXT_ON: Record<string, [string, string]> = {
  "color-on-blue-80": [BLUE, "the blue"],
  "color-on-blue-75": [BLUE, "the blue"],
  "color-on-blue-50": ["navy", "navy"],
};
export const ON_BLUE_ITEMS: readonly StripItem[] = itemsOf(ON_BLUE, "fill", {
  caption: role,
  on: (t) => TEXT_ON[t.name]?.[0],
  onName: (t) => TEXT_ON[t.name]?.[1],
});

const MT = `${W}ModeToggle.tsx`;
const PT = `${W}PlayerTraits.tsx`;
const v = (name: string) => tok(name).value;

/** Pins on the real Human / AI switch and trait bars, naming the step of the ladder each part takes. */
export const ON_BLUE_PINS: readonly AnatomyPin[] = [
  { selector: '[role="radiogroup"]', name: "Switch track and ring", token: "--ds-color-on-blue-15, --ds-color-on-blue-25",
    value: `${v("color-on-blue-15")}, ring ${v("color-on-blue-25")}`, ...cite(MT, "bg-white/15") },
  { selector: '[role="radio"][aria-checked="false"]', name: "Label at rest", token: "--ds-color-on-blue-80",
    value: v("color-on-blue-80"), ...cite(MT, "text-white/80") },
  { selector: '[role="radio"][aria-checked="true"] > span', name: "Thumb", token: "--ds-color-surface",
    value: v("color-surface"), ...cite(MT, "rounded-full bg-white shadow") },
  { selector: "dt", name: "Trait label", token: "--ds-color-on-blue-75", value: v("color-on-blue-75"), ...cite(PT, "text-white/75") },
  { selector: "dd", name: "Trait track", token: "--ds-color-on-blue-20", value: v("color-on-blue-20"), ...cite(PT, "bg-white/20") },
  { selector: "dd > div", name: "Trait fill", token: "--ds-color-surface", value: v("color-surface"),
    ...cite(PT, "h-full rounded-full bg-white") },
];

/** The trait labels the chip pair borrows, quoted from players-data.ts. */
export const TRAIT_LABELS = PLAYERS[0].traits.slice(0, 2).map((t) => t.label);

/** The terminal window: its own tokens, with the quiet text it prints in slotted in before the answer. */
const TERM = tok("color-terminal-bg").value;
const termMode = (t: Token): SampleMode =>
  t.name === "color-terminal-rule"
    ? "line"
    : /accent-on-dark$|text-quiet/.test(t.name)
      ? "text"
      : /glow/.test(t.name)
        ? "glow"
        : /red|amber|green/.test(t.name)
          ? "dot"
          : "fill";
export const TERMINAL_ITEMS: readonly StripItem[] = itemsOf(
  [...TERMINAL.slice(0, 5), tok("color-text-quiet"), ...TERMINAL.slice(5)],
  termMode,
  { caption: role, on: (t) => (termMode(t) === "text" ? TERM : undefined), onName: () => "the terminal" },
);

const run = JOBS[0].run;
const cmd = run.find((s): s is Extract<Step, { t: "cmd" }> => s.t === "cmd");
const load = run.find((s): s is Extract<Step, { t: "load" }> => s.t === "load");
const answer = run.find((s): s is Extract<Step, { t: "kv" }> => s.t === "kv" && s.accent === true);

/** Three lines of the first job's run, each in the colour the terminal prints it in. */
export const RUN_LINES: readonly { readonly text: string; readonly token: string }[] = [
  { text: `$ ${cmd?.text ?? ""}`, token: "color-surface" },
  { text: load?.text ?? "", token: "color-text-quiet" },
  { text: `${answer?.k ?? ""}  ${answer?.v ?? ""}`, token: "color-accent-on-dark" },
];
export const ANSWER = answer?.v ?? "";

/** Glows drawn on dark, where the holograms and the CTA band ship. */
export const GLOW_ITEMS: readonly StripItem[] = itemsOf(HOLOGRAM.filter((t) => t.name !== "color-band-ink"), (t) =>
  t.name === "color-doodle" ? "line" : t.name === "color-holo-dot" ? "dot" : "glow", { caption: role });

/** The footer wordmark's split, on the footer ground it ships on. */
export const FRINGE_FOOT: readonly StripItem[] = itemsOf(FRINGE.filter((t) => !/ascii/.test(t.name)), "text", { caption: role });

/** The glyph field's inks, on the page it runs over. */
export const FRINGE_FIELD: readonly StripItem[] = itemsOf(
  [...FRINGE.filter((t) => /ascii/.test(t.name)), tok("color-band-ink")],
  "text",
  { caption: role },
);

export const GLOW_TOKENS: readonly Token[] = [...HOLOGRAM, ...FRINGE];

type Spent = { readonly name: string; readonly value: string; readonly source: string; readonly use: string };

function spent(name: string, path: string, re: RegExp, use: string): Spent {
  const hit = find(path, re);
  const file = path.split("/").pop() ?? path;
  return { name, value: hit?.groups[0] ?? "not found", source: hit ? `${file}:${hit.line}` : `${file}, moved`, use };
}

/** The colour a used tile rests in, as each of its three files names it, the winner first. */
export const SPENT_TINTS: readonly Spent[] = [
  spent("TileFloor spentTint", "src/components/tiles/TileFloor.tsx", /spentTint = "(#[0-9a-fA-F]{6})"/,
    "Wins. TileFloor always passes its default to createFloor, which lays it over the params"),
  spent("floor-params.json spentTint", "public/tiles/floor-params.json", /"spentTint"\s*:\s*"(#[0-9a-fA-F]{6})"/,
    "Overridden by the prop, so an edit here changes nothing on screen"),
  spent("floor.js fallback", "src/tiles/floor.js", /P\.spentTint \?\? '(#[0-9a-fA-F]{6})'/,
    "Read only when neither of the others is set"),
];

const BM = `${W}brand-marks.tsx`;

/** Pins on the real logo and wordmark. */
export const BRAND_PINS: readonly AnatomyPin[] = [
  { selector: "[data-ds-logo] g", name: "Blades", token: "--ds-color-logo-blue", value: v("color-logo-blue"),
    ...cite(BM, '<g fill={fill("#1770EF"') },
  { selector: "[data-ds-logo] circle", name: "Core", token: "--ds-color-logo-navy", value: v("color-logo-navy"),
    ...cite(BM, 'r="15.41" fill={fill("#030D2D"') },
  { selector: "[data-ds-word] > span", name: "The accent 6", token: "--ds-color-accent", value: v("color-accent"),
    ...cite(`${W}CopyLine.tsx`, 'plain ? "" : "text-accent"') },
];

/** Each logo fill beside the UI colour it must not stand in for. */
export const BRAND_PAIRS: readonly { readonly logo: Token; readonly ui: Token; readonly mode: SampleMode }[] = [
  { logo: BRAND[0], ui: tok("color-accent"), mode: "text" },
  { logo: BRAND[1], ui: tok("color-ink"), mode: "fill" },
];
