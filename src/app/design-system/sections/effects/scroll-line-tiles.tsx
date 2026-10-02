// The floating tiles' specimens: the real FloatingBadges in a stage of its own (mounted while near the view,
// TilesStage), all six tiles with their bob, tilt, flip and cursor drift, pinned on its first tile, then the
// picture files at the widths a tile takes by breakpoint, the six tiles from BADGES and the decision about the
// line. The ladder and the pair show the tile's picture alone (the real files from the real helpers), since
// they are about its size and its place, not its motion.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { typeStyle } from "@/components/design-system/tokens";
import { src, srcSet } from "@/components/website/floating-badges-data";
import {
  BADGE_COLUMNS,
  BADGE_ROWS,
  LINE_QUOTE,
  TILE,
  TILE_CODE,
  TILE_NAME,
  TILE_PINS,
  TILE_SCALES,
  TILE_VALUES,
  TILES_STAGE,
} from "./scroll-line-data";
import { TilesStage } from "./scroll-line-live";
import s from "./fx-live.module.css";

const DATA = { from: "@/components/website/floating-badges-data", name: "BADGES", file: "floating-badges-data.ts" };

/** the first tile's picture alone, at a width */
function Picture({ width, sizes }: { width: number; sizes: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the site's own tile picture, served as is
    <img data-ds="tile" className={s["ds-tile-pic"]} src={src(TILE_NAME)} srcSet={srcSet(TILE_NAME)} sizes={sizes} alt="" aria-hidden="true" width={width} style={{ width }} />
  );
}

const LINE_TYPE = { ...typeStyle("scroll-line"), fontSize: "var(--ds-text-26)" };

export function FloatingTiles() {
  return (
    <>
      <Spec
        title="Floating tiles, live"
        level={4}
        source={{ from: "@/components/website/FloatingBadges", name: "FloatingBadges" }}
        chips={["badge-bob"]}
        role="The tiles are the floor's own glass, pre-rendered, so the hero's material carries on round the line at no WebGL cost."
        caption={`the real FloatingBadges in a ${TILES_STAGE} tall stage · pinned on tile 1, ${TILE_NAME} · ${TILE.size}px · ${TILE.tilt} deg · bob 5.5s · flip every 3.5 to 6.5s`}
        note="The tiles take their places and sizes from the window's width, as on the site, so a narrower window shows them in rows above and below where the line would be. With a mouse they drift with the cursor anywhere in the window."
        drawer={{ values: TILE_VALUES, code: TILE_CODE }}
      >
        <Anatomy pins={TILE_PINS} ground="page" layout="stack" label="Floating tiles">
          <TilesStage height={TILES_STAGE} />
        </Anatomy>
      </Spec>

      <Spec
        title="Tile widths by breakpoint"
        level={4}
        source={DATA}
        props="size"
        role="A tile shrinks with the screen and keeps its picture sharp, because srcset picks the file nearest the width it shows at."
      >
        <SizeLadder
          axis="width"
          label="Floating tile widths"
          sizes={TILE_SCALES.map((t) => {
            const w = Math.round(TILE.size * t.factor * 10) / 10;
            return { name: t.name, spec: w, node: <Picture width={w} sizes={`${w}px`} />, select: '[data-ds="tile"]' };
          })}
        />
      </Spec>

      <Spec
        title="The six tiles"
        level={4}
        source={DATA}
        role="Each tile has its own depth, tilt and bob delay, so the six never move as one sheet."
      >
        <SpecTable caption="The six floating tiles" columns={BADGE_COLUMNS} rows={BADGE_ROWS} mono={[0, 1, 2, 3, 4]} minWidth={720} />
      </Spec>

      <DoDont>
        <Do reason="The tiles sit round the line at an offset from its own height, so every word stays readable.">
          <div className={s["ds-line-demo"]}>
            <p className={s["ds-line-text"]} style={LINE_TYPE}>
              {LINE_QUOTE}
            </p>
            <Picture width={120} sizes="120px" />
          </div>
        </Do>
        <Dont reason="The line is the section's one message, and a tile over a word costs the sentence its reading.">
          <div className={s["ds-line-demo"]}>
            <p className={s["ds-line-text"]} style={LINE_TYPE}>
              {LINE_QUOTE}
            </p>
            <div className={s["ds-line-over"]}>
              <Picture width={120} sizes="120px" />
            </div>
          </div>
        </Dont>
      </DoDont>
    </>
  );
}
