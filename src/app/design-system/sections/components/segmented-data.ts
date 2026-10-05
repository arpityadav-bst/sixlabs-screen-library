// The Segmented section's data: option sets quoted from the site, state lists, pins, drawer rows.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { SegmentedOption } from "@/components/design-system/Segmented";
import { SEG_GROUND, SEG_SIZE, type SegmentedGround, type SegmentedSize } from "@/components/design-system/segmented-styles";
import { SPACING } from "@/components/design-system/tokens";
import { FORCE_PROP } from "./act-sel-rows";
import { restToken } from "./contrast-pairs";
import { heightOf, sizeNames, sv, tv, type Pin } from "./display-values";

/** ModeToggle's two options and the Jobs switch's three titles, as the site writes them. */
export const TWO: readonly SegmentedOption<string>[] = [
  { id: "human", label: "Human" },
  { id: "ai", label: "AI" },
];
export const THREE: readonly SegmentedOption<string>[] = [
  { id: "intelligence", label: "Intelligence" },
  { id: "testing", label: "Testing" },
  { id: "creation", label: "Game creation" },
];
export const TWO_OFF: readonly SegmentedOption<string>[] = [TWO[0], { ...TWO[1], disabled: true }];

/** The track's inset on each side (space-1), the 8 the control stands taller than its segment. */
const INSET = parseFloat(SPACING.find((t) => t.name === "space-1")?.value ?? "NaN");

/** Each size's segment (px) and the track it stands in (track), read from SEG_SIZE, so the two cannot
 *  drift. The track is the height the control lines up by (control-heights.ts). */
if (Number.isNaN(INSET)) throw new Error("Segmented: no space-1 token for the track's inset");
export const SEG_SIZES: readonly { name: SegmentedSize; px: number; track: number }[] = sizeNames(SEG_SIZE).map((name) => {
  const px = heightOf(SEG_SIZE[name]);
  return { name, px, track: px + 2 * INSET };
});
const ladder = (k: "px" | "track") => SEG_SIZES.map((s) => `${s.name} ${s[k]}`).join(" · ");

export const SEG_GROUNDS: readonly { ground: SegmentedGround; canvas: "page" | "container" | "on-blue" }[] = [
  { ground: "light", canvas: "page" },
  { ground: "container", canvas: "container" },
  { ground: "blue", canvas: "on-blue" },
];

export const SEG_STATES = [
  "rest",
  "hover",
  "selected",
  "focus-visible",
  "pressed",
  "disabled-segment",
  "disabled",
] as const;

export const MODE_PINS: readonly Pin[] = [
  { selector: "[data-pin=mode] [role=radiogroup]", name: "Track", token: "--ds-color-on-blue-15", value: "white 15%, 25% inset ring, p 4, about 232 by 45", source: "ModeToggle.tsx:29", expect: "rounded-full bg-white/15 p-1 ring-1 ring-inset ring-white/25", padding: true },
  { selector: "[data-pin=mode] [aria-checked=true] > span:first-child", name: "Thumb", token: "--ds-shadow-thumb", value: "white, layoutId, spring 500 / 40", source: "ModeToggle.tsx:49-50", expect: ["rounded-full bg-white shadow-", "stiffness: 500, damping: 40"] },
  { selector: "[data-pin=mode] [aria-checked=true] > span:last-child", name: "Selected label", token: "--ds-color-ink", value: "Inter 14 / 500", source: "ModeToggle.tsx:41-43", expect: ["font-sans font-medium", "text-[#0a1b33]"] },
  { selector: "[data-pin=mode] [aria-checked=false]", name: "Rest option", token: "--ds-color-on-blue-80", value: "w 112, py 8", source: "ModeToggle.tsx:42-43", expect: ["w-28 py-2 text-[14px]", "text-white/80"], side: "right" },
];

