// 6labs wordmark. The 6 is Inter at its heaviest weight, filled with a slowly swirling potion. LABS is
// drawn by hand at the same height and a lighter weight: an L whose foot runs under the A, an A with no
// crossbar, a B with no spine and an S. Each letter stands in front of the one before it (S over B over A
// over L) and cuts a thin gap into it, so they read as shapes standing one ahead of the next.
// Units: cap height 100. W is the LABS stroke width, G the gap a front letter cuts around itself.
const W = 15;
const G = 6;
const h = W / 2;

const L = `M${h} 0 V${100 - h} H64`;
const A = "M30 100 L57 0 L73 0 L100 100 L82.5 100 L65 35.2 L47.5 100 Z";
const B = `M78 ${h} H103 A20 20 0 0 1 103 ${47.5} M78 47.5 H107 A22.5 22.5 0 0 1 107 ${100 - h} H78`;
const S = "M172 20 C166 10 158 7.5 150 7.5 C138 7.5 130 14 130 26 C130 50 174 42 174 71 C174 85 164 92.5 150 92.5 C140 92.5 131 88 126 78";

const stroke = { fill: "none", strokeWidth: W, strokeLinejoin: "miter" as const };
const cut = { fill: "none", stroke: "#000", strokeWidth: W + 2 * G };

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.06em] leading-none ${className}`} aria-label="6labs">
      <span aria-hidden className="potion font-sans font-black">6</span>
      <svg aria-hidden viewBox="0 0 182 100" className="h-[0.727em] w-auto overflow-visible text-[#0a1b33]">
        <defs>
          <mask id="cut-l" maskUnits="userSpaceOnUse" x="-10" y="-10" width="210" height="120">
            <rect x="-10" y="-10" width="210" height="120" fill="#fff" />
            <path d={A} fill="#000" stroke="#000" strokeWidth={2 * G} strokeLinejoin="miter" />
          </mask>
          <mask id="cut-a" maskUnits="userSpaceOnUse" x="-10" y="-10" width="210" height="120">
            <rect x="-10" y="-10" width="210" height="120" fill="#fff" />
            <path d={B} {...cut} />
          </mask>
          <mask id="cut-b" maskUnits="userSpaceOnUse" x="-10" y="-10" width="210" height="120">
            <rect x="-10" y="-10" width="210" height="120" fill="#fff" />
            <path d={S} {...cut} />
          </mask>
        </defs>
        <path d={L} {...stroke} stroke="currentColor" mask="url(#cut-l)" />
        <path d={A} fill="currentColor" mask="url(#cut-a)" />
        <path d={B} {...stroke} stroke="currentColor" mask="url(#cut-b)" />
        <path d={S} {...stroke} stroke="currentColor" />
      </svg>
    </span>
  );
}
