"use client";

// The IconButton's toggled pair, its count badge, the stand-in for the fixed Back to top, and the
// decisions. Client, for the icons and the toggle's state.
import { ArrowUp, Bell, ChevronRight, Menu, Waves, X } from "lucide-react";
import { useState } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Forced } from "@/app/design-system/_kit/Forced";
import { Item } from "@/app/design-system/_kit/Label";
import { Note } from "@/app/design-system/_kit/Note";
import { SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Badge } from "@/components/design-system/Badge";
import { IconButton } from "@/components/design-system/IconButton";
import styles from "./button.module.css";

const SOURCE = { from: "@/components/design-system/IconButton", name: "IconButton" };

function MenuToggle({ variant = "ghost" }: { variant?: "ghost" | "outline" | "glass" }) {
  const [open, setOpen] = useState(false);
  return (
    <IconButton
      icon={Menu}
      toggledIcon={X}
      label="Menu"
      variant={variant}
      selected={open}
      onClick={() => setOpen((v) => !v)}
    />
  );
}

export function IconButtonToggle() {
  return (
    <Spec
      level={4}
      title="Toggled, badge and Back to top"
      source={SOURCE}
      props="selected toggledIcon badge"
      role="A toggle swaps its icon with a quarter turn, so the change is seen where the finger is, not elsewhere."
      caption="Menu to X over 160ms · count pinned 4px out · elevated lg as Back to top"
      note="The shipped Back to top is fixed to the window, so it is shown in Shell. The elevated lg here stands for it."
    >
      <Canvas ground="page" label="Toggle, count and elevated">
        <Item label="ghost · toggle">
          <MenuToggle />
        </Item>
        <Item label="outline · toggle">
          <MenuToggle variant="outline" />
        </Item>
        <Item label="md ghost · count 3">
          <IconButton icon={Bell} label="Alerts" badge={<Badge count={3} pinned label="3 new" />} />
        </Item>
        <Item label="elevated lg · ArrowUp">
          <IconButton icon={ArrowUp} label="Back to top" variant="elevated" size="lg" />
        </Item>
      </Canvas>
      <Canvas ground="on-blue" label="Toggle on blue">
        <Item label="glass · toggle">
          <MenuToggle variant="glass" />
        </Item>
        <Item label="glass · md">
          <IconButton icon={ChevronRight} label="Next player" variant="glass" />
        </Item>
      </Canvas>
    </Spec>
  );
}

export function IconButtonDecisions() {
  return (
    <>
      <DoDont>
        <Do reason="Toggled fills navy, the system's one selected colour, so on reads the same on every control.">
          <IconButton icon={Menu} toggledIcon={X} label="Menu" selected />
        </Do>
        <Dont reason="An accent toggle borrows the accent water's colour for a state, and the two start to mean one thing.">
          <span className={styles["ds-dont-accent"]}>
            <IconButton icon={Menu} toggledIcon={X} label="Menu" selected />
          </span>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="An icon the visitor may not know widens its name on hover and focus, as the wave button does, so the action names itself.">
          <Forced state="hover" label="Next wave">
            <IconButton icon={Waves} label="Next wave" variant="outline" showLabelOnHover forceState="hover" />
          </Forced>
        </Do>
        <Dont reason="The same icon with no word leaves its action to a guess, and only a screen reader hears its name.">
          <IconButton icon={Waves} label="Next wave" variant="outline" />
        </Dont>
      </DoDont>
      <Note>
        Glass off the accent water is shown once, with the white ladder it belongs to, in{" "}
        <SectionLink id="colour-special" />.
      </Note>
    </>
  );
}
