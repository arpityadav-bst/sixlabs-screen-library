// Checkbox, radio, switch: binary and single choices, checked in navy and never in the accent. All three
// are system parts, shown like shipped ones.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import {
  CHECK_CODE,
  CHECK_PROPS,
  CHECK_VALUES,
  RADIO_CODE,
  RADIO_PROPS,
  RADIO_VALUES,
  SWITCH_BLUE_MISS,
  SWITCH_CODE,
  SWITCH_PROPS,
  SWITCH_VALUES,
} from "./_data/choice";
import { CheckboxAnatomy, CheckboxGroupLive, CheckboxLadder, CheckboxStates } from "./choice-checkbox";
import { RadioAnatomy, RadioCards, RadioLadder, RadioStates } from "./choice-radio";
import { SwitchAnatomy, SwitchBlueStates, SwitchDoDont, SwitchLadder, SwitchLive, SwitchStates } from "./choice-switch";

const CHECK = { from: "@/components/design-system/Checkbox", name: "Checkbox" };
const RADIO = { from: "@/components/design-system/Radio", name: "RadioGroup" };
const SWITCH = { from: "@/components/design-system/Switch", name: "Switch" };

export function ChoiceSection() {
  return (
    <Section
      id="choice"
      lead="Ticks, dots and switches for yes or no and one of a few. Checked is always navy, and a glyph or a dot carries the state."
    >
      <Sub title="Checkbox">
        <Spec
          level={4}
          title="Anatomy"
          source={CHECK}
          role="The native input sits invisibly over the drawn box, so the browser keeps the keyboard, the form value and the role."
          drawer={{ values: CHECK_VALUES, props: CHECK_PROPS, code: CHECK_CODE }}
        >
          <CheckboxAnatomy />
        </Spec>
        <Spec
          level={4}
          title="States"
          source={CHECK}
          props="checked indeterminate forceState disabled invalid readOnly"
          role="Checked and indeterminate differ by glyph as well as fill, so the state survives forced colours and colour blindness."
        >
          <CheckboxStates />
        </Spec>
        <Spec level={4} title="Sizes" source={CHECK} props="size" role="Each box size pairs with a field size, so a checkbox row and an input row align.">
          <CheckboxLadder />
        </Spec>
        <Spec
          level={4}
          title="In a group"
          source={CHECK}
          chips={["ChoiceGroup"]}
          role="A fieldset and legend name the question once, and the error sits under the set because the answer is the set."
        >
          <CheckboxGroupLive />
        </Spec>
      </Sub>
      <Sub title="Radio">
        <Spec
          level={4}
          title="Anatomy"
          source={RADIO}
          chips={["Radio", "ChoiceGroup"]}
          role="Radios that share a name are one tab stop with arrow keys, which the browser gives for free."
          drawer={{ values: RADIO_VALUES, props: RADIO_PROPS, code: RADIO_CODE }}
        >
          <RadioAnatomy />
        </Spec>
        <Spec
          level={4}
          title="States"
          source={{ from: "@/components/design-system/Radio", name: "Radio" }}
          props="checked forceState disabled readOnly invalid"
          role="A checked radio keeps its white centre and grows a navy dot, so it never reads as a checked box."
        >
          <RadioStates />
        </Spec>
        <Spec level={4} title="Sizes" source={{ from: "@/components/design-system/Radio", name: "Radio" }} props="size" role="Circles match the checkbox boxes, so mixed lists keep one column of marks.">
          <RadioLadder />
        </Spec>
        <Spec
          level={4}
          title="Cards"
          source={RADIO}
          props="variant card forceState"
          role="When each choice needs a sentence, the whole card is the target and the radio marks the pick at its corner."
        >
          <RadioCards />
        </Spec>
        <Spec
          level={4}
          title="Across widths"
          source={RADIO}
          props="orientation variant"
          role="A row of radios stacks under 480 and the cards stack under 640, before any label has to wrap."
          caption="375 · 768 · 1280"
        >
          <Canvas ground="container" layout="stack">
            <ViewportPreview part="radio-stack" title="Radio rows at the frame's width" height={420} heights={{ 375: 900, 768: 460 }} widths={[375, 768, 1280]} width={375} />
          </Canvas>
        </Spec>
      </Sub>
      <Sub title="Switch">
        <Spec
          level={4}
          title="Anatomy"
          source={SWITCH}
          role="A switch is a button with the switch role, so Space flips it and it is read as on or off."
          drawer={{ values: SWITCH_VALUES, props: SWITCH_PROPS, code: SWITCH_CODE }}
        >
          <SwitchAnatomy />
        </Spec>
        <Spec
          level={4}
          title="States"
          source={SWITCH}
          props="checked forceState disabled loading readOnly"
          role="Loading keeps the old position with a spinner in the thumb, so the switch never shows a state it has not saved."
        >
          <SwitchStates />
        </Spec>
        <Spec
          level={4}
          title="On the accent water"
          source={SWITCH}
          props="ground"
          role="On the accent the track turns to glass, and on is white with a navy thumb."
          note={SWITCH_BLUE_MISS ? "The white label misses AA on the water, as its badge reads, a system miss the switch still carries." : undefined}
        >
          <SwitchBlueStates />
        </Spec>
        <Spec level={4} title="Sizes" source={SWITCH} props="size" role="Track heights follow the box sizes, so a switch sits on the same line as a checkbox.">
          <SwitchLadder />
        </Spec>
        <Spec level={4} title="Live" source={SWITCH} props="loading onChange" role="The setting saves on the flip, and the thumb lands only once the save has.">
          <SwitchLive />
        </Spec>
        <SwitchDoDont />
      </Sub>
    </Section>
  );
}
