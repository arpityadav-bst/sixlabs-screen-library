// Roving focus for a row of options (Segmented and Tabs): one tab stop, the arrows move between the
// enabled options and wrap, Home and End jump to the ends. Disabled options are skipped.

export type RovingItem<T extends string> = { id: T; disabled?: boolean };

/** The id the row's one tab stop sits on: the selected option, or the first enabled one. */
export function tabStop<T extends string>(items: readonly RovingItem<T>[], value: T | null): T | undefined {
  const on = items.find((o) => o.id === value && !o.disabled);
  return on?.id ?? items.find((o) => !o.disabled)?.id;
}

/** The id a key moves to from `from`, or undefined when the key is not a roving key. */
export function rovingTarget<T extends string>(
  items: readonly RovingItem<T>[],
  from: T | undefined,
  key: string,
  vertical = false,
): T | undefined {
  const enabled = items.filter((o) => !o.disabled);
  if (!enabled.length) return undefined;
  if (key === "Home") return enabled[0].id;
  if (key === "End") return enabled[enabled.length - 1].id;
  const step =
    key === "ArrowRight" || (vertical && key === "ArrowDown")
      ? 1
      : key === "ArrowLeft" || (vertical && key === "ArrowUp")
        ? -1
        : 0;
  if (!step) return undefined;
  const at = Math.max(0, enabled.findIndex((o) => o.id === from));
  return enabled[(at + step + enabled.length) % enabled.length].id;
}
