"use client";

// Control heights: every height a control stands (CONTROL_HEIGHTS, read from each family's own size map)
// as a ladder of the real parts that reach it, side by side on one hairline and each measured, so a size
// that stops reaching its height prints red. The copy is the site's own (the CTA, the jobs, the players).
// A client leaf because Segmented and Tabs take onChange.
import { ArrowUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import { SizeLadder, type LadderRung } from "@/app/design-system/_kit/SizeLadder";
import { BUTTON_SIZE } from "@/components/design-system/button-styles";
import { Button } from "@/components/design-system/Button";
import { CHIP_SIZE } from "@/components/design-system/chip-styles";
import { Chip } from "@/components/design-system/Chip";
import { CONTROL_HEIGHTS } from "@/components/design-system/control-heights";
import { FIELD_SIZE } from "@/components/design-system/field-styles";
import { ICON_BUTTON_SIZE } from "@/components/design-system/icon-button-styles";
import { IconButton } from "@/components/design-system/IconButton";
import { SEARCH_SIZE } from "@/components/design-system/search-styles";
import { SearchField } from "@/components/design-system/SearchField";
import { SEG_SIZE } from "@/components/design-system/segmented-styles";
import { Segmented } from "@/components/design-system/Segmented";
import { Select } from "@/components/design-system/Select";
import { TAB_SIZE } from "@/components/design-system/tabs-styles";
import { Tabs } from "@/components/design-system/Tabs";
import { TextInput } from "@/components/design-system/TextInput";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import s from "./spacing.module.css";

/** A size name of one family's map, or a data mistake worth failing on. */
function key<K extends string>(map: Readonly<Record<K, unknown>>, size: string): K {
  if (!(size in map)) throw new Error(`design-system control heights: no size ${size}`);
  return size as K;
}

const MODES = [
  { id: "human", label: "Human" },
  { id: "ai", label: "AI" },
] as const;
type Mode = (typeof MODES)[number]["id"];
const TABS = JOBS.map((j) => ({ id: j.id, label: j.title }));
const PLAYER_OPTIONS = PLAYERS.map((p) => ({ value: p.id, label: p.title }));
const BOX = "[data-slot='box']";

function Modes({ size }: { size: keyof typeof SEG_SIZE }) {
  const [v, setV] = useState<Mode>("human");
  return <Segmented options={MODES} value={v} onChange={setV} label="Show the human or their AI copy" size={size} />;
}

function JobTabs({ size }: { size: keyof typeof TAB_SIZE }) {
  const [v, setV] = useState(TABS[0].id);
  return <Tabs items={TABS} value={v} onChange={setV} label="The three jobs" size={size} />;
}

const field = (node: ReactNode) => <div className={s["ds-ctl-field"]}>{node}</div>;

/** Each family's rungs at one size: the part, and what to measure when it is not the first element. */
const RUNGS: Record<string, (size: string) => readonly Omit<LadderRung, "spec">[]> = {
  Button: (z) => [{ name: `Button ${z}`, node: <Button size={key(BUTTON_SIZE, z)}>Try now</Button> }],
  IconButton: (z) => [
    { name: `IconButton ${z}`, node: <IconButton icon={ArrowUp} label="Back to top" variant="outline" size={key(ICON_BUTTON_SIZE, z)} /> },
  ],
  SearchField: (z) => [
    { name: `SearchField ${z}`, select: BOX, node: field(<SearchField label="Search the questions" placeholder="Search the questions" size={key(SEARCH_SIZE, z)} />) },
  ],
  Chip: (z) => [{ name: `Chip ${z}`, node: <Chip size={key(CHIP_SIZE, z)}>Behavioral</Chip> }],
  Segmented: (z) => [{ name: `Segmented ${z}`, node: <Modes size={key(SEG_SIZE, z)} /> }],
  "TextInput and Select": (z) => [
    { name: `TextInput ${z}`, select: BOX, node: field(<TextInput label="Work email" hideLabel placeholder="you@studio.com" size={key(FIELD_SIZE, z)} />) },
    { name: `Select ${z}`, select: BOX, node: field(<Select label="Player type" hideLabel options={PLAYER_OPTIONS} native="never" size={key(FIELD_SIZE, z)} />) },
  ],
  Tabs: (z) => [{ name: `Tabs ${z}`, select: "[role='tab']", node: <JobTabs size={key(TAB_SIZE, z)} /> }],
};

function rungsOf(part: string, px: number): LadderRung[] {
  const at = part.lastIndexOf(" ");
  const render = RUNGS[part.slice(0, at)];
  if (!render) throw new Error(`design-system control heights: no specimen for ${part}`);
  return render(part.slice(at + 1)).map((r) => ({ ...r, spec: px }));
}

/** One ladder per height, the parts that reach it standing on its hairline. */
export function ControlLadders() {
  return CONTROL_HEIGHTS.map(({ px, parts }) => (
    <SizeLadder key={px} label={`${px}px controls`} sizes={parts.flatMap((p) => rungsOf(p, px))} />
  ));
}
