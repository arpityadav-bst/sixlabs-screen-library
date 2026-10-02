import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Metrics } from "@/app/design-system/_kit/Metrics";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { SectionHead } from "@/components/design-system/SectionHead";
import { TypedWord } from "@/components/website/TypedWord";
import { CLOSING_HEAD, EYEBROW, FAQ_HEAD, HEAD_CODE, HEAD_PINS, HEAD_PROPS, HEAD_VALUES, JOBS_HEAD } from "./section-head-data";

const SRC = { from: "@/components/design-system/SectionHead", name: "SectionHead" };

export function SectionHeadSection() {
  return (
    <Section
      id="section-head"
      lead={
        <>
          The light page&apos;s heading as one part, the accent on its closing words. Its instances on the site live
          in <SectionLink id="light-sections" />.
        </>
      }
    >
      <Spec
        title="Anatomy"
        source={SRC}
        props="title accent sub eyebrow"
        role="A navy line whose last word or two carry the accent, so the stress lands where the sentence ends."
        drawer={{ values: HEAD_VALUES, props: HEAD_PROPS, code: HEAD_CODE }}
      >
        <Anatomy ground="grain" layout="stack" pins={HEAD_PINS} label="Section head anatomy">
          <div className="ds-a-head">
            <SectionHead eyebrow={EYEBROW} title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} sub={JOBS_HEAD.sub} />
          </div>
        </Anatomy>
      </Spec>

      <Spec title="Forms" source={SRC} props="sub align eyebrow ground" role="With a subline, title only, centred with an eyebrow, and on the container grey where the subline steps darker.">
        <Canvas ground="page" layout="grid">
          <Item label="title only" align="start">
            <SectionHead title={FAQ_HEAD.title} accent={FAQ_HEAD.accent} />
          </Item>
          <Item label="centred · eyebrow" align="start">
            <SectionHead eyebrow={EYEBROW} title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} sub={JOBS_HEAD.sub} align="center" className="w-full" />
          </Item>
        </Canvas>
        <Canvas ground="container" layout="stack" label="On the container grey">
          <SectionHead title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} sub={JOBS_HEAD.sub} ground="container" as="h3" />
        </Canvas>
      </Spec>

      <Spec title="Sizes" source={SRC} props="size" role="The h2 heads a section, and the display size is kept for the closing line, once a page.">
        <Canvas ground="page" layout="stack">
          <Metrics select="h2">
            <SectionHead title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} />
          </Metrics>
          <Metrics select="h2">
            <SectionHead
              size="display"
              accentBreak
              title={CLOSING_HEAD.title}
              accent={<TypedWord word={CLOSING_HEAD.accent} className="text-accent" onView />}
            />
          </Metrics>
        </Canvas>
      </Spec>

      <Spec title="Rise" source={SRC} props="rise" role="The Jobs head's own entrance, given to every head and run again with Replay.">
        <Canvas ground="page" layout="stack">
          <Replay>
            <SectionHead title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} sub={JOBS_HEAD.sub} rise />
          </Replay>
        </Canvas>
      </Spec>

      <Spec
        title="Across widths"
        source={SRC}
        role="A head grows with the window it opens, so its weight against the column stays the same from a phone up."
        caption="h2 30, 44 from md · display clamp(38px, 5.2vw, 74px) · 375 · 768 · 1280 · 1440"
      >
        <Canvas ground="container" layout="stack">
          <ViewportPreview part="section-head" title="Section heads at true widths" height={460} widths={[375, 768, 1280, 1440]} width={1280} fitHeight />
        </Canvas>
      </Spec>

      <DoDont>
        <Do reason="Give the accent to the closing word or two, so the navy before it sets the stress off.">
          <SectionHead title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} />
        </Do>
        <Dont reason="An accent line has nothing left in navy to set it off, and the stress is lost.">
          <SectionHead title="" accent={`${JOBS_HEAD.title} ${JOBS_HEAD.accent}`} />
        </Dont>
      </DoDont>
    </Section>
  );
}
