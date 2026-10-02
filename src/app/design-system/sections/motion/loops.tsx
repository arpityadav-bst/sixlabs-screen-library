// Ambient loops: everything that moves on its own, each on the real part, with the table of how far and how
// often each one runs. The scroll cue plays in its own frame, because it fades once the window has scrolled
// 40px and this page always has. The floating tile is the real FloatingBadges (no WebGL) in a window on its
// first tile, with its bob, flip and drift. The CSS loops stop under reduced motion, as they do on the site.
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { Item } from "@/app/design-system/_kit/Label";
import { Section } from "@/app/design-system/_kit/Section";
import { Spec } from "@/app/design-system/_kit/Spec";
import { SpecTable } from "@/app/design-system/_kit/SpecTable";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { StatusDot } from "@/components/design-system/StatusDot";
import { FloatingBadges } from "@/components/website/FloatingBadges";
import { HeroLoader } from "@/components/website/HeroLoader";
import { LIVE_LOOPS, LOOP_CODE, LOOP_COLUMNS, LOOP_TABLE, LOOP_VALUES, TILE_SPOT, TILE_STAGE } from "./_data/loops";
import styles from "./motion.module.css";

/** The real ScrollCue in its frame, at rest at scroll 0. */
function CueFrame({ title }: { title: string }) {
  return (
    <div className={styles["ds-mo-cueslot"]}>
      <ViewportPreview part="scroll-cue" title={title} height={120} widths={[320]} />
    </div>
  );
}

/** The real FloatingBadges on a 1600 by 1200 stage, shifted so the first tile's spot (whichever one the
 *  window's width picks, as on the site) sits in the middle of a clipping window one tile wide. */
function TileWindow() {
  const stage = {
    width: TILE_STAGE.width,
    height: TILE_STAGE.height,
    "--ds-mo-x": TILE_SPOT.x,
    "--ds-mo-y": TILE_SPOT.y,
    "--ds-mo-mx": TILE_SPOT.mx,
    "--ds-mo-my": TILE_SPOT.my,
    "--ds-mo-ty": TILE_SPOT.ty,
  } as CSSProperties;
  return (
    <div className={styles["ds-mo-tilewin"]}>
      <div className={styles["ds-mo-tilestage"]} style={stage}>
        <FloatingBadges />
      </div>
    </div>
  );
}

export function MotionLoopsSection() {
  return (
    <Section
      id="motion-loops"
      lead="Everything that moves on its own, how far it moves and how often. A loop is ambience: it never carries content and never asks for a look."
    >
      <Spec
        title="Live loops"
        source={{ from: "@/components/website/HeroLoader", name: "HeroLoader" }}
        chips={["scroll-bob", "badge-bob", "logo-arc-*", "StatusDot"]}
        role="Ambient loops travel 8px or less and take 1.5s or longer, so they read as life in the page rather than as a signal."
        caption="frame scroll-cue at 320, 1 frame · the real FloatingBadges in a window on its first tile, no WebGL"
        drawer={{ values: LOOP_VALUES, code: LOOP_CODE }}
      >
        <Canvas ground="container" label="Hero loops">
          <Item label={LIVE_LOOPS.bob}>
            <CueFrame title="Scroll cue, bobbing" />
          </Item>
          <Item label={LIVE_LOOPS.loader}>
            <div className={styles["ds-mo-loaderbox"]}>
              <HeroLoader show />
            </div>
          </Item>
        </Canvas>
        <Canvas ground="page" label="Page loops">
          <Item label={LIVE_LOOPS.badge}>
            <TileWindow />
          </Item>
          <Item label={LIVE_LOOPS.ping}>
            <StatusDot tone="live" motion="ping" />
          </Item>
          <Item label={LIVE_LOOPS.pulse}>
            <StatusDot tone="live" motion="pulse" />
          </Item>
        </Canvas>
      </Spec>

      <Spec
        title="Loop table"
        source={{ from: "@/app/design-system/sections/motion/_data/loops", file: "loops.ts" }}
        role="Each loop states its period, travel and reduced-motion answer, so a new loop is checked against the limits before it ships."
        note={
          <>
            On the site animate-ping and animate-pulse keep running under reduced motion, which <a href="#gaps">Known gaps</a> tracks.
            Ping&apos;s 1s period also sits under the 1.5s floor. StatusDot stops both under reduced motion.
          </>
        }
      >
        <SpecTable caption="Ambient loops" columns={LOOP_COLUMNS} rows={LOOP_TABLE} mono={[0, 2, 6]} minWidth={960} />
      </Spec>

      <DoDont>
        <Do reason="4px every 1.8s says there is more below without pulling the eye off the headline." ground="container">
          <CueFrame title="Scroll cue, 4px every 1.8s" />
        </Do>
        <Dont reason="16px every 0.6s reads as an alert, and the eye keeps going back to it." ground="container">
          <ArrowDown className={styles["ds-mo-fastbob"]} size={16} strokeWidth={1.75} aria-hidden="true" />
        </Dont>
      </DoDont>
    </Section>
  );
}
