import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { typeStyle } from "@/components/design-system/tokens";
import { HeroNumbers } from "@/components/website/HeroBits";
import { TypedWord } from "@/components/website/TypedWord";
import { HeldWord, LiveNumbers } from "./stats-live";
import {
  COPIES_BASE, heroStats, STATS_CODE, TONE_COPIES, STATS_PINS, STATS_PROPS, STATS_VALUES, TYPED_CODE, TYPED_LANES, TYPED_PINS,
  TYPED_PROPS, TYPED_VALUES,
} from "./stats-typed-data";

const NUMBERS = { from: "@/components/website/HeroBits", name: "HeroNumbers", file: "HeroBits.tsx" };
const TYPED = { from: "@/components/website/TypedWord", name: "TypedWord" };

function Numbers() {
  return (
    <Sub title="Hero numbers">
      <Spec
        title="Centred row"
        level={4}
        source={NUMBERS}
        props="stats ready"
        role="Two figures that size the claim: the humans in navy, their digital copies in the accent, the one figure that moves."
        drawer={{ values: STATS_VALUES, props: STATS_PROPS, code: STATS_CODE }}
        note="The live count carries no aria-live, so a screen reader reads it only when it reaches it."
      >
        <Anatomy ground="page" layout="stack" pins={STATS_PINS} label="Hero numbers anatomy">
          <LiveNumbers />
        </Anatomy>
      </Spec>
      <Spec title="Left, in the full view" level={4} source={NUMBERS} props="left" role="Inside the full view's copy the pair aligns left and shows with the copy, with no entrance of its own.">
        <Canvas ground="container" layout="stack">
          <LiveNumbers left />
        </Canvas>
      </Spec>
      <Spec
        title="Across widths"
        level={4}
        source={NUMBERS}
        role="On a phone the pair closes up and each label holds one line, so the two figures still read as one claim."
        caption="gap 56, 32 under md · 375 · 768 · 1280"
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview part="hero-numbers" title="Hero numbers at true widths" height={340} widths={[375, 768, 1280]} width={768} />
        </Canvas>
      </Spec>
      <DoDont>
        <Do reason="Keep the accent on the live figure alone, so the eye goes to the number that moves.">
          <HeroNumbers stats={heroStats(COPIES_BASE)} ready left={false} />
        </Do>
        <Dont reason="Two accent figures compete, and neither reads as the one that counts up.">
          <HeroNumbers stats={heroStats(COPIES_BASE).map((s) => ({ ...s, tone: TONE_COPIES }))} ready left={false} />
        </Dont>
      </DoDont>
    </Sub>
  );
}

function Typed() {
  return (
    <Sub title="Typed word">
      <Spec
        title="In the hero"
        level={4}
        source={TYPED}
        props="word className"
        role="The headline's accent word types in behind a thin caret from first paint, never waiting for scripts or the floor."
        drawer={{ values: TYPED_VALUES, props: TYPED_PROPS, code: TYPED_CODE }}
        note="The caret is a fixed #1a6dff in globals.css, not currentColor, so it stays accent on any word."
      >
        <Anatomy ground="container" pins={TYPED_PINS} label="Typed word anatomy">
          <Replay>
            <p className="ds-a-typed text-(--ds-color-ink)" style={typeStyle("hero")}>
              Making <TypedWord word="models" className="text-accent" /> of
              <br />
              human players.
            </p>
          </Replay>
        </Anatomy>
      </Spec>
      <Spec title="On view" level={4} source={TYPED} props="onView" role="The closing line waits, paused, until most of the words are in view, then types once.">
        <Canvas ground="grain" layout="flow">
          <Replay>
            <p className="text-center text-(--ds-color-ink)" style={typeStyle("closing")}>
              1 million made
              <br />
              <TypedWord word="2 billion to go" className="text-accent" onView />
            </p>
          </Replay>
        </Canvas>
      </Spec>
      <Spec title="Held" level={4} source={TYPED} props="hold" role="The full view holds the word while its loader runs, so the typing starts with the copy and not behind it.">
        <Canvas ground="container" layout="stack">
          <HeldWord />
        </Canvas>
      </Spec>
      <Spec
        title="Timing"
        level={4}
        source={TYPED}
        role="The word finishes typing before the numbers rise at 1.2s, so the headline is read before the figures ask for the eye."
        caption="start 0.5s · 90ms a letter · the last caret lingers 1s"
      >
        <Timeline label="Typed word and hero numbers timing" axisLabel="from first paint" lanes={TYPED_LANES} />
      </Spec>
      <DoDont>
        <Do reason="Type only the accent words, where the accent caret belongs to the word it writes.">
          <Replay>
            <p className="text-(--ds-color-ink)" style={typeStyle("h2")}>
              Making <TypedWord word="models" className="text-accent" />
            </p>
          </Replay>
        </Do>
        <Dont reason="On an ink word the blue caret looks borrowed, because its colour is fixed in globals.css.">
          <Replay>
            <p className="text-(--ds-color-ink)" style={typeStyle("h2")}>
              Making <TypedWord word="models" />
            </p>
          </Replay>
        </Dont>
      </DoDont>
    </Sub>
  );
}

export function StatsTypedSection() {
  return (
    <Section id="stats-typed" lead="The hero's headline figures and its typed accent word, the two text parts that move.">
      <Numbers />
      <Typed />
    </Section>
  );
}
