// The 6labs mark over the model's line, in the full view's loader motion (website/HeroLoader.tsx): the logo's
// own navy core and blue blades, its three arcs easing a little out from the core and back one at a time,
// round clockwise (.logo-arc-* in globals.css), always running, as the model always is. Each arc is its own
// layer, so the browser moves them off the main thread.
import { ARCS } from "@/components/website/brand-marks";

const VIEW = "12 7 107 117"; // the mark with room round it for the arcs' travel
const ORDER = [1, 2, 0]; // the right arc first, then clockwise
const NAVY = "#030D2D",
  BLUE = "#1770EF";

export function ModelMark() {
  return (
    <div aria-hidden className="relative h-10 w-10 md:h-12 md:w-12">
      <svg viewBox={VIEW} className="absolute inset-0 h-full w-full">
        <circle cx="65.52" cy="65.76" r="15.41" fill={NAVY} />
      </svg>
      {ORDER.map((k, i) => (
        <div key={k} className={`logo-arc-${k} absolute inset-0`} style={{ animationDelay: `${i * 0.5 - 1.5}s` }}>
          <svg viewBox={VIEW} className="h-full w-full">
            <path d={ARCS[k]} fill={BLUE} />
          </svg>
        </div>
      ))}
    </div>
  );
}
