import type { Metadata } from "next";
import { Hero } from "@/components/website/Hero";
import { LogoMarquee } from "@/components/website/LogoMarquee";

export const metadata: Metadata = {
  title: "SixLabs",
  description: "Foundation of the new digital epoch.",
};

export default function WebsitePage() {
  return (
    <main className="min-h-screen px-4 md:px-8 py-8 md:py-10">
      <Hero />
      <div className="mt-10">
        <LogoMarquee />
      </div>
    </main>
  );
}
