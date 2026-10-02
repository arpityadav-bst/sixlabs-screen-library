// Player carousel: the shipped PlayerCarousel and PlayerArrows, which replace the four selector cards and
// the side column below lg. Shown on the players' accent ground, the one ground they ship on, with the
// phone composition in a frame at a true width (the md step follows the viewport, not the box).
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Note } from "@/app/design-system/_kit/Note";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { ArrowsAlwaysOn, ArrowsAt, ArrowsLive, CarouselPair } from "./carousel-live";
import {
  CAROUSEL_CODE,
  CAROUSEL_PINS,
  CAROUSEL_PROPS,
  CAROUSEL_STATES,
  CAROUSEL_VALUES,
} from "./carousel-data";

const SOURCE = { from: "@/components/website/PlayerCarousel", name: "PlayerCarousel" };
const ARROWS = { from: "@/components/website/PlayerCarousel", name: "PlayerArrows" };
const ARROW_STATES = ["enabled", "disabled"] as const;

export function CarouselSection() {
  return (
    <Section
      id="carousel"
      lead="Below lg the four player cards and the side column become one row of slides under the portrait, picked by a swipe, a dot or an arrow."
    >
      <Spec
        title="Player carousel"
        source={SOURCE}
        props="active onChange"
        role="One active index drives the arrows, the slides and the dots together, so the portrait above always shows the slide in view."
        caption="box 390 wide · the type follows the guide window, the phone step is in the frame below"
        drawer={{ values: CAROUSEL_VALUES, props: CAROUSEL_PROPS, code: CAROUSEL_CODE }}
        note="Both parts read PLAYERS directly, so a carousel of anything else needs an items prop first."
      >
        <Anatomy ground="on-blue" pins={CAROUSEL_PINS} label="Player carousel anatomy">
          <CarouselPair />
        </Anatomy>
      </Spec>

      <Spec
        title="Arrows at the ends"
        source={ARROWS}
        props="active"
        role="The arrows dim at the ends instead of wrapping, so the first and last players read as the edges of a set of four."
      >
        <StateGrid
          label="Previous and next arrow states"
          ground="on-blue"
          states={ARROW_STATES}
          minCell={200}
          liveCaption="click the arrows"
          render={({ state }) =>
            state === "live" ? <ArrowsLive /> : <ArrowsAt active={state === "disabled" ? 0 : 1} />
          }
        />
        <KeyRows label="Carousel states the parts cannot be forced into" rows={CAROUSEL_STATES} />
      </Spec>

      <Spec
        title="Across widths"
        source={SOURCE}
        role="The title and column step at the viewport's md, so only a frame at a true width shows the phone composition."
        caption="375 · 768"
        chips={["md:text-[36px]", "md:max-w-[560px]"]}
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview
            part="carousel-phone"
            title="Player carousel at phone and tablet width"
            height={560}
            widths={[375, 768]}
            width={375}
            fitHeight
          />
        </Canvas>
      </Spec>

      <DoDont>
        <Do
          ground="on-blue"
          reason="At either end the arrow dims and stops, so the four players read as a row with ends, never a loop."
        >
          <ArrowsAt active={0} />
        </Do>
        <Dont
          ground="on-blue"
          reason="An arrow still live at the first player promises one before it, and a press that wraps to the last loses the reader's place."
        >
          <ArrowsAlwaysOn />
        </Dont>
      </DoDont>
      <Note>
        The carousel is white on the accent water, the one ground it ships on. White off the water is shown once, in{" "}
        <SectionLink id="colour-special" />.
      </Note>
    </Section>
  );
}
