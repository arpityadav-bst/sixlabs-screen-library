// Segmented's class maps, written out in full for Tailwind's scanner. Hover and press carry data-[force=*]
// twins, so a forced StateGrid cell matches a real one. The light ground is the Jobs switch given a sliding
// thumb (Jobs.tsx:118), the container ground takes the same navy thumb on its grey, and the blue ground is
// ModeToggle's white thumb (ModeToggle.tsx:29 and :43) with its labels set on the blue itself in white, with
// no glass fill under them, so they keep 4.49:1. In forced colours the selected thumb fills Highlight.
export type SegmentedSize = "sm" | "md" | "lg";
export type SegmentedGround = "light" | "container" | "blue";

/** The segment's height: 32 / 36 / 40, labels 13 / 14 / 15 at 500, 14px each side. The control stands 8
 *  taller in its track (40 / 44 / 48), which is the height it lines up by (control-heights.ts). */
export const SEG_SIZE: Record<SegmentedSize, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-9 px-3.5 text-[14px]",
  lg: "h-10 px-3.5 text-[15px]",
};

/** The track: a pill with a 1px line and the rest of the 4px track inset (space-1) inside it, so the
 *  segments sit 4px in. A border, not a ring, so forced colours keep the outline. */
export const SEG_TRACK = "rounded-full border p-[calc(var(--ds-space-1)_-_var(--ds-stroke-hairline))]";

const THUMB_NAVY = "bg-(--ds-color-primary) shadow-(--ds-shadow-thumb)";
const FORCED_THUMB = "forced-colors:forced-color-adjust-none forced-colors:bg-[color:Highlight]";
const FORCED_ON = "forced-colors:forced-color-adjust-none forced-colors:text-[color:HighlightText]";

export const SEG_GROUND: Record<SegmentedGround, { track: string; rest: string; on: string; thumb: string }> = {
  light: {
    track: "bg-(--ds-color-surface) border-(--ds-color-line)",
    rest:
      "text-(--ds-color-text-muted) enabled:hover:text-(--ds-color-ink) " +
      "data-[force=hover]:text-(--ds-color-ink) data-[force=pressed]:text-(--ds-color-ink)",
    on: `text-white ${FORCED_ON}`,
    thumb: `${THUMB_NAVY} ${FORCED_THUMB}`,
  },
  container: {
    track: "bg-(--ds-color-surface-70) border-transparent",
    rest:
      "text-(--ds-color-text-body) enabled:hover:text-(--ds-color-ink) " +
      "data-[force=hover]:text-(--ds-color-ink) data-[force=pressed]:text-(--ds-color-ink)",
    on: `text-white ${FORCED_ON}`,
    thumb: `${THUMB_NAVY} ${FORCED_THUMB}`,
  },
  blue: {
    track: "bg-transparent border-(--ds-color-on-blue-40)",
    rest:
      "text-white enabled:hover:bg-(--ds-color-on-blue-15) " +
      "data-[force=hover]:bg-(--ds-color-on-blue-15) data-[force=pressed]:bg-(--ds-color-on-blue-15)",
    on: `text-(--ds-color-ink) ${FORCED_ON}`,
    thumb: `bg-(--ds-color-surface) shadow-(--ds-shadow-thumb) ${FORCED_THUMB}`,
  },
};

/** One segment. The press settles to scale-press-pill (SCALE.pressPill, 0.97), as Try now's does, at once when reduced. */
export const SEG_OPTION =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-sans " +
  "font-medium transition-[color,background-color,scale] duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "enabled:active:scale-(--ds-scale-press-pill) data-[force=pressed]:scale-(--ds-scale-press-pill) motion-reduce:transition-none";
