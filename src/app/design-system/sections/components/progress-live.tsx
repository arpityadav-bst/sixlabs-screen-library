"use client";

// The progress specimens that hold state: the shipped trait bars sliding as a Segmented on the blue
// picks another player, and the system bar and circle easing between 0, 35 and 100 (a kit switch).
import { useState } from "react";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { Progress } from "@/components/design-system/Progress";
import { ProgressCircle } from "@/components/design-system/ProgressCircle";
import { Segmented } from "@/components/design-system/Segmented";
import { PlayerTraits } from "@/components/website/PlayerTraits";
import { PLAYERS } from "@/components/website/players-data";

type PlayerId = (typeof PLAYERS)[number]["id"];
const OPTIONS = PLAYERS.map((p) => ({ id: p.id as PlayerId, label: p.title }));

export function TraitsDemo() {
  const [id, setId] = useState<PlayerId>(PLAYERS[0].id);
  const player = PLAYERS.find((p) => p.id === id) ?? PLAYERS[0];
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="max-w-full overflow-x-auto">
        <Segmented label="Player" options={OPTIONS} value={id} onChange={setId} ground="blue" />
      </div>
      <div className="ds-a-traits grid gap-10 md:grid-cols-2">
        <PlayerTraits traits={player.traits} />
        <PlayerTraits traits={player.traits} dense />
      </div>
    </div>
  );
}

const STEPS = [
  { value: 0, label: "0" },
  { value: 35, label: "35" },
  { value: 100, label: "100" },
] as const;

export function ProgressDemo() {
  const [v, setV] = useState<0 | 35 | 100>(35);
  return (
    <div className="ds-a-progress flex w-full flex-col items-start gap-6">
      <KitSeg label="Value" options={STEPS} value={v} onChange={setV} />
      <div className="flex w-full items-center gap-8">
        <div className="min-w-0 flex-1">
          <Progress label="Building the model" value={v} showLabel showValue />
        </div>
        <ProgressCircle label="Building the model" value={v} size={40} showValue />
      </div>
    </div>
  );
}
