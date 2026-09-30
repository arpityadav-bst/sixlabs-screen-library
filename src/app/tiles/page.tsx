import type { Metadata } from "next";
import { TileFloor } from "@/components/tiles/TileFloor";

export const metadata: Metadata = {
  title: "6labs tiles",
  description: "The live glass tile floor: default, focused and activated tile states.",
};

// The design library for the tile floor: the floor full screen, live and interactive.
export default function TilesPage() {
  return (
    <main className="fixed inset-0">
      <TileFloor className="absolute inset-0" />
      <p className="absolute left-6 bottom-6 text-[12px] font-medium text-slate-500 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200/60 pointer-events-none">
        Hover a tile to focus it, click to activate it, press R to reset
      </p>
    </main>
  );
}
