"use client";

// A set of checkboxes or radios under one question: a native fieldset whose legend reads like a field
// label, an optional helper, and an error under the set rather than under each box, because the answer
// is the set. The group hands its helper and error ids to each control, so a screen reader hears them
// once it lands inside.
import { CircleAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import { FIELD_LABEL } from "./field-styles";
import { ICON_STROKE } from "./token-shape";

export type ChoiceGroupIds = { describedBy?: string; invalid: boolean; name: string };

export type ChoiceGroupProps = {
  legend: ReactNode;
  hideLegend?: boolean;
  optional?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  /** vertical by default. Horizontal rows wrap, and stack under 480. */
  orientation?: "vertical" | "horizontal";
  /** the radio name, generated when unset */
  name?: string;
  /** radiogroup for radios, so the set is announced as one choice */
  role?: "radiogroup";
  /** a radiogroup whose answer can be read but not changed */
  readOnly?: boolean;
  className?: string;
  /** the set's layout, replacing the orientation's (the card row) */
  layout?: string;
  children: (ids: ChoiceGroupIds) => ReactNode;
};

export function ChoiceGroup({
  legend,
  hideLegend,
  optional,
  helper,
  error,
  orientation = "vertical",
  name: nameProp,
  role,
  readOnly,
  className = "",
  layout,
  children,
}: ChoiceGroupProps) {
  const auto = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const name = nameProp ?? `g${auto}`;
  const ids = { helper: `g${auto}-helper`, error: `g${auto}-error` };
  const describedBy = [helper && ids.helper, error && ids.error].filter(Boolean).join(" ") || undefined;
  const flow =
    layout ??
    (orientation === "horizontal"
      ? "flex flex-row flex-wrap gap-x-6 gap-y-3 max-[480px]:flex-col"
      : "flex flex-col gap-3");

  return (
    <fieldset
      role={role}
      aria-invalid={role === "radiogroup" && error ? true : undefined}
      aria-readonly={role === "radiogroup" && readOnly ? true : undefined}
      data-slot="group"
      className={`m-0 min-w-0 border-0 p-0 ${className}`}
    >
      <legend data-slot="legend" className={hideLegend ? "sr-only" : `${FIELD_LABEL} p-0`}>
        {legend}
        {optional && <span className="font-normal text-(--ds-color-text-muted)"> (optional)</span>}
      </legend>
      {helper && (
        <p id={ids.helper} data-slot="helper" className="-mt-1 mb-3 font-sans text-[13px] leading-[18px] text-(--ds-color-text-muted)">
          {helper}
        </p>
      )}
      <div className={flow}>{children({ describedBy, invalid: !!error, name })}</div>
      <div aria-live="polite">
        {error && (
          <p
            id={ids.error}
            data-slot="message"
            className="flex items-start gap-1.5 pt-2 font-sans text-[13px] leading-[18px] text-(--ds-color-danger-ink)"
          >
            <CircleAlert aria-hidden size={14} strokeWidth={ICON_STROKE[14]} className="mt-0.5 shrink-0 text-(--ds-color-danger)" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </fieldset>
  );
}
