"use client";

// The single-line text field: the Field shell round the shared box. The box is white with the field line,
// so it reads on the page and on white cards, and takes the accent line and halo on focus. A leading icon
// sits inside the left padding, the trailing slot holds a unit, an action or the success check. Disabled
// sinks to the inset grey and leaves the tab order, read-only sinks too but stays focusable and copyable.
import { CircleCheck, type LucideIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FocusEvent, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Field } from "./Field";
import { FIELD_BOX, FIELD_INPUT, FIELD_SIZE, FIELD_TONE, fieldTone, type FieldSize } from "./field-styles";
import { forceAttr, forces, type ForceState } from "./force";
import { ICON_STROKE } from "./token-shape";

export type TextInputProps = {
  label: string;
  hideLabel?: boolean;
  helper?: ReactNode;
  /** the error message, set on blur or submit. Marks the box invalid. */
  error?: ReactNode;
  /** a confirmation message, with the success line and check */
  success?: ReactNode;
  optional?: boolean;
  size?: FieldSize;
  leadingIcon?: LucideIcon;
  /** a unit, an IconButton or a Badge at the right edge */
  trailing?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** a hard limit (the browser stops typing there). With showCount it prints the counter. */
  maxLength?: number;
  showCount?: boolean;
  type?: "text" | "email" | "password" | "tel" | "url" | "search" | "number";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  /** hover and focus show as data-force, disabled as the prop */
  forceState?: ForceState;
  id?: string;
  className?: string;
};

export function TextInput({
  label,
  hideLabel,
  helper,
  error,
  success,
  optional,
  size = "md",
  leadingIcon: Leading,
  trailing,
  disabled: disabledProp,
  readOnly,
  required,
  maxLength,
  showCount,
  type = "text",
  value,
  defaultValue = "",
  onChange,
  onBlur,
  placeholder,
  name,
  autoComplete,
  inputMode,
  forceState,
  id,
  className = "",
}: TextInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const force = disabled ? undefined : forceAttr(forceState);
  const s = FIELD_SIZE[size];
  const tone = fieldTone({ disabled, readOnly, invalid: !!error, success: !!success && !error });
  const ok = tone === "success";

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e.target.value, e);
  };
  // a press on the box's padding or icon puts the caret in the field
  const focusInput = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== input.current && !disabled) {
      e.preventDefault();
      input.current?.focus();
    }
  };

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      optional={optional}
      helper={helper}
      error={error}
      success={success}
      count={showCount && maxLength ? text.length : undefined}
      maxLength={showCount ? maxLength : undefined}
      id={id}
      className={className}
    >
      {({ id: fieldId, describedBy, invalid }) => (
        <div
          data-slot="box"
          data-force={force}
          onMouseDown={focusInput}
          className={`${FIELD_BOX} ${FIELD_TONE[tone]} ${s.h} ${s.pad} ${s.radius} ${s.text}`}
        >
          {Leading && (
            <Leading
              aria-hidden
              data-slot="icon"
              size={s.icon}
              strokeWidth={ICON_STROKE[s.icon]}
              className={`shrink-0 ${disabled ? "" : "text-(--ds-color-text-muted)"}`}
            />
          )}
          <input
            ref={input}
            id={fieldId}
            data-slot="value"
            type={type}
            name={name}
            value={text}
            onChange={change}
            onBlur={onBlur}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={FIELD_INPUT}
          />
          {(trailing || ok) && (
            <span data-slot="trailing" className="-mr-1 flex shrink-0 items-center gap-1.5">
              {trailing}
              {ok && !trailing && (
                <CircleCheck aria-hidden size={s.icon} strokeWidth={ICON_STROKE[s.icon]} className="text-(--ds-color-success)" />
              )}
            </span>
          )}
        </div>
      )}
    </Field>
  );
}
