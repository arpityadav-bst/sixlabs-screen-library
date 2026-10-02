// Catalog entries for Components, Display, in page order. A cover's states are the columns its state grids
// show, and a ground is a variant, never a state.
import { defineSections, sectionFile as f, site, sys } from "./catalog-types";

export const DISPLAY = defineSections([
  {
    id: "card",
    title: "Card",
    sub: "Display",
    file: f("components/card"),
    designMd: "7.11",
    covers: [
      sys("Card", {
        variants: "static clickable selectable on-blue container inverse feature compact row",
        states: "rest hover pressed selected focus-visible disabled loading",
      }),
    ],
  },
  {
    id: "comparison",
    title: "Comparison cards",
    sub: "Display",
    file: f("components/comparison"),
    designMd: "7.12",
    renders: ["understands"],
    covers: [site("Understands")],
  },
  {
    id: "stats-typed",
    title: "Stats and typed word",
    sub: "Display",
    file: f("components/stats-typed"),
    designMd: "7.13",
    covers: [site("HeroNumbers", { file: "HeroBits" }), site("TypedWord")],
  },
  {
    id: "badge-tag",
    title: "Badge, status dot, tag",
    sub: "Display",
    file: f("components/badge-tag"),
    designMd: "7.14",
    covers: [
      sys("Badge", { variants: "neutral live success warning danger inverse onBlue sm md count" }),
      sys("StatusDot", { variants: "live idle success danger ping pulse none" }),
      sys("Tag", { variants: "panel pill plain" }),
      sys("TagList", { file: "Tag", variants: "panel plain" }),
    ],
  },
  {
    id: "avatar",
    title: "Avatar",
    sub: "Display",
    file: f("components/avatar"),
    designMd: "7.15",
    covers: [
      sys("Avatar", { variants: "20 24 32 40 48 64 96 circle model", states: "rest hover pressed focus-visible disabled" }),
      sys("AvatarGroup", { variants: "circle model" }),
    ],
  },
  {
    id: "section-head",
    title: "Section head",
    sub: "Display",
    file: f("components/section-head"),
    designMd: "7.16",
    covers: [sys("SectionHead", { variants: "h2 display start center" })],
  },
  {
    id: "progress",
    title: "Traits and progress",
    sub: "Display",
    file: f("components/progress"),
    designMd: "7.17",
    covers: [
      sys("Progress", { states: "determinate indeterminate complete error paused" }),
      sys("ProgressCircle"),
      site("PlayerTraits", { states: "value-change" }),
    ],
  },
  {
    id: "carousel",
    title: "Player carousel",
    sub: "Display",
    file: f("components/carousel"),
    designMd: "7.18",
    covers: [site("PlayerCarousel"), site("PlayerArrows", { file: "PlayerCarousel" })],
  },
  {
    id: "terminal",
    title: "Terminal",
    sub: "Display",
    file: f("components/terminal"),
    designMd: "7.19",
    covers: [site("JobTerminal", { states: "idle-mouse idle-touch playing done reduced-motion" })],
  },
  {
    id: "accordion",
    title: "Accordion",
    sub: "Display",
    file: f("components/accordion"),
    designMd: "7.20",
    renders: ["faq"],
    covers: [
      sys("Accordion", { variants: "card flush", states: "closed hover pressed focus-visible open disabled loading" }),
      site("Faq", { states: "closed hover open" }),
    ],
  },
]);
