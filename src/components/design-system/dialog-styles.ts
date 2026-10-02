// Dialog's class maps, written out in full for Tailwind's scanner. The panel is white with the hairline and
// the modal shadow, radius 28 and padding 32 from md, 24 and 24 below. The sheet is the same panel attached
// to the bottom edge, its top corners at 28, its foot padded past the home indicator.

export type DialogSize = "sm" | "md" | "lg";

/** The panel's widths: sm for a confirm, md for a form, lg for content. */
export const DIALOG_WIDTH_PX: Record<DialogSize, number> = { sm: 400, md: 520, lg: 680 };

export const DIALOG_WIDTH: Record<DialogSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[520px]",
  lg: "max-w-[680px]",
};

/** The native dialog fills the viewport, clear, so the veil and the panel inside it can move. */
export const NATIVE =
  "fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 " +
  "text-(--ds-color-ink) outline-none backdrop:bg-transparent";

export const PANEL =
  "pointer-events-auto relative flex w-full flex-col border border-(--ds-color-line) bg-(--ds-color-surface) " +
  "text-left font-sans shadow-(--ds-shadow-modal) outline-none";

export const PANEL_DIALOG =
  "max-h-[calc(100svh-96px)] rounded-(--ds-radius-md) p-6 md:rounded-(--ds-radius-lg) md:p-8";

export const PANEL_SHEET =
  "max-h-[90svh] max-w-[680px] rounded-t-(--ds-radius-lg) rounded-b-none border-b-0 px-6 " +
  "pb-[calc(24px+env(safe-area-inset-bottom,0px))]";

export const TITLE =
  "font-display text-[24px] font-medium leading-[30px] tracking-[-0.03em] text-(--ds-color-ink)";

export const DESCRIPTION = "mt-2 text-[15px] leading-[22px] text-(--ds-color-text-muted)";

export const BODY = "mt-6 min-h-0 flex-1 overflow-y-auto text-[15px] leading-[1.6] text-(--ds-color-text-body)";

export const FOOTER = {
  dialog: "mt-8 flex shrink-0 flex-wrap items-center justify-end gap-3",
  sheet: "mt-6 flex shrink-0 flex-col-reverse gap-3 *:w-full",
} as const;

/** The grab strip at the sheet's top, with the 36 by 4 handle 8px down. */
export const HANDLE_ZONE = "-mx-6 mb-2 flex h-6 shrink-0 cursor-grab touch-none justify-center pt-2 active:cursor-grabbing";

export const HANDLE =
  "h-1 w-9 rounded-full bg-(--ds-color-line-strong) transition-colors duration-(--ds-dur-ui) ease-(--ds-ease-out) " +
  "data-[dragging]:bg-(--ds-color-line-hover)";
