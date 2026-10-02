"use client";

// The two loaders as they ship, each in a box of the hero it belongs to: an Anatomy of the loader held
// on, then a Show toggle to watch it leave. The page wiring (useHeroIntro's scroll hold, the 12s give-up,
// the HERO_LOADED event) stays out of the guide.
import { useState } from "react";
import { FloorLogo } from "@/components/website/HeroBits";
import { HeroLoader } from "@/components/website/HeroLoader";
import { Button } from "@/components/design-system/Button";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { LOADER_PINS, LOGO_PINS } from "./floor-lifecycle-pins";
import s from "./floor.module.css";

function Toggle({ show, onChange, on, off }: { show: boolean; onChange: (v: boolean) => void; on: string; off: string }) {
  return (
    <div className={s["ds-fl-toggle"]}>
      <Button variant="secondary" size="sm" selected={show} onClick={() => onChange(!show)}>
        Show
      </Button>
      <p className="ds-label" aria-live="polite">
        {show ? on : off}
      </p>
    </div>
  );
}

export function HeroLoaderSpecimens() {
  const [show, setShow] = useState(true);
  return (
    <>
      <Anatomy ground="container" layout="stack" pins={LOADER_PINS} label="Hero loader anatomy">
        <div className={s["ds-fl-loader"]}>
          <HeroLoader show />
        </div>
      </Anatomy>
      <Canvas ground="container" layout="stack" label="Hero loader exit">
        <Toggle show={show} onChange={setShow} on="shown · the arcs hop in turn" off="gone · faded over 0.45s" />
        <div className={s["ds-fl-loader"]}>
          <HeroLoader show={show} />
        </div>
        <ContrastBadge fg="#94a3b8" bg="container" bgName="the hero grey" />
      </Canvas>
    </>
  );
}

export function FloorLogoSpecimens() {
  const [show, setShow] = useState(true);
  return (
    <>
      <Anatomy ground="page" layout="stack" pins={LOGO_PINS} label="Floor logo anatomy">
        <div className={s["ds-fl-logo"]}>
          <FloorLogo show />
        </div>
      </Anatomy>
      <Canvas ground="page" layout="stack" label="Floor logo exit">
        <Toggle show={show} onChange={setShow} on="shown · a turn every 90s" off="gone · faded and shrunk over 0.45s" />
        <div className={s["ds-fl-logo"]}>
          <FloorLogo show={show} />
        </div>
      </Canvas>
    </>
  );
}

export function LoaderDoDont() {
  return (
    <DoDont>
      <Do reason="On the hero's grey the loader sits on the floor's own colour, so the tiles fade in with no change of ground." ground="page">
        <div className={s["ds-fl-loader"]}>
          <HeroLoader show />
        </div>
      </Do>
      <Dont reason="On white, the box turns grey the moment the floor is ready, a flash that reads as the page reloading." ground="page">
        <div className={`${s["ds-fl-loader"]} ${s["ds-fl-loader--white"]}`}>
          <HeroLoader show />
        </div>
      </Dont>
    </DoDont>
  );
}
