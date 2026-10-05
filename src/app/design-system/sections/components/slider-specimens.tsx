"use client";

// The slider's specimens: its anatomy, the state grids on light and on the water, the thumb ladder, a range
// with ticks, the slider beside the shipped trait bars, and the slider-or-field decision.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Forced } from "@/app/design-system/_kit/Forced";
import { Item } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Slider } from "@/components/design-system/Slider";
import { TextInput } from "@/components/design-system/TextInput";
import { PlayerTraits } from "@/components/website/PlayerTraits";
import { PLAYERS } from "@/components/website/players-data";
import { SIZES, SLIDER_BLUE_LABEL, SLIDER_BLUE_STATES, SLIDER_PINS, SLIDER_STATES, type SliderState } from "./_data/slider";
import styles from "./inputs.module.css";

const pct = (v: number) => `${v}%`;
const TRAITS = PLAYERS[0].traits;
// Patience sits at 72%, so the bubble clears the value at the row's right
const FIRST = TRAITS[1];

export function SliderAnatomy() {
  return (
    <Anatomy pins={SLIDER_PINS} ground="page" gutter={48} minHeight={200} label="Slider anatomy">
      <div className={styles["ds-in-w360"]}>
        <Forced state="dragging" label={`${FIRST.label} slider`}>
          <Slider label={FIRST.label} defaultValue={Math.round(FIRST.value * 100)} formatValue={pct} ticks forceState="dragging" />
        </Forced>
      </div>
    </Anatomy>
  );
}

function cell(state: SliderState | "live", size: (typeof SIZES)[number], ground: "light" | "blue" = "light") {
  const force = state === "hover" ? "hover" : state === "focus-visible" ? "focus-visible" : state === "dragging" ? "dragging" : undefined;
  return (
    <div className={styles["ds-in-fill"]}>
      <Slider
        label={FIRST.label}
        size={size}
        ground={ground}
        defaultValue={state === "range" ? [30, 70] : 60}
        formatValue={pct}
        forceState={force}
        disabled={state === "disabled"}
      />
    </div>
  );
}

export function SliderStates() {
  return (
    <StateGrid
      label="Slider states by size"
      states={SLIDER_STATES}
      variants={SIZES}
      minCell={180}
      liveCaption="drag, or Tab and use the arrows"
      render={({ state, variant }) => cell(state, variant)}
    />
  );
}

export function SliderBlueStates() {
  return (
    <>
      <StateGrid
        label="Slider states on the accent water"
        states={SLIDER_BLUE_STATES}
        ground="on-blue"
        minCell={180}
        render={({ state }) => cell(state, "md", "blue")}
      />
      <Canvas ground="on-blue" label="The slider label on the water">
        <Item label="label and value on the water">
          <ContrastBadge fg={SLIDER_BLUE_LABEL.fg} bg={SLIDER_BLUE_LABEL.bg} bgName="the accent water" />
        </Item>
      </Canvas>
    </>
  );
}

const SPEC = { sm: 14, md: 18, lg: 22 } as const;

export function SliderLadder() {
  return (
    <SizeLadder
      label="Slider thumb sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=thumb]",
        node: (
          <div className={styles["ds-in-w240"]}>
            <Slider label={`Size ${s}`} size={s} defaultValue={60} formatValue={pct} />
          </div>
        ),
      }))}
    />
  );
}

export function SliderRange() {
  return (
    <Canvas ground="page" label="Range and ticks">
      <div className={styles["ds-in-stack"]}>
        <Slider label="Skill band" defaultValue={[25, 75]} formatValue={pct} ticks tickLabels />
        <Slider label="Session length" min={5} max={30} step={5} defaultValue={15} formatValue={(v) => `${v} min`} ticks tickLabels />
      </div>
    </Canvas>
  );
}

/** The shipped trait bars driven by the sliders beside them, so the two read as one family. */
export function SliderBesideTraits() {
  const [values, setValues] = useState(() => TRAITS.map((t) => Math.round(t.value * 100)));
  const traits = TRAITS.map((t, k) => ({ label: t.label, value: values[k] / 100 }));
  return (
    <>
      <Canvas ground="on-blue" label="The shipped trait bars">
        <div className={styles["ds-in-w440"]}>
          <PlayerTraits traits={traits} />
        </div>
      </Canvas>
      <Canvas ground="on-blue" label="Sliders on the accent water">
        <div className={styles["ds-in-stack"]}>
          {TRAITS.map((t, k) => (
            <Slider
              key={t.label}
              label={t.label}
              ground="blue"
              value={values[k]}
              formatValue={pct}
              onChange={(v) => setValues((all) => all.map((x, i) => (i === k ? (v as number) : x)))}
            />
          ))}
        </div>
      </Canvas>
    </>
  );
}

export function SliderDoDont() {
  return (
    <DoDont>
      <Do reason="An exact figure takes one try in a number field." ground="page" isolateKeys>
        <div className={styles["ds-in-w240"]}>
          <TextInput label="Players per run" type="number" defaultValue="137" inputMode="numeric" />
        </div>
      </Do>
      <Dont reason="Hitting 137 on a 0 to 500 rail takes several drags, and the reader still checks the label to be sure." ground="page">
        <div className={styles["ds-in-w320"]}>
          <Slider label="Players per run" min={0} max={500} defaultValue={137} />
        </div>
      </Dont>
    </DoDont>
  );
}
