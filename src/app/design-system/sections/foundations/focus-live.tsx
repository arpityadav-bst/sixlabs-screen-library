"use client";

// The site's own controls, live, on the grounds they ship on, to Tab through. They set no focus style,
// so each shows the browser's default ring. ModeToggle gets a thumb id of its own and the language menu a
// LayoutGroup of its own (the shell's LanguageLive), so neither trades its highlight with another copy.
import { useState } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { WaveButton } from "@/components/website/HeroBits";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { LanguageLive } from "../shell/language-live";
import styles from "./focus.module.css";

export function LiveStrip() {
  const [mode, setMode] = useState<Mode>("human");
  return (
    <>
      <Canvas ground="container" label="Hero controls, live" isolateKeys>
        <div className={styles["ds-focus-row"]}>
          <PrimaryCta>Try now</PrimaryCta>
          <WaveButton full onClick={noop} />
        </div>
      </Canvas>
      <Canvas ground="page" label="Header language menu, live" minHeight={260} isolateKeys>
        <div className={styles["ds-top"]}>
          <LanguageLive group="ds-lang-focus" />
        </div>
      </Canvas>
      <Canvas ground="on-blue" label="Players switch, live" isolateKeys>
        <ModeToggle mode={mode} onChange={setMode} thumbId="ds-focus-live-thumb" />
      </Canvas>
    </>
  );
}
