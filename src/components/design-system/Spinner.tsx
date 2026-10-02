// A loading ring in the site's own form (the wave button's: a currentColor ring with a transparent top),
// on one size ladder. It waits 300ms before it shows, so a quick load never flashes it. Standalone it is a
// polite status with a hidden label. Inside a busy control it is decorative, and the control carries
// aria-busy. Under reduced motion it turns at 1.5s a turn, slow enough to read as calm. The border weight
// per size is read from the busy-ring table in token-shape.ts.
import styles from "./atoms.module.css";
import { SPINNER_BORDER } from "./token-shape";

export type SpinnerSize = 8 | 12 | 16 | 20 | 24;
export type SpinnerTone = "inherit" | "quiet" | "onDark";

const SIZE: Record<SpinnerSize, string> = {
  8: "h-2 w-2",
  12: "h-3 w-3",
  16: "h-4 w-4",
  20: "h-5 w-5",
  24: "h-6 w-6",
};

const TONE: Record<SpinnerTone, string> = {
  inherit: "",
  quiet: "text-(--ds-color-text-quiet)",
  onDark: "text-(--ds-color-on-blue-80)",
};

export type SpinnerProps = {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** ms before it shows, 300 by default, 0 to show at once */
  delay?: number;
  /** the hidden status text when standalone */
  label?: string;
  /** inside a busy control: aria-hidden, no status role */
  decorative?: boolean;
  className?: string;
};

export function Spinner({
  size = 16,
  tone = "inherit",
  delay = 300,
  label = "Loading",
  decorative = false,
  className = "",
}: SpinnerProps) {
  const ring = (
    <span
      aria-hidden
      style={{ borderWidth: SPINNER_BORDER[size], borderStyle: "solid" }}
      className={
        "block shrink-0 animate-spin rounded-full border-current border-t-transparent " +
        "motion-reduce:animate-[spin_1.5s_linear_infinite] " +
        SIZE[size] + " " + TONE[tone]
      }
    />
  );
  const wait = delay > 0 ? styles["ds-delay-in"] : "";
  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined;
  if (decorative) {
    return (
      <span aria-hidden className={`inline-flex ${wait} ${className}`} style={style}>
        {ring}
      </span>
    );
  }
  return (
    <span role="status" className={`inline-flex ${wait} ${className}`} style={style}>
      {ring}
      <span className="sr-only">{label}</span>
    </span>
  );
}
