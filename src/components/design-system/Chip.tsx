"use client";

// An interactive pill, which the site does not have yet. Filter chips are toggle buttons (place them in a
// labelled group), choice chips are radios (ChipGroup is the radiogroup, one tab stop that owns the arrow
// keys), and input chips hold a value with a remove button that Backspace or Delete also fires (set them in
// ChipInputGroup, which moves focus on once one goes). Selected fills navy with a check that grows in from
// nothing, never the accent, and moves to the primary hover under the pointer (white 90% on the blue).
// Hover answers only a live chip. A removed chip collapses over dur-quick (160ms), at once under reduced
// motion. On the players' blue the label sits on the blue itself in white, with no glass fill under it, so
// it keeps 4.49:1.
import { useReducedMotion } from "motion/react";
import { Check, X, type LucideIcon } from "lucide-react";
import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import styles from "./atoms.module.css";
import {
  CHIP_BASE,
  CHIP_GROUND,
  CHIP_PRESS,
  CHIP_REMOVE,
  CHIP_SIZE,
  type ChipGround,
  type ChipKind,
  type ChipSize,
} from "./chip-styles";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { DUR } from "./motion";

export type { ChipGround, ChipKind, ChipSize } from "./chip-styles";

export type ChipProps = {
  kind?: ChipKind;
  selected?: boolean;
  /** filter: the next pressed state. choice: called with true when picked. */
  onToggle?: (next: boolean) => void;
  /** input: removes the value (the remove button, Backspace or Delete) */
  onRemove?: () => void;
  /** a leading lucide icon at 14 */
  icon?: LucideIcon;
  /** a leading 20px Avatar, for input chips */
  avatar?: ReactNode;
  size?: ChipSize;
  /** onBlue is the form for the players' accent ground */
  ground?: ChipGround;
  disabled?: boolean;
  /** a choice chip's place in its group's one tab stop, set by ChipGroup */
  tabIndex?: number;
  /** hover, focus-visible, pressed and remove-hover show as data-force, selected and disabled as props */
  forceState?: ForceState;
  className?: string;
  /** the label, also used in the remove button's name */
  children: string;
};

export function Chip({
  kind = "filter",
  selected: selectedProp = false,
  onToggle,
  onRemove,
  icon: Icon,
  avatar,
  size = "md",
  ground = "light",
  disabled: disabledProp = false,
  tabIndex,
  forceState,
  className = "",
  children,
}: ChipProps) {
  const root = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const still = useReducedMotion();
  const disabled = disabledProp || forces(forceState, "disabled");
  const selected = kind !== "input" && (selectedProp || forces(forceState, "selected"));
  const force = forceAttr(forceState);

  const remove = () => {
    if (!onRemove || disabled) return;
    const el = root.current;
    if (still || !el) return onRemove();
    setWidth(el.offsetWidth);
    requestAnimationFrame(() => requestAnimationFrame(() => setWidth(0)));
    window.setTimeout(onRemove, DUR.quick * 1000);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      remove();
    }
  };

  const leaving: CSSProperties | undefined =
    width === null
      ? undefined
      : {
          maxWidth: width,
          opacity: width === 0 ? 0 : 1,
          overflow: "hidden",
          transition: "max-width var(--ds-dur-quick) var(--ds-ease-out), opacity var(--ds-dur-quick) var(--ds-ease-out)",
        };
  const ring = ground === "onBlue" ? FOCUS_INVERSE : FOCUS;
  const pad = kind === "input" ? (avatar ? "pl-1.5 pr-1.5" : "pl-3 pr-1.5") : avatar ? "pl-1.5 pr-3" : "px-3";
  const g = CHIP_GROUND[ground];
  const live = disabled ? "" : g.hover;
  const press = kind === "input" || disabled ? "" : CHIP_PRESS;
  const classes = [CHIP_BASE, CHIP_SIZE[size], g.rest, live, pad, press, kind === "input" ? "" : ring, className].join(" ");

  const lead = (
    <>
      {kind !== "input" && (
        <span
          aria-hidden
          className={
            "inline-flex shrink-0 overflow-hidden transition-[width,margin,opacity] duration-(--ds-dur-ui) " +
            (selected ? "mr-1.5 w-3.5 opacity-100" : "w-0 opacity-0")
          }
        >
          <Check size={14} strokeWidth={2} />
        </span>
      )}
      {avatar && <span className="mr-1.5 inline-flex shrink-0">{avatar}</span>}
      {Icon && <Icon aria-hidden size={14} strokeWidth={2} className="mr-1.5 shrink-0" />}
      <span>{children}</span>
    </>
  );

  if (kind === "input") {
    return (
      <span
        ref={root as RefObject<HTMLSpanElement>}
        data-force={force}
        data-disabled={disabled || undefined}
        className={classes}
        style={leaving}
      >
        {lead}
        <button
          type="button"
          aria-label={`Remove ${children}`}
          data-force={force === "focus" ? "focus" : undefined}
          disabled={disabled}
          onClick={remove}
          onKeyDown={onKey}
          className={`${CHIP_REMOVE} ${g.remove} ${styles["ds-hit"]} ${ring}`}
        >
          <X aria-hidden size={14} strokeWidth={2} />
        </button>
      </span>
    );
  }
  return (
    <button
      ref={root as RefObject<HTMLButtonElement>}
      type="button"
      role={kind === "choice" ? "radio" : undefined}
      aria-checked={kind === "choice" ? selected : undefined}
      aria-pressed={kind === "filter" ? selected : undefined}
      data-selected={selected || undefined}
      data-force={force}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={() => onToggle?.(kind === "choice" ? true : !selected)}
      className={classes}
      style={leaving}
    >
      {lead}
    </button>
  );
}
