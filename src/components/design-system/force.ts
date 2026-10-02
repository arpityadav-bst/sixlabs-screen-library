// Forced states for the StateGrid. A component takes forceState and prints it as data-force, and its
// classes key on data-force as well as on the real pseudo-class, so a forced cell and a real hover, focus
// or press look the same. States that are props (disabled, loading, selected) are applied as the props.

export type ForceState =
  | "rest"
  | "hover"
  | "focus"
  | "focus-visible"
  | "pressed"
  | "disabled"
  | "loading"
  | "selected"
  | "toggled"
  | "remove-hover";

/** The data-force value for a state: focus-visible prints as "focus", rest and prop states print nothing. */
export function forceAttr(state: ForceState | undefined): string | undefined {
  if (!state || state === "rest") return undefined;
  if (state === "focus-visible") return "focus";
  if (state === "disabled" || state === "loading" || state === "selected" || state === "toggled") return undefined;
  return state;
}

/** True when a forced state turns on a prop state ("disabled" forces disabled, and so on). */
export function forces(state: ForceState | undefined, ...names: ForceState[]): boolean {
  return !!state && names.includes(state);
}
