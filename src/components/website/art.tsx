"use client";

// Which look the AI copies take on a page: "bisque" (the matte white porcelain mannequins, the default) or
// "hologram" (the same faceless mannequins as a glowing blue scan-line hologram). The humans are the same in
// both. The hologram pages wrap themselves in <ArtProvider art="hologram">; the tile floor, the players'
// AI clips and the footer's copy line read it to pick their art.
import { createContext, useContext, type ReactNode } from "react";

export type Art = "bisque" | "hologram";

const ArtContext = createContext<Art>("bisque");

export function ArtProvider({
  art,
  children,
}: {
  art: Art;
  children: ReactNode;
}) {
  return <ArtContext.Provider value={art}>{children}</ArtContext.Provider>;
}

export const useArt = () => useContext(ArtContext);
