"use client";

// The system Segmented: three grounds at three sizes, its anatomy, a state grid per ground, the size
// ladder and the decision against Tabs. Every live specimen holds its own choice.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { contrastRatio } from "@/app/design-system/_kit/contrast";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import type { ForceState } from "@/components/design-system/force";
import { Segmented, type SegmentedOption } from "@/components/design-system/Segmented";
import { SEG_GROUND, type SegmentedGround, type SegmentedSize } from "@/components/design-system/segmented-styles";
import { Tabs } from "@/components/design-system/Tabs";
import {
  SEG_CODE,
  SEG_GROUNDS,
  SEG_PINS,
  SEG_PROPS,
  SEG_SIZES,
  SEG_STATES,
  SEG_VALUES,
  THREE,
  TWO,
  TWO_OFF,
} from "./segmented-data";
import { WATER, blend, restColour, restToken } from "./contrast-pairs";
import { tokenColour } from "./display-values";

const SOURCE = { from: "@/components/design-system/Segmented", name: "Segmented" };

const UNDER: Record<SegmentedGround, string> = {
  light: tokenColour("color-page"),
  container: tokenColour("color-container"),
  blue: WATER,
};

/** Each ground's rest label on its own track over the ground, read from SEG_GROUND. */
const REST = Object.fromEntries(
  SEG_GROUNDS.map(({ ground }) => {
    const fg = restColour(SEG_GROUND[ground].rest, "text");
    const bg = blend(restColour(SEG_GROUND[ground].track, "bg"), UNDER[ground]);
    return [ground, { fg, bg, miss: (contrastRatio(fg, bg) ?? 0) < 4.5 }];
  }),
) as Record<SegmentedGround, { fg: string; bg: string; miss: boolean }>;
const MISSES = SEG_GROUNDS.filter(({ ground }) => REST[ground].miss).map(({ ground }) => ground);

const NAVY_ON_GREY = restToken(SEG_GROUND.container.thumb, "bg") === "color-primary";
const GROUNDS_ROLE = NAVY_ON_GREY
  ? "One control on three grounds: a navy thumb on white and on grey, a white thumb on the blue, its brightest thing."
  : "One control on three grounds: navy thumb on white, white thumb on the grey and on the blue, where white is the brightest thing.";

type LiveProps = {
  /** the group's accessible name, from the spec it sits in */
  label: string;
  options: readonly SegmentedOption<string>[];
  ground?: SegmentedGround;
  size?: SegmentedSize;
  equal?: boolean;
};

/** A Segmented that keeps its own choice, for the live specimens. */
export function LiveSeg({ label, options, ground, size, equal }: LiveProps) {
  const [v, setV] = useState(options[0].id);
  return (
    <Segmented
      label={label}
      options={options}
      value={v}
      onChange={setV}
      ground={ground}
      size={size}
      equal={equal}
    />
  );
}

export function SegmentedGrounds() {
  return (
    <Spec
      level={4}
      title="Grounds and sizes"
      source={SOURCE}
      props="ground size equal"
      role={GROUNDS_ROLE}
      caption={`${SEG_SIZES.map((s) => `${s.name} ${s.px}`).join(" · ")} per segment · two and three options · equal on the three · each ground grades its rest label`}
      drawer={{ values: SEG_VALUES, props: SEG_PROPS, code: SEG_CODE }}
      note={
        MISSES.length
          ? `The rest label misses AA on the ${MISSES.join(" and the ")} ground, as its badge reads, a system miss the control still carries.`
          : undefined
      }
    >
      {SEG_GROUNDS.map(({ ground, canvas }) => (
        <Canvas key={ground} ground={canvas} label={`Segmented on the ${ground} ground`}>
          {SEG_SIZES.map((s) => (
            <Item key={s.name} label={`${ground} · ${s.name}`}>
              <div className="grid justify-items-center gap-3">
                <LiveSeg label={`Grounds and sizes, ${ground} ${s.name}, two options`} options={TWO} ground={ground} size={s.name} />
                <LiveSeg label={`Grounds and sizes, ${ground} ${s.name}, three options`} options={THREE} ground={ground} size={s.name} equal />
              </div>
            </Item>
          ))}
          <Item label={`rest label on the ${ground} track`}>
            <ContrastBadge fg={REST[ground].fg} bg={REST[ground].bg} bgName={`the ${ground} track`} />
          </Item>
        </Canvas>
      ))}
    </Spec>
  );
}

