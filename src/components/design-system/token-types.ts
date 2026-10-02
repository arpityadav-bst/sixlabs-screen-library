// The shapes every token file shares. A token mirrors a value the site ships (its source is a file:line in
// the site) or is one the system adds where the site has none (source "system"). The name has no prefix:
// TokenStyle prints it as --ds-<name>, so nothing on the site can read it.

export type Token = {
  /** the CSS name without the --ds- prefix, for example "color-ink" */
  name: string;
  /** the CSS value, equal to the shipped one */
  value: string;
  /** what the value is, in a few words */
  role: string;
  useFor: string;
  neverFor: string;
  /** the file:line it mirrors (paths from src/), or "system" for an addition */
  source: string;
  /** the Tailwind class the site writes for it, when it writes one */
  utility?: string;
  /** an sRGB hex for an oklch or alpha value, so contrast maths has a plain base */
  srgb?: string;
  /** false keeps a token out of the CSS (a spring or a JS curve has no CSS form) */
  css?: false;
};

/** A media key a responsive step applies at. "base" is no query. */
export type MediaKey =
  | "base"
  | "min-561"
  | "md"
  | "min-901"
  | "lg"
  | "xl"
  | "min-1600"
  | "min-1920"
  | "min-2560"
  | "max-lg"
  | "max-md"
  | "short";

export type TypeStep = {
  at: MediaKey;
  size: string;
  leading?: string;
  tracking?: string;
};

export type TypeRole = {
  /** the role's name, printed as --ds-type-<name>-size and so on */
  name: string;
  family: "display" | "sans" | "mono";
  weight: number;
  /** the base size, leading and tracking, before any step */
  size: string;
  leading: string;
  tracking: string;
  /** uppercase, tabular figures */
  caps?: boolean;
  tabular?: boolean;
  /** sizes, leading and tracking that change at a breakpoint, in cascade order */
  steps?: readonly TypeStep[];
  role: string;
  useFor: string;
  neverFor: string;
  source: string;
  /** the class string the site writes, so the guide can show it */
  classes: string;
};

export type TokenGroup = {
  id: string;
  title: string;
  tokens: readonly Token[];
};

/** A token in one line: name, value, role, use for, never for, source, and any extra fields. */
export function tk(
  name: string,
  value: string,
  role: string,
  useFor: string,
  neverFor: string,
  source: string,
  extra?: Partial<Pick<Token, "utility" | "srgb" | "css">>,
): Token {
  return { name, value, role, useFor, neverFor, source, ...extra };
}

/** The CSS reference for a token name: cssVar("color-ink") is "var(--ds-color-ink)". */
export function cssVar(name: string): string {
  return `var(--ds-${name})`;
}
