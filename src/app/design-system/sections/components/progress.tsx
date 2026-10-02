import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas, type Ground } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { contrastRatio } from "@/app/design-system/_kit/contrast";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Progress, type ProgressVariant } from "@/components/design-system/Progress";
import { ProgressCircle } from "@/components/design-system/ProgressCircle";
import { LABEL as LABEL_TONE } from "@/components/design-system/progress-styles";
import { WATER, restColour } from "./contrast-pairs";
import {
  PROGRESS_CODE, PROGRESS_PINS, PROGRESS_PROPS, PROGRESS_VALUES, STATES, TRAIT_CODE, TRAIT_PINS, TRAIT_PROPS,
  TRAIT_VALUES, type ProgressState,
} from "./progress-data";
import { ProgressDemo, TraitsDemo } from "./progress-live";

const BAR = { from: "@/components/design-system/Progress", name: "Progress" };
const CIRCLE = { from: "@/components/design-system/ProgressCircle", name: "ProgressCircle" };
const LABEL = "Building the model";

/** The label row on the water, read from the blue variant's class. */
const BLUE_LABEL = { fg: restColour(LABEL_TONE.blue.name, "text"), bg: WATER };
const BLUE_MISS = (contrastRatio(BLUE_LABEL.fg, BLUE_LABEL.bg) ?? 0) < 4.5;

/** One state of the family, as a bar or a circle, on a ground. */
function StateOf({ form, state, variant }: { form: string; state: ProgressState; variant: ProgressVariant }) {
  const p = {
    label: LABEL,
    variant,
    value: state === "determinate" || state === "paused" ? 35 : 60,
    indeterminate: state === "indeterminate",
    status: state === "complete" || state === "error" || state === "paused" ? state : undefined,
  } as const;
  return form === "bar" ? (
    <div className="w-full">
      <Progress {...p} showValue />
    </div>
  ) : (
    <ProgressCircle {...p} size={40} showValue />
  );
}

function Grid({ variant, ground, label }: { variant: ProgressVariant; ground: Ground; label: string }) {
  return (
    <StateGrid
      label={label}
      ground={ground}
      states={STATES}
      variants={["bar", "circle"] as const}
      live={false}
      minCell={150}
      render={({ state, variant: form }) => (state === "live" ? null : <StateOf form={form} state={state} variant={variant} />)}
    />
  );
}

function Traits() {
  return (
    <Sub title="Trait bars">
      <Spec
        title="Player traits"
        level={4}
        source={{ from: "@/components/website/PlayerTraits", name: "PlayerTraits" }}
        props="traits dense"
        role="Four measures of the picked player, white on the blue, sliding to the next player's values as the pick changes."
        drawer={{ values: TRAIT_VALUES, props: TRAIT_PROPS, code: TRAIT_CODE }}
        note="The bars carry no meter role and no value, so a screen reader hears the label and an empty term."
      >
        <Anatomy ground="on-blue" layout="stack" pins={TRAIT_PINS} label="Trait bars anatomy">
          <TraitsDemo />
        </Anatomy>
      </Spec>
    </Sub>
  );
}

function Family() {
  return (
    <Sub title="Progress">
      <Spec
        title="Anatomy"
        level={4}
        source={BAR}
        props="value showLabel showValue"
        role="An amount with its name and its value in words, so the bar is read as well as seen."
        drawer={{ values: PROGRESS_VALUES, props: PROGRESS_PROPS, code: PROGRESS_CODE }}
      >
        <Anatomy ground="page" layout="stack" pins={PROGRESS_PINS} label="Progress anatomy">
          <ProgressDemo />
        </Anatomy>
      </Spec>
      <Spec title="States" level={4} source={BAR} props="indeterminate status" role="Determinate eases, indeterminate runs a segment by transform alone, complete and error take the status colours, paused holds.">
        <Grid variant="light" ground="page" label="Progress states on light" />
      </Spec>
      <Spec
        title="On the water and the terminal"
        level={4}
        source={BAR}
        props="variant"
        role="Each ground gives the fill a white of its own weight, so the bar reads as a mark there and never as a light."
        caption="water · fill white on white 20% · terminal · fill white 40% on white 8%"
        note={BLUE_MISS ? "The label row misses AA on the water, as its badge reads, a system miss the bar still carries." : undefined}
      >
        <Grid variant="blue" ground="on-blue" label="Progress states on the accent water" />
        <Canvas ground="on-blue" label="The label row on the water">
          <Item label="label row on the water">
            <ContrastBadge fg={BLUE_LABEL.fg} bg={BLUE_LABEL.bg} bgName="the accent water" />
          </Item>
        </Canvas>
        <Grid variant="dark" ground="terminal" label="Progress states on the terminal" />
      </Spec>
      <Spec
        title="Sizes"
        level={4}
        source={BAR}
        props="size"
        role="4 is the default under a label, 2 fits a dense row, 6 matches the trait bars and 8 carries a page-long task."
      >
        <SizeLadder
          label="Bar heights"
          sizes={([2, 4, 6, 8] as const).map((s) => ({
            name: String(s),
            spec: s,
            select: "[role=progressbar] > span",
            node: (
              <div className="w-[160px]">
                <Progress label={LABEL} value={35} size={s} />
              </div>
            ),
          }))}
        />
        <SizeLadder
          label="Circle sizes"
          sizes={([16, 24, 40, 64] as const).map((s) => ({
            name: String(s),
            spec: s,
            node: <ProgressCircle label={LABEL} value={35} size={s} showValue />,
          }))}
        />
      </Spec>
      <Spec title="Circle" level={4} source={CIRCLE} props="size showValue" role="The circular form for a slot too small for a bar, its stroke growing with the size so the ring keeps its weight.">
        <Canvas ground="page" layout="flow">
          <Item label="indeterminate · 24">
            <ProgressCircle label={LABEL} indeterminate size={24} />
          </Item>
          <Item label="paused · 40">
            <ProgressCircle label={LABEL} value={35} status="paused" size={40} showValue />
          </Item>
          <Item label="complete · 64">
            <ProgressCircle label={LABEL} status="complete" size={64} showValue />
          </Item>
        </Canvas>
      </Spec>
      <Spec title="Steps" level={4} source={BAR} props="segments" role="A count of stages splits the rail, so step two of four reads as a place in a sequence.">
        <Canvas ground="page" layout="grid">
          <Item label="segments 4 · value 2" align="start">
            <Progress label="Setting up, step 2 of 4" segments={4} value={2} showLabel />
          </Item>
          <Item label="segments 4 · complete" align="start">
            <Progress label="Setting up" segments={4} status="complete" showLabel showValue />
          </Item>
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="Name the failure and where it stopped, so the red bar is not the only thing that says it.">
          <div className="w-[240px]">
            <Progress label={LABEL} value={60} status="error" showLabel showValue />
          </div>
        </Do>
        <Dont reason="A red bar alone says something went wrong, but not what, and not how far it got.">
          <div className="w-[240px]">
            <Progress label={LABEL} value={60} status="error" />
          </div>
        </Dont>
      </DoDont>
    </Sub>
  );
}

export function ProgressSection() {
  return (
    <Section id="progress" lead="How much is done: the trait bars from the players section first, then a progress family with its semantics.">
      <Traits />
      <Family />
    </Section>
  );
}
