// One inline link spec where the site has two drifted ones (Hero.tsx:212 at offset 4 and 200ms, Closing.tsx:38
// at offset 3 and 300ms). A 1px underline in the strong hairline, 3px under 15px text and 4px from 15px
// (the clamp does it from the font size), turning accent with the text over 300ms. Visited looks the
// same as rest. A press thickens the underline to 2px, with a forced twin. No href means it is not a link,
// so href is required. Internal paths use a Next Link.
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { FOCUS } from "./focus";
import { forceAttr, type ForceState } from "./force";
import { ICON_STROKE } from "./token-shape";
export type TextLinkTone = "inherit" | "ink" | "muted";

const TONE: Record<TextLinkTone, string> = {
  inherit: "",
  ink: "text-(--ds-color-ink)",
  muted: "text-(--ds-color-text-muted)",
};

const LINK =
  "group rounded-(--ds-radius-mark-xs) underline decoration-1 decoration-(--ds-color-line-strong) " +
  "underline-offset-[clamp(3px,1em_-_11px,4px)] transition-[color,text-decoration-color] " +
  "duration-(--ds-dur-line) ease-(--ds-ease-out) hover:text-(--ds-color-accent) hover:decoration-(--ds-color-accent) " +
  "data-[force=hover]:text-(--ds-color-accent) data-[force=hover]:decoration-(--ds-color-accent) " +
  "active:decoration-2 data-[force=pressed]:text-(--ds-color-accent) data-[force=pressed]:decoration-(--ds-color-accent) " +
  "data-[force=pressed]:decoration-2";

const GLYPH = "ml-0.5 inline-block align-[-0.125em]";

export type TextLinkProps = {
  href: string;
  tone?: TextLinkTone;
  /** opens a new tab: ArrowUpRight 14, rel noopener, and a hidden note for screen readers */
  external?: boolean;
  /** a trailing ArrowRight 14 that moves 2px on hover */
  arrow?: boolean;
  /** rest, hover, focus-visible or pressed for a StateGrid cell */
  forceState?: ForceState;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: ReactNode;
};

export function TextLink({
  href,
  tone = "inherit",
  external = false,
  arrow = false,
  forceState,
  onClick,
  className = "",
  children,
}: TextLinkProps) {
  const props = {
    className: `${LINK} ${FOCUS} ${TONE[tone]} ${className}`,
    "data-force": forceAttr(forceState),
    onClick,
  };
  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          size={14}
          strokeWidth={ICON_STROKE[14]}
          className={
            `${GLYPH} transition-transform duration-(--ds-dur-line) ease-(--ds-ease-out) ` +
            "group-hover:translate-x-0.5 group-data-[force=hover]:translate-x-0.5"
          }
        />
      )}
      {external && (
        <>
          <ArrowUpRight aria-hidden size={14} strokeWidth={ICON_STROKE[14]} className={GLYPH} />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {inner}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} {...props}>
      {inner}
    </a>
  );
}
