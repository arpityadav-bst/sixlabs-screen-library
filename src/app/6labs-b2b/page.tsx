import type { Metadata } from "next";
import { B2BHeader } from "@/components/b2b/B2BHeader";
import { ClickLock } from "@/components/website/ClickLock";
import { B2BHero } from "@/components/b2b/B2BHero";
import { B2BFooter } from "@/components/b2b/B2BFooter";
import "@/components/b2b/b2b.css";

export const metadata: Metadata = {
  title: "6labs B2B",
  description: "Modelling human behaviour.",
};

// The B2B, investor-facing 6labs site: for now its hero only (B2BHero.tsx), one screen tall, under its own
// quieter copy of the full view's header (clear over the hero, a faint bar once scrolled, B2BHeader.tsx) and over
// the full view's footer (its picture left out). Links and calls to action do nothing yet (ClickLock.tsx).
export default function B2BPage() {
  return (
    <main className="b2b relative min-h-screen font-sans">
      <ClickLock />
      <B2BHeader />
      <B2BHero />
      {/* a good stretch of open page after the hero, plain (no grain: the grain's fade-in read as streaks there),
          then the full view's footer, without its copy line picture (B2BFooter.tsx), on its grain ground */}
      <div aria-hidden className="h-[clamp(72px,12vh,160px)]" />
      <div className="page-grain px-4 md:px-8">
        <B2BFooter />
      </div>
    </main>
  );
}
