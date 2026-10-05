// The system Button's variant by size matrix, its two state grids (light grounds and the players' blue)
// and its size ladder. Every cell is the real Button. Forced cells take forceState, the live column is free.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { contrastRatio } from "@/app/design-system/_kit/contrast";
import { Item, None } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Button } from "@/components/design-system/Button";
import { BUTTON_VARIANT, type ButtonVariant } from "@/components/design-system/button-styles";
import type { ForceState } from "@/components/design-system/force";
import {
  BLUE_STATES,
  BLUE_VARIANTS,
  BUTTON_CODE,
  BUTTON_PROPS,
  BUTTON_SIZES,
  BUTTON_STATES,
  BUTTON_VALUES,
  LIGHT_VARIANTS,
  VARIANT_LABEL,
  hasState,
} from "./button-data";
import styles from "./button.module.css";
import { WATER, blend, restColour } from "./contrast-pairs";

const SOURCE = { from: "@/components/design-system/Button", name: "Button" };

/** The glass label over its own fill on the water, read from the variant's classes. */
const GLASS = {
  fg: restColour(BUTTON_VARIANT.glass, "text"),
  bg: blend(restColour(BUTTON_VARIANT.glass, "bg"), WATER),
};
const GLASS_MISS = (contrastRatio(GLASS.fg, GLASS.bg) ?? 0) < 4.5;

function Row({ variant }: { variant: ButtonVariant }) {
  return (
    <div className={styles["ds-bm-row"]}>
      <span className={styles["ds-bm-name"]}>{variant}</span>
      {BUTTON_SIZES.map((s) => (
        <Button key={s.name} variant={variant} size={s.name}>
          {VARIANT_LABEL[variant]}
        </Button>
      ))}
    </div>
  );
}

export function ButtonMatrix() {
  return (
    <Spec
      level={4}
      title="Variants by size"
      source={SOURCE}
      props="variant size"
      role="Each variant is one rung of emphasis, so a view reads its order of actions before a word of it."
      caption="xs 28 · sm 32 · md 40 · lg 48 · xl 52 · inverse and glass on blue"
      drawer={{ values: BUTTON_VALUES, props: BUTTON_PROPS, code: BUTTON_CODE }}
      note={GLASS_MISS ? "The glass label misses AA on the water, as its badge reads, a system miss the variant still carries." : undefined}
    >
      <Canvas ground="page" layout="stack" label="Button variants on the page">
        <div className={styles["ds-bm-scroll"]}>
          <div className="grid gap-4">
            {LIGHT_VARIANTS.map((v) => (
              <Row key={v} variant={v} />
            ))}
          </div>
        </div>
      </Canvas>
      <Canvas ground="on-blue" layout="stack" label="Button variants on blue">
        <div className={styles["ds-bm-scroll"]}>
          <div className="grid gap-4">
            {BLUE_VARIANTS.map((v) => (
              <Row key={v} variant={v} />
            ))}
          </div>
        </div>
        <Item label="glass label on its fill over the water">
          <ContrastBadge fg={GLASS.fg} bg={GLASS.bg} bgName="the glass fill on the water" />
        </Item>
      </Canvas>
    </Spec>
  );
}

function cell(variant: ButtonVariant, state: string | undefined) {
  if (state && !hasState(variant, state)) return <None />;
  // selected-hover is the toggle held under the pointer: the selected prop with a forced hover
  if (state === "selected-hover")
    return (
      <Button variant={variant} selected forceState="hover">
        {VARIANT_LABEL[variant]}
      </Button>
    );
  return (
    <Button variant={variant} forceState={state as ForceState | undefined}>
      {VARIANT_LABEL[variant]}
    </Button>
  );
}

export function ButtonStates() {
  return (
    <Spec
      level={4}
      title="States"
      source={SOURCE}
      props="forceState"
      role="Every state shows on the real part, so a hover or a press is judged on the ground it ships on."
      caption="md · forced cells are pictures, the live column answers the pointer and the keyboard"
      note="Selected is a toggle state: it exists only where a button stays pressed, as a view filter does."
    >
      <StateGrid
        label="Button states on light grounds"
        states={BUTTON_STATES}
        variants={LIGHT_VARIANTS}
        render={({ variant, force }) => cell(variant, force)}
      />
      <StateGrid
        label="Button states on blue"
        ground="on-blue"
        states={BLUE_STATES}
        variants={BLUE_VARIANTS}
        render={({ variant, force }) => cell(variant, force)}
      />
    </Spec>
  );
}

export function ButtonSizes() {
  return (
    <Spec
      level={4}
      title="Sizes"
      source={SOURCE}
      props="size"
      role="Five heights, each shared with one neighbour of another kind."
    >
      <SizeLadder
        label="Button sizes"
        sizes={BUTTON_SIZES.map((s) => ({
          name: s.name,
          spec: s.height,
          node: <Button size={s.name}>Try now</Button>,
        }))}
      />
    </Spec>
  );
}
