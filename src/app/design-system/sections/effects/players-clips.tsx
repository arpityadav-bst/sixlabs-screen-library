"use client";

// The players the sweep and the doodles specimens can show (the ones with a human and an AI clip), and the
// portrait as the homepage plays it in this browser: PortraitSwap on the format useClipFormat picks
// (Players.tsx:162-170), the see-through WebM in Chrome, the stacked MP4s on the GPU in Safari or where the
// browser decodes them itself, the stills where WebGL is missing. It mounts inside a HeavySlot, which claims a
// WebGL unit only for the stacked format and is keyed on the format, so a late answer from the check claims
// again.
import { HeavySlot } from "@/app/design-system/_kit/HeavySlot";
import type { Mode } from "@/components/website/ModeToggle";
import { PortraitSwap } from "@/components/website/PortraitSwap";
import { PLAYERS, type Clip, type Player } from "@/components/website/players-data";
import type { ClipFormat } from "@/components/website/useClipFormat";

export type ClipPlayer = Player & { video: Clip; aiVideo: Clip };

export const hasClips = (p: Player): p is ClipPlayer => !!p.video && !!p.aiVideo;

/** the players with both clips, in the site's order */
export const WITH_CLIPS: readonly ClipPlayer[] = PLAYERS.filter(hasClips);

/** the player picker's options */
export const CLIP_PICKS = WITH_CLIPS.map((p) => ({ value: p.id, label: p.title }));

/** the player for an id, the first one when it has none */
export const clipPlayer = (id: string): ClipPlayer => WITH_CLIPS.find((p) => p.id === id) ?? WITH_CLIPS[0];

/** The portrait in a format (pass useClipFormat's for this browser's), 480 tall, at the frame's 810 by 1080. */
export function ClipPortrait({ player, mode, format }: { player: ClipPlayer; mode: Mode; format: ClipFormat }) {
  return (
    <HeavySlot
      key={format}
      cost={{ gl: format === "stacked" ? 1 : 0 }}
      label={`The ${format} portrait`}
      height={480}
      style={{ width: 360 }}
    >
      <PortraitSwap
        human={player.video}
        ai={player.aiVideo}
        mode={mode}
        label={player.title}
        format={format}
        className="h-[480px] w-auto"
      />
    </HeavySlot>
  );
}
