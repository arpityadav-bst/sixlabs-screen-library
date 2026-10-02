// Terminal: the shipped JobTerminal, the agent run window inside each job card, on the white card ground
// it ships on. The run data and its timings come from jobs-data.ts and the asserted constants, so the
// step kinds table and the timeline cannot drift from what the window plays.
import { JOBS } from "@/components/website/jobs-data";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Idle, Played, TerminalDemo } from "./terminal-live";
import {
  LONG_RUN,
  RUN_PINS,
  STEP_KIND_ROWS,
  TERMINAL_CODE,
  TERMINAL_PINS,
  TERMINAL_PROPS,
  TERMINAL_STATES,
  TERMINAL_VALUES,
} from "./terminal-data";

const SOURCE = { from: "@/components/website/JobTerminal", name: "JobTerminal" };
const DATA = { from: "@/components/website/jobs-data", name: "Step", file: "jobs-data.ts" };
const STATES = ["idle-mouse", "done"] as const;

export function TerminalSection() {
  return (
    <Section
      id="terminal"
      lead="The agent run window inside each job card: it waits, plays its run once when it is asked to, and keeps the result on screen."
    >
      <Spec
        title="Job terminal"
        source={SOURCE}
        props="run play"
        role="The window does the job it describes, typed and printed step by step, and only the one being looked at moves."
        drawer={{ values: TERMINAL_VALUES, props: TERMINAL_PROPS, code: TERMINAL_CODE }}
        note="On the site the card's wrapper sets play on pointer enter (Jobs.tsx:172). Run stands in for it here, and a touch screen plays the window as it scrolls into view."
      >
        <TerminalDemo />
      </Spec>

      <Spec
        title="Window anatomy"
        source={SOURCE}
        role="A flat navy window with only the traffic-light dots in its bar, so the run is the one thing in it that reads."
        caption="idle, then the same window with its run played"
      >
        <Anatomy ground="surface" pins={TERMINAL_PINS} label="Job terminal anatomy">
          <Idle run={JOBS[0].run} />
        </Anatomy>
        <Anatomy ground="surface" pins={RUN_PINS} label="Job terminal anatomy, a played run">
          <Played run={JOBS[0].run} />
        </Anatomy>
      </Spec>

      <Spec
        title="Waiting and done"
        source={SOURCE}
        props="play"
        role="It waits until pointed at, or scrolled into view on touch, plays once, then stays filled as the record of the job."
      >
        <StateGrid
          label="Job terminal states"
          ground="surface"
          states={STATES}
          live={false}
          minCell={360}
          render={({ state }) => (state === "done" ? <Played run={JOBS[1].run} /> : <Idle run={JOBS[1].run} />)}
        />
        <KeyRows label="Every terminal state" rows={TERMINAL_STATES} />
      </Spec>

      <Spec
        title="Step kinds"
        source={DATA}
        role="Six step kinds share one grid, a glyph or label column and then the text, so every run is set the same way."
      >
        <SpecTable
          caption="Step kinds, the first sample of each from JOBS"
          columns={["Kind", "First sample", "Job", "Ink", "Dwell", "Source"]}
          rows={STEP_KIND_ROWS}
          mono={[0, 1, 4, 5]}
          minWidth={820}
        />
      </Spec>

      <Spec
        title="Across widths"
        source={SOURCE}
        role="Under md the window shortens and its type steps down, shown in a frame at a true width so the step is the real one."
        caption="375 · 768"
        chips={["max-md:h-[292px]", "max-md:text-[11.5px]"]}
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview
            part="terminal-phone"
            title="Job terminal at phone and tablet width"
            height={384}
            heights={{ 375: 376 }}
            widths={[375, 768]}
            width={375}
          />
        </Canvas>
      </Spec>

      <DoDont>
        <Do ground="surface" reason="Eleven steps fill the window, and the answer lands last, in view.">
          <Played run={JOBS[2].run} />
        </Do>
        <Dont
          ground="surface"
          reason="The body is a fixed 300 with no scroll, so two runs back to back push the answer under the foot."
        >
          <Played run={LONG_RUN} />
        </Dont>
      </DoDont>
    </Section>
  );
}
