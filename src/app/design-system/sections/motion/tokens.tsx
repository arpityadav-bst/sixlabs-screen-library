// Motion tokens: the one ease and the curves allowed beside it, the duration ladder by job, the springs and
// the travel distances drawn true size. Every value comes from token-motion.ts, and the count of files
// that write the ease out by hand is read from the site's source at build.
import type { CSSProperties } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { EaseDemo } from "@/app/design-system/_kit/EaseDemo";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { filesWriting } from "@/app/design-system/sections/meta/meta-scan";
import { DurationLadder } from "./duration-ladder";
import {
  DONT_EASE,
  DO_EASE,
  DURATION_CODE,
  DURATION_PROPS,
  DURATION_VALUES,
  EASE_CODE,
  EASE_PROPS,
  EASE_VALUES,
  LADDER,
  OTHER_EASES,
  SPRING_CARDS,
  SPRING_CODE,
  SPRING_PROPS,
  SPRING_VALUES_ROWS,
  THE_EASE,
  TRAVEL_MARKS,
  TRAVEL_VALUES,
} from "./_data/tokens";
import styles from "./motion.module.css";

/** A distance at true size: the block at rest, the dashed outline it travels from and a bracket between. */
function TravelMark({ px }: { px: number }) {
  return (
    <div className={styles["ds-mo-travel"]} style={{ "--ds-mo-px": `${px}px` } as CSSProperties} aria-hidden="true">
      <span className={styles["ds-mo-travel-from"]} />
      <span className={styles["ds-mo-travel-at"]} />
      <span className={styles["ds-mo-travel-gap"]} />
    </div>
  );
}

export function MotionTokensSection() {
  const easeFiles = filesWriting("src/components/website", "[0.22, 1, 0.36, 1]");
  return (
    <Section
      id="motion-tokens"
      lead="The motion vocabulary as tokens you can run: one ease, a duration for each job, four springs and a ceiling on travel. Press Run on any card."
    >
      <Sub title="Easing">
        <Spec
          level={4}
          title="The ease"
          source={{ from: "@/components/design-system/motion", name: "EASE", file: "motion.ts" }}
          chips={["--ds-ease-out"]}
          role="Everything that arrives or settles uses this curve, because a quick start with a long settle reads as calm rather than slow."
          drawer={{ values: EASE_VALUES, props: EASE_PROPS, code: EASE_CODE }}
          note={`The site writes this curve out by hand in ${easeFiles} files. New parts import EASE, so the count does not grow.`}
        >
          <Canvas ground="page">
            <EaseDemo label={THE_EASE.label} ease={THE_EASE.ease} duration={THE_EASE.duration} caption={THE_EASE.caption} />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="The other curves"
          source={{ from: "@/components/design-system/token-motion", file: "token-motion.ts", name: "EASES" }}
          role="Each other curve has one job on the site, so a new part never reaches past the ease for a look of its own."
        >
          <Canvas ground="page" layout="grid" label="Curves allowed beside the ease">
            {OTHER_EASES.map((c) => (
              <EaseDemo key={c.key} label={c.label} ease={c.ease} duration={c.duration} caption={c.caption} />
            ))}
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Durations">
        <Spec
          level={4}
          title="Duration ladder"
          source={{ from: "@/components/design-system/motion", name: "DUR", file: "motion.ts" }}
          props="DUR"
          role="A duration is picked by the job it does, so two parts doing the same job always take the same time."
          drawer={{ values: DURATION_VALUES, props: DURATION_PROPS, code: DURATION_CODE }}
          note="The site drifts on three jobs: loaders leave at 0.45s where reveals take 0.5s, numbers rise in 0.6s where sections take 0.7s, and link hovers run 200ms on Sign in but 300ms in the header."
        >
          <Canvas ground="page" layout="stack" label="Every duration, run together">
            <DurationLadder rungs={LADDER} label="Duration ladder, shortest first" />
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Springs">
        <Spec
          level={4}
          title="Springs"
          source={{ from: "@/components/design-system/motion", name: "SPRING", file: "motion.ts" }}
          props="SPRING"
          role="Springs follow the hand with no fixed end time, so a press, a thumb or a panel never makes a fast click wait."
          drawer={{ values: SPRING_VALUES_ROWS, props: SPRING_PROPS, code: SPRING_CODE }}
        >
          <Canvas ground="page" layout="grid" label="The four springs">
            {SPRING_CARDS.map((s) => (
              <EaseDemo key={s.key} label={s.label} ease={s.ease} caption={s.caption} />
            ))}
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Travel">
        <Spec
          level={4}
          title="Travel distances"
          source={{ from: "@/components/design-system/token-motion", file: "token-motion.ts", name: "TRAVEL" }}
          chips={["--ds-rise-y", "--ds-loop-max"]}
          role="Distances shrink with the size of the thing moving, so a section rises 28px while a hovered card lifts 2px."
          drawer={{ values: TRAVEL_VALUES }}
        >
          <Canvas ground="page" label="Travel distances, true size">
            {TRAVEL_MARKS.map((t) => (
              <Item key={t.key} label={t.label}>
                <TravelMark px={t.px} />
              </Item>
            ))}
          </Canvas>
        </Spec>
      </Sub>

      <DoDont>
        <Do reason="The ease reaches its place and stops, so a control looks settled the moment it lands.">
          <EaseDemo label={DO_EASE.label} ease={DO_EASE.ease} duration={DO_EASE.duration} />
        </Do>
        <Dont reason="An overshoot carries a control past its place and back, a wobble nothing on the site makes.">
          <EaseDemo label={DONT_EASE.label} ease={DONT_EASE.ease} duration={DONT_EASE.duration} />
        </Dont>
      </DoDont>
    </Section>
  );
}
