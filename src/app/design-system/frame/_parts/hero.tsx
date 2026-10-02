// The hero's frame parts: the first screen of each website page as the page composes it, on a bare page of
// its own. The container hero sits in main's gutter and top padding with the glyph field behind it, the full
// hero runs edge to edge under the clear header. ClickLock is mounted as both pages mount it. The frame is
// its own document, so #site-head renders here, and the floor, the intro and the phone clearance answer the
// frame's own width and height.
import { AsciiBackdrop } from "@/components/website/AsciiBackdrop";
import { ClickLock } from "@/components/website/ClickLock";
import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";
import s from "./pattern-frames.module.css";

const PAGE = `${s["ds-pf-page"]} ${s["ds-pf-page--hero"]}`;

/** /website's first screen: the rounded container, its under-row, the default header. */
export function HeroContainerPart() {
  return (
    <main className={PAGE}>
      <AsciiBackdrop />
      <ClickLock />
      <Header />
      <Hero />
    </main>
  );
}

/** /6labs-fullview's first screen: the floor edge to edge under the clear header. */
export function HeroFullPart() {
  return (
    <main className={PAGE}>
      <AsciiBackdrop />
      <ClickLock />
      <Header clear />
      <Hero full />
    </main>
  );
}
