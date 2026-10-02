"use client";

// The hero as composed, one variant at a time: the real first screen of /website or /6labs-fullview in a
// frame at true widths, pinned from inside the frame. The two frames share the one floor slot, so the switch
// swaps them rather than showing both, and the pins follow the variant. The full view holds the pointer off
// the frame until its floor is in, because that page cancels the wheel while it loads.
import { useState } from "react";
import { Anatomy } from "@/app/design-system/_kit/Anatomy";
import { KitSeg } from "@/app/design-system/_kit/KitSeg";
import { ViewportPreview } from "@/app/design-system/_kit/ViewportPreview";
import { HERO_VARIANTS, HERO_WIDTHS, type HeroVariant } from "./hero-data";
import s from "./hero.module.css";

const OPTIONS = (Object.keys(HERO_VARIANTS) as HeroVariant[]).map((v) => ({ value: v, label: HERO_VARIANTS[v].label }));

export function HeroPreview() {
  const [v, setV] = useState<HeroVariant>("container");
  const meta = HERO_VARIANTS[v];
  return (
    <Anatomy frame layout="stack" ground="container" pins={meta.pins} label={`${meta.title} anatomy`}>
      <div className={s["ds-hero-bar"]}>
        <KitSeg label="Hero variant" options={OPTIONS} value={v} onChange={setV} />
      </div>
      <ViewportPreview
        key={v}
        part={meta.part}
        title={meta.title}
        height={900}
        widths={HERO_WIDTHS}
        width={1440}
        cost={{ floor: true, gl: 1 }}
        gateInput={v === "full"}
      />
    </Anatomy>
  );
}
