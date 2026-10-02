"use client";

// The shipped icon-only controls: the hero's wave button in both forms and the players' arrows. They
// take functions (onClick, onChange), so they are rendered here, in a client file. The wave button
// does nothing on press in the guide, as the floor it resets is not on this page.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { WaveButton } from "@/components/website/HeroBits";
import { PlayerArrows } from "@/components/website/PlayerCarousel";
import { PLAYERS } from "@/components/website/players-data";
import { ARROW_PINS, ARROW_ROWS, SHIPPED_CODE, WAVE_PINS, WAVE_ROWS } from "./icon-button-data";

const LAST = PLAYERS.length - 1;

function Wave({ form, busy }: { form: "pill" | "bare"; busy?: boolean }) {
  if (form === "pill") return <WaveButton full busy={busy} onClick={noop} />;
  // the bare form sits 40px past its row on the site (-mr-10), so it gets that room back here
  return (
    <div className="pr-12">
      <WaveButton full={false} busy={busy} onClick={noop} />
    </div>
  );
}

function Arrows({ active }: { active?: number }) {
  const [a, setA] = useState(active ?? 1);
  return (
    <div className="relative h-24 w-72">
      <PlayerArrows active={active ?? a} onChange={setA} />
    </div>
  );
}

export function ShippedIconButtons() {
  return (
    <>
      <Spec
        level={4}
        title="Next wave"
        source={{ from: "@/components/website/HeroBits", name: "WaveButton", file: "HeroBits.tsx" }}
        props="full busy"
        role="The icon alone holds the corner, and the name widens in only when the pointer asks for it."
        caption="pill · 40 tall on the container · bare · on the page under the hero, 24 hit area under the row"
        drawer={{ code: SHIPPED_CODE }}
      >
        <Anatomy pins={WAVE_PINS} ground="container" label="Next wave anatomy">
          <span data-pin="wave">
            <Wave form="pill" />
          </span>
        </Anatomy>
        <StateGrid
          label="Next wave states, the pill on the container"
          ground="container"
          states={["rest", "busy"] as const}
          variants={["pill"] as const}
          minCell={140}
          render={({ variant, force }) => <Wave form={variant} busy={force === "busy"} />}
        />
        <StateGrid
          label="Next wave states, the bare form on the page"
          ground="page"
          states={["rest", "busy"] as const}
          variants={["bare"] as const}
          minCell={140}
          render={({ variant, force }) => <Wave form={variant} busy={force === "busy"} />}
        />
        <KeyRows label="Next wave per state" rows={WAVE_ROWS} />
      </Spec>
      <Spec
        level={4}
        title="Player arrows"
        source={{ from: "@/components/website/PlayerCarousel", name: "PlayerArrows", file: "PlayerCarousel.tsx" }}
        props="active onChange"
        role="Below lg the portrait fills the width, so the arrows step through the players at its sides."
        caption="36 circle · chevron 18 · disabled at the ends"
        note="36 is under the 40 the system ladder gives a touch target, which the glass IconButton at md corrects."
      >
        <Anatomy pins={ARROW_PINS} ground="on-blue" label="Player arrows anatomy">
          <div data-pin="arrows">
            <Arrows />
          </div>
        </Anatomy>
        <StateGrid
          label="Player arrows states"
          ground="on-blue"
          states={["first", "middle", "last"] as const}
          minCell={300}
          render={({ force }) => <Arrows active={force === "first" ? 0 : force === "last" ? LAST : 1} />}
        />
        <KeyRows label="Player arrows per state" rows={ARROW_ROWS} />
      </Spec>
    </>
  );
}
