// The footer's landscape (Footer.tsx), between its links and its tail: the copy line, inside the machine. A
// curved panorama of blue digital rain over a glossy grid floor, higher at the edges and dipping in the
// middle: on the left our four players walk down into the scanning arch, on the right their AI copies
// climb in rows to the edge (public/footer/copy-line.webp, generated with no text in it). The open valley
// in the middle holds the brand: the SixLabs mark standing on its horizon in a soft glow, and the huge
// wordmark across the floor below it, cropped by the tail's hairline, its colour split at its two ends
// only (.foot-word in globals.css). Over it, a few spec labels in code, each on a leader line to what it
// names, so the words stay crisp and editable; they are the page's own facts. The image fades in at its
// top and out at its foot. On a phone it crops to the valley and the labels step aside.
import { SixLabsSolid } from "./brand-marks";

const LABELS: { text: string; x: number; y: number; strong?: boolean }[] = [
  // x, y: where the leader line lands, in % of the image
  { text: "Real players", x: 10.3, y: 32 },
  { text: "Copied from what they do", x: 25.7, y: 28 },
  { text: "Explores every menu", x: 69.7, y: 56 },
  { text: "Pays when the value is clear", x: 84, y: 52 },
  { text: "1,000,000+ player models", x: 93, y: 38, strong: true },
];

const COPY = "block whitespace-nowrap";

// the wordmark, its accent 6 as in the header's logo (the colour-split copies take theirs plain)
export const Word = ({ plain }: { plain?: boolean }) => (
  <>
    <span className={plain ? "" : "text-accent"}>6</span>labs
  </>
);

export function CopyLine() {
  return (
    <div className="relative mt-12 aspect-[2688/1152] w-full overflow-hidden max-md:aspect-[4/3] md:mt-20">
      {/* eslint-disable-next-line @next/next/no-img-element -- a static, pre-sized image with its own srcset */}
      <img
        src="/footer/copy-line.webp?v=2"
        srcSet="/footer/copy-line-1344.webp?v=2 1344w, /footer/copy-line.webp?v=2 2688w"
        sizes="100vw"
        width={2688}
        height={1152}
        loading="lazy"
        decoding="async"
        alt="Four players walk down into a scanning arch inside a world of blue digital rain, and their AI copies climb away in rows on the other side."
        className="absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_80%,transparent)]"
      />

      {/* the mark, standing on the valley's horizon; the glow on its own box, clear of any mask */}
      <div
        aria-hidden
        className="absolute bottom-[42%] left-1/2 aspect-[95.04/105.54] h-[30%] -translate-x-1/2 drop-shadow-[0_0_28px_rgba(26,109,255,0.45)]"
      >
        <div className="absolute -inset-[35%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),rgba(255,255,255,0))]" />
        <SixLabsSolid className="relative block h-full w-full text-accent" />
      </div>

      {LABELS.map(({ text, x, y, strong }) => (
        <div
          key={text}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center max-lg:hidden"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <span
            className={
              "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-sans text-[12px] tracking-[-0.01em] " +
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

      {/* the wordmark across the valley's floor, cropped by the tail's hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 font-display text-[clamp(84px,19vw,300px)]"
      >
        <span className="relative block h-[0.9em] overflow-hidden text-center">
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
