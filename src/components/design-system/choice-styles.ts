// Class maps for Checkbox, Radio and Switch, written out in full for Tailwind's scanner. Each control is a
// label (group/choice) holding a native input or button and a drawn mark. Hover lives on the whole label,
// so the text is part of the target. Checked fills are navy, never the accent. Every pseudo-class has a
// group-data-[force=...] twin keyed on the label's data-force, for the StateGrid.

export type ChoiceSize = "sm" | "md" | "lg";

/** The row: label 14/20 at 10px from the mark, 24 tall at least, 32 under a coarse pointer. */
export const CHOICE_ROW =
  "group/choice relative inline-flex min-h-6 items-start gap-2.5 font-sans select-none pointer-coarse:min-h-8 " +
  "cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-40 data-readonly:cursor-default";

/** Centres the mark on the first line of a 20px label. */
export const CHOICE_SLOT = "relative grid h-5 shrink-0 place-items-center pointer-coarse:h-8";

export const CHOICE_TEXT = "flex min-w-0 flex-col pt-px pointer-coarse:pt-1.5";
export const CHOICE_LABEL = "text-[14px] leading-5 text-(--ds-color-ink)";
export const CHOICE_DESC = "text-[13px] leading-[18px] text-(--ds-color-text-muted)";

/** Box 16 / 18 / 20 at radius-mark-sm, -sm and radius-mark (4 / 4 / 6), circle at the same sizes, tick 12 /
 *  12 / 14 (the icon ladder's floor is 12), dot 6 / 8 / 9. */
export const CHOICE_SIZE: Record<ChoiceSize, { box: string; circle: string; tick: number; dot: string }> = {
  sm: { box: "h-4 w-4 rounded-(--ds-radius-mark-sm)", circle: "h-4 w-4", tick: 12, dot: "h-1.5 w-1.5" },
  md: { box: "h-[18px] w-[18px] rounded-(--ds-radius-mark-sm)", circle: "h-[18px] w-[18px]", tick: 12, dot: "h-2 w-2" },
  lg: { box: "h-5 w-5 rounded-(--ds-radius-mark)", circle: "h-5 w-5", tick: 14, dot: "h-[9px] w-[9px]" },
};

/** The ring on the mark when its input has keyboard focus. */
export const MARK_FOCUS =
  "outline-offset-(--ds-focus-offset) peer-focus-visible:outline-(length:--ds-focus-width) peer-focus-visible:outline-solid peer-focus-visible:outline-(--ds-focus-color) " +
  "group-data-[force=focus]/choice:outline-(length:--ds-focus-width) group-data-[force=focus]/choice:outline-solid " +
  "group-data-[force=focus]/choice:outline-(--ds-focus-color) forced-colors:peer-focus-visible:outline-[Highlight]";

export const MARK_BASE =
  "relative grid place-items-center border-[1.5px] transition-[background-color,border-color,color,scale] " +
  "duration-(--ds-dur-ui) ease-(--ds-ease-out)";

/** Press settles the mark to scale-press-mark (SCALE.pressMark, 0.92). Only live controls carry it. */
export const MARK_PRESS =
  "group-active/choice:scale-(--ds-scale-press-mark) group-data-[force=pressed]/choice:scale-(--ds-scale-press-mark)";

export type MarkTone = "off" | "on" | "invalid" | "readOnlyOff" | "readOnlyOn";

/** The mark's line and fill in each tone at rest. */
export const MARK_TONE: Record<MarkTone, string> = {
  off: "border-(--ds-color-line-field) bg-(--ds-color-surface)",
  on: "border-(--ds-color-primary) bg-(--ds-color-primary) text-white",
  invalid: "border-(--ds-color-danger) bg-(--ds-color-surface)",
  // read-only says so through the sunken fill and aria-readonly, never by washing the mark out: the line
  // keeps the field line's 3.26:1 and a checked fill is the muted text's 4.75:1
  readOnlyOff: "border-(--ds-color-line-field) bg-(--ds-color-surface-sunken)",
  readOnlyOn: "border-(--ds-color-text-muted) bg-(--ds-color-text-muted) text-white",
};

/** Hover on a live mark: the line darkens and the box takes the slate-50 fill, a checked box moves to the
 *  primary hover navy. A forced press shows the hover too, as a real press does. */
export const MARK_HOVER: Partial<Record<MarkTone, string>> = {
  off:
    "group-hover/choice:border-(--ds-color-text-muted) group-hover/choice:bg-(--ds-color-fill-hover) " +
    "group-data-[force=hover]/choice:border-(--ds-color-text-muted) group-data-[force=hover]/choice:bg-(--ds-color-fill-hover) " +
    "group-data-[force=pressed]/choice:border-(--ds-color-text-muted) group-data-[force=pressed]/choice:bg-(--ds-color-fill-hover)",
  on:
    "group-hover/choice:border-(--ds-color-primary-hover) group-hover/choice:bg-(--ds-color-primary-hover) " +
    "group-data-[force=hover]/choice:border-(--ds-color-primary-hover) group-data-[force=hover]/choice:bg-(--ds-color-primary-hover) " +
    "group-data-[force=pressed]/choice:border-(--ds-color-primary-hover) group-data-[force=pressed]/choice:bg-(--ds-color-primary-hover)",
  invalid:
    "group-hover/choice:bg-(--ds-color-fill-hover) group-data-[force=hover]/choice:bg-(--ds-color-fill-hover) " +
    "group-data-[force=pressed]/choice:bg-(--ds-color-fill-hover)",
};

/** The radio circle: checked keeps a white centre and turns the line navy, the dot carries the state. */
export const RADIO_TONE: Record<MarkTone, string> = {
  ...MARK_TONE,
  on: "border-(--ds-color-primary) bg-(--ds-color-surface) text-(--ds-color-primary)",
  readOnlyOn: "border-(--ds-color-text-muted) bg-(--ds-color-surface-sunken) text-(--ds-color-text-muted)",
};

export const RADIO_HOVER: Partial<Record<MarkTone, string>> = {
  ...MARK_HOVER,
  on:
    "group-hover/choice:border-(--ds-color-primary-hover) group-hover/choice:text-(--ds-color-primary-hover) " +
    "group-data-[force=hover]/choice:border-(--ds-color-primary-hover) group-data-[force=hover]/choice:text-(--ds-color-primary-hover) " +
    "group-data-[force=pressed]/choice:border-(--ds-color-primary-hover) group-data-[force=pressed]/choice:text-(--ds-color-primary-hover)",
};

export function markTone(o: { on: boolean; invalid?: boolean; readOnly?: boolean }): MarkTone {
  if (o.readOnly) return o.on ? "readOnlyOn" : "readOnlyOff";
  if (o.on) return "on";
  return o.invalid ? "invalid" : "off";
}

/** The visually hidden native input, laid over the mark so a screen reader's box lands on it. */
export const NATIVE_INPUT = "peer absolute inset-0 m-0 h-full w-full cursor-[inherit] opacity-0";

/** The thumb's lift: 0 1px 3px in the ink at 25%. */
export const THUMB_SHADOW = "shadow-[0_1px_3px_color-mix(in_srgb,var(--ds-color-ink)_25%,transparent)]";
