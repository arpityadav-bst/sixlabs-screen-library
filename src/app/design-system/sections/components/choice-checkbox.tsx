"use client";

// The checkbox's specimens: its anatomy, the state grid by size, the box ladder and a live group with
// a legend and an error that waits for the submit.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Button } from "@/components/design-system/Button";
import { Checkbox } from "@/components/design-system/Checkbox";
import { ChoiceGroup } from "@/components/design-system/ChoiceGroup";
import { CHECK_PINS, CHECK_STATES, JOB_OPTIONS, SIZES, forcedBy, type CheckState } from "./_data/choice";
import styles from "./inputs.module.css";

export function CheckboxAnatomy() {
  return (
    <Anatomy pins={CHECK_PINS} ground="page" gutter={48} isolateKeys label="Checkbox anatomy">
      <div className={styles["ds-in-w360"]}>
        <Checkbox label={JOB_OPTIONS[1].label} description={JOB_OPTIONS[1].description} defaultChecked />
      </div>
    </Anatomy>
  );
}

function cell(state: CheckState | "live", size: (typeof SIZES)[number]) {
  const on = state === "checked" || state === "checked-hover" || state === "disabled-checked" || state === "read-only-checked";
  return (
    <Checkbox
      label="Testing"
      size={size}
      defaultChecked={on}
      indeterminate={state === "indeterminate"}
      forceState={state === "live" ? undefined : forcedBy(state)}
      disabled={state.startsWith("disabled")}
      invalid={state === "invalid"}
      readOnly={state.startsWith("read-only")}
    />
  );
}

export function CheckboxStates() {
  return (
    <StateGrid
      label="Checkbox states by size"
      states={CHECK_STATES}
      variants={SIZES}
      minCell={112}
      render={({ state, variant }) => cell(state, variant)}
    />
  );
}

const SPEC = { sm: 16, md: 18, lg: 20 } as const;

export function CheckboxLadder() {
  return (
    <SizeLadder
      label="Checkbox box sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=box]",
        node: <Checkbox label={`Size ${s}`} size={s} defaultChecked />,
      }))}
    />
  );
}

/** A group whose error appears on submit and clears as soon as one box is ticked. */
export function CheckboxGroupLive() {
  const [picked, setPicked] = useState<string[]>([]);
  const [tried, setTried] = useState(false);
  const all = picked.length === JOB_OPTIONS.length;
  const some = picked.length > 0 && !all;
  const toggle = (v: string, on: boolean) => setPicked((p) => (on ? [...p, v] : p.filter((x) => x !== v)));
  return (
    <Canvas ground="page" isolateKeys label="Checkbox group">
      <div className={styles["ds-in-col"]}>
        <ChoiceGroup legend="Which jobs do you need?" error={tried && picked.length === 0 ? "Pick at least one job." : undefined}>
          {({ describedBy, invalid }) => [
            <Checkbox
              key="all"
              label="All three jobs"
              checked={all}
              indeterminate={some}
              onChange={(on) => setPicked(on ? JOB_OPTIONS.map((o) => o.value) : [])}
              invalid={invalid}
              aria-describedby={describedBy}
            />,
            ...JOB_OPTIONS.map((o) => (
              <Checkbox
                key={o.value}
                label={o.label}
                description={o.description}
                checked={picked.includes(o.value)}
                onChange={(on) => toggle(o.value, on)}
                invalid={invalid}
                aria-describedby={describedBy}
                className={styles["ds-in-indent"]}
              />
            )),
          ]}
        </ChoiceGroup>
        <Button size="sm" variant="secondary" onClick={() => setTried(true)}>
          Request access
        </Button>
      </div>
    </Canvas>
  );
}
