"use client";

// The white ladder in use: the real Human / AI switch and the real trait bars, as the players section mounts
// them on the blue. The switch is live, so its rest and selected labels trade places under the pins. Its
// thumb takes its own layout id, so it never slides toward another switch on the page.
import { useState } from "react";
import { ModeToggle, type Mode } from "@/components/website/ModeToggle";
import { PlayerTraits } from "@/components/website/PlayerTraits";
import { PLAYERS } from "@/components/website/players-data";
import s from "./colour.module.css";

export function OnBlueUses() {
  const [mode, setMode] = useState<Mode>("human");
  return (
    <div className={s["ds-col-onblue"]}>
      <ModeToggle mode={mode} onChange={setMode} thumbId="ds-colour-special-thumb" />
      <PlayerTraits traits={PLAYERS[0].traits} className="w-full" />
    </div>
  );
}
