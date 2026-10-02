import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Item } from "@/app/design-system/_kit/Label";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { Badge } from "@/components/design-system/Badge";
import { Chip } from "@/components/design-system/Chip";
import { StatusDot } from "@/components/design-system/StatusDot";
import { Tag, TagList } from "@/components/design-system/Tag";
import {
  BADGE_CODE, BADGE_PINS, BADGE_PROPS, BADGE_TONES, BADGE_VALUES, DOT_CODE, DOT_PINS, DOT_PROPS, DOT_VALUES, JOB_TAGS,
  PANEL_PINS, PROOF_ROWS, TAG_CODE, TAG_PINS, TAG_PROPS, TAG_VALUES, TESTING_TAGS, type ToneRow,
} from "./badge-tag-data";
import { CountOnButtons } from "./badge-tag-live";

const BADGE = { from: "@/components/design-system/Badge", name: "Badge" };
const DOT = { from: "@/components/design-system/StatusDot", name: "StatusDot" };
const TAG = { from: "@/components/design-system/Tag", name: "TagList" };

function ToneItem({ t }: { t: ToneRow }) {
  return (
    <Item label={t.tone}>
      <Badge tone={t.tone}>{t.text}</Badge>
      <span className="mt-2">
        <ContrastBadge fg={t.fg} bg={t.bg} bgName={`the ${t.tone} fill`} />
      </span>
    </Item>
  );
}

function Badges() {
  return (
    <Sub title="Badge">
      <Spec
        title="Anatomy"
        level={4}
        source={BADGE}
        props="tone size dot count"
        role="A status, a live state or a count, set in mono caps so it reads as a label and never as a sentence."
        drawer={{ values: BADGE_VALUES, props: BADGE_PROPS, code: BADGE_CODE }}
      >
        <Anatomy ground="page" pins={BADGE_PINS} label="Badge anatomy">
          <span className="ds-a-badge inline-flex">
            <Badge tone="live">Running</Badge>
          </span>
          <CountOnButtons />
        </Anatomy>
      </Spec>
      <Spec title="Tones and contrast" level={4} source={BADGE} props="tone" role="Each tone graded on its own fill, so a label that falls under 4.5:1 shows it here first.">
        <Canvas ground="page" layout="flow">
          {BADGE_TONES.filter((t) => t.ground === "page").map((t) => (
            <ToneItem key={t.tone} t={t} />
          ))}
        </Canvas>
        <Canvas ground="on-blue" layout="flow" label="On blue">
          {BADGE_TONES.filter((t) => t.ground === "on-blue").map((t) => (
            <ToneItem key={t.tone} t={t} />
          ))}
        </Canvas>
      </Spec>
      <Spec
        title="Sizes"
        level={4}
        source={BADGE}
        props="size dot"
        role="sm sits in card meta and table rows, md beside a heading or on its own, so a label never outweighs what it marks."
      >
        <SizeLadder
          label="Badge sizes"
          sizes={[
            { name: "sm", spec: 18, node: <Badge size="sm" tone="success">Passed</Badge> },
            { name: "sm dot", spec: 18, node: <Badge size="sm" tone="success" dot>Passed</Badge> },
            { name: "md", spec: 22, node: <Badge tone="warning">Flaky</Badge> },
            { name: "md dot", spec: 22, node: <Badge tone="danger" dot>Failed</Badge> },
            { name: "count", spec: 18, node: <Badge count={7} label="7 new" /> },
          ]}
        />
      </Spec>
    </Sub>
  );
}

function Dots() {
  return (
    <Sub title="Status dot">
      <Spec
        title="Tones and motion"
        level={4}
        source={DOT}
        props="tone motion"
        role="The one accent fill a light ground may carry, and the words beside it always say the status."
        drawer={{ values: DOT_VALUES, props: DOT_PROPS, code: DOT_CODE }}
        note="Under reduced motion the ping and the pulse stand still, as the last item does here."
      >
        <Anatomy
          ground="page"
          label="Status dot anatomy"
          pins={DOT_PINS}
        >
          <span className="ds-a-dot inline-flex">
            <StatusDot tone="live" motion="ping" />
          </span>
        </Anatomy>
        <Canvas ground="page" layout="flow">
          <Item label="live · ping 8"><StatusDot tone="live" motion="ping" /></Item>
          <Item label="live · pulse 6"><StatusDot size={6} tone="live" motion="pulse" /></Item>
          <Item label="idle"><StatusDot tone="idle" /></Item>
          <Item label="success"><StatusDot tone="success" /></Item>
          <Item label="danger"><StatusDot tone="danger" /></Item>
          <Item label="reduced motion · none"><StatusDot tone="live" motion="none" /></Item>
        </Canvas>
      </Spec>
      <Spec
        title="Sizes"
        level={4}
        source={DOT}
        props="size"
        role="6 sits inside a badge or a card's meta line, 8 stands alone beside text, as the hero's proof line does."
      >
        <SizeLadder
          label="Status dot sizes"
          sizes={[
            { name: "6", spec: 6, node: <StatusDot size={6} tone="live" /> },
            { name: "8", spec: 8, node: <StatusDot size={8} tone="live" /> },
          ]}
        />
      </Spec>
    </Sub>
  );
}

