"use client";

// The switch's specimens: its anatomy, the state grids on light and on the accent water, the track
// ladder, a live setting that saves, and the switch-or-checkbox decision. The setting is the Testing job,
// its words quoted from jobs-data.ts.
import { useEffect, useRef, useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Button } from "@/components/design-system/Button";
import { Checkbox } from "@/components/design-system/Checkbox";
import { Switch } from "@/components/design-system/Switch";
import {
  JOB_OPTIONS,
  SIZES,
  SWITCH_BLUE_LABEL,
  SWITCH_BLUE_STATES,
  SWITCH_PINS,
  SWITCH_STATES,
  forcedBy,
  type SwitchState,
} from "./_data/choice";
import styles from "./inputs.module.css";

const SETTING = JOB_OPTIONS[1];

export function SwitchAnatomy() {
  return (
    <Anatomy pins={SWITCH_PINS} ground="page" gutter={48} isolateKeys label="Switch anatomy">
      <div className={styles["ds-in-w360"]}>
        <Switch label={SETTING.label} description={SETTING.description} defaultChecked icons />
      </div>
    </Anatomy>
  );
}

function cell(state: SwitchState | "live", size: (typeof SIZES)[number], ground: "light" | "onBlue" = "light") {
  const on = state === "on" || state.startsWith("on-") || state.endsWith("-on") || state === "loading";
  return (
    <Switch
      aria-label={SETTING.label}
      size={size}
      ground={ground}
      defaultChecked={on}
      forceState={state === "live" ? undefined : forcedBy(state)}
      disabled={state.startsWith("disabled")}
      loading={state.startsWith("loading")}
      readOnly={state.startsWith("read-only")}
    />
  );
}

export function SwitchStates() {
  return (
    <StateGrid
      label="Switch states by size"
      states={SWITCH_STATES}
      variants={SIZES}
      minCell={104}
      render={({ state, variant }) => cell(state, variant)}
    />
  );
}

export function SwitchBlueStates() {
  return (
    <>
      <StateGrid
        label="Switch states on the accent water"
        states={SWITCH_BLUE_STATES}
        ground="on-blue"
        minCell={104}
        render={({ state }) => cell(state, "md", "onBlue")}
      />
      <Canvas ground="on-blue" isolateKeys label="A labelled switch on the water">
        <Item label="label and description on the water">
          <Switch label={SETTING.label} description={SETTING.description} ground="onBlue" defaultChecked labelPosition="start" />
        </Item>
        <Item label="label on the water">
          <ContrastBadge fg={SWITCH_BLUE_LABEL.fg} bg={SWITCH_BLUE_LABEL.bg} bgName="the accent water" />
        </Item>
      </Canvas>
    </>
  );
}

const SPEC = { sm: 16, md: 20, lg: 24 } as const;

export function SwitchLadder() {
  return (
    <SizeLadder
      label="Switch track sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=track]",
        node: <Switch aria-label={`Size ${s}`} size={s} defaultChecked />,
      }))}
    />
  );
}

/** A setting that saves the moment it flips: the spinner holds the thumb for 900ms, then it lands. */
export function SwitchLive() {
  const [on, setOn] = useState(true);
  const [saving, setSaving] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flip = (next: boolean) => {
    setSaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOn(next);
      setSaving(false);
    }, 900);
  };
  return (
    <Canvas ground="page" isolateKeys label="A setting that saves">
      <div className={styles["ds-in-w360"]}>
        <Switch label={SETTING.label} description={saving ? "Saving" : on ? "On" : "Off"} checked={on} loading={saving} onChange={flip} labelPosition="start" />
      </div>
    </Canvas>
  );
}

export function SwitchDoDont() {
  return (
    <DoDont>
      <Do reason="A switch takes effect the moment it flips, so it belongs to settings that save themselves." isolateKeys>
        <div className={styles["ds-in-w320"]}>
          <Switch label={SETTING.label} defaultChecked labelPosition="start" />
        </div>
      </Do>
      <Dont reason="Inside a form with a submit button a switch promises an instant change the form then withholds. Use a checkbox." isolateKeys>
        <div className={styles["ds-in-col"]}>
          <Switch label="Setting one" />
          <Checkbox label="Setting two" />
          <Button size="sm">Try now</Button>
        </div>
      </Dont>
    </DoDont>
  );
}
