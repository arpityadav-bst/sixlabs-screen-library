// Human and hologram side by side: plain pictures from public/, the human first. They read as decals only
// at the floor's angle, so here they are shown flat at a fixed size.
import type { Pair } from "./holograms-data";
import s from "./floor.module.css";

function Pic({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  // eslint-disable-next-line @next/next/no-img-element -- stills from public/, served as is
  return <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />;
}

/** One pair with its caption. */
export function PairFigure({ pair, w, h }: { pair: Pair; w: number; h: number }) {
  return (
    <figure className={s["ds-holo-pair"]}>
      <div className={s["ds-holo-imgs"]}>
        <Pic src={pair.human} alt={`${pair.label}, human`} w={w} h={h} />
        <Pic src={pair.ai} alt={`${pair.label}, hologram`} w={w} h={h} />
      </div>
      <figcaption className="ds-label">{pair.label}</figcaption>
    </figure>
  );
}

export function TilePairs({ pairs }: { pairs: readonly Pair[] }) {
  return (
    <div className={s["ds-holo-grid"]}>
      {pairs.map((p) => (
        <PairFigure key={p.key} pair={p} w={768} h={768} />
      ))}
    </div>
  );
}

export function PlayerPairs({ pairs }: { pairs: readonly Pair[] }) {
  return (
    <div className={s["ds-holo-players"]}>
      {pairs.map((p) => (
        <PairFigure key={p.key} pair={p} w={810} h={1080} />
      ))}
    </div>
  );
}

/** One picture alone, for the Do / Don't pair. */
export function Single({ src, label }: { src: string; label: string }) {
  return (
    <figure className={s["ds-holo-pair"]}>
      <div className={s["ds-holo-imgs"]}>
        <Pic src={src} alt={label} w={768} h={768} />
      </div>
      <figcaption className="ds-label">{label}</figcaption>
    </figure>
  );
}
