// Rows built from ScrubLine's own exports (COMPLETE_AT, WAVE_VH), so the guide prints what the line really
// runs on. ScrubLine is a client module, and on the server its exports are references rather than numbers,
// so this file is imported only by client leaves (scroll-line-live.tsx, accent-water-live.tsx).
import type { KeyRow } from "@/app/design-system/_kit/KeyRows";
import type { ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { COMPLETE_AT, WAVE_VH } from "@/components/website/ScrubLine";

export const SCRUB_FILL_ROWS: readonly KeyRow[] = [
  { key: "track", value: "390vh, its stage sticky for one screen, centred, px 24", source: "ScrubLine.tsx:105-113" },
  { key: "fill", value: `floor(min(1, p / ${COMPLETE_AT}) x 32) words lit, p the track's progress less ${1 + WAVE_VH} screens`, source: "ScrubLine.tsx:70-79" },
  { key: "COMPLETE_AT", value: `${COMPLETE_AT}: the whole line is lit from ${COMPLETE_AT * 100}% of the scroll and holds`, source: "ScrubLine.tsx:17" },
  { key: "BACK", value: "3: scrolling up empties three times as fast, and refills at that pace until it catches the scroll", source: "ScrubLine.tsx:20,84" },
  { key: "WAVE_VH", value: `${WAVE_VH}: the stage stays pinned that many screens longer while the water rises over it`, source: "ScrubLine.tsx:23" },
  { key: "words", value: "32 spans: unlit ink at 15%, lit ink, 'a million models' lit in the accent, 200ms colour", source: "ScrubLine.tsx:124-140" },
  { key: "after", value: "once the track has run out the stage is visibility hidden, under the water", source: "ScrubLine.tsx:64-68" },
  { key: "reduced motion", value: "the line shows filled", source: "ScrubLine.tsx:69" },
];

export const WATER_RISE_ROW: ValueRow = {
  part: "Rise",
  value: `over the last ${WAVE_VH} screens (WAVE_VH) of the line's track, smoothstep eased`,
  source: "AccentWave.tsx:87-91,169",
};
