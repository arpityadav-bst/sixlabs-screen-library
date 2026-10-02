"use client";

// The list panel Select and SearchField share, built on the language menu's (LanguageMenu.tsx:78-109)
// without its blur: solid white, a 70% hairline, radius 16, 6px in, the pop shadow. It opens from the
// trigger's edge on the pop spring with the rows following 35ms apart, and closes in 140ms. The active
// row's grey highlight glides between rows and is kept in view as it moves (the panel scrolls, never the
// page). Selected rows are 500 ink with a check, disabled rows sit at 40% and are skipped. Under reduced
// motion it only fades. An empty answer is shown here, and the field that owns the panel announces it. In
// Select's select-only combobox aria-selected follows the active row, as the pattern asks, while the check
// and the weight stay on the committed value. SearchField's results keep aria-selected on the value.
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { DUR, SCALE, SPRING } from "./motion";
import { EASE_IN } from "./overlay-motion";
import { ICON_STROKE } from "./token-shape";

export type SelectOption = {
  value: string;
  label: string;
  /** a short code column, as the language menu's US / KR */
  code?: string;
  disabled?: boolean;
  /** rows with the same group sit under one caps label */
  group?: string;
};

const PANEL = {
  hidden: { opacity: 0, scale: SCALE.panel, y: -8 },
  shown: { opacity: 1, scale: 1, y: 0, transition: { ...SPRING.pop, staggerChildren: 0.035, delayChildren: 0.04 } },
  gone: { opacity: 0, scale: SCALE.panel, y: -4, transition: { duration: DUR.exit, ease: EASE_IN } },
};
const ROW = { hidden: { opacity: 0, y: -4 }, shown: { opacity: 1, y: 0, transition: SPRING.pop } };
const FADE = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DUR.ui } },
  gone: { opacity: 0, transition: { duration: DUR.exit } },
};
const STILL_ROW = { hidden: { opacity: 1 }, shown: { opacity: 1 } };

export const PANEL_BOX =
  "z-(--ds-z-popover) max-h-80 w-full overflow-y-auto rounded-(--ds-radius-sm) border border-(--ds-color-line-soft) " +
  "bg-(--ds-color-surface) p-1.5 shadow-(--ds-shadow-pop)";

export type SelectPanelProps = {
  /** the listbox id. Each option is `${id}-${index}`. */
  id: string;
  options: readonly SelectOption[];
  /** the highlighted row, -1 for none */
  active: number;
  selected?: string | null;
  /** Select: aria-selected marks the active row (the one aria-activedescendant names) */
  selectFollowsActive?: boolean;
  onActive: (index: number) => void;
  onPick: (index: number) => void;
  /** search: the matched part of each label is set in 500 ink */
  match?: string;
  /** shown in place of the list when options is empty. The owner announces it in its own live region. */
  empty?: ReactNode;
  /** in the flow under its trigger, for the guide. Otherwise absolute, 8px below. */
  inline?: boolean;
  labelledBy?: string;
  /** where it grows from */
  origin?: "top" | "top right";
  className?: string;
};

function Marked({ text, match }: { text: string; match?: string }) {
  const q = match?.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (!q || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span data-slot="match" className="font-medium text-(--ds-color-ink)">
        {text.slice(at, at + q.length)}
      </span>
      {text.slice(at + q.length)}
    </>
  );
}

export function SelectPanel({
  id,
  options,
  active,
  selected,
  selectFollowsActive = false,
  onActive,
  onPick,
  match,
  empty,
  inline,
  labelledBy,
  origin = "top",
  className = "",
}: SelectPanelProps) {
  const still = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  // keep the active row in view inside the panel, at once, without scrolling the page round it
  useEffect(() => {
    const el = box.current;
    const row = active >= 0 ? document.getElementById(`${id}-${active}`) : null;
    if (!el || !row || !el.contains(row)) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (bottom > el.scrollTop + el.clientHeight) el.scrollTop = bottom - el.clientHeight;
  }, [active, id]);
  const place = inline ? "relative mt-2" : "absolute left-0 right-0 top-full mt-2";
  const groups: { name?: string; rows: { o: SelectOption; k: number }[] }[] = [];
  options.forEach((o, k) => {
    const last = groups[groups.length - 1];
    if (last && last.name === o.group) last.rows.push({ o, k });
    else groups.push({ name: o.group, rows: [{ o, k }] });
  });

  const row = ({ o, k }: { o: SelectOption; k: number }) => {
    const on = o.value === selected;
    return (
      <motion.li
        key={o.value}
        id={`${id}-${k}`}
        role="option"
        aria-selected={selectFollowsActive ? k === active : on}
        aria-disabled={o.disabled || undefined}
        data-slot="option"
        data-active={k === active || undefined}
        variants={still ? STILL_ROW : ROW}
        onPointerEnter={() => !o.disabled && onActive(k)}
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => !o.disabled && onPick(k)}
        className={
          "relative flex select-none items-center gap-3 rounded-(--ds-radius-xs) px-3 py-2.5 font-sans text-[15px] leading-[22px] " +
          (o.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer")
        }
      >
        {k === active && !o.disabled && (
          <motion.span
            layoutId={`${id}-highlight`}
            transition={still ? { duration: 0 } : SPRING.pop}
            data-slot="highlight"
            className="absolute inset-0 rounded-(--ds-radius-xs) bg-(--ds-color-fill-highlight)"
          />
        )}
        {o.code && (
          <span className="relative w-6 text-[11px] font-semibold tracking-wide text-(--ds-color-text-muted)">{o.code}</span>
        )}
        <span
          className={
            "relative min-w-0 flex-1 truncate " +
            (on ? "font-medium text-(--ds-color-ink)" : "text-(--ds-color-text-body)")
          }
        >
          <Marked text={o.label} match={match} />
        </span>
        {on && (
          <Check aria-hidden data-slot="check" size={16} strokeWidth={ICON_STROKE[16]} className="relative shrink-0 text-(--ds-color-ink)" />
        )}
      </motion.li>
    );
  };

  return (
    <motion.div
      ref={box}
      data-slot="panel"
      variants={still ? FADE : PANEL}
      initial={inline ? false : "hidden"}
      animate="shown"
      exit="gone"
      style={{ transformOrigin: origin }}
      className={`${PANEL_BOX} ${place} ${className}`}
    >
      {options.length === 0 ? (
        <p data-slot="empty" className="px-3 py-2.5 font-sans text-[15px] leading-[22px] text-(--ds-color-text-muted)">
          {empty}
        </p>
      ) : (
        <ul role="listbox" id={id} aria-labelledby={labelledBy}>
          {groups.map((g, gi) =>
            g.name ? (
              <li key={`${g.name}-${gi}`} role="none">
                <span
                  id={`${id}-g${gi}`}
                  data-slot="group"
                  className="block px-3 pb-1 pt-2.5 font-sans text-[11px] font-medium uppercase leading-4 tracking-[0.14em] text-(--ds-color-text-muted)"
                >
                  {g.name}
                </span>
                <ul role="group" aria-labelledby={`${id}-g${gi}`}>
                  {g.rows.map(row)}
                </ul>
              </li>
            ) : (
              <Fragment key={`rows-${gi}`}>{g.rows.map(row)}</Fragment>
            ),
          )}
        </ul>
      )}
    </motion.div>
  );
}
