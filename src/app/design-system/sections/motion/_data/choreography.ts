// The long sequences, as lanes on a clock. The hero clocks start when the tile floor reports ready, the
// terminal's when its run begins. The terminal lanes are built from the real run in jobs-data.ts, timed
// with JobTerminal's step lengths from the guide's one asserted copy (components/terminal-data.ts).
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import type { TimelineItem, TimelineLane } from "@/app/design-system/_kit/Timeline";
import { TIMING, runLanes, stepMs } from "@/app/design-system/sections/components/terminal-data";
import { JOBS } from "@/components/website/jobs-data";
import { AUTO_S, COPY_END, DELAY_S, HAND_END } from "@/app/design-system/sections/effects/doodles-data";
import { PLAYERS_LANES } from "./entrance";

const W = "components/website/";

/** The container hero, seconds after the floor is ready. */
export const CONTAINER_LANES: readonly TimelineLane[] = [
  { label: "Floor logo", items: [{ label: "out", at: 0, to: 0.45 }] },
  { label: "Tiles", items: [{ label: "hold", at: 0, to: 0.5 }, { label: "rise", at: 0.5, to: 1.4 }] },
  { label: "Numbers", items: [{ label: "rise", at: 1.2, to: 1.8 }] },
  { label: "Extras", items: [{ label: "cue and wave button fade", at: 1.8, to: 2.5 }] },
];

export const CONTAINER_ROWS: readonly KeyRow[] = [
  { key: "before ready", value: "the copy fades in over 0.6s from first paint, in CSS, so it never waits for the scripts", source: "app/globals.css:142" },
  { key: "ready", value: "TileFloor's onReady, the floor's first frame drawn", source: `${W}Hero.tsx:150` },
  { key: "extras", value: "1.8s: the floor's hold and rise, then a breath", source: `${W}hero-intro.ts:18` },
];

/** The full view, seconds after the floor is ready (or after the 12s give-up). */
export const FULL_LANES: readonly TimelineLane[] = [
  { label: "Page", items: [{ label: "heroloaded, scroll let go", at: 0 }] },
  { label: "Loader", items: [{ label: "out", at: 0, to: 0.45 }] },
  { label: "Copy", items: [{ label: "fade", at: 0.35, to: 1.05 }] },
  { label: "Floor", items: [{ label: "fade", at: 1.7, to: 2.4 }] },
  { label: "Tiles", items: [{ label: "rise", at: 1.85, to: 2.75 }] },
  { label: "Extras", items: [{ label: "fade", at: 3.45, to: 4.15 }] },
];

export const FULL_ROWS: readonly KeyRow[] = [
  { key: "while loading", value: "wheel, touchmove and the scroll keys are caught on window in capture, the page held at its top", source: `${W}hero-intro.ts:53` },
  { key: "give up", value: "12s: a floor that never comes (no WebGL) lets the page go anyway", source: `${W}hero-intro.ts:19` },
  { key: "window event", value: "heroloaded, which the header waits for before it shows", source: `${W}hero-intro.ts:62` },
];

const TILE_RISE: ValueRow = { part: "Tile rise", token: "--ds-dur-tiles", value: "0.9s, cubic out", source: "tiles/intro.js:12" };

export const CONTAINER_VALUES: readonly ValueRow[] = [
  { part: "Floor logo out", token: "--ds-dur-exit-long", value: "0.45s, to scale 0.96", source: `${W}HeroBits.tsx:142` },
  { part: "Tiles hold", value: "introDelay 0.5s", source: `${W}Hero.tsx:139` },
  TILE_RISE,
  { part: "Numbers", token: "--ds-dur-numbers", value: "0.6s, 1.2s after ready", source: `${W}HeroBits.tsx:35` },
  { part: "Extras", value: "+1.8s", source: `${W}hero-intro.ts:18` },
  { part: "Extras fade", token: "--ds-ease-out-tw", value: "opacity 700ms, Tailwind ease-out", source: `${W}Hero.tsx:37` },
];

export const FULL_VALUES: readonly ValueRow[] = [
  { part: "Loader out", token: "--ds-dur-exit-long", value: "0.45s", source: `${W}HeroLoader.tsx:28` },
  { part: "Copy, floor, extras", value: "+0.35s, +1.7s, +3.45s", source: `${W}hero-intro.ts:17` },
  { part: "Tiles", value: "introDelay 1.85s", source: `${W}hero-intro.ts:16` },
  TILE_RISE,
  { part: "Fades", token: "--ds-ease-out-tw", value: "opacity 700ms, Tailwind ease-out", source: `${W}Hero.tsx:37` },
  { part: "Give up", value: "12s", source: `${W}hero-intro.ts:19` },
];

/** The scroll line's track, in screens of scroll from the moment it reaches the top of the view. */
export const TRACK = { height: 3.9, completeAt: 0.82, wave: 1.3, drain: 1 } as const;

export const TRACK_VALUES: readonly ValueRow[] = [
  { part: "Track", value: "390vh", source: `${W}ScrubLine.tsx:109` },
  { part: "Words full at", value: "0.82 of the words' scroll", source: `${W}ScrubLine.tsx:17` },
  { part: "Going back up", value: "empties 3x as fast", source: `${W}ScrubLine.tsx:20` },
  { part: "Water", value: "the last 1.3 screens of the track", source: `${W}ScrubLine.tsx:23` },
  { part: "Water edge", value: "smoothstep k x k x (3 - 2k)", source: `${W}AccentWave.tsx:88` },
  { part: "Full", value: "0.9 of the view, drained below 0.8", source: `${W}AccentWave.tsx:23` },
  { part: "Drain", value: "1 screen past the players", source: `${W}AccentWave.tsx:24` },
  { part: "Magnet", value: "scroll-snap y proximity plus a JS catch: a scroll resting 120ms within 0.6 of a screen glides in over 0.6s (nativeMagnet, Lenis in desktop Safari)", source: `${W}SafariScroll.tsx:53` },
];

