"use client";

// The Select's specimens: the open panel in the flow (its anatomy and its row states), the trigger's
// state grid, the size ladder and the choice between a Select and radios.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { RadioGroup } from "@/components/design-system/Radio";
import { Select } from "@/components/design-system/Select";
import {
  PLAYER_OPTIONS,
  SELECT_PINS,
  SELECT_STATES,
  SIZES,
  TAG_ACTIVE,
  TAG_OPTIONS,
  TAG_SELECTED,
  type SelectState,
} from "./_data/select-search";
import styles from "./inputs.module.css";

export function SelectAnatomy() {
  return (
    <Anatomy pins={SELECT_PINS} ground="page" gutter={48} isolateKeys label="Select anatomy, open in the flow">
      <div className={styles["ds-in-w360"]}>
        <Select label="Run type" options={TAG_OPTIONS} defaultValue={TAG_SELECTED} active={TAG_ACTIVE} inline />
      </div>
    </Anatomy>
  );
}

function trigger(state: SelectState | "live") {
  const chosen = state === "filled" || state === "disabled" || state === "read-only" || state === "invalid" || state === "live";
  const select = (
    <Select
      label="Player type"
      options={PLAYER_OPTIONS}
      defaultValue={chosen && state !== "live" ? PLAYER_OPTIONS[1].value : null}
      forceState={state === "hover" ? "hover" : state === "focus" ? "focus" : state === "open" ? "open" : undefined}
      disabled={state === "disabled"}
      readOnly={state === "read-only"}
      error={state === "invalid" ? "Pick the player type to model." : undefined}
      native="never"
    />
  );
  // the open cell holds the room its panel drops into, so the list is seen whole inside the grid
  return state === "open" ? <div className={styles["ds-in-open"]}>{select}</div> : select;
}

export function SelectStates() {
  return (
    <StateGrid
      label="Select trigger states"
      states={SELECT_STATES}
      minCell={200}
      isolateKeys
      liveCaption="click, or Tab and press the arrows"
      render={({ state }) => trigger(state)}
    />
  );
}

const SPEC = { sm: 36, md: 44, lg: 52 } as const;

export function SelectLadder() {
  return (
    <SizeLadder
      label="Select trigger sizes"
      sizes={SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=box]",
        node: (
          <div className={styles["ds-in-w240"]}>
            <Select label={`Size ${s}`} hideLabel size={s} options={PLAYER_OPTIONS} native="never" />
          </div>
        ),
      }))}
    />
  );
}

export function SelectDoDont() {
  return (
    <DoDont>
      <Do reason="Four player types fit in view, so radios show every choice without a click." isolateKeys>
        <RadioGroup legend="Player type" options={PLAYER_OPTIONS} defaultValue={PLAYER_OPTIONS[0].value} />
      </Do>
      <Dont reason="A Select for a handful of options hides the answers behind a click and a scan." isolateKeys>
        <div className={styles["ds-in-w240"]}>
          <Select label="Player type" options={PLAYER_OPTIONS} defaultValue={PLAYER_OPTIONS[0].value} native="never" />
        </div>
      </Dont>
    </DoDont>
  );
}
