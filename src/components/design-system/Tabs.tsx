"use client";

// Line tabs for switching panels in place. The list is one row on a hairline, the selected tab carries a
// 2px navy indicator as wide as its label that slides on the thumb spring, and the row scrolls sideways
// on its own when it runs out of room, bringing the selected tab into view. One tab stop: the arrows
// move along the row (and choose, unless activation is manual), Home and End jump, disabled tabs are
// skipped. Panels cross-fade with a 4px rise. Panels that live elsewhere are named with tabId and controls.
// Tabs that control no panel, neither their own nor named, are a Segmented, as are short switches of two
// to four options.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge } from "./Badge";
import { FOCUS, FOCUS_INSET } from "./focus";
import { forceAttr, type ForceState } from "./force";
import { DUR, EASE, SPRING } from "./motion";
import { rovingTarget, tabStop } from "./roving";
import { TAB, TAB_INDICATOR, TAB_LABEL, TAB_LIST, TAB_SIZE, type TabsSize } from "./tabs-styles";
import { ICON_STROKE } from "./token-shape";

export type { TabsSize } from "./tabs-styles";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  icon?: LucideIcon;
  /** a quiet count after the label */
  count?: number;
  disabled?: boolean;
};

export type TabsProps<T extends string> = {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** the tab list's accessible name */
  label: string;
  size?: TabsSize;
  /** auto: the arrows choose. manual: the arrows move focus, Enter or Space chooses */
  activation?: "auto" | "manual";
  /** the panel for each tab, cross-faded under the list */
  panels?: Partial<Record<T, ReactNode>>;
  /** with panels outside Tabs: each tab's id (for the panel's aria-labelledby) and the panel it controls */
  tabId?: (id: T) => string;
  controls?: (id: T) => string;
  /** the indicator's layoutId, unique per instance by default */
  indicatorId?: string;
  /** a StateGrid cell: hover and pressed show on forceOn (the first other tab by default), focus-visible
   * on the selected tab */
  forceState?: ForceState;
  forceOn?: T;
  className?: string;
};

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  size = "md",
  activation = "auto",
  panels,
  tabId: tabIdProp,
  controls,
  indicatorId,
  forceState,
  forceOn,
  className = "",
}: TabsProps<T>) {
  const uid = useId();
  const still = useReducedMotion();
  const list = useRef<HTMLDivElement>(null);
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const placed = useRef(false);
  const [focusId, setFocusId] = useState<T | null>(null);
  const force = forceAttr(forceState);
  const target = force === "focus" ? value : (forceOn ?? items.find((t) => t.id !== value && !t.disabled)?.id);
  const stop = tabStop(items, focusId ?? value);
  const s = TAB_SIZE[size];
  const tabId = (id: T) => tabIdProp?.(id) ?? `${uid}-tab-${id}`;
  const panelId = (id: T) => `${uid}-panel-${id}`;

  // bring the selected tab into view inside the list, never by scrolling the page
  useEffect(() => {
    const row = list.current;
    const tab = refs.current.get(value);
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const behavior = placed.current && !still ? "smooth" : "auto";
    placed.current = true;
    const left = tab.offsetLeft - 16;
    const right = tab.offsetLeft + tab.offsetWidth + 16;
    if (left < row.scrollLeft) row.scrollTo({ left, behavior });
    else if (right > row.scrollLeft + row.clientWidth) row.scrollTo({ left: right - row.clientWidth, behavior });
  }, [value, still]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = items.find((t) => refs.current.get(t.id) === e.target)?.id ?? value;
    const next = rovingTarget(items, from, e.key);
    if (next === undefined) return;
    e.preventDefault();
    e.stopPropagation();
    refs.current.get(next)?.focus();
    setFocusId(next);
    if (activation === "auto" && next !== value) onChange(next);
  };

  const panel = panels?.[value];

  return (
    <div className={className}>
      <div
        ref={list}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusId(null);
        }}
        className={`${TAB_LIST} ${s.gap}`}
      >
        {items.map((t) => {
          const on = t.id === value;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              ref={(el) => {
                if (el) refs.current.set(t.id, el);
                else refs.current.delete(t.id);
              }}
              type="button"
              role="tab"
              id={tabId(t.id)}
              aria-selected={on}
              aria-controls={panels ? (on ? panelId(t.id) : undefined) : controls?.(t.id)}
              tabIndex={t.id === stop ? 0 : -1}
              disabled={t.disabled}
              data-force={t.id === target ? force : undefined}
              onFocus={() => setFocusId(t.id)}
              onClick={() => !on && onChange(t.id)}
              className={`${TAB} ${s.tab} ${FOCUS_INSET}`}
            >
              <span className={TAB_LABEL}>
                {Icon && <Icon aria-hidden size={s.icon} strokeWidth={ICON_STROKE[s.icon]} className="shrink-0" />}
                {/* the 500 label reserves its width at rest, so choosing a tab never shifts the row */}
                <span className="grid">
                  <span className={`col-start-1 row-start-1 ${on ? "font-medium" : ""}`}>{t.label}</span>
                  <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
                    {t.label}
                  </span>
                </span>
                {t.count !== undefined && <Badge size="sm">{t.count}</Badge>}
              </span>
              {on && (
                <motion.span
                  aria-hidden
                  layoutId={indicatorId ?? `ds-tabs-${uid}`}
                  className={TAB_INDICATOR}
                  transition={still ? { duration: 0 } : SPRING.thumb}
                />
              )}
            </button>
          );
        })}
      </div>
      {panels && (
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={value}
              role="tabpanel"
              id={panelId(value)}
              aria-labelledby={tabId(value)}
              tabIndex={0}
              initial={{ opacity: 0, y: still ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: DUR.exit } }}
              transition={{ duration: DUR.ui, ease: EASE }}
              className={`rounded-(--ds-radius-mark) pt-5 ${FOCUS}`}
            >
              {panel}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