export const JOBS_PINS: readonly Pin[] = [
  { selector: "#jobs [role=tablist]", name: "Track", token: "--ds-color-surface", value: "white, hairline, p 4, about 41.5 tall", source: "Jobs.tsx:118", expect: "rounded-full border border-slate-200/80 bg-white p-1", padding: true },
  { selector: "#jobs [role=tab][aria-selected=true]", name: "Selected", token: "--ds-color-primary", value: "a navy fill that jumps, no thumb", source: "Jobs.tsx:130", expect: "bg-[#0a152d] text-white" },
  { selector: "#jobs [role=tab][aria-selected=false]", name: "Rest tab", token: "--ds-color-text-muted", value: "13 / 500, px 14, py 6", source: "Jobs.tsx:128,131", expect: ["rounded-full px-3.5 py-1.5 font-sans text-[13px] font-medium", "text-[#64748b]"], side: "right" },
];

const SS = "segmented-styles.ts";

export const SEG_PINS: readonly Pin[] = [
  { selector: "[data-pin=seg] [role=radiogroup]", name: "Track", token: "--ds-color-line", value: "a 1px line, 3px inside it, segment plus 8", source: `${SS}:19,27`, expect: ["rounded-full border p-", "border-(--ds-color-line)"], padding: true },
  { selector: "[data-pin=seg] [aria-checked=true] > span:first-child", name: "Thumb", token: "--ds-color-primary, --ds-shadow-thumb", value: "slides on spring 500 / 40", source: `Segmented.tsx:137,139, ${SS}:21`, expect: ["layoutId={thumbId", "SPRING.thumb", "bg-(--ds-color-primary) shadow-(--ds-shadow-thumb)"] },
  { selector: "[data-pin=seg] [aria-checked=true] > span:last-child", name: "Selected label", value: "white, Inter 14 / 500", source: `${SS}:31`, expect: "text-white ${FORCED_ON}" },
  { selector: "[data-pin=seg] [aria-checked=false]", name: "Segment", token: "--ds-color-text-muted", value: "md 36, px 14", source: `${SS}:13,29`, expect: ["h-9 px-3.5 text-[14px]", "text-(--ds-color-text-muted)"], side: "right" },
];

/** The Jobs switch's states, read off its class strings, and the one the system changes on purpose. */
export const JOBS_ROWS: readonly KeyRow[] = [
  { key: "rest", value: "The label in #64748b, Inter 13 / 500 on the white track.", source: "Jobs.tsx:128, 131" },
  { key: "hover", value: "The label turns accent over 200ms.", source: "Jobs.tsx:128, 131" },
  { key: "selected", value: "A navy #0a152d fill and a white label that jump to the chosen tab, with no thumb sliding between.", source: "Jobs.tsx:130" },
  { key: "focus", value: "The browser outline only.", source: "Jobs.tsx:127-132" },
  { key: "system hover", value: "Segmented turns its rest label ink instead, a deliberate change, so the accent keeps meaning attention.", source: `${SS}:29-30` },
];

export const MODE_ROWS: readonly KeyRow[] = [
  { key: "hover", value: "The resting label goes from white 80% to white over 200ms.", source: "ModeToggle.tsx:43" },
  { key: "auto-flip", value: "In the players section it flips every 5s until the visitor picks, then the choice sticks per player.", source: "usePlayerMode.ts:11" },
  { key: "keyboard", value: "Both radios are tab stops and the arrows do nothing, which the system control fixes.", source: "ModeToggle.tsx:34" },
  { key: "focus", value: "The browser outline only.", source: "ModeToggle.tsx:40" },
];

/** Where each ground's slot is written in SEG_GROUND. */
const GROUND_LINE: Record<SegmentedGround, Record<"track" | "rest" | "on" | "thumb", number>> = {
  light: { track: 27, rest: 29, on: 31, thumb: 32 },
  container: { track: 35, rest: 37, on: 39, thumb: 40 },
  blue: { track: 43, rest: 45, on: 47, thumb: 48 },
};

