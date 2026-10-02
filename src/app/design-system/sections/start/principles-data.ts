// The eight principles as the guide shows them: the rule in one sentence and the section that enforces it.
// The reason behind each, and the failure it prevents, live in DESIGN.md chapter 1.
import type { SectionId } from "@/app/design-system/_data/catalog";

export type Principle = { title: string; rule: string; at: SectionId };

export const PRINCIPLES: readonly Principle[] = [
  {
    title: "Real parts only",
    rule: "Specimens import the site's own components, and any value written down is checked against its source at build.",
    at: "coverage",
  },
  {
    title: "One accent fill",
    rule: "Accent blue fills only the players section, as the water. Elsewhere a set piece takes the hero container look, with the accent on a word or two.",
    at: "surfaces",
  },
  {
    title: "Navy carries state",
    rule: "Selected, checked and pressed fills are primary navy. The accent is for type, icons, dots, links and the ring.",
    at: "colour",
  },
  {
    title: "Light is the material",
    rule: "Glass, holograms, halftone, grain and the colour split are drawn in canvas or WebGL, never with CSS blur, blend, mask or filter.",
    at: "perf-rule",
  },
  {
    title: "Holograms are the only AI look",
    rule: "Every AI copy is the faceless blue scan-line hologram, on the tiles, in the Human / AI switch and in the footer.",
    at: "holograms",
  },
  {
    title: "Every control is complete",
    rule: "Rest, hover, focus-visible, pressed and disabled, plus loading, selected or open where they apply, all from a keyboard.",
    at: "accessibility",
  },
  {
    title: "One ease, short travel",
    rule: "Motion settles on one curve. Ambient loops travel 8px or less, take 1.5s or longer and stop under reduced motion.",
    at: "motion-tokens",
  },
  {
    title: "Say it once",
    rule: "Each value has one name. The guide shows the thing and DESIGN.md gives the reason, and neither repeats the other.",
    at: "conventions",
  },
];
