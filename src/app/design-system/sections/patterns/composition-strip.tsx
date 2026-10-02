// The page as one strip, top to bottom read left to right: each stretch on its own ground, sized by how many
// screens it lasts. The water is the kit's on-blue ground, the players' own, and the grain block is the
// site's .page-grain, so the strip shows the real grounds rather than swatches of them.
import type { CSSProperties } from "react";
import { Canvas } from "@/app/design-system/_kit/Canvas";
import type { Stretch, StripGround } from "./composition-data";
import s from "./composition.module.css";

type Seg = Pick<Stretch, "name" | "ground" | "screens">;

const FLAT: CSSProperties = { minHeight: 0 };

function Ground({ ground }: { ground: StripGround }) {
  if (ground === "water") return <Canvas ground="on-blue" layout="bleed" className={s["ds-strip-fill"]} style={FLAT} />;
  if (ground === "grain") return <Canvas ground="grain" layout="bleed" className={s["ds-strip-fill"]} style={FLAT} />;
  return (
    <div className={s["ds-strip-fill"]} data-ground={ground}>
      {ground === "hero" && <span className={s["ds-strip-box"]} />}
    </div>
  );
}

export function Strip({ segments, label }: { segments: readonly Seg[]; label: string }) {
  return (
    <ol className={s["ds-strip"]} aria-label={label}>
      {segments.map((g, k) => (
        <li key={`${g.name}-${k}`} className={s["ds-strip-seg"]} style={{ flexGrow: g.screens }}>
          <Ground ground={g.ground} />
          <span className={s["ds-strip-name"]}>{g.name}</span>
        </li>
      ))}
    </ol>
  );
}
