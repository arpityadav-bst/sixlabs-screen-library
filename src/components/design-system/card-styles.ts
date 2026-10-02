// The card's class maps, kept beside Card.tsx so the scanner reads every class. Sizes set the radius and
// padding (the shipped feature card is the job card, Jobs.tsx:162, the compact one the selector card under
// lg, Players.tsx:215, whose 22 radius new work snaps to radius-md 24). Tones set the type colour the parts inherit. The fill, line and states live in
// card.module.css, because they need registered properties.
import { FOCUS_CARD, FOCUS_INSET } from "./focus";

export type CardVariant = "static" | "clickable" | "selectable";
export type CardTone = "surface" | "container" | "inverse" | "onBlue";
export type CardSize = "feature" | "compact" | "row";

export const CARD_SIZE: Record<CardSize, string> = {
  feature: "flex-col rounded-(--ds-radius-lg) px-6 pb-6 pt-7 max-md:rounded-(--ds-radius-md) max-md:px-5",
  compact: "flex-col rounded-(--ds-radius-md) p-4",
  row: "flex-row items-center gap-3 rounded-(--ds-radius-row) px-4 py-3",
};

export const CARD_TONE: Record<CardTone, string> = {
  surface: "text-(--ds-color-ink)",
  container: "text-(--ds-color-ink)",
  inverse: "text-white",
  onBlue: "text-(--ds-color-ink)",
};

/** White ring at the card offset, for cards on the players' accent ground. */
export const FOCUS_CARD_INVERSE =
  "outline-offset-(--ds-focus-offset-card) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color-inverse) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color-inverse) " +
  "forced-colors:focus-visible:outline-[Highlight]";

export function cardRing(tone: CardTone, inset: boolean): string {
  if (inset) return FOCUS_INSET;
  return tone === "onBlue" ? FOCUS_CARD_INVERSE : FOCUS_CARD;
}

/** Title, body and meta colours per tone: the parts read the card's data-tone through the group. */
export const PART_TONE = {
  title: "text-(--ds-color-ink) group-data-[tone=inverse]/card:text-white",
  body:
    "text-(--ds-color-text-muted) group-data-[tone=container]/card:text-(--ds-color-text-body) " +
    "group-data-[tone=inverse]/card:text-(--ds-color-on-blue-75) group-data-[tone=onBlue]/card:text-(--ds-color-ink-70)",
  meta:
    "border-(--ds-color-line-soft) text-(--ds-color-text-muted) " +
    "group-data-[tone=inverse]/card:border-(--ds-color-on-blue-15) group-data-[tone=inverse]/card:text-(--ds-color-on-blue-50) " +
    "group-data-[tone=onBlue]/card:text-(--ds-color-ink-70)",
} as const;

/** Card-level layout shared by every variant. */
export const CARD_BASE = "group/card relative flex w-full min-w-0 text-left font-sans";
