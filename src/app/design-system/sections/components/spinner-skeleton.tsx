// Spinner and skeleton: the one ring that replaces the site's two hand-rolled ones, and the placeholder
// shapes, on the grounds they ship on. The reasons live in DESIGN.md 7.21.
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Replay } from "@/app/design-system/_kit/Replay";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { SizeLadder } from "@/app/design-system/_kit/SizeLadder";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Button } from "@/components/design-system/Button";
import { Card } from "@/components/design-system/Card";
import { Skeleton } from "@/components/design-system/Skeleton";
import { Spinner } from "@/components/design-system/Spinner";
import { AvatarSkeleton, JobCardSkeleton, ListRowSkeleton } from "./loading-composites";
import {
  COMPOSITE_PINS,
  SKELETON_CODE,
  SKELETON_PROPS,
  SKELETON_VALUES,
  SPINNER_CODE,
  SPINNER_PINS,
  SPINNER_PROPS,
  SPINNER_SIZES,
  SPINNER_VALUES,
} from "./loading-data";
import { SkeletonSwap } from "./loading-live";

const SPINNER = { from: "@/components/design-system/Spinner", name: "Spinner" };
const SKELETON = { from: "@/components/design-system/Skeleton", name: "Skeleton" };
const TERMINAL_LINE = "reading 2,163 sessions";

function Shapes({ ground }: { ground: "light" | "container" }) {
  return (
    <>
      <Item label="line · lines 3" align="start">
        <Skeleton lines={3} ground={ground} className="w-full" />
      </Item>
      <Item label="title · 60%" align="start">
        <Skeleton shape="title" ground={ground} className="w-full" />
      </Item>
      <Item label="circle · 40">
        <Skeleton shape="circle" ground={ground} />
      </Item>
      <Item label="rect · 120 · radius 16" align="start">
        <Skeleton shape="rect" ground={ground} className="w-full" />
      </Item>
    </>
  );
}

export function LoadingSection() {
  return (
    <Section
      id="loading"
      lead="One ring for short waits and grey shapes in the size of the content on its way, so every wait on the site reads the same."
    >
      <Sub title="Spinner">
        <Spec
          level={4}
          title="Spinner"
          source={SPINNER}
          props="size tone delay decorative"
          role="The ring takes the colour of the text beside it, so one part serves every ground with no variant per surface."
          drawer={{ values: SPINNER_VALUES, props: SPINNER_PROPS, code: SPINNER_CODE }}
          note={
            <>
              The page-level wait is the brand loader, HeroLoader, shown in{" "}
              <SectionLink id="floor-lifecycle" />.
            </>
          }
        >
          <Anatomy pins={SPINNER_PINS} ground="page" label="Spinner anatomy">
            <span data-pin="alone" className="inline-flex text-(--ds-color-ink)">
              <Spinner delay={0} />
            </span>
            <span data-pin="busy" className="inline-flex">
              <Button loading>Try now</Button>
            </span>
          </Anatomy>
        </Spec>
        <Spec
          level={4}
          title="Sizes"
          source={SPINNER}
          props="size"
          role="Each step pairs with the text and control size it sits beside, from inline terminal lines to a section."
        >
          <SizeLadder
            label="Spinner sizes"
            sizes={SPINNER_SIZES.map((s) => ({
              name: `${s.size} · border ${s.border}`,
              spec: s.size,
              node: <Spinner size={s.size} delay={0} />,
              select: ".animate-spin",
            }))}
          />
        </Spec>
        <Spec
          level={4}
          title="Tones"
          source={SPINNER}
          props="tone"
          role="Quiet sits under captions on light grounds, and on dark lifts the ring to near white on navy and the terminal."
        >
          <Canvas ground="page" label="Spinner tones on the page">
            <Item label="inherit · ink">
              <span className="inline-flex text-(--ds-color-ink)">
                <Spinner delay={0} />
              </span>
            </Item>
            <Item label="quiet">
              <Spinner tone="quiet" delay={0} />
            </Item>
          </Canvas>
          <Canvas ground="navy" label="Spinner on navy">
            <Item label="onDark · navy">
              <Spinner tone="onDark" size={20} delay={0} />
            </Item>
          </Canvas>
          <Canvas ground="terminal" label="Spinner on the terminal">
            <Item label="onDark · 8 · inline">
              <span className="inline-flex items-center gap-2 font-(family-name:--ds-font-mono) text-[12px] text-(--ds-color-on-blue-80)">
                <Spinner tone="onDark" size={8} delay={0} />
                {TERMINAL_LINE}
              </span>
            </Item>
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Delay"
          source={SPINNER}
          props="delay"
          role="It waits a beat before it shows, so a load that finishes quickly never flashes a ring at the visitor."
        >
          <Canvas ground="page" label="Spinner delay">
            <Replay>
              <Item label="delay 300">
                <Spinner size={20} />
              </Item>
              <Item label="delay 0">
                <Spinner size={20} delay={0} />
              </Item>
            </Replay>
          </Canvas>
        </Spec>
      </Sub>
      <Sub title="Skeleton">
        <Spec
          level={4}
          title="Shapes"
          source={SKELETON}
          props="shape lines ground"
          role="Each shape holds the size of what it stands for, so the layout is set before the content arrives."
          drawer={{ values: SKELETON_VALUES, props: SKELETON_PROPS, code: SKELETON_CODE }}
        >
          <Canvas ground="surface" layout="grid" label="Skeleton shapes on white">
            <Shapes ground="light" />
          </Canvas>
          <Canvas ground="container" layout="grid" label="Skeleton shapes on the container">
            <Shapes ground="container" />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Composites"
          source={SKELETON}
          role="A composite copies the real part's layout line for line, here the job card, a list row and an avatar with two lines."
        >
          <Anatomy pins={COMPOSITE_PINS} ground="page" label="Job card skeleton anatomy">
            <JobCardSkeleton />
          </Anatomy>
          <Canvas ground="page" layout="grid" label="Row and avatar skeletons">
            <Item label="list row" align="start">
              <ListRowSkeleton />
            </Item>
            <Item label="avatar and two lines" align="start">
              <AvatarSkeleton />
            </Item>
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="Swap to content"
          source={SKELETON}
          role="Skeleton and content share one cell and crossfade, so turning to the real job moves nothing around it."
        >
          <Canvas ground="page" label="Skeleton to content swap">
            <SkeletonSwap />
          </Canvas>
        </Spec>
      </Sub>
      <DoDont>
        <Do reason="Shapes in the card's own layout hold its place, so nothing jumps when the job lands." ground="page">
          <JobCardSkeleton terminal={96} />
        </Do>
        <Dont reason="A lone ring in an empty card says nothing about what is coming, and the card resizes when it lands.">
          <Card tone="surface" size="feature" className="w-[340px] max-w-full">
            <span className="grid h-24 place-items-center">
              <Spinner size={24} delay={0} />
            </span>
          </Card>
        </Dont>
      </DoDont>
      <DoDont>
        <Do reason="The ring takes the label's place inside the busy button, so the button keeps its width and its one signal." ground="page">
          <Button loading>Try now</Button>
        </Do>
        <Dont reason="A second ring beside the button splits one wait into two signals and pushes the row sideways.">
          <span className="inline-flex items-center gap-3">
            <Button>Try now</Button>
            <Spinner delay={0} />
          </span>
        </Dont>
      </DoDont>
    </Section>
  );
}
