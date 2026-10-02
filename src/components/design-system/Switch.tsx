"use client";

// An on / off setting that takes effect the moment it flips, with no save step. A button with the switch
// role, so Space and Enter flip it and the state is read as on or off. The track fills navy when on and
// the white thumb travels on the thumb spring. A press widens the thumb by 4px toward the travel, which
// reads as a held finger. Loading keeps the old state with a spinner in the thumb until the setting lands.
// On the players' blue the track turns to glass and, when on, white with a navy thumb. Hover lives on the
// whole row (group/choice), so the label is part of the target. In forced colours the track draws a
// CanvasText line and fills Highlight when on, since a fill alone would vanish there.
import { motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { CHOICE_DESC, CHOICE_LABEL, THUMB_SHADOW, type ChoiceSize } from "./choice-styles";
import { FOCUS, FOCUS_INVERSE } from "./focus";
import { forceAttr, forces, type ForceState } from "./force";
import { SPRING } from "./motion";
import { Spinner } from "./Spinner";

/** Track 28x16 / 36x20 / 44x24, thumb 12 / 16 / 20, inset 2. */
const SIZE: Record<ChoiceSize, { track: string; thumb: number; travel: number; spin: 8 | 12 }> = {
  sm: { track: "h-4 w-7", thumb: 12, travel: 12, spin: 8 },
  md: { track: "h-5 w-9", thumb: 16, travel: 16, spin: 12 },
  lg: { track: "h-6 w-11", thumb: 20, travel: 20, spin: 12 },
};

const TRACK = {
  light: {
    off: "bg-(--ds-color-line-field)",
    offHover:
      "group-hover/choice:bg-(--ds-color-text-muted) data-[force=hover]:bg-(--ds-color-text-muted) " +
      "data-[force=pressed]:bg-(--ds-color-text-muted)",
    on: "bg-(--ds-color-primary)",
    onHover:
      "group-hover/choice:bg-(--ds-color-primary-hover) data-[force=hover]:bg-(--ds-color-primary-hover) " +
      "data-[force=pressed]:bg-(--ds-color-primary-hover)",
    // read-only keeps the marks above 3:1 and reads apart from enabled: off is a sunken track with the field
    // line (3.26) drawn inside it, as Checkbox and Radio sink a read-only mark, on is the muted text (4.75)
    readOff: "bg-(--ds-color-surface-sunken) shadow-[inset_0_0_0_1.5px_var(--ds-color-line-field)]",
    readOn: "bg-(--ds-color-text-muted)",
  },
  onBlue: {
    off: "bg-(--ds-color-on-blue-25)",
    offHover:
      "group-hover/choice:bg-(--ds-color-on-blue-40) data-[force=hover]:bg-(--ds-color-on-blue-40) " +
      "data-[force=pressed]:bg-(--ds-color-on-blue-40)",
    on: "bg-(--ds-color-surface)",
    onHover:
      "group-hover/choice:bg-(--ds-color-on-blue-80) data-[force=hover]:bg-(--ds-color-on-blue-80) " +
      "data-[force=pressed]:bg-(--ds-color-on-blue-80)",
    readOff: "bg-(--ds-color-on-blue-15)",
    readOn: "bg-(--ds-color-on-blue-50)",
  },
} as const;

/** Forced colours: a CanvasText line drawn inside the track (so it adds no size), Highlight when on. */
const FORCED_TRACK =
  "forced-colors:forced-color-adjust-none after:pointer-events-none after:absolute after:inset-0 after:rounded-full " +
  "after:border after:border-transparent after:content-[''] forced-colors:after:border-[color:CanvasText]";

export type SwitchProps = {
  /** the visible label. Without one, pass aria-label. */
  label?: ReactNode;
  description?: ReactNode;
  "aria-label"?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ChoiceSize;
  disabled?: boolean;
  readOnly?: boolean;
  /** the setting is being saved: a spinner in the thumb, aria-busy, flips ignored */
  loading?: boolean;
  /** a check or a cross in the thumb, so on and off never rest on colour alone */
  icons?: boolean;
  ground?: "light" | "onBlue";
  /** the label before the switch (settings rows) or after it */
  labelPosition?: "start" | "end";
  /** hover, focus-visible and pressed show as data-force, disabled and loading as props */
  forceState?: ForceState;
  id?: string;
  className?: string;
};

export function Switch({
  label,
  description,
  "aria-label": ariaLabel,
  checked,
  defaultChecked = false,
  onChange,
  size = "md",
  disabled: disabledProp,
  readOnly,
  loading: loadingProp,
  icons,
  ground = "light",
  labelPosition = "end",
  forceState,
  id: idProp,
  className = "",
}: SwitchProps) {
  const auto = useId();
  const id = idProp ?? `w${auto.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const still = useReducedMotion();
  const [inner, setInner] = useState(defaultChecked);
  const [held, setHeld] = useState(false);
  const on = checked ?? inner;
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const loading = !!loadingProp || forces(forceState, "loading");
  const force = disabled ? undefined : forceAttr(forceState);
  const live = !disabled && !readOnly && !loading;
  const pressed = live && (held || force === "pressed");
  const s = SIZE[size];
  const t = TRACK[ground];
  const blue = ground === "onBlue";

  const flip = () => {
    if (!live) return;
    if (checked === undefined) setInner(!on);
    onChange?.(!on);
  };
  const press = (e: KeyboardEvent<HTMLButtonElement>, down: boolean) => {
    if (e.key === " ") setHeld(down);
  };

  const track = readOnly
    ? on ? t.readOn : t.readOff
    : on ? `${t.on} ${live ? t.onHover : ""}` : `${t.off} ${live ? t.offHover : ""}`;
  const thumbTone =
    (blue && on ? "bg-(--ds-color-primary) text-white" : "bg-(--ds-color-surface) text-(--ds-color-ink)") +
    (on
      ? " forced-colors:bg-[color:HighlightText] forced-colors:text-[color:Highlight]"
      : " forced-colors:bg-[color:CanvasText] forced-colors:text-[color:Canvas]");
  const trackForced = `${FORCED_TRACK} ${on ? "forced-colors:bg-[color:Highlight]" : "forced-colors:bg-[color:Canvas]"}`;
  const grow = pressed ? 4 : 0;

  const button = (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={on}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={description ? `${id}-desc` : undefined}
      aria-busy={loading || undefined}
      aria-readonly={readOnly || undefined}
      disabled={disabled}
      data-force={force}
      data-slot="track"
      onClick={flip}
      onPointerDown={() => live && setHeld(true)}
      onPointerUp={() => setHeld(false)}
      onPointerLeave={() => setHeld(false)}
      onPointerCancel={() => setHeld(false)}
      onKeyDown={(e) => press(e, true)}
      onKeyUp={(e) => press(e, false)}
      onBlur={() => setHeld(false)}
      className={
        `relative inline-flex shrink-0 rounded-full transition-colors duration-(--ds-dur-ui) ease-(--ds-ease-out) ` +
        `before:absolute before:-inset-1 before:rounded-full before:content-[''] ${s.track} ${track} ${trackForced} ` +
        `${blue ? FOCUS_INVERSE : FOCUS} ` +
        (disabled ? `cursor-not-allowed ${label ? "" : "opacity-40"}` : loading ? "cursor-progress" : readOnly ? "cursor-default" : "cursor-pointer")
      }
    >
      <motion.span
        aria-hidden
        data-slot="thumb"
        initial={false}
        animate={{ x: on ? s.travel - grow : 0, width: s.thumb + grow }}
        transition={still ? { duration: 0 } : SPRING.thumb}
        style={{ height: s.thumb }}
        className={`absolute left-0.5 top-0.5 grid place-items-center rounded-full ${THUMB_SHADOW} ${thumbTone}`}
      >
        {loading ? (
          <Spinner size={s.spin} delay={0} decorative className={blue && on ? "" : "text-(--ds-color-text-muted)"} />
        ) : icons ? (
          on ? (
            <Check size={10} strokeWidth={3} data-slot="glyph" />
          ) : (
            <X size={10} strokeWidth={3} data-slot="glyph" className="text-(--ds-color-text-muted) forced-colors:text-[color:Canvas]" />
          )
        ) : null}
      </motion.span>
    </button>
  );

  if (!label) return <span className={`group/choice inline-flex ${className}`}>{button}</span>;
  const labelClass = blue ? "text-[14px] leading-5 text-white" : CHOICE_LABEL;
  return (
    <span
      data-slot="switch"
      className={
        `group/choice min-h-6 items-start gap-2.5 font-sans pointer-coarse:min-h-8 ` +
        // a label first is a settings row: the full width, the switch at its right edge
        `${labelPosition === "start" ? "flex w-full flex-row-reverse justify-between" : "inline-flex"} ` +
        `${disabled ? "opacity-40" : ""} ${className}`
      }
    >
      <span className={`grid shrink-0 place-items-center pointer-coarse:h-8 ${size === "lg" ? "h-6" : "h-5"}`}>{button}</span>
      <span className={`flex min-w-0 flex-col pointer-coarse:pt-1.5 ${size === "lg" ? "pt-0.5" : "pt-px"}`}>
        <label id={`${id}-label`} htmlFor={id} data-slot="label" className={`${labelClass} ${live ? "cursor-pointer" : ""}`}>
          {label}
        </label>
        {description && (
          <span id={`${id}-desc`} data-slot="description" className={blue ? "text-[13px] leading-[18px] text-white" : CHOICE_DESC}>
            {description}
          </span>
        )}
      </span>
    </span>
  );
}
