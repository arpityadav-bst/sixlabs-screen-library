// The footer's landscape (Footer.tsx), between its links and its tail: the copy line. Our four players walk
// in from the left, pass through the scanning arch and come out as their AI copies, which multiply into
// rows to the horizon (public/footer/copy-line.webp, generated with no text in it). Over it, a few spec
// labels in code, each on a leader line to what it names, so the words stay crisp and editable; they are
// the page's own facts. The image fades in at its top and out at its foot, and the huge wordmark stands in
// front of that foot, cropped by the tail's hairline, its colour split at its two ends only (.foot-word in
// globals.css). On a phone the image crops to the arch and the labels step aside.

const LABELS: { text: string; x: number; y: number; strong?: boolean }[] = [
  // x, y: where the leader line lands, in % of the image
  { text: "Real players", x: 16, y: 30 },
  { text: "Copied from what they do", x: 45.5, y: 22 },
  { text: "1,000,000+ player models", x: 72, y: 36, strong: true },
  { text: "Explores every menu", x: 58, y: 40 },
  { text: "Pays when the value is clear", x: 86, y: 41 },
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
    <div className="relative mt-12 md:mt-20">
      <div className="relative aspect-[2688/1152] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_72%,transparent)] max-md:aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element -- a static, pre-sized image with its own srcset */}
        <img
          src="/footer/copy-line.webp"
          srcSet="/footer/copy-line-1344.webp 1344w, /footer/copy-line.webp 2688w"
          sizes="100vw"
          width={2688}
          height={1152}
          loading="lazy"
          decoding="async"
          alt="Four players walk through a scanning arch and come out as rows of AI copies that stretch to the horizon."
          className="absolute inset-0 h-full w-full object-cover object-[38%_0%]"
        />
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
      </div>

      {/* the wordmark, over the image's faded foot */}
      <div
        aria-hidden
        className="relative -mt-[0.62em] font-display text-[clamp(84px,19vw,300px)]"
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
