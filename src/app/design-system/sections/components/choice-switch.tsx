"use client";

// The switch's specimens: its anatomy, the state grids on light and on the accent water, the track
// ladders (height and width, plain and with icons), a live setting that saves, and the switch-or-checkbox
// decision. Every grid and ladder runs a plain row and an icons row, so the off cross, the sm thumb's
// glyph and the glyph under disabled, read-only and loading are shown. The setting is the Testing job,
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

type Size = (typeof SIZES)[number];
/** A grid row: a size, plain or with its icons. */
type Row = Size | `${Size} icons`;
const ROWS: readonly Row[] = [...SIZES, ...SIZES.map((s): Row => `${s} icons`)];
const sizeOf = (r: Row) => r.split(" ")[0] as Size;

function cell(state: SwitchState | "live", size: Size, ground: "light" | "onBlue" = "light", icons = false) {
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
      icons={icons}
    />
  );
}

export function SwitchStates() {
  return (
    <StateGrid
      label="Switch states by size, plain and with icons"
      states={SWITCH_STATES}
      variants={ROWS}
      minCell={104}
      render={({ state, variant }) => cell(state, sizeOf(variant), "light", variant.endsWith("icons"))}
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

/** The track's height and width per size (Switch.tsx:19-23), each measured on the rendered track. */
const SPEC = { sm: { height: 16, width: 28 }, md: { height: 20, width: 36 }, lg: { height: 24, width: 44 } } as const;

function rungs(axis: "height" | "width") {
  return ROWS.map((r) => ({
    name: r,
    spec: SPEC[sizeOf(r)][axis],
    select: "[data-slot=track]",
    node: <Switch aria-label={`Size ${r}, ${axis}`} size={sizeOf(r)} defaultChecked icons={r.endsWith("icons")} />,
  }));
}

export function SwitchLadder() {
  return (
    <>
      <SizeLadder label="Switch track heights" sizes={rungs("height")} />
      <SizeLadder label="Switch track widths" axis="width" sizes={rungs("width")} />
    </>
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
