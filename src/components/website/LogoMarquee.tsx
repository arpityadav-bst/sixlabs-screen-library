// Infinite logo scroller. Pure CSS: the list is rendered twice and the track slides by -50%, so the
// loop is seamless; hovering pauses it (see .marquee in globals.css). Edges fade out with a mask.
type Logo = { src: string; alt: string; gradient: { from: string; to: string } };

const LOGOS: Logo[] = [
  { src: "https://svgl.app/library/procure.svg", alt: "Procure", gradient: { from: "#3b82f6", to: "#1d4ed8" } },
  { src: "https://svgl.app/library/shopify.svg", alt: "Shopify", gradient: { from: "#fde047", to: "#eab308" } },
  { src: "https://svgl.app/library/blender.svg", alt: "Blender", gradient: { from: "#60a5fa", to: "#2563eb" } },
  { src: "https://svgl.app/library/figma.svg", alt: "Figma", gradient: { from: "#a78bfa", to: "#7c3aed" } },
  { src: "https://svgl.app/library/spotify.svg", alt: "Spotify", gradient: { from: "#f472b6", to: "#ef4444" } },
  { src: "https://svgl.app/library/lottielab.svg", alt: "Lottielab", gradient: { from: "#facc15", to: "#84cc16" } },
  { src: "https://svgl.app/library/google-cloud.svg", alt: "Google Cloud", gradient: { from: "#bae6fd", to: "#7dd3fc" } },
  { src: "https://svgl.app/library/bing.svg", alt: "Bing", gradient: { from: "#22d3ee", to: "#14b8a6" } },
];

const MASK = "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

export function LogoMarquee() {
  return (
    <div
      className="marquee relative w-full max-w-[1400px] mx-auto overflow-hidden"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <div className="marquee-track flex w-max gap-4 py-2">
        {[...LOGOS, ...LOGOS].map((logo, k) => (
          <div
            key={`${logo.alt}-${k}`}
            className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden"
            aria-hidden={k >= LOGOS.length}
          >
            <div
              className="absolute inset-0 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              className="relative h-8 w-auto transition-all duration-300 group-hover:brightness-0 group-hover:invert"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
