// Catalog entries for Components, Feedback and Overlays, in page order. A cover's states are the columns its
// state grids show, and a ground is a variant, never a state.
import { defineSections, sectionFile as f, sys } from "./catalog-types";

export const FEEDBACK_OVERLAYS = defineSections([
  {
    id: "loading",
    title: "Spinner and skeleton",
    sub: "Feedback",
    file: f("components/spinner-skeleton"),
    designMd: "7.21",
    covers: [
      sys("Spinner", { variants: "8 12 16 20 24" }),
      sys("Skeleton", { variants: "line title circle rect" }),
    ],
  },
  {
    id: "empty-state",
    title: "Empty state",
    sub: "Feedback",
    file: f("components/empty-state"),
    designMd: "7.22",
    covers: [sys("EmptyState", { variants: "firstUse noResults error offline noAccess" })],
  },
  {
    id: "tooltip",
    title: "Tooltip",
    sub: "Overlays",
    file: f("components/tooltip"),
    designMd: "7.23",
    covers: [sys("Tooltip", { variants: "top bottom left right default inverse" })],
  },
  {
    id: "toast",
    title: "Toast",
    sub: "Overlays",
    file: f("components/toast"),
    designMd: "7.24",
    covers: [
      // a toast is dismissed or acted on, never switched off, so it owes no disabled state
      sys("Toast", { variants: "success error info loading", states: "rest hover focus-visible pressed", na: "disabled" }),
      sys("ToastStack", { variants: "tucked fanned" }),
      sys("Toaster"),
    ],
  },
  {
    id: "dialog",
    title: "Dialog and sheet",
    sub: "Overlays",
    file: f("components/dialog"),
    designMd: "7.25",
    covers: [
      sys("Dialog", {
        variants: "dialog sheet alertdialog sm md lg",
        states: "closed opening open busy closing dragging",
      }),
      sys("DialogAction"),
    ],
  },
]);
