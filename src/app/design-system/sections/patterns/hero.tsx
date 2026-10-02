// Hero: the first screen in both variants, as composed, at real widths. Each part is specced in its own
// section, so this one shows where the parts sit and what the screen does while it loads. The reasons live
// in DESIGN.md 9.2. The Do / Don't pairs are sketches of the container's copy column on its grey, built from
// its parts at its gaps, because a crop of the real frame would ask for a second live floor.
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Note } from "@/app/design-system/_kit/Note";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { HERO_LEDE } from "@/app/design-system/_data/specimens";
import { Button } from "@/components/design-system/Button";
import { TextLink } from "@/components/design-system/TextLink";
import { typeStyle } from "@/components/design-system/tokens";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { TypedWord } from "@/components/website/TypedWord";
import { ClickHold } from "./click-hold";
import { HEADLINE, HERO_BOM, HERO_CODE, HERO_LINK, HERO_PROPS, HERO_STATES, HERO_VALUES } from "./hero-data";
import { HeroPreview } from "./hero-live";
import { Bom, SecLink } from "./pattern-parts";
import s from "./hero.module.css";

const SRC = { from: "@/components/website/Hero", name: "Hero" };

function Headline({ typed }: { typed: "word" | "line" }) {
  const h = HEADLINE;
  return (
    <p className={s["ds-hero-line"]} style={typeStyle("hero")}>
      {typed === "word" ? (
        <>
          {h.before} <TypedWord word={h.word} className="text-accent" /> {h.after}
          <br />
          {h.line2}
        </>
      ) : (
        <TypedWord word={`${h.before} ${h.word} ${h.after} ${h.line2}`} />
      )}
    </p>
  );
}

function Actions({ second }: { second: "link" | "button" }) {
  return (
    <ClickHold className={s["ds-hero-cta"]}>
      <p className={s["ds-hero-lede"]} style={typeStyle("lede")}>
        {HERO_LEDE} {second === "link" && <TextLink href="#jobs">{HERO_LINK.text}</TextLink>}
      </p>
      <div className={s["ds-hero-pair"]}>
        <PrimaryCta>Try now</PrimaryCta>
        {second === "button" && <Button size="xl">{HERO_LINK.text}</Button>}
      </div>
    </ClickHold>
  );
}

export function HeroSection() {
  return (
    <Section
      id="hero"
      lead="The first screen in two variants, each the real page at true widths: the rounded container on /website, the floor edge to edge under a clear header on /6labs-fullview."
    >
      <Spec
        title="Hero, composed"
        source={SRC}
        props="full"
        role="The copy stands on the left over a live floor, so the claim reads first and the floor proves it."
        caption="the real first screen in a frame · both variants share the one floor slot, so one is live at a time"
        drawer={{ values: HERO_VALUES, props: HERO_PROPS, code: HERO_CODE }}
      >
        <HeroPreview />
      </Spec>

      <Spec
        title="Bill of materials"
        source={SRC}
        role="Every part here is specced in its own section, so this list says where each one sits and links to the rest."
      >
        <Bom items={HERO_BOM} label="Hero parts" />
      </Spec>

      <Spec
        title="While it loads"
        source={{ from: "@/components/website/hero-intro", name: "useHeroIntro", file: "hero-intro.ts" }}
        role="The copy arrives before the floor, so a slow device still reads the claim at once."
        note={
          <>
            The intro is drawn to scale under <SecLink id="motion-choreography" />, and the missing WebGL state
            is designed under <SecLink id="system-states" />.
          </>
        }
      >
        <KeyRows label="Hero states" rows={HERO_STATES} />
      </Spec>

      <DoDont>
        <Do ground="container" reason="One typed word pulls the eye to the claim while the rest of the line is already readable.">
          <Replay>
            <Headline typed="word" />
          </Replay>
        </Do>
        <Dont ground="container" reason="Typing the whole headline makes the visitor wait about three seconds to read it.">
          <Replay>
            <Headline typed="line" />
          </Replay>
        </Dont>
      </DoDont>
      <DoDont>
        <Do ground="container" reason="The second action ends the lede as a link, so Try now stays the one solid call on the screen.">
          <Actions second="link" />
        </Do>
        <Dont ground="container" reason="Two solid buttons ask the visitor to choose before either has said what it does.">
          <Actions second="button" />
        </Dont>
      </DoDont>
      <Note>
        Both pairs are sketches of the container&apos;s copy column, set on its grey from TypedWord, PrimaryCta and the
        system TextLink at the site&apos;s 32px gap (24 on a phone). The frame under Hero, composed is the reference.
      </Note>
    </Section>
  );
}
