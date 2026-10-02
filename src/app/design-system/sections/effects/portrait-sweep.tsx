// Human / AI sweep: the real PortraitSwap on the accent ground (the 2D path on the stills, the WebGL path
// through StackedSwap in a HeavySlot, the clip this browser plays on the homepage), bound to the real
// ModeToggle, its settled states, its timing and formats, and the switch's one trap.
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { LiveToggle, SweepCell, SweepLab, ThumbPair } from "./portrait-sweep-live";
import {
  FORMAT_ROWS,
  SWEEP_CODE,
  SWEEP_LANES,
  SWEEP_PROPS,
  SWEEP_VALUES,
  SWITCH_ROWS,
} from "./portrait-sweep-data";

const SWAP = { from: "@/components/website/PortraitSwap", name: "PortraitSwap" };
const TOGGLE = { from: "@/components/website/ModeToggle", name: "ModeToggle" };
const SETTLED = ["human", "ai"] as const;
const NONE: readonly never[] = [];

export function PortraitSweepSection() {
  return (
    <Section
      id="portrait-sweep"
      lead="Switching Human / AI sweeps a domed band up the portrait: the new copy below its line, a split-colour halftone across it, a laser along it."
    >
      <Sub title="The sweep">
        <Spec
          title="Human / AI sweep"
          level={4}
          source={SWAP}
          props="mode format"
          chips={["StackedSwap", "ModeToggle"]}
          role="The band shows the copying happen on the body itself, so the switch reads as the player becoming their model."
          caption="480 tall · 1.5s · band 648 · dome 378 (frame px)"
          drawer={{ values: SWEEP_VALUES, props: SWEEP_PROPS, code: SWEEP_CODE }}
          note="The WebGL path holds one context. On the WebGL and clip paths the portrait turns toward the pointer anywhere on the window."
        >
          <SweepLab />
        </Spec>

        <Spec
          title="Settled copies"
          level={4}
          source={SWAP}
          props="mode"
          role="Only a change from the copy on screen sweeps, so each settled state is a plain portrait with no band."
        >
          <StateGrid
            label="Portrait sweep states"
            states={SETTLED}
            ground="on-blue"
            minCell={220}
            liveCaption="switch it here"
            render={({ force }) => <SweepCell mode={force} />}
          />
        </Spec>

        <Spec
          title="Timing and formats"
          level={4}
          source={{ from: "@/components/website/swap-gl", name: "swapGL", file: "swap-gl.ts" }}
          role="Three drawing paths share one geometry, so every browser sees the same band whatever clips it can decode."
        >
          <Timeline label="Sweep timeline" axisLabel="from the switch" lanes={SWEEP_LANES} />
          <KeyRows label="Sweep formats and rules" rows={FORMAT_ROWS} />
        </Spec>
      </Sub>

      <Sub title="The switch">
        <Spec
          title="Human / AI switch"
          level={4}
          source={TOGGLE}
          props="mode thumbId slim"
          role="It sits on the water, so its states are white on blue: a brighter label on hover and a white thumb on the choice."
        >
          <StateGrid label="Human / AI switch" states={NONE} ground="on-blue" liveCaption="hover, Tab or press" render={() => <LiveToggle />} />
          <KeyRows label="Human / AI switch states" rows={SWITCH_ROWS} />
        </Spec>

        <DoDont>
          <Do ground="on-blue" reason="Each mounted switch carries its own thumbId, so its thumb slides only inside its own track.">
            <ThumbPair />
          </Do>
          <Dont ground="on-blue" reason="Two switches on one thumbId share a layoutId, so the thumb can fly from one track to the other.">
            <ThumbPair shared />
          </Dont>
        </DoDont>
      </Sub>
    </Section>
  );
}
