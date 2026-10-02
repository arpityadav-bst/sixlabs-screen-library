// Catalog entries for Start, Foundations and Motion, in page order.
import { defineGroup, sectionFile as f, sys } from "./catalog-types";

export const START = defineGroup({
  id: "start",
  title: "Start",
  lead: "What the guide holds, how to read it, and the principles every part answers to.",
  sections: [
    { id: "overview", title: "Overview", designMdTitle: "About this document", file: f("start/overview"), designMd: "0", covers: [] },
    { id: "principles", title: "Principles", file: f("start/principles"), designMd: "1", covers: [] },
  ],
});

export const FOUNDATIONS = defineGroup({
  id: "foundations",
  title: "Foundations",
  lead: "The values every part is built from: colour and contrast, type, space and layout, radius, stroke, icons, focus and the accessibility baseline.",
  sections: [
    {
      id: "colour",
      title: "Colour roles",
      file: f("foundations/colour-roles"),
      designMd: "2.1",
      covers: [sys("TokenStyle")],
    },
    { id: "colour-special", title: "Special palettes", file: f("foundations/colour-special"), designMd: "2.2", covers: [] },
    { id: "contrast", title: "Contrast", file: f("foundations/colour-contrast"), designMd: "2.3", covers: [] },
    { id: "type", title: "Type", file: f("foundations/type-roles"), designMd: "2.4", covers: [] },
    { id: "spacing", title: "Spacing and rhythm", file: f("foundations/spacing"), designMd: "2.5", covers: [] },
    { id: "layout", title: "Layout and breakpoints", file: f("foundations/layout-breakpoints"), designMd: "2.6", covers: [] },
    { id: "radius", title: "Radius", file: f("foundations/radius"), designMd: "2.7", covers: [] },
    { id: "elevation", title: "Stroke and elevation", file: f("foundations/stroke-elevation"), designMd: "2.8", covers: [] },
    {
      id: "icons",
      title: "Icons",
      file: f("foundations/icons"),
      designMd: "2.9",
      covers: [sys("Icon", { variants: "12 14 16 18 20 24 inline boxed" })],
    },
    {
      id: "focus",
      title: "Focus",
      file: f("foundations/focus"),
      designMd: "2.10",
      covers: [sys("SkipLink")],
    },
    { id: "accessibility", title: "Accessibility baseline", file: f("foundations/accessibility"), designMd: "2.11", covers: [] },
  ],
});

export const MOTION = defineGroup({
  id: "motion",
  title: "Motion",
  lead: "How the site moves: its curves and durations, how parts enter and answer the pointer, the loops, and how all of it gives way to reduced motion.",
  sections: [
    { id: "motion-tokens", title: "Easing, duration, springs", file: f("motion/tokens"), designMd: "4.1", covers: [] },
    { id: "motion-entrance", title: "Entrance and reveal", file: f("motion/entrance"), designMd: "4.2", covers: [] },
    { id: "motion-micro", title: "Micro-interactions", file: f("motion/micro"), designMd: "4.3", covers: [] },
    { id: "motion-loops", title: "Ambient loops", file: f("motion/loops"), designMd: "4.4", covers: [] },
    { id: "motion-choreography", title: "Choreography", file: f("motion/choreography"), designMd: "4.5", covers: [] },
    { id: "motion-reduced", title: "Reduced motion", file: f("motion/reduced"), designMd: "4.6", covers: [] },
  ],
});
