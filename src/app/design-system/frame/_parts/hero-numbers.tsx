// The hero's two figures alone at true widths, for the Stats spec's responsive preview: the centred row
// that sits under the container, on the page, then the full view's left-aligned pair on the full hero's
// container grey (full-bleed, no radius, as Hero.tsx fills the full view), so its muted labels and accent are
// judged on the ground they ship on. Under md the gap drops from 56 to 32, the labels step from 15 to 14 and
// stop wrapping. The figures are the guide's one checked copy (specimens.ts).
import { HeroNumbers } from "@/components/website/HeroBits";
import { COPIES_BASE, heroStats } from "../../_data/specimens";

export function HeroNumbersPart() {
  const stats = heroStats(COPIES_BASE);
  return (
    <div style={{ display: "grid", gap: 56, paddingTop: 48 }}>
      <div style={{ display: "flex", justifyContent: "center", paddingInline: 16 }}>
        <HeroNumbers stats={stats} ready left={false} />
      </div>
      <div style={{ background: "var(--ds-color-container)", padding: "40px 16px 48px" }}>
        <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
          <HeroNumbers stats={stats} ready={false} left />
        </div>
      </div>
    </div>
  );
}
