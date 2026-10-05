"use client";

// The text input's specimens: the anatomy, the state grid, the size ladder, a card of fields, the live
// validation demo and the two decisions. Client, because the specimens take lucide icons and handlers.
import { Building2, Mail, X } from "lucide-react";
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Forced } from "@/app/design-system/_kit/Forced";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { IconButton } from "@/components/design-system/IconButton";
import { TextInput } from "@/components/design-system/TextInput";
import { tokenByName } from "@/components/design-system/tokens";
import { COPY, FIELD_PINS, FIELD_SIZES, FIELD_STATES, FOCUSED, type FieldState } from "./_data/fields";
import styles from "./inputs.module.css";

const LINE_FIELD = tokenByName("color-line-field")?.value ?? "";

/** Two fields, so the box at rest and the box in error each get their own pins. */
export function FieldAnatomy() {
  return (
    <Anatomy pins={FIELD_PINS} ground="page" gutter={48} isolateKeys label="Text input anatomy">
      <div className={styles["ds-in-w360"]}>
        <div className={styles["ds-in-stack"]}>
          <TextInput
            label={COPY.studio}
            leadingIcon={Building2}
            defaultValue={COPY.studioValue}
            helper={COPY.studioHelper}
            maxLength={40}
            showCount
            trailing={<IconButton icon={X} label="Clear" size="xs" variant="ghost" />}
          />
          <TextInput label={COPY.email} type="email" leadingIcon={Mail} defaultValue="mira.northwind" error={COPY.emailError} />
        </div>
      </div>
    </Anatomy>
  );
}

function cell(state: FieldState | "live", size: (typeof FIELD_SIZES)[number]) {
  const invalid = state === "invalid" || state === "invalid-focus";
  const readOnly = state === "read-only" || state === "read-only-focus";
  const filled = state === "filled" || state === "disabled" || readOnly || invalid || state === "success";
  return (
    <TextInput
      label={COPY.email}
      size={size}
      type="email"
      leadingIcon={Mail}
      placeholder={COPY.emailHint}
      defaultValue={filled ? (invalid ? "mira.northwind" : COPY.emailValue) : ""}
      forceState={state === "hover" ? "hover" : FOCUSED.includes(state) ? "focus" : undefined}
      disabled={state === "disabled"}
      readOnly={readOnly}
      error={invalid ? COPY.emailError : undefined}
      success={state === "success" ? COPY.emailOk : undefined}
    />
  );
}

export function TextInputStates() {
  return (
    <StateGrid
      label="Text input states by size"
      states={FIELD_STATES}
      variants={FIELD_SIZES}
      minCell={210}
      isolateKeys
      liveCaption="type, Tab or hover here"
      render={({ state, variant }) => cell(state, variant)}
    />
  );
}

const SPEC = { sm: 36, md: 44, lg: 52 } as const;

export function TextInputLadder() {
  return (
    <SizeLadder
      label="Text input sizes"
      sizes={FIELD_SIZES.map((s) => ({
        name: s,
        spec: SPEC[s],
        select: "[data-slot=box]",
        node: (
          <div className={styles["ds-in-w240"]}>
            <TextInput label={`Size ${s}`} hideLabel size={s} leadingIcon={Mail} placeholder={COPY.emailHint} />
          </div>
        ),
      }))}
    />
  );
}

export function FieldsOnCard() {
  return (
    <Canvas ground="page" isolateKeys label="Fields on a white card">
      <div className={styles["ds-in-card"]}>
        <TextInput label={COPY.studio} leadingIcon={Building2} defaultValue={COPY.studioValue} helper={COPY.studioHelper} />
        <Forced state="focus" label="email field">
          <TextInput label={COPY.email} type="email" leadingIcon={Mail} placeholder={COPY.emailHint} forceState="focus" />
        </Forced>
        <TextInput label="Team size" optional placeholder="12" inputMode="numeric" trailing={<span className={styles["ds-in-unit"]}>people</span>} />
      </div>
    </Canvas>
  );
}

/** The live rule: the error waits for the first blur, then clears on the keystroke that fixes it. */
export function ValidationDemo() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const bad = value !== "" && !value.includes("@");
  return (
    <Canvas ground="page" isolateKeys label="Validation timing">
      <div className={styles["ds-in-w360"]}>
        <TextInput
          label={COPY.email}
          type="email"
          leadingIcon={Mail}
          placeholder={COPY.emailHint}
          helper="Type a name without an @, then press Tab."
          value={value}
          onChange={(v) => setValue(v)}
          onBlur={() => setTouched(true)}
          error={touched && bad ? COPY.emailError : undefined}
        />
      </div>
    </Canvas>
  );
}

export function GroundDoDont() {
  return (
    <DoDont>
      <Do reason="On the page or a white card the field line clears 3:1, as its badges read, so the box still reads as a box." isolateKeys>
        <div className={styles["ds-in-w320"]}>
          <TextInput label={COPY.email} leadingIcon={Mail} placeholder={COPY.emailHint} />
          <div className={styles["ds-in-badge"]}>
            <ContrastBadge fg={LINE_FIELD} bg="surface" bgName="white" />
            <ContrastBadge fg={LINE_FIELD} bg="page" bgName="the page" />
          </div>
        </div>
      </Do>
      <Dont reason="On the hero container's grey the same line falls under 3:1, as its badge reads, and the edge of the box fades into the ground." ground="container" isolateKeys>
        <div className={styles["ds-in-w320"]}>
          <TextInput label={COPY.email} leadingIcon={Mail} placeholder={COPY.emailHint} />
          <div className={styles["ds-in-badge"]}>
            <ContrastBadge fg={LINE_FIELD} bg="container" bgName="container" />
          </div>
        </div>
      </Dont>
    </DoDont>
  );
}

export function LabelDoDont() {
  return (
    <DoDont>
      <Do reason="The label stays above the box while the reader types, so the question is never lost." isolateKeys>
        <div className={styles["ds-in-w320"]}>
          <TextInput label={COPY.email} placeholder={COPY.emailHint} />
        </div>
      </Do>
      <Dont reason="A placeholder used as the label vanishes on the first key and fails contrast as a label." isolateKeys>
        <div className={styles["ds-in-w320"]}>
          <TextInput label={COPY.email} hideLabel placeholder={COPY.email} />
        </div>
      </Dont>
    </DoDont>
  );
}
