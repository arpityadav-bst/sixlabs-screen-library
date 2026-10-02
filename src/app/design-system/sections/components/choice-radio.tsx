"use client";

// The radio's specimens: a group's anatomy, the state grid by size, the circle ladder, the card row and the
// card radio's own state grid.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Radio, RadioGroup } from "@/components/design-system/Radio";
import {
  CARD_RADIO_STATES,
  JOB_OPTIONS,
  PLAYER_OPTIONS,
  RADIO_PINS,
  RADIO_STATES,
  SIZES,
  forcedBy,
  type CardRadioState,
  type RadioState,
} from "./_data/choice";
import styles from "./inputs.module.css";

export function RadioAnatomy() {
  return (
    <Anatomy pins={RADIO_PINS} ground="page" gutter={48} isolateKeys label="Radio group anatomy">
      <div className={styles["ds-in-w360"]}>
        <RadioGroup legend="Player type" options={PLAYER_OPTIONS.slice(0, 3)} defaultValue={PLAYER_OPTIONS[1].value} />
      </div>
    </Anatomy>
  );
}

function cell(state: RadioState | "live", size: (typeof SIZES)[number], row: string) {
  if (state === "live") {
    return (
      <RadioGroup
        legend={`Live ${row}`}
        hideLegend
        size={size}
        options={PLAYER_OPTIONS.slice(0, 2).map((o) => ({ value: o.value, label: o.label }))}
        defaultValue={PLAYER_OPTIONS[0].value}
      />
    );
  }
  const checked = state === "checked" || state.endsWith("-checked") || state === "checked-hover";
  // read-only is said by the group (aria-readonly on the radiogroup), so those cells are a readOnly RadioGroup
  if (state.startsWith("read-only"))
    return (
      <RadioGroup
        legend={`Read-only ${row}`}
        hideLegend
        readOnly
        size={size}
        options={[{ value: "explorer", label: "The explorer" }]}
        value={checked ? "explorer" : ""}
      />
    );
  return (
    <Radio
      name={`grid-${row}-${state}`}
      value="explorer"
      label="The explorer"
      size={size}
      checked={checked}
      forceState={forcedBy(state)}
      disabled={state.startsWith("disabled")}
      invalid={state === "invalid"}
    />
  );
}

export function RadioStates() {
  return (
    <StateGrid
      label="Radio states by size"
      states={RADIO_STATES}
      variants={SIZES}
      minCell={130}
      liveCaption="click, then use the arrows"
      render={({ state, variant }) => cell(state, variant, variant)}
    />
  );
}

const SPEC = { sm: 16, md: 18, lg: 20 } as const;

export function RadioLadder() {
  return (
    <SizeLadder
      label="Radio circle sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=circle]",
        node: <Radio name={`ladder-${s}`} value={s} label={`Size ${s}`} size={s} checked />,
      }))}
    />
  );
}

const CARD_JOB = JOB_OPTIONS[1];

function card(state: CardRadioState, checked: boolean, onPick?: () => void) {
  const readOnly = state.startsWith("read-only");
  const radio = (
    <Radio
      card
      name={`card-grid-${state}`}
      value={CARD_JOB.value}
      label={CARD_JOB.label}
      description={CARD_JOB.description}
      checked={checked}
      onChange={onPick}
      forceState={forcedBy(state)}
      disabled={state.startsWith("disabled")}
      readOnly={readOnly}
      invalid={state === "invalid"}
    />
  );
  // a lone card cannot say read-only itself, so the cell is the radiogroup that does, as RadioGroup renders
  return readOnly ? (
    <div role="radiogroup" aria-readonly="true" aria-label={`Card radio, ${state}`}>
      {radio}
    </div>
  ) : (
    radio
  );
}

const cardChecked = (s: CardRadioState) => s === "checked" || s === "checked-hover" || s.endsWith("-checked");

/** The live card: a pick that a second click leaves picked, as a radio does. */
function LiveCard() {
  const [on, setOn] = useState(false);
  return card("rest", on, () => setOn(true));
}

export function RadioCards() {
  return (
    <>
      <Canvas ground="page" isolateKeys label="Card radios">
        <div className={styles["ds-in-fill"]}>
          <RadioGroup legend="First job" variant="card" options={JOB_OPTIONS} defaultValue={JOB_OPTIONS[1].value} />
        </div>
      </Canvas>
      <StateGrid
        label="Card radio states"
        states={CARD_RADIO_STATES}
        minCell={250}
        isolateKeys
        liveCaption="hover, click or Tab here"
        render={({ state }) => (state === "live" ? <LiveCard /> : card(state, cardChecked(state)))}
      />
    </>
  );
}
