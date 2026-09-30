import { useId } from "react";

// Line marks for the comparison cards (Understands.tsx), both drawn in currentColor at one line weight: the
// ChatGPT (OpenAI) mark, from Simple Icons, and the SixLabs mark (public/brand/sixlabs-mark.svg) redrawn as
// outlines at that same weight, so the two read as one icon set. The arcs' lines run inside their shapes,
// so the gaps between them stay the logo's own; the middle ring is set to keep a clear gap from them.

export function ChatGptMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

// the mark's three arc shapes, as in public/brand/sixlabs-mark.svg (also the full view's loader, HeroLoader.tsx)
export const ARCS = [
  "M41.85 56.42C41.85 54.38 42.89 52.49 44.59 51.39L83.77 22.84C84 22.67 83.99 22.33 83.75 22.18L71.84 14.8C67.97 12.4 63.07 12.4 59.2 14.8L23.68 36.8C20.15 38.99 18 42.85 18 47V51.63C18 51.96 18.16 52.27 18.43 52.45L41.22 68.22C41.49 68.4 41.85 68.22 41.85 67.89V56.42Z",
  "M107.36 94.71C110.89 92.52 113.04 88.66 113.04 84.51V47C113.04 42.85 110.89 38.99 107.36 36.8L92.1099 27.35C91.7599 27.13 91.3199 27.15 90.9899 27.4L71.7699 41.64C71.5399 41.81 71.5599 42.15 71.7999 42.3L86.3599 51.32C88.1299 52.41 89.1999 54.34 89.1999 56.42V75.08C89.1999 77.16 88.1299 79.09 86.3599 80.18L72.1799 88.96C71.9299 89.11 71.9299 89.46 72.1599 89.63L92.1099 103.44C92.4399 103.67 92.8699 103.68 93.2099 103.47L107.36 94.7V94.71Z",
  "M71.84 116.71C67.97 119.11 63.07 119.11 59.2 116.71L23.68 94.71C20.15 92.52 18 88.66 18 84.51V62.22C18 61.9 18.37 61.71 18.63 61.89L84.46 108.24C84.69 108.41 84.68 108.76 84.44 108.91L71.83 116.72L71.84 116.71Z",
];
const LINE = 5.5; // the visible line weight, matched to the ChatGPT mark

export function SixLabsMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="14.5 9.5 102 112.5"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Each arc's line is drawn inside its own shape (a stroke twice the weight, clipped to the shape), so
          the arcs keep the logo's outer edges and the gaps between them stay the logo's own, a full line
          wider than an outline drawn on the edge would leave. The ring is grown by the same half-line, so
          its gap to the arcs is as it was. */}
      <defs>
        {ARCS.map((d, k) => (
          <clipPath key={k} id={`${id}-${k}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>
      <circle cx="65.52" cy="65.76" r={12 + LINE / 2} strokeWidth={LINE} />
      {ARCS.map((d, k) => (
        <path
          key={k}
          d={d}
          strokeWidth={LINE * 2}
          clipPath={`url(#${id}-${k})`}
        />
      ))}
    </svg>
  );
}

// The SixLabs mark as the logo file itself draws it (public/brand/sixlabs-mark.svg): flat blue blades
// (#1770EF) round a navy core (#030D2D). The footer's mark behind the wordmark (CopyLine.tsx).
export function SixLabsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="18 12.99 95.04 105.54" className={className} aria-hidden>
      <circle cx="65.52" cy="65.76" r="15.41" fill="#030D2D" />
      <g fill="#1770EF">
        {ARCS.map((d, k) => (
          <path key={k} d={d} />
        ))}
      </g>
    </svg>
  );
}
