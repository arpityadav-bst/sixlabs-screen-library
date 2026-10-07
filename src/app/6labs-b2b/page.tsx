import type { Metadata } from "next";
import { B2BHeader } from "@/components/b2b/B2BHeader";
import { B2BHero } from "@/components/b2b/B2BHero";

export const metadata: Metadata = {
  title: "6labs B2B",
  description: "Modelling human behaviour.",
};

// The B2B, investor-facing 6labs site: for now its hero only (B2BHero.tsx), under its own top bar.
export default function B2BPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <B2BHeader />
      <B2BHero />
    </main>
  );
}
