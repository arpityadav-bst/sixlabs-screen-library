// Load-in, autoplay and loaders: how the floor arrives, plays itself and resets, and what shows while it
// loads.
import { sectionById } from "@/app/design-system/_data/catalog";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import {
  AUTOPLAY_ROWS,
  INTRO_LANES,
  LIFECYCLE_VALUES,
  LOADER_CODE,
  LOADER_PROPS,
  LOADER_VALUES,
  LOGO_VALUES,
  TURN_LANES,
  WAVE_LANES,
} from "./floor-lifecycle-data";
import { FloorLogoSpecimens, HeroLoaderSpecimens, LoaderDoDont } from "./floor-lifecycle-loaders";

/** the section the mask note points to, its anchor, title and group read from the catalog */
const GAPS = sectionById("gaps");

export function FloorLifecycleSection() {
  return (
    <Section
      id="floor-lifecycle"
      lead="The bare floor shows first, the tiles rise out of it, then the floor plays itself one tile at a time until a wave flips every tile to the other cast."
    >
      <Spec
        title="Intro"
        source={{ from: "@/tiles/intro", name: "playIntro", file: "intro.js" }}
        props="introDelay"
        role="Only the tiles change during the intro: the floor, fog and grain are a captured frame, so the ground never moves."
        caption="the container hero, from the floor's ready · seconds"
        drawer={{ label: "Lifecycle values", values: LIFECYCLE_VALUES }}
      >
        <Timeline label="Container hero intro" axisLabel="from ready" lanes={INTRO_LANES} step={0.2} />
      </Spec>

      <Spec
        title="Autoplay turn"
        source={{ from: "@/tiles/autoplay", name: "startAutoplay", file: "autoplay.js" }}
        chips={["FOCUS_MS 380", "GAP_MS 220"]}
        role="One tile at a time, each settling before the next rises, so the floor reads as one player choosing rather than noise."
        caption="wall clock from the pick · the settle and sink are summed from DEACT and riseTau"
      >
        <Timeline label="One autoplay turn" axisLabel="from the pick" lanes={TURN_LANES} step={0.25} />
        <KeyRows label="Autoplay rules" rows={AUTOPLAY_ROWS} />
      </Spec>

      <Spec
        title="Reset wave"
        source={{ from: "@/tiles/autoplay", name: "startAutoplay", file: "autoplay.js", at: "async function wave(" }}
        chips={["WAVE_SPREAD 1.3", "FLIP_SECONDS 0.75"]}
        role="Each tile flips like a card and lands as a fresh human, so a new cast arrives as one sweep, never a cut."
        caption="from the moment the flip begins · the wave button's busy ends here"
      >
        <Timeline label="Reset wave" axisLabel="from the flip" lanes={WAVE_LANES} step={0.25} />
      </Spec>

      <Spec
        title="Full-view loader"
        source={{ from: "@/components/website/HeroLoader", name: "HeroLoader" }}
        props="show"
        chips={["color-logo-navy", "color-logo-blue"]}
        role="The mark's arcs take turns from the first paint, so the visitor sees the brand at work while the floor builds."
        drawer={{ values: LOADER_VALUES, props: LOADER_PROPS, code: LOADER_CODE }}
      >
        <HeroLoaderSpecimens />
      </Spec>

      <Spec
        title="Container loader"
        source={{ from: "@/components/website/HeroBits", name: "FloorLogo" }}
        props="show"
        role="The logo lies on the floor where the tiles will rise, in their white glass, so the wait already looks like the hero."
        drawer={{ values: LOGO_VALUES, props: LOADER_PROPS, code: LOADER_CODE }}
        note={
          <>
            The still carries a CSS mask-image, one of the effects the compositor rule forbids. It is on screen while the container
            hero loads, and <a href={`#${GAPS.id}`}>{GAPS.title}</a> in {GAPS.groupTitle} lists it.
          </>
        }
      >
        <FloorLogoSpecimens />
      </Spec>

      <LoaderDoDont />
    </Section>
  );
}
