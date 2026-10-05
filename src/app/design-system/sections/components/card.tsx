import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { frameHref } from "@/app/design-system/frame/_parts/ids";
import { Card } from "@/components/design-system/Card";
import { CardBody, CardMeta, CardTitle } from "@/components/design-system/CardParts";
import { Tag, TagList } from "@/components/design-system/Tag";
import { JOBS } from "@/components/website/jobs-data";
import { PLAYERS } from "@/components/website/players-data";
import { CARD_CODE, CARD_PINS, CARD_PROPS, CARD_SIZES, CARD_VALUES, JOB_PINS, JOB_VALUES, SELECTOR_PINS, SELECTOR_VALUES } from "./card-data";
import { CardChoices, CardSnapRow, LiveSelectable } from "./card-live";
import { CardOnBlueStateGrid, CardStateGrid, CardToneStateGrid } from "./card-states";
import { JOB_TAGS } from "./badge-tag-data";

const SYS = { from: "@/components/design-system/Card", name: "Card" };
const job = JOBS[0];
const player = PLAYERS[0];

function JobBody() {
  return (
    <>
      <CardTitle>{job.title}</CardTitle>
      <CardBody>{job.body}</CardBody>
    </>
  );
}

function SiteCards() {
  return (
    <Sub
      title="Job and selector cards"
      lead={
        <>
          The two cards the site ships, measured in their own frames. The comparison pair has its own section,{" "}
          <SectionLink id="comparison" />, below.
        </>
      }
    >
      <Spec
        title="Job card"
        level={4}
        source={{ from: "@/components/website/Jobs", name: "Jobs", at: "sheen relative flex flex-col rounded-[28px]" }}
        role="The feature card: one job, its terminal and its tags, with the pointer's light running along the stroke."
        drawer={{ values: JOB_VALUES }}
      >
        <Anatomy frame layout="stack" ground="container" pins={JOB_PINS} label="Job card anatomy">
          <ViewportPreview part="section-jobs" title="Jobs section, the job cards" height={860} widths={[375, 768, 1440]} width={1440} scrollTo="#jobs" />
        </Anatomy>
      </Spec>
      <Spec
        title="Player selector card"
        level={4}
        source={{ from: "@/components/website/Players", name: "Players", at: "relative flex min-h-[176px] flex-col" }}
        role="The picker on the accent water, where the picked card lifts and runs and the others hold back."
        caption="the players frame at 1440 by 900 with the portrait as its still, cropped to the card row"
        drawer={{ values: SELECTOR_VALUES }}
        note="It is inline in Players.tsx and shows from lg only. Below lg the carousel takes its place."
      >
        <Anatomy frame layout="stack" ground="container" pins={SELECTOR_PINS} label="Selector card anatomy">
          {/* clips=still: the portrait stands as its still, so the crop boots no WebGL and fetches no clips */}
          <ViewportPreview
            src={frameHref("players", "clips=still")}
            title="Players section, the selector cards"
            height={900}
            widths={[1440]}
            scrollTo=".grid-cols-4"
            crop={{ x: 0, y: 0, width: 1440, height: 260 }}
          />
        </Anatomy>
      </Spec>
    </Sub>
  );
}

function System() {
  return (
    <Sub title="Card" lead="The system card, built from the job card's type and the selector card's footer.">
      <Spec
        title="Anatomy"
        level={4}
        source={SYS}
        props="variant tone size"
        role="One part for every card: surface, title, body, meta and the check that marks a pick."
        drawer={{ values: CARD_VALUES, props: CARD_PROPS, code: CARD_CODE }}
      >
        <Anatomy ground="page" pins={CARD_PINS} label="Card anatomy">
          <div className="w-[300px]">
            <Card variant="selectable" selected className="ds-a-card">
              <CardTitle className="ds-a-title">{player.title}</CardTitle>
              <CardBody className="ds-a-body">{player.tagline}</CardBody>
              <CardMeta className="ds-a-meta" start="Model 01" end="Running" />
            </Card>
          </div>
        </Anatomy>
      </Spec>

      <Spec title="What it does" level={4} source={SYS} props="variant" role="Static informs, clickable goes somewhere, selectable picks, and each is a single interactive element.">
        <Canvas ground="page" layout="grid">
          <Item label="static · article" align="start">
            <Card>
              <JobBody />
              <TagList items={JOB_TAGS} className="mt-6" />
            </Card>
          </Item>
          <Item label="clickable · a with href" align="start">
            <Card variant="clickable" href="#card">
              <JobBody />
              <CardMeta start={`${job.tags.length} tags`} end="Open" />
            </Card>
          </Item>
          <Item label="selectable · button, aria-pressed" align="start">
            <LiveSelectable />
          </Item>
        </Canvas>
      </Spec>

      <Spec
        title="Picking"
        level={4}
        source={SYS}
        props="selected onToggle"
        role="Single and multiple picks are both pressed buttons, so a keyboard reaches each card in turn."
        caption="single · one pressed at a time  ·  multiple · each pressed on its own"
      >
        <Canvas ground="page" layout="stack" label="Single pick">
          <CardChoices />
        </Canvas>
        <Canvas ground="page" layout="stack" label="Multiple pick">
          <CardChoices multiple />
        </Canvas>
      </Spec>

      <Spec
        title="Where it sits"
        level={4}
        source={SYS}
        props="tone"
        role="The tone follows the ground: white on the page, the hero container's grey, navy for the one strong card, white on the water."
      >
        <Canvas ground="page" layout="grid">
          <Item label="container · the hero container's grey" align="start">
            <Card tone="container">
              <JobBody />
            </Card>
          </Item>
          <Item label="inverse · primary navy" align="start">
            <Card tone="inverse" variant="clickable">
              <JobBody />
              <CardMeta start={`${job.tags.length} tags`} end="Open" />
            </Card>
          </Item>
        </Canvas>
        <Canvas ground="on-blue" layout="stack" label="On blue">
          <CardChoices tone="onBlue" />
        </Canvas>
      </Spec>
    </Sub>
  );
}