export function SegmentedAnatomy() {
  return (
    <Spec
      level={4}
      title="Anatomy"
      source={SOURCE}
      role="The thumb is one element that travels between segments, so the eye follows the choice instead of hunting for it."
      caption="Tab reaches the chosen segment · Left and Right move the choice · Home and End jump to the ends"
    >
      <Anatomy pins={SEG_PINS} label="Segmented anatomy">
        <span data-pin="seg">
          <LiveSeg label="Segmented anatomy" options={THREE} />
        </span>
      </Anatomy>
    </Spec>
  );
}

function cell(ground: SegmentedGround, force?: string) {
  const off = force === "disabled-segment";
  return (
    <Segmented
      label="State specimen"
      options={off ? TWO_OFF : TWO}
      value={force === "selected" ? "ai" : "human"}
      onChange={() => {}}
      ground={ground}
      size="sm"
      forceState={off || force === "selected" ? undefined : (force as ForceState | undefined)}
    />
  );
}

export function SegmentedStates() {
  return (
    <Spec
      level={4}
      title="States"
      source={SOURCE}
      props="forceState forceOn disabled"
      role="Each state shows on the AI segment, so the row reads as one control changing rather than seven controls."
      caption="sm · focus-visible rides the chosen segment, the one tab stop"
    >
      {SEG_GROUNDS.map(({ ground, canvas }) => (
        <StateGrid
          key={ground}
          label={`Segmented states, ${ground}`}
          ground={canvas}
          states={SEG_STATES}
          variants={[ground] as const}
          minCell={150}
          render={({ variant, state, force }) =>
            state === "live" ? <LiveSeg label={`States, ${variant}, live`} options={TWO} ground={variant} size="sm" /> : cell(variant, force)
          }
        />
      ))}
    </Spec>
  );
}

export function SegmentedSizes() {
  return (
    <Spec
      level={4}
      title="Sizes"
      source={SOURCE}
      props="size"
      role="The size names the segment, and the control lines up by its track: sm 40 with a md Button, md 44 with a md field, lg 48 with a lg Button."
      caption="each rung measures the track, the segment 8 shorter inside it"
    >
      <SizeLadder
        label="Segmented sizes"
        sizes={SEG_SIZES.map((s) => ({
          name: s.name,
          spec: s.track,
          select: "[role=radiogroup]",
          node: <LiveSeg label={`Sizes, ${s.name}`} options={TWO} size={s.name} />,
        }))}
      />
    </Spec>
  );
}

function LiveTabs() {
  const [v, setV] = useState(THREE[0].id);
  return <Tabs label="Tabs over panels, the Do" items={THREE} value={v} onChange={setV} size="sm" />;
}

const LONG: readonly SegmentedOption<string>[] = [
  { id: "a", label: "Intelligence reports" },
  { id: "b", label: "Playtesting sessions" },
  { id: "c", label: "Game creation tools" },
  { id: "d", label: "Player models" },
  { id: "e", label: "Settings" },
];

export function SegmentedDecisions() {
  return (
    <>
      <DoDont>
        <Do reason="Two to four short, equal options fit one pill, so every choice is in view at once.">
          <LiveSeg label="Short options, the Do" options={THREE} />
        </Do>
        <Dont reason="Five long options outgrow the pill on a phone, and a control that scrolls hides the choices it exists to show.">
          <div className="max-w-full overflow-hidden">
            <LiveSeg label="Long options, the Don't" options={LONG} size="sm" />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Switching whole panels is Tabs: the line scrolls, and each tab names the panel it controls.">
          <LiveTabs />
        </Do>
        <Dont reason="A segmented switch over panels leaves screen readers with a radio group and no panel to land in.">
          <LiveSeg label="Segmented over panels, the Don't" options={THREE} size="sm" />
        </Dont>
      </DoDont>
    </>
  );
}
