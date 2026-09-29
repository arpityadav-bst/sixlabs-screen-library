import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { Hero } from "@/components/website/Hero";

export const metadata: Metadata = {
  title: "SixLabs",
  description: "Making models of human players.",
};

export default function WebsitePage() {
  return (
    <main className="relative min-h-screen px-4 md:px-8 pt-24 pb-8 md:pb-10">
      <Header />
      <Hero />
    </main>
  );
}
