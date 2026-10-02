// Surfaces and the accent rule: the six grounds a section may stand on, the container look as a recipe (the
// box drawn from the tokens, the hero's own type and parts in it, the shipped hero itself framed under Hero),
// and where the accent may appear. The reasons live in DESIGN.md 9.1.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SectionHead } from "@/components/design-system/SectionHead";
import { typeStyle } from "@/components/design-system/tokens";
import { HeroNumbers } from "@/components/website/HeroBits";
import { PrimaryCta } from "@/components/website/PrimaryCta";
import { TypedWord } from "@/components/website/TypedWord";
import { COPIES_BASE, heroStats } from "../components/stats-typed-data";
import { HERO_LEDE } from "@/app/design-system/_data/specimens";
import { HEADLINE } from "./hero-data";
import { ACCENT_PLACES, CONTAINER_PINS, HEADS, RECIPE_VALUES, SURFACES, SURFACES_CODE, SURFACE_VALUES, type Surface } from "./surfaces-data";
import s from "./surfaces.module.css";

const HERO = { from: "@/components/website/Hero", name: "Hero", at: "h-[664px] max-md:h-[720px]" };

function TileText({ t }: { t: Surface }) {
  return (
    <>
      <div>
        <p className={s["ds-sf-name"]}>{t.name}</p>
        <p className={s["ds-sf-value"]}>{t.value}</p>
      </div>
      <p className={s["ds-sf-where"]}>{t.where}</p>
    </>
  );
}

function Catalogue() {
  return (
    <div className={s["ds-sf-grid"]}>
      {SURFACES.map((t) =>
        t.kind === "accent" ? (
          <Canvas key={t.kind} ground="on-blue" label={t.name} className={s["ds-sf-tile"]}>
            <TileText t={t} />
          </Canvas>
        ) : (
          <div key={t.kind} data-kind={t.kind} className={s["ds-sf-tile"]}>
            <TileText t={t} />
          </div>
        ),
      )}
    </div>
  );
}

function Head({ which, whole = false }: { which: keyof typeof HEADS; whole?: boolean }) {
  const h = HEADS[which];
  return whole ? (
    <SectionHead ground="container" title="" accent={`${h.title} ${h.accent}`} />
  ) : (
    <SectionHead ground="container" title={h.title} accent={h.accent} />
  );
}

export function SurfacesSection() {
  return (
    <Section
      id="surfaces"
      lead="Six grounds carry the whole site. The accent fills only one of them, the players' water, and everywhere else it is a word, an icon, a dot or a ring."
    >
      <Spec
        title="Surface catalogue"
        source={HERO}
        chips={["--ds-color-page", "--ds-color-container", "--ds-color-accent"]}
        role="Each section picks one ground and keeps it, so a change of ground reads as a change of section."
        caption="tiles drawn from the --ds-* tokens · the accent tile is the players' grained ground"
        drawer={{ values: SURFACE_VALUES }}
      >
        <Canvas ground="page" label="Surface catalogue">
          <Catalogue />
        </Canvas>
      </Spec>

      <Spec
        title="The container look"
        source={HERO}
        role="Grey, rounded, a hairline and navy type, with the accent left to one word, is the look a set piece outside the players borrows."
        caption="a recipe, not the shipped hero (framed under Hero): the box from the tokens, the hero's headline and lede type, TypedWord, PrimaryCta and HeroNumbers real, the numbers under the box · Replay types the word again"
        drawer={{ values: RECIPE_VALUES, code: SURFACES_CODE }}
      >
        <Anatomy ground="page" layout="stack" pins={CONTAINER_PINS} label="Container look anatomy">
          <Replay>
            <div className={s["ds-sf-recipe"]}>
              <div data-pin="box" className={s["ds-sf-box"]}>
                <p data-pin="headline" className="text-(--ds-color-ink)" style={typeStyle("hero")}>
                  {HEADLINE.before} <TypedWord word={HEADLINE.word} className="text-accent" /> {HEADLINE.after}
                  <br />
                  {HEADLINE.line2}
                </p>
                <p data-pin="lede" className={s["ds-sf-lede"]} style={typeStyle("lede")}>
                  {HERO_LEDE}
                </p>
                <div data-pin="cta" className={s["ds-sf-cta"]}>
                  <PrimaryCta>Try now</PrimaryCta>
                </div>
              </div>
              <div data-pin="numbers" className={s["ds-sf-numbers"]}>
                <HeroNumbers stats={heroStats(COPIES_BASE)} ready left={false} />
              </div>
            </div>
          </Replay>
        </Anatomy>
      </Spec>

      <Spec
        title="Where the accent may appear"
        source={{ from: "@/components/website/AccentWave", name: "AccentWave", at: "const gpu = accentWaveGL(" }}
        role="Outside the water the accent marks what to look at, so it stays small enough to keep that meaning."
      >
        <KeyRows label="Accent placements" rows={ACCENT_PLACES} />
      </Spec>

      <DoDont>
        <Do reason="The grey and the navy carry the section, so the accent word is the one thing that calls.">
          <div className={`${s["ds-sf-box"]} ${s["ds-sf-box--small"]}`}>
            <Head which="jobs" />
          </div>
        </Do>
        <Dont reason="A second accent fill reads as the water arriving early, and the accent word in it disappears.">
          <div className={s["ds-sf-flood"]}>
            <Head which="jobs" />
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The accent on the closing word lands the line where the eye finishes reading it.">
          <div className={`${s["ds-sf-box"]} ${s["ds-sf-box--small"]}`}>
            <Head which="faq" />
          </div>
        </Do>
        <Dont reason="A whole line in the accent has nothing left to point at, so it reads as a link.">
          <div className={`${s["ds-sf-box"]} ${s["ds-sf-box--small"]}`}>
            <Head which="faq" whole />
          </div>
        </Dont>
      </DoDont>
    </Section>
  );
}
