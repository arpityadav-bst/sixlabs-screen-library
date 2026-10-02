// Micro-interactions: one table of every trigger and its response, with the real parts beside it, each
// captioned with the rows it answers to.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { LanguageLive } from "@/app/design-system/sections/shell/language-live";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { ModeLive, WaveLabelDo, WaveLive } from "./micro-live";
import { LIVE, LIVE_CODE, LIVE_VALUES, MICRO_COLUMNS, MICRO_TABLE, rowsLabel } from "./_data/micro";
import styles from "./motion.module.css";

export function MotionMicroSection() {
  return (
    <Section
      id="motion-micro"
      lead="Every trigger and its response on one table, so a new control borrows a timing that already ships. The live parts sit above it."
    >
      <Spec
        title="Live micro-interactions"
        source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }}
        chips={["WaveButton", "LanguageMenu", "ModeToggle"]}
        role="Hover, press, open and choose each answer on the ground the part ships on, at the timing its table row gives."
        drawer={{ values: LIVE_VALUES, code: LIVE_CODE }}
        note="The wave button presses to nothing here: on the site it sends the tile floor's wave, and the floor is not on this page."
      >
        <Canvas ground="container" label="Hero controls">
          <Item label={`PrimaryCta · ${rowsLabel(LIVE.cta)}`}>
            <PrimaryCta>Try now</PrimaryCta>
          </Item>
          <Item label={`WaveButton · ${rowsLabel(LIVE.wave)}`}>
            <WaveLive />
          </Item>
        </Canvas>
        <Canvas ground="page" label="Header language menu" isolateKeys>
          <Item label={`LanguageMenu · ${rowsLabel(LIVE.language)}`}>
            <div className={styles["ds-mo-menuslot"]}>
              <LanguageLive group="ds-lang-micro" />
            </div>
          </Item>
        </Canvas>
        <Canvas ground="on-blue" label="Human / AI switch">
          <Item label={`ModeToggle · ${rowsLabel(LIVE.mode)}`}>
            <ModeLive />
          </Item>
        </Canvas>
      </Spec>

      <Spec
        title="Trigger table"
        source={{ from: "@/app/design-system/sections/motion/_data/micro", file: "micro.ts" }}
        role="A timing is chosen by the trigger and the job, so the same trigger on the same kind of part answers in the same time."
      >
        <SpecTable caption="Micro-interactions" columns={MICRO_COLUMNS} rows={MICRO_TABLE} mono={[0, 4, 5]} minWidth={880} />
      </Spec>

      <DoDont>
        <Do reason="The label widens on hover and on keyboard focus alike, so a Tab lands on a named control." ground="container">
          <WaveLabelDo />
        </Do>
        <Dont reason="This label widens on hover only, so a keyboard visitor lands on an icon with no visible name." ground="container">
          <WaveLive />
        </Dont>
      </DoDont>
    </Section>
  );
}
