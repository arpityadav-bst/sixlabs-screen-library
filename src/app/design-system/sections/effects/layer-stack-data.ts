// The page's layers, bottom to top, as the live site stacks them (src/app/website/page.tsx). Each row is
// one plane of the exploded diagram and one KeyRows line, so the two can never disagree.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { Z } from "@/components/design-system/tokens";

export type PlaneLook = "ground" | "glyphs" | "flow" | "water" | "players" | "chrome" | "readout";

export type Layer = {
  n: number;
  name: string;
  z: string;
  look: PlaneLook;
  /** what sits on the plane, in a few words */
  holds: string;
  position: string;
  dom: string;
  source: string;
};

const W = "components/website/";

export const LAYERS: readonly Layer[] = [
  {
    n: 1,
    name: "Ground",
    z: "auto",
    look: "ground",
    holds: "#f9fafb, the body's own background",
    position: "the document",
    dom: "body",
    source: "app/globals.css:16-17",
  },
  {
    n: 2,
    name: "Glyph field",
    z: "-10",
    look: "glyphs",
    holds: "the ASCII canvas at 40%, seen only where nothing above has a ground",
    position: "fixed, inset 0",
    dom: "first in main",
    source: `${W}AsciiBackdrop.tsx:61 · app/globals.css:73`,
  },
  {
    n: 3,
    name: "Flow content",
    z: "auto",
    look: "flow",
    holds: "the hero (floor 0, logo 10, copy 20, loader 30), the scroll line stage, the .page-grain block",
    position: "in flow",
    dom: "Hero, ScrubLine, then .page-grain",
    source: "app/website/page.tsx:33-43",
  },
  {
    n: 4,
    name: "Accent water",
    z: "20",
    look: "water",
    holds: "the halftone canvas, rising over the scroll line and draining before the light sections",
    position: "fixed, inset 0",
    dom: "second in main",
    source: `${W}AccentWave.tsx:193`,
  },
  {
    n: 5,
    name: "Players",
    z: "30",
    look: "players",
    holds: "the section on the water, pulled up 100vh over the line's last screen",
    position: "relative",
    dom: "after ScrubLine",
    source: `${W}Players.tsx:103`,
  },
  {
    n: 6,
    name: "Header and back to top",
    z: "40",
    look: "chrome",
    holds: "the fixed header strip and the round button, later in the DOM",
    position: "fixed",
    dom: "Header first, BackToTop last",
    source: `${W}Header.tsx:53 · ${W}BackToTop.tsx:62`,
  },
  {
    n: 7,
    name: "Perf readout",
    z: "2147483647",
    look: "readout",
    holds: "the ?perf overlay, absent from a normal visit",
    position: "fixed",
    dom: "appended to body",
    source: `${W}perf.ts:56-59`,
  },
];

/** The KeyRows under the diagram: layer, z, position and DOM order, with the source. */
export const LAYER_ROWS: readonly KeyRow[] = LAYERS.map((l) => ({
  key: `${l.n} ${l.name}`,
  value: `z ${l.z} · ${l.position} · ${l.dom}`,
  source: l.source,
}));

/** The drawer: the stacking contexts behind the planes, which the diagram flattens. */
export const LAYER_DETAILS: readonly ValueRow[] = [
  { part: "Hero section", value: "not isolated, so its floor, logo, copy and loader z values join the root context", source: `${W}Hero.tsx:122` },
  { part: "Hero copy", token: "--ds-z-copy", value: "z-20, ties with the water's 20, the hero is earlier in the DOM", source: `${W}Hero.tsx:167` },
  { part: "Hero loader", token: "--ds-z-stage", value: "z-30, ties with Players while it shows", source: `${W}HeroLoader.tsx:29` },
  { part: "Players portrait", token: "isolate", value: "its own context, so the doodles sit behind the portrait and above the glow", source: `${W}Players.tsx:148` },
  { part: "Players glow", value: "radial-gradient(closest-side, accent 28%, accent 8% 55%, transparent)", source: `${W}Players.tsx:111` },
  {
    part: "Players content, scaled",
    value: "on a dense screen (DPR 1.5 up) wider than 1920px, usePlayersScale sets scale() up to 1.35 on the content div, which makes it its own stacking context inside the section's z 30",
    source: `${W}usePlayersScale.ts:24 · ${W}Players.tsx:107`,
  },
  { part: ".page-grain", value: "its own ground, which covers the glyph field from Understands to the footer", source: "app/globals.css:223-225" },
  { part: "Glyph field rest", value: "it stops drawing while [data-covers-view] fills the screen (the full-view hero)", source: `${W}AsciiBackdrop.tsx:37` },
  { part: "Header on the water", value: "solid white while the water fills the view", source: `${W}Header.tsx:56` },
];

/** The z-scale, from tokens.ts: the shipped layers and the four the system adds for new parts. */
export const Z_ROWS = Z.map((t) => [
  `--ds-${t.name}`,
  t.value,
  t.useFor,
  t.source,
]);

/** The two Do / Don't stacks: a new popover placed on the scale, and one placed on a taken value. */
export type MiniPlane = { name: string; z: string; look: PlaneLook; hot?: boolean };

export const DO_STACK: readonly MiniPlane[] = [
  { name: "Accent water", z: "20", look: "water" },
  { name: "Header", z: "40", look: "chrome" },
  { name: "New menu panel", z: "45", look: "chrome", hot: true },
];

export const DONT_STACK: readonly MiniPlane[] = [
  { name: "New menu panel", z: "20", look: "chrome", hot: true },
  { name: "Accent water", z: "20", look: "water" },
  { name: "Header", z: "40", look: "chrome" },
];
