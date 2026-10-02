// The scroll set-piece's values, written once: the frame's pins, the liquid's and the tiles' settings, and
// the six tiles read from the real BADGES. The word fill's numbers come from ScrubLine's own exports, a
// client module, so they live in scrub-exports.ts and print from a client leaf.
import type { AnatomyPin } from "@/app/design-system/_kit/Anatomy";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { BADGES } from "@/components/website/floating-badges-data";

export const TILE = BADGES[0];
export const TILE_NAME = TILE.cast[0];

export const SETPIECE_PINS: readonly AnatomyPin[] = [
  { selector: "#model-line > div", name: "Stage", value: "sticky for one screen, carries --line-h", source: "ScrubLine.tsx:111-113", side: "left" },
  { selector: "#model-line p", name: "Line", token: "--ds-type-scroll-line", value: "Outfit 500, 26 then 44 from md, 1.3, max 980", source: "ScrubLine.tsx:116-122", side: "right" },
  { selector: ".floating-badges img", name: "Floating tile", value: "one of six, at its own depth and tilt", source: "FloatingBadges.tsx:166-170", side: "left" },
  { selector: "#model-line p > canvas", name: "Liquid canvas", value: "56px past the line, desktop only", source: "LiquidLine.tsx:138-150", side: "right" },
];

export const SETPIECE_VALUES: readonly ValueRow[] = [
  { part: "Liquid gate", value: "min-width 1024, hover, fine pointer, motion allowed", source: "LiquidLine.tsx:17" },
  { part: "Liquid room", value: "56px past the line on every side, hidden below lg", source: "LiquidLine.tsx:12,141" },
  { part: "Liquid look", value: "distortion 0.6, aberration 0.225, grain 0.3, sheen 0.48, iridescence 0.45, splash 0.36 (0.3 of the demo)", source: "liquid/liquid-sim.ts:12-13" },
  { part: "Liquid flow", value: "persistence 0.6, swirl 0.5, cursor size 1, no idle drift", source: "liquid/liquid-sim.ts:13" },
  { part: "Simulation", value: "velocity and pressure at 128, the dragged field at 256, 4 pressure steps, 1/60 step", source: "liquid/liquid-sim.ts:14" },
  { part: "Picture fill", value: "0.2s a word, the spans' own 200ms", source: "LiquidLine.tsx:13" },
  { part: "Live", value: "the real words turn transparent and stay for layout, selection and reading", source: "ScrubLine.tsx:121" },
  { part: "Tile parallax", value: "spring 60 / 18, 22px x depth at the screen's edge, hover devices with motion allowed", source: "FloatingBadges.tsx:31,39-40" },
  { part: "Tile bob", value: "5.5s ease-in-out, 0 to -7px, off under reduced motion", source: "app/globals.css:77-86" },
  { part: "Tile flip", value: "every 3.5 to 6.5s, 0.8s, one tile at a time, only within half a screen", source: "FloatingBadges.tsx:32-33,48" },
  { part: "Off switches", value: "?off=liquid shows the words' own ink, ?off=tiles hides the tiles", source: "LiquidLine.tsx:42, app/globals.css:269" },
];

export const SETPIECE_PROPS: readonly PropRow[] = [
  { name: "ScrubLine", type: "no props", note: "renders #model-line, so only a frame may mount it" },
  { name: "LiquidLine", type: "{ para, lit, accents, onLive }", note: "reads the line's layout from para" },
  { name: "createLiquid", type: "(canvas, picture, frame) => { destroy } | null", note: "WebGL2, destroy does not force the context's loss" },
  { name: "FloatingBadges", type: "no props", note: "reads --line-h off the stage for the phone rows" },
];

/** the live stage's height, px: the site's stage is one screen tall, and the spots are shares of it */
export const TILES_STAGE = 640;

/** Pins on the real FloatingBadges' first tile. The spot is still, moving only with the cursor. The bob, the
 *  tile and the picture ride the endless bob, so each is measured at one moment of it. */
export const TILE_PINS: readonly AnatomyPin[] = [
  { selector: ".floating-badges > div", name: "Spot", value: `left ${TILE.x}, top ${TILE.y} from 1600, other spots below it · drifts 22px × ${TILE.depth} with the cursor`, source: "FloatingBadges.tsx:152-165", side: "left" },
  { selector: ".floating-badges .badge-bob", name: "Bob", value: "5.5s ease-in-out, 0 to -7px · measured at one moment of the loop", source: "app/globals.css:77-83", side: "right" },
  { selector: ".floating-badges .badge-bob > div > div", name: "Tile", value: `${TILE.size}px from 1600 at ${TILE.tilt} degrees, flips on a 900px perspective · rides the bob`, source: "FloatingBadges.tsx:167-177", side: "right" },
  { selector: ".floating-badges img", name: "Picture", value: "pre-rendered glass tile, srcset 384w 512w 768w · rides the bob", source: "floating-badges-data.ts:128-133", side: "left" },
];

export const TILE_VALUES: readonly ValueRow[] = [
  { part: "Width", value: `${TILE.size}px from 1600, 0.8x to 1600, 0.65x to xl, 0.5x on phones`, source: "FloatingBadges.tsx:169" },
  { part: "Depth", value: `${TILE.depth}, times the 22px parallax`, source: "floating-badges-data.ts:35" },
  { part: "Tilt", value: `${TILE.tilt} degrees`, source: "floating-badges-data.ts:36" },
  { part: "Bob delay", value: `${TILE.delay}s, as a negative animation delay`, source: "FloatingBadges.tsx:166" },
  { part: "Flip", value: "rotateY 0 to 90 in 0.4s on [0.4, 0, 1, 1], swap, -90 to 0 in 0.4s on [0, 0, 0.2, 1]", source: "FloatingBadges.tsx:132-150" },
  { part: "Files", value: "/tiles/float/[384/|512/]<name>.webp?v=6", source: "floating-badges-data.ts:127-131" },
];

export const TILE_CODE = `import { FloatingBadges } from "@/components/website/FloatingBadges";

// no props: the six tiles fill the nearest positioned box, placed as shares of it
<div className="relative h-svh">
  <FloatingBadges />
</div>`;

/** the share of a tile's size it shows at each width band (FloatingBadges.tsx:169) */
export const TILE_SCALES = [
  { name: "phone", factor: 0.5 },
  { name: "tablet", factor: 0.65 },
  { name: "laptop", factor: 0.8 },
  { name: "1600 up", factor: 1 },
] as const;

export const BADGE_COLUMNS = ["Opens on", "Size", "Depth", "Tilt", "Bob delay", "Rest of the cast"] as const;
export const BADGE_ROWS: readonly (readonly string[])[] = BADGES.map((b) => [
  b.cast[0],
  `${b.size}px`,
  String(b.depth),
  `${b.tilt} deg`,
  `${b.delay}s`,
  b.cast.slice(1).join(", "),
]);

/** the line's first sentence, quoted from ScrubLine.tsx:15, for the tile pair */
export const LINE_QUOTE = "A model is built from what the person does, not what they say.";
