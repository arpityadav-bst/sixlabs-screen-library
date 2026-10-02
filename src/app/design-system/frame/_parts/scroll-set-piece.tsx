// The scroll set-piece as the website composes it, on a bare page of its own: the glyph field and the
// water behind, PerfBoot and SafariScroll where the site mounts them (so ?off switches work in the frame and
// desktop Safari scrolls it on Lenis, in step with the water), ClickLock, then the line, the players and the
// grained block that opens on Understands. The frame is its own document and window, so #model-line and
// #players render here, and the water, the liquid and the players' portrait answer this frame's own scroll
// and width.
import { AccentWave } from "@/components/website/AccentWave";
import { AsciiBackdrop } from "@/components/website/AsciiBackdrop";
import { ClickLock } from "@/components/website/ClickLock";
import { PerfBoot } from "@/components/website/PerfBoot";
import { Players } from "@/components/website/Players";
import { SafariScroll } from "@/components/website/SafariScroll";
import { ScrubLine } from "@/components/website/ScrubLine";
import { Understands } from "@/components/website/Understands";
import s from "./scroll-set-piece.module.css";

export function ScrollSetPiece() {
  return (
    <main className={s["ds-setpiece"]}>
      <AsciiBackdrop />
      <AccentWave />
      <PerfBoot />
      <SafariScroll />
      <ClickLock />
      <ScrubLine />
      <Players />
      <div className={`page-grain ${s["ds-setpiece-grain"]}`}>
        <Understands />
      </div>
    </main>
  );
}
