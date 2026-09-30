"use client";

// Phones and tablets (Players.tsx, below lg): the players as one carousel under the portrait, in place of
// the four cards and the side column. Each slide is a player's name, description and trait bars; a swipe
// (the track scroll-snaps, one player per width), a dot, or an arrow beside the portrait (PlayerArrows)
// picks the player, and the portrait and the switch above answer in the same view, so nothing that
// changes has scrolled away. A swipe counts once the track has come to rest (changing the player while
// it still moves re-renders the page and the browser re-snaps the track back); a pick from the dots or
// arrows glides the track there, and the slides it passes on the way do not count.
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLAYERS } from "./players-data";
import { PlayerTraits } from "./PlayerTraits";

const ARROW =
  "grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/25 transition-opacity duration-200 disabled:opacity-30";

export function PlayerCarousel({
  active,
  onChange,
}: {
  active: number;
  onChange: (k: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  // the slide a dot or arrow sent the track to; until it arrives, the scroll is ours, not a swipe
  const heading = useRef<number | null>(null);
  // a pick made by swiping: the track is already on its way there, so it is not sent again
  const swiped = useRef(false);

  // the track follows the active player when it changes from elsewhere
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    const x = active * el.clientWidth;
    if (Math.abs(el.scrollLeft - x) < 2) return;
    heading.current = active;
    el.scrollTo({ left: x, behavior: "smooth" });
  }, [active]);

  const rest = useRef(0);
  useEffect(() => () => window.clearTimeout(rest.current), []);
  const settle = () => {
    const el = track.current;
    if (!el) return;
    const k = Math.round(el.scrollLeft / el.clientWidth);
    if (heading.current !== null) {
      if (k === heading.current) heading.current = null;
      return;
    }
    if (k !== active && k >= 0 && k < PLAYERS.length) {
      swiped.current = true;
      onChange(k);
    }
  };
  // the track is at rest once no scroll has come for a moment
  const onScroll = () => {
    window.clearTimeout(rest.current);
    rest.current = window.setTimeout(settle, 120);
  };

  const go = (k: number) =>
    onChange(Math.max(0, Math.min(PLAYERS.length - 1, k)));

  return (
    <div>
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PLAYERS.map((p, k) => (
          <article
            key={p.id}
            aria-hidden={k !== active}
            className="w-full shrink-0 snap-center px-1"
          >
            {/* a tablet centres the column under the portrait */}
            <div className="md:mx-auto md:max-w-[560px]">
              <h3 className="font-display text-[28px] font-medium leading-[1.1] tracking-tight text-white md:text-[36px]">
                {p.title}
              </h3>
              <p className="mt-2 max-w-[520px] text-balance font-sans text-[15px] leading-snug text-white/80 md:text-[16px]">
                {p.body}
              </p>
              <PlayerTraits traits={p.traits} dense className="mt-5" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center">
        {PLAYERS.map((p, k) => (
          <button
            key={p.id}
            type="button"
            aria-label={p.title}
            aria-current={k === active}
            onClick={() => go(k)}
            className="grid h-8 place-items-center px-1.5"
          >
            <span
              className={
                "block h-1.5 rounded-full transition-all duration-300 " +
                (k === active ? "w-6 bg-white" : "w-1.5 bg-white/40")
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// The previous / next arrows beside the portrait (Players.tsx, below lg), at the sides of its box.
export function PlayerArrows({
  active,
  onChange,
}: {
  active: number;
  onChange: (k: number) => void;
}) {
  const go = (k: number) =>
    onChange(Math.max(0, Math.min(PLAYERS.length - 1, k)));
  return (
    <>
      <button
        type="button"
        aria-label="Previous player"
        disabled={active === 0}
        onClick={() => go(active - 1)}
        className={ARROW + " absolute left-0 top-1/2 -translate-y-1/2"}
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Next player"
        disabled={active === PLAYERS.length - 1}
        onClick={() => go(active + 1)}
        className={ARROW + " absolute right-0 top-1/2 -translate-y-1/2"}
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>
    </>
  );
}
