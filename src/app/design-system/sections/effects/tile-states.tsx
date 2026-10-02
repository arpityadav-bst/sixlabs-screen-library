// Tile states: default, focused, activated, spent and resetting, the look of each in parameters and the
// machine between them.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { RAMP_VALUES, SPENT_DO, SPENT_DONT, STATE_VALUES, TILE_STATES, TRANSITIONS } from "./tile-states-data";
import { StateMachine } from "./tile-states-diagram";
import { StateSheet, TintFace } from "./tile-states-sheet";
import { FLOOR_LIVE_ID } from "./tile-floor-pins";

export function TileStatesSection() {
  return (
    <Section
      id="tile-states"
      lead="Every tile is in one of five states. The pointer drives the first three, the floor's own clock and autoplay drive the rest."
    >
      <Spec
        title="State machine"
        source={{ from: "@/tiles/interact", name: "startInteraction", file: "interact.js" }}
        chips={["pointer only", "two rigs"]}
        role="A click locks the tile, so its activation always plays to the end and a bust never snaps back half converted."
        drawer={{ label: "Motion constants", values: STATE_VALUES }}
        note="The tiles answer the pointer only. There is no keyboard or focus path to them yet."
      >
        <Canvas ground="page" label="Tile state machine">
          <StateMachine />
        </Canvas>
        <KeyRows label="Transitions" rows={TRANSITIONS} />
      </Spec>

      <Spec
        title="The five looks"
        source={{ from: "@/tiles/focus-rig", name: "createFocusRig", file: "focus-rig.js" }}
        chips={["states.default", "states.shine", "spentTint"]}
        role="Focused is a cobalt slab over the glass and activated a brighter one, so the colour alone says how far along a tile is."
        caption="default is the floor's own render · the other faces are schematics of the params · hover a chip for its name"
        drawer={{ label: "Every colour", values: RAMP_VALUES }}
        note={
          <>
            Try each state on the <a href={`#${FLOOR_LIVE_ID}`}>live floor</a>: hover a tile to focus it, click to activate it.
          </>
        }
      >
        <Canvas ground="container" layout="bleed" label="Tile states side by side">
          <StateSheet states={TILE_STATES} />
        </Canvas>
      </Spec>

      <DoDont>
        <Do reason="TileFloor's light sky-blue wash marks a played tile, so the visitor sees which ones are spent." ground="container">
          <TintFace color={SPENT_DO.color} label={SPENT_DO.label} />
        </Do>
        <Dont reason="The params file's tint is the container grey, so a played tile looks fresh and invites a click it ignores." ground="container">
          <TintFace color={SPENT_DONT.color} label={SPENT_DONT.label} />
        </Dont>
      </DoDont>
    </Section>
  );
}
