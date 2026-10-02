"use client";

// The system Tabs: anatomy, sizes, states, the phone-wide list that scrolls, a live set with panels and
// the decisions. Every live specimen keeps its own choice.
import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import type { ForceState } from "@/components/design-system/force";
import { Tabs, type TabItem, type TabsSize } from "@/components/design-system/Tabs";
import {
  MANY_TABS,
  PANEL_COPY,
  TAB_CODE,
  TAB_PINS,
  TAB_PROPS,
  TAB_SIZES,
  TAB_STATES,
  TAB_VALUES,
  THREE_TABS,
  TWO_TABS,
} from "./tabs-data";
import styles from "./tabs.module.css";

const SOURCE = { from: "@/components/design-system/Tabs", name: "Tabs" };

/** A Tabs that keeps its own choice. */
function LiveTabs<T extends string>({
  label,
  items,
  size,
  activation,
  panels,
}: {
  /** the tab list's accessible name, from the spec it sits in */
  label: string;
  items: readonly TabItem<T>[];
  size?: TabsSize;
  activation?: "auto" | "manual";
  panels?: Partial<Record<T, string>>;
}) {
  const [v, setV] = useState<T>(items[0].id);
  return (
    <Tabs label={label} items={items} value={v} onChange={setV} size={size} activation={activation} panels={panels} />
  );
}

const WITH_ICON: readonly TabItem<string>[] = [{ ...THREE_TABS[0], icon: LayoutGrid }, THREE_TABS[1], THREE_TABS[2]];

export function TabsAnatomy() {
  return (
    <Spec
      title="Anatomy"
      source={SOURCE}
      props="items size"
      role="The indicator is as wide as the label it sits under, so the selected word and its mark read as one."
      caption="md · icon, count and a rest tab · the indicator slides on spring 500 / 40"
      drawer={{ values: TAB_VALUES, props: TAB_PROPS, code: TAB_CODE }}
    >
      <Anatomy pins={TAB_PINS} layout="stack" label="Tabs anatomy">
        <div data-pin="tabs" className={styles["ds-wide-box"]}>
          <LiveTabs label="Tabs anatomy" items={WITH_ICON} />
        </div>
      </Anatomy>
    </Spec>
  );
}

export function TabsSizes() {
  return (
    <Spec
      title="Sizes"
      source={SOURCE}
      props="size"
      role="lg sets its labels in Outfit, as the site's titles are, for tabs that head a page rather than a card."
      caption="sm 36 · 13 Inter · md 44 · 15 Inter · lg 52 · 18 Outfit at -0.01em"
    >
      <Canvas ground="surface" layout="stack" label="Tab sizes">
        {TAB_SIZES.map((s) => (
          <Item key={s.name} label={`${s.name} · ${s.px}`} align="start">
            <div className={styles["ds-wide-box"]}>
              <LiveTabs label={`Tab sizes, ${s.name}`} items={THREE_TABS} size={s.name} />
            </div>
          </Item>
        ))}
      </Canvas>
      <SizeLadder
        label="Tab heights"
        ground="surface"
        sizes={TAB_SIZES.map((s) => ({
          name: s.name,
          spec: s.px,
          select: "[role=tab]",
          node: <LiveTabs label={`Tab heights, ${s.name}`} items={TWO_TABS} size={s.name} />,
        }))}
      />
    </Spec>
  );
}

export function TabsStates() {
  return (
    <Spec
      title="States"
      source={SOURCE}
      props="forceState forceOn"
      role="Each state shows on the Activity tab, and selected is the one with ink at 500 and the navy line."
      caption="sm · focus-visible rides the selected tab, the one tab stop"
    >
      <StateGrid
        label="Tab states"
        ground="surface"
        states={TAB_STATES}
        minCell={170}
        render={({ state, force }) => {
          if (state === "live") return <LiveTabs label="Tab states, live" items={TWO_TABS} size="sm" />;
          const items: readonly TabItem<string>[] =
            force === "disabled" ? [TWO_TABS[0], { ...TWO_TABS[1], disabled: true }] : TWO_TABS;
          return (
            <Tabs
              label="State specimen"
              items={items}
              value={force === "selected" ? "activity" : "overview"}
              onChange={() => {}}
              size="sm"
              forceState={force === "selected" || force === "disabled" ? undefined : (force as ForceState | undefined)}
            />
          );
        }}
      />
    </Spec>
  );
}

export function TabsPhone() {
  return (
    <Spec
      title="In a phone-wide box"
      source={SOURCE}
      role="Past the box's width the list scrolls on its own, and the chosen tab scrolls into view, so the page never moves sideways."
      caption="375 box · seven tabs · choose Settings, or arrow along with the keyboard"
    >
      <Canvas ground="page" label="Tabs in a phone-wide box" isolateKeys>
        <div className={styles["ds-phone-box"]}>
          <LiveTabs label="Tabs in a phone-wide box" items={MANY_TABS} />
        </div>
      </Canvas>
    </Spec>
  );
}

const ACTIVATION = [
  { value: "auto" as const, label: "Arrows choose" },
  { value: "manual" as const, label: "Enter chooses" },
];

export function TabsLive() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  return (
    <Spec
      title="With panels"
      source={SOURCE}
      props="panels activation"
      role="Panels cross-fade in place under a fixed list, so switching never moves the tabs the pointer is on."
      caption="tablist, tab and tabpanel · aria-controls on the chosen tab · Tab moves into the panel"
    >
      <Canvas ground="surface" layout="stack" label="Tabs with panels" isolateKeys>
        <KitSeg label="Activation" options={ACTIVATION} value={mode} onChange={setMode} />
        <div className={styles["ds-wide-box"]}>
          <LiveTabs key={mode} label="Tabs with panels" items={THREE_TABS} activation={mode} panels={PANEL_COPY} />
        </div>
      </Canvas>
    </Spec>
  );
}

const SENTENCES: readonly TabItem<string>[] = [
  { id: "a", label: "Everything the model learned" },
  { id: "b", label: "How it tests your game" },
];

export function TabsDecisions() {
  return (
    <>
      <DoDont>
        <Do ground="surface" reason="The indicator is navy, the selected colour, so the accent keeps meaning attention.">
          <LiveTabs label="A navy indicator, the Do" items={THREE_TABS} size="sm" />
        </Do>
        <Dont ground="surface" reason="An accent line marks a resting state as urgent and spends the blue the players section owns.">
          <div className={styles["ds-dont-accent-line"]}>
            <LiveTabs label="An accent line, the Don't" items={THREE_TABS} size="sm" />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do ground="surface" reason="One or two words per tab, so the whole list scans in a glance.">
          <LiveTabs label="One or two words, the Do" items={TWO_TABS} size="sm" />
        </Do>
        <Dont ground="surface" reason="Sentences as tabs push the list into a scroll on every phone, and nobody reads them as places.">
          <div className="max-w-[260px]">
            <LiveTabs label="Sentences as tabs, the Don't" items={SENTENCES} size="sm" />
          </div>
        </Dont>
      </DoDont>
    </>
  );
}
