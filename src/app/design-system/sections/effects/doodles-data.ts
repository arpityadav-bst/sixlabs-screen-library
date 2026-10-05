// The doodles' values, written once. Stroke timings come from the real drawings (DOODLES), so the
// timeline is the explorer's own. The four pacing constants are not exported by PlayerDoodles, nor is the
// auto switch's AUTO_S by usePlayerMode, so they are written here with their lines, and PACING holds each
// copy to its file, so the day the site changes one Coverage turns red.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import { DOT_GAP, SIZE } from "@/components/website/doodle-geometry";
import { DOODLES } from "@/components/website/player-doodles";
import type { HeldPin } from "./held-pin";

export const DELAY_S = 1; // PlayerDoodles.tsx:19
const AI_LEAD_S = 0.6; // PlayerDoodles.tsx:20
const AI_PACE = 0.5; // PlayerDoodles.tsx:21
const HAND_PACE = 0.6; // PlayerDoodles.tsx:24
/** the auto Human / AI switch, every AUTO_S seconds while the section is in view (usePlayerMode.ts:11) */
export const AUTO_S = 5;

export const PACING: readonly Assertion[] = [
  site(
    "PlayerDoodles.tsx",
    `const DELAY_S = ${DELAY_S};`,
    `const AI_LEAD_S = ${AI_LEAD_S};`,
    `const AI_PACE = ${AI_PACE};`,
    `const HAND_PACE = ${HAND_PACE};`,
  ),
  site("usePlayerMode.ts", `const AUTO_S = ${AUTO_S};`),
];
const round = (n: number) => Math.round(n * 100) / 100;

const strokes = DOODLES.explorer ?? [];
const end = strokes.reduce((m, s) => Math.max(m, s.at + s.dur), 0);
const first = strokes[0];
const handEnd = round(DELAY_S + end * HAND_PACE);
/** when the explorer's hand ends, and when its AI copy ends after a switch, for Choreography's players clock */
export const HAND_END = handEnd;
export const COPY_END = round(AI_LEAD_S + end * AI_PACE);

export const DOODLE_LANES: readonly TimelineLane[] = [
  {
    label: "Hand, from start",
    items: [
      { label: "wait (DELAY_S)", at: 0, to: DELAY_S },
      { label: `${strokes.length} strokes at 0.6x`, at: DELAY_S, to: handEnd },
      { label: "first auto flip (AUTO_S)", at: AUTO_S },
    ],
  },
  {
    label: "AI copy, from the switch",
    items: [
      { label: "lead", at: 0, to: AI_LEAD_S },
      { label: "retrace at 0.5x", at: AI_LEAD_S, to: round(AI_LEAD_S + end * AI_PACE) },
      { label: "first hand line gone", at: round(AI_LEAD_S + (first ? first.dur * AI_PACE : 0) + 0.3) },
    ],
  },
  {
    label: "Back to Human, from the switch",
    items: [
      { label: "copy put away", at: 0, to: 0.3 },
      { label: "hand redraws", at: AI_LEAD_S, to: round(AI_LEAD_S + end * HAND_PACE) },
    ],
  },
  { label: "Wipe, start false", items: [{ label: "all to 0", at: 0, to: 0.2 }] },
];

// The order decision, on the explorer: a visitor who switches to AI half way through DELAY_S, before the
// hand has drawn a line, so the copy's own clock runs ahead of every stroke. Each stroke's copy begins at
// its own place in the copy's pace, or when the hand finishes that stroke, whichever is later
// (PlayerDoodles.tsx:94-97).
const SWITCH_S = DELAY_S / 2;
const begins = strokes.map((s) => Math.max(SWITCH_S + AI_LEAD_S + s.at * AI_PACE, DELAY_S + (s.at + s.dur) * HAND_PACE));
const copyEnd = strokes.reduce((m, s, i) => Math.max(m, begins[i] + s.dur * AI_PACE), 0);
const HAND_LANE: TimelineLane = {
  label: "Hand",
  items: [
    { label: "wait (DELAY_S)", at: 0, to: DELAY_S },
    { label: "draws", at: DELAY_S, to: handEnd },
  ],
};

export const ORDER_DO: readonly TimelineLane[] = [
  HAND_LANE,
  {
    label: "AI copy",
    items: [
      { label: "switch", at: SWITCH_S },
      { label: "waits for the hand", at: SWITCH_S + AI_LEAD_S, to: round(begins[0] ?? DELAY_S) },
      { label: "retraces each finished stroke", at: round(begins[0] ?? DELAY_S), to: round(copyEnd) },
    ],
  },
];

export const ORDER_DONT: readonly TimelineLane[] = [
  HAND_LANE,
  {
    label: "AI copy",
    items: [
      { label: "switch", at: SWITCH_S },
      { label: "retraces lines not drawn yet", at: SWITCH_S + AI_LEAD_S, to: round(SWITCH_S + AI_LEAD_S + end * AI_PACE) },
    ],
  },
];

