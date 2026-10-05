// Light sections: the four sections after the players, on the grained light page. Jobs is framed at true
// widths, the closing is mounted once here (it renders #get-access) inside a click hold, and Understands and
// the FAQ point at their own specimens rather than mounting twice. The reasons live in DESIGN.md 9.4.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { SectionHead } from "@/components/design-system/SectionHead";
import { Closing } from "@/components/website/Closing";
import { ClickHold } from "./click-hold";
import { CLOSING_CODE, CLOSING_PINS, JOBS_PINS, JOBS_WIDTHS, LIGHT_BOM, LIGHT_HEADS, LIGHT_VALUES } from "./light-sections-data";
import { RhythmMap } from "./light-sections-rhythm";
import { Bom } from "./pattern-parts";
import s from "./light-sections.module.css";

const JOBS = { from: "@/components/website/Jobs", name: "Jobs", at: "<section" };
const CLOSING = { from: "@/components/website/Closing", name: "Closing" };

function Heads({ shift }: { shift: boolean }) {
  const j = LIGHT_HEADS.jobs;
  const f = LIGHT_HEADS.faq;
  return (
    <div className={s["ds-ls-heads"]}>
      <SectionHead title={j.title} accent={j.accent} sub={j.sub} />
      <SectionHead title={f.title} accent={f.accent} align={shift ? "center" : "start"} />
    </div>
  );
}

export function LightSectionsSection() {
  return (
    <Section
      id="light-sections"
      lead="Four sections on the grained page after the players: the comparison, the three jobs, the questions and the closing call. They share one container, one inner gutter and one kind of head."
    >
      <Spec
        title="Jobs across widths"
        source={JOBS}
        role="Three across from xl, a swipe row with a switch below it, so a phone always shows one job whole."
        caption="frame section-jobs on the grain · the switch hides from xl"
        note={
          <>
            Understands is mounted under <SectionLink id="comparison" /> and the FAQ under <SectionLink id="accordion" />,
            each once on this page.
          </>
        }
      >
        <Anatomy frame layout="stack" ground="grain" pins={JOBS_PINS} label="Jobs section anatomy">
          <ViewportPreview part="section-jobs" title="Jobs section" height={900} widths={JOBS_WIDTHS} width={1440} />
        </Anatomy>
      </Spec>

      <Spec
        title="Closing call"
        source={CLOSING}
        role="The page ends where it began, on Try now, with the promise as large as the hero's and the reason in one line."
        caption="direct mount on the grain, section padding cropped, its links held as the site pages hold them · Replay types the line again"
        drawer={{ values: LIGHT_VALUES.filter((v) => v.part.startsWith("Closing")), code: CLOSING_CODE }}
      >
        <Anatomy ground="grain" layout="stack" pins={CLOSING_PINS} label="Closing anatomy">
          <Replay>
            <ClickHold className={s["ds-ls-crop"]}>
              <Closing />
            </ClickHold>
          </Replay>
        </Anatomy>
      </Spec>

      <Spec
        title="Rhythm"
        source={JOBS}
        role="Every padding is a clamp on the window's width, so the gaps between sections grow with the screen instead of stepping."
        caption="from md · drawn at half size, live at this window's width"
        drawer={{ values: LIGHT_VALUES }}
      >
        <RhythmMap />
      </Spec>

      <Spec
        title="Bill of materials"
        source={JOBS}
        role="The light sections are built from parts specced elsewhere, so a new section reuses them rather than drawing its own."
      >
        <Bom items={LIGHT_BOM} label="Light section parts" />
      </Spec>

      <DoDont>
        <Do ground="grain" reason="Each head starts on the container's edge, so the eye runs down one line from section to section.">
          <Heads shift={false} />
        </Do>
        <Dont ground="grain" reason="A head that leaves the edge reads as a new page rather than the next section of this one.">
          <Heads shift />
        </Dont>
      </DoDont>
    </Section>
  );
}
