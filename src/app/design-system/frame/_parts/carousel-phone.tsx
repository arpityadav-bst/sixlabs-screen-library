"use client";

// Frame part carousel-phone: the player carousel at a true viewport width and in the page's width chain (main's
// gutter plus the players section's inner), so its md step (the 36px title and the centred 560 column) shows
// only where the frame is 768 or wider and its slides take their shipped width. Below the portrait it is laid
// out as Players.tsx lays it out below lg: the still of the active player at the shipped --ph clamp (which
// reads the frame's own width and height), the arrows on its edges, the slim Human / AI switch on its faded
// chest and the carousel pulled up under it, all sharing one index. The ground is the players' accent blue
// under the water's grain.
import { useState } from "react";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { PlayerArrows, PlayerCarousel } from "@/components/website/PlayerCarousel";
import { PLAYERS } from "@/components/website/players-data";
import { Ground } from "./shell-signals";
import s from "./phone-frames.module.css";

export function CarouselPhone() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Mode>("human");
  const player = PLAYERS[active];
  return (
    <>
      <Ground tone="accent" />
      <div className={s["ds-carousel"]}>
        <div className={s["ds-carousel-portrait"]}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the player's still, as Players.tsx draws it */}
          <img src={player.picture} alt={player.title} width={1200} height={1583} />
          <PlayerArrows active={active} onChange={setActive} />
        </div>
        <div className={s["ds-carousel-toggle"]}>
          <ModeToggle mode={mode} onChange={setMode} thumbId="mode-thumb-m" slim />
        </div>
        <div className={s["ds-carousel-rail"]}>
          <PlayerCarousel active={active} onChange={setActive} />
        </div>
      </div>
    </>
  );
}
