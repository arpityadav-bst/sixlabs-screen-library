"use client";

// The two shipped segmented controls: ModeToggle on the blue, live with its own state, and the Jobs
// switch, which only shows under xl, framed from the real section at 768. Each ModeToggle here takes a
// ds- thumb id of its own, so no two copies trade a thumb. The jobs crop runs from 32 to 472 at 768, so it
// holds the switch whether the frame starts it at 64 (the bare section) or at 96 (inside the page gutter).
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import { KeyRows } from "@/app/design-system/_kit/KeyRows";
import { Item } from "@/app/design-system/_kit/Label";
import { Spec } from "@/app/design-system/_kit/Spec";
import { StateGrid } from "@/app/design-system/_kit/StateGrid";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { JOBS_PINS, JOBS_ROWS, MODE_CODE, MODE_PINS, MODE_ROWS } from "./segmented-data";

function LiveMode({ slim, thumbId, mode }: { slim?: boolean; thumbId: string; mode?: Mode }) {
  const [m, setM] = useState<Mode>(mode ?? "human");
  return <ModeToggle mode={m} onChange={setM} thumbId={thumbId} slim={slim} />;
}

export function ShippedSegmented() {
  return (
    <>
      <Spec
        level={4}
        title="Human / AI"
        source={{ from: "@/components/website/ModeToggle", name: "ModeToggle" }}
        props="mode slim thumbId"
        role="One switch picks which copy of the player the portrait shows, so it sits on the blue beside the portrait it changes."
        caption="default 112 per option · slim 96 · thumb on spring 500 / 40"
        drawer={{ code: MODE_CODE }}
      >
        <Anatomy pins={MODE_PINS} ground="on-blue" label="Human / AI anatomy">
          <span data-pin="mode">
            <LiveMode thumbId="ds-thumb-seg-anatomy" />
          </span>
        </Anatomy>
        <Canvas ground="on-blue" label="Human / AI, default and slim">
          <Item label="default · lg and up">
            <LiveMode thumbId="ds-thumb-seg-1" />
          </Item>
          <Item label="slim · below lg">
            <LiveMode slim thumbId="ds-thumb-seg-2" />
          </Item>
        </Canvas>
        <StateGrid
          label="Human / AI states"
          ground="on-blue"
          states={["human", "ai"] as const}
          minCell={260}
          render={({ force }) => (
            <LiveMode key={force ?? "live"} mode={force} thumbId={`ds-thumb-seg-${force ?? "live"}`} />
          )}
        />
        <KeyRows label="Human / AI behaviour" rows={MODE_ROWS} />
      </Spec>
      <Spec
        level={4}
        title="The jobs switch"
        source={{ from: "@/components/website/Jobs", name: "Jobs", at: "role=\"tablist\"" }}
        role="Under xl the three job cards become a swipe row, and this switch names the card in view."
        caption="frame section-jobs at 768 · it hides from xl, where the cards sit side by side"
        note="Its navy fill jumps with no thumb, and it has no arrow keys or panels: the drift the system control closes."
      >
        <Anatomy pins={JOBS_PINS} frame layout="stack" ground="container" label="Jobs switch anatomy">
          <ViewportPreview
            part="section-jobs"
            title="The jobs switch at 768"
            height={420}
            widths={[768]}
            scrollTo="#jobs [role=tablist]"
            crop={{ x: 32, y: 0, width: 440, height: 60 }}
          />
        </Anatomy>
        <KeyRows label="The jobs switch per state" rows={JOBS_ROWS} />
      </Spec>
    </>
  );
}