export const DOODLE_PINS: readonly HeldPin[] = [
  {
    selector: "svg.player-doodles",
    name: "Drawing layer",
    token: "--ds-z-backdrop",
    value: "viewBox 810 × 1080, -z-10 inside an isolated box, overflow visible",
    source: "PlayerDoodles.tsx:138-139",
    expect: ['viewBox="0 0 810 1080"', "absolute inset-0 -z-10 h-full w-full overflow-visible"],
    side: "left",
  },
  {
    selector: "svg.player-doodles > g:first-of-type",
    name: "Hand lines",
    token: "--ds-color-doodle",
    value: "3.5px at 0.85, wavered 6px",
    source: "DoodleStroke.tsx:99",
    expect: "strokeWidth={3.5} strokeOpacity={0.85}",
    side: "right",
  },
  {
    selector: "svg.player-doodles > g:last-of-type",
    name: "AI copy",
    token: "--ds-color-holo-glow",
    value: "3.5px clean line over five glow lines",
    source: "DoodleStroke.tsx:18-24",
    expect: ['const AI_GLOW = "#7fb2ff";', "[5, 0.1],"],
    side: "right",
  },
  {
    selector: '[data-ds="doodle-portrait"]',
    name: "Portrait",
    value: "the still or the clip the drawings sit round",
    source: "Players.tsx:162,169",
    expect: ["<PortraitSwap", 'className="h-[var(--ph)] w-auto max-w-none select-none"'],
    side: "left",
  },
];

export const DOODLE_VALUES: readonly ValueRow[] = [
  { part: "Hand line", token: "--ds-color-doodle", value: "#ffffff, 3.5px at stroke-opacity 0.85", source: "DoodleStroke.tsx:99" },
  { part: "Dotted line", value: `5px dots every ${DOT_GAP}px, shown as far as the line has drawn`, source: "DoodleStroke.tsx:94, doodle-geometry.ts:15" },
  { part: "Waver", value: "6px at frequency 0.03, points every 2px, at least 32 a piece", source: "doodle-geometry.ts:11-14" },
  { part: "Drawing size", value: `${SIZE} about each drawing's own centre`, source: "doodle-geometry.ts:10" },
  { part: "AI glow", token: "--ds-color-holo-glow", value: "#7fb2ff at widths 26, 20, 14, 9, 5 and opacities 0.04, 0.05, 0.06, 0.08, 0.10", source: "DoodleStroke.tsx:18-25" },
  { part: "Pen point", value: "white r 5, halos r 9 at 0.2 and r 13 at 0.1", source: "DoodleStroke.tsx:17,130-132" },
  { part: "Hand pace", value: `${DELAY_S}s after start, at 0.6x the written timing, easeInOut`, source: "PlayerDoodles.tsx:19,24,84-87" },
  { part: "AI pace", value: "0.6s after the switch, at 0.5x, linear, never before the hand has finished that stroke", source: "PlayerDoodles.tsx:20-21,94-104" },
  { part: "Hand fade", value: "[1, 0.3, 0] over the copy plus 0.3s, times [0, 0.1, 1]", source: "PlayerDoodles.tsx:106-110" },
];

export const DOODLE_PROPS: readonly PropRow[] = [
  { name: "id", type: '"explorer" | "grinder" | "spender" | "lost"', note: "picks the drawing, fixed for the instance's life" },
  { name: "start", type: "boolean", note: "true starts the hand DELAY_S later, false wipes it over 0.2s" },
  { name: "mode", type: '"human" | "ai"', note: "ai retraces it, human puts the copy away and redraws" },
];

export const DOODLE_CODE = `import { PlayerDoodles } from "@/components/website/PlayerDoodles";

<div className="relative isolate h-[480px] aspect-[810/1080]">
  {portrait}
  <PlayerDoodles id="explorer" start={revealed} mode={mode} />
</div>`;

export const DOODLE_RULES: readonly KeyRow[] = [
  { key: "no filters", value: "the waver is in the points and the glow is stacked strokes, after an SVG filter held Safari at 3 to 7 fps", source: "DoodleStroke.tsx:7-10" },
  { key: "reduced motion", value: "every stroke drawn at once", source: "PlayerDoodles.tsx:78-83" },
  { key: "?off=doodles", value: "the layer is display none", source: "app/globals.css:270" },
  { key: "start", value: "Players passes revealed, which stays true once the section has shown", source: "Players.tsx:87-88,159" },
  { key: "stale comment", value: "the header says the doodles are wiped when the section leaves view, and nothing does that", source: "PlayerDoodles.tsx:11" },
  {
    key: "stale pace comment",
    value: `it says the hand has finished before the portrait first turns AI, but the explorer ends at ${handEnd}s, after the ${AUTO_S}s flip`,
    source: "PlayerDoodles.tsx:22-23",
  },
  { key: "two SIZEs", value: "doodle-geometry's SIZE is a scale (0.7), swap-gl's is the frame ({ w: 810, h: 1080 })", source: "doodle-geometry.ts:10, swap-gl.ts:68" },
];
