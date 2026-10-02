// Reduced motion: the reader's setting, live, and what each moving part does when a visitor asks for less
// motion, the parts with no answer included.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { Spinner } from "@/components/design-system/Spinner";
import { ReducedReadout } from "./reduced-readout";
import { READOUT_CODE, READOUT_VALUES, REDUCED_COLUMNS, REDUCED_TABLE } from "./_data/reduced";
import styles from "./motion.module.css";

export function MotionReducedSection() {
  return (
    <Section
      id="motion-reduced"
      lead="What each moving part does when the visitor asks for less motion: state changes stay, travel goes, loops stop and a busy spinner keeps turning, slower."
    >
      <Spec
        title="Your setting"
        source={{ from: "@/app/design-system/_kit/reduced-motion", name: "useReducedMotionSetting", file: "reduced-motion.ts" }}
        role="The readout says which reading of the specimens on this page you are seeing, so a still loop is never mistaken for a broken one."
        drawer={{ values: READOUT_VALUES, code: READOUT_CODE }}
      >
        <Canvas ground="page" layout="stack">
          <ReducedReadout />
        </Canvas>
      </Spec>

      <Spec
        title="Part by part"
        source={{ from: "@/app/design-system/sections/motion/_data/reduced", file: "reduced.ts" }}
        role="Every moving part names its reduced answer and the line that gives it, so a missing answer shows up as a no."
        note={
          <>
            These parts have no answer yet: the tile floor, the glide, ping and pulse, and the motion/react entrances. <a href="#gaps">Known gaps</a> tracks them.
          </>
        }
      >
        <SpecTable caption="Reduced motion by part" columns={REDUCED_COLUMNS} rows={REDUCED_TABLE} mono={[3]} minWidth={760} />
      </Spec>

      <DoDont>
        <Do reason="A busy part still says busy, so the spinner turns at 1.5s a turn instead of stopping." ground="page">
          <Item label="Spinner · 1s, 1.5s reduced">
            <Spinner size={24} delay={0} label="Loading" />
          </Item>
        </Do>
        <Dont reason="A spinner frozen mid-turn reads as a broken icon, and the visitor waits without knowing why." ground="page">
          <Item label="Spinner · stopped">
            <span className={styles["ds-mo-frozen"]}>
              <Spinner size={24} delay={0} decorative />
            </span>
          </Item>
        </Dont>
      </DoDont>
    </Section>
  );
}
