"use client";

// The index card's cover art: the site's own glyph field filling the card, warmed to the accent where the
// pointer is (hover devices only), with three of the floor's pre-rendered glass tiles bobbing in a loose
// diagonal that runs off the right edge, and two spec labels in the footer copy line's idiom pointing at
// them, their leaders ending on navy pin dots (no accent fill, as the card holds none). Canvas and
// transforms only: no WebGL, blur, blend, mask or filter, so the index stays instant. On hover the tiles
// drift apart along their tilts. Reduced motion stops the bob (the badge-bob class already does) and the
// drift.
import { useEffect, useRef } from "react";
import { mountAsciiField } from "./ascii-field-typed";

type Tile = { src: string; w: number; h: number; place: string; drift: string; bob: string };

// 384px renders of tiles that are 384 wide, shown at 168, 140 and 120 (crisp at 2x)
const TILES: readonly Tile[] = [
  {
    src: "/tiles/float/384/01-snapback.webp", w: 168, h: 158,
    place: "w-[168px] left-[6%] top-[92px] -rotate-6 max-md:left-[10%] max-md:top-[28px] max-md:w-[140px]",
    drift: "motion-safe:group-hover/ix:-translate-x-1 motion-safe:group-hover/ix:-translate-y-1",
    bob: "[animation-delay:0s]",
  },
  {
    src: "/tiles/float/384/11-blue-hair.webp", w: 140, h: 120,
    place: "w-[140px] left-[50%] top-[150px] rotate-5 max-md:left-[54%] max-md:top-[64px] max-md:w-[120px]",
    drift: "",
    bob: "[animation-delay:1.2s]",
  },
  {
    src: "/tiles/float/384/07-curls-glasses.webp", w: 120, h: 112,
    place: "w-[120px] left-[82%] top-[262px] rotate-4 max-md:hidden",
    drift: "motion-safe:group-hover/ix:translate-x-1 motion-safe:group-hover/ix:translate-y-1",
    bob: "[animation-delay:2.1s]",
  },
];

function Label({ text, strong, at }: { text: string; strong?: boolean; at: string }) {
  return (
    <span className={`pointer-events-none absolute flex -translate-x-1/2 -translate-y-full flex-col items-center max-md:hidden ${at}`}>
      <span
        className={
          "whitespace-nowrap rounded-full border px-3 py-1 font-sans text-[12px] leading-4 tracking-[-0.01em] " +
          (strong
            ? "border-transparent bg-(--ds-color-primary) text-white"
            : "border-(--ds-color-line) bg-(--ds-color-surface-85) text-(--ds-color-ink)")
        }
      >
        {text}
      </span>
      <span className="h-7 w-px bg-(--ds-color-ink-30)" />
      <span className="-mb-[3.5px] h-[7px] w-[7px] rounded-full border-2 border-white bg-(--ds-color-primary)" />
    </span>
  );
}

export function IndexCardArt({ tileLabel, modelsLabel }: { tileLabel: string; modelsLabel: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || el.firstChild) return;
    mountAsciiField({
      host: el,
      track: el.parentElement ?? el,
      reach: 120,
      lens: 0.24,
      pointer: window.matchMedia("(hover: hover)").matches,
    });
  }, []);

  return (
    <>
      <div ref={host} aria-hidden="true" className="ascii-host pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[54%] max-md:relative max-md:h-[220px] max-md:w-full"
      >
        {TILES.map((t) => (
          <span
            key={t.src}
            className={`absolute block transition-[translate] duration-(--ds-dur-rise) ease-(--ds-ease-out) ${t.place} ${t.drift}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a pre-rendered tile, drawn at its own size */}
            <img src={t.src} alt="" width={t.w} height={t.h} decoding="async" className={`badge-bob block h-auto w-full ${t.bob}`} />
          </span>
        ))}
        <Label text={tileLabel} at="left-[calc(6%+84px)] top-[104px]" />
        <Label text={modelsLabel} strong at="left-[calc(50%+70px)] top-[160px]" />
      </div>
    </>
  );
}
