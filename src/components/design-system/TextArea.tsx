"use client";

// The multi-line field: the TextInput box at 12px top and bottom, 88 / 112 / 136 tall at rest. It grows
// with its text up to 280, then scrolls, over 120ms (at once under reduced motion). maxLength here is a
// soft limit, so a pasted draft is never cut: the counter turns red the moment it passes, and the box
// turns red only once the field has been left, so nobody is scolded mid-sentence.
import { useLayoutEffect, useRef, useState, type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import { Field } from "./Field";
import { FIELD_BOX, FIELD_INPUT, FIELD_SIZE, FIELD_TONE, fieldTone, type FieldSize } from "./field-styles";
import { forceAttr, forces, type ForceState } from "./force";

const MAX_H = 280;

export type TextAreaProps = {
  label: string;
  hideLabel?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  size?: FieldSize;
  /** grows with its text up to 280px (on by default) */
  autoGrow?: boolean;
  /** a soft limit: the counter shows and turns red past it, the text is kept */
  maxLength?: number;
  /** marks the field as left once (blurred or submitted). Unset, the field tracks its own blur. */
  touched?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  /** hover and focus show as data-force, disabled as the prop */
  forceState?: ForceState;
  id?: string;
  className?: string;
};

export function TextArea({
  label,
  hideLabel,
  helper,
  error,
  optional,
  size = "md",
  autoGrow = true,
  maxLength,
  touched: touchedProp,
  disabled: disabledProp,
  readOnly,
  required,
  value,
  defaultValue = "",
  onChange,
  onBlur,
  placeholder,
  name,
  forceState,
  id,
  className = "",
}: TextAreaProps) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [left, setLeft] = useState(false);
  const text = value ?? inner;
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const force = disabled ? undefined : forceAttr(forceState);
  const s = FIELD_SIZE[size];
  const over = maxLength !== undefined ? text.length - maxLength : 0;
  const touched = touchedProp ?? left;
  const overError = over > 0 && touched ? `${over} character${over === 1 ? "" : "s"} over the limit` : undefined;
  const message = error ?? overError;
  const tone = fieldTone({ disabled, readOnly, invalid: !!message });

  // grow to the text: read the natural height at auto, then animate from the old height to it
  useLayoutEffect(() => {
    const el = area.current;
    if (!el || !autoGrow) return;
    const from = el.offsetHeight;
    el.style.transition = "none";
    el.style.height = "auto";
    // the box's 1px line sits on the wrapper, so the textarea itself stops 2px short of 280
    const natural = el.scrollHeight;
    const to = Math.min(natural, MAX_H - 2);
    el.style.height = `${from}px`;
    void el.offsetHeight;
    el.style.transition = "";
    el.style.height = `${to}px`;
    el.style.overflowY = natural > MAX_H - 2 ? "auto" : "hidden";
  }, [text, autoGrow, size]);

  const change = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e.target.value, e);
  };
  const blur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setLeft(true);
    onBlur?.(e);
  };

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      optional={optional}
      helper={helper}
      error={message}
      count={maxLength !== undefined ? text.length : undefined}
      maxLength={maxLength}
      id={id}
      className={className}
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <div
          data-slot="box"
          data-force={force}
          className={`${FIELD_BOX} ${FIELD_TONE[tone]} ${s.radius} ${s.text} items-stretch`}
        >
          <textarea
            ref={area}
            id={fieldId}
            data-slot="value"
            name={name}
            value={text}
            onChange={change}
            onBlur={blur}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={
              `${FIELD_INPUT} ${s.area} block w-full resize-none py-3 ${size === "lg" ? "px-4" : "px-3.5"} ` +
              "transition-[height] duration-(--ds-dur-press) ease-(--ds-ease-out) motion-reduce:transition-none " +
              (autoGrow ? "" : "max-h-[278px] overflow-y-auto")
            }
          />
        </div>
      )}
    </Field>
  );
}
