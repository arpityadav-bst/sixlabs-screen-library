// Slider: choosing a value on a range, the players' trait bars made interactive. A system part, shown
// like a shipped one, and set beside the real PlayerTraits it grows from.
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SLIDER_BLUE_MISS, SLIDER_CODE, SLIDER_KEYS, SLIDER_PROPS, SLIDER_VALUES } from "./_data/slider";
import {
  SliderAnatomy,
  SliderBesideTraits,
  SliderBlueStates,
  SliderDoDont,
  SliderLadder,
  SliderRange,
  SliderStates,
} from "./slider-specimens";

const SOURCE = { from: "@/components/design-system/Slider", name: "Slider" };

export function SliderSection() {
  return (
    <Section
      id="slider"
      lead="A rail, a navy range and a white thumb for picking a level by eye. Its label row is the terminal bars' layout, and on the blue it is the trait bar itself."
    >
      <Spec
        title="Anatomy"
        source={SOURCE}
        role="The value sits in tabular figures at the row's right, so it holds still while the thumb moves."
        drawer={{ values: SLIDER_VALUES, props: SLIDER_PROPS, code: SLIDER_CODE }}
      >
        <SliderAnatomy />
      </Spec>
      <Spec
        title="States"
        source={SOURCE}
        props="size forceState disabled value"
        role="Dragging grows the thumb and raises a bubble, so the value stays in sight above the finger."
      >
        <SliderStates />
      </Spec>
      <Spec
        title="On the accent water"
        source={SOURCE}
        props="ground"
        role="On the accent the range and thumb turn white, and a navy ring keeps the thumb's edge."
        note={SLIDER_BLUE_MISS ? "The white label misses AA on the water, as its badge reads, a system miss the slider still carries." : undefined}
      >
        <SliderBlueStates />
      </Spec>
      <Spec title="Sizes" source={SOURCE} props="size" role="Rails of 2, 4 and 6 pair with the three thumbs, and every thumb answers a 40px circle.">
        <SliderLadder />
      </Spec>
      <Spec title="Range and ticks" source={SOURCE} props="value ticks tickLabels step" role="Two thumbs that never cross bound a band, and ticks show where a stepped value can land.">
        <SliderRange />
      </Spec>
      <Spec
        title="Beside the trait bars"
        source={SOURCE}
        chips={["PlayerTraits"]}
        role="Each slider drives the shipped bar above it, so the two share one shape, one rail and one white fill."
        note="The top canvas is the real PlayerTraits from the players section, fed by the sliders below."
      >
        <SliderBesideTraits />
      </Spec>
      <Spec title="Keyboard" source={SOURCE} role="Every thumb is a slider role with a spoken value, so a reader never needs the pointer.">
        <KeyRows label="Slider keys" rows={SLIDER_KEYS} />
      </Spec>
      <SliderDoDont />
    </Section>
  );
}
