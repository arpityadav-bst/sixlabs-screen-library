// Entrance and reveal: the light sections' rise, the hero numbers that wait for the floor, and the
// players reveal that follows the water. Every sample replays, and the values sit in the drawers.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { AssertChip } from "@/app/design-system/sections/foundations/foundation-parts";
import { HeroNumbersDemo } from "./hero-numbers-demo";
import { RiseSample } from "./rise-sample";
import {
  HERO_STATS_SOURCE,
  JOBS_RISE,
  LONG_RISE,
  NUMBERS_CODE,
  NUMBERS_PROPS,
  NUMBERS_VALUES,
  PLAYERS_LANES,
  PLAYERS_ROWS,
  PLAYERS_VALUES,
  RISE_CODE,
  RISE_PROPS,
  RISE_VALUES,
  UNDERSTANDS_RISE,
} from "./_data/entrance";

export function MotionEntranceSection() {
  return (
    <Section
      id="motion-entrance"
      lead="How things arrive: a short rise as a section comes into view, numbers that wait for the floor, and the players coming in behind the water."
    >
      <Sub title="The rise">
        <Spec
          level={4}
          title="Section rise"
          source={{ from: "@/components/design-system/motion", name: "RISE", file: "motion.ts" }}
          props="delay amount"
          chips={["--ds-rise-y", "--ds-dur-rise"]}
          role="Parts rise once as they come into view, so the page settles while it is read and never replays on the way back up."
          caption="y 28 · 0.7s · ease · once"
          drawer={{ values: RISE_VALUES, props: RISE_PROPS, code: RISE_CODE }}
          note="Under reduced motion these rises still travel: the site wraps no MotionConfig round its motion/react parts."
        >
          <Canvas ground="page" label="Understands stagger">
            <Replay>
              <RiseSample plan={UNDERSTANDS_RISE} />
            </Replay>
          </Canvas>
          <Canvas ground="page" label="Jobs stagger">
            <Replay>
              <RiseSample plan={JOBS_RISE} />
            </Replay>
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Staged reveals">
        <Spec
          level={4}
          title="Hero numbers"
          source={{ from: "@/components/website/HeroBits", name: "HeroNumbers" }}
          props="ready"
          chips={["--ds-numbers-y", "--ds-dur-numbers"]}
          role="The figures wait for the tiles and then rise 6px, so they land on a finished floor rather than over a loading one."
          caption={
            <>
              y 6 · 0.6s · 1.2s after ready · figures from <AssertChip a={HERO_STATS_SOURCE} />
            </>
          }
          drawer={{ values: NUMBERS_VALUES, props: NUMBERS_PROPS, code: NUMBERS_CODE }}
        >
          <Canvas ground="container" minHeight={240}>
            <Replay>
              <HeroNumbersDemo />
            </Replay>
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Players reveal"
          source={{ from: "@/components/website/Players", name: "Players", at: "const enter = (delay" }}
          chips={["--ds-reveal-y", "--ds-dur-reveal"]}
          role="The section waits for the water to fill the view, then its parts come in a twentieth of a second apart, cards first."
          drawer={{ values: PLAYERS_VALUES }}
          note={
            <>
              The live reveal plays in the players frame under <SectionLink id="scroll-players" />.
            </>
          }
        >
          <Timeline label="Players reveal, seconds after the water fills" axisLabel="after filled" lanes={PLAYERS_LANES} />
          <KeyRows label="Players reveal trigger" rows={PLAYERS_ROWS} />
        </Spec>
      </Sub>

      <DoDont>
        <Do reason="28px over 0.7s is done before the eye reaches the next line, so the reader never waits on it." ground="page">
          <Replay>
            <RiseSample plan={UNDERSTANDS_RISE} />
          </Replay>
        </Do>
        <Dont reason="96px over 1.6s keeps the reader waiting for words they have already scrolled to." ground="page">
          <Replay>
            <RiseSample plan={LONG_RISE} />
          </Replay>
        </Dont>
      </DoDont>
    </Section>
  );
}
