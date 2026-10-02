// The glass tile floor: the hero's signature, live and interactive in a box of the hero's kind, its scene
// values read from the params file, and the wave button that resets it.
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import {
  FLOOR_CODE,
  FLOOR_PROPS,
  FLOOR_VALUES,
  SCENE_ROWS,
  WAVE_CODE,
  WAVE_PROPS,
  WAVE_STATES,
  WAVE_VALUES,
} from "./tile-floor-data";
import { FloorLive } from "./tile-floor-live";
import { FLOOR_LIVE_ID, INTRO_DELAY } from "./tile-floor-pins";
import { WaveAnatomy, WaveDoDont, WaveStates } from "./tile-floor-wave";

export function TileFloorSection() {
  return (
    <Section
      id="tile-floor"
      lead="A deterministic three.js field of frosted glass tiles seen down a long lens, each carrying a player who turns into their hologram. It is the one live floor on this page."
    >
      <Spec
        id={FLOOR_LIVE_ID}
        title="Live floor"
        source={{ from: "@/components/tiles/TileFloor", name: "TileFloor" }}
        props="className introDelay onReady"
        chips={["WebGL", "HeavySlot floor"]}
        role="Hover a tile to focus it, click to activate it, and send the next wave from the corner, exactly as the hero ships."
        caption={`introDelay ${INTRO_DELAY}, the container hero's · the shape switch changes only the box, the camera reframes itself`}
        drawer={{ values: FLOOR_VALUES, props: FLOOR_PROPS, code: FLOOR_CODE }}
        warn="One floor per document. lean.js:62 swaps three's tone-mapping chunk and restores it on dispose, so a second floor compiles with the wrong curve. Pressing R anywhere on the window resets every character."
      >
        <FloorLive />
      </Spec>

      <Spec
        title="Scene"
        source={{ from: "@/tiles/floor", name: "createFloor", file: "floor.js" }}
        chips={["floor-params.json"]}
        role="Every look value lives in the one params file the engine fetches at load, so a look change never touches the engine's code."
      >
        <KeyRows label="Scene values" rows={SCENE_ROWS} />
      </Spec>

      <Spec
        title="Next wave"
        source={{ from: "@/components/website/HeroBits", name: "WaveButton" }}
        props="full busy"
        role="The visitor's one control over the floor: it flips every tile on screen to the other cast and restarts autoplay from the middle."
        drawer={{ values: WAVE_VALUES, props: WAVE_PROPS, code: WAVE_CODE }}
        note="It has no focus ring of its own, so the browser's outline is all a keyboard visitor sees."
      >
        <WaveAnatomy />
        <WaveStates />
        <KeyRows label="Next wave, per state" rows={WAVE_STATES} />
      </Spec>

      <WaveDoDont />
    </Section>
  );
}
