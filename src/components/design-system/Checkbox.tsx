"use client";

// A checkbox for a choice that is submitted with a form. The native input stays in the page, invisible
// over a drawn box, so the browser keeps the keyboard, the form value and the screen reader's role.
// Checked fills navy and draws its tick over 160ms, indeterminate draws a bar, and the glyph always
// carries the state, so it never rests on colour alone. Read-only keeps the state, stays focusable and
// sits on the sunken fill, its mark kept above 3:1.
import { useEffect, useId, useRef, useState, type ChangeEvent, type MouseEvent, type ReactNode } from "react";
import {
  CHOICE_DESC,
  CHOICE_LABEL,
  CHOICE_ROW,
  CHOICE_SIZE,
  CHOICE_SLOT,
  CHOICE_TEXT,
  MARK_BASE,
  MARK_FOCUS,
  MARK_HOVER,
  MARK_PRESS,
  MARK_TONE,
  NATIVE_INPUT,
  markTone,
  type ChoiceSize,
} from "./choice-styles";
import { forceAttr, forces, type ForceState } from "./force";

export type CheckboxProps = {
  label: ReactNode;
  description?: ReactNode;
  /** names the box for assistive tech only, when a table row or a group already says what it is */
  hideLabel?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  /** some of a group is checked: a bar, and aria-checked mixed */
  indeterminate?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  size?: ChoiceSize;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  /** the group's error or helper ids, when the group describes its boxes */
  "aria-describedby"?: string;
  /** hover, focus-visible and pressed show as data-force, disabled as the prop */
  forceState?: ForceState;
  id?: string;
  className?: string;
};

const TICK = "M20 6 9 17l-5-5";
const BAR = "M5 12h14";

export function Checkbox({
  label,
  description,
  hideLabel,
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  size = "md",
  disabled: disabledProp,
  readOnly,
  invalid,
  required,
  name,
  value,
  "aria-describedby": describedByProp,
  forceState,
  id: idProp,
  className = "",
}: CheckboxProps) {
  const auto = useId();
  const id = idProp ?? `c${auto.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const force = disabled ? undefined : forceAttr(forceState);
  const live = !disabled && !readOnly;
  const s = CHOICE_SIZE[size];
  const tone = markTone({ on: on || indeterminate, invalid, readOnly });
  const glyph = indeterminate ? BAR : TICK;
  const drawn = on || indeterminate;

  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    if (!live) return;
    if (checked === undefined) setInner(e.target.checked);
    onChange?.(e.target.checked, e);
  };
  // read-only keeps its state: the click is refused before the browser flips the box
  const guard = (e: MouseEvent<HTMLInputElement>) => {
    if (readOnly) e.preventDefault();
  };
  const describedBy = [description ? `${id}-desc` : "", describedByProp ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <label
      htmlFor={id}
      data-force={force}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-slot="checkbox"
      className={`${CHOICE_ROW} ${className}`}
    >
      <span className={CHOICE_SLOT}>
        <input
          ref={input}
          id={id}
          type="checkbox"
          name={name}
          value={value}
          checked={on}
          onChange={change}
          onClick={guard}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          className={NATIVE_INPUT}
        />
        <span
          aria-hidden
          data-slot="box"
          className={`${MARK_BASE} ${s.box} ${MARK_TONE[tone]} ${live ? `${MARK_HOVER[tone] ?? ""} ${MARK_PRESS}` : ""} ${MARK_FOCUS}`}
        >
          <svg
            viewBox="0 0 24 24"
            width={s.tick}
            height={s.tick}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="tick"
          >
            <path
              key={glyph}
              d={glyph}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={drawn ? 0 : 1}
              className="transition-[stroke-dashoffset] duration-(--ds-dur-quick) ease-(--ds-ease-out) motion-reduce:transition-none"
            />
          </svg>
        </span>
      </span>
      <span className={hideLabel ? "sr-only" : CHOICE_TEXT}>
        <span data-slot="label" className={CHOICE_LABEL}>
          {label}
        </span>
        {description && (
          <span id={`${id}-desc`} data-slot="description" className={CHOICE_DESC}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
