// Catalog entries for Patterns and Meta, in page order.
import { defineGroup, sectionFile as f, site, sys } from "./catalog-types";

export const PATTERNS = defineGroup({
  id: "patterns",
  title: "Patterns",
  lead: "How the parts come together into surfaces, sections, pages and flows, and how each holds up at every width.",
  sections: [
    { id: "surfaces", title: "Surfaces", file: f("patterns/surfaces"), designMd: "9.1", covers: [] },
    {
      id: "hero",
      title: "Hero",
      file: f("patterns/hero"),
      designMd: "9.2",
      covers: [site("Hero", { variants: "container full" })],
    },
    {
      id: "scroll-players",
      title: "Scroll line to players",
      file: f("patterns/scroll-players"),
      designMd: "9.3",
      covers: [site("Players")],
    },
    {
      id: "light-sections",
      title: "Light sections",
      file: f("patterns/light-sections"),
      designMd: "9.4",
      renders: ["get-access"],
      covers: [site("Jobs"), site("Closing")],
    },
    { id: "page", title: "Page composition", file: f("patterns/page-composition"), designMd: "9.5", covers: [] },
    { id: "responsive", title: "Responsive ladder", file: f("patterns/responsive"), designMd: "9.6", covers: [] },
    {
      id: "forms",
      title: "Forms",
      file: f("patterns/forms"),
      designMd: "9.7",
      covers: [sys("TextInput"), sys("Select"), sys("Dialog")],
    },
    {
      id: "system-states",
      title: "Loading, empty and failure",
      file: f("patterns/system-states"),
      designMd: "9.8",
      covers: [
        sys("Banner", {
          variants: "offline info success warning danger action close",
          states: "rest hover focus-visible pressed loading",
        }),
        sys("SkeletonGroup", { file: "Skeleton" }),
      ],
    },
    { id: "voice", title: "Content and voice", file: f("patterns/voice"), designMd: "9.9", covers: [] },
  ],
});

export const META = defineGroup({
  id: "meta",
  title: "Meta",
  lead: "What the guide covers and still lacks, the decisions it waits on, and the conventions and history it is kept by.",
  sections: [
    { id: "coverage", title: "Coverage", file: f("meta/coverage"), designMd: "10.1", covers: [] },
    { id: "gaps", title: "Known gaps", file: f("meta/gaps"), designMd: "10.2", covers: [] },
    { id: "decisions", title: "Decisions pending", file: f("meta/decisions"), designMd: "10.3", covers: [] },
    { id: "conventions", title: "Conventions", file: f("meta/conventions"), designMd: "10.4", covers: [] },
    { id: "changelog", title: "Changelog", file: f("meta/changelog"), designMd: "10.5", covers: [] },
  ],
});
