import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";
import { Players } from "@/components/website/Players";
import { ScrubLine } from "@/components/website/ScrubLine";
import { Understands } from "@/components/website/Understands";
import { AsciiBackdrop } from "@/components/website/AsciiBackdrop";
import { AccentWave } from "@/components/website/AccentWave";
import { SmoothScroll } from "@/components/website/SmoothScroll";

export const metadata: Metadata = {
  title: "SixLabs",
  description: "Making models of human players.",
};

export default function WebsitePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip px-4 md:px-8 pt-24 pb-24">
      <AsciiBackdrop />
      <AccentWave />
      <SmoothScroll />
      <Header />
      <Hero />
      <ScrubLine />
      <Players />
      <Understands />
    </main>
  );
}
