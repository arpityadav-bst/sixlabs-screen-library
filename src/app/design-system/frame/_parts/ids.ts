// The frame parts' names and their URLs, kept free of the part components, so the guide's client code
// (ViewportPreview) can build a frame's src without pulling every part into its bundle. index.ts maps each
// name to its component, and tsc fails while any name here has none.
export const PARTS = [
  "header-rest",
  "header-scrolled",
  "header-onblue",
  "header-clear-top",
  "header-clear-held",
  "header-phone",
  "menu-open",
  "language",
  "footer",
  "back-to-top",
  "back-to-top-phone",
  "scroll-cue",
  "scroll-cue-away",
  "scroll-set-piece",
  "players",
  "section-jobs",
  "section-understands",
  "section-faq",
  "hero-container",
  "hero-full",
  "carousel-phone",
  "terminal-phone",
  "accordion-phone",
  "button-group",
  "layout-closing",
  "field-sizes",
  "select-native",
  "radio-stack",
  "hero-numbers",
  "avatar-group",
  "section-head",
  "toast-stack",
  "dialog-auto",
] as const;

export type PartId = (typeof PARTS)[number];

export function isPart(v: string): v is PartId {
  return (PARTS as readonly string[]).includes(v);
}

/** The iframe src of a part, with an optional query ("y=0", "open=0") that its signal helpers read. */
export const frameHref = (part: PartId, query?: string) =>
  `/design-system/frame/${part}${query ? `?${query}` : ""}`;
