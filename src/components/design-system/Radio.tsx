"use client";

// One choice out of a few, all in view. Each radio is a native input under a drawn circle, so radios that
// share a name give the set one tab stop and arrow keys from the browser itself. Checked turns the line
// navy and grows a navy dot on the thumb spring (Highlight in forced colours, where a fill would vanish). RadioGroup is the fieldset round them. Its card form puts
// the radio at the top right of a white card, for choices that need a sentence each.
import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type ChangeEvent, type MouseEvent, type ReactNode } from "react";
import {
  CHOICE_DESC,
  CHOICE_LABEL,
  CHOICE_ROW,
  CHOICE_SIZE,
  CHOICE_SLOT,
  CHOICE_TEXT,
  MARK_BASE,
  MARK_FOCUS,
  MARK_PRESS,
  NATIVE_INPUT,
  RADIO_HOVER,
  RADIO_TONE,
  markTone,
  type ChoiceSize,
} from "./choice-styles";
import { ChoiceGroup } from "./ChoiceGroup";
import { forceAttr, forces, type ForceState } from "./force";
import { SPRING } from "./motion";

export type RadioProps = {
  label: ReactNode;
  description?: ReactNode;
  value: string;
  name?: string;
  checked?: boolean;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  size?: ChoiceSize;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  "aria-describedby"?: string;
  /** the card form: a white card with the radio at its top right */
  card?: boolean;
  /** hover, focus-visible and pressed show as data-force, disabled as the prop */
  forceState?: ForceState;
  id?: string;
  className?: string;
};

const CARD =
  "relative flex-col rounded-(--ds-radius-lg) border border-(--ds-color-line) bg-(--ds-color-surface) p-6 pr-12 " +
  "transition-[border-color,box-shadow] duration-(--ds-dur-line) ease-(--ds-ease-out) outline-offset-(--ds-focus-offset-card) " +
  "has-[:focus-visible]:outline-(length:--ds-focus-width) has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-(--ds-focus-color) " +
  "data-[force=focus]:outline-(length:--ds-focus-width) data-[force=focus]:outline-solid data-[force=focus]:outline-(--ds-focus-color)";
const CARD_HOVER = "hover:border-(--ds-color-line-strong) data-[force=hover]:border-(--ds-color-line-strong)";
const CARD_ON = "border-(--ds-color-primary) shadow-[inset_0_0_0_1px_var(--ds-color-primary)]";

export function Radio({
  label,
  description,
  value,
  name,
  checked = false,
  onChange,
  size = "md",
  disabled: disabledProp,
  readOnly,
  invalid,
  "aria-describedby": describedByProp,
  card,
  forceState,
  id: idProp,
  className = "",
}: RadioProps) {
  const auto = useId();
  const id = idProp ?? `r${auto.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const still = useReducedMotion();
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const force = disabled ? undefined : forceAttr(forceState);
  const live = !disabled && !readOnly;
  const s = CHOICE_SIZE[size];
  const tone = markTone({ on: checked, invalid, readOnly });
  const describedBy = [description ? `${id}-desc` : "", describedByProp ?? ""].filter(Boolean).join(" ") || undefined;
  const guard = (e: MouseEvent<HTMLInputElement>) => {
    if (readOnly) e.preventDefault();
  };

  const mark = (
    <span className={card ? "absolute right-4 top-4 grid h-5 place-items-center" : CHOICE_SLOT}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => live && onChange?.(value, e)}
        onClick={guard}
        disabled={disabled}
        aria-describedby={describedBy}
        className={NATIVE_INPUT}
      />
      <span
        aria-hidden
        data-slot="circle"
        className={`${MARK_BASE} ${s.circle} rounded-full ${RADIO_TONE[tone]} ${live ? `${RADIO_HOVER[tone] ?? ""} ${MARK_PRESS}` : ""} ${card ? "" : MARK_FOCUS}`}
      >
        <motion.span
          data-slot="dot"
          initial={false}
          animate={{ scale: checked ? 1 : 0 }}
          transition={still ? { duration: 0 } : SPRING.thumb}
          className={`block rounded-full bg-current forced-colors:forced-color-adjust-none forced-colors:bg-[color:Highlight] ${s.dot}`}
        />
      </span>
    </span>
  );

  const text = (
    <span className={card ? "flex min-w-0 flex-col gap-1" : CHOICE_TEXT}>
      <span data-slot="label" className={card ? "font-display text-[20px] font-medium leading-7 tracking-[-0.01em] text-(--ds-color-ink)" : CHOICE_LABEL}>
        {label}
      </span>
      {description && (
        <span id={`${id}-desc`} data-slot="description" className={card ? "text-[14px] leading-[22px] text-(--ds-color-text-muted)" : CHOICE_DESC}>
          {description}
        </span>
      )}
    </span>
  );

  return (
    <label
      htmlFor={id}
      data-force={force}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-slot={card ? "radio-card" : "radio"}
      className={
        `${CHOICE_ROW} ${className} ` +
        (card ? `${CARD} ${checked ? CARD_ON : ""} ${live && !checked ? CARD_HOVER : ""}` : "")
      }
    >
      {mark}
      {text}
    </label>
  );
}

export type RadioOption = { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean };

export type RadioGroupProps = {
  legend: ReactNode;
  hideLegend?: boolean;
  options: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: ChoiceSize;
  orientation?: "vertical" | "horizontal";
  /** cards in a row of up to three, stacked under 640 */
  variant?: "list" | "card";
  helper?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

export function RadioGroup({
  legend,
  hideLegend,
  options,
  value,
  defaultValue,
  onChange,
  name,
  size = "md",
  orientation,
  variant = "list",
  helper,
  error,
  disabled,
  readOnly,
  className,
}: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const pick = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  return (
    <ChoiceGroup
      legend={legend}
      hideLegend={hideLegend}
      helper={helper}
      error={error}
      orientation={orientation}
      name={name}
      role="radiogroup"
      readOnly={readOnly}
      layout={variant === "card" ? "grid grid-cols-1 gap-4 sm:grid-cols-3" : undefined}
      className={className}
    >
      {({ describedBy, invalid, name: groupName }) =>
        options.map((o) => (
          <Radio
            key={o.value}
            name={groupName}
            value={o.value}
            label={o.label}
            description={o.description}
            checked={current === o.value}
            onChange={pick}
            size={size}
            disabled={disabled || o.disabled}
            readOnly={readOnly}
            invalid={invalid}
            aria-describedby={describedBy}
            card={variant === "card"}
          />
        ))
      }
    </ChoiceGroup>
  );
}
