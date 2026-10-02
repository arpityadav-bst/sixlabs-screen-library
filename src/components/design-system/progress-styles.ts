// The progress family's colours per ground and status, shared by the bar and the circle. Light is ink
// at 8% under a navy fill, blue is the trait bar's white on white 20%, dark is the terminal's white 40%
// on white 8%. Complete and error take the status colours, which on blue stay white because the label
// carries the status there. Paused on light is the muted text, so the amount done still reads. On blue
// the label row is full white, the most the accent allows (4.49:1).

export type ProgressVariant = "light" | "blue" | "dark";
export type ProgressStatus = "complete" | "error" | "paused";

export const RAIL: Record<ProgressVariant, string> = {
  light: "var(--ds-color-ink-08)",
  blue: "var(--ds-color-on-blue-20)",
  dark: "var(--ds-color-terminal-track)",
};

const FILL: Record<ProgressVariant, string> = {
  light: "var(--ds-color-primary)",
  blue: "var(--ds-color-surface)",
  dark: "var(--ds-color-terminal-fill)",
};

const STATUS_FILL: Record<ProgressStatus, Record<ProgressVariant, string>> = {
  complete: { light: "var(--ds-color-success)", blue: "var(--ds-color-surface)", dark: "var(--ds-color-success-on-dark)" },
  error: { light: "var(--ds-color-danger)", blue: "var(--ds-color-surface)", dark: "var(--ds-color-danger-on-dark)" },
  paused: { light: "var(--ds-color-text-muted)", blue: "var(--ds-color-on-blue-50)", dark: "var(--ds-color-on-blue-20)" },
};

export function fillColour(variant: ProgressVariant, status?: ProgressStatus): string {
  return status ? STATUS_FILL[status][variant] : FILL[variant];
}

/** The label row's type colours. */
export const LABEL: Record<ProgressVariant, { name: string; value: string }> = {
  light: { name: "text-(--ds-color-ink)", value: "text-(--ds-color-text-muted)" },
  blue: { name: "text-white", value: "text-white" },
  // the value is read ("35%", "Failed at 60%"), so it takes on-blue-75 as the name does, never the quiet 50
  dark: { name: "text-(--ds-color-on-blue-75)", value: "text-(--ds-color-on-blue-75)" },
};

const SAID: Record<ProgressStatus, string> = { complete: "Complete", error: "Failed", paused: "Paused" };

/** What the value slot and aria-valuetext say: "35%", "Complete", "Failed at 60%", "Paused at 35%". */
export function valueText(pct: number, status?: ProgressStatus, indeterminate?: boolean): string {
  if (status === "complete") return SAID.complete;
  if (indeterminate) return status ? SAID[status] : "Working";
  if (status) return `${SAID[status]} at ${pct}%`;
  return `${pct}%`;
}
