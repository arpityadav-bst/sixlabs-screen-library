// The box every text control shares (TextInput, TextArea, the Select trigger): white, a 1px field line
// that reaches 3:1 on white, navy type and an accent caret. Focus swaps the line for the accent and adds
// the 3px halo in place of an outline. An invalid box keeps its danger line and halo under focus and adds
// the 2px accent outline, since the halo alone barely changes it. Hover darkens the line only while the box
// is not focused, so the focus look never flickers under the pointer. Every pseudo-class has its data-[force=...] twin for the
// StateGrid. Class strings are written out in full for Tailwind's scanner.

export type FieldSize = "sm" | "md" | "lg";

/** sm 36 / md 44 / lg 52 tall. Text 14 / 15 / 16, and 16 under md so iOS never zooms on focus. */
export const FIELD_SIZE: Record<
  FieldSize,
  { h: string; text: string; pad: string; radius: string; icon: 16 | 18; area: string }
> = {
  sm: {
    h: "h-9",
    text: "text-[14px] leading-5 max-md:text-[16px] max-md:leading-6",
    pad: "px-3",
    radius: "rounded-(--ds-radius-xs)",
    icon: 16,
    area: "min-h-[86px]",
  },
  md: {
    h: "h-11",
    text: "text-[15px] leading-[22px] max-md:text-[16px] max-md:leading-6",
    pad: "px-3.5",
    radius: "rounded-(--ds-radius-xs)",
    icon: 16,
    area: "min-h-[110px]",
  },
  lg: {
    h: "h-13",
    text: "text-[16px] leading-6",
    pad: "px-4",
    radius: "rounded-(--ds-radius-row)",
    icon: 18,
    area: "min-h-[134px]",
  },
};

export const FIELD_BOX =
  "relative flex w-full min-w-0 items-center gap-2 border font-sans text-(--ds-color-ink) " +
  "transition-[border-color,box-shadow,background-color] duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "forced-colors:focus-within:outline-(length:--ds-focus-width) forced-colors:focus-within:outline-solid " +
  "forced-colors:focus-within:outline-[Highlight]";

export type FieldTone = "rest" | "invalid" | "success" | "disabled" | "readOnly";

/** The line and fill of each tone, with focus and hover. */
export const FIELD_TONE: Record<FieldTone, string> = {
  rest:
    "border-(--ds-color-line-field) bg-(--ds-color-surface) " +
    "hover:not-focus-within:border-(--ds-color-text-muted) data-[force=hover]:border-(--ds-color-text-muted) " +
    "focus-within:border-(--ds-color-accent) focus-within:shadow-(--ds-focus-halo) " +
    "data-[force=focus]:border-(--ds-color-accent) data-[force=focus]:shadow-(--ds-focus-halo)",
  invalid:
    "border-(--ds-color-danger) bg-(--ds-color-surface) outline-offset-(--ds-focus-offset) " +
    "focus-within:shadow-(--ds-focus-halo-danger) focus-within:outline-(length:--ds-focus-width) focus-within:outline-solid " +
    "focus-within:outline-(--ds-focus-color) data-[force=focus]:shadow-(--ds-focus-halo-danger) " +
    "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color)",
  success:
    "border-(--ds-color-success)/60 bg-(--ds-color-surface) " +
    "hover:not-focus-within:border-(--ds-color-success) data-[force=hover]:border-(--ds-color-success) " +
    "focus-within:border-(--ds-color-accent) focus-within:shadow-(--ds-focus-halo) " +
    "data-[force=focus]:border-(--ds-color-accent) data-[force=focus]:shadow-(--ds-focus-halo)",
  disabled:
    "cursor-not-allowed border-(--ds-color-line) bg-(--ds-color-surface-sunken) text-(--ds-color-text-quiet)",
  readOnly:
    "border-(--ds-color-line) bg-(--ds-color-surface-sunken) " +
    "focus-within:border-(--ds-color-accent) focus-within:shadow-(--ds-focus-halo) " +
    "data-[force=focus]:border-(--ds-color-accent) data-[force=focus]:shadow-(--ds-focus-halo)",
};

/** The native input or textarea inside the box: no outline of its own, the accent caret, autofill kept
 *  white and navy rather than the browser's yellow. */
export const FIELD_INPUT =
  "min-w-0 flex-1 self-stretch bg-transparent font-sans outline-none caret-(--ds-color-accent) " +
  "placeholder:text-(--ds-color-text-muted) disabled:cursor-not-allowed disabled:placeholder:text-(--ds-color-text-quiet) " +
  "autofill:shadow-[inset_0_0_0_1000px_var(--ds-color-surface)] autofill:[-webkit-text-fill-color:var(--ds-color-ink)]";

/** The label above the box: Inter 13/18 500, -0.01em, 8px above. */
export const FIELD_LABEL =
  "mb-2 block font-sans text-[13px] font-medium leading-[18px] tracking-[-0.01em] text-(--ds-color-ink)";

export function fieldTone(o: { disabled?: boolean; readOnly?: boolean; invalid?: boolean; success?: boolean }): FieldTone {
  if (o.disabled) return "disabled";
  if (o.readOnly) return "readOnly";
  if (o.invalid) return "invalid";
  if (o.success) return "success";
  return "rest";
}
