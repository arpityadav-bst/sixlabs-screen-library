// The overview's data: the pins that name a spec panel's own parts, the values behind its example (the
// shipped Try now) and the glossary of the site's own names. Token values come from tokens.ts, so nothing
// here restates a number. Server only: the pins' file:lines are read at build.
import type { SectionId } from "@/app/design-system/_data/catalog";
import type { AnatomyPin } from "@/app/design-system/_kit/anatomy-measure";
import type { PropRow, ValueRow } from "@/app/design-system/_kit/SpecDrawer";
import { tokenRow, tokenValue } from "@/app/design-system/_kit/token-rows";
import type { Assertion } from "../foundations/foundation-assert";
import { check } from "../foundations/foundation-scan";

const KIT = "src/app/design-system/_kit";
const kit = (file: string, name: string): Assertion => ({ file: `${KIT}/${file}`, needles: [`export function ${name}(`] });

/** One pin inside the example panel, its file:line read at build from the kit export that draws it, so a
 *  moved line never goes stale. Each value names the guide class its selector finds. */
function howto(pin: Omit<AnatomyPin, "source">, at: Assertion): AnatomyPin & { expect: string } {
  return { ...pin, source: check(at).at, expect: at.needles[0] };
}

/** Pins inside the example panel, numbered in reading order. */
export const HOWTO: readonly AnatomyPin[] = [
  howto({ selector: "[data-ds-howto] .ds-spec-row", name: "Head",
    value: "title, the part and file:line chip (a click copies the import), at most one fact chip · .ds-spec-row" },
  kit("SpecHead.tsx", "SpecHead")),
  howto({ selector: "[data-ds-howto] .ds-role", name: "Role line", value: "why it looks so, 25 words at most · .ds-role" },
    kit("RoleLine.tsx", "RoleLine")),
  howto({ selector: "[data-ds-howto] .ds-canvas", name: "Canvas", value: "the ground the part ships on · .ds-canvas" },
    kit("Canvas.tsx", "Canvas")),
  howto({ selector: "[data-ds-howto] .ds-spec-caption", name: "Caption", value: "facts, never reasons · .ds-spec-caption" },
    kit("Spec.tsx", "Spec")),
  howto({ selector: "[data-ds-howto] .ds-sd > summary", name: "Drawer",
    value: "the props it varies, values and code, closed until asked · .ds-sd" },
  kit("SpecDrawer.tsx", "SpecDrawer")),
];

/** The site in one view: each name the guide uses for a stretch, part or look of the site, and the section
 *  that owns it. */
export const GLOSSARY: readonly { term: string; means: string; at: SectionId }[] = [
  { term: "The container hero", means: "The first screen of /website, the copy and the floor inside one rounded grey box.", at: "hero" },
  { term: "The hero container", means: "That box's look, grey, rounded and hairlined, which a set piece elsewhere may take.", at: "surfaces" },
  { term: "The full view", means: "The other first screen, on /6labs-fullview, the floor edge to edge under a clear header.", at: "hero" },
  { term: "The floor", means: "The three.js field of glass tiles, each carrying a player who turns into a hologram.", at: "tile-floor" },
  { term: "The scroll line", means: "Section two, one sentence filled word by word as the page scrolls.", at: "scroll-line" },
  { term: "The accent water", means: "The accent blue tide that rises over the scroll line, the site's one accent fill.", at: "accent-water" },
  { term: "The players", means: "The section that stands on the water, its player cards and the Human / AI switch.", at: "scroll-players" },
  { term: "On blue", means: "Set on the accent water, where white at a few fixed strengths does the work ink does elsewhere.", at: "colour-special" },
  { term: "The light sections", means: "The comparison, the jobs, the questions and the closing call on the grained page.", at: "light-sections" },
  { term: "The grain", means: "The faint noise over the page colour from the comparison to the footer, fading in over its first 240px.", at: "light-sections" },
  { term: "Ink and primary", means: `Ink (${tokenValue("color-ink")}) is the navy of type and icons, primary (${tokenValue("color-primary")}) the deeper navy of fills.`, at: "colour" },
];

export const CTA_VALUES: readonly ValueRow[] = [
  tokenRow("Fill", "color-primary"),
  tokenRow("Fill on hover", "color-primary-hover"),
  tokenRow("Dot band run", "dur-sweep"),
  tokenRow("Dot band curve", "ease-sweep"),
  tokenRow("Grow and press", "spring-press"),
];

export const CTA_PROPS: readonly PropRow[] = [{ name: "children", type: "ReactNode", note: "the label" }];

export const CTA_CODE = `import { PrimaryCta } from "@/components/website/PrimaryCta";

<PrimaryCta>Try now</PrimaryCta>`;

export const SPEC_CODE = `import { Spec } from "@/app/design-system/_kit/Spec";
import { Canvas } from "@/app/design-system/_kit/Canvas";

<Spec title="Try now" source={{ from: "@/components/website/PrimaryCta", name: "PrimaryCta" }} role="..." drawer={{ values, props, code }}>
  <Canvas ground="container"><PrimaryCta>Try now</PrimaryCta></Canvas>
</Spec>`;

export const SPEC_PROPS: readonly PropRow[] = [
  { name: "title", type: "string" },
  { name: "source", type: "{ from, name?, file?, line? }", note: "the chips" },
  { name: "role", type: "ReactNode", note: "one sentence of why" },
  { name: "caption", type: "ReactNode", note: "a mono fact row" },
  { name: "drawer", type: "SpecDrawerProps", note: "values, props, code" },
];