/** A ground's row read from its own classes in SEG_GROUND: the token it names, else the literal it sets
 *  (white or transparent), else none. The track's line is a border, read as a ring if it ever is one. */
function groundRow(part: string, ground: SegmentedGround, slot: "track" | "rest" | "on" | "thumb", prop: "bg" | "text" | "line"): ValueRow {
  const cls = SEG_GROUND[ground][slot];
  const props = prop === "line" ? (["border", "ring"] as const) : ([prop] as const);
  const source = `${SS}:${GROUND_LINE[ground][slot]}`;
  for (const p of props) {
    const name = restToken(cls, p);
    if (name) return tv(part, name, source);
    const lit = new RegExp(`(?:^|\\s)${p}-(white|transparent)(?:\\s|$)`).exec(cls)?.[1];
    if (lit) return sv(part, lit, source);
  }
  return sv(part, "none", source);
}

export const SEG_VALUES: readonly ValueRow[] = [
  groundRow("Light track", "light", "track", "bg"),
  groundRow("Light line", "light", "track", "line"),
  groundRow("Light thumb", "light", "thumb", "bg"),
  groundRow("Light selected label", "light", "on", "text"),
  groundRow("Light rest label", "light", "rest", "text"),
  groundRow("Container track", "container", "track", "bg"),
  groundRow("Container line", "container", "track", "line"),
  groundRow("Container thumb", "container", "thumb", "bg"),
  groundRow("Container selected label", "container", "on", "text"),
  groundRow("Container rest label", "container", "rest", "text"),
  groundRow("Blue track", "blue", "track", "bg"),
  groundRow("Blue line", "blue", "track", "line"),
  groundRow("Blue thumb", "blue", "thumb", "bg"),
  groundRow("Blue selected label", "blue", "on", "text"),
  groundRow("Blue rest label", "blue", "rest", "text"),
  tv("Thumb shadow", "shadow-thumb"),
  tv("Hover label", "color-ink"),
  tv("Thumb slide", "spring-thumb"),
  tv("Label colour", "dur-ui"),
  sv("Segments", `${ladder("px")}, the track 8 taller`, `${SS}:11-15`),
  sv("Lines up by", `the track, ${ladder("track")}`, "control-heights.ts:35"),
  sv("Track", "a 1px line and 3px inside it, the 4px inset the segments sit in", `${SS}:19`),
  sv("Labels", "13 / 14 / 15 at 500, 14px each side", `${SS}:11-15, 55`),
  tv("Press", "scale-press-pill", `${SS}:56`),
  sv("Disabled", "opacity 0.4 on the segment or the whole track", "Segmented.tsx:101, 130"),
];

export const SEG_PROPS: readonly PropRow[] = [
  { name: "options", type: "{ id, label, disabled? }[]", note: "two to four" },
  { name: "value, onChange", type: "T, (id: T) => void" },
  { name: "label", type: "string", note: "the group's accessible name" },
  { name: "size", type: "sm | md | lg", default: "md" },
  { name: "ground", type: "light | container | blue", default: "light" },
  { name: "equal", type: "boolean", default: "false", note: "every segment as wide as the widest" },
  { name: "role", type: "radio | tab", default: "radio" },
  { name: "thumbId", type: "string", note: "unique per instance by default" },
  { name: "optionId, controls", type: "(id: T) => string", note: "tab role: ids and the panels they control" },
  { name: "disabled", type: "boolean", default: "false" },
  { name: "forceOn", type: "T", note: "the segment a forced hover or press shows on" },
  FORCE_PROP,
];

export const SEG_CODE = `import { Segmented } from "@/components/design-system/Segmented";

<Segmented
  label="Show the human or their AI copy"
  options={[{ id: "human", label: "Human" }, { id: "ai", label: "AI" }]}
  value={mode}
  onChange={setMode}
  ground="blue"
/>`;

export const MODE_CODE = `import { ModeToggle } from "@/components/website/ModeToggle";

<ModeToggle mode={mode} onChange={setMode} thumbId="players-thumb" />`;
