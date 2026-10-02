"use client";

// The wave button on its own: its parts, its two forms in every state a prop can set, and where each
// form belongs. Each form's states stand on the ground it ships on: the pill over the floor's grey (the
// full view, Hero.tsx:278-286, and the phone container, Hero.tsx:252-262), the bare icon on the page, in the
// row under the container (Hero.tsx:101-112), where its -mr-10 pulls it under the corner. Hover lives in
// its Tailwind group classes, so it shows in the live column only.
import { useEffect, useRef, useState } from "react";
import { WaveButton } from "@/components/website/HeroBits";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { ContrastBadge } from "@/app/design-system/_kit/ContrastBadge";
import { Do, DoDont, Dont } from "@/app/design-system/_kit/DoDont";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { WAVE_PINS } from "./tile-floor-pins";

const STATES = ["rest", "busy"] as const;
/** each form on its own ground, as the hero places it */
const FORMS = [
  { form: "pill", ground: "container", where: "over the floor's grey" },
  { form: "bare", ground: "page", where: "in the row under the hero" },
] as const;

/** The live cell: a press shows busy for a moment, as the wait for the next cast does. */
function LiveWave({ full }: { full: boolean }) {
  const [busy, setBusy] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const press = () => {
    if (busy) return;
    setBusy(true);
    timer.current = window.setTimeout(() => setBusy(false), 1200);
  };
  return <WaveButton full={full} busy={busy} onClick={press} />;
}

export function WaveAnatomy() {
  return (
    <Anatomy ground="container" pins={WAVE_PINS} label="Next wave anatomy">
      <WaveButton full onClick={noop} />
    </Anatomy>
  );
}

export function WaveStates() {
  return FORMS.map(({ form, ground, where }) => (
    <StateGrid
      key={form}
      label={`Next wave states, ${form} ${where}`}
      states={STATES}
      variants={[form]}
      ground={ground}
      liveCaption="hover, Tab or press here"
      render={({ state }) =>
        state === "live" ? (
          <LiveWave full={form === "pill"} />
        ) : (
          <WaveButton full={form === "pill"} busy={state === "busy"} onClick={noop} />
        )
      }
    />
  ));
}

export function WaveDoDont() {
  return (
    <DoDont>
      <Do reason="Over the floor, the pill's white fill keeps the icon findable whatever the tiles behind it are doing." ground="container" layout="stack">
        <WaveButton full onClick={noop} />
        <ContrastBadge fg="rgb(10 27 51 / 0.7)" bg="surface" bgName="the pill's white" />
      </Do>
      <Dont reason="The bare icon is slate-400 on the floor's grey. It belongs on the page row under the hero, where the ground is calm." ground="container" layout="stack">
        <WaveButton full={false} onClick={noop} />
        <ContrastBadge fg="#94a3b8" bg="container" />
      </Dont>
    </DoDont>
  );
}
