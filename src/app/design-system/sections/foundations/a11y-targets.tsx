"use client";

// The target specimens, measured where each part ships. System parts at the low end of their ladders on
// the page, then the site's controls under the touch size: the players' arrows and carousel dots on the
// blue (sharing one active player, as on the site) and the bare wave button on the hero's container. Their
// verdicts print under the canvases (after the menu button that follows them), where 12px clears 4.5:1.
import { ArrowUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { Chip } from "@/components/design-system/Chip";
import { IconButton } from "@/components/design-system/IconButton";
import { WaveButton } from "@/components/website/HeroBits";
import { PlayerArrows, PlayerCarousel } from "@/components/website/PlayerCarousel";
import { TargetLines, TargetMeter } from "./a11y-target-meter";
import { SITE_TARGETS, SYS_TARGETS } from "./accessibility-data";
import styles from "./accessibility.module.css";

export function SystemTargets() {
  return (
    <Canvas label="System targets">
      <div className={styles["ds-target-row"]}>
        <TargetMeter targets={SYS_TARGETS.iconXs}>
          <IconButton icon={ArrowUp} label="Back to top" size="xs" variant="elevated" />
        </TargetMeter>
        <TargetMeter targets={SYS_TARGETS.chipSm}>
          <Chip size="sm">Functional</Chip>
        </TargetMeter>
        <TargetMeter targets={SYS_TARGETS.iconLg}>
          <IconButton icon={ArrowUp} label="Back to top" size="lg" variant="elevated" />
        </TargetMeter>
      </div>
    </Canvas>
  );
}

/** children: anything that belongs between the canvases and the verdicts (the framed menu button). */
export function SiteTargets({ children }: { children?: ReactNode }) {
  const [active, setActive] = useState(1);
  const [arrow, setArrow] = useState<readonly string[]>([]);
  const [dots, setDots] = useState<readonly string[]>([]);
  const [wave, setWave] = useState<readonly string[]>([]);
  return (
    <>
      <Canvas ground="on-blue" layout="stack" label="Players controls" isolateKeys>
        <div className={styles["ds-target-row"]}>
          <TargetMeter targets={SITE_TARGETS.arrow} onLines={setArrow}>
            <div className={styles["ds-arrows-box"]}>
              <PlayerArrows active={active} onChange={setActive} />
            </div>
          </TargetMeter>
        </div>
        <TargetMeter targets={SITE_TARGETS.dots} block onLines={setDots}>
          <div className={styles["ds-carousel-box"]}>
            <PlayerCarousel active={active} onChange={setActive} />
          </div>
        </TargetMeter>
      </Canvas>
      <Canvas ground="container" label="Hero wave button">
        <TargetMeter targets={SITE_TARGETS.wave} onLines={setWave}>
          <div className={styles["ds-wave-box"]}>
            <WaveButton full={false} onClick={noop} />
          </div>
        </TargetMeter>
      </Canvas>
      {children}
      <TargetLines lines={[...arrow, ...dots, ...wave]} />
    </>
  );
}

/** The Do and Don't of a touch-first control. */
export function TouchDo() {
  return <IconButton icon={ArrowUp} label="Back to top" size="lg" variant="elevated" />;
}

export function TouchDont() {
  return <IconButton icon={ArrowUp} label="Back to top" size="xs" variant="elevated" />;
}
