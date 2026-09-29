import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";
import { Players } from "@/components/website/Players";
import { LogoGridGlow } from "@/components/website/LogoGridGlow";

export const metadata: Metadata = {
  title: "SixLabs",
  description: "Making models of human players.",
};

export default function WebsitePage() {
  return (
    <main className="relative min-h-screen px-4 md:px-8 pt-24 pb-24">
      <LogoGridGlow />
      <Header />
      <Hero />
      <Players />
    </main>
  );
}
