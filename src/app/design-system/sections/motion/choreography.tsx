// Choreography: the long, staged sequences drawn on their clocks. The two hero intros run from the
// moment the floor is ready, the scroll line is laid out in screens, the glide is plotted and run, the
// players run from their reveal, and the terminal's lanes are built from a real job's run.
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { EaseDemo } from "@/app/design-system/_kit/EaseDemo";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Section, SectionLink, Sub } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { Timeline } from "@/app/design-system/_kit/Timeline";
import { GlidePlot } from "./glide-plot";
import { ScrollTrack } from "./scroll-track";
import {
  CONTAINER_LANES,
  CONTAINER_ROWS,
  FULL_LANES,
  FULL_ROWS,
  CONTAINER_VALUES,
  FULL_VALUES,
  GLIDE_VALUES,
  PLAYERS_CLOCK,
  PLAYERS_CLOCK_ROWS,
  TERMINAL_JOB,
  TERMINAL_VALUES,
  TRACK_VALUES,
  glideSeconds,
  terminalLanes,
} from "./_data/choreography";

const TERMINAL = terminalLanes(TERMINAL_JOB);

export function MotionChoreographySection() {
  return (
    <Section
      id="motion-choreography"
      lead="The staged sequences, each on its own clock: the two hero intros, the scroll line's track, the players and the terminal run, with the shell's glide drawn beside them."
    >
      <Sub title="Hero intros">
        <Spec
          level={4}
          title="Container hero"
          source={{ from: "@/components/website/hero-intro", name: "useHeroIntro", file: "hero-intro.ts" }}
          role="Each part waits for the one it sits on, so nothing lands on a floor that is still loading."
          drawer={{ values: CONTAINER_VALUES }}
        >
          <Timeline label="Container hero, seconds after the floor is ready" axisLabel="after ready" lanes={CONTAINER_LANES} />
          <KeyRows label="Container hero clock" rows={CONTAINER_ROWS} />
        </Spec>
        <Spec
          level={4}
          title="Full view"
          source={{ from: "@/components/website/hero-intro", name: "HERO_LOADED", file: "hero-intro.ts" }}
          chips={["heroloaded"]}
          role="The page holds still behind the loader, so the first thing a visitor scrolls past is the finished hero, not a half-built one."
          drawer={{ values: FULL_VALUES }}
        >
          <Timeline label="Full view, seconds after the floor is ready" axisLabel="after ready" lanes={FULL_LANES} />
          <KeyRows label="Full view clock" rows={FULL_ROWS} />
        </Spec>
      </Sub>

      <Sub title="Scroll and glide">
        <Spec
          level={4}
          title="Scroll line track"
          source={{ from: "@/components/website/ScrubLine", name: "ScrubLine", at: "COMPLETE_AT = " }}
          chips={["accentwave"]}
          role="The scroll drives every stage of the set-piece, so the visitor sets its pace and scrolling back plays it in reverse."
          drawer={{ values: TRACK_VALUES }}
        >
          <Canvas ground="page" layout="stack" label="The scroll line's track in screens">
            <ScrollTrack />
          </Canvas>
        </Spec>
        <Spec
          level={4}
          title="In-page glide"
          source={{ from: "@/components/website/glide", name: "glideTo", file: "glide.ts" }}
          role="A longer jump takes longer, up to 2.2s, so the visitor can follow where the page went."
          drawer={{ values: GLIDE_VALUES }}
        >
          <Canvas ground="page" layout="grid">
            <EaseDemo label="Glide, 2000px" ease="glide" duration={glideSeconds(2000)} caption={`easeOut · ${glideSeconds(2000)}s at 2000px`} />
            <GlidePlot />
          </Canvas>
        </Spec>
      </Sub>

      <Sub title="Players">
        <Spec
          level={4}
          title="Players clock"
          source={{ from: "@/components/website/usePlayerMode", name: "usePlayerMode", file: "usePlayerMode.ts", at: "const AUTO_S = " }}
          chips={["accentwave"]}
          role="The hand, the flip and the copy share one clock, so the AI only ever copies a stroke the hand has finished."
          note={
            <>
              The drawing itself plays under <SectionLink id="doodles" />.
            </>
          }
        >
          <Timeline label="Players, seconds after the reveal" axisLabel="after reveal" lanes={PLAYERS_CLOCK} />
          <KeyRows label="Players clock" rows={PLAYERS_CLOCK_ROWS} />
        </Spec>
      </Sub>

      <Sub title="Terminal run">
        <Spec
          level={4}
          title="Job terminal run"
          source={{ from: "@/components/website/JobTerminal", name: "JobTerminal", at: "const TYPE_MS = " }}
          props="play"
          role="Steps land one at a time at a reading pace, so the run reads as an agent working rather than a page appearing."
          drawer={{ values: TERMINAL_VALUES }}
          note={
            <>
              The lanes are built from the intelligence job&apos;s run in jobs-data.ts. The live terminal plays under <SectionLink id="terminal" />.
            </>
          }
        >
          <Timeline label="Intelligence job run, milliseconds from play" unit="ms" axisLabel="from play" lanes={TERMINAL} minWidth={720} />
        </Spec>
      </Sub>

      <DoDont>
        <Do reason="0.9s plus a second for every 4000px: the eye can follow the page to where it lands." ground="page">
          <EaseDemo label="Glide, 4000px" ease="glide" duration={glideSeconds(4000)} />
        </Do>
        <Dont reason="A fixed 0.3s over thousands of pixels reads as a cut, and the visitor loses where the page went." ground="page">
          <EaseDemo label="Fixed 0.3s" ease="glide" duration={0.3} />
        </Dont>
      </DoDont>
    </Section>
  );
}
