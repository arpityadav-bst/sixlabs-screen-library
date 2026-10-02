"use client";

// The card's content slots, in the job card's type: the title (Outfit 20 at 500, -0.03em), the body
// (Inter 14 at 1.4) and the meta footer (mono caps over a hairline, the selector card's footer). Each takes
// its colour from the card's tone. Inside a button card the title is a span, since a button holds
// phrasing content only, and a selectable card's title leaves room for the check.
import { useContext, type ReactNode } from "react";
import { CardContext } from "./Card";
import { PART_TONE } from "./card-styles";

export function CardTitle({
  as,
  className = "",
  children,
}: {
  as?: "h2" | "h3" | "h4" | "span";
  className?: string;
  children: ReactNode;
}) {
  const { element, size, selectable } = useContext(CardContext);
  const Tag = as ?? (element === "button" ? "span" : "h3");
  const scale =
    size === "feature"
      ? "text-[20px] leading-tight tracking-[-0.03em]"
      : size === "compact"
        ? "text-[18px] leading-tight tracking-tight"
        : "text-[15px] leading-5 tracking-tight";
  return (
    <Tag
      className={
        `block font-display font-medium ${scale} ${PART_TONE.title} ` +
        (selectable && size !== "row" ? "pr-8 " : "") +
        className
      }
    >
      {children}
    </Tag>
  );
}

export function CardBody({ className = "", children }: { className?: string; children: ReactNode }) {
  const { size } = useContext(CardContext);
  // the feature card's 9 is a named mirror of the job card's body (Jobs.tsx:167), off the grid by the site's
  // own choice, and listed in the guide's off-grid table. New spacing stays on 4.
  const space = size === "row" ? "" : size === "feature" ? "mt-[9px]" : "mt-2";
  return (
    <span className={`block font-sans text-[14px] leading-[1.4] tracking-[-0.01em] ${space} ${PART_TONE.body} ${className}`}>
      {children}
    </span>
  );
}

/** The footer line: a left and a right part in mono caps, over a hairline. */
export function CardMeta({
  start,
  end,
  className = "",
}: {
  start: ReactNode;
  end?: ReactNode;
  className?: string;
}) {
  // the outer span takes the free height (mt-auto) and keeps 24px above the rule, the inner one is the line
  return (
    <span className={`mt-auto block w-full pt-6 ${className}`}>
      <span
        className={
          "flex items-center justify-between gap-3 border-t pt-4 font-(family-name:--ds-font-mono) " +
          `text-[11px] uppercase leading-4 tracking-[0.14em] ${PART_TONE.meta}`
        }
      >
        <span>{start}</span>
        {end && <span className="flex items-center gap-1.5">{end}</span>}
      </span>
    </span>
  );
}
