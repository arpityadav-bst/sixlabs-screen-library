"use client";

// The specimens that pass an icon to the Button (a client part, so the icon cannot cross from a server
// file): its anatomy, the icon and loading slots, the group and the decisions.
import { ArrowRight, Plus } from "lucide-react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Button } from "@/components/design-system/Button";
import { ButtonGroup } from "@/components/design-system/ButtonGroup";
import { BUTTON_PINS, GROUP_CODE, GROUP_PINS, GROUP_VALUES, SWEPT_PINS } from "./button-data";
import styles from "./button.module.css";

const SOURCE = { from: "@/components/design-system/Button", name: "Button" };

export function ButtonAnatomy() {
  return (
    <Spec
      level={4}
      title="Anatomy"
      source={SOURCE}
      props="leadingIcon trailingIcon"
      role="A pill with a 1px border on every variant, so swapping the variant never moves the label."
      caption="lg with both icons · xl primary with its sweep layers"
    >
      <Anatomy pins={BUTTON_PINS} label="Button anatomy">
        <span data-pin="btn">
          <Button size="lg" variant="secondary" leadingIcon={Plus} trailingIcon={ArrowRight}>
            Continue
          </Button>
        </span>
      </Anatomy>
      <Anatomy pins={SWEPT_PINS} label="Extra large primary anatomy">
        <span data-pin="xl">
          <Button size="xl">Try now</Button>
        </span>
      </Anatomy>
    </Spec>
  );
}

export function ButtonSlots() {
  return (
    <Spec
      level={4}
      title="Icons, loading and full width"
      source={SOURCE}
      props="leadingIcon trailingIcon loading fullWidth"
      role="Icons take the size ladder's own stroke, and loading keeps the width, so the row never jumps."
      caption="md leading Plus 16 · lg trailing ArrowRight 18 · md loading · fullWidth in a 320 box"
    >
      <Canvas ground="page" label="Icon and loading slots">
        <Item label="leadingIcon · md">
          <Button leadingIcon={Plus}>Continue</Button>
        </Item>
        <Item label="trailingIcon · lg">
          <Button size="lg" trailingIcon={ArrowRight}>
            Try now
          </Button>
        </Item>
        <Item label="loading · md">
          <Button loading>Try now</Button>
        </Item>
        <Item label="loading · secondary">
          <Button variant="secondary" loading>
            Sign in
          </Button>
        </Item>
      </Canvas>
      <Canvas ground="container" label="Full width">
        <Item label="fullWidth · 320 box">
          <div className={styles["ds-box-320"]}>
            <Button fullWidth size="lg">
              Try now
            </Button>
          </div>
        </Item>
      </Canvas>
    </Spec>
  );
}

export function ButtonGroupSpec() {
  return (
    <Spec
      level={4}
      title="Button group"
      source={{ from: "@/components/design-system/ButtonGroup", name: "ButtonGroup" }}
      props="align"
      role="The primary sits last, where the eye ends, and lands on top under the thumb when the row stacks."
      caption="gap 12 · stacks under 400px with the primary first"
      drawer={{ values: GROUP_VALUES, code: GROUP_CODE }}
    >
      <Anatomy pins={GROUP_PINS} layout="stack" label="Button group anatomy">
        <div data-pin="group" className={styles["ds-box-wide"]}>
          <ButtonGroup>
            <Button variant="ghost">Cancel</Button>
            <Button variant="secondary">Sign in</Button>
            <Button>Try now</Button>
          </ButtonGroup>
        </div>
      </Anatomy>
      <Canvas ground="container" layout="stack" label="Button group across widths">
        <ViewportPreview part="button-group" title="Button group across widths" height={180} widths={[375, 768]} width={375} />
      </Canvas>
    </Spec>
  );
}

export function ButtonDecisions() {
  return (
    <>
      <DoDont>
        <Do reason="One solid primary per view, so the next step is never a choice the visitor did not ask for.">
          <ButtonGroup>
            <Button variant="ghost">Cancel</Button>
            <Button>Try now</Button>
          </ButtonGroup>
        </Do>
        <Dont reason="Two solid primaries read as equal, so neither reads as the way forward.">
          <ButtonGroup>
            <Button>Sign in</Button>
            <Button>Try now</Button>
          </ButtonGroup>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The primary is navy, so the accent stays free for the accent water and the words it marks.">
          <Button size="lg">Try now</Button>
        </Do>
        <Dont reason="An accent fill outside the players section competes with the one place the blue is a ground.">
          <span className={styles["ds-dont-accent"]}>
            <Button size="lg">Try now</Button>
          </span>
        </Dont>
      </DoDont>
    </>
  );
}
