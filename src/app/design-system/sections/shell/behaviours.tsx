import { Canvas } from "@/app/design-system/_kit/Canvas";
import { EaseDemo } from "@/app/design-system/_kit/EaseDemo";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import * as D from "./behaviours-data";

const W = "@/components/website/";

export function BehavioursSection() {
  return (
    <Section
      id="behaviours"
      lead="The parts of the shell nobody sees: the lock on links and calls to action, the slow glide every in-page link takes, and the window events and ids the parts talk through."
    >
      <Spec
        title="Click lock"
        source={{ from: `${W}ClickLock`, name: "ClickLock", line: 13 }}
        role="During the scrolled walkthrough every link and call to action keeps its hover but does nothing, while the page's own controls still work."
        warn="Never mount ClickLock in the guide document: it is document-wide and would lock the guide's own links. Only the shell's frames mount it."
        drawer={{ values: D.LOCK_VALUES, code: D.LOCK_CODE }}
      >
        <SpecTable caption="What ClickLock stops" columns={D.LOCK_COLUMNS} rows={D.LOCK_ROWS} mono={[2]} minWidth={640} />
      </Spec>

      <Spec
        title="The glide"
        source={{ from: `${W}glide`, name: "glideTo", file: "glide.ts", line: 38 }}
        chips={["jumpTo", "linkTo"]}
        role="In-page links glide to where a section rests rather than to its raw top, in one slow run that is always seen whole."
        drawer={{ values: D.GLIDE_VALUES, code: D.GLIDE_CODE }}
      >
        <Canvas ground="page" layout="grid" label="The glide's curve, short and long">
          <EaseDemo label="short run" ease="glide" duration={0.9} />
          <EaseDemo label="long run" ease="glide" duration={2.2} />
        </Canvas>
        <SpecTable caption="Where each link rests" columns={D.SPOT_COLUMNS} rows={D.SPOT_ROWS} mono={[0, 1, 2]} minWidth={720} />
      </Spec>

      <Spec
        title="Window contracts"
        source={{ from: `${W}hero-intro`, name: "HERO_LOADED", file: "hero-intro.ts", line: 13 }}
        role="The shell's parts never import each other's state. They meet on window events, scroll thresholds and a few ids."
        note="Each id is a string written in several files with no shared constant, so renaming one breaks the parts that look it up."
      >
        <KeyRows label="Window events, thresholds and ids" rows={D.WINDOW_CONTRACTS} />
      </Spec>

      <Spec
        title="Safari scroll"
        source={{ from: `${W}SafariScroll`, name: "SafariScroll", line: 19 }}
        role="Desktop Safari scrolls on Lenis, in step with the page's drawing, and keeps the players' magnet as its own."
      >
        <KeyRows label="Safari scroll" rows={D.SAFARI_ROWS} />
      </Spec>
    </Section>
  );
}
