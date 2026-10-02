"use client";

// Jump to a section by name, by a part it shows (every cover's export and site id), by a token's name
// (--ds-color-ink-30, radius-xl) or by a rule's word (z-index, accent rule): jump-hay.ts builds the haystack
// from the catalog and the token list, so it lists what the nav lists, and a match found through anything but
// the section's own words names it on the option's right. "/" focuses it from anywhere outside a field (and
// only claims the key when it took focus). Its keys never reach window listeners (the floor resets on R). One
// status line, always mounted, says how many sections match once typing settles. Picking a section moves focus
// to its heading. Escape clears the query and closes the list, and on an empty field it keeps focus there in
// the toolbar, or lets the drawer take it and close. The toolbar holds one, and under 600px the drawer another.
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { CatalogSection } from "../_data/catalog";
import { goTo } from "./go";
import { matches } from "./jump-hay";

const MAX = 8;
const SETTLE_MS = 500;

const editable = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function Jump({ onPick }: { onPick?: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => matches(q, MAX), [q]);
  const shown = open && q.trim().length > 0;

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "/" || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || editable(e.target)) return;
      const el = input.current;
      if (!el) return;
      el.focus();
      // a field hidden at this width, or inert behind the drawer, does not take focus, so the key stays a key
      if (document.activeElement === el) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // the count, said once typing settles
  useEffect(() => {
    const text = !q.trim() ? "" : results.length ? `${results.length} ${results.length === 1 ? "section matches" : "sections match"}` : "No section matches";
    const id = window.setTimeout(() => setSaid(text), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [q, results.length]);

  const pick = (s: CatalogSection) => {
    setQ("");
    setOpen(false);
    if (onPick) onPick(s.id);
    else goTo(s.id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + results.length) % results.length);
      setOpen(true);
    } else if (e.key === "Enter") {
      const h = results[active] ?? results[0];
      if (h) pick(h.s);
    } else if (e.key === "Escape") {
      // with a query or an open list, Escape only clears it: the drawer (a modal dialog) must not close too
      if (q || shown) {
        e.preventDefault();
        setQ("");
        setOpen(false);
        return;
      }
      setOpen(false);
      // an empty field keeps focus in the toolbar, and in the drawer lets the dialog take the key and close
      if (!input.current?.closest("dialog")) e.preventDefault();
    }
  };

  return (
    <div className="ds-jump">
      <label className="ds-sr" htmlFor={`${listId}-input`}>
        Jump to a section or a part
      </label>
      <Search className="ds-jump-icon" size={14} strokeWidth={2} aria-hidden="true" />
      <input
        ref={input}
        id={`${listId}-input`}
        className="ds-jump-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="Jump to"
        role="combobox"
        aria-expanded={shown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-keyshortcuts="/"
        aria-activedescendant={shown && results[active] ? `${listId}-${results[active].s.id}` : undefined}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => e.stopPropagation()}
      />
      {!q && (
        <kbd className="ds-jump-key" aria-hidden="true">
          /
        </kbd>
      )}
      <span className="ds-sr" role="status" aria-live="polite">
        {said}
      </span>
      {shown && results.length === 0 && (
        <p id={listId} className="ds-jump-list ds-jump-none">
          No section matches
        </p>
      )}
      {shown && results.length > 0 && (
        <ul id={listId} className="ds-jump-list" role="listbox" aria-label="Sections">
          {results.map(({ s, part }, i) => (
            <li
              key={s.id}
              id={`${listId}-${s.id}`}
              role="option"
              aria-selected={i === active}
              className="ds-jump-opt"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(s)}
            >
              {s.title}
              <span>{part ?? s.groupTitle}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
