"use client";

// The real HeroNumbers under the container, waiting for the floor. The switch stands in for the tile
// floor's onReady: once it is on, the figures rise 1.2s later, as they do on the site.
import { useState } from "react";
import { HeroNumbers } from "@/components/website/HeroBits";
import { HERO_STATS } from "./_data/entrance";
import styles from "./motion.module.css";

export function HeroNumbersDemo() {
  const [ready, setReady] = useState(false);
  return (
    <div className={styles["ds-mo-stack"]}>
      <button type="button" className={`ds-btn ds-btn--line ${styles["ds-mo-toggle"]}`}
        aria-pressed={ready} onClick={() => setReady((r) => !r)}>
        Floor ready
      </button>
      <HeroNumbers stats={HERO_STATS} ready={ready} left={false} />
    </div>
  );
}
