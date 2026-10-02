"use client";

// Picking one value from a list. The trigger is the text field's box with a chevron that turns over on
// open, and the list is the shared panel. It follows the select-only combobox pattern: focus stays on the
// trigger, the rows are named by aria-activedescendant, arrows, Home, End and Page keys move, letters jump,
// Enter or Space picks, Escape and Tab close. Under md it hands over to the native picker, which phones
// draw better than any panel, styled as the same trigger. A click on the label focuses the trigger without
// opening it. The forced open cell shows the real list in the flow, its highlight and its check.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Field } from "./Field";
import { FIELD_BOX, FIELD_SIZE, FIELD_TONE, fieldTone, type FieldSize } from "./field-styles";
import { forceAttr, forces, type ForceState } from "./force";
import { edge, step, useTypeahead } from "./listbox-keys";
import { SPRING } from "./motion";
import { SelectPanel, type SelectOption } from "./select-panel";
import { ICON_STROKE } from "./token-shape";
import { MEDIA } from "./token-space";
import { useMedia } from "./use-media";

export type { SelectOption } from "./select-panel";
export type SelectForce = ForceState | "open";

export type SelectProps = {
  label: string;
  hideLabel?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  options: readonly SelectOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: FieldSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  /** auto hands over to the native select under md */
  native?: "auto" | "never" | "always";
  /** the guide's form: the panel open in the flow under the trigger, not positioned */
  inline?: boolean;
  /** with inline, the row highlighted at first */
  active?: string;
  /** hover, focus-visible and open show as data-force, disabled as the prop */
  forceState?: SelectForce;
  id?: string;
  className?: string;
};

