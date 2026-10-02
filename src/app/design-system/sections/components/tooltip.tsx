// Tooltip: the short label an icon-only control lacks, open on all four sides, through its states, on the
// terminal, and live with its delays. The reasons live in DESIGN.md 7.23.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import {
  TOOLTIP_CLOSE_ROWS,
  TOOLTIP_CODE,
  TOOLTIP_PINS,
  TOOLTIP_PROPS,
  TOOLTIP_STATES,
  TOOLTIP_VALUES,
} from "./tooltip-data";
import { TipAnatomy, TipCell, TipDo, TipDont, TipInverse, TipRow, TipSides } from "./tooltip-specimens";

const SOURCE = { from: "@/components/design-system/Tooltip", name: "Tooltip" };

export function TooltipSection() {
  return (
    <Section
      id="tooltip"
      lead="The words an icon-only control cannot show, on hover and keyboard focus, never the only place a fact lives."
    >
      <Spec
        title="Tooltip"
        source={SOURCE}
        props="content shortcut arrow"
        role="Navy with white words, the same pair as the primary button, so the label reads as part of the control it names."
        drawer={{ values: TOOLTIP_VALUES, props: TOOLTIP_PROPS, code: TOOLTIP_CODE }}
      >
        <Anatomy pins={TOOLTIP_PINS} ground="page" minHeight={200} label="Tooltip anatomy">
          <TipAnatomy />
        </Anatomy>
      </Spec>
      <Spec
        title="Sides"
        source={SOURCE}
        props="side arrow shortcut"
        role="Top by default, with the far side taken when an edge is near, and the arrow kept off so the bubble stays a clean pill."
        caption="offset 8 · open in place, the live bubble flips and slides inside an 8px margin"
      >
        <Canvas ground="page" label="Tooltips on four sides">
          <TipSides />
        </Canvas>
        <Canvas ground="page" label="Tooltips with arrow and shortcut">
          <TipSides arrow shortcut />
        </Canvas>
      </Spec>
      <Spec
        title="States"
        source={SOURCE}
        props="open forceState"
        role="It opens late and leaves fast, so a pointer passing over a row of icons does not set off a string of labels."
      >
        <StateGrid
          label="Tooltip states"
          states={TOOLTIP_STATES}
          minCell={150}
          render={({ state }) => <TipCell state={state} />}
        />
        <KeyRows label="How a tooltip closes" rows={TOOLTIP_CLOSE_ROWS} />
      </Spec>
      <Spec
        title="On the terminal"
        source={SOURCE}
        props="tone"
        role="On the dark terminal the bubble turns white with ink words, so it stands off the window instead of sinking into it."
      >
        <Canvas ground="terminal" label="Inverse tooltip on the terminal">
          <TipInverse />
        </Canvas>
      </Spec>
      <Spec
        title="Delays"
        source={SOURCE}
        props="delay"
        role="The first label waits, and the next opens at once while the pointer stays on the row, so reading along it costs one wait."
        caption="hover left to right, or Tab through"
      >
        <Canvas ground="page" label="Live tooltips in a row">
          <TipRow />
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="An arrow alone does not say which player comes next, so the tooltip carries the words the icon leaves out." ground="page">
          <TipDo />
        </Do>
        <Dont reason="The button already says Sign in, so the tooltip repeats it and covers the page under the pointer.">
          <TipDont />
        </Dont>
      </DoDont>
    </Section>
  );
}
