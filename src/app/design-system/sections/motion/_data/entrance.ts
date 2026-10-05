// The entrance section's rows. Rise travel and length come from motion.ts (RISE), the staggers and
// thresholds are the ones Understands, Jobs and Players ship, cited by line.
import type { TimelineLane } from "@/app/design-system/_kit/Timeline";
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { site, type Assertion } from "@/app/design-system/sections/foundations/foundation-assert";
import { COPIES_BASE, heroStats } from "@/app/design-system/sections/components/stats-typed-data";
import { RISE } from "@/components/design-system/motion";
import { PLAYERS } from "@/components/website/players-data";

const W = "components/website/";

/** `vs`: the last beat is the small disc over the gutter between the cards, not a third card. */
export type RisePlan = { delays: readonly number[]; y: number; duration: number; amount: number; vs?: boolean };

/** Understands: the two cards, then the vs disc over their gutter, 0.15s apart, once 40% of each is in view. */
export const UNDERSTANDS_RISE: RisePlan = { delays: [0, 0.15, 0.3], y: RISE.y, duration: RISE.duration, amount: 0.4, vs: true };
/** Jobs: the cards 0.12s apart after 0.1s, once the row is 15% in view. */
export const JOBS_RISE: RisePlan = { delays: [0.1, 0.22, 0.34], y: RISE.y, duration: RISE.duration, amount: 0.15 };
/** Don't: the Understands beats with three times the travel and more than twice the length. */
export const LONG_RISE: RisePlan = { delays: [0, 0.4, 0.8], y: 96, duration: 1.6, amount: 0.4, vs: true };

export const RISE_VALUES: readonly ValueRow[] = [
  { part: "Travel", token: "--ds-rise-y", value: "28px up", source: `${W}Understands.tsx:45` },
  { part: "Length", token: "--ds-dur-rise", value: "0.7s", source: `${W}Understands.tsx:48` },
  { part: "Curve", token: "--ds-ease-out", value: "cubic-bezier(0.22, 1, 0.36, 1)", source: `${W}Understands.tsx:18` },
  { part: "Understands stagger", value: "the cards at 0 and 0.15s, the vs disc at 0.3s", source: `${W}Understands.tsx:67, 74, 85` },
  { part: "Understands threshold", value: "amount 0.4, once", source: `${W}Understands.tsx:47` },
  { part: "Jobs heading threshold", value: "amount 0.25, once", source: `${W}Jobs.tsx:49` },
  { part: "Jobs cards stagger", value: "0.1 + k x 0.12s", source: `${W}Jobs.tsx:149` },
  { part: "Jobs row threshold", value: "15% of the row in view", source: `${W}Jobs.tsx:72` },
];

export const RISE_PROPS: readonly PropRow[] = [
  { name: "RISE.y", type: "number", default: "28", note: "px of travel" },
  { name: "RISE.duration", type: "number", default: "0.7", note: "seconds" },
];

export const RISE_CODE = `import { EASE, RISE } from "@/components/design-system/motion";

<motion.div
  initial={{ opacity: 0, y: RISE.y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: RISE.duration, ease: EASE, delay: 0.15 * k }}
/>`;

/** The hero's figures from the guide's one copy (stats-typed-data.ts), the copies at their published start. */
export const HERO_STATS = heroStats(COPIES_BASE);

/** Hero.tsx keeps its figures private, so the copy is checked against the text it was read from. */
export const HERO_STATS_SOURCE: Assertion = site("Hero.tsx", "1_009_271", 'value: "2B"', '"Digital copies made"');

export const NUMBERS_VALUES: readonly ValueRow[] = [
  { part: "Travel", token: "--ds-numbers-y", value: "6px up", source: `${W}HeroBits.tsx:33` },
  { part: "Length", token: "--ds-dur-numbers", value: "0.6s", source: `${W}HeroBits.tsx:35` },
  { part: "Wait once ready", value: "1.2s, the logo out and the tiles in", source: `${W}HeroBits.tsx:35` },
  { part: "Live count", token: "--ds-dur-exit-long", value: "opacity 0.4 to 1 over 0.45s per count", source: `${W}HeroBits.tsx:63` },
  { part: "Full view", value: "no entrance: the figures show with the copy", source: `${W}HeroBits.tsx:33` },
];

export const NUMBERS_PROPS: readonly PropRow[] = [
  { name: "stats", type: "Stat[]", note: "value, label lines, tone class, live" },
  { name: "ready", type: "boolean", note: "the floor is ready, the rise is booked 1.2s later" },
  { name: "left", type: "boolean", note: "the full view's placement, no entrance" },
];

export const NUMBERS_CODE = `import { HeroNumbers } from "@/components/website/HeroBits";

<HeroNumbers stats={stats} ready={floorReady} left={false} />`;

const R = 0.5; // the players reveal's length
const at = (delay: number, label: string) => ({ label, at: delay, to: delay + R });

/** The players reveal, from the moment the water announces full. */
export const PLAYERS_LANES: readonly TimelineLane[] = [
  { label: "Cards", items: PLAYERS.map((p, k) => at(+(k * 0.05).toFixed(2), p.title)) },
  { label: "Portrait", items: [at(0.1, "rise")] },
  { label: "Switch", items: [at(0.15, "rise, under lg")] },
  { label: "Detail", items: [at(0.2, "rise")] },
];

export const PLAYERS_ROWS: readonly KeyRow[] = [
  { key: "trigger", value: "the accentwave event says filled, and 20% of the section is in view", source: `${W}Players.tsx:59` },
  { key: "travel", value: "24px up over 0.5s on the ease", source: `${W}Players.tsx:91` },
  { key: "settle", value: "unselected cards stop at opacity 0.6, 0.85 on hover", source: `${W}Players.tsx:28` },
  { key: "doodles", value: "the hand starts drawing 1s after the section comes in", source: `${W}PlayerDoodles.tsx:19` },
  { key: "once", value: "once in, it stays: leaving or the water draining does not send it back out", source: `${W}Players.tsx:88` },
];

export const PLAYERS_VALUES: readonly ValueRow[] = [
  { part: "Travel", token: "--ds-reveal-y", value: "24px", source: `${W}Players.tsx:91` },
  { part: "Length", token: "--ds-dur-reveal", value: "0.5s", source: `${W}Players.tsx:93` },
  { part: "Cards", value: "k x 0.05s", source: `${W}Players.tsx:218` },
  { part: "Portrait", value: "0.1s", source: `${W}Players.tsx:147` },
  { part: "Switch (under lg)", value: "0.15s", source: `${W}Players.tsx:197` },
  { part: "Detail and carousel", value: "0.2s", source: `${W}Players.tsx:120` },
];
