// Chip's class maps, written out in full for Tailwind's scanner, beside Chip.tsx. Hover and press carry
// data-[force=*] twins, and so does a selected chip's hover, so a forced cell matches a real one.
export type ChipKind = "filter" | "choice" | "input";
export type ChipSize = "sm" | "md" | "lg";
export type ChipGround = "light" | "onBlue";

/** 28 / 32 / 36 tall. control-heights.ts reads this map. */
export const CHIP_SIZE: Record<ChipSize, string> = { sm: "h-7", md: "h-8", lg: "h-9" };

export const CHIP_BASE =
  "group inline-flex shrink-0 select-none items-center whitespace-nowrap rounded-full border font-sans " +
  "text-[13px] font-medium transition-[color,background-color,border-color,scale] duration-(--ds-dur-ui) " +
  "ease-(--ds-ease-out) disabled:cursor-not-allowed disabled:opacity-40 data-[disabled]:opacity-40";

/** The press settles to scale-press-pill (SCALE.pressPill, 0.97), on a live chip only, at once under reduced motion. */
export const CHIP_PRESS = "active:scale-(--ds-scale-press-pill) data-[force=pressed]:scale-(--ds-scale-press-pill) motion-reduce:transition-none";

export const CHIP_GROUND: Record<ChipGround, { rest: string; hover: string; remove: string }> = {
  light: {
    rest:
      "border-(--ds-color-line) bg-(--ds-color-surface) text-(--ds-color-text-body) " +
      "data-selected:border-(--ds-color-primary) data-selected:bg-(--ds-color-primary) data-selected:text-white",
    hover:
      "hover:border-(--ds-color-line-strong) hover:text-(--ds-color-ink) " +
      "data-[force=hover]:border-(--ds-color-line-strong) data-[force=hover]:text-(--ds-color-ink) " +
      "data-[force=pressed]:border-(--ds-color-line-strong) data-[force=pressed]:text-(--ds-color-ink) " +
      // selected keeps its white label under the pointer and moves its navy to the primary hover
      "data-selected:hover:text-white data-selected:data-[force=hover]:text-white data-selected:data-[force=pressed]:text-white " +
      "data-selected:hover:border-(--ds-color-primary-hover) data-selected:hover:bg-(--ds-color-primary-hover) " +
      "data-selected:data-[force=hover]:border-(--ds-color-primary-hover) data-selected:data-[force=hover]:bg-(--ds-color-primary-hover) " +
      "data-selected:data-[force=pressed]:border-(--ds-color-primary-hover) data-selected:data-[force=pressed]:bg-(--ds-color-primary-hover)",
    remove: "enabled:hover:bg-(--ds-color-fill-open) group-data-[force=remove-hover]:bg-(--ds-color-fill-open)",
  },
  onBlue: {
    rest:
      "border-(--ds-color-on-blue-40) bg-transparent text-white " +
      "data-selected:border-transparent data-selected:bg-(--ds-color-surface) data-selected:text-(--ds-color-ink)",
    hover:
      "hover:bg-(--ds-color-on-blue-15) data-[force=hover]:bg-(--ds-color-on-blue-15) " +
      "data-[force=pressed]:bg-(--ds-color-on-blue-15) data-selected:hover:bg-(--ds-color-surface-90) " +
      "data-selected:data-[force=hover]:bg-(--ds-color-surface-90) data-selected:data-[force=pressed]:bg-(--ds-color-surface-90)",
    remove: "enabled:hover:bg-(--ds-color-on-blue-25) group-data-[force=remove-hover]:bg-(--ds-color-on-blue-25)",
  },
};

export const CHIP_REMOVE =
  "relative ml-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-(--ds-dur-ui) " +
  "disabled:cursor-not-allowed";
