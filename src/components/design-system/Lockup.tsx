// The lockup as one part: the mark and the 6labs wordmark, which the site writes inline twice (Header.tsx:64,
// Footer.tsx:34). Three sizes on one ratio, so a smaller lockup is the header's scaled, not redrawn. Ink is
// the logo file plus the real Word with its accent 6. onBlue is the outline mark in white with the plain
// Word, because the flat blades (#1770EF) vanish on the accent. No hover, as shipped: the lockup is a way
// home, not a call to action. As a link it takes the focus ring of its ground.
import Link from "next/link";
import { SixLabsMark } from "@/components/website/brand-marks";
import { Word } from "@/components/website/CopyLine";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, type ForceState } from "./force";

export type LockupSize = "sm" | "md" | "lg";
export type LockupTone = "ink" | "onBlue";

/** px: the mark's square, the wordmark's size and line, the gap, and the clear space (the core circle's
 *  diameter, 30.82 of the mark's 105.54, so 0.292 of the mark, rounded) */
export const LOCKUP_SIZES: Record<LockupSize, { mark: number; word: number; leading: number; gap: number; clear: number }> = {
  sm: { mark: 24, word: 18, leading: 24, gap: 8, clear: 7 },
  md: { mark: 32, word: 24, leading: 32, gap: 10, clear: 9 },
  lg: { mark: 44, word: 32, leading: 44, gap: 12, clear: 13 },
};

const SIZE: Record<LockupSize, { root: string; mark: string; word: string }> = {
  sm: { root: "gap-2", mark: "h-6 w-6", word: "text-[18px] leading-6" },
  md: { root: "gap-2.5", mark: "h-8 w-8", word: "text-2xl" },
  lg: { root: "gap-3", mark: "h-11 w-11", word: "text-[32px] leading-[44px]" },
};

const TONE: Record<LockupTone, { word: string; ring: string }> = {
  ink: { word: "text-(--ds-color-ink)", ring: FOCUS },
  onBlue: { word: "text-white", ring: FOCUS_INVERSE },
};

export type LockupProps = {
  size?: LockupSize;
  tone?: LockupTone;
  /** ".ai" in the footer's form */
  suffix?: string;
  /** a link home. Paths that start with / use a Next Link */
  href?: string;
  /** rest or focus-visible for a StateGrid cell (hover is rest, by design) */
  forceState?: ForceState;
  className?: string;
};

export function Lockup({ size = "md", tone = "ink", suffix, href, forceState, className = "" }: LockupProps) {
  const sz = SIZE[size];
  const px = LOCKUP_SIZES[size].mark;
  const inner = (
    <>
      {tone === "ink" ? (
        // eslint-disable-next-line @next/next/no-img-element -- a fixed mark, as the header draws it
        <img data-lockup-mark src="/brand/sixlabs-mark.svg" alt="" width={px} height={px} className={`block ${sz.mark}`} />
      ) : (
        <span data-lockup-mark className={`block ${sz.mark}`}>
          <SixLabsMark className="block h-full w-full text-white" />
        </span>
      )}
      <span data-lockup-word className={`font-display font-medium tracking-tight ${sz.word} ${TONE[tone].word}`}>
        {tone === "ink" ? <Word /> : <Word plain />}
        {suffix}
      </span>
    </>
  );
  const root = `inline-flex items-center ${sz.root} ${className}`;
  if (!href) return <span data-lockup className={root}>{inner}</span>;
  const linkProps = {
    "data-lockup": "",
    className: `${root} rounded-(--ds-radius-mark-sm) ${TONE[tone].ring}`,
    "data-force": forceAttr(forceState),
  };
  return href.startsWith("/") ? (
    <Link href={href} {...linkProps}>
      {inner}
    </Link>
  ) : (
    <a href={href} {...linkProps}>
      {inner}
    </a>
  );
}
