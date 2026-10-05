"use client";

// The system button. Primary reads as the shipped Try now's family: a navy #0a152d pill with an Inter 500
// label that grows a little on hover and settles on the press spring, and at xl the dot band sweeps it.
// Under reduced motion the grow is dropped, the press lands at once and the colour change stays.
// Try now itself stays the hero's call to action. This one works as a real control: it takes onClick,
// renders an anchor for href (a Next Link for internal paths) and carries every state as a prop, so the
// StateGrid can force each one. Icon-only actions are IconButton.
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useRef, type MouseEvent, type ReactNode, type RefObject } from "react";
import {
  BUTTON_BASE,
  BUTTON_HOVER,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  GROWS,
  LINK_SIZE,
  ON_BLUE_VARIANTS,
  PRIMARY_SWEEP,
  SELECTABLE,
  type ButtonSize,
  type ButtonVariant,
} from "./button-styles";
import { useButtonSweep } from "./ButtonSweep";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { SCALE, SPRING } from "./motion";
import { Spinner } from "./Spinner";
import { ICON_STROKE } from "./token-shape";

const MotionLink = motion.create(Link);

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  /** aria-busy, the label hidden at opacity 0, a centred spinner, clicks ignored */
  loading?: boolean;
  /** a toggle: aria-pressed, secondary, tertiary and ghost fill navy. Leave it
   * unset on a plain action, so it is not announced as a toggle. */
  selected?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** renders an anchor, a Next Link when the path starts with "/" */
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  /** a StateGrid cell's state: hover, focus-visible and pressed show as data-force, the rest as props */
  forceState?: ForceState;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon: Leading,
  trailingIcon: Trailing,
  loading: loadingProp = false,
  selected: selectedProp,
  disabled: disabledProp = false,
  fullWidth = false,
  href,
  onClick,
  type = "button",
  forceState,
  className = "",
  "aria-label": ariaLabel,
  children,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const sweep = useButtonSweep(ref);
  const still = !!useReducedMotion();
  const disabled = disabledProp || forces(forceState, "disabled");
  const loading = loadingProp || forces(forceState, "loading");
  const toggle = SELECTABLE.includes(variant) && (selectedProp !== undefined || forces(forceState, "selected"));
  const selected = toggle && (!!selectedProp || forces(forceState, "selected"));
  const force = forceAttr(forceState);
  const live = !disabled && !loading;
  const swept = variant === "primary" && size === "xl" && live;

  const big = size === "lg" || size === "xl";
  const grow = GROWS.includes(variant) ? (big ? SCALE.growLarge : SCALE.grow) : 1;
  const press = variant === "link" ? 1 : SCALE.pressPill;
  const scale = force === "hover" ? grow : force === "pressed" ? press : 1;

  const { box, icon, spinner } = BUTTON_SIZE[size];
  const stroke = ICON_STROKE[icon];
  const classes = [
    BUTTON_BASE,
    variant === "link" ? LINK_SIZE[size] : box,
    swept ? PRIMARY_SWEEP : BUTTON_VARIANT[variant],
    live && !swept ? BUTTON_HOVER[variant] : "",
    ON_BLUE_VARIANTS.includes(variant) ? FOCUS_INVERSE : FOCUS,
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const shared = {
    className: classes,
    "data-force": force,
    "aria-busy": loading || undefined,
    "aria-label": ariaLabel,
    animate: { scale },
    whileHover: live && !force && !still && grow !== 1 ? { scale: grow } : undefined,
    whileTap: live && !force && press !== 1 ? { scale: press } : undefined,
    transition: still ? { duration: 0 } : SPRING.press,
    onHoverStart: swept ? sweep.start : undefined,
    onHoverEnd: swept ? sweep.end : undefined,
    onFocus: swept
      ? (e: { currentTarget: HTMLElement }) => e.currentTarget.matches(":focus-visible") && sweep.start()
      : undefined,
    onBlur: swept ? sweep.end : undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (!live) return e.preventDefault();
      onClick?.(e);
    },
  };

  const content = (
    <>
      {swept && sweep.layer}
      <span className={`relative inline-flex items-center gap-[inherit] ${loading ? "opacity-0" : ""}`}>
        {Leading && <Leading aria-hidden size={icon} strokeWidth={stroke} className="shrink-0" />}
        <span>{children}</span>
        {Trailing && <Trailing aria-hidden size={icon} strokeWidth={stroke} className="shrink-0" />}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size={spinner} delay={0} decorative />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    if (disabled) {
      return (
        <motion.a ref={ref as RefObject<HTMLAnchorElement>} {...shared} aria-disabled="true" role="link">
          {content}
        </motion.a>
      );
    }
    if (href.startsWith("/")) {
      return (
        <MotionLink ref={ref as RefObject<HTMLAnchorElement>} href={href} {...shared}>
          {content}
        </MotionLink>
      );
    }
    return (
      <motion.a ref={ref as RefObject<HTMLAnchorElement>} href={href} {...shared}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      aria-pressed={toggle ? selected : undefined}
      {...shared}
    >
      {content}
    </motion.button>
  );
}
