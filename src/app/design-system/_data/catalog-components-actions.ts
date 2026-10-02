// Catalog entries for Components, Actions and Selection, in page order. A cover's states are the columns its
// state grids show (catalog-states.ts holds each list to the section's own arrays), and a ground or a range
// is a variant, never a state.
import { defineSections, sectionFile as f, site, sys } from "./catalog-types";

export const ACTIONS_SELECTION = defineSections([
  {
    id: "button",
    title: "Button",
    sub: "Actions",
    file: f("components/button"),
    designMd: "7.1",
    covers: [
      site("PrimaryCta", { states: "rest hover pressed" }),
      site("CtaDots"),
      sys("Button", {
        variants: "primary secondary tertiary ghost link destructive destructivePrimary inverse glass xs sm md lg xl",
        states: "rest hover focus-visible pressed disabled loading selected selected-hover",
      }),
      sys("ButtonSweep"),
      sys("ButtonGroup"),
    ],
  },
  {
    id: "icon-button",
    title: "Icon button",
    sub: "Actions",
    file: f("components/icon-button"),
    designMd: "7.2",
    covers: [
      sys("IconButton", {
        variants: "elevated outline ghost solid glass xs sm md lg xl",
        states: "rest hover focus-visible pressed disabled loading toggled toggled-hover",
      }),
      site("WaveButton", { file: "HeroBits", states: "rest hover busy" }),
    ],
  },
  {
    id: "text-link",
    title: "Text link",
    sub: "Actions",
    file: f("components/text-link"),
    designMd: "7.3",
    covers: [
      sys("TextLink", { variants: "inherit ink muted", states: "rest hover focus-visible pressed visited", na: "disabled" }),
    ],
  },
  {
    id: "segmented",
    title: "Segmented control",
    sub: "Selection",
    file: f("components/segmented"),
    designMd: "7.4",
    covers: [
      sys("Segmented", {
        variants: "light container blue",
        states: "rest hover selected focus-visible pressed disabled-segment disabled",
      }),
      site("ModeToggle", { states: "human ai hover auto-flip" }),
    ],
  },
  {
    id: "tabs",
    title: "Tabs",
    sub: "Selection",
    file: f("components/tabs"),
    designMd: "7.5",
    covers: [sys("Tabs", { states: "rest hover selected focus-visible pressed disabled" })],
  },
  {
    id: "chip",
    title: "Chip",
    sub: "Selection",
    file: f("components/chip"),
    designMd: "7.6",
    covers: [
      sys("Chip", {
        variants: "filter choice input",
        states: "rest hover focus-visible pressed selected selected-hover disabled remove-hover",
      }),
    ],
  },
]);
