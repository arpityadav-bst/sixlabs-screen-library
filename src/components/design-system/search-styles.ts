// SearchField's class maps, beside SearchField.tsx, written out in full for Tailwind's scanner.
export type SearchSize = "sm" | "md" | "lg";

/** sm 32 / md 40 / lg 48 (control-heights.ts reads h). The glass sits at 12 / 14 / 16, and the text starts
 *  after it by the glass's offset plus its size plus a gap of 8 / 10 / 12 (so 34 / 40 / 46), written from
 *  the tokens. */
export const SEARCH_SIZE: Record<SearchSize, { h: string; text: string; icon: 14 | 16 | 18; at: string; pad: string; end: string }> = {
  sm: {
    h: "h-8", text: "text-[13px] max-md:text-[16px]", icon: 14, at: "left-3",
    pad: "pl-[calc(var(--ds-space-3)+var(--ds-icon-14)+var(--ds-space-2))] pr-1.5", end: "",
  },
  md: {
    h: "h-10", text: "text-[14px] max-md:text-[16px]", icon: 16, at: "left-3.5",
    pad: "pl-[calc(var(--ds-space-3-5)+var(--ds-icon-16)+var(--ds-space-2-5))] pr-1.5", end: "pr-1",
  },
  lg: {
    h: "h-12", text: "text-[15px] max-md:text-[16px]", icon: 18, at: "left-4",
    pad: "pl-[calc(var(--ds-space-4)+var(--ds-icon-18)+var(--ds-space-3))] pr-2.5", end: "pr-1",
  },
};

export const SEARCH_KBD =
  "grid h-5 min-w-5 place-items-center rounded-(--ds-radius-mark) border border-(--ds-color-line) bg-(--ds-color-surface) px-1.5 " +
  "font-(family-name:--ds-font-mono) text-[11px] leading-none text-(--ds-color-text-muted)";
