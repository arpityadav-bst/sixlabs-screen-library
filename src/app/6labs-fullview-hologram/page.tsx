import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";
import { Players } from "@/components/website/Players";
import { ScrubLine } from "@/components/website/ScrubLine";
import { Understands } from "@/components/website/Understands";
import { Jobs } from "@/components/website/Jobs";
import { BackToTop } from "@/components/website/BackToTop";
import { Faq } from "@/components/website/Faq";
import { Closing } from "@/components/website/Closing";
import { Footer } from "@/components/website/Footer";
import { AsciiBackdrop } from "@/components/website/AsciiBackdrop";
import { AccentWave } from "@/components/website/AccentWave";
import { SmoothScroll } from "@/components/website/SmoothScroll";
import { ArtProvider } from "@/components/website/art";

export const metadata: Metadata = {
  title: "6labs fullview hologram",
  description: "Making models of human players.",
};

// The 6labs-fullview page with the AI copies as the blue hologram (art.tsx); everything else is the same.
export default function HologramPage() {
  return (
    <ArtProvider art="hologram">
      <main className="relative min-h-screen overflow-x-clip px-4 md:px-8 pt-24">
        <AsciiBackdrop />
        <AccentWave />
        <SmoothScroll />
        <Header clear intro />
        <Hero full />
        <ScrubLine />
        <Players />
        {/* from here to the foot: the noise, over a ground that covers the ASCII field (.page-grain) */}
        <div className="page-grain -mx-4 px-4 md:-mx-8 md:px-8">
          <Understands />
          <Jobs />
          <Faq />
          <Closing />
          <Footer />
        </div>
        <BackToTop />
      </main>
    </ArtProvider>
  );
}
