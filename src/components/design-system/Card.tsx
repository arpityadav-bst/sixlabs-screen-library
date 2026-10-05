"use client";

// One card part for the whole system, after the three the site ships (the job card, the player selector
// card and the comparison pair). The variant says what it does (static, clickable, selectable) and the
// tone says where it sits (the white surface, the container grey, the primary navy, the players' blue), so
// a card on blue can still be static or picked. A card is one interactive element: the whole card is the
// link or the button, and nothing else inside it takes focus. Selected draws a navy line with a 20px navy
// check, never an accent fill. The sheen is the job card's pointer light, drawn without a mask or a filter.
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { createContext, type HTMLAttributes, type PointerEvent, type ReactNode } from "react";
import styles from "./card.module.css";
import { CARD_BASE, CARD_SIZE, CARD_TONE, cardRing, type CardSize, type CardTone, type CardVariant } from "./card-styles";
import { forceAttr, forces, type ForceState } from "./force";
import { SPRING } from "./motion";
import { Skeleton } from "./Skeleton";
import { ICON_STROKE } from "./token-shape";
export type { CardSize, CardTone, CardVariant } from "./card-styles";
export type CardElement = "article" | "button" | "a";

/** What the parts inside need to know: a button card holds phrasing content only, so titles become spans. */
export const CardContext = createContext<{ element: CardElement; size: CardSize; selectable: boolean }>({
  element: "article",
  size: "feature",
  selectable: false,
});

export type CardProps = {
  variant?: CardVariant;
  tone?: CardTone;
  size?: CardSize;
  /** the element, by default article (static), a with href or button (clickable), button (selectable) */
  as?: CardElement;
  href?: string;
  onClick?: () => void;
  /** selectable: called with the next pressed state */
  onToggle?: (next: boolean) => void;
  selected?: boolean;
  disabled?: boolean;
  /** swaps the content for a skeleton composite of the same size, aria-busy */
  loading?: boolean;
  /** the job card's pointer light along the stroke */
  sheen?: boolean;
  /** draws the focus ring inside, for a card in a scroll row whose overflow would clip it */
  inset?: boolean;
  forceState?: ForceState;
  "aria-label"?: string;
  className?: string;
  children?: ReactNode;
};

function Placeholder({ size, tone }: { size: CardSize; tone: CardTone }) {
  const ground = tone === "container" ? "container" : "light";
  if (size === "row")
    return (
      <span className="flex w-full items-center gap-3">
        <Skeleton shape="circle" width={32} ground={ground} />
        <Skeleton shape="line" width="50%" ground={ground} />
      </span>
    );
  return (
    <span className="flex w-full flex-col">
      <Skeleton shape="title" width="55%" ground={ground} />
      <Skeleton shape="line" lines={2} ground={ground} className="mt-3" />
      {size === "feature" && <Skeleton shape="rect" height={96} ground={ground} className="mt-6" />}
      <span className="sr-only">Loading</span>
    </span>
  );
}

function Tick({ tone, size }: { tone: CardTone; size: CardSize }) {
  const still = useReducedMotion();
  const place = size === "row" ? "right-3 top-1/2 -translate-y-1/2" : "right-4 top-4";
  const colour =
    tone === "inverse" ? "bg-(--ds-color-surface) text-(--ds-color-primary)" : "bg-(--ds-color-primary) text-white";
  return (
    <motion.span
      aria-hidden
      data-card-check=""
      initial={still ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={SPRING.thumb}
      className={`absolute ${place} grid h-5 w-5 place-items-center rounded-full ${colour}`}
    >
      <Check size={12} strokeWidth={ICON_STROKE[12]} />
    </motion.span>
  );
}

export function Card({
  variant = "static",
  tone = "surface",
  size = "feature",
  as,
  href,
  onClick,
  onToggle,
  selected: selectedProp = false,
  disabled: disabledProp = false,
  loading: loadingProp = false,
  sheen = false,
  inset = false,
  forceState,
  "aria-label": ariaLabel,
  className = "",
  children,
}: CardProps) {
  const disabled = disabledProp || forces(forceState, "disabled");
  const loading = loadingProp || forces(forceState, "loading");
  const selectable = variant === "selectable";
  const selected = selectable && (selectedProp || forces(forceState, "selected"));
  const interactive = variant !== "static";
  const element: CardElement = as ?? (variant === "static" ? "article" : variant === "clickable" && href ? "a" : "button");
  const lift = variant === "clickable" || (selectable && tone === "onBlue" && !selected);

  const track = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  const press = () => {
    if (disabled || loading) return;
    if (selectable) onToggle?.(!selected);
    onClick?.();
  };

  const common: HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined> = {
    className: [
      CARD_BASE,
      styles["ds-card"],
      CARD_SIZE[size],
      CARD_TONE[tone],
      interactive ? cardRing(tone, inset) : "",
      interactive && !disabled ? "cursor-pointer" : "",
      selectable && size === "row" ? "pr-11" : "",
      className,
    ].join(" "),
    "data-tone": tone,
    "data-interactive": interactive && !loading ? "" : undefined,
    "data-lift": lift && !loading ? "" : undefined,
    "data-selectable": selectable ? "" : undefined,
    "data-selected": selected ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
    "data-sheen": sheen && !loading ? "" : undefined,
    "data-force": forceAttr(forceState),
    "aria-busy": loading || undefined,
    "aria-label": ariaLabel,
    onPointerMove: sheen && !loading ? track : undefined,
  };

  const body = (
    <CardContext.Provider value={{ element, size, selectable }}>
      {loading ? <Placeholder size={size} tone={tone} /> : children}
      {selected && !loading && <Tick tone={tone} size={size} />}
    </CardContext.Provider>
  );

  if (element === "button")
    return (
      <button
        {...common}
        type="button"
        disabled={disabled}
        aria-pressed={selectable ? selected : undefined}
        aria-disabled={loading || undefined}
        onClick={press}
      >
        {body}
      </button>
    );
  if (element === "a")
    return (
      <a
        {...common}
        href={disabled || loading ? undefined : href}
        aria-disabled={disabled || loading || undefined}
        onClick={onClick ? press : undefined}
      >
        {body}
      </a>
    );
  return <article {...common}>{body}</article>;
}
