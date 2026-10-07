import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { ClickLock } from "@/components/website/ClickLock";
import { B2BHero } from "@/components/b2b/B2BHero";
import { B2BFooter } from "@/components/b2b/B2BFooter";
import "@/components/b2b/b2b.css";

export const metadata: Metadata = {
  title: "6labs B2B",
  description: "Modelling human behaviour.",
};

// The B2B, investor-facing 6labs site: for now its hero only (B2BHero.tsx), one screen tall, under the full
// view's header (clear over the hero, the usual bar once scrolled) and over the full view's footer (its picture left out). Links
// and calls to action do nothing yet (ClickLock.tsx).
export default function B2BPage() {
  return (
    <main className="b2b relative min-h-screen font-sans">
      <ClickLock />
      <Header clear />
      <B2BHero />
      {/* the full view's footer, without its copy line picture (B2BFooter.tsx), on its grain ground (.page-grain) */}
      <div className="page-grain px-4 md:px-8">
        <B2BFooter />
      </div>
    </main>
  );
}
