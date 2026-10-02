"use client";

// Rows that open in place to their content: the general form of the FAQ (Faq.tsx). The card is the FAQ
// row as it ships, and flush rows sit in a panel divided by hairlines. Each trigger is a button inside a
// heading, with aria-expanded and aria-controls, and its panel is a labelled region while the list is short
// enough for regions to help (six items or fewer). The answer opens by height and opacity over 350ms on the
// one ease, the plus turns into a minus over 300ms, and under reduced motion both happen at once. Several
// rows may be open (multiple, the FAQ's way) or one at a time (single). Up, Down, Home and End move between
// triggers. A loading row is open with Skeleton lines in place of its content.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Accordion.module.css";
import { forceAttr, type ForceState } from "./force";
import { DUR, EASE } from "./motion";
import { Skeleton, SkeletonGroup } from "./Skeleton";
import { ICON_STROKE, type IconSize } from "./token-shape";

export type AccordionItem = {
  id: string;
  title: string;
  /** a string renders as one paragraph, anything else as given */
  content: ReactNode;
  disabled?: boolean;
  /** open, with Skeleton lines in place of the content */
  loading?: boolean;
};

export type AccordionSize = "sm" | "md" | "lg";
export type AccordionVariant = "card" | "flush";
/** the StateGrid's forced state, applied to the first item: ForceState plus "open" */
export type AccordionForce = ForceState | "open";

export type AccordionProps = {
  items: readonly AccordionItem[];
  /** multiple lets rows open independently (the FAQ), single closes the others */
  type?: "single" | "multiple";
  /** ids open on first render, without animating */
  defaultOpen?: readonly string[];
  size?: AccordionSize;
  variant?: AccordionVariant;
  icon?: "plus" | "chevron";
  /** the level of the heading round each trigger */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  forceState?: AccordionForce;
  className?: string;
};

const ICON: Record<AccordionSize, IconSize> = { sm: 14, md: 16, lg: 18 };
const HEADINGS = ["h2", "h3", "h4", "h5", "h6"] as const;
const MOVE = ["ArrowDown", "ArrowUp", "Home", "End"];

const safe = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

export function Accordion({
  items,
  type = "multiple",
  defaultOpen = [],
  size = "md",
  variant = "card",
  icon = "plus",
  headingLevel = 3,
  forceState,
  className = "",
}: AccordionProps) {
  const [open, setOpen] = useState<readonly string[]>(defaultOpen);
  const still = useReducedMotion();
  const base = safe(useId());
  const root = useRef<HTMLUListElement>(null);
  const H = HEADINGS[headingLevel - 2];
  const regions = items.length <= 6;
  const iconPx = ICON[size];

  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : type === "single" ? [id] : [...o, id]));

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!MOVE.includes(e.key) || !root.current) return;
    const list = Array.from(
      root.current.querySelectorAll<HTMLButtonElement>(":scope > li > * > [data-acc-trigger]:not(:disabled)"),
    );
    const i = list.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    e.stopPropagation();
    const step = e.key === "ArrowDown" ? 1 : -1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (i + step + list.length) % list.length;
    list[next]?.focus();
  };

  return (
    <ul
      ref={root}
      data-variant={variant}
      data-size={size}
      onKeyDown={onKey}
      className={`${styles["ds-acc"]} ${className}`}
    >
      {items.map((it, k) => {
        const f = k === 0 ? forceState : undefined;
        const disabled = !!it.disabled || f === "disabled";
        const loading = !!it.loading || f === "loading";
        const isOpen = open.includes(it.id) || f === "open" || loading;
        const tid = `${base}-t-${safe(it.id)}`;
        const pid = `${base}-p-${safe(it.id)}`;
        return (
          <li
            key={it.id}
            data-acc-item=""
            data-open={isOpen || undefined}
            data-disabled={disabled || undefined}
            data-force={f && f !== "open" ? forceAttr(f) : undefined}
            className={styles["ds-acc-item"]}
          >
            <H className={styles["ds-acc-h"]}>
              <button
                type="button"
                id={tid}
                data-acc-trigger=""
                aria-expanded={isOpen}
                aria-controls={isOpen ? pid : undefined}
                disabled={disabled}
                onClick={() => toggle(it.id)}
                className={styles["ds-acc-trigger"]}
              >
                <span data-acc-title="" className={styles["ds-acc-q"]}>
                  {it.title}
                </span>
                {icon === "plus" ? (
                  <span aria-hidden data-acc-icon="" className={styles["ds-acc-plus"]}>
                    <span className={styles["ds-acc-bar"]} />
                    <span className={styles["ds-acc-bar"]} />
                  </span>
                ) : (
                  <ChevronDown
                    aria-hidden
                    data-acc-icon=""
                    size={iconPx}
                    strokeWidth={ICON_STROKE[iconPx]}
                    className={styles["ds-acc-chev"]}
                  />
                )}
              </button>
            </H>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={pid}
                  data-acc-panel=""
                  role={regions ? "region" : undefined}
                  aria-labelledby={regions ? tid : undefined}
                  aria-busy={loading || undefined}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: still ? 0 : DUR.panel, ease: EASE }}
                  className={styles["ds-acc-panel"]}
                >
                  <div className={styles["ds-acc-a"]}>
                    {loading ? (
                      <SkeletonGroup label="Loading">
                        <Skeleton lines={3} />
                      </SkeletonGroup>
                    ) : typeof it.content === "string" ? (
                      <p>{it.content}</p>
                    ) : (
                      it.content
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
