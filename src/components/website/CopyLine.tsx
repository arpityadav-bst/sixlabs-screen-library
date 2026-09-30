// The footer's wordmark band (Footer.tsx), between its links and its tail, at the height it had before the
// picture: the huge wordmark cropped by the tail's hairline, the SixLabs mark, in the header's cobalt glass, cresting from behind
// it and fading down into it (after the onBlue creators page's foot). Behind the band, filling it and nothing
// more, the copy line (public/footer/copy-line.webp, generated with no text in it): our players walk in
// from the left toward the mark and come out on the right as their AI copies, so the brand in the middle
// is where the copying happens. The picture rises out of the page on a long, eased fade that is complete
// by the players' heads. From a tablet up it runs the band's full width at its own shape, its top fifth
// cropped (FIT), so two spec labels in code, on leader lines, can sit in its own coordinates and land on
// the same heads at any width (desktop only); on a phone it covers the band. The word sits a little up
// off the hairline, whole. Colour split on the word's two ends only (.foot-word in globals.css).
import { SixLabsCobalt } from "./brand-marks";

const LABELS: { text: string; x: number; y: number; strong?: boolean }[] = [
  // x, y: where the leader line lands, in % of the picture
  { text: "Real players", x: 14.1, y: 27 },
  { text: "1,000,000+ player models", x: 86.7, y: 37, strong: true },
];

const COPY = "block whitespace-nowrap";

// the wordmark, its accent 6 as in the header's logo (the colour-split copies take theirs plain)
export const Word = ({ plain }: { plain?: boolean }) => (
  <>
    <span className={plain ? "" : "text-accent"}>6</span>labs
  </>
);

// the picture's rise out of the page: eased in and out, so no edge shows where it begins, and whole by
// the players' heads
const RISE =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.05)_6%,rgba(0,0,0,0.18)_12%,rgba(0,0,0,0.4)_18%,rgba(0,0,0,0.66)_24%,rgba(0,0,0,0.88)_30%,#000_36%)]";
// the picture's box: on a phone it covers the band; from a tablet up it is the band's width at the
// picture's own shape (2688 x 1152, so 42.857% of the width tall), set down so its top fifth is cropped
const FIT =
  "absolute max-md:inset-0 md:inset-x-0 md:top-[calc((100%-42.857cqw)*0.2)] md:aspect-[2688/1152]";

export function CopyLine() {
  return (
    // the band: the clear air, the mark's crest above the word, then the word (1em)
    <div
      aria-hidden
      className="@container relative font-display text-[clamp(84px,19vw,300px)]"
    >
      <div className={"absolute inset-0 overflow-hidden " + RISE}>
        <div className={FIT}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a static, pre-sized image with its own srcset */}
          <img
            src="/footer/copy-line.webp?v=4"
            srcSet="/footer/copy-line-1344.webp?v=4 1344w, /footer/copy-line.webp?v=4 2688w"
            sizes="100vw"
            width={2688}
            height={1152}
            loading="lazy"
            decoding="async"
            alt=""
            className="h-full w-full object-cover object-[50%_20%]"
          />
        </div>
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

      {/* the mark cresting from behind the word: the glow on the outer box, the fade on the inner one (one
          element carrying both tiles the fade across the glow's box and shows it as a square) */}
      <span className="absolute left-1/2 top-[calc(52px+0.05em)] z-0 h-[1.05em] w-[1.05em] -translate-x-1/2 drop-shadow-[0_0_0.3em_rgba(35,80,170,0.3)] md:top-[calc(100px+0.05em)]">
        <span className="block h-full w-full [mask-image:linear-gradient(180deg,#000_0%,#000_38%,rgba(0,0,0,0.34)_66%,transparent_92%)]">
          <SixLabsCobalt className="block h-full w-full" />
        </span>
      </span>

      {/* the clear air and the crest, then the word, standing whole a little up off the tail's hairline */}
      <div className="relative z-[1] pt-[calc(52px+0.5em)] md:pt-[calc(100px+0.5em)]">
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
