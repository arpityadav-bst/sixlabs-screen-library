"use client";

// A round icon-only action on one size ladder. The label is required: it is the accessible name, and with
// showLabelOnHover it also widens in beside the icon, as the hero's wave button does. Pressed settles to
// 0.94 on the press spring, dropped under reduced motion. Toggled (selected) fills navy on light grounds and
// white on the blue, never the accent, and can cross-fade to a second icon with a quarter turn (Menu to X).
// Solid is a pure action: it has no toggled state and ignores selected, with a warning in development.
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useEffect, type MouseEvent, type ReactNode } from "react";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import {
  ICON_BUTTON_BASE,
  ICON_BUTTON_HOVER,
  ICON_BUTTON_SIZE,
  ICON_BUTTON_VARIANT,
  ICON_TOGGLES,
  REVEAL_HOVER,
  REVEAL_LABEL,
  revealPad,
  type IconButtonSize,
  type IconButtonVariant,
} from "./icon-button-styles";
import { SCALE, SPRING } from "./motion";
import { Spinner } from "./Spinner";
import { ICON_STROKE } from "./token-shape";

const MotionLink = motion.create(Link);

export type IconButtonProps = {
  icon: LucideIcon;
  /** the accessible name, and the visible label with showLabelOnHover */
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  loading?: boolean;
  /** a toggle: aria-pressed. Leave unset on a plain action. Solid ignores it, since it is an action only. */
  selected?: boolean;
  /** the icon a toggled button shows, cross-faded in with a quarter turn */
  toggledIcon?: LucideIcon;
  showLabelOnHover?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** a count Badge or a StatusDot, pinned by the caller */
  badge?: ReactNode;
  /** hover, focus-visible and pressed show as data-force, disabled, loading and toggled as props */
  forceState?: ForceState;
  className?: string;
};

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  variant = "ghost",
  loading: loadingProp = false,
  selected: selectedProp,
  toggledIcon: Toggled,
  showLabelOnHover = false,
  disabled: disabledProp = false,
  href,
  onClick,
  badge,
  forceState,
  className = "",
}: IconButtonProps) {
  const still = !!useReducedMotion();
  const disabled = disabledProp || forces(forceState, "disabled");
  const loading = loadingProp || forces(forceState, "loading");
  const toggles = ICON_TOGGLES.includes(variant);
  const asked = selectedProp !== undefined || forces(forceState, "selected", "toggled");
  const toggle = toggles && asked;
  const on = toggle && (!!selectedProp || forces(forceState, "selected", "toggled"));
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && asked && !toggles) {
      console.warn(`IconButton "${label}": the ${variant} variant is an action only, so selected is ignored.`);
    }
  }, [asked, toggles, variant, label]);
  const force = forceAttr(forceState);
  const live = !disabled && !loading;
  const s = ICON_BUTTON_SIZE[size];
  const stroke = ICON_STROKE[s.icon];

  const shared = {
    className: [
      ICON_BUTTON_BASE,
      showLabelOnHover ? s.h : s.box,
      ICON_BUTTON_VARIANT[variant],
      live ? ICON_BUTTON_HOVER[variant] : "",
      variant === "glass" ? FOCUS_INVERSE : FOCUS,
      className,
    ].join(" "),
    "aria-label": label,
    "aria-busy": loading || undefined,
    "data-force": force,
    style: showLabelOnHover ? { paddingInline: revealPad(size) } : undefined,
    animate: { scale: force === "pressed" ? SCALE.pressRound : 1 },
    whileTap: live && !force && !still ? { scale: SCALE.pressRound } : undefined,
    transition: still ? { duration: 0 } : SPRING.press,
    onClick: (e: MouseEvent<HTMLElement>) => {
      if (!live) return e.preventDefault();
      onClick?.(e);
    },
  };

  const turn = "transition-[opacity,rotate] duration-(--ds-dur-quick) ease-(--ds-ease-out) motion-reduce:transition-none";
  const glyph = loading ? (
    <Spinner size={s.spinner} delay={0} decorative />
  ) : Toggled ? (
    <span className="relative grid place-items-center">
      <Icon aria-hidden size={s.icon} strokeWidth={stroke} className={`${turn} ${on ? "rotate-90 opacity-0" : ""}`} />
      <Toggled
        aria-hidden
        size={s.icon}
        strokeWidth={stroke}
        className={`absolute ${turn} ${on ? "" : "-rotate-90 opacity-0"}`}
      />
    </span>
  ) : (
    <Icon aria-hidden size={s.icon} strokeWidth={stroke} />
  );

  const content = (
    <>
      {showLabelOnHover && (
        <span aria-hidden className={`${REVEAL_LABEL} ${live ? REVEAL_HOVER : ""}`}>
          {label}
        </span>
      )}
      {glyph}
      {badge}
    </>
  );

  if (href !== undefined && !disabled) {
    const Comp = href.startsWith("/") ? MotionLink : motion.a;
    return (
      <Comp href={href} {...shared}>
        {content}
      </Comp>
    );
  }
  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-pressed={toggle ? on : undefined}
      {...shared}
    >
      {content}
    </motion.button>
  );
}
