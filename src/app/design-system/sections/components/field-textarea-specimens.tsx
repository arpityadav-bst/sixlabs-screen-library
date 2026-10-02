"use client";

// The textarea's specimens: its anatomy, the state grid by size and the size ladder of rest heights.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { TextArea } from "@/components/design-system/TextArea";
import { AREA_PINS, AREA_STATES, COPY, FIELD_SIZES, FOCUSED, NOTES_MAX, type AreaState } from "./_data/fields";
import styles from "./inputs.module.css";

export function TextAreaAnatomy() {
  return (
    <Anatomy pins={AREA_PINS} ground="page" isolateKeys label="Textarea anatomy">
      <div className={styles["ds-in-w360"]}>
        <TextArea label={COPY.notes} helper={COPY.notesHelper} defaultValue={COPY.notesShort} maxLength={NOTES_MAX} />
      </div>
    </Anatomy>
  );
}

function text(state: AreaState | "live") {
  if (state === "near-limit") return COPY.notesNear;
  if (state === "over-limit" || state === "over-limit-typing") return COPY.notesOver;
  if (state === "filled" || state === "disabled" || state === "read-only" || state === "read-only-focus") return COPY.notesShort;
  return "";
}

export function TextAreaStates() {
  return (
    <StateGrid
      label="Textarea states by size"
      states={AREA_STATES}
      variants={FIELD_SIZES}
      minCell={230}
      isolateKeys
      liveCaption="type past the limit, then Tab"
      render={({ state, variant }) => (
        <TextArea
          label={COPY.notes}
          size={variant}
          maxLength={NOTES_MAX}
          defaultValue={text(state)}
          touched={state === "over-limit" ? true : state === "over-limit-typing" ? false : undefined}
          forceState={state === "hover" ? "hover" : FOCUSED.includes(state) ? "focus" : undefined}
          disabled={state === "disabled"}
          readOnly={state === "read-only" || state === "read-only-focus"}
          error={state === "invalid" || state === "invalid-focus" ? COPY.notesError : undefined}
        />
      )}
    />
  );
}

const SPEC = { sm: 88, md: 112, lg: 136 } as const;

export function TextAreaLadder() {
  return (
    <SizeLadder
      label="Textarea rest heights"
      sizes={FIELD_SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=box]",
        node: (
          <div className={styles["ds-in-w240"]}>
            <TextArea label={`Size ${s}`} hideLabel size={s} placeholder={COPY.notesHelper} />
          </div>
        ),
      }))}
    />
  );
}