function Tags() {
  return (
    <Sub title="Tag">
      <Spec
        title="Anatomy"
        level={4}
        source={TAG}
        props="items columns"
        role="What a thing holds or is, in an accent line icon and a label, with no press and no state."
        drawer={{ values: TAG_VALUES, props: TAG_PROPS, code: TAG_CODE }}
      >
        <Anatomy ground="surface" pins={TAG_PINS} label="Tag panel anatomy">
          <div className="ds-a-tags w-[400px] max-w-full">
            <TagList items={TESTING_TAGS} />
          </div>
        </Anatomy>
      </Spec>
      <Spec title="Forms" level={4} source={TAG} props="columns panel variant" role="The panel groups a card's tags, the pill stands alone on a surface, and plain tags run inline in copy.">
        <Canvas ground="surface" layout="grid">
          <Item label="panel · 1 column" align="start">
            <TagList items={JOB_TAGS} columns={1} className="w-full" />
          </Item>
          <Item label="list · no panel" align="start">
            <TagList items={JOB_TAGS} panel={false} />
          </Item>
        </Canvas>
        <Canvas ground="page" layout="flow" label="Pills and plain tags">
          {JOB_TAGS.map((t) => (
            <Tag key={t.label} variant="pill" icon={t.icon}>{t.label}</Tag>
          ))}
          {TESTING_TAGS.slice(0, 2).map((t) => (
            <Tag key={t.label} icon={t.icon}>{t.label}</Tag>
          ))}
        </Canvas>
      </Spec>
      <Spec
        title="Job card tag panel"
        level={4}
        source={{ from: "@/components/website/Jobs", name: "Jobs", at: "max-md:grid-rows-[repeat(4,minmax(20px,auto))]" }}
        role="The job cards' skills list, two columns wide and one on a phone, which the system TagList takes after."
      >
        <Anatomy frame layout="stack" ground="container" pins={PANEL_PINS} label="Job card tag panel anatomy">
          <ViewportPreview part="section-jobs" title="Jobs section, the tag panels" height={180} widths={[375, 1440]} width={1440} scrollTo="#jobs article ul" />
        </Anatomy>
      </Spec>
    </Sub>
  );
}

function Proof() {
  return (
    <Sub title="Social proof">
      <Spec
        title="Live line"
        level={4}
        source={{ from: "@/components/website/Hero", name: "Hero", at: "grid-cols-[8px_1fr] items-center gap-x-2.5" }}
        role="The container hero's quiet proof under Try now: a pinging dot, the count in slate, the invitation in the accent."
        note={
          <>
            It is inline in Hero.tsx, so the guide shows it live in the container hero&apos;s own preview, under{" "}
            <SectionLink id="hero" />, rather than framing a second hero and its floor here.
          </>
        }
      >
        <KeyRows label="The live proof line" rows={PROOF_ROWS} />
      </Spec>
    </Sub>
  );
}

function Rules() {
  return (
    <>
      <DoDont>
        <Do reason="A tag that filters is a Chip, because it presses, shows its state and takes focus.">
          <div role="group" aria-label="Filter tests" className="flex flex-wrap gap-2">
            <Chip selected>{TESTING_TAGS[0].label}</Chip>
            <Chip>{TESTING_TAGS[1].label}</Chip>
          </div>
        </Do>
        <Dont reason="Pills that are meant to filter give no press, no state and no focus, so they read as broken.">
          <div className="flex flex-wrap gap-2">
            <Tag variant="pill">{TESTING_TAGS[0].label}</Tag>
            <Tag variant="pill">{TESTING_TAGS[1].label}</Tag>
          </div>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="Name the status in the badge, so the dot only confirms what the word says.">
          <Badge tone="success" dot>Passed</Badge>
        </Do>
        <Dont reason="A dot alone says nothing to a screen reader and little to the eye.">
          <StatusDot tone="success" />
        </Dont>
      </DoDont>
    </>
  );
}

export function BadgeTagSection() {
  return (
    <Section id="badge-tag" lead="Labels that never take a press: statuses, live dots and descriptive tags.">
      <Badges />
      <Dots />
      <Tags />
      <Proof />
      <Rules />
    </Section>
  );
}
