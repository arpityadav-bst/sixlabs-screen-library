// The focus ring as literal Tailwind class strings, so the scanner sees every class. A 2px outline outside
// the border box, 2px off a control and 3px off a card, following the element's radius. Width and offsets
// read the focus-width, focus-offset and focus-offset-card tokens, so the tokens drive every ring. It shows on
// :focus-visible only, with no transition. Each string pairs the real pseudo-class with its
// data-[force=focus] twin, so a forced StateGrid cell and a real Tab look the same. In forced colours the
// outline takes Highlight. Fields take a 3px halo and an accent border in place of the outline.

/** Accent ring, for page, surface and container grounds. */
export const FOCUS =
  "outline-offset-(--ds-focus-offset) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color) " +
  "forced-colors:focus-visible:outline-[Highlight]";

/** White ring, for controls on the players' accent ground. */
export const FOCUS_INVERSE =
  "outline-offset-(--ds-focus-offset) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color-inverse) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color-inverse) " +
  "forced-colors:focus-visible:outline-[Highlight]";

/** Lifted accent ring (#6ea8ff), for controls on navy and the terminal. */
export const FOCUS_DARK =
  "outline-offset-(--ds-focus-offset) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color-dark) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color-dark) " +
  "forced-colors:focus-visible:outline-[Highlight]";

/** Accent ring at 3px, for cards and large surfaces. */
export const FOCUS_CARD =
  "outline-offset-(--ds-focus-offset-card) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color) " +
  "forced-colors:focus-visible:outline-[Highlight]";

/** Accent ring drawn inside the box (focus-offset-inset), for items in a scroll row whose overflow would clip it. */
export const FOCUS_INSET =
  "outline-offset-(--ds-focus-offset-inset) focus-visible:outline-(length:--ds-focus-width) focus-visible:outline-solid focus-visible:outline-(--ds-focus-color) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color) " +
  "forced-colors:focus-visible:outline-[Highlight]";

/** Field focus: accent border and the 3px halo, with a transparent outline that forced colours paint. */
export const FIELD_FOCUS =
  "focus-visible:outline-hidden focus-visible:border-(--ds-color-accent) focus-visible:shadow-(--ds-focus-halo) " +
  "data-[force=focus]:border-(--ds-color-accent) data-[force=focus]:shadow-(--ds-focus-halo)";

export type FocusTone = "default" | "inverse" | "dark" | "card" | "inset";

/** The ring string for a tone. */
export function focusRing(tone: FocusTone = "default"): string {
  return { default: FOCUS, inverse: FOCUS_INVERSE, dark: FOCUS_DARK, card: FOCUS_CARD, inset: FOCUS_INSET }[tone];
}
