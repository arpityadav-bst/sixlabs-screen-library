"use client";

// Search as a pill: a white field with the field line, a leading glass and, at the right, the shortcut
// chip while it is empty, a clear button once it holds text, or a spinner while results load. It is a
// combobox inside a search landmark. Arrows move through the results, Enter picks, and Escape clears the
// query, which also closes the list, with focus kept in the field. The results reuse the select panel,
// with the matched letters in 500 ink. One polite live region stays mounted beside the field and, once
// typing settles, says how many results there are or that there are none. The shortcut focuses the field
// only when no other handler has claimed the key, and a disabled field shows and binds none.
import { AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { FIELD_BOX, FIELD_INPUT, FIELD_TONE, fieldTone } from "./field-styles";
import { forceAttr, forces, type ForceState } from "./force";
import { IconButton } from "./IconButton";
import { edge, step } from "./listbox-keys";
import { SEARCH_KBD, SEARCH_SIZE, type SearchSize } from "./search-styles";
import { SelectPanel, type SelectOption } from "./select-panel";
import { Spinner } from "./Spinner";
import { ICON_STROKE } from "./token-shape";

export type { SearchSize } from "./search-styles";

export type SearchFieldProps = {
  /** the accessible name. Search rows rarely show a label, so it is visually hidden. */
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** the results for the current query, already filtered by the caller */
  suggestions?: readonly SelectOption[];
  onSelect?: (option: SelectOption) => void;
  size?: SearchSize;
  /** results are on their way: a spinner takes the clear button's place and the field is busy */
  loading?: boolean;
  /** the key that focuses the field from anywhere outside a field, shown as a chip while empty */
  shortcut?: string;
  /** listen for the shortcut on the window (on by default). Off where another control owns the key. */
  bindShortcut?: boolean;
  disabled?: boolean;
  /** the guide's form: the results in the flow under the field, shown while it holds text */
  inline?: boolean;
  /** the keyboard-highlighted result, by index, for the guide's results state. The field owns it when unset */
  active?: number;
  /** hover and focus show as data-force, disabled and loading as props */
  forceState?: ForceState;
  className?: string;
};

export function SearchField({
  label,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Search",
  suggestions = [],
  onSelect,
  size = "md",
  loading: loadingProp,
  shortcut,
  bindShortcut = true,
  disabled: disabledProp,
  inline,
  active: activeProp,
  forceState,
  className = "",
}: SearchFieldProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [activeState, setActive] = useState(-1);
  const active = activeProp ?? activeState;
  const [picked, setPicked] = useState(false);
  const [said, setSaid] = useState("");
  const query = value ?? inner;
  const disabled = !!disabledProp || forces(forceState, "disabled");
  const loading = !!loadingProp || forces(forceState, "loading");
  const force = disabled ? undefined : forceAttr(forceState);
  const s = SEARCH_SIZE[size];
  const open = !disabled && !loading && query.trim() !== "" && !picked && (focused || !!inline);
  const listId = `s${uid}-list`;
  const listed = open && suggestions.length > 0;
  const count = suggestions.length;

  // the answer, written once typing settles, so a screen reader hears it once and not on every key
  useEffect(() => {
    const q = query.trim();
    const text = !q || loading || disabled ? "" : count ? `${count} result${count === 1 ? "" : "s"}` : `No results for "${q}"`;
    const t = window.setTimeout(() => setSaid(text), 500);
    return () => window.clearTimeout(t);
  }, [query, count, loading, disabled]);

  useEffect(() => {
    if (!shortcut || !bindShortcut || disabled) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key !== shortcut || typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = input.current;
      el?.focus();
      // the key is taken only once the field holds focus, so a hidden or held field leaves it alone
      if (el && document.activeElement === el) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut, bindShortcut, disabled]);

  const set = (v: string) => {
    if (value === undefined) setInner(v);
    setActive(-1);
    setPicked(false);
    onChange?.(v);
  };
  const pick = (k: number) => {
    const o = suggestions[k];
    if (!o || o.disabled) return;
    set(o.label);
    onSelect?.(o);
    setPicked(true);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && query) {
      e.preventDefault();
      e.stopPropagation();
      set("");
    } else if (open && e.key === "ArrowDown") {
      e.preventDefault();
      setActive(step(suggestions, active, 1));
    } else if (open && e.key === "ArrowUp") {
      e.preventDefault();
      setActive(active < 0 ? edge(suggestions, "last") : step(suggestions, active, -1));
    } else if (open && e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(active);
    }
    // typed keys stay in the field, so a page shortcut (the floor's R) never fires mid-word
    e.stopPropagation();
  };

  const tone = fieldTone({ disabled });
  const filled = query !== "";
  return (
    <div role="search" aria-label={label} className={`relative min-w-0 ${className}`} data-slot="search">
      <label id={`s${uid}-label`} htmlFor={`s${uid}`} className="sr-only">
        {label}
      </label>
      <div
        data-slot="box"
        data-force={force}
        aria-busy={loading || undefined}
        onMouseDown={(e) => {
          if (e.target !== input.current && !disabled && !(e.target as HTMLElement).closest("button")) {
            e.preventDefault();
            input.current?.focus();
          }
        }}
        className={`group/search ${FIELD_BOX} ${FIELD_TONE[tone]} ${s.h} ${s.pad} ${s.text} rounded-full`}
      >
        <Search
          aria-hidden
          data-slot="icon"
          size={s.icon}
          strokeWidth={ICON_STROKE[s.icon]}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${s.at} ${disabled ? "" : "text-(--ds-color-text-muted)"}`}
        />
        <input
          ref={input}
          id={`s${uid}`}
          data-slot="value"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listed ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          aria-keyshortcuts={shortcut && bindShortcut && !disabled ? shortcut : undefined}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => set(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKey}
          className={FIELD_INPUT}
        />
        <span data-slot="trailing" className={`flex shrink-0 items-center ${s.end}`}>
          {loading ? (
            <span className="grid h-7 w-7 place-items-center text-(--ds-color-text-muted)">
              <Spinner size={size === "lg" ? 16 : 12} delay={0} decorative />
            </span>
          ) : filled ? (
            <IconButton
              icon={X}
              label="Clear search"
              size="xs"
              variant="ghost"
              disabled={disabled}
              onClick={() => {
                set("");
                input.current?.focus();
              }}
              className="text-(--ds-color-text-muted)"
            />
          ) : shortcut && !disabled ? (
            <kbd
              aria-hidden
              data-slot="shortcut"
              className={`${SEARCH_KBD} mr-1.5 group-focus-within/search:invisible group-data-[force=focus]/search:invisible`}
            >
              {shortcut}
            </kbd>
          ) : null}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <SelectPanel
            id={listId}
            options={suggestions}
            active={active}
            onActive={setActive}
            onPick={pick}
            match={query}
            inline={inline}
            labelledBy={`s${uid}-label`}
            empty={`No results for "${query.trim()}"`}
          />
        )}
      </AnimatePresence>
      <p role="status" aria-live="polite" className="sr-only" data-slot="announce">
        {said}
      </p>
    </div>
  );
}
