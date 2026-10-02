"use client";

// The shell round every text control: a label above the box, a helper under it, a message that enters
// when there is one, and a counter on the right. It owns the ids, so the control's aria-describedby
// always names the helper, the message and the counter that are really there. The message sits in a
// polite live region and opens at height auto with a 2px drop over 200ms, at once under reduced motion.
// Errors come from the caller, who sets them on blur or submit, never while the first keys land.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useId, type ReactNode } from "react";
import { FIELD_LABEL } from "./field-styles";
import { DUR, EASE } from "./motion";
import { ICON_STROKE } from "./token-shape";

export type FieldControl = {
  /** the control's id, which the label points at */
  id: string;
  /** the label's own id, for controls named by aria-labelledby (the Select trigger) */
  labelId: string;
  /** the ids of the helper, message and counter, or undefined when none show */
  describedBy?: string;
  invalid: boolean;
};

export type FieldProps = {
  label: ReactNode;
  /** keeps the label for assistive tech only, when the context names the field (a search row) */
  hideLabel?: boolean;
  /** prints "(optional)" after the label. Required fields carry no mark, optional ones say so. */
  optional?: boolean;
  helper?: ReactNode;
  /** the error message. Its presence marks the control invalid. */
  error?: ReactNode;
  success?: ReactNode;
  /** with maxLength, prints the counter "count/max" */
  count?: number;
  maxLength?: number;
  /** a label element other than label (a legend renders its own). A span label focuses its control on a
   *  click without activating it, as a native select's label does, for a control named by aria-labelledby. */
  labelAs?: "label" | "span";
  id?: string;
  className?: string;
  children: (control: FieldControl) => ReactNode;
};

const MESSAGE = "flex items-start gap-1.5 pt-1.5 font-sans text-[13px] leading-[18px]";

export function Field({
  label,
  hideLabel,
  optional,
  helper,
  error,
  success,
  count,
  maxLength,
  labelAs = "label",
  id: idProp,
  className = "",
  children,
}: FieldProps) {
  const auto = useId();
  const still = useReducedMotion();
  const id = idProp ?? `f${auto.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ids = { label: `${id}-label`, helper: `${id}-helper`, msg: `${id}-msg`, count: `${id}-count` };
  const invalid = !!error;
  const message = error ?? success;
  const counting = count !== undefined && maxLength !== undefined;
  const describedBy =
    [helper && ids.helper, message && ids.msg, counting && ids.count].filter(Boolean).join(" ") || undefined;

  const labelText = (
    <>
      {label}
      {optional && <span className="font-normal text-(--ds-color-text-muted)"> (optional)</span>}
    </>
  );

  const over = counting && count > maxLength;
  const near = counting && !over && count >= Math.floor(maxLength * 0.9);
  const counterTone = over
    ? "font-medium text-(--ds-color-danger-ink)"
    : near
      ? "text-(--ds-color-ink)"
      : "text-(--ds-color-text-muted)";

  return (
    <div className={`min-w-0 ${className}`} data-slot="field">
      {labelAs === "label" ? (
        <label id={ids.label} htmlFor={id} data-slot="label" className={hideLabel ? "sr-only" : FIELD_LABEL}>
          {labelText}
        </label>
      ) : (
        <span
          id={ids.label}
          data-slot="label"
          onClick={() => document.getElementById(id)?.focus()}
          className={hideLabel ? "sr-only" : FIELD_LABEL}
        >
          {labelText}
        </span>
      )}
      {children({ id, labelId: ids.label, describedBy, invalid })}
      {(helper || counting) && (
        <div className="flex items-start gap-3 pt-1.5">
          {helper && (
            <p id={ids.helper} data-slot="helper" className="min-w-0 flex-1 font-sans text-[13px] leading-[18px] text-(--ds-color-text-muted)">
              {helper}
            </p>
          )}
          {counting && (
            <p
              id={ids.count}
              data-slot="counter"
              className={`ml-auto shrink-0 font-sans text-[12px] leading-[18px] tabular-nums ${counterTone}`}
            >
              {count}/{maxLength}
              <span className="sr-only"> characters</span>
            </p>
          )}
        </div>
      )}
      <div id={ids.msg} aria-live="polite">
        <AnimatePresence initial={false}>
          {message && (
            <motion.div
              key={invalid ? "error" : "success"}
              initial={still ? { opacity: 0 } : { height: 0, opacity: 0, y: -2 }}
              animate={still ? { opacity: 1 } : { height: "auto", opacity: 1, y: 0 }}
              exit={still ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: still ? 0 : DUR.ui, ease: EASE }}
              className="overflow-hidden"
            >
              <p data-slot="message" className={`${MESSAGE} ${invalid ? "text-(--ds-color-danger-ink)" : "text-(--ds-color-success)"}`}>
                {invalid ? (
                  <CircleAlert aria-hidden size={14} strokeWidth={ICON_STROKE[14]} className="mt-0.5 shrink-0 text-(--ds-color-danger)" />
                ) : (
                  <CircleCheck aria-hidden size={14} strokeWidth={ICON_STROKE[14]} className="mt-0.5 shrink-0" />
                )}
                <span>{message}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
