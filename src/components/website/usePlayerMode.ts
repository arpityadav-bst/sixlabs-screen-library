"use client";

// Which copy each player shows in the players section (Players.tsx), Human or AI, and how it switches by
// itself. Every player starts as Human; while `auto` holds (the section is in view and the player has an
// AI copy), it flips to the other copy every AUTO_S seconds. Each player keeps its own state, so leaving
// one as AI and coming back finds it still AI, flipping again AUTO_S later. Once the visitor uses the
// toggle on a player, that player stays where they left it and never switches by itself again.
import { useEffect, useState } from "react";
import type { Mode } from "./ModeToggle";

const AUTO_S = 5;

export function usePlayerMode(id: string, auto: boolean) {
  const [modes, setModes] = useState<Record<string, Mode>>({});
  const [held, setHeld] = useState<Record<string, true>>({});
  const mode = modes[id] ?? "human";
  const touched = !!held[id];

  useEffect(() => {
    if (!auto || touched) return;
    const t = window.setTimeout(
      () => setModes((m) => ({ ...m, [id]: mode === "ai" ? "human" : "ai" })),
      AUTO_S * 1000,
    );
    return () => clearTimeout(t);
  }, [id, mode, auto, touched]);

  // the visitor's own choice: it sticks for this player
  const choose = (m: Mode) => {
    setModes((s) => ({ ...s, [id]: m }));
    setHeld((s) => ({ ...s, [id]: true }));
  };
  return [mode, choose] as const;
}
