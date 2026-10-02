"use client";

// The system Chip: anatomy, the three kinds at three sizes, every state on light and on the accent water,
// the size ladder, wrapping against scrolling on a phone, the glass form on the water, and the decisions.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { contrastRatio } from "@/app/design-system/_kit/contrast";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item, None } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { Avatar } from "@/components/design-system/Avatar";
import { Chip, type ChipGround, type ChipKind } from "@/components/design-system/Chip";
import type { ForceState } from "@/components/design-system/force";
import {
  CHIP_CODE,
  CHIP_KINDS,
  CHIP_PINS,
  CHIP_PROPS,
  CHIP_SIZES,
  CHIP_STATES,
  CHIP_VALUES,
  JOB_TITLES,
  TRAITS,
  TYPES,
  chipHas,
} from "./chip-data";
import { ChoiceRow, FilterRow, InputRow } from "./chip-live";
import { WATER } from "./contrast-pairs";
import { tokenColour } from "./display-values";
import styles from "./tabs.module.css";

/** The rest label on the water: white on a clear fill, as chip-styles.ts:36 sets the onBlue ground. */
const BLUE_LABEL = { fg: tokenColour("color-surface"), bg: WATER };
const BLUE_MISS = (contrastRatio(BLUE_LABEL.fg, BLUE_LABEL.bg) ?? 0) < 4.5;

const SOURCE = { from: "@/components/design-system/Chip", name: "Chip" };

export function ChipAnatomy() {
  return (
    <Spec
      title="Anatomy"
      source={SOURCE}
      props="kind selected avatar onRemove"
      role="The check takes room only when selected, so a chosen chip says so in shape as well as in navy."
      caption="filter, selected · input with an Avatar 20 and its remove button"
      drawer={{ values: CHIP_VALUES, props: CHIP_PROPS, code: CHIP_CODE }}
    >
      <Anatomy pins={CHIP_PINS} label="Chip anatomy">
        <span data-pin="filter">
          <Chip selected onToggle={noop}>
            {TRAITS[0]}
          </Chip>
        </span>
        <span data-pin="input">
          <Chip kind="input" avatar={<Avatar name={TYPES[0]} size={20} shape="model" />} onRemove={noop}>
            {TYPES[0]}
          </Chip>
        </span>
      </Anatomy>
    </Spec>
  );
}

export function ChipKinds() {
  return (
    <Spec
      title="Kinds"
      source={SOURCE}
      props="kind"
      role="Filters toggle on their own, choices are one of a set, and input chips hold values a person can take back."
      caption="filter · a labelled group of toggles · choice · a radio group, the arrows move · input · Backspace or Delete removes"
    >
      <Canvas ground="page" layout="stack" label="Chip kinds">
        <Item label="filter · group of toggle buttons" align="start">
          <FilterRow />
        </Item>
        <Item label="choice · radiogroup, one tab stop" align="start">
          <ChoiceRow />
        </Item>
        <Item label="input · removable, with Avatar 20" align="start">
          <InputRow />
        </Item>
      </Canvas>
    </Spec>
  );
}

function cell(kind: ChipKind, force?: string, ground: ChipGround = "light") {
  if (force && !chipHas(kind, force)) return <None />;
  // selected-hover is a picked chip held under the pointer: the selected prop with a forced hover
  if (force === "selected-hover")
    return (
      <Chip kind={kind} ground={ground} selected forceState="hover" onToggle={noop}>
        {kind === "choice" ? TYPES[1] : TRAITS[1]}
      </Chip>
    );
  const f = force as ForceState | undefined;
  if (kind === "input")
    return (
      <Chip kind="input" ground={ground} forceState={f} onRemove={noop}>
        {JOB_TITLES[1]}
      </Chip>
    );
  return (
    <Chip kind={kind} ground={ground} forceState={f} onToggle={noop}>
      {kind === "choice" ? TYPES[1] : TRAITS[1]}
    </Chip>
  );
}

