// Doodles: the real PlayerDoodles round the real portrait on the accent ground, with the drawing's timeline
// (from the explorer's own strokes), its rules, and the order decision. Why the strokes are white is the
// on-blue glass rule, taught once in Special palettes, so it is linked rather than shown again.
import { sectionById } from "@/app/design-system/_data/catalog";
import { DoDont, Do, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Note } from "@/app/design-system/_kit/Note";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { DoodleLab } from "./doodles-live";
import { DOODLE_CODE, DOODLE_LANES, DOODLE_PROPS, DOODLE_RULES, DOODLE_VALUES, ORDER_DO, ORDER_DONT } from "./doodles-data";

const DOODLES = { from: "@/components/website/PlayerDoodles", name: "PlayerDoodles" };
/** the section the note points to, its anchor and title read from the catalog */
const SPECIAL = sectionById("colour-special");

export function DoodlesSection() {
  return (
    <Section
      id="doodles"
      lead="White line drawings round each player's head: the hand sketches them stroke by stroke, and the AI retraces every stroke over it, clean and glowing."
    >
      <Sub title="The drawing">
        <Spec
          title="Hand and AI copy"
          level={4}
          source={DOODLES}
          props="id start mode"
          chips={["DoodleStroke"]}
          role="The AI copying the hand's own strokes is the section's claim made visible: the model learns what the person does."
          caption="explorer · stroke 3.5 at 0.85 · glow #7fb2ff in five lines · AI at 2x the hand"
          drawer={{ values: DOODLE_VALUES, props: DOODLE_PROPS, code: DOODLE_CODE }}
        >
          <DoodleLab />
        </Spec>

        <Spec
          title="Timing"
          level={4}
          source={DOODLES}
          role="The hand finishes before the portrait first turns AI, so the copy always has a whole drawing to follow."
        >
          <Timeline label="Doodle timeline, the explorer" axisLabel="from each trigger" lanes={DOODLE_LANES} />
          <KeyRows label="Doodle rules" rows={DOODLE_RULES} />
        </Spec>
      </Sub>

      <Sub title="The order">
        <DoDont>
          <Do reason="The hand draws first and the AI retraces only what it has finished, so a switch before the drawing waits for it.">
            <Timeline label="An early switch, the copy waiting for the hand" axisLabel="from start" lanes={ORDER_DO} minWidth={360} />
          </Do>
          <Dont reason="A copy on its own clock would retrace lines the hand has not drawn, and the AI would seem to lead the person.">
            <Timeline label="An early switch, the copy running ahead" axisLabel="from start" lanes={ORDER_DONT} minWidth={360} />
          </Dont>
        </DoDont>
        <Note>
          The strokes are white because the water is their ground. The on-blue glass pair in{" "}
          <a href={`#${SPECIAL.id}`}>{SPECIAL.title}</a> is that rule: off the blue, the white all but vanishes.
        </Note>
      </Sub>
    </Section>
  );
}
