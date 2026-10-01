// The footer's wordmark band (Footer.tsx), between its links and its tail, at the height it had before the
// picture: the huge wordmark sitting a little up off the tail's hairline, and the SixLabs mark, flat as
// its logo file, cresting from behind it and fading down into it (after the onBlue creators page's
// foot). Around them, nothing but the copy line (public/footer/copy-line.webp, generated on plain white
// with no text in it): our players and a crowd behind them walk in from the left toward the mark, and come
// out on the right as their AI copies, in their own clothes with a plain white face (as in the hero's tiles) and the
// blue lines at the neck, so the brand in the middle is where the copying happens. The picture has no ground and no scene:
// it reads as multiplied into the page, so its white is the page and only the people show; those nearest
// the word fade into the page around it (both done on a canvas, CopyLinePicture.tsx, with no blend mode or
// mask on the page). From a tablet up it runs the band's full width at its own
// shape (FIT), so two spec labels in code, on leader lines, can sit in its own coordinates and land on the
// same heads at any width (desktop only). A phone has no room for it: there the band is just the mark and
// the word. Colour split on the word's two
// ends only (.foot-word in globals.css), behind the picture and the word. The hologram pages (art.tsx) use copy-line-holo.webp, the same
// picture with the copies redrawn as the blue hologram.
import { SixLabsLogo } from "./brand-marks";
import { useArt } from "./art";
import { CopyLinePicture } from "./CopyLinePicture";

// The picture is drawn as two halves (CopyLinePicture.tsx) pushed apart by SPREAD (% of its width): the players a little further
// left, the copies a little further right, the empty white middle between them simply wider. Each half is
// also drawn at SCALE, shrinking toward its own outer edge about the line of the feet (FEET, % of the
// picture's height), so the people stand smaller on the same ground. The halves meet in the white, so the
// split never shows.
const SPREAD = { l: 3, r: 6 }; // the copies' half pushed further
const SCALE = 0.85;
const FEET = 88;

// where a point of the picture lands once its half is moved and scaled (the translate, then the scale
// about the half's origin, as CSS applies them)
const place = (x: number, y: number, side: "l" | "r") => ({
  left:
    side === "l" ? SCALE * x - SPREAD.l : 100 + SPREAD.r + SCALE * (x - 100),
  top: FEET + SCALE * (y - FEET),
});

const LABELS: {
  text: string;
  x: number;
  y: number;
  side: "l" | "r";
  strong?: boolean;
}[] = [
  // x, y: where the leader line lands, in % of the picture as generated
  { text: "Real players", x: 16.7, y: 14, side: "l" },
  { text: "1,000,000+ player models", x: 74.4, y: 15, side: "r", strong: true },
];

const COPY = "block whitespace-nowrap";

// the wordmark, its accent 6 as in the header's logo (the colour-split copies take theirs plain)
export const Word = ({ plain }: { plain?: boolean }) => (
  <>
    <span className={plain ? "" : "text-accent"}>6</span>labs
  </>
);

// the picture's box: on a phone it covers the band; from a tablet up it is the band's width at the
// picture's own shape (2688 x 1152, so 42.857% of the width tall), set so a twentieth of its extra height is cropped from the top
const FIT =
  "absolute max-md:inset-0 md:inset-x-0 md:top-[calc((100%-42.857cqw)*0.05)] md:aspect-[2688/1152]";

export function CopyLine() {
  const pic =
    useArt() === "hologram" ? "copy-line-holo.webp?v=1" : "copy-line.webp?v=7";
  return (
    // the band: the clear air, the mark's crest above the word, then the word (1em)
    <div
      aria-hidden
      className="@container relative font-display text-[clamp(84px,19vw,300px)]"
    >
      {/* the word's colour split, behind the picture and the word: a pale red copy nudged left and a pale
          cyan one nudged right, each fading out from its own end (.foot-word, globals.css), so it shows only
          where a copy slips past a letter's edge, and the people in front of it cover it */}
      <div className="pointer-events-none absolute inset-x-0 top-0 pt-[calc(72px+0.46em)] md:pt-[calc(150px+0.46em)]">
        <span className="block h-[1.04em] overflow-hidden text-center">
          <span className="foot-word font-semibold tracking-[-0.055em]">
            <span className={COPY + " invisible"}>
              <Word plain />
            </span>
            <span className={COPY + " fw-l"}>
              <Word plain />
            </span>
            <span className={COPY + " fw-r"}>
              <Word plain />
            </span>
          </span>
        </span>
      </div>
      <CopyLinePicture pic={pic} />

      {/* clipped to the band: the picture's box runs past its foot, and unclipped it lengthened the page */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden max-lg:hidden">
        <div className={FIT}>
          {LABELS.map(({ text, x, y, side, strong }) => {
            const at = place(x, y, side);
            return (
              <div
                key={text}
                className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center font-sans"
                style={{ left: `${at.left}%`, top: `${at.top}%` }}
              >
                <span
                  className={
                    "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[12px] tracking-[-0.01em] " +
                    (strong
                      ? "border-transparent bg-[#0a152d] text-white"
                      : "border-slate-200/80 bg-white/85 text-[#0a1b33]")
                  }
                >
                  <i className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {text}
                </span>
                <span className="h-7 w-px bg-[#0a1b33]/30" />
                <span className="-mb-[3.5px] h-[7px] w-[7px] rounded-full border-2 border-white bg-accent" />
              </div>
            );
          })}
        </div>
      </div>

      {/* the mark cresting from behind the word, solid through its top 60% and fading over its last 40%
          into the word on a smoothstep curve (soft at both ends), in its own fills (SixLabsLogo's fade) */}
      <span className="absolute left-1/2 top-[calc(72px+0.03em)] h-[0.95em] w-[0.95em] -translate-x-1/2 md:top-[calc(150px+0.03em)]">
        <SixLabsLogo className="block h-full w-full" fade />
      </span>

      {/* the clear air and the crest, then the word, standing whole a little up off the tail's hairline */}
      <div className="relative z-[1] pt-[calc(72px+0.46em)] md:pt-[calc(150px+0.46em)]">
        <span className="block h-[1.04em] overflow-hidden text-center">
          <span className="foot-word font-semibold tracking-[-0.055em] text-[#0a1b33]">
            <span className={COPY}>
              <Word />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
