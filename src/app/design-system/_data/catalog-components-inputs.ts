// Catalog entries for Components, Inputs, in page order. A cover's states are the columns its state grids
// show (catalog-states.ts holds each list to the section's own arrays), and a ground or a range is a
// variant, never a state.
import { defineSections, sectionFile as f, sys } from "./catalog-types";

export const INPUTS = defineSections([
  {
    id: "fields",
    title: "Text fields",
    sub: "Inputs",
    file: f("components/field-text"),
    designMd: "7.7",
    covers: [
      sys("Field"),
      sys("TextInput", {
        variants: "sm md lg",
        states: "rest hover focus filled disabled read-only read-only-focus invalid invalid-focus success",
        na: "pressed",
      }),
      sys("TextArea", {
        states:
          "rest hover focus filled near-limit over-limit-typing over-limit invalid invalid-focus disabled read-only read-only-focus",
        na: "pressed",
      }),
    ],
  },
  {
    id: "select-search",
    title: "Select and search",
    sub: "Inputs",
    file: f("components/select-search"),
    designMd: "7.8",
    covers: [
      sys("Select", { states: "rest hover focus open filled disabled read-only read-only-focus invalid invalid-focus open-invalid", na: "pressed" }),
      sys("SearchField", { states: "empty hover focus filled results searching no-results disabled", na: "pressed" }),
    ],
  },
  {
    id: "choice",
    title: "Checkbox, radio, switch",
    sub: "Inputs",
    file: f("components/choice"),
    designMd: "7.9",
    covers: [
      sys("Checkbox", {
        states:
          "unchecked hover checked checked-hover indeterminate focus-visible pressed disabled disabled-checked invalid invalid-checked read-only read-only-checked",
      }),
      sys("Radio", {
        states:
          "unchecked hover checked checked-hover focus-visible pressed disabled disabled-checked invalid read-only read-only-checked",
      }),
      sys("RadioGroup", { file: "Radio", variants: "list card" }),
      sys("ChoiceGroup"),
      sys("Switch", {
        variants: "on-blue",
        states:
          "off on hover on-hover focus-visible pressed on-pressed disabled disabled-on loading loading-off read-only read-only-on",
      }),
    ],
  },
  {
    id: "slider",
    title: "Slider",
    sub: "Inputs",
    file: f("components/slider"),
    designMd: "7.10",
    covers: [sys("Slider", { variants: "sm md lg range on-blue", states: "rest hover focus-visible dragging disabled" })],
  },
]);
