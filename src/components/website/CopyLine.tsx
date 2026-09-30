// The footer's wordmark band (Footer.tsx), between its links and its tail, at the height it had before the
// picture: the huge wordmark sitting a little up off the tail's hairline, and the SixLabs mark, in the
// header's cobalt glass, over it with its blades slowly turning (after the onBlue creators page's
// foot). Around them, nothing but the copy line (public/footer/copy-line.webp, generated on plain white
// with no text in it): our players and a crowd behind them walk in from the left toward the mark, and come
// out on the right as their AI copies, in their own clothes with a plain white face (as in the hero's tiles) and the
// blue lines at the neck, so the brand in the middle is where the copying happens. The picture has no ground and no scene:
// it is multiplied into the page, so its white is the page and only the people show, and their legs
// dissolve into the page before the hairline. From a tablet up it runs the band's full width at its own
// shape (FIT), so two spec labels in code, on leader lines, can sit in its own coordinates and land on the
// same heads at any width (desktop only); on a phone it covers the band. Colour split on the word's two
// ends only (.foot-word in globals.css).
import { SixLabsCobalt } from "./brand-marks";

// The picture is drawn as two halves pushed apart by SPREAD (% of its width): the players a little further
// left, the copies a little further right, the empty white middle between them simply wider. Its halves
// meet in that white, so the split never shows.
const SPREAD = 3;
const HALVES = [
  "[clip-path:inset(0_50%_0_0)] -translate-x-[3%]",
  "[clip-path:inset(0_0_0_50%)] translate-x-[3%]",
];

const LABELS: { text: string; x: number; y: number; strong?: boolean }[] = [
  // x, y: where the leader line lands, in % of the picture
  { text: "Real players", x: 16.7 - SPREAD, y: 14 },
  { text: "1,000,000+ player models", x: 74.4 + SPREAD, y: 15, strong: true },
];

const COPY = "block whitespace-nowrap";

// the wordmark, its accent 6 as in the header's logo (the colour-split copies take theirs plain)
export const Word = ({ plain }: { plain?: boolean }) => (
  <>
    <span className={plain ? "" : "text-accent"}>6</span>labs
  </>
);

// the picture's edges: a hair at the top, and a long dissolve of the legs into the page at the foot
const RISE =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_4%,#000_58%,rgba(0,0,0,0.72)_70%,rgba(0,0,0,0.38)_82%,rgba(0,0,0,0.12)_92%,transparent_100%)]";
// the picture's box: on a phone it covers the band; from a tablet up it is the band's width at the
// picture's own shape (2688 x 1152, so 42.857% of the width tall), set so a twentieth of its extra height is cropped from the top
const FIT =
  "absolute max-md:inset-0 md:inset-x-0 md:top-[calc((100%-42.857cqw)*0.05)] md:aspect-[2688/1152]";

export function CopyLine() {
  return (
    // the band: the clear air, the mark's crest above the word, then the word (1em)
    <div
      aria-hidden
      className="@container relative font-display text-[clamp(84px,19vw,300px)]"
    >
      <div
        className={
          "absolute inset-0 overflow-hidden mix-blend-multiply " + RISE
        }
      >
        {HALVES.map((half) => (
          <div key={half} className={FIT + " " + half}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a static, pre-sized image with its own srcset */}
            <img
              src="/footer/copy-line.webp?v=7"
              srcSet="/footer/copy-line-1344.webp?v=7 1344w, /footer/copy-line.webp?v=7 2688w"
              sizes="100vw"
              width={2688}
              height={1152}
              loading="lazy"
              decoding="async"
              alt=""
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </div>
        ))}
      </div>

      {/* clipped to the band: the picture's box runs past its foot, and unclipped it lengthened the page */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden max-lg:hidden">
        <div className={FIT}>
          {LABELS.map(({ text, x, y, strong }) => (
            <div
              key={text}
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center font-sans"
              style={{ left: `${x}%`, top: `${y}%` }}
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
          ))}
        </div>
      </div>

      {/* the mark over the word, its lower edge tucked behind it, its three blades turning slowly about the
          core (.mark-spin) */}
      <span className="absolute left-1/2 top-[calc(72px-0.12em)] h-[0.8em] w-[0.8em] -translate-x-1/2 md:top-[calc(150px-0.12em)]">
        <SixLabsCobalt spin className="relative block h-full w-full" />
      </span>

      {/* the clear air and the crest, then the word, standing whole a little up off the tail's hairline */}
      <div className="relative z-[1] pt-[calc(72px+0.5em)] md:pt-[calc(150px+0.5em)]">
        <span className="block h-[1em] overflow-hidden text-center">
          <span className="foot-word font-semibold tracking-[-0.055em] text-[#0a1b33]">
            <span className={COPY + " relative z-[1]"}>
              <Word />
            </span>
            <span className={COPY + " fw-l z-[2]"}>
              <Word plain />
            </span>
            <span className={COPY + " fw-r z-[2]"}>
              <Word plain />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
