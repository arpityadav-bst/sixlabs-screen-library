// Text fields: the field shell, the text input and the textarea, in the white card, hairline and navy
// language. The site ships no field, so all three are system parts shown like shipped ones.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { TEXT_INPUT_CODE, TEXT_INPUT_PROPS, TEXT_INPUT_VALUES } from "./_data/fields";
import {
  FieldAnatomy,
  FieldsOnCard,
  GroundDoDont,
  LabelDoDont,
  TextInputLadder,
  TextInputStates,
  ValidationDemo,
} from "./field-specimens";
import { TextAreaSub } from "./field-textarea";

const SOURCE = { from: "@/components/design-system/TextInput", name: "TextInput" };

export function FieldsSection() {
  return (
    <Section
      id="fields"
      lead="One white box for every typed answer, with the label above it and the message under it. The accent shows only as the caret and the focus line."
    >
      <Sub title="Text input">
        <Spec
          level={4}
          title="Anatomy"
          source={SOURCE}
          chips={["Field"]}
          role="Field owns the label, helper, message and counter ids, so every input is described the same way."
          drawer={{ values: TEXT_INPUT_VALUES, props: TEXT_INPUT_PROPS, code: TEXT_INPUT_CODE }}
        >
          <FieldAnatomy />
        </Spec>
        <Spec
          level={4}
          title="States"
          source={SOURCE}
          props="size forceState disabled readOnly error success"
          role="Each state changes the line or the fill, and invalid and success add a message with an icon, so none rests on colour."
        >
          <TextInputStates />
        </Spec>
        <Spec level={4} title="Sizes" source={SOURCE} props="size" role="Three heights match the button ladder, so a field and its button share a row.">
          <TextInputLadder />
        </Spec>
        <Spec
          level={4}
          title="On a white card"
          source={SOURCE}
          role="Fields keep their own white inside a white card, and the field line alone draws the box."
        >
          <FieldsOnCard />
        </Spec>
        <Spec
          level={4}
          title="Validation timing"
          source={SOURCE}
          props="error onBlur"
          role="The error waits for the first blur and clears on the keystroke that fixes it."
        >
          <ValidationDemo />
        </Spec>
        <Spec
          level={4}
          title="Across widths"
          source={SOURCE}
          role="Below 768 every size sets its text at 16px, the size iOS needs to skip its zoom on focus."
          caption="375 · 1280"
        >
          <Canvas ground="container" layout="stack">
            <ViewportPreview part="field-sizes" title="Field sizes at the frame's width" height={340} widths={[375, 1280]} width={375} />
          </Canvas>
        </Spec>
        <GroundDoDont />
        <LabelDoDont />
      </Sub>
      <TextAreaSub />
    </Section>
  );
}
