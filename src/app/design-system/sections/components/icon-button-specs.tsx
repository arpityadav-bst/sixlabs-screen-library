"use client";

// The system IconButton: anatomy, the variant by size matrix, both state grids and the size ladder. It
// takes an icon (a function), so these specimens render in a client file.
import { ArrowUp, Bell, ChevronRight, Plus, Waves, X, type LucideIcon } from "lucide-react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { None } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { Badge } from "@/components/design-system/Badge";
import type { ForceState } from "@/components/design-system/force";
import { IconButton } from "@/components/design-system/IconButton";
import type { IconButtonVariant } from "@/components/design-system/icon-button-styles";
import {
  GLASS_STATES,
  ICON_CODE,
  ICON_LABEL,
  ICON_PINS,
  ICON_PROPS,
  ICON_SIZES,
  ICON_STATES,
  ICON_VALUES,
  LIGHT_ICON_VARIANTS,
  hasIconState,
} from "./icon-button-data";
import styles from "./button.module.css";

const SOURCE = { from: "@/components/design-system/IconButton", name: "IconButton" };

export const ICON_OF: Record<IconButtonVariant, LucideIcon> = {
  elevated: ArrowUp,
  outline: Waves,
  ghost: X,
  solid: Plus,
  glass: ChevronRight,
};

export function IconButtonAnatomy() {
  return (
    <Spec
      level={4}
      title="Anatomy"
      source={SOURCE}
      props="badge showLabelOnHover"
      role="One circle per size, so the icon sits at its optical centre and a count badge pins to the same corner."
      caption="md ghost with a count · outline with its label widened (forced hover)"
      drawer={{ values: ICON_VALUES, props: ICON_PROPS, code: ICON_CODE }}
    >
      <Anatomy pins={ICON_PINS} label="Icon button anatomy">
        <span data-pin="badge">
          <IconButton icon={Bell} label="Alerts" badge={<Badge count={3} pinned label="3 new" />} />
        </span>
        <span data-pin="label">
          <IconButton icon={Waves} label="Next wave" variant="outline" showLabelOnHover forceState="hover" />
        </span>
      </Anatomy>
    </Spec>
  );
}

function Row({ variant }: { variant: IconButtonVariant }) {
  return (
    <div className={styles["ds-bm-row"]}>
      <span className={styles["ds-bm-name"]}>{variant}</span>
      {ICON_SIZES.map((s) => (
        <IconButton key={s.name} icon={ICON_OF[variant]} label={ICON_LABEL[variant]} variant={variant} size={s.name} />
      ))}
    </div>
  );
}

export function IconButtonMatrix() {
  return (
    <Spec
      level={4}
      title="Variants by size"
      source={SOURCE}
      props="variant size"
      role="Each variant answers the ground under it: elevated floats over content, outline sits on the grey, ghost stays quiet inside a row."
      caption="xs 28 · sm 32 · md 40 · lg 44 · xl 48 · icons 14 / 16 / 18 / 18 / 20 · glass on blue"
    >
      <Canvas ground="page" layout="stack" label="Icon button variants on the page">
        <div className={styles["ds-bm-scroll"]}>
          <div className="grid gap-4">
            {LIGHT_ICON_VARIANTS.map((v) => (
              <Row key={v} variant={v} />
            ))}
          </div>
        </div>
      </Canvas>
      <Canvas ground="container" layout="stack" label="Outline on the container">
        <div className={styles["ds-bm-scroll"]}>
          <Row variant="outline" />
        </div>
      </Canvas>
      <Canvas ground="on-blue" layout="stack" label="Glass on blue">
        <div className={styles["ds-bm-scroll"]}>
          <Row variant="glass" />
        </div>
      </Canvas>
    </Spec>
  );
}

function cell(variant: IconButtonVariant, force?: string) {
  if (force && !hasIconState(variant, force)) return <None />;
  // toggled-hover is a toggled button under the pointer: the selected prop with a forced hover
  if (force === "toggled-hover")
    return <IconButton icon={ICON_OF[variant]} label={ICON_LABEL[variant]} variant={variant} selected forceState="hover" />;
  return (
    <IconButton
      icon={ICON_OF[variant]}
      label={ICON_LABEL[variant]}
      variant={variant}
      forceState={force as ForceState | undefined}
    />
  );
}

export function IconButtonStates() {
  return (
    <Spec
      level={4}
      title="States"
      source={SOURCE}
      props="forceState selected loading disabled"
      role="Toggled fills navy and the press settles to 0.94, so a small target still answers the finger it sits under."
      caption="md · toggled is aria-pressed, never a colour alone · solid is an action, so it has no toggled"
    >
      <StateGrid
        label="Icon button states on the page"
        states={ICON_STATES}
        variants={LIGHT_ICON_VARIANTS}
        minCell={96}
        render={({ variant, force }) => cell(variant, force)}
      />
      <StateGrid
        label="Glass icon button states on blue"
        ground="on-blue"
        states={GLASS_STATES}
        variants={["glass"] as const}
        minCell={96}
        render={({ variant, force }) => cell(variant, force)}
      />
    </Spec>
  );
}

export function IconButtonSizes() {
  return (
    <Spec
      level={4}
      title="Sizes"
      source={SOURCE}
      props="size"
      role="The ladder matches the Button's rows, and md is the least a touch target takes."
    >
      <SizeLadder
        label="Icon button sizes"
        sizes={ICON_SIZES.map((s) => ({
          name: s.name,
          spec: s.px,
          node: <IconButton icon={Waves} label="Next wave" variant="outline" size={s.name} />,
        }))}
      />
    </Spec>
  );
}
