// Text fields, the textarea half: the same box, grown for a sentence or two, with a soft limit.
import { Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { TEXT_AREA_CODE, TEXT_AREA_PROPS, TEXT_AREA_VALUES } from "./_data/fields";
import { TextAreaAnatomy, TextAreaLadder, TextAreaStates } from "./field-textarea-specimens";

const SOURCE = { from: "@/components/design-system/TextArea", name: "TextArea" };

export function TextAreaSub() {
  return (
    <Sub title="Textarea" lead="For answers longer than a line. It starts at three lines and grows with the text.">
      <Spec
        level={4}
        title="Anatomy"
        source={SOURCE}
        role="The counter sits on the helper's line, so the limit is visible before it matters."
        drawer={{ values: TEXT_AREA_VALUES, props: TEXT_AREA_PROPS, code: TEXT_AREA_CODE }}
      >
        <TextAreaAnatomy />
      </Spec>
      <Spec
        level={4}
        title="States"
        source={SOURCE}
        props="size maxLength touched"
        role="Past the limit the counter warns at once, and the box turns red only after the reader leaves it."
        note="maxLength on TextArea is soft. A pasted draft is kept whole and the form refuses it on submit."
      >
        <TextAreaStates />
      </Spec>
      <Spec level={4} title="Sizes" source={SOURCE} props="size" role="Rest heights step with the input sizes, so a form keeps one rhythm.">
        <TextAreaLadder />
      </Spec>
    </Sub>
  );
}
