"use client";

// The ring on every ground, forced on: system parts with forceState="focus". Each row is a picture of the
// state in the kit's Forced box (inert, with a reader line), so Tab never lands on a ring already drawn. A
// client leaf because the icon buttons take their icon as a prop and Segmented takes onChange.
import { ArrowUp, ChevronRight, Waves } from "lucide-react";
import { useState } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Forced } from "@/app/design-system/_kit/Forced";
import { Button } from "@/components/design-system/Button";
import { Checkbox } from "@/components/design-system/Checkbox";
import { Chip } from "@/components/design-system/Chip";
import { IconButton } from "@/components/design-system/IconButton";
import { Segmented } from "@/components/design-system/Segmented";
import { RingPill } from "./focus-samples";
import styles from "./focus.module.css";

type Pick = "human" | "ai";
const MODES = [
  { id: "human", label: "Human" },
  { id: "ai", label: "AI" },
] as const satisfies readonly { id: Pick; label: string }[];

function Modes({ ground, id }: { ground: "light" | "container" | "blue"; id: string }) {
  const [v, setV] = useState<Pick>("human");
  return (
    <Segmented
      options={MODES}
      value={v}
      onChange={setV}
      label="Show the human or their AI copy"
      ground={ground}
      size="sm"
      thumbId={id}
      forceState="focus"
    />
  );
}

export function ToneStrip() {
  return (
    <>
      <Canvas ground="page" label="Accent ring on the page">
        <Forced state="focus" label="Request access, Back to top, the Functional checkbox and the Human or AI switch">
          <div className={styles["ds-focus-row"]}>
            <Button variant="primary" forceState="focus">
              Request access
            </Button>
            <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" forceState="focus" />
            <Checkbox label="Functional" forceState="focus" />
            <Modes ground="light" id="ds-focus-seg-page" />
          </div>
        </Forced>
      </Canvas>
      <Canvas ground="container" label="Accent ring on the container">
        <Forced state="focus" label="Sign in, Next wave, the Behavioral chip and the Human or AI switch">
          <div className={styles["ds-focus-row"]}>
            <Button variant="secondary" forceState="focus">
              Sign in
            </Button>
            <IconButton icon={Waves} label="Next wave" variant="outline" forceState="focus" />
            <Chip forceState="focus">Behavioral</Chip>
            <Modes ground="container" id="ds-focus-seg-container" />
          </div>
        </Forced>
      </Canvas>
      <Canvas ground="on-blue" label="White ring on the accent water">
        <Forced state="focus" label="Request access, Next player, the Localization chip and the Human or AI switch">
          <div className={styles["ds-focus-row"]}>
            <Button variant="inverse" forceState="focus">
              Request access
            </Button>
            <IconButton icon={ChevronRight} label="Next player" variant="glass" forceState="focus" />
            <Chip ground="onBlue" forceState="focus">
              Localization
            </Chip>
            <Modes ground="blue" id="ds-focus-seg-blue" />
          </div>
        </Forced>
      </Canvas>
      <Canvas ground="terminal" label="Lifted ring on the terminal">
        <div className={styles["ds-focus-row"]}>
          <RingPill tone="dark" on="dark">
            Replay
          </RingPill>
        </div>
      </Canvas>
    </>
  );
}