export function ChipStates() {
  return (
    <Spec
      title="States"
      source={SOURCE}
      props="forceState"
      role="Every kind takes the same hover, press and ring, so a row of mixed chips behaves as one family."
      caption="md · selected adds the check · remove-hover lights the remove button only"
    >
      <StateGrid
        label="Chip states"
        states={CHIP_STATES}
        variants={CHIP_KINDS}
        minCell={128}
        render={({ variant, force }) => cell(variant, force)}
      />
      <StateGrid
        label="Chip states on the accent water"
        ground="on-blue"
        states={CHIP_STATES}
        variants={CHIP_KINDS}
        minCell={128}
        render={({ variant, force }) => cell(variant, force, "onBlue")}
      />
    </Spec>
  );
}

export function ChipSizes() {
  return (
    <Spec title="Sizes" source={SOURCE} props="size" role="Three heights that sit beside a 28, 32 or 36 control without a seam.">
      <SizeLadder
        label="Chip sizes"
        sizes={CHIP_SIZES.map((s) => ({
          name: s.name,
          spec: s.px,
          node: (
            <Chip size={s.name} onToggle={noop}>
              {TRAITS[0]}
            </Chip>
          ),
        }))}
      />
    </Spec>
  );
}

export function ChipRows() {
  return (
    <Spec
      title="Wrapping and scrolling"
      source={SOURCE}
      role="Filters wrap where every one must stay in view, and scroll in one line where the row heads a list on a phone."
      caption="375 box · wrap at the 8px gap · scroll in its own box, never the page"
    >
      <Canvas ground="page" label="Wrapped and scrolling chip rows">
        <Item label="wrap" align="start">
          <div className={styles["ds-phone-box"]}>
            <FilterRow labels={[...TRAITS, ...JOB_TITLES]} />
          </div>
        </Item>
        <Item label="scroll" align="start">
          <div className={styles["ds-phone-box"]}>
            <FilterRow labels={[...TRAITS, ...JOB_TITLES]} scroll />
          </div>
        </Item>
      </Canvas>
    </Spec>
  );
}

export function ChipOnBlue() {
  return (
    <Spec
      title="On the accent water"
      source={SOURCE}
      props="ground"
      role="On the accent water the chip turns glass, and selected turns white, the brightest thing on that ground."
      caption="ground onBlue · a clear fill in a white 40% line, white 15% on hover · selected white with ink"
      note={BLUE_MISS ? "The white rest label misses AA on the water, as its badge reads, a system miss the chip still carries." : undefined}
    >
      <Canvas ground="on-blue" layout="stack" label="Chips on the water">
        <FilterRow ground="onBlue" />
        <ChoiceRow ground="onBlue" size="sm" />
        <Item label="rest label on the water" align="start">
          <ContrastBadge fg={BLUE_LABEL.fg} bg={BLUE_LABEL.bg} bgName="the accent water" />
        </Item>
      </Canvas>
    </Spec>
  );
}

export function ChipDecisions() {
  return (
    <>
      <DoDont>
        <Do reason="Selected is navy with a check, so the state reads in shape for a reader who cannot see the colour.">
          <Chip selected onToggle={noop}>
            {TRAITS[0]}
          </Chip>
        </Do>
        <Dont reason="An accent fill with no check leaves colour alone to carry the state, in the blue the water owns.">
          <span className={styles["ds-dont-accent-chip"]}>
            <Chip onToggle={noop}>{TRAITS[0]}</Chip>
          </span>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="One to three words per chip, so a row scans as a set of options.">
          <FilterRow labels={TRAITS} size="sm" />
        </Do>
        <Dont reason="A sentence in a chip turns the row into a paragraph and wraps into a wall on a phone.">
          <Chip onToggle={noop}>Show only the players who joined in the last thirty days</Chip>
        </Dont>
      </DoDont>
    </>
  );
}
