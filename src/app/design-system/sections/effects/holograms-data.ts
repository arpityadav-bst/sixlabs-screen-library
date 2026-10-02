// The busts and their hologram copies: the first names of the floor's first cast, the four players'
// straight-ahead stills, the decal's geometry from floor-params.json and the order pictures load in.
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { PLAYERS } from "@/components/website/players-data";
import { FP, PARAMS } from "./floor-params-data";

const T = "tiles/";

export type Pair = { key: string; label: string; human: string; ai: string };

/** The first eight names of casts.chars, each human beside its hologram (identical file names). */
export const TILE_PAIRS: readonly Pair[] = FP.chars.slice(0, 8).map((file) => ({
  key: file,
  label: file.replace(/\.webp$/, ""),
  human: `/tiles/chars/${file}`,
  ai: `/tiles-holo/chars-ai/${file}`,
}));

/** Every player with both clips, its human still beside its AI still. */
export const PLAYER_PAIRS: readonly Pair[] = PLAYERS.flatMap((p) =>
  p.video && p.aiVideo ? [{ key: p.id, label: p.title, human: p.video.still, ai: p.aiVideo.still }] : [],
);

export const CAST_CAPTION = `casts.chars ${FP.chars.length} · casts.chars2 ${FP.chars2.length} · 768px, 512px under 768 wide · alpha WebP`;

/** The decal on the tile, numbered as the diagram numbers it. */
export const DECAL_ROWS: readonly KeyRow[] = [
  { key: "1 Tile outline", value: `the clip: the rounded square inset ${FP.charInset}, soft edge ${FP.charEdgeSoft}`, source: `${T}characters.js:14-30` },
  { key: "2 Bust plane", value: `size ${FP.charSize}, stretched ${FP.charStretch} along the diagonal, head to the rear corner`, source: `${T}characters.js:139` },
  { key: "3 Push", value: `${FP.charForward} toward the camera corner, along the diagonal`, source: `${T}characters.js:131` },
  { key: "Lift", value: "0.002 above the top, riding the tile as it rises", source: `${T}characters.js:140` },
];

/** The drawer: how the decal is drawn. */
export const DECAL_VALUES: readonly ValueRow[] = [
  { part: "Material", value: "basic, transparent, no depth write, not tone-mapped", source: `${T}characters.js:13` },
  { part: "Polygon offset", value: "-8, so the bust never fights the glass top", source: `${T}characters.js:13` },
  { part: "Mip bias", token: "charLodBias", value: `${FP.charLodBias}, a sharper pick at the long lens`, source: `${T}characters.js:28` },
  { part: "Draw order", value: "human 3, hologram 4, both sharing one uScan", source: `${T}characters.js:141` },
  { part: "Crossfade", value: "uScan is a plain opacity fade across the whole bust, not a wipe", source: `${T}interact.js:66` },
  { part: "Active bust", token: "charActive", value: FP.charActive, source: PARAMS },
];

/** The loading plan, in the order pictures are fetched. */
export const LOAD_ROWS: readonly KeyRow[] = [
  { key: "1 Humans on screen", value: "most central first, and the floor waits only for these", source: `${T}load-plan.js:15-17` },
  { key: "2 Humans off screen", value: "there for a resize", source: `${T}load-plan.js:16` },
  { key: "3 First hologram", value: "the one autoplay converts first, the most central tile with 0.4 of it in view", source: `${T}load-plan.js:15-16` },
  { key: "4 Other holograms", value: "in the same central-first order", source: `${T}load-plan.js:16` },
  { key: "Decode and upload", value: "decoded off the main thread, then one GPU upload per idle moment", source: `${T}upload.js:1-4` },
  { key: "One cast on the GPU", value: "the other is fetched when a wave is near and let go after it, about 230 MB saved", source: `${T}casts.js:1-10` },
];

/** Where the hologram appears, the one AI look. */
export const WHERE_ROWS: readonly KeyRow[] = [
  { key: "Tiles", value: "every activated tile's bust, from /tiles-holo/chars-ai", source: "components/tiles/TileFloor.tsx:28" },
  { key: "Players", value: "the Human / AI switch, /players-holo clips and stills", source: "components/website/players-data.ts:21" },
  { key: "Footer", value: "the copy line's picture, /footer/copy-line-holo.webp", source: "components/website/CopyLine.tsx:62" },
];
