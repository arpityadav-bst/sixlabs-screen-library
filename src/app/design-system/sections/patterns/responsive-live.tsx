"use client";

// The wave button in both forms for the Responsive Do / Don't. The press does nothing here, the floor it
// sends lives in the hero.
import { noop } from "@/app/design-system/_kit/reduced-motion";
import { WaveButton } from "@/components/website/HeroBits";

// the bare form is outset 40px past its row on the page (-mr-10), so it gets that room back here
const ROOM = { display: "inline-flex", paddingRight: 40 } as const;

export function Wave({ form }: { form: "pill" | "bare" }) {
  if (form === "pill") return <WaveButton full onClick={noop} />;
  return (
    <span style={ROOM}>
      <WaveButton full={false} onClick={noop} />
    </span>
  );
}
