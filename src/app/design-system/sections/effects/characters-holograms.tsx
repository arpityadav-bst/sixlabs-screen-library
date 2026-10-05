// Characters and holograms: the busts on the tiles and the players, each beside its blue scan-line
// hologram, how a bust sits on its tile, and the order the pictures load in.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import {
  CAST_CAPTION,
  DECAL_ROWS,
  DECAL_VALUES,
  LOAD_ROWS,
  PLAYER_PAIRS,
  TILE_PAIRS,
  WHERE_ROWS,
} from "./holograms-data";
import { DecalDiagram } from "./holograms-decal";
import { PlayerPairs, Single, TilePairs } from "./holograms-pairs";

export function HologramsSection() {
  const first = TILE_PAIRS[0];
  return (
    <Section
      id="holograms"
      lead="Every AI copy on the site is the same faceless blue scan-line hologram of its human: on the tiles, in the players' Human / AI switch and in the footer's copy line."
    >
      <Spec
        title="Tile casts"
        source={{ from: "@/tiles/casts", name: "createCasts", file: "casts.js" }}
        chips={["/tiles/chars", "/tiles-holo/chars-ai"]}
        role="Each human and its hologram share one file name, so a cast is a list of names and never a list of pairs."
        caption={CAST_CAPTION}
      >
        <Canvas ground="container" label="The first eight of the first cast">
          <TilePairs pairs={TILE_PAIRS} />
        </Canvas>
        <KeyRows label="Where the hologram appears" rows={WHERE_ROWS} />
      </Spec>

      <Spec
        title="Players"
        source={{ from: "@/components/website/players-data", name: "PLAYERS", file: "players-data.ts" }}
        props="video.still aiVideo.still"
        role="The players' copies are the same hologram as the tiles' busts, so the Human / AI switch shows the model the floor promised."
        caption="straight-ahead stills · 810 × 1080 · alpha WebP · on the water"
      >
        <Canvas ground="on-blue" label="Player humans and their holograms">
          <PlayerPairs pairs={PLAYER_PAIRS} />
        </Canvas>
      </Spec>

      <Spec
        title="Decal"
        source={{ from: "@/tiles/characters", name: "addCharacters", file: "characters.js" }}
        chips={["charSize", "charStretch", "charForward"]}
        role="The bust is stretched along the tile's diagonal so the camera's tilt does not squash the face."
        caption={`plan view · 1 tile = 200px · ${first.label}`}
        drawer={{ label: "Material and draw order", values: DECAL_VALUES }}
      >
        <Canvas ground="container" label="A bust decal on one tile">
          <DecalDiagram picture={first.human} />
        </Canvas>
        <KeyRows label="Decal geometry" rows={DECAL_ROWS} />
      </Spec>

      <Spec
        title="Loading plan"
        source={{ from: "@/tiles/load-plan", name: "planLoad", file: "load-plan.js" }}
        role="The floor waits for the humans it can see, then up to 3s more for the rest of its cast, so the intro never waits on a picture or puts one up mid-move."
      >
        <KeyRows label="Loading order" rows={LOAD_ROWS} />
      </Spec>

      <DoDont>
        <Do reason="The scan-line hologram says model at a glance, wherever the copy appears." ground="container">
          <Single src={first.ai} label="AI copy: the hologram" />
        </Do>
        <Dont reason="The human picture in the AI slot reads as the person, and the page's claim, a model of the player, is gone." ground="container">
          <Single src={first.human} label="AI copy: the human again" />
        </Dont>
      </DoDont>
    </Section>
  );
}
