"use client";

// The real PlayerDoodles round the real portrait, on the accent ground, bound to the real ModeToggle. The
// portrait is PortraitSwap on the stills, or the clip the homepage plays in this browser (ClipPortrait, in a
// HeavySlot). Replay remounts the drawing, which starts the hand again after the hard-coded DELAY_S, so the
// caption counts it down. A player change remounts it too, because the drawing is fixed for an instance's
// life. Replay wears the solid pill here, because the ghost form's white 80% reads at about 3.4:1 on the blue.
import { useEffect, useState } from "react";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { PlayerDoodles } from "@/components/website/PlayerDoodles";
import { PortraitSwap } from "@/components/website/PortraitSwap";
import { useClipFormat } from "@/components/website/useClipFormat";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { Replay } from "@/app/design-system/_kit/Replay";
import { useReducedMotionSetting } from "@/app/design-system/_kit/reduced-motion";
import { DELAY_S, DOODLE_PINS } from "./doodles-data";
import { CLIP_PICKS, ClipPortrait, WITH_CLIPS, clipPlayer, type ClipPlayer } from "./players-clips";
import s from "./fx-live.module.css";

const PORTRAITS = [
  { value: "still", label: "Still" },
  { value: "clip", label: "Homepage clip" },
];

function DoodleRun({ player, mode, clip }: { player: ClipPlayer; mode: Mode; clip: boolean }) {
  const format = useClipFormat();
  const reduced = useReducedMotionSetting();
  const [left, setLeft] = useState(DELAY_S);

  useEffect(() => {
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const l = Math.max(0, Math.ceil(DELAY_S - (performance.now() - t0) / 1000));
      setLeft(l);
      if (l === 0) window.clearInterval(id);
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const state = reduced
    ? "reduced motion · drawn at once"
    : left > 0
      ? `the hand starts in ${left}s · DELAY_S ${DELAY_S}`
      : mode === "ai"
        ? "the AI retraces each stroke"
        : "the hand is drawing · switch to AI";
  const caption = clip ? `${format} clip · ${state}` : state;

  return (
    <figure className={s["ds-portrait-stage"]}>
      <div data-ds="doodle-box" className={s["ds-doodle-box"]}>
        <div data-ds="doodle-portrait">
          {clip ? (
            <ClipPortrait player={player} mode={mode} format={format} />
          ) : (
            <PortraitSwap
              human={player.video}
              ai={player.aiVideo}
              mode={mode}
              label={player.title}
              format="still"
              className="h-[480px] w-auto"
            />
          )}
        </div>
        <PlayerDoodles id={player.id} start mode={mode} />
      </div>
      <figcaption className="ds-label">{caption}</figcaption>
    </figure>
  );
}

export function DoodleLab() {
  const [id, setId] = useState(WITH_CLIPS[0].id);
  const [mode, setMode] = useState<Mode>("human");
  const [portrait, setPortrait] = useState("still");
  const p = clipPlayer(id);

  return (
    <>
      <div className={s["ds-fx-bar"]}>
        <KitSeg label="Player" options={CLIP_PICKS} value={id} onChange={setId} />
        <KitSeg label="Portrait" options={PORTRAITS} value={portrait} onChange={setPortrait} />
      </div>
      <Anatomy pins={DOODLE_PINS} ground="on-blue" label="Player doodles">
        <div className={`${s["ds-portrait-stage"]} ${s["ds-replay-solid"]}`}>
          <Replay>
            <DoodleRun key={p.id} player={p} mode={mode} clip={portrait === "clip"} />
          </Replay>
          <ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-doodles" />
        </div>
      </Anatomy>
    </>
  );
}