function States() {
  return (
    <Sub title="States and sizes">
      <Spec title="States" level={4} source={SYS} props="forceState selected" role="Every state forced on the page ground, with a live card to hover, press and Tab into. A picked card holds its look under hover on purpose, since the pick already answers the pointer.">
        <CardStateGrid />
      </Spec>
      <Spec
        title="States on the other grounds"
        level={4}
        source={SYS}
        props="tone forceState"
        role="Each tone keeps the page's states on its own ground, so a pick or a ring reads the same on grey and on navy."
        caption="container on the container ground · inverse on the page"
      >
        <CardToneStateGrid tone="container" />
        <CardToneStateGrid tone="inverse" />
      </Spec>
      <Spec title="States on the water" level={4} source={SYS} props="tone forceState" role="On the water an unpicked card dims its surface, and the pick is navy, never the accent.">
        <CardOnBlueStateGrid />
      </Spec>
      <Spec title="Sizes" level={4} source={SYS} props="size" role="Feature for a section's cards, compact for pickers and grids, row for lists.">
        <Canvas ground="page" layout="flow">
          {CARD_SIZES.map((s) => (
            <Item key={s.size} label={s.caption}>
              <div className={s.size === "row" ? "w-[300px]" : "w-[260px]"}>
                {s.size === "row" ? (
                  <Card size="row" variant="clickable">
                    <Tag icon={JOB_TAGS[0].icon}>{JOB_TAGS[0].label}</Tag>
                  </Card>
                ) : (
                  <Card size={s.size}>
                    <JobBody />
                  </Card>
                )}
              </div>
            </Item>
          ))}
        </Canvas>
      </Spec>
      <Spec title="In a snap row" level={4} source={SYS} props="inset" role="In a scroll row the ring draws inside the card, so the row's clip never cuts it.">
        <Canvas ground="page" layout="flow" isolateKeys>
          <CardSnapRow />
        </Canvas>
      </Spec>
      <Spec
        title="Sheen"
        level={4}
        source={SYS}
        props="sheen"
        role="The pointer's light along the stroke, drawn from background layers so the page keeps the compositor's fast path."
        note="The system sheen has no 7px bloom, because the bloom needs a CSS filter."
      >
        <Canvas ground="page" layout="flow">
          <div className="w-[320px]">
            <Card sheen>
              <JobBody />
              <TagList items={JOB_TAGS} className="mt-6" />
            </Card>
          </div>
        </Canvas>
      </Spec>
    </Sub>
  );
}

function Rules() {
  const p = PLAYERS[2];
  return (
    <DoDont>
      <Do ground="on-blue" reason="Dim the surface and set the text in ink at 70%, so the unpicked tagline holds 4.8:1.">
        <div className="w-[240px]">
          <Card variant="selectable" tone="onBlue" size="compact">
            <CardTitle>{p.title}</CardTitle>
            <CardBody>{p.tagline}</CardBody>
          </Card>
        </div>
      </Do>
      <Dont ground="on-blue" reason="Fading the whole card to 0.6 takes the slate tagline to 2.75:1, well under the 4.5:1 body text needs.">
        <div className="w-[240px]" style={{ opacity: 0.6 }}>
          <Card variant="selectable" size="compact">
            <CardTitle>{p.title}</CardTitle>
            <CardBody>{p.tagline}</CardBody>
          </Card>
        </div>
      </Dont>
    </DoDont>
  );
}

export function CardSection() {
  return (
    <Section id="card" lead="One card part with every state, beside the cards on the site.">
      <SiteCards />
      <System />
      <States />
      <Rules />
    </Section>
  );
}