export function Select({
  label,
  hideLabel,
  helper,
  error,
  optional,
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = "Choose one",
  size = "md",
  disabled: disabledProp,
  readOnly,
  required,
  name,
  native = "auto",
  inline,
  active: activeValue,
  forceState,
  id,
  className = "",
}: SelectProps) {
  const root = useRef<HTMLDivElement>(null);
  const [inner, setInner] = useState<string | null>(defaultValue);
  const [openState, setOpen] = useState(false);
  const [active, setActive] = useState(() => options.findIndex((o) => o.value === activeValue));
  const narrow = useMedia(MEDIA["max-md"]);
  const still = useReducedMotion();
  const find = useTypeahead(options);
  const current = value === undefined ? inner : value;
  const index = options.findIndex((o) => o.value === current);
  const forcedOpen = forceState === "open";
  const pseudo: ForceState | undefined = forceState === "open" ? "focus" : forceState;
  const disabled = !!disabledProp || forces(pseudo, "disabled");
  // the guide's forms: the panel in the flow, held open
  const flow = !!inline || forcedOpen;
  const open = flow || openState;
  const lit = active < 0 && forcedOpen ? (index >= 0 ? index : edge(options, "first")) : active;
  const force = disabled ? undefined : forceAttr(pseudo);
  const s = FIELD_SIZE[size];
  const tone = fieldTone({ disabled, readOnly, invalid: !!error });
  const useNative = !flow && (native === "always" || (native === "auto" && narrow));
  // a disabled box keeps its placeholder in the box's own quiet text, as TextInput's does
  const placeholderTone = index < 0 && !disabled ? "text-(--ds-color-text-muted)" : "";

  useEffect(() => {
    if (!openState) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openState]);

  const pick = (k: number) => {
    const o = options[k];
    if (!o || o.disabled) return;
    if (value === undefined) setInner(o.value);
    onChange?.(o.value);
    setOpen(false);
  };
  const openAt = (k: number) => {
    setActive(k);
    setOpen(true);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    const k = e.key;
    // the keys the list answers stay here, so a page shortcut never fires while choosing
    if (k !== "Tab" && (open || k !== "Escape")) e.stopPropagation();
    if (!open) {
      if (k === "ArrowDown" || k === "Enter" || k === " ") {
        e.preventDefault();
        openAt(index >= 0 ? index : edge(options, "first"));
      } else if (k === "ArrowUp" || k === "Home" || k === "End") {
        e.preventDefault();
        openAt(k === "Home" ? edge(options, "first") : k === "End" || index < 0 ? edge(options, "last") : index);
      } else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const hit = find(k, index);
        if (hit >= 0) openAt(hit);
      }
      return;
    }
    const move = (to: number) => {
      e.preventDefault();
      setActive(to);
    };
    if (k === "ArrowDown") move(step(options, active, 1));
    else if (k === "ArrowUp") move(step(options, active, -1));
    else if (k === "Home") move(edge(options, "first"));
    else if (k === "End") move(edge(options, "last"));
    else if (k === "PageDown") move(step(options, active, 1, 10));
    else if (k === "PageUp") move(step(options, active, -1, 10));
    else if (k === "Enter" || k === " ") {
      e.preventDefault();
      pick(active);
    } else if (k === "Escape" && !flow) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    } else if (k === "Tab" && !flow) setOpen(false);
    else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const hit = find(k, active);
      if (hit >= 0) move(hit);
    }
  };

  const chevron = (turned: boolean) => (
    <motion.span
      aria-hidden
      data-slot="chevron"
      animate={{ rotate: turned ? 180 : 0 }}
      transition={still ? { duration: 0 } : SPRING.pop}
      className={`pointer-events-none flex shrink-0 ${disabled ? "" : readOnly ? "text-(--ds-color-text-quiet)" : "text-(--ds-color-text-muted)"}`}
    >
      <ChevronDown size={16} strokeWidth={ICON_STROKE[16]} />
    </motion.span>
  );

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      optional={optional}
      helper={helper}
      error={error}
      labelAs={useNative ? "label" : "span"}
      id={id}
      className={className}
    >
      {({ id: fieldId, labelId, describedBy, invalid }) => {
        const box = `${FIELD_BOX} ${FIELD_TONE[tone]} ${s.h} ${s.pad} ${s.radius} ${s.text}`;
        if (useNative) {
          return (
            <div data-slot="box" data-force={force} className={box}>
              <select
                id={fieldId}
                name={name}
                value={current ?? ""}
                onChange={(e) => !readOnly && pick(options.findIndex((o) => o.value === e.target.value))}
                disabled={disabled}
                aria-readonly={readOnly || undefined}
                required={required}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                className="absolute inset-0 cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((o) => (
                  <option key={o.value} value={o.value} disabled={o.disabled}>
                    {o.group ? `${o.group}: ${o.label}` : o.label}
                  </option>
                ))}
              </select>
              <span aria-hidden data-slot="value" className={`min-w-0 flex-1 truncate ${placeholderTone}`}>
                {index >= 0 ? options[index].label : placeholder}
              </span>
              {chevron(false)}
            </div>
          );
        }
        const listId = `${fieldId}-list`;
        const valueId = `${fieldId}-value`;
        return (
          <div ref={root} className="relative">
            <button
              type="button"
              id={fieldId}
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open && lit >= 0 ? `${listId}-${lit}` : undefined}
              aria-labelledby={`${labelId} ${valueId}`}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-readonly={readOnly || undefined}
              aria-required={required || undefined}
              disabled={disabled}
              data-slot="box"
              data-force={force}
              onClick={() => !readOnly && (open ? setOpen(false) : openAt(index >= 0 ? index : edge(options, "first")))}
              onKeyDown={onKey}
              className={`${box} text-left outline-none ${readOnly ? "cursor-default" : "cursor-pointer disabled:cursor-not-allowed"}`}
            >
              <span id={valueId} data-slot="value" className={`min-w-0 flex-1 truncate ${placeholderTone}`}>
                {index >= 0 ? options[index].label : placeholder}
              </span>
              {chevron(open)}
            </button>
            <AnimatePresence>
              {open && (
                <SelectPanel
                  id={listId}
                  options={options}
                  active={lit}
                  selected={current}
                  selectFollowsActive
                  onActive={setActive}
                  onPick={pick}
                  inline={flow}
                  labelledBy={labelId}
                />
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </Field>
  );
}