/** The players, seconds after the reveal: the entrance, the explorer's hand, the first two flips and the
 *  AI copy after the first. The magnet is on no clock but the scroll's, so it is under the track above. */
const ENTRANCE_END = Math.max(...PLAYERS_LANES.flatMap((l) => l.items.map((i) => i.to ?? i.at)));
export const PLAYERS_CLOCK: readonly TimelineLane[] = [
  { label: "Entrance", items: [{ label: "cards, portrait, switch, column", at: 0, to: ENTRANCE_END }] },
  { label: "Hand", items: [{ label: "wait", at: 0, to: DELAY_S }, { label: "draws, the explorer", at: DELAY_S, to: HAND_END }] },
  { label: "Portrait", items: [{ label: "AI", at: AUTO_S }, { label: "Human", at: AUTO_S * 2 }] },
  { label: "AI copy", items: [{ label: "retraces", at: +(AUTO_S + 0.6).toFixed(2), to: +(AUTO_S + COPY_END).toFixed(2) }] },
];

export const PLAYERS_CLOCK_ROWS: readonly KeyRow[] = [
  { key: "reveal", value: "the accentwave event says filled, and 20% of the section is in view", source: `${W}Players.tsx:56` },
  { key: "hand", value: `starts ${DELAY_S}s after the reveal, the explorer's drawing done at ${HAND_END}s`, source: `${W}PlayerDoodles.tsx:19` },
  { key: "flips", value: `the portrait turns AI at ${AUTO_S}s and flips every ${AUTO_S}s after, until the visitor picks`, source: `${W}usePlayerMode.ts:11` },
  { key: "copy", value: "the AI copy starts 0.6s after each switch, never before the hand has finished a stroke", source: `${W}PlayerDoodles.tsx:20` },
];

/** The glide: min(2.2, 0.9 + distance / 4000) seconds. */
export const glideSeconds = (px: number) => Math.min(2.2, 0.9 + px / 4000);
export const GLIDE_TICKS = [0, 2000, 4000, 5200, 8000];

export const GLIDE_VALUES: readonly ValueRow[] = [
  { part: "Curve", token: "--ds-ease-glide", value: "1 - (1 - k)^3", source: `${W}glide.ts:10` },
  { part: "Length", value: "min(2.2, 0.9 + distance / 4000) s", source: `${W}jump.ts:38` },
  { part: "Back to top", value: "the same, with the distance from the top", source: `${W}BackToTop.tsx:53` },
  { part: "While it runs", value: "wheel, touch and scroll keys held, scroll snap off", source: `${W}glide.ts:46` },
  { part: "Desktop Safari", value: "runs on Lenis (lerp 0.15), magnet 0.6 of a screen over 0.6s", source: `${W}SafariScroll.tsx:15` },
];

/** One job's run as lanes in ms: the commands typed in, then every step landing in turn. A step keeps the
 *  text the Terminal section's own run lanes give it (runLanes), found by its start, since every dwell is
 *  over 0 and no two steps start together. */
export function terminalLanes(id: string): TimelineLane[] {
  const run = JOBS.find((j) => j.id === id)?.run ?? [];
  const text = new Map(runLanes(run).flatMap((l) => l.items.map((i) => [Math.round(i.at * 1000), i.label] as const)));
  const typed: TimelineItem[] = [];
  const steps: TimelineItem[] = [];
  let t = 0;
  for (const s of run) {
    const d = stepMs(s);
    if (s.t === "cmd") {
      const typing = s.text.length * TIMING.typeMs;
      typed.push({ label: `${s.text.length} characters`, at: t, to: t + typing });
      typed.push({ label: "pause", at: t + typing, to: t + d });
    } else {
      steps.push({ label: `${s.t} · ${text.get(t) ?? ""}`, at: t, to: t + d });
    }
    t += d;
  }
  return [
    { label: "Command", items: typed },
    { label: "Steps", items: steps },
  ];
}

export const TERMINAL_JOB = "intelligence";

export const TERMINAL_VALUES: readonly ValueRow[] = [
  { part: "Typing", value: `${TIMING.typeMs}ms a character`, source: `${W}JobTerminal.tsx:27` },
  { part: "After a command", value: `${TIMING.afterCmdMs}ms`, source: `${W}JobTerminal.tsx:116` },
  { part: "out", value: `${TIMING.step.out}ms`, source: `${W}JobTerminal.tsx:28` },
  { part: "kv", value: `${TIMING.step.kv}ms`, source: `${W}JobTerminal.tsx:28` },
  { part: "check", value: `${TIMING.step.check}ms`, source: `${W}JobTerminal.tsx:28` },
  { part: "bar", value: `${TIMING.step.bar}ms`, source: `${W}JobTerminal.tsx:28` },
  { part: "load", value: `${TIMING.loadMs}ms, or the step's own ms`, source: `${W}JobTerminal.tsx:29` },
  { part: "A line landing", value: "y 3 to 0 over 0.25s on the ease", source: `${W}JobTerminal.tsx:196` },
  { part: "Trigger", value: "pointed at with a mouse, or 60% in view on touch", source: `${W}JobTerminal.tsx:92` },
];
