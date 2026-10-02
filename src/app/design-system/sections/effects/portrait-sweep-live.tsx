"use client";

// The Human / AI sweep with the real parts: PortraitSwap on the stills (a 2D canvas, no WebGL), on the
// WebGL path StackedSwap inside a HeavySlot, or on the clip path PortraitSwap in the format this browser
// plays on the homepage (ClipPortrait), bound to the real ModeToggle. Each mounted switch carries
// its own thumbId, because ModeToggle's thumb travels on a motion layoutId. A player change remounts the
// portrait, so its first showing settles rather than sweeps, as on the site. On the WebGL path the key sits
// on the slot, not the portrait: swapGL has no dispose, so each change has to run the slot's own cleanup,
// which loses the old canvas's context before the next one is made.
import { useState } from "react";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { PortraitSwap } from "@/components/website/PortraitSwap";
import { StackedSwap } from "@/components/website/StackedSwap";
import { useClipFormat } from "@/components/website/useClipFormat";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { HeavySlot } from "@/app/design-system/_kit/HeavySlot";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { SWEEP_PINS } from "./portrait-sweep-data";
import { CLIP_PICKS, ClipPortrait, WITH_CLIPS, clipPlayer } from "./players-clips";
import s from "./fx-live.module.css";

const PATHS = [
  { value: "2d", label: "2D canvas" },
  { value: "gl", label: "WebGL" },
  { value: "clip", label: "Homepage clip" },
];

export function SweepLab() {
  const [id, setId] = useState(WITH_CLIPS[0].id);
  const [mode, setMode] = useState<Mode>("human");
  const [path, setPath] = useState("2d");
  const clip = useClipFormat();
  const p = clipPlayer(id);
  const format = path === "2d" ? "still" : path === "gl" ? "stacked" : clip;

  return (
    <>
      <div className={s["ds-fx-bar"]}>
        <KitSeg label="Player" options={CLIP_PICKS} value={id} onChange={setId} />
        <KitSeg label="Drawing path" options={PATHS} value={path} onChange={setPath} />
        <p className="ds-label" aria-live="polite">
          format {format}
          {path === "clip" ? ", as the homepage plays it here" : ""}
        </p>
      </div>
      <Anatomy pins={SWEEP_PINS} ground="on-blue" label="Human / AI sweep">
        <div data-ds="sweep-stage" className={s["ds-portrait-stage"]}>
          <div data-ds="sweep-portrait">
            {path === "clip" ? (
              <ClipPortrait key={p.id} player={p} mode={mode} format={clip} />
            ) : path === "gl" ? (
              <HeavySlot key={p.id} cost={{ gl: 1 }} label="The WebGL portrait" height={480} style={{ width: 360 }}>
                <StackedSwap human={p.video} ai={p.aiVideo} mode={mode} label={p.title} className="h-[480px] w-auto" />
              </HeavySlot>
            ) : (
              <PortraitSwap
                key={p.id}
                human={p.video}
                ai={p.aiVideo}
                mode={mode}
                label={p.title}
                format="still"
                className="h-[480px] w-auto"
              />
            )}
          </div>
          <ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-sweep" />
        </div>
      </Anatomy>
    </>
  );
}

/** One StateGrid cell: a settled copy when forced, or a live portrait with its own switch. */
export function SweepCell({ mode: forced }: { mode?: Mode }) {
  const [mode, setMode] = useState<Mode>("human");
  const p = WITH_CLIPS[0];
  return (
    <div className={s["ds-portrait-stage"]}>
      <PortraitSwap
        human={p.video}
        ai={p.aiVideo}
        mode={forced ?? mode}
        label={p.title}
        format="still"
        className="h-[240px] w-auto"
      />
      {!forced && <ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-sweep-live" slim />}
    </div>
  );
}

/** The switch alone, free, for the live cell. */
export function LiveToggle() {
  const [mode, setMode] = useState<Mode>("human");
  return <ModeToggle mode={mode} onChange={setMode} thumbId="ds-thumb-switch-live" />;
}

/** Two switches side by side, each on its own thumbId or both on one. */
export function ThumbPair({ shared }: { shared?: boolean }) {
  const [a, setA] = useState<Mode>("human");
  const [b, setB] = useState<Mode>("ai");
  return (
    <div className={s["ds-thumb-pair"]}>
      <ModeToggle mode={a} onChange={setA} thumbId={shared ? "ds-thumb-shared" : "ds-thumb-pair-a"} slim />
      <ModeToggle mode={b} onChange={setB} thumbId={shared ? "ds-thumb-shared" : "ds-thumb-pair-b"} slim />
    </div>
  );
}
